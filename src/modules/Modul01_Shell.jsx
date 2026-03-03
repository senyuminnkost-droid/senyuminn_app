import { useState, useEffect } from "react";
import Monitor from "./Modul03_Monitor";
import Keluhan from "./Modul02_Keluhan";
import Weekly from "./Modul04_Weekly";
import Absensi from "./Modul05_Absensi";
import Penyewa from "./Modul06_Penyewa";
import Checkin from "./Modul07_Checkin";
import Tagihan from "./Modul08_Tagihan";
import Kas from "./Modul09_Kas";
import Laporan from "./Modul10_Laporan";
import Karyawan from "./Modul11_Karyawan";
import Penggajian from "./Modul12_Penggajian";
import AbsensiKaryawan from "./Modul13_AbsensiKaryawan";
import Pengaturan from "./Modul14_Pengaturan";
import Riwayat from "./Modul15_Riwayat";
import Kalender from "./Modul16_Kalender";
import Jobdesk from "./Modul17_Jobdesk";
import Pettycash from "./Modul18_Pettycash";


// ============================================================
// MOCK DATA
// ============================================================
const USERS = [];

const KAMAR_DATA = [];

const TIKET_DATA = [];

const AGENDA_TAGIHAN = [];

const DASHBOARD_STATS = {
  omzetBulanIni: 21950000,
  omzetBulanLalu: 19800000,
  kamarTerisi: 8,
  kamarKosong: 2,
  kamarBooked: 1,
  kamarMaintenance: 1,
  piutang: 3600000,
  tiketOpen: 3,
  tiketUrgent: 1,
  kontrakHabis: 2,
};

const KAS_BULAN = {
  masuk: 21968860,
  keluar: 19721393,
};

const JADWAL_SERVICE_HARI_INI = [];

const INSIGHTS = [];

// ============================================================
// HELPERS
// ============================================================
const formatRupiah = (n) => "Rp " + n.toLocaleString("id-ID");

const STATUS_CONFIG = {
  "tersedia":    { label: "Tersedia",    color: "#16a34a", bg: "#dcfce7", ring: "#86efac" },
  "booked":      { label: "Booked",      color: "#b45309", bg: "#fef3c7", ring: "#fcd34d" },
  "terisi":      { label: "Terisi",      color: "#dc2626", bg: "#fee2e2", ring: "#fca5a5" },
  "deep-clean":  { label: "Deep Clean",  color: "#1d4ed8", bg: "#dbeafe", ring: "#93c5fd" },
  "maintenance": { label: "Maintenance", color: "#c2410c", bg: "#ffedd5", ring: "#fdba74" },
};

const TIKET_STATUS_CONFIG = {
  "open":        { label: "Open",        color: "#dc2626", bg: "#fee2e2" },
  "in-progress": { label: "In Progress", color: "#d97706", bg: "#fef3c7" },
  "ditunda":     { label: "Ditunda",     color: "#6d28d9", bg: "#ede9fe" },
  "selesai":     { label: "Selesai",     color: "#16a34a", bg: "#dcfce7" },
};

const PRIORITAS_CONFIG = {
  "urgent": { label: "Urgent", color: "#dc2626", bg: "#fee2e2" },
  "normal": { label: "Normal", color: "#6b7280", bg: "#f3f4f6" },
};

// ============================================================
// MENU CONFIG
// ============================================================
const MENU_ADMIN = [
  {
    section: "OPERASIONAL",
    items: [
      { id: "dashboard", label: "Dashboard", icon: "◧" },
      { id: "monitor", label: "Monitor Kamar", icon: "⬡" },
      { id: "absensi", label: "Absensi & Jadwal", icon: "⏱" },
      { id: "keluhan", label: "Keluhan & Tiket", icon: "⚑" },
      { id: "weekly", label: "Weekly Service", icon: "✦" },
      { id: "kalender", label: "Kalender Operasional", icon: "⊞" },
    ],
  },
  {
    section: "TENANT",
    items: [
      { id: "penyewa", label: "Data Penyewa", icon: "⊙" },
      { id: "checkin", label: "Check-in / Check-out", icon: "⤵" },
      { id: "riwayat", label: "Riwayat Penyewa", icon: "◱" },
    ],
  },
  {
    section: "KEUANGAN",
    items: [
      { id: "tagihan", label: "Tagihan & Penagihan", icon: "◈" },
      { id: "kas", label: "Kas & Jurnal", icon: "◉" },
      { id: "laporan", label: "Laporan Keuangan", icon: "▦" },
    ],
  },
  {
    section: "HR",
    items: [
      { id: "karyawan", label: "Data Karyawan", icon: "⊛" },
      { id: "penggajian", label: "Penggajian", icon: "◎" },
      { id: "laporanabsensi", label: "Laporan Absensi", icon: "▤" },
    ],
  },
  {
    section: "PENGATURAN",
    items: [
      { id: "profil", label: "Profil & user", icon: "⊕" },
    ],
  },
];

