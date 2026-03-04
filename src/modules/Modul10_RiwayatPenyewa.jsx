import { useState, useEffect } from "react";

// ============================================================
// HELPERS
// ============================================================
const BLN = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Ags","Sep","Okt","Nov","Des"];
const fmtTgl = (s) => { if (!s) return "—"; const d = new Date(s); return `${d.getDate()} ${BLN[d.getMonth()]} ${d.getFullYear()}`; };
const fmtRp  = (n) => n != null ? "Rp " + Number(n).toLocaleString("id-ID") : "—";
const getInitials = (n) => n ? n.split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase() : "?";
const getDurasi = (masuk, keluar) => {
  const end   = keluar ? new Date(keluar) : new Date();
  const start = new Date(masuk);
  const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  return months;
};

const STATUS_CFG = {
  aktif:    { label: "Aktif",        color: "#16a34a", bg: "#dcfce7" },
  checkout: { label: "Sudah Keluar", color: "#64748b", bg: "#f1f5f9" },
};

const KAMAR_STATUS_CFG = {
  aktif:   { label: "Aktif",   color: "#16a34a", bg: "#dcfce7" },
  selesai: { label: "Selesai", color: "#64748b", bg: "#f1f5f9" },
};

const AVATAR_COLORS = [
  "linear-gradient(135deg,#f97316,#ea580c)",
  "linear-gradient(135deg,#1d4ed8,#1e40af)",
  "linear-gradient(135deg,#0d9488,#0f766e)",
  "linear-gradient(135deg,#7c3aed,#6d28d9)",
  "linear-gradient(135deg,#be185d,#9d174d)",
  "linear-gradient(135deg,#d97706,#b45309)",
];

