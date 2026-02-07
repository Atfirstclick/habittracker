import { Habit } from './types';

const STORAGE_KEY = 'habittracker_habits';

export function loadHabits(): Habit[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveHabits(habits: Habit[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
}

export function todayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

export function getStreak(habit: Habit): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sorted = [...habit.completedDates].sort().reverse();
  if (sorted.length === 0) return 0;

  // Check if the most recent completion is today or yesterday
  const mostRecent = new Date(sorted[0] + 'T00:00:00');
  const diffDays = Math.floor((today.getTime() - mostRecent.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays > 1) return 0;

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const current = new Date(sorted[i - 1] + 'T00:00:00');
    const prev = new Date(sorted[i] + 'T00:00:00');
    const diff = Math.floor((current.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export function getLast7Days(): string[] {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
