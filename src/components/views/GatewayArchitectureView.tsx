import React, { useState } from 'react';
import { OPEN_API_SPEC_V3 } from '../../data/openApiSpec';
import {
  Layers,
  Shield,
  Lock,
  Server,
  FileCode,
  Download,
  Copy,
  Check,
  CheckCircle2,
  Cpu,
  ArrowRight,
  Database,
  ExternalLink
} from 'lucide-react';

export const GatewayArchitectureView: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('/oauth/v2/par');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'diagram' | 'openapi' | 'fapi-security'>('diagram');

  const handleCopySpec = () => {
    navigator.clipboard.writeText(JSON.stringify(OPEN_API_SPEC_V3, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSpec = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(OPEN_API_SPEC_V3, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "open-banking-fapi-openapi-3.0.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const paths = Object.keys(OPEN_API_SPEC_V3.paths);

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/70 border border-slate-800 p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-medium">
              <Shield className="w-3.5 h-3.5" />
              Part 1 Deliverable: FAPI 1.0 Advanced / FAPI 2.0 Ingress
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Open Banking API Gateway Architecture & OpenAPI 3.0
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              High-throughput, financial-grade API gateway architecture mediating communication between Third Party Providers (TPPs)
              and Core Banking ledgers. Implements mutual TLS termination, eIDAS / QWAC cryptographic verification, sender-constrained
              token validation, and OpenAPI 3.0 specifications.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopySpec}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy OpenAPI JSON'}
            </button>
            <button
              onClick={handleDownloadSpec}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 transition"
            >
              <Download className="w-4 h-4" />
              Download Spec (v3.0.3)
            </button>
          </div>
        </div>

        {/* View Switcher Subnav */}
        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab('diagram')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'diagram'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Gateway Topology & Request Pipeline
          </button>
          <button
            onClick={() => setActiveTab('openapi')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'openapi'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Interactive OpenAPI 3.0 Schema Explorer
          </button>
          <button
            onClick={() => setActiveTab('fapi-security')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'fapi-security'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Encryption & FAPI Security Profile
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'diagram' && (
        <div className="space-y-6">
          {/* Architectural Diagram */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              End-to-End FAPI Request Lifecycle Pipeline
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              How a secure request flows from a licensed Third-Party Provider (TPP) through the Ingress Proxy, Django FAPI Gatekeeper,
              and into Core Banking engines.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Node 1 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
                    1. TPP CLIENT
                  </span>
                  <Lock className="w-4 h-4 text-blue-400" />
                </div>
                <h4 className="text-sm font-semibold text-white">Third Party App</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Emma, Mint, Modulr, Sage, or Robo-Advisor executing consumer/SME operations.
                </p>
                <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-300 space-y-1">
                  <div>• eIDAS QWAC / QSealC</div>
                  <div>• RFC 9101 JAR Request</div>
                  <div>• DPoP Proof Key</div>
                </div>
              </div>

              {/* Node 2 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 relative shadow-sm shadow-emerald-500/5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                    2. INGRESS & mTLS
                  </span>
                  <Shield className="w-4 h-4 text-emerald-400" />
                </div>
                <h4 className="text-sm font-semibold text-white">Reverse Proxy (mTLS)</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Terminates mutual TLS connection, performs OCSP revocation query, extracts client thumbprint.
                </p>
                <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-300 space-y-1">
                  <div>• Port 443 mTLS Verification</div>
                  <div>• X-SSL-Client-SHA256 Header</div>
                  <div>• Anti-DDoS Token Bucket</div>
                </div>
              </div>

              {/* Node 3 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30 relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold">
                    3. DJANGO GATEWAY
                  </span>
                  <Cpu className="w-4 h-4 text-indigo-400" />
                </div>
                <h4 className="text-sm font-semibold text-white">Django FAPI Gateway</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Enforces certificate binding (cnf claim), DPoP proof, RBAC scopes, 90-day consent TTL, and Sunset headers.
                </p>
                <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-300 space-y-1">
                  <div>• FAPIMutualTLSMiddleware</div>
                  <div>• RateLimitMiddleware (300/m)</div>
                  <div>• Immutable Audit Logger</div>
                </div>
              </div>

              {/* Node 4 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">
                    4. CORE BANKING
                  </span>
                  <Database className="w-4 h-4 text-cyan-400" />
                </div>
                <h4 className="text-sm font-semibold text-white">Core Ledger & Rails</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Queries account balances, categorised transaction ledger, or initiates Faster Payments / SEPA settlement.
                </p>
                <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-300 space-y-1">
                  <div>• ISO 20022 Data Models</div>
                  <div>• Idempotent FPS Clearing</div>
                  <div>• Ledger Masking</div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Architectural Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-2">
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                OpenAPI 3.0 Strict Conformance
              </h4>
              <p className="text-xs text-slate-400">
                All AISP, PISP, and CBPII endpoints conform to ISO 20022 and OBIE v3.1 schemas. Automatic schema validation
                rejects non-compliant fields before reaching internal banking databases.
              </p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-2">
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                FAPI 1.0 Advanced & FAPI 2.0
              </h4>
              <p className="text-xs text-slate-400">
                Implements Pushed Authorization Requests (PAR / RFC 9101), PKCE S256, JARM authorization response signing,
                and Sender-Constrained Tokens (RFC 8705 & RFC 9449).
              </p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-2">
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                Sunset & Deprecation Headers
              </h4>
              <p className="text-xs text-slate-400">
                Complies with RFC 8594 by serving Sunset and Deprecation headers with migration links, guaranteeing TPPs
                a 6-12 month backward-compatibility window.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'openapi' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Endpoint Sidebar */}
          <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase text-slate-400 tracking-wider font-mono">
              OpenAPI Endpoints ({paths.length})
            </h3>
            <div className="space-y-1.5">
              {paths.map((p) => {
                const specItem = (OPEN_API_SPEC_V3.paths as any)[p];
                const method = Object.keys(specItem)[0];
                const isSelected = selectedEndpoint === p;
                return (
                  <button
                    key={p}
                    onClick={() => setSelectedEndpoint(p)}
                    className={`w-full text-left p-2.5 rounded-lg text-xs font-mono transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    <span className="truncate">{p}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${
                        method === 'get'
                          ? 'bg-blue-500/20 text-blue-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {method}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Endpoint Details */}
          <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-4">
            {(() => {
              const spec = (OPEN_API_SPEC_V3.paths as any)[selectedEndpoint];
              const method = Object.keys(spec)[0];
              const details = spec[method];
              return (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase font-mono ${
                        method === 'get'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {method}
                    </span>
                    <span className="text-sm sm:text-base font-mono font-semibold text-white">
                      {selectedEndpoint}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-slate-100">{details.summary}</h4>
                    <p className="text-xs text-slate-400 mt-1">{details.description}</p>
                  </div>

                  {/* Security Schemes */}
                  {details.security && (
                    <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
                      <span className="font-semibold text-slate-300">Security Schemes: </span>
                      <span className="font-mono text-emerald-400">
                        {details.security.map((s: any) => Object.keys(s).join(', ')).join(' | ')}
                      </span>
                    </div>
                  )}

                  {/* JSON Schema Definition */}
                  <div>
                    <h5 className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono mb-2">
                      OpenAPI 3.0 Node Definition
                    </h5>
                    <pre className="bg-slate-950 border border-slate-800 rounded-lg p-4 text-xs font-mono text-emerald-300/90 overflow-x-auto max-h-96">
                      {JSON.stringify(details, null, 2)}
                    </pre>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {activeTab === 'fapi-security' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            Cryptography & Security Controls (FAPI Protocols)
          </h3>
          <p className="text-xs text-slate-400">
            Open Banking handles sensitive financial data and payment execution. The API Gateway enforces multi-layered encryption
            as specified in the architecture prompt.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-mono font-bold text-emerald-400">1. Encryption in Transit — TLS 1.3</span>
              <p className="text-xs text-slate-300">
                Mandatory TLS 1.3 with restricted cipher suites (ECDHE-ECDSA-AES256-GCM-SHA384, ECDHE-RSA-AES256-GCM-SHA384).
                Downgrade to TLS 1.1 or SSL is hard-blocked at the edge.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-mono font-bold text-emerald-400">2. Message-Level Signing — JWS & JWE</span>
              <p className="text-xs text-slate-300">
                Signed Request Objects (RFC 9101 JAR) and signed responses (JARM). Payloads are signed with PS256 / ES256 and
                optionally encrypted with JWE (AES-256-GCM) to prevent inspection by intermediaries.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-mono font-bold text-emerald-400">3. Encryption at Rest — AES-256-GCM</span>
              <p className="text-xs text-slate-300">
                All customer consent records, audit log entries, and account ledger databases are encrypted with envelope encryption
                backed by hardware security modules (HSM) and KMS key rotation.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-mono font-bold text-emerald-400">4. Certificate Infrastructure — eIDAS & OBIE</span>
              <p className="text-xs text-slate-300">
                Qualified Website Authentication Certificates (QWAC) for transport layer mTLS; Qualified Electronic Seals (QSealC)
                for signing payment instructions. Automated OCSP/CRL revocation verification.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
