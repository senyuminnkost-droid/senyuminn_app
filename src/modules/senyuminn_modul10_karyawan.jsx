import { useState, useEffect } from "react";

// ============================================================
// MOCK DATA
// ============================================================
const KARYAWAN_DATA = [
  {
    id: "EMP001",
    nama: "Muh. Krisna Mukti",
    nik: "3374012501990001",
    tglLahir: "1999-01-25",
    jenisKelamin: "Laki-laki",
    agama: "Islam",
    statusNikah: "Belum Menikah",
    noHP: "081234567801",
    noDarurat: "081234567800",
    namaDarurat: "Siti Mukti (Ibu)",
    alamat: "Jl. Melati No. 12, Semarang",
    jabatan: "Clean & Service",
    role: "staff",
    shift: "Pagi",
    tglMulai: "2025-01-01",
    rekening: { bank: "BCA", no: "1234567801", atas: "Muh. Krisna Mukti" },
    foto: null,
    statusAktif: true,
    catatan: "Rajin dan disiplin. Handal di area kebersihan.",
    gajiPokok: 1800000,
    kontrak: {
      noSPK: "SPKJ.SIEK.2025.01.01",
      tglMulai: "2025-01-01",
      tglSelesai: "2026-01-01",
      durasi: 12,
      status: "habis",
    },
    cutiSisa: 1,
    cutiDipakai: 2,
  },
  {
    id: "EMP002",
    nama: "Gurit Yudho Anggoro",
    nik: "3374021503950002",
    tglLahir: "1995-03-15",
    jenisKelamin: "Laki-laki",
    agama: "Islam",
    statusNikah: "Menikah",
    noHP: "081234567802",
    noDarurat: "081234567803",
    namaDarurat: "Dewi Anggoro (Istri)",
    alamat: "Jl. Mawar No. 5, Semarang",
    jabatan: "Staf Penjaga Malam",
    role: "staff",
    shift: "Sore/Malam",
    tglMulai: "2024-06-01",
    rekening: { bank: "BNI", no: "9876543802", atas: "Gurit Yudho Anggoro" },
    foto: null,
    statusAktif: true,
    catatan: "Bertanggung jawab dan sigap. Baik dalam komunikasi dengan penyewa.",
    gajiPokok: 2100000,
    kontrak: {
      noSPK: "SPKJ.SIEK.2024.06.01",
      tglMulai: "2024-06-01",
      tglSelesai: "2025-06-01",
      durasi: 12,
      status: "diperpanjang",
      perpanjangan: {
        noSPK: "SPKJ.SIEK.2025.06.01",
        tglMulai: "2025-06-01",
        tglSelesai: "2026-06-01",
        status: "aktif",
      },
    },
    cutiSisa: 3,
    cutiDipakai: 0,
  },
  {
    id: "EMP003",
    nama: "Rina Manajemen",
    nik: "3374031204880003",
    tglLahir: "1988-04-12",
    jenisKelamin: "Perempuan",
    agama: "Kristen",
    statusNikah: "Menikah",
    noHP: "081234567804",
    noDarurat: "081234567805",
    namaDarurat: "Budi Santoso (Suami)",
    alamat: "Jl. Anggrek No. 8, Semarang",
    jabatan: "Super Admin / Manajemen",
    role: "admin",
    shift: "Pagi",
    tglMulai: "2020-01-01",
    rekening: { bank: "Mandiri", no: "1122334455", atas: "Rina Manajemen" },
    foto: null,
    statusAktif: true,
    catatan: "Senior staff. Memegang kendali operasional harian.",
    gajiPokok: 3500000,
    kontrak: {
      noSPK: "SPKJ.SIEK.2026.01.01",
      tglMulai: "2026-01-01",
      tglSelesai: "2027-01-01",
      durasi: 12,
      status: "aktif",
    },
    cutiSisa: 3,
    cutiDipakai: 0,
  },
];

const AGAMA_LIST    = ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu"];
const NIKAH_LIST    = ["Belum Menikah", "Menikah", "Cerai"];
const SHIFT_LIST    = ["Pagi", "Sore/Malam", "Fleksibel"];
const JABATAN_LIST  = ["Clean & Service", "Staf Penjaga Malam", "Super Admin / Manajemen", "PJ Operasional", "Marketing & Admin"];
const BANK_LIST     = ["BCA", "BNI", "Mandiri", "BRI", "BSI"];
const ROLE_LIST     = ["staff", "admin"];

const BLN = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Ags","Sep","Okt","Nov","Des"];
const fmtTgl  = (s) => { if (!s) return "-"; const d = new Date(s); return `${d.getDate()} ${BLN[d.getMonth()]} ${d.getFullYear()}`; };
const fmtRp   = (n) => n != null ? "Rp " + Number(n).toLocaleString("id-ID") : "-";
const hariSisa= (s) => { if (!s) return null; const d = Math.ceil((new Date(s) - new Date("2026-02-26")) / 86400000); return d; };
const getAge  = (s) => { if (!s) return "-"; const d = new Date(s); const now = new Date("2026-02-26"); return Math.floor((now - d) / (365.25 * 86400000)) + " th"; };
const getInitials = (n) => n.split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase();

const AVATAR_COLORS = [
  "linear-gradient(135deg,#f97316,#ea580c)",
  "linear-gradient(135deg,#1d4ed8,#1e40af)",
  "linear-gradient(135deg,#0d9488,#0f766e)",
  "linear-gradient(135deg,#7c3aed,#6d28d9)",
  "linear-gradient(135deg,#be185d,#9d174d)",
];

