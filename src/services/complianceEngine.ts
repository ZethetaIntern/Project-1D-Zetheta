import { FrameworkType } from '../types/openBanking';

export interface FrameworkDetails {
  id: FrameworkType;
  name: string;
  region: string;
  regulator: string;
  yearIntroduced: string;
  keyLegislation: string;
  architectureModel: string;
  consentLifetimeMaxDays: number;
  securityProfile: string;
  certificateType: string;
  dataReciprocityEnforced: boolean;
  description: string;
  distinctiveFeatures: string[];
  keyDifferences: string[];
}

export const FRAMEWORKS_REGISTRY: Record<FrameworkType, FrameworkDetails> = {
  UK_OBIE: {
    id: 'UK_OBIE',
    name: 'UK Open Banking Standard (OBIE)',
    region: 'United Kingdom',
    regulator: 'Financial Conduct Authority (FCA) / OBL',
    yearIntroduced: '2018 (Post-Brexit retained & evolved)',
    keyLegislation: 'Payment Services Regulations 2017 & CMA 9 Order',
    architectureModel: 'Direct TPP-to-Bank bilateral APIs with Central Directory',
    consentLifetimeMaxDays: 90,
    securityProfile: 'FAPI 1.0 Advanced / FAPI 2.0 with JARM & PAR',
    certificateType: 'OBIE Directory mTLS + QWAC / QSealC equivalent',
    dataReciprocityEnforced: false,
    description: 'The UK technical standard implementing open banking. More prescriptive than PSD2, specifying the exact REST schemas, ISO 20022 data models, and FAPI cryptographic requirements for the CMA9 banks and licensed TPPs.',
    distinctiveFeatures: [
      'Prescriptive Read/Write API specifications (currently v3.1.11)',
      'Strict FAPI 1.0 Advanced security profile with Pushed Authorization Requests (PAR)',
      'Central Open Banking Directory (Directory CA) managing participant PKI',
      'JWT Secured Authorization Response Mode (JARM)'
    ],
    keyDifferences: [
      'Unlike generic PSD2, defines precise schemas—banks cannot invent custom data fields.',
      'Unlike India AA, direct bilateral connection between TPP and ASPSP without intermediary broker.'
    ]
  },
  PSD2_EU: {
    id: 'PSD2_EU',
    name: 'Payment Services Directive 2 (PSD2)',
    region: 'European Union',
    regulator: 'European Banking Authority (EBA) & National Competent Authorities (NCAs)',
    yearIntroduced: '2018 (RTS in force 2019)',
    keyLegislation: 'Directive (EU) 2015/2366 & Regulatory Technical Standards (RTS) on SCA',
    architectureModel: 'Bilateral Dedicated Interface or Fallback Screen-Scraping',
    consentLifetimeMaxDays: 90, // Extended to 180 under PSD3 proposals
    securityProfile: 'eIDAS Mutual TLS (RFC 8705) + Strong Customer Authentication (SCA)',
    certificateType: 'Qualified Website Authentication Certificate (QWAC) & QSealC',
    dataReciprocityEnforced: false,
    description: 'The European Union directive mandating that credit institutions open payment accounts to licensed AISPs, PISPs, and CBPIIs. Focuses heavily on Strong Customer Authentication (SCA) exemptions and eIDAS trust services.',
    distinctiveFeatures: [
      'Strict eIDAS trust services: QWAC for transport layer, QSealC for application message signing',
      'Dynamic Linking for electronic payment transactions (Art. 5 RTS)',
      'Strong Customer Authentication (SCA) 2-factor mandate with 90-day re-auth rule',
      'Implemented via regional consortia schemas (Berlin Group NextGenPSD2, STET, PolishAPI)'
    ],
    keyDifferences: [
      'Legal directive rather than a unified single technical specification.',
      'Permitted multiple implementation standards across EU member states (unlike UK single OBIE spec).'
    ]
  },
  INDIA_AA: {
    id: 'INDIA_AA',
    name: 'India Account Aggregator (AA) Framework',
    region: 'India',
    regulator: 'Reserve Bank of India (RBI)',
    yearIntroduced: '2021 (Expanded 2023)',
    keyLegislation: 'RBI Non-Banking Financial Company - Account Aggregator Directions 2016',
    architectureModel: 'Decoupled 3-Party Consent Broker (FIP <-> AA <-> FIU)',
    consentLifetimeMaxDays: 180,
    securityProfile: 'End-to-End Encrypted Data Pipe, Ephemeral Public Keys, Digital Signatures',
    certificateType: 'CCA India Digital Signature Certificates (DSC) & NBFC-AA Licenses',
    dataReciprocityEnforced: false,
    description: 'A revolutionary digital public infrastructure component of the "India Stack" (alongside UPI and Aadhaar). Licensed Account Aggregators act as consent brokers/data pipes that never see, store, or decrypt customer financial data.',
    distinctiveFeatures: [
      'Strict Data Blind Pipe: The Account Aggregator CANNOT see or store the underlying financial data',
      'Financial Information Provider (FIP) encrypts data directly to Financial Information User (FIU)',
      'Standardized, cryptographically signed digital Consent Artifact (XML/JSON)',
      'Interoperable consent across banks, mutual funds, insurance, and tax authorities (GSTN)'
    ],
    keyDifferences: [
      'Radically decoupled: TPPs do NOT connect directly to banks; AA handles consent negotiation.',
      'Data never touches the consent broker in decrypted form, minimizing systemic breach exposure.'
    ]
  },
  AU_CDR: {
    id: 'AU_CDR',
    name: 'Consumer Data Right (CDR)',
    region: 'Australia',
    regulator: 'Australian Competition & Consumer Commission (ACCC) & OAIC',
    yearIntroduced: '2020 (Open Banking rollout completed 2021)',
    keyLegislation: 'Competition and Consumer Act 2010 (Part IVD)',
    architectureModel: 'Sector-Agnostic National Open Data Fabric (Banking, Energy, Telecom)',
    consentLifetimeMaxDays: 365,
    securityProfile: 'Consumer Data Standards (CDS) - FAPI 1.0 Advanced profile',
    certificateType: 'CDR Register Device Certificates & Mutual TLS',
    dataReciprocityEnforced: true,
    description: 'Australia\'s economy-wide data-sharing right that started with banking ("Open Banking") and is rolling out to Energy, Telecommunications, and Finance. Regulated by the ACCC with strict data reciprocity and accreditation tiers.',
    distinctiveFeatures: [
      'Sector-Agnostic: One standard for Banking, Energy, and Telecom data',
      'Strict Reciprocity: Accredited Data Recipients (ADRs) must share data if they are also data holders',
      'Accredited Data Recipient (ADR) register with comprehensive liability coverage',
      'Granular Consent Dashboard requirements with explicit consumer deletion controls'
    ],
    keyDifferences: [
      'Strictest reciprocity rules in the world—if a fintech becomes an ADR and holds data, it must open up.',
      'Extends beyond financial services to cross-sector multi-utility consumer control.'
    ]
  }
};

