import React from 'react';
import { Bell, Clock, Calendar, Settings, Plus, X } from 'lucide-react';
import { NotificationSettings, GlobalSchedule } from '../types';

interface SettingsPageProps {
  settings: NotificationSettings;
  onUpdateSettings: (settings: NotificationSettings) => void;
}

export function SettingsPage({ settings, onUpdateSettings }: SettingsPageProps) {
  const handleToggleNotifications = () => {
    onUpdateSettings({
      ...settings,
      enabled: !settings.enabled
    });
  };

  const handleReminderDaysChange = (days: number) => {
    const newReminderDays = settings.reminderDays.includes(days)
      ? settings.reminderDays.filter(d => d !== days)
      : [...settings.reminderDays, days].sort((a, b) => b - a);
    
    onUpdateSettings({
      ...settings,
      reminderDays: newReminderDays
    });
  };

  const handleDailyReminderToggle = () => {
    onUpdateSettings({
      ...settings,
      dailyReminder: !settings.dailyReminder
    });
  };

  const handleTimeChange = (time: string) => {
    onUpdateSettings({
      ...settings,
      reminderTime: time
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold gradient-text mb-2">設定</h1>
        <p className="text-white/80">通知やリマインダーの設定</p>
      </div>

      <div className="glass-card rounded-xl p-6 space-y-6">
        {/* Notification Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="text-purple-300" size={24} />
            <div>
              <h3 className="font-semibold text-white">通知を有効にする</h3>
              <p className="text-sm text-white/70">宿題の締切をお知らせします</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.enabled}
              onChange={handleToggleNotifications}
              className="sr-only peer"
            />
            <div className="toggle-switch w-11 h-6 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white/20 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:checked"></div>
          </label>
        </div>

        {settings.enabled && (
          <>
            {/* Reminder Days */}
            <div className="border-t pt-6">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="text-blue-300" size={24} />
                <div>
                  <h3 className="font-semibold text-white">提出期限の何日前に通知するか</h3>
                  <p className="text-sm text-white/70">複数選択可能です</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 7].map(days => (
                  <button
                    key={days}
                    onClick={() => handleReminderDaysChange(days)}
                    className={`p-3 rounded-lg border transition-colors ${
                      settings.reminderDays.includes(days)
                        ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                        : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20'
                    }`}
                  >
                    {days}日前
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Reminder */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="text-cyan-300" size={24} />
                  <div>
                    <h3 className="font-semibold text-white">毎日の宿題リマインダー</h3>
                    <p className="text-sm text-white/70">未完了の宿題をお知らせします</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.dailyReminder}
                    onChange={handleDailyReminderToggle}
                    className="sr-only peer"
                  />
                  <div className="toggle-switch w-11 h-6 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white/20 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:checked"></div>
                </label>
              </div>

              {settings.dailyReminder && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-white mb-2">
                    通知時間
                  </label>
                  <input
                    type="time"
                    value={settings.reminderTime}
                    onChange={(e) => handleTimeChange(e.target.value)}
                    className="input-field px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>
          </>
        )}


        {/* Info */}
        <div className="border-t pt-6">
          <div className="flex items-start gap-3">
            <Settings className="text-white/40 mt-1" size={20} />
            <div>
              <h3 className="font-semibold text-white mb-2">通知について</h3>
              <div className="text-sm text-white/70 space-y-1">
                <p>• ブラウザの通知許可が必要です</p>
                <p>• 通知は宿題の締切日と設定した日数に基づいて送信されます</p>
                <p>• 毎日のリマインダーは設定した時間に未完了の宿題をお知らせします</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}