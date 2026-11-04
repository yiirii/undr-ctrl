import { AnimatePresence, motion, useIsPresent } from 'framer-motion';
import { useDeferredValue, useMemo, useRef, useState } from 'react';
import { useStore, act, type BizSheet } from '../../../store/store';
import {
  addBizItems, sellBizItem, unsellBizItem, editBizItem, deleteBizItem, addBizExpense, deleteBizExpense, deleteBizIncome,
  keepBizItem, unkeepBizItem, setBizValue, reserveBizItem, completeReservation, cancelReservation, setPlatforms,
} from '../../../store/logic';
import { bizMonth, bizSixMonths, itemProfit, stockSummary, platformMonth, collectionSummary, reservationsDue, matchesQuery, type BizItem } from '../../../core/business';
import { parseAmount, parseCost } from '../../../core/money';
import { addDays, dayKey, diffDays, monthName, MONTHS, monthKey } from '../../../core/dates';
import { Icon } from '../../shapes/icons';
import { SearchField } from '../../shapes/SearchField';
import { Bar, Count, SPRING } from '../../shapes/Progress';
import { useFmt } from '../../format';
import { sfx } from '../../sound/synth';

type Sheet = BizSheet;

/** "Cost RM 40" / "Paid RM 40", or "Free" for pieces that cost nothing. */
const costText = (sen: number, rm: (n: number) => string, word = 'Cost') => (sen === 0 ? 'Free' : `${word} ${rm(sen)}`);
const PAGE = 48; // cards shown before "Show more"
const pct = (a: number, b: number) => (b > 0 ? Math.round((a / b) * 100) : 0);
const groupKey = (i: BizItem) => `${i.name}|${i.costSen}`;
function groupItems(items: BizItem[]) {
  const g = new Map<string, BizItem[]>();
  for (const i of items) g.set(groupKey(i), [...(g.get(groupKey(i)) ?? []), i]);
  return [...g.values()].sort((a, c) => a[0].boughtOn.localeCompare(c[0].boughtOn));
}

