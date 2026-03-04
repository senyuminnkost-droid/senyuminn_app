import { useState, useEffect } from "react";

// ============================================================
// CSS
// ============================================================
const CSS = `
  .d-wrap { display: flex; flex-direction: column; gap: 20px; }

  /* ─── STAT CARDS ─────────────────────────── */
  .d-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
  .d-card {
    background: #fff; border-radius: 12px;
    border: 1px solid #e5e7eb;
    padding: 18px 20px; position: relative; overflow: hidden;
  }
  .d-card-accent {
    position: absolute; top: 0; left: 0; right: 0; height: 3px; border-radius: 12px 12px 0 0;
  }
  .d-card-icon {
    width: 36px; height: 36px; border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; margin-bottom: 12px;
  }
  .d-card-label {
    font-size: 10px; font-weight: 500; color: #9ca3af;
    text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 4px;
  }
  .d-card-value {
    font-size: 22px; font-weight: 700; color: #111827;
    font-family: 'JetBrains Mono', monospace; line-height: 1;
    margin-bottom: 6px;
  }
  .d-card-value.lg { font-size: 18px; }
  .d-card-sub {
    font-size: 11px; color: #6b7280; display: flex; align-items: center; gap: 4px;
  }
  .d-card-sub.up   { color: #16a34a; }
  .d-card-sub.down { color: #dc2626; }
  .d-card-sub.warn { color: #d97706; }

  /* ─── INSIGHT BAR ────────────────────────── */
  .d-insight {
    background: #fff; border: 1px solid #e5e7eb; border-radius: 10px;
    padding: 10px 16px; display: flex; align-items: center; gap: 8px;
    overflow: hidden;
  }
  .d-insight-label {
    font-size: 10px; font-weight: 600; color: #9ca3af;
    text-transform: uppercase; letter-spacing: 1px; flex-shrink: 0;
  }
  .d-insight-divider { width: 1px; height: 16px; background: #e5e7eb; flex-shrink: 0; }
  .d-insight-items { display: flex; gap: 20px; overflow-x: auto; flex: 1; }
  .d-insight-items::-webkit-scrollbar { display: none; }
  .d-insight-item {
    display: flex; align-items: center; gap: 6px;
    font-size: 12px; color: #374151; white-space: nowrap; flex-shrink: 0;
  }
  .d-insight-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

  /* ─── ROW 2 ──────────────────────────────── */
  .d-row { display: grid; gap: 14px; }
  .d-row-3 { grid-template-columns: 1fr 1fr 1fr; }
  .d-row-2 { grid-template-columns: 1fr 1fr; }

  /* ─── WIDGET ─────────────────────────────── */
  .d-widget {
    background: #fff; border-radius: 12px; border: 1px solid #e5e7eb;
    display: flex; flex-direction: column; overflow: hidden;
  }
  .d-widget-head {
    padding: 14px 16px 10px; border-bottom: 1px solid #f3f4f6;
    display: flex; align-items: center; justify-content: space-between;
  }
  .d-widget-title {
    font-size: 12px; font-weight: 600; color: #111827;
    display: flex; align-items: center; gap: 6px;
  }
  .d-widget-action {
    font-size: 10px; font-weight: 500; color: #f97316; cursor: pointer;
    padding: 3px 8px; border-radius: 5px; transition: background 0.12s;
  }
  .d-widget-action:hover { background: #fff7ed; }
  .d-widget-body { padding: 12px 16px; flex: 1; }

  /* ─── MONITOR MINI ───────────────────────── */
  .d-unit-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; }
  .d-unit {
    border-radius: 8px; padding: 8px 10px; cursor: pointer;
    border: 1.5px solid transparent; transition: all 0.12s;
    position: relative;
  }
  .d-unit:hover { transform: translateY(-1px); box-shadow: 0 3px 10px rgba(0,0,0,0.08); }
  .d-unit-num { font-size: 13px; font-weight: 700; color: #111827; font-family: 'JetBrains Mono', monospace; }
  .d-unit-tipe { font-size: 9px; color: #9ca3af; margin-top: 1px; }
  .d-unit-status { font-size: 9px; font-weight: 600; margin-top: 5px; }

  /* ─── TAGIHAN ROW ────────────────────────── */
  .d-tagihan-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 9px 0; border-bottom: 1px solid #f3f4f6;
  }
  .d-tagihan-row:last-child { border-bottom: none; }
  .d-tagihan-name { font-size: 12px; font-weight: 500; color: #111827; }
  .d-tagihan-sub  { font-size: 10px; color: #9ca3af; margin-top: 1px; }
  .d-tagihan-right { text-align: right; }
  .d-tagihan-val  { font-size: 12px; font-weight: 600; color: #111827; font-family: 'JetBrains Mono', monospace; }
  .d-tagihan-badge {
    display: inline-block; margin-top: 2px;
    font-size: 9px; font-weight: 700; padding: 1px 7px; border-radius: 10px;
  }

  /* ─── TIKET ROW ──────────────────────────── */
  .d-tiket-row {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 9px 0; border-bottom: 1px solid #f3f4f6;
  }
  .d-tiket-row:last-child { border-bottom: none; }
  .d-tiket-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-top: 3px; }
  .d-tiket-info { flex: 1; min-width: 0; }
  .d-tiket-name { font-size: 12px; font-weight: 500; color: #111827; }
  .d-tiket-desc { font-size: 10px; color: #9ca3af; margin-top: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .d-tiket-badge {
    font-size: 9px; font-weight: 700; padding: 2px 7px; border-radius: 10px; flex-shrink: 0;
  }

  /* ─── KAS ROW ────────────────────────────── */
  .d-kas-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 9px 0; border-bottom: 1px solid #f3f4f6;
  }
  .d-kas-row:last-child { border-bottom: none; padding-bottom: 0; }
  .d-kas-label { font-size: 12px; color: #6b7280; font-weight: 400; }
  .d-kas-val   { font-size: 13px; font-weight: 700; font-family: 'JetBrains Mono', monospace; }

  /* ─── PEMBAYARAN RUTIN ───────────────────── */
  .d-rutin-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 9px 0; border-bottom: 1px solid #f3f4f6;
  }
  .d-rutin-row:last-child { border-bottom: none; }
  .d-rutin-name { font-size: 12px; font-weight: 500; color: #111827; }
  .d-rutin-due  { font-size: 10px; color: #9ca3af; margin-top: 1px; }
  .d-rutin-right { text-align: right; }
  .d-rutin-val  { font-size: 12px; font-weight: 600; color: #111827; font-family: 'JetBrains Mono', monospace; }
  .d-rutin-badge {
    display: inline-block; margin-top: 2px;
    font-size: 9px; font-weight: 700; padding: 1px 7px; border-radius: 10px;
  }

  /* ─── EMPTY ──────────────────────────────── */
  .d-empty {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 28px 16px; color: #9ca3af; text-align: center; gap: 6px;
  }
  .d-empty-icon { font-size: 28px; opacity: 0.5; }
  .d-empty-text { font-size: 12px; }

  /* ─── RESPONSIVE ─────────────────────────── */
  @media (max-width: 1024px) {
    .d-stats { grid-template-columns: repeat(2, 1fr); }
    .d-row-3 { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 768px) {
    .d-stats { grid-template-columns: repeat(2, 1fr); }
    .d-row-3, .d-row-2 { grid-template-columns: 1fr; }
    .d-unit-grid { grid-template-columns: repeat(4, 1fr); }
  }
  @media (max-width: 480px) {
    .d-stats { grid-template-columns: 1fr 1fr; gap: 10px; }
    .d-unit-grid { grid-template-columns: repeat(3, 1fr); }
    .d-card-value { font-size: 18px; }
    .d-card-value.lg { font-size: 15px; }
  }
`;

