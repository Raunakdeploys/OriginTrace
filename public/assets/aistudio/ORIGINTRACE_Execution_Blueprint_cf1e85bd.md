# ORIGINTRACE — Master Execution Blueprint
**Purpose:** Build the complete ORIGINTRACE hackathon application from verified reusable open-source components, with one coherent user experience, reproducible deployment, evidence-backed results, and no invented functionality.

**Operating rule:** This document is the source of truth. Follow it in order. Do not skip verification, invent features, replace working code unnecessarily, or claim a feature is complete without a passing test.

---

## 0. Non-negotiable project definition

### Product promise
ORIGINTRACE investigates suspicious URLs, websites, messages and certificates; correlates observable indicators; tracks changes between genuine snapshots; and preserves tamper-evident investigation evidence.

### Required outputs
1. One deployable application with one coherent UI and one investigation workflow.
2. Six problem-statement modules, all represented and honestly labelled by implementation status.
3. Three differentiators:
   - **Digital Identity Graph:** evidence-backed relationships between domains, DNS/IP, TLS certificates, redirects, claimed brands, IOCs and reports.
   - **Trust Drift:** comparisons between actual timestamped snapshots; never invent a previous state.
   - **Verifiable Threat Evidence:** SHA-256 report fingerprint and an independently verifiable registry record on an actual EVM test network or reproducible local EVM chain.
4. A genuine eMudhra investigation using authentic public certificate/incident evidence or a clearly labelled official-record investigation if a suitable certificate fixture cannot be verified.
5. Deployment instructions, environment-variable template, feature matrix, test evidence, third-party notices and a demo script.

### Truthfulness rules
- Risk and confidence are separate. Do not invent an uncalibrated percentage.
- `LOW RISK` means no malicious indicators were found **within the checks that actually completed**; it does not mean guaranteed safe.
- `SUSPICIOUS` means one or more potentially deceptive/unsafe indicators.
- `HIGH RISK` means multiple significant indicators supported by evidence.
- `CONFIRMED MALICIOUS` requires authoritative threat intelligence or sufficiently verified malicious evidence.
- `INCONCLUSIVE` means insufficient evidence, unsupported target, or unavailable checks.
- A failed API, timeout, missing key, blocked request or unsupported check is `UNAVAILABLE`/`INCONCLUSIVE`, never a clean result.
- Valid TLS does not prove a site is legitimate. Shared hosting, certificate renewal, an issuer name, a login form, or language similarity alone does not prove maliciousness.
- Never fabricate historical snapshots, eMudhra fixtures, scan results, transaction hashes, sources, reputation scores or counters.
- Never send passwords, OTPs, private keys, seed phrases, raw personal data or message contents to a public blockchain.

---

## 1. Recommended repository strategy

### Candidate repositories
- **Primary application candidate:** https://github.com/iampopg/PhishGuard
- **Specialist URL investigation candidate:** https://github.com/urlvet/urlvet

These are candidates, not guaranteed working dependencies. Their current default branches, exact features, API schemas, runtime requirements, security posture and licences must be inspected from the checked-out code before adoption.

### Intended division of responsibility
- PhishGuard: reuse only the verified message/email/EML analysis, AI explanation, IOC extraction, report/history and API functionality that actually works.
- URLvet: reuse only the verified URL/domain/DNS/TLS/redirect/website-analysis functionality that actually works.
- ORIGINTRACE: owns the unified frontend, normalized investigation API/schema, case management, correlation, Identity Graph, Trust Drift, eMudhra case, evidence hashing/registry, audit trail and deployment configuration.

### Architecture decision
Prefer **separate services connected through HTTP APIs**, not copying Go code into Python or merging two applications into one source tree.

```text
Browser
  |
  v
ORIGINTRACE UI
  |
  v
ORIGINTRACE API / orchestration layer
  |                 |                  |
  v                 v                  v
PhishGuard API      URLvet API         ORIGINTRACE database
(message/AI/IOC)    (URL/DNS/TLS)       (cases/snapshots/graph/evidence)
  |
  v
Evidence builder -> canonical report -> SHA-256 -> registry adapter
```

One user-facing investigation should call only relevant engines, normalize their responses, preserve raw engine response references, and produce one ORIGINTRACE report. Do not expose two separate dashboards as the final product.

