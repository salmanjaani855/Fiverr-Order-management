'use client';

import { useData } from '@/context/DataContext';
import { useMemo } from 'react';
import { sortAccounts } from '@/lib/account-order';
import { RiDashboardHorizontalFill } from "react-icons/ri";
import { TbFilterSearch } from "react-icons/tb";

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { accounts, orders, selectedAccountId, setSelectedAccountId, selectedStatus, setSelectedStatus } = useData();

  const accountStats = useMemo(() => {
    return sortAccounts(accounts).map((account) => ({
      ...account,
      orderCount: orders.filter((o) => o.accountId._id === account._id).length,
    }));
  }, [accounts, orders]);

  const statusCounts = useMemo(() => {
    return {
      'in-progress': orders.filter(o => o.status === 'in-progress').length,
      'revision': orders.filter(o => o.status === 'revision').length,
      'delivered': orders.filter(o => o.status === 'delivered').length,
    };
  }, [orders]);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 z-30 md:hidden"
          onClick={onClose}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
<div
  className={`fixed md:static inset-y-0 left-0 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-[100dvh] overflow-y-auto transition-all duration-300 ease-in-out z-40 ${
    isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
  }`}
>
        <div className="p-6 space-y-8">
          {/* Accounts Section */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span><RiDashboardHorizontalFill /></span> Accounts
            </h2>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setSelectedAccountId(null);
                  onClose?.();
                }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                  selectedAccountId === null
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-semibold'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span>All Accounts</span>
                  <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full font-medium">
                    {orders.length}
                  </span>
                </div>
              </button>

              {accountStats.map((account) => (
                <button
                  key={account._id}
                  onClick={() => {
                    setSelectedAccountId(account._id);
                    onClose?.();
                  }}
                  className={`w-full cursor-pointer text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                    selectedAccountId === account._id
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-semibold'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="truncate">{account.name}</span>
                    <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full font-medium">
                      {account.orderCount}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Filter Section */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span><TbFilterSearch /></span> Filter by Status
            </h3>
            <div className="space-y-2 ">
              <button
                onClick={() => {
                  setSelectedStatus(null);
                  onClose?.();
                }}
                className={`w-full cursor-pointer text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                  selectedStatus === null
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-semibold'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span>All</span>
                  <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full font-medium">
                    {orders.length}
                  </span>
                </div>
              </button>

<button
  onClick={() => {
    setSelectedStatus('in-progress');
    onClose?.();
  }}
  className={`w-full cursor-pointer text-left px-4 py-3 rounded-lg transition-all duration-200 flex justify-between items-center ${
    selectedStatus === 'in-progress'
      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-semibold'
      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
  }`}
>
  <span className="flex items-center gap-2">
    {/* Progress / Loading SVG Icon */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="w-5 h-5 text-green-600 dark:text-green-400"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v6l4 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>

    In Progress
  </span>

  <span className="text-xs bg-green-200 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full font-semibold">
    {statusCounts['in-progress']}
  </span>
</button>

<button
  onClick={() => {
    setSelectedStatus('revision');
    onClose?.();
  }}
  className={`w-full cursor-pointer text-left px-4 py-3 rounded-lg transition-all duration-200 flex justify-between items-center ${
    selectedStatus === 'revision'
      ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-semibold'
      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
  }`}
>
  <span className="flex items-center gap-2">
    {/* Revision - Document Review Icon */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="w-5 h-5 text-red-600 dark:text-red-400"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h6m-6 4h6M7 4h7l3 3v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"
      />
    </svg>

    Revision
  </span>

  <span className="text-xs bg-red-200 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-1 rounded-full font-semibold">
    {statusCounts['revision']}
  </span>
</button>

<button
  onClick={() => {
    setSelectedStatus('delivered');
    onClose?.();
  }}
  className={`w-full cursor-pointer text-left px-4 py-3 rounded-lg transition-all duration-200 flex justify-between items-center ${
    selectedStatus === 'delivered'
      ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 font-semibold'
      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
  }`}
>
  <span className="flex items-center gap-2">
    {/* Delivered SVG Icon */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="w-5 h-5 text-yellow-600 dark:text-yellow-400"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>

    Delivered
  </span>

  <span className="text-xs bg-yellow-200 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-1 rounded-full font-semibold">
    {statusCounts['delivered']}
  </span>
</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
