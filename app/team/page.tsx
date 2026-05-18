'use client';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { TeamAssignmentForm } from '@/components/TeamAssignmentForm';
import { ClientsSidebar } from '@/components/ClientsSidebar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function TeamPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [clientsSidebarOpen, setClientsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 dark:border-gray-700 border-t-green-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-300">
      <Navbar />

      {clientsSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 top-16 md:hidden"
          onClick={() => setClientsSidebarOpen(false)}
        />
      )}

      <div className="flex flex-1 overflow-hidden">
        <ClientsSidebar isOpen={clientsSidebarOpen} onToggle={() => setClientsSidebarOpen(!clientsSidebarOpen)} />

        <div className="flex-1 p-3 md:p-6 lg:p-8 transition-all duration-300 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6 md:mb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
<div className="flex-1 flex justify-center items-center">
  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white text-center">
    Team Assignment
  </h1>
</div>
                <button
                  onClick={() => setClientsSidebarOpen(!clientsSidebarOpen)}
                  className="w-full cursor-pointer sm:w-auto p-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white transition-all hover:shadow-lg hover:shadow-cyan-500/30 flex items-center justify-center gap-2 font-medium"
                  title="Toggle clients sidebar"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <span className="text-sm sm:text-base">Clients</span>
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8 border border-gray-200 dark:border-gray-800 transition-colors duration-300">
              <TeamAssignmentForm />
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
