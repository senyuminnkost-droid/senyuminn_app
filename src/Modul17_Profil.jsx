import { useState, useEffect } from "react";

// ============================================================
// CSS
// ============================================================
const CSS = `
  .pf-wrap { display:flex; flex-direction:column; gap:16px; }

  .pf-overview-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  .pf-overview-grid.three { grid-template-columns:1fr 1fr 1fr; }

  .pf-section-card { background:#fff; border-radius:12px; border:1px solid #e5e7eb; overflow:hidden; }
  .pf-section-head { padding:13px 16px 11px; border-bottom:1px solid #f3f4f6; display:flex; align-items:center; justify-content:space-between; }
  .pf-section-title { font-size:12px; font-weight:700; color:#111827; display:flex; align-items:center; gap:6px; }
  .pf-section-body { padding:14px 16px; display:flex; flex-direction:column; gap:8px; }

  .pf-row { display:flex; align-items:flex-start; justify-content:space-between; gap:8px; padding:4px 0; border-bottom:1px solid #f9fafb; }
  .pf-row:last-child { border-bottom:none; }
  .pf-row-label { font-size:11px; color:#9ca3af; min-width:120px; flex-shrink:0; padding-top:1px; }
  .pf-row-val { font-size:12px; font-weight:600; color:#1f2937; text-align:right; flex:1; word-break:break-word; }
  .pf-row-val.orange { color:#f97316; }
  .pf-row-val.mono { font-family:'JetBrains Mono',monospace; }

  .pf-edit-btn { display:inline-flex; align-items:center; gap:4px; padding:4px 10px; background:#f3f4f6; border:none; border-radius:6px; font-size:11px; font-weight:600; color:#4b5563; cursor:pointer; font-family:inherit; transition:all .12s; flex-shrink:0; }
  .pf-edit-btn:hover { background:#e5e7eb; color:#1f2937; }

  .pf-rek-card { display:flex; align-items:center; gap:10px; padding:10px 12px; background:#f9fafb; border:1.5px solid #e5e7eb; border-radius:9px; }
  .pf-rek-icon { width:34px; height:34px; border-radius:8px; background:linear-gradient(135deg,#f97316,#ea580c); display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700; color:#fff; flex-shrink:0; }
  .pf-rek-info { flex:1; min-width:0; }
  .pf-rek-name { font-size:12px; font-weight:600; color:#1f2937; }
  .pf-rek-no { font-size:11px; color:#9ca3af; font-family:'JetBrains Mono',monospace; }
  .pf-rek-badge { padding:2px 8px; border-radius:20px; font-size:10px; font-weight:700; color:#f97316; background:#fff7ed; border:1px solid #fed7aa; flex-shrink:0; }

  .pf-tag { padding:3px 10px; border-radius:20px; font-size:11px; font-weight:600; }

  .pf-btn { display:inline-flex; align-items:center; gap:5px; padding:8px 14px; border-radius:8px; font-size:12px; font-weight:600; border:none; cursor:pointer; font-family:inherit; transition:all .15s; }
  .pf-btn.primary { background:linear-gradient(135deg,#f97316,#ea580c); color:#fff; }
  .pf-btn.ghost { background:#f3f4f6; color:#4b5563; }
  .pf-btn.danger { background:#fee2e2; color:#dc2626; }

  .pf-overlay { position:fixed !important; inset:0 !important; background:rgba(17,24,39,.55) !important; z-index:9999 !important; display:flex !important; align-items:center !important; justify-content:center !important; padding:16px !important; box-sizing:border-box !important; }
  .pf-modal { background:#fff; border-radius:14px; width:100%; max-width:460px; max-height:85vh; display:flex; flex-direction:column; box-shadow:0 20px 60px rgba(0,0,0,.18); }
  .pf-modal-head { padding:14px 18px 12px; border-bottom:1px solid #f3f4f6; display:flex; align-items:center; justify-content:space-between; flex-shrink:0; }
  .pf-modal-title { font-size:14px; font-weight:700; color:#111827; }
  .pf-modal-body { padding:16px 18px; flex:1; overflow-y:auto; display:flex; flex-direction:column; gap:12px; }
  .pf-modal-foot { padding:11px 18px; border-top:1px solid #f3f4f6; display:flex; gap:8px; justify-content:flex-end; flex-shrink:0; }

  .pf-field { display:flex; flex-direction:column; gap:4px; }
  .pf-label { font-size:11px; font-weight:600; color:#374151; text-transform:uppercase; letter-spacing:.4px; }
  .pf-input { padding:9px 11px; border-radius:8px; border:1.5px solid #e5e7eb; font-size:12px; font-family:inherit; color:#1f2937; outline:none; background:#fff; width:100%; box-sizing:border-box; transition:border-color .12s; }
  .pf-input:focus { border-color:#f97316; }
  .pf-input.mono { font-family:'JetBrains Mono',monospace; }
  .pf-grid2 { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
  .pf-hint { font-size:10px; color:#9ca3af; margin-top:2px; }

  .pf-info-box { background:#f0fdf4; border:1px solid #86efac; border-radius:8px; padding:9px 12px; font-size:11px; color:#15803d; }
  .pf-warn-box { background:#fff7ed; border:1px solid #fed7aa; border-radius:8px; padding:9px 12px; font-size:11px; color:#9a3412; }

  .pf-empty { text-align:center; padding:20px 0; color:#9ca3af; font-size:12px; }

  @media(max-width:768px) { .pf-overview-grid { grid-template-columns:1fr; } .pf-overview-grid.three { grid-template-columns:1fr; } }
`;

