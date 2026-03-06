import { useState, useEffect, useMemo } from "react";

// ============================================================
// CSS
// ============================================================



// ============================================================
// HELPERS
// ============================================================
const padD    = (n) => String(n).padStart(2,"0");
const fmtRp   = (n) => n!=null ? "Rp "+Math.abs(Number(n)).toLocaleString("id-ID") : "—";
const fmtPct  = (n) => n!=null ? Number(n).toFixed(1)+"%" : "—";
const todayStr= (()=>{ const d=new Date(); return `${d.getFullYear()}-${padD(d.getMonth()+1)}-${padD(d.getDate())}`; })();
const thisYear = new Date().getFullYear();

const BULAN_NAMES = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
const BULAN_FULL  = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

// Generate daftar bulan untuk filter
const getBulanList = (year) => Array.from({length:12},(_,i)=>{
  const m = padD(i+1);
  return { value:`${year}-${m}`, label:`${BULAN_FULL[i]} ${year}` };
});

// Hitung data keuangan dari transaksi untuk periode tertentu
const hitungKeuangan = (kasJurnal, asetList, penyewaList, karyawanList, periode) => {
  const { dari, sampai } = periode;

  const txInRange = kasJurnal.filter(t => {
    if (!t.tanggal) return false;
    return t.tanggal >= dari && t.tanggal <= sampai;
  });

  // Pendapatan
  const pendapatanSewa   = txInRange.filter(t=>t.tipe==="pemasukan"&&t.kategori==="Sewa Kamar").reduce((s,t)=>s+t.nominal,0);
  const pendapatanLain   = txInRange.filter(t=>t.tipe==="pemasukan"&&t.kategori!=="Sewa Kamar").reduce((s,t)=>s+t.nominal,0);
  const totalPendapatan  = pendapatanSewa + pendapatanLain;

  // Beban operasional
  const beban = {};
  ["Management Fee","Gaji & Insentif","Peralatan","Listrik/Internet/Air","Maintenance","Akomodasi/Op","Perlengkapan","THR","Lain-lain"].forEach(k=>{
    beban[k] = txInRange.filter(t=>t.tipe==="pengeluaran"&&t.kategori===k).reduce((s,t)=>s+t.nominal,0);
  });
  const totalBeban = Object.values(beban).reduce((s,v)=>s+v,0);

  // Depresiasi (per bulan × jumlah bulan)
  const jumlahBulan = (() => {
    const d1=new Date(dari), d2=new Date(sampai);
    return Math.max(1, (d2.getFullYear()-d1.getFullYear())*12 + d2.getMonth()-d1.getMonth()+1);
  })();
  const totalDepresiasi = asetList.filter(a=>!a.tidakDep).reduce((s,a)=>s+(a.depPerBulan*jumlahBulan),0);

  const labaKotor = totalPendapatan - totalBeban;
  const labaBersih = labaKotor - totalDepresiasi;

  // Management fee (22%)
  const mgmtFee = Math.round(totalPendapatan * 0.22);

  // Arus kas
  const kasIn  = txInRange.filter(t=>t.tipe==="pemasukan").reduce((s,t)=>s+t.nominal,0);
  const kasOut = txInRange.filter(t=>t.tipe==="pengeluaran").reduce((s,t)=>s+t.nominal,0);
  const netKas = kasIn - kasOut;

  // Aset tetap
  const nilaiTanah     = asetList.filter(a=>a.tidakDep).reduce((s,a)=>s+a.nilaiPerolehan,0);
  const nilaiAsetLain  = asetList.filter(a=>!a.tidakDep).reduce((s,a)=>s+a.nilaiPerolehan,0);
  const akumDepresiasi = asetList.filter(a=>!a.tidakDep).reduce((s,a)=>{
    const bln = Math.floor((new Date()-new Date(a.tanggalBeli))/(1000*60*60*24*30));
    return s + Math.min(a.depPerBulan*bln, a.nilaiPerolehan);
  },0);
  const nilaiBukuAset  = nilaiAsetLain - akumDepresiasi;

  // Rasio keuangan
  const npm  = totalPendapatan>0 ? (labaBersih/totalPendapatan)*100 : 0;
  const roa  = (nilaiTanah+nilaiBukuAset)>0 ? (labaBersih/(nilaiTanah+nilaiBukuAset))*100 : 0;
  const roe  = totalPendapatan>0 ? (labaBersih/totalPendapatan)*100 : 0; // simplified

  return {
    pendapatanSewa, pendapatanLain, totalPendapatan,
    beban, totalBeban, totalDepresiasi,
    labaKotor, labaBersih, mgmtFee,
    kasIn, kasOut, netKas,
    nilaiTanah, nilaiAsetLain, akumDepresiasi, nilaiBukuAset,
    npm, roa, roe, jumlahBulan,
    txCount: txInRange.length,
  };
};

