import { todayDateString, getWeekDays } from '../storage';

interface Props {
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export default function DateStrip({ selectedDate, onSelectDate }: Props) {
  const today = todayDateString();
  const refDate = new Date(selectedDate + 'T00:00:00');
  const weekDays = getWeekDays(refDate);

  return (
    <div className="date-strip">
      {weekDays.map(({ date, dayLabel, dayNum }) => {
        const isToday = date === today;
        const isSelected = date === selectedDate;
        return (
          <button
            key={date}
            className={`date-item ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
            onClick={() => onSelectDate(date)}
          >
            <span className="date-day-label">{dayLabel}</span>
            <span className="date-day-num">{dayNum}</span>
          </button>
        );
      })}
    </div>
  );
}
