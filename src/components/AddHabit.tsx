import { useState } from 'react';
import EmojiPicker from './EmojiPicker';

interface Props {
  onAdd: (name: string, emoji: string) => void;
  onCancel: () => void;
}

export default function AddHabit({ onAdd, onCancel }: Props) {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🎯');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd(trimmed, emoji);
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <form className="add-form" onSubmit={handleSubmit} onClick={e => e.stopPropagation()}>
        <h2 className="form-title">New Habit</h2>
        <div className="emoji-preview">{emoji}</div>
        <EmojiPicker selected={emoji} onSelect={setEmoji} />
        <input
          className="input"
          type="text"
          placeholder="Habit name"
          value={name}
          onChange={e => setName(e.target.value)}
          autoFocus
          maxLength={50}
        />
        <div className="form-actions">
          <button className="btn btn-secondary" type="button" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-primary" type="submit" disabled={!name.trim()}>
            Add Habit
          </button>
        </div>
      </form>
    </div>
  );
}