### Repository licence gate
Before modifying, copying, combining, or deploying either repository:
1. Read the root `LICENSE`, `NOTICE`, README and dependency licences.
2. Record repository URL, commit hash, licence, modifications and attribution in `THIRD_PARTY_NOTICES.md`.
3. PhishGuard has been identified in earlier planning as MIT; verify the checked-out licence.
4. URLvet has been identified in earlier planning as AGPL-3.0; verify the checked-out licence and obtain appropriate compliance guidance before network deployment of a modified version.
5. Do not remove copyright/licence headers.
6. If licence obligations cannot be met, do not silently copy its code. Consider using it as a separately deployed service only after reviewing the AGPL obligations; separation does not automatically eliminate obligations.

---

## 2. Mandatory workflow: do not start by generating the whole app

### Stage 1 — Recover and protect workspace
1. Open the folder containing `ORIGINTRACE_Master_Handover.md` and this blueprint.
2. Inspect all files and folders; do not assume the folder is empty.
3. Identify whether PhishGuard and URLvet already exist locally.
4. Check Git status and current branch for each repository.
5. Preserve all user work. Make a backup/checkpoint before edits.
6. Never overwrite `.env`, credentials, database files, uploads, certificates or existing project code.
7. Create/update:
   - `PROJECT_STATE.md`
   - `FEATURE_MATRIX.md`
   - `INTEGRATION_PLAN.md`
   - `DEPLOYMENT.md`
   - `THIRD_PARTY_NOTICES.md`
8. Report the exact state and stop. Do not redesign UI or build features yet.

**Acceptance:** workspace inventory, clean checkpoint/backup, repo status, no lost files, state documents created.

### Stage 2 — Verify each candidate independently
For each repository separately:
1. Read README, licence, Docker files, dependency manifests, environment examples and API routes.
2. Record actual language/runtime, install command, start command, ports, database/cache dependencies and required secrets.
3. Use a disposable local environment or Docker Compose where supported.
4. Copy `.env.example` to a local `.env` only if required. Never commit `.env`.
5. Start the service and capture actual logs/health response.
6. Test one benign URL and one clearly documented safe test input. Do not use a live malicious site for casual testing.
7. Test one email/message sample if the repository claims to support it.
8. Inspect API routes and response schemas from code/OpenAPI/docs. Do not assume endpoint names or JSON fields from this blueprint.
9. Test missing key, timeout, invalid input and malformed upstream response.
10. Record screenshots/log snippets and commit hash.

**Acceptance:** each repository starts independently; its claimed key workflows are demonstrated; actual API contract is documented; failures are handled honestly.

**Stop condition:** if a repository cannot run after reasonable dependency/config fixes, document the blocker and assess a fallback. Do not build the integration around an unverified feature.

### Stage 3 — Select the verified base
Choose the base based on evidence, not README promises:
- Prefer the project with working authentication (if needed), stable API, maintainable backend, persistent storage, Docker support and working report/history.
- Do not force PhishGuard to be the base if it is broken or unsuitable.
- Keep URLvet separate if it is independently useful.
- If neither is usable, stop and reassess scope/architecture before generating a new application.

**Acceptance:** a short decision record explaining chosen base, retained services, removed dependencies and evidence.

### Stage 4 — Define the ORIGINTRACE contract before integration
Create one canonical API contract. Suggested shape (adapt after inspecting real APIs):

```json
{
  "investigation_id": "server-generated-id",
  "created_at": "ISO-8601 UTC",
  "target": {
    "type": "url|domain|message|email|certificate",
    "display_value": "sanitized display value"
  },
  "classification": "INCONCLUSIVE",
  "confidence": "low|medium|high|not_assessed",
  "checks": [
    {
      "module": "url|message|tls|website|threat_intel",
      "status": "completed|partial|unavailable|not_applicable",
      "severity": "info|low|medium|high|critical|unknown",
      "summary": "evidence-based explanation",
      "evidence": [],
      "source": "engine/provider",
      "observed_at": "ISO-8601 UTC"
    }
  ],
  "indicators": [],
  "relationships": [],
  "limitations": []
}
```

Rules:
- Preserve original engine response in protected storage or a redacted raw-response record.
- Store normalized fields plus provenance: source, timestamp, method, status and evidence reference.
- Never silently drop failed checks.
- Use server-generated IDs and UTC timestamps.
- Validate every inbound/outbound payload with schemas.
- Keep API versioning explicit, e.g. `/api/v1`.
- Do not hardcode secrets or provider-specific assumptions in frontend code.

**Acceptance:** schema tests and example fixtures for successful, partial, unavailable and malformed engine responses.

### Stage 5 — Integrate engines with resilient adapters
Build one adapter per external/local engine:
- `PhishGuardAdapter`
- `URLvetAdapter`