export function Business({ mk }: { mk: string }) {
  const s = useStore((x) => x.s);
  const patch = useStore((x) => x.patch);
  const fmt = useFmt();
  const today = dayKey(new Date());
  const setSheet = (bizSheet: Sheet) => useStore.getState().setUI({ bizSheet });
  const [q, setQ] = useState('');
  const b = s.business;
  const m = bizMonth(b.items, b.expenses, mk, b.income);
  const st = stockSummary(b.items, today);
  const six = bizSixMonths(b.items, b.expenses, `${mk}-15`, b.income);
  const plats = platformMonth(b.items, mk);
  const col = collectionSummary(b.items);
  const res = reservationsDue(b.items, today);
  const costs = m.cogsSen + m.feesSen + m.expensesSen;
  const scale = Math.max(m.salesSen + m.otherIncomeSen, costs, 1);
  // typing stays instant; the (possibly long) card lists catch up a beat later
  const dq = useDeferredValue(q);
  const stockGroups = useMemo(() => groupItems(b.items.filter((x) => x.status === 'stock' && matchesQuery(x, dq))), [b.items, dq]);
  const kept = useMemo(() => groupItems(b.items.filter((x) => x.status === 'kept' && matchesQuery(x, dq))), [b.items, dq]);
  const [showStock, setShowStock] = useState(PAGE);
  const [showKept, setShowKept] = useState(PAGE);
  const soldThisMonth = b.items.filter((i) => i.status === 'sold' && i.soldOn && monthKey(i.soldOn) === mk).sort((a, c) => c.soldOn!.localeCompare(a.soldOn!));
  const costsThisMonth = b.expenses.filter((e) => monthKey(e.date) === mk).sort((a, c) => c.date.localeCompare(a.date));
  const incomeThisMonth = b.income.filter((e) => monthKey(e.date) === mk);
  const empty = b.items.length === 0 && b.expenses.length === 0;
  const sellable = st.count + col.count;

  return (
    <div className="money-grid">
      <div className="row" style={{ gap: 10, flexWrap: 'wrap' }}>
        <input className="biz-name" value={b.name} onChange={(e) => patch((x) => ({ ...x, business: { ...x.business, name: e.target.value } }))} aria-label="Business name" />
        <div className="grow" />
        <button className="btn" onClick={() => setSheet({ kind: 'buy' })}><Icon name="plus" size={16} stroke={2.4} />Bought</button>
        <button className="btn" onClick={() => setSheet({ kind: 'reserve' })} disabled={!sellable}><Icon name="lock" size={16} />Reserve</button>
        <button className="btn primary" onClick={() => setSheet({ kind: 'sell' })} disabled={!sellable}><Icon name="coins" size={16} />Sold</button>
        <button className="btn ghost" onClick={() => setSheet({ kind: 'cost' })}><Icon name="bag" size={16} />Other cost</button>
      </div>

      {empty ? (
        <div className="money-hero" style={{ flexDirection: 'column', textAlign: 'center', gap: 12, padding: 36 }}>
          <svg width="120" height="90" viewBox="0 0 120 90"><rect x="18" y="20" width="44" height="54" rx="12" fill="var(--wea)" opacity=".85" /><rect x="58" y="12" width="44" height="62" rx="12" fill="var(--cha)" opacity=".85" /><circle cx="94" cy="20" r="8" fill="var(--xp)" /></svg>
          <h2>Track your Funkos piece by piece</h2>
          <p className="dim" style={{ maxWidth: 480, lineHeight: 1.55 }}>Log each piece you buy, for stock or for your own collection. Buying lowers your Wealth; when a piece sells, what you receive raises it again, so Wealth moves by the real profit.</p>
          <div className="row" style={{ gap: 8, justifyContent: 'center' }}>
            <button className="btn primary lg" onClick={() => setSheet({ kind: 'buy' })}><Icon name="plus" size={16} stroke={2.4} />Log your first purchase</button>
            <button className="btn lg" onClick={() => setSheet({ kind: 'buy', kept: true })}><Icon name="heart" size={16} />Add to my collection</button>
          </div>
        </div>
      ) : (
        <>
          <div className="money-hero">
            <div style={{ minWidth: 230 }}>
              <div className="hero-label">Profit in {monthName(mk)}</div>
              <div className="hero-num" style={{ fontSize: '2.4rem', color: m.profitSen >= 0 ? 'var(--in)' : 'var(--bad)' }}><Count value={m.profitSen / 100} format={(v) => fmt.rm(Math.round(v * 100))} /></div>
              <div className="hero-of">{m.soldCount} sold · {m.salesSen ? `${pct(m.profitSen, m.salesSen)}% margin` : 'no sales yet'}</div>
            </div>
            <div className="hero-side">
              <div className="io">
                <div className="io-row"><div className="io-lbl">Sales</div><div className="io-track"><motion.div className="io-fill" style={{ background: 'var(--in)' }} initial={false} animate={{ width: `${((m.salesSen + m.otherIncomeSen) / scale) * 100}%` }} transition={SPRING} /></div><div className="io-val">{fmt.rm(m.salesSen + m.otherIncomeSen)}</div></div>
                <div className="io-row"><div className="io-lbl">Costs</div><div className="io-track"><motion.div className="io-fill" style={{ background: 'var(--warn)' }} initial={false} animate={{ width: `${(costs / scale) * 100}%` }} transition={SPRING} /></div><div className="io-val">{fmt.rm(costs)}</div></div>
              </div>
              <div className="muted" style={{ fontSize: '.78rem', lineHeight: 1.5 }}>
                Costs = what the sold pieces cost you ({fmt.rm(m.cogsSen)}) + fees ({fmt.rm(m.feesSen)}) + other costs ({fmt.rm(m.expensesSen)}).
                {m.otherIncomeSen > 0 && <> Sales include {fmt.rm(m.otherIncomeSen)} in kept deposits.</>}
                {m.boughtCount > 0 && <> You spent {fmt.rm(m.boughtSen)} on {m.boughtCount} new piece{m.boughtCount === 1 ? '' : 's'} this month.</>}
              </div>
            </div>
          </div>

          <div className="two">
            <div className="mcard">
              <div className="mcard-h"><h3>Stock on hand</h3><span className="muted">{st.count} piece{st.count === 1 ? '' : 's'}</span></div>
              <div className="row" style={{ gap: 26, marginBottom: 16, flexWrap: 'wrap' }}>
                <div><div className="hero-label">Cost</div><div className="stat-num">{fmt.rm(st.costSen)}</div></div>
                {st.askSen > 0 && <div><div className="hero-label">Asking</div><div className="stat-num" style={{ color: 'var(--in)' }}>{fmt.rm(st.askSen)}</div></div>}
                {st.count > 0 && <div><div className="hero-label">Oldest</div><div className="stat-num">{st.oldestDays}d</div></div>}
                {st.reservedCount > 0 && <div><div className="hero-label">Deposits held</div><div className="stat-num" style={{ color: 'var(--xp)' }}>{fmt.rm(st.depositsHeldSen)}</div></div>}
              </div>
              <Bar value={m.soldCount} max={Math.max(1, m.soldCount + st.count + st.reservedCount)} label={`Sold through in ${monthName(mk)}`} showNumbers color="var(--in)" height={8} />
            </div>
            <div className="mcard">
              <div className="mcard-h"><h3>Profit, last 6 months</h3></div>
              <ProfitBars data={six} />
            </div>
          </div>

          <div className="two">
            <div className="mcard">
              <div className="mcard-h"><h3>By platform</h3><span className="muted">{monthName(mk)}</span><div className="grow" /><button className="btn sm ghost" onClick={() => setSheet({ kind: 'platforms' })}>Edit</button></div>
              <PlatformBars rows={plats} />
            </div>
            <div className="mcard">
              <div className="mcard-h"><h3>Reserved</h3><span className="muted">{res.length}</span></div>
              <div className="tl-items">
                {res.map(({ item: i, overdue, daysLeft }) => (
                  <div key={i.id} className="tl-item" onClick={() => setSheet({ kind: 'item', id: i.id })}>
                    <div className="grow" style={{ minWidth: 0 }}>
                      <div className="tl-note">{i.name}</div>
                      <div className="tl-sub">Deposit {fmt.rm(i.reservation!.depositSen)}{i.reservation!.priceSen ? ` of ${fmt.rm(i.reservation!.priceSen)}` : ''}{i.platform ? ` · ${i.platform}` : ''}</div>
                    </div>
                    <span className={`chip ${overdue ? 'warn' : ''}`}>{overdue ? `${-daysLeft}d overdue` : daysLeft === 0 ? 'Balance due today' : `Due in ${daysLeft}d`}</span>
                    <button className="btn sm primary" onClick={(e) => { e.stopPropagation(); setSheet({ kind: 'paid', id: i.id }); }}>Paid</button>
                  </div>
                ))}
                {!res.length && <div className="muted" style={{ fontSize: '.86rem' }}>No reservations. Use Reserve when a buyer pays a deposit.</div>}
              </div>
            </div>
          </div>

          <div className="mcard">
            <div className="mcard-h"><h3>In stock</h3>{dq && <span className="muted">{stockGroups.reduce((n, g) => n + g.length, 0)} match</span>}<div className="grow" /><SearchField value={q} onChange={setQ} width={220} className="sm" /></div>
            {stockGroups.length === 0 && <div className="muted" style={{ fontSize: '.86rem' }}>{q ? 'Nothing matches.' : 'Everything is sold or reserved. Time to restock?'}</div>}
            <div className="stock">
              <AnimatePresence initial={false}>
                {stockGroups.slice(0, showStock).map((g) => {
                  const i = g[0];
                  const days = diffDays(i.boughtOn, today);
                  return (
                    <motion.div key={groupKey(i)} layout className="stock-card" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={SPRING} onClick={() => setSheet({ kind: 'item', id: i.id })}>
                      <div className="row" style={{ gap: 8, alignItems: 'flex-start' }}>
                        <div className="grow" style={{ minWidth: 0 }}><div className="stock-name">{i.name}</div><div className="tl-sub">{costText(i.costSen, fmt.rm)}{i.askSen ? ` · asking ${fmt.rm(i.askSen)}` : ''}</div></div>
                        {g.length > 1 && <span className="chip">×{g.length}</span>}
                      </div>
                      <div className="row" style={{ marginTop: 12, gap: 6 }}>
                        <span className={`chip ${days > 60 ? 'warn' : ''}`}>{days === 0 ? 'Bought today' : `${days}d in stock`}</span>
                        <div className="grow" />
                        <button className="btn sm ghost" title="Reserve for a buyer" onClick={(e) => { e.stopPropagation(); setSheet({ kind: 'reserve', id: i.id }); }}><Icon name="lock" size={14} /></button>
                        <button className="btn sm primary" onClick={(e) => { e.stopPropagation(); setSheet({ kind: 'sell', id: i.id }); }}>Sell</button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            {stockGroups.length > showStock && <button className="btn ghost show-more" onClick={() => setShowStock(showStock + PAGE * 2)}>Show more · {stockGroups.length - showStock} left</button>}
          </div>

          <div className="mcard">
            <div className="mcard-h"><h3>My collection</h3><span className="muted">{col.count} piece{col.count === 1 ? '' : 's'}</span><div className="grow" /><button className="btn sm ghost" onClick={() => setSheet({ kind: 'buy', kept: true })}><Icon name="plus" size={14} />Add</button></div>
            {col.count > 0 && (
              <div className="row" style={{ gap: 26, marginBottom: 16, flexWrap: 'wrap' }}>
                <div><div className="hero-label">Paid</div><div className="stat-num">{fmt.rm(col.costSen)}</div></div>
                <div><div className="hero-label">Worth (your estimate)</div><div className="stat-num">{fmt.rm(col.valueSen)}</div></div>
                <div><div className="hero-label">{col.gainSen >= 0 ? 'Up' : 'Down'}</div><div className="stat-num" style={{ color: col.gainSen >= 0 ? 'var(--in)' : 'var(--bad)' }}>{col.gainSen >= 0 ? '+' : '−'}{fmt.rm(Math.abs(col.gainSen))}</div></div>
              </div>
            )}
            {col.count > 0 && dq && kept.length === 0 && <div className="muted" style={{ fontSize: '.86rem' }}>Nothing matches.</div>}
            {col.count === 0 && <div className="muted" style={{ fontSize: '.86rem' }}>Pieces you keep for yourself. They still cost Wealth when you buy them, and you can sell one any time.</div>}
            <div className="stock">
              {kept.slice(0, showKept).map((g) => {
                const i = g[0];
                const gain = (i.valueSen ?? i.costSen) - i.costSen;
                return (
                  <motion.div key={groupKey(i)} layout className="stock-card kept" onClick={() => setSheet({ kind: 'item', id: i.id })} whileHover={{ y: -2 }}>
                    <div className="row" style={{ gap: 8, alignItems: 'flex-start' }}>
                      <div className="grow" style={{ minWidth: 0 }}><div className="stock-name">{i.name}</div><div className="tl-sub">{costText(i.costSen, fmt.rm, 'Paid')}{i.valueSen ? ` · worth ${fmt.rm(i.valueSen)}` : ''}</div></div>
                      {g.length > 1 && <span className="chip">×{g.length}</span>}
                    </div>
                    <div className="row" style={{ marginTop: 12 }}>
                      {i.valueSen ? <span className={`chip ${gain >= 0 ? 'ok' : 'bad'}`}>{gain >= 0 ? '+' : '−'}{fmt.rm(Math.abs(gain))}</span> : <span className="chip">No value yet</span>}
                    </div>
                  </motion.div>
                );
              })}
            </div>
            {kept.length > showKept && <button className="btn ghost show-more" onClick={() => setShowKept(showKept + PAGE * 2)}>Show more · {kept.length - showKept} left</button>}
          </div>

          <div className="two">
            <div className="mcard">
              <div className="mcard-h"><h3>Sold in {monthName(mk)}</h3><span className="muted">{soldThisMonth.length}</span></div>
              <div className="tl-items">
                {soldThisMonth.map((i) => { const p = itemProfit(i); return (
                  <div key={i.id} className="tl-item" onClick={() => setSheet({ kind: 'item', id: i.id })}>
                    <div className="grow" style={{ minWidth: 0 }}><div className="tl-note">{i.name}</div><div className="tl-sub">{fmt.day(i.soldOn!)} · sold {fmt.rm(i.soldSen!)}{i.feesSen ? ` · fees ${fmt.rm(i.feesSen)}` : ''}{i.platform ? ` · ${i.platform}` : ''}</div></div>
                    <span className={`chip ${p >= 0 ? 'ok' : 'bad'}`}>{p >= 0 ? '+' : ''}{fmt.rm(p)}</span>
                  </div>
                ); })}
                {!soldThisMonth.length && <div className="muted" style={{ fontSize: '.86rem' }}>No sales yet this month.</div>}
              </div>
            </div>
            <div className="mcard">
              <div className="mcard-h"><h3>Other costs & income</h3><span className="muted">{fmt.rm(m.expensesSen)}</span></div>
              <div className="tl-items">
                {incomeThisMonth.map((e) => (
                  <div key={e.id} className="tl-item" style={{ cursor: 'default' }}>
                    <div className="grow"><div className="tl-note">{e.label}</div><div className="tl-sub">{fmt.day(e.date)}</div></div>
                    <div className="tl-amt" style={{ color: 'var(--in)' }}>+{fmt.rm(e.sen)}</div>
                    <button className="icon-btn" title="Delete" onClick={() => act(deleteBizIncome, e.id, new Date())}><Icon name="trash" size={14} /></button>
                  </div>
                ))}
                {costsThisMonth.map((e) => (
                  <div key={e.id} className="tl-item" style={{ cursor: 'default' }}>
                    <div className="grow"><div className="tl-note">{e.label}</div><div className="tl-sub">{fmt.day(e.date)}</div></div>
                    <div className="tl-amt">{fmt.rm(e.sen)}</div>
                    <button className="icon-btn" title="Delete" onClick={() => act(deleteBizExpense, e.id, new Date())}><Icon name="trash" size={14} /></button>
                  </div>
                ))}
                {!costsThisMonth.length && !incomeThisMonth.length && <div className="muted" style={{ fontSize: '.86rem' }}>Packaging, shipping supplies, booth fees… log them with “Other cost”.</div>}
              </div>
            </div>
          </div>
        </>
      )}


    </div>
  );
}

/** All Business windows, mounted once at app level (so the phone's + button can open them anywhere). */
export function BizSheets() {
  const sheet = useStore((x) => x.ui.bizSheet ?? null);
  const setSheet = (bizSheet: Sheet) => useStore.getState().setUI({ bizSheet });
  return (
    <AnimatePresence>
        {sheet?.kind === 'buy' && <BuySheet key="buy" kept={sheet.kept} onClose={() => setSheet(null)} />}
        {sheet?.kind === 'sell' && <SellSheet key="sell" presetId={sheet.id} onClose={() => setSheet(null)} />}
        {sheet?.kind === 'reserve' && <ReserveSheet key="reserve" presetId={sheet.id} onClose={() => setSheet(null)} />}
        {sheet?.kind === 'paid' && <PaidSheet key="paid" id={sheet.id} onClose={() => setSheet(null)} />}
        {sheet?.kind === 'cost' && <CostSheet key="cost" onClose={() => setSheet(null)} />}
        {sheet?.kind === 'platforms' && <PlatformsSheet key="platforms" onClose={() => setSheet(null)} />}
        {sheet?.kind === 'item' && <ItemSheet key="item" id={sheet.id} onClose={() => setSheet(null)} go={setSheet} />}
    </AnimatePresence>
  );
}

function ProfitBars({ data }: { data: { mk: string; profitSen: number }[] }) {
  const fmt = useFmt();
  const max = Math.max(1, ...data.map((d) => Math.abs(d.profitSen)));
  return (
    <div className="six" style={{ height: 150 }}>
      {data.map((d) => (
        <div key={d.mk} className="six-col" title={`${monthName(d.mk)}: ${fmt.rm(d.profitSen)}`}>
          <div className="six-bars"><motion.div className="six-bar" style={{ width: 22, background: d.profitSen >= 0 ? 'var(--in)' : 'var(--bad)' }} initial={{ height: 0 }} animate={{ height: `${(Math.abs(d.profitSen) / max) * 100}%` }} transition={SPRING} /></div>
          <div className="six-lbl">{MONTHS[Number(d.mk.slice(5)) - 1].slice(0, 3)}</div>
        </div>
      ))}
    </div>
  );
}

const PLATFORM_HUES = ['var(--int)', 'var(--cha)', 'var(--cre)', 'var(--wea)', 'var(--dis)', 'var(--str)'];
function PlatformBars({ rows }: { rows: { platform: string; count: number; salesSen: number; profitSen: number }[] }) {
  const fmt = useFmt();
  const platforms = useStore((x) => x.s.business.platforms);
  const max = Math.max(1, ...rows.map((r) => r.salesSen));
  if (!rows.length) return <div className="muted" style={{ fontSize: '.86rem' }}>Sales show here by where they sold: {platforms.join(', ')}.</div>;
  return (
    <div className="stack" style={{ gap: 14 }}>
      {rows.map((r) => {
        const idx = platforms.indexOf(r.platform);
        const hue = PLATFORM_HUES[(idx < 0 ? platforms.length : idx) % PLATFORM_HUES.length];
        return (
          <div key={r.platform}>
            <div className="row" style={{ marginBottom: 6, fontSize: '.86rem' }}>
              <b>{r.platform}</b><span className="muted" style={{ marginLeft: 8 }}>{r.count} sold</span><div className="grow" />
              <span className="muted" style={{ marginRight: 10 }}>{fmt.rm(r.salesSen)}</span>
              <b style={{ color: r.profitSen >= 0 ? 'var(--in)' : 'var(--bad)' }}>{r.profitSen >= 0 ? '+' : ''}{fmt.rm(r.profitSen)}</b>
            </div>
            <div className="io-track"><motion.div className="io-fill" style={{ background: hue }} initial={{ width: 0 }} animate={{ width: `${(r.salesSen / max) * 100}%` }} transition={SPRING} /></div>
          </div>
        );
      })}
    </div>
  );
}

function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  // While closing, never block clicks, even if the exit animation lingers.
  const present = useIsPresent();
  return (
    <motion.div className="modal" style={{ pointerEvents: present ? 'auto' : 'none' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.14 } }} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div className="sheet" initial={{ y: 24, scale: 0.98 }} animate={{ y: 0, scale: 1 }} transition={SPRING} onKeyDown={(e) => { if (e.key === 'Escape') { e.stopPropagation(); onClose(); } }}>
        <div className="sheet-h"><h2>{title}</h2><div className="grow" /><button className="icon-btn" onClick={onClose}><Icon name="x" /></button></div>
        {children}
      </motion.div>
    </motion.div>
  );
}

function MoneyField({ label, value, set, autoFocus, placeholder, onEnter, extra }: { label: string; value: string; set: (v: string) => void; autoFocus?: boolean; placeholder?: string; onEnter?: () => void; extra?: React.ReactNode }) {
  return <div className="field"><span>{label}</span><div className="row" style={{ gap: 8 }}><span className="muted" style={{ fontWeight: 700 }}>RM</span><input className="input grow" inputMode="decimal" aria-label={label} autoFocus={autoFocus} placeholder={placeholder ?? '0.00'} value={value} onChange={(e) => set(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && onEnter?.()} style={{ fontWeight: 700, fontSize: '1.05rem', minWidth: 0 }} />{extra}</div></div>;
}

function PlatformPick({ value, set }: { value: string; set: (v: string) => void }) {
  const platforms = useStore((x) => x.s.business.platforms);
  return (
    <div className="field"><span>Where</span>
      <div className="row" style={{ gap: 6, flexWrap: 'wrap' }}>
        {platforms.map((p) => <button key={p} type="button" className={`btn sm ${value === p ? 'primary' : ''}`} onClick={() => set(value === p ? '' : p)}>{p}</button>)}
      </div>
    </div>
  );
}

function Toggle({ on, set, label, hint }: { on: boolean; set: (v: boolean) => void; label: string; hint?: string }) {
  return (
    <button type="button" className="toggle-row" onClick={() => set(!on)}>
      <span className={`switch ${on ? 'on' : ''}`}><motion.span layout transition={SPRING} /></span>
      <span className="grow" style={{ textAlign: 'left' }}><b>{label}</b>{hint && <span className="muted"> · {hint}</span>}</span>
    </button>
  );
}

/** Search-and-pick list of sellable pieces (stock + collection), grouped. */
function ItemPicker({ statuses, onPick }: { statuses: BizItem['status'][]; onPick: (i: BizItem) => void }) {
  const allItems = useStore((x) => x.s.business.items);
  const fmt = useFmt();
  const [q, setQ] = useState('');
  const dq = useDeferredValue(q);
  const key = statuses.join(',');
  const groups = useMemo(() => groupItems(allItems.filter((i) => statuses.includes(i.status) && matchesQuery(i, dq))).sort((a, c) => (a[0].status === 'kept' ? 1 : 0) - (c[0].status === 'kept' ? 1 : 0)), [allItems, dq, key]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      <SearchField value={q} onChange={setQ} autoFocus onEnter={() => { if (groups[0]) onPick(groups[0][0]); }} />
      <div className="tl-items" style={{ maxHeight: 320, overflowY: 'auto' }}>
        {groups.slice(0, 40).map((g) => { const i = g[0]; return (
          <div key={i.id} className="tl-item" onClick={() => onPick(i)}>
            <div className="grow"><div className="tl-note">{i.name}{g.length > 1 && <span className="muted"> ×{g.length}</span>}</div><div className="tl-sub">{costText(i.costSen, fmt.rm)}{i.status === 'kept' ? ' · from my collection' : ''}</div></div>
            <Icon name="right" size={16} />
          </div>
        ); })}
        {groups.length > 40 && <div className="muted" style={{ fontSize: '.84rem', padding: '4px 2px' }}>{groups.length - 40} more. Keep typing to narrow it down.</div>}
        {!groups.length && <div className="muted">Nothing matches.</div>}
      </div>
    </>
  );
}

function ProfitPreview({ profit, of }: { profit: number; of: number }) {
  const fmt = useFmt();
  return (
    <motion.div className="card flat row" initial={false} animate={{ backgroundColor: profit >= 0 ? 'rgba(61,220,151,.10)' : 'rgba(242,84,107,.10)' }}>
      <div className="grow"><div className="hero-label">Profit on this one</div><div style={{ fontWeight: 900, fontSize: '1.6rem', color: profit >= 0 ? 'var(--in)' : 'var(--bad)' }}>{profit >= 0 ? '+' : ''}{fmt.rm(profit)}</div></div>
      <span className="chip">{pct(profit, of)}% margin</span>
    </motion.div>
  );
}

function BuySheet({ kept: keptInit, onClose }: { kept?: boolean; onClose: () => void }) {
  const allItems = useStore((x) => x.s.business.items);
  const names = useMemo(() => [...new Set(allItems.map((i) => i.name))].slice(-200), [allItems]);
  const today = dayKey(new Date());
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  const [ask, setAsk] = useState('');
  const [qty, setQty] = useState(1);
  const [date, setDate] = useState(today);
  const [kept, setKept] = useState(!!keptInit);
  const [hint, setHint] = useState('');
  const [added, setAdded] = useState<{ n: number; last: string }>({ n: 0, last: '' });
  const nameRef = useRef<HTMLInputElement>(null);
  const fmt = useFmt();
  const c = parseCost(cost); // 0 = free
  /** Save this piece. `next` keeps the sheet open for the next one (catalogue mode). */
  const save = (next: boolean) => {
    if (!name.trim()) { if (next && added.n > 0 && !cost) return onClose(); return setHint('Give it a name.'); }
    if (c === null) return setHint('Type what it cost you, or tap Free.');
    act(addBizItems, { name, costSen: c, qty, boughtOn: date, askSen: parseAmount(ask) ?? undefined, kept }, new Date());
    sfx.tink();
    if (!next) return onClose();
    setAdded({ n: added.n + qty, last: name.trim() });
    setName(''); setCost(''); setAsk(''); setQty(1); setHint('');
    nameRef.current?.focus();
  };
  const enter = (e: React.KeyboardEvent) => { if (e.key === 'Enter') { e.preventDefault(); save(true); } };
  return (
    <Sheet title={kept ? 'Added to my collection' : 'Bought stock'} onClose={onClose}>
      <div className="row" style={{ gap: 10 }}>
        <div className="seg-ctl">
          <button className={!kept ? 'on' : ''} onClick={() => setKept(false)}>To sell</button>
          <button className={kept ? 'on' : ''} onClick={() => setKept(true)}>For my collection</button>
        </div>
        <div className="grow" />
        {added.n > 0 && <motion.span key={added.n} className="chip ok added-chip" initial={{ scale: 0.85 }} animate={{ scale: 1 }} transition={SPRING}><Icon name="check" size={12} stroke={2.6} />{added.n} added · last: {added.last}</motion.span>}
      </div>
      <label className="field"><span>Item</span><input ref={nameRef} className="input" autoFocus list="biz-names" placeholder="Item name" value={name} onChange={(e) => {
        const v = e.target.value; setName(v);
        // known piece: prefill the last cost and asking price used for it
        const prev = [...allItems].reverse().find((i) => i.name === v.trim());
        if (prev && !cost) { setCost(String(prev.costSen / 100)); if (prev.askSen && !ask) setAsk(String(prev.askSen / 100)); }
      }} onKeyDown={enter} /></label>
      <datalist id="biz-names">{names.map((n) => <option key={n} value={n} />)}</datalist>
      <div className="two">
        <MoneyField label="Cost per piece" value={cost} set={setCost} onEnter={() => save(true)} extra={<button type="button" className={`btn sm ${c === 0 ? 'primary' : ''}`} onClick={() => { setCost('0'); setHint(''); }} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); save(true); } }} title="Got it for free">Free</button>} />
        {!kept && <MoneyField label="Asking price (optional)" value={ask} set={setAsk} placeholder="—" onEnter={() => save(true)} />}
      </div>
      <div className="row" style={{ gap: 14 }}>
        <div className="field"><span>Quantity</span><div className="seg-ctl"><button onClick={() => setQty(Math.max(1, qty - 1))}>−</button><button className="on" style={{ minWidth: 44 }}>{qty}</button><button onClick={() => setQty(Math.min(200, qty + 1))}>+</button></div></div>
        <label className="field grow"><span>Bought on</span><input type="date" className="input" value={date} max={today} onChange={(e) => e.target.value && setDate(e.target.value)} /></label>
      </div>
      {c === 0 ? <div className="card flat dim" style={{ fontSize: '.86rem', lineHeight: 1.5 }}><b style={{ color: 'var(--in)' }}>Free</b>. Nothing comes off your Wealth{kept ? '.' : ', and the whole sale price counts as profit when it sells.'}</div>
        : c ? <div className="card flat dim" style={{ fontSize: '.86rem', lineHeight: 1.5 }}>Total spent: <b style={{ color: 'var(--t1)' }}>{fmt.rm(c * qty)}</b>. Your Wealth drops by this now{kept ? '.' : ' and goes back up by what you receive when each piece sells.'}</div> : null}
      {hint && <div className="chip warn" style={{ alignSelf: 'flex-start' }}>{hint}</div>}
      <div className="row" style={{ gap: 8 }}>
        <span className="muted" style={{ fontSize: '.78rem', whiteSpace: 'nowrap' }}><span className="kbd">Enter</span> add & next</span>
        <div className="grow" />
        <button className="btn lg" onClick={() => save(true)}><Icon name="plus" size={16} stroke={2.4} />Add & next</button>
        <button className="btn primary lg" onClick={() => (added.n > 0 && !name.trim() && !cost ? onClose() : save(false))}><Icon name="check" size={16} stroke={2.4} />{added.n > 0 && !name.trim() && !cost ? 'Done' : kept ? 'Add to collection' : 'Add to stock'}</button>
      </div>
    </Sheet>
  );
}

