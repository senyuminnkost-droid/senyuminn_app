import { useState, useEffect } from "react";

// ============================================================
// CSS
// ============================================================
const CSS = `
  .tg-wrap { display: flex; flex-direction: column; gap: 16px; }

  .tg-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
  .tg-card { background: #fff; border-radius: 12px; border: 1px solid #e5e7eb; padding: 14px 16px; position: relative; overflow: hidden; }
  .tg-card-bar { position: absolute; top: 0; left: 0; right: 0; height: 3px; }
  .tg-card-label { font-size: 10px; font-weight: 500; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 4px; margin-top: 8px; }
  .tg-card-val { font-size: 20px; font-weight: 700; color: #111827; font-family: 'JetBrains Mono', monospace; }
  .tg-card-sub { font-size: 11px; color: #6b7280; margin-top: 3px; }

  .tg-layout { display: grid; grid-template-columns: 1fr 360px; gap: 14px; align-items: start; }

  .tg-widget { background: #fff; border-radius: 12px; border: 1px solid #e5e7eb; display: flex; flex-direction: column; overflow: hidden; }
  .tg-widget-head { padding: 13px 16px 10px; border-bottom: 1px solid #f3f4f6; display: flex; align-items: center; justify-content: space-between; }
  .tg-widget-title { font-size: 12px; font-weight: 600; color: #111827; display: flex; align-items: center; gap: 6px; }

  /* ─── TABS ───────────────────────────────── */
  .tg-tabs { display: flex; gap: 2px; padding: 10px 14px 0; border-bottom: 1px solid #f3f4f6; }
  .tg-tab { padding: 7px 14px; font-size: 11px; font-weight: 600; color: #9ca3af; cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.12s; white-space: nowrap; }
  .tg-tab:hover { color: #374151; }
  .tg-tab.active { color: #f97316; border-bottom-color: #f97316; }

  /* ─── FILTER ─────────────────────────────── */
  .tg-filterbar { display: flex; align-items: center; gap: 8px; padding: 10px 14px; border-bottom: 1px solid #f3f4f6; flex-wrap: wrap; }
  .tg-search { display: flex; align-items: center; gap: 7px; background: #f9fafb; border: 1.5px solid #e5e7eb; border-radius: 8px; padding: 6px 11px; flex: 1; max-width: 240px; transition: border-color 0.12s; }
  .tg-search:focus-within { border-color: #f97316; background: #fff; }
  .tg-search-input { border: none; outline: none; background: transparent; font-size: 12px; color: #1f2937; width: 100%; font-family: inherit; }
  .tg-search-input::placeholder { color: #9ca3af; }
  .tg-select { padding: 6px 10px; border-radius: 8px; border: 1.5px solid #e5e7eb; font-size: 12px; color: #374151; background: #fff; outline: none; font-family: inherit; cursor: pointer; }
  .tg-select:focus { border-color: #f97316; }

  /* ─── LIST ───────────────────────────────── */
  .tg-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-bottom: 1px solid #f3f4f6; cursor: pointer; transition: background 0.1s; }
  .tg-item:last-child { border-bottom: none; }
  .tg-item:hover { background: #fafafa; }
  .tg-item.selected { background: #fff7ed; border-left: 3px solid #f97316; }
  .tg-item-icon { width: 36px; height: 36px; border-radius: 9px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 16px; }
  .tg-item-info { flex: 1; min-width: 0; }
  .tg-item-name { font-size: 13px; font-weight: 600; color: #1f2937; }
  .tg-item-meta { font-size: 11px; color: #9ca3af; margin-top: 2px; display: flex; gap: 8px; flex-wrap: wrap; }
  .tg-item-right { text-align: right; flex-shrink: 0; }
  .tg-item-nominal { font-size: 13px; font-weight: 700; color: #111827; font-family: 'JetBrains Mono', monospace; }
  .tg-item-jatuh { font-size: 10px; margin-top: 2px; font-weight: 500; }

  .tg-badge { display: inline-flex; align-items: center; gap: 3px; padding: 2px 8px; border-radius: 20px; font-size: 10px; font-weight: 600; }

  /* ─── DETAIL PANEL ───────────────────────── */
  .tg-detail { padding: 16px; overflow-y: auto; max-height: calc(100vh - 220px); }
  .tg-detail-name { font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 2px; }
  .tg-detail-sub  { font-size: 11px; color: #9ca3af; }

  .tg-section { margin-bottom: 16px; }
  .tg-section-label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: #9ca3af; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
  .tg-section-label::after { content: ''; flex: 1; height: 1px; background: #f3f4f6; }

  .tg-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .tg-info-item { background: #f9fafb; border-radius: 8px; padding: 9px 11px; }
  .tg-info-key { font-size: 10px; color: #9ca3af; font-weight: 500; text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 2px; }
  .tg-info-val { font-size: 12px; font-weight: 600; color: #1f2937; }
  .tg-info-val.orange { color: #ea580c; }
  .tg-info-val.red    { color: #dc2626; }
  .tg-info-val.green  { color: #16a34a; }
  .tg-info-val.mono   { font-family: 'JetBrains Mono', monospace; font-size: 11px; }

  /* Nominal box */
  .tg-nominal-box { background: linear-gradient(135deg, #fff7ed, #fff); border: 1.5px solid #fed7aa; border-radius: 12px; padding: 16px; text-align: center; margin-bottom: 14px; }
  .tg-nominal-label { font-size: 10px; font-weight: 600; color: #9a3412; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
  .tg-nominal-val { font-size: 26px; font-weight: 800; color: #ea580c; font-family: 'JetBrains Mono', monospace; }
  .tg-nominal-sub { font-size: 11px; color: #9a3412; margin-top: 4px; }

  /* ─── MODAL ───────────────────────────────── */
  .tg-overlay-portal { position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; background: rgba(17,24,39,0.65) !important; backdrop-filter: blur(4px) !important; z-index: 9999 !important; display: flex !important; align-items: center !important; justify-content: center !important; padding: 16px !important; box-sizing: border-box !important; animation: tgFade 0.18s ease; }
  @keyframes tgFade { from { opacity: 0; } to { opacity: 1; } }
  .tg-modal { background: #fff; border-radius: 16px; width: 100%; max-width: 480px; max-height: 88vh; overflow-y: auto; box-shadow: 0 24px 64px rgba(0,0,0,0.18); animation: tgSlide 0.2s cubic-bezier(0.4,0,0.2,1); }
  @keyframes tgSlide { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .tg-modal-head { padding: 15px 20px 12px; border-bottom: 1px solid #f3f4f6; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; background: #fff; z-index: 1; }
  .tg-modal-title { font-size: 14px; font-weight: 700; color: #111827; }
  .tg-modal-close { width: 28px; height: 28px; border-radius: 7px; background: #f3f4f6; border: none; cursor: pointer; font-size: 14px; color: #6b7280; display: flex; align-items: center; justify-content: center; }
  .tg-modal-close:hover { background: #fee2e2; color: #dc2626; }
  .tg-modal-body { padding: 16px 20px; }
  .tg-modal-foot { padding: 12px 20px; border-top: 1px solid #f3f4f6; display: flex; gap: 8px; }

  .tg-field { margin-bottom: 12px; }
  .tg-field-label { font-size: 11px; font-weight: 600; color: #374151; margin-bottom: 5px; display: block; }
  .tg-input { width: 100%; padding: 8px 11px; border-radius: 8px; border: 1.5px solid #e5e7eb; font-size: 12px; font-family: inherit; color: #1f2937; outline: none; background: #fff; transition: border-color 0.12s; box-sizing: border-box; }
  .tg-input:focus { border-color: #f97316; }
  .tg-input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

  .tg-summary { background: #f9fafb; border-radius: 10px; padding: 12px 14px; margin-bottom: 12px; }
  .tg-summary-row { display: flex; justify-content: space-between; align-items: center; padding: 5px 0; border-bottom: 1px solid #f3f4f6; font-size: 12px; }
  .tg-summary-row:last-child { border-bottom: none; padding-top: 8px; }
  .tg-summary-key { color: #6b7280; }
  .tg-summary-val { font-weight: 600; color: #111827; }
  .tg-summary-val.orange { color: #ea580c; }
  .tg-summary-val.green  { color: #16a34a; }

  .tg-btn { flex: 1; padding: 9px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; border: none; cursor: pointer; font-family: inherit; transition: all 0.15s; display: flex; align-items: center; justify-content: center; gap: 5px; }
  .tg-btn.primary { background: linear-gradient(135deg, #f97316, #ea580c); color: #fff; box-shadow: 0 3px 10px rgba(249,115,22,0.25); }
  .tg-btn.success { background: linear-gradient(135deg, #16a34a, #15803d); color: #fff; }
  .tg-btn.ghost   { background: #f3f4f6; color: #4b5563; }
  .tg-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .tg-btn:hover:not(:disabled) { filter: brightness(1.04); transform: translateY(-1px); }

  /* Riwayat pembayaran */
  .tg-pay-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 10px; background: #f9fafb; border-radius: 8px; margin-bottom: 6px; }
  .tg-pay-label { font-size: 12px; font-weight: 500; color: #374151; }
  .tg-pay-tgl { font-size: 10px; color: #9ca3af; margin-top: 1px; }
  .tg-pay-nominal { font-size: 12px; font-weight: 700; color: #16a34a; font-family: 'JetBrains Mono', monospace; }

  .tg-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 50px 16px; color: #9ca3af; text-align: center; gap: 8px; }
  .tg-empty-icon { font-size: 36px; opacity: 0.4; }
  .tg-empty-title { font-size: 14px; font-weight: 600; color: #374151; }
  .tg-empty-sub { font-size: 12px; }

  @media (max-width: 1024px) { .tg-layout { grid-template-columns: 1fr; } }
  @media (max-width: 768px)  { .tg-cards { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 480px)  { .tg-cards { grid-template-columns: repeat(2, 1fr); gap: 8px; } .tg-input-row { grid-template-columns: 1fr; } }

  /* ── KALENDER KEUANGAN ── */
  .tg-kal-wrap { display:grid; grid-template-columns:1fr 280px; gap:16px; }
  .tg-kal-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:3px; }
  .tg-kal-head { display:grid; grid-template-columns:repeat(7,1fr); gap:3px; margin-bottom:6px; }
  .tg-kal-hdr  { text-align:center; font-size:10px; font-weight:700; color:#9ca3af; padding:4px 0; }
  .tg-kal-cell { min-height:72px; padding:6px 5px; border-radius:8px; cursor:pointer; background:#fafafa; border:1.5px solid transparent; transition:all .12s; }
  .tg-kal-cell:hover { border-color:#fed7aa; background:#fff7ed; }
  .tg-kal-cell.today { background:#fff7ed; border-color:#fed7aa; }
  .tg-kal-cell.selected { background:#fff7ed; border-color:#f97316 !important; }
  .tg-kal-cell.empty { background:transparent; cursor:default; }
  .tg-kal-num  { width:22px; height:22px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:500; color:#1f2937; margin-bottom:3px; }
  .tg-kal-num.today { background:#f97316; color:#fff; font-weight:700; }
  .tg-kal-dot  { font-size:9px; padding:1px 5px; border-radius:3px; margin-bottom:1px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-weight:600; }
  /* ── TAGIHAN RUTIN ── */
  .tg-rutin-item { display:flex; align-items:center; gap:10px; padding:10px 14px; border-bottom:1px solid #f3f4f6; }
  .tg-rutin-item:last-child { border-bottom:none; }
  .tg-rutin-icon { width:34px; height:34px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:16px; flex-shrink:0; }
  .tg-rutin-info { flex:1; min-width:0; }
  .tg-rutin-name { font-size:13px; font-weight:600; color:#111827; }
  .tg-rutin-sub  { font-size:11px; color:#9ca3af; margin-top:1px; }
  .tg-rutin-right { text-align:right; }
  .tg-rutin-amt  { font-size:13px; font-weight:700; color:#f97316; }
  .tg-rutin-tgl  { font-size:10px; color:#9ca3af; margin-top:1px; }
  .tg-rutin-actions { display:flex; gap:5px; margin-left:6px; }
  .tg-rutin-btn { padding:4px 9px; border-radius:6px; border:1px solid #e5e7eb; background:#fff; font-size:11px; cursor:pointer; font-weight:600; color:#374151; }
  .tg-rutin-btn.bayar { background:linear-gradient(135deg,#f97316,#ea580c); color:#fff; border-color:transparent; }
  .tg-rutin-btn.lunas { background:#f0fdf4; color:#16a34a; border-color:#86efac; }
  /* ── FORM RUTIN ── */
  .tg-rutin-form { background:#f9fafb; border:1px solid #e5e7eb; border-radius:10px; padding:14px 16px; margin:8px 0; }
  /* ── ANGGAR ── */
  .tg-angg-item { display:flex; align-items:center; gap:10px; padding:10px 14px; border-bottom:1px solid #f3f4f6; }
  .tg-angg-badge { padding:3px 8px; border-radius:20px; font-size:10px; font-weight:700; }
`;

