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
    <div className="animate-fade-in fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-2 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="animate-pop-in neo-modal my-auto max-h-[calc(100dvh-1rem)] w-full max-w-2xl overflow-y-auto p-4 sm:max-h-[calc(100dvh-2rem)] sm:p-6 md:p-8">
        <h2 className="text-2xl font-bold text-[#eee] mb-8">
          Add New <span className="text-[#1a91fa]">Order</span>
        </h2>

        <form onSubmit={handleSubmit} className="order-form-stagger space-y-6">
          {error && (
            <div className="neo-field px-4 py-4 text-sm font-medium !text-red-300 animate-in">
              ⚠️ {error}
            </div>
          )}

          {/* Account Selection */}
          <div>
            <label className="block text-sm font-semibold text-[#cedbdc] mb-3">Select Account</label>
            {accounts.length === 0 ? (
              <div className="neo-field w-full px-4 py-3 !text-[#cedbdc] text-center">
                No accounts available
              </div>
            ) : (
              <select
                name="accountId"
                value={formData.accountId}
                onChange={handleChange}
                className="neo-field w-full px-4 py-3 placeholder:text-gray-500 transition-shadow duration-200 cursor-pointer font-medium"
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
            <label className="block text-sm font-semibold text-[#cedbdc] mb-3">Client Name</label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              className="neo-field w-full px-4 py-3 placeholder:text-gray-500 transition-shadow duration-200"
              placeholder="John Doe"
              required
            />
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-semibold text-[#cedbdc] mb-3">Deadline (Date & Time)</label>
            <input
              type="datetime-local"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="neo-field w-full px-4 py-3 placeholder:text-gray-500 transition-shadow duration-200 cursor-pointer [color-scheme:dark]"
              required
            />
            {formData.deadline && (
              <div className="neo-surface mt-4 p-3">
                <p className="text-xs font-medium text-[#cedbdc] mb-2">📊 Duration Preview:</p>
                <p className="text-sm font-bold text-[#1a91fa]">
                  {days > 0 ? `${days}d ${hours}h` : `${hours}h`}
                </p>
              </div>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-semibold text-[#cedbdc] mb-3">Price ($)</label>
            <input
              type="number"
              step="1"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="neo-field w-full px-4 py-3 placeholder:text-gray-500 transition-shadow duration-200"
              placeholder="100"
              required
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-[#cedbdc] mb-3">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="neo-field w-full px-4 py-3 placeholder:text-gray-500 transition-shadow duration-200 cursor-pointer"
            >
              <option value="in-progress">In Progress</option>
              <option value="revision">Revision</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-[#cedbdc] mb-3">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="neo-field w-full px-4 py-3 placeholder:text-gray-500 transition-shadow duration-200 resize-none"
              rows={3}
              placeholder="Order details..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-[#3b4451]">
            <button
              type="button"
              onClick={onClose}
              className="neo-btn flex-1 px-4 py-3 cursor-pointer active:shadow-[var(--neo-concave)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="neo-btn flex-1 px-4 py-3 cursor-pointer !text-[#1a91fa] hover:!text-white active:shadow-[var(--neo-concave)] disabled:opacity-50 disabled:cursor-not-allowed"
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
        @keyframes popIn {
          0% {
            opacity: 0;
            transform: translateY(24px) scale(0.92);
          }
          60% {
            opacity: 1;
            transform: translateY(-4px) scale(1.01);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes fieldUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in { animation: fadeIn 0.25s ease-out; }
        .animate-scale-in { animation: scaleIn 0.3s ease-out; }
        .animate-pop-in { animation: popIn 0.45s cubic-bezier(0.22, 1, 0.36, 1); }
        .order-form-stagger > * {
          opacity: 0;
          animation: fieldUp 0.35s ease-out forwards;
        }
        .order-form-stagger > *:nth-child(1) { animation-delay: 0.12s; }
        .order-form-stagger > *:nth-child(2) { animation-delay: 0.17s; }
        .order-form-stagger > *:nth-child(3) { animation-delay: 0.22s; }
        .order-form-stagger > *:nth-child(4) { animation-delay: 0.27s; }
        .order-form-stagger > *:nth-child(5) { animation-delay: 0.32s; }
        .order-form-stagger > *:nth-child(6) { animation-delay: 0.37s; }
        .order-form-stagger > *:nth-child(7) { animation-delay: 0.42s; }
        .order-form-stagger > *:nth-child(8) { animation-delay: 0.47s; }
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in,
          .animate-pop-in,
          .order-form-stagger > * {
            animation-duration: 1ms;
            animation-delay: 0s;
          }
        }
      `}</style>
    </div>
  );
}
