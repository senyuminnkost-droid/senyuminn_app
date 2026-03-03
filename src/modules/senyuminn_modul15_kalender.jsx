import { useState, useEffect } from "react";

// ============================================================
// MOCK DATA
// ============================================================
const YEAR = 2026;
const MONTH = 1; // Feb (0-indexed)

const EVENTS_DATA = {
  "2026-02-02": [
    { id: "E01", type: "weekly",    label: "Weekly Service — Kamar 2, 3, 5",        icon: "🧹", kamar: [2,3,5] },
  ],
  "2026-02-03": [
    { id: "E02", type: "checkin",   label: "Check-in — Dian Pratiwi (Kamar 3)",      icon: "🔑", kamar: [3] },
  ],
  "2026-02-04": [
    { id: "E03", type: "weekly",    label: "Weekly Service — Kamar 6, 8, 11",        icon: "🧹", kamar: [6,8,11] },
    { id: "E04", type: "keluhan",   label: "Tiket #T003 — Keran Air Kamar 9",        icon: "🔴", kamar: [9] },
  ],
  "2026-02-05": [
    { id: "E05", type: "maintenance", label: "Maintenance — Kamar 5 (Pintu)",        icon: "🔧", kamar: [5] },
  ],
  "2026-02-07": [
    { id: "E06", type: "weekly",    label: "Weekly Service — Kamar 1, 4, 7",         icon: "🧹", kamar: [1,4,7] },
  ],
  "2026-02-09": [
    { id: "E07", type: "cuti",      label: "Cuti — Muh. Krisna Mukti",              icon: "🌴", kamar: [] },
  ],
  "2026-02-10": [
    { id: "E08", type: "weekly",    label: "Weekly Service — Kamar 9, 10, 12",       icon: "🧹", kamar: [9,10,12] },
    { id: "E09", type: "selesai",   label: "Selesai — Tiket #T002 Listrik Kamar 1", icon: "✅", kamar: [1] },
  ],
  "2026-02-12": [
    { id: "E10", type: "deepclean", label: "Deep Clean — Kamar 8 (Post Check-out)", icon: "✨", kamar: [8] },
  ],
  "2026-02-14": [
    { id: "E11", type: "weekly",    label: "Weekly Service — Kamar 2, 5, 6",        icon: "🧹", kamar: [2,5,6] },
  ],
  "2026-02-15": [
    { id: "E12", type: "checkout",  label: "Check-out — Ratna Wijaya (Kamar 8)",    icon: "📦", kamar: [8] },
    { id: "E13", type: "servis",    label: "Servis AC Rutin — 13 Unit Semua Kamar", icon: "❄️", kamar: [] },
  ],
  "2026-02-17": [
    { id: "E14", type: "weekly",    label: "Weekly Service — Kamar 3, 11, 12",      icon: "🧹", kamar: [3,11,12] },
  ],
  "2026-02-19": [
    { id: "E15", type: "keluhan",   label: "Tiket #T001 — AC Bocor Kamar 9",        icon: "🔴", kamar: [9] },
  ],
  "2026-02-21": [
    { id: "E16", type: "weekly",    label: "Weekly Service — Kamar 1, 7, 9",        icon: "🧹", kamar: [1,7,9] },
    { id: "E17", type: "selesai",   label: "Selesai — Deep Clean Kamar 8",          icon: "✅", kamar: [8] },
  ],
  "2026-02-24": [
    { id: "E18", type: "weekly",    label: "Weekly Service — Kamar 4, 10, 6",       icon: "🧹", kamar: [4,10,6] },
  ],
  "2026-02-25": [
    { id: "E19", type: "reminder",  label: "Reminder Kontrak — Kamar 9 H-30",       icon: "⚠️", kamar: [9] },
  ],
  "2026-02-26": [
    { id: "E20", type: "checkin",   label: "Check-in Rencana — Kamar 11",           icon: "🔑", kamar: [11] },
  ],
  "2026-02-28": [
    { id: "E21", type: "reminder",  label: "Reminder Kontrak — Kamar 12 H-30",      icon: "⚠️", kamar: [12] },
    { id: "E22", type: "weekly",    label: "Weekly Service — Kamar 2, 8, 11",       icon: "🧹", kamar: [2,8,11] },
  ],
};

