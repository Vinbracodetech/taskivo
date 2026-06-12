import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// ── SHARED PREMIUM FINTECH ADMIN STYLES ──
const S = {
  pageWrapper: {
    minHeight: '100vh',
    backgroundColor: '#0a0a0c',
    backgroundImage: `
      radial-gradient(circle at 15% 50px, rgba(212, 175, 55, 0.08) 0%, transparent 40%),
      radial-gradient(circle at 85% 30%, rgba(168, 255, 62, 0.04) 0%, transparent 50%),
      url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm20 20h20v20H20V20zM0 20h20v20H0V20z' fill='none' stroke='%23ffffff' stroke-width='1' stroke-opacity='0.02'/%3E%3C/svg%3E")
    `,
    backgroundSize: '100% 100%, 100% 100%, 40px 40px',
    backgroundAttachment: 'fixed',
  },
  page: { padding: '40px 5%', maxWidth: 1200, margin: '0 auto', fontFamily: "'DM Sans', sans-serif", position: 'relative', minHeight: '80vh' },
  header: { fontFamily: "'Inter', sans-serif", fontSize: 32, color: '#ffffff', marginBottom: 8, fontWeight: 800, letterSpacing: '-0.5px' },
  subHeader: { color: 'rgba(255, 255, 255, 0.6)', fontSize: 15, fontWeight: 400, margin: '0 0 40px 0' },
  
  glassCard: { 
    background: 'rgba(255, 255, 255, 0.02)', 
    border: '1px solid rgba(255, 255, 255, 0.06)', 
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 20, 
    padding: 32, 
    boxShadow: '0 16px 40px rgba(0,0,0,0.2)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)'
  },
  
  tableContainer: { 
    background: 'rgba(255, 255, 255, 0.02)', 
    border: '1px solid rgba(255, 255, 255, 0.06)', 
    borderRadius: 20, 
    overflow: 'hidden', 
    marginTop: 24, 
    boxShadow: '0 16px 40px rgba(0,0,0,0.2)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)'
  },
  
  tableHeader: { display: 'grid', gap: 16, padding: '16px 24px', background: 'rgba(0, 0, 0, 0.4)', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#D4AF37', fontFamily: "'Inter', sans-serif" },
  tableRow: { display: 'grid', gap: 16, padding: '20px 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', alignItems: 'center' },
  
  btnAction: { background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#ffffff', borderRadius: 8, padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'Inter', sans-serif" },
  btnDanger: { background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', borderRadius: 8, padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'Inter', sans-serif" },
  btnSuccess: { background: 'rgba(168, 255, 62, 0.1)', border: '1px solid rgba(168, 255, 62, 0.3)', color: '#a8ff3e', borderRadius: 8, padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'Inter', sans-serif" },
  
  input: { background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 8, color: '#ffffff', padding: '12px 16px', fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif", transition: 'border-color 0.2s' },
  select: { background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 8, color: '#ffffff', padding: '12px 16px', fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif", appearance: 'none', transition: 'border-color 0.2s' }
};

// ── 1. ADMIN OVERVIEW MODULE ──
export function AdminOverview({ navigate, showToast }) {
  const [stats, setStats] = useState({ users: 0, tasks: 0, pendingWithdrawals: 0, completions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSystemStats() {
      try {
        const [usersReq, tasksReq, withReq, compReq] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('tasks').select('*', { count: 'exact', head: true }),
          supabase.from('withdrawals').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
          supabase.from('completions').select('*', { count: 'exact', head: true })
        ]);
        setStats({
          users: usersReq.count || 0,
          tasks: tasksReq.count || 0,
          pendingWithdrawals: withReq.count || 0,
          completions: compReq.count || 0
        });
      } catch (err) {
        if (showToast) showToast('Failed to load system telemetry', 'error');
      } finally {
        setLoading(false);
      }
    }
    fetchSystemStats();
  }, [showToast]);

  if (loading) return (
    <div style={{ ...S.pageWrapper, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'rgba(255,255,255,0.6)', fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>Connecting to Mainframe...</div>
    </div>
  );

  return (
    <div style={S.pageWrapper}>
      <div style={S.page}>
        <h1 style={S.header}>System Overview</h1>
        <p style={S.subHeader}>Global platform telemetry and quick routing.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, marginBottom: 48 }}>
          <div style={S.glassCard}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16 }}>Total Registered Users</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: '#ffffff', fontFamily: "'Inter', sans-serif" }}>{stats.users.toLocaleString()}</div>
          </div>
          <div style={S.glassCard}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16 }}>Total Campaigns</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: '#ffffff', fontFamily: "'Inter', sans-serif" }}>{stats.tasks.toLocaleString()}</div>
          </div>
          <div style={S.glassCard}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16 }}>Pending Payouts</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: stats.pendingWithdrawals > 0 ? '#ef4444' : '#ffffff', fontFamily: "'Inter', sans-serif" }}>{stats.pendingWithdrawals.toLocaleString()}</div>
          </div>
          <div style={S.glassCard}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16 }}>Verified Engagements</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: '#ffffff', fontFamily: "'Inter', sans-serif" }}>{stats.completions.toLocaleString()}</div>
          </div>
        </div>

        <h2 style={{ ...S.header, fontSize: 20, marginBottom: 24 }}>Control Modules</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          <div onClick={() => navigate('admin-users')} style={{ ...S.glassCard, cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}>
            <h3 style={{ color: '#ffffff', margin: '0 0 8px 0', fontSize: 18, fontFamily: "'Inter', sans-serif" }}>Identity &amp; Access</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 13, margin: 0 }}>Modify roles, suspend accounts, and edit balances.</p>
          </div>
          <div onClick={() => navigate('admin-tasks')} style={{ ...S.glassCard, cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}>
            <h3 style={{ color: '#ffffff', margin: '0 0 8px 0', fontSize: 18, fontFamily: "'Inter', sans-serif" }}>Campaign Moderation</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 13, margin: 0 }}>Approve, pause, or terminate creator campaigns.</p>
          </div>
          <div onClick={() => navigate('admin-withdrawals')} style={{ ...S.glassCard, cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}>
            <h3 style={{ color: '#ffffff', margin: '0 0 8px 0', fontSize: 18, fontFamily: "'Inter', sans-serif" }}>Financial Treasury</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 13, margin: 0 }}>Process and audit earner withdrawal requests.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 2. ADMIN USERS MODULE ──
