# ORIGINTRACE --- Master Project Handover

> **Purpose:** Give a fresh Antigravity workspace all the context needed
> to continue ORIGINTRACE without relying on previous chats or exhausted
> AI-agent context.

## 1. Role and working rules

Act as the senior software architect, integration engineer, full-stack
developer, security engineer and deployment engineer for ORIGINTRACE.

The user is a beginner and is currently unwell. Do not expect them to
understand Git, Docker, APIs, programming or terminal commands. Handle
technical operations wherever possible. When a click or approval is
needed, explain exactly what to click.

**Token-saving rules** - Be concise. Avoid repeatedly analysing the
whole repository. - Do not regenerate working code or documents
unnecessarily. - Work in small, verifiable stages. - After each
meaningful task, update `PROJECT_STATE.md`, `FEATURE_MATRIX.md` and
relevant technical documentation. - If context resets, read
`PROJECT_STATE.md` first and resume from its exact next action. - Never
claim a feature works without running a test.

## 2. Project identity

**Name:** ORIGINTRACE\
**Tagline:** Don't just detect a threat. Investigate its digital
identity, trace relationships, detect changes, and preserve verifiable
evidence.

Build one genuine, cloud-deployable cybersecurity investigation web
application. It must investigate suspicious URLs, domains, websites,
emails and messages; extract indicators; correlate digital
infrastructure; detect meaningful changes; and preserve verifiable
evidence.

This must not become a static HTML prototype or a collection of
disconnected dashboards.

## 3. Open-source repository candidates

### Primary application candidate: PhishGuard

Repository: <https://github.com/iampopg/PhishGuard>

Intended reuse: - Existing frontend and backend. - URL, raw-text and
email/`.eml` scanning. - AI/message analysis where functional. - IOC
extraction and enrichment. - Existing reports, history, authentication
and application infrastructure where verified.

### Specialist URL engine candidate: URLvet

Repository: <https://github.com/urlvet/urlvet>

Intended reuse: - Deep URL analysis. - DNS and domain intelligence. -
Redirect analysis. - TLS-related signals. - Typosquatting and phishing
indicators. - Credential-harvesting indicators. - Website analysis. -
Threat-intelligence integrations. - Existing API.

**These are candidates, not verified working dependencies.** Do not
assume README claims are working functionality. Inspect licences and
source, install dependencies, run both independently, test real
endpoints, and record actual limitations before integration.

If either repository fails to run, report the exact error and attempt
only a small, safe repair. Do not silently replace it with fake
functionality.

## 4. Required architecture

Build ONE application called ORIGINTRACE:

``` text
                 ORIGINTRACE FRONTEND
                         |
                ORIGINTRACE API LAYER
                         |
             Unified investigation workflow
                  /             \
         PhishGuard API       URLvet API
          (messages,           (URLs, DNS,
          email, AI,           TLS, redirects,
          IOC, reports)        website signals)
                  \             /
                ORIGINTRACE MODULES
          (correlation, graph, drift, evidence)
                         |
              UNIFIED REPORT AND STORAGE
```

Architecture rules: - Prefer PhishGuard as the primary
application/backend only after it has been successfully run and
assessed. - Run URLvet as a separate internal service and communicate
through its verified HTTP API. - Do not merge Go and Python source code
into one language unnecessarily. - Do not embed two separate
dashboards. - Do not create duplicate login systems, navigation systems,
databases or risk engines without a demonstrated need. - Create one new
ORIGINTRACE frontend and one consistent design system. - Preserve
working upstream functionality and licence notices.

## 5. Full problem-statement requirements

### Module A --- Intelligent URL and website investigation

1.  URL normalisation.
2.  Suspicious URL pattern detection.
3.  Typosquatting detection.
4.  Unicode/IDN homograph indicators.
5.  Redirect-chain analysis.
6.  Domain and DNS intelligence.
7.  Threat-intelligence lookups.
8.  Credential-harvesting indicators.
9.  Suspicious embedded links.
10. Suspicious forms and website elements.
11. Relevant public domain and IP information.
12. Evidence and explanation for every finding.

Reuse verified URLvet and PhishGuard functionality first.

### Module B --- TLS certificate and web trust

1.  Certificate expiry.
2.  Hostname and SAN validation.
3.  Certificate-chain analysis.
4.  CA trust information.
5.  Revocation checks where available.
6.  Public-key strength.
7.  Signature algorithm.
8.  TLS configuration.
9.  Certificate Transparency lookup.
10. Unexpected certificate-issuance indicators.
11. Intermediate CA investigation.
12. A genuine eMudhra incident investigation.

An issuer name alone is not proof of maliciousness. A valid TLS
certificate does not prove that a website is legitimate.

### Module C --- AI scam and message analysis

