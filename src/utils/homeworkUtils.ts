import { Homework, DailyTask } from '../types';
import { getDateRange } from './dateUtils';

import { GlobalSchedule } from '../types';

// 毎週の利用不可日を特定の期間の日付リストに変換
export function getWeeklyUnavailableDates(weeklyDays: number[], startDate: string, endDate: string): string[] {
  if (weeklyDays.length === 0) return [];
  
  const dates: string[] = [];
  const current = new Date(startDate + 'T00:00:00');
  const end = new Date(endDate + 'T00:00:00');
  
  while (current <= end) {
    const dayOfWeek = current.getDay();
    if (weeklyDays.includes(dayOfWeek)) {
      const year = current.getFullYear();
      const month = String(current.getMonth() + 1).padStart(2, '0');
      const day = String(current.getDate()).padStart(2, '0');
      dates.push(`${year}-${month}-${day}`);
    }
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
}

import { generateDailyTasks } from './homeworkUtils';

export function rescheduleHomework(homework: Homework): Homework {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  // 今日以前の未完了タスクを取得
  const incompletePastTasks = homework.dailyTasks.filter(task => {
    const taskDate = new Date(task.date + 'T00:00:00');
    const todayDate = new Date(todayStr + 'T00:00:00');
    return taskDate <= todayDate && !task.isCompleted;
  });
  
  // 未完了タスクがない場合はそのまま返す
  if (incompletePastTasks.length === 0) {
    return homework;
  }
  
  // 未完了の残りページ数と時間を計算
  const remainingPages = incompletePastTasks.reduce((sum, task) => sum + task.pages, 0);
  const remainingTime = incompletePastTasks.reduce((sum, task) => sum + task.timeRequired, 0);
  
  // 今日から締切日までの利用可能日を取得
  const allDates = getDateRange(todayStr, homework.targetCompleteDate);
  const availableDates = allDates.filter(date => !homework.unavailableDates.includes(date));
  
  if (availableDates.length === 0) {
    return homework;
  }
  
  // 新しい日別タスクを生成
  const pagesPerDay = Math.ceil(remainingPages / availableDates.length);
  const timePerDay = Math.ceil(remainingTime / availableDates.length);
  
  // 既存のタスクを更新
  const updatedTasks = homework.dailyTasks.map(task => {
    const taskDate = new Date(task.date + 'T00:00:00');
    const todayDate = new Date(todayStr + 'T00:00:00');
    
    // 過去の未完了タスクは削除（pages: 0にする）
    if (taskDate < todayDate && !task.isCompleted) {
      return { ...task, pages: 0, timeRequired: 0 };
    }
    
    // 今日以降の利用可能日に新しいタスクを配分
    if (taskDate >= todayDate && availableDates.includes(task.date)) {
      return { ...task, pages: pagesPerDay, timeRequired: timePerDay };
    }
    
    return task;
  });
  
  return { ...homework, dailyTasks: updatedTasks };
}

export function generateDailyTasks(homework: Homework, globalSchedule?: GlobalSchedule): DailyTask[] {
  const { dueDate, targetCompleteDate, pages, estimatedTime, unavailableDates = [] } = homework;
  
  // 今日の日付を正確に取得（タイムゾーンを考慮）
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  const allDates = getDateRange(
    todayStr,
    targetCompleteDate
  );
  
  // グローバル予定から毎週の利用不可日を取得
  let combinedUnavailableDates = [...unavailableDates];
  
  if (globalSchedule) {
    // 特定日付の予定を追加
    combinedUnavailableDates = [...combinedUnavailableDates, ...globalSchedule.unavailableDates];
    
    // 毎週の予定を追加
    const weeklyUnavailableDates = getWeeklyUnavailableDates(
      globalSchedule.weeklyUnavailableDays,
      todayStr,
      targetCompleteDate
    );
    combinedUnavailableDates = [...combinedUnavailableDates, ...weeklyUnavailableDates];
  }
  
  // 重複を除去して利用不可日を除外
  const uniqueUnavailableDates = [...new Set(combinedUnavailableDates)];
  const availableDates = allDates.filter(date => !uniqueUnavailableDates.includes(date));
  
  if (availableDates.length === 0) return [];
  
  const pagesPerDay = Math.ceil(pages / availableDates.length);
  const timePerDay = Math.ceil(estimatedTime / availableDates.length);
  
  return availableDates.map(date => ({
    date,
    pages: pagesPerDay,
    timeRequired: timePerDay,
    isCompleted: false
  }));
}

export function getSubjectColor(subject: string): string {
  const colors: Record<string, string> = {
    '数学': 'bg-blue-500',
    '国語': 'bg-red-500',
    '英語': 'bg-green-500',
    '理科': 'bg-purple-500',
    '社会': 'bg-orange-500',
    '体育': 'bg-yellow-500',
    '美術': 'bg-pink-500',
    '音楽': 'bg-indigo-500',
    '技術': 'bg-gray-500',
    '家庭': 'bg-teal-500'
  };
  
  return colors[subject] || 'bg-gray-400';
}

export function getProgressPercentage(homework: Homework): number {
  const completedTasks = homework.dailyTasks.filter(task => task.isCompleted).length;
  return homework.dailyTasks.length > 0 ? (completedTasks / homework.dailyTasks.length) * 100 : 0;
}