// ============================================================
// CSS — design system Modul08/09
// ============================================================
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  :root{
    --or:#f97316;--or-d:#ea580c;--or-dd:#c2410c;
    --or-pale:#fff7ed;--or-light:#ffedd5;--or-mid:#fed7aa;
    --s900:#0f172a;--s800:#1e293b;--s700:#334155;--s600:#475569;
    --s400:#94a3b8;--s200:#e2e8f0;--s100:#f1f5f9;--s50:#f8fafc;
    --white:#fff;--red:#dc2626;--green:#16a34a;--blue:#1d4ed8;--amber:#d97706;
  }
  body{font-family:'Plus Jakarta Sans',sans-serif;background:var(--s50)}
  ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:var(--s200);border-radius:4px}

  /* STAT CARDS */
  .stat-row{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px}
  .sc{background:var(--white);border:1px solid var(--s200);border-radius:12px;padding:14px 16px;border-top:3px solid transparent}
  .sc-label{font-size:10px;font-weight:700;color:var(--s400);text-transform:uppercase;letter-spacing:.7px;margin-bottom:4px}
  .sc-val{font-size:22px;font-weight:800;color:var(--s800);font-family:'JetBrains Mono',monospace}
  .sc-sub{font-size:11px;color:var(--s400);margin-top:3px;font-weight:500}

  /* FILTER BAR */
  .filter-bar{display:flex;gap:10px;margin-bottom:16px;align-items:center;flex-wrap:wrap}
  .search-box{display:flex;align-items:center;gap:8px;background:var(--white);border:1.5px solid var(--s200);border-radius:10px;padding:8px 14px;flex:1;min-width:200px;transition:all 0.15s}
  .search-box:focus-within{border-color:var(--or);box-shadow:0 0 0 3px rgba(249,115,22,0.08)}
  .search-box input{border:none;outline:none;font-size:13px;color:var(--s800);background:transparent;font-family:'Plus Jakarta Sans',sans-serif;width:100%}
  .search-box input::placeholder{color:var(--s400)}
  .filter-pill{padding:6px 14px;border-radius:20px;border:1.5px solid var(--s200);background:var(--white);font-size:12px;font-weight:600;color:var(--s600);cursor:pointer;transition:all 0.12s;font-family:'Plus Jakarta Sans',sans-serif}
  .filter-pill:hover{border-color:var(--or-mid);color:var(--or-d)}
  .filter-pill.active{background:var(--s900);border-color:var(--s900);color:#fff}

  /* LAYOUT */
  .rw-layout{display:grid;grid-template-columns:320px 1fr;gap:16px;align-items:start}

  /* LIST PANEL */
  .list-panel{background:var(--white);border:1px solid var(--s200);border-radius:12px;overflow:hidden;max-height:calc(100vh-280px);display:flex;flex-direction:column}
  .lp-head{padding:10px 14px;border-bottom:1px solid var(--s100);background:var(--s50);font-size:11px;font-weight:800;color:var(--s400);text-transform:uppercase;letter-spacing:.8px;flex-shrink:0}
  .lp-body{overflow-y:auto;flex:1}

  /* PENYEWA ITEM */
  .penyewa-item{padding:11px 14px;border-bottom:1px solid var(--s100);cursor:pointer;transition:all 0.12s;display:flex;align-items:flex-start;gap:10px}
  .penyewa-item:last-child{border-bottom:none}
  .penyewa-item:hover{background:var(--s50)}
  .penyewa-item.active{background:var(--or-pale);border-left:3px solid var(--or)}
  .pi-avatar{width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:#fff;flex-shrink:0;margin-top:2px}
  .pi-name{font-size:13px;font-weight:700;color:var(--s800)}
  .pi-sub{font-size:11px;color:var(--s400);margin-top:2px;font-weight:500}
  .pi-tags{display:flex;gap:4px;margin-top:5px;flex-wrap:wrap}

  /* DETAIL PANEL */
  .detail-panel{background:var(--white);border:1px solid var(--s200);border-radius:12px;overflow:hidden}

  /* HERO */
  .hero{background:linear-gradient(135deg,var(--s900) 0%,#1a0a00 100%);padding:22px;position:relative;overflow:hidden}
  .hero::before{content:'';position:absolute;top:-50px;right:-50px;width:180px;height:180px;border-radius:50%;background:radial-gradient(circle,rgba(249,115,22,0.15),transparent)}
  .hero::after{content:'SENYUM INN · RIWAYAT';position:absolute;bottom:10px;right:14px;font-size:9px;font-weight:900;letter-spacing:3px;color:rgba(255,255,255,0.05)}
  .h-top{display:flex;align-items:flex-start;gap:14px;margin-bottom:16px}
  .h-avatar{width:52px;height:52px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;color:#fff;border:2px solid rgba(249,115,22,0.35);flex-shrink:0}
  .h-name{font-size:19px;font-weight:800;color:#fff;margin-bottom:3px}
  .h-id{font-size:11px;font-family:'JetBrains Mono',monospace;color:rgba(255,255,255,0.3)}
  .h-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;padding-top:14px;border-top:1px solid rgba(255,255,255,0.07)}
  .hg-label{font-size:9px;font-weight:700;color:rgba(255,255,255,0.28);text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px}
  .hg-val{font-size:12px;font-weight:700;color:#fff}

  /* DETAIL TABS */
  .dtabs{display:flex;background:var(--s50);border-bottom:1px solid var(--s200);padding:5px 8px;gap:4px}
  .dtab{padding:6px 14px;border-radius:7px;border:none;font-family:'Plus Jakarta Sans',sans-serif;font-size:11px;font-weight:600;cursor:pointer;transition:all 0.12s;color:var(--s400);background:transparent}
  .dtab:hover{color:var(--s700)}
  .dtab.active{background:linear-gradient(135deg,var(--or),var(--or-d));color:#fff}

  /* INFO GRID */
  .info-sec{padding:14px 16px}
  .info-title{font-size:10px;font-weight:800;color:var(--s400);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid var(--s100)}
  .info-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px}
  .info-item{background:var(--s50);border-radius:8px;padding:9px 11px}
  .ii-label{font-size:9px;font-weight:700;color:var(--s400);text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px}
  .ii-val{font-size:12px;font-weight:600;color:var(--s800)}

  /* TIMELINE */
  .timeline{padding:14px 16px}
  .tl-item{display:flex;gap:14px;margin-bottom:16px}
  .tl-item:last-child{margin-bottom:0}
  .tl-dot-col{display:flex;flex-direction:column;align-items:center}
  .tl-dot{width:14px;height:14px;border-radius:50%;flex-shrink:0;margin-top:3px}
  .tl-line{width:2px;flex:1;background:var(--s200);margin-top:4px}
  .tl-card{flex:1;background:var(--s50);border:1px solid var(--s200);border-radius:10px;padding:12px 14px}
  .tl-card.aktif{background:var(--or-pale);border-color:var(--or-mid)}
  .tl-kamar{font-size:15px;font-weight:800;color:var(--s800);margin-bottom:3px}
  .tl-period{font-size:11px;color:var(--s400);margin-bottom:8px;display:flex;align-items:center;gap:6px;font-weight:500}
  .tl-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:8px}
  .tl-stat{background:var(--white);border-radius:7px;padding:7px 9px;text-align:center}
  .tl-stat-label{font-size:9px;font-weight:700;color:var(--s400);text-transform:uppercase;margin-bottom:2px}
  .tl-stat-val{font-size:13px;font-weight:800;color:var(--s800)}

  /* TAGIHAN MINI */
  .tagihan-row{display:flex;align-items:center;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--s100);font-size:12px}
  .tagihan-row:last-child{border-bottom:none}

  /* BADGE */
  .badge{display:inline-flex;align-items:center;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700;white-space:nowrap}

  /* BUTTONS */
  .btn-primary{background:linear-gradient(135deg,var(--or),var(--or-d));color:#fff;border:none;border-radius:8px;padding:9px 18px;font-size:13px;font-weight:700;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all 0.15s;box-shadow:0 2px 8px rgba(249,115,22,0.25);display:inline-flex;align-items:center;gap:6px}
  .btn-primary:hover{filter:brightness(1.05)}
  .btn-ghost{background:var(--s100);color:var(--s700);border:1px solid var(--s200);border-radius:8px;padding:9px 14px;font-size:12px;font-weight:600;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all 0.15s;display:inline-flex;align-items:center;gap:6px}
  .btn-ghost:hover{background:var(--s200)}
  .btn-sm{padding:5px 11px !important;font-size:11px !important;border-radius:7px !important}

  /* TOAST */
  .toaster{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--s900);color:#fff;padding:10px 22px;border-radius:30px;font-size:13px;font-weight:600;z-index:9999;box-shadow:0 8px 24px rgba(0,0,0,0.3);animation:toastIn .25s ease;white-space:nowrap}
  @keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}

  /* EMPTY */
  .empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px 24px;color:var(--s400);text-align:center}
  .empty-icon{font-size:44px;margin-bottom:12px;opacity:0.4}
  .empty-title{font-size:15px;font-weight:700;color:var(--s700);margin-bottom:6px}
  .empty-sub{font-size:13px;font-weight:500}

  @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  .fade-up{animation:fadeUp .25s ease forwards}

  @media(max-width:1024px){.rw-layout{grid-template-columns:1fr}}
  @media(max-width:768px){.stat-row{grid-template-columns:repeat(2,1fr)}}
  @media(max-width:480px){.stat-row{grid-template-columns:repeat(2,1fr);gap:8px}.h-grid{grid-template-columns:repeat(2,1fr)}}
`;

function StyleInjector() {
  useEffect(() => {
    const id = "senyuminn-riwayat-css";
    if (document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id; el.textContent = CSS;
    document.head.appendChild(el);
    return () => { const e = document.getElementById(id); if (e) e.remove(); };
  }, []);
  return null;
}

function Toast({ msg, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2400); return () => clearTimeout(t); }, []);
  return <div className="toaster">{msg}</div>;
}

// ============================================================
// DETAIL — PROFIL TAB
// ============================================================
function DetailProfil({ penyewa }) {
  const kamarAktif = penyewa.riwayatKamar?.find(k => k.status === "aktif");
  return (
    <div>
      <div className="info-sec">
        <div className="info-title">Data Pribadi</div>
        <div className="info-grid">
          {[
            { label: "NIK / KTP",      val: penyewa.nik },
            { label: "No HP",          val: penyewa.noHP },
            { label: "Agama",          val: penyewa.agama },
            { label: "Pekerjaan",      val: penyewa.pekerjaan },
            { label: "Alamat Asal",    val: penyewa.alamatAsal },
            { label: "Kontak Darurat", val: penyewa.noDarurat },
          ].map(f => (
            <div key={f.label} className="info-item">
              <div className="ii-label">{f.label}</div>
              <div className="ii-val" style={{
                fontFamily: ["NIK / KTP","No HP","Kontak Darurat"].includes(f.label) ? "'JetBrains Mono',monospace" : undefined,
                fontSize: 11
              }}>
                {f.val || "—"}
              </div>
            </div>
          ))}
        </div>
        {penyewa.namaDarurat && (
          <div className="info-item" style={{ marginBottom: 12 }}>
            <div className="ii-label">Nama Darurat</div>
            <div className="ii-val">{penyewa.namaDarurat}</div>
          </div>
        )}

        {kamarAktif && (
          <>
            <div className="info-title" style={{ marginTop: 4 }}>Kamar Saat Ini</div>
            <div style={{ background:"var(--or-pale)", border:"1px solid var(--or-mid)", borderRadius:10, padding:"12px 14px", display:"flex", alignItems:"center", gap:14 }}>
              <div style={{ width:48, height:48, background:"linear-gradient(135deg,var(--or),var(--or-d))", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:16, fontWeight:800, flexShrink:0 }}>
                {kamarAktif.kamar}
              </div>
              <div>
                <div style={{ fontSize:15, fontWeight:800, color:"var(--s800)" }}>Kamar {kamarAktif.kamar} — {kamarAktif.tipe}</div>
                <div style={{ fontSize:12, color:"var(--s600)", marginTop:2 }}>
                  Mulai: {fmtTgl(kamarAktif.masuk)} · Durasi: {getDurasi(kamarAktif.masuk, kamarAktif.keluar)} bulan
                </div>
                {kamarAktif.partner?.length > 0 && (
                  <div style={{ fontSize:11, color:"var(--s400)", marginTop:2 }}>Partner: {kamarAktif.partner.join(", ")}</div>
                )}
                <div style={{ fontSize:13, fontWeight:700, color:"var(--or-d)", marginTop:4 }}>{fmtRp(kamarAktif.harga)}/bulan</div>
              </div>
            </div>
          </>
        )}

        <div className="info-title" style={{ marginTop: 14 }}>Foto KTP</div>
        <div style={{ background:"var(--s50)", border:"2px dashed var(--s200)", borderRadius:10, padding:20, textAlign:"center" }}>
          <div style={{ fontSize:28, marginBottom:8 }}>🪪</div>
          <div style={{ fontSize:12, color:"var(--s400)" }}>Foto KTP tersimpan di cloud storage</div>
          <button className="btn-ghost btn-sm" style={{ marginTop:8 }} onClick={() => alert("Buka foto KTP dari cloud")}>🔍 Lihat KTP</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// DETAIL — RIWAYAT KAMAR TAB
// ============================================================
function DetailRiwayat({ penyewa }) {
  const sorted = [...(penyewa.riwayatKamar || [])].sort((a, b) => new Date(b.masuk) - new Date(a.masuk));

  if (sorted.length === 0) return (
    <div className="empty"><div className="empty-icon">📭</div><div className="empty-title">Belum ada riwayat kamar</div></div>
  );

  return (
    <div className="timeline">
      {sorted.map((k, i) => {
        const cfg        = KAMAR_STATUS_CFG[k.status] || KAMAR_STATUS_CFG.selesai;
        const lunas      = k.tagihan?.filter(t => t.status === "lunas").length || 0;
        const totalBayar = k.tagihan?.filter(t => t.status === "lunas").reduce((s, t) => s + t.jumlah, 0) || 0;
        return (
          <div key={i} className="tl-item">
            <div className="tl-dot-col">
              <div className="tl-dot" style={{ background: cfg.color }} />
              {i < sorted.length - 1 && <div className="tl-line" />}
            </div>
            <div className={`tl-card ${k.status === "aktif" ? "aktif" : ""}`}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 }}>
                <div className="tl-kamar">Kamar {k.kamar} — {k.tipe}</div>
                <span className="badge" style={{ color:cfg.color, background:cfg.bg }}>{cfg.label}</span>
              </div>
              <div className="tl-period">
                <span>📅 {fmtTgl(k.masuk)}</span>
                <span>→</span>
                <span>{k.keluar ? fmtTgl(k.keluar) : "Sekarang"}</span>
                <span style={{ fontWeight:700 }}>({getDurasi(k.masuk, k.keluar)} bln)</span>
              </div>
              {k.partner?.length > 0 && (
                <div style={{ fontSize:11, color:"var(--s600)", marginBottom:6 }}>👥 Partner: {k.partner.join(", ")}</div>
              )}
              <div className="tl-stats">
                <div className="tl-stat">
                  <div className="tl-stat-label">Harga/bln</div>
                  <div className="tl-stat-val" style={{ fontSize:11, color:"var(--or-d)" }}>{fmtRp(k.harga)}</div>
                </div>
                <div className="tl-stat">
                  <div className="tl-stat-label">Lunas</div>
                  <div className="tl-stat-val" style={{ color:"var(--green)" }}>{lunas}×</div>
                </div>
                <div className="tl-stat">
                  <div className="tl-stat-label">Total Bayar</div>
                  <div className="tl-stat-val" style={{ fontSize:11, color:"var(--blue)" }}>{fmtRp(totalBayar)}</div>
                </div>
              </div>

              {k.tagihan?.length > 0 && (
                <div style={{ marginTop:10, paddingTop:10, borderTop:"1px solid var(--s200)" }}>
                  <div style={{ fontSize:10, fontWeight:700, color:"var(--s400)", textTransform:"uppercase", letterSpacing:0.8, marginBottom:6 }}>Riwayat Tagihan</div>
                  {k.tagihan.map((t, ti) => (
                    <div key={ti} className="tagihan-row">
                      <span style={{ color:"var(--s700)", fontWeight:500 }}>{t.bln}</span>
                      <span style={{ fontFamily:"'JetBrains Mono',monospace", fontWeight:700, color:"var(--s800)", fontSize:11 }}>{fmtRp(t.jumlah)}</span>
                      <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                        <span className="badge" style={{
                          color: t.status === "lunas" ? "var(--green)" : t.status === "belum" ? "var(--red)" : "var(--amber)",
                          background: t.status === "lunas" ? "#dcfce7" : t.status === "belum" ? "#fee2e2" : "#fef3c7",
                        }}>
                          {t.status === "lunas" ? "✓ Lunas" : t.status === "belum" ? "Belum" : "Telat"}
                        </span>
                        {t.tglBayar && <span style={{ fontSize:10, color:"var(--s400)" }}>{fmtTgl(t.tglBayar)}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {k.catatan && (
                <div style={{ marginTop:8, padding:"7px 10px", background:"rgba(0,0,0,0.03)", borderRadius:7, fontSize:11, color:"var(--s600)", fontStyle:"italic" }}>
                  💬 {k.catatan}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// DETAIL PANEL
// ============================================================
function DetailPanel({ penyewa, idx, onToast }) {
  const [activeTab, setActiveTab] = useState("profil");
  const cfg        = STATUS_CFG[penyewa.statusSaatIni] || STATUS_CFG.checkout;
  const totalBayar = penyewa.riwayatKamar?.reduce((s, k) =>
    s + (k.tagihan?.filter(t => t.status === "lunas").reduce((ss, t) => ss + t.jumlah, 0) || 0), 0) || 0;
  const totalBulan = penyewa.riwayatKamar?.reduce((s, k) => s + getDurasi(k.masuk, k.keluar), 0) || 0;
  const isLama     = totalBulan >= 12;

  return (
    <div className="detail-panel">
      {/* Hero */}
      <div className="hero">
        <div className="h-top">
          <div className="h-avatar" style={{ background: AVATAR_COLORS[idx % AVATAR_COLORS.length] }}>
            {getInitials(penyewa.nama)}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
              <div className="h-name">{penyewa.nama}</div>
              {isLama && <span className="badge" style={{ color:"var(--or)", background:"rgba(249,115,22,0.15)" }}>⭐ Penyewa Lama</span>}
            </div>
            <div className="h-id">{penyewa.id} · {penyewa.pekerjaan || "—"}</div>
            <div style={{ marginTop:6, display:"flex", gap:6 }}>
              <span className="badge" style={{ color:cfg.color, background:cfg.color+"20" }}>{cfg.label}</span>
              {penyewa.statusSaatIni === "checkout" && (
                <button className="badge" style={{ color:"var(--or)", background:"rgba(249,115,22,0.15)", cursor:"pointer", border:"none" }}
                  onClick={() => onToast("📋 Form check-in baru dibuka — data lama dimuat")}>
                  ↩ Check-in Kembali
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="h-grid">
          {[
            { label:"Kamar Pernah",  val: (penyewa.riwayatKamar?.length || 0) + " kamar" },
            { label:"Total Tinggal", val: totalBulan + " bln" },
            { label:"Total Bayar",   val: fmtRp(totalBayar).replace("Rp ","") },
            { label:"Agama",         val: penyewa.agama || "—" },
          ].map(f => (
            <div key={f.label}>
              <div className="hg-label">{f.label}</div>
              <div className="hg-val">{f.val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="dtabs">
        {[
          { id:"profil",  label:"👤 Profil & KTP" },
          { id:"riwayat", label:"🏠 Riwayat Kamar" },
        ].map(t => (
          <button key={t.id} className={`dtab ${activeTab === t.id ? "active" : ""}`} onClick={() => setActiveTab(t.id)}>
            {t.label}
          </button>
        ))}
        <div style={{ flex:1 }} />
        <button className="btn-ghost btn-sm" onClick={() => onToast("📄 Data penyewa diekspor ke PDF")}>
          🖨️ Export
        </button>
      </div>

      {activeTab === "profil"  && <DetailProfil  penyewa={penyewa} />}
      {activeTab === "riwayat" && <DetailRiwayat penyewa={penyewa} />}
    </div>
  );
}

// ============================================================
// MAIN MODULE — data dari props
// ============================================================
export default function RiwayatPenyewa({ user, data = [] }) {
  const [selected, setSelected] = useState(null);
  const [search,   setSearch]   = useState("");
  const [filter,   setFilter]   = useState("all");
  const [toast,    setToast]    = useState(null);

  const totalAktif   = data.filter(p => p.statusSaatIni === "aktif").length;
  const totalKeluar  = data.filter(p => p.statusSaatIni === "checkout").length;
  const totalBayaran = data.reduce((s, p) =>
    s + (p.riwayatKamar?.reduce((ss, k) =>
      ss + (k.tagihan?.filter(t => t.status === "lunas").reduce((sss, t) => sss + t.jumlah, 0) || 0), 0) || 0), 0);
  const penyewaLama = data.filter(p =>
    (p.riwayatKamar?.reduce((s, k) => s + getDurasi(k.masuk, k.keluar), 0) || 0) >= 12);

  const filtered = data.filter(p => {
    const matchSearch = p.nama?.toLowerCase().includes(search.toLowerCase()) ||
                        p.riwayatKamar?.some(k => String(k.kamar).includes(search));
    const matchFilter = filter === "all"      ? true
                      : filter === "aktif"    ? p.statusSaatIni === "aktif"
                      : filter === "checkout" ? p.statusSaatIni === "checkout"
                      : filter === "lama"     ? penyewaLama.some(pl => pl.id === p.id)
                      : true;
    return matchSearch && matchFilter;
  });

  return (
    <div className="fade-up">
      <StyleInjector />

      {/* STAT CARDS */}
      <div className="stat-row">
        {[
          { label:"Total Penyewa",     val: data.length || "—",          color:"var(--or)",   border:"var(--or)",   sub:"tercatat di sistem" },
          { label:"Aktif Saat Ini",    val: totalAktif  || (data.length ? "0" : "—"), color:"var(--green)", border:"var(--green)", sub:`${totalKeluar} sudah keluar` },
          { label:"Penyewa ≥12 Bulan", val: penyewaLama.length || (data.length ? "0" : "—"), color:"var(--blue)", border:"var(--blue)", sub:"penyewa loyal ⭐" },
          { label:"Total Pendapatan",  val: data.length ? fmtRp(totalBayaran) : "—", color:"var(--amber)", border:"var(--amber)", sub:"dari semua penyewa", small: true },
        ].map(s => (
          <div key={s.label} className="sc" style={{ borderTopColor: s.border }}>
            <div className="sc-label">{s.label}</div>
            <div className="sc-val" style={{ color:s.color, fontSize: s.small ? 15 : undefined }}>{s.val}</div>
            <div className="sc-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* FILTER BAR */}
      <div className="filter-bar">
        <div className="search-box">
          <span style={{ color:"var(--s400)" }}>🔍</span>
          <input placeholder="Cari nama penyewa atau nomor kamar..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {[
          { id:"all",      label:`Semua (${data.length})` },
          { id:"aktif",    label:`Aktif (${totalAktif})` },
          { id:"checkout", label:`Keluar (${totalKeluar})` },
          { id:"lama",     label:`≥12 Bulan (${penyewaLama.length})` },
        ].map(f => (
          <button key={f.id} className={`filter-pill ${filter === f.id ? "active" : ""}`} onClick={() => setFilter(f.id)}>
            {f.label}
          </button>
        ))}
        <div style={{ fontSize:12, color:"var(--s400)", marginLeft:"auto", whiteSpace:"nowrap" }}>
          {filtered.length} ditampilkan
        </div>
        <button className="btn-ghost" onClick={() => setToast("📤 Data riwayat penyewa diekspor")}>
          ↓ Export
        </button>
      </div>

      {/* LAYOUT */}
      <div className="rw-layout">

        {/* LIST */}
        <div className="list-panel">
          <div className="lp-head">Daftar Penyewa ({filtered.length})</div>
          <div className="lp-body">
            {data.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">👥</div>
                <div className="empty-title">Belum ada data penyewa</div>
                <div className="empty-sub">Data akan muncul setelah ada penyewa terdaftar</div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">🔍</div>
                <div className="empty-title">Tidak ditemukan</div>
                <div className="empty-sub">Coba kata kunci lain</div>
              </div>
            ) : filtered.map((p, i) => {
              const kamarAktif    = p.riwayatKamar?.find(k => k.status === "aktif");
              const kamarTerakhir = [...(p.riwayatKamar || [])].sort((a, b) => new Date(b.masuk) - new Date(a.masuk))[0];
              const cfg           = STATUS_CFG[p.statusSaatIni] || STATUS_CFG.checkout;
              const lama          = penyewaLama.some(pl => pl.id === p.id);
              const realIdx       = data.findIndex(d => d.id === p.id);
              return (
                <div key={p.id} className={`penyewa-item ${selected?.id === p.id ? "active" : ""}`}
                  onClick={() => setSelected(p)}>
                  <div className="pi-avatar" style={{ background: AVATAR_COLORS[realIdx % AVATAR_COLORS.length] }}>
                    {getInitials(p.nama)}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                      <div className="pi-name">{p.nama}</div>
                      {lama && <span style={{ fontSize:14 }}>⭐</span>}
                    </div>
                    <div className="pi-sub">
                      {kamarAktif
                        ? `Kamar ${kamarAktif.kamar} · ${kamarAktif.tipe}`
                        : `Terakhir: Kamar ${kamarTerakhir?.kamar || "—"}`}
                    </div>
                    <div className="pi-tags">
                      <span className="badge" style={{ color:cfg.color, background:cfg.bg }}>{cfg.label}</span>
                      {p.riwayatKamar?.length > 1 && (
                        <span className="badge" style={{ color:"var(--blue)", background:"#dbeafe" }}>{p.riwayatKamar.length} kamar</span>
                      )}
                      {kamarAktif?.partner?.length > 0 && (
                        <span className="badge" style={{ color:"var(--s600)", background:"var(--s100)" }}>+{kamarAktif.partner.length} partner</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* DETAIL */}
        {selected ? (
          <DetailPanel
            penyewa={data.find(d => d.id === selected.id) || selected}
            idx={data.findIndex(d => d.id === selected.id)}
            onToast={setToast}
          />
        ) : (
          <div className="detail-panel">
            <div className="empty" style={{ height:300 }}>
              <div className="empty-icon">👆</div>
              <div className="empty-title">Pilih penyewa</div>
              <div className="empty-sub">Klik nama di sebelah kiri untuk melihat detail</div>
            </div>
          </div>
        )}
      </div>

      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
