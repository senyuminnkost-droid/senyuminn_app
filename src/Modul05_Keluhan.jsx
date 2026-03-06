import { useState } from "react";

const TIKET_INIT = [];

const STATUS_CFG = {
  "open":        { label:"Open",        color:"#dc2626", bg:"#fee2e2" },
  "in-progress": { label:"In Progress", color:"#ea580c", bg:"#ffedd5" },
  "ditunda":     { label:"Ditunda",     color:"#ca8a04", bg:"#fef9c3" },
  "selesai":     { label:"Selesai",     color:"#16a34a", bg:"#dcfce7" },
};
const PRIORITAS_CFG = {
  "urgent": { label:"Urgent", color:"#dc2626", bg:"#fee2e2" },
  "normal": { label:"Normal", color:"#6b7280", bg:"#f3f4f6" },
};
const KATEGORI_LIST = ["Air","Listrik","Bangunan","Elektronik","Aksesoris Kamar Mandi","Lemari","Kabinet","AC Bermasalah","Lainnya"];

const Badge = ({ color, bg, children }) => (
  <span style={{ display:"inline-flex", alignItems:"center", padding:"2px 8px", borderRadius:20, fontSize:11, fontWeight:600, color, background:bg }}>
    {children}
  </span>
);

const W = {
  card: { background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", padding:"14px 16px", position:"relative", overflow:"hidden" },
  widget: { background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", overflow:"hidden" },
  whead: { padding:"12px 16px 10px", borderBottom:"1px solid #f3f4f6", display:"flex", alignItems:"center", justifyContent:"space-between" },
  wtitle: { fontSize:13, fontWeight:700, color:"#111827" },
};

function FormModal({ user, onClose, onSave }) {
  const [form, setForm] = useState({ lokasi:"unit", kamar:"", kategori:"", prioritas:"normal", deskripsi:"" });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const valid = form.kategori && form.deskripsi && (form.lokasi === "umum" || form.kamar);

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }} onClick={onClose}>
      <div style={{ background:"#fff", borderRadius:16, padding:28, width:480, maxHeight:"85vh", overflowY:"auto" }} onClick={e => e.stopPropagation()}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div style={{ fontSize:16, fontWeight:700, color:"#111827" }}>🔧 Buat Tiket Keluhan</div>
          <button onClick={onClose} style={{ background:"#f3f4f6", border:"none", borderRadius:8, padding:"6px 10px", cursor:"pointer", fontSize:14 }}>✕</button>
        </div>

        {[
          { label:"Lokasi", el: (
            <select value={form.lokasi} onChange={e => set("lokasi", e.target.value)}
              style={{ width:"100%", padding:"8px 11px", borderRadius:8, border:"1.5px solid #e5e7eb", fontSize:13, boxSizing:"border-box" }}>
              <option value="unit">Unit Kamar</option>
              <option value="umum">Fasilitas Umum</option>
            </select>
          )},
        ].map(f => (
          <div key={f.label} style={{ marginBottom:14 }}>
            <label style={{ fontSize:12, fontWeight:600, color:"#374151", display:"block", marginBottom:5 }}>{f.label}</label>
            {f.el}
          </div>
        ))}

        {form.lokasi === "unit" && (
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:12, fontWeight:600, color:"#374151", display:"block", marginBottom:5 }}>Nomor Kamar</label>
            <select value={form.kamar} onChange={e => set("kamar", e.target.value)}
              style={{ width:"100%", padding:"8px 11px", borderRadius:8, border:"1.5px solid #e5e7eb", fontSize:13, boxSizing:"border-box" }}>
              <option value="">Pilih kamar...</option>
              {Array.from({length:12},(_,i)=>i+1).map(n => <option key={n} value={n}>Kamar {n}</option>)}
            </select>
          </div>
        )}

        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:12, fontWeight:600, color:"#374151", display:"block", marginBottom:5 }}>Kategori</label>
          <select value={form.kategori} onChange={e => set("kategori", e.target.value)}
            style={{ width:"100%", padding:"8px 11px", borderRadius:8, border:"1.5px solid #e5e7eb", fontSize:13, boxSizing:"border-box" }}>
            <option value="">Pilih kategori...</option>
            {KATEGORI_LIST.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>

        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:12, fontWeight:600, color:"#374151", display:"block", marginBottom:5 }}>Prioritas</label>
          <div style={{ display:"flex", gap:8 }}>
            {["normal","urgent"].map(p => (
              <button key={p} onClick={() => set("prioritas", p)}
                style={{ flex:1, padding:"8px", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer",
                  border: form.prioritas===p ? `1.5px solid ${PRIORITAS_CFG[p].color}` : "1.5px solid #e5e7eb",
                  background: form.prioritas===p ? PRIORITAS_CFG[p].bg : "#fff",
                  color: form.prioritas===p ? PRIORITAS_CFG[p].color : "#6b7280" }}>
                {PRIORITAS_CFG[p].label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom:20 }}>
          <label style={{ fontSize:12, fontWeight:600, color:"#374151", display:"block", marginBottom:5 }}>Deskripsi Detail</label>
          <textarea value={form.deskripsi} onChange={e => set("deskripsi", e.target.value)}
            rows={3} placeholder="Jelaskan masalah secara detail..."
            style={{ width:"100%", padding:"8px 11px", borderRadius:8, border:"1.5px solid #e5e7eb", fontSize:13, boxSizing:"border-box", resize:"none", fontFamily:"inherit" }} />
        </div>

        <div style={{ display:"flex", gap:10 }}>
          <button onClick={() => { onSave(form); onClose(); }} disabled={!valid}
            style={{ flex:1, padding:"10px", borderRadius:8, border:"none", fontSize:13, fontWeight:600, cursor: valid ? "pointer" : "not-allowed",
              background: valid ? "linear-gradient(135deg,#f97316,#ea580c)" : "#e5e7eb",
              color: valid ? "#fff" : "#9ca3af" }}>Kirim Tiket</button>
          <button onClick={onClose}
            style={{ flex:1, padding:"10px", borderRadius:8, border:"none", background:"#f1f5f9", color:"#475569", fontSize:13, fontWeight:600, cursor:"pointer" }}>Batal</button>
        </div>
      </div>
    </div>
  );
}

