import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function PhoneVerification({ user, onVerified, onCancel }) {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function sendCode() {
    setLoading(true);
    setError(null);
    const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;

    try {
      const { error } = await supabase.auth.updateUser({ phone: formattedPhone });
      if (error) throw error;
      
      setPhone(formattedPhone);
      setStep(2); 
    } catch (err) {
      setError(err.message || "Failed to send code. Check number format (e.g. +234...)");
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode() {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: phone,
        token: otp,
        type: 'phone_change'
      });
      if (error) throw error;
      onVerified();
    } catch (err) {
      setError(err.message || "Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const S = {
    overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20, fontFamily: "'DM Sans', sans-serif" },
    card: { background: 'var(--surface-card)', border: '1px solid var(--line)', borderRadius: 24, padding: 32, width: '100%', maxWidth: 400, boxShadow: '0 24px 48px rgba(0,0,0,0.2)', position: 'relative' },
    title: { fontSize: 24, fontWeight: 800, color: 'var(--ink)', marginBottom: 8, fontFamily: "'Inter', sans-serif", letterSpacing: '-0.5px' },
    sub: { fontSize: 14, color: 'var(--slate)', marginBottom: 24, lineHeight: 1.5 },
    label: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--slate)', marginBottom: 8, display: 'block' },
    input: { width: '100%', padding: '14px 16px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12, color: 'var(--ink)', fontSize: 16, outline: 'none', boxSizing: 'border-box', marginBottom: 16 },
    btnLime: { width: '100%', background: 'var(--lime)', border: 'none', color: '#000', borderRadius: 12, padding: '14px', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: "'Inter', sans-serif" },
    btnCancel: { width: '100%', background: 'transparent', border: 'none', color: 'var(--slate)', padding: '14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', marginTop: 8 },
    errorBox: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: 12, borderRadius: 8, fontSize: 13, marginBottom: 16, textAlign: 'center' }
  };

  return (
    <div style={S.overlay}>
      <div style={S.card}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>📱</div>
        <h2 style={S.title}>{step === 1 ? 'Human Verification' : 'Enter Secure Code'}</h2>
        <p style={S.sub}>
          {step === 1 
            ? 'To protect network integrity, all contributors must verify a valid phone number before accessing tasks.' 
            : `We sent a 6-digit verification code to ${phone}.`}
        </p>

        {error && <div style={S.errorBox}>{error}</div>}

        {step === 1 ? (
          <>
            <div>
              <label style={S.label}>Mobile Number (with country code)</label>
              <input type="tel" placeholder="+234 800 000 0000" value={phone} onChange={(e) => setPhone(e.target.value)} style={S.input} />
            </div>
            <button onClick={sendCode} disabled={loading || !phone} style={{ ...S.btnLime, opacity: loading || !phone ? 0.5 : 1 }}>
              {loading ? 'SENDING...' : 'SEND VERIFICATION CODE'}
            </button>
            {onCancel && <button onClick={onCancel} style={S.btnCancel}>Cancel</button>}
          </>
        ) : (
          <>
            <div>
              <label style={S.label}>6-Digit Code</label>
              <input type="text" maxLength={6} placeholder="123456" value={otp} onChange={(e) => setOtp(e.target.value)} style={{ ...S.input, textAlign: 'center', fontSize: 24, letterSpacing: '4px', fontWeight: 800 }} />
            </div>
            <button onClick={verifyCode} disabled={loading || otp.length < 6} style={{ ...S.btnLime, opacity: loading || otp.length < 6 ? 0.5 : 1 }}>
              {loading ? 'VERIFYING...' : 'CONFIRM ACCOUNT'}
            </button>
            <button onClick={() => setStep(1)} style={S.btnCancel}>Use a different number</button>
          </>
        )}
      </div>
    </div>
  );
}
