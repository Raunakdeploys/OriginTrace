# ORIGINTRACE — UI/UX Route & Component Matrix

**Document Purpose:** Master screen inventory, action mappings, and responsive layout specifications under the **Evidence-First Glassmorphism** design system.

---

## 1. Route & View Inventory

| View ID | Nav Label | Component | Core Responsibilities | Key Actions & Triggers | Associated API Endpoints | Responsive Layout |
|---|---|---|---|---|---|---|
| `overview` | Overview | `src/components/Overview.jsx` | Executive triage hub, prominent URL interrogation bay, Scam Exposure Rescue entry, live telemetry | • Quick URL scan<br>• 1-click test scenarios<br>• Launch Scam Rescue<br>• Direct to message analysis | `GET /api/health`<br>`POST /api/investigate/url` | Desktop: 7/5 col split<br>Tablet/Mobile: Stacked single-column |
| `investigate` | New Investigation | `src/components/Investigate.jsx` | Deep technical interrogation for URLs, domains, emails, and SMS messages | • Mode toggle (URL/Domain/Message/Email)<br>• File upload (.eml)<br>• Preset injection<br>• Copy SHA-256 / IOCs<br>• Launch Rescue Plan | `POST /api/investigate/url`<br>`POST /api/investigate/message` | Desktop: Two-column layout<br>Mobile: Responsive stacked cards |
| `identity_graph` | Digital Identity Graph | `src/components/IdentityGraph.jsx` | Interactive SVG relationship graph mapping Brand, Domain, DNS, IP, and TLS nodes | • Node click (provenance inspect)<br>• Edge filter (direct vs heuristic)<br>• Zoom / Pan / Reset<br>• Tabular fallback view | Uses investigation result `nodes` and `edges` (in-memory + DB) | Desktop: Full canvas + drawer<br>Mobile: Accessible table fallback |
| `trust_drift` | Trust Drift | `src/components/TrustDrift.jsx` | Timestamped historical observation diffing (DNS, TLS, headers, IP) | • Baseline comparison<br>• Filter by mutation status<br>• Trigger re-investigation<br>• Re-fetch timeline | `GET /api/drift/:domain`<br>`POST /api/investigate/url` | Desktop: 2-column comparison<br>Mobile: Sequential diff list |
| `emudhra` | eMudhra Investigation | `src/components/EMudhraInvestigation.jsx` | Forensic investigation dossier of eMudhra / emSign Root & Subordinate CA incidents | • Case timeline selector<br>• Serial cross-reference search<br>• Live test launch<br>• Root/Sub-CA/Leaf distinction | `GET /api/emudhra/audit` (curated static dataset + live test trigger) | Desktop: 3-column dossier<br>Mobile: Accordion card drilldown |
| `evidence_vault` | Evidence Vault | `src/components/EvidenceVault.jsx` | Canonical SHA-256 verification and EVM contract registry proof inspector | • Query report hash<br>• Re-verify against EVM contract<br>• Download JSON proof certificate<br>• Copy TX hash | `POST /api/evidence/verify` | Desktop: Search bar + proof card<br>Mobile: Stacked proof metrics |
| `history` | Investigation History | `src/components/InvestigationHistory.jsx` | Persistent chronological log of all completed investigations | • Select report to inspect<br>• Filter by risk classification<br>• Export JSON history<br>• Clear history | Client-state + local session storage | Desktop: Filterable table<br>Mobile: Compact dossier list |
| `settings` | Settings & Integrations | `src/components/SettingsView.jsx` | Engine telemetry status, SSRF policy review, threat intelligence configuration | • Inspect VT/GSB status<br>• Review SSRF boundary rules<br>• Toggle display preferences | `GET /api/health` | Desktop: 2-column setting cards<br>Mobile: Single-column list |

---

## 2. Shared Design Tokens (WCAG 2.2 AA Compliant)

- **Base Canvas:** `#080D18` (deep ink/navy)
- **Primary Glass Surface (`glass-panel`):** `rgba(13, 18, 30, 0.65)` with `1px solid rgba(255, 255, 255, 0.08)` and `backdrop-blur(16px)`
- **Solid Content Surfaces (`solid-content`):** `#0e1626` / `#121e30` for dense tabular datasets and cryptographic hashes
- **Primary Action Accent:** `#06b6d4` (electric cyan) / `#38bdf8` (sky) with `#020617` dark high-contrast text
- **Severity Badges:**
  - `CONFIRMED MALICIOUS`: Text `#f43f5e`, background `rgba(244, 63, 94, 0.1)`, border `rgba(244, 63, 94, 0.25)`
  - `HIGH RISK`: Text `#fb923c`, background `rgba(251, 146, 60, 0.1)`, border `rgba(251, 146, 60, 0.25)`
  - `SUSPICIOUS`: Text `#fbbf24`, background `rgba(251, 191, 36, 0.1)`, border `rgba(251, 191, 36, 0.25)`
  - `LOW RISK`: Text `#34d399`, background `rgba(52, 211, 153, 0.1)`, border `rgba(52, 211, 153, 0.25)`
- **Typography:** `Plus Jakarta Sans` for UI headings/copy, `JetBrains Mono` with tabular numerals for hashes, scores, IPs, and serials.
