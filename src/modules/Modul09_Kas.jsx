import { useState, useEffect } from "react";

// ============================================================
// MOCK DATA
// ============================================================

// Saku Budget Planning (cash basis)
const SAKU_CFG = [
  { kode: "A", nama: "Petty Cash",     pct: 5,    color: "#f97316", bg: "#fff7ed" },
  { kode: "B", nama: "General Saving", pct: 23,   color: "#1d4ed8", bg: "#dbeafe" },
  { kode: "C", nama: "Internet",       flat: 400000, color: "#0d9488", bg: "#ccfbf1" },
  { kode: "D", nama: "Tax Saving",     pct: 0.5,  color: "#7c3aed", bg: "#ede9fe" },
  { kode: "E", nama: "Revenue Ops",    color: "#16a34a", bg: "#dcfce7" },
  { kode: "F", nama: "THR Saving",     color: "#be185d", bg: "#fce7f3" },
];

// Saldo saku (mock)
const SAKU_SALDO = {
  A: 1098443,
  B: 5045820,
  C: 800000,
  D: 109844,
  E: 8764832,
  F: 1650000,
};

// Transaksi Feb 2026
const TRANSAKSI_DATA = [
  // PEMASUKAN
  { id: "TR001", tgl: "2026-02-01", uraian: "Sewa Kamar 1 — Budi Santoso (Feb)", akun: "Kas", lawan: "Pendapatan Sewa", debit: 2500000, kredit: 0, saku: "E", kategori: "sewa", by: "Admin" },
  { id: "TR002", tgl: "2026-02-01", uraian: "Sewa Kamar 4 — Ahmad Fauzi (Feb)", akun: "Kas", lawan: "Pendapatan Sewa", debit: 2500000, kredit: 0, saku: "E", kategori: "sewa", by: "Admin" },
  { id: "TR003", tgl: "2026-02-01", uraian: "Sewa Kamar 6 — Siti Rahayu (Feb)", akun: "Kas", lawan: "Pendapatan Sewa", debit: 1800000, kredit: 0, saku: "E", kategori: "sewa", by: "Admin" },
  { id: "TR004", tgl: "2026-02-12", uraian: "Sewa Kamar 7 — Rudi Hartono (Feb)", akun: "Kas", lawan: "Pendapatan Sewa", debit: 2650000, kredit: 0, saku: "E", kategori: "sewa", by: "Admin" },
  { id: "TR005", tgl: "2026-02-12", uraian: "Sewa Kamar 10 — Prisca Aprilia (Feb)", akun: "Kas", lawan: "Pendapatan Sewa", debit: 2500000, kredit: 0, saku: "E", kategori: "sewa", by: "Admin" },
  { id: "TR006", tgl: "2026-02-02", uraian: "Sewa Kamar 12 — Amalia Wulan (Feb)", akun: "Kas", lawan: "Pendapatan Sewa", debit: 2500000, kredit: 0, saku: "E", kategori: "sewa", by: "Admin" },

  // PENGELUARAN
  { id: "TR007", tgl: "2026-02-05", uraian: "Management Fee Feb — 22% dari omzet", akun: "Beban Manajemen", lawan: "Kas", debit: 0, kredit: 4829000, saku: "E", kategori: "mgmt-fee", by: "Sistem" },
  { id: "TR008", tgl: "2026-02-10", uraian: "Gaji Krisna Mukti — Feb 2026", akun: "Beban Gaji", lawan: "Kas", debit: 0, kredit: 1800000, saku: "E", kategori: "gaji", by: "Admin" },
  { id: "TR009", tgl: "2026-02-10", uraian: "Gaji Gurit Yudho — Feb 2026", akun: "Beban Gaji", lawan: "Kas", debit: 0, kredit: 2100000, saku: "E", kategori: "gaji", by: "Admin" },
  { id: "TR010", tgl: "2026-02-15", uraian: "Tagihan Listrik & Air Feb", akun: "Beban Utilitas", lawan: "Kas", debit: 0, kredit: 890000, saku: "A", kategori: "utilitas", by: "Admin" },
  { id: "TR011", tgl: "2026-02-15", uraian: "Internet IndiHome Feb", akun: "Beban Internet", lawan: "Kas", debit: 0, kredit: 400000, saku: "C", kategori: "utilitas", by: "Admin" },
  { id: "TR012", tgl: "2026-02-18", uraian: "Beli peralatan cleaning — mop, sapu dll", akun: "Beban Perlengkapan", lawan: "Kas", debit: 0, kredit: 312000, saku: "A", kategori: "peralatan", by: "Krisna" },
  { id: "TR013", tgl: "2026-02-20", uraian: "Servis AC 13 unit — vendor", akun: "Beban Maintenance", lawan: "Kas", debit: 0, kredit: 1950000, saku: "A", kategori: "maintenance", by: "Admin" },
  { id: "TR014", tgl: "2026-02-22", uraian: "Biaya bensin & transport ops", akun: "Beban Akomodasi", lawan: "Kas", debit: 0, kredit: 150000, saku: "A", kategori: "ops", by: "Admin" },
  { id: "TR015", tgl: "2026-02-25", uraian: "THR Saving Feb — alokasi bulanan", akun: "THR Saving", lawan: "Kas", debit: 0, kredit: 390857, saku: "F", kategori: "saving", by: "Sistem" },
  { id: "TR016", tgl: "2026-02-25", uraian: "Tax Saving Feb — 0.5% dari omzet", akun: "Tax Saving", lawan: "Kas", debit: 0, kredit: 109844, saku: "D", kategori: "saving", by: "Sistem" },
];

