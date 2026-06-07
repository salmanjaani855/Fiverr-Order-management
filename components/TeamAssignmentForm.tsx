'use client';

import { useData } from '@/context/DataContext';
import { useState, useEffect } from 'react';

interface FormRow {
  _id?: string;
  clientName: string;
  assignments: {
    arslan?: string;
    noman?: string;
    umar?: string;
    hamza?: string;
    ali?: string;
  };
}

const TEAM_MEMBERS = ['Arslan', 'Noman', 'Umar', 'Hamza', 'Ali'];
const ASSIGNMENT_OPTIONS = ['Lyrics', 'Background', 'Full'];

export function TeamAssignmentForm() {
  const { teamMembers, refreshTeamMembers } = useData();
  const [rows, setRows] = useState<FormRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initializeRows = async () => {
      await refreshTeamMembers();
    };
    initializeRows();
  }, []);

  useEffect(() => {
    if (teamMembers.length > 0) {
      const formattedRows: FormRow[] = teamMembers.map(member => {
        const assignments: FormRow['assignments'] = {};
        try {
          const parsed = JSON.parse(member.backgroundLyrics || '{}');
          assignments.arslan = parsed.arslan || '';
          assignments.noman = parsed.noman || '';
          assignments.umar = parsed.umar || '';
          assignments.hamza = parsed.hamza || '';
          assignments.ali = parsed.ali || '';
        } catch {
          // If parsing fails, use empty assignments
        }
        return {
          _id: member._id,
          clientName: member.clientName,
          assignments,
        };
      });
      setRows(formattedRows);
    } else if (rows.length === 0) {
      setRows([{
        clientName: '',
        assignments: {
          arslan: '',
          noman: '',
          umar: '',
          hamza: '',
          ali: '',
        }
      }]);
    }
  }, [teamMembers]);

  const handleClientNameChange = (index: number, value: string) => {
    const newRows = [...rows];
    newRows[index].clientName = value;
    setRows(newRows);
  };

  const handleAssignmentChange = (index: number, member: string, value: string) => {
    const newRows = [...rows];
    const key = member.toLowerCase() as keyof FormRow['assignments'];
    newRows[index].assignments[key] = value;
    setRows(newRows);
  };

  const handleAddRow = () => {
    setRows([...rows, {
      clientName: '',
      assignments: {
        arslan: '',
        noman: '',
        umar: '',
        hamza: '',
        ali: '',
      }
    }]);
  };

  const handleDelete = async (index: number) => {
    const row = rows[index];
    if (row._id) {
      try {
        const response = await fetch(`/api/team-members/${row._id}`, { method: 'DELETE', credentials: 'include' });
        if (response.ok) {
          const newRows = rows.filter((_, i) => i !== index);
          setRows(newRows);
          await refreshTeamMembers();
        }
      } catch (error) {
        alert('Error deleting team member');
      }
    } else {
      const newRows = rows.filter((_, i) => i !== index);
      setRows(newRows);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      for (const row of rows) {
        if (row.clientName) {
          const assignmentsJson = JSON.stringify(row.assignments);

          if (row._id) {
            await fetch(`/api/team-members/${row._id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                clientName: row.clientName,
                backgroundLyrics: assignmentsJson,
              }),
              credentials: 'include',
            });
          } else {
            await fetch('/api/team-members', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: row.clientName,
                project: 'Project',
                clientName: row.clientName,
                backgroundLyrics: assignmentsJson,
                assignedMembers: [],
              }),
              credentials: 'include',
            });
          }
        }
      }
      await refreshTeamMembers();
      // alert('✓ Team assignments saved successfully!');
    } catch (error) {
      console.error('Save error:', error);
      alert('❌ Error saving team assignments');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full">
          <thead className="bg-gray-200 dark:bg-slate-900 text-gray-900 dark:text-white sticky top-0">
            <tr>
              <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Client Name</th>
              {TEAM_MEMBERS.map((member) => (
                <th key={member} className="px-2 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm font-bold">{member}</th>
              ))}
              <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm font-bold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {rows.map((row, index) => (
              <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200">
                <td className="px-4 sm:px-6 py-3 sm:py-4">
                  <input
                    type="text"
                    value={row.clientName}
                    onChange={(e) => handleClientNameChange(index, e.target.value)}
                    placeholder="Enter client name"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700 outline-none text-sm font-medium transition-all duration-200"
                  />
                </td>
                {TEAM_MEMBERS.map((member) => (
                  <td key={member} className="px-2 sm:px-6 py-3 sm:py-4 text-center">
                    <select
                      value={row.assignments[member.toLowerCase() as keyof FormRow['assignments']] || ''}
                      onChange={(e) => handleAssignmentChange(index, member, e.target.value)}
                      className="w-full px-2 sm:px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700 outline-none text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer"
                    >
                      <option value="">None</option>
                      {ASSIGNMENT_OPTIONS.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </td>
                ))}
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-right">
                  <button
                    onClick={() => handleDelete(index)}
                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 hover:scale-110 transform"
                    title="Delete assignment"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {rows.map((row, index) => (
          <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Client Name</label>
              <input
                type="text"
                value={row.clientName}
                onChange={(e) => handleClientNameChange(index, e.target.value)}
                placeholder="Enter client name"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700 outline-none text-sm font-medium transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {TEAM_MEMBERS.map((member) => (
                <div key={member}>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">{member}</label>
                  <select
                    value={row.assignments[member.toLowerCase() as keyof FormRow['assignments']] || ''}
                    onChange={(e) => handleAssignmentChange(index, member, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700 outline-none text-sm font-medium transition-all cursor-pointer"
                  >
                    <option value="">None</option>
                    {ASSIGNMENT_OPTIONS.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => handleDelete(index)}
                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                title="Delete assignment"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
        <button
          onClick={handleAddRow}
          className="w-full cursor-pointer sm:w-auto bg-slate-700 hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-500 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md text-sm sm:text-base"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Row
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full cursor-pointer sm:w-auto bg-[#1dbf73] hover:bg-[#19a463] text-white font-semibold py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
          </svg>
          {loading ? 'Saving...' : 'Save All'}
        </button>
      </div>
    </div>
  );
}
