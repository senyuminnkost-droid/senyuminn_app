import { useState } from "react";

const PENYEWA_DATA = [];

const fmt = (n) => "Rp " + n.toLocaleString("id-ID");

const Badge = ({ color, bg, children }) => (
  <span style={{ display:"inline-flex", alignItems:"center", padding:"2px 8px", borderRadius:20, fontSize:11, fontWeight:600, color, background:bg }}>
    {children}
  </span>
);

const Btn = ({ onClick, variant="primary", children, disabled, style={} }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      padding:"8px 16px", borderRadius:8, fontSize:13, fontWeight:600,
      cursor: disabled ? "not-allowed" : "pointer", border:"none",
      display:"inline-flex", alignItems:"center", gap:6,
      background: disabled ? "#e5e7eb" : variant === "primary" ? "linear-gradient(135deg,#f97316,#ea580c)" : "#f1f5f9",
      color: disabled ? "#9ca3af" : variant === "primary" ? "#fff" : "#475569",
      opacity: disabled ? 0.7 : 1,
      ...style,
    }}
  >
    {children}
  </button>
);

function ModalPenyewa({ penyewa, onClose, onSave }) {
  const isEdit = !!penyewa;
  const [form, setForm] = useState(penyewa || {
    kamar:"", nama:"", ktp:"", telp:"", tglMasuk:"", kontrakMulai:"",
    durasi:6, harga:"", partner:[], nodarurat:"", status:"aktif",
  });
  const [partnerInput, setPartnerInput] = useState("");
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const addPartner = () => {
    if (partnerInput.trim() && form.partner.length < 2) {
      set("partner", [...form.partner, partnerInput.trim()]);
      setPartnerInput("");
    }
  };
  const removePartner = (i) => set("partner", form.partner.filter((_, idx) => idx !== i));

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }} onClick={onClose}>
      <div style={{ background:"#fff", borderRadius:16, padding:28, width:520, maxHeight:"85vh", overflowY:"auto", boxShadow:"0 20px 60px rgba(0,0,0,0.15)" }} onClick={e => e.stopPropagation()}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div style={{ fontSize:16, fontWeight:700, color:"#111827" }}>{isEdit ? "Edit Penyewa" : "Tambah Penyewa"}</div>
          <button onClick={onClose} style={{ background:"#f3f4f6", border:"none", borderRadius:8, padding:"6px 10px", cursor:"pointer", fontSize:14 }}>✕</button>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
          {[
            { key:"nama",    label:"Nama Lengkap",   placeholder:"Nama sesuai KTP" },
            { key:"ktp",     label:"NIK / KTP",      placeholder:"16 digit NIK" },
            { key:"telp",    label:"No. HP",         placeholder:"08xx" },
            { key:"nodarurat", label:"Kontak Darurat", placeholder:"Nama - No. HP" },
          ].map(f => (
            <div key={f.key}>
              <label style={{ fontSize:12, fontWeight:600, color:"#374151", display:"block", marginBottom:5 }}>{f.label}</label>
              <input
                value={form[f.key] || ""}
                onChange={e => set(f.key, e.target.value)}
                placeholder={f.placeholder}
                style={{ width:"100%", padding:"8px 11px", borderRadius:8, border:"1.5px solid #e5e7eb", fontSize:13, boxSizing:"border-box" }}
              />
            </div>
          ))}
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14, marginBottom:14 }}>
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:"#374151", display:"block", marginBottom:5 }}>No. Kamar</label>
            <select value={form.kamar} onChange={e => set("kamar", Number(e.target.value))} style={{ width:"100%", padding:"8px 11px", borderRadius:8, border:"1.5px solid #e5e7eb", fontSize:13, boxSizing:"border-box" }}>
              <option value="">Pilih</option>
              {Array.from({length:12}, (_, i) => i+1).map(n => <option key={n} value={n}>Kamar {n}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:"#374151", display:"block", marginBottom:5 }}>Durasi (Bulan)</label>
            <select value={form.durasi} onChange={e => set("durasi", Number(e.target.value))} style={{ width:"100%", padding:"8px 11px", borderRadius:8, border:"1.5px solid #e5e7eb", fontSize:13, boxSizing:"border-box" }}>
              {[3,6,12].map(d => <option key={d} value={d}>{d} Bulan</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:"#374151", display:"block", marginBottom:5 }}>Harga/Bulan</label>
            <input
              value={form.harga || ""}
              onChange={e => set("harga", e.target.value)}
              placeholder="2500000"
              style={{ width:"100%", padding:"8px 11px", borderRadius:8, border:"1.5px solid #e5e7eb", fontSize:13, boxSizing:"border-box" }}
            />
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:"#374151", display:"block", marginBottom:5 }}>Tanggal Masuk</label>
            <input type="date" value={form.tglMasuk || ""} onChange={e => set("tglMasuk", e.target.value)} style={{ width:"100%", padding:"8px 11px", borderRadius:8, border:"1.5px solid #e5e7eb", fontSize:13, boxSizing:"border-box" }} />
          </div>
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:"#374151", display:"block", marginBottom:5 }}>Mulai Kontrak</label>
            <input type="date" value={form.kontrakMulai || ""} onChange={e => set("kontrakMulai", e.target.value)} style={{ width:"100%", padding:"8px 11px", borderRadius:8, border:"1.5px solid #e5e7eb", fontSize:13, boxSizing:"border-box" }} />
          </div>
        </div>

        <div style={{ marginBottom:20 }}>
          <label style={{ fontSize:12, fontWeight:600, color:"#374151", display:"block", marginBottom:5 }}>Partner (maks 2)</label>
          <div style={{ display:"flex", gap:8, marginBottom:8 }}>
            <input
              value={partnerInput}
              onChange={e => setPartnerInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addPartner()}
              placeholder="Nama partner..."
              style={{ flex:1, padding:"8px 11px", borderRadius:8, border:"1.5px solid #e5e7eb", fontSize:13 }}
            />
            <Btn onClick={addPartner} disabled={form.partner.length >= 2 || !partnerInput.trim()}>Tambah</Btn>
          </div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {form.partner.map((p, i) => (
              <span key={i} style={{ background:"#fff7ed", border:"1px solid #fed7aa", borderRadius:20, padding:"3px 10px", fontSize:12, display:"flex", alignItems:"center", gap:6 }}>
                {p}
                <button onClick={() => removePartner(i)} style={{ background:"none", border:"none", cursor:"pointer", color:"#9ca3af", fontSize:12 }}>✕</button>
              </span>
            ))}
          </div>
        </div>

        <div style={{ display:"flex", gap:10 }}>
          <Btn onClick={() => { onSave(form); onClose(); }} style={{ flex:1, justifyContent:"center" }}>
            {isEdit ? "Simpan Perubahan" : "Tambah Penyewa"}
          </Btn>
          <Btn variant="secondary" onClick={onClose} style={{ flex:1, justifyContent:"center" }}>Batal</Btn>
        </div>
      </div>
    </div>
  );
}