const EVENT_TYPE_LIST = [
  { id: "weekly",      label: "Weekly Service",    icon: "🧹", color: "#1d4ed8", bg: "#dbeafe" },
  { id: "servis",      label: "Servis AC Rutin",   icon: "❄️", color: "#0891b2", bg: "#cffafe" },
  { id: "deepclean",   label: "Deep Clean",        icon: "✨", color: "#0ea5e9", bg: "#e0f2fe" },
  { id: "maintenance", label: "Maintenance",       icon: "🔧", color: "#d97706", bg: "#fef3c7" },
  { id: "keluhan",     label: "Keluhan / Tiket",   icon: "🔴", color: "#dc2626", bg: "#fee2e2" },
  { id: "selesai",     label: "Selesai Perbaikan", icon: "✅", color: "#16a34a", bg: "#dcfce7" },
  { id: "checkin",     label: "Check-in",          icon: "🔑", color: "#f97316", bg: "#ffedd5" },
  { id: "checkout",    label: "Check-out",         icon: "📦", color: "#7c3aed", bg: "#ede9fe" },
  { id: "reminder",    label: "Reminder Kontrak",  icon: "⚠️", color: "#ca8a04", bg: "#fef9c3" },
  { id: "cuti",        label: "Cuti Staff",        icon: "🌴", color: "#059669", bg: "#d1fae5" },
  { id: "lainnya",     label: "Lainnya",           icon: "📌", color: "#64748b", bg: "#f1f5f9" },
];

const KAMAR_LIST = Array.from({ length: 12 }, (_, i) => i + 1);
const STAFF_LIST = ["Muh. Krisna Mukti", "Gurit Yudho Anggoro", "Rina Manajemen"];
const BULAN = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
const HARI  = ["Min","Sen","Sel","Rab","Kam","Jum","Sab"];
const TODAY = "2026-02-26";