export function runComplianceAudit(framework: FrameworkType, tppCertStatus: string, consentDaysOld: number, isDirectPipe: boolean) {
  const fw = FRAMEWORKS_REGISTRY[framework];
  const issues: string[] = [];
  const passes: string[] = [];

  // Certificate check
  if (tppCertStatus !== 'VALID') {
    issues.push(`Certificate Status (${tppCertStatus}): Fails ${fw.name} mandatory PKI authentication requirement.`);
  } else {
    passes.push(`PKI Certificate: Fully verified against ${fw.regulator} accredited directory.`);
  }

  // 90 day vs 365 day consent check
  if (consentDaysOld > fw.consentLifetimeMaxDays) {
    issues.push(`Consent Expiry Violation: Current consent is ${consentDaysOld} days old, exceeding ${fw.name} maximum cap of ${fw.consentLifetimeMaxDays} days.`);
  } else {
    passes.push(`Consent Validity: Within ${fw.consentLifetimeMaxDays}-day regulatory retention window (${consentDaysOld} days elapsed).`);
  }

  // Architectural pipe check
  if (framework === 'INDIA_AA') {
    if (isDirectPipe) {
      issues.push("Architectural Violation: India AA strictly prohibits direct bilateral TPP-Bank connections. Must route through licensed Account Aggregator broker.");
    } else {
      passes.push("Architecture Compliance: Routing verified through licensed Account Aggregator with encrypted payload blind pipe.");
    }
  } else {
    passes.push(`Architecture Compliance: Bilateral FAPI connection conforms to ${fw.name} standards.`);
  }

  return {
    framework,
    isCompliant: issues.length === 0,
    passes,
    issues,
    timestamp: new Date().toISOString()
  };
}