// ============================================================
// PERIOD SELECTOR
// ============================================================
function PeriodSelector({ periodeTipe, setPeriodeTipe, periodeVal, setPeriodeVal }) {
  const years = [thisYear-1, thisYear, thisYear+1];

  const getPeriodeLabel = () => {
    if (periodeTipe==="bulan")    return `${BULAN_FULL[parseInt(periodeVal.bulan)-1]} ${periodeVal.tahun}`;
    if (periodeTipe==="semester") return `Semester ${periodeVal.semester} ${periodeVal.tahun}`;
    if (periodeTipe==="tahun")    return `Tahun ${periodeVal.tahun}`;
    if (periodeTipe==="custom")   return `${periodeVal.dari} — ${periodeVal.sampai}`;
    return "—";
  };

  const getDariSampai = () => {
    const { tahun, bulan, semester, dari, sampai } = periodeVal;
    if (periodeTipe==="bulan") {
      const m = padD(bulan);
      const lastDay = new Date(tahun, bulan, 0).getDate();
      return { dari:`${tahun}-${m}-01`, sampai:`${tahun}-${m}-${lastDay}` };
    }
    if (periodeTipe==="semester") {
      const [m1,m2] = semester===1 ? [1,6] : [7,12];
      return { dari:`${tahun}-${padD(m1)}-01`, sampai:`${tahun}-${padD(m2)}-${new Date(tahun,m2,0).getDate()}` };
    }
    if (periodeTipe==="tahun") {
      return { dari:`${tahun}-01-01`, sampai:`${tahun}-12-31` };
    }
    return { dari, sampai };
  };

  return { label: getPeriodeLabel(), range: getDariSampai() };
}