const typeCfg  = (type) => EVENT_TYPE_LIST.find(t => t.id === type) || EVENT_TYPE_LIST[EVENT_TYPE_LIST.length - 1];
const fmtKey   = (y, m, d) => `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
const daysIn   = (y, m) => new Date(y, m + 1, 0).getDate();
const firstDay = (y, m) => new Date(y, m, 1).getDay();

// ============================================================
// CSS
// ============================================================
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  :root{
    --or:#f97316;--or-d:#ea580c;--or-pale:#fff7ed;--or-light:#ffedd5;--or-mid:#fed7aa;
    --s900:#0f172a;--s800:#1e293b;--s700:#334155;--s600:#475569;
    --s400:#94a3b8;--s200:#e2e8f0;--s100:#f1f5f9;--s50:#f8fafc;
    --white:#fff;--red:#dc2626;--green:#16a34a;
  }
  body{font-family:'Plus Jakarta Sans',sans-serif;background:var(--s50)}
  ::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-thumb{background:var(--s200);border-radius:4px}

  .topbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:10px}
  .nav-month{display:flex;align-items:center;gap:8px}
  .nav-btn{background:var(--s100);border:1px solid var(--s200);border-radius:8px;width:32px;height:32px;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;color:var(--s600);transition:all .12s}
  .nav-btn:hover{background:var(--or);color:#fff;border-color:var(--or-d)}
  .month-label{font-size:16px;font-weight:800;color:var(--s800);min-width:180px;text-align:center}

  .view-toggle{display:flex;gap:3px;background:var(--s100);border-radius:9px;padding:3px}
  .vt-btn{padding:5px 12px;border-radius:7px;border:none;font-family:'Plus Jakarta Sans',sans-serif;font-size:11px;font-weight:600;cursor:pointer;transition:all .12s;color:var(--s400);background:transparent}
  .vt-btn.active{background:var(--white);color:var(--s800);box-shadow:0 1px 4px rgba(0,0,0,.1)}

  .stat-row{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-bottom:16px}
  .sc{background:var(--white);border:1px solid var(--s200);border-radius:10px;padding:10px 14px;border-top:2px solid transparent;cursor:pointer;transition:all .12s}
  .sc:hover{box-shadow:0 2px 8px rgba(249,115,22,.08)}
  .sc.af{border-top-color:var(--or);background:var(--or-pale)}
  .sc-label{font-size:9px;font-weight:700;color:var(--s400);text-transform:uppercase;letter-spacing:.7px;margin-bottom:3px}
  .sc-val{font-size:18px;font-weight:800;color:var(--s800)}

  .cal-layout{display:grid;grid-template-columns:1fr 260px;gap:14px;align-items:start}
  .cal-widget{background:var(--white);border:1px solid var(--s200);border-radius:12px;overflow:hidden}

  /* MONTH */
  .day-headers{display:grid;grid-template-columns:repeat(7,1fr);background:var(--s50);border-bottom:1px solid var(--s200)}
  .dh{padding:8px 4px;text-align:center;font-size:10px;font-weight:700;color:var(--s400);text-transform:uppercase;letter-spacing:.5px}
  .dh.we{color:var(--red)}
  .days-grid{display:grid;grid-template-columns:repeat(7,1fr)}
  .dc{min-height:88px;padding:5px 4px;border-right:1px solid var(--s100);border-bottom:1px solid var(--s100);cursor:pointer;transition:background .1s;overflow:hidden}
  .dc:nth-child(7n){border-right:none}
  .dc:hover{background:var(--or-pale)}
  .dc.is-today{background:var(--or-pale)}
  .dc.is-sel{background:var(--or-pale);outline:2px solid var(--or);outline-offset:-1px;border-radius:0}
  .dc.is-other{background:var(--s50);opacity:.4;pointer-events:none}
  .dc.is-we{background:#fffafa}
  .dn{width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;color:var(--s700);margin-bottom:2px}
  .dn.t{background:var(--or);color:#fff;font-weight:800}
  .dn.w{color:var(--red)}
  .chip{font-size:8px;font-weight:700;padding:1px 4px;border-radius:3px;margin-bottom:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.5}
  .more{font-size:8px;color:var(--s400);padding-left:3px}

  /* WEEK */
  .week-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;padding:12px}
  .wdc{background:var(--s50);border-radius:10px;overflow:hidden;min-height:160px}
  .wdc-h{padding:7px 8px;text-align:center;border-bottom:1px solid var(--s200);background:var(--white)}
  .wdc-h.th{background:var(--or);border-color:var(--or-d)}
  .wdc-dn{font-size:10px;font-weight:700;color:var(--s400);text-transform:uppercase}
  .wdc-dd{font-size:16px;font-weight:800;color:var(--s800)}
  .wdc-h.th .wdc-dn{color:rgba(255,255,255,.6)}
  .wdc-h.th .wdc-dd{color:#fff}
  .wdc-b{padding:5px}
  .wev{padding:4px 6px;border-radius:6px;margin-bottom:3px;cursor:pointer}
  .wev-lbl{font-size:9px;font-weight:700;line-height:1.3}

  /* AGENDA */
  .ag-day{border-bottom:1px solid var(--s100)}
  .ag-day:last-child{border-bottom:none}
  .ag-h{padding:10px 16px;background:var(--s50);display:flex;align-items:center;gap:10px;border-bottom:1px solid var(--s100)}
  .ag-h.th{background:var(--or-pale)}
  .ag-dbadge{width:40px;height:40px;border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0;background:var(--white);border:1px solid var(--s200)}
  .ag-h.th .ag-dbadge{background:var(--or);border-color:var(--or-d)}
  .ag-dd{font-size:15px;font-weight:800;color:var(--s800);line-height:1}
  .ag-h.th .ag-dd{color:#fff}
  .ag-dow{font-size:9px;font-weight:700;color:var(--s400);text-transform:uppercase}
  .ag-h.th .ag-dow{color:rgba(255,255,255,.6)}
  .ag-evs{padding:8px 16px}
  .ag-ev{display:flex;gap:10px;padding:8px 0;border-bottom:1px solid var(--s100);align-items:flex-start}
  .ag-ev:last-child{border-bottom:none}
  .ag-ico{width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0}
  .ag-lbl{font-size:12px;font-weight:700;color:var(--s800);margin-bottom:3px}
  .ag-meta{font-size:10px;color:var(--s400);display:flex;gap:6px;flex-wrap:wrap;align-items:center}

  /* RIGHT PANEL */
  .rp{display:flex;flex-direction:column;gap:12px}
  .rw{background:var(--white);border:1px solid var(--s200);border-radius:12px;overflow:hidden}
  .rw-h{padding:10px 14px;border-bottom:1px solid var(--s100);display:flex;align-items:center;justify-content:space-between}
  .rw-t{font-size:12px;font-weight:800;color:var(--s800);display:flex;align-items:center;gap:5px}
  .rw-b{padding:12px 14px}
  .dd-ev{padding:8px 10px;border-radius:8px;margin-bottom:6px;cursor:pointer}
  .dd-ev:last-child{margin-bottom:0}
  .dd-lbl{font-size:12px;font-weight:700;margin-bottom:1px}
  .dd-type{font-size:10px;font-weight:600;opacity:.65}

  /* FORM MODAL */
  .overlay{position:fixed;inset:0;background:rgba(15,23,42,.6);display:flex;align-items:center;justify-content:center;z-index:200;backdrop-filter:blur(3px)}
  .mc{background:var(--white);border-radius:16px;width:480px;max-height:90vh;overflow-y:auto;box-shadow:0 24px 60px rgba(0,0,0,.25);animation:popIn .2s cubic-bezier(.34,1.56,.64,1)}
  @keyframes popIn{from{transform:scale(.96) translateY(8px);opacity:0}to{transform:scale(1) translateY(0);opacity:1}}
  .mc-h{padding:16px 22px 12px;border-bottom:1px solid var(--s100);background:linear-gradient(135deg,var(--or-pale),var(--white))}
  .mc-b{padding:18px 22px}
  .mc-f{padding:12px 22px;border-top:1px solid var(--s100);display:flex;gap:8px;justify-content:flex-end}

  .fl{display:block;font-size:10px;font-weight:700;color:var(--s600);text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px}
  .fi{width:100%;background:var(--s50);border:1.5px solid var(--s200);border-radius:8px;padding:8px 12px;font-size:13px;color:var(--s800);font-family:'Plus Jakarta Sans',sans-serif;outline:none;transition:all .15s}
  .fi:focus{border-color:var(--or);background:var(--white)}
  .frow{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px}
  .fmb{margin-bottom:12px}

  .type-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:5px}
  .to{padding:7px 4px;border-radius:8px;border:1.5px solid var(--s200);cursor:pointer;text-align:center;transition:all .12s;background:var(--white)}
  .to:hover{border-color:var(--or-mid)}
  .to.sel{border-color:var(--or);background:var(--or-pale)}
  .to-i{font-size:14px;margin-bottom:2px}
  .to-l{font-size:9px;font-weight:700;color:var(--s600)}

  .kp{display:flex;gap:4px;flex-wrap:wrap}
  .kpb{width:30px;height:26px;border-radius:6px;border:1.5px solid var(--s200);background:var(--white);font-size:11px;font-weight:700;cursor:pointer;transition:all .12s;color:var(--s600)}
  .kpb:hover{border-color:var(--or-mid)}
  .kpb.sel{background:var(--or);border-color:var(--or-d);color:#fff}

  .badge{display:inline-flex;align-items:center;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700;white-space:nowrap}
  .btn-primary{background:linear-gradient(135deg,var(--or),var(--or-d));color:#fff;border:none;border-radius:8px;padding:9px 18px;font-size:13px;font-weight:700;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all .15s;box-shadow:0 2px 8px rgba(249,115,22,.25);display:inline-flex;align-items:center;gap:6px}
  .btn-primary:hover{filter:brightness(1.05)}
  .btn-ghost{background:var(--s100);color:var(--s700);border:1px solid var(--s200);border-radius:8px;padding:9px 14px;font-size:12px;font-weight:600;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all .15s;display:inline-flex;align-items:center;gap:6px}
  .btn-ghost:hover{background:var(--s200)}
  .btn-sm{padding:5px 11px;font-size:11px;border-radius:7px}
  .btn-xs{padding:3px 8px;font-size:10px;border-radius:6px}
  .btn-red{background:#fee2e2;color:var(--red);border:1px solid #fca5a5;border-radius:6px;padding:3px 8px;font-size:10px;font-weight:700;cursor:pointer;font-family:inherit;transition:all .12s}
  .btn-red:hover{background:var(--red);color:#fff}

  .toaster{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--s900);color:#fff;padding:10px 22px;border-radius:30px;font-size:13px;font-weight:600;z-index:999;box-shadow:0 8px 24px rgba(0,0,0,.3);animation:toastIn .25s ease;white-space:nowrap}
  @keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  .fade-up{animation:fadeUp .25s ease forwards}

  .leg-grid{display:grid;grid-template-columns:1fr 1fr;gap:4px}
  .leg-item{display:flex;align-items:center;gap:5px;font-size:10px;color:var(--s600);padding:2px 0;cursor:pointer;transition:opacity .15s}
  .leg-dot{width:9px;height:9px;border-radius:2px;flex-shrink:0}
`;

