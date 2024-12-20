export interface Subject {
  id: string;
  name: string;
  schedule: ClassSchedule[];
  totalClasses: number;
  attendedClasses: number;
}

export interface ClassSchedule {
  day: string;
  startTime: string;
  endTime: string;
}

export interface ClassEntry {
  id: string;
  subjectId: string;
  date: string;
  attended: boolean;
  learningNotes: string;
  timestamp: number;
}