const MENU_STAFF = [
  {
    section: "OPERASIONAL",
    items: [
      { id: "dashboard", label: "Dashboard", icon: "◧" },
      { id: "monitor", label: "Monitor Kamar", icon: "⬡" },
      { id: "absensi", label: "Absensi & Jadwal", icon: "⏱" },
      { id: "keluhan", label: "Keluhan & Tiket", icon: "⚑" },
      { id: "weekly", label: "Weekly Service", icon: "✦" },
      { id: "kalender", label: "Kalender Operasional", icon: "⊞" },
    ],
  },
  {
    section: "TENANT",
    items: [
      { id: "penyewa", label: "Data Penyewa", icon: "⊙" },
      { id: "checkin", label: "Check-in / Check-out", icon: "⤵" },
    ],
  },
];

const MENU_TITLES = {
  dashboard: "Dashboard",
  monitor: "Monitor Kamar",
  absensi: "Absensi & Jadwal Staff",
  keluhan: "Keluhan & Tiket Perbaikan",
  weekly: "Weekly Service",
  kalender: "Kalender Operasional",
  penyewa: "Data Penyewa",
  checkin: "Check-in / Check-out",
  riwayat: "Riwayat Penyewa",
  tagihan: "Tagihan & Penagihan",
  kas: "Kas & Jurnal",
  laporan: "Laporan Keuangan",
  karyawan: "Data Karyawan",
  penggajian: "Penggajian",
  laporanabsensi: "Laporan Absensi",
  profil: "Profil Kost",
  users: "Manajemen User",
};

