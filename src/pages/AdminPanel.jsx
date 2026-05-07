export function AdminUsers({ showToast }) {
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
    if (!window.confirm("WARNING: This will permanently delete this user's profile data. Proceed?")) return;
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      if (error) throw error;
      if (showToast) showToast('User permanently deleted.', 'success');
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      if (showToast) showToast('Failed to delete user', 'error');
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
                  <div style={{ fontSize: 11, fontWeight: 800, color: C.textMain, background: C.input, padding: '4px 10px', borderRadius: 100, textTransform: 'uppercase', marginBottom: 4 }}>{u.role}</div>
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
                  <button type="button" onClick={() => deleteUser(u.id)} style={{ background: 'rgba(239,68,68,0.1)', color: C.red, border: `1px solid ${C.red}`, borderRadius: 6, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Permanently Delete User</button>
                </div>
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
}
