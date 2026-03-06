import { useState, useEffect } from "react";

// ============================================================
// CSS
// ============================================================
const CSS = `
  .kr-wrap { display:flex; flex-direction:column; gap:16px; }

  /* Cards */
  .kr-cards { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
  .kr-card  { background:#fff; border-radius:12px; border:1px solid #e5e7eb; padding:14px 16px; position:relative; overflow:hidden; }
  .kr-card-bar { position:absolute; top:0; left:0; right:0; height:3px; }
  .kr-card-label { font-size:10px; font-weight:500; color:#9ca3af; text-transform:uppercase; letter-spacing:.8px; margin-bottom:4px; margin-top:8px; }
  .kr-card-val { font-size:22px; font-weight:700; color:#111827; }
  .kr-card-sub { font-size:11px; color:#6b7280; margin-top:3px; }

  /* Layout */
  .kr-layout { display:grid; grid-template-columns:300px 1fr; gap:14px; align-items:start; }

  /* Widget */
  .kr-widget { background:#fff; border-radius:12px; border:1px solid #e5e7eb; overflow:hidden; }
  .kr-widget-head { padding:13px 16px 10px; border-bottom:1px solid #f3f4f6; display:flex; align-items:center; justify-content:space-between; }
  .kr-widget-title { font-size:12px; font-weight:600; color:#111827; display:flex; align-items:center; gap:6px; }

  /* Staff list */
  .kr-staff-item { display:flex; align-items:center; gap:10px; padding:10px 14px; border-bottom:1px solid #f3f4f6; cursor:pointer; transition:background .1s; }
  .kr-staff-item:last-child { border-bottom:none; }
  .kr-staff-item:hover { background:#fafafa; }
  .kr-staff-item.active { background:#fff7ed; border-left:3px solid #f97316; }
  .kr-staff-avatar { width:38px; height:38px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:15px; font-weight:700; color:#fff; flex-shrink:0; }
  .kr-staff-name { font-size:13px; font-weight:600; color:#1f2937; }
  .kr-staff-jabatan { font-size:11px; color:#9ca3af; margin-top:1px; }
  .kr-staff-right { margin-left:auto; text-align:right; }

  /* Detail */
  .kr-detail { padding:16px; }
  .kr-detail-header { display:flex; align-items:center; gap:14px; margin-bottom:16px; padding-bottom:14px; border-bottom:1px solid #f3f4f6; }
  .kr-detail-avatar { width:56px; height:56px; border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:22px; font-weight:700; color:#fff; flex-shrink:0; }
  .kr-detail-name { font-size:16px; font-weight:700; color:#111827; }
  .kr-detail-jabatan { font-size:12px; color:#9ca3af; margin-top:2px; }

  .kr-section { margin-bottom:16px; }
  .kr-section-label { font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:1.2px; color:#9ca3af; margin-bottom:8px; display:flex; align-items:center; gap:6px; }
  .kr-section-label::after { content:''; flex:1; height:1px; background:#f3f4f6; }

  .kr-info-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
  .kr-info-item { background:#f9fafb; border-radius:8px; padding:9px 11px; }
  .kr-info-key { font-size:10px; color:#9ca3af; font-weight:500; text-transform:uppercase; letter-spacing:.4px; margin-bottom:2px; }
  .kr-info-val { font-size:12px; font-weight:600; color:#1f2937; }
  .kr-info-val.orange { color:#ea580c; }

  /* Kontrak card */
  .kr-kontrak { background:linear-gradient(135deg,#1e293b,#334155); border-radius:12px; padding:16px; color:#fff; margin-bottom:14px; }
  .kr-kontrak-no { font-size:10px; color:#94a3b8; font-weight:600; letter-spacing:1px; margin-bottom:4px; }
  .kr-kontrak-name { font-size:14px; font-weight:700; margin-bottom:12px; }
  .kr-kontrak-row { display:flex; justify-content:space-between; margin-bottom:6px; }
  .kr-kontrak-key { font-size:11px; color:#94a3b8; }
  .kr-kontrak-val { font-size:11px; font-weight:600; color:#e2e8f0; }
  .kr-kontrak-bar { height:4px; background:#475569; border-radius:2px; overflow:hidden; margin:10px 0 4px; }
  .kr-kontrak-fill { height:100%; border-radius:2px; transition:width .4s; }
  .kr-kontrak-sisa { font-size:10px; color:#94a3b8; text-align:right; }

  /* Cuti tracker */
  .kr-cuti-dots { display:flex; gap:6px; }
  .kr-cuti-dot { width:28px; height:28px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; }
  .kr-cuti-dot.used { background:#fee2e2; color:#dc2626; }
  .kr-cuti-dot.avail { background:#dcfce7; color:#16a34a; }

  /* Badge */
  .kr-badge { display:inline-flex; align-items:center; gap:3px; padding:2px 8px; border-radius:20px; font-size:10px; font-weight:600; }

  /* Filter */
  .kr-filterbar { display:flex; align-items:center; gap:8px; padding:10px 14px; border-bottom:1px solid #f3f4f6; }
  .kr-search { display:flex; align-items:center; gap:7px; background:#f9fafb; border:1.5px solid #e5e7eb; border-radius:8px; padding:6px 11px; flex:1; }
  .kr-search:focus-within { border-color:#f97316; background:#fff; }
  .kr-search input { border:none; outline:none; background:transparent; font-size:12px; color:#1f2937; width:100%; font-family:inherit; }
  .kr-select { padding:6px 10px; border-radius:8px; border:1.5px solid #e5e7eb; font-size:12px; color:#374151; background:#fff; outline:none; font-family:inherit; cursor:pointer; }
  .kr-select:focus { border-color:#f97316; }

  /* Modal */
  .kr-overlay { position:fixed !important; top:0 !important; left:0 !important; width:100vw !important; height:100vh !important; background:rgba(17,24,39,.65) !important; backdrop-filter:blur(4px) !important; z-index:9999 !important; display:flex !important; align-items:center !important; justify-content:center !important; padding:16px !important; box-sizing:border-box !important; animation:krFade .18s ease; }
  @keyframes krFade { from{opacity:0}to{opacity:1} }
  .kr-modal { background:#fff; border-radius:16px; width:100%; max-width:560px; max-height:90vh; overflow-y:auto; box-shadow:0 24px 64px rgba(0,0,0,.18); animation:krSlide .2s cubic-bezier(.4,0,.2,1); }
  @keyframes krSlide { from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1} }
  .kr-modal-head { padding:15px 20px 12px; border-bottom:1px solid #f3f4f6; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; background:#fff; z-index:1; }
  .kr-modal-title { font-size:14px; font-weight:700; color:#111827; }
  .kr-modal-close { width:28px; height:28px; border-radius:7px; background:#f3f4f6; border:none; cursor:pointer; font-size:14px; color:#6b7280; display:flex; align-items:center; justify-content:center; }
  .kr-modal-close:hover { background:#fee2e2; color:#dc2626; }
  .kr-modal-body { padding:16px 20px; }
  .kr-modal-foot { padding:12px 20px; border-top:1px solid #f3f4f6; display:flex; gap:8px; }

  .kr-field { margin-bottom:12px; }
  .kr-field-label { font-size:11px; font-weight:600; color:#374151; margin-bottom:5px; display:block; }
  .kr-input { width:100%; padding:8px 11px; border-radius:8px; border:1.5px solid #e5e7eb; font-size:12px; font-family:inherit; color:#1f2937; outline:none; background:#fff; transition:border-color .12s; box-sizing:border-box; }
  .kr-input:focus { border-color:#f97316; }
  .kr-input-row { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
  .kr-input-row3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; }
  .kr-divider { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#9ca3af; margin:14px 0 10px; display:flex; align-items:center; gap:6px; }
  .kr-divider::after { content:''; flex:1; height:1px; background:#f3f4f6; }

  .kr-btn { flex:1; padding:9px 14px; border-radius:8px; font-size:12px; font-weight:600; border:none; cursor:pointer; font-family:inherit; transition:all .15s; display:flex; align-items:center; justify-content:center; gap:5px; }
  .kr-btn.primary { background:linear-gradient(135deg,#f97316,#ea580c); color:#fff; box-shadow:0 3px 10px rgba(249,115,22,.25); }
  .kr-btn.success { background:linear-gradient(135deg,#16a34a,#15803d); color:#fff; }
  .kr-btn.ghost   { background:#f3f4f6; color:#4b5563; }
  .kr-btn.danger  { background:#fee2e2; color:#dc2626; }
  .kr-btn:disabled { opacity:.4; cursor:not-allowed; }

  .kr-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:48px 16px; color:#9ca3af; text-align:center; gap:8px; }

  /* Tab pengajuan cuti */
  .kr-req-item { padding:10px 14px; border-bottom:1px solid #f3f4f6; }
  .kr-req-item:last-child { border-bottom:none; }
  .kr-req-name { font-size:13px; font-weight:600; color:#1f2937; }
  .kr-req-meta { font-size:11px; color:#9ca3af; margin-top:2px; display:flex; gap:8px; }
  .kr-req-actions { display:flex; gap:6px; margin-top:8px; }

  @media(max-width:1024px){ .kr-layout{grid-template-columns:1fr} }
  @media(max-width:768px) { .kr-cards{grid-template-columns:repeat(2,1fr)} .kr-info-grid{grid-template-columns:1fr} }
  @media(max-width:480px) { .kr-cards{grid-template-columns:repeat(2,1fr);gap:8px} .kr-input-row{grid-template-columns:1fr} .kr-input-row3{grid-template-columns:1fr} }
`;

