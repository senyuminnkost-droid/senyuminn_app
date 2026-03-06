import { useState } from "react";

const KAMAR_DATA = [
  { id:1, tipe:"Premium", status:"terisi", harga:2500000, penghuni:"Budi Santoso", partner:["Sari"], kontrakMulai:"2026-01-01", kontrakSelesai:"2026-07-01", tiketAktif:1, fasilitas:[] },
  { id:2, tipe:"Reguler", status:"tersedia", harga:1800000, penghuni:null, partner:[], kontrakMulai:null, kontrakSelesai:null, tiketAktif:0, fasilitas:[] },
  { id:3, tipe:"Reguler", status:"booked", harga:1800000, penghuni:"Dian Pratiwi", partner:[], kontrakMulai:"2026-03-01", kontrakSelesai:null, tiketAktif:0, fasilitas:[] },
  { id:4, tipe:"Premium", status:"terisi", harga:2500000, penghuni:"Ahmad Fauzi", partner:["Budi","Tono"], kontrakMulai:"2025-12-01", kontrakSelesai:"2026-06-01", tiketAktif:0, fasilitas:[] },
  { id:5, tipe:"Reguler", status:"maintenance", harga:1800000, penghuni:null, partner:[], kontrakMulai:null, kontrakSelesai:null, tiketAktif:2, fasilitas:[] },
  { id:6, tipe:"Reguler", status:"terisi", harga:1800000, penghuni:"Siti Rahayu", partner:[], kontrakMulai:"2026-02-01", kontrakSelesai:"2026-08-01", tiketAktif:0, fasilitas:[] },
  { id:7, tipe:"Premium", status:"terisi", harga:2650000, penghuni:"Rudi Hartono", partner:["Lia"], kontrakMulai:"2026-01-15", kontrakSelesai:"2027-01-15", tiketAktif:0, fasilitas:["Kulkas"] },
  { id:8, tipe:"Reguler", status:"deep-clean", harga:1800000, penghuni:null, partner:[], kontrakMulai:null, kontrakSelesai:null, tiketAktif:0, fasilitas:[] },
  { id:9, tipe:"Reguler", status:"terisi", harga:1800000, penghuni:"Dewi Lestari", partner:[], kontrakMulai:"2026-01-01", kontrakSelesai:"2026-04-01", tiketAktif:1, fasilitas:[] },
  { id:10, tipe:"Premium", status:"terisi", harga:2500000, penghuni:"Prisca Aprilia", partner:[], kontrakMulai:"2026-01-12", kontrakSelesai:"2026-07-12", tiketAktif:0, fasilitas:[] },
  { id:11, tipe:"Reguler", status:"tersedia", harga:1800000, penghuni:null, partner:[], kontrakMulai:null, kontrakSelesai:null, tiketAktif:0, fasilitas:[] },
  { id:12, tipe:"Premium", status:"terisi", harga:2500000, penghuni:"Amalia Wulan", partner:["Tari"], kontrakMulai:"2026-01-01", kontrakSelesai:"2026-06-30", tiketAktif:0, fasilitas:[] },
];

const TIKET_DATA = [
  { id:"T001", kamar:9, kategori:"AC Bermasalah", prioritas:"urgent", status:"open", deskripsi:"AC bocor, air menetes ke lantai" },
  { id:"T002", kamar:1, kategori:"Listrik", prioritas:"normal", status:"in-progress", deskripsi:"Lampu kamar mandi redup" },
  { id:"T003", kamar:5, kategori:"Air", prioritas:"normal", status:"open", deskripsi:"Keran air tidak mau mati" },
  { id:"T004", kamar:5, kategori:"Bangunan", prioritas:"normal", status:"ditunda", deskripsi:"Pintu susah dikunci" },
];

const SC = {
  tersedia: { label:"Tersedia", color:"#22c55e", bg:"#dcfce7" },
  booked:   { label:"Booked",   color:"#eab308", bg:"#fef9c3" },
  terisi:   { label:"Terisi",   color:"#ef4444", bg:"#fee2e2" },
  "deep-clean": { label:"Deep Clean", color:"#3b82f6", bg:"#dbeafe" },
  maintenance:  { label:"Maintenance", color:"#f97316", bg:"#ffedd5" },
};