function SellSheet({ presetId, onClose }: { presetId?: string; onClose: () => void }) {
  const allItems = useStore((x) => x.s.business.items);
  const fmt = useFmt();
  const today = dayKey(new Date());
  const [id, setId] = useState(presetId ?? '');
  const [saved, setSaved] = useState(false);
  const it = allItems.find((i) => i.id === id && (saved || i.status === 'stock' || i.status === 'kept'));
  const [price, setPrice] = useState(it?.askSen ? String(it.askSen / 100) : '');
  const [fees, setFees] = useState('');
  const [date, setDate] = useState(today);
  const [platform, setPlatform] = useState('');
  const [ship, setShip] = useState(true);
  const [hint, setHint] = useState('');
  const p = parseAmount(price), f = parseAmount(fees) ?? 0;
  const profit = it && p ? p - it.costSen - f : null;
  const save = () => {
    if (!it) return setHint('Pick what you sold.');
    if (!p) return setHint('Type the sale price.');
    setSaved(true);
    act(sellBizItem, it.id, { soldSen: p, feesSen: f, soldOn: date, platform, ship }, new Date());
    onClose();
  };
  return (
    <Sheet title="Sold" onClose={onClose}>
      {!it ? <ItemPicker statuses={['stock', 'kept']} onPick={(i) => { setId(i.id); if (i.askSen) setPrice(String(i.askSen / 100)); }} /> : (
        <>
          <div className="tl-item" style={{ cursor: 'default' }}><div className="grow"><div className="tl-note">{it.name}</div><div className="tl-sub">{costText(it.costSen, fmt.rm)} · bought {fmt.day(it.boughtOn)}{it.status === 'kept' ? ' · from my collection' : ''}</div></div>{!presetId && <button className="btn sm ghost" onClick={() => setId('')}>Change</button>}</div>
          <div className="two">
            <MoneyField label="Sold for" value={price} set={setPrice} autoFocus onEnter={save} />
            <MoneyField label="Fees (shipping, platform)" value={fees} set={setFees} placeholder="0" onEnter={save} />
          </div>
          <PlatformPick value={platform} set={setPlatform} />
          <div className="row" style={{ gap: 14, alignItems: 'flex-end' }}>
            <label className="field"><span>Sold on</span><input type="date" className="input" value={date} max={today} onChange={(e) => e.target.value && setDate(e.target.value)} /></label>
            <div className="grow"><Toggle on={ship} set={setShip} label="Needs shipping" hint="adds a Ship task" /></div>
          </div>
          {profit !== null && <ProfitPreview profit={profit} of={p!} />}
        </>
      )}
      {hint && <div className="chip warn" style={{ alignSelf: 'flex-start' }}>{hint}</div>}
      <div className="row"><div className="grow" /><button className="btn primary lg" onClick={save} disabled={!it}><Icon name="coins" size={16} />Record sale</button></div>
    </Sheet>
  );
}

