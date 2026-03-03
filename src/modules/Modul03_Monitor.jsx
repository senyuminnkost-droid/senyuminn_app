import { useState, useEffect } from "react";

// ============================================================
// MOCK DATA
// ============================================================
const KAMAR_LIST = [
  { id: 1, tipe: "Premium", penghuni: "Budi Santoso", status: "terisi" },
  { id: 2, tipe: "Reguler", penghuni: null, status: "tersedia" },
  { id: 3, tipe: "Reguler", penghuni: "Dian Pratiwi", status: "booked" },
  { id: 4, tipe: "Premium", penghuni: "Ahmad Fauzi", status: "terisi" },
  { id: 5, tipe: "Reguler", penghuni: null, status: "maintenance" },
  { id: 6, tipe: "Reguler", penghuni: "Siti Rahayu", status: "terisi" },
  { id: 7, tipe: "Premium", penghuni: "Rudi Hartono", status: "terisi" },
  { id: 8, tipe: "Reguler", penghuni: null, status: "deep-clean" },
  { id: 9, tipe: "Reguler", penghuni: "Dewi Lestari", status: "terisi" },
  { id: 10, tipe: "Premium", penghuni: "Prisca Aprilia", status: "terisi" },
  { id: 11, tipe: "Reguler", penghuni: null, status: "tersedia" },
  { id: 12, tipe: "Premium", penghuni: "Amalia Wulan", status: "terisi" },
];

const STAFF_LIST = [
  { id: 3, name: "Muh. Krisna Mukti", jabatan: "Clean & Service", shift: "Pagi", avatar: "MK" },
  { id: 4, name: "Gurit Yudho Anggoro", jabatan: "Staf Penjaga Malam", shift: "Malam", avatar: "GY" },
];

// Checklist item per kamar (dari SOP)
const CHECKLIST_ITEMS = [
  { id: "c1", label: "Sapu & pel lantai", area: "lantai" },
  { id: "c2", label: "Bersihkan debu furnitur", area: "furnitur" },
  { id: "c3", label: "Bersihkan kaca & cermin", area: "kaca" },
  { id: "c4", label: "Bersihkan kamar mandi", area: "km" },
  { id: "c5", label: "Ganti tempat sampah / kantong", area: "sampah" },
  { id: "c6", label: "Cek AC (bersih filter, tidak bocor)", area: "ac" },
  { id: "c7", label: "Cek kondisi pintu & kunci", area: "pintu" },
  { id: "c8", label: "Lap wastafel & keran", area: "wastafel" },
];

// Area umum (dikerjakan per hari, bukan per kamar)
const AREA_UMUM = [
  { id: "u1", label: "Selasar & tangga Lt.1", shift: "Pagi" },
  { id: "u2", label: "Selasar & tangga Lt.2", shift: "Pagi" },
  { id: "u3", label: "Selasar & tangga Lt.3", shift: "Pagi" },
  { id: "u4", label: "Kamar mandi Lt.1", shift: "Pagi" },
  { id: "u5", label: "Kamar mandi Lt.2", shift: "Pagi" },
  { id: "u6", label: "Kamar mandi Lt.3", shift: "Pagi" },
  { id: "u7", label: "Parkiran Lt.1", shift: "Pagi" },
  { id: "u8", label: "Kantor", shift: "All" },
  { id: "u9", label: "Tempat sampah besar", shift: "All" },
  { id: "u10", label: "Taman & wastafel umum", shift: "Pagi" },
  { id: "u11", label: "Lampu sore / gerbang", shift: "Sore" },
];

// Jadwal mingguan — minggu ini (Feb 24–28, 2026)
// Format: { tanggal, kamar: [id,...], staffId }
const JADWAL_MINGGU_INI = [
  { id: "j1", tanggal: "2026-02-24", kamar: [4, 10, 6], staffId: 3 },
  { id: "j2", tanggal: "2026-02-25", kamar: [1, 7, 12], staffId: 3 },
  { id: "j3", tanggal: "2026-02-26", kamar: [3, 6, 9], staffId: 3 },  // hari ini
  { id: "j4", tanggal: "2026-02-27", kamar: [2, 5, 11], staffId: 3 },  // besok (5 skip-maintenance)
  { id: "j5", tanggal: "2026-02-28", kamar: [8, 10, 12], staffId: 4 }, // 8 skip-deep-clean
];

// Progress data (siapa yang sudah selesai apa)
// key: `${jadwalId}_${kamarId}_${checklistId}` => boolean
const INITIAL_PROGRESS = {
  "j1_4_c1": true, "j1_4_c2": true, "j1_4_c3": true, "j1_4_c4": true,
  "j1_4_c5": true, "j1_4_c6": true, "j1_4_c7": true, "j1_4_c8": true,
  "j1_10_c1": true, "j1_10_c2": true, "j1_10_c3": true, "j1_10_c4": true,
  "j1_10_c5": true, "j1_10_c6": true, "j1_10_c7": true, "j1_10_c8": true,
  "j1_6_c1": true, "j1_6_c2": true, "j1_6_c3": true, "j1_6_c4": true,
  "j1_6_c5": true, "j1_6_c6": false, "j1_6_c7": true, "j1_6_c8": true,
  "j2_1_c1": true, "j2_1_c2": true, "j2_1_c3": true, "j2_1_c4": true,
  "j2_1_c5": true, "j2_1_c6": true, "j2_1_c7": true, "j2_1_c8": true,
  "j2_7_c1": true, "j2_7_c2": true, "j2_7_c3": true, "j2_7_c4": true,
  "j2_7_c5": true, "j2_7_c6": true, "j2_7_c7": true, "j2_7_c8": true,
  "j2_12_c1": true, "j2_12_c2": true, "j2_12_c3": true, "j2_12_c4": true,
  "j2_12_c5": true, "j2_12_c6": true, "j2_12_c7": true, "j2_12_c8": true,
  // hari ini (j3): kamar 3 selesai semua, kamar 6 sebagian, kamar 9 belum
  "j3_3_c1": true, "j3_3_c2": true, "j3_3_c3": true, "j3_3_c4": true,
  "j3_3_c5": true, "j3_3_c6": true, "j3_3_c7": true, "j3_3_c8": true,
  "j3_6_c1": true, "j3_6_c2": true, "j3_6_c3": false, "j3_6_c4": false,
  "j3_6_c5": true, "j3_6_c6": false, "j3_6_c7": true, "j3_6_c8": false,
};

