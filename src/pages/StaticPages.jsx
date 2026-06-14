import { useEffect } from 'react';

const S = {
  page: { padding: '80px 5%', maxWidth: 800, margin: '0 auto', fontFamily: "'DM Sans', sans-serif", minHeight: '100vh', background: 'var(--surface)' },
  title: { fontFamily: "'Inter', sans-serif", fontSize: 40, color: 'var(--ink)', marginBottom: 24, fontWeight: 800, letterSpacing: '-1px' },
  h2: { fontFamily: "'Inter', sans-serif", fontSize: 20, color: 'var(--ink)', margin: '40px 0 16px 0', fontWeight: 700 },
  p: { color: 'var(--slate)', fontSize: 15, lineHeight: 1.7, marginBottom: 16 },
  accentBlock: { padding: 24, background: 'var(--surface-card)', borderLeft: '4px solid var(--lime)', border: '1px solid var(--line)', borderRadius: '0 12px 12px 0', marginBottom: 32 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginTop: 32 }
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
      'Read the official Terms of Service, Escrow Policy, and Anti-Cheat protocols for the Taskivo B2B engagement infrastructure.'
    );
  }, []);

  return (
    <div style={S.page}>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12 }}>Last Updated: June 2026</div>
      <h1 style={S.title}>Terms of Service & Escrow Policy</h1>
      <div style={{ height: 1, background: 'var(--line)', margin: '32px 0' }} />
      
      <div style={S.accentBlock}>
        <p style={{...S.p, margin: 0, color: 'var(--ink)', fontWeight: 600}}>By accessing the Taskivo infrastructure as either a Creator or an Earner, you agree to strict compliance with our Anti-Cheat, Escrow, and algorithmic safety protocols.</p>
      </div>
      
      <h2 style={S.h2}>1. Account Integrity & Layer 3 Verification</h2>
      <p style={S.p}>Users must provide accurate identity information. To maintain network integrity, Earners are required to bind a verifiable financial institution to their account. The use of automated scripts, headless browsers, VPNs to spoof geography, or operating multiple accounts will result in immediate network termination and forfeiture of all accumulated Points (PTS).</p>
      
      <h2 style={S.h2}>2. Escrow Protection & Manual Approvals</h2>
      <p style={S.p}>For premium B2B tasks (including App QA Testing and User-Generated Content), Earner rewards are placed in a secure escrow ledger upon submission. Creators maintain the right to manually review uploaded evidence (screenshots, videos, or text) to ensure quality. If a submission is deemed fraudulent, low-effort, or inaccurate, the Creator may reject the work, and funds will be returned to the Creator's treasury.</p>
      
      <h2 style={S.h2}>3. Financial Clearing & Withdrawals</h2>
      <p style={S.p}>Points (PTS) are held in our ledger pending final algorithmic verification. Taskivo reserves the right to audit and withhold payouts if anomalous engagement patterns are detected. Once cleared, withdrawals are processed to the user's bound financial account via our authorized payment gateways. Processing times vary by regional banking infrastructure.</p>

      <h2 style={S.h2}>4. Creator Funding Obligations</h2>
      <p style={S.p}>Creators must fund their campaigns using approved fiat payment rails. Any attempt to manipulate task budgets, bypass the Taskivo routing engine, or submit fraudulent chargebacks will result in the immediate suspension of all active campaigns and legal action where applicable.</p>
    </div>
  );
}

export function Privacy() {
  useEffect(() => {
    setSEO(
      'Privacy Architecture | Taskivo', 
      'Learn how Taskivo protects user data, executes financial routing, and secures network telemetry against bot farms.'
    );
  }, []);

  return (
    <div style={S.page}>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12 }}>Last Updated: June 2026</div>
      <h1 style={S.title}>Privacy Architecture</h1>
      <div style={{ height: 1, background: 'var(--line)', margin: '32px 0' }} />
      
      <p style={S.p}>Taskivo engineers its platform to collect the <strong>minimum viable telemetry</strong> required to verify human attention and execute secure financial distributions. We operate on a strict zero-sale data policy.</p>
      
      <h2 style={S.h2}>1. Telemetry & Verification Data</h2>
      <p style={S.p}>To protect our B2B partners from bot traffic, Taskivo captures specific engagement metrics during active tasks. This includes session duration, browser tab visibility assertions, and pointer-lock hardware profiling. This data is used strictly for algorithmic verification and is never utilized for targeted advertising.</p>
      
      <h2 style={S.h2}>2. Financial & KYC Information</h2>
      <p style={S.p}>Banking and payout information provided for withdrawal routing is encrypted and processed directly through our secure financial partners (e.g., Paystack). Taskivo does not store raw credit card numbers or raw bank credentials on our primary database ledgers.</p>

      <h2 style={S.h2}>3. Third-Party Sharing</h2>
      <p style={S.p}>We do not sell user telemetry, email addresses, or demographic profiles to third-party data brokers. Information is only shared with trusted infrastructure providers necessary for platform operation (authentication, database hosting, and payment processing), or when legally compelled by appropriate authorities.</p>
    </div>
  );
}

