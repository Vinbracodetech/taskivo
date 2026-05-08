import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Universal Theme Engine
const C = {
  surface: 'var(--surface)',
  card: 'var(--surface-card)',
  input: 'var(--surface-card)',
  textMain: 'var(--ink)',
  textMuted: 'var(--slate)',
  line: 'var(--line)',
  lime: '#A8FF3E',
  limeText: 'var(--lime)',
  limeDim: 'var(--lime-dim)',
  shadow: 'var(--shadow)',
  red: '#ef4444',
  orange: '#f59e0b'
};

// ── 1. ADMIN OVERVIEW ──
export function AdminOverview({ navigate }) {
  return (
    <div style={{ padding: '40px 5%', maxWidth: 1000, margin: '0 auto', fontFamily: "'DM Sans', sans-serif" }}>
      <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 28, color: C.textMain, marginBottom: 8, fontWeight: 800 }}>Command Center</h1>
      <p style={{ color: C.textMuted, fontSize: 15, marginBottom: 40 }}>System-wide administration and network integrity.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
        <div onClick={function() { navigate('admin-users'); }} style={{ background: C.card, border: `1px solid ${C.line}`, padding: 32, borderRadius: 16, cursor: 'pointer', boxShadow: C.shadow }}>
          <div style={{ fontSize: 24, marginBottom: 16 }}>👥</div>
          <h3 style={{ fontSize: 18, color: C.textMain, fontWeight: 700 }}>Manage Users</h3>
          <p style={{ color: C.textMuted, fontSize: 13, marginTop: 8 }}>View all earners and businesses.</p>
        </div>
        
        <div onClick={function() { navigate('admin-tasks'); }} style={{ background: C.card, border: `1px solid ${C.line}`, padding: 32, borderRadius: 16, cursor: 'pointer', boxShadow: C.shadow }}>
          <div style={{ fontSize: 24, marginBottom: 16 }}>📋</div>
          <h3 style={{ fontSize: 18, color: C.textMain, fontWeight: 700 }}>Review Tasks</h3>
          <p style={{ color: C.textMuted, fontSize: 13, marginTop: 8 }}>Approve, reject, and permanently delete campaigns.</p>
        </div>

        <div onClick={function() { navigate('admin-withdrawals'); }} style={{ background: C.card, border: `1px solid ${C.line}`, padding: 32, borderRadius: 16, cursor: 'pointer', boxShadow: C.shadow }}>
          <div style={{ fontSize: 24, marginBottom: 16 }}>💳</div>
          <h3 style={{ fontSize: 18, color: C.textMain, fontWeight: 700 }}>Withdrawals</h3>
          <p style={{ color: C.textMuted, fontSize: 13, marginTop: 8 }}>Process pending earner payouts.</p>
        </div>
      </div>
    </div>
  );
}

