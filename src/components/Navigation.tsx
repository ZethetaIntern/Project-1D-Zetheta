import React from 'react';
import {
  Layers,
  Code2,
  Lock,
  FileCode,
  Users,
  Globe,
  FileCheck,
  Gamepad2,
  SendHorizontal
} from 'lucide-react';

export type TabId =
  | 'architecture'
  | 'django'
  | 'handshake'
  | 'apis'
  | 'portal'
  | 'compliance'
  | 'governance'
  | 'simulator'
  | 'zetheta';

interface NavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs: { id: TabId; label: string; part: string; icon: React.ElementType }[] = [
    { id: 'architecture', label: 'Gateway Architecture', part: 'Part 1', icon: Layers },
    { id: 'django', label: 'Django Backend Code', part: 'Core', icon: Code2 },
    { id: 'handshake', label: 'OAuth 2.0 & FAPI', part: 'Part 2', icon: Lock },
    { id: 'apis', label: 'Account & Payment APIs', part: 'Part 3', icon: FileCode },
    { id: 'portal', label: 'Developer & Rate Limits', part: 'Part 4', icon: Users },
    { id: 'compliance', label: 'Multi-Framework Compliance', part: 'Part 5', icon: Globe },
    { id: 'governance', label: 'Governance & SLAs', part: 'Part 6', icon: FileCheck },
    { id: 'simulator', label: 'Gamified TPP Sandbox', part: 'Part 7', icon: Gamepad2 },
    { id: 'zetheta', label: 'Submit to Zetheta', part: 'Final', icon: SendHorizontal },
  ];

  return (
    <nav className="bg-slate-900/60 border-b border-slate-800/80 sticky top-16 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-1 overflow-x-auto py-2 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-300 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-semibold uppercase ${
                    isActive
                      ? 'bg-emerald-500/30 text-emerald-200'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {tab.part}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