function StyleInjector() {
  useEffect(() => {
    const id = "senyuminn-profil-css";
    if (document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id; el.textContent = CSS;
    document.head.appendChild(el);
    return () => { const e=document.getElementById(id); if(e) e.remove(); };
  },[]);
  return null;
}

const fmtRp = (n) => n ? "Rp " + Number(n).toLocaleString("id-ID") : "—";
const val = (v, fallback="—") => v || fallback;

// ============================================================
// MODAL EDIT — generic
// ============================================================
function ModalEdit({ title, onClose, onSave, children, valid=true }) {
  return (
    <div className="pf-overlay" onClick={onClose}>
      <div className="pf-modal" onClick={e=>e.stopPropagation()}>
        <div className="pf-modal-head">
          <div className="pf-modal-title">✏️ {title}</div>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",fontSize:18,color:"#9ca3af"}}>✕</button>
        </div>
        <div className="pf-modal-body">{children}</div>
        <div className="pf-modal-foot">
          <button className="pf-btn ghost" onClick={onClose}>Batal</button>
          <button className="pf-btn primary" disabled={!valid} onClick={onSave}>✅ Simpan</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MODAL REKENING — input manual (no dropdown bank)
// ============================================================
function ModalRekening({ rek, onClose, onSave }) {
  const [form, setForm] = useState(rek || { namaBank:"", noRek:"", atasNama:"", keterangan:"", utama:false });
  const set = (k,v) => setForm(p=>({...p,[k]:v}));
  const valid = form.namaBank && form.noRek && form.atasNama;
  return (
    <div className="pf-overlay" onClick={onClose}>
      <div className="pf-modal" onClick={e=>e.stopPropagation()}>
        <div className="pf-modal-head">
          <div className="pf-modal-title">{rek?.id ? "✏️ Edit Rekening" : "➕ Tambah Rekening"}</div>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",fontSize:18,color:"#9ca3af"}}>✕</button>
        </div>
        <div className="pf-modal-body">
          <div className="pf-field">
            <label className="pf-label">Nama Bank</label>
            <input className="pf-input" placeholder="Contoh: BCA, BRI, Mandiri, Jenius..." value={form.namaBank} onChange={e=>set("namaBank",e.target.value)} autoFocus />
            <div className="pf-hint">Isi manual sesuai bank yang digunakan</div>
          </div>
          <div className="pf-field">
            <label className="pf-label">Nomor Rekening</label>
            <input className="pf-input mono" placeholder="1234567890" value={form.noRek} onChange={e=>set("noRek",e.target.value)} />
          </div>
          <div className="pf-field">
            <label className="pf-label">Atas Nama</label>
            <input className="pf-input" placeholder="Nama pemilik rekening..." value={form.atasNama} onChange={e=>set("atasNama",e.target.value)} />
          </div>
          <div className="pf-field">
            <label className="pf-label">Keterangan (opsional)</label>
            <input className="pf-input" placeholder="Contoh: Rekening operasional, THR saving..." value={form.keterangan} onChange={e=>set("keterangan",e.target.value)} />
          </div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 12px",background:"#f9fafb",border:"1px solid #e5e7eb",borderRadius:8}}>
            <div>
              <div style={{fontSize:12,fontWeight:600,color:"#1f2937"}}>Rekening Utama</div>
              <div style={{fontSize:11,color:"#9ca3af"}}>Default untuk terima pembayaran sewa</div>
            </div>
            <label style={{position:"relative",width:40,height:22,cursor:"pointer",flexShrink:0}}>
              <input type="checkbox" checked={form.utama} onChange={e=>set("utama",e.target.checked)} style={{opacity:0,width:0,height:0}} />
              <span style={{position:"absolute",inset:0,background:form.utama?"#f97316":"#e5e7eb",borderRadius:22,transition:".25s"}}>
                <span style={{position:"absolute",height:16,width:16,left:form.utama?22:3,bottom:3,background:"#fff",borderRadius:"50%",transition:".25s",boxShadow:"0 1px 3px rgba(0,0,0,.2)"}} />
              </span>
            </label>
          </div>
        </div>
        <div className="pf-modal-foot">
          <button className="pf-btn ghost" onClick={onClose}>Batal</button>
          <button className="pf-btn primary" disabled={!valid} onClick={()=>{ onSave({...form,id:rek?.id||Date.now()}); onClose(); }}>✅ Simpan</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// EXPORT DEFAULT
// ============================================================
export default function ProfilKost({ user, globalData = {} }) {
  const {
    pengaturanConfig = {}, setPengaturanConfig = ()=>{},
    isReadOnly = false,
  } = globalData;

  const cfg = pengaturanConfig;
  const update = (patch) => setPengaturanConfig(p=>({...p,...patch}));

  // Modal state — which section is being edited
  const [modal, setModal] = useState(null); // "profil"|"operasional"|"keuangan"|"hr"|"gps"|null
  const [rekModal, setRekModal] = useState(null); // null | {} | {id,...}

  // Local form state per modal
  const [form, setForm] = useState({});
  const setF = (k,v) => setForm(p=>({...p,[k]:v}));

  const openModal = (section) => {
    setForm({...cfg}); // load current config into form
    setModal(section);
  };

  const saveModal = () => {
    update(form);
    setModal(null);
  };

  // Rekening helpers
  const rekeningList = cfg.rekeningList || [];
  const saveRekening = (r) => {
    const existing = rekeningList.findIndex(x=>x.id===r.id);
    const newList = existing>=0
      ? rekeningList.map((x,i)=>i===existing?r:x)
      : [...rekeningList, r];
    update({ rekeningList: newList });
  };
  const deleteRekening = (id) => {
    if (!window.confirm("Hapus rekening ini?")) return;
    update({ rekeningList: rekeningList.filter(r=>r.id!==id) });
  };

  // ── Section card helper
  const Section = ({ title, icon, section, children, fullWidth }) => (
    <div className="pf-section-card" style={fullWidth?{gridColumn:"1/-1"}:{}}>
      <div className="pf-section-head">
        <div className="pf-section-title">{icon} {title}</div>
        {!isReadOnly && (
          <button className="pf-edit-btn" onClick={()=>openModal(section)}>✏️ Edit</button>
        )}
      </div>
      <div className="pf-section-body">{children}</div>
    </div>
  );

  const Row = ({ label, value, orange, mono }) => (
    <div className="pf-row">
      <span className="pf-row-label">{label}</span>
      <span className={`pf-row-val${orange?" orange":""}${mono?" mono":""}`}>{value||"—"}</span>
    </div>
  );

  return (
    <div className="pf-wrap">
      <StyleInjector />

      {/* ── OVERVIEW GRID ── */}
      <div className="pf-overview-grid">

        {/* Profil Kost */}
        <Section title="Profil Kost" icon="🏠" section="profil">
          <Row label="Nama Kost"    value={cfg.namaKost||"Senyum Inn"} />
          <Row label="Alamat"       value={cfg.alamat} />
          <Row label="No. Telepon"  value={cfg.telepon} />
          <Row label="Email"        value={cfg.email} />
          <Row label="Nama Direktur" value={cfg.namaDirektur} />
        </Section>

        {/* Operasional */}
        <Section title="Operasional" icon="⚙️" section="operasional">
          <Row label="Total Kamar"   value={cfg.totalKamar ? `${cfg.totalKamar} kamar` : "—"} />
          <Row label="Kamar Premium" value={cfg.nomorPremium || "—"} />
          <Row label="Kamar Reguler" value={cfg.nomorReguler || "—"} />
          <Row label="Jam Buka"      value={cfg.jamBuka ? `${cfg.jamBuka} – ${cfg.jamTutup}` : "—"} />
          <Row label="Parkir Motor"  value={cfg.parkirMotor ? `${cfg.parkirMotor} slot` : "—"} />
          <Row label="Parkir Mobil"  value={cfg.parkirMobil ? `${cfg.parkirMobil} slot (Premium)` : "—"} />
        </Section>

        {/* Keuangan */}
        <Section title="Keuangan & Tagihan" icon="💰" section="keuangan">
          <Row label="Batas Bayar"     value={cfg.batasBayar ? `Tanggal ${cfg.batasBayar}` : "—"} />
          <Row label="Toleransi"       value={cfg.toleransiHari ? `${cfg.toleransiHari} hari` : "—"} />
          <Row label="Denda Terlambat" value={cfg.dendaPerHari ? fmtRp(cfg.dendaPerHari)+"/hari" : "—"} orange />
          <Row label="Sewa Harian"     value={cfg.sewaHarian ? fmtRp(cfg.sewaHarian)+"/hari" : "—"} orange />
          <Row label="Mgmt Fee"        value={cfg.mgmtFeePct ? `${cfg.mgmtFeePct}%` : "—"} />
          <Row label="Deposit Jaminan" value={cfg.depositJaminan ? fmtRp(cfg.depositJaminan) : "Belum diaktifkan"} />
        </Section>

        {/* HR & Gaji */}
        <Section title="HR & Gaji" icon="👥" section="hr">
          <Row label="Lembur/Shift"    value={cfg.lemburPerShift ? fmtRp(cfg.lemburPerShift) : "—"} orange />
          <Row label="Denda Ijin TS"   value={cfg.dendaIjinTidakSah ? fmtRp(cfg.dendaIjinTidakSah)+"/hari" : "—"} orange />
          <Row label="Maks Pinjaman"   value={cfg.maxPinjamanKoperasi ? fmtRp(cfg.maxPinjamanKoperasi) : "—"} />
          <Row label="KPI Threshold"   value={cfg.kpiThresholdPct ? `≥ ${cfg.kpiThresholdPct}% kehadiran` : "—"} />
          <Row label="Bank Koperasi"   value={cfg.bankKoperasi} />
          <Row label="No. Rek Koperasi" value={cfg.rekeningKoperasi} mono />
        </Section>

        {/* GPS Absensi */}
        <Section title="GPS Absensi" icon="📍" section="gps">
          <Row label="Latitude"  value={cfg.gpsLat} mono />
          <Row label="Longitude" value={cfg.gpsLng} mono />
          <Row label="Radius"    value={cfg.gpsRadius ? `${cfg.gpsRadius} meter` : "500 meter (default)"} />
          {cfg.gpsLat && cfg.gpsLng && (
            <div className="pf-info-box" style={{marginTop:4}}>
              ✅ GPS aktif — staff harus dalam radius {cfg.gpsRadius||500}m untuk clock-in
            </div>
          )}
          {!cfg.gpsLat && (
            <div className="pf-warn-box" style={{marginTop:4}}>
              ⚠️ Koordinat GPS belum diset. Klik Edit untuk mengisi.
            </div>
          )}
        </Section>

        {/* Fasilitas Umum */}
        <Section title="Fasilitas Umum" icon="🏢" section="fasilitas">
          {(cfg.fasilitasUmum||[]).length === 0 ? (
            <div className="pf-empty">Belum ada fasilitas yang didefinisikan</div>
          ) : (
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {(cfg.fasilitasUmum||[]).map((f,i)=>(
                <span key={i} className="pf-tag" style={{background:"#f0fdf4",color:"#15803d",border:"1px solid #86efac"}}>✓ {f}</span>
              ))}
            </div>
          )}
        </Section>

      </div>

      {/* ── REKENING BANK ── */}
      <div className="pf-section-card">
        <div className="pf-section-head">
          <div className="pf-section-title">🏦 Rekening Bank Operasional</div>
          {!isReadOnly && (
            <button className="pf-edit-btn" onClick={()=>setRekModal({})}>➕ Tambah Rekening</button>
          )}
        </div>
        <div className="pf-section-body">
          {rekeningList.length === 0 ? (
            <div className="pf-empty">Belum ada rekening. Klik ➕ untuk menambah.</div>
          ) : (
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {rekeningList.map(r=>(
                <div key={r.id} className="pf-rek-card">
                  <div className="pf-rek-icon">{(r.namaBank||"?")[0]?.toUpperCase()}</div>
                  <div className="pf-rek-info">
                    <div className="pf-rek-name">{r.namaBank} — {r.atasNama}</div>
                    <div className="pf-rek-no">{r.noRek}</div>
                    {r.keterangan && <div style={{fontSize:10,color:"#9ca3af"}}>{r.keterangan}</div>}
                  </div>
                  {r.utama && <span className="pf-rek-badge">Utama</span>}
                  {!isReadOnly && (
                    <div style={{display:"flex",gap:6}}>
                      <button className="pf-btn ghost" style={{padding:"4px 9px",fontSize:11}} onClick={()=>setRekModal(r)}>✏️</button>
                      <button className="pf-btn danger" style={{padding:"4px 9px",fontSize:11}} onClick={()=>deleteRekening(r.id)}>🗑️</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          MODALS EDIT PER SECTION
      ══════════════════════════════════════════ */}

      {/* Modal Profil */}
      {modal==="profil" && (
        <ModalEdit title="Edit Profil Kost" onClose={()=>setModal(null)} onSave={saveModal}>
          <div className="pf-field"><label className="pf-label">Nama Kost</label>
            <input className="pf-input" value={form.namaKost||""} onChange={e=>setF("namaKost",e.target.value)} placeholder="Senyum Inn" /></div>
          <div className="pf-field"><label className="pf-label">Alamat Lengkap</label>
            <textarea className="pf-input" value={form.alamat||""} onChange={e=>setF("alamat",e.target.value)} placeholder="Jl. ..." rows={2} style={{resize:"vertical"}} /></div>
          <div className="pf-grid2">
            <div className="pf-field"><label className="pf-label">No. Telepon</label>
              <input className="pf-input" value={form.telepon||""} onChange={e=>setF("telepon",e.target.value)} placeholder="0812..." /></div>
            <div className="pf-field"><label className="pf-label">Email</label>
              <input className="pf-input" value={form.email||""} onChange={e=>setF("email",e.target.value)} placeholder="info@..." /></div>
          </div>
          <div className="pf-field"><label className="pf-label">Nama Direktur / Owner</label>
            <input className="pf-input" value={form.namaDirektur||""} onChange={e=>setF("namaDirektur",e.target.value)} placeholder="Untuk tanda tangan surat" /></div>
        </ModalEdit>
      )}

      {/* Modal Operasional */}
      {modal==="operasional" && (
        <ModalEdit title="Edit Operasional" onClose={()=>setModal(null)} onSave={saveModal}>
          <div className="pf-grid2">
            <div className="pf-field"><label className="pf-label">Total Kamar</label>
              <input className="pf-input" type="number" min={1} value={form.totalKamar||""} onChange={e=>setF("totalKamar",e.target.value)} placeholder="12" /></div>
            <div className="pf-field"><label className="pf-label">Jam Buka</label>
              <input className="pf-input" type="time" value={form.jamBuka||""} onChange={e=>setF("jamBuka",e.target.value)} /></div>
          </div>
          <div className="pf-grid2">
            <div className="pf-field"><label className="pf-label">Jam Tutup</label>
              <input className="pf-input" type="time" value={form.jamTutup||""} onChange={e=>setF("jamTutup",e.target.value)} /></div>
            <div className="pf-field"><label className="pf-label">Parkir Motor</label>
              <input className="pf-input" type="number" min={0} value={form.parkirMotor||""} onChange={e=>setF("parkirMotor",e.target.value)} placeholder="0" /></div>
          </div>
          <div className="pf-grid2">
            <div className="pf-field"><label className="pf-label">Parkir Mobil</label>
              <input className="pf-input" type="number" min={0} value={form.parkirMobil||""} onChange={e=>setF("parkirMobil",e.target.value)} placeholder="0" /></div>
          </div>
          <div className="pf-field"><label className="pf-label">Nomor Kamar Premium</label>
            <input className="pf-input" value={form.nomorPremium||""} onChange={e=>setF("nomorPremium",e.target.value)} placeholder="1, 4, 7, 10, 12" /></div>
          <div className="pf-field"><label className="pf-label">Nomor Kamar Reguler</label>
            <input className="pf-input" value={form.nomorReguler||""} onChange={e=>setF("nomorReguler",e.target.value)} placeholder="2, 3, 5, 6, 8, 9, 11" /></div>
          <div className="pf-field"><label className="pf-label">Fasilitas Umum</label>
            <input className="pf-input" value={(form.fasilitasUmum||[]).join(", ")} onChange={e=>setF("fasilitasUmum",e.target.value.split(",").map(s=>s.trim()).filter(Boolean))} placeholder="WiFi, Dapur, Laundry, Parkir..." />
            <div className="pf-hint">Pisahkan dengan koma</div></div>
        </ModalEdit>
      )}

      {/* Modal Keuangan */}
      {modal==="keuangan" && (
        <ModalEdit title="Edit Keuangan & Tagihan" onClose={()=>setModal(null)} onSave={saveModal}>
          <div className="pf-grid2">
            <div className="pf-field"><label className="pf-label">Batas Bayar (tanggal)</label>
              <input className="pf-input" type="number" min={1} max={28} value={form.batasBayar||""} onChange={e=>setF("batasBayar",e.target.value)} placeholder="25" /></div>
            <div className="pf-field"><label className="pf-label">Toleransi (hari)</label>
              <input className="pf-input" type="number" min={0} value={form.toleransiHari||""} onChange={e=>setF("toleransiHari",e.target.value)} placeholder="3" /></div>
          </div>
          <div className="pf-grid2">
            <div className="pf-field"><label className="pf-label">Denda Terlambat / Hari (Rp)</label>
              <input className="pf-input mono" type="number" min={0} value={form.dendaPerHari||""} onChange={e=>setF("dendaPerHari",e.target.value)} placeholder="50000" /></div>
            <div className="pf-field"><label className="pf-label">Sewa Harian (Rp)</label>
              <input className="pf-input mono" type="number" min={0} value={form.sewaHarian||""} onChange={e=>setF("sewaHarian",e.target.value)} placeholder="250000" /></div>
          </div>
          <div className="pf-grid2">
            <div className="pf-field"><label className="pf-label">Management Fee (%)</label>
              <input className="pf-input" type="number" min={0} max={100} value={form.mgmtFeePct||""} onChange={e=>setF("mgmtFeePct",e.target.value)} placeholder="22" /></div>
            <div className="pf-field"><label className="pf-label">Deposit Jaminan (Rp)</label>
              <input className="pf-input mono" type="number" min={0} value={form.depositJaminan||""} onChange={e=>setF("depositJaminan",e.target.value)} placeholder="500000" />
              <div className="pf-hint">Kosongkan jika tidak dipakai</div></div>
          </div>
        </ModalEdit>
      )}

      {/* Modal HR */}
      {modal==="hr" && (
        <ModalEdit title="Edit HR & Gaji" onClose={()=>setModal(null)} onSave={saveModal}>
          <div className="pf-grid2">
            <div className="pf-field"><label className="pf-label">Lembur per Shift (Rp)</label>
              <input className="pf-input mono" type="number" min={0} value={form.lemburPerShift||""} onChange={e=>setF("lemburPerShift",e.target.value)} placeholder="50000" /></div>
            <div className="pf-field"><label className="pf-label">Denda Ijin Tidak Sah / Hari (Rp)</label>
              <input className="pf-input mono" type="number" min={0} value={form.dendaIjinTidakSah||""} onChange={e=>setF("dendaIjinTidakSah",e.target.value)} placeholder="50000" /></div>
          </div>
          <div className="pf-grid2">
            <div className="pf-field"><label className="pf-label">Maks Pinjaman Koperasi (Rp)</label>
              <input className="pf-input mono" type="number" min={0} value={form.maxPinjamanKoperasi||""} onChange={e=>setF("maxPinjamanKoperasi",e.target.value)} placeholder="700000" /></div>
            <div className="pf-field"><label className="pf-label">KPI Threshold Kehadiran (%)</label>
              <input className="pf-input" type="number" min={0} max={100} value={form.kpiThresholdPct||""} onChange={e=>setF("kpiThresholdPct",e.target.value)} placeholder="90" /></div>
          </div>
          <div className="pf-grid2">
            <div className="pf-field"><label className="pf-label">Bank Koperasi</label>
              <input className="pf-input" value={form.bankKoperasi||""} onChange={e=>setF("bankKoperasi",e.target.value)} placeholder="BCA, BRI..." /></div>
            <div className="pf-field"><label className="pf-label">No. Rek Koperasi</label>
              <input className="pf-input mono" value={form.rekeningKoperasi||""} onChange={e=>setF("rekeningKoperasi",e.target.value)} placeholder="Nomor rekening..." /></div>
          </div>
          <div className="pf-info-box">
            💡 Nominal insentif per karyawan diset di Data Karyawan → masing-masing profil.
          </div>
        </ModalEdit>
      )}

      {/* Modal GPS */}
      {modal==="gps" && (
        <ModalEdit title="Edit GPS Absensi" onClose={()=>setModal(null)} onSave={saveModal}>
          <div className="pf-warn-box">📍 Buka Google Maps, klik kanan lokasi kost → salin koordinat</div>
          <div className="pf-grid2">
            <div className="pf-field"><label className="pf-label">Latitude</label>
              <input className="pf-input mono" value={form.gpsLat||""} onChange={e=>setF("gpsLat",e.target.value)} placeholder="-7.123456" /></div>
            <div className="pf-field"><label className="pf-label">Longitude</label>
              <input className="pf-input mono" value={form.gpsLng||""} onChange={e=>setF("gpsLng",e.target.value)} placeholder="110.123456" /></div>
          </div>
          <div className="pf-field"><label className="pf-label">Radius Clock-in (meter)</label>
            <input className="pf-input" type="number" min={50} max={2000} value={form.gpsRadius||""} onChange={e=>setF("gpsRadius",e.target.value)} placeholder="500" />
            <div className="pf-hint">Rekomendasi: 200–500 meter</div></div>
        </ModalEdit>
      )}

      {/* Modal Fasilitas — via operasional, sudah include */}

      {/* Modal Rekening */}
      {rekModal !== null && (
        <ModalRekening
          rek={rekModal?.id ? rekModal : null}
          onClose={()=>setRekModal(null)}
          onSave={saveRekening}
        />
      )}
    </div>
  );
}