// ============================================================
// LAPORAN LABA RUGI
// ============================================================
function LabaRugi({ data, label }) {
  if (!data) return <div className="lk-empty"><div className="lk-empty-icon">📊</div></div>;
  const { pendapatanSewa,pendapatanLain,totalPendapatan,beban,totalBeban,totalDepresiasi,labaKotor,labaBersih,mgmtFee } = data;

  const rows = [
    { type:"section", label:"PENDAPATAN" },
    { type:"indent",  label:"Sewa Kamar", val:pendapatanSewa, positive:true },
    { type:"indent",  label:"Pendapatan Lain-lain", val:pendapatanLain, positive:true },
    { type:"subtotal",label:"Total Pendapatan", val:totalPendapatan },
    { type:"section", label:"BEBAN OPERASIONAL" },
    ...Object.entries(beban).filter(([,v])=>v>0).map(([k,v])=>({ type:"indent", label:k, val:v, negative:true })),
    { type:"subtotal",label:"Total Beban Operasional", val:totalBeban, negative:true },
    { type:"section", label:"DEPRESIASI" },
    { type:"indent",  label:"Depresiasi Aset Tetap", val:totalDepresiasi, negative:true },
    { type:"total",   label:"LABA BERSIH", val:labaBersih, highlight:true },
    { type:"section", label:"DISTRIBUSI" },
    { type:"indent",  label:"Management Fee (22%)", val:mgmtFee, negative:true },
    { type:"indent",  label:"Sisa untuk Owner/Reinvestasi", val:Math.max(0,labaBersih-mgmtFee), positive:true },
  ];

  return (
    <table className="lk-table">
      <thead><tr><th>Keterangan</th><th className="right">Nominal</th></tr></thead>
      <tbody>
        {rows.map((r,i)=>(
          <tr key={i} className={r.type==="section"?"section-header":r.type==="subtotal"?"subtotal":r.type==="total"?"total":r.type==="indent"?(r.positive?"indent positive":r.negative?"indent negative":"indent"):"" }>
            <td>{r.label}</td>
            {r.type!=="section" && (
              <td className="right">
                {r.negative&&r.val>0 ? `(${fmtRp(r.val)})` : fmtRp(r.val)}
              </td>
            )}
            {r.type==="section" && <td></td>}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ============================================================
// ARUS KAS
// ============================================================
function ArusKas({ data, kasJurnal, periode }) {
  if (!data) return <div className="lk-empty"><div className="lk-empty-icon">💧</div></div>;
  const { kasIn, kasOut, netKas } = data;
  const { dari, sampai } = periode;

  const txInRange = kasJurnal.filter(t=>t.tanggal>=dari&&t.tanggal<=sampai);

  // Kelompokkan pemasukan
  const pemasukanByKat = {};
  txInRange.filter(t=>t.tipe==="pemasukan").forEach(t=>{
    pemasukanByKat[t.kategori] = (pemasukanByKat[t.kategori]||0)+t.nominal;
  });
  const pengeluaranByKat = {};
  txInRange.filter(t=>t.tipe==="pengeluaran").forEach(t=>{
    pengeluaranByKat[t.kategori] = (pengeluaranByKat[t.kategori]||0)+t.nominal;
  });

  return (
    <table className="lk-table">
      <thead><tr><th>Keterangan</th><th className="right">Nominal</th></tr></thead>
      <tbody>
        <tr className="section-header"><td>ARUS KAS MASUK (Operasional)</td><td></td></tr>
        {Object.entries(pemasukanByKat).map(([k,v])=>(
          <tr key={k} className="indent positive"><td>{k}</td><td className="right">{fmtRp(v)}</td></tr>
        ))}
        {Object.keys(pemasukanByKat).length===0 && <tr className="indent"><td style={{color:"#9ca3af",fontStyle:"italic"}}>Belum ada pemasukan</td><td></td></tr>}
        <tr className="subtotal"><td>Total Kas Masuk</td><td className="right">{fmtRp(kasIn)}</td></tr>

        <tr className="section-header"><td>ARUS KAS KELUAR (Operasional)</td><td></td></tr>
        {Object.entries(pengeluaranByKat).map(([k,v])=>(
          <tr key={k} className="indent negative"><td>{k}</td><td className="right">({fmtRp(v)})</td></tr>
        ))}
        {Object.keys(pengeluaranByKat).length===0 && <tr className="indent"><td style={{color:"#9ca3af",fontStyle:"italic"}}>Belum ada pengeluaran</td><td></td></tr>}
        <tr className="subtotal"><td>Total Kas Keluar</td><td className="right">({fmtRp(kasOut)})</td></tr>

        <tr className="total">
          <td>NET CASHFLOW</td>
          <td className="right" style={{color:netKas>=0?"#16a34a":"#dc2626"}}>{netKas>=0?fmtRp(netKas):`(${fmtRp(netKas)})`}</td>
        </tr>
      </tbody>
    </table>
  );
}

// ============================================================
// NERACA
// ============================================================
function Neraca({ data }) {
  if (!data) return <div className="lk-empty"><div className="lk-empty-icon">⚖️</div></div>;
  const { nilaiTanah, nilaiAsetLain, akumDepresiasi, nilaiBukuAset, totalPendapatan, labaBersih, mgmtFee } = data;

  const totalAset = nilaiTanah + nilaiBukuAset;
  const modal     = totalAset; // simplified — modal = aset (tanpa hutang untuk sekarang)

  return (
    <table className="lk-table">
      <thead><tr><th>Keterangan</th><th className="right">Nominal</th></tr></thead>
      <tbody>
        <tr className="section-header"><td>ASET</td><td></td></tr>
        <tr className="section-header"><td style={{paddingLeft:16}}>Aset Lancar</td><td></td></tr>
        <tr className="indent"><td>Kas & Setara Kas</td><td className="right">{fmtRp(data.kasIn-data.kasOut)}</td></tr>
        <tr className="indent"><td>Piutang Usaha</td><td className="right">{fmtRp(data.totalPendapatan - data.kasIn)}</td></tr>
        <tr className="subtotal"><td>Total Aset Lancar</td><td className="right">{fmtRp(Math.max(0,(data.kasIn-data.kasOut)+(data.totalPendapatan-data.kasIn)))}</td></tr>

        <tr className="section-header"><td style={{paddingLeft:16}}>Aset Tetap</td><td></td></tr>
        <tr className="indent"><td>Tanah</td><td className="right">{fmtRp(nilaiTanah)}</td></tr>
        <tr className="indent"><td>Bangunan & Peralatan</td><td className="right">{fmtRp(nilaiAsetLain)}</td></tr>
        <tr className="indent negative"><td>Akumulasi Depresiasi</td><td className="right">({fmtRp(akumDepresiasi)})</td></tr>
        <tr className="subtotal"><td>Total Aset Tetap (Nilai Buku)</td><td className="right">{fmtRp(nilaiTanah+nilaiBukuAset)}</td></tr>
        <tr className="total"><td>TOTAL ASET</td><td className="right">{fmtRp(totalAset)}</td></tr>

        <tr className="section-header"><td>MODAL & KEWAJIBAN</td><td></td></tr>
        <tr className="indent positive"><td>Modal Pemilik</td><td className="right">{fmtRp(totalAset - labaBersih)}</td></tr>
        <tr className="indent positive"><td>Laba Bersih Periode</td><td className="right">{fmtRp(labaBersih)}</td></tr>
        <tr className="indent negative"><td>Management Fee Terutang</td><td className="right">({fmtRp(mgmtFee)})</td></tr>
        <tr className="total"><td>TOTAL MODAL</td><td className="right">{fmtRp(totalAset)}</td></tr>
      </tbody>
    </table>
  );
}

// ============================================================
// PERUBAHAN MODAL
// ============================================================
function PerubahanModal({ data }) {
  if (!data) return <div className="lk-empty"><div className="lk-empty-icon">🔄</div></div>;
  const { totalPendapatan, labaBersih, mgmtFee } = data;
  const prive = Math.round(labaBersih * 0.1); // asumsi 10% — bisa diset di Pengaturan nanti

  return (
    <table className="lk-table">
      <thead><tr><th>Keterangan</th><th className="right">Nominal</th></tr></thead>
      <tbody>
        <tr className="section-header"><td>PERUBAHAN MODAL</td><td></td></tr>
        <tr className="indent"><td>Modal Awal Periode</td><td className="right">{fmtRp(0)}</td></tr>
        <tr className="indent positive"><td>Laba Bersih</td><td className="right">{fmtRp(labaBersih)}</td></tr>
        <tr className="indent negative"><td>Management Fee (22%)</td><td className="right">({fmtRp(mgmtFee)})</td></tr>
        <tr className="indent negative"><td>Prive / Dividen Owner</td><td className="right">({fmtRp(prive)})</td></tr>
        <tr className="subtotal"><td>Perubahan Bersih</td><td className="right" style={{color:labaBersih-mgmtFee-prive>=0?"#16a34a":"#dc2626"}}>{fmtRp(labaBersih-mgmtFee-prive)}</td></tr>
        <tr className="total"><td>MODAL AKHIR PERIODE</td><td className="right">{fmtRp(labaBersih-mgmtFee-prive)}</td></tr>
      </tbody>
    </table>
  );
}

// ============================================================
// PERFORMANCE RATIO
// ============================================================
function PerformanceRatio({ data, kasJurnal, asetList, periodeVal, periodeTipe }) {
  if (!data) return <div className="lk-empty"><div className="lk-empty-icon">📈</div></div>;
  const { npm, roa, totalPendapatan, labaBersih, totalBeban, kasIn, kasOut } = data;

  // Trend 6 bulan terakhir (untuk chart)
  const trend = useMemo(()=>{
    return Array.from({length:6},(_,i)=>{
      const d = new Date();
      d.setMonth(d.getMonth()-5+i);
      const y = d.getFullYear(), m = padD(d.getMonth()+1);
      const dari   = `${y}-${m}-01`;
      const sampai = `${y}-${m}-${new Date(y,d.getMonth()+1,0).getDate()}`;
      const tx = kasJurnal.filter(t=>t.tanggal>=dari&&t.tanggal<=sampai);
      const inc = tx.filter(t=>t.tipe==="pemasukan").reduce((s,t)=>s+t.nominal,0);
      const out = tx.filter(t=>t.tipe==="pengeluaran").reduce((s,t)=>s+t.nominal,0);
      return { label:`${BULAN_NAMES[d.getMonth()]}`, inc, out, net:inc-out };
    });
  },[kasJurnal]);

  const maxVal = Math.max(...trend.map(t=>Math.max(t.inc,t.out)), 1);

  const ratios = [
    { label:"Net Profit Margin", val:fmtPct(npm), raw:npm, good:">15%", icon:"📊", desc:"Laba bersih / pendapatan" },
    { label:"Tingkat Okupansi",  val:"—", raw:null, good:">80%", icon:"🏠", desc:"Dari Monitor Kamar" },
    { label:"Return on Asset",   val:fmtPct(roa), raw:roa, good:">5%", icon:"🏦", desc:"Laba bersih / total aset" },
    { label:"Cost Ratio",        val:totalPendapatan>0?fmtPct((totalBeban/totalPendapatan)*100):"—", raw:totalPendapatan>0?(totalBeban/totalPendapatan)*100:null, good:"<60%", icon:"📉", desc:"Total beban / pendapatan" },
    { label:"Cashflow Ratio",    val:kasIn>0?fmtPct((kasOut/kasIn)*100):"—", raw:kasIn>0?(kasOut/kasIn)*100:null, good:"<80%", icon:"💧", desc:"Kas keluar / kas masuk" },
    { label:"Mgmt Fee",          val:fmtPct(22), raw:22, good:"22%", icon:"💼", desc:"Fixed 22% dari pendapatan" },
  ];

  const getRatioClass = (r) => {
    if (r.raw===null) return "";
    if (r.label==="Net Profit Margin") return r.raw>15?"lk-ratio-good":r.raw>8?"lk-ratio-warn":"lk-ratio-bad";
    if (r.label==="Return on Asset")   return r.raw>5?"lk-ratio-good":r.raw>2?"lk-ratio-warn":"lk-ratio-bad";
    if (r.label==="Cost Ratio")        return r.raw<60?"lk-ratio-good":r.raw<80?"lk-ratio-warn":"lk-ratio-bad";
    if (r.label==="Cashflow Ratio")    return r.raw<80?"lk-ratio-good":r.raw<95?"lk-ratio-warn":"lk-ratio-bad";
    return "";
  };

  return (
    <div>
      {/* Ratio cards */}
      <div className="lk-ratio-grid">
        {ratios.map((r,i)=>(
          <div key={i} className="lk-ratio-card">
            <div style={{fontSize:20,marginBottom:4}}>{r.icon}</div>
            <div className={`lk-ratio-val ${getRatioClass(r)}`}>{r.val}</div>
            <div className="lk-ratio-label">{r.label}</div>
            <div className="lk-ratio-bench">Benchmark: {r.good}</div>
            <div style={{fontSize:10,color:"#9ca3af",marginTop:2}}>{r.desc}</div>
          </div>
        ))}
      </div>

      {/* Trend chart 6 bulan */}
      <div style={{padding:"0 16px 16px"}}>
        <div style={{fontSize:11,fontWeight:700,color:"#374151",marginBottom:10,paddingTop:8}}>📊 Trend 6 Bulan Terakhir</div>
        <div className="lk-chart">
          {trend.map((t,i)=>(
            <div key={i} className="lk-chart-col">
              <div className="lk-chart-val" style={{fontSize:8}}>{t.inc>0?`+${Math.round(t.inc/1000)}rb`:""}</div>
              <div className="lk-chart-bar-wrap">
                <div className="lk-chart-bar" style={{height:`${maxVal>0?(t.inc/maxVal)*100:0}%`,background:"#86efac"}} />
                <div className="lk-chart-bar" style={{height:`${maxVal>0?(t.out/maxVal)*100:0}%`,background:"#fca5a5"}} />
              </div>
              <div className="lk-chart-label">{t.label}</div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:16,padding:"4px 0",fontSize:10}}>
          <div style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:10,height:10,borderRadius:2,background:"#86efac"}}></div><span style={{color:"#6b7280"}}>Pemasukan</span></div>
          <div style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:10,height:10,borderRadius:2,background:"#fca5a5"}}></div><span style={{color:"#6b7280"}}>Pengeluaran</span></div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// DOWNLOAD CSV
// ============================================================
const downloadCSV = (data, kasJurnal, periode, reportType, label) => {
  let rows = [];
  const { dari, sampai } = periode;

  if (reportType==="laba-rugi") {
    rows = [
      ["LAPORAN LABA RUGI"],[`Periode: ${label}`],[""],
      ["Keterangan","Nominal"],
      ["Sewa Kamar", data.pendapatanSewa],
      ["Pendapatan Lain", data.pendapatanLain],
      ["Total Pendapatan", data.totalPendapatan],
      ["",""],
      ["Total Beban Operasional", `-${data.totalBeban}`],
      ["Depresiasi", `-${data.totalDepresiasi}`],
      ["Laba Bersih", data.labaBersih],
      ["",""],
      ["Management Fee (22%)", `-${data.mgmtFee}`],
    ];
  } else if (reportType==="arus-kas") {
    const tx = kasJurnal.filter(t=>t.tanggal>=dari&&t.tanggal<=sampai);
    rows = [
      ["LAPORAN ARUS KAS"],[`Periode: ${label}`],[""],
      ["Tanggal","Keterangan","Kategori","Kas Masuk","Kas Keluar"],
      ...tx.map(t=>[t.tanggal,t.keterangan,t.kategori,t.tipe==="pemasukan"?t.nominal:"",t.tipe==="pengeluaran"?t.nominal:""]),
      ["","","","",""],
      ["Total","","",data.kasIn,data.kasOut],
      ["Net Cashflow","","",data.netKas,""],
    ];
  }

  const csv = rows.map(r=>r.join(",")).join("\
");
  const blob = new Blob([csv],{type:"text/csv;charset=utf-8;"});
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href=url; a.download=`laporan-${reportType}-${dari}-${sampai}.csv`; a.click();
  URL.revokeObjectURL(url);
};

// ============================================================
// MAIN
// ============================================================
export default function Modul13_Laporan({ user, globalData = {} }) {
  const {
    kasJurnal    = [],
    asetList     = [],
    penyewaList  = [],
    karyawanList = [],
    tagihanList  = [],
  } = globalData;

  // ── Periode state
  const [periodeTipe, setPeriodeTipe] = useState("bulan");
  const [periodeVal,  setPeriodeVal]  = useState({
    tahun:    thisYear,
    bulan:    new Date().getMonth()+1,
    semester: new Date().getMonth()<6 ? 1 : 2,
    dari:     `${thisYear}-01-01`,
    sampai:   todayStr,
  });
  const [activeReport, setActiveReport] = useState("laba-rugi");

  const setPV = (k,v) => setPeriodeVal(p=>({...p,[k]:v}));

  // ── Hitung range periode
  const getPeriodeRange = () => {
    const { tahun, bulan, semester, dari, sampai } = periodeVal;
    if (periodeTipe==="bulan") {
      const m = padD(bulan);
      const lastDay = new Date(tahun, bulan, 0).getDate();
      return { dari:`${tahun}-${m}-01`, sampai:`${tahun}-${m}-${lastDay}` };
    }
    if (periodeTipe==="semester") {
      const [m1,m2] = semester===1 ? [1,6] : [7,12];
      return { dari:`${tahun}-${padD(m1)}-01`, sampai:`${tahun}-${padD(m2)}-${new Date(tahun,m2,0).getDate()}` };
    }
    if (periodeTipe==="tahun") {
      return { dari:`${tahun}-01-01`, sampai:`${tahun}-12-31` };
    }
    return { dari, sampai };
  };

  const getPeriodeLabel = () => {
    const { tahun, bulan, semester } = periodeVal;
    if (periodeTipe==="bulan")    return `${BULAN_FULL[bulan-1]} ${tahun}`;
    if (periodeTipe==="semester") return `Semester ${semester} ${tahun}`;
    if (periodeTipe==="tahun")    return `Tahun ${tahun}`;
    return `${periodeVal.dari} s/d ${periodeVal.sampai}`;
  };

  const periode  = getPeriodeRange();
  const label    = getPeriodeLabel();
  const data     = useMemo(()=>hitungKeuangan(kasJurnal,asetList,penyewaList,karyawanList,periode),[kasJurnal,asetList,periode]);

  const years = [thisYear-2, thisYear-1, thisYear, thisYear+1];

  return (
    <div className="lk-wrap">

      {/* Cards summary */}
      <div className="lk-cards">
        {[
          { label:"Total Pendapatan", val:fmtRp(data.totalPendapatan), color:"#16a34a", sub:label },
          { label:"Total Beban",      val:fmtRp(data.totalBeban),      color:"#dc2626", sub:`+dep ${fmtRp(data.totalDepresiasi)}` },
          { label:"Laba Bersih",      val:fmtRp(data.labaBersih),      color:data.labaBersih>=0?"#f97316":"#dc2626", sub:`NPM ${fmtPct(data.npm)}` },
          { label:"Net Cashflow",     val:fmtRp(data.netKas),          color:data.netKas>=0?"#3b82f6":"#dc2626", sub:`${data.txCount} transaksi` },
        ].map((c,i)=>(
          <div key={i} className="lk-card">
            <div className="lk-card-bar" style={{background:c.color}} />
            <div className="lk-card-label">{c.label}</div>
            <div className="lk-card-val">{c.val}</div>
            <div className="lk-card-sub">{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Period selector */}
      <div className="lk-period">
        <span className="lk-period-label">📅 Periode:</span>
        <div className="lk-period-tabs">
          {[
            {id:"bulan",    label:"Bulanan"},
            {id:"semester", label:"Semester"},
            {id:"tahun",    label:"Tahunan"},
            {id:"custom",   label:"Custom"},
          ].map(t=>(
            <div key={t.id} className={`lk-period-tab ${periodeTipe===t.id?"active":""}`} onClick={()=>setPeriodeTipe(t.id)}>
              {t.label}
            </div>
          ))}
        </div>

        <div className="lk-period-selects">
          {/* Tahun selalu ada */}
          {periodeTipe!=="custom" && (
            <select className="lk-select" value={periodeVal.tahun} onChange={e=>setPV("tahun",parseInt(e.target.value))}>
              {years.map(y=><option key={y} value={y}>{y}</option>)}
            </select>
          )}
          {/* Bulan */}
          {periodeTipe==="bulan" && (
            <select className="lk-select" value={periodeVal.bulan} onChange={e=>setPV("bulan",parseInt(e.target.value))}>
              {BULAN_FULL.map((b,i)=><option key={i} value={i+1}>{b}</option>)}
            </select>
          )}
          {/* Semester */}
          {periodeTipe==="semester" && (
            <select className="lk-select" value={periodeVal.semester} onChange={e=>setPV("semester",parseInt(e.target.value))}>
              <option value={1}>Semester 1 (Jan–Jun)</option>
              <option value={2}>Semester 2 (Jul–Des)</option>
            </select>
          )}
          {/* Custom */}
          {periodeTipe==="custom" && (
            <>
              <input type="date" className="lk-select" value={periodeVal.dari}   onChange={e=>setPV("dari",e.target.value)} />
              <span style={{fontSize:11,color:"#9ca3af"}}>—</span>
              <input type="date" className="lk-select" value={periodeVal.sampai} onChange={e=>setPV("sampai",e.target.value)} />
            </>
          )}
        </div>

        <div className="lk-period-info">
          {label} - {periode.dari} s/d {periode.sampai}
        </div>
      </div>

      {/* Report tabs */}
      <div className="lk-report-tabs">
        {[
          {id:"laba-rugi",  label:"📊 Laba Rugi"},
          {id:"arus-kas",   label:"💧 Arus Kas"},
          {id:"neraca",     label:"⚖️ Neraca"},
          {id:"modal",      label:"🔄 Perubahan Modal"},
          {id:"rasio",      label:"📈 Performance"},
        ].map(t=>(
          <div key={t.id} className={`lk-report-tab ${activeReport===t.id?"active":""}`} onClick={()=>setActiveReport(t.id)}>
            {t.label}
          </div>
        ))}
      </div>

      {/* Report widget */}
      <div className="lk-widget">
        <div className="lk-widget-head">
          <div>
            <div className="lk-widget-title">
              {activeReport==="laba-rugi" && "📊 Laporan Laba Rugi"}
              {activeReport==="arus-kas"  && "💧 Laporan Arus Kas"}
              {activeReport==="neraca"    && "⚖️ Neraca (Balance Sheet)"}
              {activeReport==="modal"     && "🔄 Laporan Perubahan Modal"}
              {activeReport==="rasio"     && "📈 Performance & Financial Ratio"}
            </div>
            <div className="lk-widget-sub">Periode: {label}</div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button className="lk-csv-btn" onClick={()=>downloadCSV(data,kasJurnal,periode,activeReport,label)}>
              ⬇️ Export CSV
            </button>
            <button className="lk-pdf-btn" onClick={()=>alert("PDF generation — coming soon!\
Integrasi jsPDF akan diimplementasikan bersama semua modul.")}>
              📄 Download PDF
            </button>
          </div>
        </div>

        <div className="lk-widget-body">
          {kasJurnal.length===0 ? (
            <div className="lk-empty">
              <div className="lk-empty-icon">📊</div>
              <div style={{fontSize:14,fontWeight:600,color:"#374151"}}>Belum ada data transaksi</div>
              <div style={{fontSize:12,color:"#9ca3af"}}>Tambahkan transaksi di Kas & Jurnal untuk melihat laporan keuangan</div>
            </div>
          ) : (
            <>
              {activeReport==="laba-rugi" && <LabaRugi data={data} label={label} />}
              {activeReport==="arus-kas"  && <ArusKas  data={data} kasJurnal={kasJurnal} periode={periode} />}
              {activeReport==="neraca"    && <Neraca   data={data} />}
              {activeReport==="modal"     && <PerubahanModal data={data} />}
              {activeReport==="rasio"     && <PerformanceRatio data={data} kasJurnal={kasJurnal} asetList={asetList} periodeVal={periodeVal} periodeTipe={periodeTipe} />}
            </>
          )}
        </div>
      </div>

    </div>
  );
}