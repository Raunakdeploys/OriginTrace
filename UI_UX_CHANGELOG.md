# ORIGINTRACE — Calm Editorial SaaS Redesign & Verification Changelog

**Release Date:** 2026-11-09T05:15:00-08:00  
**Design Paradigm:** Calm, Minimal, Editorial-Quality SaaS Interface (WCAG 2.2 AA Compliant)  
**Execution Scope:** Complete UI/UX redesign with zero backend breaking changes.

---

## 1. Aesthetic Direction & Anti-Slop Discipline

### Eliminated Clichés & Visual Clutter:
- **No Glowing Neon & Radial Gradients:** Completely stripped out ambient glow blobs, cyan/magenta radial gradient blurs, and neon drop shadows (`shadow-[0_0_20px_rgba(6,182,212,0.3)]`).
- **No Futuristic HUDs or Hacker Imagery:** Removed spinning 3D wireframe cyber shields and decorative HUD framing. Replaced with clean four-step verification methodology cards and architectural capability panels.
- **No Decorative Pulsing Dots:** Removed decorative pulsing and pinging dots (`animate-pulse`, `animate-ping`) next to headings and static metadata.
- **No Pseudo-Code Headers:** Prohibited code-comment prefixes (`//`, `/* */`) on titles; adopted clean title-case editorial prose.
- **Zero-Pill Metadata Discipline:** Replaced rounded candy pill boxes with clean unboxed text separated by subtle typographic dots (`·`).

### Architectural Palette & Typography:
- **Dominant Neutral Canvas (60%):** Calm deep dark slate (`#0b0d11`).
- **Structural Surfaces (30%):** Restrained flat cards (`#11141a`) with subtle hairline dividers (`border: 1px solid rgba(255, 255, 255, 0.07)`).
- **High-Intent Action Budget (10%):** High-contrast solid primary controls (`bg-white text-slate-950 hover:bg-slate-200`) and quiet segmented tabs.
- **Dual-Font System:** `Plus Jakarta Sans` for clean display titles and body prose; `JetBrains Mono` with `font-variant-numeric: tabular-nums` strictly for metrics, indicators, and hashes.

---

## 2. Component Redesign Summary

### A. Navigation & Frame
- `Navbar.jsx`: Implemented the strict 3-zone Top Bar Contract:
  - Zone 1: Single text wordmark (`ORIGINTRACE v1.0`) with compact monogram.
  - Zone 2: Contextual route breadcrumb in clean text.
  - Zone 3: Quiet SSRF firewall indicator + high-contrast white primary action button (`New Investigation`).
- `Sidebar.jsx`: Clean 64-width architectural sidebar with unboxed metadata counts, quiet active states, and engine capability status.
- `index.css`: Replaced glassmorphism blur and ambient radial gradients with clean `.panel`, `.panel-subtle`, and `.panel-interactive` utility classes.

### B. Overview Console (`Overview.jsx`)
- Editorial headline and whitespace-balanced interrogation query form.
- Direct clipboard paste affordance (`Paste`) with instant visual feedback.
- Integrated `Scam Exposure Rescue` triage card with clean high-contrast action button.
- 4 tabular-numeral KPI metric tiles.
- Four-Step Verification Methodology sequence (`01. Submit Target` → `02. Multi-Signal Audit` → `03. Provenance Mapping` → `04. Sealed Fingerprint`).
- 6-module architecture capability breakdown + live telemetry connected to `/api/health`.
- One-click benchmark cases and recent dossiers data table.

### C. Forensic Interrogation Bay (`Investigate.jsx`)
- Clean segmented tabs (`URL`, `Domain`, `Message`, `Email`) without neon candy styling.
- RFC 822 email file upload with file type validation.
- Executive summary card with high-contrast classification and tabular risk score (`/ 100`).
- Scope & Assurance policy callout emphasizing that valid TLS does not guarantee legitimacy.
- Technical checks and extracted IOCs formatted in clean unboxed rows with 1-click clipboard copy.
- EVM canonical SHA-256 fingerprint card with block number verification.

### D. Digital Identity Graph (`IdentityGraph.jsx`)
- Restrained SVG network topology canvas with clean nodes in domain-native colors (slate, indigo, amber, emerald, terracotta).
- Clean interactive zoom controls and type filter tabs.
- Structured Node Inspector panel displaying verified relationship provenance and underlying DNS/TLS bindings.

### E. Trust Drift Forensics (`TrustDrift.jsx`)
- Differential telemetry scorecard displaying drift variance score and snapshot timestamps.
- Infrastructure mutation log comparing historical baseline against current values.

### F. eMudhra CA Audit Dossier (`EMudhraInvestigation.jsx`)
- Authentic October 2026 emSign G3 incident telemetry with 14-hour revocation timeline.
- X.509 PKI hierarchy distinction cards (Root CA anchor vs Intermediate Sub-CA vs End-Entity leaf).
- Serial number and sub-CA search tool with real-time registry matching.

### G. Evidence Vault & Ledger (`EvidenceVault.jsx`)
- Canonical SHA-256 fingerprint verification against local EVM state contract (`0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE`).
- Monospace ledger table with tabular block heights and 1-click JSON certificate download.

### H. Investigation Archive (`InvestigationHistory.jsx`)
- Clean search filter by target, ID, or summary with multi-select dropdowns for classification and target type.
- Full archive export to JSON.

### I. Settings & Architecture (`SettingsView.jsx`)
- Live status of threat intelligence integrations (VirusTotal v3, Safe Browsing v4, Gemini 3.8 Flash).
- SSRF defense policy specification (blocked CIDRs, cloud metadata protection, connection SLA).
- Open-source attribution preserving upstream licenses for `PhishGuard` (MIT) and `URLvet` (AGPLv3).

### J. Scam Exposure Rescue (`ScamExposureRescue.jsx`)
- 8 distinct incident exposure playbooks (link only, password entered, OTP shared, card details, file downloaded, remote access, money sent, unsure).
- Multi-step interactive triage modal with copyable emergency response checklist.
- Contextual correlation with active scan report.

---

## 3. Technical Verification & Architecture Preservation

- **Backend API Stability:** `server.ts` remains intact with all endpoints (`/api/health`, `/api/investigate/url`, `/api/investigate/message`, `/api/evidence/verify`, `/api/drift/:domain`, `/api/emudhra/audit`).
- **Port Binding:** Pinned to `0.0.0.0:3000` (`const PORT = 3000;`).
- **ESM & Type Stripping:** Node 22 native type-stripping verified for server entry point.
- **Build Quality:** TypeScript and Vite production builds passing with zero errors.
