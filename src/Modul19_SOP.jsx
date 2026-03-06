import { useState, useEffect } from "react";

// ============================================================
// CSS
// ============================================================
const CSS = `
  .sp-wrap { display:flex; flex-direction:column; gap:16px; }
  .sp-tabs { display:flex; gap:0; background:#fff; border-radius:12px; border:1px solid #e5e7eb; overflow:hidden; }
  .sp-tab  { flex:1; padding:11px 8px; font-size:11px; font-weight:600; color:#9ca3af; cursor:pointer; text-align:center; border-right:1px solid #f3f4f6; transition:all .12s; }
  .sp-tab:last-child { border-right:none; }
  .sp-tab.active { color:#ea580c; background:#fff7ed; border-bottom:2px solid #f97316; }

  .sp-widget { background:#fff; border-radius:12px; border:1px solid #e5e7eb; overflow:hidden; }
  .sp-widget-head { padding:13px 18px 10px; border-bottom:1px solid #f3f4f6; display:flex; align-items:center; justify-content:space-between; }
  .sp-widget-title { font-size:13px; font-weight:700; color:#111827; }
  .sp-body { padding:18px; display:flex; flex-direction:column; gap:14px; }

  .sp-section-title { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#9ca3af; margin-bottom:8px; display:flex; align-items:center; gap:6px; }
  .sp-section-title::after { content:''; flex:1; height:1px; background:#f3f4f6; }

  .sp-checklist-item { display:flex; align-items:flex-start; gap:10px; padding:8px 10px; border-radius:8px; border:1px solid #f3f4f6; margin-bottom:6px; background:#fff; transition:background .1s; }
  .sp-checklist-item:hover { background:#fafafa; }
  .sp-cl-num { width:22px; height:22px; border-radius:6px; background:#f97316; color:#fff; font-size:10px; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:1px; }
  .sp-cl-text { font-size:12px; color:#374151; line-height:1.5; flex:1; }
  .sp-cl-cat  { font-size:10px; padding:1px 7px; border-radius:20px; background:#f3f4f6; color:#6b7280; flex-shrink:0; font-weight:500; }

  .sp-btn { display:inline-flex; align-items:center; gap:5px; padding:8px 14px; border-radius:8px; font-size:12px; font-weight:600; border:none; cursor:pointer; font-family:inherit; transition:all .15s; }
  .sp-btn.primary { background:linear-gradient(135deg,#f97316,#ea580c); color:#fff; }
  .sp-btn.ghost   { background:#f3f4f6; color:#4b5563; }
  .sp-btn.danger  { background:#fee2e2; color:#dc2626; }
  .sp-btn:disabled { opacity:.4; cursor:not-allowed; }

  .sp-input { padding:9px 12px; border-radius:8px; border:1.5px solid #e5e7eb; font-size:12px; font-family:inherit; color:#1f2937; outline:none; width:100%; box-sizing:border-box; transition:border-color .12s; }
  .sp-input:focus { border-color:#f97316; }
  .sp-select { padding:9px 10px; border-radius:8px; border:1.5px solid #e5e7eb; font-size:12px; font-family:inherit; color:#374151; outline:none; background:#fff; cursor:pointer; width:100%; }
  .sp-select:focus { border-color:#f97316; }
  .sp-label { font-size:11px; font-weight:600; color:#6b7280; margin-bottom:4px; display:block; text-transform:uppercase; letter-spacing:.4px; }

  .sp-sop-step { display:flex; gap:12px; padding:10px 0; border-bottom:1px solid #f9fafb; }
  .sp-sop-step:last-child { border-bottom:none; }
  .sp-sop-num { width:26px; height:26px; border-radius:8px; background:linear-gradient(135deg,#f97316,#ea580c); color:#fff; font-size:11px; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .sp-sop-content { flex:1; }
  .sp-sop-title { font-size:12px; font-weight:600; color:#1f2937; }
  .sp-sop-desc  { font-size:11px; color:#9ca3af; margin-top:2px; }

  .sp-kpi-row { display:flex; align-items:center; justify-content:space-between; padding:8px 0; border-bottom:1px solid #f3f4f6; }
  .sp-kpi-row:last-child { border-bottom:none; }
  .sp-kpi-key { font-size:12px; color:#374151; }
  .sp-kpi-val { font-size:12px; font-weight:700; color:#f97316; }

  .sp-inv-item { display:flex; align-items:center; justify-content:space-between; padding:8px 12px; background:#f9fafb; border:1px solid #e5e7eb; border-radius:8px; }
  .sp-inv-item:hover { background:#fff7ed; border-color:#fed7aa; }
  .sp-inv-name { font-size:12px; font-weight:500; color:#1f2937; }
  .sp-inv-sub  { font-size:10px; color:#9ca3af; margin-top:1px; }
  .sp-inv-qty  { font-size:13px; font-weight:700; color:#f97316; }

  .sp-info-box { background:#f0fdf4; border:1px solid #86efac; border-radius:9px; padding:10px 14px; font-size:11px; color:#15803d; }
  .sp-warn-box { background:#fff7ed; border:1px solid #fed7aa; border-radius:9px; padding:10px 14px; font-size:11px; color:#9a3412; }
  .sp-save-bar { position:sticky; bottom:0; background:#fff; border-top:1px solid #e5e7eb; padding:12px 18px; display:flex; gap:8px; justify-content:flex-end; }

  /* Modal */
  .sp-overlay { position:fixed; inset:0; background:rgba(0,0,0,.45); display:flex; align-items:center; justify-content:center; z-index:1000; }
  .sp-modal { background:#fff; border-radius:16px; padding:28px; width:420px; max-width:95vw; box-shadow:0 20px 60px rgba(0,0,0,.18); }
  .sp-modal-title { font-size:16px; font-weight:800; color:#111827; margin-bottom:20px; }
  .sp-modal-field { margin-bottom:14px; }
  .sp-modal-actions { display:flex; gap:10px; justify-content:flex-end; margin-top:20px; }

  /* KPI edit input */
  .sp-kpi-input { width:120px; padding:6px 10px; border-radius:7px; border:1.5px solid #e5e7eb; font-size:12px; font-family:inherit; text-align:right; font-weight:700; color:#f97316; outline:none; }
  .sp-kpi-input:focus { border-color:#f97316; }

  .sp-empty { text-align:center; padding:32px 0; color:#9ca3af; }
  .sp-empty-icon { font-size:32px; margin-bottom:8px; }
`;

