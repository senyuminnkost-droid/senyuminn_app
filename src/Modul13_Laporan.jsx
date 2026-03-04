import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";

// ============================================================
// CSS
// ============================================================
const CSS = `
  .lk-wrap { display:flex; flex-direction:column; gap:16px; }

  /* Cards */
  .lk-cards { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
  .lk-card  { background:#fff; border-radius:12px; border:1px solid #e5e7eb; padding:14px 16px; position:relative; overflow:hidden; }
  .lk-card-bar { position:absolute; top:0; left:0; right:0; height:3px; }
  .lk-card-label { font-size:10px; font-weight:500; color:#9ca3af; text-transform:uppercase; letter-spacing:.8px; margin-bottom:4px; margin-top:8px; }
  .lk-card-val { font-size:17px; font-weight:700; color:#111827; font-family:'JetBrains Mono',monospace; }
  .lk-card-sub { font-size:11px; color:#6b7280; margin-top:3px; }

  /* Period selector */
  .lk-period { background:#fff; border-radius:12px; border:1px solid #e5e7eb; padding:14px 16px; display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
  .lk-period-label { font-size:12px; font-weight:600; color:#374151; white-space:nowrap; }
  .lk-period-tabs  { display:flex; gap:4px; }
  .lk-period-tab   { padding:6px 14px; border-radius:8px; font-size:12px; font-weight:600; cursor:pointer; border:1.5px solid #e5e7eb; color:#6b7280; background:#fff; transition:all .12s; white-space:nowrap; }
  .lk-period-tab.active { background:linear-gradient(135deg,#f97316,#ea580c); color:#fff; border-color:transparent; box-shadow:0 2px 8px rgba(249,115,22,.25); }
  .lk-period-selects { display:flex; gap:8px; align-items:center; }
  .lk-select { padding:6px 10px; border-radius:8px; border:1.5px solid #e5e7eb; font-size:12px; color:#374151; background:#fff; outline:none; font-family:inherit; cursor:pointer; }
  .lk-select:focus { border-color:#f97316; }
  .lk-period-info { margin-left:auto; font-size:11px; color:#9ca3af; font-style:italic; }

  /* Report tabs */
  .lk-report-tabs { display:flex; gap:0; background:#fff; border-radius:12px; border:1px solid #e5e7eb; overflow:hidden; }
  .lk-report-tab { flex:1; padding:10px 8px; font-size:11px; font-weight:600; color:#9ca3af; cursor:pointer; text-align:center; border-right:1px solid #f3f4f6; transition:all .12s; }
  .lk-report-tab:last-child { border-right:none; }
  .lk-report-tab:hover { background:#f9fafb; color:#374151; }
  .lk-report-tab.active { color:#ea580c; background:#fff7ed; }

  /* Widget */
  .lk-widget { background:#fff; border-radius:12px; border:1px solid #e5e7eb; overflow:hidden; }
  .lk-widget-head { padding:14px 18px 12px; border-bottom:1px solid #f3f4f6; display:flex; align-items:center; justify-content:space-between; }
  .lk-widget-title { font-size:13px; font-weight:700; color:#111827; }
  .lk-widget-sub   { font-size:11px; color:#9ca3af; margin-top:2px; }
  .lk-widget-body  { padding:0; }

  /* Report table */
  .lk-table { width:100%; border-collapse:collapse; }
  .lk-table th { padding:8px 16px; font-size:10px; font-weight:700; color:#9ca3af; text-transform:uppercase; letter-spacing:.8px; background:#f9fafb; text-align:left; }
  .lk-table th.right { text-align:right; }
  .lk-table td { padding:9px 16px; font-size:12px; color:#374151; border-bottom:1px solid #f9fafb; }
  .lk-table td.right { text-align:right; font-family:'JetBrains Mono',monospace; font-weight:600; }
  .lk-table tr:last-child td { border-bottom:none; }
  .lk-table tr.section-header td { background:#f9fafb; font-size:10px; font-weight:700; color:#9ca3af; text-transform:uppercase; letter-spacing:.8px; padding:7px 16px; }
  .lk-table tr.subtotal td { background:#fff7ed; font-weight:700; color:#ea580c; border-top:1px solid #fed7aa; }
  .lk-table tr.total td { background:linear-gradient(135deg,#fff7ed,#fff); font-weight:800; font-size:13px; color:#111827; border-top:2px solid #f97316; }
  .lk-table tr.total td.right { color:#f97316; }
  .lk-table tr.indent td:first-child { padding-left:32px; }
  .lk-table tr.positive td.right { color:#16a34a; }
  .lk-table tr.negative td.right { color:#dc2626; }

  /* Ratio cards */
  .lk-ratio-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; padding:16px; }
  .lk-ratio-card { background:#f9fafb; border-radius:10px; padding:14px; border:1px solid #e5e7eb; text-align:center; }
  .lk-ratio-val  { font-size:22px; font-weight:800; color:#111827; font-family:'JetBrains Mono',monospace; margin-bottom:4px; }
  .lk-ratio-label{ font-size:11px; font-weight:600; color:#6b7280; text-transform:uppercase; letter-spacing:.6px; }
  .lk-ratio-bench{ font-size:10px; color:#9ca3af; margin-top:3px; }
  .lk-ratio-good { color:#16a34a; }
  .lk-ratio-warn { color:#f97316; }
  .lk-ratio-bad  { color:#dc2626; }

  /* PDF btn */
  .lk-pdf-btn { display:flex; align-items:center; gap:6px; padding:7px 14px; border-radius:8px; border:none; background:linear-gradient(135deg,#f97316,#ea580c); color:#fff; font-size:12px; font-weight:600; cursor:pointer; font-family:inherit; box-shadow:0 2px 8px rgba(249,115,22,.25); transition:all .15s; }
  .lk-pdf-btn:hover { filter:brightness(1.05); transform:translateY(-1px); }
  .lk-csv-btn { display:flex; align-items:center; gap:6px; padding:7px 14px; border-radius:8px; border:1.5px solid #e5e7eb; background:#fff; color:#374151; font-size:12px; font-weight:600; cursor:pointer; font-family:inherit; transition:all .12s; }
  .lk-csv-btn:hover { border-color:#f97316; color:#ea580c; }

  /* Chart bar */
  .lk-chart { display:flex; align-items:flex-end; gap:8px; height:120px; padding:0 16px 8px; }
  .lk-chart-col { flex:1; display:flex; flex-direction:column; align-items:center; gap:4px; }
  .lk-chart-bar-wrap { flex:1; display:flex; align-items:flex-end; gap:3px; width:100%; }
  .lk-chart-bar { flex:1; border-radius:4px 4px 0 0; min-height:4px; transition:height .4s; }
  .lk-chart-label { font-size:9px; color:#9ca3af; font-weight:600; text-align:center; }
  .lk-chart-val   { font-size:9px; color:#374151; font-weight:700; text-align:center; }

  .lk-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:48px 16px; color:#9ca3af; text-align:center; gap:8px; }
  .lk-empty-icon { font-size:36px; opacity:.4; }

  @media(max-width:768px) { .lk-cards{grid-template-columns:repeat(2,1fr)} .lk-ratio-grid{grid-template-columns:repeat(2,1fr)} .lk-report-tabs{flex-wrap:wrap} }
  @media(max-width:480px) { .lk-cards{grid-template-columns:repeat(2,1fr);gap:8px} .lk-period{flex-direction:column;align-items:flex-start} }
`;

