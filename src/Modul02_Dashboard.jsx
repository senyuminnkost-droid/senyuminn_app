import { useState } from "react";

const STATS = {
  omzetBulanIni: 0, omzetBulanLalu: 0,
  kamarTerisi: 0, kamarKosong: 0, kamarBooked: 0, kamarMaintenance: 0,
  piutang: 0, tiketOpen: 0, tiketUrgent: 0, kontrakHabis: 0, totalKamar: 12,
};

const AGENDA_TAGIHAN = [];

const TIKET_DATA = [];

const KAMAR_MINI = Array.from({length:12}, (_,i) => ({ id:i+1, status:"tersedia" }));

const STATUS_COLOR = { tersedia:"#22c55e", booked:"#eab308", terisi:"#ef4444", "deep-clean":"#3b82f6", maintenance:"#f97316" };
const STATUS_LABEL = { tersedia:"Tersedia", booked:"Booked", terisi:"Terisi", "deep-clean":"Deep Clean", maintenance:"Maintenance" };

const fmt = (n) => "Rp " + n.toLocaleString("id-ID");
const Badge = ({ color, bg, children }) => (
  <span style={{ display:"inline-flex", alignItems:"center", padding:"2px 8px", borderRadius:20, fontSize:11, fontWeight:600, color, background:bg }}>{children}</span>
);

