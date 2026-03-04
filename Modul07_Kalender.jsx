import { useState, useEffect } from "react";

// ============================================================
// CSS
// ============================================================
const CSS = `
  .kal-wrap { display: flex; flex-direction: column; gap: 16px; }

  /* ─── LAYOUT ─────────────────────────────── */
  .kal-layout { display: grid; grid-template-columns: 1fr 280px; gap: 14px; align-items: start; }

  /* ─── WIDGET ─────────────────────────────── */
  .kal-widget {
    background: #fff; border-radius: 12px; border: 1px solid #e5e7eb;
    display: flex; flex-direction: column; overflow: hidden;
  }
  .kal-widget-head {
    padding: 13px 16px 10px; border-bottom: 1px solid #f3f4f6;
    display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;
  }
  .kal-widget-title { font-size: 12px; font-weight: 600; color: #111827; display: flex; align-items: center; gap: 6px; }
  .kal-widget-body { padding: 14px 16px; flex: 1; }

  /* ─── PERIOD NAV ─────────────────────────── */
  .kal-period {
    display: flex; align-items: center; gap: 8px;
    background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px;
    padding: 5px 10px; font-size: 13px; font-weight: 700; color: #111827;
  }
  .kal-period-btn {
    background: #fff; border: 1px solid #e5e7eb; border-radius: 6px;
    padding: 4px 10px; cursor: pointer; font-size: 14px; color: #6b7280;
    transition: all 0.12s; line-height: 1;
  }
  .kal-period-btn:hover { background: #f3f4f6; }

  /* ─── CALENDAR GRID ──────────────────────── */
  .kal-grid-head {
    display: grid; grid-template-columns: repeat(7, 1fr);
    gap: 2px; margin-bottom: 4px;
  }
  .kal-day-label {
    text-align: center; font-size: 10px; font-weight: 700;
    color: #9ca3af; padding: 4px 0; text-transform: uppercase; letter-spacing: 0.5px;
  }
  .kal-day-label.sun { color: #ef4444; }
  .kal-day-label.sat { color: #3b82f6; }

  .kal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }

  .kal-cell {
    min-height: 72px; padding: 5px 4px; border-radius: 8px;
    cursor: pointer; transition: all 0.1s; position: relative;
    border: 1.5px solid transparent;
  }
  .kal-cell:hover { background: #f9fafb; border-color: #e5e7eb; }
  .kal-cell.today { background: #fff7ed; border-color: #fed7aa; }
  .kal-cell.selected { background: #fff7ed; border-color: #f97316; }
  .kal-cell.other-month { opacity: 0.35; }

  .kal-cell-num {
    width: 22px; height: 22px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 400; color: #374151; margin-bottom: 3px;
  }
  .kal-cell.today .kal-cell-num { background: #f97316; color: #fff; font-weight: 700; }
  .kal-cell-num.sun { color: #ef4444; }
  .kal-cell-num.sat { color: #3b82f6; }

  .kal-event-pill {
    font-size: 9px; font-weight: 600; padding: 1px 5px; border-radius: 4px;
    margin-bottom: 1px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    cursor: pointer;
  }
  .kal-event-more { font-size: 9px; color: #9ca3af; padding-left: 4px; }

  /* ─── RIGHT PANEL ────────────────────────── */
  .kal-right { display: flex; flex-direction: column; gap: 12px; }

  .kal-date-panel { }
  .kal-date-title { font-size: 13px; font-weight: 700; color: #111827; margin-bottom: 2px; }
  .kal-date-sub   { font-size: 10px; color: #9ca3af; margin-bottom: 12px; }

  .kal-event-item {
    padding: 10px 12px; border-radius: 9px; margin-bottom: 8px;
    border: 1px solid transparent; cursor: pointer; transition: all 0.12s;
  }
  .kal-event-item:hover { filter: brightness(0.97); }
  .kal-event-item:last-child { margin-bottom: 0; }
  .kal-event-item-top { display: flex; align-items: flex-start; gap: 7px; margin-bottom: 3px; }
  .kal-event-icon { font-size: 14px; flex-shrink: 0; margin-top: 1px; }
  .kal-event-label { font-size: 12px; font-weight: 600; flex: 1; }
  .kal-event-type  { font-size: 9px; font-weight: 500; opacity: 0.7; margin-top: 2px; }

  /* ─── LEGENDA ─────────────────────────────── */
  .kal-legenda { }
  .kal-legenda-item {
    display: flex; align-items: center; gap: 8px; margin-bottom: 7px; font-size: 12px; color: #4b5563;
  }
  .kal-legenda-dot { width: 10px; height: 10px; border-radius: 3px; flex-shrink: 0; }

  /* ─── MINI STATS ─────────────────────────── */
  .kal-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 14px; }
  .kal-stat {
    background: #fff; border: 1px solid #e5e7eb; border-radius: 10px;
    padding: 10px 12px; text-align: center;
  }
  .kal-stat-val { font-size: 20px; font-weight: 700; font-family: 'JetBrains Mono', monospace; color: #111827; }
  .kal-stat-label { font-size: 10px; color: #9ca3af; margin-top: 2px; }

  /* ─── MODAL ──────────────────────────────── */
  .kal-overlay {
    position: fixed; inset: 0; background: rgba(17,24,39,0.45);
    backdrop-filter: blur(3px); z-index: 200; display: flex;
    align-items: center; justify-content: center; padding: 16px;
    animation: kalFade 0.18s ease;
  }
  @keyframes kalFade { from { opacity: 0; } to { opacity: 1; } }
  .kal-modal {
    background: #fff; border-radius: 16px; width: 100%; max-width: 480px;
    max-height: 90vh; overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
    animation: kalSlide 0.2s cubic-bezier(0.4,0,0.2,1);
  }
  @keyframes kalSlide { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .kal-modal-head {
    padding: 16px 20px 12px; border-bottom: 1px solid #f3f4f6;
    display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; background: #fff; z-index: 1;
  }
  .kal-modal-title { font-size: 14px; font-weight: 700; color: #111827; }
  .kal-modal-close {
    width: 28px; height: 28px; border-radius: 7px; background: #f3f4f6;
    border: none; cursor: pointer; font-size: 14px; color: #6b7280;
    display: flex; align-items: center; justify-content: center;
  }
  .kal-modal-close:hover { background: #fee2e2; color: #dc2626; }
  .kal-modal-body { padding: 16px 20px; }
  .kal-modal-foot { padding: 12px 20px; border-top: 1px solid #f3f4f6; display: flex; gap: 8px; }

  .kal-field { margin-bottom: 14px; }
  .kal-field-label { font-size: 11px; font-weight: 600; color: #374151; margin-bottom: 5px; display: block; }
  .kal-input {
    width: 100%; padding: 8px 11px; border-radius: 8px;
    border: 1.5px solid #e5e7eb; font-size: 12px; font-family: inherit;
    color: #1f2937; outline: none; background: #fff; transition: border-color 0.12s;
    box-sizing: border-box;
  }
  .kal-input:focus { border-color: #f97316; }
  .kal-input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

  .kal-btn {
    flex: 1; padding: 9px 14px; border-radius: 8px; font-size: 12px; font-weight: 600;
    border: none; cursor: pointer; font-family: inherit; transition: all 0.15s;
    display: flex; align-items: center; justify-content: center; gap: 5px;
  }
  .kal-btn.primary { background: linear-gradient(135deg, #f97316, #ea580c); color: #fff; box-shadow: 0 3px 10px rgba(249,115,22,0.25); }
  .kal-btn.ghost { background: #f3f4f6; color: #4b5563; }
  .kal-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  /* Rutin list */
  .kal-rutin-item {
    display: flex; align-items: center; justify-content: space-between;
    padding: 9px 12px; border-radius: 9px; border: 1px solid #e5e7eb;
    margin-bottom: 8px; background: #f9fafb;
  }
  .kal-rutin-name { font-size: 12px; font-weight: 600; color: #1f2937; }
  .kal-rutin-meta { font-size: 10px; color: #9ca3af; margin-top: 2px; }
  .kal-rutin-next { font-size: 11px; font-weight: 600; color: #ea580c; font-family: 'JetBrains Mono', monospace; }

  /* ─── EMPTY ──────────────────────────────── */
  .kal-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 28px 0; color: #9ca3af; text-align: center; gap: 6px; }
  .kal-empty-icon { font-size: 28px; opacity: 0.4; }
  .kal-empty-text { font-size: 12px; }

  /* ─── RESPONSIVE ─────────────────────────── */
  @media (max-width: 1024px) {
    .kal-layout { grid-template-columns: 1fr; }
    .kal-cell { min-height: 60px; }
  }
  @media (max-width: 768px) {
    .kal-cell { min-height: 52px; }
    .kal-stats { grid-template-columns: repeat(3, 1fr); }
  }
  @media (max-width: 480px) {
    .kal-cell { min-height: 44px; padding: 3px 2px; }
    .kal-cell-num { width: 18px; height: 18px; font-size: 10px; }
    .kal-event-pill { display: none; }
    .kal-event-more { display: none; }
  }
`;

