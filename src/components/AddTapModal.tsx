import { useState } from 'react';
import { X } from 'lucide-react';
import { Tap } from '../types';

const EMOJI_OPTIONS = ['💊', '🟦', '☕', '💧', '🍵', '🧃', '🥤', '🏃', '😴', '🧘', '🥗', '🍌', '🥚', '🧠', '⚡', '🔥'];

interface AddTapModalProps {
  onAdd: (tap: Tap) => void;
  onClose: () => void;
}

export default function AddTapModal({ onAdd, onClose }: AddTapModalProps) {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('💊');
  const [effect, setEffect] = useState('');
  const [effectValue, setEffectValue] = useState(10);
  const [color] = useState('#3a3a3a');

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd({
      id: Date.now().toString(),
      name: name.trim(),
      emoji,
      effect: effect.trim() || 'energy',
      effectValue,
      color,
      count: 0,
      times: [],
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="w-full rounded-t-3xl p-6"
        style={{ background: '#141414', border: '1px solid #2a2a2a', maxWidth: 480 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#e8e8e8' }}>Add Custom Tap</h3>
          <button onClick={onClose}><X size={20} color="#555" /></button>
        </div>

        {/* Emoji picker */}
        <div className="mb-4">
          <div style={{ fontSize: 11, color: '#666', marginBottom: 8 }}>Icon</div>
          <div className="grid grid-cols-8 gap-2">
            {EMOJI_OPTIONS.map(e => (
              <button
                key={e}
                onClick={() => setEmoji(e)}
                className="flex items-center justify-center rounded-lg"
                style={{
                  height: 36,
                  fontSize: 18,
                  background: emoji === e ? 'rgba(255,201,137,0.2)' : '#1a1a1a',
                  border: `1px solid ${emoji === e ? '#ffc989' : '#2a2a2a'}`,
                }}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Name (e.g. Matcha, Creatine...)"
            value={name}
            onChange={e => setName(e.target.value)}
            className="rounded-xl px-4 py-3 outline-none w-full"
            style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#e8e8e8', fontSize: 13 }}
          />
          <input
            type="text"
            placeholder="Effect label (e.g. focus, energy, calm)"
            value={effect}
            onChange={e => setEffect(e.target.value)}
            className="rounded-xl px-4 py-3 outline-none w-full"
            style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#e8e8e8', fontSize: 13 }}
          />
          <div>
            <div className="flex items-center justify-between mb-2">
              <span style={{ fontSize: 11, color: '#666' }}>Effect score</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: effectValue >= 0 ? '#22c55e' : '#ef4444' }}>
                {effectValue >= 0 ? '+' : ''}{effectValue}
              </span>
            </div>
            <input
              type="range"
              min={-30}
              max={30}
              value={effectValue}
              onChange={e => setEffectValue(parseInt(e.target.value))}
              className="w-full"
              style={{ accentColor: effectValue >= 0 ? '#22c55e' : '#ef4444' }}
            />
          </div>
        </div>

        <button
          onClick={handleAdd}
          className="w-full mt-5 rounded-xl py-3 font-bold"
          style={{ background: '#ffc989', color: '#1a1008', fontSize: 14 }}
        >
          Add Tap
        </button>
      </div>
    </div>
  );
}
