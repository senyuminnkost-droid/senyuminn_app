import { useState, useEffect } from "react";

// ============================================================
// CSS
// ============================================================
const CSS = `
  .ab-wrap { display: flex; flex-direction: column; gap: 16px; }
  .ab-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
  .ab-card {
    background: #fff; border-radius: 12px; border: 1px solid #e5e7eb;
    padding: 14px 16px; position: relative; overflow: hidden;
  }
  .ab-card-bar { position: absolute; top: 0; left: 0; right: 0; height: 3px; }
  .ab-card-label { font-size: 10px; font-weight: 500; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 4px; margin-top: 8px; }
  .ab-card-val { font-size: 22px; font-weight: 700; color: #111827; font-family: 'JetBrains Mono', monospace; }
  .ab-card-sub { font-size: 11px; color: #6b7280; margin-top: 3px; }
  .ab-layout { display: grid; grid-template-columns: 1fr 340px; gap: 14px; }
  .ab-widget {
    background: #fff; border-radius: 12px; border: 1px solid #e5e7eb;
    display: flex; flex-direction: column; overflow: hidden;
  }
  .ab-widget-head {
    padding: 13px 16px 10px; border-bottom: 1px solid #f3f4f6;
    display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;
  }
  .ab-widget-title { font-size: 12px; font-weight: 600; color: #111827; display: flex; align-items: center; gap: 6px; }
  .ab-widget-action { font-size: 10px; font-weight: 500; color: #f97316; cursor: pointer; padding: 3px 8px; border-radius: 5px; }
  .ab-widget-action:hover { background: #fff7ed; }
  .ab-widget-body { padding: 14px 16px; flex: 1; }
  .ab-period {
    display: flex; align-items: center; gap: 8px;
    background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px;
    padding: 6px 10px; font-size: 12px; font-weight: 600; color: #111827;
  }
  .ab-period-btn {
    background: #fff; border: 1px solid #e5e7eb; border-radius: 6px;
    padding: 4px 8px; cursor: pointer; font-size: 12px; color: #6b7280;
    transition: all 0.12s;
  }
  .ab-period-btn:hover { background: #f3f4f6; }
  .ab-table-wrap { overflow-x: auto; }
  .ab-table {
    width: 100%; border-collapse: collapse; font-size: 11px;
    min-width: 600px;
  }
  .ab-table th {
    padding: 7px 8px; text-align: center; font-weight: 600;
    color: #9ca3af; font-size: 10px; text-transform: uppercase;
    letter-spacing: 0.5px; border-bottom: 1px solid #f3f4f6;
    background: #f9fafb; white-space: nowrap;
  }
  .ab-table th.sticky-col { text-align: left; position: sticky; left: 0; background: #f9fafb; z-index: 1; min-width: 130px; }
  .ab-table td {
    padding: 6px 8px; text-align: center; border-bottom: 1px solid #f9fafb;
    vertical-align: middle;
  }
  .ab-table td.sticky-col {
    text-align: left; position: sticky; left: 0; background: #fff; z-index: 1;
    font-size: 12px; font-weight: 500; color: #1f2937;
  }
  .ab-table tr:hover td { background: #fafafa; }
  .ab-table tr:hover td.sticky-col { background: #fafafa; }

  .ab-kode {
    display: inline-flex; align-items: center; justify-content: center;
    min-width: 28px; height: 22px; border-radius: 5px; padding: 0 5px;
    font-size: 10px; font-weight: 700; cursor: pointer;
    transition: all 0.1s; white-space: nowrap;
  }
  .ab-kode:hover { filter: brightness(0.93); transform: scale(1.05); }

  .ab-today-col { background: #fff7ed !important; }

  .ab-staff-row { display: flex; align-items: center; gap: 7px; }
  .ab-staff-avatar {
    width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, #f97316, #ea580c);
    display: flex; align-items: center; justify-content: center;
    font-size: 9px; font-weight: 700; color: #fff;
  }
  .ab-staff-jabatan { font-size: 9px; color: #9ca3af; }

  .ab-rekap-cell { font-size: 10px; font-weight: 600; color: #374151; }
  .ab-clockin-card {
    background: linear-gradient(135deg, #fff7ed, #fff);
    border: 1.5px solid #fed7aa; border-radius: 12px; padding: 18px;
    text-align: center; margin-bottom: 14px;
  }
  .ab-clockin-time {
    font-size: 36px; font-weight: 700; color: #111827;
    font-family: 'JetBrains Mono', monospace; line-height: 1; margin-bottom: 4px;
  }
  .ab-clockin-date { font-size: 12px; color: #9ca3af; margin-bottom: 14px; }
  .ab-clockin-status {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 600;
    margin-bottom: 14px;
  }
  .ab-clockin-btn {
    width: 100%; padding: 11px; border-radius: 9px; font-size: 13px; font-weight: 600;
    border: none; cursor: pointer; font-family: inherit;
    transition: all 0.15s; display: flex; align-items: center; justify-content: center; gap: 6px;
  }
  .ab-clockin-btn.in {
    background: linear-gradient(135deg, #16a34a, #15803d);
    color: #fff; box-shadow: 0 3px 12px rgba(22,163,74,0.3);
  }
  .ab-clockin-btn.out {
    background: linear-gradient(135deg, #dc2626, #b91c1c);
    color: #fff; box-shadow: 0 3px 12px rgba(220,38,38,0.3);
  }
  .ab-clockin-btn:hover { filter: brightness(1.05); transform: translateY(-1px); }
  .ab-clockin-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .ab-gps {
    display: flex; align-items: center; gap: 5px; justify-content: center;
    font-size: 11px; margin-bottom: 10px;
  }
  .ab-gps.valid   { color: #16a34a; }
  .ab-gps.invalid { color: #dc2626; }
  .ab-gps.loading { color: #9ca3af; }
  .ab-log-item {
    display: flex; align-items: center; gap: 9px;
    padding: 8px 0; border-bottom: 1px solid #f3f4f6;
  }
  .ab-log-item:last-child { border-bottom: none; }
  .ab-log-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .ab-log-info { flex: 1; }
  .ab-log-name { font-size: 12px; font-weight: 500; color: #1f2937; }
  .ab-log-time { font-size: 10px; color: #9ca3af; font-family: 'JetBrains Mono', monospace; }
  .ab-log-kode { font-size: 10px; font-weight: 600; padding: 2px 7px; border-radius: 6px; }
  .ab-lembur-form {
    background: #f9fafb; border-radius: 10px; padding: 12px 14px;
  }
  .ab-lembur-row { display: flex; gap: 8px; align-items: flex-end; }
  .ab-lembur-label { font-size: 10px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; }
  .ab-lembur-input {
    width: 100%; padding: 7px 10px; border-radius: 7px;
    border: 1.5px solid #e5e7eb; font-size: 12px; font-family: inherit;
    color: #1f2937; outline: none; background: #fff; transition: border-color 0.12s;
  }
  .ab-lembur-input:focus { border-color: #f97316; }
  .ab-lembur-btn {
    padding: 7px 14px; border-radius: 7px; font-size: 12px; font-weight: 600;
    background: linear-gradient(135deg, #f97316, #ea580c);
    color: #fff; border: none; cursor: pointer; white-space: nowrap; font-family: inherit;
  }
  .ab-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 16px; color: #9ca3af; text-align: center; gap: 6px; }
  .ab-empty-icon { font-size: 32px; opacity: 0.4; }
  .ab-empty-text { font-size: 12px; }
  .ab-empty-hint { font-size: 11px; color: #f97316; }
  @media (max-width: 1024px) {
    .ab-layout { grid-template-columns: 1fr; }
    .ab-cards { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 480px) {
    .ab-cards { grid-template-columns: repeat(2, 1fr); gap: 8px; }
  }
`;

