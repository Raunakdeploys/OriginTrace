# ORIGINTRACE — UI/UX Transformation + Judge-Impact Feature Master Prompt

**Execution mode:** preserve the existing product and architecture. This is a controlled redesign of the interface plus one narrowly scoped user-facing feature. Read the whole document before editing.

## 0. Non-negotiable operating contract

You are modifying the existing ORIGINTRACE project, not starting a new project.

**Primary task:** transform the complete UI/UX into a coherent, premium, beginner-friendly, evidence-first security product using restrained glassmorphism.

**Secondary task:** inspect and, only if not already implemented, add the proposed **Scam Exposure Rescue** feature using existing application services and data contracts.

### Absolutely do not change
- Backend architecture, service boundaries, runtime, framework, routing model, API contracts, endpoint names, authentication, authorization, database technology/schema/migrations, job queues, scan engines, scoring logic, threat-intelligence providers, TLS logic, certificate validation, graph logic, Trust Drift logic, evidence/hash/chain logic, deployment topology, environment variable names, or existing workflows.
- Do not replace working functionality with static/mock data.
- Do not remove, rename, hide, or disconnect any existing feature, page, API action, report field, setting, integration, or navigation destination.
- Do not add a new backend service, database, framework, state-management library, UI kit, dependency, or build tool unless absolutely unavoidable and approved first.
- Do not rewrite the app in another language or convert TypeScript/JavaScript architecture. Use the project's existing stack and conventions.

If the proposed feature cannot be delivered safely with existing endpoints and client-side presentation, STOP and report the exact missing backend capability. Do not silently invent a backend or alter architecture. Ask for approval before any architecture/API/schema change.

### Work discipline
1. Inspect the current workspace and actual running application first. Read `PROJECT_STATE.md`, `FEATURE_MATRIX.md`, `INTEGRATION_PLAN.md`, `DEPLOYMENT.md` if present.
2. Identify the real framework, routes, components, CSS system, API client, state handling, auth and current pages. Do not infer from screenshots or old plans.
3. Create a backup/checkpoint or branch before edits. Preserve uncommitted work.
4. Build a route/component inventory and map every existing screen, action and responsive state.
5. Before editing, list the exact files expected to change and confirm they are frontend/presentation files. If a file contains backend or shared business logic, avoid it unless only presentation code is being changed.
6. Make small, reversible changes. Reuse existing components and dependencies.
7. After each route, run the existing checks and inspect the rendered result. Then run full regression/build tests.
8. Update `PROJECT_STATE.md` and `UI_UX_CHANGELOG.md` with actual changes and test evidence.
9. Never claim completion without running the checks. Report blocked, untested and unavailable items honestly.

---

# PART A — THE DESIGN SYSTEM

## 1. Chosen direction: Evidence-First Glassmorphism

Create a distinctive **ORIGINTRACE Evidence Console**: restrained frosted-glass layers over a quiet, dark, low-noise security workspace. It should feel like a premium digital-forensics instrument, not a generic SaaS dashboard, gaming HUD, crypto terminal or neon hacker theme.

Use glassmorphism to create depth and hierarchy, not as decoration on every surface. Important text, data tables, evidence, forms and graph labels must sit on stable, sufficiently opaque surfaces. Avoid stacking translucent cards on translucent cards.

### Why this direction
- Neumorphism often relies on subtle shadows and low-contrast boundaries; it can make controls and states hard to recognise.
- Maximalism may attract attention but increases visual competition and cognitive load for a first-time judge.
- Glassmorphism can create clear visual depth and a memorable identity, but overuse/transparency can harm readability. NN/g's guidance specifically warns about contrast and usability risks and recommends controlled backgrounds, sufficient blur and adjustable transparency where feasible.
- Follow WCAG 2.2 AA as the baseline: normal text contrast at least 4.5:1; large text at least 3:1; don't use colour alone to communicate state; keep keyboard focus visible and unobscured.

## 2. Visual identity

Use the existing brand/logo if one exists. Do not invent a new logo or rename ORIGINTRACE.

