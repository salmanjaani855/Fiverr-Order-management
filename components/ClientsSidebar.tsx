'use client';

import { useState, useEffect, useCallback } from 'react';

interface Client {
  _id: string;
  userId: string;
  name: string;
  createdAt: string;
}

interface ClientsSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function ClientsSidebar({ isOpen, onToggle }: ClientsSidebarProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchClients = useCallback(async () => {
    try {
      const response = await fetch('/api/clients', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setClients(data.clients || []);
        setError('');
      } else {
        console.error('Failed to fetch clients:', response.status);
        setError('Failed to load clients');
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
      setError('Error loading clients');
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleAddClient = async () => {
    if (!inputValue.trim()) return;

    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: inputValue }),
      });
      if (response.ok) {
        const data = await response.json();
        setClients(data.clients);
        setInputValue('');
        console.log('Client added successfully:', data);
      } else {
        const errorData = await response.text();
        console.error('Error response:', response.status, errorData);
        setError(`Error: ${response.status}`);
      }
    } catch (error) {
      console.error('Error adding client:', error);
      setError('Failed to add client');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    try {
      const response = await fetch('/api/clients', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ clientId }),
      });
      if (response.ok) {
        const data = await response.json();
        setClients(data.clients);
      } else {
        console.error('Error deleting client:', response.status);
        setError('Failed to delete client');
      }
    } catch (error) {
      console.error('Error deleting client:', error);
      setError('Error deleting client');
    }
  };

  return (
    <div
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-78 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 border-r border-gray-200 dark:border-gray-700 shadow-xl transition-transform duration-300 z-30 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } flex flex-col`}
    >
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            Clients
          </h2>
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-xs sm:text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="flex gap-2 w-full">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddClient()}
            placeholder="Add client..."
            className="flex-1 px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 transition-all"
          />
          <button
            onClick={handleAddClient}
            disabled={loading || !inputValue.trim()}
            className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-all hover:shadow-lg hover:shadow-cyan-500/30"
            title="Add client"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {clients.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">No clients yet</p>
          </div>
        ) : (
          clients.map((client) => (
            <div
              key={client._id}
              className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700/50 transition-all group hover:shadow-md"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {client.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{client.name}</span>
              </div>
              <button
                onClick={() => handleDeleteClient(client._id)}
                className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all opacity-0 group-hover:opacity-100 flex-shrink-0"
                title="Delete client"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
