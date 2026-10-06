import React from 'react';
import { FrameworkType, FAPIVersion } from '../types/openBanking';
import { Shield, Server, Activity, Globe, Award, Sparkles, Code2, Database } from 'lucide-react';

interface HeaderProps {
  currentFramework: FrameworkType;
  onFrameworkChange: (framework: FrameworkType) => void;
  fapiVersion: FAPIVersion;
  onFapiVersionChange: (version: FAPIVersion) => void;
  developerXp: number;
  unlockedBadgesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentFramework,
  onFrameworkChange,
  fapiVersion,
  onFapiVersionChange,
  developerXp,
  unlockedBadgesCount,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-0.5 shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  OpenGateway
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold tracking-wider">
                  FAPI 1.0/2.0
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold tracking-wider">
                  Django 5.x
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Open Banking API Gateway & TPP Ecosystem for Zetheta
              </p>
            </div>
          </div>

          {/* Controls: Framework Selector & Protocol Switcher */}
          <div className="flex items-center gap-3">
            {/* Regulatory Framework Switcher */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg p-1">
              <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 hidden md:block" />
              <select
                value={currentFramework}
                onChange={(e) => onFrameworkChange(e.target.value as FrameworkType)}
                className="bg-transparent text-xs font-medium text-slate-200 focus:outline-none cursor-pointer pr-1"
                aria-label="Select Open Banking Framework"
              >
                <option value="UK_OBIE" className="bg-slate-900 text-slate-200">UK Open Banking (OBIE)</option>
                <option value="PSD2_EU" className="bg-slate-900 text-slate-200">PSD2 (European Union)</option>
                <option value="INDIA_AA" className="bg-slate-900 text-slate-200">India Account Aggregator (AA)</option>
                <option value="AU_CDR" className="bg-slate-900 text-slate-200">Australia CDR (Consumer Data Right)</option>
              </select>
            </div>

            {/* FAPI Version Selector */}
            <div className="hidden lg:flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
              <Server className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
              <button
                onClick={() => onFapiVersionChange('FAPI_1_ADVANCED')}
                className={`px-2 py-0.5 rounded font-mono text-[11px] transition-colors ${
                  fapiVersion === 'FAPI_1_ADVANCED'
                    ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                FAPI 1.0 Adv
              </button>
              <button
                onClick={() => onFapiVersionChange('FAPI_2_SECURITY_PROFILE')}
                className={`px-2 py-0.5 rounded font-mono text-[11px] transition-colors ${
                  fapiVersion === 'FAPI_2_SECURITY_PROFILE'
                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                FAPI 2.0
              </button>
            </div>

            {/* Live Gateway Status */}
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-400 font-mono text-[11px]">42ms SLA</span>
            </div>

            {/* Developer XP & Badges */}
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <div className="flex items-center gap-1 text-xs font-mono">
                <span className="font-semibold text-amber-300">{developerXp}</span>
                <span className="text-slate-400 text-[10px]">XP</span>
              </div>
              <div className="h-3 w-px bg-slate-800 mx-0.5" />
              <div className="flex items-center gap-1 text-xs font-mono">
                <Award className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-cyan-300 font-semibold">{unlockedBadgesCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
