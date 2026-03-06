import { useState, useEffect } from "react";

// ============================================================
// CSS
// ============================================================



// ============================================================
// HELPERS
// ============================================================
const padD   = (n) => String(n).padStart(2, "0");
const fmtRp  = (n) => n != null ? "Rp " + Number(n).toLocaleString("id-ID") : "—";
const todayStr = (() => { const d = new Date(); return `${d.getFullYear()}-${padD(d.getMonth()+1)}-${padD(d.getDate())}`; })();
const thisMonth = todayStr.slice(0, 7);

const hariSisa = (tgl) => tgl ? Math.ceil((new Date(tgl) - new Date()) / 86400000) : null;

const getInisial = (nama) => {
  if (!nama) return "?";
  const p = nama.trim().split(" ");
  return p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : nama.slice(0,2).toUpperCase();
};

const STATUS_CONFIG = {
  lunas:    { label: "Lunas",        color: "#16a34a", bg: "#dcfce7", icon: "✅" },
  belum:    { label: "Belum Bayar",  color: "#f97316", bg: "#ffedd5", icon: "🕐" },
  terlambat:{ label: "Terlambat",    color: "#dc2626", bg: "#fee2e2", icon: "⚠️" },
  denda:    { label: "Ada Denda",    color: "#7c3aed", bg: "#ede9fe", icon: "💸" },
};

// Generate tagihan otomatis dari penyewa aktif
const generateTagihan = (penyewaList, kamarList, existingTagihan) => {
  const result = [...existingTagihan];
  penyewaList.forEach(p => {
    const kamar = kamarList.find(k => k.id === p.kamarId);
    if (!kamar) return;
    // Cek apakah tagihan bulan ini sudah ada
    const sudahAda = existingTagihan.some(
      t => t.penyewaId === p.id && t.periode === thisMonth
    );
    if (!sudahAda) {
      // Hitung jatuh tempo: tanggal 25 bulan ini
      const jatuhTempo = `${thisMonth}-25`;
      const sisaHari   = hariSisa(jatuhTempo);
      result.push({
        id:        `TG-${p.id}-${thisMonth}`,
        penyewaId: p.id,
        nama:      p.nama,
        kamarId:   p.kamarId,
        kamarTipe: kamar.tipe,
        nominal:   kamar.harga,
        periode:   thisMonth,
        jatuhTempo,
        status:    sisaHari !== null && sisaHari < 0 ? "terlambat" : "belum",
        dendaHari: sisaHari !== null && sisaHari < 0 ? Math.abs(sisaHari) : 0,
        riwayatBayar: [],
      });
    }
  });
  return result;
};