function StyleInjector() {
  useEffect(() => {
    const id = "senyuminn-tagihan-css";
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
const padD   = (n) => String(n).padStart(2, "0");
const fmtRp  = (n) => n != null ? "Rp " + Number(n).toLocaleString("id-ID") : "—";
const todayStr = (() => { const d = new Date(); return `${d.getFullYear()}-${padD(d.getMonth()+1)}-${padD(d.getDate())}`; })();
const thisMonth = todayStr.slice(0, 7);

const hariSisa = (tgl) => tgl ? Math.ceil((new Date(tgl) - new Date()) / 86400000) : null;

const getInisial = (nama) => {
  if (!nama) return "?";
  const p = nama.trim().split(" ");
  return p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : nama.slice(0,2).toUpperCase();
};

const STATUS_CONFIG = {
  lunas:    { label: "Lunas",        color: "#16a34a", bg: "#dcfce7", icon: "✅" },
  belum:    { label: "Belum Bayar",  color: "#f97316", bg: "#ffedd5", icon: "🕐" },
  terlambat:{ label: "Terlambat",    color: "#dc2626", bg: "#fee2e2", icon: "⚠️" },
  denda:    { label: "Ada Denda",    color: "#7c3aed", bg: "#ede9fe", icon: "💸" },
};

// Generate tagihan otomatis dari penyewa aktif
const generateTagihan = (penyewaList, kamarList, existingTagihan) => {
  const result = [...existingTagihan];
  penyewaList.forEach(p => {
    const kamar = kamarList.find(k => k.id === p.kamarId);
    if (!kamar) return;
    // Cek apakah tagihan bulan ini sudah ada
    const sudahAda = existingTagihan.some(
      t => t.penyewaId === p.id && t.periode === thisMonth
    );
    if (!sudahAda) {
      // Hitung jatuh tempo: tanggal {BATAS_TAGIHAN} bulan ini
      const jatuhTempo = `${thisMonth}-25`;
      const sisaHari   = hariSisa(jatuhTempo);
      result.push({
        id:        `TG-${p.id}-${thisMonth}`,
        penyewaId: p.id,
        nama:      p.nama,
        kamarId:   p.kamarId,
        kamarTipe: kamar.tipe,
        nominal:   kamar.harga,
        periode:   thisMonth,
        jatuhTempo,
        status:    sisaHari !== null && sisaHari < 0 ? "terlambat" : "belum",
        dendaHari: sisaHari !== null && sisaHari < 0 ? Math.abs(sisaHari) : 0,
        riwayatBayar: [],
      });
    }
  });
  return result;
};

// ============================================================
// MODAL KONFIRMASI BAYAR
// ============================================================
function ModalBayar({ tagihan, onClose, onKonfirmasi }) {
  const denda50k = DENDA_PER_HARI; // Rp 50.000/hari — dari Pengaturan nanti
  const totalDenda = tagihan.dendaHari * denda50k;
  const totalBayar = tagihan.nominal + totalDenda;

  const [form, setForm] = useState({
    tglBayar:  todayStr,
    metode:    "transfer",
    noRekening:"",
    catatan:   "",
    bayarDenda: totalDenda > 0,
  });
  const set = (k,v) => setForm(prev => ({ ...prev, [k]: v }));
  const [done, setDone] = useState(false);

  const handleSave = () => {
    onKonfirmasi({
      ...tagihan,
      status: "lunas",
      tglBayar: form.tglBayar,
      metode: form.metode,
      riwayatBayar: [
        ...(tagihan.riwayatBayar || []),
        {
          tgl: form.tglBayar,
          nominal: form.bayarDenda ? totalBayar : tagihan.nominal,
          metode: form.metode,
          catatan: form.catatan,
        }
      ]
    });
    setDone(true);
  };

  const content = done ? (
    <div className="tg-modal-body">
      <div style={{ textAlign: "center", padding: "24px 0 16px" }}>
        <div style={{ fontSize: 52, marginBottom: 10 }}>✅</div>
        <div style={{ fontSize: 17, fontWeight: 700, color: "#111827", marginBottom: 6 }}>Pembayaran Dikonfirmasi!</div>
        <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 20 }}>
          Tagihan <b>{tagihan.nama}</b> bulan <b>{tagihan.periode}</b><br />
          sudah lunas. Terima kasih!
        </div>
        <button className="tg-btn ghost" style={{ maxWidth: 120, margin: "0 auto" }} onClick={onClose}>Tutup</button>
      </div>
    </div>
  ) : (
    <>
      <div className="tg-modal-body">
        {/* Info tagihan */}
        <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 10, padding: "12px 14px", marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{tagihan.nama} — Kamar {tagihan.kamarId}</div>
          <div style={{ fontSize: 11, color: "#9a3412", marginTop: 2 }}>Periode: {tagihan.periode} · Jatuh tempo: {tagihan.jatuhTempo}</div>
        </div>

        {/* Ringkasan */}
        <div className="tg-summary">
          <div className="tg-summary-row">
            <span className="tg-summary-key">Sewa bulan ini</span>
            <span className="tg-summary-val">{fmtRp(tagihan.nominal)}</span>
          </div>
          {tagihan.dendaHari > 0 && (
            <div className="tg-summary-row">
              <span className="tg-summary-key">Denda keterlambatan ({tagihan.dendaHari} hari × Rp 50.000)</span>
              <span className="tg-summary-val" style={{ color: "#dc2626" }}>{fmtRp(totalDenda)}</span>
            </div>
          )}
          <div className="tg-summary-row" style={{ fontWeight: 700 }}>
            <span style={{ fontWeight: 700, color: "#111827", fontSize: 12 }}>Total Bayar</span>
            <span className="tg-summary-val orange" style={{ fontSize: 14 }}>
              {fmtRp(form.bayarDenda ? totalBayar : tagihan.nominal)}
            </span>
          </div>
        </div>

        {tagihan.dendaHari > 0 && (
          <div className="tg-field" style={{ marginBottom: 14 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, cursor: "pointer" }}>
              <input type="checkbox" checked={form.bayarDenda} onChange={e => set("bayarDenda", e.target.checked)} />
              <span style={{ fontWeight: 600, color: "#374151" }}>Tagih denda keterlambatan</span>
            </label>
          </div>
        )}

        <div className="tg-input-row">
          <div className="tg-field">
            <label className="tg-field-label">Tanggal Bayar</label>
            <input type="date" className="tg-input" value={form.tglBayar} onChange={e => set("tglBayar", e.target.value)} />
          </div>
          <div className="tg-field">
            <label className="tg-field-label">Metode</label>
            <select className="tg-input" value={form.metode} onChange={e => set("metode", e.target.value)}>
              <option value="transfer">Transfer Bank</option>
              <option value="tunai">Tunai</option>
              <option value="qris">QRIS</option>
            </select>
          </div>
        </div>

        <div className="tg-field">
          <label className="tg-field-label">Catatan (opsional)</label>
          <input className="tg-input" placeholder="No. bukti transfer, catatan lain..." value={form.catatan} onChange={e => set("catatan", e.target.value)} />
        </div>

        <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 8, padding: "8px 12px", fontSize: 11, color: "#15803d" }}>
          ℹ️ Setelah dikonfirmasi, data otomatis masuk ke Kas & Jurnal
        </div>
      </div>
      <div className="tg-modal-foot">
        <button className="tg-btn success" onClick={handleSave}>✅ Konfirmasi Lunas</button>
        <button className="tg-btn ghost"   onClick={onClose}>Batal</button>
      </div>
    </>
  );

  return (
    <div className="tg-overlay-portal" onClick={onClose}>
      <div className="tg-modal" onClick={e => e.stopPropagation()}>
        <div className="tg-modal-head">
          <div className="tg-modal-title">💳 Konfirmasi Pembayaran</div>
          <button className="tg-modal-close" onClick={onClose}>✕</button>
        </div>
        {content}
      </div>
    </div>
  );
}

