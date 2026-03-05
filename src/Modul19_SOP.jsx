import { useState, useEffect } from "react";

const CSS = `
  .sp-wrap { display:flex; flex-direction:column; gap:16px; }
  .sp-tabs { display:flex; gap:0; background:#fff; border-radius:12px; border:1px solid #e5e7eb; overflow:hidden; }
  .sp-tab  { flex:1; padding:11px 8px; font-size:11px; font-weight:600; color:#9ca3af; cursor:pointer; text-align:center; border-right:1px solid #f3f4f6; transition:all .12s; }
  .sp-tab:last-child { border-right:none; }
  .sp-tab.active { color:#ea580c; background:#fff7ed; border-bottom:2px solid #f97316; }

  .sp-widget { background:#fff; border-radius:12px; border:1px solid #e5e7eb; overflow:hidden; }
  .sp-widget-head { padding:13px 18px 10px; border-bottom:1px solid #f3f4f6; display:flex; align-items:center; justify-content:space-between; }
  .sp-widget-title { font-size:13px; font-weight:700; color:#111827; }
  .sp-body { padding:18px; display:flex; flex-direction:column; gap:14px; }

  .sp-section-title { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#9ca3af; margin-bottom:8px; display:flex; align-items:center; gap:6px; }
  .sp-section-title::after { content:''; flex:1; height:1px; background:#f3f4f6; }

  .sp-checklist-item { display:flex; align-items:flex-start; gap:10px; padding:8px 10px; border-radius:8px; border:1px solid #f3f4f6; margin-bottom:6px; background:#fff; }
  .sp-checklist-item:hover { background:#fafafa; }
  .sp-cl-num { width:22px; height:22px; border-radius:6px; background:#f97316; color:#fff; font-size:10px; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:1px; }
  .sp-cl-text { font-size:12px; color:#374151; line-height:1.5; flex:1; }
  .sp-cl-cat  { font-size:10px; padding:1px 7px; border-radius:20px; background:#f3f4f6; color:#6b7280; flex-shrink:0; font-weight:500; }

  .sp-input-row { display:flex; gap:8px; align-items:flex-end; margin-bottom:8px; }
  .sp-input { padding:8px 11px; border-radius:8px; border:1.5px solid #e5e7eb; font-size:12px; font-family:inherit; color:#1f2937; outline:none; flex:1; transition:border-color .12s; }
  .sp-input:focus { border-color:#f97316; }
  .sp-select { padding:8px 10px; border-radius:8px; border:1.5px solid #e5e7eb; font-size:12px; font-family:inherit; color:#374151; outline:none; background:#fff; cursor:pointer; }
  .sp-select:focus { border-color:#f97316; }

  .sp-btn { display:inline-flex; align-items:center; gap:5px; padding:8px 14px; border-radius:8px; font-size:12px; font-weight:600; border:none; cursor:pointer; font-family:inherit; transition:all .15s; }
  .sp-btn.primary { background:linear-gradient(135deg,#f97316,#ea580c); color:#fff; }
  .sp-btn.ghost   { background:#f3f4f6; color:#4b5563; }
  .sp-btn.danger  { background:#fee2e2; color:#dc2626; border:none; }
  .sp-btn:disabled { opacity:.4; cursor:not-allowed; }

  .sp-sop-step { display:flex; gap:12px; padding:10px 0; border-bottom:1px solid #f9fafb; }
  .sp-sop-step:last-child { border-bottom:none; }
  .sp-sop-num { width:26px; height:26px; border-radius:8px; background:linear-gradient(135deg,#f97316,#ea580c); color:#fff; font-size:11px; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .sp-sop-content { flex:1; }
  .sp-sop-title { font-size:12px; font-weight:600; color:#1f2937; }
  .sp-sop-desc  { font-size:11px; color:#9ca3af; margin-top:2px; }

  .sp-kpi-card { background:#f9fafb; border:1.5px solid #e5e7eb; border-radius:10px; padding:14px; }
  .sp-kpi-label { font-size:11px; font-weight:700; color:#374151; margin-bottom:8px; }
  .sp-kpi-row { display:flex; align-items:center; justify-content:space-between; padding:6px 0; border-bottom:1px solid #f3f4f6; }
  .sp-kpi-row:last-child { border-bottom:none; }
  .sp-kpi-key { font-size:12px; color:#374151; }
  .sp-kpi-val { font-size:12px; font-weight:600; color:#f97316; font-family:"JetBrains Mono",monospace; }

  .sp-inv-item { display:flex; align-items:center; justify-content:space-between; padding:7px 11px; background:#f9fafb; border:1px solid #e5e7eb; border-radius:8px; margin-bottom:6px; }
  .sp-inv-name { font-size:12px; font-weight:500; color:#1f2937; }
  .sp-inv-qty  { font-size:12px; font-weight:700; color:#f97316; }

  .sp-info-box { background:#f0fdf4; border:1px solid #86efac; border-radius:9px; padding:10px 14px; font-size:11px; color:#15803d; }
  .sp-warn-box { background:#fff7ed; border:1px solid #fed7aa; border-radius:9px; padding:10px 14px; font-size:11px; color:#9a3412; }
  .sp-save-bar { position:sticky; bottom:0; background:#fff; border-top:1px solid #e5e7eb; padding:12px 18px; display:flex; gap:8px; justify-content:flex-end; }
`;

function StyleInjector() {
  useEffect(()=>{
    const id="senyuminn-sop-css";
    if(document.getElementById(id)) return;
    const el=document.createElement("style");
    el.id=id; el.textContent=CSS;
    document.head.appendChild(el);
    return ()=>{ const e=document.getElementById(id); if(e) e.remove(); };
  },[]);
  return null;
}