function DetailModal({ tiket, isAdmin, onClose, onUpdateStatus }) {
  if (!tiket) return null;
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }} onClick={onClose}>
      <div style={{ background:"#fff", borderRadius:16, padding:28, width:480, maxHeight:"80vh", overflowY:"auto" }} onClick={e => e.stopPropagation()}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div>
            <div style={{ fontSize:18, fontWeight:800, color:"#111827" }}>Tiket {tiket.id}</div>
            <div style={{ fontSize:12, color:"#9ca3af" }}>{tiket.tanggal}</div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <Badge color={PRIORITAS_CFG[tiket.prioritas]?.color} bg={PRIORITAS_CFG[tiket.prioritas]?.bg}>{PRIORITAS_CFG[tiket.prioritas]?.label}</Badge>
            <Badge color={STATUS_CFG[tiket.status]?.color} bg={STATUS_CFG[tiket.status]?.bg}>{STATUS_CFG[tiket.status]?.label}</Badge>
          </div>
        </div>
        <div style={{ background:"#f8fafc", borderRadius:10, padding:16, marginBottom:16 }}>
          <div style={{ fontSize:12, fontWeight:700, color:"#9ca3af", marginBottom:6 }}>DETAIL TIKET</div>
          <div style={{ fontSize:14, fontWeight:600, color:"#111827", marginBottom:4 }}>
            {tiket.lokasi === "unit" ? `Kamar ${tiket.kamar}` : "Area Umum"} — {tiket.kategori}
          </div>
          <div style={{ fontSize:13, color:"#374151" }}>{tiket.deskripsi}</div>
          <div style={{ fontSize:12, color:"#9ca3af", marginTop:8 }}>Pelapor: {tiket.pelapor}</div>
        </div>

        {isAdmin && (
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:12, fontWeight:600, color:"#374151", marginBottom:8 }}>Update Status</div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {Object.entries(STATUS_CFG).map(([s, cfg]) => (
                <button key={s} onClick={() => onUpdateStatus(tiket.id, s)}
                  style={{ padding:"6px 12px", borderRadius:8, fontSize:12, fontWeight:600, cursor:"pointer",
                    border: tiket.status===s ? `1.5px solid ${cfg.color}` : "1.5px solid #e5e7eb",
                    background: tiket.status===s ? cfg.bg : "#fff",
                    color: tiket.status===s ? cfg.color : "#475569" }}>
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <button onClick={onClose}
          style={{ width:"100%", padding:"10px", borderRadius:8, border:"none", background:"#f1f5f9", color:"#475569", fontSize:13, fontWeight:600, cursor:"pointer" }}>Tutup</button>
      </div>
    </div>
  );
}

export default function Modul05_Keluhan({ user }) {
  const [tiketList, setTiketList] = useState(TIKET_INIT);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPrioritas, setFilterPrioritas] = useState("all");
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const isAdmin = user?.role === "admin";

  const filtered = tiketList.filter(t =>
    (filterStatus === "all" || t.status === filterStatus) &&
    (filterPrioritas === "all" || t.prioritas === filterPrioritas)
  );

  const stats = {
    open:       tiketList.filter(t => t.status === "open").length,
    inProgress: tiketList.filter(t => t.status === "in-progress").length,
    ditunda:    tiketList.filter(t => t.status === "ditunda").length,
    urgent:     tiketList.filter(t => t.prioritas === "urgent" && t.status !== "selesai").length,
  };

  const handleSave = (form) => {
    const newT = {
      ...form,
      id: `T${String(tiketList.length + 1).padStart(3,"0")}`,
      status: "open",
      tanggal: new Date().toISOString().slice(0,10),
      pelapor: user?.name || "Staff",
    };
    setTiketList(prev => [newT, ...prev]);
  };

  const updateStatus = (id, status) => {
    setTiketList(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    setSelected(prev => prev?.id === id ? { ...prev, status } : prev);
  };

  return (
    <div>
      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
        {[
          { label:"Open",        val:stats.open,       color:"#dc2626", sub:"Menunggu penanganan" },
          { label:"In Progress", val:stats.inProgress, color:"#ea580c", sub:"Sedang dikerjakan" },
          { label:"Ditunda",     val:stats.ditunda,    color:"#ca8a04", sub:"Dijadwalkan ulang" },
          { label:"Urgent",      val:stats.urgent,     color:"#dc2626", sub:"Perlu segera ditangani" },
        ].map(s => (
          <div key={s.label} style={W.card}>
            <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:s.color }} />
            <div style={{ fontSize:10, fontWeight:600, color:"#9ca3af", textTransform:"uppercase", letterSpacing:.8, marginBottom:4, marginTop:8 }}>{s.label}</div>
            <div style={{ fontSize:22, fontWeight:800, color:s.color }}>{s.val}</div>
            <div style={{ fontSize:11, color:"#6b7280", marginTop:3 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Filter + New Button */}
      <div style={{ display:"flex", gap:8, marginBottom:16, alignItems:"center", flexWrap:"wrap" }}>
        <span style={{ fontSize:13, color:"#64748b", fontWeight:600 }}>Status:</span>
        {["all","open","in-progress","ditunda","selesai"].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            style={{ padding:"6px 12px", borderRadius:8, fontSize:12, fontWeight:600, cursor:"pointer", border:"none",
              background: filterStatus===s ? "linear-gradient(135deg,#f97316,#ea580c)" : "#f1f5f9",
              color: filterStatus===s ? "#fff" : "#475569" }}>
            {s === "all" ? "Semua" : STATUS_CFG[s]?.label}
          </button>
        ))}
        <span style={{ fontSize:13, color:"#64748b", fontWeight:600, marginLeft:8 }}>Prioritas:</span>
        {["all","urgent","normal"].map(p => (
          <button key={p} onClick={() => setFilterPrioritas(p)}
            style={{ padding:"6px 12px", borderRadius:8, fontSize:12, fontWeight:600, cursor:"pointer", border:"none",
              background: filterPrioritas===p ? "linear-gradient(135deg,#f97316,#ea580c)" : "#f1f5f9",
              color: filterPrioritas===p ? "#fff" : "#475569" }}>
            {p === "all" ? "Semua" : PRIORITAS_CFG[p]?.label}
          </button>
        ))}
        <button onClick={() => setShowForm(true)}
          style={{ marginLeft:"auto", padding:"7px 16px", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer", border:"none",
            background:"linear-gradient(135deg,#f97316,#ea580c)", color:"#fff" }}>
          + Buat Tiket
        </button>
      </div>

      {/* Table */}
      <div style={W.widget}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:"#f9fafb" }}>
              {["ID","Lokasi","Kategori","Prioritas","Status","Tanggal","Deskripsi","Aksi"].map(h => (
                <th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:11, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:.5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding:"40px 0", textAlign:"center", color:"#9ca3af" }}>
                  <div style={{ fontSize:32, marginBottom:8 }}>🔧</div>
                  <div>Tidak ada tiket</div>
                </td>
              </tr>
            ) : filtered.map(t => (
              <tr key={t.id} style={{ borderTop:"1px solid #f3f4f6", cursor:"pointer" }} onClick={() => setSelected(t)}>
                <td style={{ padding:"12px 14px", fontSize:13, fontWeight:700, color:"#f97316" }}>{t.id}</td>
                <td style={{ padding:"12px 14px", fontSize:13, color:"#374151" }}>
                  {t.lokasi === "unit" ? `Kamar ${t.kamar}` : "Area Umum"}
                </td>
                <td style={{ padding:"12px 14px", fontSize:13, color:"#111827", fontWeight:500 }}>{t.kategori}</td>
                <td style={{ padding:"12px 14px" }}>
                  <Badge color={PRIORITAS_CFG[t.prioritas]?.color} bg={PRIORITAS_CFG[t.prioritas]?.bg}>
                    {PRIORITAS_CFG[t.prioritas]?.label}
                  </Badge>
                </td>
                <td style={{ padding:"12px 14px" }}>
                  <Badge color={STATUS_CFG[t.status]?.color} bg={STATUS_CFG[t.status]?.bg}>
                    {STATUS_CFG[t.status]?.label}
                  </Badge>
                </td>
                <td style={{ padding:"12px 14px", fontSize:12, color:"#9ca3af" }}>{t.tanggal}</td>
                <td style={{ padding:"12px 14px", fontSize:12, color:"#6b7280", maxWidth:200 }}>
                  <div style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{t.deskripsi}</div>
                </td>
                <td style={{ padding:"12px 14px" }} onClick={e => e.stopPropagation()}>
                  {isAdmin && t.status !== "selesai" && (
                    <select value={t.status} onChange={e => updateStatus(t.id, e.target.value)}
                      style={{ padding:"4px 8px", borderRadius:6, border:"1px solid #e5e7eb", fontSize:11, background:"#f9fafb", cursor:"pointer" }}>
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="ditunda">Ditunda</option>
                      <option value="selesai">Selesai</option>
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <DetailModal
          tiket={selected}
          isAdmin={isAdmin}
          onClose={() => setSelected(null)}
          onUpdateStatus={updateStatus}
        />
      )}

      {showForm && (
        <FormModal
          user={user}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
