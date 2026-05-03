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
        email,
        password
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
    <div>
      <h1>Welcome back</h1>
      <p>Sign in to continue earning</p>

      {message && <p>{message}</p>}

      <button onClick={handleGoogleLogin} disabled={loading}>
        Continue with Google
      </button>

      <form onSubmit={handleEmailLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          Sign in
        </button>
      </form>
    </div>
  );
                  }
