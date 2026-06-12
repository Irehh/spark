import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Shield, Camera, Lock, LogOut, ChevronRight, Moon, Sun, CheckCircle2, MapPin, Sparkles } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useNavigate, useLocation } from 'react-router-dom';

const ProfilePage = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const viewProfile = location.state?.profile || user;
  const isOwnProfile = viewProfile?.id === user?.id;

  if (!viewProfile) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-md mx-auto pb-24 min-h-screen bg-black"
    >
      {/* Editorial Hero Image */}
      <div className="relative h-[65vh] w-full">
        <img 
          src={viewProfile.images[0]} 
          alt="Profile"
          className="w-full h-full object-cover" 
        />
        {/* Soft, deep gradient fade into the black background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black" />
        
        {isOwnProfile && (
          <button 
            onClick={() => navigate('/edit-profile')}
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-md text-white rounded-full flex items-center justify-center border border-white/20 z-20 hover:bg-white/20 transition-all"
          >
            <Camera size={20} />
          </button>
        )}

        {/* Display Typography */}
        <div className="absolute bottom-0 left-0 w-full px-8 pb-6">
          <div className="flex items-center space-x-3 mb-1">
            <h1 className="font-serif text-6xl text-white font-bold tracking-tight leading-none">
              {viewProfile.name}
            </h1>
            <span className="font-sans text-3xl text-white/50 font-light mt-2">{viewProfile.age}</span>
          </div>
          <div className="flex items-center text-white/70 font-medium text-xs tracking-[0.2em] uppercase mt-4 space-x-2">
            <MapPin size={14} className="text-brand-red" />
            <span>{viewProfile.location}</span>
            {viewProfile.verified && (
              <>
                <span className="w-1 h-1 bg-white/30 rounded-full mx-2" />
                <span className="flex items-center text-brand-blue space-x-1">
                  <CheckCircle2 size={14} fill="currentColor" className="text-brand-blue" />
                  <span>Verified</span>
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="px-8 mt-6 space-y-10">
        {/* Bio Section */}
        <div className="relative">
           <div className="absolute -left-4 top-0 text-white/5 font-serif text-8xl leading-none">"</div>
           <p className="text-white/80 text-lg leading-relaxed font-serif italic pl-4">
             {viewProfile.bio}
           </p>
        </div>

        {/* Interests - Pill style */}
        <div>
          <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] mb-4">Interests</h3>
          <div className="flex flex-wrap gap-2">
             {viewProfile.interests.map((interest: string) => (
               <span key={interest} className="px-5 py-2.5 rounded-full border border-white/20 text-white text-xs font-semibold tracking-wider hover:bg-white hover:text-black transition-colors cursor-pointer">
                  {interest}
               </span>
             ))}
          </div>
        </div>

        {/* Controls */}
        <div className="pt-8 border-t border-white/10">
        {isOwnProfile ? (
          <div className="space-y-2">
             <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] mb-6">Account Settings</h3>
             
             {[
               { icon: Sparkles, label: "Spark Premium", sub: "Unlock all features", color: "text-amber-500", bg: "bg-amber-500/10", route: "/paywall" },
               { icon: Shield, label: "Safety Center", sub: "Verified secure", color: "text-brand-blue", bg: "bg-brand-blue/10", route: "/safety" },
               { icon: Settings, label: "Preferences", sub: "Discovery controls", color: "text-white/70", bg: "bg-white/5", route: "/preferences" },
             ].map((item, i) => (
                <button 
                  key={i}
                  onClick={() => item.route !== '#' ? navigate(item.route) : null}
                  className="w-full py-4 flex items-center justify-between group bg-transparent border-none outline-none"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-full flex items-center justify-center border border-white/5`}>
                      <item.icon size={20} strokeWidth={2} />
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-white text-sm tracking-wide">{item.label}</h4>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">{item.sub}</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-white/20 group-hover:text-white transition-colors" />
                </button>
             ))}

             <button className="w-full mt-10 p-5 rounded-3xl border border-white/10 text-white/40 text-xs font-bold tracking-[0.2em] uppercase hover:bg-white/5 hover:text-white transition-all flex items-center justify-center space-x-2">
                <LogOut size={16} />
                <span>Sign Out</span>
             </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 mt-4">
             <button className="w-full py-4 bg-white/5 hover:bg-white/10 transition-colors border border-white/10 rounded-full text-white text-xs font-bold tracking-[0.2em] uppercase flex items-center justify-center space-x-2">
                <Shield size={16} />
                <span>Report</span>
             </button>
             <button className="w-full py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors border border-red-500/20 rounded-full text-xs font-bold tracking-[0.2em] uppercase flex items-center justify-center space-x-2">
                <Lock size={16} />
                <span>Block</span>
             </button>
          </div>
        )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
