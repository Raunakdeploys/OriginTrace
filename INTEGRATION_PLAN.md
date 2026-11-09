# ORIGINTRACE — Integration Plan

**Last Updated:** 2026-11-08T23:06:50-08:00

---

## 1. Unified Architecture Overview

```text
                     ORIGINTRACE FRONTEND
         (Dark Charcoal/Navy Cyber UI · Zero-Pill · React 19)
                              │
                              ▼
                    ORIGINTRACE API LAYER
                  (Express `server.ts` : 3000)
                              │
       ┌──────────────────────┼──────────────────────┐
       ▼                      ▼                      ▼
  URL & TLS Engine       Message & AI Engine   Correlation & Drift
(Node `tls`, `dns`,       (@google/genai         (IOC Correlation,
 SSRF-guarded fetch)      Gemini 3.8 Flash)     Snapshots, SHA-256)
       │                      │                      │
       └──────────────────────┬──────────────────────┘
                              │
                              ▼
                  Unified Investigation Result
          (Standard Schema, Evidentiary Hash, EVM Proof)
```

---

## 2. Service Endpoints & Integration Matrix

| Endpoint | Method | Responsibility | Engine / Service |
|---|---|---|---|
| `/api/investigate/url` | `POST` | Normalisation, DNS resolution, TLS cert chain audit, SSRF guard, redirect trail, passive security headers, typosquatting | Node `dns`, `tls`, `crypto` |
| `/api/investigate/message` | `POST` | Phishing intent, social engineering, urgency, credential request analysis, brand impersonation, IOC extraction | `@google/genai` (`gemini-3.8-flash`) |
| `/api/correlate` | `POST` | Deterministic IOC cross-correlation across existing cases and campaigns | Correlation Engine |
| `/api/drift/:domain` | `GET` | Retrieve and diff timestamped snapshots (DNS records, IP shifts, TLS changes, header alterations) | Drift Snapshot Store |
| `/api/evidence/verify` | `POST` | Verify report canonical SHA-256 hash against registry & check tamper-evidence | Evidence Vault Engine |
| `/api/emudhra/audit` | `GET` | Retrieve eMudhra incident audit records, indicators, and timeline | Curated Incident Intelligence |

---

## 3. SSRF Protection Specifications

All outbound network requests executed by ORIGINTRACE strictly adhere to:
1. **Target Validation:** Disallow protocols other than `http:` and `https:`.
2. **DNS Pre-Resolution:** Resolve hostname before connection.
3. **Blacklisted IP Ranges:**
   - IPv4 Loopback: `127.0.0.0/8`
   - RFC 1918 Private Networks: `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`
   - Link-Local & APIPA: `169.254.0.0/16`
   - Carrier-Grade NAT (CGNAT): `100.64.0.0/10`
   - IPv6 Loopback & Private: `::1`, `fc00::/7`, `fe80::/10`
4. **Redirect Hop Verification:** Every redirect response is caught, target URL re-parsed, and re-evaluated against SSRF rules before following (max 5 hops).
5. **Payload Limits:** Maximum 2MB response buffer; 8-second connection timeout.

---

## 4. Unified Result Schema

```typescript
export interface UnifiedInvestigationResult {
  investigation_id: string;
  target: string;
  target_type: "url" | "domain" | "message" | "email";
  classification: "LOW RISK" | "SUSPICIOUS" | "HIGH RISK" | "CONFIRMED MALICIOUS" | "INCONCLUSIVE";
  risk_score: number; // 0 - 100
  confidence: "LOW" | "MEDIUM" | "HIGH";
  timestamp: string;
  summary: string;
  checks: InvestigationCheck[];
  indicators: ExtractedIndicator[];
  relationships: IdentityGraphNode[];
  drift?: TrustDriftRecord;
  evidence: EvidenceRecord;
  limitations: string[];
}
```
