'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [isAuthenticated, loading, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center space-y-6">
        {/* Animated loading orbs */}
        <div className="flex justify-center items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
        
        {/* Main spinner with glow effect */}
        <div className="relative w-16 h-16 mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute inset-0 animate-spin">
            <div className="w-full h-full rounded-full border-4 border-transparent border-t-green-500 border-r-emerald-500"></div>
          </div>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 font-medium text-lg tracking-wide">Loading...</p>
      </div>
      
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  );
}