**Suggested palette (adapt to existing brand tokens if present):**
- App background: deep ink/navy `#080D18` or equivalent.
- Elevated base: `#101827`.
- Primary glass surface: white at approximately 7–10% opacity, with a subtle 1px white border at 10–16% opacity.
- Solid content surface: `#121E30` / `#162338` (or a measured equivalent).
- Primary text: near-white `#F4F7FC`.
- Secondary text: cool slate with verified contrast; never use faint grey for essential information.
- Accent: restrained electric cyan/teal for primary action and active navigation.
- Secondary accent: muted indigo for analysis/AI context.
- Success: green; warning: amber; danger: red; inconclusive: slate/blue. Every state also has a text label and/or icon.

Do not apply these hex values blindly if the existing brand system is different. Establish design tokens once and use them consistently.

### Glass materials
- `Glass/Primary`: medium-opacity surface, backdrop blur around 16–24px, thin border, restrained shadow.
- `Glass/Secondary`: lower visual emphasis, blur around 12–18px.
- `Solid/Content`: opaque panel for dense data, text, tables and reports.
- `Solid/Input`: opaque input background with clear border and focus ring.
- `Overlay/Modal`: strong opacity and blur behind it; modal itself must be readable.
- Use a subtle gradient glow only behind major page regions, never behind paragraphs or dense charts.
- Avoid large moving gradients, animated noise, excessive glow, glass-on-glass nesting and transparent text backgrounds.
- Provide a reduced-transparency/high-contrast fallback, including `prefers-reduced-motion` handling. If the existing app supports themes, integrate with its current settings rather than adding a parallel theme system.

## 3. Typography and writing

- Use the existing font if it is legible; otherwise prefer a clean sans-serif already available in the project. Do not add remote font dependencies just for styling.
- Clear hierarchy: one page title, one short explanatory sentence, then the primary action.
- Use sentence case, short labels and plain English. Expand unfamiliar terms at first use (e.g. “TLS certificate — proves the connection is encrypted, not that the business is genuine”).
- Avoid all-caps paragraphs, jargon-only labels, long introductory copy, marketing superlatives and unexplained scores.
- Use tabular numerals for scores, timestamps, counts and technical values.
- Keep line length comfortable; body text should not span the entire desktop width.

## 4. Layout, spacing and proportions

- Establish a consistent spacing scale (for example 4, 8, 12, 16, 24, 32, 48, 64px) and use it across all routes.
- Use a stable max-width content container; align headings, panels, forms and tables to the same grid.
- Desktop: fixed/collapsible left navigation if already supported, top bar with product identity and account/status actions, content area with clear hierarchy.
- Tablet: reduce side navigation width or use the existing responsive drawer.
- Mobile: single-column content, stacked cards, full-width primary action, no horizontal overflow, touch-friendly controls.
- Do not force a two-column layout where it makes the input or result too narrow. Use responsive breakpoints based on content needs.
- Ensure cards in the same row align; remove arbitrary heights, inconsistent padding, cramped gutters and huge empty gaps.
- Use a consistent radius scale (e.g. 12px controls, 16px cards, 20px hero panels). Do not make every component pill-shaped.
- Keep primary CTA placement consistent and visually obvious.

## 5. Interaction and motion

- Buttons: clear primary/secondary/tertiary hierarchy; visible hover, active, disabled, loading and focus states.
- Inputs: persistent labels, clear placeholder examples, validation text, keyboard support and visible focus.
- Menus: predictable location, clear active route, close on escape/outside click if current component supports it.
- Motion: subtle 120–220ms transitions for hover/focus/open; no perpetual animations, flashing, fake scan progress or motion that delays task completion.
- Loading: use real request state. If progressive scan results exist, show actual completed/pending checks. Never animate a percentage that is not backed by real progress data.
- Empty states: explain what the page does and the next action. Error states: explain what failed and how to retry. Partial states: identify unavailable checks.
- Confirmation before destructive actions; preserve all current safety confirmations.

---

# PART B — FIRST-IMPRESSION EXPERIENCE

## 6. The first 10 seconds: homepage hierarchy

A first-time visitor or judge must understand the product without prior explanation.

At the top of the home/overview route, use this hierarchy:

1. **Brand + one-line promise:** “Investigate suspicious links, messages and digital identities — with evidence you can inspect.”
2. **Primary investigation area:** prominent URL checker, with a clear input label, example URL, paste affordance if supported, and one primary action: `Investigate link`.
3. **Adjacent secondary entry point:** message/email analysis, using the existing working capability. Do not bury it in navigation.
4. **Scam Exposure Rescue panel** (Part D) beside or immediately below the checker. It must be visible without scrolling on a normal desktop viewport where practical; on mobile it should appear directly below the URL checker.
5. **A compact “How it works” strip:** `Submit → We check → See evidence → Decide safely`.
6. **A small live capability summary** only if it uses real backend health/status. Never display fake scan counts, threat counts, “live attacks”, or fabricated counters.

Do not fill the homepage with every module, charts, large welcome text, giant hero illustration or a wall of cards. The first screen is for taking action and understanding the result.

### Plain-language first-use guidance
Add a short helper line under the URL input:
“Paste a link you received. We inspect its destination, domain, certificate and other available warning signs. You do not need to open it.”

Add a small privacy note only if it accurately reflects the actual backend behaviour. Do not claim scans are private/local if external services receive the URL.

Use sample inputs only as clearly labelled examples. Never auto-run a sample or show its output as a real investigation.

## 7. Navigation and information architecture

Audit the current routes first. Preserve every existing route and function. Reorganise labels and grouping only when route mapping remains intact.

Preferred user-facing grouping (adapt to actual implemented modules):
- **Overview**
- **Investigate**
  - Link / Website
  - Message / Email
- **Investigations** (history, saved reports)
- **Digital Identity Graph**
- **Trust Drift** (changes between actual observations)
- **Certificate & eMudhra Investigation**
- **Evidence Vault / Verify Evidence**
- **Settings & Integrations**

Do not display a navigation destination as fully working if it is only a placeholder. If a required page exists but is incomplete, preserve it and show a truthful status.

Use icons consistently, paired with text. Do not make icon-only navigation the default for beginners. Active route must be unmistakable.

## 8. Result page: make the answer understandable first

When a real investigation completes, the top of the report should answer:
- **What did we find?** A plain-language verdict.
- **How sure are we?** Evidence coverage/confidence only if genuinely computed; do not invent a percentage.
- **What should I do next?** A short action based on observed findings.
- **What did we actually check?** Completed, unavailable, timed-out and skipped checks.

Below the summary, progressively reveal detail:
1. Key reasons (plain English, each linked to supporting evidence).
2. Destination and redirect path.
3. Domain, DNS and hosting observations.
4. TLS/certificate details.
5. Page/content indicators.
6. Threat-intelligence matches and provider/source/time.
7. Digital Identity Graph relationships.
8. Trust Drift comparison if a real previous snapshot exists.
9. Evidence and export/verification actions.

Use collapsible detail sections for technical depth, but do not hide critical warning or uncertainty. Add a small “Explain this” affordance for technical terms using concise tooltips/help text, not an AI chatbot by default.

### Verdict semantics
Preserve the backend's actual verdict mapping. Never relabel a score or invent certainty. Distinguish `LOW RISK`, `SUSPICIOUS`, `HIGH RISK`, `CONFIRMED MALICIOUS` and `INCONCLUSIVE` if these are the actual normalized states. “No malicious indicators found in completed checks” is not the same as “safe”. Valid HTTPS does not prove a business is legitimate.

## 9. Every route must be redesigned consistently

Audit and apply the same design system to every existing route, not just the homepage:
- Login/authentication and any onboarding.
- Overview/dashboard.
- URL/link scan input and results.
- Message/email/EML input and results.
- Investigation history and report detail.
- Digital Identity Graph (canvas, filters, legend, node/edge details, empty/loading/error states and table fallback).
- Trust Drift (first-scan/no-baseline state, comparison state, unavailable state).
- Certificate/TLS/eMudhra investigation.
- Evidence vault, report hash and verification view.
- Threat intelligence/integrations.
- Settings, API keys and provider status.
- Help, error, not-found, confirmation, modal and toast states.

For each page, inspect its full scroll length and all interactive states. Do not leave old styles on secondary pages.

