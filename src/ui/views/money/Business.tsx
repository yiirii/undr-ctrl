import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { useStore, act } from '../../../store/store';
import { addBizItems, sellBizItem, unsellBizItem, editBizItem, deleteBizItem, addBizExpense, deleteBizExpense } from '../../../store/logic';
import { bizMonth, bizSixMonths, itemProfit, stockSummary, type BizItem } from '../../../core/business';
import { parseAmount } from '../../../core/money';
import { dayKey, diffDays, monthName, MONTHS, monthKey } from '../../../core/dates';
import { Icon } from '../../shapes/icons';
import { Bar, Count, SPRING } from '../../shapes/Progress';
import { useFmt } from '../../format';
import { sfx } from '../../sound/synth';

type Sheet = null | { kind: 'buy' } | { kind: 'sell'; id?: string } | { kind: 'cost' } | { kind: 'item'; id: string };

const pct = (a: number, b: number) => (b > 0 ? Math.round((a / b) * 100) : 0);

export function Business({ mk }: { mk: string }) {
  const s = useStore((x) => x.s);
  const patch = useStore((x) => x.patch);
  const fmt = useFmt();
  const today = dayKey(new Date());
  const [sheet, setSheet] = useState<Sheet>(null);
  const [q, setQ] = useState('');
  const b = s.business;
  const m = bizMonth(b.items, b.expenses, mk);
  const st = stockSummary(b.items, today);
  const six = bizSixMonths(b.items, b.expenses, `${mk}-15`);
  const costs = m.cogsSen + m.feesSen + m.expensesSen;
  const scale = Math.max(m.salesSen, costs, 1);
  // group identical stock (same name + cost) so multiples show as one card
  const groups = useMemo(() => {
    const g = new Map<string, BizItem[]>();
    for (const i of b.items.filter((x) => x.status === 'stock' && x.name.toLowerCase().includes(q.toLowerCase()))) {
      const k = `${i.name}|${i.costSen}`;
      g.set(k, [...(g.get(k) ?? []), i]);
    }
    return [...g.values()].sort((a, c) => a[0].boughtOn.localeCompare(c[0].boughtOn));
  }, [b.items, q]);
  const soldThisMonth = b.items.filter((i) => i.status === 'sold' && i.soldOn && monthKey(i.soldOn) === mk).sort((a, c) => c.soldOn!.localeCompare(a.soldOn!));
  const costsThisMonth = b.expenses.filter((e) => monthKey(e.date) === mk).sort((a, c) => c.date.localeCompare(a.date));
  const empty = b.items.length === 0 && b.expenses.length === 0;

  return (
    <div className="money-grid">
      <div className="row" style={{ gap: 10 }}>
        <input className="biz-name" value={b.name} onChange={(e) => patch((x) => ({ ...x, business: { ...x.business, name: e.target.value } }))} aria-label="Business name" />
        <div className="grow" />
        <button className="btn" onClick={() => setSheet({ kind: 'buy' })}><Icon name="plus" size={16} stroke={2.4} />Bought</button>
        <button className="btn primary" onClick={() => setSheet({ kind: 'sell' })} disabled={!st.count}><Icon name="coins" size={16} />Sold</button>
        <button className="btn ghost" onClick={() => setSheet({ kind: 'cost' })}><Icon name="bag" size={16} />Other cost</button>
      </div>

      {empty ? (
        <div className="money-hero" style={{ flexDirection: 'column', textAlign: 'center', gap: 12, padding: 36 }}>
          <svg width="120" height="90" viewBox="0 0 120 90"><rect x="18" y="20" width="44" height="54" rx="12" fill="var(--wea)" opacity=".85" /><rect x="58" y="12" width="44" height="62" rx="12" fill="var(--cha)" opacity=".85" /><circle cx="94" cy="20" r="8" fill="var(--xp)" /></svg>
          <h2>Track your business item by item</h2>
          <p className="dim" style={{ maxWidth: 460, lineHeight: 1.55 }}>Log each piece you buy and what it cost. When it sells, enter the price and any fees to see the profit on that item. Profit grows your Wealth. Buying stock doesn't lower it.</p>
          <button className="btn primary lg" onClick={() => setSheet({ kind: 'buy' })}><Icon name="plus" size={16} stroke={2.4} />Log your first purchase</button>
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
                <div className="io-row"><div className="io-lbl">Sales</div><div className="io-track"><motion.div className="io-fill" style={{ background: 'var(--in)' }} initial={false} animate={{ width: `${(m.salesSen / scale) * 100}%` }} transition={SPRING} /></div><div className="io-val">{fmt.rm(m.salesSen)}</div></div>
                <div className="io-row"><div className="io-lbl">Costs</div><div className="io-track"><motion.div className="io-fill" style={{ background: 'var(--warn)' }} initial={false} animate={{ width: `${(costs / scale) * 100}%` }} transition={SPRING} /></div><div className="io-val">{fmt.rm(costs)}</div></div>
              </div>
              <div className="muted" style={{ fontSize: '.78rem', lineHeight: 1.5 }}>Costs = what the sold items cost you ({fmt.rm(m.cogsSen)}) + fees ({fmt.rm(m.feesSen)}) + other costs ({fmt.rm(m.expensesSen)}).{m.boughtCount > 0 && <> You spent {fmt.rm(m.boughtSen)} on {m.boughtCount} new piece{m.boughtCount === 1 ? '' : 's'} this month.</>}</div>
            </div>
          </div>

          <div className="two">
            <div className="mcard">
              <div className="mcard-h"><h3>Stock on hand</h3><span className="muted">{st.count} piece{st.count === 1 ? '' : 's'}</span></div>
              <div className="row" style={{ gap: 26, marginBottom: 16 }}>
                <div><div className="hero-label">Cost</div><div style={{ fontWeight: 800, fontSize: '1.3rem' }}>{fmt.rm(st.costSen)}</div></div>
                {st.askSen > 0 && <div><div className="hero-label">Asking</div><div style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--in)' }}>{fmt.rm(st.askSen)}</div></div>}
                {st.count > 0 && <div><div className="hero-label">Oldest</div><div style={{ fontWeight: 800, fontSize: '1.3rem' }}>{st.oldestDays}d</div></div>}
              </div>
              <Bar value={m.soldCount} max={Math.max(1, m.soldCount + st.count)} label={`Sold through in ${monthName(mk)}`} showNumbers color="var(--in)" height={8} />
            </div>
            <div className="mcard">
              <div className="mcard-h"><h3>Profit, last 6 months</h3></div>
              <ProfitBars data={six} />
            </div>
          </div>

          <div className="mcard">
            <div className="mcard-h"><h3>In stock</h3><div className="grow" /><input className="input" style={{ width: 200, height: 32 }} placeholder="Search stock" value={q} onChange={(e) => setQ(e.target.value)} /></div>
            {groups.length === 0 && <div className="muted" style={{ fontSize: '.86rem' }}>{q ? 'Nothing matches.' : 'Everything is sold. Time to restock?'}</div>}
            <div className="stock">
              <AnimatePresence initial={false}>
                {groups.map((g) => {
                  const i = g[0];
                  const days = diffDays(i.boughtOn, today);
                  return (
                    <motion.div key={i.id} layout className="stock-card" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={SPRING} onClick={() => setSheet({ kind: 'item', id: i.id })}>
                      <div className="row" style={{ gap: 8, alignItems: 'flex-start' }}>
                        <div className="grow" style={{ minWidth: 0 }}><div className="stock-name">{i.name}</div><div className="tl-sub">Cost {fmt.rm(i.costSen)}{i.askSen ? ` · asking ${fmt.rm(i.askSen)}` : ''}</div></div>
                        {g.length > 1 && <span className="chip">×{g.length}</span>}
                      </div>
                      <div className="row" style={{ marginTop: 12 }}>
                        <span className={`chip ${days > 60 ? 'warn' : ''}`}>{days === 0 ? 'Bought today' : `${days}d in stock`}</span>
                        <div className="grow" />
                        <button className="btn sm primary" onClick={(e) => { e.stopPropagation(); setSheet({ kind: 'sell', id: i.id }); }}>Sell</button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          <div className="two">
            <div className="mcard">
              <div className="mcard-h"><h3>Sold in {monthName(mk)}</h3><span className="muted">{soldThisMonth.length}</span></div>
              <div className="tl-items">
                {soldThisMonth.map((i) => { const p = itemProfit(i); return (
                  <div key={i.id} className="tl-item" onClick={() => setSheet({ kind: 'item', id: i.id })}>
                    <div className="grow" style={{ minWidth: 0 }}><div className="tl-note">{i.name}</div><div className="tl-sub">{fmt.day(i.soldOn!)} · sold {fmt.rm(i.soldSen!)}{i.feesSen ? ` · fees ${fmt.rm(i.feesSen)}` : ''}</div></div>
                    <span className={`chip ${p >= 0 ? 'ok' : 'bad'}`}>{p >= 0 ? '+' : ''}{fmt.rm(p)}</span>
                  </div>
                ); })}
                {!soldThisMonth.length && <div className="muted" style={{ fontSize: '.86rem' }}>No sales yet this month.</div>}
              </div>
            </div>
            <div className="mcard">
              <div className="mcard-h"><h3>Other costs</h3><span className="muted">{fmt.rm(m.expensesSen)}</span></div>
              <div className="tl-items">
                {costsThisMonth.map((e) => (
                  <div key={e.id} className="tl-item" style={{ cursor: 'default' }}>
                    <div className="grow"><div className="tl-note">{e.label}</div><div className="tl-sub">{fmt.day(e.date)}</div></div>
                    <div className="tl-amt">{fmt.rm(e.sen)}</div>
                    <button className="icon-btn" title="Delete" onClick={() => act(deleteBizExpense, e.id, new Date())}><Icon name="trash" size={14} /></button>
                  </div>
                ))}
                {!costsThisMonth.length && <div className="muted" style={{ fontSize: '.86rem' }}>Packaging, shipping supplies, booth fees… log them with “Other cost”.</div>}
              </div>
            </div>
          </div>
        </>
      )}

      <AnimatePresence>
        {sheet?.kind === 'buy' && <BuySheet onClose={() => setSheet(null)} />}
        {sheet?.kind === 'sell' && <SellSheet presetId={sheet.id} onClose={() => setSheet(null)} />}
        {sheet?.kind === 'cost' && <CostSheet onClose={() => setSheet(null)} />}
        {sheet?.kind === 'item' && <ItemSheet id={sheet.id} onClose={() => setSheet(null)} onSell={() => setSheet({ kind: 'sell', id: sheet.id })} />}
      </AnimatePresence>
    </div>
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

function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <motion.div className="modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div className="sheet" initial={{ y: 24, scale: 0.98 }} animate={{ y: 0, scale: 1 }} transition={SPRING}>
        <div className="sheet-h"><h2>{title}</h2><div className="grow" /><button className="icon-btn" onClick={onClose}><Icon name="x" /></button></div>
        {children}
      </motion.div>
    </motion.div>
  );
}

function MoneyField({ label, value, set, autoFocus, placeholder }: { label: string; value: string; set: (v: string) => void; autoFocus?: boolean; placeholder?: string }) {
  return <label className="field"><span>{label}</span><div className="row" style={{ gap: 8 }}><span className="muted" style={{ fontWeight: 700 }}>RM</span><input className="input" inputMode="decimal" autoFocus={autoFocus} placeholder={placeholder ?? '0.00'} value={value} onChange={(e) => set(e.target.value)} style={{ fontWeight: 700, fontSize: '1.05rem' }} /></div></label>;
}

function BuySheet({ onClose }: { onClose: () => void }) {
  const allItems = useStore((x) => x.s.business.items);
  const names = useMemo(() => [...new Set(allItems.map((i) => i.name))].slice(-30), [allItems]);
  const today = dayKey(new Date());
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  const [ask, setAsk] = useState('');
  const [qty, setQty] = useState(1);
  const [date, setDate] = useState(today);
  const [hint, setHint] = useState('');
  const fmt = useFmt();
  const c = parseAmount(cost);
  const save = () => {
    if (!name.trim()) return setHint('Give it a name.');
    if (!c) return setHint('Type what it cost you, above RM 0.');
    act(addBizItems, { name, costSen: c, qty, boughtOn: date, askSen: parseAmount(ask) ?? undefined }, new Date());
    sfx.tink();
    onClose();
  };
  return (
    <Sheet title="Bought stock" onClose={onClose}>
      <label className="field"><span>Item</span><input className="input" autoFocus list="biz-names" placeholder="e.g. Funko Pop! Groot #49" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && save()} /></label>
      <datalist id="biz-names">{names.map((n) => <option key={n} value={n} />)}</datalist>
      <div className="two">
        <MoneyField label="Cost per piece" value={cost} set={setCost} />
        <MoneyField label="Asking price (optional)" value={ask} set={setAsk} placeholder="—" />
      </div>
      <div className="row" style={{ gap: 14 }}>
        <div className="field"><span>Quantity</span><div className="seg-ctl"><button onClick={() => setQty(Math.max(1, qty - 1))}>−</button><button className="on" style={{ minWidth: 44 }}>{qty}</button><button onClick={() => setQty(Math.min(200, qty + 1))}>+</button></div></div>
        <label className="field grow"><span>Bought on</span><input type="date" className="input" value={date} max={today} onChange={(e) => e.target.value && setDate(e.target.value)} /></label>
      </div>
      {c ? <div className="card flat dim" style={{ fontSize: '.86rem' }}>Total spent: <b style={{ color: 'var(--t1)' }}>{fmt.rm(c * qty)}</b>. It's counted against profit only when a piece sells, so buying stock doesn't lower your Wealth.</div> : null}
      {hint && <div className="chip warn" style={{ alignSelf: 'flex-start' }}>{hint}</div>}
      <div className="row"><div className="grow" /><button className="btn primary lg" onClick={save}><Icon name="check" size={16} stroke={2.4} />Add to stock</button></div>
    </Sheet>
  );
}

function SellSheet({ presetId, onClose }: { presetId?: string; onClose: () => void }) {
  const allItems = useStore((x) => x.s.business.items);
  const items = useMemo(() => allItems.filter((i) => i.status === 'stock'), [allItems]);
  const fmt = useFmt();
  const today = dayKey(new Date());
  const [id, setId] = useState(presetId ?? '');
  const [q, setQ] = useState('');
  const [price, setPrice] = useState('');
  const [fees, setFees] = useState('');
  const [date, setDate] = useState(today);
  const [hint, setHint] = useState('');
  const it = items.find((i) => i.id === id);
  const p = parseAmount(price), f = parseAmount(fees) ?? 0;
  const profit = it && p ? p - it.costSen - f : null;
  const seen = new Set<string>();
  const pick = items.filter((i) => i.name.toLowerCase().includes(q.toLowerCase())).filter((i) => { const k = `${i.name}|${i.costSen}`; if (seen.has(k)) return false; seen.add(k); return true; });
  const save = () => {
    if (!it) return setHint('Pick what you sold.');
    if (!p) return setHint('Type the sale price.');
    act(sellBizItem, it.id, { soldSen: p, feesSen: f, soldOn: date }, new Date());
    sfx.chime2();
    onClose();
  };
  return (
    <Sheet title="Sold" onClose={onClose}>
      {!it ? (
        <>
          <input className="input" autoFocus placeholder="Search your stock" value={q} onChange={(e) => setQ(e.target.value)} />
          <div className="tl-items" style={{ maxHeight: 300, overflowY: 'auto' }}>
            {pick.map((i) => <div key={i.id} className="tl-item" onClick={() => { setId(i.id); if (i.askSen) setPrice(String(i.askSen / 100)); }}><div className="grow"><div className="tl-note">{i.name}</div><div className="tl-sub">Cost {fmt.rm(i.costSen)}</div></div><Icon name="right" size={16} /></div>)}
            {!pick.length && <div className="muted">Nothing in stock matches.</div>}
          </div>
        </>
      ) : (
        <>
          <div className="tl-item" style={{ cursor: 'default' }}><div className="grow"><div className="tl-note">{it.name}</div><div className="tl-sub">Cost {fmt.rm(it.costSen)} · bought {fmt.day(it.boughtOn)}</div></div>{!presetId && <button className="btn sm ghost" onClick={() => setId('')}>Change</button>}</div>
          <div className="two">
            <MoneyField label="Sold for" value={price} set={setPrice} autoFocus />
            <MoneyField label="Fees (shipping, platform)" value={fees} set={setFees} placeholder="0" />
          </div>
          <label className="field"><span>Sold on</span><input type="date" className="input" value={date} max={today} onChange={(e) => e.target.value && setDate(e.target.value)} /></label>
          {profit !== null && (
            <motion.div className="card flat row" initial={false} animate={{ backgroundColor: profit >= 0 ? 'rgba(61,220,151,.10)' : 'rgba(242,84,107,.10)' }}>
              <div className="grow"><div className="hero-label">Profit on this one</div><div style={{ fontWeight: 900, fontSize: '1.6rem', color: profit >= 0 ? 'var(--in)' : 'var(--bad)' }}>{profit >= 0 ? '+' : ''}{fmt.rm(profit)}</div></div>
              <span className="chip">{pct(profit, p!)}% margin</span>
            </motion.div>
          )}
        </>
      )}
      {hint && <div className="chip warn" style={{ alignSelf: 'flex-start' }}>{hint}</div>}
      <div className="row"><div className="grow" /><button className="btn primary lg" onClick={save} disabled={!it}><Icon name="coins" size={16} />Record sale</button></div>
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
      <div className="row" style={{ gap: 6, flexWrap: 'wrap' }}>{['Packaging', 'Shipping supplies', 'Booth fee', 'Platform fee', 'Protectors'].map((l) => <button key={l} className={`btn sm ${label === l ? '' : 'ghost'}`} onClick={() => setLabel(l)}>{l}</button>)}</div>
      <label className="field"><span>What for</span><input className="input" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Bubble wrap" /></label>
      <div className="two"><MoneyField label="Amount" value={amt} set={setAmt} autoFocus /><label className="field"><span>Date</span><input type="date" className="input" value={date} max={today} onChange={(e) => e.target.value && setDate(e.target.value)} /></label></div>
      <div className="row"><div className="grow" /><button className="btn primary lg" onClick={save} disabled={!parseAmount(amt)}><Icon name="check" size={16} stroke={2.4} />Log cost</button></div>
    </Sheet>
  );
}

function ItemSheet({ id, onClose, onSell }: { id: string; onClose: () => void; onSell: () => void }) {
  const it = useStore((x) => x.s.business.items.find((i) => i.id === id));
  const fmt = useFmt();
  const [name, setName] = useState(it?.name ?? '');
  const [cost, setCost] = useState(it ? String(it.costSen / 100) : '');
  const [ask, setAsk] = useState(it?.askSen ? String(it.askSen / 100) : '');
  const [sold, setSold] = useState(it?.soldSen ? String(it.soldSen / 100) : '');
  const [fees, setFees] = useState(it?.feesSen ? String(it.feesSen / 100) : '');
  if (!it) return null;
  const save = () => {
    const patch: Partial<BizItem> = { name: name.trim() || it.name, costSen: parseAmount(cost) ?? it.costSen, askSen: parseAmount(ask) ?? undefined };
    if (it.status === 'sold') { patch.soldSen = parseAmount(sold) ?? it.soldSen; patch.feesSen = parseAmount(fees) ?? undefined; }
    act(editBizItem, id, patch, new Date());
    onClose();
  };
  return (
    <Sheet title={it.status === 'sold' ? 'Sold item' : 'In stock'} onClose={onClose}>
      <label className="field"><span>Item</span><input className="input" value={name} onChange={(e) => setName(e.target.value)} /></label>
      <div className="two"><MoneyField label="Cost" value={cost} set={setCost} />{it.status === 'stock' ? <MoneyField label="Asking price" value={ask} set={setAsk} placeholder="—" /> : <MoneyField label="Sold for" value={sold} set={setSold} />}</div>
      {it.status === 'sold' && <MoneyField label="Fees" value={fees} set={setFees} placeholder="0" />}
      <div className="muted" style={{ fontSize: '.82rem' }}>Bought {fmt.day(it.boughtOn)}{it.soldOn ? ` · sold ${fmt.day(it.soldOn)} · profit ${fmt.rm(itemProfit(it))}` : ''}</div>
      <div className="row">
        <button className="btn ghost danger" onClick={() => { act(deleteBizItem, id, new Date()); onClose(); }}><Icon name="trash" size={16} />Delete</button>
        {it.status === 'sold' && <button className="btn ghost" onClick={() => { act(unsellBizItem, id, new Date()); onClose(); }}><Icon name="undo" size={16} />Back to stock</button>}
        <div className="grow" />
        {it.status === 'stock' && <button className="btn" onClick={onSell}><Icon name="coins" size={16} />Sell</button>}
        <button className="btn primary" onClick={save}>Save</button>
      </div>
    </Sheet>
  );
}
