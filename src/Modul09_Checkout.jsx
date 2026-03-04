import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

// ============================================================
// CSS
// ============================================================
const CSS = `
  .co-wrap { display: flex; flex-direction: column; gap: 16px; }

  .co-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
  .co-card { background: #fff; border-radius: 12px; border: 1px solid #e5e7eb; padding: 14px 16px; position: relative; overflow: hidden; }
  .co-card-bar { position: absolute; top: 0; left: 0; right: 0; height: 3px; }
  .co-card-label { font-size: 10px; font-weight: 500; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 4px; margin-top: 8px; }
  .co-card-val { font-size: 22px; font-weight: 700; color: #111827; font-family: 'JetBrains Mono', monospace; }
  .co-card-sub { font-size: 11px; color: #6b7280; margin-top: 3px; }

  .co-layout { display: grid; grid-template-columns: 1fr 380px; gap: 14px; align-items: start; }

  .co-widget { background: #fff; border-radius: 12px; border: 1px solid #e5e7eb; display: flex; flex-direction: column; overflow: hidden; }
  .co-widget-head { padding: 13px 16px 10px; border-bottom: 1px solid #f3f4f6; display: flex; align-items: center; justify-content: space-between; }
  .co-widget-title { font-size: 12px; font-weight: 600; color: #111827; display: flex; align-items: center; gap: 6px; }
  .co-widget-body { padding: 0; flex: 1; }

  /* ─── TABS ───────────────────────────────── */
  .co-tabs { display: flex; gap: 2px; padding: 10px 14px 0; border-bottom: 1px solid #f3f4f6; }
  .co-tab { padding: 7px 14px; font-size: 11px; font-weight: 600; color: #9ca3af; cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.12s; white-space: nowrap; }
  .co-tab:hover { color: #374151; }
  .co-tab.active { color: #f97316; border-bottom-color: #f97316; }

  /* ─── PENYEWA ITEM ───────────────────────── */
  .co-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-bottom: 1px solid #f3f4f6; cursor: pointer; transition: background 0.1s; }
  .co-item:last-child { border-bottom: none; }
  .co-item:hover { background: #fafafa; }
  .co-item.selected { background: #fff7ed; border-left: 3px solid #f97316; }
  .co-avatar { width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0; background: linear-gradient(135deg, #f97316, #ea580c); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: #fff; }
  .co-item-info { flex: 1; min-width: 0; }
  .co-item-name { font-size: 13px; font-weight: 600; color: #1f2937; }
  .co-item-meta { font-size: 11px; color: #9ca3af; margin-top: 2px; display: flex; gap: 8px; flex-wrap: wrap; }
  .co-item-right { text-align: right; flex-shrink: 0; }
  .co-item-kamar { font-size: 13px; font-weight: 700; color: #111827; font-family: 'JetBrains Mono', monospace; }
  .co-item-sisa { font-size: 10px; margin-top: 2px; font-weight: 600; }

  .co-badge { display: inline-flex; align-items: center; gap: 3px; padding: 2px 8px; border-radius: 20px; font-size: 10px; font-weight: 600; }

  /* ─── ACTION PANEL ───────────────────────── */
  .co-panel { padding: 16px; overflow-y: auto; max-height: calc(100vh - 220px); }
  .co-panel-header { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 16px; }
  .co-panel-avatar { width: 48px; height: 48px; border-radius: 12px; flex-shrink: 0; background: linear-gradient(135deg, #f97316, #ea580c); display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 700; color: #fff; }
  .co-panel-name { font-size: 16px; font-weight: 700; color: #111827; }
  .co-panel-sub  { font-size: 11px; color: #9ca3af; margin-top: 2px; }

  .co-section { margin-bottom: 16px; }
  .co-section-label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: #9ca3af; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
  .co-section-label::after { content: ''; flex: 1; height: 1px; background: #f3f4f6; }

  .co-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .co-info-item { background: #f9fafb; border-radius: 8px; padding: 9px 11px; }
  .co-info-key { font-size: 10px; color: #9ca3af; font-weight: 500; text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 2px; }
  .co-info-val { font-size: 12px; font-weight: 600; color: #1f2937; }
  .co-info-val.orange { color: #ea580c; }
  .co-info-val.red    { color: #dc2626; }
  .co-info-val.green  { color: #16a34a; }

  .co-kontrak-bar { background: linear-gradient(135deg, #fff7ed, #fff); border: 1px solid #fed7aa; border-radius: 10px; padding: 12px 14px; }
  .co-kontrak-dates { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 600; color: #374151; font-family: 'JetBrains Mono', monospace; margin-bottom: 8px; }
  .co-progress { height: 6px; background: #f3f4f6; border-radius: 3px; overflow: hidden; margin-bottom: 6px; }
  .co-progress-fill { height: 100%; border-radius: 3px; background: linear-gradient(90deg, #f97316, #16a34a); }

  /* Action buttons */
  .co-action-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px; }
  .co-action-btn { padding: 12px; border-radius: 10px; border: 1.5px solid #e5e7eb; cursor: pointer; text-align: center; transition: all 0.15s; background: #fff; font-family: inherit; }
  .co-action-btn:hover { border-color: #f97316; background: #fff7ed; }
  .co-action-btn.danger:hover { border-color: #dc2626; background: #fee2e2; }
  .co-action-btn-icon { font-size: 22px; margin-bottom: 5px; }
  .co-action-btn-label { font-size: 12px; font-weight: 600; color: #374151; }
  .co-action-btn.danger .co-action-btn-label { color: #dc2626; }
  .co-action-btn-sub { font-size: 10px; color: #9ca3af; margin-top: 2px; }

  /* ─── MODAL ───────────────────────────────── */
  .co-overlay-portal { position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; background: rgba(17,24,39,0.65) !important; backdrop-filter: blur(4px) !important; z-index: 9999 !important; display: flex !important; align-items: center !important; justify-content: center !important; padding: 16px !important; box-sizing: border-box !important; animation: coFade 0.18s ease; }
  @keyframes coFade { from { opacity: 0; } to { opacity: 1; } }
  .co-modal { background: #fff; border-radius: 16px; width: 100%; max-width: 520px; max-height: 90vh; overflow-y: auto; box-shadow: 0 24px 64px rgba(0,0,0,0.18); animation: coSlide 0.2s cubic-bezier(0.4,0,0.2,1); }
  @keyframes coSlide { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .co-modal-head { padding: 16px 20px 12px; border-bottom: 1px solid #f3f4f6; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; background: #fff; z-index: 1; }
  .co-modal-title { font-size: 14px; font-weight: 700; color: #111827; }
  .co-modal-close { width: 28px; height: 28px; border-radius: 7px; background: #f3f4f6; border: none; cursor: pointer; font-size: 14px; color: #6b7280; display: flex; align-items: center; justify-content: center; }
  .co-modal-close:hover { background: #fee2e2; color: #dc2626; }
  .co-modal-body { padding: 18px 20px; }
  .co-modal-foot { padding: 12px 20px; border-top: 1px solid #f3f4f6; display: flex; gap: 8px; }

  .co-field { margin-bottom: 13px; }
  .co-field-label { font-size: 11px; font-weight: 600; color: #374151; margin-bottom: 5px; display: block; }
  .co-input { width: 100%; padding: 8px 11px; border-radius: 8px; border: 1.5px solid #e5e7eb; font-size: 12px; font-family: inherit; color: #1f2937; outline: none; background: #fff; transition: border-color 0.12s; box-sizing: border-box; }
  .co-input:focus { border-color: #f97316; }
  .co-input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .co-divider { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af; margin: 14px 0 10px; display: flex; align-items: center; gap: 6px; }
  .co-divider::after { content: ''; flex: 1; height: 1px; background: #f3f4f6; }

  .co-summary { background: #f9fafb; border-radius: 10px; padding: 12px 14px; }
  .co-summary-row { display: flex; justify-content: space-between; align-items: center; padding: 5px 0; border-bottom: 1px solid #f3f4f6; font-size: 12px; }
  .co-summary-row:last-child { border-bottom: none; }
  .co-summary-key { color: #6b7280; }
  .co-summary-val { font-weight: 600; color: #111827; }
  .co-summary-val.orange { color: #ea580c; }
  .co-summary-val.red    { color: #dc2626; }
  .co-summary-val.green  { color: #16a34a; }

  .co-btn { flex: 1; padding: 9px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; border: none; cursor: pointer; font-family: inherit; transition: all 0.15s; display: flex; align-items: center; justify-content: center; gap: 5px; }
  .co-btn.primary { background: linear-gradient(135deg, #f97316, #ea580c); color: #fff; box-shadow: 0 3px 10px rgba(249,115,22,0.25); }
  .co-btn.success { background: linear-gradient(135deg, #16a34a, #15803d); color: #fff; }
  .co-btn.danger  { background: linear-gradient(135deg, #dc2626, #b91c1c); color: #fff; }
  .co-btn.ghost   { background: #f3f4f6; color: #4b5563; }
  .co-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .co-btn:hover:not(:disabled) { filter: brightness(1.04); transform: translateY(-1px); }

  /* Success screen */
  .co-success { text-align: center; padding: 24px 0 16px; }
  .co-success-icon { font-size: 52px; margin-bottom: 10px; }
  .co-success-title { font-size: 17px; font-weight: 700; color: #111827; margin-bottom: 6px; }
  .co-success-sub { font-size: 12px; color: #6b7280; line-height: 1.6; margin-bottom: 20px; }

  .co-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 50px 16px; color: #9ca3af; text-align: center; gap: 8px; }
  .co-empty-icon { font-size: 36px; opacity: 0.4; }
  .co-empty-title { font-size: 14px; font-weight: 600; color: #374151; }
  .co-empty-sub { font-size: 12px; }

  @media (max-width: 1024px) { .co-layout { grid-template-columns: 1fr; } }
  @media (max-width: 768px)  { .co-cards { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 480px)  { .co-cards { grid-template-columns: repeat(2, 1fr); gap: 8px; } .co-input-row { grid-template-columns: 1fr; } .co-action-grid { grid-template-columns: 1fr; } }
`;

