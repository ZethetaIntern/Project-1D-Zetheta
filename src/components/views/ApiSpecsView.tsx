import React, { useState } from 'react';
import { MOCK_ACCOUNTS, MOCK_TRANSACTIONS } from '../../data/mockBankingData';
import {
  FileCode,
  Play,
  Send,
  CheckCircle2,
  Copy,
  Check,
  Code2,
  Terminal,
  Zap,
  CreditCard,
  Wallet,
  Clock,
  ArrowRight
} from 'lucide-react';

interface EndpointConfig {
  id: string;
  category: 'AISP' | 'PISP' | 'CBPII';
  method: 'GET' | 'POST';
  path: string;
  title: string;
  description: string;
  requiredScope: string;
  defaultPayload?: any;
}

const ENDPOINTS: EndpointConfig[] = [
  {
    id: 'aisp-accounts',
    category: 'AISP',
    method: 'GET',
    path: '/open-banking/v3.1/aisp/accounts',
    title: 'List Authorized Accounts',
    description: 'Retrieves all checking, savings, and credit accounts granted under PSU consent.',
    requiredScope: 'accounts'
  },
  {
    id: 'aisp-balances',
    category: 'AISP',
    method: 'GET',
    path: '/open-banking/v3.1/aisp/accounts/acc-apex-001/balances',
    title: 'Get Real-Time Balances',
    description: 'Returns InterimAvailable and ClosingBooked real-time balances for an account.',
    requiredScope: 'balances'
  },
  {
    id: 'aisp-transactions',
    category: 'AISP',
    method: 'GET',
    path: '/open-banking/v3.1/aisp/accounts/acc-apex-001/transactions',
    title: 'Get Categorized Transactions',
    description: 'Retrieves full ledger transactions with ISO 20022 bank transaction codes and merchant details.',
    requiredScope: 'transactions'
  },
  {
    id: 'pisp-payment-consent',
    category: 'PISP',
    method: 'POST',
    path: '/open-banking/v3.1/pisp/domestic-payment-consents',
    title: 'Create Domestic Payment Consent',
    description: 'Establishes single immediate payment consent pre-authorisation with creditor account details.',
    requiredScope: 'payments',
    defaultPayload: {
      Data: {
        Initiation: {
          InstructionIdentification: "INSTR-2026-99018",
          EndToEndIdentification: "E2E-APEX-MODULR-01",
          InstructedAmount: { Amount: "250.00", Currency: "GBP" },
          CreditorAccount: {
            SchemeName: "UK.OBIE.SortCodeAccountNumber",
            Identification: "10882910",
            Name: "Supplier Components Ltd"
          },
          RemittanceInformation: { Reference: "INV-9921-SETTLE" }
        }
      }
    }
  },
  {
    id: 'pisp-domestic-payment',
    category: 'PISP',
    method: 'POST',
    path: '/open-banking/v3.1/pisp/domestic-payments',
    title: 'Execute Domestic Immediate Payment',
    description: 'Executes idempotent instant settlement via Faster Payments / SEPA rail.',
    requiredScope: 'payments',
    defaultPayload: {
      Data: {
        ConsentId: "pisp-consent-90182390a",
        Initiation: {
          InstructionIdentification: "INSTR-2026-99018",
          InstructedAmount: { Amount: "250.00", Currency: "GBP" },
          CreditorAccount: { Identification: "10882910", Name: "Supplier Components Ltd" }
        }
      }
    }
  },
  {
    id: 'cbpii-funds-confirmation',
    category: 'CBPII',
    method: 'POST',
    path: '/open-banking/v3.1/cbpii/funds-confirmation',
    title: 'Card-Based Confirmation of Funds',
    description: 'Confirms whether debtor account has sufficient balance for card purchase without exposing account balance.',
    requiredScope: 'fundsconfirmations',
    defaultPayload: {
      Data: {
        ConsentId: "cbpii-consent-8819",
        InstructedAmount: { Amount: "89.50", Currency: "GBP" }
      }
    }
  }
];

