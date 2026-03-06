import { useState, useEffect } from \"react\";
import {} from \"react-dom\";

// ============================================================
// CSS
// ============================================================
const CSS = `
  .rw-wrap { display: flex; flex-direction: column; gap: 16px; }

  .rw-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
  .rw-card { background: #fff; border-radius: 12px; border: 1px solid #e5e7eb; padding: 14px 16px; position: relative; overflow: hidden; }
  .rw-card-bar { position: absolute; top: 0; left: 0; right: 0; height: 3px; }
  .rw-card-label { font-size: 10px; font-weight: 500; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 4px; margin-top: 8px; }
  .rw-card-val { font-size: 22px; font-weight: 700; color: #111827; font-family: 'JetBrains Mono', monospace; }
  .rw-card-sub { font-size: 11px; color: #6b7280; margin-top: 3px; }

  .rw-layout { display: grid; grid-template-columns: 1fr 380px; gap: 14px; align-items: start; }

  .rw-widget { background: #fff; border-radius: 12px; border: 1px solid #e5e7eb; display: flex; flex-direction: column; overflow: hidden; }
  .rw-widget-head { padding: 13px 16px 10px; border-bottom: 1px solid #f3f4f6; display: flex; align-items: center; justify-content: space-between; }
  .rw-widget-title { font-size: 12px; font-weight: 600; color: #111827; display: flex; align-items: center; gap: 6px; }

  /* \u2500\u2500\u2500 FILTER BAR \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  .rw-filterbar { display: flex; align-items: center; gap: 8px; padding: 10px 14px; border-bottom: 1px solid #f3f4f6; flex-wrap: wrap; }
  .rw-search { display: flex; align-items: center; gap: 7px; background: #f9fafb; border: 1.5px solid #e5e7eb; border-radius: 8px; padding: 6px 11px; flex: 1; max-width: 240px; transition: border-color 0.12s; }
  .rw-search:focus-within { border-color: #f97316; background: #fff; }
  .rw-search-input { border: none; outline: none; background: transparent; font-size: 12px; color: #1f2937; width: 100%; font-family: inherit; }
  .rw-search-input::placeholder { color: #9ca3af; }
  .rw-select { padding: 6px 10px; border-radius: 8px; border: 1.5px solid #e5e7eb; font-size: 12px; color: #374151; background: #fff; outline: none; font-family: inherit; cursor: pointer; }
  .rw-select:focus { border-color: #f97316; }
  .rw-tag { padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 500; cursor: pointer; border: 1.5px solid #e5e7eb; color: #6b7280; background: #fff; transition: all 0.12s; white-space: nowrap; }
  .rw-tag.active { background: #111827; border-color: #111827; color: #fff; font-weight: 600; }

  /* \u2500\u2500\u2500 LIST \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  .rw-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-bottom: 1px solid #f3f4f6; cursor: pointer; transition: background 0.1s; }
  .rw-item:last-child { border-bottom: none; }
  .rw-item:hover { background: #fafafa; }
  .rw-item.selected { background: #fff7ed; border-left: 3px solid #f97316; }
  .rw-avatar { width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0; background: #e5e7eb; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: #6b7280; }
  .rw-avatar.checkin { background: linear-gradient(135deg, #f97316, #ea580c); color: #fff; }
  .rw-item-info { flex: 1; min-width: 0; }
  .rw-item-name { font-size: 13px; font-weight: 600; color: #1f2937; }
  .rw-item-meta { font-size: 11px; color: #9ca3af; margin-top: 2px; display: flex; gap: 8px; flex-wrap: wrap; }
  .rw-item-right { text-align: right; flex-shrink: 0; }
  .rw-item-kamar { font-size: 13px; font-weight: 700; color: #111827; font-family: 'JetBrains Mono', monospace; }
  .rw-item-dur { font-size: 10px; color: #9ca3af; margin-top: 2px; }

  .rw-badge { display: inline-flex; align-items: center; gap: 3px; padding: 2px 8px; border-radius: 20px; font-size: 10px; font-weight: 600; }

  /* \u2500\u2500\u2500 DETAIL PANEL \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  .rw-detail { padding: 16px; overflow-y: auto; max-height: calc(100vh - 220px); }
  .rw-detail-header { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 16px; }
  .rw-detail-avatar { width: 52px; height: 52px; border-radius: 12px; flex-shrink: 0; background: #e5e7eb; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 700; color: #6b7280; }
  .rw-detail-avatar.active { background: linear-gradient(135deg, #f97316, #ea580c); color: #fff; }
  .rw-detail-name { font-size: 16px; font-weight: 700; color: #111827; margin-bottom: 3px; }
  .rw-detail-sub  { font-size: 11px; color: #9ca3af; margin-top: 2px; }
  .rw-detail-badges { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 6px; }

  .rw-section { margin-bottom: 16px; }
  .rw-section-label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: #9ca3af; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
  .rw-section-label::after { content: ''; flex: 1; height: 1px; background: #f3f4f6; }

  .rw-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .rw-info-item { background: #f9fafb; border-radius: 8px; padding: 9px 11px; }
  .rw-info-key { font-size: 10px; color: #9ca3af; font-weight: 500; text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 2px; }
  .rw-info-val { font-size: 12px; font-weight: 600; color: #1f2937; word-break: break-word; }
  .rw-info-val.mono { font-family: 'JetBrains Mono', monospace; font-size: 11px; }
  .rw-info-val.orange { color: #ea580c; }

  /* Timeline riwayat kamar */
  .rw-timeline { position: relative; padding-left: 20px; }
  .rw-timeline::before { content: ''; position: absolute; left: 6px; top: 0; bottom: 0; width: 2px; background: #f3f4f6; }
  .rw-tl-item { position: relative; padding: 0 0 14px 14px; }
  .rw-tl-item::before { content: ''; position: absolute; left: -8px; top: 4px; width: 10px; height: 10px; border-radius: 50%; background: #e5e7eb; border: 2px solid #fff; }
  .rw-tl-item.checkin::before  { background: #16a34a; }
  .rw-tl-item.checkout::before { background: #ef4444; }
  .rw-tl-item.perpanjang::before { background: #3b82f6; }
  .rw-tl-title { font-size: 12px; font-weight: 600; color: #1f2937; }
  .rw-tl-sub   { font-size: 11px; color: #9ca3af; margin-top: 2px; }

  /* \u2500\u2500\u2500 MODAL CHECKIN ULANG \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  .rw-overlay-portal { position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; background: rgba(17,24,39,0.65) !important; backdrop-filter: blur(4px) !important; z-index: 9999 !important; display: flex !important; align-items: center !important; justify-content: center !important; padding: 16px !important; box-sizing: border-box !important; animation: rwFade 0.18s ease; }
  @keyframes rwFade { from { opacity: 0; } to { opacity: 1; } }
  .rw-modal { background: #fff; border-radius: 16px; width: 100%; max-width: 480px; max-height: 88vh; overflow-y: auto; box-shadow: 0 24px 64px rgba(0,0,0,0.18); animation: rwSlide 0.2s cubic-bezier(0.4,0,0.2,1); }
  @keyframes rwSlide { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .rw-modal-head { padding: 15px 20px 12px; border-bottom: 1px solid #f3f4f6; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; background: #fff; z-index: 1; }
  .rw-modal-title { font-size: 14px; font-weight: 700; color: #111827; }
  .rw-modal-close { width: 28px; height: 28px; border-radius: 7px; background: #f3f4f6; border: none; cursor: pointer; font-size: 14px; color: #6b7280; display: flex; align-items: center; justify-content: center; }
  .rw-modal-close:hover { background: #fee2e2; color: #dc2626; }
  .rw-modal-body { padding: 16px 20px; }
  .rw-modal-foot { padding: 12px 20px; border-top: 1px solid #f3f4f6; display: flex; gap: 8px; }

  .rw-field { margin-bottom: 12px; }
  .rw-field-label { font-size: 11px; font-weight: 600; color: #374151; margin-bottom: 5px; display: block; }
  .rw-input { width: 100%; padding: 8px 11px; border-radius: 8px; border: 1.5px solid #e5e7eb; font-size: 12px; font-family: inherit; color: #1f2937; outline: none; background: #fff; transition: border-color 0.12s; box-sizing: border-box; }
  .rw-input:focus { border-color: #f97316; }
  .rw-input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

  .rw-btn { flex: 1; padding: 9px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; border: none; cursor: pointer; font-family: inherit; transition: all 0.15s; display: flex; align-items: center; justify-content: center; gap: 5px; }
  .rw-btn.primary { background: linear-gradient(135deg, #f97316, #ea580c); color: #fff; box-shadow: 0 3px 10px rgba(249,115,22,0.25); }
  .rw-btn.ghost   { background: #f3f4f6; color: #4b5563; }
  .rw-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  .rw-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 50px 16px; color: #9ca3af; text-align: center; gap: 8px; }
  .rw-empty-icon { font-size: 36px; opacity: 0.4; }
  .rw-empty-title { font-size: 14px; font-weight: 600; color: #374151; }
  .rw-empty-sub { font-size: 12px; }

  @media (max-width: 1024px) { .rw-layout { grid-template-columns: 1fr; } }
  @media (max-width: 768px)  { .rw-cards { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 480px)  { .rw-cards { grid-template-columns: repeat(2, 1fr); gap: 8px; } .rw-input-row { grid-template-columns: 1fr; } }
`;