// Chart of Accounts
const COA = [
  { kode: "1-101", nama: "Kas Tunai",             tipe: "aset",    saldo: 3820000 },
  { kode: "1-102", nama: "Bank BCA",               tipe: "aset",    saldo: 12450000 },
  { kode: "1-103", nama: "Bank Mandiri",            tipe: "aset",    saldo: 5230000 },
  { kode: "1-201", nama: "Piutang Usaha",           tipe: "aset",    saldo: 3600000 },
  { kode: "1-301", nama: "Perlengkapan",            tipe: "aset",    saldo: 4500000 },
  { kode: "1-401", nama: "Peralatan",               tipe: "aset",    saldo: 85000000 },
  { kode: "1-501", nama: "Tanah & Bangunan",        tipe: "aset",    saldo: 750000000 },
  { kode: "2-101", nama: "Hutang Usaha",            tipe: "liabilitas", saldo: 1200000 },
  { kode: "3-101", nama: "Modal",                   tipe: "ekuitas", saldo: 850000000 },
  { kode: "3-201", nama: "Prive/Dividen",           tipe: "ekuitas", saldo: 0 },
  { kode: "4-101", nama: "Pendapatan Sewa",         tipe: "pendapatan", saldo: 21950000 },
  { kode: "5-101", nama: "Beban Gaji",              tipe: "beban",   saldo: 3900000 },
  { kode: "5-102", nama: "Beban Manajemen",         tipe: "beban",   saldo: 4829000 },
  { kode: "5-103", nama: "Beban Utilitas",          tipe: "beban",   saldo: 890000 },
  { kode: "5-104", nama: "Beban Internet",          tipe: "beban",   saldo: 400000 },
  { kode: "5-105", nama: "Beban Maintenance",       tipe: "beban",   saldo: 1950000 },
  { kode: "5-106", nama: "Beban Perlengkapan",      tipe: "beban",   saldo: 312000 },
  { kode: "5-107", nama: "Beban Akomodasi",         tipe: "beban",   saldo: 150000 },
];

const KATEGORI_LIST = [
  { id: "sewa",       label: "Sewa Kamar",        icon: "🏠", jenis: "masuk" },
  { id: "lain-masuk", label: "Pendapatan Lain",   icon: "💵", jenis: "masuk" },
  { id: "gaji",       label: "Gaji & Insentif",   icon: "👤", jenis: "keluar" },
  { id: "mgmt-fee",   label: "Management Fee",    icon: "📊", jenis: "keluar" },
  { id: "utilitas",   label: "Listrik/Air/Internet",icon:"💡", jenis: "keluar" },
  { id: "maintenance",label: "Maintenance",       icon: "🔧", jenis: "keluar" },
  { id: "peralatan",  label: "Peralatan",          icon: "🧰", jenis: "keluar" },
  { id: "ops",        label: "Operasional",        icon: "🚗", jenis: "keluar" },
  { id: "saving",     label: "Alokasi Saving",     icon: "💰", jenis: "keluar" },
  { id: "lain-keluar",label: "Pengeluaran Lain",   icon: "💸", jenis: "keluar" },
];

