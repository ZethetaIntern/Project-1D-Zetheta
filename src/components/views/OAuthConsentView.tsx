import React, { useState } from 'react';
import { getInitialHandshakeSteps } from '../../services/fapiEngine';
import { MOCK_TPPS, INITIAL_CONSENTS, MOCK_PSU } from '../../data/mockBankingData';
import { FAPIHandshakeStep, ConsentRecord, TPPProfile } from '../../types/openBanking';
import {
  Lock,
  Shield,
  Key,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  UserCheck,
  ChevronRight,
  FileSignature,
  Fingerprint,
  Zap,
  Trash2,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface OAuthConsentViewProps {
  onHandshakeCompleted?: () => void;
  onTrapNeutralized?: () => void;
}

export const OAuthConsentView: React.FC<OAuthConsentViewProps> = ({
  onHandshakeCompleted,
  onTrapNeutralized,
}) => {
  const [selectedTpp, setSelectedTpp] = useState<TPPProfile>(MOCK_TPPS[0]);
  const [steps, setSteps] = useState<FAPIHandshakeStep[]>(getInitialHandshakeSteps(MOCK_TPPS[0]));
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isRunningAll, setIsRunningAll] = useState<boolean>(false);
  const [securityTrapActive, setSecurityTrapActive] = useState<boolean>(false);
  const [trapTriggeredMessage, setTrapTriggeredMessage] = useState<string | null>(null);

  // Consent Management State
  const [consents, setConsents] = useState<ConsentRecord[]>(INITIAL_CONSENTS);
  const [revocationToast, setRevocationToast] = useState<string | null>(null);

  const activeStep = steps[currentStepIndex];

  const handleSelectTpp = (tpp: TPPProfile) => {
    setSelectedTpp(tpp);
    setSteps(getInitialHandshakeSteps(tpp));
    setCurrentStepIndex(0);
    setSecurityTrapActive(false);
    setTrapTriggeredMessage(null);
  };

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      if (onHandshakeCompleted) onHandshakeCompleted();
    }
  };

  const handleResetHandshake = () => {
    setSteps(getInitialHandshakeSteps(selectedTpp));
    setCurrentStepIndex(0);
    setSecurityTrapActive(false);
    setTrapTriggeredMessage(null);
  };

  const handleTriggerSecurityTrap = () => {
    setSecurityTrapActive(true);
    setTrapTriggeredMessage(
      "SECURITY TRAP ACTIVATED: Simulating Stolen Access Token replay from an attacker IP without TPP mTLS certificate private key. At Step 5, the FAPI Gateway will detect the mTLS thumbprint mismatch and immediately REJECT with HTTP 401 Unauthorized!"
    );
    if (onTrapNeutralized) onTrapNeutralized();
  };

  const handleRevokeConsent = (consentId: string) => {
    setConsents(prev =>
      prev.map(c =>
        c.consentId === consentId
          ? { ...c, status: 'Revoked', revokedAt: new Date().toISOString() }
          : c
      )
    );
    setRevocationToast(`Consent ${consentId} was instantly revoked. Access token invalidated across all gateway nodes in < 15ms.`);
    setTimeout(() => setRevocationToast(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-medium">
              <Key className="w-3.5 h-3.5" />
              Part 2 Deliverable: FAPI 1.0/2.0 Cryptographic Handshake & Consent Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              OAuth 2.0 & Consent Lifecycle Management
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Step-by-step cryptographic simulation of the exact 6-step FAPI handshake: Strong Customer Authentication (SCA),
              server-to-server Pushed Authorization Requests (PAR), PKCE S256 verification, and RFC 8705 certificate-bound tokens.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleTriggerSecurityTrap}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition"
            >
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              Simulate Rogue Token Attack
            </button>
            <button
              onClick={handleResetHandshake}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>

        {/* Selected TPP Selector */}
        <div className="flex items-center gap-3 mt-6 pt-6 border-t border-slate-800/80 overflow-x-auto pb-1">
          <span className="text-xs font-semibold text-slate-400 uppercase font-mono shrink-0">
            Active TPP:
          </span>
          {MOCK_TPPS.map(tpp => (
            <button
              key={tpp.id}
              onClick={() => handleSelectTpp(tpp)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition flex items-center gap-2 ${
                selectedTpp.id === tpp.id
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <span>{tpp.name}</span>
              <span className="text-[10px] uppercase font-mono px-1 rounded bg-slate-800 text-slate-300">
                {tpp.type}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Security Trap Alert if active */}
      {securityTrapActive && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-200 text-xs flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold uppercase tracking-wider font-mono">Simulated Attack Scenario</span>
            <p>{trapTriggeredMessage}</p>
          </div>
        </div>
      )}

      {/* Handshake Stepper Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Step Progression Bar */}
        <div className="lg:col-span-4 space-y-2">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono mb-3">
              The 6 FAPI Cryptographic Steps
            </h3>
            <div className="space-y-2">
              {steps.map((st, idx) => {
                const isActive = currentStepIndex === idx;
                const isPassed = currentStepIndex > idx;
                return (
                  <button
                    key={st.stepNumber}
                    onClick={() => setCurrentStepIndex(idx)}
                    className={`w-full text-left p-3 rounded-lg text-xs transition flex items-start gap-3 ${
                      isActive
                        ? 'bg-slate-800 text-white border border-emerald-500/40 shadow-sm'
                        : isPassed
                        ? 'bg-slate-950/50 text-slate-300 border border-slate-800/80 hover:bg-slate-900'
                        : 'bg-slate-950/30 text-slate-500 border border-slate-900 hover:text-slate-400'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isPassed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : isActive ? (
                        <div className="w-4 h-4 rounded-full border-2 border-emerald-400 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[10px] font-mono">
                          {st.stepNumber}
                        </div>
                      )}
                    </div>
                    <div className="truncate">
                      <div className="font-semibold truncate">
                        Step {st.stepNumber}: {st.title.split(':')[1]?.trim() || st.title}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">
                        Actor: {st.actor}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick PSU Profile Widget */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-slate-800">
              <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                Active PSU (Bank Customer)
              </span>
              <span className="text-emerald-400">Authenticated</span>
            </div>
            <div className="text-xs space-y-1 text-slate-300">
              <div className="font-semibold text-white">{MOCK_PSU.name}</div>
              <div className="text-slate-400">{MOCK_PSU.email}</div>
              <div className="text-[11px] font-mono text-slate-400">{MOCK_PSU.bankName}</div>
            </div>
          </div>
        </div>

        {/* Step Detailed Inspector */}
        <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                Actor: {activeStep.actor}
              </span>
              <h3 className="text-lg font-bold text-white mt-1.5">{activeStep.title}</h3>
              <p className="text-xs text-slate-400 mt-1">{activeStep.summary}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleNextStep}
                disabled={currentStepIndex === steps.length - 1}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold shadow-md transition"
              >
                <span>{currentStepIndex === steps.length - 1 ? 'Handshake Complete' : 'Execute Step'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Deep Architectural Details */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block">
              Protocol Mechanics & FAPI Implementation
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">{activeStep.details}</p>
            {activeStep.endpoint && (
              <div className="pt-2 flex items-center gap-2 text-xs font-mono">
                <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold">
                  {activeStep.httpMethod || 'POST'}
                </span>
                <span className="text-slate-300 truncate">{activeStep.endpoint}</span>
              </div>
            )}
          </div>

          {/* Security Controls & Verification Assertions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-300 uppercase font-mono flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                Security Controls Enforced
              </span>
              <ul className="text-xs text-slate-300 space-y-1.5">
                {activeStep.securityControls.map((sc, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{sc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-300 uppercase font-mono flex items-center gap-1.5">
                <Fingerprint className="w-3.5 h-3.5 text-cyan-400" />
                Gateway Cryptographic Proofs
              </span>
              <ul className="text-xs text-slate-300 space-y-1.5">
                {activeStep.fapiVerificationSummary.map((vs, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-cyan-400 font-bold">✓</span>
                    <span>{vs}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Payloads Inspector (Request / Response) */}
          <div className="space-y-3">
            <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider block">
              Cryptographic Message Envelopes
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeStep.requestPayload && (
                <div>
                  <span className="text-[11px] font-mono text-slate-400 mb-1 block">Request Object</span>
                  <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300/90 overflow-x-auto max-h-48">
                    {JSON.stringify(activeStep.requestPayload, null, 2)}
                  </pre>
                </div>
              )}
              {activeStep.responsePayload && (
                <div>
                  <span className="text-[11px] font-mono text-slate-400 mb-1 block">Signed Response / Artifact</span>
                  <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300/90 overflow-x-auto max-h-48">
                    {JSON.stringify(activeStep.responsePayload, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* PSU Consent Lifecycle Management Dashboard */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileSignature className="w-4 h-4 text-emerald-400" />
              Customer Consent Lifecycle Manager (PSD2 / CDR / AA)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Customers retain full visibility and instantaneous revocation rights over granted banking data sharing arrangements.
            </p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-300">
            {consents.filter(c => c.status === 'Authorised').length} Active Consent(s)
          </span>
        </div>

        {revocationToast && (
          <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-mono">
            ✓ {revocationToast}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {consents.map(consent => {
            const isAuthorised = consent.status === 'Authorised';
            return (
              <div
                key={consent.consentId}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 relative"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-white">{consent.tppName}</h4>
                    <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                      Consent ID: {consent.consentId}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded ${
                      isAuthorised
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {consent.status}
                  </span>
                </div>

                <div className="text-xs text-slate-300 space-y-1">
                  <div>
                    <span className="text-slate-500">Granted Scopes: </span>
                    <span className="font-mono text-slate-200">{consent.permissions.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Regulatory Max Expiry: </span>
                    <span className="font-mono text-amber-300">{new Date(consent.expiresAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {isAuthorised && (
                  <div className="pt-2 border-t border-slate-800/80 flex justify-end">
                    <button
                      onClick={() => handleRevokeConsent(consent.consentId)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Revoke Consent
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
