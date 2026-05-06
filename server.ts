import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- DUMMY DATA ---
  const profiles = [
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
    },
    {
      id: '4',
      name: 'Liam',
      age: 31,
      bio: 'Software engineer who prefers hardware and vinyl records.',
      images: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800'],
      location: 'London, UK',
      interests: ['Tech', 'Vinyl', 'Cycling'],
      verified: false,
      prompts: [{ question: 'My simple pleasure...', answer: 'The smell of fresh espresso.' }]
    },
    {
      id: '5',
      name: 'Sofia',
      age: 27,
      bio: 'Digital nomad and surfer. Looking for someone to share sunsets with.',
      images: ['https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800'],
      location: 'Bali, Indonesia',
      interests: ['Surfing', 'Yoga', 'Travel'],
      verified: true,
      prompts: [{ question: 'I am most productive when...', answer: 'The waves are small.' }]
    },
    {
      id: '6',
      name: 'Mateo',
      age: 30,
      bio: 'Professional cellist and amateur baker. Flour on my apron, music in my heart.',
      images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800'],
      location: 'Buenos Aires, Argentina',
      interests: ['Music', 'Baking', 'Philosophy'],
      verified: true,
      prompts: [{ question: 'What makes a first date great...', answer: 'Losing track of time.' }]
    },
    {
      id: '7',
      name: 'Chloe',
      age: 25,
      bio: 'Fashion researcher with a passion for vintage textiles and old films.',
      images: ['https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800'],
      location: 'Paris, France',
      interests: ['Fashion', 'Cinema', 'Wine'],
      verified: true,
      prompts: [{ question: 'The secret to my heart...', answer: 'A well-made croissant.' }]
    },
    {
      id: '8',
      name: 'Arjun',
      age: 28,
      bio: 'Space enthusiast and amateur astronomer. Let\'s watch the stars.',
      images: ['https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=800'],
      location: 'Mumbai, India',
      interests: ['Astronomy', 'Spices', 'History'],
      verified: false,
      prompts: [{ question: 'My most useless talent...', answer: 'Identifying constellations from my balcony.' }]
    },
    {
      id: '9',
      name: 'Sasha',
      age: 24,
      bio: 'Graphic designer exploring the intersection of digital and analog.',
      images: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800'],
      location: 'Berlin, Germany',
      interests: ['Design', 'Techno', 'Art'],
      verified: true,
      prompts: [{ question: 'I find inspiration in...', answer: 'Brutalist architecture.' }]
    },
    {
      id: '10',
      name: 'David',
      age: 32,
      bio: 'Adventurer, rock climber, and occasional poet.',
      images: ['https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&q=80&w=800'],
      location: 'Vancouver, Canada',
      interests: ['Climbing', 'Poetry', 'Forests'],
      verified: true,
      prompts: [{ question: 'My bucket list includes...', answer: 'Climbing the Nose on El Capitan.' }]
    }
  ];

  let matches: any[] = [];
  let chatMessages: any[] = [];

  // --- API ROUTES ---
  app.get('/api/discovery', (req, res) => {
    // Return profiles not yet liked/disliked (simplified for demo)
    res.json(profiles);
  });

  app.post('/api/interactions/like', (req, res) => {
    const { targetId } = req.body;
    // Simulate a match logic (50% chance for dummy profiles)
    const isMatch = Math.random() > 0.5;
    if (isMatch) {
      const match = {
        id: Math.random().toString(36).substr(2, 9),
        user: profiles.find(p => p.id === targetId),
        timestamp: new Date()
      };
      matches.push(match);
      res.json({ status: 'match', match });
    } else {
      res.json({ status: 'liked' });
    }
  });

  app.get('/api/matches', (req, res) => {
    res.json(matches);
  });

  app.get('/api/chat/:matchId', (req, res) => {
    const messages = chatMessages.filter(m => m.matchId === req.params.matchId);
    res.json(messages);
  });

  app.post('/api/chat/send', (req, res) => {
    const { matchId, text } = req.body;
    const newMessage = { id: Date.now().toString(), matchId, text, senderId: 'me', timestamp: new Date() };
    chatMessages.push(newMessage);

    // Simulate reply
    setTimeout(() => {
      const reply = {
        id: (Date.now() + 1).toString(),
        matchId,
        text: `Hey! That sounds interesting. I'm ${profiles.find(p => p.id === (matches.find(m => m.id === matchId)?.user?.id))?.name || 'someone'} btw.`,
        senderId: 'them',
        timestamp: new Date()
      };
      chatMessages.push(reply);
    }, 2000);

    res.json(newMessage);
  });

  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Spark Server running on http://localhost:${PORT}`);
  });
}

startServer();
