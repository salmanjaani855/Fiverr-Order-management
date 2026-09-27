'use client';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t border-[#3b4451] bg-[#2c2f33] text-[#eee] transition-colors duration-300">
      <div className="w-full px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1a91fa] shadow-[0_0_10px_rgba(26,145,250,0.45)]"></span>
            <span className="text-sm font-medium text-[#eee]">Fiverr</span>
            <span className="text-sm font-medium text-[#1a91fa]">Orders</span>
          </div>

          <p className="text-sm text-[#cedbdc]">
            © {currentYear} All rights reserved.
          </p>

          <div className="text-xs text-[#cedbdc]">
            v2.0.0
          </div>
        </div>
      </div>
    </footer>
  );
}
