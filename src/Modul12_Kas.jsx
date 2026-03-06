import { useState, useEffect, useMemo } from "react";

// Safe math — no division operator in JSX
function safeDiv(a, b) { if (!b) return 0; return Math.round(a / b); }
function safePct(a, b) { if (!b) return 0; return Math.min(100, Math.round((a * 100) / b)); }

// ============================================================
// HELPERS
// ============================================================
function padD(n) { return String(n).padStart(2, "0"); }
function getTodayStr() {
  const d = new Date();
  return d.getFullYear() + "-" + padD(d.getMonth()+1) + "-" + padD(d.getDate());
}
const todayStr  = getTodayStr();
const thisMonth = todayStr.slice(0, 7);

function fmtRp(n) {
  if (n == null) return "—";
  return "Rp " + Number(n).toLocaleString("id-ID");
}
function fmtRpShort(n) {
  const v = Math.abs(Number(n) || 0);
  if (v >= 1000000) return "Rp " + safeDiv(v * 10, 10000000).toFixed(1) + "jt";
  if (v >= 1000)    return "Rp " + safeDiv(v, 1000) + "rb";
  return "Rp " + v;
}
function startsWith(str, prefix) {
  if (!str) return false;
  return str.slice(0, prefix.length) === prefix;
}

const KAT_MASUK  = ["Sewa Kamar","Denda Keterlambatan","Lain-lain"];
const KAT_KELUAR = ["Management Fee","Gaji & Insentif","Peralatan","Listrik/Internet/Air","Maintenance","Akomodasi/Op","Perlengkapan","THR","Prive/Dividen","Lain-lain"];

const SAKU_DEFAULT = [
  { kode:"A", nama:"Petty Cash",     pct:5,   flat:0,      color:"#f97316" },
  { kode:"B", nama:"General Saving", pct:23,  flat:0,      color:"#3b82f6" },
  { kode:"C", nama:"Internet",       pct:0,   flat:500000, color:"#06b6d4" },
  { kode:"D", nama:"Tax Saving",     pct:0.5, flat:0,      color:"#8b5cf6" },
  { kode:"E", nama:"Operasional",    pct:0,   flat:0,      color:"#22c55e" },
  { kode:"F", nama:"THR Saving",     pct:0,   flat:0,      color:"#eab308" },
];

