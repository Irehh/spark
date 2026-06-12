import MockAdapter from 'axios-mock-adapter';
import { AxiosInstance } from 'axios';
import { UserProfile, Match, Message } from '../types';

export const setupMockApi = (api: AxiosInstance) => {
  // Only enable mock if the env variable is explicitly 'true'
  if (import.meta.env.VITE_USE_MOCK !== 'true') {
    return;
  }

  console.log('Mock API enabled. Intercepting axios requests...');
  const mock = new MockAdapter(api, { delayResponse: 800 }); // simulated 800ms network delay

  const profiles: UserProfile[] = [
    {
      id: '1',
      name: 'Elena',
      age: 26,
      bio: 'Architect & Jazz lover. I believe in concrete buildings and abstract art.',
      images: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800'],
      location: 'Barcelona, Spain',
      interests: ['Architecture', 'Jazz', 'Red Wine'],
      verified: true,
      prompts: [{ question: 'My favorite way to spend a Sunday...', answer: 'Lost in an old bookstore.' }]
    },
    {
      id: '2',
      name: 'Kenji',
      age: 29,
      bio: 'Sushi chef and marathon runner. Always chasing the perfect sunrise.',
      images: ['https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800'],
      location: 'Tokyo, Japan',
      interests: ['Culinary', 'Running', 'Photography'],
      verified: true,
      prompts: [{ question: 'The first thing I notice about people is...', answer: 'Their choice of sneakers.' }]
    },
    {
      id: '3',
      name: 'Amara',
      age: 24,
      bio: 'Wildlife biologist in the daytime, salsa dancer at night.',
      images: ['https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=800'],
      location: 'Nairobi, Kenya',
      interests: ['Nature', 'Dance', 'Sustainability'],
      verified: true,
      prompts: [{ question: 'If I could travel anywhere right now...', answer: 'The Galapagos Islands.' }]
    }
  ];

  let matches: Match[] = [];
  let chatMessages: Message[] = [];

  // Mock Discovery Profiles
  mock.onGet('/discovery').reply(200, profiles);

  // Mock Like Interaction
  mock.onPost('/discovery/like').reply((config) => {
    const { targetId } = JSON.parse(config.data);
    const isMatch = Math.random() > 0.5; // 50% match rate in mock
    
    if (isMatch) {
      const matchedProfile = profiles.find(p => p.id === targetId) as UserProfile;
      const newMatch: Match = {
        id: Math.random().toString(36).substr(2, 9),
        user: matchedProfile,
        timestamp: new Date().toISOString()
      };
      matches.push(newMatch);
      return [200, { status: 'match', match: newMatch }];
    }
    return [200, { status: 'liked' }];
  });

  // Mock Matches list
  mock.onGet('/matches').reply(() => [200, matches]);

  // Mock specific Chat
  mock.onGet(/\/chat\/.+/).reply((config) => {
    const urlParts = config.url?.split('/') || [];
    const matchId = urlParts[urlParts.length - 1];
    const msgs = chatMessages.filter(m => m.matchId === matchId);
    return [200, msgs];
  });

  // Mock Send Message
  mock.onPost('/chat/send').reply((config) => {
    const { matchId, text } = JSON.parse(config.data);
    const newMessage: Message = {
      id: Date.now().toString(),
      matchId,
      text,
      senderId: 'me',
      timestamp: new Date().toISOString()
    };
    chatMessages.push(newMessage);

    // Simulate their reply a bit later if we want, but since axios-mock-adapter is synchronous to replies,
    // we just push the reply now so it'll show up later when fetched, 
    // or rely on sockets for real-time. We'll just push it.
    setTimeout(() => {
      chatMessages.push({
        id: (Date.now() + 1).toString(),
        matchId,
        text: 'Ah nice! I completely agree.',
        senderId: 'them',
        timestamp: new Date().toISOString()
      });
    }, 2000);

    return [200, newMessage];
  });

  // Mock Auth Login
  mock.onPost('/auth/login').reply(200, {
    access_token: 'mock-token-abc',
    user: {
      id: 'me',
      fullName: 'Mock User',
      email: 'mock@example.com'
    }
  });

  // Mock Auth Register
  mock.onPost('/auth/register').reply(201, {
    message: 'Registered successfully via mock'
  });

  // Pass-through anything else so real API requests can still be attempted if they miss mock routes
  mock.onAny().passThrough();
};