Each adapter must:
1. Read base URL and credentials from environment variables.
2. Use explicit connection/read timeouts.
3. Validate response status, content type and schema.
4. Normalize known fields into ORIGINTRACE schema.
5. Preserve source and timestamp.
6. Return structured `unavailable`/`partial` errors instead of crashing the investigation.
7. Retry only safe transient failures, with a small bounded retry count and backoff.
8. Never retry non-idempotent actions without an idempotency strategy.
9. Log request ID, engine name, duration and status; redact tokens, message bodies and personal data.
10. Have unit tests using mocked responses.

Test cases:
- engine healthy
- engine offline
- timeout
- HTTP 4xx/5xx
- invalid JSON
- missing fields
- unexpected enum
- oversized response
- provider key missing
- rate limit / 429
- partial scan result

**Acceptance:** one ORIGINTRACE request can call the required engine(s), return one report, and still complete with clear partial status if an engine is unavailable.

---

## 3. Six mandatory problem-statement modules

### Module 1 — Intelligent URL and website analysis
**Build/reuse:**
- URL parsing and normalization without changing the original evidence.
- Scheme, hostname, port, path and query extraction.
- IDN/punycode and suspicious Unicode/homograph indicators.
- Lookalike/typosquatting indicators.
- Redirect chain with each hop recorded.
- DNS resolution and domain/IP metadata where available.
- Threat-intelligence lookups from configured providers.
- Passive website content inspection for suspicious links, forms and credential collection indicators.
- Extract URLs, domains, emails and phone numbers from submitted messages.
- Show evidence, source and limitations for every finding.

**Do not claim:**
- A domain is malicious solely because it is new, long, unusual or uses a login form.
- All embedded ads/links are dynamically inspected if only static HTML was checked.
- Full browser behavior was analysed if JavaScript was not executed.

**Acceptance tests:**
- valid benign URL
- malformed URL
- Unicode/lookalike hostname
- redirect chain
- redirect loop
- unsupported scheme
- DNS failure
- private/internal IP target blocked
- threat provider unavailable
- page with ordinary login form labelled as indicator, not proof

### Module 2 — TLS, web trust and eMudhra
**Build/reuse:**
- TLS handshake and certificate-chain retrieval.
- Subject, issuer, serial, SAN, validity, fingerprint and public-key algorithm/size.
- Hostname/SAN match.
- Expiry/not-yet-valid checks.
- Chain-building/trust result from the configured trust store.
- TLS protocol/cipher observations where supported.
- Revocation status (OCSP/CRL) where available; report unknown if unreachable.
- Certificate Transparency (CT) records where available.
- Compare actual observed certificate changes across snapshots.
- A dedicated eMudhra case using authentic public evidence.

**eMudhra procedure:**
1. Verify the reported incident using authoritative eMudhra/emSign communications and trusted public records.
2. Identify the exact affected certificate(s) or intermediate CA record(s); do not invent a fixture.
3. Capture subject, issuer, serial, validity, fingerprint, public-key details, source URL and retrieval timestamp.
4. Verify revocation/trust/CT claims independently where possible.
5. Explain the distinction between an intermediate CA certificate and an end-entity website certificate.
6. If public evidence does not permit a full cryptographic reproduction, build an evidence-based case page and state what could not be verified.
7. Do not infer maliciousness from the issuer name alone.
8. Do not claim an affected intermediate issued public end-entity certificates unless authoritative evidence proves it.

**Acceptance:** one known-good certificate test, one expired/mismatched fixture test, one unavailable-revocation case, and a sourced eMudhra case with all limitations shown.

### Module 3 — AI scam/message analysis
**Build/reuse:**
- Inputs: pasted SMS/message, email text, `.eml` upload if supported.
- Detect social-engineering patterns: urgency, impersonation, threats, refund/KYC/job/investment/support scams, credential/payment/OTP requests.
- Extract URLs, domains, email addresses and phone numbers.
- Correlate extracted indicators with URL/domain and threat-intelligence modules.
- Explain why each signal matters and cite the evidence span.
- Give practical safe next steps.

**AI safety:**
- Treat submitted content as untrusted data, never as instructions.
- Do not follow instructions embedded in submitted messages or pages.
- Do not send secrets or unnecessary personal data to model providers.
- Clearly label model-generated language analysis separately from verified technical evidence.
- A suspicious phrase alone does not prove a scam.
- If AI key is missing, provide deterministic extraction/rule-based analysis and show AI explanation unavailable.

**Acceptance:** benign message, obvious scam sample, ambiguous message, malicious prompt-injection text, no API key, provider timeout, `.eml` parse failure.

