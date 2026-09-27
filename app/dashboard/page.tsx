'use client';

import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { Footer } from '@/components/Footer';
import { StatsBoxes } from '@/components/StatsBoxes';
import { OrdersTable } from '@/components/OrdersTable';
import { AddOrderModal } from '@/components/AddOrderModal';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen neo-app">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#3b4451] border-t-[#1a91fa]"></div>
          <p className="mt-4 text-[#cedbdc] font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen neo-app flex flex-col">
      <Navbar />



      

      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 flex flex-col overflow-auto w-full">
          <div className="flex-1 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-[#eee]">Fiverr Orders</h1>
                  <p className="text-[#cedbdc] text-sm mt-1">Manage your orders here</p>
                </div>

                <div className="flex w-full sm:w-auto gap-3 items-center">
                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="md:hidden p-2 neo-icon-btn"
                    title="Toggle sidebar"
                  >
                    <svg className="w-6 h-6 text-[#eee]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                 
                  <button
                    onClick={() => setModalOpen(true)}
                    className="flex flex-1 sm:flex-none justify-center items-center gap-2 neo-btn cursor-pointer px-4 sm:px-6 py-3 text-[#1a91fa]"
                  >
                    <svg className="w-5 h-5 " fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Order
                  </button>
                </div>
              </div>

              <StatsBoxes />
              <OrdersTable onAddOrder={() => setModalOpen(true)} />
            </div>
          </div>

          <Footer />
        </div>
      </div>

      <AddOrderModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

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