// ============================================================
// DETAIL PANEL
// ============================================================
function DetailPanel({ tagihan, onBayar, onClose }) {
  const st = STATUS_CONFIG[tagihan.status] || STATUS_CONFIG.belum;
  const denda50k = DENDA_PER_HARI;
  const totalDenda = (tagihan.dendaHari || 0) * denda50k;
  const totalBayar = tagihan.nominal + totalDenda;

  return (
    <div className="tg-widget">
      <div className="tg-widget-head">
        <div className="tg-widget-title">💳 Detail Tagihan</div>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 16 }}>✕</button>
      </div>
      <div className="tg-detail">

        {/* Nominal */}
        <div className="tg-nominal-box">
          <div className="tg-nominal-label">Total Tagihan</div>
          <div className="tg-nominal-val">{fmtRp(totalBayar)}</div>
          <div className="tg-nominal-sub">
            {tagihan.periode} · Jatuh tempo {tagihan.jatuhTempo}
          </div>
          <div style={{ marginTop: 8 }}>
            <span className="tg-badge" style={{ color: st.color, background: st.bg, fontSize: 11 }}>
              {st.icon} {st.label}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="tg-section">
          <div className="tg-section-label">Informasi</div>
          <div className="tg-info-grid">
            <div className="tg-info-item">
              <div className="tg-info-key">Penyewa</div>
              <div className="tg-info-val">{tagihan.nama}</div>
            </div>
            <div className="tg-info-item">
              <div className="tg-info-key">Kamar</div>
              <div className="tg-info-val orange">K{padD(tagihan.kamarId)} — {tagihan.kamarTipe}</div>
            </div>
            <div className="tg-info-item">
              <div className="tg-info-key">Sewa</div>
              <div className="tg-info-val mono">{fmtRp(tagihan.nominal)}</div>
            </div>
            <div className="tg-info-item">
              <div className="tg-info-key">Denda</div>
              <div className={`tg-info-val ${totalDenda>0?"red":"green"}`}>
                {totalDenda > 0 ? `${fmtRp(totalDenda)} (${tagihan.dendaHari}hr)` : "Tidak ada"}
              </div>
            </div>
          </div>
        </div>

        {/* Riwayat Bayar */}
        {tagihan.riwayatBayar?.length > 0 && (
          <div className="tg-section">
            <div className="tg-section-label">Riwayat Pembayaran</div>
            {tagihan.riwayatBayar.map((r, i) => (
              <div key={i} className="tg-pay-item">
                <div>
                  <div className="tg-pay-label">{r.metode === "transfer" ? "Transfer Bank" : r.metode === "qris" ? "QRIS" : "Tunai"}</div>
                  <div className="tg-pay-tgl">{r.tgl} {r.catatan && `· ${r.catatan}`}</div>
                </div>
                <div className="tg-pay-nominal">{fmtRp(r.nominal)}</div>
              </div>
            ))}
          </div>
        )}

        {/* Aksi */}
        {tagihan.status !== "lunas" && (
          <button className="tg-btn success" style={{ width: "100%" }} onClick={onBayar}>
            ✅ Konfirmasi Pembayaran
          </button>
        )}

        {tagihan.status === "lunas" && (
          <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 10, padding: "12px 14px", textAlign: "center" }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>✅</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#15803d" }}>Sudah Lunas</div>
            <div style={{ fontSize: 11, color: "#16a34a", marginTop: 2 }}>Dibayar: {tagihan.tglBayar} via {tagihan.metode}</div>
          </div>
        )}

      </div>
    </div>
  );
}

