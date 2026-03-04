import { useState, useEffect, lazy, Suspense } from "react";

// ============================================================
// USER CONFIG — ganti setelah connect Supabase
// ============================================================
const USERS = [
  { id: 1, username: "admin", password: "admin123", role: "superadmin", name: "Yusuf Vindra Asmara", jabatan: "Owner", avatar: "YV" },
];

// ============================================================
// LAZY MODULES
// ============================================================
const ModulDashboard   = lazy(() => import("./Modul02_Dashboard"));
const ModulMonitor     = lazy(() => import("./Modul03_Monitor"));
const ModulAbsensi     = lazy(() => import("./Modul04_Absensi"));
const ModulKeluhan     = lazy(() => import("./Modul05_Keluhan"));
const ModulWeekly      = lazy(() => import("./Modul06_Weekly"));
const ModulKalender    = lazy(() => import("./Modul07_Kalender"));
const ModulPenyewa     = lazy(() => import("./Modul08_Penyewa"));
const ModulCheckin     = lazy(() => import("./Modul09_Checkin"));
const ModulRiwayat     = lazy(() => import("./Modul10_Riwayat"));
const ModulTagihan     = lazy(() => import("./Modul11_Tagihan"));
const ModulKas         = lazy(() => import("./Modul12_Kas"));
const ModulLaporan     = lazy(() => import("./Modul13_Laporan"));
const ModulKaryawan    = lazy(() => import("./Modul14_Karyawan"));
const ModulPenggajian  = lazy(() => import("./Modul15_Penggajian"));
const ModulLapAbsensi  = lazy(() => import("./Modul16_LaporanAbsensi"));
const ModulProfil      = lazy(() => import("./Modul17_Profil"));
const ModulUsers       = lazy(() => import("./Modul18_Users"));

// ============================================================
// MENU CONFIG
// ============================================================
const MENU_ADMIN = [
  {
    section: "OPERASIONAL",
    items: [
      { id: "dashboard", label: "Dashboard",           icon: "▣" },
      { id: "monitor",   label: "Monitor Kamar",       icon: "⊞" },
      { id: "absensi",   label: "Absensi & Jadwal",    icon: "◷" },
      { id: "keluhan",   label: "Keluhan & Tiket",     icon: "⚐" },
      { id: "weekly",    label: "Weekly Service",      icon: "◈" },
      { id: "kalender",  label: "Kalender Operasional",icon: "▦" },
    ],
  },
  {
    section: "TENANT",
    items: [
      { id: "penyewa",  label: "Data Penyewa",         icon: "◎" },
      { id: "checkin",  label: "Check-in / Check-out", icon: "⇄" },
      { id: "riwayat",  label: "Riwayat Penyewa",      icon: "◱" },
    ],
  },
  {
    section: "KEUANGAN",
    items: [
      { id: "tagihan",  label: "Tagihan & Penagihan",  icon: "◉" },
      { id: "kas",      label: "Kas & Jurnal",         icon: "⊟" },
      { id: "laporan",  label: "Laporan Keuangan",     icon: "▤" },
    ],
  },
  {
    section: "HR",
    items: [
      { id: "karyawan",      label: "Data Karyawan",   icon: "⊛" },
      { id: "penggajian",    label: "Penggajian",      icon: "⊕" },
      { id: "laporanabsensi",label: "Laporan Absensi", icon: "▥" },
    ],
  },
  {
    section: "PENGATURAN",
    items: [
      { id: "profil", label: "Profil Kost",      icon: "⊙" },
      { id: "users",  label: "Manajemen User",   icon: "⊗" },
    ],
  },
];

const MENU_STAFF = [
  {
    section: "OPERASIONAL",
    items: [
      { id: "dashboard", label: "Dashboard",           icon: "▣" },
      { id: "monitor",   label: "Monitor Kamar",       icon: "⊞" },
      { id: "absensi",   label: "Absensi & Jadwal",    icon: "◷" },
      { id: "keluhan",   label: "Keluhan & Tiket",     icon: "⚐" },
      { id: "weekly",    label: "Weekly Service",      icon: "◈" },
      { id: "kalender",  label: "Kalender Operasional",icon: "▦" },
    ],
  },
  {
    section: "TENANT",
    items: [
      { id: "penyewa",  label: "Data Penyewa",         icon: "◎" },
      { id: "checkin",  label: "Check-in / Check-out", icon: "⇄" },
    ],
  },
];