### Charts and graph
- Use existing chart/graph libraries and data contracts.
- Do not replace the current graph with a decorative network animation.
- Make labels readable, edges distinguishable and legends understandable.
- Every graph relationship must remain traceable to real evidence. If no data exists, show a useful empty state, not sample nodes.
- Provide keyboard/table alternative where possible; never rely only on colour or dragging.

### Tables and technical data
- Use readable row spacing, sticky headers only where helpful, clear empty states and responsive overflow handling.
- Use monospace only for technical identifiers, hashes, IPs, domains and certificate fingerprints.
- Provide copy controls where currently supported; announce copy success honestly.

---

# PART C — DESIGN QA AND NON-REGRESSION

## 10. Required visual QA

Test all routes at minimum at these viewport widths: 360px, 390px, 768px, 1024px, 1366px and 1440px (or closest available browser sizes).

For each route check:
- No clipped content, horizontal overflow or hidden primary actions.
- Text/background contrast, including translucent surfaces and status badges.
- Heading/body hierarchy and consistent spacing.
- Navigation and active state.
- Form labels, validation and focus visibility.
- Loading, empty, error, partial and success states.
- Long URLs, long domains, large certificate values, hashes, long report text and large graph data.
- Browser zoom to 200% without loss of content/functionality where practical.
- Keyboard-only navigation and visible focus.
- Reduced-motion and reduced-transparency/high-contrast fallback.

Use automated accessibility checks if already installed; do not add dependencies without approval. Manually verify contrast for glass surfaces because the background can affect the effective contrast.

## 11. Required functional regression tests

The redesign must not change behaviour. Execute the existing test suite and add/adjust frontend tests only where appropriate.

Verify these workflows still work with the original backend:
- URL submit → existing scan API → actual result → report detail.
- Message/email submit → existing analysis API → extracted indicators → linked URL workflow if supported.
- History list → open correct report.
- Graph loads from real graph endpoint/data and responds to filters.
- Trust Drift first scan and later comparison behave exactly as backend supports.
- TLS certificate detail and eMudhra case show actual returned evidence.
- Evidence hash/verification uses real values.
- Settings and integrations still save/load correctly.
- Authentication and authorization remain unchanged.
- Refresh/deep link/reload works on each route.

Capture before/after screenshots for all major routes. Record viewport, route and state. Do not use screenshot-only QA as a substitute for functional tests.

---

# PART D — THE JUDGE-IMPACT FEATURE

## 12. Proposed feature: Scam Exposure Rescue

**Purpose:** A person may have already clicked a suspicious link or entered sensitive information before they think to scan it. A URL checker tells them about the link; it often does not guide them through the next urgent, practical steps. ORIGINTRACE should help them understand and respond to possible exposure.

**User-facing name:** `Scam Exposure Rescue`

**Homepage placement:** a visible, compact panel directly beside the URL checker on desktop and directly below it on mobile. It must be visible on the first screen without making the main URL checker smaller or crowded.

**Short headline:** “Already clicked or shared something?”

**Supporting line:** “Get a clear next-step plan. You do not need to share your password, OTP or card number.”

**Primary action:** `Check my exposure`

### 12.1 User journey

Open a short guided flow. Ask only what is necessary, in plain language:
1. “What happened?”
   - I only opened the link.
   - I typed a password or username.
   - I shared an OTP, PIN or banking credential.
   - I entered card/payment details.
   - I downloaded or opened a file/app.
   - I installed an app or gave remote access.
   - I sent money.
   - I'm not sure.
2. Ask which account/service category was involved only when needed (bank/payment, email, social account, work account, device, other). Do not ask for the actual account identifier.
3. Ask whether the user still controls the account/device only when it changes the guidance.
4. Present an ordered, tailored action plan with urgency and a clear reason for each action.

Never ask the user to enter a password, OTP, PIN, CVV, full card number, seed phrase, recovery code, private key or other secret. Never collect bank account numbers or unnecessary personal data. Do not send this selection to a third party. Prefer local client-side decision logic using existing UI state; do not persist the answers unless the current app has an explicitly approved, privacy-safe case workflow.

