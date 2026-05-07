import { useState } from 'react';

const C = {
  ink: '#0D0D14',
  lime: '#A8FF3E',
  white: '#ffffff',
  slate: '#8B8B9E',
  line: 'rgba(255,255,255,0.08)',
  glass: 'rgba(13, 13, 20, 0.75)', 
};

export default function FloatingNav({ user, navigate, logout, toggleTheme, theme }) {
  const [menuOpen, setMenuOpen] = useState(false);

  // If there is no user, don't show the nav
  if (!user) return null;

  function closeMenu() {
    setMenuOpen(false);
  }

  function openMenu() {
    setMenuOpen(true);
  }

  function handleNavigate(route) {
    closeMenu();
    navigate(route);
  }

  function handleLogout() {
    closeMenu();
    if (logout) logout();
  }

  // --- SVG Icons (Minimal & Professional) ---
  const IconHome = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>;
  const IconTasks = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>;
  const IconWallet = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>;
  const IconProfile = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
  const IconMoon = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>;
  const IconSun = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>;
  const IconLogout = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;

  // Helper for rendering Nav items on the Pill
  function PillButton({ icon, label, onClick, isProfile }) {
    return (
      <button 
        onClick={onClick}
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
          background: isProfile ? 'rgba(255,255,255,0.05)' : 'transparent',
          border: 'none', borderRadius: 12, padding: isProfile ? '8px 16px' : '8px 16px',
          color: isProfile ? C.white : C.slate, cursor: 'pointer', fontFamily: "'Inter', sans-serif",
          transition: 'all 0.2s ease'
        }}
      >
        {icon}
        {label && <span style={{ fontSize: 10, fontWeight: 600 }}>{label}</span>}
      </button>
    );
  }

  // Helper for rendering Menu list items
  function MenuItem({ icon, label, onClick, isDestructive }) {
    return (
      <button 
        onClick={onClick}
        style={{
          display: 'flex', alignItems: 'center', gap: 16, width: '100%',
          background: 'transparent', border: 'none', padding: '16px 0',
          color: isDestructive ? '#ef4444' : C.white, cursor: 'pointer',
          fontFamily: "'Inter', sans-serif", fontSize: 16, fontWeight: 500,
          borderBottom: `1px solid ${C.line}`
        }}
      >
        {icon}
        {label}
      </button>
    );
  }

  return (
    <>
      {/* 1. THE FLOATING PILL */}
      <div style={{
        position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', alignItems: 'center', gap: 4, padding: '8px',
        background: C.glass, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        border: `1px solid ${C.line}`, borderRadius: 100, zIndex: 9990,
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
      }}>
        {/* Dynamic routing based on role */}
        <PillButton 
          icon={IconHome} 
          onClick={function() { 
            if (user.role === 'admin') handleNavigate('admin-dashboard');
            else if (user.role === 'creator') handleNavigate('creator-dashboard');
            else handleNavigate('user-dashboard');
          }} 
        />
        <PillButton icon={IconTasks} onClick={function() { handleNavigate('tasks'); }} />
        <PillButton icon={IconWallet} onClick={function() { handleNavigate('wallet'); }} />
        
        {/* Divider */}
        <div style={{ width: 1, height: 24, background: C.line, margin: '0 4px' }} />
        
        <PillButton icon={IconProfile} onClick={openMenu} isProfile={true} />
      </div>

      {/* 2. THE CLICK-OUT OVERLAY */}
      <div 
        onClick={closeMenu}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          zIndex: 9995, opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease'
        }}
      />

      {/* 3. THE BOTTOM SHEET (QUARTER SCREEN MENU) */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999,
        background: C.ink, borderTop: `1px solid ${C.line}`,
        borderTopLeftRadius: 32, borderTopRightRadius: 32,
        padding: '32px 5% 48px', margin: '0 auto', maxWidth: 800,
        transform: menuOpen ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: '0 -20px 40px rgba(0,0,0,0.5)', fontFamily: "'Inter', sans-serif"
      }}>
        
        {/* Drag Handle (Visual only) */}
        <div style={{ width: 48, height: 4, background: C.line, borderRadius: 100, margin: '0 auto 32px' }} />

        {/* User Profile Summary */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: C.lime, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.ink, fontSize: 18, fontWeight: 800 }}>
            {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.white, marginBottom: 4, textTransform: 'capitalize' }}>
              {user.role} Profile
            </div>
            <div style={{ fontSize: 14, color: C.slate }}>{user.email}</div>
          </div>
        </div>

        {/* Full Menu Grid/List */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          
          <MenuItem 
            icon={IconHome} 
            label="Dashboard" 
            onClick={function() { 
              if (user.role === 'admin') handleNavigate('admin-dashboard');
              else if (user.role === 'creator') handleNavigate('creator-dashboard');
              else handleNavigate('user-dashboard');
            }} 
          />
          <MenuItem icon={IconTasks} label="Task Network" onClick={function() { handleNavigate('tasks'); }} />
          <MenuItem icon={IconWallet} label="Wallet & Withdrawals" onClick={function() { handleNavigate('wallet'); }} />
          
          {/* Only show Create Campaign if they are a Creator or Admin */}
          {(user.role === 'creator' || user.role === 'admin') && (
            <MenuItem icon={<span style={{fontSize: 18}}>🚀</span>} label="Launch Campaign" onClick={function() { handleNavigate('create-task'); }} />
          )}
          
          {/* Theme Toggle Feature */}
          <button 
            onClick={toggleTheme}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
              background: 'transparent', border: 'none', padding: '16px 0',
              color: C.white, cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontSize: 16, fontWeight: 500,
              borderBottom: `1px solid ${C.line}`
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {theme === 'dark' ? IconMoon : IconSun}
              Theme
            </div>
            <span style={{ fontSize: 12, color: C.slate, background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: 6, textTransform: 'capitalize' }}>
              {theme}
            </span>
          </button>

          <MenuItem icon={IconLogout} label="Secure Logout" onClick={handleLogout} isDestructive={true} />
          
        </div>
      </div>
    </>
  );
}
