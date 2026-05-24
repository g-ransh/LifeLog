export type TabId = 'home' | 'finances' | 'brand' | 'search' | 'health';

export interface Tap {
  id: string;
  name: string;
  emoji: string;
  effect: string;
  effectValue: number;
  color: string;
  count: number;
  times: string[];
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  isPriority: boolean;
}

export interface DailyLogEntry {
  id: string;
  time: string;
  text: string;
  mood: 'peak' | 'steady' | 'foggy';
}

export interface TimeBlock {
  id: string;
  title: string;
  start: string;
  end: string;
  completed: boolean;
}

export interface EnergyLog {
  time: string;
  value: number;
  label: string;
  timestamp: number;
  taps: string[];
  notes: string;
}

export interface Pattern {
  id: string;
  description: string;
  effect: string;
  effectValue: number;
  days: number;
  confidence: 'high' | 'medium' | 'low';
  positive: boolean;
}

export interface PeakState {
  level: number; // -100 to 100, 0 = steady, 100 = peak, -100 = foggy
  label: string;
  timestamp: string;
  taps: string[];
  notes: string;
}

export interface DayData {
  date: string;
  peakScore: number;
  logs: EnergyLog[];
  tasks: Task[];
  taps: Tap[];
}
