import { useState, useEffect } from "react";

// ============================================================
// CSS
// ============================================================
const CSS = `
  .ws-wrap { display: flex; flex-direction: column; gap: 16px; }

  /* ─── TOP CARDS ──────────────────────────── */
  .ws-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
  .ws-card {
    background: #fff; border-radius: 12px; border: 1px solid #e5e7eb;
    padding: 14px 16px; position: relative; overflow: hidden;
  }
  .ws-card-bar { position: absolute; top: 0; left: 0; right: 0; height: 3px; }
  .ws-card-label { font-size: 10px; font-weight: 500; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 4px; margin-top: 8px; }
  .ws-card-val { font-size: 22px; font-weight: 700; color: #111827; font-family: 'JetBrains Mono', monospace; }
  .ws-card-sub { font-size: 11px; color: #6b7280; margin-top: 3px; }

  /* ─── LAYOUT ─────────────────────────────── */
  .ws-layout { display: grid; grid-template-columns: 1fr 320px; gap: 14px; align-items: start; }

  /* ─── WIDGET ─────────────────────────────── */
  .ws-widget {
    background: #fff; border-radius: 12px; border: 1px solid #e5e7eb;
    display: flex; flex-direction: column; overflow: hidden;
  }
  .ws-widget-head {
    padding: 13px 16px 10px; border-bottom: 1px solid #f3f4f6;
    display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;
  }
  .ws-widget-title { font-size: 12px; font-weight: 600; color: #111827; display: flex; align-items: center; gap: 6px; }
  .ws-widget-body { padding: 14px 16px; flex: 1; }

  /* ─── PERIODE ────────────────────────────── */
  .ws-period {
    display: flex; align-items: center; gap: 8px;
    background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px;
    padding: 5px 10px; font-size: 12px; font-weight: 600; color: #111827;
  }
  .ws-period-btn {
    background: #fff; border: 1px solid #e5e7eb; border-radius: 6px;
    padding: 3px 8px; cursor: pointer; font-size: 12px; color: #6b7280; transition: all 0.12s;
  }
  .ws-period-btn:hover { background: #f3f4f6; }

  /* ─── JADWAL GRID ────────────────────────── */
  .ws-jadwal-grid { display: flex; flex-direction: column; gap: 8px; }
  .ws-jadwal-row {
    display: grid; grid-template-columns: 100px 1fr auto;
    align-items: center; gap: 12px;
    padding: 10px 14px; border-radius: 10px; border: 1.5px solid #e5e7eb;
    background: #fff; transition: all 0.12s;
  }
  .ws-jadwal-row:hover { border-color: #fed7aa; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
  .ws-jadwal-row.today { border-color: #f97316; background: #fff7ed; }
  .ws-jadwal-row.done  { border-color: #86efac; background: #f0fdf4; }
  .ws-jadwal-row.empty { border-style: dashed; background: #fafafa; }

  .ws-jadwal-date { font-size: 12px; font-weight: 600; color: #374151; font-family: 'JetBrains Mono', monospace; }
  .ws-jadwal-day  { font-size: 10px; color: #9ca3af; margin-top: 1px; }
  .ws-jadwal-kamar { display: flex; gap: 6px; flex-wrap: wrap; }
  .ws-kamar-chip {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 8px; border-radius: 20px; font-size: 11px; font-weight: 600;
    background: #fff7ed; color: #ea580c; border: 1px solid #fed7aa;
  }
  .ws-kamar-chip.done { background: #dcfce7; color: #16a34a; border-color: #86efac; }
  .ws-kamar-chip.skip { background: #f3f4f6; color: #9ca3af; border-color: #e5e7eb; text-decoration: line-through; }

  .ws-jadwal-actions { display: flex; gap: 6px; align-items: center; }
  .ws-badge {
    display: inline-flex; align-items: center; gap: 3px;
    padding: 2px 8px; border-radius: 20px; font-size: 10px; font-weight: 600;
  }

  /* ─── CHECKLIST PANEL ────────────────────── */
  .ws-checklist { display: flex; flex-direction: column; gap: 10px; }
  .ws-check-group { background: #f9fafb; border-radius: 10px; overflow: hidden; border: 1px solid #e5e7eb; }
  .ws-check-group-head {
    padding: 9px 12px; background: #fff; border-bottom: 1px solid #f3f4f6;
    display: flex; align-items: center; justify-content: space-between;
  }
  .ws-check-group-title { font-size: 11px; font-weight: 600; color: #374151; display: flex; align-items: center; gap: 5px; }
  .ws-check-group-pct { font-size: 10px; font-weight: 700; color: #f97316; }
  .ws-check-item {
    display: flex; align-items: center; gap: 9px;
    padding: 8px 12px; border-bottom: 1px solid #f3f4f6; cursor: pointer;
    transition: background 0.1s;
  }
  .ws-check-item:last-child { border-bottom: none; }
  .ws-check-item:hover { background: #fff; }
  .ws-check-item.checked { opacity: 0.7; }
  .ws-checkbox {
    width: 16px; height: 16px; border-radius: 4px; flex-shrink: 0;
    border: 2px solid #d1d5db; display: flex; align-items: center; justify-content: center;
    transition: all 0.12s; background: #fff;
  }
  .ws-check-item.checked .ws-checkbox { background: #16a34a; border-color: #16a34a; }
  .ws-check-label { font-size: 12px; color: #374151; }
  .ws-check-item.checked .ws-check-label { text-decoration: line-through; color: #9ca3af; }

  /* Progress bar */
  .ws-progress-bar { height: 4px; background: #e5e7eb; border-radius: 2px; margin: 6px 0 10px; overflow: hidden; }
  .ws-progress-fill { height: 100%; border-radius: 2px; background: linear-gradient(90deg, #f97316, #16a34a); transition: width 0.3s; }

  /* ─── MODAL JADWAL ───────────────────────── */
  .ws-overlay {
    position: fixed; inset: 0; background: rgba(17,24,39,0.45);
    backdrop-filter: blur(3px); z-index: 200; display: flex;
    align-items: center; justify-content: center; padding: 16px;
    animation: wsFade 0.18s ease;
  }
  @keyframes wsFade { from { opacity: 0; } to { opacity: 1; } }
  .ws-modal {
    background: #fff; border-radius: 16px; width: 100%; max-width: 540px;
    max-height: 90vh; overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
    animation: wsSlide 0.2s cubic-bezier(0.4,0,0.2,1);
  }
  @keyframes wsSlide { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .ws-modal-head {
    padding: 16px 20px 12px; border-bottom: 1px solid #f3f4f6;
    display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; background: #fff; z-index: 1;
  }
  .ws-modal-title { font-size: 14px; font-weight: 700; color: #111827; }
  .ws-modal-close {
    width: 28px; height: 28px; border-radius: 7px; background: #f3f4f6;
    border: none; cursor: pointer; font-size: 14px; color: #6b7280;
    display: flex; align-items: center; justify-content: center;
  }
  .ws-modal-close:hover { background: #fee2e2; color: #dc2626; }
  .ws-modal-body { padding: 16px 20px; }
  .ws-modal-foot { padding: 12px 20px; border-top: 1px solid #f3f4f6; display: flex; gap: 8px; }

  .ws-field { margin-bottom: 14px; }
  .ws-field-label { font-size: 11px; font-weight: 600; color: #374151; margin-bottom: 5px; display: block; }
  .ws-input {
    width: 100%; padding: 8px 11px; border-radius: 8px;
    border: 1.5px solid #e5e7eb; font-size: 12px; font-family: inherit;
    color: #1f2937; outline: none; background: #fff; transition: border-color 0.12s;
    box-sizing: border-box;
  }
  .ws-input:focus { border-color: #f97316; }

  .ws-kamar-selector { display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px; }
  .ws-kamar-opt {
    padding: 6px 4px; border-radius: 7px; border: 1.5px solid #e5e7eb;
    text-align: center; cursor: pointer; font-size: 11px; font-weight: 600;
    color: #6b7280; transition: all 0.12s;
  }
  .ws-kamar-opt:hover { border-color: #fed7aa; color: #ea580c; }
  .ws-kamar-opt.selected { background: #fff7ed; border-color: #f97316; color: #ea580c; }
  .ws-kamar-opt.disabled { opacity: 0.4; cursor: not-allowed; }
  .ws-kamar-count { font-size: 10px; color: #9ca3af; margin-top: 2px; }

  .ws-btn {
    flex: 1; padding: 9px 14px; border-radius: 8px; font-size: 12px; font-weight: 600;
    border: none; cursor: pointer; font-family: inherit; transition: all 0.15s;
    display: flex; align-items: center; justify-content: center; gap: 5px;
  }
  .ws-btn.primary { background: linear-gradient(135deg, #f97316, #ea580c); color: #fff; box-shadow: 0 3px 10px rgba(249,115,22,0.25); }
  .ws-btn.ghost { background: #f3f4f6; color: #4b5563; }
  .ws-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  /* ─── EMPTY ──────────────────────────────── */
  .ws-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px 16px; color: #9ca3af; text-align: center; gap: 8px; }
  .ws-empty-icon { font-size: 36px; opacity: 0.4; }
  .ws-empty-title { font-size: 14px; font-weight: 600; color: #374151; }
  .ws-empty-sub { font-size: 12px; }

  /* ─── RESPONSIVE ─────────────────────────── */
  @media (max-width: 1024px) { .ws-layout { grid-template-columns: 1fr; } }
  @media (max-width: 768px)  { .ws-cards { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 480px)  {
    .ws-cards { grid-template-columns: repeat(2, 1fr); gap: 8px; }
    .ws-jadwal-row { grid-template-columns: 80px 1fr; }
    .ws-jadwal-actions { grid-column: 1 / -1; }
    .ws-kamar-selector { grid-template-columns: repeat(4, 1fr); }
  }
`;

