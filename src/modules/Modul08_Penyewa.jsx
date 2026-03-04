import { useState, useEffect } from "react";

const CSS = `
  .py-wrap { display: flex; flex-direction: column; gap: 16px; }
  .py-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
  .py-card { background: #fff; border-radius: 12px; border: 1px solid #e5e7eb; padding: 14px 16px; position: relative; overflow: hidden; }
  .py-card-bar { position: absolute; top: 0; left: 0; right: 0; height: 3px; }
  .py-card-label { font-size: 10px; font-weight: 500; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 4px; margin-top: 8px; }
  .py-card-val { font-size: 22px; font-weight: 700; color: #111827; font-family: 'JetBrains Mono', monospace; }
  .py-card-sub { font-size: 11px; color: #6b7280; margin-top: 3px; }
  .py-layout { display: grid; grid-template-columns: 1fr 360px; gap: 14px; align-items: start; }
  .py-widget { background: #fff; border-radius: 12px; border: 1px solid #e5e7eb; display: flex; flex-direction: column; overflow: hidden; }
  .py-widget-head { padding: 13px 16px 10px; border-bottom: 1px solid #f3f4f6; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
  .py-widget-title { font-size: 12px; font-weight: 600; color: #111827; display: flex; align-items: center; gap: 6px; }
  .py-widget-body { padding: 0; flex: 1; }
  .py-filterbar { display: flex; align-items: center; gap: 8px; padding: 10px 14px; border-bottom: 1px solid #f3f4f6; flex-wrap: wrap; }
  .py-search { display: flex; align-items: center; gap: 7px; background: #f9fafb; border: 1.5px solid #e5e7eb; border-radius: 8px; padding: 6px 11px; flex: 1; max-width: 260px; transition: border-color 0.12s; }
  .py-search:focus-within { border-color: #f97316; background: #fff; }
  .py-search-input { border: none; outline: none; background: transparent; font-size: 12px; color: #1f2937; width: 100%; font-family: inherit; }
  .py-search-input::placeholder { color: #9ca3af; }
  .py-tag { padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 500; cursor: pointer; border: 1.5px solid #e5e7eb; color: #6b7280; background: #fff; transition: all 0.12s; white-space: nowrap; }
  .py-tag:hover { border-color: #fed7aa; color: #ea580c; }
  .py-tag.active { background: #111827; border-color: #111827; color: #fff; font-weight: 600; }
  .py-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-bottom: 1px solid #f3f4f6; cursor: pointer; transition: background 0.1s; }
  .py-item:last-child { border-bottom: none; }
  .py-item:hover { background: #fafafa; }
  .py-item.selected { background: #fff7ed; border-left: 3px solid #f97316; }
  .py-avatar { width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0; background: linear-gradient(135deg, #f97316, #ea580c); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: #fff; }
  .py-item-info { flex: 1; min-width: 0; }
  .py-item-name { font-size: 13px; font-weight: 600; color: #1f2937; }
  .py-item-meta { font-size: 11px; color: #9ca3af; margin-top: 2px; display: flex; gap: 8px; }
  .py-item-right { text-align: right; flex-shrink: 0; }
  .py-item-kamar { font-size: 13px; font-weight: 700; color: #111827; font-family: 'JetBrains Mono', monospace; }
  .py-item-sisa { font-size: 10px; margin-top: 2px; font-weight: 500; }
  .py-badge { display: inline-flex; align-items: center; gap: 3px; padding: 2px 8px; border-radius: 20px; font-size: 10px; font-weight: 600; }
  .py-detail { padding: 16px; }
  .py-detail-header { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 16px; }
  .py-detail-avatar { width: 52px; height: 52px; border-radius: 12px; flex-shrink: 0; background: linear-gradient(135deg, #f97316, #ea580c); display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 700; color: #fff; }
  .py-detail-name { font-size: 17px; font-weight: 700; color: #111827; margin-bottom: 3px; }
  .py-detail-sub { font-size: 11px; color: #9ca3af; }
  .py-detail-badges { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 6px; }
  .py-section { margin-bottom: 16px; }
  .py-section-label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: #9ca3af; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
  .py-section-label::after { content: ''; flex: 1; height: 1px; background: #f3f4f6; }
  .py-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .py-info-item { background: #f9fafb; border-radius: 8px; padding: 9px 11px; }
  .py-info-key { font-size: 10px; color: #9ca3af; font-weight: 500; text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 2px; }
  .py-info-val { font-size: 12px; font-weight: 600; color: #1f2937; }
  .py-info-val.mono { font-family: 'JetBrains Mono', monospace; font-size: 11px; }
  .py-info-val.orange { color: #ea580c; }
  .py-kontrak-bar { background: linear-gradient(135deg, #fff7ed, #fff); border: 1px solid #fed7aa; border-radius: 10px; padding: 12px 14px; margin-bottom: 10px; }
  .py-kontrak-dates { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 600; color: #374151; font-family: 'JetBrains Mono', monospace; margin-bottom: 8px; }
  .py-kontrak-arrow { color: #f97316; }
  .py-progress { height: 6px; background: #f3f4f6; border-radius: 3px; overflow: hidden; }
  .py-progress-fill { height: 100%; border-radius: 3px; background: linear-gradient(90deg, #f97316, #16a34a); transition: width 0.3s; }
  .py-partner-item { display: flex; align-items: center; gap: 8px; padding: 8px 10px; background: #f9fafb; border-radius: 8px; margin-bottom: 6px; }
  .py-partner-icon { width: 28px; height: 28px; border-radius: 7px; background: #e5e7eb; display: flex; align-items: center; justify-content: center; font-size: 13px; flex-shrink: 0; }
  .py-partner-name { font-size: 12px; font-weight: 500; color: #374151; }
  .py-overlay { position: fixed; inset: 0; background: rgba(17,24,39,0.45); backdrop-filter: blur(3px); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px 16px; animation: pyFade 0.18s ease; }
  @keyframes pyFade { from { opacity: 0; } to { opacity: 1; } }
  .py-modal { background: #fff; border-radius: 16px; width: 100%; max-width: 520px; max-height: 88vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.15); animation: pySlide 0.2s cubic-bezier(0.4,0,0.2,1); margin: auto; }
  @keyframes pySlide { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .py-modal-head { padding: 16px 20px 12px; border-bottom: 1px solid #f3f4f6; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; background: #fff; z-index: 1; }
  .py-modal-title { font-size: 14px; font-weight: 700; color: #111827; }
  .py-modal-close { width: 28px; height: 28px; border-radius: 7px; background: #f3f4f6; border: none; cursor: pointer; font-size: 14px; color: #6b7280; display: flex; align-items: center; justify-content: center; }
  .py-modal-close:hover { background: #fee2e2; color: #dc2626; }
  .py-modal-body { padding: 16px 20px; }
  .py-modal-foot { padding: 12px 20px; border-top: 1px solid #f3f4f6; display: flex; gap: 8px; }
  .py-field { margin-bottom: 13px; }
  .py-field-label { font-size: 11px; font-weight: 600; color: #374151; margin-bottom: 5px; display: block; }
  .py-field-label span { color: #ef4444; }
  .py-input { width: 100%; padding: 8px 11px; border-radius: 8px; border: 1.5px solid #e5e7eb; font-size: 12px; font-family: inherit; color: #1f2937; outline: none; background: #fff; transition: border-color 0.12s; box-sizing: border-box; }
  .py-input:focus { border-color: #f97316; }
  .py-input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .py-section-divider { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af; margin: 14px 0 10px; display: flex; align-items: center; gap: 6px; }
  .py-section-divider::after { content: ''; flex: 1; height: 1px; background: #f3f4f6; }
  .py-btn { flex: 1; padding: 9px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; border: none; cursor: pointer; font-family: inherit; transition: all 0.15s; display: flex; align-items: center; justify-content: center; gap: 5px; }
  .py-btn.primary { background: linear-gradient(135deg, #f97316, #ea580c); color: #fff; box-shadow: 0 3px 10px rgba(249,115,22,0.25); }
  .py-btn.ghost { background: #f3f4f6; color: #4b5563; }
  .py-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .py-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 50px 16px; color: #9ca3af; text-align: center; gap: 8px; }
  .py-empty-icon { font-size: 36px; opacity: 0.4; }
  .py-empty-title { font-size: 14px; font-weight: 600; color: #374151; }
  .py-empty-sub { font-size: 12px; }
  @media (max-width: 1024px) { .py-layout { grid-template-columns: 1fr; } }
  @media (max-width: 768px) { .py-cards { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 480px) { .py-cards { grid-template-columns: repeat(2, 1fr); gap: 8px; } .py-input-row { grid-template-columns: 1fr; } }
`;

