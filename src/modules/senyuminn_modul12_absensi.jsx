import { useState, useEffect } from "react";

// ============================================================
// MOCK DATA
// ============================================================
const STAFF_LIST = [
  { id: "EMP001", nama: "Muh. Krisna Mukti",   jabatan: "Clean & Service",         shift: "Pagi",       gajiPokok: 1800000 },
  { id: "EMP002", nama: "Gurit Yudho Anggoro", jabatan: "Staf Penjaga Malam",      shift: "Sore/Malam", gajiPokok: 2100000 },
  { id: "EMP003", nama: "Rina Manajemen",      jabatan: "Super Admin / Manajemen", shift: "Pagi",       gajiPokok: 3500000 },
];

// ── KODE ABSENSI LENGKAP ─────────────────────────────────────
const KODE_CFG = {
  P:   { label: "Pagi",              color: "#1d4ed8", bg: "#dbeafe", singkat: "P",   hitung: "masuk",          ket: "Shift pagi 08:00–16:00" },
  SM:  { label: "Sore/Malam",        color: "#0d9488", bg: "#ccfbf1", singkat: "S/M", hitung: "masuk",          ket: "Shift sore/malam 16:00–07:00" },
  M:   { label: "Malam",             color: "#7c3aed", bg: "#ede9fe", singkat: "M",   hitung: "masuk",          ket: "Shift malam" },
  OFF: { label: "Libur",             color: "#94a3b8", bg: "#f1f5f9", singkat: "OFF", hitung: "libur",          ket: "Hari libur / off" },
  // ── LEMBUR BIASA (Rp 50.000/shift) ──
  L:   { label: "Lembur Malam",      color: "#f97316", bg: "#ffedd5", singkat: "L",   hitung: "lembur_biasa",   ket: "Lembur malam di hari libur — Rp 50.000/shift" },
  PL:  { label: "Pagi + Lembur",     color: "#2563eb", bg: "#dbeafe", singkat: "P/L", hitung: "lembur_biasa",   ket: "Masuk pagi 08:00–16:00 lalu lanjut lembur malam — Rp 50.000" },
  SML: { label: "S/M + Lembur Pagi", color: "#0891b2", bg: "#cffafe", singkat: "S/L", hitung: "lembur_biasa",   ket: "Shift S/M 16:00–07:00 lanjut lembur pagi (jam dicatat manual)" },
  // ── LEMBUR LEBARAN (Rp 150.000/shift) ──
  LL:  { label: "Lembur Lebaran",    color: "#ea580c", bg: "#fff7ed", singkat: "LL",  hitung: "lembur_lebaran", ket: "Lembur Idul Fitri — Rp 150.000/shift (3×). Hari ditentukan owner" },
  // ── IJIN & LAINNYA ──
  IJ:  { label: "Ijin",              color: "#d97706", bg: "#fef3c7", singkat: "IJ",  hitung: "ijin",           ket: "Ijin resmi disetujui PJ" },
  SKT: { label: "Sakit",             color: "#64748b", bg: "#f1f5f9", singkat: "SKT", hitung: "sakit",          ket: "Sakit dengan/tanpa surat" },
  IN:  { label: "Masuk",             color: "#16a34a", bg: "#dcfce7", singkat: "IN",  hitung: "masuk",          ket: "Masuk kerja (checklist)" },
  IJT: { label: "Ijin Tidak Sah",    color: "#dc2626", bg: "#fee2e2", singkat: "IJS", hitung: "ijin_ts",        ket: "Tanpa kabar / melebihi 3 hari — potong Rp 50.000/hari" },
};

// Nominal lembur — bisa diubah di Pengaturan
const NOMINAL_LEMBUR = { biasa: 50000, lebaran: 150000 };

// ── DATA ABSENSI ─────────────────────────────────────────────
const ABSENSI_INIT = {
  EMP001: { 1:"P",2:"P",3:"P",4:"P",5:"P",6:"P",7:"OFF", 8:"P",9:"P",10:"P",11:"P",12:"P",13:"P",14:"OFF", 15:"P",16:"P",17:"P",18:"P",19:"P",20:"PL",21:"OFF", 22:"P",23:"P",24:"P",25:"P",26:"P",27:"L",28:"OFF" },
  EMP002: { 1:"SM",2:"SM",3:"SM",4:"SM",5:"SM",6:"SM",7:"OFF", 8:"SML",9:"SM",10:"IJ",11:"SM",12:"SM",13:"SM",14:"OFF", 15:"SKT",16:"SM",17:"SM",18:"SM",19:"SML",20:"SM",21:"OFF", 22:"IJT",23:"SM",24:"SM",25:"SM",26:"SM",27:"SM",28:"OFF" },
  EMP003: { 1:"P",2:"P",3:"P",4:"P",5:"P",6:"P",7:"OFF", 8:"P",9:"P",10:"P",11:"P",12:"P",13:"P",14:"OFF", 15:"P",16:"P",17:"P",18:"P",19:"P",20:"P",21:"OFF", 22:"P",23:"P",24:"P",25:"P",26:"P",27:"P",28:"OFF" },
};

// ── LEMBUR TAMBAHAN ──────────────────────────────────────────
// Lembur fleksibel: perbaikan dadakan, weekly di luar jam, check-in darurat, dll
const LEMBUR_TAMBAHAN_INIT = [
  { id:"LT001", staffId:"EMP002", tanggal:"2026-02-08", jam:3,   nominal:75000,  kategori:"Perbaikan",       keterangan:"Benerin AC bocor Kamar 9 setelah shift SM selesai jam 07:00" },
  { id:"LT002", staffId:"EMP001", tanggal:"2026-02-13", jam:2,   nominal:50000,  kategori:"Weekly Dadakan",  keterangan:"Weekly service Kamar 11 — penghuni baru minta service sore hari" },
  { id:"LT003", staffId:"EMP002", tanggal:"2026-02-19", jam:2,   nominal:50000,  kategori:"Perbaikan",       keterangan:"Cek kebocoran pipa Lt 2 setelah laporan penghuni" },
  { id:"LT004", staffId:"EMP001", tanggal:"2026-02-26", jam:1.5, nominal:37500,  kategori:"Check-in Darurat",keterangan:"Check-in Kamar 11 — penghuni datang di luar jam kerja" },
];