// ============================================================
// MODAL KONFIRMASI BAYAR
// ============================================================
function ModalBayar({ tagihan, onClose, onKonfirmasi }) {
  const denda50k = 50000; // Rp 50.000/hari — dari Pengaturan nanti
  const totalDenda = tagihan.dendaHari * denda50k;
  const totalBayar = tagihan.nominal + totalDenda;

  const [form, setForm] = useState({
    tglBayar:  todayStr,
    metode:    "transfer",
    noRekening:"",
    catatan:   "",
    bayarDenda: totalDenda > 0,
  });
  const set = (k,v) => setForm(prev => ({ ...prev, [k]: v }));
  const [done, setDone] = useState(false);

  const handleSave = () => {
    onKonfirmasi({
      ...tagihan,
      status: "lunas",
      tglBayar: form.tglBayar,
      metode: form.metode,
      riwayatBayar: [
        ...(tagihan.riwayatBayar || []),
        {
          tgl: form.tglBayar,
          nominal: form.bayarDenda ? totalBayar : tagihan.nominal,
          metode: form.metode,
          catatan: form.catatan,
        }
      ]
    });
    setDone(true);
  };

  const content = done ? (
    <div className="tg-modal-body">
      <div style={{ textAlign: "center", padding: "24px 0 16px" }}>
        <div style={{ fontSize: 52, marginBottom: 10 }}>✅</div>
        <div style={{ fontSize: 17, fontWeight: 700, color: "#111827", marginBottom: 6 }}>Pembayaran Dikonfirmasi!</div>
        <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 20 }}>
          Tagihan <b>{tagihan.nama}</b> bulan <b>{tagihan.periode}</b><br />
          sudah lunas. Terima kasih!
        </div>
        <button className="tg-btn ghost" style={{ maxWidth: 120, margin: "0 auto" }} onClick={onClose}>Tutup</button>
      </div>
    </div>
  ) : (
    <>
      <div className="tg-modal-body">
        {/* Info tagihan */}
        <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 10, padding: "12px 14px", marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{tagihan.nama} — Kamar {tagihan.kamarId}</div>
          <div style={{ fontSize: 11, color: "#9a3412", marginTop: 2 }}>Periode: {tagihan.periode} - Jatuh tempo: {tagihan.jatuhTempo}</div>
        </div>

        {/* Ringkasan */}
        <div className="tg-summary">
          <div className="tg-summary-row">
            <span className="tg-summary-key">Sewa bulan ini</span>
            <span className="tg-summary-val">{fmtRp(tagihan.nominal)}</span>
          </div>
          {tagihan.dendaHari > 0 && (
            <div className="tg-summary-row">
              <span className="tg-summary-key">Denda keterlambatan ({tagihan.dendaHari} hari × Rp 50.000)</span>
              <span className="tg-summary-val" style={{ color: "#dc2626" }}>{fmtRp(totalDenda)}</span>
            </div>
          )}
          <div className="tg-summary-row" style={{ fontWeight: 700 }}>
            <span style={{ fontWeight: 700, color: "#111827", fontSize: 12 }}>Total Bayar</span>
            <span className="tg-summary-val orange" style={{ fontSize: 14 }}>
              {fmtRp(form.bayarDenda ? totalBayar : tagihan.nominal)}
            </span>
          </div>
        </div>

        {tagihan.dendaHari > 0 && (
          <div className="tg-field" style={{ marginBottom: 14 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, cursor: "pointer" }}>
              <input type="checkbox" checked={form.bayarDenda} onChange={e => set("bayarDenda", e.target.checked)} />
              <span style={{ fontWeight: 600, color: "#374151" }}>Tagih denda keterlambatan</span>
            </label>
          </div>
        )}

        <div className="tg-input-row">
          <div className="tg-field">
            <label className="tg-field-label">Tanggal Bayar</label>
            <input type="date" className="tg-input" value={form.tglBayar} onChange={e => set("tglBayar", e.target.value)} />
          </div>
          <div className="tg-field">
            <label className="tg-field-label">Metode</label>
            <select className="tg-input" value={form.metode} onChange={e => set("metode", e.target.value)}>
              <option value="transfer">Transfer Bank</option>
              <option value="tunai">Tunai</option>
              <option value="qris">QRIS</option>
            </select>
          </div>
        </div>

        <div className="tg-field">
          <label className="tg-field-label">Catatan (opsional)</label>
          <input className="tg-input" placeholder="No. bukti transfer, catatan lain..." value={form.catatan} onChange={e => set("catatan", e.target.value)} />
        </div>

        <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 8, padding: "8px 12px", fontSize: 11, color: "#15803d" }}>
          ℹ️ Setelah dikonfirmasi, data otomatis masuk ke Kas & Jurnal
        </div>
      </div>
      <div className="tg-modal-foot">
        <button className="tg-btn success" onClick={handleSave}>✅ Konfirmasi Lunas</button>
        <button className="tg-btn ghost"   onClick={onClose}>Batal</button>
      </div>
    </>
  );

  return(
    <div className="tg-overlay-portal" onClick={onClose}>
      <div className="tg-modal" onClick={e => e.stopPropagation()}>
        <div className="tg-modal-head">
          <div className="tg-modal-title">💳 Konfirmasi Pembayaran</div>
          <button className="tg-modal-close" onClick={onClose}>✕</button>
        </div>
        {content}
      </div>
    </div>
  );
}