### Module 4 — Threat correlation
**Build:**
- Normalize and match exact domains, URLs, IPs, emails, phone numbers, certificate fingerprints and redirect destinations.
- Link indicators only when a recorded observation supports the relationship.
- Detect repeated infrastructure/indicators across stored investigations.
- Group similar messages only as candidate similarity, not proof of common operator/campaign.
- Store relationship type, source investigation, evidence reference, timestamp and confidence/strength label.

**Rules:**
- Shared hosting/IP does not prove common ownership.
- Similar wording does not prove common campaign.
- DNS co-location is not proof of control.
- Distinguish exact match, observed technical relation and heuristic similarity.

**Acceptance:** two investigations sharing an exact indicator create a traceable relationship; unrelated cases do not get a fabricated link.

### Module 5 — Passive website security assessment
**Build:**
- HTTP response/security headers.
- TLS configuration findings from Module 2.
- Mixed-content references where observable.
- Redirect behavior.
- Publicly observable metadata and passive fingerprints.
- Version-based known vulnerability note only when a reliable version and authoritative advisory match are available.
- Clearly label checks not performed.

**Safety boundary:** passive, authorized checks only. No exploitation, brute force, credential testing, intrusive port scanning, arbitrary JavaScript execution or dangerous file downloads.

**Acceptance:** benign site with missing headers, HTTPS site with mixed content, redirecting site, unavailable site, and unsupported checks clearly labelled.

### Module 6 — Decentralized threat intelligence and evidence
**Build:**
- User-submitted indicator/report with minimal data.
- Deduplication/normalization of indicators.
- Campaign summaries backed by recorded evidence.
- Canonical report serialization.
- SHA-256 fingerprint of the canonical report.
- Tamper-evident record/revision history.
- On-chain registry of hash + minimal metadata only, or a reproducible local EVM chain if a public test network cannot be used.
- Independent verification page/tool that recomputes hash and checks registry entry.
- Dispute/revision/provenance status off-chain.

**Blockchain rules:**
- Do not store raw messages, personal data, full URLs with sensitive query parameters, API keys, IP logs or private evidence on-chain.
- Never display a fake transaction hash or pretend local registration is public-chain confirmation.
- Show network, chain ID, contract address, transaction hash, block number and confirmation status only when actually returned by the chain.
- If no RPC wallet/faucet/network is available, use a clearly labelled local EVM demonstration or hash-only mode; never label it public blockchain.
- Hash proves that bytes match a recorded fingerprint; it does not prove that the report is true.

**Acceptance:** same report reproduces same hash; modified report fails verification; actual transaction can be independently queried, or local/hash-only mode is clearly disclosed.

---

## 4. Three differentiators — detailed build requirements

### A. Digital Identity Graph
**Nodes:** claimed brand, domain, URL, DNS record, IP, TLS certificate/fingerprint, redirect destination, email, phone, IOC, investigation/report.

**Edges:** `resolves_to`, `redirects_to`, `presents_certificate`, `mentions_brand`, `contains_indicator`, `observed_in_report`, `shares_exact_indicator`.

Every edge must include:
- relationship type
- source engine/provider
- observation timestamp
- evidence reference
- basis (`direct_observation`, `authoritative_source`, `heuristic`)
- caveat/limitations

Do not create an edge solely from shared hosting or text similarity. Clicking a node/edge should reveal its evidence and originating investigation.

**Minimum viable implementation:** graph data model + interactive graph view or a clear relationship explorer/list if graph library is unstable. The evidence model is mandatory; visual complexity is optional.

### B. Trust Drift
**Snapshot fields:** observed time, normalized target, DNS answers, certificate fingerprint/serial/issuer/validity, redirect chain, selected HTTP headers, selected passive page fingerprints, source and check status.

**Workflow:**
1. Run investigation and save a snapshot.
2. Run the same target later.
3. Compare only fields observed in both snapshots.
4. Label changes as `changed`, `unchanged`, `newly_observed`, `no_longer_observed` or `comparison_unavailable`.
5. Explain why a change matters and avoid calling it malicious without evidence.

**No previous snapshot:** show “No historical baseline available — Trust Drift cannot yet be assessed.” Never synthesize history.

**Acceptance:** first scan has no baseline; second scan creates a real comparison; unavailable fields do not become false changes.

### C. Verifiable Threat Evidence
1. Define deterministic canonical JSON serialization (stable key order, UTF-8, explicit null/omission policy, normalized timestamps).
2. Exclude volatile UI-only fields from the hash.
3. Compute SHA-256 server-side.
4. Save report version, hash, timestamp and provenance off-chain.
5. Register only hash and minimal non-sensitive metadata.
6. Verify by reserializing report and recomputing hash.
7. Display mismatch clearly.
8. Record revisions as new versions; never overwrite old evidence silently.

