export const OPEN_API_SPEC_V3 = {
  openapi: "3.0.3",
  info: {
    title: "Open Banking FAPI Gateway API (Django Engine)",
    version: "3.1.11",
    description: "Financial-grade Open Banking Gateway API implementing FAPI 1.0 Advanced / FAPI 2.0 Security Profiles, OAuth 2.0 Consent Lifecycle, and multi-framework support across UK OBIE, PSD2 (EU), India Account Aggregator (AA), and Australia Consumer Data Right (CDR). Built on Django 5.x REST framework.",
    contact: {
      name: "Open Banking Architecture Team - Zetheta Submission",
      email: "api-gateway@zetheta.fintech.org"
    },
    license: {
      name: "Open Banking Standard License v3.1",
      url: "https://standards.openbanking.org.uk/"
    }
  },
  servers: [
    {
      url: "https://api.gateway.royalapexbank.co.uk/open-banking/v3.1",
      description: "Production FAPI mTLS Gateway (Requires eIDAS / OBIE Client Cert)"
    },
    {
      url: "https://sandbox.gateway.royalapexbank.co.uk/open-banking/v3.1",
      description: "Developer Sandbox Environment"
    }
  ],
  paths: {
    "/oauth/v2/par": {
      post: {
        summary: "Pushed Authorization Request (PAR - RFC 9101)",
        description: "Direct server-to-server mTLS endpoint where TPP pushes signed JWT request object prior to PSU redirection.",
        operationId: "pushedAuthorizationRequest",
        security: [{ FAPI_mTLS: [] }],
        requestBody: {
          required: true,
          content: {
            "application/x-www-form-urlencoded": {
              schema: {
                type: "object",
                required: ["client_id", "response_type", "code_challenge", "code_challenge_method"],
                properties: {
                  client_id: { type: "string", example: "client_emma_prod_89a2b" },
                  response_type: { type: "string", example: "code id_token" },
                  code_challenge: { type: "string", example: "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSST-hEE" },
                  code_challenge_method: { type: "string", enum: ["S256"], example: "S256" },
                  scope: { type: "string", example: "accounts balances transactions" },
                  request: { type: "string", description: "Signed JWS Request Object (JAR)" }
                }
              }
            }
          }
        },
        responses: {
          "201": {
            description: "PAR Created. Returns request_uri for client redirect.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    request_uri: { type: "string", example: "urn:ietf:params:oauth:request_uri:9182a-bc91-2291" },
                    expires_in: { type: "integer", example: 90 }
                  }
                }
              }
            }
          },
          "400": { description: "Invalid Request / Missing PKCE S256" },
          "401": { description: "Unauthorized TPP / Invalid mTLS Client Certificate" }
        }
      }
    },
    "/oauth/v2/token": {
      post: {
        summary: "FAPI Token Endpoint with Certificate Binding (RFC 8705)",
        description: "Exchanges authorization code for access token bound to the TPP client's mTLS certificate thumbprint (cnf claim).",
        operationId: "exchangeToken",
        security: [{ FAPI_mTLS: [] }, { DPoP: [] }],
        requestBody: {
          required: true,
          content: {
            "application/x-www-form-urlencoded": {
              schema: {
                type: "object",
                required: ["grant_type", "code", "client_id", "code_verifier"],
                properties: {
                  grant_type: { type: "string", example: "authorization_code" },
                  code: { type: "string", example: "auth_code_9901824" },
                  client_id: { type: "string", example: "client_emma_prod_89a2b" },
                  code_verifier: { type: "string", example: "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk" },
                  redirect_uri: { type: "string", example: "https://app.emma-app.com/oauth/callback/fapi" }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Certificate-Bound Access Token issued successfully.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    access_token: { type: "string", example: "at_fapi_99ab71e84c90..." },
                    token_type: { type: "string", example: "Bearer" },
                    expires_in: { type: "integer", example: 3600 },
                    scope: { type: "string", example: "accounts balances transactions" },
                    cnf: {
                      type: "object",
                      properties: {
                        "x5t#S256": { type: "string", example: "e8b39c01827419aa7462bf0198aa745281928374" }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/aisp/accounts": {
      get: {
        summary: "AISP: Retrieve Authorized Account List",
        description: "Returns an array of accounts associated with the authenticated PSU and granted consent.",
        operationId: "getAccounts",
        security: [{ OAuth2BearerBound: ["accounts"] }],
        parameters: [
          { name: "x-fapi-interaction-id", in: "header", required: true, schema: { type: "string" } },
          { name: "x-fapi-auth-date", in: "header", required: false, schema: { type: "string" } },
          { name: "x-fapi-customer-ip-address", in: "header", required: false, schema: { type: "string" } }
        ],
        responses: {
          "200": {
            description: "Accounts successfully retrieved.",
            headers: {
              "x-fapi-interaction-id": { schema: { type: "string" } },
              "Sunset": { schema: { type: "string" } },
              "X-RateLimit-Remaining": { schema: { type: "integer" } }
            },
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    Data: {
                      type: "object",
                      properties: {
                        Account: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              AccountId: { type: "string", example: "acc-apex-001" },
                              Currency: { type: "string", example: "GBP" },
                              AccountType: { type: "string", example: "Personal" },
                              AccountSubType: { type: "string", example: "CurrentAccount" },
                              Nickname: { type: "string", example: "Primary Everyday Current Account" }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "401": { description: "Invalid or Unbound Access Token" },
          "403": { description: "Consent Revoked or Missing Scope" },
          "429": { description: "Rate Limit Exceeded (Token Bucket Empty)" }
        }
      }
    },
    "/aisp/accounts/{AccountId}/balances": {
      get: {
        summary: "AISP: Retrieve Real-Time Balances",
        description: "Returns InterimAvailable and ClosingBooked balances for the specified account.",
        operationId: "getAccountBalances",
        security: [{ OAuth2BearerBound: ["balances"] }],
        parameters: [
          { name: "AccountId", in: "path", required: true, schema: { type: "string" } },
          { name: "x-fapi-interaction-id", in: "header", required: true, schema: { type: "string" } }
        ],
        responses: {
          "200": {
            description: "Balances returned successfully.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    Data: {
                      type: "object",
                      properties: {
                        Balance: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              AccountId: { type: "string" },
                              Amount: {
                                type: "object",
                                properties: {
                                  Amount: { type: "string", example: "4280.50" },
                                  Currency: { type: "string", example: "GBP" }
                                }
                              },
                              CreditDebitIndicator: { type: "string", enum: ["Credit", "Debit"] },
                              Type: { type: "string", enum: ["InterimAvailable", "ClosingBooked"] }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/aisp/accounts/{AccountId}/transactions": {
      get: {
        summary: "AISP: Retrieve Categorized Transactions Ledger",
        description: "Returns ledger transactions with merchant information, category, amount, and ISO20022 bank transaction codes.",
        operationId: "getAccountTransactions",
        security: [{ OAuth2BearerBound: ["transactions"] }],
        parameters: [
          { name: "AccountId", in: "path", required: true, schema: { type: "string" } },
          { name: "fromBookingDateTime", in: "query", schema: { type: "string", format: "date-time" } },
          { name: "toBookingDateTime", in: "query", schema: { type: "string", format: "date-time" } },
          { name: "x-fapi-interaction-id", in: "header", required: true, schema: { type: "string" } }
        ],
        responses: {
          "200": {
            description: "Transactions array returned.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    Data: {
                      type: "object",
                      properties: {
                        Transaction: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              TransactionId: { type: "string" },
                              Amount: { type: "object", properties: { Amount: { type: "string" }, Currency: { type: "string" } } },
                              CreditDebitIndicator: { type: "string" },
                              Status: { type: "string" },
                              TransactionInformation: { type: "string" },
                              MerchantDetails: { type: "object", properties: { MerchantName: { type: "string" } } }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/pisp/domestic-payment-consents": {
      post: {
        summary: "PISP: Create Domestic Payment Consent Pre-Authorization",
        description: "Establishes a single immediate payment consent under UK OBIE / PSD2 specifications.",
        operationId: "createPaymentConsent",
        security: [{ FAPI_mTLS: [] }],
        parameters: [
          { name: "x-idempotency-key", in: "header", required: true, schema: { type: "string" } },
          { name: "x-fapi-interaction-id", in: "header", required: true, schema: { type: "string" } }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  Data: {
                    type: "object",
                    properties: {
                      Initiation: {
                        type: "object",
                        properties: {
                          InstructedAmount: { type: "object", properties: { Amount: { type: "string" }, Currency: { type: "string" } } },
                          CreditorAccount: { type: "object" },
                          RemittanceInformation: { type: "object" }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          "201": { description: "Payment consent created in AwaitingAuthorisation status" }
        }
      }
    },
    "/pisp/domestic-payments": {
      post: {
        summary: "PISP: Execute Domestic Immediate Payment",
        description: "Executes final payment settlement via Faster Payments System (FPS) or SEPA Instant.",
        operationId: "createDomesticPayment",
        security: [{ OAuth2BearerBound: ["payments"] }],
        parameters: [
          { name: "x-idempotency-key", in: "header", required: true, schema: { type: "string" } },
          { name: "x-fapi-interaction-id", in: "header", required: true, schema: { type: "string" } }
        ],
        responses: {
          "201": { description: "Payment accepted and settlement in process / completed" }
        }
      }
    },
    "/cbpii/funds-confirmation": {
      post: {
        summary: "CBPII: Confirmation of Funds Boolean Check",
        description: "Confirms whether the debtor account has sufficient funds for a specified amount without revealing account balance.",
        operationId: "confirmFunds",
        security: [{ OAuth2BearerBound: ["fundsconfirmations"] }],
        responses: {
          "200": {
            description: "Confirmation of funds returned.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    Data: {
                      type: "object",
                      properties: {
                        FundsAvailable: { type: "boolean", example: true }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    securitySchemes: {
      FAPI_mTLS: {
        type: "mutualTLS",
        description: "Mutual TLS authentication with Qualified eIDAS / OBIE certificate"
      },
      DPoP: {
        type: "apiKey",
        name: "DPoP",
        in: "header",
        description: "Demonstrating Proof-of-Possession (RFC 9449) JWT signature"
      },
      OAuth2BearerBound: {
        type: "oauth2",
        description: "Certificate-bound OAuth 2.0 Access Token (RFC 8705)",
        flows: {
          authorizationCode: {
            authorizationUrl: "https://api.gateway.royalapexbank.co.uk/oauth/v2/authorize",
            tokenUrl: "https://api.gateway.royalapexbank.co.uk/oauth/v2/token",
            scopes: {
              accounts: "Read account details",
              balances: "Read real-time account balances",
              transactions: "Read transaction ledger",
              payments: "Initiate domestic and international payments",
              fundsconfirmations: "Card-based confirmation of funds"
            }
          }
        }
      }
    }
  }
};