// ============================================================
// DETAIL PANEL
// ============================================================
function DetailPanel({ tagihan, onBayar, onClose }) {
  const st = STATUS_CONFIG[tagihan.status] || STATUS_CONFIG.belum;
  const denda50k = 50000;
  const totalDenda = (tagihan.dendaHari || 0) * denda50k;
  const totalBayar = tagihan.nominal + totalDenda;

  return (
    <div className="tg-widget">
      <div className="tg-widget-head">
        <div className="tg-widget-title">💳 Detail Tagihan</div>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 16 }}>✕</button>
      </div>
      <div className="tg-detail">

        {/* Nominal */}
        <div className="tg-nominal-box">
          <div className="tg-nominal-label">Total Tagihan</div>
          <div className="tg-nominal-val">{fmtRp(totalBayar)}</div>
          <div className="tg-nominal-sub">
            {tagihan.periode} - Jatuh tempo {tagihan.jatuhTempo}
          </div>
          <div style={{ marginTop: 8 }}>
            <span className="tg-badge" style={{ color: st.color, background: st.bg, fontSize: 11 }}>
              {st.icon} {st.label}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="tg-section">
          <div className="tg-section-label">Informasi</div>
          <div className="tg-info-grid">
            <div className="tg-info-item">
              <div className="tg-info-key">Penyewa</div>
              <div className="tg-info-val">{tagihan.nama}</div>
            </div>
            <div className="tg-info-item">
              <div className="tg-info-key">Kamar</div>
              <div className="tg-info-val orange">K{padD(tagihan.kamarId)} — {tagihan.kamarTipe}</div>
            </div>
            <div className="tg-info-item">
              <div className="tg-info-key">Sewa</div>
              <div className="tg-info-val mono">{fmtRp(tagihan.nominal)}</div>
            </div>
            <div className="tg-info-item">
              <div className="tg-info-key">Denda</div>
              <div className={`tg-info-val ${totalDenda>0?"red":"green"}`}>
                {totalDenda > 0 ? `${fmtRp(totalDenda)} (${tagihan.dendaHari}hr)` : "Tidak ada"}
              </div>
            </div>
          </div>
        </div>

        {/* Riwayat Bayar */}
        {tagihan.riwayatBayar?.length > 0 && (
          <div className="tg-section">
            <div className="tg-section-label">Riwayat Pembayaran</div>
            {tagihan.riwayatBayar.map((r, i) => (
              <div key={i} className="tg-pay-item">
                <div>
                  <div className="tg-pay-label">{r.metode === "transfer" ? "Transfer Bank" : r.metode === "qris" ? "QRIS" : "Tunai"}</div>
                  <div className="tg-pay-tgl">{r.tgl} {r.catatan && `- ${r.catatan}`}</div>
                </div>
                <div className="tg-pay-nominal">{fmtRp(r.nominal)}</div>
              </div>
            ))}
          </div>
        )}

        {/* Aksi */}
        {tagihan.status !== "lunas" && (
          <button className="tg-btn success" style={{ width: "100%" }} onClick={onBayar}>
            ✅ Konfirmasi Pembayaran
          </button>
        )}

        {tagihan.status === "lunas" && (
          <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 10, padding: "12px 14px", textAlign: "center" }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>✅</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#15803d" }}>Sudah Lunas</div>
            <div style={{ fontSize: 11, color: "#16a34a", marginTop: 2 }}>Dibayar: {tagihan.tglBayar} via {tagihan.metode}</div>
          </div>
        )}

      </div>
    </div>
  );
}

