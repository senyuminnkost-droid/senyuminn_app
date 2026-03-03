import { useState, useEffect } from "react";

// ============================================================
// MOCK DATA
// ============================================================
const PROFIL_KOST_INIT = {
  nama: "Senyum Inn Exclusive Kost",
  tagline: "Exclusive Kost",
  alamat: "Jl. Contoh No. 1, Semarang Tengah, Jawa Tengah 50132",
  telepon: "024-76543210",
  whatsapp: "081234567890",
  email: "senyuminn@gmail.com",
  owner: "Yusuf Vindra Asmara",
  jam_buka: "06:00",
  jam_tutup: "22:00",
  kapasitas_motor: 15,
  kapasitas_mobil: 4,
  koordinat_lat: "-6.9932",
  koordinat_lng: "110.4203",
  radius_absensi: 500,
  fasilitas_umum: ["WiFi 100 Mbps", "Dapur Bersama", "Ruang Tamu", "CCTV 24 Jam", "Water Heater", "Parkir Motor & Mobil"],
  harga: {
    reguler: 1800000,
    premium: 2500000,
    premium_kulkas: 2650000,
  },
  aturan_sewa: {
    denda_keterlambatan: 50000,
    batas_bayar: 25,
    toleransi_hari: 3,
    sewa_harian: 250000,
    deposit: 500000,
    denda_aktif: true,
  },
  rekening: [
    { id: 1, bank: "BCA", no: "1234567890", atas: "Yusuf Vindra Asmara", utama: true },
    { id: 2, bank: "Mandiri", no: "9876543210", atas: "Yusuf Vindra Asmara", utama: false },
    { id: 3, bank: "BNI", no: "1122334455", atas: "Yusuf Vindra Asmara", utama: false },
  ],
  rekening_koperasi: { bank: "BCA", no: "5566778899", atas: "Koperasi Senyum Inn" },
  keuangan: {
    mgmt_fee_pct: 22,
    saku: [
      { kode: "A", nama: "Petty Cash",     pct: 5,   flat: null },
      { kode: "B", nama: "General Saving", pct: 23,  flat: null },
      { kode: "C", nama: "Internet",       pct: null, flat: 400000 },
      { kode: "D", nama: "Tax Saving",     pct: 0.5, flat: null },
    ],
  },
};

const USERS_INIT = [
  { id: 1, username: "owner",  nama: "Yusuf Vindra Asmara", jabatan: "Owner",              role: "admin",  aktif: true,  lastLogin: "2026-02-26 08:14", created: "2020-01-01" },
  { id: 2, username: "admin",  nama: "Rina Manajemen",       jabatan: "Super Admin",         role: "admin",  aktif: true,  lastLogin: "2026-02-26 07:55", created: "2020-01-01" },
  { id: 3, username: "staff1", nama: "Muh. Krisna Mukti",    jabatan: "Clean & Service",     role: "staff",  aktif: true,  lastLogin: "2026-02-25 08:02", created: "2025-01-01" },
  { id: 4, username: "staff2", nama: "Gurit Yudho Anggoro",  jabatan: "Staf Penjaga Malam",  role: "staff",  aktif: true,  lastLogin: "2026-02-26 00:01", created: "2024-06-01" },
];

const ACTIVITY_LOG = [
  { id: 1, user: "admin",  aksi: "Konfirmasi pembayaran Kamar 1 — Budi Santoso",      waktu: "2026-02-26 09:41" },
  { id: 2, user: "staff1", aksi: "Update status tiket #T002 → In Progress",            waktu: "2026-02-26 09:15" },
  { id: 3, user: "admin",  aksi: "Tambah transaksi: Servis AC 13 unit — Rp 1.950.000", waktu: "2026-02-25 14:32" },
  { id: 4, user: "owner",  aksi: "Login ke sistem",                                    waktu: "2026-02-25 08:14" },
  { id: 5, user: "staff2", aksi: "Clock-in absensi — 00:01 WIB",                       waktu: "2026-02-25 00:01" },
  { id: 6, user: "admin",  aksi: "Generate slip gaji Feb 2026 (3 karyawan)",           waktu: "2026-02-24 16:00" },
  { id: 7, user: "staff1", aksi: "Submit weekly service Kamar 3 ✓",                   waktu: "2026-02-24 10:22" },
  { id: 8, user: "admin",  aksi: "Check-out Kamar 8 — status → Deep Clean",           waktu: "2026-02-23 14:05" },
];

