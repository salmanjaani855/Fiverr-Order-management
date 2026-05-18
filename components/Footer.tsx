'use client';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-12 transition-colors duration-300">
      <div className="w-full px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
            <span className="text-sm font-medium text-white dark:text-white">Fiverr</span>
            <span className="text-sm font-medium text-green-400 dark:text-green-400">Orders</span>
          </div>

          <p className="text-sm text-gray-100 dark:text-gray-100">
            © {currentYear} All rights reserved.
          </p>

          <div className="text-xs text-gray-500 dark:text-gray-500">
            v1.0.0
          </div>
        </div>
      </div>
    </footer>
  );
}
