import { GovernancePolicy, AuditLogEntry } from '../types/openBanking';

export const GOVERNANCE_POLICIES: GovernancePolicy[] = [
  {
    id: 'gov-01',
    policyNumber: 1,
    title: 'API Versioning & Lifecycle Policy',
    summary: 'Strict Semantic Versioning (SemVer) with minimum 6–12 month deprecation notice and RFC 8594 Sunset HTTP headers.',
    rules: [
      'Major versions (v3 -> v4) reserved exclusively for breaking changes with 12 months minimum deprecation notice.',
      'Minor versions introduce backward-compatible endpoints with 6 months notice.',
      'All retiring endpoints MUST return Sunset and Deprecation HTTP headers with links to migration guides.',
      'Core banking endpoints older than N-2 major versions are decommissioned systematically.'
    ],
    enforcementMechanism: 'Automated Gateway Header Injection via Django SunsetDeprecationMiddleware.',
    standardReference: 'RFC 8594 (Sunset Header) & OBIE API Lifecycle Guidelines',
    status: 'ENFORCED',
    metrics: { label: 'Active Spec Version', value: 'v3.1.11 (Sunset: 2027-06-30)' }
  },
  {
    id: 'gov-02',
    policyNumber: 2,
    title: 'Schema & Data Standard Compliance',
    summary: 'Zero tolerance for arbitrary bank-proprietary fields. Automated schema validation against ISO 20022 and OBIE v3.1.',
    rules: [
      'No bank or TPP may introduce proprietary unvalidated fields into payload envelopes.',
      'Ingress gateway intercepts and validates JSON schemas against OpenAPI 3.0 before routing to core banking.',
      'Payload rejection with HTTP 400 and OBIE error format on schema mismatch.',
      'Strict adherence to ISO 20022 bank transaction codes (e.g. PMNT/ICCT).'
    ],
    enforcementMechanism: 'Django REST Framework Serializer & JSON Schema Ingress Gatekeeper.',
    standardReference: 'ISO 20022 / OBIE Read-Write Schema Repository',
    status: 'ENFORCED',
    metrics: { label: 'Schema Validation Rate', value: '100% Ingress Conformance' }
  },
  {
    id: 'gov-03',
    policyNumber: 3,
    title: 'Security & Certification Policy',
    summary: 'Mandatory FAPI 1.0 Advanced / FAPI 2.0 conformance, eIDAS QWAC/QSealC certificate validation, and real-time OCSP/CRL checking.',
    rules: [
      'Mandatory Mutual TLS (mTLS) with client certificate verification on all data and token endpoints.',
      'Certificate lifecycle verification: Expiry checks, revocation status query via OCSP/CRL.',
      'Signed request objects (JAR / RFC 9101) with PS256 or ES256 algorithms.',
      'Bi-annual independent penetration testing and automated dynamic application security testing (DAST).'
    ],
    enforcementMechanism: 'FAPIMutualTLSMiddleware & Open Banking Directory PKI validator.',
    standardReference: 'OpenID Foundation FAPI 1.0 Advanced & ETSI TS 119 495',
    status: 'ENFORCED',
    metrics: { label: 'eIDAS Validation Status', value: 'Active / Zero Revocations' }
  },
  {
    id: 'gov-04',
    policyNumber: 4,
    title: 'Consent & Data Minimization Policy',
    summary: 'Strict data minimization: TPPs may only access legitimate scopes. 90-day maximum consent duration under PSD2.',
    rules: [
      'No blanket "give me everything" access allowed; scopes must be explicitly justified.',
      'Hard cap of 90 days on AISP consent before Strong Customer Authentication (SCA) re-authentication is legally required.',
      'Instant propagation of PSU revocation events across all gateway caching nodes within < 500ms.',
      'TPP mandatory data purging requirement upon consent revocation or expiry.'
    ],
    enforcementMechanism: 'Django ORM ConsentRecord Expiration Checker & PSU Revocation Webhooks.',
    standardReference: 'GDPR Article 5(1)(c) & PSD2 RTS Article 10',
    status: 'ENFORCED',
    metrics: { label: 'Active Consents Monitored', value: '1,420 Active / 0 Expired Bleed' }
  },
  {
    id: 'gov-05',
    policyNumber: 5,
    title: 'Availability & Performance SLAs',
    summary: 'Guaranteed 99.99% gateway availability matching or exceeding online banking channel availability.',
    rules: [
      'Mandatory API uptime parity with the bank\'s proprietary customer portal and mobile banking apps.',
      'P99 response time SLA < 450ms for Account Information; P99 < 850ms for Payment Initiation.',
      'Real-time automated incident and outage status notifications to all registered TPPs via webhooks and status page.',
      'Planned maintenance restricted to off-peak maintenance windows with 7 days advance notice.'
    ],
    enforcementMechanism: 'High-availability Kubernetes Gateway Ingress & Real-time Synthetic Heartbeats.',
    standardReference: 'EBA Guidelines on Major Incident Reporting (EBA/GL/2021/03)',
    status: 'ENFORCED',
    metrics: { label: 'Gateway 30-Day Uptime', value: '99.994% (Avg Latency: 42ms)' }
  },
  {
    id: 'gov-06',
    policyNumber: 6,
    title: 'Access Control & Roles Policy (RBAC)',
    summary: 'Strict role segregation based on regulatory register licenses: AISP, PISP, and CBPII cannot cross permissions.',
    rules: [
      'AISP-only licenses are strictly prohibited from invoking payment initiation endpoints (HTTP 403 Forbidden).',
      'PISP-only licenses cannot read full ledger transaction histories (only payment confirmation status).',
      'CBPII licenses can only query boolean Confirmation of Funds without viewing balance amounts.',
      'Gateway verifies TPP license role in real-time against FCA / EBA / RBI / ACCC central registers.'
    ],
    enforcementMechanism: 'Django REST Framework Role-Based Permissions (FAPIRolePermission).',
    standardReference: 'PSD2 Articles 64-67 & UK Open Banking Security Profile',
    status: 'ENFORCED',
    metrics: { label: 'Cross-Role Breaches Blocked', value: '100% Policy Enforced' }
  },
  {
    id: 'gov-07',
    policyNumber: 7,
    title: 'Fraud Monitoring & Liability Policy',
    summary: 'Real-time anomaly scoring, IP geolocation validation, velocity checks, and regulatory liability shift determination.',
    rules: [
      'Every payment initiation request is evaluated through a sub-second machine learning risk scoring engine.',
      'Velocity alerts trigger on > 5 payment attempts within 60 seconds from the same device fingerprint.',
      'Strict liability shift rules: Fraudulent payment liability sits with bank unless TPP gross negligence or PSU fraud proved.',
      'Automated quarantine of compromised TPP client credentials upon abnormal data scraping patterns.'
    ],
    enforcementMechanism: 'Gateway Anomaly Scorer & Risk Analysis Pipeline.',
    standardReference: 'PSR 2017 Regulation 76 & PSD2 Article 73',
    status: 'ENFORCED',
    metrics: { label: 'Avg Anomaly Risk Score', value: '4.2 / 100 (Nominal)' }
  },
  {
    id: 'gov-08',
    policyNumber: 8,
    title: 'Audit & Reporting Policy',
    summary: 'Immutable, tamper-evident audit trail of all consents, revocations, and data access events for regulatory reporting.',
    rules: [
      'Every transaction records an immutable entry containing x-fapi-interaction-id, client cert thumbprint, and timestamp.',
      'Audit records retained for 7 years to satisfy regulatory dispute resolution inquiries.',
      'Automated monthly generation of regulatory performance reports for submission to the FCA, EBA, and national regulators.',
      'Zero-knowledge encryption of audit logs at rest using AES-256-GCM.'
    ],
    enforcementMechanism: 'Django AuditLogMiddleware with Append-Only Event Store.',
    standardReference: 'FCA Supervision Manual (SUP 16) & CDR Rule 9.4',
    status: 'ENFORCED',
    metrics: { label: 'Logged Gateway Events', value: '100% Traceability' }
  }
];

