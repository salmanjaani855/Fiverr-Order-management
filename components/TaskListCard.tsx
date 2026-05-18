'use client';

import { useState, useEffect } from 'react';

export interface TaskItem {
  text: string;
  completed: boolean;
}

export interface TaskListData {
  _id: string;
  name: string;
  date: string;
  items: TaskItem[];
}

interface TaskListCardProps {
  taskList: TaskListData;
  onUpdate: (id: string, items: TaskItem[]) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function isToday(dateStr: string) {
  const d = new Date(dateStr);
  const today = new Date();
  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  );
}

export function TaskListCard({ taskList, onUpdate, onDelete }: TaskListCardProps) {
  const [items, setItems] = useState<TaskItem[]>(taskList.items);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setItems(taskList.items);
  }, [taskList._id, taskList.items]);

  const visibleItems = items.filter((item) => item.text.trim().length > 0);
  const completedCount = visibleItems.filter((i) => i.completed).length;

  const handleToggle = async (index: number) => {
    const updated = items.map((item, i) =>
      i === index ? { ...item, completed: !item.completed } : item
    );
    setItems(updated);
    setSaving(true);
    try {
      await onUpdate(taskList._id, updated);
    } catch {
      setItems(items);
    } finally {
      setSaving(false);
    }
  };

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditValue(items[index].text);
  };

  const handleSaveEdit = async (index: number) => {
    if (editValue.trim() === '') {
      setEditingIndex(null);
      return;
    }
    const updated = items.map((item, i) =>
      i === index ? { ...item, text: editValue.trim() } : item
    );
    setItems(updated);
    setSaving(true);
    try {
      await onUpdate(taskList._id, updated);
      setEditingIndex(null);
    } catch {
      setItems(items);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this task list?')) return;
    setDeleting(true);
    try {
      await onDelete(taskList._id);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <article className="group relative bg-white dark:bg-gray-900 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-md hover:shadow-xl hover:shadow-cyan-500/5 transition-all duration-300 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-slate-500" />

      <header className="px-5 pt-5 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">{taskList.name}</h3>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                {formatDate(taskList.date)}
              </span>
              {isToday(taskList.date) && (
                <span className="text-xs font-semibold text-white bg-cyan-600 px-2 py-0.5 rounded-full">
                  Today
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
            title="Delete list"
            aria-label="Delete list"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
        {visibleItems.length > 0 && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {completedCount} of {visibleItems.length} completed
            {saving && <span className="ml-2 text-cyan-600">Saving...</span>}
          </p>
        )}
      </header>

      <ul className="p-4 space-y-1">
        {items.map((item, index) => {
          if (!item.text.trim()) return null;
          if (editingIndex === index) {
            return (
              <li key={index} className="py-2.5 px-3">
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => handleSaveEdit(index)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit(index);
                    if (e.key === 'Escape') setEditingIndex(null);
                  }}
                  autoFocus
                  className="w-full px-3 py-2 rounded-lg border border-cyan-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </li>
            );
          }
          return (
            <li key={index}>
              <label className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-slate-50/80 dark:hover:bg-slate-800/50 cursor-pointer transition-colors group/item">
                <button
                  type="button"
                  onClick={() => handleToggle(index)}
                  className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                    item.completed
                      ? 'bg-cyan-500 border-cyan-500 text-white shadow-sm shadow-cyan-500/40'
                      : 'border-slate-300 dark:border-slate-600 hover:border-cyan-500 bg-white dark:bg-gray-800'
                  }`}
                  aria-pressed={item.completed}
                >
                  {item.completed && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <span
                  onClick={() => handleStartEdit(index)}
                  className={`flex-1 text-sm leading-snug transition-all cursor-pointer hover:text-cyan-600 dark:hover:text-cyan-400 ${
                    item.completed
                      ? 'text-gray-400 dark:text-gray-500 line-through decoration-cyan-500/60'
                      : 'text-gray-800 dark:text-gray-200'
                  }`}
                >
                  {item.text}
                </span>
              </label>
            </li>
          );
        })}
      </ul>

      {visibleItems.length === 0 && (
        <p className="px-5 pb-5 text-sm text-gray-400 italic">No tasks in this list.</p>
      )}
    </article>
  );
}