Accept SMS, email, notifications, job offers, refund messages, KYC
messages, investment offers, support impersonation and suspicious social
messages.

Detect and explain: - Social engineering. - Brand/organisation
impersonation. - Urgency and threats. - Credential requests. - Payment
requests. - Suspicious contact details. - URLs, emails and phone-number
extraction. - Related indicators. - Actionable recommendations.

Reuse working PhishGuard functionality and Gemini where appropriate.
Suspicious wording alone does not prove fraud. If the AI provider is
unavailable, report that honestly.

### Module D --- Threat correlation

Correlate repeated domains, URLs, redirect destinations, email
addresses, phone numbers, indicators across reports, impersonation
patterns and evidence-backed campaign relationships.

Start with deterministic IOC matching. Do not add complex ML
infrastructure unless it is already working and cheap to integrate.
Language similarity alone does not prove a shared campaign.

### Module E --- Passive website security assessment

1.  Security headers.
2.  HTTP/HTTPS behaviour.
3.  TLS configuration.
4.  Mixed content.
5.  Redirect behaviour.
6.  Publicly observable endpoints.
7.  Passive technology fingerprints.
8.  Version-based known-vulnerability indicators only when supported by
    evidence.

No exploitation, intrusive scanning or unauthorised testing.

### Module F --- Decentralised threat intelligence and evidence

1.  Threat report submission.
2.  Indicator recording.
3.  Campaign summaries.
4.  Cryptographic report fingerprints.
5.  Evidence references.
6.  Tamper-evident history.
7.  Report revisions.
8.  Dispute and provenance records.
9.  SHA-256 verification.
10. Blockchain report registry or reproducible local EVM implementation.

Never put sensitive personal information or raw messages on-chain.
Blockchain integrity does not prove that a finding is true.

## 6. Three required differentiators

### A. Digital Identity Graph

Represent evidence-backed relationships among: - Claimed brand. -
Domain. - DNS records. - IP address. - TLS certificate. - Redirect
destinations. - Threat indicators. - Investigation reports.

Every relationship needs an evidence source. Shared hosting or an IP
address does not prove common ownership.

### B. Trust Drift

Store timestamped investigation snapshots and compare DNS, IP addresses,
certificates, redirect destinations, security headers and relevant
website fingerprints.

If there is no previous snapshot, say historical comparison is
unavailable. Never fabricate history.

### C. Verifiable Threat Evidence

Generate a SHA-256 fingerprint for an investigation report. Register it
on an EVM test network or reproducible local chain and provide
independent verification.

Never invent contract addresses, transaction hashes or verification
success.

## 7. Security and privacy requirements

Implement SSRF protection: - Block localhost, private/reserved,
link-local and CGNAT IP ranges. - Validate IPv4 and IPv6. - Resolve and
validate all DNS answers. - Revalidate every redirect. - Restrict
protocols and ports. - Apply request timeouts and response-size
limits. - Do not execute arbitrary JavaScript or download dangerous
files.

Also: - Rate-limit endpoints. - Keep API credentials server-side. -
Treat submitted webpages and messages as untrusted data. - Protect AI
prompts against prompt injection. - Minimise personal-data retention. -
Never request passwords, OTPs, private keys or seed phrases. - Never put
sensitive user data on-chain. - A failed API must be
unavailable/inconclusive, never automatically safe.

## 8. Unified result schema

Create and document one common result schema. Example:

``` json
{
  "investigation_id": "generated-id",
  "target": "investigated-target",
  "classification": "SUSPICIOUS",
  "timestamp": "ISO-8601",
  "checks": [
    {
      "module": "tls",
      "status": "completed",
      "finding": "Example finding",
      "severity": "info",
      "evidence": [],
      "source": "verified-engine"
    }
  ],
  "indicators": [],
  "relationships": [],
  "limitations": []
}
```

Classifications: - LOW RISK - SUSPICIOUS - HIGH RISK - CONFIRMED
MALICIOUS - INCONCLUSIVE

Keep risk and confidence separate. Do not invent numerical confidence
scores. Preserve original findings, evidence, sources, timestamps and
limitations.

## 9. New unified UI/UX

Create a completely new ORIGINTRACE interface: - Premium cybersecurity
investigation feel. - Dark navy/charcoal with restrained blue and teal
accents. - Professional typography, clean spacing and readable
hierarchy. - Responsive desktop and mobile layouts. - Simple analyst
workflow; avoid clutter and excessive animation.

Navigation: 1. Overview. 2. Investigate. 3. Digital Identity Graph. 4.
Trust Drift. 5. eMudhra Investigation. 6. Evidence Vault. 7.
Investigation History. 8. Settings.

Investigation workspace must accept: - URL. - Domain. - Pasted
message. - Email. - EML file.

Provide one **Start Investigation** action.