**Acceptance:** repeatable hash, tamper detection, source report retrieval under access control, and honest chain status.

---

## 5. Unified UI/UX — exact application structure

Do not keep the original PhishGuard and URLvet dashboards in the final user workflow. Reuse their engines/APIs, not their separate navigation.

### Navigation
1. Overview
2. New Investigation
3. Digital Identity Graph
4. Trust Drift
5. eMudhra Investigation
6. Evidence Vault
7. Investigation History
8. Settings / Integrations

### Overview
- Recent investigations from real database records.
- Actual counts only; no hardcoded dashboard statistics.
- Engine health (online/degraded/offline).
- Recent evidence records.
- Clear “New Investigation” action.

### New Investigation
- Tabs or input selector: URL / Domain / Message / Email / EML / Certificate.
- Validate input before submission.
- Explain what will be sent to external providers.
- One “Start Investigation” action.
- Progress by actual check status; never animate fake progress or invent completed checks.
- Allow cancellation if safely supported.

### Investigation report
1. Target and timestamp.
2. Classification + confidence label + scope warning.
3. Executive summary.
4. Completed/partial/unavailable checks.
5. URL/domain and redirect analysis.
6. DNS/IP evidence.
7. TLS/certificate evidence.
8. Website security observations.
9. Message/AI analysis, if applicable.
10. Extracted IOCs.
11. Threat-intelligence matches.
12. Digital Identity Graph relationships.
13. Trust Drift (or explicit no-baseline message).
14. Sources and evidence.
15. Limitations.
16. SHA-256 and registry verification status.

### Visual design
- Responsive analyst-grade interface; dark navy/charcoal with restrained blue/teal accents.
- Clear typography, readable contrast, accessible labels and keyboard focus.
- No cluttered “hacker” decoration, fake terminal output, random charts or fake threat counters.
- Loading, empty, error, partial and success states for every major page.
- On mobile, navigation collapses cleanly and report sections remain readable.
- Do not change backend workflows while doing a UI-only redesign.

---

## 6. Security and privacy requirements

### SSRF and URL-fetching protection — mandatory
Any backend that fetches a user-supplied URL must:
1. Allow only `http` and `https`.
2. Reject localhost, private, loopback, link-local, multicast, reserved, unspecified and carrier-grade NAT IPv4 ranges.
3. Apply equivalent IPv6 checks, including IPv4-mapped IPv6.
4. Resolve DNS and validate **every** returned IP before connecting.
5. Revalidate after every redirect; do not trust the original hostname's prior resolution.
6. Prevent DNS rebinding by binding connection to validated resolution or using a safe egress proxy.
7. Restrict ports to explicitly permitted ports (normally 80/443).
8. Block cloud metadata endpoints and internal service names.
9. Set connection/read/total timeouts, response-size limits and redirect-hop limits.
10. Do not execute arbitrary page JavaScript or download/execute files.
11. Isolate fetch workers from internal databases, credentials and cloud metadata.
12. Log blocked requests without exposing sensitive query parameters.

If these protections cannot be implemented and tested, disable arbitrary URL fetching and accept only safe preconfigured test targets until fixed.

### General security
- Store API keys only in server-side environment variables/secrets.
- Never put secrets in frontend bundles, Git, logs, screenshots or reports.
- Rate-limit scan, login and upload endpoints.
- Validate file type, size and parsing limits for `.eml`/uploads.
- Use secure session/auth configuration if authentication exists.
- Use least-privilege service accounts.
- Protect stored reports and raw message data with access controls.
- Redact tokens, cookies, credentials, message bodies and personal data from logs.
- Treat web pages, emails and uploaded files as untrusted content; protect AI prompts from injection.
- Use dependency lockfiles and scan dependency advisories.
- Set CORS narrowly; do not use wildcard credentials.
- Use HTTPS in deployed environments.
- Provide data-retention/delete controls if user data is stored.
- Do not claim a security control exists until tested.

---

## 7. Database and data model

Use the existing verified database if it is reliable; do not introduce a new database without need.

Minimum entities/tables:
- `investigations`
- `check_results`
- `indicators`
- `relationships`
- `snapshots`
- `evidence_records`
- `evidence_revisions`
- `engine_runs` (health/status/duration; avoid sensitive payloads)
- `users` only if authentication is required

