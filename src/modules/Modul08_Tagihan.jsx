import { useState, useEffect } from "react";

// ============================================================
// MOCK DATA
// ============================================================
const TAGIHAN_DATA = [
  {
    id: "TG001", kamar: 1, penghuni: "Budi Santoso", tipe: "Premium",
    bulan: "Feb 2026", jatuhTempo: "2026-02-01", jumlah: 2500000,
    status: "lunas", tglBayar: "2026-02-01", metode: "Transfer BCA",
    noRek: "1234567890", bank: "BCA", bukti: true,
    kontrakSelesai: "2026-07-01",
  },
  {
    id: "TG002", kamar: 3, penghuni: "Dian Pratiwi", tipe: "Reguler",
    bulan: "Mar 2026", jatuhTempo: "2026-03-01", jumlah: 1800000,
    status: "pending", tglBayar: null, metode: null,
    noRek: null, bank: null, bukti: false,
    kontrakSelesai: "2026-06-01",
  },
  {
    id: "TG003", kamar: 4, penghuni: "Ahmad Fauzi", tipe: "Premium",
    bulan: "Feb 2026", jatuhTempo: "2026-02-05", jumlah: 2500000,
    status: "lunas", tglBayar: "2026-02-05", metode: "Transfer Mandiri",
    noRek: "9876543210", bank: "Mandiri", bukti: true,
    kontrakSelesai: "2026-06-01",
  },
  {
    id: "TG004", kamar: 6, penghuni: "Siti Rahayu", tipe: "Reguler",
    bulan: "Feb 2026", jatuhTempo: "2026-02-01", jumlah: 1800000,
    status: "lunas", tglBayar: "2026-02-01", metode: "Transfer BNI",
    noRek: "1122334455", bank: "BNI", bukti: true,
    kontrakSelesai: "2026-08-01",
  },
  {
    id: "TG005", kamar: 7, penghuni: "Rudi Hartono", tipe: "Premium",
    bulan: "Feb 2026", jatuhTempo: "2026-02-15", jumlah: 2650000,
    status: "lunas", tglBayar: "2026-02-15", metode: "Transfer BCA",
    noRek: "5566778899", bank: "BCA", bukti: true,
    kontrakSelesai: "2027-01-15",
  },
  {
    id: "TG006", kamar: 9, penghuni: "Dewi Lestari", tipe: "Reguler",
    bulan: "Feb 2026", jatuhTempo: "2026-02-01", jumlah: 1800000,
    status: "telat", tglBayar: null, metode: null,
    noRek: null, bank: null, bukti: false,
    denda: 1250000, hariTelat: 25,
    kontrakSelesai: "2026-04-01",
  },
  {
    id: "TG007", kamar: 10, penghuni: "Prisca Aprilia", tipe: "Premium",
    bulan: "Feb 2026", jatuhTempo: "2026-02-12", jumlah: 2500000,
    status: "lunas", tglBayar: "2026-02-12", metode: "Transfer BCA",
    noRek: "6677889900", bank: "BCA", bukti: true,
    kontrakSelesai: "2026-07-12",
  },
  {
    id: "TG008", kamar: 12, penghuni: "Amalia Wulan", tipe: "Premium",
    bulan: "Feb 2026", jatuhTempo: "2026-02-01", jumlah: 2500000,
    status: "lunas", tglBayar: "2026-02-02", metode: "Transfer BCA",
    noRek: "7788990011", bank: "BCA", bukti: true,
    kontrakSelesai: "2026-06-30",
  },
  // Tagihan bulan depan (Mar)
  {
    id: "TG009", kamar: 1, penghuni: "Budi Santoso", tipe: "Premium",
    bulan: "Mar 2026", jatuhTempo: "2026-03-01", jumlah: 2500000,
    status: "pending", tglBayar: null, metode: null,
    noRek: null, bank: null, bukti: false,
    kontrakSelesai: "2026-07-01",
  },
  {
    id: "TG010", kamar: 4, penghuni: "Ahmad Fauzi", tipe: "Premium",
    bulan: "Mar 2026", jatuhTempo: "2026-03-05", jumlah: 2500000,
    status: "pending", tglBayar: null, metode: null,
    noRek: null, bank: null, bukti: false,
    kontrakSelesai: "2026-06-01",
  },
];

const REKENING_KOST = [
  { bank: "BCA",     no: "1234-5678-9012", atas: "Yusuf Vindra Asmara" },
  { bank: "Mandiri", no: "9876-5432-1098", atas: "Yusuf Vindra Asmara" },
  { bank: "BNI",     no: "1122-3344-5566", atas: "Senyum Inn" },
];

const METODE_LIST = ["Transfer BCA", "Transfer Mandiri", "Transfer BNI", "QRIS", "Tunai"];
const BLN = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Ags","Sep","Okt","Nov","Des"];
const fmtRp  = (n) => n != null ? "Rp " + Number(n).toLocaleString("id-ID") : "-";
const fmtTgl = (s) => { if (!s) return "-"; const d = new Date(s); return `${d.getDate()} ${BLN[d.getMonth()]} ${d.getFullYear()}`; };

