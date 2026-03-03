import { useState, useEffect, useRef } from "react";

// ============================================================
// MOCK DATA
// ============================================================
const KAMAR_LIST = [
  { id: 1, tipe: "Premium", penghuni: "Budi Santoso" },
  { id: 2, tipe: "Reguler", penghuni: null },
  { id: 3, tipe: "Reguler", penghuni: "Dian Pratiwi" },
  { id: 4, tipe: "Premium", penghuni: "Ahmad Fauzi" },
  { id: 5, tipe: "Reguler", penghuni: null },
  { id: 6, tipe: "Reguler", penghuni: "Siti Rahayu" },
  { id: 7, tipe: "Premium", penghuni: "Rudi Hartono" },
  { id: 8, tipe: "Reguler", penghuni: null },
  { id: 9, tipe: "Reguler", penghuni: "Dewi Lestari" },
  { id: 10, tipe: "Premium", penghuni: "Prisca Aprilia" },
  { id: 11, tipe: "Reguler", penghuni: null },
  { id: 12, tipe: "Premium", penghuni: "Amalia Wulan" },
];

const KATEGORI_LIST = [
  "AC Bermasalah", "Air", "Listrik", "Bangunan",
  "Elektronik", "Aksesoris Kamar Mandi", "Lemari / Kabinet", "Lainnya",
];

const STAFF_LIST = [];

const INITIAL_TIKET = [];

// ============================================================
// CONSTANTS
// ============================================================
const STATUS_CFG = {
  "open":        { label: "Open",        color: "#dc2626", bg: "#fee2e2", border: "#fca5a5", step: 1 },
  "in-progress": { label: "In Progress", color: "#d97706", bg: "#fef3c7", border: "#fcd34d", step: 2 },
  "ditunda":     { label: "Ditunda",     color: "#7c3aed", bg: "#ede9fe", border: "#c4b5fd", step: 2 },
  "selesai":     { label: "Selesai",     color: "#16a34a", bg: "#dcfce7", border: "#86efac", step: 4 },
};

const PRIORITAS_CFG = {
  "urgent": { label: "🔴 URGENT", color: "#dc2626", bg: "#fee2e2" },
  "normal": { label: "Normal",    color: "#6b7280", bg: "#f3f4f6" },
};

const AREA_UMUM = ["Selasar Lt.1", "Selasar Lt.2", "Selasar Lt.3", "Kamar Mandi Lt.1", "Kamar Mandi Lt.2", "Kamar Mandi Lt.3", "Parkiran", "Kantor", "Taman", "Gerbang", "Tangga"];

