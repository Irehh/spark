export interface UserProfile {
  id: string;
  name: string;
  age: number;
  bio: string;
  images: string[];
  location: string;
  interests: string[];
  verified: boolean;
  prompts: { question: string; answer: string }[];
  subscriptionTier?: 'free' | 'premium' | 'vip';
}

export interface Match {
  id: string;
  user: UserProfile;
  timestamp: string;
}

export interface Message {
  id: string;
  matchId: string;
  text: string;
  senderId: 'me' | 'them';
  timestamp: string;
}

export interface Notification {
  id: string;
  type: 'like' | 'match' | 'message' | 'safety';
  title: string;
  content: string;
  timestamp: string;
  read: boolean;
}
