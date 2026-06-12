import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, Mail, Lock, LogIn } from 'lucide-react';
import { useStore } from '../store/useStore';
import api from '../lib/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      const response = await api.post('/auth/login', { email, password });
      const data = response.data;
      
      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
      }
      
      // Fetch full profile info or use the returned user if available
      useStore.setState({
        user: {
          id: data.user?.id || 'me',
          name: data.user?.fullName || 'User',
          age: 28,
          bio: 'Looking for meaningful connections.',
          images: ['https://images.unsplash.com/photo-1539571696357-5a69c17a67c6'],
          location: 'New York, USA',
          interests: ['Photography', 'Coffee', 'Design'],
          verified: true,
          prompts: []
        }
      });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 relative">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-red/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-brand-blue/10 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-brand-red rounded-2xl flex items-center justify-center shadow-2xl shadow-brand-red/30 mb-6">
            <Flame className="text-white" size={32} fill="currentColor" />
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Welcome Back</h1>
          <p className="text-gray-400">Log in to find your next spark.</p>
        </div>

        <div className="bg-dark-800/80 backdrop-blur-2xl rounded-3xl p-8 border border-white/5 shadow-2xl shadow-black/50">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
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
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-gray-300">Password</label>
                <Link to="/reset-password" className="text-xs text-brand-red hover:underline font-medium">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="text-gray-500" size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-dark-900 border border-dark-700 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-brand-red hover:bg-brand-red/90 text-white font-bold py-3.5 rounded-xl transition-colors mt-2 flex items-center justify-center space-x-2 shadow-lg shadow-brand-red/25"
            >
              <span>Sign In</span>
              <LogIn size={18} />
            </button>
          </form>

          <div className="mt-8 flex items-center justify-center space-x-4">
            <div className="h-px bg-dark-700 flex-1" />
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Or continue with</span>
            <div className="h-px bg-dark-700 flex-1" />
          </div>

          <div className="mt-6 flex gap-4">
            <button className="flex-1 bg-dark-900 hover:bg-dark-700 border border-dark-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center">
              Google
            </button>
            <button className="flex-1 bg-dark-900 hover:bg-dark-700 border border-dark-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center">
              Apple
            </button>
          </div>
        </div>

        <p className="text-center mt-8 text-gray-500 text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-red font-bold hover:underline">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
