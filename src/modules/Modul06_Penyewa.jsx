import { useState, useEffect } from "react";

// ============================================================
// MOCK DATA
// ============================================================
const PENYEWA_DATA = [
  {
    id: "P001",
    nama: "Budi Santoso",
    kamar: 1,
    tipeKamar: "Premium",
    foto: null,
    noHP: "081234567801",
    noDarurat: "081234567802",
    namaDarurat: "Sari (Istri)",
    ktpNo: "3274010101900001",
    tglMasuk: "2026-01-01",
    kontrakDurasi: 6,
    kontrakSelesai: "2026-07-01",
    harga: 2500000,
    status: "aktif",
    partner: [
      { nama: "Sari Dewi", hubungan: "Istri" },
    ],
    catatan: "Penyewa lama, sudah 2x perpanjang. Selalu bayar tepat waktu.",
    riwayatBayar: [
      { bulan: "Feb 2026", tgl: "2026-02-01", jumlah: 2500000, metode: "Transfer BCA", status: "lunas" },
      { bulan: "Jan 2026", tgl: "2026-01-03", jumlah: 2500000, metode: "Transfer BCA", status: "lunas" },
    ],
  },
  {
    id: "P002",
    nama: "Dian Pratiwi",
    kamar: 3,
    tipeKamar: "Reguler",
    foto: null,
    noHP: "081234567803",
    noDarurat: "081234567804",
    namaDarurat: "Hendra (Kakak)",
    ktpNo: "3274020202950002",
    tglMasuk: "2026-03-01",
    kontrakDurasi: 3,
    kontrakSelesai: null,
    harga: 1800000,
    status: "booked",
    partner: [],
    catatan: "Booking via WA. Belum check-in. Kontrak dimulai 1 Maret.",
    riwayatBayar: [],
  },
  {
    id: "P003",
    nama: "Ahmad Fauzi",
    kamar: 4,
    tipeKamar: "Premium",
    foto: null,
    noHP: "081234567805",
    noDarurat: "081234567806",
    namaDarurat: "Fatimah (Ibu)",
    ktpNo: "3274030303880003",
    tglMasuk: "2025-12-01",
    kontrakDurasi: 6,
    kontrakSelesai: "2026-06-01",
    harga: 2500000,
    status: "aktif",
    partner: [
      { nama: "Budi Prasetyo", hubungan: "Teman" },
      { nama: "Tono Wibowo", hubungan: "Teman" },
    ],
    catatan: "3 orang dalam 1 kamar. Sudah konfirmasi tidak ada tambahan penghuni.",
    riwayatBayar: [
      { bulan: "Feb 2026", tgl: "2026-02-05", jumlah: 2500000, metode: "Transfer Mandiri", status: "lunas" },
      { bulan: "Jan 2026", tgl: "2026-01-07", jumlah: 2500000, metode: "Transfer Mandiri", status: "lunas" },
    ],
  },
  {
    id: "P004",
    nama: "Siti Rahayu",
    kamar: 6,
    tipeKamar: "Reguler",
    foto: null,
    noHP: "081234567807",
    noDarurat: "081234567808",
    namaDarurat: "Rina (Adik)",
    ktpNo: "3274040404920004",
    tglMasuk: "2026-02-01",
    kontrakDurasi: 6,
    kontrakSelesai: "2026-08-01",
    harga: 1800000,
    status: "aktif",
    partner: [],
    catatan: "",
    riwayatBayar: [
      { bulan: "Feb 2026", tgl: "2026-02-01", jumlah: 1800000, metode: "Transfer BNI", status: "lunas" },
    ],
  },
  {
    id: "P005",
    nama: "Rudi Hartono",
    kamar: 7,
    tipeKamar: "Premium",
    foto: null,
    noHP: "081234567809",
    noDarurat: "081234567810",
    namaDarurat: "Lia (Istri)",
    ktpNo: "3274050505870005",
    tglMasuk: "2026-01-15",
    kontrakDurasi: 12,
    kontrakSelesai: "2027-01-15",
    harga: 2650000,
    status: "aktif",
    partner: [
      { nama: "Lia Susanti", hubungan: "Istri" },
    ],
    catatan: "Kamar dengan kulkas. Kontrak 1 tahun.",
    riwayatBayar: [
      { bulan: "Feb 2026", tgl: "2026-02-15", jumlah: 2650000, metode: "Transfer BCA", status: "lunas" },
      { bulan: "Jan 2026", tgl: "2026-01-15", jumlah: 2650000, metode: "Transfer BCA", status: "lunas" },
    ],
  },
  {
    id: "P006",
    nama: "Dewi Lestari",
    kamar: 9,
    tipeKamar: "Reguler",
    foto: null,
    noHP: "081234567811",
    noDarurat: "081234567812",
    namaDarurat: "Agus (Ayah)",
    ktpNo: "3274060606980006",
    tglMasuk: "2026-01-01",
    kontrakDurasi: 3,
    kontrakSelesai: "2026-04-01",
    harga: 1800000,
    status: "aktif",
    partner: [],
    catatan: "Kontrak habis 1 April. Sudah dikirim reminder H-30.",
    riwayatBayar: [
      { bulan: "Feb 2026", tgl: null, jumlah: 1800000, metode: null, status: "belum" },
      { bulan: "Jan 2026", tgl: "2026-01-05", jumlah: 1800000, metode: "Transfer BCA", status: "lunas" },
    ],
  },
  {
    id: "P007",
    nama: "Prisca Aprilia",
    kamar: 10,
    tipeKamar: "Premium",
    foto: null,
    noHP: "081234567813",
    noDarurat: "081234567814",
    namaDarurat: "Michael (Ayah)",
    ktpNo: "3274070707010007",
    tglMasuk: "2026-01-12",
    kontrakDurasi: 6,
    kontrakSelesai: "2026-07-12",
    harga: 2500000,
    status: "aktif",
    partner: [],
    catatan: "",
    riwayatBayar: [
      { bulan: "Feb 2026", tgl: "2026-02-12", jumlah: 2500000, metode: "Transfer BCA", status: "lunas" },
      { bulan: "Jan 2026", tgl: "2026-01-12", jumlah: 2500000, metode: "Transfer BCA", status: "lunas" },
    ],
  },
  {
    id: "P008",
    nama: "Amalia Wulan",
    kamar: 12,
    tipeKamar: "Premium",
    foto: null,
    noHP: "081234567815",
    noDarurat: "081234567816",
    namaDarurat: "Tari (Kakak)",
    ktpNo: "3274080808990008",
    tglMasuk: "2026-01-01",
    kontrakDurasi: 6,
    kontrakSelesai: "2026-06-30",
    harga: 2500000,
    status: "aktif",
    partner: [
      { nama: "Tari Kusuma", hubungan: "Saudara" },
    ],
    catatan: "Kontrak habis 30 Juni. Belum ada konfirmasi perpanjangan.",
    riwayatBayar: [
      { bulan: "Feb 2026", tgl: "2026-02-02", jumlah: 2500000, metode: "Transfer BCA", status: "lunas" },
      { bulan: "Jan 2026", tgl: "2026-01-02", jumlah: 2500000, metode: "Transfer BCA", status: "lunas" },
    ],
  },
];

