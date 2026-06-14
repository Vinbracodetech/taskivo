import { useEffect } from 'react';

const S = {
  page: { padding: '80px 5%', maxWidth: 800, margin: '0 auto', fontFamily: "'DM Sans', sans-serif", minHeight: '100vh', background: 'var(--surface)' },
  title: { fontFamily: "'Inter', sans-serif", fontSize: 40, color: 'var(--ink)', marginBottom: 24, fontWeight: 800, letterSpacing: '-1px' },
  h2: { fontFamily: "'Inter', sans-serif", fontSize: 22, color: 'var(--ink)', margin: '48px 0 16px 0', fontWeight: 800, letterSpacing: '-0.5px' },
  h3: { fontFamily: "'Inter', sans-serif", fontSize: 18, color: 'var(--ink)', margin: '32px 0 12px 0', fontWeight: 700 },
  p: { color: 'var(--slate)', fontSize: 15, lineHeight: 1.8, marginBottom: 20 },
  li: { color: 'var(--slate)', fontSize: 15, lineHeight: 1.8, marginBottom: 12, marginLeft: 20 },
  accentBlock: { padding: 24, background: 'var(--surface-card)', borderLeft: '4px solid var(--lime)', border: '1px solid var(--line)', borderRadius: '0 12px 12px 0', marginBottom: 40 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginTop: 40 }
};

// ── SEO HELPER FUNCTION ──
function setSEO(title, description) {
  document.title = title;
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.name = 'description';
    document.head.appendChild(metaDesc);
  }
  metaDesc.content = description;
}

export function Terms() {
  useEffect(() => {
    setSEO(
      'Terms of Service | Taskivo', 
      'Read the comprehensive Terms of Service, User Conduct agreements, Escrow Policy, and Anti-Cheat protocols for the Taskivo B2B engagement infrastructure.'
    );
  }, []);

  return (
    <div style={S.page}>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12 }}>Effective Date: June 2026</div>
      <h1 style={S.title}>Terms of Service & Escrow Agreement</h1>
      <div style={{ height: 1, background: 'var(--line)', margin: '32px 0' }} />
      
      <div style={S.accentBlock}>
        <p style={{...S.p, margin: 0, color: 'var(--ink)', fontWeight: 600}}>Welcome to Taskivo. By accessing, browsing, or utilizing the Taskivo infrastructure as either a Creator (B2B Partner) or an Earner (Contributor), you explicitly agree to strict compliance with these Terms of Service, our Privacy Architecture, and all algorithmic safety protocols detailed herein.</p>
      </div>
      
      <h2 style={S.h2}>1. Acceptance of Terms</h2>
      <p style={S.p}>By registering for an account or otherwise interacting with the Taskivo platform (the "Service"), you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree to these terms, you must immediately cease use of the Service. We reserve the right, at our sole discretion, to modify or replace these Terms at any time. Significant changes will be communicated via email or an explicit platform notification.</p>
      
      <h2 style={S.h2}>2. Account Integrity & Layer 3 Verification</h2>
      <p style={S.p}>Taskivo operates a strict zero-tolerance policy regarding automated traffic, bot farms, and fraudulent engagement.</p>
      <ul>
        <li style={S.li}><strong>Identity Verification:</strong> Users must provide accurate, current, and complete identity information. To maintain network integrity, Earners are required to bind a verifiable, legally recognized financial institution to their account prior to any withdrawal.</li>
        <li style={S.li}><strong>Prohibited Conduct:</strong> The use of automated scripts, headless browsers, macro recorders, Virtual Private Networks (VPNs) to spoof geographical locations, or operating multiple accounts by a single individual is strictly prohibited.</li>
        <li style={S.li}><strong>Consequences of Breach:</strong> Violation of these integrity protocols will result in the immediate and permanent termination of your network access, alongside the irreversible forfeiture of all accumulated Points (PTS).</li>
      </ul>
      
      <h2 style={S.h2}>3. Escrow Protection & Manual Approvals</h2>
      <p style={S.p}>For premium B2B tasks—including but not limited to App Quality Assurance (QA) Testing and User-Generated Content (UGC) creation—Earner rewards are placed in a secure, cryptographic escrow ledger upon task submission.</p>
      <p style={S.p}>Creators maintain the exclusive right to manually review uploaded evidence (such as screenshots, video files, or written text) to ensure the submission meets the explicit campaign guidelines. If a submission is deemed fraudulent, low-effort, plagiarized, or inaccurate, the Creator may reject the work. Upon rejection, the escrowed funds will be returned entirely to the Creator's treasury.</p>
      
      <h2 style={S.h2}>4. Financial Clearing & Withdrawals</h2>
      <p style={S.p}>Points (PTS) act as an internal tracking metric for task completion and are held in our ledger pending final algorithmic verification. Taskivo reserves the right to audit accounts and withhold payouts if anomalous engagement patterns, high bounce rates, or rapid tab-switching are detected by our telemetry engines.</p>
      <p style={S.p}>Once cleared, withdrawals are processed to the user's explicitly bound financial account via our authorized payment gateways (e.g., Paystack). Processing times vary by regional banking infrastructure and cross-border settlement speeds. Taskivo is not liable for delays caused by third-party banking networks.</p>

      <h2 style={S.h2}>5. Creator Funding Obligations</h2>
      <p style={S.p}>Creators must fund their deployment campaigns using approved fiat payment rails prior to campaign activation. Any attempt to manipulate task budgets, exploit the Taskivo routing engine, execute fraudulent credit card chargebacks, or upload malicious URLs will result in the immediate suspension of all active campaigns, the freezing of the Creator's treasury, and potential legal action.</p>

      <h2 style={S.h2}>6. Intellectual Property Rights</h2>
      <p style={S.p}>The Taskivo Service, including its original content, features, proprietary routing algorithms, UI/UX design, and underlying code, is owned by Taskivo and is protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. You may not copy, modify, distribute, sell, or lease any part of our Service or included software.</p>
      <p style={S.p}>By uploading User-Generated Content (UGC) specifically requested by a Creator, the Earner grants the Creator a perpetual, irrevocable, worldwide, royalty-free license to use, modify, and distribute that specific content for commercial marketing purposes, unless otherwise stated in the specific task brief.</p>

      <h2 style={S.h2}>7. Governing Law & Dispute Resolution</h2>
      <p style={S.p}>These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Taskivo holds its primary corporate registration, without regard to its conflict of law provisions. Any dispute arising from or relating to the subject matter of these Terms shall be finally settled by binding arbitration in accordance with standard commercial arbitration rules.</p>
    </div>
  );
}

