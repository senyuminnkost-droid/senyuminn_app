import { useState, useEffect } from "react";

// ============================================================
// CSS
// ============================================================
const CSS = `
  .m-wrap { display: flex; flex-direction: column; gap: 16px; }

  /* ─── STATUS STRIP ───────────────────────── */
  .m-strip { display: flex; gap: 10px; flex-wrap: wrap; }
  .m-chip {
    display: flex; align-items: center; gap: 8px;
    background: #fff; border: 1.5px solid #e5e7eb;
    border-radius: 10px; padding: 10px 14px;
    cursor: pointer; transition: all 0.12s; flex: 1; min-width: 100px;
  }
  .m-chip:hover { border-color: #fed7aa; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
  .m-chip.active { border-color: transparent; box-shadow: 0 2px 10px rgba(0,0,0,0.08); }
  .m-chip-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
  .m-chip-label { font-size: 10px; font-weight: 500; color: #6b7280; }
  .m-chip-count { font-size: 20px; font-weight: 700; font-family: 'JetBrains Mono', monospace; line-height: 1; }

  /* ─── FILTER BAR ─────────────────────────── */
  .m-filterbar {
    display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
  }
  .m-search {
    display: flex; align-items: center; gap: 7px;
    background: #fff; border: 1.5px solid #e5e7eb;
    border-radius: 8px; padding: 7px 12px;
    flex: 1; max-width: 280px; transition: border-color 0.12s;
  }
  .m-search:focus-within { border-color: #f97316; }
  .m-search-input {
    border: none; outline: none; background: transparent;
    font-size: 12px; color: #1f2937; width: 100%; font-family: inherit;
  }
  .m-search-input::placeholder { color: #9ca3af; }
  .m-search-icon { font-size: 13px; flex-shrink: 0; }

  .m-filter-group { display: flex; align-items: center; gap: 6px; }
  .m-filter-label { font-size: 10px; font-weight: 500; color: #9ca3af; }
  .m-tag {
    padding: 5px 11px; border-radius: 20px; font-size: 11px; font-weight: 500;
    cursor: pointer; border: 1.5px solid #e5e7eb; color: #6b7280;
    background: #fff; transition: all 0.12s;
  }
  .m-tag:hover { border-color: #fed7aa; color: #ea580c; }
  .m-tag.active { background: #111827; border-color: #111827; color: #fff; font-weight: 600; }

  .m-count { font-size: 11px; color: #9ca3af; margin-left: auto; }

  /* ─── KAMAR GRID ─────────────────────────── */
  .m-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }

  .m-kamar {
    background: #fff; border-radius: 12px; overflow: hidden;
    border: 1.5px solid #e5e7eb; cursor: pointer;
    transition: all 0.15s; position: relative;
  }
  .m-kamar:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.08); transform: translateY(-2px); border-color: #fed7aa; }
  .m-kamar-bar { height: 4px; }
  .m-kamar-body { padding: 14px; }

  .m-kamar-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
  .m-kamar-num { font-size: 17px; font-weight: 700; color: #111827; font-family: 'JetBrains Mono', monospace; }
  .m-kamar-tipe {
    font-size: 9px; font-weight: 600; padding: 2px 7px; border-radius: 8px;
    text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px;
  }
  .m-status-badge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 8px; border-radius: 20px; font-size: 10px; font-weight: 600;
    border: 1px solid transparent;
  }
  .m-status-dot { width: 5px; height: 5px; border-radius: 50%; }

  .m-penghuni { margin-bottom: 10px; min-height: 36px; }
  .m-penghuni-name { font-size: 13px; font-weight: 600; color: #1f2937; display: flex; align-items: center; gap: 5px; }
  .m-partner { font-size: 10px; color: #6b7280; margin-top: 2px; }
  .m-no-penghuni { font-size: 12px; color: #9ca3af; font-style: italic; }

  .m-kontrak { font-size: 10px; color: #9ca3af; font-family: 'JetBrains Mono', monospace; margin-bottom: 10px; }
  .m-kontrak.warn { color: #d97706; font-weight: 500; }
  .m-kontrak.danger { color: #dc2626; font-weight: 600; }

  .m-kamar-footer {
    display: flex; justify-content: space-between; align-items: center;
    padding-top: 10px; border-top: 1px solid #f3f4f6;
  }
  .m-harga { font-size: 12px; font-weight: 600; color: #ea580c; }
  .m-harga span { font-size: 10px; font-weight: 400; color: #9ca3af; }
  .m-tiket-badge {
    display: flex; align-items: center; gap: 3px;
    background: #fee2e2; color: #dc2626;
    padding: 2px 7px; border-radius: 8px; font-size: 10px; font-weight: 600;
  }
  .m-detail-hint { font-size: 10px; color: #f97316; font-weight: 500; opacity: 0; transition: opacity 0.12s; }
  .m-kamar:hover .m-detail-hint { opacity: 1; }

  /* ─── EMPTY ──────────────────────────────── */
  .m-empty {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 60px 20px;
    color: #9ca3af; text-align: center; gap: 8px;
    grid-column: 1 / -1;
  }
  .m-empty-icon { font-size: 40px; opacity: 0.4; }
  .m-empty-title { font-size: 14px; font-weight: 600; color: #374151; }
  .m-empty-sub { font-size: 12px; }

  /* ─── DRAWER ─────────────────────────────── */
  .m-overlay {
    position: fixed; inset: 0; background: rgba(17,24,39,0.4);
    backdrop-filter: blur(3px); z-index: 200;
    animation: mFadeIn 0.18s ease;
  }
  .m-drawer {
    position: fixed; top: 0; right: 0; bottom: 0;
    width: 460px; max-width: 95vw;
    background: #fff; display: flex; flex-direction: column;
    box-shadow: -8px 0 40px rgba(0,0,0,0.12);
    animation: mSlideIn 0.22s cubic-bezier(0.4,0,0.2,1);
    z-index: 201;
  }
  @keyframes mFadeIn  { from { opacity: 0; } to { opacity: 1; } }
  @keyframes mSlideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }

  .m-drawer-head {
    padding: 16px 18px 12px; border-bottom: 1px solid #f3f4f6; flex-shrink: 0;
  }
  .m-drawer-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
  .m-drawer-num { font-size: 22px; font-weight: 700; color: #111827; font-family: 'JetBrains Mono', monospace; }
  .m-drawer-meta { font-size: 11px; color: #9ca3af; margin-top: 2px; }
  .m-close {
    width: 28px; height: 28px; border-radius: 7px; background: #f3f4f6;
    border: none; cursor: pointer; font-size: 14px; color: #6b7280;
    display: flex; align-items: center; justify-content: center; transition: all 0.12s;
  }
  .m-close:hover { background: #fee2e2; color: #dc2626; }

  .m-tabs { display: flex; gap: 4px; }
  .m-tab {
    padding: 5px 12px; border-radius: 7px; font-size: 11px; font-weight: 500;
    cursor: pointer; color: #6b7280; transition: all 0.12s; border: 1.5px solid transparent;
  }
  .m-tab:hover { background: #f3f4f6; }
  .m-tab.active { background: #fff7ed; color: #ea580c; border-color: #fed7aa; font-weight: 600; }

  .m-drawer-body { flex: 1; overflow-y: auto; padding: 16px 18px; }

  .m-section { margin-bottom: 18px; }
  .m-section-label {
    font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.2px;
    color: #9ca3af; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;
  }
  .m-section-label::after { content: ''; flex: 1; height: 1px; background: #f3f4f6; }

  .m-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .m-info-item { background: #f9fafb; border-radius: 8px; padding: 10px 12px; }
  .m-info-key { font-size: 10px; color: #9ca3af; font-weight: 500; margin-bottom: 3px; text-transform: uppercase; letter-spacing: 0.4px; }
  .m-info-val { font-size: 13px; font-weight: 600; color: #1f2937; }
  .m-info-val.mono { font-family: 'JetBrains Mono', monospace; font-size: 12px; }
  .m-info-val.orange { color: #ea580c; }
  .m-info-val.green  { color: #16a34a; }
  .m-info-val.red    { color: #dc2626; }

  .m-penghuni-card {
    background: linear-gradient(135deg, #fff7ed, #fff);
    border: 1px solid #fed7aa; border-radius: 10px; padding: 14px;
  }
  .m-penghuni-card-name { font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 4px; }
  .m-penghuni-card-meta { font-size: 11px; color: #6b7280; }
  .m-partner-section { margin-top: 10px; padding-top: 10px; border-top: 1px solid #fed7aa; }
  .m-partner-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #4b5563; margin-bottom: 4px; }

  .m-kontrak-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 10px; }
  .m-kontrak-item { background: #f9fafb; border-radius: 8px; padding: 8px 10px; }

  .m-fasil-wrap { display: flex; flex-wrap: wrap; gap: 6px; }
  .m-fasil-chip {
    display: flex; align-items: center; gap: 4px;
    background: #fff; border: 1.5px solid #e5e7eb;
    border-radius: 20px; padding: 4px 10px; font-size: 11px; font-weight: 500; color: #4b5563;
  }

  .m-service-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 8px 0; border-bottom: 1px solid #f3f4f6;
  }
  .m-service-row:last-child { border-bottom: none; }
  .m-service-label { font-size: 12px; font-weight: 500; color: #374151; display: flex; align-items: center; gap: 6px; }
  .m-service-val { font-size: 11px; color: #6b7280; font-family: 'JetBrains Mono', monospace; }

  .m-tiket-item {
    border-radius: 9px; padding: 10px 12px; margin-bottom: 8px; border: 1px solid;
  }
  .m-tiket-item-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
  .m-tiket-kat { font-size: 12px; font-weight: 600; color: #1f2937; }
  .m-tiket-desc { font-size: 11px; color: #6b7280; }
  .m-tiket-meta { margin-top: 6px; display: flex; gap: 6px; align-items: center; }

  .m-badge {
    display: inline-flex; align-items: center; gap: 3px;
    padding: 2px 8px; border-radius: 20px; font-size: 10px; font-weight: 600;
  }

  .m-riwayat-item {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 0; border-bottom: 1px solid #f3f4f6;
  }
  .m-riwayat-item:last-child { border-bottom: none; }
  .m-riwayat-dot { width: 8px; height: 8px; border-radius: 50%; background: #22c55e; flex-shrink: 0; }
  .m-riwayat-info { flex: 1; }
  .m-riwayat-jenis { font-size: 12px; font-weight: 500; color: #374151; }
  .m-riwayat-tgl { font-size: 10px; color: #9ca3af; font-family: 'JetBrains Mono', monospace; }

  .m-drawer-foot {
    padding: 12px 18px; border-top: 1px solid #f3f4f6; flex-shrink: 0;
    display: flex; gap: 8px;
  }
  .m-btn-primary {
    flex: 1; padding: 9px 14px; border-radius: 8px; font-size: 12px; font-weight: 600;
    background: linear-gradient(135deg, #f97316, #ea580c);
    color: #fff; border: none; cursor: pointer; font-family: inherit;
    box-shadow: 0 3px 10px rgba(249,115,22,0.25); transition: all 0.15s;
    display: flex; align-items: center; justify-content: center; gap: 5px;
  }
  .m-btn-primary:hover { filter: brightness(1.05); }
  .m-btn-ghost {
    flex: 1; padding: 9px 14px; border-radius: 8px; font-size: 12px; font-weight: 500;
    background: #f3f4f6; color: #4b5563; border: none; cursor: pointer; font-family: inherit;
    transition: all 0.15s; display: flex; align-items: center; justify-content: center; gap: 5px;
  }
  .m-btn-ghost:hover { background: #e5e7eb; }

  /* ─── RESPONSIVE ─────────────────────────── */
  @media (max-width: 1024px) { .m-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (max-width: 768px)  { .m-grid { grid-template-columns: repeat(2, 1fr); } .m-strip { gap: 8px; } }
  @media (max-width: 480px)  {
    .m-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
    .m-drawer { width: 100%; max-width: 100%; }
    .m-filterbar { gap: 6px; }
  }

  /* ─── FORM MODAL (FormKamar) ─────────────── */
  .mf-overlay {
    position: fixed; inset: 0; background: rgba(17,24,39,.5);
    backdrop-filter: blur(3px); z-index: 500;
    display: flex; align-items: center; justify-content: center; padding: 16px; box-sizing: border-box;
  }
  .mf-modal {
    background: #fff; border-radius: 16px; width: 540px; max-width: 100%;
    max-height: 88vh; display: flex; flex-direction: column;
    box-shadow: 0 24px 60px rgba(0,0,0,.18);
  }
  .mf-head {
    padding: 18px 22px 14px; border-bottom: 1px solid #f3f4f6;
    display: flex; align-items: flex-start; justify-content: space-between; flex-shrink: 0;
  }
  .mf-head-title { font-size: 15px; font-weight: 800; color: #111827; }
  .mf-head-sub   { font-size: 11px; color: #9ca3af; margin-top: 2px; }
  .mf-close {
    width: 28px; height: 28px; border-radius: 7px; background: #f3f4f6;
    border: none; cursor: pointer; font-size: 14px; color: #6b7280;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .mf-close:hover { background: #fee2e2; color: #dc2626; }

  .mf-tabs { display: flex; border-bottom: 1px solid #f3f4f6; flex-shrink: 0; }
  .mf-tab {
    flex: 1; padding: 10px 8px; font-size: 11px; font-weight: 600; text-align: center;
    cursor: pointer; color: #9ca3af; border-bottom: 2px solid transparent;
    transition: all .12s; background: transparent;
  }
  .mf-tab:hover { color: #374151; background: #fafafa; }
  .mf-tab.active { color: #ea580c; background: #fff7ed; border-bottom-color: #f97316; }

  .mf-body { flex: 1; overflow-y: auto; padding: 18px 22px; display: flex; flex-direction: column; gap: 14px; }

  .mf-field { display: flex; flex-direction: column; gap: 4px; }
  .mf-label { font-size: 10px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: .5px; }
  .mf-input {
    padding: 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 8px;
    font-size: 13px; font-family: inherit; outline: none; width: 100%; box-sizing: border-box;
    transition: border-color .12s; color: #111827;
  }
  .mf-input:focus { border-color: #f97316; }
  .mf-input:disabled { background: #f9fafb; color: #9ca3af; }
  .mf-select {
    padding: 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 8px;
    font-size: 13px; font-family: inherit; outline: none; width: 100%; box-sizing: border-box;
    background: #fff; color: #111827; cursor: pointer; transition: border-color .12s;
  }
  .mf-select:focus { border-color: #f97316; }
  .mf-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .mf-grid3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
  .mf-textarea {
    padding: 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 8px;
    font-size: 12px; font-family: inherit; outline: none; width: 100%; box-sizing: border-box;
    resize: vertical; min-height: 72px; color: #111827; transition: border-color .12s;
  }
  .mf-textarea:focus { border-color: #f97316; }

  /* Spesifikasi item row */
  .mf-spec-row {
    background: #f9fafb; border: 1.5px solid #e5e7eb; border-radius: 10px;
    padding: 10px 13px; transition: all .12s;
  }
  .mf-spec-row.checked { background: #fff7ed; border-color: #fed7aa; }
  .mf-spec-top { display: flex; align-items: center; gap: 10px; }
  .mf-spec-cb {
    width: 18px; height: 18px; border-radius: 5px; border: 2px solid #d1d5db;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; flex-shrink: 0; transition: all .12s; background: #fff;
  }
  .mf-spec-cb.checked { background: #f97316; border-color: #f97316; }
  .mf-spec-icon { font-size: 16px; flex-shrink: 0; }
  .mf-spec-name { font-size: 13px; font-weight: 600; color: #111827; flex: 1; }
  .mf-spec-detail { margin-top: 10px; padding-top: 10px; border-top: 1px solid #fed7aa; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .mf-spec-detail-label { font-size: 11px; color: #9ca3af; font-weight: 500; }
  .mf-spec-input {
    flex: 1; min-width: 80px; padding: 6px 10px; border: 1.5px solid #e5e7eb;
    border-radius: 7px; font-size: 12px; font-family: inherit; outline: none;
    transition: border-color .12s; color: #111827; background: #fff;
  }
  .mf-spec-input:focus { border-color: #f97316; }
  .mf-spec-select {
    flex: 1; min-width: 100px; padding: 6px 10px; border: 1.5px solid #e5e7eb;
    border-radius: 7px; font-size: 12px; font-family: inherit; outline: none;
    background: #fff; color: #111827; cursor: pointer;
  }
  .mf-spec-unit { font-size: 11px; color: #6b7280; font-weight: 500; white-space: nowrap; }

  /* Inventaris */
  .mf-inv-row {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 10px; background: #f9fafb; border-radius: 8px;
    border: 1px solid #e5e7eb;
  }
  .mf-inv-name { flex: 1; font-size: 12px; color: #111827; font-weight: 500; }
  .mf-inv-qty  { font-size: 12px; color: #6b7280; }
  .mf-inv-del  { background: none; border: none; cursor: pointer; color: #dc2626; font-size: 14px; padding: 2px 4px; }
  .mf-add-row  { display: grid; grid-template-columns: 1fr 60px 80px auto; gap: 6px; align-items: center; }

  .mf-footer {
    padding: 13px 22px; border-top: 1px solid #f3f4f6;
    display: flex; gap: 8px; justify-content: flex-end; flex-shrink: 0;
  }
  .mf-btn-cancel {
    padding: 9px 18px; background: #f3f4f6; border: none; border-radius: 8px;
    font-size: 12px; font-weight: 600; color: #6b7280; cursor: pointer; font-family: inherit;
  }
  .mf-btn-save {
    padding: 9px 22px; background: linear-gradient(135deg,#f97316,#ea580c); border: none;
    border-radius: 8px; font-size: 12px; font-weight: 700; color: #fff;
    cursor: pointer; font-family: inherit; box-shadow: 0 3px 10px rgba(249,115,22,.25);
  }
  .mf-btn-save:disabled { background: #d1d5db; box-shadow: none; cursor: not-allowed; }
  .mf-btn-ghost {
    padding: 7px 12px; background: #f3f4f6; border: none; border-radius: 7px;
    font-size: 11px; font-weight: 600; color: #6b7280; cursor: pointer; font-family: inherit;
  }
  .mf-section-label {
    font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;
    color: #9ca3af; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;
  }
  .mf-section-label::after { content:''; flex:1; height:1px; background:#f3f4f6; }
`;

