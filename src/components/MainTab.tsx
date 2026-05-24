import { ReactNode, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarClock, Check, Clock, LayoutDashboard, NotebookPen, Plus, Trash2, X, Zap } from 'lucide-react';
import { DailyLogEntry, Task, TimeBlock } from '../types';

type HomeCard = 'home' | 'time' | 'daily' | 'goals';

interface MainTabProps {
  tasks: Task[];
  dailyLogs: DailyLogEntry[];
  timeBlocks: TimeBlock[];
  dayStreak: number;
  onToggleTask: (id: string) => void;
  onAddTask: (text: string) => void;
  onDeleteTask: (id: string) => void;
  onAddDailyLog: (text: string, mood: DailyLogEntry['mood']) => void;
  onDeleteDailyLog: (id: string) => void;
  onAddTimeBlock: (title: string, start: string, end: string) => void;
  onToggleTimeBlock: (id: string) => void;
  onDeleteTimeBlock: (id: string) => void;
}

const cardTabs: { id: HomeCard; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'time', label: 'Time log' },
  { id: 'daily', label: 'Daily log' },
  { id: 'goals', label: 'Goals' },
];

function getCurrentDayPhase() {
  const h = new Date().getHours();
  if (h < 12) return { label: 'Morning', caption: 'Set the tone' };
  if (h < 17) return { label: 'Afternoon', caption: 'Protect the next block' };
  if (h < 21) return { label: 'Evening', caption: 'Close loops' };
  return { label: 'Night', caption: 'Recover on purpose' };
}

