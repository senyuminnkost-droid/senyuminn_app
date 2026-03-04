import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";

// ============================================================
// CSS
// ============================================================
const CSS = `
  .pg-wrap { display:flex; flex-direction:column; gap:16px; }

  .pg-cards { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
  .pg-card  { background:#fff; border-radius:12px; border:1px solid #e5e7eb; padding:14px 16px; position:relative; overflow:hidden; }
  .pg-card-bar { position:absolute; top:0; left:0; right:0; height:3px; }
  .pg-card-label { font-size:10px; font-weight:500; color:#9ca3af; text-transform:uppercase; letter-spacing:.8px; margin-bottom:4px; margin-top:8px; }
  .pg-card-val { font-size:20px; font-weight:700; color:#111827; font-family:'JetBrains Mono',monospace; }
  .pg-card-sub { font-size:11px; color:#6b7280; margin-top:3px; }

  /* Period bar */
  .pg-period { background:#fff; border-radius:12px; border:1px solid #e5e7eb; padding:12px 16px; display:flex; align-items:center; gap:12px; }
  .pg-period-label { font-size:12px; font-weight:600; color:#374151; }
  .pg-select { padding:6px 10px; border-radius:8px; border:1.5px solid #e5e7eb; font-size:12px; color:#374151; background:#fff; outline:none; font-family:inherit; cursor:pointer; }
  .pg-select:focus { border-color:#f97316; }
  .pg-period-badge { margin-left:auto; padding:4px 12px; border-radius:20px; font-size:11px; font-weight:600; }

  /* Table */
  .pg-widget { background:#fff; border-radius:12px; border:1px solid #e5e7eb; overflow:hidden; }
  .pg-widget-head { padding:13px 16px 10px; border-bottom:1px solid #f3f4f6; display:flex; align-items:center; justify-content:space-between; }
  .pg-widget-title { font-size:13px; font-weight:700; color:#111827; }

  .pg-table { width:100%; border-collapse:collapse; }
  .pg-table th { padding:9px 14px; font-size:10px; font-weight:700; color:#9ca3af; text-transform:uppercase; letter-spacing:.8px; background:#f9fafb; text-align:left; white-space:nowrap; }
  .pg-table th.right { text-align:right; }
  .pg-table td { padding:11px 14px; font-size:12px; color:#374151; border-bottom:1px solid #f9fafb; vertical-align:middle; }
  .pg-table td.right { text-align:right; font-family:'JetBrains Mono',monospace; font-weight:600; }
  .pg-table td.green  { color:#16a34a; }
  .pg-table td.red    { color:#dc2626; }
  .pg-table td.orange { color:#ea580c; }
  .pg-table tr:last-child td { border-bottom:none; }
  .pg-table tr:hover td { background:#fafafa; }
  .pg-table tr.total-row td { background:#fff7ed; font-weight:700; border-top:2px solid #fed7aa; }
  .pg-table tr.total-row td.right { color:#f97316; font-size:13px; }

  /* Slip modal */
  .pg-overlay { position:fixed !important; top:0 !important; left:0 !important; width:100vw !important; height:100vh !important; background:rgba(17,24,39,.65) !important; backdrop-filter:blur(4px) !important; z-index:9999 !important; display:flex !important; align-items:center !important; justify-content:center !important; padding:16px !important; box-sizing:border-box !important; animation:pgFade .18s ease; }
  @keyframes pgFade { from{opacity:0}to{opacity:1} }
  .pg-modal { background:#fff; border-radius:16px; width:100%; max-width:540px; max-height:92vh; overflow-y:auto; box-shadow:0 24px 64px rgba(0,0,0,.18); animation:pgSlide .2s cubic-bezier(.4,0,.2,1); }
  @keyframes pgSlide { from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1} }
  .pg-modal-head { padding:15px 20px 12px; border-bottom:1px solid #f3f4f6; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; background:#fff; z-index:1; }
  .pg-modal-title { font-size:14px; font-weight:700; color:#111827; }
  .pg-modal-close { width:28px; height:28px; border-radius:7px; background:#f3f4f6; border:none; cursor:pointer; font-size:14px; color:#6b7280; display:flex; align-items:center; justify-content:center; }
  .pg-modal-body { padding:0; }
  .pg-modal-foot { padding:12px 20px; border-top:1px solid #f3f4f6; display:flex; gap:8px; }

  /* Slip gaji design */
  .pg-slip-header { background:linear-gradient(135deg,#1e293b,#0f172a); padding:20px 24px; color:#fff; }
  .pg-slip-company { font-size:16px; font-weight:800; letter-spacing:.5px; }
  .pg-slip-sub { font-size:11px; color:#94a3b8; margin-top:2px; }
  .pg-slip-periode { margin-top:12px; background:rgba(255,255,255,.08); border-radius:8px; padding:8px 12px; display:inline-block; font-size:12px; font-weight:600; color:#e2e8f0; }

  .pg-slip-body { padding:20px 24px; }
  .pg-slip-employee { display:flex; align-items:center; gap:12px; margin-bottom:18px; padding-bottom:14px; border-bottom:2px dashed #f3f4f6; }
  .pg-slip-avatar { width:44px; height:44px; border-radius:11px; display:flex; align-items:center; justifyContent:center; font-size:17px; font-weight:700; color:#fff; flex-shrink:0; }
  .pg-slip-name { font-size:15px; font-weight:700; color:#111827; }
  .pg-slip-jabatan { font-size:11px; color:#9ca3af; margin-top:1px; }

  .pg-slip-section { margin-bottom:14px; }
  .pg-slip-section-title { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#9ca3af; margin-bottom:8px; padding-bottom:4px; border-bottom:1px solid #f3f4f6; }
  .pg-slip-row { display:flex; justify-content:space-between; align-items:center; padding:5px 0; }
  .pg-slip-key { font-size:12px; color:#374151; }
  .pg-slip-val { font-size:12px; font-weight:600; font-family:'JetBrains Mono',monospace; }
  .pg-slip-val.green  { color:#16a34a; }
  .pg-slip-val.red    { color:#dc2626; }
  .pg-slip-total { background:linear-gradient(135deg,#fff7ed,#ffedd5); border:2px solid #fed7aa; border-radius:10px; padding:14px 16px; display:flex; justify-content:space-between; align-items:center; margin-top:14px; }
  .pg-slip-total-label { font-size:13px; font-weight:700; color:#9a3412; }
  .pg-slip-total-val { font-size:20px; font-weight:800; color:#f97316; font-family:'JetBrains Mono',monospace; }
  .pg-slip-ttd { margin-top:16px; display:grid; grid-template-columns:1fr 1fr; gap:16px; }
  .pg-slip-ttd-box { text-align:center; }
  .pg-slip-ttd-line { height:40px; border-bottom:1px solid #e5e7eb; margin-bottom:6px; }
  .pg-slip-ttd-label { font-size:10px; color:#9ca3af; }

  /* Input form inline */
  .pg-inline-input { padding:5px 9px; border-radius:7px; border:1.5px solid #e5e7eb; font-size:12px; font-family:'JetBrains Mono',monospace; color:#1f2937; outline:none; background:#fff; width:110px; text-align:right; transition:border-color .12s; }
  .pg-inline-input:focus { border-color:#f97316; background:#fff7ed; }

  .pg-badge { display:inline-flex; align-items:center; gap:3px; padding:2px 8px; border-radius:20px; font-size:10px; font-weight:600; }

  .pg-btn { flex:1; padding:9px 14px; border-radius:8px; font-size:12px; font-weight:600; border:none; cursor:pointer; font-family:inherit; transition:all .15s; display:flex; align-items:center; justify-content:center; gap:5px; }
  .pg-btn.primary { background:linear-gradient(135deg,#f97316,#ea580c); color:#fff; box-shadow:0 3px 10px rgba(249,115,22,.25); }
  .pg-btn.success { background:linear-gradient(135deg,#16a34a,#15803d); color:#fff; }
  .pg-btn.ghost   { background:#f3f4f6; color:#4b5563; }
  .pg-btn:disabled { opacity:.4; cursor:not-allowed; }

  .pg-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:48px 16px; color:#9ca3af; text-align:center; gap:8px; }

  @media(max-width:768px) { .pg-cards{grid-template-columns:repeat(2,1fr)} }
  @media(max-width:480px) { .pg-cards{grid-template-columns:repeat(2,1fr);gap:8px} }
`;

