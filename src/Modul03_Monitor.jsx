import { useState } from "react";

const KAMAR_DATA = Array.from({length:12}, (_,i) => ({
  id: i+1,
  tipe: [1,4,7,10,12].includes(i+1) ? "Premium" : "Reguler",
  status: "tersedia",
  harga: [1,4,7,10,12].includes(i+1) ? 2500000 : 1800000,
  penghuni: null, partner: [], kontrakMulai: null, kontrakSelesai: null,
  tiketAktif: 0, fasilitas: [],
}));

const TIKET_DATA = [];

const STATUS = {
  "tersedia":    { label:"Tersedia",    color:"#22c55e", bg:"#dcfce7", dot:"#16a34a" },
  "booked":      { label:"Booked",      color:"#eab308", bg:"#fef9c3", dot:"#ca8a04" },
  "terisi":      { label:"Terisi",      color:"#ef4444", bg:"#fee2e2", dot:"#dc2626" },
  "deep-clean":  { label:"Deep Clean",  color:"#3b82f6", bg:"#dbeafe", dot:"#2563eb" },
  "maintenance": { label:"Maintenance", color:"#f97316", bg:"#ffedd5", dot:"#ea580c" },
};

const PRIORITAS = {
  "urgent": { label:"Urgent", color:"#ef4444", bg:"#fee2e2" },
  "normal": { label:"Normal", color:"#6b7280", bg:"#f3f4f6" },
};

const fmt = (n) => "Rp " + n.toLocaleString("id-ID");

const Badge = ({ color, bg, children }) => (
  <span style={{ display:"inline-flex", alignItems:"center", padding:"2px 8px", borderRadius:20, fontSize:11, fontWeight:600, color, background:bg }}>
    {children}
  </span>
);