### 12.2 Response playbooks (must be conservative and safe)

- **Only opened the link:** close the page; do not interact further; do not download/approve anything; run the existing URL investigation; check whether a file was downloaded or permissions granted; watch for unusual account prompts. Do not claim that opening a link alone proves compromise.
- **Password entered:** from a trusted official app/site or known-good device, change that password immediately; change reused passwords elsewhere; enable MFA/passkeys; sign out other sessions; review recovery details and recent activity; contact the service through official channels if locked out.
- **OTP/PIN/banking credential shared:** contact the bank/payment provider immediately using the number on the card or official app/site; ask them to block/freeze relevant access or transactions; review transactions; change credentials from a trusted device; report unauthorised activity through official channels. Do not ask for the OTP/PIN.
- **Card/payment details entered:** contact issuer/bank promptly; freeze/replace card if advised; monitor and dispute unauthorised charges; do not use phone numbers from the suspicious page.
- **File downloaded/opened:** do not open again; if opened, disconnect from networks only when safe and appropriate; use the device's trusted security tools; contact IT/security support for work devices; do not upload sensitive files to public scanners without considering privacy.
- **App installed/remote access granted:** stop interacting; revoke remote-access sessions/permissions using trusted device settings; contact bank if financial apps were accessible; seek trusted technical support; consider isolating the affected device if active remote control is suspected.
- **Money sent:** contact bank/payment provider immediately and request recall/fraud escalation; preserve transaction/reference details privately; report through official local channels. Do not promise recovery.
- **Unsure:** give the safest low-regret steps and direct the person to their bank/service's official support if credentials or money may be involved.

Include a concise disclaimer: “This is a practical response guide, not a guarantee that an account or device is compromised or safe. Contact your bank/service provider immediately for financial or account exposure.”

### 12.3 Use investigation evidence intelligently

If the user has just completed an ORIGINTRACE URL or message investigation, offer to use that result as context:
- Show the detected destination/brand mismatch, credential/payment form indicators, suspicious redirect, threat-intelligence result or other relevant evidence only if the existing report actually contains it.
- Tailor the response plan based on the user's selected exposure and the actual scan result.
- Link back to the relevant investigation/report.
- Never infer that a password was stolen merely because a login form exists.
- Clearly distinguish observed technical evidence from the user's self-reported interaction.

If no investigation is attached, the exposure flow must still work as a standalone educational triage guide using deterministic, reviewed rules.

### 12.4 Make it demo-worthy

A judge should understand the feature in under 15 seconds:
- On the homepage, show a compact panel with the prompt “Already clicked?”
- Clicking it opens a simple 3–4-step flow, not a giant form.
- Choosing “I entered my bank OTP” immediately displays an urgent, ordered action plan and tells the user to contact their bank via official channels.
- Choosing “I only opened it” gives proportionate, non-alarmist guidance.
- A visible `Why these steps?` explanation ties actions to the selected exposure and any real scan evidence.

Do not use fake testimonials, fabricated case studies, fear-based copy, fake incident counters or simulated AI analysis. This feature should be useful even if every external API is unavailable.

### 12.5 Scope guard

Before implementing, inspect whether an equivalent feature already exists in current routes or components. If so, improve its discoverability and UI instead of duplicating it. Reuse existing frontend components and current report types. Do not add a backend service, database table, external API, AI provider or new data collection for this feature. If a requested result requires backend data not currently available, show a clear limitation and stop for approval.

### 12.6 Feature acceptance tests

- Homepage panel is visible and responsive.
- Every selection produces the correct relevant plan.
- No field requests a secret or sensitive credential.
- No answer is sent to a third party or persisted unexpectedly.
- “Only opened” is not treated as confirmed compromise.
- OTP/PIN/bank exposure triggers urgent official-bank contact guidance.
- Payment, password, download and remote-access branches are distinct.
- Existing investigation context is used only when actually present.
- Empty, back, cancel and restart actions work.
- Keyboard and screen-reader labels are usable.

---

# PART E — MANDATORY eMudhra IMPLEMENTATION AUDIT

## 13. Do not assume eMudhra works: verify the real feature

