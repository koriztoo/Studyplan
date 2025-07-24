import React, { useState } from 'react';
import { Calendar, Plus, X, Clock } from 'lucide-react';
import { GlobalSchedule } from '../types';

interface SchedulePageProps {
  globalSchedule: GlobalSchedule;
  onUpdateGlobalSchedule: (schedule: GlobalSchedule) => void;
}

export function SchedulePage({ globalSchedule, onUpdateGlobalSchedule }: SchedulePageProps) {
  const [selectedDate, setSelectedDate] = useState('');

  const weekDays = [
    { id: 0, name: '日曜日', short: '日' },
    { id: 1, name: '月曜日', short: '月' },
    { id: 2, name: '火曜日', short: '火' },
    { id: 3, name: '水曜日', short: '水' },
    { id: 4, name: '木曜日', short: '木' },
    { id: 5, name: '金曜日', short: '金' },
    { id: 6, name: '土曜日', short: '土' }
  ];

  const handleAddSpecificDate = () => {
    if (selectedDate && !globalSchedule.unavailableDates.includes(selectedDate)) {
      onUpdateGlobalSchedule({
        ...globalSchedule,
        unavailableDates: [...globalSchedule.unavailableDates, selectedDate].sort()
      });
      setSelectedDate('');
    }
  };

  const handleRemoveSpecificDate = (date: string) => {
    onUpdateGlobalSchedule({
      ...globalSchedule,
      unavailableDates: globalSchedule.unavailableDates.filter(d => d !== date)
    });
  };

  const handleToggleWeeklyDay = (dayId: number) => {
    const newWeeklyDays = globalSchedule.weeklyUnavailableDays.includes(dayId)
      ? globalSchedule.weeklyUnavailableDays.filter(d => d !== dayId)
      : [...globalSchedule.weeklyUnavailableDays, dayId].sort();
    
    onUpdateGlobalSchedule({
      ...globalSchedule,
      weeklyUnavailableDays: newWeeklyDays
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold gradient-text mb-2">予定管理</h1>
        <p className="text-white/80">すべての宿題に適用される予定を管理します</p>
      </div>

      {/* 毎週の予定 */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="text-purple-300" size={24} />
          <h2 className="text-xl font-semibold text-white">毎週の予定</h2>
        </div>
        
        <p className="text-white/70 mb-4">
          毎週決まった曜日に宿題ができない場合は、該当する曜日を選択してください
        </p>
        
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map(day => (
            <button
              key={day.id}
              onClick={() => handleToggleWeeklyDay(day.id)}
              className={`p-3 rounded-lg border transition-colors ${
                globalSchedule.weeklyUnavailableDays.includes(day.id)
                  ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                  : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20'
              }`}
            >
              <div className="text-center">
                <div className="text-lg font-medium">{day.short}</div>
                <div className="text-xs">{day.name.slice(0, 2)}</div>
              </div>
            </button>
          ))}
        </div>
        
        {globalSchedule.weeklyUnavailableDays.length > 0 && (
          <div className="mt-4 p-3 bg-purple-500/10 rounded-lg">
            <p className="text-sm text-purple-300">
              選択された曜日: {globalSchedule.weeklyUnavailableDays
                .map(dayId => weekDays.find(d => d.id === dayId)?.name)
                .join('、')}
            </p>
            <p className="text-xs text-white/60 mt-1">
              これらの曜日はすべての宿題で自動的に利用不可日として扱われます
            </p>
          </div>
        )}
      </div>

      {/* 特定の日付の予定 */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="text-cyan-300" size={24} />
          <h2 className="text-xl font-semibold text-white">特定の日付の予定</h2>
        </div>
        
        <p className="text-white/70 mb-4">
          テスト、行事、家族の予定など、特定の日に宿題ができない場合は日付を追加してください
        </p>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input-field flex-1 px-3 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
            <button
              onClick={handleAddSpecificDate}
              disabled={!selectedDate}
              className="px-4 py-2 bg-cyan-500/20 text-cyan-300 rounded-lg hover:bg-cyan-500/30 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={16} />
              追加
            </button>
          </div>
          
          {globalSchedule.unavailableDates.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-white/70">登録された予定:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {globalSchedule.unavailableDates.map(date => (
                  <div
                    key={date}
                    className="flex items-center justify-between bg-cyan-500/20 text-cyan-300 px-3 py-2 rounded-lg"
                  >
                    <span className="text-sm">
                      {new Date(date + 'T00:00:00').toLocaleDateString('ja-JP', {
                        month: 'short',
                        day: 'numeric',
                        weekday: 'short'
                      })}
                    </span>
                    <button
                      onClick={() => handleRemoveSpecificDate(date)}
                      className="text-cyan-400 hover:text-cyan-300 transition-colors ml-2"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 予定の説明 */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-start gap-3">
          <Calendar className="text-white/40 mt-1" size={20} />
          <div>
            <h3 className="font-semibold text-white mb-2">予定管理について</h3>
            <div className="text-sm text-white/70 space-y-2">
              <p>• <strong>毎週の予定</strong>: 部活動、習い事など定期的な予定に使用</p>
              <p>• <strong>特定の日付</strong>: テスト、行事、旅行など一時的な予定に使用</p>
              <p>• 登録した予定は新規宿題と既存宿題の両方に自動適用されます</p>
              <p>• 宿題の計画は予定を考慮して自動調整されます</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}