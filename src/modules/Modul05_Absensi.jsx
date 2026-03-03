import { useState, useEffect } from "react";

// ============================================================
// MOCK DATA
// ============================================================
const STAFF_LIST = [
  { id: "EMP001", nama: "Krisna Mukti", jabatan: "Clean & Service", shift: "Pagi", avatar: "KM", color: "#f97316" },
  { id: "EMP002", nama: "Gurit Yudho", jabatan: "Staf Penjaga Malam", shift: "Sore/Malam", avatar: "GY", color: "#1d4ed8" },
];

// Kode absensi lengkap
const KODE_ABSENSI = {
  P:   { label: "Pagi",             color: "#1d4ed8", bg: "#dbeafe",  short: "P"   },
  M:   { label: "Malam",            color: "#7c3aed", bg: "#ede9fe",  short: "M"   },
  "S/M": { label: "Sore/Malam",     color: "#0d9488", bg: "#ccfbf1",  short: "S/M" },
  OFF: { label: "Libur",            color: "#6b7280", bg: "#f3f4f6",  short: "OFF" },
  L:   { label: "Lembur Malam",     color: "#9333ea", bg: "#f3e8ff",  short: "L"   },
  LL:  { label: "Lembur Lebaran",   color: "#be185d", bg: "#fce7f3",  short: "LL"  },
  "P/L": { label: "Pagi + Lembur",  color: "#0369a1", bg: "#e0f2fe",  short: "P/L" },
  IJ:  { label: "Ijin",             color: "#d97706", bg: "#fef3c7",  short: "IJ"  },
  SKT: { label: "Sakit",            color: "#dc2626", bg: "#fee2e2",  short: "SKT" },
  LS:  { label: "Lembur Tambahan",  color: "#c026d3", bg: "#fae8ff",  short: "LS"  },
  IN:  { label: "Masuk (Checklist)",color: "#16a34a", bg: "#dcfce7",  short: "IN"  },
  "-": { label: "Belum diisi",      color: "#cbd5e1", bg: "#f8fafc",  short: "-"   },
};

// Jadwal absensi Feb 2026
// Format: { staffId: { "YYYY-MM-DD": "KODE" } }
const generateAbsensi = () => {
  const data = { 3: {}, 4: {} };
  // Krisna (pagi): P on weekdays, OFF on weekends
  const krisna = [
    "P","P","P","P","P","OFF","OFF",   // 2-8
    "P","P","P","P","P","OFF","OFF",   // 9-15
    "P","P","P","P","IJ","OFF","OFF",  // 16-22
    "P","P","P","P","P","OFF","OFF",   // 23-28 (hari ini 26)
  ];
  // Gurit (malam): S/M on weekdays, OFF lain
  const gurit = [
    "S/M","S/M","S/M","S/M","S/M","OFF","OFF",
    "S/M","S/M","S/M","S/M","S/M","L","OFF",
    "S/M","S/M","S/M","S/M","S/M","OFF","OFF",
    "S/M","S/M","S/M","S/M","S/M","OFF","OFF",
  ];
  for (let d = 2; d <= 28; d++) {
    const idx = d - 2;
    const key = `2026-02-${String(d).padStart(2,"0")}`;
    if (idx < krisna.length) data[3][key] = krisna[idx];
    if (idx < gurit.length) data[4][key] = gurit[idx];
  }
  return data;
};

const ABSENSI_DATA = generateAbsensi();

// Clock-in log
const CLOCKIN_LOG = [];

// Rekap bulanan
const REKAP = {
  3: { masuk: 19, libur: 4, ijin: 1, sakit: 0, lembur: 0, total: 24 },
  4: { masuk: 19, libur: 5, ijin: 0, sakit: 0, lembur: 1, total: 25 },
};

const TODAY = "2026-02-26";
const KOST_COORD = { lat: -6.2089, lng: 106.8456, radius: 500 }; // 500m radius

// ============================================================
// HELPERS
// ============================================================
const BULAN_LABEL = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Ags","Sep","Okt","Nov","Des"];
const HARI_LABEL  = ["Min","Sen","Sel","Rab","Kam","Jum","Sab"];

const fmtTgl = (str) => {
  if (!str) return "-";
  const d = new Date(str);
  return `${HARI_LABEL[d.getDay()]}, ${d.getDate()} ${BULAN_LABEL[d.getMonth()]} ${d.getFullYear()}`;
};

const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
const getFirstDay   = (y, m) => new Date(y, m, 1).getDay();

