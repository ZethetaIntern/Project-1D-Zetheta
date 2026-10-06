import React, { useState } from 'react';
import { FRAMEWORKS_REGISTRY, runComplianceAudit } from '../../services/complianceEngine';
import { FrameworkType } from '../../types/openBanking';
import {
  Globe,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Scale,
  Building,
  Lock,
  ArrowRight
} from 'lucide-react';

interface ComplianceMatrixViewProps {
  onAuditCompleted?: () => void;
}

export const ComplianceMatrixView: React.FC<ComplianceMatrixViewProps> = ({ onAuditCompleted }) => {
  const [selectedFw, setSelectedFw] = useState<FrameworkType>('UK_OBIE');
  const [auditCertStatus, setAuditCertStatus] = useState<'VALID' | 'REVOKED' | 'EXPIRED'>('VALID');
  const [auditConsentDays, setAuditConsentDays] = useState<number>(45);
  const [auditIsDirectPipe, setAuditIsDirectPipe] = useState<boolean>(false);
  const [auditResult, setAuditResult] = useState<any | null>(null);

  const frameworks: FrameworkType[] = ['UK_OBIE', 'PSD2_EU', 'INDIA_AA', 'AU_CDR'];

  const handleRunAudit = () => {
    const res = runComplianceAudit(selectedFw, auditCertStatus, auditConsentDays, auditIsDirectPipe);
    setAuditResult(res);
    if (onAuditCompleted) onAuditCompleted();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/40 border border-slate-800 p-6 sm:p-8">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-medium">
            <Globe className="w-3.5 h-3.5" />
            Part 5 Deliverable: Multi-Framework Regulatory Compliance
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Multi-Framework Compliance: PSD2, UK Open Banking, AA & CDR
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Architectural harmonization across the 4 major international open data jurisdictions: European Union (PSD2),
            United Kingdom (OBIE), India (Account Aggregator - AA), and Australia (Consumer Data Right - CDR).
          </p>
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Scale className="w-4 h-4 text-emerald-400" />
          Global Open Banking Framework Comparison Matrix
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[11px]">
                <th className="py-3 px-4">Framework</th>
                <th className="py-3 px-4">Jurisdiction & Regulator</th>
                <th className="py-3 px-4">Architecture Topology</th>
                <th className="py-3 px-4">Consent Cap</th>
                <th className="py-3 px-4">Security / Certificate Profile</th>
                <th className="py-3 px-4">Data Reciprocity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-sans">
              {frameworks.map((fwKey) => {
                const fw = FRAMEWORKS_REGISTRY[fwKey];
                const isSelected = selectedFw === fwKey;
                return (
                  <tr
                    key={fwKey}
                    onClick={() => setSelectedFw(fwKey)}
                    className={`cursor-pointer transition ${
                      isSelected
                        ? 'bg-slate-800/80 text-white font-medium'
                        : 'hover:bg-slate-800/30'
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-semibold text-emerald-400">
                      {fw.name}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-white">{fw.region}</div>
                      <div className="text-[11px] text-slate-400">{fw.regulator}</div>
                    </td>
                    <td className="py-3 px-4 text-[11px] text-slate-300">
                      {fw.architectureModel}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-amber-300">
                      {fw.consentLifetimeMaxDays} Days Max
                    </td>
                    <td className="py-3 px-4 text-[11px] font-mono text-cyan-300">
                      {fw.securityProfile}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {fw.dataReciprocityEnforced ? (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                          MANDATORY
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[11px]">Voluntary</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Framework Deep Dive & Interactive Validator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Deep Dive Card */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          {(() => {
            const fw = FRAMEWORKS_REGISTRY[selectedFw];
            return (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                      {fw.region}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1">{fw.name}</h3>
                  </div>
                  <span className="text-xs font-mono text-slate-400">{fw.keyLegislation}</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{fw.description}</p>

                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-mono uppercase font-bold text-slate-400">
                    Distinctive Regulatory Features
                  </h4>
                  <ul className="text-xs text-slate-300 space-y-1.5">
                    {fw.distinctiveFeatures.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                  <span className="font-mono text-slate-400 font-semibold block">Key Differences:</span>
                  {fw.keyDifferences.map((d, i) => (
                    <p key={i} className="text-slate-300">• {d}</p>
                  ))}
                </div>
              </>
            );
          })()}
        </div>

        {/* Live Regulatory Compliance Audit Simulator */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              Live Framework Conformance Auditor
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulate an incoming TPP request or consent grant against {FRAMEWORKS_REGISTRY[selectedFw].name} rules.
            </p>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div>
              <label className="text-slate-400 block mb-1">TPP Certificate Status</label>
              <select
                value={auditCertStatus}
                onChange={(e) => setAuditCertStatus(e.target.value as any)}
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none"
              >
                <option value="VALID">VALID (Accredited CA)</option>
                <option value="EXPIRED">EXPIRED (Certificate Lapsed)</option>
                <option value="REVOKED">REVOKED (Flagged in CRL/OCSP)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">
                Consent Elapsed Age: <span className="text-amber-300 font-bold">{auditConsentDays} days</span>
              </label>
              <input
                type="range"
                min="1"
                max="380"
                value={auditConsentDays}
                onChange={(e) => setAuditConsentDays(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>1 day</span>
                <span>90 days (PSD2 cap)</span>
                <span>365 days (CDR cap)</span>
              </div>
            </div>

            {selectedFw === 'INDIA_AA' && (
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={auditIsDirectPipe}
                    onChange={(e) => setAuditIsDirectPipe(e.target.checked)}
                    className="accent-rose-500"
                  />
                  <span>Direct TPP-Bank Connection (Violation in India)</span>
                </label>
              </div>
            )}

            <button
              onClick={handleRunAudit}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold flex items-center justify-center gap-2 transition"
            >
              <Play className="w-3.5 h-3.5" />
              Execute Compliance Audit
            </button>
          </div>

          {/* Audit Results */}
          {auditResult && (
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">AUDIT VERDICT</span>
                <span
                  className={`px-2 py-0.5 rounded font-bold ${
                    auditResult.isCompliant
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-rose-500/20 text-rose-300'
                  }`}
                >
                  {auditResult.isCompliant ? '100% COMPLIANT' : 'NON-COMPLIANT FINDINGS'}
                </span>
              </div>

              {auditResult.issues.length > 0 && (
                <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-[11px] text-rose-200 space-y-1">
                  {auditResult.issues.map((iss: string, i: number) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0 mt-0.5" />
                      <span>{iss}</span>
                    </div>
                  ))}
                </div>
              )}

              {auditResult.passes.length > 0 && (
                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-[11px] text-emerald-200 space-y-1">
                  {auditResult.passes.map((pass: string, i: number) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{pass}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
