import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';

// Premium Gold + Navy color scheme
const colors = {
  navy: '#0F1A2E',
  navyLight: '#162240',
  navyDark: '#0A1222',
  gold: '#C9A84C',
  goldLight: '#DFC278',
  goldDark: '#A68A34',
  white: '#FFFFFF',
  textMuted: 'rgba(255,255,255,0.5)',
  border: 'rgba(201,168,76,0.15)'
};

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('landing');

  useEffect(function() {
    async function init() {
      try {
        var result = await supabase.auth.getSession();
        setSession(result.data.session);
        
        supabase.auth.onAuthStateChange(function(event, newSession) {
          setSession(newSession);
          if (newSession) {
            setCurrentPage('dashboard');
          }
        });
      } catch (e) {
        console.error('Session error:', e);
      }
      setLoading(false);
    }
    init();
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0A1222 0%, #0F1A2E 50%, #162240 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{
            color: colors.gold,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '16px',
            marginBottom: '12px',
            fontWeight: '600'
          }}>
            Taskivo
          </p>
          <p style={{
            color: colors.textMuted,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '13px'
          }}>
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  function navigate(page) {
    setCurrentPage(page);
  }

  function handleLogout() {
    supabase.auth.signOut();
    setSession(null);
    setCurrentPage('landing');
  }

  // User is logged in
  if (session) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0A1222 0%, #0F1A2E 50%, #162240 100%)',
        fontFamily: "'DM Sans', sans-serif",
        color: colors.white
      }}>
        {/* Top Navigation Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 24px',
          background: 'rgba(15,26,46,0.9)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid ' + colors.border,
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: '22px',
            fontWeight: '700',
            color: colors.gold,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              background: 'linear-gradient(135deg, ' + colors.gold + ', ' + colors.goldLight + ')',
              borderRadius: '50%',
              display: 'inline-block'
            }} />
            Taskivo
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{
              color: colors.textMuted,
              fontSize: '13px'
            }}>
              {session.user.email}
            </span>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                background: 'rgba(201,168,76,0.1)',
                color: colors.gold,
                border: '1px solid ' + colors.border,
                borderRadius: '8px',
                cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '13px',
                fontWeight: '500'
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '40px 20px'
        }}>
          {/* Welcome Card */}
          <div style={{
            background: 'linear-gradient(135deg, ' + colors.navyLight + ' 0%, rgba(201,168,76,0.08) 100%)',
            border: '1px solid ' + colors.border,
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '24px'
          }}>
            <h1 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '28px',
              fontWeight: '700',
              marginBottom: '8px',
              marginTop: 0,
              color: colors.white
            }}>
              Welcome to your Dashboard
            </h1>
            <p style={{
              color: colors.textMuted,
              fontSize: '14px',
              marginBottom: '20px',
              marginTop: 0
            }}>
              Your connected account: {session.user.email}
            </p>
            
            {/* Stats Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '12px'
            }}>
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid ' + colors.border,
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'center'
              }}>
                <p style={{
                  color: colors.textMuted,
                  fontSize: '11px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '8px',
                  marginTop: 0
                }}>
                  Points
                </p>
                <p style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: '28px',
                  fontWeight: '700',
                  color: colors.gold,
                  margin: 0
                }}>
                  0
                </p>
              </div>

              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid ' + colors.border,
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'center'
              }}>
                <p style={{
                  color: colors.textMuted,
                  fontSize: '11px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '8px',
                  marginTop: 0
                }}>
                  Tasks Done
                </p>
                <p style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: '28px',
                  fontWeight: '700',
                  color: colors.gold,
                  margin: 0
                }}>
                  0
                </p>
              </div>

              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid ' + colors.border,
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'center'
              }}>
                <p style={{
                  color: colors.textMuted,
                  fontSize: '11px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '8px',
                  marginTop: 0
                }}>
                  Status
                </p>
                <p style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: '16px',
                  fontWeight: '600',
                  color: colors.goldLight,
                  margin: 0,
                  textTransform: 'capitalize'
                }}>
                  Active
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            marginBottom: '24px'
          }}>
            <button style={{
              padding: '16px',
              background: 'linear-gradient(135deg, ' + colors.gold + ', ' + colors.goldLight + ')',
              color: colors.navyDark,
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '700',
              fontFamily: "'DM Sans', sans-serif",
              cursor: 'pointer'
            }}>
              Browse Tasks
            </button>
            
            <button style={{
              padding: '16px',
              background: 'rgba(201,168,76,0.08)',
              color: colors.gold,
              border: '1px solid ' + colors.border,
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              fontFamily: "'DM Sans', sans-serif",
              cursor: 'pointer'
            }}>
              My Wallet
            </button>
          </div>

          {/* Empty State for Tasks */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid ' + colors.border,
            borderRadius: '16px',
            padding: '40px',
            textAlign: 'center'
          }}>
            <p style={{
              fontSize: '32px',
              marginBottom: '12px',
              marginTop: 0
            }}>
              📋
            </p>
            <p style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '18px',
              fontWeight: '600',
              color: colors.white,
              marginBottom: '8px',
              marginTop: 0
            }}>
              No tasks yet
            </p>
            <p style={{
              color: colors.textMuted,
              fontSize: '13px',
              marginBottom: '16px',
              marginTop: 0
            }}>
              Tasks from creators will appear here. Start as a creator or wait for new tasks.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Not logged in - Landing Page
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0A1222 0%, #0F1A2E 50%, #162240 100%)',
      fontFamily: "'DM Sans', sans-serif"
    }}>
      {/* Nav */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 30px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: '24px',
          fontWeight: '700',
          color: colors.gold,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            background: 'linear-gradient(135deg, ' + colors.gold + ', ' + colors.goldLight + ')',
            borderRadius: '50%',
            display: 'inline-block'
          }} />
          Taskivo
        </div>
        <button
          onClick={function() { navigate('login') }}
          style={{
            padding: '10px 24px',
            background: 'linear-gradient(135deg, ' + colors.gold + ', ' + colors.goldLight + ')',
            color: colors.navyDark,
            border: 'none',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            fontFamily: "'DM Sans', sans-serif",
            cursor: 'pointer'
          }}
        >
          Sign In
        </button>
      </div>

      {/* Hero */}
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '80px 20px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: '48px',
          fontWeight: '700',
          color: colors.white,
          marginBottom: '16px',
          lineHeight: '1.1',
          marginTop: 0
        }}>
          Complete Tasks.
          <br />
          <span style={{ color: colors.gold }}>Get Paid.</span>
        </h1>
        <p style={{
          color: colors.textMuted,
          fontSize: '16px',
          lineHeight: '1.7',
          marginBottom: '32px',
          marginTop: 0
        }}>
          A global platform connecting creators with real audiences. 
          Complete tasks, earn points, withdraw anytime.
        </p>
        <button
          onClick={function() { navigate('login') }}
          style={{
            padding: '14px 32px',
            background: 'linear-gradient(135deg, ' + colors.gold + ', ' + colors.goldLight + ')',
            color: colors.navyDark,
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '700',
            fontFamily: "'DM Sans', sans-serif",
            cursor: 'pointer'
          }}
        >
          Get Started Free
        </button>
      </div>
    </div>
  );
}