function DetailModal({ kamar, onClose }) {
  if (!kamar) return null;
  const s = STATUS[kamar.status] || STATUS["tersedia"];
  const tiket = TIKET_DATA.filter(t => t.kamar === kamar.id);

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }} onClick={onClose}>
      <div style={{ background:"#fff", borderRadius:16, padding:28, width:480, maxHeight:"80vh", overflowY:"auto", boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }} onClick={e => e.stopPropagation()}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div>
            <div style={{ fontSize:20, fontWeight:800, color:"#1e293b" }}>Kamar {kamar.id}</div>
            <div style={{ fontSize:13, color:"#94a3b8" }}>
              {kamar.tipe}{kamar.fasilitas.length > 0 ? " - " + kamar.fasilitas.join(", ") : ""}
            </div>
          </div>
          <Badge color={s.color} bg={s.bg}>{s.label}</Badge>
        </div>

        {kamar.penghuni && (
          <div style={{ background:"#f8fafc", borderRadius:10, padding:16, marginBottom:16 }}>
            <div style={{ fontSize:12, fontWeight:700, color:"#94a3b8", marginBottom:8 }}>DATA PENGHUNI</div>
            <div style={{ fontSize:14, fontWeight:600, color:"#1e293b" }}>👤 {kamar.penghuni}</div>
            {kamar.partner.length > 0 && (
              <div style={{ fontSize:13, color:"#64748b", marginTop:4 }}>Partner: {kamar.partner.join(", ")}</div>
            )}
            <div style={{ fontSize:12, color:"#94a3b8", marginTop:6 }}>
              📅 {kamar.kontrakMulai} s/d {kamar.kontrakSelesai}
            </div>
            <div style={{ fontSize:13, fontWeight:600, color:"#f97316", marginTop:4 }}>
              {fmt(kamar.harga)} / bulan
            </div>
          </div>
        )}

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
          {[
            { label:"Weekly Service", value:"Terakhir: 20 Feb 2026",                                    icon:"🧹" },
            { label:"Service AC",     value:"Terakhir: Jan 2026",                                       icon:"❄️" },
            { label:"Deep Clean",     value: kamar.status === "deep-clean" ? "Sedang berlangsung" : "Terakhir: Des 2025", icon:"✨" },
            { label:"Tiket Aktif",    value:`${kamar.tiketAktif} tiket`,                                icon:"🔧" },
          ].map(item => (
            <div key={item.label} style={{ background:"#f8fafc", borderRadius:8, padding:12 }}>
              <div style={{ fontSize:11, color:"#94a3b8", marginBottom:2 }}>{item.icon} {item.label}</div>
              <div style={{ fontSize:13, fontWeight:600, color:"#1e293b" }}>{item.value}</div>
            </div>
          ))}
        </div>

        {tiket.length > 0 && (
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:12, fontWeight:700, color:"#94a3b8", marginBottom:8 }}>TIKET AKTIF</div>
            {tiket.map(t => (
              <div key={t.id} style={{ background:"#fff7ed", border:"1px solid #fed7aa", borderRadius:8, padding:10, marginBottom:6 }}>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <span style={{ fontSize:13, fontWeight:600, color:"#1e293b" }}>{t.kategori}</span>
                  <Badge color={PRIORITAS[t.prioritas].color} bg={PRIORITAS[t.prioritas].bg}>
                    {PRIORITAS[t.prioritas].label}
                  </Badge>
                </div>
                <div style={{ fontSize:12, color:"#64748b", marginTop:2 }}>{t.deskripsi}</div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display:"flex", gap:10 }}>
          <button style={{ flex:1, padding:"9px 16px", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer", border:"none", background:"linear-gradient(135deg,#f97316,#ea580c)", color:"#fff" }}>
            + Buat Tiket
          </button>
          <button style={{ flex:1, padding:"9px 16px", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer", border:"none", background:"#f1f5f9", color:"#475569" }} onClick={onClose}>
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Modul03_Monitor() {
  const [filter, setFilter] = useState("all");
  const [filterTipe, setFilterTipe] = useState("all");
  const [selected, setSelected] = useState(null);

  const filtered = KAMAR_DATA.filter(k => {
    if (filter !== "all" && k.status !== filter) return false;
    if (filterTipe !== "all" && k.tipe !== filterTipe) return false;
    return true;
  });

  const summary = Object.keys(STATUS).reduce((acc, key) => {
    acc[key] = KAMAR_DATA.filter(k => k.status === key).length;
    return acc;
  }, {});

  return (
    <div>
      <div style={{ display:"flex", gap:12, marginBottom:20, flexWrap:"wrap" }}>
        {Object.entries(STATUS).map(([key, val]) => (
          <div
            key={key}
            onClick={() => setFilter(filter === key ? "all" : key)}
            style={{ background:"#fff", borderRadius:10, padding:"10px 16px", cursor:"pointer", borderTop:`2px solid ${val.color}`, border:`1px solid #e2e8f0`, borderTopWidth:2, borderTopColor:val.color, opacity: filter === key || filter === "all" ? 1 : 0.5 }}
          >
            <div style={{ fontSize:11, color:"#94a3b8", fontWeight:600 }}>{val.label}</div>
            <div style={{ fontSize:22, fontWeight:800, color:val.color }}>{summary[key]}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"flex", gap:10, marginBottom:16, alignItems:"center" }}>
        <span style={{ fontSize:13, color:"#64748b", fontWeight:600 }}>Filter:</span>
        {["all","Premium","Reguler"].map(t => (
          <button
            key={t}
            onClick={() => setFilterTipe(t)}
            style={{ padding:"6px 14px", borderRadius:8, fontSize:12, fontWeight:600, cursor:"pointer", border:"none", background: filterTipe === t ? "linear-gradient(135deg,#f97316,#ea580c)" : "#f1f5f9", color: filterTipe === t ? "#fff" : "#475569" }}
          >
            {t === "all" ? "Semua Tipe" : t}
          </button>
        ))}
        <div style={{ marginLeft:"auto", fontSize:13, color:"#94a3b8" }}>{filtered.length} kamar</div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
        {filtered.map(k => {
          const s = STATUS[k.status] || STATUS["tersedia"];
          return (
            <div
              key={k.id}
              onClick={() => setSelected(k)}
              style={{ background:"#fff", borderRadius:10, border:`1.5px solid ${s.color}33`, borderTop:`3px solid ${s.color}`, padding:14, cursor:"pointer" }}
            >
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                <div>
                  <div style={{ fontSize:15, fontWeight:700, color:"#1e293b" }}>Kamar {k.id}</div>
                  <div style={{ fontSize:11, color:"#94a3b8" }}>{k.tipe}{k.fasilitas.length > 0 ? " - " + k.fasilitas.join(", ") : ""}</div>
                </div>
                <Badge color={s.color} bg={s.bg}>{s.label}</Badge>
              </div>

              {k.penghuni ? (
                <div style={{ marginBottom:8 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:"#1e293b" }}>👤 {k.penghuni}</div>
                  {k.partner.length > 0 && (
                    <div style={{ fontSize:11, color:"#64748b" }}>+{k.partner.length} partner</div>
                  )}
                  <div style={{ fontSize:11, color:"#94a3b8", marginTop:2 }}>
                    {k.kontrakMulai} - {k.kontrakSelesai}
                  </div>
                </div>
              ) : (
                <div style={{ fontSize:12, color:"#94a3b8", marginBottom:8, fontStyle:"italic" }}>Tidak ada penghuni</div>
              )}

              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:12, fontWeight:600, color:"#f97316" }}>{fmt(k.harga)}/bln</span>
                {k.tiketAktif > 0 && (
                  <Badge color="#ef4444" bg="#fee2e2">🔧 {k.tiketAktif}</Badge>
                )}
              </div>

              <div style={{ marginTop:10, paddingTop:10, borderTop:"1px solid #f1f5f9", textAlign:"right" }}>
                <span style={{ fontSize:11, color:"#f97316", fontWeight:600 }}>Lihat Detail →</span>
              </div>
            </div>
          );
        })}
      </div>

      {selected && <DetailModal kamar={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