export function Privacy() {
  useEffect(() => {
    setSEO(
      'Privacy Policy & Data Architecture | Taskivo', 
      'Understand how Taskivo collects, uses, and protects your data. Read our comprehensive Privacy Policy covering GDPR/CCPA compliance, cookies, and telemetry.'
    );
  }, []);

  return (
    <div style={S.page}>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12 }}>Effective Date: June 2026</div>
      <h1 style={S.title}>Privacy Policy & Data Architecture</h1>
      <div style={{ height: 1, background: 'var(--line)', margin: '32px 0' }} />
      
      <p style={S.p}>Taskivo engineers its platform to collect the <strong>minimum viable telemetry</strong> required to verify human attention and execute secure financial distributions. We operate on a strict zero-sale data policy. This Privacy Policy details the types of information we collect, how it is used, and the rights you possess over your personal data.</p>
      
      <h2 style={S.h2}>1. Information We Collect</h2>
      <h3 style={S.h3}>A. Account Information</h3>
      <p style={S.p}>When you register for an account (via Google OAuth or standard registration), we collect your email address, full name, and chosen profile credentials. This is strictly utilized for account authentication and communication.</p>
      
      <h3 style={S.h3}>B. Telemetry & Verification Data</h3>
      <p style={S.p}>To protect our B2B partners from bot traffic, Taskivo captures specific engagement metrics during active tasks. This includes session duration, browser tab visibility assertions, scroll depth, and pointer-lock hardware profiling. This behavioral data is completely anonymized and used strictly for algorithmic verification.</p>

      <h3 style={S.h3}>C. Financial & KYC Information</h3>
      <p style={S.p}>Banking and payout information provided for withdrawal routing is encrypted and processed directly through our secure, PCI-compliant financial partners (e.g., Paystack). Taskivo does not store raw credit card numbers or raw bank credentials on our primary database ledgers.</p>
      
      <h2 style={S.h2}>2. How We Use Your Information</h2>
      <p style={S.p}>We use the collected data for the following purposes:</p>
      <ul>
        <li style={S.li}>To provide, maintain, and securely route the Taskivo platform.</li>
        <li style={S.li}>To process transactions, execute withdrawals, and send related financial notices.</li>
        <li style={S.li}>To detect, prevent, and address fraud, bot-farms, security breaches, and technical issues.</li>
        <li style={S.li}>To analyze platform usage trends to optimize the Creator and Earner experience.</li>
      </ul>

      <h2 style={S.h2}>3. Cookies and Tracking Technologies</h2>
      <p style={S.p}>Taskivo uses standard tracking technologies, including cookies and local storage tokens, to maintain user sessions, remember theme preferences (dark/light mode), and ensure secure authentication. You can instruct your browser to refuse all cookies; however, you may not be able to use certain portions of our Service (such as secure task verification) if you do so.</p>

      <h2 style={S.h2}>4. Third-Party Data Sharing</h2>
      <p style={S.p}><strong>We do not sell user telemetry, email addresses, or demographic profiles to third-party data brokers.</strong> Information is only shared under the following strict conditions:</p>
      <ul>
        <li style={S.li}><strong>Service Providers:</strong> With trusted infrastructure providers necessary for platform operation (e.g., Supabase for database hosting, Paystack for payment processing).</li>
        <li style={S.li}><strong>Legal Compliance:</strong> When legally compelled by appropriate law enforcement authorities or to protect the absolute rights, property, or safety of Taskivo, our users, or others.</li>
      </ul>

      <h2 style={S.h2}>5. Data Retention & User Rights (GDPR/CCPA)</h2>
      <p style={S.p}>We retain personal data only for as long as necessary to fulfill the purposes for which it was collected, including satisfying any legal, accounting, or reporting requirements. Depending on your jurisdiction, you have the right to:</p>
      <ul>
        <li style={S.li}>Request access to the personal data we hold about you.</li>
        <li style={S.li}>Request correction of inaccurate or incomplete data.</li>
        <li style={S.li}>Request the deletion or erasure of your account and associated personal data ("Right to be Forgotten").</li>
      </ul>
      <p style={S.p}>To exercise any of these rights, please contact our privacy compliance team via the support email listed in our footer.</p>
    </div>
  );
}