const KONTRAK_STATUS_CFG = {
  aktif:        { label: "Aktif",        color: "#16a34a", bg: "#dcfce7" },
  habis:        { label: "Habis",        color: "#dc2626", bg: "#fee2e2" },
  diperpanjang: { label: "Diperpanjang", color: "#d97706", bg: "#fef3c7" },
};

// ============================================================
// CSS
// ============================================================
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  :root{
    --or:#f97316;--or-d:#ea580c;--or-pale:#fff7ed;--or-light:#ffedd5;--or-mid:#fed7aa;
    --s900:#0f172a;--s800:#1e293b;--s700:#334155;--s600:#475569;
    --s400:#94a3b8;--s200:#e2e8f0;--s100:#f1f5f9;--s50:#f8fafc;
    --white:#fff;--red:#dc2626;--green:#16a34a;--blue:#1d4ed8;--amber:#d97706;--purple:#7c3aed;
  }
  body{font-family:'Plus Jakarta Sans',sans-serif;background:var(--s50)}
  ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:var(--s200);border-radius:4px}

  /* ── TOPBAR ── */
  .topbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;flex-wrap:wrap;gap:10px}

  /* ── STAT STRIP ── */
  .stat-strip{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px}
  .sc{background:var(--white);border:1px solid var(--s200);border-radius:12px;padding:14px 16px;border-top:3px solid transparent}
  .sc-label{font-size:10px;font-weight:700;color:var(--s400);text-transform:uppercase;letter-spacing:0.7px;margin-bottom:4px}
  .sc-val{font-size:22px;font-weight:800;color:var(--s800)}
  .sc-sub{font-size:11px;color:var(--s400);margin-top:3px}

  /* ── LAYOUT ── */
  .layout{display:grid;grid-template-columns:340px 1fr;gap:16px;align-items:start}

  /* ── CARD LIST ── */
  .card-list{background:var(--white);border:1px solid var(--s200);border-radius:12px;overflow:hidden}
  .cl-head{padding:12px 14px;border-bottom:1px solid var(--s100);display:flex;align-items:center;justify-content:space-between;background:var(--s50)}
  .cl-search{display:flex;align-items:center;gap:7px;background:var(--white);border:1.5px solid var(--s200);border-radius:8px;padding:6px 11px;width:100%;transition:all 0.15s;margin-bottom:8px}
  .cl-search:focus-within{border-color:var(--or)}
  .cl-search input{border:none;outline:none;font-size:12px;color:var(--s800);background:transparent;font-family:'Plus Jakarta Sans',sans-serif;width:100%}
  .cl-search input::placeholder{color:var(--s400)}

  /* ── KARYAWAN CARD ── */
  .kary-item{padding:12px 14px;border-bottom:1px solid var(--s100);cursor:pointer;transition:all 0.12s;display:flex;align-items:center;gap:11px}
  .kary-item:hover{background:var(--or-pale)}
  .kary-item.active{background:var(--or-pale);border-left:3px solid var(--or)}
  .kary-item:last-child{border-bottom:none}
  .ki-avatar{width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:#fff;flex-shrink:0}
  .ki-name{font-size:13px;font-weight:700;color:var(--s800)}
  .ki-sub{font-size:11px;color:var(--s400);margin-top:2px}
  .ki-badges{display:flex;gap:4px;margin-top:4px;flex-wrap:wrap}

  /* ── DETAIL PANEL ── */
  .detail-panel{background:var(--white);border:1px solid var(--s200);border-radius:12px;overflow:hidden}
  .dp-tabs{display:flex;gap:0;background:var(--s50);border-bottom:1px solid var(--s200);padding:6px 8px;gap:4px}
  .dp-tab{padding:6px 14px;border-radius:7px;border:none;font-family:'Plus Jakarta Sans',sans-serif;font-size:11px;font-weight:600;cursor:pointer;transition:all 0.12s;color:var(--s400);background:transparent}
  .dp-tab:hover{color:var(--s700)}
  .dp-tab.active{background:linear-gradient(135deg,var(--or),var(--or-d));color:#fff}

  /* ── PROFILE CARD ── */
  .profile-hero{background:linear-gradient(135deg,var(--s900),#1a0a00);padding:24px;position:relative;overflow:hidden}
  .profile-hero::before{content:'';position:absolute;top:-40px;right:-40px;width:160px;height:160px;border-radius:50%;background:radial-gradient(circle,rgba(249,115,22,0.2),transparent)}
  .ph-avatar{width:60px;height:60px;border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:800;color:#fff;margin-bottom:10px;border:2px solid rgba(249,115,22,0.4)}
  .ph-name{font-size:20px;font-weight:800;color:#fff;margin-bottom:3px}
  .ph-jabatan{font-size:13px;color:var(--or);font-weight:600;margin-bottom:8px}
  .ph-id{font-size:11px;font-family:'JetBrains Mono',monospace;color:rgba(255,255,255,0.35)}
  .ph-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-top:14px;padding-top:14px;border-top:1px solid rgba(255,255,255,0.08)}
  .ph-field{text-align:center}
  .ph-label{font-size:9px;font-weight:700;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px}
  .ph-val{font-size:12px;font-weight:700;color:#fff}

  /* ── INFO ROWS ── */
  .info-section{padding:16px 18px}
  .info-sec-title{font-size:10px;font-weight:800;color:var(--s400);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid var(--s100)}
  .info-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px}
  .info-item{background:var(--s50);border-radius:8px;padding:10px 12px}
  .ii-label{font-size:10px;font-weight:700;color:var(--s400);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px}
  .ii-val{font-size:13px;font-weight:600;color:var(--s800)}
  .ii-val.mono{font-family:'JetBrains Mono',monospace;font-size:12px}

  /* ── KONTRAK CARD ── */
  .kontrak-card{border-radius:12px;padding:18px;position:relative;overflow:hidden;margin-bottom:12px}
  .kontrak-card::after{content:'SPK';position:absolute;bottom:10px;right:14px;font-size:32px;font-weight:900;color:rgba(255,255,255,0.04);letter-spacing:2px}
  .kc-no{font-size:10px;font-family:'JetBrains Mono',monospace;color:rgba(255,255,255,0.35);margin-bottom:6px}
  .kc-title{font-size:15px;font-weight:800;color:#fff;margin-bottom:3px}
  .kc-period{font-size:12px;color:rgba(255,255,255,0.6);margin-bottom:12px}
  .kc-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}
  .kc-f-label{font-size:9px;font-weight:700;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:2px}
  .kc-f-val{font-size:12px;font-weight:700;color:#fff}
  .kc-alert{margin-top:10px;padding:8px 10px;border-radius:7px;background:rgba(249,115,22,0.15);border:1px solid rgba(249,115,22,0.3);font-size:11px;color:var(--or);font-weight:600}

  /* ── CUTI TRACKER ── */
  .cuti-track{display:flex;gap:6px;margin-bottom:8px}
  .ct-dot{width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;border:2px solid transparent;transition:all 0.12s}
  .ct-dot.used{background:#fee2e2;color:var(--red);border-color:#fca5a5}
  .ct-dot.sisa{background:#dcfce7;color:var(--green);border-color:#86efac}
  .ct-dot.empty{background:var(--s100);color:var(--s400);border-color:var(--s200)}

  /* ── FORM ── */
  .modal-overlay{position:fixed;inset:0;background:rgba(15,23,42,0.6);display:flex;align-items:center;justify-content:center;z-index:200;backdrop-filter:blur(3px)}
  .modal-card{background:var(--white);border-radius:16px;width:620px;max-height:88vh;overflow-y:auto;box-shadow:0 24px 60px rgba(0,0,0,0.25);animation:popIn 0.2s cubic-bezier(0.34,1.56,0.64,1)}
  @keyframes popIn{from{transform:scale(0.96) translateY(8px);opacity:0}to{transform:scale(1) translateY(0);opacity:1}}
  .mc-head{padding:18px 22px 14px;border-bottom:1px solid var(--s100);background:linear-gradient(135deg,var(--or-pale),var(--white))}
  .mc-body{padding:18px 22px}
  .mc-foot{padding:12px 22px;border-top:1px solid var(--s100);display:flex;gap:8px;justify-content:flex-end}
  .form-section{margin-bottom:18px}
  .fs-title{font-size:10px;font-weight:800;color:var(--s400);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid var(--s100)}
  .field-label{font-size:10px;font-weight:700;color:var(--s600);text-transform:uppercase;letter-spacing:0.5px;display:block;margin-bottom:5px}
  .req{color:var(--red);margin-left:2px}
  .field-input,.field-select,.field-textarea{width:100%;background:var(--s50);border:1.5px solid var(--s200);border-radius:8px;padding:8px 12px;font-size:13px;color:var(--s800);font-family:'Plus Jakarta Sans',sans-serif;outline:none;transition:all 0.15s}
  .field-input:focus,.field-select:focus,.field-textarea:focus{border-color:var(--or);box-shadow:0 0 0 3px rgba(249,115,22,0.08);background:var(--white)}
  .field-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px}
  .field-row-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:12px}
  .field-mb{margin-bottom:12px}

  /* ── SPK PREVIEW ── */
  .spk-paper{background:var(--white);border:2px solid var(--s200);border-radius:10px;padding:28px;font-family:Georgia,serif;font-size:12.5px;line-height:1.9;color:var(--s800)}
  .spk-kop{display:flex;align-items:center;gap:14px;margin-bottom:18px;padding-bottom:14px;border-bottom:2px solid var(--s900)}
  .spk-logo{width:42px;height:42px;background:linear-gradient(135deg,var(--or),var(--or-d));border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:19px;font-weight:800;color:#fff;flex-shrink:0}
  .spk-paraf{display:grid;grid-template-columns:1fr 1fr;gap:48px;margin-top:22px}
  .spk-paraf-col{text-align:center}
  .spk-paraf-line{height:48px;border-bottom:1px solid var(--s400);margin-bottom:4px}

  /* ── BADGES ── */
  .badge{display:inline-flex;align-items:center;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700;white-space:nowrap}
  .badge-lg{padding:4px 11px;font-size:11px;border-radius:8px}

  /* ── BUTTONS ── */
  .btn-primary{background:linear-gradient(135deg,var(--or),var(--or-d));color:#fff;border:none;border-radius:8px;padding:9px 18px;font-size:13px;font-weight:700;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all 0.15s;box-shadow:0 2px 8px rgba(249,115,22,0.25);display:inline-flex;align-items:center;gap:6px}
  .btn-primary:hover{filter:brightness(1.05)}
  .btn-ghost{background:var(--s100);color:var(--s700);border:1px solid var(--s200);border-radius:8px;padding:9px 14px;font-size:12px;font-weight:600;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all 0.15s;display:inline-flex;align-items:center;gap:6px}
  .btn-ghost:hover{background:var(--s200)}
  .btn-sm{padding:5px 11px;font-size:11px}
  .btn-red{background:#fee2e2;color:var(--red);border:1px solid #fca5a5;border-radius:8px;padding:9px 14px;font-size:12px;font-weight:700;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all 0.15s;display:inline-flex;align-items:center;gap:6px}
  .btn-red:hover{background:var(--red);color:#fff}

  /* ── TOAST ── */
  .toaster{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--s900);color:#fff;padding:10px 22px;border-radius:30px;font-size:13px;font-weight:600;z-index:999;box-shadow:0 8px 24px rgba(0,0,0,0.3);animation:toastIn 0.25s ease}
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

function Badge({ color, bg, children, lg }) {
  return <span className={lg ? "badge badge-lg" : "badge"} style={{ color, background: bg }}>{children}</span>;
}

// ============================================================
// SPK PREVIEW MODAL
// ============================================================
function SPKPreview({ karyawan, kontrak, onClose }) {
  const k = kontrak || karyawan.kontrak;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ width: 580 }} onClick={e => e.stopPropagation()}>
        <div className="mc-head">
          <div style={{ fontSize: 16, fontWeight: 800, color: "var(--s900)", marginBottom: 2 }}>📄 Surat Perintah Kerja (SPK)</div>
          <div style={{ fontSize: 12, color: "var(--s400)" }}>{k.noSPK} — {karyawan.nama}</div>
        </div>
        <div className="mc-body">
          <div className="spk-paper">
            <div className="spk-kop">
              <div className="spk-logo">S</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5 }}>Senyum Inn Exclusive Kost</div>
                <div style={{ fontSize: 11, color: "var(--s400)" }}>Jl. Contoh No. 1, Semarang · 024-XXXXXXXX</div>
              </div>
            </div>

            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1 }}>Surat Perjanjian Kerja (SPK)</div>
              <div style={{ fontSize: 12, color: "var(--s400)" }}>No: {k.noSPK}</div>
            </div>

            <div style={{ marginBottom: 12 }}>
              Pada hari ini telah disepakati perjanjian kerja antara:
            </div>
            <div style={{ paddingLeft: 16, marginBottom: 12 }}>
              <div><b>Pihak I (Pemberi Kerja):</b> Yusuf Vindra Asmara, Pemilik Senyum Inn</div>
              <div><b>Pihak II (Pekerja):</b> {karyawan.nama}, NIK: {karyawan.nik}</div>
            </div>

            <div style={{ marginBottom: 10 }}>Dengan ketentuan sebagai berikut:</div>
            <div style={{ paddingLeft: 16, marginBottom: 16 }}>
              <div>• Jabatan: <b>{karyawan.jabatan}</b></div>
              <div>• Shift: <b>{karyawan.shift}</b></div>
              <div>• Masa kerja: <b>{fmtTgl(k.tglMulai)}</b> s/d <b>{fmtTgl(k.tglSelesai)}</b> ({k.durasi} bulan)</div>
              <div>• Gaji pokok: <b>{fmtRp(karyawan.gajiPokok)}</b>/bulan</div>
              <div>• Hak cuti: <b>3 hari</b> dalam masa kontrak</div>
              <div>• Pemotongan ijin tidak sah: <b>Rp 50.000/hari</b></div>
              <div>• Deskripsi pekerjaan sesuai Jobdesk terlampir</div>
            </div>

            <div className="spk-paraf">
              {["Pihak I — Pemberi Kerja", "Pihak II — Pekerja"].map((p, i) => (
                <div key={p} className="spk-paraf-col">
                  <div style={{ fontSize: 12, marginBottom: 6 }}>{p}</div>
                  <div className="spk-paraf-line" />
                  <div style={{ fontSize: 12, fontWeight: 700 }}>{i === 0 ? "Yusuf Vindra Asmara" : karyawan.nama}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mc-foot">
          <button className="btn-ghost" onClick={onClose}>Tutup</button>
          <button className="btn-primary" onClick={() => alert("PDF siap cetak!")}>🖨️ Print / Download PDF</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// FORM TAMBAH / EDIT KARYAWAN
// ============================================================
function FormKaryawan({ karyawan, onSave, onClose }) {
  const isEdit = !!karyawan;
  const [form, setForm] = useState(karyawan || {
    nama: "", nik: "", tglLahir: "", jenisKelamin: "Laki-laki",
    agama: "Islam", statusNikah: "Belum Menikah",
    noHP: "", noDarurat: "", namaDarurat: "", alamat: "",
    jabatan: "Clean & Service", role: "staff", shift: "Pagi",
    tglMulai: "2026-02-26",
    rekening: { bank: "BCA", no: "", atas: "" },
    gajiPokok: 1800000, catatan: "", statusAktif: true,
    kontrak: { noSPK: "", tglMulai: "2026-02-26", tglSelesai: "2027-02-26", durasi: 12, status: "aktif" },
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setRek = (k, v) => setForm(f => ({ ...f, rekening: { ...f.rekening, [k]: v } }));
  const setKon = (k, v) => setForm(f => ({ ...f, kontrak: { ...f.kontrak, [k]: v } }));

  // Auto-generate SPK number
  const genSPK = () => {
    const d = new Date(form.kontrak.tglMulai);
    const spk = `SPKJ.SIEK.${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,"0")}.${String(d.getDate()).padStart(2,"0")}`;
    setKon("noSPK", spk);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="mc-head">
          <div style={{ fontSize: 16, fontWeight: 800, color: "var(--s900)", marginBottom: 2 }}>
            {isEdit ? "✏️ Edit Data Karyawan" : "➕ Tambah Karyawan Baru"}
          </div>
          <div style={{ fontSize: 12, color: "var(--s400)" }}>Semua field wajib diisi kecuali yang opsional</div>
        </div>
        <div className="mc-body">

          {/* Data Pribadi */}
          <div className="form-section">
            <div className="fs-title">Data Pribadi</div>
            <div className="field-mb">
              <label className="field-label">Nama Lengkap <span className="req">*</span></label>
              <input className="field-input" placeholder="Sesuai KTP" value={form.nama} onChange={e => set("nama", e.target.value)} />
            </div>
            <div className="field-row">
              <div>
                <label className="field-label">NIK / KTP</label>
                <input className="field-input" placeholder="16 digit" value={form.nik} onChange={e => set("nik", e.target.value)} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12 }} />
              </div>
              <div>
                <label className="field-label">Tanggal Lahir</label>
                <input className="field-input" type="date" value={form.tglLahir} onChange={e => set("tglLahir", e.target.value)} />
              </div>
            </div>
            <div className="field-row">
              <div>
                <label className="field-label">Jenis Kelamin</label>
                <select className="field-select" value={form.jenisKelamin} onChange={e => set("jenisKelamin", e.target.value)}>
                  {["Laki-laki","Perempuan"].map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">Agama</label>
                <select className="field-select" value={form.agama} onChange={e => set("agama", e.target.value)}>
                  {AGAMA_LIST.map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
            </div>
            <div className="field-row">
              <div>
                <label className="field-label">Status Pernikahan</label>
                <select className="field-select" value={form.statusNikah} onChange={e => set("statusNikah", e.target.value)}>
                  {NIKAH_LIST.map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">No HP <span className="req">*</span></label>
                <input className="field-input" placeholder="08xxxxxxxxxx" value={form.noHP} onChange={e => set("noHP", e.target.value)} />
              </div>
            </div>
            <div className="field-row">
              <div>
                <label className="field-label">Kontak Darurat</label>
                <input className="field-input" placeholder="08xxxxxxxxxx" value={form.noDarurat} onChange={e => set("noDarurat", e.target.value)} />
              </div>
              <div>
                <label className="field-label">Nama Darurat (Hubungan)</label>
                <input className="field-input" placeholder="Nama (Hubungan)" value={form.namaDarurat} onChange={e => set("namaDarurat", e.target.value)} />
              </div>
            </div>
            <div className="field-mb">
              <label className="field-label">Alamat</label>
              <textarea className="field-textarea" rows={2} placeholder="Alamat lengkap" value={form.alamat} onChange={e => set("alamat", e.target.value)} style={{ minHeight: 56 }} />
            </div>
          </div>

          {/* Pekerjaan */}
          <div className="form-section">
            <div className="fs-title">Data Pekerjaan</div>
            <div className="field-row">
              <div>
                <label className="field-label">Jabatan <span className="req">*</span></label>
                <select className="field-select" value={form.jabatan} onChange={e => set("jabatan", e.target.value)}>
                  {JABATAN_LIST.map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">Shift</label>
                <select className="field-select" value={form.shift} onChange={e => set("shift", e.target.value)}>
                  {SHIFT_LIST.map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
            </div>
            <div className="field-row">
              <div>
                <label className="field-label">Role Sistem</label>
                <select className="field-select" value={form.role} onChange={e => set("role", e.target.value)}>
                  {ROLE_LIST.map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">Gaji Pokok (Rp)</label>
                <input className="field-input" type="number" value={form.gajiPokok} onChange={e => set("gajiPokok", Number(e.target.value))} style={{ fontFamily: "'JetBrains Mono',monospace" }} />
              </div>
            </div>
            <div className="field-mb">
              <label className="field-label">Tanggal Mulai Kerja</label>
              <input className="field-input" type="date" value={form.tglMulai} onChange={e => set("tglMulai", e.target.value)} style={{ maxWidth: 200 }} />
            </div>
          </div>

          {/* Rekening */}
          <div className="form-section">
            <div className="fs-title">Rekening Bank (untuk penggajian)</div>
            <div className="field-row-3">
              <div>
                <label className="field-label">Bank</label>
                <select className="field-select" value={form.rekening.bank} onChange={e => setRek("bank", e.target.value)}>
                  {BANK_LIST.map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">No. Rekening</label>
                <input className="field-input" placeholder="No rek" value={form.rekening.no} onChange={e => setRek("no", e.target.value)} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12 }} />
              </div>
              <div>
                <label className="field-label">Atas Nama</label>
                <input className="field-input" placeholder="Atas nama" value={form.rekening.atas} onChange={e => setRek("atas", e.target.value)} />
              </div>
            </div>
          </div>

          {/* Kontrak */}
          <div className="form-section">
            <div className="fs-title">Kontrak / SPK</div>
            <div className="field-row">
              <div>
                <label className="field-label">No. SPK</label>
                <div style={{ display: "flex", gap: 6 }}>
                  <input className="field-input" placeholder="SPKJ.SIEK.YYYY.MM.DD" value={form.kontrak.noSPK} onChange={e => setKon("noSPK", e.target.value)} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, flex: 1 }} />
                  <button className="btn-ghost btn-sm" onClick={genSPK} title="Auto-generate">⚡</button>
                </div>
              </div>
              <div>
                <label className="field-label">Durasi (bulan)</label>
                <select className="field-select" value={form.kontrak.durasi} onChange={e => setKon("durasi", Number(e.target.value))}>
                  {[6,12,24].map(v => <option key={v} value={v}>{v} bulan</option>)}
                </select>
              </div>
            </div>
            <div className="field-row">
              <div>
                <label className="field-label">Tgl Mulai Kontrak</label>
                <input className="field-input" type="date" value={form.kontrak.tglMulai} onChange={e => setKon("tglMulai", e.target.value)} />
              </div>
              <div>
                <label className="field-label">Tgl Selesai Kontrak</label>
                <input className="field-input" type="date" value={form.kontrak.tglSelesai} onChange={e => setKon("tglSelesai", e.target.value)} />
              </div>
            </div>
          </div>

          {/* Catatan */}
          <div className="form-section">
            <div className="fs-title">Catatan</div>
            <textarea className="field-textarea" rows={2} placeholder="Catatan tentang karyawan (opsional)" value={form.catatan} onChange={e => set("catatan", e.target.value)} style={{ minHeight: 60 }} />
          </div>
        </div>
        <div className="mc-foot">
          <button className="btn-ghost" onClick={onClose}>Batal</button>
          <button className="btn-primary" onClick={() => onSave(form)} disabled={!form.nama || !form.noHP}>
            {isEdit ? "✓ Simpan Perubahan" : "✓ Tambah Karyawan"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// DETAIL — PROFIL TAB
// ============================================================
function DetailProfil({ emp }) {
  return (
    <div>
      <div className="profile-hero">
        <div className="ph-avatar" style={{ background: AVATAR_COLORS[parseInt(emp.id.replace("EMP","")) % AVATAR_COLORS.length] }}>
          {getInitials(emp.nama)}
        </div>
        <div className="ph-name">{emp.nama}</div>
        <div className="ph-jabatan">{emp.jabatan}</div>
        <div className="ph-id">{emp.id} · NIK {emp.nik || "—"}</div>
        <div className="ph-grid">
          {[
            { label: "Shift", val: emp.shift },
            { label: "Usia",  val: getAge(emp.tglLahir) },
            { label: "Mulai Kerja", val: fmtTgl(emp.tglMulai) },
          ].map(f => (
            <div key={f.label} className="ph-field">
              <div className="ph-label">{f.label}</div>
              <div className="ph-val">{f.val}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="info-section">
        <div className="info-sec-title">Data Pribadi</div>
        <div className="info-grid">
          {[
            { label: "Tgl Lahir",      val: fmtTgl(emp.tglLahir) },
            { label: "Jenis Kelamin",  val: emp.jenisKelamin },
            { label: "Agama",          val: emp.agama },
            { label: "Status Nikah",   val: emp.statusNikah },
            { label: "No HP",          val: emp.noHP, mono: true },
            { label: "Kontak Darurat", val: emp.noDarurat, mono: true },
          ].map(f => (
            <div key={f.label} className="info-item">
              <div className="ii-label">{f.label}</div>
              <div className={`ii-val${f.mono ? " mono" : ""}`}>{f.val || "—"}</div>
            </div>
          ))}
        </div>
        {emp.namaDarurat && (
          <div style={{ background: "var(--s50)", borderRadius: 8, padding: "10px 12px", marginBottom: 12 }}>
            <div className="ii-label">Nama Darurat</div>
            <div className="ii-val">{emp.namaDarurat}</div>
          </div>
        )}
        <div style={{ background: "var(--s50)", borderRadius: 8, padding: "10px 12px", marginBottom: 12 }}>
          <div className="ii-label">Alamat</div>
          <div className="ii-val" style={{ fontSize: 12 }}>{emp.alamat || "—"}</div>
        </div>

        <div className="info-sec-title">Rekening Penggajian</div>
        <div style={{ background: "var(--s50)", borderRadius: 8, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: "linear-gradient(135deg,var(--blue),#1e40af)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 800, flexShrink: 0 }}>
            {emp.rekening.bank}
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--s800)" }}>{emp.rekening.bank}</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 700, color: "var(--s700)" }}>{emp.rekening.no}</div>
            <div style={{ fontSize: 11, color: "var(--s400)" }}>a.n. {emp.rekening.atas}</div>
          </div>
        </div>

        <div className="info-sec-title">Gaji Pokok</div>
        <div style={{ background: "var(--or-pale)", border: "1px solid var(--or-mid)", borderRadius: 8, padding: "12px 14px", marginBottom: 14 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: "var(--or-d)", fontFamily: "'JetBrains Mono',monospace" }}>{fmtRp(emp.gajiPokok)}</div>
          <div style={{ fontSize: 11, color: "var(--s400)", marginTop: 3 }}>per bulan · belum termasuk insentif & lembur</div>
        </div>

        {emp.catatan && (
          <>
            <div className="info-sec-title">Catatan</div>
            <div style={{ background: "var(--s50)", borderRadius: 8, padding: "10px 12px", fontSize: 13, color: "var(--s700)", lineHeight: 1.6 }}>
              {emp.catatan}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ============================================================
// DETAIL — KONTRAK TAB
// ============================================================
function DetailKontrak({ emp, onShowSPK }) {
  const kontrak = emp.kontrak;
  const aktifKontrak = kontrak.perpanjangan || kontrak;
  const sisa = hariSisa(aktifKontrak.tglSelesai);
  const statusCfg = KONTRAK_STATUS_CFG[aktifKontrak.status] || KONTRAK_STATUS_CFG.aktif;

  return (
    <div className="info-section">
      {/* Kontrak aktif */}
      <div className="kontrak-card" style={{ background: "linear-gradient(135deg,var(--s900),#1a0a00)" }}>
        <div className="kc-no">{aktifKontrak.noSPK || kontrak.noSPK}</div>
        <div className="kc-title">{emp.nama}</div>
        <div className="kc-period">{emp.jabatan} · {fmtTgl(aktifKontrak.tglMulai)} – {fmtTgl(aktifKontrak.tglSelesai)}</div>
        <div className="kc-grid">
          {[
            { label: "Durasi",   val: `${kontrak.durasi} bulan` },
            { label: "Status",   val: aktifKontrak.status === "aktif" ? "✅ Aktif" : aktifKontrak.status === "habis" ? "❌ Habis" : "↩ Diperpanjang" },
            { label: "Shift",    val: emp.shift },
          ].map(f => (
            <div key={f.label}>
              <div className="kc-f-label">{f.label}</div>
              <div className="kc-f-val">{f.val}</div>
            </div>
          ))}
        </div>
        {sisa !== null && sisa <= 30 && (
          <div className="kc-alert">
            ⚠️ Kontrak berakhir dalam <b>{sisa} hari</b> — segera proses perpanjangan
          </div>
        )}
      </div>

      {/* Riwayat kontrak jika ada perpanjangan */}
      {kontrak.perpanjangan && (
        <div style={{ background: "var(--s50)", borderRadius: 10, padding: 12, marginBottom: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--s400)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>Kontrak Sebelumnya</div>
          <div style={{ fontSize: 12, color: "var(--s600)" }}>
            {kontrak.noSPK} · {fmtTgl(kontrak.tglMulai)} – {fmtTgl(kontrak.tglSelesai)}
          </div>
          <Badge color={KONTRAK_STATUS_CFG.diperpanjang.color} bg={KONTRAK_STATUS_CFG.diperpanjang.bg}>
            Diperpanjang
          </Badge>
        </div>
      )}

      {/* Cuti tracker */}
      <div className="info-sec-title">Hak Cuti & Ijin</div>
      <div style={{ background: "var(--s50)", borderRadius: 10, padding: "12px 14px", marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--s700)" }}>Hak cuti 3 hari / kontrak</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--green)" }}>{emp.cutiSisa} hari tersisa</span>
        </div>
        <div className="cuti-track">
          {Array.from({ length: 3 }).map((_, i) => {
            const isUsed = i < (emp.cutiDipakai || 0);
            const isSisa = i >= (emp.cutiDipakai || 0);
            return (
              <div key={i} className={`ct-dot ${isUsed ? "used" : isSisa ? "sisa" : "empty"}`}>
                {isUsed ? "✕" : "✓"}
              </div>
            );
          })}
          <span style={{ fontSize: 12, color: "var(--s400)", alignSelf: "center", marginLeft: 6 }}>
            {emp.cutiDipakai || 0} terpakai · {emp.cutiSisa} sisa
          </span>
        </div>
      </div>

      {/* Aksi */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button className="btn-ghost" onClick={() => onShowSPK(emp, aktifKontrak)}>📄 Lihat SPK</button>
        <button className="btn-primary" style={{ fontSize: 12 }} onClick={() => alert("Form perpanjang kontrak")}>
          ⟳ Perpanjang Kontrak
        </button>
      </div>
    </div>
  );
}

// ============================================================
// MAIN MODULE
// ============================================================
export default function DataKaryawan({ userRole = "admin" }) {
  const [karyawanList, setKaryawanList] = useState(KARYAWAN_DATA);
  const [selected, setSelected] = useState(KARYAWAN_DATA[0]);
  const [detailTab, setDetailTab] = useState("profil");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editKaryawan, setEditKaryawan] = useState(null);
  const [showSPK, setShowSPK] = useState(null);
  const [toast, setToast] = useState(null);

  const filtered = karyawanList.filter(k =>
    k.nama.toLowerCase().includes(search.toLowerCase()) ||
    k.jabatan.toLowerCase().includes(search.toLowerCase())
  );

  const aktif   = karyawanList.filter(k => k.statusAktif).length;
  const habis   = karyawanList.filter(k => {
    const s = k.kontrak.perpanjangan || k.kontrak;
    return hariSisa(s.tglSelesai) !== null && hariSisa(s.tglSelesai) <= 30;
  }).length;
  const nonaktif = karyawanList.filter(k => !k.statusAktif).length;

  const handleSave = (form) => {
    if (editKaryawan) {
      setKaryawanList(prev => prev.map(k => k.id === form.id ? form : k));
      setSelected(form);
      setToast(`✓ Data ${form.nama} berhasil diperbarui`);
    } else {
      const newId = "EMP" + String(karyawanList.length + 1).padStart(3, "0");
      const newEmp = { ...form, id: newId, cutiSisa: 3, cutiDipakai: 0 };
      setKaryawanList(prev => [...prev, newEmp]);
      setSelected(newEmp);
      setToast(`✓ Karyawan ${form.nama} berhasil ditambahkan`);
    }
    setShowForm(false);
    setEditKaryawan(null);
  };

  return (
    <div className="fade-up">
      <StyleInjector />

      {/* TOPBAR */}
      <div className="topbar">
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--s400)", textTransform: "uppercase", letterSpacing: 1 }}>
          Data Karyawan
        </div>
        <button className="btn-primary" onClick={() => { setEditKaryawan(null); setShowForm(true); }}>
          + Tambah Karyawan
        </button>
      </div>

      {/* STAT STRIP */}
      <div className="stat-strip">
        {[
          { label: "Total Karyawan",        val: karyawanList.length, color: "var(--or)",   borderColor: "var(--or)" },
          { label: "Aktif",                  val: aktif,               color: "var(--green)", borderColor: "var(--green)" },
          { label: "Kontrak Mau Habis",      val: habis,               color: "var(--red)",   borderColor: "var(--red)", sub: "dalam 30 hari" },
          { label: "Nonaktif",               val: nonaktif,            color: "var(--s400)",  borderColor: "var(--s200)" },
        ].map(s => (
          <div key={s.label} className="sc" style={{ borderTopColor: s.borderColor }}>
            <div className="sc-label">{s.label}</div>
            <div className="sc-val" style={{ color: s.color }}>{s.val}</div>
            {s.sub && <div className="sc-sub">{s.sub}</div>}
          </div>
        ))}
      </div>

      {/* LAYOUT */}
      <div className="layout">
        {/* LEFT — Daftar */}
        <div>
          <div className="card-list">
            <div style={{ padding: "10px 10px 0" }}>
              <div className="cl-search">
                <span style={{ color: "var(--s400)", fontSize: 13 }}>🔍</span>
                <input placeholder="Cari nama / jabatan..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>
            {filtered.map((emp, idx) => {
              const aktifK = emp.kontrak.perpanjangan || emp.kontrak;
              const sisa = hariSisa(aktifK.tglSelesai);
              const kStatusCfg = KONTRAK_STATUS_CFG[aktifK.status] || KONTRAK_STATUS_CFG.aktif;
              return (
                <div key={emp.id} className={`kary-item ${selected?.id === emp.id ? "active" : ""}`} onClick={() => { setSelected(emp); setDetailTab("profil"); }}>
                  <div className="ki-avatar" style={{ background: AVATAR_COLORS[idx % AVATAR_COLORS.length] }}>
                    {getInitials(emp.nama)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="ki-name">{emp.nama}</div>
                    <div className="ki-sub">{emp.jabatan} · {emp.shift}</div>
                    <div className="ki-badges">
                      <Badge color={kStatusCfg.color} bg={kStatusCfg.bg}>{kStatusCfg.label}</Badge>
                      {sisa !== null && sisa <= 30 && (
                        <Badge color="var(--red)" bg="#fee2e2">⚠ {sisa}h lagi</Badge>
                      )}
                      {!emp.statusAktif && (
                        <Badge color="var(--s400)" bg="var(--s100)">Nonaktif</Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--s400)", fontSize: 13 }}>
                Tidak ada karyawan ditemukan
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — Detail */}
        {selected && (
          <div className="detail-panel">
            {/* Detail tabs */}
            <div className="dp-tabs">
              {[
                { id: "profil",  label: "👤 Profil" },
                { id: "kontrak", label: "📄 Kontrak & Cuti" },
              ].map(t => (
                <button key={t.id} className={`dp-tab ${detailTab === t.id ? "active" : ""}`} onClick={() => setDetailTab(t.id)}>
                  {t.label}
                </button>
              ))}
              <div style={{ flex: 1 }} />
              <button className="btn-ghost btn-sm" onClick={() => { setEditKaryawan(selected); setShowForm(true); }}>
                ✏️ Edit
              </button>
              <button className="btn-red btn-sm" onClick={() => {
                setKaryawanList(prev => prev.map(k => k.id === selected.id ? { ...k, statusAktif: !k.statusAktif } : k));
                setSelected(s => ({ ...s, statusAktif: !s.statusAktif }));
                setToast(`${selected.statusAktif ? "Karyawan dinonaktifkan" : "Karyawan diaktifkan kembali"}`);
              }}>
                {selected.statusAktif ? "🚫 Nonaktifkan" : "✅ Aktifkan"}
              </button>
            </div>

            {detailTab === "profil"  && <DetailProfil emp={selected} />}
            {detailTab === "kontrak" && <DetailKontrak emp={selected} onShowSPK={(e, k) => setShowSPK({ emp: e, kontrak: k })} />}
          </div>
        )}
      </div>

      {/* MODALS */}
      {showForm && (
        <FormKaryawan
          karyawan={editKaryawan}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditKaryawan(null); }}
        />
      )}

      {showSPK && (
        <SPKPreview
          karyawan={showSPK.emp}
          kontrak={showSPK.kontrak}
          onClose={() => setShowSPK(null)}
        />
      )}

      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
