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

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0A0A0F, #0D0D18, #0A0F1A)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: "'DM Sans', sans-serif"
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '20px',
        padding: '40px 30px',
        maxWidth: '400px',
        width: '100%'
      }}>
        <h1 style={{
          fontFamily: "'Syne', sans-serif",
          color: '#FFFFFF',
          fontSize: '32px',
          fontWeight: '700',
          marginBottom: '8px',
          textAlign: 'center'
        }}>
          Welcome back
        </h1>
        
        <p style={{
          color: 'rgba(255,255,255,0.5)',
          fontSize: '14px',
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          Sign in to continue earning
        </p>

        {message && (
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px',
            padding: '12px',
            marginBottom: '20px',
            color: '#FFFFFF',
            fontSize: '13px',
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}

        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            background: '#FFFFFF',
            color: '#0A0A0F',
            border: 'none',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: '600',
            fontFamily: "'DM Sans', sans-serif",
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '16px'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '16px'
        }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
        </div>

        <form onSubmit={handleEmailLogin}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={function(e) { setEmail(e.target.value) }}
            required
            style={{
              width: '100%',
              padding: '14px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              color: '#FFFFFF',
              fontSize: '14px',
              fontFamily: "'DM Sans', sans-serif",
              marginBottom: '12px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={function(e) { setPassword(e.target.value) }}
            required
            style={{
              width: '100%',
              padding: '14px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              color: '#FFFFFF',
              fontSize: '14px',
              fontFamily: "'DM Sans', sans-serif",
              marginBottom: '16px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: 'rgba(255,255,255,0.1)',
              color: '#FFFFFF',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '600',
              fontFamily: "'DM Sans', sans-serif",
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            Sign in with Email
          </button>
        </form>

        <p style={{
          color: 'rgba(255,255,255,0.3)',
          fontSize: '12px',
          textAlign: 'center',
          marginTop: '20px'
        }}>
          Don't have an account? 
          <span style={{ color: '#FFFFFF', textDecoration: 'underline', cursor: 'pointer' }}>
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
