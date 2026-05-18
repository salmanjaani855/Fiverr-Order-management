'use client';

import { useData } from '@/context/DataContext';
import { useState, useEffect } from 'react';

interface AddOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddOrderModal({ isOpen, onClose }: AddOrderModalProps) {
  const { accounts, addOrder, refreshAccounts } = useData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    accountId: '',
    clientName: '',
    deadline: '',
    price: '',
    status: 'in-progress',
    description: '',
  });

  useEffect(() => {
    if (isOpen) {
      refreshAccounts();
      // Set default deadline to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setFormData(prev => ({
        ...prev,
        deadline: tomorrow.toISOString().slice(0, 16),
      }));
    }
  }, [isOpen, refreshAccounts]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateDuration = () => {
    if (!formData.deadline) return 0;
    const now = new Date();
    const deadline = new Date(formData.deadline);
    const diffMs = deadline.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    return Math.max(diffHours, 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.accountId) throw new Error('Please select an account');
      if (!formData.clientName) throw new Error('Client name is required');
      if (!formData.deadline) throw new Error('Deadline is required');
      if (!formData.price) throw new Error('Price is required');

      const duration = calculateDuration();

      await addOrder({
        accountId: formData.accountId,
        clientName: formData.clientName,
        duration: duration,
        price: Number(formData.price),
        status: formData.status as any,
        description: formData.description,
      } as any);

      setFormData({
        accountId: '',
        clientName: '',
        deadline: '',
        price: '',
        status: 'in-progress',
        description: '',
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add order');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const durationHours = calculateDuration();
  const days = Math.floor(durationHours / 24);
  const hours = durationHours % 24;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="fiverr-card max-w-2xl w-full p-8 border-[#2ecc71]/20 shadow-[0_0_40px_rgba(46,204,113,0.08)]">
        <h2 className="text-2xl font-bold text-white mb-8">Add New Order</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-600 text-red-700 dark:text-red-400 px-4 py-4 rounded-lg text-sm font-medium animate-in">
              ⚠️ {error}
            </div>
          )}

          {/* Account Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Select Account</label>
            {accounts.length === 0 ? (
              <div className="w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-center">
                No accounts available
              </div>
            ) : (
              <select
                name="accountId"
                value={formData.accountId}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-900/30 outline-none cursor-pointer hover:border-green-400 transition-all duration-200 font-medium"
                required
              >
                <option value="">-- Select an Account --</option>
                {accounts.map((acc) => (
                  <option key={acc._id} value={acc._id}>
                    {acc.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Client Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Client Name</label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-900/30 outline-none placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
              placeholder="John Doe"
              required
            />
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Deadline (Date & Time)</label>
            <input
              type="datetime-local"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-900/30 outline-none transition-all duration-200 cursor-pointer"
              required
            />
            {formData.deadline && (
              <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-xs font-medium text-green-700 dark:text-green-400 mb-2">📊 Duration Preview:</p>
                <p className="text-sm font-bold text-green-900 dark:text-green-300">
                  {days > 0 ? `${days}d ${hours}h` : `${hours}h`}
                </p>
              </div>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Price ($)</label>
            <input
              type="number"
              step="1"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-900/30 outline-none placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
              placeholder="100"
              required
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-900/30 outline-none cursor-pointer hover:border-green-400 transition-all duration-200"
            >
              <option value="in-progress">In Progress</option>
              <option value="revision">Revision</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-900/30 outline-none resize-none placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
              rows={3}
              placeholder="Order details..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg"
            >
              {loading ? '⏳ Adding...' : '✓ Add Order'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        .animate-scale-in { animation: scaleIn 0.3s ease-out; }
      `}</style>
    </div>
  );
}
