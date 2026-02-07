import { useState, useEffect, useCallback } from 'react';
import { Habit } from './types';
import { loadHabits, saveHabits, todayDateString, generateId } from './storage';
import HabitList from './components/HabitList';
import AddHabit from './components/AddHabit';
import StatsView from './components/StatsView';

type View = 'habits' | 'stats';

const COLORS = ['#4f46e5', '#059669', '#d97706', '#dc2626', '#7c3aed', '#0891b2', '#be185d', '#65a30d'];

export default function App() {
  const [habits, setHabits] = useState<Habit[]>(loadHabits);
  const [showAddForm, setShowAddForm] = useState(false);
  const [view, setView] = useState<View>('habits');

  useEffect(() => {
    saveHabits(habits);
  }, [habits]);

  const addHabit = useCallback((name: string, description: string) => {
    const color = COLORS[habits.length % COLORS.length];
    setHabits(prev => [
      ...prev,
      { id: generateId(), name, description, color, createdAt: todayDateString(), completedDates: [] },
    ]);
    setShowAddForm(false);
  }, [habits.length]);

  const toggleHabit = useCallback((id: string, date: string) => {
    setHabits(prev =>
      prev.map(h => {
        if (h.id !== id) return h;
        const completed = h.completedDates.includes(date);
        return {
          ...h,
          completedDates: completed
            ? h.completedDates.filter(d => d !== date)
            : [...h.completedDates, date],
        };
      })
    );
  }, []);

  const deleteHabit = useCallback((id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  }, []);

  return (
    <div className="app">
      <header className="header">
        <h1>Habit Tracker</h1>
        <nav className="nav">
          <button
            className={`nav-btn ${view === 'habits' ? 'active' : ''}`}
            onClick={() => setView('habits')}
          >
            Today
          </button>
          <button
            className={`nav-btn ${view === 'stats' ? 'active' : ''}`}
            onClick={() => setView('stats')}
          >
            Stats
          </button>
        </nav>
      </header>

      <main className="main">
        {view === 'habits' ? (
          <>
            <HabitList
              habits={habits}
              onToggle={toggleHabit}
              onDelete={deleteHabit}
            />
            {showAddForm ? (
              <AddHabit
                onAdd={addHabit}
                onCancel={() => setShowAddForm(false)}
              />
            ) : (
              <button className="add-btn" onClick={() => setShowAddForm(true)}>
                + New Habit
              </button>
            )}
          </>
        ) : (
          <StatsView habits={habits} />
        )}
      </main>
    </div>
  );
}
