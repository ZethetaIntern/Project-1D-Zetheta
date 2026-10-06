import React, { useState, useEffect } from 'react';
import { MOCK_TPPS } from '../../data/mockBankingData';
import { TPPProfile, TPPType, FrameworkType } from '../../types/openBanking';
import {
  Users,
  Shield,
  Key,
  Gauge,
  Flame,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Plus,
  Copy,
  Check,
  Building2,
  FileBadge
} from 'lucide-react';

export const DeveloperPortalView: React.FC = () => {
  // Rate Limiter State
  const [selectedTier, setSelectedTier] = useState<'FREE' | 'STANDARD' | 'ENTERPRISE'>('STANDARD');
  const tierCapacity = { FREE: 60, STANDARD: 300, ENTERPRISE: 1500 };
  const [tokens, setTokens] = useState<number>(300);
  const [rateLimitLogs, setRateLimitLogs] = useState<string[]>([]);
  const [isDepleted, setIsDepleted] = useState<boolean>(false);

  // TPP Onboarding Modal / Wizard State
  const [tpps, setTpps] = useState<TPPProfile[]>(MOCK_TPPS);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [newTppName, setNewTppName] = useState('');
  const [newTppType, setNewTppType] = useState<TPPType>('AISP');
  const [newTppFramework, setNewTppFramework] = useState<FrameworkType>('UK_OBIE');
  const [newRedirectUri, setNewRedirectUri] = useState('https://fintech-sandbox.io/callback');

  // Token refill timer simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setTokens(prev => {
        const cap = tierCapacity[selectedTier];
        const refilled = Math.min(cap, prev + Math.max(1, Math.round(cap / 30)));
        if (refilled >= 1) setIsDepleted(false);
        return refilled;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedTier]);

  const handleFireSingleRequest = () => {
    if (tokens <= 0) {
      setIsDepleted(true);
      setRateLimitLogs(prev => [
        `[${new Date().toLocaleTimeString()}] ❌ HTTP 429 Too Many Requests | Retry-After: 4s | Bucket: 0/${tierCapacity[selectedTier]}`,
        ...prev.slice(0, 7)
      ]);
      return;
    }

    setTokens(prev => prev - 1);
    setRateLimitLogs(prev => [
      `[${new Date().toLocaleTimeString()}] ✓ HTTP 200 OK | Remaining: ${tokens - 1}/${tierCapacity[selectedTier]} | Consumed: 1 token`,
      ...prev.slice(0, 7)
    ]);
  };

  const handleBurstTraffic = () => {
    // Burst consume 40 tokens at once
    setTokens(prev => {
      const remaining = Math.max(0, prev - 45);
      if (remaining === 0) setIsDepleted(true);
      return remaining;
    });
    setRateLimitLogs(prev => [
      `[${new Date().toLocaleTimeString()}] ⚡ BURST TRAFFIC DETECTED: -45 tokens consumed in 100ms`,
      ...prev.slice(0, 7)
    ]);
  };

  const handleRegisterTPP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTppName.trim()) return;

    const newId = `tpp-${Date.now().toString().slice(-4)}`;
    const newProfile: TPPProfile = {
      id: newId,
      name: newTppName,
      orgId: `FCA-NCA-${Math.floor(10000 + Math.random() * 90000)}`,
      type: newTppType,
      framework: newTppFramework,
      clientId: `client_${newTppName.toLowerCase().replace(/\\s+/g, '_')}_${newId}`,
      clientSecretMasked: `sec_••••••••••••••••${Math.floor(1000 + Math.random() * 9000)}`,
      redirectUris: [newRedirectUri],
      certificate: {
        type: newTppFramework === 'PSD2_EU' ? 'eIDAS_QWAC' : 'OBIE_MTLS',
        serialNumber: `CA:88:${Math.floor(10 + Math.random() * 89)}:FE:${Math.floor(10 + Math.random() * 89)}`,
        issuer: 'Open Banking Directory CA (OBIE)',
        thumbprint: Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        validTo: '2028-12-31T23:59:59Z',
        status: 'VALID',
      },
      rateLimitTier: 'STANDARD',
      allowedScopes: newTppType === 'PISP' ? ['payments'] : ['accounts', 'balances', 'transactions'],
      status: 'ACTIVE',
    };

    setTpps([newProfile, ...tpps]);
    setIsRegistering(false);
    setNewTppName('');
  };

  const currentCap = tierCapacity[selectedTier];
  const fillPercentage = Math.round((tokens / currentCap) * 100);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950/40 border border-slate-800 p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-mono font-medium">
              <Users className="w-3.5 h-3.5" />
              Part 4 Deliverable: Rate Limiting & Developer Onboarding
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Developer Onboarding & Token Bucket Rate Limiting
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Self-service developer portal for Third Party Providers. Onboard TPPs with eIDAS / QWAC certificates,
              manage client credentials, and inspect live token-bucket rate limiting enforcement.
            </p>
          </div>

          <button
            onClick={() => setIsRegistering(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 transition"
          >
            <Plus className="w-4 h-4" />
            Onboard New TPP (Fintech)
          </button>
        </div>
      </div>

      {/* Interactive Token Bucket Rate Limiter */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Gauge className="w-4 h-4 text-emerald-400" />
              Token Bucket Rate Limiter Simulator
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Refills tokens continuously at the configured rate per second. Bursts consume tokens; depletion triggers HTTP 429 Too Many Requests.
            </p>
          </div>

          {/* Tier Selector */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
            {(['FREE', 'STANDARD', 'ENTERPRISE'] as const).map((tier) => (
              <button
                key={tier}
                onClick={() => {
                  setSelectedTier(tier);
                  setTokens(tierCapacity[tier]);
                }}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  selectedTier === tier
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tier} ({tierCapacity[tier]} req/m)
              </button>
            ))}
          </div>
        </div>

        {/* Visual Gauge & Rate Limit Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Visual Tank/Meter */}
          <div className="lg:col-span-5 bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">BUCKET CAPACITY</span>
              <span className={`font-bold ${isDepleted ? 'text-rose-400' : 'text-emerald-400'}`}>
                {tokens} / {currentCap} tokens
              </span>
            </div>

            {/* Visual Bar */}
            <div className="h-5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isDepleted
                    ? 'bg-rose-500'
                    : fillPercentage < 25
                    ? 'bg-amber-500'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                }`}
                style={{ width: `${fillPercentage}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>0 (Depleted 429)</span>
              <span>Refilling ~{Math.round(currentCap / 30)} tokens/sec</span>
              <span>{currentCap} (Full)</span>
            </div>

            {/* Test Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleFireSingleRequest}
                className="flex-1 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition"
              >
                Dispatch 1 Request
              </button>
              <button
                onClick={handleBurstTraffic}
                className="flex-1 py-2 px-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30 flex items-center justify-center gap-1.5 transition"
              >
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                Burst -45 Req
              </button>
            </div>
          </div>

          {/* Live RFC Rate Limit Headers & Log */}
          <div className="lg:col-span-7 bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider block">
              Gateway Ingress Headers (RFC 6585)
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">X-RateLimit-Limit</span>
                <span className="text-white font-bold">{currentCap}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">X-RateLimit-Remaining</span>
                <span className={`font-bold ${isDepleted ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {tokens}
                </span>
              </div>
              <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Retry-After (if 429)</span>
                <span className="text-amber-300 font-bold">{isDepleted ? '4s' : '0s'}</span>
              </div>
            </div>

            {/* Live Logs */}
            <div className="pt-2">
              <span className="text-[11px] font-mono text-slate-500 block mb-1">Live Ingress Traffic Log</span>
              <div className="bg-slate-900/80 rounded-lg p-2.5 font-mono text-[11px] text-slate-300 space-y-1 max-h-32 overflow-y-auto border border-slate-800">
                {rateLimitLogs.length === 0 ? (
                  <div className="text-slate-600">No requests dispatched yet. Click buttons on the left to fire traffic.</div>
                ) : (
                  rateLimitLogs.map((log, i) => <div key={i}>{log}</div>)
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Onboarded TPP Directory */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Building2 className="w-4 h-4 text-emerald-400" />
          Registered TPP Participants ({tpps.length})
        </h3>
        <p className="text-xs text-slate-400">
          All licensed participants verified against central regulatory registers (FCA / EBA / RBI / ACCC) with valid eIDAS certificates.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tpps.map((tpp) => (
            <div key={tpp.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white truncate">{tpp.name}</h4>
                  <span className="text-[10px] font-mono text-slate-400">{tpp.orgId}</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                  {tpp.type}
                </span>
              </div>

              <div className="text-xs text-slate-300 space-y-1 font-mono">
                <div>
                  <span className="text-slate-500">Framework: </span>
                  <span className="text-slate-200">{tpp.framework}</span>
                </div>
                <div>
                  <span className="text-slate-500">Client ID: </span>
                  <span className="text-indigo-400 truncate block">{tpp.clientId}</span>
                </div>
                <div>
                  <span className="text-slate-500">Cert Type: </span>
                  <span className="text-emerald-400">{tpp.certificate.type}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-500">Tier: {tpp.rateLimitTier}</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {tpp.certificate.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Onboarding Modal */}
      {isRegistering && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Onboard New Third-Party Provider</h3>
            <p className="text-xs text-slate-400">
              Provide your fintech organisation metadata to register a sandbox client credentials pair.
            </p>

            <form onSubmit={handleRegisterTPP} className="space-y-4">
              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">TPP Brand Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. WealthWave Analytics"
                  value={newTppName}
                  onChange={(e) => setNewTppName(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-slate-300 block mb-1">Service Role</label>
                  <select
                    value={newTppType}
                    onChange={(e) => setNewTppType(e.target.value as TPPType)}
                    className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="AISP">AISP (Account Info)</option>
                    <option value="PISP">PISP (Payment Initiation)</option>
                    <option value="CBPII">CBPII (Card Funds)</option>
                    <option value="AA_FIU">AA FIU (India)</option>
                    <option value="CDR_ADR">CDR ADR (Australia)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-300 block mb-1">Regulatory Standard</label>
                  <select
                    value={newTppFramework}
                    onChange={(e) => setNewTppFramework(e.target.value as FrameworkType)}
                    className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="UK_OBIE">UK Open Banking</option>
                    <option value="PSD2_EU">PSD2 (EU)</option>
                    <option value="INDIA_AA">India AA</option>
                    <option value="AU_CDR">Australia CDR</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">OAuth Redirect URI</label>
                <input
                  type="url"
                  required
                  value={newRedirectUri}
                  onChange={(e) => setNewRedirectUri(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRegistering(false)}
                  className="px-3.5 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-semibold shadow-md transition"
                >
                  Register TPP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
