import { useState } from "react";
import Modul02_Dashboard from "./Modul02_Dashboard";
import Modul03_Monitor from "./Modul03_Monitor";
import Modul04_Absensi from "./Modul04_Absensi";
import Modul05_Keluhan from "./Modul05_Keluhan";
import Modul06_Weekly from "./Modul06_Weekly";
import Modul07_Kalender from "./Modul07_Kalender";
import Modul08_Penyewa from "./Modul08_Penyewa";
import Modul09_Checkout from "./Modul09_Checkout";
import Modul10_Riwayat from "./Modul10_Riwayat";
import Modul11_Tagihan from "./Modul11_Tagihan";
import Modul12_Kas from "./Modul12_Kas";
import Modul13_Laporan from "./Modul13_Laporan";
import Modul14_Karyawan from "./Modul14_Karyawan";
import Modul15_Penggajian from "./Modul15_Penggajian";
import Modul16_LaporanAbsensi from "./Modul16_LaporanAbsensi";
import Modul17_Profil from "./Modul17_Profil";
import Modul18_Users from "./Modul18_Users";
import Modul19_SOP from "./Modul19_SOP";

const USERS = [
  { id:1, username:"owner",  password:"owner123",  role:"admin", name:"Yusuf Vindra Asmara", jabatan:"Owner" },
  { id:2, username:"admin",  password:"admin123",  role:"admin", name:"Rina Manajemen",      jabatan:"Super Admin" },
  { id:3, username:"staff1", password:"staff123",  role:"staff", name:"Muh. Krisna Mukti",   jabatan:"Clean & Service" },
  { id:4, username:"staff2", password:"staff123",  role:"staff", name:"Gurit Yudho Anggoro", jabatan:"Staf Penjaga Malam" },
];

const MENU_ADMIN = [
  { section:"OPERASIONAL", items:[
    { id:"dashboard", label:"Dashboard",            icon:"⊞" },
    { id:"monitor",   label:"Monitor Kamar",        icon:"🏠" },
    { id:"absensi",   label:"Absensi & Jadwal",     icon:"👤" },
    { id:"keluhan",   label:"Keluhan & Tiket",      icon:"🔧" },
    { id:"weekly",    label:"Weekly Service",        icon:"🧹" },
    { id:"kalender",  label:"Kalender Operasional", icon:"📅" },
  ]},
  { section:"TENANT", items:[
    { id:"penyewa",  label:"Data Penyewa",        icon:"👥" },
    { id:"checkin",  label:"Check-in / Check-out", icon:"🔑" },
    { id:"riwayat",  label:"Riwayat Penyewa",     icon:"📋" },
  ]},
  { section:"KEUANGAN", items:[
    { id:"tagihan", label:"Tagihan & Penagihan", icon:"💳" },
    { id:"kas",     label:"Kas & Jurnal",        icon:"📒" },
    { id:"laporan", label:"Laporan Keuangan",    icon:"📊" },
  ]},
  { section:"HR", items:[
    { id:"karyawan",       label:"Data Karyawan",    icon:"🪪" },
    { id:"penggajian",     label:"Penggajian",        icon:"💰" },
    { id:"laporanabsensi", label:"Laporan Absensi",  icon:"📈" },
  ]},
  { section:"PENGATURAN", items:[
    { id:"profil", label:"Profil Kost",    icon:"⚙️" },
    { id:"users",  label:"Manajemen User", icon:"👤" },
    { id:"sop",    label:"SOP & Standar",  icon:"📜" },
  ]},
];

const MENU_STAFF = [
  { section:"OPERASIONAL", items:[
    { id:"dashboard", label:"Dashboard",       icon:"⊞" },
    { id:"monitor",   label:"Monitor Kamar",   icon:"🏠" },
    { id:"absensi",   label:"Absensi & Jadwal",icon:"👤" },
    { id:"keluhan",   label:"Keluhan & Tiket", icon:"🔧" },
    { id:"weekly",    label:"Weekly Service",   icon:"🧹" },
  ]},
  { section:"TENANT", items:[
    { id:"penyewa", label:"Data Penyewa",        icon:"👥" },
    { id:"checkin", label:"Check-in / Check-out",icon:"🔑" },
  ]},
];

