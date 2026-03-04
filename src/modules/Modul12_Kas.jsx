import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";

// ============================================================
// CSS
// ============================================================
const CSS = `
  .ks-wrap { display: flex; flex-direction: column; gap: 16px; }

  /* Cards */
  .ks-cards { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; }
  .ks-card  { background:#fff; border-radius:12px; border:1px solid #e5e7eb; padding:14px 16px; position:relative; overflow:hidden; }
  .ks-card-bar { position:absolute; top:0; left:0; right:0; height:3px; }
  .ks-card-label { font-size:10px; font-weight:500; color:#9ca3af; text-transform:uppercase; letter-spacing:.8px; margin-bottom:4px; margin-top:8px; }
  .ks-card-val   { font-size:18px; font-weight:700; color:#111827; font-family:'JetBrains Mono',monospace; }
  .ks-card-sub   { font-size:11px; color:#6b7280; margin-top:3px; }

  /* Tabs */
  .ks-tabs { display:flex; gap:2px; background:#fff; border-radius:12px; border:1px solid #e5e7eb; padding:5px; }
  .ks-tab  { flex:1; padding:8px 12px; font-size:12px; font-weight:600; color:#9ca3af; cursor:pointer; border-radius:8px; text-align:center; transition:all .15s; }
  .ks-tab:hover { color:#374151; background:#f9fafb; }
  .ks-tab.active { color:#fff; background:linear-gradient(135deg,#f97316,#ea580c); box-shadow:0 2px 8px rgba(249,115,22,.25); }

  /* Widget */
  .ks-widget { background:#fff; border-radius:12px; border:1px solid #e5e7eb; overflow:hidden; }
  .ks-widget-head { padding:13px 16px 10px; border-bottom:1px solid #f3f4f6; display:flex; align-items:center; justify-content:space-between; }
  .ks-widget-title { font-size:12px; font-weight:600; color:#111827; display:flex; align-items:center; gap:6px; }
  .ks-widget-body { padding:16px; }

  /* Layout jurnal */
  .ks-layout { display:grid; grid-template-columns:1fr 340px; gap:14px; align-items:start; }

  /* Filter */
  .ks-filterbar { display:flex; align-items:center; gap:8px; padding:10px 14px; border-bottom:1px solid #f3f4f6; flex-wrap:wrap; }
  .ks-search { display:flex; align-items:center; gap:7px; background:#f9fafb; border:1.5px solid #e5e7eb; border-radius:8px; padding:6px 11px; flex:1; max-width:220px; }
  .ks-search:focus-within { border-color:#f97316; background:#fff; }
  .ks-search input { border:none; outline:none; background:transparent; font-size:12px; color:#1f2937; width:100%; font-family:inherit; }
  .ks-select { padding:6px 10px; border-radius:8px; border:1.5px solid #e5e7eb; font-size:12px; color:#374151; background:#fff; outline:none; font-family:inherit; cursor:pointer; }
  .ks-select:focus { border-color:#f97316; }

  /* Jurnal list */
  .ks-row { display:flex; align-items:center; gap:12px; padding:10px 16px; border-bottom:1px solid #f3f4f6; transition:background .1s; }
  .ks-row:last-child { border-bottom:none; }
  .ks-row:hover { background:#fafafa; }
  .ks-row-icon { width:34px; height:34px; border-radius:9px; display:flex; align-items:center; justify-content:center; font-size:15px; flex-shrink:0; }
  .ks-row-info { flex:1; min-width:0; }
  .ks-row-desc { font-size:12px; font-weight:500; color:#1f2937; }
  .ks-row-meta { font-size:10px; color:#9ca3af; margin-top:2px; display:flex; gap:8px; }
  .ks-row-right { text-align:right; flex-shrink:0; }
  .ks-row-nominal { font-size:13px; font-weight:700; font-family:'JetBrains Mono',monospace; }
  .ks-row-tgl { font-size:10px; color:#9ca3af; margin-top:2px; }
  .ks-badge { display:inline-flex; align-items:center; gap:3px; padding:2px 8px; border-radius:20px; font-size:10px; font-weight:600; }

  /* Budget saku */
  .ks-saku-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
  .ks-saku-card { background:#f9fafb; border-radius:10px; padding:12px 14px; border:1px solid #e5e7eb; }
  .ks-saku-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; }
  .ks-saku-name { font-size:12px; font-weight:600; color:#1f2937; }
  .ks-saku-pct  { font-size:10px; color:#f97316; font-weight:700; }
  .ks-saku-bar  { height:6px; background:#e5e7eb; border-radius:3px; overflow:hidden; margin-bottom:6px; }
  .ks-saku-fill { height:100%; border-radius:3px; transition:width .4s; }
  .ks-saku-vals { display:flex; justify-content:space-between; font-size:10px; }
  .ks-saku-used { color:#374151; font-weight:600; font-family:'JetBrains Mono',monospace; }
  .ks-saku-total{ color:#9ca3af; font-family:'JetBrains Mono',monospace; }

  /* Aset */
  .ks-aset-row { display:flex; align-items:center; justify-content:space-between; padding:10px 0; border-bottom:1px solid #f3f4f6; }
  .ks-aset-row:last-child { border-bottom:none; }
  .ks-aset-name { font-size:12px; font-weight:600; color:#1f2937; }
  .ks-aset-sub  { font-size:10px; color:#9ca3af; margin-top:2px; }
  .ks-aset-right{ text-align:right; }
  .ks-aset-val  { font-size:12px; font-weight:700; color:#ea580c; font-family:'JetBrains Mono',monospace; }
  .ks-aset-dep  { font-size:10px; color:#9ca3af; margin-top:2px; }

  /* Rekening */
  .ks-rek-card { background:linear-gradient(135deg,#1e293b,#374151); border-radius:12px; padding:16px; color:#fff; margin-bottom:10px; }
  .ks-rek-bank { font-size:11px; color:#94a3b8; font-weight:600; text-transform:uppercase; letter-spacing:.8px; margin-bottom:4px; }
  .ks-rek-name { font-size:14px; font-weight:700; margin-bottom:8px; }
  .ks-rek-no   { font-size:13px; font-family:'JetBrains Mono',monospace; letter-spacing:2px; color:#e2e8f0; }
  .ks-rek-saldo{ font-size:18px; font-weight:800; color:#f97316; margin-top:10px; font-family:'JetBrains Mono',monospace; }

  /* Modal */
  .ks-overlay { position:fixed !important; top:0 !important; left:0 !important; width:100vw !important; height:100vh !important; background:rgba(17,24,39,.65) !important; backdrop-filter:blur(4px) !important; z-index:9999 !important; display:flex !important; align-items:center !important; justify-content:center !important; padding:16px !important; box-sizing:border-box !important; animation:ksFade .18s ease; }
  @keyframes ksFade { from{opacity:0} to{opacity:1} }
  .ks-modal { background:#fff; border-radius:16px; width:100%; max-width:500px; max-height:88vh; overflow-y:auto; box-shadow:0 24px 64px rgba(0,0,0,.18); animation:ksSlide .2s cubic-bezier(.4,0,.2,1); }
  @keyframes ksSlide { from{transform:translateY(16px);opacity:0} to{transform:translateY(0);opacity:1} }
  .ks-modal-head { padding:15px 20px 12px; border-bottom:1px solid #f3f4f6; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; background:#fff; z-index:1; }
  .ks-modal-title { font-size:14px; font-weight:700; color:#111827; }
  .ks-modal-close { width:28px; height:28px; border-radius:7px; background:#f3f4f6; border:none; cursor:pointer; font-size:14px; color:#6b7280; display:flex; align-items:center; justify-content:center; }
  .ks-modal-close:hover { background:#fee2e2; color:#dc2626; }
  .ks-modal-body { padding:16px 20px; }
  .ks-modal-foot { padding:12px 20px; border-top:1px solid #f3f4f6; display:flex; gap:8px; }

  .ks-field { margin-bottom:12px; }
  .ks-field-label { font-size:11px; font-weight:600; color:#374151; margin-bottom:5px; display:block; }
  .ks-input { width:100%; padding:8px 11px; border-radius:8px; border:1.5px solid #e5e7eb; font-size:12px; font-family:inherit; color:#1f2937; outline:none; background:#fff; transition:border-color .12s; box-sizing:border-box; }
  .ks-input:focus { border-color:#f97316; }
  .ks-input-row { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
  .ks-divider { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#9ca3af; margin:14px 0 10px; display:flex; align-items:center; gap:6px; }
  .ks-divider::after { content:''; flex:1; height:1px; background:#f3f4f6; }

  .ks-tipe-row { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:14px; }
  .ks-tipe-btn { padding:10px; border-radius:10px; border:1.5px solid #e5e7eb; cursor:pointer; text-align:center; background:#fff; font-family:inherit; transition:all .15s; }
  .ks-tipe-btn.active-in  { border-color:#16a34a; background:#f0fdf4; }
  .ks-tipe-btn.active-out { border-color:#dc2626; background:#fee2e2; }
  .ks-tipe-icon  { font-size:20px; margin-bottom:4px; }
  .ks-tipe-label { font-size:12px; font-weight:600; }

  .ks-btn { flex:1; padding:9px 14px; border-radius:8px; font-size:12px; font-weight:600; border:none; cursor:pointer; font-family:inherit; transition:all .15s; display:flex; align-items:center; justify-content:center; gap:5px; }
  .ks-btn.primary { background:linear-gradient(135deg,#f97316,#ea580c); color:#fff; box-shadow:0 3px 10px rgba(249,115,22,.25); }
  .ks-btn.ghost   { background:#f3f4f6; color:#4b5563; }
  .ks-btn.success { background:linear-gradient(135deg,#16a34a,#15803d); color:#fff; }
  .ks-btn:disabled { opacity:.4; cursor:not-allowed; }

  /* PDF btn */
  .ks-pdf-btn { display:flex; align-items:center; gap:6px; padding:6px 12px; border-radius:8px; border:1.5px solid #e5e7eb; background:#fff; font-size:11px; font-weight:600; color:#374151; cursor:pointer; font-family:inherit; transition:all .12s; }
  .ks-pdf-btn:hover { border-color:#f97316; color:#ea580c; }

  .ks-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:40px 16px; color:#9ca3af; text-align:center; gap:8px; }
  .ks-empty-icon { font-size:32px; opacity:.4; }
  .ks-empty-title { font-size:13px; font-weight:600; color:#374151; }

  @media(max-width:1024px){ .ks-layout{grid-template-columns:1fr} }
  @media(max-width:768px) { .ks-cards{grid-template-columns:repeat(2,1fr)} .ks-saku-grid{grid-template-columns:1fr} }
  @media(max-width:480px) { .ks-cards{grid-template-columns:repeat(2,1fr);gap:8px} .ks-input-row{grid-template-columns:1fr} }
`;

