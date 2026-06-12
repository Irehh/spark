import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ChevronLeft, Shield, MoreVertical, Phone, Video, Info, MessageCircle, Heart, ShieldCheck } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { useStore } from '../store/useStore';
import { Message } from '../types';
import api from '../lib/api';

const ChatPage = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const { matches, sendChatMessage } = useStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);


  const match = matches.find(m => m.id === matchId);

  useEffect(() => {
    if (matchId) {
       // Establish Socket.IO connection
       const socketUrl = import.meta.env.VITE_SOCKET_URL || '';
       const token = localStorage.getItem('token') || '';
       const socket = io(`${socketUrl}/chat`, {
         auth: { token },
         transports: ['websocket']
       });
       socketRef.current = socket;

       socket.on('typing', (data: { senderId: string, matchId: string }) => {
         if (data.matchId === matchId && data.senderId !== 'me') {
           setIsOtherTyping(true);
         }
       });

       socket.on('stopTyping', (data: { senderId: string, matchId: string }) => {
         if (data.matchId === matchId && data.senderId !== 'me') {
           setIsOtherTyping(false);
         }
       });

       fetchMessages();
       const interval = setInterval(fetchMessages, 3000);
       return () => {
         clearInterval(interval);
         socket.disconnect();
       };
    }
  }, [matchId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    if (!matchId) return;
    try {
      const res = await api.get(`/chat/${matchId}`);
      const data = res.data;
      setMessages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    
    if (socketRef.current && matchId && match?.user?.id) {
      socketRef.current.emit('typing', {
        matchId,
        receiverId: match.user.id
      });
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        socketRef.current?.emit('stopTyping', {
          matchId,
          receiverId: match.user.id
        });
      }, 2000);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !matchId) return;

    if (socketRef.current && match?.user?.id) {
      socketRef.current.emit('stopTyping', {
        matchId,
        receiverId: match.user.id
      });
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    const text = inputText;
    setInputText('');
    
    await sendChatMessage(matchId, text);
    fetchMessages();
  };

  if (!matchId) return (
    <div className="p-8 max-w-2xl mx-auto h-screen flex flex-col">
       <h1 className="text-4xl font-black text-white mb-10 tracking-tighter italic">MESSAGES</h1>
       <div className="flex-1 overflow-y-auto space-y-4">
         {matches.map(m => (
           <div 
            key={m.id}
            onClick={() => navigate(`/chat/${m.id}`)}
            className="flex items-center space-x-5 p-5 bg-dark-900 rounded-[32px] border border-white/5 shadow-xl hover:bg-dark-800 transition-all cursor-pointer group"
           >
              <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg group-hover:scale-105 transition-transform">
                <img src={m?.user?.images?.[0] || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800'} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-lg">{m?.user?.name || 'User'}</h3>
                <p className="text-gray-500 text-sm truncate font-medium">Click to open conversation</p>
              </div>
              <ChevronLeft size={20} className="text-gray-700 rotate-180" />
           </div>
         ))}
         {matches.length === 0 && (
           <div className="flex flex-col items-center justify-center py-32 text-center opacity-20">
             <MessageCircle size={64} className="mb-6" />
             <p className="font-bold uppercase tracking-widest text-xs">No active conversations</p>
           </div>
         )}
       </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-dark-950 lg:relative lg:h-screen z-[60] flex flex-col">
      <header className="bg-dark-900 border-b border-dark-800 h-20 px-6 flex items-center justify-between shadow-xl shrink-0">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/chat')} className="w-10 h-10 flex items-center justify-center rounded-xl bg-dark-800 text-gray-400 border border-white/5">
            <ChevronLeft size={24} />
          </button>
          <div 
            onClick={() => navigate('/profile', { state: { profile: match?.user } })}
            className="flex items-center space-x-4 cursor-pointer"
          >
            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-brand-red/30">
              <img src={match?.user?.images?.[0] || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800'} className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-bold text-white leading-tight">{match?.user?.name || 'User'}</h3>
              <div className="flex items-center text-[10px] text-emerald-500 space-x-1.5 uppercase font-black tracking-[0.2em]">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
                <span>Active</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
           <button onClick={() => navigate('/safety')} className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-500 hover:text-white transition-colors"><Shield size={20} /></button>
           <button className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-500 hover:text-white transition-colors"><MoreVertical size={20} /></button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 space-y-6 flex flex-col">
        {isLoadingMessages ? (
          <div className="flex flex-col space-y-6 flex-1 pt-12 animate-pulse">
             {[...Array(4)].map((_, i) => (
                <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[70%] md:max-w-[60%] p-5 rounded-[32px] w-64 h-16 ${
                    i % 2 === 0 
                      ? 'bg-dark-900 border border-dark-800 rounded-tl-none' 
                      : 'bg-dark-800 rounded-tr-none'
                  }`}>
                  </div>
                </div>
             ))}
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center py-16 opacity-10">
               <div className="w-20 h-20 bg-dark-800 rounded-full flex items-center justify-center mb-6">
                 <Heart size={40} className="text-brand-red" fill="currentColor" />
               </div>
               <p className="text-xs font-black tracking-[0.3em] text-white text-center uppercase">
                 Connection established on<br/>
                 {new Date(match?.timestamp || '').toLocaleDateString()}
               </p>
            </div>

            {messages.map((msg, i) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={msg.id}
                className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] p-5 rounded-[32px] text-[15px] leading-relaxed shadow-lg ${
                  msg.senderId === 'me' 
                    ? 'bg-brand-red text-white rounded-tr-none shadow-brand-red/10' 
                    : 'bg-dark-900 text-gray-200 border border-dark-800 rounded-tl-none'
                }`}>
                  {msg.text}
                  <div className={`text-[10px] mt-2 font-bold opacity-40 uppercase tracking-widest ${msg.senderId === 'me' ? 'text-white' : 'text-gray-500'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            ))}
          </>
        )}
        
        <AnimatePresence>
          {isOtherTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="flex justify-start pt-2"
            >
              <div className="bg-dark-900 border border-white/5 p-4 rounded-[32px] rounded-tl-none shadow-xl flex items-center space-x-3 w-fit">
                <span className="text-[11px] font-black tracking-widest text-gray-500 uppercase">{match?.user.name} is typing</span>
                <div className="flex space-x-1.5 px-2">
                  <motion.div animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0 }} className="w-1.5 h-1.5 bg-brand-red rounded-full" />
                  <motion.div animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 bg-brand-red rounded-full" />
                  <motion.div animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }} className="w-1.5 h-1.5 bg-brand-red rounded-full" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={scrollRef} />
      </div>

      <div className="bg-dark-900 border-t border-dark-800 p-6 pb-12 lg:pb-8 shadow-2xl relative z-10">
        <form onSubmit={handleSend} className="flex items-center space-x-3 bg-dark-800 p-2 pl-6 rounded-[32px] border border-white/5 focus-within:border-brand-red/30 transition-all">
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="flex-1 bg-transparent border-none outline-none text-base py-3 text-white placeholder:text-gray-600"
          />
          <button 
            type="submit"
            className="w-14 h-14 bg-brand-red text-white rounded-full flex items-center justify-center shadow-2xl shadow-brand-red/20 transition-all active:scale-90 hover:scale-105"
          >
            <Send size={22} fill="currentColor" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
