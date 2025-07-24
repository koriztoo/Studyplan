import React from 'react';
import { CheckCircle, Clock, Calendar, Book, AlertTriangle, Edit } from 'lucide-react';
import { Homework } from '../types';
import { isToday, isOverdue, getDaysUntil } from '../utils/dateUtils';
import { getSubjectColor, getProgressPercentage } from '../utils/homeworkUtils';

interface HomePageProps {
  homeworks: Homework[];
  onToggleComplete: (id: string, taskDate: string) => void;
  onToggleHomeworkComplete: (id: string) => void;
  onEditHomework: (homework: Homework) => void;
}

export function HomePage({ homeworks, onToggleComplete, onToggleHomeworkComplete, onEditHomework }: HomePageProps) {
  const todayTasks = homeworks.flatMap(homework => 
    homework.dailyTasks
      .filter(task => isToday(task.date))
      .map(task => ({ ...task, homework }))
  );

  const activeHomeworks = homeworks.filter(hw => !hw.isCompleted);
  const completedHomeworks = homeworks.filter(hw => hw.isCompleted);

  const upcomingDeadlines = homeworks
    .filter(hw => !hw.isCompleted && getDaysUntil(hw.dueDate) <= 7)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold gradient-text mb-2">今日の宿題</h1>
        <p className="text-white/80">
          {new Date().toLocaleDateString('ja-JP', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            weekday: 'long' 
          })}
        </p>
      </div>

      {/* Today's Tasks */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Book className="text-purple-300" size={24} />
          <h2 className="text-xl font-semibold text-white">今日やるべき宿題</h2>
        </div>
        
        {todayTasks.length === 0 ? (
          <div className="text-center py-8 text-white/60">
            <CheckCircle className="mx-auto mb-2 text-green-400" size={48} />
            <p>今日の宿題はありません！</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todayTasks.map((task, index) => (
              <div
                key={`${task.homework.id}-${task.date}-${index}`}
                className="task-card flex items-center gap-4 p-4 rounded-lg"
              >
                <button
                  onClick={() => onToggleComplete(task.homework.id, task.date)}
                  className={`flex-shrink-0 ${
                    task.isCompleted 
                     ? 'text-emerald-300 hover:text-emerald-200' 
                     : 'text-white/40 hover:text-emerald-300'
                  } transition-colors`}
                >
                  <CheckCircle size={24} />
                </button>
                
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
                
                <button
                  onClick={() => onEditHomework(task.homework)}
                  className="flex-shrink-0 text-white/40 hover:text-purple-300 transition-colors"
                >
                  <Edit size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Homeworks List */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Book className="text-blue-300" size={24} />
          <h2 className="text-xl font-semibold text-white">宿題一覧</h2>
          <span className="text-sm text-white/60">({activeHomeworks.length}件)</span>
        </div>
        
        {activeHomeworks.length === 0 ? (
          <div className="text-center py-8 text-white/60">
            <CheckCircle className="mx-auto mb-2 text-white/40" size={48} />
            <p>未完了の宿題はありません</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeHomeworks.map((homework) => {
              const progress = getProgressPercentage(homework);
              const daysUntil = getDaysUntil(homework.dueDate);
              const isUrgent = daysUntil <= 3;
              
              return (
                <div
                  key={homework.id}
                  className="task-card flex items-center gap-4 p-4 rounded-lg"
                >
                  <button
                    onClick={() => onToggleHomeworkComplete(homework.id)}
                    className="flex-shrink-0 text-white/40 hover:text-emerald-300 transition-colors"
                  >
                    <CheckCircle size={24} />
                  </button>
                  
                  <div className="subject-badge w-3 h-3 rounded-full" />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-white">
                        {homework.subject} - {homework.title}
                      </p>
                      {isUrgent && <AlertTriangle className="text-red-400" size={16} />}
                    </div>
                    {homework.content && (
                      <p className="text-sm text-white/60 mb-2">
                        {homework.content}
                      </p>
                    )}
                    <div className="mb-2">
                      <div className="flex justify-between text-sm text-white/70 mb-1">
                        <span>進捗</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div
                          className="progress-bar h-2 transition-all duration-300"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-sm text-white/70">
                      締切: {new Date(homework.dueDate).toLocaleDateString('ja-JP')} 
                      <span className={`ml-2 font-medium ${
                        isUrgent ? 'text-red-400' : daysUntil <= 7 ? 'text-amber-400' : 'text-white/70'
                      }`}>
                        {daysUntil === 0 ? '今日が締切' : `あと${daysUntil}日`}
                      </span>
                    </p>
                  </div>
                  
                  <button
                    onClick={() => onEditHomework(homework)}
                    className="flex-shrink-0 text-white/40 hover:text-purple-300 transition-colors"
                  >
                    <Edit size={20} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Completed Homeworks */}
      {completedHomeworks.length > 0 && (
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="text-emerald-300" size={24} />
            <h2 className="text-xl font-semibold text-white">完了済み宿題</h2>
            <span className="text-sm text-white/60">({completedHomeworks.length}件)</span>
          </div>
          
          <div className="space-y-3">
            {completedHomeworks.map((homework) => (
              <div
                key={homework.id}
                className="task-card flex items-center gap-4 p-4 rounded-lg opacity-75"
              >
                <button
                  onClick={() => onToggleHomeworkComplete(homework.id)}
                  className="flex-shrink-0 text-emerald-300 hover:text-emerald-200 transition-colors"
                >
                  <CheckCircle size={24} />
                </button>
                
                <div className="subject-badge w-3 h-3 rounded-full opacity-60" />
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white/70 line-through">
                    {homework.subject} - {homework.title}
                  </p>
                  {homework.content && (
                    <p className="text-sm text-white/50 mt-1 line-through">
                      {homework.content}
                    </p>
                  )}
                  <p className="text-sm text-white/60">
                    完了日: {new Date(homework.dueDate).toLocaleDateString('ja-JP')}
                  </p>
                </div>
                
                <button
                  onClick={() => onEditHomework(homework)}
                  className="flex-shrink-0 text-white/30 hover:text-purple-300 transition-colors"
                >
                  <Edit size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Upcoming Deadlines */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="text-blue-300" size={24} />
          <h2 className="text-xl font-semibold text-white">締切が近い宿題</h2>
        </div>
        
        {upcomingDeadlines.length === 0 ? (
          <div className="text-center py-8 text-white/60">
            <Calendar className="mx-auto mb-2 text-white/40" size={48} />
            <p>締切が近い宿題はありません</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingDeadlines.map((homework) => {
              const daysUntil = getDaysUntil(homework.dueDate);
              const progress = getProgressPercentage(homework);
              const isUrgent = daysUntil <= 3;
              
              return (
                <div
                  key={homework.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    isUrgent ? 'deadline-urgent' : 'deadline-warning'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="subject-badge w-3 h-3 rounded-full" />
                      <span className="font-medium text-white">
                        {homework.subject} - {homework.title}
                      </span>
                      {isUrgent && <AlertTriangle className="text-red-400" size={16} />}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${
                        isUrgent ? 'text-red-400' : 'text-amber-400'
                      }`}>
                        {daysUntil === 0 ? '今日が締切' : `あと${daysUntil}日`}
                      </span>
                      <button
                        onClick={() => onEditHomework(homework)}
                        className="text-white/40 hover:text-purple-300 transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <div className="flex justify-between text-sm text-white/70 mb-1">
                      <span>進捗</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div
                        className="progress-bar h-2 transition-all duration-300"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>
                  
                  <p className="text-sm text-white/70">
                    締切: {new Date(homework.dueDate).toLocaleDateString('ja-JP')}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}