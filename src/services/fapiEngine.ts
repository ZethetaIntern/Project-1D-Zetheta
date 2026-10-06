import { FAPIHandshakeStep, TPPProfile, ConsentRecord } from '../types/openBanking';

export function getInitialHandshakeSteps(tpp: TPPProfile): FAPIHandshakeStep[] {
  return [
    {
      stepNumber: 1,
      title: "Step 1: PSU Bank Authentication & Strong Customer Authentication (SCA)",
      actor: "PSU",
      summary: "Customer logs in securely at Royal Apex Bank ASPSP portal with credentials & MFA.",
      details: "Under PSD2 RTS and UK Open Banking, the PSU enters User ID and Password, followed by Strong Customer Authentication (Biometric prompt or SMS OTP). TPP credentials are never shared with the TPP.",
      endpoint: "https://auth.royalapexbank.co.uk/psu/login",
      httpMethod: "POST",
      securityControls: [
        "Strong Customer Authentication (SCA) - 2-Factor",
        "Direct Bank Login (Credential isolation from TPP)",
        "Session fixation protection & TLS 1.3"
      ],
      fapiVerificationSummary: [
        "PSU identity verified: Alexander Vance (psu-90821-uk)",
        "SCA challenge passed: Biometric WebAuthn FIDO2 verified",
        "Bank session established with anti-CSRF token"
      ],
      requestPayload: {
        username: "alexander.vance",
        password: "••••••••••••••••",
        sca_method: "FIDO2_WEBAUTHN",
        auth_time: Math.floor(Date.now() / 1000)
      },
      responsePayload: {
        psu_id: "psu-90821-uk",
        auth_status: "SCA_AUTHENTICATED",
        aspsp_session_id: "sess_bank_apex_89129031"
      }
    },
    {
      stepNumber: 2,
      title: "Step 2: TPP Pushed Authorization Request (PAR) & mTLS Certificate Binding",
      actor: "TPP",
      summary: "TPP initiates server-to-server mTLS request with signed JWT request object (JAR / RFC 9101).",
      details: "The TPP establishes a mutual TLS connection presenting its eIDAS QWAC or OBIE certificate. The bank gateway validates the certificate against the FCA / Open Banking Directory register, verifies the JWS signature on the request object, and issues a secure request_uri.",
      endpoint: "https://api.gateway.royalapexbank.co.uk/oauth/v2/par",
      httpMethod: "POST",
      headers: {
        "x-fapi-interaction-id": "fapi-jar-9918239-req",
        "x-fapi-customer-ip-address": "194.28.112.45",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      securityControls: [
        "Mutual TLS (mTLS) handshake with client certificate",
        "eIDAS / OBIE Directory register certificate revocation check (OCSP/CRL)",
        "Signed JWT Request Object (JAR - RFC 9101) with PS256 signature",
        "Server-to-server direct communication (No browser tamper risk)"
      ],
      fapiVerificationSummary: [
        `mTLS Certificate verified: ${tpp.certificate.issuer} (Serial: ${tpp.certificate.serialNumber})`,
        `Certificate Thumbprint SHA-256: ${tpp.certificate.thumbprint}`,
        "JAR JWT Signature: Valid (Signed by TPP Private Key, alg: PS256)",
        "PKCE code_challenge: S256 calculated & recorded"
      ],
      requestPayload: {
        client_id: tpp.clientId,
        response_type: "code id_token",
        scope: "accounts balances transactions",
        code_challenge: "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSST-hEE",
        code_challenge_method: "S256",
        request_jwt: "eyJhbGciOiJQUzI1NiIsImtpZCI6InRwcC0wMS1rZXkifQ...[SIGNED_JAR]"
      },
      responsePayload: {
        request_uri: "urn:ietf:params:oauth:request_uri:77a192b-88c9",
        expires_in: 90
      }
    },
    {
      stepNumber: 3,
      title: "Step 3: PSU Consent Authorization & JARM Authorization Code Issuance",
      actor: "ASPSP_GATEWAY",
      summary: "Customer approves explicit granular permissions; Bank issues authorization code with PKCE and signed JARM.",
      details: "The PSU reviews the explicit scopes requested by the TPP (Accounts, Balances, 90-day history). Upon explicit grant, the bank issues an authorization code, verifies the redirect URI against the TPP's pre-registered regulatory metadata, and signs the response using JARM (JWT Secured Authorization Response Mode).",
      endpoint: "https://api.gateway.royalapexbank.co.uk/oauth/v2/authorize",
      httpMethod: "GET",
      securityControls: [
        "Granular Consent Prompt (Data minimization principle)",
        "Redirect URI exact whitelist validation",
        "PKCE challenge binding to Authorization Code",
        "JARM (JWT Secured Authorization Response Mode - signed redirect)"
      ],
      fapiVerificationSummary: [
        "Redirect URI match: Whitelisted in Open Banking Directory",
        "Explicit PSU Consent stored: Status 'Authorised', 90-day expiry set",
        "Authorization Code generated: Bound to PKCE S256 challenge",
        "JARM Response Object signed by Bank Gateway Private Key"
      ],
      requestPayload: {
        client_id: tpp.clientId,
        request_uri: "urn:ietf:params:oauth:request_uri:77a192b-88c9",
        consent_decision: "APPROVE_SELECTED_ACCOUNTS"
      },
      responsePayload: {
        code: "auth_code_9901824_fapi",
        state: "state_xyz_secure_anti_tamper",
        response: "eyJhbGciOiJQUzI1NiIsImtpZCI6ImFzcHNwLWtleS0wMSJ9...[JARM_SIGNED]"
      }
    },
    {
      stepNumber: 4,
      title: "Step 4: mTLS Token Exchange & Certificate-Bound Token Generation",
      actor: "TPP",
      summary: "TPP presents authorization code + PKCE code_verifier via server-to-server mTLS token endpoint.",
      details: "The TPP authenticates directly to the token endpoint using mTLS. The bank verifies the PKCE code_verifier against the original S256 code_challenge. The gateway then issues an Access Token that is cryptographically bound to the TPP's mTLS certificate thumbprint (RFC 8705 cnf.x5t#S256).",
      endpoint: "https://api.gateway.royalapexbank.co.uk/oauth/v2/token",
      httpMethod: "POST",
      securityControls: [
        "Server-to-server mTLS token exchange",
        "PKCE S256 verification (SHA-256 of code_verifier == code_challenge)",
        "Certificate-bound access token (RFC 8705 - cnf claim)",
        "DPoP (RFC 9449) public key binding option"
      ],
      fapiVerificationSummary: [
        "PKCE Verifier verified: SHA256(verifier) matches original challenge",
        `Token bound to mTLS Certificate Thumbprint: ${tpp.certificate.thumbprint}`,
        "Sender-constrained token: Token CANNOT be used by any party without the TPP private key",
        "Access token validity: 3600 seconds (1 hour)"
      ],
      requestPayload: {
        grant_type: "authorization_code",
        code: "auth_code_9901824_fapi",
        client_id: tpp.clientId,
        code_verifier: "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk",
        redirect_uri: tpp.redirectUris[0]
      },
      responsePayload: {
        access_token: "at_fapi_certbound_88a91203bca01928374",
        token_type: "Bearer",
        expires_in: 3600,
        scope: "accounts balances transactions",
        cnf: {
          "x5t#S256": tpp.certificate.thumbprint
        }
      }
    },
    {
      stepNumber: 5,
      title: "Step 5: FAPI Gateway Token & Certificate Binding Verification",
      actor: "ASPSP_GATEWAY",
      summary: "Gateway verifies access token is valid, unexpired, matches scope, and certificate thumbprint matches mTLS.",
      details: "When the TPP calls the resource server, the API Gateway checks: (1) Is token valid and unexpired? (2) Does scope match requested endpoint? (3) Does the TLS client cert presented on the connection match the 'cnf' thumbprint inside the token? (4) Is DPoP proof valid? If an attacker steals the token, the request fails because their cert won't match!",
      endpoint: "https://api.gateway.royalapexbank.co.uk/open-banking/v3.1/aisp/accounts",
      httpMethod: "GET",
      securityControls: [
        "Sender-Constrained Token Verification (RFC 8705)",
        "mTLS connection thumbprint == Token cnf['x5t#S256']",
        "Scope enforcement (RBAC: AISP cannot call payment endpoint)",
        "Rate Limit Token Bucket deduction & Sunset Header attachment"
      ],
      fapiVerificationSummary: [
        "Token Status: Active, 3540s remaining",
        "Scope Check: 'accounts' granted in PSU consent",
        "Zero-Trust Proof: Ingress TLS cert matches token 'cnf' thumbprint",
        "Fraud / Velocity Check: Low risk (score 4/100, valid IP)"
      ],
      headers: {
        "Authorization": "Bearer at_fapi_certbound_88a91203bca01928374",
        "x-fapi-interaction-id": "fapi-int-77192830",
        "x-fapi-auth-date": new Date().toUTCString(),
        "X-RateLimit-Limit": "300",
        "X-RateLimit-Remaining": "298",
        "Sunset": "Wed, 30 Jun 2027 23:59:59 GMT"
      },
      responsePayload: {
        gateway_verdict: "AUTHORIZED_SENDER_CONFIRMED",
        http_status: 200,
        security_proof: "SENDER_CONSTRAINED_VALIDATED"
      }
    },
    {
      stepNumber: 6,
      title: "Step 6: Data Delivery & TPP Micro-Service Execution",
      actor: "CORE_BANK",
      summary: "Bank delivers encrypted banking payload; TPP executes target consumer/business service.",
      details: "The gateway routes the request to Core Banking, formats the ISO 20022 / OBIE response, records an immutable audit log entry, and delivers the data. The TPP then executes its financial service (Aggregation, Budgeting, Alternative Credit Scoring, Affordability Check, etc.).",
      endpoint: "https://api.gateway.royalapexbank.co.uk/open-banking/v3.1/aisp/accounts/acc-apex-001/transactions",
      httpMethod: "GET",
      securityControls: [
        "End-to-end TLS 1.3 encryption",
        "Immutable Regulatory Audit Trail write",
        "Data minimization filter (only requested transaction fields returned)",
        "PSU consent access counter updated"
      ],
      fapiVerificationSummary: [
        "Core banking ledger queried: 15 transactions returned",
        "Audit log entry created: ID 'audit-evt-990812' with interaction-id",
        "TPP received payload and initiated analytical service pipeline"
      ],
      responsePayload: {
        records_retrieved: 15,
        service_triggered: "Third-Party Provider Financial Intelligence Engine",
        execution_time_ms: 42
      }
    }
  ];
}
