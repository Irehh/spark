import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Heart, ShieldCheck, ChevronRight, Flame, Star } from 'lucide-react';
import { useStore } from '../store/useStore';
import { PaywallModal } from '../components/PaywallModal';

export default function MatchesPage() {
  const { matches, fetchMatches, isMatchesLoading } = useStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'matches' | 'likes'>('matches');
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    fetchMatches();
  }, []);

  const likesYou = [
    { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }
  ];

  const handleTabSwitch = (tab: 'matches' | 'likes') => {
    setActiveTab(tab);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-8 max-w-2xl mx-auto"
    >
      <header className="flex flex-col mb-12">
        <h1 className="text-4xl font-black text-white tracking-tighter italic mb-8">CONNECTIONS</h1>
        
        <div className="flex bg-dark-900 border border-white/5 rounded-full p-1.5 object-cover w-full max-w-[320px]">
          <button 
            onClick={() => handleTabSwitch('matches')}
            className={`flex-1 py-3 text-sm font-bold tracking-widest uppercase transition-all duration-300 rounded-full ${activeTab === 'matches' ? 'bg-brand-red text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Matches
          </button>
          <button 
            onClick={() => handleTabSwitch('likes')}
            className={`flex-1 py-3 text-sm font-bold tracking-widest uppercase transition-all duration-300 rounded-full flex items-center justify-center space-x-2 ${activeTab === 'likes' ? 'bg-brand-yellow text-dark-950 shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <span>Likes</span>
            <span className="bg-brand-yellow text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">4</span>
          </button>
        </div>
      </header>

      {activeTab === 'matches' ? (
        isMatchesLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="relative aspect-[3/4] rounded-[32px] overflow-hidden shadow-2xl border border-white/5 bg-dark-900 animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 to-transparent p-5 flex flex-col justify-end">
                  <div className="w-2/3 h-5 bg-dark-800 rounded mb-2"></div>
                  <div className="w-1/2 h-3 bg-dark-800 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center opacity-20">
            <div className="w-24 h-24 bg-dark-900 rounded-full flex items-center justify-center border border-dashed border-white/10 mb-8">
              <Heart size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Your list is empty</h3>
            <p className="text-gray-500 text-sm max-w-[240px] font-medium leading-relaxed">Start swiping to find your perfect match. Every spark starts somewhere.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {matches.map((match) => (
              <motion.div
                key={match.id}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/chat/${match.id}`)}
                className="relative aspect-[3/4] rounded-[32px] overflow-hidden cursor-pointer group shadow-2xl border border-white/5"
              >
                <img src={match.user.images[0]} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-5 flex flex-col justify-end">
                  <div className="flex items-center text-white space-x-1.5 mb-1">
                    <span className="font-bold text-base">{match.user.name}</span>
                    {match.user.verified && <ShieldCheck size={16} className="text-brand-blue" fill="currentColor" />}
                  </div>
                  <div className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] flex items-center space-x-1.5">
                    <Flame size={12} fill="currentColor" />
                    <span>Start Conversation</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )
      ) : (
        <div className="relative">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 blur-md select-none pointer-events-none opacity-80">
            {likesYou.map((like) => (
              <div key={like.id} className="bg-dark-900 rounded-[32px] aspect-[3/4] relative overflow-hidden border border-brand-yellow/10">
                <div className="absolute inset-0 bg-gradient-to-t from-brand-yellow/30 to-dark-900/10" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <Heart size={40} className="text-brand-yellow/50 mb-3 fill-current" />
                </div>
              </div>
            ))}
          </div>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pt-16">
            <button 
              onClick={() => setShowPaywall(true)}
              className="bg-brand-yellow font-black text-dark-950 px-8 py-5 rounded-2xl shadow-xl shadow-brand-yellow/20 hover:scale-105 transition-transform uppercase tracking-wider flex items-center space-x-3 group"
            >
              <Star size={24} className="fill-dark-950 group-hover:rotate-45 transition-transform" />
              <span>See Who Liked You</span>
            </button>
            <p className="mt-6 text-gray-500 font-bold text-sm tracking-wide">4 people have already swiped right.</p>
          </div>
        </div>
      )}

      {matches.length > 0 && activeTab === 'matches' && (
        <div className="mt-12 p-6 bg-dark-900 rounded-[32px] border border-white/5 shadow-xl">
          <h4 className="text-brand-red font-black text-xs mb-2 uppercase tracking-[0.3em]">Insights</h4>
          <p className="text-gray-400 text-sm leading-relaxed font-medium">Your profile is attracting high-value connections interested in <span className="text-white">Design</span> and <span className="text-white">Music</span>.</p>
        </div>
      )}

      <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} featureName="See Who Likes You" />
    </motion.div>
  );
}
