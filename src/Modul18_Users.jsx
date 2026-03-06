import { useState, useEffect } from "react";

const CSS = `
  .us-wrap { display:flex; flex-direction:column; gap:16px; }
  .us-cards { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
  .us-card  { background:#fff; border-radius:12px; border:1px solid #e5e7eb; padding:14px 16px; position:relative; overflow:hidden; }
  .us-card-bar { position:absolute; top:0; left:0; right:0; height:3px; }
  .us-card-label { font-size:10px; font-weight:500; color:#9ca3af; text-transform:uppercase; letter-spacing:.8px; margin-bottom:4px; margin-top:8px; }
  .us-card-val { font-size:22px; font-weight:700; color:#111827; }

  .us-layout { display:grid; grid-template-columns:280px 1fr; gap:14px; align-items:start; }
  .us-widget { background:#fff; border-radius:12px; border:1px solid #e5e7eb; overflow:hidden; }
  .us-widget-head { padding:13px 16px 10px; border-bottom:1px solid #f3f4f6; display:flex; align-items:center; justify-content:space-between; }
  .us-widget-title { font-size:13px; font-weight:700; color:#111827; }

  .us-user-item { display:flex; align-items:center; gap:10px; padding:10px 14px; border-bottom:1px solid #f3f4f6; cursor:pointer; transition:background .1s; }
  .us-user-item:last-child { border-bottom:none; }
  .us-user-item:hover { background:#fafafa; }
  .us-user-item.active { background:#fff7ed; border-left:3px solid #f97316; }
  .us-avatar { width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justifyContent:center; font-size:14px; font-weight:700; color:#fff; flex-shrink:0; }
  .us-user-name { font-size:13px; font-weight:600; color:#1f2937; }
  .us-user-role { font-size:11px; color:#9ca3af; margin-top:1px; }

  .us-detail { padding:18px; }
  .us-detail-avatar { width:52px; height:52px; border-radius:14px; display:flex; align-items:center; justifyContent:center; font-size:20px; font-weight:700; color:#fff; }
  .us-detail-name { font-size:16px; font-weight:700; color:#111827; }
  .us-detail-role { font-size:12px; color:#9ca3af; margin-top:2px; }

  .us-perm-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
  .us-perm-row { display:flex; align-items:center; justify-content:space-between; padding:8px 11px; background:#f9fafb; border:1px solid #e5e7eb; border-radius:8px; }
  .us-perm-label { font-size:12px; font-weight:500; color:#374151; }
  .us-perm-select { padding:3px 8px; border-radius:6px; border:1px solid #e5e7eb; font-size:11px; font-family:inherit; outline:none; background:#fff; cursor:pointer; }
  .us-perm-select:focus { border-color:#f97316; }
  .us-perm-select.write { color:#16a34a; background:#f0fdf4; border-color:#86efac; }
  .us-perm-select.read  { color:#3b82f6; background:#eff6ff; border-color:#93c5fd; }
  .us-perm-select.none  { color:#9ca3af; background:#f9fafb; }

  .us-badge { display:inline-flex; align-items:center; gap:3px; padding:2px 8px; border-radius:20px; font-size:10px; font-weight:600; }
  .us-section-title { font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:1.2px; color:#9ca3af; margin-bottom:8px; display:flex; align-items:center; gap:6px; }
  .us-section-title::after { content:''; flex:1; height:1px; background:#f3f4f6; }

  .us-btn { display:inline-flex; align-items:center; gap:5px; padding:7px 14px; border-radius:8px; font-size:12px; font-weight:600; border:none; cursor:pointer; font-family:inherit; transition:all .15s; }
  .us-btn.primary { background:linear-gradient(135deg,#f97316,#ea580c); color:#fff; }
  .us-btn.ghost   { background:#f3f4f6; color:#4b5563; }
  .us-btn.danger  { background:#fee2e2; color:#dc2626; }
  .us-btn.warning { background:#fef3c7; color:#d97706; }
  .us-btn:disabled { opacity:.4; cursor:not-allowed; }

  .us-field { margin-bottom:11px; }
  .us-label { font-size:11px; font-weight:600; color:#374151; display:block; margin-bottom:5px; }
  .us-input { width:100%; padding:8px 11px; border-radius:8px; border:1.5px solid #e5e7eb; font-size:12px; font-family:inherit; color:#1f2937; outline:none; background:#fff; transition:border-color .12s; box-sizing:border-box; }
  .us-input:focus { border-color:#f97316; }

  .us-overlay { position:fixed !important; inset:0 !important; background:rgba(17,24,39,.65) !important; backdrop-filter:blur(4px) !important; z-index:9999 !important; display:flex !important; align-items:center !important; justify-content:center !important; padding:16px !important; box-sizing:border-box !important; }
  .us-modal { background:#fff; border-radius:16px; width:100%; max-width:480px; max-height:90vh; overflow-y:auto; box-shadow:0 24px 64px rgba(0,0,0,.18); animation:usSlide .2s cubic-bezier(.4,0,.2,1); }
  @keyframes usSlide { from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1} }
  .us-modal-head { padding:15px 20px 12px; border-bottom:1px solid #f3f4f6; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; background:#fff; z-index:1; }
  .us-modal-title { font-size:14px; font-weight:700; color:#111827; }
  .us-modal-close { width:28px; height:28px; border-radius:7px; background:#f3f4f6; border:none; cursor:pointer; font-size:14px; color:#6b7280; }
  .us-modal-body { padding:16px 20px; }
  .us-modal-foot { padding:12px 20px; border-top:1px solid #f3f4f6; display:flex; gap:8px; }

  .us-log-item { padding:8px 14px; border-bottom:1px solid #f9fafb; font-size:11px; }
  .us-log-item:last-child { border-bottom:none; }
  .us-log-time { color:#9ca3af; }
  .us-log-action { color:#374151; margin-top:1px; }

  .us-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:48px 16px; color:#9ca3af; gap:8px; }

  @media(max-width:1024px){ .us-layout{grid-template-columns:1fr} }
  @media(max-width:768px){ .us-cards{grid-template-columns:repeat(2,1fr)} }
`;

