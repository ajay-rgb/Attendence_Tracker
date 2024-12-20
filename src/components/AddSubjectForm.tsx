import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { ClassSchedule } from '../types';

interface AddSubjectFormProps {
  onSubmit: (data: {
    name: string;
    schedule: ClassSchedule[];
  }) => Promise<void>;
  onClose: () => void;
}

export const AddSubjectForm: React.FC<AddSubjectFormProps> = ({ onSubmit, onClose }) => {
  const [name, setName] = useState('');
  const [schedule, setSchedule] = useState<ClassSchedule[]>([
    { day: 'Monday', startTime: '', endTime: '' }
  ]);

  const handleAddSchedule = () => {
    setSchedule([...schedule, { day: 'Monday', startTime: '', endTime: '' }]);
  };

  const handleRemoveSchedule = (index: number) => {
    setSchedule(schedule.filter((_, i) => i !== index));
  };

  const handleScheduleChange = (index: number, field: keyof ClassSchedule, value: string) => {
    const newSchedule = [...schedule];
    newSchedule[index] = { ...newSchedule[index], [field]: value };
    setSchedule(newSchedule);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    try {
      await onSubmit({ name, schedule });
      setName('');
      setSchedule([{ day: 'Monday', startTime: '', endTime: '' }]);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-purple-900">Add New Subject</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter subject name"
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">
                Class Schedule
              </label>
              <button
                type="button"
                onClick={handleAddSchedule}
                className="text-sm text-purple-600 hover:text-purple-700"
              >
                + Add Time Slot
              </button>
            </div>

            {schedule.map((slot, index) => (
              <div key={index} className="flex gap-2 items-start">
                <div className="flex-1">
                  <select
                    value={slot.day}
                    onChange={(e) => handleScheduleChange(index, 'day', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <input
                    type="time"
                    value={slot.startTime}
                    onChange={(e) => handleScheduleChange(index, 'startTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="time"
                    value={slot.endTime}
                    onChange={(e) => handleScheduleChange(index, 'endTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                {schedule.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSchedule(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Add Subject
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};