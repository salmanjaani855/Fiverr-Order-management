'use client';

import React from 'react';
import { useData } from '@/context/DataContext';
import { useMemo, useState, useEffect } from 'react';
import { FiEdit } from "react-icons/fi";
import { getAccountId, getRemainingTimeMs, getRemainingTime } from '@/lib/order-utils';

const STATUS_COLORS = {
  'in-progress': { bg: 'neo-chip', text: 'text-[#1a91fa]', dot: 'bg-[#1a91fa]' },
  'revision': { bg: 'neo-chip', text: 'text-[#cedbdc]', dot: 'bg-[#8a88b7]' },
  'delivered': { bg: 'neo-chip', text: 'text-[#eee]', dot: 'bg-[#144884]' },
};

const STATUS_LABELS = {
  'in-progress': 'In Progress',
  'revision': 'Revision',
  'delivered': 'Delivered',
};

interface OrdersTableProps {
  onAddOrder?: () => void;
}

export function OrdersTable({ onAddOrder }: OrdersTableProps) {
  const { orders, selectedAccountId, selectedStatus, deleteOrder, updateOrder } = useData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDescription, setEditDescription] = useState('');
  const [expandedDescId, setExpandedDescId] = useState<string | null>(null);
  const [timeRefresh, setTimeRefresh] = useState(0);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<any>({});
  const [savingRowId, setSavingRowId] = useState<string | null>(null);
  const [savedRowId, setSavedRowId] = useState<string | null>(null);
  const [savingDescriptionId, setSavingDescriptionId] = useState<string | null>(null);
  const [savedDescriptionId, setSavedDescriptionId] = useState<string | null>(null);
  const [deleteState, setDeleteState] = useState<{
    id: string;
    phase: 'pending' | 'exiting';
  } | null>(null);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setTimeRefresh((prev) => prev + 1), 30000);
    return () => clearInterval(timer);
  }, []);

  const filteredOrders = useMemo(() => {
    let filtered = orders;

    if (selectedAccountId) {
      filtered = filtered.filter((o) => getAccountId(o.accountId) === selectedAccountId);
    }

    if (selectedStatus) {
      filtered = filtered.filter((o) => o.status === selectedStatus);
    }

    // Sort by remaining time (shortest first — e.g. 2d before 3d before 4d)
    filtered = filtered.sort((a, b) => {
      const aRemaining = getRemainingTimeMs(a.createdAt, a.duration, a.isPaused, a.pausedTime);
      const bRemaining = getRemainingTimeMs(b.createdAt, b.duration, b.isPaused, b.pausedTime);
      return aRemaining - bRemaining;
    });

    return filtered;
  }, [orders, selectedAccountId, selectedStatus, timeRefresh]);

  const deletingOrder = deleteState
    ? orders.find((order) => order._id === deleteState.id)
    : undefined;
  const displayedOrders = deletingOrder && !filteredOrders.some((order) => order._id === deleteState?.id)
    ? [...filteredOrders, deletingOrder]
    : filteredOrders;

  const handleEditDescription = async (id: string, description: string) => {
    setActionError('');
    setSavingDescriptionId(id);
    try {
      await updateOrder(id, { description });
      setEditingId(null);
      setSavedDescriptionId(id);
      window.setTimeout(() => setSavedDescriptionId((current) => current === id ? null : current), 1000);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Failed to save description');
    } finally {
      setSavingDescriptionId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setActionError('');
    setDeleteState({ id, phase: 'pending' });
    try {
      await deleteOrder(id);
      setDeleteState({ id, phase: 'exiting' });
      await new Promise((resolve) => window.setTimeout(resolve, 260));
      setDeleteState(null);
    } catch (error) {
      setDeleteState(null);
      setActionError(error instanceof Error ? error.message : 'Failed to delete order');
    }
  };

  const handleEditRow = (order: any) => {
    setEditingRowId(order._id);
    setEditValues({
      clientName: order.clientName,
      price: order.price,
      duration: order.isPaused ? '-' : String(order.duration),
      status: order.status,
    });
  };

  const handleSaveRow = async () => {
    if (!editingRowId) return;

    const id = editingRowId;
    const order = orders.find((o) => o._id === id);
    const timeVal = String(editValues.duration ?? '').trim();

    const payload: Record<string, unknown> = {
      clientName: editValues.clientName,
      price: editValues.price,
      status: editValues.status,
    };

    if (timeVal === '-') {
      if (order && !order.isPaused) {
        const remainingMs = getRemainingTimeMs(order.createdAt, order.duration, false, 0);
        payload.isPaused = true;
        payload.pausedTime = remainingMs;
      }
    } else {
      const duration = parseFloat(timeVal);
      if (!Number.isNaN(duration)) {
        payload.duration = duration;
        if (order?.isPaused) {
          const remainingMs = order.pausedTime || 0;
          const durationMs = duration * 3600000;
          payload.isPaused = false;
          payload.pausedTime = 0;
          payload.createdAt = new Date(Date.now() - (durationMs - remainingMs)).toISOString();
        }
      }
    }

    setActionError('');
    setSavingRowId(id);
    try {
      await updateOrder(id, payload);
      setEditingRowId(null);
      setEditValues({});
      setSavedRowId(id);
      window.setTimeout(() => setSavedRowId((current) => current === id ? null : current), 1000);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Failed to save order');
    } finally {
      setSavingRowId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingRowId(null);
    setEditValues({});
  };

  return (
    <div className="space-y-4">

      {actionError && (
        <div role="alert" className="rounded-lg border border-red-500/40 bg-red-950/30 px-4 py-3 text-sm text-red-300">
          {actionError}
        </div>
      )}

      {displayedOrders.length === 0 ? (
        <div className="neo-surface p-16 text-center">
          <p className="text-[#cedbdc] text-lg font-medium">No Orders Found</p>
          {onAddOrder && (
            <button
              type="button"
              onClick={onAddOrder}
              className="mt-6 inline-flex items-center gap-2 neo-btn py-2.5 px-5 text-[#1a91fa]"
            >
              + Add Order
            </button>
          )}
        </div>
      ) : (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-3">
          <thead>
            <tr>
              <th className="px-6 py-2 text-left text-xs font-bold text-[#8a88b7] uppercase tracking-wider">Client</th>
              <th className="px-6 py-2 text-left text-xs font-bold text-[#8a88b7] uppercase tracking-wider">Price</th>
              <th className="px-6 py-2 text-left text-xs font-bold text-[#8a88b7] uppercase tracking-wider">Status</th>
              <th className="px-6 py-2 text-left text-xs font-bold text-[#8a88b7] uppercase tracking-wider">Remaining Time</th>
              <th className="px-6 py-2 text-right text-xs font-bold text-[#8a88b7] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedOrders.map((order) => {
              const colors = STATUS_COLORS[order.status];
              const remaining = getRemainingTime(
                order.createdAt,
                order.duration,
                order.isPaused,
                order.pausedTime
              );
              const isEditing = editingRowId === order._id;

              return (
                <React.Fragment key={order._id}>
                  <tr className={`neo-row ${
                    deleteState?.id === order._id
                      ? deleteState.phase === 'exiting'
                        ? 'animate-order-delete'
                        : ''
                      : savedRowId === order._id
                        ? 'animate-order-saved'
                        : ''
                  }`}>
                    <td className="px-6 py-4 text-sm">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editValues.clientName}
                          onChange={(e) => setEditValues({ ...editValues, clientName: e.target.value })}
                          className="w-full px-3 py-2 neo-field"
                        />
                      ) : (
                        <span className="text-white font-semibold">{order.clientName}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editValues.price}
                          onChange={(e) => setEditValues({ ...editValues, price: parseFloat(e.target.value) })}
                          className="w-full px-3 py-2 neo-field"
                        />
                      ) : (
                        <span className="text-[#1a91fa] font-bold">${order.price.toFixed()}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <select
                          value={editValues.status}
                          onChange={(e) => setEditValues({ ...editValues, status: e.target.value })}
                          className="w-full px-3 py-2 neo-field"
                        >
                          <option value="in-progress">In Progress</option>
                          <option value="revision">Revision</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      ) : (
                        <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold ${colors.bg} ${colors.text}`}>
                          <span className={`w-2 h-2 rounded-full ${colors.dot}`}></span>
                          {STATUS_LABELS[order.status]}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editValues.duration}
                          onChange={(e) => setEditValues({ ...editValues, duration: e.target.value })}
                          className="w-full px-3 py-2 neo-field"
                          placeholder="Hours or -"
                        />
                      ) : order.isPaused ? (
                        <div
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all duration-200 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400`}
                        >
                          <span>⏱️</span>-
                        </div>
                      ) : (
                        <div
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all duration-200 ${
                            remaining.isLow
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 animate-pulse'
                              : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          }`}
                        >
                          <span>⏱️</span>
                          {remaining.display}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-sm">
                      {isEditing ? (
                        <div className="space-x-2">
                          <button
                            onClick={handleSaveRow}
                            disabled={savingRowId === order._id}
                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:cursor-wait disabled:opacity-80 text-white rounded-lg text-xs font-semibold transition-all duration-200"
                          >
                            {savingRowId === order._id ? (
                              <>
                                <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Saving...
                              </>
                            ) : savedRowId === order._id ? '✓ Saved' : '✓ Save'}
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="px-3 py-2 bg-gray-600 dark:bg-gray-700 hover:bg-gray-700 text-white rounded-lg text-xs font-semibold transition-all duration-200"
                          >
                            ✕ Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="space-x-2">
                          {order.description && (
                            <button
                              onClick={() => setExpandedDescId(expandedDescId === order._id ? null : order._id)}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold transition-colors duration-200 inline-flex items-center gap-1"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                              </svg>
                            </button>
                          )}
                          <button
                            onClick={() => handleEditRow(order)}
                            className="text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 font-semibold transition-colors duration-200 inline-flex items-center gap-1"
                            title="Edit order"
                          >
                            {/* <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg> */}
                            <FiEdit className='cursor-pointer' />
                          </button>
                          <button
                            onClick={() => handleDelete(order._id)}
                            disabled={deleteState?.id === order._id}
                            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 disabled:cursor-wait disabled:opacity-80 font-semibold transition-colors duration-200 inline-flex items-center gap-1"
                            title={deleteState?.id === order._id ? 'Deleting order' : 'Delete order'}
                          >
                            {deleteState?.id === order._id && deleteState.phase === 'pending' ? (
                              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-label="Deleting">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4 cursor-pointer" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>

                  {expandedDescId === order._id && order.description && !isEditing && (
                    <tr className="bg-gray-50 dark:bg-gray-800/30">
                      <td colSpan={5} className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="space-y-3">
                          <p className="font-bold text-gray-900 dark:text-white flex items-center gap-2">📝 Description</p>
                          {editingId === order._id ? (
                            <div className="space-y-3">
                              <textarea
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-white rounded-lg text-sm resize-none focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-900/30 outline-none transition-all duration-200"
                                rows={3}
                              />
                              <div className="flex gap-3">
                                <button
                                  onClick={() => handleEditDescription(order._id, editDescription)}
                                  disabled={savingDescriptionId === order._id}
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:cursor-wait disabled:opacity-80 text-white rounded-lg text-sm font-semibold transition-all duration-200 transform hover:scale-105"
                                >
                                  {savingDescriptionId === order._id ? (
                                    <>
                                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                      </svg>
                                      Saving...
                                    </>
                                  ) : savedDescriptionId === order._id ? '✓ Saved' : '✓ Save'}
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="px-4 py-2 bg-gray-600 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-lg text-sm font-semibold transition-all duration-200 transform hover:scale-105"
                                >
                                  ✕ Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <p className="text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700 leading-relaxed">{order.description}</p>
                              <button
                                onClick={() => {
                                  setEditingId(order._id);
                                  setEditDescription(order.description);
                                }}
                                className="mt-3 px-4 cursor-pointer py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg text-sm font-semibold transition-all duration-200 transform hover:scale-105"
                              >
                                <FiEdit className='cursor-pointer' />Edit
                                
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
      )}
    </div>
  );
}