const AREA_PROGRESS_INITIAL = {
  "j1_u1": true, "j1_u2": true, "j1_u3": true, "j1_u4": true, "j1_u5": true,
  "j1_u6": true, "j1_u7": true, "j1_u8": true, "j1_u9": true,
  "j2_u1": true, "j2_u2": true, "j2_u3": true, "j2_u4": true, "j2_u5": true,
  "j2_u6": true, "j2_u7": true, "j2_u8": true, "j2_u9": true, "j2_u10": true,
  "j3_u1": true, "j3_u2": true, "j3_u8": true,
};

const SKIP_STATUS = ["maintenance", "deep-clean"];

// ============================================================
// HELPERS
// ============================================================
const HARI = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];

const formatTgl = (str) => {
  const d = new Date(str);
  return `${HARI[d.getDay()]}, ${d.getDate()} ${BULAN[d.getMonth()]}`;
};

const isToday = (str) => str === "2026-02-26"; // mock today
const isPast = (str) => str < "2026-02-26";
const isFuture = (str) => str > "2026-02-26";

// ============================================================
// CSS
// ============================================================
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --or: #f97316; --or-d: #ea580c; --or-dd: #c2410c;
    --or-pale: #fff7ed; --or-light: #ffedd5; --or-mid: #fed7aa;
    --s900: #0f172a; --s800: #1e293b; --s700: #334155; --s600: #475569;
    --s400: #94a3b8; --s200: #e2e8f0; --s100: #f1f5f9; --s50: #f8fafc;
    --white: #fff; --red: #dc2626; --green: #16a34a; --blue: #1d4ed8;
    --amber: #d97706; --teal: #0d9488;
  }
  body { font-family: 'Plus Jakarta Sans', sans-serif; background: var(--s50); }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-thumb { background: var(--s200); border-radius: 4px; }

  /* ── LAYOUT ─── */
  .ws-root { display: grid; grid-template-columns: 280px 1fr; gap: 16px; height: calc(100vh - 120px); overflow: hidden; }

  /* ── LEFT PANEL ─── */
  .left-panel { display: flex; flex-direction: column; gap: 12px; overflow-y: auto; }

  /* ── WEEK STRIP ─── */
  .week-header { background: var(--white); border: 1px solid var(--s200); border-radius: 12px; overflow: hidden; }
  .week-title { padding: 12px 14px 8px; display: flex; align-items: center; justify-content: space-between; }
  .week-title-text { font-size: 12px; font-weight: 800; color: var(--s800); }
  .week-sub { font-size: 10px; color: var(--s400); font-weight: 500; }

  .week-days { display: flex; gap: 0; border-top: 1px solid var(--s100); }
  .week-day {
    flex: 1; padding: 8px 4px; text-align: center; cursor: pointer;
    transition: all 0.15s; border-right: 1px solid var(--s100); position: relative;
  }
  .week-day:last-child { border-right: none; }
  .week-day:hover { background: var(--or-pale); }
  .week-day.active { background: var(--or); }
  .week-day.past { opacity: 0.6; }

  .wd-label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--s400); }
  .week-day.active .wd-label { color: rgba(255,255,255,0.7); }
  .wd-num { font-size: 15px; font-weight: 800; color: var(--s800); margin: 2px 0; }
  .week-day.active .wd-num { color: #fff; }
  .week-day.today-ind .wd-num { color: var(--or); }
  .week-day.active.today-ind .wd-num { color: #fff; }

  .wd-dot-row { display: flex; justify-content: center; gap: 2px; margin-top: 2px; min-height: 6px; }
  .wd-dot { width: 5px; height: 5px; border-radius: 50%; }

  /* ── PROGRESS CARD ─── */
  .prog-card { background: var(--white); border: 1px solid var(--s200); border-radius: 12px; padding: 14px; }
  .prog-card-title { font-size: 11px; font-weight: 700; color: var(--s400); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 10px; }

  .prog-row { margin-bottom: 10px; }
  .prog-label { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
  .prog-name { font-size: 12px; font-weight: 600; color: var(--s700); }
  .prog-pct { font-size: 12px; font-weight: 800; }

  .prog-bar { height: 7px; background: var(--s100); border-radius: 4px; overflow: hidden; }
  .prog-fill { height: 100%; border-radius: 4px; transition: width 0.4s ease; }

  /* ── KAMAR SIDEBAR LIST ─── */
  .kamar-list { background: var(--white); border: 1px solid var(--s200); border-radius: 12px; overflow: hidden; flex: 1; }
  .kamar-list-header { padding: 12px 14px; border-bottom: 1px solid var(--s100); display: flex; align-items: center; justify-content: space-between; }
  .kamar-list-title { font-size: 12px; font-weight: 800; color: var(--s800); }

  .kamar-list-item {
    padding: 10px 14px; border-bottom: 1px solid var(--s100);
    cursor: pointer; display: flex; align-items: center; gap: 10px;
    transition: all 0.12s; position: relative;
  }
  .kamar-list-item:last-child { border-bottom: none; }
  .kamar-list-item:hover { background: var(--or-pale); }
  .kamar-list-item.active { background: var(--or-pale); border-left: 3px solid var(--or); }
  .kamar-list-item.skip { opacity: 0.45; cursor: not-allowed; }
  .kamar-list-item.done { background: #f0fdf4; }

  .kli-num { font-size: 14px; font-weight: 800; color: var(--s800); width: 28px; flex-shrink: 0; }
  .kli-name { font-size: 12px; font-weight: 500; color: var(--s600); flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .kli-check { width: 20px; height: 20px; border-radius: 50%; border: 2px solid var(--s200); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .kli-check.done { background: var(--green); border-color: var(--green); color: #fff; font-size: 10px; }
  .kli-check.partial { background: var(--amber); border-color: var(--amber); color: #fff; font-size: 10px; }
  .kli-skip-label { font-size: 9px; font-weight: 700; color: var(--s400); background: var(--s100); padding: 2px 6px; border-radius: 4px; }

  /* ── RIGHT PANEL (MAIN) ─── */
  .right-panel { display: flex; flex-direction: column; gap: 14px; overflow-y: auto; }

  /* ── TASK HEADER ─── */
  .task-header { background: var(--white); border: 1px solid var(--s200); border-radius: 12px; padding: 16px 20px; }
  .task-header-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 12px; }
  .task-room-num { font-size: 28px; font-weight: 800; color: var(--s900); line-height: 1; }
  .task-room-type { font-size: 12px; color: var(--s400); font-weight: 500; margin-top: 2px; }
  .task-room-tenant { font-size: 14px; font-weight: 600; color: var(--s700); margin-top: 4px; }
  .task-meta { display: flex; gap: 8px; flex-wrap: wrap; }

  .task-progress-big { margin-top: 12px; }
  .tpb-nums { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px; }
  .tpb-done { font-size: 22px; font-weight: 800; color: var(--or); }
  .tpb-total { font-size: 13px; color: var(--s400); }
  .tpb-bar { height: 10px; background: var(--s100); border-radius: 6px; overflow: hidden; }
  .tpb-fill { height: 100%; border-radius: 6px; background: linear-gradient(90deg, var(--or), var(--or-d)); transition: width 0.4s ease; }

  /* ── CHECKLIST ─── */
  .checklist-card { background: var(--white); border: 1px solid var(--s200); border-radius: 12px; overflow: hidden; flex: 1; }
  .cl-header { padding: 12px 16px; border-bottom: 1px solid var(--s100); display: flex; align-items: center; justify-content: space-between; }
  .cl-title { font-size: 12px; font-weight: 800; color: var(--s800); }

  .cl-item {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 16px; border-bottom: 1px solid var(--s100);
    cursor: pointer; transition: all 0.12s;
  }
  .cl-item:last-child { border-bottom: none; }
  .cl-item:hover { background: var(--or-pale); }
  .cl-item.done-item { background: #f0fdf4; }
  .cl-item.done-item:hover { background: #e7fef0; }

  .cl-checkbox {
    width: 22px; height: 22px; border-radius: 6px; border: 2px solid var(--s200);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    transition: all 0.15s;
  }
  .cl-item:hover .cl-checkbox { border-color: var(--or-mid); }
  .cl-checkbox.checked { background: var(--green); border-color: var(--green); color: #fff; }

  .cl-text { font-size: 13px; font-weight: 500; color: var(--s700); flex: 1; transition: all 0.15s; }
  .cl-item.done-item .cl-text { color: var(--s400); text-decoration: line-through; }
  .cl-area { font-size: 10px; font-weight: 700; color: var(--s400); background: var(--s100); padding: 2px 7px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px; }

  /* ── AREA UMUM CARD ─── */
  .area-card { background: var(--white); border: 1px solid var(--s200); border-radius: 12px; overflow: hidden; }
  .area-header { padding: 12px 16px; border-bottom: 1px solid var(--s100); display: flex; align-items: center; justify-content: space-between; }
  .area-title { font-size: 12px; font-weight: 800; color: var(--s800); }

  .area-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; padding: 8px; }
  .area-item {
    display: flex; align-items: center; gap: 8px; padding: 8px;
    cursor: pointer; border-radius: 8px; transition: all 0.12s;
  }
  .area-item:hover { background: var(--or-pale); }
  .area-checkbox {
    width: 18px; height: 18px; border-radius: 4px; border: 2px solid var(--s200);
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; flex-shrink: 0; transition: all 0.15s;
  }
  .area-checkbox.checked { background: var(--teal); border-color: var(--teal); color: #fff; }
  .area-item-text { font-size: 12px; font-weight: 500; color: var(--s700); }
  .area-item.done-area .area-item-text { color: var(--s400); text-decoration: line-through; }
  .area-shift { font-size: 9px; font-weight: 700; color: var(--s400); }

  /* ── DONE STATE ─── */
  .done-banner {
    background: linear-gradient(135deg, #f0fdf4, #dcfce7);
    border: 1.5px solid #86efac; border-radius: 12px;
    padding: 20px; text-align: center;
    animation: popIn 0.3s cubic-bezier(0.34,1.56,0.64,1);
  }
  @keyframes popIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .done-icon { font-size: 40px; margin-bottom: 8px; }
  .done-title { font-size: 16px; font-weight: 800; color: var(--green); }
  .done-sub { font-size: 12px; color: #15803d; margin-top: 4px; }

  /* ── SKIP STATE ─── */
  .skip-banner {
    background: var(--s50); border: 1.5px dashed var(--s200); border-radius: 12px;
    padding: 24px; text-align: center;
  }
  .skip-icon { font-size: 36px; margin-bottom: 8px; }
  .skip-title { font-size: 14px; font-weight: 700; color: var(--s600); }
  .skip-sub { font-size: 12px; color: var(--s400); margin-top: 4px; }

  /* ── FUTURE STATE ─── */
  .future-banner {
    background: var(--s50); border: 1.5px dashed var(--s200); border-radius: 12px;
    padding: 24px; text-align: center;
  }

  /* ── NO SELECTION ─── */
  .no-sel { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--s400); }
  .no-sel-icon { font-size: 48px; margin-bottom: 12px; opacity: 0.5; }

  /* ── COMPLETE ALL BTN ─── */
  .complete-all-btn {
    width: 100%; padding: 11px; border-radius: 9px;
    background: linear-gradient(135deg, var(--or), var(--or-d)); color: #fff;
    border: none; font-size: 13px; font-weight: 700; cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif; display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: all 0.15s; box-shadow: 0 2px 10px rgba(249,115,22,0.3);
    margin-top: 2px;
  }
  .complete-all-btn:hover { filter: brightness(1.05); }
  .complete-all-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* ── TIKET BTN ─── */
  .tiket-btn {
    display: flex; align-items: center; gap: 7px;
    background: #fff5f5; border: 1.5px solid #fca5a5; border-radius: 8px;
    padding: 8px 14px; font-size: 12px; font-weight: 700; color: var(--red);
    cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s;
  }
  .tiket-btn:hover { background: var(--red); color: #fff; border-color: var(--red); }

  /* ── BADGE ─── */
  .badge { display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 20px; font-size: 10px; font-weight: 700; white-space: nowrap; }

  /* ── TOASTER ─── */
  .toaster {
    position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
    background: var(--s900); color: #fff; padding: 10px 20px; border-radius: 30px;
    font-size: 13px; font-weight: 600; z-index: 999;
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
    animation: toastIn 0.25s ease;
  }
  @keyframes toastIn { from { opacity: 0; transform: translateX(-50%) translateY(10px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }

  /* ── WEEK SUMMARY ─── */
  .week-summary { background: var(--white); border: 1px solid var(--s200); border-radius: 12px; padding: 14px; }
  .ws-title { font-size: 11px; font-weight: 700; color: var(--s400); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 10px; }
  .ws-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 7px; }
  .ws-label { font-size: 12px; font-weight: 500; color: var(--s600); }
  .ws-val { font-size: 13px; font-weight: 800; }

  /* ── FORM JADWAL ─── */
  .form-modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.6); display: flex; align-items: center; justify-content: center; z-index: 200; backdrop-filter: blur(2px); }
  .form-modal { background: var(--white); border-radius: 16px; width: 520px; max-height: 85vh; overflow-y: auto; box-shadow: 0 24px 60px rgba(0,0,0,0.25); }
  .fm-header { padding: 20px 24px 14px; border-bottom: 1px solid var(--s100); }
  .fm-body { padding: 20px 24px; }
  .fm-footer { padding: 14px 24px; border-top: 1px solid var(--s100); display: flex; gap: 8px; justify-content: flex-end; }

  .field-label { font-size: 11px; font-weight: 700; color: var(--s600); text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 6px; }
  .field-select { width: 100%; background: var(--s50); border: 1.5px solid var(--s200); border-radius: 8px; padding: 8px 12px; font-size: 13px; color: var(--s800); font-family: 'Plus Jakarta Sans', sans-serif; outline: none; }
  .field-select:focus { border-color: var(--or); }

  .btn-primary { background: linear-gradient(135deg, var(--or), var(--or-d)); color: #fff; border: none; border-radius: 8px; padding: 8px 18px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; box-shadow: 0 2px 8px rgba(249,115,22,0.25); }
  .btn-primary:hover { filter: brightness(1.05); }
  .btn-ghost { background: var(--s100); color: var(--s700); border: 1px solid var(--s200); border-radius: 8px; padding: 8px 14px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; }
  .btn-ghost:hover { background: var(--s200); }

  /* ── KAMAR CHECKBOX GRID ─── */
  .kamar-pick-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
  .kamar-pick-cell {
    border: 1.5px solid var(--s200); border-radius: 8px; padding: 8px;
    text-align: center; cursor: pointer; transition: all 0.12s;
    font-size: 12px; font-weight: 600; color: var(--s700);
  }
  .kamar-pick-cell:hover { border-color: var(--or-mid); }
  .kamar-pick-cell.picked { border-color: var(--or); background: var(--or-pale); color: var(--or-d); }
  .kamar-pick-cell.skip-pick { opacity: 0.4; cursor: not-allowed; }
  .kamar-pick-count { font-size: 10px; color: var(--s400); margin-top: 2px; }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  .fade-up { animation: fadeUp 0.25s ease forwards; }

  .tab-bar { display: flex; gap: 0; border-bottom: 1px solid var(--s100); }
  .tab-item { padding: 10px 16px; font-size: 12px; font-weight: 600; color: var(--s400); cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -1px; transition: all 0.12s; }
  .tab-item:hover { color: var(--s700); }
  .tab-item.active { color: var(--or); border-bottom-color: var(--or); }
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
// TOAST
// ============================================================
function Toast({ msg, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1800);
    return () => clearTimeout(t);
  }, []);
  return <div className="toaster">{msg}</div>;
}

// ============================================================
// FORM JADWAL BARU
// ============================================================
function FormJadwal({ onClose, onSave }) {
  const [tanggal, setTanggal] = useState("2026-03-03");
  const [staffId, setStaffId] = useState(3);
  const [picked, setPicked] = useState([]);

  const toggle = (id) => {
    const kamar = KAMAR_LIST.find(k => k.id === id);
    if (SKIP_STATUS.includes(kamar?.status)) return;
    setPicked(p => p.includes(id) ? p.filter(x => x !== id) : p.length >= 3 ? p : [...p, id]);
  };

  const handleSave = () => {
    if (!tanggal || picked.length === 0) return;
    onSave({ tanggal, staffId: Number(staffId), kamar: picked });
    onClose();
  };

  return (
    <div className="form-modal-overlay" onClick={onClose}>
      <div className="form-modal" onClick={e => e.stopPropagation()}>
        <div className="fm-header">
          <div style={{ fontSize: 17, fontWeight: 800, color: "var(--s900)", marginBottom: 2 }}>✦ Buat Jadwal Weekly Service</div>
          <div style={{ fontSize: 12, color: "var(--s400)" }}>Maks 3 kamar per hari</div>
        </div>
        <div className="fm-body">
          <div style={{ marginBottom: 14 }}>
            <label className="field-label">Tanggal</label>
            <input type="date" className="field-select" value={tanggal} onChange={e => setTanggal(e.target.value)} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label className="field-label">Ditugaskan ke Staff</label>
            <select className="field-select" value={staffId} onChange={e => setStaffId(e.target.value)}>
              {STAFF_LIST.map(s => <option key={s.id} value={s.id}>{s.name} — {s.shift}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label">Pilih Kamar ({picked.length}/3)</label>
            <div className="kamar-pick-grid">
              {KAMAR_LIST.map(k => {
                const isSkip = SKIP_STATUS.includes(k.status);
                const isPicked = picked.includes(k.id);
                return (
                  <div key={k.id}
                    className={`kamar-pick-cell ${isPicked ? "picked" : ""} ${isSkip ? "skip-pick" : ""}`}
                    onClick={() => toggle(k.id)}>
                    <div>Kamar {k.id}</div>
                    <div className="kamar-pick-count">{k.tipe}</div>
                    {isSkip && <div style={{ fontSize: 9, color: "#94a3b8" }}>Skip</div>}
                  </div>
                );
              })}
            </div>
            {picked.length === 0 && <div style={{ fontSize: 11, color: "var(--red)", marginTop: 6 }}>Pilih minimal 1 kamar</div>}
          </div>
        </div>
        <div className="fm-footer">
          <button className="btn-ghost" onClick={onClose}>Batal</button>
          <button className="btn-primary" onClick={handleSave} disabled={picked.length === 0}>Simpan Jadwal</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// KOMPONEN UTAMA
// ============================================================
export default function WeeklyService({ userRole = "admin" }) {
  const [jadwals, setJadwals] = useState(JADWAL_MINGGU_INI);
  const [progress, setProgress] = useState(INITIAL_PROGRESS);
  const [areaProgress, setAreaProgress] = useState(AREA_PROGRESS_INITIAL);
  const [selectedJadwalId, setSelectedJadwalId] = useState("j3"); // hari ini
  const [selectedKamarId, setSelectedKamarId] = useState(9);    // kamar 9 belum mulai
  const [activeTab, setActiveTab] = useState("kamar");           // kamar | area
  const [toast, setToast] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const today = "2026-02-26";

  const selectedJadwal = jadwals.find(j => j.id === selectedJadwalId);
  const selectedKamar = selectedKamarId ? KAMAR_LIST.find(k => k.id === selectedKamarId) : null;
  const isSkipKamar = selectedKamar && SKIP_STATUS.includes(selectedKamar.status);

  // Hitung progress per kamar
  const kamarProgress = (jadwalId, kamarId) => {
    const total = CHECKLIST_ITEMS.length;
    const done = CHECKLIST_ITEMS.filter(c => progress[`${jadwalId}_${kamarId}_${c.id}`]).length;
    return { done, total, pct: Math.round((done / total) * 100) };
  };

  // Hitung progress per jadwal (semua kamar)
  const jadwalProgress = (jadwal) => {
    if (!jadwal) return { done: 0, total: 0, pct: 0 };
    let totalDone = 0, totalAll = 0;
    jadwal.kamar.forEach(kid => {
      const k = KAMAR_LIST.find(k => k.id === kid);
      if (k && SKIP_STATUS.includes(k.status)) return;
      const { done, total } = kamarProgress(jadwal.id, kid);
      totalDone += done; totalAll += total;
    });
    return { done: totalDone, total: totalAll, pct: totalAll ? Math.round((totalDone / totalAll) * 100) : 0 };
  };

  // Toggle checklist item
  const toggleItem = (checkId) => {
    if (!selectedJadwal || !selectedKamarId || isSkipKamar) return;
    if (isFuture(selectedJadwal.tanggal)) return;
    const key = `${selectedJadwal.id}_${selectedKamarId}_${checkId}`;
    setProgress(p => ({ ...p, [key]: !p[key] }));
  };

  // Toggle area umum
  const toggleArea = (areaId) => {
    if (!selectedJadwal || isFuture(selectedJadwal.tanggal)) return;
    const key = `${selectedJadwal.id}_${areaId}`;
    setAreaProgress(p => ({ ...p, [key]: !p[key] }));
  };

  // Complete all checklist untuk kamar ini
  const completeAll = () => {
    if (!selectedJadwal || !selectedKamarId || isSkipKamar) return;
    const updates = {};
    CHECKLIST_ITEMS.forEach(c => { updates[`${selectedJadwal.id}_${selectedKamarId}_${c.id}`] = true; });
    setProgress(p => ({ ...p, ...updates }));
    setToast(`✓ Kamar ${selectedKamarId} selesai di-service!`);
  };

  // Hitung stats minggu ini
  const totalKamarDijadwal = jadwals.reduce((acc, j) => acc + j.kamar.filter(kid => {
    const k = KAMAR_LIST.find(k => k.id === kid);
    return !SKIP_STATUS.includes(k?.status);
  }).length, 0);
  const totalKamarSelesai = jadwals.reduce((acc, j) => {
    const done = j.kamar.filter(kid => {
      const k = KAMAR_LIST.find(k => k.id === kid);
      if (SKIP_STATUS.includes(k?.status)) return false;
      return kamarProgress(j.id, kid).pct === 100;
    }).length;
    return acc + done;
  }, 0);

  const selectedKamarChecks = selectedJadwal && selectedKamarId && !isSkipKamar
    ? CHECKLIST_ITEMS.map(c => ({ ...c, checked: !!progress[`${selectedJadwal.id}_${selectedKamarId}_${c.id}`] }))
    : [];
  const doneCount = selectedKamarChecks.filter(c => c.checked).length;
  const allDone = doneCount === CHECKLIST_ITEMS.length && CHECKLIST_ITEMS.length > 0;

  const handleCreateJadwal = (data) => {
    const newId = "j" + (jadwals.length + 10);
    setJadwals(prev => [...prev, { id: newId, ...data }]);
    setToast("Jadwal baru berhasil disimpan!");
  };

  // Area umum untuk jadwal terpilih
  const areaItems = AREA_UMUM.map(a => ({
    ...a,
    checked: !!areaProgress[`${selectedJadwal?.id}_${a.id}`],
  }));
  const areaDone = areaItems.filter(a => a.checked).length;

  return (
    <div className="fade-up">
      <StyleInjector />

      {/* TOP BAR */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--s400)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>
            Weekly Service
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--s700)" }}>
              Minggu ke-4 · Feb 2026
            </span>
            <span className="badge" style={{ color: "var(--green)", background: "#dcfce7" }}>
              {totalKamarSelesai}/{totalKamarDijadwal} kamar selesai
            </span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {userRole === "admin" && (
            <button className="btn-primary" onClick={() => setShowForm(true)}>+ Buat Jadwal</button>
          )}
        </div>
      </div>

      <div className="ws-root">
        {/* ── LEFT PANEL ── */}
        <div className="left-panel">
          {/* Week Strip */}
          <div className="week-header">
            <div className="week-title">
              <div>
                <div className="week-title-text">Jadwal Minggu Ini</div>
                <div className="week-sub">24–28 Feb 2026</div>
              </div>
            </div>
            <div className="week-days">
              {jadwals.map(j => {
                const d = new Date(j.tanggal);
                const prog = jadwalProgress(j);
                const isAktif = j.id === selectedJadwalId;
                const isTod = isToday(j.tanggal);
                const isPst = isPast(j.tanggal) && !isTod;
                return (
                  <div key={j.id}
                    className={`week-day ${isAktif ? "active" : ""} ${isPst && !isAktif ? "past" : ""} ${isTod && !isAktif ? "today-ind" : ""}`}
                    onClick={() => { setSelectedJadwalId(j.id); setSelectedKamarId(null); }}>
                    <div className="wd-label">{HARI[d.getDay()]}</div>
                    <div className="wd-num">{d.getDate()}</div>
                    <div className="wd-dot-row">
                      {j.kamar.map(kid => {
                        const k = KAMAR_LIST.find(k => k.id === kid);
                        const skip = SKIP_STATUS.includes(k?.status);
                        const { pct } = skip ? { pct: 0 } : kamarProgress(j.id, kid);
                        const dotColor = skip ? "#e2e8f0" : pct === 100 ? "#16a34a" : pct > 0 ? "#f97316" : "#fca5a5";
                        return <div key={kid} className="wd-dot" style={{ background: isAktif ? "rgba(255,255,255,0.6)" : dotColor }} />;
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Progress Minggu */}
          <div className="week-summary">
            <div className="ws-title">Progres Minggu Ini</div>
            {jadwals.map(j => {
              const prog = jadwalProgress(j);
              const isTod = isToday(j.tanggal);
              return (
                <div key={j.id} className="prog-row" style={{ cursor: "pointer" }} onClick={() => setSelectedJadwalId(j.id)}>
                  <div className="prog-label">
                    <span className="prog-name" style={{ color: isTod ? "var(--or-d)" : "var(--s700)" }}>
                      {formatTgl(j.tanggal)} {isTod && "🔵"}
                    </span>
                    <span className="prog-pct" style={{ color: prog.pct === 100 ? "var(--green)" : "var(--or)" }}>
                      {prog.pct}%
                    </span>
                  </div>
                  <div className="prog-bar">
                    <div className="prog-fill" style={{
                      width: prog.pct + "%",
                      background: prog.pct === 100 ? "linear-gradient(90deg,#16a34a,#15803d)" : "linear-gradient(90deg, var(--or), var(--or-d))"
                    }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Kamar List untuk jadwal terpilih */}
          {selectedJadwal && (
            <div className="kamar-list">
              <div className="kamar-list-header">
                <div className="kamar-list-title">
                  {formatTgl(selectedJadwal.tanggal)}
                  {isToday(selectedJadwal.tanggal) && <span style={{ fontSize: 10, background: "var(--or)", color: "#fff", padding: "1px 7px", borderRadius: 20, marginLeft: 6, fontWeight: 700 }}>HARI INI</span>}
                </div>
                <div style={{ fontSize: 11, color: "var(--s400)" }}>
                  {STAFF_LIST.find(s => s.id === selectedJadwal.staffId)?.name.split(" ")[0]}
                </div>
              </div>

              {selectedJadwal.kamar.map(kid => {
                const kamar = KAMAR_LIST.find(k => k.id === kid);
                const skip = SKIP_STATUS.includes(kamar?.status);
                const { done, total, pct } = skip ? { done: 0, total: 0, pct: 0 } : kamarProgress(selectedJadwal.id, kid);
                const isDone = !skip && pct === 100;
                const isPartial = !skip && pct > 0 && pct < 100;
                const isActive = selectedKamarId === kid;

                return (
                  <div key={kid}
                    className={`kamar-list-item ${isActive ? "active" : ""} ${skip ? "skip" : ""} ${isDone && !isActive ? "done" : ""}`}
                    onClick={() => !skip && setSelectedKamarId(kid)}>
                    <div className="kli-num">{kid}</div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--s700)" }}>
                        {kamar?.tipe}
                      </div>
                      <div className="kli-name">{kamar?.penghuni || "—"}</div>
                    </div>
                    <div style={{ marginLeft: "auto", flexShrink: 0 }}>
                      {skip ? (
                        <span className="kli-skip-label">Skip</span>
                      ) : (
                        <div className={`kli-check ${isDone ? "done" : isPartial ? "partial" : ""}`}>
                          {isDone ? "✓" : isPartial ? "~" : ""}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="right-panel">
          {!selectedKamarId && !selectedJadwal ? (
            <div className="no-sel">
              <div className="no-sel-icon">✦</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--s600)" }}>Pilih hari di kalender</div>
            </div>
          ) : selectedJadwal && !selectedKamarId ? (
            /* Jadwal terpilih tapi belum pilih kamar */
            <>
              <div className="task-header">
                <div style={{ fontSize: 15, fontWeight: 800, color: "var(--s900)", marginBottom: 4 }}>
                  {formatTgl(selectedJadwal.tanggal)}
                  {isToday(selectedJadwal.tanggal) && <span style={{ marginLeft: 8, fontSize: 11, background: "var(--or)", color: "#fff", padding: "2px 8px", borderRadius: 20 }}>HARI INI</span>}
                </div>
                <div style={{ fontSize: 13, color: "var(--s600)", marginBottom: 12 }}>
                  Staff: {STAFF_LIST.find(s => s.id === selectedJadwal.staffId)?.name}
                </div>
                <div style={{ display: "flex", gap: 14 }}>
                  {selectedJadwal.kamar.map(kid => {
                    const k = KAMAR_LIST.find(k => k.id === kid);
                    const skip = SKIP_STATUS.includes(k?.status);
                    const { pct } = skip ? { pct: 0 } : kamarProgress(selectedJadwal.id, kid);
                    return (
                      <div key={kid}
                        style={{ flex: 1, background: skip ? "var(--s50)" : pct === 100 ? "#f0fdf4" : "var(--or-pale)", border: "1.5px solid", borderColor: skip ? "var(--s200)" : pct === 100 ? "#86efac" : "var(--or-mid)", borderRadius: 10, padding: "12px", textAlign: "center", cursor: skip ? "default" : "pointer", opacity: skip ? 0.5 : 1 }}
                        onClick={() => !skip && setSelectedKamarId(kid)}>
                        <div style={{ fontSize: 20, fontWeight: 800, color: skip ? "var(--s400)" : pct === 100 ? "var(--green)" : "var(--or-d)" }}>K{kid}</div>
                        <div style={{ fontSize: 11, color: "var(--s400)", marginTop: 2 }}>{skip ? "Skip" : pct + "% selesai"}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Area Umum */}
              <div className="area-card">
                <div className="area-header">
                  <div className="area-title">🏢 Area Umum</div>
                  <span className="badge" style={{ color: "var(--teal)", background: "#ccfbf1" }}>
                    {areaDone}/{AREA_UMUM.length} selesai
                  </span>
                </div>
                <div className="area-grid">
                  {areaItems.map(a => (
                    <div key={a.id}
                      className={`area-item ${a.checked ? "done-area" : ""}`}
                      onClick={() => toggleArea(a.id)}>
                      <div className={`area-checkbox ${a.checked ? "checked" : ""}`}>
                        {a.checked ? "✓" : ""}
                      </div>
                      <div>
                        <div className="area-item-text">{a.label}</div>
                        <div className="area-shift">{a.shift}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : selectedJadwal && selectedKamarId && (
            <>
              {/* Task Header */}
              <div className="task-header">
                <div className="task-header-top">
                  <div>
                    <div style={{ display: "flex", align: "center", gap: 10, alignItems: "center" }}>
                      <div className="task-room-num">Kamar {selectedKamarId}</div>
                      <div style={{ display: "flex", gap: 6 }}>
                        {isToday(selectedJadwal.tanggal) && <span className="badge" style={{ color: "var(--or-d)", background: "var(--or-light)" }}>Hari Ini</span>}
                        {isPast(selectedJadwal.tanggal) && <span className="badge" style={{ color: "var(--s400)", background: "var(--s100)" }}>Kemarin</span>}
                        {isFuture(selectedJadwal.tanggal) && <span className="badge" style={{ color: "var(--blue)", background: "#dbeafe" }}>Mendatang</span>}
                      </div>
                    </div>
                    <div className="task-room-type">{selectedKamar?.tipe}</div>
                    <div className="task-room-tenant">{selectedKamar?.penghuni || "Kamar Kosong"}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexDirection: "column", alignItems: "flex-end" }}>
                    <button className="tiket-btn" onClick={() => setToast("⚑ Form buat tiket keluhan dibuka")}>
                      ⚑ Buat Tiket
                    </button>
                  </div>
                </div>

                {isSkipKamar ? (
                  <div style={{ marginTop: 12, background: "var(--s50)", border: "1.5px dashed var(--s200)", borderRadius: 8, padding: "10px 14px", display: "flex", gap: 8 }}>
                    <span style={{ fontSize: 18 }}>⏭</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--s600)" }}>
                        Kamar di-skip minggu ini
                      </div>
                      <div style={{ fontSize: 11, color: "var(--s400)", marginTop: 1 }}>
                        Status: <b>{selectedKamar?.status}</b> — jadwal otomatis digeser minggu depan
                      </div>
                    </div>
                  </div>
                ) : allDone ? (
                  <div style={{ marginTop: 12 }}>
                    <div className="done-banner">
                      <div className="done-icon">✅</div>
                      <div className="done-title">Semua Checklist Selesai!</div>
                      <div className="done-sub">Kamar {selectedKamarId} bersih · {formatTgl(selectedJadwal.tanggal)}</div>
                    </div>
                  </div>
                ) : (
                  <div className="task-progress-big">
                    <div className="tpb-nums">
                      <span className="tpb-done">{doneCount}</span>
                      <span className="tpb-total">/ {CHECKLIST_ITEMS.length} tugas selesai</span>
                    </div>
                    <div className="tpb-bar">
                      <div className="tpb-fill" style={{ width: Math.round((doneCount / CHECKLIST_ITEMS.length) * 100) + "%" }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Tab bar */}
              <div className="checklist-card">
                <div className="cl-header">
                  <div className="tab-bar" style={{ flex: 1, borderBottom: "none" }}>
                    <div className={`tab-item ${activeTab === "kamar" ? "active" : ""}`} onClick={() => setActiveTab("kamar")}>
                      Checklist Kamar
                    </div>
                    <div className={`tab-item ${activeTab === "area" ? "active" : ""}`} onClick={() => setActiveTab("area")}>
                      Area Umum ({areaDone}/{AREA_UMUM.length})
                    </div>
                  </div>
                  {activeTab === "kamar" && !isSkipKamar && !allDone && !isFuture(selectedJadwal.tanggal) && (
                    <button
                      className="complete-all-btn"
                      style={{ width: "auto", padding: "6px 14px", fontSize: 11, marginTop: 0 }}
                      onClick={completeAll}>
                      ✓ Selesaikan Semua
                    </button>
                  )}
                </div>

                {activeTab === "kamar" ? (
                  isFuture(selectedJadwal.tanggal) ? (
                    <div className="future-banner" style={{ margin: 16 }}>
                      <div className="skip-icon">📅</div>
                      <div className="skip-title">Jadwal Mendatang</div>
                      <div className="skip-sub">{formatTgl(selectedJadwal.tanggal)} — Checklist akan tersedia saat hari tiba</div>
                    </div>
                  ) : isSkipKamar ? (
                    <div className="skip-banner" style={{ margin: 16 }}>
                      <div className="skip-icon">⏭</div>
                      <div className="skip-title">Kamar Di-skip</div>
                      <div className="skip-sub">Status {selectedKamar?.status} — tidak perlu service minggu ini</div>
                    </div>
                  ) : (
                    selectedKamarChecks.map(c => (
                      <div key={c.id} className={`cl-item ${c.checked ? "done-item" : ""}`} onClick={() => toggleItem(c.id)}>
                        <div className={`cl-checkbox ${c.checked ? "checked" : ""}`}>
                          {c.checked ? "✓" : ""}
                        </div>
                        <div className="cl-text">{c.label}</div>
                        <div className="cl-area">{c.area}</div>
                      </div>
                    ))
                  )
                ) : (
                  <div className="area-grid" style={{ padding: "8px 12px" }}>
                    {areaItems.map(a => (
                      <div key={a.id}
                        className={`area-item ${a.checked ? "done-area" : ""}`}
                        onClick={() => toggleArea(a.id)}>
                        <div className={`area-checkbox ${a.checked ? "checked" : ""}`}>
                          {a.checked ? "✓" : ""}
                        </div>
                        <div>
                          <div className="area-item-text">{a.label}</div>
                          <div className="area-shift">{a.shift}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action row */}
              {activeTab === "kamar" && !isFuture(selectedJadwal.tanggal) && !isSkipKamar && !allDone && (
                <button className="complete-all-btn" onClick={completeAll}>
                  ✓ Tandai Semua Selesai — Kamar {selectedKamarId}
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* FORM JADWAL */}
      {showForm && <FormJadwal onClose={() => setShowForm(false)} onSave={handleCreateJadwal} />}

      {/* TOAST */}
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </div>
  );
}