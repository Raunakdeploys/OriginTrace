import { UnifiedInvestigationResult } from '../types/investigation';

export const SAMPLE_INVESTIGATIONS: UnifiedInvestigationResult[] = [
  {
    investigation_id: "ORIGIN-2025-CHASE-0941",
    target: "https://chase-security-verify.net/auth/login",
    target_type: "url",
    timestamp: "2026-11-08T18:42:10Z",
    classification: "CONFIRMED MALICIOUS",
    risk_score: 96,
    confidence: "HIGH",
    summary: "Active credential harvesting portal impersonating JPMorgan Chase & Co. Employs brand typosquatting, recently registered domain (4 days old), Russian bulletproof hosting infrastructure, and hidden password interception endpoints.",
    is_sample_data: true,
    checks: [
      {
        id: "CHK-URL-01",
        module: "url",
        title: "Typosquatting & Brand Keyword Extraction",
        finding: "High-value financial brand keyword 'chase' concatenated with deceptive security lures ('security-verify').",
        severity: "critical",
        status: "failed",
        scoreImpact: 35,
        evidence: [
          { key: "Target Brand", value: "JPMorgan Chase" },
          { key: "Levenshtein Distance", value: 1 },
          { key: "Keyword Pattern", value: "brand-security-verify" }
        ],
        source: "ORIGINTRACE-Typosquat-Engine"
      },
      {
        id: "CHK-DNS-02",
        module: "dns",
        title: "Bulletproof Autonomous System & Rapid IP Shifts",
        finding: "Resolved IP (185.220.101.42) belongs to an Autonomous System with high threat density (AS204957 - Stark Industries Solutions).",
        severity: "high",
        status: "failed",
        scoreImpact: 25,
        evidence: [
          { key: "IP Address", value: "185.220.101.42" },
          { key: "ASN", value: "AS204957" },
          { key: "Abuse Confidence", value: "92%" }
        ],
        source: "ORIGINTRACE-Network-Prober"
      },
      {
        id: "CHK-TLS-03",
        module: "tls",
        title: "Short-Lived Automated TLS Certificate",
        finding: "Valid TLS cert issued via automated Let's Encrypt ACME with mismatched SAN entries. Valid TLS does NOT prove domain authenticity.",
        severity: "medium",
        status: "warning",
        scoreImpact: 15,
        evidence: [
          { key: "Issuer", value: "Let's Encrypt R3" },
          { key: "Valid From", value: "2026-11-04" },
          { key: "Days Remaining", value: 86 }
        ],
        source: "ORIGINTRACE-TLS-Engine"
      },
      {
        id: "CHK-CONTENT-04",
        module: "content",
        title: "Credential Interception & Form Exfiltration",
        finding: "HTML DOM contains hidden iframe posting user credentials to external Telegram bot web-hook API.",
        severity: "critical",
        status: "failed",
        scoreImpact: 21,
        evidence: [
          { key: "Form Action", value: "https://api.telegram.org/bot712.../sendMessage" },
          { key: "Harvested Fields", value: "username, password, ssn_last4, otp" }
        ],
        source: "PhishGuard-DOM-Extractor"
      }
    ],
    indicators: [
      { type: "domain", value: "chase-security-verify.net", context: "Phishing Landing Domain", reputation: "malicious" },
      { type: "ip", value: "185.220.101.42", context: "Host Server IP", reputation: "malicious" },
      { type: "url", value: "https://chase-security-verify.net/auth/login", context: "Credential Harvester URL", reputation: "malicious" },
      { type: "email", value: "drop-logs@onionmail.org", context: "Credential Exfiltration Drop", reputation: "suspicious" },
      { type: "cert_sha256", value: "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855", context: "Leaf TLS Fingerprint", reputation: "suspicious" }
    ],
    dns_data: {
      a_records: ["185.220.101.42"],
      aaaa_records: [],
      mx_records: ["10 mail.chase-security-verify.net"],
      ns_records: ["ns1.offshoredns.is", "ns2.offshoredns.is"],
      txt_records: ["v=spf1 +all"],
      reverse_ptr: ["host-42.stark-vps.is"]
    },
    tls_data: {
      subject_cn: "chase-security-verify.net",
      subject_alt_names: ["chase-security-verify.net", "www.chase-security-verify.net"],
      issuer_org: "Let's Encrypt",
      issuer_cn: "R3",
      valid_from: "2026-11-04T12:00:00Z",
      valid_to: "2027-02-02T12:00:00Z",
      days_remaining: 86,
      protocol: "TLSv1.3",
      cipher_suite: "TLS_AES_256_GCM_SHA384",
      key_length: 2048,
      signature_algorithm: "sha256WithRSAEncryption",
      is_trusted_ca: true,
      is_expired: false,
      has_sct_transparency: true
    },
    redirect_chain: [
      { hop: 1, url: "http://chase-security-verify.net/auth/login", status_code: 301, ip: "185.220.101.42" },
      { hop: 2, url: "https://chase-security-verify.net/auth/login", status_code: 200, ip: "185.220.101.42" }
    ],
    security_headers: {
      hsts: false,
      csp: false,
      x_frame_options: "DENY",
      x_content_type_options: false,
      referrer_policy: "no-referrer"
    },
    identity_graph: {
      nodes: [
        { id: "brand_chase", label: "Chase Bank (Impersonated)", type: "brand", severity: "critical" },
        { id: "domain_phish", label: "chase-security-verify.net", type: "domain", severity: "critical" },
        { id: "dns_ns", label: "ns1.offshoredns.is", type: "dns_record", severity: "high" },
        { id: "ip_host", label: "185.220.101.42 (Russia)", type: "ip_address", severity: "critical" },
        { id: "tls_cert", label: "Let's Encrypt R3 Cert", type: "tls_cert", severity: "medium" },
        { id: "exfil_tg", label: "Telegram Bot API (Drop)", type: "indicator", severity: "critical" }
      ],
      edges: [
        { id: "e1", source: "domain_phish", target: "brand_chase", relationship: "impersonates", evidenceSource: "Levenshtein Brand Keyword Heuristic" },
        { id: "e2", source: "domain_phish", target: "dns_ns", relationship: "delegated_to", evidenceSource: "Authoritative NS Query" },
        { id: "e3", source: "domain_phish", target: "ip_host", relationship: "resolves_to", evidenceSource: "DNS A Record Query" },
        { id: "e4", source: "domain_phish", target: "tls_cert", relationship: "secured_by", evidenceSource: "TLS Handshake SAN Inspection" },
        { id: "e5", source: "domain_phish", target: "exfil_tg", relationship: "exfiltrates_to", evidenceSource: "DOM Action Endpoint Extraction" }
      ]
    },
    trust_drift: {
      target: "chase-security-verify.net",
      has_previous_snapshot: true,
      baseline_timestamp: "2026-11-04T12:00:00Z",
      current_timestamp: "2026-11-08T18:42:10Z",
      changes_detected: [
        {
          category: "ip",
          field: "A Record",
          previous_value: "127.0.0.1 (Parked)",
          current_value: "185.220.101.42 (Active Exfiltration)",
          risk_implication: "Domain moved from registrar parking pool to active bulletproof hosting infrastructure.",
          severity: "critical"
        },
        {
          category: "dns",
          field: "Nameservers",
          previous_value: "dns1.namecheaphosting.com",
          current_value: "ns1.offshoredns.is",
          risk_implication: "Migrated to privacy-shielded bulletproof nameservers commonly tied to phishing kits.",
          severity: "high"
        },
        {
          category: "tls",
          field: "Certificate",
          previous_value: "None",
          current_value: "Let's Encrypt R3 (Issued 2026-11-04)",
          risk_implication: "New TLS certificate provisioned to bypass browser insecure warnings.",
          severity: "medium"
        }
      ],
      drift_score: 88,
      notes: "High trust drift detected across IP, nameservers, and certificate. Classic weaponization pattern within 96 hours of domain registration."
    },
    evidence: {
      report_id: "ORIGIN-2025-CHASE-0941",
      canonical_sha256: "d5a6b7e89104cfbc192847a98b76c543210e4a9b8c7d6e5f4a3b2c1d0e9f8a7b",
      timestamp: "2026-11-08T18:42:10Z",
      algorithm: "SHA-256",
      block_registered: true,
      evm_tx_hash: "0x89ab4c7d91e320f9a765cb14e21a8890cd334e2b109af3487c5e21908bf41da7",
      evm_block_number: 19842103,
      contract_address: "0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE",
      tamper_status: "verified_intact",
      provenance_signature: "ECDSA-secp256k1:0x4fa87102bce9...verified"
    },
    limitations: [
      "Target server blocked secondary crawler vantage from European subnet.",
      "WHOIS privacy proxy obscured the true registrant identity."
    ]
  },
  {
    investigation_id: "ORIGIN-2025-MSG-7712",
    target: "SMS / Bank Notification Scam Message",
    target_type: "message",
    timestamp: "2026-11-08T19:15:22Z",
    classification: "HIGH RISK",
    risk_score: 89,
    confidence: "HIGH",
    summary: "High-urgency bank impersonation message alleging immediate account termination within 24 hours. Requests user to click an unvetted bit.ly shortlink and verify debit card CVV.",
    is_sample_data: true,
    checks: [
      {
        id: "CHK-AI-01",
        module: "ai_message",
        title: "Social Engineering: Artificial Urgency & Coercion",
        finding: "Threatens immediate financial freeze ('Your debit access is suspended!') to prompt panic-driven compliance.",
        severity: "critical",
        status: "failed",
        scoreImpact: 35,
        evidence: [
          { key: "Tactic", value: "Fear & Urgency" },
          { key: "Deadline Claimed", value: "Within 24 hours" },
          { key: "Linguistic Score", value: "9.4/10" }
        ],
        source: "Gemini-3.8-Flash-Intelligence"
      },
      {
        id: "CHK-AI-02",
        module: "ai_message",
        title: "Direct Request for Restricted Credentials",
        finding: "Explicitly requests 3-digit CVV and full card number under the guise of an identity restoration check.",
        severity: "critical",
        status: "failed",
        scoreImpact: 30,
        evidence: [
          { key: "Requested Secret", value: "Card Number + CVV + PIN" },
          { key: "PCI-DSS Risk", value: "Critical" }
        ],
        source: "Gemini-3.8-Flash-Intelligence"
      },
      {
        id: "CHK-URL-03",
        module: "url",
        title: "URL Shortener Cloaking & Evasion",
        finding: "Message routes recipient through a bit.ly shortlink obscuring the true phishing host.",
        severity: "high",
        status: "warning",
        scoreImpact: 24,
        evidence: [
          { key: "Shortlink", value: "https://bit.ly/bank-auth-99" },
          { key: "Resolved Dest", value: "http://104.244.78.19/restore/" }
        ],
        source: "ORIGINTRACE-URL-Unshortener"
      }
    ],
    indicators: [
      { type: "phone", value: "+1 (800) 555-0199", context: "Spoofed Support Caller ID", reputation: "suspicious" },
      { type: "url", value: "https://bit.ly/bank-auth-99", context: "Shortened Bait Link", reputation: "malicious" },
      { type: "ip", value: "104.244.78.19", context: "Final Redirect Host", reputation: "malicious" }
    ],
    message_analysis: {
      intent: "Credential Theft & Payment Card Cloning",
      urgency_level: "critical",
      social_engineering_tactics: [
        "Manufactured panic via threat of account freezing",
        "Short artificial compliance window (24 hours)",
        "Authority impersonation (Bank Fraud Prevention Unit)"
      ],
      impersonated_entities: ["Wells Fargo Risk Management"],
      credential_requests: ["Debit Card Number", "Expiration Date", "CVV", "Online Banking PIN"],
      payment_requests: ["None direct; secondary wire diversion expected post-compromise"],
      actionable_recommendations: [
        "Do NOT click the bit.ly link or provide card security codes.",
        "Report the incoming SMS sender number to your telecom spam registry (7726).",
        "Log into your official banking app through a verified bookmark or app store client."
      ]
    },
    identity_graph: {
      nodes: [
        { id: "sender_num", label: "+1 (800) 555-0199", type: "actor", severity: "high" },
        { id: "target_brand", label: "Wells Fargo", type: "brand", severity: "critical" },
        { id: "shortlink", label: "bit.ly/bank-auth-99", type: "redirect", severity: "high" },
        { id: "dest_ip", label: "104.244.78.19", type: "ip_address", severity: "critical" }
      ],
      edges: [
        { id: "m1", source: "sender_num", target: "target_brand", relationship: "impersonates", evidenceSource: "Message Header Body Match" },
        { id: "m2", source: "sender_num", target: "shortlink", relationship: "distributes", evidenceSource: "SMS Text Extraction" },
        { id: "m3", source: "shortlink", target: "dest_ip", relationship: "redirects_to", evidenceSource: "HTTP 301 Location Header" }
      ]
    },
    evidence: {
      report_id: "ORIGIN-2025-MSG-7712",
      canonical_sha256: "9f8e7d6c5b4a39281706f5e4d3c2b1a0987654321fedcba0987654321abcdef0",
      timestamp: "2026-11-08T19:15:22Z",
      algorithm: "SHA-256",
      block_registered: true,
      evm_tx_hash: "0x12bc34de56fa7890bcde1234567890abcdef1234567890abcdef1234567890ab",
      evm_block_number: 19842289,
      contract_address: "0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE",
      tamper_status: "verified_intact",
      provenance_signature: "ECDSA-secp256k1:0x89ac...verified"
    },
    limitations: [
      "SMS header spoofing prevents reliable reverse-carrier lookup on toll-free sender numbers."
    ]
  },
  {
    investigation_id: "ORIGIN-2025-EMUDHRA-019",
    target: "https://secure-auth-emudhra-banking.net",
    target_type: "url",
    timestamp: "2026-11-08T20:10:00Z",
    classification: "SUSPICIOUS",
    risk_score: 72,
    confidence: "MEDIUM",
    summary: "Suspicious banking gateway utilizing an eMudhra-issued TLS certificate with inconsistent SAN entries and recent intermediate CA scrutiny flags. Demonstrates that valid CA certification alone does not establish web authenticity.",
    is_sample_data: true,
    checks: [
      {
        id: "CHK-EMUDHRA-01",
        module: "tls",
        title: "eMudhra Subordinate CA Audit Correlation",
        finding: "Certificate issued by 'eMudhra Premium TLS Sub CA - G1', an intermediate CA currently under enhanced surveillance by browser root programs.",
        severity: "high",
        status: "warning",
        scoreImpact: 30,
        evidence: [
          { key: "Intermediate CA", value: "eMudhra Premium TLS Sub CA - G1" },
          { key: "Audit Notice", value: "Bugzilla #1892110 Revocation SLA" },
          { key: "Root Store Status", value: "Surveillance Active" }
        ],
        source: "ORIGINTRACE-CA-Audit-Engine"
      },
      {
        id: "CHK-SAN-02",
        module: "tls",
        title: "Mismatched Subject Alternative Names (SAN)",
        finding: "Certificate SAN list incorporates 14 disparate unbranded domains alongside financial keywords, typical of shared bulk ACME issuance.",
        severity: "medium",
        status: "warning",
        scoreImpact: 20,
        evidence: [
          { key: "Primary Host", value: "secure-auth-emudhra-banking.net" },
          { key: "SAN Count", value: 15 },
          { key: "Shared SAN Domain", value: "cloud-vps-direct.net" }
        ],
        source: "ORIGINTRACE-TLS-Engine"
      },
      {
        id: "CHK-SEC-03",
        module: "headers",
        title: "Absence of HSTS and CSP Security Headers",
        finding: "Target website omits HTTP Strict Transport Security (HSTS) and Content Security Policy (CSP), leaving visitors vulnerable to downgrade attacks.",
        severity: "medium",
        status: "warning",
        scoreImpact: 22,
        evidence: [
          { key: "Strict-Transport-Security", value: "Missing" },
          { key: "Content-Security-Policy", value: "Missing" }
        ],
        source: "ORIGINTRACE-Passive-Header-Auditor"
      }
    ],
    indicators: [
      { type: "domain", value: "secure-auth-emudhra-banking.net", context: "Investigated Domain", reputation: "suspicious" },
      { type: "cert_sha256", value: "8A4C910041DF832049BA11203948572019485720194857201948572019485720", context: "eMudhra Leaf SHA-256", reputation: "suspicious" }
    ],
    tls_data: {
      subject_cn: "secure-auth-emudhra-banking.net",
      subject_alt_names: ["secure-auth-emudhra-banking.net", "cloud-vps-direct.net"],
      issuer_org: "eMudhra Consumer Services Ltd.",
      issuer_cn: "eMudhra Premium TLS Sub CA - G1",
      valid_from: "2026-09-01T00:00:00Z",
      valid_to: "2027-09-01T23:59:59Z",
      days_remaining: 296,
      protocol: "TLSv1.3",
      cipher_suite: "TLS_AES_128_GCM_SHA256",
      key_length: 2048,
      signature_algorithm: "sha256WithRSAEncryption",
      is_trusted_ca: true,
      is_expired: false,
      has_sct_transparency: true,
      is_emudhra_issued: true
    },
    identity_graph: {
      nodes: [
        { id: "domain_em", label: "secure-auth-emudhra-banking.net", type: "domain", severity: "high" },
        { id: "ca_emudhra", label: "eMudhra Sub CA - G1", type: "tls_cert", severity: "high" },
        { id: "root_emudhra", label: "eMudhra Root CA - 2022", type: "tls_cert", severity: "medium" },
        { id: "asn_ovh", label: "AS16276 (OVH SAS)", type: "ip_address", severity: "medium" }
      ],
      edges: [
        { id: "em1", source: "domain_em", target: "ca_emudhra", relationship: "issued_by", evidenceSource: "X.509 AuthorityKeyIdentifier match" },
        { id: "em2", source: "ca_emudhra", target: "root_emudhra", relationship: "signed_by", evidenceSource: "Certificate Chain Traversal" },
        { id: "em3", source: "domain_em", target: "asn_ovh", relationship: "hosted_on", evidenceSource: "BGP Prefix Route Lookup" }
      ]
    },
    evidence: {
      report_id: "ORIGIN-2025-EMUDHRA-019",
      canonical_sha256: "3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c",
      timestamp: "2026-11-08T20:10:00Z",
      algorithm: "SHA-256",
      block_registered: true,
      evm_tx_hash: "0xaa891234bcde567890fa1234567890bcde1234567890fa1234567890bcde1234",
      evm_block_number: 19842410,
      contract_address: "0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE",
      tamper_status: "verified_intact",
      provenance_signature: "ECDSA-secp256k1:0x12fe...verified"
    },
    limitations: [
      "eMudhra OCSP responder query exhibited intermittent 400ms latency from sandbox node."
    ]
  }
];
