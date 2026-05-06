import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, ShieldCheck, History } from 'lucide-react';
import { useStore } from '../store/useStore';

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  currency: string;
  status: string;
  description: string;
  createdAt: string;
}

export const WalletPage = () => {
  const [balance, setBalance] = useState(0);
  const [currency, setCurrency] = useState('USD');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // In a real app we'd fetch from /api/finance/wallet and /api/finance/transactions
    setBalance(50.00);
    setTransactions([
      { id: '1', type: 'credit', amount: 50.00, currency: 'USD', status: 'completed', description: 'Deposit via Card', createdAt: new Date().toISOString() },
      { id: '2', type: 'debit', amount: 4.99, currency: 'USD', status: 'completed', description: 'Super Like Bundle', createdAt: new Date(Date.now() - 86400000).toISOString() }
    ]);
  }, []);

  const handleDeposit = () => {
    setIsProcessing(true);
    setSuccessMessage('');
    
    // Simulate Stripe Checkout and backend API call
    setTimeout(() => {
      const depositAmount = 20.00;
      setBalance(prev => prev + depositAmount);
      
      const newTx: Transaction = {
        id: Date.now().toString(),
        type: 'credit',
        amount: depositAmount,
        currency: 'USD',
        status: 'completed',
        description: 'Deposit via Stripe',
        createdAt: new Date().toISOString()
      };
      
      setTransactions(prev => [newTx, ...prev]);
      setIsProcessing(false);
      setSuccessMessage(`Successfully added $${depositAmount.toFixed(2)} to your wallet!`);
      
      setTimeout(() => setSuccessMessage(''), 5000);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto p-8"
    >
      <header className="flex flex-col mb-12">
        <div className="w-16 h-16 bg-brand-yellow/10 text-brand-yellow rounded-3xl flex items-center justify-center mb-4">
          <WalletIcon size={32} />
        </div>
        <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">Spark Wallet</h1>
        <p className="text-gray-500 font-medium tracking-wide">Manage your funds and transactions</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-gradient-to-br from-brand-yellow/20 to-amber-600/10 border border-brand-yellow/30 p-8 rounded-[40px] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-yellow/10 rounded-full blur-3xl" />
            <h2 className="text-brand-yellow font-black uppercase tracking-widest text-xs mb-2">Available Balance</h2>
            <div className="text-5xl font-black text-white tracking-tighter mb-8">
              <span>$</span>{balance.toFixed(2)}
            </div>
            
            <button 
              onClick={handleDeposit}
              disabled={isProcessing}
              className={`w-full bg-brand-yellow text-dark-950 font-black tracking-widest uppercase py-4 rounded-2xl flex items-center justify-center space-x-2 shadow-xl shadow-brand-yellow/20 transition-transform ${isProcessing ? 'opacity-80 cursor-wait' : 'hover:scale-[1.02]'}`}
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-dark-950/20 border-t-dark-950 rounded-full animate-spin" />
              ) : (
                <ArrowUpRight size={20} />
              )}
              <span>{isProcessing ? 'Processing Checkout...' : 'Add Funds'}</span>
            </button>
            <div className="mt-4 flex items-center justify-center text-[10px] uppercase font-bold text-gray-500 tracking-widest">
              <ShieldCheck size={14} className="mr-1" />
              Secure Ledger Monitored
            </div>

            {successMessage && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-2xl text-green-500 text-sm font-bold text-center"
              >
                {successMessage}
              </motion.div>
            )}
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-dark-900 border border-white/5 rounded-[40px] p-8 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-3">
              <History size={24} className="text-gray-400" />
              <span>Transaction History</span>
            </h2>
            
            <div className="space-y-4">
              {transactions.map(tx => (
                <div key={tx.id} className="flex items-center justify-between p-4 bg-dark-950 border border-white/5 rounded-3xl">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tx.type === 'credit' ? 'bg-green-500/10 text-green-500' : 'bg-brand-red/10 text-brand-red'}`}>
                      {tx.type === 'credit' ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-sm">{tx.description}</h3>
                      <p className="text-xs text-gray-500 font-medium">{new Date(tx.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className={`text-lg font-black ${tx.type === 'credit' ? 'text-green-500' : 'text-white'}`}>
                    {tx.type === 'credit' ? '+' : '-'}${tx.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
