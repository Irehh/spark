import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, Mail, Lock, UserPlus, User } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    // Simulate registration
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 relative">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-brand-red/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-brand-blue/10 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-brand-red rounded-2xl flex items-center justify-center shadow-2xl shadow-brand-red/30 mb-6">
            <Flame className="text-white" size={32} fill="currentColor" />
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Create Account</h1>
          <p className="text-gray-400">Join Spark to find your perfect match.</p>
        </div>

        <div className="bg-dark-800/80 backdrop-blur-2xl rounded-3xl p-8 border border-white/5 shadow-2xl shadow-black/50">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-300 ml-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="text-gray-500" size={18} />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-dark-900 border border-dark-700 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-colors"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-300 ml-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="text-gray-500" size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-dark-900 border border-dark-700 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-colors"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-300 ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="text-gray-500" size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-dark-900 border border-dark-700 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-colors"
                  placeholder="Create a strong password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-brand-red hover:bg-brand-red/90 text-white font-bold py-3.5 rounded-xl transition-colors mt-6 flex items-center justify-center space-x-2 shadow-lg shadow-brand-red/25"
            >
              <span>Sign Up</span>
              <UserPlus size={18} />
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-6">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>

        <p className="text-center mt-8 text-gray-500 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-red font-bold hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