// ============================================================
// CSS INJECTOR
// ============================================================
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');

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
    --slate-400: #94a3b8;
    --slate-200: #e2e8f0;
    --slate-100: #f1f5f9;
    --slate-50: #f8fafc;
    --white: #ffffff;
    --sidebar-w: 228px;
  }

  body { font-family: 'Plus Jakarta Sans', sans-serif; }

  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--slate-200); border-radius: 4px; }

  .app { display: flex; height: 100vh; background: var(--slate-50); overflow: hidden; }

  /* ── SIDEBAR ─────────────────────────────── */
  .sidebar {
    width: var(--sidebar-w);
    background: var(--slate-900);
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    overflow: hidden;
    position: relative;
  }

  .sidebar::before {
    content: '';
    position: absolute;
    top: 0; right: 0;
    width: 1px; height: 100%;
    background: linear-gradient(180deg, transparent, rgba(249,115,22,0.3), transparent);
  }

  .sidebar-logo {
    padding: 20px 16px 16px;
    display: flex; align-items: center; gap: 10px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }

  .logo-mark {
    width: 38px; height: 38px;
    background: linear-gradient(135deg, var(--orange), var(--orange-dark));
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; font-weight: 800; color: #fff;
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(249,115,22,0.4);
  }

  .logo-text-name { font-size: 13px; font-weight: 800; color: #fff; letter-spacing: 0.5px; }
  .logo-text-sub { font-size: 9px; font-weight: 600; color: var(--orange); text-transform: uppercase; letter-spacing: 1.5px; margin-top: 1px; }

  .sidebar-nav { flex: 1; overflow-y: auto; padding: 8px 0 8px; }

  .nav-section { margin-bottom: 2px; }
  .nav-section-label {
    padding: 12px 16px 4px;
    font-size: 9px; font-weight: 700; letter-spacing: 1.5px;
    color: rgba(255,255,255,0.25);
    text-transform: uppercase;
  }

  .nav-item {
    display: flex; align-items: center; gap: 9px;
    padding: 7px 14px;
    margin: 1px 8px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 12.5px; font-weight: 500;
    color: rgba(255,255,255,0.5);
    transition: all 0.15s ease;
    position: relative;
  }

  .nav-item:hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.8); }

  .nav-item.active {
    background: linear-gradient(135deg, var(--orange), var(--orange-dark));
    color: #fff;
    font-weight: 700;
    box-shadow: 0 4px 12px rgba(249,115,22,0.35);
  }

  .nav-icon { font-size: 13px; width: 18px; text-align: center; flex-shrink: 0; }

  .sidebar-user {
    padding: 12px 14px;
    border-top: 1px solid rgba(255,255,255,0.06);
    display: flex; align-items: center; gap: 10px;
  }

  .user-avatar {
    width: 32px; height: 32px; border-radius: 50%;
    background: linear-gradient(135deg, var(--orange), var(--orange-dark));
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 800; color: #fff;
    flex-shrink: 0;
  }

  .user-name { font-size: 12px; font-weight: 700; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .user-role { font-size: 10px; color: rgba(255,255,255,0.35); margin-top: 1px; }

  .logout-btn {
    margin-left: auto;
    background: none; border: none; cursor: pointer;
    color: rgba(255,255,255,0.3);
    font-size: 14px; padding: 4px;
    border-radius: 6px;
    transition: all 0.15s;
  }
  .logout-btn:hover { color: #ef4444; background: rgba(239,68,68,0.1); }

  /* ── MAIN ────────────────────────────────── */
  .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

  /* ── HEADER ──────────────────────────────── */
  .header {
    background: var(--white);
    border-bottom: 1px solid var(--slate-200);
    padding: 0 24px;
    height: 54px;
    display: flex; align-items: center; justify-content: space-between;
    flex-shrink: 0;
  }

  .header-left { display: flex; align-items: center; gap: 10px; }
  .header-breadcrumb { font-size: 11px; color: var(--slate-400); }
  .header-title { font-size: 14px; font-weight: 800; color: var(--slate-900); letter-spacing: 0.2px; }

  .header-right { display: flex; align-items: center; gap: 8px; }

  .header-btn {
    width: 34px; height: 34px;
    background: var(--slate-100);
    border: 1px solid var(--slate-200);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 15px;
    transition: all 0.15s;
    color: var(--slate-600);
  }
  .header-btn:hover { background: var(--orange-light); border-color: var(--orange-mid); color: var(--orange-dark); }

  .notif-badge {
    position: relative;
  }
  .notif-dot {
    position: absolute; top: -2px; right: -2px;
    width: 8px; height: 8px;
    background: #ef4444; border-radius: 50%;
    border: 2px solid var(--white);
  }

  .header-date { font-size: 11px; color: var(--slate-400); font-weight: 500; padding: 0 4px; }

  /* ── CONTENT ─────────────────────────────── */
  .content { flex: 1; overflow-y: auto; padding: 20px 24px; }

  /* ── DASHBOARD ───────────────────────────── */
  .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 20px; }

  .stat-card {
    background: var(--white);
    border: 1px solid var(--slate-200);
    border-radius: 12px;
    padding: 16px 18px;
    position: relative;
    overflow: hidden;
    transition: box-shadow 0.15s;
  }
  .stat-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.06); }

  .stat-card-accent {
    position: absolute;
    top: 0; left: 0; right: 0; height: 3px;
    border-radius: 12px 12px 0 0;
  }

  .stat-icon {
    width: 36px; height: 36px; border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; margin-bottom: 10px;
  }

  .stat-label { font-size: 11px; font-weight: 600; color: var(--slate-400); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
  .stat-value { font-size: 22px; font-weight: 800; color: var(--slate-900); line-height: 1; }
  .stat-value-sm { font-size: 18px; font-weight: 800; color: var(--slate-900); line-height: 1; }
  .stat-sub { font-size: 11px; color: var(--slate-400); margin-top: 5px; }
  .stat-growth { font-size: 11px; font-weight: 600; margin-top: 5px; }

  /* ── INSIGHT BAR ─────────────────────────── */
  .insight-scroll {
    background: linear-gradient(135deg, var(--orange-pale), var(--orange-light));
    border: 1px solid var(--orange-mid);
    border-radius: 10px;
    padding: 10px 16px;
    margin-bottom: 20px;
    overflow: hidden;
  }

  .insight-label { font-size: 10px; font-weight: 700; color: var(--orange-deep); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }

  .insight-items { display: flex; gap: 20px; overflow-x: auto; padding-bottom: 2px; }
  .insight-items::-webkit-scrollbar { display: none; }

  .insight-item {
    display: flex; align-items: center; gap: 6px;
    white-space: nowrap; flex-shrink: 0;
  }
  .insight-text { font-size: 12px; font-weight: 500; }
  .insight-text.urgent { color: #dc2626; }
  .insight-text.warning { color: #b45309; }
  .insight-text.success { color: #15803d; }
  .insight-text.info { color: var(--orange-deep); }

  .insight-divider { width: 1px; height: 14px; background: var(--orange-mid); flex-shrink: 0; }

  /* ── WIDGETS ─────────────────────────────── */
  .widget-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; margin-bottom: 20px; }
  .widget-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

  .widget {
    background: var(--white);
    border: 1px solid var(--slate-200);
    border-radius: 12px;
    overflow: hidden;
  }

  .widget-header {
    padding: 12px 16px;
    border-bottom: 1px solid var(--slate-100);
    display: flex; align-items: center; justify-content: space-between;
  }

  .widget-title { font-size: 12px; font-weight: 700; color: var(--slate-800); display: flex; align-items: center; gap: 6px; }
  .widget-title-icon { font-size: 13px; }

  .widget-body { padding: 14px 16px; }
  .widget-body-p0 { padding: 0; }

  .widget-link { font-size: 11px; font-weight: 600; color: var(--orange); cursor: pointer; }
  .widget-link:hover { color: var(--orange-dark); text-decoration: underline; }

  /* ── MONITOR MINI ────────────────────────── */
  .monitor-mini-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 8px;
    padding: 14px 16px;
  }

  .kamar-mini {
    border-radius: 8px;
    padding: 9px 8px;
    border: 1.5px solid transparent;
    cursor: pointer;
    transition: all 0.15s;
    position: relative;
  }

  .kamar-mini:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }

  .kamar-mini-num { font-size: 13px; font-weight: 800; color: var(--slate-800); }
  .kamar-mini-tipe { font-size: 9px; color: var(--slate-400); font-weight: 500; margin-top: 1px; }

  .kamar-status-dot {
    width: 6px; height: 6px; border-radius: 50%;
    position: absolute; top: 8px; right: 8px;
  }

  /* ── ROWS / LIST ITEMS ───────────────────── */
  .list-row {
    padding: 10px 0;
    border-bottom: 1px solid var(--slate-100);
    display: flex; align-items: flex-start; justify-content: space-between; gap: 8px;
  }
  .list-row:last-child { border-bottom: none; }

  .list-row-title { font-size: 12.5px; font-weight: 600; color: var(--slate-800); }
  .list-row-sub { font-size: 11px; color: var(--slate-400); margin-top: 2px; }

  /* ── BADGES ──────────────────────────────── */
  .badge {
    display: inline-flex; align-items: center; gap: 3px;
    padding: 2px 8px; border-radius: 20px;
    font-size: 10px; font-weight: 700; white-space: nowrap;
  }

  /* ── KAS ROWS ────────────────────────────── */
  .kas-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 0; border-bottom: 1px solid var(--slate-100);
  }
  .kas-row:last-child { border-bottom: none; padding-bottom: 0; }
  .kas-label { font-size: 11px; font-weight: 700; color: var(--slate-400); text-transform: uppercase; letter-spacing: 0.5px; }
  .kas-value { font-size: 14px; font-weight: 800; }

  /* ── BARS ────────────────────────────────── */
  .progress-bar { height: 6px; background: var(--slate-100); border-radius: 4px; overflow: hidden; margin-top: 6px; }
  .progress-fill { height: 100%; border-radius: 4px; }

  /* ── OCCUPANCY RING ──────────────────────── */
  .occ-ring { position: relative; display: inline-flex; align-items: center; justify-content: center; }
  .occ-label-center { position: absolute; text-align: center; }
  .occ-pct { font-size: 20px; font-weight: 800; color: var(--slate-900); display: block; }
  .occ-pct-sub { font-size: 9px; font-weight: 600; color: var(--slate-400); display: block; text-transform: uppercase; }

  /* ── STATUS LEGEND ───────────────────────── */
  .legend-row { display: flex; flex-wrap: wrap; gap: 12px; }
  .legend-item { display: flex; align-items: center; gap: 5px; font-size: 11px; color: var(--slate-600); font-weight: 500; }
  .legend-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }

  /* ── BUTTONS ─────────────────────────────── */
  .btn-primary {
    background: linear-gradient(135deg, var(--orange), var(--orange-dark));
    color: #fff; border: none; border-radius: 8px;
    padding: 8px 16px; font-size: 12px; font-weight: 700;
    cursor: pointer; display: inline-flex; align-items: center; gap: 6px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: all 0.15s; box-shadow: 0 2px 8px rgba(249,115,22,0.3);
  }
  .btn-primary:hover { filter: brightness(1.05); box-shadow: 0 4px 14px rgba(249,115,22,0.4); }

  .btn-ghost {
    background: transparent; border: 1px solid var(--slate-200); color: var(--slate-600);
    border-radius: 8px; padding: 7px 14px; font-size: 12px; font-weight: 600;
    cursor: pointer; display: inline-flex; align-items: center; gap: 6px;
    font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s;
  }
  .btn-ghost:hover { background: var(--slate-100); }

  /* ── LOGIN ───────────────────────────────── */
  .login-page {
    min-height: 100vh;
    background: linear-gradient(135deg, var(--slate-900) 0%, #1a0a00 50%, var(--slate-900) 100%);
    display: flex; align-items: center; justify-content: center;
    position: relative; overflow: hidden;
  }

  .login-bg-orb {
    position: absolute; border-radius: 50%;
    filter: blur(80px); pointer-events: none;
  }

  .login-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 20px;
    padding: 36px 32px;
    width: 380px;
    backdrop-filter: blur(20px);
    position: relative; z-index: 1;
    box-shadow: 0 24px 60px rgba(0,0,0,0.5);
  }

  .login-logo-wrap { text-align: center; margin-bottom: 28px; }
  .login-logo-mark {
    width: 60px; height: 60px; margin: 0 auto 12px;
    background: linear-gradient(135deg, var(--orange), var(--orange-dark));
    border-radius: 16px;
    display: flex; align-items: center; justify-content: center;
    font-size: 26px; font-weight: 800; color: #fff;
    box-shadow: 0 8px 24px rgba(249,115,22,0.5);
  }
  .login-brand { font-size: 20px; font-weight: 800; color: #fff; letter-spacing: 1px; }
  .login-brand-sub { font-size: 11px; font-weight: 600; color: var(--orange); letter-spacing: 2px; text-transform: uppercase; margin-top: 3px; }

  .login-field { margin-bottom: 14px; }
  .login-label { font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 6px; }

  .login-input {
    width: 100%;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 9px;
    padding: 10px 14px;
    font-size: 14px; color: #fff;
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: all 0.15s; outline: none;
  }
  .login-input::placeholder { color: rgba(255,255,255,0.25); }
  .login-input:focus { border-color: var(--orange); background: rgba(249,115,22,0.06); box-shadow: 0 0 0 3px rgba(249,115,22,0.12); }

  .login-error { background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.3); color: #fca5a5; padding: 8px 12px; border-radius: 8px; font-size: 12px; margin-bottom: 14px; }

  .login-btn {
    width: 100%; padding: 12px;
    background: linear-gradient(135deg, var(--orange), var(--orange-dark));
    border: none; border-radius: 10px;
    font-size: 14px; font-weight: 700; color: #fff;
    cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif;
    transition: all 0.15s; box-shadow: 0 4px 16px rgba(249,115,22,0.4);
    margin-bottom: 16px;
  }
  .login-btn:hover { filter: brightness(1.05); box-shadow: 0 8px 24px rgba(249,115,22,0.5); }
  .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  .login-demo {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px; padding: 10px 12px;
    font-size: 11px; color: rgba(255,255,255,0.35);
  }
  .login-demo b { color: rgba(255,255,255,0.6); }
  .login-demo-title { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; color: rgba(255,255,255,0.3); }

  /* ── STAFF DASHBOARD ─────────────────────── */
  .staff-stat-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; margin-bottom: 20px; }

  /* ── ANIMATE ─────────────────────────────── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .fade-up { animation: fadeUp 0.3s ease forwards; }

  @keyframes pulse-dot {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
  .pulse { animation: pulse-dot 2s ease infinite; }
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
// LOGIN PAGE
// ============================================================
function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!username || !password) { setError("Isi username dan password."); return; }
    setLoading(true);
    setTimeout(() => {
      const user = USERS.find(u => u.username === username && u.password === password);
      if (user) { onLogin(user); }
      else { setError("Username atau password salah."); setLoading(false); }
    }, 700);
  };

  return (
    <div className="login-page">
      <StyleInjector />
      {/* BG orbs */}
      <div className="login-bg-orb" style={{ width: 400, height: 400, background: "rgba(249,115,22,0.15)", top: -100, left: -100 }} />
      <div className="login-bg-orb" style={{ width: 300, height: 300, background: "rgba(234,88,12,0.1)", bottom: -80, right: -60 }} />

      <div className="login-card fade-up">
        <div className="login-logo-wrap">
          <div className="login-logo-mark">S</div>
          <div className="login-brand">SENYUM INN</div>
          <div className="login-brand-sub">Exclusive Kost</div>
        </div>

        <div className="login-field">
          <label className="login-label">Username</label>
          <input className="login-input" placeholder="Masukkan username" value={username}
            onChange={e => { setUsername(e.target.value); setError(""); }}
            onKeyDown={e => e.key === "Enter" && handleLogin()} />
        </div>
        <div className="login-field" style={{ marginBottom: 18 }}>
          <label className="login-label">Password</label>
          <input className="login-input" type="password" placeholder="Masukkan password" value={password}
            onChange={e => { setPassword(e.target.value); setError(""); }}
            onKeyDown={e => e.key === "Enter" && handleLogin()} />
        </div>

        {error && <div className="login-error">{error}</div>}

        <button className="login-btn" onClick={handleLogin} disabled={loading}>
          {loading ? "Memverifikasi..." : "Masuk →"}
        </button>

        <div className="login-demo">
          <div className="login-demo-title">Demo Login</div>
          <div>Admin: <b>owner</b> / <b>owner123</b></div>
          <div style={{ marginTop: 3 }}>Staff: <b>staff1</b> / <b>staff123</b></div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SIDEBAR