// ============================================================
// CSS
// ============================================================
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --or:#f97316; --or-d:#ea580c; --or-dd:#c2410c;
    --or-pale:#fff7ed; --or-light:#ffedd5; --or-mid:#fed7aa;
    --s900:#0f172a; --s800:#1e293b; --s700:#334155; --s600:#475569;
    --s400:#94a3b8; --s200:#e2e8f0; --s100:#f1f5f9; --s50:#f8fafc;
    --white:#fff; --red:#dc2626; --green:#16a34a; --blue:#1d4ed8;
    --amber:#d97706; --teal:#0d9488; --purple:#7c3aed;
  }
  body { font-family:'Plus Jakarta Sans',sans-serif; background:var(--s50); }
  ::-webkit-scrollbar{width:4px;height:4px}
  ::-webkit-scrollbar-thumb{background:var(--s200);border-radius:4px}

  /* ── LAYOUT ── */
  .abs-root { display:grid; grid-template-columns:260px 1fr; gap:16px; min-height:calc(100vh - 130px); }

  /* ── LEFT PANEL ── */
  .abs-left { display:flex; flex-direction:column; gap:12px; }

  /* ── STAFF CARD ── */
  .staff-card {
    background:var(--white); border:1.5px solid var(--s200); border-radius:12px;
    padding:14px; cursor:pointer; transition:all 0.15s; display:flex; align-items:center; gap:12px;
  }
  .staff-card:hover { border-color:var(--or-mid); background:var(--or-pale); }
  .staff-card.active { border-color:var(--or); background:var(--or-pale); box-shadow:0 0 0 3px rgba(249,115,22,0.1); }

  .staff-avatar {
    width:44px; height:44px; border-radius:12px; flex-shrink:0;
    background:linear-gradient(135deg,var(--or),var(--or-d));
    display:flex; align-items:center; justify-content:center;
    font-size:14px; font-weight:800; color:#fff;
  }
  .staff-name { font-size:13px; font-weight:700; color:var(--s800); }
  .staff-role { font-size:11px; color:var(--s400); margin-top:2px; }
  .staff-shift-badge { margin-top:4px; }

  /* ── REKAP CARD ── */
  .rekap-card { background:var(--white); border:1px solid var(--s200); border-radius:12px; overflow:hidden; }
  .rekap-header { padding:12px 14px; border-bottom:1px solid var(--s100); }
  .rekap-title { font-size:11px; font-weight:700; color:var(--s400); text-transform:uppercase; letter-spacing:0.8px; }
  .rekap-body { padding:12px 14px; }
  .rekap-row { display:flex; justify-content:space-between; align-items:center; padding:6px 0; border-bottom:1px solid var(--s100); }
  .rekap-row:last-child { border-bottom:none; }
  .rekap-label { font-size:12px; color:var(--s600); font-weight:500; display:flex; align-items:center; gap:6px; }
  .rekap-val { font-size:14px; font-weight:800; }

  /* ── RIGHT PANEL ── */
  .abs-right { display:flex; flex-direction:column; gap:14px; }

  /* ── TOPBAR ── */
  .abs-topbar { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; }
  .month-nav { display:flex; align-items:center; gap:8px; }
  .month-btn { background:var(--s100); border:1px solid var(--s200); border-radius:7px; padding:5px 10px; cursor:pointer; font-size:14px; color:var(--s600); transition:all 0.12s; }
  .month-btn:hover { background:var(--s200); }
  .month-label { font-size:14px; font-weight:800; color:var(--s800); min-width:120px; text-align:center; }

  /* ── CALENDAR ABSENSI ── */
  .abs-cal { background:var(--white); border:1px solid var(--s200); border-radius:12px; overflow:hidden; }
  .abs-cal-header { display:grid; grid-template-columns:repeat(7,1fr); border-bottom:1px solid var(--s100); }
  .abs-cal-dayname { padding:8px 4px; text-align:center; font-size:9px; font-weight:700; color:var(--s400); text-transform:uppercase; letter-spacing:0.8px; }

  .abs-cal-grid { display:grid; grid-template-columns:repeat(7,1fr); }
  .abs-cal-cell {
    border-right:1px solid var(--s100); border-bottom:1px solid var(--s100);
    min-height:72px; padding:6px; position:relative; cursor:pointer;
    transition:background 0.1s;
  }
  .abs-cal-cell:nth-child(7n) { border-right:none; }
  .abs-cal-cell:hover { background:var(--or-pale); }
  .abs-cal-cell.empty { background:var(--s50); cursor:default; }
  .abs-cal-cell.today { background:var(--or-pale); }
  .abs-cal-cell.selected { background:#fff7ed; box-shadow:inset 0 0 0 2px var(--or); }

  .cell-date {
    font-size:12px; font-weight:700; color:var(--s700); width:22px; height:22px;
    display:flex; align-items:center; justify-content:center; border-radius:50%; margin-bottom:4px;
  }
  .today .cell-date { background:var(--or); color:#fff; }

  .cell-badges { display:flex; flex-direction:column; gap:2px; }
  .cell-badge {
    padding:1px 5px; border-radius:3px; font-size:9px; font-weight:700;
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
  }

  /* ── KODE LEGEND ── */
  .legend-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:6px; padding:12px 14px; }
  .legend-item { display:flex; align-items:center; gap:6px; }
  .legend-dot { width:8px; height:8px; border-radius:2px; flex-shrink:0; }
  .legend-text { font-size:10px; color:var(--s600); font-weight:500; }

  /* ── DETAIL PANEL SLIDE ── */
  .detail-overlay { position:fixed; inset:0; background:rgba(15,23,42,0.5); display:flex; align-items:flex-start; justify-content:flex-end; z-index:100; backdrop-filter:blur(2px); animation:fadeIn 0.2s ease; }
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  .detail-panel { background:var(--white); width:400px; height:100vh; overflow-y:auto; box-shadow:-8px 0 40px rgba(0,0,0,0.12); animation:slideIn 0.25s cubic-bezier(0.25,0.46,0.45,0.94); display:flex; flex-direction:column; }
  @keyframes slideIn{from{transform:translateX(30px);opacity:0}to{transform:translateX(0);opacity:1}}
  .dp-header { padding:18px 20px 14px; border-bottom:1px solid var(--s100); }
  .dp-body { padding:18px 20px; flex:1; }
  .dp-footer { padding:14px 20px; border-top:1px solid var(--s100); }

  /* ── SELECT KODE ── */
  .kode-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:6px; margin-bottom:12px; }
  .kode-btn {
    padding:7px 4px; border-radius:8px; border:1.5px solid var(--s200); background:var(--white);
    cursor:pointer; text-align:center; transition:all 0.12s; font-family:'Plus Jakarta Sans',sans-serif;
  }
  .kode-btn:hover { border-color:var(--or-mid); }
  .kode-btn.selected { border-color:var(--or); background:var(--or-pale); }
  .kode-short { font-size:12px; font-weight:800; }
  .kode-full  { font-size:9px; color:var(--s400); margin-top:1px; }

  /* ── CLOCK-IN SECTION ── */
  .clockin-card { background:var(--white); border:1px solid var(--s200); border-radius:12px; overflow:hidden; }
  .clockin-header { padding:12px 16px; border-bottom:1px solid var(--s100); display:flex; align-items:center; justify-content:space-between; }
  .clockin-title { font-size:12px; font-weight:800; color:var(--s800); }
  .clockin-body { padding:14px 16px; }

  .log-row { display:flex; align-items:center; gap:10px; padding:9px 0; border-bottom:1px solid var(--s100); }
  .log-row:last-child { border-bottom:none; }
  .log-time { font-family:'JetBrains Mono',monospace; font-size:13px; font-weight:600; color:var(--or-d); min-width:44px; }
  .log-staff { font-size:12px; font-weight:600; color:var(--s800); }
  .log-meta { font-size:11px; color:var(--s400); margin-top:1px; }
  .log-status { margin-left:auto; flex-shrink:0; }

  /* ── STAFF VIEW (clock-in UI) ── */
  .staff-view { display:flex; flex-direction:column; gap:16px; }

  .clockin-big {
    background:linear-gradient(135deg,var(--s900),#1a0a00);
    border-radius:16px; padding:24px; text-align:center; color:#fff;
    position:relative; overflow:hidden;
  }
  .clockin-big::before {
    content:''; position:absolute; top:-60px; right:-60px;
    width:200px; height:200px; border-radius:50%;
    background:radial-gradient(circle,rgba(249,115,22,0.2),transparent);
  }
  .cb-time { font-size:44px; font-weight:800; font-family:'JetBrains Mono',monospace; letter-spacing:2px; }
  .cb-date { font-size:13px; color:rgba(255,255,255,0.5); margin-top:4px; margin-bottom:20px; }
  .cb-status { font-size:12px; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.12); border-radius:20px; padding:5px 14px; display:inline-block; margin-bottom:20px; }
  .cb-status.done { color:#86efac; background:rgba(22,163,74,0.15); border-color:rgba(22,163,74,0.3); }
  .cb-gps { font-size:11px; color:rgba(255,255,255,0.35); margin-top:8px; }

  .clockin-btn-big {
    width:100%; padding:14px; border-radius:12px;
    background:linear-gradient(135deg,var(--or),var(--or-d)); color:#fff;
    border:none; font-size:16px; font-weight:800; cursor:pointer;
    font-family:'Plus Jakarta Sans',sans-serif; transition:all 0.2s;
    box-shadow:0 4px 20px rgba(249,115,22,0.4); position:relative; z-index:1;
  }
  .clockin-btn-big:hover { filter:brightness(1.05); box-shadow:0 8px 28px rgba(249,115,22,0.5); }
  .clockin-btn-big:disabled { opacity:0.5; cursor:not-allowed; }
  .clockin-btn-big.done { background:linear-gradient(135deg,#16a34a,#15803d); box-shadow:0 4px 20px rgba(22,163,74,0.35); }

  /* ── MY SCHEDULE ── */
  .my-schedule { background:var(--white); border:1px solid var(--s200); border-radius:12px; overflow:hidden; }
  .ms-header { padding:12px 16px; border-bottom:1px solid var(--s100); display:flex; align-items:center; justify-content:space-between; }
  .ms-title { font-size:12px; font-weight:800; color:var(--s800); }

  .ms-week { display:flex; gap:6px; padding:12px 16px; overflow-x:auto; }
  .ms-day {
    flex-shrink:0; text-align:center; padding:10px 8px; border-radius:10px;
    border:1.5px solid var(--s200); min-width:52px; cursor:default;
    transition:all 0.12s;
  }
  .ms-day.today { border-color:var(--or); background:var(--or-pale); }
  .ms-day.off { opacity:0.4; }
  .ms-day-label { font-size:9px; font-weight:700; color:var(--s400); text-transform:uppercase; margin-bottom:3px; }
  .ms-day.today .ms-day-label { color:var(--or-d); }
  .ms-day-num { font-size:15px; font-weight:800; color:var(--s800); margin-bottom:4px; }
  .ms-day-kode { font-size:10px; font-weight:700; padding:2px 5px; border-radius:4px; }

  /* ── LEMBUR FORM ── */
  .lembur-card { background:var(--white); border:1px solid var(--s200); border-radius:12px; padding:14px; }
  .lc-title { font-size:11px; font-weight:700; color:var(--s400); text-transform:uppercase; letter-spacing:0.8px; margin-bottom:10px; }
  .lc-row { display:flex; gap:8px; align-items:center; }
  .lc-input { flex:1; background:var(--s50); border:1.5px solid var(--s200); border-radius:8px; padding:8px 12px; font-size:13px; color:var(--s800); font-family:'Plus Jakarta Sans',sans-serif; outline:none; }
  .lc-input:focus { border-color:var(--or); }

  /* ── BUTTON ── */
  .btn-primary { background:linear-gradient(135deg,var(--or),var(--or-d)); color:#fff; border:none; border-radius:8px; padding:8px 18px; font-size:13px; font-weight:700; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all 0.15s; box-shadow:0 2px 8px rgba(249,115,22,0.25); display:inline-flex; align-items:center; gap:6px; }
  .btn-primary:hover { filter:brightness(1.05); }
  .btn-ghost { background:var(--s100); color:var(--s700); border:1px solid var(--s200); border-radius:8px; padding:8px 14px; font-size:12px; font-weight:600; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all 0.15s; display:inline-flex; align-items:center; gap:6px; }
  .btn-ghost:hover { background:var(--s200); }

  /* ── BADGE ── */
  .badge { display:inline-flex; align-items:center; padding:2px 8px; border-radius:20px; font-size:10px; font-weight:700; white-space:nowrap; }

  /* ── TOAST ── */
  .toaster { position:fixed; bottom:24px; left:50%; transform:translateX(-50%); background:var(--s900); color:#fff; padding:10px 20px; border-radius:30px; font-size:13px; font-weight:600; z-index:999; box-shadow:0 8px 24px rgba(0,0,0,0.3); animation:toastIn 0.25s ease; }
  @keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}

  /* ── SECTION DIVIDER ── */
  .sec-div { font-size:10px; font-weight:700; color:var(--s400); text-transform:uppercase; letter-spacing:1px; padding-bottom:8px; border-bottom:1px solid var(--s100); margin-bottom:12px; }

  @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  .fade-up{animation:fadeUp 0.25s ease forwards}

  /* ── NO STAFF ── */
  .no-sel { display:flex; flex-direction:column; align-items:center; justify-content:center; height:300px; color:var(--s400); text-align:center; }

  /* ── KPI BARS ── */
  .kpi-card { background:var(--white); border:1px solid var(--s200); border-radius:12px; padding:14px; }
  .kpi-title { font-size:11px; font-weight:700; color:var(--s400); text-transform:uppercase; letter-spacing:0.8px; margin-bottom:12px; }
  .kpi-row { margin-bottom:10px; }
  .kpi-label-row { display:flex; justify-content:space-between; margin-bottom:5px; }
  .kpi-label { font-size:12px; font-weight:600; color:var(--s700); }
  .kpi-val { font-size:12px; font-weight:800; }
  .kpi-bar { height:8px; background:var(--s100); border-radius:4px; overflow:hidden; }
  .kpi-fill { height:100%; border-radius:4px; transition:width 0.4s ease; }

  /* ── INPUT ABSENSI ── */
  .field-label { font-size:11px; font-weight:700; color:var(--s600); text-transform:uppercase; letter-spacing:0.5px; display:block; margin-bottom:6px; }
  .field-input { width:100%; background:var(--s50); border:1.5px solid var(--s200); border-radius:8px; padding:8px 12px; font-size:13px; color:var(--s800); font-family:'Plus Jakarta Sans',sans-serif; outline:none; transition:all 0.15s; }
  .field-input:focus { border-color:var(--or); }
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

// ============================================================
// LIVE CLOCK
// ============================================================
function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`;
}

// ============================================================
// TOAST
// ============================================================
function Toast({ msg, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2000); return () => clearTimeout(t); }, []);
  return <div className="toaster">{msg}</div>;
}

// ============================================================
// DETAIL PANEL — edit 1 hari absensi
// ============================================================
function DetailPanel({ staffId, tanggal, currentKode, onClose, onSave }) {
  const [kode, setKode] = useState(currentKode || "-");
  const [lembur, setLembur] = useState("");
  const staff = STAFF_LIST.find(s => s.id === staffId);

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-panel" onClick={e => e.stopPropagation()}>
        <div className="dp-header">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "var(--s900)" }}>Edit Absensi</div>
              <div style={{ fontSize: 12, color: "var(--s400)", marginTop: 2 }}>
                {staff?.name} · {fmtTgl(tanggal)}
              </div>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "var(--s400)", padding: 4 }}>✕</button>
          </div>
        </div>

        <div className="dp-body">
          <div className="sec-div">Kode Absensi</div>
          <div className="kode-grid">
            {Object.entries(KODE_ABSENSI).map(([k, v]) => (
              <div key={k}
                className={`kode-btn ${kode === k ? "selected" : ""}`}
                onClick={() => setKode(k)}
                style={{ borderColor: kode === k ? v.color : undefined }}>
                <div className="kode-short" style={{ color: v.color }}>{v.short}</div>
                <div className="kode-full">{v.label}</div>
              </div>
            ))}
          </div>

          {(kode === "L" || kode === "LS" || kode === "LL" || kode === "P/L") && (
            <>
              <div className="sec-div" style={{ marginTop: 16 }}>Nominal Lembur Tambahan</div>
              <div>
                <label className="field-label">Nominal (Rp)</label>
                <input className="field-input" type="number" placeholder="50000" value={lembur} onChange={e => setLembur(e.target.value)} />
                <div style={{ fontSize: 11, color: "var(--s400)", marginTop: 4 }}>Rp 50.000/shift standar · kosongkan jika LS/nominal manual</div>
              </div>
            </>
          )}

          <div style={{ marginTop: 16, background: "var(--s50)", borderRadius: 9, padding: "10px 12px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--s400)", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Preview</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: KODE_ABSENSI[kode]?.color }}>{kode}</span>
              <span style={{ fontSize: 13, color: "var(--s600)" }}>{KODE_ABSENSI[kode]?.label}</span>
            </div>
          </div>
        </div>

        <div className="dp-footer">
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn-ghost" onClick={onClose}>Batal</button>
            <button className="btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={() => onSave(kode, lembur)}>
              Simpan Absensi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ADMIN VIEW
// ============================================================
function AdminView() {
  const [selectedStaff, setSelectedStaff] = useState(STAFF_LIST[0].id);
  const [month, setMonth] = useState({ y: 2026, m: 1 }); // Feb = m:1
  const [absensi, setAbsensi] = useState(ABSENSI_DATA);
  const [editCell, setEditCell] = useState(null); // { tanggal }
  const [toast, setToast] = useState(null);
  const [lemburAmt, setLemburAmt] = useState({ 3: "", 4: "" });

  const staff = STAFF_LIST.find(s => s.id === selectedStaff);
  const rekap = REKAP[selectedStaff] || {};
  const staffAbsensi = absensi[selectedStaff] || {};

  const days = getDaysInMonth(month.y, month.m);
  const firstDay = getFirstDay(month.y, month.m);

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(d);

  const fmtKey = (d) => `${month.y}-${String(month.m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const todayKey = TODAY;

  const handleSaveAbsensi = (kode, lemburVal) => {
    const key = fmtKey(editCell);
    setAbsensi(prev => ({
      ...prev,
      [selectedStaff]: { ...prev[selectedStaff], [key]: kode },
    }));
    if (lemburVal) {
      setToast(`✓ Absensi disimpan · Lembur Rp ${Number(lemburVal).toLocaleString("id-ID")} dicatat`);
    } else {
      setToast(`✓ Absensi ${kode} disimpan`);
    }
    setEditCell(null);
  };

  const handleLembur = (staffId) => {
    const amt = lemburAmt[staffId];
    if (!amt) return;
    setToast(`✓ Lembur tambahan Rp ${Number(amt).toLocaleString("id-ID")} untuk ${STAFF_LIST.find(s => s.id === staffId)?.name.split(" ")[0]} dicatat`);
    setLemburAmt(prev => ({ ...prev, [staffId]: "" }));
  };

  // Hitung rekap dinamis dari data
  const hitungRekap = (staffId) => {
    const data = absensi[staffId] || {};
    const vals = Object.values(data);
    return {
      masuk: vals.filter(v => v === "P" || v === "S/M" || v === "M" || v === "IN").length,
      lembur: vals.filter(v => v === "L" || v === "LS" || v === "LL" || v === "P/L").length,
      ijin: vals.filter(v => v === "IJ").length,
      sakit: vals.filter(v => v === "SKT").length,
      libur: vals.filter(v => v === "OFF").length,
    };
  };

  const rekapDyn = hitungRekap(selectedStaff);
  const totalHariKerja = rekapDyn.masuk + rekapDyn.lembur;
  const kpiAbsensi = Math.round((totalHariKerja / 24) * 100); // target 24 hari

  return (
    <div className="fade-up">
      {/* TOP */}
      <div className="abs-topbar" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--s400)", textTransform: "uppercase", letterSpacing: 1 }}>
          Absensi & Jadwal Staff
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div className="month-nav">
            <button className="month-btn" onClick={() => setMonth(p => p.m === 0 ? { y: p.y - 1, m: 11 } : { y: p.y, m: p.m - 1 })}>‹</button>
            <div className="month-label">{BULAN_LABEL[month.m].toUpperCase()} {month.y}</div>
            <button className="month-btn" onClick={() => setMonth(p => p.m === 11 ? { y: p.y + 1, m: 0 } : { y: p.y, m: p.m + 1 })}>›</button>
          </div>
          <button className="btn-primary">↓ Export PDF</button>
        </div>
      </div>

      <div className="abs-root">
        {/* LEFT */}
        <div className="abs-left">
          {/* Staff cards */}
          {STAFF_LIST.map(s => (
            <div key={s.id} className={`staff-card ${selectedStaff === s.id ? "active" : ""}`} onClick={() => setSelectedStaff(s.id)}>
              <div className="staff-avatar">{s.avatar}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="staff-name">{s.name}</div>
                <div className="staff-role">{s.jabatan}</div>
                <div className="staff-shift-badge">
                  <span className="badge" style={{ color: "var(--blue)", background: "#dbeafe", marginTop: 4 }}>
                    {s.shift}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Rekap bulanan */}
          <div className="rekap-card">
            <div className="rekap-header">
              <div className="rekap-title">Rekap {BULAN_LABEL[month.m]} {month.y}</div>
              {staff && <div style={{ fontSize: 11, color: "var(--s600)", marginTop: 2 }}>{staff.name.split(" ")[0]}</div>}
            </div>
            <div className="rekap-body">
              {[
                { label: "Hari Masuk", val: rekapDyn.masuk, color: "var(--green)", icon: "✓" },
                { label: "Hari Lembur", val: rekapDyn.lembur, color: "var(--purple)", icon: "⏰" },
                { label: "Ijin", val: rekapDyn.ijin, color: "var(--amber)", icon: "IJ" },
                { label: "Sakit", val: rekapDyn.sakit, color: "var(--red)", icon: "🤒" },
                { label: "Libur / OFF", val: rekapDyn.libur, color: "var(--s400)", icon: "—" },
              ].map(r => (
                <div key={r.label} className="rekap-row">
                  <div className="rekap-label">
                    <span style={{ fontSize: 11, fontWeight: 700, width: 22, color: r.color }}>{r.icon}</span>
                    {r.label}
                  </div>
                  <div className="rekap-val" style={{ color: r.color }}>{r.val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* KPI */}
          <div className="kpi-card">
            <div className="kpi-title">KPI Absensi</div>
            <div className="kpi-row">
              <div className="kpi-label-row">
                <span className="kpi-label">Kehadiran</span>
                <span className="kpi-val" style={{ color: kpiAbsensi >= 90 ? "var(--green)" : "var(--amber)" }}>
                  {kpiAbsensi}%
                </span>
              </div>
              <div className="kpi-bar">
                <div className="kpi-fill" style={{ width: kpiAbsensi + "%", background: kpiAbsensi >= 90 ? "linear-gradient(90deg,#16a34a,#15803d)" : "linear-gradient(90deg,var(--amber),#b45309)" }} />
              </div>
            </div>
            <div style={{ fontSize: 11, color: "var(--s400)", marginTop: 4 }}>Target: min. 90% · {totalHariKerja}/24 hari kerja</div>
          </div>

          {/* Input Lembur Tambahan */}
          <div className="lembur-card">
            <div className="lc-title">Input Lembur Tambahan</div>
            {STAFF_LIST.map(s => (
              <div key={s.id} style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--s600)", marginBottom: 4 }}>{s.name.split(" ")[0]}</div>
                <div className="lc-row">
                  <input className="lc-input" type="number" placeholder="Nominal Rp" value={lemburAmt[s.id] || ""} onChange={e => setLemburAmt(p => ({ ...p, [s.id]: e.target.value }))} />
                  <button className="btn-primary" style={{ padding: "8px 12px", fontSize: 12 }} onClick={() => handleLembur(s.id)}>Catat</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="abs-right">
          {/* Calendar */}
          <div className="abs-cal">
            <div className="abs-cal-header">
              {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map(d => (
                <div key={d} className="abs-cal-dayname">{d}</div>
              ))}
            </div>
            <div className="abs-cal-grid">
              {cells.map((day, i) => {
                if (!day) return <div key={`e${i}`} className="abs-cal-cell empty" />;
                const key = fmtKey(day);
                const isT = key === todayKey;
                const kode = staffAbsensi[key] || "-";
                const cfg = KODE_ABSENSI[kode] || KODE_ABSENSI["-"];
                const isFut = key > todayKey;

                return (
                  <div key={day}
                    className={`abs-cal-cell ${isT ? "today" : ""}`}
                    onClick={() => !isFut && setEditCell(day)}>
                    <div className="cell-date">{day}</div>
                    <div className="cell-badges">
                      {kode !== "-" && (
                        <div className="cell-badge" style={{ color: cfg.color, background: cfg.bg }}>
                          {cfg.short}
                        </div>
                      )}
                      {isFut && (
                        <div className="cell-badge" style={{ color: "var(--s200)", background: "var(--s50)" }}>—</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Clock-in Log */}
          <div className="clockin-card">
            <div className="clockin-header">
              <div className="clockin-title">⏱ Log Clock-in</div>
              <span className="badge" style={{ color: "var(--green)", background: "#dcfce7" }}>GPS Verified</span>
            </div>
            <div className="clockin-body">
              {CLOCKIN_LOG.map((log, i) => {
                const s = STAFF_LIST.find(x => x.id === log.staffId);
                return (
                  <div key={i} className="log-row">
                    <div className="log-time">{log.jam || "—"}</div>
                    <div>
                      <div className="log-staff">{s?.name.split(" ")[0]}</div>
                      <div className="log-meta">{log.tanggal} · {log.status === "valid" ? `${log.lat?.toFixed(4)}, ${log.lng?.toFixed(4)}` : "Tidak hadir"}</div>
                    </div>
                    <div className="log-status">
                      {log.status === "valid"
                        ? <span className="badge" style={{ color: "var(--green)", background: "#dcfce7" }}>✓ Valid</span>
                        : <span className="badge" style={{ color: "var(--red)", background: "#fee2e2" }}>Absen</span>
                      }
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legenda Kode */}
          <div style={{ background: "var(--white)", border: "1px solid var(--s200)", borderRadius: 12, padding: "12px 14px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--s400)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>Legenda Kode Absensi</div>
            <div className="legend-grid">
              {Object.entries(KODE_ABSENSI).filter(([k]) => k !== "-").map(([k, v]) => (
                <div key={k} className="legend-item">
                  <div className="legend-dot" style={{ background: v.color }} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: v.color, minWidth: 28 }}>{k}</span>
                  <span className="legend-text">{v.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detail panel */}
      {editCell && (
        <DetailPanel
          staffId={selectedStaff}
          tanggal={fmtKey(editCell)}
          currentKode={staffAbsensi[fmtKey(editCell)] || "-"}
          onClose={() => setEditCell(null)}
          onSave={handleSaveAbsensi}
        />
      )}

      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </div>
  );
}

// ============================================================
// STAFF VIEW (tampilan personal untuk staff)
// ============================================================
function StaffView({ user }) {
  const [clockedIn, setClockedIn] = useState(true); // mock: sudah clock-in hari ini
  const [toast, setToast] = useState(null);
  const [locStatus, setLocStatus] = useState("valid"); // valid | checking | out-of-range

  const timeStr = LiveClock();
  const staffId = user?.id || 3;
  const staffData = STAFF_LIST.find(s => s.id === staffId) || STAFF_LIST[0];
  const myAbsensi = ABSENSI_DATA[staffData.id] || {};

  // Ambil 7 hari (minggu ini)
  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date("2026-02-23");
    d.setDate(d.getDate() + i);
    const key = d.toISOString().split("T")[0];
    weekDays.push({ key, day: d.getDate(), label: HARI_LABEL[d.getDay()], kode: myAbsensi[key] || "-" });
  }

  const handleClockIn = () => {
    setLocStatus("checking");
    setTimeout(() => {
      setLocStatus("valid");
      setClockedIn(true);
      setToast("✓ Clock-in berhasil · GPS terverifikasi · 07:58");
    }, 1500);
  };

  const rekap = REKAP[staffData.id] || {};
  const myLog = CLOCKIN_LOG.filter(l => l.staffId === staffData.id);

  return (
    <div className="staff-view fade-up">
      {/* Big clock-in card */}
      <div className="clockin-big">
        <div className="cb-time">{timeStr}</div>
        <div className="cb-date">{fmtTgl(TODAY)}</div>

        <div className={`cb-status ${clockedIn ? "done" : ""}`}>
          {clockedIn ? "✓ Sudah Clock-in pukul 07:58" : "Belum Clock-in"}
        </div>

        {!clockedIn && (
          <button
            className={`clockin-btn-big ${clockedIn ? "done" : ""}`}
            onClick={handleClockIn}
            disabled={locStatus === "checking"}>
            {locStatus === "checking" ? "⏳ Mengecek GPS..." : "⏱ Clock-in Sekarang"}
          </button>
        )}
        {clockedIn && (
          <button className="clockin-btn-big done" disabled>✓ Sudah Clock-in Hari Ini</button>
        )}
        <div className="cb-gps">
          {clockedIn ? "📍 GPS terverifikasi · dalam radius 500m dari kost" : "📍 Pastikan kamu dalam radius 500m dari Senyum Inn"}
        </div>
      </div>

      {/* Jadwal minggu ini */}
      <div className="my-schedule">
        <div className="ms-header">
          <div className="ms-title">Jadwal Minggu Ini</div>
          <span className="badge" style={{ color: "var(--blue)", background: "#dbeafe" }}>{staffData.shift}</span>
        </div>
        <div className="ms-week">
          {weekDays.map(d => {
            const cfg = KODE_ABSENSI[d.kode] || KODE_ABSENSI["-"];
            const isT = d.key === TODAY;
            const isOff = d.kode === "OFF" || d.kode === "-";
            return (
              <div key={d.key} className={`ms-day ${isT ? "today" : ""} ${isOff ? "off" : ""}`}>
                <div className="ms-day-label">{d.label}</div>
                <div className="ms-day-num">{d.day}</div>
                <div className="ms-day-kode" style={{ color: cfg.color, background: cfg.bg }}>{d.kode}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid rekap personal */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ background: "var(--white)", border: "1px solid var(--s200)", borderRadius: 12, padding: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--s400)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 12 }}>Rekap Feb 2026</div>
          {[
            { label: "Hari Masuk", val: rekap.masuk, color: "var(--green)" },
            { label: "Lembur", val: rekap.lembur, color: "var(--purple)" },
            { label: "Ijin", val: rekap.ijin, color: "var(--amber)" },
            { label: "Libur", val: rekap.libur, color: "var(--s400)" },
          ].map(r => (
            <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid var(--s100)" }}>
              <span style={{ fontSize: 12, color: "var(--s600)" }}>{r.label}</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: r.color }}>{r.val}</span>
            </div>
          ))}
        </div>

        <div style={{ background: "var(--white)", border: "1px solid var(--s200)", borderRadius: 12, padding: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--s400)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 12 }}>Log Clock-in Terakhir</div>
          {myLog.slice(0, 4).map((log, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid var(--s100)" }}>
              <div>
                <div style={{ fontSize: 11, color: "var(--s600)" }}>{log.tanggal}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                {log.jam
                  ? <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", color: "var(--or-d)" }}>{log.jam}</div>
                  : <span className="badge" style={{ color: "var(--red)", background: "#fee2e2" }}>Absen</span>
                }
              </div>
            </div>
          ))}
        </div>
      </div>

      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </div>
  );
}

// ============================================================
// ROOT EXPORT
// ============================================================
export default function AbsensiJadwal({ userRole = "admin", user = null }) {
  return (
    <>
      <StyleInjector />
      {userRole === "admin" ? <AdminView /> : <StaffView user={user} />}
    </>
  );
}
