import { Habit } from '../types';
import { todayDateString, getStreak, getLast7Days } from '../storage';

interface Props {
  habits: Habit[];
  onToggle: (id: string, date: string) => void;
  onDelete: (id: string) => void;
}

export default function HabitList({ habits, onToggle, onDelete }: Props) {
  const today = todayDateString();
  const last7 = getLast7Days();

  if (habits.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-title">No habits yet</p>
        <p className="empty-subtitle">Add your first habit to start tracking!</p>
      </div>
    );
  }

  return (
    <div className="habit-list">
      {habits.map(habit => {
        const completedToday = habit.completedDates.includes(today);
        const streak = getStreak(habit);

        return (
          <div key={habit.id} className="habit-card">
            <div className="habit-header">
              <button
                className={`check-btn ${completedToday ? 'checked' : ''}`}
                style={{ borderColor: habit.color, backgroundColor: completedToday ? habit.color : 'transparent' }}
                onClick={() => onToggle(habit.id, today)}
                aria-label={`Mark ${habit.name} as ${completedToday ? 'incomplete' : 'complete'}`}
              >
                {completedToday && (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8l3 3 7-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
              <div className="habit-info">
                <span className={`habit-name ${completedToday ? 'completed' : ''}`}>{habit.name}</span>
                {habit.description && <span className="habit-desc">{habit.description}</span>}
              </div>
              <div className="habit-actions">
                {streak > 0 && (
                  <span className="streak" style={{ color: habit.color }}>
                    {streak}d streak
                  </span>
                )}
                <button className="delete-btn" onClick={() => onDelete(habit.id)} aria-label={`Delete ${habit.name}`}>
                  &times;
                </button>
              </div>
            </div>
            <div className="week-dots">
              {last7.map(date => {
                const done = habit.completedDates.includes(date);
                const dayLabel = new Date(date + 'T00:00:00').toLocaleDateString('en', { weekday: 'short' }).slice(0, 2);
                return (
                  <button
                    key={date}
                    className={`dot ${done ? 'done' : ''} ${date === today ? 'today' : ''}`}
                    style={{ backgroundColor: done ? habit.color : undefined }}
                    onClick={() => onToggle(habit.id, date)}
                    title={date}
                  >
                    <span className="dot-label">{dayLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
