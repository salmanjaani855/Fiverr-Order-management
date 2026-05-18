'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

interface Account {
  _id: string;
  name: string;
}

interface Order {
  _id: string;
  clientName: string;
  duration: number;
  price: number;
  status: 'in-progress' | 'revision' | 'delivered';
  description: string;
  createdAt: string;
  accountId: Account;
}

interface TeamMember {
  _id: string;
  name: string;
  project: string;
  clientName: string;
  backgroundLyrics: string;
  assignedMembers: string[];
}

interface DataContextType {
  accounts: Account[];
  orders: Order[];
  teamMembers: TeamMember[];
  loading: boolean;
  selectedAccountId: string | null;
  setSelectedAccountId: (id: string | null) => void;
  selectedStatus: string | null;
  setSelectedStatus: (status: string | null) => void;
  refreshOrders: () => Promise<void>;
  refreshAccounts: () => Promise<void>;
  refreshTeamMembers: () => Promise<void>;
  addOrder: (order: Omit<Order, '_id' | 'createdAt'>) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  updateOrder: (id: string, order: Partial<Order>) => Promise<void>;
  deleteTeamMember: (id: string) => Promise<void>;
  updateTeamMember: (id: string, data: Partial<TeamMember>) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const refreshAccounts = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const response = await fetch('/api/accounts', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setAccounts(data.accounts || []);
        // Don't auto-select account - keep null to show all
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  }, [isAuthenticated]);

  const refreshOrders = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const response = await fetch('/api/orders', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  }, [isAuthenticated]);

  const refreshTeamMembers = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const response = await fetch('/api/team-members', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setTeamMembers(data.teamMembers || []);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshAccounts();
      refreshOrders();
      refreshTeamMembers();
    }
  }, [isAuthenticated, refreshAccounts, refreshOrders, refreshTeamMembers]);

  const addOrder = async (order: Omit<Order, '_id' | 'createdAt'>) => {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
      credentials: 'include',
    });

    if (response.ok) {
      await refreshOrders();
    } else {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add order');
    }
  };

  const deleteOrder = async (id: string) => {
    const response = await fetch(`/api/orders/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (response.ok) {
      await refreshOrders();
    } else {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete order');
    }
  };

  const updateOrder = async (id: string, order: Partial<Order>) => {
    const response = await fetch(`/api/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
      credentials: 'include',
    });

    if (response.ok) {
      await refreshOrders();
    } else {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update order');
    }
  };

  const deleteTeamMember = async (id: string) => {
    const response = await fetch(`/api/team-members/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (response.ok) {
      await refreshTeamMembers();
    } else {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete team member');
    }
  };

  const updateTeamMember = async (id: string, data: Partial<TeamMember>) => {
    const response = await fetch(`/api/team-members/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    if (response.ok) {
      await refreshTeamMembers();
    } else {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update team member');
    }
  };

  return (
    <DataContext.Provider
      value={{
        accounts,
        orders,
        teamMembers,
        loading,
        selectedAccountId,
        setSelectedAccountId,
        selectedStatus,
        setSelectedStatus,
        refreshOrders,
        refreshAccounts,
        refreshTeamMembers,
        addOrder,
        deleteOrder,
        updateOrder,
        deleteTeamMember,
        updateTeamMember,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}