// ─── Default Data ───
const DEFAULT_WEEKLY = [
  {id:1,text:"Sapu dan pel lantai kamar",cat:"Kebersihan"},
  {id:2,text:"Lap debu furniture dan lemari",cat:"Kebersihan"},
  {id:3,text:"Bersihkan kamar mandi (wastafel, kloset, shower)",cat:"Kamar Mandi"},
  {id:4,text:"Ganti dan lipat linen tempat tidur (jika disediakan)",cat:"Kamar Mandi"},
  {id:5,text:"Buang sampah dan ganti kantong",cat:"Kebersihan"},
  {id:6,text:"Lap kaca jendela dan pintu",cat:"Kebersihan"},
  {id:7,text:"Cek AC — bersihkan filter luar",cat:"AC & Elektronik"},
  {id:8,text:"Cek kondisi listrik (stop kontak, lampu)",cat:"Listrik"},
  {id:9,text:"Foto kondisi kamar — grid 4 sudut",cat:"Dokumentasi"},
  {id:10,text:"Laporkan temuan ke grup WA",cat:"Pelaporan"},
];

const DEFAULT_DEEPCLEAN = [
  {id:1,text:"Semua item Weekly Service",cat:"Dasar"},
  {id:2,text:"Cuci dan keringkan tirai/gorden",cat:"Tekstil"},
  {id:3,text:"Bersihkan bagian dalam lemari dan laci",cat:"Furniture"},
  {id:4,text:"Bersihkan AC lengkap (indoor + outdoor jika bisa)",cat:"AC"},
  {id:5,text:"Gosok kerak di kamar mandi (nat keramik, dll)",cat:"Kamar Mandi"},
  {id:6,text:"Bersihkan langit-langit dan sudut sarang laba-laba",cat:"Struktur"},
  {id:7,text:"Cek kondisi pintu, kunci, jendela",cat:"Struktur"},
  {id:8,text:"Bersihkan kulkas jika ada",cat:"Elektronik"},
  {id:9,text:"Inventarisasi fasilitas — cocokkan dengan daftar",cat:"Inventaris"},
  {id:10,text:"Catat kerusakan → buat tiket maintenance",cat:"Pelaporan"},
  {id:11,text:"Foto kondisi lengkap sebelum & sesudah",cat:"Dokumentasi"},
  {id:12,text:"Laporan ke manajemen dengan foto",cat:"Pelaporan"},
];

const DEFAULT_SOP_CHECKIN = [
  {title:"Verifikasi identitas penyewa",desc:"Cocokkan KTP fisik dengan data yang diinput di sistem"},
  {title:"Upload foto KTP ke sistem",desc:"Foto harus jelas dan terbaca"},
  {title:"Review surat perjanjian bersama",desc:"Bacakan poin penting: harga, durasi, aturan, denda"},
  {title:"Tanda tangan surat perjanjian",desc:"2 rangkap: 1 untuk penyewa, 1 untuk arsip kost"},
  {title:"Pembayaran lunas",desc:"Konfirmasi transfer masuk sebelum serahkan kunci"},
  {title:"Serahkan kunci kamar",desc:"Test kunci bersama penyewa sebelum ditinggal"},
  {title:"Foto kondisi kamar saat check-in",desc:"Dokumentasi untuk referensi saat check-out"},
  {title:"Update status kamar di sistem",desc:"Ubah dari Booked → Terisi"},
];

const DEFAULT_SOP_CHECKOUT = [
  {title:"Reminder H-30 kepada penyewa",desc:"Tanyakan rencana perpanjang atau tidak"},
  {title:"Generate surat tagihan perpanjangan H-7",desc:"Kirim via WhatsApp jika tidak perpanjang"},
  {title:"Kunjungi kamar bersama penyewa",desc:"Cek kondisi kamar — bandingkan dengan foto check-in"},
  {title:"Catat kerusakan jika ada",desc:"Buat tiket maintenance dan hitung biaya ganti rugi"},
  {title:"Penyewa kembalikan kunci",desc:"Pastikan semua kunci dikembalikan"},
  {title:"Update status kamar → Deep Clean",desc:"Assign staff pagi untuk deep clean"},
  {title:"Notifikasi ke grup WA",desc:"Info kamar tersedia setelah deep clean selesai"},
  {title:"Selesaikan administrasi (riwayat penyewa)",desc:"Archive data penyewa di modul Riwayat"},
];

const DEFAULT_SOP_KELUHAN = [
  {title:"Terima laporan keluhan",desc:"Via sistem atau langsung dari penyewa"},
  {title:"Kategorikan dan set prioritas",desc:"Normal: koordinasi jadwal · Urgent: tindak < 1 jam"},
  {title:"[URGENT] Notifikasi WA langsung ke PJ",desc:"PJ wajib balas konfirmasi dalam 15 menit"},
  {title:"Assign ke staff yang tersedia",desc:"Staff pagi untuk siang, staff malam untuk malam"},
  {title:"Staff tangani dan update progress",desc:"Update status tiket: In Progress"},
  {title:"Foto sebelum dan sesudah perbaikan",desc:"Upload ke sistem sebagai dokumentasi"},
  {title:"Input biaya material jika ada",desc:"Masuk ke kas sebagai pengeluaran Maintenance"},
  {title:"Tutup tiket dan konfirmasi ke penyewa",desc:"Tanyakan apakah masalah sudah terselesaikan"},
];

// Inventaris default kosong — diisi oleh admin sesuai kondisi riil
const DEFAULT_INVENTARIS = [];

