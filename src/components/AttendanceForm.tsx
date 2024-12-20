import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import type { Subject } from '../types';

interface AttendanceFormProps {
  subject: Subject;
  onSubmit: (attended: boolean, notes: string) => Promise<void>;
  onCancel: () => void;
}

export const AttendanceForm: React.FC<AttendanceFormProps> = ({ subject, onSubmit, onCancel }) => {
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (attended: boolean) => {
    setLoading(true);
    try {
      await onSubmit(attended, notes);
      setNotes('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 scale-in-center">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-purple-900">Mark Attendance</h3>
          <p className="text-sm text-gray-600 mt-1">{subject.name}</p>
        </div>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300 hover:rotate-90"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What did you learn today?
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
            rows={4}
            placeholder="Enter your learning notes..."
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => handleSubmit(true)}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:transform-none"
          >
            <Check className="w-5 h-5" />
            Present
          </button>
          <button
            onClick={() => handleSubmit(false)}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:transform-none"
          >
            <X className="w-5 h-5" />
            Absent
          </button>
        </div>
      </div>
    </div>
  );
};