import React, { useState } from 'react';
import { Header } from './components/Header';
import { Navigation, TabId } from './components/Navigation';
import { GatewayArchitectureView } from './components/views/GatewayArchitectureView';
import { DjangoBackendView } from './components/views/DjangoBackendView';
import { OAuthConsentView } from './components/views/OAuthConsentView';
import { ApiSpecsView } from './components/views/ApiSpecsView';
import { DeveloperPortalView } from './components/views/DeveloperPortalView';
import { ComplianceMatrixView } from './components/views/ComplianceMatrixView';
import { GovernanceSlaView } from './components/views/GovernanceSlaView';
import { GamifiedSimulatorView } from './components/views/GamifiedSimulatorView';
import { ZethetaSubmissionView } from './components/views/ZethetaSubmissionView';
import { GAME_ACHIEVEMENTS } from './data/mockBankingData';
import { FrameworkType, FAPIVersion, GameAchievement } from './types/openBanking';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('architecture');
  const [currentFramework, setCurrentFramework] = useState<FrameworkType>('UK_OBIE');
  const [fapiVersion, setFapiVersion] = useState<FAPIVersion>('FAPI_1_ADVANCED');
  const [developerXp, setDeveloperXp] = useState<number>(350);
  const [achievements, setAchievements] = useState<GameAchievement[]>(GAME_ACHIEVEMENTS);

  const unlockAchievement = (id: string, additionalXp: number = 100) => {
    setAchievements((prev) =>
      prev.map((ach) => (ach.id === id ? { ...ach, unlocked: true } : ach))
    );
    setDeveloperXp((prev) => prev + additionalXp);
  };

  const handleHandshakeCompleted = () => {
    unlockAchievement('fapi_handshake_master', 250);
  };

  const handleTrapNeutralized = () => {
    unlockAchievement('security_trap_hunter', 200);
  };

  const handleAuditCompleted = () => {
    unlockAchievement('multi_framework_polyglot', 200);
  };

  const handleExecuteService = (serviceId: string) => {
    setDeveloperXp((prev) => prev + 50);
  };

  const handleRunChallenge = (challengeId: string) => {
    unlockAchievement(challengeId, 150);
  };

  const handleFinalSubmission = () => {
    unlockAchievement('zetheta_submitted', 500);
  };

  const unlockedBadgesCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Bar Header */}
      <Header
        currentFramework={currentFramework}
        onFrameworkChange={setCurrentFramework}
        fapiVersion={fapiVersion}
        onFapiVersionChange={setFapiVersion}
        developerXp={developerXp}
        unlockedBadgesCount={unlockedBadgesCount}
      />

      {/* Primary Navigation Tabs */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'architecture' && <GatewayArchitectureView />}
        {activeTab === 'django' && <DjangoBackendView />}
        {activeTab === 'handshake' && (
          <OAuthConsentView
            onHandshakeCompleted={handleHandshakeCompleted}
            onTrapNeutralized={handleTrapNeutralized}
          />
        )}
        {activeTab === 'apis' && <ApiSpecsView />}
        {activeTab === 'portal' && <DeveloperPortalView />}
        {activeTab === 'compliance' && (
          <ComplianceMatrixView onAuditCompleted={handleAuditCompleted} />
        )}
        {activeTab === 'governance' && <GovernanceSlaView />}
        {activeTab === 'simulator' && (
          <GamifiedSimulatorView
            achievements={achievements}
            developerXp={developerXp}
            onExecuteService={handleExecuteService}
            onRunChallenge={handleRunChallenge}
          />
        )}
        {activeTab === 'zetheta' && (
          <ZethetaSubmissionView onFinalSubmissionSuccess={handleFinalSubmission} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="font-semibold text-slate-400">OpenGateway</span> — Enterprise Open Banking API Gateway with Django Backend & FAPI 1.0/2.0
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
            <span>PSD2 (EU)</span>
            <span>•</span>
            <span>UK OBIE</span>
            <span>•</span>
            <span>India AA</span>
            <span>•</span>
            <span>Australia CDR</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">Zetheta Submission Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
