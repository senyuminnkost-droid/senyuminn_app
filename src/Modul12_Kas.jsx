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

  /* Saldo cards */
  .ks-saldo-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-bottom:14px; }
  .ks-saldo-card { border-radius:10px; padding:13px 15px; border:1px solid #e5e7eb; }
  .ks-saldo-label { font-size:10px; font-weight:600; color:#9ca3af; text-transform:uppercase; letter-spacing:.7px; margin-bottom:4px; }
  .ks-saldo-val   { font-size:17px; font-weight:700; font-family:"JetBrains Mono",monospace; }
  .ks-saldo-sub   { font-size:10px; color:#9ca3af; margin-top:3px; }

  /* Carry-over badge */
  .ks-carry-badge { display:inline-flex; align-items:center; gap:4px; padding:2px 8px; border-radius:12px; font-size:10px; font-weight:600; }

  /* Saku history */
  .ks-saku-hist { display:flex; flex-direction:column; gap:6px; margin-top:8px; }
  .ks-saku-hist-row { display:grid; grid-template-columns:70px 1fr 1fr 1fr; gap:8px; align-items:center; font-size:11px; padding:5px 0; border-bottom:1px solid #f3f4f6; }
  .ks-saku-hist-row:last-child { border-bottom:none; }

  @media(max-width:1024px){ .ks-layout{grid-template-columns:1fr} }
  @media(max-width:768px) { .ks-cards{grid-template-columns:repeat(2,1fr)} .ks-saku-grid{grid-template-columns:1fr} .ks-saldo-grid{grid-template-columns:1fr} }
  @media(max-width:480px) { .ks-cards{grid-template-columns:repeat(2,1fr);gap:8px} .ks-input-row{grid-template-columns:1fr} }

  /* ── TAB PENGATURAN ── */
  .ks-peng-section { margin-bottom:20px; }
  .ks-peng-title { font-size:12px; font-weight:700; color:#374151; margin-bottom:10px; display:flex; align-items:center; gap:6px; }
  .ks-peng-card { background:#f9fafb; border:1px solid #e5e7eb; border-radius:10px; padding:14px 16px; margin-bottom:8px; display:flex; align-items:center; gap:12px; }
  .ks-peng-icon { width:36px; height:36px; border-radius:8px; background:#fff; border:1px solid #e5e7eb; display:flex; align-items:center; justify-content:center; font-size:16px; flex-shrink:0; }
  .ks-peng-info { flex:1; min-width:0; }
  .ks-peng-name { font-size:13px; font-weight:600; color:#111827; }
  .ks-peng-sub  { font-size:11px; color:#9ca3af; margin-top:1px; }
  .ks-peng-actions { display:flex; gap:6px; }
  .ks-peng-btn { padding:5px 10px; border-radius:6px; border:1px solid #e5e7eb; background:#fff; font-size:11px; font-weight:600; cursor:pointer; color:#374151; }
  .ks-peng-btn:hover { background:#f3f4f6; }
  .ks-peng-btn.danger { color:#dc2626; border-color:#fecaca; }
  .ks-peng-btn.danger:hover { background:#fef2f2; }
  .ks-peng-add { display:flex; align-items:center; gap:6px; padding:8px 14px; border:1.5px dashed #d1d5db; border-radius:8px; background:transparent; font-size:12px; font-weight:600; color:#6b7280; cursor:pointer; width:100%; margin-top:4px; }
  .ks-peng-add:hover { border-color:#f97316; color:#f97316; background:#fff7ed; }
  .ks-kat-chip { display:inline-flex; align-items:center; gap:4px; padding:4px 10px; background:#f3f4f6; border-radius:20px; font-size:11px; font-weight:500; color:#374151; margin:3px; }
  .ks-kat-chip button { background:none; border:none; cursor:pointer; color:#9ca3af; font-size:12px; padding:0; line-height:1; }
  .ks-kat-chip button:hover { color:#dc2626; }
  .ks-kat-add-row { display:flex; gap:6px; margin-top:6px; }
  /* ── RELEASE BUDGET ── */
  .ks-release-bar { background:linear-gradient(135deg,#fff7ed,#ffedd5); border:1px solid #fed7aa; border-radius:12px; padding:14px 16px; margin-bottom:16px; display:flex; align-items:center; justify-content:space-between; gap:12px; }
  .ks-release-info { flex:1; }
  .ks-release-title { font-size:13px; font-weight:700; color:#9a3412; }
  .ks-release-sub   { font-size:11px; color:#c2410c; margin-top:2px; }
  .ks-release-btn { padding:8px 16px; background:linear-gradient(135deg,#f97316,#ea580c); color:#fff; border:none; border-radius:8px; font-size:12px; font-weight:700; cursor:pointer; white-space:nowrap; }
  /* ── MODAL RELEASE ── */
  .ks-rel-row { display:flex; align-items:center; gap:10px; padding:8px 0; border-bottom:1px solid #f3f4f6; }
  .ks-rel-label { flex:1; font-size:12px; font-weight:600; color:#374151; }
  .ks-rel-auto { font-size:12px; color:#9ca3af; min-width:90px; text-align:right; }
  .ks-rel-input { width:110px; padding:5px 8px; border:1.5px solid #e5e7eb; border-radius:6px; font-size:12px; text-align:right; background:#fff; }
  .ks-rel-input:focus { border-color:#f97316; outline:none; }`;

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

// Overlay wrapper - ganti createPortal
const Overlay = ({onClick, children}) => (
  <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,padding:16}} onClick={onClick}>
    <div onClick={e=>e.stopPropagation()}>{children}</div>
  </div>
);

// ============================================================
// MODAL TAMBAH TRANSAKSI
// ============================================================
function ModalTransaksi({ onClose, onSave, rekeningList, sakuConfig=[] }) {
  const [form, setForm] = useState({
    tipe:"pemasukan", tanggal:todayStr, keterangan:"",
    kategori:"", nominal:"", rekening: rekeningList[0]?.id || "",
    sakuSumber:"", catatan:"",
  });
  const set = (k,v) => setForm(p=>({...p,[k]:v}));
  const isPengeluaran = form.tipe === "pengeluaran";
  const katList = isPengeluaran ? KATEGORI_PENGELUARAN : KATEGORI_PEMASUKAN;
  const valid = form.tanggal && form.keterangan && form.nominal && Number(form.nominal)>0
    && (!isPengeluaran || form.sakuSumber);
  const handleSave = () => {
    onSave({...form, id:Date.now(), nominal:Number(form.nominal),
      debit: isPengeluaran?Number(form.nominal):0,
      kredit: !isPengeluaran?Number(form.nominal):0,
    });
    onClose();
  };
  return (
    <Overlay onClick={onClose}>
      <div className="ks-modal" style={{maxWidth:460}}>
        <div className="ks-modal-head">
          <div className="ks-modal-title">+ Tambah Transaksi</div>
          <button className="ks-modal-close" onClick={onClose}>x</button>
        </div>
        <div className="ks-modal-body">
          <div style={{display:"flex",gap:8,marginBottom:4}}>
            {["pemasukan","pengeluaran"].map(t=>(
              <button key={t} onClick={()=>set("tipe",t)} style={{
                flex:1,padding:"8px",borderRadius:8,border:"1.5px solid",fontSize:12,fontWeight:600,cursor:"pointer",
                borderColor:form.tipe===t?(t==="pemasukan"?"#16a34a":"#dc2626"):"#e5e7eb",
                background:form.tipe===t?(t==="pemasukan"?"#dcfce7":"#fee2e2"):"#fff",
                color:form.tipe===t?(t==="pemasukan"?"#15803d":"#dc2626"):"#6b7280",
              }}>{t==="pemasukan"?"📥 Pemasukan":"📤 Pengeluaran"}</button>
            ))}
          </div>
          <div className="ks-field">
            <label className="ks-field-label">Tanggal *</label>
            <input type="date" className="ks-input" value={form.tanggal} onChange={e=>set("tanggal",e.target.value)} />
          </div>
          <div className="ks-field">
            <label className="ks-field-label">Keterangan *</label>
            <input className="ks-input" placeholder="Deskripsi transaksi..." value={form.keterangan} onChange={e=>set("keterangan",e.target.value)} />
          </div>
          <div className="ks-input-row">
            <div className="ks-field">
              <label className="ks-field-label">Kategori</label>
              <select className="ks-input" value={form.kategori} onChange={e=>set("kategori",e.target.value)}>
                <option value="">-- Pilih --</option>
                {katList.map(k=><option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <div className="ks-field">
              <label className="ks-field-label">Nominal (Rp) *</label>
              <input type="number" className="ks-input" placeholder="0" value={form.nominal} onChange={e=>set("nominal",e.target.value)} />
            </div>
          </div>
          <div className="ks-input-row">
            <div className="ks-field">
              <label className="ks-field-label">Rekening</label>
              <select className="ks-input" value={form.rekening} onChange={e=>set("rekening",e.target.value)}>
                {rekeningList.map(r=><option key={r.id} value={r.id}>{r.nama}</option>)}
              </select>
            </div>
            {isPengeluaran && (
              <div className="ks-field">
                <label className="ks-field-label">Sumber Saku *</label>
                <select className="ks-input" value={form.sakuSumber} onChange={e=>set("sakuSumber",e.target.value)}>
                  <option value="">-- Pilih Saku --</option>
                  {sakuConfig.map(s=><option key={s.kode} value={s.kode}>[{s.kode}] {s.nama}</option>)}
                </select>
              </div>
            )}
          </div>
          <div className="ks-field">
            <label className="ks-field-label">Catatan</label>
            <input className="ks-input" placeholder="Opsional..." value={form.catatan} onChange={e=>set("catatan",e.target.value)} />
          </div>
        </div>
        <div className="ks-modal-foot">
          <button className="ks-btn primary" disabled={!valid} onClick={handleSave}>Simpan</button>
          <button className="ks-btn ghost" onClick={onClose}>Batal</button>
        </div>
      </div>
    </Overlay>
  );
}

// ============================================================
// MODAL TAMBAH ASET
// ============================================================
function ModalAset({ onClose, onSave }) {
  const [form, setForm] = useState({
    nama:"", kategori:"elektronik", nilaiPerolehan:"", umurEkonomis:"5", tanggalBeli:todayStr
  });
  const set = (k,v) => setForm(p=>({...p,[k]:v}));
  const handleKategori = (id) => {
    const kat = getKategoriAset(id);
    setForm(p=>({...p, kategori:id, umurEkonomis:String(kat.umurDefault||5)}));
  };
  const tidakDep    = !isDep(form.kategori);
  const depPerBulan = !tidakDep && form.nilaiPerolehan && form.umurEkonomis
    ? Math.round(Number(form.nilaiPerolehan)/(Number(form.umurEkonomis)*12)) : 0;
  const valid = form.nama && form.nilaiPerolehan && Number(form.nilaiPerolehan)>0;
  const handleSave = () => {
    onSave({...form, id:Date.now(), nilaiPerolehan:Number(form.nilaiPerolehan),
      depPerBulan: tidakDep ? 0 : depPerBulan, tidakDep});
    onClose();
  };
  return (
    <Overlay onClick={onClose}>
      <div className="ks-modal" style={{maxWidth:440}}>
        <div className="ks-modal-head">
          <div className="ks-modal-title">Tambah Aset</div>
          <button className="ks-modal-close" onClick={onClose}>x</button>
        </div>
        <div className="ks-modal-body">
          <div className="ks-field">
            <label className="ks-field-label">Kategori Aset</label>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
              {KATEGORI_ASET.map(k=>(
                <div key={k.id} onClick={()=>handleKategori(k.id)} style={{
                  padding:"7px 6px",borderRadius:8,textAlign:"center",cursor:"pointer",
                  border:form.kategori===k.id?"1.5px solid #f97316":"1.5px solid #e5e7eb",
                  background:form.kategori===k.id?"#fff7ed":"#fff"
                }}>
                  <div style={{fontSize:16,marginBottom:2}}>{k.icon}</div>
                  <div style={{fontSize:10,fontWeight:600}}>{k.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="ks-field">
            <label className="ks-field-label">Nama Aset</label>
            <input className="ks-input" placeholder="Contoh: AC Unit Kamar 1" value={form.nama} onChange={e=>set("nama",e.target.value)} />
          </div>
          <div className="ks-input-row">
            <div className="ks-field">
              <label className="ks-field-label">Nilai Perolehan (Rp)</label>
              <input type="number" className="ks-input" placeholder="0" value={form.nilaiPerolehan} onChange={e=>set("nilaiPerolehan",e.target.value)} />
            </div>
            <div className="ks-field">
              <label className="ks-field-label">Umur Ekonomis (tahun)</label>
              <select className="ks-input" value={form.umurEkonomis} onChange={e=>set("umurEkonomis",e.target.value)} disabled={tidakDep} style={{opacity:tidakDep?0.4:1}}>
                {[1,2,3,4,5,8,10,15,20,25,30,40,50].map(y=>(
                  <option key={y} value={y}>{y} tahun</option>
                ))}
              </select>
            </div>
          </div>
          <div className="ks-field">
            <label className="ks-field-label">Tanggal Perolehan</label>
            <input type="date" className="ks-input" value={form.tanggalBeli} onChange={e=>set("tanggalBeli",e.target.value)} />
          </div>
          {depPerBulan>0 && (
            <div style={{background:"#fff7ed",border:"1px solid #fed7aa",borderRadius:8,padding:"10px 12px",fontSize:12}}>
              <div style={{fontWeight:600,color:"#9a3412",marginBottom:4}}>Estimasi Depresiasi / bulan</div>
              <div style={{color:"#ea580c",fontWeight:700,fontSize:14}}>{fmtRp(depPerBulan)}</div>
            </div>
          )}
        </div>
        <div className="ks-modal-foot">
          <button className="ks-btn primary" disabled={!valid} onClick={handleSave}>Simpan Aset</button>
          <button className="ks-btn ghost" onClick={onClose}>Batal</button>
        </div>
      </div>
    </Overlay>
  );
}

// ============================================================
// MODAL EDIT SAKU
// ============================================================
function ModalEditSaku({ sakuConfig, onClose, onSave }) {
  const [rows, setRows] = useState(sakuConfig.map(s=>({...s})));
  const setRow = (kode,field,val) => setRows(prev=>prev.map(r=>r.kode===kode?{...r,[field]:val}:r));
  const totalPct = rows.filter(r=>r.tipe==="pct").reduce((s,r)=>s+Number(r.nilai||0),0);
  return (
    <Overlay onClick={onClose}>
      <div className="ks-modal" style={{maxWidth:500}}>
        <div className="ks-modal-head">
          <div className="ks-modal-title">Konfigurasi Saku Budget</div>
          <button className="ks-modal-close" onClick={onClose}>x</button>
        </div>
        <div className="ks-modal-body">
          {rows.map(r=>(
            <div key={r.kode} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 0",borderBottom:"1px solid #f3f4f6"}}>
              <div style={{width:32,height:32,borderRadius:8,background:r.color||"#f3f4f6",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff",flexShrink:0}}>{r.kode}</div>
              <input className="ks-input" style={{flex:1,fontSize:12}} value={r.nama} onChange={e=>setRow(r.kode,"nama",e.target.value)} />
              <div style={{position:"relative",width:90}}>
                <input type="number" className="ks-input" style={{fontSize:11,paddingRight:r.tipe==="pct"?28:8}} value={r.nilai} onChange={e=>setRow(r.kode,"nilai",e.target.value)} step={r.tipe==="pct"?0.5:50000} min={0} />
                {r.tipe==="pct" && <span style={{position:"absolute",right:9,top:"50%",transform:"translateY(-50%)",fontSize:11,color:"#9ca3af",fontWeight:600}}>%</span>}
              </div>
            </div>
          ))}
          <div style={{marginTop:8,fontSize:12,color:totalPct>100?"#dc2626":"#6b7280"}}>
            Total persentase: <b>{totalPct.toFixed(1)}%</b> {totalPct>100&&"(melebihi 100%!)"}
          </div>
        </div>
        <div className="ks-modal-foot">
          <button className="ks-btn primary" onClick={()=>{onSave(rows);onClose();}}>Simpan</button>
          <button className="ks-btn ghost" onClick={onClose}>Batal</button>
        </div>
      </div>
    </Overlay>
  );
}

// ============================================================
// MODAL RELEASE BUDGET
// ============================================================
function ModalReleaseBudget({ sakuConfig, inBln, releaseBudgetLog, setReleaseBudgetLog, setKasJurnal, onClose }) {
  const totalIn = inBln;
  const [rows, setRows] = useState(
    sakuConfig.map(s=>({
      ...s,
      alokasi: s.tipe==="pct" ? Math.round(totalIn*(s.nilai/100)) : Math.round(Number(s.nilai)||0)
    }))
  );
  const setRow = (kode, val) => setRows(prev=>prev.map(r=>r.kode===kode?{...r,alokasi:val}:r));
  const totalAlokasi = rows.reduce((s,r)=>s+Number(r.alokasi||0),0);
  const handleRelease = () => {
    const bulan = new Date().toISOString().slice(0,7);
    setReleaseBudgetLog(prev=>[...prev,{bulan,rows,totalIn,totalAlokasi,at:new Date().toISOString()}]);
    setKasJurnal(prev=>[...prev,{
      id:Date.now(),tipe:"pengeluaran",tanggal:todayStr,
      keterangan:`Release Budget ${bulan}`,kategori:"Budget Planning",
      nominal:totalAlokasi,debit:totalAlokasi,kredit:0,rekening:"",sakuSumber:"A",
    }]);
    onClose();
  };
  return (
    <Overlay onClick={onClose}>
      <div className="ks-modal" style={{maxWidth:460}}>
        <div className="ks-modal-head">
          <div className="ks-modal-title">Release Budget Bulan Ini</div>
          <button className="ks-modal-close" onClick={onClose}>x</button>
        </div>
        <div className="ks-modal-body">
          <div style={{background:"#f0fdf4",border:"1px solid #86efac",borderRadius:8,padding:"10px 12px",marginBottom:8,fontSize:12}}>
            <div style={{fontWeight:600,color:"#15803d"}}>Total Pendapatan Bulan Ini</div>
            <div style={{fontSize:18,fontWeight:800,color:"#15803d"}}>{fmtRp(totalIn)}</div>
          </div>
          {rows.map(r=>(
            <div key={r.kode} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 0",borderBottom:"1px solid #f3f4f6"}}>
              <div style={{width:28,height:28,borderRadius:6,background:r.color||"#f3f4f6",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#fff",flexShrink:0}}>{r.kode}</div>
              <div style={{flex:1,fontSize:12,fontWeight:600}}>{r.nama}</div>
              <div style={{fontSize:11,color:"#9ca3af",minWidth:40}}>{r.tipe==="pct"?`${r.nilai}%`:"flat"}</div>
              <div style={{position:"relative",width:110}}>
                <input type="number" style={{width:"100%",padding:"4px 8px",border:"1.5px solid #e5e7eb",borderRadius:6,fontSize:11,boxSizing:"border-box"}} value={r.alokasi} onChange={e=>setRow(r.kode,Number(e.target.value))} />
              </div>
            </div>
          ))}
          <div style={{marginTop:8,display:"flex",justifyContent:"space-between",fontSize:12}}>
            <span style={{color:"#6b7280"}}>Total alokasi:</span>
            <span style={{fontWeight:700,color:totalAlokasi>totalIn?"#dc2626":"#15803d"}}>{fmtRp(totalAlokasi)}</span>
          </div>
        </div>
        <div className="ks-modal-foot">
          <button className="ks-btn primary" disabled={totalAlokasi>totalIn} onClick={handleRelease}>Release Budget</button>
          <button className="ks-btn ghost" onClick={onClose}>Batal</button>
        </div>
      </div>
    </Overlay>
  );
}

// ============================================================
// TAB: JURNAL
// ============================================================
function TabJurnal({ kasJurnal, setKasJurnal, rekeningList, sakuConfig=[], isReadOnly=false }) {
  const [search,    setSearch]  = useState("");
  const [filterTipe,setFT]      = useState("all");
  const [filterBln, setFB]      = useState(thisMonth);
  const [showModal, setShow]    = useState(false);

  const filtered = kasJurnal.filter(r => {
    if (filterTipe!=="all" && r.tipe!==filterTipe) return false;
    if (filterBln && !r.tanggal?.startsWith(filterBln)) return false;
    if (search && !r.keterangan?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalIn  = filtered.filter(r=>r.tipe==="pemasukan").reduce((s,r)=>s+Number(r.nominal||0),0);
  const totalOut = filtered.filter(r=>r.tipe==="pengeluaran").reduce((s,r)=>s+Number(r.nominal||0),0);

  return (
    <div>
      {showModal && <ModalTransaksi onClose={()=>setShow(false)} onSave={t=>{setKasJurnal(p=>[t,...p]);setShow(false);}} rekeningList={rekeningList} sakuConfig={sakuConfig} />}
      <div className="ks-filter-bar">
        <input className="ks-search" placeholder="Cari transaksi..." value={search} onChange={e=>setSearch(e.target.value)} />
        <select className="ks-select-sm" value={filterTipe} onChange={e=>setFT(e.target.value)}>
          <option value="all">Semua Tipe</option>
          <option value="pemasukan">Pemasukan</option>
          <option value="pengeluaran">Pengeluaran</option>
        </select>
        <input type="month" className="ks-select-sm" value={filterBln} onChange={e=>setFB(e.target.value)} />
        {!isReadOnly && <button className="ks-btn primary" onClick={()=>setShow(true)}>+ Transaksi</button>}
      </div>
      <div style={{display:"flex",gap:12,marginBottom:16}}>
        <div className="ks-stat-card" style={{borderTop:"3px solid #16a34a"}}>
          <div className="ks-stat-label">Total Masuk</div>
          <div className="ks-stat-val" style={{color:"#15803d"}}>{fmtRp(totalIn)}</div>
        </div>
        <div className="ks-stat-card" style={{borderTop:"3px solid #dc2626"}}>
          <div className="ks-stat-label">Total Keluar</div>
          <div className="ks-stat-val" style={{color:"#dc2626"}}>{fmtRp(totalOut)}</div>
        </div>
        <div className="ks-stat-card" style={{borderTop:"3px solid #f97316"}}>
          <div className="ks-stat-label">Net</div>
          <div className="ks-stat-val" style={{color:totalIn-totalOut>=0?"#15803d":"#dc2626"}}>{fmtRp(totalIn-totalOut)}</div>
        </div>
      </div>
      <div className="ks-table-wrap">
        <table className="ks-table">
          <thead><tr>
            <th>Tanggal</th><th>Keterangan</th><th>Kategori</th>
            <th style={{textAlign:"right"}}>Debit</th>
            <th style={{textAlign:"right"}}>Kredit</th>
            <th>Saku</th>
          </tr></thead>
          <tbody>
            {filtered.length===0 ? (
              <tr><td colSpan={6} style={{textAlign:"center",color:"#9ca3af",padding:24}}>Tidak ada transaksi</td></tr>
            ) : filtered.map(r=>(
              <tr key={r.id}>
                <td style={{fontSize:12,color:"#6b7280"}}>{r.tanggal}</td>
                <td style={{fontSize:13,fontWeight:500}}>{r.keterangan}</td>
                <td style={{fontSize:11,color:"#6b7280"}}>{r.kategori||"—"}</td>
                <td style={{textAlign:"right",fontSize:12,color:"#dc2626",fontFamily:"monospace"}}>{r.debit>0?fmtRp(r.debit):"—"}</td>
                <td style={{textAlign:"right",fontSize:12,color:"#16a34a",fontFamily:"monospace"}}>{r.kredit>0?fmtRp(r.kredit):"—"}</td>
                <td style={{fontSize:11,color:"#6b7280"}}>{r.sakuSumber||"—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// TAB: BUDGET PLANNING
// ============================================================
function TabBudget({ kasJurnal, sakuConfig, setSakuConfig, isReadOnly, releaseBudgetLog, setReleaseBudgetLog, setKasJurnal }) {
  const [showEditSaku,   setShowEditSaku]   = useState(false);
  const [showRelease,    setShowRelease]    = useState(false);

  const bulan = thisMonth;
  const inBln  = kasJurnal.filter(r=>r.tipe==="pemasukan"&&r.tanggal?.startsWith(bulan)).reduce((s,r)=>s+Number(r.nominal||0),0);
  const outBln = kasJurnal.filter(r=>r.tipe==="pengeluaran"&&r.tanggal?.startsWith(bulan)).reduce((s,r)=>s+Number(r.nominal||0),0);

  const alreadyReleased = releaseBudgetLog?.some(l=>l.bulan===bulan);
  const lastRelease = releaseBudgetLog?.find(l=>l.bulan===bulan);

  return (
    <div>
      {showEditSaku && <ModalEditSaku sakuConfig={sakuConfig} onClose={()=>setShowEditSaku(false)} onSave={v=>{setSakuConfig(v);setShowEditSaku(false);}} />}
      {showRelease  && <ModalReleaseBudget sakuConfig={sakuConfig} inBln={inBln} releaseBudgetLog={releaseBudgetLog} setReleaseBudgetLog={setReleaseBudgetLog} setKasJurnal={setKasJurnal} onClose={()=>setShowRelease(false)} />}

      {!alreadyReleased ? (
        <div style={{background:"linear-gradient(135deg,#fff7ed,#ffedd5)",border:"1px solid #fed7aa",borderRadius:10,padding:"12px 16px",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontSize:13,fontWeight:700,color:"#9a3412"}}>Budget bulan ini belum di-release</div>
            <div style={{fontSize:11,color:"#c2410c",marginTop:2}}>Pendapatan bulan ini: <b>{fmtRp(inBln)}</b></div>
          </div>
          <button className="ks-btn primary" onClick={()=>setShowRelease(true)}>Release Budget</button>
        </div>
      ) : (
        <div style={{background:"#f0fdf4",border:"1px solid #86efac",borderRadius:10,padding:"12px 16px",marginBottom:16}}>
          <div style={{fontSize:13,fontWeight:700,color:"#15803d"}}>Budget bulan ini sudah di-release</div>
          <div style={{fontSize:11,color:"#166534",marginTop:2}}>Total alokasi: <b>{fmtRp(lastRelease?.totalAlokasi||0)}</b></div>
        </div>
      )}

      <div style={{display:"flex",gap:12,marginBottom:20}}>
        <div className="ks-stat-card" style={{borderTop:"3px solid #16a34a"}}>
          <div className="ks-stat-label">Pemasukan Bulan Ini</div>
          <div className="ks-stat-val" style={{color:"#15803d"}}>{fmtRp(inBln)}</div>
        </div>
        <div className="ks-stat-card" style={{borderTop:"3px solid #dc2626"}}>
          <div className="ks-stat-label">Pengeluaran Bulan Ini</div>
          <div className="ks-stat-val" style={{color:"#dc2626"}}>{fmtRp(outBln)}</div>
        </div>
        <div className="ks-stat-card" style={{borderTop:"3px solid #f97316"}}>
          <div className="ks-stat-label">Saldo Bersih</div>
          <div className="ks-stat-val" style={{color:inBln-outBln>=0?"#15803d":"#dc2626"}}>{fmtRp(inBln-outBln)}</div>
        </div>
      </div>

      <div className="ks-widget">
        <div className="ks-widget-head">
          <div className="ks-widget-title">Alokasi Saku Budget</div>
          {!isReadOnly && <button className="ks-btn ghost" style={{fontSize:11}} onClick={()=>setShowEditSaku(true)}>Edit Saku</button>}
        </div>
        <div className="ks-widget-body">
          {sakuConfig.map(s=>{
            const alokasi = s.tipe==="pct" ? Math.round(inBln*(s.nilai/100)) : Number(s.nilai||0);
            const used    = kasJurnal.filter(r=>r.sakuSumber===s.kode&&r.tipe==="pengeluaran"&&r.tanggal?.startsWith(bulan)).reduce((sum,r)=>sum+Number(r.nominal||0),0);
            const pct     = alokasi>0 ? Math.min(100,Math.round((used/alokasi)*100)) : 0;
            return (
              <div key={s.kode} style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <div style={{width:20,height:20,borderRadius:5,background:s.color||"#f3f4f6",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:"#fff"}}>{s.kode}</div>
                    <span style={{fontSize:12,fontWeight:600}}>{s.nama}</span>
                  </div>
                  <span style={{fontSize:11,color:"#6b7280"}}>{fmtRp(used)} / {fmtRp(alokasi)}</span>
                </div>
                <div style={{background:"#f3f4f6",borderRadius:4,height:6}}>
                  <div style={{height:6,borderRadius:4,background:pct>=90?"#dc2626":pct>=70?"#f97316":s.color||"#3b82f6",width:`${pct}%`,transition:"width .3s"}} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MODAL DATA AWAL ASET
// ============================================================
function ModalDataAwalAset({ existing, onClose, onSave }) {
  const [rows, setRows] = useState(
    existing.length>0 ? existing.map(r=>({...r})) :
    [{id:Date.now(),nama:"",kategori:"bangunan",nilaiPerolehan:0,nilaiBuku:0,umurEkonomis:20,tanggalBeli:"2020-01-01",depPerBulan:0,tidakDep:false}]
  );
  const setRow = (id,k,v) => setRows(prev=>prev.map(r=>r.id===id?{...r,[k]:v}:r));
  const addRow = () => setRows(prev=>[...prev,{id:Date.now(),nama:"",kategori:"bangunan",nilaiPerolehan:0,nilaiBuku:0,umurEkonomis:20,tanggalBeli:"2020-01-01",depPerBulan:0,tidakDep:false}]);
  return (
    <Overlay onClick={onClose}>
      <div className="ks-modal" style={{maxWidth:600}}>
        <div className="ks-modal-head">
          <div className="ks-modal-title">Data Awal Aset</div>
          <button className="ks-modal-close" onClick={onClose}>x</button>
        </div>
        <div className="ks-modal-body" style={{maxHeight:"60vh",overflowY:"auto"}}>
          {rows.map((r,idx)=>(
            <div key={r.id} style={{padding:"10px 0",borderBottom:"1px solid #f3f4f6"}}>
              <div style={{display:"flex",gap:8,marginBottom:6,alignItems:"center"}}>
                <span style={{fontSize:11,color:"#9ca3af",minWidth:16}}>{idx+1}.</span>
                <input className="ks-input" style={{flex:2}} placeholder="Nama aset..." value={r.nama} onChange={e=>setRow(r.id,"nama",e.target.value)} />
                <input type="number" className="ks-input" style={{flex:1}} placeholder="Nilai perolehan" value={r.nilaiPerolehan} onChange={e=>setRow(r.id,"nilaiPerolehan",e.target.value)} />
                <input type="number" className="ks-input" style={{flex:1}} placeholder="Nilai buku" value={r.nilaiBuku} onChange={e=>setRow(r.id,"nilaiPerolehan",e.target.value)} />
                <input type="date" className="ks-input" style={{flex:1}} value={r.tanggalBeli} onChange={e=>setRow(r.id,"tanggalBeli",e.target.value)} />
                <button onClick={()=>setRows(prev=>prev.filter(x=>x.id!==r.id))} style={{background:"none",border:"none",cursor:"pointer",color:"#9ca3af",fontSize:16,padding:"0 4px"}}>x</button>
              </div>
            </div>
          ))}
          <button className="ks-btn ghost" style={{marginTop:8,fontSize:12}} onClick={addRow}>+ Tambah Aset</button>
        </div>
        <div className="ks-modal-foot">
          <button className="ks-btn primary" onClick={()=>{onSave(rows);onClose();}}>Simpan</button>
          <button className="ks-btn ghost" onClick={onClose}>Batal</button>
        </div>
      </div>
    </Overlay>
  );
}

// ============================================================
// TAB: ASET & DEPRESIASI
// ============================================================
function TabAset({ asetList, setAsetList }) {
  const [showAdd,      setShowAdd]      = useState(false);
  const [showDataAwal, setShowDataAwal] = useState(false);

  const totalNilai = asetList.reduce((s,r)=>s+Number(r.nilaiPerolehan||0),0);
  const totalDep   = asetList.filter(r=>!r.tidakDep).reduce((s,r)=>s+Number(r.depPerBulan||0),0);

  return (
    <div>
      {showAdd      && <ModalAset onClose={()=>setShowAdd(false)} onSave={a=>{setAsetList(p=>[...p,a]);setShowAdd(false);}} />}
      {showDataAwal && <ModalDataAwalAset existing={asetList} onClose={()=>setShowDataAwal(false)} onSave={rows=>{setAsetList(rows);setShowDataAwal(false);}} />}

      <div style={{display:"flex",gap:10,marginBottom:16}}>
        <button className="ks-btn primary" onClick={()=>setShowAdd(true)}>+ Tambah Aset</button>
        <button className="ks-btn ghost" style={{fontSize:11}} onClick={()=>setShowDataAwal(true)}>Input Data Awal</button>
      </div>

      <div style={{display:"flex",gap:12,marginBottom:16}}>
        <div className="ks-stat-card">
          <div className="ks-stat-label">Total Nilai Aset</div>
          <div className="ks-stat-val">{fmtRp(totalNilai)}</div>
        </div>
        <div className="ks-stat-card">
          <div className="ks-stat-label">Depresiasi / Bulan</div>
          <div className="ks-stat-val" style={{color:"#dc2626"}}>{fmtRp(totalDep)}</div>
        </div>
        <div className="ks-stat-card">
          <div className="ks-stat-label">Total Aset</div>
          <div className="ks-stat-val">{asetList.length}</div>
        </div>
      </div>

      <div className="ks-table-wrap">
        <table className="ks-table">
          <thead><tr>
            <th>Nama Aset</th><th>Kategori</th><th>Nilai Perolehan</th>
            <th>Umur (thn)</th><th>Dep/Bulan</th><th>Aksi</th>
          </tr></thead>
          <tbody>
            {asetList.length===0 ? (
              <tr><td colSpan={6} style={{textAlign:"center",color:"#9ca3af",padding:24}}>Belum ada data aset</td></tr>
            ) : asetList.map(r=>(
              <tr key={r.id}>
                <td style={{fontSize:13,fontWeight:500}}>{r.nama}</td>
                <td style={{fontSize:11,color:"#6b7280"}}>{getKategoriAset(r.kategori)?.label||r.kategori}</td>
                <td style={{fontSize:12,fontFamily:"monospace"}}>{fmtRp(r.nilaiPerolehan)}</td>
                <td style={{fontSize:12,textAlign:"center"}}>{r.tidakDep?"N/A":r.umurEkonomis}</td>
                <td style={{fontSize:12,color:r.tidakDep?"#9ca3af":"#dc2626",fontFamily:"monospace"}}>{r.tidakDep?"Tidak dep.":fmtRp(r.depPerBulan)}</td>
                <td>
                  <button onClick={()=>setAsetList(prev=>prev.filter(x=>x.id!==r.id))} style={{background:"none",border:"none",cursor:"pointer",color:"#dc2626",fontSize:12}}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// TAB: PENGATURAN KAS
// ============================================================
function TabPengaturan({ sakuConfig, setSakuConfig, pengaturanConfig, setPengaturanConfig }) {
  const [showEditSaku, setShowEditSaku] = useState(false);
  const [newRek, setNewRek] = useState({nama:"",noRek:"",bank:""});
  const rekeningList = pengaturanConfig?.rekeningList || [];
  const katPemasukan  = pengaturanConfig?.kategoriPemasukan  || KATEGORI_PEMASUKAN;
  const katPengeluaran = pengaturanConfig?.kategoriPengeluaran || KATEGORI_PENGELUARAN;

  const addRekening = () => {
    if (!newRek.nama) return;
    setPengaturanConfig(p=>({...p, rekeningList:[...(p.rekeningList||[]),{id:Date.now(),...newRek}]}));
    setNewRek({nama:"",noRek:"",bank:""});
  };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      {showEditSaku && <ModalEditSaku sakuConfig={sakuConfig} onClose={()=>setShowEditSaku(false)} onSave={v=>{setSakuConfig(v);setShowEditSaku(false);}} />}

      <div className="ks-widget">
        <div className="ks-widget-head">
          <div className="ks-widget-title">Konfigurasi Saku Budget</div>
          <button className="ks-btn ghost" style={{fontSize:11}} onClick={()=>setShowEditSaku(true)}>Edit Saku</button>
        </div>
        <div className="ks-widget-body">
          {sakuConfig.map(s=>(
            <div key={s.kode} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:"1px solid #f3f4f6"}}>
              <div style={{width:24,height:24,borderRadius:6,background:s.color||"#f3f4f6",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#fff"}}>{s.kode}</div>
              <span style={{flex:1,fontSize:12,fontWeight:600}}>{s.nama}</span>
              <span style={{fontSize:11,color:"#6b7280"}}>{s.tipe==="pct"?`${s.nilai}%`:fmtRp(s.nilai)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="ks-widget">
        <div className="ks-widget-head"><div className="ks-widget-title">Rekening Bank</div></div>
        <div className="ks-widget-body">
          {rekeningList.map(r=>(
            <div key={r.id} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:"1px solid #f3f4f6"}}>
              <span style={{flex:1,fontSize:12,fontWeight:500}}>{r.nama}</span>
              <span style={{fontSize:11,color:"#6b7280"}}>{r.bank} - {r.noRek}</span>
              <button onClick={()=>setPengaturanConfig(p=>({...p,rekeningList:p.rekeningList.filter(x=>x.id!==r.id)}))} style={{background:"none",border:"none",cursor:"pointer",color:"#dc2626",fontSize:12}}>x</button>
            </div>
          ))}
          <div style={{display:"flex",gap:6,marginTop:10}}>
            <input className="ks-input" style={{flex:2}} placeholder="Nama rekening" value={newRek.nama} onChange={e=>setNewRek(p=>({...p,nama:e.target.value}))} />
            <input className="ks-input" style={{flex:1}} placeholder="Bank" value={newRek.bank} onChange={e=>setNewRek(p=>({...p,bank:e.target.value}))} />
            <input className="ks-input" style={{flex:1}} placeholder="No. Rek" value={newRek.noRek} onChange={e=>setNewRek(p=>({...p,noRek:e.target.value}))} />
            <button className="ks-btn primary" style={{fontSize:11}} onClick={addRekening}>+ Tambah</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// EXPORT DEFAULT: KAS & JURNAL
// ============================================================
export default function Kas({ user, globalData = {} }) {
  const {
    kasJurnal        = [], setKasJurnal        = ()=>{},
    asetList         = [], setAsetList         = ()=>{},
    sakuConfig       = [], setSakuConfig       = ()=>{},
    pengaturanConfig = {}, setPengaturanConfig = ()=>{},
    releaseBudgetLog = [], setReleaseBudgetLog = ()=>{},
    isReadOnly = false,
  } = globalData;

  const rekeningList = pengaturanConfig?.rekeningList || [
    {id:1, nama:"BRI Utama", bank:"BRI", noRek:"1234-5678"},
    {id:2, nama:"BCA Operasional", bank:"BCA", noRek:"8765-4321"},
  ];

  const [tab, setTab] = useState("jurnal");
  const tabs = [
    {id:"jurnal",   label:"📒 Jurnal"},
    {id:"budget",   label:"💰 Budget"},
    {id:"aset",     label:"🏗️ Aset"},
    {id:"pengaturan",label:"⚙️ Pengaturan"},
  ];

  return (
    <div>
      <div className="ks-tabs">
        {tabs.map(t=>(
          <button key={t.id} className={`ks-tab${tab===t.id?" active":""}`} onClick={()=>setTab(t.id)}>{t.label}</button>
        ))}
      </div>
      {tab==="jurnal"     && <TabJurnal kasJurnal={kasJurnal} setKasJurnal={setKasJurnal} rekeningList={rekeningList} sakuConfig={sakuConfig} isReadOnly={isReadOnly} />}
      {tab==="budget"     && <TabBudget kasJurnal={kasJurnal} sakuConfig={sakuConfig} setSakuConfig={setSakuConfig} isReadOnly={isReadOnly} releaseBudgetLog={releaseBudgetLog} setReleaseBudgetLog={setReleaseBudgetLog} setKasJurnal={setKasJurnal} />}
      {tab==="aset"       && <TabAset asetList={asetList} setAsetList={setAsetList} />}
      {tab==="pengaturan" && <TabPengaturan sakuConfig={sakuConfig} setSakuConfig={setSakuConfig} pengaturanConfig={pengaturanConfig} setPengaturanConfig={setPengaturanConfig} />}
    </div>
  );
}