function StyleInjector() {
  useEffect(() => {
    const id = "senyuminn-karyawan-css";
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
const padD     = (n) => String(n).padStart(2, "0");
const todayStr = (() => { const d = new Date(); return `${d.getFullYear()}-${padD(d.getMonth()+1)}-${padD(d.getDate())}`; })();
const fmtRp    = (n) => n != null ? "Rp " + Number(n).toLocaleString("id-ID") : "\u2014";

const getInisial = (nama) => {
  if (!nama) return "?";
  const p = nama.trim().split(" ");
  return (p.length >= 2 ? p[0][0] + p[1][0] : nama.slice(0,2)).toUpperCase();
};

const AVATAR_COLORS = ["#f97316","#3b82f6","#8b5cf6","#16a34a","#ec4899","#06b6d4","#f59e0b"];
const getColor = (id) => AVATAR_COLORS[(id || 0) % AVATAR_COLORS.length];

const hariSisa = (tgl) => tgl ? Math.ceil((new Date(tgl) - new Date()) / 86400000) : null;

const addYears = (dateStr, n) => {
  const d = new Date(dateStr);
  d.setFullYear(d.getFullYear() + n);
  return d.toISOString().slice(0,10);
};

const genNoSPK = (tglMulai, id) => {
  if (!tglMulai) return "";
  const [y, m, d] = tglMulai.split("-");
  return `SPKJ.SIEK.${y}.${m}.${padD(id)}`;
};

const progressKontrak = (mulai, selesai) => {
  if (!mulai || !selesai) return 0;
  const total = new Date(selesai) - new Date(mulai);
  const elapsed = new Date() - new Date(mulai);
  return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
};

const AGAMA_LIST   = ["Islam","Kristen","Katolik","Hindu","Buddha","Konghucu"];
const SHIFT_LIST   = ["Pagi (08:00\u201316:00)","Sore/Malam (16:00\u201307:00)","Fleksibel"];
const STATUS_KONTRAK = {
  aktif:       { label:"Aktif",       color:"#16a34a", bg:"#dcfce7" },
  habis:       { label:"Habis",       color:"#dc2626", bg:"#fee2e2" },
  diperpanjang:{ label:"Diperpanjang",color:"#3b82f6", bg:"#dbeafe" },
};
const STATUS_CUTI = {
  pending:  { label:"Menunggu", color:"#f97316", bg:"#ffedd5" },
  approved: { label:"Disetujui",color:"#16a34a", bg:"#dcfce7" },
  rejected: { label:"Ditolak",  color:"#dc2626", bg:"#fee2e2" },
};

// ============================================================
// MODAL TAMBAH / EDIT KARYAWAN
// ============================================================
function ModalKaryawan({ karyawan, onClose, onSave }) {
  const isEdit = !!karyawan?.id;
  const [tab, setTab] = useState("data");
  const [form, setForm] = useState(karyawan || {
    nama:"", nik:"", tglLahir:"", jenisKelamin:"L", agama:"Islam",
    statusNikah:"Belum Menikah", noHP:"", noDarurat:"", alamat:"",
    jabatan:"", shift:SHIFT_LIST[0], tglMulai:"", rekeningBank:"",
    rekeningNo:"", gajiPokok:"", catatan:"", aktif:true,
    cutiSisa: 3, cutiTerpakai: 0,
  });
  const set = (k,v) => setForm(p=>({...p,[k]:v}));

  const tglSelesai = form.tglMulai ? addYears(form.tglMulai, 1) : "";
  const noSPK      = genNoSPK(form.tglMulai, karyawan?.id || Date.now());
  const valid      = form.nama && form.nik && form.jabatan && form.tglMulai;

  const TABS = [
    { id:"data",    label:"\ud83d\udc64 Data Diri" },
    { id:"kontrak", label:"\ud83d\udccb Kontrak" },
    { id:"rekening",label:"\ud83c\udfe6 Rekening & Gaji" },
  ];

  return(
    <div className="kr-overlay" onClick={onClose}>
      <div className="kr-modal" onClick={e=>e.stopPropagation()}>
        <div className="kr-modal-head">
          <div className="kr-modal-title">{isEdit ? "\u270f\ufe0f Edit Karyawan" : "\u2795 Tambah Karyawan"}</div>
          <button className="kr-modal-close" onClick={onClose}>\u2715</button>
        </div>

        {/* Tab nav */}
        <div style={{display:"flex",gap:0,borderBottom:"1px solid #f3f4f6",background:"#fafafa"}}>
          {TABS.map(t=>(
            <div key={t.id} onClick={()=>setTab(t.id)} style={{
              flex:1, padding:"9px 8px", textAlign:"center", fontSize:11, fontWeight:600, cursor:"pointer",
              color:tab===t.id?"#ea580c":"#9ca3af",
              borderBottom:tab===t.id?"2px solid #f97316":"2px solid transparent",
              background:tab===t.id?"#fff":"transparent", transition:"all .12s"
            }}>{t.label}</div>
          ))}
        </div>

        <div className="kr-modal-body">

          {/* \u2500\u2500 Tab: Data Diri */}
          {tab==="data" && (
            <>
              <div className="kr-input-row">
                <div className="kr-field">
                  <label className="kr-field-label">Nama Lengkap *</label>
                  <input className="kr-input" value={form.nama} onChange={e=>set("nama",e.target.value)} placeholder="Nama lengkap..." />
                </div>
                <div className="kr-field">
                  <label className="kr-field-label">NIK / KTP *</label>
                  <input className="kr-input" value={form.nik} onChange={e=>set("nik",e.target.value)} placeholder="16 digit NIK..." maxLength={16} />
                </div>
              </div>
              <div className="kr-input-row">
                <div className="kr-field">
                  <label className="kr-field-label">Tanggal Lahir</label>
                  <input type="date" className="kr-input" value={form.tglLahir} onChange={e=>set("tglLahir",e.target.value)} />
                </div>
                <div className="kr-field">
                  <label className="kr-field-label">Jenis Kelamin</label>
                  <select className="kr-input" value={form.jenisKelamin} onChange={e=>set("jenisKelamin",e.target.value)}>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
              </div>
              <div className="kr-input-row">
                <div className="kr-field">
                  <label className="kr-field-label">Agama <span style={{color:"#9ca3af",fontWeight:400}}>(menentukan jadwal THR)</span></label>
                  <select className="kr-input" value={form.agama} onChange={e=>set("agama",e.target.value)}>
                    {AGAMA_LIST.map(a=><option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div className="kr-field">
                  <label className="kr-field-label">Status Pernikahan</label>
                  <select className="kr-input" value={form.statusNikah} onChange={e=>set("statusNikah",e.target.value)}>
                    {["Belum Menikah","Menikah","Cerai"].map(s=><option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="kr-input-row">
                <div className="kr-field">
                  <label className="kr-field-label">Nomor HP</label>
                  <input className="kr-input" value={form.noHP} onChange={e=>set("noHP",e.target.value)} placeholder="08xx..." />
                </div>
                <div className="kr-field">
                  <label className="kr-field-label">Nomor Darurat</label>
                  <input className="kr-input" value={form.noDarurat} onChange={e=>set("noDarurat",e.target.value)} placeholder="Keluarga terdekat..." />
                </div>
              </div>
              <div className="kr-field">
                <label className="kr-field-label">Alamat</label>
                <textarea className="kr-input" rows={2} value={form.alamat} onChange={e=>set("alamat",e.target.value)} placeholder="Alamat lengkap..." style={{resize:"none"}} />
              </div>
              <div className="kr-field">
                <label className="kr-field-label">Catatan</label>
                <textarea className="kr-input" rows={2} value={form.catatan} onChange={e=>set("catatan",e.target.value)} placeholder="Catatan tambahan..." style={{resize:"none"}} />
              </div>
              <div className="kr-field">
                <label style={{display:"flex",alignItems:"center",gap:8,fontSize:12,cursor:"pointer"}}>
                  <input type="checkbox" checked={form.aktif} onChange={e=>set("aktif",e.target.checked)} />
                  <span style={{fontWeight:600,color:"#374151"}}>Status Aktif</span>
                </label>
              </div>
            </>
          )}

          {/* \u2500\u2500 Tab: Kontrak */}
          {tab==="kontrak" && (
            <>
              <div className="kr-input-row">
                <div className="kr-field">
                  <label className="kr-field-label">Jabatan *</label>
                  <input className="kr-input" value={form.jabatan} onChange={e=>set("jabatan",e.target.value)} placeholder="Clean & Service, Jaga Malam..." />
                </div>
                <div className="kr-field">
                  <label className="kr-field-label">Shift</label>
                  <select className="kr-input" value={form.shift} onChange={e=>set("shift",e.target.value)}>
                    {SHIFT_LIST.map(s=><option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="kr-input-row">
                <div className="kr-field">
                  <label className="kr-field-label">Tanggal Mulai Kerja *</label>
                  <input type="date" className="kr-input" value={form.tglMulai} onChange={e=>set("tglMulai",e.target.value)} />
                </div>
                <div className="kr-field">
                  <label className="kr-field-label">Tanggal Selesai Kontrak</label>
                  <input className="kr-input" value={tglSelesai} readOnly style={{background:"#f9fafb",color:"#9ca3af"}} placeholder="Auto: +1 tahun dari mulai" />
                </div>
              </div>

              {/* Preview SPK */}
              {form.tglMulai && (
                <div style={{background:"linear-gradient(135deg,#1e293b,#334155)",borderRadius:12,padding:16,color:"#fff",marginBottom:14}}>
                  <div style={{fontSize:10,color:"#94a3b8",fontWeight:600,letterSpacing:1,marginBottom:4}}>NOMOR SPK (AUTO)</div>
                  <div style={{fontSize:15,fontWeight:700,letterSpacing:1,fontFamily:"JetBrains Mono,monospace"}}>{noSPK}</div>
                  <div style={{marginTop:10,display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                    {[
                      {k:"Mulai",    v:form.tglMulai},
                      {k:"Selesai",  v:tglSelesai},
                      {k:"Durasi",   v:"1 tahun"},
                      {k:"Hak Cuti", v:"3x / tahun"},
                    ].map((r,i)=>(
                      <div key={i}>
                        <div style={{fontSize:9,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.8}}>{r.k}</div>
                        <div style={{fontSize:12,fontWeight:600,color:"#e2e8f0"}}>{r.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hak Cuti */}
              <div className="kr-field">
                <label className="kr-field-label">Hak Cuti Tersisa</label>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div className="kr-cuti-dots">
                    {Array.from({length:3},(_,i)=>(
                      <div key={i} className={`kr-cuti-dot ${i < (form.cutiTerpakai||0) ? "used" : "avail"}`}>
                        {i < (form.cutiTerpakai||0) ? "\u2715" : "\u2713"}
                      </div>
                    ))}
                  </div>
                  <span style={{fontSize:12,color:"#6b7280"}}>
                    {3-(form.cutiTerpakai||0)} hari tersisa dari 3 hari/tahun
                  </span>
                </div>
              </div>
            </>
          )}

          {/* \u2500\u2500 Tab: Rekening & Gaji */}
          {tab==="rekening" && (
            <>
              <div className="kr-input-row">
                <div className="kr-field">
                  <label className="kr-field-label">Bank</label>
                  <select className="kr-input" value={form.rekeningBank} onChange={e=>set("rekeningBank",e.target.value)}>
                    <option value="">Pilih bank...</option>
                    {["BCA","BRI","BNI","Mandiri","BSI","Jenius","GoPay","OVO","Dana"].map(b=><option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="kr-field">
                  <label className="kr-field-label">Nomor Rekening</label>
                  <input className="kr-input" value={form.rekeningNo} onChange={e=>set("rekeningNo",e.target.value)} placeholder="Nomor rekening..." style={{fontFamily:"JetBrains Mono,monospace"}} />
                </div>
              </div>
              <div className="kr-field">
                <label className="kr-field-label">Gaji Pokok (Rp)</label>
                <input type="number" className="kr-input" value={form.gajiPokok} onChange={e=>set("gajiPokok",e.target.value)} placeholder="0" style={{fontFamily:"JetBrains Mono,monospace"}} />
              </div>

              <div style={{background:"#f0fdf4",border:"1px solid #86efac",borderRadius:8,padding:"10px 12px",fontSize:11,color:"#15803d"}}>
                \u2139\ufe0f Insentif, lembur, dan potongan diatur di modul <b>Penggajian</b> setiap bulan.
                BPJS & Pajak dicatat manual di slip gaji.
              </div>
            </>
          )}

        </div>
        <div className="kr-modal-foot">
          <button className="kr-btn primary" disabled={!valid} onClick={()=>{ onSave({...form, id:karyawan?.id||Date.now(), tglSelesai, noSPK, statusKontrak:"aktif"}); onClose(); }}>
            \u2705 {isEdit ? "Simpan Perubahan" : "Tambah Karyawan"}
          </button>
          <button className="kr-btn ghost" onClick={onClose}>Batal</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MODAL PENGAJUAN CUTI / IJIN
// ============================================================
function ModalCuti({ karyawan, onClose, onSave }) {
  const [form, setForm] = useState({ tipe:"cuti", dari:todayStr, sampai:todayStr, alasan:"" });
  const set = (k,v) => setForm(p=>({...p,[k]:v}));
  const durasi = Math.max(1, Math.ceil((new Date(form.sampai)-new Date(form.dari))/86400000)+1);
  const valid  = form.alasan && form.dari && form.sampai;
  const cutiSisa = (karyawan.cutiSisa ?? 3) - (karyawan.cutiTerpakai ?? 0);

  return(
    <div className="kr-overlay" onClick={onClose}>
      <div className="kr-modal" onClick={e=>e.stopPropagation()} style={{maxWidth:440}}>
        <div className="kr-modal-head">
          <div className="kr-modal-title">\ud83d\udcc5 Pengajuan Cuti / Ijin</div>
          <button className="kr-modal-close" onClick={onClose}>\u2715</button>
        </div>
        <div className="kr-modal-body">
          <div style={{background:"#f9fafb",borderRadius:10,padding:"10px 14px",marginBottom:14,display:"flex",alignItems:"center",gap:10}}>
            <div className="kr-staff-avatar" style={{background:getColor(karyawan.id),width:36,height:36,borderRadius:9,fontSize:13}}>{getInisial(karyawan.nama)}</div>
            <div>
              <div style={{fontSize:13,fontWeight:600,color:"#1f2937"}}>{karyawan.nama}</div>
              <div style={{fontSize:11,color:"#9ca3af"}}>{karyawan.jabatan} \u00b7 Sisa cuti: <b style={{color:cutiSisa>0?"#16a34a":"#dc2626"}}>{cutiSisa} hari</b></div>
            </div>
          </div>

          <div className="kr-field">
            <label className="kr-field-label">Tipe</label>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[{v:"cuti",l:"\ud83c\udfd6\ufe0f Cuti"},{v:"ijin",l:"\ud83d\udccb Ijin"}].map(t=>(
                <div key={t.v} onClick={()=>set("tipe",t.v)} style={{padding:"9px",borderRadius:9,border:`1.5px solid ${form.tipe===t.v?"#f97316":"#e5e7eb"}`,background:form.tipe===t.v?"#fff7ed":"#fff",textAlign:"center",cursor:"pointer",fontSize:12,fontWeight:600,color:form.tipe===t.v?"#ea580c":"#6b7280",transition:"all .12s"}}>
                  {t.l}
                </div>
              ))}
            </div>
          </div>

          <div className="kr-input-row">
            <div className="kr-field">
              <label className="kr-field-label">Dari Tanggal</label>
              <input type="date" className="kr-input" value={form.dari} onChange={e=>set("dari",e.target.value)} />
            </div>
            <div className="kr-field">
              <label className="kr-field-label">Sampai Tanggal</label>
              <input type="date" className="kr-input" value={form.sampai} onChange={e=>set("sampai",e.target.value)} min={form.dari} />
            </div>
          </div>

          {form.tipe==="cuti" && durasi > cutiSisa && (
            <div style={{background:"#fee2e2",border:"1px solid #fca5a5",borderRadius:8,padding:"8px 12px",fontSize:11,color:"#dc2626",marginBottom:10}}>
              \u26a0\ufe0f Sisa cuti tidak cukup! Tersisa {cutiSisa} hari, diajukan {durasi} hari.
            </div>
          )}

          <div className="kr-field">
            <label className="kr-field-label">Alasan</label>
            <textarea className="kr-input" rows={3} value={form.alasan} onChange={e=>set("alasan",e.target.value)} placeholder="Keterangan cuti/ijin..." style={{resize:"none"}} />
          </div>

          <div style={{background:"#f9fafb",borderRadius:8,padding:"8px 12px",fontSize:12,color:"#374151"}}>
            Durasi: <b>{durasi} hari</b> \u00b7 Status awal: <b style={{color:"#f97316"}}>Menunggu Persetujuan</b>
          </div>
        </div>
        <div className="kr-modal-foot">
          <button className="kr-btn primary" disabled={!valid} onClick={()=>{ onSave({...form,id:Date.now(),karyawanId:karyawan.id,namaKaryawan:karyawan.nama,durasi,status:"pending",tglPengajuan:todayStr}); onClose(); }}>
            \ud83d\udce4 Ajukan
          </button>
          <button className="kr-btn ghost" onClick={onClose}>Batal</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// DETAIL PANEL
// ============================================================
function DetailPanel({ k, onEdit, onCuti, isReadOnly }) {
  const sisa   = hariSisa(k.tglSelesai);
  const prog   = progressKontrak(k.tglMulai, k.tglSelesai);
  const stKontrak = sisa !== null && sisa < 0 ? "habis" : "aktif";
  const cutiTerpakai = k.cutiTerpakai || 0;

  return (
    <div className="kr-widget">
      <div className="kr-widget-head">
        <div className="kr-widget-title">\ud83d\udc64 Detail Karyawan</div>
        {!isReadOnly && (
          <div style={{display:"flex",gap:6}}>
            <button className="kr-btn ghost" style={{flex:"none",padding:"5px 12px",fontSize:11}} onClick={onCuti}>\ud83d\udcc5 Ajukan Cuti</button>
            <button className="kr-btn primary" style={{flex:"none",padding:"5px 12px",fontSize:11}} onClick={onEdit}>\u270f\ufe0f Edit</button>
          </div>
        )}
      </div>
      <div className="kr-detail">

        {/* Header */}
        <div className="kr-detail-header">
          <div className="kr-detail-avatar" style={{background:getColor(k.id)}}>{getInisial(k.nama)}</div>
          <div>
            <div className="kr-detail-name">{k.nama}</div>
            <div className="kr-detail-jabatan">{k.jabatan} \u00b7 {k.shift}</div>
            <div style={{marginTop:4,display:"flex",gap:6,flexWrap:"wrap"}}>
              <span className="kr-badge" style={{color:k.aktif?"#16a34a":"#dc2626",background:k.aktif?"#dcfce7":"#fee2e2"}}>
                {k.aktif?"\u25cf Aktif":"\u25cf Nonaktif"}
              </span>
              <span className="kr-badge" style={{color:STATUS_KONTRAK[stKontrak]?.color,background:STATUS_KONTRAK[stKontrak]?.bg}}>
                SPK {STATUS_KONTRAK[stKontrak]?.label}
              </span>
              {sisa !== null && sisa <= 30 && sisa >= 0 && (
                <span className="kr-badge" style={{color:"#dc2626",background:"#fee2e2"}}>\u26a0\ufe0f H-{sisa} habis kontrak</span>
              )}
            </div>
          </div>
        </div>

        {/* Kontrak */}
        <div className="kr-kontrak">
          <div className="kr-kontrak-no">{k.noSPK || genNoSPK(k.tglMulai, k.id)}</div>
          <div className="kr-kontrak-name">{k.nama}</div>
          <div className="kr-kontrak-row">
            <span className="kr-kontrak-key">Mulai</span>
            <span className="kr-kontrak-val">{k.tglMulai || "\u2014"}</span>
          </div>
          <div className="kr-kontrak-row">
            <span className="kr-kontrak-key">Selesai</span>
            <span className="kr-kontrak-val">{k.tglSelesai || "\u2014"}</span>
          </div>
          <div className="kr-kontrak-row">
            <span className="kr-kontrak-key">Gaji Pokok</span>
            <span className="kr-kontrak-val">{k.gajiPokok ? fmtRp(k.gajiPokok) : "\u2014"}</span>
          </div>
          <div className="kr-kontrak-bar">
            <div className="kr-kontrak-fill" style={{width:`${prog}%`,background:prog>85?"#ef4444":prog>60?"#f97316":"#22c55e"}} />
          </div>
          <div className="kr-kontrak-sisa">
            {sisa !== null ? (sisa >= 0 ? `${sisa} hari lagi` : `Habis ${Math.abs(sisa)} hari lalu`) : "\u2014"}
          </div>
        </div>

        {/* Data Diri */}
        <div className="kr-section">
          <div className="kr-section-label">Data Diri</div>
          <div className="kr-info-grid">
            {[
              {k:"NIK",          v:k.nik||"\u2014"},
              {k:"Tgl Lahir",    v:k.tglLahir||"\u2014"},
              {k:"Jenis Kelamin",v:k.jenisKelamin==="L"?"Laki-laki":"Perempuan"},
              {k:"Agama",        v:k.agama||"\u2014"},
              {k:"Status",       v:k.statusNikah||"\u2014"},
              {k:"No HP",        v:k.noHP||"\u2014"},
              {k:"No Darurat",   v:k.noDarurat||"\u2014"},
            ].map((r,i)=>(
              <div key={i} className="kr-info-item">
                <div className="kr-info-key">{r.k}</div>
                <div className="kr-info-val">{r.v}</div>
              </div>
            ))}
            <div className="kr-info-item" style={{gridColumn:"1/-1"}}>
              <div className="kr-info-key">Alamat</div>
              <div className="kr-info-val">{k.alamat||"\u2014"}</div>
            </div>
          </div>
        </div>

        {/* Rekening */}
        <div className="kr-section">
          <div className="kr-section-label">Rekening</div>
          <div className="kr-info-grid">
            <div className="kr-info-item">
              <div className="kr-info-key">Bank</div>
              <div className="kr-info-val orange">{k.rekeningBank||"\u2014"}</div>
            </div>
            <div className="kr-info-item">
              <div className="kr-info-key">No. Rekening</div>
              <div className="kr-info-val" style={{fontFamily:"JetBrains Mono,monospace",fontSize:11}}>{k.rekeningNo||"\u2014"}</div>
            </div>
          </div>
        </div>

        {/* Hak Cuti */}
        <div className="kr-section">
          <div className="kr-section-label">Hak Cuti</div>
          <div style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0"}}>
            <div className="kr-cuti-dots">
              {Array.from({length:3},(_,i)=>(
                <div key={i} className={`kr-cuti-dot ${i < cutiTerpakai ? "used" : "avail"}`}>
                  {i < cutiTerpakai ? "\u2715" : "\u2713"}
                </div>
              ))}
            </div>
            <span style={{fontSize:12,color:"#6b7280"}}>{3-cutiTerpakai} hari tersisa</span>
          </div>
        </div>

        {k.catatan && (
          <div style={{background:"#fff7ed",border:"1px solid #fed7aa",borderRadius:8,padding:"10px 12px",fontSize:12,color:"#9a3412"}}>
            \ud83d\udcdd {k.catatan}
          </div>
        )}

      </div>
    </div>
  </div>
  );
}

// ============================================================
// MAIN
// ============================================================
export default function Karyawan({ user, globalData = {} }) {
  const {
    karyawanList = [], setKaryawanList = () => {},
    isReadOnly   = false,
  } = globalData;

  const [selected,   setSelected]  = useState(null);
  const [showModal,  setShow]       = useState(false);
  const [showCuti,   setShowCuti]   = useState(false);
  const [editData,   setEditData]   = useState(null);
  const [search,     setSearch]     = useState("");
  const [filterStatus, setFS]       = useState("all");
  const [cutiList,   setCutiList]   = useState([]);
  const [activeTab,  setActiveTab]  = useState("karyawan");

  const filtered = karyawanList.filter(k => {
    if (filterStatus === "aktif"    && !k.aktif)  return false;
    if (filterStatus === "nonaktif" && k.aktif)   return false;
    if (search) {
      const q = search.toLowerCase();
      return k.nama?.toLowerCase().includes(q) || k.jabatan?.toLowerCase().includes(q) || k.nik?.includes(q);
    }
    return true;
  });

  const handleSave = (data) => {
    if (data.id && karyawanList.find(k => k.id === data.id)) {
      setKaryawanList(prev => prev.map(k => k.id === data.id ? data : k));
      if (selected?.id === data.id) setSelected(data);
    } else {
      const newK = {...data, id: Date.now()};
      setKaryawanList(prev => [...prev, newK]);
      setSelected(newK);
    }
  };

  const handleApproveCuti = (cutiId, approved) => {
    setCutiList(prev => prev.map(c => c.id===cutiId
      ? {...c, status: approved?"approved":"rejected"}
      : c
    ));
    if (approved) {
      const cuti = cutiList.find(c=>c.id===cutiId);
      if (cuti?.tipe==="cuti") {
        setKaryawanList(prev => prev.map(k => k.id===cuti.karyawanId
          ? {...k, cutiTerpakai:(k.cutiTerpakai||0)+1}
          : k
        ));
      }
    }
  };

  // Stats
  const totalAktif    = karyawanList.filter(k=>k.aktif).length;
  const kontrakHabis  = karyawanList.filter(k=>{ const s=hariSisa(k.tglSelesai); return s!==null&&s<=30&&s>=0; }).length;
  const cutiPending   = cutiList.filter(c=>c.status==="pending").length;

  return (
    <div className="kr-wrap">
      <StyleInjector />

      {/* Cards */}
      <div className="kr-cards">
        {[
          {label:"Total Karyawan", val:karyawanList.length, color:"#f97316", sub:`${totalAktif} aktif`},
          {label:"Kontrak Habis",  val:kontrakHabis,        color:"#ef4444", sub:"\u2264 30 hari"},
          {label:"Cuti Pending",   val:cutiPending,         color:"#eab308", sub:"Menunggu approval"},
          {label:"Total Gaji",     val:karyawanList.filter(k=>k.aktif).reduce((s,k)=>s+(Number(k.gajiPokok)||0),0).toLocaleString("id-ID"), color:"#16a34a", sub:"Pokok / bulan", prefix:"Rp "},
        ].map((c,i)=>(
          <div key={i} className="kr-card">
            <div className="kr-card-bar" style={{background:c.color}} />
            <div className="kr-card-label">{c.label}</div>
            <div className="kr-card-val" style={{color:c.color,fontSize:i===3?15:22}}>
              {c.prefix||""}{c.val}
            </div>
            <div className="kr-card-sub">{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Main tabs */}
      <div style={{display:"flex",gap:4,background:"#fff",borderRadius:12,border:"1px solid #e5e7eb",padding:5}}>
        {[
          {id:"karyawan", label:"\ud83d\udc65 Data Karyawan"},
          {id:"cuti",     label:`\ud83d\udcc5 Cuti & Ijin ${cutiPending>0?`(${cutiPending} pending)`:""}` },
        ].map(t=>(
          <div key={t.id} onClick={()=>setActiveTab(t.id)} style={{
            flex:1,padding:"8px 12px",borderRadius:8,textAlign:"center",fontSize:12,fontWeight:600,cursor:"pointer",
            color:activeTab===t.id?"#fff":"#9ca3af",
            background:activeTab===t.id?"linear-gradient(135deg,#f97316,#ea580c)":"transparent",
            transition:"all .15s"
          }}>{t.label}</div>
        ))}
      </div>

      {/* \u2500\u2500 Tab: Data Karyawan */}
      {activeTab==="karyawan" && (
        <div className="kr-layout">
          {/* List */}
          <div className="kr-widget">
            <div className="kr-widget-head">
              <div className="kr-widget-title">\ud83d\udc65 Daftar Karyawan</div>
              {!isReadOnly && (
                <button className="kr-btn primary" style={{flex:"none",padding:"6px 12px",fontSize:11}} onClick={()=>{ setEditData(null); setShow(true); }}>
                  \u2795 Tambah
                </button>
              )}
            </div>
            <div className="kr-filterbar">
              <div className="kr-search">
                <span>\ud83d\udd0d</span>
                <input placeholder="Cari nama, jabatan..." value={search} onChange={e=>setSearch(e.target.value)} />
              </div>
              <select className="kr-select" value={filterStatus} onChange={e=>setFS(e.target.value)}>
                <option value="all">Semua</option>
                <option value="aktif">Aktif</option>
                <option value="nonaktif">Nonaktif</option>
              </select>
            </div>

            {karyawanList.length === 0 ? (
              <div className="kr-empty">
                <div style={{fontSize:36,opacity:.4}}>\ud83d\udc65</div>
                <div style={{fontSize:13,fontWeight:600,color:"#374151"}}>Belum ada karyawan</div>
                {!isReadOnly && <button className="kr-btn primary" style={{maxWidth:160,marginTop:4}} onClick={()=>{setEditData(null);setShow(true);}}>\u2795 Tambah Karyawan</button>}
              </div>
            ) : filtered.length === 0 ? (
              <div className="kr-empty"><div style={{fontSize:32,opacity:.4}}>\ud83d\udd0d</div><div style={{fontSize:13,fontWeight:600,color:"#374151"}}>Tidak ditemukan</div></div>
            ) : (
              filtered.map(k => {
                const sisa = hariSisa(k.tglSelesai);
                return (
                  <div key={k.id} className={`kr-staff-item ${selected?.id===k.id?"active":""}`} onClick={()=>setSelected(k)}>
                    <div className="kr-staff-avatar" style={{background:getColor(k.id)}}>{getInisial(k.nama)}</div>
                    <div>
                      <div className="kr-staff-name">{k.nama}</div>
                      <div className="kr-staff-jabatan">{k.jabatan}</div>
                    </div>
                    <div className="kr-staff-right">
                      <span className="kr-badge" style={{color:k.aktif?"#16a34a":"#9ca3af",background:k.aktif?"#dcfce7":"#f3f4f6"}}>
                        {k.aktif?"Aktif":"Nonaktif"}
                      </span>
                      {sisa !== null && sisa <= 30 && sisa >= 0 && (
                        <div style={{fontSize:10,color:"#dc2626",marginTop:2}}>\u26a0\ufe0f H-{sisa}</div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Detail */}
          {selected ? (
            <DetailPanel
              k={selected}
              isReadOnly={isReadOnly}
              onEdit={()=>{ setEditData(selected); setShow(true); }}
              onCuti={()=>setShowCuti(true)}
            />
          ) : (
            <div className="kr-widget">
              <div className="kr-empty" style={{padding:"60px 20px"}}>
                <div style={{fontSize:36,opacity:.4}}>\ud83d\udc64</div>
                <div style={{fontSize:13,fontWeight:600,color:"#374151"}}>Pilih karyawan</div>
                <div style={{fontSize:11,color:"#9ca3af"}}>Klik nama untuk lihat detail</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* \u2500\u2500 Tab: Cuti & Ijin */}
      {activeTab==="cuti" && (
        <div className="kr-widget">
          <div className="kr-widget-head">
            <div className="kr-widget-title">\ud83d\udcc5 Pengajuan Cuti & Ijin</div>
            <span style={{fontSize:11,color:"#9ca3af"}}>{cutiList.length} pengajuan</span>
          </div>
          {cutiList.length === 0 ? (
            <div className="kr-empty">
              <div style={{fontSize:32,opacity:.4}}>\ud83d\udcc5</div>
              <div style={{fontSize:13,fontWeight:600,color:"#374151"}}>Belum ada pengajuan</div>
              <div style={{fontSize:11,color:"#9ca3af"}}>Pengajuan dari karyawan akan muncul di sini</div>
            </div>
          ) : (
            cutiList.sort((a,b)=>b.tglPengajuan?.localeCompare(a.tglPengajuan)).map(c=>(
              <div key={c.id} className="kr-req-item">
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div>
                    <div className="kr-req-name">{c.namaKaryawan} \u2014 {c.tipe==="cuti"?"\ud83c\udfd6\ufe0f Cuti":"\ud83d\udccb Ijin"}</div>
                    <div className="kr-req-meta">
                      <span>\ud83d\udcc5 {c.dari} s/d {c.sampai}</span>
                      <span>\u00b7 {c.durasi} hari</span>
                      <span>\u00b7 Diajukan {c.tglPengajuan}</span>
                    </div>
                    <div style={{fontSize:11,color:"#6b7280",marginTop:3}}>"{c.alasan}"</div>
                  </div>
                  <span className="kr-badge" style={{color:STATUS_CUTI[c.status]?.color,background:STATUS_CUTI[c.status]?.bg,flexShrink:0}}>
                    {STATUS_CUTI[c.status]?.label}
                  </span>
                </div>
                {c.status==="pending" && !isReadOnly && (
                  <div className="kr-req-actions">
                    <button className="kr-btn success" style={{maxWidth:120,padding:"6px 10px",fontSize:11}} onClick={()=>handleApproveCuti(c.id,true)}>\u2705 Setujui</button>
                    <button className="kr-btn danger"  style={{maxWidth:120,padding:"6px 10px",fontSize:11}} onClick={()=>handleApproveCuti(c.id,false)}>\u2715 Tolak</button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Modals */}
      {showModal && (
        <ModalKaryawan
          karyawan={editData}
          onClose={()=>{ setShow(false); setEditData(null); }}
          onSave={handleSave}
        />
      )}
      {showCuti && selected && (
        <ModalCuti
          karyawan={selected}
          onClose={()=>setShowCuti(false)}
          onSave={c=>setCutiList(prev=>[...prev,c])}
        />
      )}
    </div>
  );
}