# ORIGINTRACE

**Don't just detect a threat. Investigate its digital identity.**

ORIGINTRACE is a cybersecurity investigation platform concept built around a simple idea: a suspicious link should not end with a one-word *safe* or *dangerous* verdict. People need to understand what they are looking at, what evidence supports the result, how related indicators connect, and what they should do next.

It brings URL and website investigation, suspicious-message analysis, digital-identity relationships and verifiable investigation evidence into one workflow.

> **Project status:** ORIGINTRACE is under active development. This README describes the intended product and design. Individual integrations and modules must be considered implemented only when verified in the running application and documented with test evidence.

---

## Why we started building it

Phishing rarely arrives as an isolated URL. A message may impersonate a known organisation, point to a lookalike domain, redirect through other infrastructure and collect credentials. A basic URL reputation result can miss the wider context — and a person who has already clicked needs practical guidance, not just a warning.

We wanted to bring those pieces together in a single investigation experience, while keeping the evidence and limitations visible.

## What ORIGINTRACE is designed to do

| Capability | What it helps investigate |
|---|---|
| **URL & website analysis** | Suspicious URL patterns, redirects, domain/DNS signals and observable website indicators. |
| **Message & email analysis** | Social-engineering language, impersonation signals and indicators extracted from messages. |
| **TLS & certificate investigation** | Certificate identity, validity, hostname matching and trust-related evidence where available. |
| **Threat correlation** | Repeated domains, IPs, email addresses and other exact indicators across investigations. |
| **Digital Identity Graph** | Evidence-backed relationships between domains, IPs, certificates, redirects, brands and indicators. |
| **Trust Drift** | Changes between genuine, timestamped observations of the same target. |
| **Verifiable evidence** | Report fingerprints and integrity checks, with registry/blockchain status clearly identified. |
| **Exposure response** | A guided path for people who may already have opened a link or shared sensitive information. |

Some capabilities depend on external services, credentials, reliable source data or completed integration. An unavailable check must be shown as unavailable or inconclusive — never silently treated as a clean result.

## What makes it different

### 1. From a verdict to an investigation
A result should explain *why* a link or message deserves attention. ORIGINTRACE is designed to preserve the signals, sources and limitations behind each finding.

### 2. Digital Identity Graph
Instead of presenting indicators as disconnected rows, the graph is intended to show how observed domains, DNS/IP records, certificates, redirects and extracted indicators relate. Every relationship needs supporting evidence; a shared IP alone does not prove common ownership.

### 3. Trust Drift
A domain can change after an initial investigation. Trust Drift compares real snapshots over time, such as DNS, certificates and redirects. It does not invent a historical baseline when none exists.

### 4. Help after the click
A warning is not enough if someone has already interacted with a suspicious page. The planned exposure-response flow guides people towards proportionate next steps based on what they say they shared or did.

## How an investigation should work

1. **Submit** a URL, domain, message or email.
2. **Analyse** the input using the relevant investigation engines and configured data sources.
3. **Extract** observable indicators and preserve their evidence and source.
4. **Correlate** exact indicators with related observations where supported.
5. **Explain** the findings in one readable investigation report.
6. **Act** on the result with practical next steps and, where available, evidence-integrity tools.

## Technical approach

The project plan uses a modular integration approach. PhishGuard and URLvet are candidate open-source foundations for message/email and URL investigation respectively; their current code, API contracts, licences and runtime behaviour must be verified before relying on any capability. ORIGINTRACE is intended to provide the unified experience and connect verified services through documented interfaces.

The implementation is expected to include:

- A unified frontend and investigation workflow.
- API adapters and a normalised investigation-result format.
- Persistent case, snapshot, indicator and evidence records where required.
- Evidence provenance and timestamps for findings and graph relationships.
- Defensive URL-fetching controls, including SSRF protection, redirect validation, timeouts and response limits.
- Server-side handling of API credentials and clear failure states for unavailable providers.

**The exact framework versions, deployment topology, API endpoints and completion status should be taken from the current source code and deployment documentation, not assumed from this overview.**

## Risk labels are not guarantees

ORIGINTRACE should distinguish risk from confidence and explain the checks that actually completed:

- **Low risk:** no malicious indicators were found within the checks that completed. This is not a guarantee of safety.
- **Suspicious:** one or more potentially deceptive or unsafe indicators were observed.
- **High risk:** multiple significant indicators are supported by evidence.
- **Confirmed malicious:** requires authoritative threat intelligence or sufficiently verified malicious evidence.
- **Inconclusive:** evidence is insufficient, a check is unsupported, or a required service is unavailable.

A valid TLS certificate does not prove that a business is legitimate. A failed API call does not mean a target is safe.

## eMudhra investigation

The project includes a dedicated investigation track for the reported eMudhra/emSign certificate-security incident. It must rely on authentic official communications and verifiable public certificate records, distinguish intermediate CA certificates from end-entity certificates, and record the source and retrieval time. No certificate fixture, revocation claim or affected-site claim should be fabricated.

## Repository map

The structure below is illustrative. Update it to match the actual repository before publishing:

```text
ORIGINTRACE/
├── frontend/              # Unified user interface (if present)
├── backend/               # API and orchestration layer (if present)
├── integrations/          # Adapters for verified external engines
├── docs/                  # Architecture, setup and project notes
├── tests/                 # Automated and integration tests
├── .env.example           # Variable names only; never real secrets
├── README.md
└── DEPLOYMENT.md          # Setup and deployment instructions (if present)
```

## Getting started

The exact setup commands depend on the current checked-out implementation. Please follow the maintained setup guide rather than guessing commands:

1. Clone this repository.
2. Check the prerequisites and environment-variable list in `DEPLOYMENT.md` or the project documentation.
3. Create a local environment file from the example, if one is provided.
4. Add required API credentials locally; never commit them.
5. Install dependencies and start the services using the documented commands.
6. Run the documented tests and health checks before using the application.

If setup instructions are not yet present, that is a documentation task still to complete — do not treat this README as proof that the application is production-ready.

## Safety and privacy

- Never submit passwords, OTPs, PINs, private keys or seed phrases for analysis.
- Keep API keys and service credentials out of frontend bundles, logs and Git history.
- Treat submitted messages and web pages as untrusted content.
- URL fetching must defend against requests to localhost, private and reserved networks, including through redirects and DNS changes.
- Do not put raw messages or personal information on a public blockchain.
- A cryptographic hash can help verify that a report has not changed; it does not prove that the report's claims are true.

## Current development priorities

- Verify the existing services, their licences and real API contracts.
- Make one URL investigation work end-to-end with persisted, explainable results.
- Connect message analysis and extracted indicators to the same case workflow.
- Make the Digital Identity Graph evidence-backed and refresh correctly.
- Implement genuine snapshot-based Trust Drift.
- Verify the eMudhra investigation against authentic sources.
- Test report integrity, security controls and clean deployment.

## Contributing

Issues, bug reports and thoughtful contributions are welcome. Before opening a pull request:

1. Describe the problem and the expected behaviour.
2. Keep changes focused; avoid unrelated rewrites.
3. Add or update tests for changed behaviour.
4. Document new environment variables and external dependencies.
5. Never include credentials, personal data or fabricated test evidence.

## A note on the name

**ORIGINTRACE** reflects the goal of tracing a suspicious digital interaction back through the observable infrastructure and evidence connected to it.

---

*Built as a hackathon project with a focus on practical cybersecurity, explainable findings and a clear user experience.*
