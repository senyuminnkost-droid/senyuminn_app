import { useState, useEffect } from "react";

// ============================================================
// DATA JOBDESK — dari Master Brief & Jobdesk PDF
// ============================================================

// Assign shift harian — PJ bisa assign staff ke shift berbeda
// key: "staffId_tanggal" → shiftOverride
const ASSIGN_INIT = {};

// Checklist harian per shift — bisa diedit di tab Pengaturan Checklist
const CHECKLIST_INIT = {
  pagi: [
    { id:"P01", area:"Gerbang & Akses",    tugas:"Buka gerbang utama pagi",                   wajib:true  },
    { id:"P02", area:"Gerbang & Akses",    tugas:"Cek & pastikan area parkir rapi",            wajib:true  },
    { id:"P03", area:"Lampu & Listrik",    tugas:"Matikan lampu area luar yang masih nyala",   wajib:true  },
    { id:"P04", area:"Lampu & Listrik",    tugas:"Cek lampu selasar Lt 1-3 (ganti jika mati)", wajib:false },
    { id:"P05", area:"Kebersihan Umum",    tugas:"Sapu & pel selasar Lt 1, 2, 3",              wajib:true  },
    { id:"P06", area:"Kebersihan Umum",    tugas:"Bersihkan tangga semua lantai",              wajib:true  },
    { id:"P07", area:"Kebersihan Umum",    tugas:"Lap pegangan tangga & railing",              wajib:false },
    { id:"P08", area:"Kamar Mandi Umum",   tugas:"Bersihkan kamar mandi Lt 1",                wajib:true  },
    { id:"P09", area:"Kamar Mandi Umum",   tugas:"Bersihkan kamar mandi Lt 2",                wajib:true  },
    { id:"P10", area:"Kamar Mandi Umum",   tugas:"Bersihkan kamar mandi Lt 3",                wajib:true  },
    { id:"P11", area:"Sampah",             tugas:"Angkat & buang sampah dari semua lantai",    wajib:true  },
    { id:"P12", area:"Sampah",             tugas:"Bersihkan & ganti kantong tempat sampah besar", wajib:true },
    { id:"P13", area:"Taman & Luar",       tugas:"Siram tanaman / taman depan",               wajib:true  },
    { id:"P14", area:"Taman & Luar",       tugas:"Bersihkan area depan & teras",              wajib:false },
    { id:"P15", area:"Kantor",             tugas:"Bersihkan & rapikan ruang kantor",           wajib:true  },
    { id:"P16", area:"Kantor",             tugas:"Cek buku tamu / log penghuni",               wajib:false },
    { id:"P17", area:"Fasilitas Bersama",  tugas:"Lap wastafel area umum",                    wajib:true  },
    { id:"P18", area:"Fasilitas Bersama",  tugas:"Bersihkan & cek kulkas bersama",            wajib:false },
  ],
  sm: [
    { id:"S01", area:"Gerbang & Lampu",    tugas:"Nyalakan lampu area luar sore hari",         wajib:true  },
    { id:"S02", area:"Gerbang & Lampu",    tugas:"Nyalakan lampu selasar & tangga semua Lt",   wajib:true  },
    { id:"S03", area:"Gerbang & Lampu",    tugas:"Kunci gerbang utama malam",                  wajib:true  },
    { id:"S04", area:"Gerbang & Lampu",    tugas:"Buka gerbang pagi (sebelum selesai shift)",  wajib:true  },
    { id:"S05", area:"Kebersihan Umum",    tugas:"Sapu selasar & tangga malam",               wajib:true  },
    { id:"S06", area:"Kebersihan Umum",    tugas:"Parkiran Lt 1 — sapu & rapikan",            wajib:true  },
    { id:"S07", area:"Kebersihan Umum",    tugas:"Cek langit-langit Lt 1-3 (sarang laba-laba)", wajib:false },
    { id:"S08", area:"Kamar Mandi Umum",   tugas:"Cek & bersihkan kamar mandi malam",         wajib:true  },
    { id:"S09", area:"Sampah",             tugas:"Buang sampah malam / sebelum subuh",         wajib:true  },
    { id:"S10", area:"Fasilitas Bersama",  tugas:"Lap wastafel & cek dapur bersama",          wajib:true  },
    { id:"S11", area:"Fasilitas Bersama",  tugas:"Cek kulkas bersama & taman",                wajib:false },
    { id:"S12", area:"Keamanan",           tugas:"Keliling monitor keamanan gedung",           wajib:true  },
    { id:"S13", area:"Keamanan",           tugas:"Catat tamu / penghuni masuk malam di log",   wajib:true  },
    { id:"S14", area:"Kantor",             tugas:"Rapikan kantor & cek kondisi umum",          wajib:true  },
    { id:"S15", area:"Kantor",             tugas:"Cek & isi buku jaga malam",                 wajib:true  },
  ],
  allshift: [
    { id:"A01", area:"Kantor",    tugas:"Bersihkan ruang kantor", wajib:true  },
    { id:"A02", area:"Sampah",    tugas:"Kelola tempat sampah besar", wajib:true },
  ],
};

// Checklist weekly service per area kamar
const WEEKLY_CHECKLIST = [
  { id:"W01", tugas:"Sapu & pel lantai kamar" },
  { id:"W02", tugas:"Bersihkan wastafel & cermin" },
  { id:"W03", tugas:"Cek & bersihkan filter AC" },
  { id:"W04", tugas:"Bersihkan jendela & teralis" },
  { id:"W05", tugas:"Buang sampah dalam kamar" },
  { id:"W06", tugas:"Lap meja, kursi & furniture" },
  { id:"W07", tugas:"Cek kondisi fasilitas kamar" },
  { id:"W08", tugas:"Foto kondisi kamar (dokumentasi)" },
];

