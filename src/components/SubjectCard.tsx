import React, { useState } from 'react';
import { Edit2, Trash2, CheckCircle, XCircle, History } from 'lucide-react';
import type { Subject } from '../types';

interface SubjectCardProps {
  subject: Subject;
  onEdit: (subject: Subject) => void;
  onDelete: (id: string) => void;
  onAttendance: (subject: Subject) => void;
  onViewHistory: (subject: Subject) => void;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({ 
  subject, 
  onEdit, 
  onDelete,
  onAttendance,
  onViewHistory
}) => {
  const [showAttendance, setShowAttendance] = useState(false);
  const attendancePercentage = (subject.attendedClasses / subject.totalClasses) * 100 || 0;
  const isLowAttendance = attendancePercentage < 75;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-slide-in">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-purple-900">{subject.name}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => onViewHistory(subject)}
            className="p-2 hover:bg-blue-100 rounded-full transition-all duration-300 hover:rotate-12"
            title="View History"
          >
            <History className="w-5 h-5 text-blue-600" />
          </button>
          <button
            onClick={() => onEdit(subject)}
            className="p-2 hover:bg-purple-100 rounded-full transition-all duration-300 hover:rotate-12"
            title="Edit Subject"
          >
            <Edit2 className="w-5 h-5 text-purple-600" />
          </button>
          <button
            onClick={() => onDelete(subject.id)}
            className="p-2 hover:bg-red-100 rounded-full transition-all duration-300 hover:rotate-12"
            title="Delete Subject"
          >
            <Trash2 className="w-5 h-5 text-red-500" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-600 bg-purple-200 transition-all duration-300 hover:bg-purple-300">
                Attendance
              </span>
            </div>
            <div className="text-right">
              <span className={`text-xs font-semibold inline-block ${
                isLowAttendance ? 'text-red-600' : 'text-purple-600'
              }`}>
                {attendancePercentage.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200">
            <div
              style={{ width: `${attendancePercentage}%`, transition: 'width 1s ease-in-out' }}
              className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                isLowAttendance ? 'bg-red-500' : 'bg-purple-500'
              }`}
            ></div>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          <p className="transition-all duration-300 hover:translate-x-1">Total Classes: {subject.totalClasses}</p>
          <p className="transition-all duration-300 hover:translate-x-1">Classes Attended: {subject.attendedClasses}</p>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          <p className="font-medium">Schedule:</p>
          {subject.schedule.map((slot, index) => (
            <p key={index} className="transition-all duration-300 hover:translate-x-1">
              {slot.day}: {slot.startTime} - {slot.endTime}
            </p>
          ))}
        </div>

        <div className="pt-4">
          <button
            onClick={() => setShowAttendance(!showAttendance)}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            Mark Attendance
          </button>

          {showAttendance && (
            <div className="mt-4 flex gap-2 animate-fade-in">
              <button
                onClick={() => {
                  onAttendance(subject);
                  setShowAttendance(false);
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                <CheckCircle className="w-5 h-5" />
                Present
              </button>
              <button
                onClick={() => {
                  onAttendance(subject);
                  setShowAttendance(false);
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                <XCircle className="w-5 h-5" />
                Absent
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};