function StyleInjector() {
  useEffect(() => {
    const id = "senyuminn-checkout-css";
    if (document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id; el.textContent = CSS;
    document.head.appendChild(el);
    return () => { const e = document.getElementById(id); if (e) e.remove(); };
  }, []);
  return null;
}

// ============================================================
// HELPERS
// ============================================================
const padD = (n) => String(n).padStart(2, "0");
const todayStr = (() => { const d = new Date(); return `${d.getFullYear()}-${padD(d.getMonth()+1)}-${padD(d.getDate())}`; })();
const fmtRp = (n) => n ? "Rp " + Number(n).toLocaleString("id-ID") : "—";
const hariSisa = (tgl) => tgl ? Math.ceil((new Date(tgl) - new Date()) / 86400000) : null;
const progressKontrak = (mulai, selesai) => {
  if (!mulai || !selesai) return 0;
  return Math.min(100, Math.max(0, Math.round(((new Date() - new Date(mulai)) / (new Date(selesai) - new Date(mulai))) * 100)));
};
const getInisial = (nama) => {
  if (!nama) return "?";
  const p = nama.trim().split(" ");
  return p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : nama.slice(0,2).toUpperCase();
};
const addMonths = (dateStr, n) => {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + parseInt(n));
  return `${d.getFullYear()}-${padD(d.getMonth()+1)}-${padD(d.getDate())}`;
};

