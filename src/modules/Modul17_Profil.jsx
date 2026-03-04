import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const CSS = `
  .pf-wrap { display:flex; flex-direction:column; gap:16px; }
  .pf-tabs { display:flex; gap:0; background:#fff; border-radius:12px; border:1px solid #e5e7eb; overflow:hidden; }
  .pf-tab  { flex:1; padding:11px 8px; font-size:11px; font-weight:600; color:#9ca3af; cursor:pointer; text-align:center; border-right:1px solid #f3f4f6; transition:all .12s; }
  .pf-tab:last-child { border-right:none; }
  .pf-tab.active { color:#ea580c; background:#fff7ed; border-bottom:2px solid #f97316; }
  .pf-tab:hover:not(.active) { background:#fafafa; color:#374151; }

  .pf-widget { background:#fff; border-radius:12px; border:1px solid #e5e7eb; overflow:hidden; }
  .pf-widget-head { padding:14px 18px 12px; border-bottom:1px solid #f3f4f6; display:flex; align-items:center; justify-content:space-between; }
  .pf-widget-title { font-size:13px; font-weight:700; color:#111827; }
  .pf-body { padding:20px; display:flex; flex-direction:column; gap:14px; }

  .pf-section { margin-bottom:4px; }
  .pf-section-title { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#9ca3af; margin-bottom:10px; display:flex; align-items:center; gap:6px; }
  .pf-section-title::after { content:''; flex:1; height:1px; background:#f3f4f6; }
  .pf-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .pf-grid3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; }

  .pf-field { display:flex; flex-direction:column; gap:5px; }
  .pf-label { font-size:11px; font-weight:600; color:#374151; }
  .pf-sublabel { font-size:10px; color:#9ca3af; font-weight:400; }
  .pf-input { padding:8px 11px; border-radius:8px; border:1.5px solid #e5e7eb; font-size:12px; font-family:inherit; color:#1f2937; outline:none; background:#fff; transition:border-color .12s; width:100%; box-sizing:border-box; }
  .pf-input:focus { border-color:#f97316; }
  .pf-input:disabled { background:#f9fafb; color:#9ca3af; }
  .pf-input-prefix { display:flex; align-items:center; border:1.5px solid #e5e7eb; border-radius:8px; overflow:hidden; background:#fff; transition:border-color .12s; }
  .pf-input-prefix:focus-within { border-color:#f97316; }
  .pf-prefix-label { padding:0 10px; font-size:12px; color:#9ca3af; background:#f9fafb; border-right:1px solid #e5e7eb; height:36px; display:flex; align-items:center; white-space:nowrap; }
  .pf-prefix-input { border:none; outline:none; padding:8px 11px; font-size:12px; font-family:inherit; color:#1f2937; flex:1; background:transparent; min-width:0; }

  .pf-toggle-row { display:flex; align-items:center; justify-content:space-between; padding:10px 13px; background:#f9fafb; border-radius:9px; border:1px solid #e5e7eb; }
  .pf-toggle-info { flex:1; }
  .pf-toggle-label { font-size:12px; font-weight:600; color:#1f2937; }
  .pf-toggle-desc  { font-size:11px; color:#9ca3af; margin-top:1px; }
  .pf-toggle { position:relative; width:40px; height:22px; cursor:pointer; flex-shrink:0; }
  .pf-toggle input { opacity:0; width:0; height:0; }
  .pf-toggle-slider { position:absolute; inset:0; background:#e5e7eb; border-radius:22px; transition:.25s; }
  .pf-toggle-slider:before { content:''; position:absolute; height:16px; width:16px; left:3px; bottom:3px; background:#fff; border-radius:50%; transition:.25s; box-shadow:0 1px 3px rgba(0,0,0,.2); }
  input:checked + .pf-toggle-slider { background:#f97316; }
  input:checked + .pf-toggle-slider:before { transform:translateX(18px); }

  .pf-rek-card { display:flex; align-items:center; gap:10px; padding:10px 12px; background:#f9fafb; border:1.5px solid #e5e7eb; border-radius:9px; }
  .pf-rek-badge { padding:3px 10px; border-radius:20px; font-size:10px; font-weight:700; }
  .pf-rek-info { flex:1; }
  .pf-rek-name { font-size:12px; font-weight:600; color:#1f2937; }
  .pf-rek-no   { font-size:11px; color:#9ca3af; font-family:'JetBrains Mono',monospace; }
  .pf-rek-actions { display:flex; gap:6px; }

  .pf-btn { display:inline-flex; align-items:center; gap:5px; padding:8px 16px; border-radius:8px; font-size:12px; font-weight:600; border:none; cursor:pointer; font-family:inherit; transition:all .15s; }
  .pf-btn.primary { background:linear-gradient(135deg,#f97316,#ea580c); color:#fff; box-shadow:0 3px 10px rgba(249,115,22,.2); }
  .pf-btn.ghost   { background:#f3f4f6; color:#4b5563; }
  .pf-btn.danger  { background:#fee2e2; color:#dc2626; }
  .pf-save-bar { position:sticky; bottom:0; background:#fff; border-top:1px solid #e5e7eb; padding:12px 20px; display:flex; gap:8px; justify-content:flex-end; }

  .pf-info-box { background:#f0fdf4; border:1px solid #86efac; border-radius:9px; padding:10px 14px; font-size:11px; color:#15803d; }
  .pf-warn-box { background:#fff7ed; border:1px solid #fed7aa; border-radius:9px; padding:10px 14px; font-size:11px; color:#9a3412; }

  .pf-overlay { position:fixed !important; inset:0 !important; background:rgba(17,24,39,.65) !important; z-index:9999 !important; display:flex !important; align-items:center !important; justify-content:center !important; padding:16px !important; box-sizing:border-box !important; }
  .pf-modal { background:#fff; border-radius:14px; width:100%; max-width:440px; box-shadow:0 20px 60px rgba(0,0,0,.18); }
  .pf-modal-head { padding:14px 18px 12px; border-bottom:1px solid #f3f4f6; display:flex; align-items:center; justify-content:space-between; }
  .pf-modal-title { font-size:13px; font-weight:700; color:#111827; }
  .pf-modal-close { width:26px; height:26px; border-radius:7px; background:#f3f4f6; border:none; cursor:pointer; font-size:13px; }
  .pf-modal-body { padding:16px 18px; display:flex; flex-direction:column; gap:11px; }
  .pf-modal-foot { padding:11px 18px; border-top:1px solid #f3f4f6; display:flex; gap:8px; }

  @media(max-width:768px){ .pf-grid{grid-template-columns:1fr} .pf-grid3{grid-template-columns:1fr 1fr} }
`;