// ── 2. ADMIN TASKS (WITH DELETE LOGIC) ──
export function AdminTasks({ showToast }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(function() { fetchTasks(); }, []);

  async function fetchTasks() {
    setLoading(true);
    const { data } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
    setTasks(data || []);
    setLoading(false);
  }

  async function updateStatus(id, newStatus) {
    try {
      const { error } = await supabase.from('tasks').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      if (showToast) showToast(`Task marked as ${newStatus}`, 'success');
      fetchTasks();
    } catch (err) {
      if (showToast) showToast('Failed to update status', 'error');
    }
  }

  // 🔥 THE HARD DELETE FUNCTION 🔥
  async function permanentlyDeleteTask(id) {
    const isConfirmed = window.confirm("WARNING: This will permanently delete this task from the Supabase database. This action cannot be undone. Proceed?");
    if (!isConfirmed) return;

    try {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) throw error;
      if (showToast) showToast('Task permanently deleted from database.', 'success');
      fetchTasks();
    } catch (err) {
      if (showToast) showToast('Failed to delete task', 'error');
    }
  }

  if (loading) return <div style={{ padding: '60px 5%', textAlign: 'center', color: C.textMuted }}>Loading network tasks...</div>;

  return (
    <div style={{ padding: '40px 5%', maxWidth: 1000, margin: '0 auto', fontFamily: "'DM Sans', sans-serif", paddingBottom: 120 }}>
      <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 28, color: C.textMain, marginBottom: 24, fontWeight: 800 }}>Network Tasks</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {tasks.map(function(task) {
          const isPending = task.status === 'pending_payment';
          const isDeletable = task.status === 'rejected' || task.status === 'completed';

          return (
            <div key={task.id} style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 16, padding: 24, display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between', boxShadow: C.shadow }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: C.textMain }}>{task.title}</span>
                  <span style={{ background: C.input, color: task.status === 'active' ? C.limeText : C.textMuted, fontSize: 10, fontWeight: 800, padding: '4px 8px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: 1 }}>{task.status}</span>
                </div>
                <div style={{ fontSize: 13, color: C.textMuted }}>{task.platform} • {task.reward_points} PTS • {task.slots} Slots</div>
              </div>
              
              <div style={{ display: 'flex', gap: 8 }}>
                {isPending && (
                  <>
                    <button onClick={function() { updateStatus(task.id, 'active'); }} style={{ background: C.lime, color: '#000', border: 'none', borderRadius: 6, padding: '8px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Approve</button>
                    <button onClick={function() { updateStatus(task.id, 'rejected'); }} style={{ background: 'transparent', color: C.red, border: `1px solid ${C.red}`, borderRadius: 6, padding: '8px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Reject</button>
                  </>
                )}
                
                {isDeletable && (
                  <button onClick={function() { permanentlyDeleteTask(task.id); }} style={{ background: 'rgba(239,68,68,0.1)', color: C.red, border: `1px solid ${C.red}`, borderRadius: 6, padding: '8px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                    Permanently Delete
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── 3. ADMIN USERS (GOD MODE) ──
export function AdminUsers({ showToast, currentUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => { fetchUsers(); }, []);

  async function fetchUsers() {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    setUsers(data || []);
    setLoading(false);
  }

  async function handleSaveUser(e) {
    e.preventDefault();
    try {
      const { error } = await supabase.from('profiles').update({ 
        role: editingUser.role, 
        points: parseInt(editingUser.points) 
      }).eq('id', editingUser.id);
      
      if (error) throw error;
      if (showToast) showToast('User updated successfully', 'success');
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      if (showToast) showToast('Failed to update user', 'error');
    }
  }

  async function sendPasswordReset(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      if (showToast) showToast(`Password reset link sent to ${email}`, 'success');
    } catch (err) {
      if (showToast) showToast('Failed to send link', 'error');
    }
  }

  async function deleteUser(id) {
    if (currentUser && currentUser.id === id) {
      alert("Safety Lock: You cannot delete your own Admin account while logged in.");
      return;
    }

    if (!window.confirm("WARNING: Deleting a profile wipes their data. If they log in again, Supabase will just generate a fresh 'Earner' profile. To permanently lock them out, change their role to 'Suspended' instead. Proceed?")) return;
    
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      if (error) throw error;
      if (showToast) showToast('User profile wiped.', 'success');
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      if (showToast) showToast('Failed to wipe user', 'error');
    }
  }

  if (loading) return <div style={{ padding: '60px 5%', textAlign: 'center', color: C.textMuted }}>Loading users...</div>;

  return (
    <div style={{ padding: '40px 5%', maxWidth: 1000, margin: '0 auto', fontFamily: "'DM Sans', sans-serif", paddingBottom: 120 }}>
      <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 28, color: C.textMain, marginBottom: 24, fontWeight: 800 }}>User Directory</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {users.map(u => (
          <div key={u.id} style={{ background: C.card, border: `1px solid ${u.deletion_requested ? C.red : C.line}`, borderRadius: 12, padding: 16, boxShadow: C.shadow }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.textMain, display: 'flex', gap: 8, alignItems: 'center' }}>
                  {u.email} 
                  {u.deletion_requested && <span style={{ background: C.red, color: '#fff', fontSize: 10, padding: '2px 6px', borderRadius: 4 }}>Deletion Requested</span>}
                </div>
                <div style={{ fontSize: 12, color: C.textMuted }}>ID: {u.id.substring(0,8)}...</div>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: u.role === 'suspended' ? C.red : C.textMain, background: u.role === 'suspended' ? 'rgba(239,68,68,0.1)' : C.input, padding: '4px 10px', borderRadius: 100, textTransform: 'uppercase', marginBottom: 4 }}>{u.role}</div>
                  <div style={{ fontSize: 13, color: C.limeText, fontWeight: 700 }}>{u.points} PTS</div>
                </div>
                <button onClick={() => setEditingUser(editingUser?.id === u.id ? null : u)} style={{ background: 'transparent', border: `1px solid ${C.line}`, color: C.textMain, borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>Edit</button>
              </div>
            </div>

            {/* EDITING PANEL */}
            {editingUser?.id === u.id && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px dashed ${C.line}` }}>
                <form onSubmit={handleSaveUser} style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', marginBottom: 4 }}>Role</label>
                    <select value={editingUser.role} onChange={(e) => setEditingUser({...editingUser, role: e.target.value})} style={{ padding: '8px', borderRadius: 6, border: `1px solid ${C.line}`, background: C.input, color: C.textMain, outline: 'none' }}>
                      <option value="earner">Earner</option>
                      <option value="creator">Creator (Business)</option>
                      <option value="admin">Admin</option>
                      <option value="suspended">Suspended (Lock Account)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', marginBottom: 4 }}>Points</label>
                    <input type="number" value={editingUser.points} onChange={(e) => setEditingUser({...editingUser, points: e.target.value})} style={{ padding: '8px', width: 100, borderRadius: 6, border: `1px solid ${C.line}`, background: C.input, color: C.textMain, outline: 'none' }} />
                  </div>
                  <button type="submit" style={{ background: C.lime, color: '#000', border: 'none', borderRadius: 6, padding: '8px 16px', fontWeight: 700, cursor: 'pointer' }}>Save Changes</button>
                </form>

                <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                  <button type="button" onClick={() => sendPasswordReset(u.email)} style={{ background: 'transparent', color: C.textMain, border: `1px solid ${C.line}`, borderRadius: 6, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Send Password Reset Link</button>
                  <button type="button" onClick={() => deleteUser(u.id)} style={{ background: 'rgba(239,68,68,0.1)', color: C.red, border: `1px solid ${C.red}`, borderRadius: 6, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Wipe Profile Data</button>
                </div>
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
}

// ── 4. ADMIN WITHDRAWALS ──
export function AdminWithdrawals({ showToast }) {
  const [reqs, setReqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(function() { fetchReqs(); }, []);

  async function fetchReqs() {
    setLoading(true);
    const { data } = await supabase.from('withdrawals').select('*, profiles(email)').order('created_at', { ascending: false });
    setReqs(data || []);
    setLoading(false);
  }

  async function processWithdrawal(id, newStatus) {
    try {
      const { error } = await supabase.from('withdrawals').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      if (showToast) showToast(`Withdrawal ${newStatus}`, 'success');
      fetchReqs();
    } catch (err) {
      if (showToast) showToast('Failed to update status', 'error');
    }
  }

  if (loading) return <div style={{ padding: '60px 5%', textAlign: 'center', color: C.textMuted }}>Loading withdrawals...</div>;

  return (
    <div style={{ padding: '40px 5%', maxWidth: 1000, margin: '0 auto', fontFamily: "'DM Sans', sans-serif", paddingBottom: 120 }}>
      <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 28, color: C.textMain, marginBottom: 24, fontWeight: 800 }}>Payout Requests</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {reqs.map(function(r) {
          return (
            <div key={r.id} style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 16, padding: 24, display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between', boxShadow: C.shadow }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.textMain, marginBottom: 4 }}>${Number(r.estimated_value).toFixed(2)} USD <span style={{ color: C.textMuted, fontSize: 14 }}>({r.points} PTS)</span></div>
                <div style={{ fontSize: 13, color: C.textMuted }}>User: {r.profiles?.email || 'Unknown'}</div>
                <div style={{ fontSize: 13, color: C.textMuted, marginTop: 4, padding: '8px', background: C.input, borderRadius: 6 }}>
                  <strong>{r.payment_method.toUpperCase()}:</strong> {r.payment_details}
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {r.status === 'pending' ? (
                  <>
                    <button onClick={function() { processWithdrawal(r.id, 'approved'); }} style={{ background: C.lime, color: '#000', border: 'none', borderRadius: 6, padding: '8px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Mark Paid</button>
                    <button onClick={function() { processWithdrawal(r.id, 'rejected'); }} style={{ background: 'transparent', color: C.red, border: `1px solid ${C.red}`, borderRadius: 6, padding: '8px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Reject</button>
                  </>
                ) : (
                  <span style={{ color: r.status === 'approved' ? C.limeText : C.red, fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>{r.status}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
