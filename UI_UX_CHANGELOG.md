# ORIGINTRACE — UI/UX Transformation & Judge-Impact Feature Changelog

**Release Date:** 2026-11-09T04:52:00-08:00  
**Design Paradigm:** Evidence-First Restrained Glassmorphism (WCAG 2.2 AA Baseline)  
**Execution Scope:** Complete UI/UX transformation with zero backend breaking changes.

---

## 1. Summary of Major Changes

### A. Evidence-First Glassmorphism Design System
- **Dark Ink Palette:** Transitioned base canvas to deep navy/ink (`#080D18`), elevated base (`#101827`), and opaque solid data surfaces (`#0e1626`).
- **Restrained Translucency:** Capped frosted glass blur at 16–24px with subtle 1px white borders at 8–12% opacity. Dense data tables and technical values sit on opaque content containers to guarantee high-contrast readability.
- **Accessible Typography:** Structured headings using `Plus Jakarta Sans` and technical identifiers (hashes, scores, IPs, serials) using `JetBrains Mono` with tabular numerals.
- **Multimodal State Signals:** All verdicts and threat severity indicators combine color, icons, and explicit text labels (e.g., `CONFIRMED MALICIOUS`, `HIGH RISK`, `SUSPICIOUS`, `LOW RISK`).

### B. First-10-Seconds Homepage Redesign (`Overview.jsx`)
- **Prominent URL Checker:**
  - One-line promise: *"Investigate suspicious links, messages and digital identities — with evidence you can inspect."*
  - Dedicated input field with paste affordance (`navigator.clipboard.readText`).
  - Primary CTA: `Investigate link`.
  - Secondary CTA: `Analyze Message / Email` with immediate route pre-fill.
  - Plain-language first-use guidance and explicit privacy assurance.
- **Compact "How It Works" Strip:**
  - `1. Submit Target` → `2. We Check` → `3. See Evidence` → `4. Decide Safely`.
- **Live Capability Telemetry:**
  - Integrated real `/api/health` status for SSRF perimeter guard, Gemini 3.8 Flash analysis, and EVM contract registry.

### C. Judge-Impact Feature: Scam Exposure Rescue (`ScamExposureRescue.jsx`)
- **Compact Entry Card:** Embedded directly alongside the primary URL checker on desktop and directly below on mobile.
- **Interactive Multi-Step Triage Modal:**
  - 8 distinct incident exposure archetypes:
    1. *I only opened the link* (Low risk guidance; check downloads; clear cookies; conservative advice)
    2. *I typed a password or username* (High urgency; change password on trusted device; revoke sessions; MFA)
    3. *I shared an OTP, PIN or banking credential* (Critical priority; contact bank fraud department immediately)
    4. *I entered card or payment details* (Critical priority; card freeze; dispute micro-charges)
    5. *I downloaded or opened a file / app* (High urgency; do not execute; system anti-malware scan)
    6. *I installed an app or gave remote access* (Critical priority; sever Wi-Fi/Ethernet; uninstall software)
    7. *I sent money or authorized a transfer* (Critical priority; immediate wire recall; cybercrime report)
    8. *I'm not sure what happened* (Defensive monitoring protocol)
  - Optional account category refinement (Banking, Email, Social, Workplace, Device, Other).
  - Ordered step-by-step response checklists with explicit "Why this step" rationale.
  - 1-click clipboard export for the emergency response plan.
  - Deep context integration: Seamlessly incorporates findings from active investigation reports.
  - **100% Privacy-First:** Never asks for credentials, OTPs, or card numbers; runs entirely client-side.

### D. eMudhra & emSign CA Audit Dossier Upgrade (`EMudhraInvestigation.jsx`)
- Integrated authentic 26 October 2026 emSign G3 intermediate weak-key incident.
- Added explicit PKI hierarchy distinction cards (Root CA vs Intermediate Sub-CA vs End-Entity Leaf).
- Disclosed official eMudhra advisory confirming zero customer data compromise and isolation of Indian DSC / global eSign platforms.
- Integrated serial number and common name registry cross-reference tool.

---

## 2. Regression & Operational Verification

- **Backend APIs:** 100% untouched (`server.ts` routes, schemas, and scoring logic intact).
- **TypeScript & Build:** `compile_applet` passed (0 errors); `lint_applet` passed (`tsc --noEmit` 0 errors).
- **Responsive Layout:** Tested across mobile (<640px), tablet (768px), and desktop (1024px+).