const STATUS_CFG = {
  lunas:   { label: "Lunas",   color: "#16a34a", bg: "#dcfce7", border: "#86efac" },
  telat:   { label: "Telat",   color: "#dc2626", bg: "#fee2e2", border: "#fca5a5" },
  pending: { label: "Belum",   color: "#d97706", bg: "#fef3c7", border: "#fcd34d" },
};

// ============================================================
// CSS
// ============================================================
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  :root{
    --or:#f97316;--or-d:#ea580c;--or-dd:#c2410c;
    --or-pale:#fff7ed;--or-light:#ffedd5;--or-mid:#fed7aa;
    --s900:#0f172a;--s800:#1e293b;--s700:#334155;--s600:#475569;
    --s400:#94a3b8;--s200:#e2e8f0;--s100:#f1f5f9;--s50:#f8fafc;
    --white:#fff;--red:#dc2626;--green:#16a34a;--blue:#1d4ed8;
    --amber:#d97706;--teal:#0d9488;
  }
  body{font-family:'Plus Jakarta Sans',sans-serif;background:var(--s50)}
  ::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-thumb{background:var(--s200);border-radius:4px}

  /* ── TOPBAR ── */
  .topbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;flex-wrap:wrap;gap:10px}

  /* ── STAT CARDS ── */
  .stat-row{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px}
  .stat-card{background:var(--white);border:1px solid var(--s200);border-radius:12px;padding:16px 18px;border-top:3px solid transparent}
  .sc-label{font-size:10px;font-weight:700;color:var(--s400);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:5px}
  .sc-val{font-size:22px;font-weight:800;color:var(--s800)}
  .sc-sub{font-size:11px;color:var(--s400);margin-top:3px}

  /* ── FILTER + SEARCH ── */
  .filter-row{display:flex;gap:8px;align-items:center;margin-bottom:14px;flex-wrap:wrap}
  .search-box{display:flex;align-items:center;gap:8px;background:var(--white);border:1.5px solid var(--s200);border-radius:9px;padding:7px 13px;transition:all 0.15s}
  .search-box:focus-within{border-color:var(--or);box-shadow:0 0 0 3px rgba(249,115,22,0.08)}
  .search-box input{border:none;outline:none;font-size:13px;color:var(--s800);background:transparent;font-family:'Plus Jakarta Sans',sans-serif;width:180px}
  .search-box input::placeholder{color:var(--s400)}
  .chip{padding:6px 13px;border-radius:20px;font-size:12px;font-weight:600;border:1.5px solid var(--s200);background:var(--white);color:var(--s600);cursor:pointer;transition:all 0.15s;white-space:nowrap}
  .chip:hover{border-color:var(--or-mid)}
  .chip.active{border-color:var(--or);background:var(--or);color:#fff}

  /* ── TABLE ── */
  .tbl-wrap{background:var(--white);border:1px solid var(--s200);border-radius:12px;overflow:hidden}
  .tbl-head{display:grid;grid-template-columns:80px 1fr 100px 130px 110px 120px 120px;gap:0;background:var(--s50);border-bottom:1px solid var(--s200);padding:0 16px}
  .th{padding:10px 8px;font-size:10px;font-weight:700;color:var(--s400);text-transform:uppercase;letter-spacing:0.7px}
  .tbl-row{display:grid;grid-template-columns:80px 1fr 100px 130px 110px 120px 120px;gap:0;border-bottom:1px solid var(--s100);padding:0 16px;transition:background 0.1s;cursor:pointer;align-items:center}
  .tbl-row:last-child{border-bottom:none}
  .tbl-row:hover{background:var(--or-pale)}
  .tbl-row.telat-row{border-left:3px solid var(--red)}
  .td{padding:11px 8px;font-size:12px;color:var(--s700)}
  .td-bold{font-weight:700;color:var(--s800)}
  .td-mono{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--s600)}
  .td-rp{font-size:13px;font-weight:700;color:var(--or-d)}

  /* ── DETAIL PANEL ── */
  .dp-overlay{position:fixed;inset:0;background:rgba(15,23,42,0.55);display:flex;align-items:flex-start;justify-content:flex-end;z-index:100;backdrop-filter:blur(3px);animation:fadeIn 0.2s ease}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  .dp-panel{background:var(--white);width:480px;height:100vh;overflow-y:auto;box-shadow:-10px 0 50px rgba(0,0,0,0.15);animation:slideIn 0.25s cubic-bezier(0.25,0.46,0.45,0.94);display:flex;flex-direction:column}
  @keyframes slideIn{from{transform:translateX(40px);opacity:0}to{transform:translateX(0);opacity:1}}
  .dp-head{padding:20px 22px 14px;border-bottom:1px solid var(--s100);flex-shrink:0}
  .dp-body{padding:18px 22px;flex:1}
  .dp-foot{padding:14px 22px;border-top:1px solid var(--s100);flex-shrink:0;display:flex;gap:8px}

  /* ── INVOICE VISUAL ── */
  .invoice-card{background:linear-gradient(135deg,var(--s900),#1a0a00);border-radius:14px;padding:22px;color:#fff;position:relative;overflow:hidden;margin-bottom:18px}
  .invoice-card::before{content:'';position:absolute;top:-50px;right:-50px;width:180px;height:180px;border-radius:50%;background:radial-gradient(circle,rgba(249,115,22,0.2),transparent)}
  .invoice-card::after{content:'SENYUM INN EXCLUSIVE KOST';position:absolute;bottom:10px;right:14px;font-size:8px;font-weight:800;letter-spacing:2px;color:rgba(255,255,255,0.07)}
  .inv-id{font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(255,255,255,0.35);margin-bottom:6px}
  .inv-name{font-size:19px;font-weight:800;margin-bottom:3px}
  .inv-room{font-size:13px;color:var(--or);font-weight:600;margin-bottom:14px}
  .inv-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
  .inv-f-label{font-size:9px;font-weight:700;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.5px}
  .inv-f-val{font-size:13px;font-weight:700;color:#fff;margin-top:2px}
  .inv-amount{font-size:26px;font-weight:800;color:var(--or);margin:12px 0 2px}
  .inv-status-bar{display:flex;align-items:center;gap:8px;margin-top:14px;padding-top:14px;border-top:1px solid rgba(255,255,255,0.08)}

  /* ── DENDA SECTION ── */
  .denda-box{background:#fff5f5;border:1.5px solid #fca5a5;border-radius:10px;padding:12px 14px;margin-bottom:14px}
  .denda-title{font-size:12px;font-weight:800;color:var(--red);margin-bottom:6px;display:flex;align-items:center;gap:6px}
  .denda-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px}
  .denda-label{font-size:12px;color:var(--s600)}
  .denda-val{font-size:13px;font-weight:700}

  /* ── KONFIRMASI FORM ── */
  .konfirm-section{background:var(--s50);border-radius:10px;padding:14px;margin-top:12px}
  .ks-title{font-size:11px;font-weight:700;color:var(--s400);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:10px}
  .field-label{font-size:11px;font-weight:700;color:var(--s600);text-transform:uppercase;letter-spacing:0.5px;display:block;margin-bottom:5px}
  .field-input,.field-select{width:100%;background:var(--white);border:1.5px solid var(--s200);border-radius:8px;padding:8px 12px;font-size:13px;color:var(--s800);font-family:'Plus Jakarta Sans',sans-serif;outline:none;transition:all 0.15s}
  .field-input:focus,.field-select:focus{border-color:var(--or);box-shadow:0 0 0 3px rgba(249,115,22,0.08)}
  .field-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .field-mb{margin-bottom:10px}

  /* ── REKENING INFO ── */
  .rek-card{background:var(--white);border:1px solid var(--s200);border-radius:10px;padding:11px 13px;display:flex;align-items:center;gap:10px;margin-bottom:7px}
  .rek-bank{font-size:13px;font-weight:800;color:var(--s800);min-width:60px}
  .rek-no{font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--s700)}
  .rek-atas{font-size:11px;color:var(--s400);margin-top:1px}
  .rek-copy{margin-left:auto;font-size:11px;font-weight:600;color:var(--or-d);cursor:pointer;padding:3px 9px;border:1px solid var(--or-mid);border-radius:6px;background:var(--or-pale);transition:all 0.12s}
  .rek-copy:hover{background:var(--or);color:#fff}

  /* ── SURAT TAGIHAN MODAL ── */
  .modal-overlay{position:fixed;inset:0;background:rgba(15,23,42,0.6);display:flex;align-items:center;justify-content:center;z-index:200;backdrop-filter:blur(2px)}
  .modal-card{background:var(--white);border-radius:16px;width:540px;max-height:88vh;overflow-y:auto;box-shadow:0 24px 60px rgba(0,0,0,0.25);animation:popIn 0.2s cubic-bezier(0.34,1.56,0.64,1)}
  @keyframes popIn{from{transform:scale(0.95) translateY(8px);opacity:0}to{transform:scale(1) translateY(0);opacity:1}}
  .mc-head{padding:18px 22px 14px;border-bottom:1px solid var(--s100)}
  .mc-body{padding:18px 22px}
  .mc-foot{padding:12px 22px;border-top:1px solid var(--s100);display:flex;gap:8px;justify-content:flex-end}

  /* ── SURAT PREVIEW ── */
  .surat-paper{background:var(--white);border:2px solid var(--s200);border-radius:10px;padding:28px;font-family:Georgia,serif;font-size:13px;line-height:1.9;color:var(--s800)}
  .surat-kop{display:flex;align-items:center;gap:14px;margin-bottom:18px;padding-bottom:14px;border-bottom:2px solid var(--s900)}
  .surat-logo{width:44px;height:44px;background:linear-gradient(135deg,var(--or),var(--or-d));border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:800;color:#fff;flex-shrink:0}

  /* ── TIMELINE ── */
  .timeline{padding:14px 0}
  .tl-item{display:flex;gap:12px;padding-bottom:14px;position:relative}
  .tl-item:not(:last-child)::before{content:'';position:absolute;left:11px;top:24px;width:2px;height:calc(100% - 10px);background:var(--s200)}
  .tl-dot{width:24px;height:24px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:11px;z-index:1}
  .tl-content{flex:1;padding-top:2px}
  .tl-title{font-size:12px;font-weight:700;color:var(--s800)}
  .tl-sub{font-size:11px;color:var(--s400);margin-top:1px}

  /* ── SEC DIV ── */
  .sec-div{font-size:10px;font-weight:700;color:var(--s400);text-transform:uppercase;letter-spacing:1px;padding-bottom:8px;border-bottom:1px solid var(--s100);margin-bottom:12px;margin-top:16px}

  /* ── BADGES ── */
  .badge{display:inline-flex;align-items:center;padding:2px 9px;border-radius:20px;font-size:10px;font-weight:700;white-space:nowrap}
  .badge-lg{padding:4px 12px;font-size:11px;border-radius:8px}

  /* ── BUTTONS ── */
  .btn-primary{background:linear-gradient(135deg,var(--or),var(--or-d));color:#fff;border:none;border-radius:8px;padding:9px 18px;font-size:13px;font-weight:700;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all 0.15s;box-shadow:0 2px 8px rgba(249,115,22,0.25);display:inline-flex;align-items:center;gap:6px}
  .btn-primary:hover{filter:brightness(1.05)}
  .btn-ghost{background:var(--s100);color:var(--s700);border:1px solid var(--s200);border-radius:8px;padding:9px 14px;font-size:12px;font-weight:600;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all 0.15s;display:inline-flex;align-items:center;gap:6px}
  .btn-ghost:hover{background:var(--s200)}
  .btn-green{background:#dcfce7;color:var(--green);border:1px solid #86efac;border-radius:8px;padding:9px 14px;font-size:12px;font-weight:700;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all 0.15s;display:inline-flex;align-items:center;gap:6px}
  .btn-green:hover{background:var(--green);color:#fff}
  .btn-warn{background:#fef3c7;color:var(--amber);border:1px solid #fcd34d;border-radius:8px;padding:9px 14px;font-size:12px;font-weight:700;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all 0.15s;display:inline-flex;align-items:center;gap:6px}
  .btn-warn:hover{background:var(--amber);color:#fff}

  /* ── EMPTY ── */
  .empty{padding:48px 20px;text-align:center;color:var(--s400)}

  /* ── TOAST ── */
  .toaster{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--s900);color:#fff;padding:10px 22px;border-radius:30px;font-size:13px;font-weight:600;z-index:999;box-shadow:0 8px 24px rgba(0,0,0,0.3);animation:toastIn 0.25s ease;white-space:nowrap}
  @keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  .fade-up{animation:fadeUp 0.25s ease forwards}

  /* ── MONTH TABS ── */
  .month-tabs{display:flex;gap:6px;margin-bottom:16px;flex-wrap:wrap}
  .mt-btn{padding:7px 16px;border-radius:20px;font-size:12px;font-weight:600;border:1.5px solid var(--s200);background:var(--white);color:var(--s600);cursor:pointer;transition:all 0.15s}
  .mt-btn:hover{border-color:var(--or-mid)}
  .mt-btn.active{border-color:var(--or);background:var(--or);color:#fff}

  /* ── PROGRESS RING ── */
  .ring-wrap{position:relative;display:inline-flex;align-items:center;justify-content:center}
  .ring-center{position:absolute;text-align:center}
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

function Badge({ color, bg, children, lg }) {
  return <span className={lg ? "badge badge-lg" : "badge"} style={{ color, background: bg }}>{children}</span>;
}

function Toast({ msg, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2400); return () => clearTimeout(t); }, []);
  return <div className="toaster">{msg}</div>;
}

// ============================================================
// SURAT TAGIHAN MODAL
// ============================================================
function SuratTagihan({ tagihan, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="mc-head">
          <div style={{ fontSize: 16, fontWeight: 800, color: "var(--s900)", marginBottom: 2 }}>📄 Surat Tagihan</div>
          <div style={{ fontSize: 12, color: "var(--s400)" }}>{tagihan.penghuni} · Kamar {tagihan.kamar} · {tagihan.bulan}</div>
        </div>
        <div className="mc-body">
          <div className="surat-paper">
            {/* Kop */}
            <div className="surat-kop">
              <div className="surat-logo">S</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5 }}>Senyum Inn Exclusive Kost</div>
                <div style={{ fontSize: 11, color: "var(--s400)" }}>Jl. Contoh No. 1, Jakarta · 021-XXXXXXXX</div>
              </div>
            </div>

            <div style={{ textAlign: "center", marginBottom: 18 }}>
              <div style={{ fontSize: 14, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1 }}>Surat Tagihan Sewa Kamar</div>
              <div style={{ fontSize: 12, color: "var(--s400)", marginTop: 2 }}>No: {tagihan.id} · {fmtTgl(new Date().toISOString().split("T")[0])}</div>
            </div>

            <div style={{ marginBottom: 14 }}>
              Kepada Yth. <b>{tagihan.penghuni}</b> — Penghuni <b>Kamar {tagihan.kamar} ({tagihan.tipe})</b>
            </div>

            <div style={{ paddingLeft: 16, marginBottom: 16 }}>
              <div>Tagihan sewa bulan: <b>{tagihan.bulan}</b></div>
              <div>Jatuh tempo: <b>{fmtTgl(tagihan.jatuhTempo)}</b></div>
              <div>Jumlah tagihan: <b style={{ color: "var(--or-d)", fontSize: 15 }}>{fmtRp(tagihan.jumlah)}</b></div>
              {tagihan.denda > 0 && (
                <div>Denda keterlambatan ({tagihan.hariTelat} hari): <b style={{ color: "var(--red)" }}>{fmtRp(tagihan.denda)}</b></div>
              )}
            </div>

            <div style={{ marginBottom: 14 }}>
              Harap melakukan pembayaran ke rekening berikut:
            </div>
            <div style={{ paddingLeft: 16, marginBottom: 16 }}>
              {REKENING_KOST.map((r, i) => (
                <div key={i}>Bank {r.bank}: <b>{r.no}</b> a.n. {r.atas}</div>
              ))}
            </div>

            <div style={{ fontSize: 12, color: "var(--s600)", borderTop: "1px solid var(--s200)", paddingTop: 12 }}>
              Denda keterlambatan Rp 50.000/hari setelah tanggal 25. Terima kasih atas kepercayaan Anda.
            </div>
          </div>
        </div>
        <div className="mc-foot">
          <button className="btn-ghost" onClick={onClose}>Tutup</button>
          <button className="btn-primary" onClick={() => alert("PDF siap cetak!")}>🖨️ Print PDF</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// DETAIL PANEL — 1 tagihan
// ============================================================
function DetailPanel({ tagihan, onClose, onKonfirmasi, onSuratTagihan }) {
  const sCfg = STATUS_CFG[tagihan.status] || STATUS_CFG.pending;
  const [konfirmForm, setKonfirmForm] = useState({
    tglBayar: "2026-02-26", metode: "Transfer BCA", noRek: "", jumlahDiterima: tagihan.jumlah,
  });
  const [showKonfirm, setShowKonfirm] = useState(false);

  const totalTagihan = tagihan.jumlah + (tagihan.denda || 0);

  const timeline = [
    { icon: "📋", color: "#dbeafe", title: "Tagihan dibuat", sub: `${tagihan.bulan} — otomatis dari sistem`, done: true },
    { icon: "📬", color: "#fef3c7", title: "Surat tagihan dikirim", sub: tagihan.status !== "lunas" ? "H-7 sebelum jatuh tempo" : fmtTgl(tagihan.jatuhTempo), done: true },
    { icon: "💳", color: tagihan.status === "lunas" ? "#dcfce7" : "#fee2e2", title: tagihan.status === "lunas" ? "Pembayaran diterima" : "Menunggu pembayaran", sub: tagihan.status === "lunas" ? `${fmtTgl(tagihan.tglBayar)} via ${tagihan.metode}` : `Jatuh tempo ${fmtTgl(tagihan.jatuhTempo)}`, done: tagihan.status === "lunas" },
    { icon: "✅", color: "#dcfce7", title: "Diverifikasi akunting", sub: tagihan.status === "lunas" ? "Masuk kas & jurnal" : "—", done: tagihan.status === "lunas" },
  ];

  return (
    <div className="dp-overlay" onClick={onClose}>
      <div className="dp-panel" onClick={e => e.stopPropagation()}>
        <div className="dp-head">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono',monospace", color: "var(--s400)", marginBottom: 4 }}>{tagihan.id}</div>
              <div style={{ fontSize: 19, fontWeight: 800, color: "var(--s900)", marginBottom: 5 }}>{tagihan.penghuni}</div>
              <div style={{ display: "flex", gap: 6 }}>
                <Badge color={sCfg.color} bg={sCfg.bg} lg>{sCfg.label}</Badge>
                <Badge color="var(--s600)" bg="var(--s100)" lg>Kamar {tagihan.kamar} · {tagihan.tipe}</Badge>
              </div>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "var(--s400)", padding: 4 }}>✕</button>
          </div>
        </div>

        <div className="dp-body">
          {/* Invoice visual */}
          <div className="invoice-card">
            <div className="inv-id">{tagihan.id}</div>
            <div className="inv-name">{tagihan.penghuni}</div>
            <div className="inv-room">Kamar {tagihan.kamar} · {tagihan.tipe}</div>
            <div className="inv-amount">{fmtRp(tagihan.jumlah)}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{tagihan.bulan} · Jatuh tempo {fmtTgl(tagihan.jatuhTempo)}</div>
            <div className="inv-status-bar">
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: sCfg.color, flexShrink: 0 }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>{sCfg.label}</span>
              {tagihan.status === "lunas" && (
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginLeft: 4 }}>· {fmtTgl(tagihan.tglBayar)} via {tagihan.metode}</span>
              )}
            </div>
          </div>

          {/* Denda (jika telat) */}
          {tagihan.status === "telat" && tagihan.denda > 0 && (
            <div className="denda-box">
              <div className="denda-title">⚠ Denda Keterlambatan</div>
              <div className="denda-row">
                <span className="denda-label">Hari telat</span>
                <span className="denda-val" style={{ color: "var(--red)" }}>{tagihan.hariTelat} hari</span>
              </div>
              <div className="denda-row">
                <span className="denda-label">Denda (Rp 50.000/hari)</span>
                <span className="denda-val" style={{ color: "var(--red)" }}>{fmtRp(tagihan.denda)}</span>
              </div>
              <div style={{ height: 1, background: "#fca5a5", margin: "8px 0" }} />
              <div className="denda-row">
                <span className="denda-label" style={{ fontWeight: 700 }}>Total yang harus dibayar</span>
                <span className="denda-val" style={{ color: "var(--red)", fontSize: 15 }}>{fmtRp(totalTagihan)}</span>
              </div>
            </div>
          )}

          {/* Rekening tujuan */}
          {tagihan.status !== "lunas" && (
            <>
              <div className="sec-div">Rekening Tujuan Pembayaran</div>
              {REKENING_KOST.map((r, i) => (
                <div key={i} className="rek-card">
                  <div>
                    <div className="rek-bank">{r.bank}</div>
                    <div className="rek-no">{r.no}</div>
                    <div className="rek-atas">a.n. {r.atas}</div>
                  </div>
                  <div className="rek-copy" onClick={() => navigator.clipboard?.writeText(r.no.replace(/-/g, ""))}>Salin</div>
                </div>
              ))}
            </>
          )}

          {/* Konfirmasi pembayaran */}
          {tagihan.status !== "lunas" && (
            <>
              <div className="sec-div">Konfirmasi Pembayaran</div>
              {!showKonfirm ? (
                <button className="btn-green" style={{ width: "100%", justifyContent: "center" }} onClick={() => setShowKonfirm(true)}>
                  ✓ Input Konfirmasi Bayar
                </button>
              ) : (
                <div className="konfirm-section">
                  <div className="ks-title">Detail Pembayaran</div>
                  <div className="field-row field-mb">
                    <div>
                      <label className="field-label">Tgl Bayar</label>
                      <input className="field-input" type="date" value={konfirmForm.tglBayar} onChange={e => setKonfirmForm(f => ({ ...f, tglBayar: e.target.value }))} />
                    </div>
                    <div>
                      <label className="field-label">Metode</label>
                      <select className="field-select" value={konfirmForm.metode} onChange={e => setKonfirmForm(f => ({ ...f, metode: e.target.value }))}>
                        {METODE_LIST.map(m => <option key={m}>{m}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="field-row field-mb">
                    <div>
                      <label className="field-label">No Rekening Pengirim</label>
                      <input className="field-input" placeholder="Opsional" value={konfirmForm.noRek} onChange={e => setKonfirmForm(f => ({ ...f, noRek: e.target.value }))} />
                    </div>
                    <div>
                      <label className="field-label">Jumlah Diterima (Rp)</label>
                      <input className="field-input" type="number" value={konfirmForm.jumlahDiterima} onChange={e => setKonfirmForm(f => ({ ...f, jumlahDiterima: Number(e.target.value) }))} />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn-ghost" style={{ flex: 1, justifyContent: "center" }} onClick={() => setShowKonfirm(false)}>Batal</button>
                    <button className="btn-primary" style={{ flex: 2, justifyContent: "center" }} onClick={() => onKonfirmasi(tagihan.id, konfirmForm)}>
                      ✓ Simpan Konfirmasi
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Detail bayar (jika lunas) */}
          {tagihan.status === "lunas" && (
            <>
              <div className="sec-div">Detail Pembayaran</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { label: "Tanggal Bayar", val: fmtTgl(tagihan.tglBayar) },
                  { label: "Metode", val: tagihan.metode || "—" },
                  { label: "No Rekening", val: tagihan.noRek || "—" },
                  { label: "Bank", val: tagihan.bank || "—" },
                ].map(r => (
                  <div key={r.label} style={{ background: "var(--s50)", borderRadius: 8, padding: "10px 12px" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "var(--s400)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3 }}>{r.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--s800)" }}>{r.val}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Timeline */}
          <div className="sec-div">Alur Tagihan</div>
          <div className="timeline">
            {timeline.map((t, i) => (
              <div key={i} className="tl-item">
                <div className="tl-dot" style={{ background: t.done ? t.color : "var(--s100)" }}>
                  <span style={{ fontSize: 12 }}>{t.done ? t.icon : "○"}</span>
                </div>
                <div className="tl-content">
                  <div className="tl-title" style={{ color: t.done ? "var(--s800)" : "var(--s400)" }}>{t.title}</div>
                  <div className="tl-sub">{t.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dp-foot">
          <button className="btn-ghost" onClick={() => onSuratTagihan(tagihan)}>📄 Surat Tagihan</button>
          <button className="btn-ghost" onClick={onClose}>Tutup</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PROGRESS RING SVG
// ============================================================
function ProgressRing({ pct, size = 64, color = "#f97316" }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * (pct / 100);
  return (
    <div className="ring-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f1f5f9" strokeWidth="6" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
      </svg>
      <div className="ring-center">
        <div style={{ fontSize: 13, fontWeight: 800, color }}>{pct}%</div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN MODULE
// ============================================================
export default function TagihanPenagihan({ userRole = "admin" }) {
  const [tagihanList, setTagihanList] = useState(TAGIHAN_DATA);
  const [filterBulan, setFilterBulan] = useState("Feb 2026");
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [showSurat, setShowSurat] = useState(null);
  const [toast, setToast] = useState(null);

  const bulanList = [...new Set(tagihanList.map(t => t.bulan))];

  // Filter
  const filtered = tagihanList.filter(t => {
    if (filterBulan !== "all" && t.bulan !== filterBulan) return false;
    if (filterStatus !== "all" && t.status !== filterStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!t.penghuni.toLowerCase().includes(q) && !String(t.kamar).includes(q)) return false;
    }
    return true;
  }).sort((a, b) => {
    const order = { telat: 0, pending: 1, lunas: 2 };
    return (order[a.status] ?? 3) - (order[b.status] ?? 3);
  });

  // Stats untuk bulan terpilih
  const bulanData = tagihanList.filter(t => t.bulan === filterBulan);
  const totalTagihan = bulanData.reduce((s, t) => s + t.jumlah, 0);
  const totalLunas  = bulanData.filter(t => t.status === "lunas").reduce((s, t) => s + t.jumlah, 0);
  const totalPiutang = bulanData.filter(t => t.status !== "lunas").reduce((s, t) => s + t.jumlah + (t.denda || 0), 0);
  const totalDenda  = bulanData.filter(t => t.denda).reduce((s, t) => s + (t.denda || 0), 0);
  const pctLunas    = bulanData.length ? Math.round((bulanData.filter(t => t.status === "lunas").length / bulanData.length) * 100) : 0;

  const handleKonfirmasi = (id, form) => {
    setTagihanList(prev => prev.map(t => t.id === id
      ? { ...t, status: "lunas", tglBayar: form.tglBayar, metode: form.metode, noRek: form.noRek, bank: form.metode.replace("Transfer ", "") }
      : t));
    const t = tagihanList.find(x => x.id === id);
    setSelected(null);
    setToast(`✓ Tagihan ${t?.penghuni} — ${t?.bulan} dikonfirmasi lunas!`);
  };

  return (
    <div className="fade-up">
      <StyleInjector />

      {/* TOPBAR */}
      <div className="topbar">
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--s400)", textTransform: "uppercase", letterSpacing: 1 }}>
          Tagihan & Penagihan
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn-ghost" onClick={() => setToast("📧 Reminder WA dikirim ke semua penyewa belum bayar")}>
            📧 Kirim Reminder WA
          </button>
          <button className="btn-primary" onClick={() => setToast("📄 Laporan tagihan diekspor")}>
            ↓ Export
          </button>
        </div>
      </div>

      {/* MONTH TABS */}
      <div className="month-tabs">
        {bulanList.map(b => (
          <button key={b} className={`mt-btn ${filterBulan === b ? "active" : ""}`} onClick={() => setFilterBulan(b)}>{b}</button>
        ))}
        <button className={`mt-btn ${filterBulan === "all" ? "active" : ""}`} onClick={() => setFilterBulan("all")}>Semua</button>
      </div>

      {/* STAT CARDS */}
      <div className="stat-row">
        <div className="stat-card" style={{ borderTopColor: "var(--or)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div className="sc-label">Total Tagihan</div>
              <div className="sc-val" style={{ fontSize: 18 }}>{fmtRp(totalTagihan)}</div>
              <div className="sc-sub">{bulanData.length} kamar</div>
            </div>
            <ProgressRing pct={pctLunas} />
          </div>
        </div>
        <div className="stat-card" style={{ borderTopColor: "var(--green)" }}>
          <div className="sc-label">Sudah Lunas</div>
          <div className="sc-val" style={{ color: "var(--green)", fontSize: 18 }}>{fmtRp(totalLunas)}</div>
          <div className="sc-sub">{bulanData.filter(t => t.status === "lunas").length} tagihan terbayar</div>
        </div>
        <div className="stat-card" style={{ borderTopColor: "var(--red)" }}>
          <div className="sc-label">Piutang</div>
          <div className="sc-val" style={{ color: "var(--red)", fontSize: 18 }}>{fmtRp(totalPiutang)}</div>
          <div className="sc-sub">{bulanData.filter(t => t.status !== "lunas").length} belum terbayar</div>
        </div>
        <div className="stat-card" style={{ borderTopColor: "var(--amber)" }}>
          <div className="sc-label">Total Denda</div>
          <div className="sc-val" style={{ color: "var(--amber)", fontSize: 18 }}>{fmtRp(totalDenda)}</div>
          <div className="sc-sub">{bulanData.filter(t => t.denda).length} kamar telat</div>
        </div>
      </div>

      {/* FILTER */}
      <div className="filter-row">
        <div className="search-box">
          <span style={{ color: "var(--s400)", fontSize: 14 }}>🔍</span>
          <input placeholder="Nama penyewa / kamar..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {[
          { id: "all",     label: "Semua" },
          { id: "pending", label: "⏳ Belum Bayar" },
          { id: "telat",   label: "🔴 Telat" },
          { id: "lunas",   label: "✓ Lunas" },
        ].map(f => (
          <div key={f.id} className={`chip ${filterStatus === f.id ? "active" : ""}`} onClick={() => setFilterStatus(f.id)}>
            {f.label}
          </div>
        ))}
        <div style={{ marginLeft: "auto", fontSize: 12, color: "var(--s400)" }}>{filtered.length} tagihan</div>
      </div>

      {/* TABLE */}
      <div className="tbl-wrap">
        <div className="tbl-head">
          {["ID","Penyewa","Kamar","Bulan","Jumlah","Jatuh Tempo","Status"].map(h => (
            <div key={h} className="th">{h}</div>
          ))}
        </div>
        {filtered.length === 0 ? (
          <div className="empty">
            <div style={{ fontSize: 36, marginBottom: 10 }}>📋</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--s700)" }}>Tidak ada tagihan</div>
          </div>
        ) : (
          filtered.map(t => {
            const sCfg = STATUS_CFG[t.status] || STATUS_CFG.pending;
            return (
              <div key={t.id} className={`tbl-row ${t.status === "telat" ? "telat-row" : ""}`} onClick={() => setSelected(t)}>
                <div className="td td-mono">{t.id}</div>
                <div className="td">
                  <div className="td-bold">{t.penghuni}</div>
                  <div style={{ fontSize: 11, color: "var(--s400)" }}>{t.tipe}</div>
                </div>
                <div className="td td-bold" style={{ color: "var(--or-d)" }}>K{t.kamar}</div>
                <div className="td">{t.bulan}</div>
                <div className="td td-rp">
                  {fmtRp(t.jumlah)}
                  {t.denda > 0 && <div style={{ fontSize: 10, color: "var(--red)", fontWeight: 700 }}>+{fmtRp(t.denda)} denda</div>}
                </div>
                <div className="td" style={{ fontSize: 12, color: t.status === "telat" ? "var(--red)" : "var(--s600)" }}>
                  {fmtTgl(t.jatuhTempo)}
                  {t.status === "telat" && <div style={{ fontSize: 10, color: "var(--red)", fontWeight: 700 }}>+{t.hariTelat}h</div>}
                </div>
                <div className="td">
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Badge color={sCfg.color} bg={sCfg.bg}>{sCfg.label}</Badge>
                    {t.status !== "lunas" && (
                      <button
                        style={{ fontSize: 10, padding: "3px 9px", background: "var(--green)", border: "none", borderRadius: 6, color: "#fff", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}
                        onClick={e => { e.stopPropagation(); setSelected(t); }}>
                        Konfirmasi
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* DETAIL PANEL */}
      {selected && (
        <DetailPanel
          tagihan={selected}
          onClose={() => setSelected(null)}
          onKonfirmasi={handleKonfirmasi}
          onSuratTagihan={(t) => { setSelected(null); setShowSurat(t); }}
        />
      )}

      {/* SURAT TAGIHAN MODAL */}
      {showSurat && (
        <SuratTagihan tagihan={showSurat} onClose={() => setShowSurat(null)} />
      )}

      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
