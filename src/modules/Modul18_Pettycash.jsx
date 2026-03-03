import { useState, useEffect } from "react";

// ============================================================
// MOCK DATA
// ============================================================
const STAFF_LIST = [];

const KATEGORI_LIST = [
  { id:"chemical",   label:"Chemical",          icon:"🧴", warna:"#0891b2", bg:"#cffafe" },
  { id:"trashbag",   label:"Trash Bag",          icon:"🗑️", warna:"#64748b", bg:"#f1f5f9" },
  { id:"kebersihan", label:"Alat Kebersihan",    icon:"🧹", warna:"#16a34a", bg:"#dcfce7" },
  { id:"listrik",    label:"Lampu & Listrik",    icon:"💡", warna:"#d97706", bg:"#fef3c7" },
  { id:"kamarmandi", label:"Perlengkapan KM",    icon:"🚿", warna:"#7c3aed", bg:"#ede9fe" },
  { id:"galon",      label:"Air Galon",          icon:"💧", warna:"#2563eb", bg:"#dbeafe" },
  { id:"tanaman",    label:"Tanaman & Pupuk",    icon:"🌱", warna:"#15803d", bg:"#dcfce7" },
  { id:"atk",        label:"ATK & Kantor",       icon:"📎", warna:"#9333ea", bg:"#f3e8ff" },
  { id:"lainnya",    label:"Lainnya",            icon:"📦", warna:"#94a3b8", bg:"#f8fafc" },
];

// Top-up history & belanja history
const TOPUP_INIT = [];

const BELANJA_INIT = [];

const PERIODE_LIST = ["Feb 2026","Jan 2026","Des 2025"];
const fmtRp  = (n) => "Rp " + Number(n||0).toLocaleString("id-ID");
const TODAY  = "2026-02-26";
const GRAD   = ["linear-gradient(135deg,#f97316,#ea580c)","linear-gradient(135deg,#0d9488,#0f766e)","linear-gradient(135deg,#1d4ed8,#1e40af)"];
const getInit = (n) => n.split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase();