The project plan requires a genuine eMudhra/emSign certificate/incident investigation. The UI having an “eMudhra” tab, a certificate card or a hardcoded report does **not** prove implementation.

### 13.1 Current public incident context to verify

As of **9 November 2026**, eMudhra's own public incident statement says:
- On 26 October 2026, it acknowledged that private keys associated with eight emSign G3 intermediate TLS CAs were recoverable due to a script error that produced weak keys.
- It said the affected intermediates were revoked within 14 hours of confirmation.
- It stated that, based on its investigation to date, the affected intermediates had not issued publicly trusted end-entity certificates and there was no compromise of its infrastructure or customer data.
- Its 21 October update described eight affected intermediate CAs, said seven were never used in production and the one that was in production had not issued a certificate; it also described root-store distrust as a precaution.
- Its 28 October update said roughly 30,800 certificates in affected G3 hierarchies belonged to a US customer ecosystem using an alternate G1 RSA path; this is not evidence that the eight weak intermediates issued those 30,800 end-entity certificates.
- eMudhra states that its separate global digital-signature/eSign and enterprise applications were not impacted by this TLS incident. Do not conflate its TLS CA incident with India's DSC/eSign products.

**Primary source:** https://emudhra.com/en/post/certificate-security-incident

Treat this as a time-sensitive incident record. Re-check the official page and public certificate/revocation/root-program records at execution time. Do not rely solely on this prompt if new updates have appeared.

### 13.2 Inspect actual project implementation

Trace the complete current eMudhra workflow:
- UI route/component and user action.
- Frontend handler and request payload.
- API endpoint and backend handler.
- Actual certificate retrieval/parsing/validation logic.
- Data source(s): official incident page, CT logs, CCADB/root-program data, CRL/OCSP or other real sources.
- Persistence and report model.
- Evidence provenance and timestamps.
- Tests and deployment configuration.

Create an `EMUDHRA_AUDIT.md` table with columns:
`Requirement | Current status | UI location | API/handler | Source | Test executed | Evidence/output | Limitation | Next action`.

Use only these statuses: `WORKING_AND_TESTED`, `PARTIAL`, `UI_ONLY`, `BACKEND_ONLY`, `MOCK_ONLY`, `UNVERIFIED`, `BLOCKED`, `MISSING`.

### 13.3 Required technical behaviour

1. Identify actual affected intermediate CA records from authoritative public sources where possible.
2. Distinguish root CA, intermediate CA and end-entity/leaf certificate.
3. For each real certificate record, capture available subject, issuer, serial, validity, fingerprint, public-key algorithm/size, signature algorithm, SAN, source, retrieval time and verification method.
4. Check certificate chain, revocation, CT inclusion and trust-store status only through real available sources. An unreachable OCSP/CRL endpoint or unavailable CT lookup must be `UNKNOWN/UNAVAILABLE`, not “good”.
5. Verify revocation/root distrust using independent authoritative sources where possible.
6. Explain the incident accurately: weak intermediate CA keys and revocation; do not say that customer private keys, eMudhra signing infrastructure or Indian DSC/eSign systems were compromised when the cited official statement says otherwise.
7. Do not claim that the eight affected intermediates issued public end-entity certificates unless new authoritative evidence proves it.
8. Do not fabricate a certificate fixture, serial, fingerprint, CT entry, revocation response, screenshot, source or test output.
9. If an exact affected certificate is unavailable, build an honest source-backed incident investigation using authentic official records and label cryptographic reproduction as unavailable. Do not simulate certificate parsing and present it as a live certificate test.
10. Show the difference between “incident research record” and “live certificate validation for a user-supplied host”.

### 13.4 Execute tests, not just code review

Run at least:
- A known-good public TLS certificate.
- A deliberately expired test fixture from a trusted test source.
- Hostname mismatch.
- Chain validation failure.
- Revocation source unavailable.
- CT source unavailable.
- Actual eMudhra public incident record retrieval and evidence capture.
- A negative assertion that no affected leaf certificate is invented.
- A test that the UI clearly labels partial/unavailable checks.

Record actual commands, test names, timestamps, output excerpts and limitations. Never print API keys or private material.

