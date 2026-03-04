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
function DetailDrawer({ kamar, tiketList, onClose }) {
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
            <button className="m-close" onClick={onClose}>✕</button>
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
export default function MonitorKamar() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterTipe,   setFilterTipe]   = useState("all");
  const [filterLantai, setFilterLantai] = useState("all");
  const [search,       setSearch]       = useState("");
  const [selected,     setSelected]     = useState(null);

  // Data dari Supabase nanti — kosong dulu
  const kamarList = [];
  const tiketList = [];

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
        />
      )}
    </div>
  );
}
