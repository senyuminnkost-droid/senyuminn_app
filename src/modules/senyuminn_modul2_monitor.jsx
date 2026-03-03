import { useState, useEffect } from "react";

// ============================================================
// MOCK DATA
// ============================================================
const KAMAR_DATA = [
  { id:1,  tipe:"Premium", status:"tersedia", harga:2500000, penghuni:null, partner:[], kontrakMulai:null, kontrakSelesai:null, tiketAktif:0, fasilitas:[] },
  { id:2,  tipe:"Reguler", status:"tersedia", harga:1800000, penghuni:null, partner:[], kontrakMulai:null, kontrakSelesai:null, tiketAktif:0, fasilitas:[] },
  { id:3,  tipe:"Reguler", status:"tersedia", harga:1800000, penghuni:null, partner:[], kontrakMulai:null, kontrakSelesai:null, tiketAktif:0, fasilitas:[] },
  { id:4,  tipe:"Premium", status:"tersedia", harga:2500000, penghuni:null, partner:[], kontrakMulai:null, kontrakSelesai:null, tiketAktif:0, fasilitas:[] },
  { id:5,  tipe:"Reguler", status:"tersedia", harga:1800000, penghuni:null, partner:[], kontrakMulai:null, kontrakSelesai:null, tiketAktif:0, fasilitas:[] },
  { id:6,  tipe:"Reguler", status:"tersedia", harga:1800000, penghuni:null, partner:[], kontrakMulai:null, kontrakSelesai:null, tiketAktif:0, fasilitas:[] },
  { id:7,  tipe:"Premium", status:"tersedia", harga:2650000, penghuni:null, partner:[], kontrakMulai:null, kontrakSelesai:null, tiketAktif:0, fasilitas:["Kulkas"] },
  { id:8,  tipe:"Reguler", status:"tersedia", harga:1800000, penghuni:null, partner:[], kontrakMulai:null, kontrakSelesai:null, tiketAktif:0, fasilitas:[] },
  { id:9,  tipe:"Reguler", status:"tersedia", harga:1800000, penghuni:null, partner:[], kontrakMulai:null, kontrakSelesai:null, tiketAktif:0, fasilitas:[] },
  { id:10, tipe:"Premium", status:"tersedia", harga:2500000, penghuni:null, partner:[], kontrakMulai:null, kontrakSelesai:null, tiketAktif:0, fasilitas:[] },
  { id:11, tipe:"Reguler", status:"tersedia", harga:1800000, penghuni:null, partner:[], kontrakMulai:null, kontrakSelesai:null, tiketAktif:0, fasilitas:[] },
  { id:12, tipe:"Premium", status:"tersedia", harga:2500000, penghuni:null, partner:[], kontrakMulai:null, kontrakSelesai:null, tiketAktif:0, fasilitas:[] },
];

const TIKET_DATA = [];

const RIWAYAT_SERVICE = {
  1: [
    { tanggal: "2026-02-20", jenis: "Weekly Service", status: "selesai", staff: "Krisna" },
    { tanggal: "2026-02-13", jenis: "Weekly Service", status: "selesai", staff: "Krisna" },
    { tanggal: "2026-02-06", jenis: "Weekly Service", status: "selesai", staff: "Gurit" },
  ],
  9: [
    { tanggal: "2026-02-21", jenis: "Weekly Service", status: "selesai", staff: "Krisna" },
    { tanggal: "2026-02-14", jenis: "Weekly Service", status: "selesai", staff: "Krisna" },
    { tanggal: "2026-01-15", jenis: "Deep Clean", status: "selesai", staff: "Krisna + Gurit" },
  ],
};

// ============================================================
// HELPERS
// ============================================================
const formatRupiah = (n) => "Rp " + n.toLocaleString("id-ID");

const STATUS_CFG = {
  "tersedia":    { label: "Tersedia",    color: "#15803d", bg: "#dcfce7", border: "#86efac", dot: "#22c55e" },
  "booked":      { label: "Booked",      color: "#92400e", bg: "#fef3c7", border: "#fcd34d", dot: "#f59e0b" },
  "terisi":      { label: "Terisi",      color: "#991b1b", bg: "#fee2e2", border: "#fca5a5", dot: "#ef4444" },
  "deep-clean":  { label: "Deep Clean",  color: "#1e40af", bg: "#dbeafe", border: "#93c5fd", dot: "#3b82f6" },
  "maintenance": { label: "Maintenance", color: "#9a3412", bg: "#ffedd5", border: "#fdba74", dot: "#f97316" },
};

const TIKET_CFG = {
  "open":        { label: "Open",        color: "#dc2626", bg: "#fee2e2" },
  "in-progress": { label: "In Progress", color: "#d97706", bg: "#fef3c7" },
  "ditunda":     { label: "Ditunda",     color: "#7c3aed", bg: "#ede9fe" },
  "selesai":     { label: "Selesai",     color: "#15803d", bg: "#dcfce7" },
};

const PRIORITAS_CFG = {
  "urgent": { label: "URGENT", color: "#dc2626", bg: "#fee2e2" },
  "normal": { label: "Normal", color: "#6b7280", bg: "#f3f4f6" },
};