function ReserveSheet({ presetId, onClose }: { presetId?: string; onClose: () => void }) {
  const allItems = useStore((x) => x.s.business.items);
  const fmt = useFmt();
  const today = dayKey(new Date());
  const [id, setId] = useState(presetId ?? '');
  const [saved, setSaved] = useState(false);
  const it = allItems.find((i) => i.id === id && (saved || i.status === 'stock' || i.status === 'kept'));
  const [deposit, setDeposit] = useState('');
  const [price, setPrice] = useState(it?.askSen ? String(it.askSen / 100) : '');
  const [due, setDue] = useState(addDays(today, 7));
  const [platform, setPlatform] = useState('');
  const [note, setNote] = useState('');
  const [hint, setHint] = useState('');
  const d = parseAmount(deposit), pr = parseAmount(price);
  const save = () => {
    if (!it) return setHint('Pick the piece being reserved.');
    if (!d) return setHint('Reservations need a deposit. Type how much they paid.');
    if (pr && pr < d) return setHint('The agreed price is less than the deposit.');
    setSaved(true);
    act(reserveBizItem, it.id, { depositSen: d, dueOn: due, platform, note, priceSen: pr ?? undefined }, new Date());
    sfx.tink();
    onClose();
  };
  return (
    <Sheet title="Reserve for a buyer" onClose={onClose}>
      {!it ? <ItemPicker statuses={['stock', 'kept']} onPick={(i) => { setId(i.id); if (i.askSen) setPrice(String(i.askSen / 100)); }} /> : (
        <>
          <div className="tl-item" style={{ cursor: 'default' }}><div className="grow"><div className="tl-note">{it.name}</div><div className="tl-sub">{costText(it.costSen, fmt.rm)}</div></div>{!presetId && <button className="btn sm ghost" onClick={() => setId('')}>Change</button>}</div>
          <div className="two">
            <MoneyField label="Deposit paid" value={deposit} set={setDeposit} autoFocus onEnter={save} />
            <MoneyField label="Agreed price (optional)" value={price} set={setPrice} placeholder="—" onEnter={save} />
          </div>
          <PlatformPick value={platform} set={setPlatform} />
          <div className="two">
            <label className="field"><span>Balance due by</span><input type="date" className="input" value={due} min={today} onChange={(e) => e.target.value && setDue(e.target.value)} /></label>
            <label className="field"><span>Note (optional)</span><input className="input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note" /></label>
          </div>
          {d ? <div className="card flat dim" style={{ fontSize: '.86rem', lineHeight: 1.5 }}>
            The deposit is held, not profit yet.{pr ? <> Balance to collect: <b style={{ color: 'var(--t1)' }}>{fmt.rm(pr - d)}</b>.</> : ''} A “Collect balance” task is added for {fmt.day(due)}.
          </div> : null}
        </>
      )}
      {hint && <div className="chip warn" style={{ alignSelf: 'flex-start' }}>{hint}</div>}
      <div className="row"><div className="grow" /><button className="btn primary lg" onClick={save} disabled={!it}><Icon name="lock" size={16} />Reserve</button></div>
    </Sheet>
  );
}