function StyleInjector() {
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = CSS;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);
  return null;
}

function Toast({ msg, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2400); return () => clearTimeout(t); }, []);
  return <div className="toaster">{msg}</div>;
}

// ============================================================
// FORM TAMBAH EVENT
// ============================================================
function FormEvent({ date, onSave, onClose }) {
  const [form, setForm] = useState({ type: "weekly", label: "", tanggal: date || TODAY, kamar: [], staff: "", catatan: "" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleKamar = (k) => set("kamar", form.kamar.includes(k) ? form.kamar.filter(x => x !== k) : [...form.kamar, k]);
  const cfg = typeCfg(form.type);
  const ok = form.label.trim() && form.tanggal;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="mc" onClick={e => e.stopPropagation()}>
        <div className="mc-h">
          <div style={{ fontSize: 15, fontWeight: 800, color: "var(--s900)", marginBottom: 2 }}>📅 Tambah Event</div>
          <div style={{ fontSize: 12, color: "var(--s400)" }}>Jadwalkan ke kalender operasional</div>
        </div>
        <div className="mc-b">
          <div className="fmb">
            <label className="fl">Tipe Event</label>
            <div className="type-grid">
              {EVENT_TYPE_LIST.map(t => (
                <div key={t.id} className={`to ${form.type === t.id ? "sel" : ""}`} onClick={() => set("type", t.id)}>
                  <div className="to-i">{t.icon}</div>
                  <div className="to-l" style={{ color: form.type === t.id ? t.color : undefined }}>{t.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="frow">
            <div>
              <label className="fl">Tanggal *</label>
              <input className="fi" type="date" value={form.tanggal} onChange={e => set("tanggal", e.target.value)} />
            </div>
            <div>
              <label className="fl">Staff PJ</label>
              <select className="fi" value={form.staff} onChange={e => set("staff", e.target.value)}>
                <option value="">— Pilih staff —</option>
                {STAFF_LIST.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="fmb">
            <label className="fl">Deskripsi *</label>
            <input className="fi" placeholder={`Misal: ${cfg.label} — Kamar 3, 5`} value={form.label} onChange={e => set("label", e.target.value)} />
          </div>
          <div className="fmb">
            <label className="fl">Kamar Terkait</label>
            <div className="kp">
              {KAMAR_LIST.map(k => (
                <button key={k} className={`kpb ${form.kamar.includes(k) ? "sel" : ""}`} onClick={() => toggleKamar(k)}>{k}</button>
              ))}
            </div>
          </div>
          <div className="fmb">
            <label className="fl">Catatan</label>
            <textarea className="fi" rows={2} value={form.catatan} onChange={e => set("catatan", e.target.value)} style={{ resize: "vertical" }} />
          </div>
          {/* Preview */}
          <div style={{ background: cfg.bg, border: `1.5px solid ${cfg.color}33`, borderRadius: 9, padding: "9px 12px", display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 16 }}>{cfg.icon}</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: cfg.color }}>{form.label || "Preview event..."}</div>
              <div style={{ fontSize: 10, color: "var(--s400)", marginTop: 1 }}>
                {form.tanggal}{form.kamar.length > 0 ? ` · Kamar ${form.kamar.join(", ")}` : ""}
              </div>
            </div>
          </div>
        </div>
        <div className="mc-f">
          <button className="btn-ghost" onClick={onClose}>Batal</button>
          <button className="btn-primary" disabled={!ok} style={{ opacity: ok ? 1 : 0.5 }}
            onClick={() => onSave(form.tanggal, { id: "E" + Date.now(), type: form.type, label: form.label, icon: cfg.icon, kamar: form.kamar, staff: form.staff, catatan: form.catatan })}>
            ✓ Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MONTH VIEW
// ============================================================
function MonthView({ year, month, events, sel, onSel, ft }) {
  const dim  = daysIn(year, month);
  const fd   = firstDay(year, month);
  const prev = daysIn(year, month - 1 < 0 ? 11 : month - 1);

  const cells = [];
  for (let i = fd - 1; i >= 0; i--) cells.push({ d: prev - i, t: "p" });
  for (let d = 1; d <= dim; d++) cells.push({ d, t: "c" });
  while ((cells.length % 7) !== 0) cells.push({ d: cells.length - dim - fd + 1, t: "n" });

  return (
    <div>
      <div className="day-headers">
        {HARI.map((h, i) => <div key={h} className={`dh${i===0||i===6?" we":""}`}>{h}</div>)}
      </div>
      <div className="days-grid">
        {cells.map((cell, idx) => {
          if (cell.t !== "c") return <div key={idx} className="dc is-other"><div className="dn" style={{ color: "var(--s200)" }}>{cell.d}</div></div>;
          const key = fmtKey(year, month, cell.d);
          const evs = (events[key] || []).filter(e => !ft || e.type === ft);
          const isT = key === TODAY, isS = key === sel;
          const dow = (fd + cell.d - 1) % 7;
          const isW = dow === 0 || dow === 6;
          return (
            <div key={idx} className={`dc${isT?" is-today":""}${isS?" is-sel":""}${isW?" is-we":""}`} onClick={() => onSel(key)}>
              <div className={`dn${isT?" t":""}${isW&&!isT?" w":""}`}>{cell.d}</div>
              {evs.slice(0, 3).map((ev, ei) => {
                const c = typeCfg(ev.type);
                return <div key={ei} className="chip" style={{ background: c.bg, color: c.color }}>{ev.icon} {ev.label.split(" — ")[0]}</div>;
              })}
              {evs.length > 3 && <div className="more">+{evs.length - 3}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// WEEK VIEW
// ============================================================
function WeekView({ events, sel, onSel, ft }) {
  const ref = sel ? new Date(sel) : new Date(TODAY);
  const ws  = new Date(ref);
  ws.setDate(ref.getDate() - ref.getDay());
  const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(ws); d.setDate(ws.getDate() + i); return d; });

  return (
    <div className="week-grid">
      {days.map((d, i) => {
        const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
        const evs = (events[key] || []).filter(e => !ft || e.type === ft);
        const isT = key === TODAY, isS = key === sel;
        const isW = d.getDay() === 0 || d.getDay() === 6;
        return (
          <div key={i} className="wdc" style={{ outline: isS ? "2px solid var(--or)" : undefined, outlineOffset: -1 }} onClick={() => onSel(key)}>
            <div className={`wdc-h${isT?" th":""}`}>
              <div className="wdc-dn" style={{ color: isW && !isT ? "var(--red)" : undefined }}>{HARI[d.getDay()]}</div>
              <div className="wdc-dd" style={{ color: isW && !isT ? "var(--red)" : undefined }}>{d.getDate()}</div>
            </div>
            <div className="wdc-b">
              {evs.length === 0 && <div style={{ fontSize: 10, color: "var(--s200)", textAlign: "center", marginTop: 16 }}>—</div>}
              {evs.map((ev, ei) => {
                const c = typeCfg(ev.type);
                return (
                  <div key={ei} className="wev" style={{ background: c.bg }}>
                    <div style={{ fontSize: 11 }}>{ev.icon}</div>
                    <div className="wev-lbl" style={{ color: c.color }}>{ev.label.length > 28 ? ev.label.slice(0,28)+"…" : ev.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// AGENDA VIEW
// ============================================================
function AgendaView({ year, month, events, ft, onDelete, onToast }) {
  const dim = daysIn(year, month);
  const agDays = Array.from({ length: dim }, (_, i) => i + 1)
    .map(d => ({ key: fmtKey(year, month, d), d, evs: (events[fmtKey(year, month, d)] || []).filter(e => !ft || e.type === ft) }))
    .filter(x => x.evs.length > 0);

  if (agDays.length === 0) return (
    <div style={{ textAlign: "center", padding: "48px 24px", color: "var(--s400)" }}>
      <div style={{ fontSize: 44, marginBottom: 10 }}>📭</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--s700)" }}>Tidak ada event</div>
    </div>
  );

  return (
    <div>
      {agDays.map(({ key, d, evs }) => {
        const dt = new Date(key);
        const isT = key === TODAY, isW = dt.getDay() === 0 || dt.getDay() === 6;
        return (
          <div key={key} className="ag-day">
            <div className={`ag-h${isT?" th":""}`}>
              <div className="ag-dbadge">
                <div className="ag-dd" style={{ color: isW && !isT ? "var(--red)" : undefined }}>{d}</div>
                <div className="ag-dow" style={{ color: isW && !isT ? "#fca5a5" : undefined }}>{HARI[dt.getDay()]}</div>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: isT ? "var(--or-d)" : "var(--s800)" }}>
                  {d} {BULAN[month]} {year}
                  {isT && <span className="badge" style={{ marginLeft: 8, color: "var(--or-d)", background: "var(--or-light)" }}>Hari Ini</span>}
                </div>
                <div style={{ fontSize: 11, color: "var(--s400)" }}>{evs.length} event</div>
              </div>
            </div>
            <div className="ag-evs">
              {evs.map((ev, ei) => {
                const c = typeCfg(ev.type);
                return (
                  <div key={ei} className="ag-ev">
                    <div className="ag-ico" style={{ background: c.bg }}><span>{ev.icon}</span></div>
                    <div style={{ flex: 1 }}>
                      <div className="ag-lbl">{ev.label}</div>
                      <div className="ag-meta">
                        <span className="badge" style={{ color: c.color, background: c.bg }}>{c.label}</span>
                        {ev.kamar?.length > 0 && <span>Kamar {ev.kamar.join(", ")}</span>}
                        {ev.staff && <span>👤 {ev.staff}</span>}
                        {ev.catatan && <span style={{ fontStyle: "italic" }}>💬 {ev.catatan}</span>}
                      </div>
                      <button className="btn-red btn-xs" style={{ marginTop: 5 }}
                        onClick={() => { onDelete(key, ev.id); onToast("🗑️ Event dihapus"); }}>
                        Hapus
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// MAIN
// ============================================================
export default function KalenderOperasional({ userRole = "admin" }) {
  const [cy, setCy] = useState(YEAR);
  const [cm, setCm] = useState(MONTH);
  const [events, setEvents] = useState(EVENTS_DATA);
  const [sel, setSel]       = useState(TODAY);
  const [view, setView]     = useState("month");
  const [ft, setFt]         = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast]   = useState(null);

  const prevMonth = () => { if (cm===0){setCy(y=>y-1);setCm(11);}else setCm(m=>m-1); setSel(null); };
  const nextMonth = () => { if (cm===11){setCy(y=>y+1);setCm(0);}else setCm(m=>m+1); setSel(null); };
  const goToday   = () => { setCy(YEAR); setCm(MONTH); setSel(TODAY); };

  const addEvent = (dateKey, ev) => {
    setEvents(p => ({ ...p, [dateKey]: [...(p[dateKey]||[]), ev] }));
    setShowForm(false);
    setToast("✓ Event berhasil ditambahkan");
  };
  const delEvent = (dateKey, id) => {
    setEvents(p => ({ ...p, [dateKey]: (p[dateKey]||[]).filter(e => e.id !== id) }));
  };

  // Stats
  const prefix = `${cy}-${String(cm+1).padStart(2,"0")}`;
  const allEvs  = Object.entries(events).filter(([k])=>k.startsWith(prefix)).flatMap(([,v])=>v);
  const stats   = {
    total:  allEvs.length,
    weekly: allEvs.filter(e=>e.type==="weekly").length,
    tiket:  allEvs.filter(e=>e.type==="keluhan"||e.type==="maintenance").length,
    cin:    allEvs.filter(e=>e.type==="checkin").length,
    cout:   allEvs.filter(e=>e.type==="checkout").length,
  };

  const selEvs = sel ? (events[sel]||[]) : [];

  return (
    <div className="fade-up">
      <StyleInjector />

      {/* TOPBAR */}
      <div className="topbar">
        <div className="nav-month">
          <button className="nav-btn" onClick={prevMonth}>‹</button>
          <div className="month-label">{BULAN[cm].toUpperCase()} {cy}</div>
          <button className="nav-btn" onClick={nextMonth}>›</button>
          <button className="btn-ghost btn-sm" onClick={goToday}>Hari Ini</button>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div className="view-toggle">
            {[["month","Bulan"],["week","Minggu"],["agenda","Agenda"]].map(([id,lbl]) => (
              <button key={id} className={`vt-btn${view===id?" active":""}`} onClick={()=>setView(id)}>{lbl}</button>
            ))}
          </div>
          <button className="btn-primary btn-sm" onClick={()=>setShowForm(true)}>+ Jadwalkan</button>
        </div>
      </div>

      {/* STAT ROW */}
      <div className="stat-row">
        {[
          { lbl:"Total Event",  val:stats.total,  color:"var(--or)",   ft:null },
          { lbl:"Weekly Svc",   val:stats.weekly, color:"#1d4ed8",     ft:"weekly" },
          { lbl:"Tiket/Maint",  val:stats.tiket,  color:"var(--red)",  ft:"keluhan" },
          { lbl:"Check-in",     val:stats.cin,    color:"#f97316",     ft:"checkin" },
          { lbl:"Check-out",    val:stats.cout,   color:"#7c3aed",     ft:"checkout" },
        ].map(s => (
          <div key={s.lbl} className={`sc${ft===s.ft?" af":""}`}
            style={{ borderTopColor: ft===s.ft ? s.color : "transparent" }}
            onClick={() => setFt(ft===s.ft ? null : s.ft)}>
            <div className="sc-label">{s.lbl}</div>
            <div className="sc-val" style={{ color: s.color }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* LAYOUT */}
      <div className="cal-layout">
        <div className="cal-widget">
          {view==="month"  && <MonthView  year={cy} month={cm} events={events} sel={sel} onSel={setSel} ft={ft} />}
          {view==="week"   && <WeekView   events={events} sel={sel} onSel={setSel} ft={ft} />}
          {view==="agenda" && <AgendaView year={cy} month={cm} events={events} ft={ft} onDelete={delEvent} onToast={setToast} />}
        </div>

        {/* RIGHT */}
        <div className="rp">
          <div className="rw">
            <div className="rw-h">
              <div className="rw-t">📋 {sel || "Pilih tanggal"}</div>
              {sel && <button className="btn-xs btn-ghost" onClick={()=>setShowForm(true)}>+ Event</button>}
            </div>
            <div className="rw-b">
              {!sel && (
                <div style={{ textAlign:"center", color:"var(--s400)", padding:"20px 0" }}>
                  <div style={{ fontSize:30, marginBottom:8 }}>📅</div>
                  <div style={{ fontSize:12 }}>Klik tanggal untuk detail</div>
                </div>
              )}
              {sel && selEvs.length===0 && (
                <div style={{ textAlign:"center", color:"var(--s400)", padding:"16px 0" }}>
                  <div style={{ fontSize:26, marginBottom:6 }}>✅</div>
                  <div style={{ fontSize:12 }}>Tidak ada jadwal</div>
                  <div style={{ fontSize:11, color:"var(--or-d)", marginTop:8, fontWeight:700, cursor:"pointer" }} onClick={()=>setShowForm(true)}>+ Jadwalkan</div>
                </div>
              )}
              {selEvs.map((ev,i) => {
                const c = typeCfg(ev.type);
                return (
                  <div key={i} className="dd-ev" style={{ background:c.bg, border:`1px solid ${c.color}22` }}>
                    <div className="dd-lbl" style={{ color:c.color }}>{ev.icon} {ev.label}</div>
                    <div className="dd-type">{c.label}</div>
                    {ev.kamar?.length > 0 && <div style={{ fontSize:10, color:"var(--s400)", marginTop:2 }}>Kamar {ev.kamar.join(", ")}</div>}
                    <button className="btn-red btn-xs" style={{ marginTop:5 }} onClick={()=>{ delEvent(sel,ev.id); setToast("🗑️ Dihapus"); }}>Hapus</button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legenda */}
          <div className="rw">
            <div className="rw-h"><div className="rw-t">🎨 Legenda</div></div>
            <div className="rw-b" style={{ padding:"10px 14px" }}>
              <div className="leg-grid">
                {EVENT_TYPE_LIST.map(t => (
                  <div key={t.id} className="leg-item"
                    style={{ opacity: ft && ft!==t.id ? 0.35 : 1 }}
                    onClick={() => setFt(ft===t.id ? null : t.id)}>
                    <div className="leg-dot" style={{ background:t.color }} />
                    <span>{t.label}</span>
                  </div>
                ))}
              </div>
              {ft && (
                <button className="btn-ghost btn-sm" style={{ marginTop:8, width:"100%", justifyContent:"center" }} onClick={()=>setFt(null)}>
                  × Hapus Filter
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showForm && <FormEvent date={sel || fmtKey(cy,cm,1)} onSave={addEvent} onClose={()=>setShowForm(false)} />}
      {toast && <Toast msg={toast} onDone={()=>setToast(null)} />}
    </div>
  );
}
