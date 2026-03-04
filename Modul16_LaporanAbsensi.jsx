import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";

// ============================================================
// CSS
// ============================================================
const CSS = `
  .la-wrap { display:flex; flex-direction:column; gap:16px; }

  .la-cards { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
  .la-card  { background:#fff; border-radius:12px; border:1px solid #e5e7eb; padding:14px 16px; position:relative; overflow:hidden; }
  .la-card-bar { position:absolute; top:0; left:0; right:0; height:3px; }
  .la-card-label { font-size:10px; font-weight:500; color:#9ca3af; text-transform:uppercase; letter-spacing:.8px; margin-bottom:4px; margin-top:8px; }
  .la-card-val { font-size:22px; font-weight:700; color:#111827; }
  .la-card-sub { font-size:11px; color:#6b7280; margin-top:3px; }

  .la-period { background:#fff; border-radius:12px; border:1px solid #e5e7eb; padding:12px 16px; display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
  .la-select { padding:6px 10px; border-radius:8px; border:1.5px solid #e5e7eb; font-size:12px; color:#374151; background:#fff; outline:none; font-family:inherit; cursor:pointer; }
  .la-select:focus { border-color:#f97316; }

  .la-widget { background:#fff; border-radius:12px; border:1px solid #e5e7eb; overflow:hidden; }
  .la-widget-head { padding:13px 16px 10px; border-bottom:1px solid #f3f4f6; display:flex; align-items:center; justify-content:space-between; }
  .la-widget-title { font-size:13px; font-weight:700; color:#111827; }

  /* Kalender absensi */
  .la-cal-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:2px; padding:12px; }
  .la-cal-head { text-align:center; font-size:10px; font-weight:700; color:#9ca3af; padding:4px 0; }
  .la-cal-day  { min-height:42px; border-radius:7px; padding:4px; font-size:11px; cursor:default; }
  .la-cal-day.empty { background:transparent; }
  .la-cal-day.today { outline:2px solid #f97316; }

  /* Kode absensi */
  .la-kode { display:inline-flex; align-items:center; justify-content:center; width:24px; height:24px; border-radius:6px; font-size:9px; font-weight:700; }

  /* Table */
  .la-table { width:100%; border-collapse:collapse; }
  .la-table th { padding:9px 14px; font-size:10px; font-weight:700; color:#9ca3af; text-transform:uppercase; letter-spacing:.8px; background:#f9fafb; text-align:left; white-space:nowrap; }
  .la-table th.center { text-align:center; }
  .la-table td { padding:10px 14px; font-size:12px; color:#374151; border-bottom:1px solid #f9fafb; vertical-align:middle; }
  .la-table td.center { text-align:center; }
  .la-table tr:last-child td { border-bottom:none; }
  .la-table tr:hover td { background:#fafafa; }

  /* KPI bar */
  .la-kpi-bar { height:6px; background:#f3f4f6; border-radius:3px; overflow:hidden; margin-top:4px; }
  .la-kpi-fill { height:100%; border-radius:3px; transition:width .4s; }

  /* Badge */
  .la-badge { display:inline-flex; align-items:center; gap:3px; padding:2px 8px; border-radius:20px; font-size:10px; font-weight:600; }

  .la-btn { display:flex; align-items:center; gap:5px; padding:7px 14px; border-radius:8px; font-size:12px; font-weight:600; border:none; cursor:pointer; font-family:inherit; transition:all .15s; }
  .la-btn.primary { background:linear-gradient(135deg,#f97316,#ea580c); color:#fff; }
  .la-btn.ghost   { background:#f3f4f6; color:#4b5563; border:1.5px solid #e5e7eb; }

  .la-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:48px 16px; color:#9ca3af; text-align:center; gap:8px; }

  /* Tab */
  .la-tabs { display:flex; gap:4px; background:#fff; border-radius:12px; border:1px solid #e5e7eb; padding:5px; }
  .la-tab  { flex:1; padding:"8px 12px"; border-radius:8px; text-align:center; font-size:12px; font-weight:600; cursor:pointer; color:#9ca3af; transition:all .15s; padding:8px 12px; }
  .la-tab.active { color:#fff; background:linear-gradient(135deg,#f97316,#ea580c); }

  @media(max-width:768px) { .la-cards{grid-template-columns:repeat(2,1fr)} }
`;

