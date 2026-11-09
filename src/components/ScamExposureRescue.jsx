import React, { useState } from 'react';
import { 
  ShieldAlert, 
  HelpCircle, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  PhoneCall, 
  Lock, 
  Key, 
  CreditCard, 
  Download, 
  Laptop, 
  DollarSign, 
  X, 
  Copy, 
  Check, 
  ExternalLink,
  ChevronRight,
  RotateCcw,
  ShieldCheck
} from 'lucide-react';

// Exposure incident archetypes
export const EXPOSURE_OPTIONS = [
  {
    id: 'link_only',
    icon: ExternalLink,
    title: 'I only opened the link',
    subtitle: 'Clicked the URL or visited the website, but did not type or submit credentials.',
    severity: 'LOW',
    color: 'emerald'
  },
  {
    id: 'password',
    icon: Lock,
    title: 'I typed a password or username',
    subtitle: 'Entered my login credentials, email password, or corporate login on the page.',
    severity: 'HIGH',
    color: 'amber'
  },
  {
    id: 'otp_banking',
    icon: Key,
    title: 'I shared an OTP, PIN or banking credential',
    subtitle: 'Submitted an SMS one-time passcode, banking PIN, security code, or 2FA prompt.',
    severity: 'CRITICAL',
    color: 'rose'
  },
  {
    id: 'card_details',
    icon: CreditCard,
    title: 'I entered card or payment details',
    subtitle: 'Provided debit/credit card number, expiration date, CVV, or billing address.',
    severity: 'CRITICAL',
    color: 'rose'
  },
  {
    id: 'file_download',
    icon: Download,
    title: 'I downloaded or opened a file / app',
    subtitle: 'Downloaded an attachment, setup executable (.exe, .pkg, .apk), or invoice document.',
    severity: 'HIGH',
    color: 'amber'
  },
  {
    id: 'remote_access',
    icon: Laptop,
    title: 'I installed an app or gave remote access',
    subtitle: 'Allowed screen sharing, AnyDesk, TeamViewer, QuickSupport, or device control.',
    severity: 'CRITICAL',
    color: 'rose'
  },
  {
    id: 'money_sent',
    icon: DollarSign,
    title: 'I sent money or authorized a transfer',
    subtitle: 'Completed a wire transfer, Zelle/UPI, gift card payment, or crypto transaction.',
    severity: 'CRITICAL',
    color: 'rose'
  },
  {
    id: 'unsure',
    icon: HelpCircle,
    title: "I'm not sure what happened",
    subtitle: 'The page behaved strangely, showed an error, or redirected abruptly.',
    severity: 'MEDIUM',
    color: 'slate'
  }
];

export const ACCOUNT_CATEGORIES = [
  { id: 'bank', label: 'Bank or Financial Service' },
  { id: 'email', label: 'Personal or Work Email' },
  { id: 'social', label: 'Social Media / Messaging' },
  { id: 'work', label: 'Corporate / Workplace SSO' },
  { id: 'device', label: 'Personal Device / Computer' },
  { id: 'other', label: 'Other Service / Account' }
];

