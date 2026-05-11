import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleGoogleLogin() {
    try {
      setLoading(true);
      setMessage('');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'https://taskivo-34bm.vercel.app'
        }
      });
      if (error) throw error;
    } catch (error) {
      setMessage('Error: ' + error.message);
      setLoading(false);
    }
  }

  async function handleEmailLogin(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage('');
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });
      if (error) throw error;
      setMessage('Login successful!');
      window.location.href = '/';
    } catch (error) {
      setMessage('Error: ' + error.message);
      setLoading(false);
    }
  }

  // 🔥 THEME-AWARE STYLES WITH LIME ACCENT 🔥
  const S = {
    page: { 
      minHeight: '100vh', 
      background: 'var(--surface)', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '20px', 
      fontFamily: "'DM Sans', sans-serif",
      position: 'relative',
      overflow: 'hidden'
    },
    card: { 
      background: 'var(--surface-card)', 
      border: '1px solid var(--line)', 
      borderRadius: '24px', 
      padding: '48px 32px', 
      maxWidth: '420px', 
      width: '100%',
      position: 'relative',
      zIndex: 1,
      boxShadow: '0 24px 48px rgba(0,0,0,0.05)'
    },
    header: { 
      fontFamily: "'Syne', sans-serif", 
      color: 'var(--ink)', 
      fontSize: '32px', 
      fontWeight: '800', 
      marginBottom: '8px', 
      textAlign: 'center',
      letterSpacing: '-1px'
    },
    sub: { 
      color: 'var(--slate)', 
      fontSize: '15px', 
      textAlign: 'center', 
      marginBottom: '32px' 
    },
    input: { 
      width: '100%', 
      padding: '14px 16px', 
      background: 'var(--surface)', 
      border: '1px solid var(--line)', 
      borderRadius: '12px', 
      color: 'var(--ink)', 
      fontSize: '14px', 
      fontFamily: "'DM Sans', sans-serif", 
      marginBottom: '16px', 
      outline: 'none', 
      boxSizing: 'border-box',
      transition: 'border-color 0.2s'
    },
    btnGoogle: { 
      width: '100%', 
      padding: '14px', 
      background: 'var(--surface)', 
      color: 'var(--ink)', 
      border: '1px solid var(--line)', 
      borderRadius: '12px', 
      fontSize: '14px', 
      fontWeight: '700', 
      fontFamily: "'DM Sans', sans-serif", 
      cursor: loading ? 'not-allowed' : 'pointer', 
      opacity: loading ? 0.7 : 1, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      gap: '12px', 
      marginBottom: '24px',
      transition: 'background 0.2s'
    },
    btnPrimary: { 
      width: '100%', 
      padding: '16px', 
      background: 'var(--lime)', 
      color: '#000', // Always black for contrast against neon lime
      border: 'none', 
      borderRadius: '12px', 
      fontSize: '15px', 
      fontWeight: '800', 
      fontFamily: "'DM Sans', sans-serif", 
      cursor: loading ? 'not-allowed' : 'pointer', 
      opacity: loading ? 0.7 : 1,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      boxShadow: '0 8px 16px rgba(168,255,62,0.2)',
      transition: 'transform 0.2s, box-shadow 0.2s'
    }
  };

  return (
    <div style={S.page}>
      {/* LIME AMBIENT GLOW */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '400px', height: '400px', background: 'radial-gradient(circle, var(--lime) 0%, transparent 60%)', opacity: 0.05, pointerEvents: 'none', zIndex: 0 }} />

      <div style={S.card}>
        <h1 style={S.header}>Welcome back</h1>
        <p style={S.sub}>Sign in to continue earning</p>

        {message && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderLeft: '4px solid var(--lime)', borderRadius: '8px', padding: '12px', marginBottom: '24px', color: 'var(--ink)', fontSize: '13px', textAlign: 'center', fontWeight: '600' }}>
            {message}
          </div>
        )}

        <button onClick={handleGoogleLogin} disabled={loading} style={S.btnGoogle}>
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--line)' }} />
          <span style={{ color: 'var(--slate)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--line)' }} />
        </div>

        <form onSubmit={handleEmailLogin}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={function(e) { setEmail(e.target.value) }}
            required
            style={S.input}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={function(e) { setPassword(e.target.value) }}
            required
            style={S.input}
          />

          <button type="submit" disabled={loading} style={S.btnPrimary}>
            {loading ? 'Authenticating...' : 'Sign in with Email'}
          </button>
        </form>

        <p style={{ color: 'var(--slate)', fontSize: '14px', textAlign: 'center', marginTop: '32px', fontWeight: '500' }}>
          Don&apos;t have an account?{' '}
          <span onClick={() => window.location.href = '/signup'} style={{ color: 'var(--lime)', fontWeight: '700', cursor: 'pointer' }}>
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
