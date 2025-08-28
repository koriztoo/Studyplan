import React, { useState } from 'react';
import { HomePage } from './components/HomePage';
import { CalendarPage } from './components/CalendarPage';
import { RegisterPage } from './components/RegisterPage';
import { SchedulePage } from './components/SchedulePage';
import { EditPage } from './components/EditPage';
import { SettingsPage } from './components/SettingsPage';
import { Navigation } from './components/Navigation';
import { Homework, NotificationSettings, ViewMode, GlobalSchedule } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { rescheduleHomework } from './utils/homeworkUtils';

function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('today');
  const [editingHomework, setEditingHomework] = useState<Homework | null>(null);
  const [homeworks, setHomeworks] = useLocalStorage<Homework[]>('homeworks', []);
  const [settings, setSettings] = useLocalStorage<NotificationSettings>('settings', {
    enabled: false,
    reminderDays: [1, 3],
    dailyReminder: false,
    reminderTime: '18:00'
  });
  const [globalSchedule, setGlobalSchedule] = useLocalStorage<GlobalSchedule>('globalSchedule', {
    unavailableDates: []
  });

  const handleAddHomework = (homework: Homework) => {
    // 日別タスクを生成時にグローバル予定を考慮
    const homeworkWithTasks = {
      ...homework,
      dailyTasks: generateDailyTasks(homework, globalSchedule)
    };
    setHomeworks([...homeworks, homeworkWithTasks]);
  };

  const handleEditHomework = (homework: Homework) => {
    setEditingHomework(homework);
    setCurrentView('edit');
  };

  const handleUpdateHomework = (updatedHomework: Homework) => {
    // 日別タスクを再生成時にグローバル予定を考慮
    const homeworkWithTasks = {
      ...updatedHomework,
      dailyTasks: generateDailyTasks(updatedHomework, globalSchedule)
    };
    setHomeworks(homeworks.map(hw => 
      hw.id === updatedHomework.id ? homeworkWithTasks : hw
    ));
    setEditingHomework(null);
    setCurrentView('today');
  };

  const handleDeleteHomework = (homeworkId: string) => {
    setHomeworks(homeworks.filter(hw => hw.id !== homeworkId));
  };

  const handleCancelEdit = () => {
    setEditingHomework(null);
    setCurrentView('today');
  };

  const handleToggleComplete = (homeworkId: string, taskDate: string) => {
    setHomeworks(homeworks.map(homework => {
      if (homework.id === homeworkId) {
        const updatedTasks = homework.dailyTasks.map(task => 
          task.date === taskDate ? { ...task, isCompleted: !task.isCompleted } : task
        );
        const allCompleted = updatedTasks.every(task => task.isCompleted);
        const updatedHomework = { 
          ...homework, 
          dailyTasks: updatedTasks,
          isCompleted: allCompleted
        };
        
        // 未完了タスクがある場合は自動で再計画
        return rescheduleHomework(updatedHomework);
      }
      return homework;
    }));
  };

  const handleToggleHomeworkComplete = (homeworkId: string) => {
    setHomeworks(homeworks.map(homework => {
      if (homework.id === homeworkId) {
        const newCompletedStatus = !homework.isCompleted;
        // 宿題全体を完了/未完了にする場合、すべての日別タスクも同じ状態にする
        const updatedTasks = homework.dailyTasks.map(task => ({
          ...task,
          isCompleted: newCompletedStatus
        }));
        return {
          ...homework,
          isCompleted: newCompletedStatus,
          dailyTasks: updatedTasks
        };
      }
      return homework;
    }));
  };

  const handleUpdateSettings = (newSettings: NotificationSettings) => {
    setSettings(newSettings);
  };

  const handleUpdateGlobalSchedule = (newSchedule: GlobalSchedule) => {
    setGlobalSchedule(newSchedule);
    
    // 既存のすべての宿題の日別タスクを再生成
    setHomeworks(homeworks.map(homework => {
      const homeworkWithNewTasks = {
        ...homework,
        dailyTasks: generateDailyTasks(homework, newSchedule)
      };
      return rescheduleHomework(homeworkWithNewTasks);
    }));
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'today':
        return <HomePage 
          homeworks={homeworks} 
          onToggleComplete={handleToggleComplete} 
          onToggleHomeworkComplete={handleToggleHomeworkComplete}
          onEditHomework={handleEditHomework} 
        />;
      case 'calendar':
        return <CalendarPage homeworks={homeworks} />;
      case 'register':
        return <RegisterPage onAddHomework={handleAddHomework} />;
      case 'schedule':
        return <SchedulePage 
          globalSchedule={globalSchedule}
          onUpdateGlobalSchedule={handleUpdateGlobalSchedule}
        />;
      case 'edit':
        return editingHomework ? (
          <EditPage 
            homework={editingHomework} 
            onUpdateHomework={handleUpdateHomework}
            onDeleteHomework={handleDeleteHomework}
            onCancel={handleCancelEdit}
          />
        ) : null;
      case 'settings':
        return <SettingsPage 
          settings={settings} 
          onUpdateSettings={handleUpdateSettings}
        />;
      default:
        return <HomePage homeworks={homeworks} onToggleComplete={handleToggleComplete} onEditHomework={handleEditHomework} />;
    }
  };

  return (
    <div className="min-h-screen pb-20 relative z-10">
      <div className="container mx-auto max-w-7xl">
        {renderCurrentView()}
      </div>
      {currentView !== 'edit' && (
        <Navigation currentView={currentView} onViewChange={setCurrentView} />
      )}
    </div>
  );
}

export default App;