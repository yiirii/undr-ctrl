import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSync, sync } from '../../sync/service';
import { Icon } from '../shapes/icons';
import { SPRING } from '../shapes/Progress';

function ago(ms?: number) {
  if (!ms) return 'not yet';
  const s = Math.round((Date.now() - ms) / 1000);
  if (s < 10) return 'just now';
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  return new Date(ms).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
}

/** Sign in / account / sync status. Used in Settings and as the phone's first screen. */
export function SyncPanel({ compact = false, onSkip }: { compact?: boolean; onSkip?: () => void }) {
  const { user, ready, status, available } = useSync();
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [msg, setMsg] = useState<{ ok?: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  // after signing out (or in), come back to a clean "Sign in" form
  useEffect(() => { setMode('in'); setPw(''); setMsg(null); }, [user?.uid]);

  if (!available) return <div className="mcard muted">Sync isn't available in this build.</div>;
  if (!ready) return <div className="mcard muted">Starting sync…</div>;

  if (user) {
    const dot = !status.online ? 'var(--warn)' : status.pending ? 'var(--xp)' : 'var(--ok)';
    const line = !status.online ? `Offline. ${status.pending} change${status.pending === 1 ? '' : 's'} waiting; they'll sync when you're back online.`
      : status.pending ? `Syncing ${status.pending} change${status.pending === 1 ? '' : 's'}…` : `Up to date · last synced ${ago(status.lastSync)}`;
    return (
      <div className="mcard stack sync-card" style={{ maxWidth: 760 }}>
        <div className="row" style={{ gap: 12 }}>
          <div className="cloud-ico"><Icon name="repeat" size={18} /></div>
          <div className="grow"><div style={{ fontWeight: 700 }}>Synced with your account</div><div className="muted" style={{ fontSize: '.86rem' }}>{user.email}</div></div>
          <motion.span className="sync-dot" style={{ background: dot }} animate={{ scale: status.pending ? [1, 1.35, 1] : 1 }} transition={{ repeat: status.pending ? Infinity : 0, duration: 1.2 }} />
        </div>
        <div className="muted" style={{ fontSize: '.88rem' }}>{line}</div>
        <div className="row" style={{ gap: 8 }}>
          <button className="btn" onClick={() => void sync.flush()}><Icon name="repeat" size={15} />Sync now</button>
          <button className="btn ghost" onClick={() => void sync.signOut()}>Sign out</button>
        </div>
        <div className="muted" style={{ fontSize: '.78rem', lineHeight: 1.5 }}>Your laptop and iPhone share everything here, except music and the backup folder, which stay on each device. Signing out keeps a copy on this device.</div>
      </div>
    );
  }

  const submit = async () => {
    setBusy(true); setMsg(null);
    const err = mode === 'in' ? await sync.signIn(email, pw) : await sync.signUp(email, pw);
    setBusy(false);
    if (err) setMsg({ text: err });
  };
  return (
    <motion.div className={`mcard stack sync-card ${compact ? 'compact' : ''}`} style={{ maxWidth: 520 }} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={SPRING}>
      <div className="row" style={{ gap: 12 }}>
        <div className="cloud-ico"><Icon name="repeat" size={18} /></div>
        <div className="grow"><div style={{ fontWeight: 700 }}>{mode === 'in' ? 'Sign in to sync' : 'Create your sync account'}</div><div className="muted" style={{ fontSize: '.84rem', lineHeight: 1.5 }}>Use the same email and password on your laptop and iPhone. Everything stays in step.</div></div>
      </div>
      <label className="field"><span>Email</span><input className="input" type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" /></label>
      <label className="field"><span>Password</span><input className="input" type="password" autoComplete={mode === 'in' ? 'current-password' : 'new-password'} value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Password" onKeyDown={(e) => e.key === 'Enter' && void submit()} /></label>
      {msg && <div className={`chip ${msg.ok ? 'ok' : 'warn'}`} style={{ alignSelf: 'flex-start', whiteSpace: 'normal' }}>{msg.text}</div>}
      <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
        <button className="btn primary lg" disabled={busy || !email || !pw} onClick={() => void submit()}>{busy ? 'One moment…' : mode === 'in' ? 'Sign in' : 'Create account'}</button>
        <button className="btn ghost" onClick={() => { setMode(mode === 'in' ? 'up' : 'in'); setMsg(null); }}>{mode === 'in' ? 'First time? Create an account' : 'I already have an account'}</button>
        <div className="grow" />
        {mode === 'in' && <button className="btn ghost sm" onClick={async () => { if (!email) return setMsg({ text: 'Type your email first.' }); const e = await sync.reset(email); setMsg(e ? { text: e } : { ok: true, text: 'Check your email for a reset link.' }); }}>Forgot password</button>}
      </div>
      {onSkip && <button className="btn ghost sm" style={{ alignSelf: 'center' }} onClick={onSkip}>Use without syncing</button>}
    </motion.div>
  );
}