const BLN = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Ags","Sep","Okt","Nov","Des"];
const fmtRp  = (n) => n != null ? "Rp " + Math.abs(Number(n)).toLocaleString("id-ID") : "-";
const fmtRpS = (n) => { if (n == null) return "-"; const s = n < 0 ? "-" : ""; return s + "Rp " + Math.abs(n).toLocaleString("id-ID"); };
const fmtTgl = (s) => { if (!s) return "-"; const d = new Date(s); return `${d.getDate()} ${BLN[d.getMonth()]}`; };
const fmtTglFull = (s) => { if (!s) return "-"; const d = new Date(s); return `${d.getDate()} ${BLN[d.getMonth()]} ${d.getFullYear()}`; };

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

  /* ── TAB NAV ── */
  .tab-nav{display:flex;gap:0;background:var(--white);border:1px solid var(--s200);border-radius:12px;padding:4px;margin-bottom:20px}
  .tab-btn{flex:1;padding:9px 10px;border-radius:9px;border:none;font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;font-weight:600;cursor:pointer;transition:all 0.15s;color:var(--s400);background:transparent;display:flex;align-items:center;justify-content:center;gap:6px}
  .tab-btn:hover{color:var(--s700)}
  .tab-btn.active{background:linear-gradient(135deg,var(--or),var(--or-d));color:#fff;box-shadow:0 2px 10px rgba(249,115,22,0.3)}

  /* ── GRID LAYOUTS ── */
  .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  .grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px}
  .grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}

  /* ── WIDGET ── */
  .w{background:var(--white);border:1px solid var(--s200);border-radius:12px;overflow:hidden}
  .wh{padding:11px 16px;border-bottom:1px solid var(--s100);display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
  .wh-title{font-size:12px;font-weight:800;color:var(--s800);display:flex;align-items:center;gap:6px}
  .wb{padding:14px 16px}

  /* ── CASHFLOW SUMMARY ── */
  .cf-bar{display:grid;grid-template-columns:1fr 1fr 1fr;gap:1px;background:var(--s200);border-radius:12px;overflow:hidden;margin-bottom:20px}
  .cf-cell{background:var(--white);padding:16px 20px;text-align:center}
  .cf-label{font-size:10px;font-weight:700;color:var(--s400);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:4px}
  .cf-val{font-size:20px;font-weight:800;font-family:'JetBrains Mono',monospace}
  .cf-sub{font-size:11px;color:var(--s400);margin-top:3px}

  /* ── SAKU CARDS ── */
  .saku-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px}
  .saku-card{border-radius:12px;padding:14px;position:relative;overflow:hidden;border:1.5px solid transparent}
  .saku-card::after{content:'';position:absolute;top:-20px;right:-20px;width:80px;height:80px;border-radius:50%;background:rgba(255,255,255,0.15)}
  .saku-kode{font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;opacity:0.7;margin-bottom:4px}
  .saku-nama{font-size:12px;font-weight:700;margin-bottom:8px}
  .saku-saldo{font-size:18px;font-weight:800;font-family:'JetBrains Mono',monospace}
  .saku-pct{font-size:10px;font-weight:600;opacity:0.65;margin-top:3px}
  .saku-bar-wrap{height:4px;background:rgba(0,0,0,0.1);border-radius:2px;margin-top:8px;overflow:hidden}
  .saku-bar-fill{height:100%;border-radius:2px;background:rgba(255,255,255,0.6)}

  /* ── TRANSAKSI TABLE ── */
  .tx-head{display:grid;grid-template-columns:70px 80px 1fr 110px 120px 120px 60px;gap:0;background:var(--s50);border-bottom:1px solid var(--s200);padding:0 14px}
  .th{padding:9px 6px;font-size:9px;font-weight:700;color:var(--s400);text-transform:uppercase;letter-spacing:0.7px}
  .tx-row{display:grid;grid-template-columns:70px 80px 1fr 110px 120px 120px 60px;gap:0;border-bottom:1px solid var(--s100);padding:0 14px;transition:background 0.1s;cursor:pointer;align-items:center}
  .tx-row:last-child{border-bottom:none}
  .tx-row:hover{background:var(--or-pale)}
  .td{padding:10px 6px;font-size:12px;color:var(--s700)}
  .td-id{font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--s400)}
  .td-uraian{font-size:12px;font-weight:600;color:var(--s800);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .td-uraian-sub{font-size:10px;color:var(--s400);margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .td-debit{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;color:var(--green)}
  .td-kredit{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;color:var(--red)}
  .td-zero{font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--s200)}

  /* ── JURNAL TABLE ── */
  .jrn-head{display:grid;grid-template-columns:80px 80px 1fr 1fr 130px 130px;gap:0;background:var(--s50);border-bottom:1px solid var(--s200);padding:0 14px}
  .jrn-row{display:grid;grid-template-columns:80px 80px 1fr 1fr 130px 130px;gap:0;border-bottom:1px solid var(--s100);padding:0 14px;align-items:center}
  .jrn-row:hover{background:var(--or-pale)}
  .jrn-row.kredit-row{background:#fff5f5}

  /* ── FORM INPUT TRANSAKSI ── */
  .tx-form{background:var(--white);border:1px solid var(--s200);border-radius:12px;overflow:hidden;margin-bottom:20px}
  .txf-head{padding:14px 18px;background:linear-gradient(135deg,var(--or-pale),var(--white));border-bottom:1px solid var(--s100);display:flex;align-items:center;justify-content:space-between}
  .txf-body{padding:16px 18px}
  .field-label{font-size:10px;font-weight:700;color:var(--s600);text-transform:uppercase;letter-spacing:0.5px;display:block;margin-bottom:5px}
  .field-input,.field-select,.field-textarea{width:100%;background:var(--s50);border:1.5px solid var(--s200);border-radius:8px;padding:8px 12px;font-size:13px;color:var(--s800);font-family:'Plus Jakarta Sans',sans-serif;outline:none;transition:all 0.15s}
  .field-input:focus,.field-select:focus,.field-textarea:focus{border-color:var(--or);box-shadow:0 0 0 3px rgba(249,115,22,0.08);background:var(--white)}
  .field-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  .field-row-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}
  .field-mb{margin-bottom:12px}

  /* ── JENIS TOGGLE ── */
  .jenis-toggle{display:flex;gap:0;background:var(--s100);border-radius:9px;padding:3px;margin-bottom:14px}
  .jt-btn{flex:1;padding:8px 12px;border-radius:7px;border:none;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all 0.15s;color:var(--s400);background:transparent}
  .jt-btn.masuk.active{background:var(--green);color:#fff;box-shadow:0 2px 8px rgba(22,163,74,0.3)}
  .jt-btn.keluar.active{background:var(--red);color:#fff;box-shadow:0 2px 8px rgba(220,38,38,0.3)}

  /* ── KATEGORI PILLS ── */
  .kat-grid{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px}
  .kat-pill{padding:5px 12px;border-radius:20px;font-size:11px;font-weight:600;border:1.5px solid var(--s200);background:var(--white);color:var(--s600);cursor:pointer;transition:all 0.12s;display:flex;align-items:center;gap:5px}
  .kat-pill:hover{border-color:var(--or-mid)}
  .kat-pill.active{border-color:var(--or);background:var(--or);color:#fff}

  /* ── DOUBLE ENTRY PREVIEW ── */
  .de-preview{background:linear-gradient(135deg,var(--s900),#1a0a00);border-radius:10px;padding:14px 16px;margin-top:12px;color:#fff}
  .de-title{font-size:9px;font-weight:700;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px}
  .de-row{display:grid;grid-template-columns:24px 1fr 130px 130px;gap:8px;align-items:center;padding:5px 0;border-bottom:1px solid rgba(255,255,255,0.06)}
  .de-row:last-child{border-bottom:none}
  .de-pos{font-size:10px;font-weight:700;color:rgba(255,255,255,0.35);font-family:'JetBrains Mono',monospace}
  .de-akun{font-size:12px;font-weight:600;color:#fff}
  .de-d{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;color:#86efac;text-align:right}
  .de-k{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;color:#fca5a5;text-align:right}
  .de-empty{font-size:12px;color:rgba(255,255,255,0.15);text-align:right}

  /* ── COA TABLE ── */
  .coa-section{margin-bottom:16px}
  .coa-section-title{font-size:10px;font-weight:800;color:var(--s400);text-transform:uppercase;letter-spacing:1px;padding:8px 14px;background:var(--s50);border-bottom:1px solid var(--s100)}
  .coa-row{display:grid;grid-template-columns:80px 1fr 100px 120px;gap:0;border-bottom:1px solid var(--s100);padding:0 14px;align-items:center}
  .coa-row:hover{background:var(--or-pale)}
  .coa-kode{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--s400);padding:9px 6px}
  .coa-nama{font-size:12px;font-weight:600;color:var(--s800);padding:9px 6px}
  .coa-tipe{font-size:10px;padding:9px 6px}
  .coa-saldo{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;padding:9px 6px;text-align:right}

  /* ── FILTER CHIP ── */
  .chip{padding:6px 13px;border-radius:20px;font-size:11px;font-weight:600;border:1.5px solid var(--s200);background:var(--white);color:var(--s600);cursor:pointer;transition:all 0.15s;white-space:nowrap}
  .chip:hover{border-color:var(--or-mid)}
  .chip.active{border-color:var(--or);background:var(--or);color:#fff}
  .search-box{display:flex;align-items:center;gap:8px;background:var(--white);border:1.5px solid var(--s200);border-radius:9px;padding:7px 12px;transition:all 0.15s}
  .search-box:focus-within{border-color:var(--or)}
  .search-box input{border:none;outline:none;font-size:12px;color:var(--s800);background:transparent;font-family:'Plus Jakarta Sans',sans-serif;width:160px}
  .search-box input::placeholder{color:var(--s400)}

  /* ── BUTTONS ── */
  .btn-primary{background:linear-gradient(135deg,var(--or),var(--or-d));color:#fff;border:none;border-radius:8px;padding:9px 18px;font-size:13px;font-weight:700;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all 0.15s;box-shadow:0 2px 8px rgba(249,115,22,0.25);display:inline-flex;align-items:center;gap:6px}
  .btn-primary:hover{filter:brightness(1.05)}
  .btn-ghost{background:var(--s100);color:var(--s700);border:1px solid var(--s200);border-radius:8px;padding:9px 14px;font-size:12px;font-weight:600;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all 0.15s;display:inline-flex;align-items:center;gap:6px}
  .btn-ghost:hover{background:var(--s200)}
  .btn-sm{padding:6px 12px;font-size:11px}

  /* ── BADGES ── */
  .badge{display:inline-flex;align-items:center;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700;white-space:nowrap}

  /* ── TOAST ── */
  .toaster{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--s900);color:#fff;padding:10px 22px;border-radius:30px;font-size:13px;font-weight:600;z-index:999;box-shadow:0 8px 24px rgba(0,0,0,0.3);animation:toastIn 0.25s ease;white-space:nowrap}
  @keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  .fade-up{animation:fadeUp 0.25s ease forwards}

  /* ── DETAIL OVERLAY ── */
  .dp-overlay{position:fixed;inset:0;background:rgba(15,23,42,0.55);display:flex;align-items:flex-start;justify-content:flex-end;z-index:100;backdrop-filter:blur(3px);animation:fadeIn 0.2s ease}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  .dp-panel{background:var(--white);width:440px;height:100vh;overflow-y:auto;box-shadow:-10px 0 50px rgba(0,0,0,0.15);animation:slideIn 0.25s cubic-bezier(0.25,0.46,0.45,0.94)}
  @keyframes slideIn{from{transform:translateX(40px);opacity:0}to{transform:translateX(0);opacity:1}}
  .dp-head{padding:18px 20px 14px;border-bottom:1px solid var(--s100)}
  .dp-body{padding:18px 20px}
  .dp-foot{padding:12px 20px;border-top:1px solid var(--s100);display:flex;gap:8px;justify-content:flex-end}

  /* ── DEPRESIASI ── */
  .dep-row{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--s100)}
  .dep-row:last-child{border-bottom:none}
  .dep-name{font-size:13px;font-weight:600;color:var(--s800);flex:1}
  .dep-val{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:600;color:var(--s600)}
  .dep-per-bln{font-size:11px;color:var(--s400)}
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

function Badge({ color, bg, children }) {
  return <span className="badge" style={{ color, background: bg }}>{children}</span>;
}

// ============================================================
// TAB: CASHFLOW (cash basis overview)
// ============================================================
function TabCashflow({ transaksi, onAddTx }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedTx, setSelectedTx] = useState(null);

  const totalMasuk  = transaksi.filter(t => t.debit > 0).reduce((s, t) => s + t.debit, 0);
  const totalKeluar = transaksi.filter(t => t.kredit > 0).reduce((s, t) => s + t.kredit, 0);
  const netCash     = totalMasuk - totalKeluar;

  const filtered = transaksi.filter(t => {
    if (filter === "masuk"  && t.debit === 0) return false;
    if (filter === "keluar" && t.kredit === 0) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!t.uraian.toLowerCase().includes(q) && !t.id.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  // Kelompokkan per kategori untuk pie-like breakdown
  const byKat = KATEGORI_LIST.map(k => ({
    ...k,
    total: transaksi.filter(t => t.kategori === k.id).reduce((s, t) => s + (k.jenis === "masuk" ? t.debit : t.kredit), 0),
  })).filter(k => k.total > 0);

  return (
    <div className="fade-up">
      {/* Summary bar */}
      <div className="cf-bar">
        {[
          { label: "Total Masuk",  val: totalMasuk,  color: "var(--green)" },
          { label: "Total Keluar", val: totalKeluar, color: "var(--red)" },
          { label: "Net Cash",     val: netCash,     color: netCash >= 0 ? "var(--or-d)" : "var(--red)" },
        ].map(c => (
          <div key={c.label} className="cf-cell">
            <div className="cf-label">{c.label}</div>
            <div className="cf-val" style={{ color: c.color }}>{fmtRpS(c.val)}</div>
            <div className="cf-sub">Feb 2026</div>
          </div>
        ))}
      </div>

      {/* Saku */}
      <div style={{ fontSize: 11, fontWeight: 800, color: "var(--s400)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
        Saldo Saku Budget Planning
      </div>
      <div className="saku-grid">
        {SAKU_CFG.map(s => {
          const saldo = SAKU_SALDO[s.kode] || 0;
          const totalSaldo = Object.values(SAKU_SALDO).reduce((a, b) => a + b, 0);
          const pct = Math.round((saldo / totalSaldo) * 100);
          return (
            <div key={s.kode} className="saku-card" style={{ background: s.color, borderColor: s.color + "55" }}>
              <div className="saku-kode" style={{ color: "#fff" }}>{s.kode} — {s.nama}</div>
              <div className="saku-saldo" style={{ color: "#fff" }}>{fmtRp(saldo)}</div>
              <div className="saku-pct" style={{ color: "#fff" }}>
                {s.pct ? `${s.pct}% dari omzet` : s.flat ? `Flat ${fmtRp(s.flat)}/bln` : "Saldo operasional"}
              </div>
              <div className="saku-bar-wrap">
                <div className="saku-bar-fill" style={{ width: Math.min(pct * 2, 100) + "%" }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Breakdown kategori */}
      <div className="grid-2" style={{ marginBottom: 20 }}>
        {["masuk","keluar"].map(jenis => (
          <div key={jenis} className="w">
            <div className="wh">
              <div className="wh-title">{jenis === "masuk" ? "📥 Sumber Pemasukan" : "📤 Rincian Pengeluaran"}</div>
            </div>
            <div className="wb" style={{ padding: "8px 16px" }}>
              {byKat.filter(k => k.jenis === jenis).map(k => {
                const total = jenis === "masuk" ? totalMasuk : totalKeluar;
                const pct = total ? Math.round((k.total / total) * 100) : 0;
                return (
                  <div key={k.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid var(--s100)" }}>
                    <span style={{ fontSize: 16, width: 24, flexShrink: 0 }}>{k.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--s700)" }}>{k.label}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: jenis === "masuk" ? "var(--green)" : "var(--red)", fontFamily: "'JetBrains Mono',monospace" }}>
                          {fmtRp(k.total)}
                        </span>
                      </div>
                      <div style={{ height: 5, background: "var(--s100)", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: pct + "%", background: jenis === "masuk" ? "var(--green)" : "var(--red)", borderRadius: 3, opacity: 0.7 }} />
                      </div>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "var(--s400)", width: 28, textAlign: "right" }}>{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Transaksi table */}
      <div className="w">
        <div className="wh">
          <div className="wh-title">💳 Daftar Transaksi</div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div className="search-box">
              <span style={{ color: "var(--s400)", fontSize: 13 }}>🔍</span>
              <input placeholder="Cari transaksi..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            {["all","masuk","keluar"].map(f => (
              <div key={f} className={`chip ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
                {f === "all" ? "Semua" : f.charAt(0).toUpperCase() + f.slice(1)}
              </div>
            ))}
            <button className="btn-primary btn-sm" onClick={onAddTx}>+ Input Transaksi</button>
          </div>
        </div>
        <div className="tx-head">
          {["ID","Tanggal","Uraian","Akun","Debit","Kredit","Saku"].map(h => (
            <div key={h} className="th">{h}</div>
          ))}
        </div>
        {filtered.map(t => {
          const sakuCfg = SAKU_CFG.find(s => s.kode === t.saku);
          return (
            <div key={t.id} className="tx-row" onClick={() => setSelectedTx(t)}>
              <div className="td td-id">{t.id}</div>
              <div className="td" style={{ fontSize: 11, color: "var(--s600)" }}>{fmtTgl(t.tgl)}</div>
              <div className="td" style={{ minWidth: 0 }}>
                <div className="td-uraian">{t.uraian}</div>
                <div className="td-uraian-sub">{t.lawan}</div>
              </div>
              <div className="td" style={{ fontSize: 11, color: "var(--s600)" }}>{t.akun}</div>
              <div className="td">
                {t.debit > 0
                  ? <span className="td-debit">{fmtRp(t.debit)}</span>
                  : <span className="td-zero">—</span>}
              </div>
              <div className="td">
                {t.kredit > 0
                  ? <span className="td-kredit">{fmtRp(t.kredit)}</span>
                  : <span className="td-zero">—</span>}
              </div>
              <div className="td">
                {sakuCfg && (
                  <span className="badge" style={{ color: sakuCfg.color, background: sakuCfg.bg, fontSize: 10, fontWeight: 800 }}>{t.saku}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail overlay */}
      {selectedTx && (
        <div className="dp-overlay" onClick={() => setSelectedTx(null)}>
          <div className="dp-panel" onClick={e => e.stopPropagation()}>
            <div className="dp-head">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono',monospace", color: "var(--s400)", marginBottom: 4 }}>{selectedTx.id}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "var(--s900)", marginBottom: 4 }}>{selectedTx.uraian}</div>
                  <div style={{ fontSize: 12, color: "var(--s400)" }}>{fmtTglFull(selectedTx.tgl)} · by {selectedTx.by}</div>
                </div>
                <button onClick={() => setSelectedTx(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "var(--s400)" }}>✕</button>
              </div>
            </div>
            <div className="dp-body">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
                {[
                  { label: "Akun Debit", val: selectedTx.akun },
                  { label: "Akun Kredit", val: selectedTx.lawan },
                  { label: "Saku", val: selectedTx.saku + " — " + (SAKU_CFG.find(s => s.kode === selectedTx.saku)?.nama || "-") },
                  { label: "Kategori", val: KATEGORI_LIST.find(k => k.id === selectedTx.kategori)?.label || "-" },
                ].map(r => (
                  <div key={r.label} style={{ background: "var(--s50)", borderRadius: 8, padding: "10px 12px" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "var(--s400)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3 }}>{r.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--s800)" }}>{r.val}</div>
                  </div>
                ))}
              </div>

              {/* Double entry view */}
              <div style={{ fontSize: 10, fontWeight: 700, color: "var(--s400)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Entri Jurnal</div>
              <div className="de-preview">
                <div style={{ display: "grid", gridTemplateColumns: "24px 1fr 100px 100px", gap: 6, marginBottom: 6 }}>
                  {["","Akun","Debit","Kredit"].map(h => (
                    <div key={h} style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.25)", textTransform: "uppercase" }}>{h}</div>
                  ))}
                </div>
                {[
                  { pos: "Dr", akun: selectedTx.akun,   d: selectedTx.debit > 0 ? selectedTx.debit : selectedTx.kredit, k: 0 },
                  { pos: "Kr", akun: "  " + selectedTx.lawan, d: 0, k: selectedTx.kredit > 0 ? selectedTx.kredit : selectedTx.debit },
                ].map((row, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "24px 1fr 100px 100px", gap: 6, padding: "6px 0", borderTop: i > 0 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: i === 0 ? "#86efac" : "#fca5a5", fontFamily: "'JetBrains Mono',monospace" }}>{row.pos}</div>
                    <div style={{ fontSize: 12, color: "#fff", fontFamily: "'JetBrains Mono',monospace", paddingLeft: i === 1 ? 12 : 0 }}>{row.akun}</div>
                    <div style={{ textAlign: "right", fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 700, color: row.d > 0 ? "#86efac" : "rgba(255,255,255,0.15)" }}>
                      {row.d > 0 ? fmtRp(row.d) : "—"}
                    </div>
                    <div style={{ textAlign: "right", fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 700, color: row.k > 0 ? "#fca5a5" : "rgba(255,255,255,0.15)" }}>
                      {row.k > 0 ? fmtRp(row.k) : "—"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// TAB: FORM INPUT TRANSAKSI
// ============================================================
function TabInputTransaksi({ onSave, onCancel }) {
  const [jenis, setJenis] = useState("masuk");
  const [form, setForm] = useState({
    tgl: "2026-02-26", uraian: "", akun: "", lawan: "",
    jumlah: "", saku: "E", kategori: "sewa",
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const katFiltered = KATEGORI_LIST.filter(k => k.jenis === jenis);
  const selectedKat = KATEGORI_LIST.find(k => k.id === form.kategori);

  // Auto double entry based on jenis
  const deEntri = jenis === "masuk"
    ? { dr: form.akun || "Kas", kr: form.lawan || "Pendapatan Sewa" }
    : { dr: form.akun || "Beban ...", kr: form.lawan || "Kas" };

  const handleSave = () => {
    if (!form.uraian || !form.jumlah) return;
    onSave({ ...form, jenis });
  };

  return (
    <div className="fade-up">
      <div className="tx-form">
        <div className="txf-head">
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "var(--s900)", marginBottom: 2 }}>+ Input Transaksi Baru</div>
            <div style={{ fontSize: 11, color: "var(--s400)" }}>Setiap transaksi otomatis generate double entry journal</div>
          </div>
          <button className="btn-ghost btn-sm" onClick={onCancel}>← Kembali</button>
        </div>
        <div className="txf-body">
          {/* Jenis toggle */}
          <div className="jenis-toggle">
            <button className={`jt-btn masuk ${jenis === "masuk" ? "active" : ""}`} onClick={() => setJenis("masuk")}>
              ↑ Pemasukan
            </button>
            <button className={`jt-btn keluar ${jenis === "keluar" ? "active" : ""}`} onClick={() => setJenis("keluar")}>
              ↓ Pengeluaran
            </button>
          </div>

          {/* Kategori */}
          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--s400)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 7 }}>Kategori</div>
          <div className="kat-grid">
            {katFiltered.map(k => (
              <div key={k.id} className={`kat-pill ${form.kategori === k.id ? "active" : ""}`} onClick={() => set("kategori", k.id)}>
                <span>{k.icon}</span>{k.label}
              </div>
            ))}
          </div>

          {/* Basic fields */}
          <div className="field-row field-mb">
            <div>
              <label className="field-label">Tanggal</label>
              <input className="field-input" type="date" value={form.tgl} onChange={e => set("tgl", e.target.value)} />
            </div>
            <div>
              <label className="field-label">Jumlah (Rp) *</label>
              <input className="field-input" type="number" placeholder="0" value={form.jumlah} onChange={e => set("jumlah", e.target.value)} style={{ fontFamily: "'JetBrains Mono',monospace" }} />
            </div>
          </div>

          <div className="field-mb">
            <label className="field-label">Uraian / Keterangan *</label>
            <input className="field-input" placeholder="Deskripsi transaksi..." value={form.uraian} onChange={e => set("uraian", e.target.value)} />
          </div>

          <div className="field-row field-mb">
            <div>
              <label className="field-label">Akun {jenis === "masuk" ? "Debit" : "Debit (Beban)"}</label>
              <select className="field-select" value={form.akun} onChange={e => set("akun", e.target.value)}>
                <option value="">Pilih Akun</option>
                {COA.filter(c => jenis === "masuk" ? c.tipe === "aset" : c.tipe === "beban").map(c => (
                  <option key={c.kode} value={c.nama}>{c.kode} — {c.nama}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label">Akun {jenis === "masuk" ? "Kredit (Pendapatan)" : "Kredit"}</label>
              <select className="field-select" value={form.lawan} onChange={e => set("lawan", e.target.value)}>
                <option value="">Pilih Akun</option>
                {COA.filter(c => jenis === "masuk" ? c.tipe === "pendapatan" : c.tipe === "aset").map(c => (
                  <option key={c.kode} value={c.nama}>{c.kode} — {c.nama}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="field-mb">
            <label className="field-label">Alokasi Saku</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {SAKU_CFG.map(s => (
                <div key={s.kode}
                  style={{ padding: "6px 12px", borderRadius: 20, border: `1.5px solid ${form.saku === s.kode ? s.color : "var(--s200)"}`, background: form.saku === s.kode ? s.bg : "var(--white)", cursor: "pointer", fontSize: 11, fontWeight: 700, color: form.saku === s.kode ? s.color : "var(--s600)", transition: "all 0.12s" }}
                  onClick={() => set("saku", s.kode)}>
                  {s.kode} — {s.nama}
                </div>
              ))}
            </div>
          </div>

          {/* Double entry preview */}
          {form.jumlah > 0 && (
            <div className="de-preview">
              <div className="de-title">Preview Double Entry Journal</div>
              {[
                { pos: "Dr", akun: deEntri.dr, d: Number(form.jumlah), k: 0 },
                { pos: "Kr", akun: "    " + deEntri.kr, d: 0, k: Number(form.jumlah) },
              ].map((row, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "28px 1fr 130px 130px", gap: 8, padding: "7px 0", borderTop: i > 0 ? "1px solid rgba(255,255,255,0.06)" : "none", alignItems: "center" }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: i === 0 ? "#86efac" : "#fca5a5", fontFamily: "'JetBrains Mono',monospace" }}>{row.pos}</div>
                  <div style={{ fontSize: 12, color: "#fff" }}>{row.akun}</div>
                  <div style={{ textAlign: "right", fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 700, color: row.d > 0 ? "#86efac" : "rgba(255,255,255,0.15)" }}>
                    {row.d > 0 ? fmtRp(row.d) : "—"}
                  </div>
                  <div style={{ textAlign: "right", fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 700, color: row.k > 0 ? "#fca5a5" : "rgba(255,255,255,0.15)" }}>
                    {row.k > 0 ? fmtRp(row.k) : "—"}
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>Total seimbang</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#86efac", fontFamily: "'JetBrains Mono',monospace" }}>{fmtRp(form.jumlah)} = {fmtRp(form.jumlah)} ✓</span>
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button className="btn-ghost" style={{ flex: 1, justifyContent: "center" }} onClick={onCancel}>Batal</button>
            <button className="btn-primary" style={{ flex: 2, justifyContent: "center" }} onClick={handleSave}
              disabled={!form.uraian || !form.jumlah}>
              ✓ Simpan Transaksi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// TAB: BUKU JURNAL (double entry)
// ============================================================
function TabJurnal({ transaksi }) {
  return (
    <div className="fade-up">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontSize: 12, color: "var(--s600)" }}>
          Jurnal umum accrual basis — {transaksi.length * 2} baris entri ({transaksi.length} transaksi)
        </div>
        <button className="btn-ghost btn-sm">↓ Export Excel</button>
      </div>

      <div className="w">
        <div className="jrn-head">
          {["Tanggal","No Ref","Akun","Keterangan","Debit","Kredit"].map(h => (
            <div key={h} className="th">{h}</div>
          ))}
        </div>
        {transaksi.map(t => (
          <div key={t.id}>
            {/* Baris debit */}
            <div key={t.id + "d"} className="jrn-row">
              <div className="td" style={{ fontSize: 11, color: "var(--s600)" }}>{fmtTgl(t.tgl)}</div>
              <div className="td td-id">{t.id}</div>
              <div className="td" style={{ fontWeight: 600, color: "var(--s800)", fontSize: 12 }}>{t.akun}</div>
              <div className="td" style={{ fontSize: 11, color: "var(--s600)" }}>{t.uraian}</div>
              <div className="td td-debit">{fmtRp(t.debit > 0 ? t.debit : t.kredit)}</div>
              <div className="td td-zero">—</div>
            </div>
            {/* Baris kredit */}
            <div key={t.id + "k"} className="jrn-row kredit-row">
              <div className="td" style={{ fontSize: 11, color: "transparent" }}>·</div>
              <div className="td td-id" style={{ color: "transparent" }}>·</div>
              <div className="td" style={{ paddingLeft: 20, color: "var(--red)", fontStyle: "italic", fontSize: 12 }}>    {t.lawan}</div>
              <div className="td" style={{ fontSize: 11, color: "var(--s400)", fontStyle: "italic" }}>—</div>
              <div className="td td-zero">—</div>
              <div className="td td-kredit">{fmtRp(t.kredit > 0 ? t.kredit : t.debit)}</div>
            </div>
          </div>
        ))}
        {/* Totals */}
        <div style={{ display: "grid", gridTemplateColumns: "80px 80px 1fr 1fr 130px 130px", gap: 0, borderTop: "2px solid var(--s200)", background: "var(--s50)", padding: "0 14px" }}>
          {["","","","Total","",""].map((h, i) => {
            const totalD = transaksi.reduce((s, t) => s + (t.debit > 0 ? t.debit : t.kredit), 0);
            const totalK = transaksi.reduce((s, t) => s + (t.kredit > 0 ? t.kredit : t.debit), 0);
            return (
              <div key={i} style={{ padding: "10px 6px", fontSize: i === 4 ? 13 : i === 5 ? 13 : 12, fontWeight: 800, color: i === 4 ? "var(--green)" : i === 5 ? "var(--red)" : "var(--s600)", textAlign: i >= 4 ? "left" : "left", fontFamily: i >= 4 ? "'JetBrains Mono',monospace" : "inherit" }}>
                {i === 3 && "TOTAL"}
                {i === 4 && fmtRp(totalD)}
                {i === 5 && fmtRp(totalK)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// TAB: CHART OF ACCOUNTS
// ============================================================
function TabCOA() {
  const groups = [
    { tipe: "aset",       label: "ASET",        color: "var(--blue)" },
    { tipe: "liabilitas", label: "LIABILITAS",  color: "var(--red)" },
    { tipe: "ekuitas",    label: "EKUITAS",      color: "var(--purple)" },
    { tipe: "pendapatan", label: "PENDAPATAN",   color: "var(--green)" },
    { tipe: "beban",      label: "BEBAN",        color: "var(--amber)" },
  ];

  const totalAset = COA.filter(c => c.tipe === "aset").reduce((s, c) => s + c.saldo, 0);
  const totalLiab = COA.filter(c => c.tipe === "liabilitas").reduce((s, c) => s + c.saldo, 0);
  const totalEk   = COA.filter(c => c.tipe === "ekuitas").reduce((s, c) => s + c.saldo, 0);

  return (
    <div className="fade-up">
      {/* Quick balance check */}
      <div className="cf-bar" style={{ marginBottom: 20 }}>
        {[
          { label: "Total Aset",          val: totalAset, color: "var(--blue)" },
          { label: "Liabilitas + Ekuitas",val: totalLiab + totalEk, color: "var(--purple)" },
          { label: "Selisih (harus 0)",   val: totalAset - totalLiab - totalEk, color: "var(--green)" },
        ].map(c => (
          <div key={c.label} className="cf-cell">
            <div className="cf-label">{c.label}</div>
            <div className="cf-val" style={{ color: c.color, fontSize: 16 }}>{fmtRp(c.val)}</div>
          </div>
        ))}
      </div>

      <div className="w">
        <div className="wh">
          <div className="wh-title">📚 Chart of Accounts</div>
          <button className="btn-ghost btn-sm">+ Tambah Akun</button>
        </div>
        {/* Header */}
        <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 100px 140px", gap: 0, background: "var(--s50)", borderBottom: "1px solid var(--s200)", padding: "0 14px" }}>
          {["Kode","Nama Akun","Tipe","Saldo"].map(h => (
            <div key={h} className="th">{h}</div>
          ))}
        </div>
        {groups.map(g => {
          const rows = COA.filter(c => c.tipe === g.tipe);
          const subtotal = rows.reduce((s, c) => s + c.saldo, 0);
          return (
            <div key={g.tipe} className="coa-section">
              <div className="coa-section-title" style={{ color: g.color }}>
                {g.label} — Subtotal: {fmtRp(subtotal)}
              </div>
              {rows.map(c => (
                <div key={c.kode} className="coa-row">
                  <div className="coa-kode">{c.kode}</div>
                  <div className="coa-nama">{c.nama}</div>
                  <div className="coa-tipe">
                    <Badge color={g.color} bg={g.color + "18"}>{c.tipe}</Badge>
                  </div>
                  <div className="coa-saldo" style={{ color: c.tipe === "beban" || c.tipe === "liabilitas" ? "var(--red)" : "var(--green)" }}>
                    {fmtRp(c.saldo)}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// TAB: DEPRESIASI ASET
// ============================================================
const ASET_DATA = [
  { nama: "Gedung & Bangunan", nilai: 750000000, umur: 240, tglBeli: "2020-01-01" },
  { nama: "AC LG 1 PK (x13)",  nilai: 32500000,  umur: 60,  tglBeli: "2022-06-01" },
  { nama: "Meja & Kursi Kantor",nilai: 3500000,  umur: 60,  tglBeli: "2022-01-01" },
  { nama: "CCTV System",        nilai: 8500000,  umur: 60,  tglBeli: "2023-03-01" },
  { nama: "Water Heater (x4)",  nilai: 6000000,  umur: 84,  tglBeli: "2022-06-01" },
  { nama: "Perabot Kamar (x12)",nilai: 24000000, umur: 120, tglBeli: "2020-01-01" },
];

function TabDepresiasi() {
  const [newAset, setNewAset] = useState({ nama: "", nilai: "", umur: 60 });
  const [asets, setAsets] = useState(ASET_DATA);

  const totalDepBln = asets.reduce((s, a) => s + Math.round(a.nilai / a.umur), 0);
  const totalDepThn = totalDepBln * 12;
  const totalNBA    = asets.reduce((s, a) => {
    const bln = Math.floor((new Date("2026-02-26") - new Date(a.tglBeli)) / (1000 * 60 * 60 * 24 * 30));
    return s + Math.max(0, a.nilai - (Math.round(a.nilai / a.umur) * bln));
  }, 0);

  const addAset = () => {
    if (!newAset.nama || !newAset.nilai) return;
    setAsets(prev => [...prev, { ...newAset, nilai: Number(newAset.nilai), umur: Number(newAset.umur), tglBeli: "2026-02-26" }]);
    setNewAset({ nama: "", nilai: "", umur: 60 });
  };

  return (
    <div className="fade-up">
      {/* Summary */}
      <div className="cf-bar" style={{ marginBottom: 20 }}>
        {[
          { label: "Depresiasi / Bulan", val: totalDepBln, color: "var(--amber)" },
          { label: "Depresiasi / Tahun", val: totalDepThn, color: "var(--red)" },
          { label: "Nilai Buku Aset",    val: totalNBA,    color: "var(--blue)" },
        ].map(c => (
          <div key={c.label} className="cf-cell">
            <div className="cf-label">{c.label}</div>
            <div className="cf-val" style={{ color: c.color, fontSize: 17 }}>{fmtRp(c.val)}</div>
          </div>
        ))}
      </div>

      {/* Tabel aset */}
      <div className="w" style={{ marginBottom: 16 }}>
        <div className="wh">
          <div className="wh-title">🏗 Daftar Aset Tetap</div>
          <span style={{ fontSize: 11, color: "var(--s400)" }}>{asets.length} aset</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 60px 120px 120px", background: "var(--s50)", borderBottom: "1px solid var(--s200)", padding: "0 16px" }}>
          {["Nama Aset","Nilai Perolehan","Umur","Dep/Bulan","Nilai Buku"].map(h => (
            <div key={h} className="th">{h}</div>
          ))}
        </div>
        {asets.map((a, i) => {
          const depBln = Math.round(a.nilai / a.umur);
          const blnBerjalan = Math.floor((new Date("2026-02-26") - new Date(a.tglBeli)) / (1000 * 60 * 60 * 24 * 30));
          const nilaiBuku = Math.max(0, a.nilai - depBln * blnBerjalan);
          const pct = Math.round((nilaiBuku / a.nilai) * 100);
          return (
            <div key={i} className="dep-row" style={{ padding: "10px 16px", display: "grid", gridTemplateColumns: "1fr 120px 60px 120px 120px", gap: 0, borderBottom: "1px solid var(--s100)" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--s800)" }}>{a.nama}</div>
                <div style={{ fontSize: 10, color: "var(--s400)", marginTop: 2 }}>Sejak {fmtTglFull(a.tglBeli)}</div>
              </div>
              <div style={{ fontSize: 12, fontFamily: "'JetBrains Mono',monospace", fontWeight: 600, color: "var(--s700)", padding: "2px 6px" }}>{fmtRp(a.nilai)}</div>
              <div style={{ fontSize: 12, color: "var(--s600)", padding: "2px 6px" }}>{a.umur}bln</div>
              <div style={{ fontSize: 12, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, color: "var(--amber)", padding: "2px 6px" }}>{fmtRp(depBln)}</div>
              <div style={{ padding: "2px 6px" }}>
                <div style={{ fontSize: 12, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, color: pct > 50 ? "var(--green)" : "var(--red)" }}>{fmtRp(nilaiBuku)}</div>
                <div style={{ fontSize: 10, color: "var(--s400)" }}>{pct}% tersisa</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Form tambah aset */}
      <div className="w">
        <div className="wh"><div className="wh-title">+ Tambah Aset Baru</div></div>
        <div className="wb">
          <div className="field-row-3 field-mb">
            <div>
              <label className="field-label">Nama Aset</label>
              <input className="field-input" placeholder="Nama aset" value={newAset.nama} onChange={e => setNewAset(f => ({ ...f, nama: e.target.value }))} />
            </div>
            <div>
              <label className="field-label">Nilai Perolehan (Rp)</label>
              <input className="field-input" type="number" placeholder="0" value={newAset.nilai} onChange={e => setNewAset(f => ({ ...f, nilai: e.target.value }))} />
            </div>
            <div>
              <label className="field-label">Umur Ekonomis (bulan)</label>
              <input className="field-input" type="number" placeholder="60" value={newAset.umur} onChange={e => setNewAset(f => ({ ...f, umur: e.target.value }))} />
            </div>
          </div>
          {newAset.nilai > 0 && (
            <div style={{ fontSize: 12, color: "var(--s600)", marginBottom: 10, background: "var(--or-pale)", padding: "8px 12px", borderRadius: 7 }}>
              Depresiasi: <b>{fmtRp(Math.round(Number(newAset.nilai) / Number(newAset.umur)))}/bulan</b> · <b>{fmtRp(Math.round(Number(newAset.nilai) / Number(newAset.umur)) * 12)}/tahun</b>
            </div>
          )}
          <button className="btn-primary" onClick={addAset} disabled={!newAset.nama || !newAset.nilai}>
            + Tambah Aset
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN MODULE
// ============================================================
export default function KasJurnal({ userRole = "admin" }) {
  const [activeTab, setActiveTab] = useState("cashflow");
  const [transaksi, setTransaksi] = useState(TRANSAKSI_DATA);
  const [toast, setToast] = useState(null);

  const handleSaveTx = (form) => {
    const newId = "TR" + String(transaksi.length + 1).padStart(3, "0");
    const newTx = {
      id: newId, tgl: form.tgl, uraian: form.uraian,
      akun: form.akun || (form.jenis === "masuk" ? "Kas" : "Beban Lain"),
      lawan: form.lawan || (form.jenis === "masuk" ? "Pendapatan Lain" : "Kas"),
      debit:  form.jenis === "masuk"  ? Number(form.jumlah) : 0,
      kredit: form.jenis === "keluar" ? Number(form.jumlah) : 0,
      saku: form.saku, kategori: form.kategori, by: "Admin",
    };
    setTransaksi(prev => [newTx, ...prev]);
    setActiveTab("cashflow");
    setToast(`✓ Transaksi ${newId} berhasil disimpan!`);
  };

  const TABS = [
    { id: "cashflow", icon: "💳", label: "Cashflow" },
    { id: "input",    icon: "✚",  label: "Input Transaksi" },
    { id: "jurnal",   icon: "📒", label: "Buku Jurnal" },
    { id: "coa",      icon: "📚", label: "Chart of Accounts" },
    { id: "dep",      icon: "🏗",  label: "Depresiasi Aset" },
  ];

  return (
    <div className="fade-up">
      <StyleInjector />

      {/* TAB NAV */}
      <div className="tab-nav">
        {TABS.map(t => (
          <button key={t.id} className={`tab-btn ${activeTab === t.id ? "active" : ""}`}
            onClick={() => setActiveTab(t.id)}>
            <span>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {activeTab === "cashflow" && <TabCashflow transaksi={transaksi} onAddTx={() => setActiveTab("input")} />}
      {activeTab === "input"    && <TabInputTransaksi onSave={handleSaveTx} onCancel={() => setActiveTab("cashflow")} />}
      {activeTab === "jurnal"   && <TabJurnal transaksi={transaksi} />}
      {activeTab === "coa"      && <TabCOA />}
      {activeTab === "dep"      && <TabDepresiasi />}

      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
