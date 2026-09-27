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

      <div className="neo-card p-6">
        <p className="text-[#c8d3f1] text-sm font-medium uppercase tracking-wider">
          Total Orders
        </p>

        <p className="text-4xl font-bold text-white mt-3">
          {stats.totalOrders}
        </p>

        <div className="mt-4 h-1.5 w-full rounded-full overflow-hidden" style={{ boxShadow: 'inset 3px 3px 5px #000, inset -5px -5px 5px #3B4451' }}>
          <div className="h-full w-1/3 bg-[#1a91fa] rounded-full"></div>
        </div>
      </div>

      <div className="neo-card p-6">
        <p className="text-[#c8d3f1] text-sm font-medium uppercase tracking-wider">
          Revisions
        </p>

        <p className="text-4xl font-bold text-white mt-3">
          {stats.revisions}
        </p>

        <div className="mt-4 h-1.5 w-full rounded-full overflow-hidden" style={{ boxShadow: 'inset 3px 3px 5px #000, inset -5px -5px 5px #3B4451' }}>
          <div className="h-full w-1/4 bg-[#1a91fa] rounded-full"></div>
        </div>
      </div>

      <div className="neo-card p-6">
        <p className="text-[#c8d3f1] text-sm font-medium uppercase tracking-wider">
          Total Revenue
        </p>

        <p className="text-4xl font-bold text-white mt-3">
          ${stats.totalEarnings.toFixed()}
        </p>

        <div className="mt-4 h-1.5 w-full rounded-full overflow-hidden" style={{ boxShadow: 'inset 3px 3px 5px #000, inset -5px -5px 5px #3B4451' }}>
          <div className="h-full w-2/3 bg-[#1a91fa] rounded-full"></div>
        </div>
      </div>

    </div>
  </div>
</div>


  );
}