function StyleInjector() {
  useEffect(() => {
    const id = \"senyuminn-riwayat-css\";
    if (document.getElementById(id)) return;
    const el = document.createElement(\"style\");
    el.id = id; el.textContent = CSS;
    document.head.appendChild(el);
    return () => { const e = document.getElementById(id); if (e) e.remove(); };
  }, []);
  return null;
}

// ============================================================
// HELPERS
// ============================================================
const padD = (n) => String(n).padStart(2, \"0\");
const todayStr = (() => { const d = new Date(); return `${d.getFullYear()}-${padD(d.getMonth()+1)}-${padD(d.getDate())}`; })();
const fmtRp = (n) => n ? \"Rp \" + Number(n).toLocaleString(\"id-ID\") : \"\u2014\";
const getInisial = (nama) => {
  if (!nama) return \"?\";
  const p = nama.trim().split(\" \");
  return p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : nama.slice(0,2).toUpperCase();
};
const addMonths = (dateStr, n) => {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + parseInt(n));
  return `${d.getFullYear()}-${padD(d.getMonth()+1)}-${padD(d.getDate())}`;
};
const hitungDurasi = (mulai, selesai) => {
  if (!mulai || !selesai) return \"\u2014\";
  const bln = Math.round((new Date(selesai) - new Date(mulai)) / (1000 * 60 * 60 * 24 * 30));
  return `${bln} bulan`;
};

// ============================================================
// MODAL CHECKIN ULANG
// ============================================================
function ModalCheckinUlang({ penyewa, kamarList, onClose, onCheckin }) {
  const [form, setForm] = useState({
    kamarId:      penyewa.kamarId || \"\",
    kontrakMulai: todayStr,
    durasi:       \"6\",
    kontrakSelesai: \"\",
  });
  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  useEffect(() => {
    if (form.kontrakMulai && form.durasi)
      set(\"kontrakSelesai\", addMonths(form.kontrakMulai, form.durasi));
  }, []);

  const handleMulai = (tgl) => {
    set(\"kontrakMulai\", tgl);
    if (form.durasi) set(\"kontrakSelesai\", addMonths(tgl, form.durasi));
  };
  const handleDurasi = (dur) => {
    set(\"durasi\", dur);
    if (form.kontrakMulai) set(\"kontrakSelesai\", addMonths(form.kontrakMulai, dur));
  };

  const kamarDipilih = kamarList.find(k => k.id === form.kamarId);
  const valid = form.kamarId && form.kontrakMulai;

  return(
    <div className=\"rw-overlay-portal\" onClick={onClose}>
      <div className=\"rw-modal\" onClick={e => e.stopPropagation()}>
        <div className=\"rw-modal-head\">
          <div className=\"rw-modal-title\">\ud83d\udd04 Check-in Ulang \u2014 {penyewa.nama}</div>
          <button className=\"rw-modal-close\" onClick={onClose}>\u2715</button>
        </div>
        <div className=\"rw-modal-body\">

          {/* Data lama */}
          <div style={{ background: \"#f9fafb\", borderRadius: 10, padding: \"12px 14px\", marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: \"#9ca3af\", textTransform: \"uppercase\", letterSpacing: 1, marginBottom: 8 }}>Data Tersimpan</div>
            <div style={{ display: \"grid\", gridTemplateColumns: \"1fr 1fr\", gap: 6, fontSize: 12 }}>
              {[
                { k: \"NIK\",      v: penyewa.nik || \"\u2014\" },
                { k: \"No. HP\",   v: penyewa.noHP || \"\u2014\" },
                { k: \"Alamat\",   v: penyewa.alamat || \"\u2014\" },
                { k: \"Pekerjaan\",v: penyewa.pekerjaan || \"\u2014\" },
              ].map((r,i) => (
                <div key={i}>
                  <span style={{ color: \"#9ca3af\" }}>{r.k}: </span>
                  <span style={{ fontWeight: 600, color: \"#374151\" }}>{r.v}</span>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, color: \"#16a34a\", marginTop: 8, fontWeight: 500 }}>\u2705 Data identitas tidak perlu diisi ulang</div>
          </div>

          <div style={{ fontSize: 11, fontWeight: 600, color: \"#374151\", marginBottom: 8 }}>Pilih Kamar</div>
          {kamarList.length === 0 ? (
            <div style={{ fontSize: 12, color: \"#9ca3af\", padding: \"8px 0\" }}>Belum ada kamar tersedia</div>
          ) : (
            <div style={{ display: \"grid\", gridTemplateColumns: \"repeat(4,1fr)\", gap: 8, marginBottom: 14 }}>
              {kamarList.map(k => {
                const avail = k.status === \"tersedia\" || k.status === \"booked\";
                return (
                  <div
                    key={k.id}
                    onClick={() => avail && set(\"kamarId\", k.id)}
                    style={{
                      padding: \"8px 6px\", borderRadius: 8, textAlign: \"center\",
                      border: `1.5px solid ${form.kamarId===k.id?\"#f97316\":\"#e5e7eb\"}`,
                      background: form.kamarId===k.id ? \"#fff7ed\" : \"#fff\",
                      cursor: avail ? \"pointer\" : \"not-allowed\",
                      opacity: avail ? 1 : 0.35,
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 700, color: \"#111827\" }}>K{padD(k.id)}</div>
                    <div style={{ fontSize: 9, color: \"#9ca3af\" }}>{k.tipe}</div>
                    <div style={{ fontSize: 10, color: \"#f97316\", fontWeight: 600 }}>{fmtRp(k.harga)}</div>
                  </div>
                );
              })}
            </div>
          )}

          <div className=\"rw-input-row\">
            <div className=\"rw-field\">
              <label className=\"rw-field-label\">Mulai Kontrak</label>
              <input type=\"date\" className=\"rw-input\" value={form.kontrakMulai} onChange={e => handleMulai(e.target.value)} />
            </div>
            <div className=\"rw-field\">
              <label className=\"rw-field-label\">Durasi</label>
              <select className=\"rw-input\" value={form.durasi} onChange={e => handleDurasi(e.target.value)}>
                <option value=\"3\">3 bulan</option>
                <option value=\"6\">6 bulan</option>
                <option value=\"12\">12 bulan</option>
              </select>
            </div>
          </div>

          {form.kontrakSelesai && (
            <div style={{ background: \"#f0fdf4\", border: \"1px solid #86efac\", borderRadius: 8, padding: \"8px 12px\", fontSize: 11, color: \"#15803d\" }}>
              \u2705 Kontrak berakhir: <b>{form.kontrakSelesai}</b>
              {kamarDipilih && <> \u00b7 <b>{fmtRp(kamarDipilih.harga)}/bulan</b></>}
            </div>
          )}

        </div>
        <div className=\"rw-modal-foot\">
          <button className=\"rw-btn primary\" disabled={!valid} onClick={() => { onCheckin({ ...penyewa, ...form, id: Date.now(), statusRiwayat: undefined, tglCheckout: undefined }); onClose(); }}>
            \ud83d\udd11 Check-in Ulang
          </button>
          <button className=\"rw-btn ghost\" onClick={onClose}>Batal</button>
        </div>
      </div>
  );
}

// ============================================================
// DETAIL PANEL
// ============================================================
function DetailPanel({ penyewa, kamarList, onCheckinUlang, onClose }) {
  const isAdmin = true; // dari props user nanti
  const kamar = kamarList.find(k => k.id === penyewa.kamarId);

  // Susun timeline dari data penyewa
  const timeline = [
    { type: \"checkin\",  label: \"Check-in\",         tgl: penyewa.tglMasuk,   sub: `Kamar ${penyewa.kamarId}` },
    penyewa.kontrakMulai !== penyewa.tglMasuk && {
      type: \"perpanjang\", label: \"Perpanjang Kontrak\", tgl: penyewa.kontrakMulai, sub: `Durasi ${penyewa.durasi} bulan`
    },
    { type: \"checkout\", label: \"Check-out\",         tgl: penyewa.tglCheckout, sub: `Kamar ${penyewa.kamarId}` },
  ].filter(Boolean);

  return (
    <div className=\"rw-widget\">
      <div className=\"rw-widget-head\">
        <div className=\"rw-widget-title\">\ud83d\udccb Detail Riwayat</div>
        <button onClick={onClose} style={{ background: \"none\", border: \"none\", cursor: \"pointer\", color: \"#9ca3af\", fontSize: 16 }}>\u2715</button>
      </div>
      <div className=\"rw-detail\">

        {/* Header */}
        <div className=\"rw-detail-header\">
          <div className=\"rw-detail-avatar\">{getInisial(penyewa.nama)}</div>
          <div style={{ flex: 1 }}>
            <div className=\"rw-detail-name\">{penyewa.nama}</div>
            <div className=\"rw-detail-sub\">\ud83d\udcde {penyewa.noHP || \"\u2014\"} \u00b7 {penyewa.pekerjaan || \"\u2014\"}</div>
            <div className=\"rw-detail-badges\">
              <span className=\"rw-badge\" style={{ background: \"#f3f4f6\", color: \"#6b7280\" }}>\ud83c\udfe0 Kamar {penyewa.kamarId}</span>
              <span className=\"rw-badge\" style={{ background: \"#fee2e2\", color: \"#dc2626\" }}>\u2713 Alumni</span>
            </div>
          </div>
        </div>

        {/* Kontrak Lama */}
        <div className=\"rw-section\">
          <div className=\"rw-section-label\">Kontrak Terakhir</div>
          <div style={{ background: \"#f9fafb\", borderRadius: 10, padding: \"12px 14px\", border: \"1px solid #e5e7eb\" }}>
            <div style={{ display: \"flex\", justifyContent: \"space-between\", alignItems: \"center\", marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: \"#374151\", fontFamily: \"JetBrains Mono, monospace\" }}>
                {penyewa.kontrakMulai || \"\u2014\"} \u2192 {penyewa.kontrakSelesai || \"\u2014\"}
              </span>
              <span className=\"rw-badge\" style={{ background: \"#f3f4f6\", color: \"#6b7280\" }}>{hitungDurasi(penyewa.kontrakMulai, penyewa.kontrakSelesai)}</span>
            </div>
            <div style={{ fontSize: 11, color: \"#9ca3af\" }}>
              Check-out: {penyewa.tglCheckout || \"\u2014\"}
              {kamar && <> \u00b7 {fmtRp(kamar.harga)}/bulan</>}
            </div>
          </div>
        </div>

        {/* Identitas */}
        <div className=\"rw-section\">
          <div className=\"rw-section-label\">Identitas</div>
          <div className=\"rw-info-grid\">
            {[
              { k: \"NIK / KTP\",    v: penyewa.nik       || \"\u2014\", mono: true },
              { k: \"Tgl Lahir\",    v: penyewa.tglLahir  || \"\u2014\" },
              { k: \"Alamat\",       v: penyewa.alamat    || \"\u2014\", full: true },
              { k: \"No. Darurat\",  v: penyewa.noHPDarurat || \"\u2014\" },
              { k: \"Nama Darurat\", v: penyewa.namaDarurat || \"\u2014\" },
              { k: \"Foto KTP\",     v: penyewa.ktpFile ? `\u2705 ${penyewa.ktpFile}` : \"\u2014\" },
            ].map((i,idx) => (
              <div key={idx} className=\"rw-info-item\" style={i.full ? { gridColumn: \"1 / -1\" } : {}}>
                <div className=\"rw-info-key\">{i.k}</div>
                <div className={`rw-info-val ${i.mono?\"mono\":\"\"}`}>{i.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Partner */}
        {penyewa.partner?.length > 0 && (
          <div className=\"rw-section\">
            <div className=\"rw-section-label\">Partner</div>
            {penyewa.partner.map((p,i) => (
              <div key={i} style={{ display: \"flex\", alignItems: \"center\", gap: 8, padding: \"7px 10px\", background: \"#f9fafb\", borderRadius: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 14 }}>\ud83d\udc65</span>
                <span style={{ fontSize: 12, fontWeight: 500, color: \"#374151\" }}>{p}</span>
              </div>
            ))}
          </div>
        )}

        {/* Timeline */}
        <div className=\"rw-section\">
          <div className=\"rw-section-label\">Riwayat Aktivitas</div>
          <div className=\"rw-timeline\">
            {timeline.map((t, i) => (
              <div key={i} className={`rw-tl-item ${t.type}`}>
                <div className=\"rw-tl-title\">
                  {t.type === \"checkin\" ? \"\ud83d\udd11\" : t.type === \"checkout\" ? \"\ud83d\udeaa\" : \"\ud83d\udccb\"} {t.label}
                </div>
                <div className=\"rw-tl-sub\">{t.tgl || \"\u2014\"} \u00b7 {t.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Aksi */}
        <button
          className=\"rw-btn primary\"
          style={{ width: \"100%\", marginTop: 4 }}
          onClick={onCheckinUlang}
        >
          \ud83d\udd04 Check-in Ulang
        </button>

      </div>
    </div>
  );
}

// ============================================================
// MAIN
// ============================================================
export default function Riwayat({ user, globalData = {} }) {
  const {
    riwayatList  = [], setRiwayatList  = () => {},
    penyewaList  = [], setPenyewaList  = () => {},
    kamarList    = [],
  } = globalData;

  const [selected,   setSelected]   = useState(null);
  const [showModal,  setShowModal]  = useState(false);
  const [search,     setSearch]     = useState(\"\");
  const [filterKamar, setFK]        = useState(\"all\");
  const [sortBy,     setSortBy]     = useState(\"terbaru\");

  const isAdmin = user?.role === \"superadmin\" || user?.role === \"admin\";

  // Filter & sort
  const filtered = riwayatList
    .filter(p => {
      if (filterKamar !== \"all\" && String(p.kamarId) !== filterKamar) return false;
      if (search) {
        const q = search.toLowerCase();
        return p.nama?.toLowerCase().includes(q) || String(p.kamarId).includes(q) || p.nik?.includes(q) || p.noHP?.includes(q);
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === \"terbaru\") return new Date(b.tglCheckout||0) - new Date(a.tglCheckout||0);
      if (sortBy === \"terlama\") return new Date(a.tglCheckout||0) - new Date(b.tglCheckout||0);
      if (sortBy === \"nama\")    return (a.nama||\"\").localeCompare(b.nama||\"\");
      return 0;
    });

  // Stats
  const kamarTerbanyak = riwayatList.reduce((acc, p) => {
    acc[p.kamarId] = (acc[p.kamarId] || 0) + 1; return acc;
  }, {});
  const kamarPalingAktif = Object.entries(kamarTerbanyak).sort((a,b)=>b[1]-a[1])[0]?.[0];

  const handleCheckinUlang = (data) => {
    setPenyewaList(prev => [...prev, data]);
    // Tandai di riwayat sebagai \"checkin ulang\"
    setRiwayatList(prev => prev.map(p =>
      p.id === selected?.id ? { ...p, checkinUlang: true } : p
    ));
    setSelected(null);
    setShowModal(false);
  };

  return (
    <div className=\"rw-wrap\">
      <StyleInjector />

      {/* Cards */}
      <div className=\"rw-cards\">
        {[
          { label: \"Total Alumni\",      val: riwayatList.length || \"\u2014\", color: \"#6b7280\",  sub: \"Pernah tinggal\" },
          { label: \"Bulan Ini\",         val: riwayatList.filter(p => p.tglCheckout?.startsWith(todayStr.slice(0,7))).length || (riwayatList.length?\"0\":\"\u2014\"), color: \"#f97316\", sub: \"Check-out bulan ini\" },
          { label: \"Check-in Ulang\",    val: riwayatList.filter(p => p.checkinUlang).length || (riwayatList.length?\"0\":\"\u2014\"), color: \"#16a34a\", sub: \"Penyewa kembali\" },
          { label: \"Kamar Paling Aktif\",val: kamarPalingAktif ? `K${padD(kamarPalingAktif)}` : \"\u2014\", color: \"#3b82f6\", sub: kamarPalingAktif ? `${kamarTerbanyak[kamarPalingAktif]}x disewa` : \"Belum ada data\" },
        ].map((c,i) => (
          <div key={i} className=\"rw-card\">
            <div className=\"rw-card-bar\" style={{ background: c.color }} />
            <div className=\"rw-card-label\">{c.label}</div>
            <div className=\"rw-card-val\">{c.val}</div>
            <div className=\"rw-card-sub\">{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Layout */}
      <div className=\"rw-layout\">
        <div className=\"rw-widget\">
          <div className=\"rw-widget-head\">
            <div className=\"rw-widget-title\">\ud83d\udccb Riwayat Penyewa</div>
            <span style={{ fontSize: 11, color: \"#9ca3af\" }}>{riwayatList.length} total alumni</span>
          </div>

          {/* Filter */}
          <div className=\"rw-filterbar\">
            <div className=\"rw-search\">
              <span>\ud83d\udd0d</span>
              <input className=\"rw-search-input\" placeholder=\"Cari nama, NIK, kamar...\" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className=\"rw-select\" value={filterKamar} onChange={e => setFK(e.target.value)}>
              <option value=\"all\">Semua Kamar</option>
              {[...new Set(riwayatList.map(p=>p.kamarId))].sort().map(k => (
                <option key={k} value={String(k)}>Kamar {k}</option>
              ))}
            </select>
            <select className=\"rw-select\" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value=\"terbaru\">Terbaru</option>
              <option value=\"terlama\">Terlama</option>
              <option value=\"nama\">A\u2013Z Nama</option>
            </select>
          </div>

          {/* List */}
          <div>
            {riwayatList.length === 0 ? (
              <div className=\"rw-empty\">
                <div className=\"rw-empty-icon\">\ud83d\udccb</div>
                <div className=\"rw-empty-title\">Belum ada riwayat</div>
                <div className=\"rw-empty-sub\">Riwayat akan muncul otomatis setelah penyewa melakukan check-out</div>
              </div>
            ) : filtered.length === 0 ? (
              <div className=\"rw-empty\">
                <div className=\"rw-empty-icon\">\ud83d\udd0d</div>
                <div className=\"rw-empty-title\">Tidak ditemukan</div>
                <div className=\"rw-empty-sub\">Coba ubah kata kunci pencarian</div>
              </div>
            ) : (
              filtered.map(p => {
                const durasi = hitungDurasi(p.kontrakMulai, p.kontrakSelesai);
                return (
                  <div key={p.id} className={`rw-item ${selected?.id===p.id?\"selected\":\"\"}`} onClick={() => setSelected(p)}>
                    <div className=\"rw-avatar\">{getInisial(p.nama)}</div>
                    <div className=\"rw-item-info\">
                      <div className=\"rw-item-name\">{p.nama}</div>
                      <div className=\"rw-item-meta\">
                        <span>\ud83d\udcc5 {p.tglMasuk} \u2192 {p.tglCheckout || \"\u2014\"}</span>
                        {p.partner?.length > 0 && <span>\ud83d\udc65 +{p.partner.length}</span>}
                        {p.checkinUlang && <span style={{ color: \"#16a34a\", fontWeight: 600 }}>\ud83d\udd04 Kembali lagi</span>}
                      </div>
                    </div>
                    <div className=\"rw-item-right\">
                      <div className=\"rw-item-kamar\">K{padD(p.kamarId)}</div>
                      <div className=\"rw-item-dur\">{durasi}</div>
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
            penyewa={selected}
            kamarList={kamarList}
            onCheckinUlang={() => setShowModal(true)}
            onClose={() => setSelected(null)}
          />
        ) : (
          <div className=\"rw-widget\">
            <div className=\"rw-empty\" style={{ padding: \"60px 20px\" }}>
              <div className=\"rw-empty-icon\">\ud83d\udccb</div>
              <div className=\"rw-empty-title\">Pilih alumni</div>
              <div className=\"rw-empty-sub\">Klik nama untuk lihat detail & opsi check-in ulang</div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Check-in Ulang */}
      {showModal && selected && (
        <ModalCheckinUlang
          penyewa={selected}
          kamarList={kamarList}
          onClose={() => setShowModal(false)}
          onCheckin={handleCheckinUlang}
        />
      )}
    </div>
  );
}