function StyleInjector() {
  useEffect(() => {
    const id = "senyuminn-weekly-css";
    if (document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id; el.textContent = CSS;
    document.head.appendChild(el);
    return () => { const e = document.getElementById(id); if (e) e.remove(); };
  }, []);
  return null;
}

// ============================================================
// CONFIG
// ============================================================
const BULAN_NAMES = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
const HARI_NAMES  = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];

const CHECKLIST_AREAS = [
  { group: "🏠 Per Kamar", items: ["Sapu & pel lantai", "Lap permukaan meja & lemari", "Bersihkan kamar mandi", "Ganti tempat sampah", "Cek kondisi AC", "Lap kaca & jendela"] },
  { group: "🏢 Area Umum", items: ["Selasar & tangga Lt 1-3", "Parkiran Lt 1", "Kamar mandi umum", "Langit-langit Lt 1-3", "Kantor", "Wastafel & taman"] },
  { group: "🗑️ Rutin Harian", items: ["Tempat sampah besar", "Nyalakan lampu sore", "Cek gerbang", "Buang sampah ke TPS"] },
];

const today = new Date();
const padD  = (n) => String(n).padStart(2, "0");
const fmtDate = (d) => `${d.getFullYear()}-${padD(d.getMonth()+1)}-${padD(d.getDate())}`;
const todayStr = fmtDate(today);

