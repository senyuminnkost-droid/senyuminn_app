import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

// ============================================================
// HELPERS
// ============================================================
const fmtRp    = (n) => n ? "Rp " + Number(n).toLocaleString("id-ID") : "-";
const BLN      = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Ags","Sep","Okt","Nov","Des"];
const fmtTgl   = (s) => { if (!s) return "-"; const d = new Date(s); return `${d.getDate()} ${BLN[d.getMonth()]} ${d.getFullYear()}`; };
const addMonth = (s, m) => { const d = new Date(s); d.setMonth(d.getMonth() + m); return d.toISOString().split("T")[0]; };

const STATUS_KAMAR_CFG = {
  tersedia:    { label: "Tersedia",    color: "#16a34a", bg: "#dcfce7" },
  booked:      { label: "Booked",      color: "#b45309", bg: "#fef3c7" },
  terisi:      { label: "Terisi",      color: "#dc2626", bg: "#fee2e2" },
  "deep-clean":{ label: "Deep Clean",  color: "#1d4ed8", bg: "#dbeafe" },
  maintenance: { label: "Maintenance", color: "#c2410c", bg: "#ffedd5" },
};

const KONTRAK_DURASI_LIST = [3, 6, 12];
const HUBUNGAN_LIST       = ["Istri", "Suami", "Teman", "Saudara", "Rekan Kerja", "Lainnya"];

