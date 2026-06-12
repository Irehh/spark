import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Sliders, Bell, Eye, Lock, Globe, Shield, Activity, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ToggleSwitch = ({ active, onChange }: { active: boolean, onChange: () => void }) => {
  return (
    <button 
      onClick={onChange}
      className={`w-12 h-6 rounded-full transition-all flex items-center p-1 ${active ? 'bg-amber-500 justify-end' : 'bg-dark-800 justify-start border border-white/10'}`}
    >
      <motion.div layout className={`w-4 h-4 rounded-full shadow-lg ${active ? 'bg-black' : 'bg-white/50'}`} />
    </button>
  );
};

export const PreferencesPage = () => {
  const navigate = useNavigate();

  // Mock states for presentation
  const [globalVisibility, setGlobalVisibility] = useState(true);
  const [showAge, setShowAge] = useState(true);
  const [showDistance, setShowDistance] = useState(true);
  const [readReceipts, setReadReceipts] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);

  const [distanceRef, setDistanceRef] = useState(50);
  const [ageRange, setAgeRange] = useState([21, 35]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-md mx-auto min-h-screen bg-black pb-24 text-white"
    >
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 pt-12 pb-4 px-6 flex items-center space-x-4">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <ChevronLeft size={20} className="text-white" />
        </button>
        <span className="font-bold text-white tracking-widest text-xs uppercase">Discovery Preferences</span>
      </div>

      <div className="px-6 py-8 space-y-12">
        {/* Discovery Settings */}
        <section>
          <div className="flex items-center space-x-3 mb-6">
            <Globe className="text-amber-500" size={20} />
            <h2 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">Discovery Controls</h2>
          </div>
          
          <div className="bg-dark-950 border border-white/5 rounded-[32px] overflow-hidden">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-md text-white mb-1">Global Visibility</h3>
                <p className="text-[10px] text-white/40 uppercase tracking-widest">Show me in Discovery</p>
              </div>
              <ToggleSwitch active={globalVisibility} onChange={() => setGlobalVisibility(!globalVisibility)} />
            </div>

            <div className="p-6 border-b border-white/5">
               <div className="flex justify-between items-center mb-4">
                 <h3 className="font-bold text-md text-white">Maximum Distance</h3>
                 <span className="text-amber-500 font-bold">{distanceRef} mi</span>
               </div>
               <input 
                 type="range" 
                 min="1" max="100" 
                 value={distanceRef} 
                 onChange={e => setDistanceRef(parseInt(e.target.value))}
                 className="w-full accent-amber-500" 
               />
               <p className="text-[10px] text-white/40 uppercase tracking-widest mt-4">Show people further away if I run out.</p>
            </div>

            <div className="p-6">
               <div className="flex justify-between items-center mb-4">
                 <h3 className="font-bold text-md text-white">Age Range</h3>
                 <span className="text-amber-500 font-bold">{ageRange[0]} - {ageRange[1]}</span>
               </div>
               <div className="flex space-x-4">
                 <input 
                   type="range" min="18" max="100" 
                   value={ageRange[0]} onChange={(e) => setAgeRange([parseInt(e.target.value), ageRange[1]])}
                   className="w-full accent-amber-500" 
                 />
                 <input 
                   type="range" min="18" max="100" 
                   value={ageRange[1]} onChange={(e) => setAgeRange([ageRange[0], parseInt(e.target.value)])}
                   className="w-full accent-amber-500" 
                 />
               </div>
            </div>
          </div>
        </section>

        {/* Privacy & Safety */}
        <section>
          <div className="flex items-center space-x-3 mb-6">
            <Eye className="text-brand-blue" size={20} />
            <h2 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">Privacy</h2>
          </div>
          
          <div className="bg-dark-950 border border-white/5 rounded-[32px] overflow-hidden">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-md text-white mb-1">Show My Age</h3>
                <p className="text-[10px] text-white/40 uppercase tracking-widest">Public profile</p>
              </div>
              <ToggleSwitch active={showAge} onChange={() => setShowAge(!showAge)} />
            </div>

            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-md text-white mb-1">Show My Distance</h3>
                <p className="text-[10px] text-white/40 uppercase tracking-widest">Public profile</p>
              </div>
              <ToggleSwitch active={showDistance} onChange={() => setShowDistance(!showDistance)} />
            </div>
            
            <div className="p-6 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-md flex items-center gap-2">
                  <Lock size={14} className="text-amber-500" />
                  <span className="text-amber-500">Read Receipts</span>
                </h3>
                <p className="text-[10px] text-white/40 uppercase tracking-widest">Premium feature</p>
              </div>
              <ToggleSwitch active={readReceipts} onChange={() => setReadReceipts(!readReceipts)} />
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section>
          <div className="flex items-center space-x-3 mb-6">
            <Bell className="text-brand-red" size={20} />
            <h2 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">Notifications</h2>
          </div>
          
          <div className="bg-dark-950 border border-white/5 rounded-[32px] overflow-hidden p-6 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-md text-white mb-1">Push Notifications</h3>
                <p className="text-[10px] text-white/40 uppercase tracking-widest">Matches & Messages</p>
              </div>
              <ToggleSwitch active={pushNotifications} onChange={() => setPushNotifications(!pushNotifications)} />
          </div>
        </section>

        {/* Danger Zone */}
        <section className="pt-8">
           <button className="w-full p-4 border border-red-500/20 bg-red-500/5 text-red-500 rounded-2xl font-bold tracking-[0.2em] uppercase text-xs hover:bg-red-500/10 transition-colors">
              Delete Account
           </button>
        </section>
      </div>
    </motion.div>
  );
};
