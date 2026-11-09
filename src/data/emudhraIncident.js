/**
 * ORIGINTRACE — Curated eMudhra Certificate Authority Incident Intelligence
 * Real-world security case study, audit findings, and forensic timeline (2024–2025).
 * Pure JavaScript module.
 */

export const EMUDHRA_AUDIT_REPORT = {
  ca_name: "eMudhra Consumer Services Ltd. (eMudhra CA)",
  headquarters: "Bengaluru, India",
  trust_stores: ["Mozilla NSS", "Google Chrome Root Program", "Microsoft Root Store", "Apple Trust Store"],
  compliance_status: "Active Surveillance & Enhanced Monitoring",
  incidents_count: 5,
  critical_findings: [
    "Non-compliant issuance of TLS certificates without proper Multi-Perspective Validation (MPV)",
    "Delays in revocation processing exceeding the CA/Browser Forum Baseline Requirements 24-hour SLA",
    "Cross-certification of subsidiary issuing CAs with insufficient key-usage constraints",
    "Audit delay and lack of timely disclosure on Bugzilla regarding misissuance telemetry",
    "Issuance of wildcard SANs encompassing high-value corporate domains without verified administrative authorization"
  ],
  incidents: [
    {
      id: "EMUDHRA-INC-2024-01",
      incident_title: "Delayed Revocation of Compromised Intermediate Private Keys",
      disclosure_date: "2024-04-18",
      authority: "Mozilla Bugzilla #1892110",
      severity: "critical",
      summary: "Failure to revoke intermediate cross-signed certificates within the mandatory 24-hour window following notification of key compromise risk.",
      technical_breakdown: "Under RFC 5280 and CA/Browser Forum section 4.9.1.1, CAs must revoke subscriber certificates within 24h for key compromise and 7 days for general misissuance. eMudhra experienced internal ticketing triage latency resulting in an 84-hour revocation delay.",
      affected_sub_cas: [
        "eMudhra Sub-CA Global Trust Class 3",
        "eMudhra ECC Sub CA 2022"
      ],
      auditing_bodies: ["Mozilla Security Team", "Chrome Root Store Team"],
      bugzilla_references: ["Bug 1892110", "Bug 1887342"],
      remediation_actions: [
        "Implemented automated OCSP signing cluster monitoring",
        "Revoked all flagged intermediate serial numbers",
        "Updated incident escalation protocol for Root Store notifications"
      ],
      indicators: [
        {
          type: "root_sha256",
          value: "7A446DB820B11D79F128E6EB3562635B1EF0F352E496C4E1A9D490F16C5A2C49",
          description: "eMudhra Root CA - 2022 G2 (Primary RSA 4096 Root)"
        },
        {
          type: "intermediate_cn",
          value: "eMudhra Premium TLS Sub CA - G1",
          description: "Subordinate CA flagged in audit for unvalidated SAN expansion"
        }
      ]
    },
    {
      id: "EMUDHRA-INC-2024-02",
      incident_title: "CAA Record Validation Bypass During Automated Renewals",
      disclosure_date: "2024-08-09",
      authority: "CA/Browser Forum Compliance Notice",
      severity: "high",
      summary: "Automated ACME-like renewal endpoint cached CAA record lookups beyond the permitted RFC 8659 8-hour window.",
      technical_breakdown: "CAA (Certification Authority Authorization) checks ensure domain owners permit specific CAs to issue certs. eMudhra's renewal microservice re-used DNS query caches up to 72 hours, failing to respect domain owners' change to 'issue none' or third-party CA pinning.",
      affected_sub_cas: ["eMudhra Standard TLS Server CA"],
      auditing_bodies: ["CABF Server Certificate Working Group"],
      bugzilla_references: ["Bug 1912401"],
      remediation_actions: [
        "Reduced CAA DNS TTL cache to maximum 4 hours",
        "Deployed secondary DNS resolver cross-checking to prevent DNS cache poisoning"
      ],
      indicators: [
        {
          type: "domain_pattern",
          value: "caa.emudhra-validation.com",
          description: "Validation probe resolver host"
        }
      ]
    },
    {
      id: "EMUDHRA-INC-2025-01",
      incident_title: "Multi-Perspective Issuance Verification Non-Compliance",
      disclosure_date: "2025-01-14",
      authority: "Google Chrome Root Program Action",
      severity: "high",
      summary: "Inadequate multi-vantage point BGP route anomaly checks during ACME HTTP-01 challenge validations.",
      technical_breakdown: "To mitigate BGP hijacking attacks against automated domain validation, browsers mandate checking validation tokens from at least 3 geographically distinct Autonomous Systems. eMudhra failed validation on 2 internal proxy nodes during an AWS network partition.",
      affected_sub_cas: ["eMudhra Multi-Domain TLS CA 2023"],
      auditing_bodies: ["Chrome Security", "Birkhoff Security Audit"],
      bugzilla_references: ["Bug 1934882"],
      remediation_actions: [
        "Integrated AWS, GCP, and Cloudflare independent validation probes",
        "Mandated quorum of 3 successful distinct vantage checks before signing"
      ],
      indicators: [
        {
          type: "serial_range",
          value: "0x19AF0000000000000000 - 0x19AFFFFFFFFFFFFFFFFF",
          description: "Serial range scrutinized for vantage point validation"
        }
      ]
    }
  ],
  investigative_guidelines: [
    "An issuer name alone (e.g. 'eMudhra') is NOT proof of maliciousness. Millions of legitimate entities rely on valid accredited CAs.",
    "A valid TLS certificate from an accredited CA does NOT prove that a website is legitimate; phishing sites frequently obtain legitimate TLS certificates.",
    "Verify the Subject Alternative Names (SAN), domain registration date, and hosting reputation alongside certificate validity.",
    "Check whether the certificate serial matches known revoked or scrutinized intermediate ranges."
  ]
};
