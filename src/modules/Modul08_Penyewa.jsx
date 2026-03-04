import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

// ============================================================
// CSS
// ============================================================
const CSS = `
  .py-wrap { display: flex; flex-direction: column; gap: 16px; }
  .py-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
  .py-card { background: #fff; border-radius: 12px; border: 1px solid #e5e7eb; padding: 14px 16px; position: relative; overflow: hidden; }
  .py-card-bar { position: absolute; top: 0; left: 0; right: 0; height: 3px; }
  .py-card-label { font-size: 10px; font-weight: 500; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 4px; margin-top: 8px; }
  .py-card-val { font-size: 22px; font-weight: 700; color: #111827; font-family: 'JetBrains Mono', monospace; }
  .py-card-sub { font-size: 11px; color: #6b7280; margin-top: 3px; }

  .py-layout { display: grid; grid-template-columns: 1fr 380px; gap: 14px; align-items: start; }
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
  .py-avatar { width: 40px; height: 40px; border-radius: 10px; flex-shrink: 0; background: linear-gradient(135deg, #f97316, #ea580c); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: #fff; }
  .py-item-info { flex: 1; min-width: 0; }
  .py-item-name { font-size: 13px; font-weight: 600; color: #1f2937; }
  .py-item-meta { font-size: 11px; color: #9ca3af; margin-top: 2px; display: flex; gap: 8px; flex-wrap: wrap; }
  .py-item-right { text-align: right; flex-shrink: 0; }
  .py-item-kamar { font-size: 13px; font-weight: 700; color: #111827; font-family: 'JetBrains Mono', monospace; }
  .py-item-sisa { font-size: 10px; margin-top: 2px; font-weight: 500; }

  .py-badge { display: inline-flex; align-items: center; gap: 3px; padding: 2px 8px; border-radius: 20px; font-size: 10px; font-weight: 600; }

  /* ─── DETAIL ──────────────────────────────── */
  .py-detail { padding: 16px; overflow-y: auto; max-height: calc(100vh - 220px); }
  .py-detail-header { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 16px; }
  .py-detail-avatar { width: 52px; height: 52px; border-radius: 12px; flex-shrink: 0; background: linear-gradient(135deg, #f97316, #ea580c); display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 700; color: #fff; }
  .py-detail-name { font-size: 17px; font-weight: 700; color: #111827; margin-bottom: 3px; }
  .py-detail-sub  { font-size: 11px; color: #9ca3af; }
  .py-detail-badges { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 6px; }

  .py-section { margin-bottom: 16px; }
  .py-section-label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: #9ca3af; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
  .py-section-label::after { content: ''; flex: 1; height: 1px; background: #f3f4f6; }
  .py-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .py-info-item { background: #f9fafb; border-radius: 8px; padding: 9px 11px; }
  .py-info-key { font-size: 10px; color: #9ca3af; font-weight: 500; text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 2px; }
  .py-info-val { font-size: 12px; font-weight: 600; color: #1f2937; }
  .py-info-val.mono { font-family: 'JetBrains Mono', monospace; font-size: 11px; }

  .py-kontrak-bar { background: linear-gradient(135deg, #fff7ed, #fff); border: 1px solid #fed7aa; border-radius: 10px; padding: 12px 14px; margin-bottom: 10px; }
  .py-kontrak-dates { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 600; color: #374151; font-family: 'JetBrains Mono', monospace; margin-bottom: 8px; }
  .py-kontrak-arrow { color: #f97316; }
  .py-progress { height: 6px; background: #f3f4f6; border-radius: 3px; overflow: hidden; }
  .py-progress-fill { height: 100%; border-radius: 3px; background: linear-gradient(90deg, #f97316, #16a34a); transition: width 0.3s; }

  .py-partner-item { display: flex; align-items: center; gap: 8px; padding: 8px 10px; background: #f9fafb; border-radius: 8px; margin-bottom: 6px; }
  .py-partner-icon { width: 28px; height: 28px; border-radius: 7px; background: #e5e7eb; display: flex; align-items: center; justify-content: center; font-size: 13px; }
  .py-partner-name { font-size: 12px; font-weight: 500; color: #374151; }

  /* ─── MODAL ───────────────────────────────── */
  .py-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(17,24,39,0.65); backdrop-filter: blur(4px); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 16px; animation: pyFade 0.18s ease; box-sizing: border-box; }
  .py-overlay-portal { position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; background: rgba(17,24,39,0.65) !important; backdrop-filter: blur(4px) !important; z-index: 9999 !important; display: flex !important; align-items: center !important; justify-content: center !important; padding: 16px !important; box-sizing: border-box !important; animation: pyFade 0.18s ease; }
  @keyframes pyFade { from { opacity: 0; } to { opacity: 1; } }
  .py-modal { background: #fff; border-radius: 16px; width: 100%; max-width: 580px; max-height: 92vh; overflow-y: auto; box-shadow: 0 24px 64px rgba(0,0,0,0.18); animation: pySlide 0.2s cubic-bezier(0.4,0,0.2,1); }
  @keyframes pySlide { from { transform: translateY(18px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .py-modal-head { padding: 16px 20px 12px; border-bottom: 1px solid #f3f4f6; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; background: #fff; z-index: 1; }
  .py-modal-title { font-size: 14px; font-weight: 700; color: #111827; }
  .py-modal-close { width: 28px; height: 28px; border-radius: 7px; background: #f3f4f6; border: none; cursor: pointer; font-size: 14px; color: #6b7280; display: flex; align-items: center; justify-content: center; }
  .py-modal-close:hover { background: #fee2e2; color: #dc2626; }
  .py-modal-body { padding: 18px 20px; }
  .py-modal-foot { padding: 12px 20px; border-top: 1px solid #f3f4f6; display: flex; gap: 8px; }

  /* Steps */
  .py-steps { display: flex; align-items: center; gap: 0; margin-bottom: 20px; }
  .py-step { display: flex; align-items: center; gap: 6px; flex: 1; }
  .py-step-num { width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; transition: all 0.2s; }
  .py-step-num.done   { background: #16a34a; color: #fff; }
  .py-step-num.active { background: #f97316; color: #fff; }
  .py-step-num.idle   { background: #f3f4f6; color: #9ca3af; }
  .py-step-label { font-size: 10px; font-weight: 600; color: #9ca3af; }
  .py-step-label.active { color: #ea580c; }
  .py-step-line { flex: 1; height: 2px; background: #f3f4f6; margin: 0 6px; }
  .py-step-line.done { background: #16a34a; }

  .py-field { margin-bottom: 13px; }
  .py-field-label { font-size: 11px; font-weight: 600; color: #374151; margin-bottom: 5px; display: flex; align-items: center; gap: 4px; }
  .py-field-req { color: #ef4444; }
  .py-input { width: 100%; padding: 8px 11px; border-radius: 8px; border: 1.5px solid #e5e7eb; font-size: 12px; font-family: inherit; color: #1f2937; outline: none; background: #fff; transition: border-color 0.12s; box-sizing: border-box; }
  .py-input:focus { border-color: #f97316; }
  .py-input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .py-input-row3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }

  .py-divider { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af; margin: 16px 0 12px; display: flex; align-items: center; gap: 6px; }
  .py-divider::after { content: ''; flex: 1; height: 1px; background: #f3f4f6; }

  /* KTP Upload */
  .py-ktp-upload { border: 2px dashed #e5e7eb; border-radius: 10px; padding: 20px; text-align: center; cursor: pointer; transition: all 0.15s; }
  .py-ktp-upload:hover { border-color: #f97316; background: #fff7ed; }
  .py-ktp-upload.has-file { border-color: #16a34a; background: #f0fdf4; border-style: solid; }

  /* Kamar selector */
  .py-kamar-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
  .py-kamar-opt { padding: 8px 6px; border-radius: 8px; border: 1.5px solid #e5e7eb; text-align: center; cursor: pointer; transition: all 0.12s; }
  .py-kamar-opt:hover { border-color: #fed7aa; }
  .py-kamar-opt.selected { background: #fff7ed; border-color: #f97316; }
  .py-kamar-opt.unavailable { opacity: 0.35; cursor: not-allowed; }
  .py-kamar-num { font-size: 13px; font-weight: 700; color: #111827; }
  .py-kamar-tipe { font-size: 9px; color: #9ca3af; margin-top: 1px; }
  .py-kamar-harga { font-size: 10px; color: #f97316; font-weight: 600; margin-top: 2px; }

  /* Summary box */
  .py-summary { background: linear-gradient(135deg, #fff7ed, #fffbf7); border: 1.5px solid #fed7aa; border-radius: 12px; padding: 16px; }
  .py-summary-row { display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid #fde8c8; font-size: 12px; }
  .py-summary-row:last-child { border-bottom: none; }
  .py-summary-key { color: #9a3412; font-weight: 500; }
  .py-summary-val { color: #111827; font-weight: 600; }
  .py-summary-val.orange { color: #ea580c; }

  .py-btn { flex: 1; padding: 9px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; border: none; cursor: pointer; font-family: inherit; transition: all 0.15s; display: flex; align-items: center; justify-content: center; gap: 5px; }
  .py-btn.primary { background: linear-gradient(135deg, #f97316, #ea580c); color: #fff; box-shadow: 0 3px 10px rgba(249,115,22,0.25); }
  .py-btn.success { background: linear-gradient(135deg, #16a34a, #15803d); color: #fff; box-shadow: 0 3px 10px rgba(22,163,74,0.25); }
  .py-btn.ghost { background: #f3f4f6; color: #4b5563; }
  .py-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .py-btn:hover:not(:disabled) { filter: brightness(1.04); transform: translateY(-1px); }

  /* Success */
  .py-success { text-align: center; padding: 20px 0; }
  .py-success-icon { font-size: 52px; margin-bottom: 10px; }
  .py-success-title { font-size: 18px; font-weight: 700; color: #111827; margin-bottom: 6px; }
  .py-success-sub { font-size: 13px; color: #6b7280; margin-bottom: 20px; }
  .py-success-actions { display: flex; gap: 8px; justify-content: center; }

  .py-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 50px 16px; color: #9ca3af; text-align: center; gap: 8px; }
  .py-empty-icon { font-size: 36px; opacity: 0.4; }
  .py-empty-title { font-size: 14px; font-weight: 600; color: #374151; }
  .py-empty-sub { font-size: 12px; }

  @media (max-width: 1024px) { .py-layout { grid-template-columns: 1fr; } }
  @media (max-width: 768px)  { .py-cards { grid-template-columns: repeat(2, 1fr); } .py-kamar-grid { grid-template-columns: repeat(3,1fr); } }
  @media (max-width: 480px)  { .py-cards { grid-template-columns: repeat(2, 1fr); gap: 8px; } .py-input-row { grid-template-columns: 1fr; } .py-input-row3 { grid-template-columns: 1fr 1fr; } .py-kamar-grid { grid-template-columns: repeat(3,1fr); } }
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
// CHECKIN MODAL — 3 STEPS
// ============================================================
const STEPS = ["Data Penyewa", "Kamar & Kontrak", "Konfirmasi"];

function CheckinModal({ kamarList, onClose, onCheckin }) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [ktpFile, setKtpFile] = useState(null);

  const [form, setForm] = useState({
    // Step 1
    nama: "", nik: "", jenisKelamin: "L", tglLahir: "",
    noHP: "", noHPDarurat: "", namaDarurat: "",
    alamat: "", pekerjaan: "",
    partner1: "", partner2: "",
    // Step 2
    kamarId: "", durasi: "6", kontrakMulai: todayStr, kontrakSelesai: "",
  });

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleKamar = (id) => {
    set("kamarId", id);
  };
  const handleDurasi = (dur) => {
    set("durasi", dur);
    if (form.kontrakMulai) set("kontrakSelesai", addMonths(form.kontrakMulai, dur));
  };
  const handleMulai = (tgl) => {
    set("kontrakMulai", tgl);
    if (form.durasi) set("kontrakSelesai", addMonths(tgl, form.durasi));
  };

  useEffect(() => {
    if (form.kontrakMulai && form.durasi)
      set("kontrakSelesai", addMonths(form.kontrakMulai, form.durasi));
  }, []);

  const kamarDipilih = kamarList.find(k => k.id === form.kamarId);
  const validStep0 = form.nama && form.nik && form.noHP && form.tglLahir && form.alamat;
  const validStep1 = form.kamarId && form.kontrakMulai && form.kontrakSelesai;

  const handleFinish = () => {
    const data = {
      id: Date.now(),
      ...form,
      partner: [form.partner1, form.partner2].filter(Boolean),
      ktpFile: ktpFile?.name || null,
      tglCheckin: todayStr,
      status: "aktif",
    };
    onCheckin(data);
    setDone(true);
  };

  if (done) return createPortal(
    <div className="py-overlay-portal" onClick={onClose}>
      <div className="py-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 440 }}>
        <div className="py-modal-body">
          <div className="py-success">
            <div className="py-success-icon">🎉</div>
            <div className="py-success-title">Check-in Berhasil!</div>
            <div className="py-success-sub">
              <b>{form.nama}</b> telah check-in di Kamar {form.kamarId}.<br />
              Status kamar diperbarui → <b>Terisi</b>.<br />
              Tagihan pertama telah dibuat.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%", maxWidth: 300, margin: "0 auto" }}>
              <button className="py-btn primary" onClick={() => alert("Generate PDF Surat Perjanjian...")}>
                📄 Download Surat Perjanjian
              </button>
              <button className="py-btn ghost" onClick={onClose}>Tutup</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  , document.body);

  return createPortal(
    <div className="py-overlay-portal" onClick={onClose}>
      <div className="py-modal" onClick={e => e.stopPropagation()}>
        <div className="py-modal-head">
          <div className="py-modal-title">🔑 Check-in Penyewa Baru</div>
          <button className="py-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="py-modal-body">

          {/* Steps indicator */}
          <div className="py-steps">
            {STEPS.map((s, i) => (
              <div key={i} className="py-step" style={{ flex: i < STEPS.length-1 ? "1" : "0 0 auto" }}>
                <div className={`py-step-num ${i < step ? "done" : i === step ? "active" : "idle"}`}>
                  {i < step ? "✓" : i + 1}
                </div>
                <div className={`py-step-label ${i === step ? "active" : ""}`}>{s}</div>
                {i < STEPS.length - 1 && <div className={`py-step-line ${i < step ? "done" : ""}`} />}
              </div>
            ))}
          </div>

          {/* ── STEP 0: Data Penyewa ── */}
          {step === 0 && (
            <div>
              <div className="py-divider">Identitas</div>
              <div className="py-field">
                <label className="py-field-label">Nama Lengkap <span className="py-field-req">*</span></label>
                <input className="py-input" placeholder="Sesuai KTP" value={form.nama} onChange={e => set("nama", e.target.value)} />
              </div>
              <div className="py-input-row">
                <div className="py-field">
                  <label className="py-field-label">NIK / No. KTP <span className="py-field-req">*</span></label>
                  <input className="py-input" placeholder="16 digit NIK" maxLength={16} value={form.nik} onChange={e => set("nik", e.target.value)} />
                </div>
                <div className="py-field">
                  <label className="py-field-label">Jenis Kelamin</label>
                  <select className="py-input" value={form.jenisKelamin} onChange={e => set("jenisKelamin", e.target.value)}>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
              </div>
              <div className="py-input-row">
                <div className="py-field">
                  <label className="py-field-label">Tanggal Lahir <span className="py-field-req">*</span></label>
                  <input type="date" className="py-input" value={form.tglLahir} onChange={e => set("tglLahir", e.target.value)} />
                </div>
                <div className="py-field">
                  <label className="py-field-label">Pekerjaan / Instansi</label>
                  <input className="py-input" placeholder="Mahasiswa, Karyawan..." value={form.pekerjaan} onChange={e => set("pekerjaan", e.target.value)} />
                </div>
              </div>
              <div className="py-field">
                <label className="py-field-label">Alamat Lengkap <span className="py-field-req">*</span></label>
                <textarea className="py-input" rows={2} placeholder="Jl. ..., Kelurahan, Kecamatan, Kota" value={form.alamat} onChange={e => set("alamat", e.target.value)} style={{ resize: "none" }} />
              </div>

              <div className="py-divider">Kontak</div>
              <div className="py-input-row">
                <div className="py-field">
                  <label className="py-field-label">No. HP Penyewa <span className="py-field-req">*</span></label>
                  <input className="py-input" placeholder="08xx-xxxx-xxxx" value={form.noHP} onChange={e => set("noHP", e.target.value)} />
                </div>
                <div className="py-field">
                  <label className="py-field-label">No. HP Darurat</label>
                  <input className="py-input" placeholder="08xx-xxxx-xxxx" value={form.noHPDarurat} onChange={e => set("noHPDarurat", e.target.value)} />
                </div>
              </div>
              <div className="py-field">
                <label className="py-field-label">Nama Kontak Darurat</label>
                <input className="py-input" placeholder="Nama orang tua / keluarga" value={form.namaDarurat} onChange={e => set("namaDarurat", e.target.value)} />
              </div>

              <div className="py-divider">Foto KTP</div>
              <div
                className={`py-ktp-upload ${ktpFile ? "has-file" : ""}`}
                onClick={() => document.getElementById("ktp-input").click()}
              >
                <input id="ktp-input" type="file" accept="image/*,.pdf" style={{ display: "none" }} onChange={e => setKtpFile(e.target.files[0])} />
                {ktpFile ? (
                  <div style={{ fontSize: 13, color: "#15803d", fontWeight: 600 }}>✅ {ktpFile.name}</div>
                ) : (
                  <div>
                    <div style={{ fontSize: 24, marginBottom: 6 }}>🪪</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280" }}>Klik untuk upload foto KTP</div>
                    <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 2 }}>JPG, PNG, atau PDF</div>
                  </div>
                )}
              </div>

              <div className="py-divider">Partner (maks 2)</div>
              <div className="py-input-row">
                <div className="py-field">
                  <label className="py-field-label">Partner 1</label>
                  <input className="py-input" placeholder="Nama partner 1" value={form.partner1} onChange={e => set("partner1", e.target.value)} />
                </div>
                <div className="py-field">
                  <label className="py-field-label">Partner 2</label>
                  <input className="py-input" placeholder="Nama partner 2" value={form.partner2} onChange={e => set("partner2", e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 1: Kamar & Kontrak ── */}
          {step === 1 && (
            <div>
              <div className="py-divider">Pilih Kamar</div>
              {kamarList.length === 0 ? (
                <div style={{ fontSize: 12, color: "#9ca3af", padding: "12px 0" }}>Belum ada data kamar — tambah di Pengaturan → Profil Kost</div>
              ) : (
                <div className="py-kamar-grid">
                  {kamarList.map(k => {
                    const avail = k.status === "tersedia" || k.status === "booked";
                    return (
                      <div
                        key={k.id}
                        className={`py-kamar-opt ${form.kamarId === k.id ? "selected" : ""} ${!avail ? "unavailable" : ""}`}
                        onClick={() => avail && handleKamar(k.id)}
                        title={!avail ? `Status: ${k.status}` : `Kamar ${k.id}`}
                      >
                        <div className="py-kamar-num">K{padD(k.id)}</div>
                        <div className="py-kamar-tipe">{k.tipe}</div>
                        <div className="py-kamar-harga">{fmtRp(k.harga)}</div>
                      </div>
                    );
                  })}
                </div>
              )}
              {kamarDipilih && (
                <div style={{ marginTop: 8, padding: "8px 12px", background: "#fff7ed", borderRadius: 8, fontSize: 12, color: "#92400e", fontWeight: 500 }}>
                  ✅ Kamar {kamarDipilih.id} — {kamarDipilih.tipe} · {fmtRp(kamarDipilih.harga)}/bulan
                </div>
              )}

              <div className="py-divider">Durasi Kontrak</div>
              <div className="py-input-row">
                <div className="py-field">
                  <label className="py-field-label">Mulai Kontrak <span className="py-field-req">*</span></label>
                  <input type="date" className="py-input" value={form.kontrakMulai} onChange={e => handleMulai(e.target.value)} />
                </div>
                <div className="py-field">
                  <label className="py-field-label">Durasi</label>
                  <select className="py-input" value={form.durasi} onChange={e => handleDurasi(e.target.value)}>
                    <option value="3">3 bulan</option>
                    <option value="6">6 bulan</option>
                    <option value="12">12 bulan</option>
                  </select>
                </div>
              </div>
              {form.kontrakSelesai && (
                <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 8, padding: "9px 12px", fontSize: 12, color: "#15803d", fontWeight: 500 }}>
                  ✅ Kontrak berakhir: <b>{form.kontrakSelesai}</b>
                </div>
              )}
            </div>
          )}

          {/* ── STEP 2: Konfirmasi ── */}
          {step === 2 && (
            <div>
              <div style={{ marginBottom: 14, padding: "10px 14px", background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 10, fontSize: 12, color: "#15803d", fontWeight: 500 }}>
                ✅ Periksa kembali data sebelum konfirmasi. Setelah disimpan, kamar akan langsung berstatus <b>Terisi</b> dan tagihan pertama dibuat.
              </div>
              <div className="py-summary">
                {[
                  { k: "Nama",          v: form.nama },
                  { k: "NIK",           v: form.nik || "—" },
                  { k: "Jenis Kelamin", v: form.jenisKelamin === "L" ? "Laki-laki" : "Perempuan" },
                  { k: "Tanggal Lahir", v: form.tglLahir || "—" },
                  { k: "No. HP",        v: form.noHP },
                  { k: "Kontak Darurat",v: `${form.namaDarurat || "—"} (${form.noHPDarurat || "—"})` },
                  { k: "Alamat",        v: form.alamat },
                  { k: "Pekerjaan",     v: form.pekerjaan || "—" },
                  { k: "Partner",       v: [form.partner1, form.partner2].filter(Boolean).join(", ") || "—" },
                  { k: "Kamar",         v: `Kamar ${form.kamarId} — ${kamarDipilih?.tipe || ""}`, cls: "orange" },
                  { k: "Kontrak",       v: `${form.kontrakMulai} → ${form.kontrakSelesai} (${form.durasi} bln)`, cls: "orange" },
                  { k: "Tagihan/bln",   v: fmtRp(kamarDipilih?.harga), cls: "orange" },
                  { k: "Foto KTP",      v: ktpFile ? `✅ ${ktpFile.name}` : "Belum diupload" },
                ].map((r, i) => (
                  <div key={i} className="py-summary-row">
                    <span className="py-summary-key">{r.k}</span>
                    <span className={`py-summary-val ${r.cls || ""}`} style={{ textAlign: "right", maxWidth: "60%" }}>{r.v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        <div className="py-modal-foot">
          {step > 0 && <button className="py-btn ghost" style={{ flex: "0 0 80px" }} onClick={() => setStep(s => s-1)}>← Kembali</button>}
          {step < 2 ? (
            <button className="py-btn primary"
              disabled={step === 0 ? !validStep0 : !validStep1}
              onClick={() => setStep(s => s+1)}>
              Lanjut →
            </button>
          ) : (
            <button className="py-btn success" onClick={handleFinish}>
              ✅ Konfirmasi Check-in
            </button>
          )}
        </div>
      </div>
    </div>
  , document.body);
}

// ============================================================
// DETAIL PANEL
// ============================================================
function DetailPanel({ penyewa, onEdit, onClose }) {
  const sisa    = hariSisa(penyewa.kontrakSelesai);
  const progres = progressKontrak(penyewa.kontrakMulai, penyewa.kontrakSelesai);
  return (
    <div className="py-widget">
      <div className="py-widget-head">
        <div className="py-widget-title">👤 Detail Penyewa</div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={onEdit} style={{ padding: "4px 10px", borderRadius: 7, border: "1.5px solid #e5e7eb", background: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>✏️ Edit</button>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 16 }}>✕</button>
        </div>
      </div>
      <div className="py-detail">
        {/* Header */}
        <div className="py-detail-header">
          <div className="py-detail-avatar">{getInisial(penyewa.nama)}</div>
          <div style={{ flex: 1 }}>
            <div className="py-detail-name">{penyewa.nama}</div>
            <div className="py-detail-sub">📞 {penyewa.noHP || "—"} · {penyewa.pekerjaan || "—"}</div>
            <div className="py-detail-badges">
              <span className="py-badge" style={{ background: "#fff7ed", color: "#ea580c" }}>🏠 Kamar {penyewa.kamarId}</span>
              {penyewa.partner?.length > 0 && <span className="py-badge" style={{ background: "#f3f4f6", color: "#6b7280" }}>👥 +{penyewa.partner.length} partner</span>}
              <span className="py-badge" style={{ background: "#f3f4f6", color: "#6b7280" }}>{penyewa.jenisKelamin === "L" ? "♂" : "♀"}</span>
            </div>
          </div>
        </div>

        {/* Kontrak */}
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
                {sisa <= 0 ? "⚠️ Kontrak habis!" : sisa <= 7 ? `🔴 ${sisa} hari lagi` : sisa <= 30 ? `⚠️ ${sisa} hari lagi` : `✅ ${sisa} hari tersisa`}
              </div>
            )}
          </div>
        </div>

        {/* Info Grid */}
        <div className="py-section">
          <div className="py-section-label">Identitas & Kontak</div>
          <div className="py-info-grid">
            {[
              { k: "NIK / KTP",      v: penyewa.nik           || "—", mono: true },
              { k: "Tanggal Lahir",  v: penyewa.tglLahir      || "—" },
              { k: "Alamat",         v: penyewa.alamat         || "—" },
              { k: "No. Darurat",    v: penyewa.noHPDarurat    || "—" },
              { k: "Nama Darurat",   v: penyewa.namaDarurat    || "—" },
              { k: "Foto KTP",       v: penyewa.ktpFile ? `✅ ${penyewa.ktpFile}` : "Belum diupload" },
            ].map((i, idx) => (
              <div key={idx} className="py-info-item" style={i.k === "Alamat" ? { gridColumn: "1 / -1" } : {}}>
                <div className="py-info-key">{i.k}</div>
                <div className={`py-info-val ${i.mono ? "mono" : ""}`} style={{ wordBreak: "break-word" }}>{i.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Partner */}
        {penyewa.partner?.length > 0 && (
          <div className="py-section">
            <div className="py-section-label">Partner</div>
            {penyewa.partner.map((p, i) => (
              <div key={i} className="py-partner-item">
                <div className="py-partner-icon">👥</div>
                <div className="py-partner-name">{p}</div>
              </div>
            ))}
          </div>
        )}

        {/* Aksi */}
        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
          <button className="py-btn primary" style={{ flex: 2 }}>📋 Perpanjang</button>
          <button className="py-btn ghost"   style={{ flex: 1 }}>🚪 Check-out</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN
// ============================================================
export default function Penyewa({ user }) {
  const [penyewaList, setPenyewaList] = useState([]);
  const kamarList = []; // dari Supabase nanti
  const [selected,  setSelected]  = useState(null);
  const [showForm,  setShowForm]  = useState(false);
  const [search,    setSearch]    = useState("");
  const [filterK,   setFilterK]   = useState("all");

  const isAdmin = user?.role === "superadmin" || user?.role === "admin";

  const filtered = penyewaList.filter(p => {
    if (filterK !== "all" && String(p.kamarId) !== filterK) return false;
    if (search) {
      const q = search.toLowerCase();
      return p.nama?.toLowerCase().includes(q) || String(p.kamarId).includes(q) || p.noHP?.includes(q) || p.nik?.includes(q);
    }
    return true;
  });

  const kontrakHabis = penyewaList.filter(p => { const s = hariSisa(p.kontrakSelesai); return s !== null && s >= 0 && s <= 30; }).length;

  const handleCheckin = (data) => {
    setPenyewaList(prev => [...prev, data]);
    setShowForm(false);
  };

  return (
    <div className="py-wrap">
      <StyleInjector />

      {/* Cards */}
      <div className="py-cards">
        {[
          { label: "Total Penyewa",    val: penyewaList.length || "—",    color: "#3b82f6", sub: "Kontrak aktif" },
          { label: "Kontrak Habis",    val: kontrakHabis || (penyewaList.length ? "0" : "—"), color: "#ef4444", sub: "≤ 30 hari" },
          { label: "Total Penghuni",   val: penyewaList.reduce((s,p) => s+1+(p.partner?.length||0), 0) || "—", color: "#f97316", sub: "Termasuk partner" },
          { label: "Kamar Terisi",     val: new Set(penyewaList.map(p=>p.kamarId)).size || (penyewaList.length ? "0" : "—"), color: "#16a34a", sub: "Unit berpenghuni" },
        ].map((c, i) => (
          <div key={i} className="py-card">
            <div className="py-card-bar" style={{ background: c.color }} />
            <div className="py-card-label">{c.label}</div>
            <div className="py-card-val">{c.val}</div>
            <div className="py-card-sub">{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Layout */}
      <div className="py-layout">
        <div className="py-widget">
          <div className="py-widget-head">
            <div className="py-widget-title">👥 Data Penyewa</div>
            {isAdmin && (
              <button onClick={() => setShowForm(true)} style={{ background: "linear-gradient(135deg,#f97316,#ea580c)", color: "#fff", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                🔑 Check-in Baru
              </button>
            )}
          </div>

          <div className="py-filterbar">
            <div className="py-search">
              <span>🔍</span>
              <input className="py-search-input" placeholder="Cari nama, NIK, kamar..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className={`py-tag ${filterK==="all"?"active":""}`} onClick={() => setFilterK("all")}>Semua</div>
            {[...new Set(penyewaList.map(p=>p.kamarId))].sort().map(k => (
              <div key={k} className={`py-tag ${filterK===String(k)?"active":""}`} onClick={() => setFilterK(String(k))}>K{padD(k)}</div>
            ))}
          </div>

          <div className="py-widget-body">
            {penyewaList.length === 0 ? (
              <div className="py-empty">
                <div className="py-empty-icon">👥</div>
                <div className="py-empty-title">Belum ada data penyewa</div>
                <div className="py-empty-sub">{isAdmin ? 'Klik "🔑 Check-in Baru" untuk menambahkan penyewa' : "Data penyewa akan muncul di sini"}</div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-empty">
                <div className="py-empty-icon">🔍</div>
                <div className="py-empty-title">Tidak ditemukan</div>
                <div className="py-empty-sub">Coba ubah kata kunci</div>
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
                        <span>🪪 {p.nik ? p.nik.slice(0,8)+"..." : "—"}</span>
                        {p.partner?.length > 0 && <span>👥 +{p.partner.length}</span>}
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
          <DetailPanel penyewa={selected} onEdit={() => {}} onClose={() => setSelected(null)} />
        ) : (
          <div className="py-widget">
            <div className="py-empty" style={{ padding: "60px 20px" }}>
              <div className="py-empty-icon">👤</div>
              <div className="py-empty-title">Pilih penyewa</div>
              <div className="py-empty-sub">Klik nama untuk melihat detail lengkap</div>
            </div>
          </div>
        )}
      </div>

      {showForm && (
        <CheckinModal kamarList={kamarList} onClose={() => setShowForm(false)} onCheckin={handleCheckin} />
      )}
    </div>
  );
}