export const PLAYBOOKS = {
  link_only: {
    urgency: 'Low Risk — Defensive Verification Needed',
    summary: 'Opening a link alone usually does not compromise an account unless automated malware downloaded or browser vulnerabilities existed. Do not interact further.',
    steps: [
      {
        order: 1,
        title: 'Immediately close the browser tab or window',
        reason: 'Prevents deceptive secondary prompts, background WebSockets, or fake warning popups.'
      },
      {
        order: 2,
        title: 'Check your Downloads folder for unapproved files',
        reason: 'Some malicious pages trigger automatic silent file downloads (.iso, .zip, .apk, .exe).'
      },
      {
        order: 3,
        title: 'Clear cache and cookies for that specific domain',
        reason: 'Removes any tracking cookies, session beacons, or local storage payloads.'
      },
      {
        order: 4,
        title: 'Scan the link in ORIGINTRACE to inspect destination signals',
        reason: 'Confirms whether the domain was typosquatted, newly registered, or flagged on threat feeds.'
      }
    ],
    why: 'Web browsers execute in isolated sandboxes. Unless you approved permission prompts or installed a file, passive page visits rarely compromise devices.',
    disclaimer: 'This guidance is conservative. If you notice unexpected system dialogs or notifications, run your device operating system security scanner.'
  },
  password: {
    urgency: 'High Urgency — Immediate Credential Revocation Required',
    summary: 'The attacker likely captured your credentials via a phishing proxy or exfiltration form. You must change passwords immediately from a trusted device.',
    steps: [
      {
        order: 1,
        title: 'Open official service app or website on a trusted device',
        reason: 'Do NOT use links from the suspicious message or browser history.'
      },
      {
        order: 2,
        title: 'Change your password immediately',
        reason: 'Invalidates the harvested password before automated scrapers test credential reuse.'
      },
      {
        order: 3,
        title: 'Select "Sign out of all other sessions / devices"',
        reason: 'Terminates any active adversary sessions if session tokens were generated.'
      },
      {
        order: 4,
        title: 'Enable Multi-Factor Authentication (MFA) via Authenticator app',
        reason: 'Authenticator apps (TOTP) or FIDO2 hardware passkeys are resilient against phishing proxies.'
      },
      {
        order: 5,
        title: 'Change identical passwords on any other accounts',
        reason: 'Threat actors routinely execute credential-stuffing dictionaries against banking and email services.'
      }
    ],
    why: 'Harvested credentials are often queued into automated credential stuffing within minutes of entry.',
    disclaimer: 'If you are already locked out of your account, navigate to the official provider support center immediately to request account recovery.'
  },
  otp_banking: {
    urgency: 'CRITICAL PRIORITY — Contact Bank Fraud Hotline Instantly',
    summary: 'One-Time Passcodes (OTPs) authorize real-time transactions, device binding, or password resets. Immediate financial institution escalation is required.',
    steps: [
      {
        order: 1,
        title: 'Call your bank fraud department using the number on your physical card',
        reason: 'Never use phone numbers or links shown on the website or SMS.'
      },
      {
        order: 2,
        title: 'Request an immediate emergency block / temporary freeze on accounts',
        reason: 'Prevents outgoing wire transfers, ACH withdrawals, and unauthorized debit transactions.'
      },
      {
        order: 3,
        title: 'Inform the representative that an OTP was intercepted in real-time',
        reason: 'Triggers the highest fraud escalation priority protocol inside the financial institution.'
      },
      {
        order: 4,
        title: 'Revoke newly added payees and trusted recipient bindings',
        reason: 'Attackers frequently utilize harvested OTPs to register fraudulent beneficiary accounts.'
      },
      {
        order: 5,
        title: 'Change banking portal login credentials from a secure device',
        reason: 'Ensures the attacker cannot re-authenticate even if account access is restored.'
      }
    ],
    why: 'OTPs possess brief validity windows (typically 3–10 minutes) and are used by adversaries for instant funds transfer or adding unauthorized devices.',
    disclaimer: 'ORIGINTRACE never collects or asks for your OTP, PIN, or card numbers. Always contact your financial institution directly through official phone numbers.'
  },
  card_details: {
    urgency: 'CRITICAL PRIORITY — Card Freeze & Dispute Protocol',
    summary: 'Credit/debit card numbers and CVVs are traded on illicit marketplaces or used for immediate online purchases. Freeze the card immediately.',
    steps: [
      {
        order: 1,
        title: 'Open your bank mobile app and freeze / lock the card',
        reason: 'Instantly stops pending authorizations and recurring charge attempts.'
      },
      {
        order: 2,
        title: 'Call your card issuer using the phone number printed on the card back',
        reason: 'Report unauthorized card detail compromise and request a reissued card with a new number.'
      },
      {
        order: 3,
        title: 'Review real-time transaction activity for small test micro-charges',
        reason: 'Adversaries often test stolen cards with $0.50 – $1.00 authorizations before larger purchases.'
      },
      {
        order: 4,
        title: 'File formal fraud dispute for any unfamiliar transaction',
        reason: 'Preserves consumer fraud liability protections under financial payment regulations.'
      }
    ],
    why: 'Card details entered into fraudulent payment gateways are logged and exfiltrated instantly.',
    disclaimer: 'Credit cards generally carry stronger consumer statutory fraud protection than debit cards. Escalate quickly with your issuer.'
  },
  file_download: {
    urgency: 'High Urgency — Device Quarantine & Anti-Malware Scan',
    summary: 'Downloaded files may contain info-stealers, trojans, or remote administration tools. Do NOT run the file again and isolate the device if necessary.',
    steps: [
      {
        order: 1,
        title: 'Do NOT run, extract, or double-click the downloaded file',
        reason: 'Payloads require execution to initiate malicious processes or registry persistence.'
      },
      {
        order: 2,
        title: 'Delete the downloaded file from Downloads and empty Trash/Recycle Bin',
        reason: 'Prevents accidental execution in subsequent sessions.'
      },
      {
        order: 3,
        title: 'If you executed or opened the file: Disconnect Wi-Fi and Ethernet',
        reason: 'Severing network connectivity prevents active command-and-control (C2) beaconing and exfiltration.'
      },
      {
        order: 4,
        title: 'Run a full system scan using Windows Defender or Apple XProtect / Malwarebytes',
        reason: 'Identifies and quarantines known info-stealers (RedLine, Lumma, Vidar) and trojans.'
      },
      {
        order: 5,
        title: 'If on a corporate device, report immediately to your internal IT / SOC team',
        reason: 'Enterprise security can isolate the endpoint and check for lateral network movement.'
      }
    ],
    why: 'Modern infostealers target browser saved passwords, cryptocurrency wallet extensions, and session cookies within seconds of launch.',
    disclaimer: 'If browser credentials were saved on a machine where malware was run, assume passwords may have been harvested and rotate them from an alternate clean device.'
  },
  remote_access: {
    urgency: 'CRITICAL PRIORITY — Sever Connection & Device Isolation',
    summary: 'Adversaries use remote desktop tools to directly pilot your machine, access banking portals, and modify security settings.',
    steps: [
      {
        order: 1,
        title: 'Immediately disconnect internet connection (turn off Wi-Fi / pull cable)',
        reason: 'Instantly drops active remote control sessions and prevents further keyboard/mouse hijacking.'
      },
      {
        order: 2,
        title: 'Force power off the machine if mouse is moving autonomously',
        reason: 'Halts unauthorized automated actions immediately.'
      },
      {
        order: 3,
        title: 'Uninstall the remote assistance software (AnyDesk, TeamViewer, UltraViewer)',
        reason: 'Removes unattended access backdoors and permanent access credentials.'
      },
      {
        order: 4,
        title: 'From an alternate device (e.g. mobile phone): Check bank accounts immediately',
        reason: 'Verify no unauthorized transfers or device registrations were completed while machine was exposed.'
      },
      {
        order: 5,
        title: 'Seek professional remediation before reconnecting to personal networks',
        reason: 'Ensure persistent scheduled tasks or secondary remote payloads are not left behind.'
      }
    ],
    why: 'Remote access scams (tech support scams, refund fraud) exploit administrative control to manipulate screens and execute wire transfers.',
    disclaimer: 'Do not accept incoming phone calls from individuals claiming to be "support" offering to fix the problem.'
  },
  money_sent: {
    urgency: 'CRITICAL PRIORITY — Recall Escalation & Fraud Escalation',
    summary: 'Time is the single most critical factor for fraudulent transfer recovery. Contact payment rails and law enforcement immediately.',
    steps: [
      {
        order: 1,
        title: 'Call your originating bank / payment provider immediately',
        reason: 'Request an urgent wire recall or transaction cancellation before clearing and settlement.'
      },
      {
        order: 2,
        title: 'Document all transfer details: Transaction IDs, recipient accounts, routing numbers',
        reason: 'Essential evidentiary records required for inter-bank fraud tracking and police reports.'
      },
      {
        order: 3,
        title: 'File an official report with local cybercrime authorities (e.g., IC3.gov / National Cyber Crime Portal)',
        reason: 'Generates an official complaint reference number often required by banks to release frozen funds.'
      },
      {
        order: 4,
        title: 'Beware of "Recovery Scammers" who claim they can retrieve funds for a fee',
        reason: 'Secondary scammers routinely target recent fraud victims with fake cryptocurrency or fund recovery services.'
      }
    ],
    why: 'Wire transfers and cryptocurrency transfers move rapidly. The window for potential recall typically narrows within 1 to 24 hours.',
    disclaimer: 'ORIGINTRACE does not process payments or recover funds. Act directly with authorized financial institutions.'
  },
  unsure: {
    urgency: 'Moderate Caution — Baseline Defense Protocol',
    summary: 'When in doubt, apply low-regret security best practices to safeguard accounts and monitor for suspicious indicators.',
    steps: [
      {
        order: 1,
        title: 'Close the browser window and do not re-open the link',
        reason: 'Eliminates lingering exposure while evaluating risk.'
      },
      {
        order: 2,
        title: 'Inspect the link in ORIGINTRACE',
        reason: 'Our deterministic engines evaluate domain reputation, typosquatting, and TLS certificate flags safely.'
      },
      {
        order: 3,
        title: 'Verify whether any download or authentication prompts occurred',
        reason: 'Determines whether account credentials or endpoint files were compromised.'
      },
      {
        order: 4,
        title: 'Monitor account notifications and email for unexpected login alerts',
        reason: 'Legitimate services alert users to logins from unfamiliar IP addresses or devices.'
      }
    ],
    why: 'Exercising disciplined caution prevents escalation from a suspicious link into a credential compromise.',
    disclaimer: 'If you suspect financial exposure at any point, contact your financial institution directly.'
  }
};

