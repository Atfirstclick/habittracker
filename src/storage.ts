import { Habit } from './types';

const STORAGE_KEY = 'habittracker_habits';

export function loadHabits(): Habit[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    // Migrate old habits that lack new fields
    return parsed.map((h: Habit & { description?: string }) => ({
      ...h,
      emoji: h.emoji || '',
      skippedDates: h.skippedDates || [],
    }));
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

export function getWeekDays(referenceDate: Date): { date: string; dayLabel: string; dayNum: number }[] {
  const days: { date: string; dayLabel: string; dayNum: number }[] = [];
  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  // Show 3 days before and 3 after reference
  for (let i = -3; i <= 3; i++) {
    const d = new Date(referenceDate);
    d.setDate(d.getDate() + i);
    days.push({
      date: d.toISOString().split('T')[0],
      dayLabel: dayNames[d.getDay()],
      dayNum: d.getDate(),
    });
  }
  return days;
}

export function getMonthDays(year: number, month: number): { date: string; day: number }[] {
  const days: { date: string; day: number }[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    days.push({ date: dateStr, day: d });
  }
  return days;
}

export function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