function StyleInjector() {
  useEffect(() => {
    const id = "senyuminn-profil-css";
    if (document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id; el.textContent = CSS;
    document.head.appendChild(el);
    return () => { const e=document.getElementById(id); if(e) e.remove(); };
  },[]);
  return null;
}

const fmtRp = (n) => "Rp " + Number(n||0).toLocaleString("id-ID");

function Toggle({ checked, onChange, disabled }) {
  return (
    <label className="pf-toggle">
      <input type="checkbox" checked={checked} onChange={e=>onChange(e.target.checked)} disabled={disabled} />
      <span className="pf-toggle-slider" />
    </label>
  );
}

function ModalRekening({ rek, onClose, onSave }) {
  const [form, setForm] = useState(rek || { bank:"BCA", noRek:"", atasNama:"", default:false });
  const set = (k,v) => setForm(p=>({...p,[k]:v}));
  const BANKS = ["BCA","BRI","BNI","Mandiri","BSI","CIMB","Permata","Jenius","Dana","OVO","GoPay"];
  return createPortal(
    <div className="pf-overlay" onClick={onClose}>
      <div className="pf-modal" onClick={e=>e.stopPropagation()}>
        <div className="pf-modal-head">
          <div className="pf-modal-title">{rek ? "Edit Rekening" : "Tambah Rekening"}</div>
          <button className="pf-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="pf-modal-body">
          <div className="pf-field">
            <label className="pf-label">Bank</label>
            <select className="pf-input" value={form.bank} onChange={e=>set("bank",e.target.value)}>
              {BANKS.map(b=><option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div className="pf-field">
            <label className="pf-label">Nomor Rekening</label>
            <input className="pf-input" value={form.noRek} onChange={e=>set("noRek",e.target.value)} placeholder="Nomor rekening..." style={{fontFamily:"JetBrains Mono,monospace"}} />
          </div>
          <div className="pf-field">
            <label className="pf-label">Atas Nama</label>
            <input className="pf-input" value={form.atasNama} onChange={e=>set("atasNama",e.target.value)} placeholder="Nama pemilik rekening..." />
          </div>
          <div className="pf-toggle-row">
            <div className="pf-toggle-info">
              <div className="pf-toggle-label">Rekening Utama</div>
              <div className="pf-toggle-desc">Rekening default untuk terima pembayaran</div>
            </div>
            <Toggle checked={form.default} onChange={v=>set("default",v)} />
          </div>
        </div>
        <div className="pf-modal-foot">
          <button className="pf-btn primary" disabled={!form.noRek||!form.atasNama} onClick={()=>{ onSave({...form,id:rek?.id||Date.now()}); onClose(); }}>✅ Simpan</button>
          <button className="pf-btn ghost" onClick={onClose}>Batal</button>
        </div>
      </div>
    </div>
  , document.body);
}

export default function ProfilKost({ user, globalData = {} }) {
  const { pengaturanConfig = {}, setPengaturanConfig = ()=>{}, isReadOnly = false } = globalData;
  const [tab, setTab] = useState("profil");
  const [cfg, setCfg] = useState({ ...pengaturanConfig });
  const [dirty, setDirty] = useState(false);
  const [showRekModal, setShowRekModal] = useState(null);

  const set = (k,v) => { setCfg(p=>({...p,[k]:v})); setDirty(true); };
  const setRek = (arr) => set("rekening", arr);

  const handleSave = () => {
    setPengaturanConfig(cfg);
    setDirty(false);
    alert("✅ Pengaturan berhasil disimpan!");
  };

  const TABS = [
    {id:"profil",    label:"🏠 Profil Kost"},
    {id:"keuangan",  label:"💰 Keuangan"},
    {id:"hr",        label:"👥 HR & Gaji"},
    {id:"rekening",  label:"🏦 Rekening"},
  ];

  const InputField = ({label, sub, fieldKey, type="text", prefix, placeholder, min, max}) => (
    <div className="pf-field">
      <label className="pf-label">{label} {sub && <span className="pf-sublabel">{sub}</span>}</label>
      {prefix ? (
        <div className="pf-input-prefix">
          <span className="pf-prefix-label">{prefix}</span>
          <input className="pf-prefix-input" type={type} value={cfg[fieldKey]||""} onChange={e=>set(fieldKey, type==="number"?Number(e.target.value):e.target.value)} placeholder={placeholder} disabled={isReadOnly} min={min} max={max} />
        </div>
      ) : (
        <input className="pf-input" type={type} value={cfg[fieldKey]||""} onChange={e=>set(fieldKey, type==="number"?Number(e.target.value):e.target.value)} placeholder={placeholder} disabled={isReadOnly} min={min} max={max} />
      )}
    </div>
  );

  return (
    <div className="pf-wrap">
      <StyleInjector />

      <div className="pf-tabs">
        {TABS.map(t=>(
          <div key={t.id} className={`pf-tab ${tab===t.id?"active":""}`} onClick={()=>setTab(t.id)}>{t.label}</div>
        ))}
      </div>

      <div className="pf-widget">
        <div className="pf-widget-head">
          <div className="pf-widget-title">
            {TABS.find(t=>t.id===tab)?.label} — Pengaturan
          </div>
          {dirty && !isReadOnly && <span style={{fontSize:11,color:"#f97316",fontWeight:600}}>● Ada perubahan belum disimpan</span>}
        </div>

        <div className="pf-body">

          {/* ── Tab: Profil Kost */}
          {tab==="profil" && (
            <>
              <div className="pf-section">
                <div className="pf-section-title">Identitas Kost</div>
                <div className="pf-grid">
                  <InputField label="Nama Kost" fieldKey="namaKost" placeholder="Senyum Inn..." />
                  <InputField label="Nomor Telepon" fieldKey="telepon" placeholder="08xx..." />
                  <InputField label="Nama Direktur / Owner" sub="(untuk tanda tangan surat)" fieldKey="namaDirektur" placeholder="Nama lengkap..." />
                  <InputField label="Email" fieldKey="email" placeholder="email@..." />
                </div>
                <div style={{marginTop:12}}>
                  <InputField label="Alamat Lengkap" fieldKey="alamat" placeholder="Jl. ..." />
                </div>
              </div>

              <div className="pf-section">
                <div className="pf-section-title">Operasional</div>
                <div className="pf-grid">
                  <InputField label="Jam Buka" fieldKey="jamBuka" type="time" />
                  <InputField label="Jam Tutup" fieldKey="jamTutup" type="time" />
                  <InputField label="Kapasitas Parkir Motor" fieldKey="parkirMotor" type="number" placeholder="0" min={0} />
                  <InputField label="Kapasitas Parkir Mobil" fieldKey="parkirMobil" type="number" placeholder="0" min={0} />
                </div>
              </div>

              <div className="pf-section">
                <div className="pf-section-title">GPS Absensi</div>
                <div className="pf-grid3">
                  <InputField label="Latitude" fieldKey="gpsLat" type="number" placeholder="-7.5755" />
                  <InputField label="Longitude" fieldKey="gpsLng" type="number" placeholder="110.8243" />
                  <InputField label="Radius (meter)" fieldKey="gpsRadius" type="number" placeholder="500" min={100} />
                </div>
                <div className="pf-info-box" style={{marginTop:10}}>
                  📍 Koordinat GPS digunakan untuk validasi absensi staff. Radius default 500m dari titik kost.
                </div>
              </div>

              <div className="pf-section">
                <div className="pf-section-title">Harga Kamar</div>
                <div className="pf-grid">
                  <InputField label="Harga Kamar Premium" fieldKey="hargaPremium" type="number" prefix="Rp" placeholder="2500000" />
                  <InputField label="Harga Kamar Reguler" fieldKey="hargaReguler" type="number" prefix="Rp" placeholder="1800000" />
                  <InputField label="Harga Premium + Kulkas" fieldKey="hargaPremiumKulkas" type="number" prefix="Rp" placeholder="2650000" />
                </div>
                <div className="pf-info-box" style={{marginTop:10}}>
                  💡 Harga custom per kamar bisa diatur di Monitor Kamar → Edit Kamar.
                </div>
              </div>
            </>
          )}

          {/* ── Tab: Keuangan */}
          {tab==="keuangan" && (
            <>
              <div className="pf-section">
                <div className="pf-section-title">Tagihan & Pembayaran</div>
                <div className="pf-grid">
                  <InputField label="Tanggal Jatuh Tempo" sub="(tanggal setiap bulan)" fieldKey="batasTagihan" type="number" placeholder="25" min={1} max={28} />
                  <InputField label="Toleransi Keterlambatan" sub="(hari)" fieldKey="toleransiHari" type="number" placeholder="3" min={0} max={14} />
                  <InputField label="Denda Keterlambatan" sub="(per hari)" fieldKey="dendaPerHari" type="number" prefix="Rp" placeholder="50000" min={0} />
                  <InputField label="Tarif Sewa Harian" sub="(jika tidak perpanjang)" fieldKey="sewaHarian" type="number" prefix="Rp" placeholder="250000" min={0} />
                </div>
              </div>

              <div className="pf-section">
                <div className="pf-section-title">Management Fee</div>
                <div className="pf-grid">
                  <InputField label="Management Fee" sub="(% dari pendapatan)" fieldKey="managementFee" type="number" prefix="%" placeholder="22" min={0} max={100} />
                </div>
                <div className="pf-info-box" style={{marginTop:10}}>
                  💡 Management fee dihitung otomatis di Laporan Keuangan. Dibayar bulanan ke manajemen.
                </div>
              </div>

              <div className="pf-section">
                <div className="pf-section-title">Deposit Jaminan</div>
                <div className="pf-toggle-row">
                  <div className="pf-toggle-info">
                    <div className="pf-toggle-label">Aktifkan Deposit Jaminan</div>
                    <div className="pf-toggle-desc">Penyewa wajib bayar deposit saat check-in</div>
                  </div>
                  <Toggle checked={cfg.depositAktif||false} onChange={v=>set("depositAktif",v)} disabled={isReadOnly} />
                </div>
                {cfg.depositAktif && (
                  <>
                    <div className="pf-grid" style={{marginTop:10}}>
                      <InputField label="Nominal Deposit" fieldKey="depositNominal" type="number" prefix="Rp" placeholder="500000" min={0} />
                    </div>
                    <div className="pf-toggle-row" style={{marginTop:8}}>
                      <div className="pf-toggle-info">
                        <div className="pf-toggle-label">Deposit bisa dipotong untuk denda kerusakan</div>
                        <div className="pf-toggle-desc">Jika OFF, deposit selalu dikembalikan penuh saat checkout</div>
                      </div>
                      <Toggle checked={cfg.depositBisaDipotong!==false} onChange={v=>set("depositBisaDipotong",v)} disabled={isReadOnly} />
                    </div>
                    <div className="pf-warn-box" style={{marginTop:8}}>
                      ⚠️ Deposit berlaku untuk penyewa baru setelah diaktifkan. Penyewa lama tidak terpengaruh.
                    </div>
                  </>
                )}
              </div>

              <div className="pf-section">
                <div className="pf-section-title">Kategori Transaksi</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                  {[
                    {label:"Sewa Kamar",tipe:"in",color:"#16a34a"},
                    {label:"Denda Keterlambatan",tipe:"in",color:"#16a34a"},
                    {label:"Lain-lain",tipe:"in",color:"#16a34a"},
                    {label:"Management Fee",tipe:"out",color:"#dc2626"},
                    {label:"Gaji & Insentif",tipe:"out",color:"#dc2626"},
                    {label:"Peralatan",tipe:"out",color:"#dc2626"},
                    {label:"Listrik/Internet/Air",tipe:"out",color:"#dc2626"},
                    {label:"Maintenance",tipe:"out",color:"#dc2626"},
                    {label:"Akomodasi/Op",tipe:"out",color:"#dc2626"},
                    {label:"Perlengkapan",tipe:"out",color:"#dc2626"},
                    {label:"Konsumsi",tipe:"out",color:"#dc2626"},
                    {label:"Marketing",tipe:"out",color:"#dc2626"},
                    {label:"THR",tipe:"out",color:"#dc2626"},
                    {label:"Prive/Dividen",tipe:"out",color:"#dc2626"},
                    {label:"Lain-lain",tipe:"out",color:"#dc2626"},
                  ].map((k,i)=>(
                    <span key={i} style={{padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:600,color:k.tipe==="in"?"#15803d":"#9a3412",background:k.tipe==="in"?"#dcfce7":"#fee2e2",border:`1px solid ${k.tipe==="in"?"#86efac":"#fca5a5"}`}}>
                      {k.tipe==="in"?"↑":"↓"} {k.label}
                    </span>
                  ))}
                </div>
                <div className="pf-info-box" style={{marginTop:8}}>
                  💡 Kategori transaksi custom akan tersedia di update berikutnya.
                </div>
              </div>
            </>
          )}

          {/* ── Tab: HR & Gaji */}
          {tab==="hr" && (
            <>
              <div className="pf-section">
                <div className="pf-section-title">Komponen Gaji</div>
                <div className="pf-grid">
                  <InputField label="Lembur per Shift" sub="(nominal per shift lembur)" fieldKey="lemburPerShift" type="number" prefix="Rp" placeholder="50000" min={0} />
                  <InputField label="Nominal Insentif KPI" sub="(per bulan jika lolos KPI)" fieldKey="nominalInsentif" type="number" prefix="Rp" placeholder="500000" min={0} />
                </div>
              </div>

              <div className="pf-section">
                <div className="pf-section-title">Potongan</div>
                <div className="pf-grid">
                  <InputField label="Denda Ijin Tidak Sah" sub="(per hari)" fieldKey="dendaIjinTidakSah" type="number" prefix="Rp" placeholder="50000" min={0} />
                  <InputField label="Maks Pinjaman Koperasi" sub="(sekali potong)" fieldKey="maxPinjamanKoperasi" type="number" prefix="Rp" placeholder="700000" min={0} />
                </div>
              </div>

              <div className="pf-section">
                <div className="pf-section-title">KPI Threshold</div>
                <div className="pf-grid">
                  <InputField label="Threshold Kehadiran" sub="(% min untuk dapat insentif)" fieldKey="kpiThresholdPct" type="number" prefix="%" placeholder="90" min={0} max={100} />
                </div>
                <div className="pf-info-box" style={{marginTop:10}}>
                  💡 KPI dihitung dari absensi bulan berjalan. Staff ≥ {cfg.kpiThresholdPct||90}% kehadiran mendapat insentif Rp {(cfg.nominalInsentif||500000).toLocaleString("id-ID")}.
                </div>
              </div>

              <div className="pf-section">
                <div className="pf-section-title">Koperasi</div>
                <div className="pf-grid">
                  <InputField label="Bank Koperasi" fieldKey="bankKoperasi" placeholder="BCA, BRI..." />
                  <InputField label="Nomor Rekening Koperasi" fieldKey="rekeningKoperasi" placeholder="Nomor rekening..." />
                </div>
              </div>
            </>
          )}

          {/* ── Tab: Rekening */}
          {tab==="rekening" && (
            <>
              <div className="pf-section">
                <div className="pf-section-title">Rekening Bank Operasional</div>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {(cfg.rekening||[]).map((r,i)=>(
                    <div key={r.id||i} className="pf-rek-card">
                      <div style={{width:36,height:36,borderRadius:9,background:"#f97316",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"#fff",flexShrink:0}}>
                        {r.bank?.[0]||"?"}
                      </div>
                      <div className="pf-rek-info">
                        <div className="pf-rek-name">{r.bank} — {r.atasNama}</div>
                        <div className="pf-rek-no">{r.noRek||"—"}</div>
                      </div>
                      {r.default && <span className="pf-rek-badge" style={{color:"#f97316",background:"#fff7ed",border:"1px solid #fed7aa"}}>Utama</span>}
                      {!isReadOnly && (
                        <div className="pf-rek-actions">
                          <button className="pf-btn ghost" style={{padding:"5px 10px",fontSize:11}} onClick={()=>setShowRekModal(r)}>✏️</button>
                          <button className="pf-btn danger" style={{padding:"5px 10px",fontSize:11}} onClick={()=>{ if(window.confirm("Hapus rekening ini?")) setRek((cfg.rekening||[]).filter((_,j)=>j!==i)); }}>🗑️</button>
                        </div>
                      )}
                    </div>
                  ))}
                  {!isReadOnly && (
                    <button className="pf-btn ghost" style={{alignSelf:"flex-start"}} onClick={()=>setShowRekModal({})}>
                      ➕ Tambah Rekening
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Save bar */}
        {!isReadOnly && (
          <div className="pf-save-bar">
            <button className="pf-btn ghost" onClick={()=>{ setCfg({...pengaturanConfig}); setDirty(false); }} disabled={!dirty}>↩️ Reset</button>
            <button className="pf-btn primary" onClick={handleSave} disabled={!dirty}>✅ Simpan Pengaturan</button>
          </div>
        )}
      </div>

      {showRekModal !== null && (
        <ModalRekening
          rek={showRekModal?.id ? showRekModal : null}
          onClose={()=>setShowRekModal(null)}
          onSave={(r)=>{
            const existing = (cfg.rekening||[]).findIndex(x=>x.id===r.id);
            if (existing>=0) setRek((cfg.rekening||[]).map((x,i)=>i===existing?r:x));
            else setRek([...(cfg.rekening||[]),r]);
          }}
        />
      )}
    </div>
  );
}
