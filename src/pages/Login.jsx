import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  function handleEmailAuth() {
    setLoading(true)
    setError('')
    setMessage('')

    if (mode === 'register') {
      supabase.auth.signUp({
        email: email,
        password: password,
        options: { data: { full_name: name } }
      }).then(function(result) {
        if (result.error) {
          setError(result.error.message)
        } else {
          setMessage('Check your email to confirm your account.')
        }
        setLoading(false)
      })
    } else {
      supabase.auth.signInWithPassword({
        email: email,
        password: password
      }).then(function(result) {
        if (result.error) {
          setError(result.error.message)
        } else {
          navigate('/dashboard')
        }
        setLoading(false)
      })
    }
  }

  function handleGoogle() {
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/dashboard' }
    }).then(function(result) {
      if (result.error) setError(result.error.message)
    })
  }

  function toggleMode() {
    setMode(mode === 'login' ? 'register' : 'login')
    setError('')
    setMessage('')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ width: '40px', height: '40px', background: '#A8FF3E', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 10L8.5 14.5L16 6" stroke="#0A0A0F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '24px', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.03em' }}>
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h1>
          <p style={{ color: '#6B7280', fontSize: '14px', marginTop: '6px' }}>
            {mode === 'login' ? 'Sign in to your Taskivo account' : 'Start earning on Taskivo today'}
          </p>
        </div>

        <div style={{ background: '#111118', border: '1px solid #1E1E2E', borderRadius: '16px', padding: '28px' }}>

          <button
            onClick={handleGoogle}
            style={{ width: '100%', padding: '12px', background: '#ffffff', color: '#0A0A0F', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
              <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ flex: 1, height: '1px', background: '#1E1E2E' }} />
            <span style={{ color: '#6B7280', fontSize: '12px' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: '#1E1E2E' }} />
          </div>

          {mode === 'register' && (
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#9CA3AF', marginBottom: '6px' }}>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={function(e) { setName(e.target.value) }}
                placeholder="Your name"
                style={{ width: '100%', padding: '11px 14px', background: '#0A0A0F', border: '1px solid #1E1E2E', borderRadius: '9px', color: '#ffffff', fontSize: '14px', outline: 'none' }}
              />
            </div>
          )}

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#9CA3AF', marginBottom: '6px' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={function(e) { setEmail(e.target.value) }}
              placeholder="you@example.com"
              style={{ width: '100%', padding: '11px 14px', background: '#0A0A0F', border: '1px solid #1E1E2E', borderRadius: '9px', color: '#ffffff', fontSize: '14px', outline: 'none' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#9CA3AF', marginBottom: '6px' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={function(e) { setPassword(e.target.value) }}
              placeholder="••••••••"
              style={{ width: '100%', padding: '11px 14px', background: '#0A0A0F', border: '1px solid #1E1E2E', borderRadius: '9px', color: '#ffffff', fontSize: '14px', outline: 'none' }}
            />
          </div>

          {error !== '' && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '10px 14px', color: '#FCA5A5', fontSize: '13px', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          {message !== '' && (
            <div style={{ background: 'rgba(168,255,62,0.08)', border: '1px solid rgba(168,255,62,0.2)', borderRadius: '8px', padding: '10px 14px', color: '#A8FF3E', fontSize: '13px', marginBottom: '16px' }}>
              {message}
            </div>
          )}

          <button
            onClick={handleEmailAuth}
            disabled={loading}
            style={{ width: '100%', padding: '13px', background: loading ? '#4a7a1a' : '#A8FF3E', color: '#0A0A0F', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>

        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#6B7280', fontSize: '14px' }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={toggleMode}
            style={{ background: 'none', border: 'none', color: '#A8FF3E', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>

      </div>
    </div>
  )
                                                }
