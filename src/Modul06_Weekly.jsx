import { useState } from "react";

const JADWAL_DATA = [];

const STAFF_LIST = [];

const CHECKLIST_ITEMS = [
  { key:"kamar", label:"Kebersihan Kamar", icon:"🛏️" },
  { key:"selasar", label:"Selasar & Tangga", icon:"🚪" },
  { key:"kamamandi", label:"Kamar Mandi", icon:"🚿" },
  { key:"parkir", label:"Parkiran Lt 1", icon:"🚗" },
];

const STATUS_CFG = {
  selesai:    { label:"Selesai", color:"#22c55e", bg:"#dcfce7" },
  aktif:      { label:"Aktif", color:"#f97316", bg:"#ffedd5" },
  terjadwal:  { label:"Terjadwal", color:"#3b82f6", bg:"#dbeafe" },
  ditunda:    { label:"Ditunda", color:"#eab308", bg:"#fef9c3" },
};

const Badge = ({ color, bg, children }) => (
  <span style={{ display:"inline-flex", alignItems:"center", padding:"2px 8px", borderRadius:20, fontSize:11, fontWeight:600, color, background:bg }}>
    {children}
  </span>
);

const Btn = ({ onClick, variant="primary", children, style={} }) => (
  <button
    onClick={onClick}
    style={{
      padding:"7px 14px", borderRadius:8, fontSize:13, fontWeight:600,
      cursor:"pointer", border:"none", display:"inline-flex", alignItems:"center", gap:6,
      background: variant==="primary" ? "linear-gradient(135deg,#f97316,#ea580c)" : "#f1f5f9",
      color: variant==="primary" ? "#fff" : "#475569",
      ...style,
    }}
  >
    {children}
  </button>
);

const W = {
  widget: { background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", overflow:"hidden" },
  whead: { padding:"12px 16px 10px", borderBottom:"1px solid #f3f4f6", display:"flex", alignItems:"center", justifyContent:"space-between" },
  wtitle: { fontSize:13, fontWeight:700, color:"#111827" },
  wbody: { padding:16 },
};

function ModalTambahJadwal({ onClose }) {
  const [tanggal, setTanggal] = useState("2026-03-10");
  const [staff, setStaff] = useState(STAFF_LIST[0]);
  const [kamarList, setKamarList] = useState([]);
  const [catatan, setCatatan] = useState("");

  const toggleKamar = (num) => {
    setKamarList(prev => prev.includes(num) ? prev.filter(k => k !== num) : [...prev, num]);
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }} onClick={onClose}>
      <div style={{ background:"#fff", borderRadius:16, padding:24, width:460, maxHeight:"85vh", overflowY:"auto" }} onClick={e => e.stopPropagation()}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div style={{ fontSize:16, fontWeight:700, color:"#111827" }}>Tambah Jadwal Service</div>
          <button onClick={onClose} style={{ background:"#f3f4f6", border:"none", borderRadius:8, padding:"6px 10px", cursor:"pointer", fontSize:14, color:"#6b7280" }}>✕</button>
        </div>

        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:12, fontWeight:600, color:"#374151", display:"block", marginBottom:5 }}>Tanggal</label>
          <input type="date" value={tanggal} onChange={e => setTanggal(e.target.value)} style={{ width:"100%", padding:"8px 11px", borderRadius:8, border:"1.5px solid #e5e7eb", fontSize:13, boxSizing:"border-box" }} />
        </div>

        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:12, fontWeight:600, color:"#374151", display:"block", marginBottom:5 }}>Staff Pelaksana</label>
          <select value={staff} onChange={e => setStaff(e.target.value)} style={{ width:"100%", padding:"8px 11px", borderRadius:8, border:"1.5px solid #e5e7eb", fontSize:13, boxSizing:"border-box" }}>
            {STAFF_LIST.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:12, fontWeight:600, color:"#374151", display:"block", marginBottom:8 }}>Pilih Kamar (maks 3)</label>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:6 }}>
            {Array.from({length:12}, (_, i) => i+1).map(num => (
              <button
                key={num}
                onClick={() => kamarList.length < 3 || kamarList.includes(num) ? toggleKamar(num) : null}
                style={{
                  padding:"6px 4px", borderRadius:6, fontSize:12, fontWeight:600,
                  cursor:"pointer", border:"1.5px solid",
                  borderColor: kamarList.includes(num) ? "#f97316" : "#e5e7eb",
                  background: kamarList.includes(num) ? "#fff7ed" : "#fff",
                  color: kamarList.includes(num) ? "#ea580c" : "#374151",
                }}
              >
                {num}
              </button>
            ))}
          </div>
          {kamarList.length > 0 && (
            <div style={{ fontSize:12, color:"#f97316", marginTop:6 }}>
              Dipilih: Kamar {kamarList.join(", ")}
            </div>
          )}
        </div>

        <div style={{ marginBottom:20 }}>
          <label style={{ fontSize:12, fontWeight:600, color:"#374151", display:"block", marginBottom:5 }}>Catatan (opsional)</label>
          <textarea
            value={catatan}
            onChange={e => setCatatan(e.target.value)}
            rows={2}
            placeholder="Instruksi khusus untuk staff..."
            style={{ width:"100%", padding:"8px 11px", borderRadius:8, border:"1.5px solid #e5e7eb", fontSize:13, boxSizing:"border-box", resize:"none", fontFamily:"inherit" }}
          ></textarea>
        </div>

        <div style={{ display:"flex", gap:10 }}>
          <Btn style={{ flex:1, justifyContent:"center" }} onClick={onClose}>Simpan Jadwal</Btn>
          <Btn variant="secondary" style={{ flex:1, justifyContent:"center" }} onClick={onClose}>Batal</Btn>
        </div>
      </div>
    </div>
  );
}

