import { useState, useEffect } from "react";

// ============================================================
// MOCK DATA
// ============================================================
const PERIODE_LIST = ["Feb 2026", "Jan 2026", "Des 2025"];

const STAFF_DATA = [];

const KPI_THRESHOLD = {
  excellent: { min: 90, insentif: 200000, label: "Excellent", color: "#16a34a", bg: "#dcfce7" },
  good:      { min: 75, insentif: 150000, label: "Good",      color: "#d97706", bg: "#fef3c7" },
  average:   { min: 60, insentif: 75000,  label: "Average",   color: "#f97316", bg: "#ffedd5" },
  poor:      { min: 0,  insentif: 0,      label: "Poor",      color: "#dc2626", bg: "#fee2e2" },
};

const REKENING_KOPERASI = { bank: "BCA", no: "5566778899", atas: "Koperasi Senyum Inn" };
const BLN = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Ags","Sep","Okt","Nov","Des"];

const fmtRp   = (n) => n != null ? "Rp " + Math.abs(Number(n)).toLocaleString("id-ID") : "-";
const fmtTgl  = (s) => { if (!s) return "-"; const d = new Date(s); return `${d.getDate()} ${BLN[d.getMonth()]} ${d.getFullYear()}`; };
const getInitials = (n) => n.split(" ").slice(0,2).map(w => w[0]).join("").toUpperCase();

function getKPILevel(score) {
  if (score >= 90) return KPI_THRESHOLD.excellent;
  if (score >= 75) return KPI_THRESHOLD.good;
  if (score >= 60) return KPI_THRESHOLD.average;
  return KPI_THRESHOLD.poor;
}

function calcGaji(staff) {
  const k = staff.komponen;
  const pendapatan = staff.gajiPokok + (staff.insentifKPI || 0) + (k.lembur || 0) + (k.lemburTambahan || 0);
  const potongan   = (k.potonganIjin || 0) + (k.potonganPinjaman || 0) + (k.bpjs || 0) + (k.pajak || 0);
  const takehome   = pendapatan - potongan;
  return { pendapatan, potongan, takehome };
}

