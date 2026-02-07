import { useState } from 'react';

interface Props {
  onAdd: (name: string, description: string) => void;
  onCancel: () => void;
}

export default function AddHabit({ onAdd, onCancel }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd(trimmed, description.trim());
  };

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <input
        className="input"
        type="text"
        placeholder="Habit name"
        value={name}
        onChange={e => setName(e.target.value)}
        autoFocus
        maxLength={50}
      />
      <input
        className="input"
        type="text"
        placeholder="Description (optional)"
        value={description}
        onChange={e => setDescription(e.target.value)}
        maxLength={100}
      />
      <div className="form-actions">
        <button className="btn btn-primary" type="submit" disabled={!name.trim()}>
          Add Habit
        </button>
        <button className="btn btn-secondary" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