function StyleInjector() {
  useEffect(() => {
    const id = "senyuminn-kalender-css";
    if (document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id; el.textContent = CSS;
    document.head.appendChild(el);
    return () => { const e = document.getElementById(id); if (e) e.remove(); };
  }, []);
  return null;
}

// ============================================================
// EVENT TYPE CONFIG
// ============================================================
const EVENT_CFG = {
  weekly:      { label: "Weekly Service",    color: "#1d4ed8", bg: "#dbeafe",  icon: "🧹" },
  servis_ac:   { label: "Servis AC",         color: "#0e7490", bg: "#cffafe",  icon: "❄️" },
  keluhan:     { label: "Keluhan Baru",      color: "#dc2626", bg: "#fee2e2",  icon: "🔴" },
  selesai:     { label: "Tiket Selesai",     color: "#16a34a", bg: "#dcfce7",  icon: "✅" },
  checkin:     { label: "Check-in",          color: "#ea580c", bg: "#ffedd5",  icon: "🔑" },
  checkout:    { label: "Check-out",         color: "#7c3aed", bg: "#ede9fe",  icon: "🚪" },
  deepclean:   { label: "Deep Clean",        color: "#0369a1", bg: "#e0f2fe",  icon: "✨" },
  maintenance: { label: "Maintenance",       color: "#b45309", bg: "#fef3c7",  icon: "🔧" },
  kontrak:     { label: "Reminder Kontrak",  color: "#be185d", bg: "#fce7f3",  icon: "⚠️" },
  penggajian:  { label: "Penggajian",        color: "#15803d", bg: "#dcfce7",  icon: "💰" },
  tagihan:     { label: "Jatuh Tempo",       color: "#b45309", bg: "#fef3c7",  icon: "📋" },
};

const BULAN = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
const HARI  = ["MIN","SEN","SEL","RAB","KAM","JUM","SAB"];

const padD   = (n) => String(n).padStart(2, "0");
const today  = new Date();
const todayStr = `${today.getFullYear()}-${padD(today.getMonth()+1)}-${padD(today.getDate())}`;

// ============================================================
// INTERVAL CONFIG
// ============================================================
const INTERVAL_LABEL = {
  "1bln": "Setiap 1 bulan",
  "2bln": "Setiap 2 bulan",
  "3bln": "Setiap 3 bulan",
  "6bln": "Setiap 6 bulan",
  "1thn": "Setiap 1 tahun",
};

// ============================================================
// MODAL FORM EVENT RUTIN
// ============================================================
function ModalEventRutin({ onClose, onSave }) {
  const [form, setForm] = useState({
    nama: "", tipe: "servis_ac", interval: "2bln",
    terakhir: "", catatan: "",
  });
  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));
  const valid = form.nama && form.interval && form.terakhir;

  return (
    <div className="kal-overlay" onClick={onClose}>
      <div className="kal-modal" onClick={e => e.stopPropagation()}>
        <div className="kal-modal-head">
          <div className="kal-modal-title">🔄 Tambah Perawatan Rutin</div>
          <button className="kal-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="kal-modal-body">
          <div className="kal-field">
            <label className="kal-field-label">Nama Perawatan</label>
            <input className="kal-input" placeholder="Contoh: Servis AC Rutin, Pest Control..." value={form.nama} onChange={e => set("nama", e.target.value)} />
          </div>
          <div className="kal-input-row">
            <div className="kal-field">
              <label className="kal-field-label">Interval</label>
              <select className="kal-input" value={form.interval} onChange={e => set("interval", e.target.value)}>
                {Object.entries(INTERVAL_LABEL).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div className="kal-field">
              <label className="kal-field-label">Terakhir Dilakukan</label>
              <input type="date" className="kal-input" value={form.terakhir} onChange={e => set("terakhir", e.target.value)} />
            </div>
          </div>
          <div className="kal-field">
            <label className="kal-field-label">Catatan (opsional)</label>
            <input className="kal-input" placeholder="Contoh: Semua 13 unit AC, vendor XYZ..." value={form.catatan} onChange={e => set("catatan", e.target.value)} />
          </div>
          {form.terakhir && form.interval && (
            <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 8, padding: "10px 12px", fontSize: 12, color: "#92400e" }}>
              📅 Jadwal berikutnya akan muncul otomatis di kalender
            </div>
          )}
        </div>
        <div className="kal-modal-foot">
          <button className="kal-btn primary" onClick={() => onSave(form)} disabled={!valid}>Simpan</button>
          <button className="kal-btn ghost" onClick={onClose}>Batal</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN
