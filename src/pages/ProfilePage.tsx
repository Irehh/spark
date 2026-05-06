import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Shield, Camera, Edit3, Heart, Lock, LogOut, ChevronRight, Moon, Sun, CheckCircle2, MapPin, Star } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useNavigate, useLocation } from 'react-router-dom';

const ProfilePage = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(true);

  const viewProfile = location.state?.profile || user;
  const isOwnProfile = viewProfile.id === user?.id;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-xl mx-auto pb-20"
    >
      <div className="relative">
        <div className="h-96 overflow-hidden relative">
          <img 
            src={viewProfile?.images[0]} 
            className="w-full h-full object-cover blur-2xl opacity-20 scale-125" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/80 to-transparent" />
        </div>

        <div className="absolute top-24 left-0 right-0 flex flex-col items-center">
            <div className="relative">
              <div className="w-48 h-48 rounded-[56px] overflow-hidden border-4 border-dark-800 shadow-[0_0_80px_rgba(0,0,0,0.8)] relative z-10 p-1 bg-dark-800">
                 <img src={viewProfile?.images[0]} className="w-full h-full object-cover rounded-[50px]" />
              </div>
              {isOwnProfile && (
                <button className="absolute bottom-[-10px] right-[-10px] w-12 h-12 bg-brand-red text-white rounded-2xl shadow-2xl flex items-center justify-center border-4 border-dark-950 z-20 hover:scale-110 active:scale-95 transition-transform">
                  <Camera size={20} />
                </button>
              )}
            </div>
            
            <div className="mt-10 text-center px-8">
              <div className="flex items-center justify-center space-x-3">
                <h1 className="text-4xl font-black text-white tracking-tighter">
                  {viewProfile?.name}, {viewProfile?.age}
                </h1>
                {viewProfile?.verified && <CheckCircle2 size={28} className="text-brand-blue" fill="currentColor" strokeWidth={3} />}
              </div>
              <div className="flex items-center justify-center text-gray-500 font-bold text-sm mt-2 mb-6 uppercase tracking-widest">
                <MapPin size={16} className="mr-2 text-brand-red" />
                {viewProfile?.location}
              </div>
              <p className="text-gray-400 text-base leading-relaxed max-w-sm mx-auto font-medium italic">
                "{viewProfile?.bio}"
              </p>
            </div>
        </div>
      </div>

      <div className="mt-64 px-8 space-y-10">
        <div className="grid grid-cols-3 gap-3">
           {viewProfile?.interests.map(interest => (
             <div key={interest} className="p-4 bg-dark-950 border border-white/5 rounded-2xl flex flex-col items-center justify-center space-y-2 shadow-xl hover:bg-dark-900 transition-colors">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{interest}</span>
             </div>
           ))}
        </div>

        {isOwnProfile ? (
          <div className="space-y-4">
             <h3 className="text-xs font-black text-gray-600 uppercase tracking-[0.3em] mb-6 pl-2">Security & Control</h3>
             
             <button 
              onClick={() => navigate('/safety')}
              className="w-full p-6 bg-dark-900 rounded-[32px] border border-white/5 shadow-2xl flex items-center justify-between group active:scale-[0.98] transition-all hover:bg-dark-800"
             >
                <div className="flex items-center space-x-5">
                  <div className="w-14 h-14 bg-brand-blue/10 text-brand-blue rounded-2xl flex items-center justify-center">
                    <Shield size={28} strokeWidth={2.5} />
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-white text-lg tracking-tight">Safety Center</h4>
                    <p className="text-[10px] text-gray-500 font-black tracking-[0.1em] uppercase">VERIFIED STATUS: SECURE</p>
                  </div>
                </div>
                <ChevronRight size={24} className="text-gray-700 group-hover:text-white transition-colors" />
             </button>

             <button className="w-full p-6 bg-dark-900 rounded-[32px] border border-white/5 shadow-2xl flex items-center justify-between group active:scale-[0.98] transition-all hover:bg-dark-800">
                <div className="flex items-center space-x-5">
                  <div className="w-14 h-14 bg-brand-red/10 text-brand-red rounded-2xl flex items-center justify-center">
                    <Settings size={28} strokeWidth={2.5} />
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-white text-lg tracking-tight">Discovery Labs</h4>
                    <p className="text-[10px] text-gray-500 font-black tracking-[0.1em] uppercase">GLOBAL VISIBILITY: ON</p>
                  </div>
                </div>
                <ChevronRight size={24} className="text-gray-700 group-hover:text-white transition-colors" />
             </button>

             <div className="w-full p-6 bg-dark-900 rounded-[32px] border border-white/5 shadow-2xl flex items-center justify-between group">
                <div className="flex items-center space-x-5">
                  <div className="w-14 h-14 bg-gray-800/30 text-gray-400 rounded-2xl flex items-center justify-center border border-white/5">
                    {isDarkMode ? <Moon size={28} strokeWidth={2.5} /> : <Sun size={28} strokeWidth={2.5} />}
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-white text-lg tracking-tight">Stealth Theme</h4>
                    <p className="text-[10px] text-gray-500 font-black tracking-[0.1em] uppercase">AUTO ADAPTIVE</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`w-14 h-7 rounded-full transition-all flex items-center p-1.5 ${isDarkMode ? 'bg-brand-red justify-end' : 'bg-gray-800 justify-start'}`}
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow-lg" />
                </button>
             </div>

             <button className="w-full pt-8 flex items-center justify-center space-x-3 text-gray-600 font-black text-xs tracking-[0.2em] uppercase hover:text-brand-red transition-all">
                <LogOut size={16} />
                <span>Terminate Session</span>
             </button>
          </div>
        ) : (
          <div className="space-y-4">
            <button className="w-full py-5 bg-dark-950 border border-white/10 text-gray-400 rounded-3xl font-black text-xs tracking-[0.2em] uppercase hover:text-white hover:border-white transition-all flex items-center justify-center space-x-3">
               <Shield size={20} />
               <span>REPORT PROFILE</span>
            </button>
            <button className="w-full py-5 bg-brand-red/10 text-brand-red rounded-3xl font-black text-xs tracking-[0.2em] uppercase hover:bg-brand-red/20 transition-all flex items-center justify-center space-x-3 border border-brand-red/20">
               <Lock size={20} />
               <span>BLOCK SESSION</span>
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProfilePage;