// ============================================================
// CSS
// ============================================================
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  :root{--or:#f97316;--or-d:#ea580c;--or-pale:#fff7ed;--or-light:#ffedd5;--or-mid:#fed7aa;--s900:#0f172a;--s800:#1e293b;--s700:#334155;--s600:#475569;--s400:#94a3b8;--s200:#e2e8f0;--s100:#f1f5f9;--s50:#f8fafc;--white:#fff;--red:#dc2626;--green:#16a34a;--teal:#0d9488;--blue:#1d4ed8;--amber:#d97706}
  body{font-family:'Plus Jakarta Sans',sans-serif;background:var(--s50)}
  ::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-thumb{background:var(--s200);border-radius:4px}
  .topbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;flex-wrap:wrap;gap:10px}
  .tab-nav{display:flex;gap:4px;background:var(--white);border:1px solid var(--s200);border-radius:12px;padding:4px;margin-bottom:18px}
  .tab-btn{flex:1;padding:9px 8px;border-radius:9px;border:none;font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;font-weight:600;cursor:pointer;transition:all .15s;color:var(--s400);background:transparent;display:flex;align-items:center;justify-content:center;gap:6px}
  .tab-btn.active{background:linear-gradient(135deg,var(--or),var(--or-d));color:#fff;box-shadow:0 2px 10px rgba(249,115,22,.3)}
  .tab-btn:hover:not(.active){color:var(--s700);background:var(--s50)}
  .w{background:var(--white);border:1px solid var(--s200);border-radius:12px;overflow:hidden;margin-bottom:14px}
  .wh{padding:12px 16px;border-bottom:1px solid var(--s100);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px}
  .wh-title{font-size:13px;font-weight:800;color:var(--s800);display:flex;align-items:center;gap:7px}
  .wb{padding:16px}
  /* SALDO CARD */
  .saldo-main{background:linear-gradient(135deg,var(--s900),#1a0a00);border-radius:16px;padding:22px 24px;margin-bottom:16px;position:relative;overflow:hidden}
  .saldo-main::before{content:'';position:absolute;top:-40px;right:-40px;width:160px;height:160px;border-radius:50%;background:rgba(249,115,22,.08)}
  .saldo-main::after{content:'';position:absolute;bottom:-60px;left:-20px;width:200px;height:200px;border-radius:50%;background:rgba(249,115,22,.04)}
  /* STAT ROW */
  .stat-row{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:16px}
  .sc{background:var(--white);border:1px solid var(--s200);border-radius:12px;padding:12px 14px;border-top:3px solid transparent}
  .sc-label{font-size:9px;font-weight:700;color:var(--s400);text-transform:uppercase;letter-spacing:.7px;margin-bottom:4px}
  .sc-val{font-size:20px;font-weight:800;font-family:'JetBrains Mono',monospace}
  .sc-sub{font-size:10px;color:var(--s400);margin-top:3px}
  /* BELANJA ITEM */
  .bl-item{display:flex;gap:12px;padding:11px 14px;border-bottom:1px solid var(--s100);align-items:center;transition:background .1s}
  .bl-item:last-child{border-bottom:none}
  .bl-item:hover{background:var(--s50)}
  .bl-icon{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}
  .bl-item-name{font-size:13px;font-weight:600;color:var(--s800);margin-bottom:2px}
  .bl-meta{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
  /* BADGE */
  .badge{display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700;white-space:nowrap}
  /* STATUS BADGE */
  .status-verified{color:var(--green);background:#dcfce7}
  .status-pending{color:var(--amber);background:#fef3c7}
  .status-rejected{color:var(--red);background:#fee2e2}
  /* PROGRESS */
  .prog-wrap{height:8px;background:var(--s100);border-radius:4px;overflow:hidden}
  .prog-bar{height:100%;border-radius:4px;transition:width .5s cubic-bezier(.34,1.56,.64,1)}
  /* KATEGORI GRID */
  .kat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
  .kat-btn{padding:10px;border-radius:10px;border:2px solid var(--s200);background:var(--white);cursor:pointer;transition:all .12s;text-align:center;font-family:'Plus Jakarta Sans',sans-serif}
  .kat-btn.sel{border-width:2px}
  .kat-btn:hover:not(.sel){border-color:var(--s300);background:var(--s50)}
  /* FORM */
  .overlay{position:fixed;inset:0;background:rgba(15,23,42,.6);display:flex;align-items:center;justify-content:center;z-index:200;backdrop-filter:blur(3px)}
  .mc{background:var(--white);border-radius:16px;width:480px;max-height:90vh;overflow-y:auto;box-shadow:0 24px 60px rgba(0,0,0,.25);animation:popIn .2s cubic-bezier(.34,1.56,.64,1)}
  @keyframes popIn{from{transform:scale(.96) translateY(8px);opacity:0}to{transform:scale(1) translateY(0);opacity:1}}
  .mc-h{padding:16px 22px 12px;border-bottom:1px solid var(--s100);background:linear-gradient(135deg,var(--or-pale),var(--white))}
  .mc-b{padding:18px 22px}
  .mc-f{padding:12px 22px;border-top:1px solid var(--s100);display:flex;gap:8px;justify-content:flex-end}
  .fl{display:block;font-size:10px;font-weight:700;color:var(--s600);text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px}
  .fi{width:100%;background:var(--s50);border:1.5px solid var(--s200);border-radius:8px;padding:8px 12px;font-size:13px;color:var(--s800);font-family:'Plus Jakarta Sans',sans-serif;outline:none;transition:all .15s}
  .fi:focus{border-color:var(--or);background:var(--white)}
  .fmb{margin-bottom:12px}
  .frow{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px}
  /* BUTTONS */
  .btn-primary{background:linear-gradient(135deg,var(--or),var(--or-d));color:#fff;border:none;border-radius:8px;padding:9px 18px;font-size:13px;font-weight:700;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all .15s;box-shadow:0 2px 8px rgba(249,115,22,.25);display:inline-flex;align-items:center;gap:6px}
  .btn-primary:hover{filter:brightness(1.05)}
  .btn-ghost{background:var(--s100);color:var(--s700);border:1px solid var(--s200);border-radius:8px;padding:9px 14px;font-size:12px;font-weight:600;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all .15s;display:inline-flex;align-items:center;gap:6px}
  .btn-ghost:hover{background:var(--s200)}
  .btn-sm{padding:5px 11px!important;font-size:11px!important;border-radius:7px!important}
  .btn-xs{padding:3px 8px;font-size:10px;border-radius:6px}
  .btn-red{background:#fee2e2;color:var(--red);border:1px solid #fca5a5;border-radius:6px;padding:4px 10px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit}
  .btn-green{background:#dcfce7;color:var(--green);border:1px solid #86efac;border-radius:6px;padding:4px 10px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit}
  .btn-green:hover{background:var(--green);color:#fff}
  .toaster{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--s900);color:#fff;padding:10px 22px;border-radius:30px;font-size:13px;font-weight:600;z-index:999;box-shadow:0 8px 24px rgba(0,0,0,.3);animation:toastIn .25s ease;white-space:nowrap}
  @keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  .fade-up{animation:fadeUp .25s ease forwards}
  /* TOPUP ITEM */
  .tu-item{display:flex;gap:12px;padding:10px 14px;border-bottom:1px solid var(--s100);align-items:center}
  .tu-item:last-child{border-bottom:none}
  /* FILTER BAR */
  .filter-bar{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px}
  .filter-btn{padding:5px 12px;border-radius:20px;border:1.5px solid var(--s200);background:var(--white);font-size:11px;font-weight:600;cursor:pointer;color:var(--s600);transition:all .12s;font-family:inherit}
  .filter-btn.active{border-color:var(--or);background:var(--or-pale);color:var(--or-d)}
  /* FOTO UPLOAD */
  .foto-zone{border:2px dashed var(--s200);border-radius:10px;padding:16px;text-align:center;cursor:pointer;transition:all .15s}
  .foto-zone:hover{border-color:var(--or-mid);background:var(--or-pale)}
  .foto-zone.has-foto{border-color:var(--green);background:#f0fdf4}
`;

function StyleInjector() {
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = CSS;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);
  return null;
}

function Toast({ msg, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2600); return () => clearTimeout(t); }, []);
  return <div className="toaster">{msg}</div>;
}

function getKat(id) { return KATEGORI_LIST.find(k=>k.id===id) || KATEGORI_LIST[KATEGORI_LIST.length-1]; }

// ============================================================
// FORM INPUT BELANJA — MULTI-ITEM (1 nota banyak barang)
// ============================================================
const EMPTY_ITEM = () => ({ id: Date.now(), kategori:"", nama:"", nominal:"" });

function FormBelanja({ onSave, onClose, userRole }) {
  const [staffId,  setStaffId]  = useState(userRole==="staff" ? "EMP001" : "");
  const [tanggal,  setTanggal]  = useState(TODAY);
  const [foto,     setFoto]     = useState(false);
  const [ket,      setKet]      = useState("");
  const [items,    setItems]    = useState([EMPTY_ITEM()]);

  const setItem = (idx, k, v) => setItems(p => p.map((it,i) => i===idx ? {...it,[k]:v} : it));
  const addItem = () => setItems(p => [...p, EMPTY_ITEM()]);
  const delItem = (idx) => { if (items.length===1) return; setItems(p=>p.filter((_,i)=>i!==idx)); };

  const totalNominal = items.reduce((s,i) => s + (Number(i.nominal)||0), 0);
  const okItems  = items.every(i => i.kategori && i.nama.trim() && Number(i.nominal) > 0);
  const ok       = staffId && tanggal && okItems;

  const handleSave = () => {
    // Setiap item jadi entri belanja terpisah tapi dengan notaId yang sama
    const notaId = "NOTA-" + Date.now();
    const entries = items.map((it, idx) => ({
      id:         "B" + Date.now() + idx,
      notaId,
      tanggal,
      staffId,
      kategori:   it.kategori,
      item:       it.nama,
      nominal:    Number(it.nominal),
      keterangan: ket,
      foto:       idx === 0 ? foto : false, // foto hanya di item pertama (1 nota)
      status:     "pending",
      kasId:      null,
    }));
    onSave(entries, totalNominal, notaId);
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="mc" style={{ width:560 }} onClick={e=>e.stopPropagation()}>
        <div className="mc-h">
          <div style={{ fontSize:14, fontWeight:800, color:"var(--s900)", marginBottom:2 }}>🛒 Input Belanja Petty Cash</div>
          <div style={{ fontSize:12, color:"var(--s400)" }}>1 nota bisa banyak item — nominal wajib, foto opsional</div>
        </div>
        <div className="mc-b">
          {/* Header nota */}
          <div className="frow">
            <div>
              <label className="fl">Staff *</label>
              <select className="fi" value={staffId} onChange={e=>setStaffId(e.target.value)}>
                <option value="">— Pilih —</option>
                {STAFF_LIST.slice(0,2).map(s=><option key={s.id} value={s.id}>{s.nama.split(" ")[0]} ({s.shift})</option>)}
              </select>
            </div>
            <div>
              <label className="fl">Tanggal *</label>
              <input className="fi" type="date" value={tanggal} onChange={e=>setTanggal(e.target.value)} />
            </div>
          </div>

          {/* DAFTAR ITEM */}
          <div style={{ marginBottom:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
              <label className="fl" style={{ margin:0 }}>Daftar Barang * ({items.length} item)</label>
              <button className="btn-ghost btn-sm" onClick={addItem}>+ Tambah Item</button>
            </div>

            {/* Header kolom */}
            <div style={{ display:"grid", gridTemplateColumns:"130px 1fr 110px 28px", gap:6, marginBottom:4, padding:"0 4px" }}>
              {["Kategori","Nama Barang","Nominal (Rp)",""].map((h,i)=>(
                <div key={i} style={{ fontSize:9, fontWeight:700, color:"var(--s400)", textTransform:"uppercase", letterSpacing:.5 }}>{h}</div>
              ))}
            </div>

            {items.map((it, idx) => {
              const kat = it.kategori ? getKat(it.kategori) : null;
              return (
                <div key={it.id} style={{ display:"grid", gridTemplateColumns:"130px 1fr 110px 28px", gap:6, marginBottom:6, alignItems:"center" }}>
                  {/* Kategori dropdown */}
                  <select className="fi" style={{ padding:"7px 8px", fontSize:11 }}
                    value={it.kategori} onChange={e=>setItem(idx,"kategori",e.target.value)}>
                    <option value="">— Pilih —</option>
                    {KATEGORI_LIST.map(k=><option key={k.id} value={k.id}>{k.icon} {k.label}</option>)}
                  </select>
                  {/* Nama item */}
                  <input className="fi" style={{ padding:"7px 10px", fontSize:12 }}
                    placeholder="Nama barang / deskripsi..."
                    value={it.nama} onChange={e=>setItem(idx,"nama",e.target.value)} />
                  {/* Nominal */}
                  <input className="fi" type="number" step="1000" placeholder="0"
                    style={{ padding:"7px 8px", fontSize:12, fontFamily:"'JetBrains Mono',monospace", fontWeight:700, textAlign:"right" }}
                    value={it.nominal} onChange={e=>setItem(idx,"nominal",e.target.value)} />
                  {/* Hapus */}
                  <button onClick={()=>delItem(idx)} disabled={items.length===1}
                    style={{ width:24, height:24, borderRadius:6, border:"1px solid var(--s200)", background:"var(--s50)", cursor:items.length===1?"not-allowed":"pointer", color:"var(--s400)", fontSize:12, display:"flex", alignItems:"center", justifyContent:"center", opacity:items.length===1?.3:1 }}>×</button>
                </div>
              );
            })}

            {/* Total row */}
            <div style={{ display:"grid", gridTemplateColumns:"130px 1fr 110px 28px", gap:6, borderTop:"2px solid var(--s200)", paddingTop:8, marginTop:4 }}>
              <div />
              <div style={{ fontSize:12, fontWeight:700, color:"var(--s600)", display:"flex", alignItems:"center" }}>Total {items.length} item</div>
              <div style={{ fontSize:14, fontWeight:800, color:"var(--red)", fontFamily:"'JetBrains Mono',monospace", textAlign:"right" }}>{fmtRp(totalNominal)}</div>
              <div />
            </div>
          </div>

          {/* Keterangan & Foto */}
          <div className="frow">
            <div>
              <label className="fl">Keterangan Nota</label>
              <input className="fi" placeholder="Misal: Belanja ke Indomaret..." value={ket} onChange={e=>setKet(e.target.value)} />
            </div>
            <div>
              <label className="fl">Foto Nota / Struk</label>
              <div className={`foto-zone${foto?" has-foto":""}`} style={{ padding:"10px" }} onClick={()=>setFoto(!foto)}>
                {foto
                  ? <div style={{ fontSize:12, color:"var(--green)", fontWeight:700 }}>📸 Foto terlampir ✓</div>
                  : <div style={{ fontSize:11, color:"var(--s400)", textAlign:"center" }}>📷 Lampirkan foto<br/><span style={{ fontSize:10, color:"var(--s300)" }}>opsional</span></div>
                }
              </div>
            </div>
          </div>

          {/* Preview total */}
          {ok && totalNominal > 0 && (
            <div style={{ background:"linear-gradient(135deg,var(--s900),#1a0a00)", borderRadius:10, padding:"12px 14px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                <div>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,.35)", marginBottom:2 }}>
                    {STAFF_LIST.find(s=>s.id===staffId)?.nama.split(" ")[0]} · {tanggal} · {items.length} item
                  </div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,.5)" }}>
                    {items.filter(i=>i.kategori).map(i=>getKat(i.kategori).icon).join(" ")}
                  </div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,.35)", marginBottom:2 }}>Total Nota</div>
                  <div style={{ fontSize:22, fontWeight:800, color:"var(--red)", fontFamily:"'JetBrains Mono',monospace" }}>-{fmtRp(totalNominal)}</div>
                </div>
              </div>
              {/* Item list preview */}
              <div style={{ borderTop:"1px solid rgba(255,255,255,.1)", paddingTop:8 }}>
                {items.filter(i=>i.nama&&i.nominal).map((i,idx)=>(
                  <div key={idx} style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                    <span style={{ fontSize:11, color:"rgba(255,255,255,.5)" }}>{getKat(i.kategori).icon} {i.nama.slice(0,35)}</span>
                    <span style={{ fontSize:11, color:"rgba(255,255,255,.6)", fontFamily:"'JetBrains Mono',monospace" }}>{fmtRp(Number(i.nominal))}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="mc-f">
          <button className="btn-ghost" onClick={onClose}>Batal</button>
          <button className="btn-primary" disabled={!ok} style={{ opacity:ok?1:.5 }} onClick={handleSave}>
            ✓ Simpan {items.length} Item Belanja
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// FORM TOP-UP
// ============================================================
function FormTopup({ onSave, onClose }) {
  const [nominal,  setNominal]  = useState("");
  const [ket,      setKet]      = useState("Top-up petty cash operasional");
  const [tanggal,  setTanggal]  = useState(TODAY);
  const ok = nominal > 0 && ket.trim();

  return (
    <div className="overlay" onClick={onClose}>
      <div className="mc" style={{ width:400 }} onClick={e=>e.stopPropagation()}>
        <div className="mc-h">
          <div style={{ fontSize:14, fontWeight:800, color:"var(--s900)", marginBottom:2 }}>💰 Top-up Petty Cash</div>
          <div style={{ fontSize:12, color:"var(--s400)" }}>Tambah saldo kas operasional staff</div>
        </div>
        <div className="mc-b">
          <div className="fmb">
            <label className="fl">Tanggal</label>
            <input className="fi" type="date" value={tanggal} onChange={e=>setTanggal(e.target.value)} />
          </div>
          <div className="fmb">
            <label className="fl">Nominal Top-up (Rp) *</label>
            <input className="fi" type="number" step="100000" placeholder="0" value={nominal} onChange={e=>setNominal(Number(e.target.value))}
              style={{ fontFamily:"'JetBrains Mono',monospace", fontWeight:700, fontSize:18 }} />
            {/* Quick preset */}
            <div style={{ display:"flex", gap:6, marginTop:8, flexWrap:"wrap" }}>
              {[500000,1000000,1500000,2000000].map(n=>(
                <button key={n} onClick={()=>setNominal(n)}
                  style={{ padding:"4px 10px", borderRadius:7, border:`1.5px solid ${nominal===n?"var(--or)":"var(--s200)"}`, background:nominal===n?"var(--or-pale)":"var(--white)", color:nominal===n?"var(--or-d)":"var(--s600)", fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
                  {fmtRp(n)}
                </button>
              ))}
            </div>
          </div>
          <div className="fmb">
            <label className="fl">Keterangan *</label>
            <input className="fi" value={ket} onChange={e=>setKet(e.target.value)} />
          </div>
          {nominal > 0 && (
            <div style={{ background:"linear-gradient(135deg,#f0fdf4,#dcfce7)", border:"1px solid #86efac", borderRadius:10, padding:"12px 14px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:12, color:"var(--green)", fontWeight:700 }}>Tambah saldo</span>
              <span style={{ fontSize:20, fontWeight:800, color:"var(--green)", fontFamily:"'JetBrains Mono',monospace" }}>+{fmtRp(nominal)}</span>
            </div>
          )}
        </div>
        <div className="mc-f">
          <button className="btn-ghost" onClick={onClose}>Batal</button>
          <button className="btn-primary" disabled={!ok} style={{ opacity:ok?1:.5 }}
            onClick={()=>onSave({ id:"TU"+Date.now(), tanggal, nominal, keterangan:ket, adminId:"EMP003" })}>
            ✓ Top-up Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// FORM EDIT BELANJA PENDING
// ============================================================
function FormEditBelanja({ nota, onSave, onClose }) {
  // nota = array of belanja items dengan notaId sama
  const [items,  setItems]  = useState(nota.map(b=>({ id:b.id, kategori:b.kategori, nama:b.item, nominal:b.nominal })));
  const [ket,    setKet]    = useState(nota[0]?.keterangan || "");
  const [foto,   setFoto]   = useState(nota[0]?.foto || false);

  const setItem  = (idx,k,v) => setItems(p=>p.map((it,i)=>i===idx?{...it,[k]:v}:it));
  const addItem  = () => setItems(p=>[...p,{ id:"NEW_"+Date.now(), kategori:"", nama:"", nominal:"" }]);
  const delItem  = (idx) => { if(items.length===1) return; setItems(p=>p.filter((_,i)=>i!==idx)); };

  const total    = items.reduce((s,i)=>s+(Number(i.nominal)||0),0);
  const ok       = items.every(i=>i.kategori&&i.nama.trim()&&Number(i.nominal)>0);

  return (
    <div className="overlay" onClick={onClose}>
      <div className="mc" style={{ width:560 }} onClick={e=>e.stopPropagation()}>
        <div className="mc-h">
          <div style={{ fontSize:14, fontWeight:800, color:"var(--s900)", marginBottom:2 }}>✏️ Edit Belanja Pending</div>
          <div style={{ fontSize:12, color:"var(--amber)", fontWeight:600 }}>⏳ Belum diverifikasi — masih bisa diedit</div>
        </div>
        <div className="mc-b">
          {/* Header kolom */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
            <label className="fl" style={{ margin:0 }}>Daftar Barang ({items.length} item)</label>
            <button className="btn-ghost btn-sm" onClick={addItem}>+ Tambah Item</button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"130px 1fr 110px 28px", gap:6, marginBottom:4, padding:"0 4px" }}>
            {["Kategori","Nama Barang","Nominal (Rp)",""].map((h,i)=>(
              <div key={i} style={{ fontSize:9, fontWeight:700, color:"var(--s400)", textTransform:"uppercase", letterSpacing:.5 }}>{h}</div>
            ))}
          </div>
          {items.map((it,idx)=>(
            <div key={it.id} style={{ display:"grid", gridTemplateColumns:"130px 1fr 110px 28px", gap:6, marginBottom:6, alignItems:"center" }}>
              <select className="fi" style={{ padding:"7px 8px", fontSize:11 }} value={it.kategori} onChange={e=>setItem(idx,"kategori",e.target.value)}>
                <option value="">— Pilih —</option>
                {KATEGORI_LIST.map(k=><option key={k.id} value={k.id}>{k.icon} {k.label}</option>)}
              </select>
              <input className="fi" style={{ padding:"7px 10px", fontSize:12 }} placeholder="Nama barang..." value={it.nama} onChange={e=>setItem(idx,"nama",e.target.value)} />
              <input className="fi" type="number" step="1000" placeholder="0"
                style={{ padding:"7px 8px", fontSize:12, fontFamily:"'JetBrains Mono',monospace", fontWeight:700, textAlign:"right" }}
                value={it.nominal} onChange={e=>setItem(idx,"nominal",e.target.value)} />
              <button onClick={()=>delItem(idx)} disabled={items.length===1}
                style={{ width:24, height:24, borderRadius:6, border:"1px solid var(--s200)", background:"var(--s50)", cursor:items.length===1?"not-allowed":"pointer", color:"var(--s400)", fontSize:12, display:"flex", alignItems:"center", justifyContent:"center", opacity:items.length===1?.3:1 }}>×</button>
            </div>
          ))}
          {/* Total */}
          <div style={{ display:"grid", gridTemplateColumns:"130px 1fr 110px 28px", gap:6, borderTop:"2px solid var(--s200)", paddingTop:8, marginTop:4, marginBottom:14 }}>
            <div /><div style={{ fontSize:12, fontWeight:700, color:"var(--s600)", display:"flex", alignItems:"center" }}>Total {items.length} item</div>
            <div style={{ fontSize:14, fontWeight:800, color:"var(--red)", fontFamily:"'JetBrains Mono',monospace", textAlign:"right" }}>{fmtRp(total)}</div>
            <div />
          </div>
          {/* Keterangan & Foto */}
          <div className="frow">
            <div>
              <label className="fl">Keterangan</label>
              <input className="fi" value={ket} onChange={e=>setKet(e.target.value)} placeholder="Keterangan nota..." />
            </div>
            <div>
              <label className="fl">Foto Nota</label>
              <div className={`foto-zone${foto?" has-foto":""}`} style={{ padding:"10px" }} onClick={()=>setFoto(!foto)}>
                {foto ? <div style={{ fontSize:12, color:"var(--green)", fontWeight:700 }}>📸 Foto terlampir ✓</div>
                      : <div style={{ fontSize:11, color:"var(--s400)", textAlign:"center" }}>📷 Lampirkan foto<br/><span style={{ fontSize:10, color:"var(--s300)" }}>opsional</span></div>}
              </div>
            </div>
          </div>
          {/* Preview */}
          {ok && total > 0 && (
            <div style={{ background:"linear-gradient(135deg,var(--s900),#1a0a00)", borderRadius:10, padding:"12px 14px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                <div style={{ fontSize:11, color:"rgba(255,255,255,.4)" }}>Preview setelah diedit — {items.length} item</div>
                <div style={{ fontSize:20, fontWeight:800, color:"var(--red)", fontFamily:"'JetBrains Mono',monospace" }}>-{fmtRp(total)}</div>
              </div>
              <div style={{ borderTop:"1px solid rgba(255,255,255,.1)", paddingTop:8 }}>
                {items.filter(i=>i.nama&&i.nominal).map((i,idx)=>(
                  <div key={idx} style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                    <span style={{ fontSize:11, color:"rgba(255,255,255,.5)" }}>{getKat(i.kategori).icon} {i.nama.slice(0,35)}</span>
                    <span style={{ fontSize:11, color:"rgba(255,255,255,.6)", fontFamily:"'JetBrains Mono',monospace" }}>{fmtRp(Number(i.nominal))}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="mc-f">
          <button className="btn-ghost" onClick={onClose}>Batal</button>
          <button className="btn-primary" disabled={!ok} style={{ opacity:ok?1:.5 }}
            onClick={()=>onSave(nota, items, ket, foto)}>
            ✓ Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// TAB 1 — RINGKASAN SALDO
// ============================================================
function TabRingkasan({ belanja, topup, onVerify, onReject, onEdit, userRole, onToast }) {
  const totalTopup    = topup.reduce((s,t)=>s+t.nominal, 0);
  const totalVerified = belanja.filter(b=>b.status==="verified").reduce((s,b)=>s+b.nominal, 0);
  const totalPending  = belanja.filter(b=>b.status==="pending").reduce((s,b)=>s+b.nominal, 0);
  const saldoAktif    = totalTopup - totalVerified - totalPending;
  const saldoAman     = totalTopup - totalVerified; // setelah pending diverifikasi
  const pctTerpakai   = totalTopup > 0 ? Math.round((totalVerified/totalTopup)*100) : 0;
  const pendingItems  = belanja.filter(b=>b.status==="pending");

  // Per kategori
  const perKat = KATEGORI_LIST.map(k => {
    const total = belanja.filter(b=>b.status==="verified"&&b.kategori===k.id).reduce((s,b)=>s+b.nominal,0);
    return { ...k, total };
  }).filter(k=>k.total>0).sort((a,b)=>b.total-a.total);

  // Per staff
  const perStaff = STAFF_LIST.slice(0,2).map(s => ({
    ...s,
    total: belanja.filter(b=>b.staffId===s.id&&b.status==="verified").reduce((sum,b)=>sum+b.nominal,0),
    count: belanja.filter(b=>b.staffId===s.id&&b.status==="verified").length,
  }));

  return (
    <div>
      {/* SALDO UTAMA */}
      <div className="saldo-main">
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:16, position:"relative", zIndex:1 }}>
          <div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,.4)", fontWeight:700, textTransform:"uppercase", letterSpacing:.5, marginBottom:6 }}>Saldo Petty Cash Aktif</div>
            <div style={{ fontSize:36, fontWeight:800, color:"var(--or)", fontFamily:"'JetBrains Mono',monospace", letterSpacing:-1 }}>{fmtRp(saldoAktif)}</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,.4)", marginTop:4 }}>Setelah pending terverifikasi: {fmtRp(saldoAman)}</div>
            {/* Progress bar */}
            <div style={{ marginTop:12, width:280 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <span style={{ fontSize:10, color:"rgba(255,255,255,.35)" }}>Terpakai {pctTerpakai}%</span>
                <span style={{ fontSize:10, color:"rgba(255,255,255,.35)" }}>Jatah: {fmtRp(totalTopup)}</span>
              </div>
              <div style={{ height:8, background:"rgba(255,255,255,.1)", borderRadius:4, overflow:"hidden" }}>
                <div style={{ height:"100%", width:pctTerpakai+"%", background:`linear-gradient(90deg,var(--or),var(--or-d))`, borderRadius:4, transition:"width .6s" }} />
              </div>
            </div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {[
              { label:"Total Top-up",    val:totalTopup,    color:"#60a5fa" },
              { label:"Terverifikasi",   val:totalVerified, color:"var(--green)" },
              { label:"Pending",         val:totalPending,  color:"var(--amber)" },
            ].map(s=>(
              <div key={s.label} style={{ textAlign:"right" }}>
                <div style={{ fontSize:10, color:"rgba(255,255,255,.35)", marginBottom:2 }}>{s.label}</div>
                <div style={{ fontSize:15, fontWeight:800, color:s.color, fontFamily:"'JetBrains Mono',monospace" }}>{fmtRp(s.val)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PENDING VERIFIKASI */}
      {userRole==="admin" && pendingItems.length > 0 && (
        <div className="w" style={{ border:"1.5px solid var(--amber)" }}>
          <div className="wh" style={{ background:"#fefce8" }}>
            <div className="wh-title" style={{ color:"var(--amber)" }}>⏳ Menunggu Verifikasi ({pendingItems.length} item)</div>
            <span style={{ fontSize:12, color:"var(--amber)", fontWeight:600 }}>{fmtRp(totalPending)}</span>
          </div>
          <div>
            {pendingItems.map(b=>{
              const kat  = getKat(b.kategori);
              const stf  = STAFF_LIST.find(s=>s.id===b.staffId);
              const si   = STAFF_LIST.findIndex(s=>s.id===b.staffId);
              return (
                <div key={b.id} className="bl-item">
                  <div className="bl-icon" style={{ background:kat.bg }}>{kat.icon}</div>
                  <div style={{ flex:1 }}>
                    <div className="bl-item-name">{b.item}</div>
                    <div className="bl-meta">
                      <div style={{ width:18, height:18, borderRadius:5, background:GRAD[si], display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, fontWeight:800, color:"#fff" }}>{getInit(stf?.nama||"")}</div>
                      <span style={{ fontSize:11, color:"var(--s400)" }}>{stf?.nama.split(" ")[0]}</span>
                      <span style={{ fontSize:11, color:"var(--s400)" }}>📅 {b.tanggal}</span>
                      <span className="badge" style={{ color:kat.warna, background:kat.bg }}>{kat.label}</span>
                      {b.foto && <span style={{ fontSize:10, color:"var(--teal)" }}>📸 ada foto</span>}
                    </div>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <div style={{ fontSize:15, fontWeight:800, color:"var(--red)", fontFamily:"'JetBrains Mono',monospace", marginBottom:5 }}>-{fmtRp(b.nominal)}</div>
                    <div style={{ display:"flex", gap:4 }}>
                      <button className="btn-ghost btn-xs" onClick={()=>onEdit(b.notaId)}>✏️</button>
                      <button className="btn-red btn-xs" onClick={()=>onReject(b.id)}>✗</button>
                      <button className="btn-green btn-xs" onClick={()=>onVerify(b.id)}>✓ Verifikasi</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* BREAKDOWN per kategori & staff */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        {/* Per kategori */}
        <div className="w">
          <div className="wh"><div className="wh-title">📊 Per Kategori</div></div>
          <div className="wb" style={{ padding:"10px 14px" }}>
            {perKat.length===0 && <div style={{ textAlign:"center", color:"var(--s400)", fontSize:12, padding:"16px 0" }}>Belum ada data</div>}
            {perKat.map(k=>{
              const pct = totalVerified > 0 ? Math.round((k.total/totalVerified)*100) : 0;
              return (
                <div key={k.id} style={{ marginBottom:10 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                    <span style={{ fontSize:12, fontWeight:600, color:"var(--s700)", display:"flex", alignItems:"center", gap:5 }}>{k.icon} {k.label}</span>
                    <span style={{ fontSize:12, fontWeight:700, color:k.warna, fontFamily:"'JetBrains Mono',monospace" }}>{fmtRp(k.total)}</span>
                  </div>
                  <div className="prog-wrap">
                    <div className="prog-bar" style={{ width:pct+"%", background:k.warna }} />
                  </div>
                  <div style={{ fontSize:9, color:"var(--s400)", marginTop:2 }}>{pct}% dari total belanja</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Per staff */}
        <div className="w">
          <div className="wh"><div className="wh-title">👤 Per Staff</div></div>
          <div className="wb">
            {perStaff.map((s,i)=>(
              <div key={s.id} style={{ display:"flex", gap:12, alignItems:"center", marginBottom:14 }}>
                <div style={{ width:42, height:42, borderRadius:12, background:GRAD[i], display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:13, fontWeight:800, flexShrink:0 }}>{getInit(s.nama)}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:"var(--s800)", marginBottom:3 }}>{s.nama.split(" ").slice(0,2).join(" ")}</div>
                  <div className="prog-wrap">
                    <div className="prog-bar" style={{ width:(totalVerified>0?Math.round(s.total/totalVerified*100):0)+"%", background:GRAD[i].includes("f97316")?"var(--or)":"var(--teal)" }} />
                  </div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:14, fontWeight:800, color:"var(--s800)", fontFamily:"'JetBrains Mono',monospace" }}>{fmtRp(s.total)}</div>
                  <div style={{ fontSize:10, color:"var(--s400)" }}>{s.count} transaksi</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// TAB 2 — RIWAYAT BELANJA
// ============================================================
function TabRiwayat({ belanja, onVerify, onReject, onEdit, userRole }) {
  const [filterKat,    setFilterKat]    = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterStaff,  setFilterStaff]  = useState("all");

  const filtered = belanja.filter(b => {
    if (filterKat    !== "all" && b.kategori !== filterKat)    return false;
    if (filterStatus !== "all" && b.status   !== filterStatus) return false;
    if (filterStaff  !== "all" && b.staffId  !== filterStaff)  return false;
    return true;
  }).sort((a,b)=>b.tanggal.localeCompare(a.tanggal));

  const totalFiltered = filtered.reduce((s,b)=>s+b.nominal,0);

  return (
    <div>
      {/* Filter bar */}
      <div className="w">
        <div className="wb" style={{ paddingBottom:10 }}>
          <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
            <div>
              <div style={{ fontSize:9, fontWeight:700, color:"var(--s400)", textTransform:"uppercase", letterSpacing:.5, marginBottom:5 }}>Status</div>
              <div className="filter-bar" style={{ margin:0 }}>
                {[["all","Semua"],["pending","Pending"],["verified","Terverifikasi"],["rejected","Ditolak"]].map(([v,l])=>(
                  <button key={v} className={`filter-btn${filterStatus===v?" active":""}`} onClick={()=>setFilterStatus(v)}>{l}</button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize:9, fontWeight:700, color:"var(--s400)", textTransform:"uppercase", letterSpacing:.5, marginBottom:5 }}>Staff</div>
              <div className="filter-bar" style={{ margin:0 }}>
                <button className={`filter-btn${filterStaff==="all"?" active":""}`} onClick={()=>setFilterStaff("all")}>Semua</button>
                {STAFF_LIST.slice(0,2).map(s=>(
                  <button key={s.id} className={`filter-btn${filterStaff===s.id?" active":""}`} onClick={()=>setFilterStaff(s.id)}>{s.nama.split(" ")[0]}</button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize:9, fontWeight:700, color:"var(--s400)", textTransform:"uppercase", letterSpacing:.5, marginBottom:5 }}>Kategori</div>
              <div className="filter-bar" style={{ margin:0 }}>
                <button className={`filter-btn${filterKat==="all"?" active":""}`} onClick={()=>setFilterKat("all")}>Semua</button>
                {KATEGORI_LIST.map(k=>(
                  <button key={k.id} className={`filter-btn${filterKat===k.id?" active":""}`} onClick={()=>setFilterKat(k.id)}>{k.icon} {k.label}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w">
        <div className="wh">
          <div className="wh-title">🧾 {filtered.length} transaksi</div>
          <span style={{ fontSize:13, fontWeight:700, color:"var(--red)", fontFamily:"'JetBrains Mono',monospace" }}>-{fmtRp(totalFiltered)}</span>
        </div>
        <div>
          {filtered.length===0 && (
            <div style={{ textAlign:"center", padding:"36px 0", color:"var(--s400)" }}>
              <div style={{ fontSize:36, marginBottom:8 }}>🔍</div>
              <div style={{ fontSize:13 }}>Tidak ada data dengan filter ini</div>
            </div>
          )}
          {filtered.map(b=>{
            const kat = getKat(b.kategori);
            const stf = STAFF_LIST.find(s=>s.id===b.staffId);
            const si  = STAFF_LIST.findIndex(s=>s.id===b.staffId);
            return (
              <div key={b.id} className="bl-item">
                <div className="bl-icon" style={{ background:kat.bg, fontSize:18 }}>{kat.icon}</div>
                <div style={{ flex:1 }}>
                  <div className="bl-item-name">{b.item}</div>
                  <div className="bl-meta">
                    <div style={{ width:18, height:18, borderRadius:5, background:GRAD[si], display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, fontWeight:800, color:"#fff" }}>{getInit(stf?.nama||"")}</div>
                    <span style={{ fontSize:11, color:"var(--s500)" }}>{stf?.nama.split(" ")[0]}</span>
                    <span style={{ fontSize:11, color:"var(--s400)" }}>📅 {b.tanggal}</span>
                    <span className="badge" style={{ color:kat.warna, background:kat.bg }}>{kat.label}</span>
                    {b.foto && <span style={{ fontSize:10, color:"var(--teal)" }}>📸</span>}
                    {b.keterangan && <span style={{ fontSize:10, color:"var(--s400)", fontStyle:"italic" }}>{b.keterangan}</span>}
                  </div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div style={{ fontSize:15, fontWeight:800, color:"var(--red)", fontFamily:"'JetBrains Mono',monospace", marginBottom:4 }}>-{fmtRp(b.nominal)}</div>
                  {b.status==="pending" ? (
                    <div style={{ display:"flex", gap:4 }}>
                      <button className="btn-ghost btn-xs" onClick={()=>onEdit(b.notaId)}>✏️ Edit</button>
                      {userRole==="admin" && <>
                        <button className="btn-red btn-xs" onClick={()=>onReject(b.id)}>✗</button>
                        <button className="btn-green btn-xs" onClick={()=>onVerify(b.id)}>✓</button>
                      </>}
                    </div>
                  ) : (
                    <span className={`badge status-${b.status}`}>
                      {b.status==="verified"?"✓ Terverifikasi":b.status==="pending"?"⏳ Pending":"✗ Ditolak"}
                    </span>
                  )}
                  {b.kasId && <div style={{ fontSize:9, color:"var(--s300)", marginTop:2 }}>{b.kasId}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// TAB 3 — RIWAYAT TOP-UP
// ============================================================
function TabTopup({ topup }) {
  const total = topup.reduce((s,t)=>s+t.nominal, 0);
  return (
    <div className="w">
      <div className="wh">
        <div className="wh-title">💰 Riwayat Top-up</div>
        <span style={{ fontSize:13, fontWeight:800, color:"var(--green)", fontFamily:"'JetBrains Mono',monospace" }}>+{fmtRp(total)}</span>
      </div>
      <div>
        {topup.slice().reverse().map(t=>{
          const admin = STAFF_LIST.find(s=>s.id===t.adminId);
          return (
            <div key={t.id} className="tu-item">
              <div style={{ width:38, height:38, borderRadius:10, background:"linear-gradient(135deg,#dcfce7,#86efac)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>💰</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600, color:"var(--s800)", marginBottom:2 }}>{t.keterangan}</div>
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  <span style={{ fontSize:11, color:"var(--s400)" }}>📅 {t.tanggal}</span>
                  <span style={{ fontSize:11, color:"var(--s400)" }}>oleh {admin?.nama.split(" ")[0] || "Admin"}</span>
                </div>
              </div>
              <div style={{ fontSize:16, fontWeight:800, color:"var(--green)", fontFamily:"'JetBrains Mono',monospace" }}>+{fmtRp(t.nominal)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// MAIN EXPORT
// ============================================================
export default function PettyCash({ userRole = "admin" }) {
  const [activeTab,  setActiveTab]  = useState("ringkasan");
  const [belanja,    setBelanja]    = useState(BELANJA_INIT);
  const [topup,      setTopup]      = useState(TOPUP_INIT);
  const [periode,    setPeriode]    = useState(PERIODE_LIST[0]);
  const [showForm,   setShowForm]   = useState(false);
  const [showTopup,  setShowTopup]  = useState(false);
  const [editNotaId, setEditNotaId] = useState(null); // notaId yang sedang diedit
  const [toast,      setToast]      = useState(null);

  const totalTopup    = topup.reduce((s,t)=>s+t.nominal, 0);
  const totalVerified = belanja.filter(b=>b.status==="verified").reduce((s,b)=>s+b.nominal, 0);
  const totalPending  = belanja.filter(b=>b.status==="pending").reduce((s,b)=>s+b.nominal, 0);
  const saldo         = totalTopup - totalVerified - totalPending;

  const handleVerify  = (id) => {
    setBelanja(p=>p.map(b=>b.id===id?{...b,status:"verified",kasId:"KAS-2026-02-"+String(Math.floor(Math.random()*900)+100)}:b));
    setToast("✅ Belanja terverifikasi — masuk ke Kas & Jurnal");
  };
  const handleReject  = (id) => {
    setBelanja(p=>p.map(b=>b.id===id?{...b,status:"rejected"}:b));
    setToast("✗ Belanja ditolak");
  };
  const handleAddBelanja = (entries, total, notaId) => {
    setBelanja(p => [...p, ...entries]);
    setShowForm(false);
    setToast(`✓ ${entries.length} item belanja dicatat (${fmtRp(total)}) — menunggu verifikasi`);
  };
  const handleTopup     = (t) => { setTopup(p=>[...p,t]); setShowTopup(false); setToast(`✓ Top-up ${fmtRp(t.nominal)} berhasil ditambahkan`); };
  const handleEdit      = (notaId) => setEditNotaId(notaId);
  const handleSaveEdit  = (oldItems, newItems, ket, foto) => {
    // Hapus item lama dari nota ini, replace dengan item baru
    const notaId   = oldItems[0].notaId;
    const staffId  = oldItems[0].staffId;
    const tanggal  = oldItems[0].tanggal;
    const newEntries = newItems.map((it, idx) => ({
      id:         it.id.startsWith("NEW_") ? "B"+Date.now()+idx : it.id,
      notaId,
      tanggal,
      staffId,
      kategori:   it.kategori,
      item:       it.nama,
      nominal:    Number(it.nominal),
      keterangan: ket,
      foto:       idx===0 ? foto : false,
      status:     "pending",
      kasId:      null,
    }));
    setBelanja(p => [...p.filter(b=>b.notaId!==notaId), ...newEntries]);
    setEditNotaId(null);
    setToast("✓ Belanja berhasil diperbarui — masih menunggu verifikasi");
  };

  const pendingCount = belanja.filter(b=>b.status==="pending").length;

  const TABS = [
    { id:"ringkasan", icon:"💰", label:"Ringkasan Saldo" },
    { id:"riwayat",   icon:"🧾", label:"Riwayat Belanja", badge:pendingCount },
    { id:"topup",     icon:"⬆️",  label:"Riwayat Top-up" },
  ];

  return (
    <div className="fade-up">
      <StyleInjector />

      {/* TOPBAR */}
      <div className="topbar">
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <select style={{ background:"var(--white)", border:"1.5px solid var(--s200)", borderRadius:9, padding:"8px 14px", fontSize:13, fontWeight:700, color:"var(--s800)", fontFamily:"inherit", outline:"none", cursor:"pointer" }}
            value={periode} onChange={e=>setPeriode(e.target.value)}>
            {PERIODE_LIST.map(p=><option key={p}>{p}</option>)}
          </select>
          {/* Saldo mini di topbar */}
          <div style={{ background:saldo<100000?"#fee2e2":saldo<300000?"#fef3c7":"#dcfce7", border:`1px solid ${saldo<100000?"#fca5a5":saldo<300000?"#fde68a":"#86efac"}`, borderRadius:8, padding:"6px 12px", display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ fontSize:11, fontWeight:700, color:saldo<100000?"var(--red)":saldo<300000?"var(--amber)":"var(--green)" }}>
              {saldo<100000?"⚠️ Saldo menipis!":saldo<300000?"💛 Saldo segera habis":"✅ Saldo aman"} — {fmtRp(saldo)}
            </span>
          </div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          {userRole==="admin" && <button className="btn-ghost" onClick={()=>setShowTopup(true)}>💰 Top-up</button>}
          <button className="btn-primary" onClick={()=>setShowForm(true)}>+ Input Belanja</button>
          <button className="btn-ghost" onClick={()=>setToast("📤 Export laporan petty cash")}>↓ Export</button>
        </div>
      </div>

      {/* STAT ROW */}
      <div className="stat-row">
        {[
          { label:"Saldo Aktif",    val:fmtRp(saldo),         color:saldo<100000?"var(--red)":saldo<300000?"var(--amber)":"var(--green)", bc:saldo<100000?"var(--red)":"var(--green)", sub:"setelah pending" },
          { label:"Total Top-up",   val:fmtRp(totalTopup),    color:"var(--blue)",  bc:"var(--blue)",  sub:`${topup.length} kali top-up` },
          { label:"Terpakai",       val:fmtRp(totalVerified), color:"var(--red)",   bc:"var(--red)",   sub:`${belanja.filter(b=>b.status==="verified").length} transaksi` },
          { label:"Pending",        val:pendingCount,          color:"var(--amber)", bc:"var(--amber)", sub:fmtRp(totalPending) },
        ].map(s=>(
          <div key={s.label} className="sc" style={{ borderTopColor:s.bc }}>
            <div className="sc-label">{s.label}</div>
            <div className="sc-val" style={{ color:s.color, fontSize:typeof s.val==="string"?14:20 }}>{s.val}</div>
            <div className="sc-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* TAB NAV */}
      <div className="tab-nav">
        {TABS.map(t=>(
          <button key={t.id} className={`tab-btn${activeTab===t.id?" active":""}`} onClick={()=>setActiveTab(t.id)}>
            <span>{t.icon}</span>{t.label}
            {t.badge>0 && <span style={{ background:activeTab===t.id?"rgba(255,255,255,.3)":"var(--amber)", color:"#fff", borderRadius:10, padding:"0 5px", fontSize:9, fontWeight:800 }}>{t.badge}</span>}
          </button>
        ))}
      </div>

      {activeTab==="ringkasan" && <TabRingkasan belanja={belanja} topup={topup} onVerify={handleVerify} onReject={handleReject} onEdit={handleEdit} userRole={userRole} onToast={setToast} />}
      {activeTab==="riwayat"   && <TabRiwayat   belanja={belanja} onVerify={handleVerify} onReject={handleReject} onEdit={handleEdit} userRole={userRole} />}
      {activeTab==="topup"     && <TabTopup      topup={topup} />}

      {showForm     && <FormBelanja     onSave={handleAddBelanja}                         onClose={()=>setShowForm(false)}  userRole={userRole} />}
  {editNotaId   && (() => {
    const editItems = belanja.filter(b=>b.notaId===editNotaId&&b.status==="pending");
    return editItems.length > 0 ? <FormEditBelanja nota={editItems} onSave={handleSaveEdit} onClose={()=>setEditNotaId(null)} /> : null;
  })()}
      {showTopup && <FormTopup    onSave={handleTopup}      onClose={()=>setShowTopup(false)} />}
      {toast     && <Toast msg={toast} onDone={()=>setToast(null)} />}
    </div>
  );
}
