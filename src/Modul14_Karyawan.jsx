import { useState } from "react";

const COLORS = ["#f97316","#3b82f6","#8b5cf6","#10b981","#ef4444","#06b6d4"];
const getColor = (id) => COLORS[id % COLORS.length];
const getInisial = (nama) => nama.split(" ").map(n => n[0]).slice(0,2).join("").toUpperCase();
const fmt = (n) => "Rp " + Number(n).toLocaleString("id-ID");
const hariSisa = (tgl) => {
  if (!tgl) return null;
  return Math.ceil((new Date(tgl) - new Date()) / 86400000);
};

const KARYAWAN_DATA = [
  { id:1, nama:"Muh. Krisna Mukti",   jabatan:"Clean & Service",    shift:"Pagi",       nik:"3271010101900001", tglLahir:"1990-01-01", jenisKelamin:"L", agama:"Islam",   statusNikah:"Menikah", hp:"081234567891", nodarurat:"Ibu Krisna 0811",  alamat:"Jl. Mawar No.1 Solo",   rekeningBank:"BCA",    rekeningNo:"1234567890", tglMulai:"2025-01-01", tglSelesai:"2026-01-01", gajiPokok:2200000, tunjangan:300000, aktif:true,  cutiTerpakai:1, catatan:"" },
  { id:2, nama:"Gurit Yudho Anggoro", jabatan:"Staf Penjaga Malam", shift:"Sore/Malam", nik:"3271020202910002", tglLahir:"1991-02-02", jenisKelamin:"L", agama:"Islam",   statusNikah:"Belum",   hp:"082345678902", nodarurat:"Ayah Gurit 0812", alamat:"Jl. Melati No.2 Solo",  rekeningBank:"BRI",    rekeningNo:"2345678901", tglMulai:"2025-03-01", tglSelesai:"2026-03-01", gajiPokok:2200000, tunjangan:300000, aktif:true,  cutiTerpakai:0, catatan:"" },
  { id:3, nama:"Rina Manajemen",      jabatan:"Super Admin",        shift:"Pagi",       nik:"3271030303880003", tglLahir:"1988-03-03", jenisKelamin:"P", agama:"Kristen", statusNikah:"Menikah", hp:"083456789013", nodarurat:"Suami Rina 0813", alamat:"Jl. Anggrek No.3 Solo", rekeningBank:"Mandiri", rekeningNo:"3456789012", tglMulai:"2024-06-01", tglSelesai:"2025-06-01", gajiPokok:3500000, tunjangan:500000, aktif:false, cutiTerpakai:3, catatan:"Kontrak habis, sedang diperpanjang" },
];

const INFO_FIELDS = [
  { key:"nik",          label:"NIK / KTP" },
  { key:"tglLahir",     label:"Tgl Lahir" },
  { key:"jenisKelamin", label:"Jenis Kelamin" },
  { key:"agama",        label:"Agama" },
  { key:"statusNikah",  label:"Status Nikah" },
  { key:"hp",           label:"No. HP" },
  { key:"nodarurat",    label:"Kontak Darurat" },
  { key:"shift",        label:"Shift" },
  { key:"tglMulai",     label:"Mulai Kerja" },
  { key:"tglSelesai",   label:"Selesai Kontrak" },
  { key:"rekeningBank", label:"Bank" },
  { key:"rekeningNo",   label:"No. Rekening" },
];

