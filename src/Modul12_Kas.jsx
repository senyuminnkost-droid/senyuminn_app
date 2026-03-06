import { useState, useEffect, useMemo } from "react";

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
const KATEGORI_PENGELUARAN = ["Management Fee","Gaji & Insentif","Peralatan","Listrik/Internet/Air","Maintenance","Akomodasi/Op","Perlengkapan","THR","Prive/Dividen","Lain-lain"];
const SAKU_DEFAULT = [
  { kode:"A", nama:"Petty Cash",     pct:5,    flat:0,   color:"#f97316" },
  { kode:"B", nama:"General Saving", pct:23,   flat:0,   color:"#3b82f6" },
  { kode:"C", nama:"Internet",       pct:0,    flat:500000, color:"#06b6d4" },
  { kode:"D", nama:"Tax Saving",     pct:0.5,  flat:0,   color:"#8b5cf6" },
  { kode:"E", nama:"Operasional",    pct:0,    flat:0,   color:"#22c55e" },
  { kode:"F", nama:"THR Saving",     pct:0,    flat:0,   color:"#eab308" },
];

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

  return(
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
  );
}

// ============================================================
// MODAL TAMBAH ASET
// ============================================================
function ModalAset({ onClose, onSave }) {
  const [form,setForm] = useState({ nama:"", nilaiPerolehan:"", umurEkonomis:"5", tanggalBeli:todayStr });
  const set = (k,v) => setForm(p=>({...p,[k]:v}));
  const depPerBulan = form.nilaiPerolehan && form.umurEkonomis
    ? Math.round(Number(form.nilaiPerolehan) / (Number(form.umurEkonomis)*12))
    : 0;
  const valid = form.nama && form.nilaiPerolehan && Number(form.nilaiPerolehan)>0;

  return(
    <div className="ks-overlay" onClick={onClose}>
      <div className="ks-modal" onClick={e=>e.stopPropagation()} style={{maxWidth:420}}>
        <div className="ks-modal-head">
          <div className="ks-modal-title">🏷️ Tambah Aset</div>
          <button className="ks-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="ks-modal-body">
          <div className="ks-field">
            <label className="ks-field-label">Nama Aset</label>
            <input className="ks-input" placeholder="Contoh: AC Kamar 1, Kursi Kantor..." value={form.nama} onChange={e=>set("nama",e.target.value)} />
          </div>
          <div className="ks-input-row">
            <div className="ks-field">
              <label className="ks-field-label">Nilai Perolehan (Rp)</label>
              <input type="number" className="ks-input" placeholder="0" value={form.nilaiPerolehan} onChange={e=>set("nilaiPerolehan",e.target.value)} />
            </div>
            <div className="ks-field">
              <label className="ks-field-label">Umur Ekonomis (tahun)</label>
              <select className="ks-input" value={form.umurEkonomis} onChange={e=>set("umurEkonomis",e.target.value)}>
                {[1,2,3,4,5,8,10,15,20].map(y=><option key={y} value={y}>{y} tahun</option>)}
              </select>
            </div>
          </div>
          <div className="ks-field">
            <label className="ks-field-label">Tanggal Perolehan</label>
            <input type="date" className="ks-input" value={form.tanggalBeli} onChange={e=>set("tanggalBeli",e.target.value)} />
          </div>
          {depPerBulan>0 && (
            <div style={{background:"#fff7ed",border:"1px solid #fed7aa",borderRadius:8,padding:"10px 12px",fontSize:12}}>
              <div style={{color:"#9a3412",fontWeight:600,marginBottom:4}}>📊 Estimasi Depresiasi (Garis Lurus)</div>
              <div style={{display:"flex",gap:16}}>
                <div><span style={{color:"#9ca3af"}}>Per bulan: </span><b style={{color:"#ea580c"}}>{fmtRp(depPerBulan)}</b></div>
                <div><span style={{color:"#9ca3af"}}>Per tahun: </span><b style={{color:"#ea580c"}}>{fmtRp(depPerBulan*12)}</b></div>
              </div>
            </div>
          )}
        </div>
        <div className="ks-modal-foot">
          <button className="ks-btn primary" disabled={!valid} onClick={()=>{ onSave({...form,id:Date.now(),nilaiPerolehan:Number(form.nilaiPerolehan),depPerBulan}); onClose(); }}>
            ✅ Simpan Aset
          </button>
          <button className="ks-btn ghost" onClick={onClose}>Batal</button>
        </div>
      </div>
    </div>
  );
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
    const csv  = ["Tanggal,Keterangan,Kategori,Debit,Kredit",...rows.map(r=>r.join(","))].join("\
");
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
                  {t.catatan && <span>- {t.catatan}</span>}
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
// TAB: BUDGET PLANNING
// ============================================================
function TabBudget({ kasJurnal }) {
  const totalPemasukan = kasJurnal.filter(t=>t.tipe==="pemasukan"&&t.tanggal?.startsWith(thisMonth)).reduce((s,t)=>s+t.nominal,0);

  const saku = SAKU_DEFAULT.map(s=>{
    const alokasi = s.flat>0 ? s.flat : Math.round(totalPemasukan*(s.pct/100));
    // Hitung pengeluaran per kategori yang relevan
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
          <span style={{fontSize:11,color:"#9ca3af"}}>Cash basis - Single Source of Truth</span>
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
                    {s.flat>0 ? fmtRpShort(s.flat)+" flat" : `${s.pct}%`}
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
  </div>
  );
}

// ============================================================
// TAB: ASET & DEPRESIASI
// ============================================================
function TabAset({ asetList, setAsetList }) {
  const [showModal, setShow] = useState(false);

  const totalNilai  = asetList.reduce((s,a)=>s+a.nilaiPerolehan,0);
  const totalDepBln = asetList.reduce((s,a)=>s+a.depPerBulan,0);

  // Hitung nilai buku saat ini
  const nilaiSekarang = (aset) => {
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
          <button className="ks-btn primary" style={{flex:"none",padding:"6px 14px",fontSize:12}} onClick={()=>setShow(true)}>
            ➕ Tambah Aset
          </button>
        </div>
        <div>
          {asetList.length===0 ? (
            <div className="ks-empty">
              <div className="ks-empty-icon">🏷️</div>
              <div className="ks-empty-title">Belum ada aset</div>
              <div style={{fontSize:11,color:"#9ca3af"}}>Tambah aset untuk tracking depresiasi otomatis</div>
            </div>
          ) : (
            asetList.map(a=>{
              const nb  = nilaiSekarang(a);
              const pct = Math.round((nb/a.nilaiPerolehan)*100);
              return (
                <div key={a.id} style={{padding:"12px 16px",borderBottom:"1px solid #f3f4f6"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                    <div>
                      <div style={{fontSize:13,fontWeight:600,color:"#1f2937"}}>{a.nama}</div>
                      <div style={{fontSize:10,color:"#9ca3af",marginTop:1}}>
                        Dibeli: {a.tanggalBeli} - Umur: {a.umurEkonomis} thn
                      </div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:13,fontWeight:700,color:"#3b82f6",fontFamily:"JetBrains Mono,monospace"}}>{fmtRp(nb)}</div>
                      <div style={{fontSize:10,color:"#9ca3af"}}>Nilai buku ({pct}%)</div>
                    </div>
                  </div>
                  <div style={{height:5,background:"#f3f4f6",borderRadius:3,overflow:"hidden",marginBottom:4}}>
                    <div style={{height:"100%",width:`${pct}%`,background:pct>50?"#3b82f6":pct>25?"#f97316":"#ef4444",borderRadius:3,transition:"width .4s"}} />
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"#9ca3af"}}>
                    <span>Harga beli: {fmtRp(a.nilaiPerolehan)}</span>
                    <span>Dep/bln: {fmtRp(a.depPerBulan)}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {showModal && <ModalAset onClose={()=>setShow(false)} onSave={a=>setAsetList(p=>[...p,a])} />}
    </div>
  </div>
  );
}

// ============================================================
// MAIN
// ============================================================
export default function Modul12_Kas({ user, globalData = {} }) {
  const {
    kasJurnal    = [], setKasJurnal    = ()=>{},
    tagihanList  = [],
  } = globalData;

  const [activeTab,  setActiveTab]  = useState("jurnal");
  const [asetList,   setAsetList]   = useState([]);

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
      {activeTab==="budget"  && <TabBudget  kasJurnal={kasJurnal} />}
      {activeTab==="aset"    && <TabAset    asetList={asetList} setAsetList={setAsetList} />}

    </div>
  );
}