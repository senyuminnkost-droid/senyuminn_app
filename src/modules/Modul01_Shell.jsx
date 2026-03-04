import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

// ============================================================
// USER CONFIG — ganti setelah connect Supabase
// ============================================================
const USERS = [
  { id: 1, username: "admin", password: "admin123", role: "superadmin", name: "Yusuf Vindra Asmara", jabatan: "Owner", avatar: "YV" },
];

// ============================================================
// LAZY MODULES — uncomment satu per satu setelah file tersedia
// ============================================================
// const ModulDashboard   = lazy(() => import("./Modul02_Dashboard"));
// const ModulMonitor     = lazy(() => import("./Modul03_Monitor"));
// const ModulAbsensi     = lazy(() => import("./Modul04_Absensi"));
// const ModulKeluhan     = lazy(() => import("./Modul05_Keluhan"));
// const ModulWeekly      = lazy(() => import("./Modul06_Weekly"));
// const ModulKalender    = lazy(() => import("./Modul07_Kalender"));
// const ModulPenyewa     = lazy(() => import("./Modul08_Penyewa"));
// const ModulCheckin     = lazy(() => import("./Modul09_Checkin"));
// const ModulRiwayat     = lazy(() => import("./Modul10_Riwayat"));
// const ModulTagihan     = lazy(() => import("./Modul11_Tagihan"));
// const ModulKas         = lazy(() => import("./Modul12_Kas"));
// const ModulLaporan     = lazy(() => import("./Modul13_Laporan"));
// const ModulKaryawan    = lazy(() => import("./Modul14_Karyawan"));
// const ModulPenggajian  = lazy(() => import("./Modul15_Penggajian"));
// const ModulLapAbsensi  = lazy(() => import("./Modul16_LaporanAbsensi"));
// const ModulProfil      = lazy(() => import("./Modul17_Profil"));
// const ModulUsers       = lazy(() => import("./Modul18_Users"));

// ============================================================
// MENU CONFIG
// ============================================================
const MENU_ADMIN = [
  {
    section: "OPERASIONAL",
    items: [
      { id: "dashboard", label: "Dashboard",           icon: "▣" },
      { id: "monitor",   label: "Monitor Kamar",       icon: "⊞" },
      { id: "absensi",   label: "Absensi & Jadwal",    icon: "◷" },
      { id: "keluhan",   label: "Keluhan & Tiket",     icon: "⚐" },
      { id: "weekly",    label: "Weekly Service",      icon: "◈" },
      { id: "kalender",  label: "Kalender Operasional",icon: "▦" },
    ],
  },
  {
    section: "TENANT",
    items: [
      { id: "penyewa",  label: "Data Penyewa",         icon: "◎" },
      { id: "checkin",  label: "Check-in / Check-out", icon: "⇄" },
      { id: "riwayat",  label: "Riwayat Penyewa",      icon: "◱" },
    ],
  },
  {
    section: "KEUANGAN",
    items: [
      { id: "tagihan",  label: "Tagihan & Penagihan",  icon: "◉" },
      { id: "kas",      label: "Kas & Jurnal",         icon: "⊟" },
      { id: "laporan",  label: "Laporan Keuangan",     icon: "▤" },
    ],
  },
  {
    section: "HR",
    items: [
      { id: "karyawan",      label: "Data Karyawan",   icon: "⊛" },
      { id: "penggajian",    label: "Penggajian",      icon: "⊕" },
      { id: "laporanabsensi",label: "Laporan Absensi", icon: "▥" },
    ],
  },
  {
    section: "PENGATURAN",
    items: [
      { id: "profil", label: "Profil Kost",      icon: "⊙" },
      { id: "users",  label: "Manajemen User",   icon: "⊗" },
    ],
  },
];

const MENU_STAFF = [
  {
    section: "OPERASIONAL",
    items: [
      { id: "dashboard", label: "Dashboard",           icon: "▣" },
      { id: "monitor",   label: "Monitor Kamar",       icon: "⊞" },
      { id: "absensi",   label: "Absensi & Jadwal",    icon: "◷" },
      { id: "keluhan",   label: "Keluhan & Tiket",     icon: "⚐" },
      { id: "weekly",    label: "Weekly Service",      icon: "◈" },
      { id: "kalender",  label: "Kalender Operasional",icon: "▦" },
    ],
  },
  {
    section: "TENANT",
    items: [
      { id: "penyewa",  label: "Data Penyewa",         icon: "◎" },
      { id: "checkin",  label: "Check-in / Check-out", icon: "⇄" },
    ],
  },
];

