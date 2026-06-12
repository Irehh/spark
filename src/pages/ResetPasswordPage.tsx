import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, Mail, ArrowRight, ArrowLeft } from 'lucide-react';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-[600px] h-[600px] bg-brand-red/5 rounded-full blur-[150px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <Link to="/login" className="inline-flex items-center text-sm font-semibold text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          Back to Login
        </Link>

        <div className="bg-dark-800/80 backdrop-blur-2xl rounded-3xl p-8 border border-white/5 shadow-2xl shadow-black/50">
          <div className="w-14 h-14 bg-dark-900 border border-dark-700 rounded-2xl flex items-center justify-center mb-6">
            <Flame className="text-brand-red" size={24} fill="currentColor" />
          </div>
          
          <h2 className="text-2xl font-black mb-2">Reset Password</h2>
          
          {!submitted ? (
            <>
              <p className="text-gray-400 text-sm mb-8">
                Enter the email address associated with your account and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-300 ml-1">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="text-gray-500" size={18} />
                    </div>
                    <input
                      type="email"
                      value={email}
                      required
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-dark-900 border border-dark-700 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-colors"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-red hover:bg-brand-red/90 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Send Reset Link</span>
                  <ArrowRight size={18} />
                </button>
              </form>
            </>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-4"
            >
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Mail className="text-green-500" size={32} />
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Check your email</h3>
              <p className="text-gray-400 text-sm text-center mb-6">
                We've sent password reset instructions to <span className="text-white font-medium">{email}</span>
              </p>
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-dark-900 hover:bg-dark-700 border border-dark-700 text-white font-bold py-3.5 rounded-xl transition-colors"
              >
                Return to Login
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