// ============================================================
export default function Kalender({ user }) {
  const isAdmin = user?.role === "superadmin" || user?.role === "admin";
  const [year,  setYear]  = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [showModal, setShowModal] = useState(false);
  const [rutinList, setRutinList] = useState([]); // [{id, nama, tipe, interval, terakhir, catatan}]

  // Semua events datang dari modul lain (Supabase) — kosong dulu
  // Format: { [dateKey]: [ {type, label, ref?} ] }
  const eventMap = {};

  // ── Generate dari data modul lain (nanti dari Supabase) ──
  // weekly service    → dari Modul06_Weekly (jadwalList)
  // keluhan/tiket     → dari Modul05_Keluhan (tiketList)
  // check-in/out      → dari Modul09_Checkin
  // kontrak reminder  → dari Modul03_Monitor (kamarList kontrakSelesai H-30)
  // penggajian        → dari Modul15_Penggajian
  // tagihan jatuh tempo → dari Modul11_Tagihan

  // ── Hitung tanggal berikutnya dari interval ──
  const hitungBerikutnya = (terakhir, interval) => {
    if (!terakhir) return null;
    const d = new Date(terakhir);
    if (interval === "1bln")  d.setMonth(d.getMonth() + 1);
    if (interval === "2bln")  d.setMonth(d.getMonth() + 2);
    if (interval === "3bln")  d.setMonth(d.getMonth() + 3);
    if (interval === "6bln")  d.setMonth(d.getMonth() + 6);
    if (interval === "1thn")  d.setFullYear(d.getFullYear() + 1);
    return `${d.getFullYear()}-${padD(d.getMonth()+1)}-${padD(d.getDate())}`;
  };

  // ── Inject rutin ke eventMap ──
  rutinList.forEach(r => {
    const tgl = hitungBerikutnya(r.terakhir, r.interval);
    if (tgl) {
      if (!eventMap[tgl]) eventMap[tgl] = [];
      eventMap[tgl].push({ type: "servis_ac", label: r.nama, detail: r.catatan });
    }
  });
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const prevMonth = () => {
    if (month === 0) { setYear(y => y-1); setMonth(11); }
    else setMonth(m => m-1);
    setSelectedDate(null);
  };
  const nextMonth = () => {
    if (month === 11) { setYear(y => y+1); setMonth(0); }
    else setMonth(m => m+1);
    setSelectedDate(null);
  };

  const getDateKey = (d) => `${year}-${padD(month+1)}-${padD(d)}`;
  const getEvents  = (dateKey) => eventMap[dateKey] || [];

  const selectedEvents = selectedDate ? getEvents(selectedDate) : [];

  // Stats bulan ini
  const allEvents = Object.entries(eventMap)
    .filter(([k]) => k.startsWith(`${year}-${padD(month+1)}`))
    .flatMap(([, evs]) => evs);

  const statsCount = {
    weekly:   allEvents.filter(e => e.type === "weekly").length,
    keluhan:  allEvents.filter(e => e.type === "keluhan").length,
    checkin:  allEvents.filter(e => e.type === "checkin" || e.type === "checkout").length,
  };

  // Build calendar cells
  const cells = [];
  // Prev month trailing days
  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    cells.push({ day: prevMonthDays - i, current: false, dateKey: null });
  }
  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, current: true, dateKey: getDateKey(d) });
  }
  // Next month padding
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, current: false, dateKey: null });
  }

  return (
    <div className="kal-wrap">
      <StyleInjector />

      {/* Mini Stats */}
      <div className="kal-stats">
        {[
          { val: statsCount.weekly  || "—", label: "Weekly Service",  color: "#1d4ed8" },
          { val: statsCount.keluhan || "—", label: "Keluhan Masuk",   color: "#dc2626" },
          { val: statsCount.checkin || "—", label: "Check-in/out",    color: "#ea580c" },
        ].map((s, i) => (
          <div key={i} className="kal-stat">
            <div className="kal-stat-val" style={{ color: s.color }}>{s.val}</div>
            <div className="kal-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Layout */}
      <div className="kal-layout">

        {/* Kalender */}
        <div className="kal-widget">
          <div className="kal-widget-head">
            <div className="kal-widget-title">📅 Kalender Operasional</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {isAdmin && (
                <button
                  onClick={() => setShowModal(true)}
                  style={{ background: "linear-gradient(135deg,#f97316,#ea580c)", color: "#fff", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                  + Event Rutin
                </button>
              )}
              <div className="kal-period">
                <button className="kal-period-btn" onClick={prevMonth}>‹</button>
                <span>{BULAN[month].toUpperCase()} {year}</span>
                <button className="kal-period-btn" onClick={nextMonth}>›</button>
              </div>
            </div>
          </div>
          <div className="kal-widget-body">

            {/* Day headers */}
            <div className="kal-grid-head">
              {HARI.map((h, i) => (
                <div key={h} className={`kal-day-label ${i===0?"sun":""} ${i===6?"sat":""}`}>{h}</div>
              ))}
            </div>

            {/* Grid */}
            <div className="kal-grid">
              {cells.map((cell, idx) => {
                const events    = cell.dateKey ? getEvents(cell.dateKey) : [];
                const isToday   = cell.dateKey === todayStr;
                const isSelected= cell.dateKey === selectedDate;
                const dow       = idx % 7;

                return (
                  <div
                    key={idx}
                    className={`kal-cell ${isToday?"today":""} ${isSelected?"selected":""} ${!cell.current?"other-month":""}`}
                    onClick={() => cell.current && setSelectedDate(cell.dateKey)}
                  >
                    <div className={`kal-cell-num ${dow===0?"sun":""} ${dow===6?"sat":""}`}>
                      {cell.day}
                    </div>
                    {events.slice(0, 2).map((ev, ei) => {
                      const cfg = EVENT_CFG[ev.type] || EVENT_CFG.keluhan;
                      return (
                        <div key={ei} className="kal-event-pill"
                          style={{ background: cfg.bg, color: cfg.color }}>
                          {cfg.icon} {ev.label}
                        </div>
                      );
                    })}
                    {events.length > 2 && (
                      <div className="kal-event-more">+{events.length - 2}</div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* Kanan */}
        <div className="kal-right">

          {/* Detail tanggal */}
          <div className="kal-widget">
            <div className="kal-widget-head">
              <div className="kal-widget-title">
                📋 {selectedDate
                  ? new Date(selectedDate + "T00:00:00").toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })
                  : "Pilih tanggal"}
              </div>
            </div>
            <div className="kal-widget-body">
              {!selectedDate ? (
                <div className="kal-empty">
                  <div className="kal-empty-icon">📅</div>
                  <div className="kal-empty-text">Klik tanggal untuk melihat jadwal</div>
                </div>
              ) : selectedEvents.length === 0 ? (
                <div className="kal-empty">
                  <div className="kal-empty-icon">✅</div>
                  <div className="kal-empty-text">Tidak ada jadwal</div>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>
                    Event akan muncul otomatis dari modul terkait
                  </div>
                </div>
              ) : (
                selectedEvents.map((ev, i) => {
                  const cfg = EVENT_CFG[ev.type] || EVENT_CFG.keluhan;
                  return (
                    <div key={i} className="kal-event-item"
                      style={{ background: cfg.bg, borderColor: cfg.color + "33" }}>
                      <div className="kal-event-item-top">
                        <div className="kal-event-icon">{cfg.icon}</div>
                        <div>
                          <div className="kal-event-label" style={{ color: cfg.color }}>{ev.label}</div>
                          <div className="kal-event-type" style={{ color: cfg.color }}>{cfg.label}</div>
                        </div>
                      </div>
                      {ev.detail && (
                        <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4, paddingLeft: 21 }}>{ev.detail}</div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Legenda */}
          <div className="kal-widget">
            <div className="kal-widget-head">
              <div className="kal-widget-title">🏷️ Legenda</div>
            </div>
            <div className="kal-widget-body">
              {Object.entries(EVENT_CFG).map(([key, cfg]) => (
                <div key={key} className="kal-legenda-item">
                  <div className="kal-legenda-dot" style={{ background: cfg.color }} />
                  <span>{cfg.icon}</span>
                  <span>{cfg.label}</span>
                </div>
              ))}
              <div style={{ marginTop: 10, padding: "8px 10px", background: "#f9fafb", borderRadius: 8, fontSize: 11, color: "#9ca3af" }}>
                ℹ️ Event muncul otomatis dari modul Weekly, Keluhan, Check-in/out, Tagihan, dan Penggajian.
              </div>
            </div>
          </div>

          {/* Daftar Perawatan Rutin */}
          <div className="kal-widget">
            <div className="kal-widget-head">
              <div className="kal-widget-title">🔄 Perawatan Rutin</div>
              {isAdmin && (
                <div className="kal-widget-action" style={{ fontSize: 10, fontWeight: 500, color: "#f97316", cursor: "pointer" }} onClick={() => setShowModal(true)}>+ Tambah</div>
              )}
            </div>
            <div className="kal-widget-body">
              {rutinList.length === 0 ? (
                <div className="kal-empty" style={{ padding: "16px 0" }}>
                  <div className="kal-empty-icon">🔄</div>
                  <div className="kal-empty-text">Belum ada perawatan rutin</div>
                </div>
              ) : (
                rutinList.map(r => {
                  const next = hitungBerikutnya(r.terakhir, r.interval);
                  return (
                    <div key={r.id} className="kal-rutin-item">
                      <div>
                        <div className="kal-rutin-name">{r.nama}</div>
                        <div className="kal-rutin-meta">
                          {INTERVAL_LABEL[r.interval]} · Terakhir: {r.terakhir || "—"}
                        </div>
                      </div>
                      <div className="kal-rutin-next">{next || "—"}</div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Modal Form Event Rutin */}
      {showModal && isAdmin && (
        <ModalEventRutin
          onClose={() => setShowModal(false)}
          onSave={(data) => {
            setRutinList(prev => [...prev, { id: Date.now(), ...data }]);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}
