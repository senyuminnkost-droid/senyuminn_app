import { useState, useMemo } from "react";

function safePct(a, b) { if (!b) return 0; return Math.round((a * 100) / b); }
function safeDiv(a, b) { if (!b) return 0; return Math.round(a / b); }

const BULAN_FULL  = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
const BULAN_SHORT = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
const HARI_NAMES  = ["MIN","SEN","SEL","RAB","KAM","JUM","SAB"];
const thisYear    = new Date().getFullYear();
const thisMonth   = new Date().getMonth() + 1;

function padD(n) { return String(n).padStart(2, "0"); }
function todayISO() {
  const d = new Date();
  return d.getFullYear() + "-" + padD(d.getMonth()+1) + "-" + padD(d.getDate());
}

const KODE_LIST = [
  { kode:"P",   label:"Pagi",              bg:"#3b82f6", short:"P"   },
  { kode:"M",   label:"Malam",             bg:"#6366f1", short:"M"   },
  { kode:"SM",  label:"Sore/Malam",        bg:"#8b5cf6", short:"SM"  },
  { kode:"OFF", label:"Libur",             bg:"#9ca3af", short:"OFF" },
  { kode:"L",   label:"Lembur Malam",      bg:"#f97316", short:"L"   },
  { kode:"LL",  label:"Lembur Lebaran",    bg:"#f59e0b", short:"LL"  },
  { kode:"PL",  label:"Pagi+Lembur",       bg:"#ea580c", short:"P+L" },
  { kode:"C",   label:"Cuti",              bg:"#22c55e", short:"C"   },
  { kode:"IJ",  label:"Ijin",              bg:"#06b6d4", short:"IJ"  },
  { kode:"ITS", label:"Ijin Tidak Sah",    bg:"#ef4444", short:"ITS" },
  { kode:"SKT", label:"Sakit",             bg:"#ec4899", short:"SKT" },
  { kode:"LS",  label:"Lembur Tambahan",   bg:"#f97316", short:"LS"  },
  { kode:"IN",  label:"Masuk (checklist)", bg:"#16a34a", short:"IN"  },
];
const KODE_MAP = {};
KODE_LIST.forEach(function(k) { KODE_MAP[k.kode] = k; });

const AVATAR_COLORS = ["#f97316","#3b82f6","#8b5cf6","#16a34a","#ec4899","#06b6d4"];
function getColor(id) { return AVATAR_COLORS[(id||0) % AVATAR_COLORS.length]; }
function getInisial(nama) {
  if (!nama) return "?";
  const p = nama.trim().split(" ");
  if (p.length >= 2) return (p[0][0] + p[1][0]).toUpperCase();
  return nama.slice(0,2).toUpperCase();
}
function kpiColor(pct) {
  if (pct >= 90) return "#16a34a";
  if (pct >= 70) return "#f97316";
  return "#ef4444";
}

function hitungRekap(absensiData, karyawanId, bulan, tahun) {
  const prefix = tahun + "-" + padD(bulan);
  const entries = absensiData.filter(function(a) {
    return a.karyawanId === karyawanId && a.tanggal && a.tanggal.slice(0,7) === prefix;
  });
  let masuk=0, libur=0, ijin=0, sakit=0, cuti=0, lembur=0, its=0;
  entries.forEach(function(e) {
    const k = e.kode;
    if (k==="P"||k==="M"||k==="SM"||k==="IN") masuk++;
    if (k==="OFF") libur++;
    if (k==="IJ")  ijin++;
    if (k==="SKT") sakit++;
    if (k==="C")   cuti++;
    if (k==="L"||k==="LL"||k==="PL"||k==="LS") lembur++;
    if (k==="ITS") its++;
  });
  const hariKerja  = Math.max(entries.length - libur, 1);
  const kpiAbsensi = entries.length > 0 ? safePct(masuk, hariKerja) : 0;
  return { masuk, libur, ijin, sakit, cuti, lembur, its, kpiAbsensi };
}