export default function SOPStandar({ user, globalData={} }) {
  const {
    pengaturanConfig={}, setPengaturanConfig=()=>{},
    isReadOnly=false,
  } = globalData;

  const [tab, setTab] = useState("weekly");
  const [weeklyList,    setWeeklyList]  = useState([...DEFAULT_WEEKLY]);
  const [deepcleanList, setDCList]      = useState([...DEFAULT_DEEPCLEAN]);
  const [inventaris,    setInventaris]  = useState(pengaturanConfig.inventarisKamar || [...DEFAULT_INVENTARIS]);
  const [dirty,         setDirty]       = useState(false);

  // SOP Alur editable state
  const DEFAULT_SOP_STATE = {
    checkin:  pengaturanConfig.sopCheckin  || [...DEFAULT_SOP_CHECKIN],
    checkout: pengaturanConfig.sopCheckout || [...DEFAULT_SOP_CHECKOUT],
    keluhan:  pengaturanConfig.sopKeluhan  || [...DEFAULT_SOP_KELUHAN],
  };
  const [sopLists, setSopLists] = useState(DEFAULT_SOP_STATE);
  const [sopModalOpen, setSopModalOpen] = useState(null); // "checkin"|"checkout"|"keluhan"|null
  const [sopEditItem,  setSopEditItem]  = useState(null); // {which, idx, step} | null (null = tambah baru)
  const [sopFormTitle, setSopFormTitle] = useState("");
  const [sopFormDesc,  setSopFormDesc]  = useState("");

  const openSopStepModal = (which, idx=null) => {
    const step = idx !== null ? sopLists[which][idx] : null;
    setSopFormTitle(step?.title || "");
    setSopFormDesc(step?.desc || "");
    setSopEditItem(idx !== null ? {which, idx} : {which, idx:null});
  };
  const saveSopStep = () => {
    if (!sopFormTitle.trim()) return;
    setSopLists(prev => {
      const list = [...prev[sopEditItem.which]];
      const newStep = {title:sopFormTitle.trim(), desc:sopFormDesc.trim(), id:Date.now()};
      if (sopEditItem.idx !== null) list[sopEditItem.idx] = newStep;
      else list.push(newStep);
      return {...prev, [sopEditItem.which]: list};
    });
    setSopEditItem(null); setSopFormTitle(""); setSopFormDesc("");
    setPengaturanConfig(p=>({...p, [`sop${sopEditItem.which.charAt(0).toUpperCase()+sopEditItem.which.slice(1)}`]: sopEditItem.idx !== null ? [...sopLists[sopEditItem.which].map((s,i)=>i===sopEditItem.idx?{title:sopFormTitle.trim(),desc:sopFormDesc.trim(),id:Date.now()}:s)] : [...sopLists[sopEditItem.which],{title:sopFormTitle.trim(),desc:sopFormDesc.trim(),id:Date.now()}]}));
  };
  const deleteSopStep = (which, idx) => {
    if (!window.confirm("Hapus langkah ini?")) return;
    setSopLists(prev => { const list = prev[which].filter((_,i)=>i!==idx); return {...prev,[which]:list}; });
  };

  // KPI Items state — admin bisa set item sendiri + bobot
  const DEFAULT_KPI_ITEMS = pengaturanConfig.kpiItems || [
    {id:1, nama:"Kehadiran",        bobot:60, sumber:"absensi",  keterangan:"% hari hadir dari total hari kerja"},
    {id:2, nama:"Jobdesk Selesai",  bobot:30, sumber:"weekly",   keterangan:"% checklist weekly service selesai"},
    {id:3, nama:"Respon Keluhan",   bobot:10, sumber:"tiket",    keterangan:"% tiket ditangani dalam 24 jam"},
  ];
  const [kpiItems, setKpiItems] = useState(DEFAULT_KPI_ITEMS);
  const [kpiModal, setKpiModal] = useState(false);
  const [kpiEditItem, setKpiEditItem] = useState(null);
  const [kpiForm, setKpiForm] = useState({nama:"",bobot:0,sumber:"manual",keterangan:""});
  const kpiTotalBobot = kpiItems.reduce((s,i)=>s+Number(i.bobot||0),0);
  const kpiValid = kpiTotalBobot === 100;

  const openKpiModal = (item=null) => {
    setKpiEditItem(item);
    setKpiForm(item ? {...item} : {nama:"",bobot:0,sumber:"manual",keterangan:""});
    setKpiModal(true);
  };
  const saveKpiItem = () => {
    if (!kpiForm.nama.trim()) return;
    const newItem = {...kpiForm, id:kpiEditItem?.id||Date.now(), bobot:Number(kpiForm.bobot)||0};
    const newList = kpiEditItem
      ? kpiItems.map(i=>i.id===kpiEditItem.id ? newItem : i)
      : [...kpiItems, newItem];
    setKpiItems(newList);
    setPengaturanConfig(p=>({...p, kpiItems:newList}));
    setKpiModal(false);
  };
  const deleteKpiItem = (id) => {
    if (!window.confirm("Hapus item KPI ini?")) return;
    const newList = kpiItems.filter(i=>i.id!==id);
    setKpiItems(newList);
    setPengaturanConfig(p=>({...p, kpiItems:newList}));
  };

  // KPI edit state
  const [kpiEdit, setKpiEdit] = useState({
    kpiThresholdPct:      pengaturanConfig.kpiThresholdPct      || 90,
    nominalInsentif:       pengaturanConfig.nominalInsentif       || 500000,
    dendaIjinTidakSah:     pengaturanConfig.dendaIjinTidakSah     || 50000,
    lemburPerShift:        pengaturanConfig.lemburPerShift        || 50000,
    maxPinjamanKoperasi:   pengaturanConfig.maxPinjamanKoperasi   || 700000,
  });
  const [kpiDirty, setKpiDirty] = useState(false);

  const cats = ["Kebersihan","Kamar Mandi","AC & Elektronik","Elektronik","Listrik","Furniture","Tekstil","Struktur","AC","Inventaris","Dokumentasi","Pelaporan","Dasar"];

  const CAT_COLORS = {
    "Kebersihan":    "#3b82f6",
    "Kamar Mandi":   "#06b6d4",
    "AC & Elektronik":"#8b5cf6",
    "Listrik":       "#f59e0b",
    "Dokumentasi":   "#16a34a",
    "Pelaporan":     "#f97316",
    "Dasar":         "#6b7280",
    "Furniture":     "#d97706",
    "Tekstil":       "#ec4899",
    "Struktur":      "#6366f1",
    "AC":            "#0ea5e9",
    "Elektronik":    "#8b5cf6",
    "Inventaris":    "#22c55e",
  };

  const addChecklist = (list, setList, text, cat) => {
    if (!text.trim()) return;
    setList(prev=>[...prev,{id:Date.now(),text,cat}]);
    setDirty(true);
  };

  const removeChecklist = (list, setList, id) => {
    setList(prev=>prev.filter(i=>i.id!==id));
    setDirty(true);
  };

  // ─── Modal Tambah Checklist ─────────────────────────────
  const ModalChecklist = ({ which, onClose }) => {
    const [text, setText] = useState("");
    const [cat,  setCat]  = useState("Kebersihan");
    const doSave = () => {
      if (!text.trim()) return;
      if (which === "weekly") addChecklist(weeklyList, setWeeklyList, text, cat);
      else                    addChecklist(deepcleanList, setDCList, text, cat);
      onClose();
    };
    return (
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}} onClick={onClose}>
        <div style={{background:"#fff",borderRadius:16,padding:28,width:420,boxShadow:"0 20px 60px rgba(0,0,0,.18)"}} onClick={e=>e.stopPropagation()}>
          <div style={{fontSize:16,fontWeight:800,color:"#111827",marginBottom:20}}>➕ Tambah Item Checklist</div>
          <div style={{marginBottom:14}}>
            <label style={{fontSize:11,fontWeight:600,color:"#6b7280",display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:".4px"}}>Deskripsi Item</label>
            <input className="sp-input" placeholder="Contoh: Bersihkan ventilasi udara..." value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doSave()} autoFocus />
          </div>
          <div style={{marginBottom:14}}>
            <label style={{fontSize:11,fontWeight:600,color:"#6b7280",display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:".4px"}}>Kategori</label>
            <select className="sp-select" style={{width:"100%"}} value={cat} onChange={e=>setCat(e.target.value)}>
              {cats.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:20}}>
            <button className="sp-btn ghost" onClick={onClose}>Batal</button>
            <button className="sp-btn primary" disabled={!text.trim()} onClick={doSave}>Simpan</button>
          </div>
        </div>
      </div>
    );
  };

  // ─── Modal Tambah / Edit Inventaris ────────────────────
  const ModalInventaris = ({ item, onClose }) => {
    const [nama, setNama] = useState(item?.nama   || "");
    const [qty,  setQty]  = useState(item?.qty    || 1);
    const [sat,  setSat]  = useState(item?.satuan || "buah");
    const doSave = () => {
      if (!nama.trim()) return;
      if (item) {
        setInventaris(prev=>prev.map(i=>i.id===item.id ? {...i,nama:nama.trim(),qty,satuan:sat} : i));
      } else {
        setInventaris(prev=>[...prev,{id:Date.now(),nama:nama.trim(),qty,satuan:sat}]);
      }
      setDirty(true);
      onClose();
    };
    return (
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}} onClick={onClose}>
        <div style={{background:"#fff",borderRadius:16,padding:28,width:400,boxShadow:"0 20px 60px rgba(0,0,0,.18)"}} onClick={e=>e.stopPropagation()}>
          <div style={{fontSize:16,fontWeight:800,color:"#111827",marginBottom:20}}>{item?"✏️ Edit Item":"➕ Tambah Item Inventaris"}</div>
          <div style={{marginBottom:14}}>
            <label style={{fontSize:11,fontWeight:600,color:"#6b7280",display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:".4px"}}>Nama Fasilitas</label>
            <input className="sp-input" placeholder="Contoh: Cermin, Kulkas, Dispenser..." value={nama} onChange={e=>setNama(e.target.value)} autoFocus />
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
            <div>
              <label style={{fontSize:11,fontWeight:600,color:"#6b7280",display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:".4px"}}>Jumlah</label>
              <input className="sp-input" type="number" min={1} value={qty} onChange={e=>setQty(Math.max(1,parseInt(e.target.value)||1))} />
            </div>
            <div>
              <label style={{fontSize:11,fontWeight:600,color:"#6b7280",display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:".4px"}}>Satuan</label>
              <select className="sp-select" style={{width:"100%"}} value={sat} onChange={e=>setSat(e.target.value)}>
                {["buah","set","unit","lembar","pasang","botol","rol"].map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
            <button className="sp-btn ghost" onClick={onClose}>Batal</button>
            <button className="sp-btn primary" disabled={!nama.trim()} onClick={doSave}>{item?"Simpan":"Tambah"}</button>
          </div>
        </div>
      </div>
    );
  };

  const ChecklistEditor = ({ list, setList, title, subtitle, which }) => (
    <div className="sp-widget">
      <div className="sp-widget-head">
        <div>
          <div className="sp-widget-title">{title}</div>
          <div style={{fontSize:11,color:"#9ca3af",marginTop:2}}>{subtitle}</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:11,color:"#9ca3af"}}>{list.length} item</span>
          {!isReadOnly && (
            <button className="sp-btn primary" style={{padding:"6px 12px"}} onClick={()=>setShowChecklistModal(which)}>
              ➕ Tambah Item
            </button>
          )}
        </div>
      </div>
      <div className="sp-body">
        {list.length === 0 && (
          <div style={{textAlign:"center",padding:"24px 0",color:"#9ca3af"}}>
            <div style={{fontSize:28,marginBottom:8}}>📋</div>
            <div style={{fontSize:13,fontWeight:600,color:"#374151"}}>Belum ada item checklist</div>
            <div style={{fontSize:12,marginTop:4}}>Klik ➕ Tambah Item untuk mulai</div>
          </div>
        )}
        {list.map((item,i)=>(
          <div key={item.id} className="sp-checklist-item">
            <div className="sp-cl-num">{i+1}</div>
            <div className="sp-cl-text">{item.text}</div>
            <span className="sp-cl-cat" style={{background:(CAT_COLORS[item.cat]||"#6b7280")+"22",color:CAT_COLORS[item.cat]||"#6b7280"}}>{item.cat}</span>
            {!isReadOnly && (
              <button style={{background:"none",border:"none",cursor:"pointer",color:"#dc2626",fontSize:14,padding:"0 4px",flexShrink:0}} onClick={()=>removeChecklist(list,setList,item.id)}>✕</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const SOPView = ({ steps, title }) => (
    <div className="sp-widget">
      <div className="sp-widget-head">
        <div className="sp-widget-title">{title}</div>
        <span style={{fontSize:11,color:"#9ca3af"}}>{steps.length} langkah</span>
      </div>
      <div className="sp-body">
        <div className="sp-warn-box">
          📋 SOP ini adalah panduan standar. Edit detail sesuai kondisi operasional aktual Senyum Inn.
        </div>
        {steps.map((s,i)=>(
          <div key={i} className="sp-sop-step">
            <div className="sp-sop-num">{i+1}</div>
            <div className="sp-sop-content">
              <div className="sp-sop-title">{s.title}</div>
              <div className="sp-sop-desc">{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const TABS = [
    {id:"weekly",    label:"🧹 Weekly Service"},
    {id:"deepclean", label:"✨ Deep Clean"},
    {id:"sop",       label:"📋 SOP Alur"},
    {id:"kpi",       label:"🎯 KPI & Insentif"},
    {id:"inventaris",label:"📦 Inventaris Kamar"},
  ];

  return (
    <div className="sp-wrap">
      <StyleInjector />

      <div className="sp-tabs">
        {TABS.map(t=>(
          <div key={t.id} className={`sp-tab ${tab===t.id?"active":""}`} onClick={()=>setTab(t.id)}>{t.label}</div>
        ))}
      </div>

      {/* Weekly Service checklist */}
      {tab==="weekly" && (
        <ChecklistEditor
          list={weeklyList} setList={setWeeklyList}
          title="🧹 Checklist Weekly Service"
          subtitle="Dilakukan 1x seminggu per kamar oleh staff pagi"
          which="weekly"
        />
      )}

      {/* Deep Clean checklist */}
      {tab==="deepclean" && (
        <ChecklistEditor
          list={deepcleanList} setList={setDCList}
          title="✨ Checklist Deep Clean"
          subtitle="Dilakukan setelah check-out sebelum kamar disewakan kembali"
          which="deepclean"
        />
      )}

      {/* SOP Alur */}
      {tab==="sop" && (
        <div style={{display:"flex",flexDirection:"column",gap:16}}>

          {/* ── SOP Editor per alur ── */}
          {[
            {key:"checkin",  icon:"🔑", title:"SOP Check-in Penyewa"},
            {key:"checkout", icon:"📦", title:"SOP Check-out Penyewa"},
            {key:"keluhan",  icon:"🔧", title:"SOP Penanganan Keluhan Urgent"},
          ].map(alur => (
            <div key={alur.key} className="sp-widget">
              <div className="sp-widget-head">
                <div className="sp-widget-title">{alur.icon} {alur.title}</div>
                {!isReadOnly && (
                  <button className="sp-btn primary" style={{padding:"5px 12px",fontSize:11}} onClick={()=>openSopStepModal(alur.key)}>
                    ＋ Tambah Langkah
                  </button>
                )}
              </div>
              <div className="sp-body">
                {sopLists[alur.key].length === 0 ? (
                  <div style={{textAlign:"center",padding:"16px 0",color:"#9ca3af",fontSize:12}}>
                    Belum ada langkah. Klik ＋ untuk menambah.
                  </div>
                ) : sopLists[alur.key].map((step, idx) => (
                  <div key={step.id||idx} className="sp-sop-step" style={{alignItems:"flex-start"}}>
                    <div className="sp-sop-num">{idx+1}</div>
                    <div className="sp-sop-content" style={{flex:1}}>
                      <div className="sp-sop-title">{step.title}</div>
                      {step.desc && <div className="sp-sop-desc">{step.desc}</div>}
                    </div>
                    {!isReadOnly && (
                      <div style={{display:"flex",gap:4,flexShrink:0,marginLeft:8}}>
                        <button onClick={()=>openSopStepModal(alur.key, idx)} style={{background:"#f3f4f6",border:"none",borderRadius:6,padding:"3px 8px",fontSize:11,cursor:"pointer",color:"#4b5563"}}>✏️</button>
                        <button onClick={()=>deleteSopStep(alur.key, idx)} style={{background:"#fee2e2",border:"none",borderRadius:6,padding:"3px 8px",fontSize:11,cursor:"pointer",color:"#dc2626"}}>✕</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Modal edit/tambah langkah SOP */}
          {sopEditItem !== null && (
            <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,padding:16,boxSizing:"border-box"}} onClick={()=>setSopEditItem(null)}>
              <div style={{background:"#fff",borderRadius:14,width:"100%",maxWidth:440,boxShadow:"0 20px 60px rgba(0,0,0,.18)"}} onClick={e=>e.stopPropagation()}>
                <div style={{padding:"14px 18px 12px",borderBottom:"1px solid #f3f4f6",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div style={{fontSize:14,fontWeight:700,color:"#111827"}}>{sopEditItem.idx!==null ? "✏️ Edit Langkah" : "＋ Tambah Langkah"}</div>
                  <button onClick={()=>setSopEditItem(null)} style={{background:"none",border:"none",cursor:"pointer",fontSize:18,color:"#9ca3af"}}>✕</button>
                </div>
                <div style={{padding:"16px 18px",display:"flex",flexDirection:"column",gap:12}}>
                  <div>
                    <label style={{fontSize:11,fontWeight:600,color:"#374151",textTransform:"uppercase",display:"block",marginBottom:4}}>Judul Langkah *</label>
                    <input autoFocus style={{width:"100%",padding:"9px 11px",border:"1.5px solid #e5e7eb",borderRadius:8,fontSize:13,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}
                      value={sopFormTitle} onChange={e=>setSopFormTitle(e.target.value)} placeholder="Contoh: Verifikasi identitas penyewa" />
                  </div>
                  <div>
                    <label style={{fontSize:11,fontWeight:600,color:"#374151",textTransform:"uppercase",display:"block",marginBottom:4}}>Deskripsi / Keterangan</label>
                    <textarea style={{width:"100%",padding:"9px 11px",border:"1.5px solid #e5e7eb",borderRadius:8,fontSize:12,fontFamily:"inherit",outline:"none",resize:"vertical",minHeight:64,boxSizing:"border-box"}}
                      value={sopFormDesc} onChange={e=>setSopFormDesc(e.target.value)} placeholder="Detail langkah ini..." />
                  </div>
                </div>
                <div style={{padding:"11px 18px",borderTop:"1px solid #f3f4f6",display:"flex",gap:8,justifyContent:"flex-end"}}>
                  <button onClick={()=>setSopEditItem(null)} style={{padding:"8px 14px",background:"#f3f4f6",border:"none",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"#4b5563"}}>Batal</button>
                  <button onClick={saveSopStep} disabled={!sopFormTitle.trim()} style={{padding:"8px 16px",background:sopFormTitle.trim()?"linear-gradient(135deg,#f97316,#ea580c)":"#d1d5db",color:"#fff",border:"none",borderRadius:8,fontSize:12,fontWeight:700,cursor:sopFormTitle.trim()?"pointer":"not-allowed",fontFamily:"inherit"}}>✅ Simpan</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* KPI & Insentif — editable */}
      {tab==="kpi" && (
        <div style={{display:"flex",flexDirection:"column",gap:16}}>

          {/* ── KPI Items + Bobot ── */}
          <div className="sp-widget">
            <div className="sp-widget-head">
              <div className="sp-widget-title">🎯 Item KPI & Bobot</div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:11,fontWeight:700,color:kpiValid?"#16a34a":"#dc2626",background:kpiValid?"#dcfce7":"#fee2e2",padding:"3px 10px",borderRadius:20}}>
                  Total bobot: {kpiTotalBobot}% {kpiValid?"✅":"⚠️ harus 100%"}
                </span>
                {!isReadOnly && (
                  <button className="sp-btn primary" style={{padding:"5px 12px",fontSize:11}} onClick={()=>openKpiModal()}>＋ Tambah Item</button>
                )}
              </div>
            </div>
            <div className="sp-body">
              {kpiItems.length===0 ? (
                <div style={{textAlign:"center",padding:"16px 0",color:"#9ca3af",fontSize:12}}>Belum ada item KPI. Klik ＋ untuk menambah.</div>
              ) : (
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {/* Header */}
                  <div style={{display:"grid",gridTemplateColumns:"1fr 80px 120px auto",gap:8,padding:"6px 10px",background:"#f9fafb",borderRadius:7}}>
                    <span style={{fontSize:10,fontWeight:700,color:"#9ca3af",textTransform:"uppercase"}}>Nama Item KPI</span>
                    <span style={{fontSize:10,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",textAlign:"center"}}>Bobot</span>
                    <span style={{fontSize:10,fontWeight:700,color:"#9ca3af",textTransform:"uppercase"}}>Sumber Data</span>
                    <span></span>
                  </div>
                  {kpiItems.map(item=>(
                    <div key={item.id} style={{display:"grid",gridTemplateColumns:"1fr 80px 120px auto",gap:8,padding:"9px 10px",background:"#fff",border:"1px solid #e5e7eb",borderRadius:8,alignItems:"center"}}>
                      <div>
                        <div style={{fontSize:12,fontWeight:600,color:"#1f2937"}}>{item.nama}</div>
                        {item.keterangan && <div style={{fontSize:10,color:"#9ca3af"}}>{item.keterangan}</div>}
                      </div>
                      <div style={{textAlign:"center"}}>
                        <span style={{fontSize:14,fontWeight:800,color:"#f97316"}}>{item.bobot}%</span>
                      </div>
                      <div>
                        <span style={{fontSize:11,padding:"2px 8px",borderRadius:20,background:"#f0f9ff",color:"#0369a1",fontWeight:600}}>
                          {item.sumber==="absensi"?"📅 Absensi":item.sumber==="weekly"?"🧹 Weekly":item.sumber==="tiket"?"🔧 Tiket":"✏️ Manual"}
                        </span>
                      </div>
                      {!isReadOnly && (
                        <div style={{display:"flex",gap:4}}>
                          <button onClick={()=>openKpiModal(item)} style={{background:"#f3f4f6",border:"none",borderRadius:6,padding:"3px 8px",fontSize:11,cursor:"pointer",color:"#4b5563"}}>✏️</button>
                          <button onClick={()=>deleteKpiItem(item.id)} style={{background:"#fee2e2",border:"none",borderRadius:6,padding:"3px 8px",fontSize:11,cursor:"pointer",color:"#dc2626"}}>✕</button>
                        </div>
                      )}
                    </div>
                  ))}
                  {!kpiValid && (
                    <div style={{background:"#fff7ed",border:"1px solid #fed7aa",borderRadius:8,padding:"8px 12px",fontSize:11,color:"#9a3412"}}>
                      ⚠️ Total bobot harus tepat 100%. Sekarang: {kpiTotalBobot}%. {kpiTotalBobot>100?"Kurangi":"Tambah"} {Math.abs(100-kpiTotalBobot)}% lagi.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Threshold & Nominal ── */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div className="sp-widget">
              <div className="sp-widget-head">
                <div className="sp-widget-title">⚙️ Threshold & Nominal</div>
                {kpiDirty && <span style={{fontSize:11,color:"#f97316",fontWeight:600}}>● Belum disimpan</span>}
              </div>
              <div className="sp-body">
                {[
                  {key:"kpiThresholdPct",    label:"Score minimum insentif", suffix:"%"},
                  {key:"dendaIjinTidakSah",  label:"Denda ijin tidak sah/hari", prefix:"Rp"},
                  {key:"lemburPerShift",     label:"Lembur per shift", prefix:"Rp"},
                  {key:"maxPinjamanKoperasi",label:"Maks pinjaman koperasi", prefix:"Rp"},
                ].map(f=>(
                  <div key={f.key} className="sp-kpi-row">
                    <span className="sp-kpi-key">{f.label}</span>
                    {isReadOnly ? (
                      <span className="sp-kpi-val">{f.prefix&&"Rp "}{kpiEdit[f.key]?.toLocaleString("id-ID")}{f.suffix||""}</span>
                    ) : (
                      <div style={{display:"flex",alignItems:"center",gap:4}}>
                        {f.prefix && <span style={{fontSize:11,color:"#9ca3af"}}>Rp</span>}
                        <input style={{width:100,padding:"5px 8px",borderRadius:7,border:"1.5px solid #e5e7eb",fontSize:12,textAlign:"right",fontWeight:700,color:"#f97316",fontFamily:"inherit",outline:"none"}}
                          value={(kpiEdit[f.key]||0).toLocaleString("id-ID")}
                          onChange={e=>{ setKpiEdit(p=>({...p,[f.key]:parseInt(e.target.value.replace(/\D/g,""))||0})); setKpiDirty(true); }} />
                        {f.suffix && <span style={{fontSize:11,color:"#9ca3af"}}>{f.suffix}</span>}
                      </div>
                    )}
                  </div>
                ))}
                {!isReadOnly && kpiDirty && (
                  <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:8}}>
                    <button className="sp-btn ghost" onClick={()=>{setKpiEdit({kpiThresholdPct:pengaturanConfig.kpiThresholdPct||90,dendaIjinTidakSah:pengaturanConfig.dendaIjinTidakSah||50000,lemburPerShift:pengaturanConfig.lemburPerShift||50000,maxPinjamanKoperasi:pengaturanConfig.maxPinjamanKoperasi||700000});setKpiDirty(false);}}>Batalkan</button>
                    <button className="sp-btn primary" onClick={()=>{setPengaturanConfig(p=>({...p,...kpiEdit}));setKpiDirty(false);}}>✅ Simpan</button>
                  </div>
                )}
              </div>
            </div>

            <div className="sp-widget">
              <div className="sp-widget-head"><div className="sp-widget-title">📊 Cara Hitung Score KPI</div></div>
              <div className="sp-body">
                <div style={{fontSize:11,color:"#9ca3af",marginBottom:8}}>Score = Σ (nilai item × bobot item)</div>
                {kpiItems.map((item,idx)=>(
                  <div key={item.id} className="sp-sop-step" style={{padding:"6px 10px"}}>
                    <div className="sp-sop-num" style={{width:22,height:22,fontSize:10,background:"linear-gradient(135deg,#3b82f6,#2563eb)"}}>{idx+1}</div>
                    <div className="sp-sop-content">
                      <div className="sp-sop-title" style={{fontSize:11}}>{item.nama} <span style={{color:"#f97316",fontWeight:800}}>(bobot {item.bobot}%)</span></div>
                      <div className="sp-sop-desc">{item.keterangan}</div>
                    </div>
                  </div>
                ))}
                <div style={{marginTop:8,padding:"8px 10px",background:"#f0fdf4",border:"1px solid #86efac",borderRadius:8,fontSize:11,color:"#15803d"}}>
                  ✅ Jika total score ≥ {kpiEdit.kpiThresholdPct||90}% → Staff dapat insentif sesuai nominal di Data Karyawan
                </div>
              </div>
            </div>
          </div>

          {/* Modal tambah/edit item KPI */}
          {kpiModal && (
            <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,padding:16,boxSizing:"border-box"}} onClick={()=>setKpiModal(false)}>
              <div style={{background:"#fff",borderRadius:14,width:"100%",maxWidth:420,boxShadow:"0 20px 60px rgba(0,0,0,.18)"}} onClick={e=>e.stopPropagation()}>
                <div style={{padding:"14px 18px 12px",borderBottom:"1px solid #f3f4f6",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div style={{fontSize:14,fontWeight:700,color:"#111827"}}>{kpiEditItem?"✏️ Edit Item KPI":"＋ Tambah Item KPI"}</div>
                  <button onClick={()=>setKpiModal(false)} style={{background:"none",border:"none",cursor:"pointer",fontSize:18,color:"#9ca3af"}}>✕</button>
                </div>
                <div style={{padding:"16px 18px",display:"flex",flexDirection:"column",gap:11}}>
                  <div>
                    <label style={{fontSize:11,fontWeight:600,color:"#374151",textTransform:"uppercase",display:"block",marginBottom:4}}>Nama Item KPI *</label>
                    <input autoFocus style={{width:"100%",padding:"9px 11px",border:"1.5px solid #e5e7eb",borderRadius:8,fontSize:13,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}
                      value={kpiForm.nama} onChange={e=>setKpiForm(p=>({...p,nama:e.target.value}))} placeholder="Contoh: Kehadiran, Jobdesk Selesai..." />
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                    <div>
                      <label style={{fontSize:11,fontWeight:600,color:"#374151",textTransform:"uppercase",display:"block",marginBottom:4}}>Bobot (%)</label>
                      <input type="number" min={0} max={100} style={{width:"100%",padding:"9px 11px",border:"1.5px solid #e5e7eb",borderRadius:8,fontSize:13,fontFamily:"inherit",outline:"none",boxSizing:"border-box",fontWeight:700,color:"#f97316"}}
                        value={kpiForm.bobot} onChange={e=>setKpiForm(p=>({...p,bobot:Math.min(100,Math.max(0,parseInt(e.target.value)||0))}))} />
                      <div style={{fontSize:10,color:"#9ca3af",marginTop:2}}>Sisa bobot: {100-kpiTotalBobot+(kpiEditItem?.bobot||0)}%</div>
                    </div>
                    <div>
                      <label style={{fontSize:11,fontWeight:600,color:"#374151",textTransform:"uppercase",display:"block",marginBottom:4}}>Sumber Data</label>
                      <select style={{width:"100%",padding:"9px 11px",border:"1.5px solid #e5e7eb",borderRadius:8,fontSize:12,fontFamily:"inherit",outline:"none"}}
                        value={kpiForm.sumber} onChange={e=>setKpiForm(p=>({...p,sumber:e.target.value}))}>
                        <option value="absensi">📅 Absensi</option>
                        <option value="weekly">🧹 Weekly Service</option>
                        <option value="tiket">🔧 Tiket Keluhan</option>
                        <option value="manual">✏️ Input Manual</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={{fontSize:11,fontWeight:600,color:"#374151",textTransform:"uppercase",display:"block",marginBottom:4}}>Keterangan</label>
                    <input style={{width:"100%",padding:"9px 11px",border:"1.5px solid #e5e7eb",borderRadius:8,fontSize:12,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}
                      value={kpiForm.keterangan} onChange={e=>setKpiForm(p=>({...p,keterangan:e.target.value}))} placeholder="Cara hitung item ini..." />
                  </div>
                </div>
                <div style={{padding:"11px 18px",borderTop:"1px solid #f3f4f6",display:"flex",gap:8,justifyContent:"flex-end"}}>
                  <button onClick={()=>setKpiModal(false)} style={{padding:"8px 14px",background:"#f3f4f6",border:"none",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"#4b5563"}}>Batal</button>
                  <button onClick={saveKpiItem} disabled={!kpiForm.nama.trim()} style={{padding:"8px 16px",background:kpiForm.nama.trim()?"linear-gradient(135deg,#f97316,#ea580c)":"#d1d5db",color:"#fff",border:"none",borderRadius:8,fontSize:12,fontWeight:700,cursor:kpiForm.nama.trim()?"pointer":"not-allowed",fontFamily:"inherit"}}>✅ Simpan</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Inventaris Kamar — modal */}
      {tab==="inventaris" && (
        <div className="sp-widget">
          <div className="sp-widget-head">
            <div>
              <div className="sp-widget-title">📦 Inventaris Fasilitas Standar per Kamar</div>
              <div style={{fontSize:11,color:"#9ca3af",marginTop:2}}>Template referensi saat deep clean & check-out</div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:11,color:"#9ca3af"}}>{inventaris.length} item</span>
              {!isReadOnly && (
                <button className="sp-btn primary" style={{padding:"6px 12px"}} onClick={()=>setShowInvModal(true)}>
                  ➕ Tambah Item
                </button>
              )}
            </div>
          </div>
          <div className="sp-body">
            {inventaris.length === 0 ? (
              <div style={{textAlign:"center",padding:"32px 0",color:"#9ca3af"}}>
                <div style={{fontSize:32,marginBottom:8}}>📦</div>
                <div style={{fontSize:13,fontWeight:600,color:"#374151"}}>Belum ada item inventaris</div>
                <div style={{fontSize:12,marginTop:4}}>Klik ➕ Tambah Item untuk mendefinisikan fasilitas standar kamar</div>
              </div>
            ) : (
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {inventaris.map(item=>(
                  <div key={item.id} className="sp-inv-item">
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:18}}>📦</span>
                      <div>
                        <div className="sp-inv-name">{item.nama}</div>
                        <div style={{fontSize:10,color:"#9ca3af"}}>{item.satuan}</div>
                      </div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <span className="sp-inv-qty">{item.qty}x</span>
                      {!isReadOnly && (
                        <>
                          <button style={{background:"none",border:"none",cursor:"pointer",fontSize:13,color:"#6b7280",padding:"2px 4px"}} onClick={()=>setEditInvItem(item)} title="Edit">✏️</button>
                          <button style={{background:"none",border:"none",cursor:"pointer",fontSize:13,color:"#dc2626",padding:"2px 4px"}} onClick={()=>{ setInventaris(p=>p.filter(i=>i.id!==item.id)); setDirty(true); }} title="Hapus">✕</button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="sp-info-box">
              📋 Inventaris ini digunakan sebagai referensi saat deep clean dan check-out untuk verifikasi kelengkapan fasilitas kamar.
            </div>
          </div>
          {!isReadOnly && dirty && (
            <div className="sp-save-bar">
              <button className="sp-btn primary" onClick={()=>{ setPengaturanConfig(p=>({...p,inventarisKamar:inventaris})); setDirty(false); }}>✅ Simpan Perubahan</button>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {showChecklistModal && <ModalChecklist which={showChecklistModal} onClose={()=>setShowChecklistModal(null)} />}
      {showInvModal       && <ModalInventaris onClose={()=>setShowInvModal(false)} />}
      {editInvItem        && <ModalInventaris item={editInvItem} onClose={()=>setEditInvItem(null)} />}
    </div>
  );
}