const KONTRAK_DURASI = [3, 6, 12];
const HUBUNGAN_LIST = ["Istri", "Suami", "Teman", "Saudara", "Rekan Kerja", "Lainnya"];
const KAMAR_KOSONG = [2, 8, 11]; // kamar tersedia untuk assign

// ============================================================
// HELPERS
// ============================================================
const fmtRp = (n) => n ? "Rp " + n.toLocaleString("id-ID") : "-";
const BULAN_LABEL = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Ags","Sep","Okt","Nov","Des"];
const fmtTgl = (str) => {
  if (!str) return "-";
  const d = new Date(str);
  return `${d.getDate()} ${BULAN_LABEL[d.getMonth()]} ${d.getFullYear()}`;
};

const hariSisa = (tgl) => {
  if (!tgl) return null;
  const diff = new Date(tgl) - new Date("2026-02-26");
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const STATUS_CFG = {
  aktif:  { label: "Aktif",  color: "#16a34a", bg: "#dcfce7" },
  booked: { label: "Booked", color: "#b45309", bg: "#fef3c7" },
  keluar: { label: "Keluar", color: "#6b7280", bg: "#f3f4f6" },
};

const BAYAR_CFG = {
  lunas: { label: "Lunas",  color: "#16a34a", bg: "#dcfce7" },
  belum: { label: "Belum",  color: "#dc2626", bg: "#fee2e2" },
  telat: { label: "Telat",  color: "#d97706", bg: "#fef3c7" },
};

// ============================================================
// CSS
// ============================================================
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap');
  * { box-sizing:border-box; margin:0; padding:0; }
  :root {
    --or:#f97316; --or-d:#ea580c; --or-dd:#c2410c;
    --or-pale:#fff7ed; --or-light:#ffedd5; --or-mid:#fed7aa;
    --s900:#0f172a; --s800:#1e293b; --s700:#334155; --s600:#475569;
    --s400:#94a3b8; --s200:#e2e8f0; --s100:#f1f5f9; --s50:#f8fafc;
    --white:#fff; --red:#dc2626; --green:#16a34a; --blue:#1d4ed8;
    --amber:#d97706; --teal:#0d9488; --purple:#7c3aed;
  }
  body { font-family:'Plus Jakarta Sans',sans-serif; background:var(--s50); }
  ::-webkit-scrollbar{width:4px;height:4px} ::-webkit-scrollbar-thumb{background:var(--s200);border-radius:4px}

  /* ── TOPBAR ── */
  .topbar { display:flex; align-items:center; justify-content:space-between; margin-bottom:18px; flex-wrap:wrap; gap:10px; }

  /* ── SEARCH + FILTER ── */
  .search-bar { display:flex; align-items:center; gap:8px; background:var(--white); border:1.5px solid var(--s200); border-radius:9px; padding:8px 14px; transition:all 0.15s; }
  .search-bar:focus-within { border-color:var(--or); box-shadow:0 0 0 3px rgba(249,115,22,0.1); }
  .search-bar input { border:none; outline:none; font-size:13px; color:var(--s800); background:transparent; font-family:'Plus Jakarta Sans',sans-serif; width:210px; }
  .search-bar input::placeholder { color:var(--s400); }

  .filter-chip { padding:6px 14px; border-radius:20px; font-size:12px; font-weight:600; border:1.5px solid var(--s200); background:var(--white); color:var(--s600); cursor:pointer; transition:all 0.15s; }
  .filter-chip:hover { border-color:var(--or-mid); }
  .filter-chip.active { border-color:var(--or); background:var(--or); color:#fff; }

  /* ── STATS ROW ── */
  .stats-row { display:flex; gap:12px; margin-bottom:18px; flex-wrap:wrap; }
  .stat-pill { background:var(--white); border:1px solid var(--s200); border-radius:10px; padding:10px 16px; display:flex; align-items:center; gap:10px; flex-shrink:0; }
  .stat-pill-num { font-size:20px; font-weight:800; }
  .stat-pill-label { font-size:11px; font-weight:600; color:var(--s400); text-transform:uppercase; letter-spacing:0.5px; }

  /* ── GRID ── */
  .penyewa-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }

  /* ── PENYEWA CARD ── */
  .penyewa-card {
    background:var(--white); border:1.5px solid var(--s200); border-radius:14px;
    overflow:hidden; cursor:pointer; transition:all 0.15s;
    display:flex; flex-direction:column;
  }
  .penyewa-card:hover { border-color:var(--or-mid); box-shadow:0 4px 20px rgba(249,115,22,0.08); transform:translateY(-1px); }
  .penyewa-card.kontrak-warning { border-color:#fcd34d; }
  .penyewa-card.belum-bayar { border-left:3px solid var(--red); }

  .card-top { padding:14px 16px 10px; display:flex; align-items:flex-start; gap:12px; }
  .card-avatar {
    width:46px; height:46px; border-radius:12px; flex-shrink:0;
    display:flex; align-items:center; justify-content:center;
    font-size:17px; font-weight:800; color:#fff;
  }
  .card-name { font-size:14px; font-weight:800; color:var(--s900); line-height:1.2; }
  .card-room { font-size:12px; color:var(--s400); margin-top:2px; }
  .card-badges { display:flex; gap:5px; flex-wrap:wrap; margin-top:5px; }

  .card-body { padding:0 16px 12px; flex:1; }
  .card-info-row { display:flex; align-items:center; gap:7px; padding:5px 0; border-bottom:1px solid var(--s100); }
  .card-info-row:last-child { border-bottom:none; }
  .card-info-icon { font-size:12px; width:16px; flex-shrink:0; color:var(--s400); }
  .card-info-text { font-size:12px; color:var(--s700); font-weight:500; }
  .card-info-val { font-size:12px; color:var(--s800); font-weight:600; margin-left:auto; }

  .card-footer { padding:10px 16px; border-top:1px solid var(--s100); background:var(--s50); display:flex; align-items:center; justify-content:space-between; }
  .card-kontrak-sisa { font-size:11px; font-weight:600; }

  /* ── DETAIL PANEL ── */
  .dp-overlay { position:fixed; inset:0; background:rgba(15,23,42,0.55); display:flex; align-items:flex-start; justify-content:flex-end; z-index:100; backdrop-filter:blur(3px); animation:fadeIn 0.2s ease; }
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  .dp-panel { background:var(--white); width:500px; height:100vh; overflow-y:auto; box-shadow:-10px 0 50px rgba(0,0,0,0.15); animation:slideIn 0.25s cubic-bezier(0.25,0.46,0.45,0.94); display:flex; flex-direction:column; }
  @keyframes slideIn{from{transform:translateX(40px);opacity:0}to{transform:translateX(0);opacity:1}}
  .dp-head { padding:20px 24px 16px; border-bottom:1px solid var(--s100); flex-shrink:0; }
  .dp-body { padding:20px 24px; flex:1; }
  .dp-foot { padding:14px 24px; border-top:1px solid var(--s100); display:flex; gap:8px; flex-shrink:0; }

  /* ── IDENTITY CARD ── */
  .id-card {
    background:linear-gradient(135deg,var(--s900),#1a0a00);
    border-radius:14px; padding:20px; margin-bottom:18px; color:#fff;
    position:relative; overflow:hidden;
  }
  .id-card::before { content:''; position:absolute; top:-40px; right:-40px; width:160px; height:160px; border-radius:50%; background:radial-gradient(circle,rgba(249,115,22,0.2),transparent); }
  .id-card::after  { content:'SENYUM INN'; position:absolute; bottom:12px; right:16px; font-size:9px; font-weight:800; letter-spacing:2px; color:rgba(255,255,255,0.1); }
  .idc-ktp { font-family:'JetBrains Mono',monospace; font-size:11px; color:rgba(255,255,255,0.4); margin-bottom:6px; }
  .idc-name { font-size:20px; font-weight:800; color:#fff; margin-bottom:4px; }
  .idc-room { font-size:13px; color:var(--or); font-weight:600; }
  .idc-row { display:flex; gap:24px; margin-top:14px; }
  .idc-field-label { font-size:9px; font-weight:700; color:rgba(255,255,255,0.35); text-transform:uppercase; letter-spacing:0.5px; }
  .idc-field-val { font-size:12px; font-weight:700; color:#fff; margin-top:2px; }

  /* ── SECTION DIVIDER ── */
  .sec-div { font-size:10px; font-weight:700; color:var(--s400); text-transform:uppercase; letter-spacing:1px; padding-bottom:8px; border-bottom:1px solid var(--s100); margin-bottom:12px; margin-top:18px; }

  /* ── INFO GRID ── */
  .info-grid { display:grid; grid-template-columns:1fr 1fr; gap:9px; }
  .info-cell { background:var(--s50); border-radius:9px; padding:10px 12px; }
  .info-cell-label { font-size:10px; font-weight:700; color:var(--s400); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:3px; }
  .info-cell-val { font-size:13px; font-weight:600; color:var(--s800); }

  /* ── PARTNER LIST ── */
  .partner-item { display:flex; align-items:center; gap:10px; padding:9px 12px; background:var(--s50); border-radius:9px; margin-bottom:6px; }
  .partner-av { width:30px; height:30px; border-radius:8px; background:linear-gradient(135deg,var(--or),var(--or-d)); display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:800; color:#fff; flex-shrink:0; }
  .partner-name { font-size:13px; font-weight:600; color:var(--s800); }
  .partner-hub { font-size:11px; color:var(--s400); }

  /* ── PEMBAYARAN TABLE ── */
  .pay-row { display:flex; align-items:center; gap:10px; padding:9px 0; border-bottom:1px solid var(--s100); }
  .pay-row:last-child { border-bottom:none; }
  .pay-bulan { font-size:12px; font-weight:700; color:var(--s800); min-width:70px; }
  .pay-tgl { font-size:11px; color:var(--s400); }
  .pay-amount { font-size:13px; font-weight:700; color:var(--s700); margin-left:auto; }
  .pay-status { margin-left:8px; flex-shrink:0; }

  /* ── KONTRAK SISA ALERT ── */
  .kontrak-alert { border-radius:10px; padding:11px 14px; margin-top:6px; display:flex; align-items:center; gap:10px; }

  /* ── BADGE ── */
  .badge { display:inline-flex; align-items:center; padding:2px 8px; border-radius:20px; font-size:10px; font-weight:700; white-space:nowrap; }
  .badge-lg { padding:4px 10px; font-size:11px; border-radius:8px; }

  /* ── BUTTONS ── */
  .btn-primary { background:linear-gradient(135deg,var(--or),var(--or-d)); color:#fff; border:none; border-radius:8px; padding:9px 18px; font-size:13px; font-weight:700; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all 0.15s; box-shadow:0 2px 8px rgba(249,115,22,0.25); display:inline-flex; align-items:center; gap:6px; }
  .btn-primary:hover { filter:brightness(1.05); }
  .btn-ghost { background:var(--s100); color:var(--s700); border:1px solid var(--s200); border-radius:8px; padding:9px 14px; font-size:12px; font-weight:600; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all 0.15s; display:inline-flex; align-items:center; gap:6px; }
  .btn-ghost:hover { background:var(--s200); }
  .btn-danger { background:#fee2e2; color:var(--red); border:1px solid #fca5a5; border-radius:8px; padding:9px 14px; font-size:12px; font-weight:700; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all 0.15s; }
  .btn-danger:hover { background:var(--red); color:#fff; }
  .btn-warn { background:#fef3c7; color:var(--amber); border:1px solid #fcd34d; border-radius:8px; padding:9px 14px; font-size:12px; font-weight:700; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all 0.15s; display:inline-flex; align-items:center; gap:6px; }
  .btn-warn:hover { background:var(--amber); color:#fff; }

  /* ── FORM MODAL ── */
  .form-overlay { position:fixed; inset:0; background:rgba(15,23,42,0.6); display:flex; align-items:center; justify-content:center; z-index:200; backdrop-filter:blur(2px); }
  .form-modal { background:var(--white); border-radius:16px; width:540px; max-height:88vh; overflow-y:auto; box-shadow:0 24px 60px rgba(0,0,0,0.25); animation:popIn 0.2s cubic-bezier(0.34,1.56,0.64,1); }
  @keyframes popIn{from{transform:scale(0.95) translateY(8px);opacity:0}to{transform:scale(1) translateY(0);opacity:1}}
  .fm-head { padding:20px 24px 14px; border-bottom:1px solid var(--s100); }
  .fm-body { padding:20px 24px; }
  .fm-foot { padding:14px 24px; border-top:1px solid var(--s100); display:flex; gap:8px; justify-content:flex-end; }

  .field { margin-bottom:14px; }
  .field-label { font-size:11px; font-weight:700; color:var(--s600); text-transform:uppercase; letter-spacing:0.5px; display:block; margin-bottom:6px; }
  .req { color:var(--red); margin-left:2px; }
  .field-input,.field-select,.field-textarea { width:100%; background:var(--s50); border:1.5px solid var(--s200); border-radius:8px; padding:9px 12px; font-size:13px; color:var(--s800); font-family:'Plus Jakarta Sans',sans-serif; outline:none; transition:all 0.15s; }
  .field-input:focus,.field-select:focus,.field-textarea:focus { border-color:var(--or); box-shadow:0 0 0 3px rgba(249,115,22,0.08); }
  .field-textarea { resize:vertical; min-height:70px; }
  .field-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .field-row-3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; }

  /* ── PARTNER EDITOR ── */
  .partner-editor { background:var(--s50); border-radius:9px; padding:12px; margin-bottom:14px; }
  .pe-title { font-size:11px; font-weight:700; color:var(--s600); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px; }
  .pe-row { display:flex; gap:8px; align-items:center; margin-bottom:6px; }
  .pe-input { flex:1; background:var(--white); border:1.5px solid var(--s200); border-radius:7px; padding:7px 10px; font-size:12px; color:var(--s800); font-family:'Plus Jakarta Sans',sans-serif; outline:none; }
  .pe-input:focus { border-color:var(--or); }
  .pe-select { background:var(--white); border:1.5px solid var(--s200); border-radius:7px; padding:7px 10px; font-size:12px; color:var(--s700); font-family:'Plus Jakarta Sans',sans-serif; outline:none; }
  .pe-del { background:#fee2e2; border:none; border-radius:6px; width:28px; height:28px; cursor:pointer; font-size:14px; color:var(--red); display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:all 0.12s; }
  .pe-del:hover { background:var(--red); color:#fff; }
  .pe-add { font-size:12px; font-weight:600; color:var(--or-d); cursor:pointer; padding:4px 0; display:inline-flex; align-items:center; gap:5px; }
  .pe-add:hover { color:var(--or-dd); }

  /* ── EMPTY ── */
  .empty-state { padding:60px 20px; text-align:center; color:var(--s400); }
  .empty-icon { font-size:48px; margin-bottom:12px; }

  /* ── TOAST ── */
  .toaster { position:fixed; bottom:24px; left:50%; transform:translateX(-50%); background:var(--s900); color:#fff; padding:10px 20px; border-radius:30px; font-size:13px; font-weight:600; z-index:999; box-shadow:0 8px 24px rgba(0,0,0,0.3); animation:toastIn 0.25s ease; white-space:nowrap; }
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

// ============================================================
// HELPERS UI
// ============================================================
function Badge({ color, bg, children, lg }) {
  return <span className={lg ? "badge badge-lg" : "badge"} style={{ color, background: bg }}>{children}</span>;
}

function Toast({ msg, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2200); return () => clearTimeout(t); }, []);
  return <div className="toaster">{msg}</div>;
}

const AVATAR_COLORS = [
  "linear-gradient(135deg,#f97316,#ea580c)",
  "linear-gradient(135deg,#1d4ed8,#1e40af)",
  "linear-gradient(135deg,#7c3aed,#6d28d9)",
  "linear-gradient(135deg,#0d9488,#0f766e)",
  "linear-gradient(135deg,#dc2626,#b91c1c)",
  "linear-gradient(135deg,#be185d,#9d174d)",
  "linear-gradient(135deg,#d97706,#b45309)",
  "linear-gradient(135deg,#16a34a,#15803d)",
];
const getAvatarColor = (id) => AVATAR_COLORS[(parseInt(id.replace("P","")) - 1) % AVATAR_COLORS.length];
const getInitials = (nama) => nama.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();

// ============================================================
// FORM PENYEWA (tambah / edit)
// ============================================================
function FormPenyewa({ editData, onClose, onSave }) {
  const isEdit = !!editData;
  const [form, setForm] = useState(editData ? { ...editData } : {
    nama: "", kamar: "", ktpNo: "", noHP: "", noDarurat: "", namaDarurat: "",
    tglMasuk: "2026-03-01", kontrakDurasi: 6, harga: 1800000, catatan: "",
    partner: [],
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const addPartner = () => {
    if (form.partner.length >= 2) return;
    setForm(f => ({ ...f, partner: [...f.partner, { nama: "", hubungan: "Teman" }] }));
  };

  const setPartner = (i, k, v) => {
    const arr = [...form.partner];
    arr[i] = { ...arr[i], [k]: v };
    setForm(f => ({ ...f, partner: arr }));
  };

  const delPartner = (i) => setForm(f => ({ ...f, partner: f.partner.filter((_, idx) => idx !== i) }));

  const handleSave = () => {
    if (!form.nama || !form.kamar || !form.noHP) return;
    onSave(form);
  };

  return (
    <div className="form-overlay" onClick={onClose}>
      <div className="form-modal" onClick={e => e.stopPropagation()}>
        <div className="fm-head">
          <div style={{ fontSize: 17, fontWeight: 800, color: "var(--s900)", marginBottom: 2 }}>
            {isEdit ? "Edit Data Penyewa" : "👥 Tambah Penyewa Baru"}
          </div>
          <div style={{ fontSize: 12, color: "var(--s400)" }}>
            {isEdit ? `Edit data ${editData.nama}` : "Input data lengkap penyewa"}
          </div>
        </div>
        <div className="fm-body">
          {/* Data Utama */}
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--s400)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 12, paddingBottom: 6, borderBottom: "1px solid var(--s100)" }}>Data Penyewa Utama</div>

          <div className="field">
            <label className="field-label">Nama Lengkap <span className="req">*</span></label>
            <input className="field-input" placeholder="Nama sesuai KTP" value={form.nama} onChange={e => set("nama", e.target.value)} />
          </div>

          <div className="field-row" style={{ marginBottom: 14 }}>
            <div className="field">
              <label className="field-label">No KTP</label>
              <input className="field-input" placeholder="16 digit NIK" value={form.ktpNo || ""} onChange={e => set("ktpNo", e.target.value)} />
            </div>
            <div className="field">
              <label className="field-label">No HP <span className="req">*</span></label>
              <input className="field-input" placeholder="08xxxxxxxxxx" value={form.noHP} onChange={e => set("noHP", e.target.value)} />
            </div>
          </div>

          <div className="field-row" style={{ marginBottom: 14 }}>
            <div className="field">
              <label className="field-label">Kontak Darurat</label>
              <input className="field-input" placeholder="08xxxxxxxxxx" value={form.noDarurat || ""} onChange={e => set("noDarurat", e.target.value)} />
            </div>
            <div className="field">
              <label className="field-label">Nama Darurat</label>
              <input className="field-input" placeholder="Nama (Hubungan)" value={form.namaDarurat || ""} onChange={e => set("namaDarurat", e.target.value)} />
            </div>
          </div>

          {/* Kontrak */}
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--s400)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 12, paddingBottom: 6, borderBottom: "1px solid var(--s100)", marginTop: 6 }}>Kontrak & Kamar</div>

          <div className="field-row-3" style={{ marginBottom: 14 }}>
            <div className="field">
              <label className="field-label">Kamar <span className="req">*</span></label>
              <select className="field-select" value={form.kamar || ""} onChange={e => set("kamar", Number(e.target.value))}>
                <option value="">Pilih</option>
                {!isEdit && KAMAR_KOSONG.map(k => <option key={k} value={k}>Kamar {k}</option>)}
                {isEdit && <option value={form.kamar}>Kamar {form.kamar}</option>}
              </select>
            </div>
            <div className="field">
              <label className="field-label">Durasi</label>
              <select className="field-select" value={form.kontrakDurasi} onChange={e => set("kontrakDurasi", Number(e.target.value))}>
                {KONTRAK_DURASI.map(d => <option key={d} value={d}>{d} Bulan</option>)}
              </select>
            </div>
            <div className="field">
              <label className="field-label">Tgl Masuk</label>
              <input className="field-input" type="date" value={form.tglMasuk} onChange={e => set("tglMasuk", e.target.value)} />
            </div>
          </div>

          <div className="field">
            <label className="field-label">Harga Sewa / Bulan (Rp)</label>
            <input className="field-input" type="number" value={form.harga} onChange={e => set("harga", Number(e.target.value))} />
          </div>

          {/* Partner */}
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--s400)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 12, paddingBottom: 6, borderBottom: "1px solid var(--s100)", marginTop: 6 }}>Partner (maks 2)</div>

          <div className="partner-editor">
            <div className="pe-title">Penghuni Tambahan ({form.partner.length}/2)</div>
            {form.partner.map((p, i) => (
              <div key={i} className="pe-row">
                <input className="pe-input" placeholder="Nama partner" value={p.nama} onChange={e => setPartner(i, "nama", e.target.value)} />
                <select className="pe-select" value={p.hubungan} onChange={e => setPartner(i, "hubungan", e.target.value)}>
                  {HUBUNGAN_LIST.map(h => <option key={h}>{h}</option>)}
                </select>
                <button className="pe-del" onClick={() => delPartner(i)}>✕</button>
              </div>
            ))}
            {form.partner.length < 2 && (
              <div className="pe-add" onClick={addPartner}>+ Tambah Partner</div>
            )}
          </div>

          {/* Catatan */}
          <div className="field">
            <label className="field-label">Catatan</label>
            <textarea className="field-textarea" placeholder="Catatan khusus tentang penyewa ini..." value={form.catatan || ""} onChange={e => set("catatan", e.target.value)} rows={3} />
          </div>
        </div>
        <div className="fm-foot">
          <button className="btn-ghost" onClick={onClose}>Batal</button>
          <button className="btn-primary" onClick={handleSave}>
            {isEdit ? "Simpan Perubahan" : "✓ Simpan Penyewa"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// DETAIL PANEL
// ============================================================
function DetailPanel({ penyewa, onClose, onEdit, onCheckout }) {
  const sisa = hariSisa(penyewa.kontrakSelesai);
  const sCfg = STATUS_CFG[penyewa.status] || STATUS_CFG.aktif;
  const lastBayar = penyewa.riwayatBayar[0];
  const adaBelum = penyewa.riwayatBayar.some(b => b.status === "belum");

  return (
    <div className="dp-overlay" onClick={onClose}>
      <div className="dp-panel" onClick={e => e.stopPropagation()}>
        {/* Head */}
        <div className="dp-head">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono',monospace", color: "var(--s400)", marginBottom: 4 }}>{penyewa.id}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "var(--s900)", lineHeight: 1.2, marginBottom: 5 }}>{penyewa.nama}</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <Badge color={sCfg.color} bg={sCfg.bg} lg>{sCfg.label}</Badge>
                <Badge color="var(--s700)" bg="var(--s100)" lg>
                  Kamar {penyewa.kamar} · {penyewa.tipeKamar}
                </Badge>
                {adaBelum && <Badge color="var(--red)" bg="#fee2e2" lg>⚠ Belum Bayar</Badge>}
              </div>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "var(--s400)", padding: 4, flexShrink: 0 }}>✕</button>
          </div>
        </div>

        <div className="dp-body">
          {/* ID Card visual */}
          <div className="id-card">
            <div className="idc-ktp">KTP: {penyewa.ktpNo || "—"}</div>
            <div className="idc-name">{penyewa.nama}</div>
            <div className="idc-room">Kamar {penyewa.kamar} — {penyewa.tipeKamar}</div>
            <div className="idc-row">
              <div>
                <div className="idc-field-label">No HP</div>
                <div className="idc-field-val">{penyewa.noHP}</div>
              </div>
              <div>
                <div className="idc-field-label">Darurat</div>
                <div className="idc-field-val">{penyewa.namaDarurat || "—"}</div>
              </div>
              <div>
                <div className="idc-field-label">Tgl Masuk</div>
                <div className="idc-field-val">{fmtTgl(penyewa.tglMasuk)}</div>
              </div>
            </div>
          </div>

          {/* Kontrak Info */}
          <div className="sec-div">Detail Kontrak</div>
          <div className="info-grid" style={{ marginBottom: 10 }}>
            <div className="info-cell">
              <div className="info-cell-label">Durasi</div>
              <div className="info-cell-val">{penyewa.kontrakDurasi} Bulan</div>
            </div>
            <div className="info-cell">
              <div className="info-cell-label">Harga / Bulan</div>
              <div className="info-cell-val" style={{ color: "var(--or-d)" }}>{fmtRp(penyewa.harga)}</div>
            </div>
            <div className="info-cell">
              <div className="info-cell-label">Mulai</div>
              <div className="info-cell-val">{fmtTgl(penyewa.tglMasuk)}</div>
            </div>
            <div className="info-cell">
              <div className="info-cell-label">Selesai</div>
              <div className="info-cell-val">{fmtTgl(penyewa.kontrakSelesai)}</div>
            </div>
          </div>

          {/* Sisa kontrak alert */}
          {sisa !== null && sisa <= 60 && (
            <div className="kontrak-alert" style={{
              background: sisa <= 14 ? "#fff5f5" : sisa <= 30 ? "#fef3c7" : "#f0fdf4",
              border: `1.5px solid ${sisa <= 14 ? "#fca5a5" : sisa <= 30 ? "#fcd34d" : "#86efac"}`,
            }}>
              <span style={{ fontSize: 20 }}>{sisa <= 14 ? "🔴" : sisa <= 30 ? "⚠️" : "📋"}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: sisa <= 14 ? "var(--red)" : sisa <= 30 ? "var(--amber)" : "var(--green)" }}>
                  {sisa <= 0 ? "Kontrak sudah habis!" : `Kontrak berakhir ${sisa} hari lagi`}
                </div>
                <div style={{ fontSize: 11, color: "var(--s400)", marginTop: 1 }}>
                  {sisa <= 30 ? "Reminder H-30 sudah dikirim." : "Segera konfirmasi perpanjangan."}
                </div>
              </div>
            </div>
          )}

          {/* Partner */}
          {penyewa.partner.length > 0 && (
            <>
              <div className="sec-div">Partner / Penghuni Tambahan</div>
              {penyewa.partner.map((p, i) => (
                <div key={i} className="partner-item">
                  <div className="partner-av">{p.nama[0]}</div>
                  <div>
                    <div className="partner-name">{p.nama}</div>
                    <div className="partner-hub">{p.hubungan}</div>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Riwayat Bayar */}
          <div className="sec-div">Riwayat Pembayaran</div>
          {penyewa.riwayatBayar.length === 0 ? (
            <div style={{ fontSize: 12, color: "var(--s400)", fontStyle: "italic", padding: "8px 0" }}>Belum ada riwayat pembayaran</div>
          ) : (
            penyewa.riwayatBayar.map((b, i) => {
              const bCfg = BAYAR_CFG[b.status] || BAYAR_CFG.lunas;
              return (
                <div key={i} className="pay-row">
                  <div className="pay-bulan">{b.bulan}</div>
                  <div className="pay-tgl">{b.tgl ? fmtTgl(b.tgl) : "—"}</div>
                  <div className="pay-amount">{fmtRp(b.jumlah)}</div>
                  <div className="pay-status">
                    <Badge color={bCfg.color} bg={bCfg.bg}>{bCfg.label}</Badge>
                  </div>
                </div>
              );
            })
          )}

          {/* Catatan */}
          {penyewa.catatan && (
            <>
              <div className="sec-div">Catatan</div>
              <div style={{ fontSize: 13, color: "var(--s700)", lineHeight: 1.6, background: "var(--s50)", borderRadius: 8, padding: "10px 12px" }}>
                {penyewa.catatan}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="dp-foot">
          {penyewa.status === "aktif" && (
            <>
              <button className="btn-warn" onClick={() => {}}>⟳ Perpanjang</button>
              <button className="btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={onEdit}>✏ Edit Data</button>
              <button className="btn-danger" onClick={onCheckout}>Check-out</button>
            </>
          )}
          {penyewa.status === "booked" && (
            <>
              <button className="btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={onEdit}>✏ Edit Data</button>
              <button className="btn-ghost" onClick={onClose}>Tutup</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN MODULE
// ============================================================
export default function DataPenyewa({ userRole = "admin" }) {
  const [penyewas, setPenyewas] = useState(PENYEWA_DATA);
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [toast, setToast] = useState(null);

  // Stats
  const counts = {
    all: penyewas.length,
    aktif: penyewas.filter(p => p.status === "aktif").length,
    booked: penyewas.filter(p => p.status === "booked").length,
    kontrakMendekati: penyewas.filter(p => { const s = hariSisa(p.kontrakSelesai); return s !== null && s <= 30; }).length,
    belumBayar: penyewas.filter(p => p.riwayatBayar.some(b => b.status === "belum")).length,
  };

  // Filter
  const filtered = penyewas.filter(p => {
    if (filterStatus !== "all" && p.status !== filterStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!p.nama.toLowerCase().includes(q) && !String(p.kamar).includes(q) && !p.noHP.includes(q)) return false;
    }
    return true;
  }).sort((a, b) => {
    // belum bayar dulu
    const aBelum = a.riwayatBayar.some(r => r.status === "belum");
    const bBelum = b.riwayatBayar.some(r => r.status === "belum");
    if (aBelum && !bBelum) return -1;
    if (!aBelum && bBelum) return 1;
    // lalu kontrak mendekati
    const sA = hariSisa(a.kontrakSelesai) ?? 999;
    const sB = hariSisa(b.kontrakSelesai) ?? 999;
    return sA - sB;
  });

  const handleCreate = (form) => {
    const newId = "P" + String(penyewas.length + 1).padStart(3, "0");
    const kontrakSelesai = (() => {
      const d = new Date(form.tglMasuk);
      d.setMonth(d.getMonth() + form.kontrakDurasi);
      return d.toISOString().split("T")[0];
    })();
    setPenyewas(prev => [...prev, { id: newId, ...form, status: "aktif", riwayatBayar: [], kontrakSelesai }]);
    setShowForm(false);
    setToast(`✓ Penyewa ${form.nama} berhasil ditambahkan`);
  };

  const handleEdit = (form) => {
    setPenyewas(prev => prev.map(p => p.id === editData.id ? { ...p, ...form } : p));
    const updated = { ...editData, ...form };
    setSelected(updated);
    setEditData(null);
    setToast(`✓ Data ${form.nama} berhasil diperbarui`);
  };

  const handleCheckout = () => {
    if (!window.confirm(`Proses check-out untuk ${selected.nama}?`)) return;
    setPenyewas(prev => prev.map(p => p.id === selected.id ? { ...p, status: "keluar" } : p));
    setSelected(null);
    setToast(`✓ Check-out ${selected.nama} diproses → kamar ${selected.kamar} masuk Deep Clean`);
  };

  return (
    <div className="fade-up">
      <StyleInjector />

      {/* TOPBAR */}
      <div className="topbar">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <div className="search-bar">
            <span style={{ color: "var(--s400)", fontSize: 14 }}>🔍</span>
            <input placeholder="Cari nama, kamar, no HP..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          {["all", "aktif", "booked"].map(f => (
            <div key={f} className={`filter-chip ${filterStatus === f ? "active" : ""}`} onClick={() => setFilterStatus(f)}>
              {f === "all" ? "Semua" : f.charAt(0).toUpperCase() + f.slice(1)}
            </div>
          ))}
        </div>
        <button className="btn-primary" onClick={() => setShowForm(true)}>+ Tambah Penyewa</button>
      </div>

      {/* STATS */}
      <div className="stats-row">
        {[
          { label: "Total Penyewa",   num: counts.all,              color: "var(--s800)" },
          { label: "Aktif",           num: counts.aktif,            color: "var(--green)" },
          { label: "Booked",          num: counts.booked,           color: "var(--amber)" },
          { label: "Kontrak Mau Habis", num: counts.kontrakMendekati, color: "var(--red)" },
          { label: "Belum Bayar",     num: counts.belumBayar,       color: "var(--red)" },
        ].map(s => (
          <div key={s.label} className="stat-pill">
            <div className="stat-pill-num" style={{ color: s.color }}>{s.num}</div>
            <div className="stat-pill-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* GRID */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "var(--s700)", marginBottom: 6 }}>Tidak ada penyewa ditemukan</div>
          <div style={{ fontSize: 13 }}>Coba ubah filter atau tambah penyewa baru</div>
        </div>
      ) : (
        <div className="penyewa-grid">
          {filtered.map(p => {
            const sCfg = STATUS_CFG[p.status] || STATUS_CFG.aktif;
            const sisa = hariSisa(p.kontrakSelesai);
            const adaBelum = p.riwayatBayar.some(b => b.status === "belum");
            const warningKontrak = sisa !== null && sisa <= 30;

            return (
              <div key={p.id}
                className={`penyewa-card ${warningKontrak ? "kontrak-warning" : ""} ${adaBelum ? "belum-bayar" : ""}`}
                onClick={() => setSelected(p)}>
                <div className="card-top">
                  <div className="card-avatar" style={{ background: getAvatarColor(p.id) }}>
                    {getInitials(p.nama)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="card-name">{p.nama}</div>
                    <div className="card-room">Kamar {p.kamar} · {p.tipeKamar}</div>
                    <div className="card-badges">
                      <Badge color={sCfg.color} bg={sCfg.bg}>{sCfg.label}</Badge>
                      {adaBelum && <Badge color="var(--red)" bg="#fee2e2">⚠ Belum Bayar</Badge>}
                      {warningKontrak && <Badge color="var(--amber)" bg="#fef3c7">H-{sisa}</Badge>}
                    </div>
                  </div>
                </div>

                <div className="card-body">
                  <div className="card-info-row">
                    <span className="card-info-icon">📱</span>
                    <span className="card-info-text">{p.noHP}</span>
                  </div>
                  <div className="card-info-row">
                    <span className="card-info-icon">📅</span>
                    <span className="card-info-text">Masuk</span>
                    <span className="card-info-val">{fmtTgl(p.tglMasuk)}</span>
                  </div>
                  <div className="card-info-row">
                    <span className="card-info-icon">⏱</span>
                    <span className="card-info-text">Kontrak</span>
                    <span className="card-info-val">{p.kontrakDurasi} bln</span>
                  </div>
                  {p.partner.length > 0 && (
                    <div className="card-info-row">
                      <span className="card-info-icon">👥</span>
                      <span className="card-info-text">{p.partner.map(x => x.nama.split(" ")[0]).join(", ")}</span>
                    </div>
                  )}
                </div>

                <div className="card-footer">
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--or-d)" }}>{fmtRp(p.harga)}<span style={{ fontSize: 10, fontWeight: 500, color: "var(--s400)" }}>/bln</span></span>
                  {sisa !== null && (
                    <span className="card-kontrak-sisa" style={{ color: sisa <= 14 ? "var(--red)" : sisa <= 30 ? "var(--amber)" : "var(--s400)" }}>
                      {sisa <= 0 ? "Kontrak habis!" : `Berakhir ${sisa}h lagi`}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DETAIL PANEL */}
      {selected && (
        <DetailPanel
          penyewa={selected}
          onClose={() => setSelected(null)}
          onEdit={() => { setEditData(selected); setSelected(null); }}
          onCheckout={handleCheckout}
        />
      )}

      {/* FORM */}
      {(showForm || editData) && (
        <FormPenyewa
          editData={editData}
          onClose={() => { setShowForm(false); setEditData(null); }}
          onSave={editData ? handleEdit : handleCreate}
        />
      )}

      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
