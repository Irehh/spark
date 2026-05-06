import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, ChevronLeft, ShieldCheck, Share2, Info, AlertTriangle, EyeOff, UserX, PhoneIncoming } from 'lucide-react';

const SafetyCenter = () => {
  const navigate = useNavigate();

  const safetyTools = [
    {
      title: 'Share My Date',
      description: 'Let trusted friends know your location and who you are meeting.',
      icon: Share2,
      color: 'text-brand-blue',
      bg: 'bg-brand-blue/10 dark-border'
    },
    {
      title: 'Incognito Mode',
      description: 'Only be seen by people you have already liked.',
      icon: EyeOff,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10 dark-border'
    },
    {
      title: 'Block Contacts',
      description: 'Prevent people from your contact list matching with you.',
      icon: UserX,
      color: 'text-brand-red',
      bg: 'bg-brand-red/10 dark-border'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 max-w-2xl mx-auto"
    >
      <header className="flex items-center space-x-5 mb-12">
        <button onClick={() => navigate(-1)} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-dark-900 text-gray-400 border border-white/5 shadow-xl">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-3xl font-black text-white tracking-tighter italic uppercase">Safety Hub</h1>
      </header>

      <div className="bg-gradient-to-br from-brand-blue to-blue-800 rounded-[40px] p-8 text-white mb-12 shadow-2xl shadow-brand-blue/20 flex flex-col items-start relative overflow-hidden">
        <ShieldCheck size={120} className="absolute bottom-[-20px] right-[-20px] opacity-10 rotate-12" />
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
            <ShieldCheck size={28} />
          </div>
          <h2 className="text-2xl font-black tracking-tight uppercase italic">Secure Protocol</h2>
        </div>
        <p className="text-blue-100 text-base leading-relaxed mb-8 max-w-sm font-medium">
          Spark employs multi-factor biometric authentication to ensure every match is 100% genuine.
        </p>
        <button className="px-8 py-4 bg-white text-blue-700 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-black/20 transition-all active:scale-95">
          Request Verification
        </button>
      </div>

      <div className="space-y-10">
        <section>
          <h3 className="text-xs font-black text-gray-600 uppercase tracking-[0.3em] mb-6 pl-2">Defense Arsenal</h3>
          <div className="space-y-4">
             {safetyTools.map(tool => (
               <div key={tool.title} className="p-6 bg-dark-900 rounded-[32px] border border-white/5 flex items-center space-x-5 shadow-2xl active:scale-[0.98] transition-all hover:bg-dark-800">
                  <div className={`w-14 h-14 ${tool.bg} ${tool.color} rounded-2xl flex items-center justify-center shadow-inner`}>
                    <tool.icon size={28} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white text-lg tracking-tight">{tool.title}</h4>
                    <p className="text-[11px] text-gray-500 font-medium leading-tight tracking-wide">{tool.description}</p>
                  </div>
               </div>
             ))}
          </div>
        </section>

        <section className="bg-brand-red/5 p-8 rounded-[40px] border border-brand-red/10 shadow-2xl relative overflow-hidden">
           <AlertTriangle size={150} className="absolute top-[-40px] right-[-40px] text-brand-red/5 -rotate-12" />
           <h3 className="text-brand-red font-black text-xs tracking-[0.3em] uppercase mb-4 flex items-center space-x-3">
             <AlertTriangle size={20} />
             <span>Emergency Node</span>
           </h3>
           <p className="text-gray-400 text-sm mb-8 max-w-sm leading-relaxed font-medium">If you find yourself in an unsafe scenario, trigger the emergency node to broadcast your precise location to federal responders.</p>
           <button className="w-full py-5 bg-brand-red text-white rounded-[24px] font-black text-xs tracking-[0.2em] shadow-[0_15px_40px_rgba(227,93,93,0.3)] transition-all active:scale-95 uppercase">
              ACTIVATE EMERGENCY RESPONSE
           </button>
        </section>
      </div>

      <div className="py-16 text-center opacity-20">
        <p className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Enforcement v2.9 // Global Security Grid</p>
      </div>
    </motion.div>
  );
};

export default SafetyCenter;