const AVATAR_COLORS = [
  "linear-gradient(135deg,#f97316,#ea580c)",
  "linear-gradient(135deg,#1d4ed8,#1e40af)",
  "linear-gradient(135deg,#0d9488,#0f766e)",
];

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
    --white:#fff;--red:#dc2626;--green:#16a34a;--blue:#1d4ed8;
    --amber:#d97706;--teal:#0d9488;--purple:#7c3aed;
  }
  body{font-family:'Plus Jakarta Sans',sans-serif;background:var(--s50)}
  ::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-thumb{background:var(--s200);border-radius:4px}

  /* ── TOPBAR ── */
  .topbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;flex-wrap:wrap;gap:10px}
  .periode-sel{background:var(--white);border:1.5px solid var(--s200);border-radius:9px;padding:8px 14px;font-size:13px;font-weight:700;color:var(--s800);font-family:'Plus Jakarta Sans',sans-serif;outline:none;cursor:pointer}
  .periode-sel:focus{border-color:var(--or)}

  /* ── STAT ROW ── */
  .stat-row{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px}
  .sc{background:var(--white);border:1px solid var(--s200);border-radius:12px;padding:14px 16px;border-top:3px solid transparent}
  .sc-label{font-size:10px;font-weight:700;color:var(--s400);text-transform:uppercase;letter-spacing:0.7px;margin-bottom:4px}
  .sc-val{font-size:20px;font-weight:800;font-family:'JetBrains Mono',monospace}
  .sc-sub{font-size:11px;color:var(--s400);margin-top:3px}

  /* ── LAYOUT ── */
  .layout{display:grid;grid-template-columns:300px 1fr;gap:16px;align-items:start}

  /* ── STAFF LIST ── */
  .staff-list{background:var(--white);border:1px solid var(--s200);border-radius:12px;overflow:hidden}
  .sl-head{padding:10px 12px;border-bottom:1px solid var(--s100);background:var(--s50);font-size:11px;font-weight:700;color:var(--s400);text-transform:uppercase;letter-spacing:0.8px}
  .staff-item{padding:12px 14px;border-bottom:1px solid var(--s100);cursor:pointer;transition:all 0.12s;display:flex;align-items:center;gap:11px}
  .staff-item:last-child{border-bottom:none}
  .staff-item:hover{background:var(--or-pale)}
  .staff-item.active{background:var(--or-pale);border-left:3px solid var(--or)}
  .si-avatar{width:40px;height:40px;border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:#fff;flex-shrink:0}
  .si-name{font-size:13px;font-weight:700;color:var(--s800)}
  .si-sub{font-size:11px;color:var(--s400);margin-top:2px}
  .si-gaji{font-size:12px;font-weight:700;font-family:'JetBrains Mono',monospace;color:var(--or-d);margin-top:3px}

  /* ── SLIP GAJI PANEL ── */
  .slip-panel{background:var(--white);border:1px solid var(--s200);border-radius:12px;overflow:hidden}
  
  /* ── SLIP HEADER ── */
  .slip-hero{background:linear-gradient(135deg,var(--s900) 0%,#1a0a00 100%);padding:24px;position:relative;overflow:hidden}
  .slip-hero::before{content:'';position:absolute;top:-50px;right:-50px;width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,rgba(249,115,22,0.15),transparent)}
  .slip-hero::after{content:'SLIP GAJI';position:absolute;bottom:12px;right:18px;font-size:11px;font-weight:900;letter-spacing:3px;color:rgba(255,255,255,0.04)}
  .sh-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:18px}
  .sh-avatar{width:52px;height:52px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;color:#fff;border:2px solid rgba(249,115,22,0.4)}
  .sh-name{font-size:20px;font-weight:800;color:#fff;margin-bottom:3px}
  .sh-jabatan{font-size:13px;color:var(--or);font-weight:600}
  .sh-periode{font-size:11px;color:rgba(255,255,255,0.35);margin-top:6px;font-family:'JetBrains Mono',monospace}
  .sh-grid{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:12px;padding-top:14px;border-top:1px solid rgba(255,255,255,0.08)}
  .sh-field-label{font-size:9px;font-weight:700;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px}
  .sh-field-val{font-size:12px;font-weight:700;color:#fff}

  /* ── KPI SECTION ── */
  .kpi-section{padding:16px 20px;border-bottom:1px solid var(--s100);background:var(--s50)}
  .kpi-row{display:flex;align-items:center;gap:12px}
  .kpi-bar-track{flex:1;height:10px;background:var(--s200);border-radius:5px;overflow:hidden}
  .kpi-bar-fill{height:100%;border-radius:5px;transition:width 0.5s ease}
  .kpi-score{font-size:22px;font-weight:800;font-family:'JetBrains Mono',monospace;min-width:48px}
  .kpi-detail{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:10px}
  .kpi-d-item{background:var(--white);border:1px solid var(--s200);border-radius:8px;padding:8px 10px;text-align:center}
  .kpi-d-label{font-size:9px;font-weight:700;color:var(--s400);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px}
  .kpi-d-val{font-size:14px;font-weight:800;color:var(--s800)}

  /* ── KOMPONEN GAJI ── */
  .komponen-section{padding:16px 20px}
  .ks-title{font-size:10px;font-weight:800;color:var(--s400);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid var(--s100);display:flex;align-items:center;justify-content:space-between}
  .komp-row{display:flex;align-items:center;padding:9px 0;border-bottom:1px solid var(--s100)}
  .komp-row:last-child{border-bottom:none}
  .komp-label{flex:1;font-size:13px;color:var(--s700);font-weight:500}
  .komp-label.editable{color:var(--s800);font-weight:600}
  .komp-val{font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:700;min-width:120px;text-align:right}
  .komp-input{font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:700;min-width:120px;text-align:right;background:var(--or-pale);border:1.5px solid var(--or-mid);border-radius:7px;padding:4px 10px;outline:none;color:var(--or-d)}
  .komp-input:focus{border-color:var(--or);box-shadow:0 0 0 3px rgba(249,115,22,0.1)}
  .komp-subtotal{display:flex;padding:10px 0;margin-top:2px}
  .ks-label{flex:1;font-size:13px;font-weight:800;color:var(--s800)}
  .ks-val{font-family:'JetBrains Mono',monospace;font-size:14px;font-weight:800;text-align:right;min-width:120px}

  /* ── TAKE HOME ── */
  .takehome-bar{background:linear-gradient(135deg,var(--s900),#1a0a00);margin:0 0 0 0;padding:18px 20px;display:flex;align-items:center;justify-content:space-between}
  .th-label{font-size:12px;font-weight:700;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:1px}
  .th-val{font-size:26px;font-weight:800;color:var(--or);font-family:'JetBrains Mono',monospace}
  .th-note{font-size:11px;color:rgba(255,255,255,0.3);margin-top:3px}

  /* ── ACTION BAR ── */
  .action-bar{padding:14px 20px;border-top:1px solid var(--s100);display:flex;gap:8px;align-items:center}

  /* ── SLIP PRINT VIEW (modal) ── */
  .modal-overlay{position:fixed;inset:0;background:rgba(15,23,42,0.65);display:flex;align-items:center;justify-content:center;z-index:200;backdrop-filter:blur(3px)}
  .modal-card{background:var(--white);border-radius:16px;width:560px;max-height:90vh;overflow-y:auto;box-shadow:0 24px 60px rgba(0,0,0,0.25);animation:popIn 0.2s cubic-bezier(0.34,1.56,0.64,1)}
  @keyframes popIn{from{transform:scale(0.96) translateY(8px);opacity:0}to{transform:scale(1) translateY(0);opacity:1}}
  .mc-head{padding:16px 22px 12px;border-bottom:1px solid var(--s100)}
  .mc-body{padding:18px 22px}
  .mc-foot{padding:12px 22px;border-top:1px solid var(--s100);display:flex;gap:8px;justify-content:flex-end}

  /* ── SLIP PAPER ── */
  .slip-paper{border:2px solid var(--s200);border-radius:10px;overflow:hidden;font-size:12.5px}
  .sp-kop{background:linear-gradient(135deg,var(--s900),#1a0a00);padding:18px 20px;display:flex;align-items:center;gap:12px}
  .sp-logo{width:38px;height:38px;border-radius:9px;background:linear-gradient(135deg,var(--or),var(--or-d));display:flex;align-items:center;justify-content:center;font-size:17px;font-weight:800;color:#fff;flex-shrink:0}
  .sp-kop-text{color:#fff}
  .sp-kop-name{font-size:14px;font-weight:800;letter-spacing:0.3px}
  .sp-kop-sub{font-size:10px;color:rgba(255,255,255,0.4);margin-top:2px}
  .sp-title{text-align:center;padding:12px;background:var(--s50);border-bottom:1px solid var(--s200)}
  .sp-title-text{font-size:13px;font-weight:800;color:var(--s800);text-transform:uppercase;letter-spacing:1px}
  .sp-info{display:grid;grid-template-columns:1fr 1fr;gap:0;border-bottom:1px solid var(--s200)}
  .sp-info-cell{padding:10px 14px;border-right:1px solid var(--s200)}
  .sp-info-cell:nth-child(2){border-right:none}
  .sp-info-label{font-size:10px;font-weight:700;color:var(--s400);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px}
  .sp-info-val{font-size:12px;font-weight:700;color:var(--s800)}
  .sp-table{width:100%;border-collapse:collapse}
  .sp-table td{padding:8px 14px;border-bottom:1px solid var(--s100);font-size:12px}
  .sp-table .sp-section-header td{background:var(--s50);font-size:10px;font-weight:800;color:var(--s400);text-transform:uppercase;letter-spacing:0.7px}
  .sp-table .sp-item-label{color:var(--s700);font-weight:500}
  .sp-table .sp-item-val{text-align:right;font-family:'JetBrains Mono',monospace;font-weight:700}
  .sp-table .sp-debit{color:var(--green)}
  .sp-table .sp-kredit{color:var(--red)}
  .sp-table .sp-subtotal td{background:var(--s50);font-weight:800;font-size:13px}
  .sp-takehome{background:linear-gradient(135deg,var(--s900),#1a0a00);padding:14px;display:flex;justify-content:space-between;align-items:center}
  .sp-th-label{font-size:12px;font-weight:700;color:rgba(255,255,255,0.6)}
  .sp-th-val{font-size:20px;font-weight:800;color:var(--or);font-family:'JetBrains Mono',monospace}
  .sp-ttd{display:grid;grid-template-columns:1fr 1fr;gap:40px;padding:16px 20px}
  .sp-ttd-col{text-align:center;font-size:11px;color:var(--s600)}
  .sp-ttd-line{height:44px;border-bottom:1px solid var(--s400);margin-bottom:4px}
  .sp-ttd-name{font-size:12px;font-weight:700;color:var(--s800)}

  /* ── EDIT INLINE ── */
  .edit-toggle{font-size:10px;font-weight:700;padding:3px 9px;border:1px solid var(--or-mid);background:var(--or-pale);color:var(--or-d);border-radius:6px;cursor:pointer;transition:all 0.12s}
  .edit-toggle:hover{background:var(--or);color:#fff}
  .edit-toggle.active{background:var(--or);color:#fff;border-color:var(--or-d)}

  /* ── BULK ACTION ── */
  .bulk-bar{background:linear-gradient(135deg,var(--or-pale),var(--white));border:1px solid var(--or-mid);border-radius:10px;padding:12px 16px;display:flex;align-items:center;gap:12px;margin-bottom:16px}

  /* ── THR INFO ── */
  .thr-card{border-radius:10px;padding:12px 14px;margin-bottom:10px;display:flex;align-items:center;gap:12px}
  .thr-avatar{width:36px;height:36px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:#fff;flex-shrink:0}

  /* ── BADGE ── */
  .badge{display:inline-flex;align-items:center;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700;white-space:nowrap}

  /* ── BUTTONS ── */
  .btn-primary{background:linear-gradient(135deg,var(--or),var(--or-d));color:#fff;border:none;border-radius:8px;padding:9px 18px;font-size:13px;font-weight:700;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all 0.15s;box-shadow:0 2px 8px rgba(249,115,22,0.25);display:inline-flex;align-items:center;gap:6px}
  .btn-primary:hover{filter:brightness(1.05)}
  .btn-ghost{background:var(--s100);color:var(--s700);border:1px solid var(--s200);border-radius:8px;padding:9px 14px;font-size:12px;font-weight:600;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all 0.15s;display:inline-flex;align-items:center;gap:6px}
  .btn-ghost:hover{background:var(--s200)}
  .btn-green{background:#dcfce7;color:var(--green);border:1px solid #86efac;border-radius:8px;padding:9px 14px;font-size:12px;font-weight:700;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all 0.15s;display:inline-flex;align-items:center;gap:6px}
  .btn-green:hover{background:var(--green);color:#fff}
  .btn-sm{padding:5px 11px;font-size:11px;border-radius:7px}

  /* ── TOAST ── */
  .toaster{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--s900);color:#fff;padding:10px 22px;border-radius:30px;font-size:13px;font-weight:600;z-index:999;box-shadow:0 8px 24px rgba(0,0,0,0.3);animation:toastIn 0.25s ease;white-space:nowrap}
  @keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  .fade-up{animation:fadeUp 0.25s ease forwards}
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
  useEffect(() => { const t = setTimeout(onDone, 2500); return () => clearTimeout(t); }, []);
  return <div className="toaster">{msg}</div>;
}

// ============================================================
// SLIP PRINT MODAL
// ============================================================
function SlipPrintModal({ staff, periode, onClose }) {
  const { pendapatan, potongan, takehome } = calcGaji(staff);
  const kpi = getKPILevel(staff.kpiScore);
  const k = staff.komponen;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="mc-head">
          <div style={{ fontSize: 15, fontWeight: 800, color: "var(--s900)", marginBottom: 2 }}>🖨️ Slip Gaji — {staff.nama}</div>
          <div style={{ fontSize: 12, color: "var(--s400)" }}>{periode} · Siap cetak / kirim WA</div>
        </div>
        <div className="mc-body">
          <div className="slip-paper">
            {/* Kop */}
            <div className="sp-kop">
              <div className="sp-logo">S</div>
              <div className="sp-kop-text">
                <div className="sp-kop-name">Senyum Inn Exclusive Kost</div>
                <div className="sp-kop-sub">Jl. Contoh No. 1, Semarang · HR System</div>
              </div>
            </div>

            <div className="sp-title">
              <div className="sp-title-text">Slip Gaji Karyawan</div>
              <div style={{ fontSize: 11, color: "var(--s400)", marginTop: 2 }}>Periode: {periode}</div>
            </div>

            {/* Info karyawan */}
            <div className="sp-info">
              <div className="sp-info-cell">
                <div className="sp-info-label">Nama</div>
                <div className="sp-info-val">{staff.nama}</div>
              </div>
              <div className="sp-info-cell">
                <div className="sp-info-label">Jabatan</div>
                <div className="sp-info-val">{staff.jabatan}</div>
              </div>
              <div className="sp-info-cell" style={{ borderTop: "1px solid var(--s200)" }}>
                <div className="sp-info-label">Shift</div>
                <div className="sp-info-val">{staff.shift}</div>
              </div>
              <div className="sp-info-cell" style={{ borderTop: "1px solid var(--s200)", borderRight: "none" }}>
                <div className="sp-info-label">Rekening</div>
                <div className="sp-info-val" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11 }}>
                  {staff.rekening.bank} · {staff.rekening.no}
                </div>
              </div>
            </div>

            {/* Tabel gaji */}
            <table className="sp-table">
              <tbody>
                <tr className="sp-section-header"><td colSpan={2}>PENDAPATAN</td></tr>
                <tr><td className="sp-item-label">Gaji Pokok</td><td className="sp-item-val sp-debit">{fmtRp(staff.gajiPokok)}</td></tr>
                <tr><td className="sp-item-label">Insentif / Tunjangan KPI ({kpi.label} — {staff.kpiScore}%)</td><td className="sp-item-val sp-debit">{fmtRp(staff.insentifKPI)}</td></tr>
                {k.lembur > 0 && <tr><td className="sp-item-label">Lembur ({k.lembur / 50000} shift × Rp 50.000)</td><td className="sp-item-val sp-debit">{fmtRp(k.lembur)}</td></tr>}
                {k.lemburTambahan > 0 && <tr><td className="sp-item-label">Lembur Tambahan</td><td className="sp-item-val sp-debit">{fmtRp(k.lemburTambahan)}</td></tr>}
                <tr className="sp-subtotal"><td>Total Pendapatan</td><td className="sp-item-val sp-debit">{fmtRp(pendapatan)}</td></tr>

                <tr className="sp-section-header"><td colSpan={2}>POTONGAN</td></tr>
                {k.potonganIjin > 0 && <tr><td className="sp-item-label">Potongan Ijin Tidak Sah ({k.potonganIjin/50000}hr × Rp 50.000)</td><td className="sp-item-val sp-kredit">({fmtRp(k.potonganIjin)})</td></tr>}
                {k.potonganPinjaman > 0 && <tr><td className="sp-item-label">Cicilan Pinjaman Koperasi</td><td className="sp-item-val sp-kredit">({fmtRp(k.potonganPinjaman)})</td></tr>}
                {k.bpjs > 0 && <tr><td className="sp-item-label">BPJS Ketenagakerjaan (3%)</td><td className="sp-item-val sp-kredit">({fmtRp(k.bpjs)})</td></tr>}
                {k.pajak > 0 && <tr><td className="sp-item-label">PPh 21 / Pajak Penghasilan</td><td className="sp-item-val sp-kredit">({fmtRp(k.pajak)})</td></tr>}
                <tr className="sp-subtotal"><td>Total Potongan</td><td className="sp-item-val sp-kredit">({fmtRp(potongan)})</td></tr>
              </tbody>
            </table>

            <div className="sp-takehome">
              <div>
                <div className="sp-th-label">Gaji Diterima (Take Home Pay)</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 3 }}>
                  Transfer ke {staff.rekening.bank} · {staff.rekening.no}
                </div>
              </div>
              <div className="sp-th-val">{fmtRp(takehome)}</div>
            </div>

            {/* Pinjaman koperasi info */}
            {k.potonganPinjaman > 0 && (
              <div style={{ padding: "10px 14px", background: "var(--s50)", borderTop: "1px solid var(--s200)", fontSize: 11, color: "var(--s600)" }}>
                💰 Cicilan pinjaman koperasi <b>{fmtRp(k.potonganPinjaman)}</b> otomatis ditransfer ke rekening koperasi {REKENING_KOPERASI.bank} {REKENING_KOPERASI.no}
              </div>
            )}

            {/* Tanda tangan */}
            <div className="sp-ttd">
              <div className="sp-ttd-col">
                <div>Mengetahui,</div>
                <div className="sp-ttd-line" />
                <div className="sp-ttd-name">Yusuf Vindra Asmara</div>
                <div>Pemilik / Owner</div>
              </div>
              <div className="sp-ttd-col">
                <div>Penerima,</div>
                <div className="sp-ttd-line" />
                <div className="sp-ttd-name">{staff.nama}</div>
                <div>{staff.jabatan}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="mc-foot">
          <button className="btn-ghost" onClick={onClose}>Tutup</button>
          <button className="btn-ghost" onClick={() => alert("Kirim via WA ke " + staff.rekening.no)}>💬 Kirim WA</button>
          <button className="btn-primary" onClick={() => alert("PDF slip gaji siap cetak!")}>🖨️ Print PDF</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SLIP DETAIL PANEL
// ============================================================
function SlipPanel({ staff, periode, onPay, onPrint, onUpdate }) {
  const [editMode, setEditMode] = useState(false);
  const [komponen, setKomponen] = useState({ ...staff.komponen });

  const { pendapatan, potongan, takehome } = calcGaji({ ...staff, komponen });
  const kpi = getKPILevel(staff.kpiScore);

  const setK = (key, val) => setKomponen(prev => ({ ...prev, [key]: Number(val) || 0 }));

  const handleSave = () => {
    onUpdate(staff.id, komponen);
    setEditMode(false);
  };

  const EditableVal = ({ label, field, color = "var(--green)" }) => (
    <div className="komp-row">
      <div className={`komp-label ${editMode ? "editable" : ""}`}>{label}</div>
      {editMode
        ? <input className="komp-input" type="number" value={komponen[field]} onChange={e => setK(field, e.target.value)} />
        : <div className="komp-val" style={{ color: komponen[field] > 0 ? color : "var(--s400)" }}>
            {komponen[field] > 0 ? (color === "var(--red)" ? `(${fmtRp(komponen[field])})` : fmtRp(komponen[field])) : "—"}
          </div>
      }
    </div>
  );

  return (
    <div className="slip-panel">
      {/* Hero */}
      <div className="slip-hero">
        <div className="sh-top">
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div className="sh-avatar" style={{ background: AVATAR_COLORS[parseInt(staff.id.replace("EMP","")) % AVATAR_COLORS.length] }}>
              {getInitials(staff.nama)}
            </div>
            <div>
              <div className="sh-name">{staff.nama}</div>
              <div className="sh-jabatan">{staff.jabatan} · {staff.shift}</div>
              <div className="sh-periode">{periode} · {staff.id}</div>
            </div>
          </div>
          <div>
            {staff.statusGaji === "lunas"
              ? <span className="badge" style={{ color: "#16a34a", background: "rgba(22,163,74,0.15)", fontSize: 11, padding: "4px 12px" }}>✓ Sudah Dibayar</span>
              : <span className="badge" style={{ color: "#f97316", background: "rgba(249,115,22,0.15)", fontSize: 11, padding: "4px 12px" }}>⏳ Belum Dibayar</span>
            }
          </div>
        </div>
        <div className="sh-grid">
          {[
            { label: "Gaji Pokok",  val: fmtRp(staff.gajiPokok) },
            { label: "Take Home",   val: fmtRp(takehome) },
            { label: "Rekening",    val: `${staff.rekening.bank} ···${staff.rekening.no.slice(-4)}` },
            { label: "Tgl Bayar",   val: staff.tglBayar ? fmtTgl(staff.tglBayar) : "—" },
          ].map(f => (
            <div key={f.label}>
              <div className="sh-field-label">{f.label}</div>
              <div className="sh-field-val">{f.val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* KPI */}
      <div className="kpi-section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--s400)", textTransform: "uppercase", letterSpacing: 0.8 }}>
            KPI Score — Dasar Insentif
          </div>
          <span className="badge" style={{ color: kpi.color, background: kpi.bg, fontSize: 11 }}>
            {kpi.label} → Insentif {fmtRp(kpi.insentif)}
          </span>
        </div>
        <div className="kpi-row">
          <div className="kpi-score" style={{ color: kpi.color }}>{staff.kpiScore}</div>
          <div className="kpi-bar-track">
            <div className="kpi-bar-fill" style={{ width: staff.kpiScore + "%", background: kpi.color }} />
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--s400)", minWidth: 28 }}>100</div>
        </div>
        <div className="kpi-detail">
          {[
            { label: "Hari Masuk", val: staff.absensi.masuk, color: "var(--green)" },
            { label: "Lembur",     val: staff.absensi.lembur, color: "var(--blue)" },
            { label: "Ijin",       val: staff.absensi.ijin, color: "var(--amber)" },
            { label: "Sakit",      val: staff.absensi.sakit, color: "var(--s400)" },
          ].map(d => (
            <div key={d.label} className="kpi-d-item">
              <div className="kpi-d-label">{d.label}</div>
              <div className="kpi-d-val" style={{ color: d.color }}>{d.val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Komponen Gaji */}
      <div className="komponen-section">

        {/* Pendapatan */}
        <div className="ks-title">
          <span>📥 Pendapatan</span>
          <div style={{ display: "flex", gap: 6 }}>
            {editMode
              ? <>
                  <button className="btn-green btn-sm" onClick={handleSave}>✓ Simpan</button>
                  <button className="btn-ghost btn-sm" onClick={() => { setKomponen({ ...staff.komponen }); setEditMode(false); }}>Batal</button>
                </>
              : <button className={`edit-toggle ${editMode ? "active" : ""}`} onClick={() => setEditMode(true)}>✏️ Edit</button>
            }
          </div>
        </div>

        <div className="komp-row">
          <div className="komp-label">Gaji Pokok</div>
          <div className="komp-val" style={{ color: "var(--green)" }}>{fmtRp(staff.gajiPokok)}</div>
        </div>
        <div className="komp-row">
          <div className="komp-label">Insentif / Tunjangan KPI</div>
          <div className="komp-val" style={{ color: "var(--green)" }}>{fmtRp(staff.insentifKPI)}</div>
        </div>
        <EditableVal label="Lembur (shift × Rp 50.000)" field="lembur" color="var(--green)" />
        <EditableVal label="Lembur Tambahan" field="lemburTambahan" color="var(--green)" />

        <div className="komp-subtotal">
          <div className="ks-label">Total Pendapatan</div>
          <div className="ks-val" style={{ color: "var(--green)" }}>{fmtRp(pendapatan)}</div>
        </div>

        <div style={{ height: 1, background: "var(--s200)", margin: "2px 0 10px" }} />

        {/* Potongan */}
        <div className="ks-title"><span>📤 Potongan</span></div>

        <EditableVal label="Potongan Ijin Tidak Sah" field="potonganIjin" color="var(--red)" />
        <EditableVal label="Cicilan Pinjaman Koperasi" field="potonganPinjaman" color="var(--red)" />
        <EditableVal label="BPJS Ketenagakerjaan (3%)" field="bpjs" color="var(--red)" />
        <EditableVal label="PPh 21 / Pajak Penghasilan" field="pajak" color="var(--red)" />

        <div className="komp-subtotal">
          <div className="ks-label">Total Potongan</div>
          <div className="ks-val" style={{ color: "var(--red)" }}>({fmtRp(potongan)})</div>
        </div>

        {/* Koperasi info */}
        {komponen.potonganPinjaman > 0 && (
          <div style={{ background: "var(--s50)", borderRadius: 8, padding: "9px 12px", margin: "8px 0", fontSize: 11, color: "var(--s600)", display: "flex", gap: 8 }}>
            <span>💰</span>
            <span>Cicilan {fmtRp(komponen.potonganPinjaman)} otomatis transfer ke koperasi: {REKENING_KOPERASI.bank} {REKENING_KOPERASI.no}</span>
          </div>
        )}
      </div>

      {/* Take Home */}
      <div className="takehome-bar">
        <div>
          <div className="th-label">Take Home Pay</div>
          <div className="th-note">Transfer ke {staff.rekening.bank} · {staff.rekening.no}</div>
        </div>
        <div className="th-val">{fmtRp(takehome)}</div>
      </div>

      {/* Action bar */}
      <div className="action-bar">
        <button className="btn-ghost" onClick={onPrint}>🖨️ Print Slip</button>
        {staff.statusGaji !== "lunas"
          ? <button className="btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={() => onPay(staff.id)}>
              ✓ Konfirmasi Gaji Dibayar
            </button>
          : <div style={{ flex: 1, textAlign: "center", fontSize: 12, color: "var(--green)", fontWeight: 700 }}>
              ✅ Dibayar pada {fmtTgl(staff.tglBayar)}
            </div>
        }
      </div>
    </div>
  );
}

// ============================================================
// THR TAB
// ============================================================
function THRInfo({ staffList }) {
  // THR saving per bulan = gaji pokok / 12
  const idul_fitri = staffList.filter(s => s.agama === "Islam");
  const natal     = staffList.filter(s => ["Kristen","Katolik"].includes(s.agama));

  const totalTHR = staffList.reduce((sum, s) => sum + s.gajiPokok, 0); // 1 bulan gaji

  return (
    <div>
      <div style={{ background: "linear-gradient(135deg,var(--or-pale),var(--white))", border: "1px solid var(--or-mid)", borderRadius: 12, padding: "14px 16px", marginBottom: 16, display: "flex", gap: 12 }}>
        <span style={{ fontSize: 22 }}>🎁</span>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: "var(--or-dd)", marginBottom: 4 }}>THR Saving — Dianggarkan Tiap Bulan</div>
          <div style={{ fontSize: 12, color: "var(--s600)", lineHeight: 1.6 }}>
            THR dihitung <b>1 bulan gaji pokok</b> untuk karyawan yang sudah bekerja min. 12 bulan.
            Dibayarkan sesuai hari raya agama masing-masing karyawan.
            Alokasi saving bulanan: <b style={{ color: "var(--or-d)" }}>Rp {Math.round(totalTHR / 12).toLocaleString("id-ID")}/bulan</b>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--s400)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Idul Fitri (Islam)</div>
        {idul_fitri.map((s, i) => (
          <div key={s.id} className="thr-card" style={{ background: "var(--or-pale)", border: "1px solid var(--or-mid)" }}>
            <div className="thr-avatar" style={{ background: AVATAR_COLORS[parseInt(s.id.replace("EMP","")) % AVATAR_COLORS.length] }}>
              {getInitials(s.nama)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--s800)" }}>{s.nama}</div>
              <div style={{ fontSize: 11, color: "var(--s400)" }}>{s.jabatan}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: "var(--or-d)", fontFamily: "'JetBrains Mono',monospace" }}>{fmtRp(s.gajiPokok)}</div>
              <div style={{ fontSize: 10, color: "var(--s400)" }}>1× gaji pokok</div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--s400)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Natal / Hari Raya Kristen</div>
        {natal.map((s, i) => (
          <div key={s.id} className="thr-card" style={{ background: "#f0fdf4", border: "1px solid #86efac" }}>
            <div className="thr-avatar" style={{ background: AVATAR_COLORS[parseInt(s.id.replace("EMP","")) % AVATAR_COLORS.length] }}>
              {getInitials(s.nama)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--s800)" }}>{s.nama}</div>
              <div style={{ fontSize: 11, color: "var(--s400)" }}>{s.jabatan}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: "var(--green)", fontFamily: "'JetBrains Mono',monospace" }}>{fmtRp(s.gajiPokok)}</div>
              <div style={{ fontSize: 10, color: "var(--s400)" }}>1× gaji pokok</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: "var(--s50)", border: "1px solid var(--s200)", borderRadius: 10, padding: "12px 14px", marginTop: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--s800)" }}>Total THR yang harus disiapkan</span>
          <span style={{ fontSize: 15, fontWeight: 800, color: "var(--or-d)", fontFamily: "'JetBrains Mono',monospace" }}>{fmtRp(totalTHR)}</span>
        </div>
        <div style={{ fontSize: 11, color: "var(--s400)", marginTop: 4 }}>Saving bulanan: {fmtRp(Math.round(totalTHR / 12))} × 12 bulan</div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN MODULE
// ============================================================
export default function Penggajian({ userRole = "admin" }) {
  const [staffList, setStaffList] = useState(STAFF_DATA);
  const [selected, setSelected] = useState(STAFF_DATA[0]);
  const [activeTab, setActiveTab] = useState("slip");
  const [periode, setPeriode] = useState("Feb 2026");
  const [showPrint, setShowPrint] = useState(false);
  const [toast, setToast] = useState(null);

  const belumBayar = staffList.filter(s => s.statusGaji !== "lunas").length;
  const totalGaji  = staffList.reduce((sum, s) => sum + calcGaji(s).takehome, 0);
  const totalBayar = staffList.filter(s => s.statusGaji === "lunas").reduce((sum, s) => sum + calcGaji(s).takehome, 0);

  const handlePay = (id) => {
    const today = "2026-02-26";
    setStaffList(prev => prev.map(s => s.id === id ? { ...s, statusGaji: "lunas", tglBayar: today } : s));
    setSelected(prev => prev.id === id ? { ...prev, statusGaji: "lunas", tglBayar: today } : prev);
    const nama = staffList.find(s => s.id === id)?.nama;
    setToast(`✓ Gaji ${nama} telah dikonfirmasi dibayar!`);
  };

  const handlePayAll = () => {
    const today = "2026-02-26";
    setStaffList(prev => prev.map(s => ({ ...s, statusGaji: "lunas", tglBayar: today })));
    setSelected(prev => ({ ...prev, statusGaji: "lunas", tglBayar: today }));
    setToast(`✓ Semua gaji ${periode} telah dikonfirmasi!`);
  };

  const handleUpdate = (id, komponen) => {
    setStaffList(prev => prev.map(s => s.id === id ? { ...s, komponen } : s));
    setSelected(prev => prev.id === id ? { ...prev, komponen } : prev);
    setToast("✓ Komponen gaji diperbarui");
  };

  return (
    <div className="fade-up">
      <StyleInjector />

      {/* TOPBAR */}
      <div className="topbar">
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <select className="periode-sel" value={periode} onChange={e => setPeriode(e.target.value)}>
            {PERIODE_LIST.map(p => <option key={p}>{p}</option>)}
          </select>
          <div style={{ display: "flex", gap: 6 }}>
            {["slip", "thr"].map(t => (
              <button key={t} onClick={() => setActiveTab(t)}
                style={{ padding: "7px 16px", borderRadius: 20, border: `1.5px solid ${activeTab === t ? "var(--or)" : "var(--s200)"}`, background: activeTab === t ? "var(--or)" : "var(--white)", color: activeTab === t ? "#fff" : "var(--s600)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                {t === "slip" ? "💰 Slip Gaji" : "🎁 THR"}
              </button>
            ))}
          </div>
        </div>
        <button className="btn-ghost" onClick={() => setToast("📤 Laporan penggajian diekspor")}>
          ↓ Export Excel
        </button>
      </div>

      {/* STAT ROW */}
      <div className="stat-row">
        {[
          { label: "Total Gaji Bulan Ini", val: fmtRp(totalGaji), color: "var(--or)", borderColor: "var(--or)", sub: `${staffList.length} karyawan` },
          { label: "Sudah Dibayar",        val: fmtRp(totalBayar), color: "var(--green)", borderColor: "var(--green)", sub: `${staffList.length - belumBayar} orang` },
          { label: "Belum Dibayar",        val: belumBayar,        color: "var(--red)", borderColor: "var(--red)", sub: `${belumBayar} orang pending`, isCount: true },
          { label: "THR Saving Bulan Ini", val: fmtRp(Math.round(staffList.reduce((s, e) => s + e.gajiPokok, 0) / 12)), color: "var(--purple)", borderColor: "var(--purple)", sub: "Alokasi bulanan" },
        ].map(s => (
          <div key={s.label} className="sc" style={{ borderTopColor: s.borderColor }}>
            <div className="sc-label">{s.label}</div>
            <div className="sc-val" style={{ color: s.color }}>{s.isCount ? s.val : s.val}</div>
            <div className="sc-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Bulk action bar */}
      {belumBayar > 0 && activeTab === "slip" && (
        <div className="bulk-bar">
          <span style={{ fontSize: 18 }}>⚡</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--or-dd)" }}>
              {belumBayar} karyawan belum dibayar — Total {fmtRp(staffList.filter(s => s.statusGaji !== "lunas").reduce((sum, s) => sum + calcGaji(s).takehome, 0))}
            </div>
            <div style={{ fontSize: 11, color: "var(--s600)" }}>Konfirmasi pembayaran setelah transfer dilakukan</div>
          </div>
          <button className="btn-primary" onClick={handlePayAll}>✓ Konfirmasi Semua Dibayar</button>
        </div>
      )}

      {activeTab === "thr" ? (
        <THRInfo staffList={staffList} />
      ) : (
        <div className="layout">
          {/* LEFT — Staff list */}
          <div>
            <div className="staff-list">
              <div className="sl-head">Daftar Karyawan — {periode}</div>
              {staffList.map((s, i) => {
                const { takehome } = calcGaji(s);
                return (
                  <div key={s.id} className={`staff-item ${selected?.id === s.id ? "active" : ""}`} onClick={() => setSelected(s)}>
                    <div className="si-avatar" style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>
                      {getInitials(s.nama)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="si-name">{s.nama}</div>
                      <div className="si-sub">{s.jabatan}</div>
                      <div className="si-gaji">{fmtRp(takehome)}</div>
                    </div>
                    <div>
                      {s.statusGaji === "lunas"
                        ? <span className="badge" style={{ color: "var(--green)", background: "#dcfce7" }}>✓ Lunas</span>
                        : <span className="badge" style={{ color: "var(--amber)", background: "#fef3c7" }}>Pending</span>
                      }
                    </div>
                  </div>
                );
              })}

              {/* Summary */}
              <div style={{ padding: "12px 14px", background: "var(--s50)", borderTop: "2px solid var(--s200)" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--s700)" }}>Total Penggajian</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: "var(--or-d)", fontFamily: "'JetBrains Mono',monospace" }}>{fmtRp(totalGaji)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — Slip detail */}
          {selected && (
            <SlipPanel
              staff={staffList.find(s => s.id === selected.id) || selected}
              periode={periode}
              onPay={handlePay}
              onPrint={() => setShowPrint(true)}
              onUpdate={handleUpdate}
            />
          )}
        </div>
      )}

      {showPrint && selected && (
        <SlipPrintModal
          staff={staffList.find(s => s.id === selected.id) || selected}
          periode={periode}
          onClose={() => setShowPrint(false)}
        />
      )}

      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
