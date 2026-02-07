const EMOJI_OPTIONS = [
  '💧', '🧘', '📋', '💪', '🍎', '📚', '🏃', '😴',
  '🎯', '✍️', '🎵', '🧹', '💊', '🥗', '🚶', '🧠',
  '☀️', '🌙', '💡', '🎨', '🏋️', '🚴', '🧘‍♂️', '🍳',
];

interface Props {
  selected: string;
  onSelect: (emoji: string) => void;
}

export default function EmojiPicker({ selected, onSelect }: Props) {
  return (
    <div className="emoji-picker">
      {EMOJI_OPTIONS.map(emoji => (
        <button
          key={emoji}
          type="button"
          className={`emoji-option ${emoji === selected ? 'selected' : ''}`}
          onClick={() => onSelect(emoji)}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