// ============================================================
function Sidebar({ user, activeMenu, onMenuChange, onLogout }) {
  const menus = user.role === "admin" ? MENU_ADMIN : MENU_STAFF;
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">S</div>
        <div>
          <div className="logo-text-name">SENYUM INN</div>
          <div className="logo-text-sub">Exclusive Kost</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menus.map(section => (
          <div key={section.section} className="nav-section">
            <div className="nav-section-label">{section.section}</div>
            {section.items.map(item => (
              <div
                key={item.id}
                className={`nav-item ${activeMenu === item.id ? "active" : ""}`}
                onClick={() => onMenuChange(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-user">
        <div className="user-avatar">{user.avatar}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="user-name">{user.name}</div>
          <div className="user-role">{user.jabatan}</div>
        </div>
        <button className="logout-btn" onClick={onLogout} title="Keluar">⏻</button>
      </div>
    </div>
  );
}

// ============================================================
// HEADER
// ============================================================
function Header({ title }) {
  const today = new Date();
  const opts = { weekday: "short", day: "numeric", month: "short", year: "numeric" };
  const dateStr = today.toLocaleDateString("id-ID", opts);

  return (
    <div className="header">
      <div className="header-left">
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div className="header-breadcrumb">Senyum Inn Exclusive Kost</div>
          <div className="header-title">{title}</div>
        </div>
      </div>
      <div className="header-right">
        <div className="header-date">{dateStr}</div>
        <div className="header-btn notif-badge" title="Notifikasi">
          🔔
          <div className="notif-dot pulse" />
        </div>
        <div className="header-btn" title="Pencarian">🔍</div>
      </div>
    </div>
  );
}

// ============================================================
// BADGE COMPONENT
// ============================================================
function Badge({ color, bg, children }) {
  return <span className="badge" style={{ color, background: bg }}>{children}</span>;
}

// ============================================================
// OCCUPANCY RING (SVG)
// ============================================================
function OccupancyRing({ pct }) {
  const r = 36, c = 44, stroke = 7;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div className="occ-ring" style={{ width: c * 2, height: c * 2 }}>
      <svg width={c * 2} height={c * 2}>
        <circle cx={c} cy={c} r={r} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
        <circle cx={c} cy={c} r={r} fill="none" stroke="url(#gr)" strokeWidth={stroke}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          transform={`rotate(-90 ${c} ${c})`} />
        <defs>
          <linearGradient id="gr" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>
        </defs>
      </svg>
      <div className="occ-label-center">
        <span className="occ-pct">{pct}%</span>
        <span className="occ-pct-sub">Okupansi</span>
      </div>
    </div>
  );
}

// ============================================================
// DASHBOARD — ADMIN
// ============================================================
function DashboardAdmin() {
  const growth = ((DASHBOARD_STATS.omzetBulanIni - DASHBOARD_STATS.omzetBulanLalu) / DASHBOARD_STATS.omzetBulanLalu * 100).toFixed(1);
  const totalKamar = 12;
  const okupansi = Math.round((DASHBOARD_STATS.kamarTerisi / totalKamar) * 100);
  const netKas = KAS_BULAN.masuk - KAS_BULAN.keluar;

  return (
    <div className="fade-up">
      {/* STAT CARDS */}
      <div className="stat-grid">
        {/* Omzet */}
        <div className="stat-card">
          <div className="stat-card-accent" style={{ background: "linear-gradient(90deg, #f97316, #ea580c)" }} />
          <div className="stat-icon" style={{ background: "#fff7ed" }}>💰</div>
          <div className="stat-label">Omzet Bulan Ini</div>
          <div className="stat-value-sm" style={{ color: "#ea580c" }}>{formatRupiah(DASHBOARD_STATS.omzetBulanIni)}</div>
          <div className="stat-growth" style={{ color: "#16a34a" }}>▲ +{growth}% vs bulan lalu</div>
        </div>

        {/* Piutang */}
        <div className="stat-card">
          <div className="stat-card-accent" style={{ background: "#ef4444" }} />
          <div className="stat-icon" style={{ background: "#fee2e2" }}>⚠</div>
          <div className="stat-label">Piutang Belum Bayar</div>
          <div className="stat-value-sm" style={{ color: "#dc2626" }}>{formatRupiah(DASHBOARD_STATS.piutang)}</div>
          <div className="stat-sub">{AGENDA_TAGIHAN.length} tagihan outstanding</div>
        </div>

        {/* Tiket */}
        <div className="stat-card">
          <div className="stat-card-accent" style={{ background: "#f97316" }} />
          <div className="stat-icon" style={{ background: "#ffedd5" }}>🔧</div>
          <div className="stat-label">Tiket Keluhan</div>
          <div className="stat-value">{DASHBOARD_STATS.tiketOpen}</div>
          <div className="stat-growth" style={{ color: "#dc2626" }}>
            {DASHBOARD_STATS.tiketUrgent} urgent perlu tindakan
          </div>
        </div>

        {/* Kontrak */}
        <div className="stat-card">
          <div className="stat-card-accent" style={{ background: "#6d28d9" }} />
          <div className="stat-icon" style={{ background: "#ede9fe" }}>📋</div>
          <div className="stat-label">Kontrak Habis</div>
          <div className="stat-value">{DASHBOARD_STATS.kontrakHabis}</div>
          <div className="stat-sub">Bulan ini — reminder H-30</div>
        </div>
      </div>

      {/* INSIGHT BAR */}
      <div className="insight-scroll">
        <div className="insight-label">📊 Insight Hari Ini</div>
        <div className="insight-items">
          {INSIGHTS.map((ins, i) => (
            <>
              <div key={i} className="insight-item">
                <span style={{ fontSize: 12 }}>{ins.icon}</span>
                <span className={`insight-text ${ins.type}`}>{ins.text}</span>
              </div>
              {i < INSIGHTS.length - 1 && <div className="insight-divider" />}
            </>
          ))}
        </div>
      </div>

      {/* WIDGETS ROW */}
      <div className="widget-grid">
        {/* Agenda Tagihan */}
        <div className="widget">
          <div className="widget-header">
            <div className="widget-title">
              <span className="widget-title-icon">📋</span> Agenda Penagihan
            </div>
            <span className="widget-link">Lihat Semua</span>
          </div>
          <div className="widget-body">
            <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>30 Hari ke Depan</div>
            {AGENDA_TAGIHAN.map((a, i) => (
              <div key={i} className="list-row">
                <div>
                  <div className="list-row-title">Kamar {a.kamar} — {a.penghuni}</div>
                  <div className="list-row-sub">Jatuh tempo: {a.jatuhTempo}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#ea580c" }}>{formatRupiah(a.jumlah)}</div>
                  <Badge color="#dc2626" bg="#fee2e2">Belum</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Tiket */}
        <div className="widget">
          <div className="widget-header">
            <div className="widget-title">
              <span className="widget-title-icon">🔧</span> Status Perbaikan
            </div>
            <span className="widget-link">Lihat Semua</span>
          </div>
          <div className="widget-body">
            {TIKET_DATA.map(t => (
              <div key={t.id} className="list-row">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="list-row-title">#{t.id} · Kamar {t.kamar}</div>
                  <div className="list-row-sub">{t.kategori} — {t.deskripsi.slice(0, 30)}...</div>
                  <div style={{ marginTop: 4 }}>
                    <Badge color={PRIORITAS_CONFIG[t.prioritas].color} bg={PRIORITAS_CONFIG[t.prioritas].bg}>
                      {PRIORITAS_CONFIG[t.prioritas].label}
                    </Badge>
                  </div>
                </div>
                <Badge color={TIKET_STATUS_CONFIG[t.status].color} bg={TIKET_STATUS_CONFIG[t.status].bg}>
                  {TIKET_STATUS_CONFIG[t.status].label}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Kas Bulan Ini */}
        <div className="widget">
          <div className="widget-header">
            <div className="widget-title">
              <span className="widget-title-icon">💰</span> Kas Bulan Ini
            </div>
            <span className="widget-link">Lihat Jurnal</span>
          </div>
          <div className="widget-body">
            <div className="kas-row">
              <span className="kas-label">Masuk (IN)</span>
              <span className="kas-value" style={{ color: "#16a34a" }}>{formatRupiah(KAS_BULAN.masuk)}</span>
            </div>
            <div className="kas-row">
              <span className="kas-label">Keluar (OUT)</span>
              <span className="kas-value" style={{ color: "#dc2626" }}>{formatRupiah(KAS_BULAN.keluar)}</span>
            </div>
            <div className="kas-row">
              <span className="kas-label">NET</span>
              <span className="kas-value" style={{ color: "#f97316" }}>{formatRupiah(netKas)}</span>
            </div>
            <div style={{ marginTop: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94a3b8", marginBottom: 6 }}>
                <span>Realisasi vs Budget</span>
                <span style={{ fontWeight: 700, color: "#16a34a" }}>+8.4%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: "78%", background: "linear-gradient(90deg, #f97316, #ea580c)" }} />
              </div>
              <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 4 }}>78% dari target bulan ini</div>
            </div>
          </div>
        </div>
      </div>

      {/* MONITOR MINI + OKUPANSI */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: 14 }}>
        {/* Monitor Mini */}
        <div className="widget">
          <div className="widget-header">
            <div className="widget-title">
              <span className="widget-title-icon">⬡</span> Monitor Unit
            </div>
            <div className="legend-row">
              {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                <div key={key} className="legend-item">
                  <div className="legend-dot" style={{ background: val.color }} />
                  {val.label}
                </div>
              ))}
            </div>
          </div>
          <div className="monitor-mini-grid">
            {KAMAR_DATA.map(k => {
              const cfg = STATUS_CONFIG[k.status];
              return (
                <div key={k.id} className="kamar-mini" style={{ background: cfg.bg, borderColor: cfg.ring }}>
                  <div className="kamar-status-dot pulse" style={{ background: cfg.color }} />
                  <div className="kamar-mini-num">K{k.id}</div>
                  <div className="kamar-mini-tipe">{k.tipe === "Premium" ? "PRE" : "REG"}</div>
                  {k.tiketAktif > 0 && (
                    <div style={{ marginTop: 3, fontSize: 8, fontWeight: 700, color: "#dc2626" }}>
                      ⚑ {k.tiketAktif} tiket
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Okupansi Card */}
        <div className="widget" style={{ display: "flex", flexDirection: "column" }}>
          <div className="widget-header">
            <div className="widget-title">
              <span className="widget-title-icon">◉</span> Okupansi
            </div>
          </div>
          <div className="widget-body" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, paddingTop: 20 }}>
            <OccupancyRing pct={okupansi} />
            <div style={{ width: "100%" }}>
              {[
                { label: "Terisi", count: DASHBOARD_STATS.kamarTerisi, color: "#dc2626" },
                { label: "Tersedia", count: DASHBOARD_STATS.kamarKosong, color: "#16a34a" },
                { label: "Booked", count: DASHBOARD_STATS.kamarBooked, color: "#b45309" },
                { label: "Non-aktif", count: DASHBOARD_STATS.kamarMaintenance + 1, color: "#6b7280" },
              ].map(s => (
                <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div className="legend-dot" style={{ background: s.color }} />
                    <span style={{ fontSize: 12, color: "#475569" }}>{s.label}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 800, color: s.color }}>{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// DASHBOARD — STAFF
// ============================================================
function DashboardStaff({ user }) {
  return (
    <div className="fade-up">
      {/* Greeting */}
      <div style={{ background: "linear-gradient(135deg, #fff7ed, #ffedd5)", border: "1px solid #fed7aa", borderRadius: 12, padding: "14px 18px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ fontSize: 32 }}>👋</div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#92400e" }}>Selamat Pagi, {user.name.split(" ")[0]}!</div>
          <div style={{ fontSize: 12, color: "#b45309", marginTop: 2 }}>Shift pagi · 08:00 – 16:00 · Jumat, 27 Feb 2026</div>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <button className="btn-primary">Clock-in ⏱</button>
        </div>
      </div>

      {/* Stat grid */}
      <div className="staff-stat-grid">
        {[
          { label: "Kamar Tersedia", value: DASHBOARD_STATS.kamarKosong, color: "#16a34a", bg: "#dcfce7", icon: "🟢", sub: "Siap disewa" },
          { label: "Kamar Booked", value: DASHBOARD_STATS.kamarBooked, color: "#b45309", bg: "#fef3c7", icon: "🟡", sub: "Menunggu check-in" },
          { label: "Tiket Urgent", value: DASHBOARD_STATS.tiketUrgent, color: "#dc2626", bg: "#fee2e2", icon: "🔴", sub: "Perlu segera ditangani" },
          { label: "Jadwal Hari Ini", value: JADWAL_SERVICE_HARI_INI.length, color: "#1d4ed8", bg: "#dbeafe", icon: "🔵", sub: "Weekly service" },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ borderTop: `3px solid ${s.color}` }}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Jadwal + Tiket */}
      <div className="widget-grid-2">
        <div className="widget">
          <div className="widget-header">
            <div className="widget-title"><span>✦</span> Jadwal Service Hari Ini</div>
            <Badge color="#1d4ed8" bg="#dbeafe">{JADWAL_SERVICE_HARI_INI.length} kamar</Badge>
          </div>
          <div className="widget-body">
            {JADWAL_SERVICE_HARI_INI.map((j, i) => (
              <div key={i} className="list-row">
                <div>
                  <div className="list-row-title">Kamar {j.kamar}</div>
                  <div className="list-row-sub">{j.penghuni}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#f97316", fontFamily: "'JetBrains Mono', monospace" }}>{j.jam}</div>
                  <button className="btn-ghost" style={{ marginTop: 4, padding: "4px 10px", fontSize: 11 }}>Mulai</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="widget">
          <div className="widget-header">
            <div className="widget-title"><span>⚑</span> Tiket Keluhan Aktif</div>
            <Badge color="#dc2626" bg="#fee2e2">{TIKET_DATA.filter(t => t.status !== "selesai").length} open</Badge>
          </div>
          <div className="widget-body">
            {TIKET_DATA.filter(t => t.status !== "selesai").map(t => (
              <div key={t.id} className="list-row">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                    <div className="list-row-title">Kamar {t.kamar} — {t.kategori}</div>
                    {t.prioritas === "urgent" && <Badge color="#dc2626" bg="#fee2e2">URGENT</Badge>}
                  </div>
                  <div className="list-row-sub">{t.deskripsi}</div>
                </div>
                <Badge color={TIKET_STATUS_CONFIG[t.status].color} bg={TIKET_STATUS_CONFIG[t.status].bg}>
                  {TIKET_STATUS_CONFIG[t.status].label}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PLACEHOLDER (Coming Soon)
// ============================================================
function ComingSoon({ menuId }) {
  const titles = MENU_TITLES;
  return (
    <div className="fade-up" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 420 }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>🚧</div>
      <div style={{ fontSize: 18, fontWeight: 800, color: "#1e293b", marginBottom: 6 }}>{titles[menuId] || menuId}</div>
      <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 20 }}>Modul ini sedang dalam antrian development</div>
      <div style={{ display: "flex", gap: 8 }}>
        <span style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 8, padding: "6px 14px", fontSize: 12, color: "#92400e", fontWeight: 600 }}>
          Senyum Inn · Modul {menuId}
        </span>
      </div>
    </div>
  );
}

// ============================================================
// APP
// ============================================================
export default function App() {
  const [user, setUser] = useState(null);
  const [activeMenu, setActiveMenu] = useState("dashboard");

  if (!user) return <LoginPage onLogin={setUser} />;

  const renderContent = () => {
    const role = user.role;
    if (activeMenu === "dashboard") return role === "admin" ? <DashboardAdmin /> : <DashboardStaff user={user} />;
    if (activeMenu === "monitor") return <Monitor user={user} />;
    if (activeMenu === "keluhan") return <Keluhan userRole={role} />;
    if (activeMenu === "weekly") return <Weekly userRole={role} />;
    if (activeMenu === "absensi") return <Absensi userRole={role} user={user} />;
    if (activeMenu === "penyewa") return <Penyewa userRole={role} />;
    if (activeMenu === "checkin") return <Checkin userRole={role} />;
    if (activeMenu === "tagihan") return <Tagihan userRole={role} />;
    if (activeMenu === "kas") return <Kas userRole={role} />;
    if (activeMenu === "laporan") return <Laporan userRole={role} />;
    if (activeMenu === "karyawan") return <Karyawan userRole={role} />;
    if (activeMenu === "penggajian") return <Penggajian userRole={role} />;
    if (activeMenu === "laporanabsensi") return <AbsensiKaryawan userRole={role} />;
    if (activeMenu === "profil" || activeMenu === "users") return <Pengaturan userRole={role} activeMod={activeMenu} />;
    if (activeMenu === "riwayat") return <Riwayat userRole={role} />;
    if (activeMenu === "kalender") return <Kalender userRole={role} />;
    if (activeMenu === "jobdesk") return <Jobdesk userRole={role} />;
    if (activeMenu === "pettycash") return <Pettycash userRole={role} />;
    return <ComingSoon menuId={activeMenu} />;
  };

  return (
    <div className="app">
      <StyleInjector />
      <Sidebar user={user} activeMenu={activeMenu} onMenuChange={setActiveMenu} onLogout={() => { setUser(null); setActiveMenu("dashboard"); }} />
      <div className="main">
        <Header title={MENU_TITLES[activeMenu] || ""} />
        <div className="content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