export function Disclaimer() {
  useEffect(() => {
    setSEO(
      'Legal & Earnings Disclaimer | Taskivo', 
      'Important disclaimers regarding earnings, independent contractor status, external links, and platform liability on the Taskivo network.'
    );
  }, []);

  return (
    <div style={S.page}>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12 }}>Effective Date: June 2026</div>
      <h1 style={S.title}>Platform Disclaimer & Limitation of Liability</h1>
      <div style={{ height: 1, background: 'var(--line)', margin: '32px 0' }} />
      
      <div style={S.accentBlock} style={{...S.accentBlock, borderLeft: '4px solid #ef4444', background: 'rgba(239, 68, 68, 0.05)'}}>
        <p style={{...S.p, margin: 0, color: 'var(--ink)', fontWeight: 600}}>Taskivo provides an infrastructure for micro-earning and engagement routing. We do not guarantee fixed incomes, full-time employment, or specific campaign outcomes for businesses.</p>
      </div>
      
      <h2 style={S.h2}>1. Comprehensive Earnings Disclaimer</h2>
      <p style={S.p}>Any points (PTS), financial rewards, income estimates, or success stories displayed on the Taskivo platform, marketing materials, or associated social media channels are strictly illustrative. They represent potential earning capabilities and do not guarantee that you will earn a specific amount of money.</p>
      <p style={S.p}>Actual earnings depend entirely on numerous independent variables, including but not limited to: your geographical location, your demographic profile, total platform demand from B2B Creators, your account standing, and your personal effort. Taskivo is not a "get-rich-quick" scheme, nor is it intended to serve as a reliable replacement for full-time employment or steady income.</p>
      
      <h2 style={S.h2}>2. Independent Contractor Status</h2>
      <p style={S.p}>By registering as an Earner on the Taskivo platform, you explicitly acknowledge and agree that you are acting as an independent contractor. You are not an employee, agent, joint venturer, or partner of Taskivo. You are not entitled to employment benefits, workers' compensation, or unemployment insurance. Furthermore, you are solely responsible for declaring your earnings and remitting any applicable local, state, or federal taxes in your respective jurisdiction.</p>

      <h2 style={S.h2}>3. External Links & Third-Party Content</h2>
      <p style={S.p}>The Taskivo platform actively routes users to third-party websites, YouTube videos, blogs, and applications created by independent Creators. Taskivo does not endorse, control, or take responsibility for the content, privacy policies, or practices of any third-party web sites or services. You acknowledge and agree that Taskivo shall not be responsible or liable, directly or indirectly, for any damage or loss caused by your interaction with these external assets.</p>

      <h2 style={S.h2}>4. Platform "As-Is" Clause & System Outages</h2>
      <p style={S.p}>The Taskivo Service is provided on an "AS IS" and "AS AVAILABLE" basis. While our engineering team strives for 99.9% uptime, we make no warranties, expressed or implied, regarding the continuous operation of the platform. Taskivo strictly disclaims any liability for lost potential earnings, delayed withdrawals, or disrupted B2B campaigns caused by server maintenance, catastrophic hardware failure, API disruptions from payment gateways, or overly sensitive algorithmic triggers.</p>

      <h2 style={S.h2}>5. Point (PTS) Valuation</h2>
      <p style={S.p}>Points (PTS) are strictly an internal ledger unit utilized to track engagement execution on our platform. PTS are not a cryptocurrency, security, or legal tender, and hold no intrinsic value outside of the Taskivo ecosystem. Taskivo reserves the absolute right to adjust the fiat conversion rate of PTS at any time based on global market conditions, platform liquidity, and administrative discretion.</p>
    </div>
  );
}