Investigation report sections: 1. Executive summary. 2. Classification.
3. Risk indicators. 4. URL and domain findings. 5. DNS and IP findings.
6. TLS findings. 7. Message analysis. 8. Website security findings. 9.
Extracted indicators. 10. Digital Identity Graph. 11. Trust Drift. 12.
Evidence sources. 13. Limitations. 14. SHA-256 fingerprint. 15.
Blockchain verification status.

Every result must come from a real backend response or be explicitly
labelled sample/demo data. Do not display fake statistics, findings,
transactions or historical records.

## 10. Cloud deployment target

Prefer Docker Compose and one cloud VPS if available.

Potential services: - ORIGINTRACE main application. - URLvet backend. -
URLvet Chrome service. - URLvet cache service. - Persistent
investigation/report storage. - Reverse proxy with HTTPS.

Do not expose internal backend, browser or cache ports publicly. Keep
API keys in environment variables. Check actual CPU, RAM, storage and
network requirements. Do not assume free hosting platforms can run every
Docker service.

## 11. Team responsibilities

-   User: main integration, unified UI and final project.
-   Friend 1: PhishGuard and AI/message functionality.
-   Friend 2: URLvet, TLS and eMudhra investigation.

Avoid simultaneous edits to the same files. Use separate branches or
clones where possible. The user is a beginner: handle Git operations for
them whenever possible, and explain any required approval.

## 12. Persistent project documents --- essential for context resets

Create and maintain:

### `PROJECT_STATE.md`

Current status, verified working features, incomplete work, blockers and
the exact next action.

### `FEATURE_MATRIX.md`

Every official requirement with status (`implemented`, `partial`,
`missing`, `unverified`), source file/endpoint and test evidence.

### `INTEGRATION_PLAN.md`

Verified architecture, API endpoints, service ports, environment
variables, database and integration decisions.

### `DEPLOYMENT.md`

Setup/deployment instructions, environment variables, Docker commands
and troubleshooting.

### `THIRD_PARTY_NOTICES.md`

Reused repositories, licences, attribution and required source
obligations.

After every meaningful task: 1. Update `PROJECT_STATE.md`. 2. Update
`FEATURE_MATRIX.md`. 3. Record actual test results. 4. Record blockers
and the next exact task.

If context resets, read `PROJECT_STATE.md` first. Do not repeat
completed tasks unless a test fails.

## 13. Execution sequence --- do not skip stages

**Stage 1 --- Protect and inspect** - Inspect the current workspace and
existing ORIGINTRACE files. - Check whether Git is initialised. - Check
whether previous project files are present. - Create a backup/checkpoint
before changes. - Never overwrite or delete existing work without
explaining and obtaining approval.

**Stage 2 --- Acquire repositories** - Clone PhishGuard and URLvet into
separate folders. - Preserve their original source and licence files.

**Stage 3 --- Verify independently** - Install and run each application
independently. - Test actual URL, message and email workflows. - Verify
API endpoints, response formats, storage and Docker services. - Record
exact commands and errors.

**Stage 4 --- Integrate backend** - Choose the verified primary
application. - Run URLvet as an internal service. - Create an API
adapter. - Create the common ORIGINTRACE result schema. - Test success,
timeout, malformed response and service-unavailable cases.

**Stage 5 --- Build unified frontend** - Create the new ORIGINTRACE
UI. - Use one API client and one navigation system. - Connect real
backend endpoints. - Show honest unavailable states for unfinished
modules.

**Stage 6 --- Add original modules** - Gemini scam/message functionality
if not already covered. - IOC correlation. - Genuine eMudhra
investigation. - Digital Identity Graph. - Trust Drift. - SHA-256 and
blockchain verification.

**Stage 7 --- Security and regression tests** - SSRF protections. -
Redirect validation. - Timeouts and upload limits. - Authentication and
rate limits. - API-key exposure checks. - End-to-end URL and message
investigations. - Evidence integrity and honest failure states.

**Stage 8 --- Deploy** - Verify Docker Compose build and service
health. - Configure HTTPS and persistent storage. - Keep internal
services private. - Test the deployed application.

Do not start a later stage while a critical earlier dependency is
broken.

## 14. First action in this new workspace

Do not generate a new application or redesign the UI yet.

First: 1. Inspect the workspace. 2. Identify existing ORIGINTRACE files.
3. Check whether the previous project is available. 4. Check whether
PhishGuard or URLvet are already present. 5. Check Git status and
protect existing work. 6. Create the persistent project documents. 7.
Clone only repositories that are missing. 8. Run both applications
independently.

**First milestone: both candidate applications start successfully and
their actual functionality is verified.**

At the end of each task, tell the user: - What you completed. - What was
tested. - What failed. - Exactly what they need to click or approve
next.

The goal is one genuinely working, deployed ORIGINTRACE application ---
not a large quantity of unverified code.