/**
 * Compact Homepage Banner / Card Component
 * Placed beside or immediately below URL checker on desktop, and directly below on mobile.
 */
/**
 * Compact Homepage Banner / Card Component
 * Placed beside or immediately below URL checker on desktop, and directly below on mobile.
 */
export const ScamExposureRescueCard = ({ onOpenRescue, currentReport = null }) => {
  return (
    <div className="p-6 rounded-2xl panel border border-white/[0.08] flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-rose-400 font-semibold">
              Scam Exposure Rescue
            </span>
          </div>
          <span className="text-xs font-mono text-slate-500">
            Guided Triage
          </span>
        </div>

        <div>
          <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight leading-snug">
            Already clicked or shared something?
          </h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed font-sans">
            Get an immediate, safe next-step action plan. You do not need to share passwords, OTPs, or card numbers.
          </p>
        </div>

        {currentReport && currentReport.classification !== 'LOW RISK' && (
          <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-200 font-mono">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="truncate">
              Active scan flagged <strong>{currentReport.target?.display_value || currentReport.target}</strong> as {currentReport.classification}.
            </span>
          </div>
        )}
      </div>

      <div className="pt-5">
        <button
          type="button"
          onClick={onOpenRescue}
          className="w-full py-2.5 px-4 rounded-lg bg-white hover:bg-slate-200 text-slate-950 font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <span>Check My Exposure</span>
          <ArrowRight className="w-4 h-4 text-slate-950" />
        </button>
        <div className="text-xs text-slate-500 text-center mt-2 font-mono">
          Privacy-First · 100% Client-Side · Zero Credential Logging
        </div>
      </div>
    </div>
  );
};