// ============================================================
// MODAL PERPANJANG
// ============================================================
function ModalPerpanjang({ penyewa, kamarList, onClose, onSave }) {
  const kamar = kamarList.find(k => k.id === penyewa.kamarId);
  const [durasi, setDurasi] = useState("6");
  const [mulai,  setMulai]  = useState(penyewa.kontrakSelesai || todayStr);
  const [done,   setDone]   = useState(false);

  const selesai = mulai && durasi ? addMonths(mulai, durasi) : "";
  const harga   = kamar?.harga || 0;
  const total   = harga * parseInt(durasi);

  const handleSave = () => {
    onSave({ ...penyewa, kontrakMulai: mulai, kontrakSelesai: selesai, durasi });
    setDone(true);
  };

  const content = done ? (
    <div className="co-modal-body">
      <div className="co-success">
        <div className="co-success-icon">✅</div>
        <div className="co-success-title">Kontrak Diperpanjang!</div>
        <div className="co-success-sub">
          Kontrak <b>{penyewa.nama}</b> berhasil diperpanjang.<br />
          Periode baru: <b>{mulai} → {selesai}</b>.<br />
          Tagihan baru telah dibuat otomatis.
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <button className="co-btn primary" style={{ maxWidth: 180 }} onClick={() => alert("Generate surat perpanjangan...")}>📄 Surat Perpanjangan</button>
          <button className="co-btn ghost"   style={{ maxWidth: 100 }} onClick={onClose}>Tutup</button>
        </div>
      </div>
    </div>
  ) : (
    <>
      <div className="co-modal-body">
        <div style={{ display: "flex", gap: 10, alignItems: "center", background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 10, padding: "10px 14px", marginBottom: 16 }}>
          <div style={{ fontSize: 24 }}>🏠</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{penyewa.nama} — Kamar {penyewa.kamarId}</div>
            <div style={{ fontSize: 11, color: "#9a3412" }}>Kontrak lama: {penyewa.kontrakMulai} → {penyewa.kontrakSelesai}</div>
          </div>
        </div>

        <div className="co-divider">Periode Baru</div>
        <div className="co-input-row">
          <div className="co-field">
            <label className="co-field-label">Mulai Kontrak Baru</label>
            <input type="date" className="co-input" value={mulai} onChange={e => setMulai(e.target.value)} />
          </div>
          <div className="co-field">
            <label className="co-field-label">Durasi</label>
            <select className="co-input" value={durasi} onChange={e => setDurasi(e.target.value)}>
              <option value="3">3 bulan</option>
              <option value="6">6 bulan</option>
              <option value="12">12 bulan</option>
            </select>
          </div>
        </div>

        {selesai && (
          <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#15803d", marginBottom: 14 }}>
            ✅ Kontrak baru berakhir: <b>{selesai}</b>
          </div>
        )}

        <div className="co-divider">Ringkasan Tagihan</div>
        <div className="co-summary">
          {[
            { k: "Harga/bulan",  v: fmtRp(harga) },
            { k: "Durasi",       v: `${durasi} bulan` },
            { k: "Periode",      v: `${mulai} → ${selesai}` },
            { k: "Total Tagihan",v: fmtRp(total), cls: "orange" },
          ].map((r, i) => (
            <div key={i} className="co-summary-row">
              <span className="co-summary-key">{r.k}</span>
              <span className={`co-summary-val ${r.cls||""}`}>{r.v}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="co-modal-foot">
        <button className="co-btn success" onClick={handleSave}>✅ Konfirmasi Perpanjang</button>
        <button className="co-btn ghost"   onClick={onClose}>Batal</button>
      </div>
    </>
  );

  return createPortal(
    <div className="co-overlay-portal" onClick={onClose}>
      <div className="co-modal" onClick={e => e.stopPropagation()}>
        <div className="co-modal-head">
          <div className="co-modal-title">📋 Perpanjang Kontrak</div>
          <button className="co-modal-close" onClick={onClose}>✕</button>
        </div>
        {content}
      </div>
    </div>
  , document.body);
}

// ============================================================
// MODAL CHECKOUT
// ============================================================
function ModalCheckout({ penyewa, kamarList, onClose, onCheckout }) {
  const kamar   = kamarList.find(k => k.id === penyewa.kamarId);
  const sisa    = hariSisa(penyewa.kontrakSelesai);
  const [done,  setDone]  = useState(false);
  const [form,  setForm]  = useState({
    tglCheckout: todayStr,
    kondisiKamar: "baik",
    catatan: "",
    dendaSewa: 0,   // Sewa harian jika melebihi kontrak
    dendaKerusakan: 0,
  });
  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  // Hitung denda sewa harian jika check-out setelah kontrak habis
  const hariTerlambat = sisa !== null && sisa < 0 ? Math.abs(sisa) : 0;
  const SEWA_HARIAN = pengaturanConfig.sewaHarian   || 250000;
  const dendaCheckout = pengaturanConfig.dendaPerHari || 50000;
  const totalDendaSewa = hariTerlambat * SEWA_HARIAN;

  const totalTagihan = totalDendaSewa + Number(form.dendaKerusakan || 0);

  const handleCheckout = () => {
    onCheckout({ ...penyewa, tglCheckout: form.tglCheckout, statusKamar: "deep-clean" });
    setDone(true);
  };

  const content = done ? (
    <div className="co-modal-body">
      <div className="co-success">
        <div className="co-success-icon">🚪</div>
        <div className="co-success-title">Check-out Berhasil!</div>
        <div className="co-success-sub">
          <b>{penyewa.nama}</b> telah check-out dari Kamar {penyewa.kamarId}.<br />
          Status kamar diperbarui → <b>Deep Clean</b>.<br />
          Notifikasi dikirim ke staff pagi.
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <button className="co-btn ghost" style={{ maxWidth: 120 }} onClick={onClose}>Tutup</button>
        </div>
      </div>
    </div>
  ) : (
    <>
      <div className="co-modal-body">
        {/* Info penyewa */}
        <div style={{ display: "flex", gap: 10, alignItems: "center", background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 10, padding: "10px 14px", marginBottom: 16 }}>
          <div style={{ fontSize: 24 }}>🚪</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{penyewa.nama} — Kamar {penyewa.kamarId}</div>
            <div style={{ fontSize: 11, color: "#9a3412" }}>
              Kontrak: {penyewa.kontrakMulai} → {penyewa.kontrakSelesai}
              {sisa !== null && sisa < 0 && <span style={{ color: "#dc2626", fontWeight: 700 }}> · {Math.abs(sisa)} hari melewati kontrak!</span>}
            </div>
          </div>
        </div>

        <div className="co-input-row">
          <div className="co-field">
            <label className="co-field-label">Tanggal Check-out</label>
            <input type="date" className="co-input" value={form.tglCheckout} onChange={e => set("tglCheckout", e.target.value)} />
          </div>
          <div className="co-field">
            <label className="co-field-label">Kondisi Kamar</label>
            <select className="co-input" value={form.kondisiKamar} onChange={e => set("kondisiKamar", e.target.value)}>
              <option value="baik">Baik — tidak ada kerusakan</option>
              <option value="ringan">Ada kerusakan ringan</option>
              <option value="berat">Ada kerusakan berat</option>
            </select>
          </div>
        </div>

        {/* Denda */}
        <div className="co-divider">Perhitungan Denda</div>
        <div className="co-summary" style={{ marginBottom: 12 }}>
          <div className="co-summary-row">
            <span className="co-summary-key">Hari melewati kontrak</span>
            <span className="co-summary-val">{hariTerlambat} hari</span>
          </div>
          <div className="co-summary-row">
            <span className="co-summary-key">Denda sewa harian</span>
            <span className="co-summary-val">{fmtRp(totalDendaSewa)}</span>
          </div>
          <div className="co-summary-row">
            <span className="co-summary-key">Denda kerusakan</span>
            <span className="co-summary-val">
              <input
                className="co-input"
                placeholder="Rp 0"
                value={form.dendaKerusakan}
                onChange={e => set("dendaKerusakan", e.target.value)}
                style={{ width: 120, padding: "3px 8px", fontSize: 11 }}
              />
            </span>
          </div>
          <div className="co-summary-row" style={{ fontWeight: 700 }}>
            <span className="co-summary-key" style={{ fontWeight: 700, color: "#111827" }}>Total Tagihan</span>
            <span className={`co-summary-val ${totalTagihan > 0 ? "red" : "green"}`}>
              {totalTagihan > 0 ? fmtRp(totalTagihan) : "Tidak ada denda"}
            </span>
          </div>
        </div>

        <div className="co-field">
          <label className="co-field-label">Catatan Check-out</label>
          <textarea className="co-input" rows={2} placeholder="Catatan kondisi kamar, barang tertinggal, dll..." value={form.catatan} onChange={e => set("catatan", e.target.value)} style={{ resize: "none" }} />
        </div>

        {/* After checkout info */}
        <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 8, padding: "10px 12px", fontSize: 11, color: "#0369a1" }}>
          ℹ️ Setelah check-out: status kamar → <b>Deep Clean</b> · Notifikasi ke staff pagi · Data penyewa dipindah ke Riwayat
        </div>
      </div>
      <div className="co-modal-foot">
        <button className="co-btn danger" onClick={handleCheckout}>🚪 Konfirmasi Check-out</button>
        <button className="co-btn ghost"  onClick={onClose}>Batal</button>
      </div>
    </>
  );

  return createPortal(
    <div className="co-overlay-portal" onClick={onClose}>
      <div className="co-modal" onClick={e => e.stopPropagation()}>
        <div className="co-modal-head">
          <div className="co-modal-title">🚪 Proses Check-out</div>
          <button className="co-modal-close" onClick={onClose}>✕</button>
        </div>
        {content}
      </div>
    </div>
  , document.body);
}

// ============================================================
// ACTION PANEL (kanan)
// ============================================================
function ActionPanel({ penyewa, kamarList, onPerpanjang, onCheckout, onClose }) {
  const sisa    = hariSisa(penyewa.kontrakSelesai);
  const progres = progressKontrak(penyewa.kontrakMulai, penyewa.kontrakSelesai);
  const kamar   = kamarList.find(k => k.id === penyewa.kamarId);

  return (
    <div className="co-widget">
      <div className="co-widget-head">
        <div className="co-widget-title">🔑 Aksi Kontrak</div>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 16 }}>✕</button>
      </div>
      <div className="co-panel">

        {/* Header */}
        <div className="co-panel-header">
          <div className="co-panel-avatar">{getInisial(penyewa.nama)}</div>
          <div style={{ flex: 1 }}>
            <div className="co-panel-name">{penyewa.nama}</div>
            <div className="co-panel-sub">📞 {penyewa.noHP || "—"} · {penyewa.pekerjaan || "—"}</div>
          </div>
        </div>

        {/* Kontrak */}
        <div className="co-section">
          <div className="co-section-label">Status Kontrak</div>
          <div className="co-kontrak-bar">
            <div className="co-kontrak-dates">
              <span>{penyewa.kontrakMulai || "—"}</span>
              <span style={{ color: "#f97316" }}>→</span>
              <span style={{ color: sisa !== null && sisa <= 30 ? "#dc2626" : "#374151" }}>{penyewa.kontrakSelesai || "—"}</span>
            </div>
            <div className="co-progress"><div className="co-progress-fill" style={{ width: `${progres}%` }} /></div>
            <div style={{ fontSize: 11, fontWeight: 600, color: sisa <= 0 ? "#dc2626" : sisa <= 7 ? "#dc2626" : sisa <= 30 ? "#d97706" : "#16a34a" }}>
              {sisa === null ? "—" : sisa <= 0 ? `⚠️ ${Math.abs(sisa)} hari melewati kontrak!` : sisa <= 7 ? `🔴 ${sisa} hari lagi — segera tindak` : sisa <= 30 ? `⚠️ ${sisa} hari lagi` : `✅ ${sisa} hari tersisa`}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="co-section">
          <div className="co-section-label">Informasi</div>
          <div className="co-info-grid">
            <div className="co-info-item">
              <div className="co-info-key">Kamar</div>
              <div className="co-info-val orange">K{padD(penyewa.kamarId)} — {kamar?.tipe || "—"}</div>
            </div>
            <div className="co-info-item">
              <div className="co-info-key">Harga/bulan</div>
              <div className="co-info-val orange">{fmtRp(kamar?.harga)}</div>
            </div>
            <div className="co-info-item">
              <div className="co-info-key">Durasi Kontrak</div>
              <div className="co-info-val">{penyewa.durasi} bulan</div>
            </div>
            <div className="co-info-item">
              <div className="co-info-key">Partner</div>
              <div className="co-info-val">{penyewa.partner?.length > 0 ? penyewa.partner.join(", ") : "—"}</div>
            </div>
          </div>
        </div>

        {/* Aksi */}
        <div className="co-section">
          <div className="co-section-label">Pilih Aksi</div>
          <div className="co-action-grid">
            <button className="co-action-btn" onClick={onPerpanjang}>
              <div className="co-action-btn-icon">📋</div>
              <div className="co-action-btn-label">Perpanjang</div>
              <div className="co-action-btn-sub">Lanjutkan kontrak</div>
            </button>
            <button className="co-action-btn danger" onClick={onCheckout}>
              <div className="co-action-btn-icon">🚪</div>
              <div className="co-action-btn-label">Check-out</div>
              <div className="co-action-btn-sub">Akhiri kontrak</div>
            </button>
          </div>
        </div>

        {sisa !== null && sisa <= 30 && (
          <div style={{ background: sisa <= 7 ? "#fee2e2" : "#fff7ed", border: `1px solid ${sisa <= 7 ? "#fca5a5" : "#fed7aa"}`, borderRadius: 8, padding: "10px 12px", fontSize: 11, color: sisa <= 7 ? "#dc2626" : "#92400e", fontWeight: 500 }}>
            {sisa <= 7 ? "🔴" : "⚠️"} {sisa <= 0 ? "Kontrak sudah habis! Segera proses perpanjang atau check-out." : `Kontrak berakhir dalam ${sisa} hari. Hubungi penyewa segera.`}
          </div>
        )}

      </div>
    </div>
  );
}

