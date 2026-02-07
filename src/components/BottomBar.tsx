type View = 'habits' | 'stats';

interface Props {
  view: View;
  onChangeView: (view: View) => void;
  onAdd: () => void;
}

export default function BottomBar({ view, onChangeView, onAdd }: Props) {
  return (
    <nav className="bottom-bar">
      <button
        className={`tab-btn ${view === 'habits' ? 'active' : ''}`}
        onClick={() => onChangeView('habits')}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
        </svg>
        <span>Habits</span>
      </button>

      <button className="fab" onClick={onAdd} aria-label="Add new habit">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M14 6v16M6 14h16" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </button>

      <button
        className={`tab-btn ${view === 'stats' ? 'active' : ''}`}
        onClick={() => onChangeView('stats')}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
        <span>Statistics</span>
      </button>
    </nav>
  );
}
