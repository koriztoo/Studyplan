import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, CheckCircle, Book } from 'lucide-react';
import { Homework } from '../types';
import { getWeekDates, getMonthDates, isToday, formatDate } from '../utils/dateUtils';
import { getSubjectColor } from '../utils/homeworkUtils';

interface CalendarPageProps {
  homeworks: Homework[];
}

export function CalendarPage({ homeworks }: CalendarPageProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    } else {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    }
    setCurrentDate(newDate);
  };

  const getDatesForView = () => {
    return viewMode === 'month' ? getMonthDates(currentDate) : getWeekDates(currentDate);
  };

  const getTasksForDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    return homeworks
      .filter(homework => !homework.isCompleted) // 完了済み宿題を除外
      .flatMap(homework => 
      homework.dailyTasks
        .filter(task => task.date === dateStr)
        .map(task => ({ ...task, homework }))
    );
  };

  const getDeadlinesForDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    return homeworks.filter(homework => 
      homework.dueDate === dateStr && !homework.isCompleted // 完了済み宿題を除外
    );
  };

  const handleDateClick = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    setSelectedDate(selectedDate === dateStr ? null : dateStr);
  };

  const getSelectedDateTasks = () => {
    if (!selectedDate) return [];
    return homeworks
      .filter(homework => !homework.isCompleted) // 完了済み宿題を除外
      .flatMap(homework => 
      homework.dailyTasks
        .filter(task => task.date === selectedDate)
        .map(task => ({ ...task, homework }))
    );
  };

  const getSelectedDateDeadlines = () => {
    if (!selectedDate) return [];
    return homeworks.filter(homework => 
      homework.dueDate === selectedDate && !homework.isCompleted // 完了済み宿題を除外
    );
  };

  const dates = getDatesForView();

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Calendar className="text-purple-300" size={24} />
            <h1 className="text-2xl font-bold gradient-text">カレンダー</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex bg-white/10 rounded-lg p-1 backdrop-blur-sm">
              <button
                onClick={() => setViewMode('month')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'month' 
                    ? 'bg-white/20 text-purple-300 shadow backdrop-blur-sm' 
                    : 'text-white/70 hover:text-white'
                }`}
              >
                月
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'week' 
                    ? 'bg-white/20 text-purple-300 shadow backdrop-blur-sm' 
                    : 'text-white/70 hover:text-white'
                }`}
              >
                週
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigateDate('prev')}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white"
          >
            <ChevronLeft size={20} />
          </button>
          
          <h2 className="text-lg font-semibold text-white">
            {currentDate.toLocaleDateString('ja-JP', { 
              year: 'numeric', 
              month: 'long' 
            })}
          </h2>
          
          <button
            onClick={() => navigateDate('next')}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className={`grid gap-2 ${
          viewMode === 'month' 
            ? 'grid-cols-7' 
            : 'grid-cols-7'
        }`}>
          {/* Header */}
          {['日', '月', '火', '水', '木', '金', '土'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-white/60">
              {day}
            </div>
          ))}
          
          {/* Dates */}
          {dates.map((date, index) => {
            const tasks = getTasksForDate(date);
            const deadlines = getDeadlinesForDate(date);
            const isCurrentMonth = date.getMonth() === currentDate.getMonth();
            const isTodayDate = isToday(date.toISOString().split('T')[0]);
            const dateStr = date.toISOString().split('T')[0];
            const isSelected = selectedDate === dateStr;
            
            return (
              <div
                key={index}
                onClick={() => handleDateClick(date)}
                className={`calendar-day min-h-24 p-2 rounded-lg cursor-pointer ${
                  isSelected
                    ? 'selected'
                    : isTodayDate 
                      ? 'today' 
                      : isCurrentMonth 
                        ? '' : 'opacity-50'
                }`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isTodayDate 
                    ? 'text-blue-300' 
                    : isCurrentMonth 
                      ? 'text-white' 
                      : 'text-white/40'
                }`}>
                  {date.getDate()}
                </div>
                
                <div className="space-y-1">
                  {/* Daily tasks - show homework title */}
                  {tasks.slice(0, 2).map((task, taskIndex) => (
                    <div
                      key={taskIndex}
                      className={`text-xs px-2 py-1 rounded ${
                        task.isCompleted 
                         ? 'bg-emerald-300/25 text-emerald-200' 
                          : 'bg-white/20 text-white/80'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <div className="subject-badge w-2 h-2 rounded-full" />
                        <span className="truncate">{task.homework.title}</span>
                      </div>
                    </div>
                  ))}
                  
                  {/* Deadlines */}
                  {deadlines.slice(0, 2).map((homework, deadlineIndex) => (
                    <div
                      key={deadlineIndex}
                      className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-400"
                    >
                      <div className="flex items-center gap-1">
                        <Clock size={10} />
                        <span className="truncate">締切: {homework.title}</span>
                      </div>
                    </div>
                  ))}
                  
                  {/* Show count if there are more items */}
                  {(tasks.length + deadlines.length > 2) && (
                    <div className="text-xs text-white/50">
                      +{tasks.length + deadlines.length - 2}件
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Book className="text-purple-300" size={24} />
            <h2 className="text-xl font-semibold text-white">
              {formatDate(selectedDate)}の予定
            </h2>
          </div>

          {(() => {
            const selectedTasks = getSelectedDateTasks();
            const selectedDeadlines = getSelectedDateDeadlines();
            
            if (selectedTasks.length === 0 && selectedDeadlines.length === 0) {
              return (
                <div className="text-center py-8 text-white/60">
                  <Calendar className="mx-auto mb-2 text-white/40" size={48} />
                  <p>この日の予定はありません</p>
                </div>
              );
            }

            return (
              <div className="space-y-4">
                {/* Daily Tasks */}
                {selectedTasks.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-white mb-3">今日やるべき宿題</h3>
                    <div className="space-y-3">
                      {selectedTasks.map((task, index) => (
                        <div
                          key={`${task.homework.id}-${task.date}-${index}`}
                          className="task-card flex items-center gap-4 p-4 rounded-lg"
                        >
                          <div className={`flex-shrink-0 ${
                            task.isCompleted 
                             ? 'text-emerald-300' 
                              : 'text-white/40'
                          }`}>
                            <CheckCircle size={24} />
                          </div>
                          
                          <div className="subject-badge w-3 h-3 rounded-full" />
                          
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium ${task.isCompleted ? 'line-through text-white/50' : 'text-white'}`}>
                              {task.homework.subject} - {task.homework.title}
                            </p>
                            {task.homework.content && (
                              <p className="text-sm text-white/60 mt-1">
                                {task.homework.content}
                              </p>
                            )}
                            <p className="text-sm text-white/70">
                              {task.pages}ページ • {task.timeRequired}分
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-white/60">
                            <Clock size={16} />
                            <span>{task.timeRequired}分</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Deadlines */}
                {selectedDeadlines.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-white mb-3">提出期限</h3>
                    <div className="space-y-3">
                      {selectedDeadlines.map((homework) => (
                        <div
                          key={homework.id}
                          className="deadline-urgent p-4 rounded-lg border-l-4"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className="subject-badge w-3 h-3 rounded-full" />
                            <span className="font-medium text-white">
                              {homework.subject} - {homework.title}
                            </span>
                            <Clock className="text-red-500" size={16} />
                          </div>
                          <p className="text-sm text-white/70">
                            {homework.content && `内容: ${homework.content}`}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}