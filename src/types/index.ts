export interface Homework {
  id: string;
  subject: string;
  title: string;
  content: string;
  dueDate: string;
  pages: number;
  estimatedTime: number;
  targetCompleteDate: string;
  unavailableDates: string[];
  isCompleted: boolean;
  createdAt: string;
  dailyTasks: DailyTask[];
}

export interface DailyTask {
  date: string;
  pages: number;
  timeRequired: number;
  isCompleted: boolean;
}

export interface NotificationSettings {
  enabled: boolean;
  reminderDays: number[];
  dailyReminder: boolean;
  reminderTime: string;
}

export interface GlobalSchedule {
  unavailableDates: string[];
}

export type ViewMode = 'today' | 'calendar' | 'register' | 'settings' | 'edit';