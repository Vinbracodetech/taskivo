import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// ── SHARED ENTERPRISE ADMIN STYLES ──
const S = {
  page: { padding: '40px 5%', maxWidth: 1200, margin: '0 auto', fontFamily: "'DM Sans', sans-serif", position: 'relative', minHeight: '80vh' },
  header: { fontFamily: "'Inter', sans-serif", fontSize: 32, color: '#fff', marginBottom: 8, fontWeight: 800, letterSpacing: '-0.5px' },
  subHeader: { color: 'rgba(255,255,255,0.5)', fontSize: 15, fontWeight: 400, margin: '0 0 40px 0' },
  glassCard: { background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, backdropFilter: 'blur(20px)', padding: 32 },
  tableContainer: { background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 20, overflow: 'hidden', marginTop: 24 },
  tableHeader: { display: 'grid', gap: 16, padding: '16px 24px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'rgba(255,255,255,0.4)', fontFamily: "'Inter', sans-serif" },
  tableRow: { display: 'grid', gap: 16, padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.03)', alignItems: 'center' },
  btnAction: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 8, padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'Inter', sans-serif" },
  btnDanger: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', borderRadius: 8, padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'Inter', sans-serif" },
  btnSuccess: { background: 'rgba(168,255,62,0.1)', border: '1px solid rgba(168,255,62,0.2)', color: '#A8FF3E', borderRadius: 8, padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'Inter', sans-serif" },
  input: { background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', padding: '8px 12px', fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box' },
  select: { background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', padding: '8px 12px', fontSize: 13, outline: 'none' }
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

  if (loading) return <div style={{ padding: 80, textAlign: 'center', color: '#fff' }}>Connecting to Mainframe...</div>;

  return (
    <div style={S.page}>
      <h1 style={S.header}>System Overview</h1>
      <p style={S.subHeader}>Global platform telemetry and quick routing.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, marginBottom: 48 }}>
        <div style={S.glassCard}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16 }}>Total Registered Users</div>
          <div style={{ fontSize: 40, fontWeight: 800, color: '#fff', fontFamily: "'Inter', sans-serif" }}>{stats.users.toLocaleString()}</div>
        </div>
        <div style={S.glassCard}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16 }}>Total Campaigns</div>
          <div style={{ fontSize: 40, fontWeight: 800, color: '#fff', fontFamily: "'Inter', sans-serif" }}>{stats.tasks.toLocaleString()}</div>
        </div>
        <div style={S.glassCard}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16 }}>Pending Payouts</div>
          <div style={{ fontSize: 40, fontWeight: 800, color: stats.pendingWithdrawals > 0 ? '#ef4444' : '#fff', fontFamily: "'Inter', sans-serif" }}>{stats.pendingWithdrawals.toLocaleString()}</div>
        </div>
        <div style={S.glassCard}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16 }}>Verified Engagements</div>
          <div style={{ fontSize: 40, fontWeight: 800, color: '#A8FF3E', fontFamily: "'Inter', sans-serif" }}>{stats.completions.toLocaleString()}</div>
        </div>
      </div>

      <h2 style={{ ...S.header, fontSize: 20, marginBottom: 24 }}>Control Modules</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
        <div onClick={() => navigate('admin-users')} style={{ ...S.glassCard, cursor: 'pointer', transition: 'background 0.2s' }}>
          <h3 style={{ color: '#fff', margin: '0 0 8px 0', fontSize: 18 }}>Identity & Access Management</h3>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, margin: 0 }}>Modify roles, suspend accounts, and edit balances.</p>
        </div>
        <div onClick={() => navigate('admin-tasks')} style={{ ...S.glassCard, cursor: 'pointer', transition: 'background 0.2s' }}>
          <h3 style={{ color: '#fff', margin: '0 0 8px 0', fontSize: 18 }}>Campaign Moderation</h3>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, margin: 0 }}>Approve, pause, or terminate creator campaigns.</p>
        </div>
        <div onClick={() => navigate('admin-withdrawals')} style={{ ...S.glassCard, cursor: 'pointer', transition: 'background 0.2s' }}>
          <h3 style={{ color: '#fff', margin: '0 0 8px 0', fontSize: 18 }}>Financial Treasury</h3>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, margin: 0 }}>Process and audit earner withdrawal requests.</p>
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

  if (loading) return <div style={{ padding: 80, textAlign: 'center', color: '#fff' }}>Loading identities...</div>;

  return (
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
              <div style={{ fontSize: 14, color: '#fff', fontWeight: 600, marginBottom: 4 }}>{u.full_name || 'No Name Provided'}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{u.email}</div>
            </div>
            
            {editingId === u.id ? (
              <>
                <select style={S.select} value={editForm.role} onChange={e => setEditForm({...editForm, role: e.target.value})}>
                  <option value="earner">Earner</option>
                  <option value="creator">Creator</option>
                  <option value="admin">Admin</option>
                  <option value="suspended">Suspended</option>
                </select>
                <input style={S.input} type="number" value={editForm.points} onChange={e => setEditForm({...editForm, points: e.target.value})} />
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <button onClick={() => saveEdit(u.id)} style={S.btnSuccess}>Save</button>
                  <button onClick={() => setEditingId(null)} style={S.btnAction}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 100, textTransform: 'uppercase', background: u.role === 'admin' ? 'rgba(212,175,55,0.1)' : u.role === 'suspended' ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.05)', color: u.role === 'admin' ? '#D4AF37' : u.role === 'suspended' ? '#ef4444' : '#fff' }}>
                    {u.role}
                  </span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#A8FF3E' }}>{u.points.toLocaleString()}</div>
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

  if (loading) return <div style={{ padding: 80, textAlign: 'center', color: '#fff' }}>Loading campaigns...</div>;

  return (
    <div style={S.page}>
      <h1 style={S.header}>Campaign Moderation</h1>
      <p style={S.subHeader}>Audit, suspend, or terminate active creator campaigns.</p>

      <div style={S.tableContainer}>
        <div style={{ ...S.tableHeader, gridTemplateColumns: '2fr 1fr 1fr 1.5fr' }} className="hide-on-mobile">
          <span>Campaign details</span>
          <span>Platform & Target</span>
          <span>Status</span>
          <span style={{ textAlign: 'right' }}>Overrides</span>
        </div>
        
        {tasks.map(t => (
          <div key={t.id} style={{ ...S.tableRow, gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
            <div>
              <div style={{ fontSize: 14, color: '#fff', fontWeight: 600, marginBottom: 4 }}>{t.title}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>Creator: {t.creator_id.substring(0,8)}...</div>
            </div>
            
            <div>
              <div style={{ fontSize: 13, color: '#fff', fontWeight: 600, textTransform: 'capitalize' }}>{t.platform}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{t.target_views} views limit</div>
            </div>
            
            <div>
              <span style={{ fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 100, textTransform: 'uppercase', background: t.status === 'active' ? 'rgba(168,255,62,0.1)' : 'rgba(255,255,255,0.05)', color: t.status === 'active' ? '#A8FF3E' : '#fff' }}>
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
  );
}

// ── 4. ADMIN WITHDRAWALS MODULE ──
export function AdminWithdrawals({ showToast }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchWithdrawals(); }, []);

  async function fetchWithdrawals() {
    try {
      setLoading(true);
      // Fetch withdrawals and join profile emails to see who requested it
      const { data } = await supabase.from('withdrawals').select(`
        *,
        profiles!inner(email)
      `).order('created_at', { ascending: false });
      setRequests(data || []);
    } finally {
      setLoading(false);
    }
  }

  async function processRequest(req, action) {
    if (!window.confirm(`Are you sure you want to ${action} this payout for ${req.amount} PTS?`)) return;

    try {
      const newStatus = action === 'approve' ? 'approved' : 'rejected';
      
      // 1. Update request status
      const { error } = await supabase.from('withdrawals').update({ status: newStatus }).eq('id', req.id);
      if (error) throw error;

      // 2. If rejected, refund the points to the user
      if (action === 'reject') {
        const { data: userProfile } = await supabase.from('profiles').select('points').eq('id', req.user_id).single();
        if (userProfile) {
          await supabase.from('profiles').update({ points: userProfile.points + req.amount }).eq('id', req.user_id);
        }
      }

      setRequests(requests.map(r => r.id === req.id ? { ...r, status: newStatus } : r));
      if (showToast) showToast(`Payout ${newStatus}.`, 'success');
    } catch (err) {
      if (showToast) showToast(`Failed to ${action} payout.`, 'error');
    }
  }

  if (loading) return <div style={{ padding: 80, textAlign: 'center', color: '#fff' }}>Loading financial ledger...</div>;

  return (
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
          <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>No withdrawal requests found.</div>
        ) : (
          requests.map(req => (
            <div key={req.id} style={{ ...S.tableRow, gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
              <div>
                <div style={{ fontSize: 14, color: '#fff', fontWeight: 600, marginBottom: 4 }}>{req.account_name}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}>{req.bank_name}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>User: {req.profiles?.email}</div>
              </div>
              
              <div style={{ fontSize: 14, color: '#fff', fontFamily: 'monospace', letterSpacing: '1px' }}>
                {req.account_number}
              </div>

              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#A8FF3E' }}>{req.amount.toLocaleString()} <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>PTS</span></div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{new Date(req.created_at).toLocaleDateString()}</div>
              </div>

              <div style={{ textAlign: 'right' }}>
                {req.status === 'pending' ? (
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                    <button onClick={() => processRequest(req, 'approve')} style={S.btnSuccess}>Authorize</button>
                    <button onClick={() => processRequest(req, 'reject')} style={S.btnDanger}>Deny & Refund</button>
                  </div>
                ) : (
                  <span style={{ fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 100, textTransform: 'uppercase', background: req.status === 'approved' ? 'rgba(168,255,62,0.1)' : 'rgba(239,68,68,0.1)', color: req.status === 'approved' ? '#A8FF3E' : '#ef4444' }}>
                    {req.status}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