function ModalKaryawan({ data, onClose, onSave }) {
  const [form, setForm] = useState(data || {
    nama:"", jabatan:"", shift:"Pagi", nik:"", tglLahir:"", jenisKelamin:"L",
    agama:"Islam", statusNikah:"Belum", hp:"", nodarurat:"", alamat:"",
    rekeningBank:"", rekeningNo:"", tglMulai:"", tglSelesai:"",
    gajiPokok:"", tunjangan:"", aktif:true, cutiTerpakai:0, catatan:"",
  });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }} onClick={onClose}>
      <div style={{ background:"#fff", borderRadius:16, padding:28, width:580, maxHeight:"88vh", overflowY:"auto", boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }} onClick={e => e.stopPropagation()}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div style={{ fontSize:16, fontWeight:700, color:"#111827" }}>{data ? "Edit Karyawan" : "Tambah Karyawan"}</div>
          <button onClick={onClose} style={{ background:"#f3f4f6", border:"none", borderRadius:8, padding:"6px 10px", cursor:"pointer" }}>X</button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
          {[
            { k:"nama",         l:"Nama Lengkap",    type:"text" },
            { k:"jabatan",      l:"Jabatan",         type:"text" },
            { k:"nik",          l:"NIK / KTP",       type:"text" },
            { k:"tglLahir",     l:"Tanggal Lahir",   type:"date" },
            { k:"hp",           l:"No. HP",          type:"text" },
            { k:"nodarurat",    l:"Kontak Darurat",  type:"text" },
            { k:"tglMulai",     l:"Mulai Kerja",     type:"date" },
            { k:"tglSelesai",   l:"Selesai Kontrak", type:"date" },
            { k:"gajiPokok",    l:"Gaji Pokok",      type:"number" },
            { k:"tunjangan",    l:"Tunjangan",       type:"number" },
            { k:"rekeningBank", l:"Bank",            type:"text" },
            { k:"rekeningNo",   l:"No. Rekening",    type:"text" },
          ].map(f => (
            <div key={f.k}>
              <label style={{ fontSize:12, fontWeight:600, color:"#374151", display:"block", marginBottom:4 }}>{f.l}</label>
              <input
                type={f.type}
                value={form[f.k] || ""}
                onChange={e => set(f.k, e.target.value)}
                style={{ width:"100%", padding:"8px 11px", borderRadius:8, border:"1.5px solid #e5e7eb", fontSize:13, boxSizing:"border-box" }}
              />
            </div>
          ))}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
          {[
            { k:"jenisKelamin", l:"Jenis Kelamin", opts:["L","P"] },
            { k:"agama",        l:"Agama",         opts:["Islam","Kristen","Katolik","Hindu","Buddha"] },
            { k:"statusNikah",  l:"Status Nikah",  opts:["Belum","Menikah","Cerai"] },
            { k:"shift",        l:"Shift",         opts:["Pagi","Sore/Malam"] },
          ].map(f => (
            <div key={f.k}>
              <label style={{ fontSize:12, fontWeight:600, color:"#374151", display:"block", marginBottom:4 }}>{f.l}</label>
              <select value={form[f.k] || ""} onChange={e => set(f.k, e.target.value)} style={{ width:"100%", padding:"8px 11px", borderRadius:8, border:"1.5px solid #e5e7eb", fontSize:13, boxSizing:"border-box" }}>
                {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>
        <div style={{ marginBottom:16 }}>
          <label style={{ fontSize:12, fontWeight:600, color:"#374151", display:"block", marginBottom:4 }}>Alamat</label>
          <textarea value={form.alamat || ""} onChange={e => set("alamat", e.target.value)} rows={2} style={{ width:"100%", padding:"8px 11px", borderRadius:8, border:"1.5px solid #e5e7eb", fontSize:13, boxSizing:"border-box", resize:"vertical" }} />
        </div>
        <div style={{ marginBottom:20 }}>
          <label style={{ fontSize:12, fontWeight:600, color:"#374151", display:"block", marginBottom:4 }}>Catatan</label>
          <textarea value={form.catatan || ""} onChange={e => set("catatan", e.target.value)} rows={2} style={{ width:"100%", padding:"8px 11px", borderRadius:8, border:"1.5px solid #e5e7eb", fontSize:13, boxSizing:"border-box", resize:"vertical" }} />
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={() => { onSave(form); onClose(); }} style={{ flex:1, padding:11, borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer", border:"none", background:"linear-gradient(135deg,#f97316,#ea580c)", color:"#fff" }}>
            {data ? "Simpan Perubahan" : "Tambah Karyawan"}
          </button>
          <button onClick={onClose} style={{ flex:1, padding:11, borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer", border:"none", background:"#f1f5f9", color:"#475569" }}>
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}

function KontrakCard({ k }) {
  const sisa = hariSisa(k.tglSelesai);
  const prog = k.tglMulai && k.tglSelesai
    ? Math.min(100, Math.max(0, Math.round((new Date() - new Date(k.tglMulai)) / (new Date(k.tglSelesai) - new Date(k.tglMulai)) * 100)))
    : 0;
  const warn = sisa !== null && sisa <= 30;
  return (
    <div style={{ background:"linear-gradient(135deg,#1e293b,#334155)", borderRadius:12, padding:16, color:"#fff", marginBottom:14 }}>
      <div style={{ fontSize:10, color:"#94a3b8", fontWeight:600, letterSpacing:1, marginBottom:4 }}>KONTRAK KARYAWAN</div>
      <div style={{ fontSize:14, fontWeight:700, marginBottom:12 }}>{k.nama}</div>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
        <span style={{ fontSize:11, color:"#94a3b8" }}>Mulai</span>
        <span style={{ fontSize:11, fontWeight:600, color:"#e2e8f0" }}>{k.tglMulai || "—"}</span>
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
        <span style={{ fontSize:11, color:"#94a3b8" }}>Selesai</span>
        <span style={{ fontSize:11, fontWeight:600, color: warn ? "#fbbf24" : "#e2e8f0" }}>{k.tglSelesai || "—"}</span>
      </div>
      <div style={{ height:4, background:"#475569", borderRadius:2, overflow:"hidden", marginBottom:4 }}>
        <div style={{ height:"100%", width:`${prog}%`, background:"linear-gradient(90deg,#f97316,#ea580c)", borderRadius:2 }} />
      </div>
      <div style={{ display:"flex", justifyContent:"space-between" }}>
        <span style={{ fontSize:10, color:"#64748b" }}>{prog}% berjalan</span>
        <span style={{ fontSize:10, color: warn ? "#fbbf24" : "#64748b" }}>
          {sisa === null ? "—" : sisa < 0 ? "Sudah habis" : `${sisa} hari lagi`}
        </span>
      </div>
    </div>
  );
}

function DetailPanel({ k, onEdit, onClose }) {
  const cutiTerpakai = k.cutiTerpakai || 0;
  return (
    <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", overflow:"hidden", width:340, flexShrink:0 }}>
      <div style={{ padding:"13px 16px", borderBottom:"1px solid #f3f4f6", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ fontSize:13, fontWeight:700, color:"#111827" }}>Detail Karyawan</div>
        <div style={{ display:"flex", gap:6 }}>
          <button onClick={onEdit} style={{ background:"linear-gradient(135deg,#f97316,#ea580c)", border:"none", borderRadius:6, padding:"5px 12px", cursor:"pointer", fontSize:11, fontWeight:600, color:"#fff" }}>Edit</button>
          <button onClick={onClose} style={{ background:"#f3f4f6", border:"none", borderRadius:6, padding:"5px 10px", cursor:"pointer", fontSize:13, color:"#9ca3af" }}>X</button>
        </div>
      </div>
      <div style={{ padding:16 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16, paddingBottom:14, borderBottom:"1px solid #f3f4f6" }}>
          <div style={{ width:52, height:52, borderRadius:12, background:getColor(k.id), display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, fontWeight:700, color:"#fff", flexShrink:0 }}>
            {getInisial(k.nama)}
          </div>
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:"#111827" }}>{k.nama}</div>
            <div style={{ fontSize:12, color:"#9ca3af", marginTop:2 }}>{k.jabatan} · {k.shift}</div>
            <div style={{ marginTop:5 }}>
              <span style={{ display:"inline-block", padding:"2px 8px", borderRadius:20, fontSize:11, fontWeight:600, background: k.aktif ? "#dcfce7" : "#fee2e2", color: k.aktif ? "#16a34a" : "#dc2626" }}>
                {k.aktif ? "Aktif" : "Nonaktif"}
              </span>
            </div>
          </div>
        </div>
        <KontrakCard k={k} />
        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:1.2, color:"#9ca3af", marginBottom:8 }}>INFO PRIBADI</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
            {INFO_FIELDS.map(f => (
              <div key={f.key} style={{ background:"#f9fafb", borderRadius:8, padding:"8px 10px" }}>
                <div style={{ fontSize:10, color:"#9ca3af", fontWeight:500, textTransform:"uppercase", letterSpacing:.4, marginBottom:2 }}>{f.label}</div>
                <div style={{ fontSize:12, fontWeight:600, color:"#1f2937" }}>{k[f.key] || "—"}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:1.2, color:"#9ca3af", marginBottom:8 }}>GAJI</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
            <div style={{ background:"#f9fafb", borderRadius:8, padding:"8px 10px" }}>
              <div style={{ fontSize:10, color:"#9ca3af", fontWeight:500, marginBottom:2 }}>GAJI POKOK</div>
              <div style={{ fontSize:12, fontWeight:700, color:"#ea580c" }}>{fmt(k.gajiPokok)}</div>
            </div>
            <div style={{ background:"#f9fafb", borderRadius:8, padding:"8px 10px" }}>
              <div style={{ fontSize:10, color:"#9ca3af", fontWeight:500, marginBottom:2 }}>TUNJANGAN</div>
              <div style={{ fontSize:12, fontWeight:700, color:"#16a34a" }}>{fmt(k.tunjangan)}</div>
            </div>
          </div>
        </div>
        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:1.2, color:"#9ca3af", marginBottom:8 }}>HAK CUTI</div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ display:"flex", gap:6 }}>
              {Array.from({ length:3 }, (_, i) => (
                <div key={i} style={{ width:28, height:28, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, background: i < cutiTerpakai ? "#fee2e2" : "#dcfce7", color: i < cutiTerpakai ? "#dc2626" : "#16a34a" }}>
                  {i < cutiTerpakai ? "X" : "V"}
                </div>
              ))}
            </div>
            <span style={{ fontSize:12, color:"#6b7280" }}>{3 - cutiTerpakai} hari tersisa</span>
          </div>
        </div>
        {k.catatan ? (
          <div style={{ background:"#fff7ed", border:"1px solid #fed7aa", borderRadius:8, padding:"10px 12px", fontSize:12, color:"#9a3412" }}>
            {k.catatan}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function Modul14_Karyawan({ user }) {
  const [list, setList] = useState(KARYAWAN_DATA);
  const [selected, setSelected] = useState(null);
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");
  const [filterAktif, setFilterAktif] = useState("all");

  const filtered = list.filter(k =>
    (filterAktif === "all" || (filterAktif === "aktif" ? k.aktif : !k.aktif)) &&
    k.nama.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (form) => {
    if (form.id) {
      setList(prev => prev.map(k => k.id === form.id ? { ...k, ...form } : k));
      setSelected(s => s ? { ...s, ...form } : s);
    } else {
      setList(prev => [...prev, { ...form, id: Date.now() }]);
    }
  };

  const stats = [
    { label:"Total Karyawan", value: list.length,                                                                                                  color:"#3b82f6" },
    { label:"Aktif",          value: list.filter(k => k.aktif).length,                                                                            color:"#22c55e" },
    { label:"Nonaktif",       value: list.filter(k => !k.aktif).length,                                                                           color:"#ef4444" },
    { label:"Kontrak Habis",  value: list.filter(k => { const s = hariSisa(k.tglSelesai); return s !== null && s <= 30; }).length,                 color:"#f97316" },
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", padding:"14px 16px", borderTop:`3px solid ${s.color}` }}>
            <div style={{ fontSize:11, fontWeight:600, color:"#9ca3af", textTransform:"uppercase", letterSpacing:.5, marginBottom:4 }}>{s.label}</div>
            <div style={{ fontSize:24, fontWeight:800, color:s.color }}>{s.value}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", gap:16, alignItems:"flex-start" }}>
        <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", overflow:"hidden", flex:1, minWidth:0 }}>
          <div style={{ padding:"13px 16px", borderBottom:"1px solid #f3f4f6", display:"flex", gap:10, alignItems:"center" }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari nama karyawan..."
              style={{ flex:1, padding:"7px 11px", borderRadius:8, border:"1.5px solid #e5e7eb", fontSize:13 }}
            />
            {["all","aktif","nonaktif"].map(f => (
              <button key={f} onClick={() => setFilterAktif(f)} style={{ padding:"7px 14px", borderRadius:8, fontSize:12, fontWeight:600, cursor:"pointer", border:"none", background: filterAktif === f ? "linear-gradient(135deg,#f97316,#ea580c)" : "#f1f5f9", color: filterAktif === f ? "#fff" : "#475569" }}>
                {f === "all" ? "Semua" : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
            {user && user.role === "admin" && (
              <button onClick={() => setModal({})} style={{ padding:"7px 14px", borderRadius:8, fontSize:12, fontWeight:600, cursor:"pointer", border:"none", background:"linear-gradient(135deg,#f97316,#ea580c)", color:"#fff", whiteSpace:"nowrap" }}>
                + Tambah
              </button>
            )}
          </div>
          {filtered.map(k => {
            const sisa = hariSisa(k.tglSelesai);
            const warn = sisa !== null && sisa <= 30;
            return (
              <div key={k.id} onClick={() => setSelected(k)} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", borderBottom:"1px solid #f3f4f6", cursor:"pointer", background: selected && selected.id === k.id ? "#fff7ed" : "transparent", borderLeft: selected && selected.id === k.id ? "3px solid #f97316" : "3px solid transparent" }}>
                <div style={{ width:40, height:40, borderRadius:10, background:getColor(k.id), display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, fontWeight:700, color:"#fff", flexShrink:0 }}>
                  {getInisial(k.nama)}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:"#1f2937" }}>{k.nama}</div>
                  <div style={{ fontSize:11, color:"#9ca3af" }}>{k.jabatan} · {k.shift}</div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <span style={{ display:"inline-block", padding:"2px 8px", borderRadius:20, fontSize:11, fontWeight:600, background: k.aktif ? "#dcfce7" : "#fee2e2", color: k.aktif ? "#16a34a" : "#dc2626" }}>
                    {k.aktif ? "Aktif" : "Nonaktif"}
                  </span>
                  {warn && (
                    <div style={{ fontSize:10, color:"#f97316", marginTop:2 }}>
                      Kontrak {sisa < 0 ? "habis" : `H-${sisa}`}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {selected && (
          <DetailPanel k={selected} onEdit={() => setModal(selected)} onClose={() => setSelected(null)} />
        )}
      </div>
      {modal !== null && (
        <ModalKaryawan data={modal.id ? modal : null} onClose={() => setModal(null)} onSave={handleSave} />
      )}
    </div>
  );
}
