import React, { useState } from 'react';
import { GOVERNANCE_POLICIES, MOCK_AUDIT_LOGS } from '../../services/governanceEngine';
import { GovernancePolicy, AuditLogEntry } from '../../types/openBanking';
import {
  FileCheck,
  ShieldCheck,
  Activity,
  AlertTriangle,
  Clock,
  Download,
  Filter,
  CheckCircle2,
  Lock,
  Flame,
  FileText
} from 'lucide-react';

export const GovernanceSlaView: React.FC = () => {
  const [selectedPolicy, setSelectedPolicy] = useState<GovernancePolicy>(GOVERNANCE_POLICIES[0]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(MOCK_AUDIT_LOGS);
  const [filterAction, setFilterAction] = useState<string>('ALL');

  const filteredLogs = filterAction === 'ALL'
    ? auditLogs
    : auditLogs.filter(l => l.action.includes(filterAction));

  const handleExportAuditLogs = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `regulatory-audit-trail-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 p-6 sm:p-8">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-medium">
            <FileCheck className="w-3.5 h-3.5" />
            Part 6 Deliverable: API Governance Policies & SLA Monitoring
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            API Governance Policies, SLAs & Immutable Audit Trails
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Enterprise policy framework ensuring 99.99% availability, strict semantic lifecycle deprecation headers (RFC 8594),
            zero-trust role segregation (RBAC), real-time fraud scoring, and regulatory reporting readiness.
          </p>
        </div>

        {/* 4 Key Real-time SLA Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-400 font-mono block">UPTIME SLA (30 DAYS)</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-lg font-bold text-emerald-400">99.994%</span>
              <span className="text-[10px] font-mono px-1 rounded bg-emerald-500/10 text-emerald-300">Target: 99.99%</span>
            </div>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-400 font-mono block">AVERAGE LATENCY (P99)</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-lg font-bold text-cyan-400">42.8 ms</span>
              <span className="text-[10px] font-mono px-1 rounded bg-cyan-500/10 text-cyan-300">SLA: &lt; 450ms</span>
            </div>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-400 font-mono block">RFC 8594 SUNSET ACTIVE</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-lg font-bold text-amber-400">2027-06-30</span>
              <span className="text-[10px] font-mono px-1 rounded bg-amber-500/10 text-amber-300">v3.1 Specs</span>
            </div>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-400 font-mono block">FRAUD VELOCITY SCORE</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-lg font-bold text-emerald-400">4.2 / 100</span>
              <span className="text-[10px] font-mono px-1 rounded bg-emerald-500/10 text-emerald-300">Nominal</span>
            </div>
          </div>
        </div>
      </div>

      {/* The 8 Governance Policies Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Policy Selector Sidebar */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3">
          <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider font-mono block">
            The 8 Enterprise Governance Policies
          </span>

          <div className="space-y-1.5">
            {GOVERNANCE_POLICIES.map((p) => {
              const isSelected = selectedPolicy.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPolicy(p)}
                  className={`w-full text-left p-3 rounded-xl text-xs transition space-y-1 ${
                    isSelected
                      ? 'bg-slate-800 text-white border border-emerald-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-emerald-400">
                      Policy #{p.policyNumber}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-300">
                      {p.status}
                    </span>
                  </div>
                  <div className="font-semibold text-slate-200 truncate">{p.title}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Policy Detailed Specs */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="pb-3 border-b border-slate-800">
            <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">
              Policy #{selectedPolicy.policyNumber} Specification
            </span>
            <h3 className="text-lg font-bold text-white mt-1">{selectedPolicy.title}</h3>
            <p className="text-xs text-slate-400 mt-1">{selectedPolicy.summary}</p>
          </div>

          <div>
            <h4 className="text-xs font-mono uppercase font-bold text-slate-400 mb-2">
              Mandatory Enforcement Rules
            </h4>
            <ul className="text-xs text-slate-300 space-y-2">
              {selectedPolicy.rules.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0 mt-0.5">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs">
              <span className="font-mono text-slate-400 text-[10px] block">ENFORCEMENT MECHANISM</span>
              <span className="text-slate-200 font-medium">{selectedPolicy.enforcementMechanism}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs">
              <span className="font-mono text-slate-400 text-[10px] block">STANDARD / REGULATION</span>
              <span className="text-emerald-400 font-medium">{selectedPolicy.standardReference}</span>
            </div>
          </div>

          {selectedPolicy.metrics && (
            <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-xs font-mono flex items-center justify-between">
              <span className="text-slate-300">{selectedPolicy.metrics.label}:</span>
              <span className="text-emerald-300 font-bold">{selectedPolicy.metrics.value}</span>
            </div>
          )}
        </div>
      </div>

      {/* Immutable Regulatory Audit Log Explorer */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Immutable Regulatory Audit Trail (7-Year Retention)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Append-only tamper-evident log capturing correlation IDs (x-fapi-interaction-id), mTLS status, and risk scoring.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportAuditLogs}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
            >
              <Download className="w-3.5 h-3.5" />
              Export Audit Trail (JSON)
            </button>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                <th className="py-2.5 px-3">Timestamp & ID</th>
                <th className="py-2.5 px-3">TPP Client</th>
                <th className="py-2.5 px-3">Action & Endpoint</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">mTLS / DPoP</th>
                <th className="py-2.5 px-3">Risk Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-3 px-3">
                    <div className="text-slate-200">{new Date(log.timestamp).toLocaleTimeString()}</div>
                    <div className="text-[10px] text-slate-500">{log.interactionId}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-slate-200 font-medium">{log.tppName}</div>
                    <div className="text-[10px] text-slate-500">{log.ipAddress}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-emerald-400">{log.action}</div>
                    <div className="text-[10px] text-slate-500 truncate max-w-xs">{log.endpoint}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        log.httpStatus === 200 || log.httpStatus === 201
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {log.httpStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[11px]">
                    <span className={log.mTLSSuccess ? 'text-emerald-400' : 'text-rose-400'}>
                      mTLS: {log.mTLSSuccess ? '✓' : '✗'}
                    </span>
                    <span className="text-slate-500 ml-2">
                      DPoP: {log.dpopVerified ? '✓' : '—'}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`font-bold ${
                        log.riskScore < 20
                          ? 'text-emerald-400'
                          : log.riskScore < 50
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {log.riskScore}/100
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