export function Disclaimer() {
  useEffect(() => {
    setSEO(
      'Legal & Earnings Disclaimer | Taskivo', 
      'Important disclaimers regarding earnings, independent contractor status, and platform liability on the Taskivo network.'
    );
  }, []);

  return (
    <div style={S.page}>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12 }}>Last Updated: June 2026</div>
      <h1 style={S.title}>Platform Disclaimer</h1>
      <div style={{ height: 1, background: 'var(--line)', margin: '32px 0' }} />
      
      <div style={S.accentBlock} style={{...S.accentBlock, borderLeft: '4px solid #ef4444', background: 'rgba(239, 68, 68, 0.05)'}}>
        <p style={{...S.p, margin: 0, color: 'var(--ink)', fontWeight: 600}}>Taskivo provides an infrastructure for micro-earning and engagement routing. We do not guarantee fixed incomes, full-time employment, or specific campaign outcomes.</p>
      </div>
      
      <h2 style={S.h2}>1. Earnings Disclaimer</h2>
      <p style={S.p}>Any points (PTS), rewards, or financial estimates displayed on Taskivo are illustrative. Actual earnings depend entirely on your geographical location, demographic profile, platform demand from B2B Creators, and your personal effort. Taskivo is not a get-rich-quick scheme, nor is it intended to replace a full-time income.</p>
      
      <h2 style={S.h2}>2. Independent Contractor Status</h2>
      <p style={S.p}>By registering as an Earner on Taskivo, you are acting as an independent contractor. You are not an employee, agent, or partner of Taskivo. You are solely responsible for declaring your earnings and paying any applicable local taxes in your jurisdiction.</p>

      <h2 style={S.h2}>3. Platform As-Is</h2>
      <p style={S.p}>Taskivo is provided on an "as-is" and "as-available" basis. While we strive for 99.9% uptime, we do not warrant that the platform will be uninterrupted or error-free. Taskivo is not liable for lost potential earnings due to server maintenance, algorithmic triggers, or Creator campaign exhaustion.</p>

      <h2 style={S.h2}>4. Point (PTS) Value</h2>
      <p style={S.p}>Points (PTS) are an internal ledger unit used to track engagement execution. They are not a cryptocurrency, security, or legal tender. Taskivo reserves the right to adjust the fiat conversion rate of PTS at any time based on global market conditions.</p>
    </div>
  );
}

export function About() {
  useEffect(() => {
    setSEO(
      'About Taskivo | The Verification Layer of the Internet', 
      'Taskivo bridges the gap between enterprise businesses demanding verified human attention and global contributors seeking legitimate micro-earning opportunities.'
    );
  }, []);

  return (
    <div style={S.page}>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12 }}>Established 2026</div>
      <h1 style={S.title}>About Taskivo</h1>
      <div style={{ height: 1, background: 'var(--line)', margin: '32px 0' }} />
      
      <h2 style={{...S.h2, marginTop: 0, fontSize: 28, letterSpacing: '-0.5px'}}>The Verification Layer of the Internet.</h2>
      <p style={S.p}>The modern internet is flooded with automated scripts, headless browsers, and bot farms. For enterprise businesses, this means billions of dollars wasted on fake clicks, artificial engagement, and polluted analytics. For everyday users, it means their actual human attention is undervalued.</p>
      <p style={S.p}>Taskivo was engineered as the antidote. We built a secure, omnichannel infrastructure that bridges the gap between digital businesses demanding <strong>verified human attention</strong>, and a global distributed workforce seeking legitimate micro-earning opportunities.</p>
      
      <div style={S.grid}>
        <div style={{ padding: 24, background: 'var(--surface-card)', border: '1px solid var(--line)', borderRadius: 16 }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--lime)', marginBottom: 8, fontFamily: "'Inter', sans-serif" }}>100%</div>
          <div style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Verified Human Focus</div>
          <p style={{ color: 'var(--slate)', fontSize: 13, marginTop: 12, lineHeight: 1.5 }}>Our strict visibility timers and hardware assertions guarantee that no bots infiltrate the network.</p>
        </div>
        <div style={{ padding: 24, background: 'var(--surface-card)', border: '1px solid var(--line)', borderRadius: 16 }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--lime)', marginBottom: 8, fontFamily: "'Inter', sans-serif" }}>T+1</div>
          <div style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Rapid Liquid Payouts</div>
          <p style={{ color: 'var(--slate)', fontSize: 13, marginTop: 12, lineHeight: 1.5 }}>Seamless integration with global banking infrastructure ensures earners are compensated swiftly.</p>
        </div>
        <div style={{ padding: 24, background: 'var(--surface-card)', border: '1px solid var(--line)', borderRadius: 16 }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--lime)', marginBottom: 8, fontFamily: "'Inter', sans-serif" }}>B2B</div>
          <div style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Escrow Protection</div>
          <p style={{ color: 'var(--slate)', fontSize: 13, marginTop: 12, lineHeight: 1.5 }}>Creator funds are safeguarded. You manually review premium task submissions before liquidity is released.</p>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: 80, padding: 40, background: 'var(--ink)', borderRadius: 24 }}>
        <h2 style={{ fontSize: 24, color: '#fff', margin: '0 0 8px 0', fontFamily: "'Inter', sans-serif" }}>Taskivo Central</h2>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600 }}>Operated globally, backed by verified humans.</div>
      </div>
    </div>
  );
}
