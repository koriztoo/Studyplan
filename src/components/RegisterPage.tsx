import React, { useState } from 'react';
import { Plus, Save, X } from 'lucide-react';
import { Homework } from '../types';
import { generateDailyTasks } from '../utils/homeworkUtils';

interface RegisterPageProps {
  onAddHomework: (homework: Homework) => void;
}

export function RegisterPage({ onAddHomework }: RegisterPageProps) {
  const [formData, setFormData] = useState({
    subject: '',
    title: '',
    content: '',
    dueDate: '',
    pages: 0,
    estimatedTime: 0,
    targetCompleteDate: '',
    unavailableDates: [] as string[]
  });

  const subjects = [
    '数学Ⅰ', '数学A', '言語文化', '現代の国語', '論理表現', 
    'EC', '歴史総合', '生物', '化学', '物理', 
    '芸術', '保健', '情報', '探求', 'その他'
  ];

  const [customSubject, setCustomSubject] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalSubject = formData.subject === 'その他' ? customSubject : formData.subject;
    
    if (!finalSubject || !formData.title || !formData.dueDate) {
      alert('必須項目を入力してください');
      return;
    }

    if (formData.subject === 'その他' && !customSubject.trim()) {
      alert('教科名を入力してください');
      return;
    }
    const homework: Homework = {
      id: Date.now().toString(),
      subject: finalSubject,
      title: formData.title,
      content: formData.content,
      dueDate: formData.dueDate,
      pages: formData.pages,
      estimatedTime: formData.estimatedTime,
      targetCompleteDate: formData.targetCompleteDate || formData.dueDate,
      unavailableDates: formData.unavailableDates,
      isCompleted: false,
      createdAt: new Date().toISOString(),
      dailyTasks: []
    };

    // 日別タスクの生成はApp.tsxで行うため、ここでは空配列を設定
    homework.dailyTasks = [];
    onAddHomework(homework);
    
    // Reset form
    setFormData({
      subject: '',
      title: '',
      content: '',
      dueDate: '',
      pages: 0,
      estimatedTime: 0,
      targetCompleteDate: '',
      unavailableDates: []
    });
    setCustomSubject('');
    setShowCustomInput(false);
  };

  const handleReset = () => {
    setFormData({
      subject: '',
      title: '',
      content: '',
      dueDate: '',
      pages: 0,
      estimatedTime: 0,
      targetCompleteDate: '',
      unavailableDates: []
    });
    setCustomSubject('');
    setShowCustomInput(false);
  };

  const handleSubjectChange = (value: string) => {
    setFormData({ ...formData, subject: value });
    setShowCustomInput(value === 'その他');
    if (value !== 'その他') {
      setCustomSubject('');
    }
  };
  const handleAddUnavailableDate = (date: string) => {
    if (date && !formData.unavailableDates.includes(date)) {
      setFormData({
        ...formData,
        unavailableDates: [...formData.unavailableDates, date].sort()
      });
    }
  };

  const handleRemoveUnavailableDate = (date: string) => {
    setFormData({
      ...formData,
      unavailableDates: formData.unavailableDates.filter(d => d !== date)
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold gradient-text mb-2">宿題を登録</h1>
        <p className="text-white/80">新しい宿題を追加して計画を立てましょう</p>
      </div>

      <div className="glass-card rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              教科 <span className="text-red-400">*</span>
            </label>
            <select
              value={formData.subject}
              onChange={(e) => handleSubjectChange(e.target.value)}
              className="select-field w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            >
              <option value="">教科を選択</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
            
            {showCustomInput && (
              <input
                type="text"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                className="input-field w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent mt-2"
                placeholder="教科名を入力してください"
                required
              />
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              宿題名 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input-field w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="例：数学の問題集P20-25"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              内容・詳細
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={3}
              className="input-field w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="宿題の詳細や注意点を記入"
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              提出期限 <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="input-field w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          {/* Pages and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                ページ数/問題数
              </label>
              <input
                type="number"
                value={formData.pages}
                onChange={(e) => setFormData({ ...formData, pages: parseInt(e.target.value) || 0 })}
                className="input-field w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                min="0"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                予想時間（分）
              </label>
              <input
                type="number"
                value={formData.estimatedTime}
                onChange={(e) => setFormData({ ...formData, estimatedTime: parseInt(e.target.value) || 0 })}
                className="input-field w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                min="0"
                placeholder="0"
              />
            </div>
          </div>

          {/* Target Complete Date */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              いつまでに終わらせたいか
            </label>
            <input
              type="date"
              value={formData.targetCompleteDate}
              onChange={(e) => setFormData({ ...formData, targetCompleteDate: e.target.value })}
              className="input-field w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <p className="text-sm text-white/60 mt-1">
              この宿題固有の利用不可日を選択してください（全体の予定は設定画面で管理）
            </p>
          </div>

          {/* Unavailable Dates */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              宿題ができない日
            </label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="date"
                  id="unavailable-date-input"
                  className="input-field flex-1 px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  onChange={(e) => {
                    if (e.target.value) {
                      handleAddUnavailableDate(e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById('unavailable-date-input') as HTMLInputElement;
                    if (input.value) {
                      handleAddUnavailableDate(input.value);
                      input.value = '';
                    }
                  }}
                  className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                >
                  追加
                </button>
              </div>
              
              {formData.unavailableDates.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-white/70">選択された利用不可日:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.unavailableDates.map(date => (
                      <div
                        key={date}
                        className="flex items-center gap-2 bg-red-500/20 text-red-300 px-3 py-1 rounded-lg text-sm"
                      >
                        <span>{new Date(date).toLocaleDateString('ja-JP')}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveUnavailableDate(date)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <p className="text-sm text-white/60">
                部活動、テスト、その他の予定で宿題ができない日を選択してください
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="star-button flex-1 text-white py-2 px-4 rounded-lg focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 flex items-center justify-center gap-2"
            >
              <Save size={20} />
              宿題を登録
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 border border-white/20 text-white/80 rounded-lg hover:bg-white/10 focus:ring-2 focus:ring-white/20 focus:ring-offset-2 transition-colors flex items-center gap-2"
            >
              <X size={20} />
              リセット
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}