function StyleInjector() {
  useEffect(() => {
    const id = "senyuminn-penyewa-css";
    if (document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id; el.textContent = CSS;
    document.head.appendChild(el);
    return () => { const e = document.getElementById(id); if (e) e.remove(); };
  }, []);
  return null;
}

const padD = (n) => String(n).padStart(2, "0");
const todayStr = (() => { const d = new Date(); return `${d.getFullYear()}-${padD(d.getMonth()+1)}-${padD(d.getDate())}`; })();
const hariSisa = (tgl) => tgl ? Math.ceil((new Date(tgl) - new Date()) / 86400000) : null;
const progressKontrak = (mulai, selesai) => {
  if (!mulai || !selesai) return 0;
  const total = new Date(selesai) - new Date(mulai);
  const done  = new Date() - new Date(mulai);
  return Math.min(100, Math.max(0, Math.round((done / total) * 100)));
};
const getInisial = (nama) => {
  if (!nama) return "?";
  const parts = nama.trim().split(" ");
  return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : nama.slice(0,2).toUpperCase();
};

function FormPenyewa({ penyewa, kamarList, onClose, onSave }) {
  const isEdit = !!penyewa;
  const [form, setForm] = useState({
    nama: penyewa?.nama || "",
    noHP: penyewa?.noHP || "",
    noKTP: penyewa?.noKTP || "",
    alamat: penyewa?.alamat || "",
    namaDarurat: penyewa?.namaDarurat || "",
    noHPDarurat: penyewa?.noHPDarurat || "",
    tglMasuk: penyewa?.tglMasuk || todayStr,
    kamarId: penyewa?.kamarId || "",
    kontrakMulai: penyewa?.kontrakMulai || todayStr,
    kontrakSelesai: penyewa?.kontrakSelesai || "",
    durasi: penyewa?.durasi || "6",
    partner: penyewa?.partner || [{ nama: "", noHP: "" }, { nama: "", noHP: "" }],
    catatan: penyewa?.catatan || "",
  });
  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));
  const setPartner = (idx, field, val) => setForm(prev => {
    const p = [...prev.partner];
    if (!p[idx]) p[idx] = { nama: "", noHP: "" };
    p[idx] = { ...p[idx], [field]: val };
    return { ...prev, partner: p };
  });

  const handleDurasi = (dur) => {
    set("durasi", dur);
    if (form.kontrakMulai) {
      const d = new Date(form.kontrakMulai);
      d.setMonth(d.getMonth() + parseInt(dur));
      set("kontrakSelesai", `${d.getFullYear()}-${padD(d.getMonth()+1)}-${padD(d.getDate())}`);
    }
  };
  const handleMulai = (tgl) => {
    set("kontrakMulai", tgl);
    if (form.durasi) {
      const d = new Date(tgl);
      d.setMonth(d.getMonth() + parseInt(form.durasi));
      set("kontrakSelesai", `${d.getFullYear()}-${padD(d.getMonth()+1)}-${padD(d.getDate())}`);
    }
  };

  const nikValid = !form.noKTP || /^\d{16}$/.test(form.noKTP);
  const valid = form.nama && form.noHP && form.kamarId && form.kontrakMulai && nikValid;

  // Auto-compute kontrakSelesai on mount if kontrakMulai exists
  useEffect(() => {
    if (form.kontrakMulai && form.durasi && !form.kontrakSelesai) {
      const d = new Date(form.kontrakMulai);
      d.setMonth(d.getMonth() + parseInt(form.durasi));
      set("kontrakSelesai", `${d.getFullYear()}-${padD(d.getMonth()+1)}-${padD(d.getDate())}`);
    }
  }, []);

  return (
    <div className="py-overlay" onClick={onClose}>
      <div className="py-modal" onClick={e => e.stopPropagation()}>
        <div className="py-modal-head">
          <div className="py-modal-title">{isEdit ? "✏️ Edit Data Penyewa" : "👤 Tambah Penyewa"}</div>
          <button className="py-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="py-modal-body">
          <div className="py-section-divider">Data Penyewa Utama</div>
          <div className="py-field">
            <label className="py-field-label">Nama Lengkap <span>*</span></label>
            <input className="py-input" placeholder="Nama sesuai KTP" value={form.nama} onChange={e => set("nama", e.target.value)} />
          </div>
          <div className="py-input-row">
            <div className="py-field">
              <label className="py-field-label">Nomor HP <span>*</span></label>
              <input className="py-input" placeholder="08xx-xxxx-xxxx" value={form.noHP} onChange={e => set("noHP", e.target.value)} />
            </div>
            <div className="py-field">
              <label className="py-field-label">NIK / No. KTP {!nikValid && form.noKTP && <span style={{color:"#ef4444",fontWeight:400}}>— harus 16 digit</span>}</label>
              <input className="py-input" placeholder="16 digit NIK" maxLength={16} value={form.noKTP} onChange={e => set("noKTP", e.target.value.replace(/\D/g,""))} style={!nikValid && form.noKTP ? {borderColor:"#ef4444"} : {}} />
            </div>
          </div>
          <div className="py-field">
            <label className="py-field-label">Alamat</label>
            <textarea className="py-input" rows={2} placeholder="Alamat lengkap sesuai KTP..." value={form.alamat} onChange={e => set("alamat", e.target.value)} style={{ resize: "none" }} />
          </div>
          <div className="py-section-divider">Kontak Darurat</div>
          <div className="py-input-row">
            <div className="py-field">
              <label className="py-field-label">Nama Darurat</label>
              <input className="py-input" placeholder="Nama keluarga / wali" value={form.namaDarurat} onChange={e => set("namaDarurat", e.target.value)} />
            </div>
            <div className="py-field">
              <label className="py-field-label">No. HP Darurat</label>
              <input className="py-input" placeholder="08xx-xxxx-xxxx" value={form.noHPDarurat} onChange={e => set("noHPDarurat", e.target.value)} />
            </div>
          </div>
          <div className="py-section-divider">Kamar & Kontrak</div>
          <div className="py-input-row">
            <div className="py-field">
              <label className="py-field-label">Tanggal Masuk (Check-in)</label>
              <input type="date" className="py-input" value={form.tglMasuk} onChange={e => set("tglMasuk", e.target.value)} />
            </div>
            <div className="py-field">
              <label className="py-field-label">Kamar <span>*</span></label>
              <select className="py-input" value={form.kamarId} onChange={e => set("kamarId", e.target.value)}>
                <option value="">Pilih kamar...</option>
                {kamarList.filter(k => k.status === "tersedia" || k.status === "booked" || k.id === penyewa?.kamarId).map(k => (
                  <option key={k.id} value={k.id}>Kamar {k.id} — {k.tipe} ({k.status})</option>
                ))}
              </select>
            </div>
          </div>
          <div className="py-input-row">
            <div className="py-field">
              <label className="py-field-label">Mulai Kontrak <span>*</span></label>
              <input type="date" className="py-input" value={form.kontrakMulai} onChange={e => handleMulai(e.target.value)} />
            </div>
            <div className="py-field">
              <label className="py-field-label">Durasi</label>
              <select className="py-input" value={form.durasi} onChange={e => handleDurasi(e.target.value)}>
                <option value="1">1 bulan</option>
                <option value="3">3 bulan</option>
                <option value="6">6 bulan</option>
                <option value="12">12 bulan</option>
              </select>
            </div>
          </div>
          {form.kontrakSelesai && (
            <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 8, padding: "8px 12px", fontSize: 11, color: "#15803d", marginBottom: 12 }}>
              ✅ Kontrak selesai: <b>{form.kontrakSelesai}</b>
            </div>
          )}
          {!isEdit && (
            <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8, padding: "8px 12px", fontSize: 11, color: "#1d4ed8", marginBottom: 12 }}>
              🏠 Menyimpan data ini akan otomatis <b>Check-in</b> penyewa & mengubah status kamar menjadi <b>terisi</b>.
            </div>
          )}
          <div className="py-section-divider">Partner / Penghuni Tambahan (maks 2)</div>
          {[0, 1].map(idx => (
            <div key={idx} style={{ background: "#f9fafb", borderRadius: 10, padding: "10px 12px", marginBottom: 8, border: "1px solid #e5e7eb" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", marginBottom: 6 }}>Partner {idx + 1}</div>
              <div className="py-input-row">
                <div className="py-field" style={{ marginBottom: 0 }}>
                  <label className="py-field-label">Nama</label>
                  <input className="py-input" placeholder={`Nama partner ${idx + 1}`} value={form.partner[idx]?.nama || ""} onChange={e => setPartner(idx, "nama", e.target.value)} />
                </div>
                <div className="py-field" style={{ marginBottom: 0 }}>
                  <label className="py-field-label">No. HP</label>
                  <input className="py-input" placeholder="08xx-xxxx-xxxx" value={form.partner[idx]?.noHP || ""} onChange={e => setPartner(idx, "noHP", e.target.value)} />
                </div>
              </div>
            </div>
          ))}
          <div className="py-field">
            <label className="py-field-label">Catatan</label>
            <textarea className="py-input" rows={2} placeholder="Catatan tambahan..." value={form.catatan} onChange={e => set("catatan", e.target.value)} style={{ resize: "none" }} />
          </div>
        </div>
        <div className="py-modal-foot">
          <button className="py-btn primary" onClick={() => {
            if (!valid) return;
            const partnerFilled = form.partner.filter(p => p.nama);
            onSave({
              id: penyewa?.id || Date.now(),
              ...form,
              partner: partnerFilled,
              checkinAt: penyewa?.checkinAt || new Date().toISOString(),
              isCheckedIn: true,
            });
            onClose();
          }} disabled={!valid}>
            {isEdit ? "Simpan Perubahan" : "✅ Simpan & Check-in"}
          </button>
          <button className="py-btn ghost" onClick={onClose}>Batal</button>
        </div>
      </div>
    </div>
  );
}

