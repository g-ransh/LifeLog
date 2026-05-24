import React from 'react';
import { Home, DollarSign, Layers, Search, HeartPulse } from 'lucide-react';
import { TabId } from '../types';

interface NavItem {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: <Home size={20} /> },
  { id: 'finances', label: 'Finances', icon: <DollarSign size={20} /> },
  { id: 'brand', label: 'Brand', icon: <Layers size={20} /> },
  { id: 'search', label: 'Search', icon: <Search size={20} /> },
  { id: 'health', label: 'Sports', icon: <HeartPulse size={20} /> },
];

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(24,16,10,0.72)',
        borderTop: '1px solid rgba(255,201,137,0.12)',
        backdropFilter: 'blur(28px) saturate(145%)',
      }}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-around px-2 pb-safe" style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="relative flex flex-col items-center gap-1 py-3 px-4 transition-all duration-200"
              style={{ minWidth: 52 }}
            >
              {isActive && (
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 rounded-b-full"
                  style={{ width: 28, height: 2, background: '#ffc989' }}
                />
              )}
              <span
                style={{
                  color: isActive ? '#ffc989' : '#8d6f54',
                  transition: 'color 0.2s',
                }}
              >
                {item.icon}
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#ffc989' : '#8d6f54',
                  letterSpacing: '0.04em',
                  transition: 'color 0.2s',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