// ============================================================
// MAIN
// ============================================================
export default function Checkout({ user, globalData = {} }) {
  const {
    penyewaList        = [], setPenyewaList  = () => {},
    riwayatList        = [], setRiwayatList  = () => {},
    kamarList          = [], setKamarList    = () => {},
    pengaturanConfig   = {},
    isReadOnly         = false,
    depositList      = [], setDepositList    = () => {},
    sewaDimukaList   = [], setSewaDimukaList = () => {},
    kasJurnal        = [], setKasJurnal      = () => {},
  } = globalData;

  const SEWA_HARIAN    = pengaturanConfig.sewaHarian    || 250000;
  const DENDA_CHECKOUT = pengaturanConfig.dendaPerHari  || 50000;

  const [tab,      setTab]      = useState("semua"); // semua | mau-habis | terlambat
  const [selected, setSelected] = useState(null);
  const [modal,    setModal]    = useState(null); // "perpanjang" | "checkout"
  const [search,   setSearch]   = useState("");

  const isAdmin = user?.role === "superadmin" || user?.role === "admin";

  // Filter
  const filtered = penyewaList.filter(p => {
    const sisa = hariSisa(p.kontrakSelesai);
    if (tab === "mau-habis" && !(sisa !== null && sisa >= 0 && sisa <= 30)) return false;
    if (tab === "terlambat" && !(sisa !== null && sisa < 0)) return false;
    if (search) {
      const q = search.toLowerCase();
      return p.nama?.toLowerCase().includes(q) || String(p.kamarId).includes(q);
    }
    return true;
  });

  // Counts
  const mauHabis  = penyewaList.filter(p => { const s = hariSisa(p.kontrakSelesai); return s !== null && s >= 0 && s <= 30; }).length;
  const terlambat = penyewaList.filter(p => { const s = hariSisa(p.kontrakSelesai); return s !== null && s < 0; }).length;

  const handlePerpanjang = (data) => {
    setPenyewaList(prev => prev.map(p => p.id === data.id ? data : p));
    setSelected(data);
    setModal(null);
  };

  const handleCheckout = (data) => {
    const tglOut = data.tglCheckout || todayStr;

    // Proses deposit jika ada
    const dep = depositList.find(d => d.penyewaId === data.id && d.status === "aktif");
    if (dep) {
      const dendaKerusakan = data.dendaKerusakan || 0;
      const sisaDeposit    = Math.max(0, dep.nominal - dendaKerusakan);
      const statusDeposit  = dendaKerusakan >= dep.nominal ? "dipotong" : dendaKerusakan > 0 ? "dipotong_sebagian" : "dikembalikan";

      setDepositList(prev => prev.map(d =>
        d.id === dep.id ? { ...d, status: statusDeposit, tglKeluar: tglOut, dendaKerusakan } : d
      ));

      // Pengembalian deposit → keluar dari kas
      if (sisaDeposit > 0) {
        setKasJurnal(prev => [...prev, {
          id:         "KJ-RETDEP-" + Date.now(),
          tanggal:    tglOut,
          tipe:       "keluar",
          kategori:   "Pengembalian Deposit",
          nominal:    sisaDeposit,
          keterangan: "Pengembalian deposit " + data.nama + " — Kamar " + data.kamarId,
          ref:        dep.id,
          isLiabilitas: true,
        }]);
      }
    }

    // Tandai sewa dimuka selesai
    setSewaDimukaList(prev => prev.map(sd =>
      sd.penyewaId === data.id ? { ...sd, periodeEnd: tglOut, selesai: true } : sd
    ));

    // Update status kamar → deep-clean
    setKamarList(prev => prev.map(k =>
      k.id === data.kamarId ? { ...k, status: "deep-clean", penghuni: null, partner: [] } : k
    ));

    // Pindah ke riwayat
    setRiwayatList(prev => [...prev, {
      ...data,
      statusRiwayat: "checkout",
      tglCheckout:   tglOut,
      dendaKerusakan: data.dendaKerusakan || 0,
    }]);

    // Hapus dari aktif
    setPenyewaList(prev => prev.filter(p => p.id !== data.id));
    setSelected(null);
    setModal(null);
  };

  return (
    <div className="co-wrap">
      <StyleInjector />

      {/* Cards */}
      <div className="co-cards">
        {[
          { label: "Total Penyewa",   val: penyewaList.length || "—",  color: "#3b82f6", sub: "Kontrak aktif" },
          { label: "Kontrak ≤ 30hr", val: mauHabis  || (penyewaList.length?"0":"—"), color: "#f59e0b", sub: "Perlu tindakan" },
          { label: "Terlambat",      val: terlambat || (penyewaList.length?"0":"—"), color: "#ef4444", sub: "Melewati kontrak" },
          { label: "Perlu Diproses", val: (mauHabis + terlambat) || (penyewaList.length?"0":"—"), color: "#f97316", sub: "Perpanjang / checkout" },
        ].map((c, i) => (
          <div key={i} className="co-card">
            <div className="co-card-bar" style={{ background: c.color }} />
            <div className="co-card-label">{c.label}</div>
            <div className="co-card-val">{c.val}</div>
            <div className="co-card-sub">{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Layout */}
      <div className="co-layout">

        {/* List */}
        <div className="co-widget">
          <div className="co-widget-head">
            <div className="co-widget-title">🔑 Manajemen Kontrak</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, padding: "5px 10px" }}>
                <span style={{ fontSize: 13 }}>🔍</span>
                <input
                  style={{ border: "none", outline: "none", background: "transparent", fontSize: 12, color: "#1f2937", width: 140, fontFamily: "inherit" }}
                  placeholder="Cari penyewa..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="co-tabs">
            {[
              { id: "semua",      label: `Semua (${penyewaList.length})` },
              { id: "mau-habis",  label: `⚠️ Mau Habis (${mauHabis})` },
              { id: "terlambat",  label: `🔴 Terlambat (${terlambat})` },
            ].map(t => (
              <div key={t.id} className={`co-tab ${tab===t.id?"active":""}`} onClick={() => setTab(t.id)}>
                {t.label}
              </div>
            ))}
          </div>

          {/* List */}
          <div className="co-widget-body">
            {penyewaList.length === 0 ? (
              <div className="co-empty">
                <div className="co-empty-icon">🔑</div>
                <div className="co-empty-title">Belum ada data penyewa</div>
                <div className="co-empty-sub">Data akan muncul setelah Check-in di Data Penyewa</div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="co-empty">
                <div className="co-empty-icon">✅</div>
                <div className="co-empty-title">Tidak ada penyewa di kategori ini</div>
                <div className="co-empty-sub">Semua kontrak dalam kondisi aman</div>
              </div>
            ) : (
              filtered.map(p => {
                const sisa = hariSisa(p.kontrakSelesai);
                return (
                  <div key={p.id} className={`co-item ${selected?.id===p.id?"selected":""}`} onClick={() => setSelected(p)}>
                    <div className="co-avatar">{getInisial(p.nama)}</div>
                    <div className="co-item-info">
                      <div className="co-item-name">{p.nama}</div>
                      <div className="co-item-meta">
                        <span>📅 {p.kontrakMulai} → {p.kontrakSelesai}</span>
                        {p.partner?.length > 0 && <span>👥 +{p.partner.length}</span>}
                      </div>
                    </div>
                    <div className="co-item-right">
                      <div className="co-item-kamar">K{padD(p.kamarId)}</div>
                      {sisa !== null && (
                        <div className="co-item-sisa" style={{ color: sisa<0?"#dc2626":sisa<=7?"#dc2626":sisa<=30?"#d97706":"#9ca3af" }}>
                          {sisa<0 ? `+${Math.abs(sisa)}h` : `${sisa}h lagi`}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Panel kanan */}
        {selected ? (
          <ActionPanel
            penyewa={selected}
            kamarList={kamarList}
            onPerpanjang={() => setModal("perpanjang")}
            onCheckout={()  => setModal("checkout")}
            onClose={() => setSelected(null)}
          />
        ) : (
          <div className="co-widget">
            <div className="co-empty" style={{ padding: "60px 20px" }}>
              <div className="co-empty-icon">🔑</div>
              <div className="co-empty-title">Pilih penyewa</div>
              <div className="co-empty-sub">Klik nama untuk proses perpanjang atau check-out</div>
            </div>
          </div>
        )}

      </div>

      {/* Modals */}
      {selected && modal === "perpanjang" && (
        <ModalPerpanjang
          penyewa={selected}
          kamarList={kamarList}
          onClose={() => setModal(null)}
          onSave={handlePerpanjang}
        />
      )}
      {selected && modal === "checkout" && (
        <ModalCheckout
          penyewa={selected}
          kamarList={kamarList}
          onClose={() => setModal(null)}
          onCheckout={handleCheckout}
        />
      )}

    </div>
  );
}
