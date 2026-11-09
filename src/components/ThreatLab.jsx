import React, { useState, useEffect, useRef } from 'react';
import { 
  Flame, 
  QrCode, 
  Type, 
  ShieldAlert, 
  Laptop, 
  ArrowRight, 
  Search, 
  Copy, 
  Check, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink,
  Layers,
  Fingerprint,
  RefreshCw,
  Eye,
  Sliders,
  Zap,
  Lock,
  Globe
} from 'lucide-react';

// Sample Quishing attack payloads
const QUISHING_SCENARIOS = [
  {
    id: 'm365_2fa',
    name: 'Microsoft 365 2FA Quishing Lure',
    category: 'AiTM Credential Phish',
    payload: 'https://login.microsoftonline.security-verify-sso.com/common/oauth2/authorize?client_id=m365',
    description: 'Embedded in PDF invoice claiming user 2FA expired. Scanned via mobile phone bypassing desktop security filters.',
    risk: 'CRITICAL',
    obfuscation: 'Deceptive subdomain mimicking login.microsoftonline.com'
  },
  {
    id: 'parking_fine',
    name: 'City Transit / Parking Citation Quishing',
    category: 'Payment Gateway Phish',
    payload: 'https://qr-pay-citation.city-parking-violations.org/pay?citation=984210',
    description: 'Physical QR sticker affixed to public parking meters redirecting drivers to fake payment gateway.',
    risk: 'HIGH',
    obfuscation: 'Lookalike TLD (.org) with fake citation parameter'
  },
  {
    id: 'banking_wire',
    name: 'Bank of America Wire Transfer QR Lure',
    category: 'Executive Impersonation',
    payload: 'https://bankofamerica.com.account-verification-portal.net/wire/confirm',
    description: 'Sent via SMS notification urging urgent wire authorization via QR scan.',
    risk: 'CRITICAL',
    obfuscation: 'Double hostname trick with legitimate brand in prefix'
  },
  {
    id: 'clean_wifi',
    name: 'Standard Guest Wi-Fi QR Code',
    category: 'Clean Baseline',
    payload: 'WIFI:S:Guest-Network;T:WPA;P:Welcome2026;;',
    description: 'Benign standard Wi-Fi configuration QR code without outbound web redirects.',
    risk: 'LOW',
    obfuscation: 'None (Standard Wi-Fi schema)'
  }
];

// Cyrillic/Greek homoglyphs
const HOMOGLYPHS = {
  'a': { char: 'а', code: 'U+0430', name: 'Cyrillic Small Letter A' },
  'c': { char: 'с', code: 'U+0441', name: 'Cyrillic Small Letter Es' },
  'e': { char: 'е', code: 'U+0435', name: 'Cyrillic Small Letter Ie' },
  'o': { char: 'о', code: 'U+043E', name: 'Cyrillic Small Letter O' },
  'p': { char: 'р', code: 'U+0440', name: 'Cyrillic Small Letter Er' },
  'x': { char: 'х', code: 'U+0445', name: 'Cyrillic Small Letter Ha' },
  'y': { char: 'у', code: 'U+0443', name: 'Cyrillic Small Letter U' },
  'i': { char: 'і', code: 'U+0456', name: 'Cyrillic Small Letter Byelorussian-Ukrainian I' }
};