function StyleInjector() {
  useEffect(() => {
    const id = "senyuminn-sop-css";
    if (document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id; el.textContent = CSS;
    document.head.appendChild(el);
    return () => { const e = document.getElementById(id); if (e) e.remove(); };
  }, []);
  return null;
}

// \u2500\u2500\u2500 Kategori \u2500\u2500\u2500
const CATS_CHECKLIST = ["Kebersihan","Kamar Mandi","AC & Elektronik","Listrik","Furniture","Tekstil","Struktur","Elektronik","Inventaris","Dokumentasi","Pelaporan","Dasar","Lainnya"];
const CATS_INV       = ["buah","set","unit","lembar","pasang","botol","rol","karung"];

const CAT_COLORS = {
  "Kebersihan":"#3b82f6","Kamar Mandi":"#0891b2","AC & Elektronik":"#8b5cf6",
  "Listrik":"#f59e0b","Furniture":"#10b981","Tekstil":"#ec4899","Struktur":"#6b7280",
  "Elektronik":"#7c3aed","Inventaris":"#f97316","Dokumentasi":"#14b8a6","Pelaporan":"#64748b",
  "Dasar":"#1f2937","Lainnya":"#9ca3af",
};

// \u2500\u2500\u2500 SOP Steps (konten statis, tidak perlu edit) \u2500\u2500\u2500
const SOP_CHECKIN = [
  {title:"Verifikasi identitas penyewa",desc:"Cocokkan KTP fisik dengan data yang diinput di sistem"},
  {title:"Upload foto KTP ke sistem",desc:"Foto harus jelas dan terbaca"},
  {title:"Review surat perjanjian bersama",desc:"Bacakan poin penting: harga, durasi, aturan, denda"},
  {title:"Tanda tangan surat perjanjian",desc:"2 rangkap: 1 untuk penyewa, 1 untuk arsip kost"},
  {title:"Pembayaran lunas",desc:"Konfirmasi transfer masuk sebelum serahkan kunci"},
  {title:"Serahkan kunci kamar",desc:"Test kunci bersama penyewa sebelum ditinggal"},
  {title:"Foto kondisi kamar saat check-in",desc:"Dokumentasi untuk referensi saat check-out"},
  {title:"Update status kamar di sistem",desc:"Ubah dari Booked \u2192 Terisi"},
];
const SOP_CHECKOUT = [
  {title:"Reminder H-30 kepada penyewa",desc:"Tanyakan rencana perpanjang atau tidak"},
  {title:"Generate surat tagihan perpanjangan H-7",desc:"Kirim via WhatsApp jika tidak perpanjang"},
  {title:"Kunjungi kamar bersama penyewa",desc:"Cek kondisi kamar \u2014 bandingkan dengan foto check-in"},
  {title:"Catat kerusakan jika ada",desc:"Buat tiket maintenance dan hitung biaya ganti rugi"},
  {title:"Penyewa kembalikan kunci",desc:"Pastikan semua kunci dikembalikan"},
  {title:"Update status kamar \u2192 Deep Clean",desc:"Assign staff pagi untuk deep clean"},
  {title:"Notifikasi ke grup WA",desc:"Info kamar tersedia setelah deep clean selesai"},
  {title:"Selesaikan administrasi",desc:"Archive data penyewa di modul Riwayat"},
];
const SOP_KELUHAN = [
  {title:"Terima laporan keluhan",desc:"Via sistem atau langsung dari penyewa"},
  {title:"Kategorikan dan set prioritas",desc:"Normal: koordinasi jadwal \u00b7 Urgent: tindak < 1 jam"},
  {title:"[URGENT] Notifikasi WA langsung ke PJ",desc:"PJ wajib balas konfirmasi dalam 15 menit"},
  {title:"Assign ke staff yang tersedia",desc:"Staff pagi untuk siang, staff malam untuk malam"},
  {title:"Staff tangani dan update progress",desc:"Update status tiket: In Progress"},
  {title:"Foto sebelum dan sesudah perbaikan",desc:"Upload ke sistem sebagai dokumentasi"},
  {title:"Input biaya material jika ada",desc:"Masuk ke kas sebagai pengeluaran Maintenance"},
  {title:"Tutup tiket dan konfirmasi ke penyewa",desc:"Tanyakan apakah masalah sudah terselesaikan"},
];

// ============================================================
// MODAL TAMBAH ITEM CHECKLIST
// ============================================================
function ModalTambahChecklist({ onClose, onSave }) {
  const [text, setText] = useState("");
  const [cat,  setCat]  = useState("Kebersihan");
  return (
    <div className="sp-overlay" onClick={onClose}>
      <div className="sp-modal" onClick={e => e.stopPropagation()}>
        <div className="sp-modal-title">\u2795 Tambah Item Checklist</div>
        <div className="sp-modal-field">
          <label className="sp-label">Deskripsi Item</label>
          <input
            className="sp-input"
            placeholder="Contoh: Bersihkan ventilasi udara..."
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && text.trim()) onSave(text.trim(), cat); }}
            autoFocus
          />
        </div>
        <div className="sp-modal-field">
          <label className="sp-label">Kategori</label>
          <select className="sp-select" value={cat} onChange={e => setCat(e.target.value)}>
            {CATS_CHECKLIST.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="sp-modal-actions">
          <button className="sp-btn ghost" onClick={onClose}>Batal</button>
          <button className="sp-btn primary" disabled={!text.trim()} onClick={() => onSave(text.trim(), cat)}>
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MODAL TAMBAH INVENTARIS
// ============================================================
function ModalTambahInventaris({ item, onClose, onSave }) {
  // item ada = mode edit, null = mode tambah
  const [nama, setNama]   = useState(item?.nama  || "");
  const [qty,  setQty]    = useState(item?.qty   || 1);
  const [sat,  setSat]    = useState(item?.satuan || "buah");
  return (
    <div className="sp-overlay" onClick={onClose}>
      <div className="sp-modal" onClick={e => e.stopPropagation()}>
        <div className="sp-modal-title">{item ? "\u270f\ufe0f Edit Item Inventaris" : "\u2795 Tambah Item Inventaris"}</div>
        <div className="sp-modal-field">
          <label className="sp-label">Nama Fasilitas</label>
          <input
            className="sp-input"
            placeholder="Contoh: Cermin, Kulkas, Dispenser..."
            value={nama}
            onChange={e => setNama(e.target.value)}
            autoFocus
          />
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <div className="sp-modal-field">
            <label className="sp-label">Jumlah</label>
            <input
              className="sp-input"
              type="number"
              min={1}
              value={qty}
              onChange={e => setQty(Math.max(1, parseInt(e.target.value)||1))}
            />
          </div>
          <div className="sp-modal-field">
            <label className="sp-label">Satuan</label>
            <select className="sp-select" value={sat} onChange={e => setSat(e.target.value)}>
              {CATS_INV.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="sp-modal-actions">
          <button className="sp-btn ghost" onClick={onClose}>Batal</button>
          <button
            className="sp-btn primary"
            disabled={!nama.trim()}
            onClick={() => onSave({ nama: nama.trim(), qty, satuan: sat })}
          >
            {item ? "Simpan Perubahan" : "Tambah"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// CHECKLIST EDITOR (Weekly & Deep Clean)
// ============================================================
function ChecklistEditor({ list, setList, title, subtitle, isReadOnly }) {
  const [showModal, setShowModal] = useState(false);

  const handleAdd = (text, cat) => {
    setList(prev => [...prev, { id: Date.now(), text, cat }]);
    setShowModal(false);
  };

  const handleDelete = (id) => {
    setList(prev => prev.filter(i => i.id !== id));
  };

  const grouped = CATS_CHECKLIST.reduce((acc, cat) => {
    const items = list.filter(i => i.cat === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {});

  return (
    <>
      <div className="sp-widget">
        <div className="sp-widget-head">
          <div>
            <div className="sp-widget-title">{title}</div>
            {subtitle && <div style={{ fontSize:11, color:"#9ca3af", marginTop:2 }}>{subtitle}</div>}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:11, color:"#9ca3af" }}>{list.length} item</span>
            {!isReadOnly && (
              <button className="sp-btn primary" style={{ padding:"6px 12px" }} onClick={() => setShowModal(true)}>
                \u2795 Tambah Item
              </button>
            )}
          </div>
        </div>
        <div className="sp-body">
          {list.length === 0 ? (
            <div className="sp-empty">
              <div className="sp-empty-icon">\ud83d\udccb</div>
              <div style={{ fontSize:13, fontWeight:600, color:"#374151" }}>Belum ada item checklist</div>
              <div style={{ fontSize:12, marginTop:4 }}>Klik \u2795 Tambah Item untuk mulai membuat checklist</div>
            </div>
          ) : (
            Object.entries(grouped).map(([cat, items]) => (
              <div key={cat}>
                <div className="sp-section-title">
                  <span style={{ width:8, height:8, borderRadius:"50%", background: CAT_COLORS[cat]||"#9ca3af", display:"inline-block" }} />
                  {cat}
                </div>
                {items.map((item, i) => (
                  <div key={item.id} className="sp-checklist-item">
                    <div className="sp-cl-num">{list.indexOf(item) + 1}</div>
                    <div className="sp-cl-text">{item.text}</div>
                    {!isReadOnly && (
                      <button
                        style={{ background:"none", border:"none", cursor:"pointer", color:"#dc2626", fontSize:14, padding:"0 4px", flexShrink:0 }}
                        onClick={() => handleDelete(item.id)}
                        title="Hapus"
                      >\u2715</button>
                    )}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <ModalTambahChecklist onClose={() => setShowModal(false)} onSave={handleAdd} />
      )}
    </>
  );
}

// ============================================================
// SOP VIEW (read-only steps)
// ============================================================
function SOPView({ steps, title }) {
  return (
    <div className="sp-widget">
      <div className="sp-widget-head">
        <div className="sp-widget-title">{title}</div>
        <span style={{ fontSize:11, color:"#9ca3af" }}>{steps.length} langkah</span>
      </div>
      <div className="sp-body">
        {steps.map((s, i) => (
          <div key={i} className="sp-sop-step">
            <div className="sp-sop-num">{i + 1}</div>
            <div className="sp-sop-content">
              <div className="sp-sop-title">{s.title}</div>
              <div className="sp-sop-desc">{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// KPI & INSENTIF \u2014 editable langsung
// ============================================================
function TabKPI({ pengaturanConfig, setPengaturanConfig, isReadOnly }) {
  const cfg = pengaturanConfig || {};
  const [dirty, setDirty] = useState(false);

  const fields = [
    { key:"kpiThresholdPct",       label:"Kehadiran minimum (%)",       suffix:"%",   type:"number", min:50, max:100 },
    { key:"nominalInsentif",        label:"Nominal insentif",            suffix:"Rp",  type:"rupiah" },
    { key:"dendaIjinTidakSah",      label:"Denda ijin tidak sah / hari", suffix:"Rp",  type:"rupiah" },
    { key:"lemburPerShift",         label:"Lembur per shift",            suffix:"Rp",  type:"rupiah" },
    { key:"maxPinjamanKoperasi",    label:"Maks pinjaman koperasi",      suffix:"Rp",  type:"rupiah" },
  ];

  const defaults = {
    kpiThresholdPct: 90, nominalInsentif: 500000,
    dendaIjinTidakSah: 50000, lemburPerShift: 50000, maxPinjamanKoperasi: 700000,
  };

  const val = (key) => cfg[key] ?? defaults[key];

  const update = (key, raw) => {
    const num = parseInt(String(raw).replace(/\D/g,"")) || 0;
    setPengaturanConfig(prev => ({ ...prev, [key]: num }));
    setDirty(true);
  };

  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
      {/* Edit Fields */}
      <div className="sp-widget">
        <div className="sp-widget-head">
          <div className="sp-widget-title">\ud83c\udfaf Threshold & Nominal KPI</div>
          {dirty && !isReadOnly && (
            <span style={{ fontSize:11, color:"#f97316", fontWeight:600 }}>\u25cf Ada perubahan</span>
          )}
        </div>
        <div className="sp-body">
          {fields.map(f => (
            <div key={f.key} className="sp-kpi-row">
              <span className="sp-kpi-key">{f.label}</span>
              {isReadOnly ? (
                <span className="sp-kpi-val">
                  {f.type === "rupiah"
                    ? "Rp " + val(f.key).toLocaleString("id-ID")
                    : val(f.key) + f.suffix}
                </span>
              ) : (
                <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                  {f.suffix === "Rp" && (
                    <span style={{ fontSize:11, color:"#9ca3af" }}>Rp</span>
                  )}
                  <input
                    className="sp-kpi-input"
                    type="text"
                    value={val(f.key).toLocaleString("id-ID")}
                    onChange={e => update(f.key, e.target.value)}
                  />
                  {f.suffix === "%" && (
                    <span style={{ fontSize:11, color:"#9ca3af" }}>%</span>
                  )}
                </div>
              )}
            </div>
          ))}
          {!isReadOnly && (
            <div className="sp-info-box" style={{ marginTop:4 }}>
              \u270f\ufe0f Perubahan langsung tersimpan ke konfigurasi sistem
            </div>
          )}
        </div>
      </div>

      {/* Cara Hitung */}
      <div className="sp-widget">
        <div className="sp-widget-head">
          <div className="sp-widget-title">\ud83d\udcca Cara Hitung KPI</div>
        </div>
        <div className="sp-body">
          {[
            { n:"1", title:"Hitung hari kerja wajib",    desc:"Total hari dalam bulan dikurangi hari libur resmi" },
            { n:"2", title:"Hitung kehadiran aktual",    desc:"Jumlah hari dengan kode: P, M, SM, IN, L, LL, PL, LS" },
            { n:"3", title:"Hitung persentase",          desc:"(Kehadiran aktual \u00f7 Hari kerja wajib) \u00d7 100%" },
            { n:"4", title:"Bandingkan dengan threshold",desc:`Jika \u2265 ${val("kpiThresholdPct")}% \u2192 dapat insentif Rp ${val("nominalInsentif").toLocaleString("id-ID")}` },
            { n:"5", title:"Hitung potongan",            desc:`Ijin Tidak Sah \u2192 potong Rp ${val("dendaIjinTidakSah").toLocaleString("id-ID")}/hari dari gaji` },
          ].map(s => (
            <div key={s.n} className="sp-sop-step">
              <div className="sp-sop-num" style={{ background:"linear-gradient(135deg,#3b82f6,#2563eb)" }}>{s.n}</div>
              <div className="sp-sop-content">
                <div className="sp-sop-title">{s.title}</div>
                <div className="sp-sop-desc">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// TAB INVENTARIS KAMAR
// ============================================================
function TabInventaris({ inventaris, setInventaris, setPengaturanConfig, isReadOnly }) {
  const [showModal,  setShowModal]  = useState(false);
  const [editItem,   setEditItem]   = useState(null); // item yg sedang diedit
  const [dirty,      setDirty]      = useState(false);

  const handleAdd = ({ nama, qty, satuan }) => {
    setInventaris(prev => [...prev, { id: Date.now(), nama, qty, satuan }]);
    setDirty(true);
    setShowModal(false);
  };

  const handleEdit = ({ nama, qty, satuan }) => {
    setInventaris(prev => prev.map(i => i.id === editItem.id ? { ...i, nama, qty, satuan } : i));
    setDirty(true);
    setEditItem(null);
  };

  const handleDelete = (id) => {
    setInventaris(prev => prev.filter(i => i.id !== id));
    setDirty(true);
  };

  const handleSave = () => {
    setPengaturanConfig(prev => ({ ...prev, inventarisKamar: inventaris }));
    setDirty(false);
  };

  return (
    <>
      <div className="sp-widget">
        <div className="sp-widget-head">
          <div>
            <div className="sp-widget-title">\ud83d\udce6 Inventaris Fasilitas Standar per Kamar</div>
            <div style={{ fontSize:11, color:"#9ca3af", marginTop:2 }}>
              Template referensi saat deep clean & check-out
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:11, color:"#9ca3af" }}>{inventaris.length} item</span>
            {!isReadOnly && (
              <button className="sp-btn primary" style={{ padding:"6px 12px" }} onClick={() => setShowModal(true)}>
                \u2795 Tambah Item
              </button>
            )}
          </div>
        </div>

        <div className="sp-body">
          {inventaris.length === 0 ? (
            <div className="sp-empty">
              <div className="sp-empty-icon">\ud83d\udce6</div>
              <div style={{ fontSize:13, fontWeight:600, color:"#374151" }}>Belum ada item inventaris</div>
              <div style={{ fontSize:12, marginTop:4 }}>
                Klik \u2795 Tambah Item untuk mendefinisikan fasilitas standar kamar
              </div>
            </div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {inventaris.map(item => (
                <div key={item.id} className="sp-inv-item">
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <span style={{ fontSize:18 }}>\ud83d\udce6</span>
                    <div>
                      <div className="sp-inv-name">{item.nama}</div>
                      <div className="sp-inv-sub">{item.satuan}</div>
                    </div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span className="sp-inv-qty">{item.qty}x</span>
                    {!isReadOnly && (
                      <>
                        <button
                          style={{ background:"none", border:"none", cursor:"pointer", fontSize:13, color:"#6b7280", padding:"2px 5px" }}
                          onClick={() => setEditItem(item)}
                          title="Edit"
                        >\u270f\ufe0f</button>
                        <button
                          style={{ background:"none", border:"none", cursor:"pointer", fontSize:13, color:"#dc2626", padding:"2px 5px" }}
                          onClick={() => handleDelete(item.id)}
                          title="Hapus"
                        >\u2715</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="sp-info-box">
            \ud83d\udccb Inventaris ini digunakan sebagai referensi saat deep clean dan check-out untuk verifikasi kelengkapan fasilitas kamar.
          </div>
        </div>

        {!isReadOnly && dirty && (
          <div className="sp-save-bar">
            <button className="sp-btn ghost" onClick={() => { setDirty(false); }}>Batalkan</button>
            <button className="sp-btn primary" onClick={handleSave}>\u2705 Simpan Perubahan</button>
          </div>
        )}
      </div>

      {/* Modal tambah */}
      {showModal && (
        <ModalTambahInventaris onClose={() => setShowModal(false)} onSave={handleAdd} />
      )}

      {/* Modal edit */}
      {editItem && (
        <ModalTambahInventaris item={editItem} onClose={() => setEditItem(null)} onSave={handleEdit} />
      )}
    </>
  );
}

// ============================================================
// EXPORT DEFAULT
// ============================================================
export default function SOP({ user, globalData = {} }) {
  const {
    pengaturanConfig = {}, setPengaturanConfig = () => {},
    isReadOnly       = false,
  } = globalData;

  const [tab, setTab] = useState("weekly");

  // Checklist dari pengaturanConfig supaya persist, fallback ke kosong
  const [weeklyList,    setWeeklyList]   = useState(pengaturanConfig.weeklyChecklist    || []);
  const [deepcleanList, setDCList]       = useState(pengaturanConfig.deepcleanChecklist || []);

  // Inventaris dari pengaturanConfig, default KOSONG
  const [inventaris, setInventaris] = useState(pengaturanConfig.inventarisKamar || []);

  // Sync ke pengaturanConfig saat checklist berubah
  useEffect(() => {
    setPengaturanConfig(prev => ({ ...prev, weeklyChecklist: weeklyList }));
  }, [weeklyList]);

  useEffect(() => {
    setPengaturanConfig(prev => ({ ...prev, deepcleanChecklist: deepcleanList }));
  }, [deepcleanList]);

  const TABS = [
    { id:"weekly",    label:"\u2705 Weekly Service" },
    { id:"deepclean", label:"\u2728 Deep Clean" },
    { id:"sop",       label:"\ud83d\udccb SOP Alur" },
    { id:"kpi",       label:"\ud83c\udfaf KPI & Insentif" },
    { id:"inventaris",label:"\ud83d\udce6 Inventaris Kamar" },
  ];

  return (
    <div className="sp-wrap">
      <StyleInjector />

      {/* Tabs */}
      <div className="sp-tabs">
        {TABS.map(t => (
          <div key={t.id} className={`sp-tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
            {t.label}
          </div>
        ))}
      </div>

      {/* Weekly Service */}
      {tab === "weekly" && (
        <ChecklistEditor
          list={weeklyList}
          setList={setWeeklyList}
          title="\ud83e\uddf9 Checklist Weekly Service"
          subtitle="Dilakukan 1x seminggu per kamar oleh staff pagi"
          isReadOnly={isReadOnly}
        />
      )}

      {/* Deep Clean */}
      {tab === "deepclean" && (
        <ChecklistEditor
          list={deepcleanList}
          setList={setDCList}
          title="\u2728 Checklist Deep Clean"
          subtitle="Dilakukan setelah check-out, sebelum kamar disewakan kembali"
          isReadOnly={isReadOnly}
        />
      )}

      {/* SOP Alur */}
      {tab === "sop" && (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <SOPView steps={SOP_CHECKIN}  title="\ud83d\udd11 SOP Check-in Penyewa" />
          <SOPView steps={SOP_CHECKOUT} title="\ud83d\udce6 SOP Check-out Penyewa" />
          <SOPView steps={SOP_KELUHAN}  title="\ud83d\udd27 SOP Penanganan Keluhan Urgent" />
        </div>
      )}

      {/* KPI & Insentif */}
      {tab === "kpi" && (
        <TabKPI
          pengaturanConfig={pengaturanConfig}
          setPengaturanConfig={setPengaturanConfig}
          isReadOnly={isReadOnly}
        />
      )}

      {/* Inventaris Kamar */}
      {tab === "inventaris" && (
        <TabInventaris
          inventaris={inventaris}
          setInventaris={setInventaris}
          setPengaturanConfig={setPengaturanConfig}
          isReadOnly={isReadOnly}
        />
      )}
    </div>
  );
}