function StyleInjector() {
  useEffect(() => {
    const id = "senyuminn-absensi-css";
    if (document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id; el.textContent = CSS;
    document.head.appendChild(el);
    return () => { const e = document.getElementById(id); if (e) e.remove(); };
  }, []);
  return null;
}

// ============================================================
// KODE ABSENSI CONFIG
// ============================================================
const KODE_CFG = {
  P:   { label: "P",   title: "Pagi",              color: "#1d4ed8", bg: "#dbeafe" },
  M:   { label: "M",   title: "Malam",             color: "#6d28d9", bg: "#ede9fe" },
  "S/M":{ label:"S/M", title: "Sore/Malam",        color: "#0e7490", bg: "#cffafe" },
  OFF: { label: "OFF", title: "Libur",             color: "#6b7280", bg: "#f3f4f6" },
  L:   { label: "L",   title: "Lembur Malam",      color: "#b45309", bg: "#fef3c7" },
  LL:  { label: "LL",  title: "Lembur Lebaran",    color: "#c2410c", bg: "#ffedd5" },
  "P/L":{ label:"P/L", title: "Pagi Lembur Malam", color: "#7c3aed", bg: "#ede9fe" },
  IJ:  { label: "IJ",  title: "Ijin",              color: "#0369a1", bg: "#e0f2fe" },
  SKT: { label: "SKT", title: "Sakit",             color: "#dc2626", bg: "#fee2e2" },
  LS:  { label: "LS",  title: "Lembur Tambahan",   color: "#d97706", bg: "#fef3c7" },
  IN:  { label: "IN",  title: "Masuk (checklist)", color: "#16a34a", bg: "#dcfce7" },
  "\u2014": { label: "\u2014",   title: "Belum diisi",       color: "#d1d5db", bg: "#f9fafb" },
};

const BULAN_NAMES = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

const fmt = (n) => "Rp " + (n || 0).toLocaleString("id-ID");
const today = new Date();
const padDate = (d) => String(d).padStart(2, "0");

// ============================================================
// CLOCK COMPONENT
// ============================================================
function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <>
      <div className="ab-clockin-time">
        {padDate(time.getHours())}:{padDate(time.getMinutes())}:{padDate(time.getSeconds())}
      </div>
      <div className="ab-clockin-date">
        {BULAN_NAMES[time.getMonth()]} {time.getDate()}, {time.getFullYear()}
      </div>
    </>
  );
}

