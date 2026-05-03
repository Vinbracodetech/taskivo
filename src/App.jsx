import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Landing from './pages/Landing';
import Login from './pages/Login';

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('landing');

  useEffect(function() {
    async function checkSession() {
      const result = await supabase.auth.getSession();
      setSession(result.data.session);
      setLoading(false);
    }
    checkSession();

    supabase.auth.onAuthStateChange(function(event, newSession) {
      setSession(newSession);
      if (newSession) {
        setCurrentPage('home');
      }
    });
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0A0A0F',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <p style={{ color: '#FFFFFF' }}>Loading...</p>
      </div>
    );
  }

  if (session) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0A0A0F, #0D0D18, #0A0F1A)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFFFFF',
        fontFamily: "'DM Sans', sans-serif"
      }}>
        <h1>Testing - You are logged in!</h1>
        <p>Email: {session.user.email}</p>
        <p>This confirms login works. Dashboard coming next.</p>
        <button 
          onClick={function() { supabase.auth.signOut(); window.location.reload(); }}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            background: '#FFFFFF',
            color: '#0A0A0F',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
    );
  }

  if (currentPage === 'login') {
    return <Login />;
  }

  return <Landing onNavigate={function(page) { setCurrentPage(page) }} />;
}