Every record should have stable IDs and UTC timestamps. Use migrations. Add indexes for target, indicator value/type, timestamp and investigation ID. Keep raw evidence access controlled and retention-limited.

Do not store a second duplicate history in each engine and ORIGINTRACE unless a clear ownership rule exists. ORIGINTRACE should own the canonical case/report record; adapters may retain only what is required to reference source results.

---

## 8. Environment variables and deployment

Create `.env.example` with names and safe placeholders only. Never include real keys.

Expected categories (exact names depend on implementation):
```env
APP_ENV=development
APP_BASE_URL=http://localhost:3000
API_BASE_URL=http://localhost:8000
DATABASE_URL=
PHISHGUARD_BASE_URL=
PHISHGUARD_API_KEY=
URLVET_BASE_URL=
URLVET_API_KEY=
GEMINI_API_KEY=
THREAT_INTEL_PROVIDER_KEY=
EVM_RPC_URL=
EVM_CHAIN_ID=
EVM_CONTRACT_ADDRESS=
EVM_PRIVATE_KEY=
```

Important:
- Omit unused variables; do not create fake integrations.
- Prefer a server-side managed signer or test-only wallet for chain interaction. Never expose private keys to the browser.
- Use a public testnet only if RPC, faucet funds, contract deployment and verification are actually available.
- Do not promise a free always-on host. Free hosting may sleep, restrict outbound requests, cap build minutes or block ports.
- Prefer Docker Compose for reproducible multi-service local deployment.
- For cloud deployment, use a platform that supports the required services, persistent storage, background workers, outbound TLS/DNS and environment secrets.
- Do not assume a frontend-only hosting provider can run Go/Python services, a database and workers.
- If free cloud deployment cannot host all services, deploy a demo subset with explicit limitations or use a single VM/container platform within free limits.

### Deployment sequence
1. Build and test locally.
2. Run database migrations.
3. Start database/cache (if actually required).
4. Start PhishGuard and verify health.
5. Start URLvet and verify health.
6. Start ORIGINTRACE API and verify health.
7. Start frontend and verify API connectivity.
8. Run end-to-end smoke test.
9. Configure production secrets in hosting dashboard.
10. Deploy backend/services before frontend.
11. Verify deployed health endpoints and CORS.
12. Run one benign URL, one message and one certificate investigation.
13. Verify report persistence after restart/redeploy.
14. Test failure mode with one engine stopped.
15. Capture deployment URL, commit hash, timestamp and test evidence.

### Deployment failure prevention
- Pin compatible runtime/dependency versions.
- Use lockfiles.
- Do not install latest versions blindly during final deployment.
- Bind services to `0.0.0.0` where platform requires it; use platform-provided port variables.
- Ensure health checks test readiness, not merely process existence.
- Use persistent volumes for database/evidence storage.
- Do not assume container filesystem is persistent.
- Set correct frontend API base URL for production.
- Configure CORS for the exact deployed frontend origin.
- Check logs for missing environment variables, migrations, port mismatch, DNS, TLS and memory limits.
- Never paste secrets into screenshots or chat.

---

## 9. Testing plan — required before claiming completion

### Unit tests
- URL normalization and IDN parsing.
- IP-range/SSRF validation.
- Canonical report serialization and SHA-256.
- Risk classification rules.
- Indicator normalization/deduplication.
- Trust Drift field comparison.
- Adapter response parsing and error handling.
- Graph relationship provenance validation.

### Integration tests
- ORIGINTRACE -> PhishGuard adapter.
- ORIGINTRACE -> URLvet adapter.
- Message -> IOC extraction -> indicator lookup.
- URL -> DNS/TLS/redirect checks -> unified report.
- Report -> snapshot -> Trust Drift.
- Report -> hash -> registry -> independent verification.
- Database persistence across restart.

### Security tests
- localhost/private IPv4 and IPv6 blocked.
- DNS resolving to private address blocked.
- Redirect to private address blocked.
- Redirect loop bounded.
- Huge response bounded.
- Slow response times out.
- Invalid upload rejected.
- Prompt-injection content treated as untrusted.
- Secrets absent from frontend build and logs.
- Rate limits enforced.

### Manual acceptance checklist
- [ ] Application starts from documented clean setup.
- [ ] Each service health endpoint works.
- [ ] URL investigation produces evidence and limitations.
- [ ] Message/email investigation works or unavailable mode is clear.
- [ ] TLS report shows real certificate details.
- [ ] eMudhra case cites authentic evidence.
- [ ] Threat correlation links only evidence-backed indicators.
- [ ] Identity Graph shows provenance for every relationship.
- [ ] First Trust Drift scan says no baseline.
- [ ] Second actual scan compares real snapshots.
- [ ] Evidence hash can be independently recomputed.
- [ ] Chain/local/hash-only status is labelled accurately.
- [ ] Engine outage produces partial/inconclusive report, not false safe result.
- [ ] Mobile layout is usable.
- [ ] No fake data, counters, transaction IDs or historical snapshots.
- [ ] Deployment survives restart and preserves required data.