// ============================================================
// MODAL BUAT JADWAL
// ============================================================
function ModalJadwal({ kamarList, bulanJadwal, onClose, onSave }) {
  const [tgl,   setTgl]   = useState("");
  const [kamar, setKamar] = useState([]);
  const [staff, setStaff] = useState("");

  const toggleKamar = (id) => {
    if (kamar.includes(id)) setKamar(k => k.filter(x => x !== id));
    else if (kamar.length < 3) setKamar(k => [...k, id]);
  };

  const valid = tgl && kamar.length > 0;

  return (
    <div className="ws-overlay" onClick={onClose}>
      <div className="ws-modal" onClick={e => e.stopPropagation()}>
        <div className="ws-modal-head">
          <div className="ws-modal-title">🗓️ Buat Jadwal Weekly Service</div>
          <button className="ws-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="ws-modal-body">

          <div className="ws-field">
            <label className="ws-field-label">Tanggal Service</label>
            <input type="date" className="ws-input" value={tgl} onChange={e => setTgl(e.target.value)} />
          </div>

          <div className="ws-field">
            <label className="ws-field-label">
              Pilih Kamar <span style={{ color: "#9ca3af", fontWeight: 400 }}>(maks 3)</span>
            </label>
            {kamarList.length === 0 ? (
              <div style={{ fontSize: 12, color: "#9ca3af", padding: "10px 0" }}>
                Belum ada data kamar — tambah di Pengaturan → Profil Kost
              </div>
            ) : (
              <div className="ws-kamar-selector">
                {kamarList.map(k => {
                  const skip = k.status === "deep-clean" || k.status === "tersedia";
                  return (
                    <div
                      key={k.id}
                      className={`ws-kamar-opt ${kamar.includes(k.id) ? "selected" : ""} ${skip ? "disabled" : ""}`}
                      onClick={() => !skip && toggleKamar(k.id)}
                      title={skip ? `Skip — status: ${k.status}` : `Kamar ${k.id}`}
                    >
                      <div>K{padD(k.id)}</div>
                      <div className="ws-kamar-count">{k.tipe?.[0] || "R"}</div>
                    </div>
                  );
                })}
              </div>
            )}
            <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 6 }}>
              🔵 Kamar Deep Clean & Tersedia otomatis di-skip, masuk minggu depan
            </div>
          </div>

          <div className="ws-field">
            <label className="ws-field-label">Ditugaskan ke Staff</label>
            <select className="ws-input" value={staff} onChange={e => setStaff(e.target.value)}>
              <option value="">Pilih staff (opsional)...</option>
            </select>
          </div>

          <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 8, padding: "10px 12px", fontSize: 11, color: "#15803d" }}>
            ✅ Setelah jadwal disimpan, staff akan mendapat notifikasi WA otomatis.
          </div>
        </div>
        <div className="ws-modal-foot">
          <button className="ws-btn primary" onClick={() => { onSave({ tgl, kamar, staff }); onClose(); }} disabled={!valid}>
            Simpan Jadwal
          </button>
          <button className="ws-btn ghost" onClick={onClose}>Batal</button>
        </div>
      </div>
  );
}

