// Lightweight canvas particle bursts for moments.
type P = { x: number; y: number; vx: number; vy: number; r: number; rot: number; vr: number; life: number; max: number; color: string; shape: 0 | 1 | 2 | 3 };
let canvas: HTMLCanvasElement | null = null;
let ps: P[] = [];
let raf = 0;

export function attachCanvas(c: HTMLCanvasElement | null) { canvas = c; }

function loop() {
  if (!canvas) return;
  const ctx = canvas.getContext('2d')!;
  const dpr = window.devicePixelRatio || 1;
  if (canvas.width !== canvas.clientWidth * dpr) { canvas.width = canvas.clientWidth * dpr; canvas.height = canvas.clientHeight * dpr; }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  ps = ps.filter((p) => p.life < p.max);
  for (const p of ps) {
    p.life++;
    p.x += p.vx; p.y += p.vy; p.vx *= 0.955; p.vy = p.vy * 0.955 + 0.05; p.rot += p.vr;
    const t = p.life / p.max;
    ctx.save();
    ctx.globalAlpha = t < 0.7 ? 1 : 1 - (t - 0.7) / 0.3;
    ctx.translate(p.x, p.y); ctx.rotate(p.rot);
    ctx.fillStyle = p.color; ctx.strokeStyle = p.color; ctx.lineWidth = 2;
    const r = p.r * (1 - t * 0.3);
    ctx.beginPath();
    if (p.shape === 0) ctx.arc(0, 0, r, 0, Math.PI * 2), ctx.fill();
    else if (p.shape === 1) { ctx.moveTo(0, -r); ctx.lineTo(r * 0.9, r * 0.7); ctx.lineTo(-r * 0.9, r * 0.7); ctx.closePath(); ctx.fill(); }
    else if (p.shape === 2) { ctx.roundRect(-r * 0.8, -r * 0.8, r * 1.6, r * 1.6, r * 0.3); ctx.fill(); }
    else { ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke(); }
    ctx.restore();
  }
  if (ps.length) raf = requestAnimationFrame(loop); else { raf = 0; ctx.clearRect(0, 0, canvas.width, canvas.height); }
}

export function burst(x: number, y: number, colors: string[], count = 40, power = 9, ring = false) {
  if (!canvas || document.documentElement.classList.contains('reduced-motion')) return;
  for (let i = 0; i < count; i++) {
    const a = ring ? (i / count) * Math.PI * 2 : Math.random() * Math.PI * 2;
    const sp = ring ? power : power * (0.35 + Math.random() * 0.65);
    ps.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, r: 3 + Math.random() * 5, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3, life: 0, max: 55 + Math.random() * 35, color: colors[i % colors.length], shape: (i % 4) as P['shape'] });
  }
  if (!raf) raf = requestAnimationFrame(loop);
}

export const cssVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
