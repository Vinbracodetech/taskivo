import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('landing');

  useEffect(function() {
    supabase.auth.getSession().then(function(result) {
      setSession(result.data.session);
      setLoading(false);
    });

    supabase.auth.onAuthStateChange(function(event, newSession) {
      setSession(newSession);
      if (newSession) {
        setCurrentPage('dashboard');
      }
    });
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0A0A0F, #0D0D18, #0A0F1A)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <p style={{ color: '#FFFFFF', fontFamily: "'DM Sans', sans-serif" }}>
          Loading...
        </p>
      </div>
    );
  }

  function handleNavigate(page) {
    setCurrentPage(page);
  }

  function handleLogout() {
    supabase.auth.signOut();
    setCurrentPage('landing');
  }

  if (session && currentPage === 'dashboard') {
    return <Dashboard session={session} onNavigate={handleNavigate} onLogout={handleLogout} />;
  }

  if (currentPage === 'login') {
    return <Login onNavigate={handleNavigate} />;
  }

  return <Landing onNavigate={handleNavigate} />;
}
