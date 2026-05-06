import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { X, Heart, Info, ShieldCheck, MapPin, Star, Flame, Sparkles, MessageCircle, RotateCcw } from 'lucide-react';
import { useStore } from '../store/useStore';
import { UserProfile } from '../types';
import { PaywallModal } from '../components/PaywallModal';

const ProfileCard = ({ profile, onSwipe }: any) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  const likeOpacity = useTransform(x, [50, 150], [0, 1]);
  const nopeOpacity = useTransform(x, [-50, -150], [0, 1]);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 100) {
      onSwipe(profile.id, 'right');
    } else if (info.offset.x < -100) {
      onSwipe(profile.id, 'left');
    }
  };

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      className="absolute inset-0 cursor-grab active:cursor-grabbing px-4 lg:px-0"
    >
      <div className="relative w-full h-full bg-dark-900 rounded-[40px] overflow-hidden shadow-2xl shadow-black/80 border border-white/10">
        <img
          src={profile.images[0]}
          alt={profile.name}
          className="w-full h-full object-cover pointer-events-none"
        />
        
        {/* Overlays */}
        <motion.div style={{ opacity: likeOpacity }} className="absolute top-10 left-10 border-4 border-emerald-500 text-emerald-500 font-black text-4xl px-4 py-2 rounded-xl rotate-[-20deg] z-50">
          LIKE
        </motion.div>
        <motion.div style={{ opacity: nopeOpacity }} className="absolute top-10 right-10 border-4 border-brand-red text-brand-red font-black text-4xl px-4 py-2 rounded-xl rotate-[20deg] z-50">
          NOPE
        </motion.div>

        <div className="absolute inset-x-0 bottom-0 card-gradient p-10 pt-32">
          <div className="badge-verified bg-brand-blue mb-4">✓ VERIFIED</div>
          <div className="flex items-center space-x-3 mb-2">
            <h2 className="text-white text-4xl font-bold">{profile.name}, {profile.age}</h2>
            {profile.verified && <ShieldCheck className="text-brand-blue" size={24} />}
          </div>
          
          <div className="flex items-center text-gray-400 text-base mb-6">
            <MapPin size={16} className="mr-1" />
            {profile.location}
          </div>

          <p className="text-gray-300 text-sm italic mb-8 line-clamp-2">
            "{profile.bio}"
          </p>

          <div className="flex flex-wrap gap-2">
            {profile.interests.map(interest => (
              <span key={interest} className="px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-lg text-[11px] font-bold text-white/80 uppercase tracking-widest">
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const DiscoveryPage = () => {
  const { user, discoveryProfiles, likeProfile } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatch, setShowMatch] = useState<any>(null);
  
  const [lastAction, setLastAction] = useState<{ index: number, timestamp: number } | null>(null);
  const [now, setNow] = useState(Date.now());
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const canUndo = lastAction && (now - lastAction.timestamp) <= 10000;

  const handleSwipe = async (id: string, direction: 'left' | 'right') => {
    setLastAction({ index: currentIndex, timestamp: Date.now() });
    
    if (direction === 'right') {
      const isMatch = await likeProfile(id);
      if (isMatch) {
         setShowMatch(discoveryProfiles[currentIndex]);
      }
    }
    setCurrentIndex(prev => prev + 1);
  };

  const handleAction = (direction: 'left' | 'right') => {
    if (currentIndex < discoveryProfiles.length) {
      handleSwipe(discoveryProfiles[currentIndex].id, direction);
    }
  };

  const handleUndo = () => {
    if (!user || user.subscriptionTier === 'free') {
      setShowPaywall(true);
      return;
    }
    if (canUndo && lastAction) {
      setCurrentIndex(lastAction.index);
      setLastAction(null);
    }
  };

  const currentProfile = discoveryProfiles[currentIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-screen max-w-lg mx-auto flex flex-col pt-8 lg:pt-12 px-2 lg:px-0"
    >
      <header className="lg:hidden flex items-center justify-between mb-8 px-4">
        <div className="flex items-center space-x-2">
           <div className="w-8 h-8 bg-brand-red rounded-lg flex items-center justify-center">
             <Flame className="text-white" size={20} fill="currentColor" />
           </div>
           <h1 className="text-xl font-black tracking-tighter text-brand-red italic">SPARK</h1>
        </div>
        <button className="w-10 h-10 bg-dark-800 rounded-xl flex items-center justify-center text-gray-400 border border-white/5">
          <Star size={20} />
        </button>
      </header>

      <div className="relative flex-1 mb-8">
        <AnimatePresence>
          {currentIndex < discoveryProfiles.length ? (
            <ProfileCard
              key={currentProfile.id}
              profile={currentProfile}
              onSwipe={handleSwipe}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 bg-dark-900 rounded-[40px] border border-white/5"
            >
              <div className="w-20 h-20 bg-dark-800 rounded-full flex items-center justify-center mb-8 border border-white/5">
                <Sparkles className="text-brand-red" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Discovery Complete</h3>
              <p className="text-gray-500 text-sm max-w-xs mx-auto mb-8 leading-relaxed">You've seen all the sparks in your area. Come back tomorrow for fresh faces!</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-8 py-3.5 bg-brand-red text-white rounded-2xl font-bold shadow-xl shadow-brand-red/20 transition-all hover:scale-105 active:scale-95"
              >
                Refresh Discovery
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center space-x-6 pb-20 lg:pb-8">
        <button
          onClick={handleUndo}
          disabled={!canUndo}
          className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all ${
            canUndo 
              ? 'bg-dark-900 border border-amber-500/50 text-amber-500 hover:bg-dark-800' 
              : 'bg-dark-950 border border-white/5 text-gray-600 cursor-not-allowed opacity-50'
          }`}
        >
          <RotateCcw size={24} />
        </button>
        <button
          onClick={() => handleAction('left')}
          className="w-16 h-16 bg-dark-900 rounded-full shadow-2xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-dark-800 border border-white/10 transition-all"
        >
          <X size={28} />
        </button>
        <button
          onClick={() => handleAction('right')}
          className="w-20 h-20 bg-brand-red rounded-full shadow-2xl shadow-brand-red/20 flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all mt-[-10px]"
        >
          <Heart size={36} fill="currentColor" />
        </button>
        <button
          className="w-16 h-16 bg-dark-900 rounded-full shadow-2xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-dark-800 border border-white/10 transition-all"
        >
          <Info size={28} />
        </button>
      </div>

      {/* Match Modal */}
      <AnimatePresence>
        {showMatch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-dark-950/95 flex flex-col items-center justify-center text-center p-8 backdrop-blur-2xl"
          >
            <motion.div
              initial={{ scale: 0.5, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              className="mb-12"
            >
              <div className="flex -space-x-8 mb-10">
                <div className="w-36 h-36 rounded-full border-4 border-brand-red overflow-hidden shadow-[0_0_50px_rgba(227,93,93,0.3)] relative z-10">
                   <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6" className="w-full h-full object-cover" />
                </div>
                <div className="w-36 h-36 rounded-full border-4 border-emerald-400 overflow-hidden shadow-[0_0_50px_rgba(52,211,153,0.3)] relative z-0">
                   <img src={showMatch.images[0]} className="w-full h-full object-cover" />
                </div>
              </div>
              <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-amber-300 italic mb-4 leading-tight">IT'S A MATCH!</h2>
              <p className="text-white/80 text-xl font-medium">You and {showMatch.name} have liked each other.</p>
            </motion.div>

            <div className="w-full space-y-4 max-w-xs">
              <button 
                onClick={() => { setShowMatch(null); window.location.href='/chat'; }}
                className="w-full py-4.5 bg-white text-black rounded-2xl font-black shadow-2xl flex items-center justify-center space-x-3 transition-all hover:bg-gray-100 active:scale-95"
              >
                <MessageCircle size={22} fill="currentColor" />
                <span className="tracking-tight">SEND A MESSAGE</span>
              </button>
              <button 
                onClick={() => setShowMatch(null)}
                className="w-full py-4.5 border border-white/10 text-white rounded-2xl font-bold bg-white/5 hover:bg-white/10 transition-all tracking-tight"
              >
                KEEP SWIPING
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <PaywallModal 
        isOpen={showPaywall} 
        onClose={() => setShowPaywall(false)} 
        featureName="Undo Swipe" 
      />
    </motion.div>
  );
};

export default DiscoveryPage;