function StyleInjector() {
  useEffect(() => {
    const id = "senyuminn-dashboard-css";
    if (document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id; el.textContent = CSS;
    document.head.appendChild(el);
    return () => { const e = document.getElementById(id); if (e) e.remove(); };
  }, []);
  return null;
}

// ============================================================
// HELPERS
// ============================================================
const fmt = (n) => "Rp " + (n || 0).toLocaleString("id-ID");
const fmtShort = (n) => {
  if (!n) return "Rp 0";
  if (n >= 1000000) return "Rp " + (n / 1000000).toFixed(1).replace(".0","") + " jt";
  if (n >= 1000)    return "Rp " + (n / 1000).toFixed(0) + " rb";
  return "Rp " + n;
};

const STATUS_CFG = {
  tersedia:    { label: "Tersedia",    color: "#16a34a", bg: "#dcfce7", border: "#86efac" },
  booked:      { label: "Booked",      color: "#b45309", bg: "#fef3c7", border: "#fcd34d" },
  terisi:      { label: "Terisi",      color: "#dc2626", bg: "#fee2e2", border: "#fca5a5" },
  "deep-clean":{ label: "Deep Clean",  color: "#1d4ed8", bg: "#dbeafe", border: "#93c5fd" },
  maintenance: { label: "Maintenance", color: "#c2410c", bg: "#ffedd5", border: "#fdba74" },
};

const TIKET_CFG = {
  open:        { color: "#dc2626", bg: "#fee2e2" },
  "in-progress":{ color: "#d97706", bg: "#fef3c7" },
  ditunda:     { color: "#6d28d9", bg: "#ede9fe" },
  selesai:     { color: "#16a34a", bg: "#dcfce7" },
};

// ============================================================
// DASHBOARD
// ============================================================
export default function Dashboard({ user }) {
  // Semua data kosong — akan diisi dari modul lain setelah Supabase connect
  const kamarList    = [];   // dari Modul03_Monitor / Supabase
  const tiketList    = [];   // dari Modul05_Keluhan / Supabase
  const tagihanList  = [];   // dari Modul11_Tagihan / Supabase
  const rutinList    = [];   // dari Modul17_Profil  / Supabase
  const kasData      = { masuk: 0, keluar: 0 };

  // ── Hitung stats dari data ──
  const totalKamar   = kamarList.length || 0;
  const terisi       = kamarList.filter(k => k.status === "terisi").length;
  const tersedia     = kamarList.filter(k => k.status === "tersedia").length;
  const booked       = kamarList.filter(k => k.status === "booked").length;
  const maintenance  = kamarList.filter(k => k.status === "maintenance" || k.status === "deep-clean").length;
  const okupansi     = totalKamar ? Math.round((terisi / totalKamar) * 100) : 0;

  const omzetBulanIni  = tagihanList.filter(t => t.status === "lunas").reduce((s, t) => s + (t.jumlah || 0), 0);
  const piutang        = tagihanList.filter(t => t.status === "belum").reduce((s, t) => s + (t.jumlah || 0), 0);
  const tiketOpen      = tiketList.filter(t => t.status === "open" || t.status === "in-progress").length;
  const tiketUrgent    = tiketList.filter(t => t.prioritas === "urgent" && t.status !== "selesai").length;
  const kontrakHabis   = kamarList.filter(k => {
    if (!k.kontrakSelesai) return false;
    const sisa = Math.ceil((new Date(k.kontrakSelesai) - new Date()) / 86400000);
    return sisa >= 0 && sisa <= 30;
  }).length;

  // ── Insights otomatis ──
  const insights = [];
  if (tiketUrgent > 0)   insights.push({ dot: "#ef4444", text: `${tiketUrgent} tiket urgent belum ditangani` });
  if (kontrakHabis > 0)  insights.push({ dot: "#f97316", text: `${kontrakHabis} kontrak habis bulan ini` });
  if (tersedia > 0)       insights.push({ dot: "#16a34a", text: `${tersedia} kamar siap disewa` });
  if (insights.length === 0) insights.push({ dot: "#9ca3af", text: "Semua berjalan normal ✓" });

  const isAdmin = user?.role === "superadmin" || user?.role === "admin";

  return (
    <div className="d-wrap">
      <StyleInjector />

      {/* ── STAT CARDS ── */}
      <div className="d-stats">

        {/* Omzet */}
        {isAdmin && (
          <div className="d-card">
            <div className="d-card-accent" style={{ background: "#f97316" }} />
            <div className="d-card-icon" style={{ background: "#fff7ed" }}>💰</div>
            <div className="d-card-label">Omzet Bulan Ini</div>
            <div className={`d-card-value ${omzetBulanIni > 9999999 ? "lg" : ""}`}>
              {omzetBulanIni ? fmtShort(omzetBulanIni) : "—"}
            </div>
            <div className="d-card-sub">
              {omzetBulanIni ? "Dari tagihan lunas" : "Belum ada data"}
            </div>
          </div>
        )}

        {/* Okupansi */}
        <div className="d-card">
          <div className="d-card-accent" style={{ background: "#3b82f6" }} />
          <div className="d-card-icon" style={{ background: "#eff6ff" }}>🏠</div>
          <div className="d-card-label">Okupansi</div>
          <div className="d-card-value">{totalKamar ? `${okupansi}%` : "—"}</div>
          <div className="d-card-sub">
            {totalKamar ? `${terisi} / ${totalKamar} kamar terisi` : "Belum ada data kamar"}
          </div>
        </div>

        {/* Piutang */}
        {isAdmin && (
          <div className="d-card">
            <div className="d-card-accent" style={{ background: "#ef4444" }} />
            <div className="d-card-icon" style={{ background: "#fef2f2" }}>📋</div>
            <div className="d-card-label">Piutang</div>
            <div className={`d-card-value ${piutang > 9999999 ? "lg" : ""}`} style={{ color: piutang > 0 ? "#dc2626" : "#111827" }}>
              {piutang ? fmtShort(piutang) : "—"}
            </div>
            <div className="d-card-sub">
              {piutang ? "Belum terbayar" : "Tidak ada piutang"}
            </div>
          </div>
        )}

        {/* Tiket */}
        <div className="d-card">
          <div className="d-card-accent" style={{ background: tiketUrgent > 0 ? "#ef4444" : "#f59e0b" }} />
          <div className="d-card-icon" style={{ background: tiketUrgent > 0 ? "#fef2f2" : "#fffbeb" }}>🔧</div>
          <div className="d-card-label">Tiket Keluhan</div>
          <div className="d-card-value" style={{ color: tiketUrgent > 0 ? "#dc2626" : "#111827" }}>
            {tiketOpen || "—"}
          </div>
          <div className={`d-card-sub ${tiketUrgent > 0 ? "down" : ""}`}>
            {tiketOpen ? `${tiketUrgent} urgent` : "Tidak ada tiket open"}
          </div>
        </div>

      </div>

      {/* ── INSIGHT BAR ── */}
      <div className="d-insight">
        <span className="d-insight-label">Live</span>
        <div className="d-insight-divider" />
        <div className="d-insight-items">
          {insights.map((ins, i) => (
            <div key={i} className="d-insight-item">
              <div className="d-insight-dot" style={{ background: ins.dot }} />
              {ins.text}
            </div>
          ))}
        </div>
      </div>

      {/* ── ROW 1: Agenda Penagihan + Pembayaran Rutin + Kas ── */}
      {isAdmin && (
        <div className="d-row d-row-3">

          {/* Agenda Penagihan Sewa */}
          <div className="d-widget">
            <div className="d-widget-head">
              <div className="d-widget-title">
                <span>📅</span> Agenda Penagihan Sewa
              </div>
              <div className="d-widget-action">Lihat Semua</div>
            </div>
            <div className="d-widget-body">
              {tagihanList.filter(t => t.status === "belum").slice(0, 4).length === 0 ? (
                <div className="d-empty">
                  <div className="d-empty-icon">📭</div>
                  <div className="d-empty-text">Tidak ada tagihan mendatang</div>
                </div>
              ) : (
                tagihanList.filter(t => t.status === "belum").slice(0, 4).map((t, i) => (
                  <div key={i} className="d-tagihan-row">
                    <div>
                      <div className="d-tagihan-name">{t.kamar} — {t.penghuni}</div>
                      <div className="d-tagihan-sub">Jatuh tempo: {t.jatuhTempo}</div>
                    </div>
                    <div className="d-tagihan-right">
                      <div className="d-tagihan-val">{fmtShort(t.jumlah)}</div>
                      <div className="d-tagihan-badge" style={{ background: "#fee2e2", color: "#dc2626" }}>UNPAID</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Agenda Pembayaran Rutin */}
          <div className="d-widget">
            <div className="d-widget-head">
              <div className="d-widget-title">
                <span>🔄</span> Agenda Pembayaran Rutin
              </div>
              <div className="d-widget-action">Lihat Semua</div>
            </div>
            <div className="d-widget-body">
              {rutinList.length === 0 ? (
                <div className="d-empty">
                  <div className="d-empty-icon">📋</div>
                  <div className="d-empty-text">Belum ada pembayaran rutin<br/>
                    <span style={{ fontSize: 10, color: "#f97316" }}>Tambah di Pengaturan → Profil Kost</span>
                  </div>
                </div>
              ) : (
                rutinList.slice(0, 4).map((r, i) => (
                  <div key={i} className="d-rutin-row">
                    <div>
                      <div className="d-rutin-name">{r.nama}</div>
                      <div className="d-rutin-due">Due: {r.jatuhTempo}</div>
                    </div>
                    <div className="d-rutin-right">
                      <div className="d-rutin-val">{fmtShort(r.nominal)}</div>
                      <div
                        className="d-rutin-badge"
                        style={{
                          background: r.status === "paid" ? "#dcfce7" : "#fee2e2",
                          color:      r.status === "paid" ? "#16a34a" : "#dc2626",
                        }}
                      >
                        {r.status === "paid" ? "PAID" : "PENDING"}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Kas Bulan Ini */}
          <div className="d-widget">
            <div className="d-widget-head">
              <div className="d-widget-title"><span>💳</span> Kas Bulan Ini</div>
            </div>
            <div className="d-widget-body">
              <div className="d-kas-row">
                <div>
                  <div className="d-kas-label">Pemasukan</div>
                </div>
                <div className="d-kas-val" style={{ color: "#16a34a" }}>{fmt(kasData.masuk)}</div>
              </div>
              <div className="d-kas-row">
                <div className="d-kas-label">Pengeluaran</div>
                <div className="d-kas-val" style={{ color: "#dc2626" }}>{fmt(kasData.keluar)}</div>
              </div>
              <div className="d-kas-row" style={{ borderTop: "1px solid #f3f4f6", marginTop: 4, paddingTop: 12 }}>
                <div className="d-kas-label" style={{ fontWeight: 600, color: "#111827" }}>Net</div>
                <div className="d-kas-val" style={{ color: (kasData.masuk - kasData.keluar) >= 0 ? "#16a34a" : "#dc2626" }}>
                  {fmt(kasData.masuk - kasData.keluar)}
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ── ROW 2: Tiket + Monitor Mini ── */}
      <div className="d-row d-row-2">

        {/* Tiket Keluhan */}
        <div className="d-widget">
          <div className="d-widget-head">
            <div className="d-widget-title"><span>🔧</span> Status Perbaikan</div>
            <div className="d-widget-action">Lihat Semua</div>
          </div>
          <div className="d-widget-body">
            {tiketList.filter(t => t.status !== "selesai").length === 0 ? (
              <div className="d-empty">
                <div className="d-empty-icon">✅</div>
                <div className="d-empty-text">Tidak ada tiket aktif</div>
              </div>
            ) : (
              tiketList.filter(t => t.status !== "selesai").slice(0, 5).map((t, i) => (
                <div key={i} className="d-tiket-row">
                  <div className="d-tiket-dot"
                    style={{ background: TIKET_CFG[t.status]?.color || "#9ca3af" }} />
                  <div className="d-tiket-info">
                    <div className="d-tiket-name">Kamar {t.kamar} — {t.kategori}</div>
                    <div className="d-tiket-desc">{t.deskripsi}</div>
                  </div>
                  <div className="d-tiket-badge"
                    style={{ background: TIKET_CFG[t.status]?.bg, color: TIKET_CFG[t.status]?.color }}>
                    {t.status}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Monitor Unit Mini */}
        <div className="d-widget">
          <div className="d-widget-head">
            <div className="d-widget-title"><span>🏠</span> Monitor Unit</div>
            <div style={{ display: "flex", gap: 10 }}>
              {Object.entries(STATUS_CFG).map(([key, cfg]) => (
                <div key={key} style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 9, color: "#9ca3af" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.color }} />
                  {cfg.label}
                </div>
              ))}
            </div>
          </div>
          <div className="d-widget-body">
            {kamarList.length === 0 ? (
              <div className="d-empty">
                <div className="d-empty-icon">🏠</div>
                <div className="d-empty-text">Belum ada data kamar<br/>
                  <span style={{ fontSize: 10, color: "#f97316" }}>Tambah di Pengaturan → Profil Kost</span>
                </div>
              </div>
            ) : (
              <div className="d-unit-grid">
                {kamarList.map(k => {
                  const cfg = STATUS_CFG[k.status] || STATUS_CFG.tersedia;
                  return (
                    <div key={k.id} className="d-unit"
                      style={{ background: cfg.bg, borderColor: cfg.border }}>
                      <div className="d-unit-num">K{String(k.id).padStart(2,"0")}</div>
                      <div className="d-unit-tipe">{k.tipe}</div>
                      <div className="d-unit-status" style={{ color: cfg.color }}>{cfg.label}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ── ROW 3 STAFF: Jadwal Service + Tiket ── */}
      {!isAdmin && (
        <div className="d-row d-row-2">
          <div className="d-widget">
            <div className="d-widget-head">
              <div className="d-widget-title"><span>🧹</span> Jadwal Service Hari Ini</div>
            </div>
            <div className="d-widget-body">
              <div className="d-empty">
                <div className="d-empty-icon">🧹</div>
                <div className="d-empty-text">Tidak ada jadwal hari ini</div>
              </div>
            </div>
          </div>
          <div className="d-widget">
            <div className="d-widget-head">
              <div className="d-widget-title"><span>🔧</span> Tiket Perlu Ditangani</div>
            </div>
            <div className="d-widget-body">
              {tiketList.filter(t => t.prioritas === "urgent" && t.status !== "selesai").length === 0 ? (
                <div className="d-empty">
                  <div className="d-empty-icon">✅</div>
                  <div className="d-empty-text">Tidak ada tiket urgent</div>
                </div>
              ) : (
                tiketList.filter(t => t.prioritas === "urgent").slice(0, 4).map((t, i) => (
                  <div key={i} className="d-tiket-row">
                    <div className="d-tiket-dot" style={{ background: "#ef4444" }} />
                    <div className="d-tiket-info">
                      <div className="d-tiket-name">Kamar {t.kamar} — {t.kategori}</div>
                      <div className="d-tiket-desc">{t.deskripsi}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
