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

const DEFAULT_INVENTARIS = [
  {id:1,nama:"Kunci kamar",qty:2,satuan:"buah"},
  {id:2,nama:"Tempat tidur",qty:1,satuan:"set"},
  {id:3,nama:"Lemari pakaian",qty:1,satuan:"buah"},
  {id:4,nama:"Meja dan kursi",qty:1,satuan:"set"},
  {id:5,nama:"AC",qty:1,satuan:"unit"},
  {id:6,nama:"Lampu kamar",qty:2,satuan:"buah"},
  {id:7,nama:"Stop kontak",qty:3,satuan:"buah"},
  {id:8,nama:"Gantungan baju",qty:1,satuan:"set"},
  {id:9,nama:"Cermin",qty:1,satuan:"buah"},
  {id:10,nama:"Keset",qty:1,satuan:"buah"},
];

export default function SOPStandar({ user, globalData={} }) {
  const { pengaturanConfig={}, isReadOnly=false } = globalData;

  const [tab, setTab] = useState("weekly");
  const [weeklyList,  setWeeklyList]  = useState([...DEFAULT_WEEKLY]);
  const [deepcleanList, setDCList]    = useState([...DEFAULT_DEEPCLEAN]);
  const [inventaris,  setInventaris]  = useState([...DEFAULT_INVENTARIS]);
  const [dirty, setDirty]             = useState(false);

  // form state untuk tambah item checklist
  const [newItemText, setNewItemText] = useState("");
  const [newItemCat,  setNewItemCat]  = useState("Kebersihan");
  const [newInvNama,  setNewInvNama]  = useState("");
  const [newInvQty,   setNewInvQty]   = useState(1);
  const [newInvSat,   setNewInvSat]   = useState("buah");

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

  const ChecklistEditor = ({ list, setList, title, subtitle }) => (
    <div className="sp-widget">
      <div className="sp-widget-head">
        <div>
          <div className="sp-widget-title">{title}</div>
          <div style={{fontSize:11,color:"#9ca3af",marginTop:2}}>{subtitle}</div>
        </div>
        <span style={{fontSize:11,color:"#9ca3af"}}>{list.length} item</span>
      </div>
      <div className="sp-body">
        {!isReadOnly && (
          <div className="sp-input-row">
            <input className="sp-input" value={newItemText} onChange={e=>setNewItemText(e.target.value)} placeholder="Tambah item checklist..." onKeyDown={e=>{ if(e.key==="Enter"){ addChecklist(list,setList,newItemText,newItemCat); setNewItemText(""); }}} />
            <select className="sp-select" value={newItemCat} onChange={e=>setNewItemCat(e.target.value)}>
              {cats.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
            <button className="sp-btn primary" style={{whiteSpace:"nowrap"}} onClick={()=>{ addChecklist(list,setList,newItemText,newItemCat); setNewItemText(""); }}>
              ➕ Tambah
            </button>
          </div>
        )}
        {list.map((item,i)=>(
          <div key={item.id} className="sp-checklist-item">
            <div className="sp-cl-num">{i+1}</div>
            <div className="sp-cl-text">{item.text}</div>
            <span className="sp-cl-cat" style={{background:(CAT_COLORS[item.cat]||"#6b7280")+"22",color:CAT_COLORS[item.cat]||"#6b7280"}}>{item.cat}</span>
            {!isReadOnly && (
              <button className="sp-btn danger" style={{padding:"3px 8px",fontSize:11,flexShrink:0}} onClick={()=>removeChecklist(list,setList,item.id)}>✕</button>
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
          list={weeklyList}
          setList={setWeeklyList}
          title="🧹 Checklist Weekly Service"
          subtitle="Dilakukan 1x seminggu per kamar oleh staff pagi"
        />
      )}

      {/* Deep Clean checklist */}
      {tab==="deepclean" && (
        <ChecklistEditor
          list={deepcleanList}
          setList={setDCList}
          title="✨ Checklist Deep Clean"
          subtitle="Dilakukan setelah check-out sebelum kamar disewakan kembali"
        />
      )}

      {/* SOP Alur */}
      {tab==="sop" && (
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <SOPView steps={DEFAULT_SOP_CHECKIN}  title="🔑 SOP Check-in Penyewa" />
          <SOPView steps={DEFAULT_SOP_CHECKOUT} title="📦 SOP Check-out Penyewa" />
          <SOPView steps={DEFAULT_SOP_KELUHAN}  title="🔧 SOP Penanganan Keluhan Urgent" />
        </div>
      )}

      {/* KPI & Insentif */}
      {tab==="kpi" && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <div className="sp-widget">
            <div className="sp-widget-head">
              <div className="sp-widget-title">🎯 Threshold KPI Insentif</div>
            </div>
            <div className="sp-body">
              <div className="sp-kpi-card">
                <div className="sp-kpi-label">Syarat Dapat Insentif Bulan Ini</div>
                {[
                  {k:"Kehadiran minimum",   v:`≥ ${pengaturanConfig.kpiThresholdPct||90}%`},
                  {k:"Nominal insentif",    v:`Rp ${(pengaturanConfig.nominalInsentif||500000).toLocaleString("id-ID")}`},
                  {k:"Denda ijin tidak sah",v:`Rp ${(pengaturanConfig.dendaIjinTidakSah||50000).toLocaleString("id-ID")}/hari`},
                  {k:"Lembur per shift",    v:`Rp ${(pengaturanConfig.lemburPerShift||50000).toLocaleString("id-ID")}`},
                  {k:"Maks pinjaman koperasi",v:`Rp ${(pengaturanConfig.maxPinjamanKoperasi||700000).toLocaleString("id-ID")}`},
                ].map((r,i)=>(
                  <div key={i} className="sp-kpi-row">
                    <span className="sp-kpi-key">{r.k}</span>
                    <span className="sp-kpi-val">{r.v}</span>
                  </div>
                ))}
              </div>
              <div className="sp-info-box">
                ⚙️ Ubah nominal di menu <b>Pengaturan → Profil Kost → HR & Gaji</b>
              </div>
            </div>
          </div>

          <div className="sp-widget">
            <div className="sp-widget-head">
              <div className="sp-widget-title">📊 Cara Hitung KPI</div>
            </div>
            <div className="sp-body">
              {[
                {step:"1",title:"Hitung hari kerja wajib",desc:"Total hari dalam bulan dikurangi hari libur resmi"},
                {step:"2",title:"Hitung kehadiran aktual",desc:"Jumlah hari dengan kode: P, M, SM, IN, L, LL, PL, LS"},
                {step:"3",title:"Hitung persentase",desc:"(Kehadiran aktual ÷ Hari kerja wajib) × 100%"},
                {step:"4",title:"Bandingkan dengan threshold",desc:`Jika ≥ ${pengaturanConfig.kpiThresholdPct||90}% → dapat insentif Rp ${(pengaturanConfig.nominalInsentif||500000).toLocaleString("id-ID")}`},
                {step:"5",title:"Hitung potongan",desc:"Ijin Tidak Sah (ITS) → potong Rp 50rb/hari dari gaji"},
              ].map((s,i)=>(
                <div key={i} className="sp-sop-step">
                  <div className="sp-sop-num" style={{background:"linear-gradient(135deg,#3b82f6,#2563eb)"}}>{s.step}</div>
                  <div className="sp-sop-content">
                    <div className="sp-sop-title">{s.title}</div>
                    <div className="sp-sop-desc">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Inventaris Kamar */}
      {tab==="inventaris" && (
        <div className="sp-widget">
          <div className="sp-widget-head">
            <div className="sp-widget-title">📦 Inventaris Fasilitas Standar per Kamar</div>
            <span style={{fontSize:11,color:"#9ca3af"}}>{inventaris.length} item</span>
          </div>
          <div className="sp-body">
            {!isReadOnly && (
              <div className="sp-input-row">
                <input className="sp-input" value={newInvNama} onChange={e=>setNewInvNama(e.target.value)} placeholder="Nama fasilitas..." onKeyDown={e=>{ if(e.key==="Enter"&&newInvNama){ setInventaris(p=>[...p,{id:Date.now(),nama:newInvNama,qty:newInvQty,satuan:newInvSat}]); setNewInvNama(""); setDirty(true); }}} />
                <input type="number" className="sp-input" value={newInvQty} onChange={e=>setNewInvQty(Number(e.target.value))} style={{maxWidth:70}} min={1} />
                <select className="sp-select" value={newInvSat} onChange={e=>setNewInvSat(e.target.value)}>
                  {["buah","set","unit","lembar","pasang","botol"].map(s=><option key={s} value={s}>{s}</option>)}
                </select>
                <button className="sp-btn primary" onClick={()=>{ if(newInvNama){ setInventaris(p=>[...p,{id:Date.now(),nama:newInvNama,qty:newInvQty,satuan:newInvSat}]); setNewInvNama(""); setDirty(true); }}}>➕</button>
              </div>
            )}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {inventaris.map(item=>(
                <div key={item.id} className="sp-inv-item">
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:16}}>📦</span>
                    <div>
                      <div className="sp-inv-name">{item.nama}</div>
                      <div style={{fontSize:10,color:"#9ca3af"}}>{item.satuan}</div>
                    </div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div className="sp-inv-qty">{item.qty}x</div>
                    {!isReadOnly && (
                      <button className="sp-btn danger" style={{padding:"3px 7px",fontSize:10}} onClick={()=>{ setInventaris(p=>p.filter(i=>i.id!==item.id)); setDirty(true); }}>✕</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="sp-info-box">
              📋 Inventaris ini digunakan sebagai referensi saat deep clean dan check-out untuk verifikasi kelengkapan fasilitas kamar.
            </div>
          </div>
          {!isReadOnly && dirty && (
            <div className="sp-save-bar">
              <button className="sp-btn primary" onClick={()=>{ setDirty(false); alert("✅ Inventaris tersimpan!"); }}>✅ Simpan</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
