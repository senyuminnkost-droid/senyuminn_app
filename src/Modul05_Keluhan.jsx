import { useState, useEffect } from "react";

// ============================================================
// CSS
// ============================================================
const CSS = `
  .kl-wrap { display: flex; flex-direction: column; gap: 16px; }

  /* ─── TOP CARDS ──────────────────────────── */
  .kl-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
  .kl-card {
    background: #fff; border-radius: 12px; border: 1px solid #e5e7eb;
    padding: 14px 16px; position: relative; overflow: hidden;
  }
  .kl-card-bar { position: absolute; top: 0; left: 0; right: 0; height: 3px; }
  .kl-card-label { font-size: 10px; font-weight: 500; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 4px; margin-top: 8px; }
  .kl-card-val { font-size: 22px; font-weight: 700; color: #111827; font-family: 'JetBrains Mono', monospace; }
  .kl-card-sub { font-size: 11px; color: #6b7280; margin-top: 3px; }

  /* ─── LAYOUT ─────────────────────────────── */
  .kl-layout { display: grid; grid-template-columns: 1fr 320px; gap: 14px; align-items: start; }

  /* ─── WIDGET ─────────────────────────────── */
  .kl-widget {
    background: #fff; border-radius: 12px; border: 1px solid #e5e7eb;
    display: flex; flex-direction: column; overflow: hidden;
  }
  .kl-widget-head {
    padding: 13px 16px 10px; border-bottom: 1px solid #f3f4f6;
    display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;
  }
  .kl-widget-title { font-size: 12px; font-weight: 600; color: #111827; display: flex; align-items: center; gap: 6px; }
  .kl-widget-body { padding: 0; flex: 1; }

  /* ─── FILTER BAR ─────────────────────────── */
  .kl-filterbar {
    display: flex; align-items: center; gap: 8px; padding: 12px 16px;
    border-bottom: 1px solid #f3f4f6; flex-wrap: wrap;
  }
  .kl-search {
    display: flex; align-items: center; gap: 7px;
    background: #f9fafb; border: 1.5px solid #e5e7eb;
    border-radius: 8px; padding: 6px 11px; flex: 1; max-width: 240px;
    transition: border-color 0.12s;
  }
  .kl-search:focus-within { border-color: #f97316; background: #fff; }
  .kl-search-input { border: none; outline: none; background: transparent; font-size: 12px; color: #1f2937; width: 100%; font-family: inherit; }
  .kl-search-input::placeholder { color: #9ca3af; }
  .kl-tag {
    padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 500;
    cursor: pointer; border: 1.5px solid #e5e7eb; color: #6b7280; background: #fff;
    transition: all 0.12s; white-space: nowrap;
  }
  .kl-tag:hover { border-color: #fed7aa; color: #ea580c; }
  .kl-tag.active { background: #111827; border-color: #111827; color: #fff; font-weight: 600; }
  .kl-tag.urgent { background: #fee2e2; border-color: #fca5a5; color: #dc2626; }

  /* ─── TIKET LIST ─────────────────────────── */
  .kl-tiket-item {
    padding: 13px 16px; border-bottom: 1px solid #f3f4f6;
    cursor: pointer; transition: background 0.1s; position: relative;
  }
  .kl-tiket-item:last-child { border-bottom: none; }
  .kl-tiket-item:hover { background: #fafafa; }
  .kl-tiket-item.selected { background: #fff7ed; border-left: 3px solid #f97316; }

  .kl-tiket-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; margin-bottom: 5px; }
  .kl-tiket-id { font-size: 10px; font-weight: 600; color: #9ca3af; font-family: 'JetBrains Mono', monospace; }
  .kl-tiket-kat { font-size: 13px; font-weight: 600; color: #1f2937; margin-bottom: 2px; }
  .kl-tiket-desc { font-size: 11px; color: #6b7280; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 340px; }
  .kl-tiket-meta { display: flex; align-items: center; gap: 6px; margin-top: 6px; flex-wrap: wrap; }
  .kl-tiket-kamar { font-size: 11px; font-weight: 600; color: #374151; background: #f3f4f6; padding: 1px 7px; border-radius: 6px; }
  .kl-tiket-tgl { font-size: 10px; color: #9ca3af; font-family: 'JetBrains Mono', monospace; }

  .kl-badge {
    display: inline-flex; align-items: center; gap: 3px;
    padding: 2px 8px; border-radius: 20px; font-size: 10px; font-weight: 600;
    white-space: nowrap;
  }

  /* ─── DETAIL PANEL ───────────────────────── */
  .kl-detail { padding: 16px; }
  .kl-detail-head { margin-bottom: 14px; }
  .kl-detail-id { font-size: 10px; font-weight: 600; color: #9ca3af; font-family: 'JetBrains Mono', monospace; margin-bottom: 4px; }
  .kl-detail-kat { font-size: 16px; font-weight: 700; color: #111827; margin-bottom: 6px; }
  .kl-detail-badges { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px; }
  .kl-detail-section { margin-bottom: 14px; }
  .kl-detail-label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af; margin-bottom: 6px; display: flex; align-items: center; gap: 6px; }
  .kl-detail-label::after { content: ''; flex: 1; height: 1px; background: #f3f4f6; }
  .kl-detail-desc { font-size: 13px; color: #374151; background: #f9fafb; border-radius: 8px; padding: 10px 12px; line-height: 1.5; }
  .kl-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .kl-detail-item { background: #f9fafb; border-radius: 8px; padding: 9px 11px; }
  .kl-detail-item-key { font-size: 10px; color: #9ca3af; font-weight: 500; text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 2px; }
  .kl-detail-item-val { font-size: 12px; font-weight: 600; color: #1f2937; }

  .kl-status-flow { display: flex; align-items: center; gap: 4px; margin-bottom: 12px; }
  .kl-flow-step {
    flex: 1; text-align: center; padding: 6px 4px; border-radius: 7px;
    font-size: 10px; font-weight: 600; transition: all 0.12s;
  }
  .kl-flow-arrow { font-size: 12px; color: #d1d5db; flex-shrink: 0; }

  .kl-btn-group { display: flex; flex-direction: column; gap: 7px; }
  .kl-btn {
    width: 100%; padding: 9px 14px; border-radius: 8px; font-size: 12px; font-weight: 600;
    border: none; cursor: pointer; font-family: inherit; transition: all 0.15s;
    display: flex; align-items: center; justify-content: center; gap: 5px;
  }
  .kl-btn.primary {
    background: linear-gradient(135deg, #f97316, #ea580c);
    color: #fff; box-shadow: 0 3px 10px rgba(249,115,22,0.25);
  }
  .kl-btn.success {
    background: linear-gradient(135deg, #16a34a, #15803d);
    color: #fff; box-shadow: 0 3px 10px rgba(22,163,74,0.25);
  }
  .kl-btn.ghost { background: #f3f4f6; color: #4b5563; }
  .kl-btn.danger { background: #fee2e2; color: #dc2626; }
  .kl-btn:hover { filter: brightness(0.96); transform: translateY(-1px); }
  .kl-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

  /* ─── MODAL FORM ─────────────────────────── */
  .kl-overlay {
    position: fixed; inset: 0; background: rgba(17,24,39,0.45);
    backdrop-filter: blur(3px); z-index: 200; display: flex;
    align-items: center; justify-content: center; padding: 16px;
    animation: klFade 0.18s ease;
  }
  @keyframes klFade { from { opacity: 0; } to { opacity: 1; } }
  .kl-modal {
    background: #fff; border-radius: 16px; width: 100%; max-width: 520px;
    max-height: 90vh; overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
    animation: klSlide 0.22s cubic-bezier(0.4,0,0.2,1);
  }
  @keyframes klSlide { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .kl-modal-head {
    padding: 18px 20px 14px; border-bottom: 1px solid #f3f4f6;
    display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; background: #fff; z-index: 1;
  }
  .kl-modal-title { font-size: 15px; font-weight: 700; color: #111827; }
  .kl-modal-close {
    width: 28px; height: 28px; border-radius: 7px; background: #f3f4f6;
    border: none; cursor: pointer; font-size: 14px; color: #6b7280;
    display: flex; align-items: center; justify-content: center;
  }
  .kl-modal-close:hover { background: #fee2e2; color: #dc2626; }
  .kl-modal-body { padding: 18px 20px; }
  .kl-modal-foot { padding: 12px 20px; border-top: 1px solid #f3f4f6; display: flex; gap: 8px; }

  .kl-field { margin-bottom: 14px; }
  .kl-field-label { font-size: 11px; font-weight: 600; color: #374151; margin-bottom: 5px; display: block; }
  .kl-field-label span { color: #ef4444; }
  .kl-input {
    width: 100%; padding: 8px 11px; border-radius: 8px;
    border: 1.5px solid #e5e7eb; font-size: 12px; font-family: inherit;
    color: #1f2937; outline: none; background: #fff; transition: border-color 0.12s;
    box-sizing: border-box;
  }
  .kl-input:focus { border-color: #f97316; }
  .kl-input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

  .kl-prioritas-group { display: flex; gap: 8px; }
  .kl-prioritas-opt {
    flex: 1; padding: 8px; border-radius: 8px; border: 1.5px solid #e5e7eb;
    cursor: pointer; text-align: center; transition: all 0.12s;
  }
  .kl-prioritas-opt.normal.selected { background: #f3f4f6; border-color: #9ca3af; }
  .kl-prioritas-opt.urgent.selected { background: #fee2e2; border-color: #fca5a5; }
  .kl-prioritas-icon { font-size: 20px; }
  .kl-prioritas-label { font-size: 11px; font-weight: 600; margin-top: 3px; }

  /* ─── EMPTY ──────────────────────────────── */
  .kl-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 50px 16px; color: #9ca3af; text-align: center; gap: 8px; }
  .kl-empty-icon { font-size: 36px; opacity: 0.4; }
  .kl-empty-title { font-size: 14px; font-weight: 600; color: #374151; }
  .kl-empty-sub { font-size: 12px; }

  /* ─── RESPONSIVE ─────────────────────────── */
  @media (max-width: 1024px) { .kl-layout { grid-template-columns: 1fr; } }
  @media (max-width: 768px)  { .kl-cards { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 480px)  { .kl-cards { grid-template-columns: repeat(2, 1fr); gap: 8px; } .kl-input-row { grid-template-columns: 1fr; } }
`;