// ============================================================
// GPS CHECK
// ============================================================
function useGPS(targetLat, targetLng, radiusM = 500) {
  const [status, setStatus] = useState("idle"); // idle | loading | valid | invalid | error
  const [dist,   setDist]   = useState(null);

  const check = () => {
    if (!targetLat || !targetLng) { setStatus("error"); return; }
    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const R = 6371000;
        const dLat = (pos.coords.latitude  - targetLat) * Math.PI / 180;
        const dLng = (pos.coords.longitude - targetLng) * Math.PI / 180;
        const a = Math.sin(dLat/2)**2 + Math.cos(targetLat*Math.PI/180) * Math.cos(pos.coords.latitude*Math.PI/180) * Math.sin(dLng/2)**2;
        const d = Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
        setDist(d);
        setStatus(d <= radiusM ? "valid" : "invalid");
      },
      () => setStatus("error"),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return { status, dist, check };
}

// ============================================================
// CLOCKIN PANEL (Staff)
// ============================================================
function ClockinPanel({ user, staffList, clockinLog, onClockin }) {
  const profil = { lat: null, lng: null }; // dari Profil Kost nanti
  const { status: gpsStatus, dist, check } = useGPS(profil.lat, profil.lng);

  const todayStr = `${today.getFullYear()}-${padDate(today.getMonth()+1)}-${padDate(today.getDate())}`;
  const logToday = clockinLog.filter(l => l.tanggal === todayStr);
  const sudahIn  = logToday.some(l => l.userId === user.id && l.tipe === "in");
  const sudahOut = logToday.some(l => l.userId === user.id && l.tipe === "out");

  const handleClockin = (tipe) => {
    if (gpsStatus !== "valid" && profil.lat) {
      alert("Lokasi di luar radius kost!"); return;
    }
    onClockin({ userId: user.id, tipe, tanggal: todayStr, jam: new Date().toTimeString().slice(0,5) });
  };

  return (
    <div>
      {/* Jam & Tombol */}
      <div className="ab-clockin-card">
        <LiveClock />

        {/* GPS Status */}
        {!profil.lat ? (
          <div className="ab-gps loading">\ud83d\udccd Titik GPS belum dikonfigurasi</div>
        ) : gpsStatus === "idle" ? (
          <div className="ab-gps loading" style={{ cursor: "pointer" }} onClick={check}>\ud83d\udccd Tap untuk cek lokasi</div>
        ) : gpsStatus === "loading" ? (
          <div className="ab-gps loading">\ud83d\udccd Mengecek lokasi...</div>
        ) : gpsStatus === "valid" ? (
          <div className="ab-gps valid">\u2705 Dalam radius kost ({dist}m)</div>
        ) : gpsStatus === "invalid" ? (
          <div className="ab-gps invalid">\u274c Di luar radius ({dist}m dari kost)</div>
        ) : (
          <div className="ab-gps invalid">\u274c Gagal mendapatkan lokasi</div>
        )}

        {/* Status hari ini */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 12 }}>
          <div className="ab-clockin-status" style={{ background: sudahIn ? "#dcfce7" : "#f3f4f6", color: sudahIn ? "#16a34a" : "#9ca3af" }}>
            {sudahIn ? "\u2705" : "\u25cb"} Clock In
          </div>
          <div className="ab-clockin-status" style={{ background: sudahOut ? "#fee2e2" : "#f3f4f6", color: sudahOut ? "#dc2626" : "#9ca3af" }}>
            {sudahOut ? "\u2705" : "\u25cb"} Clock Out
          </div>
        </div>

        {/* Tombol */}
        {!sudahIn ? (
          <button className="ab-clockin-btn in" onClick={() => handleClockin("in")}>
            \u25b6 Clock In Sekarang
          </button>
        ) : !sudahOut ? (
          <button className="ab-clockin-btn out" onClick={() => handleClockin("out")}>
            \u25a0 Clock Out Sekarang
          </button>
        ) : (
          <button className="ab-clockin-btn in" disabled>
            \u2705 Absensi Selesai Hari Ini
          </button>
        )}
      </div>

      {/* Log hari ini */}
      <div className="ab-widget" style={{ marginBottom: 14 }}>
        <div className="ab-widget-head">
          <div className="ab-widget-title">\ud83d\udccb Log Absensi Hari Ini</div>
        </div>
        <div className="ab-widget-body">
          {logToday.length === 0 ? (
            <div className="ab-empty" style={{ padding: "18px 0" }}>
              <div className="ab-empty-text">Belum ada absensi hari ini</div>
            </div>
          ) : (
            logToday.map((l, i) => (
              <div key={i} className="ab-log-item">
                <div className="ab-log-dot" style={{ background: l.tipe === "in" ? "#16a34a" : "#dc2626" }} />
                <div className="ab-log-info">
                  <div className="ab-log-name">{l.nama || user.name}</div>
                  <div className="ab-log-time">{l.jam}</div>
                </div>
                <div className="ab-log-kode" style={{ background: l.tipe === "in" ? "#dcfce7" : "#fee2e2", color: l.tipe === "in" ? "#16a34a" : "#dc2626" }}>
                  {l.tipe === "in" ? "IN" : "OUT"}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// TABEL JADWAL ADMIN
// ============================================================
function TabelJadwal({ staffList, jadwalData, periodeYear, periodeMonth, onKodeChange, isAdmin }) {
  const daysInMonth = new Date(periodeYear, periodeMonth + 1, 0).getDate();
  const todayD = today.getMonth() === periodeMonth && today.getFullYear() === periodeYear
    ? today.getDate() : -1;

  const getKode = (staffId, day) => {
    return jadwalData[`${staffId}_${periodeYear}_${padDate(periodeMonth+1)}_${padDate(day)}`] || "\u2014";
  };

  const countKode = (staffId, kode) => {
    return Array.from({ length: daysInMonth }, (_, i) => i + 1)
      .filter(d => getKode(staffId, d) === kode).length;
  };

  const KODE_OPTIONS = Object.keys(KODE_CFG).filter(k => k !== "\u2014");

  return (
    <div className="ab-table-wrap">
      {staffList.length === 0 ? (
        <div className="ab-empty">
          <div className="ab-empty-icon">\ud83d\udc64</div>
          <div className="ab-empty-text">Belum ada data staff</div>
          <div className="ab-empty-hint">Tambah staff di HR \u2192 Data Karyawan</div>
        </div>
      ) : (
        <table className="ab-table">
          <thead>
            <tr>
              <th className="sticky-col">Staff</th>
              {Array.from({ length: daysInMonth }, (_, i) => {
                const d = i + 1;
                const dow = new Date(periodeYear, periodeMonth, d).getDay();
                const isToday = d === todayD;
                return (
                  <th key={d} style={{ color: dow === 0 ? "#ef4444" : dow === 6 ? "#3b82f6" : undefined, background: isToday ? "#fff7ed" : undefined }}>
                    <div>{d}</div>
                    <div style={{ fontSize: 8 }}>{"MSMRKJS"[dow]}</div>
                  </th>
                );
              })}
              <th>P</th><th>M</th><th>S/M</th><th>OFF</th><th>L</th><th>IJ</th><th>SKT</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map(staff => (
              <tr key={staff.id}>
                <td className="sticky-col">
                  <div className="ab-staff-row">
                    <div className="ab-staff-avatar">{staff.avatar || staff.name?.[0] || "S"}</div>
                    <div>
                      <div>{staff.name}</div>
                      <div className="ab-staff-jabatan">{staff.jabatan}</div>
                    </div>
                  </div>
                </td>
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const d = i + 1;
                  const kode = getKode(staff.id, d);
                  const cfg  = KODE_CFG[kode] || KODE_CFG["\u2014"];
                  const isToday = d === todayD;
                  return (
                    <td key={d} className={isToday ? "ab-today-col" : ""}>
                      {isAdmin ? (
                        <select
                          value={kode}
                          onChange={e => onKodeChange(staff.id, periodeYear, periodeMonth, d, e.target.value)}
                          style={{
                            border: "none", background: cfg.bg, color: cfg.color,
                            borderRadius: 5, padding: "2px 3px", fontSize: 10, fontWeight: 700,
                            cursor: "pointer", fontFamily: "inherit", width: "100%",
                          }}
                        >
                          {KODE_OPTIONS.map(k => <option key={k} value={k}>{k}</option>)}
                        </select>
                      ) : (
                        <div className="ab-kode" style={{ color: cfg.color, background: cfg.bg }}>{cfg.label}</div>
                      )}
                    </td>
                  );
                })}
                {["P","M","S/M","OFF","L","IJ","SKT"].map(k => (
                  <td key={k}>
                    <div className="ab-rekap-cell" style={{ color: KODE_CFG[k]?.color }}>
                      {countKode(staff.id, k)}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ============================================================
// MAIN
// ============================================================
export default function Modul04_Absensi({ user }) {
  const isAdmin = user?.role === "superadmin" || user?.role === "admin";

  const [periodeMonth, setPeriodeMonth] = useState(today.getMonth());
  const [periodeYear,  setPeriodeYear]  = useState(today.getFullYear());
  const [jadwalData,   setJadwalData]   = useState({});   // key: staffId_Y_M_D \u2192 kode
  const [clockinLog,   setClockinLog]   = useState([]);   // [{userId, nama, tipe, tanggal, jam}]
  const [lemburStaff,  setLemburStaff]  = useState("");
  const [lemburNom,    setLemburNom]    = useState("");

  // Kosong \u2014 dari Supabase nanti
  const staffList = [];

  // Stats
  const bulanStr   = `${periodeYear}-${padDate(periodeMonth+1)}`;
  const hadir      = clockinLog.filter(l => l.tanggal?.startsWith(bulanStr) && l.tipe === "in").length;
  const totalShift = staffList.length * new Date(periodeYear, periodeMonth + 1, 0).getDate();

  const handleKodeChange = (staffId, year, month, day, kode) => {
    const key = `${staffId}_${year}_${padDate(month+1)}_${padDate(day)}`;
    setJadwalData(prev => ({ ...prev, [key]: kode }));
  };

  const handleClockin = (entry) => {
    setClockinLog(prev => [...prev, { ...entry, nama: user.name }]);
  };

  const prevMonth = () => {
    if (periodeMonth === 0) { setPeriodeYear(y => y - 1); setPeriodeMonth(11); }
    else setPeriodeMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (periodeMonth === 11) { setPeriodeYear(y => y + 1); setPeriodeMonth(0); }
    else setPeriodeMonth(m => m + 1);
  };

  return (
    <div className="ab-wrap">
      <StyleInjector />

      {/* Cards */}
      <div className="ab-cards">
        {[
          { label: "Total Staff Aktif", val: staffList.length || "\u2014", sub: "Terdaftar di sistem", color: "#3b82f6" },
          { label: "Hadir Bulan Ini",   val: hadir || "\u2014",            sub: "Clock-in tercatat",  color: "#16a34a" },
          { label: "Staff Masuk Hari Ini", val: clockinLog.filter(l => l.tanggal === `${periodeYear}-${padDate(periodeMonth+1)}-${padDate(today.getDate())}` && l.tipe === "in").length || "\u2014", sub: "Sudah clock-in", color: "#f97316" },
          { label: "Lembur Bulan Ini",  val: "\u2014",                    sub: "Total shift lembur",  color: "#8b5cf6" },
        ].map((c, i) => (
          <div key={i} className="ab-card">
            <div className="ab-card-bar" style={{ background: c.color }} />
            <div className="ab-card-label">{c.label}</div>
            <div className="ab-card-val">{c.val}</div>
            <div className="ab-card-sub">{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Layout */}
      <div className="ab-layout">

        {/* Tabel Jadwal */}
        <div className="ab-widget">
          <div className="ab-widget-head">
            <div className="ab-widget-title">\ud83d\uddd3\ufe0f Jadwal & Absensi Staff</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {isAdmin && (
                <button className="ab-widget-action" style={{ background: "#f97316", color: "#fff", borderRadius: 7, padding: "5px 10px", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600 }}>
                  + Buat Jadwal
                </button>
              )}
              <div className="ab-period">
                <button className="ab-period-btn" onClick={prevMonth}>\u2039</button>
                <span>{BULAN_NAMES[periodeMonth]} {periodeYear}</span>
                <button className="ab-period-btn" onClick={nextMonth}>\u203a</button>
              </div>
            </div>
          </div>
          <div className="ab-widget-body" style={{ padding: "12px 0" }}>

            {/* Legenda Kode */}
            <div style={{ padding: "0 14px 10px", display: "flex", gap: 6, flexWrap: "wrap" }}>
              {Object.entries(KODE_CFG).filter(([k]) => k !== "\u2014").map(([k, v]) => (
                <div key={k} style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, color: "#6b7280" }}>
                  <span style={{ background: v.bg, color: v.color, borderRadius: 4, padding: "1px 5px", fontWeight: 700, fontSize: 9 }}>{k}</span>
                  <span>{v.title}</span>
                </div>
              ))}
            </div>

            <TabelJadwal
              staffList={staffList}
              jadwalData={jadwalData}
              periodeYear={periodeYear}
              periodeMonth={periodeMonth}
              onKodeChange={handleKodeChange}
              isAdmin={isAdmin}
            />
          </div>
        </div>

        {/* Sidebar Kanan */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Clock-in (Staff) atau Log Hari Ini (Admin) */}
          {!isAdmin ? (
            <ClockinPanel
              user={user}
              staffList={staffList}
              clockinLog={clockinLog}
              onClockin={handleClockin}
            />
          ) : (
            <div className="ab-widget">
              <div className="ab-widget-head">
                <div className="ab-widget-title">\ud83d\udccb Log Absensi Hari Ini</div>
              </div>
              <div className="ab-widget-body">
                {clockinLog.filter(l => l.tanggal === `${today.getFullYear()}-${padDate(today.getMonth()+1)}-${padDate(today.getDate())}`).length === 0 ? (
                  <div className="ab-empty">
                    <div className="ab-empty-icon">\ud83d\udccb</div>
                    <div className="ab-empty-text">Belum ada absensi hari ini</div>
                  </div>
                ) : (
                  clockinLog
                    .filter(l => l.tanggal === `${today.getFullYear()}-${padDate(today.getMonth()+1)}-${padDate(today.getDate())}`)
                    .map((l, i) => (
                      <div key={i} className="ab-log-item">
                        <div className="ab-log-dot" style={{ background: l.tipe === "in" ? "#16a34a" : "#dc2626" }} />
                        <div className="ab-log-info">
                          <div className="ab-log-name">{l.nama}</div>
                          <div className="ab-log-time">{l.jam}</div>
                        </div>
                        <div className="ab-log-kode" style={{ background: l.tipe === "in" ? "#dcfce7" : "#fee2e2", color: l.tipe === "in" ? "#16a34a" : "#dc2626" }}>
                          {l.tipe === "in" ? "IN" : "OUT"}
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          )}

          {/* Input Lembur Tambahan (Admin) */}
          {isAdmin && (
            <div className="ab-widget">
              <div className="ab-widget-head">
                <div className="ab-widget-title">\u2795 Input Lembur Tambahan</div>
              </div>
              <div className="ab-widget-body">
                <div className="ab-lembur-form">
                  <div style={{ marginBottom: 10 }}>
                    <div className="ab-lembur-label">Staff</div>
                    <select className="ab-lembur-input" value={lemburStaff} onChange={e => setLemburStaff(e.target.value)}>
                      <option value="">Pilih staff...</option>
                      {staffList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <div className="ab-lembur-label">Nominal Lembur</div>
                    <input
                      className="ab-lembur-input"
                      placeholder="Rp 0"
                      value={lemburNom}
                      onChange={e => setLemburNom(e.target.value)}
                    />
                  </div>
                  <button
                    className="ab-lembur-btn"
                    style={{ width: "100%" }}
                    disabled={!lemburStaff || !lemburNom}
                    onClick={() => { alert("Lembur disimpan!"); setLemburStaff(""); setLemburNom(""); }}
                  >
                    Simpan Lembur
                  </button>
                </div>
                <div style={{ marginTop: 10, padding: "8px 12px", background: "#f9fafb", borderRadius: 8, fontSize: 11, color: "#9ca3af" }}>
                  \u2139\ufe0f Input nominal langsung tanpa approval. Akan masuk ke slip gaji bulan berjalan.
                </div>
              </div>
            </div>
          )}

          {/* Kode Legenda ringkas */}
          <div className="ab-widget">
            <div className="ab-widget-head">
              <div className="ab-widget-title">\ud83d\udcd6 Kode Absensi</div>
            </div>
            <div className="ab-widget-body">
              {Object.entries(KODE_CFG).filter(([k]) => k !== "\u2014").map(([k, v]) => (
                <div key={k} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <div style={{ background: v.bg, color: v.color, borderRadius: 5, padding: "2px 7px", fontSize: 10, fontWeight: 700, minWidth: 32, textAlign: "center" }}>{k}</div>
                  <div style={{ fontSize: 12, color: "#4b5563" }}>{v.title}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
