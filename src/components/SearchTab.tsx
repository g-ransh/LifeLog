import { useState } from 'react';
import { Search, Clock, Zap, Heart, DollarSign, Layers, Dumbbell } from 'lucide-react';

const QUICK_LINKS = [
  { label: 'Log Peak State', tab: 'health', icon: <Heart size={14} color="#ffc989" /> },
  { label: 'Add Task', tab: 'home', icon: <Zap size={14} color="#ffb86f" /> },
  { label: 'Log Sports Session', tab: 'health', icon: <Dumbbell size={14} color="#3b82f6" /> },
  { label: 'Add Transaction', tab: 'finances', icon: <DollarSign size={14} color="#22c55e" /> },
  { label: 'Add Content Idea', tab: 'brand', icon: <Layers size={14} color="#8b5cf6" /> },
];

const RECENT: string[] = [];

export default function SearchTab({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const [query, setQuery] = useState('');

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 pb-4">
      <div className="px-4 pt-4">
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', color: '#555', textTransform: 'uppercase', marginBottom: 12 }}>
          Search
        </div>
        <div
          className="flex items-center gap-3 rounded-xl px-4 py-3"
          style={{ background: '#111', border: '1px solid #2a2a2a' }}
        >
          <Search size={16} color="#555" />
          <input
            type="text"
            placeholder="Search gauransh..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 outline-none bg-transparent"
            style={{ color: '#e8e8e8', fontSize: 14 }}
            autoFocus
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4">
        <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', color: '#555', textTransform: 'uppercase', marginBottom: 10 }}>
          Quick actions
        </div>
        <div className="flex flex-col gap-2">
          {QUICK_LINKS.map(link => (
            <button
              key={link.label}
              onClick={() => onNavigate(link.tab)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all"
              style={{ background: '#111', border: '1px solid #1e1e1e' }}
            >
              <span className="flex items-center justify-center rounded-lg" style={{ width: 28, height: 28, background: '#1a1a1a' }}>
                {link.icon}
              </span>
              <span style={{ fontSize: 13, fontWeight: 500, color: '#d0d0d0' }}>{link.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent */}
      <div className="px-4">
        <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', color: '#555', textTransform: 'uppercase', marginBottom: 10 }}>
          Recent searches
        </div>
        <div className="flex flex-col gap-2">
          {RECENT.length === 0 && (
            <p className="rounded-xl px-4 py-5 text-center text-sm text-neutral-600" style={{ background: '#111', border: '1px dashed #242424' }}>
              No recent searches yet.
            </p>
          )}
          {RECENT.map(r => (
            <button
              key={r}
              onClick={() => setQuery(r)}
              className="flex items-center gap-3 rounded-xl px-4 py-2 text-left"
            >
              <Clock size={12} color="#444" />
              <span style={{ fontSize: 13, color: '#555' }}>{r}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
