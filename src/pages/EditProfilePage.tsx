import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Camera, X, Plus, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

export const EditProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useStore();
  
  if (!user) return null;

  const [bio, setBio] = useState(user.bio || '');
  const [interests, setInterests] = useState(user.interests || []);
  const [newInterest, setNewInterest] = useState('');
  const [location, setLocation] = useState(user.location || '');
  const [name, setName] = useState(user.name || '');

  const handleSave = () => {
    updateProfile({ bio, interests, location, name });
    navigate(-1);
  };

  const handleAddInterest = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newInterest.trim() !== '') {
      e.preventDefault();
      if (!interests.includes(newInterest.trim())) {
        setInterests([...interests, newInterest.trim()]);
      }
      setNewInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    setInterests(interests.filter(i => i !== interest));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-md mx-auto min-h-screen bg-dark-950 pb-24"
    >
      {/* Header */}
      <div className="sticky top-0 z-50 bg-dark-950/80 backdrop-blur-xl border-b border-white/5 pt-12 pb-4 px-6 flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <ChevronLeft size={20} className="text-white" />
        </button>
        <span className="font-bold text-white tracking-widest text-xs uppercase">Edit Profile</span>
        <button 
          onClick={handleSave}
          className="w-10 h-10 rounded-full bg-brand-red border border-brand-red/50 shadow-lg shadow-brand-red/20 flex items-center justify-center hover:bg-red-500 transition-colors"
        >
          <Save size={18} className="text-white" />
        </button>
      </div>

      <div className="px-6 py-8 space-y-10">
        {/* Photos Section */}
        <section>
          <h2 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] mb-4">Photos & Video</h2>
          <div className="grid grid-cols-3 gap-3">
            {user.images?.map((img, i) => (
              <div key={i} className={`relative rounded-2xl overflow-hidden aspect-[3/4] ${i === 0 ? 'col-span-2 row-span-2' : ''}`}>
                <img src={img} alt="Profile" className="w-full h-full object-cover" />
                <button className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-brand-red text-white flex items-center justify-center border border-white/20 shadow-lg cursor-pointer">
                  <X size={14} />
                </button>
              </div>
            ))}
            <div className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-dark-900 border border-white/5 flex flex-col items-center justify-center space-y-2 hover:bg-dark-800 transition-colors cursor-pointer">
              <Camera size={24} className="text-white/20" />
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Add Media</span>
            </div>
          </div>
        </section>

        {/* Basic Info */}
        <section className="space-y-4">
          <h2 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">Basic Info</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-white/50 pl-4 mb-1 block">Display Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)}
                className="w-full bg-dark-900 border border-white/10 rounded-2xl p-4 text-white font-medium focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/50 transition-all"
              />
            </div>
            <div>
              <label className="text-xs text-white/50 pl-4 mb-1 block">Location</label>
              <input 
                type="text" 
                value={location} 
                onChange={e => setLocation(e.target.value)}
                className="w-full bg-dark-900 border border-white/10 rounded-2xl p-4 text-white font-medium focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/50 transition-all"
              />
            </div>
          </div>
        </section>

        {/* Bio */}
        <section>
          <h2 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] mb-4">About Me</h2>
          <textarea 
            value={bio}
            onChange={e => setBio(e.target.value)}
            rows={4}
            className="w-full bg-dark-900 border border-white/10 rounded-3xl p-5 text-white font-serif italic text-lg leading-relaxed focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all resize-none"
            placeholder="Write something interesting..."
          />
        </section>

        {/* Interests */}
        <section>
          <h2 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] mb-4">Interests</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            <AnimatePresence>
              {interests.map(interest => (
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  key={interest} 
                  className="px-4 py-2 rounded-full border border-brand-red/30 bg-brand-red/10 text-brand-red text-xs font-bold tracking-wider flex items-center space-x-2"
                >
                  <span>{interest}</span>
                  <button onClick={() => removeInterest(interest)} className="hover:text-white transition-colors">
                    <X size={12} />
                  </button>
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
          <input 
            type="text" 
            value={newInterest}
            onChange={e => setNewInterest(e.target.value)}
            onKeyDown={handleAddInterest}
            placeholder="Type an interest and press Enter"
            className="w-full bg-dark-900 border border-white/10 rounded-full py-4 px-6 text-white text-sm focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/50 transition-all"
          />
        </section>
      </div>
    </motion.div>
  );
};