const MENU_TITLES = {
  dashboard:      "Dashboard",
  monitor:        "Monitor Kamar",
  absensi:        "Absensi & Jadwal Staff",
  keluhan:        "Keluhan & Tiket",
  weekly:         "Weekly Service",
  kalender:       "Kalender Operasional",
  penyewa:        "Data Penyewa",
  checkin:        "Check-in / Check-out",
  riwayat:        "Riwayat Penyewa",
  tagihan:        "Tagihan & Penagihan",
  kas:            "Kas & Jurnal",
  laporan:        "Laporan Keuangan",
  karyawan:       "Data Karyawan",
  penggajian:     "Penggajian",
  laporanabsensi: "Laporan Absensi",
  profil:         "Profil Kost",
  users:          "Manajemen User",
};

// ============================================================
// GLOBAL CSS
// ============================================================
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --orange:      #f97316;
    --orange-dark: #ea580c;
    --orange-pale: #fff7ed;
    --orange-light:#ffedd5;
    --orange-mid:  #fed7aa;

    --gray-950: #0a0a0a;
    --gray-900: #111827;
    --gray-800: #1f2937;
    --gray-700: #374151;
    --gray-600: #4b5563;
    --gray-500: #6b7280;
    --gray-400: #9ca3af;
    --gray-300: #d1d5db;
    --gray-200: #e5e7eb;
    --gray-100: #f3f4f6;
    --gray-50:  #f9fafb;
    --white:    #ffffff;

    --sidebar-w: 220px;
    --header-h:  52px;

    --shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
    --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
    --shadow-lg: 0 10px 30px rgba(0,0,0,0.1);
  }

  html, body, #root { height: 100%; }

  /* ─── MODAL PORTAL FIX ───────────────────── */
  .modal-portal-overlay {
    position: fixed !important;
    top: 0 !important; left: 0 !important;
    width: 100vw !important; height: 100vh !important;
    background: rgba(17,24,39,0.65) !important;
    backdrop-filter: blur(4px) !important;
    z-index: 9999 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 16px !important;
    box-sizing: border-box !important;
  }
  body {
    font-family: 'Inter', -apple-system, sans-serif;
    font-size: 13px;
    color: var(--gray-800);
    background: var(--gray-50);
    -webkit-font-smoothing: antialiased;
  }

  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--gray-200); border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--gray-300); }

  /* ─── APP SHELL ──────────────────────────── */
  .s-app   { display: flex; height: 100vh; overflow: hidden; background: var(--gray-50); }
  .s-main  { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }
  .s-content { flex: 1; overflow-y: auto; padding: 20px 24px; position: relative; }

  /* ─── SIDEBAR ────────────────────────────── */
  .s-sidebar {
    width: var(--sidebar-w);
    background: var(--white);
    border-right: 1px solid var(--gray-200);
    display: flex; flex-direction: column;
    flex-shrink: 0; overflow: hidden;
    transition: width 0.2s ease;
    z-index: 100;
  }
  .s-sidebar.minimized { width: 56px; }

  /* Mobile overlay */
  .s-sidebar.mobile-hidden {
    position: fixed; top: 0; left: 0; height: 100%;
    transform: translateX(-100%);
    transition: transform 0.25s ease;
    box-shadow: none;
  }
  .s-sidebar.mobile-open {
    transform: translateX(0);
    box-shadow: 4px 0 24px rgba(0,0,0,0.12);
  }

  .s-overlay {
    display: none;
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.3);
    z-index: 99;
    backdrop-filter: blur(2px);
  }
  .s-overlay.visible { display: block; }

  .s-logo {
    padding: 14px 12px;
    display: flex; align-items: center; gap: 10px;
    border-bottom: 1px solid var(--gray-100);
    flex-shrink: 0; min-height: 52px;
    overflow: hidden;
  }
  .s-logo-mark {
    width: 32px; height: 32px; border-radius: 8px; flex-shrink: 0;
    background: linear-gradient(135deg, var(--orange), var(--orange-dark));
    display: flex; align-items: center; justify-content: center;
    font-size: 15px; font-weight: 700; color: #fff;
    box-shadow: 0 2px 8px rgba(249,115,22,0.35);
  }
  .s-logo-text { overflow: hidden; white-space: nowrap; transition: opacity 0.15s; }
  .s-sidebar.minimized .s-logo-text { opacity: 0; width: 0; }
  .s-logo-name { font-size: 12px; font-weight: 600; color: var(--gray-900); letter-spacing: 0.2px; }
  .s-logo-sub  { font-size: 9px; font-weight: 500; color: var(--orange); letter-spacing: 1px; text-transform: uppercase; margin-top: 1px; }

  .s-nav { flex: 1; overflow-y: auto; overflow-x: hidden; padding: 8px 0 4px; }

  .s-nav-section { margin-bottom: 2px; }
  .s-nav-label {
    padding: 8px 16px 3px;
    font-size: 9px; font-weight: 600; letter-spacing: 1.2px;
    color: var(--gray-400); text-transform: uppercase;
    white-space: nowrap; overflow: hidden;
    transition: opacity 0.15s;
  }
  .s-sidebar.minimized .s-nav-label { opacity: 0; height: 0; padding: 0; }

  .s-nav-item {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 10px; margin: 1px 8px; border-radius: 7px;
    cursor: pointer; font-size: 12.5px; font-weight: 400;
    color: var(--gray-600); transition: all 0.12s;
    user-select: none; white-space: nowrap; overflow: hidden;
    position: relative;
  }
  .s-nav-item:hover { background: var(--gray-100); color: var(--gray-900); }
  .s-nav-item.active { background: var(--gray-900); color: var(--white); font-weight: 500; }
  .s-nav-label-text { transition: opacity 0.15s; }
  .s-sidebar.minimized .s-nav-label-text { opacity: 0; width: 0; overflow: hidden; }

  /* Tooltip saat minimized */
  .s-sidebar.minimized .s-nav-item::after {
    content: attr(data-label);
    position: absolute; left: 52px; top: 50%; transform: translateY(-50%);
    background: var(--gray-900); color: #fff;
    padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 500;
    white-space: nowrap; pointer-events: none; opacity: 0;
    transition: opacity 0.15s; z-index: 200;
  }
  .s-sidebar.minimized .s-nav-item:hover::after { opacity: 1; }

  .s-nav-icon {
    width: 18px; height: 18px; display: flex; align-items: center; justify-content: center;
    font-size: 13px; flex-shrink: 0;
  }

  .s-user {
    padding: 10px 12px; border-top: 1px solid var(--gray-100);
    display: flex; align-items: center; gap: 9px; flex-shrink: 0;
    overflow: hidden;
  }
  .s-avatar {
    width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, var(--orange), var(--orange-dark));
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; font-weight: 700; color: #fff; letter-spacing: 0.5px;
  }
  .s-user-info { flex: 1; min-width: 0; transition: opacity 0.15s; white-space: nowrap; overflow: hidden; }
  .s-sidebar.minimized .s-user-info { opacity: 0; width: 0; }
  .s-user-name { font-size: 12px; font-weight: 500; color: var(--gray-900); overflow: hidden; text-overflow: ellipsis; }
  .s-user-role { font-size: 10px; color: var(--gray-400); margin-top: 1px; }
  .s-logout {
    margin-left: auto; background: none; border: none; cursor: pointer; flex-shrink: 0;
    color: var(--gray-400); font-size: 14px; padding: 4px; border-radius: 5px;
    transition: all 0.12s; display: flex; align-items: center; justify-content: center;
  }
  .s-sidebar.minimized .s-logout { margin-left: 0; }
  .s-logout:hover { color: #ef4444; background: #fee2e2; }

  /* ─── HEADER ─────────────────────────────── */
  .s-header {
    height: var(--header-h); flex-shrink: 0;
    background: var(--white); border-bottom: 1px solid var(--gray-200);
    padding: 0 16px 0 12px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .s-header-left { display: flex; align-items: center; gap: 10px; }
  .s-toggle-btn {
    width: 32px; height: 32px; border-radius: 7px; flex-shrink: 0;
    background: var(--gray-100); border: 1px solid var(--gray-200);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 14px; transition: all 0.12s; color: var(--gray-600);
  }
  .s-toggle-btn:hover { background: var(--gray-200); }
  .s-header-titles {}
  .s-header-context { font-size: 10px; color: var(--gray-400); font-weight: 400; margin-bottom: 1px; }
  .s-header-title { font-size: 14px; font-weight: 600; color: var(--gray-900); }
  .s-header-right { display: flex; align-items: center; gap: 8px;  overflow: visible; position: relative; z-index: 101; }
  .s-header-btn {
    width: 32px; height: 32px; border-radius: 7px;
    background: var(--gray-100); border: 1px solid var(--gray-200);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 14px; transition: all 0.12s; color: var(--gray-600);
  }
  .s-header-btn:hover { background: var(--gray-200); }
  .s-date {
    font-size: 11px; color: var(--gray-500);
    font-family: 'JetBrains Mono', monospace; font-weight: 400;
  }

  /* ─── RESPONSIVE ─────────────────────────── */
  @media (max-width: 768px) {
    .s-content { padding: 14px 14px; }
    .s-date { display: none; }
  }

  @media (max-width: 480px) {
    .s-content { padding: 12px 12px; }
    .s-header-title { font-size: 13px; }
  }

  /* ─── SEARCH GLOBAL ─────────────────────── */
  .s-search-wrap { position: relative; }
  .s-search-box {
    display: flex; align-items: center; gap: 7px;
    background: var(--gray-100); border: 1.5px solid var(--gray-200);
    border-radius: 8px; padding: 5px 11px; width: 220px;
    transition: all 0.15s; cursor: text;
  }
  .s-search-box:focus-within { background: #fff; border-color: var(--orange); width: 260px; }
  .s-search-input {
    border: none; outline: none; background: transparent;
    font-size: 12px; color: var(--gray-900); width: 100%; font-family: inherit;
  }
  .s-search-input::placeholder { color: var(--gray-400); }
  .s-search-dropdown {
    position: absolute; top: calc(100% + 6px); right: 0;
    background: #fff; border: 1px solid var(--gray-200);
    border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.12);
    width: 320px; z-index: 99999; overflow: hidden;
    animation: shDropIn 0.15s ease;
  }
  @keyframes shDropIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
  .s-search-section { padding: 8px 12px 4px; font-size: 9px; font-weight: 700; color: var(--gray-400); text-transform: uppercase; letter-spacing: 1px; }
  .s-search-item {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 12px; cursor: pointer; transition: background 0.1s;
  }
  .s-search-item:hover { background: #fff7ed; }
  .s-search-item-icon { width: 28px; height: 28px; border-radius: 7px; background: var(--gray-100); display: flex; align-items: center; justify-content: center; font-size: 13px; flex-shrink: 0; }
  .s-search-item-name { font-size: 12px; font-weight: 600; color: var(--gray-900); }
  .s-search-item-sub  { font-size: 10px; color: var(--gray-400); margin-top: 1px; }
  .s-search-empty { padding: 20px; text-align: center; font-size: 12px; color: var(--gray-400); }

  /* ─── NOTIFIKASI ─────────────────────────── */
  .s-notif-wrap { position: relative; }
  .s-notif-btn {
    width: 32px; height: 32px; border-radius: 7px; position: relative;
    background: var(--gray-100); border: 1px solid var(--gray-200);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 14px; transition: all 0.12s;
  }
  .s-notif-btn:hover { background: var(--gray-200); }
  .s-notif-badge {
    position: absolute; top: -4px; right: -4px;
    width: 16px; height: 16px; border-radius: 50%;
    background: #ef4444; color: #fff; font-size: 9px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    border: 2px solid #fff;
  }
  .s-notif-dropdown {
    position: absolute; top: calc(100% + 6px); right: 0;
    background: #fff; border: 1px solid var(--gray-200);
    border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.12);
    width: 300px; z-index: 99999; overflow: hidden;
    animation: shDropIn 0.15s ease;
  }
  .s-notif-head { padding: 12px 14px 8px; border-bottom: 1px solid var(--gray-100); display: flex; align-items: center; justify-content: space-between; }
  .s-notif-head-title { font-size: 12px; font-weight: 700; color: var(--gray-900); }
  .s-notif-head-clear { font-size: 10px; color: var(--orange); cursor: pointer; font-weight: 600; }
  .s-notif-item {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 10px 14px; border-bottom: 1px solid var(--gray-100);
    cursor: pointer; transition: background 0.1s;
  }
  .s-notif-item:last-child { border-bottom: none; }
  .s-notif-item:hover { background: #fafafa; }
  .s-notif-item.unread { background: #fff7ed; }
  .s-notif-icon { font-size: 18px; flex-shrink: 0; margin-top: 1px; }
  .s-notif-text { flex: 1; min-width: 0; }
  .s-notif-msg  { font-size: 12px; font-weight: 500; color: var(--gray-800); line-height: 1.4; }
  .s-notif-time { font-size: 10px; color: var(--gray-400); margin-top: 2px; }
  .s-notif-empty { padding: 24px; text-align: center; font-size: 12px; color: var(--gray-400); }

  /* ─── LOADING ────────────────────────────── */
  .s-loading {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    height: 300px; color: var(--gray-400); gap: 12px;
  }
  .s-spinner {
    width: 24px; height: 24px; border-radius: 50%;
    border: 2px solid var(--gray-200);
    border-top-color: var(--orange);
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ─── COMING SOON ────────────────────────── */
  .s-soon {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    height: 400px; text-align: center;
  }
  .s-soon-icon { font-size: 40px; margin-bottom: 14px; opacity: 0.4; }
  .s-soon-title { font-size: 15px; font-weight: 600; color: var(--gray-700); margin-bottom: 4px; }
  .s-soon-sub { font-size: 12px; color: var(--gray-400); }

  /* ─── LOGIN ──────────────────────────────── */
  .s-login-wrap {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: var(--gray-50);
  }
  .s-login-card {
    background: var(--white); border-radius: 16px; padding: 36px 32px;
    width: 360px; box-shadow: var(--shadow-lg); border: 1px solid var(--gray-200);
  }
  .s-login-logo {
    display: flex; flex-direction: column; align-items: center; margin-bottom: 28px;
  }
  .s-login-mark {
    width: 52px; height: 52px; border-radius: 13px;
    background: linear-gradient(135deg, var(--orange), var(--orange-dark));
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; font-weight: 700; color: #fff; margin-bottom: 10px;
    box-shadow: 0 6px 20px rgba(249,115,22,0.3);
  }
  .s-login-brand { font-size: 17px; font-weight: 700; color: var(--gray-900); }
  .s-login-brand-sub { font-size: 10px; color: var(--orange); font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase; margin-top: 2px; }

  .s-field { margin-bottom: 14px; }
  .s-label { font-size: 11px; font-weight: 500; color: var(--gray-600); display: block; margin-bottom: 5px; letter-spacing: 0.3px; }
  .s-input {
    width: 100%; padding: 9px 12px; border-radius: 8px;
    border: 1px solid var(--gray-200); font-size: 13px; color: var(--gray-800);
    outline: none; transition: border-color 0.15s; font-family: inherit;
    background: var(--white);
  }
  .s-input:focus { border-color: var(--orange); box-shadow: 0 0 0 3px rgba(249,115,22,0.1); }
  .s-input::placeholder { color: var(--gray-400); }

  .s-login-error {
    background: #fee2e2; color: #dc2626; border-radius: 7px;
    padding: 8px 12px; font-size: 12px; margin-bottom: 14px;
  }

  .s-btn-primary {
    width: 100%; padding: 10px; border-radius: 8px; border: none; cursor: pointer;
    background: linear-gradient(135deg, var(--orange), var(--orange-dark));
    color: #fff; font-size: 13px; font-weight: 600; font-family: inherit;
    transition: all 0.15s; box-shadow: 0 3px 10px rgba(249,115,22,0.3);
  }
  .s-btn-primary:hover { filter: brightness(1.05); }
  .s-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

  .s-login-hint {
    margin-top: 16px; padding: 10px 12px; background: var(--gray-50);
    border-radius: 7px; border: 1px solid var(--gray-100);
    font-size: 11px; color: var(--gray-500); line-height: 1.6;
  }
  .s-login-hint b { color: var(--gray-700); }

  /* ─── FADE IN ────────────────────────────── */
  @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  .fade-in { animation: fadeIn 0.2s ease forwards; }
`;

function StyleInjector() {
  useEffect(() => {
    const id = "senyuminn-shell-css";
    if (document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id;
    el.textContent = CSS;
    document.head.appendChild(el);
    return () => { const e = document.getElementById(id); if (e) e.remove(); };
  }, []);
  return null;
}

// ============================================================
// HELPERS
// ============================================================
const formatDate = () => {
  const d = new Date();
  const days = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
  const months = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

// ============================================================
// LOGIN PAGE
// ============================================================
function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleLogin = () => {
    if (!username || !password) { setError("Username dan password wajib diisi"); return; }
    setLoading(true);
    setTimeout(() => {
      const user = USERS.find(u => u.username === username && u.password === password);
      if (user) { onLogin(user); }
      else { setError("Username atau password salah"); setLoading(false); }
    }, 500);
  };

  return (
    <div className="s-login-wrap">
      <div className="s-login-card fade-in">
        <div className="s-login-logo">
          <div className="s-login-mark">S</div>
          <div className="s-login-brand">SENYUM INN</div>
          <div className="s-login-brand-sub">Exclusive Kost</div>
        </div>

        <div className="s-field">
          <label className="s-label">USERNAME</label>
          <input
            className="s-input"
            placeholder="Masukkan username"
            value={username}
            onChange={e => { setUsername(e.target.value); setError(""); }}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            autoFocus
          />
        </div>

        <div className="s-field">
          <label className="s-label">PASSWORD</label>
          <input
            className="s-input"
            type="password"
            placeholder="Masukkan password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(""); }}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
          />
        </div>

        {error && <div className="s-login-error">{error}</div>}

        <button className="s-btn-primary" onClick={handleLogin} disabled={loading}>
          {loading ? "Memproses..." : "Masuk"}
        </button>


      </div>
    </div>
  );
}

// ============================================================
// SIDEBAR
// ============================================================
function Sidebar({ user, active, onSelect, onLogout, minimized, isMobile, mobileOpen, onOverlayClick }) {
  const menus = user.role === "staff" ? MENU_STAFF : MENU_ADMIN;
  const sidebarClass = [
    "s-sidebar",
    minimized && !isMobile ? "minimized" : "",
    isMobile ? "mobile-hidden" : "",
    isMobile && mobileOpen ? "mobile-open" : "",
  ].filter(Boolean).join(" ");

  return (
    <>
      {isMobile && mobileOpen && <div className="s-overlay visible" onClick={onOverlayClick} />}
      <aside className={sidebarClass}>
        {/* Logo */}
        <div className="s-logo">
          <div className="s-logo-mark">S</div>
          <div className="s-logo-text">
            <div className="s-logo-name">Senyum Inn</div>
            <div className="s-logo-sub">Exclusive Kost</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="s-nav">
          {menus.map(section => (
            <div key={section.section} className="s-nav-section">
              <div className="s-nav-label">{section.section}</div>
              {section.items.map(item => (
                <div
                  key={item.id}
                  className={`s-nav-item ${active === item.id ? "active" : ""}`}
                  data-label={item.label}
                  onClick={() => { onSelect(item.id); if (isMobile) onOverlayClick(); }}
                >
                  <span className="s-nav-icon">{item.icon}</span>
                  <span className="s-nav-label-text">{item.label}</span>
                </div>
              ))}
            </div>
          ))}
        </nav>

        {/* User */}
        <div className="s-user">
          <div className="s-avatar">{user.avatar}</div>
          <div className="s-user-info">
            <div className="s-user-name">{user.name}</div>
            <div className="s-user-role">{user.jabatan}</div>
          </div>
          <button className="s-logout" onClick={onLogout} title="Keluar">⏻</button>
        </div>
      </aside>
    </>
  );
}

// ============================================================
// HEADER
// ============================================================
function Header({ activeMenu, onToggle, globalData = {}, onMenuChange }) {
  const { penyewaList=[], tagihanList=[], tiketList=[] } = globalData;
  let sectionName = "";
  for (const s of MENU_ADMIN) {
    if (s.items.find(i => i.id === activeMenu)) { sectionName = s.section; break; }
  }
  const title = MENU_TITLES[activeMenu] || activeMenu;

  // ── Search state
  const [searchQ,    setSearchQ]    = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showNotif,  setShowNotif]  = useState(false);
  const [readNotifs, setReadNotifs] = useState([]);

  // ── Generate notifikasi dari data real
  const notifikasi = [];
  penyewaList.forEach(p => {
    const sisa = p.kontrakSelesai ? Math.ceil((new Date(p.kontrakSelesai) - new Date()) / 86400000) : null;
    if (sisa !== null && sisa <= 30 && sisa >= 0)
      notifikasi.push({ id: `k-${p.id}`, icon: "⚠️", msg: `Kontrak ${p.nama} (Kamar ${p.kamarId}) habis ${sisa} hari lagi`, menu: "checkin", time: "Hari ini" });
    if (sisa !== null && sisa < 0)
      notifikasi.push({ id: `kx-${p.id}`, icon: "🔴", msg: `Kontrak ${p.nama} sudah HABIS ${Math.abs(sisa)} hari lalu!`, menu: "checkin", time: "Hari ini" });
  });
  tagihanList.filter(t => t.status === "terlambat").forEach(t => {
    notifikasi.push({ id: `t-${t.id}`, icon: "💸", msg: `Tagihan ${t.nama} Kamar ${t.kamarId} terlambat ${t.dendaHari} hari`, menu: "tagihan", time: "Hari ini" });
  });
  tiketList.filter(t => t.prioritas === "urgent" && t.status !== "selesai").forEach(t => {
    notifikasi.push({ id: `tk-${t.id}`, icon: "🔧", msg: `Tiket urgent: ${t.kategori} Kamar ${t.kamar}`, menu: "keluhan", time: t.tanggal });
  });

  const unreadCount = notifikasi.filter(n => !readNotifs.includes(n.id)).length;

  // ── Search results
  const searchResults = searchQ.length >= 2 ? [
    ...penyewaList.filter(p => p.nama?.toLowerCase().includes(searchQ.toLowerCase()) || String(p.kamarId).includes(searchQ))
      .slice(0,4).map(p => ({ icon:"👤", name: p.nama, sub: `Kamar ${p.kamarId} · ${p.noHP||"—"}`, menu:"penyewa" })),
  ] : [];

  // Close dropdown saat klik luar
  useEffect(() => {
    const handler = () => { setShowSearch(false); setShowNotif(false); };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <header className="s-header">
      <div className="s-header-left">
        <div className="s-toggle-btn" onClick={onToggle} title="Toggle Sidebar">☰</div>
        <div className="s-header-titles">
          <div className="s-header-context">Senyum Inn · {sectionName}</div>
          <div className="s-header-title">{title}</div>
        </div>
      </div>
      <div className="s-header-right">
        <div className="s-date">{formatDate()}</div>

        {/* Search Global */}
        <div className="s-search-wrap" onClick={e => e.stopPropagation()}>
          <div className="s-search-box">
            <span style={{ fontSize: 13, color: "var(--gray-400)" }}>🔍</span>
            <input
              className="s-search-input"
              placeholder="Cari penyewa, kamar..."
              value={searchQ}
              onChange={e => { setSearchQ(e.target.value); setShowSearch(true); setShowNotif(false); }}
              onFocus={() => { setShowSearch(true); setShowNotif(false); }}
            />
            {searchQ && <span style={{ cursor:"pointer", color:"var(--gray-400)", fontSize:12 }} onClick={() => { setSearchQ(""); setShowSearch(false); }}>✕</span>}
          </div>
          {showSearch && (
            <div className="s-search-dropdown">
              {searchQ.length < 2 ? (
                <div className="s-search-empty">Ketik minimal 2 karakter untuk mencari</div>
              ) : searchResults.length === 0 ? (
                <div className="s-search-empty">Tidak ada hasil untuk "{searchQ}"</div>
              ) : (
                <>
                  <div className="s-search-section">Penyewa</div>
                  {searchResults.map((r,i) => (
                    <div key={i} className="s-search-item" onClick={() => { onMenuChange(r.menu); setShowSearch(false); setSearchQ(""); }}>
                      <div className="s-search-item-icon">{r.icon}</div>
                      <div>
                        <div className="s-search-item-name">{r.name}</div>
                        <div className="s-search-item-sub">{r.sub}</div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>

        {/* Notifikasi */}
        <div className="s-notif-wrap" onClick={e => e.stopPropagation()}>
          <div className="s-notif-btn" onClick={() => { setShowNotif(v => !v); setShowSearch(false); }}>
            🔔
            {unreadCount > 0 && <div className="s-notif-badge">{unreadCount > 9 ? "9+" : unreadCount}</div>}
          </div>
          {showNotif && (
            <div className="s-notif-dropdown">
              <div className="s-notif-head">
                <div className="s-notif-head-title">🔔 Notifikasi {unreadCount > 0 && `(${unreadCount})`}</div>
                {notifikasi.length > 0 && <div className="s-notif-head-clear" onClick={() => setReadNotifs(notifikasi.map(n=>n.id))}>Tandai semua dibaca</div>}
              </div>
              {notifikasi.length === 0 ? (
                <div className="s-notif-empty">
                  <div style={{ fontSize: 28, marginBottom: 6 }}>✅</div>
                  Tidak ada notifikasi
                </div>
              ) : (
                notifikasi.slice(0,8).map(n => (
                  <div key={n.id} className={`s-notif-item ${!readNotifs.includes(n.id)?"unread":""}`}
                    onClick={() => { onMenuChange(n.menu); setReadNotifs(p=>[...p,n.id]); setShowNotif(false); }}>
                    <div className="s-notif-icon">{n.icon}</div>
                    <div className="s-notif-text">
                      <div className="s-notif-msg">{n.msg}</div>
                      <div className="s-notif-time">{n.time}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

      </div>
    </header>
  );
}

// ============================================================
// LOADING FALLBACK
// ============================================================
function LoadingFallback() {
  return (
    <div className="s-loading">
      <div className="s-spinner" />
      <span style={{ fontSize: 12 }}>Memuat modul...</span>
    </div>
  );
}

// ============================================================
// COMING SOON
// ============================================================
function ComingSoon({ menuId }) {
  const title = MENU_TITLES[menuId] || menuId;
  return (
    <div className="s-soon fade-in">
      <div className="s-soon-icon">🚧</div>
      <div className="s-soon-title">{title}</div>
      <div className="s-soon-sub">Modul sedang dalam pengembangan</div>
    </div>
  );
}

// ============================================================
// RENDER MODULE
// ============================================================
// ============================================================
// RENDER MODULE — auto load, fallback ComingSoon
// ============================================================
const moduleCache = {};

function RenderModule({ menuId, user, globalData }) {
  const [Comp, setComp] = useState(null);
  const [failed, setFailed] = useState(false);

  const moduleNames = {
    dashboard:      "Modul02_Dashboard",
    monitor:        "Modul03_Monitor",
    absensi:        "Modul04_Absensi",
    keluhan:        "Modul05_Keluhan",
    weekly:         "Modul06_Weekly",
    kalender:       "Modul07_Kalender",
    penyewa:        "Modul08_Penyewa",
    checkin:        "Modul09_Checkout",
    riwayat:        "Modul10_Riwayat",
    tagihan:        "Modul11_Tagihan",
    kas:            "Modul12_Kas",
    laporan:        "Modul13_Laporan",
    karyawan:       "Modul14_Karyawan",
    penggajian:     "Modul15_Penggajian",
    laporanabsensi: "Modul16_LaporanAbsensi",
    profil:         "Modul17_Profil",
    users:          "Modul18_Users",
  };

  useEffect(() => {
    const name = moduleNames[menuId];
    if (!name) { setFailed(true); return; }
    setComp(null);
    setFailed(false);

    if (moduleCache[menuId]) {
      setComp(() => moduleCache[menuId]);
      return;
    }

    import(`./${name}.jsx`)
      .then(m => {
        moduleCache[menuId] = m.default;
        setComp(() => m.default);
      })
      .catch(() => setFailed(true));
  }, [menuId]);

  if (failed) return <div className="fade-in"><ComingSoon menuId={menuId} /></div>;
  if (!Comp)  return <LoadingFallback />;
  return <div className="fade-in"><Comp user={user} globalData={globalData} /></div>;
}

// ============================================================
// APP ROOT
// ============================================================
export default function App() {
  const [user,        setUser]       = useState(null);
  const [activeMenu,  setActiveMenu] = useState("dashboard");
  const [minimized,   setMinimized]  = useState(false);
  const [mobileOpen,  setMobileOpen] = useState(false);

  // ── GLOBAL DATA STATE (→ Supabase nanti) ──────────────
  const [penyewaList,  setPenyewaList]  = useState([]);
  const [riwayatList,  setRiwayatList]  = useState([]);
  const [kamarList,    setKamarList]    = useState([]);
  const [karyawanList, setKaryawanList] = useState([]);
  const [tiketList,    setTiketList]    = useState([]);
  const [tagihanList,  setTagihanList]  = useState([]);
  const [kasJurnal,    setKasJurnal]    = useState([]);
  const [weeklyList,   setWeeklyList]   = useState([]);
  const [absensiList,  setAbsensiList]  = useState([]);

  // Bundel semua data & setter jadi satu object
  const globalData = {
    penyewaList,  setPenyewaList,
    riwayatList,  setRiwayatList,
    kamarList,    setKamarList,
    karyawanList, setKaryawanList,
    tiketList,    setTiketList,
    tagihanList,  setTagihanList,
    kasJurnal,    setKasJurnal,
    weeklyList,   setWeeklyList,
    absensiList,  setAbsensiList,
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  const handleToggle = () => {
    if (isMobile) setMobileOpen(o => !o);
    else setMinimized(m => !m);
  };

  if (!user) return (
    <>
      <StyleInjector />
      <LoginPage onLogin={setUser} />
    </>
  );

  return (
    <div className="s-app">
      <StyleInjector />
      <Sidebar
        user={user}
        active={activeMenu}
        onSelect={setActiveMenu}
        onLogout={() => { setUser(null); setActiveMenu("dashboard"); }}
        minimized={minimized}
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        onOverlayClick={() => setMobileOpen(false)}
      />
      <div className="s-main">
        <Header activeMenu={activeMenu} onToggle={handleToggle} globalData={globalData} onMenuChange={setActiveMenu} />
        <div className="s-content">
          <RenderModule menuId={activeMenu} user={user} globalData={globalData} />
        </div>
      </div>
    </div>
  );
}