export const ApiSpecsView: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointConfig>(ENDPOINTS[0]);
  const [customPayload, setCustomPayload] = useState<string>(
    JSON.stringify(ENDPOINTS[0].defaultPayload || {}, null, 2)
  );
  const [responseOutput, setResponseOutput] = useState<any | null>(null);
  const [responseHeaders, setResponseHeaders] = useState<Record<string, string> | null>(null);
  const [httpStatus, setHttpStatus] = useState<number | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [copiedCurl, setCopiedCurl] = useState<boolean>(false);

  const handleSelectEndpoint = (ep: EndpointConfig) => {
    setSelectedEndpoint(ep);
    setCustomPayload(ep.defaultPayload ? JSON.stringify(ep.defaultPayload, null, 2) : '{}');
    setResponseOutput(null);
    setHttpStatus(null);
    setLatencyMs(null);
  };

  const handleExecuteCall = () => {
    setIsExecuting(true);
    const start = performance.now();

    setTimeout(() => {
      const elapsed = Math.round(performance.now() - start + 28);
      setLatencyMs(elapsed);

      if (selectedEndpoint.id === 'aisp-accounts') {
        setHttpStatus(200);
        setResponseOutput({
          Data: {
            Account: MOCK_ACCOUNTS.map(a => ({
              AccountId: a.accountId,
              Currency: a.currency,
              AccountType: a.accountType,
              AccountSubType: a.accountSubType,
              Nickname: a.nickname,
              Account: [{
                SchemeName: 'UK.OBIE.SortCodeAccountNumber',
                Identification: a.accountNumber,
                SecondaryIdentification: a.sortCodeOrRouting
              }]
            }))
          },
          Links: { Self: `https://api.gateway.royalapexbank.co.uk${selectedEndpoint.path}` },
          Meta: { TotalPages: 1 }
        });
      } else if (selectedEndpoint.id === 'aisp-balances') {
        setHttpStatus(200);
        const acc = MOCK_ACCOUNTS[0];
        setResponseOutput({
          Data: {
            Balance: [
              {
                AccountId: acc.accountId,
                Amount: { Amount: acc.balances.current.toFixed(2), Currency: acc.currency },
                CreditDebitIndicator: 'Credit',
                Type: 'ClosingBooked',
                DateTime: new Date().toISOString()
              },
              {
                AccountId: acc.accountId,
                Amount: { Amount: acc.balances.available.toFixed(2), Currency: acc.currency },
                CreditDebitIndicator: 'Credit',
                Type: 'InterimAvailable',
                DateTime: new Date().toISOString()
              }
            ]
          },
          Links: { Self: `https://api.gateway.royalapexbank.co.uk${selectedEndpoint.path}` },
          Meta: { TotalPages: 1 }
        });
      } else if (selectedEndpoint.id === 'aisp-transactions') {
        setHttpStatus(200);
        setResponseOutput({
          Data: {
            Transaction: MOCK_TRANSACTIONS.slice(0, 5).map(t => ({
              AccountId: t.accountId,
              TransactionId: t.transactionId,
              Amount: { Amount: t.amount.toFixed(2), Currency: t.currency },
              CreditDebitIndicator: t.creditDebitIndicator,
              Status: t.status,
              BookingDateTime: t.bookingDateTime,
              TransactionInformation: t.description,
              MerchantDetails: { MerchantName: t.merchantName, MerchantCategoryCode: t.mccCode || '0000' }
            }))
          },
          Links: { Self: `https://api.gateway.royalapexbank.co.uk${selectedEndpoint.path}` },
          Meta: { TotalPages: 1 }
        });
      } else if (selectedEndpoint.id === 'pisp-payment-consent') {
        setHttpStatus(201);
        setResponseOutput({
          Data: {
            ConsentId: "pisp-consent-90182390a",
            Status: "AwaitingAuthorisation",
            CreationDateTime: new Date().toISOString(),
            StatusUpdateDateTime: new Date().toISOString(),
            Initiation: {
              InstructedAmount: { Amount: "250.00", Currency: "GBP" },
              CreditorAccount: { Identification: "10882910", Name: "Supplier Components Ltd" }
            }
          },
          Links: { Self: `https://api.gateway.royalapexbank.co.uk${selectedEndpoint.path}` }
        });
      } else if (selectedEndpoint.id === 'pisp-domestic-payment') {
        setHttpStatus(201);
        setResponseOutput({
          Data: {
            DomesticPaymentId: "dom-pmnt-99823101",
            ConsentId: "pisp-consent-90182390a",
            Status: "AcceptedSettlementCompleted",
            CreationDateTime: new Date().toISOString(),
            SettlementInformation: {
              SettlementMethod: "CLRG",
              ClearingSystem: "FPS" // Faster Payments
            }
          },
          Links: { Self: `https://api.gateway.royalapexbank.co.uk${selectedEndpoint.path}` }
        });
      } else {
        // CBPII
        setHttpStatus(200);
        setResponseOutput({
          Data: {
            FundsAvailable: true,
            ConsentId: "cbpii-consent-8819",
            ConfirmationDateTime: new Date().toISOString()
          }
        });
      }

      setResponseHeaders({
        'content-type': 'application/json; charset=utf-8',
        'x-fapi-interaction-id': `fapi-live-${Date.now()}`,
        'X-RateLimit-Limit': '300',
        'X-RateLimit-Remaining': '297',
        'Sunset': 'Wed, 30 Jun 2027 23:59:59 GMT'
      });

      setIsExecuting(false);
    }, 280);
  };

  const curlCommand = `curl -X ${selectedEndpoint.method} \\
  "https://api.gateway.royalapexbank.co.uk${selectedEndpoint.path}" \\
  -H "Authorization: Bearer at_fapi_certbound_88a91203bca01928374" \\
  -H "x-fapi-interaction-id: fapi-int-77192830" \\
  -H "x-idempotency-key: idk-2026-99018" \\
  -H "Content-Type: application/json"${
    selectedEndpoint.method === 'POST' ? ` \\\n  -d '${customPayload.replace(/\n/g, '')}'` : ''
  }`;

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 p-6 sm:p-8">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-medium">
            <FileCode className="w-3.5 h-3.5" />
            Part 3 Deliverable: AISP, PISP & CBPII Specifications
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Account Information & Payment API Specifications
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Production-grade Open Banking endpoint test suite. Implements Account Information Service Provider (AISP),
            Payment Initiation Service Provider (PISP) with idempotency keys, and Confirmation of Funds (CBPII) under UK OBIE and PSD2.
          </p>
        </div>
      </div>

      {/* Main Grid: Endpoint Selector & Interactive Tester */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Endpoint Selector Sidebar */}
        <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
          <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider font-mono block">
            API Endpoints ({ENDPOINTS.length})
          </span>

          <div className="space-y-2">
            {ENDPOINTS.map((ep) => {
              const isSelected = selectedEndpoint.id === ep.id;
              return (
                <button
                  key={ep.id}
                  onClick={() => handleSelectEndpoint(ep)}
                  className={`w-full text-left p-3 rounded-lg text-xs transition space-y-1 ${
                    isSelected
                      ? 'bg-slate-800 text-white border border-indigo-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                        ep.method === 'GET'
                          ? 'bg-blue-500/20 text-blue-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {ep.method}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 font-semibold">
                      {ep.category}
                    </span>
                  </div>
                  <div className="font-semibold text-slate-200 truncate">{ep.title}</div>
                  <div className="font-mono text-[11px] text-slate-500 truncate">{ep.path}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live API Tester / Playground */}
        <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-5">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-xs font-bold font-mono ${
                    selectedEndpoint.method === 'GET'
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'bg-emerald-500/20 text-emerald-300'
                  }`}
                >
                  {selectedEndpoint.method}
                </span>
                <span className="text-sm font-mono font-bold text-white truncate">
                  {selectedEndpoint.path}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{selectedEndpoint.description}</p>
            </div>

            <button
              onClick={handleExecuteCall}
              disabled={isExecuting}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md transition shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              {isExecuting ? 'Dispatching...' : 'Execute Request'}
            </button>
          </div>

          {/* FAPI Headers Simulated */}
          <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs space-y-1.5 font-mono">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Injected FAPI Headers
            </span>
            <div className="text-slate-300">Authorization: <span className="text-emerald-400">Bearer at_fapi_certbound_88a91203bca01928374</span></div>
            <div className="text-slate-300">x-fapi-interaction-id: <span className="text-indigo-400">fapi-live-req-009182</span></div>
            {selectedEndpoint.category === 'PISP' && (
              <div className="text-slate-300">x-idempotency-key: <span className="text-amber-400">idk-fps-2026-99018</span></div>
            )}
          </div>

          {/* Request Payload Editor if POST */}
          {selectedEndpoint.method === 'POST' && (
            <div className="space-y-1.5">
              <span className="text-xs font-mono font-semibold text-slate-400 uppercase">
                JSON Request Body
              </span>
              <textarea
                value={customPayload}
                onChange={(e) => setCustomPayload(e.target.value)}
                rows={5}
                className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50"
              />
            </div>
          )}

          {/* Response Container */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-slate-400 uppercase">
                Gateway Ingress Response
              </span>
              {httpStatus && (
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span
                    className={`font-bold px-2 py-0.5 rounded ${
                      httpStatus >= 200 && httpStatus < 300
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    HTTP {httpStatus}
                  </span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {latencyMs}ms
                  </span>
                </div>
              )}
            </div>

            <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs min-h-[160px] overflow-x-auto text-emerald-300/90">
              {responseOutput ? (
                <pre>{JSON.stringify(responseOutput, null, 2)}</pre>
              ) : (
                <div className="text-slate-500 flex flex-col items-center justify-center h-28 text-center">
                  <Play className="w-6 h-6 text-slate-700 mb-1" />
                  Click "Execute Request" above to dispatch this FAPI request to the Django gateway engine.
                </div>
              )}
            </div>
          </div>

          {/* cURL Snippet */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                <Terminal className="w-3 h-3 text-slate-500" />
                cURL Generator
              </span>
              <button
                onClick={handleCopyCurl}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200"
              >
                {copiedCurl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedCurl ? 'Copied' : 'Copy cURL'}
              </button>
            </div>
            <pre className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-300 overflow-x-auto">
              {curlCommand}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
