import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';

export default function App() {
  const [message, setMessage] = useState('Loading...');

  useEffect(function() {
    async function init() {
      try {
        const result = await supabase.auth.getSession();
        if (result.data.session) {
          setMessage('Logged in as: ' + result.data.session.user.email);
        } else {
          setMessage('Not logged in - Landing page would be here');
        }
      } catch (e) {
        setMessage('Error: ' + e.message);
      }
    }
    init();
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0A0A0F, #0D0D18, #0A0F1A)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <p style={{
        color: '#FFFFFF',
        fontSize: '18px',
        fontFamily: "'DM Sans', sans-serif",
        textAlign: 'center'
      }}>
        {message}
      </p>
    </div>
  );
}