function getDayProgress() {
  const now = new Date();
  const start = new Date();
  start.setHours(6, 0, 0, 0);
  const end = new Date();
  end.setHours(24, 0, 0, 0);
  const progress = ((now.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100;
  return Math.min(100, Math.max(0, Math.round(progress)));
}

function moodColor(mood: DailyLogEntry['mood']) {
  if (mood === 'peak') return 'var(--orange-lite)';
  if (mood === 'foggy') return 'var(--faint)';
  return 'var(--muted)';
}

export default function MainTab({
  tasks,
  dailyLogs,
  timeBlocks,
  dayStreak,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  onAddDailyLog,
  onDeleteDailyLog,
  onAddTimeBlock,
  onToggleTimeBlock,
  onDeleteTimeBlock,
}: MainTabProps) {
  const [activeCard, setActiveCard] = useState<HomeCard>('home');
  const [taskText, setTaskText] = useState('');
  const [logText, setLogText] = useState('');
  const [logMood, setLogMood] = useState<DailyLogEntry['mood']>('steady');
  const [blockTitle, setBlockTitle] = useState('');
  const [blockStart, setBlockStart] = useState('09:00');
  const [blockEnd, setBlockEnd] = useState('10:00');
  const [_tick, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const phase = getCurrentDayPhase();
  const progress = getDayProgress();
  const completedTasks = tasks.filter(task => task.completed).length;
  const completedBlocks = timeBlocks.filter(block => block.completed).length;

  const sortedBlocks = useMemo(() => [...timeBlocks].sort((a, b) => a.start.localeCompare(b.start)), [timeBlocks]);

  const addTask = () => {
    if (!taskText.trim()) return;
    onAddTask(taskText.trim());
    setTaskText('');
  };

  const addLog = () => {
    if (!logText.trim()) return;
    onAddDailyLog(logText.trim(), logMood);
    setLogText('');
  };

  const addBlock = () => {
    if (!blockTitle.trim()) return;
    onAddTimeBlock(blockTitle.trim(), blockStart, blockEnd);
    setBlockTitle('');
  };

  const renderCard = () => {
    switch (activeCard) {
      case 'time':
        return (
          <CardFrame title="Time log" subtitle="Build your day in protected blocks." icon={<CalendarClock size={18} />}>
            <div className="grid grid-cols-2 gap-2">
              <input value={blockTitle} onChange={e => setBlockTitle(e.target.value)} placeholder="Block name..." className="brown-input col-span-2 rounded-2xl px-4 py-3 outline-none" />
              <input type="time" value={blockStart} onChange={e => setBlockStart(e.target.value)} className="brown-input rounded-2xl px-4 py-3 outline-none" />
              <input type="time" value={blockEnd} onChange={e => setBlockEnd(e.target.value)} className="brown-input rounded-2xl px-4 py-3 outline-none" />
              <button onClick={addBlock} className="soft-orange-bg col-span-2 rounded-2xl py-3 text-sm font-semibold text-[#22150c]">Add time block</button>
            </div>
            <ListArea>
              {sortedBlocks.length === 0 ? <EmptyState text="No time blocks yet. Add your next protected focus block." /> : sortedBlocks.map(block => (
                <div key={block.id} className="neo-card flex items-center gap-3 rounded-2xl p-3">
                  <button onClick={() => onToggleTimeBlock(block.id)} className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full" style={{ border: `1px solid ${block.completed ? 'var(--orange-lite)' : 'var(--line)'}`, background: block.completed ? 'var(--orange-lite)' : 'transparent' }}>
                    {block.completed && <Check size={12} color="#24150b" />}
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium" style={{ color: 'var(--text)' }}>{block.title}</div>
                    <div className="text-xs" style={{ color: 'var(--faint)' }}>{block.start} - {block.end}</div>
                  </div>
                  <button onClick={() => onDeleteTimeBlock(block.id)}><X size={14} color="var(--faint)" /></button>
                </div>
              ))}
            </ListArea>
          </CardFrame>
        );
      case 'daily':
        return (
          <CardFrame title="Daily log" subtitle="Record the whole day, not just the highlight reel." icon={<NotebookPen size={18} />}>
            <textarea value={logText} onChange={e => setLogText(e.target.value)} placeholder="What happened? What did you feel? What created energy, resistance, clarity, or fog?" className="brown-input min-h-36 w-full resize-none rounded-2xl px-4 py-3 outline-none" />
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="flex gap-2">
                {(['peak', 'steady', 'foggy'] as const).map(mood => (
                  <button key={mood} onClick={() => setLogMood(mood)} className={`rounded-xl px-3 py-2 text-xs font-semibold tracking-wide ${logMood === mood ? 'card-swap-button-active' : 'card-swap-button'}`} style={logMood === mood ? { color: moodColor(mood), borderColor: moodColor(mood) } : undefined}>{mood}</button>
                ))}
              </div>
              <button onClick={addLog} className="soft-orange-bg rounded-2xl px-5 py-2.5 text-sm font-semibold text-[#22150c] sm:ml-auto">Save log</button>
            </div>
            <ListArea>
              {dailyLogs.length === 0 ? <EmptyState text="No daily logs yet. Start with one honest sentence." /> : dailyLogs.map(log => (
                <div key={log.id} className="neo-card rounded-2xl p-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ background: moodColor(log.mood) }} />
                      <span className="text-xs font-medium" style={{ color: moodColor(log.mood) }}>{log.mood}</span>
                      <span className="text-xs" style={{ color: 'var(--faint)' }}>{log.time}</span>
                    </div>
                    <button onClick={() => onDeleteDailyLog(log.id)}><Trash2 size={14} color="var(--faint)" /></button>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-6" style={{ color: 'var(--text)' }}>{log.text}</p>
                </div>
              ))}
            </ListArea>
          </CardFrame>
        );
      case 'goals':
        return (
          <CardFrame title="Goals" subtitle="Keep the day measurable and low-noise." icon={<Zap size={18} />}>
            <div className="flex gap-2">
              <input value={taskText} onChange={e => setTaskText(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTask()} placeholder="Add a goal for today..." className="brown-input min-w-0 flex-1 rounded-2xl px-4 py-3 outline-none" />
              <button onClick={addTask} className="soft-orange-bg rounded-2xl px-4 text-[#22150c]"><Plus size={17} /></button>
            </div>
            <ListArea>
              {tasks.length === 0 ? <EmptyState text="No goals yet. Add one goal that would make today count." /> : tasks.map(task => (
                <div key={task.id} className="neo-card flex items-center gap-3 rounded-2xl p-3">
                  <button onClick={() => onToggleTask(task.id)} className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full" style={{ border: `1px solid ${task.completed ? 'var(--orange-lite)' : 'var(--line)'}`, background: task.completed ? 'var(--orange-lite)' : 'transparent' }}>
                    {task.completed && <Check size={12} color="#24150b" />}
                  </button>
                  <span className="min-w-0 flex-1 truncate text-sm" style={{ textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? 'var(--faint)' : 'var(--text)' }}>{task.text}</span>
                  <button onClick={() => onDeleteTask(task.id)}><Trash2 size={14} color="var(--faint)" /></button>
                </div>
              ))}
            </ListArea>
          </CardFrame>
        );
      default:
        return (
          <CardFrame title="Home" subtitle="Your day as a controlled dashboard." icon={<LayoutDashboard size={18} />}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-medium tracking-wide" style={{ color: 'var(--faint)' }}>{dateStr}</div>
                <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-6xl" style={{ color: 'var(--text)' }}>{phase.label}</h1>
                <p className="mt-3 max-w-xl text-sm leading-6" style={{ color: 'var(--muted)' }}>{phase.caption}. Swap into any card below to log the day, block your time, or capture goals.</p>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end gap-2" style={{ color: 'var(--faint)' }}><Clock size={14} /><span className="text-sm tabular-nums">{timeStr}</span></div>
                <div className="mt-3 text-xs font-medium tracking-wide soft-orange">Streak {dayStreak}</div>
              </div>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-4">
              <Stat label="Day" value={`${progress}%`} caption="complete" />
              <Stat label="Time log" value={`${completedBlocks}/${timeBlocks.length}`} caption="blocks" />
              <Stat label="Daily log" value={String(dailyLogs.length)} caption="entries" />
              <Stat label="Goals" value={`${completedTasks}/${tasks.length}`} caption="done" />
            </div>
          </CardFrame>
        );
    }
  };

  return (
    <div className="deck-perspective px-4 pb-8 pt-4">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="glass-card relative mx-auto max-w-[2200px] overflow-hidden rounded-[2rem] p-3 md:p-5">
        <div className="relative z-10 mb-3 flex flex-wrap gap-2">
          {cardTabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveCard(tab.id)} className={`rounded-2xl px-3 py-2 text-xs font-semibold tracking-wide transition-all ${activeCard === tab.id ? 'card-swap-button-active' : 'card-swap-button'}`}>{tab.label}</button>
          ))}
        </div>
        <div className="relative z-10 min-h-[660px] overflow-hidden rounded-[1.6rem] md:min-h-[820px] xl:min-h-[900px]">
          <AnimatePresence mode="wait">
            <motion.div key={activeCard} initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -28 }} transition={{ duration: 0.24 }} className="h-full">
              {renderCard()}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

function CardFrame({ title, subtitle, icon, children }: { title: string; subtitle: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div className="neo-card flex h-full flex-col overflow-hidden rounded-[1.6rem] p-5 md:p-8">
      <div className="mb-5">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border px-3 py-1" style={{ borderColor: 'var(--line)', background: 'color-mix(in srgb, var(--orange-lite) 10%, transparent)', color: 'var(--orange-lite)' }}>
          {icon}
          <span className="text-[11px] font-semibold tracking-wide">{title}</span>
        </div>
        <p className="text-sm leading-6" style={{ color: 'var(--muted)' }}>{subtitle}</p>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto pr-1">{children}</div>
    </div>
  );
}

function ListArea({ children }: { children: ReactNode }) {
  return <div className="mt-5 flex flex-col gap-2 overflow-y-auto pr-1">{children}</div>;
}

function Stat({ label, value, caption }: { label: string; value: string; caption: string }) {
  return (
    <div className="neo-card rounded-3xl p-4">
      <div className="text-[11px] font-medium tracking-wide" style={{ color: 'var(--faint)' }}>{label}</div>
      <div className="mt-2 text-3xl font-semibold" style={{ color: 'var(--text)' }}>{value}</div>
      <div className="mt-1 text-xs" style={{ color: 'var(--faint)' }}>{caption}</div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <p className="rounded-2xl px-4 py-7 text-center text-sm" style={{ background: 'color-mix(in srgb, var(--surface-strong) 58%, transparent)', border: '1px dashed var(--line)', color: 'var(--faint)' }}>{text}</p>;
}