import { useState, useEffect } from 'react';
import { DailyLogEntry, EnergyLog, Pattern, PeakState, Tap, Task, TimeBlock } from './types';

const DEFAULT_TAPS: Tap[] = [];
const DEFAULT_PATTERNS: Pattern[] = [];

function generateEnergyCurve(): EnergyLog[] {
  const now = new Date();
  const logs: EnergyLog[] = [];
  
  // Start with an empty baseline; real entries are created as you log states.
  const curve = [
    { hour: 0, val: 0 },
    { hour: 3, val: 0 },
    { hour: 6, val: 0 },
    { hour: 9, val: 0 },
    { hour: 12, val: 0 },
    { hour: 15, val: 0 },
    { hour: 18, val: 0 },
    { hour: 21, val: 0 },
    { hour: 23, val: 0 },
  ];

  curve.forEach((point) => {
    const h = Math.floor(point.hour);
    const m = Math.round((point.hour - h) * 60);
    const t = new Date(now);
    t.setHours(h, m, 0, 0);
    
    const label = h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`;
    logs.push({
      time: label,
      value: point.val,
      label,
      timestamp: t.getTime(),
      taps: [],
      notes: '',
    });
  });
  
  return logs;
}

const STORAGE_KEY = 'gauransh_dashboard_v2';

interface AppState {
  taps: Tap[];
  tasks: Task[];
  dailyLogs: DailyLogEntry[];
  timeBlocks: TimeBlock[];
  energyLogs: EnergyLog[];
  patterns: Pattern[];
  peakStates: PeakState[];
  currentPeakLevel: number;
  dayStreak: number;
  peakWindow: string;
  sevenDayAvg: number;
  activeTab: string;
}

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Always refresh energy curve
      parsed.energyLogs = generateEnergyCurve();
      return parsed;
    }
  } catch (_) {}
  
  return {
    taps: DEFAULT_TAPS,
    tasks: [],
    dailyLogs: [],
    timeBlocks: [],
    energyLogs: generateEnergyCurve(),
    patterns: DEFAULT_PATTERNS,
    peakStates: [],
    currentPeakLevel: 0,
    dayStreak: 0,
    peakWindow: 'Not learned yet',
    sevenDayAvg: 0,
    activeTab: 'home',
  };
}

export function useAppState() {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    const toSave = { ...state, energyLogs: [] }; // don't save generated curve
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  }, [state]);

  const update = (partial: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...partial }));
  };

  const logPeakState = (level: number, notes = '') => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    const newLog: PeakState = {
      level,
      label: level > 40 ? 'PEAK' : level < -40 ? 'FOGGY' : 'STEADY',
      timestamp: timeStr,
      taps: state.taps.filter(t => t.count > 0).map(t => t.name),
      notes,
    };
    const chartValue = Math.max(0, Math.min(100, Math.round(50 + level / 2)));
    const newEnergyLog: EnergyLog = {
      time: timeStr,
      value: chartValue,
      label: timeStr,
      timestamp: now.getTime(),
      taps: state.taps.filter(t => t.count > 0).map(t => t.name),
      notes,
    };
    
    const totalLogs = state.peakStates.length + 1;
    const newAvg = Math.round((state.peakStates.reduce((a, b) => a + b.level, 0) + level) / totalLogs);
    
    update({
      peakStates: [...state.peakStates, newLog],
      energyLogs: [...state.energyLogs, newEnergyLog].sort((a, b) => a.timestamp - b.timestamp),
      currentPeakLevel: level,
      sevenDayAvg: newAvg,
    });
  };

  const tapItem = (tapId: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    update({
      taps: state.taps.map(t =>
        t.id === tapId ? { ...t, count: t.count + 1, times: [...t.times, timeStr] } : t
      ),
    });
  };

  const toggleTask = (taskId: string) => {
    const updated = state.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
    const completedCount = updated.filter(t => t.completed).length;
    const newStreak = completedCount === updated.length && updated.length > 0 ? state.dayStreak + 1 : state.dayStreak;
    update({ tasks: updated, dayStreak: newStreak });
  };

  const addTask = (text: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      text,
      completed: false,
      isPriority: false,
    };
    update({ tasks: [...state.tasks, newTask] });
  };

  const addDailyLog = (text: string, mood: DailyLogEntry['mood'] = 'steady') => {
    const now = new Date();
    const newEntry: DailyLogEntry = {
      id: Date.now().toString(),
      time: now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      text,
      mood,
    };
    update({ dailyLogs: [newEntry, ...state.dailyLogs] });
  };

  const deleteDailyLog = (id: string) => {
    update({ dailyLogs: state.dailyLogs.filter(log => log.id !== id) });
  };

  const addTimeBlock = (title: string, start: string, end: string) => {
    const newBlock: TimeBlock = {
      id: Date.now().toString(),
      title,
      start,
      end,
      completed: false,
    };
    update({ timeBlocks: [...state.timeBlocks, newBlock] });
  };

  const toggleTimeBlock = (id: string) => {
    update({
      timeBlocks: state.timeBlocks.map(block =>
        block.id === id ? { ...block, completed: !block.completed } : block
      ),
    });
  };

  const deleteTimeBlock = (id: string) => {
    update({ timeBlocks: state.timeBlocks.filter(block => block.id !== id) });
  };

  const deleteTask = (taskId: string) => {
    update({ tasks: state.tasks.filter(t => t.id !== taskId) });
  };

  const addTap = (tap: import('./types').Tap) => {
    update({ taps: [...state.taps, tap] });
  };

  return {
    state,
    update,
    logPeakState,
    tapItem,
    toggleTask,
    addTask,
    deleteTask,
    addDailyLog,
    deleteDailyLog,
    addTimeBlock,
    toggleTimeBlock,
    deleteTimeBlock,
    addTap,
  };
}