export const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-9901',
    timestamp: '2026-10-06T12:49:12Z',
    interactionId: 'fapi-int-77192830',
    tppId: 'tpp-emma-01',
    tppName: 'Emma Wealth & Budgeting Ltd',
    endpoint: '/open-banking/v3.1/aisp/accounts/acc-apex-001/transactions',
    httpStatus: 200,
    framework: 'UK_OBIE',
    ipAddress: '194.28.112.45',
    riskScore: 3,
    mTLSSuccess: true,
    dpopVerified: true,
    action: 'AISP_READ_TRANSACTIONS'
  },
  {
    id: 'aud-9902',
    timestamp: '2026-10-06T12:44:05Z',
    interactionId: 'fapi-int-66182901',
    tppId: 'tpp-sage-05',
    tppName: 'Sage Cloud Accounting SME Sync',
    endpoint: '/open-banking/v3.1/aisp/accounts/acc-apex-004/balances',
    httpStatus: 200,
    framework: 'UK_OBIE',
    ipAddress: '52.18.91.204',
    riskScore: 2,
    mTLSSuccess: true,
    dpopVerified: false,
    action: 'AISP_READ_BALANCES'
  },
  {
    id: 'aud-9903',
    timestamp: '2026-10-06T12:38:19Z',
    interactionId: 'fapi-int-55102941',
    tppId: 'tpp-modulr-02',
    tppName: 'Modulr Finance Instant Pay',
    endpoint: '/open-banking/v3.1/pisp/domestic-payments',
    httpStatus: 201,
    framework: 'PSD2_EU',
    ipAddress: '185.86.151.10',
    riskScore: 7,
    mTLSSuccess: true,
    dpopVerified: true,
    action: 'PISP_DOMESTIC_PAYMENT_EXECUTED'
  },
  {
    id: 'aud-9904',
    timestamp: '2026-10-06T12:30:44Z',
    interactionId: 'fapi-int-44910283',
    tppId: 'tpp-rogue-simulated',
    tppName: 'Untrusted External Client (Simulation)',
    endpoint: '/open-banking/v3.1/aisp/accounts',
    httpStatus: 401,
    framework: 'UK_OBIE',
    ipAddress: '88.201.44.12',
    riskScore: 92,
    mTLSSuccess: false,
    dpopVerified: false,
    action: 'BLOCKED_MTLS_CERT_MISMATCH'
  }
];
