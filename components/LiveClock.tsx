'use client';

import { useEffect, useState } from 'react';

export function LiveClock() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="hidden lg:flex items-center px-4 py-2 rounded-lg border border-[#2ecc71]/30 bg-[#0d1117]/80 shadow-[0_0_12px_rgba(46,204,113,0.12)]">
      <span className="font-mono text-sm font-semibold text-[#2ecc71] tabular-nums tracking-wide">
        {time || '--:--:--'}
      </span>
    </div>
  );
}