// ============================================================
// MAIN
// ============================================================
export default function Modul11_Tagihan({ user, globalData = {} }) {
  const {
    penyewaList = [],
    kamarList   = [],
    tagihanList = [], setTagihanList = () => {},
    setKasJurnal = () => {},
  } = globalData;

  const [tab,      setTab]      = useState("semua");
  const [selected, setSelected] = useState(null);
  const [showBayar,setShowBayar]= useState(false);
  const [search,   setSearch]   = useState("");
  const [filterBln,setFilterBln]= useState(thisMonth);

  const isAdmin = user?.role === "superadmin" || user?.role === "admin";

  // Generate tagihan otomatis dari penyewa aktif
  const semuaTagihan = generateTagihan(penyewaList, kamarList, tagihanList);

  // Filter bulan & tab & search
  const filtered = semuaTagihan.filter(t => {
    if (filterBln !== "all" && t.periode !== filterBln) return false;
    if (tab === "belum"     && t.status === "lunas") return false;
    if (tab === "lunas"     && t.status !== "lunas") return false;
    if (tab === "terlambat" && t.status !== "terlambat") return false;
    if (search) {
      const q = search.toLowerCase();
      return t.nama?.toLowerCase().includes(q) || String(t.kamarId).includes(q);
    }
    return true;
  });

  // Stats
  const totalPiutang = semuaTagihan.filter(t => t.status !== "lunas").reduce((s,t) => s + t.nominal, 0);
  const totalLunas   = semuaTagihan.filter(t => t.status === "lunas").reduce((s,t) => s + t.nominal, 0);
  const jumlahBelum  = semuaTagihan.filter(t => t.status !== "lunas").length;
  const jumlahTerlambat = semuaTagihan.filter(t => t.status === "terlambat").length;

  const handleKonfirmasi = (updated) => {
    // Update tagihan
    const exist = tagihanList.find(t => t.id === updated.id);
    if (exist) {
      setTagihanList(prev => prev.map(t => t.id === updated.id ? updated : t));
    } else {
      setTagihanList(prev => [...prev, updated]);
    }
    // Catat ke Kas & Jurnal
    setKasJurnal(prev => [...prev, {
      id:       Date.now(),
      tanggal:  updated.tglBayar,
      keterangan: `Sewa Kamar ${updated.kamarId} — ${updated.nama} (${updated.periode})`,
      kategori: "Sewa Kamar",
      tipe:     "pemasukan",
      nominal:  updated.riwayatBayar?.slice(-1)[0]?.nominal || updated.nominal,
      metode:   updated.metode,
    }]);
    // Update selected
    setSelected(updated);
    setShowBayar(false);
  };

  // Buat list bulan dari penyewa
  const bulanList = [...new Set(semuaTagihan.map(t => t.periode))].sort().reverse();

  return (
    <div className="tg-wrap">

      {/* Cards */}
      <div className="tg-cards">
        {[
          { label: "Piutang Bulan Ini", val: fmtRp(totalPiutang), color: "#ef4444", sub: `${jumlahBelum} tagihan belum lunas` },
          { label: "Sudah Lunas",       val: fmtRp(totalLunas),   color: "#16a34a", sub: `${semuaTagihan.filter(t=>t.status==="lunas").length} tagihan` },
          { label: "Terlambat",         val: jumlahTerlambat || (semuaTagihan.length?"0":"—"), color: "#dc2626", sub: "Melewati jatuh tempo" },
          { label: "Total Tagihan",     val: semuaTagihan.filter(t=>t.periode===filterBln).length || "—", color: "#f97316", sub: `Periode ${filterBln}` },
        ].map((c,i) => (
          <div key={i} className="tg-card">
            <div className="tg-card-bar" style={{ background: c.color }} />
            <div className="tg-card-label">{c.label}</div>
            <div className="tg-card-val">{c.val}</div>
            <div className="tg-card-sub">{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Layout */}
      <div className="tg-layout">
        <div className="tg-widget">
          <div className="tg-widget-head">
            <div className="tg-widget-title">💳 Daftar Tagihan</div>
            <div style={{ fontSize: 11, color: "#9ca3af" }}>{semuaTagihan.length} total tagihan</div>
          </div>

          {/* Tabs */}
          <div className="tg-tabs">
            {[
              { id: "semua",     label: `Semua (${semuaTagihan.length})` },
              { id: "belum",     label: `🕐 Belum Bayar (${jumlahBelum})` },
              { id: "terlambat", label: `⚠️ Terlambat (${jumlahTerlambat})` },
              { id: "lunas",     label: `✅ Lunas (${semuaTagihan.filter(t=>t.status==="lunas").length})` },
            ].map(t => (
              <div key={t.id} className={`tg-tab ${tab===t.id?"active":""}`} onClick={() => setTab(t.id)}>
                {t.label}
              </div>
            ))}
          </div>

          {/* Filter */}
          <div className="tg-filterbar">
            <div className="tg-search">
              <span>🔍</span>
              <input className="tg-search-input" placeholder="Cari nama, kamar..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="tg-select" value={filterBln} onChange={e => setFilterBln(e.target.value)}>
              <option value="all">Semua Bulan</option>
              {bulanList.map(b => <option key={b} value={b}>{b}</option>)}
              <option value={thisMonth}>{thisMonth} (Ini)</option>
            </select>
          </div>

          {/* List */}
          <div>
            {penyewaList.length === 0 ? (
              <div className="tg-empty">
                <div className="tg-empty-icon">💳</div>
                <div className="tg-empty-title">Belum ada tagihan</div>
                <div className="tg-empty-sub">Tagihan dibuat otomatis saat ada penyewa aktif</div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="tg-empty">
                <div className="tg-empty-icon">✅</div>
                <div className="tg-empty-title">Tidak ada tagihan di kategori ini</div>
                <div className="tg-empty-sub">Semua tagihan sudah lunas atau tidak ada data</div>
              </div>
            ) : (
              filtered.map(t => {
                const st = STATUS_CONFIG[t.status] || STATUS_CONFIG.belum;
                const sisa = hariSisa(t.jatuhTempo);
                return (
                  <div key={t.id} className={`tg-item ${selected?.id===t.id?"selected":""}`} onClick={() => setSelected(t)}>
                    <div className="tg-item-icon" style={{ background: st.bg }}>
                      <span>{st.icon}</span>
                    </div>
                    <div className="tg-item-info">
                      <div className="tg-item-name">{t.nama}</div>
                      <div className="tg-item-meta">
                        <span>🏠 K{padD(t.kamarId)}</span>
                        <span>📅 {t.periode}</span>
                        {t.dendaHari > 0 && <span style={{ color: "#dc2626", fontWeight: 600 }}>+denda {t.dendaHari}hr</span>}
                      </div>
                    </div>
                    <div className="tg-item-right">
                      <div className="tg-item-nominal">{fmtRp(t.nominal)}</div>
                      {t.status !== "lunas" && sisa !== null && (
                        <div className="tg-item-jatuh" style={{ color: sisa<0?"#dc2626":sisa<=3?"#f97316":"#9ca3af" }}>
                          {sisa<0 ? `${Math.abs(sisa)}hr telat` : `${sisa}hr lagi`}
                        </div>
                      )}
                      {t.status === "lunas" && (
                        <div className="tg-item-jatuh" style={{ color: "#16a34a" }}>✓ Lunas</div>
                      )}
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
            tagihan={selected}
            onBayar={() => setShowBayar(true)}
            onClose={() => setSelected(null)}
          />
        ) : (
          <div className="tg-widget">
            <div className="tg-empty" style={{ padding: "60px 20px" }}>
              <div className="tg-empty-icon">💳</div>
              <div className="tg-empty-title">Pilih tagihan</div>
              <div className="tg-empty-sub">Klik untuk konfirmasi pembayaran</div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Bayar */}
      {showBayar && selected && (
        <ModalBayar
          tagihan={selected}
          onClose={() => setShowBayar(false)}
          onKonfirmasi={handleKonfirmasi}
        />
      )}
    </div>
  );
}