function PaidSheet({ id, onClose }: { id: string; onClose: () => void }) {
  const it = useStore((x) => x.s.business.items.find((i) => i.id === id));
  const fmt = useFmt();
  const today = dayKey(new Date());
  const r = it?.reservation;
  const [bal, setBal] = useState(r?.priceSen ? String((r.priceSen - r.depositSen) / 100) : '');
  const [fees, setFees] = useState('');
  const [date, setDate] = useState(today);
  const [ship, setShip] = useState(true);
  if (!it || !r) return null;
  const bl = bal.trim() === '' ? null : parseAmount(bal) ?? (Number(bal) === 0 ? 0 : null);
  const total = r.depositSen + (bl ?? 0);
  const profit = total - it.costSen - (parseAmount(fees) ?? 0);
  const save = () => { if (bl === null) return; act(completeReservation, id, { balanceSen: bl, feesSen: parseAmount(fees) ?? 0, soldOn: date, ship }, new Date()); onClose(); };
  return (
    <Sheet title="Balance paid" onClose={onClose}>
      <div className="tl-item" style={{ cursor: 'default' }}><div className="grow"><div className="tl-note">{it.name}</div><div className="tl-sub">Deposit {fmt.rm(r.depositSen)}{it.platform ? ` · ${it.platform}` : ''} · {costText(it.costSen, fmt.rm).toLowerCase()}</div></div></div>
      <div className="two">
        <MoneyField label="Balance received" value={bal} set={setBal} autoFocus onEnter={save} />
        <MoneyField label="Fees (shipping, platform)" value={fees} set={setFees} placeholder="0" onEnter={save} />
      </div>
      <div className="row" style={{ gap: 14, alignItems: 'flex-end' }}>
        <label className="field"><span>Paid on</span><input type="date" className="input" value={date} max={today} onChange={(e) => e.target.value && setDate(e.target.value)} /></label>
        <div className="grow"><Toggle on={ship} set={setShip} label="Needs shipping" hint="adds a Ship task" /></div>
      </div>
      {bl !== null && <><div className="muted" style={{ fontSize: '.84rem' }}>Sold for {fmt.rm(total)} in total (deposit + balance).</div><ProfitPreview profit={profit} of={total} /></>}
      <div className="row"><div className="grow" /><button className="btn primary lg" onClick={save} disabled={bl === null}><Icon name="coins" size={16} />Complete sale</button></div>
    </Sheet>
  );
}