// ============================================================
// MAIN
// ============================================================
// ============================================================
// MODAL BAYAR TAGIHAN RUTIN (Listrik, Internet, dll)
// ============================================================
function ModalBayarRutin({ item, sakuConfig=[], rekeningList=[], onClose, onSave }) {
  const [form, setForm] = useState({
    tglBayar:    todayStr,
    nominalAsli: item.nominalEstimasi || "",
    metode:      "transfer",
    sakuSumber:  "",
    rekening:    rekeningList[0]?.id || "",
    noRef:       "",
    catatan:     "",
  });
  const set = (k,v) => setForm(p=>({...p,[k]:v}));
  const valid = form.nominalAsli && Number(form.nominalAsli)>0 && form.sakuSumber;

  return (
    <div className="tg-overlay-portal" onClick={onClose}>
      <div className="tg-modal" onClick={e=>e.stopPropagation()} style={{maxWidth:460}}>
        <div className="tg-modal-head">
          <div className="tg-modal-title">✅ Bayar — {item.nama}</div>
          <button className="tg-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="tg-modal-body">

          {/* Info tagihan */}
          <div style={{background:"#fff7ed",border:"1px solid #fed7aa",borderRadius:10,padding:"12px 14px",marginBottom:14}}>
            <div style={{fontSize:13,fontWeight:700,color:"#111827"}}>{item.icon} {item.nama}</div>
            <div style={{fontSize:11,color:"#9a3412",marginTop:2}}>
              Kategori: {item.kategori} · Tanggal {item.tglBayar} setiap bulan
            </div>
            {item.nominalEstimasi && (
              <div style={{fontSize:12,fontWeight:600,color:"#f97316",marginTop:4}}>
                Estimasi: {fmtRp(item.nominalEstimasi)}
              </div>
            )}
          </div>

          {/* Nominal asli */}
          <div className="tg-field">
            <label className="tg-field-label">💰 Nominal Aktual (Rp) <span style={{color:"#dc2626"}}>*</span></label>
            <input type="number" className="tg-input" placeholder="Masukkan nominal tagihan sebenarnya"
              value={form.nominalAsli} onChange={e=>set("nominalAsli",e.target.value)} />
          </div>

          <div className="tg-input-row">
            <div className="tg-field">
              <label className="tg-field-label">Tanggal Bayar</label>
              <input type="date" className="tg-input" value={form.tglBayar} onChange={e=>set("tglBayar",e.target.value)} />
            </div>
            <div className="tg-field">
              <label className="tg-field-label">Metode</label>
              <select className="tg-input" value={form.metode} onChange={e=>set("metode",e.target.value)}>
                <option value="transfer">Transfer Bank</option>
                <option value="tunai">Tunai</option>
                <option value="autodebit">Auto Debit</option>
                <option value="qris">QRIS</option>
              </select>
            </div>
          </div>

          {/* Sumber Saku — wajib */}
          <div className="tg-field">
            <label className="tg-field-label">⚪ Sumber Saku <span style={{color:"#dc2626"}}>*</span></label>
            <select className="tg-input" value={form.sakuSumber} onChange={e=>set("sakuSumber",e.target.value)}>
              <option value="">Pilih sumber saku...</option>
              {sakuConfig.map(s=>(
                <option key={s.kode} value={s.kode}>{s.kode} — {s.nama}</option>
              ))}
              {sakuConfig.length===0 && <option value="umum">Kas Umum</option>}
            </select>
          </div>

          {rekeningList.length>0 && (
            <div className="tg-field">
              <label className="tg-field-label">Rekening</label>
              <select className="tg-input" value={form.rekening} onChange={e=>set("rekening",e.target.value)}>
                {rekeningList.map(r=><option key={r.id} value={r.id}>{r.bank} — {r.nama}</option>)}
              </select>
            </div>
          )}

          <div className="tg-input-row">
            <div className="tg-field">
              <label className="tg-field-label">No. Referensi / Bukti</label>
              <input className="tg-input" placeholder="No. token, struk, dll" value={form.noRef} onChange={e=>set("noRef",e.target.value)} />
            </div>
          </div>

          <div className="tg-field">
            <label className="tg-field-label">Catatan (opsional)</label>
            <input className="tg-input" placeholder="Keterangan tambahan..." value={form.catatan} onChange={e=>set("catatan",e.target.value)} />
          </div>

          <div style={{background:"#f0fdf4",border:"1px solid #86efac",borderRadius:8,padding:"8px 12px",fontSize:11,color:"#15803d"}}>
            ℹ️ Setelah dikonfirmasi akan otomatis masuk ke Kas & Jurnal sebagai pengeluaran
          </div>
        </div>
        <div className="tg-modal-foot">
          <button className="tg-btn success" disabled={!valid} onClick={()=>{
            onSave({ ...form, nominal: Number(form.nominalAsli) });
            onClose();
          }}>✅ Konfirmasi Pembayaran</button>
          <button className="tg-btn ghost" onClick={onClose}>Batal</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MODAL FORM TAGIHAN RUTIN (Tambah/Edit)
// ============================================================
const ICON_OPTIONS = ["💡","📱","💧","🌐","🔥","🏢","📦","🔧","🚗","📋","💰","🎯"];
const KAT_RUTIN   = ["Listrik","Air","Internet","Telepon","Sewa/Kontrak","Asuransi","Gaji","Vendor","Maintenance","Lain-lain"];

function ModalFormRutin({ item, onClose, onSave }) {
  const [form, setForm] = useState({
    nama:             item?.nama             || "",
    kategori:         item?.kategori         || "Listrik",
    icon:             item?.icon             || "💡",
    tglBayar:         item?.tglBayar         || 1,
    nominalEstimasi:  item?.nominalEstimasi  || "",
    sakuDefault:      item?.sakuDefault      || "",
    catatan:          item?.catatan          || "",
  });
  const set = (k,v) => setForm(p=>({...p,[k]:v}));
  const valid = form.nama && form.tglBayar;

  return (
    <div className="tg-overlay-portal" onClick={onClose}>
      <div className="tg-modal" onClick={e=>e.stopPropagation()} style={{maxWidth:440}}>
        <div className="tg-modal-head">
          <div className="tg-modal-title">{item ? "✏️ Edit" : "➕ Tambah"} Tagihan Rutin</div>
          <button className="tg-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="tg-modal-body">
          {/* Icon picker */}
          <div className="tg-field">
            <label className="tg-field-label">Icon</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
              {ICON_OPTIONS.map(ic=>(
                <button key={ic} onClick={()=>set("icon",ic)}
                  style={{width:36,height:36,borderRadius:8,border:`2px solid ${form.icon===ic?"#f97316":"#e5e7eb"}`,background:form.icon===ic?"#fff7ed":"#fff",fontSize:18,cursor:"pointer"}}>
                  {ic}
                </button>
              ))}
            </div>
          </div>

          <div className="tg-input-row">
            <div className="tg-field">
              <label className="tg-field-label">Nama Tagihan *</label>
              <input className="tg-input" placeholder="Listrik PLN, Internet..." value={form.nama} onChange={e=>set("nama",e.target.value)} />
            </div>
            <div className="tg-field">
              <label className="tg-field-label">Kategori</label>
              <select className="tg-input" value={form.kategori} onChange={e=>set("kategori",e.target.value)}>
                {KAT_RUTIN.map(k=><option key={k} value={k}>{k}</option>)}
              </select>
            </div>
          </div>

          <div className="tg-input-row">
            <div className="tg-field">
              <label className="tg-field-label">Tanggal Bayar (tgl berapa)</label>
              <select className="tg-input" value={form.tglBayar} onChange={e=>set("tglBayar",Number(e.target.value))}>
                {Array.from({length:28},(_,i)=>i+1).map(d=>(
                  <option key={d} value={d}>Tanggal {d}</option>
                ))}
              </select>
            </div>
            <div className="tg-field">
              <label className="tg-field-label">Nominal Estimasi (Rp)</label>
              <input type="number" className="tg-input" placeholder="Estimasi bulanan" value={form.nominalEstimasi} onChange={e=>set("nominalEstimasi",e.target.value)} />
            </div>
          </div>

          <div className="tg-field">
            <label className="tg-field-label">Catatan</label>
            <input className="tg-input" placeholder="Keterangan..." value={form.catatan} onChange={e=>set("catatan",e.target.value)} />
          </div>
        </div>
        <div className="tg-modal-foot">
          <button className="tg-btn success" disabled={!valid} onClick={()=>{
            onSave({ ...form, id: item?.id || Date.now(), nominalEstimasi: Number(form.nominalEstimasi)||0 });
            onClose();
          }}>✅ Simpan</button>
          <button className="tg-btn ghost" onClick={onClose}>Batal</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// TAB KALENDER KEUANGAN
// ============================================================
function TabKalenderKeuangan({ tagihanRutinList, setTagihanRutinList, tagihanList, penyewaList, kamarList, kasJurnal, setKasJurnal, sakuConfig, pengaturanConfig, anggaranList }) {
  const rekeningList = pengaturanConfig?.rekeningList || [];
  const [bulan, setBulan] = useState({ year: new Date().getFullYear(), month: new Date().getMonth() });
  const [selectedDate, setSelectedDate] = useState(null);
  const [showFormRutin, setShowFormRutin] = useState(false);
  const [editItem, setEditItem]   = useState(null);
  const [bayarItem, setBayarItem] = useState(null);

  const BULAN_LABEL = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
  const HARI_LABEL  = ["MIN","SEN","SEL","RAB","KAM","JUM","SAB"];
  const thisYM = `${bulan.year}-${String(bulan.month+1).padStart(2,"0")}`;

  const daysInMonth = new Date(bulan.year, bulan.month+1, 0).getDate();
  const firstDay    = new Date(bulan.year, bulan.month, 1).getDay();
  const todayKey    = todayStr;

  const fmtDateKey = (d) => `${bulan.year}-${String(bulan.month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;

  // Kumpulkan semua events per tanggal
  const eventsByDate = {};
  const addEvent = (dateKey, ev) => {
    if (!eventsByDate[dateKey]) eventsByDate[dateKey] = [];
    eventsByDate[dateKey].push(ev);
  };

  // 1. Tagihan rutin - tampil di tgl bayar setiap bulan
  tagihanRutinList.forEach(item => {
    const dateKey = fmtDateKey(item.tglBayar);
    const bayarLog = (item.riwayatBayar || []).find(r => r.bulan===thisYM);
    addEvent(dateKey, {
      type: bayarLog ? "rutin-lunas" : "rutin",
      label: `${item.icon} ${item.nama}`,
      color: bayarLog ? "#16a34a" : "#f97316",
      bg:    bayarLog ? "#dcfce7"  : "#fff7ed",
      item,
      bayarLog,
    });
  });

  // 2. Tagihan sewa kamar - jatuh tempo
  const sewaTagihan = generateTagihan(penyewaList, kamarList, tagihanList)
    .filter(t => t.periode === thisYM);
  sewaTagihan.forEach(t => {
    if (!t.jatuhTempo) return;
    const dateKey = t.jatuhTempo;
    addEvent(dateKey, {
      type:  t.status==="lunas" ? "sewa-lunas" : "sewa",
      label: `🏠 Sewa Kamar ${t.kamarId}`,
      color: t.status==="lunas" ? "#16a34a" : "#ef4444",
      bg:    t.status==="lunas" ? "#dcfce7"  : "#fee2e2",
      item: t,
    });
  });

  // 3. Pengajuan anggaran staff
  (anggaranList || []).filter(a => a.tanggal?.startsWith(thisYM)).forEach(a => {
    addEvent(a.tanggal, {
      type:  "anggaran",
      label: `📋 ${a.judul}`,
      color: a.status==="approved" ? "#3b82f6" : "#9ca3af",
      bg:    a.status==="approved" ? "#dbeafe"  : "#f3f4f6",
      item: a,
    });
  });

  // Selected date events
  const selectedEvents = selectedDate ? (eventsByDate[selectedDate] || []) : [];

  const handleBayarRutin = (payForm, item) => {
    const bulanKey = thisYM;
    // Update riwayat bayar di item
    const updatedItem = {
      ...item,
      riwayatBayar: [
        ...(item.riwayatBayar || []).filter(r=>r.bulan!==bulanKey),
        { bulan: bulanKey, ...payForm },
      ],
    };
    setTagihanRutinList(p => p.map(i => i.id===item.id ? updatedItem : i));
    // Masuk ke Kas & Jurnal
    setKasJurnal(p => [{
      id:         Date.now(),
      tipe:       "pengeluaran",
      tanggal:    payForm.tglBayar,
      keterangan: `${item.nama} — ${bulanKey}`,
      kategori:   item.kategori,
      nominal:    payForm.nominal,
      sakuSumber: payForm.sakuSumber,
      metode:     payForm.metode,
      noRef:      payForm.noRef,
      catatan:    payForm.catatan || "",
      sumber:     "tagihan-rutin",
      rutinId:    item.id,
    }, ...p]);
    setBayarItem(null);
  };

  const handleDeleteRutin = (id) => {
    if (window.confirm("Hapus jadwal tagihan rutin ini?")) {
      setTagihanRutinList(p => p.filter(i => i.id!==id));
    }
  };

  const cells = [];
  for (let i=0; i<firstDay; i++) cells.push(null);
  for (let d=1; d<=daysInMonth; d++) cells.push(d);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>

      {/* Header controls */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button style={{background:"#f3f4f6",border:"none",borderRadius:6,padding:"6px 10px",cursor:"pointer",fontSize:14}} onClick={()=>setBulan(p=>p.month===0?{year:p.year-1,month:11}:{...p,month:p.month-1})}>‹</button>
          <span style={{fontSize:15,fontWeight:700,color:"#111827",minWidth:160,textAlign:"center"}}>
            {BULAN_LABEL[bulan.month]} {bulan.year}
          </span>
          <button style={{background:"#f3f4f6",border:"none",borderRadius:6,padding:"6px 10px",cursor:"pointer",fontSize:14}} onClick={()=>setBulan(p=>p.month===11?{year:p.year+1,month:0}:{...p,month:p.month+1})}>›</button>
        </div>
        <button className="tg-btn success" style={{fontSize:12}} onClick={()=>{setEditItem(null);setShowFormRutin(true);}}>
          + Jadwal Tagihan Rutin
        </button>
      </div>

      <div className="tg-kal-wrap">
        {/* Kalender */}
        <div style={{background:"#fff",borderRadius:12,border:"1px solid #e5e7eb",padding:16}}>
          {/* Legend */}
          <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:10}}>
            {[
              {color:"#f97316",bg:"#fff7ed",label:"Tagihan Rutin"},
              {color:"#16a34a",bg:"#dcfce7",label:"Sudah Lunas"},
              {color:"#ef4444",bg:"#fee2e2",label:"Sewa Kamar"},
              {color:"#3b82f6",bg:"#dbeafe",label:"Anggaran"},
            ].map(l=>(
              <div key={l.label} style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:"#6b7280"}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:l.color}} />
                {l.label}
              </div>
            ))}
          </div>

          {/* Day headers */}
          <div className="tg-kal-head">
            {HARI_LABEL.map(h=><div key={h} className="tg-kal-hdr">{h}</div>)}
          </div>

          {/* Cells */}
          <div className="tg-kal-grid">
            {cells.map((day,i) => {
              if (!day) return <div key={`e${i}`} className="tg-kal-cell empty" />;
              const dk = fmtDateKey(day);
              const evs = eventsByDate[dk] || [];
              const isTdy = dk===todayKey;
              const isSel = dk===selectedDate;
              return (
                <div key={day} className={`tg-kal-cell ${isTdy?"today":""} ${isSel?"selected":""}`} onClick={()=>setSelectedDate(dk)}>
                  <div className={`tg-kal-num ${isTdy?"today":""}`}>{day}</div>
                  {evs.slice(0,2).map((ev,ei)=>(
                    <div key={ei} className="tg-kal-dot" style={{background:ev.bg,color:ev.color}}>
                      {ev.label.split(" ").slice(0,3).join(" ")}
                    </div>
                  ))}
                  {evs.length>2 && <div style={{fontSize:9,color:"#9ca3af",paddingLeft:3}}>+{evs.length-2}</div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right panel: selected date + list rutin */}
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {/* Selected date detail */}
          <div style={{background:"#fff",borderRadius:12,border:"1px solid #e5e7eb",overflow:"hidden"}}>
            <div style={{padding:"12px 14px 10px",borderBottom:"1px solid #f3f4f6",fontSize:13,fontWeight:700,color:"#111827"}}>
              {selectedDate ? `📋 ${selectedDate}` : "📋 Pilih tanggal"}
            </div>
            <div style={{padding:"10px 14px"}}>
              {!selectedDate && <div style={{fontSize:12,color:"#9ca3af",padding:"12px 0",textAlign:"center"}}>Klik tanggal untuk detail</div>}
              {selectedDate && selectedEvents.length===0 && <div style={{fontSize:12,color:"#9ca3af",padding:"12px 0",textAlign:"center"}}>Tidak ada jadwal</div>}
              {selectedEvents.map((ev,i)=>(
                <div key={i} style={{padding:"8px 10px",borderRadius:8,marginBottom:6,background:ev.bg,border:`1px solid ${ev.color}33`}}>
                  <div style={{fontSize:12,fontWeight:600,color:ev.color}}>{ev.label}</div>
                  {ev.type==="rutin" && (
                    <div style={{display:"flex",gap:6,marginTop:4}}>
                      <button className="tg-rutin-btn bayar" onClick={()=>setBayarItem(ev.item)}>✅ Bayar</button>
                      <button className="tg-rutin-btn" style={{fontSize:10}} onClick={()=>{setEditItem(ev.item);setShowFormRutin(true);}}>✏️</button>
                    </div>
                  )}
                  {ev.type==="rutin-lunas" && (
                    <div style={{fontSize:10,color:"#16a34a",marginTop:2}}>
                      ✅ Dibayar {ev.bayarLog?.tglBayar} · {fmtRp(ev.bayarLog?.nominal)}
                    </div>
                  )}
                  {(ev.type==="sewa"||ev.type==="sewa-lunas") && (
                    <div style={{fontSize:10,color:ev.color,marginTop:2}}>
                      {ev.item?.nama} · {fmtRp(ev.item?.nominal)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Daftar Tagihan Rutin */}
          <div style={{background:"#fff",borderRadius:12,border:"1px solid #e5e7eb",overflow:"hidden"}}>
            <div style={{padding:"12px 14px 10px",borderBottom:"1px solid #f3f4f6",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{fontSize:13,fontWeight:700,color:"#111827"}}>📋 Tagihan Rutin</div>
              <span style={{fontSize:11,color:"#9ca3af"}}>{tagihanRutinList.length} jadwal</span>
            </div>
            {tagihanRutinList.length===0 && (
              <div style={{padding:"16px",textAlign:"center",fontSize:12,color:"#9ca3af"}}>
                Belum ada tagihan rutin
              </div>
            )}
            {tagihanRutinList.map(item=>{
              const bayarLog = (item.riwayatBayar||[]).find(r=>r.bulan===thisYM);
              return (
                <div key={item.id} className="tg-rutin-item">
                  <div className="tg-rutin-icon" style={{background:bayarLog?"#dcfce7":"#fff7ed"}}>{item.icon}</div>
                  <div className="tg-rutin-info">
                    <div className="tg-rutin-name">{item.nama}</div>
                    <div className="tg-rutin-sub">Tgl {item.tglBayar} · {item.kategori}</div>
                  </div>
                  <div className="tg-rutin-right">
                    <div className="tg-rutin-amt">{item.nominalEstimasi ? fmtRp(item.nominalEstimasi) : "—"}</div>
                    <div className="tg-rutin-tgl">{bayarLog ? `✅ Lunas ${thisYM}` : `Belum bayar`}</div>
                  </div>
                  <div className="tg-rutin-actions">
                    {!bayarLog
                      ? <button className="tg-rutin-btn bayar" onClick={()=>setBayarItem(item)}>Bayar</button>
                      : <button className="tg-rutin-btn lunas" disabled>Lunas</button>
                    }
                    <button className="tg-rutin-btn" onClick={()=>{setEditItem(item);setShowFormRutin(true);}}>✏️</button>
                    <button className="tg-rutin-btn" style={{color:"#dc2626"}} onClick={()=>handleDeleteRutin(item.id)}>🗑️</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showFormRutin && (
        <ModalFormRutin
          item={editItem}
          onClose={()=>{setShowFormRutin(false);setEditItem(null);}}
          onSave={item=>{
            if (editItem) setTagihanRutinList(p=>p.map(i=>i.id===item.id?item:i));
            else setTagihanRutinList(p=>[...p,item]);
          }}
        />
      )}
      {bayarItem && (
        <ModalBayarRutin
          item={bayarItem}
          sakuConfig={sakuConfig}
          rekeningList={rekeningList}
          onClose={()=>setBayarItem(null)}
          onSave={(form)=>handleBayarRutin(form, bayarItem)}
        />
      )}
    </div>
  </div>
    </div>
  );
}

// ============================================================
// TAB PENGAJUAN ANGGARAN (dari Staff)
// ============================================================
function TabAnggaran({ anggaranList, setAnggaranList, kasJurnal, setKasJurnal, sakuConfig, user }) {
  const isAdmin = user?.role==="admin";
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ judul:"", tanggal:todayStr, nominal:"", kategori:"Peralatan", keterangan:"", prioritas:"normal" });
  const setF = (k,v) => setForm(p=>({...p,[k]:v}));

  const handleSubmit = () => {
    if (!form.judul || !form.nominal) return;
    setAnggaranList(p=>[...p, {
      id: Date.now(),
      ...form,
      nominal: Number(form.nominal),
      status: "pending",
      pengaju: user?.name || "Staff",
      createdAt: todayStr,
    }]);
    setForm({ judul:"", tanggal:todayStr, nominal:"", kategori:"Peralatan", keterangan:"", prioritas:"normal" });
    setShowForm(false);
  };

  const handleApprove = (id) => {
    setAnggaranList(p=>p.map(a=>a.id===id?{...a,status:"approved",approvedAt:todayStr}:a));
  };

  const handleReject = (id) => {
    setAnggaranList(p=>p.map(a=>a.id===id?{...a,status:"rejected"}:a));
  };

  const statusCfg = {
    pending:  {label:"Menunggu",  color:"#f97316",bg:"#fff7ed"},
    approved: {label:"Disetujui", color:"#16a34a",bg:"#dcfce7"},
    rejected: {label:"Ditolak",   color:"#dc2626",bg:"#fee2e2"},
  };

  const sortedList = [...anggaranList].sort((a,b)=>b.id-a.id);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",justifyContent:"flex-end"}}>
        <button className="tg-btn success" style={{fontSize:12}} onClick={()=>setShowForm(s=>!s)}>
          + Ajukan Anggaran
        </button>
      </div>

      {showForm && (
        <div className="tg-rutin-form">
          <div style={{fontSize:13,fontWeight:700,color:"#111827",marginBottom:10}}>📋 Form Pengajuan Anggaran</div>
          <div className="tg-input-row">
            <div className="tg-field">
              <label className="tg-field-label">Judul Kebutuhan *</label>
              <input className="tg-input" placeholder="Beli sapu, cat tembok..." value={form.judul} onChange={e=>setF("judul",e.target.value)} />
            </div>
            <div className="tg-field">
              <label className="tg-field-label">Kategori</label>
              <select className="tg-input" value={form.kategori} onChange={e=>setF("kategori",e.target.value)}>
                {["Peralatan","Perlengkapan","Maintenance","Akomodasi/Op","Lain-lain"].map(k=><option key={k}>{k}</option>)}
              </select>
            </div>
          </div>
          <div className="tg-input-row">
            <div className="tg-field">
              <label className="tg-field-label">Tanggal Butuh</label>
              <input type="date" className="tg-input" value={form.tanggal} onChange={e=>setF("tanggal",e.target.value)} />
            </div>
            <div className="tg-field">
              <label className="tg-field-label">Nominal Estimasi (Rp) *</label>
              <input type="number" className="tg-input" placeholder="0" value={form.nominal} onChange={e=>setF("nominal",e.target.value)} />
            </div>
          </div>
          <div className="tg-field">
            <label className="tg-field-label">Keterangan</label>
            <input className="tg-input" placeholder="Kenapa dibutuhkan..." value={form.keterangan} onChange={e=>setF("keterangan",e.target.value)} />
          </div>
          <div style={{display:"flex",gap:8,marginTop:4}}>
            <button className="tg-btn success" onClick={handleSubmit} style={{fontSize:12}}>✅ Ajukan</button>
            <button className="tg-btn ghost" onClick={()=>setShowForm(false)} style={{fontSize:12}}>Batal</button>
          </div>
        </div>
      )}

      {/* List pengajuan */}
      <div style={{background:"#fff",borderRadius:12,border:"1px solid #e5e7eb",overflow:"hidden"}}>
        <div style={{padding:"12px 16px 10px",borderBottom:"1px solid #f3f4f6",fontSize:13,fontWeight:700,color:"#111827"}}>
          📋 Daftar Pengajuan ({anggaranList.length})
        </div>
        {sortedList.length===0 && (
          <div style={{padding:"24px",textAlign:"center",color:"#9ca3af",fontSize:13}}>Belum ada pengajuan</div>
        )}
        {sortedList.map(a=>{
          const sc = statusCfg[a.status] || statusCfg.pending;
          return (
            <div key={a.id} className="tg-angg-item">
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:600,color:"#111827"}}>{a.judul}</div>
                <div style={{fontSize:11,color:"#9ca3af",marginTop:1}}>
                  {a.pengaju} · {a.tanggal} · {a.kategori}
                </div>
                {a.keterangan && <div style={{fontSize:11,color:"#6b7280",marginTop:1}}>{a.keterangan}</div>}
              </div>
              <div style={{textAlign:"right",marginRight:8}}>
                <div style={{fontSize:13,fontWeight:700,color:"#f97316"}}>{fmtRp(a.nominal)}</div>
              </div>
              <span className="tg-angg-badge" style={{color:sc.color,background:sc.bg}}>{sc.label}</span>
              {isAdmin && a.status==="pending" && (
                <div style={{display:"flex",gap:5,marginLeft:6}}>
                  <button className="tg-rutin-btn bayar" style={{fontSize:10}} onClick={()=>handleApprove(a.id)}>✅</button>
                  <button className="tg-rutin-btn" style={{fontSize:10,color:"#dc2626"}} onClick={()=>handleReject(a.id)}>✕</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Tagihan({ user, globalData = {} }) {
  const {
    penyewaList        = [],
    kamarList          = [],
    tagihanList        = [], setTagihanList  = () => {},
    kasJurnal          = [], setKasJurnal    = () => {},
    pengaturanConfig   = {},
    isReadOnly         = false,
    sewaDimukaList   = [], setSewaDimukaList = () => {},
    depositList      = [],
    tagihanRutinList = [], setTagihanRutinList = ()=>{},
    anggaranList     = [], setAnggaranList     = ()=>{},
    sakuConfig       = [],
  } = globalData;

  const DENDA_PER_HARI = pengaturanConfig.dendaPerHari  || 50000;
  const BATAS_TAGIHAN  = pengaturanConfig.batasTagihan  || 25;
  const TOLERANSI_HARI = pengaturanConfig.toleransiHari || 3;

  const [tab,      setTab]      = useState("sewa");
  const [selected, setSelected] = useState(null);
  const [showBayar,setShowBayar]= useState(false);
  const [search,   setSearch]   = useState("");
  const [filterKat,setFilterKat]= useState("semua");
  const [filterBln,setFilterBln]= useState(thisMonth);

  const isAdmin = user?.role === "superadmin" || user?.role === "admin";

  // Generate tagihan otomatis dari penyewa aktif
  const semuaTagihan = generateTagihan(penyewaList, kamarList, tagihanList);

  // Filter bulan & tab & search
  const filtered = semuaTagihan.filter(t => {
    if (filterBln !== "all" && t.periode !== filterBln) return false;
    if (tab === "sewa"      && false) return false; // semua sewa tampil
    if (tab === "belum"     && t.status === "lunas") return false;
    if (tab === "lunas"     && t.status !== "lunas") return false;
    if (tab === "terlambat" && t.status !== "terlambat") return false;
    if (search) {
      const q = search.toLowerCase();
      return t.nama?.toLowerCase().includes(q) || String(t.kamarId).includes(q);
    }
    return true;
  });

  // Stats
  const totalPiutang = semuaTagihan.filter(t => t.status !== "lunas").reduce((s,t) => s + t.nominal, 0);
  const totalLunas   = semuaTagihan.filter(t => t.status === "lunas").reduce((s,t) => s + t.nominal, 0);
  const jumlahBelum  = semuaTagihan.filter(t => t.status !== "lunas").length;
  const jumlahTerlambat = semuaTagihan.filter(t => t.status === "terlambat").length;

  const handleKonfirmasi = (updated) => {
    // Update tagihan
    const exist = tagihanList.find(t => t.id === updated.id);
    if (exist) {
      setTagihanList(prev => prev.map(t => t.id === updated.id ? updated : t));
    } else {
      setTagihanList(prev => [...prev, updated]);
    }

    const nominalBayar = updated.riwayatBayar?.slice(-1)[0]?.nominal || updated.nominal;
    const tglBayar     = updated.tglBayar;

    // Cek apakah multi-bulan (sewa dimuka)
    const sd = sewaDimukaList.find(s => s.penyewaId === updated.penyewaId && !s.selesai);
    if (sd) {
      // Cash basis: seluruh uang masuk kas sekarang
      setKasJurnal(prev => [...prev, {
        id:           "KJ-" + Date.now(),
        tanggal:      tglBayar,
        keterangan:   `Pembayaran sewa ${updated.nama} — Kamar ${updated.kamarId} (${updated.periode}) [Multi-bulan]`,
        kategori:     "Sewa Kamar",
        tipe:         "pemasukan",
        nominal:      nominalBayar,
        metode:       updated.metode,
        isSewaDimuka: true,
      }]);
      // Tandai bulan ini sudah release di sewaDimukaList
      setSewaDimukaList(prev => prev.map(s =>
        s.id === sd.id
          ? { ...s, sudahRelease: [...(s.sudahRelease||[]), updated.periode] }
          : s
      ));
    } else {
      // Pembayaran normal (1 bulan)
      setKasJurnal(prev => [...prev, {
        id:         "KJ-" + Date.now(),
        tanggal:    tglBayar,
        keterangan: `Sewa Kamar ${updated.kamarId} — ${updated.nama} (${updated.periode})`,
        kategori:   "Sewa Kamar",
        tipe:       "pemasukan",
        nominal:    nominalBayar,
        metode:     updated.metode,
      }]);
    }

    setSelected(updated);
    setShowBayar(false);
  };

  // Buat list bulan dari penyewa
  const bulanList = [...new Set(semuaTagihan.map(t => t.periode))].sort().reverse();

  return (
    <div className="tg-wrap">
      <StyleInjector />

      {/* Cards */}
      <div className="tg-cards">
        {[
          { label: "Piutang Bulan Ini", val: fmtRp(totalPiutang), color: "#ef4444", sub: `${jumlahBelum} tagihan belum lunas` },
          { label: "Sudah Lunas",       val: fmtRp(totalLunas),   color: "#16a34a", sub: `${semuaTagihan.filter(t=>t.status==="lunas").length} tagihan` },
          { label: "Terlambat",         val: jumlahTerlambat || (semuaTagihan.length?"0":"—"), color: "#dc2626", sub: "Melewati jatuh tempo" },
          { label: "Total Tagihan",     val: semuaTagihan.filter(t=>t.periode===filterBln).length || "—", color: "#f97316", sub: `Periode ${filterBln}` },
        ].map((c,i) => (
          <div key={i} className="tg-card">
            <div className="tg-card-bar" style={{ background: c.color }} />
            <div className="tg-card-label">{c.label}</div>
            <div className="tg-card-val">{c.val}</div>
            <div className="tg-card-sub">{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Layout */}

      {/* TOP-LEVEL TABS */}
      <div style={{display:"flex",gap:4,background:"#fff",borderRadius:10,border:"1px solid #e5e7eb",padding:5,marginBottom:4}}>
        {[
          {id:"sewa",     label:"🏠 Tagihan Sewa"},
          {id:"kalender", label:"📅 Kalender Keuangan"},
          {id:"anggaran", label:"📋 Pengajuan Anggaran"},
        ].map(t=>(
          <div key={t.id}
            style={{flex:1,padding:"8px 12px",borderRadius:7,fontSize:12,fontWeight:600,cursor:"pointer",textAlign:"center",
              background:tab===t.id?"linear-gradient(135deg,#f97316,#ea580c)":"transparent",
              color:tab===t.id?"#fff":"#6b7280",transition:"all .15s"}}
            onClick={()=>setTab(t.id)}>
            {t.label}
          </div>
        ))}
      </div>

      {/* KALENDER KEUANGAN */}
      {tab==="kalender" && (
        <TabKalenderKeuangan
          tagihanRutinList={tagihanRutinList}
          setTagihanRutinList={setTagihanRutinList}
          tagihanList={tagihanList}
          penyewaList={penyewaList}
          kamarList={kamarList}
          kasJurnal={kasJurnal}
          setKasJurnal={setKasJurnal}
          sakuConfig={sakuConfig}
          pengaturanConfig={pengaturanConfig}
          anggaranList={anggaranList}
        />
      )}
      {/* PENGAJUAN ANGGARAN */}
      {tab==="anggaran" && (
        <TabAnggaran
          anggaranList={anggaranList}
          setAnggaranList={setAnggaranList}
          kasJurnal={kasJurnal}
          setKasJurnal={setKasJurnal}
          sakuConfig={sakuConfig}
          user={user}
        />
      )}

      {tab==="sewa" && (
      <div className="tg-layout">
        <div className="tg-widget">
          <div className="tg-widget-head">
            <div className="tg-widget-title">💳 Daftar Tagihan</div>
            <div style={{ fontSize: 11, color: "#9ca3af" }}>{semuaTagihan.length} total tagihan</div>
          </div>

          {/* Tabs */}
          <div className="tg-tabs">
            {[
              { id: "semua",     label: `Semua (${semuaTagihan.length})` },
              { id: "belum",     label: `🕐 Belum Bayar (${jumlahBelum})` },
              { id: "terlambat", label: `⚠️ Terlambat (${jumlahTerlambat})` },
              { id: "lunas",     label: `✅ Lunas (${semuaTagihan.filter(t=>t.status==="lunas").length})` },
            ].map(t => (
              <div key={t.id} className={`tg-tab ${tab===t.id?"active":""}`} onClick={() => setTab(t.id)}>
                {t.label}
              </div>
            ))}
          </div>

          {/* Filter */}
          <div className="tg-filterbar">
            <div className="tg-search">
              <span>🔍</span>
              <input className="tg-search-input" placeholder="Cari nama, kamar..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="tg-select" value={filterBln} onChange={e => setFilterBln(e.target.value)}>
              <option value="all">Semua Bulan</option>
              {bulanList.map(b => <option key={b} value={b}>{b}</option>)}
              <option value={thisMonth}>{thisMonth} (Ini)</option>
            </select>
          </div>

          {/* List */}
          <div>
            {penyewaList.length === 0 ? (
              <div className="tg-empty">
                <div className="tg-empty-icon">💳</div>
                <div className="tg-empty-title">Belum ada tagihan</div>
                <div className="tg-empty-sub">Tagihan dibuat otomatis saat ada penyewa aktif</div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="tg-empty">
                <div className="tg-empty-icon">✅</div>
                <div className="tg-empty-title">Tidak ada tagihan di kategori ini</div>
                <div className="tg-empty-sub">Semua tagihan sudah lunas atau tidak ada data</div>
              </div>
            ) : (
              filtered.map(t => {
                const st = STATUS_CONFIG[t.status] || STATUS_CONFIG.belum;
                const sisa = hariSisa(t.jatuhTempo);
                return (
                  <div key={t.id} className={`tg-item ${selected?.id===t.id?"selected":""}`} onClick={() => setSelected(t)}>
                    <div className="tg-item-icon" style={{ background: st.bg }}>
                      <span>{st.icon}</span>
                    </div>
                    <div className="tg-item-info">
                      <div className="tg-item-name">{t.nama}</div>
                      <div className="tg-item-meta">
                        <span>🏠 K{padD(t.kamarId)}</span>
                        <span>📅 {t.periode}</span>
                        {t.dendaHari > 0 && <span style={{ color: "#dc2626", fontWeight: 600 }}>+denda {t.dendaHari}hr</span>}
                      </div>
                    </div>
                    <div className="tg-item-right">
                      <div className="tg-item-nominal">{fmtRp(t.nominal)}</div>
                      {t.status !== "lunas" && sisa !== null && (
                        <div className="tg-item-jatuh" style={{ color: sisa<0?"#dc2626":sisa<=3?"#f97316":"#9ca3af" }}>
                          {sisa<0 ? `${Math.abs(sisa)}hr telat` : `${sisa}hr lagi`}
                        </div>
                      )}
                      {t.status === "lunas" && (
                        <div className="tg-item-jatuh" style={{ color: "#16a34a" }}>✓ Lunas</div>
                      )}
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
            tagihan={selected}
            onBayar={() => setShowBayar(true)}
            onClose={() => setSelected(null)}
          />
        ) : (
          <div className="tg-widget">
            <div className="tg-empty" style={{ padding: "60px 20px" }}>
              <div className="tg-empty-icon">💳</div>
              <div className="tg-empty-title">Pilih tagihan</div>
              <div className="tg-empty-sub">Klik untuk konfirmasi pembayaran</div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Bayar */}      )}

      {showBayar && selected && (
        <ModalBayar
          tagihan={selected}
          onClose={() => setShowBayar(false)}
          onKonfirmasi={handleKonfirmasi}
        />
      )}
    </div>
  </div>
  );
}