function StyleInjector() {
  useEffect(() => {
    const id = "senyuminn-penggajian-css";
    if (document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id; el.textContent = CSS;
    document.head.appendChild(el);
    return () => { const e = document.getElementById(id); if(e) e.remove(); };
  }, []);
  return null;
}

// ============================================================
// HELPERS
// ============================================================
const padD     = (n) => String(n).padStart(2,"0");
const fmtRp    = (n) => "Rp " + Math.abs(Number(n)||0).toLocaleString("id-ID");
const fmtRpShort = (n) => {
  const v = Math.abs(Number(n)||0);
  if (v >= 1000000) return "Rp "+(v/1000000).toFixed(1)+"jt";
  if (v >= 1000)    return "Rp "+(v/1000).toFixed(0)+"rb";
  return "Rp "+v;
};

const BULAN_FULL = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
const thisYear   = new Date().getFullYear();
const thisMonth  = new Date().getMonth() + 1;

const getInisial = (nama) => {
  if (!nama) return "?";
  const p = nama.trim().split(" ");
  return (p.length>=2 ? p[0][0]+p[1][0] : nama.slice(0,2)).toUpperCase();
};
const AVATAR_COLORS = ["#f97316","#3b82f6","#8b5cf6","#16a34a","#ec4899","#06b6d4"];
const getColor = (id) => AVATAR_COLORS[(id||0) % AVATAR_COLORS.length];

// Default komponen gaji per karyawan
const defaultGaji = (k) => ({
  gajiPokok:      Number(k?.gajiPokok) || 0,
  insentif:       NOMINAL_INSENTIF,
  lemburShift:    0,      // jumlah shift lembur × LEMBUR_SHIFT
  lemburTambahan: 0,      // nominal langsung dari PJ
  potonganIjin:   0,      // jumlah hari ijin tidak sah × Rp 50.000
  pinjaman:       0,      // maks 700.000 sekali potong
  bpjs:           0,
  pajak:          0,
  keterangan:     "",
  status:         "draft", // draft | final | dibayar
});

const hitungTotal = (g, cfg={}) => {
  const LS = cfg.lemburPerShift||50000;
  const DI = cfg.dendaIjinTidakSah||50000;
  const pendapatan = (g.gajiPokok||0) + (g.insentif||0) + ((g.lemburShift||0)*LEMBUR_SHIFT) + (g.lemburTambahan||0);
  const potongan   = (g.potonganIjin||0)*DENDA_IJIN + (g.pinjaman||0) + (g.bpjs||0) + (g.pajak||0);
  return { pendapatan, potongan, netto: pendapatan - potongan };
};

// ============================================================
// SLIP GAJI
// ============================================================
function SlipGaji({ karyawan, gaji, periode, onClose, onFinalize, isReadOnly }) {
  const { pendapatan, potongan, netto } = hitungTotal(gaji);
  const [g, setG] = useState({...gaji});
  const setV = (k,v) => setG(p=>({...p,[k]:v}));
  const { pendapatan:P, potongan:Q, netto:N } = hitungTotal(g);

  const isEditable = !isReadOnly && g.status !== "dibayar";

  const numInput = (key, label) => (
    <div className="pg-slip-row">
      <span className="pg-slip-key">{label}</span>
      {isEditable ? (
        <input
          type="number" className="pg-inline-input"
          value={g[key]||0}
          onChange={e=>setV(key,Number(e.target.value))}
          min={0}
        />
      ) : (
        <span className="pg-slip-val green">{fmtRp(g[key]||0)}</span>
      )}
    </div>
  );

  const numInputNeg = (key, label, multiplier=1) => (
    <div className="pg-slip-row">
      <span className="pg-slip-key">{label}</span>
      {isEditable ? (
        <input
          type="number" className="pg-inline-input"
          value={g[key]||0}
          onChange={e=>setV(key,Number(e.target.value))}
          min={0}
          style={{borderColor:"#fca5a5",color:"#dc2626"}}
        />
      ) : (
        <span className="pg-slip-val red">({fmtRp((g[key]||0)*multiplier)})</span>
      )}
    </div>
  );

  return createPortal(
    <div className="pg-overlay" onClick={onClose}>
      <div className="pg-modal" onClick={e=>e.stopPropagation()}>
        <div className="pg-modal-head">
          <div className="pg-modal-title">📄 Slip Gaji — {karyawan.nama}</div>
          <button className="pg-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="pg-modal-body">
          {/* Header slip */}
          <div className="pg-slip-header">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div>
                <div className="pg-slip-company">SENYUM INN</div>
                <div className="pg-slip-sub">Exclusive Kost · Slip Gaji Karyawan</div>
              </div>
              <span className="pg-badge" style={{
                color:g.status==="dibayar"?"#fff":g.status==="final"?"#1e293b":"#94a3b8",
                background:g.status==="dibayar"?"#16a34a":g.status==="final"?"#fbbf24":"rgba(255,255,255,.1)",
                fontSize:11
              }}>
                {g.status==="dibayar"?"✅ Dibayar":g.status==="final"?"⚡ Final":"📝 Draft"}
              </span>
            </div>
            <div className="pg-slip-periode">
              📅 {BULAN_FULL[periode.bulan-1]} {periode.tahun}
            </div>
          </div>

          <div className="pg-slip-body">
            {/* Employee info */}
            <div className="pg-slip-employee">
              <div className="pg-slip-avatar" style={{background:getColor(karyawan.id),display:"flex",alignItems:"center",justifyContent:"center"}}>
                {getInisial(karyawan.nama)}
              </div>
              <div>
                <div className="pg-slip-name">{karyawan.nama}</div>
                <div className="pg-slip-jabatan">{karyawan.jabatan} · {karyawan.shift}</div>
                <div style={{fontSize:10,color:"#9ca3af",marginTop:1,fontFamily:"JetBrains Mono,monospace"}}>
                  {karyawan.rekeningBank} · {karyawan.rekeningNo || "—"}
                </div>
              </div>
            </div>

            {/* Pendapatan */}
            <div className="pg-slip-section">
              <div className="pg-slip-section-title">+ Pendapatan</div>
              <div className="pg-slip-row">
                <span className="pg-slip-key">Gaji Pokok</span>
                <span className="pg-slip-val green">{fmtRp(g.gajiPokok||0)}</span>
              </div>
              {numInput("insentif","Insentif / Tunjangan KPI")}
              <div className="pg-slip-row">
                <span className="pg-slip-key">
                  Lembur Shift
                  {isEditable && <span style={{fontSize:10,color:"#9ca3af",marginLeft:4}}>{`(×${(LEMBUR_SHIFT/1000).toFixed(0)}rb/shift)`}</span>}
                </span>
                {isEditable ? (
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <input
                      type="number" className="pg-inline-input"
                      value={g.lemburShift||0}
                      onChange={e=>setV("lemburShift",Number(e.target.value))}
                      min={0} placeholder="0 shift"
                      style={{width:80}}
                    />
                    <span style={{fontSize:11,color:"#9ca3af"}}>shift = {fmtRp((g.lemburShift||0)*50000)}</span>
                  </div>
                ) : (
                  <span className="pg-slip-val green">{fmtRp((g.lemburShift||0)*50000)}</span>
                )}
              </div>
              {numInput("lemburTambahan","Lembur Tambahan (nominal)")}
              <div className="pg-slip-row" style={{borderTop:"1px solid #f3f4f6",marginTop:4,paddingTop:6}}>
                <span style={{fontSize:12,fontWeight:700,color:"#374151"}}>Total Pendapatan</span>
                <span className="pg-slip-val green" style={{fontSize:13}}>{fmtRp(P)}</span>
              </div>
            </div>

            {/* Potongan */}
            <div className="pg-slip-section">
              <div className="pg-slip-section-title">− Potongan</div>
              <div className="pg-slip-row">
                <span className="pg-slip-key">
                  Ijin Tidak Sah
                  {isEditable && <span style={{fontSize:10,color:"#9ca3af",marginLeft:4}}>{`(×${(DENDA_IJIN/1000).toFixed(0)}rb/hari)`}</span>}
                </span>
                {isEditable ? (
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <input
                      type="number" className="pg-inline-input"
                      value={g.potonganIjin||0}
                      onChange={e=>setV("potonganIjin",Number(e.target.value))}
                      min={0} placeholder="0 hari"
                      style={{width:80,borderColor:"#fca5a5",color:"#dc2626"}}
                    />
                    <span style={{fontSize:11,color:"#9ca3af"}}>hari = {fmtRp((g.potonganIjin||0)*50000)}</span>
                  </div>
                ) : (
                  <span className="pg-slip-val red">({fmtRp((g.potonganIjin||0)*50000)})</span>
                )}
              </div>
              <div className="pg-slip-row">
                <span className="pg-slip-key">Pinjaman Koperasi <span style={{fontSize:10,color:"#9ca3af"}}>(maks Rp700rb)</span></span>
                {isEditable ? (
                  <input
                    type="number" className="pg-inline-input"
                    value={g.pinjaman||0}
                    onChange={e=>setV("pinjaman",Math.min(MAX_PINJAMAN,Number(e.target.value)))}
                    min={0} max={700000}
                    style={{borderColor:"#fca5a5",color:"#dc2626"}}
                  />
                ) : (
                  <span className="pg-slip-val red">({fmtRp(g.pinjaman||0)})</span>
                )}
              </div>
              {numInputNeg("bpjs","BPJS Kesehatan & TK")}
              {numInputNeg("pajak","Pajak PPh 21")}
              <div className="pg-slip-row" style={{borderTop:"1px solid #f3f4f6",marginTop:4,paddingTop:6}}>
                <span style={{fontSize:12,fontWeight:700,color:"#374151"}}>Total Potongan</span>
                <span className="pg-slip-val red" style={{fontSize:13}}>({fmtRp(Q)})</span>
              </div>
            </div>

            {/* Keterangan */}
            {isEditable && (
              <div style={{marginBottom:14}}>
                <div style={{fontSize:11,fontWeight:600,color:"#374151",marginBottom:5}}>Keterangan</div>
                <textarea
                  style={{width:"100%",padding:"8px 10px",borderRadius:8,border:"1.5px solid #e5e7eb",fontSize:11,fontFamily:"inherit",resize:"none",outline:"none",boxSizing:"border-box"}}
                  rows={2} value={g.keterangan||""} onChange={e=>setV("keterangan",e.target.value)}
                  placeholder="Catatan slip gaji bulan ini..."
                />
              </div>
            )}
            {!isEditable && g.keterangan && (
              <div style={{background:"#f9fafb",borderRadius:8,padding:"8px 12px",fontSize:11,color:"#6b7280",marginBottom:14}}>
                📝 {g.keterangan}
              </div>
            )}

            {/* Total netto */}
            <div className="pg-slip-total">
              <div>
                <div className="pg-slip-total-label">GAJI DITERIMA</div>
                <div style={{fontSize:10,color:"#9ca3af"}}>Transfer ke {karyawan.rekeningBank||"—"} {karyawan.rekeningNo||""}</div>
              </div>
              <div className="pg-slip-total-val">{fmtRp(N)}</div>
            </div>

            {/* TTD area */}
            <div className="pg-slip-ttd">
              <div className="pg-slip-ttd-box">
                <div className="pg-slip-ttd-line"></div>
                <div className="pg-slip-ttd-label">Dibuat oleh Manajemen</div>
              </div>
              <div className="pg-slip-ttd-box">
                <div className="pg-slip-ttd-line"></div>
                <div className="pg-slip-ttd-label">Diterima oleh Karyawan</div>
              </div>
            </div>
          </div>
        </div>

        <div className="pg-modal-foot">
          {isEditable && g.status==="draft" && (
            <button className="pg-btn primary" onClick={()=>onFinalize({...g,status:"final"})}>
              ⚡ Finalisasi Slip
            </button>
          )}
          {isEditable && g.status==="final" && (
            <button className="pg-btn success" onClick={()=>onFinalize({...g,status:"dibayar"})}>
              ✅ Tandai Dibayar
            </button>
          )}
          <button className="pg-btn ghost" onClick={()=>alert("PDF generation — coming soon!")}>
            📄 Download PDF
          </button>
          <button className="pg-btn ghost" onClick={onClose}>Tutup</button>
        </div>
      </div>
    </div>
  , document.body);
}

// ============================================================
// MAIN
// ============================================================
export default function Penggajian({ user, globalData = {} }) {
  const {
    karyawanList       = [],
    kasJurnal          = [], setKasJurnal = ()=>{},
    pengaturanConfig   = {},
    isReadOnly         = false,
  } = globalData;

  // Baca dari pengaturan, fallback ke default
  const LEMBUR_SHIFT   = pengaturanConfig.lemburPerShift      || 50000;
  const DENDA_IJIN     = pengaturanConfig.dendaIjinTidakSah   || 50000;
  const MAX_PINJAMAN   = pengaturanConfig.maxPinjamanKoperasi  || 700000;
  const NOMINAL_INSENTIF = pengaturanConfig.nominalInsentif   || 500000;

  const [periode,    setPeriode]   = useState({ tahun:thisYear, bulan:thisMonth });
  const [gajiData,   setGajiData]  = useState({}); // { "karyawanId-YYYY-MM": {...gaji} }
  const [showSlip,   setShowSlip]  = useState(null); // karyawan object
  const [search,     setSearch]    = useState("");

  const periodeKey = `${periode.tahun}-${padD(periode.bulan)}`;
  const setPV = (k,v) => setPeriode(p=>({...p,[k]:v}));
  const years = [thisYear-1, thisYear, thisYear+1];

  // Ambil atau buat data gaji untuk periode ini
  const getGaji = (karyawanId) => {
    const key = `${karyawanId}-${periodeKey}`;
    const k   = karyawanList.find(k=>k.id===karyawanId);
    return gajiData[key] || defaultGaji(k);
  };

  const saveGaji = (karyawanId, data) => {
    const key = `${karyawanId}-${periodeKey}`;
    setGajiData(p=>({...p,[key]:data}));

    // Kalau dibayar → masuk kasJurnal otomatis
    if (data.status==="dibayar") {
      const k    = karyawanList.find(k=>k.id===karyawanId);
      const { netto } = hitungTotal(data);
      const already = kasJurnal.find(j=>j.ref===`GAJI-${karyawanId}-${periodeKey}`);
      if (!already) {
        setKasJurnal(prev=>[...prev,{
          id:      Date.now(),
          tanggal: `${periode.tahun}-${padD(periode.bulan)}-25`,
          tipe:    "pengeluaran",
          kategori:"Gaji & Insentif",
          nominal: netto,
          keterangan: `Gaji ${k?.nama||""} ${BULAN_FULL[periode.bulan-1]} ${periode.tahun}`,
          ref:     `GAJI-${karyawanId}-${periodeKey}`,
        }]);
      }
    }
  };

  const aktifKaryawan = karyawanList.filter(k=>k.aktif);
  const filtered = aktifKaryawan.filter(k=>{
    if (!search) return true;
    const q = search.toLowerCase();
    return k.nama?.toLowerCase().includes(q) || k.jabatan?.toLowerCase().includes(q);
  });

  // Summary stats
  const stats = useMemo(()=>{
    let totalNetto=0, totalDraft=0, totalFinal=0, totalDibayar=0;
    aktifKaryawan.forEach(k=>{
      const g = getGaji(k.id);
      const { netto } = hitungTotal(g);
      totalNetto += netto;
      if (g.status==="draft")   totalDraft++;
      if (g.status==="final")   totalFinal++;
      if (g.status==="dibayar") totalDibayar++;
    });
    return {totalNetto,totalDraft,totalFinal,totalDibayar};
  },[gajiData,karyawanList,periodeKey]);

  const STATUS_COLOR = {
    draft:   {color:"#9ca3af",bg:"#f3f4f6"},
    final:   {color:"#d97706",bg:"#fef3c7"},
    dibayar: {color:"#16a34a",bg:"#dcfce7"},
  };

  return (
    <div className="pg-wrap">
      <StyleInjector />

      {/* Cards */}
      <div className="pg-cards">
        {[
          {label:"Total Penggajian",  val:fmtRpShort(stats.totalNetto), color:"#f97316", sub:`${aktifKaryawan.length} karyawan aktif`},
          {label:"Slip Draft",        val:stats.totalDraft,  color:"#9ca3af", sub:"Belum difinalisasi"},
          {label:"Slip Final",        val:stats.totalFinal,  color:"#d97706", sub:"Siap dibayar"},
          {label:"Sudah Dibayar",     val:stats.totalDibayar,color:"#16a34a", sub:"Bulan ini"},
        ].map((c,i)=>(
          <div key={i} className="pg-card">
            <div className="pg-card-bar" style={{background:c.color}} />
            <div className="pg-card-label">{c.label}</div>
            <div className="pg-card-val" style={{color:c.color}}>{c.val}</div>
            <div className="pg-card-sub">{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Periode */}
      <div className="pg-period">
        <span className="pg-period-label">📅 Periode Penggajian:</span>
        <select className="pg-select" value={periode.tahun} onChange={e=>setPV("tahun",parseInt(e.target.value))}>
          {years.map(y=><option key={y} value={y}>{y}</option>)}
        </select>
        <select className="pg-select" value={periode.bulan} onChange={e=>setPV("bulan",parseInt(e.target.value))}>
          {BULAN_FULL.map((b,i)=><option key={i} value={i+1}>{b}</option>)}
        </select>

        {/* Progress */}
        <div style={{display:"flex",alignItems:"center",gap:8,marginLeft:8}}>
          {[
            {l:"Draft",   v:stats.totalDraft,   c:"#9ca3af"},
            {l:"Final",   v:stats.totalFinal,   c:"#d97706"},
            {l:"Dibayar", v:stats.totalDibayar, c:"#16a34a"},
          ].map(s=>(
            <span key={s.l} className="pg-badge" style={{color:s.c,background:s.c+"22"}}>{s.v} {s.l}</span>
          ))}
        </div>

        {!isReadOnly && stats.totalFinal > 0 && (
          <button
            className="pg-btn success"
            style={{flex:"none",padding:"7px 14px",fontSize:11,marginLeft:"auto"}}
            onClick={()=>{
              aktifKaryawan.forEach(k=>{
                const g = getGaji(k.id);
                if (g.status==="final") saveGaji(k.id,{...g,status:"dibayar"});
              });
            }}
          >
            ✅ Bayar Semua Final ({stats.totalFinal})
          </button>
        )}
      </div>

      {/* Tabel */}
      <div className="pg-widget">
        <div className="pg-widget-head">
          <div className="pg-widget-title">
            💰 Daftar Penggajian — {BULAN_FULL[periode.bulan-1]} {periode.tahun}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{display:"flex",alignItems:"center",gap:7,background:"#f9fafb",border:"1.5px solid #e5e7eb",borderRadius:8,padding:"6px 11px"}}>
              <span>🔍</span>
              <input
                style={{border:"none",outline:"none",background:"transparent",fontSize:12,color:"#1f2937",fontFamily:"inherit",width:140}}
                placeholder="Cari karyawan..."
                value={search} onChange={e=>setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {karyawanList.length === 0 ? (
          <div className="pg-empty">
            <div style={{fontSize:36,opacity:.4}}>👥</div>
            <div style={{fontSize:13,fontWeight:600,color:"#374151"}}>Belum ada karyawan</div>
            <div style={{fontSize:11,color:"#9ca3af"}}>Tambahkan karyawan di modul Data Karyawan</div>
          </div>
        ) : (
          <table className="pg-table">
            <thead>
              <tr>
                <th>Karyawan</th>
                <th className="right">Gaji Pokok</th>
                <th className="right">+ Tunjangan</th>
                <th className="right">− Potongan</th>
                <th className="right">Gaji Netto</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(k=>{
                const g = getGaji(k.id);
                const { pendapatan:P, potongan:Q, netto:N } = hitungTotal(g);
                const tunjangan = P - (g.gajiPokok||0);
                const sc = STATUS_COLOR[g.status];
                return (
                  <tr key={k.id}>
                    <td>
                      <div style={{display:"flex",alignItems:"center",gap:9}}>
                        <div style={{width:32,height:32,borderRadius:8,background:getColor(k.id),display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"#fff",flexShrink:0}}>
                          {getInisial(k.nama)}
                        </div>
                        <div>
                          <div style={{fontSize:12,fontWeight:600,color:"#1f2937"}}>{k.nama}</div>
                          <div style={{fontSize:10,color:"#9ca3af"}}>{k.jabatan}</div>
                        </div>
                      </div>
                    </td>
                    <td className="right">{fmtRp(g.gajiPokok||0)}</td>
                    <td className="right green">+{fmtRp(tunjangan)}</td>
                    <td className="right red">({fmtRp(Q)})</td>
                    <td className="right orange" style={{fontSize:13}}>{fmtRp(N)}</td>
                    <td>
                      <span className="pg-badge" style={{color:sc.color,background:sc.bg}}>
                        {g.status==="draft"?"📝 Draft":g.status==="final"?"⚡ Final":"✅ Dibayar"}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={()=>setShowSlip(k)}
                        style={{padding:"5px 12px",borderRadius:7,background:"#f9fafb",border:"1.5px solid #e5e7eb",fontSize:11,fontWeight:600,color:"#374151",cursor:"pointer"}}
                      >
                        {isReadOnly?"👁️ Lihat":"✏️ Edit"}
                      </button>
                    </td>
                  </tr>
                );
              })}

              {/* Total row */}
              <tr className="total-row">
                <td colSpan={4} style={{fontSize:12,fontWeight:700,color:"#374151"}}>
                  TOTAL PENGGAJIAN — {aktifKaryawan.length} Karyawan
                </td>
                <td className="right">{fmtRp(stats.totalNetto)}</td>
                <td colSpan={2}></td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Slip */}
      {showSlip && (
        <SlipGaji
          karyawan={showSlip}
          gaji={getGaji(showSlip.id)}
          periode={periode}
          isReadOnly={isReadOnly}
          onClose={()=>setShowSlip(null)}
          onFinalize={(data)=>{ saveGaji(showSlip.id, data); setShowSlip(null); }}
        />
      )}
    </div>
  );
}