/**
 * Full Interactive Guided Triage Modal Component
 */
export const ScamExposureRescueModal = ({ isOpen, onClose, currentReport = null }) => {
  const [step, setStep] = useState(1);
  const [selectedExposure, setSelectedExposure] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('bank');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentPlaybook = selectedExposure ? PLAYBOOKS[selectedExposure] : null;

  const handleCopyPlan = () => {
    if (!currentPlaybook) return;
    const text = `ORIGINTRACE — SCAM EXPOSURE RESCUE PLAN\n` +
      `Incident Type: ${EXPOSURE_OPTIONS.find(o => o.id === selectedExposure)?.title}\n` +
      `Urgency Level: ${currentPlaybook.urgency}\n\n` +
      `RECOMMENDED IMMEDIATE ACTIONS:\n` +
      currentPlaybook.steps.map(s => `${s.order}. ${s.title}\n   Reason: ${s.reason}`).join('\n\n') +
      `\n\nDISCLAIMER:\n${currentPlaybook.disclaimer}\n` +
      `Generated by ORIGINTRACE at ${new Date().toISOString()}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedExposure(null);
    setSelectedCategory('bank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="w-full max-w-3xl rounded-2xl panel border border-white/[0.1] bg-[#0e1117] text-slate-100 shadow-2xl overflow-hidden my-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="rescue-title"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-white/[0.07] flex items-center justify-between bg-black/20">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span className="uppercase text-rose-400 font-semibold">Incident Triage</span>
                <span aria-hidden="true">·</span>
                <span>Step {step} of 2</span>
              </div>
              <h2 id="rescue-title" className="text-lg sm:text-xl font-semibold text-white tracking-tight">
                Scam Exposure Rescue
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {step === 2 && (
              <button
                type="button"
                onClick={handleReset}
                className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1.5"
                title="Restart Triage"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Start Over</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Step 1: Exposure Selection */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-semibold text-white">
                  What happened during your interaction?
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 font-sans">
                  Select the closest option. You will never be asked to share passwords, PINs, or card numbers.
                </p>
              </div>

              {/* Context Callout if current investigation exists */}
              {currentReport && (
                <div className="p-3.5 rounded-lg bg-black/40 border border-white/[0.08] text-xs text-slate-300 flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-white">Active Case Linked: </span>
                    <span>
                      Evaluating against report for <strong>{currentReport.target?.display_value || currentReport.target}</strong> ({currentReport.classification}).
                    </span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {EXPOSURE_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = selectedExposure === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedExposure(opt.id)}
                      className={`p-4 rounded-xl text-left transition-colors border cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-white/[0.08] border-white/30 text-white'
                          : 'bg-black/30 hover:bg-white/[0.04] border-white/[0.06] text-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <Icon className="w-4 h-4 text-slate-400" />
                        <span className={`text-xs font-mono font-medium uppercase ${
                          opt.severity === 'CRITICAL' ? 'text-rose-400' :
                          opt.severity === 'HIGH' ? 'text-orange-400' :
                          opt.severity === 'MEDIUM' ? 'text-slate-400' :
                          'text-emerald-400'
                        }`}>
                          {opt.severity}
                        </span>
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-semibold text-white mb-0.5">
                          {opt.title}
                        </div>
                        <div className="text-xs text-slate-400 leading-snug font-sans">
                          {opt.subtitle}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Account Category selection (optional refinement) */}
              {selectedExposure && selectedExposure !== 'link_only' && (
                <div className="space-y-2 pt-3 border-t border-white/[0.07]">
                  <label className="text-xs font-medium text-slate-300">
                    What type of service was involved? (Optional)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ACCOUNT_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors cursor-pointer ${
                          selectedCategory === cat.id
                            ? 'bg-white text-slate-950 font-medium'
                            : 'bg-black/30 hover:bg-white/[0.06] text-slate-400 border border-white/[0.06]'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  disabled={!selectedExposure}
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-lg bg-white hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-medium text-xs sm:text-sm transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>Generate Action Plan</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Tailored Response Playbook */}
          {step === 2 && currentPlaybook && (
            <div className="space-y-6">
              {/* Urgency Alert Header */}
              <div className="p-4 sm:p-5 rounded-xl border border-rose-500/30 bg-rose-950/15 space-y-1.5">
                <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4" />
                  <span>{currentPlaybook.urgency}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                  {currentPlaybook.summary}
                </p>
              </div>

              {/* Ordered Checklist of Urgent Steps */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.07]">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    Step-by-Step Response Protocol
                  </h4>
                  <span className="text-xs font-mono text-slate-500 tabular-nums">
                    {currentPlaybook.steps.length} Actions
                  </span>
                </div>

                <div className="space-y-3">
                  {currentPlaybook.steps.map((st) => (
                    <div 
                      key={st.order}
                      className="p-4 rounded-xl bg-black/30 border border-white/[0.06] space-y-1.5"
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded bg-white/5 border border-white/10 text-slate-300 font-mono font-medium text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {st.order}
                        </span>
                        <div className="space-y-1">
                          <div className="text-xs sm:text-sm font-semibold text-white leading-snug">
                            {st.title}
                          </div>
                          <div className="text-xs text-slate-400 leading-relaxed font-sans">
                            <span className="font-medium text-slate-300">Why: </span>
                            {st.reason}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Investigation Context Correlation (if available) */}
              {currentReport && (
                <div className="p-4 rounded-xl bg-black/30 border border-white/[0.06] space-y-1.5 text-xs font-mono">
                  <div className="font-semibold text-white flex items-center gap-1.5 uppercase text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Technical Correlation with Current Scan</span>
                  </div>
                  <div className="text-slate-300 leading-relaxed text-xs font-sans">
                    Target evaluated: <span className="font-mono text-white">{currentReport.target?.display_value || currentReport.target}</span>. 
                    {currentReport.classification === 'CONFIRMED MALICIOUS' || currentReport.classification === 'HIGH RISK' ? (
                      <span className="text-rose-300 ml-1">
                        Authoritative threat telemetry corroborates malicious intent. Treat credentials entered on this destination as fully compromised.
                      </span>
                    ) : (
                      <span className="text-slate-400 ml-1">
                        Report classification: {currentReport.classification} (Risk score: {currentReport.risk_score}/100).
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Why These Steps Explanation */}
              <div className="p-4 rounded-xl bg-black/20 border border-white/[0.06] space-y-1 text-xs">
                <div className="font-medium text-slate-300 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                  <span>Why these specific steps?</span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed font-sans">
                  {currentPlaybook.why}
                </p>
              </div>

              {/* Disclaimer */}
              <p className="text-xs text-slate-500 leading-normal font-sans border-t border-white/[0.07] pt-3">
                {currentPlaybook.disclaimer}
              </p>

              {/* Actions Footer */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono text-slate-300 transition-colors cursor-pointer"
                >
                  Change Selection
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleCopyPlan}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs font-mono text-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer border border-white/[0.08]"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300">Plan Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copy Action Plan</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 sm:flex-initial px-5 py-2.5 rounded-lg bg-white hover:bg-slate-200 text-slate-950 font-medium text-xs transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