export const ThreatLab = ({ onInvestigateTarget, setActiveView }) => {
  const [activeTab, setActiveTab] = useState('quishing'); // 'quishing' | 'homoglyph' | 'aitm_proxy'

  // Quishing State
  const [selectedQuishing, setSelectedQuishing] = useState(QUISHING_SCENARIOS[0]);
  const [customQrInput, setCustomQrInput] = useState('');
  const qrCanvasRef = useRef(null);

  // Homoglyph State
  const [baseBrand, setBaseBrand] = useState('apple.com');
  const [selectedConfusables, setSelectedConfusables] = useState({ 'a': true, 'e': false });

  // Generate simple QR Code pattern on canvas (algorithmic procedural matrix)
  useEffect(() => {
    const canvas = qrCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const payload = customQrInput.trim() || selectedQuishing.payload;
    const size = 200;
    canvas.width = size;
    canvas.height = size;

    ctx.fillStyle = '#0a0f1d';
    ctx.fillRect(0, 0, size, size);

    // Deterministic pseudo-random seed from payload string
    let hash = 0;
    for (let i = 0; i < payload.length; i++) {
      hash = ((hash << 5) - hash) + payload.charCodeAt(i);
      hash |= 0;
    }

    const gridSize = 21;
    const cellSize = size / gridSize;

    // Draw position detection finder patterns in 3 corners
    const drawFinder = (x, y) => {
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(x * cellSize, y * cellSize, 7 * cellSize, 7 * cellSize);
      ctx.fillStyle = '#0a0f1d';
      ctx.fillRect((x + 1) * cellSize, (y + 1) * cellSize, 5 * cellSize, 5 * cellSize);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect((x + 2) * cellSize, (y + 2) * cellSize, 3 * cellSize, 3 * cellSize);
    };

    drawFinder(0, 0);
    drawFinder(gridSize - 7, 0);
    drawFinder(0, gridSize - 7);

    // Fill algorithmic data matrix cells
    ctx.fillStyle = '#e2e8f0';
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        // Skip corner finders
        if ((r < 7 && c < 7) || (r < 7 && c >= gridSize - 7) || (r >= gridSize - 7 && c < 7)) {
          continue;
        }

        const pseudoVal = Math.sin(hash + r * 13 + c * 37);
        if (pseudoVal > 0.1) {
          ctx.fillRect(c * cellSize + 0.5, r * cellSize + 0.5, cellSize - 1, cellSize - 1);
        }
      }
    }
  }, [selectedQuishing, customQrInput]);

  // Compute Punycode spoof preview
  const generateSpoofDomain = () => {
    let result = '';
    let hasReplaced = false;
    for (const char of baseBrand.toLowerCase()) {
      if (HOMOGLYPHS[char] && selectedConfusables[char]) {
        result += HOMOGLYPHS[char].char;
        hasReplaced = true;
      } else {
        result += char;
      }
    }
    return {
      spoofed: result,
      hasReplaced,
      punycode: hasReplaced ? `xn--${result.replace('.', '-').slice(0, 8)}43d.com` : baseBrand
    };
  };

  const spoofInfo = generateSpoofDomain();

  const handleLaunchFullScan = (target) => {
    if (onInvestigateTarget) {
      onInvestigateTarget(target);
    }
    if (setActiveView) {
      setActiveView('investigate');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-rose-400 mb-1">
            <span className="p-1 rounded-md bg-rose-500/10 border border-rose-500/20">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
            </span>
            <span className="tracking-wider uppercase font-semibold">Red Team vs Blue Team Security Lab</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-heading">
            Adversarial Attack Simulation Lab
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Test and dissect real-world evasive attack vectors: QR code quishing, Unicode Punycode confusable domains, and AiTM reverse proxy 2FA bypass tools.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="px-3 py-1.5 rounded-xl glass-subtle text-xs font-mono text-cyan-400 border border-cyan-500/20">
            Interactive Testbed Active
          </span>
        </div>
      </div>

      {/* Lab Navigation Deck */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl glass-panel border border-white/[0.08]">
        <button
          onClick={() => setActiveTab('quishing')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            activeTab === 'quishing'
              ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>QR Quishing Deep Inspector</span>
        </button>

        <button
          onClick={() => setActiveTab('homoglyph')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            activeTab === 'homoglyph'
              ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Type className="w-4 h-4" />
          <span>Punycode & Homoglyph Lab</span>
        </button>

        <button
          onClick={() => setActiveTab('aitm_proxy')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            activeTab === 'aitm_proxy'
              ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Laptop className="w-4 h-4" />
          <span>AiTM Reverse Proxy (Evilginx)</span>
        </button>
      </div>

      {/* TAB 1: QR QUISHING INSPECTOR */}
      {activeTab === 'quishing' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left Column (5 cols): QR Matrix Renderer */}
            <div className="lg:col-span-5 p-6 rounded-3xl glass-panel flex flex-col items-center justify-between space-y-4">
              <div className="w-full flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div className="text-xs font-mono font-bold uppercase text-slate-200 flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-cyan-400" />
                  <span>Synthesized Optical Payload</span>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                  selectedQuishing.risk === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                  selectedQuishing.risk === 'HIGH' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {selectedQuishing.risk} RISK
                </span>
              </div>

              {/* Canvas Matrix */}
              <div className="p-4 rounded-2xl bg-[#0a0f1d] border border-cyan-500/30 shadow-[0_0_25px_rgba(6,182,212,0.15)] flex items-center justify-center">
                <canvas ref={qrCanvasRef} className="rounded-lg" />
              </div>

              <div className="w-full text-center space-y-1">
                <div className="text-xs font-mono text-slate-400">Decoded Raw Data String:</div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-mono text-cyan-300 break-all select-all">
                  {customQrInput.trim() || selectedQuishing.payload}
                </div>
              </div>

              <button
                onClick={() => handleLaunchFullScan(customQrInput.trim() || selectedQuishing.payload)}
                className="w-full py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.25)]"
              >
                <span>Send Decoded Target to Interrogation Bay</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right Column (7 cols): Quishing Scenarios & Forensic Analysis */}
            <div className="lg:col-span-7 p-6 rounded-3xl glass-panel space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                  <h3 className="text-xs font-mono font-bold uppercase text-slate-200">
                    Real-World Adversarial Quishing Scenarios
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400">Select Attack Vector</span>
                </div>

                <div className="space-y-2.5">
                  {QUISHING_SCENARIOS.map((scen) => (
                    <button
                      key={scen.id}
                      onClick={() => {
                        setSelectedQuishing(scen);
                        setCustomQrInput('');
                      }}
                      className={`w-full p-4 rounded-2xl text-left transition-all border cursor-pointer ${
                        selectedQuishing.id === scen.id && !customQrInput
                          ? 'bg-cyan-500/15 border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.15)] text-cyan-200'
                          : 'bg-white/[0.02] hover:bg-white/[0.05] border-white/[0.06] text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white flex items-center gap-2">
                          <span>{scen.name}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-slate-400 font-normal">
                            {scen.category}
                          </span>
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                          scen.risk === 'CRITICAL' ? 'text-rose-400 bg-rose-500/10' :
                          scen.risk === 'HIGH' ? 'text-amber-400 bg-amber-500/10' :
                          'text-emerald-400 bg-emerald-500/10'
                        }`}>
                          {scen.risk}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 leading-snug">
                        {scen.description}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Custom Target QR Input */}
                <div className="pt-2 border-t border-white/[0.06] space-y-2">
                  <label className="block text-xs font-mono text-slate-400">
                    Or Test Any Custom URL / QR Text Payload:
                  </label>
                  <input
                    type="text"
                    value={customQrInput}
                    onChange={(e) => setCustomQrInput(e.target.value)}
                    placeholder="Paste any link or text to generate & inspect in real-time..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0b1322] border border-white/[0.1] text-xs text-white font-mono placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Quishing Forensic Evasion Note */}
              <div className="p-4 rounded-2xl bg-amber-500/[0.05] border border-amber-500/20 text-xs space-y-1">
                <div className="font-bold text-amber-300 flex items-center gap-1.5 font-mono">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Why Quishing Bypasses Standard Email Gateways:</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Traditional email security solutions parse plain text HTML anchors. Optical QR codes encapsulate malicious URLs in images, forcing targets to scan on personal mobile devices outside corporate network perimeter defenses.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PUNYCODE & HOMOGLYPH CONFUSABLE LAB */}
      {activeTab === 'homoglyph' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl glass-panel space-y-5">
            <div className="space-y-1 pb-3 border-b border-white/[0.08]">
              <h3 className="text-sm font-mono font-bold uppercase text-white flex items-center gap-2">
                <Type className="w-4 h-4 text-cyan-400" />
                <span>Visual Confusable & Punycode Deobfuscation Engine</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Adversaries exploit internationalized domain names (IDNs) by substituting Latin characters with visually identical Cyrillic or Greek glyphs.
              </p>
            </div>

            {/* Interactive Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-400 block">
                  Target Domain to Impersonate:
                </label>
                <input
                  type="text"
                  value={baseBrand}
                  onChange={(e) => setBaseBrand(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0b1322] border border-white/[0.12] text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-400 block">
                  Toggle Active Homoglyph Substitutions:
                </label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(HOMOGLYPHS).map(([latin, info]) => {
                    const isChecked = !!selectedConfusables[latin];
                    return (
                      <button
                        key={latin}
                        type="button"
                        onClick={() => setSelectedConfusables(prev => ({ ...prev, [latin]: !prev[latin] }))}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-all border ${
                          isChecked
                            ? 'bg-rose-500/20 text-rose-200 border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.2)]'
                            : 'glass-subtle text-slate-400 border-white/[0.06] hover:text-white'
                        }`}
                      >
                        <span className="font-bold">{latin}</span>
                        <span>→</span>
                        <span className="font-bold text-white">{info.char}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Side-by-Side Visual Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Human Eye View */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2">
                <div className="text-xs font-mono text-slate-400 uppercase flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Human Eye View (Rendered in Address Bar)</span>
                </div>
                <div className="text-lg font-mono font-bold text-white break-all tracking-wide p-3 rounded-xl bg-black/40 border border-white/[0.06]">
                  {spoofInfo.spoofed}
                </div>
                <div className="text-[11px] text-slate-400">
                  Visual appearance is virtually indistinguishable from legitimate <strong className="text-white">{baseBrand}</strong>.
                </div>
              </div>

              {/* Raw DNS Punycode */}
              <div className="p-4 rounded-2xl bg-rose-500/[0.04] border border-rose-500/20 space-y-2">
                <div className="text-xs font-mono text-rose-400 uppercase flex items-center gap-1.5 font-bold">
                  <Fingerprint className="w-3.5 h-3.5" />
                  <span>Actual Network Domain (RFC 3492 Punycode)</span>
                </div>
                <div className="text-lg font-mono font-bold text-rose-300 break-all tracking-wide p-3 rounded-xl bg-black/40 border border-rose-500/30">
                  {spoofInfo.punycode}
                </div>
                <div className="text-[11px] text-slate-400">
                  Resolves to completely separate IP infrastructure registered by the adversary.
                </div>
              </div>
            </div>

            {/* Quick Action */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => handleLaunchFullScan(`https://${spoofInfo.spoofed}`)}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-[0_0_15px_rgba(6,182,212,0.25)]"
              >
                <span>Audit Homoglyph in Interrogation Bay</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AITM REVERSE PROXY EXPLAINER */}
      {activeTab === 'aitm_proxy' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl glass-panel space-y-6">
            <div className="space-y-1 pb-3 border-b border-white/[0.08]">
              <h3 className="text-sm font-mono font-bold uppercase text-white flex items-center gap-2">
                <Laptop className="w-4 h-4 text-cyan-400" />
                <span>Adversary-in-the-Middle (AiTM) Reverse Proxy Breakdown</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Tools like Evilginx3, Modlishka, and Tycoon 2FA sit between victims and authentic login portals, capturing post-authentication session cookies to bypass MFA entirely.
              </p>
            </div>

            {/* Attack Chain Diagram */}
            <div className="p-5 rounded-2xl bg-black/40 border border-white/[0.08] space-y-4">
              <div className="text-xs font-mono font-bold text-slate-300 uppercase">
                Interactive Attack Topology & Exfiltration Flow
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                  <div className="text-cyan-400 font-bold">1. Victim Interaction</div>
                  <div className="text-slate-300 text-[11px] leading-relaxed">
                    User clicks deceptive link or scans Quishing QR. Browser navigates to adversary's reverse proxy server instead of authentic IdP.
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-rose-500/[0.07] border border-rose-500/25 space-y-2">
                  <div className="text-rose-400 font-bold">2. AiTM Proxy Relaying</div>
                  <div className="text-slate-300 text-[11px] leading-relaxed">
                    Evilginx proxies login pages in real-time, forwarding victim's credentials & 2FA prompts to real Google / M365 authentication endpoints.
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-500/[0.07] border border-amber-500/25 space-y-2">
                  <div className="text-amber-400 font-bold">3. Session Exfiltration</div>
                  <div className="text-slate-300 text-[11px] leading-relaxed">
                    Upon successful 2FA entry, the proxy intercepts the session token (<code className="text-amber-300">ESTSAUTH</code> cookie), granting permanent access without password.
                  </div>
                </div>
              </div>
            </div>

            {/* Countermeasures */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-emerald-500/[0.04] border border-emerald-500/20 space-y-2">
                <div className="font-bold text-emerald-300 flex items-center gap-2 font-mono">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Resilient Defense: FIDO2 / WebAuthn Passkeys</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Hardware tokens (YubiKeys) and cryptographic passkeys bind authentication challenges cryptographically to the exact domain in the browser address bar, stopping reverse proxies instantly.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-cyan-500/[0.04] border border-cyan-500/20 space-y-2">
                <div className="font-bold text-cyan-300 flex items-center gap-2 font-mono">
                  <Lock className="w-4 h-4 text-cyan-400" />
                  <span>ORIGINTRACE Detection Vectors</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  ORIGINTRACE audits TLS certificate issuers, redirect chains, and DNS autonomous system ownership to flag reverse proxy infrastructures before employees interact.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