function ModalChecklist({ jadwal, onClose }) {
  const [checks, setChecks] = useState({ ...jadwal.checklist });
  const [foto, setFoto] = useState(null);
  const [catatan, setCatatan] = useState("");

  const toggle = (key) => setChecks(prev => ({ ...prev, [key]: !prev[key] }));
  const done = Object.values(checks).filter(Boolean).length;
  const total = CHECKLIST_ITEMS.length;

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }} onClick={onClose}>
      <div style={{ background:"#fff", borderRadius:16, padding:24, width:460, maxHeight:"85vh", overflowY:"auto" }} onClick={e => e.stopPropagation()}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div>
            <div style={{ fontSize:16, fontWeight:700, color:"#111827" }}>Checklist Service</div>
            <div style={{ fontSize:12, color:"#9ca3af" }}>Kamar {jadwal.kamar.join(", ")} - {jadwal.tanggal}</div>
          </div>
          <button onClick={onClose} style={{ background:"#f3f4f6", border:"none", borderRadius:8, padding:"6px 10px", cursor:"pointer", fontSize:14, color:"#6b7280" }}>✕</button>
        </div>

        <div style={{ background:"#f8fafc", borderRadius:10, padding:12, marginBottom:16, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontSize:13, color:"#374151", fontWeight:600 }}>Progress</span>
          <span style={{ fontSize:14, fontWeight:800, color:"#f97316" }}>{done}/{total} selesai</span>
        </div>

        <div style={{ marginBottom:16 }}>
          {CHECKLIST_ITEMS.map(item => (
            <div
              key={item.key}
              onClick={() => toggle(item.key)}
              style={{
                display:"flex", alignItems:"center", gap:12, padding:"10px 12px",
                borderRadius:8, cursor:"pointer", marginBottom:6,
                background: checks[item.key] ? "#f0fdf4" : "#f9fafb",
                border: `1px solid ${checks[item.key] ? "#bbf7d0" : "#e5e7eb"}`,
              }}
            >
              <div style={{
                width:20, height:20, borderRadius:5, border:`2px solid ${checks[item.key] ? "#22c55e" : "#d1d5db"}`,
                background: checks[item.key] ? "#22c55e" : "#fff",
                display:"flex", alignItems:"center", justifyContent:"center",
                flexShrink:0, fontSize:12, color:"#fff",
              }}>
                {checks[item.key] ? "✓" : ""}
              </div>
              <span style={{ fontSize:13, color:"#111827" }}>{item.icon} {item.label}</span>
            </div>
          ))}
        </div>

        <div style={{ marginBottom:16 }}>
          <label style={{ fontSize:12, fontWeight:600, color:"#374151", display:"block", marginBottom:5 }}>Catatan Temuan</label>
          <textarea
            value={catatan}
            onChange={e => setCatatan(e.target.value)}
            rows={2}
            placeholder="Ada temuan kerusakan? Catat di sini..."
            style={{ width:"100%", padding:"8px 11px", borderRadius:8, border:"1.5px solid #e5e7eb", fontSize:13, boxSizing:"border-box", resize:"none", fontFamily:"inherit" }}
          ></textarea>
        </div>

        <div style={{ marginBottom:20 }}>
          <label style={{ fontSize:12, fontWeight:600, color:"#374151", display:"block", marginBottom:5 }}>Foto Dokumentasi</label>
          <div style={{ border:"2px dashed #e5e7eb", borderRadius:8, padding:"20px", textAlign:"center", cursor:"pointer", background:"#f9fafb" }}>
            <div style={{ fontSize:24, marginBottom:4 }}>📷</div>
            <div style={{ fontSize:12, color:"#9ca3af" }}>Klik untuk upload foto</div>
          </div>
        </div>

        <div style={{ display:"flex", gap:10 }}>
          <Btn style={{ flex:1, justifyContent:"center" }} onClick={onClose}>Simpan Laporan</Btn>
          <Btn variant="secondary" style={{ flex:1, justifyContent:"center" }} onClick={onClose}>Tutup</Btn>
        </div>
      </div>
  </div>
  );
}