function StyleInjector() {
  useEffect(()=>{
    const id="senyuminn-users-css";
    if(document.getElementById(id)) return;
    const el=document.createElement("style");
    el.id=id; el.textContent=CSS;
    document.head.appendChild(el);
    return ()=>{ const e=document.getElementById(id); if(e) e.remove(); };
  },[]);
  return null;
}

// ─── helpers ───
const getInisial = (nama="") => {
  const p = nama.trim().split(" ");
  return (p.length>=2 ? p[0][0]+p[1][0] : nama.slice(0,2)).toUpperCase();
};
const ROLE_COLORS = {
  owner:     { bg:"#fef3c7", color:"#d97706", label:"Owner"     },
  direktur:  { bg:"#ede9fe", color:"#7c3aed", label:"Direktur"  },
  manajemen: { bg:"#dbeafe", color:"#2563eb", label:"Manajemen" },
  staff:     { bg:"#dcfce7", color:"#15803d", label:"Staff"     },
};
const AVATAR_COLORS = ["#f97316","#3b82f6","#8b5cf6","#16a34a","#ec4899","#06b6d4","#f59e0b"];
const getAvatarColor = (id) => AVATAR_COLORS[(id||0)%AVATAR_COLORS.length];

const DEFAULT_PERMISSIONS = {
  owner:     { dashboard:"read", monitor:"read", absensi:"read", keluhan:"read", weekly:"read", kalender:"read", penyewa:"read", checkin:"read", riwayat:"read", tagihan:"read", kas:"read", laporan:"read", karyawan:"read", penggajian:"read", laporanabsensi:"read", profil:"read", users:"read", sop:"read" },
  direktur:  { dashboard:"read", monitor:"read", absensi:"read", keluhan:"read", weekly:"read", kalender:"read", penyewa:"read", checkin:"read", riwayat:"read", tagihan:"read", kas:"read", laporan:"read", karyawan:"read", penggajian:"read", laporanabsensi:"read", profil:"read", users:"read", sop:"read" },
  manajemen: { dashboard:"write", monitor:"write", absensi:"write", keluhan:"write", weekly:"write", kalender:"write", penyewa:"write", checkin:"write", riwayat:"write", tagihan:"write", kas:"write", laporan:"write", karyawan:"write", penggajian:"write", laporanabsensi:"write", profil:"write", users:"write", sop:"write" },
  staff:     { dashboard:"read", monitor:"read", absensi:"write", keluhan:"write", weekly:"write", kalender:"read", penyewa:"read", checkin:"write", riwayat:"none", tagihan:"none", kas:"none", laporan:"none", karyawan:"none", penggajian:"none", laporanabsensi:"none", profil:"none", users:"none", sop:"read" },
};

