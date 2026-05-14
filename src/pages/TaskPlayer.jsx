import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

export default function TaskPlayer({ session, navigate, taskId }) {
  const user = session?.user;
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isLive, setIsLive] = useState(false);
  const [verification, setVerification] = useState(false);
  const [cooldown, setCooldown] = useState(null);
  const [handle, setHandle] = useState('');

  useEffect(() => {
    async function init() {
      const { data: c } = await supabase.from('completions').select('created_at').eq('task_id', taskId).eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).maybeSingle();
      if (c) {
        const h = (new Date() - new Date(c.created_at)) / 3600000;
        if (h < 24) { setCooldown(Math.ceil(24 - h)); setLoading(false); return; }
      }
      const { data: t } = await supabase.from('tasks').select('*').eq('id', taskId).single();
      if (t) { setTask(t); setTimer(t.watch_duration); }
      setLoading(false);
    }
    init();
  }, [taskId]);

  useEffect(() => {
    if (!task || cooldown || verification) return;
    const load = () => {
      new window.YT.Player('yt-frame', {
        videoId: task.url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/)?.[1],
        events: { onStateChange: (e) => setIsLive(e.data === 1) }
      });
    };
    if (!window.YT) {
      const s = document.createElement('script'); s.src = 'https://www.youtube.com/iframe_api';
      window.onYouTubeIframeAPIReady = load; document.body.appendChild(s);
    } else load();
  }, [task, cooldown, verification]);

  useEffect(() => {
    let i;
    if (isLive && !document.hidden && timer > 0) {
      i = setInterval(() => setTimer(t => { if (t <= 1) { setVerification(true); return 0; } return t - 1; }), 1000);
    }
    return () => clearInterval(i);
  }, [isLive, timer]);

  async function claim() {
    if (!handle.trim()) return alert("Enter handle");
    const { error } = await supabase.from('completions').insert({ user_id: user.id, earner_id: user.id, task_id: task.id, platform: task.platform, social_handle: handle });
    if (error) alert(error.message);
    else { alert("Verified!"); navigate('tasks'); }
  }

  if (loading) return <div style={{padding: 40, textAlign: 'center'}}>Syncing...</div>;
  if (cooldown) return <div style={{padding: 40, textAlign: 'center'}}>⏱️ Cooldown: {cooldown}h left</div>;

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: 'auto' }}>
      <div style={{ background: '#000', borderRadius: 16, overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ padding: 15, background: '#111', color: isLive ? '#4ade80' : '#ff4444', fontWeight: 800, textAlign: 'center' }}>
          {isLive ? `TRACKING: ${timer}s` : 'PAUSED'}
        </div>
        {!verification ? <div id="yt-frame" style={{ width: '100%', height: 350 }}></div> : (
          <div style={{ padding: 40, background: '#fff', textAlign: 'center' }}>
            <button onClick={() => window.open(task.url, '_blank')} style={{ background: '#ff4444', color: '#fff', padding: 15, width: '100%', border: 'none', borderRadius: 8, marginBottom: 20 }}>1. OPEN & ENGAGE</button>
            <input placeholder="@handle" value={handle} onChange={e => setHandle(e.target.value)} style={{ width: '100%', padding: 12, marginBottom: 20, borderRadius: 8, border: '1px solid #ddd' }} />
            <button onClick={claim} style={{ background: '#4ade80', padding: 15, width: '100%', border: 'none', borderRadius: 8, fontWeight: 800 }}>2. CLAIM POINTS</button>
          </div>
        )}
      </div>
    </div>
  );
}