// ============================================================
// CHECKLIST PANEL
// ============================================================
function ChecklistPanel({ jadwal, onClose, onSelesai }) {
  const totalItems = CHECKLIST_AREAS.reduce((s, g) => s + g.items.length, 0);
  const [checks, setChecks] = useState({});
  const [catatan, setCatatan] = useState("");

  const doneCount = Object.values(checks).filter(Boolean).length;
  const pct = totalItems ? Math.round((doneCount / totalItems) * 100) : 0;

  const toggleCheck = (gIdx, iIdx) => {
    const key = `${gIdx}_${iIdx}`;
    setChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="ws-widget">
      <div className="ws-widget-head">
        <div className="ws-widget-title">🧹 Checklist Service</div>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 16 }}>✕</button>
      </div>
      <div className="ws-widget-body" style={{ padding: "12px 14px" }}>

        {/* Header info */}
        <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 9, padding: "10px 12px", marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#111827", marginBottom: 2 }}>
            📅 {jadwal?.tgl} · {jadwal?.kamar?.map(k => `K${padD(k)}`).join(", ")}
          </div>
          <div style={{ fontSize: 10, color: "#9ca3af" }}>
            Staff: {jadwal?.staff || "Belum ditugaskan"}
          </div>
        </div>

        {/* Progress */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <span style={{ fontSize: 11, color: "#6b7280" }}>Progress</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: pct === 100 ? "#16a34a" : "#f97316" }}>{pct}%</span>
        </div>
        <div className="ws-progress-bar">
          <div className="ws-progress-fill" style={{ width: `${pct}%` }} />
        </div>

        {/* Checklist */}
        <div className="ws-checklist">
          {CHECKLIST_AREAS.map((group, gIdx) => {
            const done = group.items.filter((_, iIdx) => checks[`${gIdx}_${iIdx}`]).length;
            return (
              <div key={gIdx} className="ws-check-group">
                <div className="ws-check-group-head">
                  <div className="ws-check-group-title">{group.group}</div>
                  <div className="ws-check-group-pct">{done}/{group.items.length}</div>
                </div>
                {group.items.map((item, iIdx) => {
                  const key = `${gIdx}_${iIdx}`;
                  const checked = !!checks[key];
                  return (
                    <div key={iIdx} className={`ws-check-item ${checked ? "checked" : ""}`} onClick={() => toggleCheck(gIdx, iIdx)}>
                      <div className="ws-checkbox">{checked && <span style={{ color: "#fff", fontSize: 10 }}>✓</span>}</div>
                      <div className="ws-check-label">{item}</div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Catatan */}
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Catatan / Temuan</div>
          <textarea
            className="ws-input"
            rows={2}
            placeholder="Ada temuan kerusakan? Catat di sini..."
            value={catatan}
            onChange={e => setCatatan(e.target.value)}
            style={{ resize: "none" }}
          />
          {catatan && (
            <div style={{ marginTop: 6, fontSize: 11, color: "#f97316", cursor: "pointer", fontWeight: 500 }}>
              ⚑ Buat tiket keluhan dari temuan ini →
            </div>
          )}
        </div>

        {/* Aksi */}
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button
            className="ws-btn primary"
            onClick={() => onSelesai({ checks, catatan, pct })}
            disabled={pct < 100}
            style={{ flex: 2 }}
          >
            {pct === 100 ? "✅ Tandai Selesai" : `Selesaikan dulu (${pct}%)`}
          </button>
          <button className="ws-btn ghost" onClick={onClose} style={{ flex: 1 }}>Tutup</button>
        </div>

      </div>
    </div>
  );
}

// ============================================================
// MAIN
// ============================================================
export default function Weekly({ user }) {
  const isAdmin = user?.role === "superadmin" || user?.role === "admin";

  const [periodeMonth, setPeriodeMonth] = useState(today.getMonth());
  const [periodeYear,  setPeriodeYear]  = useState(today.getFullYear());
  const [jadwalList,   setJadwalList]   = useState([]); // dari Supabase nanti
  const [showModal,    setShowModal]    = useState(false);
  const [activeChecklist, setActiveChecklist] = useState(null);

  // Data dari Supabase nanti
  const kamarList = [];

  const prevMonth = () => {
    if (periodeMonth === 0) { setPeriodeYear(y => y-1); setPeriodeMonth(11); }
    else setPeriodeMonth(m => m-1);
  };
  const nextMonth = () => {
    if (periodeMonth === 11) { setPeriodeYear(y => y+1); setPeriodeMonth(0); }
    else setPeriodeMonth(m => m+1);
  };

  // Filter jadwal bulan ini
  const bulanStr  = `${periodeYear}-${padD(periodeMonth+1)}`;
  const jadwalBulan = jadwalList.filter(j => j.tgl?.startsWith(bulanStr))
    .sort((a, b) => a.tgl.localeCompare(b.tgl));

  const selesai  = jadwalBulan.filter(j => j.status === "selesai").length;
  const pending  = jadwalBulan.filter(j => j.status !== "selesai").length;
  const todayJadwal = jadwalBulan.filter(j => j.tgl === todayStr);
  const pctBulan = jadwalBulan.length ? Math.round((selesai / jadwalBulan.length) * 100) : 0;

  const handleSaveJadwal = ({ tgl, kamar, staff }) => {
    setJadwalList(prev => [...prev, {
      id: Date.now(), tgl, kamar, staff, status: "pending",
      checks: {}, catatan: "", createdAt: todayStr,
    }]);
  };

  const handleSelesai = (id, data) => {
    setJadwalList(prev => prev.map(j => j.id === id ? { ...j, status: "selesai", ...data } : j));
    setActiveChecklist(null);
  };

  return (
    <div className="ws-wrap">
      <StyleInjector />

      {/* Cards */}
      <div className="ws-cards">
        {[
          { label: "Jadwal Bulan Ini",  val: jadwalBulan.length || "—", color: "#3b82f6", sub: "Total dijadwalkan" },
          { label: "Selesai",           val: selesai || (jadwalBulan.length ? "0" : "—"), color: "#16a34a", sub: `${pctBulan}% completion` },
          { label: "Pending",           val: pending || (jadwalBulan.length ? "0" : "—"), color: "#f97316", sub: "Belum dikerjakan" },
          { label: "Hari Ini",          val: todayJadwal.length || "—",  color: "#8b5cf6", sub: `${todayJadwal.reduce((s,j) => s + j.kamar.length, 0)} kamar` },
        ].map((c, i) => (
          <div key={i} className="ws-card">
            <div className="ws-card-bar" style={{ background: c.color }} />
            <div className="ws-card-label">{c.label}</div>
            <div className="ws-card-val">{c.val}</div>
            <div className="ws-card-sub">{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Layout */}
      <div className="ws-layout">

        {/* Jadwal List */}
        <div className="ws-widget">
          <div className="ws-widget-head">
            <div className="ws-widget-title">🗓️ Jadwal Weekly Service</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {isAdmin && (
                <button
                  onClick={() => setShowModal(true)}
                  style={{ background: "linear-gradient(135deg,#f97316,#ea580c)", color: "#fff", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                  + Buat Jadwal
                </button>
              )}
              <div className="ws-period">
                <button className="ws-period-btn" onClick={prevMonth}>‹</button>
                <span>{BULAN_NAMES[periodeMonth]} {periodeYear}</span>
                <button className="ws-period-btn" onClick={nextMonth}>›</button>
              </div>
            </div>
          </div>
          <div className="ws-widget-body">

            {/* Progress bulan */}
            {jadwalBulan.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#6b7280", marginBottom: 4 }}>
                  <span>Progress bulan ini</span>
                  <span style={{ fontWeight: 700, color: pctBulan === 100 ? "#16a34a" : "#f97316" }}>{pctBulan}%</span>
                </div>
                <div className="ws-progress-bar">
                  <div className="ws-progress-fill" style={{ width: `${pctBulan}%` }} />
                </div>
              </div>
            )}

            {jadwalBulan.length === 0 ? (
              <div className="ws-empty">
                <div className="ws-empty-icon">🧹</div>
                <div className="ws-empty-title">Belum ada jadwal bulan ini</div>
                <div className="ws-empty-sub">
                  {isAdmin ? 'Klik "+ Buat Jadwal" untuk membuat jadwal service' : "Tunggu jadwal dari PJ Operasional"}
                </div>
              </div>
            ) : (
              <div className="ws-jadwal-grid">
                {jadwalBulan.map(j => {
                  const d    = new Date(j.tgl);
                  const isT  = j.tgl === todayStr;
                  const done = j.status === "selesai";
                  return (
                    <div key={j.id} className={`ws-jadwal-row ${isT ? "today" : ""} ${done ? "done" : ""}`}>
                      <div>
                        <div className="ws-jadwal-date">{j.tgl.slice(5)}</div>
                        <div className="ws-jadwal-day">{HARI_NAMES[d.getDay()]}</div>
                      </div>
                      <div>
                        <div className="ws-jadwal-kamar">
                          {j.kamar.map(k => (
                            <span key={k} className={`ws-kamar-chip ${done ? "done" : ""}`}>
                              {done ? "✓" : "🧹"} K{padD(k)}
                            </span>
                          ))}
                        </div>
                        {j.staff && <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 3 }}>👤 {j.staff}</div>}
                      </div>
                      <div className="ws-jadwal-actions">
                        {done ? (
                          <span className="ws-badge" style={{ background: "#dcfce7", color: "#16a34a" }}>✅ Selesai</span>
                        ) : (
                          <button
                            onClick={() => setActiveChecklist(j)}
                            style={{ padding: "5px 10px", borderRadius: 7, border: "1.5px solid #e5e7eb", background: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer", color: "#374151", transition: "all 0.12s" }}
                          >
                            {isT ? "▶ Mulai" : "📋 Checklist"}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Kanan */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Checklist aktif */}
          {activeChecklist ? (
            <ChecklistPanel
              jadwal={activeChecklist}
              onClose={() => setActiveChecklist(null)}
              onSelesai={(data) => handleSelesai(activeChecklist.id, data)}
            />
          ) : (
            <div className="ws-widget">
              <div className="ws-widget-head">
                <div className="ws-widget-title">📋 Checklist Service</div>
              </div>
              <div className="ws-widget-body">
                <div className="ws-empty" style={{ padding: "28px 0" }}>
                  <div className="ws-empty-icon">🧹</div>
                  <div className="ws-empty-sub">Klik "Mulai" atau "Checklist" pada jadwal untuk memulai</div>
                </div>
              </div>
            </div>
          )}

          {/* Area Service Info */}
          <div className="ws-widget">
            <div className="ws-widget-head">
              <div className="ws-widget-title">📖 Area yang Di-service</div>
            </div>
            <div className="ws-widget-body">
              {CHECKLIST_AREAS.map((g, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 5 }}>{g.group}</div>
                  {g.items.map((item, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#6b7280", marginBottom: 3 }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#d1d5db", flexShrink: 0 }} />
                      {item}
                    </div>
                  ))}
                </div>
              ))}
              <div style={{ marginTop: 8, padding: "8px 10px", background: "#fff7ed", borderRadius: 8, fontSize: 11, color: "#92400e" }}>
                ✏️ Checklist bisa diubah di <b>Pengaturan → SOP & Standar</b>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Modal Jadwal */}
      {showModal && (
        <ModalJadwal
          kamarList={kamarList}
          bulanJadwal={bulanStr}
          onClose={() => setShowModal(false)}
          onSave={handleSaveJadwal}
        />
      )}

    </div>
  );
}