---

## 10. Token-efficient agent workflow

### One task per prompt
Give the coding agent one bounded task with:
- exact objective
- allowed files/directories
- prohibited changes
- acceptance tests
- required state-document update
- stop condition

Do not ask “build the whole project”, “fix everything”, “make it production-ready” or “improve all UI and backend” in one prompt.

### Agent operating rules
1. Read `PROJECT_STATE.md` first; then only relevant files.
2. Do not rescan the entire repository unless needed.
3. Before editing, list files to change and explain why.
4. Make the smallest working change.
5. Run the narrowest relevant tests, then regression tests.
6. Show changed files, commands run, test output and unresolved issues.
7. Update `PROJECT_STATE.md`, `FEATURE_MATRIX.md` and relevant technical docs.
8. Stop after the requested task. Wait for next instruction.
9. Never change architecture, dependencies, schema or licence strategy without explaining and asking.
10. Never delete a feature or file to make tests pass without approval.
11. Do not auto-format the entire repository.
12. Do not rewrite working code just to match a preferred style.

### Token-saving prompt template
```text
Read PROJECT_STATE.md and only the files needed for this task.

TASK:
[one exact task]

SCOPE:
[exact files/module]

DO NOT:
- rewrite unrelated code
- redesign unrelated UI
- change architecture or dependencies without approval
- remove existing features
- invent test results or data
- expose or commit secrets

ACCEPTANCE:
[observable tests/results]

After implementation:
1. Run relevant tests.
2. Report changed files and test output.
3. List blockers and limitations.
4. Update PROJECT_STATE.md and FEATURE_MATRIX.md.
5. Stop. Do not start the next task.
```

### Recommended task order after repository verification
1. Document actual repository architecture and run commands.
2. Build health checks and adapters with mocked tests.
3. Implement canonical ORIGINTRACE schema.
4. Connect one URL scan end-to-end.
5. Connect message/email scan end-to-end.
6. Add TLS/eMudhra evidence case.
7. Add database-backed investigation history.
8. Add exact IOC correlation.
9. Add evidence-backed Identity Graph.
10. Add real snapshot-based Trust Drift.
11. Add canonical report hashing and registry adapter.
12. Build/refine unified UI around working APIs.
13. Harden SSRF/privacy/rate limiting.
14. Deploy and execute full smoke tests.

If time is critically short, do not fake modules. Prioritize one reliable end-to-end investigation and honest, demonstrable reduced implementations of the remaining modules.

---

## 11. Required project documents

### `PROJECT_STATE.md`
Must always contain:
- current stage
- current branch/commit
- services running and ports
- working features with test evidence
- incomplete features
- blockers
- latest successful commands/tests
- exact next action
- known risks

### `FEATURE_MATRIX.md`
One row per requirement with:
- requirement
- status: `IMPLEMENTED`, `PARTIAL`, `MISSING`, `UNVERIFIED`, `BLOCKED`
- implementation file/endpoint
- evidence/test name
- limitation
- next action

### `INTEGRATION_PLAN.md`
- architecture diagram
- service responsibilities
- ports and API base paths
- exact API request/response examples from real code
- schema mapping
- database ownership
- failure handling
- licence decisions

### `DEPLOYMENT.md`
- prerequisites
- clean install
- local run
- Docker Compose
- environment variables
- migration steps
- production deployment
- health checks
- rollback and troubleshooting

### `THIRD_PARTY_NOTICES.md`
- repository and commit
- licence
- copied/modified components
- notices/attribution
- dependency licences
- AGPL compliance decision

---

## 12. First prompt to give the new coding agent

Paste this exactly. This is an inspection-only task; it must not consume effort building features.