// ============================================================
// CSS — identik Modul08 (StyleInjector pakai ID, wb tanpa padding)
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
    --amber:#d97706;--teal:#0d9488;--purple:#7c3aed;
  }
  body{font-family:'Plus Jakarta Sans',sans-serif;background:var(--s50)}
  ::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-thumb{background:var(--s200);border-radius:4px}

  /* TAB NAV */
  .tab-nav{display:flex;gap:0;background:var(--white);border:1px solid var(--s200);border-radius:12px;padding:4px;margin-bottom:20px}
  .tab-btn{flex:1;padding:9px 12px;border-radius:9px;border:none;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.15s;color:var(--s400);background:transparent;display:flex;align-items:center;justify-content:center;gap:7px}
  .tab-btn:hover{color:var(--s700)}
  .tab-btn.active{background:linear-gradient(135deg,var(--or),var(--or-d));color:#fff;box-shadow:0 2px 10px rgba(249,115,22,0.3)}
  .tab-count{background:rgba(255,255,255,0.25);border-radius:10px;padding:1px 7px;font-size:10px;font-weight:800}
  .tab-btn:not(.active) .tab-count{background:var(--s100);color:var(--s600)}

  /* GRID */
  .section-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px}

  /* WIDGET — wb tanpa padding (sama Modul08) */
  .widget{background:var(--white);border:1px solid var(--s200);border-radius:12px;overflow:hidden}
  .wh{padding:12px 16px;border-bottom:1px solid var(--s100);display:flex;align-items:center;justify-content:space-between}
  .wh-title{font-size:12px;font-weight:800;color:var(--s800);display:flex;align-items:center;gap:6px}
  .wb{flex:1}
  .wb-pad{padding:14px 16px}

  /* KAMAR GRID */
  .kamar-avail-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:8px;padding:14px 16px}
  .ka-cell{border-radius:9px;padding:10px 8px;text-align:center;cursor:pointer;transition:all 0.15s;border:1.5px solid transparent}
  .ka-cell:hover{transform:translateY(-2px);box-shadow:0 4px 12px rgba(0,0,0,0.1)}
  .ka-num{font-size:14px;font-weight:800;color:var(--s800)}
  .ka-tipe{font-size:9px;color:var(--s400);margin-top:1px}
  .ka-penghuni{font-size:9px;font-weight:600;margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

  /* KONTRAK ROWS */
  .kontrak-row{display:flex;align-items:center;gap:10px;padding:10px 16px;border-bottom:1px solid var(--s100)}
  .kontrak-row:last-child{border-bottom:none}
  .kr-avatar{width:34px;height:34px;border-radius:9px;background:linear-gradient(135deg,var(--or),var(--or-d));display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:#fff;flex-shrink:0}
  .kr-name{font-size:13px;font-weight:700;color:var(--s800)}
  .kr-sub{font-size:11px;color:var(--s400);margin-top:1px}

  /* LOG ROWS */
  .log-row{display:flex;align-items:center;gap:10px;padding:10px 16px;border-bottom:1px solid var(--s100)}
  .log-row:last-child{border-bottom:none}
  .log-type-badge{width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0}
  .log-main{font-size:12.5px;font-weight:600;color:var(--s800)}
  .log-sub{font-size:11px;color:var(--s400);margin-top:1px}
  .log-time{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--s400);margin-left:auto;flex-shrink:0}

  /* STEPPER */
  .stepper{display:flex;align-items:center;margin-bottom:24px}
  .step-item{display:flex;align-items:center;gap:8px;flex:1}
  .step-item:last-child{flex:0}
  .step-circle{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;flex-shrink:0;transition:all 0.2s}
  .step-circle.pending{border:2px solid var(--s200);color:var(--s400);background:var(--white)}
  .step-circle.active{background:var(--or);color:#fff;box-shadow:0 0 0 4px rgba(249,115,22,0.15)}
  .step-circle.done{background:var(--green);color:#fff}
  .step-label{font-size:11px;font-weight:600}
  .step-label.active{color:var(--or)}
  .step-label.done{color:var(--green)}
  .step-label.pending{color:var(--s400)}
  .step-line{flex:1;height:2px;background:var(--s200);margin:0 4px;min-width:20px}
  .step-line.done{background:var(--green)}

  /* WIZARD */
  .wizard-card{background:var(--white);border:1px solid var(--s200);border-radius:14px;overflow:hidden}
  .wc-head{padding:20px 24px 16px;border-bottom:1px solid var(--s100);background:linear-gradient(135deg,var(--or-pale),var(--white))}
  .wc-body{padding:22px 24px}
  .wc-foot{padding:16px 24px;border-top:1px solid var(--s100);display:flex;justify-content:space-between;align-items:center}

  /* FORM FIELDS */
  .field{margin-bottom:16px}
  .field-label{font-size:11px;font-weight:700;color:var(--s600);text-transform:uppercase;letter-spacing:0.5px;display:block;margin-bottom:6px}
  .req{color:var(--red);margin-left:2px}
  .field-input,.field-select,.field-textarea{width:100%;background:var(--s50);border:1.5px solid var(--s200);border-radius:8px;padding:9px 13px;font-size:13px;color:var(--s800);font-family:'Plus Jakarta Sans',sans-serif;outline:none;transition:all 0.15s;box-sizing:border-box}
  .field-input:focus,.field-select:focus,.field-textarea:focus{border-color:var(--or);box-shadow:0 0 0 3px rgba(249,115,22,0.08);background:var(--white)}
  .field-textarea{resize:vertical;min-height:72px}
  .field-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  .field-row-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}

  /* PARTNER EDITOR */
  .partner-editor{background:var(--s50);border-radius:9px;padding:12px;margin-bottom:16px;border:1px solid var(--s200)}
  .pe-row{display:flex;gap:8px;align-items:center;margin-bottom:6px}
  .pe-input{flex:1;background:var(--white);border:1.5px solid var(--s200);border-radius:7px;padding:7px 10px;font-size:12px;color:var(--s800);font-family:'Plus Jakarta Sans',sans-serif;outline:none}
  .pe-input:focus{border-color:var(--or)}
  .pe-select{background:var(--white);border:1.5px solid var(--s200);border-radius:7px;padding:7px 10px;font-size:12px;color:var(--s700);font-family:'Plus Jakarta Sans',sans-serif;outline:none}
  .pe-del{background:#fee2e2;border:none;border-radius:6px;width:28px;height:28px;cursor:pointer;font-size:12px;color:var(--red);display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .pe-del:hover{background:var(--red);color:#fff}
  .pe-add{font-size:12px;font-weight:600;color:var(--or-d);cursor:pointer;display:inline-flex;align-items:center;gap:5px;padding:4px 0}

  /* REVIEW CARD */
  .review-card{background:linear-gradient(135deg,var(--s900),#1a0a00);border-radius:14px;padding:22px;color:#fff;position:relative;overflow:hidden;margin-bottom:16px}
  .review-card::before{content:'';position:absolute;top:-50px;right:-50px;width:180px;height:180px;border-radius:50%;background:radial-gradient(circle,rgba(249,115,22,0.2),transparent)}
  .review-card::after{content:'SENYUM INN · SURAT PERJANJIAN';position:absolute;bottom:12px;right:16px;font-size:9px;font-weight:800;letter-spacing:2px;color:rgba(255,255,255,0.08)}
  .rc-label{font-size:9px;font-weight:700;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.5px}
  .rc-val{font-size:13px;font-weight:700;color:#fff;margin-top:2px}
  .rc-name{font-size:22px;font-weight:800;color:#fff;margin:10px 0 4px}
  .rc-room{font-size:14px;color:var(--or);font-weight:600}
  .rc-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-top:16px}

  /* CHECKOUT */
  .condition-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:4px}
  .cond-btn{padding:10px 8px;border-radius:9px;border:1.5px solid var(--s200);background:var(--white);cursor:pointer;text-align:center;transition:all 0.12s;font-family:'Plus Jakarta Sans',sans-serif}
  .cond-btn:hover{border-color:var(--or-mid)}
  .cond-btn.selected{border-color:var(--or);background:var(--or-pale)}
  .cond-btn.baik.selected{border-color:var(--green);background:#f0fdf4}
  .cond-btn.sedang.selected{border-color:var(--amber);background:#fef3c7}
  .cond-btn.rusak.selected{border-color:var(--red);background:#fff5f5}
  .cond-icon{font-size:22px;margin-bottom:4px}
  .cond-label{font-size:12px;font-weight:700}
  .checkout-summary{background:var(--s50);border-radius:12px;padding:16px;margin-bottom:16px}
  .cs-row{display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid var(--s200)}
  .cs-row:last-child{border-bottom:none}
  .cs-label{font-size:12px;color:var(--s600);font-weight:500}
  .cs-val{font-size:13px;font-weight:700;color:var(--s800)}
  .cs-total{font-size:15px;font-weight:800;color:var(--or-d)}

  /* BOOKING QUEUE */
  .bq-card{background:var(--white);border:1.5px solid #fcd34d;border-radius:12px;padding:14px;display:flex;align-items:center;gap:12px;margin-bottom:10px;cursor:pointer;transition:all 0.15s}
  .bq-card:hover{border-color:var(--or);background:var(--or-pale)}
  .bq-avatar{width:38px;height:38px;border-radius:10px;background:linear-gradient(135deg,var(--amber),#b45309);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:#fff;flex-shrink:0}
  .bq-name{font-size:13px;font-weight:700;color:var(--s800)}
  .bq-sub{font-size:11px;color:var(--s400);margin-top:2px}

  /* SUCCESS */
  .success-state{text-align:center;padding:32px 20px}
  .success-icon{font-size:56px;margin-bottom:16px;animation:bounce 0.4s cubic-bezier(0.34,1.56,0.64,1)}
  @keyframes bounce{from{transform:scale(0.5);opacity:0}to{transform:scale(1);opacity:1}}
  .success-title{font-size:20px;font-weight:800;color:var(--s900);margin-bottom:6px}
  .success-sub{font-size:13px;color:var(--s600);margin-bottom:20px}
  .success-doc{background:var(--or-pale);border:1.5px solid var(--or-mid);border-radius:12px;padding:16px;display:flex;align-items:center;gap:12px;text-align:left;cursor:pointer;transition:all 0.15s;margin-bottom:8px}
  .success-doc:hover{border-color:var(--or);background:var(--or-light)}
  .doc-icon{font-size:28px;flex-shrink:0}
  .doc-title{font-size:13px;font-weight:700;color:var(--or-dd)}
  .doc-sub{font-size:11px;color:var(--s400);margin-top:2px}

  /* BADGE */
  .badge{display:inline-flex;align-items:center;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700;white-space:nowrap}
  .badge-lg{padding:4px 11px;font-size:11px;border-radius:8px}

  /* BUTTONS */
  .btn-primary{background:linear-gradient(135deg,var(--or),var(--or-d));color:#fff;border:none;border-radius:8px;padding:9px 20px;font-size:13px;font-weight:700;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all 0.15s;box-shadow:0 2px 8px rgba(249,115,22,0.25);display:inline-flex;align-items:center;gap:7px}
  .btn-primary:hover{filter:brightness(1.05)}
  .btn-primary:disabled{opacity:0.45;cursor:not-allowed}
  .btn-ghost{background:var(--s100);color:var(--s700);border:1px solid var(--s200);border-radius:8px;padding:9px 16px;font-size:13px;font-weight:600;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all 0.15s;display:inline-flex;align-items:center;gap:6px}
  .btn-ghost:hover{background:var(--s200)}
  .btn-danger{background:#fee2e2;color:var(--red);border:1px solid #fca5a5;border-radius:8px;padding:9px 16px;font-size:13px;font-weight:700;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all 0.15s;display:inline-flex;align-items:center;gap:6px}
  .btn-danger:hover{background:var(--red);color:#fff}
  .btn-green{background:#dcfce7;color:var(--green);border:1px solid #86efac;border-radius:8px;padding:9px 16px;font-size:13px;font-weight:700;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all 0.15s;display:inline-flex;align-items:center;gap:6px}
  .btn-green:hover{background:var(--green);color:#fff}
  .btn-sm{padding:5px 12px !important;font-size:11px !important;border-radius:7px !important}

  /* INFO BOX */
  .info-box{border-radius:10px;padding:11px 14px;display:flex;align-items:flex-start;gap:10px;margin-bottom:16px}
  .ib-icon{font-size:18px;flex-shrink:0;margin-top:1px}
  .ib-text{font-size:12px;font-weight:500;line-height:1.5}

  /* TOAST */
  .toaster{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--s900);color:#fff;padding:10px 22px;border-radius:30px;font-size:13px;font-weight:600;z-index:9999;box-shadow:0 8px 24px rgba(0,0,0,0.3);animation:toastIn 0.25s ease;white-space:nowrap}
  @keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}

  /* MODAL — portal, z-index 9999 (sama Modul08) */
  .modal-overlay{position:fixed;inset:0;background:rgba(15,23,42,0.6);display:flex;align-items:center;justify-content:center;z-index:9999;backdrop-filter:blur(2px);animation:pyFade 0.18s ease}
  @keyframes pyFade{from{opacity:0}to{opacity:1}}
  .modal-card{background:var(--white);border-radius:16px;width:460px;max-height:88vh;overflow-y:auto;box-shadow:0 24px 60px rgba(0,0,0,0.25);animation:popIn 0.2s cubic-bezier(0.34,1.56,0.64,1)}
  @keyframes popIn{from{transform:scale(0.95) translateY(8px);opacity:0}to{transform:scale(1) translateY(0);opacity:1}}
  .mc-head{padding:20px 24px 14px;border-bottom:1px solid var(--s100)}
  .mc-body{padding:18px 24px}
  .mc-foot{padding:14px 24px;border-top:1px solid var(--s100);display:flex;gap:8px;justify-content:flex-end}

  /* EMPTY */
  .py-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:50px 16px;color:var(--s400);text-align:center;gap:8px}
  .py-empty-icon{font-size:36px;opacity:0.4}
  .py-empty-title{font-size:14px;font-weight:700;color:var(--s700)}
  .py-empty-sub{font-size:12px;font-weight:500}

  @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  .fade-up{animation:fadeUp 0.25s ease forwards}

  @media(max-width:768px){.section-grid{grid-template-columns:1fr}.kamar-avail-grid{grid-template-columns:repeat(4,1fr)}.field-row-3{grid-template-columns:1fr 1fr}}
  @media(max-width:480px){.kamar-avail-grid{grid-template-columns:repeat(3,1fr)}.field-row,.field-row-3{grid-template-columns:1fr}}
`;

// StyleInjector — pakai ID agar tidak double-load (sama Modul08)
function StyleInjector() {
  useEffect(() => {
    const id = "senyuminn-checkin-css";
    if (document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id; el.textContent = CSS;
    document.head.appendChild(el);
    return () => { const e = document.getElementById(id); if (e) e.remove(); };
  }, []);
  return null;
}

function Badge({ color, bg, children, lg }) {
  return <span className={lg ? "badge badge-lg" : "badge"} style={{ color, background: bg }}>{children}</span>;
}

function Toast({ msg, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2500); return () => clearTimeout(t); }, []);
  return <div className="toaster">{msg}</div>;
}

// ============================================================
// STEPPER
// ============================================================
function Stepper({ steps, current }) {
  return (
    <div className="stepper">
      {steps.map((s, i) => {
        const isDone   = i < current;
        const isActive = i === current;
        return (
          <div key={i} className="step-item">
            <div className={`step-circle ${isDone ? "done" : isActive ? "active" : "pending"}`}>
              {isDone ? "✓" : i + 1}
            </div>
            <div>
              <div className={`step-label ${isDone ? "done" : isActive ? "active" : "pending"}`}>{s}</div>
            </div>
            {i < steps.length - 1 && <div className={`step-line ${isDone ? "done" : ""}`} />}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// SURAT PERJANJIAN — pakai createPortal (sama Modul08)
// ============================================================
function SuratPerjanjian({ data, onClose }) {
  const tglSelesai = data.tglMasuk ? addMonth(data.tglMasuk, data.durasi) : "-";
  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ width: 560 }} onClick={e => e.stopPropagation()}>
        <div className="mc-head">
          <div style={{ fontSize:16, fontWeight:800, color:"var(--s900)", marginBottom:2 }}>📄 Preview Surat Perjanjian</div>
          <div style={{ fontSize:12, color:"var(--s400)" }}>Siap untuk dicetak & ditandatangani manual</div>
        </div>
        <div className="mc-body">
          <div style={{ background:"var(--white)", border:"2px solid var(--s200)", borderRadius:10, padding:24, fontFamily:"serif", fontSize:13, lineHeight:1.8, color:"var(--s800)" }}>
            <div style={{ textAlign:"center", marginBottom:16 }}>
              <div style={{ fontSize:15, fontWeight:800, textTransform:"uppercase", letterSpacing:1 }}>SURAT PERJANJIAN SEWA KAMAR</div>
              <div style={{ fontSize:12, color:"var(--s400)" }}>Senyum Inn Exclusive Kost</div>
            </div>
            <div style={{ marginBottom:10 }}>Pada hari ini, tanggal <b>{fmtTgl(data.tglMasuk)}</b>, telah disepakati perjanjian sewa-menyewa antara:</div>
            <div style={{ paddingLeft:16, marginBottom:10 }}>
              <div><b>Pihak I (Pemilik):</b> Yusuf Vindra Asmara — Senyum Inn Exclusive Kost</div>
              <div><b>Pihak II (Penyewa):</b> {data.nama || "—"}, No. KTP: {data.ktpNo || "—"}</div>
            </div>
            <div style={{ marginBottom:10 }}>Pihak II menyewa <b>Kamar {data.kamar} ({data.tipeKamar})</b> dengan ketentuan:</div>
            <div style={{ paddingLeft:16, marginBottom:16 }}>
              <div>• Masa sewa: <b>{fmtTgl(data.tglMasuk)}</b> s/d <b>{fmtTgl(tglSelesai)}</b> ({data.durasi} bulan)</div>
              <div>• Harga sewa: <b>{fmtRp(data.harga)}</b>/bulan, dibayar lunas di muka</div>
              <div>• Denda keterlambatan: <b>Rp 50.000/hari</b> setelah tanggal 25</div>
              <div>• Kapasitas maks: <b>3 orang</b></div>
              <div>• Dilarang membawa hewan peliharaan</div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:40, marginTop:24 }}>
              {["Pihak I","Pihak II"].map(p => (
                <div key={p} style={{ textAlign:"center" }}>
                  <div style={{ fontSize:12 }}>{p === "Pihak I" ? "Pemilik" : "Penyewa"}</div>
                  <div style={{ height:50, borderBottom:"1px solid var(--s400)", marginBottom:4 }} />
                  <div style={{ fontSize:12, fontWeight:700 }}>{p === "Pihak I" ? "Yusuf Vindra Asmara" : (data.nama || "—")}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mc-foot">
          <button className="btn-ghost" onClick={onClose}>Tutup</button>
          <button className="btn-primary" onClick={() => { alert("PDF akan di-generate dan siap cetak."); onClose(); }}>
            🖨️ Print / Download PDF
          </button>
        </div>
      </div>
    </div>
  , document.body);
}

// ============================================================
// CHECK-IN WIZARD
// ============================================================
const CI_STEPS = ["Pilih Kamar", "Data Penyewa", "Kontrak & Bayar", "Konfirmasi"];
const todayISO = new Date().toISOString().split("T")[0];

function CheckInWizard({ onDone, prefillBooking, kamarList }) {
  const availableKamar = kamarList.filter(k => k.status === "tersedia" || k.status === "booked");

  const [step, setStep]         = useState(0);
  const [showSurat, setShowSurat] = useState(false);
  const [done, setDone]         = useState(false);
  const [form, setForm]         = useState(prefillBooking ? {
    kamar:     prefillBooking.kamar,
    tipeKamar: kamarList.find(k => k.id === prefillBooking.kamar)?.tipe || "",
    harga:     prefillBooking.harga,
    nama:      prefillBooking.nama,
    ktpNo: "", noHP: prefillBooking.noHP, noDarurat: "", namaDarurat: "",
    tglMasuk:  prefillBooking.tglRencana,
    durasi:    prefillBooking.durasi,
    partner:   [],
  } : {
    kamar: null, tipeKamar: "", harga: 0,
    nama: "", ktpNo: "", noHP: "", noDarurat: "", namaDarurat: "",
    tglMasuk: todayISO, durasi: 6, partner: [],
  });

  const set        = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const addPartner = () => { if (form.partner.length >= 2) return; setForm(f => ({ ...f, partner: [...f.partner, { nama:"", hubungan:"Teman" }] })); };
  const setPartner = (i, k, v) => { const arr = [...form.partner]; arr[i] = { ...arr[i], [k]: v }; setForm(f => ({ ...f, partner: arr })); };
  const delPartner = (i) => setForm(f => ({ ...f, partner: f.partner.filter((_, idx) => idx !== i) }));

  const tglSelesai = form.tglMasuk ? addMonth(form.tglMasuk, form.durasi) : "-";
  const totalBayar = form.harga * form.durasi;

  if (done) return (
    <div className="wizard-card">
      <div className="wc-body">
        <div className="success-state">
          <div className="success-icon">🎉</div>
          <div className="success-title">Check-in Berhasil!</div>
          <div className="success-sub"><b>{form.nama}</b> resmi menempati <b>Kamar {form.kamar}</b> mulai {fmtTgl(form.tglMasuk)}</div>
          <div className="success-doc" onClick={() => setShowSurat(true)}>
            <div className="doc-icon">📄</div>
            <div>
              <div className="doc-title">Surat Perjanjian Sewa</div>
              <div className="doc-sub">Siap cetak & tandatangan manual — Kamar {form.kamar} · {form.durasi} bulan</div>
            </div>
            <span style={{ marginLeft:"auto", fontSize:18 }}>→</span>
          </div>
          <div className="success-doc" style={{ cursor:"default", opacity:0.7 }}>
            <div className="doc-icon">💬</div>
            <div>
              <div className="doc-title">Notifikasi WA Terkirim</div>
              <div className="doc-sub">Selamat datang dikirim ke {form.noHP}</div>
            </div>
          </div>
          <div style={{ display:"flex", gap:10, justifyContent:"center", marginTop:8 }}>
            <button className="btn-ghost" onClick={onDone}>← Kembali</button>
            <button className="btn-primary" onClick={() => { setDone(false); setStep(0); setForm({ kamar:null, tipeKamar:"", harga:0, nama:"", ktpNo:"", noHP:"", noDarurat:"", namaDarurat:"", tglMasuk:todayISO, durasi:6, partner:[] }); }}>
              + Check-in Lagi
            </button>
          </div>
        </div>
      </div>
      {showSurat && <SuratPerjanjian data={form} onClose={() => setShowSurat(false)} />}
    </div>
  );

  return (
    <div className="wizard-card">
      <div className="wc-head">
        <div style={{ fontSize:16, fontWeight:800, color:"var(--s900)", marginBottom:14 }}>🔑 Proses Check-in</div>
        <Stepper steps={CI_STEPS} current={step} />
      </div>
      <div className="wc-body">

        {/* STEP 0 */}
        {step === 0 && (
          <div>
            <div style={{ fontSize:13, fontWeight:600, color:"var(--s600)", marginBottom:14 }}>Pilih kamar yang tersedia atau sudah di-booking:</div>
            {availableKamar.length === 0 ? (
              <div className="py-empty"><div className="py-empty-icon">🏠</div><div className="py-empty-title">Tidak ada kamar tersedia</div><div className="py-empty-sub">Semua kamar terisi atau dalam maintenance</div></div>
            ) : (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:16 }}>
                {availableKamar.map(k => {
                  const cfg = STATUS_KAMAR_CFG[k.status];
                  const isSel = form.kamar === k.id;
                  return (
                    <div key={k.id}
                      style={{ border:`2px solid ${isSel ? "var(--or)" : cfg.color+"55"}`, borderRadius:11, padding:12, cursor:"pointer", background: isSel ? "var(--or-pale)" : cfg.bg, transition:"all 0.15s", textAlign:"center" }}
                      onClick={() => { set("kamar", k.id); set("tipeKamar", k.tipe); set("harga", k.harga); }}>
                      <div style={{ fontSize:18, fontWeight:800, color: isSel ? "var(--or-d)" : "var(--s800)" }}>K{k.id}</div>
                      <div style={{ fontSize:10, color:"var(--s400)", marginTop:2 }}>{k.tipe}</div>
                      <div style={{ marginTop:5 }}><Badge color={cfg.color} bg={cfg.bg}>{cfg.label}</Badge></div>
                      <div style={{ fontSize:11, fontWeight:700, color:"var(--or-d)", marginTop:4 }}>{fmtRp(k.harga)}</div>
                    </div>
                  );
                })}
              </div>
            )}
            {form.kamar && (
              <div className="info-box" style={{ background:"var(--or-pale)", border:"1px solid var(--or-mid)" }}>
                <div className="ib-icon">✓</div>
                <div className="ib-text" style={{ color:"var(--or-dd)" }}><b>Kamar {form.kamar}</b> dipilih · {form.tipeKamar} · {fmtRp(form.harga)}/bulan</div>
              </div>
            )}
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <div>
            <div className="field">
              <label className="field-label">Nama Lengkap <span className="req">*</span></label>
              <input className="field-input" placeholder="Sesuai KTP" value={form.nama} onChange={e => set("nama", e.target.value)} />
            </div>
            <div className="field-row" style={{ marginBottom:16 }}>
              <div className="field">
                <label className="field-label">No KTP</label>
                <input className="field-input" placeholder="16 digit NIK" value={form.ktpNo} onChange={e => set("ktpNo", e.target.value)} />
              </div>
              <div className="field">
                <label className="field-label">No HP <span className="req">*</span></label>
                <input className="field-input" placeholder="08xxxxxxxxxx" value={form.noHP} onChange={e => set("noHP", e.target.value)} />
              </div>
            </div>
            <div className="field-row" style={{ marginBottom:16 }}>
              <div className="field">
                <label className="field-label">Kontak Darurat</label>
                <input className="field-input" placeholder="08xxxxxxxxxx" value={form.noDarurat} onChange={e => set("noDarurat", e.target.value)} />
              </div>
              <div className="field">
                <label className="field-label">Nama Darurat</label>
                <input className="field-input" placeholder="Nama (Hubungan)" value={form.namaDarurat} onChange={e => set("namaDarurat", e.target.value)} />
              </div>
            </div>
            <div className="partner-editor">
              <div style={{ fontSize:11, fontWeight:700, color:"var(--s600)", textTransform:"uppercase", letterSpacing:0.5, marginBottom:8 }}>
                Partner / Penghuni Tambahan ({form.partner.length}/2)
              </div>
              {form.partner.map((p, i) => (
                <div key={i} className="pe-row">
                  <input className="pe-input" placeholder="Nama partner" value={p.nama} onChange={e => setPartner(i, "nama", e.target.value)} />
                  <select className="pe-select" value={p.hubungan} onChange={e => setPartner(i, "hubungan", e.target.value)}>
                    {HUBUNGAN_LIST.map(h => <option key={h}>{h}</option>)}
                  </select>
                  <button className="pe-del" onClick={() => delPartner(i)}>✕</button>
                </div>
              ))}
              {form.partner.length < 2 && <div className="pe-add" onClick={addPartner}>+ Tambah Partner</div>}
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div>
            <div className="field-row-3" style={{ marginBottom:16 }}>
              <div className="field">
                <label className="field-label">Tgl Masuk <span className="req">*</span></label>
                <input className="field-input" type="date" value={form.tglMasuk} onChange={e => set("tglMasuk", e.target.value)} />
              </div>
              <div className="field">
                <label className="field-label">Durasi <span className="req">*</span></label>
                <select className="field-select" value={form.durasi} onChange={e => set("durasi", Number(e.target.value))}>
                  {KONTRAK_DURASI_LIST.map(d => <option key={d} value={d}>{d} Bulan</option>)}
                </select>
              </div>
              <div className="field">
                <label className="field-label">Harga/Bulan</label>
                <input className="field-input" type="number" value={form.harga} onChange={e => set("harga", Number(e.target.value))} />
              </div>
            </div>
            <div style={{ background:"var(--s50)", borderRadius:10, padding:14, marginBottom:16 }}>
              <div style={{ fontSize:11, fontWeight:700, color:"var(--s400)", textTransform:"uppercase", letterSpacing:0.8, marginBottom:10 }}>Ringkasan Kontrak</div>
              {[
                { label:"Kamar",    val:`${form.kamar} · ${form.tipeKamar}` },
                { label:"Mulai",    val:fmtTgl(form.tglMasuk) },
                { label:"Selesai",  val:fmtTgl(tglSelesai) },
                { label:"Durasi",   val:`${form.durasi} bulan` },
                { label:"Harga/bln",val:fmtRp(form.harga) },
              ].map(r => (
                <div key={r.label} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:"1px solid var(--s200)" }}>
                  <span style={{ fontSize:12, color:"var(--s600)" }}>{r.label}</span>
                  <span style={{ fontSize:12, fontWeight:700, color:"var(--s800)" }}>{r.val}</span>
                </div>
              ))}
              <div style={{ display:"flex", justifyContent:"space-between", padding:"10px 0 0" }}>
                <span style={{ fontSize:13, fontWeight:700, color:"var(--s800)" }}>Total Dibayar</span>
                <span style={{ fontSize:16, fontWeight:800, color:"var(--or-d)" }}>{fmtRp(totalBayar)}</span>
              </div>
            </div>
            <div className="info-box" style={{ background:"#f0fdf4", border:"1px solid #86efac" }}>
              <div className="ib-icon">💳</div>
              <div className="ib-text" style={{ color:"#15803d" }}>
                Pembayaran <b>{fmtRp(totalBayar)}</b> dikonfirmasi admin secara manual setelah transfer masuk ke rekening kost.
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div>
            <div className="review-card">
              <div className="rc-label">NIK</div>
              <div className="rc-val" style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12 }}>{form.ktpNo || "—"}</div>
              <div className="rc-name">{form.nama || "—"}</div>
              <div className="rc-room">Kamar {form.kamar} · {form.tipeKamar}</div>
              <div className="rc-grid">
                <div><div className="rc-label">No HP</div><div className="rc-val">{form.noHP || "—"}</div></div>
                <div><div className="rc-label">Kontrak</div><div className="rc-val">{fmtTgl(form.tglMasuk)} – {fmtTgl(tglSelesai)}</div></div>
                <div><div className="rc-label">Total Bayar</div><div className="rc-val" style={{ color:"var(--or)" }}>{fmtRp(totalBayar)}</div></div>
              </div>
            </div>
            {form.partner.length > 0 && (
              <div style={{ marginBottom:14 }}>
                <div style={{ fontSize:11, fontWeight:700, color:"var(--s400)", textTransform:"uppercase", letterSpacing:0.5, marginBottom:8 }}>Partner</div>
                {form.partner.map((p, i) => (
                  <div key={i} style={{ display:"flex", gap:10, alignItems:"center", padding:"7px 12px", background:"var(--s50)", borderRadius:8, marginBottom:5 }}>
                    <div style={{ width:28, height:28, borderRadius:7, background:"linear-gradient(135deg,var(--or),var(--or-d))", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:800, color:"#fff", flexShrink:0 }}>
                      {p.nama ? p.nama[0] : "?"}
                    </div>
                    <div>
                      <div style={{ fontSize:12, fontWeight:600, color:"var(--s800)" }}>{p.nama || "—"}</div>
                      <div style={{ fontSize:11, color:"var(--s400)" }}>{p.hubungan}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="info-box" style={{ background:"var(--or-pale)", border:"1px solid var(--or-mid)" }}>
              <div className="ib-icon">📄</div>
              <div className="ib-text" style={{ color:"var(--or-dd)" }}>
                Setelah konfirmasi, <b>Surat Perjanjian</b> akan otomatis di-generate dan siap dicetak untuk ditandatangani kedua pihak.
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="wc-foot">
        <button className="btn-ghost" onClick={() => step === 0 ? onDone() : setStep(s => s - 1)}>
          {step === 0 ? "← Batal" : "← Kembali"}
        </button>
        <div style={{ display:"flex", gap:8 }}>
          {step === 3 && <button className="btn-ghost" onClick={() => setShowSurat(true)}>📄 Preview Surat</button>}
          <button className="btn-primary"
            onClick={() => step < 3 ? setStep(s => s + 1) : setDone(true)}
            disabled={(step === 0 && !form.kamar) || (step === 1 && !form.nama)}>
            {step < 3 ? "Lanjut →" : "✓ Konfirmasi Check-in"}
          </button>
        </div>
      </div>
      {showSurat && <SuratPerjanjian data={form} onClose={() => setShowSurat(false)} />}
    </div>
  );
}

// ============================================================
// CHECK-OUT WIZARD
// ============================================================
const CO_STEPS = ["Pilih Kamar", "Kondisi Kamar", "Konfirmasi"];

function CheckOutWizard({ onDone, kamarList }) {
  const terisiKamar = kamarList.filter(k => k.status === "terisi");

  const [step,          setStep]          = useState(0);
  const [selectedKamar, setSelectedKamar] = useState(null);
  const [kondisi,       setKondisi]       = useState("baik");
  const [kerusakan,     setKerusakan]     = useState([{ item:"", biaya:"" }]);
  const [catatan,       setCatatan]       = useState("");
  const [done,          setDone]          = useState(false);

  const kamar           = selectedKamar ? kamarList.find(k => k.id === selectedKamar) : null;
  const totalKerusakan  = kerusakan.reduce((s, k) => s + (Number(k.biaya) || 0), 0);
  const deposit         = 500000;
  const refund          = Math.max(0, deposit - totalKerusakan);

  const addKerusakan = () => setKerusakan(prev => [...prev, { item:"", biaya:"" }]);
  const setKer       = (i, k, v) => setKerusakan(prev => { const arr = [...prev]; arr[i] = { ...arr[i], [k]: v }; return arr; });
  const delKer       = (i) => setKerusakan(prev => prev.filter((_, idx) => idx !== i));

  if (done) return (
    <div className="wizard-card">
      <div className="wc-body">
        <div className="success-state">
          <div className="success-icon">✅</div>
          <div className="success-title">Check-out Berhasil!</div>
          <div className="success-sub"><b>{kamar?.penghuni}</b> telah check-out dari <b>Kamar {selectedKamar}</b>. Kamar otomatis masuk antrian <b>Deep Clean</b>.</div>
          <div style={{ background:"#dbeafe", border:"1px solid #93c5fd", borderRadius:12, padding:14, display:"flex", gap:10, alignItems:"center", marginBottom:10, textAlign:"left" }}>
            <span style={{ fontSize:20 }}>🧹</span>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:"var(--blue)" }}>Status Kamar {selectedKamar} → Deep Clean</div>
              <div style={{ fontSize:11, color:"#1d4ed8", marginTop:1 }}>Notifikasi task dikirim ke staff & WA Grup</div>
            </div>
          </div>
          {refund > 0 && (
            <div style={{ background:"#f0fdf4", border:"1px solid #86efac", borderRadius:12, padding:14, display:"flex", gap:10, alignItems:"center", marginBottom:10, textAlign:"left" }}>
              <span style={{ fontSize:20 }}>💰</span>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:"var(--green)" }}>Deposit dikembalikan: {fmtRp(refund)}</div>
                <div style={{ fontSize:11, color:"#15803d", marginTop:1 }}>Proses transfer manual oleh admin keuangan</div>
              </div>
            </div>
          )}
          <button className="btn-ghost" onClick={onDone} style={{ marginTop:8 }}>← Kembali</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="wizard-card">
      <div className="wc-head">
        <div style={{ fontSize:16, fontWeight:800, color:"var(--s900)", marginBottom:14 }}>🚪 Proses Check-out</div>
        <Stepper steps={CO_STEPS} current={step} />
      </div>
      <div className="wc-body">

        {step === 0 && (
          <div>
            <div style={{ fontSize:13, fontWeight:600, color:"var(--s600)", marginBottom:14 }}>Pilih kamar yang akan check-out:</div>
            {terisiKamar.length === 0 ? (
              <div className="py-empty"><div className="py-empty-icon">🏠</div><div className="py-empty-title">Tidak ada kamar terisi</div></div>
            ) : (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
                {terisiKamar.map(k => (
                  <div key={k.id}
                    style={{ border:`2px solid ${selectedKamar === k.id ? "var(--or)" : "var(--s200)"}`, borderRadius:11, padding:12, cursor:"pointer", background: selectedKamar === k.id ? "var(--or-pale)" : "var(--white)", transition:"all 0.15s" }}
                    onClick={() => setSelectedKamar(k.id)}>
                    <div style={{ fontSize:16, fontWeight:800, color: selectedKamar === k.id ? "var(--or-d)" : "var(--s800)" }}>Kamar {k.id}</div>
                    <div style={{ fontSize:11, color:"var(--s400)", marginTop:2 }}>{k.tipe}</div>
                    <div style={{ fontSize:12, fontWeight:600, color:"var(--s700)", marginTop:4 }}>{k.penghuni}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 1 && (
          <div>
            <div style={{ fontSize:13, fontWeight:600, color:"var(--s700)", marginBottom:14 }}>Kamar {selectedKamar} — {kamar?.penghuni}</div>
            <div className="field">
              <label className="field-label">Kondisi Kamar</label>
              <div className="condition-grid">
                {[{ val:"baik", icon:"✅", label:"Baik" }, { val:"sedang", icon:"⚠️", label:"Ada Kerusakan Minor" }, { val:"rusak", icon:"🔴", label:"Kerusakan Signifikan" }].map(c => (
                  <div key={c.val} className={`cond-btn ${c.val} ${kondisi === c.val ? "selected" : ""}`} onClick={() => setKondisi(c.val)}>
                    <div className="cond-icon">{c.icon}</div>
                    <div className="cond-label">{c.label}</div>
                  </div>
                ))}
              </div>
            </div>
            {(kondisi === "sedang" || kondisi === "rusak") && (
              <div className="field">
                <label className="field-label">Detail Kerusakan</label>
                {kerusakan.map((k, i) => (
                  <div key={i} style={{ display:"flex", gap:8, marginBottom:6, alignItems:"center" }}>
                    <input className="field-input" placeholder="Item kerusakan" value={k.item} onChange={e => setKer(i, "item", e.target.value)} style={{ flex:2 }} />
                    <input className="field-input" type="number" placeholder="Biaya Rp" value={k.biaya} onChange={e => setKer(i, "biaya", e.target.value)} style={{ flex:1 }} />
                    {i > 0 && <button onClick={() => delKer(i)} style={{ background:"#fee2e2", border:"none", borderRadius:6, padding:"8px 10px", cursor:"pointer", color:"var(--red)", fontSize:12 }}>✕</button>}
                  </div>
                ))}
                <div className="pe-add" onClick={addKerusakan}>+ Tambah Item</div>
              </div>
            )}
            <div className="field">
              <label className="field-label">Catatan Tambahan</label>
              <textarea className="field-textarea" rows={2} placeholder="Kondisi lainnya, barang tertinggal, dll." value={catatan} onChange={e => setCatatan(e.target.value)} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="checkout-summary">
              <div style={{ fontSize:11, fontWeight:700, color:"var(--s400)", textTransform:"uppercase", letterSpacing:0.8, marginBottom:10 }}>Ringkasan Check-out</div>
              {[
                { label:"Penyewa",  val: kamar?.penghuni },
                { label:"Kamar",    val: `${selectedKamar} · ${kamar?.tipe}` },
                { label:"Kondisi",  val: kondisi === "baik" ? "✅ Baik" : kondisi === "sedang" ? "⚠️ Kerusakan Minor" : "🔴 Kerusakan Signifikan" },
                { label:"Deposit",  val: fmtRp(deposit) },
              ].map(r => (
                <div key={r.label} className="cs-row"><span className="cs-label">{r.label}</span><span className="cs-val">{r.val}</span></div>
              ))}
              {totalKerusakan > 0 && (
                <div className="cs-row"><span className="cs-label">Potongan Kerusakan</span><span className="cs-val" style={{ color:"var(--red)" }}>- {fmtRp(totalKerusakan)}</span></div>
              )}
              <div className="cs-row"><span className="cs-label" style={{ fontWeight:700 }}>Deposit Dikembalikan</span><span className="cs-total">{fmtRp(refund)}</span></div>
            </div>
            <div className="info-box" style={{ background:"#dbeafe", border:"1px solid #93c5fd" }}>
              <div className="ib-icon">🧹</div>
              <div className="ib-text" style={{ color:"var(--blue)" }}>Status kamar akan otomatis berubah ke <b>Deep Clean</b> dan task notifikasi dikirim ke staff.</div>
            </div>
          </div>
        )}
      </div>
      <div className="wc-foot">
        <button className="btn-ghost" onClick={() => step === 0 ? onDone() : setStep(s => s - 1)}>
          {step === 0 ? "← Batal" : "← Kembali"}
        </button>
        <button className={step === 2 ? "btn-danger" : "btn-primary"}
          onClick={() => step < 2 ? setStep(s => s + 1) : setDone(true)}
          disabled={step === 0 && !selectedKamar}>
          {step < 2 ? "Lanjut →" : "✓ Proses Check-out"}
        </button>
      </div>
    </div>
  );
}

// ============================================================
// PERPANJANG MODAL — pakai createPortal
// ============================================================
function PerpanjangModal({ kontrak, onClose, onSave }) {
  const [durasi, setDurasi] = useState(6);
  const tglBaru = addMonth(kontrak.selesai, durasi);

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="mc-head">
          <div style={{ fontSize:16, fontWeight:800, color:"var(--s900)", marginBottom:2 }}>⟳ Perpanjang Kontrak</div>
          <div style={{ fontSize:12, color:"var(--s400)" }}>Kamar {kontrak.kamar} — {kontrak.penghuni}</div>
        </div>
        <div className="mc-body">
          <div style={{ background:"var(--s50)", borderRadius:10, padding:12, marginBottom:16 }}>
            <div style={{ fontSize:11, color:"var(--s400)", marginBottom:4 }}>Kontrak saat ini berakhir:</div>
            <div style={{ fontSize:15, fontWeight:800, color:"var(--red)" }}>{fmtTgl(kontrak.selesai)}</div>
          </div>
          <div className="field">
            <label className="field-label">Durasi Perpanjangan</label>
            <div style={{ display:"flex", gap:8 }}>
              {KONTRAK_DURASI_LIST.map(d => (
                <div key={d}
                  style={{ flex:1, padding:"10px 8px", border:`2px solid ${durasi === d ? "var(--or)" : "var(--s200)"}`, borderRadius:9, textAlign:"center", cursor:"pointer", background: durasi === d ? "var(--or-pale)" : "var(--white)", transition:"all 0.12s" }}
                  onClick={() => setDurasi(d)}>
                  <div style={{ fontSize:16, fontWeight:800, color: durasi === d ? "var(--or-d)" : "var(--s800)" }}>{d}</div>
                  <div style={{ fontSize:10, color:"var(--s400)" }}>bulan</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background:"var(--or-pale)", border:"1px solid var(--or-mid)", borderRadius:10, padding:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
              <span style={{ fontSize:12, color:"var(--s600)" }}>Kontrak baru selesai</span>
              <span style={{ fontSize:13, fontWeight:800, color:"var(--or-d)" }}>{fmtTgl(tglBaru)}</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <span style={{ fontSize:12, color:"var(--s600)" }}>Total tagihan</span>
              <span style={{ fontSize:14, fontWeight:800, color:"var(--or-d)" }}>{fmtRp(kontrak.harga * durasi)}</span>
            </div>
          </div>
        </div>
        <div className="mc-foot">
          <button className="btn-ghost" onClick={onClose}>Batal</button>
          <button className="btn-primary" onClick={() => onSave(durasi)}>✓ Perpanjang Kontrak</button>
        </div>
      </div>
    </div>
  , document.body);
}

// ============================================================
// MAIN MODULE — data dari props, tidak ada hardcoded dummy
// ============================================================
export default function CheckInOut({ user, kamarList = [], penyewaList = [], riwayat = [], bookingQueue = [], kontrakHabis = [] }) {
  const [activeTab,      setActiveTab]      = useState("overview");
  const [showPerpanjang, setShowPerpanjang] = useState(null);
  const [toast,          setToast]          = useState(null);
  const [prefillBooking, setPrefillBooking] = useState(null);

  const handlePerpanjang = (durasi) => {
    setToast(`✓ Kontrak Kamar ${showPerpanjang.kamar} diperpanjang ${durasi} bulan`);
    setShowPerpanjang(null);
  };

  const handleBookingCheckin = (bk) => {
    setPrefillBooking(bk);
    setActiveTab("checkin");
  };

  return (
    <div className="fade-up">
      <StyleInjector />

      {/* TAB NAV */}
      <div className="tab-nav">
        {[
          { id:"overview", icon:"⊞", label:"Overview" },
          { id:"checkin",  icon:"🔑", label:"Check-in" },
          { id:"checkout", icon:"🚪", label:"Check-out" },
          { id:"riwayat",  icon:"📋", label:"Riwayat" },
        ].map(t => (
          <button key={t.id} className={`tab-btn ${activeTab === t.id ? "active" : ""}`}
            onClick={() => { setActiveTab(t.id); setPrefillBooking(null); }}>
            <span>{t.icon}</span> {t.label}
            {t.id === "overview" && bookingQueue.length > 0 && (
              <span className="tab-count">{bookingQueue.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {activeTab === "overview" && (
        <div>
          {/* Status Kamar */}
          <div className="widget" style={{ marginBottom:16 }}>
            <div className="wh">
              <div className="wh-title">⬡ Status Ketersediaan Kamar</div>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                {Object.entries(STATUS_KAMAR_CFG).map(([k, v]) => (
                  <div key={k} style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, color:"var(--s600)", fontWeight:500 }}>
                    <div style={{ width:7, height:7, borderRadius:"50%", background:v.color }} />
                    {v.label} ({kamarList.filter(km => km.status === k).length})
                  </div>
                ))}
              </div>
            </div>
            {kamarList.length === 0 ? (
              <div className="py-empty"><div className="py-empty-icon">🏠</div><div className="py-empty-title">Belum ada data kamar</div></div>
            ) : (
              <div className="kamar-avail-grid">
                {kamarList.map(k => {
                  const cfg = STATUS_KAMAR_CFG[k.status] || STATUS_KAMAR_CFG.tersedia;
                  return (
                    <div key={k.id} className="ka-cell"
                      style={{ background:cfg.bg, borderColor:cfg.color+"55", borderTopWidth:3, borderTopColor:cfg.color }}>
                      <div className="ka-num">K{k.id}</div>
                      <div className="ka-tipe">{k.tipe === "Premium" ? "PRE" : "REG"}</div>
                      <div style={{ marginTop:4 }}><Badge color={cfg.color} bg="transparent">{cfg.label}</Badge></div>
                      {k.penghuni && <div className="ka-penghuni" style={{ color:cfg.color }}>{k.penghuni.split(" ")[0]}</div>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="section-grid">
            {/* Antrian Booking */}
            <div className="widget">
              <div className="wh">
                <div className="wh-title">🟡 Antrian Booking</div>
                <Badge color="var(--amber)" bg="#fef3c7">{bookingQueue.length} menunggu</Badge>
              </div>
              <div className="wb">
                {bookingQueue.length === 0 ? (
                  <div className="py-empty" style={{ padding:"24px 16px" }}>
                    <div className="py-empty-icon">📋</div>
                    <div className="py-empty-title">Tidak ada booking</div>
                  </div>
                ) : bookingQueue.map(bk => (
                  <div key={bk.id} className="bq-card" style={{ margin:"10px 14px" }} onClick={() => handleBookingCheckin(bk)}>
                    <div className="bq-avatar">{bk.nama[0]}</div>
                    <div style={{ flex:1 }}>
                      <div className="bq-name">{bk.nama}</div>
                      <div className="bq-sub">Kamar {bk.kamar} · Rencana {fmtTgl(bk.tglRencana)} · {bk.durasi}bln</div>
                    </div>
                    <button className="btn-green" style={{ fontSize:11, padding:"6px 12px" }}>Check-in →</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Kontrak Mendekati Habis */}
            <div className="widget">
              <div className="wh">
                <div className="wh-title">⚠️ Kontrak Mendekati Habis</div>
                <Badge color="var(--red)" bg="#fee2e2">{kontrakHabis.length} kamar</Badge>
              </div>
              <div className="wb">
                {kontrakHabis.length === 0 ? (
                  <div className="py-empty" style={{ padding:"24px 16px" }}>
                    <div className="py-empty-icon">✅</div>
                    <div className="py-empty-title">Semua kontrak aman</div>
                  </div>
                ) : kontrakHabis.map((k, i) => (
                  <div key={i} className="kontrak-row">
                    <div className="kr-avatar">{k.penghuni[0]}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div className="kr-name">{k.penghuni}</div>
                      <div className="kr-sub">Kamar {k.kamar} · Berakhir {fmtTgl(k.selesai)}</div>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
                      <div style={{ fontSize:12, fontWeight:800, color: k.sisa <= 30 ? "var(--red)" : "var(--amber)" }}>{k.sisa}h lagi</div>
                      <button
                        style={{ fontSize:11, padding:"4px 10px", background:"var(--or-pale)", border:"1px solid var(--or-mid)", borderRadius:6, cursor:"pointer", fontWeight:600, color:"var(--or-d)", fontFamily:"inherit" }}
                        onClick={() => setShowPerpanjang(k)}>
                        Perpanjang
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHECK-IN */}
      {activeTab === "checkin" && (
        <CheckInWizard
          kamarList={kamarList}
          prefillBooking={prefillBooking}
          onDone={() => { setActiveTab("overview"); setPrefillBooking(null); }}
        />
      )}

      {/* CHECK-OUT */}
      {activeTab === "checkout" && (
        <CheckOutWizard kamarList={kamarList} onDone={() => setActiveTab("overview")} />
      )}

      {/* RIWAYAT */}
      {activeTab === "riwayat" && (
        <div className="widget">
          <div className="wh">
            <div className="wh-title">📋 Riwayat Check-in / Check-out</div>
            <span style={{ fontSize:12, color:"var(--s400)" }}>{riwayat.length} transaksi</span>
          </div>
          <div className="wb">
            {riwayat.length === 0 ? (
              <div className="py-empty"><div className="py-empty-icon">📋</div><div className="py-empty-title">Belum ada riwayat</div></div>
            ) : riwayat.map(r => (
              <div key={r.id} className="log-row">
                <div className="log-type-badge" style={{ background: r.type === "checkin" ? "#dcfce7" : "#dbeafe" }}>
                  {r.type === "checkin" ? "🔑" : "🚪"}
                </div>
                <div style={{ flex:1 }}>
                  <div className="log-main">{r.type === "checkin" ? "Check-in" : "Check-out"} — {r.penghuni}</div>
                  <div className="log-sub">Kamar {r.kamar} · {fmtTgl(r.tanggal)} {r.waktu ? `· ${r.waktu}` : ""} · by {r.by}</div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
                  <Badge color={r.status === "selesai" ? "var(--green)" : "var(--amber)"} bg={r.status === "selesai" ? "#dcfce7" : "#fef3c7"}>
                    {r.status === "selesai" ? "Selesai" : "Booked"}
                  </Badge>
                  <div className="log-time">{r.tanggal}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PERPANJANG MODAL */}
      {showPerpanjang && (
        <PerpanjangModal kontrak={showPerpanjang} onClose={() => setShowPerpanjang(null)} onSave={handlePerpanjang} />
      )}

      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