const fmt = (n) => "Rp " + n.toLocaleString("id-ID");

const Badge = ({ color, bg, children }) => (
  <span style={{ display:"inline-flex", alignItems:"center", padding:"2px 8px", borderRadius:20, fontSize:11, fontWeight:600, color, background:bg }}>
    {children}
  </span>
);

export default function Modul03_Monitor() {
  const [filter, setFilter] = useState("all");
  const [filterTipe, setFilterTipe] = useState("all");
  const [selected, setSelected] = useState(null);

  const filtered = KAMAR_DATA.filter(k =>
    (filter === "all" || k.status === filter) &&
    (filterTipe === "all" || k.tipe === filterTipe)
  );

  const summary = Object.keys(SC).reduce((acc, key) => {
    acc[key] = KAMAR_DATA.filter(k => k.status === key).length;
    return acc;
  }, {});

  return (
    <div>
      {/* Summary Bar */}
      <div style={{ display:"flex", gap:10, marginBottom:18, flexWrap:"wrap" }}>
        {Object.entries(SC).map(([key, val]) => (
          <div
            key={key}
            onClick={() => setFilter(filter === key ? "all" : key)}
            style={{
              background:"#fff", borderRadius:10, border:"1px solid #e5e7eb",
              padding:"10px 16px", cursor:"pointer",
              borderTop:`2px solid ${val.color}`,
              opacity: filter === "all" || filter === key ? 1 : 0.5,
            }}
          >
            <div style={{ fontSize:11, color:"#9ca3af", fontWeight:600 }}>{val.label}</div>
            <div style={{ fontSize:22, fontWeight:800, color:val.color }}>{summary[key]}</div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div style={{ display:"flex", gap:8, marginBottom:16, alignItems:"center" }}>
        <span style={{ fontSize:13, color:"#6b7280", fontWeight:600 }}>Tipe:</span>
        {["all","Premium","Reguler"].map(t => (
          <button
            key={t}
            onClick={() => setFilterTipe(t)}
            style={{
              padding:"6px 14px", borderRadius:8, fontSize:12, fontWeight:600,
              cursor:"pointer", border:"none",
              background: filterTipe === t ? "linear-gradient(135deg,#f97316,#ea580c)" : "#f1f5f9",
              color: filterTipe === t ? "#fff" : "#475569",
            }}
          >
            {t === "all" ? "Semua" : t}
          </button>
        ))}
        <div style={{ marginLeft:"auto", fontSize:13, color:"#9ca3af" }}>{filtered.length} kamar</div>
      </div>

      {/* Grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
        {filtered.map(k => (
          <div
            key={k.id}
            onClick={() => setSelected(k)}
            style={{
              background:"#fff", borderRadius:10,
              border:`1.5px solid ${SC[k.status].color}33`,
              borderTop:`3px solid ${SC[k.status].color}`,
              padding:14, cursor:"pointer",
            }}
          >
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
              <div>
                <div style={{ fontSize:15, fontWeight:700, color:"#111827" }}>Kamar {k.id}</div>
                <div style={{ fontSize:11, color:"#9ca3af" }}>
                  {k.tipe}{k.fasilitas.length > 0 ? ` · ${k.fasilitas.join(", ")}` : ""}
                </div>
              </div>
              <Badge color={SC[k.status].color} bg={SC[k.status].bg}>{SC[k.status].label}</Badge>
            </div>

            {k.penghuni ? (
              <div style={{ marginBottom:8 }}>
                <div style={{ fontSize:13, fontWeight:600, color:"#111827" }}>👤 {k.penghuni}</div>
                {k.partner.length > 0 && (
                  <div style={{ fontSize:11, color:"#6b7280" }}>+ {k.partner.length} partner</div>
                )}
                <div style={{ fontSize:11, color:"#9ca3af", marginTop:2 }}>
                  📅 {k.kontrakMulai} → {k.kontrakSelesai || "—"}
                </div>
              </div>
            ) : (
              <div style={{ fontSize:12, color:"#9ca3af", marginBottom:8, fontStyle:"italic" }}>Tidak ada penghuni</div>
            )}

            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:12, fontWeight:600, color:"#f97316" }}>{fmt(k.harga)}/bln</span>
              {k.tiketAktif > 0 && (
                <Badge color="#dc2626" bg="#fee2e2">🔧 {k.tiketAktif} tiket</Badge>
              )}
            </div>
            <div style={{ marginTop:8, paddingTop:8, borderTop:"1px solid #f3f4f6", textAlign:"right" }}>
              <span style={{ fontSize:11, color:"#f97316", fontWeight:600 }}>Lihat Detail →</span>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div
          style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }}
          onClick={() => setSelected(null)}
        >
          <div
            style={{ background:"#fff", borderRadius:16, padding:28, width:480, maxHeight:"80vh", overflowY:"auto", boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <div>
                <div style={{ fontSize:20, fontWeight:800, color:"#111827" }}>Kamar {selected.id}</div>
                <div style={{ fontSize:13, color:"#9ca3af" }}>{selected.tipe}</div>
              </div>
              <Badge color={SC[selected.status].color} bg={SC[selected.status].bg}>
                {SC[selected.status].label}
              </Badge>
            </div>

            {selected.penghuni && (
              <div style={{ background:"#f8fafc", borderRadius:10, padding:16, marginBottom:16 }}>
                <div style={{ fontSize:12, fontWeight:700, color:"#9ca3af", marginBottom:8 }}>DATA PENGHUNI</div>
                <div style={{ fontSize:14, fontWeight:600, color:"#111827" }}>👤 {selected.penghuni}</div>
                {selected.partner.length > 0 && (
                  <div style={{ fontSize:13, color:"#6b7280", marginTop:4 }}>Partner: {selected.partner.join(", ")}</div>
                )}
                <div style={{ fontSize:12, color:"#9ca3af", marginTop:6 }}>
                  📅 Kontrak: {selected.kontrakMulai} s/d {selected.kontrakSelesai}
                </div>
                <div style={{ fontSize:13, fontWeight:600, color:"#f97316", marginTop:4 }}>{fmt(selected.harga)} / bulan</div>
              </div>
            )}

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
              {[
                { label:"Weekly Service", value:"Terakhir: 20 Feb 2026", icon:"🧹" },
                { label:"Service AC", value:"Terakhir: Jan 2026", icon:"❄️" },
                { label:"Deep Clean", value:selected.status === "deep-clean" ? "Sedang berlangsung" : "Terakhir: Des 2025", icon:"✨" },
                { label:"Tiket Aktif", value:`${selected.tiketAktif} tiket`, icon:"🔧" },
              ].map(item => (
                <div key={item.label} style={{ background:"#f8fafc", borderRadius:8, padding:12 }}>
                  <div style={{ fontSize:11, color:"#9ca3af", marginBottom:2 }}>{item.icon} {item.label}</div>
                  <div style={{ fontSize:13, fontWeight:600, color:"#111827" }}>{item.value}</div>
                </div>
              ))}
            </div>

            {selected.tiketAktif > 0 && (
              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:12, fontWeight:700, color:"#9ca3af", marginBottom:8 }}>TIKET AKTIF</div>
                {TIKET_DATA.filter(t => t.kamar === selected.id).map(t => (
                  <div key={t.id} style={{ background:"#fff7ed", border:"1px solid #fed7aa", borderRadius:8, padding:10, marginBottom:6 }}>
                    <div style={{ display:"flex", justifyContent:"space-between" }}>
                      <span style={{ fontSize:13, fontWeight:600, color:"#111827" }}>{t.kategori}</span>
                      <Badge color={t.prioritas==="urgent"?"#dc2626":"#6b7280"} bg={t.prioritas==="urgent"?"#fee2e2":"#f3f4f6"}>
                        {t.prioritas==="urgent"?"Urgent":"Normal"}
                      </Badge>
                    </div>
                    <div style={{ fontSize:12, color:"#6b7280", marginTop:2 }}>{t.deskripsi}</div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display:"flex", gap:10 }}>
              <button style={{ flex:1, padding:"8px 16px", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer", border:"none", background:"linear-gradient(135deg,#f97316,#ea580c)", color:"#fff" }}>
                + Buat Tiket
              </button>
              <button
                style={{ flex:1, padding:"8px 16px", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer", border:"none", background:"#f1f5f9", color:"#475569" }}
                onClick={() => setSelected(null)}
              >
                Tutup
              </button>
      )}
  );
}