**Important:** From this prompt alone, you cannot truthfully claim whether the current eMudhra implementation works. Determine that from the checked-out code and executed tests. If credentials, internet access or certificate fixtures are unavailable, report that precisely.

---

# PART F — EXECUTION PLAN (TOKEN-SAVING)

## 14. Run in bounded phases

Do not ask the agent to redesign every route, add the feature and audit all certificates in one unbounded generation. Execute the following phases in order and stop after each phase with a concise report.

### Phase 0 — Read-only audit
- Read this prompt and existing project-state documents.
- Inventory every route/page/component and current design tokens.
- Map UI interactions to existing API calls.
- Identify existing exposure-help feature, if any.
- Trace eMudhra end-to-end and run the smallest relevant existing tests.
- Create `UI_UX_ROUTE_MATRIX.md` and `EMUDHRA_AUDIT.md`.
- Do not change code. Report blockers and exact frontend files expected to change.

### Phase 1 — Shared design foundation
- Implement/reuse design tokens, typography, surfaces, spacing, radii, focus, buttons, fields, cards, badges, tables, dialogs and responsive shell.
- Keep all business logic/API contracts untouched.
- Test all shared components in the current app.

### Phase 2 — First-screen redesign
- Redesign overview/homepage hierarchy and URL checker.
- Ensure first-use guidance and message/email entry are obvious.
- Add the Scam Exposure Rescue entry panel only after confirming no duplicate exists.
- No fake metrics or sample result cards.

### Phase 3 — Core route redesign
- Redesign URL results, message/email results, history and report detail.
- Preserve every existing action and field.

### Phase 4 — Specialist route redesign
- Graph, Trust Drift, certificate/eMudhra, evidence vault, integrations and settings.
- Preserve technical completeness and real evidence provenance.

### Phase 5 — Exposure Rescue implementation
- Implement the small guided client-side flow using existing components and existing investigation context only.
- Run its branch tests and privacy review.

### Phase 6 — Regression, accessibility and visual QA
- Test all routes, viewport widths and states.
- Run functional test suite, build, accessibility checks and screenshot review.
- Fix only regressions caused by this task; do not change backend architecture.

### Phase 7 — Final report
Provide:
- Routes audited / routes redesigned.
- Files changed and why.
- Confirmation that backend/API/database/architecture files were not changed (or list any unavoidable shared-file edits and prove they are presentation-only).
- Existing functionality regression test results.
- Responsive/accessibility checks and screenshots.
- Scam Exposure Rescue test results and limitations.
- eMudhra audit status with evidence and actual test output.
- Known issues and next smallest action.

## 15. Exact first prompt — inspection only

Paste this first. Do not let the agent start redesigning before it has inspected the existing product.

```text
Read ORIGINTRACE_UI_UX_AND_JUDGE_FEATURE_MASTER_PROMPT.md completely.

PHASE 0 ONLY — READ-ONLY AUDIT. DO NOT EDIT APPLICATION CODE.

1. Inspect the current workspace and read PROJECT_STATE.md, FEATURE_MATRIX.md, INTEGRATION_PLAN.md and DEPLOYMENT.md if present.
2. Identify the actual framework, routes, UI components, CSS/theme system, API client, auth and current design conventions.
3. Inventory every page and its visible/hidden actions. Map each action to the existing handler/API endpoint. Do not infer functionality from a button or screenshot.
4. Identify all frontend files that could be changed without touching backend logic or API contracts.
5. Check whether an exposure/rescue/after-click guidance feature already exists. If yes, map it; do not duplicate it.
6. Trace eMudhra from UI to API/backend to real source to stored result. Run relevant tests that can safely run now. Do not invent a test fixture or claim success without output.
7. Create/update UI_UX_ROUTE_MATRIX.md and EMUDHRA_AUDIT.md using verified facts only.
8. Create a list of proposed frontend files to change and a list of prohibited backend/architecture files.
9. Report blockers, exact test commands/results, eMudhra status, and the next smallest task.

Do not change code, CSS, routes, database, APIs, dependencies, architecture, configuration, secrets or deployment. Stop and wait for approval.
```

## 16. Token-saving task prompt template

Use one phase at a time:

```text
Read ORIGINTRACE_UI_UX_AND_JUDGE_FEATURE_MASTER_PROMPT.md and PROJECT_STATE.md.
Execute PHASE [number] only.

Scope: [exact routes/components/files]
Do not change: backend, APIs, schemas, database, auth, scoring, services, dependencies, deployment or unrelated routes.
Before editing: list files and explain why each is presentation-only.
Acceptance: [observable visual and functional checks]

After work:
1. Run the relevant tests and show actual output.
2. Inspect the rendered UI at the required viewport sizes.
3. Report changed files and any behaviour/API differences (there should be none).
4. Update UI_UX_CHANGELOG.md and PROJECT_STATE.md.
5. Stop. Do not begin the next phase.
```

---

# PART G — DONE MEANS DONE

## 17. Final acceptance checklist

### UI/UX
- [ ] Every existing route has been inventoried and addressed.
- [ ] One consistent restrained glassmorphism design system across all pages.
- [ ] Text and evidence remain readable; contrast checks pass.
- [ ] Navigation is obvious to a first-time visitor.
- [ ] URL checker is the primary first-screen action.
- [ ] Message/email investigation is easy to find.
- [ ] Mobile, tablet and desktop layouts work.
- [ ] Loading, empty, partial, error and success states are real and clear.
- [ ] Graph, charts, reports, evidence and tables remain functional.
- [ ] Keyboard focus, zoom and reduced-motion/transparency are considered.

### Behaviour preservation
- [ ] No backend architecture or service boundary changed.
- [ ] No API contract changed.
- [ ] No database/schema/migration changed.
- [ ] No scoring, certificate, graph, Trust Drift or evidence logic changed.
- [ ] No existing route or feature removed/disconnected.
- [ ] Existing functional regression tests pass.

### Scam Exposure Rescue
- [ ] Homepage entry visible beside/below URL checker.
- [ ] Useful guided plan for click-only, password, OTP/PIN, payment, download, remote access, money sent and unsure.
- [ ] Never asks for secrets.
- [ ] Uses real investigation context only when present.
- [ ] No unapproved storage or external data sharing.
- [ ] Clear, proportionate and non-alarmist language.

### eMudhra
- [ ] UI/API/backend/source/persistence path inspected.
- [ ] Official incident details rechecked.
- [ ] Intermediate vs leaf vs root distinctions correct.
- [ ] Authentic source records linked and timestamped.
- [ ] Real test output captured.
- [ ] Missing sources and unavailable checks honestly labelled.
- [ ] No fabricated certificate fixture or claim.

**If any item fails, mark it incomplete. Do not declare the project fully complete.**

---

# RESEARCH REFERENCES

Use these as starting references; re-check current content during implementation.

1. Nielsen Norman Group, “Glassmorphism: Definition and Best Practices” (7 June 2024): https://www.nngroup.com/articles/glassmorphism/
   - Explains translucency/blur, depth, contrast risks, background control and transparency adjustments.
2. W3C, Web Content Accessibility Guidelines (WCAG) 2.2: https://www.w3.org/TR/WCAG22/
   - Contrast, focus visibility, keyboard access, target size and other accessibility requirements.
3. W3C, Understanding Contrast Minimum: https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
4. eMudhra official certificate security incident statement: https://emudhra.com/en/post/certificate-security-incident
5. urlscan.io FAQ (scan visibility, limitations and point-in-time nature): https://docs.urlscan.io/pages/faq
6. urlscan.io overview (browser-based page observation, network requests, screenshot/DOM context): https://docs.urlscan.io/about
7. URLvet repository (inspect current code and licence before reuse): https://github.com/urlvet/urlvet
8. PhishGuard repository (inspect current code and licence before reuse): https://github.com/iampopg/PhishGuard

**Research interpretation:** URLvet's published README describes a live, explainable URL analysis engine with DNS, TLS, redirects, domain and content signals; PhishGuard's published README describes explainable email/message analysis and IOC extraction. These are already useful foundations. Do not pitch “we also explain a URL score” as the unique innovation. The stronger user-value addition proposed here is the after-click exposure response flow, provided the current ORIGINTRACE code does not already implement it.
