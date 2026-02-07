import { Habit } from '../types';
import { getStreak, getLast7Days } from '../storage';

interface Props {
  habits: Habit[];
}

export default function StatsView({ habits }: Props) {
  const last7 = getLast7Days();

  if (habits.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-title">No stats yet</p>
        <p className="empty-subtitle">Add habits and start completing them to see stats.</p>
      </div>
    );
  }

  const totalCompletions = habits.reduce((sum, h) => sum + h.completedDates.length, 0);
  const bestStreak = Math.max(...habits.map(h => getStreak(h)));
  const todayCompletions = habits.filter(h =>
    h.completedDates.includes(last7[last7.length - 1])
  ).length;

  // Weekly completion rate
  const totalPossible = habits.length * 7;
  const totalDone = habits.reduce((sum, h) => {
    return sum + last7.filter(d => h.completedDates.includes(d)).length;
  }, 0);
  const weeklyRate = totalPossible > 0 ? Math.round((totalDone / totalPossible) * 100) : 0;

  return (
    <div className="stats-view">
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-value">{habits.length}</span>
          <span className="stat-label">Total Habits</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{todayCompletions}/{habits.length}</span>
          <span className="stat-label">Done Today</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{bestStreak}d</span>
          <span className="stat-label">Best Streak</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{weeklyRate}%</span>
          <span className="stat-label">This Week</span>
        </div>
      </div>

      <h2 className="section-title">Weekly Overview</h2>
      <div className="weekly-chart">
        {habits.map(habit => {
          const weekDone = last7.filter(d => habit.completedDates.includes(d)).length;
          return (
            <div key={habit.id} className="chart-row">
              <span className="chart-label">{habit.name}</span>
              <div className="chart-bar-bg">
                <div
                  className="chart-bar-fill"
                  style={{ width: `${(weekDone / 7) * 100}%`, backgroundColor: habit.color }}
                />
              </div>
              <span className="chart-value">{weekDone}/7</span>
            </div>
          );
        })}
      </div>

      <p className="stats-footer">Total completions across all time: {totalCompletions}</p>
    </div>
  );
}