// ============================================================
// STYLE CONSTANTS
// ============================================================
const W = {
  widget: { background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", overflow:"hidden" },
  whead:  { padding:"13px 16px 10px", borderBottom:"1px solid #f3f4f6", display:"flex", alignItems:"center", justifyContent:"space-between" },
  wtitle: { fontSize:12, fontWeight:700, color:"#111827", display:"flex", alignItems:"center", gap:6 },
  wbody:  { padding:"14px 16px" },
  card:   { background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", padding:"14px 16px", position:"relative", overflow:"hidden" },
  row:    { display:"flex", alignItems:"center", gap:12, padding:"10px 16px", borderBottom:"1px solid #f3f4f6" },
  empty:  { display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 16px", color:"#9ca3af", textAlign:"center", gap:8 },
  select: { padding:"6px 10px", borderRadius:8, border:"1.5px solid #e5e7eb", fontSize:12, color:"#374151", background:"#fff", outline:"none", fontFamily:"inherit", cursor:"pointer" },
  input:  { width:"100%", padding:"8px 11px", borderRadius:8, border:"1.5px solid #e5e7eb", fontSize:12, fontFamily:"inherit", color:"#1f2937", outline:"none", background:"#fff", boxSizing:"border-box" },
  overlay:{ position:"fixed", inset:0, background:"rgba(17,24,39,.65)", zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:16 },
  modal:  { background:"#fff", borderRadius:16, width:"100%", maxWidth:500, maxHeight:"88vh", overflowY:"auto", boxShadow:"0 24px 64px rgba(0,0,0,.18)" },
};

function Btn(props) {
  const bg  = props.primary ? "linear-gradient(135deg,#f97316,#ea580c)" : props.success ? "linear-gradient(135deg,#16a34a,#15803d)" : "#f3f4f6";
  const clr = (props.primary || props.success) ? "#fff" : "#4b5563";
  return (
    <button
      disabled={props.disabled}
      onClick={props.onClick}
      style={{display:"flex",alignItems:"center",justifyContent:"center",gap:5,padding:props.small?"6px 14px":"9px 14px",borderRadius:8,fontSize:12,fontWeight:600,border:"none",cursor:props.disabled?"not-allowed":"pointer",fontFamily:"inherit",background:bg,color:clr,opacity:props.disabled?0.4:1}}
    >
      {props.children}
    </button>
  );
}

function Field(props) {
  return (
    <div style={{marginBottom:12}}>
      <label style={{fontSize:11,fontWeight:600,color:"#374151",marginBottom:5,display:"block"}}>{props.label}</label>
      {props.children}
    </div>
  );
}

// ============================================================
// MODAL TRANSAKSI
// ============================================================
function ModalTransaksi(props) {
  const { onClose, onSave, rekeningList } = props;
  const [form, setForm] = useState({
    tipe:"pemasukan", tanggal:todayStr, keterangan:"", kategori:"", nominal:"", catatan:"",
    rekening: rekeningList.length > 0 ? rekeningList[0].id : "",
  });
  function set(k, v) { setForm(function(p) { return Object.assign({}, p, {[k]:v}); }); }

  const katList = form.tipe === "pemasukan" ? KAT_MASUK : KAT_KELUAR;
  const valid   = form.keterangan && form.kategori && Number(form.nominal) > 0;
  const nomStr  = fmtRpShort(Number(form.nominal));

  return (
    <div style={W.overlay} onClick={onClose}>
      <div style={W.modal} onClick={function(e) { e.stopPropagation(); }}>
        <div style={{padding:"15px 20px 12px", borderBottom:"1px solid #f3f4f6", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, background:"#fff"}}>
          <span style={{fontSize:14,fontWeight:700,color:"#111827"}}>Tambah Transaksi</span>
          <button onClick={onClose} style={{width:28,height:28,borderRadius:7,background:"#f3f4f6",border:"none",cursor:"pointer",fontSize:14,color:"#6b7280"}}>✕</button>
        </div>
        <div style={{padding:"16px 20px"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
            {[
              {val:"pemasukan",  icon:"⬆️", label:"Pemasukan",  activeColor:"#16a34a", activeBg:"#f0fdf4", activeBd:"#16a34a"},
              {val:"pengeluaran",icon:"⬇️", label:"Pengeluaran",activeColor:"#dc2626", activeBg:"#fee2e2", activeBd:"#dc2626"},
            ].map(function(t) {
              const isAct = form.tipe === t.val;
              return (
                <div key={t.val} onClick={function() { set("tipe", t.val); set("kategori", ""); }}
                  style={{padding:10,borderRadius:10,border:"1.5px solid "+(isAct?t.activeBd:"#e5e7eb"),cursor:"pointer",textAlign:"center",background:isAct?t.activeBg:"#fff"}}
                >
                  <div style={{fontSize:20,marginBottom:4}}>{t.icon}</div>
                  <div style={{fontSize:12,fontWeight:600,color:isAct?t.activeColor:"#6b7280"}}>{t.label}</div>
                </div>
              );
            })}
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <Field label="Tanggal">
              <input type="date" style={W.input} value={form.tanggal} onChange={function(e) { set("tanggal", e.target.value); }} />
            </Field>
            <Field label="Kategori">
              <select style={W.input} value={form.kategori} onChange={function(e) { set("kategori", e.target.value); }}>
                <option value="">Pilih kategori</option>
                {katList.map(function(k) { return <option key={k} value={k}>{k}</option>; })}
              </select>
            </Field>
          </div>

          <Field label="Keterangan">
            <input style={W.input} placeholder="Deskripsi transaksi..." value={form.keterangan} onChange={function(e) { set("keterangan", e.target.value); }} />
          </Field>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <Field label="Nominal (Rp)">
              <input type="number" style={W.input} placeholder="0" value={form.nominal} onChange={function(e) { set("nominal", e.target.value); }} />
            </Field>
            <Field label="Rekening">
              <select style={W.input} value={form.rekening} onChange={function(e) { set("rekening", e.target.value); }}>
                {rekeningList.length === 0 && <option value="">Kas Umum</option>}
                {rekeningList.map(function(r) { return <option key={r.id} value={r.id}>{r.bank} - {r.nama}</option>; })}
              </select>
            </Field>
          </div>

          <Field label="Catatan (opsional)">
            <textarea style={Object.assign({}, W.input, {resize:"none"})} rows={2} placeholder="Nomor bukti, referensi..." value={form.catatan} onChange={function(e) { set("catatan", e.target.value); }} />
          </Field>

          {form.keterangan && Number(form.nominal) > 0 && (
            <div style={{background:"#f9fafb",borderRadius:10,padding:"10px 14px",fontSize:11}}>
              <div style={{fontSize:10,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:.8,marginBottom:8}}>Preview Jurnal</div>
              {form.tipe === "pemasukan" ? (
                <div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 80px 80px",gap:4,padding:"4px 0",borderBottom:"1px solid #e5e7eb"}}>
                    <span style={{color:"#374151"}}>{"Kas / Bank"}</span>
                    <span style={{textAlign:"right",fontWeight:600,color:"#16a34a",fontFamily:"monospace"}}>{nomStr}</span>
                    <span style={{textAlign:"right",color:"#9ca3af"}}>—</span>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 80px 80px",gap:4,padding:"4px 0"}}>
                    <span style={{color:"#374151",paddingLeft:12}}>{form.kategori || "Pendapatan"}</span>
                    <span style={{textAlign:"right",color:"#9ca3af"}}>—</span>
                    <span style={{textAlign:"right",fontWeight:600,color:"#16a34a",fontFamily:"monospace"}}>{nomStr}</span>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 80px 80px",gap:4,padding:"4px 0",borderBottom:"1px solid #e5e7eb"}}>
                    <span style={{color:"#374151"}}>{form.kategori || "Beban"}</span>
                    <span style={{textAlign:"right",fontWeight:600,color:"#dc2626",fontFamily:"monospace"}}>{nomStr}</span>
                    <span style={{textAlign:"right",color:"#9ca3af"}}>—</span>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 80px 80px",gap:4,padding:"4px 0"}}>
                    <span style={{color:"#374151",paddingLeft:12}}>{"Kas / Bank"}</span>
                    <span style={{textAlign:"right",color:"#9ca3af"}}>—</span>
                    <span style={{textAlign:"right",fontWeight:600,color:"#dc2626",fontFamily:"monospace"}}>{nomStr}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div style={{padding:"12px 20px",borderTop:"1px solid #f3f4f6",display:"flex",gap:8}}>
          <Btn primary disabled={!valid} onClick={function() { onSave(Object.assign({}, form, {id:Date.now(),nominal:Number(form.nominal)})); onClose(); }}>
            Simpan Transaksi
          </Btn>
          <Btn onClick={onClose}>Batal</Btn>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MODAL ASET
// ============================================================
function ModalAset(props) {
  const { onClose, onSave } = props;
  const [form, setForm] = useState({ nama:"", nilaiPerolehan:"", umurEkonomis:"5", tanggalBeli:todayStr });
  function set(k, v) { setForm(function(p) { return Object.assign({}, p, {[k]:v}); }); }

  const nilaiNum = Number(form.nilaiPerolehan) || 0;
  const umurNum  = Number(form.umurEkonomis)   || 1;
  const depPerBulan = nilaiNum > 0 ? safeDiv(nilaiNum, umurNum * 12) : 0;
  const valid = form.nama && nilaiNum > 0;

  return (
    <div style={W.overlay} onClick={onClose}>
      <div style={Object.assign({}, W.modal, {maxWidth:420})} onClick={function(e) { e.stopPropagation(); }}>
        <div style={{padding:"15px 20px 12px",borderBottom:"1px solid #f3f4f6",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,background:"#fff"}}>
          <span style={{fontSize:14,fontWeight:700}}>Tambah Aset</span>
          <button onClick={onClose} style={{width:28,height:28,borderRadius:7,background:"#f3f4f6",border:"none",cursor:"pointer",fontSize:14,color:"#6b7280"}}>✕</button>
        </div>
        <div style={{padding:"16px 20px"}}>
          <Field label="Nama Aset">
            <input style={W.input} placeholder="Contoh: AC Kamar 1, Kursi Kantor..." value={form.nama} onChange={function(e) { set("nama", e.target.value); }} />
          </Field>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <Field label="Nilai Perolehan (Rp)">
              <input type="number" style={W.input} placeholder="0" value={form.nilaiPerolehan} onChange={function(e) { set("nilaiPerolehan", e.target.value); }} />
            </Field>
            <Field label="Umur Ekonomis">
              <select style={W.input} value={form.umurEkonomis} onChange={function(e) { set("umurEkonomis", e.target.value); }}>
                {[1,2,3,4,5,8,10,15,20].map(function(y) { return <option key={y} value={y}>{y} tahun</option>; })}
              </select>
            </Field>
          </div>
          <Field label="Tanggal Perolehan">
            <input type="date" style={W.input} value={form.tanggalBeli} onChange={function(e) { set("tanggalBeli", e.target.value); }} />
          </Field>
          {depPerBulan > 0 && (
            <div style={{background:"#fff7ed",border:"1px solid #fed7aa",borderRadius:8,padding:"10px 12px",fontSize:12}}>
              <div style={{color:"#9a3412",fontWeight:600,marginBottom:4}}>Estimasi Depresiasi</div>
              <div style={{display:"flex",gap:16}}>
                <div><span style={{color:"#9ca3af"}}>Per bulan: </span><b style={{color:"#ea580c"}}>{fmtRp(depPerBulan)}</b></div>
                <div><span style={{color:"#9ca3af"}}>Per tahun: </span><b style={{color:"#ea580c"}}>{fmtRp(depPerBulan * 12)}</b></div>
              </div>
            </div>
          )}
        </div>
        <div style={{padding:"12px 20px",borderTop:"1px solid #f3f4f6",display:"flex",gap:8}}>
          <Btn primary disabled={!valid} onClick={function() { onSave(Object.assign({}, form, {id:Date.now(),nilaiPerolehan:nilaiNum,depPerBulan:depPerBulan})); onClose(); }}>
            Simpan Aset
          </Btn>
          <Btn onClick={onClose}>Batal</Btn>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// TAB: JURNAL
// ============================================================
function TabJurnal(props) {
  const { kasJurnal, setKasJurnal, rekeningList } = props;
  const [search,    setSearch]  = useState("");
  const [filterTipe,setFT]      = useState("all");
  const [filterBln, setFB]      = useState(thisMonth);
  const [showModal, setShow]    = useState(false);

  const filtered = kasJurnal.filter(function(t) {
    if (filterTipe !== "all" && t.tipe !== filterTipe) return false;
    if (filterBln  !== "all" && !startsWith(t.tanggal, filterBln)) return false;
    if (search) {
      const q = search.toLowerCase();
      const inKet = t.keterangan && t.keterangan.toLowerCase().indexOf(q) >= 0;
      const inKat = t.kategori   && t.kategori.toLowerCase().indexOf(q) >= 0;
      return inKet || inKat;
    }
    return true;
  }).slice().sort(function(a, b) {
    if (!a.tanggal) return 1;
    if (!b.tanggal) return -1;
    return b.tanggal > a.tanggal ? 1 : -1;
  });

  const totalIn  = filtered.filter(function(t) { return t.tipe === "pemasukan"; }).reduce(function(s,t) { return s+t.nominal; }, 0);
  const totalOut = filtered.filter(function(t) { return t.tipe === "pengeluaran"; }).reduce(function(s,t) { return s+t.nominal; }, 0);
  const net      = totalIn - totalOut;

  const bulanOptions = [];
  const seen = {};
  kasJurnal.forEach(function(t) {
    const m = t.tanggal ? t.tanggal.slice(0,7) : null;
    if (m && !seen[m]) { seen[m] = true; bulanOptions.push(m); }
  });
  bulanOptions.sort().reverse();

  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:14}}>
      <div style={W.widget}>
        <div style={W.whead}>
          <div style={W.wtitle}>Jurnal Transaksi</div>
          <div style={{display:"flex",gap:8}}>
            <Btn small onClick={function() { alert("Export CSV coming soon"); }}>Export</Btn>
            <Btn small primary onClick={function() { setShow(true); }}>+ Tambah</Btn>
          </div>
        </div>

        <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",borderBottom:"1px solid #f3f4f6",flexWrap:"wrap"}}>
          <div style={{display:"flex",alignItems:"center",gap:7,background:"#f9fafb",border:"1.5px solid #e5e7eb",borderRadius:8,padding:"6px 11px",flex:1,maxWidth:220}}>
            <span>🔍</span>
            <input placeholder="Cari keterangan..." value={search} onChange={function(e) { setSearch(e.target.value); }} style={{border:"none",outline:"none",background:"transparent",fontSize:12,color:"#1f2937",width:"100%",fontFamily:"inherit"}} />
          </div>
          <select style={W.select} value={filterTipe} onChange={function(e) { setFT(e.target.value); }}>
            <option value="all">Semua Tipe</option>
            <option value="pemasukan">Pemasukan</option>
            <option value="pengeluaran">Pengeluaran</option>
          </select>
          <select style={W.select} value={filterBln} onChange={function(e) { setFB(e.target.value); }}>
            <option value="all">Semua Bulan</option>
            {bulanOptions.map(function(b) { return <option key={b} value={b}>{b}</option>; })}
          </select>
        </div>

        <div style={{display:"flex",borderBottom:"1px solid #f3f4f6"}}>
          {[
            {label:"Pemasukan",  val:fmtRp(totalIn),  color:"#16a34a", bg:"#f0fdf4"},
            {label:"Pengeluaran",val:fmtRp(totalOut), color:"#dc2626", bg:"#fff5f5"},
            {label:"Net",        val:fmtRp(net),      color:net>=0?"#16a34a":"#dc2626", bg:"#f9fafb"},
          ].map(function(s, i) {
            return (
              <div key={i} style={{flex:1,padding:"10px 16px",background:s.bg,borderRight:i<2?"1px solid #f3f4f6":"none"}}>
                <div style={{fontSize:9,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:.8,marginBottom:2}}>{s.label}</div>
                <div style={{fontSize:13,fontWeight:700,color:s.color,fontFamily:"monospace"}}>{s.val}</div>
              </div>
            );
          })}
        </div>

        {kasJurnal.length === 0 ? (
          <div style={W.empty}>
            <div style={{fontSize:32,opacity:.4}}>📒</div>
            <div style={{fontSize:13,fontWeight:600,color:"#374151"}}>Belum ada transaksi</div>
            <div style={{fontSize:11,color:"#9ca3af"}}>Tambah transaksi manual atau konfirmasi tagihan</div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={W.empty}><div style={{fontSize:32,opacity:.4}}>🔍</div><div>Tidak ditemukan</div></div>
        ) : filtered.map(function(t) {
          const isMasuk = t.tipe === "pemasukan";
          return (
            <div key={t.id} style={W.row}>
              <div style={{width:34,height:34,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0,background:isMasuk?"#f0fdf4":"#fee2e2"}}>
                {isMasuk ? "⬆️" : "⬇️"}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12,fontWeight:500,color:"#1f2937"}}>{t.keterangan}</div>
                <div style={{fontSize:10,color:"#9ca3af",marginTop:2}}>{t.kategori}{t.catatan ? " - " + t.catatan : ""}</div>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{fontSize:13,fontWeight:700,fontFamily:"monospace",color:isMasuk?"#16a34a":"#dc2626"}}>
                  {isMasuk ? "+" : "-"}{fmtRp(t.nominal)}
                </div>
                <div style={{fontSize:10,color:"#9ca3af",marginTop:2}}>{t.tanggal}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        <div style={W.widget}>
          <div style={W.whead}><div style={W.wtitle}>Rekening</div></div>
          <div style={W.wbody}>
            {rekeningList.length === 0 ? (
              <div style={{fontSize:12,color:"#9ca3af",textAlign:"center",padding:"16px 0"}}>Rekening diatur di Profil Kost</div>
            ) : rekeningList.map(function(r) {
              return (
                <div key={r.id} style={{background:"linear-gradient(135deg,#1e293b,#374151)",borderRadius:12,padding:16,color:"#fff",marginBottom:10}}>
                  <div style={{fontSize:11,color:"#94a3b8",fontWeight:600,textTransform:"uppercase",letterSpacing:.8,marginBottom:4}}>{r.bank}</div>
                  <div style={{fontSize:14,fontWeight:700,marginBottom:8}}>{r.nama}</div>
                  <div style={{fontSize:13,fontFamily:"monospace",letterSpacing:2,color:"#e2e8f0"}}>{r.noRekening}</div>
                  <div style={{fontSize:18,fontWeight:800,color:"#f97316",marginTop:10,fontFamily:"monospace"}}>{fmtRp(r.saldo||0)}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={W.widget}>
          <div style={W.whead}><div style={W.wtitle}>Bulan {thisMonth}</div></div>
          <div style={{padding:"8px 16px"}}>
            {[
              {k:"Pemasukan",   color:"#16a34a", tipe:"pemasukan"},
              {k:"Pengeluaran", color:"#dc2626", tipe:"pengeluaran"},
            ].map(function(r, i) {
              const val = kasJurnal.filter(function(t) { return t.tipe===r.tipe && startsWith(t.tanggal,thisMonth); }).reduce(function(s,t) { return s+t.nominal; }, 0);
              return (
                <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #f3f4f6"}}>
                  <span style={{fontSize:11,color:"#6b7280"}}>{r.k}</span>
                  <span style={{fontSize:12,fontWeight:700,color:r.color,fontFamily:"monospace"}}>{fmtRp(val)}</span>
                </div>
              );
            })}
            {(function() {
              const inVal  = kasJurnal.filter(function(t) { return t.tipe==="pemasukan"   && startsWith(t.tanggal,thisMonth); }).reduce(function(s,t){return s+t.nominal;},0);
              const outVal = kasJurnal.filter(function(t) { return t.tipe==="pengeluaran" && startsWith(t.tanggal,thisMonth); }).reduce(function(s,t){return s+t.nominal;},0);
              const netVal = inVal - outVal;
              return (
                <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0"}}>
                  <span style={{fontSize:11,color:"#6b7280"}}>Net Cashflow</span>
                  <span style={{fontSize:12,fontWeight:700,color:netVal>=0?"#16a34a":"#dc2626",fontFamily:"monospace"}}>{fmtRp(netVal)}</span>
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {showModal && <ModalTransaksi onClose={function() { setShow(false); }} onSave={function(t) { setKasJurnal(function(p) { return p.concat([t]); }); }} rekeningList={rekeningList} />}
    </div>
  );
}

// ============================================================
// TAB: BUDGET PLANNING
// ============================================================
function TabBudget(props) {
  const { kasJurnal } = props;

  const totalPemasukan = kasJurnal.filter(function(t) { return t.tipe==="pemasukan" && startsWith(t.tanggal,thisMonth); }).reduce(function(s,t){return s+t.nominal;},0);

  const saku = SAKU_DEFAULT.map(function(s) {
    const alokasi = s.flat > 0 ? s.flat : safeDiv(totalPemasukan * s.pct, 100);
    const KAT_A = ["Perlengkapan","Akomodasi/Op","Lain-lain"];
    const KAT_E = ["Gaji & Insentif","Listrik/Internet/Air","Maintenance","Peralatan","Management Fee"];
    const terpakai = s.kode === "A"
      ? kasJurnal.filter(function(t) { return t.tipe==="pengeluaran" && startsWith(t.tanggal,thisMonth) && KAT_A.indexOf(t.kategori)>=0; }).reduce(function(x,t){return x+t.nominal;},0)
      : s.kode === "E"
      ? kasJurnal.filter(function(t) { return t.tipe==="pengeluaran" && startsWith(t.tanggal,thisMonth) && KAT_E.indexOf(t.kategori)>=0; }).reduce(function(x,t){return x+t.nominal;},0)
      : 0;
    const pct_used = alokasi > 0 ? safePct(terpakai, alokasi) : 0;
    return Object.assign({}, s, { alokasi:alokasi, terpakai:terpakai, pct_used:pct_used });
  });

  const totalAlokasi  = saku.reduce(function(s,k){return s+k.alokasi;},0);
  const surplus       = totalPemasukan - totalAlokasi;

  const breakdown = KAT_KELUAR.map(function(kat) {
    const total = kasJurnal.filter(function(t) { return t.tipe==="pengeluaran" && startsWith(t.tanggal,thisMonth) && t.kategori===kat; }).reduce(function(s,t){return s+t.nominal;},0);
    const pct   = totalAlokasi > 0 ? safePct(total, totalAlokasi) : 0;
    return { kat:kat, total:total, pct:pct };
  }).filter(function(x) { return x.total > 0; });

  return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={W.widget}>
        <div style={W.whead}>
          <div style={W.wtitle}>Budget Planning — {thisMonth}</div>
          <span style={{fontSize:11,color:"#9ca3af"}}>Cash basis</span>
        </div>
        <div style={W.wbody}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:16}}>
            {[
              {k:"Total Pemasukan", v:fmtRp(totalPemasukan), c:"#16a34a"},
              {k:"Total Alokasi",   v:fmtRp(totalAlokasi),   c:"#f97316"},
              {k:"Surplus",         v:fmtRp(surplus),         c:surplus>=0?"#16a34a":"#dc2626"},
            ].map(function(r, i) {
              return (
                <div key={i} style={{background:"#f9fafb",borderRadius:10,padding:"12px 14px"}}>
                  <div style={{fontSize:10,color:"#9ca3af",fontWeight:600,textTransform:"uppercase",letterSpacing:.8,marginBottom:4}}>{r.k}</div>
                  <div style={{fontSize:16,fontWeight:700,color:r.c,fontFamily:"monospace"}}>{r.v}</div>
                </div>
              );
            })}
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {saku.map(function(s) {
              const barColor = s.pct_used > 90 ? "#ef4444" : s.pct_used > 70 ? "#f97316" : s.color;
              const pctLabel = s.flat > 0 ? fmtRpShort(s.flat) + " flat" : s.pct + "%";
              return (
                <div key={s.kode} style={{background:"#f9fafb",borderRadius:10,padding:"12px 14px",border:"1px solid #e5e7eb"}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <span style={{fontSize:10,fontWeight:700,color:s.color,background:s.color+"22",padding:"1px 6px",borderRadius:4}}>{s.kode}</span>
                      <span style={{fontSize:12,fontWeight:600,color:"#1f2937"}}>{s.nama}</span>
                    </div>
                    <span style={{fontSize:10,color:"#f97316",fontWeight:700}}>{pctLabel}</span>
                  </div>
                  <div style={{height:6,background:"#e5e7eb",borderRadius:3,overflow:"hidden",marginBottom:6}}>
                    <div style={{height:"100%",width:s.pct_used+"%",borderRadius:3,background:barColor,transition:"width .4s"}} />
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:10}}>
                    <span style={{color:"#374151",fontWeight:600,fontFamily:"monospace"}}>{fmtRp(s.terpakai)}</span>
                    <span style={{color:"#9ca3af",fontFamily:"monospace"}}>dari {fmtRp(s.alokasi)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={W.widget}>
        <div style={W.whead}><div style={W.wtitle}>Breakdown Pengeluaran {thisMonth}</div></div>
        <div style={W.wbody}>
          {breakdown.length === 0 ? (
            <div style={{textAlign:"center",color:"#9ca3af",padding:"20px 0",fontSize:12}}>Belum ada pengeluaran bulan ini</div>
          ) : breakdown.map(function(item) {
            return (
              <div key={item.kat} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid #f3f4f6"}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                    <span style={{fontSize:12,fontWeight:500,color:"#374151"}}>{item.kat}</span>
                    <span style={{fontSize:12,fontWeight:700,color:"#dc2626",fontFamily:"monospace"}}>{fmtRp(item.total)}</span>
                  </div>
                  <div style={{height:4,background:"#f3f4f6",borderRadius:2,overflow:"hidden"}}>
                    <div style={{height:"100%",width:item.pct+"%",background:"#f97316",borderRadius:2}} />
                  </div>
                </div>
                <span style={{fontSize:10,color:"#9ca3af",width:30,textAlign:"right"}}>{item.pct}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// TAB: ASET & DEPRESIASI
// ============================================================
function TabAset(props) {
  const { asetList, setAsetList } = props;
  const [showModal, setShow] = useState(false);

  function nilaiSekarang(aset) {
    const ms = new Date() - new Date(aset.tanggalBeli);
    const msPerBulan = 1000 * 60 * 60 * 24 * 30;
    const bulanBerlalu = Math.floor(safeDiv(ms, msPerBulan));
    return Math.max(0, aset.nilaiPerolehan - aset.depPerBulan * bulanBerlalu);
  }

  const totalNilai  = asetList.reduce(function(s,a){return s+a.nilaiPerolehan;},0);
  const totalDepBln = asetList.reduce(function(s,a){return s+a.depPerBulan;},0);
  const totalBuku   = asetList.reduce(function(s,a){return s+nilaiSekarang(a);},0);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
        {[
          {k:"Total Aset",    v:fmtRp(totalNilai),  c:"#3b82f6"},
          {k:"Dep per Bulan", v:fmtRp(totalDepBln), c:"#f97316"},
          {k:"Nilai Buku",    v:fmtRp(totalBuku),   c:"#16a34a"},
        ].map(function(r, i) {
          return (
            <div key={i} style={W.card}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:r.c}} />
              <div style={{fontSize:10,fontWeight:500,color:"#9ca3af",textTransform:"uppercase",letterSpacing:.8,marginBottom:4,marginTop:8}}>{r.k}</div>
              <div style={{fontSize:16,fontWeight:700,color:r.c,fontFamily:"monospace"}}>{r.v}</div>
            </div>
          );
        })}
      </div>

      <div style={W.widget}>
        <div style={W.whead}>
          <div style={W.wtitle}>Daftar Aset</div>
          <Btn small primary onClick={function() { setShow(true); }}>+ Tambah Aset</Btn>
        </div>
        <div>
          {asetList.length === 0 ? (
            <div style={W.empty}>
              <div style={{fontSize:32,opacity:.4}}>🏷️</div>
              <div style={{fontSize:13,fontWeight:600,color:"#374151"}}>Belum ada aset</div>
              <div style={{fontSize:11,color:"#9ca3af"}}>Tambah aset untuk tracking depresiasi otomatis</div>
            </div>
          ) : asetList.map(function(a) {
            const nb  = nilaiSekarang(a);
            const pct = safePct(nb, a.nilaiPerolehan);
            const barColor = pct > 50 ? "#3b82f6" : pct > 25 ? "#f97316" : "#ef4444";
            return (
              <div key={a.id} style={{padding:"12px 16px",borderBottom:"1px solid #f3f4f6"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                  <div>
                    <div style={{fontSize:13,fontWeight:600,color:"#1f2937"}}>{a.nama}</div>
                    <div style={{fontSize:10,color:"#9ca3af",marginTop:1}}>Dibeli: {a.tanggalBeli} — Umur: {a.umurEkonomis} thn</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:13,fontWeight:700,color:"#3b82f6",fontFamily:"monospace"}}>{fmtRp(nb)}</div>
                    <div style={{fontSize:10,color:"#9ca3af"}}>Nilai buku ({pct}%)</div>
                  </div>
                </div>
                <div style={{height:5,background:"#f3f4f6",borderRadius:3,overflow:"hidden",marginBottom:4}}>
                  <div style={{height:"100%",width:pct+"%",background:barColor,borderRadius:3,transition:"width .4s"}} />
                </div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"#9ca3af"}}>
                  <span>Harga beli: {fmtRp(a.nilaiPerolehan)}</span>
                  <span>{"Dep/bln"}: {fmtRp(a.depPerBulan)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showModal && <ModalAset onClose={function() { setShow(false); }} onSave={function(a) { setAsetList(function(p) { return p.concat([a]); }); setShow(false); }} />}
    </div>
  );
}

// ============================================================
// MAIN EXPORT
// ============================================================
export default function Modul12_Kas({ user, globalData={} }) {
  const {
    kasJurnal   = [], setKasJurnal   = function(){},
    tagihanList = [],
  } = globalData;

  const [activeTab, setActiveTab] = useState("jurnal");
  const [asetList,  setAsetList]  = useState([]);

  const rekeningList = [];

  const inBln  = kasJurnal.filter(function(t) { return t.tipe==="pemasukan"   && startsWith(t.tanggal,thisMonth); }).reduce(function(s,t){return s+t.nominal;},0);
  const outBln = kasJurnal.filter(function(t) { return t.tipe==="pengeluaran" && startsWith(t.tanggal,thisMonth); }).reduce(function(s,t){return s+t.nominal;},0);
  const piutang= tagihanList.filter(function(t) { return t.status !== "lunas"; }).reduce(function(s,t){return s+t.nominal;},0);

  const CARDS = [
    {label:"Pemasukan",       val:fmtRp(inBln),          color:"#16a34a", sub:kasJurnal.filter(function(t){return t.tipe==="pemasukan"&&startsWith(t.tanggal,thisMonth);}).length+" transaksi"},
    {label:"Pengeluaran",     val:fmtRp(outBln),         color:"#dc2626", sub:kasJurnal.filter(function(t){return t.tipe==="pengeluaran"&&startsWith(t.tanggal,thisMonth);}).length+" transaksi"},
    {label:"Net Cashflow",    val:fmtRp(inBln - outBln), color:inBln-outBln>=0?"#16a34a":"#dc2626", sub:"Bulan berjalan"},
    {label:"Piutang",         val:fmtRp(piutang),        color:"#f97316", sub:tagihanList.filter(function(t){return t.status!=="lunas";}).length+" belum lunas"},
  ];

  return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
        {CARDS.map(function(c, i) {
          return (
            <div key={i} style={W.card}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:c.color}} />
              <div style={{fontSize:10,fontWeight:500,color:"#9ca3af",textTransform:"uppercase",letterSpacing:.8,marginBottom:4,marginTop:8}}>{c.label}</div>
              <div style={{fontSize:16,fontWeight:700,color:c.color,fontFamily:"monospace"}}>{c.val}</div>
              <div style={{fontSize:11,color:"#6b7280",marginTop:3}}>{c.sub}</div>
            </div>
          );
        })}
      </div>

      <div style={{display:"flex",gap:2,background:"#fff",borderRadius:12,border:"1px solid #e5e7eb",padding:5}}>
        {[
          {id:"jurnal", label:"Jurnal Transaksi"},
          {id:"budget", label:"Budget Planning"},
          {id:"aset",   label:"Aset & Depresiasi"},
        ].map(function(t) {
          const isAct = activeTab === t.id;
          return (
            <div key={t.id}
              style={{flex:1,padding:"8px 12px",fontSize:12,fontWeight:600,color:isAct?"#fff":"#9ca3af",cursor:"pointer",borderRadius:8,textAlign:"center",background:isAct?"linear-gradient(135deg,#f97316,#ea580c)":"transparent"}}
              onClick={function() { setActiveTab(t.id); }}
            >
              {t.label}
            </div>
          );
        })}
      </div>

      {activeTab === "jurnal" && <TabJurnal kasJurnal={kasJurnal} setKasJurnal={setKasJurnal} rekeningList={rekeningList} />}
      {activeTab === "budget" && <TabBudget kasJurnal={kasJurnal} />}
      {activeTab === "aset"   && <TabAset   asetList={asetList}   setAsetList={setAsetList} />}

    </div>
  );
}
