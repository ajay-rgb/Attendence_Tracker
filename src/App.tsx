import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, addDoc, updateDoc, deleteDoc, doc, where } from 'firebase/firestore';
import { Toaster, toast } from 'react-hot-toast';
import { PlusCircle, BookOpen } from 'lucide-react';
import { db } from './config/firebase';
import { SubjectCard } from './components/SubjectCard';
import { AttendanceForm } from './components/AttendanceForm';
import { AddSubjectForm } from './components/AddSubjectForm';
import { EditSubjectForm } from './components/EditSubjectForm';
import { AttendanceHistory } from './components/AttendanceHistory';
import type { Subject, ClassEntry } from './types';

function App() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewingHistory, setViewingHistory] = useState<{
    subject: Subject;
    entries: ClassEntry[];
  } | null>(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'subjects'));
      const subjectsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Subject[];
      setSubjects(subjectsData);
    } catch (error) {
      toast.error('Failed to fetch subjects');
      console.error('Error fetching subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubject = async (data: { name: string; schedule: Subject['schedule'] }) => {
    try {
      await addDoc(collection(db, 'subjects'), {
        ...data,
        totalClasses: 0,
        attendedClasses: 0,
        createdAt: new Date().toISOString()
      });
      
      toast.success('Subject added successfully');
      setShowAddSubject(false);
      fetchSubjects();
    } catch (error) {
      toast.error('Failed to add subject');
      console.error('Error adding subject:', error);
    }
  };

  const handleEditSubject = async (id: string, data: { name: string; schedule: Subject['schedule'] }) => {
    try {
      const subjectRef = doc(db, 'subjects', id);
      await updateDoc(subjectRef, data);
      
      toast.success('Subject updated successfully');
      setEditingSubject(null);
      fetchSubjects();
    } catch (error) {
      toast.error('Failed to update subject');
      console.error('Error updating subject:', error);
    }
  };

  const handleAttendanceSubmit = async (attended: boolean, notes: string) => {
    if (!selectedSubject) return;

    try {
      // Add attendance record
      await addDoc(collection(db, 'attendance'), {
        subjectId: selectedSubject.id,
        date: new Date().toISOString(),
        attended,
        learningNotes: notes,
        timestamp: Date.now()
      });
      
      // Update subject attendance count
      const subjectRef = doc(db, 'subjects', selectedSubject.id);
      await updateDoc(subjectRef, {
        attendedClasses: attended 
          ? selectedSubject.attendedClasses + 1 
          : selectedSubject.attendedClasses,
        totalClasses: selectedSubject.totalClasses + 1
      });

      toast.success('Attendance marked successfully');
      setSelectedSubject(null);
      fetchSubjects();
    } catch (error) {
      toast.error('Failed to mark attendance');
      console.error('Error marking attendance:', error);
    }
  };

  const handleDeleteSubject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subject?')) return;

    try {
      await deleteDoc(doc(db, 'subjects', id));
      toast.success('Subject deleted successfully');
      fetchSubjects();
    } catch (error) {
      toast.error('Failed to delete subject');
      console.error('Error deleting subject:', error);
    }
  };

  const handleViewHistory = async (subject: Subject) => {
    try {
      const q = query(
        collection(db, 'attendance'),
        where('subjectId', '==', subject.id)
      );
      const querySnapshot = await getDocs(q);
      const entries = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ClassEntry[];
      
      setViewingHistory({ subject, entries });
    } catch (error) {
      toast.error('Failed to fetch attendance history');
      console.error('Error fetching history:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      
      <header className="bg-purple-900 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <BookOpen className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">Class Attendance Tracker</h1>
                <p className="text-purple-200 text-sm mt-1">Welcome Back, Ajay</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddSubject(true)}
              className="flex items-center gap-2 bg-purple-700 px-4 py-2 rounded-md hover:bg-purple-800 transition-colors"
            >
              <PlusCircle className="w-5 h-5" />
              Add Subject
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map(subject => (
              selectedSubject?.id === subject.id ? (
                <AttendanceForm
                  key={subject.id}
                  subject={subject}
                  onSubmit={handleAttendanceSubmit}
                  onCancel={() => setSelectedSubject(null)}
                />
              ) : (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  onEdit={setEditingSubject}
                  onDelete={handleDeleteSubject}
                  onAttendance={setSelectedSubject}
                  onViewHistory={handleViewHistory}
                />
              )
            ))}
          </div>
        )}

        {showAddSubject && (
          <AddSubjectForm
            onSubmit={handleAddSubject}
            onClose={() => setShowAddSubject(false)}
          />
        )}

        {editingSubject && (
          <EditSubjectForm
            subject={editingSubject}
            onSubmit={handleEditSubject}
            onClose={() => setEditingSubject(null)}
          />
        )}

        {viewingHistory && (
          <AttendanceHistory
            entries={viewingHistory.entries}
            subjectName={viewingHistory.subject.name}
            onClose={() => setViewingHistory(null)}
          />
        )}
      </main>
    </div>
  );
}

export default App;