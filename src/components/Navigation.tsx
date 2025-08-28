import React from 'react';
import { Home, Calendar, Plus, Settings } from 'lucide-react';
import { ViewMode } from '../types';

interface NavigationProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export function Navigation({ currentView, onViewChange }: NavigationProps) {
  const navItems = [
    { id: 'today' as ViewMode, label: 'ホーム', icon: Home },
    { id: 'calendar' as ViewMode, label: 'カレンダー', icon: Calendar },
    { id: 'register' as ViewMode, label: '登録', icon: Plus },
    { id: 'settings' as ViewMode, label: '設定', icon: Settings }
  ];

  return (
    <nav className="glass-nav fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-around">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onViewChange(id)}
              className={`flex flex-col items-center py-2 px-4 transition-colors ${
                currentView === id
                  ? 'text-purple-300'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Icon size={24} className="mb-1" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}