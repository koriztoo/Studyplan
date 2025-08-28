import { useState, useEffect } from 'react';
import { rescheduleHomework } from '../utils/homeworkUtils';
import { Homework } from '../types';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      const parsedValue = item ? JSON.parse(item) : initialValue;
      
      // 宿題データの場合は自動再計画を実行
      if (key === 'homeworks' && Array.isArray(parsedValue)) {
        return parsedValue.map((homework: Homework) => rescheduleHomework(homework));
      }
      
      return parsedValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}