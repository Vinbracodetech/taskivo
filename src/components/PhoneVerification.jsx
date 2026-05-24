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
    
    // Silently strip all spaces, dashes, and letters. Keep only numbers and '+'
    let cleanPhone = phone.replace(/[^0-9+]/g, '');
    const formattedPhone = cleanPhone.startsWith('+') ? cleanPhone : `+${cleanPhone}`;

    try {
      // 🔥 INSTEAD OF NATIVE SUPABASE SMS, WE CALL OUR CUSTOM WHATSAPP EDGE FUNCTION
      const { data, error } = await supabase.functions.invoke('whatsapp-auth', {
        body: { action: 'send', phone: formattedPhone, userId: user.id }
      });
      
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      
      setPhone(formattedPhone); 
      setStep(2); 
    } catch (err) {
      setError(err.message || "Failed to send WhatsApp message. Ensure the number has a WhatsApp account.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode() {
    setLoading(true);
    setError(null);

    try {
      // 🔥 VERIFY THE OTP VIA THE EDGE FUNCTION
      const { data, error } = await supabase.functions.invoke('whatsapp-auth', {
        body: { action: 'verify', phone: phone, token: otp, userId: user.id }
      });
      
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      
      // If successful, the Edge Function will have updated the user's phone in the DB.
      onVerified();
    } catch (err) {
      setError(err.message || "Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── THEME-AWARE WHATSAPP STYLES ──
  const S = {
    overlay: { position: 'fixed', inset: 0, background: 'rgba(13, 13, 20, 0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20, fontFamily: "'DM Sans', sans-serif" },
    card: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 24, padding: 32, width: '100%', maxWidth: 400, boxShadow: '0 32px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)', position: 'relative', textAlign: 'center' },
    title: { fontSize: 24, fontWeight: 800, color: '#ffffff', marginBottom: 8, fontFamily: "'Inter', sans-serif", letterSpacing: '-0.5px' },
    sub: { fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 24, lineHeight: 1.6 },
    label: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.5)', marginBottom: 8, display: 'block', textAlign: 'left' },
    input: { width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#ffffff', fontSize: 16, outline: 'none', boxSizing: 'border-box', marginBottom: 20, transition: 'border-color 0.2s', fontFamily: "'DM Sans', sans-serif" },
    btnWhatsApp: { width: '100%', background: loading ? 'rgba(37, 211, 102, 0.5)' : '#25D366', border: 'none', color: '#0D0D14', borderRadius: 12, padding: '14px', fontSize: 15, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'Inter', sans-serif", transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 },
    btnCancel: { width: '100%', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', padding: '14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', marginTop: 8, transition: 'color 0.2s' },
    errorBox: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', padding: '10px 14px', borderRadius: 10, fontSize: 13, marginBottom: 20, textAlign: 'center' },
    waIcon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.81 11.81 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413Z"/></svg>
  };

  return (
    <div style={S.overlay}>
      <div style={S.card}>
        <div style={{ fontSize: 48, marginBottom: 16, color: '#25D366' }}>{S.waIcon}</div>
        <h2 style={S.title}>{step === 1 ? 'WhatsApp Verification' : 'Enter Secure Code'}</h2>
        <p style={S.sub}>
          {step === 1 
            ? 'To protect network integrity, all contributors must verify a valid WhatsApp number before accessing tasks.' 
            : `We sent a 6-digit WhatsApp code to ${phone}.`}
        </p>

        {error && <div style={S.errorBox}>{error}</div>}

        {step === 1 ? (
          <>
            <div style={{ textAlign: 'left' }}>
              <label style={S.label}>WhatsApp Number (with country code)</label>
              <input type="tel" placeholder="+234 900 000 0000" value={phone} onChange={(e) => setPhone(e.target.value)} style={S.input} />
            </div>
            <button onClick={sendCode} disabled={loading || !phone} style={{ ...S.btnWhatsApp, opacity: loading || !phone ? 0.5 : 1 }}>
              {loading ? 'SENDING...' : 'SEND WHATSAPP CODE'}
            </button>
            {onCancel && <button onClick={onCancel} style={S.btnCancel}>Cancel & Return</button>}
          </>
        ) : (
          <>
            <div style={{ textAlign: 'left' }}>
              <label style={S.label}>6-Digit Code</label>
              <input type="text" maxLength={6} placeholder="123456" value={otp} onChange={(e) => setOtp(e.target.value)} style={{ ...S.input, textAlign: 'center', fontSize: 28, letterSpacing: '8px', fontWeight: 800, fontFamily: "'Inter', sans-serif" }} />
            </div>
            <button onClick={verifyCode} disabled={loading || otp.length < 6} style={{ ...S.btnWhatsApp, opacity: loading || otp.length < 6 ? 0.5 : 1 }}>
              {loading ? 'VERIFYING...' : 'CONFIRM ACCOUNT'}
            </button>
            <button onClick={() => setStep(1)} style={S.btnCancel}>Use a different number</button>
          </>
        )}
      </div>
    </div>
  );
}