function StyleInjector() {
  useEffect(() => {
    const id = "senyuminn-kas-css";
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
const padD    = (n) => String(n).padStart(2,"0");
const todayStr= (()=>{ const d=new Date(); return `${d.getFullYear()}-${padD(d.getMonth()+1)}-${padD(d.getDate())}`; })();
const thisMonth = todayStr.slice(0,7);
const fmtRp   = (n) => n!=null ? "Rp "+Number(n).toLocaleString("id-ID") : "—";
const fmtRpShort = (n) => {
  if (!n) return "Rp 0";
  if (Math.abs(n)>=1000000) return "Rp "+(n/1000000).toFixed(1)+"jt";
  if (Math.abs(n)>=1000)    return "Rp "+(n/1000).toFixed(0)+"rb";
  return "Rp "+n;
};

const KATEGORI_PEMASUKAN  = ["Sewa Kamar","Denda Keterlambatan","Lain-lain"];

// Kategori aset & aturan depresiasi
const KATEGORI_ASET = [
  { id:"tanah",       label:"Tanah",              dep:false, umurDefault:0,  icon:"🏞️",  note:"Tidak didepresiasi — nilai tetap" },
  { id:"bangunan",    label:"Bangunan",            dep:true,  umurDefault:20, icon:"🏠",  note:"Depresiasi garis lurus" },
  { id:"kendaraan",   label:"Kendaraan",           dep:true,  umurDefault:5,  icon:"🚗",  note:"Depresiasi garis lurus" },
  { id:"elektronik",  label:"Elektronik / AC",     dep:true,  umurDefault:5,  icon:"❄️",  note:"Depresiasi garis lurus" },
  { id:"furnitur",    label:"Furnitur & Perabot",  dep:true,  umurDefault:8,  icon:"🪑",  note:"Depresiasi garis lurus" },
  { id:"peralatan",   label:"Peralatan Kantor",    dep:true,  umurDefault:4,  icon:"🖥️",  note:"Depresiasi garis lurus" },
  { id:"lainnya",     label:"Lainnya",             dep:true,  umurDefault:5,  icon:"📦",  note:"Depresiasi garis lurus" },
];

const getKategoriAset = (id) => KATEGORI_ASET.find(k=>k.id===id) || KATEGORI_ASET[6];
const isDep = (kategori) => getKategoriAset(kategori)?.dep !== false;
const KATEGORI_PENGELUARAN = ["Management Fee","Gaji & Insentif","Peralatan","Listrik/Internet/Air","Maintenance","Akomodasi/Op","Perlengkapan","THR","Prive/Dividen","Lain-lain"];
// sakuConfig diambil dari globalData (diatur di Pengaturan)
// Default ada di Shell globalData

// ============================================================
// MODAL TAMBAH TRANSAKSI
// ============================================================
function ModalTransaksi({ onClose, onSave, rekeningList }) {
  const [form, setForm] = useState({
    tipe:"pemasukan", tanggal:todayStr, keterangan:"",
    kategori:"", nominal:"", rekening: rekeningList[0]?.id || "",
    catatan:"",
  });
  const set = (k,v) => setForm(p=>({...p,[k]:v}));

  const kategoriList = form.tipe==="pemasukan" ? KATEGORI_PEMASUKAN : KATEGORI_PENGELUARAN;
  const valid = form.keterangan && form.kategori && form.nominal && Number(form.nominal)>0;

  return createPortal(
    <div className="ks-overlay" onClick={onClose}>
      <div className="ks-modal" onClick={e=>e.stopPropagation()}>
        <div className="ks-modal-head">
          <div className="ks-modal-title">➕ Tambah Transaksi</div>
          <button className="ks-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="ks-modal-body">

          {/* Tipe */}
          <div className="ks-tipe-row">
            {[
              { val:"pemasukan",  icon:"⬆️", label:"Pemasukan",  cls:"active-in"  },
              { val:"pengeluaran",icon:"⬇️", label:"Pengeluaran",cls:"active-out" },
            ].map(t=>(
              <div key={t.val} className={`ks-tipe-btn ${form.tipe===t.val?t.cls:""}`} onClick={()=>set("tipe",t.val)}>
                <div className="ks-tipe-icon">{t.icon}</div>
                <div className="ks-tipe-label" style={{color:form.tipe===t.val?(t.val==="pemasukan"?"#16a34a":"#dc2626"):"#6b7280"}}>{t.label}</div>
              </div>
            ))}
          </div>

          <div className="ks-input-row">
            <div className="ks-field">
              <label className="ks-field-label">Tanggal</label>
              <input type="date" className="ks-input" value={form.tanggal} onChange={e=>set("tanggal",e.target.value)} />
            </div>
            <div className="ks-field">
              <label className="ks-field-label">Kategori</label>
              <select className="ks-input" value={form.kategori} onChange={e=>set("kategori",e.target.value)}>
                <option value="">Pilih kategori</option>
                {kategoriList.map(k=><option key={k} value={k}>{k}</option>)}
              </select>
            </div>
          </div>

          <div className="ks-field">
            <label className="ks-field-label">Keterangan</label>
            <input className="ks-input" placeholder="Deskripsi transaksi..." value={form.keterangan} onChange={e=>set("keterangan",e.target.value)} />
          </div>

          <div className="ks-input-row">
            <div className="ks-field">
              <label className="ks-field-label">Nominal (Rp)</label>
              <input type="number" className="ks-input" placeholder="0" value={form.nominal} onChange={e=>set("nominal",e.target.value)} />
            </div>
            <div className="ks-field">
              <label className="ks-field-label">Rekening</label>
              <select className="ks-input" value={form.rekening} onChange={e=>set("rekening",e.target.value)}>
                {rekeningList.length===0 && <option value="">Kas Umum</option>}
                {rekeningList.map(r=><option key={r.id} value={r.id}>{r.bank} — {r.nama}</option>)}
              </select>
            </div>
          </div>

          <div className="ks-field">
            <label className="ks-field-label">Catatan (opsional)</label>
            <textarea className="ks-input" rows={2} placeholder="Nomor bukti, referensi, dll..." value={form.catatan} onChange={e=>set("catatan",e.target.value)} style={{resize:"none"}} />
          </div>

          {/* Preview double entry */}
          {form.keterangan && form.nominal && (
            <>
              <div className="ks-divider">Preview Jurnal (Double Entry)</div>
              <div style={{background:"#f9fafb",borderRadius:10,padding:"10px 14px",fontSize:11}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 80px 80px",gap:6,marginBottom:6,fontWeight:700,color:"#9ca3af",fontSize:10}}>
                  <span>Akun</span><span style={{textAlign:"right"}}>Debit</span><span style={{textAlign:"right"}}>Kredit</span>
                </div>
                {form.tipe==="pemasukan" ? (
                  <>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 80px 80px",gap:6,fontSize:11,padding:"4px 0",borderBottom:"1px solid #e5e7eb"}}>
                      <span style={{color:"#374151"}}>Kas / Bank</span>
                      <span style={{textAlign:"right",fontWeight:600,color:"#16a34a",fontFamily:"monospace"}}>{fmtRpShort(Number(form.nominal))}</span>
                      <span style={{textAlign:"right",color:"#9ca3af"}}>—</span>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 80px 80px",gap:6,fontSize:11,padding:"4px 0"}}>
                      <span style={{color:"#374151",paddingLeft:12}}>{form.kategori||"Pendapatan"}</span>
                      <span style={{textAlign:"right",color:"#9ca3af"}}>—</span>
                      <span style={{textAlign:"right",fontWeight:600,color:"#16a34a",fontFamily:"monospace"}}>{fmtRpShort(Number(form.nominal))}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 80px 80px",gap:6,fontSize:11,padding:"4px 0",borderBottom:"1px solid #e5e7eb"}}>
                      <span style={{color:"#374151"}}>{form.kategori||"Beban"}</span>
                      <span style={{textAlign:"right",fontWeight:600,color:"#dc2626",fontFamily:"monospace"}}>{fmtRpShort(Number(form.nominal))}</span>
                      <span style={{textAlign:"right",color:"#9ca3af"}}>—</span>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 80px 80px",gap:6,fontSize:11,padding:"4px 0"}}>
                      <span style={{color:"#374151",paddingLeft:12}}>Kas / Bank</span>
                      <span style={{textAlign:"right",color:"#9ca3af"}}>—</span>
                      <span style={{textAlign:"right",fontWeight:600,color:"#dc2626",fontFamily:"monospace"}}>{fmtRpShort(Number(form.nominal))}</span>
                    </div>
                  </>
                )}
              </div>
            </>
          )}

        </div>
        <div className="ks-modal-foot">
          <button className="ks-btn primary" disabled={!valid} onClick={()=>{ onSave({...form, id:Date.now(), nominal:Number(form.nominal)}); onClose(); }}>
            ✅ Simpan Transaksi
          </button>
          <button className="ks-btn ghost" onClick={onClose}>Batal</button>
        </div>
      </div>
    </div>
  , document.body);
}

// ============================================================
// MODAL TAMBAH ASET
// ============================================================
function ModalAset({ onClose, onSave }) {
  const [form,setForm] = useState({ nama:"", kategori:"elektronik", nilaiPerolehan:"", umurEkonomis:"5", tanggalBeli:todayStr });
  const set = (k,v) => setForm(p=>({...p,[k]:v}));

  // Saat kategori berubah, auto-set umur default & nonaktifkan dep jika tanah
  const handleKategori = (id) => {
    const kat = getKategoriAset(id);
    setForm(p=>({...p, kategori:id, umurEkonomis: String(kat.umurDefault||5)}));
  };

  const tidakDep = !isDep(form.kategori);
  const depPerBulan = !tidakDep && form.nilaiPerolehan && form.umurEkonomis
    ? Math.round(Number(form.nilaiPerolehan) / (Number(form.umurEkonomis)*12))
    : 0;
  const valid = form.nama && form.nilaiPerolehan && Number(form.nilaiPerolehan)>0;

  return createPortal(
    <div className="ks-overlay" onClick={onClose}>
      <div className="ks-modal" onClick={e=>e.stopPropagation()} style={{maxWidth:420}}>
        <div className="ks-modal-head">
          <div className="ks-modal-title">🏷️ Tambah Aset</div>
          <button className="ks-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="ks-modal-body">
          {/* Kategori */}
          <div className="ks-field">
            <label className="ks-field-label">Kategori Aset</label>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:4}}>
              {KATEGORI_ASET.map(k=>(
                <div
                  key={k.id}
                  onClick={()=>handleKategori(k.id)}
                  style={{
                    padding:"7px 6px",borderRadius:8,textAlign:"center",cursor:"pointer",
                    border:`1.5px solid ${form.kategori===k.id?"#f97316":"#e5e7eb"}`,
                    background:form.kategori===k.id?"#fff7ed":"#fff",
                    transition:"all .12s"
                  }}
                >
                  <div style={{fontSize:16,marginBottom:2}}>{k.icon}</div>
                  <div style={{fontSize:10,fontWeight:600,color:form.kategori===k.id?"#ea580c":"#6b7280"}}>{k.label}</div>
                </div>
              ))}
            </div>
            {tidakDep && (
              <div style={{background:"#f0fdf4",border:"1px solid #86efac",borderRadius:7,padding:"6px 10px",fontSize:11,color:"#15803d",fontWeight:500}}>
                ✅ {getKategoriAset(form.kategori).note}
              </div>
            )}
          </div>

          <div className="ks-field">
            <label className="ks-field-label">Nama Aset</label>
            <input className="ks-input" placeholder="Contoh: Tanah Jl. Mawar No.5, Bangunan Kost..." value={form.nama} onChange={e=>set("nama",e.target.value)} />
          </div>

          <div className="ks-input-row">
            <div className="ks-field">
              <label className="ks-field-label">Nilai Perolehan (Rp)</label>
              <input type="number" className="ks-input" placeholder="0" value={form.nilaiPerolehan} onChange={e=>set("nilaiPerolehan",e.target.value)} />
            </div>
            <div className="ks-field">
              <label className="ks-field-label">
                Umur Ekonomis (tahun)
                {tidakDep && <span style={{color:"#9ca3af",fontWeight:400}}> — N/A</span>}
              </label>
              <select className="ks-input" value={form.umurEkonomis} onChange={e=>set("umurEkonomis",e.target.value)} disabled={tidakDep} style={{opacity:tidakDep?.4:1}}>
                {[1,2,3,4,5,8,10,15,20,25,30,40,50].map(y=><option key={y} value={y}>{y} tahun</option>)}
              </select>
            </div>
          </div>

          <div className="ks-field">
            <label className="ks-field-label">Tanggal Perolehan</label>
            <input type="date" className="ks-input" value={form.tanggalBeli} onChange={e=>set("tanggalBeli",e.target.value)} />
          </div>

          {/* Preview depresiasi */}
          {form.nilaiPerolehan && (
            <div style={{background:tidakDep?"#f0fdf4":"#fff7ed",border:`1px solid ${tidakDep?"#86efac":"#fed7aa"}`,borderRadius:8,padding:"10px 12px",fontSize:12}}>
              {tidakDep ? (
                <div style={{color:"#15803d",fontWeight:600}}>
                  🏞️ Tanah tidak didepresiasi — nilai buku tetap <b>{fmtRp(Number(form.nilaiPerolehan))}</b> selamanya
                </div>
              ) : depPerBulan>0 ? (
                <>
                  <div style={{color:"#9a3412",fontWeight:600,marginBottom:6}}>📊 Estimasi Depresiasi (Garis Lurus)</div>
                  <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
                    <div><span style={{color:"#9ca3af"}}>Per bulan: </span><b style={{color:"#ea580c"}}>{fmtRp(depPerBulan)}</b></div>
                    <div><span style={{color:"#9ca3af"}}>Per tahun: </span><b style={{color:"#ea580c"}}>{fmtRp(depPerBulan*12)}</b></div>
                    <div><span style={{color:"#9ca3af"}}>Nilai sisa: </span><b style={{color:"#6b7280"}}>Rp 0 (habis {form.umurEkonomis} thn)</b></div>
                  </div>
                </>
              ) : null}
            </div>
          )}
        </div>
        <div className="ks-modal-foot">
          <button className="ks-btn primary" disabled={!valid} onClick={()=>{ onSave({...form,id:Date.now(),nilaiPerolehan:Number(form.nilaiPerolehan),depPerBulan:isDep(form.kategori)?depPerBulan:0,tidakDep:!isDep(form.kategori)}); onClose(); }}>
            ✅ Simpan Aset
          </button>
          <button className="ks-btn ghost" onClick={onClose}>Batal</button>
        </div>
      </div>
    </div>
  , document.body);
}

// ============================================================
// TAB: JURNAL
// ============================================================
function TabJurnal({ kasJurnal, setKasJurnal, rekeningList }) {
  const [search,    setSearch]  = useState("");
  const [filterTipe,setFT]      = useState("all");
  const [filterBln, setFB]      = useState(thisMonth);
  const [showModal, setShow]    = useState(false);

  const filtered = kasJurnal.filter(t=>{
    if (filterTipe!=="all" && t.tipe!==filterTipe) return false;
    if (filterBln!=="all"  && !t.tanggal?.startsWith(filterBln)) return false;
    if (search){ const q=search.toLowerCase(); return t.keterangan?.toLowerCase().includes(q)||t.kategori?.toLowerCase().includes(q); }
    return true;
  }).sort((a,b)=>b.tanggal?.localeCompare(a.tanggal));

  const totalIn  = filtered.filter(t=>t.tipe==="pemasukan").reduce((s,t)=>s+t.nominal,0);
  const totalOut = filtered.filter(t=>t.tipe==="pengeluaran").reduce((s,t)=>s+t.nominal,0);

  const downloadPDF = () => {
    const rows = filtered.map(t=>[t.tanggal,t.keterangan,t.kategori,t.tipe==="pemasukan"?fmtRp(t.nominal):"",t.tipe==="pengeluaran"?fmtRp(t.nominal):"",]);
    const csv  = ["Tanggal,Keterangan,Kategori,Debit,Kredit",...rows.map(r=>r.join(","))].join("\n");
    const blob = new Blob([csv],{type:"text/csv"});
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a"); a.href=url; a.download=`jurnal-${filterBln}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="ks-layout">
      <div className="ks-widget">
        <div className="ks-widget-head">
          <div className="ks-widget-title">📒 Jurnal Transaksi</div>
          <div style={{display:"flex",gap:8}}>
            <button className="ks-pdf-btn" onClick={downloadPDF}>⬇️ Export CSV</button>
            <button className="ks-btn primary" style={{flex:"none",padding:"6px 14px",fontSize:12}} onClick={()=>setShow(true)}>
              ➕ Tambah
            </button>
          </div>
        </div>
        <div className="ks-filterbar">
          <div className="ks-search">
            <span>🔍</span>
            <input placeholder="Cari keterangan..." value={search} onChange={e=>setSearch(e.target.value)} />
          </div>
          <select className="ks-select" value={filterTipe} onChange={e=>setFT(e.target.value)}>
            <option value="all">Semua Tipe</option>
            <option value="pemasukan">⬆️ Pemasukan</option>
            <option value="pengeluaran">⬇️ Pengeluaran</option>
          </select>
          <select className="ks-select" value={filterBln} onChange={e=>setFB(e.target.value)}>
            <option value="all">Semua Bulan</option>
            {[...new Set(kasJurnal.map(t=>t.tanggal?.slice(0,7)))].filter(Boolean).sort().reverse().map(b=>(
              <option key={b} value={b}>{b}</option>
            ))}
            <option value={thisMonth}>{thisMonth} (Ini)</option>
          </select>
        </div>

        {/* Summary bar */}
        <div style={{display:"flex",gap:0,borderBottom:"1px solid #f3f4f6"}}>
          {[
            {label:"Total Pemasukan", val:fmtRp(totalIn),  color:"#16a34a",bg:"#f0fdf4"},
            {label:"Total Pengeluaran",val:fmtRp(totalOut), color:"#dc2626",bg:"#fff5f5"},
            {label:"Net",             val:fmtRp(totalIn-totalOut), color:totalIn-totalOut>=0?"#16a34a":"#dc2626",bg:"#f9fafb"},
          ].map((s,i)=>(
            <div key={i} style={{flex:1,padding:"10px 16px",background:s.bg,borderRight:i<2?"1px solid #f3f4f6":"none"}}>
              <div style={{fontSize:9,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:.8,marginBottom:2}}>{s.label}</div>
              <div style={{fontSize:13,fontWeight:700,color:s.color,fontFamily:"JetBrains Mono,monospace"}}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* List */}
        {kasJurnal.length===0 ? (
          <div className="ks-empty">
            <div className="ks-empty-icon">📒</div>
            <div className="ks-empty-title">Belum ada transaksi</div>
            <div style={{fontSize:11,color:"#9ca3af"}}>Tambah transaksi manual atau konfirmasi tagihan di Modul Tagihan</div>
          </div>
        ) : filtered.length===0 ? (
          <div className="ks-empty"><div className="ks-empty-icon">🔍</div><div className="ks-empty-title">Tidak ditemukan</div></div>
        ) : (
          filtered.map(t=>(
            <div key={t.id} className="ks-row">
              <div className="ks-row-icon" style={{background:t.tipe==="pemasukan"?"#f0fdf4":"#fee2e2"}}>
                {t.tipe==="pemasukan"?"⬆️":"⬇️"}
              </div>
              <div className="ks-row-info">
                <div className="ks-row-desc">{t.keterangan}</div>
                <div className="ks-row-meta">
                  <span>{t.kategori}</span>
                  {t.catatan && <span>· {t.catatan}</span>}
                </div>
              </div>
              <div className="ks-row-right">
                <div className="ks-row-nominal" style={{color:t.tipe==="pemasukan"?"#16a34a":"#dc2626"}}>
                  {t.tipe==="pemasukan"?"+":"-"}{fmtRp(t.nominal)}
                </div>
                <div className="ks-row-tgl">{t.tanggal}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Panel kanan — rekening */}
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        <div className="ks-widget">
          <div className="ks-widget-head"><div className="ks-widget-title">🏦 Rekening</div></div>
          <div className="ks-widget-body">
            {rekeningList.length===0 ? (
              <div style={{fontSize:12,color:"#9ca3af",textAlign:"center",padding:"16px 0"}}>Rekening diatur di Profil Kost</div>
            ) : (
              rekeningList.map(r=>(
                <div key={r.id} className="ks-rek-card">
                  <div className="ks-rek-bank">{r.bank}</div>
                  <div className="ks-rek-name">{r.nama}</div>
                  <div className="ks-rek-no">{r.noRekening}</div>
                  <div className="ks-rek-saldo">{fmtRp(r.saldo||0)}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick stats */}
        <div className="ks-widget">
          <div className="ks-widget-head"><div className="ks-widget-title">📊 Bulan {thisMonth}</div></div>
          <div className="ks-widget-body" style={{padding:"8px 16px"}}>
            {[
              {k:"Pemasukan",   v:fmtRp(kasJurnal.filter(t=>t.tipe==="pemasukan"&&t.tanggal?.startsWith(thisMonth)).reduce((s,t)=>s+t.nominal,0)),  c:"#16a34a"},
              {k:"Pengeluaran", v:fmtRp(kasJurnal.filter(t=>t.tipe==="pengeluaran"&&t.tanggal?.startsWith(thisMonth)).reduce((s,t)=>s+t.nominal,0)), c:"#dc2626"},
              {k:"Net Cashflow",v:fmtRp(kasJurnal.filter(t=>t.tanggal?.startsWith(thisMonth)).reduce((s,t)=>t.tipe==="pemasukan"?s+t.nominal:s-t.nominal,0)), c:"#f97316"},
            ].map((r,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:i<2?"1px solid #f3f4f6":"none"}}>
                <span style={{fontSize:11,color:"#6b7280"}}>{r.k}</span>
                <span style={{fontSize:12,fontWeight:700,color:r.c,fontFamily:"JetBrains Mono,monospace"}}>{r.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && <ModalTransaksi onClose={()=>setShow(false)} onSave={t=>setKasJurnal(p=>[...p,t])} rekeningList={rekeningList} />}
    </div>
  );
}


// ============================================================
// MODAL EDIT KONFIGURASI SAKU
// ============================================================
function ModalEditSaku({ sakuConfig, onClose, onSave }) {
  const [rows, setRows] = useState(sakuConfig.map(s => ({...s})));
  const setRow = (kode, k, v) => setRows(prev => prev.map(r => r.kode===kode ? {...r,[k]:v} : r));

  const totalPct = rows.filter(r=>r.tipe==="pct").reduce((s,r)=>s+Number(r.nilai||0),0);

  return createPortal(
    <div className="ks-overlay" onClick={onClose}>
      <div className="ks-modal" onClick={e=>e.stopPropagation()} style={{maxWidth:520}}>
        <div className="ks-modal-head">
          <div className="ks-modal-title">⚙️ Konfigurasi Saku Budget</div>
          <button className="ks-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="ks-modal-body">

          <div style={{background:"#fff7ed",border:"1px solid #fed7aa",borderRadius:8,padding:"8px 12px",fontSize:11,color:"#92400e",marginBottom:14}}>
            ℹ️ Persentase dihitung dari total pemasukan bulan berjalan. Flat = nominal tetap per bulan.
          </div>

          {/* Header */}
          <div style={{display:"grid",gridTemplateColumns:"28px 1fr 90px 110px",gap:8,padding:"0 4px",marginBottom:6}}>
            {["Kode","Nama Saku","Tipe","Nilai"].map((h,i)=>(
              <div key={i} style={{fontSize:10,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:.6}}>{h}</div>
            ))}
          </div>

          {/* Rows */}
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {rows.map(r=>(
              <div key={r.kode} style={{display:"grid",gridTemplateColumns:"28px 1fr 90px 110px",gap:8,alignItems:"center"}}>
                {/* Kode badge */}
                <div style={{width:24,height:24,borderRadius:6,background:r.color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:r.color}}>
                  {r.kode}
                </div>
                {/* Nama */}
                <input
                  className="ks-input" value={r.nama}
                  onChange={e=>setRow(r.kode,"nama",e.target.value)}
                  style={{fontSize:12}}
                />
                {/* Tipe */}
                <select className="ks-input" value={r.tipe} onChange={e=>setRow(r.kode,"tipe",e.target.value)}>
                  <option value="pct">% Persen</option>
                  <option value="flat">Flat Rp</option>
                </select>
                {/* Nilai */}
                <div style={{position:"relative"}}>
                  <input
                    type="number" className="ks-input"
                    value={r.nilai}
                    onChange={e=>setRow(r.kode,"nilai",e.target.value)}
                    style={{fontFamily:"JetBrains Mono,monospace",fontSize:11,paddingRight:r.tipe==="pct"?28:8}}
                    step={r.tipe==="pct"?0.5:50000}
                    min={0}
                  />
                  {r.tipe==="pct" && (
                    <span style={{position:"absolute",right:9,top:"50%",transform:"translateY(-50%)",fontSize:11,color:"#9ca3af",fontWeight:600}}>%</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Preview total % */}
          <div style={{marginTop:14,background:"#f9fafb",borderRadius:8,padding:"10px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontSize:12,color:"#374151"}}>
              Total alokasi %:&nbsp;
              <b style={{color:totalPct>100?"#dc2626":totalPct===100?"#16a34a":"#f97316"}}>
                {totalPct.toFixed(1)}%
              </b>
            </div>
            {totalPct > 100 && (
              <span style={{fontSize:11,color:"#dc2626",fontWeight:600}}>⚠️ Melebihi 100%!</span>
            )}
            {totalPct <= 100 && (
              <span style={{fontSize:11,color:"#9ca3af"}}>{(100-totalPct).toFixed(1)}% tidak dialokasikan</span>
            )}
          </div>

          {/* Preview nominal contoh */}
          <div style={{marginTop:10,background:"#f0fdf4",border:"1px solid #86efac",borderRadius:8,padding:"10px 12px"}}>
            <div style={{fontSize:10,fontWeight:700,color:"#15803d",textTransform:"uppercase",letterSpacing:.8,marginBottom:8}}>
              Preview — jika pemasukan Rp 20.000.000
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {rows.map(r=>{
                const contoh = 20000000;
                const alokasi = r.tipe==="pct"
                  ? Math.round(contoh*(Number(r.nilai||0)/100))
                  : Number(r.nilai||0);
                return (
                  <div key={r.kode} style={{background:"#fff",borderRadius:7,padding:"5px 10px",border:"1px solid #e5e7eb"}}>
                    <span style={{fontSize:10,fontWeight:700,color:r.color,marginRight:4}}>{r.kode}</span>
                    <span style={{fontSize:11,fontWeight:600,color:"#374151"}}>{fmtRp(alokasi)}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
        <div className="ks-modal-foot">
          <button className="ks-btn primary" onClick={()=>{ onSave(rows.map(r=>({...r,nilai:Number(r.nilai||0)}))); onClose(); }}>
            ✅ Simpan Konfigurasi
          </button>
          <button className="ks-btn ghost" onClick={onClose}>Batal</button>
        </div>
      </div>
    </div>
  , document.body);
}

// ============================================================
// TAB: BUDGET PLANNING
// ============================================================
function TabBudget({ kasJurnal, sakuConfig, setSakuConfig }) {
  const totalPemasukan = kasJurnal.filter(t=>t.tipe==="pemasukan"&&t.tanggal?.startsWith(thisMonth)).reduce((s,t)=>s+t.nominal,0);

  const [showEditSaku, setShowEditSaku] = useState(false);

  const saku = sakuConfig.map(s=>{
    const alokasi = s.tipe==="flat" ? s.nilai : Math.round(totalPemasukan*(s.nilai/100));
    const terpakai = s.kode==="A"
      ? kasJurnal.filter(t=>t.tipe==="pengeluaran"&&t.tanggal?.startsWith(thisMonth)&&["Perlengkapan","Akomodasi/Op","Lain-lain"].includes(t.kategori)).reduce((x,t)=>x+t.nominal,0)
      : s.kode==="B" ? 0
      : s.kode==="E"
      ? kasJurnal.filter(t=>t.tipe==="pengeluaran"&&t.tanggal?.startsWith(thisMonth)&&["Gaji & Insentif","Listrik/Internet/Air","Maintenance","Peralatan","Management Fee"].includes(t.kategori)).reduce((x,t)=>x+t.nominal,0)
      : 0;
    const pct_used = alokasi>0 ? Math.min(100,Math.round((terpakai/alokasi)*100)) : 0;
    return {...s, alokasi, terpakai, pct_used};
  });

  const totalAlokasi = saku.reduce((s,k)=>s+k.alokasi,0);
  const totalTerpakai= saku.reduce((s,k)=>s+k.terpakai,0);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      {/* Summary */}
      <div className="ks-widget">
        <div className="ks-widget-head">
          <div className="ks-widget-title">💰 Budget Planning — {thisMonth}</div>
          <button className="ks-pdf-btn" onClick={()=>setShowEditSaku(true)}>⚙️ Atur Saku</button>
        </div>
        <div className="ks-widget-body">
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:16}}>
            {[
              {k:"Total Pemasukan", v:fmtRp(totalPemasukan), c:"#16a34a"},
              {k:"Total Alokasi",   v:fmtRp(totalAlokasi),   c:"#f97316"},
              {k:"Sisa / Surplus",  v:fmtRp(totalPemasukan-totalAlokasi), c:totalPemasukan-totalAlokasi>=0?"#16a34a":"#dc2626"},
            ].map((r,i)=>(
              <div key={i} style={{background:"#f9fafb",borderRadius:10,padding:"12px 14px"}}>
                <div style={{fontSize:10,color:"#9ca3af",fontWeight:600,textTransform:"uppercase",letterSpacing:.8,marginBottom:4}}>{r.k}</div>
                <div style={{fontSize:16,fontWeight:700,color:r.c,fontFamily:"JetBrains Mono,monospace"}}>{r.v}</div>
              </div>
            ))}
          </div>

          <div className="ks-saku-grid">
            {saku.map(s=>(
              <div key={s.kode} className="ks-saku-card">
                <div className="ks-saku-header">
                  <div>
                    <span style={{fontSize:10,fontWeight:700,color:s.color,background:s.color+"22",padding:"1px 6px",borderRadius:4,marginRight:6}}>{s.kode}</span>
                    <span className="ks-saku-name">{s.nama}</span>
                  </div>
                  <span className="ks-saku-pct">
                    {s.tipe==="flat" ? fmtRpShort(s.nilai)+" flat" : `${s.nilai}%`}
                  </span>
                </div>
                <div className="ks-saku-bar">
                  <div className="ks-saku-fill" style={{width:`${s.pct_used}%`,background:s.pct_used>90?"#ef4444":s.pct_used>70?"#f97316":s.color}} />
                </div>
                <div className="ks-saku-vals">
                  <span className="ks-saku-used">{fmtRp(s.terpakai)}</span>
                  <span className="ks-saku-total">/ {fmtRp(s.alokasi)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pengeluaran per kategori */}
      <div className="ks-widget">
        <div className="ks-widget-head"><div className="ks-widget-title">📊 Breakdown Pengeluaran {thisMonth}</div></div>
        <div className="ks-widget-body">
          {KATEGORI_PENGELUARAN.map(kat=>{
            const total = kasJurnal.filter(t=>t.tipe==="pengeluaran"&&t.tanggal?.startsWith(thisMonth)&&t.kategori===kat).reduce((s,t)=>s+t.nominal,0);
            if (!total) return null;
            const pct = totalAlokasi>0 ? Math.round((total/totalAlokasi)*100) : 0;
            return (
              <div key={kat} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid #f3f4f6"}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                    <span style={{fontSize:12,fontWeight:500,color:"#374151"}}>{kat}</span>
                    <span style={{fontSize:12,fontWeight:700,color:"#dc2626",fontFamily:"JetBrains Mono,monospace"}}>{fmtRp(total)}</span>
                  </div>
                  <div style={{height:4,background:"#f3f4f6",borderRadius:2,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${pct}%`,background:"#f97316",borderRadius:2}} />
                  </div>
                </div>
                <span style={{fontSize:10,color:"#9ca3af",width:30,textAlign:"right"}}>{pct}%</span>
              </div>
            );
          }).filter(Boolean)}
          {kasJurnal.filter(t=>t.tipe==="pengeluaran"&&t.tanggal?.startsWith(thisMonth)).length===0 && (
            <div style={{textAlign:"center",color:"#9ca3af",padding:"20px 0",fontSize:12}}>Belum ada pengeluaran bulan ini</div>
          )}
        </div>
      </div>
    </div>
  );
}


// ============================================================
// MODAL DATA AWAL ASET (input multiple sekaligus)
// ============================================================
function ModalDataAwalAset({ existing, onClose, onSave }) {
  const emptyRow = () => ({ id: Date.now()+Math.random(), nama:"", kategori:"elektronik", nilaiPerolehan:"", umurEkonomis:"5", tanggalBeli:todayStr });
  const [rows, setRows] = useState(
    existing.length > 0
      ? existing.map(a => ({...a, nilaiPerolehan: String(a.nilaiPerolehan), umurEkonomis: String(a.umurEkonomis)}))
      : [emptyRow()]
  );

  const setRow = (id, k, v) => setRows(prev => prev.map(r => r.id===id ? {...r,[k]:v} : r));
  const addRow = () => setRows(prev => [...prev, emptyRow()]);
  const delRow = (id) => setRows(prev => prev.filter(r => r.id!==id));

  const valid = rows.some(r => r.nama && r.nilaiPerolehan && Number(r.nilaiPerolehan)>0);

  const handleSave = () => {
    const result = rows
      .filter(r => r.nama && r.nilaiPerolehan && Number(r.nilaiPerolehan)>0)
      .map(r => ({
        ...r,
        id: typeof r.id === "number" ? r.id : Date.now()+Math.random(),
        nilaiPerolehan: Number(r.nilaiPerolehan),
        umurEkonomis:   Number(r.umurEkonomis),
        depPerBulan:    Math.round(Number(r.nilaiPerolehan) / (Number(r.umurEkonomis)*12)),
      }));
    onSave(result);
    onClose();
  };

  return createPortal(
    <div className="ks-overlay" onClick={onClose}>
      <div className="ks-modal" onClick={e=>e.stopPropagation()} style={{maxWidth:640}}>
        <div className="ks-modal-head">
          <div className="ks-modal-title">🏷️ Input Data Awal Aset</div>
          <button className="ks-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="ks-modal-body">

          <div style={{background:"#fff7ed",border:"1px solid #fed7aa",borderRadius:8,padding:"8px 12px",fontSize:11,color:"#92400e",marginBottom:14}}>
            ℹ️ Input semua aset yang sudah dimiliki sebelum sistem dipakai. Data ini dipakai untuk menghitung depresiasi & nilai buku.
          </div>

          {/* Header tabel */}
          <div style={{display:"grid",gridTemplateColumns:"100px 1fr 110px 80px 110px 32px",gap:8,marginBottom:6,padding:"0 4px"}}>
            {["Kategori","Nama Aset","Harga Beli (Rp)","Umur (thn)","Tgl Beli",""].map((h,i)=>(
              <div key={i} style={{fontSize:10,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:.6}}>{h}</div>
            ))}
          </div>

          {/* Rows */}
          <div style={{maxHeight:320,overflowY:"auto",display:"flex",flexDirection:"column",gap:6}}>
            {rows.map((r,idx) => {
              const dep = r.nilaiPerolehan && r.umurEkonomis
                ? Math.round(Number(r.nilaiPerolehan)/(Number(r.umurEkonomis)*12)) : 0;
              return (
                <div key={r.id} style={{display:"grid",gridTemplateColumns:"100px 1fr 110px 80px 110px 32px",gap:8,alignItems:"center"}}>
                  <select
                    className="ks-input" value={r.kategori||"lainnya"}
                    onChange={e=>{
                      const kat = getKategoriAset(e.target.value);
                      setRow(r.id,"kategori",e.target.value);
                      if(kat) setRow(r.id,"umurEkonomis",String(kat.umurDefault||5));
                    }}
                    style={{fontSize:11,padding:"6px 7px"}}
                  >
                    {KATEGORI_ASET.map(k=><option key={k.id} value={k.id}>{k.icon} {k.label}</option>)}
                  </select>
                  <input
                    className="ks-input" placeholder="Nama aset..."
                    value={r.nama} onChange={e=>setRow(r.id,"nama",e.target.value)}
                  />
                  <input
                    type="number" className="ks-input" placeholder="0"
                    value={r.nilaiPerolehan} onChange={e=>setRow(r.id,"nilaiPerolehan",e.target.value)}
                    style={{fontFamily:"JetBrains Mono,monospace",fontSize:11}}
                  />
                  <select
                    className="ks-input" value={r.umurEkonomis}
                    onChange={e=>setRow(r.id,"umurEkonomis",e.target.value)}
                    disabled={!isDep(r.kategori||"lainnya")}
                    style={{opacity:!isDep(r.kategori||"lainnya")?.4:1}}
                    title={!isDep(r.kategori||"lainnya")?"Tanah tidak didepresiasi":""}
                  >
                    {[1,2,3,4,5,8,10,15,20,25,30,40,50].map(y=><option key={y} value={y}>{y}</option>)}
                  </select>
                  <input
                    type="date" className="ks-input"
                    value={r.tanggalBeli} onChange={e=>setRow(r.id,"tanggalBeli",e.target.value)}
                    style={{fontSize:11}}
                  />
                  <button
                    onClick={()=>delRow(r.id)} disabled={rows.length===1}
                    style={{width:28,height:28,borderRadius:6,border:"1px solid #e5e7eb",background:"#fff",cursor:"pointer",color:"#9ca3af",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit"}}
                  >✕</button>
                </div>
              );
            })}
          </div>

          <button
            onClick={addRow}
            style={{marginTop:10,width:"100%",padding:"8px",borderRadius:8,border:"1.5px dashed #e5e7eb",background:"transparent",cursor:"pointer",fontSize:12,color:"#9ca3af",fontFamily:"inherit",transition:"all .12s"}}
            onMouseOver={e=>e.target.style.borderColor="#f97316"}
            onMouseOut={e=>e.target.style.borderColor="#e5e7eb"}
          >
            ＋ Tambah baris
          </button>

          {/* Preview total */}
          {rows.some(r=>r.nilaiPerolehan) && (
            <div style={{marginTop:12,background:"#f9fafb",borderRadius:8,padding:"10px 12px",display:"flex",gap:20,fontSize:12}}>
              <div>
                <span style={{color:"#9ca3af"}}>Total Nilai: </span>
                <b style={{color:"#3b82f6"}}>{fmtRp(rows.reduce((s,r)=>s+(Number(r.nilaiPerolehan)||0),0))}</b>
              </div>
              <div>
                <span style={{color:"#9ca3af"}}>Total Dep/bln: </span>
                <b style={{color:"#f97316"}}>{fmtRp(rows.reduce((s,r)=>s+(r.nilaiPerolehan&&r.umurEkonomis?Math.round(Number(r.nilaiPerolehan)/(Number(r.umurEkonomis)*12)):0),0))}</b>
              </div>
              <div>
                <span style={{color:"#9ca3af"}}>Jumlah aset: </span>
                <b style={{color:"#374151"}}>{rows.filter(r=>r.nama&&r.nilaiPerolehan).length}</b>
              </div>
            </div>
          )}

        </div>
        <div className="ks-modal-foot">
          <button className="ks-btn primary" disabled={!valid} onClick={handleSave}>
            ✅ Simpan Data Awal
          </button>
          <button className="ks-btn ghost" onClick={onClose}>Batal</button>
        </div>
      </div>
    </div>
  , document.body);
}

// ============================================================
// TAB: ASET & DEPRESIASI
// ============================================================
function TabAset({ asetList, setAsetList }) {
  const [showModal,     setShow]     = useState(false);
  const [showDataAwal,  setDataAwal] = useState(false);

  const totalNilai  = asetList.reduce((s,a)=>s+a.nilaiPerolehan,0);
  const totalDepBln = asetList.reduce((s,a)=>s+a.depPerBulan,0);

  // Hitung nilai buku saat ini
  const nilaiSekarang = (aset) => {
    if (aset.tidakDep) return aset.nilaiPerolehan; // Tanah — tidak berkurang
    const bulanBerlalu = Math.floor((new Date()-new Date(aset.tanggalBeli))/(1000*60*60*24*30));
    return Math.max(0, aset.nilaiPerolehan - (aset.depPerBulan * bulanBerlalu));
  };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      {/* Summary */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
        {[
          {k:"Total Aset",      v:fmtRp(totalNilai),  c:"#3b82f6"},
          {k:"Dep. per Bulan",  v:fmtRp(totalDepBln), c:"#f97316"},
          {k:"Nilai Buku",      v:fmtRp(asetList.reduce((s,a)=>s+nilaiSekarang(a),0)), c:"#16a34a"},
        ].map((r,i)=>(
          <div key={i} className="ks-card">
            <div className="ks-card-bar" style={{background:r.c}} />
            <div className="ks-card-label">{r.k}</div>
            <div className="ks-card-val" style={{fontSize:15}}>{r.v}</div>
          </div>
        ))}
      </div>

      <div className="ks-widget">
        <div className="ks-widget-head">
          <div className="ks-widget-title">🏷️ Daftar Aset</div>
          <div style={{display:"flex",gap:8}}>
            {asetList.length === 0 && (
              <button className="ks-btn ghost" style={{flex:"none",padding:"6px 12px",fontSize:12}} onClick={()=>setDataAwal(true)}>
                📋 Input Data Awal
              </button>
            )}
            {asetList.length > 0 && (
              <button className="ks-btn ghost" style={{flex:"none",padding:"6px 12px",fontSize:12}} onClick={()=>setDataAwal(true)}>
                ✏️ Edit Semua
              </button>
            )}
            <button className="ks-btn primary" style={{flex:"none",padding:"6px 14px",fontSize:12}} onClick={()=>setShow(true)}>
              ➕ Tambah Aset
            </button>
          </div>
        </div>
        <div>
          {asetList.length===0 ? (
            <div className="ks-empty">
              <div className="ks-empty-icon">🏷️</div>
              <div className="ks-empty-title">Belum ada aset</div>
              <div style={{fontSize:11,color:"#9ca3af",marginBottom:12}}>Tambah aset untuk tracking depresiasi otomatis</div>
              <button className="ks-btn primary" style={{maxWidth:200,fontSize:12}} onClick={()=>setDataAwal(true)}>
                📋 Input Data Awal
              </button>
            </div>
          ) : (
            asetList.map(a=>{
              const nb  = nilaiSekarang(a);
              const pct = Math.round((nb/a.nilaiPerolehan)*100);
              return (
                <div key={a.id} style={{padding:"12px 16px",borderBottom:"1px solid #f3f4f6"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                    <div>
                      <div style={{fontSize:13,fontWeight:600,color:"#1f2937"}}>
                        {getKategoriAset(a.kategori||"lainnya").icon} {a.nama}
                      </div>
                      <div style={{fontSize:10,color:"#9ca3af",marginTop:1,display:"flex",gap:8,flexWrap:"wrap"}}>
                        <span>Dibeli: {a.tanggalBeli}</span>
                        {a.tidakDep
                          ? <span style={{color:"#16a34a",fontWeight:600}}>✅ Tidak Didepresiasi</span>
                          : <span>Umur: {a.umurEkonomis} thn</span>
                        }
                      </div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:13,fontWeight:700,color:"#3b82f6",fontFamily:"JetBrains Mono,monospace"}}>{fmtRp(nb)}</div>
                      <div style={{fontSize:10,color:"#9ca3af"}}>Nilai buku ({pct}%)</div>
                    </div>
                  </div>
                  {a.tidakDep ? (
                    <div style={{height:5,background:"#dcfce7",borderRadius:3,marginBottom:4}}>
                      <div style={{height:"100%",width:"100%",background:"#16a34a",borderRadius:3}} />
                    </div>
                  ) : (
                    <div style={{height:5,background:"#f3f4f6",borderRadius:3,overflow:"hidden",marginBottom:4}}>
                      <div style={{height:"100%",width:`${pct}%`,background:pct>50?"#3b82f6":pct>25?"#f97316":"#ef4444",borderRadius:3,transition:"width .4s"}} />
                    </div>
                  )}
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"#9ca3af"}}>
                    <span>Harga perolehan: {fmtRp(a.nilaiPerolehan)}</span>
                    <span>{a.tidakDep ? "Nilai tetap" : `Dep/bln: ${fmtRp(a.depPerBulan)}`}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {showModal    && <ModalAset       onClose={()=>setShow(false)}     onSave={a=>setAsetList(p=>[...p,a])} />}
      {showDataAwal && <ModalDataAwalAset onClose={()=>setDataAwal(false)} existing={asetList} onSave={result=>setAsetList(result)} />}
    </div>
  );
}

// ============================================================
// MAIN
// ============================================================
export default function Kas({ user, globalData = {} }) {
  const {
    kasJurnal    = [], setKasJurnal    = ()=>{},
    tagihanList  = [],
    asetList     = [], setAsetList     = ()=>{},
    sakuConfig   = [], setSakuConfig   = ()=>{},
  } = globalData;

  const [activeTab,  setActiveTab]  = useState("jurnal");

  // Rekening dummy — nanti dari Profil Kost
  const rekeningList = [];

  // Stats header
  const inBln  = kasJurnal.filter(t=>t.tipe==="pemasukan"&&t.tanggal?.startsWith(thisMonth)).reduce((s,t)=>s+t.nominal,0);
  const outBln = kasJurnal.filter(t=>t.tipe==="pengeluaran"&&t.tanggal?.startsWith(thisMonth)).reduce((s,t)=>s+t.nominal,0);
  const piutang= tagihanList.filter(t=>t.status!=="lunas").reduce((s,t)=>s+t.nominal,0);

  return (
    <div className="ks-wrap">
      <StyleInjector />

      {/* Cards */}
      <div className="ks-cards">
        {[
          {label:"Pemasukan Bulan Ini", val:fmtRp(inBln),        color:"#16a34a", sub:`${kasJurnal.filter(t=>t.tipe==="pemasukan"&&t.tanggal?.startsWith(thisMonth)).length} transaksi`},
          {label:"Pengeluaran Bulan Ini",val:fmtRp(outBln),       color:"#dc2626", sub:`${kasJurnal.filter(t=>t.tipe==="pengeluaran"&&t.tanggal?.startsWith(thisMonth)).length} transaksi`},
          {label:"Net Cashflow",         val:fmtRp(inBln-outBln), color:inBln-outBln>=0?"#16a34a":"#dc2626", sub:"Bulan berjalan"},
          {label:"Piutang Outstanding",  val:fmtRp(piutang),      color:"#f97316", sub:`${tagihanList.filter(t=>t.status!=="lunas").length} belum lunas`},
        ].map((c,i)=>(
          <div key={i} className="ks-card">
            <div className="ks-card-bar" style={{background:c.color}} />
            <div className="ks-card-label">{c.label}</div>
            <div className="ks-card-val">{c.val}</div>
            <div className="ks-card-sub">{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="ks-tabs">
        {[
          {id:"jurnal",  label:"📒 Jurnal & Transaksi"},
          {id:"budget",  label:"💰 Budget Planning"},
          {id:"aset",    label:"🏷️ Aset & Depresiasi"},
        ].map(t=>(
          <div key={t.id} className={`ks-tab ${activeTab===t.id?"active":""}`} onClick={()=>setActiveTab(t.id)}>
            {t.label}
          </div>
        ))}
      </div>

      {/* Content */}
      {activeTab==="jurnal"  && <TabJurnal  kasJurnal={kasJurnal} setKasJurnal={setKasJurnal} rekeningList={rekeningList} />}
      {activeTab==="budget"  && <TabBudget  kasJurnal={kasJurnal} sakuConfig={sakuConfig} setSakuConfig={setSakuConfig} />}
      {activeTab==="aset"    && <TabAset    asetList={asetList} setAsetList={setAsetList} />}

    </div>
  );
}