const W = {
  wrap:   { display:"flex", flexDirection:"column", gap:16 },
  card:   { background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", padding:"14px 16px", position:"relative", overflow:"hidden" },
  widget: { background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", overflow:"hidden" },
  whead:  { padding:"12px 16px 10px", borderBottom:"1px solid #f3f4f6", display:"flex", alignItems:"center", justifyContent:"space-between" },
  wtitle: { fontSize:13, fontWeight:700, color:"#111827" },
  kpiBar: { height:6, background:"#f3f4f6", borderRadius:3, overflow:"hidden", marginTop:4 },
  empty:  { display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"48px 16px", color:"#9ca3af", textAlign:"center", gap:8 },
  select: { padding:"6px 10px", borderRadius:8, border:"1.5px solid #e5e7eb", fontSize:12, color:"#374151", background:"#fff", outline:"none", fontFamily:"inherit", cursor:"pointer" },
};

function Btn(props) {
  const bg    = props.primary ? "linear-gradient(135deg,#f97316,#ea580c)" : "#f3f4f6";
  const color = props.primary ? "#fff" : "#4b5563";
  return (
    <button onClick={props.onClick} style={{display:"flex",alignItems:"center",gap:5,padding:"7px 14px",borderRadius:8,fontSize:12,fontWeight:600,border:"none",cursor:"pointer",background:bg,color:color}}>
      {props.children}
    </button>
  );
}

function KpiBar(props) {
  const col = kpiColor(props.pct);
  return (
    <div style={W.kpiBar}>
      <div style={{height:"100%", width:props.pct+"%", borderRadius:3, background:col, transition:"width .4s"}} />
    </div>
  );
}

function MiniBar(props) {
  const barH  = Math.max(4, safeDiv(props.pct * 80, props.maxVal));
  const col   = kpiColor(props.pct);
  return (
    <div style={{flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4}}>
      <div style={{fontSize:9, color:"#374151", fontWeight:600}}>{props.pct}%</div>
      <div style={{width:"100%", borderRadius:"4px 4px 0 0", height:barH, background:col, transition:"height .4s"}} />
      <div style={{fontSize:9, color:"#9ca3af", fontWeight:600}}>{props.label}</div>
    </div>
  );
}

function KalenderAbsensi(props) {
  const { karyawanId, absensiData, bulan, tahun, onInputKode, isReadOnly } = props;
  const daysInMonth = new Date(tahun, bulan, 0).getDate();
  const firstDay    = new Date(tahun, bulan-1, 1).getDay();
  const tStr        = todayISO();

  function getKode(day) {
    const tgl  = tahun + "-" + padD(bulan) + "-" + padD(day);
    const found = absensiData.find(function(a) { return a.karyawanId===karyawanId && a.tanggal===tgl; });
    return found ? found.kode : null;
  }

  const cells = [];
  for (let i=0; i<firstDay; i++) cells.push(null);
  for (let d=1; d<=daysInMonth; d++) cells.push(d);

  return (
    <div>
      <div style={{display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2, padding:"10px 12px 0"}}>
        {HARI_NAMES.map(function(h) {
          return <div key={h} style={{textAlign:"center", fontSize:10, fontWeight:700, color:"#9ca3af", padding:"4px 0"}}>{h}</div>;
        })}
      </div>
      <div style={{display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2, padding:"4px 12px 12px"}}>
        {cells.map(function(day, idx) {
          if (!day) return <div key={"e"+idx} />;
          const tgl    = tahun + "-" + padD(bulan) + "-" + padD(day);
          const kode   = getKode(day);
          const conf   = kode ? KODE_MAP[kode] : null;
          const isToday = tgl === tStr;
          const bgC    = conf ? conf.bg + "22" : "#f9fafb";
          const bdC    = conf ? conf.bg + "44" : "#f3f4f6";
          return (
            <div
              key={day}
              style={{minHeight:42, borderRadius:7, padding:4, cursor:isReadOnly?"default":"pointer", background:bgC, border:"1px solid "+bdC, outline:isToday?"2px solid #f97316":"none"}}
              onClick={function() { if (!isReadOnly && onInputKode) onInputKode(tgl); }}
            >
              <div style={{fontSize:10, color:"#374151", fontWeight:isToday?700:400, marginBottom:2}}>{day}</div>
              {conf && (
                <div style={{display:"inline-flex", alignItems:"center", padding:"1px 4px", borderRadius:4, fontSize:9, fontWeight:700, background:conf.bg, color:"#fff"}}>
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

function ModalInputKode(props) {
  const { tanggal, karyawanId, absensiList, onClose, onSave } = props;
  const found    = absensiList.find(function(a) { return a.karyawanId===karyawanId && a.tanggal===tanggal; });
  const existing = found ? found.kode : null;
  return (
    <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,.5)", zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:16}} onClick={onClose}>
      <div style={{background:"#fff", borderRadius:16, padding:20, width:400, maxHeight:"80vh", overflowY:"auto"}} onClick={function(e) { e.stopPropagation(); }}>
        <div style={{fontSize:14, fontWeight:700, color:"#111827", marginBottom:4}}>Input Kode Absensi</div>
        <div style={{fontSize:11, color:"#9ca3af", marginBottom:16}}>Tanggal: {tanggal}</div>
        <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8}}>
          {KODE_LIST.map(function(item) {
            const isAct = existing === item.kode;
            return (
              <div
                key={item.kode}
                onClick={function() { onSave(tanggal, karyawanId, item.kode); onClose(); }}
                style={{padding:"9px 8px", borderRadius:9, cursor:"pointer", textAlign:"center", background:isAct?item.bg:item.bg+"22", border:"1.5px solid "+(isAct?item.bg:item.bg+"55")}}
              >
                <div style={{fontSize:13, fontWeight:700, color:isAct?"#fff":item.bg}}>{item.short}</div>
                <div style={{fontSize:9, color:isAct?"rgba(255,255,255,.8)":item.bg, marginTop:2, lineHeight:1.2}}>{item.label}</div>
              </div>
            );
          })}
        </div>
        <button style={{marginTop:14, width:"100%", padding:"9px", borderRadius:9, background:"#f3f4f6", border:"none", fontSize:12, fontWeight:600, color:"#6b7280", cursor:"pointer"}} onClick={onClose}>
          Tutup
        </button>
      </div>
    </div>
  );
}

export default function Modul16_LaporanAbsensi({ user, globalData={} }) {
  const {
    karyawanList   = [],
    absensiList    = [], setAbsensiList = function(){},
    isReadOnly     = false,
  } = globalData;

  const years = [thisYear-1, thisYear, thisYear+1];
  const [periode,   setPeriode]   = useState({ tahun:thisYear, bulan:thisMonth });
  const [activeTab, setActiveTab] = useState("rekap");
  const [selectedK, setSelectedK] = useState(null);
  const [showInput, setShowInput] = useState(null);
  const [filterK,   setFilterK]   = useState("all");

  function setPV(k, v) { setPeriode(function(p) { return Object.assign({}, p, {[k]:v}); }); }

  const aktif = karyawanList.filter(function(k) { return k.aktif; });
  const currentK = selectedK || aktif[0] || null;

  function handleInputKode(tgl, karyawanId, kode) {
    setAbsensiList(function(prev) {
      const idx = prev.findIndex(function(a) { return a.karyawanId===karyawanId && a.tanggal===tgl; });
      if (idx >= 0) {
        const upd = prev.slice();
        upd[idx] = Object.assign({}, upd[idx], {kode:kode});
        return upd;
      }
      return prev.concat([{id:Date.now(), karyawanId:karyawanId, tanggal:tgl, kode:kode}]);
    });
  }

  const stats = useMemo(function() {
    let totalMasuk=0, totalITS=0, totalLembur=0, sumKPI=0;
    aktif.forEach(function(k) {
      const r = hitungRekap(absensiList, k.id, periode.bulan, periode.tahun);
      totalMasuk  += r.masuk;
      totalITS    += r.its;
      totalLembur += r.lembur;
      sumKPI      += r.kpiAbsensi;
    });
    const avgKPI = aktif.length > 0 ? safeDiv(sumKPI, aktif.length) : 0;
    return { totalMasuk, totalITS, totalLembur, avgKPI };
  }, [absensiList, karyawanList, periode]);

  const trendData = useMemo(function() {
    const result = [];
    for (let i=0; i<6; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - 5 + i);
      const b = d.getMonth() + 1;
      const t = d.getFullYear();
      let totalM=0, totalAll=0;
      aktif.forEach(function(k) {
        const r = hitungRekap(absensiList, k.id, b, t);
        totalM   += r.masuk;
        totalAll += r.masuk + r.libur + r.ijin + r.sakit + r.its;
      });
      result.push({ label:BULAN_SHORT[d.getMonth()], pct: totalAll > 0 ? safePct(totalM, totalAll) : 0 });
    }
    return result;
  }, [absensiList, karyawanList]);

  const maxTrend = Math.max.apply(null, trendData.map(function(t) { return t.pct; }).concat([1]));

  const CARDS = [
    { label:"Total Masuk",    val:String(stats.totalMasuk),  color:"#16a34a", sub:BULAN_FULL[periode.bulan-1]+" "+periode.tahun },
    { label:"KPI Rata-rata",  val:stats.avgKPI+"%",          color:"#f97316", sub:"Kehadiran periode ini" },
    { label:"Ijin Tidak Sah", val:String(stats.totalITS),    color:"#ef4444", sub:"Potongan aktif" },
    { label:"Lembur",         val:String(stats.totalLembur), color:"#3b82f6", sub:"Shift lembur" },
  ];

  return (
    <div style={W.wrap}>

      <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12}}>
        {CARDS.map(function(c, i) {
          return (
            <div key={i} style={W.card}>
              <div style={{position:"absolute", top:0, left:0, right:0, height:3, background:c.color}} />
              <div style={{fontSize:10, fontWeight:500, color:"#9ca3af", textTransform:"uppercase", letterSpacing:.8, marginBottom:4, marginTop:8}}>{c.label}</div>
              <div style={{fontSize:22, fontWeight:700, color:c.color}}>{c.val}</div>
              <div style={{fontSize:11, color:"#6b7280", marginTop:3}}>{c.sub}</div>
            </div>
          );
        })}
      </div>

      <div style={{background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", padding:"12px 16px", display:"flex", alignItems:"center", gap:12, flexWrap:"wrap"}}>
        <span style={{fontSize:12, fontWeight:600, color:"#374151"}}>Periode:</span>
        <select style={W.select} value={periode.tahun} onChange={function(e) { setPV("tahun", parseInt(e.target.value)); }}>
          {years.map(function(y) { return <option key={y} value={y}>{y}</option>; })}
        </select>
        <select style={W.select} value={periode.bulan} onChange={function(e) { setPV("bulan", parseInt(e.target.value)); }}>
          {BULAN_FULL.map(function(b, i) { return <option key={i} value={i+1}>{b}</option>; })}
        </select>
        <select style={W.select} value={filterK} onChange={function(e) { setFilterK(e.target.value); }}>
          <option value="all">Semua Karyawan</option>
          {aktif.map(function(k) { return <option key={k.id} value={k.id}>{k.nama}</option>; })}
        </select>
        <Btn onClick={function() { alert("Export CSV coming soon"); }}>Export</Btn>
        <Btn primary onClick={function() { alert("Download PDF coming soon"); }}>PDF</Btn>
      </div>

      <div style={{display:"flex", gap:4, background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", padding:5}}>
        {[{id:"rekap",label:"Rekap Bulanan"},{id:"kalender",label:"Kalender Absensi"},{id:"kpi",label:"KPI & Performa"}].map(function(t) {
          const isAct = activeTab === t.id;
          return (
            <div key={t.id}
              style={{flex:1, padding:"8px 12px", borderRadius:8, textAlign:"center", fontSize:12, fontWeight:600, cursor:"pointer", color:isAct?"#fff":"#9ca3af", background:isAct?"linear-gradient(135deg,#f97316,#ea580c)":"transparent"}}
              onClick={function() { setActiveTab(t.id); }}
            >
              {t.label}
            </div>
          );
        })}
      </div>

      {activeTab === "rekap" && (
        <div style={W.widget}>
          <div style={W.whead}>
            <div style={W.wtitle}>Rekap Absensi — {BULAN_FULL[periode.bulan-1]} {periode.tahun}</div>
          </div>
          {aktif.length === 0 ? (
            <div style={W.empty}>
              <div style={{fontSize:32, opacity:.4}}>👥</div>
              <div>Belum ada karyawan aktif</div>
            </div>
          ) : (
            <table style={{width:"100%", borderCollapse:"collapse"}}>
              <thead>
                <tr style={{background:"#f9fafb"}}>
                  {["Karyawan","Masuk","Libur","Cuti","Ijin","Sakit","Lembur","ITS","KPI"].map(function(h) {
                    return <th key={h} style={{padding:"9px 14px", fontSize:10, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", textAlign:"left", whiteSpace:"nowrap"}}>{h}</th>;
                  })}
                </tr>
              </thead>
              <tbody>
                {aktif.filter(function(k) { return filterK==="all" || String(k.id)===String(filterK); }).map(function(k) {
                  const r   = hitungRekap(absensiList, k.id, periode.bulan, periode.tahun);
                  const col = kpiColor(r.kpiAbsensi);
                  const td  = {padding:"10px 14px", fontSize:12, color:"#374151", borderBottom:"1px solid #f9fafb"};
                  return (
                    <tr key={k.id}>
                      <td style={td}>
                        <div style={{display:"flex", alignItems:"center", gap:9}}>
                          <div style={{width:30, height:30, borderRadius:8, background:getColor(k.id), display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"#fff", flexShrink:0}}>
                            {getInisial(k.nama)}
                          </div>
                          <div>
                            <div style={{fontSize:12, fontWeight:600, color:"#1f2937"}}>{k.nama}</div>
                            <div style={{fontSize:10, color:"#9ca3af"}}>{k.jabatan}</div>
                          </div>
                        </div>
                      </td>
                      <td style={Object.assign({}, td, {textAlign:"center", fontWeight:700, color:"#16a34a"})}>{r.masuk}</td>
                      <td style={Object.assign({}, td, {textAlign:"center", color:"#9ca3af"})}>{r.libur}</td>
                      <td style={Object.assign({}, td, {textAlign:"center", color:"#22c55e"})}>{r.cuti}</td>
                      <td style={Object.assign({}, td, {textAlign:"center", color:"#06b6d4"})}>{r.ijin}</td>
                      <td style={Object.assign({}, td, {textAlign:"center", color:"#ec4899"})}>{r.sakit}</td>
                      <td style={Object.assign({}, td, {textAlign:"center", color:"#f97316", fontWeight:600})}>{r.lembur}</td>
                      <td style={Object.assign({}, td, {textAlign:"center", fontWeight:r.its>0?700:400, color:r.its>0?"#ef4444":"#9ca3af"})}>{r.its}</td>
                      <td style={Object.assign({}, td, {minWidth:120})}>
                        <div style={{display:"flex", alignItems:"center", gap:8}}>
                          <KpiBar pct={r.kpiAbsensi} />
                          <span style={{fontSize:11, fontWeight:700, color:col, minWidth:32}}>{r.kpiAbsensi}%</span>
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

      {activeTab === "kalender" && (
        <div style={{display:"grid", gridTemplateColumns:aktif.length>1?"200px 1fr":"1fr", gap:14}}>
          {aktif.length > 1 && (
            <div style={W.widget}>
              <div style={W.whead}><div style={W.wtitle}>Pilih Karyawan</div></div>
              {aktif.map(function(k) {
                const isAct = currentK && currentK.id === k.id;
                return (
                  <div key={k.id} onClick={function() { setSelectedK(k); }}
                    style={{display:"flex", alignItems:"center", gap:9, padding:"9px 12px", cursor:"pointer", borderBottom:"1px solid #f3f4f6", background:isAct?"#fff7ed":"#fff", borderLeft:isAct?"3px solid #f97316":"3px solid transparent"}}
                  >
                    <div style={{width:28, height:28, borderRadius:7, background:getColor(k.id), display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"#fff"}}>{getInisial(k.nama)}</div>
                    <div>
                      <div style={{fontSize:12, fontWeight:600, color:"#1f2937"}}>{k.nama}</div>
                      <div style={{fontSize:10, color:"#9ca3af"}}>{k.jabatan}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div style={W.widget}>
            {currentK ? (
              <div>
                <div style={W.whead}>
                  <div style={W.wtitle}>{currentK.nama} — {BULAN_FULL[periode.bulan-1]} {periode.tahun}</div>
                  {!isReadOnly && <span style={{fontSize:11, color:"#9ca3af"}}>Klik tanggal untuk input</span>}
                </div>
                <div style={{padding:"8px 12px", display:"flex", gap:6, flexWrap:"wrap", borderBottom:"1px solid #f3f4f6"}}>
                  {KODE_LIST.map(function(item) {
                    return (
                      <div key={item.kode} style={{display:"flex", alignItems:"center", gap:3}}>
                        <div style={{width:18, height:18, borderRadius:4, background:item.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, fontWeight:700, color:"#fff"}}>{item.short}</div>
                        <span style={{fontSize:9, color:"#6b7280"}}>{item.label}</span>
                      </div>
                    );
                  })}
                </div>
                <KalenderAbsensi
                  karyawanId={currentK.id}
                  absensiData={absensiList}
                  bulan={periode.bulan}
                  tahun={periode.tahun}
                  onInputKode={function(tgl) { setShowInput({tgl:tgl, karyawanId:currentK.id}); }}
                  isReadOnly={isReadOnly}
                />
              </div>
            ) : (
              <div style={W.empty}><div>Pilih karyawan di kiri</div></div>
            )}
          </div>
        </div>
      )}

      {activeTab === "kpi" && (
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:14}}>
          <div style={W.widget}>
            <div style={W.whead}>
              <div style={W.wtitle}>KPI Absensi per Karyawan</div>
              <span style={{fontSize:11, color:"#9ca3af"}}>Threshold: 90%</span>
            </div>
            {aktif.length === 0 ? (
              <div style={W.empty}><div>Belum ada karyawan</div></div>
            ) : aktif.map(function(k) {
              const r    = hitungRekap(absensiList, k.id, periode.bulan, periode.tahun);
              const col  = kpiColor(r.kpiAbsensi);
              const lulus = r.kpiAbsensi >= 90;
              const bdgColor = lulus ? "#16a34a" : "#dc2626";
              const bdgBg    = lulus ? "#dcfce7" : "#fee2e2";
              return (
                <div key={k.id} style={{padding:"12px 14px", borderBottom:"1px solid #f9fafb"}}>
                  <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6}}>
                    <div style={{display:"flex", alignItems:"center", gap:8}}>
                      <div style={{width:28, height:28, borderRadius:7, background:getColor(k.id), display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"#fff"}}>
                        {getInisial(k.nama)}
                      </div>
                      <div>
                        <div style={{fontSize:12, fontWeight:600, color:"#1f2937"}}>{k.nama}</div>
                        <div style={{fontSize:10, color:"#9ca3af"}}>{r.masuk} masuk</div>
                      </div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:16, fontWeight:800, color:col}}>{r.kpiAbsensi}%</div>
                      <span style={{display:"inline-flex", alignItems:"center", padding:"2px 8px", borderRadius:20, fontSize:10, fontWeight:600, color:bdgColor, background:bdgBg}}>
                        {lulus ? "Insentif" : "Tidak"}
                      </span>
                    </div>
                  </div>
                  <KpiBar pct={r.kpiAbsensi} />
                </div>
              );
            })}
          </div>

          <div style={W.widget}>
            <div style={W.whead}>
              <div style={W.wtitle}>Trend Kehadiran 6 Bulan</div>
            </div>
            <div style={{padding:"16px 16px 8px"}}>
              <div style={{display:"flex", alignItems:"flex-end", gap:8, height:100}}>
                {trendData.map(function(t, i) {
                  return <MiniBar key={i} pct={t.pct} maxVal={maxTrend} label={t.label} />;
                })}
              </div>
            </div>
            <div style={{padding:"10px 14px", borderTop:"1px solid #f3f4f6"}}>
              <div style={{fontSize:10, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:.8, marginBottom:8}}>Legenda</div>
              <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:4}}>
                {KODE_LIST.map(function(item) {
                  return (
                    <div key={item.kode} style={{display:"flex", alignItems:"center", gap:5, padding:"3px 0"}}>
                      <div style={{width:20, height:20, borderRadius:5, background:item.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, fontWeight:700, color:"#fff", flexShrink:0}}>{item.short}</div>
                      <span style={{fontSize:10, color:"#6b7280"}}>{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {showInput && !isReadOnly && (
        <ModalInputKode
          tanggal={showInput.tgl}
          karyawanId={showInput.karyawanId}
          absensiList={absensiList}
          onClose={function() { setShowInput(null); }}
          onSave={handleInputKode}
        />
      )}

    </div>
  );
}
