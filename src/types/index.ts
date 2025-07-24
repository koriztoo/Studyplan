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
  weeklyUnavailableDays: number[]; // 0=日曜日, 1=月曜日, ..., 6=土曜日
}

export type ViewMode = 'today' | 'calendar' | 'register' | 'schedule' | 'settings' | 'edit';