function CostSheet({ onClose }: { onClose: () => void }) {
  const today = dayKey(new Date());
  const [label, setLabel] = useState('');
  const [amt, setAmt] = useState('');
  const [date, setDate] = useState(today);
  const save = () => { const sen = parseAmount(amt); if (!sen) return; act(addBizExpense, { sen, label, date }, new Date()); sfx.tink(); onClose(); };
  return (
    <Sheet title="Other business cost" onClose={onClose}>
      <div className="row" style={{ gap: 6, flexWrap: 'wrap' }}>{['Packaging', 'Shipping supplies', 'Protectors', 'Postage', 'Booth fee'].map((l) => <button key={l} className={`btn sm ${label === l ? '' : 'ghost'}`} onClick={() => setLabel(l)}>{l}</button>)}</div>
      <label className="field"><span>What for</span><input className="input" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="What for" /></label>
      <div className="two"><MoneyField label="Amount" value={amt} set={setAmt} autoFocus onEnter={save} /><label className="field"><span>Date</span><input type="date" className="input" value={date} max={today} onChange={(e) => e.target.value && setDate(e.target.value)} /></label></div>
      <div className="row"><div className="grow" /><button className="btn primary lg" onClick={save} disabled={!parseAmount(amt)}><Icon name="check" size={16} stroke={2.4} />Log cost</button></div>
    </Sheet>
  );
}

