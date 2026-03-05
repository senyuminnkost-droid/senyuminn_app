import { useState, useEffect } from "react";

const CSS = `
  .kal-wrap { display:flex; flex-direction:column; gap:16px; }
  .kal-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
  .kal-stat  { background:#fff; border-radius:12px; border:1px solid #e5e7eb; padding:12px 16px; }
  .kal-stat-val   { font-size:22px; font-weight:800; }
  .kal-stat-label { font-size:11px; color:#9ca3af; margin-top:2px; font-weight:500; }
  .kal-layout { display:grid; grid-template-columns:1fr 268px; gap:14px; align-items:start; }
  .kal-widget { background:#fff; border-radius:12px; border:1px solid #e5e7eb; overflow:hidden; }
  .kal-widget-head { padding:13px 16px 10px; border-bottom:1px solid #f3f4f6; display:flex; align-items:center; justify-content:space-between; }
  .kal-widget-title { font-size:13px; font-weight:700; color:#111827; }
  .kal-widget-body  { padding:14px 16px; }
  .kal-period { display:flex; align-items:center; gap:8px; }
  .kal-period-label { font-size:13px; font-weight:700; color:#111827; min-width:140px; text-align:center; }
  .kal-period-btn { background:#f3f4f6; border:none; border-radius:6px; padding:5px 10px; cursor:pointer; font-size:14px; color:#374151; }
  .kal-period-btn:hover { background:#e5e7eb; }
  .kal-days-header { display:grid; grid-template-columns:repeat(7,1fr); gap:2px; margin-bottom:4px; }
  .kal-day-name { text-align:center; font-size:10px; font-weight:700; padding:4px 0; }
  .kal-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:2px; }
  .kal-cell { min-height:72px; padding:5px 4px; border-radius:8px; cursor:pointer; background:#fafafa; border:1.5px solid transparent; transition:all .1s; }
  .kal-cell:hover { background:#f3f4f6; }
  .kal-cell.selected { background:#fff7ed; border-color:#f97316; }
  .kal-cell.today { background:#fff7ed; border-color:#fed7aa; }
  .kal-cell.empty { background:transparent !important; cursor:default; border-color:transparent !important; }
  .kal-cell-num { width:22px; height:22px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:11px; color:#374151; margin-bottom:3px; }
  .kal-cell.today .kal-cell-num { background:#f97316; color:#fff; font-weight:700; }
  .kal-pill { font-size:9px; font-weight:600; padding:1px 5px; border-radius:4px; margin-bottom:2px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .kal-more { font-size:9px; color:#9ca3af; padding-left:2px; }
  .kal-right { display:flex; flex-direction:column; gap:12px; }
  .kal-event-item { padding:10px 12px; border-radius:9px; margin-bottom:8px; border:1px solid transparent; }
  .kal-event-item:last-child { margin-bottom:0; }
  .kal-empty-state { text-align:center; padding:24px 0; color:#9ca3af; }
  .kal-legenda-item { display:flex; align-items:center; gap:8px; margin-bottom:7px; font-size:11px; color:#4b5563; }
  .kal-dot { width:10px; height:10px; border-radius:50%; flex-shrink:0; }
  .kal-btn { display:inline-flex; align-items:center; gap:5px; padding:6px 12px; border-radius:8px; font-size:11px; font-weight:600; border:none; cursor:pointer; font-family:inherit; background:linear-gradient(135deg,#f97316,#ea580c); color:#fff; }
  .kal-btn:disabled { opacity:.4; cursor:not-allowed; }
  .kal-btn-ghost { display:inline-flex; align-items:center; gap:5px; padding:6px 12px; border-radius:8px; font-size:11px; font-weight:600; border:none; cursor:pointer; font-family:inherit; background:#f3f4f6; color:#4b5563; }
  .kal-overlay { position:fixed !important; inset:0 !important; background:rgba(17,24,39,.6) !important; z-index:9999 !important; display:flex !important; align-items:center !important; justify-content:center !important; }
  .kal-modal { background:#fff; border-radius:14px; width:100%; max-width:420px; box-shadow:0 20px 60px rgba(0,0,0,.2); }
  .kal-modal-head { padding:14px 18px 12px; border-bottom:1px solid #f3f4f6; display:flex; align-items:center; justify-content:space-between; }
  .kal-modal-title { font-size:13px; font-weight:700; color:#111827; }
  .kal-modal-close { width:26px; height:26px; border-radius:7px; background:#f3f4f6; border:none; cursor:pointer; font-size:13px; }
  .kal-modal-body { padding:16px 18px; display:flex; flex-direction:column; gap:11px; }
  .kal-modal-foot { padding:11px 18px; border-top:1px solid #f3f4f6; display:flex; gap:8px; }
  .kal-field { display:flex; flex-direction:column; gap:5px; }
  .kal-label { font-size:11px; font-weight:600; color:#374151; }
  .kal-input { padding:8px 11px; border-radius:8px; border:1.5px solid #e5e7eb; font-size:12px; font-family:inherit; color:#1f2937; outline:none; width:100%; box-sizing:border-box; }
  .kal-input:focus { border-color:#f97316; }
  .kal-select { padding:8px 10px; border-radius:8px; border:1.5px solid #e5e7eb; font-size:12px; font-family:inherit; color:#374151; outline:none; background:#fff; width:100%; box-sizing:border-box; }
  .kal-select:focus { border-color:#f97316; }
  @media(max-width:900px){ .kal-layout{grid-template-columns:1fr} .kal-stats{grid-template-columns:repeat(2,1fr)} }
`;

