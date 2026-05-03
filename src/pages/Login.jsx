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