function PlatformsSheet({ onClose }: { onClose: () => void }) {
  const platforms = useStore((x) => x.s.business.platforms);
  const [list, setList] = useState(platforms);
  const [add, setAdd] = useState('');
  const push = () => { if (add.trim()) { setList([...list, add.trim()]); setAdd(''); } };
  return (
    <Sheet title="Where you sell" onClose={onClose}>
      <div className="tl-items">
        {list.map((p, i) => (
          <div key={p + i} className="tl-item" style={{ cursor: 'default' }}>
            <div className="grow tl-note">{p}</div>
            <button className="icon-btn" disabled={i === 0} onClick={() => { const a = [...list]; [a[i - 1], a[i]] = [a[i], a[i - 1]]; setList(a); }}><Icon name="up" size={14} /></button>
            <button className="icon-btn" onClick={() => setList(list.filter((_, j) => j !== i))}><Icon name="trash" size={14} /></button>
          </div>
        ))}
      </div>
      <div className="row" style={{ gap: 8 }}><input className="input grow" placeholder="Add a platform" value={add} onChange={(e) => setAdd(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && push()} /><button className="btn" onClick={push}>Add</button></div>
      <div className="row"><div className="grow" /><button className="btn primary" onClick={() => { act(setPlatforms, list); onClose(); }}>Save</button></div>
    </Sheet>
  );
}

function ItemSheet({ id, onClose, go }: { id: string; onClose: () => void; go: (s: Sheet) => void }) {
  const it = useStore((x) => x.s.business.items.find((i) => i.id === id));
  const fmt = useFmt();
  const [name, setName] = useState(it?.name ?? '');
  const [cost, setCost] = useState(it ? String(it.costSen / 100) : '');
  const [ask, setAsk] = useState(it?.askSen ? String(it.askSen / 100) : '');
  const [value, setValue] = useState(it?.valueSen ? String(it.valueSen / 100) : '');
  const [sold, setSold] = useState(it?.soldSen ? String(it.soldSen / 100) : '');
  const [fees, setFees] = useState(it?.feesSen ? String(it.feesSen / 100) : '');
  const [cancel, setCancel] = useState(false);
  if (!it) return null;
  const save = () => {
    const patch: Parameters<typeof editBizItem>[2] = { name: name.trim() || it.name, costSen: parseCost(cost) ?? it.costSen };
    if (it.status === 'stock') patch.askSen = parseAmount(ask) ?? undefined;
    if (it.status === 'sold') { patch.soldSen = parseAmount(sold) ?? it.soldSen; patch.feesSen = parseAmount(fees) ?? undefined; }
    act(editBizItem, id, patch, new Date());
    if (it.status === 'kept' && (parseAmount(value) ?? undefined) !== it.valueSen) act(setBizValue, id, parseAmount(value) ?? undefined, new Date());
    onClose();
  };
  const title = { stock: 'In stock', kept: 'In my collection', reserved: 'Reserved', sold: 'Sold' }[it.status];
  const r = it.reservation;
  return (
    <Sheet title={title} onClose={onClose}>
      <label className="field"><span>Item</span><input className="input" value={name} onChange={(e) => setName(e.target.value)} /></label>
      <div className="two">
        <MoneyField label={it.status === 'kept' ? 'Paid' : 'Cost'} value={cost} set={setCost} />
        {it.status === 'stock' && <MoneyField label="Asking price" value={ask} set={setAsk} placeholder="—" />}
        {it.status === 'kept' && <MoneyField label="Worth now (your estimate)" value={value} set={setValue} placeholder="—" />}
        {it.status === 'sold' && <MoneyField label="Sold for" value={sold} set={setSold} />}
      </div>
      {it.status === 'sold' && <MoneyField label="Fees" value={fees} set={setFees} placeholder="0" />}
      {it.status === 'reserved' && r && (
        <div className="card flat" style={{ fontSize: '.88rem', lineHeight: 1.6 }}>
          Deposit <b>{fmt.rm(r.depositSen)}</b>{r.priceSen ? <> of <b>{fmt.rm(r.priceSen)}</b></> : ''}{it.platform ? ` · ${it.platform}` : ''} · balance due <b>{fmt.day(r.dueOn)}</b>{r.note ? <><br /><span className="muted">{r.note}</span></> : ''}
        </div>
      )}
      <div className="muted" style={{ fontSize: '.82rem' }}>
        Bought {fmt.day(it.boughtOn)}{it.soldOn ? ` · sold ${fmt.day(it.soldOn)}${it.platform ? ` on ${it.platform}` : ''} · profit ${fmt.rm(itemProfit(it))}` : ''}
        {it.status === 'kept' && it.valueOn ? ` · value updated ${fmt.day(it.valueOn)}` : ''}
      </div>
      {cancel && it.status === 'reserved' && (
        <div className="confirm-box stack">
          <div style={{ fontSize: '.9rem' }}>Cancel this reservation? The piece goes back to stock.</div>
          <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
            <button className="btn" onClick={() => { act(cancelReservation, id, { keepDeposit: true }, new Date()); onClose(); }}>I kept the deposit</button>
            <button className="btn" onClick={() => { act(cancelReservation, id, { keepDeposit: false }, new Date()); onClose(); }}>I refunded it</button>
            <button className="btn ghost" onClick={() => setCancel(false)}>Never mind</button>
          </div>
        </div>
      )}
      <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
        <button className="btn ghost danger" onClick={() => { act(deleteBizItem, id, new Date()); onClose(); }}><Icon name="trash" size={16} />Delete</button>
        {it.status === 'sold' && <button className="btn ghost" onClick={() => { act(unsellBizItem, id, new Date()); onClose(); }}><Icon name="undo" size={16} />Undo sale</button>}
        {it.status === 'stock' && <button className="btn ghost" onClick={() => { act(keepBizItem, id); onClose(); }}><Icon name="heart" size={16} />Keep it</button>}
        {it.status === 'kept' && <button className="btn ghost" onClick={() => { act(unkeepBizItem, id); onClose(); }}><Icon name="bag" size={16} />Move to stock</button>}
        {it.status === 'reserved' && !cancel && <button className="btn ghost" onClick={() => setCancel(true)}><Icon name="x" size={16} />Cancel reservation</button>}
        <div className="grow" />
        {(it.status === 'stock' || it.status === 'kept') && <button className="btn" onClick={() => go({ kind: 'reserve', id })}><Icon name="lock" size={16} />Reserve</button>}
        {(it.status === 'stock' || it.status === 'kept') && <button className="btn" onClick={() => go({ kind: 'sell', id })}><Icon name="coins" size={16} />Sell</button>}
        {it.status === 'reserved' && <button className="btn" onClick={() => go({ kind: 'paid', id })}><Icon name="coins" size={16} />Balance paid</button>}
        <button className="btn primary" onClick={save}>Save</button>
      </div>
    </Sheet>
  );
}