const MENU_TITLES = {
  dashboard:      "Dashboard",
  monitor:        "Monitor Kamar",
  absensi:        "Absensi & Jadwal Staff",
  keluhan:        "Keluhan & Tiket",
  weekly:         "Weekly Service",
  kalender:       "Kalender Operasional",
  penyewa:        "Data Penyewa",
  checkin:        "Check-in / Check-out",
  riwayat:        "Riwayat Penyewa",
  tagihan:        "Tagihan & Penagihan",
  kas:            "Kas & Jurnal",
  laporan:        "Laporan Keuangan",
  karyawan:       "Data Karyawan",
  penggajian:     "Penggajian",
  laporanabsensi: "Laporan Absensi",
  profil:         "Profil Kost",
  users:          "Manajemen User",
};

// ============================================================
// GLOBAL CSS
// ============================================================
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --orange:      #f97316;
    --orange-dark: #ea580c;
    --orange-pale: #fff7ed;
    --orange-light:#ffedd5;
    --orange-mid:  #fed7aa;

    --gray-950: #0a0a0a;
    --gray-900: #111827;
    --gray-800: #1f2937;
    --gray-700: #374151;
    --gray-600: #4b5563;
    --gray-500: #6b7280;
    --gray-400: #9ca3af;
    --gray-300: #d1d5db;
    --gray-200: #e5e7eb;
    --gray-100: #f3f4f6;
    --gray-50:  #f9fafb;
    --white:    #ffffff;

    --sidebar-w: 220px;
    --header-h:  52px;

    --shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
    --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
    --shadow-lg: 0 10px 30px rgba(0,0,0,0.1);
  }

  html, body, #root { height: 100%; }
  body {
    font-family: 'Inter', -apple-system, sans-serif;
    font-size: 13px;
    color: var(--gray-800);
    background: var(--gray-50);
    -webkit-font-smoothing: antialiased;
  }

  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--gray-200); border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--gray-300); }

  /* ─── APP SHELL ──────────────────────────── */
  .s-app   { display: flex; height: 100vh; overflow: hidden; background: var(--gray-50); }
  .s-main  { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }
  .s-content { flex: 1; overflow-y: auto; padding: 20px 24px; }

  /* ─── SIDEBAR ────────────────────────────── */
  .s-sidebar {
    width: var(--sidebar-w);
    background: var(--white);
    border-right: 1px solid var(--gray-200);
    display: flex; flex-direction: column;
    flex-shrink: 0; overflow: hidden;
  }

  .s-logo {
    padding: 16px 16px 14px;
    display: flex; align-items: center; gap: 10px;
    border-bottom: 1px solid var(--gray-100);
    flex-shrink: 0;
  }
  .s-logo-mark {
    width: 32px; height: 32px; border-radius: 8px; flex-shrink: 0;
    background: linear-gradient(135deg, var(--orange), var(--orange-dark));
    display: flex; align-items: center; justify-content: center;
    font-size: 15px; font-weight: 700; color: #fff;
    box-shadow: 0 2px 8px rgba(249,115,22,0.35);
  }
  .s-logo-text {}
  .s-logo-name { font-size: 12px; font-weight: 600; color: var(--gray-900); letter-spacing: 0.2px; }
  .s-logo-sub  { font-size: 9px; font-weight: 500; color: var(--orange); letter-spacing: 1px; text-transform: uppercase; margin-top: 1px; }

  .s-nav { flex: 1; overflow-y: auto; padding: 8px 0 4px; }

  .s-nav-section { margin-bottom: 2px; }
  .s-nav-label {
    padding: 8px 16px 3px;
    font-size: 9px; font-weight: 600; letter-spacing: 1.2px;
    color: var(--gray-400); text-transform: uppercase;
  }

  .s-nav-item {
    display: flex; align-items: center; gap: 8px;
    padding: 7px 10px; margin: 1px 8px; border-radius: 7px;
    cursor: pointer; font-size: 12.5px; font-weight: 400;
    color: var(--gray-600); transition: all 0.12s;
    user-select: none;
  }
  .s-nav-item:hover { background: var(--gray-100); color: var(--gray-900); }
  .s-nav-item.active {
    background: var(--gray-900); color: var(--white);
    font-weight: 500;
  }
  .s-nav-icon {
    width: 18px; height: 18px; display: flex; align-items: center; justify-content: center;
    font-size: 13px; flex-shrink: 0; opacity: 0.7;
  }
  .s-nav-item.active .s-nav-icon { opacity: 1; }
  .s-nav-item:hover .s-nav-icon { opacity: 1; }

  .s-user {
    padding: 10px 14px; border-top: 1px solid var(--gray-100);
    display: flex; align-items: center; gap: 9px; flex-shrink: 0;
  }
  .s-avatar {
    width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, var(--orange), var(--orange-dark));
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; font-weight: 700; color: #fff; letter-spacing: 0.5px;
  }
  .s-user-name { font-size: 12px; font-weight: 500; color: var(--gray-900); }
  .s-user-role { font-size: 10px; color: var(--gray-400); margin-top: 1px; }
  .s-logout {
    margin-left: auto; background: none; border: none; cursor: pointer;
    color: var(--gray-400); font-size: 14px; padding: 4px; border-radius: 5px;
    transition: all 0.12s; display: flex; align-items: center; justify-content: center;
  }
  .s-logout:hover { color: #ef4444; background: #fee2e2; }

  /* ─── HEADER ─────────────────────────────── */
  .s-header {
    height: var(--header-h); flex-shrink: 0;
    background: var(--white); border-bottom: 1px solid var(--gray-200);
    padding: 0 24px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .s-header-left {}
  .s-header-context { font-size: 10px; color: var(--gray-400); font-weight: 400; margin-bottom: 1px; }
  .s-header-title { font-size: 14px; font-weight: 600; color: var(--gray-900); }
  .s-header-right { display: flex; align-items: center; gap: 8px; }
  .s-header-btn {
    width: 32px; height: 32px; border-radius: 7px;
    background: var(--gray-100); border: 1px solid var(--gray-200);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 14px; transition: all 0.12s; color: var(--gray-600);
  }
  .s-header-btn:hover { background: var(--gray-200); }
  .s-date {
    font-size: 11px; color: var(--gray-500);
    font-family: 'JetBrains Mono', monospace;
    font-weight: 400;
  }

  /* ─── LOADING ────────────────────────────── */
  .s-loading {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    height: 300px; color: var(--gray-400); gap: 12px;
  }
  .s-spinner {
    width: 24px; height: 24px; border-radius: 50%;
    border: 2px solid var(--gray-200);
    border-top-color: var(--orange);
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ─── COMING SOON ────────────────────────── */
  .s-soon {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    height: 400px; text-align: center;
  }
  .s-soon-icon { font-size: 40px; margin-bottom: 14px; opacity: 0.4; }
  .s-soon-title { font-size: 15px; font-weight: 600; color: var(--gray-700); margin-bottom: 4px; }
  .s-soon-sub { font-size: 12px; color: var(--gray-400); }

  /* ─── LOGIN ──────────────────────────────── */
  .s-login-wrap {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: var(--gray-50);
  }
  .s-login-card {
    background: var(--white); border-radius: 16px; padding: 36px 32px;
    width: 360px; box-shadow: var(--shadow-lg); border: 1px solid var(--gray-200);
  }
  .s-login-logo {
    display: flex; flex-direction: column; align-items: center; margin-bottom: 28px;
  }
  .s-login-mark {
    width: 52px; height: 52px; border-radius: 13px;
    background: linear-gradient(135deg, var(--orange), var(--orange-dark));
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; font-weight: 700; color: #fff; margin-bottom: 10px;
    box-shadow: 0 6px 20px rgba(249,115,22,0.3);
  }
  .s-login-brand { font-size: 17px; font-weight: 700; color: var(--gray-900); }
  .s-login-brand-sub { font-size: 10px; color: var(--orange); font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase; margin-top: 2px; }

  .s-field { margin-bottom: 14px; }
  .s-label { font-size: 11px; font-weight: 500; color: var(--gray-600); display: block; margin-bottom: 5px; letter-spacing: 0.3px; }
  .s-input {
    width: 100%; padding: 9px 12px; border-radius: 8px;
    border: 1px solid var(--gray-200); font-size: 13px; color: var(--gray-800);
    outline: none; transition: border-color 0.15s; font-family: inherit;
    background: var(--white);
  }
  .s-input:focus { border-color: var(--orange); box-shadow: 0 0 0 3px rgba(249,115,22,0.1); }
  .s-input::placeholder { color: var(--gray-400); }

  .s-login-error {
    background: #fee2e2; color: #dc2626; border-radius: 7px;
    padding: 8px 12px; font-size: 12px; margin-bottom: 14px;
  }

  .s-btn-primary {
    width: 100%; padding: 10px; border-radius: 8px; border: none; cursor: pointer;
    background: linear-gradient(135deg, var(--orange), var(--orange-dark));
    color: #fff; font-size: 13px; font-weight: 600; font-family: inherit;
    transition: all 0.15s; box-shadow: 0 3px 10px rgba(249,115,22,0.3);
  }
  .s-btn-primary:hover { filter: brightness(1.05); }
  .s-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

  .s-login-hint {
    margin-top: 16px; padding: 10px 12px; background: var(--gray-50);
    border-radius: 7px; border: 1px solid var(--gray-100);
    font-size: 11px; color: var(--gray-500); line-height: 1.6;
  }
  .s-login-hint b { color: var(--gray-700); }

  /* ─── FADE IN ────────────────────────────── */
  @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  .fade-in { animation: fadeIn 0.2s ease forwards; }
`;

function StyleInjector() {
  useEffect(() => {
    const id = "senyuminn-shell-css";
    if (document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id;
    el.textContent = CSS;
    document.head.appendChild(el);
    return () => { const e = document.getElementById(id); if (e) e.remove(); };
  }, []);
  return null;
}

// ============================================================
// HELPERS
// ============================================================
const formatDate = () => {
  const d = new Date();
  const days = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
  const months = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

// ============================================================
// LOGIN PAGE
// ============================================================
function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleLogin = () => {
    if (!username || !password) { setError("Username dan password wajib diisi"); return; }
    setLoading(true);
    setTimeout(() => {
      const user = USERS.find(u => u.username === username && u.password === password);
      if (user) { onLogin(user); }
      else { setError("Username atau password salah"); setLoading(false); }
    }, 500);
  };

  return (
    <div className="s-login-wrap">
      <div className="s-login-card fade-in">
        <div className="s-login-logo">
          <div className="s-login-mark">S</div>
          <div className="s-login-brand">SENYUM INN</div>
          <div className="s-login-brand-sub">Exclusive Kost</div>
        </div>

        <div className="s-field">
          <label className="s-label">USERNAME</label>
          <input
            className="s-input"
            placeholder="Masukkan username"
            value={username}
            onChange={e => { setUsername(e.target.value); setError(""); }}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            autoFocus
          />
        </div>

        <div className="s-field">
          <label className="s-label">PASSWORD</label>
          <input
            className="s-input"
            type="password"
            placeholder="Masukkan password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(""); }}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
          />
        </div>

        {error && <div className="s-login-error">{error}</div>}

        <button className="s-btn-primary" onClick={handleLogin} disabled={loading}>
          {loading ? "Memproses..." : "Masuk"}
        </button>


      </div>
    </div>
  );
}

// ============================================================
// SIDEBAR
// ============================================================
function Sidebar({ user, active, onSelect, onLogout }) {
  const menus = user.role === "staff" ? MENU_STAFF : MENU_ADMIN;

  return (
    <aside className="s-sidebar">
      {/* Logo */}
      <div className="s-logo">
        <div className="s-logo-mark">S</div>
        <div className="s-logo-text">
          <div className="s-logo-name">Senyum Inn</div>
          <div className="s-logo-sub">Exclusive Kost</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="s-nav">
        {menus.map(section => (
          <div key={section.section} className="s-nav-section">
            <div className="s-nav-label">{section.section}</div>
            {section.items.map(item => (
              <div
                key={item.id}
                className={`s-nav-item ${active === item.id ? "active" : ""}`}
                onClick={() => onSelect(item.id)}
              >
                <span className="s-nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="s-user">
        <div className="s-avatar">{user.avatar}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="s-user-name" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {user.name}
          </div>
          <div className="s-user-role">{user.jabatan}</div>
        </div>
        <button className="s-logout" onClick={onLogout} title="Keluar">
          ⏻
        </button>
      </div>
    </aside>
  );
}

// ============================================================
// HEADER
// ============================================================
function Header({ activeMenu }) {
  const title   = MENU_TITLES[activeMenu] || activeMenu;
  const section = Object.values(
    Object.fromEntries(
      [...MENU_ADMIN, ...MENU_STAFF].flatMap(s => s.items.map(i => [i.id, s.section]))
    )
  )[0];

  // Cari section dari active menu
  let sectionName = "";
  for (const s of MENU_ADMIN) {
    if (s.items.find(i => i.id === activeMenu)) { sectionName = s.section; break; }
  }

  return (
    <header className="s-header">
      <div className="s-header-left">
        <div className="s-header-context">Senyum Inn · {sectionName}</div>
        <div className="s-header-title">{title}</div>
      </div>
      <div className="s-header-right">
        <div className="s-date">{formatDate()}</div>
        <div className="s-header-btn" title="Notifikasi">🔔</div>
        <div className="s-header-btn" title="Cari">🔍</div>
      </div>
    </header>
  );
}

// ============================================================
// LOADING FALLBACK
// ============================================================
function LoadingFallback() {
  return (
    <div className="s-loading">
      <div className="s-spinner" />
      <span style={{ fontSize: 12 }}>Memuat modul...</span>
    </div>
  );
}

// ============================================================
// COMING SOON
// ============================================================
function ComingSoon({ menuId }) {
  const title = MENU_TITLES[menuId] || menuId;
  return (
    <div className="s-soon fade-in">
      <div className="s-soon-icon">🚧</div>
      <div className="s-soon-title">{title}</div>
      <div className="s-soon-sub">Modul sedang dalam pengembangan</div>
    </div>
  );
}

// ============================================================
// RENDER MODULE
// ============================================================
function RenderModule({ menuId, user }) {
  const props = { user };

  const moduleMap = {
    dashboard:      <ModulDashboard   {...props} />,
    monitor:        <ModulMonitor     {...props} />,
    absensi:        <ModulAbsensi     {...props} />,
    keluhan:        <ModulKeluhan     {...props} />,
    weekly:         <ModulWeekly      {...props} />,
    kalender:       <ModulKalender    {...props} />,
    penyewa:        <ModulPenyewa     {...props} />,
    checkin:        <ModulCheckin     {...props} />,
    riwayat:        <ModulRiwayat     {...props} />,
    tagihan:        <ModulTagihan     {...props} />,
    kas:            <ModulKas         {...props} />,
    laporan:        <ModulLaporan     {...props} />,
    karyawan:       <ModulKaryawan    {...props} />,
    penggajian:     <ModulPenggajian  {...props} />,
    laporanabsensi: <ModulLapAbsensi  {...props} />,
    profil:         <ModulProfil      {...props} />,
    users:          <ModulUsers       {...props} />,
  };

  const el = moduleMap[menuId];
  if (!el) return <ComingSoon menuId={menuId} />;

  return (
    <Suspense fallback={<LoadingFallback />}>
      <div className="fade-in">{el}</div>
    </Suspense>
  );
}

// ============================================================
// APP ROOT
// ============================================================
export default function App() {
  const [user,       setUser]       = useState(null);
  const [activeMenu, setActiveMenu] = useState("dashboard");

  if (!user) return (
    <>
      <StyleInjector />
      <LoginPage onLogin={setUser} />
    </>
  );

  return (
    <div className="s-app">
      <StyleInjector />
      <Sidebar
        user={user}
        active={activeMenu}
        onSelect={setActiveMenu}
        onLogout={() => { setUser(null); setActiveMenu("dashboard"); }}
      />
      <div className="s-main">
        <Header activeMenu={activeMenu} />
        <div className="s-content">
          <RenderModule menuId={activeMenu} user={user} />
        </div>
      </div>
    </div>
  );
}
