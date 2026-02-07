export interface Habit {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: string;
  completedDates: string[]; // ISO date strings (YYYY-MM-DD)
}