export default function Modul06_Weekly({ user }) {
  const [modalTambah, setModalTambah] = useState(false);
  const [modalChecklist, setModalChecklist] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterBulan, setFilterBulan] = useState("2026-03");

  const isAdmin = user && user.role === "admin";

  const filtered = JADWAL_DATA.filter(j =>
    (filterStatus === "all" || j.status === filterStatus) &&
    j.tanggal.startsWith(filterBulan)
  );

  return (
    <div>
      {/* Header Actions */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div style={{ display:"flex", gap:8 }}>
          <select
            value={filterBulan}
            onChange={e => setFilterBulan(e.target.value)}
            style={{ padding:"7px 12px", borderRadius:8, border:"1.5px solid #e5e7eb", fontSize:13, background:"#fff" }}
          >
            <option value="2026-02">Februari 2026</option>
            <option value="2026-03">Maret 2026</option>
            <option value="2026-04">April 2026</option>
          </select>
          {["all","aktif","terjadwal","selesai","ditunda"].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              style={{
                padding:"7px 12px", borderRadius:8, fontSize:12, fontWeight:600,
                cursor:"pointer", border:"none",
                background: filterStatus === s ? "linear-gradient(135deg,#f97316,#ea580c)" : "#f1f5f9",
                color: filterStatus === s ? "#fff" : "#475569",
              }}
            >
              {s === "all" ? "Semua" : STATUS_CFG[s]?.label || s}
            </button>
          ))}
        </div>
        {isAdmin && (
          <Btn onClick={() => setModalTambah(true)}>+ Tambah Jadwal</Btn>
        )}
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
        {[
          { label:"Total Jadwal", value:JADWAL_DATA.length, color:"#111827" },
          { label:"Selesai", value:JADWAL_DATA.filter(j=>j.status==="selesai").length, color:"#22c55e" },
          { label:"Aktif", value:JADWAL_DATA.filter(j=>j.status==="aktif").length, color:"#f97316" },
          { label:"Terjadwal", value:JADWAL_DATA.filter(j=>j.status==="terjadwal").length, color:"#3b82f6" },
        ].map(s => (
          <div key={s.label} style={{ background:"#fff", borderRadius:10, border:"1px solid #e5e7eb", padding:"12px 16px" }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", marginBottom:4 }}>{s.label}</div>
            <div style={{ fontSize:22, fontWeight:800, color:s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Jadwal List */}
      <div style={W.widget}>
        <div style={W.whead}>
          <div style={W.wtitle}>📋 Daftar Jadwal Service</div>
          <span style={{ fontSize:12, color:"#9ca3af" }}>{filtered.length} jadwal</span>
        </div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"#f9fafb" }}>
                {["Tanggal","Kamar","Staff Pelaksana","Status","Checklist","Aksi"].map(h => (
                  <th key={h} style={{ padding:"10px 16px", textAlign:"left", fontSize:11, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(j => {
                const done = Object.values(j.checklist).filter(Boolean).length;
                const total = CHECKLIST_ITEMS.length;
                const pct = total > 0 ? Math.round(done/total*100) : 0;
                return (
                  <tr key={j.id} style={{ borderTop:"1px solid #f3f4f6" }}>
                    <td style={{ padding:"12px 16px", fontSize:13, color:"#111827" }}>{j.tanggal}</td>
                    <td style={{ padding:"12px 16px" }}>
                      <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                        {j.kamar.map(k => (
                          <span key={k} style={{ background:"#f1f5f9", borderRadius:6, padding:"2px 8px", fontSize:12, fontWeight:600, color:"#374151" }}>
                            {k}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding:"12px 16px", fontSize:13, color:"#374151" }}>{j.staff}</td>
                    <td style={{ padding:"12px 16px" }}>
                      <Badge color={STATUS_CFG[j.status]?.color || "#6b7280"} bg={STATUS_CFG[j.status]?.bg || "#f3f4f6"}>
                        {STATUS_CFG[j.status]?.label || j.status}
                      </Badge>
                    </td>
                    <td style={{ padding:"12px 16px" }}>
                      {total > 0 ? (
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <div style={{ width:60, height:6, background:"#e5e7eb", borderRadius:3, overflow:"hidden" }}>
                            <div style={{ width:`${pct}%`, height:"100%", background: pct===100 ? "#22c55e" : "#f97316", borderRadius:3 }}></div>
                          </div>
                          <span style={{ fontSize:12, color:"#6b7280" }}>{pct}%</span>
                        </div>
                      ) : (
                        <span style={{ fontSize:12, color:"#9ca3af" }}>—</span>
                      )}
                    </td>
                    <td style={{ padding:"12px 16px" }}>
                      {(j.status === "aktif" || (isAdmin && j.status === "terjadwal")) && (
                        <button
                          onClick={() => setModalChecklist(j)}
                          style={{ padding:"5px 12px", borderRadius:7, fontSize:12, fontWeight:600, cursor:"pointer", border:"none", background:"linear-gradient(135deg,#f97316,#ea580c)", color:"#fff" }}
                        >
                          {j.status === "aktif" ? "Isi Checklist" : "Lihat"}
                        </button>
                      )}
                      {j.status === "selesai" && (
                        <button
                          onClick={() => setModalChecklist(j)}
                          style={{ padding:"5px 12px", borderRadius:7, fontSize:12, fontWeight:600, cursor:"pointer", border:"none", background:"#f1f5f9", color:"#475569" }}
                        >
                          Lihat Laporan
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {modalTambah && <ModalTambahJadwal onClose={() => setModalTambah(false)} />}
      {modalChecklist && <ModalChecklist jadwal={modalChecklist} onClose={() => setModalChecklist(null)} />}
    </div>
  );
}