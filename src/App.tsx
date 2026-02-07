import { useState, useEffect, useCallback } from 'react';
import { Habit } from './types';
import { loadHabits, saveHabits, todayDateString, generateId } from './storage';
import DateStrip from './components/DateStrip';
import HabitList from './components/HabitList';
import AddHabit from './components/AddHabit';
import StatsView from './components/StatsView';
import BottomBar from './components/BottomBar';

type View = 'habits' | 'stats';

const COLORS = ['#6C5CE7', '#00B894', '#FDCB6E', '#E17055', '#0984E3', '#E84393', '#00CEC9', '#55E6C1'];

export default function App() {
  const [habits, setHabits] = useState<Habit[]>(loadHabits);
  const [showAddForm, setShowAddForm] = useState(false);
  const [view, setView] = useState<View>('habits');
  const [selectedDate, setSelectedDate] = useState(todayDateString());

  useEffect(() => {
    saveHabits(habits);
  }, [habits]);

  const addHabit = useCallback((name: string, emoji: string) => {
    const color = COLORS[habits.length % COLORS.length];
    setHabits(prev => [
      ...prev,
      {
        id: generateId(),
        name,
        emoji,
        color,
        createdAt: todayDateString(),
        completedDates: [],
        skippedDates: [],
      },
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
          // Remove skip if completing
          skippedDates: completed ? h.skippedDates : h.skippedDates.filter(d => d !== date),
        };
      })
    );
  }, []);

  const skipHabit = useCallback((id: string, date: string) => {
    setHabits(prev =>
      prev.map(h => {
        if (h.id !== id) return h;
        const skipped = h.skippedDates.includes(date);
        return {
          ...h,
          skippedDates: skipped
            ? h.skippedDates.filter(d => d !== date)
            : [...h.skippedDates, date],
          // Remove completion if skipping
          completedDates: skipped ? h.completedDates : h.completedDates.filter(d => d !== date),
        };
      })
    );
  }, []);

  const deleteHabit = useCallback((id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  }, []);

  return (
    <div className="app">
      {view === 'habits' ? (
        <>
          <header className="header">
            <h1 className="page-title">Habits</h1>
          </header>
          <DateStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} />
          <main className="main">
            <HabitList
              habits={habits}
              selectedDate={selectedDate}
              onToggle={toggleHabit}
              onSkip={skipHabit}
              onDelete={deleteHabit}
            />
          </main>
        </>
      ) : (
        <main className="main">
          <StatsView habits={habits} />
        </main>
      )}

      {showAddForm && (
        <AddHabit onAdd={addHabit} onCancel={() => setShowAddForm(false)} />
      )}

      <BottomBar view={view} onChangeView={setView} onAdd={() => setShowAddForm(true)} />
    </div>
  );
}