function StyleInjector() {
  useEffect(() => {
    const id = "senyuminn-laporan-css";
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
const hitungKeuangan = (kasJurnal, asetList, penyewaList, karyawanList, periode, depositList=[], sewaDimukaList=[], saldoAwal={}) => {
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
  // Kas operasional (exclude liabilitas — deposit masuk/keluar bukan pendapatan/beban)
  const kasIn  = txInRange.filter(t=>t.tipe==="pemasukan"  && !t.isLiabilitas).reduce((s,t)=>s+t.nominal,0);
  const kasOut = txInRange.filter(t=>t.tipe==="pengeluaran" && !t.isLiabilitas).reduce((s,t)=>s+t.nominal,0);
  const netKas = kasIn - kasOut;

  // Arus kas per aktivitas
  const arusOperating  = kasIn - kasOut; // pendapatan earned - beban operasional
  const arusInvesting  = -txInRange.filter(t=>t.tipe==="pengeluaran"&&t.kategori==="Peralatan").reduce((s,t)=>s+t.nominal,0);
  const arusFinancing  = txInRange.filter(t=>t.isLiabilitas).reduce((s,t)=>
    t.tipe==="pemasukan" ? s+t.nominal : s-t.nominal, 0
  ) - txInRange.filter(t=>t.kategori==="Prive/Dividen").reduce((s,t)=>s+t.nominal,0);

  // Pendapatan accrual (earned) — exclude sewa dimuka yang belum di-release bulan ini
  const pendapatanEarned = pendapatanSewa; // sudah benar karena release per bulan di Tagihan

  // Liabilitas
  const totalDepositAktif = depositList.filter(d=>d.status==="aktif").reduce((s,d)=>s+d.nominal,0);
  const totalSewaDimuka   = sewaDimukaList.filter(sd=>!sd.selesai).reduce((acc,sd)=>{
    const released = (sd.sudahRelease||[]).length * sd.perBulan;
    return acc + Math.max(0, sd.totalBayar - released);
  },0);
  const totalLiabilitas   = totalDepositAktif + totalSewaDimuka;

  // Piutang (tagihan belum lunas dari penyewaList)
  const piutangUsaha = penyewaList.reduce((s,p)=>s+(p.piutang||0),0);

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
    pendapatanSewa, pendapatanLain, totalPendapatan, pendapatanEarned,
    beban, totalBeban, totalDepresiasi,
    labaKotor, labaBersih, mgmtFee,
    kasIn, kasOut, netKas,
    arusOperating, arusInvesting, arusFinancing,
    nilaiTanah, nilaiAsetLain, akumDepresiasi, nilaiBukuAset,
    totalDepositAktif, totalSewaDimuka, totalLiabilitas, piutangUsaha,
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
  const { arusOperating, arusInvesting, arusFinancing, kasIn, kasOut, netKas } = data;
  const { dari, sampai } = periode;

  const txInRange = kasJurnal.filter(t=>t.tanggal>=dari&&t.tanggal<=sampai);

  // Operating: pendapatan & beban operasional (exclude liabilitas & investasi)
  const opIn  = txInRange.filter(t=>t.tipe==="pemasukan"  && !t.isLiabilitas && t.kategori!=="Peralatan");
  const opOut = txInRange.filter(t=>t.tipe==="pengeluaran" && !t.isLiabilitas && t.kategori!=="Peralatan" && t.kategori!=="Prive/Dividen");
  const totalOpIn  = opIn.reduce((s,t)=>s+t.nominal,0);
  const totalOpOut = opOut.reduce((s,t)=>s+t.nominal,0);
  const netOp      = totalOpIn - totalOpOut;

  // Investing: pembelian aset
  const invOut = txInRange.filter(t=>t.tipe==="pengeluaran" && t.kategori==="Peralatan");
  const netInv = -invOut.reduce((s,t)=>s+t.nominal,0);

  // Financing: deposit masuk/keluar + prive
  const finTx  = txInRange.filter(t=>t.isLiabilitas || t.kategori==="Prive/Dividen");
  const netFin = finTx.reduce((s,t)=>t.tipe==="pemasukan"?s+t.nominal:s-t.nominal,0);

  const netTotal = netOp + netInv + netFin;

  const Row = ({label, val, indent=false, bold=false, positive=false, negative=false}) => (
    <tr className={bold?"total":(positive?"indent positive":(negative?"indent negative":"indent"))}>
      <td style={indent?{paddingLeft:24}:{}}>{label}</td>
      <td className="right">{val<0?`(${fmtRp(Math.abs(val))})`:fmtRp(val)}</td>
    </tr>
  );

  return (
    <table className="lk-table">
      <thead><tr><th>Keterangan</th><th className="right">Nominal</th></tr></thead>
      <tbody>
        {/* Aktivitas Operasi */}
        <tr className="section-header"><td>Aktivitas Operasi</td><td></td></tr>
        {opIn.length===0 && opOut.length===0 ? (
          <tr className="indent"><td colSpan={2} style={{color:"#9ca3af"}}>Belum ada transaksi operasional</td></tr>
        ) : (
          <>
            {Object.entries(opIn.reduce((acc,t)=>{acc[t.kategori]=(acc[t.kategori]||0)+t.nominal;return acc},{} )).map(([k,v])=>(
              <Row key={k} label={k} val={v} indent positive />
            ))}
            {Object.entries(opOut.reduce((acc,t)=>{acc[t.kategori]=(acc[t.kategori]||0)+t.nominal;return acc},{})).map(([k,v])=>(
              <Row key={k} label={k} val={-v} indent negative />
            ))}
          </>
        )}
        <tr className="subtotal"><td>Net Arus Operasi</td><td className="right" style={{color:netOp>=0?"#16a34a":"#dc2626"}}>{netOp<0?`(${fmtRp(Math.abs(netOp))})`:fmtRp(netOp)}</td></tr>

        {/* Aktivitas Investasi */}
        <tr className="section-header"><td>Aktivitas Investasi</td><td></td></tr>
        {invOut.length===0 ? (
          <tr className="indent"><td colSpan={2} style={{color:"#9ca3af"}}>Tidak ada pembelian aset</td></tr>
        ) : invOut.map(t=>(
          <Row key={t.id} label={t.keterangan||t.kategori} val={-t.nominal} indent negative />
        ))}
        <tr className="subtotal"><td>Net Arus Investasi</td><td className="right" style={{color:netInv>=0?"#16a34a":"#dc2626"}}>{netInv<0?`(${fmtRp(Math.abs(netInv))})`:fmtRp(netInv)}</td></tr>

        {/* Aktivitas Pendanaan */}
        <tr className="section-header"><td>Aktivitas Pendanaan</td><td></td></tr>
        {finTx.length===0 ? (
          <tr className="indent"><td colSpan={2} style={{color:"#9ca3af"}}>Tidak ada aktivitas pendanaan</td></tr>
        ) : finTx.map(t=>(
          <Row key={t.id} label={t.keterangan||t.kategori} val={t.tipe==="pemasukan"?t.nominal:-t.nominal} indent positive={t.tipe==="pemasukan"} negative={t.tipe==="pengeluaran"} />
        ))}
        <tr className="subtotal"><td>Net Arus Pendanaan</td><td className="right" style={{color:netFin>=0?"#16a34a":"#dc2626"}}>{netFin<0?`(${fmtRp(Math.abs(netFin))})`:fmtRp(netFin)}</td></tr>

        {/* Total */}
        <tr className="total" style={{borderTop:"2px solid #1f2937"}}>
          <td>KENAIKAN (PENURUNAN) KAS</td>
          <td className="right" style={{color:netTotal>=0?"#16a34a":"#dc2626", fontSize:15}}>
            {netTotal<0?`(${fmtRp(Math.abs(netTotal))})`:fmtRp(netTotal)}
          </td>
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
  const {
    nilaiTanah, nilaiAsetLain, akumDepresiasi, nilaiBukuAset,
    labaBersih, mgmtFee, kasIn, kasOut, piutangUsaha,
    totalDepositAktif, totalSewaDimuka, totalLiabilitas,
  } = data;

  const kas             = kasIn - kasOut;
  const totalAsetLancar = Math.max(0, kas) + Math.max(0, piutangUsaha);
  const totalAsetTetap  = nilaiTanah + nilaiBukuAset;
  const totalAset       = totalAsetLancar + totalAsetTetap;

  const modalPemilik    = totalAset - totalLiabilitas - labaBersih;
  const totalModal      = modalPemilik + labaBersih - mgmtFee;
  const totalLiabModal  = totalLiabilitas + totalModal;

  return (
    <table className="lk-table">
      <thead><tr><th>Keterangan</th><th className="right">Nominal</th></tr></thead>
      <tbody>
        {/* ─── ASET ─── */}
        <tr className="section-header"><td>ASET</td><td></td></tr>

        <tr className="section-header"><td style={{paddingLeft:16}}>Aset Lancar</td><td></td></tr>
        <tr className="indent"><td>Kas & Setara Kas</td><td className="right">{fmtRp(Math.max(0,kas))}</td></tr>
        <tr className="indent"><td>Piutang Usaha</td><td className="right">{fmtRp(Math.max(0,piutangUsaha))}</td></tr>
        <tr className="subtotal"><td>Total Aset Lancar</td><td className="right">{fmtRp(totalAsetLancar)}</td></tr>

        <tr className="section-header"><td style={{paddingLeft:16}}>Aset Tetap</td><td></td></tr>
        <tr className="indent"><td>Tanah & Bangunan</td><td className="right">{fmtRp(nilaiTanah)}</td></tr>
        <tr className="indent"><td>Peralatan & Inventaris</td><td className="right">{fmtRp(nilaiAsetLain)}</td></tr>
        <tr className="indent negative"><td>Akumulasi Depresiasi</td><td className="right">({fmtRp(akumDepresiasi)})</td></tr>
        <tr className="subtotal"><td>Total Aset Tetap</td><td className="right">{fmtRp(totalAsetTetap)}</td></tr>

        <tr className="total"><td>TOTAL ASET</td><td className="right">{fmtRp(totalAset)}</td></tr>

        {/* ─── LIABILITAS ─── */}
        <tr className="section-header"><td>LIABILITAS</td><td></td></tr>
        <tr className="indent"><td>Deposit Penyewa</td>
          <td className="right" style={{color: totalDepositAktif>0?"#dc2626":"#374151"}}>
            {fmtRp(totalDepositAktif)}
          </td>
        </tr>
        <tr className="indent"><td>Sewa Diterima Dimuka</td>
          <td className="right" style={{color: totalSewaDimuka>0?"#dc2626":"#374151"}}>
            {fmtRp(totalSewaDimuka)}
          </td>
        </tr>
        <tr className="subtotal"><td>Total Liabilitas</td><td className="right">{fmtRp(totalLiabilitas)}</td></tr>

        {/* ─── MODAL ─── */}
        <tr className="section-header"><td>MODAL</td><td></td></tr>
        <tr className="indent positive"><td>Modal Pemilik</td><td className="right">{fmtRp(Math.max(0, modalPemilik))}</td></tr>
        <tr className="indent positive"><td>Laba Bersih Periode</td><td className="right">{fmtRp(labaBersih)}</td></tr>
        <tr className="indent negative"><td>Management Fee Terutang</td><td className="right">({fmtRp(mgmtFee)})</td></tr>
        <tr className="subtotal"><td>Total Modal</td><td className="right">{fmtRp(totalModal)}</td></tr>

        <tr className="total"><td>TOTAL LIABILITAS + MODAL</td><td className="right">{fmtRp(totalLiabModal)}</td></tr>
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

  const csv = rows.map(r=>r.join(",")).join("\n");
  const blob = new Blob([csv],{type:"text/csv;charset=utf-8;"});
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href=url; a.download=`laporan-${reportType}-${dari}-${sampai}.csv`; a.click();
  URL.revokeObjectURL(url);
};

// ============================================================
// MAIN
// ============================================================
export default function Laporan({ user, globalData = {} }) {
  const {
    kasJurnal      = [],
    asetList       = [],
    penyewaList    = [],
    karyawanList   = [],
    tagihanList    = [],
    depositList    = [],
    sewaDimukaList = [],
    saldoAwal      = {},
    isReadOnly     = false,
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
  const data     = useMemo(()=>hitungKeuangan(kasJurnal,asetList,penyewaList,karyawanList,periode,depositList,sewaDimukaList,saldoAwal),[kasJurnal,asetList,penyewaList,periode,depositList,sewaDimukaList,saldoAwal]);

  const years = [thisYear-2, thisYear-1, thisYear, thisYear+1];

  return (
    <div className="lk-wrap">
      <StyleInjector />

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
          {label} · {periode.dari} s/d {periode.sampai}
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
            <button className="lk-pdf-btn" onClick={()=>alert("PDF generation — coming soon!\nIntegrasi jsPDF akan diimplementasikan bersama semua modul.")}>
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
