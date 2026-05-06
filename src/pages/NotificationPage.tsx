import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Heart, Shield, MessageCircle, ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';

const NotificationPage = () => {
  const { notifications, markNotificationRead } = useStore();

  const getIcon = (type: string) => {
    switch (type) {
      case 'match': return <Heart size={20} className="text-white" fill="currentColor" />;
      case 'message': return <MessageCircle size={20} className="text-white" fill="currentColor" />;
      case 'safety': return <Shield size={20} className="text-white" fill="currentColor" />;
      default: return <Bell size={20} className="text-white" />;
    }
  };

  const getBg = (type: string) => {
    switch (type) {
      case 'match': return 'bg-brand-red shadow-brand-red/20';
      case 'message': return 'bg-amber-500 shadow-amber-500/20';
      case 'safety': return 'bg-brand-blue shadow-brand-blue/20';
      default: return 'bg-gray-700 shadow-gray-700/20';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 max-w-2xl mx-auto"
    >
      <header className="flex items-center justify-between mb-12">
        <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">Notifications</h1>
        <div className="px-4 py-1.5 bg-brand-red/10 border border-brand-red/20 rounded-full text-brand-red text-[11px] font-black tracking-[0.2em] uppercase">
          {notifications.filter(n => !n.read).length} Unseen
        </div>
      </header>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 opacity-20 text-center">
            <Bell size={64} className="mb-6 rotate-12" />
            <p className="text-xs font-black uppercase tracking-[0.3em]">Inbox is empty</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              onClick={() => markNotificationRead(notif.id)}
              className={`p-6 rounded-[32px] border transition-all cursor-pointer relative ${
                notif.read ? 'bg-dark-900 border-white/5 opacity-50' : 'bg-dark-900 border-white/10 shadow-2xl'
              }`}
            >
              <div className="flex items-start space-x-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl shrink-0 ${getBg(notif.type)}`}>
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="font-bold text-white text-base truncate">{notif.title}</h3>
                    <span className="text-[10px] text-gray-600 font-bold tracking-widest whitespace-nowrap uppercase">
                       {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed font-medium">{notif.content}</p>
                </div>
                {!notif.read && (
                  <div className="absolute top-6 right-6 w-2.5 h-2.5 bg-brand-red rounded-full shadow-[0_0_12px_#E35D5D]" />
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      <div className="mt-16 p-8 bg-gradient-to-br from-dark-900 to-dark-800 rounded-[40px] text-white shadow-2xl border border-white/5">
        <h4 className="text-xl font-bold mb-3 flex items-center space-x-3">
           <Shield size={24} className="text-brand-blue" />
           <span className="tracking-tight italic uppercase">Safety Pulse</span>
        </h4>
        <p className="text-gray-500 text-sm leading-relaxed mb-8 font-medium">
          Our adaptive algorithms are scanning for anomalies. Connection integrity is currently <span className="text-brand-blue font-bold">100% verified</span>.
        </p>
        <button className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[11px] font-black tracking-[0.3em] uppercase transition-all flex items-center justify-center space-x-2 border border-white/5">
          <span>Security Protocol Dashboard</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </motion.div>
  );
};

export default NotificationPage;