const hariSisa = (tgl) => {
  if (!tgl) return null;
  const diff = Math.ceil((new Date(tgl) - new Date("2026-02-27")) / 86400000);
  return diff;
};

// ============================================================
// CSS
// ============================================================
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --orange: #f97316;
    --orange-dark: #ea580c;
    --orange-deep: #c2410c;
    --orange-pale: #fff7ed;
    --orange-light: #ffedd5;
    --orange-mid: #fed7aa;
    --slate-900: #0f172a;
    --slate-800: #1e293b;
    --slate-700: #334155;
    --slate-600: #475569;
    --slate-500: #64748b;
    --slate-400: #94a3b8;
    --slate-200: #e2e8f0;
    --slate-100: #f1f5f9;
    --slate-50: #f8fafc;
    --white: #ffffff;
    --sidebar-w: 228px;
  }

  body { font-family: 'Plus Jakarta Sans', sans-serif; background: var(--slate-50); }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--slate-200); border-radius: 4px; }

  /* ── LAYOUT ─────────────────────────────── */
  .app { display: flex; height: 100vh; overflow: hidden; }
  .sidebar {
    width: var(--sidebar-w);
    background: var(--slate-900);
    display: flex; flex-direction: column; flex-shrink: 0;
    position: relative;
  }
  .sidebar::after {
    content: '';
    position: absolute; top: 0; right: 0;
    width: 1px; height: 100%;
    background: linear-gradient(180deg, transparent, rgba(249,115,22,0.25), transparent);
  }
  .sidebar-logo {
    padding: 18px 16px 14px;
    display: flex; align-items: center; gap: 10px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .logo-mark {
    width: 36px; height: 36px; border-radius: 9px;
    background: linear-gradient(135deg, var(--orange), var(--orange-dark));
    display: flex; align-items: center; justify-content: center;
    font-size: 17px; font-weight: 800; color: #fff; flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(249,115,22,0.4);
  }
  .logo-name { font-size: 12px; font-weight: 800; color: #fff; }
  .logo-sub  { font-size: 9px; font-weight: 600; color: var(--orange); letter-spacing: 1.5px; text-transform: uppercase; margin-top: 1px; }

  .sidebar-nav { flex: 1; overflow-y: auto; padding: 6px 0; }
  .nav-sec-label { padding: 10px 16px 3px; font-size: 9px; font-weight: 700; letter-spacing: 1.5px; color: rgba(255,255,255,0.2); text-transform: uppercase; }
  .nav-item {
    display: flex; align-items: center; gap: 8px;
    padding: 6.5px 12px; margin: 1px 8px; border-radius: 7px;
    cursor: pointer; font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.45);
    transition: all 0.12s;
  }
  .nav-item:hover { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.75); }
  .nav-item.active {
    background: linear-gradient(135deg, var(--orange), var(--orange-dark));
    color: #fff; font-weight: 700;
    box-shadow: 0 3px 10px rgba(249,115,22,0.35);
  }
  .nav-icon { width: 16px; text-align: center; flex-shrink: 0; font-size: 12px; }
  .sidebar-user {
    padding: 10px 14px; border-top: 1px solid rgba(255,255,255,0.05);
    display: flex; align-items: center; gap: 9px;
  }
  .user-av {
    width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, var(--orange), var(--orange-dark));
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 800; color: #fff;
  }
  .user-name { font-size: 11px; font-weight: 700; color: #fff; }
  .user-role { font-size: 10px; color: rgba(255,255,255,0.3); margin-top: 1px; }
  .logout-btn { margin-left: auto; background: none; border: none; cursor: pointer; color: rgba(255,255,255,0.25); font-size: 14px; border-radius: 5px; padding: 3px 5px; transition: all 0.12s; }
  .logout-btn:hover { color: #ef4444; background: rgba(239,68,68,0.1); }

  /* ── MAIN ────────────────────────────────── */
  .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
  .header {
    background: var(--white); border-bottom: 1px solid var(--slate-200);
    padding: 0 22px; height: 52px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: space-between;
  }
  .header-title { font-size: 13px; font-weight: 800; color: var(--slate-900); }
  .header-sub { font-size: 10px; color: var(--slate-400); margin-top: 1px; }
  .header-actions { display: flex; align-items: center; gap: 8px; }
  .content { flex: 1; overflow-y: auto; padding: 18px 22px; }

  /* ── TOP BAR ─────────────────────────────── */
  .top-bar { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; }

  /* ── STATUS SUMMARY STRIP ────────────────── */
  .status-strip { display: flex; gap: 10px; margin-bottom: 18px; }
  .status-chip {
    display: flex; align-items: center; gap: 8px;
    background: var(--white); border: 1.5px solid var(--slate-200);
    border-radius: 10px; padding: 10px 14px; cursor: pointer;
    transition: all 0.15s; flex: 1;
  }
  .status-chip:hover { border-color: var(--orange-mid); box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
  .status-chip.active { border-color: transparent; box-shadow: 0 3px 12px rgba(0,0,0,0.08); }
  .chip-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
  .chip-label { font-size: 11px; font-weight: 600; color: var(--slate-500); }
  .chip-count { font-size: 20px; font-weight: 800; }

  /* ── FILTER BAR ──────────────────────────── */
  .filter-bar { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
  .filter-tag {
    padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;
    cursor: pointer; border: 1.5px solid var(--slate-200); color: var(--slate-500);
    background: var(--white); transition: all 0.12s;
  }
  .filter-tag:hover { border-color: var(--orange-mid); color: var(--orange-dark); }
  .filter-tag.active { background: var(--orange); border-color: var(--orange); color: #fff; }

  .search-box {
    display: flex; align-items: center; gap: 7px;
    background: var(--white); border: 1.5px solid var(--slate-200);
    border-radius: 8px; padding: 6px 12px; font-size: 12px; color: var(--slate-400);
    flex: 1; max-width: 260px; cursor: pointer;
    transition: border-color 0.12s;
  }
  .search-box:focus-within { border-color: var(--orange); }
  .search-input { border: none; outline: none; background: transparent; font-size: 12px; color: var(--slate-700); width: 100%; font-family: 'Plus Jakarta Sans', sans-serif; }
  .search-input::placeholder { color: var(--slate-400); }

  .result-count { font-size: 11px; color: var(--slate-400); font-weight: 500; margin-left: auto; }

  /* ── KAMAR GRID ──────────────────────────── */
  .kamar-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }

  .kamar-card {
    background: var(--white); border-radius: 12px; overflow: hidden;
    cursor: pointer; transition: all 0.15s;
    border: 1.5px solid var(--slate-200);
    position: relative;
  }
  .kamar-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.1); transform: translateY(-2px); border-color: var(--orange-mid); }

  .kamar-card-top { height: 5px; }

  .kamar-card-body { padding: 14px; }

  .kamar-num-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
  .kamar-num { font-size: 18px; font-weight: 800; color: var(--slate-900); font-family: 'DM Mono', monospace; }
  .kamar-tipe-badge {
    font-size: 9px; font-weight: 700; padding: 2px 7px; border-radius: 10px; text-transform: uppercase; letter-spacing: 0.5px;
  }

  .kamar-status-badge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 9px; border-radius: 20px; font-size: 10px; font-weight: 700;
    border: 1px solid transparent;
    margin-bottom: 10px;
  }
  .status-dot-sm { width: 5px; height: 5px; border-radius: 50%; }

  .kamar-penghuni { margin-bottom: 10px; }
  .penghuni-name { font-size: 13px; font-weight: 700; color: var(--slate-800); display: flex; align-items: center; gap: 5px; }
  .partner-tag { font-size: 10px; color: var(--slate-500); margin-top: 2px; }
  .no-penghuni { font-size: 12px; color: var(--slate-400); font-style: italic; }

  .kamar-kontrak { font-size: 10.5px; color: var(--slate-400); font-family: 'DM Mono', monospace; margin-bottom: 10px; }
  .kontrak-warning { color: #d97706; font-weight: 600; }
  .kontrak-danger  { color: #dc2626; font-weight: 700; }

  .kamar-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 10px; border-top: 1px solid var(--slate-100); }
  .kamar-harga { font-size: 12px; font-weight: 700; color: var(--orange-dark); }
  .kamar-harga span { font-size: 10px; font-weight: 500; color: var(--slate-400); }

  .tiket-badge {
    display: flex; align-items: center; gap: 3px;
    background: #fee2e2; color: #dc2626; padding: 2px 7px; border-radius: 10px; font-size: 10px; font-weight: 700;
  }

  .detail-arrow { font-size: 11px; color: var(--orange); font-weight: 700; opacity: 0; transition: opacity 0.15s; }
  .kamar-card:hover .detail-arrow { opacity: 1; }

  /* ── EMPTY STATE ─────────────────────────── */
  .empty-state { text-align: center; padding: 60px 20px; color: var(--slate-400); }
  .empty-icon { font-size: 48px; margin-bottom: 12px; }
  .empty-title { font-size: 15px; font-weight: 700; color: var(--slate-700); margin-bottom: 4px; }

  /* ── DRAWER ──────────────────────────────── */
  .drawer-overlay {
    position: fixed; inset: 0;
    background: rgba(15,23,42,0.45);
    backdrop-filter: blur(4px);
    z-index: 200;
    display: flex; justify-content: flex-end;
    animation: fadeIn 0.2s ease;
  }

  .drawer {
    width: 480px; max-width: 92vw;
    background: var(--white);
    height: 100%; display: flex; flex-direction: column;
    overflow: hidden;
    box-shadow: -8px 0 40px rgba(0,0,0,0.15);
    animation: slideIn 0.25s cubic-bezier(0.4,0,0.2,1);
  }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }

  .drawer-header {
    padding: 18px 20px 14px;
    border-bottom: 1px solid var(--slate-100);
    flex-shrink: 0;
  }
  .drawer-header-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
  .drawer-kamar-num { font-size: 26px; font-weight: 800; color: var(--slate-900); font-family: 'DM Mono', monospace; }
  .drawer-close {
    width: 30px; height: 30px; border-radius: 8px;
    background: var(--slate-100); border: none; cursor: pointer; font-size: 16px;
    display: flex; align-items: center; justify-content: center; color: var(--slate-500);
    transition: all 0.12s;
  }
  .drawer-close:hover { background: #fee2e2; color: #dc2626; }

  .drawer-tabs { display: flex; gap: 4px; margin-top: 10px; }
  .drawer-tab {
    padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 600;
    cursor: pointer; color: var(--slate-500); transition: all 0.12s;
    border: 1.5px solid transparent;
  }
  .drawer-tab:hover { background: var(--slate-100); }
  .drawer-tab.active { background: var(--orange-light); color: var(--orange-dark); border-color: var(--orange-mid); }

  .drawer-body { flex: 1; overflow-y: auto; padding: 16px 20px; }

  /* ── DRAWER SECTIONS ─────────────────────── */
  .d-section { margin-bottom: 18px; }
  .d-section-label {
    font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px;
    color: var(--slate-400); margin-bottom: 10px;
    display: flex; align-items: center; gap: 6px;
  }
  .d-section-label::after { content: ''; flex: 1; height: 1px; background: var(--slate-100); }

  .d-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .d-info-item { background: var(--slate-50); border-radius: 8px; padding: 10px 12px; }
  .d-info-key { font-size: 10px; color: var(--slate-400); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px; }
  .d-info-val { font-size: 13px; font-weight: 700; color: var(--slate-800); }
  .d-info-val.mono { font-family: 'DM Mono', monospace; font-size: 12px; }
  .d-info-val.green { color: #15803d; }
  .d-info-val.red   { color: #dc2626; }
  .d-info-val.orange { color: var(--orange-dark); }

  .d-penghuni-card {
    background: linear-gradient(135deg, var(--orange-pale), #fff);
    border: 1px solid var(--orange-mid); border-radius: 10px; padding: 14px;
  }
  .d-penghuni-name { font-size: 16px; font-weight: 800; color: var(--slate-900); margin-bottom: 4px; }
  .d-penghuni-meta { font-size: 12px; color: var(--slate-500); }
  .d-partner-list { margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--orange-mid); }
  .d-partner-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--slate-600); margin-bottom: 4px; }

  .d-kontrak-row { display: flex; gap: 8px; margin-top: 10px; }
  .d-kontrak-item { flex: 1; background: var(--slate-50); border-radius: 8px; padding: 8px 10px; }

  .d-fasil-chips { display: flex; flex-wrap: wrap; gap: 6px; }
  .d-fasil-chip {
    display: flex; align-items: center; gap: 4px;
    background: var(--white); border: 1.5px solid var(--slate-200);
    border-radius: 20px; padding: 4px 10px; font-size: 11px; font-weight: 600; color: var(--slate-600);
  }

  .d-service-row { display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--slate-100); }
  .d-service-row:last-child { border-bottom: none; }
  .d-service-label { font-size: 12px; font-weight: 600; color: var(--slate-700); }
  .d-service-val   { font-size: 11px; color: var(--slate-500); font-family: 'DM Mono', monospace; }

  .d-tiket-item { border-radius: 9px; padding: 10px 12px; margin-bottom: 8px; border: 1px solid; }
  .d-tiket-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
  .d-tiket-kat { font-size: 12px; font-weight: 700; color: var(--slate-800); }
  .d-tiket-desc { font-size: 11px; color: var(--slate-500); }
  .d-tiket-meta { margin-top: 6px; display: flex; gap: 8px; }

  .d-riwayat-item { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid var(--slate-100); }
  .d-riwayat-item:last-child { border-bottom: none; }
  .d-riwayat-dot { width: 8px; height: 8px; border-radius: 50%; background: #22c55e; flex-shrink: 0; }
  .d-riwayat-info { flex: 1; }
  .d-riwayat-jenis { font-size: 12px; font-weight: 600; color: var(--slate-700); }
  .d-riwayat-tgl   { font-size: 10px; color: var(--slate-400); font-family: 'DM Mono', monospace; }
  .d-riwayat-staff  { font-size: 11px; color: var(--slate-400); }

  /* ── DRAWER FOOTER ───────────────────────── */
  .drawer-footer {
    padding: 12px 20px; border-top: 1px solid var(--slate-100); flex-shrink: 0;
    display: flex; gap: 8px;
  }
  .btn-primary {
    flex: 1; padding: 9px 14px; border-radius: 9px; font-size: 12px; font-weight: 700;
    background: linear-gradient(135deg, var(--orange), var(--orange-dark));
    color: #fff; border: none; cursor: pointer; font-family: inherit;
    box-shadow: 0 3px 10px rgba(249,115,22,0.3); transition: all 0.15s;
    display: flex; align-items: center; justify-content: center; gap: 5px;
  }
  .btn-primary:hover { filter: brightness(1.05); }
  .btn-ghost {
    flex: 1; padding: 9px 14px; border-radius: 9px; font-size: 12px; font-weight: 600;
    background: var(--slate-100); color: var(--slate-600); border: none; cursor: pointer; font-family: inherit; transition: all 0.15s;
    display: flex; align-items: center; justify-content: center; gap: 5px;
  }
  .btn-ghost:hover { background: var(--slate-200); }

  /* ── BADGE ───────────────────────────────── */
  .badge {
    display: inline-flex; align-items: center; gap: 3px;
    padding: 2px 8px; border-radius: 20px; font-size: 10px; font-weight: 700;
  }

  /* ── ANIMASI ─────────────────────────────── */
  @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  .fade-up { animation: fadeUp 0.25s ease forwards; }

  @keyframes pulse-live { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
  .pulse { animation: pulse-live 2s ease infinite; }
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
// BADGE
// ============================================================
function Badge({ color, bg, children }) {
  return <span className="badge" style={{ color, background: bg }}>{children}</span>;
}

// ============================================================
// STATUS CHIP (Summary Strip)
// ============================================================
function StatusChip({ statusKey, count, active, onClick }) {
  const cfg = STATUS_CFG[statusKey];
  return (
    <div
      className={`status-chip ${active ? "active" : ""}`}
      style={active ? { background: cfg.bg, borderColor: cfg.border } : {}}
      onClick={onClick}
    >
      <div className="chip-dot pulse" style={{ background: cfg.dot }} />
      <div>
        <div className="chip-label">{cfg.label}</div>
        <div className="chip-count" style={{ color: cfg.color }}>{count}</div>
      </div>
    </div>
  );
}

// ============================================================
// KAMAR CARD
// ============================================================
function KamarCard({ kamar, onClick }) {
  const cfg = STATUS_CFG[kamar.status];
  const sisa = hariSisa(kamar.kontrakSelesai);
  const kontrakClass = sisa !== null && sisa <= 14 ? "kontrak-danger" : sisa !== null && sisa <= 30 ? "kontrak-warning" : "";

  return (
    <div className="kamar-card" onClick={onClick}
      style={{ borderTopColor: cfg.dot }}
    >
      <div className="kamar-card-top" style={{ background: `linear-gradient(90deg, ${cfg.dot}, ${cfg.color})` }} />
      <div className="kamar-card-body">
        {/* Header row */}
        <div className="kamar-num-row">
          <div>
            <div className="kamar-num">K{String(kamar.id).padStart(2, "0")}</div>
            <div className="kamar-tipe-badge"
              style={{
                background: kamar.tipe === "Premium" ? "#fff7ed" : "#f8fafc",
                color: kamar.tipe === "Premium" ? "#c2410c" : "#475569",
              }}>
              {kamar.tipe === "Premium" ? "⭑ Premium" : "Reguler"}
            </div>
          </div>
          <div>
            <div className="kamar-status-badge" style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}>
              <div className="status-dot-sm pulse" style={{ background: cfg.dot }} />
              {cfg.label}
            </div>
          </div>
        </div>

        {/* Penghuni */}
        <div className="kamar-penghuni">
          {kamar.penghuni ? (
            <>
              <div className="penghuni-name">
                <span>👤</span> {kamar.penghuni}
              </div>
              {kamar.partner.length > 0 && (
                <div className="partner-tag">+ {kamar.partner.length} partner ({kamar.partner.join(", ")})</div>
              )}
            </>
          ) : (
            <div className="no-penghuni">
              {kamar.status === "deep-clean" ? "✨ Sedang deep clean" :
               kamar.status === "maintenance" ? "🔧 Sedang maintenance" :
               "Tidak ada penghuni"}
            </div>
          )}
        </div>

        {/* Kontrak */}
        {kamar.kontrakSelesai && (
          <div className={`kamar-kontrak ${kontrakClass}`}>
            📅 {kamar.kontrakMulai} → {kamar.kontrakSelesai}
            {sisa !== null && sisa <= 30 && (
              <span style={{ marginLeft: 4 }}>({sisa}h lagi)</span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="kamar-footer">
          <div className="kamar-harga">
            {formatRupiah(kamar.harga)}<span>/bln</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {kamar.tiketAktif > 0 && (
              <div className="tiket-badge">⚑ {kamar.tiketAktif}</div>
            )}
            <div className="detail-arrow">Detail →</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// DETAIL DRAWER
// ============================================================
function DetailDrawer({ kamar, onClose }) {
  const [activeTab, setActiveTab] = useState("info");
  const cfg = STATUS_CFG[kamar.status];
  const sisa = hariSisa(kamar.kontrakSelesai);
  const tiketKamar = TIKET_DATA.filter(t => t.kamar === kamar.id);
  const riwayat = RIWAYAT_SERVICE[kamar.id] || [];

  const TABS = [
    { id: "info", label: "Info & Penghuni" },
    { id: "service", label: "Layanan" },
    { id: "tiket", label: `Tiket (${tiketKamar.length})` },
    { id: "riwayat", label: "Riwayat" },
  ];

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-header">
          <div className="drawer-header-top">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div className="drawer-kamar-num">Kamar {kamar.id}</div>
                <div className="kamar-status-badge" style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}>
                  <div className="status-dot-sm pulse" style={{ background: cfg.dot }} />
                  {cfg.label}
                </div>
                {kamar.tipe === "Premium" && (
                  <Badge color="#c2410c" bg="#fff7ed">⭑ Premium</Badge>
                )}
              </div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 3 }}>Lt. {kamar.lantai} · {formatRupiah(kamar.harga)}/bulan</div>
            </div>
            <button className="drawer-close" onClick={onClose}>✕</button>
          </div>
          <div className="drawer-tabs">
            {TABS.map(t => (
              <div key={t.id} className={`drawer-tab ${activeTab === t.id ? "active" : ""}`} onClick={() => setActiveTab(t.id)}>
                {t.label}
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="drawer-body">
          {/* TAB: INFO */}
          {activeTab === "info" && (
            <div>
              {kamar.penghuni ? (
                <>
                  <div className="d-section">
                    <div className="d-section-label">Data Penghuni</div>
                    <div className="d-penghuni-card">
                      <div className="d-penghuni-name">👤 {kamar.penghuni}</div>
                      <div className="d-penghuni-meta">📞 {kamar.noHP || "—"}</div>
                      {kamar.partner.length > 0 && (
                        <div className="d-partner-list">
                          <div style={{ fontSize: 10, fontWeight: 700, color: "#92400e", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Partner Penghuni</div>
                          {kamar.partner.map((p, i) => (
                            <div key={i} className="d-partner-item">
                              <span>👥</span> {p}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="d-section">
                    <div className="d-section-label">Kontrak Sewa</div>
                    <div className="d-kontrak-row">
                      <div className="d-kontrak-item">
                        <div className="d-info-key">Mulai</div>
                        <div className="d-info-val mono">{kamar.kontrakMulai}</div>
                      </div>
                      <div className="d-kontrak-item">
                        <div className="d-info-key">Selesai</div>
                        <div className={`d-info-val mono ${sisa !== null && sisa <= 30 ? (sisa <= 14 ? "red" : "orange") : ""}`}>
                          {kamar.kontrakSelesai}
                        </div>
                      </div>
                    </div>
                    {sisa !== null && (
                      <div style={{ marginTop: 8, padding: "8px 12px", borderRadius: 8, background: sisa <= 14 ? "#fee2e2" : sisa <= 30 ? "#fef3c7" : "#dcfce7", fontSize: 12, fontWeight: 600, color: sisa <= 14 ? "#dc2626" : sisa <= 30 ? "#b45309" : "#15803d" }}>
                        {sisa <= 0 ? "⚠️ Kontrak sudah habis!" :
                         sisa <= 14 ? `🔴 Kontrak habis ${sisa} hari lagi — URGENT` :
                         sisa <= 30 ? `⚠️ Kontrak habis ${sisa} hari lagi` :
                         `✅ ${sisa} hari sisa kontrak`}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 10, padding: 16, marginBottom: 16, textAlign: "center" }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>
                    {kamar.status === "tersedia" ? "🟢" : kamar.status === "deep-clean" ? "✨" : kamar.status === "booked" ? "📅" : "🔧"}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: cfg.color }}>{cfg.label}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>
                    {kamar.status === "tersedia" && "Kamar siap untuk disewakan"}
                    {kamar.status === "deep-clean" && "Sedang proses deep clean post check-out"}
                    {kamar.status === "maintenance" && "Sedang dalam perbaikan"}
                    {kamar.status === "booked" && `Check-in direncanakan: ${kamar.kontrakMulai}`}
                  </div>
                  {kamar.status === "booked" && kamar.penghuni && (
                    <div style={{ marginTop: 10, fontWeight: 700, color: cfg.color }}>👤 {kamar.penghuni}</div>
                  )}
                </div>
              )}

              <div className="d-section">
                <div className="d-section-label">Fasilitas Kamar</div>
                <div className="d-fasil-chips">
                  {kamar.fasilitas.map((f, i) => (
                    <div key={i} className="d-fasil-chip">
                      {f === "AC" ? "❄️" : f === "WiFi" ? "📶" : f === "Kulkas" ? "🧊" : f === "Lemari" ? "🚪" : "🖥️"} {f}
                    </div>
                  ))}
                </div>
              </div>

              <div className="d-section">
                <div className="d-section-label">Info Tambahan</div>
                <div className="d-info-grid">
                  <div className="d-info-item">
                    <div className="d-info-key">Tipe Kamar</div>
                    <div className="d-info-val">{kamar.tipe}</div>
                  </div>
                  <div className="d-info-item">
                    <div className="d-info-key">Lantai</div>
                    <div className="d-info-val">Lantai {kamar.lantai}</div>
                  </div>
                  <div className="d-info-item">
                    <div className="d-info-key">Harga Sewa</div>
                    <div className="d-info-val orange">{formatRupiah(kamar.harga)}</div>
                  </div>
                  <div className="d-info-item">
                    <div className="d-info-key">Tiket Aktif</div>
                    <div className={`d-info-val ${kamar.tiketAktif > 0 ? "red" : "green"}`}>
                      {kamar.tiketAktif > 0 ? `${kamar.tiketAktif} open` : "Tidak ada"}
                    </div>
                  </div>
                </div>
                {kamar.catatan && (
                  <div style={{ marginTop: 10, background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: "8px 10px", fontSize: 12, color: "#92400e" }}>
                    📝 {kamar.catatan}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: LAYANAN */}
          {activeTab === "service" && (
            <div>
              <div className="d-section">
                <div className="d-section-label">Status Layanan</div>
                {[
                  { label: "Weekly Service Terakhir", val: kamar.lastService, icon: "🧹" },
                  { label: "Service AC Terakhir", val: kamar.lastAC, icon: "❄️" },
                  { label: "Deep Clean Terakhir", val: kamar.status === "deep-clean" ? "Sedang berlangsung ✨" : "Des 2025", icon: "✨" },
                  { label: "Jadwal AC Berikutnya", val: "Maret 2026", icon: "📅" },
                ].map((s, i) => (
                  <div key={i} className="d-service-row">
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span>{s.icon}</span>
                      <div className="d-service-label">{s.label}</div>
                    </div>
                    <div className="d-service-val">{s.val}</div>
                  </div>
                ))}
              </div>

              <div className="d-section">
                <div className="d-section-label">Progress Weekly Bulan Ini</div>
                <div style={{ background: "#f8fafc", borderRadius: 10, padding: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#475569" }}>Telah dilakukan</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#f97316" }}>4 / 4 kali</span>
                  </div>
                  <div style={{ height: 8, background: "#e2e8f0", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: "100%", background: "linear-gradient(90deg, #f97316, #ea580c)", borderRadius: 4 }} />
                  </div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 6 }}>Semua jadwal bulan Feb terpenuhi ✅</div>
                </div>
              </div>

              {kamar.status === "maintenance" && (
                <div style={{ background: "#ffedd5", border: "1px solid #fdba74", borderRadius: 10, padding: 14 }}>
                  <div style={{ fontWeight: 700, color: "#c2410c", marginBottom: 6 }}>🔧 Status Maintenance</div>
                  <div style={{ fontSize: 12, color: "#92400e" }}>
                    {tiketKamar.length} tiket perbaikan aktif untuk kamar ini.
                    Kamar tidak tersedia sampai semua perbaikan selesai.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: TIKET */}
          {activeTab === "tiket" && (
            <div>
              <div className="d-section">
                <div className="d-section-label">Tiket Keluhan Aktif</div>
                {tiketKamar.length === 0 ? (
                  <div className="empty-state" style={{ padding: "30px 0" }}>
                    <div className="empty-icon">✅</div>
                    <div className="empty-title">Tidak ada tiket aktif</div>
                  </div>
                ) : (
                  tiketKamar.map(t => (
                    <div key={t.id} className="d-tiket-item"
                      style={{ background: TIKET_CFG[t.status].bg, borderColor: TIKET_CFG[t.status].color + "33" }}>
                      <div className="d-tiket-top">
                        <div className="d-tiket-kat">#{t.id} · {t.kategori}</div>
                        <Badge color={TIKET_CFG[t.status].color} bg={TIKET_CFG[t.status].bg + "88"}>
                          {TIKET_CFG[t.status].label}
                        </Badge>
                      </div>
                      <div className="d-tiket-desc">{t.deskripsi}</div>
                      <div className="d-tiket-meta">
                        <Badge color={PRIORITAS_CFG[t.prioritas].color} bg={PRIORITAS_CFG[t.prioritas].bg}>
                          {PRIORITAS_CFG[t.prioritas].label}
                        </Badge>
                        <span style={{ fontSize: 10, color: "#94a3b8", fontFamily: "'DM Mono', monospace" }}>{t.tanggal}</span>
                        {t.biaya && (
                          <span style={{ fontSize: 10, color: "#f97316", fontWeight: 700 }}>Est. {formatRupiah(t.biaya)}</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: RIWAYAT */}
          {activeTab === "riwayat" && (
            <div>
              <div className="d-section">
                <div className="d-section-label">Riwayat Layanan</div>
                {riwayat.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "24px 0", color: "#94a3b8", fontSize: 13 }}>
                    Belum ada riwayat tersimpan
                  </div>
                ) : (
                  riwayat.map((r, i) => (
                    <div key={i} className="d-riwayat-item">
                      <div className="d-riwayat-dot" />
                      <div className="d-riwayat-info">
                        <div className="d-riwayat-jenis">{r.jenis}</div>
                        <div className="d-riwayat-tgl">{r.tanggal}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div className="d-riwayat-staff">👤 {r.staff}</div>
                        <Badge color="#15803d" bg="#dcfce7">{r.status}</Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="drawer-footer">
          <button className="btn-primary">⚑ Buat Tiket Keluhan</button>
          {kamar.status === "tersedia" && (
            <button className="btn-primary" style={{ background: "linear-gradient(135deg, #16a34a, #15803d)", boxShadow: "0 3px 10px rgba(22,163,74,0.3)" }}>
              🔑 Booking Kamar
            </button>
          )}
          {kamar.penghuni && (
            <button className="btn-ghost">📋 Perpanjang Kontrak</button>
          )}
          {!kamar.penghuni && kamar.status !== "tersedia" && (
            <button className="btn-ghost">📝 Update Status</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MONITOR KAMAR — MAIN MODULE
// ============================================================
function MonitorKamar() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterTipe, setFilterTipe] = useState("all");
  const [filterLantai, setFilterLantai] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedKamar, setSelectedKamar] = useState(null);

  const summary = Object.keys(STATUS_CFG).reduce((acc, key) => {
    acc[key] = KAMAR_DATA.filter(k => k.status === key).length;
    return acc;
  }, {});

  const filtered = KAMAR_DATA.filter(k => {
    if (filterStatus !== "all" && k.status !== filterStatus) return false;
    if (filterTipe !== "all" && k.tipe !== filterTipe) return false;
    if (filterLantai !== "all" && String(k.lantai) !== filterLantai) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!String(k.id).includes(q) && !(k.penghuni || "").toLowerCase().includes(q) && !k.tipe.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="fade-up">
      {/* Status Summary Strip */}
      <div className="status-strip">
        {Object.entries(STATUS_CFG).map(([key, cfg]) => (
          <StatusChip
            key={key}
            statusKey={key}
            count={summary[key]}
            active={filterStatus === key}
            onClick={() => setFilterStatus(filterStatus === key ? "all" : key)}
          />
        ))}
        {/* Total chip */}
        <div
          className={`status-chip ${filterStatus === "all" ? "active" : ""}`}
          style={filterStatus === "all" ? { background: "#f8fafc", borderColor: "#e2e8f0" } : {}}
          onClick={() => setFilterStatus("all")}
        >
          <div className="chip-dot" style={{ background: "#94a3b8" }} />
          <div>
            <div className="chip-label">Semua</div>
            <div className="chip-count" style={{ color: "#475569" }}>{KAMAR_DATA.length}</div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="search-box">
          <span>🔍</span>
          <input className="search-input" placeholder="Cari kamar, penyewa..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8" }}>Tipe:</span>
          {["all", "Premium", "Reguler"].map(t => (
            <div key={t} className={`filter-tag ${filterTipe === t ? "active" : ""}`} onClick={() => setFilterTipe(t)}>
              {t === "all" ? "Semua" : t === "Premium" ? "⭑ Premium" : "Reguler"}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8" }}>Lantai:</span>
          {["all", "2", "3"].map(l => (
            <div key={l} className={`filter-tag ${filterLantai === l ? "active" : ""}`} onClick={() => setFilterLantai(l)}>
              {l === "all" ? "Semua" : `Lt. ${l}`}
            </div>
          ))}
        </div>
        <div className="result-count">{filtered.length} kamar</div>
      </div>

      {/* Kamar Grid */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <div className="empty-title">Tidak ada kamar yang sesuai filter</div>
          <div style={{ fontSize: 13 }}>Coba ubah filter atau kata kunci pencarian</div>
        </div>
      ) : (
        <div className="kamar-grid">
          {filtered.map(k => (
            <KamarCard key={k.id} kamar={k} onClick={() => setSelectedKamar(k)} />
          ))}
        </div>
      )}

      {/* Detail Drawer */}
      {selectedKamar && (
        <DetailDrawer kamar={selectedKamar} onClose={() => setSelectedKamar(null)} />
      )}
    </div>
  );
}

// ============================================================
// MINI SIDEBAR (placeholder navigation)
// ============================================================
const DEMO_MENU = [
  { id: "dashboard", label: "Dashboard", icon: "◧", section: "OPERASIONAL" },
  { id: "monitor",   label: "Monitor Kamar", icon: "⬡", section: null },
  { id: "absensi",   label: "Absensi & Jadwal", icon: "⏱", section: null },
  { id: "keluhan",   label: "Keluhan & Tiket", icon: "⚑", section: null },
  { id: "weekly",    label: "Weekly Service", icon: "✦", section: null },
  { id: "penyewa",   label: "Data Penyewa", icon: "⊙", section: "TENANT" },
  { id: "checkin",   label: "Check-in / Check-out", icon: "⤵", section: null },
  { id: "tagihan",   label: "Tagihan & Penagihan", icon: "◈", section: "KEUANGAN" },
];

function MiniSidebar({ active, onSelect }) {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">S</div>
        <div>
          <div className="logo-name">SENYUM INN</div>
          <div className="logo-sub">Exclusive Kost</div>
        </div>
      </div>
      <nav className="sidebar-nav">
        {DEMO_MENU.map((item, i) => (
          <div key={item.id}>
            {item.section && <div className="nav-sec-label">{item.section}</div>}
            <div className={`nav-item ${active === item.id ? "active" : ""}`} onClick={() => onSelect(item.id)}>
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          </div>
        ))}
      </nav>
      <div className="sidebar-user">
        <div className="user-av">YV</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="user-name">Yusuf Vindra</div>
          <div className="user-role">Owner</div>
        </div>
        <button className="logout-btn">⏻</button>
      </div>
    </div>
  );
}

// ============================================================
// APP WRAPPER (Demo Shell)
// ============================================================
export default function App() {
  const [activeMenu, setActiveMenu] = useState("monitor");

  return (
    <div className="app">
      <StyleInjector />
      <MiniSidebar active={activeMenu} onSelect={setActiveMenu} />
      <div className="main">
        {/* Header */}
        <div className="header">
          <div>
            <div className="header-sub">Senyum Inn · Operasional</div>
            <div className="header-title">Monitor Kamar</div>
          </div>
          <div className="header-actions">
            <button className="btn-primary" style={{ padding: "7px 14px" }}>+ Kamar Baru</button>
            <div style={{ width: 34, height: 34, background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 15 }}>🔔</div>
          </div>
        </div>

        {/* Content */}
        <div className="content">
          {activeMenu === "monitor" ? (
            <MonitorKamar />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 400, color: "#94a3b8" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🚧</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#1e293b" }}>{DEMO_MENU.find(m => m.id === activeMenu)?.label || activeMenu}</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>Modul dalam pengembangan</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
