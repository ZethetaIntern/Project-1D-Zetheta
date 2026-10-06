/**
 * Open Banking FAPI Gateway & TPP Ecosystem - Core Type Definitions
 * Covers FAPI 1.0 Advanced / FAPI 2.0, OAuth 2.0, AISP, PISP, CBPII,
 * Multi-Framework Compliance (PSD2, UK OBIE, India AA, Australia CDR),
 * API Governance, and TPP Services.
 */

export type FrameworkType = 'UK_OBIE' | 'PSD2_EU' | 'INDIA_AA' | 'AU_CDR';

export type FAPIVersion = 'FAPI_1_ADVANCED' | 'FAPI_2_SECURITY_PROFILE';

export type TPPType = 'AISP' | 'PISP' | 'CBPII' | 'AA_FIU' | 'CDR_ADR';

export interface TPPProfile {
  id: string;
  name: string;
  orgId: string;
  type: TPPType;
  framework: FrameworkType;
  clientId: string;
  clientSecretMasked: string;
  redirectUris: string[];
  certificate: {
    type: 'eIDAS_QWAC' | 'eIDAS_QSealC' | 'OBIE_MTLS' | 'AA_DIGITAL_SIG' | 'CDR_DEVICE_CERT';
    serialNumber: string;
    issuer: string;
    thumbprint: string;
    validTo: string;
    status: 'VALID' | 'EXPIRED' | 'REVOKED';
  };
  rateLimitTier: 'FREE' | 'STANDARD' | 'ENTERPRISE';
  allowedScopes: string[];
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
}

export type ConsentStatus =
  | 'AwaitingAuthorisation'
  | 'Authorised'
  | 'Rejected'
  | 'Revoked'
  | 'Expired';

export interface ConsentRecord {
  consentId: string;
  tppId: string;
  tppName: string;
  userId: string;
  userName: string;
  framework: FrameworkType;
  consentType: 'AIS' | 'PIS' | 'CBPII' | 'AA_ARTIFACT' | 'CDR_SHARING';
  permissions: string[];
  status: ConsentStatus;
  createdAt: string;
  expiresAt: string;
  authorizedAt?: string;
  revokedAt?: string;
  frequencyPerDay?: number;
  paymentDetails?: {
    instructedAmount: number;
    currency: string;
    creditorAccount: string;
    creditorName: string;
    reference: string;
  };
  aaArtifactId?: string; // India AA specific signed artifact
  cdrArrangementId?: string; // Australia CDR specific arrangement
}

export interface FAPIHandshakeStep {
  stepNumber: number;
  title: string;
  actor: 'PSU' | 'TPP' | 'ASPSP_GATEWAY' | 'CORE_BANK';
  summary: string;
  details: string;
  endpoint?: string;
  httpMethod?: 'POST' | 'GET';
  headers?: Record<string, string>;
  requestPayload?: Record<string, any>;
  responsePayload?: Record<string, any>;
  securityControls: string[];
  fapiVerificationSummary: string[];
}

export interface BankAccount {
  accountId: string;
  accountNumber: string;
  sortCodeOrRouting: string;
  iban?: string;
  accountType: 'Personal' | 'Business';
  accountSubType: 'CurrentAccount' | 'Savings' | 'CreditCard' | 'Mortgage';
  currency: string;
  nickname: string;
  status: 'Enabled' | 'Disabled';
  balances: {
    current: number;
    available: number;
    creditLimit?: number;
    lastUpdated: string;
  };
}

export interface Transaction {
  transactionId: string;
  accountId: string;
  amount: number;
  currency: string;
  creditDebitIndicator: 'Credit' | 'Debit';
  status: 'Booked' | 'Pending';
  bookingDateTime: string;
  valueDateTime: string;
  category: 'Groceries' | 'Rent' | 'Utilities' | 'Income' | 'Dining' | 'Subscriptions' | 'Shopping' | 'Investments' | 'Transport' | 'Freelance';
  merchantName: string;
  description: string;
  mccCode?: string;
  isRecurring?: boolean;
}

export interface DomesticPayment {
  paymentId: string;
  consentId: string;
  tppId: string;
  amount: number;
  currency: string;
  debtorAccountId: string;
  creditorName: string;
  creditorAccount: string;
  status: 'AcceptedSettlementInProcess' | 'AcceptedSettlementCompleted' | 'Rejected';
  creationDateTime: string;
  statusUpdateDateTime: string;
  endToEndIdentification: string;
  fapiInteractionId: string;
}

export interface TPPServiceDefinition {
  id: string;
  number: number;
  name: string;
  category: string;
  iconName: string;
  tagline: string;
  description: string;
  realWorldExamples: string[];
  requiredScopes: string[];
  targetFrameworks: FrameworkType[];
  impactMetric: string;
  features: string[];
}

export interface GovernancePolicy {
  id: string;
  policyNumber: number;
  title: string;
  summary: string;
  rules: string[];
  enforcementMechanism: string;
  standardReference: string;
  status: 'ENFORCED' | 'MONITORING';
  metrics?: {
    label: string;
    value: string;
  };
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  interactionId: string;
  tppId: string;
  tppName: string;
  endpoint: string;
  httpStatus: number;
  framework: FrameworkType;
  ipAddress: string;
  riskScore: number;
  mTLSSuccess: boolean;
  dpopVerified: boolean;
  action: string;
}

export interface GameAchievement {
  id: string;
  title: string;
  description: string;
  xp: number;
  unlocked: boolean;
  icon: string;
  criteria: string;
}

export interface DjangoFile {
  path: string;
  description: string;
  language: 'python' | 'dockerfile' | 'yaml' | 'ini' | 'shell';
  content: string;
}
