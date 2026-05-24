import { useCallback, useRef, useState } from 'react';
import { Flame, Plus, TrendingDown, TrendingUp } from 'lucide-react';
import { Pattern, PeakState, Tap } from '../types';

interface HealthTabProps {
  taps: Tap[];
  patterns: Pattern[];
  peakStates: PeakState[];
  currentPeakLevel: number;
  dayStreak: number;
  totalLogs: number;
  sevenDayAvg: number;
  peakWindow: string;
  onTap: (id: string) => void;
  onLogPeak: (level: number, notes?: string) => void;
  onAddTap: () => void;
}

function getPeakLabel(level: number): string {
  if (level > 40) return 'peak';
  if (level < -40) return 'foggy';
  return 'steady';
}

function getPeakColor(level: number): string {
  if (level > 40) return 'var(--orange-lite)';
  if (level < -40) return 'var(--faint)';
  return 'var(--muted)';
}

export default function HealthTab({
  taps,
  patterns,
  peakStates,
  currentPeakLevel,
  dayStreak,
  totalLogs,
  sevenDayAvg,
  peakWindow,
  onTap,
  onLogPeak,
  onAddTap,
}: HealthTabProps) {
  const [peakLevel, setPeakLevel] = useState(currentPeakLevel);
  const [isDragging, setIsDragging] = useState(false);
  const [sliderNote, setSliderNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const setLevelFromPointer = useCallback((clientY: number) => {
    const rect = sliderRef.current?.getBoundingClientRect();
    if (!rect) return;
    const y = clientY - rect.top;
    const pct = 1 - y / rect.height;
    const level = Math.round((pct * 200) - 100);
    setPeakLevel(Math.max(-100, Math.min(100, level)));
  }, []);

  const thumbPosition = ((peakLevel + 100) / 200) * 100;
  const label = getPeakLabel(peakLevel);
  const color = getPeakColor(peakLevel);

  const handleLogPeak = () => {
    onLogPeak(peakLevel, sliderNote);
    setShowNoteInput(false);
    setSliderNote('');
  };

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4 px-4 pb-8 pt-4">
      <section className="glass-card rounded-[2rem] p-5 md:p-7">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full px-3 py-1" style={{ background: 'color-mix(in srgb, var(--orange-lite) 10%, transparent)', border: '1px solid var(--line)', color: 'var(--orange-lite)' }}>
              <Flame size={18} />
              <span className="text-xs font-semibold tracking-wide">Peak state</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight md:text-5xl" style={{ color: 'var(--text)' }}>How are you right now?</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6" style={{ color: 'var(--muted)' }}>Drag the state marker, add context, and build a clean record of the conditions that create your best work.</p>
          </div>
          <div className="hidden text-right md:block">
            <div className="text-sm" style={{ color: 'var(--faint)' }}>Peak window</div>
            <div className="mt-1 font-semibold soft-orange">{peakWindow}</div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
          <div className="neo-card rounded-[1.6rem] p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium" style={{ color: 'var(--muted)' }}>Quick log</span>
              <span className="text-sm" style={{ color: 'var(--faint)' }}>{totalLogs} logs today</span>
            </div>
            <div className="flex flex-col items-center select-none">
              <div className="mb-3 text-xs font-semibold soft-orange">peak</div>
              <div
                ref={sliderRef}
                className="relative flex h-64 w-full items-center justify-center"
                onClick={e => setLevelFromPointer(e.clientY)}
                onMouseDown={() => setIsDragging(true)}
                onMouseMove={e => isDragging && setLevelFromPointer(e.clientY)}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
                onTouchMove={e => setLevelFromPointer(e.touches[0].clientY)}
              >
                <div className="absolute bottom-0 top-0 w-0.5 rounded-full" style={{ background: 'linear-gradient(to bottom, var(--orange-lite), var(--muted), var(--faint))' }} />
                <div className="absolute flex flex-col items-center" style={{ top: `${100 - thumbPosition}%`, left: '50%', transform: 'translate(-50%, -50%)' }}>
                  <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full" style={{ background: 'var(--surface-strong)', border: `2px solid ${color}`, boxShadow: `0 0 24px color-mix(in srgb, ${color} 24%, transparent)` }}>
                    <div className="text-xs font-semibold tracking-wide" style={{ color }}>{label}</div>
                    <div className="text-2xl font-semibold" style={{ color: 'var(--text)' }}>{peakLevel > 0 ? `+${peakLevel}` : peakLevel}</div>
                  </div>
                </div>
              </div>
              <div className="mt-3 text-xs" style={{ color: 'var(--faint)' }}>foggy</div>
              <div className="mt-4 flex w-full gap-2">
                <button onClick={handleLogPeak} className="soft-orange-bg flex-1 rounded-2xl py-3 text-sm font-semibold text-[#22150c]">Log state</button>
                <button onClick={() => setShowNoteInput(!showNoteInput)} className="card-swap-button rounded-2xl px-4 text-sm font-medium">Add note</button>
              </div>
              {showNoteInput && (
                <input value={sliderNote} onChange={e => setSliderNote(e.target.value)} placeholder="What is happening right now?" className="brown-input mt-3 w-full rounded-2xl px-4 py-3 outline-none" />
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-3">
              <Metric label="Day streak" value={String(dayStreak)} />
              <Metric label="Total logs" value={String(totalLogs)} />
              <Metric label="Seven day avg" value={String(sevenDayAvg)} />
            </div>
            <div className="neo-card rounded-[1.6rem] p-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Taps</h2>
                <button onClick={onAddTap} className="card-swap-button rounded-xl px-3 py-2 text-xs font-medium"><Plus size={13} className="mr-1 inline" />Add</button>
              </div>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                {taps.length === 0 ? (
                  <p className="col-span-full rounded-2xl px-4 py-8 text-center text-sm" style={{ border: '1px dashed var(--line)', color: 'var(--faint)' }}>No taps yet. Add anything you want to correlate with your peak state.</p>
                ) : taps.map(tap => (
                  <button key={tap.id} onClick={() => onTap(tap.id)} className="tap-card flex min-h-24 flex-col items-center justify-center gap-1 rounded-2xl p-3" style={{ background: tap.count > 0 ? `${tap.color}55` : 'var(--surface-strong)', border: `1px solid ${tap.count > 0 ? tap.color : 'var(--line)'}` }}>
                    <span className="text-2xl">{tap.emoji}</span>
                    <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{tap.name}</span>
                    <span className="text-xs" style={{ color: 'var(--faint)' }}>{tap.count} taps</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="neo-card rounded-[1.6rem] p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Patterns it has learned</h2>
            <span className="text-xs" style={{ color: 'var(--faint)' }}>From {totalLogs} logs</span>
          </div>
          {totalLogs < 3 || patterns.length === 0 ? (
            <p className="rounded-2xl px-4 py-8 text-center text-sm" style={{ border: '1px dashed var(--line)', color: 'var(--faint)' }}>Keep logging. Patterns will appear after enough real entries.</p>
          ) : patterns.map(pattern => (
            <div key={pattern.id} className="flex items-start gap-3 border-t py-3 first:border-t-0" style={{ borderColor: 'var(--line)' }}>
              {pattern.positive ? <TrendingUp size={16} color="#22c55e" /> : <TrendingDown size={16} color="#ef4444" />}
              <div>
                <div className="text-sm font-medium" style={{ color: 'var(--text)' }}>{pattern.description}</div>
                <div className="text-xs" style={{ color: 'var(--faint)' }}>{pattern.effectValue > 0 ? '+' : ''}{pattern.effectValue} {pattern.effect} · {pattern.days} days · {pattern.confidence} confidence</div>
              </div>
            </div>
          ))}
        </div>

        <div className="neo-card rounded-[1.6rem] p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Peak log</h2>
            <span className="text-xs" style={{ color: 'var(--faint)' }}>{peakStates.length} entries</span>
          </div>
          {peakStates.length === 0 ? (
            <p className="rounded-2xl px-4 py-8 text-center text-sm" style={{ border: '1px dashed var(--line)', color: 'var(--faint)' }}>No peak states logged yet.</p>
          ) : peakStates.slice().reverse().map((ps, i) => (
            <div key={`${ps.timestamp}-${i}`} className="flex items-center gap-3 border-t py-3 first:border-t-0" style={{ borderColor: 'var(--line)' }}>
              <div className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold" style={{ background: 'color-mix(in srgb, var(--orange-lite) 12%, transparent)', color: getPeakColor(ps.level), border: '1px solid var(--line)' }}>{ps.level > 0 ? `+${ps.level}` : ps.level}</div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium" style={{ color: getPeakColor(ps.level) }}>{ps.label.toLowerCase()}</div>
                <div className="truncate text-xs" style={{ color: 'var(--faint)' }}>{ps.timestamp}{ps.taps.length > 0 && ` · ${ps.taps.join(', ')}`}</div>
                {ps.notes && <div className="mt-1 text-xs italic" style={{ color: 'var(--muted)' }}>{ps.notes}</div>}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="neo-card rounded-2xl p-4 text-center">
      <div className="text-2xl font-semibold" style={{ color: 'var(--text)' }}>{value}</div>
      <div className="mt-1 text-xs" style={{ color: 'var(--faint)' }}>{label}</div>
    </div>
  );
}