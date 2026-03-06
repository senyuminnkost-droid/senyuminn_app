import { useState, useEffect, useMemo } from "react";

// ============================================================
// CSS
// ============================================================



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
  insentif:       500000, // default nominal KPI insentif
  lemburShift:    0,      // jumlah shift lembur × Rp 50.000
  lemburTambahan: 0,      // nominal langsung dari PJ
  potonganIjin:   0,      // jumlah hari ijin tidak sah × Rp 50.000
  pinjaman:       0,      // maks 700.000 sekali potong
  bpjs:           0,
  pajak:          0,
  keterangan:     "",
  status:         "draft", // draft | final | dibayar
});

const hitungTotal = (g) => {
  const pendapatan = (g.gajiPokok||0) + (g.insentif||0) + ((g.lemburShift||0)*50000) + (g.lemburTambahan||0);
  const potongan   = (g.potonganIjin||0)*50000 + (g.pinjaman||0) + (g.bpjs||0) + (g.pajak||0);
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

  return(
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
                <div className="pg-slip-sub">Exclusive Kost - Slip Gaji Karyawan</div>
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
                <div className="pg-slip-jabatan">{karyawan.jabatan} - {karyawan.shift}</div>
                <div style={{fontSize:10,color:"#9ca3af",marginTop:1,fontFamily:"JetBrains Mono,monospace"}}>
                  {karyawan.rekeningBank} - {karyawan.rekeningNo || "—"}
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
                  {isEditable && <span style={{fontSize:10,color:"#9ca3af",marginLeft:4}}>(×Rp50rb/shift)</span>}
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
                  {isEditable && <span style={{fontSize:10,color:"#9ca3af",marginLeft:4}}>(×Rp50rb/hari)</span>}
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
                    onChange={e=>setV("pinjaman",Math.min(700000,Number(e.target.value)))}
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
  );
}

// ============================================================
// MAIN
// ============================================================
export default function Modul15_Penggajian({ user, globalData = {} }) {
  const {
    karyawanList = [],
    kasJurnal    = [], setKasJurnal = ()=>{},
    isReadOnly   = false,
  } = globalData;

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
    return k.nama && nama.toLowerCase().includes(q) || k.jabatan && jabatan.toLowerCase().includes(q);
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