function StyleInjector() {
  useEffect(() => {
    const id = "senyuminn-lapabsensi-css";
    if (document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id; el.textContent = CSS;
    document.head.appendChild(el);
    return () => { const e=document.getElementById(id); if(e) e.remove(); };
  },[]);
  return null;
}

// ============================================================
// CONSTANTS
// ============================================================
const BULAN_FULL = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
const BULAN_SHORT = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
const thisYear  = new Date().getFullYear();
const thisMonth = new Date().getMonth() + 1;
const padD = (n) => String(n).padStart(2,"0");

// Kode absensi lengkap
const KODE_ABSENSI = {
  P:   { label:"Pagi",              color:"#fff", bg:"#3b82f6",  short:"P"  },
  M:   { label:"Malam",             color:"#fff", bg:"#6366f1",  short:"M"  },
  SM:  { label:"Sore/Malam",        color:"#fff", bg:"#8b5cf6",  short:"SM" },
  OFF: { label:"Libur",             color:"#fff", bg:"#9ca3af",  short:"OFF"},
  L:   { label:"Lembur Malam",      color:"#fff", bg:"#f97316",  short:"L"  },
  LL:  { label:"Lembur Lebaran",    color:"#fff", bg:"#f59e0b",  short:"LL" },
  PL:  { label:"Pagi+Lembur Malam", color:"#fff", bg:"#ea580c",  short:"P+L"},
  C:   { label:"Cuti",              color:"#fff", bg:"#22c55e",  short:"C"  },
  IJ:  { label:"Ijin",              color:"#fff", bg:"#06b6d4",  short:"IJ" },
  ITS: { label:"Ijin Tidak Sah",    color:"#fff", bg:"#ef4444",  short:"ITS"},
  SKT: { label:"Sakit",             color:"#fff", bg:"#ec4899",  short:"SKT"},
  LS:  { label:"Lembur Tambahan",   color:"#fff", bg:"#f97316",  short:"LS" },
  IN:  { label:"Masuk (checklist)", color:"#fff", bg:"#16a34a",  short:"IN" },
};

const getInisial = (nama) => {
  if (!nama) return "?";
  const p = nama.trim().split(" ");
  return (p.length>=2 ? p[0][0]+p[1][0] : nama.slice(0,2)).toUpperCase();
};
const AVATAR_COLORS = ["#f97316","#3b82f6","#8b5cf6","#16a34a","#ec4899","#06b6d4"];
const getColor = (id) => AVATAR_COLORS[(id||0) % AVATAR_COLORS.length];

// Hitung rekap absensi dari data
const hitungRekap = (absensiData, karyawanId, bulan, tahun) => {
  const prefix = `${tahun}-${padD(bulan)}`;
  const entries = absensiData.filter(a=>a.karyawanId===karyawanId && a.tanggal?.startsWith(prefix));

  let masuk=0, libur=0, ijin=0, sakit=0, cuti=0, lembur=0, its=0;
  entries.forEach(e=>{
    const k = e.kode;
    if (["P","M","SM","IN"].includes(k)) masuk++;
    if (k==="OFF") libur++;
    if (k==="IJ")  ijin++;
    if (k==="SKT") sakit++;
    if (k==="C")   cuti++;
    if (["L","LL","PL","LS"].includes(k)) lembur++;
    if (k==="ITS") its++;
  });

  const totalHariKerja = entries.length;
  const kpiAbsensi = totalHariKerja > 0 ? Math.round((masuk / Math.max(totalHariKerja-libur,1)) * 100) : 0;

  return { masuk, libur, ijin, sakit, cuti, lembur, its, kpiAbsensi, totalEntries:entries.length };
};

// Kalender absensi satu karyawan
function KalenderAbsensi({ karyawanId, absensiData, bulan, tahun, onInputKode, isReadOnly }) {
  const HARI = ["MIN","SEN","SEL","RAB","KAM","JUM","SAB"];
  const daysInMonth = new Date(tahun, bulan, 0).getDate();
  const firstDay    = new Date(tahun, bulan-1, 1).getDay();
  const todayStr    = new Date().toISOString().slice(0,10);

  const getKode = (day) => {
    const tgl = `${tahun}-${padD(bulan)}-${padD(day)}`;
    return absensiData.find(a=>a.karyawanId===karyawanId && a.tanggal===tgl)?.kode || null;
  };

  const cells = [];
  for (let i=0; i<firstDay; i++) cells.push(null);
  for (let d=1; d<=daysInMonth; d++) cells.push(d);

  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,padding:"10px 12px 0"}}>
        {HARI.map(h=><div key={h} className="la-cal-head">{h}</div>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,padding:"4px 12px 12px"}}>
        {cells.map((day,i)=>{
          if (!day) return <div key={`e-${i}`} />;
          const tgl   = `${tahun}-${padD(bulan)}-${padD(day)}`;
          const kode  = getKode(day);
          const conf  = kode ? KODE_ABSENSI[kode] : null;
          const isToday = tgl === todayStr;

          return (
            <div
              key={day}
              className={`la-cal-day ${isToday?"today":""}`}
              style={{background:conf?conf.bg+"22":"#f9fafb",cursor:isReadOnly?"default":"pointer",border:`1px solid ${conf?conf.bg+"44":"#f3f4f6"}`}}
              onClick={()=>{ if (!isReadOnly) onInputKode(tgl); }}
              title={conf ? `${conf.label}` : "Klik untuk input"}
            >
              <div style={{fontSize:10,color:"#374151",fontWeight:isToday?700:400,marginBottom:2}}>{day}</div>
              {conf && (
                <div className="la-kode" style={{background:conf.bg,color:conf.color,width:"auto",padding:"1px 4px",borderRadius:4,fontSize:9}}>
                  {conf.short}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// MAIN
// ============================================================
// ============================================================
// PDF LAPORAN ABSENSI
// ============================================================
const loadJsPDF_LA = () => new Promise((resolve, reject) => {
  if (window.jspdf) return resolve(window.jspdf.jsPDF);
  const s = document.createElement("script");
  s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
  s.onload  = () => resolve(window.jspdf.jsPDF);
  s.onerror = () => reject(new Error("Gagal load jsPDF"));
  document.head.appendChild(s);
});

const generateAbsensiPDF = async (karyawanList, absensiList, periode) => {
  const JsPDF = await loadJsPDF_LA();
  const doc   = new JsPDF({ orientation:"landscape", unit:"mm", format:"a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();

  const padD = n => String(n).padStart(2,"0");
  const { tahun, bulan } = periode;
  const bulanStr = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"][bulan-1];
  const periodeLabel = `${bulanStr} ${tahun}`;

  // Header
  doc.setFillColor(30,41,59); doc.rect(0,0,W,28,"F");
  doc.setFillColor(249,115,22); doc.circle(18,14,9,"F");
  doc.setTextColor(255,255,255); doc.setFontSize(11); doc.setFont("helvetica","bold");
  doc.text("S",18,17.5,{align:"center"});
  doc.setTextColor(255,255,255); doc.setFontSize(13); doc.setFont("helvetica","bold");
  doc.text("SENYUM INN",32,11);
  doc.setFontSize(7); doc.setFont("helvetica","normal"); doc.setTextColor(148,163,184);
  doc.text("EXCLUSIVE KOST",32,16);
  doc.setTextColor(255,255,255); doc.setFontSize(12); doc.setFont("helvetica","bold");
  doc.text("LAPORAN ABSENSI KARYAWAN",W-14,11,{align:"right"});
  doc.setFontSize(8); doc.setFont("helvetica","normal"); doc.setTextColor(148,163,184);
  doc.text("Periode: "+periodeLabel,W-14,18,{align:"right"});
  doc.text("Dicetak: "+new Date().toLocaleDateString("id-ID",{day:"2-digit",month:"long",year:"numeric"}),W-14,23,{align:"right"});

  let y = 36;

  // Kolom header tabel
  const cols = [
    {label:"No",      w:8,  x:14},
    {label:"Nama",    w:42, x:22},
    {label:"Jabatan", w:36, x:64},
    {label:"Masuk",   w:16, x:100},
    {label:"Libur",   w:14, x:116},
    {label:"Ijin",    w:12, x:130},
    {label:"Sakit",   w:14, x:142},
    {label:"Lembur",  w:14, x:156},
    {label:"ITS",     w:10, x:170},
    {label:"KPI %",   w:16, x:180},
    {label:"Insentif",w:24, x:196},
  ];

  // Header tabel
  doc.setFillColor(249,115,22); doc.rect(14,y,W-28,8,"F");
  doc.setTextColor(255,255,255); doc.setFontSize(7); doc.setFont("helvetica","bold");
  cols.forEach(col=>doc.text(col.label, col.x, y+5.5));
  y += 8;

  const aktif = karyawanList.filter(k=>k.aktif!==false);
  const prefix = `${tahun}-${padD(bulan)}`;
  const fmtR = n => "Rp "+(n||0).toLocaleString("id-ID");

  aktif.forEach((k, idx) => {
    const entries = absensiList.filter(a=>a.karyawanId===k.id && a.tanggal?.startsWith(prefix));
    let masuk=0,libur=0,ijin=0,sakit=0,lembur=0,its=0;
    entries.forEach(e=>{
      const kd = e.kode;
      if(["P","M","SM","IN"].includes(kd)) masuk++;
      if(kd==="OFF") libur++;
      if(kd==="IJ")  ijin++;
      if(kd==="SKT") sakit++;
      if(["L","LL","PL","LS"].includes(kd)) lembur++;
      if(kd==="ITS") its++;
    });
    const hariKerja = masuk+ijin+sakit+cuti+its;
    const kpiPct    = hariKerja>0 ? Math.round((masuk/hariKerja)*100) : 0;
    const insentif  = kpiPct>=90 ? 500000 : 0;

    // Zebra stripe
    if(idx%2===0){ doc.setFillColor(248,250,252); doc.rect(14,y,W-28,7,"F"); }
    doc.setTextColor(30,41,59); doc.setFontSize(7); doc.setFont("helvetica","normal");
    doc.text(String(idx+1),      cols[0].x, y+5);
    doc.text(k.nama||"—",        cols[1].x, y+5);
    doc.text(k.jabatan||"—",     cols[2].x, y+5);
    doc.text(String(masuk),      cols[3].x, y+5);
    doc.text(String(libur),      cols[4].x, y+5);
    doc.text(String(ijin),       cols[5].x, y+5);
    doc.text(String(sakit),      cols[6].x, y+5);
    doc.text(String(lembur),     cols[7].x, y+5);
    doc.text(String(its),        cols[8].x, y+5);

    // KPI % dengan warna
    doc.setTextColor(kpiPct>=90?[22,163,74]:[220,38,38]);
    if (Array.isArray(kpiPct>=90?[22,163,74]:[220,38,38]))
      doc.setTextColor(...(kpiPct>=90?[22,163,74]:[220,38,38]));
    doc.text(kpiPct+"%",         cols[9].x,  y+5);
    doc.setTextColor(kpiPct>=90?22:220, kpiPct>=90?163:38, kpiPct>=90?74:38);
    doc.text(insentif>0?fmtR(insentif):"—", cols[10].x, y+5);

    doc.setDrawColor(230,232,235); doc.setLineWidth(0.1);
    doc.line(14,y+7,W-14,y+7);
    y += 7;

    // Page break
    if(y > H-20){ doc.addPage(); y=20; }
  });

  // Footer
  doc.setDrawColor(200,210,220); doc.setLineWidth(0.3);
  doc.line(14,H-14,W-14,H-14);
  doc.setTextColor(100,116,139); doc.setFontSize(7); doc.setFont("helvetica","normal");
  doc.text("Senyum Inn — Laporan absensi digenerate otomatis",14,H-9);
  doc.text("Hal. "+doc.internal.getCurrentPageInfo().pageNumber,W-14,H-9,{align:"right"});

  doc.save("laporan-absensi-"+periodeLabel.replace(/\s/g,"-").toLowerCase()+".pdf");
};

export default function LaporanAbsensi({ user, globalData = {} }) {
  const {
    karyawanList  = [],
    absensiList   = [], setAbsensiList = ()=>{},
    isReadOnly    = false,
  } = globalData;

  const [periode,     setPeriode]    = useState({ tahun:thisYear, bulan:thisMonth });
  const [activeTab,   setActiveTab]  = useState("rekap");
  const [selectedK,   setSelectedK]  = useState(null);
  const [showInput,   setShowInput]  = useState(null); // tanggal string
  const [filterK,     setFilterK]    = useState("all");
  const setPV = (k,v) => setPeriode(p=>({...p,[k]:v}));
  const years = [thisYear-1, thisYear, thisYear+1];

  const aktif = karyawanList.filter(k=>k.aktif);

  // Input kode absensi
  const handleInputKode = (tgl, karyawanId, kode) => {
    setAbsensiList(prev=>{
      const exists = prev.findIndex(a=>a.karyawanId===karyawanId && a.tanggal===tgl);
      if (exists >= 0) {
        const updated = [...prev];
        updated[exists] = {...updated[exists], kode};
        return updated;
      }
      return [...prev, {id:Date.now(), karyawanId, tanggal:tgl, kode}];
    });
  };

  // Stats
  const stats = useMemo(()=>{
    let totalMasuk=0, totalITS=0, totalLembur=0;
    aktif.forEach(k=>{
      const r = hitungRekap(absensiList, k.id, periode.bulan, periode.tahun);
      totalMasuk  += r.masuk;
      totalITS    += r.its;
      totalLembur += r.lembur;
    });
    const avgKPI = aktif.length > 0
      ? Math.round(aktif.reduce((s,k)=>s+hitungRekap(absensiList,k.id,periode.bulan,periode.tahun).kpiAbsensi,0)/aktif.length)
      : 0;
    return {totalMasuk,totalITS,totalLembur,avgKPI};
  },[absensiList,karyawanList,periode]);

  // Modal input kode untuk satu tanggal
  const ModalInputKode = ({ tanggal, karyawanId, onClose }) => {
    const existing = absensiList.find(a=>a.karyawanId===karyawanId&&a.tanggal===tanggal)?.kode;
    return createPortal ? (
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={onClose}>
        <div style={{background:"#fff",borderRadius:16,padding:20,width:400,maxHeight:"80vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
          <div style={{fontSize:14,fontWeight:700,color:"#111827",marginBottom:4}}>Input Kode Absensi</div>
          <div style={{fontSize:11,color:"#9ca3af",marginBottom:16}}>📅 {tanggal}</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
            {Object.entries(KODE_ABSENSI).map(([kode,conf])=>(
              <div
                key={kode}
                onClick={()=>{ handleInputKode(tanggal,karyawanId,kode); onClose(); }}
                style={{
                  padding:"9px 8px", borderRadius:9, cursor:"pointer", textAlign:"center",
                  background:existing===kode?conf.bg:conf.bg+"22",
                  border:`1.5px solid ${existing===kode?conf.bg:conf.bg+"55"}`,
                  transition:"all .12s"
                }}
              >
                <div style={{fontSize:13,fontWeight:700,color:existing===kode?"#fff":conf.bg}}>{conf.short}</div>
                <div style={{fontSize:9,color:existing===kode?"rgba(255,255,255,.8)":conf.bg,marginTop:2,lineHeight:1.2}}>{conf.label}</div>
              </div>
            ))}
          </div>
          <button style={{marginTop:14,width:"100%",padding:"9px",borderRadius:9,background:"#f3f4f6",border:"none",fontSize:12,fontWeight:600,color:"#6b7280",cursor:"pointer"}} onClick={onClose}>
            Tutup
          </button>
        </div>
      </div>
    , document.body) : null;
  };

  // Trend 6 bulan untuk chart mini
  const trendData = useMemo(()=>{
    return Array.from({length:6},(_,i)=>{
      const d = new Date(); d.setMonth(d.getMonth()-5+i);
      const b = d.getMonth()+1, t = d.getFullYear();
      let totalM=0, totalAll=0;
      aktif.forEach(k=>{
        const r = hitungRekap(absensiList,k.id,b,t);
        totalM   += r.masuk;
        totalAll += r.masuk+r.libur+r.ijin+r.sakit+r.its;
      });
      const pct = totalAll>0 ? Math.round((totalM/totalAll)*100) : 0;
      return { label:BULAN_SHORT[d.getMonth()], pct };
    });
  },[absensiList,karyawanList]);

  const maxTrend = Math.max(...trendData.map(t=>t.pct),1);

  return (
    <div className="la-wrap">
      <StyleInjector />

      {/* Cards */}
      <div className="la-cards">
        {[
          {label:"Total Masuk",     val:stats.totalMasuk,  color:"#16a34a", sub:`${BULAN_FULL[periode.bulan-1]} ${periode.tahun}`},
          {label:"KPI Rata-rata",   val:`${stats.avgKPI}%`,color:"#f97316", sub:"Kehadiran periode ini"},
          {label:"Ijin Tidak Sah",  val:stats.totalITS,    color:"#ef4444", sub:"Potongan aktif"},
          {label:"Lembur",          val:stats.totalLembur, color:"#3b82f6", sub:"Shift lembur"},
        ].map((c,i)=>(
          <div key={i} className="la-card">
            <div className="la-card-bar" style={{background:c.color}} />
            <div className="la-card-label">{c.label}</div>
            <div className="la-card-val" style={{color:c.color}}>{c.val}</div>
            <div className="la-card-sub">{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Period */}
      <div className="la-period">
        <span style={{fontSize:12,fontWeight:600,color:"#374151"}}>📅 Periode:</span>
        <select className="la-select" value={periode.tahun} onChange={e=>setPV("tahun",parseInt(e.target.value))}>
          {years.map(y=><option key={y} value={y}>{y}</option>)}
        </select>
        <select className="la-select" value={periode.bulan} onChange={e=>setPV("bulan",parseInt(e.target.value))}>
          {BULAN_FULL.map((b,i)=><option key={i} value={i+1}>{b}</option>)}
        </select>
        <select className="la-select" value={filterK} onChange={e=>setFilterK(e.target.value)}>
          <option value="all">Semua Karyawan</option>
          {aktif.map(k=><option key={k.id} value={k.id}>{k.nama}</option>)}
        </select>
        <button className="la-btn ghost" onClick={()=>{
          // Export CSV
          const prefix = `${periode.tahun}-${String(periode.bulan).padStart(2,"0")}`;
          const aktif = karyawanList.filter(k=>k.aktif!==false);
          const rows  = aktif.map(k=>{
            const entries = absensiList.filter(a=>a.karyawanId===k.id&&a.tanggal?.startsWith(prefix));
            let masuk=0,libur=0,ijin=0,sakit=0,lembur=0;
            entries.forEach(e=>{
              if(["P","M","SM","IN"].includes(e.kode)) masuk++;
              if(e.kode==="OFF") libur++;
              if(e.kode==="IJ")  ijin++;
              if(e.kode==="SKT") sakit++;
              if(["L","LL","PL","LS"].includes(e.kode)) lembur++;
            });
            return [k.nama,k.jabatan,masuk,libur,ijin,sakit,lembur].join(",");
          });
          const csv = "Nama,Jabatan,Masuk,Libur,Ijin,Sakit,Lembur\n"+rows.join("\n");
          const a=document.createElement("a");
          a.href="data:text/csv;charset=utf-8,"+encodeURIComponent(csv);
          a.download="absensi-"+prefix+".csv"; a.click();
        }}>⬇️ Export CSV</button>
        <button className="la-btn primary" onClick={()=>generateAbsensiPDF(karyawanList,absensiList,periode)}>📄 PDF</button>
      </div>

      {/* Tabs */}
      <div className="la-tabs">
        {[
          {id:"rekap",    label:"📊 Rekap Bulanan"},
          {id:"kalender", label:"📅 Kalender Absensi"},
          {id:"kpi",      label:"🎯 KPI & Performa"},
        ].map(t=>(
          <div key={t.id} className={`la-tab ${activeTab===t.id?"active":""}`} onClick={()=>setActiveTab(t.id)}>
            {t.label}
          </div>
        ))}
      </div>

      {/* ── Tab: Rekap Bulanan */}
      {activeTab==="rekap" && (
        <div className="la-widget">
          <div className="la-widget-head">
            <div className="la-widget-title">📊 Rekap Absensi — {BULAN_FULL[periode.bulan-1]} {periode.tahun}</div>
          </div>
          {aktif.length === 0 ? (
            <div className="la-empty"><div style={{fontSize:32,opacity:.4}}>👥</div><div style={{fontSize:13,fontWeight:600,color:"#374151"}}>Belum ada karyawan</div></div>
          ) : (
            <table className="la-table">
              <thead>
                <tr>
                  <th>Karyawan</th>
                  <th className="center">Masuk</th>
                  <th className="center">Libur</th>
                  <th className="center">Cuti</th>
                  <th className="center">Ijin</th>
                  <th className="center">Sakit</th>
                  <th className="center">Lembur</th>
                  <th className="center" style={{color:"#ef4444"}}>ITS</th>
                  <th>KPI Absensi</th>
                </tr>
              </thead>
              <tbody>
                {aktif
                  .filter(k=>filterK==="all"||String(k.id)===String(filterK))
                  .map(k=>{
                    const r = hitungRekap(absensiList, k.id, periode.bulan, periode.tahun);
                    return (
                      <tr key={k.id}>
                        <td>
                          <div style={{display:"flex",alignItems:"center",gap:9}}>
                            <div style={{width:30,height:30,borderRadius:8,background:getColor(k.id),display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff",flexShrink:0}}>
                              {getInisial(k.nama)}
                            </div>
                            <div>
                              <div style={{fontSize:12,fontWeight:600,color:"#1f2937"}}>{k.nama}</div>
                              <div style={{fontSize:10,color:"#9ca3af"}}>{k.jabatan}</div>
                            </div>
                          </div>
                        </td>
                        <td className="center" style={{color:"#16a34a",fontWeight:700}}>{r.masuk}</td>
                        <td className="center" style={{color:"#9ca3af"}}>{r.libur}</td>
                        <td className="center" style={{color:"#22c55e"}}>{r.cuti}</td>
                        <td className="center" style={{color:"#06b6d4"}}>{r.ijin}</td>
                        <td className="center" style={{color:"#ec4899"}}>{r.sakit}</td>
                        <td className="center" style={{color:"#f97316",fontWeight:600}}>{r.lembur}</td>
                        <td className="center" style={{color:r.its>0?"#ef4444":"#9ca3af",fontWeight:r.its>0?700:400}}>
                          {r.its > 0 ? `⚠️ ${r.its}` : "0"}
                        </td>
                        <td style={{minWidth:120}}>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            <div className="la-kpi-bar" style={{flex:1}}>
                              <div className="la-kpi-fill" style={{width:`${r.kpiAbsensi}%`,background:r.kpiAbsensi>=90?"#16a34a":r.kpiAbsensi>=70?"#f97316":"#ef4444"}} />
                            </div>
                            <span style={{fontSize:11,fontWeight:700,color:r.kpiAbsensi>=90?"#16a34a":r.kpiAbsensi>=70?"#f97316":"#ef4444",minWidth:32}}>
                              {r.kpiAbsensi}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── Tab: Kalender Absensi */}
      {activeTab==="kalender" && (
        <div style={{display:"grid",gridTemplateColumns:aktif.length>1?"200px 1fr":"1fr",gap:14}}>
          {/* List karyawan (kalau lebih dari 1) */}
          {aktif.length > 1 && (
            <div className="la-widget">
              <div className="la-widget-head"><div className="la-widget-title">👥 Pilih Karyawan</div></div>
              {aktif.map(k=>(
                <div
                  key={k.id}
                  onClick={()=>setSelectedK(k)}
                  style={{
                    display:"flex",alignItems:"center",gap:9,padding:"9px 12px",cursor:"pointer",borderBottom:"1px solid #f3f4f6",
                    background:selectedK?.id===k.id?"#fff7ed":"#fff",
                    borderLeft:selectedK?.id===k.id?"3px solid #f97316":"3px solid transparent",
                  }}
                >
                  <div style={{width:28,height:28,borderRadius:7,background:getColor(k.id),display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff"}}>
                    {getInisial(k.nama)}
                  </div>
                  <div>
                    <div style={{fontSize:12,fontWeight:600,color:"#1f2937"}}>{k.nama}</div>
                    <div style={{fontSize:10,color:"#9ca3af"}}>{k.shift?.split(" ")[0]}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Kalender */}
          <div className="la-widget">
            {(selectedK || aktif[0]) ? (
              <>
                <div className="la-widget-head">
                  <div className="la-widget-title">
                    📅 {(selectedK||aktif[0]).nama} — {BULAN_FULL[periode.bulan-1]} {periode.tahun}
                  </div>
                  {!isReadOnly && <span style={{fontSize:11,color:"#9ca3af"}}>Klik tanggal untuk input</span>}
                </div>
                {/* Legenda */}
                <div style={{padding:"8px 12px",display:"flex",gap:6,flexWrap:"wrap",borderBottom:"1px solid #f3f4f6"}}>
                  {Object.entries(KODE_ABSENSI).map(([k,v])=>(
                    <div key={k} style={{display:"flex",alignItems:"center",gap:3}}>
                      <div style={{width:18,height:18,borderRadius:4,background:v.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:700,color:"#fff"}}>{v.short}</div>
                      <span style={{fontSize:9,color:"#6b7280"}}>{v.label}</span>
                    </div>
                  ))}
                </div>
                <KalenderAbsensi
                  karyawanId={(selectedK||aktif[0]).id}
                  absensiData={absensiList}
                  bulan={periode.bulan}
                  tahun={periode.tahun}
                  onInputKode={(tgl)=>setShowInput({tgl,karyawanId:(selectedK||aktif[0]).id})}
                  isReadOnly={isReadOnly}
                />
              </>
            ) : (
              <div className="la-empty"><div style={{fontSize:32,opacity:.4}}>📅</div><div style={{fontSize:13}}>Pilih karyawan</div></div>
            )}
          </div>
        </div>
      )}

      {/* ── Tab: KPI & Performa */}
      {activeTab==="kpi" && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          {/* KPI per karyawan */}
          <div className="la-widget">
            <div className="la-widget-head">
              <div className="la-widget-title">🎯 KPI Absensi per Karyawan</div>
              <span style={{fontSize:11,color:"#9ca3af"}}>Threshold: ≥90% = Insentif</span>
            </div>
            {aktif.length===0 ? (
              <div className="la-empty"><div style={{fontSize:28,opacity:.4}}>🎯</div><div>Belum ada karyawan</div></div>
            ) : aktif.map(k=>{
              const r = hitungRekap(absensiList, k.id, periode.bulan, periode.tahun);
              const kpiColor = r.kpiAbsensi>=90?"#16a34a":r.kpiAbsensi>=70?"#f97316":"#ef4444";
              const lulus = r.kpiAbsensi >= 90;
              return (
                <div key={k.id} style={{padding:"12px 14px",borderBottom:"1px solid #f9fafb"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:28,height:28,borderRadius:7,background:getColor(k.id),display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff"}}>
                        {getInisial(k.nama)}
                      </div>
                      <div>
                        <div style={{fontSize:12,fontWeight:600,color:"#1f2937"}}>{k.nama}</div>
                        <div style={{fontSize:10,color:"#9ca3af"}}>{r.masuk} masuk · {r.its} ITS</div>
                      </div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:16,fontWeight:800,color:kpiColor}}>{r.kpiAbsensi}%</div>
                      <span className="la-badge" style={{color:lulus?"#16a34a":"#dc2626",background:lulus?"#dcfce7":"#fee2e2"}}>
                        {lulus?"✅ Insentif":"✕ Tidak"}
                      </span>
                    </div>
                  </div>
                  <div className="la-kpi-bar">
                    <div className="la-kpi-fill" style={{width:`${r.kpiAbsensi}%`,background:kpiColor}} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Trend 6 bulan */}
          <div className="la-widget">
            <div className="la-widget-head">
              <div className="la-widget-title">📈 Trend Kehadiran 6 Bulan</div>
            </div>
            <div style={{padding:"16px 16px 8px"}}>
              <div style={{display:"flex",alignItems:"flex-end",gap:8,height:100}}>
                {trendData.map((t,i)=>(
                  <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                    <div style={{fontSize:9,color:"#374151",fontWeight:600}}>{t.pct}%</div>
                    <div style={{
                      width:"100%",borderRadius:"4px 4px 0 0",
                      height:`${Math.max(4,(t.pct/maxTrend)*80)}px`,
                      background:t.pct>=90?"#16a34a":t.pct>=70?"#f97316":"#ef4444",
                      transition:"height .4s"
                    }} />
                    <div style={{fontSize:9,color:"#9ca3af",fontWeight:600}}>{t.label}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Legenda kode absensi */}
            <div style={{padding:"10px 14px",borderTop:"1px solid #f3f4f6"}}>
              <div style={{fontSize:10,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:.8,marginBottom:8}}>Legenda Kode</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:4}}>
                {Object.entries(KODE_ABSENSI).map(([k,v])=>(
                  <div key={k} style={{display:"flex",alignItems:"center",gap:5,padding:"3px 0"}}>
                    <div style={{width:20,height:20,borderRadius:5,background:v.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:700,color:"#fff",flexShrink:0}}>{v.short}</div>
                    <span style={{fontSize:10,color:"#6b7280"}}>{v.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal input kode */}
      {showInput && !isReadOnly && (
        <ModalInputKode
          tanggal={showInput.tgl}
          karyawanId={showInput.karyawanId}
          onClose={()=>setShowInput(null)}
        />
      )}
    </div>
  );
}
