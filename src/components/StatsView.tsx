import { useState, useMemo } from 'react';
import { Habit } from '../types';
import { getStreak, getMonthDays, getFirstDayOfWeek, todayDateString } from '../storage';

interface Props {
  habits: Habit[];
}

export default function StatsView({ habits }: Props) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [filterHabitId, setFilterHabitId] = useState<string>('all');

  const filteredHabits = filterHabitId === 'all'
    ? habits
    : habits.filter(h => h.id === filterHabitId);

  const bestStreak = habits.length > 0
    ? Math.max(...habits.map(h => getStreak(h)))
    : 0;

  const todayStr = todayDateString();
  const monthDays = getMonthDays(year, month);
  const firstDayOffset = getFirstDayOfWeek(year, month);

  const monthCompletions = useMemo(() => {
    const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
    return filteredHabits.reduce((sum, h) =>
      sum + h.completedDates.filter(d => d.startsWith(monthPrefix)).length
    , 0);
  }, [filteredHabits, year, month]);

  const totalCompletions = useMemo(() =>
    filteredHabits.reduce((sum, h) => sum + h.completedDates.length, 0)
  , [filteredHabits]);

  // Set of dates that have at least one completion among filtered habits
  const completedDateSet = useMemo(() => {
    const set = new Set<string>();
    filteredHabits.forEach(h => h.completedDates.forEach(d => set.add(d)));
    return set;
  }, [filteredHabits]);

  // Set of dates that have at least one skip
  const skippedDateSet = useMemo(() => {
    const set = new Set<string>();
    filteredHabits.forEach(h => h.skippedDates.forEach(d => set.add(d)));
    return set;
  }, [filteredHabits]);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  if (habits.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📊</div>
        <p className="empty-title">No stats yet</p>
        <p className="empty-subtitle">Add habits and start completing them to see stats.</p>
      </div>
    );
  }

  return (
    <div className="stats-view">
      <h2 className="stats-page-title">Statistics</h2>

      <div className="filter-row">
        <select
          className="habit-filter"
          value={filterHabitId}
          onChange={e => setFilterHabitId(e.target.value)}
        >
          <option value="all">All habits</option>
          {habits.map(h => (
            <option key={h.id} value={h.id}>{h.emoji} {h.name}</option>
          ))}
        </select>
      </div>

      <div className="streak-banner">
        <span className="streak-fire">🔥</span>
        <span className="streak-num">{bestStreak}</span>
        <span className="streak-label">Days in a row</span>
      </div>

      <div className="stats-cards">
        <div className="stat-card dark">
          <span className="stat-value">{monthCompletions}</span>
          <span className="stat-label">Executed for {monthNames[month]}</span>
        </div>
        <div className="stat-card dark">
          <span className="stat-value">{totalCompletions}</span>
          <span className="stat-label">Completed for all time</span>
        </div>
      </div>

      <div className="calendar-section">
        <div className="calendar-header">
          <span className="calendar-year-month">{year} - {monthNames[month]}</span>
          <div className="calendar-nav">
            <button className="cal-nav-btn" onClick={prevMonth} aria-label="Previous month">&lsaquo;</button>
            <button className="cal-nav-btn" onClick={nextMonth} aria-label="Next month">&rsaquo;</button>
          </div>
        </div>
        <div className="calendar-weekdays">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
            <span key={d} className="cal-weekday">{d}</span>
          ))}
        </div>
        <div className="calendar-grid">
          {Array.from({ length: firstDayOffset }).map((_, i) => (
            <span key={`empty-${i}`} className="cal-day empty" />
          ))}
          {monthDays.map(({ date, day }) => {
            const isCompleted = completedDateSet.has(date);
            const isSkipped = skippedDateSet.has(date);
            const isToday = date === todayStr;
            return (
              <span
                key={date}
                className={`cal-day ${isCompleted ? 'completed' : ''} ${isSkipped && !isCompleted ? 'skipped' : ''} ${isToday ? 'today' : ''}`}
              >
                {isSkipped && !isCompleted ? (
                  <svg className="cal-skip-icon" width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path d="M3 3v10l5-5L3 3z" fill="currentColor" />
                    <path d="M8 3v10l5-5L8 3z" fill="currentColor" />
                  </svg>
                ) : (
                  day
                )}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