```text
You are the technical execution agent for ORIGINTRACE.

Read ORIGINTRACE_Execution_Blueprint.md completely. Also read ORIGINTRACE_Master_Handover.md if present.

FIRST TASK ONLY: WORKSPACE RECOVERY AND AUDIT.

1. Inspect the current workspace without modifying or deleting existing project files.
2. Identify all existing ORIGINTRACE files and all repositories.
3. Determine whether PhishGuard and URLvet are already present. Do not clone duplicates.
4. Inspect Git status, branches and uncommitted changes. Do not discard changes.
5. Identify runtimes, Docker availability and installed dependencies.
6. Read each present repository's README, LICENSE, dependency manifests, Docker configuration and API route definitions.
7. Do not assume README feature claims are working. Do not start a costly full build.
8. Do not request, print, copy or commit secrets. Do not edit .env.
9. Create/update PROJECT_STATE.md, FEATURE_MATRIX.md, INTEGRATION_PLAN.md, DEPLOYMENT.md and THIRD_PARTY_NOTICES.md with verified facts only.
10. Make a safe backup/checkpoint if possible without destroying or rewriting anything.
11. Report:
   - workspace inventory
   - repository commit hashes and licences
   - runtime/dependency requirements
   - which services can be run independently
   - exact blockers
   - exact next smallest task

Do not redesign UI, integrate services, generate application code, remove dependencies, deploy, or proceed to another stage. Stop after the audit and wait for approval.
```

---

## 13. Common failure modes and exact prevention

| Failure | Prevention |
|---|---|
| Agent exhausts quota scanning whole workspace | Read state doc first; bounded tasks; no repeated full scans |
| Duplicate repository clones | Inspect folders and Git remotes before cloning |
| One service's API differs from assumptions | Inspect routes/OpenAPI and test real response before adapter |
| Python/Go dependency conflict | Keep services separate; communicate through HTTP |
| Two dashboards remain disconnected | ORIGINTRACE owns one frontend and orchestration API |
| Environment keys missing | `.env.example`, startup validation, clear unavailable state |
| Secrets committed | `.gitignore`, secret scan, never paste `.env` |
| Frontend exposes API key | All provider calls server-side |
| SSRF reaches internal network | DNS/IP validation, redirect revalidation, egress controls |
| AI prompt injection | Treat page/email content as untrusted data |
| Engine outage crashes all scans | Adapter timeouts and partial results |
| False “safe” result on failed check | Explicit unavailable status; INCONCLUSIVE classification |
| Fake Trust Drift history | Persist snapshots; no baseline means no comparison |
| Fake graph connections | Every edge needs source and evidence |
| Fake blockchain transaction | Show only actual RPC-returned transaction data |
| eMudhra fixture cannot be found | Use authentic official incident records; disclose limitation |
| AGPL obligations ignored | Preserve licence and complete compliance review |
| Free hosting loses database | Persistent volume or managed persistent database |
| Production frontend calls localhost | Configure production API URL and exact CORS origin |
| Works locally but fails deployment | Pin versions, health checks, clean deployment smoke test |
| Last-minute changes break working app | Checkpoint before each milestone; regression tests |
| Agent deletes “unused” files | No deletion without dependency tracing and approval |

---

## 14. Demo sequence (5–7 minutes)

1. **Overview (20 sec):** show real engine health and recent cases.
2. **URL investigation (60 sec):** use a safe known test URL; show actual DNS/TLS/redirect findings and limitations.
3. **Message analysis (60 sec):** submit a clearly labelled synthetic phishing example; show language signals and extracted IOCs.
4. **Correlation + Identity Graph (60 sec):** show only relationships supported by the two investigations' evidence.
5. **Trust Drift (45 sec):** show first-scan no-baseline state, then compare two actual snapshots if available.
6. **eMudhra (60 sec):** show authentic source records, certificate details and limitations.
7. **Evidence verification (60 sec):** recompute report hash; show actual registry proof or explicitly labelled local/hash-only mode.
8. **Deployment and safety (30 sec):** show live deployed URL, service health and passive-only scope.

Never use fabricated threat examples as if they were live detections. Synthetic demo messages must be labelled synthetic.

---

## 15. Final completion definition

ORIGINTRACE is ready to submit only when:
- the deployed application starts reliably;
- the six modules are represented and their real implementation status is disclosed;
- eMudhra is included with authentic evidence;
- Identity Graph edges are evidence-backed;
- Trust Drift compares real snapshots;
- evidence hashing is reproducible and registry status is honest;
- partial/unavailable checks do not produce false safe results;
- SSRF and secret-handling controls are tested;
- deployment and demo steps are repeatable;
- all third-party licences are respected;
- `PROJECT_STATE.md`, `FEATURE_MATRIX.md`, `INTEGRATION_PLAN.md`, `DEPLOYMENT.md` and `THIRD_PARTY_NOTICES.md` are current.

**Final instruction:** Build the smallest verified step that advances this definition. Preserve working code. Keep evidence. Do not invent functionality. Do not silently reduce the specification.