const BANK_LIST = ["BCA", "Mandiri", "BNI", "BRI", "BSI", "BTN"];
const ROLE_CFG = {
  admin: { label: "Admin / Owner", color: "#f97316", bg: "#fff7ed" },
  staff: { label: "Staff",         color: "#1d4ed8", bg: "#dbeafe" },
};
const fmtRp = (n) => n != null ? "Rp " + Number(n).toLocaleString("id-ID") : "-";
const getInitials = (n) => n.split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase();
const AVATAR_COLORS = [
  "linear-gradient(135deg,#f97316,#ea580c)",
  "linear-gradient(135deg,#1d4ed8,#1e40af)",
  "linear-gradient(135deg,#0d9488,#0f766e)",
  "linear-gradient(135deg,#7c3aed,#6d28d9)",
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
    --amber:#d97706;--purple:#7c3aed;
  }
  body{font-family:'Plus Jakarta Sans',sans-serif;background:var(--s50)}
  ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:var(--s200);border-radius:4px}

  /* ── TAB NAV ── */
  .mod-nav{display:flex;gap:4px;background:var(--white);border:1px solid var(--s200);border-radius:12px;padding:4px;margin-bottom:20px}
  .mod-btn{flex:1;padding:9px 8px;border-radius:9px;border:none;font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;font-weight:600;cursor:pointer;transition:all 0.15s;color:var(--s400);background:transparent;display:flex;align-items:center;justify-content:center;gap:6px}
  .mod-btn:hover{color:var(--s700)}
  .mod-btn.active{background:linear-gradient(135deg,var(--or),var(--or-d));color:#fff;box-shadow:0 2px 10px rgba(249,115,22,0.3)}

  /* ── SECTION NAV (left sidebar style) ── */
  .sec-nav{display:flex;flex-direction:column;gap:2px;background:var(--white);border:1px solid var(--s200);border-radius:12px;padding:6px;width:200px;flex-shrink:0}
  .sec-btn{padding:8px 12px;border-radius:8px;border:none;font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;font-weight:600;cursor:pointer;transition:all 0.12s;color:var(--s600);background:transparent;text-align:left;display:flex;align-items:center;gap:8px}
  .sec-btn:hover{background:var(--s50);color:var(--s800)}
  .sec-btn.active{background:var(--or-pale);color:var(--or-d);border-left:2px solid var(--or)}

  /* ── LAYOUT ── */
  .layout{display:flex;gap:16px;align-items:start}
  .main-area{flex:1;min-width:0}
  .g2{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px}
  .g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:14px}

  /* ── WIDGET ── */
  .w{background:var(--white);border:1px solid var(--s200);border-radius:12px;overflow:hidden;margin-bottom:14px}
  .wh{padding:12px 16px;border-bottom:1px solid var(--s100);display:flex;align-items:center;justify-content:space-between}
  .wh-title{font-size:12px;font-weight:800;color:var(--s800);display:flex;align-items:center;gap:6px}
  .wb{padding:14px 16px}

  /* ── FIELD ── */
  .field-label{font-size:10px;font-weight:700;color:var(--s600);text-transform:uppercase;letter-spacing:0.5px;display:block;margin-bottom:5px}
  .req{color:var(--red);margin-left:2px}
  .field-input,.field-select,.field-textarea{width:100%;background:var(--s50);border:1.5px solid var(--s200);border-radius:8px;padding:8px 12px;font-size:13px;color:var(--s800);font-family:'Plus Jakarta Sans',sans-serif;outline:none;transition:all 0.15s}
  .field-input:focus,.field-select:focus,.field-textarea:focus{border-color:var(--or);box-shadow:0 0 0 3px rgba(249,115,22,0.08);background:var(--white)}
  .field-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px}
  .field-row-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:12px}
  .field-mb{margin-bottom:12px}
  .field-note{font-size:11px;color:var(--s400);margin-top:4px}

  /* ── TOGGLE SWITCH ── */
  .toggle-wrap{display:flex;align-items:center;gap:10px;padding:10px 0}
  .toggle-label{font-size:13px;font-weight:600;color:var(--s700);flex:1}
  .toggle{width:42px;height:24px;border-radius:12px;border:none;cursor:pointer;position:relative;transition:background 0.2s;flex-shrink:0}
  .toggle::after{content:'';position:absolute;width:18px;height:18px;border-radius:50%;background:#fff;top:3px;transition:left 0.2s;box-shadow:0 1px 3px rgba(0,0,0,0.2)}
  .toggle.on{background:var(--or)}
  .toggle.on::after{left:21px}
  .toggle.off{background:var(--s200)}
  .toggle.off::after{left:3px}

  /* ── NUMBER INPUT ── */
  .num-input-wrap{display:flex;align-items:center;gap:0;border:1.5px solid var(--s200);border-radius:8px;overflow:hidden;background:var(--s50)}
  .num-input-wrap:focus-within{border-color:var(--or)}
  .num-btn{width:32px;height:36px;border:none;background:var(--s100);cursor:pointer;font-size:16px;color:var(--s600);transition:all 0.12s;display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .num-btn:hover{background:var(--s200)}
  .num-field{flex:1;border:none;background:transparent;text-align:center;font-size:14px;font-weight:700;color:var(--s800);font-family:'Plus Jakarta Sans',monospace;outline:none;padding:0 4px}

  /* ── FASILITAS TAGS ── */
  .tag-input-wrap{display:flex;gap:6px;flex-wrap:wrap;padding:10px;background:var(--s50);border:1.5px solid var(--s200);border-radius:8px;min-height:48px;transition:all 0.15s}
  .tag-input-wrap:focus-within{border-color:var(--or)}
  .tag{display:inline-flex;align-items:center;gap:4px;padding:4px 10px;border-radius:20px;background:var(--or-light);color:var(--or-d);font-size:12px;font-weight:600;border:1px solid var(--or-mid)}
  .tag-del{background:none;border:none;cursor:pointer;color:var(--or-d);font-size:14px;line-height:1;padding:0}
  .tag-del:hover{color:var(--red)}
  .tag-new-input{border:none;outline:none;background:transparent;font-size:13px;font-family:'Plus Jakarta Sans',sans-serif;color:var(--s800);flex:1;min-width:120px}
  .tag-new-input::placeholder{color:var(--s400)}

  /* ── REKENING CARD ── */
  .rek-card{background:var(--s50);border:1.5px solid var(--s200);border-radius:10px;padding:12px 14px;display:flex;align-items:center;gap:12px;margin-bottom:8px;transition:all 0.12s}
  .rek-card:hover{border-color:var(--or-mid)}
  .rek-card.utama{border-color:var(--or-mid);background:var(--or-pale)}
  .rek-bank-badge{width:40px;height:36px;border-radius:8px;background:linear-gradient(135deg,var(--blue),#1e40af);display:flex;align-items:center;justify-content:center;color:#fff;font-size:10px;font-weight:800;flex-shrink:0}
  .rek-info{flex:1;min-width:0}
  .rek-bank{font-size:12px;font-weight:800;color:var(--s800)}
  .rek-no{font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:600;color:var(--s700)}
  .rek-atas{font-size:11px;color:var(--s400)}

  /* ── USER CARDS ── */
  .user-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px}
  .user-card{background:var(--white);border:1.5px solid var(--s200);border-radius:12px;overflow:hidden;transition:all 0.12s}
  .user-card:hover{border-color:var(--or-mid);box-shadow:0 4px 12px rgba(249,115,22,0.08)}
  .uc-head{padding:14px 16px;background:linear-gradient(135deg,var(--s900),#1a0a00);position:relative;overflow:hidden}
  .uc-head::after{content:'';position:absolute;top:-20px;right:-20px;width:80px;height:80px;border-radius:50%;background:radial-gradient(circle,rgba(249,115,22,0.15),transparent)}
  .uc-avatar{width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:800;color:#fff;border:2px solid rgba(249,115,22,0.3);margin-bottom:8px}
  .uc-name{font-size:14px;font-weight:800;color:#fff;margin-bottom:2px}
  .uc-jabatan{font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:6px}
  .uc-username{font-size:11px;font-family:'JetBrains Mono',monospace;color:var(--or);background:rgba(249,115,22,0.15);padding:2px 7px;border-radius:4px;display:inline-block}
  .uc-body{padding:12px 14px}
  .uc-row{display:flex;justify-content:space-between;align-items:center;padding:4px 0;font-size:12px}
  .uc-row-label{color:var(--s400);font-weight:500}
  .uc-row-val{color:var(--s700);font-weight:600}
  .uc-actions{display:flex;gap:6px;margin-top:10px;padding-top:10px;border-top:1px solid var(--s100)}

  /* ── ACTIVITY LOG ── */
  .act-row{display:flex;gap:10px;padding:9px 0;border-bottom:1px solid var(--s100)}
  .act-row:last-child{border-bottom:none}
  .act-dot{width:8px;height:8px;border-radius:50%;background:var(--or);flex-shrink:0;margin-top:4px}
  .act-user{font-size:11px;font-family:'JetBrains Mono',monospace;font-weight:700;color:var(--or-d);min-width:52px}
  .act-text{font-size:12px;color:var(--s700);flex:1;line-height:1.4}
  .act-time{font-size:10px;color:var(--s400);white-space:nowrap;margin-top:2px}

  /* ── MODAL ── */
  .modal-overlay{position:fixed;inset:0;background:rgba(15,23,42,0.6);display:flex;align-items:center;justify-content:center;z-index:200;backdrop-filter:blur(3px)}
  .modal-card{background:var(--white);border-radius:16px;width:480px;max-height:88vh;overflow-y:auto;box-shadow:0 24px 60px rgba(0,0,0,0.25);animation:popIn 0.2s cubic-bezier(0.34,1.56,0.64,1)}
  @keyframes popIn{from{transform:scale(0.96) translateY(8px);opacity:0}to{transform:scale(1) translateY(0);opacity:1}}
  .mc-head{padding:16px 22px 12px;border-bottom:1px solid var(--s100);background:linear-gradient(135deg,var(--or-pale),var(--white))}
  .mc-body{padding:18px 22px}
  .mc-foot{padding:12px 22px;border-top:1px solid var(--s100);display:flex;gap:8px;justify-content:flex-end}

  /* ── BADGE ── */
  .badge{display:inline-flex;align-items:center;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700;white-space:nowrap}

  /* ── SAVE BAR ── */
  .save-bar{position:sticky;bottom:0;background:rgba(255,255,255,0.95);border-top:1px solid var(--or-mid);padding:12px 16px;display:flex;align-items:center;justify-content:space-between;backdrop-filter:blur(8px);margin:-14px -16px;margin-top:16px}
  .save-hint{font-size:12px;color:var(--or-d);font-weight:600;display:flex;align-items:center;gap:6px}

  /* ── BUTTONS ── */
  .btn-primary{background:linear-gradient(135deg,var(--or),var(--or-d));color:#fff;border:none;border-radius:8px;padding:9px 18px;font-size:13px;font-weight:700;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all 0.15s;box-shadow:0 2px 8px rgba(249,115,22,0.25);display:inline-flex;align-items:center;gap:6px}
  .btn-primary:hover{filter:brightness(1.05)}
  .btn-ghost{background:var(--s100);color:var(--s700);border:1px solid var(--s200);border-radius:8px;padding:9px 14px;font-size:12px;font-weight:600;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all 0.15s;display:inline-flex;align-items:center;gap:6px}
  .btn-ghost:hover{background:var(--s200)}
  .btn-red{background:#fee2e2;color:var(--red);border:1px solid #fca5a5;border-radius:8px;padding:7px 12px;font-size:11px;font-weight:700;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all 0.15s;display:inline-flex;align-items:center;gap:4px}
  .btn-red:hover{background:var(--red);color:#fff}
  .btn-sm{padding:5px 11px;font-size:11px;border-radius:7px}
  .btn-xs{padding:3px 8px;font-size:10px;border-radius:6px}

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
  useEffect(() => { const t = setTimeout(onDone, 2400); return () => clearTimeout(t); }, []);
  return <div className="toaster">{msg}</div>;
}

function Toggle({ on, onChange, label }) {
  return (
    <div className="toggle-wrap">
      <div className="toggle-label">{label}</div>
      <button className={`toggle ${on ? "on" : "off"}`} onClick={() => onChange(!on)} />
    </div>
  );
}

function NumInput({ value, onChange, min = 0, max = 9999, suffix }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div className="num-input-wrap" style={{ flex: 1 }}>
        <button className="num-btn" onClick={() => onChange(Math.max(min, value - 1))}>−</button>
        <input className="num-field" type="number" value={value} onChange={e => onChange(Math.max(min, Math.min(max, Number(e.target.value) || 0)))} />
        <button className="num-btn" onClick={() => onChange(Math.min(max, value + 1))}>+</button>
      </div>
      {suffix && <span style={{ fontSize: 12, color: "var(--s400)", whiteSpace: "nowrap" }}>{suffix}</span>}
    </div>
  );
}

// ============================================================
// PROFIL KOST — SECTIONS
// ============================================================
function SectionIdentitas({ profil, onChange, onSave }) {
  const set = (k, v) => onChange({ ...profil, [k]: v });
  return (
    <div>
      <div className="w">
        <div className="wh"><div className="wh-title">🏠 Identitas Kost</div></div>
        <div className="wb">
          <div className="field-mb">
            <label className="field-label">Nama Kost <span className="req">*</span></label>
            <input className="field-input" value={profil.nama} onChange={e => set("nama", e.target.value)} />
          </div>
          <div className="field-mb">
            <label className="field-label">Tagline</label>
            <input className="field-input" value={profil.tagline} onChange={e => set("tagline", e.target.value)} />
          </div>
          <div className="field-mb">
            <label className="field-label">Alamat Lengkap</label>
            <textarea className="field-textarea" rows={2} value={profil.alamat} onChange={e => set("alamat", e.target.value)} style={{ minHeight: 64 }} />
          </div>
          <div className="field-row">
            <div>
              <label className="field-label">Nama Owner / Direktur</label>
              <input className="field-input" value={profil.owner} onChange={e => set("owner", e.target.value)} />
              <div className="field-note">Digunakan di kop surat & tanda tangan dokumen</div>
            </div>
            <div>
              <label className="field-label">Email</label>
              <input className="field-input" type="email" value={profil.email} onChange={e => set("email", e.target.value)} />
            </div>
          </div>
          <div className="field-row">
            <div>
              <label className="field-label">Telepon / Kantor</label>
              <input className="field-input" value={profil.telepon} onChange={e => set("telepon", e.target.value)} />
            </div>
            <div>
              <label className="field-label">WhatsApp (utama)</label>
              <input className="field-input" value={profil.whatsapp} onChange={e => set("whatsapp", e.target.value)} />
            </div>
          </div>
          <div className="field-row">
            <div>
              <label className="field-label">Jam Buka</label>
              <input className="field-input" type="time" value={profil.jam_buka} onChange={e => set("jam_buka", e.target.value)} />
            </div>
            <div>
              <label className="field-label">Jam Tutup</label>
              <input className="field-input" type="time" value={profil.jam_tutup} onChange={e => set("jam_tutup", e.target.value)} />
            </div>
          </div>
          <div className="save-bar">
            <div className="save-hint">💾 Perubahan belum disimpan</div>
            <button className="btn-primary btn-sm" onClick={onSave}>Simpan Identitas</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionGPS({ profil, onChange, onSave }) {
  const set = (k, v) => onChange({ ...profil, [k]: v });
  return (
    <div>
      <div className="w">
        <div className="wh"><div className="wh-title">📍 GPS & Absensi</div></div>
        <div className="wb">
          <div style={{ background: "linear-gradient(135deg,var(--s900),#1a0a00)", borderRadius: 10, padding: "14px 16px", marginBottom: 14, display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ fontSize: 28 }}>🗺️</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 3 }}>Koordinat GPS Kost</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "var(--or)" }}>
                {profil.koordinat_lat}, {profil.koordinat_lng}
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 3 }}>
                Radius clock-in: {profil.radius_absensi}m dari titik ini
              </div>
            </div>
          </div>
          <div className="field-row">
            <div>
              <label className="field-label">Latitude</label>
              <input className="field-input" value={profil.koordinat_lat} onChange={e => set("koordinat_lat", e.target.value)} style={{ fontFamily: "'JetBrains Mono',monospace" }} placeholder="-6.9932" />
            </div>
            <div>
              <label className="field-label">Longitude</label>
              <input className="field-input" value={profil.koordinat_lng} onChange={e => set("koordinat_lng", e.target.value)} style={{ fontFamily: "'JetBrains Mono',monospace" }} placeholder="110.4203" />
            </div>
          </div>
          <div className="field-mb">
            <label className="field-label">Radius Clock-in (meter)</label>
            <NumInput value={profil.radius_absensi} onChange={v => set("radius_absensi", v)} min={100} max={2000} suffix="meter" />
            <div className="field-note">Staff harus berada dalam radius ini untuk bisa clock-in</div>
          </div>
          <div className="field-row">
            <div>
              <label className="field-label">Kapasitas Parkir Motor</label>
              <NumInput value={profil.kapasitas_motor} onChange={v => set("kapasitas_motor", v)} min={0} max={50} suffix="unit" />
            </div>
            <div>
              <label className="field-label">Kapasitas Parkir Mobil</label>
              <NumInput value={profil.kapasitas_mobil} onChange={v => set("kapasitas_mobil", v)} min={0} max={20} suffix="unit" />
            </div>
          </div>
          <div className="save-bar">
            <div className="save-hint">💾 Perubahan belum disimpan</div>
            <button className="btn-primary btn-sm" onClick={onSave}>Simpan GPS</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionFasilitas({ profil, onChange, onSave }) {
  const [newFas, setNewFas] = useState("");
  const addFas = () => {
    if (!newFas.trim()) return;
    onChange({ ...profil, fasilitas_umum: [...profil.fasilitas_umum, newFas.trim()] });
    setNewFas("");
  };
  const delFas = (idx) => onChange({ ...profil, fasilitas_umum: profil.fasilitas_umum.filter((_, i) => i !== idx) });

  return (
    <div>
      <div className="w">
        <div className="wh"><div className="wh-title">✨ Fasilitas Umum</div></div>
        <div className="wb">
          <div className="field-mb">
            <label className="field-label">Fasilitas Kost (tampil di profil & dokumen)</label>
            <div className="tag-input-wrap" onClick={e => e.currentTarget.querySelector("input")?.focus()}>
              {profil.fasilitas_umum.map((f, i) => (
                <div key={i} className="tag">
                  {f}
                  <button className="tag-del" onClick={() => delFas(i)}>×</button>
                </div>
              ))}
              <input
                className="tag-new-input"
                placeholder="Tambah fasilitas, Enter..."
                value={newFas}
                onChange={e => setNewFas(e.target.value)}
                onKeyDown={e => e.key === "Enter" && (addFas(), e.preventDefault())}
              />
            </div>
          </div>
          <button className="btn-ghost btn-sm" onClick={addFas}>+ Tambah</button>
          <div className="save-bar">
            <div className="save-hint">💾 Perubahan belum disimpan</div>
            <button className="btn-primary btn-sm" onClick={onSave}>Simpan Fasilitas</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHarga({ profil, onChange, onSave }) {
  const set = (k, v) => onChange({ ...profil, harga: { ...profil.harga, [k]: Number(v) || 0 } });
  const setAturan = (k, v) => onChange({ ...profil, aturan_sewa: { ...profil.aturan_sewa, [k]: v } });
  const h = profil.harga;
  const a = profil.aturan_sewa;

  return (
    <div>
      <div className="w">
        <div className="wh"><div className="wh-title">💰 Harga Kamar</div></div>
        <div className="wb">
          {[
            { label: "Reguler", key: "reguler", desc: "7 kamar — Kamar 2,3,5,6,8,9,11" },
            { label: "Premium",  key: "premium", desc: "4 kamar — Kamar 1,4,10,12" },
            { label: "Premium + Kulkas", key: "premium_kulkas", desc: "1 kamar — Kamar 7" },
          ].map(t => (
            <div key={t.key} className="field-mb">
              <label className="field-label">{t.label} <span style={{ fontSize: 10, color: "var(--s400)", fontWeight: 500, textTransform: "none" }}>— {t.desc}</span></label>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13, color: "var(--s400)", fontWeight: 600 }}>Rp</span>
                <input className="field-input" type="number" value={h[t.key]} onChange={e => set(t.key, e.target.value)} style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }} />
                <span style={{ fontSize: 12, color: "var(--s400)" }}>/bulan</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w">
        <div className="wh"><div className="wh-title">📋 Aturan Sewa & Denda</div></div>
        <div className="wb">
          <div className="field-row">
            <div>
              <label className="field-label">Batas Bayar (tanggal)</label>
              <NumInput value={a.batas_bayar} onChange={v => setAturan("batas_bayar", v)} min={1} max={28} suffix="setiap bulan" />
            </div>
            <div>
              <label className="field-label">Toleransi Keterlambatan</label>
              <NumInput value={a.toleransi_hari} onChange={v => setAturan("toleransi_hari", v)} min={0} max={14} suffix="hari" />
            </div>
          </div>
          <div className="field-row">
            <div>
              <label className="field-label">Denda Keterlambatan</label>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 12, color: "var(--s400)" }}>Rp</span>
                <input className="field-input" type="number" value={a.denda_keterlambatan} onChange={e => setAturan("denda_keterlambatan", Number(e.target.value))} style={{ fontFamily: "'JetBrains Mono',monospace" }} />
                <span style={{ fontSize: 12, color: "var(--s400)" }}>/hari</span>
              </div>
            </div>
            <div>
              <label className="field-label">Biaya Sewa Harian</label>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 12, color: "var(--s400)" }}>Rp</span>
                <input className="field-input" type="number" value={a.sewa_harian} onChange={e => setAturan("sewa_harian", Number(e.target.value))} style={{ fontFamily: "'JetBrains Mono',monospace" }} />
                <span style={{ fontSize: 12, color: "var(--s400)" }}>/hari</span>
              </div>
            </div>
          </div>
          <div className="field-mb">
            <label className="field-label">Deposit Jaminan</label>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 12, color: "var(--s400)" }}>Rp</span>
              <input className="field-input" type="number" value={a.deposit} onChange={e => setAturan("deposit", Number(e.target.value))} style={{ fontFamily: "'JetBrains Mono',monospace", maxWidth: 180 }} />
              <div className="field-note" style={{ margin: 0 }}>— Deposit belum diterapkan saat ini</div>
            </div>
          </div>
          <Toggle label="Aktifkan sistem denda keterlambatan" on={a.denda_aktif} onChange={v => setAturan("denda_aktif", v)} />
          <div className="save-bar">
            <div className="save-hint">💾 Perubahan belum disimpan</div>
            <button className="btn-primary btn-sm" onClick={onSave}>Simpan Harga & Aturan</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionRekening({ profil, onChange, onSave }) {
  const [showAdd, setShowAdd] = useState(false);
  const [newRek, setNewRek] = useState({ bank: "BCA", no: "", atas: "" });

  const addRek = () => {
    if (!newRek.no || !newRek.atas) return;
    const newId = Math.max(...profil.rekening.map(r => r.id)) + 1;
    onChange({ ...profil, rekening: [...profil.rekening, { ...newRek, id: newId, utama: false }] });
    setNewRek({ bank: "BCA", no: "", atas: "" });
    setShowAdd(false);
  };
  const setUtama = (id) => onChange({ ...profil, rekening: profil.rekening.map(r => ({ ...r, utama: r.id === id })) });
  const delRek = (id) => onChange({ ...profil, rekening: profil.rekening.filter(r => r.id !== id) });

  return (
    <div>
      <div className="w">
        <div className="wh">
          <div className="wh-title">🏦 Rekening Bank Kost</div>
          <button className="btn-ghost btn-sm" onClick={() => setShowAdd(v => !v)}>+ Tambah Rekening</button>
        </div>
        <div className="wb">
          {profil.rekening.map(r => (
            <div key={r.id} className={`rek-card ${r.utama ? "utama" : ""}`}>
              <div className="rek-bank-badge">{r.bank}</div>
              <div className="rek-info">
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div className="rek-bank">{r.bank}</div>
                  {r.utama && <span className="badge" style={{ color: "var(--or-d)", background: "var(--or-light)" }}>Utama</span>}
                </div>
                <div className="rek-no">{r.no}</div>
                <div className="rek-atas">a.n. {r.atas}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {!r.utama && (
                  <button className="btn-ghost btn-xs" onClick={() => setUtama(r.id)}>Set Utama</button>
                )}
                {!r.utama && (
                  <button className="btn-red btn-xs" onClick={() => delRek(r.id)}>Hapus</button>
                )}
              </div>
            </div>
          ))}

          {showAdd && (
            <div style={{ background: "var(--s50)", border: "1.5px solid var(--or-mid)", borderRadius: 10, padding: 14, marginTop: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--or-d)", marginBottom: 10 }}>Tambah Rekening Baru</div>
              <div className="field-row-3">
                <div>
                  <label className="field-label">Bank</label>
                  <select className="field-select" value={newRek.bank} onChange={e => setNewRek(f => ({ ...f, bank: e.target.value }))}>
                    {BANK_LIST.map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="field-label">No. Rekening</label>
                  <input className="field-input" value={newRek.no} onChange={e => setNewRek(f => ({ ...f, no: e.target.value }))} placeholder="No rek" style={{ fontFamily: "'JetBrains Mono',monospace" }} />
                </div>
                <div>
                  <label className="field-label">Atas Nama</label>
                  <input className="field-input" value={newRek.atas} onChange={e => setNewRek(f => ({ ...f, atas: e.target.value }))} placeholder="Atas nama" />
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn-ghost btn-sm" onClick={() => setShowAdd(false)}>Batal</button>
                <button className="btn-primary btn-sm" onClick={addRek} disabled={!newRek.no || !newRek.atas}>+ Tambah</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="w">
        <div className="wh"><div className="wh-title">🤝 Rekening Koperasi</div></div>
        <div className="wb">
          <div className="rek-card" style={{ background: "#f0fdf4", borderColor: "#86efac" }}>
            <div className="rek-bank-badge" style={{ background: "linear-gradient(135deg,var(--green),#15803d)" }}>{profil.rekening_koperasi.bank}</div>
            <div className="rek-info">
              <div className="rek-bank">{profil.rekening_koperasi.bank}</div>
              <div className="rek-no">{profil.rekening_koperasi.no}</div>
              <div className="rek-atas">a.n. {profil.rekening_koperasi.atas}</div>
            </div>
          </div>
          <div className="field-note" style={{ marginTop: 6 }}>
            Rekening ini digunakan untuk transfer cicilan pinjaman koperasi otomatis dari slip gaji
          </div>
        </div>
      </div>

      <div className="save-bar" style={{ position: "static", margin: 0 }}>
        <div className="save-hint">💾 Perubahan belum disimpan</div>
        <button className="btn-primary btn-sm" onClick={onSave}>Simpan Rekening</button>
      </div>
    </div>
  );
}

function SectionKeuangan({ profil, onChange, onSave }) {
  const k = profil.keuangan;
  const setSaku = (idx, field, val) => {
    const newSaku = k.saku.map((s, i) => i === idx ? { ...s, [field]: val } : s);
    onChange({ ...profil, keuangan: { ...k, saku: newSaku } });
  };

  return (
    <div>
      <div className="w">
        <div className="wh"><div className="wh-title">📊 Management Fee</div></div>
        <div className="wb">
          <div className="field-mb">
            <label className="field-label">Persentase Management Fee (%)</label>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <NumInput value={k.mgmt_fee_pct} onChange={v => onChange({ ...profil, keuangan: { ...k, mgmt_fee_pct: v } })} min={0} max={50} />
              <span style={{ fontSize: 13, color: "var(--s600)", fontWeight: 600 }}>% dari total pendapatan bulanan</span>
            </div>
            <div className="field-note">Dibayarkan ke manajemen setiap bulan</div>
          </div>
        </div>
      </div>

      <div className="w">
        <div className="wh"><div className="wh-title">💼 Saku Budget Planning</div></div>
        <div className="wb">
          {k.saku.map((s, i) => (
            <div key={s.kode} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--s100)" }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,var(--or),var(--or-d))", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 800, flexShrink: 0 }}>
                {s.kode}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--s800)", marginBottom: 4 }}>{s.nama}</div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {s.pct != null && (
                    <>
                      <span style={{ fontSize: 11, color: "var(--s400)" }}>% dari omzet:</span>
                      <input
                        type="number"
                        step="0.1"
                        value={s.pct}
                        onChange={e => setSaku(i, "pct", Number(e.target.value))}
                        style={{ width: 64, padding: "3px 8px", border: "1.5px solid var(--s200)", borderRadius: 6, fontSize: 13, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, outline: "none" }}
                      />
                      <span style={{ fontSize: 11, color: "var(--s400)" }}>%</span>
                    </>
                  )}
                  {s.flat != null && (
                    <>
                      <span style={{ fontSize: 11, color: "var(--s400)" }}>Flat:</span>
                      <span style={{ fontSize: 11, color: "var(--s400)" }}>Rp</span>
                      <input
                        type="number"
                        value={s.flat}
                        onChange={e => setSaku(i, "flat", Number(e.target.value))}
                        style={{ width: 90, padding: "3px 8px", border: "1.5px solid var(--s200)", borderRadius: 6, fontSize: 13, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, outline: "none" }}
                      />
                      <span style={{ fontSize: 11, color: "var(--s400)" }}>/bulan</span>
                    </>
                  )}
                  {!s.pct && !s.flat && (
                    <span style={{ fontSize: 11, color: "var(--s400)", fontStyle: "italic" }}>Otomatis dari sisa operasional</span>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div className="save-bar">
            <div className="save-hint">💾 Perubahan belum disimpan</div>
            <button className="btn-primary btn-sm" onClick={onSave}>Simpan Keuangan</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SOP & KPI THRESHOLD
// ============================================================

const SOP_INIT = {
  kpi: {
    hari_kerja_target: 22,
    lembur_target: 3,
    // Komponen bobot (total harus 100)
    bobot_absensi: 70,
    bobot_lembur: 20,
    bobot_jobdesk: 10,
    // Level threshold & insentif
    levels: [
      { id: "excellent", label: "Excellent", min: 90, max: 100, insentif: 200000, color: "#16a34a", bg: "#dcfce7" },
      { id: "good",      label: "Good",      min: 75, max: 89,  insentif: 150000, color: "#d97706", bg: "#fef3c7" },
      { id: "average",   label: "Average",   min: 60, max: 74,  insentif: 75000,  color: "#f97316", bg: "#ffedd5" },
      { id: "poor",      label: "Poor",      min: 0,  max: 59,  insentif: 0,      color: "#dc2626", bg: "#fee2e2" },
    ],
    potongan_ijin_ts: 50000,
    potongan_pinjaman_maks: 700000,
    // Nominal lembur — bisa diubah owner
    nominal_lembur_biasa: 50000,
    nominal_lembur_lebaran: 150000,
    nominal_lembur_tambahan_per_jam: 25000,
  },
  weekly_service: {
    maks_kamar_per_hari: 3,
    frekuensi_per_minggu: 1,
    checklist: [
      { id: 1, area: "Per Kamar", items: ["Sapu & pel lantai", "Bersihkan wastafel & cermin", "Cek kebersihan AC filter", "Bersihkan jendela & teralis", "Buang sampah dalam kamar", "Lap meja & furniture"] },
      { id: 2, area: "Selasar & Tangga Lt 1-3", items: ["Sapu selasar semua lantai", "Pel tangga", "Lap pegangan tangga", "Cek lampu selasar"] },
      { id: 3, area: "Kamar Mandi Lt 1, 2, 3", items: ["Sikat kloset", "Bersihkan lantai kamar mandi", "Lap wastafel & kaca", "Cek ketersediaan sabun & tisu"] },
      { id: 4, area: "Area Umum", items: ["Bersihkan parkiran", "Siram taman / tanaman", "Lap kulkas bersama", "Bersihkan dapur bersama", "Cek & kunci gerbang"] },
    ],
  },
  deep_clean: {
    checklist: [
      "Cuci karpet / keset kamar",
      "Bersihkan kipas & AC dalam (filter & kisi-kisi)",
      "Lap dinding & plafon dari debu & sarang laba-laba",
      "Bersihkan kamar mandi menyeluruh (termasuk nat keramik)",
      "Bersihkan lemari & laci dari dalam",
      "Cek & laporan kondisi furniture (retak, rusak, dst)",
      "Cek kondisi stop kontak & saklar lampu",
      "Foto kondisi kamar sebelum & sesudah",
    ],
  },
  sop_checkin: [
    "Verifikasi identitas penyewa (KTP asli)",
    "Upload foto KTP ke sistem",
    "Input data penyewa & partner di sistem",
    "Generate & cetak Surat Perjanjian",
    "Tanda tangan Surat Perjanjian 2 rangkap",
    "Terima pembayaran sewa pertama (lunas)",
    "Serahkan kunci kamar & kartu akses",
    "Update status kamar → Terisi di sistem",
    "Informasikan peraturan kost",
    "Foto kondisi kamar saat serah terima",
  ],
  sop_checkout: [
    "Reminder H-30 ke penyewa via WA",
    "H-7: kirim surat tagihan perpanjangan",
    "Konfirmasi keputusan penyewa (perpanjang / tidak)",
    "Jika tidak perpanjang: jadwalkan waktu checkout",
    "Saat checkout: periksa kondisi kamar bersama penyewa",
    "Catat kerusakan (jika ada) → buat tiket maintenance",
    "Terima pengembalian kunci",
    "Update status kamar → Deep Clean di sistem",
    "Notifikasi staff pagi untuk deep clean",
    "Setelah deep clean selesai: update → Tersedia",
  ],
  sop_keluhan_urgent: [
    "Penyewa / staff temukan masalah urgent",
    "Input tiket di sistem dengan prioritas URGENT",
    "Sistem otomatis notif WA ke PJ Operasional",
    "PJ hubungi staff untuk tindakan segera (< 30 menit)",
    "Staff tangani & dokumentasi tindakan",
    "Input biaya (jika ada) ke sistem",
    "Update status tiket → Selesai",
    "Akunting verifikasi & input ke kas",
  ],
};

function ChecklistEditor({ items, onChange, readOnly }) {
  const [newItem, setNewItem] = useState("");
  const add = () => {
    if (!newItem.trim()) return;
    onChange([...items, newItem.trim()]);
    setNewItem("");
  };
  const del = (idx) => onChange(items.filter((_, i) => i !== idx));
  const move = (idx, dir) => {
    const arr = [...items];
    const target = idx + dir;
    if (target < 0 || target >= arr.length) return;
    [arr[idx], arr[target]] = [arr[target], arr[idx]];
    onChange(arr);
  };

  return (
    <div>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: "1px solid var(--s100)" }}>
          <div style={{ width: 22, height: 22, borderRadius: 6, background: "var(--or-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "var(--or-d)", flexShrink: 0 }}>{i + 1}</div>
          <div style={{ flex: 1, fontSize: 13, color: "var(--s700)" }}>{item}</div>
          {!readOnly && (
            <div style={{ display: "flex", gap: 3 }}>
              <button onClick={() => move(i, -1)} disabled={i === 0} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--s400)", fontSize: 12, padding: "2px 4px" }}>↑</button>
              <button onClick={() => move(i, 1)} disabled={i === items.length - 1} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--s400)", fontSize: 12, padding: "2px 4px" }}>↓</button>
              <button onClick={() => del(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--red)", fontSize: 14, padding: "2px 4px" }}>×</button>
            </div>
          )}
        </div>
      ))}
      {!readOnly && (
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <input
            style={{ flex: 1, border: "1.5px solid var(--s200)", borderRadius: 8, padding: "7px 12px", fontSize: 12, fontFamily: "inherit", outline: "none" }}
            placeholder="Tambah item baru..."
            value={newItem}
            onChange={e => setNewItem(e.target.value)}
            onKeyDown={e => e.key === "Enter" && add()}
            onFocus={e => e.target.style.borderColor = "var(--or)"}
            onBlur={e => e.target.style.borderColor = "var(--s200)"}
          />
          <button className="btn-ghost btn-sm" onClick={add}>+ Tambah</button>
        </div>
      )}
    </div>
  );
}

function SectionSOP({ onSave }) {
  const [sop, setSop] = useState(SOP_INIT);
  const [activeTab, setActiveTab] = useState("kpi");
  const fmtRp = (n) => "Rp " + Number(n).toLocaleString("id-ID");

  const kpi = sop.kpi;
  const totalBobot = kpi.bobot_absensi + kpi.bobot_lembur + kpi.bobot_jobdesk;
  const bobotOk = totalBobot === 100;

  const setKpi = (k, v) => setSop(s => ({ ...s, kpi: { ...s.kpi, [k]: v } }));
  const setLevel = (idx, field, val) => {
    const levels = kpi.levels.map((l, i) => i === idx ? { ...l, [field]: Number(val) || 0 } : l);
    setSop(s => ({ ...s, kpi: { ...s.kpi, levels } }));
  };
  const setWeeklyChecklist = (areaIdx, items) => {
    const checklist = sop.weekly_service.checklist.map((c, i) => i === areaIdx ? { ...c, items } : c);
    setSop(s => ({ ...s, weekly_service: { ...s.weekly_service, checklist } }));
  };

  const TABS = [
    { id: "kpi",        icon: "🎯", label: "KPI Threshold" },
    { id: "weekly",     icon: "🧹", label: "Weekly Service" },
    { id: "deepclean",  icon: "✨", label: "Deep Clean" },
    { id: "checkin",    icon: "🔑", label: "SOP Check-in" },
    { id: "checkout",   icon: "📦", label: "SOP Check-out" },
    { id: "urgent",     icon: "🔴", label: "SOP Urgent" },
  ];

  return (
    <div>
      {/* Tab nav */}
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", background: "var(--white)", border: "1px solid var(--s200)", borderRadius: 12, padding: 4, marginBottom: 16 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            style={{ padding: "7px 12px", borderRadius: 9, border: "none", fontFamily: "inherit", fontSize: 11, fontWeight: 600, cursor: "pointer", transition: "all 0.12s", display: "flex", alignItems: "center", gap: 5,
              background: activeTab === t.id ? "linear-gradient(135deg,var(--or),var(--or-d))" : "transparent",
              color: activeTab === t.id ? "#fff" : "var(--s400)" }}>
            <span>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {/* ── KPI THRESHOLD ── */}
      {activeTab === "kpi" && (
        <div>
          {/* Info banner */}
          <div style={{ background: "linear-gradient(135deg,var(--s900),#1a0a00)", borderRadius: 12, padding: "16px 18px", marginBottom: 16, display: "flex", gap: 14, alignItems: "flex-start" }}>
            <span style={{ fontSize: 24, flexShrink: 0 }}>🎯</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", marginBottom: 4 }}>Formula KPI</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
                KPI Score = <span style={{ color: "var(--or)", fontWeight: 700 }}>(Masuk ÷ Target Hari) × Bobot Absensi</span> + <span style={{ color: "#60a5fa", fontWeight: 700 }}>(Lembur ÷ Target Lembur) × Bobot Lembur</span> + <span style={{ color: "#34d399", fontWeight: 700 }}>Bobot Jobdesk</span>
              </div>
              <div style={{ marginTop: 8, fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
                Contoh: Masuk 20hr, Lembur 2 shift, Jobdesk 90% → KPI = (20/22×70) + (2/3×20) + (90%×10) = {Math.round(20/22*70 + 2/3*20 + 0.9*10)}
              </div>
            </div>
          </div>

          {/* Target & Bobot */}
          <div className="w">
            <div className="wh"><div className="wh-title">⚙️ Parameter Dasar</div></div>
            <div className="wb">
              <div className="field-row">
                <div>
                  <label className="field-label">Target Hari Kerja / Bulan</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div className="num-input-wrap" style={{ flex: 1 }}>
                      <button className="num-btn" onClick={() => setKpi("hari_kerja_target", Math.max(15, kpi.hari_kerja_target - 1))}>−</button>
                      <input className="num-field" type="number" value={kpi.hari_kerja_target} onChange={e => setKpi("hari_kerja_target", Number(e.target.value) || 22)} />
                      <button className="num-btn" onClick={() => setKpi("hari_kerja_target", Math.min(31, kpi.hari_kerja_target + 1))}>+</button>
                    </div>
                    <span style={{ fontSize: 12, color: "var(--s400)" }}>hari/bulan</span>
                  </div>
                  <div className="field-note">Hari kerja efektif (exclude libur mingguan)</div>
                </div>
                <div>
                  <label className="field-label">Target Lembur / Bulan</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div className="num-input-wrap" style={{ flex: 1 }}>
                      <button className="num-btn" onClick={() => setKpi("lembur_target", Math.max(0, kpi.lembur_target - 1))}>−</button>
                      <input className="num-field" type="number" value={kpi.lembur_target} onChange={e => setKpi("lembur_target", Number(e.target.value) || 0)} />
                      <button className="num-btn" onClick={() => setKpi("lembur_target", kpi.lembur_target + 1)}>+</button>
                    </div>
                    <span style={{ fontSize: 12, color: "var(--s400)" }}>shift/bulan</span>
                  </div>
                  <div className="field-note">Digunakan sebagai pembagi komponen lembur</div>
                </div>
              </div>

              {/* Bobot Komponen */}
              <div style={{ marginTop: 4 }}>
                <div className="field-label" style={{ marginBottom: 10 }}>
                  Bobot Komponen KPI
                  <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 700, color: bobotOk ? "var(--green)" : "var(--red)", background: bobotOk ? "#dcfce7" : "#fee2e2", padding: "2px 8px", borderRadius: 10 }}>
                    {totalBobot}/100 {bobotOk ? "✓" : "⚠ harus = 100"}
                  </span>
                </div>
                {[
                  { key: "bobot_absensi", label: "Absensi", icon: "✅", color: "#16a34a", desc: "Kehadiran & ketepatan masuk kerja" },
                  { key: "bobot_lembur",  label: "Lembur",  icon: "🌙", color: "#1d4ed8", desc: "Kesediaan lembur melebihi jadwal" },
                  { key: "bobot_jobdesk", label: "Jobdesk", icon: "🧹", color: "#f97316", desc: "Completion rate checklist weekly service" },
                ].map(b => (
                  <div key={b.key} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10, background: "var(--s50)", marginBottom: 8, border: "1px solid var(--s200)" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: b.color + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{b.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--s800)" }}>{b.label}</div>
                      <div style={{ fontSize: 11, color: "var(--s400)" }}>{b.desc}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div className="num-input-wrap" style={{ width: 120 }}>
                        <button className="num-btn" onClick={() => setKpi(b.key, Math.max(0, kpi[b.key] - 5))}>−</button>
                        <input className="num-field" type="number" value={kpi[b.key]} onChange={e => setKpi(b.key, Number(e.target.value) || 0)} />
                        <button className="num-btn" onClick={() => setKpi(b.key, Math.min(100, kpi[b.key] + 5))}>+</button>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: b.color, minWidth: 28 }}>poin</span>
                    </div>
                    {/* Progress bar visual */}
                    <div style={{ width: 80, height: 6, background: "var(--s200)", borderRadius: 3, overflow: "hidden", flexShrink: 0 }}>
                      <div style={{ width: kpi[b.key] + "%", height: "100%", background: b.color, borderRadius: 3, transition: "width 0.3s" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Level Threshold */}
          <div className="w">
            <div className="wh">
              <div className="wh-title">🏅 Level & Nominal Insentif</div>
              <span style={{ fontSize: 11, color: "var(--s400)" }}>Klik angka untuk edit langsung</span>
            </div>
            <div className="wb" style={{ padding: 0 }}>
              {/* Table header */}
              <div style={{ display: "grid", gridTemplateColumns: "110px 80px 80px 1fr 1fr", gap: 0, background: "var(--s50)", borderBottom: "1px solid var(--s200)", padding: "8px 16px" }}>
                {["Level", "Min", "Max", "Insentif", "Preview Kondisi"].map(h => (
                  <div key={h} style={{ fontSize: 10, fontWeight: 700, color: "var(--s400)", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</div>
                ))}
              </div>
              {kpi.levels.map((lv, i) => (
                <div key={lv.id} style={{ display: "grid", gridTemplateColumns: "110px 80px 80px 1fr 1fr", gap: 0, padding: "10px 16px", borderBottom: i < kpi.levels.length - 1 ? "1px solid var(--s100)" : "none", alignItems: "center" }}>
                  <div>
                    <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, color: lv.color, background: lv.bg }}>{lv.label}</span>
                  </div>
                  <div>
                    <input
                      type="number"
                      value={lv.min}
                      onChange={e => setLevel(i, "min", e.target.value)}
                      style={{ width: 56, padding: "4px 8px", border: "1.5px solid var(--s200)", borderRadius: 7, fontSize: 13, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, outline: "none", color: lv.color }}
                      onFocus={e => e.target.style.borderColor = lv.color}
                      onBlur={e => e.target.style.borderColor = "var(--s200)"}
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      value={lv.max}
                      onChange={e => setLevel(i, "max", e.target.value)}
                      style={{ width: 56, padding: "4px 8px", border: "1.5px solid var(--s200)", borderRadius: 7, fontSize: 13, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, outline: "none", color: lv.color }}
                      onFocus={e => e.target.style.borderColor = lv.color}
                      onBlur={e => e.target.style.borderColor = "var(--s200)"}
                    />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 12, color: "var(--s400)" }}>Rp</span>
                    <input
                      type="number"
                      value={lv.insentif}
                      onChange={e => setLevel(i, "insentif", e.target.value)}
                      step="25000"
                      style={{ width: 110, padding: "4px 8px", border: "1.5px solid var(--s200)", borderRadius: 7, fontSize: 13, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, outline: "none", color: lv.color }}
                      onFocus={e => e.target.style.borderColor = lv.color}
                      onBlur={e => e.target.style.borderColor = "var(--s200)"}
                    />
                  </div>
                  <div style={{ fontSize: 11, color: "var(--s500)" }}>
                    {lv.insentif > 0
                      ? <span>Score {lv.min}–{lv.max} → dapat <b style={{ color: lv.color }}>{fmtRp(lv.insentif)}</b></span>
                      : <span style={{ color: "var(--s400)", fontStyle: "italic" }}>Tidak dapat insentif</span>}
                  </div>
                </div>
              ))}
              {/* Total row */}
              <div style={{ padding: "10px 16px", background: "var(--s50)", borderTop: "1px solid var(--s200)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--s600)" }}>Insentif tertinggi (Excellent):</span>
                <span style={{ fontSize: 15, fontWeight: 800, color: "var(--or-d)", fontFamily: "'JetBrains Mono',monospace" }}>{fmtRp(kpi.levels[0].insentif)}</span>
              </div>
            </div>
          </div>

          {/* Potongan */}
          <div className="w">
            <div className="wh"><div className="wh-title">📤 Potongan Otomatis</div></div>
            <div className="wb">
              <div className="field-row">
                <div>
                  <label className="field-label">Potongan Ijin Tidak Sah / hari</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 12, color: "var(--s400)" }}>Rp</span>
                    <input className="field-input" type="number" step="10000" value={kpi.potongan_ijin_ts} onChange={e => setKpi("potongan_ijin_ts", Number(e.target.value))} style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }} />
                  </div>
                  <div className="field-note">Berlaku jika tidak ada kabar atau izin melebihi 3 hari</div>
                </div>
                <div>
                  <label className="field-label">Maksimal Pinjaman Koperasi</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 12, color: "var(--s400)" }}>Rp</span>
                    <input className="field-input" type="number" step="100000" value={kpi.potongan_pinjaman_maks} onChange={e => setKpi("potongan_pinjaman_maks", Number(e.target.value))} style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }} />
                  </div>
                  <div className="field-note">Dipotong sekali dari slip gaji, lalu transfer ke koperasi</div>
                </div>
              </div>
            </div>
          </div>

          {/* Simulator KPI */}
          <div className="w">
            <div className="wh"><div className="wh-title">🧮 Simulator KPI Real-time</div>
              <span style={{ fontSize: 11, color: "var(--s400)" }}>Uji formula sebelum disimpan</span>
            </div>
            <div className="wb">
              <KPISimulator kpi={kpi} fmtRp={fmtRp} />
            </div>
          </div>

          {/* Nominal Lembur */}
          <div className="w">
            <div className="wh"><div className="wh-title">🔥 Nominal Lembur</div>
              <span style={{ fontSize: 11, color: "var(--s400)" }}>Berlaku untuk semua staff</span>
            </div>
            <div className="wb">
              {/* Banner 3x lebaran */}
              <div style={{ background: "linear-gradient(135deg,#fff7ed,#ffedd5)", border: "1px solid #fed7aa", borderRadius: 9, padding: "10px 14px", marginBottom: 14, display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 20 }}>🕌</span>
                <div style={{ fontSize: 12, color: "#9a3412", lineHeight: 1.5 }}>
                  <b>Lembur Lebaran = {Math.round(kpi.nominal_lembur_lebaran / kpi.nominal_lembur_biasa)}× lembur biasa.</b> Berlaku untuk Idul Fitri. Tanggal ditentukan owner, diinput manual PJ di modul Absensi.
                </div>
              </div>
              <div className="field-row">
                <div>
                  <label className="field-label">Lembur Biasa / shift</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 12, color: "var(--s400)" }}>Rp</span>
                    <input className="field-input" type="number" step="10000" value={kpi.nominal_lembur_biasa}
                      onChange={e => setKpi("nominal_lembur_biasa", Number(e.target.value))}
                      style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }} />
                  </div>
                  <div className="field-note">Berlaku untuk kode: L, P/L, S/L</div>
                </div>
                <div>
                  <label className="field-label">Lembur Lebaran / shift</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 12, color: "var(--s400)" }}>Rp</span>
                    <input className="field-input" type="number" step="10000" value={kpi.nominal_lembur_lebaran}
                      onChange={e => setKpi("nominal_lembur_lebaran", Number(e.target.value))}
                      style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, color: "#ea580c" }} />
                  </div>
                  <div className="field-note">Berlaku kode LL — otomatis {kpi.nominal_lembur_biasa > 0 ? (kpi.nominal_lembur_lebaran / kpi.nominal_lembur_biasa).toFixed(1) : "—"}× lembur biasa</div>
                </div>
              </div>
              <div>
                <label className="field-label">Acuan Lembur Tambahan / jam</label>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, color: "var(--s400)" }}>Rp</span>
                  <input className="field-input" type="number" step="5000" value={kpi.nominal_lembur_tambahan_per_jam}
                    onChange={e => setKpi("nominal_lembur_tambahan_per_jam", Number(e.target.value))}
                    style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, color: "#c026d3" }} />
                  <span style={{ fontSize: 12, color: "var(--s400)" }}>/ jam</span>
                </div>
                <div className="field-note">Hanya sebagai auto-suggest — PJ tetap bisa ubah nominal bebas saat input lembur tambahan</div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
            <button className="btn-primary" onClick={onSave}>💾 Simpan Pengaturan KPI</button>
          </div>
        </div>
      )}

      {/* ── WEEKLY SERVICE CHECKLIST ── */}
      {activeTab === "weekly" && (
        <div>
          <div style={{ background: "var(--or-pale)", border: "1px solid var(--or-mid)", borderRadius: 10, padding: "10px 14px", marginBottom: 14, display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ fontSize: 18 }}>ℹ️</span>
            <div style={{ fontSize: 12, color: "var(--s700)" }}>
              Checklist ini digunakan sebagai panduan dan <b>form completion</b> di modul Weekly Service. Tambah, hapus, atau ubah urutan sesuai kebutuhan.
            </div>
          </div>
          {sop.weekly_service.checklist.map((area, aIdx) => (
            <div key={area.id} className="w">
              <div className="wh">
                <div className="wh-title">🧹 Area: {area.area}</div>
                <span style={{ fontSize: 11, color: "var(--s400)" }}>{area.items.length} item</span>
              </div>
              <div className="wb">
                <ChecklistEditor items={area.items} onChange={items => setWeeklyChecklist(aIdx, items)} />
              </div>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button className="btn-primary" onClick={onSave}>💾 Simpan Checklist Weekly Service</button>
          </div>
        </div>
      )}

      {/* ── DEEP CLEAN ── */}
      {activeTab === "deepclean" && (
        <div>
          <div className="w">
            <div className="wh">
              <div className="wh-title">✨ Checklist Deep Clean</div>
              <span style={{ fontSize: 11, color: "var(--s400)" }}>Dilakukan setelah check-out</span>
            </div>
            <div className="wb">
              <ChecklistEditor
                items={sop.deep_clean.checklist}
                onChange={items => setSop(s => ({ ...s, deep_clean: { ...s.deep_clean, checklist: items } }))}
              />
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button className="btn-primary" onClick={onSave}>💾 Simpan Checklist Deep Clean</button>
          </div>
        </div>
      )}

      {/* ── SOP CHECKIN ── */}
      {activeTab === "checkin" && (
        <div className="w">
          <div className="wh">
            <div className="wh-title">🔑 SOP Check-in Penyewa</div>
            <button className="btn-ghost btn-sm" onClick={() => alert("Print SOP")}>🖨️ Print</button>
          </div>
          <div className="wb">
            <ChecklistEditor items={sop.sop_checkin} onChange={items => setSop(s => ({ ...s, sop_checkin: items }))} />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
              <button className="btn-primary" onClick={onSave}>💾 Simpan SOP Check-in</button>
            </div>
          </div>
        </div>
      )}

      {/* ── SOP CHECKOUT ── */}
      {activeTab === "checkout" && (
        <div className="w">
          <div className="wh">
            <div className="wh-title">📦 SOP Check-out Penyewa</div>
            <button className="btn-ghost btn-sm" onClick={() => alert("Print SOP")}>🖨️ Print</button>
          </div>
          <div className="wb">
            <ChecklistEditor items={sop.sop_checkout} onChange={items => setSop(s => ({ ...s, sop_checkout: items }))} />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
              <button className="btn-primary" onClick={onSave}>💾 Simpan SOP Check-out</button>
            </div>
          </div>
        </div>
      )}

      {/* ── SOP URGENT ── */}
      {activeTab === "urgent" && (
        <div className="w">
          <div className="wh">
            <div className="wh-title">🔴 SOP Keluhan Urgent</div>
            <button className="btn-ghost btn-sm" onClick={() => alert("Print SOP")}>🖨️ Print</button>
          </div>
          <div className="wb">
            <ChecklistEditor items={sop.sop_keluhan_urgent} onChange={items => setSop(s => ({ ...s, sop_keluhan_urgent: items }))} />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
              <button className="btn-primary" onClick={onSave}>💾 Simpan SOP Urgent</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── KPI Simulator (komponen terpisah supaya rapi) ──
function KPISimulator({ kpi, fmtRp }) {
  const [sim, setSim] = useState({ masuk: 20, lembur: 2, jobdesk: 85 });
  const setSim_ = (k, v) => setSim(s => ({ ...s, [k]: Number(v) }));

  const scoreAbsensi = Math.min(Math.round((sim.masuk / kpi.hari_kerja_target) * kpi.bobot_absensi), kpi.bobot_absensi);
  const scoreLembur  = kpi.lembur_target > 0 ? Math.min(Math.round((sim.lembur / kpi.lembur_target) * kpi.bobot_lembur), kpi.bobot_lembur) : 0;
  const scoreJobdesk = Math.min(Math.round((sim.jobdesk / 100) * kpi.bobot_jobdesk), kpi.bobot_jobdesk);
  const total = scoreAbsensi + scoreLembur + scoreJobdesk;
  const level = kpi.levels.find(l => total >= l.min && total <= l.max) || kpi.levels[kpi.levels.length - 1];

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
        {[
          { label: "Hari Masuk", key: "masuk", max: 31, unit: "hari", color: "#16a34a" },
          { label: "Shift Lembur", key: "lembur", max: 15, unit: "shift", color: "#1d4ed8" },
          { label: "Jobdesk %", key: "jobdesk", max: 100, unit: "%", color: "#f97316" },
        ].map(f => (
          <div key={f.key}>
            <label style={{ fontSize: 10, fontWeight: 700, color: "var(--s400)", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>{f.label}</label>
            <div className="num-input-wrap">
              <button className="num-btn" onClick={() => setSim_(f.key, Math.max(0, sim[f.key] - 1))}>−</button>
              <input className="num-field" type="number" value={sim[f.key]} onChange={e => setSim_(f.key, e.target.value)} style={{ color: f.color }} />
              <button className="num-btn" onClick={() => setSim_(f.key, Math.min(f.max, sim[f.key] + 1))}>+</button>
            </div>
            <div style={{ marginTop: 6, fontSize: 11, color: f.color, fontWeight: 700, textAlign: "center" }}>
              +{f.key === "masuk" ? scoreAbsensi : f.key === "lembur" ? scoreLembur : scoreJobdesk} poin
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: "linear-gradient(135deg,var(--s900),#1a0a00)", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: 4 }}>KPI Score</div>
          <div style={{ fontSize: 40, fontWeight: 800, color: level.color, fontFamily: "'JetBrains Mono',monospace", lineHeight: 1 }}>{total}</div>
          <div style={{ height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 2, marginTop: 8, overflow: "hidden" }}>
            <div style={{ width: total + "%", height: "100%", background: level.color, borderRadius: 2, transition: "width 0.3s" }} />
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, color: level.color, background: level.color + "20", marginBottom: 8 }}>
            {level.label}
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>Breakdown:</div>
          <div style={{ display: "flex", gap: 12 }}>
            {[
              { label: "Absensi", val: scoreAbsensi, max: kpi.bobot_absensi, color: "#16a34a" },
              { label: "Lembur",  val: scoreLembur,  max: kpi.bobot_lembur,  color: "#60a5fa" },
              { label: "Jobdesk", val: scoreJobdesk, max: kpi.bobot_jobdesk, color: "#f97316" },
            ].map(b => (
              <div key={b.label} style={{ fontSize: 11, color: b.color, fontWeight: 700 }}>
                {b.label}: {b.val}/{b.max}
              </div>
            ))}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: 4 }}>Insentif</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: level.insentif > 0 ? "var(--or)" : "var(--s400)", fontFamily: "'JetBrains Mono',monospace" }}>
            {fmtRp(level.insentif)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PROFIL KOST MODULE
// ============================================================
function ProfilKost({ onToast }) {
  const [profil, setProfil] = useState(PROFIL_KOST_INIT);
  const [activeSection, setActiveSection] = useState("identitas");

  const SECTIONS = [
    { id: "identitas", icon: "🏠", label: "Identitas" },
    { id: "gps",       icon: "📍", label: "GPS & Absensi" },
    { id: "fasilitas", icon: "✨", label: "Fasilitas" },
    { id: "harga",     icon: "💰", label: "Harga & Aturan" },
    { id: "rekening",  icon: "🏦", label: "Rekening" },
    { id: "keuangan",  icon: "📊", label: "Keuangan" },
    { id: "sop",       icon: "📜", label: "SOP & KPI" },
  ];

  const handleSave = () => onToast("✓ Pengaturan profil berhasil disimpan");

  return (
    <div className="layout" style={{ alignItems: "start" }}>
      <div className="sec-nav">
        {SECTIONS.map(s => (
          <button key={s.id} className={`sec-btn ${activeSection === s.id ? "active" : ""}`} onClick={() => setActiveSection(s.id)}>
            <span>{s.icon}</span>{s.label}
          </button>
        ))}
      </div>
      <div className="main-area">
        {activeSection === "identitas" && <SectionIdentitas profil={profil} onChange={setProfil} onSave={handleSave} />}
        {activeSection === "gps"       && <SectionGPS       profil={profil} onChange={setProfil} onSave={handleSave} />}
        {activeSection === "fasilitas" && <SectionFasilitas profil={profil} onChange={setProfil} onSave={handleSave} />}
        {activeSection === "harga"     && <SectionHarga     profil={profil} onChange={setProfil} onSave={handleSave} />}
        {activeSection === "rekening"  && <SectionRekening  profil={profil} onChange={setProfil} onSave={handleSave} />}
        {activeSection === "keuangan"  && <SectionKeuangan  profil={profil} onChange={setProfil} onSave={handleSave} />}
        {activeSection === "sop"       && <SectionSOP onSave={handleSave} />}
      </div>
    </div>
  );
}

// ============================================================
// FORM USER MODAL
// ============================================================
function FormUser({ user, onSave, onClose }) {
  const isEdit = !!user;
  const [form, setForm] = useState(user || { username: "", nama: "", jabatan: "", role: "staff", aktif: true });
  const [showPwd, setShowPwd] = useState(false);
  const [pwd, setPwd] = useState("");
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="mc-head">
          <div style={{ fontSize: 15, fontWeight: 800, color: "var(--s900)", marginBottom: 2 }}>
            {isEdit ? "✏️ Edit User" : "➕ Tambah User Baru"}
          </div>
          <div style={{ fontSize: 12, color: "var(--s400)" }}>Kelola akses sistem Senyum Inn</div>
        </div>
        <div className="mc-body">
          <div className="field-row field-mb">
            <div>
              <label className="field-label">Username <span className="req">*</span></label>
              <input className="field-input" placeholder="username" value={form.username} onChange={e => set("username", e.target.value)} style={{ fontFamily: "'JetBrains Mono',monospace" }} />
            </div>
            <div>
              <label className="field-label">Role Akses</label>
              <select className="field-select" value={form.role} onChange={e => set("role", e.target.value)}>
                <option value="admin">Admin / Owner</option>
                <option value="staff">Staff</option>
              </select>
            </div>
          </div>
          <div className="field-mb">
            <label className="field-label">Nama Lengkap <span className="req">*</span></label>
            <input className="field-input" placeholder="Nama sesuai KTP" value={form.nama} onChange={e => set("nama", e.target.value)} />
          </div>
          <div className="field-mb">
            <label className="field-label">Jabatan</label>
            <input className="field-input" placeholder="Misal: Clean & Service" value={form.jabatan} onChange={e => set("jabatan", e.target.value)} />
          </div>

          <div style={{ borderTop: "1px solid var(--s100)", paddingTop: 14, marginTop: 4 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--s400)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>Password</div>
            {isEdit && (
              <Toggle label="Reset password" on={showPwd} onChange={setShowPwd} />
            )}
            {(!isEdit || showPwd) && (
              <div className="field-mb">
                <label className="field-label">{isEdit ? "Password Baru" : "Password"} <span className="req">*</span></label>
                <input className="field-input" type="password" placeholder="Minimal 6 karakter" value={pwd} onChange={e => setPwd(e.target.value)} />
              </div>
            )}
          </div>

          <Toggle label="Status Aktif" on={form.aktif} onChange={v => set("aktif", v)} />

          <div style={{ background: "var(--s50)", borderRadius: 8, padding: "10px 12px", marginTop: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--s400)", marginBottom: 6 }}>Hak Akses</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {(form.role === "admin"
                ? ["Dashboard", "Monitor Kamar", "Keluhan & Tiket", "Weekly Service", "Absensi", "Data Penyewa", "Check-in/out", "Tagihan", "Kas & Jurnal", "Laporan", "HR", "Pengaturan"]
                : ["Dashboard", "Monitor Kamar", "Keluhan & Tiket", "Weekly Service", "Absensi", "Data Penyewa", "Check-in/out"]
              ).map(m => (
                <span key={m} className="badge" style={{ color: "var(--green)", background: "#dcfce7" }}>✓ {m}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="mc-foot">
          <button className="btn-ghost" onClick={onClose}>Batal</button>
          <button className="btn-primary" onClick={() => onSave({ ...form, pwd })} disabled={!form.username || !form.nama}>
            {isEdit ? "✓ Simpan" : "✓ Tambah User"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MANAJEMEN USER MODULE
// ============================================================
function ManajemenUser({ onToast }) {
  const [users, setUsers] = useState(USERS_INIT);
  const [log] = useState(ACTIVITY_LOG);
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [activeTab, setActiveTab] = useState("users");

  const handleSave = (form) => {
    if (editUser) {
      setUsers(prev => prev.map(u => u.id === form.id ? { ...u, ...form } : u));
      onToast(`✓ User ${form.username} diperbarui`);
    } else {
      const newId = Math.max(...users.map(u => u.id)) + 1;
      setUsers(prev => [...prev, { ...form, id: newId, lastLogin: "-", created: "2026-02-26" }]);
      onToast(`✓ User ${form.username} berhasil ditambahkan`);
    }
    setShowForm(false);
    setEditUser(null);
  };

  const toggleAktif = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, aktif: !u.aktif } : u));
    const u = users.find(u => u.id === id);
    onToast(u?.aktif ? `🚫 ${u.username} dinonaktifkan` : `✅ ${u.username} diaktifkan`);
  };

  const resetPwd = (u) => onToast(`🔑 Link reset password dikirim ke ${u.username}`);

  return (
    <div>
      <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
        {[{ id: "users", label: "👤 Daftar User" }, { id: "log", label: "📋 Log Aktivitas" }].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            style={{ padding: "7px 16px", borderRadius: 20, border: `1.5px solid ${activeTab === t.id ? "var(--or)" : "var(--s200)"}`, background: activeTab === t.id ? "var(--or)" : "var(--white)", color: activeTab === t.id ? "#fff" : "var(--s600)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            {t.label}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button className="btn-primary btn-sm" onClick={() => { setEditUser(null); setShowForm(true); }}>+ Tambah User</button>
      </div>

      {activeTab === "users" && (
        <div className="user-grid">
          {users.map((u, i) => {
            const roleCfg = ROLE_CFG[u.role];
            return (
              <div key={u.id} className="user-card">
                <div className="uc-head">
                  <div className="uc-avatar" style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>
                    {getInitials(u.nama)}
                  </div>
                  <div className="uc-name">{u.nama}</div>
                  <div className="uc-jabatan">{u.jabatan}</div>
                  <div style={{ display: "flex", gap: 6, marginTop: 6, alignItems: "center" }}>
                    <div className="uc-username">@{u.username}</div>
                    <span className="badge" style={{ color: roleCfg.color, background: roleCfg.bg + "33" }}>{roleCfg.label}</span>
                    {!u.aktif && <span className="badge" style={{ color: "var(--s400)", background: "var(--s100)" }}>Nonaktif</span>}
                  </div>
                </div>
                <div className="uc-body">
                  <div className="uc-row">
                    <span className="uc-row-label">Login terakhir</span>
                    <span className="uc-row-val" style={{ fontSize: 11, fontFamily: "'JetBrains Mono',monospace" }}>{u.lastLogin}</span>
                  </div>
                  <div className="uc-row">
                    <span className="uc-row-label">Bergabung</span>
                    <span className="uc-row-val">{u.created}</span>
                  </div>
                  <div className="uc-actions">
                    <button className="btn-ghost btn-xs" onClick={() => { setEditUser(u); setShowForm(true); }}>✏️ Edit</button>
                    <button className="btn-ghost btn-xs" onClick={() => resetPwd(u)}>🔑 Reset Pwd</button>
                    <button className={`btn-xs ${u.aktif ? "btn-red" : "btn-ghost"}`} onClick={() => toggleAktif(u.id)}>
                      {u.aktif ? "🚫 Non" : "✅ Aktifkan"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "log" && (
        <div className="w">
          <div className="wh">
            <div className="wh-title">📋 Log Aktivitas User</div>
            <span style={{ fontSize: 11, color: "var(--s400)" }}>Hanya Owner & Admin yang dapat melihat</span>
          </div>
          <div className="wb" style={{ padding: "8px 16px" }}>
            {log.map(l => (
              <div key={l.id} className="act-row">
                <div className="act-dot" />
                <div className="act-user">@{l.user}</div>
                <div className="act-text">{l.aksi}</div>
                <div className="act-time">{l.waktu}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showForm && (
        <FormUser user={editUser} onSave={handleSave} onClose={() => { setShowForm(false); setEditUser(null); }} />
      )}
    </div>
  );
}

// ============================================================
// MAIN MODULE
// ============================================================
export default function Pengaturan({ userRole = "admin" }) {
  const [activeMod, setActiveMod] = useState("profil");
  const [toast, setToast] = useState(null);

  const MODS = [
    { id: "profil", icon: "⚙️", label: "Profil Kost" },
    { id: "users",  icon: "👤", label: "Manajemen User" },
  ];

  return (
    <div className="fade-up">
      <StyleInjector />

      <div className="mod-nav">
        {MODS.map(m => (
          <button key={m.id} className={`mod-btn ${activeMod === m.id ? "active" : ""}`} onClick={() => setActiveMod(m.id)}>
            <span>{m.icon}</span>{m.label}
          </button>
        ))}
      </div>

      {activeMod === "profil" && <ProfilKost onToast={setToast} />}
      {activeMod === "users"  && <ManajemenUser onToast={setToast} />}

      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