function StyleInjector() {
  useEffect(() => {
    const id = "senyuminn-keluhan-css";
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
  open:          { label: "Open",        color: "#dc2626", bg: "#fee2e2" },
  "in-progress": { label: "In Progress", color: "#d97706", bg: "#fef3c7" },
  ditunda:       { label: "Ditunda",     color: "#6d28d9", bg: "#ede9fe" },
  selesai:       { label: "Selesai",     color: "#16a34a", bg: "#dcfce7" },
};

const PRIORITAS_CFG = {
  urgent: { label: "Urgent", color: "#dc2626", bg: "#fee2e2" },
  normal: { label: "Normal", color: "#6b7280", bg: "#f3f4f6" },
};

const KATEGORI_LIST = [
  "AC Bermasalah", "Air", "Listrik", "Bangunan",
  "Elektronik", "Aksesoris Kamar Mandi", "Lemari",
  "Kabinet", "Lainnya",
];

const LOKASI_LIST = ["Unit Kamar", "Fasilitas Umum"];

const STATUS_FLOW = ["open", "in-progress", "ditunda", "selesai"];

const fmt = (n) => "Rp " + (n || 0).toLocaleString("id-ID");
const genId = () => "T" + Date.now().toString().slice(-5);
const today = new Date().toISOString().slice(0, 10);

// ============================================================
// FORM TIKET
// ============================================================
function FormTiket({ onClose, onSave, kamarList }) {
  const [form, setForm] = useState({
    lokasi: "Unit Kamar", kamar: "", kategori: "", prioritas: "normal",
    deskripsi: "", tanggal: today,
  });

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const valid = form.kategori && form.deskripsi && (form.lokasi === "Fasilitas Umum" || form.kamar);

  const handleSave = () => {
    if (!valid) return;
    onSave({
      id: genId(),
      ...form,
      status: "open",
      createdAt: today,
      biaya: null,
    });
    onClose();
  };

  return (
    <div className="kl-overlay" onClick={onClose}>
      <div className="kl-modal" onClick={e => e.stopPropagation()}>
        <div className="kl-modal-head">
          <div className="kl-modal-title">⚑ Buat Tiket Keluhan</div>
          <button className="kl-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="kl-modal-body">

          {/* Lokasi */}
          <div className="kl-field">
            <label className="kl-field-label">Lokasi <span>*</span></label>
            <div style={{ display: "flex", gap: 8 }}>
              {LOKASI_LIST.map(l => (
                <div key={l}
                  onClick={() => set("lokasi", l)}
                  style={{
                    flex: 1, padding: "8px 12px", borderRadius: 8, cursor: "pointer",
                    border: `1.5px solid ${form.lokasi === l ? "#f97316" : "#e5e7eb"}`,
                    background: form.lokasi === l ? "#fff7ed" : "#fff",
                    fontSize: 12, fontWeight: form.lokasi === l ? 600 : 400,
                    color: form.lokasi === l ? "#ea580c" : "#6b7280",
                    textAlign: "center", transition: "all 0.12s",
                  }}>
                  {l === "Unit Kamar" ? "🏠 Unit Kamar" : "🏢 Fasilitas Umum"}
                </div>
              ))}
            </div>
          </div>

          {/* Kamar (jika Unit Kamar) */}
          {form.lokasi === "Unit Kamar" && (
            <div className="kl-field">
              <label className="kl-field-label">Kamar <span>*</span></label>
              <select className="kl-input" value={form.kamar} onChange={e => set("kamar", e.target.value)}>
                <option value="">Pilih kamar...</option>
                {kamarList.map(k => (
                  <option key={k.id} value={k.id}>Kamar {k.id} — {k.tipe} {k.penghuni ? `(${k.penghuni})` : "(Kosong)"}</option>
                ))}
              </select>
            </div>
          )}

          <div className="kl-input-row">
            {/* Kategori */}
            <div className="kl-field">
              <label className="kl-field-label">Kategori <span>*</span></label>
              <select className="kl-input" value={form.kategori} onChange={e => set("kategori", e.target.value)}>
                <option value="">Pilih kategori...</option>
                {KATEGORI_LIST.map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            {/* Tanggal */}
            <div className="kl-field">
              <label className="kl-field-label">Tanggal Temuan</label>
              <input type="date" className="kl-input" value={form.tanggal} onChange={e => set("tanggal", e.target.value)} />
            </div>
          </div>

          {/* Prioritas */}
          <div className="kl-field">
            <label className="kl-field-label">Prioritas <span>*</span></label>
            <div className="kl-prioritas-group">
              <div className={`kl-prioritas-opt normal ${form.prioritas === "normal" ? "selected" : ""}`} onClick={() => set("prioritas", "normal")}>
                <div className="kl-prioritas-icon">🔵</div>
                <div className="kl-prioritas-label" style={{ color: "#6b7280" }}>Normal</div>
                <div style={{ fontSize: 10, color: "#9ca3af" }}>Dijadwalkan PJ</div>
              </div>
              <div className={`kl-prioritas-opt urgent ${form.prioritas === "urgent" ? "selected" : ""}`} onClick={() => set("prioritas", "urgent")}>
                <div className="kl-prioritas-icon">🔴</div>
                <div className="kl-prioritas-label" style={{ color: "#dc2626" }}>Urgent</div>
                <div style={{ fontSize: 10, color: "#9ca3af" }}>Notif WA langsung</div>
              </div>
            </div>
          </div>

          {/* Deskripsi */}
          <div className="kl-field">
            <label className="kl-field-label">Deskripsi Detail <span>*</span></label>
            <textarea
              className="kl-input"
              rows={3}
              placeholder="Jelaskan masalah secara detail..."
              value={form.deskripsi}
              onChange={e => set("deskripsi", e.target.value)}
              style={{ resize: "vertical" }}
            />
          </div>

          {form.prioritas === "urgent" && (
            <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 8, padding: "10px 12px", fontSize: 12, color: "#dc2626", fontWeight: 500 }}>
              🔴 Tiket urgent akan dikirim notifikasi WA ke staff dan PJ Operasional segera.
            </div>
          )}

        </div>
        <div className="kl-modal-foot">
          <button className="kl-btn primary" style={{ flex: 2 }} onClick={handleSave} disabled={!valid}>
            Simpan Tiket
          </button>
          <button className="kl-btn ghost" style={{ flex: 1 }} onClick={onClose}>Batal</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// DETAIL PANEL
// ============================================================
function DetailPanel({ tiket, onStatusChange, onClose }) {
  const sCfg = STATUS_CFG[tiket.status] || STATUS_CFG.open;
  const pCfg = PRIORITAS_CFG[tiket.prioritas] || PRIORITAS_CFG.normal;
  const [biaya, setBiaya] = useState(tiket.biaya || "");

  return (
    <div className="kl-widget">
      <div className="kl-widget-head">
        <div className="kl-widget-title">📋 Detail Tiket</div>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 16 }}>✕</button>
      </div>
      <div className="kl-detail">

        <div className="kl-detail-head">
          <div className="kl-detail-id">#{tiket.id}</div>
          <div className="kl-detail-kat">{tiket.kategori}</div>
          <div className="kl-detail-badges">
            <span className="kl-badge" style={{ background: sCfg.bg, color: sCfg.color }}>{sCfg.label}</span>
            <span className="kl-badge" style={{ background: pCfg.bg, color: pCfg.color }}>{pCfg.label}</span>
            <span className="kl-badge" style={{ background: "#f3f4f6", color: "#374151" }}>
              {tiket.lokasi === "Unit Kamar" ? `🏠 Kamar ${tiket.kamar}` : "🏢 Fasum"}
            </span>
          </div>
        </div>

        {/* Alur Status */}
        <div className="kl-detail-section">
          <div className="kl-detail-label">Alur Status</div>
          <div className="kl-status-flow">
            {STATUS_FLOW.map((s, i) => {
              const cfg  = STATUS_CFG[s];
              const done = STATUS_FLOW.indexOf(tiket.status) >= i;
              return (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 4, flex: 1 }}>
                  <div className="kl-flow-step"
                    style={{
                      background: done ? cfg.bg : "#f9fafb",
                      color: done ? cfg.color : "#9ca3af",
                      border: `1.5px solid ${done ? cfg.color + "44" : "#f3f4f6"}`,
                    }}
                    onClick={() => onStatusChange(tiket.id, s)}
                  >
                    {cfg.label}
                  </div>
                  {i < STATUS_FLOW.length - 1 && <div className="kl-flow-arrow">›</div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Deskripsi */}
        <div className="kl-detail-section">
          <div className="kl-detail-label">Deskripsi</div>
          <div className="kl-detail-desc">{tiket.deskripsi}</div>
        </div>

        {/* Info */}
        <div className="kl-detail-section">
          <div className="kl-detail-label">Informasi</div>
          <div className="kl-detail-grid">
            <div className="kl-detail-item">
              <div className="kl-detail-item-key">Tanggal</div>
              <div className="kl-detail-item-val">{tiket.tanggal}</div>
            </div>
            <div className="kl-detail-item">
              <div className="kl-detail-item-key">Lokasi</div>
              <div className="kl-detail-item-val">{tiket.lokasi === "Unit Kamar" ? `Kamar ${tiket.kamar}` : "Fasum"}</div>
            </div>
            <div className="kl-detail-item">
              <div className="kl-detail-item-key">Dilaporkan oleh</div>
              <div className="kl-detail-item-val">{tiket.createdBy || "—"}</div>
            </div>
            <div className="kl-detail-item">
              <div className="kl-detail-item-key">Ditangani oleh</div>
              <div className="kl-detail-item-val">{tiket.handledBy || "—"}</div>
            </div>
          </div>
        </div>

        {/* Biaya */}
        <div className="kl-detail-section">
          <div className="kl-detail-label">Input Biaya Perbaikan</div>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              className="kl-input"
              placeholder="Rp 0"
              value={biaya}
              onChange={e => setBiaya(e.target.value)}
              style={{ flex: 1 }}
            />
            <button className="kl-btn primary" style={{ padding: "8px 14px", width: "auto" }}
              onClick={() => {
                const nom = parseInt(String(biaya).replace(/[^0-9]/g,"")) || 0;
                if (!nom) return;
                // Update tiket dengan biaya
                setTiketList(prev => prev.map(t =>
                  t.id === tiket.id ? { ...t, biaya: nom, biayaAt: new Date().toISOString().slice(0,10) } : t
                ));
                // Catat ke kas sebagai pengeluaran maintenance
                setKasJurnal(prev => [...prev, {
                  id: "KJ-TKT-"+Date.now(),
                  tanggal: new Date().toISOString().slice(0,10),
                  tipe: "pengeluaran",
                  kategori: "Maintenance",
                  nominal: nom,
                  keterangan: "Biaya tiket "+tiket.id+" — "+tiket.kategori+" Kamar "+(tiket.kamar||"-"),
                  ref: tiket.id,
                }]);
                setBiaya("");
              }}>
              Simpan
            </button>
          </div>
          <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 5 }}>
            Setelah disimpan, biaya akan masuk ke Kas & Jurnal untuk diverifikasi akunting.
          </div>
        </div>

        {/* Aksi */}
        <div className="kl-btn-group">
          {tiket.status !== "selesai" && (
            <button className="kl-btn success"
              onClick={() => onStatusChange(tiket.id, "selesai")}>
              ✅ Tandai Selesai
            </button>
          )}
          {tiket.status === "open" && (
            <button className="kl-btn ghost"
              onClick={() => onStatusChange(tiket.id, "in-progress")}>
              ▶ Mulai Tangani
            </button>
          )}
          {tiket.status !== "ditunda" && tiket.status !== "selesai" && (
            <button className="kl-btn danger"
              onClick={() => onStatusChange(tiket.id, "ditunda")}>
              ⏸ Tunda
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

// ============================================================
// MAIN
// ============================================================
export default function Keluhan({ user, globalData = {} }) {
  const {
    tiketList    = [], setTiketList  = ()=>{},
    kamarList    = [],
    kasJurnal    = [], setKasJurnal  = ()=>{},
    isReadOnly   = false,
  } = globalData;
  const [selected,    setSelected]   = useState(null);
  const [showForm,    setShowForm]   = useState(false);
  const [filterStatus, setFS]        = useState("all");
  const [filterPrioritas, setFP]     = useState("all");
  const [search,      setSearch]     = useState("");

  const isAdmin = user?.role === "manajemen";

  const filtered = tiketList.filter(t => {
    if (filterStatus !== "all" && t.status !== filterStatus) return false;
    if (filterPrioritas === "urgent" && t.prioritas !== "urgent") return false;
    if (search) {
      const q = search.toLowerCase();
      if (!t.kategori?.toLowerCase().includes(q) &&
          !t.deskripsi?.toLowerCase().includes(q) &&
          !String(t.kamar || "").includes(q) &&
          !t.id?.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const counts = {
    open:          tiketList.filter(t => t.status === "open").length,
    "in-progress": tiketList.filter(t => t.status === "in-progress").length,
    ditunda:       tiketList.filter(t => t.status === "ditunda").length,
    selesai:       tiketList.filter(t => t.status === "selesai").length,
    urgent:        tiketList.filter(t => t.prioritas === "urgent" && t.status !== "selesai").length,
  };

  const handleSave = (tiket) => {
    setTiketList(prev => [tiket, ...prev]);
  };

  const handleStatusChange = (id, newStatus) => {
    setTiketList(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    if (selected?.id === id) setSelected(prev => ({ ...prev, status: newStatus }));
  };

  return (
    <div className="kl-wrap">
      <StyleInjector />

      {/* Cards */}
      <div className="kl-cards">
        {[
          { label: "Tiket Open",        val: counts.open,          color: "#ef4444", sub: "Belum ditangani" },
          { label: "In Progress",       val: counts["in-progress"],color: "#f59e0b", sub: "Sedang dikerjakan" },
          { label: "Ditunda",           val: counts.ditunda,       color: "#8b5cf6", sub: "Menunggu jadwal" },
          { label: "Urgent",            val: counts.urgent,        color: "#dc2626", sub: "Perlu segera!" },
        ].map((c, i) => (
          <div key={i} className="kl-card">
            <div className="kl-card-bar" style={{ background: c.color }} />
            <div className="kl-card-label">{c.label}</div>
            <div className="kl-card-val" style={{ color: c.val > 0 ? c.color : "#111827" }}>
              {tiketList.length === 0 ? "—" : c.val}
            </div>
            <div className="kl-card-sub">{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Layout */}
      <div className="kl-layout">

        {/* List */}
        <div className="kl-widget">
          <div className="kl-widget-head">
            <div className="kl-widget-title">🔧 Daftar Tiket</div>
            <button
              onClick={() => setShowForm(true)}
              style={{ background: "linear-gradient(135deg,#f97316,#ea580c)", color: "#fff", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
              + Buat Tiket
            </button>
          </div>

          {/* Filter */}
          <div className="kl-filterbar">
            <div className="kl-search">
              <span>🔍</span>
              <input className="kl-search-input" placeholder="Cari tiket, kamar, deskripsi..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            {["all","open","in-progress","ditunda","selesai"].map(s => (
              <div key={s} className={`kl-tag ${filterStatus === s ? "active" : ""}`} onClick={() => setFS(s)}>
                {s === "all" ? "Semua" : STATUS_CFG[s]?.label}
              </div>
            ))}
            <div className={`kl-tag urgent ${filterPrioritas === "urgent" ? "selected" : ""}`}
              style={filterPrioritas === "urgent" ? { background: "#fee2e2", borderColor: "#fca5a5", color: "#dc2626" } : {}}
              onClick={() => setFP(filterPrioritas === "urgent" ? "all" : "urgent")}>
              🔴 Urgent
            </div>
          </div>

          {/* List */}
          <div className="kl-widget-body">
            {tiketList.length === 0 ? (
              <div className="kl-empty">
                <div className="kl-empty-icon">🔧</div>
                <div className="kl-empty-title">Belum ada tiket keluhan</div>
                <div className="kl-empty-sub">Klik "+ Buat Tiket" untuk melaporkan keluhan</div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="kl-empty">
                <div className="kl-empty-icon">🔍</div>
                <div className="kl-empty-title">Tidak ada tiket yang sesuai</div>
                <div className="kl-empty-sub">Coba ubah filter atau kata kunci</div>
              </div>
            ) : (
              filtered.map(t => {
                const sCfg = STATUS_CFG[t.status] || STATUS_CFG.open;
                const pCfg = PRIORITAS_CFG[t.prioritas] || PRIORITAS_CFG.normal;
                return (
                  <div key={t.id}
                    className={`kl-tiket-item ${selected?.id === t.id ? "selected" : ""}`}
                    onClick={() => setSelected(t)}>
                    <div className="kl-tiket-top">
                      <div>
                        <div className="kl-tiket-id">#{t.id}</div>
                        <div className="kl-tiket-kat">{t.kategori}</div>
                        <div className="kl-tiket-desc">{t.deskripsi}</div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
                        <span className="kl-badge" style={{ background: sCfg.bg, color: sCfg.color }}>{sCfg.label}</span>
                        <span className="kl-badge" style={{ background: pCfg.bg, color: pCfg.color }}>{pCfg.label}</span>
                      </div>
                    </div>
                    <div className="kl-tiket-meta">
                      {t.lokasi === "Unit Kamar" && (
                        <span className="kl-tiket-kamar">🏠 Kamar {t.kamar}</span>
                      )}
                      {t.lokasi === "Fasilitas Umum" && (
                        <span className="kl-tiket-kamar">🏢 Fasum</span>
                      )}
                      <span className="kl-tiket-tgl">{t.tanggal}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Detail */}
        {selected ? (
          <DetailPanel
            tiket={selected}
            onStatusChange={handleStatusChange}
            onClose={() => setSelected(null)}
          />
        ) : (
          <div className="kl-widget" style={{ alignItems: "center", justifyContent: "center" }}>
            <div className="kl-empty" style={{ padding: "50px 20px" }}>
              <div className="kl-empty-icon">📋</div>
              <div className="kl-empty-title">Pilih tiket</div>
              <div className="kl-empty-sub">Klik tiket di sebelah kiri untuk melihat detail</div>
            </div>
          </div>
        )}

      </div>

      {/* Form Modal */}
      {showForm && (
        <FormTiket
          onClose={() => setShowForm(false)}
          onSave={handleSave}
          kamarList={kamarList}
        />
      )}

    </div>
  );
}