function DetailPanel({ penyewa, onEdit, onClose }) {
  const sisa    = hariSisa(penyewa.kontrakSelesai);
  const progres = progressKontrak(penyewa.kontrakMulai, penyewa.kontrakSelesai);
  const inisial = getInisial(penyewa.nama);
  return (
    <div className="py-widget">
      <div className="py-widget-head">
        <div className="py-widget-title">👤 Detail Penyewa</div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={onEdit} style={{ padding: "4px 10px", borderRadius: 7, border: "1.5px solid #e5e7eb", background: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer", color: "#374151" }}>✏️ Edit</button>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 16 }}>✕</button>
        </div>
      </div>
      <div className="py-detail">
        <div className="py-detail-header">
          <div className="py-detail-avatar">{inisial}</div>
          <div style={{ flex: 1 }}>
            <div className="py-detail-name">{penyewa.nama}</div>
            <div className="py-detail-sub">📞 {penyewa.noHP || "—"}</div>
            <div className="py-detail-badges">
              <span className="py-badge" style={{ background: "#fff7ed", color: "#ea580c" }}>🏠 Kamar {penyewa.kamarId}</span>
              {penyewa.partner?.length > 0 && <span className="py-badge" style={{ background: "#f3f4f6", color: "#6b7280" }}>👥 {penyewa.partner.length} partner</span>}
            </div>
          </div>
        </div>
        <div className="py-section">
          <div className="py-section-label">Kontrak Sewa</div>
          <div className="py-kontrak-bar">
            <div className="py-kontrak-dates">
              <span>{penyewa.kontrakMulai || "—"}</span>
              <span className="py-kontrak-arrow">→</span>
              <span style={{ color: sisa !== null && sisa <= 30 ? "#dc2626" : "#374151" }}>{penyewa.kontrakSelesai || "—"}</span>
            </div>
            <div className="py-progress"><div className="py-progress-fill" style={{ width: `${progres}%` }} /></div>
            {sisa !== null && (
              <div style={{ fontSize: 11, marginTop: 6, fontWeight: 500, color: sisa <= 7 ? "#dc2626" : sisa <= 30 ? "#d97706" : "#16a34a" }}>
                {sisa <= 0 ? "⚠️ Kontrak sudah habis!" : sisa <= 7 ? `🔴 ${sisa} hari lagi — segera tindak` : sisa <= 30 ? `⚠️ ${sisa} hari lagi` : `✅ ${sisa} hari tersisa`}
              </div>
            )}
          </div>
        </div>
        <div className="py-section">
          <div className="py-section-label">Informasi</div>
          <div className="py-info-grid">
            {[
              { key: "NIK / KTP",      val: penyewa.noKTP       || "—", cls: "mono" },
              { key: "Tanggal Masuk",  val: penyewa.tglMasuk    || "—", cls: "mono" },
              { key: "Nama Darurat",   val: penyewa.namaDarurat || "—" },
              { key: "No. Darurat",    val: penyewa.noHPDarurat || "—" },
              { key: "Durasi Kontrak", val: `${penyewa.durasi || "—"} bulan` },
              { key: "Status",         val: penyewa.isCheckedIn ? "✅ Check-in" : "⏳ Belum check-in", cls: "orange" },
            ].map((i,idx) => (
              <div key={idx} className="py-info-item">
                <div className="py-info-key">{i.key}</div>
                <div className={`py-info-val ${i.cls||""}`}>{i.val}</div>
              </div>
            ))}
          </div>
          {penyewa.alamat && (
            <div className="py-info-item" style={{ marginTop: 8 }}>
              <div className="py-info-key">Alamat</div>
              <div className="py-info-val" style={{ fontSize: 11, lineHeight: 1.5 }}>{penyewa.alamat}</div>
            </div>
          )}
        </div>
        {penyewa.partner?.length > 0 && (
          <div className="py-section">
            <div className="py-section-label">Partner / Penghuni Tambahan</div>
            {penyewa.partner.map((p, i) => (
              <div key={i} className="py-partner-item">
                <div className="py-partner-icon">👥</div>
                <div style={{ flex: 1 }}>
                  <div className="py-partner-name">{typeof p === "object" ? p.nama : p}</div>
                  {typeof p === "object" && p.noHP && <div style={{ fontSize: 11, color: "#9ca3af" }}>📞 {p.noHP}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
        {penyewa.catatan && (
          <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: "10px 12px", fontSize: 12, color: "#92400e", marginBottom: 14 }}>
            📝 {penyewa.catatan}
          </div>
        )}
        <div style={{ display: "flex", gap: 8 }}>
          <button className="py-btn primary" style={{ flex: 2 }}>📋 Perpanjang Kontrak</button>
          <button className="py-btn ghost"   style={{ flex: 1 }}>🚪 Check-out</button>
        </div>
      </div>
    </div>
  );
}

export default function Penyewa({ user }) {
  const [penyewaList, setPenyewaList] = useState([]);
  const [kamarList, setKamarList] = useState([]);
  const [selected,  setSelected]  = useState(null);
  const [showForm,  setShowForm]  = useState(false);
  const [editData,  setEditData]  = useState(null);
  const [search,    setSearch]    = useState("");
  const [filterKamar, setFK]      = useState("all");

  const isAdmin = user?.role === "superadmin" || user?.role === "admin";

  const filtered = penyewaList.filter(p => {
    if (filterKamar !== "all" && String(p.kamarId) !== filterKamar) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!p.nama?.toLowerCase().includes(q) && !String(p.kamarId).includes(q) && !p.noHP?.includes(q)) return false;
    }
    return true;
  });

  const kontrakHabis = penyewaList.filter(p => { const s = hariSisa(p.kontrakSelesai); return s !== null && s >= 0 && s <= 30; }).length;

  const handleSave = (data) => {
    const isNew = !editData;
    if (editData) {
      setPenyewaList(prev => prev.map(p => p.id === data.id ? data : p));
      if (selected?.id === data.id) setSelected(data);
    } else {
      setPenyewaList(prev => [...prev, data]);
    }
    // Auto check-in: ubah status kamar jadi "terisi" saat penyewa baru ditambahkan
    if (isNew && data.kamarId) {
      setKamarList(prev => prev.map(k => k.id === data.kamarId ? { ...k, status: "terisi" } : k));
    }
    setEditData(null);
  };

  return (
    <div className="py-wrap">
      <StyleInjector />
      <div className="py-cards">
        {[
          { label: "Total Penyewa Aktif", val: penyewaList.length || "—", color: "#3b82f6", sub: "Kontrak berjalan" },
          { label: "Kontrak Habis",       val: kontrakHabis || (penyewaList.length ? "0" : "—"), color: "#ef4444", sub: "≤ 30 hari ke depan" },
          { label: "Total Partner",       val: penyewaList.reduce((s,p) => s+(p.partner?.length||0),0) || (penyewaList.length?"0":"—"), color: "#f97316", sub: "Penghuni tambahan" },
          { label: "Kamar Terisi",        val: new Set(penyewaList.map(p=>p.kamarId)).size || (penyewaList.length?"0":"—"), color: "#16a34a", sub: "Dari total kamar" },
        ].map((c,i) => (
          <div key={i} className="py-card">
            <div className="py-card-bar" style={{ background: c.color }} />
            <div className="py-card-label">{c.label}</div>
            <div className="py-card-val">{c.val}</div>
            <div className="py-card-sub">{c.sub}</div>
          </div>
        ))}
      </div>
      <div className="py-layout">
        <div className="py-widget">
          <div className="py-widget-head">
            <div className="py-widget-title">👥 Daftar Penyewa</div>
            {isAdmin && (
              <button onClick={() => { setEditData(null); setShowForm(true); }} style={{ background: "linear-gradient(135deg,#f97316,#ea580c)", color: "#fff", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                + Tambah Penyewa
              </button>
            )}
          </div>
          <div className="py-filterbar">
            <div className="py-search">
              <span>🔍</span>
              <input className="py-search-input" placeholder="Cari nama, kamar, HP..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className={`py-tag ${filterKamar==="all"?"active":""}`} onClick={() => setFK("all")}>Semua</div>
            {[...new Set(penyewaList.map(p=>p.kamarId))].sort().map(k => (
              <div key={k} className={`py-tag ${filterKamar===String(k)?"active":""}`} onClick={() => setFK(String(k))}>K{padD(k)}</div>
            ))}
          </div>
          <div className="py-widget-body">
            {penyewaList.length === 0 ? (
              <div className="py-empty">
                <div className="py-empty-icon">👥</div>
                <div className="py-empty-title">Belum ada data penyewa</div>
                <div className="py-empty-sub">{isAdmin ? 'Klik "+ Tambah Penyewa" atau lakukan Check-in' : "Data penyewa akan muncul di sini"}</div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-empty">
                <div className="py-empty-icon">🔍</div>
                <div className="py-empty-title">Tidak ditemukan</div>
                <div className="py-empty-sub">Coba ubah kata kunci pencarian</div>
              </div>
            ) : (
              filtered.map(p => {
                const sisa = hariSisa(p.kontrakSelesai);
                return (
                  <div key={p.id} className={`py-item ${selected?.id===p.id?"selected":""}`} onClick={() => setSelected(p)}>
                    <div className="py-avatar">{getInisial(p.nama)}</div>
                    <div className="py-item-info">
                      <div className="py-item-name">{p.nama}</div>
                      <div className="py-item-meta">
                        <span>📞 {p.noHP||"—"}</span>
                        {p.partner?.length>0 && <span>👥 +{p.partner.length}</span>}
                      </div>
                    </div>
                    <div className="py-item-right">
                      <div className="py-item-kamar">K{padD(p.kamarId)}</div>
                      {sisa !== null && (
                        <div className="py-item-sisa" style={{ color: sisa<=7?"#dc2626":sisa<=30?"#d97706":"#9ca3af" }}>
                          {sisa<=0?"Habis!":`${sisa}h lagi`}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        {selected ? (
          <DetailPanel penyewa={selected} onEdit={() => { setEditData(selected); setShowForm(true); }} onClose={() => setSelected(null)} />
        ) : (
          <div className="py-widget">
            <div className="py-empty" style={{ padding: "60px 20px" }}>
              <div className="py-empty-icon">👤</div>
              <div className="py-empty-title">Pilih penyewa</div>
              <div className="py-empty-sub">Klik nama untuk melihat detail</div>
            </div>
          </div>
        )}
      </div>
      {showForm && (
        <FormPenyewa penyewa={editData} kamarList={kamarList} onClose={() => { setShowForm(false); setEditData(null); }} onSave={handleSave} />
      )}
    </div>
  );
}