const MENU_LABELS = {
  dashboard:"Dashboard", monitor:"Monitor Kamar", absensi:"Absensi", keluhan:"Keluhan & Tiket",
  weekly:"Weekly Service", kalender:"Kalender", penyewa:"Data Penyewa", checkin:"Check-in/out",
  riwayat:"Riwayat Penyewa", tagihan:"Tagihan", kas:"Kas & Jurnal", laporan:"Laporan Keuangan",
  karyawan:"Data Karyawan", penggajian:"Penggajian", laporanabsensi:"Laporan Absensi",
  profil:"Profil Kost", users:"Manajemen User", sop:"SOP & Standar",
};

const MENU_SECTIONS = [
  { label:"Operasional", keys:["dashboard","monitor","absensi","keluhan","weekly","kalender"] },
  { label:"Tenant",      keys:["penyewa","checkin","riwayat"] },
  { label:"Keuangan",    keys:["tagihan","kas","laporan"] },
  { label:"HR",          keys:["karyawan","penggajian","laporanabsensi"] },
  { label:"Pengaturan",  keys:["profil","users","sop"] },
];

// ─── Modal Form User ───
function ModalUser({ userObj, currentUser, onClose, onSave }) {
  const isEdit = !!userObj?.id;
  const [form, setForm] = useState(userObj ? {...userObj} : {
    nama:"", jabatan:"", username:"", password:"", role:"staff", aktif:true,
    permissions: { ...DEFAULT_PERMISSIONS["staff"] }
  });
  const set = (k,v) => setForm(p=>({...p,[k]:v}));

  const handleRoleChange = (role) => {
    set("role", role);
    setForm(p=>({...p, role, permissions:{ ...DEFAULT_PERMISSIONS[role] }}));
  };

  const setPerm = (menu, val) => {
    // owner & direktur: tidak bisa diubah ke write
    if ((form.role==="owner"||form.role==="direktur") && val==="write") return;
    setForm(p=>({...p, permissions:{...p.permissions,[menu]:val}}));
  };

  const valid = form.nama && form.username && (isEdit || form.password);
  const isOwnerEdit = userObj?.role === "owner";
  const canEditThisUser = currentUser?.role === "manajemen" || currentUser?.role === "owner";

  return(
    <div className="us-overlay" onClick={onClose}>
      <div className="us-modal" onClick={e=>e.stopPropagation()}>
        <div className="us-modal-head">
          <div className="us-modal-title">{isEdit?"✏️ Edit User":"➕ Tambah User"}</div>
          <button className="us-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="us-modal-body">

          {/* Data dasar */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div className="us-field">
              <label className="us-label">Nama Lengkap *</label>
              <input className="us-input" value={form.nama} onChange={e=>set("nama",e.target.value)} placeholder="Nama lengkap..." />
            </div>
            <div className="us-field">
              <label className="us-label">Jabatan</label>
              <input className="us-input" value={form.jabatan||""} onChange={e=>set("jabatan",e.target.value)} placeholder="Owner, Admin, Staff..." />
            </div>
            <div className="us-field">
              <label className="us-label">Username *</label>
              <input className="us-input" value={form.username} onChange={e=>set("username",e.target.value)} placeholder="username..." style={{fontFamily:"JetBrains Mono,monospace"}} />
            </div>
            <div className="us-field">
              <label className="us-label">{isEdit?"Password Baru (kosongkan jika tidak diubah)":"Password *"}</label>
              <input className="us-input" type="password" value={form.password||""} onChange={e=>set("password",e.target.value)} placeholder="Password..." />
            </div>
          </div>

          {/* Role */}
          <div className="us-field">
            <label className="us-label">Role</label>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
              {Object.entries(ROLE_COLORS).map(([role,cfg])=>(
                <div
                  key={role}
                  onClick={()=>{ if(!isOwnerEdit) handleRoleChange(role); }}
                  style={{
                    padding:"8px 6px", borderRadius:9, textAlign:"center", cursor:isOwnerEdit?"not-allowed":"pointer",
                    border:`1.5px solid ${form.role===role?cfg.color:"#e5e7eb"}`,
                    background:form.role===role?cfg.bg:"#fff",
                    transition:"all .12s", opacity:isOwnerEdit&&role!=="owner" ? 0.5:1
                  }}
                >
                  <div style={{fontSize:12,fontWeight:700,color:form.role===role?cfg.color:"#6b7280"}}>{cfg.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Permission matrix */}
          <div style={{marginTop:4}}>
            <div style={{fontSize:11,fontWeight:700,color:"#374151",marginBottom:8,display:"flex",alignItems:"center",gap:6}}>
              🔐 Hak Akses per Menu
              {(form.role==="owner"||form.role==="direktur") && (
                <span style={{fontSize:10,color:"#9ca3af",fontWeight:400}}>(Role ini selalu read-only)</span>
              )}
            </div>
            {MENU_SECTIONS.map(sec=>(
              <div key={sec.label} style={{marginBottom:10}}>
                <div className="us-section-title">{sec.label}</div>
                <div className="us-perm-grid">
                  {sec.keys.map(menu=>{
                    const val = form.permissions?.[menu]||"none";
                    const isLocked = form.role==="owner"||form.role==="direktur";
                    return (
                      <div key={menu} className="us-perm-row">
                        <span className="us-perm-label">{MENU_LABELS[menu]}</span>
                        <select
                          className={`us-perm-select ${val}`}
                          value={val}
                          disabled={isLocked}
                          onChange={e=>setPerm(menu,e.target.value)}
                        >
                          <option value="write">✏️ Write</option>
                          <option value="read">👁️ Read</option>
                          <option value="none">🚫 None</option>
                        </select>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Status aktif */}
          <div style={{display:"flex",alignItems:"center",gap:8,padding:"9px 11px",background:"#f9fafb",borderRadius:8,border:"1px solid #e5e7eb"}}>
            <input type="checkbox" id="aktif-toggle" checked={form.aktif!==false} onChange={e=>set("aktif",e.target.checked)} />
            <label htmlFor="aktif-toggle" style={{fontSize:12,fontWeight:600,color:"#374151",cursor:"pointer"}}>User Aktif</label>
            <span style={{fontSize:11,color:"#9ca3af"}}>(Non-aktif tidak bisa login, data tetap tersimpan)</span>
          </div>
        </div>
        <div className="us-modal-foot">
          <button className="us-btn primary" disabled={!valid} onClick={()=>{ onSave({...form, id:userObj?.id||Date.now()}); onClose(); }}>
            ✅ {isEdit?"Simpan Perubahan":"Tambah User"}
          </button>
          <button className="us-btn ghost" onClick={onClose}>Batal</button>
        </div>
      </div>
  </div>
  );
}

// ─── Modal Reset Password ───
function ModalResetPW({ userObj, onClose, onSave }) {
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const match = pw && pw===confirm;
  return(
    <div className="us-overlay" onClick={onClose}>
      <div className="us-modal" onClick={e=>e.stopPropagation()} style={{maxWidth:380}}>
        <div className="us-modal-head">
          <div className="us-modal-title">🔑 Reset Password — {userObj?.nama}</div>
          <button className="us-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="us-modal-body">
          <div className="us-field">
            <label className="us-label">Password Baru</label>
            <input className="us-input" type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="Min 6 karakter..." />
          </div>
          <div className="us-field">
            <label className="us-label">Konfirmasi Password</label>
            <input className="us-input" type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Ulangi password..." style={{borderColor:confirm&&!match?"#ef4444":confirm&&match?"#16a34a":""}} />
          </div>
          {confirm && !match && <div style={{fontSize:11,color:"#ef4444"}}>Password tidak sama</div>}
          {match && <div style={{fontSize:11,color:"#16a34a"}}>✓ Password cocok</div>}
        </div>
        <div className="us-modal-foot">
          <button className="us-btn primary" disabled={!match||pw.length<6} onClick={()=>{ onSave(pw); onClose(); }}>🔑 Reset Password</button>
          <button className="us-btn ghost" onClick={onClose}>Batal</button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN ───
export default function Modul18_Users({ user, globalData={} }) {
  const { isReadOnly=false } = globalData;

  const [users, setUsers] = useState([
    { id:1, nama:"Yusuf Vindra Asmara", jabatan:"Owner",       username:"owner",    password:"owner123",  role:"owner",     aktif:true, permissions:{...DEFAULT_PERMISSIONS["owner"]}     },
    { id:2, nama:"Budi Santosa",        jabatan:"Direktur",    username:"direktur", password:"dir123",    role:"direktur",  aktif:true, permissions:{...DEFAULT_PERMISSIONS["direktur"]}  },
    { id:3, nama:"Admin",       jabatan:"Super Admin",        username:"admin",  password:"admin123",  role:"manajemen", aktif:true, permissions:{...DEFAULT_PERMISSIONS["manajemen"]} },
    { id:4, nama:"Staff Pagi",  jabatan:"Clean & Service",    username:"staff1", password:"staff123",  role:"staff",   aktif:true, permissions:{...DEFAULT_PERMISSIONS["staff"]}     },
    { id:5, nama:"Staff Malam", jabatan:"Staf Penjaga Malam", username:"staff2", password:"staff123",  role:"staff",   aktif:true, permissions:{...DEFAULT_PERMISSIONS["staff"]}     },
  ]);
  const [selected,    setSelected]    = useState(null);
  const [showModal,   setShowModal]   = useState(false);
  const [showReset,   setShowReset]   = useState(false);
  const [editData,    setEditData]    = useState(null);
  const [activeTab,   setActiveTab]   = useState("users");
  const [activityLog, setActivityLog] = useState([
    { id:1, waktu:"2026-03-04 09:12", user:"admin",    aksi:"Login berhasil" },
    { id:2, waktu:"2026-03-04 08:45", user:"staff1",   aksi:"Update status tiket T-003" },
    { id:3, waktu:"2026-03-03 16:30", user:"admin",    aksi:"Konfirmasi pembayaran Kamar 7" },
    { id:4, waktu:"2026-03-03 14:10", user:"staff2",   aksi:"Input absensi — Shift Malam" },
    { id:5, waktu:"2026-03-02 10:05", user:"admin",    aksi:"Tambah karyawan baru" },
  ]);

  const canManage = user?.role === "manajemen";
  const isOwner   = user?.role === "owner";

  const handleSave = (data) => {
    if (users.find(u=>u.id===data.id)) {
      setUsers(prev=>prev.map(u=>u.id===data.id?data:u));
      if (selected?.id===data.id) setSelected(data);
    } else {
      setUsers(prev=>[...prev,data]);
    }
    setActivityLog(prev=>[{id:Date.now(),waktu:new Date().toLocaleString("id-ID"),user:user?.username,aksi:`${data.id&&users.find(u=>u.id===data.id)?"Edit":"Tambah"} user: ${data.nama}`},...prev]);
  };

  const handleResetPW = (newPw) => {
    setUsers(prev=>prev.map(u=>u.id===selected?.id?{...u,password:newPw}:u));
    setActivityLog(prev=>[{id:Date.now(),waktu:new Date().toLocaleString("id-ID"),user:user?.username,aksi:`Reset password: ${selected?.nama}`},...prev]);
  };

  const handleToggleAktif = (userId) => {
    setUsers(prev=>prev.map(u=>u.id===userId?{...u,aktif:!u.aktif}:u));
  };

  const stats = {
    total:     users.length,
    aktif:     users.filter(u=>u.aktif).length,
    manajemen: users.filter(u=>u.role==="manajemen").length,
    staff:     users.filter(u=>u.role==="staff").length,
  };

  return (
    <div className="us-wrap">
      <StyleInjector />

      {/* Cards */}
      <div className="us-cards">
        {[
          {label:"Total User",  val:stats.total,     color:"#f97316"},
          {label:"Aktif",       val:stats.aktif,     color:"#16a34a"},
          {label:"Manajemen",   val:stats.manajemen, color:"#3b82f6"},
          {label:"Staff",       val:stats.staff,     color:"#8b5cf6"},
        ].map((c,i)=>(
          <div key={i} className="us-card">
            <div className="us-card-bar" style={{background:c.color}} />
            <div className="us-card-label">{c.label}</div>
            <div className="us-card-val" style={{color:c.color}}>{c.val}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{display:"flex",gap:4,background:"#fff",borderRadius:12,border:"1px solid #e5e7eb",padding:5}}>
        {[
          {id:"users", label:"👤 Daftar User"},
          {id:"log",   label:"📋 Log Aktivitas"},
        ].map(t=>(
          <div key={t.id} onClick={()=>setActiveTab(t.id)} style={{flex:1,padding:"8px 12px",borderRadius:8,textAlign:"center",fontSize:12,fontWeight:600,cursor:"pointer",color:activeTab===t.id?"#fff":"#9ca3af",background:activeTab===t.id?"linear-gradient(135deg,#f97316,#ea580c)":"transparent",transition:"all .15s"}}>
            {t.label}
          </div>
        ))}
      </div>

      {/* Tab: Users */}
      {activeTab==="users" && (
        <div className="us-layout">
          {/* List */}
          <div className="us-widget">
            <div className="us-widget-head">
              <div className="us-widget-title">👤 User ({users.length})</div>
              {canManage && (
                <button className="us-btn primary" style={{padding:"5px 11px",fontSize:11}} onClick={()=>{ setEditData(null); setShowModal(true); }}>
                  ➕ Tambah
                </button>
              )}
            </div>
            {users.map(u=>{
              const rc = ROLE_COLORS[u.role]||{};
              return (
                <div key={u.id} className={`us-user-item ${selected?.id===u.id?"active":""}`} onClick={()=>setSelected(u)}>
                  <div className="us-avatar" style={{background:getAvatarColor(u.id),display:"flex",alignItems:"center",justifyContent:"center"}}>{getInisial(u.nama)}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div className="us-user-name">{u.nama}</div>
                    <div className="us-user-role">{u.jabatan}</div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:3}}>
                    <span className="us-badge" style={{color:rc.color,background:rc.bg}}>{rc.label}</span>
                    {!u.aktif && <span className="us-badge" style={{color:"#9ca3af",background:"#f3f4f6"}}>Nonaktif</span>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detail */}
          {selected ? (
            <div className="us-widget">
              <div className="us-widget-head">
                <div className="us-widget-title">🔐 Detail & Hak Akses</div>
                <div style={{display:"flex",gap:6}}>
                  {/* Reset password: manajemen bisa semua, owner hanya diri sendiri */}
                  {(canManage || (isOwner && selected.id===user?.id)) && (
                    <button className="us-btn warning" style={{padding:"5px 10px",fontSize:11}} onClick={()=>setShowReset(true)}>
                      🔑 Reset PW
                    </button>
                  )}
                  {canManage && selected.role!=="owner" && (
                    <button className="us-btn ghost" style={{padding:"5px 10px",fontSize:11}} onClick={()=>handleToggleAktif(selected.id)}>
                      {selected.aktif?"⏸ Nonaktifkan":"▶ Aktifkan"}
                    </button>
                  )}
                  {canManage && (
                    <button className="us-btn primary" style={{padding:"5px 10px",fontSize:11}} onClick={()=>{ setEditData(selected); setShowModal(true); }}>
                      ✏️ Edit
                    </button>
                  )}
                </div>
              </div>
              <div className="us-detail">
                {/* Header */}
                <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:18,paddingBottom:14,borderBottom:"1px solid #f3f4f6"}}>
                  <div className="us-detail-avatar" style={{background:getAvatarColor(selected.id),display:"flex",alignItems:"center",justifyContent:"center"}}>{getInisial(selected.nama)}</div>
                  <div>
                    <div className="us-detail-name">{selected.nama}</div>
                    <div className="us-detail-role">{selected.jabatan}</div>
                    <div style={{marginTop:5,display:"flex",gap:6}}>
                      <span className="us-badge" style={{color:ROLE_COLORS[selected.role]?.color,background:ROLE_COLORS[selected.role]?.bg}}>
                        {ROLE_COLORS[selected.role]?.label}
                      </span>
                      <span className="us-badge" style={{color:selected.aktif?"#15803d":"#9ca3af",background:selected.aktif?"#dcfce7":"#f3f4f6"}}>
                        {selected.aktif?"● Aktif":"● Nonaktif"}
                      </span>
                      <span className="us-badge" style={{color:"#6b7280",background:"#f3f4f6",fontFamily:"JetBrains Mono,monospace"}}>
                        @{selected.username}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Permission view */}
                {MENU_SECTIONS.map(sec=>(
                  <div key={sec.label} style={{marginBottom:12}}>
                    <div className="us-section-title">{sec.label}</div>
                    <div className="us-perm-grid">
                      {sec.keys.map(menu=>{
                        const val = selected.permissions?.[menu]||"none";
                        return (
                          <div key={menu} className="us-perm-row">
                            <span className="us-perm-label">{MENU_LABELS[menu]}</span>
                            <span className={`us-perm-select ${val}`} style={{padding:"3px 8px",borderRadius:6,fontSize:11,fontWeight:600}}>
                              {val==="write"?"✏️ Write":val==="read"?"👁️ Read":"🚫 None"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="us-widget">
              <div className="us-empty"><div style={{fontSize:36,opacity:.4}}>👤</div><div style={{fontSize:13,fontWeight:600,color:"#374151"}}>Pilih user untuk lihat detail</div></div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Log */}
      {activeTab==="log" && (
        <div className="us-widget">
          <div className="us-widget-head">
            <div className="us-widget-title">📋 Log Aktivitas</div>
            <span style={{fontSize:11,color:"#9ca3af"}}>{activityLog.length} entri</span>
          </div>
          {activityLog.map(log=>(
            <div key={log.id} className="us-log-item">
              <div className="us-log-time">🕐 {log.waktu} - <b>@{log.user}</b></div>
              <div className="us-log-action">{log.aksi}</div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <ModalUser
          userObj={editData}
          currentUser={user}
          onClose={()=>{ setShowModal(false); setEditData(null); }}
          onSave={handleSave}
        />
      )}
      {showReset && selected && (
        <ModalResetPW
          userObj={selected}
          onClose={()=>setShowReset(false)}
          onSave={handleResetPW}
        />
      )}
    </div>
  );
}