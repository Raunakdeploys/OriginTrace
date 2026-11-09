# ORIGINTRACE — Feature Matrix

**Last Updated:** 2026-11-08T23:18:15-08:00

| ID | Requirement Category | Specific Feature | Status | Source Implementation | Test Evidence |
|---|---|---|---|---|---|
| **A1** | Module A: URL & Website | URL normalisation & canonicalisation | `implemented` | `server.ts` | Handled via `validateTargetUrl` and URL standard parsing |
| **A2** | Module A: URL & Website | Suspicious URL pattern detection | `implemented` | `server.ts` | Keyword matching, path depth, and entropy detection |
| **A3** | Module A: URL & Website | Typosquatting detection | `implemented` | `server.ts` (`analyzeTyposquatting`) | Levenshtein distance check against top financial and tech brands |
| **A4** | Module A: URL & Website | Unicode/IDN homograph indicators | `implemented` | `server.ts` (`HOMOGLYPH_MAP`) | Detects Cyrillic/Greek character substitutions and `xn--` Punycode |
| **A5** | Module A: URL & Website | Redirect-chain analysis | `implemented` | `server.ts` | SSRF-validated hop-by-hop HTTP probe with IP logging |
| **A6** | Module A: URL & Website | Domain and DNS intelligence | `implemented` | `server.ts` (`inspectDns`) | Resolves A, AAAA, MX, TXT, NS records with reverse PTR via Node `dns/promises` |
| **A7** | Module A: URL & Website | Threat-intelligence lookups | `implemented` | `src/components/Investigate.tsx` | Correlates extracted indicators against known threat classifications |
| **A8** | Module A: URL & Website | Credential-harvesting indicators | `implemented` | `server.ts` / `src/data/sampleInvestigations.ts` | Detects exfiltration endpoints, hidden iframes, and password inputs |
| **A9** | Module A: URL & Website | Suspicious embedded links | `implemented` | `server.ts` | Body and header hyperlink extraction |
| **A10** | Module A: URL & Website | Suspicious forms & elements | `implemented` | `server.ts` | DOM action target evaluation |
| **A11** | Module A: URL & Website | Public domain & IP info | `implemented` | `server.ts` | IP reverse lookups and ASN prefix mapping |
| **A12** | Module A: URL & Website | Evidence & explanation per finding | `implemented` | `src/types/investigation.ts` | Every finding features structured key-value evidence pairs |
| **B1** | Module B: TLS & Trust | Certificate expiry & validity dates | `implemented` | `server.ts` (`inspectTlsCertificate`) | Real socket handshake extracting `valid_from`, `valid_to`, remaining days |
| **B2** | Module B: TLS & Trust | Hostname and SAN validation | `implemented` | `server.ts` | Extracts Subject Alternative Names from X.509 extensions |
| **B3** | Module B: TLS & Trust | Certificate-chain analysis | `implemented` | `server.ts` | Traverses peer certificate hierarchy |
| **B4** | Module B: TLS & Trust | CA trust information | `implemented` | `server.ts` | Differentiates accredited CAs from self-signed certificates |
| **B5** | Module B: TLS & Trust | Revocation checks awareness | `implemented` | `server.ts` | OCSP / CRL responder checks |
| **B6** | Module B: TLS & Trust | Public-key strength | `implemented` | `server.ts` | Inspects RSA bit length (2048/4096) and curve algorithms |
| **B7** | Module B: TLS & Trust | Signature algorithm validation | `implemented` | `server.ts` | Validates SHA-256 with RSA/ECDSA |
| **B8** | Module B: TLS & Trust | TLS protocol configuration | `implemented` | `server.ts` | Negotiates TLS 1.3 / TLS 1.2 with cipher suites |
| **B9** | Module B: TLS & Trust | Certificate Transparency (CT) lookups | `implemented` | `server.ts` | SCT transparency extension detection |
| **B10** | Module B: TLS & Trust | Unexpected issuance indicators | `implemented` | `server.ts` | Short-lived ACME vs standard enterprise issuance |
| **B11** | Module B: TLS & Trust | Intermediate CA investigation | `implemented` | `server.ts` | Issuer CN and Organization hierarchy traversal |
| **B12** | Module B: TLS & Trust | Genuine eMudhra incident audit | `implemented` | `src/data/emudhraIncident.ts` / `src/components/EMudhraInvestigation.tsx` | 3 detailed Bugzilla cases, serial cross-referencing tool, and guidelines |
| **C1** | Module C: AI Scam Analysis | SMS, email, social message ingestion | `implemented` | `src/components/Investigate.tsx` | Accepts raw text, SMS, notification copy, and `.eml` files |
| **C2** | Module C: AI Scam Analysis | Social engineering & urgency detection | `implemented` | `server.ts` (`@google/genai`) | Detects artificial deadlines, panic, fear, coercion |
| **C3** | Module C: AI Scam Analysis | Brand/org impersonation detection | `implemented` | `server.ts` (`@google/genai`) | Identifies spoofed banks, tech platforms, government agencies |
| **C4** | Module C: AI Scam Analysis | Credential & payment requests | `implemented` | `server.ts` (`@google/genai`) | Detects requests for OTP, PIN, CVV, wire transfer, gift cards |
| **C5** | Module C: AI Scam Analysis | Indicator extraction (IOCs) | `implemented` | `server.ts` | Regex & LLM extraction of URLs, IPs, emails, phone numbers |
| **C6** | Module C: AI Scam Analysis | Actionable defense recommendations | `implemented` | `server.ts` | Generates tactical instructions for users and SOC analysts |
| **D1** | Module D: Threat Correlation | Deterministic IOC matching | `implemented` | `src/components/Investigate.tsx` | Cross-links shared IPs, domains, nameservers across cases |
| **D2** | Module D: Threat Correlation | Campaign graph relationship mapping | `implemented` | `src/components/IdentityGraph.tsx` | Identifies infrastructure reuse and actor footprints |
| **E1** | Module E: Passive Website Assessment | Security headers evaluation | `implemented` | `server.ts` | HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy |
| **E2** | Module E: Passive Website Assessment | Mixed content & redirect security | `implemented` | `server.ts` | HTTP-to-HTTPS enforcement, downgrade detection |
| **E3** | Module E: Passive Website Assessment | Passive tech fingerprinting | `implemented` | `server.ts` | Server headers, generator tags, CMS indicators (zero intrusion) |
| **F1** | Module F: Evidence & Blockchain | SHA-256 report fingerprinting | `implemented` | `server.ts` (`computeReportFingerprint`) | Canonical JSON hashing (RFC 6234) |
| **F2** | Module F: Evidence & Blockchain | Local EVM registry state | `implemented` | `server.ts` (`/api/evidence/verify`) | Verifiable on-chain state simulation on contract `0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE` |
| **F3** | Module F: Evidence & Blockchain | Tamper-evident revision audit | `implemented` | `src/components/EvidenceVault.tsx` | Cryptographic certificate generation and verification |
| **DIFF-A**| Core Differentiator | Digital Identity Graph | `implemented` | `src/components/IdentityGraph.tsx` | Interactive SVG canvas linking Brand, Domain, DNS, IP, TLS with evidence sources |
| **DIFF-B**| Core Differentiator | Trust Drift | `implemented` | `src/components/TrustDrift.tsx` | Historical snapshot diffing (DNS change, cert change, header drift) with zero fabrication |
| **DIFF-C**| Core Differentiator | Verifiable Threat Evidence | `implemented` | `src/components/EvidenceVault.tsx` | Independent cryptographic verification modal with raw JSON cert export |
| **SEC1** | Security Hardening | SSRF Protection | `implemented` | `server.ts` (`isPrivateOrReservedIP`) | Blocks 127.0.0.0/8, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, link-local, IPv6 |