const W = {
  card: { background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", padding:"16px 20px" },
  widget: { background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", overflow:"hidden" },
  whead: { padding:"12px 16px 10px", borderBottom:"1px solid #f3f4f6", display:"flex", alignItems:"center", justifyContent:"space-between" },
  wtitle: { fontSize:13, fontWeight:700, color:"#111827", display:"flex", alignItems:"center", gap:6 },
  wbody: { padding:"14px 16px" },
  row: { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid #f9fafb" },
  label: { fontSize:11, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:.5, marginBottom:4 },
  value: { fontSize:22, fontWeight:800, color:"#111827", lineHeight:1.2 },
  sub: { fontSize:12, color:"#9ca3af", marginTop:3 },
};

function DashboardAdmin() {
  const growth = ((STATS.omzetBulanIni - STATS.omzetBulanLalu) / STATS.omzetBulanLalu * 100).toFixed(1);
  const okupansi = Math.round((STATS.kamarTerisi / STATS.totalKamar) * 100);

  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:20 }}>
        <div style={{ ...W.card, borderTop:"3px solid #f97316" }}>
          <div style={W.label}>Omzet Bulan Ini</div>
          <div style={{ ...W.value, fontSize:18 }}>{fmt(STATS.omzetBulanIni)}</div>
          <div style={{ fontSize:12, color:"#22c55e", marginTop:3 }}>▲ {growth}% vs bulan lalu</div>
        </div>
        <div style={W.card}>
          <div style={W.label}>Okupansi</div>
          <div style={W.value}>{okupansi}%</div>
          <div style={W.sub}>{STATS.kamarTerisi}/{STATS.totalKamar} kamar terisi</div>
        </div>
        <div style={W.card}>
          <div style={W.label}>Piutang</div>
          <div style={{ ...W.value, fontSize:18, color:"#ef4444" }}>{fmt(STATS.piutang)}</div>
          <div style={W.sub}>Belum terbayar</div>
        </div>
        <div style={W.card}>
          <div style={W.label}>Tiket Keluhan</div>
          <div style={W.value}>{STATS.tiketOpen}</div>
          <div style={{ fontSize:12, color:"#ef4444", marginTop:3 }}>{STATS.tiketUrgent} urgent 🔴</div>
        </div>
      </div>

      <div style={{ background:"linear-gradient(135deg,#fff7ed,#ffedd5)", border:"1px solid #fed7aa", borderRadius:10, padding:"12px 16px", marginBottom:20, display:"flex", alignItems:"center", gap:10 }}>
        <span style={{ fontSize:20 }}>💡</span>
        <div style={{ fontSize:13, color:"#9a3412" }}>
          <b>Insight Hari Ini:</b> {STATS.kontrakHabis} kontrak habis bulan ini · {STATS.tiketUrgent} tiket urgent menunggu penanganan
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:20 }}>
        <div style={W.widget}>
          <div style={W.whead}>
            <div style={W.wtitle}>📋 Agenda Penagihan</div>
            <span style={{ fontSize:11, color:"#9ca3af" }}>7 hari ke depan</span>
          </div>
          <div style={W.wbody}>
            {AGENDA_TAGIHAN.map((a, i) => (
              <div key={i} style={W.row}>
                <div>
                  <div style={{ fontSize:13, fontWeight:500, color:"#111827" }}>Kamar {a.kamar} — {a.penghuni}</div>
                  <div style={{ fontSize:11, color:"#9ca3af" }}>{a.jatuhTempo}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:12, fontWeight:700, color:"#f97316" }}>{fmt(a.jumlah)}</div>
                  {a.status === "jatuh-tempo" && <Badge color="#dc2626" bg="#fee2e2">Jatuh Tempo</Badge>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={W.widget}>
          <div style={W.whead}><div style={W.wtitle}>🔧 Status Perbaikan</div></div>
          <div style={W.wbody}>
            {TIKET_DATA.map((t) => (
              <div key={t.id} style={W.row}>
                <div>
                  <div style={{ fontSize:12, fontWeight:500, color:"#111827" }}>Kamar {t.kamar} — {t.kategori}</div>
                  <Badge color={t.prioritas==="urgent"?"#dc2626":"#6b7280"} bg={t.prioritas==="urgent"?"#fee2e2":"#f3f4f6"}>
                    {t.prioritas==="urgent"?"Urgent":"Normal"}
                  </Badge>
                </div>
                <Badge
                  color={t.status==="open"?"#dc2626":t.status==="in-progress"?"#ea580c":"#ca8a04"}
                  bg={t.status==="open"?"#fee2e2":t.status==="in-progress"?"#ffedd5":"#fef9c3"}
                >
                  {t.status==="open"?"Open":t.status==="in-progress"?"In Progress":"Ditunda"}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <div style={W.widget}>
          <div style={W.whead}><div style={W.wtitle}>💰 Kas Bulan Ini</div></div>
          <div style={W.wbody}>
            {[
              { label:"PEMASUKAN", value:21968860, color:"#22c55e" },
              { label:"PENGELUARAN", value:19721393, color:"#ef4444" },
              { label:"NET", value:21968860-19721393, color:"#f97316" },
            ].map((k) => (
              <div key={k.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:"1px solid #f3f4f6" }}>
                <span style={{ fontSize:11, fontWeight:700, color:"#9ca3af" }}>{k.label}</span>
                <span style={{ fontSize:13, fontWeight:700, color:k.color }}>{fmt(k.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={W.widget}>
        <div style={W.whead}>
          <div style={W.wtitle}>🏠 Monitor Unit</div>
          <div style={{ display:"flex", gap:12 }}>
            {Object.entries(STATUS_LABEL).map(([key, label]) => (
              <div key={key} style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, color:"#6b7280" }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:STATUS_COLOR[key] }}></div>
                {label}
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding:16 }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:8 }}>
            {KAMAR_MINI.map((k) => (
              <div key={k.id} style={{ borderRadius:8, padding:"8px 10px", border:`1.5px solid ${STATUS_COLOR[k.status]}44`, borderTop:`3px solid ${STATUS_COLOR[k.status]}` }}>
                <div style={{ fontSize:12, fontWeight:700, color:"#111827", marginBottom:4 }}>Kamar {k.id}</div>
                <Badge color={STATUS_COLOR[k.status]} bg={STATUS_COLOR[k.status]+"20"}>{STATUS_LABEL[k.status]}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardStaff() {
  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:14, marginBottom:20 }}>
        {[
          { label:"Kamar Tersedia", value:STATS.kamarKosong, color:"#22c55e", sub:"Siap disewa" },
          { label:"Kamar Booked", value:STATS.kamarBooked, color:"#eab308", sub:"Menunggu check-in" },
          { label:"Tiket Keluhan", value:STATS.tiketOpen, color:"#f97316", sub:`${STATS.tiketUrgent} urgent` },
          { label:"Kontrak Habis", value:STATS.kontrakHabis, color:"#ef4444", sub:"Bulan ini" },
        ].map((s) => (
          <div key={s.label} style={W.card}>
            <div style={W.label}>{s.label}</div>
            <div style={{ ...W.value, color:s.color }}>{s.value}</div>
            <div style={W.sub}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        <div style={W.widget}>
          <div style={W.whead}><div style={W.wtitle}>🧹 Jadwal Service Hari Ini</div></div>
          <div style={W.wbody}>
            {[3, 6, 9].map((k) => (
              <div key={k} style={W.row}>
                <span style={{ fontSize:13, color:"#111827", fontWeight:500 }}>Kamar {k}</span>
                <Badge color="#ea580c" bg="#ffedd5">Weekly Service</Badge>
              </div>
            ))}
          </div>
        </div>
        <div style={W.widget}>
          <div style={W.whead}><div style={W.wtitle}>🔧 Tiket Keluhan</div></div>
          <div style={W.wbody}>
            {TIKET_DATA.slice(0, 3).map((t) => (
              <div key={t.id} style={{ padding:"8px 0", borderBottom:"1px solid #f9fafb" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:2 }}>
                  <span style={{ fontSize:13, fontWeight:500, color:"#111827" }}>Kamar {t.kamar} — {t.kategori}</span>
                  <Badge color={t.prioritas==="urgent"?"#dc2626":"#6b7280"} bg={t.prioritas==="urgent"?"#fee2e2":"#f3f4f6"}>
                    {t.prioritas==="urgent"?"Urgent":"Normal"}
                  </Badge>
                </div>
                <div style={{ fontSize:12, color:"#9ca3af" }}>{t.deskripsi}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Modul02_Dashboard({ user }) {
  if (!user || user.role !== "admin") return <DashboardStaff />;
  return <DashboardAdmin />;
}
