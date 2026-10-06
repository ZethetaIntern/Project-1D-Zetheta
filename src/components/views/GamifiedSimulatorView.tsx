import React, { useState } from 'react';
import { TPP_SERVICE_DEFINITIONS, runTPPServicesAnalysis } from '../../services/tppServicesEngine';
import { MOCK_ACCOUNTS, MOCK_TRANSACTIONS, GAME_ACHIEVEMENTS } from '../../data/mockBankingData';
import { TPPServiceDefinition, GameAchievement } from '../../types/openBanking';
import {
  Gamepad2,
  Play,
  RotateCcw,
  Sparkles,
  Award,
  CheckCircle2,
  AlertTriangle,
  Layers,
  PieChart,
  TrendingUp,
  CheckSquare,
  PiggyBank,
  Calculator,
  Coins,
  Shield,
  ArrowRight
} from 'lucide-react';

interface GamifiedSimulatorViewProps {
  achievements: GameAchievement[];
  developerXp: number;
  onExecuteService: (serviceId: string) => void;
  onRunChallenge: (challengeId: string) => void;
}

export const GamifiedSimulatorView: React.FC<GamifiedSimulatorViewProps> = ({
  achievements,
  developerXp,
  onExecuteService,
  onRunChallenge,
}) => {
  const [selectedService, setSelectedService] = useState<TPPServiceDefinition>(TPP_SERVICE_DEFINITIONS[0]);
  const [activeAnalysis, setActiveAnalysis] = useState<any>(
    runTPPServicesAnalysis(MOCK_ACCOUNTS, MOCK_TRANSACTIONS)
  );
  const [serviceExecutionLogs, setServiceExecutionLogs] = useState<string[]>([]);
  const [challengeResult, setChallengeResult] = useState<{
    id: string;
    passed: boolean;
    title: string;
    message: string;
  } | null>(null);

  const iconMap: Record<string, React.ElementType> = {
    LayoutDashboard: Layers,
    PieChart: PieChart,
    TrendingUp: TrendingUp,
    CheckSquare: CheckSquare,
    PiggyBank: PiggyBank,
    Calculator: Calculator,
    Coins: Coins,
  };

  const handleRunService = (service: TPPServiceDefinition) => {
    setSelectedService(service);
    const updated = runTPPServicesAnalysis(MOCK_ACCOUNTS, MOCK_TRANSACTIONS);
    setActiveAnalysis(updated);
    setServiceExecutionLogs(prev => [
      `[${new Date().toLocaleTimeString()}] ✓ Service #${service.number} "${service.name}" executed successfully against consented banking data. Scopes verified: [${service.requiredScopes.join(', ')}]`,
      ...prev.slice(0, 5)
    ]);
    onExecuteService(service.id);
  };

  const handleChallenge = (type: 'PERFECT_HANDSHAKE' | 'ROGUE_TOKEN' | 'SCOPE_ESCALATION') => {
    if (type === 'PERFECT_HANDSHAKE') {
      setChallengeResult({
        id: 'chal-1',
        passed: true,
        title: 'Challenge Completed: Perfect FAPI Handshake',
        message: 'Successfully executed all 6 steps: SCA -> PAR -> JARM Authorization Code -> mTLS Certificate Token Binding -> DPoP Proof -> Protected Data Delivery! (+150 XP)'
      });
      onRunChallenge('fapi_handshake_master');
    } else if (type === 'ROGUE_TOKEN') {
      setChallengeResult({
        id: 'chal-2',
        passed: true,
        title: 'Attack Blocked: Rogue Token Hijacking Replay',
        message: 'An attacker extracted an access token, but presented an untrusted TLS client certificate. Gateway detected mismatch with cnf.x5t#S256 and blocked request with HTTP 401 Unauthorized! (+200 XP)'
      });
      onRunChallenge('security_trap_hunter');
    } else {
      setChallengeResult({
        id: 'chal-3',
        passed: true,
        title: 'RBAC Enforcement: Scope Escalation Blocked',
        message: 'An AISP (Account Information) client attempted to invoke /open-banking/v3.1/pisp/domestic-payments. Gateway RBAC intercepted and blocked with HTTP 403 Forbidden! (+100 XP)'
      });
      onRunChallenge('governance_master');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-medium">
              <Gamepad2 className="w-3.5 h-3.5" />
              Part 7 Deliverable: Gamified TPP Simulation Platform
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Gamified Open Gateway Simulation Platform
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Experience the 7 distinct third-party open banking applications powered by consented financial data.
              Test real customer insights (aggregation, budgeting alerts, alternative gig credit scoring, mortgage stress tests)
              and complete security challenges to earn fintech developer badges.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <Sparkles className="w-6 h-6 text-amber-400" />
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-400 block">DEVELOPER EXPERIENCE</span>
              <span className="text-xl font-bold font-mono text-amber-300">{developerXp} XP</span>
            </div>
          </div>
        </div>

        {/* Challenge Quick Triggers */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t border-slate-800/80">
          <span className="text-xs font-mono font-semibold text-slate-400 mr-2">Security Missions:</span>
          <button
            onClick={() => handleChallenge('PERFECT_HANDSHAKE')}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition"
          >
            ⚡ Test Perfect FAPI Flow
          </button>
          <button
            onClick={() => handleChallenge('ROGUE_TOKEN')}
            className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition"
          >
            🛡️ Repel Rogue Token Replay
          </button>
          <button
            onClick={() => handleChallenge('SCOPE_ESCALATION')}
            className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition"
          >
            🔒 Block AISP-to-PISP Scope Escalation
          </button>
        </div>
      </div>

      {/* Challenge Feedback Toast if present */}
      {challengeResult && (
        <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/40 text-xs text-slate-200 flex items-start gap-3 shadow-lg">
          <Award className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-white text-sm block">{challengeResult.title}</span>
            <p className="text-slate-300">{challengeResult.message}</p>
          </div>
        </div>
      )}

      {/* The 7 TPP Services Interactive Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Services Navigation Sidebar */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2">
          <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider font-mono block px-2 py-1">
            The 7 Third-Party Services
          </span>

          <div className="space-y-1.5">
            {TPP_SERVICE_DEFINITIONS.map((srv) => {
              const Icon = iconMap[srv.iconName] || Layers;
              const isSelected = selectedService.id === srv.id;
              return (
                <button
                  key={srv.id}
                  onClick={() => handleRunService(srv)}
                  className={`w-full text-left p-3 rounded-xl text-xs transition flex items-start gap-3 ${
                    isSelected
                      ? 'bg-slate-800 text-white border border-emerald-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                  }`}
                >
                  <div className={`p-2 rounded-lg mt-0.5 shrink-0 ${isSelected ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-950 text-slate-400'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-200 truncate">
                      <span>#{srv.number}</span>
                      <span>{srv.name}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5">{srv.tagline}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Service Live Analytics Simulation Output */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                Service #{selectedService.number}: {selectedService.category}
              </span>
              <h3 className="text-lg font-bold text-white mt-1">{selectedService.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{selectedService.description}</p>
            </div>

            <button
              onClick={() => handleRunService(selectedService)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition shrink-0"
            >
              <Play className="w-3.5 h-3.5" />
              Re-Calculate
            </button>
          </div>

          {/* Real-World Industry Examples & Required Scopes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Real-World Examples</span>
              <span className="text-slate-200 font-medium">{selectedService.realWorldExamples.join(', ')}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono">
              <span className="text-[10px] text-slate-500 uppercase block">Required FAPI Scopes</span>
              <span className="text-emerald-400 font-bold">{selectedService.requiredScopes.join(' • ')}</span>
            </div>
          </div>

          {/* Service Dynamic Analytic Engine Output */}
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
              Simulated Financial Insights Output
            </span>

            {/* Service 1: Aggregation */}
            {selectedService.number === 1 && (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                  <div className="p-3 rounded bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">TOTAL ASSETS</span>
                    <span className="text-emerald-400 font-bold text-sm">£{activeAnalysis.aggregation.totalAssets.toLocaleString()}</span>
                  </div>
                  <div className="p-3 rounded bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">TOTAL DEBT</span>
                    <span className="text-rose-400 font-bold text-sm">£{activeAnalysis.aggregation.totalLiabilities.toLocaleString()}</span>
                  </div>
                  <div className="p-3 rounded bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">NET WORTH</span>
                    <span className="text-cyan-400 font-bold text-sm">£{activeAnalysis.aggregation.netWorth.toLocaleString()}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300">
                  Consolidated multi-bank telemetry across 4 accounts (Personal Current, Rainy Day Vault, Platinum Visa, and Vance Digital Business).
                </p>
              </div>
            )}

            {/* Service 2: Budgeting */}
            {selectedService.number === 2 && (
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-800/60 text-xs text-amber-200">
                  ⚠️ <span className="font-bold">Dining Budget Alert: </span>
                  You have spent £{activeAnalysis.budgeting.diningSpend.toFixed(2)} ({activeAnalysis.budgeting.diningPct}%) of your £{activeAnalysis.budgeting.diningBudget} monthly dining budget!
                </div>
                {activeAnalysis.budgeting.forgottenSubscription && (
                  <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-xs text-rose-200">
                    🔔 <span className="font-bold">Unused Subscription Detected: </span>
                    {activeAnalysis.budgeting.forgottenSubscription.merchantName} (£{activeAnalysis.budgeting.forgottenSubscription.amount}/mo). No workout activity recorded in 60 days.
                  </div>
                )}
              </div>
            )}

            {/* Service 3: Alternative Credit Scoring */}
            {selectedService.number === 3 && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">TRADITIONAL BUREAU SCORE</span>
                    <span className="text-slate-400 font-bold text-base">{activeAnalysis.alternativeCredit.traditionalBureauScore} (Thin File)</span>
                  </div>
                  <div className="p-3 rounded bg-slate-900 border border-emerald-500/40">
                    <span className="text-[10px] text-emerald-400 block font-bold">CASH-FLOW BANKING SCORE</span>
                    <span className="text-emerald-300 font-bold text-base">
                      {activeAnalysis.alternativeCredit.alternativeCashFlowScore} (+{activeAnalysis.alternativeCredit.scoreLift} pts)
                    </span>
                  </div>
                </div>
                <div className="text-xs text-slate-300 space-y-1">
                  <div className="font-semibold text-emerald-400">Decision: INSTANT LOAN APPROVAL</div>
                  <p className="text-slate-400">
                    Cash-flow algorithm verified regular payroll (£3,200) + freelance gig inflow (£750), proving a {activeAnalysis.alternativeCredit.savingsBufferPercent}% savings cushion.
                  </p>
                </div>
              </div>
            )}

            {/* Service 4: Affordability & Risk */}
            {selectedService.number === 4 && (
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-200">
                  ✓ <span className="font-bold">Mortgage Stress Test (£950/mo): PASSED</span>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Debt-to-Income: {activeAnalysis.affordability.debtToIncome}% | Verified surplus buffer: £{activeAnalysis.affordability.discretionarySurplus.toFixed(2)}/mo
                  </div>
                </div>
                <p className="text-xs text-slate-300">
                  Rental application verified instantly via Open Banking API without manual PDF bank statement review.
                </p>
              </div>
            )}

            {/* Service 5: Savings & Wellness */}
            {selectedService.number === 5 && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">ROUND-UP SAVINGS ACCUMULATED</span>
                    <span className="text-emerald-400 font-bold text-base">£{activeAnalysis.savingsWellness.totalRoundUpSaved}</span>
                  </div>
                  <div className="p-3 rounded bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">BILL NEGOTIATION BENEFIT</span>
                    <span className="text-cyan-400 font-bold text-base">£120 / year</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300">{activeAnalysis.savingsWellness.cashFlowForecast}</p>
              </div>
            )}

            {/* Service 6: SME Accounting */}
            {selectedService.number === 6 && (
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-800/60 text-xs text-indigo-200">
                  ✓ <span className="font-bold">Xero / QuickBooks Auto-Reconciliation: 100% Match</span>
                  <div className="text-[11px] text-slate-400 mt-1">
                    4 business transactions matched to invoices. Estimated 2.5 hours of bookkeeping saved this week.
                  </div>
                </div>
                <div className="text-xs font-mono text-slate-300">
                  Real-time SME Cash Runway: <span className="text-emerald-400 font-bold">8.5 Months</span>
                </div>
              </div>
            )}

            {/* Service 7: Robo-Advisor */}
            {selectedService.number === 7 && (
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-2">
                  <span className="font-bold text-slate-200 block">Tailored Discretionary Allocation (£{activeAnalysis.roboAdvisor.recommendedMonthlyInvest}/mo)</span>
                  <div className="space-y-1 text-slate-300">
                    {activeAnalysis.roboAdvisor.assetAllocation.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between text-[11px]">
                        <span>• {item.asset}</span>
                        <span className="font-bold font-mono">{item.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-400">{activeAnalysis.roboAdvisor.insuranceCheck}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gamified Achievements Showcase */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          Fintech Protocol Badges & Achievements
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-xl border transition ${
                ach.unlocked
                  ? 'bg-slate-950 border-amber-500/40 shadow-sm shadow-amber-500/5'
                  : 'bg-slate-950/40 border-slate-800/80 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Award className={`w-4 h-4 ${ach.unlocked ? 'text-amber-400' : 'text-slate-600'}`} />
                  <h4 className="text-sm font-bold text-white">{ach.title}</h4>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-amber-300 font-semibold">
                  +{ach.xp} XP
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2">{ach.description}</p>
              <div className="mt-3 pt-2 border-t border-slate-800/60 text-[10px] font-mono text-slate-500 flex items-center justify-between">
                <span>Criteria: {ach.criteria.slice(0, 35)}...</span>
                <span className={ach.unlocked ? 'text-emerald-400 font-bold' : 'text-slate-600'}>
                  {ach.unlocked ? 'UNLOCKED' : 'LOCKED'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