const TITLES = {
  dashboard:"Dashboard Operasional", monitor:"Monitor Kamar", absensi:"Absensi & Jadwal Staff",
  keluhan:"Keluhan & Tiket Perbaikan", weekly:"Weekly Service", kalender:"Kalender Operasional",
  penyewa:"Data Penyewa", checkin:"Check-in / Check-out", riwayat:"Riwayat Penyewa",
  tagihan:"Tagihan & Penagihan", kas:"Kas & Jurnal", laporan:"Laporan Keuangan",
  karyawan:"Data Karyawan", penggajian:"Penggajian", laporanabsensi:"Laporan Absensi",
  profil:"Profil Kost", users:"Manajemen User", sop:"SOP & Standar",
};

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      const user = USERS.find(u => u.username === username && u.password === password);
      if (user) { onLogin(user); }
      else { setError("Username atau password salah"); setLoading(false); }
    }, 600);
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg,#fff7ed 0%,#fff 50%,#fff7ed 100%)" }}>
      <div style={{ background:"#fff", borderRadius:20, padding:"40px 36px", width:380, boxShadow:"0 20px 60px rgba(249,115,22,0.12)", border:"1px solid #fed7aa" }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ width:64, height:64, background:"linear-gradient(135deg,#f97316,#ea580c)", borderRadius:16, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px", fontSize:28, color:"#fff", fontWeight:800, boxShadow:"0 8px 24px rgba(249,115,22,0.3)" }}>S</div>
          <div style={{ fontSize:20, fontWeight:800, color:"#1e293b" }}>SENYUM INN</div>
          <div style={{ fontSize:12, color:"#f97316", fontWeight:600, letterSpacing:2, textTransform:"uppercase" }}>Exclusive Kost</div>
        </div>
        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:12, fontWeight:600, color:"#475569", display:"block", marginBottom:6 }}>USERNAME</label>
          <input
            style={{ width:"100%", padding:"10px 14px", borderRadius:8, border:"1px solid #e2e8f0", fontSize:14, color:"#1e293b", outline:"none", boxSizing:"border-box", fontFamily:"inherit" }}
            placeholder="Masukkan username" value={username}
            onChange={e => { setUsername(e.target.value); setError(""); }}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
          />
        </div>
        <div style={{ marginBottom:20 }}>
          <label style={{ fontSize:12, fontWeight:600, color:"#475569", display:"block", marginBottom:6 }}>PASSWORD</label>
          <input
            type="password"
            style={{ width:"100%", padding:"10px 14px", borderRadius:8, border:"1px solid #e2e8f0", fontSize:14, color:"#1e293b", outline:"none", boxSizing:"border-box", fontFamily:"inherit" }}
            placeholder="Masukkan password" value={password}
            onChange={e => { setPassword(e.target.value); setError(""); }}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
          />
        </div>
        {error && <div style={{ background:"#fee2e2", color:"#dc2626", padding:"8px 12px", borderRadius:8, fontSize:13, marginBottom:16 }}>{error}</div>}
        <button
          style={{ width:"100%", padding:12, borderRadius:8, fontSize:14, fontWeight:600, cursor:"pointer", border:"none", background:"linear-gradient(135deg,#f97316,#ea580c)", color:"#fff", opacity:loading ? 0.7 : 1 }}
          onClick={handleLogin} disabled={loading}
        >
          {loading ? "Memproses..." : "Masuk"}
        </button>
        <div style={{ marginTop:20, padding:12, background:"#f8fafc", borderRadius:8, fontSize:11, color:"#94a3b8" }}>
          <div style={{ fontWeight:600, marginBottom:4 }}>Demo Login:</div>
          <div>Admin: <b>owner</b> / <b>owner123</b></div>
          <div>Staff: <b>staff1</b> / <b>staff123</b></div>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ user, active, onChange, onLogout }) {
  const menus = user.role === "admin" ? MENU_ADMIN : MENU_STAFF;
  return (
    <aside style={{ width:220, background:"#fff", borderRight:"1px solid #e2e8f0", display:"flex", flexDirection:"column", flexShrink:0, overflowY:"auto" }}>
      <div style={{ padding:"20px 16px 16px", borderBottom:"1px solid #f1f5f9" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:40, height:40, background:"linear-gradient(135deg,#f97316,#ea580c)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:18, fontWeight:700, flexShrink:0 }}>S</div>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:"#1e293b", letterSpacing:.3 }}>SENYUM INN</div>
            <div style={{ fontSize:10, color:"#f97316", fontWeight:600, textTransform:"uppercase", letterSpacing:1 }}>Exclusive Kost</div>
          </div>
        </div>
      </div>
      <div style={{ flex:1, overflowY:"auto" }}>
        {menus.map(section => (
          <div key={section.section} style={{ padding:"8px 0" }}>
            <div style={{ padding:"8px 16px 4px", fontSize:10, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:1 }}>{section.section}</div>
            {section.items.map(item => (
              <div
                key={item.id}
                onClick={() => onChange(item.id)}
                style={{
                  display:"flex", alignItems:"center", gap:10, padding:"8px 16px",
                  cursor:"pointer", fontSize:13, fontWeight: active===item.id ? 600 : 400,
                  color: active===item.id ? "#fff" : "#475569",
                  background: active===item.id ? "linear-gradient(135deg,#f97316,#ea580c)" : "transparent",
                }}
              >
                <span style={{ fontSize:14 }}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ padding:"12px 16px", borderTop:"1px solid #f1f5f9", display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ width:32, height:32, borderRadius:"50%", background:"linear-gradient(135deg,#f97316,#ea580c)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:13, fontWeight:700, flexShrink:0 }}>
          {user.name[0]}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:12, fontWeight:600, color:"#1e293b", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user.name}</div>
          <div style={{ fontSize:11, color:"#94a3b8" }}>{user.jabatan}</div>
        </div>
        <button onClick={onLogout} style={{ background:"none", border:"none", cursor:"pointer", color:"#94a3b8", fontSize:16 }} title="Logout">⏻</button>
      </div>
    </aside>
  );
}

function Header({ title }) {
  return (
    <div style={{ background:"#fff", borderBottom:"1px solid #e2e8f0", padding:"0 24px", height:56, display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
      <div style={{ fontSize:16, fontWeight:700, color:"#1e293b", textTransform:"uppercase", letterSpacing:1 }}>{title}</div>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:8, padding:"6px 12px", fontSize:13, color:"#94a3b8" }}>
          <span>🔍</span><span>Cari data...</span>
        </div>
        <button style={{ background:"none", border:"none", cursor:"pointer", fontSize:20, color:"#64748b" }}>🔔</button>
      </div>
    </div>
  );
}

function ComingSoon({ title }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:400, color:"#94a3b8" }}>
      <div style={{ fontSize:48, marginBottom:16 }}>🚧</div>
      <div style={{ fontSize:18, fontWeight:700, color:"#1e293b", marginBottom:8 }}>{title}</div>
      <div style={{ fontSize:14 }}>Modul ini sedang dalam pengembangan</div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [activeMenu, setActiveMenu] = useState("dashboard");

  if (!user) return <LoginPage onLogin={setUser} />;

  const renderContent = () => {
    switch (activeMenu) {
      case "dashboard":      return <Modul02_Dashboard user={user} />;
      case "monitor":        return <Modul03_Monitor user={user} />;
      case "absensi":        return <Modul04_Absensi user={user} />;
      case "keluhan":        return <Modul05_Keluhan user={user} />;
      case "weekly":         return <Modul06_Weekly user={user} />;
      case "kalender":       return <Modul07_Kalender user={user} />;
      case "penyewa":        return <Modul08_Penyewa user={user} />;
      case "checkin":        return <Modul09_Checkout user={user} />;
      case "riwayat":        return <Modul10_Riwayat user={user} />;
      case "tagihan":        return <Modul11_Tagihan user={user} />;
      case "kas":            return <Modul12_Kas user={user} />;
      case "laporan":        return <Modul13_Laporan user={user} />;
      case "karyawan":       return <Modul14_Karyawan user={user} />;
      case "penggajian":     return <Modul15_Penggajian user={user} />;
      case "laporanabsensi": return <Modul16_LaporanAbsensi user={user} />;
      case "profil":         return <Modul17_Profil user={user} />;
      case "users":          return <Modul18_Users user={user} />;
      case "sop":            return <Modul19_SOP user={user} />;
      default:               return <ComingSoon title={TITLES[activeMenu] || activeMenu} />;
    }
  };

  return (
    <div style={{ display:"flex", height:"100vh", fontFamily:"'Segoe UI',system-ui,sans-serif", background:"#f8fafc", overflow:"hidden" }}>
      <Sidebar user={user} active={activeMenu} onChange={setActiveMenu} onLogout={() => setUser(null)} />
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <Header title={TITLES[activeMenu] || ""} />
        <div style={{ flex:1, overflowY:"auto", padding:24 }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}