// ============================================================
// HELPERS
// ============================================================
const fmtRp = (n) => n ? "Rp " + n.toLocaleString("id-ID") : "-";
const genId = (tikets) => {
  const nums = tikets.map(t => parseInt(t.id.replace("T", "")));
  const next = Math.max(...nums) + 1;
  return "T" + String(next).padStart(3, "0");
};
const now = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
};

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
    --white: #fff; --red: #dc2626; --green: #16a34a; --amber: #d97706;
  }
  body { font-family: 'Plus Jakarta Sans', sans-serif; background: var(--s50); }
  ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: var(--s200); border-radius: 4px; }

  .page { padding: 0; }

  /* ── TOP BAR ─── */
  .topbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
  .topbar-left { display: flex; align-items: center; gap: 10px; }
  .topbar-right { display: flex; align-items: center; gap: 8px; }

  /* ── SUMMARY PILLS ─── */
  .summary-row { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
  .summary-pill {
    display: flex; align-items: center; gap: 8px;
    background: var(--white); border: 1.5px solid var(--s200);
    border-radius: 10px; padding: 10px 16px; cursor: pointer;
    transition: all 0.15s; flex-shrink: 0;
  }
  .summary-pill:hover { border-color: var(--or-mid); background: var(--or-pale); }
  .summary-pill.active { border-color: var(--or); background: var(--or-pale); box-shadow: 0 0 0 3px rgba(249,115,22,0.12); }
  .pill-num { font-size: 20px; font-weight: 800; }
  .pill-label { font-size: 11px; font-weight: 600; color: var(--s400); text-transform: uppercase; letter-spacing: 0.5px; }

  /* ── FILTER BAR ─── */
  .filter-bar { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
  .filter-chip {
    padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;
    border: 1.5px solid var(--s200); background: var(--white); color: var(--s600);
    cursor: pointer; transition: all 0.15s;
  }
  .filter-chip:hover { border-color: var(--or-mid); color: var(--or-d); }
  .filter-chip.active { border-color: var(--or); background: var(--or); color: #fff; }
  .filter-sep { width: 1px; height: 20px; background: var(--s200); }

  /* ── TIKET TABLE ─── */
  .tiket-table { background: var(--white); border: 1px solid var(--s200); border-radius: 12px; overflow: hidden; }
  .table-head { display: grid; grid-template-columns: 90px 1fr 130px 110px 100px 90px 90px; gap: 0; background: var(--s50); border-bottom: 1px solid var(--s200); }
  .th { padding: 10px 14px; font-size: 10px; font-weight: 700; color: var(--s400); text-transform: uppercase; letter-spacing: 0.8px; }

  .tiket-row {
    display: grid; grid-template-columns: 90px 1fr 130px 110px 100px 90px 90px;
    border-bottom: 1px solid var(--s100); cursor: pointer;
    transition: background 0.1s; align-items: center;
  }
  .tiket-row:last-child { border-bottom: none; }
  .tiket-row:hover { background: var(--or-pale); }
  .tiket-row.urgent-row { border-left: 3px solid var(--red); }

  .td { padding: 12px 14px; font-size: 12.5px; color: var(--s700); }
  .td-id { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 600; color: var(--s400); }
  .td-title { font-weight: 600; color: var(--s800); line-height: 1.3; }
  .td-sub { font-size: 11px; color: var(--s400); margin-top: 2px; }

  /* ── BADGES ─── */
  .badge { display: inline-flex; align-items: center; gap: 3px; padding: 2px 8px; border-radius: 20px; font-size: 10px; font-weight: 700; white-space: nowrap; }
  .badge-lg { padding: 4px 10px; font-size: 11px; border-radius: 8px; }

  /* ── BUTTONS ─── */
  .btn-primary {
    background: linear-gradient(135deg, var(--or), var(--or-d)); color: #fff;
    border: none; border-radius: 8px; padding: 8px 16px; font-size: 13px; font-weight: 700;
    cursor: pointer; display: inline-flex; align-items: center; gap: 6px;
    font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s;
    box-shadow: 0 2px 8px rgba(249,115,22,0.3);
  }
  .btn-primary:hover { filter: brightness(1.05); box-shadow: 0 4px 14px rgba(249,115,22,0.4); }
  .btn-secondary {
    background: var(--s100); color: var(--s700); border: 1px solid var(--s200);
    border-radius: 8px; padding: 8px 14px; font-size: 12px; font-weight: 600;
    cursor: pointer; display: inline-flex; align-items: center; gap: 6px;
    font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s;
  }
  .btn-secondary:hover { background: var(--s200); }
  .btn-danger {
    background: #fee2e2; color: var(--red); border: 1px solid #fca5a5;
    border-radius: 8px; padding: 8px 14px; font-size: 12px; font-weight: 700;
    cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s;
  }
  .btn-danger:hover { background: var(--red); color: #fff; }

  /* ── MODAL ─── */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(15,23,42,0.6);
    display: flex; align-items: flex-start; justify-content: flex-end;
    z-index: 100; backdrop-filter: blur(2px);
    animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  .modal-panel {
    background: var(--white); width: 520px; height: 100vh;
    overflow-y: auto; display: flex; flex-direction: column;
    box-shadow: -8px 0 40px rgba(0,0,0,0.15);
    animation: slideIn 0.25s cubic-bezier(0.25,0.46,0.45,0.94);
  }
  @keyframes slideIn { from { transform: translateX(40px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

  .modal-header { padding: 20px 24px 16px; border-bottom: 1px solid var(--s100); flex-shrink: 0; }
  .modal-body { padding: 20px 24px; flex: 1; }
  .modal-footer { padding: 16px 24px; border-top: 1px solid var(--s100); display: flex; gap: 8px; flex-shrink: 0; }

  /* ── FORM MODAL ─── */
  .form-modal-overlay {
    position: fixed; inset: 0; background: rgba(15,23,42,0.6);
    display: flex; align-items: center; justify-content: center;
    z-index: 200; backdrop-filter: blur(2px);
    animation: fadeIn 0.2s ease;
  }
  .form-modal {
    background: var(--white); border-radius: 16px; width: 540px;
    max-height: 90vh; overflow-y: auto;
    box-shadow: 0 24px 60px rgba(0,0,0,0.25);
    animation: popIn 0.2s cubic-bezier(0.34,1.56,0.64,1);
  }
  @keyframes popIn { from { transform: scale(0.95) translateY(10px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }

  .form-header { padding: 20px 24px 16px; border-bottom: 1px solid var(--s100); }
  .form-body { padding: 20px 24px; }
  .form-footer { padding: 16px 24px; border-top: 1px solid var(--s100); display: flex; gap: 8px; justify-content: flex-end; }

  /* ── FORM FIELDS ─── */
  .field { margin-bottom: 16px; }
  .field-label { font-size: 11px; font-weight: 700; color: var(--s600); text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 6px; }
  .field-label .req { color: var(--red); margin-left: 2px; }
  .field-input, .field-select, .field-textarea {
    width: 100%; background: var(--s50); border: 1.5px solid var(--s200);
    border-radius: 8px; padding: 9px 12px; font-size: 13px; color: var(--s800);
    font-family: 'Plus Jakarta Sans', sans-serif; outline: none; transition: all 0.15s;
  }
  .field-input:focus, .field-select:focus, .field-textarea:focus {
    border-color: var(--or); background: var(--white); box-shadow: 0 0 0 3px rgba(249,115,22,0.1);
  }
  .field-textarea { resize: vertical; min-height: 80px; }
  .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

  /* ── RADIO CARDS ─── */
  .radio-group { display: flex; gap: 8px; }
  .radio-card {
    flex: 1; border: 1.5px solid var(--s200); border-radius: 9px; padding: 10px 12px;
    cursor: pointer; transition: all 0.15s; display: flex; align-items: center; gap: 8px;
  }
  .radio-card:hover { border-color: var(--or-mid); }
  .radio-card.selected { border-color: var(--or); background: var(--or-pale); }
  .radio-card.urgent-card.selected { border-color: var(--red); background: #fff5f5; }
  .radio-card-dot {
    width: 16px; height: 16px; border-radius: 50%; border: 2px solid var(--s200);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .radio-card.selected .radio-card-dot { border-color: var(--or); }
  .radio-card.selected .radio-card-dot::after { content: ''; width: 8px; height: 8px; border-radius: 50%; background: var(--or); display: block; }
  .radio-card.urgent-card.selected .radio-card-dot { border-color: var(--red); }
  .radio-card.urgent-card.selected .radio-card-dot::after { background: var(--red); }

  /* ── STATUS STEPPER ─── */
  .stepper { display: flex; align-items: center; gap: 0; margin: 16px 0; }
  .step { display: flex; align-items: center; gap: 6px; }
  .step-circle {
    width: 28px; height: 28px; border-radius: 50%; border: 2px solid var(--s200);
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; color: var(--s400); flex-shrink: 0;
    transition: all 0.2s;
  }
  .step-circle.done { background: var(--green); border-color: var(--green); color: #fff; }
  .step-circle.current { background: var(--or); border-color: var(--or); color: #fff; box-shadow: 0 0 0 4px rgba(249,115,22,0.15); }
  .step-label { font-size: 11px; font-weight: 600; color: var(--s400); }
  .step-label.current { color: var(--or); }
  .step-label.done { color: var(--green); }
  .step-line { flex: 1; height: 2px; background: var(--s200); margin: 0 6px; min-width: 20px; }
  .step-line.done { background: var(--green); }

  /* ── RIWAYAT TIMELINE ─── */
  .timeline { position: relative; }
  .timeline-item { display: flex; gap: 12px; padding-bottom: 14px; position: relative; }
  .timeline-item::before { content: ''; position: absolute; left: 6px; top: 14px; bottom: 0; width: 1px; background: var(--s100); }
  .timeline-item:last-child::before { display: none; }
  .timeline-dot { width: 13px; height: 13px; border-radius: 50%; background: var(--or-mid); border: 2px solid var(--or); flex-shrink: 0; margin-top: 2px; }
  .timeline-dot.first { background: var(--or); }
  .timeline-content { flex: 1; }
  .timeline-aksi { font-size: 12px; color: var(--s700); font-weight: 500; }
  .timeline-meta { font-size: 10px; color: var(--s400); margin-top: 2px; display: flex; gap: 8px; }

  /* ── INFO SECTION ─── */
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px; }
  .info-cell { background: var(--s50); border-radius: 8px; padding: 10px 12px; }
  .info-cell-label { font-size: 10px; font-weight: 700; color: var(--s400); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px; }
  .info-cell-value { font-size: 13px; font-weight: 600; color: var(--s800); }

  /* ── SECTION DIVIDER ─── */
  .sec-divider { font-size: 10px; font-weight: 700; color: var(--s400); text-transform: uppercase; letter-spacing: 1px; margin: 20px 0 10px; padding-bottom: 6px; border-bottom: 1px solid var(--s100); }

  /* ── URGENT BANNER ─── */
  .urgent-banner { background: #fff5f5; border: 1.5px solid #fca5a5; border-radius: 10px; padding: 10px 14px; margin-bottom: 16px; display: flex; align-items: center; gap: 10px; }
  .urgent-banner-icon { font-size: 20px; flex-shrink: 0; }
  .urgent-banner-text { font-size: 12px; color: var(--red); font-weight: 600; }

  /* ── BIAYA INPUT ─── */
  .biaya-box { background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 10px; padding: 14px; }
  .biaya-box-title { font-size: 11px; font-weight: 700; color: #15803d; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }

  /* ── STATUS ACTION ─── */
  .status-actions { display: flex; flex-direction: column; gap: 8px; }
  .status-action-btn {
    width: 100%; padding: 10px 14px; border-radius: 9px; border: 1.5px solid var(--s200);
    background: var(--white); cursor: pointer; display: flex; align-items: center; gap: 10px;
    font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 600; color: var(--s700);
    transition: all 0.15s; text-align: left;
  }
  .status-action-btn:hover { border-color: var(--or); background: var(--or-pale); color: var(--or-d); }
  .status-action-btn.danger:hover { border-color: var(--red); background: #fee2e2; color: var(--red); }

  /* ── EMPTY STATE ─── */
  .empty-state { padding: 60px 20px; text-align: center; color: var(--s400); }
  .empty-icon { font-size: 48px; margin-bottom: 12px; }
  .empty-title { font-size: 16px; font-weight: 700; color: var(--s700); margin-bottom: 6px; }
  .empty-sub { font-size: 13px; }

  /* ── SEARCH ─── */
  .search-box {
    display: flex; align-items: center; gap: 8px;
    background: var(--white); border: 1.5px solid var(--s200);
    border-radius: 9px; padding: 7px 12px; font-size: 13px;
    color: var(--s800); transition: all 0.15s;
  }
  .search-box:focus-within { border-color: var(--or); box-shadow: 0 0 0 3px rgba(249,115,22,0.1); }
  .search-box input { border: none; outline: none; background: transparent; font-size: 13px; color: var(--s800); font-family: 'Plus Jakarta Sans', sans-serif; width: 180px; }
  .search-box input::placeholder { color: var(--s400); }

  /* ── FADE UP ─── */
  @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  .fade-up { animation: fadeUp 0.25s ease forwards; }

  /* ── SELECT STATUS ─── */
  .sel-status {
    display: flex; gap: 6px; flex-wrap: wrap;
  }
  .sel-status-btn {
    padding: 6px 12px; border-radius: 7px; border: 1.5px solid var(--s200);
    font-size: 11px; font-weight: 700; cursor: pointer;
    background: var(--white); font-family: 'Plus Jakarta Sans', sans-serif;
    transition: all 0.15s;
  }
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
function Badge({ color, bg, children, lg }) {
  return <span className={lg ? "badge badge-lg" : "badge"} style={{ color, background: bg }}>{children}</span>;
}

// ============================================================
// STATUS STEPPER
// ============================================================
function StatusStepper({ status }) {
  const steps = [
    { key: "open", label: "Open" },
    { key: "in-progress", label: "In Progress" },
    { key: "ditunda", label: "Ditunda" },
    { key: "selesai", label: "Selesai" },
  ];

  const statusOrder = { "open": 1, "in-progress": 2, "ditunda": 2, "selesai": 4 };
  const currentStep = statusOrder[status];

  return (
    <div className="stepper">
      {steps.map((s, i) => {
        const stepNum = statusOrder[s.key] || i + 1;
        const isDone = stepNum < currentStep;
        const isCurrent = s.key === status;
        const isSkipped = s.key === "ditunda" && status === "in-progress";
        const isAlt = s.key === "in-progress" && status === "ditunda";
        const show = !(isSkipped || (isAlt && false));

        if (!show && s.key === "ditunda" && status !== "ditunda") return null;
        if (!show && s.key === "in-progress" && status === "ditunda") return null;

        return (
          <>
            {i > 0 && s.key !== "ditunda" && !(s.key === "in-progress" && status === "ditunda") && (
              <div className={`step-line ${isDone ? "done" : ""}`} key={`line-${i}`} />
            )}
            <div className="step" key={s.key}>
              <div className={`step-circle ${isDone ? "done" : ""} ${isCurrent ? "current" : ""}`}>
                {isDone ? "✓" : stepNum}
              </div>
              <div className={`step-label ${isCurrent ? "current" : ""} ${isDone ? "done" : ""}`}>
                {s.label}
              </div>
            </div>
          </>
        );
      })}
    </div>
  );
}

// ============================================================
// FORM — BUAT TIKET BARU
// ============================================================
function FormTiket({ onClose, onSave, editData }) {
  const isEdit = !!editData;
  const [form, setForm] = useState(editData ? {
    lokasi: editData.lokasi,
    kamar: editData.kamar,
    area: editData.area,
    kategori: editData.kategori,
    prioritas: editData.prioritas,
    deskripsi: editData.deskripsi,
  } : {
    lokasi: "kamar",
    kamar: "",
    area: "",
    kategori: "",
    prioritas: "normal",
    deskripsi: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (form.lokasi === "kamar" && !form.kamar) e.kamar = "Pilih kamar";
    if (form.lokasi === "umum" && !form.area) e.area = "Pilih area";
    if (!form.kategori) e.kategori = "Pilih kategori";
    if (!form.deskripsi.trim()) e.deskripsi = "Tulis deskripsi masalah";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave(form);
  };

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: null })); };

  return (
    <div className="form-modal-overlay" onClick={onClose}>
      <div className="form-modal" onClick={e => e.stopPropagation()}>
        <div className="form-header">
          <div style={{ fontSize: 17, fontWeight: 800, color: "var(--s900)", marginBottom: 3 }}>
            {isEdit ? "Edit Tiket" : "🔧 Buat Tiket Baru"}
          </div>
          <div style={{ fontSize: 12, color: "var(--s400)" }}>
            {isEdit ? `Edit data tiket ${editData.id}` : "Laporkan keluhan atau masalah fasilitas"}
          </div>
        </div>

        <div className="form-body">
          {/* Prioritas */}
          <div className="field">
            <label className="field-label">Prioritas <span className="req">*</span></label>
            <div className="radio-group">
              {[
                { val: "normal", label: "Normal", sub: "Jadwalkan penanganan", icon: "🟡" },
                { val: "urgent", label: "URGENT", sub: "Notif WA langsung", icon: "🔴" },
              ].map(p => (
                <div key={p.val}
                  className={`radio-card ${p.val === "urgent" ? "urgent-card" : ""} ${form.prioritas === p.val ? "selected" : ""}`}
                  onClick={() => set("prioritas", p.val)}>
                  <div className="radio-card-dot" />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: p.val === "urgent" ? "var(--red)" : "var(--s800)" }}>
                      {p.icon} {p.label}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--s400)", marginTop: 1 }}>{p.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lokasi */}
          <div className="field">
            <label className="field-label">Lokasi <span className="req">*</span></label>
            <div className="radio-group">
              {[
                { val: "kamar", label: "Unit Kamar", icon: "🏠" },
                { val: "umum", label: "Fasilitas Umum", icon: "🏢" },
              ].map(l => (
                <div key={l.val}
                  className={`radio-card ${form.lokasi === l.val ? "selected" : ""}`}
                  onClick={() => { set("lokasi", l.val); set("kamar", ""); set("area", ""); }}>
                  <div className="radio-card-dot" />
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--s800)" }}>{l.icon} {l.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Kamar / Area */}
          {form.lokasi === "kamar" ? (
            <div className="field">
              <label className="field-label">Pilih Kamar <span className="req">*</span></label>
              <select className="field-select" value={form.kamar || ""} onChange={e => set("kamar", Number(e.target.value))}>
                <option value="">— Pilih Kamar —</option>
                {KAMAR_LIST.map(k => (
                  <option key={k.id} value={k.id}>
                    Kamar {k.id} ({k.tipe}){k.penghuni ? ` — ${k.penghuni}` : " — Kosong"}
                  </option>
                ))}
              </select>
              {errors.kamar && <div style={{ fontSize: 11, color: "var(--red)", marginTop: 4 }}>⚠ {errors.kamar}</div>}
            </div>
          ) : (
            <div className="field">
              <label className="field-label">Pilih Area <span className="req">*</span></label>
              <select className="field-select" value={form.area || ""} onChange={e => set("area", e.target.value)}>
                <option value="">— Pilih Area —</option>
                {AREA_UMUM.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
              {errors.area && <div style={{ fontSize: 11, color: "var(--red)", marginTop: 4 }}>⚠ {errors.area}</div>}
            </div>
          )}

          {/* Kategori */}
          <div className="field">
            <label className="field-label">Kategori Masalah <span className="req">*</span></label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {KATEGORI_LIST.map(k => (
                <button key={k} type="button"
                  onClick={() => set("kategori", k)}
                  style={{
                    padding: "6px 12px", borderRadius: 7, border: "1.5px solid",
                    fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                    borderColor: form.kategori === k ? "var(--or)" : "var(--s200)",
                    background: form.kategori === k ? "var(--or)" : "var(--white)",
                    color: form.kategori === k ? "#fff" : "var(--s700)",
                    transition: "all 0.12s",
                  }}>
                  {k}
                </button>
              ))}
            </div>
            {errors.kategori && <div style={{ fontSize: 11, color: "var(--red)", marginTop: 6 }}>⚠ {errors.kategori}</div>}
          </div>

          {/* Deskripsi */}
          <div className="field">
            <label className="field-label">Deskripsi Masalah <span className="req">*</span></label>
            <textarea className="field-textarea"
              placeholder="Jelaskan masalah secara detail — kapan terjadi, gejala, dll."
              value={form.deskripsi} onChange={e => set("deskripsi", e.target.value)}
              rows={4} />
            {errors.deskripsi && <div style={{ fontSize: 11, color: "var(--red)", marginTop: 4 }}>⚠ {errors.deskripsi}</div>}
          </div>

          {form.prioritas === "urgent" && (
            <div className="urgent-banner">
              <div className="urgent-banner-icon">🔴</div>
              <div>
                <div className="urgent-banner-text">Tiket URGENT akan langsung dikirim via notifikasi WhatsApp ke admin & PJ operasional.</div>
                <div style={{ fontSize: 11, color: "#ef4444", marginTop: 2 }}>Staff langsung tindak lanjut tanpa perlu tunggu jadwal.</div>
              </div>
            </div>
          )}
        </div>

        <div className="form-footer">
          <button className="btn-secondary" onClick={onClose}>Batal</button>
          <button className="btn-primary" onClick={handleSave}>
            {isEdit ? "Simpan Perubahan" : "✓ Buat Tiket"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// FORM — UPDATE STATUS (update progress, biaya, resolusi)
// ============================================================
function FormUpdateStatus({ tiket, onClose, onSave }) {
  const [status, setStatus] = useState(tiket.status);
  const [assignee, setAssignee] = useState(tiket.assignee || "");
  const [biaya, setBiaya] = useState(tiket.biaya || "");
  const [resolusi, setResolusi] = useState(tiket.resolusi || "");

  const handleSave = () => {
    onSave({ status, assignee: assignee || null, biaya: biaya ? Number(biaya) : null, resolusi: resolusi || null });
  };

  const nextStatuses = {
    "open": ["in-progress", "ditunda"],
    "in-progress": ["selesai", "ditunda"],
    "ditunda": ["in-progress", "selesai"],
    "selesai": [],
  };

  const available = nextStatuses[tiket.status] || [];

  return (
    <div className="form-modal-overlay" onClick={onClose}>
      <div className="form-modal" style={{ width: 460 }} onClick={e => e.stopPropagation()}>
        <div className="form-header">
          <div style={{ fontSize: 16, fontWeight: 800, color: "var(--s900)", marginBottom: 3 }}>Update Status Tiket</div>
          <div style={{ fontSize: 12, color: "var(--s400)" }}>#{tiket.id} — {tiket.kategori}</div>
        </div>
        <div className="form-body">
          {available.length > 0 && (
            <div className="field">
              <label className="field-label">Ubah Status ke</label>
              <div className="sel-status">
                {available.map(s => (
                  <button key={s} className="sel-status-btn"
                    style={{
                      background: status === s ? STATUS_CFG[s].bg : "var(--white)",
                      borderColor: status === s ? STATUS_CFG[s].color : "var(--s200)",
                      color: status === s ? STATUS_CFG[s].color : "var(--s600)",
                    }}
                    onClick={() => setStatus(s)}>
                    {STATUS_CFG[s].label}
                  </button>
                ))}
                <button className="sel-status-btn"
                  style={{
                    background: status === tiket.status ? STATUS_CFG[tiket.status].bg : "var(--white)",
                    borderColor: status === tiket.status ? STATUS_CFG[tiket.status].color : "var(--s200)",
                    color: status === tiket.status ? STATUS_CFG[tiket.status].color : "var(--s600)",
                  }}
                  onClick={() => setStatus(tiket.status)}>
                  Tetap {STATUS_CFG[tiket.status].label}
                </button>
              </div>
            </div>
          )}

          <div className="field">
            <label className="field-label">Ditugaskan ke</label>
            <select className="field-select" value={assignee} onChange={e => setAssignee(e.target.value)}>
              <option value="">— Belum ditugaskan —</option>
              {STAFF_LIST.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          {(status === "selesai" || tiket.status === "in-progress") && (
            <div className="biaya-box">
              <div className="biaya-box-title">✓ Input Biaya & Resolusi</div>
              <div className="field" style={{ marginBottom: 10 }}>
                <label className="field-label">Biaya Perbaikan (Rp)</label>
                <input className="field-input" type="number" placeholder="0" value={biaya} onChange={e => setBiaya(e.target.value)} />
                <div style={{ fontSize: 10, color: "var(--s400)", marginTop: 3 }}>Kosongkan jika tidak ada biaya</div>
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label className="field-label">Catatan Resolusi</label>
                <textarea className="field-textarea" rows={2} placeholder="Jelaskan apa yang sudah dilakukan..." value={resolusi} onChange={e => setResolusi(e.target.value)} />
              </div>
            </div>
          )}
        </div>
        <div className="form-footer">
          <button className="btn-secondary" onClick={onClose}>Batal</button>
          <button className="btn-primary" onClick={handleSave}>Simpan Update</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// DETAIL PANEL (slide-in dari kanan)
// ============================================================
function DetailPanel({ tiket, onClose, onEdit, onUpdate, onDelete }) {
  const kamarInfo = tiket.kamar ? KAMAR_LIST.find(k => k.id === tiket.kamar) : null;
  const assigneeInfo = tiket.assignee ? STAFF_LIST.find(s => s.id === tiket.assignee) : null;
  const sCfg = STATUS_CFG[tiket.status];
  const pCfg = PRIORITAS_CFG[tiket.prioritas];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "var(--s400)", marginBottom: 4 }}>
                {tiket.id} · {tiket.tanggal}
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "var(--s900)", lineHeight: 1.2 }}>
                {tiket.kategori}
              </div>
              <div style={{ fontSize: 13, color: "var(--s600)", marginTop: 3 }}>
                {tiket.lokasi === "kamar" ? `Kamar ${tiket.kamar} — ${kamarInfo?.penghuni || "Kosong"}` : tiket.area}
              </div>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "var(--s400)", padding: 4 }}>✕</button>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Badge color={sCfg.color} bg={sCfg.bg} lg>{sCfg.label}</Badge>
            <Badge color={pCfg.color} bg={pCfg.bg} lg>{pCfg.label}</Badge>
          </div>

          {/* Progress stepper */}
          <StatusStepper status={tiket.status} />
        </div>

        {/* Body */}
        <div className="modal-body">
          {tiket.prioritas === "urgent" && tiket.status !== "selesai" && (
            <div className="urgent-banner">
              <div className="urgent-banner-icon">🔴</div>
              <div className="urgent-banner-text">Tiket URGENT — butuh tindakan segera!</div>
            </div>
          )}

          {/* Info Grid */}
          <div className="info-grid">
            <div className="info-cell">
              <div className="info-cell-label">Lokasi</div>
              <div className="info-cell-value">
                {tiket.lokasi === "kamar" ? `Kamar ${tiket.kamar} (${kamarInfo?.tipe})` : tiket.area}
              </div>
            </div>
            <div className="info-cell">
              <div className="info-cell-label">Penghuni</div>
              <div className="info-cell-value">{kamarInfo?.penghuni || (tiket.lokasi === "umum" ? "—" : "Kosong")}</div>
            </div>
            <div className="info-cell">
              <div className="info-cell-label">Kategori</div>
              <div className="info-cell-value">{tiket.kategori}</div>
            </div>
            <div className="info-cell">
              <div className="info-cell-label">Ditugaskan ke</div>
              <div className="info-cell-value">{assigneeInfo ? assigneeInfo.name : "Belum ditugaskan"}</div>
            </div>
          </div>

          {/* Deskripsi */}
          <div className="sec-divider">Deskripsi Masalah</div>
          <div style={{ fontSize: 13, color: "var(--s700)", lineHeight: 1.6, background: "var(--s50)", borderRadius: 8, padding: "10px 12px" }}>
            {tiket.deskripsi}
          </div>

          {/* Biaya & Resolusi (jika ada) */}
          {(tiket.biaya || tiket.resolusi) && (
            <>
              <div className="sec-divider">Hasil Penanganan</div>
              <div className="info-grid">
                {tiket.biaya && (
                  <div className="info-cell" style={{ background: "#f0fdf4", border: "1px solid #86efac" }}>
                    <div className="info-cell-label" style={{ color: "var(--green)" }}>Biaya Perbaikan</div>
                    <div className="info-cell-value" style={{ color: "var(--green)" }}>{fmtRp(tiket.biaya)}</div>
                  </div>
                )}
                {tiket.resolusi && (
                  <div className="info-cell" style={{ gridColumn: tiket.biaya ? "auto" : "1 / -1" }}>
                    <div className="info-cell-label">Catatan Resolusi</div>
                    <div className="info-cell-value" style={{ fontSize: 12, fontWeight: 500 }}>{tiket.resolusi}</div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Riwayat */}
          <div className="sec-divider">Riwayat Tiket</div>
          <div className="timeline">
            {[...tiket.riwayat].reverse().map((r, i) => (
              <div key={i} className="timeline-item">
                <div className={`timeline-dot ${i === tiket.riwayat.length - 1 ? "first" : ""}`} />
                <div className="timeline-content">
                  <div className="timeline-aksi">{r.aksi}</div>
                  <div className="timeline-meta">
                    <span>{r.waktu}</span>
                    <span>·</span>
                    <span>{r.aktor}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          {tiket.status !== "selesai" && (
            <>
              <button className="btn-primary" style={{ flex: 1 }} onClick={onUpdate}>Update Status</button>
              <button className="btn-secondary" onClick={onEdit}>Edit</button>
            </>
          )}
          {tiket.status === "selesai" && (
            <button className="btn-secondary" style={{ flex: 1 }} onClick={onEdit}>Lihat Detail Lengkap</button>
          )}
          <button className="btn-danger" onClick={onDelete}>Hapus</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN MODULE
// ============================================================
export default function KeluhanTiket({ userRole = "admin" }) {
  const [tikets, setTikets] = useState(INITIAL_TIKET);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPrioritas, setFilterPrioritas] = useState("all");
  const [filterKategori, setFilterKategori] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedTiket, setSelectedTiket] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editTiket, setEditTiket] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  // inject css
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = CSS;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  // Counts
  const counts = {
    all: tikets.length,
    open: tikets.filter(t => t.status === "open").length,
    "in-progress": tikets.filter(t => t.status === "in-progress").length,
    ditunda: tikets.filter(t => t.status === "ditunda").length,
    selesai: tikets.filter(t => t.status === "selesai").length,
    urgent: tikets.filter(t => t.prioritas === "urgent" && t.status !== "selesai").length,
  };

  // Filter
  const filtered = tikets.filter(t => {
    if (filterStatus !== "all" && t.status !== filterStatus) return false;
    if (filterPrioritas !== "all" && t.prioritas !== filterPrioritas) return false;
    if (filterKategori !== "all" && t.kategori !== filterKategori) return false;
    if (search) {
      const q = search.toLowerCase();
      const kamarMatch = t.kamar && String(t.kamar).includes(q);
      const descMatch = t.deskripsi.toLowerCase().includes(q);
      const katMatch = t.kategori.toLowerCase().includes(q);
      const idMatch = t.id.toLowerCase().includes(q);
      if (!kamarMatch && !descMatch && !katMatch && !idMatch) return false;
    }
    return true;
  }).sort((a, b) => {
    // Urgent open first
    if (a.prioritas === "urgent" && a.status !== "selesai" && !(b.prioritas === "urgent" && b.status !== "selesai")) return -1;
    if (b.prioritas === "urgent" && b.status !== "selesai" && !(a.prioritas === "urgent" && a.status !== "selesai")) return 1;
    // Then by date desc
    return b.tanggal.localeCompare(a.tanggal);
  });

  // Handlers
  const handleCreate = (form) => {
    const newId = genId(tikets);
    const newTiket = {
      id: newId,
      ...form,
      status: "open",
      tanggal: now().split(" ")[0],
      assignee: null,
      biaya: null,
      resolusi: null,
      riwayat: [{ waktu: now(), aksi: `Tiket ${form.prioritas === "urgent" ? "URGENT " : ""}dibuat`, aktor: "Admin" }],
    };
    setTikets(prev => [newTiket, ...prev]);
    setShowForm(false);
  };

  const handleEdit = (form) => {
    setTikets(prev => prev.map(t => t.id === editTiket.id ? {
      ...t, ...form,
      riwayat: [...t.riwayat, { waktu: now(), aksi: "Data tiket diperbarui", aktor: "Admin" }],
    } : t));
    setEditTiket(null);
    setSelectedTiket(prev => prev ? { ...prev, ...form } : null);
  };

  const handleUpdateStatus = (updates) => {
    const oldTiket = selectedTiket;
    const riwayatNew = [];
    if (updates.status !== oldTiket.status) {
      riwayatNew.push({ waktu: now(), aksi: `Status diubah: ${STATUS_CFG[oldTiket.status].label} → ${STATUS_CFG[updates.status].label}`, aktor: "Admin" });
    }
    if (updates.assignee && updates.assignee !== oldTiket.assignee) {
      const st = STAFF_LIST.find(s => s.id == updates.assignee);
      riwayatNew.push({ waktu: now(), aksi: `Ditugaskan ke ${st?.name || "Staff"}`, aktor: "Admin" });
    }
    if (updates.biaya) riwayatNew.push({ waktu: now(), aksi: `Biaya Rp ${Number(updates.biaya).toLocaleString("id-ID")} diinput`, aktor: "Admin" });
    if (updates.resolusi && updates.resolusi !== oldTiket.resolusi) riwayatNew.push({ waktu: now(), aksi: "Catatan resolusi ditambahkan", aktor: "Admin" });

    const updated = {
      ...oldTiket, ...updates, assignee: updates.assignee ? Number(updates.assignee) : null,
      riwayat: [...oldTiket.riwayat, ...riwayatNew],
    };
    setTikets(prev => prev.map(t => t.id === oldTiket.id ? updated : t));
    setSelectedTiket(updated);
    setShowUpdateForm(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Hapus tiket ${selectedTiket.id}?`)) {
      setTikets(prev => prev.filter(t => t.id !== selectedTiket.id));
      setSelectedTiket(null);
    }
  };

  return (
    <div className="page fade-up">
      {/* TOP BAR */}
      <div className="topbar">
        <div className="topbar-left">
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--s400)", textTransform: "uppercase", letterSpacing: 1 }}>
            Keluhan & Tiket
          </div>
          {counts.urgent > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 20, padding: "3px 10px" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--red)", animation: "pulse-dot 1.5s infinite" }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--red)" }}>{counts.urgent} urgent belum ditangani</span>
            </div>
          )}
        </div>
        <div className="topbar-right">
          <div className="search-box">
            <span style={{ color: "var(--s400)", fontSize: 14 }}>🔍</span>
            <input placeholder="Cari tiket, kamar, kategori..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="btn-primary" onClick={() => setShowForm(true)}>+ Buat Tiket</button>
        </div>
      </div>

      {/* SUMMARY PILLS */}
      <div className="summary-row">
        {[
          { key: "all",         label: "Semua",       num: counts.all,         color: "var(--s700)", numColor: "var(--s800)" },
          { key: "open",        label: "Open",        num: counts.open,        color: "var(--red)",   numColor: "var(--red)" },
          { key: "in-progress", label: "In Progress", num: counts["in-progress"], color: "var(--amber)", numColor: "var(--amber)" },
          { key: "ditunda",     label: "Ditunda",     num: counts.ditunda,     color: "#7c3aed",      numColor: "#7c3aed" },
          { key: "selesai",     label: "Selesai",     num: counts.selesai,     color: "var(--green)", numColor: "var(--green)" },
        ].map(p => (
          <div key={p.key} className={`summary-pill ${filterStatus === p.key ? "active" : ""}`}
            onClick={() => setFilterStatus(p.key)}>
            <div className="pill-num" style={{ color: p.numColor }}>{p.num}</div>
            <div className="pill-label">{p.label}</div>
          </div>
        ))}
      </div>

      {/* FILTER BAR */}
      <div className="filter-bar">
        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--s400)", textTransform: "uppercase", letterSpacing: 0.5 }}>Prioritas:</span>
        {["all", "urgent", "normal"].map(p => (
          <div key={p} className={`filter-chip ${filterPrioritas === p ? "active" : ""}`}
            onClick={() => setFilterPrioritas(p)}>
            {p === "all" ? "Semua" : p === "urgent" ? "🔴 Urgent" : "Normal"}
          </div>
        ))}
        <div className="filter-sep" />
        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--s400)", textTransform: "uppercase", letterSpacing: 0.5 }}>Kategori:</span>
        <div className={`filter-chip ${filterKategori === "all" ? "active" : ""}`} onClick={() => setFilterKategori("all")}>Semua</div>
        {["AC Bermasalah", "Air", "Listrik", "Bangunan"].map(k => (
          <div key={k} className={`filter-chip ${filterKategori === k ? "active" : ""}`}
            onClick={() => setFilterKategori(filterKategori === k ? "all" : k)}>
            {k}
          </div>
        ))}
        <div style={{ marginLeft: "auto", fontSize: 12, color: "var(--s400)", fontWeight: 500 }}>
          {filtered.length} tiket ditemukan
        </div>
      </div>

      {/* TABLE */}
      <div className="tiket-table">
        <div className="table-head">
          <div className="th">ID</div>
          <div className="th">Keluhan</div>
          <div className="th">Lokasi</div>
          <div className="th">Kategori</div>
          <div className="th">Prioritas</div>
          <div className="th">Status</div>
          <div className="th">Tanggal</div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔧</div>
            <div className="empty-title">Tidak ada tiket ditemukan</div>
            <div className="empty-sub">Coba ubah filter atau buat tiket baru</div>
          </div>
        ) : (
          filtered.map(t => {
            const sCfg = STATUS_CFG[t.status];
            const pCfg = PRIORITAS_CFG[t.prioritas];
            const kamarInfo = t.kamar ? KAMAR_LIST.find(k => k.id === t.kamar) : null;
            return (
              <div key={t.id}
                className={`tiket-row ${t.prioritas === "urgent" && t.status !== "selesai" ? "urgent-row" : ""}`}
                onClick={() => setSelectedTiket(t)}>
                <div className="td">
                  <div className="td-id">{t.id}</div>
                </div>
                <div className="td">
                  <div className="td-title">{t.kategori}</div>
                  <div className="td-sub">{t.deskripsi.slice(0, 45)}...</div>
                </div>
                <div className="td">
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--s800)" }}>
                    {t.lokasi === "kamar" ? `Kamar ${t.kamar}` : t.area}
                  </div>
                  <div className="td-sub">{kamarInfo?.penghuni || (t.lokasi === "umum" ? "Fasilitas Umum" : "Kosong")}</div>
                </div>
                <div className="td">
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--s700)" }}>{t.kategori}</span>
                </div>
                <div className="td">
                  <Badge color={pCfg.color} bg={pCfg.bg}>{pCfg.label}</Badge>
                </div>
                <div className="td">
                  <Badge color={sCfg.color} bg={sCfg.bg}>{sCfg.label}</Badge>
                </div>
                <div className="td">
                  <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "var(--s400)" }}>{t.tanggal}</div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* DETAIL PANEL */}
      {selectedTiket && (
        <DetailPanel
          tiket={selectedTiket}
          onClose={() => setSelectedTiket(null)}
          onEdit={() => { setEditTiket(selectedTiket); setSelectedTiket(null); }}
          onUpdate={() => setShowUpdateForm(true)}
          onDelete={handleDelete}
        />
      )}

      {/* FORM BUAT / EDIT */}
      {(showForm || editTiket) && (
        <FormTiket
          editData={editTiket}
          onClose={() => { setShowForm(false); setEditTiket(null); }}
          onSave={editTiket ? handleEdit : handleCreate}
        />
      )}

      {/* FORM UPDATE STATUS */}
      {showUpdateForm && selectedTiket && (
        <FormUpdateStatus
          tiket={selectedTiket}
          onClose={() => setShowUpdateForm(false)}
          onSave={handleUpdateStatus}
        />
      )}

      <style>{`
        @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
    </div>
  );
}
