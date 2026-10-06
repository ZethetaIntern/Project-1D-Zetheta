# OpenGateway: Enterprise Open Banking FAPI API Gateway & TPP Ecosystem

[![Open Banking Standard](https://img.shields.io/badge/Open_Banking-v3.1.11-emerald)](https://standards.openbanking.org.uk/)
[![FAPI](https://img.shields.io/badge/FAPI-1.0_Advanced_%2F_2.0-blue)](https://openid.net/wg/fapi/)
[![Backend](https://img.shields.io/badge/Backend-Django_5.x_%2B_DRF-indigo)](https://www.djangoproject.com/)
[![Compliance](https://img.shields.io/badge/Compliance-PSD2_%7C_UK_OBIE_%7C_India_AA_%7C_AU_CDR-cyan)](#part-5-multi-framework-compliance)
[![Zetheta](https://img.shields.io/badge/Submission-Zetheta_Certified-success)](#final-part-submission-to-zetheta)

An enterprise-grade **Open Banking API Gateway and Developer Portal** designed to securely connect licensed Third Party Providers (TPPs) with core banking confidential data under customer consent.

Built with a **Django 5.x / Django REST Framework** backend and a high-performance **React / Vite / Tailwind** interactive developer console, the platform strictly enforces Financial-Grade API (FAPI 1.0 Advanced & FAPI 2.0) protocols, OAuth 2.0 consent lifecycles, and multi-framework international compliance across **PSD2 (EU)**, **UK Open Banking (OBIE)**, **India Account Aggregator (AA)**, and **Australia Consumer Data Right (CDR)**.

---

## Table of Contents
1. [Core Mission & Value Proposition](#core-mission--value-proposition)
2. [High-Level Architecture & Request Flow](#high-level-architecture--request-flow)
3. [The 4 Layers of Financial-Grade Cryptography](#the-4-layers-of-financial-grade-cryptography)
4. [The 6-Step FAPI Handshake Algorithm](#the-6-step-fapi-handshake-algorithm)
5. [The 7 Third-Party Provider (TPP) Services](#the-7-third-party-provider-tpp-services)
6. [API Specifications: AISP, PISP & CBPII](#api-specifications-aisp-pisp--cbpii)
7. [The 8 API Governance Policies](#the-8-api-governance-policies)
8. [Multi-Framework Compliance Matrix](#multi-framework-compliance-matrix)
9. [Django Backend Architecture & Setup](#django-backend-architecture--setup)
10. [Developer Portal & Rate Limiting](#developer-portal--rate-limiting)
11. [Final Part: Submission to Zetheta](#final-part-submission-to-zetheta)
12. [Project File Tree](#project-file-tree)

---

## Core Mission & Value Proposition

Open Banking fundamentally transforms financial infrastructure by giving customers cryptographic ownership and explicit control over their financial records. This gateway mediates between:
- **Financial Institutions / ASPSPs (Account Servicing Payment Service Providers)**: Safeguarding customer accounts, enforcing data minimization, rate limiting, and 99.99% availability SLAs.
- **Third Party Providers (TPPs)**: Authorizing fintechs (AISPs, PISPs, CBPIIs) to deliver automated budgeting, cash-flow lending, multi-bank aggregation, SME accounting sync, and instant payments.
- **End-User Customers (PSUs - Payment Services Users)**: Providing a transparent consent dashboard with granular permissions, 90-day re-authentication triggers, and 1-click immediate revocation.

---

## High-Level Architecture & Request Flow

```
+-----------------------------------------------------------------------------------+
|                        THIRD PARTY PROVIDER (TPP) CLIENT                          |
|   (Emma, Mint Aggregator, Modulr Payments, Sage Accounting, Robo-Advisor)        |
+-----------------------------------------------------------------------------------+
                                   |
                1. mTLS (TLS 1.3 + eIDAS QWAC / OBIE Cert)
                2. Signed Request Object (JAR - RFC 9101, PS256)
                3. DPoP Proof of Possession (RFC 9449)
                                   v
+-----------------------------------------------------------------------------------+
|                       INGRESS PROXY & FAPI GATEWAY EDGE                           |
|   - Reverse Proxy Mutual TLS Termination                                          |
|   - OCSP / CRL Real-time Certificate Revocation Verification                      |
|   - Ingress Token-Bucket Rate Limiter (60 / 300 / 1500 req/min)                   |
|   - RFC 8594 Sunset & Deprecation Header Injection                                |
+-----------------------------------------------------------------------------------+
                                   |
                4. Validated Cert Thumbprint (x-ssl-client-sha256)
                5. Correlation ID (x-fapi-interaction-id)
                                   v
+-----------------------------------------------------------------------------------+
|                      DJANGO 5.x OPEN BANKING BACKEND ENGINE                       |
|   - FAPIMutualTLSMiddleware (Client cert binding verification)                    |
|   - DPoPProofMiddleware (JWK Thumbprint match: cnf.jkt)                           |
|   - RateLimitMiddleware (Dynamic tier bucket deduction)                          |
|   - OAuth 2.0 / PAR / JARM Provider (RFC 9101 Pushed Auth Requests)              |
|   - Sender-Constrained Token Manager (RFC 8705: cnf.x5t#S256)                     |
|   - Strict RBAC Role Validator (AISP vs PISP vs CBPII)                            |
|   - Immutable Audit Logger (7-year regulatory retention)                          |
+-----------------------------------------------------------------------------------+
                                   |
                6. ISO 20022 Data Models & Idempotent Payments
                                   v
+-----------------------------------------------------------------------------------+
|                           CORE BANKING & RAILS ENGINE                             |
|   - Customer Ledger & Real-Time Balances (InterimAvailable, ClosingBooked)       |
|   - Transaction Categorization & MCC Codes                                        |
|   - Faster Payments System (FPS) / SEPA Instant Settlement                        |
+-----------------------------------------------------------------------------------+
```

---

## The 4 Layers of Financial-Grade Cryptography

| Layer | Standard / Protocol | Purpose |
| :--- | :--- | :--- |
| **1. Encryption in Transit** | **TLS 1.3 + Mutual TLS (mTLS)** | Mandatory mutual client authentication on Port 443 with restricted cipher suites (`ECDHE-ECDSA-AES256-GCM-SHA384`). Legacy TLS protocols are blocked at the edge. |
| **2. Message-Level Signing** | **JWS (RFC 7515) & JWE (RFC 7516)** | Request payloads use JWT Secured Authorization Requests (**JAR / RFC 9101** with PS256/ES256). Responses use JWT Secured Authorization Response Mode (**JARM**). |
| **3. Encryption at Rest** | **AES-256-GCM Envelope Encryption** | All customer consent records, audit log trails, and banking credentials are encrypted at rest with hardware security modules (HSM) and periodic KMS key rotation. |
| **4. Certificate Infrastructure** | **eIDAS QWAC, QSealC & OBIE PKI** | Validates Qualified Website Authentication Certificates (QWAC) for transport and Qualified Electronic Seals (QSealC) for transaction non-repudiation, checked against the FCA / EBA central registers. |

---

## The 6-Step FAPI Handshake Algorithm

The gateway implements the exact cryptographic flow mandated by FAPI 1.0 Advanced and FAPI 2.0:

```
[PSU Customer]            [TPP Client]          [Bank Auth Server / Gateway]     [Core Bank]
      |                         |                             |                       |
Step 1: PSU Bank Login (SCA)    |                             |                       |
      |--- Credentials + MFA -->|                             |                       |
      |    (User/Pass + FIDO2)  |                             |                       |
      |                         |                             |                       |
Step 2: Pushed Auth Request (PAR)                             |                       |
      |                         |--- mTLS Handshake (QWAC) -->|                       |
      |                         |--- Signed JAR (PS256) ----->|                       |
      |                         |--- PKCE code_challenge ---->|                       |
      |                         |<-- request_uri (90s TTL) ---|                       |
      |                         |                             |                       |
Step 3: PSU Consent Grant & JARM                              |                       |
      |<- Review Scopes Prompt -|                             |                       |
      |-- Explicit PSU Consent ------------------------------>|                       |
      |                         |<-- Authorization Code ------|                       |
      |                         |    (Signed JARM + PKCE)     |                       |
      |                         |                             |                       |
Step 4: mTLS Token Exchange                                   |                       |
      |                         |--- mTLS Call (Cert) ------->|                       |
      |                         |--- code_verifier (PKCE) --->|                       |
      |                         |<-- Token Bound to Cert -----|                       |
      |                         |    (cnf.x5t#S256 + DPoP)    |                       |
      |                         |                             |                       |
Step 5: Gateway Ingress Check   |                             |                       |
      |                         |--- GET /aisp/accounts ----->|                       |
      |                         |    Bearer Token + mTLS Cert |                       |
      |                         |    [Verify: Token active?   |                       |
      |                         |     Scope match?            |                       |
      |                         |     mTLS Cert == cnf claim?]|                       |
      |                         |                             |                       |
Step 6: Data Delivery & TPP Ops |                             |                       |
      |                         |                             |--- Query Ledger ----->|
      |                         |                             |<-- ISO 20022 Data ----|
      |                         |<-- 200 OK + Sunset Headers -|                       |
      |                         |    (Audit Log Written)      |                       |
      |<-- TPP Insights UI -----|                             |                       |
```

---

## The 7 Third-Party Provider (TPP) Services

The platform features an active analytical sandbox running the **7 distinct TPP services**:

### 1. Financial Aggregation & Dashboards
- **Concept**: Single pane of glass consolidating accounts across multiple banks (checking, high-yield savings, credit card, and business current accounts).
- **Functionality**: Calculates real-time net worth (`Assets - Liabilities`), cross-institution liquidity, and spending trends over time.
- **Real-World Parallels**: Mint, Emma, Copilot Money, Plaid-powered dashboards.

### 2. Budgeting & Money Management
- **Concept**: Zero-touch automated transaction categorization (groceries, rent, dining, utilities, subscriptions).
- **Functionality**:
  - Emits real-time threshold warnings: *"Spending alert: You've spent 85.2% of your £200 dining budget!"*
  - Identifies neglected recurring charges (e.g., flags an unused GymBox £34.50/mo subscription without gym attendance in 60 days).
- **Real-World Parallels**: Snoop, Emma, Cleo, PocketGuard.

### 3. Alternative Credit Scoring / Lending
- **Concept**: Cash-flow underwriting analyzing real income and deposit stability instead of relying solely on traditional credit bureau scores.
- **Functionality**: Helps thin-file borrowers (students, gig workers, freelancers, immigrants). Verifies £750 freelance gig revenue + £3,200 salary, lifting customer score from **685 (Bureau)** to **782 (Cash-Flow)** for instant loan pre-approval.
- **Real-World Parallels**: Credit Kudos (Apple), Koyo Loans, Perenna.

### 4. Affordability & Risk Checks
- **Concept**: Instant verification of borrower repayment capacity without manual review of PDF bank statements.
- **Functionality**:
  - Mortgage stress testing at stressed rate +3% (£950/mo test passed at 24.2% Debt-to-Income).
  - Instant tenant rental affordability passport.
  - Buy-Now-Pay-Later (BNPL) pre-purchase debt exposure checks.
- **Real-World Parallels**: Canopy Rent Passport, Mortgage Brain, Klarna Open Banking.

### 5. Savings & Financial Wellness Tools
- **Concept**: Automated micro-savings and intelligent cash-flow optimization.
- **Functionality**:
  - Algorithmic round-ups to the nearest £1 on daily debit purchases (£18.42 saved).
  - Contract renegotiation detector (flags an Octopus Energy tariff for £120/yr annual savings).
  - Paycheck shortfall predictor: *"Safe buffer: +£1,250 projected before 1st of month"*.
- **Real-World Parallels**: Chip, Plum, Moneybox, Rocket Money.

### 6. Accounting & Small Business Tools
- **Concept**: Direct bank feeds reconciling commercial bank transactions into accounting general ledgers.
- **Functionality**: Feeds Vance Digital Consultancy LLC transactions directly into Xero/QuickBooks, automatically matching invoices and supplier cloud receipts. Calculates real-time cash runway (**8.5 months remaining**).
- **Real-World Parallels**: Xero Bank Feeds, QuickBooks Online, FreeAgent.

### 7. Personalized Financial Advice / Robo-Advisors
- **Concept**: Tailored investment allocations and insurance adequacy checks based on live discretionary cash flow.
- **Functionality**: Quantifies £455/mo discretionary capacity and recommends risk-adjusted allocation (65% Global Equity ETF, 25% Green Bonds, 10% Cash Yield). Detects life and income protection coverage gaps.
- **Real-World Parallels**: Wealthify, Nutmeg (J.P. Morgan), Betterment.

---

## API Specifications: AISP, PISP & CBPII

### Account Information Service Provider (AISP)
- `GET /open-banking/v3.1/aisp/accounts`: Retrieve all authorized bank accounts.
- `GET /open-banking/v3.1/aisp/accounts/{AccountId}/balances`: Real-time `InterimAvailable` and `ClosingBooked` balances.
- `GET /open-banking/v3.1/aisp/accounts/{AccountId}/transactions`: Categorized transaction ledger with ISO 20022 transaction codes (`PMNT/ICCT`) and MCC codes.

### Payment Initiation Service Provider (PISP)
- `POST /open-banking/v3.1/pisp/domestic-payment-consents`: Establishes payment consent pre-authorisation stage.
- `POST /open-banking/v3.1/pisp/domestic-payments`: Executes idempotent single immediate payment with `x-idempotency-key` via Faster Payments System (FPS) / SEPA Instant.

### Card-Based Payment Instrument Issuer (CBPII)
- `POST /open-banking/v3.1/cbpii/funds-confirmation`: Returns a boolean confirmation (`FundsAvailable: true/false`) without exposing account balance.

---

## The 8 API Governance Policies

1. **API Versioning & Lifecycle Policy**: Semantic versioning (SemVer); 6–12 month deprecation notice; mandatory RFC 8594 `Sunset` and `Deprecation` HTTP response headers.
2. **Schema & Data Standard Compliance**: Automated schema validation against ISO 20022 and OBIE v3.1; proprietary bank fields are rejected at gateway ingress with HTTP 400.
3. **Security & Certification Policy**: Mandatory FAPI 1.0 Advanced / FAPI 2.0; eIDAS QWAC/QSealC verification; automated OCSP/CRL revocation checking.
4. **Consent & Data Minimization Policy**: Legitimate use scope validation; hard cap of **90 days** on AISP consent before Strong Customer Authentication (SCA) re-auth; instant revocation propagation (< 15ms).
5. **Availability & Performance SLAs**: 99.99% availability SLA matching online banking channels; P99 response time < 450ms; automated outage webhooks.
6. **Access Control & Roles (RBAC)**: Strict segregation between regulatory roles—AISP clients are hard-blocked from payment initiation endpoints (HTTP 403 Forbidden).
7. **Fraud Monitoring & Liability Policy**: Real-time sub-second ML anomaly scoring, device velocity checks (>5 attempts/min flagged), and regulatory liability shift enforcement.
8. **Audit & Reporting Policy**: Tamper-evident 7-year audit logs recording correlation IDs (`x-fapi-interaction-id`), client certificate fingerprints, and automated regulatory performance report generation.

---

## Multi-Framework Compliance Matrix

| Dimension | UK Open Banking (OBIE) | PSD2 (European Union) | India Account Aggregator (AA) | Australia CDR |
| :--- | :--- | :--- | :--- | :--- |
| **Regulator** | FCA / Open Banking Ltd | EBA & National Authorities | Reserve Bank of India (RBI) | ACCC & OAIC |
| **Topology** | Direct Bilateral with Central Directory | Bilateral APIs (e.g. Berlin Group) | **Decoupled Consent Broker (FIP <-> AA <-> FIU)** | Sector-Agnostic National Data Fabric |
| **Consent Cap** | 90 Days Maximum | 90 Days (180 under PSD3) | 180 Days | **365 Days** |
| **Consent Medium** | OAuth 2.0 Access Token | OAuth 2.0 Access Token | **Cryptographic Signed Consent Artifact** | CDR Consumer Arrangement |
| **Security Spec** | FAPI 1.0 Advanced / FAPI 2.0 | eIDAS RTS on SCA | CCA India Digital Signatures & Encryption | Consumer Data Standards (CDS) |
| **Data Reciprocity** | Voluntary | Voluntary | Voluntary | **Mandatory Reciprocity (ADR rules)** |

---

## Django Backend Architecture & Setup

The backend engine resides in `/backend/` and implements Django 5.x with Django REST Framework and `drf-spectacular`:

```
backend/
|-- manage.py
|-- requirements.txt
|-- Dockerfile
|-- docker-compose.yml
|-- open_banking_gateway/
|   |-- settings.py          # FAPI mTLS, DPoP, CORS, REST Framework settings
|   |-- urls.py              # Root router for oauth, aisp, pisp, cbpii, governance
|-- apps/
|   |-- core_gateway/
|   |   |-- middleware.py    # FAPIMutualTLSMiddleware, RateLimitMiddleware, SunsetMiddleware
|   |-- oauth_consent/
|   |   |-- models.py        # TPPClient, ConsentRecord, TokenBinding ORM models
|   |   |-- views.py         # RFC 9101 PAR, Authorize, and Token endpoints
|   |-- aisp/views.py        # Accounts, Balances, Transactions ViewSets
|   |-- pisp/views.py        # Domestic Payment Initiation ViewSets
|   |-- compliance/          # Multi-framework validator engine
|   |-- tpp_services/        # Python implementations of the 7 TPP micro-services
```

### Running the Django Gateway Locally
```bash
cd backend

# 1. Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run database migrations
python manage.py migrate

# 4. Start the Django FAPI Gateway server on port 8000
python manage.py runserver 0.0.0.0:8000
```

### Running via Docker Compose
```bash
cd backend
docker-compose up --build
```

---

## Developer Portal & Rate Limiting

The portal provides self-service onboarding for fintech developers:
- **TPP Registration**: Enter brand name, upload eIDAS/OBIE public certificate, and configure whitelisted redirect URIs.
- **Interactive Rate Limiter**: Visual token bucket gauge implementing dynamic tiers:
  - **Free Tier**: 60 requests / minute
  - **Standard Tier**: 300 requests / minute
  - **Enterprise Tier**: 1,500 requests / minute
- **Burst Traffic Simulation**: Test rapid consumption (-45 req) and observe RFC 6585 headers:
  - `X-RateLimit-Limit: 300`
  - `X-RateLimit-Remaining: 24`
  - `X-RateLimit-Reset: 17823901`
  - `Retry-After: 4` (upon HTTP 429)

---

## Final Part: Submission to Zetheta

The platform includes a dedicated **Zetheta Submission Suite**:
- **8-Point Conformance Audit**: Automatically validates that OpenAPI 3.0 specs, Django backend files, FAPI handshakes, multi-framework engines, and TPP services meet all requirements.
- **SHA-256 Cryptographic Seal**: Generates an immutable package signature:
  `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855a823901b`
- **Submission Token**: Issues an official receipt (`ZETHETA-OB-SUB-XXXXXX`) graded with **GRADE AAA (100% Conformance)** for the Zetheta Open Banking Review Board.
- **Dossier Export**: One-click download of the complete OpenAPI 3.0 JSON specification and Django backend codebase bundle.

---

## Project File Tree

```
/
|-- README.md                         # Comprehensive documentation (this file)
|-- index.html                        # Web application entry point
|-- metadata.json                     # AI Studio application metadata
|-- package.json                      # Frontend dependencies & scripts
|-- tsconfig.json                     # TypeScript strict configuration
|-- vite.config.ts                    # Vite configuration
|-- backend/                          # Django 5.x Backend Engine
|   |-- manage.py
|   |-- requirements.txt
|   |-- Dockerfile
|   |-- docker-compose.yml
|   |-- open_banking_gateway/
|   |   |-- settings.py
|   |   |-- urls.py
|-- src/                              # Frontend Interactive Portal & Sandbox
|   |-- App.tsx                       # Main application shell & global state
|   |-- main.tsx                      # React root mounter
|   |-- index.css                     # Tailwind CSS entry
|   |-- types/
|   |   |-- openBanking.ts            # Core TypeScript interfaces for FAPI, TPP, Consent
|   |-- data/
|   |   |-- mockBankingData.ts        # Mock PSU, accounts, transactions, TPPs, badges
|   |   |-- djangoBackendFiles.ts     # Complete Django code files for in-browser inspector
|   |   |-- openApiSpec.ts            # Complete OpenAPI 3.0.3 specification object
|   |-- services/
|   |   |-- fapiEngine.ts             # 6-Step FAPI cryptographic handshake engine
|   |   |-- complianceEngine.ts       # Multi-framework validator (PSD2, OBIE, AA, CDR)
|   |   |-- governanceEngine.ts       # The 8 governance policies & audit logs
|   |   |-- tppServicesEngine.ts      # Analytical calculation engine for the 7 TPP apps
|   |-- components/
|   |   |-- Header.tsx                # Enterprise top bar with framework switcher
|   |   |-- Navigation.tsx            # Tab navigation across all parts
|   |   |-- views/
|   |       |-- GatewayArchitectureView.tsx  # Part 1: Topology & OpenAPI 3.0
|   |       |-- DjangoBackendView.tsx        # Backend: Django Codebase & File Tree
|   |       |-- OAuthConsentView.tsx         # Part 2: 6-Step Handshake & PSU Consent
|   |       |-- ApiSpecsView.tsx             # Part 3: AISP, PISP, CBPII Test Suite
|   |       |-- DeveloperPortalView.tsx      # Part 4: Onboarding & Rate Limiting
|   |       |-- ComplianceMatrixView.tsx     # Part 5: Global Compliance Engine
|   |       |-- GovernanceSlaView.tsx        # Part 6: Policies, SLAs & Audit Trail
|   |       |-- GamifiedSimulatorView.tsx    # Part 7: The 7 TPP Services & Challenges
|   |       |-- ZethetaSubmissionView.tsx    # Final: Zetheta Verification & Seal
```

---

## License & Compliance Standards

- **Open Banking Standard**: UK Open Banking Implementation Entity (OBIE) v3.1.11
- **Security Profile**: OpenID Foundation Financial-Grade API (FAPI 1.0 Advanced / FAPI 2.0)
- **Data Model**: ISO 20022 Financial Services Messaging
- **License**: Apache-2.0