// Jadwal weekly service Feb 2026
const WEEKLY_JADWAL_INIT = {
  "2026-02-02": [2,3,5],
  "2026-02-04": [6,8,11],
  "2026-02-07": [1,4,7],
  "2026-02-10": [9,10,12],
  "2026-02-14": [2,5,6],
  "2026-02-17": [3,11,12],
  "2026-02-21": [1,7,9],
  "2026-02-24": [4,10,6],
  "2026-02-28": [2,8,11],
};

// Mock completion data harian
const TODAY = "2026-02-26";
const BULAN_LIST = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
const STAFF = [
  { id:"EMP001", nama:"Muh. Krisna Mukti",   shift:"pagi", jabatan:"Clean & Service" },
  { id:"EMP002", nama:"Gurit Yudho Anggoro", shift:"sm",   jabatan:"Staf Penjaga Malam" },
];
const KAMAR_LIST  = Array.from({length:12},(_,i)=>i+1);
const fmtRp  = (n) => "Rp " + Number(n||0).toLocaleString("id-ID");
const GRAD   = ["linear-gradient(135deg,#f97316,#ea580c)","linear-gradient(135deg,#0d9488,#0f766e)"];

// ============================================================
// CSS
// ============================================================
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  :root{--or:#f97316;--or-d:#ea580c;--or-pale:#fff7ed;--or-light:#ffedd5;--or-mid:#fed7aa;--s900:#0f172a;--s800:#1e293b;--s700:#334155;--s600:#475569;--s400:#94a3b8;--s200:#e2e8f0;--s100:#f1f5f9;--s50:#f8fafc;--white:#fff;--red:#dc2626;--green:#16a34a;--teal:#0d9488;--blue:#1d4ed8}
  body{font-family:'Plus Jakarta Sans',sans-serif;background:var(--s50)}
  ::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-thumb{background:var(--s200);border-radius:4px}
  .topbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;flex-wrap:wrap;gap:10px}
  .tab-nav{display:flex;gap:4px;background:var(--white);border:1px solid var(--s200);border-radius:12px;padding:4px;margin-bottom:18px}
  .tab-btn{flex:1;padding:9px 8px;border-radius:9px;border:none;font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;font-weight:600;cursor:pointer;transition:all 0.15s;color:var(--s400);background:transparent;display:flex;align-items:center;justify-content:center;gap:6px}
  .tab-btn.active{background:linear-gradient(135deg,var(--or),var(--or-d));color:#fff;box-shadow:0 2px 10px rgba(249,115,22,0.3)}
  .tab-btn:hover:not(.active){color:var(--s700);background:var(--s50)}
  .w{background:var(--white);border:1px solid var(--s200);border-radius:12px;overflow:hidden;margin-bottom:14px}
  .wh{padding:12px 16px;border-bottom:1px solid var(--s100);display:flex;align-items:center;justify-content:space-between}
  .wh-title{font-size:13px;font-weight:800;color:var(--s800);display:flex;align-items:center;gap:7px}
  .wb{padding:16px}
  /* STAT ROW */
  .stat-row{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:18px}
  .sc{background:var(--white);border:1px solid var(--s200);border-radius:12px;padding:12px 14px;border-top:3px solid transparent}
  .sc-label{font-size:9px;font-weight:700;color:var(--s400);text-transform:uppercase;letter-spacing:.7px;margin-bottom:4px}
  .sc-val{font-size:20px;font-weight:800;font-family:'JetBrains Mono',monospace}
  .sc-sub{font-size:10px;color:var(--s400);margin-top:3px}
  /* SHIFT SELECTOR */
  .shift-sel{display:flex;gap:6px;margin-bottom:16px}
  .shift-btn{flex:1;padding:12px;border-radius:10px;border:2px solid var(--s200);background:var(--white);cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all 0.15s;text-align:center}
  .shift-btn.active-pagi{border-color:var(--or);background:var(--or-pale)}
  .shift-btn.active-sm{border-color:var(--teal);background:#f0fdfa}
  .shift-btn:hover:not(.active-pagi):not(.active-sm){border-color:var(--s300);background:var(--s50)}
  /* CHECKLIST */
  .area-section{margin-bottom:16px}
  .area-header{display:flex;align-items:center;justify-content:space-between;padding:8px 10px;background:var(--s50);border-radius:8px;margin-bottom:6px;cursor:pointer}
  .area-title{font-size:11px;font-weight:800;color:var(--s700);text-transform:uppercase;letter-spacing:.5px;display:flex;align-items:center;gap:6px}
  .area-prog{font-size:10px;color:var(--s400);font-weight:600}
  .cl-item{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;margin-bottom:4px;transition:all 0.12s;border:1.5px solid transparent}
  .cl-item:hover{background:var(--s50);border-color:var(--s200)}
  .cl-item.done{background:#f0fdf4;border-color:#bbf7d0}
  .cl-item.wajib-badge::after{content:'Wajib';font-size:8px;font-weight:700;color:var(--red);background:#fee2e2;padding:1px 5px;border-radius:10px;margin-left:auto;flex-shrink:0}
  .cl-check{width:20px;height:20px;border-radius:6px;border:2px solid var(--s200);background:var(--white);cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:all 0.12s}
  .cl-check.checked{background:var(--green);border-color:var(--green)}
  .cl-tugas{flex:1;font-size:12px;color:var(--s700);font-weight:500}
  .cl-tugas.done-text{text-decoration:line-through;color:var(--s400)}
  /* PROGRESS BAR */
  .prog-bar-wrap{height:8px;background:var(--s100);border-radius:4px;overflow:hidden;margin:8px 0}
  .prog-bar{height:100%;border-radius:4px;transition:width 0.4s cubic-bezier(.34,1.56,.64,1)}
  /* KAMAR GRID weekly */
  .kamar-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
  .kamar-card{background:var(--white);border:1.5px solid var(--s200);border-radius:10px;padding:12px;cursor:pointer;transition:all 0.15s;border-top:3px solid var(--s200)}
  .kamar-card:hover{border-color:var(--or-mid);box-shadow:0 2px 8px rgba(249,115,22,0.1)}
  .kamar-card.has-jadwal{border-top-color:var(--or)}
  .kamar-card.selesai{border-top-color:var(--green);background:#f0fdf4}
  .kamar-card.selected{outline:2px solid var(--or);outline-offset:1px}
  /* WEEKLY CHECKLIST */
  .wc-item{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:8px;margin-bottom:5px;background:var(--s50);transition:all .12s}
  .wc-item.done{background:#f0fdf4}
  /* EDIT CHECKLIST */
  .edit-item{display:flex;align-items:center;gap:8px;padding:7px 8px;border-radius:7px;background:var(--s50);margin-bottom:5px;border:1px solid var(--s200)}
  /* MODAL */
  .overlay{position:fixed;inset:0;background:rgba(15,23,42,.6);display:flex;align-items:center;justify-content:center;z-index:200;backdrop-filter:blur(3px)}
  .mc{background:var(--white);border-radius:16px;width:520px;max-height:88vh;overflow-y:auto;box-shadow:0 24px 60px rgba(0,0,0,.25);animation:popIn .2s cubic-bezier(.34,1.56,.64,1)}
  @keyframes popIn{from{transform:scale(.96) translateY(8px);opacity:0}to{transform:scale(1) translateY(0);opacity:1}}
  .mc-h{padding:16px 22px 12px;border-bottom:1px solid var(--s100);background:linear-gradient(135deg,var(--or-pale),var(--white))}
  .mc-b{padding:16px 22px}
  .mc-f{padding:12px 22px;border-top:1px solid var(--s100);display:flex;gap:8px;justify-content:flex-end}
  .fl{display:block;font-size:10px;font-weight:700;color:var(--s600);text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px}
  .fi{width:100%;background:var(--s50);border:1.5px solid var(--s200);border-radius:8px;padding:8px 12px;font-size:13px;color:var(--s800);font-family:'Plus Jakarta Sans',sans-serif;outline:none;transition:all .15s}
  .fi:focus{border-color:var(--or);background:var(--white)}
  .fmb{margin-bottom:12px}
  .frow{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px}
  /* BADGE */
  .badge{display:inline-flex;align-items:center;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700;white-space:nowrap}
  /* BUTTONS */
  .btn-primary{background:linear-gradient(135deg,var(--or),var(--or-d));color:#fff;border:none;border-radius:8px;padding:9px 18px;font-size:13px;font-weight:700;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all .15s;box-shadow:0 2px 8px rgba(249,115,22,.25);display:inline-flex;align-items:center;gap:6px}
  .btn-primary:hover{filter:brightness(1.05)}
  .btn-ghost{background:var(--s100);color:var(--s700);border:1px solid var(--s200);border-radius:8px;padding:9px 14px;font-size:12px;font-weight:600;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all .15s;display:inline-flex;align-items:center;gap:6px}
  .btn-ghost:hover{background:var(--s200)}
  .btn-sm{padding:5px 11px;font-size:11px;border-radius:7px}
  .btn-xs{padding:3px 8px;font-size:10px;border-radius:6px}
  .btn-red{background:#fee2e2;color:var(--red);border:1px solid #fca5a5;border-radius:6px;padding:3px 8px;font-size:10px;font-weight:700;cursor:pointer;font-family:inherit}
  .btn-red:hover{background:var(--red);color:#fff}
  .btn-green{background:#dcfce7;color:var(--green);border:1px solid #86efac;border-radius:7px;padding:6px 12px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit;display:inline-flex;align-items:center;gap:5px}
  .btn-green:hover{background:var(--green);color:#fff}
  .toaster{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--s900);color:#fff;padding:10px 22px;border-radius:30px;font-size:13px;font-weight:600;z-index:999;box-shadow:0 8px 24px rgba(0,0,0,.3);animation:toastIn .25s ease;white-space:nowrap}
  @keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  .fade-up{animation:fadeUp .25s ease forwards}
  /* KPI STRIP */
  .kpi-strip{background:linear-gradient(135deg,var(--s900),#1a0a00);border-radius:12px;padding:14px 18px;display:flex;align-items:center;gap:20px;margin-bottom:14px}
  .kpi-seg{text-align:center}
  .kpi-seg-label{font-size:9px;color:rgba(255,255,255,.35);font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px}
  .kpi-seg-val{font-size:20px;font-weight:800;font-family:'JetBrains Mono',monospace}
`;

function StyleInjector() {
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = CSS;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);
  return null;
}

function Toast({ msg, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2400); return () => clearTimeout(t); }, []);
  return <div className="toaster">{msg}</div>;
}

// ============================================================
// HELPER — group checklist by area
// ============================================================
function groupByArea(items) {
  const map = {};
  items.forEach(item => {
    if (!map[item.area]) map[item.area] = [];
    map[item.area].push(item);
  });
  return Object.entries(map);
}

// ============================================================
// TAB 1 — JOBDESK HARIAN (flexible shift)
// ============================================================
function TabJobdeskHarian({ userRole, checklist, setChecklist, onToast }) {
  const [tanggal,    setTanggal]    = useState(TODAY);
  const [completion, setCompletion] = useState({});
  const [editMode,   setEditMode]   = useState(false);
  const [newItem,    setNewItem]    = useState({ area:"", tugas:"", wajib:false });
  const [assigns,    setAssigns]    = useState(ASSIGN_INIT);
  const [showAssign, setShowAssign] = useState(false);
  // Klaim item: staffId → set item yang dia klaim dari shift lain
  const [klaim,      setKlaim]      = useState({}); // { "P05_2026-02-22_EMP002": true }

  // Shift aktif yang ditampilkan — default shift login user, tapi bisa ganti
  const [viewShift, setViewShift] = useState("pagi");

  // Cari override assign untuk staff di tanggal ini
  const getAssignedShift = (staffId) => assigns[`${staffId}_${tanggal}`] || STAFF.find(s=>s.id===staffId)?.shift || "pagi";

  const shiftData = checklist[viewShift] || [];
  const areas     = groupByArea(shiftData);

  // Key unik per item per tanggal (+ staffId untuk klaim)
  const key      = (id, staffId="") => `${id}_${tanggal}${staffId?"_"+staffId:""}`;
  const done     = (id) => !!completion[key(id)];
  const toggle   = (id) => setCompletion(p => ({ ...p, [key(id)]: !p[key(id)] }));

  // Klaim item dari shift lain
  const klaimKey  = (itemId, staffId) => `KLAIM_${itemId}_${tanggal}_${staffId}`;
  const isKlaimed = (itemId, staffId) => !!klaim[klaimKey(itemId, staffId)];
  const toggleKlaim = (itemId, staffId) => setKlaim(p => ({ ...p, [klaimKey(itemId, staffId)]: !p[klaimKey(itemId, staffId)] }));

  // Staff yang assign ke shift ini hari ini
  const staffDiShiftIni = STAFF.filter(s => getAssignedShift(s.id) === viewShift);
  // Staff lain yang klaim item dari shift ini
  const staffKlaim      = STAFF.filter(s => getAssignedShift(s.id) !== viewShift);

  // Hitung completion
  const total     = shiftData.length;
  const totalDone = shiftData.filter(i => done(i.id)).length;
  const pct       = total > 0 ? Math.round((totalDone / total) * 100) : 0;
  const wajibAll  = shiftData.filter(i => i.wajib);
  const wajibDone = wajibAll.filter(i => done(i.id)).length;
  const kpiJobdesk= Math.round((pct / 100) * 10);

  const handleSelesai = () => {
    if (wajibDone < wajibAll.length) {
      onToast(`⚠️ ${wajibAll.length - wajibDone} item wajib belum selesai!`);
      return;
    }
    onToast(`✅ Jobdesk ${activeShift === "pagi" ? "Pagi" : "S/M"} ${tanggal} — ${pct}% selesai. Laporan terkirim!`);
  };

  const addItem = () => {
    if (!newItem.tugas.trim() || !newItem.area.trim()) return;
    const id = activeShift[0].toUpperCase() + String(shiftData.length + 1).padStart(2,"0");
    setChecklist(p => ({ ...p, [activeShift]: [...p[activeShift], { id, ...newItem }] }));
    setNewItem({ area: newItem.area, tugas:"", wajib:false });
    onToast("✓ Item checklist ditambahkan");
  };
  const delItem = (id) => {
    setChecklist(p => ({ ...p, [activeShift]: p[activeShift].filter(i => i.id !== id) }));
    onToast("🗑️ Item dihapus");
  };
  const toggleWajib = (id) => {
    setChecklist(p => ({ ...p, [activeShift]: p[activeShift].map(i => i.id===id ? {...i, wajib:!i.wajib} : i) }));
  };

  const progColor = pct >= 100 ? "var(--green)" : pct >= 60 ? "var(--or)" : "var(--red)";

  return (
    <div>
      {/* KPI Strip */}
      <div className="kpi-strip">
        <div className="kpi-seg">
          <div className="kpi-seg-label">Completion Hari Ini</div>
          <div className="kpi-seg-val" style={{ color: progColor }}>{pct}%</div>
        </div>
        <div style={{ flex:1 }}>
          <div className="prog-bar-wrap" style={{ height:10, margin:0 }}>
            <div className="prog-bar" style={{ width:pct+"%", background:`linear-gradient(90deg,${progColor},${progColor}88)` }} />
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:5 }}>
            <span style={{ fontSize:10, color:"rgba(255,255,255,.3)" }}>{totalDone}/{total} item</span>
            <span style={{ fontSize:10, color:"rgba(255,255,255,.3)" }}>Wajib: {wajibDone}/{wajibAll.length}</span>
          </div>
        </div>
        <div className="kpi-seg">
          <div className="kpi-seg-label">Poin KPI Jobdesk</div>
          <div className="kpi-seg-val" style={{ color:"var(--or)" }}>{kpiJobdesk}<span style={{ fontSize:11, color:"rgba(255,255,255,.3)" }}>/10</span></div>
        </div>
        <div className="kpi-seg">
          <div className="kpi-seg-label">Item Wajib</div>
          <div className="kpi-seg-val" style={{ color: wajibDone===wajibAll.length ? "var(--green)" : "var(--red)" }}>
            {wajibDone}/{wajibAll.length}
          </div>
        </div>
      </div>

      {/* Tanggal + Shift + Assign */}
      <div style={{ display:"flex", gap:12, marginBottom:16, alignItems:"flex-start", flexWrap:"wrap" }}>
        <div>
          <label style={{ fontSize:10, fontWeight:700, color:"var(--s400)", textTransform:"uppercase", letterSpacing:.5, display:"block", marginBottom:5 }}>Tanggal</label>
          <input type="date" value={tanggal} onChange={e=>setTanggal(e.target.value)}
            style={{ background:"var(--white)", border:"1.5px solid var(--s200)", borderRadius:9, padding:"8px 14px", fontSize:13, fontWeight:700, color:"var(--s800)", fontFamily:"inherit", outline:"none" }} />
        </div>

        <div style={{ flex:1, minWidth:280 }}>
          <label style={{ fontSize:10, fontWeight:700, color:"var(--s400)", textTransform:"uppercase", letterSpacing:.5, display:"block", marginBottom:5 }}>Lihat Checklist Shift</label>
          <div className="shift-sel" style={{ margin:0 }}>
            {[
              { id:"pagi", label:"☀️ Shift Pagi", color:"pagi" },
              { id:"sm",   label:"🌙 Shift S/M",  color:"sm"   },
            ].map(s => {
              const assignedStaff = STAFF.filter(st => getAssignedShift(st.id) === s.id);
              return (
                <div key={s.id} className={`shift-btn${viewShift===s.id?" active-"+s.color:""}`} onClick={()=>setViewShift(s.id)}>
                  <div style={{ fontSize:12, fontWeight:700, color:viewShift===s.id?(s.id==="pagi"?"var(--or-d)":"var(--teal)"):"var(--s700)" }}>{s.label}</div>
                  <div style={{ fontSize:10, color:"var(--s400)", marginTop:1 }}>
                    {assignedStaff.map(st=>st.nama.split(" ")[0]).join(", ") || "Tidak ada staff"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display:"flex", gap:6, alignItems:"flex-end" }}>
          {userRole==="admin" && (
            <button className="btn-ghost btn-sm" onClick={()=>setShowAssign(true)}>👤 Assign Shift</button>
          )}
          {userRole==="admin" && (
            <button className={`btn-sm ${editMode?"btn-primary":"btn-ghost"}`} onClick={()=>setEditMode(!editMode)}>
              {editMode?"✓ Selesai Edit":"✏️ Edit"}
            </button>
          )}
          <button className="btn-green btn-sm" onClick={handleSelesai}>✅ Laporkan</button>
        </div>
      </div>

      {/* Info assign override */}
      {STAFF.some(s=>assigns[`${s.id}_${tanggal}`]) && (
        <div style={{ background:"linear-gradient(135deg,#eff6ff,#dbeafe)", border:"1px solid #93c5fd", borderRadius:9, padding:"9px 14px", marginBottom:14, display:"flex", gap:8, alignItems:"center" }}>
          <span style={{ fontSize:16 }}>🔄</span>
          <div style={{ fontSize:12, color:"#1d4ed8" }}>
            <b>Override shift hari ini:</b>{" "}
            {STAFF.filter(s=>assigns[`${s.id}_${tanggal}`]).map(s=>(
              <span key={s.id} style={{ marginRight:10 }}>
                {s.nama.split(" ")[0]} → Shift {assigns[`${s.id}_${tanggal}`]==="pagi"?"Pagi":"S/M"}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Modal Assign Shift */}
      {showAssign && (
        <div className="overlay" onClick={()=>setShowAssign(false)}>
          <div style={{ background:"var(--white)", borderRadius:16, padding:24, width:400, boxShadow:"0 20px 60px rgba(0,0,0,.25)", animation:"popIn .2s cubic-bezier(.34,1.56,.64,1)" }} onClick={e=>e.stopPropagation()}>
            <div style={{ fontSize:14, fontWeight:800, color:"var(--s900)", marginBottom:4 }}>👤 Assign Shift Harian</div>
            <div style={{ fontSize:12, color:"var(--s400)", marginBottom:16 }}>Override shift default untuk tanggal {tanggal}</div>
            {STAFF.map((s,i) => {
              const defaultShift = s.shift;
              const override     = assigns[`${s.id}_${tanggal}`];
              const currentShift = override || defaultShift;
              return (
                <div key={s.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:"1px solid var(--s100)" }}>
                  <div style={{ width:32, height:32, borderRadius:9, background:GRAD[i], display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:11, fontWeight:800, flexShrink:0 }}>{getInit(s.nama)}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:"var(--s800)" }}>{s.nama.split(" ").slice(0,2).join(" ")}</div>
                    <div style={{ fontSize:10, color:"var(--s400)" }}>Default: {defaultShift==="pagi"?"Shift Pagi":"Shift S/M"}</div>
                  </div>
                  <div style={{ display:"flex", gap:5 }}>
                    {["pagi","sm"].map(sh=>(
                      <button key={sh} onClick={()=>setAssigns(p=>({...p,[`${s.id}_${tanggal}`]:sh}))}
                        style={{ padding:"5px 10px", borderRadius:7, border:`2px solid ${currentShift===sh?(sh==="pagi"?"var(--or)":"var(--teal)"):"var(--s200)"}`, background:currentShift===sh?(sh==="pagi"?"var(--or-pale)":"#f0fdfa"):"var(--white)", color:currentShift===sh?(sh==="pagi"?"var(--or-d)":"var(--teal)"):"var(--s500)", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
                        {sh==="pagi"?"☀️ Pagi":"🌙 S/M"}
                        {defaultShift===sh&&currentShift===sh&&<span style={{ fontSize:8, opacity:.6 }}> (default)</span>}
                      </button>
                    ))}
                    {override && (
                      <button onClick={()=>setAssigns(p=>{const n={...p};delete n[`${s.id}_${tanggal}`];return n;})}
                        style={{ padding:"5px 7px", borderRadius:7, border:"1px solid var(--s200)", background:"var(--s50)", color:"var(--s400)", fontSize:10, cursor:"pointer", fontFamily:"inherit" }}>↺</button>
                    )}
                  </div>
                </div>
              );
            })}
            <div style={{ display:"flex", justifyContent:"flex-end", marginTop:16 }}>
              <button className="btn-primary btn-sm" onClick={()=>{setShowAssign(false);onToast("✓ Assign shift disimpan");}}>✓ Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODE */}
      {editMode && userRole === "admin" && (
        <div className="w">
          <div className="wh"><div className="wh-title">✏️ Edit Checklist — {activeShift === "pagi" ? "Shift Pagi" : "Shift S/M"}</div></div>
          <div className="wb">
            {shiftData.map(item => (
              <div key={item.id} className="edit-item">
                <div style={{ width:20, height:20, borderRadius:5, background:item.wajib?"#fee2e2":"var(--s100)", border:`1.5px solid ${item.wajib?"var(--red)":"var(--s200)"}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0, fontSize:9, fontWeight:800, color:item.wajib?"var(--red)":"var(--s400)" }}
                  onClick={() => toggleWajib(item.id)} title="Toggle wajib">W</div>
                <span style={{ fontSize:10, color:"var(--s400)", minWidth:60 }}>{item.area}</span>
                <span style={{ flex:1, fontSize:12, color:"var(--s700)" }}>{item.tugas}</span>
                <button className="btn-red btn-xs" onClick={() => delItem(item.id)}>×</button>
              </div>
            ))}
            {/* Add new */}
            <div style={{ marginTop:10, display:"flex", gap:6, alignItems:"center" }}>
              <input className="fi" style={{ width:100 }} placeholder="Area" value={newItem.area} onChange={e => setNewItem(p=>({...p,area:e.target.value}))} />
              <input className="fi" style={{ flex:1 }} placeholder="Deskripsi tugas baru..." value={newItem.tugas} onChange={e => setNewItem(p=>({...p,tugas:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&addItem()} />
              <label style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, color:"var(--red)", fontWeight:600, cursor:"pointer", whiteSpace:"nowrap" }}>
                <input type="checkbox" checked={newItem.wajib} onChange={e=>setNewItem(p=>({...p,wajib:e.target.checked}))} />Wajib
              </label>
              <button className="btn-primary btn-sm" onClick={addItem}>+ Tambah</button>
            </div>
          </div>
        </div>
      )}

      {/* CHECKLIST per area */}
      {!editMode && areas.map(([area, items]) => {
        const areaDone = items.filter(i => done(i.id)).length;
        const areaTotal = items.length;
        const areaPct = Math.round((areaDone / areaTotal) * 100);
        return (
          <div key={area} className="area-section">
            <div className="area-header">
              <div className="area-title">
                <div style={{ width:8, height:8, borderRadius:"50%", background: areaPct===100?"var(--green)":areaPct>0?"var(--or)":"var(--s300)" }} />
                {area}
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div className="prog-bar-wrap" style={{ width:60, margin:0 }}>
                  <div className="prog-bar" style={{ width:areaPct+"%", background:areaPct===100?"var(--green)":"var(--or)" }} />
                </div>
                <span className="area-prog">{areaDone}/{areaTotal}</span>
              </div>
            </div>
            {items.map(item => (
              <div key={item.id} className={`cl-item${done(item.id)?" done":""}${!done(item.id)&&item.wajib?" wajib-badge":""}`}
                onClick={() => toggle(item.id)}>
                <div className={`cl-check${done(item.id)?" checked":""}`}>
                  {done(item.id) && <span style={{ color:"#fff", fontSize:12, fontWeight:800 }}>✓</span>}
                </div>
                <span className={`cl-tugas${done(item.id)?" done-text":""}`}>{item.tugas}</span>
                {done(item.id) && <span style={{ fontSize:10, color:"var(--green)", fontWeight:700, marginLeft:"auto", flexShrink:0 }}>✓ Selesai</span>}
              </div>
            ))}
          </div>
        );
      })}

      {/* Section klaim item oleh staff lain */}
      {!editMode && staffKlaim.length > 0 && (
        <div className="w" style={{ border:"1px solid #c4b5fd" }}>
          <div className="wh" style={{ background:"#faf5ff" }}>
            <div className="wh-title" style={{ color:"#7c3aed" }}>🤝 Ambil Item dari Shift {viewShift==="pagi"?"Pagi":"S/M"}</div>
            <span style={{ fontSize:11, color:"#7c3aed" }}>Staff lain bisa klaim item yang perlu dikerjakan</span>
          </div>
          <div style={{ padding:"10px 14px" }}>
            {staffKlaim.map((st,si)=>(
              <div key={st.id} style={{ marginBottom:10 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                  <div style={{ width:24, height:24, borderRadius:7, background:GRAD[si+1]||GRAD[0], display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:9, fontWeight:800 }}>{getInit(st.nama)}</div>
                  <span style={{ fontSize:12, fontWeight:700, color:"var(--s700)" }}>{st.nama.split(" ")[0]} — ambil dari shift {viewShift==="pagi"?"Pagi":"S/M"}:</span>
                </div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                  {shiftData.map(item=>{
                    const claimed = isKlaimed(item.id, st.id);
                    return (
                      <button key={item.id} onClick={()=>toggleKlaim(item.id, st.id)}
                        style={{ padding:"4px 10px", borderRadius:7, border:`1.5px solid ${claimed?"#7c3aed":"var(--s200)"}`, background:claimed?"#f3e8ff":"var(--white)", color:claimed?"#7c3aed":"var(--s500)", fontSize:11, fontWeight:claimed?700:400, cursor:"pointer", fontFamily:"inherit", textDecoration:done(item.id)?"line-through":"none", opacity:done(item.id)?.5:1 }}>
                        {claimed?"✓ ":""}{item.tugas.slice(0,30)}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary bar bawah */}
      {!editMode && (
        <div style={{ background:pct===100?"linear-gradient(135deg,#f0fdf4,#dcfce7)":"linear-gradient(135deg,var(--or-pale),var(--or-light))", border:`1px solid ${pct===100?"#86efac":"var(--or-mid)"}`, borderRadius:10, padding:"12px 16px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ fontSize:13, fontWeight:700, color:pct===100?"var(--green)":"var(--or-d)" }}>
            {pct===100 ? "🎉 Semua jobdesk selesai!" : `${total-totalDone} item tersisa${wajibDone<wajibAll.length?" · "+(wajibAll.length-wajibDone)+" item wajib belum":""}`}
          </div>
          <button className="btn-green" onClick={handleSelesai}>✅ Laporkan ke WA Grup</button>
        </div>
      )}
    </div>
  );
}

// ============================================================
// TAB 2 — WEEKLY SERVICE
// ============================================================
function TabWeeklyService({ userRole, onToast }) {
  const [jadwal,      setJadwal]      = useState(WEEKLY_JADWAL_INIT);
  const [selDate,     setSelDate]     = useState(TODAY);
  const [selKamar,    setSelKamar]    = useState(null);
  const [completion,  setCompletion]  = useState({}); // { "kamar_tanggal_itemId": true }
  const [showJadwal,  setShowJadwal]  = useState(false); // modal tambah jadwal
  const [newJadwal,   setNewJadwal]   = useState({ tanggal:"", kamar:[] });

  // Semua tanggal yg punya jadwal bulan ini
  const jadwalDates = Object.keys(jadwal).sort();
  const jadwalHariIni = jadwal[selDate] || [];

  const key = (kamar, itemId) => `${kamar}_${selDate}_${itemId}`;
  const isDone = (kamar, itemId) => !!completion[key(kamar, itemId)];
  const toggleItem = (kamar, itemId) => setCompletion(p => ({ ...p, [key(kamar,itemId)]: !p[key(kamar,itemId)] }));

  const kamarPct = (kamar) => {
    const done = WEEKLY_CHECKLIST.filter(i => isDone(kamar, i.id)).length;
    return Math.round((done / WEEKLY_CHECKLIST.length) * 100);
  };

  const addJadwal = () => {
    if (!newJadwal.tanggal || newJadwal.kamar.length === 0) return;
    if (newJadwal.kamar.length > 3) { onToast("⚠️ Maksimal 3 kamar per hari!"); return; }
    setJadwal(p => ({ ...p, [newJadwal.tanggal]: newJadwal.kamar }));
    setShowJadwal(false);
    setNewJadwal({ tanggal:"", kamar:[] });
    onToast(`✓ Jadwal weekly service ${newJadwal.tanggal} ditambahkan`);
  };
  const toggleKamarJadwal = (k) => setNewJadwal(p => ({ ...p, kamar: p.kamar.includes(k) ? p.kamar.filter(x=>x!==k) : [...p.kamar, k] }));

  return (
    <div>
      {/* Jadwal list */}
      <div style={{ display:"grid", gridTemplateColumns:"280px 1fr", gap:14, alignItems:"start" }}>
        {/* LEFT — daftar tanggal */}
        <div>
          <div className="w">
            <div className="wh">
              <div className="wh-title">📅 Jadwal Bulan Ini</div>
              {userRole==="admin" && <button className="btn-primary btn-sm" onClick={()=>setShowJadwal(true)}>+ Jadwal</button>}
            </div>
            <div style={{ maxHeight:480, overflowY:"auto" }}>
              {jadwalDates.length===0 && <div style={{ padding:"24px", textAlign:"center", color:"var(--s400)", fontSize:12 }}>Belum ada jadwal</div>}
              {jadwalDates.map(tgl => {
                const kamarList = jadwal[tgl];
                const isToday = tgl===TODAY, isSel = tgl===selDate;
                const allDone = kamarList.every(k => kamarPct(k)===100 && tgl===selDate) || false;
                return (
                  <div key={tgl} onClick={() => setSelDate(tgl)} style={{ padding:"10px 14px", borderBottom:"1px solid var(--s100)", cursor:"pointer", background:isSel?"var(--or-pale)":isToday?"#fffbf0":"var(--white)", borderLeft:`3px solid ${isSel?"var(--or)":isToday?"var(--or-mid)":"transparent"}`, transition:"all .12s" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div style={{ fontSize:12, fontWeight:700, color:isSel?"var(--or-d)":"var(--s800)" }}>{tgl}</div>
                      {isToday && <span className="badge" style={{ color:"var(--or-d)", background:"var(--or-light)" }}>Hari Ini</span>}
                    </div>
                    <div style={{ display:"flex", gap:4, marginTop:4, flexWrap:"wrap" }}>
                      {kamarList.map(k => {
                        const p = isSel ? kamarPct(k) : 0;
                        return (
                          <span key={k} className="badge" style={{ color:p===100?"var(--green)":"var(--s600)", background:p===100?"#dcfce7":"var(--s100)" }}>
                            {p===100?"✓ ":""}K{k}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT — checklist kamar */}
        <div>
          {jadwalHariIni.length === 0 ? (
            <div className="w">
              <div className="wb" style={{ textAlign:"center", padding:"48px 24px", color:"var(--s400)" }}>
                <div style={{ fontSize:44, marginBottom:12 }}>📋</div>
                <div style={{ fontSize:14, fontWeight:700, color:"var(--s700)", marginBottom:6 }}>
                  {selDate === TODAY ? "Tidak ada weekly service hari ini" : `Tidak ada jadwal ${selDate}`}
                </div>
                {userRole==="admin" && <button className="btn-primary btn-sm" style={{ marginTop:8 }} onClick={()=>setShowJadwal(true)}>+ Tambah Jadwal</button>}
              </div>
            </div>
          ) : (
            <>
              {/* Kamar selector */}
              <div className="kamar-grid" style={{ marginBottom:14 }}>
                {jadwalHariIni.map(k => {
                  const pct = kamarPct(k);
                  return (
                    <div key={k} className={`kamar-card has-jadwal${pct===100?" selesai":""}${selKamar===k?" selected":""}`}
                      onClick={() => setSelKamar(selKamar===k ? null : k)}>
                      <div style={{ fontSize:14, fontWeight:800, color:"var(--s800)", marginBottom:3 }}>Kamar {k}</div>
                      <div className="prog-bar-wrap" style={{ marginBottom:6 }}>
                        <div className="prog-bar" style={{ width:pct+"%", background:pct===100?"var(--green)":"var(--or)" }} />
                      </div>
                      <div style={{ display:"flex", justifyContent:"space-between" }}>
                        <span style={{ fontSize:10, color:"var(--s400)" }}>{WEEKLY_CHECKLIST.filter(i=>isDone(k,i.id)).length}/{WEEKLY_CHECKLIST.length}</span>
                        <span style={{ fontSize:11, fontWeight:700, color:pct===100?"var(--green)":"var(--or-d)" }}>{pct}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Checklist kamar terpilih */}
              {selKamar && (
                <div className="w">
                  <div className="wh">
                    <div className="wh-title">🧹 Checklist — Kamar {selKamar}</div>
                    <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                      <span style={{ fontSize:12, color:"var(--s400)" }}>{kamarPct(selKamar)}% selesai</span>
                      {kamarPct(selKamar)===100 && (
                        <button className="btn-green btn-sm" onClick={() => onToast(`✅ Kamar ${selKamar} selesai! Laporan terkirim ke WA.`)}>
                          ✅ Laporkan
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="wb">
                    {WEEKLY_CHECKLIST.map(item => {
                      const done = isDone(selKamar, item.id);
                      return (
                        <div key={item.id} className={`wc-item${done?" done":""}`} onClick={() => toggleItem(selKamar, item.id)} style={{ cursor:"pointer" }}>
                          <div className={`cl-check${done?" checked":""}`}>
                            {done && <span style={{ color:"#fff", fontSize:12, fontWeight:800 }}>✓</span>}
                          </div>
                          <span style={{ flex:1, fontSize:13, color:done?"var(--s400)":"var(--s700)", textDecoration:done?"line-through":"none", fontWeight:done?400:500 }}>{item.tugas}</span>
                        </div>
                      );
                    })}
                    {/* Temuan */}
                    <div style={{ marginTop:12, padding:"10px 12px", background:"var(--s50)", borderRadius:8 }}>
                      <div style={{ fontSize:10, fontWeight:700, color:"var(--s400)", marginBottom:6, textTransform:"uppercase" }}>Temuan / Catatan</div>
                      <textarea className="fi" rows={2} placeholder="Ada temuan kerusakan? Catat di sini, atau buat tiket langsung..." style={{ resize:"vertical" }} />
                      <div style={{ display:"flex", gap:6, marginTop:6 }}>
                        <button className="btn-ghost btn-sm">📸 Foto</button>
                        <button className="btn-ghost btn-sm" style={{ color:"var(--red)" }} onClick={() => onToast("🔧 Tiket keluhan dibuat!")}>🔧 Buat Tiket</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal tambah jadwal */}
      {showJadwal && (
        <div className="overlay" onClick={()=>setShowJadwal(false)}>
          <div className="mc" onClick={e=>e.stopPropagation()}>
            <div className="mc-h">
              <div style={{ fontSize:14, fontWeight:800, color:"var(--s900)", marginBottom:2 }}>📅 Tambah Jadwal Weekly Service</div>
              <div style={{ fontSize:12, color:"var(--s400)" }}>Maks 3 kamar per hari</div>
            </div>
            <div className="mc-b">
              <div className="fmb">
                <label className="fl">Tanggal</label>
                <input className="fi" type="date" value={newJadwal.tanggal} onChange={e=>setNewJadwal(p=>({...p,tanggal:e.target.value}))} />
              </div>
              <div className="fmb">
                <label className="fl">Pilih Kamar ({newJadwal.kamar.length}/3)</label>
                <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                  {KAMAR_LIST.map(k => (
                    <button key={k} onClick={()=>toggleKamarJadwal(k)}
                      style={{ width:36, height:32, borderRadius:7, border:`2px solid ${newJadwal.kamar.includes(k)?"var(--or)":"var(--s200)"}`, background:newJadwal.kamar.includes(k)?"var(--or)":"var(--white)", color:newJadwal.kamar.includes(k)?"#fff":"var(--s600)", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit", transition:"all .12s" }}>
                      {k}
                    </button>
                  ))}
                </div>
                {newJadwal.kamar.length > 3 && <div style={{ fontSize:11, color:"var(--red)", marginTop:4 }}>⚠️ Maksimal 3 kamar!</div>}
              </div>
            </div>
            <div className="mc-f">
              <button className="btn-ghost" onClick={()=>setShowJadwal(false)}>Batal</button>
              <button className="btn-primary" disabled={!newJadwal.tanggal||newJadwal.kamar.length===0||newJadwal.kamar.length>3}
                style={{ opacity:(!newJadwal.tanggal||newJadwal.kamar.length===0)?0.5:1 }} onClick={addJadwal}>
                ✓ Simpan Jadwal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// MAIN EXPORT
// ============================================================
export default function Jobdesk({ userRole = "admin" }) {
  const [activeTab,  setActiveTab]  = useState("harian");
  const [checklist,  setChecklist]  = useState(CHECKLIST_INIT);
  const [toast,      setToast]      = useState(null);

  // Stats hari ini
  const totalPagi = checklist.pagi.length;
  const totalSM   = checklist.sm.length;

  const TABS = [
    { id:"harian",  icon:"✅", label:"Jobdesk Harian" },
    { id:"weekly",  icon:"🧹", label:"Weekly Service" },
  ];

  return (
    <div className="fade-up">
      <StyleInjector />

      {/* TOPBAR */}
      <div className="topbar">
        <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
          <div style={{ fontSize:13, fontWeight:800, color:"var(--s800)" }}>📋 Modul Jobdesk</div>
          <div style={{ fontSize:11, color:"var(--s400)" }}>Jobdesk harian + Weekly Service — completion otomatis masuk KPI</div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button className="btn-ghost" onClick={()=>setToast("📤 Laporan jobdesk diekspor")}>↓ Export</button>
          <button className="btn-primary" onClick={()=>setToast("🖨️ Print laporan jobdesk")}>🖨️ Print</button>
        </div>
      </div>

      {/* STAT ROW */}
      <div className="stat-row">
        {[
          { label:"Checklist Pagi",    val:totalPagi,  color:"var(--or)",   bc:"var(--or)",   sub:"item jobdesk" },
          { label:"Checklist S/M",     val:totalSM,    color:"var(--teal)", bc:"var(--teal)", sub:"item jobdesk" },
          { label:"Weekly Bulan Ini",  val:Object.keys(WEEKLY_JADWAL_INIT).length, color:"var(--blue)", bc:"var(--blue)", sub:"jadwal tersimpan" },
          { label:"Max Kamar / Hari",  val:3, color:"var(--s600)", bc:"var(--s400)", sub:"batas weekly service" },
        ].map(s => (
          <div key={s.label} className="sc" style={{ borderTopColor:s.bc }}>
            <div className="sc-label">{s.label}</div>
            <div className="sc-val" style={{ color:s.color }}>{s.val}</div>
            <div className="sc-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* TAB NAV */}
      <div className="tab-nav">
        {TABS.map(t => (
          <button key={t.id} className={`tab-btn${activeTab===t.id?" active":""}`} onClick={()=>setActiveTab(t.id)}>
            <span>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {activeTab==="harian" && <TabJobdeskHarian userRole={userRole} checklist={checklist} setChecklist={setChecklist} onToast={setToast} />}
      {activeTab==="weekly" && <TabWeeklyService userRole={userRole} onToast={setToast} />}

      {toast && <Toast msg={toast} onDone={()=>setToast(null)} />}
    </div>
  );
}