const KATEGORI_LIST = ["Perbaikan", "Weekly Dadakan", "Check-in Darurat", "Jaga Darurat", "Lainnya"];
// Periode dinamis — semua bulan di tahun berjalan s/d bulan ini
const BULAN_LIST = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
function getPeriodeList() {
  const now    = new Date();
  const tahun  = now.getFullYear();
  const bulanIni = now.getMonth(); // 0-indexed
  const result = [];
  for (let b = bulanIni; b >= 0; b--) {
    result.push({ label: `${BULAN_LIST[b].slice(0,3)} ${tahun}`, bulan: b, tahun });
  }
  return result;
}
const PERIODE_LIST = getPeriodeList();
const HARI_SHORT    = ["Min","Sen","Sel","Rab","Kam","Jum","Sab"];
const fmtRp  = (n) => "Rp " + Math.abs(Number(n||0)).toLocaleString("id-ID");
const fmtJam = (j) => j % 1 === 0 ? `${j} jam` : `${j} jam`;
const getInit = (n) => n.split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase();
const GRAD = ["linear-gradient(135deg,#f97316,#ea580c)","linear-gradient(135deg,#1d4ed8,#1e40af)","linear-gradient(135deg,#0d9488,#0f766e)"];

function getRekap(staffId, absensi, lemburTambahan) {
  const data = absensi[staffId] || {};
  let masuk=0, lembur_biasa=0, lembur_lebaran=0, ijin=0, sakit=0, libur=0, ijin_ts=0;
  Object.values(data).forEach(k => {
    const cfg = KODE_CFG[k]; if (!cfg) return;
    if (cfg.hitung === "masuk")           masuk++;
    if (cfg.hitung === "lembur_biasa")  { masuk++; lembur_biasa++; }
    if (cfg.hitung === "lembur_lebaran"){ masuk++; lembur_lebaran++; }
    if (cfg.hitung === "ijin")            ijin++;
    if (cfg.hitung === "sakit")           sakit++;
    if (cfg.hitung === "libur")           libur++;
    if (cfg.hitung === "ijin_ts")         ijin_ts++;
  });
  const ltStaff    = lemburTambahan.filter(l => l.staffId === staffId);
  const totalJamLT = ltStaff.reduce((s, l) => s + l.jam, 0);
  const nominalLT  = ltStaff.reduce((s, l) => s + l.nominal, 0);
  const nominalLB  = lembur_biasa * NOMINAL_LEMBUR.biasa;
  const nominalLL  = lembur_lebaran * NOMINAL_LEMBUR.lebaran;
  const totalLemburNominal = nominalLB + nominalLL + nominalLT;
  const potonganIjinTs = ijin_ts * 50000;
  // KPI
  const kpiAbsensi = Math.min(Math.round((masuk / 22) * 70), 70);
  const kpiLembur  = Math.min(Math.round(((lembur_biasa + lembur_lebaran) / 3) * 20), 20);
  const kpiJobdesk = staffId === "EMP003" ? 10 : staffId === "EMP001" ? 8 : 5;
  const kpiTotal   = kpiAbsensi + kpiLembur + kpiJobdesk;
  return { masuk, lembur_biasa, lembur_lebaran, ijin, sakit, libur, ijin_ts, totalJamLT, nominalLT, nominalLB, nominalLL, totalLemburNominal, potonganIjinTs, kpiAbsensi, kpiLembur, kpiJobdesk, kpiTotal };
}

function getKPILevel(score) {
  if (score >= 90) return { label:"Excellent", color:"#16a34a", bg:"#dcfce7", insentif:200000 };
  if (score >= 75) return { label:"Good",      color:"#d97706", bg:"#fef3c7", insentif:150000 };
  if (score >= 60) return { label:"Average",   color:"#f97316", bg:"#ffedd5", insentif:75000  };
  return               { label:"Poor",       color:"#dc2626", bg:"#fee2e2", insentif:0      };
}

