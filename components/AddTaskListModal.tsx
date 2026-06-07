'use client';

import { useState, useEffect } from 'react';

export interface TaskItemInput {
  text: string;
  completed: boolean;
}

interface AddTaskListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const emptyItems = (): TaskItemInput[] =>
  Array.from({ length: 6 }, () => ({ text: '', completed: false }));

export function AddTaskListModal({ isOpen, onClose, onCreated }: AddTaskListModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('Todo List');
  const [date, setDate] = useState('');
  const [items, setItems] = useState<TaskItemInput[]>(emptyItems);

  useEffect(() => {
    if (isOpen) {
      const today = new Date();
      setDate(today.toISOString().slice(0, 10));
      setName('Todo List');
      setItems(emptyItems());
      setError('');
    }
  }, [isOpen]);

  const handleItemChange = (index: number, value: string) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, text: value } : item)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/task-lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, date, items }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create task list');
      }

      onCreated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="tasks-card w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 flex justify-between items-center border-b border-gray-300 dark:border-[#2a2f38] bg-gray-50 dark:bg-[#0f1218]">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">New task list</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white p-1 rounded-lg hover:bg-gray-300/30 dark:hover:bg-white/5 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-400 mb-1.5 uppercase tracking-wide text-[11px]">
              List name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Todo List"
              className="tasks-input w-full px-4 py-2.5"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-400 mb-1.5 uppercase tracking-wide text-[11px]">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="tasks-input w-full px-4 py-2.5"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-400 mb-2 uppercase tracking-wide text-[11px]">
              Tasks (up to 6)
            </label>
            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="w-6 h-6 flex-shrink-0 rounded border border-gray-400 dark:border-slate-600 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-slate-500">
                    {index + 1}
                  </span>
                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) => handleItemChange(index, e.target.value)}
                    placeholder={`Task ${index + 1}`}
                    className="tasks-input flex-1 px-3 py-2 text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-400 dark:border-slate-600 text-gray-700 dark:text-slate-300 hover:bg-gray-200/30 dark:hover:bg-white/5 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-700 dark:bg-slate-600 hover:bg-slate-800 dark:hover:bg-slate-500 text-white font-semibold disabled:opacity-60 border border-slate-600 dark:border-slate-500/40 transition-all"
            >
              {loading ? 'Saving...' : 'Create list'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
