import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Check, X, ShieldCheck } from 'lucide-react';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
}

import api from '../lib/api';

export const PaywallModal: React.FC<PaywallModalProps> = ({ isOpen, onClose, featureName }) => {
  const handleUpgrade = async (tier: string) => {
    // Call the checkout endpoint
    try {
      const response = await api.post('/subscriptions/checkout', { tier });
      const data = response.data;
      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe checkout
      }
    } catch (e) {
      console.error(e);
      alert('Mock payment initiated.'); // Fallback since backend is unlinked in purely mockup mode
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 content-center"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-dark-900 border border-brand-yellow/30 max-w-md w-full rounded-3xl overflow-hidden relative shadow-2xl shadow-brand-yellow/10"
            >
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white bg-dark-800 rounded-full p-1"
              >
                <X size={20} />
              </button>

              <div className="bg-gradient-to-b from-brand-yellow/20 to-transparent pt-12 pb-8 px-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-brand-yellow to-amber-500 rounded-full mx-auto flex items-center justify-center shadow-lg shadow-brand-yellow/30 mb-6">
                  <Crown size={40} className="text-dark-950" fill="currentColor" />
                </div>
                <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2">Unlock {featureName}</h2>
                <p className="text-brand-yellow/80 font-medium">Upgrade to SPARK Premium to access exclusive features and meet your match faster.</p>
              </div>

              <div className="px-8 pb-8 space-y-6">
                <ul className="space-y-4">
                  {['See who liked you before you swipe', 'Unlimited daily likes & rewinds', 'Send 5 Super Likes per day', 'Hide ads and browse incognito'].map((benefit, i) => (
                    <li key={i} className="flex items-start space-x-3 text-sm text-gray-300 font-medium">
                      <div className="w-5 h-5 rounded-full bg-brand-yellow/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check size={12} className="text-brand-yellow stroke-[3]" />
                      </div>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>

                <div className="grid grid-cols-2 gap-4 mt-8">
                  <button onClick={() => handleUpgrade('premium')} className="bg-dark-800 border border-dark-700 hover:border-brand-yellow/50 rounded-2xl p-4 flex flex-col items-center justify-center transition-all group">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 group-hover:text-brand-yellow transition-colors">Premium</span>
                    <span className="text-xl font-black text-white">$9.99<span className="text-xs font-medium text-gray-500">/mo</span></span>
                  </button>
                  <button onClick={() => handleUpgrade('vip')} className="bg-gradient-to-br from-brand-yellow to-amber-600 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden group shadow-lg shadow-brand-yellow/20">
                    <div className="absolute inset-0 bg-white/20 group-hover:bg-white/0 transition-colors" />
                    <span className="text-xs font-black text-dark-950 uppercase tracking-widest mb-1 relative z-10">VIP Pass</span>
                    <span className="text-xl font-black text-dark-950 relative z-10">$19.99<span className="text-xs font-bold text-dark-800">/mo</span></span>
                  </button>
                </div>
              </div>
              
              <div className="bg-dark-950 py-3 text-center border-t border-white/5">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center justify-center">
                  <ShieldCheck size={14} className="mr-1" /> Secure checkout via Stripe
                </span>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
