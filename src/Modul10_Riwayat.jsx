import { useState, useEffect } from "react";

// ============================================================
// CSS
// ============================================================



// ============================================================
// HELPERS
// ============================================================
const padD = (n) => String(n).padStart(2, "0");
const todayStr = (() => { const d = new Date(); return `${d.getFullYear()}-${padD(d.getMonth()+1)}-${padD(d.getDate())}`; })();
const fmtRp = (n) => n ? "Rp " + Number(n).toLocaleString("id-ID") : "—";
const getInisial = (nama) => {
  if (!nama) return "?";
  const p = nama.trim().split(" ");
  return p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : nama.slice(0,2).toUpperCase();
};
const addMonths = (dateStr, n) => {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + parseInt(n));
  return `${d.getFullYear()}-${padD(d.getMonth()+1)}-${padD(d.getDate())}`;
};
const hitungDurasi = (mulai, selesai) => {
  if (!mulai || !selesai) return "—";
  const bln = Math.round((new Date(selesai) - new Date(mulai)) / (1000 * 60 * 60 * 24 * 30));
  return `${bln} bulan`;
};

// ============================================================
// MODAL CHECKIN ULANG
// ============================================================
function ModalCheckinUlang({ penyewa, kamarList, onClose, onCheckin }) {
  const [form, setForm] = useState({
    kamarId:      penyewa.kamarId || "",
    kontrakMulai: todayStr,
    durasi:       "6",
    kontrakSelesai: "",
  });
  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  useEffect(() => {
    if (form.kontrakMulai && form.durasi)
      set("kontrakSelesai", addMonths(form.kontrakMulai, form.durasi));
  }, []);

  const handleMulai = (tgl) => {
    set("kontrakMulai", tgl);
    if (form.durasi) set("kontrakSelesai", addMonths(tgl, form.durasi));
  };
  const handleDurasi = (dur) => {
    set("durasi", dur);
    if (form.kontrakMulai) set("kontrakSelesai", addMonths(form.kontrakMulai, dur));
  };

  const kamarDipilih = kamarList.find(k => k.id === form.kamarId);
  const valid = form.kamarId && form.kontrakMulai;

  return(
    <div className="rw-overlay-portal" onClick={onClose}>
      <div className="rw-modal" onClick={e => e.stopPropagation()}>
        <div className="rw-modal-head">
          <div className="rw-modal-title">🔄 Check-in Ulang — {penyewa.nama}</div>
          <button className="rw-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="rw-modal-body">

          {/* Data lama */}
          <div style={{ background: "#f9fafb", borderRadius: 10, padding: "12px 14px", marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Data Tersimpan</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 12 }}>
              {[
                { k: "NIK",      v: penyewa.nik || "—" },
                { k: "No. HP",   v: penyewa.noHP || "—" },
                { k: "Alamat",   v: penyewa.alamat || "—" },
                { k: "Pekerjaan",v: penyewa.pekerjaan || "—" },
              ].map((r,i) => (
                <div key={i}>
                  <span style={{ color: "#9ca3af" }}>{r.k}: </span>
                  <span style={{ fontWeight: 600, color: "#374151" }}>{r.v}</span>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, color: "#16a34a", marginTop: 8, fontWeight: 500 }}>✅ Data identitas tidak perlu diisi ulang</div>
          </div>

          <div style={{ fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Pilih Kamar</div>
          {kamarList.length === 0 ? (
            <div style={{ fontSize: 12, color: "#9ca3af", padding: "8px 0" }}>Belum ada kamar tersedia</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 14 }}>
              {kamarList.map(k => {
                const avail = k.status === "tersedia" || k.status === "booked";
                return (
                  <div
                    key={k.id}
                    onClick={() => avail && set("kamarId", k.id)}
                    style={{
                      padding: "8px 6px", borderRadius: 8, textAlign: "center",
                      border: `1.5px solid ${form.kamarId===k.id?"#f97316":"#e5e7eb"}`,
                      background: form.kamarId===k.id ? "#fff7ed" : "#fff",
                      cursor: avail ? "pointer" : "not-allowed",
                      opacity: avail ? 1 : 0.35,
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>K{padD(k.id)}</div>
                    <div style={{ fontSize: 9, color: "#9ca3af" }}>{k.tipe}</div>
                    <div style={{ fontSize: 10, color: "#f97316", fontWeight: 600 }}>{fmtRp(k.harga)}</div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="rw-input-row">
            <div className="rw-field">
              <label className="rw-field-label">Mulai Kontrak</label>
              <input type="date" className="rw-input" value={form.kontrakMulai} onChange={e => handleMulai(e.target.value)} />
            </div>
            <div className="rw-field">
              <label className="rw-field-label">Durasi</label>
              <select className="rw-input" value={form.durasi} onChange={e => handleDurasi(e.target.value)}>
                <option value="3">3 bulan</option>
                <option value="6">6 bulan</option>
                <option value="12">12 bulan</option>
              </select>
            </div>
          </div>

          {form.kontrakSelesai && (
            <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 8, padding: "8px 12px", fontSize: 11, color: "#15803d" }}>
              ✅ Kontrak berakhir: <b>{form.kontrakSelesai}</b>
              {kamarDipilih && <> - <b>{fmtRp(kamarDipilih.harga)}/bulan</b></>}
            </div>
          )}

        </div>
        <div className="rw-modal-foot">
          <button className="rw-btn primary" disabled={!valid} onClick={() => { onCheckin({ ...penyewa, ...form, id: Date.now(), statusRiwayat: undefined, tglCheckout: undefined }); onClose(); }}>
            🔑 Check-in Ulang
          </button>
          <button className="rw-btn ghost" onClick={onClose}>Batal</button>
        </div>
      </div>
  </div>
  );
}

// ============================================================
// DETAIL PANEL
// ============================================================
function DetailPanel({ penyewa, kamarList, onCheckinUlang, onClose }) {
  const isAdmin = true; // dari props user nanti
  const kamar = kamarList.find(k => k.id === penyewa.kamarId);

  // Susun timeline dari data penyewa
  const timeline = [
    { type: "checkin",  label: "Check-in",         tgl: penyewa.tglMasuk,   sub: `Kamar ${penyewa.kamarId}` },
    penyewa.kontrakMulai !== penyewa.tglMasuk && {
      type: "perpanjang", label: "Perpanjang Kontrak", tgl: penyewa.kontrakMulai, sub: `Durasi ${penyewa.durasi} bulan`
    },
    { type: "checkout", label: "Check-out",         tgl: penyewa.tglCheckout, sub: `Kamar ${penyewa.kamarId}` },
  ].filter(Boolean);

  return (
    <div className="rw-widget">
      <div className="rw-widget-head">
        <div className="rw-widget-title">📋 Detail Riwayat</div>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 16 }}>✕</button>
      </div>
      <div className="rw-detail">

        {/* Header */}
        <div className="rw-detail-header">
          <div className="rw-detail-avatar">{getInisial(penyewa.nama)}</div>
          <div style={{ flex: 1 }}>
            <div className="rw-detail-name">{penyewa.nama}</div>
            <div className="rw-detail-sub">📞 {penyewa.noHP || "—"} - {penyewa.pekerjaan || "—"}</div>
            <div className="rw-detail-badges">
              <span className="rw-badge" style={{ background: "#f3f4f6", color: "#6b7280" }}>🏠 Kamar {penyewa.kamarId}</span>
              <span className="rw-badge" style={{ background: "#fee2e2", color: "#dc2626" }}>✓ Alumni</span>
            </div>
          </div>
        </div>

        {/* Kontrak Lama */}
        <div className="rw-section">
          <div className="rw-section-label">Kontrak Terakhir</div>
          <div style={{ background: "#f9fafb", borderRadius: 10, padding: "12px 14px", border: "1px solid #e5e7eb" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#374151", fontFamily: "JetBrains Mono, monospace" }}>
                {penyewa.kontrakMulai || "—"} → {penyewa.kontrakSelesai || "—"}
              </span>
              <span className="rw-badge" style={{ background: "#f3f4f6", color: "#6b7280" }}>{hitungDurasi(penyewa.kontrakMulai, penyewa.kontrakSelesai)}</span>
            </div>
            <div style={{ fontSize: 11, color: "#9ca3af" }}>
              Check-out: {penyewa.tglCheckout || "—"}
              {kamar && <> - {fmtRp(kamar.harga)}/bulan</>}
            </div>
          </div>
        </div>

        {/* Identitas */}
        <div className="rw-section">
          <div className="rw-section-label">Identitas</div>
          <div className="rw-info-grid">
            {[
              { k: "NIK / KTP",    v: penyewa.nik       || "—", mono: true },
              { k: "Tgl Lahir",    v: penyewa.tglLahir  || "—" },
              { k: "Alamat",       v: penyewa.alamat    || "—", full: true },
              { k: "No. Darurat",  v: penyewa.noHPDarurat || "—" },
              { k: "Nama Darurat", v: penyewa.namaDarurat || "—" },
              { k: "Foto KTP",     v: penyewa.ktpFile ? `✅ ${penyewa.ktpFile}` : "—" },
            ].map((i,idx) => (
              <div key={idx} className="rw-info-item" style={i.full ? { gridColumn: "1 / -1" } : {}}>
                <div className="rw-info-key">{i.k}</div>
                <div className={`rw-info-val ${i.mono?"mono":""}`}>{i.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Partner */}
        {penyewa.partner?.length > 0 && (
          <div className="rw-section">
            <div className="rw-section-label">Partner</div>
            {penyewa.partner.map((p,i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", background: "#f9fafb", borderRadius: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 14 }}>👥</span>
                <span style={{ fontSize: 12, fontWeight: 500, color: "#374151" }}>{p}</span>
              </div>
            ))}
          </div>
        )}

        {/* Timeline */}
        <div className="rw-section">
          <div className="rw-section-label">Riwayat Aktivitas</div>
          <div className="rw-timeline">
            {timeline.map((t, i) => (
              <div key={i} className={`rw-tl-item ${t.type}`}>
                <div className="rw-tl-title">
                  {t.type === "checkin" ? "🔑" : t.type === "checkout" ? "🚪" : "📋"} {t.label}
                </div>
                <div className="rw-tl-sub">{t.tgl || "—"} - {t.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Aksi */}
        <button
          className="rw-btn primary"
          style={{ width: "100%", marginTop: 4 }}
          onClick={onCheckinUlang}
        >
          🔄 Check-in Ulang
        </button>

      </div>
    </div>
  );
}

// ============================================================
// MAIN
// ============================================================
export default function Modul10_Riwayat({ user, globalData = {} }) {
  const {
    riwayatList  = [], setRiwayatList  = () => {},
    penyewaList  = [], setPenyewaList  = () => {},
    kamarList    = [],
  } = globalData;

  const [selected,   setSelected]   = useState(null);
  const [showModal,  setShowModal]  = useState(false);
  const [search,     setSearch]     = useState("");
  const [filterKamar, setFK]        = useState("all");
  const [sortBy,     setSortBy]     = useState("terbaru");

  const isAdmin = user?.role === "superadmin" || user?.role === "admin";

  // Filter & sort
  const filtered = riwayatList
    .filter(p => {
      if (filterKamar !== "all" && String(p.kamarId) !== filterKamar) return false;
      if (search) {
        const q = search.toLowerCase();
        return p.nama && nama.toLowerCase().includes(q) || String(p.kamarId).includes(q) || p.nik && nik.includes(q) || p.noHP && noHP.includes(q);
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "terbaru") return new Date(b.tglCheckout||0) - new Date(a.tglCheckout||0);
      if (sortBy === "terlama") return new Date(a.tglCheckout||0) - new Date(b.tglCheckout||0);
      if (sortBy === "nama")    return (a.nama||"").localeCompare(b.nama||"");
      return 0;
    });

  // Stats
  const kamarTerbanyak = riwayatList.reduce((acc, p) => {
    acc[p.kamarId] = (acc[p.kamarId] || 0) + 1; return acc;
  }, {});
  const kamarPalingAktif = Object.entries(kamarTerbanyak).sort((a,b)=>b[1]-a[1])[0]?.[0];

  const handleCheckinUlang = (data) => {
    setPenyewaList(prev => [...prev, data]);
    // Tandai di riwayat sebagai "checkin ulang"
    setRiwayatList(prev => prev.map(p =>
      p.id === selected?.id ? { ...p, checkinUlang: true } : p
    ));
    setSelected(null);
    setShowModal(false);
  };

  return (
    <div className="rw-wrap">

      {/* Cards */}
      <div className="rw-cards">
        {[
          { label: "Total Alumni",      val: riwayatList.length || "—", color: "#6b7280",  sub: "Pernah tinggal" },
          { label: "Bulan Ini",         val: riwayatList.filter(p => p.tglCheckout && tglCheckout.startsWith(todayStr.slice(0,7))).length || (riwayatList.length?"0":"—"), color: "#f97316", sub: "Check-out bulan ini" },
          { label: "Check-in Ulang",    val: riwayatList.filter(p => p.checkinUlang).length || (riwayatList.length?"0":"—"), color: "#16a34a", sub: "Penyewa kembali" },
          { label: "Kamar Paling Aktif",val: kamarPalingAktif ? `K${padD(kamarPalingAktif)}` : "—", color: "#3b82f6", sub: kamarPalingAktif ? `${kamarTerbanyak[kamarPalingAktif]}x disewa` : "Belum ada data" },
        ].map((c,i) => (
          <div key={i} className="rw-card">
            <div className="rw-card-bar" style={{ background: c.color }} />
            <div className="rw-card-label">{c.label}</div>
            <div className="rw-card-val">{c.val}</div>
            <div className="rw-card-sub">{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Layout */}
      <div className="rw-layout">
        <div className="rw-widget">
          <div className="rw-widget-head">
            <div className="rw-widget-title">📋 Riwayat Penyewa</div>
            <span style={{ fontSize: 11, color: "#9ca3af" }}>{riwayatList.length} total alumni</span>
          </div>

          {/* Filter */}
          <div className="rw-filterbar">
            <div className="rw-search">
              <span>🔍</span>
              <input className="rw-search-input" placeholder="Cari nama, NIK, kamar..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="rw-select" value={filterKamar} onChange={e => setFK(e.target.value)}>
              <option value="all">Semua Kamar</option>
              {[...new Set(riwayatList.map(p=>p.kamarId))].sort().map(k => (
                <option key={k} value={String(k)}>Kamar {k}</option>
              ))}
            </select>
            <select className="rw-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="terbaru">Terbaru</option>
              <option value="terlama">Terlama</option>
              <option value="nama">A–Z Nama</option>
            </select>
          </div>

          {/* List */}
          <div>
            {riwayatList.length === 0 ? (
              <div className="rw-empty">
                <div className="rw-empty-icon">📋</div>
                <div className="rw-empty-title">Belum ada riwayat</div>
                <div className="rw-empty-sub">Riwayat akan muncul otomatis setelah penyewa melakukan check-out</div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="rw-empty">
                <div className="rw-empty-icon">🔍</div>
                <div className="rw-empty-title">Tidak ditemukan</div>
                <div className="rw-empty-sub">Coba ubah kata kunci pencarian</div>
              </div>
            ) : (
              filtered.map(p => {
                const durasi = hitungDurasi(p.kontrakMulai, p.kontrakSelesai);
                return (
                  <div key={p.id} className={`rw-item ${selected?.id===p.id?"selected":""}`} onClick={() => setSelected(p)}>
                    <div className="rw-avatar">{getInisial(p.nama)}</div>
                    <div className="rw-item-info">
                      <div className="rw-item-name">{p.nama}</div>
                      <div className="rw-item-meta">
                        <span>📅 {p.tglMasuk} → {p.tglCheckout || "—"}</span>
                        {p.partner?.length > 0 && <span>👥 +{p.partner.length}</span>}
                        {p.checkinUlang && <span style={{ color: "#16a34a", fontWeight: 600 }}>🔄 Kembali lagi</span>}
                      </div>
                    </div>
                    <div className="rw-item-right">
                      <div className="rw-item-kamar">K{padD(p.kamarId)}</div>
                      <div className="rw-item-dur">{durasi}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Detail */}
        {selected ? (
          <DetailPanel
            penyewa={selected}
            kamarList={kamarList}
            onCheckinUlang={() => setShowModal(true)}
            onClose={() => setSelected(null)}
          />
        ) : (
          <div className="rw-widget">
            <div className="rw-empty" style={{ padding: "60px 20px" }}>
              <div className="rw-empty-icon">📋</div>
              <div className="rw-empty-title">Pilih alumni</div>
              <div className="rw-empty-sub">Klik nama untuk lihat detail & opsi check-in ulang</div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Check-in Ulang */}
      {showModal && selected && (
        <ModalCheckinUlang
          penyewa={selected}
          kamarList={kamarList}
          onClose={() => setShowModal(false)}
          onCheckin={handleCheckinUlang}
        />
      )}
    </div>
  );
}