function DetailPanel({ penyewa, onClose, onEdit }) {
  if (!penyewa) return null;
  const daysLeft = penyewa.kontrakSelesai
    ? Math.ceil((new Date(penyewa.kontrakSelesai) - new Date()) / 86400000)
    : null;

  return (
    <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", overflow:"hidden", width:320, flexShrink:0 }}>
      <div style={{ padding:"14px 16px", background:"linear-gradient(135deg,#fff7ed,#ffedd5)", borderBottom:"1px solid #fed7aa", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ fontSize:14, fontWeight:700, color:"#111827" }}>Detail Penyewa</div>
        <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", fontSize:16, color:"#9ca3af" }}>✕</button>
      </div>
      <div style={{ padding:16 }}>
        <div style={{ textAlign:"center", marginBottom:16 }}>
          <div style={{ width:56, height:56, borderRadius:"50%", background:"linear-gradient(135deg,#f97316,#ea580c)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:22, fontWeight:700, margin:"0 auto 8px" }}>
            {penyewa.nama[0]}
          </div>
          <div style={{ fontSize:15, fontWeight:700, color:"#111827" }}>{penyewa.nama}</div>
          <div style={{ fontSize:12, color:"#9ca3af" }}>Kamar {penyewa.kamar}</div>
        </div>

        {[
          { label:"NIK / KTP",      value:penyewa.ktp },
          { label:"No. HP",         value:penyewa.telp },
          { label:"Kontak Darurat", value:penyewa.nodarurat },
          { label:"Tanggal Masuk",  value:penyewa.tglMasuk },
          { label:"Kontrak",        value:`${penyewa.kontrakMulai} s/d ${penyewa.kontrakSelesai || "-"}` },
          { label:"Harga",          value:fmt(penyewa.harga) },
        ].map(item => (
          <div key={item.label} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:"1px solid #f3f4f6" }}>
            <span style={{ fontSize:12, color:"#9ca3af" }}>{item.label}</span>
            <span style={{ fontSize:12, fontWeight:600, color:"#111827" }}>{item.value}</span>
          </div>
        ))}

        {penyewa.partner.length > 0 && (
          <div style={{ marginTop:10 }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#9ca3af", marginBottom:6 }}>PARTNER</div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {penyewa.partner.map((p, i) => (
                <Badge key={i} color="#ea580c" bg="#fff7ed">{p}</Badge>
              ))}
            </div>
          </div>
        )}

        {daysLeft !== null && (
          <div style={{ marginTop:12, padding:"8px 12px", borderRadius:8, background: daysLeft <= 30 ? "#fee2e2" : "#f0fdf4", border:`1px solid ${daysLeft <= 30 ? "#fca5a5" : "#86efac"}` }}>
            <div style={{ fontSize:12, fontWeight:600, color: daysLeft <= 30 ? "#dc2626" : "#16a34a" }}>
              {daysLeft <= 0 ? "Kontrak sudah berakhir!" : `Kontrak berakhir ${daysLeft} hari lagi`}
            </div>
          </div>
        )}

        <div style={{ marginTop:14, display:"flex", gap:8 }}>
          <Btn onClick={onEdit} style={{ flex:1, justifyContent:"center", fontSize:12, padding:"7px 12px" }}>Edit Data</Btn>
          <Btn variant="secondary" style={{ flex:1, justifyContent:"center", fontSize:12, padding:"7px 12px" }}>Perpanjang</Btn>
        </div>
      </div>
    </div>
  );
}

