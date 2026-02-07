export interface Habit {
  id: string;
  name: string;
  emoji: string;
  color: string;
  createdAt: string;
  completedDates: string[]; // ISO date strings (YYYY-MM-DD)
  skippedDates: string[];   // ISO date strings (YYYY-MM-DD)
}
