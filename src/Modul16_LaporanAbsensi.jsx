import { useState, useEffect, useMemo } from "react";

const divBy = (a, b) => b === 0 ? 0 : a / b;


// ============================================================
// CSS
// ============================================================



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
  SM:  { label:"Sore-Malam",        color:"#fff", bg:"#8b5cf6",  short:"SM" },
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
  const entries = absensiData.filter(a=>a.karyawanId===karyawanId && a.tanggal && tanggal.startsWith(prefix));

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
  const kpiAbsensi = totalHariKerja > 0 ? Math.round(divBy(masuk * 100, Math.max(totalHariKerja-libur,1))) : 0;

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
export default function Modul16_LaporanAbsensi({ user, globalData = {} }) {
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
    const sumKPI = aktif.reduce((s,k)=>s+hitungRekap(absensiList,k.id,periode.bulan,periode.tahun).kpiAbsensi,0);
    const avgLen = aktif.length || 1;
    const avgKPI = aktif.length > 0 ? Math.round(divBy(sumKPI, avgLen)) : 0;
    return {totalMasuk,totalITS,totalLembur,avgKPI};
  },[absensiList,karyawanList,periode]);

  // Modal input kode untuk satu tanggal
  const ModalInputKode = ({ tanggal, karyawanId, onClose }) => {
    const existing = absensiList.find(a=>a.karyawanId===karyawanId&&a.tanggal===tanggal)?.kode;
    return (
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
    );
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
      const safeTotalAll = totalAll || 1;
      const pct = totalAll>0 ? Math.round(divBy(totalM*100, safeTotalAll)) : 0;
      return { label:BULAN_SHORT[d.getMonth()], pct };
    });
  },[absensiList,karyawanList]);

  const maxTrend = Math.max(...trendData.map(t=>t.pct),1);

  return (
    <div className="la-wrap">

      {/* Cards */}
      <div className="la-cards">
        {[
          {label:"Total Masuk",     val:stats.totalMasuk,  color:"#16a34a", sub:`${BULAN_FULL[periode.bulan-1]} ${periode.tahun}`},
          {label:"KPI Rata-rata",   val:stats.avgKPI+"%",color:"#f97316", sub:"Kehadiran periode ini"},
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
        <button className="la-btn ghost" onClick={()=>alert("Export CSV — coming soon!")}>⬇️ Export</button>
        <button className="la-btn primary" onClick={()=>alert("Download PDF — coming soon!")}>📄 PDF</button>
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
                              <div className="la-kpi-fill" style={{width:r.kpiAbsensi+"%",background:r.kpiAbsensi>=90?"#16a34a":r.kpiAbsensi>=70?"#f97316":"#ef4444"}} />
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
                    <div style={{fontSize:10,color:"#9ca3af"}}>{k.shift && shift.split(" ")[0]}</div>
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
                        <div style={{fontSize:10,color:"#9ca3af"}}>{r.masuk} masuk - {r.its} ITS</div>
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
                    <div className="la-kpi-fill" style={{width:r.kpiAbsensi+"%",background:kpiColor}} />
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
                {trendData.map((t,i)=>{
                  const safeMax = maxTrend>0 ? maxTrend : 1;
                  const barPct = (t.pct*80);
                  const barH = Math.max(4, Math.round(divBy(barPct, safeMax)));
                  const barColor = t.pct>=90?"#16a34a":t.pct>=70?"#f97316":"#ef4444";
                  return (
                  <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                    <div style={{fontSize:9,color:"#374151",fontWeight:600}}>{t.pct}%</div>
                    <div style={{
                      width:"100%",borderRadius:"4px 4px 0 0",
                      height:barH+"px",
                      background:barColor,
                      transition:"height .4s"
                    }} />
                    <div style={{fontSize:9,color:"#9ca3af",fontWeight:600}}>{t.label}</div>
                  </div>
                  );
                })}
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
  </div>
  </div>
  );
}