import { Habit } from '../types';

interface Props {
  habits: Habit[];
  selectedDate: string;
  onToggle: (id: string, date: string) => void;
  onSkip: (id: string, date: string) => void;
  onDelete: (id: string) => void;
}

export default function HabitList({ habits, selectedDate, onToggle, onSkip, onDelete }: Props) {
  if (habits.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🌱</div>
        <p className="empty-title">No habits yet</p>
        <p className="empty-subtitle">Tap + to add your first habit!</p>
      </div>
    );
  }

  return (
    <div className="habit-list">
      {habits.map(habit => {
        const isCompleted = habit.completedDates.includes(selectedDate);
        const isSkipped = habit.skippedDates.includes(selectedDate);

        return (
          <div key={habit.id} className={`habit-card ${isCompleted ? 'completed' : ''} ${isSkipped ? 'skipped' : ''}`}>
            <button
              className={`check-btn ${isCompleted ? 'checked' : ''}`}
              onClick={() => onToggle(habit.id, selectedDate)}
              aria-label={`Mark ${habit.name} as ${isCompleted ? 'incomplete' : 'complete'}`}
            >
              {isCompleted && (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M4 9l3.5 3.5L14 5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
            <span className="habit-emoji">{habit.emoji}</span>
            <span className={`habit-name ${isCompleted ? 'done' : ''} ${isSkipped ? 'skip-text' : ''}`}>
              {habit.name}
            </span>
            <div className="habit-actions">
              <button
                className={`skip-btn ${isSkipped ? 'active' : ''}`}
                onClick={() => onSkip(habit.id, selectedDate)}
                aria-label="Skip for today"
                title="Skip for today"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 3v10l5-5L3 3z" fill="currentColor" />
                  <path d="M8 3v10l5-5L8 3z" fill="currentColor" />
                </svg>
              </button>
              <button
                className="delete-btn"
                onClick={() => onDelete(habit.id)}
                aria-label={`Delete ${habit.name}`}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