function StyleInjector() {
  useEffect(() => {
    const id = "senyuminn-kal-css";
    if (document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id; el.textContent = CSS;
    document.head.appendChild(el);
    return () => { const e = document.getElementById(id); if (e) e.remove(); };
  }, []);
  return null;
}

const EVENT_CFG = {
  weekly:      { label:"Weekly Service", color:"#2563eb", bg:"#dbeafe", icon:"🧹" },
  servis_ac:   { label:"Servis AC",      color:"#0891b2", bg:"#cffafe", icon:"❄️" },
  deepclean:   { label:"Deep Clean",     color:"#0ea5e9", bg:"#e0f2fe", icon:"✨" },
  checkin:     { label:"Check-in",       color:"#f97316", bg:"#ffedd5", icon:"🔑" },
  checkout:    { label:"Check-out",      color:"#7c3aed", bg:"#ede9fe", icon:"📦" },
  keluhan:     { label:"Keluhan",        color:"#dc2626", bg:"#fee2e2", icon:"🔴" },
  maintenance: { label:"Maintenance",    color:"#d97706", bg:"#fef3c7", icon:"🔧" },
  selesai:     { label:"Selesai",        color:"#16a34a", bg:"#dcfce7", icon:"✅" },
  reminder:    { label:"Reminder",       color:"#9ca3af", bg:"#f3f4f6", icon:"⚠️" },
};



const BULAN = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
const HARI  = ["MIN","SEN","SEL","RAB","KAM","JUM","SAB"];

const toDateStr = (y, m, d) =>
  `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;

export default function Kalender({ user, globalData = {} }) {
  const {
    isReadOnly    = false,
    tiketList     = [],
    weeklyList    = [],
    penyewaList   = [],
    kamarList     = [],
  } = globalData;

  const today    = new Date();
  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());

  const [year,         setYear]         = useState(today.getFullYear());
  const [month,        setMonth]        = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [showModal,    setShowModal]    = useState(false);
  const [manualEvents, setManualEvents] = useState([]); // event input manual
  const [form,         setForm]         = useState({ tanggal: todayStr, tipe:"weekly", label:"", catatan:"" });

  const canEdit = user?.role === "manajemen";

  // ── Generate events otomatis dari data real ──
  const autoEvents = [];

  // Tiket keluhan → event di tanggal dibuat
  tiketList.forEach(t => {
    if (!t.tanggal) return;
    autoEvents.push({
      id:      `tiket-${t.id}`,
      tanggal: t.tanggal,
      tipe:    t.status === "selesai" ? "selesai" : t.prioritas === "urgent" ? "keluhan" : "keluhan",
      label:   `${t.prioritas==="urgent"?"🔴":"🔧"} Tiket Kamar ${t.kamar} — ${t.kategori}`,
      catatan: t.deskripsi,
      sumber:  "auto",
    });
  });

  // Weekly service → event di tanggal jadwal
  weeklyList.forEach(w => {
    if (!w.tanggal) return;
    autoEvents.push({
      id:      `weekly-${w.id||w.tanggal}`,
      tanggal: w.tanggal,
      tipe:    "weekly",
      label:   `🧹 Weekly Service — Kamar ${Array.isArray(w.kamarIds)?w.kamarIds.join(", "):w.kamarId||""}`,
      catatan: w.catatan || "",
      sumber:  "auto",
    });
  });

  // Kontrak penyewa — reminder H-30 & check-out
  penyewaList.forEach(p => {
    if (p.kontrakSelesai) {
      autoEvents.push({
        id:      `checkout-${p.id}`,
        tanggal: p.kontrakSelesai,
        tipe:    "checkout",
        label:   `📦 Kontrak Selesai — ${p.namaPenyewa} (Kamar ${p.kamarId})`,
        catatan: "Reminder perpanjangan atau check-out",
        sumber:  "auto",
      });
    }
  });

  // Gabung auto + manual events
  const eventList = [...autoEvents, ...manualEvents];

  // Build event map
  const eventMap = {};
  eventList.forEach(ev => {
    if (!eventMap[ev.tanggal]) eventMap[ev.tanggal] = [];
    eventMap[ev.tanggal].push(ev);
  });

  // Grid
  const daysInMonth    = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const cells = [];
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  };

  const selectedEvents = selectedDate ? (eventMap[selectedDate] || []) : [];

  const bulanStr = `${year}-${String(month + 1).padStart(2,"0")}`;
  const bulanEvents = eventList.filter(e => e.tanggal.startsWith(bulanStr));
  const statsCount = {
    weekly:  bulanEvents.filter(e => e.tipe === "weekly").length,
    keluhan: bulanEvents.filter(e => e.tipe === "keluhan").length,
    checkin: bulanEvents.filter(e => e.tipe === "checkin" || e.tipe === "checkout").length,
    total:   bulanEvents.length,
  };

  const handleAdd = () => {
    if (!form.tanggal || !form.label.trim()) return;
    setManualEvents(prev => [...prev, { id: Date.now(), ...form, sumber:"manual" }]);
    setForm({ tanggal: selectedDate || todayStr, tipe:"weekly", label:"", catatan:"" });
    setShowModal(false);
  };

  return (
    <div className="kal-wrap">
      <StyleInjector />

      {/* Stats */}
      <div className="kal-stats">
        {[
          { val: statsCount.weekly,  label: "Weekly Service",  color: "#2563eb" },
          { val: statsCount.keluhan, label: "Keluhan",         color: "#dc2626" },
          { val: statsCount.checkin, label: "Check-in/out",    color: "#ea580c" },
          { val: statsCount.total,   label: "Total Event",     color: "#374151" },
        ].map((s, i) => (
          <div key={i} className="kal-stat">
            <div className="kal-stat-val" style={{ color: s.color }}>{s.val}</div>
            <div className="kal-stat-label">{s.label} bulan ini</div>
          </div>
        ))}
      </div>

      <div className="kal-layout">
        {/* Kalender utama */}
        <div className="kal-widget">
          <div className="kal-widget-head">
            <div className="kal-widget-title">📅 Kalender Operasional</div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              {canEdit && (
                <button className="kal-btn" onClick={() => {
                  setForm(f => ({ ...f, tanggal: selectedDate || todayStr }));
                  setShowModal(true);
                }}>
                  ＋ Tambah Event
                </button>
              )}
              <div className="kal-period">
                <button className="kal-period-btn" onClick={prevMonth}>‹</button>
                <span className="kal-period-label">{BULAN[month].toUpperCase()} {year}</span>
                <button className="kal-period-btn" onClick={nextMonth}>›</button>
              </div>
            </div>
          </div>

          <div className="kal-widget-body">
            <div className="kal-days-header">
              {HARI.map(h => (
                <div key={h} className="kal-day-name"
                  style={{ color: h==="MIN"?"#ef4444": h==="SAB"?"#3b82f6":"#9ca3af" }}>
                  {h}
                </div>
              ))}
            </div>

            <div className="kal-grid">
              {cells.map((day, i) => {
                if (!day) return <div key={`e-${i}`} className="kal-cell empty" />;
                const dateStr  = toDateStr(year, month, day);
                const events   = eventMap[dateStr] || [];
                const isToday  = dateStr === todayStr;
                const isSel    = dateStr === selectedDate;
                const dow      = new Date(year, month, day).getDay();
                return (
                  <div key={day}
                    className={`kal-cell${isSel ? " selected" : ""}${isToday ? " today" : ""}`}
                    onClick={() => setSelectedDate(dateStr)}>
                    <div className="kal-cell-num"
                      style={{ color: dow===0?"#ef4444": dow===6?"#3b82f6":"#374151" }}>
                      {day}
                    </div>
                    {events.slice(0, 2).map((ev, ei) => {
                      const cfg = EVENT_CFG[ev.tipe] || EVENT_CFG.reminder;
                      return (
                        <div key={ei} className="kal-pill"
                          style={{ background: cfg.bg, color: cfg.color }}>
                          {cfg.icon} {ev.label.split("—")[0].trim()}
                        </div>
                      );
                    })}
                    {events.length > 2 && (
                      <div className="kal-more">+{events.length - 2}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Panel kanan */}
        <div className="kal-right">
          {/* Detail tanggal terpilih */}
          <div className="kal-widget">
            <div className="kal-widget-head">
              <div className="kal-widget-title" style={{ fontSize:12 }}>
                {selectedDate
                  ? new Date(selectedDate + "T00:00:00").toLocaleDateString("id-ID",
                      { weekday:"long", day:"numeric", month:"long" })
                  : "Pilih tanggal"}
              </div>
            </div>
            <div className="kal-widget-body">
              {selectedEvents.length === 0 ? (
                <div className="kal-empty-state">
                  <div style={{ fontSize:28, marginBottom:6 }}>📭</div>
                  <div style={{ fontSize:12, fontWeight:600, color:"#374151" }}>Tidak ada event</div>
                  {canEdit && (
                    <div style={{ fontSize:11, color:"#f97316", marginTop:6, cursor:"pointer", fontWeight:600 }}
                      onClick={() => { setForm(f=>({...f, tanggal: selectedDate})); setShowModal(true); }}>
                      + Tambah event
                    </div>
                  )}
                </div>
              ) : (
                selectedEvents.map(ev => {
                  const cfg = EVENT_CFG[ev.tipe] || EVENT_CFG.reminder;
                  return (
                    <div key={ev.id} className="kal-event-item"
                      style={{ background: cfg.bg, borderColor: cfg.color + "55" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:12, fontWeight:600, color: cfg.color }}>
                            {cfg.icon} {ev.label}
                          </div>
                          <div style={{ fontSize:10, color: cfg.color, opacity:.75, marginTop:2 }}>
                            {cfg.label}
                          </div>
                          {ev.catatan && (
                            <div style={{ fontSize:11, color:"#6b7280", marginTop:4 }}>{ev.catatan}</div>
                          )}
                        </div>
                        {canEdit && ev.sumber === "manual" && (
                          <button onClick={() => {
                            if (window.confirm("Hapus event ini?"))
                              setManualEvents(prev => prev.filter(e => e.id !== ev.id));
                          }} style={{ background:"none", border:"none", cursor:"pointer", fontSize:11, color:"#9ca3af", padding:"0 2px", flexShrink:0 }}>
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Legenda */}
          <div className="kal-widget">
            <div className="kal-widget-head">
              <div className="kal-widget-title">🎨 Legenda</div>
            </div>
            <div className="kal-widget-body">
              {Object.entries(EVENT_CFG).map(([key, cfg]) => (
                <div key={key} className="kal-legenda-item">
                  <div className="kal-dot" style={{ background: cfg.color }} />
                  <span>{cfg.icon} {cfg.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal tambah event */}
      {showModal && (
        <div className="kal-overlay" onClick={() => setShowModal(false)}>
          <div className="kal-modal" onClick={e => e.stopPropagation()}>
            <div className="kal-modal-head">
              <div className="kal-modal-title">＋ Tambah Event Kalender</div>
              <button className="kal-modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="kal-modal-body">
              <div className="kal-field">
                <label className="kal-label">Tanggal *</label>
                <input className="kal-input" type="date" value={form.tanggal}
                  onChange={e => setForm(f => ({ ...f, tanggal: e.target.value }))} />
              </div>
              <div className="kal-field">
                <label className="kal-label">Tipe Event *</label>
                <select className="kal-select" value={form.tipe}
                  onChange={e => setForm(f => ({ ...f, tipe: e.target.value }))}>
                  {Object.entries(EVENT_CFG).map(([key, cfg]) => (
                    <option key={key} value={key}>{cfg.icon} {cfg.label}</option>
                  ))}
                </select>
              </div>
              <div className="kal-field">
                <label className="kal-label">Keterangan *</label>
                <input className="kal-input" value={form.label}
                  onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
                  placeholder="Contoh: Weekly Service — Kamar 1, 4, 7" />
              </div>
              <div className="kal-field">
                <label className="kal-label">Catatan (opsional)</label>
                <input className="kal-input" value={form.catatan}
                  onChange={e => setForm(f => ({ ...f, catatan: e.target.value }))}
                  placeholder="Detail tambahan..." />
              </div>
            </div>
            <div className="kal-modal-foot">
              <button className="kal-btn"
                disabled={!form.tanggal || !form.label.trim()}
                onClick={handleAdd}>
                ✅ Simpan
              </button>
              <button className="kal-btn-ghost" onClick={() => setShowModal(false)}>Batal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
