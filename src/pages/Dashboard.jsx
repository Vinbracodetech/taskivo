import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Dashboard(props) {
  const [profile, setProfile] = useState(null);
  const [points, setPoints] = useState(0);
  const [role, setRole] = useState('earner');

  useEffect(function() {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', props.session.user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
        return;
      }

      if (profiles) {
        setProfile(profiles);
        setPoints(profiles.points || 0);
        setRole(profiles.role || 'earner');
      } else {
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{
            id: props.session.user.id,
            email: props.session.user.email,
            full_name: props.session.user.user_metadata.full_name || '',
            points: 0,
            role: 'earner'
          }])
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
          return;
        }

        setProfile(newProfile);
        setPoints(0);
        setRole('earner');
      }
    } catch (err) {
      console.error('Error:', err);
    }
  }

  async function handleRoleSwitch(newRole) {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', props.session.user.id);

      if (error) throw error;
      setRole(newRole);
    } catch (error) {
      console.error('Error switching role:', error);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0A0A0F, #0D0D18, #0A0F1A)',
      fontFamily: "'DM Sans', sans-serif",
      color: '#FFFFFF'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 30px',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <h1 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: '24px',
          fontWeight: '700',
          margin: 0
        }}>
          Taskivo
        </h1>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span style={{
            background: 'rgba(255,255,255,0.1)',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '14px'
          }}>
            {points} points
          </span>
          
          <button 
            onClick={props.onLogout}
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: '#FFFFFF',
              border: '1px solid rgba(255,255,255,0.2)',
              padding: '8px 16px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '13px'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '30px 20px' }}>
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '30px',
          background: 'rgba(255,255,255,0.03)',
          padding: '6px',
          borderRadius: '14px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <button
            onClick={function() { handleRoleSwitch('earner') }}
            style={{
              flex: 1,
              padding: '12px',
              background: role === 'earner' ? '#FFFFFF' : 'transparent',
              color: role === 'earner' ? '#0A0A0F' : 'rgba(255,255,255,0.6)',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            Earner
          </button>
          
          <button
            onClick={function() { handleRoleSwitch('creator') }}
            style={{
              flex: 1,
              padding: '12px',
              background: role === 'creator' ? '#FFFFFF' : 'transparent',
              color: role === 'creator' ? '#0A0A0F' : 'rgba(255,255,255,0.6)',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            Creator
          </button>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          padding: '30px',
          textAlign: 'center'
        }}>
          <p style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: '14px',
            marginBottom: '20px'
          }}>
            {role === 'earner' ? 'Available tasks will appear here' : 'Create tasks for earners to complete'}
          </p>
          
          <button style={{
            padding: '14px 28px',
            background: '#FFFFFF',
            color: '#0A0A0F',
            border: 'none',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: '600',
            fontFamily: "'DM Sans', sans-serif",
            cursor: 'pointer'
          }}>
            {role === 'earner' ? 'Browse Tasks' : 'Create Task'}
          </button>
        </div>

        <div style={{
          marginTop: '30px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '20px'
          }}>
            <p style={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: '13px',
              marginBottom: '8px'
            }}>
              Total Points
            </p>
            <p style={{
              fontSize: '28px',
              fontWeight: '700',
              fontFamily: "'Syne', sans-serif",
              margin: 0
            }}>
              {points}
            </p>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '20px'
          }}>
            <p style={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: '13px',
              marginBottom: '8px'
            }}>
              Tasks Completed
            </p>
            <p style={{
              fontSize: '28px',
              fontWeight: '700',
              fontFamily: "'Syne', sans-serif",
              margin: 0
            }}>
              0
            </p>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '20px'
          }}>
            <p style={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: '13px',
              marginBottom: '8px'
            }}>
              Role
            </p>
            <p style={{
              fontSize: '20px',
              fontWeight: '600',
              margin: 0,
              textTransform: 'capitalize'
            }}>
              {role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
            }
