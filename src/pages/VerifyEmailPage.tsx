import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader, Flame } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided. Please use the link sent to your email.');
      return;
    }

    const verifyToken = async () => {
      try {
        // Use Vite's env VITE_API_URL or fallback to /api to use the proxy
        const apiUrl = import.meta.env.VITE_API_URL || '/api';
        
        const response = await fetch(`${apiUrl}/auth/verify-email?token=${token}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(data.message || 'Your email has been verified successfully!');
        } else {
          setStatus('error');
          setMessage(data.message || 'Verification failed. The token may be invalid or expired.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('A network error occurred. Please try again later.');
      }
    };

    verifyToken();
  }, [token]);

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
        className="w-full max-w-md relative z-10 text-center"
      >
        <div className="bg-dark-800/80 backdrop-blur-2xl rounded-3xl p-8 border border-white/5 shadow-2xl shadow-black/50">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-brand-red rounded-2xl flex items-center justify-center shadow-2xl shadow-brand-red/30">
              {status === 'loading' && <Loader className="text-white animate-spin" size={32} />}
              {status === 'success' && <CheckCircle className="text-white" size={32} />}
              {status === 'error' && <XCircle className="text-white" size={32} />}
            </div>
          </div>
          
          <h1 className="text-3xl font-black tracking-tight mb-4">
            {status === 'loading' && 'Verifying Email'}
            {status === 'success' && 'Email Verified!'}
            {status === 'error' && 'Verification Failed'}
          </h1>
          
          <p className="text-gray-400 mb-8">
            {status === 'loading' && 'Please wait while we verify your email address...'}
            {status !== 'loading' && message}
          </p>

          {status === 'success' && (
            <Link 
              to="/login"
              className="w-full inline-flex items-center justify-center bg-brand-red hover:bg-brand-red/90 text-white font-bold py-3.5 rounded-xl transition-colors space-x-2 shadow-lg shadow-brand-red/25"
            >
              <span>Continue to Login</span>
            </Link>
          )}

          {status === 'error' && (
            <div className="flex flex-col gap-3">
               <Link 
                to="/register"
                className="w-full bg-dark-900 hover:bg-dark-700 border border-dark-700 text-white font-bold py-3.5 rounded-xl transition-colors"
                >
                Try Registering Again
              </Link>
              <Link 
                to="/login"
                className="w-full inline-block text-gray-400 hover:text-white font-medium text-sm transition-colors mt-2"
                >
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
