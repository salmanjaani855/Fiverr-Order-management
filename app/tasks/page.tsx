'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AddTaskListModal } from '@/components/AddTaskListModal';
import { TaskListCard, TaskItem, TaskListData } from '@/components/TaskListCard';
import { useAuth } from '@/context/AuthContext';

export default function TasksPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [taskLists, setTaskLists] = useState<TaskListData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchTaskLists = useCallback(async () => {
    try {
      const response = await fetch('/api/task-lists', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setTaskLists(data.taskLists || []);
      }
    } catch (error) {
      console.error('Error fetching task lists:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTaskLists();
    }
  }, [isAuthenticated, fetchTaskLists]);

  const handleUpdate = async (id: string, items: TaskItem[]) => {
    const response = await fetch(`/api/task-lists/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ items }),
    });
    if (!response.ok) {
      throw new Error('Failed to update');
    }
    const data = await response.json();
    setTaskLists((prev) => prev.map((list) => (list._id === id ? data.taskList : list)));
  };

  const handleDelete = async (id: string) => {
    const response = await fetch(`/api/task-lists/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to delete');
    }
    setTaskLists((prev) => prev.filter((list) => list._id !== id));
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-200 dark:border-slate-700 border-t-cyan-600" />
          <p className="mt-4 text-slate-800 dark:text-slate-300 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900 flex flex-col transition-colors duration-300">
      <Navbar />

      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Tasks</h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  Plan your day with todo lists — up to 6 tasks per list
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add task list
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-slate-200 dark:border-slate-700 border-t-cyan-600" />
              </div>
            ) : taskLists.length === 0 ? (
              <div className="text-center py-20 px-6 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-gray-900/60">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <svg className="w-8 h-8 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No task lists yet</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                  Click the button above to create your first todo list for today or upcoming days.
                </p>
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-medium transition-colors"
                >
                  Create your first list
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {taskLists.map((list) => (
                  <TaskListCard
                    key={list._id}
                    taskList={list}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
      </div>

      <Footer />

      <AddTaskListModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={fetchTaskLists}
      />
    </div>
  );
}
