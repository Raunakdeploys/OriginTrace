# ORIGINTRACE — Feature Matrix

**Last Updated:** 2026-11-09T01:58:00-08:00  
**Specification:** Aligned with `ORIGINTRACE_Execution_Blueprint.md` (Modules 1–6, Differentiators A–C, SSRF & Evidence)

| ID | Module / Requirement | Specific Feature | Status | Source Implementation | Test Evidence / Verification | Limitations & Caveats |
|---|---|---|---|---|---|---|
| **A1** | Module 1: URL & Website | URL normalization & canonicalization | `IMPLEMENTED` | `server.ts` (`validateTargetUrl`) | Tested via `/api/investigate/url` | Resolves standard HTTP/HTTPS schemes only |
| **A2** | Module 1: URL & Website | Suspicious URL pattern detection | `IMPLEMENTED` | `server.ts` | Keyword matching, path depth, token scoring | Heuristic scoring, requires multi-factor correlation |
| **A3** | Module 1: URL & Website | Typosquatting detection | `IMPLEMENTED` | `server.ts` (`analyzeTyposquatting`) | Levenshtein distance check against financial & tech brands | Brand dictionary checks; does not evaluate unregistered trademark terms |
| **A4** | Module 1: URL & Website | Unicode/IDN homograph & Punycode | `IMPLEMENTED` | `server.ts` (`HOMOGLYPH_MAP`) | Cyrillic/Greek lookalike & `xn--` detection | Evaluates visual confusables against Latin scripts |
| **A5** | Module 1: URL & Website | Redirect-chain analysis | `IMPLEMENTED` | `server.ts` | SSRF-validated hop-by-hop HTTP probe with IP logging | Bounded at 5 hops, 8s connection timeout, 2MB payload cap |
| **A6** | Module 1: URL & Website | Domain and DNS intelligence | `IMPLEMENTED` | `server.ts` (`inspectDns`) | Resolves A, AAAA, MX, TXT, NS records with PTR | Subject to upstream resolver responsiveness |
| **A7** | Module 1: URL & Website | Threat-intelligence lookups | `IMPLEMENTED` | `server.ts` / `src/components/Investigate.jsx` | Correlates extracted indicators against VT & GSB | Requires active API connectivity; falls back to heuristics |
| **A8** | Module 1: URL & Website | Credential-harvesting indicators | `IMPLEMENTED` | `server.ts` / `src/data/sampleInvestigations.js` | Detects exfiltration endpoints, hidden iframes, password inputs | Static passive analysis; no arbitrary JS execution |
| **A9** | Module 1: URL & Website | Suspicious embedded links | `IMPLEMENTED` | `server.ts` | Body and header hyperlink extraction | Extracts passive links without crawling deep targets |
| **A10**| Module 1: URL & Website | Suspicious forms & elements | `IMPLEMENTED` | `server.ts` | DOM action target evaluation | Does not submit credentials or interact with dynamic DOM |
| **A11**| Module 1: URL & Website | Public domain & IP info | `IMPLEMENTED` | `server.ts` | IP reverse lookups and ASN prefix mapping | Dependent on standard DNS PTR availability |
| **A12**| Module 1: URL & Website | Evidence & explanation per finding | `IMPLEMENTED` | `src/types/investigation.ts` | Structured key-value evidence pairs on every check | Every check includes source engine and observation time |
| **B1** | Module 2: TLS & Trust | Certificate expiry & validity dates | `IMPLEMENTED` | `server.ts` (`inspectTlsCertificate`) | Real socket handshake extracting `valid_from`, `valid_to` | Evaluates target host socket directly |
| **B2** | Module 2: TLS & Trust | Hostname and SAN validation | `IMPLEMENTED` | `server.ts` | Subject Alternative Names from X.509 extensions | Compares requested hostname against SAN list |
| **B3** | Module 2: TLS & Trust | Certificate-chain analysis | `IMPLEMENTED` | `server.ts` | Traverses peer certificate hierarchy | Relies on server-provided certificate chain |
| **B4** | Module 2: TLS & Trust | CA trust information | `IMPLEMENTED` | `server.ts` | Differentiates accredited CAs from self-signed | Issuer name alone does NOT prove maliciousness |
| **B5** | Module 2: TLS & Trust | Revocation checks awareness | `IMPLEMENTED` | `server.ts` | OCSP / CRL responder checks | Reports unknown if OCSP/CRL responder is unreachable |
| **B6** | Module 2: TLS & Trust | Public-key strength | `IMPLEMENTED` | `server.ts` | Inspects RSA bit length (2048/4096) and curve algorithms | Evaluates leaf certificate public key parameters |
| **B7** | Module 2: TLS & Trust | Signature algorithm validation | `IMPLEMENTED` | `server.ts` | Validates SHA-256 with RSA/ECDSA | Flags obsolete MD5/SHA-1 signatures |
| **B8** | Module 2: TLS & Trust | TLS protocol configuration | `IMPLEMENTED` | `server.ts` | Negotiates TLS 1.3 / TLS 1.2 with cipher suites | Handshake parameters recorded in check evidence |
| **B9** | Module 2: TLS & Trust | Certificate Transparency (CT) | `IMPLEMENTED` | `server.ts` | SCT transparency extension detection | Identifies presence of embedded SCTs |
| **B10**| Module 2: TLS & Trust | Unexpected issuance indicators | `IMPLEMENTED` | `server.ts` | Short-lived ACME vs standard enterprise issuance | Issuance velocity indicator, not proof of malice |
| **B11**| Module 2: TLS & Trust | Intermediate CA investigation | `IMPLEMENTED` | `server.ts` | Issuer CN and Organization hierarchy traversal | Distinguishes intermediate CAs from leaf certificates |
| **B12**| Module 2: TLS & Trust | Genuine eMudhra incident audit | `IMPLEMENTED` | `src/data/emudhraIncident.js` / `src/components/EMudhraInvestigation.jsx` | 3 detailed Bugzilla cases, serial cross-referencing tool | Uses authentic Bugzilla/Chrome records; limitations disclosed |
| **C1** | Module 3: AI Scam Analysis | SMS, email, message ingestion | `IMPLEMENTED` | `src/components/Investigate.jsx` | Accepts raw text, SMS, notifications, and `.eml` uploads | Treated as untrusted data; prompt-injection guarded |
| **C2** | Module 3: AI Scam Analysis | Urgency & psychological coercion | `IMPLEMENTED` | `server.ts` (`@google/genai`) | Detects artificial deadlines, fear, panic, account threats | AI explanation supplemented with deterministic rules |
| **C3** | Module 3: AI Scam Analysis | Brand/org impersonation detection | `IMPLEMENTED` | `server.ts` (`@google/genai`) | Identifies spoofed banks, tech platforms, agencies | Cites specific linguistic spans in evidence |
| **C4** | Module 3: AI Scam Analysis | Credential & payment requests | `IMPLEMENTED` | `server.ts` (`@google/genai`) | Detects requests for OTP, PIN, passwords, wire, crypto | Categorizes fraud vectors |
| **C5** | Module 3: AI Scam Analysis | Indicator extraction (IOCs) | `IMPLEMENTED` | `server.ts` | Regex & LLM extraction of URLs, IPs, emails, phone numbers | Normalized into standard indicator objects |
| **C6** | Module 3: AI Scam Analysis | Actionable defense recommendations | `IMPLEMENTED` | `server.ts` | Generates tactical instructions for users and SOC analysts | Safe next steps without engaging the attacker |
| **D1** | Module 4: Threat Correlation | Deterministic IOC matching | `IMPLEMENTED` | `src/components/Investigate.jsx` | Cross-links shared IPs, domains, nameservers across cases | Exact indicator match; no fabricated relationships |
| **D2** | Module 4: Threat Correlation | Campaign graph relationship mapping | `IMPLEMENTED` | `src/components/IdentityGraph.jsx` | Identifies infrastructure reuse and actor footprints | Edges carry basis: direct observation vs heuristic |
| **E1** | Module 5: Passive Web Assessment| Security headers evaluation | `IMPLEMENTED` | `server.ts` | HSTS, CSP, X-Frame-Options, X-Content-Type-Options | Passive inspection only; no intrusive probes |
| **E2** | Module 5: Passive Web Assessment| Mixed content & redirect security | `IMPLEMENTED` | `server.ts` | HTTP-to-HTTPS enforcement, downgrade detection | Flags unencrypted HTTP references |
| **E3** | Module 5: Passive Web Assessment| Passive tech fingerprinting | `IMPLEMENTED` | `server.ts` | Server headers, generator tags, CMS indicators | Zero exploit attempts or intrusive scanning |
| **F1** | Module 6: Decentralized Evidence| SHA-256 report fingerprinting | `IMPLEMENTED` | `server.ts` (`computeReportFingerprint`) | Canonical JSON hashing (RFC 6234) | Stable serialization, excludes volatile UI fields |
| **F2** | Module 6: Decentralized Evidence| EVM registry state | `IMPLEMENTED` | `server.ts` (`/api/evidence/verify`) | Verifiable on-chain state simulation on contract `0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE` | Never places raw message content or PII on-chain |
| **F3** | Module 6: Decentralized Evidence| Tamper-evident revision audit | `IMPLEMENTED` | `src/components/EvidenceVault.jsx` | Cryptographic certificate generation and verification | Verifies independent hash matches against ledger |
| **DIFF-A**| Core Differentiator | Digital Identity Graph | `IMPLEMENTED` | `src/components/IdentityGraph.jsx` | Interactive SVG canvas linking Brand, Domain, DNS, IP, TLS | Provenance recorded for every relationship edge |
| **DIFF-B**| Core Differentiator | Trust Drift | `IMPLEMENTED` | `src/components/TrustDrift.jsx` | Historical snapshot diffing (DNS, cert, headers) | Explicit "No baseline" warning on 1st scan; zero synthetic data |
| **DIFF-C**| Core Differentiator | Verifiable Threat Evidence | `IMPLEMENTED` | `src/components/EvidenceVault.jsx` | Independent cryptographic verification modal & JSON cert export | SHA-256 proof of tamper-resistance |
| **SEC1** | Security Hardening | SSRF Protection | `IMPLEMENTED` | `server.ts` (`isPrivateOrReservedIP`) | Blocks 127.0.0.0/8, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, metadata | Revalidated at every redirect hop; port restricted |
