'use client';

import { useData } from '@/context/DataContext';
import { useMemo } from 'react';

export function StatsBoxes() {
  const { orders } = useData();

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const revisions = orders.filter((o) => o.status === 'revision').length;
    const totalEarnings = orders.reduce((sum, o) => sum + o.price, 0);

    return { totalOrders, revisions, totalEarnings };
  }, [orders]);

  return (
    

<div className="mb-8">
  <div className="rounded-xl p-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

      <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/10 hover:border-white/20 transform hover:-translate-y-1 transition-all duration-300">
        <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">
          Total Orders
        </p>

        <p className="text-4xl font-bold text-white mt-3">
          {stats.totalOrders}
        </p>

        <div className="mt-4 h-1.5 w-full bg-[#222a35] rounded-full overflow-hidden">
          <div className="h-full w-1/3 bg-[#1dbf73] rounded-full shadow-[0_0_20px_#1dbf73]"></div>
        </div>
      </div>

      <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/10 hover:border-white/20 transform hover:-translate-y-1 transition-all duration-300">
        <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">
          Revisions
        </p>

        <p className="text-4xl font-bold text-white mt-3">
          {stats.revisions}
        </p>

        <div className="mt-4 h-1.5 w-full bg-[#222a35] rounded-full overflow-hidden">
          <div className="h-full w-1/4 bg-[#1dbf73] rounded-full shadow-[0_0_20px_#1dbf73]"></div>
        </div>
      </div>

      <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/10 hover:border-white/20 transform hover:-translate-y-1 transition-all duration-300">
        <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">
          Total Revenue
        </p>

        <p className="text-4xl font-bold text-white mt-3">
          ${stats.totalEarnings.toFixed()}
        </p>

        <div className="mt-4 h-1.5 w-full bg-[#222a35] rounded-full overflow-hidden">
          <div className="h-full w-2/3 bg-[#1dbf73] rounded-full shadow-[0_0_20px_#1dbf73]"></div>
        </div>
      </div>

    </div>
  </div>
</div>


  );
}