export default function Modul08_Penyewa({ user }) {
  const [list, setList] = useState(PENYEWA_DATA);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selected, setSelected] = useState(null);
  const [modal, setModal] = useState(null);

  const filtered = list.filter(p =>
    (filterStatus === "all" || p.status === filterStatus) &&
    (p.nama.toLowerCase().includes(search.toLowerCase()) || String(p.kamar).includes(search))
  );

  const handleSave = (form) => {
    if (form.id) {
      setList(prev => prev.map(p => p.id === form.id ? { ...p, ...form } : p));
      setSelected({ ...selected, ...form });
    } else {
      const newP = { ...form, id: Date.now() };
      setList(prev => [...prev, newP]);
    }
  };

  return (
    <div style={{ display:"flex", gap:16 }}>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:"flex", gap:10, marginBottom:16, alignItems:"center" }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari nama atau kamar..."
            style={{ flex:1, padding:"8px 12px", borderRadius:8, border:"1.5px solid #e5e7eb", fontSize:13 }}
          />
          {["all","aktif","booked"].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} style={{ padding:"7px 14px", borderRadius:8, fontSize:12, fontWeight:600, cursor:"pointer", border:"none", background: filterStatus === s ? "linear-gradient(135deg,#f97316,#ea580c)" : "#f1f5f9", color: filterStatus === s ? "#fff" : "#475569" }}>
              {s === "all" ? "Semua" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
          {user && user.role === "admin" && (
            <Btn onClick={() => setModal({})}>+ Tambah</Btn>
          )}
        </div>

        <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", overflow:"hidden" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"#f9fafb" }}>
                {["Kamar","Nama","Kontrak","Harga","Partner","Status",""].map(h => (
                  <th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:11, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} style={{ borderTop:"1px solid #f3f4f6", cursor:"pointer", background: selected?.id === p.id ? "#fff7ed" : "transparent" }} onClick={() => setSelected(p)}>
                  <td style={{ padding:"12px 14px", fontWeight:700, color:"#f97316" }}>Kamar {p.kamar}</td>
                  <td style={{ padding:"12px 14px" }}>
                    <div style={{ fontSize:13, fontWeight:600, color:"#111827" }}>{p.nama}</div>
                    <div style={{ fontSize:11, color:"#9ca3af" }}>{p.telp}</div>
                  </td>
                  <td style={{ padding:"12px 14px" }}>
                    <div style={{ fontSize:12, color:"#374151" }}>{p.kontrakMulai}</div>
                    <div style={{ fontSize:11, color:"#9ca3af" }}>s/d {p.kontrakSelesai || "—"}</div>
                  </td>
                  <td style={{ padding:"12px 14px", fontSize:13, fontWeight:600, color:"#111827" }}>{fmt(p.harga)}</td>
                  <td style={{ padding:"12px 14px", fontSize:12, color:"#6b7280" }}>
                    {p.partner.length > 0 ? `+${p.partner.length}` : "—"}
                  </td>
                  <td style={{ padding:"12px 14px" }}>
                    <Badge color={p.status === "aktif" ? "#16a34a" : "#ca8a04"} bg={p.status === "aktif" ? "#dcfce7" : "#fef9c3"}>
                      {p.status}
                    </Badge>
                  </td>
                  <td style={{ padding:"12px 14px" }}>
                    <button onClick={e => { e.stopPropagation(); setSelected(p); setModal(p); }} style={{ background:"none", border:"none", cursor:"pointer", fontSize:14, color:"#9ca3af" }}>✏️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <DetailPanel
          penyewa={selected}
          onClose={() => setSelected(null)}
          onEdit={() => setModal(selected)}
        />
      )}

      {modal !== null && (
        <ModalPenyewa
          penyewa={modal.id ? modal : null}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