// ============================================================
// CSS
// ============================================================
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  :root{--or:#f97316;--or-d:#ea580c;--or-pale:#fff7ed;--or-light:#ffedd5;--or-mid:#fed7aa;--s900:#0f172a;--s800:#1e293b;--s700:#334155;--s600:#475569;--s400:#94a3b8;--s200:#e2e8f0;--s100:#f1f5f9;--s50:#f8fafc;--white:#fff;--red:#dc2626;--green:#16a34a;--blue:#1d4ed8;--amber:#d97706;--teal:#0d9488;--purple:#7c3aed}
  body{font-family:'Plus Jakarta Sans',sans-serif;background:var(--s50)}
  ::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-thumb{background:var(--s200);border-radius:4px}
  .topbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;flex-wrap:wrap;gap:10px}
  .periode-sel{background:var(--white);border:1.5px solid var(--s200);border-radius:9px;padding:8px 14px;font-size:13px;font-weight:700;color:var(--s800);font-family:'Plus Jakarta Sans',sans-serif;outline:none;cursor:pointer}
  .stat-row{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-bottom:18px}
  .sc{background:var(--white);border:1px solid var(--s200);border-radius:12px;padding:12px 14px;border-top:3px solid transparent}
  .sc-label{font-size:9px;font-weight:700;color:var(--s400);text-transform:uppercase;letter-spacing:0.7px;margin-bottom:4px}
  .sc-val{font-size:20px;font-weight:800;font-family:'JetBrains Mono',monospace}
  .sc-sub{font-size:10px;color:var(--s400);margin-top:3px}
  .tab-nav{display:flex;gap:4px;background:var(--white);border:1px solid var(--s200);border-radius:12px;padding:4px;margin-bottom:18px}
  .tab-btn{flex:1;padding:8px 6px;border-radius:9px;border:none;font-family:'Plus Jakarta Sans',sans-serif;font-size:11px;font-weight:600;cursor:pointer;transition:all 0.15s;color:var(--s400);background:transparent;display:flex;align-items:center;justify-content:center;gap:5px}
  .tab-btn:hover{color:var(--s700)}
  .tab-btn.active{background:linear-gradient(135deg,var(--or),var(--or-d));color:#fff;box-shadow:0 2px 10px rgba(249,115,22,0.3)}
  .w{background:var(--white);border:1px solid var(--s200);border-radius:12px;overflow:hidden;margin-bottom:14px}
  .wh{padding:11px 16px;border-bottom:1px solid var(--s100);display:flex;align-items:center;justify-content:space-between}
  .wh-title{font-size:12px;font-weight:800;color:var(--s800);display:flex;align-items:center;gap:6px}
  .wb{padding:14px 16px}
  /* CALENDAR GRID */
  .cal-wrap{overflow-x:auto}
  .cal-table{border-collapse:collapse;width:100%;min-width:700px}
  .cal-table th{padding:7px 3px;font-size:9px;font-weight:700;color:var(--s400);text-transform:uppercase;letter-spacing:0.5px;text-align:center;border-bottom:1px solid var(--s200);background:var(--s50);white-space:nowrap}
  .cal-table th.sc{text-align:left;padding-left:14px;width:155px;border-radius:0;padding-top:7px;padding-bottom:7px}
  .cal-table td{padding:4px 2px;text-align:center;border-right:1px solid var(--s100)}
  .cal-table td:last-child{border-right:none}
  .cal-table tr{border-bottom:1px solid var(--s100)}
  .cal-table tr:last-child{border-bottom:none}
  .cal-table tr:hover td{background:var(--or-pale)}
  .staff-cell{display:flex;align-items:center;gap:8px;padding:8px 14px}
  .sma{width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;color:#fff;flex-shrink:0}
  .smn{font-size:12px;font-weight:700;color:var(--s800);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:110px}
  .kb{display:inline-flex;align-items:center;justify-content:center;width:30px;height:22px;border-radius:5px;font-size:8px;font-weight:800;font-family:'JetBrains Mono',monospace;cursor:pointer;transition:all 0.1s;position:relative}
  .kb:hover{transform:scale(1.2);z-index:2}
  .kb-empty{width:30px;height:22px;display:inline-flex;align-items:center;justify-content:center;color:var(--s200);font-size:10px}
  .kb.lembur-ring{box-shadow:0 0 0 1.5px #f97316}
  .kb.lebaran-ring{box-shadow:0 0 0 1.5px #ea580c}
  /* REKAP */
  .rekap-table{width:100%;border-collapse:collapse}
  .rekap-table th{padding:8px 10px;font-size:9px;font-weight:700;color:var(--s400);text-transform:uppercase;letter-spacing:0.5px;background:var(--s50);border-bottom:1px solid var(--s200);text-align:center}
  .rekap-table th:first-child{text-align:left}
  .rekap-table td{padding:10px;text-align:center;border-bottom:1px solid var(--s100);font-size:12px;color:var(--s700)}
  .rekap-table td:first-child{text-align:left}
  .rekap-table tr:last-child td{border-bottom:none}
  .rekap-table tr:hover td{background:var(--or-pale)}
  /* LEMBUR TAMBAHAN */
  .lt-card{display:flex;gap:12px;padding:12px;border-radius:10px;background:var(--s50);border:1px solid var(--s200);margin-bottom:8px;align-items:flex-start;transition:all 0.12s}
  .lt-card:hover{border-color:var(--or-mid);background:var(--or-pale)}
  .lt-icon{width:38px;height:38px;border-radius:10px;background:#fae8ff;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}
  .lt-staff{font-size:11px;font-weight:700;color:var(--s800);margin-bottom:2px}
  .lt-ket{font-size:11px;color:var(--s600);margin-bottom:4px;line-height:1.4}
  .lt-meta{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
  /* FORM MODAL */
  .overlay{position:fixed;inset:0;background:rgba(15,23,42,0.6);display:flex;align-items:center;justify-content:center;z-index:200;backdrop-filter:blur(3px)}
  .mc{background:var(--white);border-radius:16px;width:460px;max-height:90vh;overflow-y:auto;box-shadow:0 24px 60px rgba(0,0,0,0.25);animation:popIn 0.2s cubic-bezier(0.34,1.56,0.64,1)}
  @keyframes popIn{from{transform:scale(0.96) translateY(8px);opacity:0}to{transform:scale(1) translateY(0);opacity:1}}
  .mc-h{padding:16px 22px 12px;border-bottom:1px solid var(--s100);background:linear-gradient(135deg,var(--or-pale),var(--white))}
  .mc-b{padding:18px 22px}
  .mc-f{padding:12px 22px;border-top:1px solid var(--s100);display:flex;gap:8px;justify-content:flex-end}
  .fl{display:block;font-size:10px;font-weight:700;color:var(--s600);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:5px}
  .fi{width:100%;background:var(--s50);border:1.5px solid var(--s200);border-radius:8px;padding:8px 12px;font-size:13px;color:var(--s800);font-family:'Plus Jakarta Sans',sans-serif;outline:none;transition:all 0.15s}
  .fi:focus{border-color:var(--or);background:var(--white)}
  .frow{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px}
  .fmb{margin-bottom:12px}
  /* KODE PICKER */
  .kode-picker{display:flex;gap:5px;flex-wrap:wrap}
  .kp-btn{padding:5px 8px;border-radius:6px;border:1.5px solid var(--s200);background:var(--white);font-size:10px;font-weight:800;cursor:pointer;transition:all 0.12s;font-family:'JetBrains Mono',monospace}
  .kp-btn.sel{border-width:2px}
  /* BADGE */
  .badge{display:inline-flex;align-items:center;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700;white-space:nowrap}
  /* BUTTONS */
  .btn-primary{background:linear-gradient(135deg,var(--or),var(--or-d));color:#fff;border:none;border-radius:8px;padding:9px 18px;font-size:13px;font-weight:700;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all 0.15s;box-shadow:0 2px 8px rgba(249,115,22,0.25);display:inline-flex;align-items:center;gap:6px}
  .btn-primary:hover{filter:brightness(1.05)}
  .btn-ghost{background:var(--s100);color:var(--s700);border:1px solid var(--s200);border-radius:8px;padding:9px 14px;font-size:12px;font-weight:600;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all 0.15s;display:inline-flex;align-items:center;gap:6px}
  .btn-ghost:hover{background:var(--s200)}
  .btn-sm{padding:5px 11px;font-size:11px;border-radius:7px}
  .btn-xs{padding:3px 8px;font-size:10px;border-radius:6px}
  .btn-red{background:#fee2e2;color:var(--red);border:1px solid #fca5a5;border-radius:6px;padding:3px 8px;font-size:10px;font-weight:700;cursor:pointer;font-family:inherit}
  .btn-red:hover{background:var(--red);color:#fff}
  .toaster{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--s900);color:#fff;padding:10px 22px;border-radius:30px;font-size:13px;font-weight:600;z-index:999;box-shadow:0 8px 24px rgba(0,0,0,0.3);animation:toastIn 0.25s ease;white-space:nowrap}
  @keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  .fade-up{animation:fadeUp 0.25s ease forwards}
  /* LEGENDA */
  .leg-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:5px}
  .leg-item{display:flex;align-items:center;gap:6px;font-size:10px;color:var(--s600);padding:4px 6px;border-radius:6px;border:1px solid transparent}
  .leg-item.lembur-type{border-color:var(--or-mid);background:var(--or-pale)}
  .leg-dot{width:20px;height:16px;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:800;font-family:'JetBrains Mono',monospace;flex-shrink:0}
  /* TOOLTIP */
  .has-tooltip{position:relative}
  .has-tooltip:hover .tooltip{display:block}
  .tooltip{display:none;position:absolute;bottom:calc(100% + 5px);left:50%;transform:translateX(-50%);background:var(--s900);color:#fff;padding:5px 9px;border-radius:7px;font-size:10px;white-space:nowrap;z-index:50;pointer-events:none;font-weight:500}
  .tooltip::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:4px solid transparent;border-top-color:var(--s900)}
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
// FORM KODE ABSENSI (edit 1 sel)
// ============================================================
function FormKode({ staffNama, hari, kodeAwal, onSave, onClose }) {
  const [kode, setKode] = useState(kodeAwal || "");
  return (
    <div className="overlay" onClick={onClose}>
      <div className="mc" onClick={e => e.stopPropagation()} style={{ width: 400 }}>
        <div className="mc-h">
          <div style={{ fontSize: 14, fontWeight: 800, color: "var(--s900)", marginBottom: 2 }}>✏️ Edit Kode Absensi</div>
          <div style={{ fontSize: 12, color: "var(--s400)" }}>{staffNama} — Tanggal {hari}</div>
        </div>
        <div className="mc-b">
          {/* Group kode */}
          {[
            { label: "Shift Normal", kodes: ["P","SM","M","OFF","IN"] },
            { label: "Lembur Biasa — Rp 50.000/shift", kodes: ["L","PL","SML"], highlight: true },
            { label: "Lembur Lebaran — Rp 150.000/shift (3×)", kodes: ["LL"], highlight: true, color: "#ea580c" },
            { label: "Ijin & Lainnya", kodes: ["IJ","SKT","IJT"] },
          ].map(grp => (
            <div key={grp.label} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: grp.color || (grp.highlight ? "var(--or-d)" : "var(--s400)"), textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                {grp.highlight && <span>🔥</span>}{grp.label}
              </div>
              <div className="kode-picker">
                {grp.kodes.map(k => {
                  const c = KODE_CFG[k];
                  return (
                    <button key={k} className={`kp-btn${kode===k?" sel":""}`}
                      style={{ color: c.color, background: kode===k ? c.bg : "var(--white)", borderColor: kode===k ? c.color : "var(--s200)" }}
                      onClick={() => setKode(k)}
                      title={c.ket}>
                      {c.singkat}
                    </button>
                  );
                })}
              </div>
              {/* Keterangan kode yang dipilih */}
              {grp.kodes.includes(kode) && (
                <div style={{ fontSize: 11, color: "var(--s500)", marginTop: 5, fontStyle: "italic", background: "var(--s50)", padding: "5px 8px", borderRadius: 6 }}>
                  ℹ️ {KODE_CFG[kode]?.ket}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mc-f">
          <button className="btn-ghost" onClick={onClose}>Batal</button>
          <button className="btn-primary" disabled={!kode} style={{ opacity: kode ? 1 : 0.5 }} onClick={() => onSave(kode)}>
            ✓ Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// FORM LEMBUR TAMBAHAN
// ============================================================
function FormLemburTambahan({ onSave, onClose }) {
  const [form, setForm] = useState({ staffId: "", tanggal: "2026-02-", jam: 1, nominal: 50000, kategori: "Perbaikan", keterangan: "" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const ok  = form.staffId && form.tanggal && form.jam > 0 && form.nominal >= 0 && form.keterangan.trim();

  // Auto-suggest nominal berdasarkan jam (Rp 25.000/jam sebagai acuan)
  const handleJamChange = (v) => {
    const j = parseFloat(v) || 0;
    set("jam", j);
    set("nominal", Math.round(j * 25000));
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="mc" onClick={e => e.stopPropagation()}>
        <div className="mc-h">
          <div style={{ fontSize: 14, fontWeight: 800, color: "var(--s900)", marginBottom: 2 }}>➕ Input Lembur Tambahan</div>
          <div style={{ fontSize: 12, color: "var(--s400)" }}>Lembur fleksibel di luar shift — nominal diinput langsung oleh PJ</div>
        </div>
        <div className="mc-b">
          {/* Info banner */}
          <div style={{ background: "#fae8ff", border: "1px solid #e879f9", borderRadius: 9, padding: "9px 12px", marginBottom: 14, display: "flex", gap: 8, alignItems: "flex-start" }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>💡</span>
            <div style={{ fontSize: 11, color: "#86198f", lineHeight: 1.5 }}>
              Gunakan ini untuk: perbaikan dadakan, weekly service malam, check-in darurat, atau lembur apapun yang <b>tidak masuk kode shift</b>. Nominal bebas ditentukan PJ.
            </div>
          </div>

          <div className="frow">
            <div>
              <label className="fl">Staff *</label>
              <select className="fi" value={form.staffId} onChange={e => set("staffId", e.target.value)}>
                <option value="">— Pilih staff —</option>
                {STAFF_LIST.map(s => <option key={s.id} value={s.id}>{s.nama.split(" ")[0]} ({s.shift})</option>)}
              </select>
            </div>
            <div>
              <label className="fl">Tanggal *</label>
              <input className="fi" type="date" value={form.tanggal} onChange={e => set("tanggal", e.target.value)} />
            </div>
          </div>

          <div className="frow">
            <div>
              <label className="fl">Durasi (jam) *</label>
              <input className="fi" type="number" min="0.5" max="24" step="0.5" value={form.jam} onChange={e => handleJamChange(e.target.value)} />
              <div style={{ fontSize: 10, color: "var(--s400)", marginTop: 4 }}>Bisa desimal, misal 1.5 = 1½ jam</div>
            </div>
            <div>
              <label className="fl">Nominal (Rp) *</label>
              <input className="fi" type="number" step="5000" value={form.nominal} onChange={e => set("nominal", Number(e.target.value))} style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }} />
              <div style={{ fontSize: 10, color: "var(--s400)", marginTop: 4 }}>Auto-suggest: Rp 25.000/jam. PJ bisa ubah bebas.</div>
            </div>
          </div>

          <div className="fmb">
            <label className="fl">Kategori</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {KATEGORI_LIST.map(k => (
                <button key={k} onClick={() => set("kategori", k)}
                  style={{ padding: "5px 10px", borderRadius: 7, border: `1.5px solid ${form.kategori===k ? "var(--or)" : "var(--s200)"}`, background: form.kategori===k ? "var(--or-pale)" : "var(--white)", color: form.kategori===k ? "var(--or-d)" : "var(--s600)", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                  {k}
                </button>
              ))}
            </div>
          </div>

          <div className="fmb">
            <label className="fl">Keterangan *</label>
            <textarea className="fi" rows={2} placeholder="Misal: Benerin AC bocor Kamar 9 setelah shift SM selesai jam 07:00" value={form.keterangan} onChange={e => set("keterangan", e.target.value)} style={{ resize: "vertical" }} />
          </div>

          {/* Preview total */}
          {form.staffId && form.jam > 0 && (
            <div style={{ background: "linear-gradient(135deg,var(--s900),#1a0a00)", borderRadius: 10, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 3 }}>Preview slip gaji</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
                  {STAFF_LIST.find(s=>s.id===form.staffId)?.nama.split(" ")[0]} · {fmtJam(form.jam)} · {form.kategori}
                </div>
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "var(--or)", fontFamily: "'JetBrains Mono',monospace" }}>
                +{fmtRp(form.nominal)}
              </div>
            </div>
          )}
        </div>
        <div className="mc-f">
          <button className="btn-ghost" onClick={onClose}>Batal</button>
          <button className="btn-primary" disabled={!ok} style={{ opacity: ok ? 1 : 0.5 }}
            onClick={() => onSave({ ...form, id: "LT" + Date.now(), nama: STAFF_LIST.find(s=>s.id===form.staffId)?.nama || "" })}>
            ✓ Simpan Lembur
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// TAB KALENDER
// ============================================================
function TabKalender({ absensiData, lemburTambahan, onEditKode, periode }) {
  const [editSel, setEditSel] = useState(null); // {staffId, hari}
  const jumlahHari = periode ? new Date(periode.tahun, periode.bulan + 1, 0).getDate() : 28;
  const days = Array.from({ length: jumlahHari }, (_, i) => i + 1);
  const weekdays = days.map(d => new Date(periode ? periode.tahun : 2026, periode ? periode.bulan : 1, d).getDay());

  return (
    <div>
      {/* Legenda */}
      <div className="w">
        <div className="wh"><div className="wh-title">🗂️ Legenda Kode Absensi</div></div>
        <div className="wb">
          <div className="leg-grid">
            {Object.entries(KODE_CFG).map(([k, c]) => (
              <div key={k} className={`leg-item${c.hitung.startsWith("lembur") ? " lembur-type" : ""}`}>
                <div className="leg-dot" style={{ background: c.bg, color: c.color }}>{c.singkat}</div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: c.color }}>{c.label}</div>
                  <div style={{ fontSize: 9, color: "var(--s400)" }}>{c.ket.split(" — ")[0]}</div>
                </div>
              </div>
            ))}
          </div>
          {/* Lembur tambahan note */}
          <div style={{ marginTop: 10, padding: "8px 10px", background: "#fae8ff", borderRadius: 8, border: "1px solid #e879f9", fontSize: 11, color: "#86198f", display: "flex", gap: 6 }}>
            <span>⚡</span>
            <span><b>Lembur Tambahan (LS)</b> — perbaikan dadakan, weekly malam, check-in darurat dll. Input di tab "Lembur Tambahan". Tidak ditampilkan di grid ini.</span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="w">
        <div className="wh">
          <div className="wh-title">📅 Kalender Absensi — {periode ? `${BULAN_LIST[periode.bulan]} ${periode.tahun}` : "—"}</div>
          <span style={{ fontSize: 11, color: "var(--s400)" }}>Klik sel untuk edit kode</span>
        </div>
        <div className="wb" style={{ padding: 0 }}>
          <div className="cal-wrap">
            <table className="cal-table">
              <thead>
                <tr>
                  <th className="sc">Staff</th>
                  {days.map(d => {
                    const wd = weekdays[d-1];
                    const isWe = wd === 0 || wd === 6;
                    return <th key={d} style={{ color: isWe ? "var(--red)" : undefined, minWidth: 30 }}>{d}</th>;
                  })}
                </tr>
              </thead>
              <tbody>
                {STAFF_LIST.map((staff, si) => {
                  const ltCount = lemburTambahan.filter(l => l.staffId === staff.id);
                  return (
                    <tr key={staff.id}>
                      <td>
                        <div className="staff-cell">
                          <div className="sma" style={{ background: GRAD[si] }}>{getInit(staff.nama)}</div>
                          <div>
                            <div className="smn">{staff.nama.split(" ").slice(0,2).join(" ")}</div>
                            <div style={{ fontSize: 9, color: "var(--s400)" }}>{staff.shift}</div>
                          </div>
                        </div>
                      </td>
                      {days.map(d => {
                        const kode = absensiData[staff.id]?.[d];
                        const cfg  = kode ? KODE_CFG[kode] : null;
                        // Cek apakah hari ini ada lembur tambahan
                        const thnStr = String(periode ? periode.tahun : 2026);
                const blnStr = String(periode ? periode.bulan + 1 : 2).padStart(2,"0");
                const hasLT  = lemburTambahan.some(l => l.staffId === staff.id && l.tanggal === `${thnStr}-${blnStr}-${String(d).padStart(2,"0")}`);
                        const isWe  = weekdays[d-1] === 0 || weekdays[d-1] === 6;
                        return (
                          <td key={d} style={{ background: isWe ? "#fffafa" : undefined }}>
                            <div style={{ position: "relative", display: "inline-block" }}>
                              {cfg ? (
                                <div className={`kb has-tooltip${cfg.hitung==="lembur_biasa"?" lembur-ring":""}${cfg.hitung==="lembur_lebaran"?" lebaran-ring":""}`}
                                  style={{ background: cfg.bg, color: cfg.color }}
                                  onClick={() => setEditSel({ staffId: staff.id, hari: d, kode })}>
                                  {cfg.singkat}
                                  <div className="tooltip">{cfg.label}</div>
                                </div>
                              ) : (
                                <div className="kb-empty" onClick={() => setEditSel({ staffId: staff.id, hari: d, kode: "" })}>·</div>
                              )}
                              {/* Dot lembur tambahan */}
                              {hasLT && (
                                <div style={{ position: "absolute", top: -2, right: -2, width: 7, height: 7, borderRadius: "50%", background: "#c026d3", border: "1px solid white" }} title="Ada lembur tambahan" />
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {editSel && (
        <FormKode
          staffNama={STAFF_LIST.find(s=>s.id===editSel.staffId)?.nama}
          hari={editSel.hari}
          kodeAwal={editSel.kode}
          onSave={(kode) => { onEditKode(editSel.staffId, editSel.hari, kode); setEditSel(null); }}
          onClose={() => setEditSel(null)}
        />
      )}
    </div>
  );
}

// ============================================================
// TAB LEMBUR TAMBAHAN  ← BARU!
// ============================================================
function TabLemburTambahan({ lemburTambahan, onAdd, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [filterStaff, setFilterStaff] = useState("all");

  const filtered = lemburTambahan.filter(l => filterStaff === "all" || l.staffId === filterStaff);
  const totalNominal = filtered.reduce((s, l) => s + l.nominal, 0);
  const totalJam     = filtered.reduce((s, l) => s + l.jam, 0);

  // Summary per staff
  const summaryByStaff = STAFF_LIST.map(s => {
    const lt = lemburTambahan.filter(l => l.staffId === s.id);
    return { ...s, count: lt.length, jam: lt.reduce((a,l)=>a+l.jam,0), nominal: lt.reduce((a,l)=>a+l.nominal,0) };
  });

  const KATEGORI_COLORS = {
    "Perbaikan":       { color: "#d97706", bg: "#fef3c7" },
    "Weekly Dadakan":  { color: "#1d4ed8", bg: "#dbeafe" },
    "Check-in Darurat":{ color: "#7c3aed", bg: "#ede9fe" },
    "Jaga Darurat":    { color: "#dc2626", bg: "#fee2e2" },
    "Lainnya":         { color: "#64748b", bg: "#f1f5f9" },
  };

  return (
    <div>
      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 16 }}>
        {summaryByStaff.map((s, i) => (
          <div key={s.id} style={{ background: "var(--white)", border: "1px solid var(--s200)", borderRadius: 12, padding: "12px 14px", borderTop: `3px solid ${["var(--or)","var(--teal)","var(--blue)"][i]}`, cursor: "pointer", transition: "all 0.12s", opacity: filterStaff !== "all" && filterStaff !== s.id ? 0.5 : 1 }}
            onClick={() => setFilterStaff(filterStaff === s.id ? "all" : s.id)}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: GRAD[i], display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 10, fontWeight: 800 }}>{getInit(s.nama)}</div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--s800)" }}>{s.nama.split(" ").slice(0,2).join(" ")}</div>
                <div style={{ fontSize: 9, color: "var(--s400)" }}>{s.shift}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <div>
                <div style={{ fontSize: 9, color: "var(--s400)", fontWeight: 700 }}>KEJADIAN</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "var(--s800)" }}>{s.count}×</div>
              </div>
              <div>
                <div style={{ fontSize: 9, color: "var(--s400)", fontWeight: 700 }}>JAM</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "var(--s800)" }}>{s.jam}</div>
              </div>
              <div>
                <div style={{ fontSize: 9, color: "var(--s400)", fontWeight: 700 }}>NOMINAL</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "var(--or-d)", fontFamily: "'JetBrains Mono',monospace" }}>{fmtRp(s.nominal)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Header + Add */}
      <div className="w">
        <div className="wh">
          <div className="wh-title">
            ⚡ Lembur Tambahan
            {filterStaff !== "all" && <span className="badge" style={{ color: "var(--or-d)", background: "var(--or-light)", marginLeft: 4 }}>{STAFF_LIST.find(s=>s.id===filterStaff)?.nama.split(" ")[0]}</span>}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "var(--s400)" }}>{filtered.length} kejadian · {totalJam} jam total</span>
            <button className="btn-primary btn-sm" onClick={() => setShowForm(true)}>+ Tambah</button>
          </div>
        </div>
        <div style={{ padding: 14 }}>
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "32px 0", color: "var(--s400)" }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>⚡</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--s700)", marginBottom: 4 }}>Belum ada lembur tambahan</div>
              <div style={{ fontSize: 12 }}>Klik "+ Tambah" untuk input lembur dadakan</div>
            </div>
          )}
          {filtered.map(lt => {
            const staff = STAFF_LIST.find(s => s.id === lt.staffId);
            const si    = STAFF_LIST.findIndex(s => s.id === lt.staffId);
            const cat   = KATEGORI_COLORS[lt.kategori] || KATEGORI_COLORS["Lainnya"];
            return (
              <div key={lt.id} className="lt-card">
                <div className="lt-icon">⚡</div>
                <div style={{ flex: 1 }}>
                  <div className="lt-staff">{staff?.nama}</div>
                  <div className="lt-ket">{lt.keterangan}</div>
                  <div className="lt-meta">
                    <span className="badge" style={{ color: cat.color, background: cat.bg }}>{lt.kategori}</span>
                    <span style={{ fontSize: 11, color: "var(--s400)" }}>📅 {lt.tanggal}</span>
                    <span style={{ fontSize: 11, color: "var(--s400)" }}>⏱ {fmtJam(lt.jam)}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "var(--or-d)", fontFamily: "'JetBrains Mono',monospace" }}>+{fmtRp(lt.nominal)}</span>
                  </div>
                </div>
                <button className="btn-red btn-xs" onClick={() => onDelete(lt.id)}>Hapus</button>
              </div>
            );
          })}

          {/* Total row */}
          {filtered.length > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "linear-gradient(135deg,var(--s900),#1a0a00)", borderRadius: 10, marginTop: 8 }}>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Total Lembur Tambahan {filterStaff !== "all" ? STAFF_LIST.find(s=>s.id===filterStaff)?.nama.split(" ")[0] : "Semua Staff"}</div>
              <div>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginRight: 8 }}>{totalJam} jam</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: "var(--or)", fontFamily: "'JetBrains Mono',monospace" }}>{fmtRp(totalNominal)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {showForm && <FormLemburTambahan onSave={(lt) => { onAdd(lt); setShowForm(false); }} onClose={() => setShowForm(false)} />}
    </div>
  );
}

// ============================================================
// TAB REKAP
// ============================================================
function TabRekap({ absensiData, lemburTambahan, periode }) {
  return (
    <div className="w">
      <div className="wh"><div className="wh-title">📊 Rekap Bulanan — Februari 2026</div></div>
      <div style={{ overflowX: "auto" }}>
        <table className="rekap-table">
          <thead>
            <tr>
              <th>Staff</th>
              <th>Masuk</th>
              <th>Lembur<br/>Biasa</th>
              <th>Lembur<br/>Lebaran</th>
              <th>Lembur<br/>Tambahan</th>
              <th>Ijin</th>
              <th>Sakit</th>
              <th>Ijin TS</th>
              <th>Total Lembur<br/>Nominal</th>
              <th>Potongan<br/>ITS</th>
            </tr>
          </thead>
          <tbody>
            {STAFF_LIST.map((staff, si) => {
              const r = getRekap(staff.id, absensiData, lemburTambahan);
              return (
                <tr key={staff.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 26, height: 26, borderRadius: 7, background: GRAD[si], display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 9, fontWeight: 800, flexShrink: 0 }}>{getInit(staff.nama)}</div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--s800)" }}>{staff.nama.split(" ").slice(0,2).join(" ")}</div>
                        <div style={{ fontSize: 10, color: "var(--s400)" }}>{staff.shift}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: "var(--green)", fontWeight: 700 }}>{r.masuk}</td>
                  <td>
                    <div style={{ fontWeight: 700 }}>{r.lembur_biasa}</div>
                    <div style={{ fontSize: 10, color: "var(--s400)" }}>{fmtRp(r.nominalLB)}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: r.lembur_lebaran > 0 ? "var(--or-d)" : undefined }}>{r.lembur_lebaran}</div>
                    {r.lembur_lebaran > 0 && <div style={{ fontSize: 10, color: "var(--or-d)" }}>{fmtRp(r.nominalLL)}</div>}
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: "#c026d3" }}>{lemburTambahan.filter(l=>l.staffId===staff.id).length}×</div>
                    <div style={{ fontSize: 10, color: "#c026d3" }}>{fmtRp(r.nominalLT)}</div>
                  </td>
                  <td style={{ color: "var(--amber)" }}>{r.ijin}</td>
                  <td style={{ color: "var(--s400)" }}>{r.sakit}</td>
                  <td style={{ color: r.ijin_ts > 0 ? "var(--red)" : "var(--s400)", fontWeight: r.ijin_ts > 0 ? 700 : 400 }}>{r.ijin_ts}</td>
                  <td style={{ color: "var(--or-d)", fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" }}>{fmtRp(r.totalLemburNominal)}</td>
                  <td style={{ color: r.potonganIjinTs > 0 ? "var(--red)" : "var(--s400)", fontFamily: "'JetBrains Mono',monospace" }}>
                    {r.potonganIjinTs > 0 ? `-${fmtRp(r.potonganIjinTs)}` : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// TAB KPI
// ============================================================
function TabKPI({ absensiData, lemburTambahan }) {
  return (
    <div>
      {STAFF_LIST.map((staff, si) => {
        const r   = getRekap(staff.id, absensiData, lemburTambahan);
        const lv  = getKPILevel(r.kpiTotal);
        const ltStaff = lemburTambahan.filter(l => l.staffId === staff.id);
        return (
          <div key={staff.id} className="w">
            <div className="wh">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: GRAD[si], display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 800 }}>{getInit(staff.nama)}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "var(--s800)" }}>{staff.nama}</div>
                  <div style={{ fontSize: 11, color: "var(--s400)" }}>{staff.jabatan}</div>
                </div>
              </div>
              <span className="badge" style={{ color: lv.color, background: lv.bg, fontSize: 11 }}>🎯 {lv.label} — {r.kpiTotal}/100</span>
            </div>
            <div className="wb">
              {/* KPI Bar */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: "var(--s600)", fontWeight: 600 }}>KPI Score</span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: lv.color, fontFamily: "'JetBrains Mono',monospace" }}>{r.kpiTotal} / 100</span>
                </div>
                <div style={{ height: 8, background: "var(--s100)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: r.kpiTotal + "%", height: "100%", background: `linear-gradient(90deg,${lv.color},${lv.color}aa)`, borderRadius: 4, transition: "width 0.6s" }} />
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                  {[
                    { label: "Absensi", val: r.kpiAbsensi, max: 70, color: "var(--green)" },
                    { label: "Lembur",  val: r.kpiLembur,  max: 20, color: "var(--blue)" },
                    { label: "Jobdesk", val: r.kpiJobdesk, max: 10, color: "var(--or)" },
                  ].map(k => (
                    <div key={k.label} style={{ flex: 1, background: "var(--s50)", borderRadius: 8, padding: "8px 10px" }}>
                      <div style={{ fontSize: 9, color: "var(--s400)", fontWeight: 700, textTransform: "uppercase", marginBottom: 3 }}>{k.label}</div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: k.color }}>{k.val}<span style={{ fontSize: 10, color: "var(--s400)" }}>/{k.max}</span></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lembur breakdown */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
                <div style={{ background: "var(--or-pale)", border: "1px solid var(--or-mid)", borderRadius: 8, padding: "8px 10px" }}>
                  <div style={{ fontSize: 9, color: "var(--or-d)", fontWeight: 700, textTransform: "uppercase", marginBottom: 3 }}>Lembur Biasa</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "var(--s800)" }}>{r.lembur_biasa}×</div>
                  <div style={{ fontSize: 11, color: "var(--or-d)", fontFamily: "'JetBrains Mono',monospace" }}>{fmtRp(r.nominalLB)}</div>
                </div>
                <div style={{ background: r.lembur_lebaran > 0 ? "#fff7ed" : "var(--s50)", border: `1px solid ${r.lembur_lebaran > 0 ? "#fed7aa" : "var(--s200)"}`, borderRadius: 8, padding: "8px 10px" }}>
                  <div style={{ fontSize: 9, color: r.lembur_lebaran > 0 ? "var(--or-d)" : "var(--s400)", fontWeight: 700, textTransform: "uppercase", marginBottom: 3 }}>Lembur Lebaran</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: r.lembur_lebaran > 0 ? "var(--or-d)" : "var(--s300)" }}>{r.lembur_lebaran}×</div>
                  <div style={{ fontSize: 11, color: r.lembur_lebaran > 0 ? "var(--or-d)" : "var(--s300)", fontFamily: "'JetBrains Mono',monospace" }}>{fmtRp(r.nominalLL)}</div>
                </div>
                <div style={{ background: ltStaff.length > 0 ? "#fae8ff" : "var(--s50)", border: `1px solid ${ltStaff.length > 0 ? "#e879f9" : "var(--s200)"}`, borderRadius: 8, padding: "8px 10px" }}>
                  <div style={{ fontSize: 9, color: ltStaff.length > 0 ? "#86198f" : "var(--s400)", fontWeight: 700, textTransform: "uppercase", marginBottom: 3 }}>Lembur Tambahan</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: ltStaff.length > 0 ? "#86198f" : "var(--s300)" }}>{ltStaff.length}×</div>
                  <div style={{ fontSize: 11, color: ltStaff.length > 0 ? "#86198f" : "var(--s300)", fontFamily: "'JetBrains Mono',monospace" }}>{fmtRp(r.nominalLT)}</div>
                </div>
              </div>

              {/* Insentif & potongan */}
              <div style={{ background: "linear-gradient(135deg,var(--s900),#1a0a00)", borderRadius: 10, padding: "12px 14px", display: "flex", gap: 20, alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 3 }}>Insentif KPI</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: lv.insentif > 0 ? "var(--or)" : "var(--s400)", fontFamily: "'JetBrains Mono',monospace" }}>{fmtRp(lv.insentif)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 3 }}>Total Lembur</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#60a5fa", fontFamily: "'JetBrains Mono',monospace" }}>{fmtRp(r.totalLemburNominal)}</div>
                </div>
                {r.potonganIjinTs > 0 && (
                  <div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 3 }}>Potongan ITS</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#f87171", fontFamily: "'JetBrains Mono',monospace" }}>-{fmtRp(r.potonganIjinTs)}</div>
                  </div>
                )}
                <div style={{ marginLeft: "auto" }}>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 3 }}>Total Tambahan ke Gaji</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "var(--green)", fontFamily: "'JetBrains Mono',monospace" }}>
                    {fmtRp(lv.insentif + r.totalLemburNominal - r.potonganIjinTs)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// MAIN EXPORT
// ============================================================
export default function LaporanAbsensi({ userRole = "admin" }) {
  const [periode,       setPeriode]       = useState(PERIODE_LIST[0]);
  const [absensiData,   setAbsensiData]   = useState(ABSENSI_INIT);
  const [lemburTambahan,setLemburTambahan]= useState(LEMBUR_TAMBAHAN_INIT);
  const [activeTab,     setActiveTab]     = useState("kalender");
  const [toast,         setToast]         = useState(null);

  const allRekap    = STAFF_LIST.map(s => getRekap(s.id, absensiData, lemburTambahan));
  const totalMasuk  = allRekap.reduce((s,r) => s + r.masuk, 0);
  const totalLemburB= allRekap.reduce((s,r) => s + r.lembur_biasa, 0);
  const totalLemburL= allRekap.reduce((s,r) => s + r.lembur_lebaran, 0);
  const totalLT     = lemburTambahan.length;
  const avgKPI      = Math.round(allRekap.reduce((s,r) => s + r.kpiTotal, 0) / allRekap.length);

  const handleEditKode = (staffId, day, kode) => {
    setAbsensiData(p => ({ ...p, [staffId]: { ...p[staffId], [day]: kode } }));
    setToast(`✓ ${STAFF_LIST.find(s=>s.id===staffId)?.nama.split(" ")[0]} tgl ${day} → ${KODE_CFG[kode]?.label}`);
  };
  const handleAddLT    = (lt) => { setLemburTambahan(p => [...p, lt]); setToast("✓ Lembur tambahan berhasil disimpan"); };
  const handleDeleteLT = (id) => { setLemburTambahan(p => p.filter(l => l.id !== id)); setToast("🗑️ Lembur tambahan dihapus"); };

  const TABS = [
    { id:"kalender", icon:"📅", label:"Kalender Absensi" },
    { id:"lembur",   icon:"⚡", label:"Lembur Tambahan", badge: totalLT },
    { id:"rekap",    icon:"📊", label:"Rekap Bulanan" },
    { id:"kpi",      icon:"🎯", label:"KPI & Insentif" },
  ];

  return (
    <div className="fade-up">
      <StyleInjector />
      <div className="topbar">
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <select className="periode-sel" value={periode.label} onChange={e => setPeriode(PERIODE_LIST.find(p => p.label === e.target.value))}>
            {PERIODE_LIST.map(p => <option key={p.label} value={p.label}>{p.label}</option>)}
          </select>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button className="btn-ghost" onClick={() => setToast(`📤 Export Excel — ${periode?.label}`)}>↓ Export</button>
          <button className="btn-primary" onClick={() => setToast(`🖨️ Print PDF — ${periode?.label}`)}>🖨️ Print PDF</button>
        </div>
      </div>

      {/* STAT ROW */}
      <div className="stat-row">
        {[
          { label:"Hari Masuk",       val:totalMasuk,   color:"var(--green)", bc:"var(--green)",  sub:"semua staff" },
          { label:"Lembur Biasa",     val:totalLemburB, color:"var(--or)",    bc:"var(--or)",     sub:`${fmtRp(totalLemburB*50000)}` },
          { label:"Lembur Lebaran",   val:totalLemburL, color:"var(--or-d)",  bc:"var(--or-d)",   sub:`${fmtRp(totalLemburL*150000)}` },
          { label:"Lembur Tambahan",  val:totalLT,      color:"#c026d3",      bc:"#c026d3",       sub:`${fmtRp(lemburTambahan.reduce((s,l)=>s+l.nominal,0))}` },
          { label:"Rata-rata KPI",    val:avgKPI,       color:avgKPI>=75?"var(--green)":"var(--amber)", bc:"var(--or)", sub:getKPILevel(avgKPI).label },
        ].map(s => (
          <div key={s.label} className="sc" style={{ borderTopColor: s.bc }}>
            <div className="sc-label">{s.label}</div>
            <div className="sc-val" style={{ color: s.color }}>{s.val}</div>
            <div className="sc-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* TAB NAV */}
      <div className="tab-nav">
        {TABS.map(t => (
          <button key={t.id} className={`tab-btn${activeTab===t.id?" active":""}`} onClick={() => setActiveTab(t.id)}>
            <span>{t.icon}</span>{t.label}
            {t.badge > 0 && <span style={{ background: activeTab===t.id ? "rgba(255,255,255,0.3)" : "#c026d3", color: "#fff", borderRadius: 10, padding: "0 5px", fontSize: 9, fontWeight: 800 }}>{t.badge}</span>}
          </button>
        ))}
      </div>

      {activeTab === "kalender" && <TabKalender absensiData={absensiData} lemburTambahan={lemburTambahan} onEditKode={handleEditKode} periode={periode} />}
      {activeTab === "lembur"   && <TabLemburTambahan lemburTambahan={lemburTambahan} onAdd={handleAddLT} onDelete={handleDeleteLT} />}
      {activeTab === "rekap"    && <TabRekap    absensiData={absensiData} lemburTambahan={lemburTambahan} periode={periode} />}
      {activeTab === "kpi"      && <TabKPI      absensiData={absensiData} lemburTambahan={lemburTambahan} />}

      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
