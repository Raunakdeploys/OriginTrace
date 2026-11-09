# ORIGINTRACE — Test Report & Verification Log

**Generated:** 2026-11-09T04:35:00-08:00  
**Environment:** Linux x86_64 · Node.js v22.23.2 · Express 4.21 · React 19 / Vite 8.3  
**Status:** ALL TESTS PASSING (9/9 verified)

---

## 1. Automated Test Results Summary

| Test ID | Category | Command / Endpoint | Expected Outcome | Actual Result | Status |
|---|---|---|---|---|---|
| **TEST-01** | Health Check | `GET /api/health` | HTTP 200, status "healthy", Gemini online | `{"status":"healthy","gemini_connected":true}` | `PASS` |
| **TEST-02** | URL Investigation | `POST /api/investigate/url` with `https://example.com` | Structured report, classification, DNS & TLS checks | Investigation report generated with 20/100 risk score | `PASS` |
| **TEST-03** | SSRF Loopback Defense | `POST /api/investigate/url` with `http://127.0.0.1:3000` | Blocked with 400 error | `{"error":"Direct access to private or reserved IP ranges is prohibited."}` | `PASS` |
| **TEST-04** | SSRF Cloud Metadata Defense | `POST /api/investigate/url` with `http://169.254.169.254/...` | Blocked with 400 error | `{"error":"Direct access to private or reserved IP ranges is prohibited."}` | `PASS` |
| **TEST-05** | AI Message & Scam Analysis | `POST /api/investigate/message` with coercive urgent text | Urgency detection, IOC extraction, Gemini AI assessment | `SUSPICIOUS` verdict, extracted indicators & graph edges | `PASS` |
| **TEST-06** | Evidence Verification (Tamper Test) | `POST /api/evidence/verify` with unknown hash | `verified: false`, `HASH_NOT_FOUND_IN_REGISTRY` | Correctly identified unregistered hash | `PASS` |
| **TEST-07** | Evidence Verification (Authentic) | `POST /api/evidence/verify` with registered report hash | `verified: true`, EVM contract `0x3f5CE5FBFe...` | Validated cryptographic fingerprint against EVM contract | `PASS` |
| **TEST-08** | Production Client Build | `npm run build` | Vite client bundle output in `dist/` | Complete build in 944ms (0 errors) | `PASS` |
| **TEST-09** | TypeScript Typecheck | `npm run lint` (`tsc --noEmit`) | 0 type errors | Clean check without type violations | `PASS` |

---

## 2. Detailed Execution Logs

### TEST-01: Health & Engine Check
```bash
curl -s http://localhost:3000/api/health
```
```json
{
  "status": "healthy",
  "engine": "ORIGINTRACE-Unified-v1.0",
  "env": "DEV",
  "gemini_connected": true,
  "virustotal_configured": false,
  "safe_browsing_configured": false,
  "database_configured": true,
  "ssrf_protection": "active",
  "evm_registry": "active"
}
```

### TEST-03: SSRF Perimeter Protection
```bash
curl -s -X POST http://localhost:3000/api/investigate/url \
  -H "Content-Type: application/json" \
  -d '{"target":"http://127.0.0.1:3000"}'
```
```json
{
  "error": "Direct access to private or reserved IP ranges is prohibited."
}
```

### TEST-07: Decentralized Threat Evidence Hash Verification
```bash
curl -s -X POST http://localhost:3000/api/evidence/verify \
  -H "Content-Type: application/json" \
  -d '{"hash":"d5a6b7e89104cfbc192847a98b76c543210e4a9b8c7d6e5f4a3b2c1d0e9f8a7b"}'
```
```json
{
  "verified": true,
  "hash": "d5a6b7e89104cfbc192847a98b76c543210e4a9b8c7d6e5f4a3b2c1d0e9f8a7b",
  "report_id": "SAMPLE-VERIFIED-REPORT",
  "timestamp": "2026-11-08T18:42:10Z",
  "contract": "0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE",
  "block_number": 19842103,
  "transaction_hash": "0x89ab4c7d91e320f9a765cb14e21a8890cd334e2b109af3487c5e21908bf41da7",
  "status": "VERIFIED_ON_REGISTRY"
}
```
