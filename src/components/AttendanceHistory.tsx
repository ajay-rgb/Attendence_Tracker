import React from 'react';
import { format } from 'date-fns';
import { CheckCircle, XCircle } from 'lucide-react';
import type { ClassEntry } from '../types';

interface AttendanceHistoryProps {
  entries: ClassEntry[];
  onClose: () => void;
  subjectName: string;
}

export const AttendanceHistory: React.FC<AttendanceHistoryProps> = ({ entries, onClose, subjectName }) => {
  const sortedEntries = [...entries].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col scale-in-center">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold text-purple-900">Attendance History</h2>
            <p className="text-sm text-gray-600 mt-1">{subjectName}</p>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-all duration-300"
          >
            Close
          </button>
        </div>

        <div className="overflow-auto flex-1">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Learning Notes
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedEntries.map((entry, index) => (
                <tr 
                  key={entry.id} 
                  className="hover:bg-gray-50 transition-colors duration-200"
                  style={{
                    animation: `slideIn 0.3s ease-out forwards`,
                    animationDelay: `${index * 0.05}s`,
                    opacity: 0
                  }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(entry.date), 'PPP')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {entry.attended ? (
                      <span className="inline-flex items-center gap-1 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        Present
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-600">
                        <XCircle className="w-4 h-4" />
                        Absent
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {entry.learningNotes || '-'}
                  </td>
                </tr>
              ))}
              {sortedEntries.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-500 animate-fade-in">
                    No attendance records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};