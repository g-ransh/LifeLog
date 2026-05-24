import { useEffect, useRef, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useAppState } from './store';
import { TabId } from './types';
import BottomNav from './components/BottomNav';
import MainTab from './components/MainTab';
import HealthTab from './components/HealthTab';
import FinancesTab from './components/FinancesTab';
import BrandTab from './components/BrandTab';
import SearchTab from './components/SearchTab';
import AddTapModal from './components/AddTapModal';

export default function App() {
  const {
    state, logPeakState, tapItem, toggleTask, addTask, deleteTask,
    addDailyLog, deleteDailyLog, addTimeBlock, toggleTimeBlock, deleteTimeBlock,
    addTap
  } = useAppState();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showAddTap, setShowAddTap] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [scrollY, setScrollY] = useState(0);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
  });
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScroll = () => {
    setScrollY(scrollRef.current?.scrollTop ?? 0);
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'home':
        return (
          <MainTab
            tasks={state.tasks}
            dailyLogs={state.dailyLogs}
            timeBlocks={state.timeBlocks}
            dayStreak={state.dayStreak}
            onToggleTask={toggleTask}
            onAddTask={addTask}
            onDeleteTask={deleteTask}
            onAddDailyLog={addDailyLog}
            onDeleteDailyLog={deleteDailyLog}
            onAddTimeBlock={addTimeBlock}
            onToggleTimeBlock={toggleTimeBlock}
            onDeleteTimeBlock={deleteTimeBlock}
          />
        );
      case 'health':
        return (
          <>
            <HealthTab
              taps={state.taps}
              patterns={state.patterns}
              peakStates={state.peakStates}
              currentPeakLevel={state.currentPeakLevel}
              dayStreak={state.dayStreak}
              totalLogs={state.peakStates.length}
              sevenDayAvg={state.sevenDayAvg}
              peakWindow={state.peakWindow}
              onTap={tapItem}
              onLogPeak={logPeakState}
              onAddTap={() => setShowAddTap(true)}
            />
          </>
        );
      case 'finances':
        return <FinancesTab />;
      case 'brand':
        return <BrandTab />;
      case 'search':
        return <SearchTab onNavigate={(tab) => handleTabChange(tab as TabId)} />;
      default:
        return null;
    }
  };

  const now = new Date();
  const dayStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div
      className="app-shell"
      data-theme={theme}
      style={{
        minHeight: '100dvh',
        background: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        margin: '0 auto',
        position: 'relative',
      }}
    >
      <div className="parallax-orb h-72 w-72 bg-[#ffbd7a]" style={{ left: '-80px', top: 72, transform: `translate3d(0, ${scrollY * 0.08}px, 0)` }} />
      <div className="parallax-orb h-96 w-96 bg-[#8a5a33]" style={{ right: '-120px', top: 220, transform: `translate3d(0, ${scrollY * -0.05}px, 0)` }} />
      {/* Header Bar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 3840,
          zIndex: 50,
          background: 'rgba(24,16,10,0.62)',
          borderBottom: '1px solid rgba(255,201,137,0.12)',
          backdropFilter: 'blur(10px) saturate(125%)',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 10,
              background: 'linear-gradient(145deg, rgba(255,201,137,0.95), rgba(166,104,53,0.9))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.32), 0 10px 24px rgba(255,184,111,0.16)',
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 900, color: '#1a1008', lineHeight: 1 }}>g</span>
          </div>
          <span
            style={{
              fontSize: 15,
              fontWeight: 800,
              color: 'var(--text)',
              letterSpacing: '-0.02em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif',
            }}
          >
            gauransh
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              fontSize: 9,
              fontWeight: 600,
              color: 'var(--faint)',
              letterSpacing: '0.1em',
            }}
          >
            {dayStr}
          </span>
          <button
            onClick={() => setTheme(current => current === 'dark' ? 'light' : 'dark')}
            className="flex items-center justify-center rounded-lg transition-all"
            style={{ width: 32, height: 32, background: 'color-mix(in srgb, var(--surface-strong) 72%, transparent)', border: '1px solid var(--line)', color: 'var(--orange-lite)' }}
            aria-label="Toggle light and dark mode"
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="content-layer"
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingTop: 52,
          paddingBottom: 80,
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <main className="mx-auto w-full max-w-[2400px] px-0 md:px-6 lg:px-10 2xl:px-14">
          {renderTab()}
        </main>
      </div>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {showAddTap && (
        <AddTapModal
          onAdd={addTap}
          onClose={() => setShowAddTap(false)}
        />
      )}
    </div>
  );
}