export function AdminUsers({ showToast, currentUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ role: '', points: 0 });

  useEffect(() => { fetchUsers(); }, []);

  async function fetchUsers() {
    try {
      setLoading(true);
      const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      setUsers(data || []);
    } finally {
      setLoading(false);
    }
  }

  function startEdit(user) {
    setEditingId(user.id);
    setEditForm({ role: user.role, points: user.points });
  }

  async function saveEdit(id) {
    try {
      const { error } = await supabase.from('profiles').update({ role: editForm.role, points: parseInt(editForm.points, 10) }).eq('id', id);
      if (error) throw error;
      setUsers(users.map(u => u.id === id ? { ...u, ...editForm } : u));
      setEditingId(null);
      if (showToast) showToast('Identity record updated.', 'success');
    } catch (err) {
      if (showToast) showToast('Failed to update record.', 'error');
    }
  }

  async function wipeUser(id) {
    if (id === currentUser?.id) {
      if (showToast) showToast('Security protocol prevents self-deletion.', 'error');
      return;
    }
    const confirmWipe = window.confirm('CRITICAL: This will permanently purge this profile from the database. Proceed?');
    if (!confirmWipe) return;

    try {
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      if (error) throw error;
      setUsers(users.filter(u => u.id !== id));
      if (showToast) showToast('Identity record purged.', 'success');
    } catch (err) {
      if (showToast) showToast('Failed to purge record.', 'error');
    }
  }

  if (loading) return (
    <div style={{ ...S.pageWrapper, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'rgba(255,255,255,0.6)', fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>Loading identities...</div>
    </div>
  );

  return (
    <div style={S.pageWrapper}>
      <div style={S.page}>
        <h1 style={S.header}>Identity Management</h1>
        <p style={S.subHeader}>View, modify, and terminate user profiles.</p>
        
        <div style={S.tableContainer}>
          <div style={{ ...S.tableHeader, gridTemplateColumns: '1.5fr 1fr 1fr 1.5fr' }} className="hide-on-mobile">
            <span>Identity</span>
            <span>Role Authorization</span>
            <span>Liquidity (PTS)</span>
            <span style={{ textAlign: 'right' }}>Administrative Actions</span>
          </div>
          
          {users.map(u => (
            <div key={u.id} style={{ ...S.tableRow, gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
              <div>
                <div style={{ fontSize: 14, color: '#ffffff', fontWeight: 600, marginBottom: 4, fontFamily: "'Inter', sans-serif" }}>{u.full_name || 'No Name Provided'}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{u.email}</div>
              </div>
              
              {editingId === u.id ? (
                <>
                  <select style={S.select} value={editForm.role} onChange={e => setEditForm({...editForm, role: e.target.value})}>
                    <option value="earner" style={{ color: '#000' }}>Earner</option>
                    <option value="creator" style={{ color: '#000' }}>Creator</option>
                    <option value="admin" style={{ color: '#000' }}>Admin</option>
                    <option value="suspended" style={{ color: '#000' }}>Suspended</option>
                  </select>
                  <input style={S.input} type="number" value={editForm.points} onChange={e => setEditForm({...editForm, points: e.target.value})} />
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <button onClick={() => saveEdit(u.id)} style={{ ...S.btnSuccess, padding: '12px 16px' }}>Save</button>
                    <button onClick={() => setEditingId(null)} style={{ ...S.btnAction, padding: '12px 16px' }}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span style={{ fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 100, textTransform: 'uppercase', background: u.role === 'admin' ? 'rgba(212,175,55,0.1)' : u.role === 'suspended' ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.05)', color: u.role === 'admin' ? '#D4AF37' : u.role === 'suspended' ? '#ef4444' : '#ffffff', border: `1px solid ${u.role === 'admin' ? 'rgba(212,175,55,0.3)' : u.role === 'suspended' ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.1)'}` }}>
                      {u.role}
                    </span>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', fontFamily: "'Inter', sans-serif" }}>{u.points.toLocaleString()}</div>
                  <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                    <button onClick={() => startEdit(u)} style={S.btnAction}>Modify</button>
                    <button onClick={() => wipeUser(u.id)} style={S.btnDanger}>Purge</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── 3.1 ADMIN HOUSE DEPLOYER (GOD-MODE) ──
export function AdminHouseDeployer({ showToast, onDeploy }) {
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState('SEO Search');
  const [url, setUrl] = useState('');
  const [rewardPoints, setRewardPoints] = useState(50);
  const [keyword, setKeyword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deployedTask, setDeployedTask] = useState(null); // 🔥 Added to hold successful deployments

  async function handleDeploy(e) {
    e.preventDefault();
    if (!title || !url) return alert("Title and Target URL are mandatory payload details.");
    if (platform === 'SEO Search' && !keyword) return alert("Target Keyword is required for SEO Search.");
    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const newHouseTask = {
        title,
        platform: platform === 'SEO Search' ? 'blog' : platform,
        url,
        reward_points: parseInt(rewardPoints),
        search_keyword: platform === 'SEO Search' ? keyword : null,
        secret_code: platform === 'SEO Search' ? null : 'HOUSE_BYPASS', // 🔥 Null strictly enforced for SEO burnable tokens
        status: 'active',
        target_views: 999999,
        is_house_campaign: true,
        creator_id: user?.id || 'admin',
        watch_duration: platform === 'SEO Search' ? 120 : 30 // Force 120s for SEO
      };

      // Select single so we can get the generated task ID for the snippet
      const { data, error } = await supabase.from('tasks').insert(newHouseTask).select().single();
      if (error) throw error;

      if (showToast) showToast("House Campaign broadcasted to networks instantly!", "success");
      setTitle(''); setUrl(''); setKeyword('');
      if (onDeploy) onDeploy();

      // Show the snippet screen if it's an SEO task
        if (platform === 'SEO Search') {
          setDeployedTask(data);
        }

      } catch (err) {
        console.error(err);
        alert("DEPLOYMENT FAILED: " + err.message); // 🔥 ADDED THIS LINE
        if (showToast) showToast("Error broadcasting house campaign.", "error");
      } finally {
        setSubmitting(false);
      }
  }

  // 🔥 SUCCESS & INTEGRATION SCREEN 🔥
  if (deployedTask) {
    return (
      <div style={{ ...S.glassCard, marginBottom: 48 }}>
        <h3 style={{ ...S.header, fontSize: 22, margin: '0 0 8px 0', color: '#D4AF37' }}>House Campaign Deployed</h3>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, margin: '0 0 24px 0' }}>
          Your internal SEO campaign is live. Paste this exact snippet into your Taskivo Blog post via the Content Engine.
        </p>

        <div style={{ position: 'relative' }}>
          <pre style={{ background: '#000000', padding: 24, borderRadius: 12, overflowX: 'auto', fontSize: 12, color: '#10b981', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'monospace', lineHeight: 1.5, textAlign: 'left' }}>
{`<div id="taskivo-node" style="padding: 20px; text-align: center; border: 1px dashed #ccc; border-radius: 8px; margin-top: 30px;">
  <span id="t-status" style="font-family: sans-serif; font-size: 14px; color: #666;">Taskivo Secure Node active. Establishing connection...</span>
  <div id="t-timer" style="font-size: 24px; font-weight: bold; color: #ef4444; margin-top: 10px;"></div>
</div>

<script>
(function() {
  var taskId = '${deployedTask.id}';
  var statusEl = document.getElementById('t-status');
  var timerEl = document.getElementById('t-timer');
  
  // 1. Start Secure Session
  fetch('https://eartsscxtqxaelopmjmq.supabase.co/functions/v1/taskivo-verify/init', {
    method: 'POST', body: JSON.stringify({ task_id: taskId })
  }).then(res => res.json()).then(data => {
    if(!data.session_id) return;
    
    statusEl.innerText = "Tracking Organic Dwell Time. Do not switch tabs.";
    var timeLeft = 120;
    
    // 2. Visual Countdown
    var countdown = setInterval(function() {
      if (document.hidden) return; // Pauses visual timer if they leave tab
      timeLeft--;
      timerEl.innerText = timeLeft + "s";
      
      // 3. Request Burnable Token
      if (timeLeft <= 0) {
        clearInterval(countdown);
        statusEl.innerText = "Verifying telemetry with server...";
        timerEl.innerText = "";
        
        fetch('https://eartsscxtqxaelopmjmq.supabase.co/functions/v1/taskivo-verify/claim', {
          method: 'POST', body: JSON.stringify({ session_id: data.session_id })
        }).then(res => res.json()).then(final => {
          if (final.secret_code) {
             document.getElementById('taskivo-node').innerHTML = '<strong style="color: #10b981; font-family: sans-serif;">Verification Complete! Your Single-Use Code is:<br><br><span style="background: #eee; padding: 8px 12px; border-radius: 4px; letter-spacing: 1px; color: #000; word-break: break-all;">' + final.secret_code + '</span></strong>';
          }
        });
      }
    }, 1000);
  });
})();
</script>`}
          </pre>
        </div>
        
        <button onClick={() => setDeployedTask(null)} style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#ffffff', padding: '12px 24px', borderRadius: 8, fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: "'Inter', sans-serif", textTransform: 'uppercase', marginTop: 24 }}>
          Initialize Another Campaign
        </button>
      </div>
    );
  }

  // Normal Form Render
  return (
    <div style={{ ...S.glassCard, marginBottom: 48 }}>
      <h3 style={{ ...S.header, fontSize: 22, margin: '0 0 8px 0', color: '#ffffff' }}>God-Mode Deployer</h3>
      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, margin: '0 0 24px 0' }}>Launch unrestricted official campaigns onto the live worker index bypassing standard payment barriers.</p>

      <form onSubmit={handleDeploy} style={{ display: 'grid', gap: 16 }}>
        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#D4AF37', textTransform: 'uppercase', marginBottom: 6 }}>Task Title</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Join our official Telegram Community" style={S.input} required />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#D4AF37', textTransform: 'uppercase', marginBottom: 6 }}>Platform Ecosystem</label>
            <select value={platform} onChange={e => setPlatform(e.target.value)} style={S.select}>
              <option value="SEO Search" style={{ color: '#000' }}>Google SEO</option>
              <option value="youtube" style={{ color: '#000' }}>YouTube Ecosystem</option>
              <option value="twitter" style={{ color: '#000' }}>Twitter / X</option>
              <option value="Custom Direct" style={{ color: '#000' }}>Direct Click Link</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#D4AF37', textTransform: 'uppercase', marginBottom: 6 }}>Custom Reward (PTS)</label>
            <input type="number" value={rewardPoints} onChange={e => setRewardPoints(e.target.value)} style={S.input} required />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#D4AF37', textTransform: 'uppercase', marginBottom: 6 }}>Target Destination URL</label>
          <input type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." style={S.input} required />
        </div>

        {platform === 'SEO Search' && (
          <div style={{ background: 'rgba(212, 175, 55, 0.05)', padding: 16, borderRadius: 12, border: '1px solid rgba(212, 175, 55, 0.2)' }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#D4AF37', textTransform: 'uppercase', marginBottom: 6 }}>Target Keyword</label>
            <input type="text" value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="Taskivo platform" style={S.input} required />
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', margin: '12px 0 0 0' }}>The system will automatically generate a dynamic Burnable Token snippet for you upon deployment.</p>
          </div>
        )}

        <button type="submit" disabled={submitting} style={{ background: '#D4AF37', border: 'none', color: '#000', padding: '16px', borderRadius: 8, fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: "'Inter', sans-serif", textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 8, transition: 'all 0.2s', boxShadow: '0 8px 24px rgba(212, 175, 55, 0.2)' }}>
          {submitting ? 'DEPLOYING ENGINE...' : 'BROADCAST HOUSE CAMPAIGN'}
        </button>
      </form>
    </div>
  );
}

// ── 3. ADMIN TASKS MODULE ──
export function AdminTasks({ showToast }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchTasks(); }, []);

  async function fetchTasks() {
    try {
      setLoading(true);
      const { data } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
      setTasks(data || []);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id, newStatus) {
    try {
      const { error } = await supabase.from('tasks').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
      if (showToast) showToast(`Campaign marked as ${newStatus}.`, 'success');
    } catch (err) {
      if (showToast) showToast('Update failed.', 'error');
    }
  }

  async function hardDeleteTask(id) {
    if (!window.confirm('Delete this campaign completely?')) return;
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) throw error;
      setTasks(tasks.filter(t => t.id !== id));
      if (showToast) showToast('Campaign permanently deleted.', 'success');
    } catch (err) {
      if (showToast) showToast('Deletion failed.', 'error');
    }
  }

  if (loading) return (
    <div style={{ ...S.pageWrapper, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'rgba(255,255,255,0.6)', fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>Loading campaigns...</div>
    </div>
  );

  return (
    <div style={S.pageWrapper}>
      <div style={S.page}>
        
        <AdminHouseDeployer showToast={showToast} onDeploy={fetchTasks} />

        <h1 style={S.header}>Campaign Moderation</h1>
        <p style={S.subHeader}>Audit, suspend, or terminate active creator campaigns.</p>

        <div style={S.tableContainer}>
          <div style={{ ...S.tableHeader, gridTemplateColumns: '2fr 1fr 1fr 1.5fr' }} className="hide-on-mobile">
            <span>Campaign details</span>
            <span>Platform &amp; Target</span>
            <span>Status</span>
            <span style={{ textAlign: 'right' }}>Overrides</span>
          </div>
          
          {tasks.map(t => (
            <div key={t.id} style={{ ...S.tableRow, gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
              <div>
                <div style={{ fontSize: 14, color: '#ffffff', fontWeight: 600, marginBottom: 4, fontFamily: "'Inter', sans-serif" }}>
                  {t.is_house_campaign && <span style={{ color: '#D4AF37', marginRight: 6 }}>[OFFICIAL]</span>}
                  {t.title}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>Creator: {t.creator_id?.substring(0,8) || 'admin'}...</div>
              </div>
              
              <div>
                <div style={{ fontSize: 13, color: '#ffffff', fontWeight: 600, textTransform: 'capitalize' }}>{t.platform}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{t.target_views === 999999 ? 'Unlimited' : `${t.target_views} views limit`}</div>
              </div>
              
              <div>
                <span style={{ fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 100, textTransform: 'uppercase', background: t.status === 'active' ? 'rgba(168,255,62,0.1)' : 'rgba(255,255,255,0.05)', color: t.status === 'active' ? '#a8ff3e' : 'rgba(255,255,255,0.6)', border: `1px solid ${t.status === 'active' ? 'rgba(168,255,62,0.3)' : 'rgba(255,255,255,0.1)'}` }}>
                  {t.status}
                </span>
              </div>
              
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                {t.status !== 'active' && <button onClick={() => updateStatus(t.id, 'active')} style={S.btnSuccess}>Activate</button>}
                {t.status !== 'paused' && <button onClick={() => updateStatus(t.id, 'paused')} style={S.btnAction}>Pause</button>}
                <button onClick={() => hardDeleteTask(t.id)} style={S.btnDanger}>Drop</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── 4. ADMIN WITHDRAWALS MODULE ──
export function AdminWithdrawals({ showToast }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 FIAT CONVERSION RATE (2000 PTS = $1.50) 🔥
  const conversionRate = 0.00075;

  useEffect(() => { fetchWithdrawals(); }, []);

  async function fetchWithdrawals() {
    try {
      setLoading(true);
      const { data } = await supabase.from('withdrawals').select(`
        *,
        profiles!inner(email)
      `).order('created_at', { ascending: false });
      setRequests(data || []);
    } finally {
      setLoading(false);
    }
  }

  // 🔥 COMPLETELY REWRITTEN BULLETPROOF PAYOUT ENGINE 🔥
  async function processRequest(req, action) {
    if (!window.confirm(`Are you sure you want to ${action} this payout for ${req.amount} PTS?`)) return;

    try {
      const newStatus = action === 'approve' ? 'approved' : 'rejected';
      
      // 1. If rejecting, we MUST safely refund the points BEFORE touching the withdrawal ledger
      if (action === 'reject') {
        const { data: userProfile, error: fetchError } = await supabase
          .from('profiles')
          .select('points')
          .eq('id', req.user_id)
          .single();
          
        if (fetchError) throw new Error("Cannot read earner balance: " + fetchError.message);
        if (!userProfile) throw new Error("Earner profile not found in database.");

        const refundAmount = parseInt(req.amount, 10);
        const currentBalance = parseInt(userProfile.points, 10) || 0;
        
        // 2. Perform Refund AND force Supabase to return the receipt using .select()
        const { data: updatedProfile, error: refundError } = await supabase
          .from('profiles')
          .update({ points: currentBalance + refundAmount })
          .eq('id', req.user_id)
          .select(); // <--- THIS PREVENTS SILENT FAILURES
          
        if (refundError) throw new Error("Database blocked the refund: " + refundError.message);
        
        // 🔥 If Supabase silently blocked it (0 rows updated), this catches it!
        if (!updatedProfile || updatedProfile.length === 0) {
           throw new Error("RLS Blocked the refund! The database refused to update the earner's profile.");
        }
      }

      // 3. Only AFTER a safe refund (or if approving) do we lock in the ledger status
      const { error: statusError } = await supabase
        .from('withdrawals')
        .update({ status: newStatus })
        .eq('id', req.id);
        
      if (statusError) throw new Error("Failed to update ledger status: " + statusError.message);

      // Update UI state
      setRequests(requests.map(r => r.id === req.id ? { ...r, status: newStatus } : r));
      if (showToast) showToast(action === 'reject' ? 'Payout denied & points refunded.' : 'Payout authorized.', 'success');
      
    } catch (err) {
      console.error("Payout Action Error:", err);
      // 🔥 MASSIVE POPUP EXPOSING EXACT DATABASE ERROR FOR MOBILE DEBUGGING 🔥
      alert("ACTION FAILED! Reason: " + err.message);
      if (showToast) showToast(`Failed to process payout.`, 'error');
    }
  }

  // 🔥 ONE-TAP MOBILE COPY FUNCTION 🔥
  async function copyBankDetails(req) {
    const fiatAmount = (req.amount * conversionRate).toFixed(2);
    const clipboardText = `Name: ${req.account_name}\nBank: ${req.bank_name}\nAccount: ${req.account_number}\nAmount to Pay: $${fiatAmount}`;
    
    try {
      await navigator.clipboard.writeText(clipboardText);
      if (showToast) showToast('Bank details copied to clipboard!', 'info');
    } catch (err) {
      if (showToast) showToast('Failed to copy details.', 'error');
    }
  }

  if (loading) return (
    <div style={{ ...S.pageWrapper, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'rgba(255,255,255,0.6)', fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>Loading financial ledger...</div>
    </div>
  );

  return (
    <div style={S.pageWrapper}>
      <div style={S.page}>
        <h1 style={S.header}>Financial Treasury</h1>
        <p style={S.subHeader}>Process earner liquidity requests.</p>

        <div style={S.tableContainer}>
          <div style={{ ...S.tableHeader, gridTemplateColumns: '1.5fr 1fr 1fr 1fr' }} className="hide-on-mobile">
            <span>Identity / Bank Info</span>
            <span>Account Num</span>
            <span>Amount Requested</span>
            <span style={{ textAlign: 'right' }}>Authorization</span>
          </div>

          {requests.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>No withdrawal requests found.</div>
          ) : (
            requests.map(req => {
              const fiatValue = (req.amount * conversionRate).toFixed(2);

              return (
                <div key={req.id} style={{ ...S.tableRow, gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
                  <div>
                    <div style={{ fontSize: 14, color: '#ffffff', fontWeight: 600, marginBottom: 4, fontFamily: "'Inter', sans-serif" }}>{req.account_name}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 2 }}>{req.bank_name}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>User: {req.profiles?.email}</div>
                  </div>
                  
                  <div style={{ fontSize: 14, color: '#ffffff', fontFamily: 'monospace', letterSpacing: '1px' }}>
                    {req.account_number}
                  </div>

                  <div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#D4AF37', fontFamily: "'Inter', sans-serif" }}>
                      {req.amount.toLocaleString()} <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>PTS</span>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#a8ff3e', marginTop: 4, fontFamily: "'Inter', sans-serif" }}>
                      ≈ ${fiatValue}
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{new Date(req.created_at).toLocaleDateString()}</div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    {req.status === 'pending' ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                        <button onClick={() => copyBankDetails(req)} style={{...S.btnAction, width: '100%', marginBottom: 8}}>📋 Copy Details</button>
                        
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', flexWrap: 'wrap', width: '100%' }}>
                          <button onClick={() => processRequest(req, 'approve')} style={{...S.btnSuccess, flex: 1}}>Authorize</button>
                          <button onClick={() => processRequest(req, 'reject')} style={{...S.btnDanger, flex: 1}}>Deny</button>
                        </div>
                      </div>
                    ) : (
                      <span style={{ fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 100, textTransform: 'uppercase', background: req.status === 'approved' ? 'rgba(168,255,62,0.1)' : 'rgba(239,68,68,0.1)', color: req.status === 'approved' ? '#a8ff3e' : '#ef4444', border: `1px solid ${req.status === 'approved' ? 'rgba(168,255,62,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
                        {req.status}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

// ── 5. ADMIN BLOG (CONTENT ENGINE) MODULE ──
export function AdminBlog({ showToast }) {
  const [form, setForm] = useState({ title: '', slug: '', meta_desc: '', content: '', category: 'earner', status: 'draft' });
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { fetchPosts(); }, []);

  async function fetchPosts() {
    try {
      const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
      setPosts(data || []);
    } catch (err) {
      if (showToast) showToast('Failed to load article ledger.', 'error');
    }
  }

  function handleTitleChange(e) {
    const newTitle = e.target.value;
    if (!editingId) {
      const autoSlug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      setForm({ ...form, title: newTitle, slug: autoSlug });
    } else {
      setForm({ ...form, title: newTitle });
    }
  }

  function wrapText(tag) {
    setForm({ ...form, content: form.content + `\n<${tag}></${tag}>\n` });
  }

  async function savePost() {
    if (!form.title || !form.content) {
      if (showToast) showToast('Title and Content are required.', 'error');
      return;
    }
    
    setLoading(true);
    try {
      if (editingId) {
        const { error } = await supabase.from('posts').update(form).eq('id', editingId);
        if (error) throw error;
        if (showToast) showToast('Article successfully updated.', 'success');
      } else {
        const { error } = await supabase.from('posts').insert([form]);
        if (error) throw error;
        if (showToast) showToast(`Article saved as ${form.status}.`, 'success');
      }
      resetForm();
      fetchPosts(); 
    } catch (err) {
      if (showToast) showToast('Failed to save article. Check slug uniqueness.', 'error');
    } finally {
      setLoading(false);
    }
  }

  function startEdit(post) {
    setEditingId(post.id);
    setForm({ title: post.title, slug: post.slug, meta_desc: post.meta_desc, content: post.content, category: post.category, status: post.status });
    window.scrollTo(0, 0); 
  }

  function resetForm() {
    setEditingId(null);
    setForm({ title: '', slug: '', meta_desc: '', content: '', category: 'earner', status: 'draft' });
  }

  async function deletePost(id) {
    if (!window.confirm('CRITICAL: Permanently delete this article?')) return;
    try {
      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (error) throw error;
      if (showToast) showToast('Article permanently deleted.', 'success');
      fetchPosts();
    } catch (err) {
      if (showToast) showToast('Failed to delete article.', 'error');
    }
  }

  return (
    <div style={S.pageWrapper}>
      <div style={S.page}>
        <h1 style={S.header}>Content Engine</h1>
        <p style={S.subHeader}>{editingId ? 'Modifying existing article.' : 'Deploy SEO-optimized articles.'}</p>

        <div style={S.glassCard}>
          <input style={{ ...S.input, marginBottom: 16 }} placeholder="Article Meta Title" value={form.title} onChange={handleTitleChange} />
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 16 }}>
            <input style={S.input} placeholder="url-slug" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} disabled={editingId} />
            <select style={S.select} value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
              <option value="earner" style={{ color: '#000' }}>Target: Earners</option>
              <option value="creator" style={{ color: '#000' }}>Target: B2B Creators</option>
            </select>
          </div>

          <input style={{ ...S.input, marginBottom: 16 }} placeholder="Meta Description (max 160 chars)" value={form.meta_desc} onChange={e => setForm({...form, meta_desc: e.target.value})} maxLength={160} />
          
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, overflowX: 'auto' }}>
            <button onClick={() => wrapText('h2')} style={S.btnAction}>+ Header</button>
            <button onClick={() => wrapText('p')} style={S.btnAction}>+ Paragraph</button>
            <button onClick={() => wrapText('strong')} style={S.btnAction}>+ Bold</button>
            <button onClick={() => wrapText('ul')} style={S.btnAction}>+ List</button>
          </div>

          <textarea 
            style={{ ...S.input, minHeight: 300, fontFamily: 'monospace', resize: 'vertical' }} 
            placeholder="Write your article here..." 
            value={form.content} 
            onChange={e => setForm({...form, content: e.target.value})} 
          />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', gap: 16 }}>
              <select style={{ ...S.select, width: 'auto' }} value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                <option value="draft" style={{ color: '#000' }}>Save as Draft</option>
                <option value="published" style={{ color: '#000' }}>Publish Live</option>
              </select>
              {editingId && <button onClick={resetForm} style={S.btnAction}>Cancel Edit</button>}
            </div>
            
            <button onClick={savePost} disabled={loading} style={{ background: '#D4AF37', border: 'none', color: '#000', padding: '12px 24px', borderRadius: 8, fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: "'Inter', sans-serif", textTransform: 'uppercase', transition: 'opacity 0.2s' }}>
              {loading ? 'SAVING...' : editingId ? 'UPDATE ARTICLE' : 'DEPLOY ARTICLE'}
            </button>
          </div>
        </div>

        <h2 style={{ ...S.header, fontSize: 20, marginTop: 48, marginBottom: 16 }}>Article Ledger</h2>
        <div style={S.tableContainer}>
          <div style={{ ...S.tableHeader, gridTemplateColumns: '2fr 1fr 1fr 1fr' }} className="hide-on-mobile">
            <span>Title</span>
            <span>Category</span>
            <span>Status</span>
            <span style={{ textAlign: 'right' }}>Actions</span>
          </div>

          {posts.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>No articles found.</div>
          ) : (
            posts.map(post => (
              <div key={post.id} style={{ ...S.tableRow, gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
                <div>
                  <div style={{ fontSize: 14, color: '#ffffff', fontWeight: 600, marginBottom: 4, fontFamily: "'Inter', sans-serif" }}>{post.title}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>/{post.slug}</div>
                </div>
                
                <div>
                  <span style={{ fontSize: 10, fontWeight: 800, padding: '4px 8px', borderRadius: 4, textTransform: 'uppercase', background: post.category === 'creator' ? 'rgba(212,175,55,0.1)' : 'rgba(168,255,62,0.1)', color: post.category === 'creator' ? '#D4AF37' : '#a8ff3e' }}>
                    {post.category}
                  </span>
                </div>
                
                <div>
                  <span style={{ fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 100, textTransform: 'uppercase', background: post.status === 'published' ? 'rgba(168,255,62,0.1)' : 'rgba(255,255,255,0.05)', color: post.status === 'published' ? '#a8ff3e' : 'rgba(255,255,255,0.6)', border: `1px solid ${post.status === 'published' ? 'rgba(168,255,62,0.3)' : 'rgba(255,255,255,0.1)'}` }}>
                    {post.status}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                  <button onClick={() => startEdit(post)} style={S.btnAction}>Edit</button>
                  <button onClick={() => deletePost(post.id)} style={S.btnDanger}>Drop</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