function StyleInjector() {
  useEffect(() => {
    const id = "senyuminn-monitor-css";
    if (document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id; el.textContent = CSS;
    document.head.appendChild(el);
    return () => { const e = document.getElementById(id); if (e) e.remove(); };
  }, []);
  return null;
}

// ============================================================
// CONFIG
// ============================================================
const STATUS_CFG = {
  tersedia:    { label: "Tersedia",    color: "#16a34a", bg: "#dcfce7", border: "#86efac", dot: "#22c55e" },
  booked:      { label: "Booked",      color: "#b45309", bg: "#fef3c7", border: "#fcd34d", dot: "#f59e0b" },
  terisi:      { label: "Terisi",      color: "#dc2626", bg: "#fee2e2", border: "#fca5a5", dot: "#ef4444" },
  "deep-clean":{ label: "Deep Clean",  color: "#1d4ed8", bg: "#dbeafe", border: "#93c5fd", dot: "#3b82f6" },
  maintenance: { label: "Maintenance", color: "#c2410c", bg: "#ffedd5", border: "#fdba74", dot: "#f97316" },
};

const TIKET_CFG = {
  open:         { label: "Open",        color: "#dc2626", bg: "#fee2e2" },
  "in-progress":{ label: "In Progress", color: "#d97706", bg: "#fef3c7" },
  ditunda:      { label: "Ditunda",     color: "#6d28d9", bg: "#ede9fe" },
  selesai:      { label: "Selesai",     color: "#16a34a", bg: "#dcfce7" },
};

const PRIORITAS_CFG = {
  urgent: { label: "Urgent", color: "#dc2626", bg: "#fee2e2" },
  normal: { label: "Normal", color: "#6b7280", bg: "#f3f4f6" },
};

const FASIL_ICON = { AC: "❄️", WiFi: "📶", TV: "📺", "Water Heater": "🚿", "Kulkas Mini": "🧊", Lemari: "🚪" };

const fmt = (n) => "Rp " + (n || 0).toLocaleString("id-ID");

const hariSisa = (tgl) => {
  if (!tgl) return null;
  return Math.ceil((new Date(tgl) - new Date()) / 86400000);
};

// ============================================================
// KAMAR CARD
// ============================================================
function KamarCard({ kamar, onClick }) {
  const cfg  = STATUS_CFG[kamar.status] || STATUS_CFG.tersedia;
  const sisa = hariSisa(kamar.kontrakSelesai);
  const kontrakClass = sisa !== null && sisa <= 14 ? "danger" : sisa !== null && sisa <= 30 ? "warn" : "";

  return (
    <div className="m-kamar" onClick={onClick}>
      <div className="m-kamar-bar" style={{ background: `linear-gradient(90deg, ${cfg.dot}, ${cfg.color})` }} />
      <div className="m-kamar-body">

        <div className="m-kamar-top">
          <div>
            <div className="m-kamar-num">K{String(kamar.id).padStart(2,"0")}</div>
            <div className="m-kamar-tipe" style={{
              background: kamar.tipe === "Premium" ? "#fff7ed" : "#f3f4f6",
              color:      kamar.tipe === "Premium" ? "#c2410c" : "#6b7280",
            }}>
              {kamar.tipe === "Premium" ? "⭑ Premium" : "Reguler"}
            </div>
          </div>
          <div className="m-status-badge" style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}>
            <div className="m-status-dot" style={{ background: cfg.dot }} />
            {cfg.label}
          </div>
        </div>

        <div className="m-penghuni">
          {kamar.penghuni ? (
            <>
              <div className="m-penghuni-name">👤 {kamar.penghuni}</div>
              {kamar.partner?.length > 0 && (
                <div className="m-partner">+ {kamar.partner.length} partner</div>
              )}
            </>
          ) : (
            <div className="m-no-penghuni">
              {kamar.status === "deep-clean"  ? "✨ Sedang deep clean"   :
               kamar.status === "maintenance" ? "🔧 Sedang maintenance"  :
               kamar.status === "booked"      ? "📅 Akan check-in"       :
               "Tidak ada penghuni"}
            </div>
          )}
        </div>

        {kamar.kontrakSelesai && (
          <div className={`m-kontrak ${kontrakClass}`}>
            📅 {kamar.kontrakMulai} → {kamar.kontrakSelesai}
            {sisa !== null && sisa <= 30 && <span> ({sisa}h lagi)</span>}
          </div>
        )}

        <div className="m-kamar-footer">
          <div className="m-harga">{fmt(kamar.harga)}<span>/bln</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {kamar.tiketAktif > 0 && (
              <div className="m-tiket-badge">⚑ {kamar.tiketAktif}</div>
            )}
            <div className="m-detail-hint">Detail →</div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ============================================================
// DETAIL DRAWER
// ============================================================
function DetailDrawer({ kamar, tiketList, onClose, onEdit, onDelete }) {
  const [tab, setTab] = useState("info");
  const cfg         = STATUS_CFG[kamar.status] || STATUS_CFG.tersedia;
  const sisa        = hariSisa(kamar.kontrakSelesai);
  const tiketKamar  = tiketList.filter(t => t.kamar === kamar.id);
  const riwayat     = kamar.riwayatService || [];

  const TABS = [
    { id: "info",     label: "Info & Penghuni" },
    { id: "service",  label: "Layanan" },
    { id: "tiket",    label: `Tiket (${tiketKamar.length})` },
    { id: "riwayat",  label: "Riwayat" },
  ];

  return (
    <>
      <div className="m-overlay" onClick={onClose} />
      <div className="m-drawer">

        {/* Header */}
        <div className="m-drawer-head">
          <div className="m-drawer-top">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <div className="m-drawer-num">Kamar {kamar.id}</div>
                <div className="m-status-badge" style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}>
                  <div className="m-status-dot" style={{ background: cfg.dot }} />
                  {cfg.label}
                </div>
                {kamar.tipe === "Premium" && (
                  <span className="m-badge" style={{ background: "#fff7ed", color: "#c2410c" }}>⭑ Premium</span>
                )}
              </div>
              <div className="m-drawer-meta">
                Lt. {kamar.lantai || "—"} · {kamar.luas ? `${kamar.luas} m²` : "—"} · {fmt(kamar.harga)}/bulan
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              {onEdit && (
                <button onClick={() => onEdit(kamar)} style={{ padding:"6px 12px", background:"#f3f4f6", border:"none", borderRadius:7, fontSize:12, fontWeight:600, cursor:"pointer", color:"#374151" }}>
                  ✏️ Edit
                </button>
              )}
              {onDelete && (
                <button onClick={() => onDelete(kamar.id)} style={{ padding:"6px 10px", background:"#fee2e2", border:"none", borderRadius:7, fontSize:12, fontWeight:600, cursor:"pointer", color:"#dc2626" }}>
                  🗑️
                </button>
              )}
              <button className="m-close" onClick={onClose}>✕</button>
            </div>
          </div>
          <div className="m-tabs">
            {TABS.map(t => (
              <div key={t.id} className={`m-tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
                {t.label}
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="m-drawer-body">

          {/* TAB INFO */}
          {tab === "info" && (
            <div>
              {kamar.penghuni ? (
                <>
                  <div className="m-section">
                    <div className="m-section-label">Data Penghuni</div>
                    <div className="m-penghuni-card">
                      <div className="m-penghuni-card-name">👤 {kamar.penghuni}</div>
                      <div className="m-penghuni-card-meta">📞 {kamar.noHP || "—"}</div>
                      {kamar.partner?.length > 0 && (
                        <div className="m-partner-section">
                          <div style={{ fontSize: 9, fontWeight: 700, color: "#92400e", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Partner</div>
                          {kamar.partner.map((p, i) => (
                            <div key={i} className="m-partner-item">👥 {p}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="m-section">
                    <div className="m-section-label">Kontrak Sewa</div>
                    <div className="m-kontrak-grid">
                      <div className="m-kontrak-item">
                        <div className="m-info-key">Mulai</div>
                        <div className="m-info-val mono">{kamar.kontrakMulai || "—"}</div>
                      </div>
                      <div className="m-kontrak-item">
                        <div className="m-info-key">Selesai</div>
                        <div className={`m-info-val mono ${sisa !== null && sisa <= 14 ? "red" : sisa !== null && sisa <= 30 ? "orange" : ""}`}>
                          {kamar.kontrakSelesai || "—"}
                        </div>
                      </div>
                    </div>
                    {sisa !== null && (
                      <div style={{
                        marginTop: 8, padding: "8px 12px", borderRadius: 8, fontSize: 12, fontWeight: 500,
                        background: sisa <= 14 ? "#fee2e2" : sisa <= 30 ? "#fef3c7" : "#dcfce7",
                        color:      sisa <= 14 ? "#dc2626" : sisa <= 30 ? "#b45309" : "#16a34a",
                      }}>
                        {sisa <= 0  ? "⚠️ Kontrak sudah habis!" :
                         sisa <= 14 ? `🔴 Habis ${sisa} hari lagi — segera tindak` :
                         sisa <= 30 ? `⚠️ Habis ${sisa} hari lagi` :
                         `✅ ${sisa} hari sisa kontrak`}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 10, padding: 16, marginBottom: 16, textAlign: "center" }}>
                  <div style={{ fontSize: 26, marginBottom: 6 }}>
                    {kamar.status === "tersedia"   ? "🟢" :
                     kamar.status === "deep-clean" ? "✨" :
                     kamar.status === "booked"     ? "📅" : "🔧"}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: cfg.color }}>{cfg.label}</div>
                  <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>
                    {kamar.status === "tersedia"   && "Kamar siap untuk disewakan"}
                    {kamar.status === "deep-clean" && "Sedang proses deep clean post check-out"}
                    {kamar.status === "maintenance"&& "Sedang dalam perbaikan"}
                    {kamar.status === "booked"     && `Check-in direncanakan: ${kamar.kontrakMulai || "—"}`}
                  </div>
                </div>
              )}

              <div className="m-section">
                <div className="m-section-label">Spesifikasi Kamar</div>
                <div className="m-info-grid">
                  <div className="m-info-item">
                    <div className="m-info-key">Tipe</div>
                    <div className="m-info-val">{kamar.tipe || "—"}</div>
                  </div>
                  <div className="m-info-item">
                    <div className="m-info-key">Lantai</div>
                    <div className="m-info-val">{kamar.lantai ? `Lantai ${kamar.lantai}` : "—"}</div>
                  </div>
                  <div className="m-info-item">
                    <div className="m-info-key">Luas</div>
                    <div className="m-info-val">{kamar.luas ? `${kamar.luas} m²` : "—"}</div>
                  </div>
                  <div className="m-info-item">
                    <div className="m-info-key">Ukuran Bed</div>
                    <div className="m-info-val">{kamar.bed || "—"}</div>
                  </div>
                  <div className="m-info-item">
                    <div className="m-info-key">Harga Sewa</div>
                    <div className="m-info-val orange">{fmt(kamar.harga)}</div>
                  </div>
                  <div className="m-info-item">
                    <div className="m-info-key">Tiket Aktif</div>
                    <div className={`m-info-val ${kamar.tiketAktif > 0 ? "red" : "green"}`}>
                      {kamar.tiketAktif > 0 ? `${kamar.tiketAktif} open` : "Tidak ada"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="m-section">
                <div className="m-section-label">Fasilitas</div>
                {kamar.fasilitas?.length > 0 ? (
                  <div className="m-fasil-wrap">
                    {kamar.fasilitas.map((f, i) => (
                      <div key={i} className="m-fasil-chip">
                        {FASIL_ICON[f] || "🔹"} {f}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>Belum ada data fasilitas</div>
                )}
              </div>

              {kamar.catatan && (
                <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: "10px 12px", fontSize: 12, color: "#92400e" }}>
                  📝 {kamar.catatan}
                </div>
              )}
            </div>
          )}

          {/* TAB LAYANAN */}
          {tab === "service" && (
            <div>
              <div className="m-section">
                <div className="m-section-label">Status Layanan</div>
                {[
                  { icon: "🧹", label: "Weekly Service Terakhir", val: kamar.lastWeekly || "Belum ada data" },
                  { icon: "❄️", label: "Service AC Terakhir",     val: kamar.lastAC     || "Belum ada data" },
                  { icon: "✨", label: "Deep Clean Terakhir",     val: kamar.status === "deep-clean" ? "Sedang berlangsung" : (kamar.lastDeepClean || "Belum ada data") },
                  { icon: "📅", label: "Jadwal AC Berikutnya",    val: kamar.nextAC     || "Belum dijadwalkan" },
                ].map((s, i) => (
                  <div key={i} className="m-service-row">
                    <div className="m-service-label"><span>{s.icon}</span>{s.label}</div>
                    <div className="m-service-val">{s.val}</div>
                  </div>
                ))}
              </div>

              {kamar.status === "maintenance" && (
                <div style={{ background: "#ffedd5", border: "1px solid #fdba74", borderRadius: 10, padding: 14, marginTop: 8 }}>
                  <div style={{ fontWeight: 600, color: "#c2410c", marginBottom: 4, fontSize: 12 }}>🔧 Sedang Maintenance</div>
                  <div style={{ fontSize: 12, color: "#92400e" }}>Kamar tidak tersedia sampai semua perbaikan selesai.</div>
                </div>
              )}
            </div>
          )}

          {/* TAB TIKET */}
          {tab === "tiket" && (
            <div>
              <div className="m-section">
                <div className="m-section-label">Tiket Keluhan</div>
                {tiketKamar.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "28px 0", color: "#9ca3af" }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>✅</div>
                    <div style={{ fontSize: 12 }}>Tidak ada tiket aktif</div>
                  </div>
                ) : (
                  tiketKamar.map(t => (
                    <div key={t.id} className="m-tiket-item"
                      style={{ background: TIKET_CFG[t.status]?.bg || "#f9fafb", borderColor: (TIKET_CFG[t.status]?.color || "#e5e7eb") + "33" }}>
                      <div className="m-tiket-item-top">
                        <div className="m-tiket-kat">#{t.id} · {t.kategori}</div>
                        <span className="m-badge" style={{ background: TIKET_CFG[t.status]?.bg, color: TIKET_CFG[t.status]?.color }}>
                          {TIKET_CFG[t.status]?.label}
                        </span>
                      </div>
                      <div className="m-tiket-desc">{t.deskripsi}</div>
                      <div className="m-tiket-meta">
                        <span className="m-badge" style={{ background: PRIORITAS_CFG[t.prioritas]?.bg, color: PRIORITAS_CFG[t.prioritas]?.color }}>
                          {PRIORITAS_CFG[t.prioritas]?.label}
                        </span>
                        <span style={{ fontSize: 10, color: "#9ca3af", fontFamily: "'JetBrains Mono', monospace" }}>{t.tanggal}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB RIWAYAT */}
          {tab === "riwayat" && (
            <div>
              <div className="m-section">
                <div className="m-section-label">Riwayat Layanan</div>
                {riwayat.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "28px 0", color: "#9ca3af", fontSize: 12 }}>
                    Belum ada riwayat tersimpan
                  </div>
                ) : (
                  riwayat.map((r, i) => (
                    <div key={i} className="m-riwayat-item">
                      <div className="m-riwayat-dot" />
                      <div className="m-riwayat-info">
                        <div className="m-riwayat-jenis">{r.jenis}</div>
                        <div className="m-riwayat-tgl">{r.tanggal}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 11, color: "#9ca3af" }}>👤 {r.staff}</div>
                        <span className="m-badge" style={{ background: "#dcfce7", color: "#16a34a" }}>selesai</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="m-drawer-foot">
          <button className="m-btn-primary">⚑ Buat Tiket</button>
          {kamar.status === "tersedia" && (
            <button className="m-btn-primary" style={{ background: "linear-gradient(135deg, #16a34a, #15803d)", boxShadow: "0 3px 10px rgba(22,163,74,0.25)" }}>
              🔑 Booking
            </button>
          )}
          {kamar.penghuni && (
            <button className="m-btn-ghost">📋 Perpanjang</button>
          )}
          {!kamar.penghuni && kamar.status !== "tersedia" && (
            <button className="m-btn-ghost">📝 Update Status</button>
          )}
        </div>

      </div>
    </>
  );
}

// ============================================================
// MONITOR KAMAR — MAIN
// ============================================================
export default function MonitorKamar({ user, globalData = {} }) {
  const {
    kamarList    = [], setKamarList    = () => {},
    tiketList    = [],
    pengaturanConfig = {},
    isReadOnly   = false,
  } = globalData;

  const [filterStatus, setFilterStatus] = useState("all");
  const [filterTipe,   setFilterTipe]   = useState("all");
  const [filterLantai, setFilterLantai] = useState("all");
  const [search,       setSearch]       = useState("");
  const [selected,     setSelected]     = useState(null);
  const [showForm,     setShowForm]     = useState(false);
  const [editKamar,    setEditKamar]    = useState(null); // null = tambah baru

  const isAdmin = user?.role === "manajemen";

  // ─── Handle tambah / edit kamar ─────────────────────────
  const handleSaveKamar = (data) => {
    if (editKamar) {
      setKamarList(prev => prev.map(k => k.id === editKamar.id ? { ...k, ...data } : k));
    } else {
      const newId = kamarList.length > 0 ? Math.max(...kamarList.map(k => k.id)) + 1 : 1;
      setKamarList(prev => [...prev, {
        id: newId,
        status: "tersedia",
        penghuni: null,
        partner: [],
        kontrakMulai: null,
        kontrakSelesai: null,
        tiketAktif: 0,
        ...data,
      }]);
    }
    setShowForm(false);
    setEditKamar(null);
  };

  const handleDeleteKamar = (id) => {
    if (!window.confirm("Hapus kamar ini? Data tidak bisa dikembalikan.")) return;
    setKamarList(prev => prev.filter(k => k.id !== id));
    setSelected(null);
  };

  const summary = Object.keys(STATUS_CFG).reduce((acc, key) => {
    acc[key] = kamarList.filter(k => k.status === key).length;
    return acc;
  }, {});

  const filtered = kamarList.filter(k => {
    if (filterStatus !== "all" && k.status !== filterStatus) return false;
    if (filterTipe   !== "all" && k.tipe   !== filterTipe)   return false;
    if (filterLantai !== "all" && String(k.lantai) !== filterLantai) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!String(k.id).includes(q) &&
          !(k.penghuni || "").toLowerCase().includes(q) &&
          !k.tipe.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="m-wrap">
      <StyleInjector />

      {/* Status Strip */}
      <div className="m-strip">
        {Object.entries(STATUS_CFG).map(([key, cfg]) => (
          <div
            key={key}
            className={`m-chip ${filterStatus === key ? "active" : ""}`}
            style={filterStatus === key ? { background: cfg.bg, borderColor: cfg.border } : {}}
            onClick={() => setFilterStatus(filterStatus === key ? "all" : key)}
          >
            <div className="m-chip-dot" style={{ background: cfg.dot }} />
            <div>
              <div className="m-chip-label">{cfg.label}</div>
              <div className="m-chip-count" style={{ color: cfg.color }}>{summary[key]}</div>
            </div>
          </div>
        ))}
        <div
          className={`m-chip ${filterStatus === "all" ? "active" : ""}`}
          style={filterStatus === "all" ? { background: "#f3f4f6", borderColor: "#e5e7eb" } : {}}
          onClick={() => setFilterStatus("all")}
        >
          <div className="m-chip-dot" style={{ background: "#9ca3af" }} />
          <div>
            <div className="m-chip-label">Semua</div>
            <div className="m-chip-count" style={{ color: "#374151" }}>{kamarList.length}</div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="m-filterbar">
        <div className="m-search">
          <span className="m-search-icon">🔍</span>
          <input
            className="m-search-input"
            placeholder="Cari kamar, penyewa..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="m-filter-group">
          <span className="m-filter-label">Tipe:</span>
          {["all","Premium","Reguler"].map(t => (
            <div key={t} className={`m-tag ${filterTipe === t ? "active" : ""}`} onClick={() => setFilterTipe(t)}>
              {t === "all" ? "Semua" : t === "Premium" ? "⭑ Premium" : "Reguler"}
            </div>
          ))}
        </div>
        <div className="m-filter-group">
          <span className="m-filter-label">Lantai:</span>
          {["all","2","3"].map(l => (
            <div key={l} className={`m-tag ${filterLantai === l ? "active" : ""}`} onClick={() => setFilterLantai(l)}>
              {l === "all" ? "Semua" : `Lt. ${l}`}
            </div>
          ))}
        </div>
        <div className="m-count">{filtered.length} kamar</div>
        {!isReadOnly && (
          <button
            onClick={() => { setEditKamar(null); setShowForm(true); }}
            style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 14px", background:"linear-gradient(135deg,#f97316,#ea580c)", color:"#fff", border:"none", borderRadius:8, fontSize:12, fontWeight:700, cursor:"pointer", marginLeft:8 }}
          >
            ＋ Tambah Kamar
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="m-grid">
        {kamarList.length === 0 ? (
          <div className="m-empty">
            <div className="m-empty-icon">🏠</div>
            <div className="m-empty-title">Belum ada data kamar</div>
            <div className="m-empty-sub">Tambahkan kamar di <b>Pengaturan → Profil Kost</b></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="m-empty">
            <div className="m-empty-icon">🔍</div>
            <div className="m-empty-title">Tidak ada kamar yang sesuai</div>
            <div className="m-empty-sub">Coba ubah filter atau kata kunci</div>
          </div>
        ) : (
          filtered.map(k => (
            <KamarCard key={k.id} kamar={k} onClick={() => setSelected(k)} />
          ))
        )}
      </div>

      {/* Detail Drawer */}
      {selected && (
        <DetailDrawer
          kamar={selected}
          tiketList={tiketList}
          onClose={() => setSelected(null)}
          onEdit={!isReadOnly ? (k) => { setEditKamar(k); setShowForm(true); setSelected(null); } : null}
          onDelete={!isReadOnly ? handleDeleteKamar : null}
        />
      )}

      {/* Modal Form Kamar */}
      {showForm && (
        <FormKamar
          kamar={editKamar}
          inventarisTemplate={pengaturanConfig.inventarisKamar || []}
          onClose={() => { setShowForm(false); setEditKamar(null); }}
          onSave={handleSaveKamar}
        />
      )}
    </div>
  );
}

// ============================================================
// FORM KAMAR — Modal tambah / edit kamar + inventaris
// ============================================================
// ============================================================
// FORM KAMAR — Info + Spesifikasi + Inventaris
// ============================================================
function FormKamar({ kamar, inventarisTemplate, onClose, onSave }) {
  const isEdit = !!kamar;

  // ── SPEC DEFAULT — item bawaan dengan toggle + detail
  const DEFAULT_SPEC = [
    { id:"ac",          icon:"❄️",  nama:"AC",           checked:false, tipe:"pk",     nilai:"",  satuan:"PK" },
    { id:"tv",          icon:"📺",  nama:"TV",           checked:false, tipe:"inci",   nilai:"",  satuan:"inci" },
    { id:"bed",         icon:"🛏️",  nama:"Kasur / Bed",  checked:false, tipe:"ukuran", nilai:"Single" },
    { id:"lemari",      icon:"🗄️",  nama:"Lemari",       checked:false, tipe:"unit",   nilai:"1", satuan:"unit" },
    { id:"kabinet",     icon:"🗃️",  nama:"Kabinet",      checked:false, tipe:"unit",   nilai:"1", satuan:"unit" },
    { id:"meja",        icon:"🪑",  nama:"Meja Belajar", checked:false, tipe:"unit",   nilai:"1", satuan:"unit" },
    { id:"kursi",       icon:"💺",  nama:"Kursi",        checked:false, tipe:"unit",   nilai:"1", satuan:"unit" },
    { id:"waterheater", icon:"🚿",  nama:"Water Heater", checked:false, tipe:"toggle"             },
    { id:"kulkas",      icon:"🧊",  nama:"Kulkas",       checked:false, tipe:"unit",   nilai:"1", satuan:"unit" },
    { id:"sofa",        icon:"🛋️",  nama:"Sofa",         checked:false, tipe:"unit",   nilai:"1", satuan:"unit" },
  ];

  const BED_SIZES = ["Single", "Single XL", "Double", "Queen", "King"];

  // Init spesifikasi dari data kamar atau default
  const initSpec = () => {
    if (kamar?.spesifikasi && kamar.spesifikasi.length > 0) {
      // Merge: default items + saved checked state
      return DEFAULT_SPEC.map(def => {
        const saved = kamar.spesifikasi.find(s => s.id === def.id);
        return saved ? { ...def, ...saved } : def;
      });
    }
    return DEFAULT_SPEC.map(d => ({ ...d }));
  };

  const [form, setForm] = useState({
    nomor:      kamar?.id       || "",
    tipe:       kamar?.tipe     || "Reguler",
    lantai:     kamar?.lantai   || "2",
    harga:      kamar?.harga    || 1800000,
    catatan:    kamar?.catatan  || "",
    luas:       kamar?.luas     || "",
  });
  const [spec,      setSpec]      = useState(initSpec());
  const [specCustom,setSpecCustom]= useState(kamar?.specCustom || []); // [{id, nama, nilai}]
  const [inventaris,setInventaris]= useState(
    kamar?.inventaris || (inventarisTemplate.length > 0
      ? inventarisTemplate.map(i => ({ ...i, id: Date.now() + Math.random() }))
      : [])
  );
  const [tab,        setTab]       = useState("info");
  const [newInvNama, setNewInvNama]= useState("");
  const [newInvQty,  setNewInvQty] = useState(1);
  const [newInvSat,  setNewInvSat] = useState("buah");
  const [newCustNama,setNewCustNama]=useState("");
  const [newCustVal, setNewCustVal] =useState("");

  const setF   = (k,v) => setForm(p => ({ ...p, [k]: v }));

  // Toggle ceklis spec
  const toggleSpec = (id) =>
    setSpec(prev => prev.map(s => s.id === id ? { ...s, checked: !s.checked } : s));

  // Update detail nilai spec
  const updateSpec = (id, field, val) =>
    setSpec(prev => prev.map(s => s.id === id ? { ...s, [field]: val } : s));

  // Custom spec
  const addCustomSpec = () => {
    if (!newCustNama.trim()) return;
    setSpecCustom(prev => [...prev, { id: Date.now(), nama: newCustNama.trim(), nilai: newCustVal.trim() }]);
    setNewCustNama(""); setNewCustVal("");
  };
  const removeCustomSpec = (id) => setSpecCustom(prev => prev.filter(s => s.id !== id));

  // Inventaris
  const addInv = () => {
    if (!newInvNama.trim()) return;
    setInventaris(prev => [...prev, { id: Date.now(), nama: newInvNama.trim(), qty: Number(newInvQty), satuan: newInvSat }]);
    setNewInvNama(""); setNewInvQty(1);
  };
  const removeInv = (id) => setInventaris(prev => prev.filter(i => i.id !== id));

  const handleSave = () => {
    onSave({
      id:          isEdit ? kamar.id : Number(form.nomor),
      tipe:        form.tipe,
      lantai:      form.lantai,
      harga:       Number(form.harga),
      luas:        form.luas,
      spesifikasi: spec,
      specCustom:  specCustom,
      inventaris:  inventaris,
      catatan:     form.catatan,
    });
  };

  const valid = form.nomor && form.harga > 0;

  const TABS = [
    { id:"info",   label:"📋 Info Kamar"  },
    { id:"spec",   label:"⚙️ Spesifikasi" },
    { id:"inv",    label:"📦 Inventaris"  },
  ];

  return (
    <div className="mf-overlay" onClick={onClose}>
      <div className="mf-modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="mf-head">
          <div>
            <div className="mf-head-title">
              {isEdit ? `✏️ Edit Kamar ${kamar.id}` : "＋ Tambah Kamar Baru"}
            </div>
            <div className="mf-head-sub">Isi data lengkap dan inventaris kamar</div>
          </div>
          <button className="mf-close" onClick={onClose}>✕</button>
        </div>

        {/* Tabs */}
        <div className="mf-tabs">
          {TABS.map(t => (
            <div key={t.id} className={`mf-tab${tab===t.id?" active":""}`} onClick={() => setTab(t.id)}>
              {t.label}
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="mf-body">

          {/* ═══ TAB INFO ═══ */}
          {tab === "info" && (
            <>
              <div className="mf-grid2">
                <div className="mf-field">
                  <label className="mf-label">Nomor Kamar *</label>
                  <input className="mf-input" type="number" min="1"
                    value={form.nomor} onChange={e => setF("nomor", e.target.value)}
                    disabled={isEdit} placeholder="Contoh: 13" />
                </div>
                <div className="mf-field">
                  <label className="mf-label">Lantai</label>
                  <select className="mf-select" value={form.lantai} onChange={e => setF("lantai", e.target.value)}>
                    <option value="1">Lantai 1</option>
                    <option value="2">Lantai 2</option>
                    <option value="3">Lantai 3</option>
                  </select>
                </div>
              </div>

              <div className="mf-grid2">
                <div className="mf-field">
                  <label className="mf-label">Tipe Kamar</label>
                  <select className="mf-select" value={form.tipe} onChange={e => setF("tipe", e.target.value)}>
                    <option value="Reguler">Reguler</option>
                    <option value="Premium">Premium</option>
                  </select>
                </div>
                <div className="mf-field">
                  <label className="mf-label">Harga / Bulan (Rp) *</label>
                  <input className="mf-input" type="number" min="0"
                    value={form.harga} onChange={e => setF("harga", e.target.value)}
                    placeholder="1800000" />
                </div>
              </div>

              <div className="mf-field">
                <label className="mf-label">Luas Kamar (m²)</label>
                <input className="mf-input" type="number" min="1" step="0.5"
                  value={form.luas} onChange={e => setF("luas", e.target.value)}
                  placeholder="Contoh: 12" style={{width:"50%"}} />
              </div>

              <div className="mf-field">
                <label className="mf-label">Catatan Khusus</label>
                <textarea className="mf-textarea"
                  value={form.catatan} onChange={e => setF("catatan", e.target.value)}
                  placeholder="Catatan khusus kamar ini..." />
              </div>
            </>
          )}

          {/* ═══ TAB SPESIFIKASI ═══ */}
          {tab === "spec" && (
            <>
              <div style={{fontSize:11,color:"#9ca3af",marginBottom:4}}>
                Centang fasilitas yang tersedia di kamar ini, lalu isi detailnya.
              </div>

              {/* List spec bawaan */}
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {spec.map(s => (
                  <div key={s.id} className={`mf-spec-row${s.checked?" checked":""}`}>
                    {/* Row atas: checkbox + icon + nama */}
                    <div className="mf-spec-top">
                      <div className={`mf-spec-cb${s.checked?" checked":""}`} onClick={() => toggleSpec(s.id)}>
                        {s.checked && <span style={{color:"#fff",fontSize:11,fontWeight:800,lineHeight:1}}>✓</span>}
                      </div>
                      <span className="mf-spec-icon">{s.icon}</span>
                      <span className="mf-spec-name">{s.nama}</span>
                      {s.checked && s.tipe !== "toggle" && (
                        <span style={{fontSize:10,color:"#f97316",fontWeight:600}}>▼ detail</span>
                      )}
                    </div>

                    {/* Row bawah: detail (muncul kalau checked & bukan toggle) */}
                    {s.checked && s.tipe !== "toggle" && (
                      <div className="mf-spec-detail">
                        {s.tipe === "pk" && (
                          <>
                            <span className="mf-spec-detail-label">Kapasitas:</span>
                            <input className="mf-spec-input" type="number" min="0.5" step="0.5"
                              value={s.nilai} onChange={e => updateSpec(s.id,"nilai",e.target.value)}
                              placeholder="1.5" style={{maxWidth:80}} />
                            <span className="mf-spec-unit">PK</span>
                          </>
                        )}
                        {s.tipe === "inci" && (
                          <>
                            <span className="mf-spec-detail-label">Ukuran:</span>
                            <input className="mf-spec-input" type="number" min="14"
                              value={s.nilai} onChange={e => updateSpec(s.id,"nilai",e.target.value)}
                              placeholder="32" style={{maxWidth:80}} />
                            <span className="mf-spec-unit">inci</span>
                          </>
                        )}
                        {s.tipe === "ukuran" && (
                          <>
                            <span className="mf-spec-detail-label">Ukuran kasur:</span>
                            <select className="mf-spec-select"
                              value={s.nilai} onChange={e => updateSpec(s.id,"nilai",e.target.value)}>
                              <option value="Single">Single (90×200 cm)</option>
                              <option value="Single XL">Single XL (100×200 cm)</option>
                              <option value="Double">Double (120×200 cm)</option>
                              <option value="Queen">Queen (160×200 cm)</option>
                              <option value="King">King (180×200 cm)</option>
                            </select>
                          </>
                        )}
                        {s.tipe === "unit" && (
                          <>
                            <span className="mf-spec-detail-label">Jumlah:</span>
                            <input className="mf-spec-input" type="number" min="1"
                              value={s.nilai} onChange={e => updateSpec(s.id,"nilai",e.target.value)}
                              placeholder="1" style={{maxWidth:70}} />
                            <span className="mf-spec-unit">{s.satuan}</span>
                          </>
                        )}
                      </div>
                    )}
                    {s.checked && s.tipe === "toggle" && (
                      <div className="mf-spec-detail">
                        <span style={{fontSize:11,color:"#16a34a",fontWeight:600}}>✅ Tersedia di kamar ini</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Custom spec */}
              {specCustom.length > 0 && (
                <div style={{marginTop:4}}>
                  <div className="mf-section-label">Spesifikasi Tambahan</div>
                  <div style={{display:"flex",flexDirection:"column",gap:6}}>
                    {specCustom.map(s => (
                      <div key={s.id} className="mf-spec-row checked" style={{padding:"8px 12px"}}>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <span style={{fontSize:13,fontWeight:600,color:"#111827",flex:1}}>⚡ {s.nama}</span>
                          {s.nilai && <span style={{fontSize:12,color:"#f97316",fontWeight:600}}>{s.nilai}</span>}
                          <button onClick={() => removeCustomSpec(s.id)}
                            style={{background:"none",border:"none",cursor:"pointer",color:"#dc2626",fontSize:14,padding:"0 2px"}}>✕</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tambah custom */}
              <div style={{marginTop:4}}>
                <div className="mf-section-label">＋ Tambah Spesifikasi Lain</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr auto",gap:8,alignItems:"flex-end"}}>
                  <div className="mf-field">
                    <label className="mf-label">Nama Fasilitas</label>
                    <input className="mf-input" value={newCustNama}
                      onChange={e => setNewCustNama(e.target.value)}
                      placeholder="Contoh: Dispenser, CCTV..." />
                  </div>
                  <div className="mf-field">
                    <label className="mf-label">Detail / Nilai</label>
                    <input className="mf-input" value={newCustVal}
                      onChange={e => setNewCustVal(e.target.value)}
                      placeholder="Contoh: 2 unit, 500W..." />
                  </div>
                  <button className="mf-btn-ghost" onClick={addCustomSpec}
                    style={{height:38,padding:"0 14px"}}>＋ Tambah</button>
                </div>
              </div>
            </>
          )}

          {/* ═══ TAB INVENTARIS ═══ */}
          {tab === "inv" && (
            <>
              <div style={{fontSize:11,color:"#9ca3af",marginBottom:4}}>
                Data aset / barang yang ada di dalam kamar. Digunakan untuk serah terima saat check-out.
              </div>

              {inventaris.length === 0 ? (
                <div style={{textAlign:"center",padding:"20px 0",color:"#9ca3af",fontSize:12}}>
                  <div style={{fontSize:28,marginBottom:6}}>📦</div>
                  Belum ada item inventaris
                </div>
              ) : (
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {inventaris.map(item => (
                    <div key={item.id} className="mf-inv-row">
                      <span className="mf-inv-name">📌 {item.nama}</span>
                      <span className="mf-inv-qty">{item.qty} {item.satuan}</span>
                      <button className="mf-inv-del" onClick={() => removeInv(item.id)}>✕</button>
                    </div>
                  ))}
                </div>
              )}

              {/* Tambah inventaris */}
              <div style={{marginTop:8}}>
                <div className="mf-section-label">＋ Tambah Item</div>
                <div className="mf-add-row">
                  <input className="mf-input" value={newInvNama}
                    onChange={e => setNewInvNama(e.target.value)}
                    placeholder="Nama barang..." style={{fontSize:12}} />
                  <input className="mf-input" type="number" min="1"
                    value={newInvQty} onChange={e => setNewInvQty(e.target.value)}
                    style={{textAlign:"center",fontSize:12}} />
                  <select className="mf-select" value={newInvSat} onChange={e => setNewInvSat(e.target.value)} style={{fontSize:12}}>
                    {["buah","unit","set","pasang","lembar","botol"].map(s =>
                      <option key={s} value={s}>{s}</option>
                    )}
                  </select>
                  <button className="mf-btn-ghost" onClick={addInv}
                    style={{height:38,whiteSpace:"nowrap",padding:"0 12px"}}>＋ Add</button>
                </div>
              </div>
            </>
          )}

        </div>

        {/* Footer */}
        <div className="mf-footer">
          <button className="mf-btn-cancel" onClick={onClose}>Batal</button>
          <button className="mf-btn-save" disabled={!valid} onClick={handleSave}>
            {isEdit ? "✅ Simpan Perubahan" : "＋ Tambah Kamar"}
          </button>
        </div>

      </div>
    </div>
  );
}