export function About() {
  useEffect(() => {
    setSEO(
      'About Taskivo | The Verification Layer of the Internet', 
      'Taskivo is the ultimate B2B digital engagement infrastructure, bridging the gap between enterprise businesses demanding verified human attention and global contributors.'
    );
  }, []);

  return (
    <div style={S.page}>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12 }}>Established 2026</div>
      <h1 style={S.title}>About Taskivo</h1>
      <div style={{ height: 1, background: 'var(--line)', margin: '32px 0' }} />
      
      <h2 style={{...S.h2, marginTop: 0, fontSize: 32, letterSpacing: '-1px'}}>The Verification Layer of the Internet.</h2>
      
      <h3 style={S.h3}>The Problem with Digital Advertising</h3>
      <p style={S.p}>The modern internet is fundamentally broken. It is flooded with automated scripts, headless browsers, and sophisticated bot farms. For enterprise businesses, marketing agencies, and content creators, this reality translates to billions of dollars wasted annually on fake clicks, artificial engagement, and polluted analytics. You pay for human attention, but you receive algorithmic noise.</p>
      <p style={S.p}>Conversely, for everyday internet users, their actual, genuine human attention—the most valuable commodity in the digital age—is continuously harvested by social media conglomerates without any direct financial compensation to the user.</p>
      
      <h3 style={S.h3}>The Taskivo Solution</h3>
      <p style={S.p}>Taskivo was engineered from the ground up as the definitive antidote to this imbalance. We have built a highly secure, omnichannel infrastructure that acts as a bridge. On one side, we have digital businesses demanding <strong>verified, sustained human attention</strong> to boost their SEO, train their algorithms, and test their applications. On the other side, we have a global, distributed workforce of real people seeking legitimate micro-earning opportunities.</p>
      
      <h3 style={S.h3}>Our Core Philosophy</h3>
      <p style={S.p}>We believe that digital engagement should be transparent, verifiable, and mutually beneficial. We do not sell traffic; we facilitate verifiable human interaction. By forcing every earner through a stringent Layer 3 Financial Verification process and utilizing advanced pointer-lock tracking, we ensure that every point distributed on our platform represents a real human looking at a real screen.</p>
      
      <div style={S.grid}>
        <div style={{ padding: 32, background: 'var(--surface-card)', border: '1px solid var(--line)', borderRadius: 16 }}>
          <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--lime)', marginBottom: 12, fontFamily: "'Inter', sans-serif" }}>100%</div>
          <div style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Verified Human Focus</div>
          <p style={{ color: 'var(--slate)', fontSize: 14, marginTop: 12, lineHeight: 1.6 }}>Our strict visibility timers, tab-switch detection, and hardware assertions guarantee that no bots or automated scripts can infiltrate the network.</p>
        </div>
        <div style={{ padding: 32, background: 'var(--surface-card)', border: '1px solid var(--line)', borderRadius: 16 }}>
          <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--lime)', marginBottom: 12, fontFamily: "'Inter', sans-serif" }}>T+1</div>
          <div style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Rapid Liquid Payouts</div>
          <p style={{ color: 'var(--slate)', fontSize: 14, marginTop: 12, lineHeight: 1.6 }}>Seamless API integration with global banking infrastructure ensures that our network of earners is compensated swiftly and securely.</p>
        </div>
        <div style={{ padding: 32, background: 'var(--surface-card)', border: '1px solid var(--line)', borderRadius: 16 }}>
          <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--lime)', marginBottom: 12, fontFamily: "'Inter', sans-serif" }}>B2B</div>
          <div style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Escrow Protection</div>
          <p style={{ color: 'var(--slate)', fontSize: 14, marginTop: 12, lineHeight: 1.6 }}>Creator funds are aggressively safeguarded. You maintain the right to manually review premium task submissions before any liquidity is released.</p>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: 80, padding: 56, background: 'var(--ink)', borderRadius: 24, boxShadow: '0 24px 48px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: 32, color: '#fff', margin: '0 0 12px 0', fontFamily: "'Inter', sans-serif", letterSpacing: '-0.5px' }}>Taskivo Central Command</h2>
        <div style={{ color: 'var(--lime)', fontSize: 15, textTransform: 'uppercase', letterSpacing: '3px', fontWeight: 800 }}>Operated globally. Backed by verified humans.</div>
      </div>
    </div>
  );
}
