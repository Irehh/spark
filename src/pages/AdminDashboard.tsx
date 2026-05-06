import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Settings, CheckCircle2, SwitchCamera, CreditCard } from 'lucide-react';

interface Feature {
  id: number;
  featureKey: string;
  isPaid: boolean;
  minimumTierRequired: string;
}

export const AdminDashboard = () => {
  const [features, setFeatures] = useState<Feature[]>([]);

  useEffect(() => {
    // In a real app, this would fetch from /api/admin/features
    setFeatures([
      { id: 1, featureKey: 'super_likes', isPaid: true, minimumTierRequired: 'premium' },
      { id: 2, featureKey: 'rewind', isPaid: true, minimumTierRequired: 'vip' },
      { id: 3, featureKey: 'see_who_likes_you', isPaid: false, minimumTierRequired: 'free' },
    ]);
  }, []);

  const toggleFeature = (id: number) => {
    setFeatures(features.map(f => {
      if (f.id === id) {
        return { ...f, isPaid: !f.isPaid, minimumTierRequired: !f.isPaid ? 'premium' : 'free' };
      }
      return f;
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto p-8"
    >
      <header className="flex items-center space-x-4 mb-12">
        <div className="w-16 h-16 bg-brand-red/10 text-brand-red rounded-3xl flex items-center justify-center">
          <Shield size={32} />
        </div>
        <div>
          <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">Admin Panel</h1>
          <p className="text-gray-500 font-medium tracking-wide">Manage Access Control & Monetization</p>
        </div>
      </header>

      <div className="bg-dark-900 border border-white/5 rounded-[40px] p-8 shadow-2xl">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-3">
          <Settings size={24} className="text-gray-400" />
          <span>Feature Toggles</span>
        </h2>
        
        <div className="space-y-4">
          {features.map((feature) => (
            <div key={feature.id} className="flex items-center justify-between p-6 bg-dark-950 rounded-3xl border border-white/5">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${feature.isPaid ? 'bg-amber-500/10 text-amber-500' : 'bg-brand-blue/10 text-brand-blue'}`}>
                  {feature.isPaid ? <CreditCard size={24} /> : <CheckCircle2 size={24} />}
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg tracking-tight capitalize">{feature.featureKey.replace(/_/g, ' ')}</h3>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">
                    REQUIRED TIER: <span className="text-gray-300">{feature.minimumTierRequired}</span>
                  </p>
                </div>
              </div>
              <button 
                onClick={() => toggleFeature(feature.id)}
                className={`relative w-16 h-8 rounded-full transition-colors duration-300 outline-none flex items-center px-1 ${feature.isPaid ? 'bg-brand-red' : 'bg-dark-800'}`}
              >
                <motion.div 
                  layout
                  className="w-6 h-6 bg-white rounded-full shadow-md"
                  animate={{ x: feature.isPaid ? 32 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
