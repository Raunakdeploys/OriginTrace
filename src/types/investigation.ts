/**
 * ORIGINTRACE — Unified Investigation Schema & Type Definitions
 */

export type TargetType = 'url' | 'domain' | 'message' | 'email';

export type VerdictClassification = 
  | 'LOW RISK' 
  | 'SUSPICIOUS' 
  | 'HIGH RISK' 
  | 'CONFIRMED MALICIOUS' 
  | 'INCONCLUSIVE';

export type SeverityLevel = 'info' | 'low' | 'medium' | 'high' | 'critical';

export interface FindingEvidence {
  key: string;
  value: string | number | boolean;
  context?: string;
}

export interface InvestigationCheck {
  id: string;
  module: 'url' | 'dns' | 'tls' | 'headers' | 'content' | 'ai_message' | 'reputation';
  title: string;
  finding: string;
  severity: SeverityLevel;
  status: 'passed' | 'warning' | 'failed' | 'inconclusive';
  scoreImpact: number;
  evidence: FindingEvidence[];
  source: string; // e.g., 'ORIGINTRACE-TLS-Engine', 'Gemini-3.8-Flash', 'PhishGuard-Auth'
}

export interface ExtractedIndicator {
  type: 'domain' | 'ip' | 'url' | 'email' | 'phone' | 'btc_address' | 'cert_sha256' | 'hash';
  value: string;
  context: string;
  reputation: 'neutral' | 'suspicious' | 'malicious';
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'target' | 'brand' | 'domain' | 'dns_record' | 'ip_address' | 'tls_cert' | 'redirect' | 'indicator' | 'actor';
  severity?: SeverityLevel;
  metadata?: Record<string, any>;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relationship: string; // e.g., 'resolves_to', 'issued_by', 'impersonates', 'redirects_to'
  evidenceSource: string; // Non-negotiable requirement: Every relationship needs an evidence source!
}

export interface DigitalIdentityGraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface TrustDriftSnapshot {
  snapshot_id: string;
  timestamp: string;
  domain: string;
  ip_addresses: string[];
  nameservers: string[];
  mx_records: string[];
  tls_fingerprint: string;
  tls_issuer: string;
  tls_expiry: string;
  security_headers: Record<string, string>;
  verdict: VerdictClassification;
}

export interface TrustDriftComparison {
  target: string;
  has_previous_snapshot: boolean;
  baseline_timestamp?: string;
  current_timestamp: string;
  changes_detected: {
    category: 'dns' | 'ip' | 'tls' | 'headers' | 'infrastructure';
    field: string;
    previous_value: string;
    current_value: string;
    risk_implication: string;
    severity: SeverityLevel;
  }[];
  drift_score: number; // 0 - 100
  notes: string;
}

export interface EvidenceRecord {
  report_id: string;
  canonical_sha256: string;
  timestamp: string;
  algorithm: 'SHA-256';
  block_registered?: boolean;
  evm_tx_hash?: string;
  evm_block_number?: number;
  contract_address?: string;
  tamper_status: 'verified_intact' | 'unregistered' | 'mismatched';
  provenance_signature: string;
}

export interface UnifiedInvestigationResult {
  investigation_id: string;
  target: string;
  target_type: TargetType;
  timestamp: string;
  classification: VerdictClassification;
  risk_score: number; // 0 - 100
  confidence: 'LOW' | 'MEDIUM' | 'HIGH';
  summary: string;
  
  // Investigation Modules
  checks: InvestigationCheck[];
  indicators: ExtractedIndicator[];
  
  // Deep Intelligence
  dns_data?: {
    a_records: string[];
    aaaa_records: string[];
    mx_records: string[];
    ns_records: string[];
    txt_records: string[];
    reverse_ptr?: string[];
  };
  
  tls_data?: {
    subject_cn: string;
    subject_alt_names: string[];
    issuer_org: string;
    issuer_cn: string;
    valid_from: string;
    valid_to: string;
    days_remaining: number;
    protocol: string;
    cipher_suite: string;
    key_length?: number;
    signature_algorithm: string;
    is_trusted_ca: boolean;
    is_expired: boolean;
    has_sct_transparency: boolean;
    is_emudhra_issued?: boolean;
  };

  redirect_chain?: {
    hop: number;
    url: string;
    status_code: number;
    ip: string;
  }[];

  security_headers?: {
    hsts: boolean;
    csp: boolean;
    x_frame_options: string | null;
    x_content_type_options: boolean;
    referrer_policy: string | null;
  };

  message_analysis?: {
    intent: string;
    urgency_level: 'none' | 'low' | 'medium' | 'high' | 'critical';
    social_engineering_tactics: string[];
    impersonated_entities: string[];
    credential_requests: string[];
    payment_requests: string[];
    actionable_recommendations: string[];
  };

  // Differentiators
  identity_graph: DigitalIdentityGraphData;
  trust_drift?: TrustDriftComparison;
  evidence: EvidenceRecord;

  limitations: string[];
  is_sample_data?: boolean;
}
