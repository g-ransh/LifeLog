import { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface ContentIdea {
  id: string;
  title: string;
  platform: string;
  status: 'idea' | 'scripting' | 'filming' | 'editing' | 'done';
  priority: boolean;
}

const PLATFORMS = ['YouTube', 'Instagram', 'TikTok', 'Twitter', 'Discord'];
const STATUSES = ['idea', 'scripting', 'filming', 'editing', 'done'] as const;

const STATUS_COLORS: Record<string, string> = {
  idea: '#555',
  scripting: '#3b82f6',
  filming: '#ffb86f',
  editing: '#8b5cf6',
  done: '#22c55e',
};

export default function BrandTab() {
  const [ideas, setIdeas] = useState<ContentIdea[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newPlatform, setNewPlatform] = useState('YouTube');

  const addIdea = () => {
    if (!newTitle.trim()) return;
    setIdeas(prev => [...prev, {
      id: Date.now().toString(),
      title: newTitle.trim(),
      platform: newPlatform,
      status: 'idea',
      priority: false,
    }]);
    setNewTitle('');
  };

  const updateStatus = (id: string, status: ContentIdea['status']) => {
    setIdeas(prev => prev.map(i => i.id === id ? { ...i, status } : i));
  };

  const removeIdea = (id: string) => {
    setIdeas(prev => prev.filter(i => i.id !== id));
  };

  const doneCount = ideas.filter(i => i.status === 'done').length;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 pb-4">
      <div className="px-4 pt-4">
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', color: '#555', textTransform: 'uppercase', marginBottom: 4 }}>
          BRAND
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#e8e8e8', letterSpacing: '-0.02em' }}>
          Content Pipeline
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 px-4">
        <div className="rounded-xl p-3" style={{ background: '#111', border: '1px solid #1e1e1e' }}>
          <div style={{ fontSize: 9, color: '#555', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 4 }}>Total</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#e8e8e8' }}>{ideas.length}</div>
        </div>
        <div className="rounded-xl p-3" style={{ background: '#111', border: '1px solid #1e1e1e' }}>
          <div style={{ fontSize: 9, color: '#555', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 4 }}>In progress</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#ffb86f' }}>{ideas.filter(i => ['scripting', 'filming', 'editing'].includes(i.status)).length}</div>
        </div>
        <div className="rounded-xl p-3" style={{ background: '#111', border: '1px solid #1e1e1e' }}>
          <div style={{ fontSize: 9, color: '#555', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 4 }}>Done</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#22c55e' }}>{doneCount}</div>
        </div>
      </div>

      {/* Add Content */}
      <div className="mx-4 rounded-xl p-4" style={{ background: '#111', border: '1px solid #1e1e1e' }}>
        <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.12em', color: '#555', textTransform: 'uppercase', marginBottom: 12 }}>
          ADD CONTENT IDEA
        </div>
        <input
          type="text"
          placeholder="Content title or idea..."
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addIdea()}
          className="w-full rounded-xl px-3 py-2 mb-2 outline-none"
          style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#e8e8e8', fontSize: 13 }}
        />
        <div className="flex gap-2">
          <select
            value={newPlatform}
            onChange={e => setNewPlatform(e.target.value)}
            className="flex-1 rounded-xl px-3 py-2 outline-none"
            style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#e8e8e8', fontSize: 12 }}
          >
            {PLATFORMS.map(p => <option key={p}>{p}</option>)}
          </select>
          <button
            onClick={addIdea}
            className="rounded-xl px-4 py-2 font-bold"
            style={{ background: '#e8e8e8', color: '#0a0a0a', fontSize: 13 }}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Content Ideas by Status */}
      {STATUSES.filter(s => s !== 'done').map(status => {
        const filtered = ideas.filter(i => i.status === status);
        if (filtered.length === 0) return null;
        return (
          <div key={status} className="px-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="rounded-full" style={{ width: 6, height: 6, background: STATUS_COLORS[status] }} />
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', color: STATUS_COLORS[status], textTransform: 'uppercase' }}>
                {status}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {filtered.map(idea => (
                <div
                  key={idea.id}
                  className="rounded-xl px-4 py-3 flex items-center gap-3"
                  style={{ background: '#111', border: '1px solid #1e1e1e' }}
                >
                  <div className="flex-1">
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#d0d0d0' }}>{idea.title}</div>
                    <div style={{ fontSize: 10, color: '#555', marginTop: 2 }}>{idea.platform}</div>
                  </div>
                  <select
                    value={idea.status}
                    onChange={e => updateStatus(idea.id, e.target.value as ContentIdea['status'])}
                    className="rounded-lg px-2 py-1 outline-none"
                    style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: STATUS_COLORS[idea.status], fontSize: 10 }}
                  >
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button onClick={() => removeIdea(idea.id)}>
                    <X size={12} color="#333" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Done section */}
      {ideas.filter(i => i.status === 'done').length > 0 && (
        <div className="px-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="rounded-full" style={{ width: 6, height: 6, background: '#22c55e' }} />
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', color: '#22c55e', textTransform: 'uppercase' }}>done</span>
          </div>
          <div className="flex flex-col gap-2">
            {ideas.filter(i => i.status === 'done').map(idea => (
              <div
                key={idea.id}
                className="rounded-xl px-4 py-3 flex items-center gap-3"
                style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', opacity: 0.6 }}
              >
                <div className="flex-1">
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#888', textDecoration: 'line-through' }}>{idea.title}</div>
                  <div style={{ fontSize: 10, color: '#444', marginTop: 2 }}>{idea.platform}</div>
                </div>
                <button onClick={() => removeIdea(idea.id)}>
                  <X size={12} color="#333" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
