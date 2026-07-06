import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const C = {
  surface: 'var(--surface)', card: 'var(--surface-card)', glass: 'var(--glass)',
  textMain: 'var(--ink)', textMuted: 'var(--slate)', line: 'var(--line)',
  lime: '#A8FF3E', limeText: 'var(--lime)', limeDim: 'var(--lime-dim)', red: '#ef4444',
};

export default function FloatingNav({ user, navigate, logout, toggleTheme, theme }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState(window.location.hash.replace('#', ''));

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash.replace('#', ''));
    };
    
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  if (!user) return null;

  function closeMenu() { setMenuOpen(false); }
  function openMenu() { setMenuOpen(true); }

  function handleNavigate(route) {
    closeMenu();
    navigate(route);
    setCurrentHash(route);
  }

  function handleLogout() {
    closeMenu();
    if (logout) logout();
  }

  // 🔥 UPDATED TO USE THE SECURE DATABASE MASTER KEY 🔥
  async function requestAccountDeletion() {
    closeMenu();
    const confirmed = window.confirm("Are you sure you want to permanently wipe your data? This will instantly delete your profile and log you out. This cannot be undone.");
    if (confirmed) {
      try {
        const { error } = await supabase.rpc('wipe_user_account', { target_user_id: user.id });
        
        if (error) throw error;
        
        alert("Your account data has been wiped.");
        if (logout) logout();
      } catch (err) {
        console.error(err);
        alert("There was an error deleting your data.");
      }
    }
  }

  // 🔥 ADDED GLOBE ICON FOR THE PUBLIC LANDING PAGE 🔥
  const IconGlobe = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>;
  const IconHome = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>;
  const IconTasks = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>;
  const IconWallet = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>;
  const IconProfile = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
  const IconAnalytics = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>;
  const IconUsers = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
  const IconAdminList = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;
  const IconMoon = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>;
  const IconSun = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>;
  const IconTrash = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
  const IconLogout = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;

  function PillButton({ icon, onClick, isActive }) {
    return (
      <button 
        onClick={onClick}
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
          background: isActive ? C.card : 'transparent', border: isActive ? `1px solid ${C.line}` : 'none', 
          borderRadius: 12, padding: '8px 16px', color: isActive ? C.limeText : C.textMuted, cursor: 'pointer', transition: 'all 0.2s ease'
        }}
      >
        {icon}
      </button>
    );
  }

  function MenuItem({ icon, label, onClick, isDestructive }) {
    return (
      <button 
        onClick={onClick}
        style={{
          display: 'flex', alignItems: 'center', gap: 16, width: '100%', background: 'transparent', border: 'none', padding: '16px 0',
          color: isDestructive ? C.red : C.textMain, cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontSize: 16, fontWeight: 500, borderBottom: `1px solid ${C.line}`
        }}
      >
        {icon} {label}
      </button>
    );
  }

  const homeRoute = user.role === 'admin' ? 'admin-dashboard' : user.role === 'creator' ? 'creator-dashboard' : 'user-dashboard';

  return (
    <>
      <div style={{ position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 4, padding: '8px', background: C.glass, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: `1px solid ${C.line}`, borderRadius: 100, zIndex: 9990, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
        
        <PillButton 
          icon={IconHome} 
          onClick={() => handleNavigate(homeRoute)} 
          isActive={currentHash === homeRoute || currentHash === ''} 
        />
        
        {user.role === 'earner' && (
          <>
            <PillButton icon={IconTasks} onClick={() => handleNavigate('tasks')} isActive={currentHash === 'tasks'} />
            <PillButton icon={IconWallet} onClick={() => handleNavigate('wallet')} isActive={currentHash === 'wallet'} />
          </>
        )}
        
        {user.role === 'creator' && (
          <>
            <PillButton icon={<span style={{fontSize: 16}}>🚀</span>} onClick={() => handleNavigate('create-task')} isActive={currentHash === 'create-task'} />
            <PillButton icon={IconAnalytics} onClick={() => handleNavigate('creator-analytics')} isActive={currentHash === 'creator-analytics'} />
          </>
        )}
        
        {user.role === 'admin' && (
          <>
            <PillButton icon={IconUsers} onClick={() => handleNavigate('admin-users')} isActive={currentHash === 'admin-users'} />
            <PillButton icon={IconAdminList} onClick={() => handleNavigate('admin-tasks')} isActive={currentHash === 'admin-tasks'} />
          </>
        )}
        
        <div style={{ width: 1, height: 24, background: C.line, margin: '0 4px' }} />
        
        <PillButton icon={IconProfile} onClick={openMenu} isActive={menuOpen} />
      </div>

      <div onClick={closeMenu} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 9995, opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? 'auto' : 'none', transition: 'opacity 0.3s ease' }} />

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999, background: C.surface, borderTop: `1px solid ${C.line}`, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: '32px 5% 48px', margin: '0 auto', maxWidth: 800, transform: menuOpen ? 'translateY(0)' : 'translateY(100%)', transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)', boxShadow: '0 -20px 40px rgba(0,0,0,0.2)', fontFamily: "'Inter', sans-serif" }}>
        <div style={{ width: 48, height: 4, background: C.line, borderRadius: 100, margin: '0 auto 32px' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: C.limeDim, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.limeText, fontSize: 18, fontWeight: 800, border: `1px solid ${C.line}` }}>{user.email ? user.email.charAt(0).toUpperCase() : 'U'}</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.textMain, marginBottom: 4, textTransform: 'capitalize' }}>{user.role === 'creator' ? 'Business Profile' : user.role + ' Profile'}</div>
            <div style={{ fontSize: 14, color: C.textMuted }}>{user.email}</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <MenuItem icon={IconGlobe} label="Taskivo Homepage" onClick={() => handleNavigate('landing')} />
          <MenuItem icon={IconHome} label="Dashboard" onClick={() => handleNavigate(homeRoute)} />
          
          {user.role === 'earner' && (<><MenuItem icon={IconTasks} label="Task Network" onClick={() => handleNavigate('tasks')} /><MenuItem icon={IconWallet} label="Wallet & Withdrawals" onClick={() => handleNavigate('wallet')} /></>)}
          {user.role === 'creator' && (<><MenuItem icon={<span style={{fontSize: 18}}>🚀</span>} label="Launch Campaign" onClick={() => handleNavigate('create-task')} /><MenuItem icon={IconAnalytics} label="Campaign Analytics" onClick={() => handleNavigate('creator-analytics')} /></>)}
          {user.role === 'admin' && (<><MenuItem icon={IconUsers} label="Manage Users" onClick={() => handleNavigate('admin-users')} /><MenuItem icon={IconAdminList} label="Review Network Tasks" onClick={() => handleNavigate('admin-tasks')} /><MenuItem icon={IconWallet} label="Process Withdrawals" onClick={() => handleNavigate('admin-withdrawals')} /></>)}
          
          <button onClick={toggleTheme} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: 'transparent', border: 'none', padding: '16px 0', color: C.textMain, cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontSize: 16, fontWeight: 500, borderBottom: `1px solid ${C.line}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>{theme === 'dark' ? IconMoon : IconSun} Theme</div>
            <span style={{ fontSize: 12, color: C.textMuted, background: C.card, border: `1px solid ${C.line}`, padding: '4px 8px', borderRadius: 6, textTransform: 'capitalize' }}>{theme}</span>
          </button>
          
          <MenuItem icon={IconTrash} label="Delete Account" onClick={requestAccountDeletion} isDestructive={true} />
          <MenuItem icon={IconLogout} label="Secure Logout" onClick={handleLogout} isDestructive={true} />
        </div>
      </div>
    </>
  );
}
