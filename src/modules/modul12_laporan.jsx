import { useState, useEffect } from "react";

// ============================================================
// FINANCIAL DATA
// ============================================================
const PERIODE_LIST = ["Feb 2026", "Jan 2026", "Des 2025", "Nov 2025"];

const DATA_KEUANGAN = {};

const BLN_LIST = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Ags","Sep","Okt","Nov","Des"];
const fmtRp    = (n) => n != null ? "Rp " + Math.abs(Number(n)).toLocaleString("id-ID") : "-";
const fmtRpFull= (n) => { if (n == null) return "-"; return (n < 0 ? "(Rp " : "Rp ") + Math.abs(n).toLocaleString("id-ID") + (n < 0 ? ")" : ""); };
const fmtPct   = (n) => (n != null ? n.toFixed(1) + "%" : "-");

// ============================================================
// CSS
// ============================================================
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  :root{
    --or:#f97316;--or-d:#ea580c;--or-pale:#fff7ed;--or-light:#ffedd5;--or-mid:#fed7aa;
    --s900:#0f172a;--s800:#1e293b;--s700:#334155;--s600:#475569;
    --s400:#94a3b8;--s200:#e2e8f0;--s100:#f1f5f9;--s50:#f8fafc;
    --white:#fff;--red:#dc2626;--green:#16a34a;--blue:#1d4ed8;
    --amber:#d97706;--teal:#0d9488;--purple:#7c3aed;
  }
  body{font-family:'Plus Jakarta Sans',sans-serif;background:var(--s50)}
  ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:var(--s200);border-radius:4px}

  /* ── TAB NAV ── */
  .tab-nav{display:flex;gap:0;background:var(--white);border:1px solid var(--s200);border-radius:12px;padding:4px;margin-bottom:20px}
  .tab-btn{flex:1;padding:9px 6px;border-radius:9px;border:none;font-family:'Plus Jakarta Sans',sans-serif;font-size:11px;font-weight:600;cursor:pointer;transition:all 0.15s;color:var(--s400);background:transparent;display:flex;align-items:center;justify-content:center;gap:5px;text-align:center}
  .tab-btn:hover{color:var(--s700)}
  .tab-btn.active{background:linear-gradient(135deg,var(--or),var(--or-d));color:#fff;box-shadow:0 2px 10px rgba(249,115,22,0.3)}

  /* ── TOPBAR ── */
  .topbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;flex-wrap:wrap;gap:10px}

  /* ── PERIODE SELECT ── */
  .periode-sel{background:var(--white);border:1.5px solid var(--s200);border-radius:9px;padding:8px 14px;font-size:13px;font-weight:700;color:var(--s800);font-family:'Plus Jakarta Sans',sans-serif;outline:none;cursor:pointer;transition:all 0.15s}
  .periode-sel:focus{border-color:var(--or)}

  /* ── KPI GRID ── */
  .kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px}
  .kpi-card{background:var(--white);border:1px solid var(--s200);border-radius:12px;padding:14px 16px;border-top:3px solid transparent;position:relative;overflow:hidden}
  .kpi-card::after{content:'';position:absolute;bottom:-20px;right:-20px;width:70px;height:70px;border-radius:50%;opacity:0.06}
  .kpi-label{font-size:10px;font-weight:700;color:var(--s400);text-transform:uppercase;letter-spacing:0.7px;margin-bottom:5px}
  .kpi-val{font-size:19px;font-weight:800;font-family:'JetBrains Mono',monospace;line-height:1.1}
  .kpi-sub{font-size:11px;color:var(--s400);margin-top:4px;display:flex;align-items:center;gap:4px}
  .kpi-trend{font-size:10px;font-weight:700;padding:1px 6px;border-radius:10px}

  /* ── LAPORAN CONTAINER ── */
  .laporan-wrap{background:var(--white);border:1px solid var(--s200);border-radius:14px;overflow:hidden;margin-bottom:20px}
  .lw-head{padding:16px 22px;border-bottom:1px solid var(--s100);display:flex;align-items:center;justify-content:space-between;background:linear-gradient(135deg,var(--s900) 0%,#1a0a00 100%)}
  .lw-title{font-size:14px;font-weight:800;color:#fff}
  .lw-sub{font-size:11px;color:rgba(255,255,255,0.45);margin-top:2px}
  .lw-badge{font-size:10px;font-weight:700;color:var(--or);background:rgba(249,115,22,0.15);border:1px solid rgba(249,115,22,0.3);border-radius:6px;padding:3px 9px}
  .lw-body{padding:0}

  /* ── REPORT ROWS ── */
  .rpt-section{border-bottom:1px solid var(--s100)}
  .rpt-section:last-child{border-bottom:none}
  .rpt-section-title{padding:10px 22px 6px;font-size:9px;font-weight:800;color:var(--s400);text-transform:uppercase;letter-spacing:1.2px;background:var(--s50);border-bottom:1px solid var(--s100)}
  .rpt-row{display:flex;align-items:center;padding:9px 22px;border-bottom:1px solid var(--s100);transition:background 0.1s}
  .rpt-row:last-child{border-bottom:none}
  .rpt-row:hover{background:var(--or-pale)}
  .rpt-row.indent{padding-left:40px}
  .rpt-row.indent2{padding-left:56px}
  .rpt-row.subtotal{background:var(--s50);border-top:1px solid var(--s200);border-bottom:1px solid var(--s200)}
  .rpt-row.total{background:linear-gradient(135deg,var(--s900),#1a0a00);border-top:2px solid var(--s800)}
  .rpt-row.total-positive{background:linear-gradient(135deg,#052e16,#14532d)}
  .rpt-row.total-negative{background:linear-gradient(135deg,#450a0a,#7f1d1d)}
  .rpt-label{flex:1;font-size:13px;font-weight:500;color:var(--s700)}
  .rpt-row.subtotal .rpt-label{font-weight:700;color:var(--s800)}
  .rpt-row.total .rpt-label,.rpt-row.total-positive .rpt-label,.rpt-row.total-negative .rpt-label{font-weight:800;color:rgba(255,255,255,0.85);font-size:13px}
  .rpt-curr{font-size:11px;color:var(--s400);margin-right:16px;font-weight:500;min-width:60px;text-align:right}
  .rpt-val{font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:700;min-width:130px;text-align:right}
  .rpt-row.subtotal .rpt-val{font-size:14px;font-weight:800}
  .rpt-row.total .rpt-val,.rpt-row.total-positive .rpt-val,.rpt-row.total-negative .rpt-val{font-size:15px;font-weight:800;color:#fff}
  .rpt-row.total-positive .rpt-val{color:#86efac}
  .rpt-row.total-negative .rpt-val{color:#fca5a5}
  .rpt-comp{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--s400);min-width:100px;text-align:right;margin-right:8px}
  .rpt-diff{font-size:10px;font-weight:700;padding:1px 6px;border-radius:8px;min-width:50px;text-align:center}

  /* ── RATIO GRID ── */
  .ratio-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px}
  .ratio-card{background:var(--white);border:1px solid var(--s200);border-radius:12px;padding:16px;text-align:center;position:relative;overflow:hidden}
  .ratio-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px}
  .ratio-name{font-size:11px;font-weight:700;color:var(--s400);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px}
  .ratio-val{font-size:28px;font-weight:800;font-family:'JetBrains Mono',monospace;line-height:1.1;margin-bottom:4px}
  .ratio-desc{font-size:11px;color:var(--s400);line-height:1.4}
  .ratio-benchmark{font-size:10px;font-weight:700;margin-top:6px;padding:2px 8px;border-radius:10px;display:inline-block}

  /* ── PLANNING VS REALISASI ── */
  .pvr-row{display:flex;align-items:center;gap:8px;padding:10px 16px;border-bottom:1px solid var(--s100)}
  .pvr-row:last-child{border-bottom:none}
  .pvr-label{font-size:12px;font-weight:600;color:var(--s800);flex:1}
  .pvr-plan{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:600;color:var(--s600);min-width:120px;text-align:right}
  .pvr-real{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;min-width:120px;text-align:right}
  .pvr-bar-wrap{width:80px;height:8px;background:var(--s100);border-radius:4px;overflow:hidden}
  .pvr-bar-fill{height:100%;border-radius:4px;transition:width 0.4s ease}

  /* ── CHART BARS (SVG-free simple bars) ── */
  .bar-chart{padding:12px 16px}
  .bar-row{display:flex;align-items:center;gap:10px;margin-bottom:8px}
  .bar-label{font-size:11px;font-weight:600;color:var(--s700);width:120px;flex-shrink:0;text-align:right}
  .bar-track{flex:1;height:22px;background:var(--s100);border-radius:6px;overflow:hidden;position:relative}
  .bar-fill{height:100%;border-radius:6px;display:flex;align-items:center;padding-left:8px;transition:width 0.5s ease}
  .bar-fill-val{font-size:10px;font-weight:700;color:#fff;white-space:nowrap}
  .bar-pct{font-size:11px;font-weight:700;color:var(--s400);width:36px;text-align:right;flex-shrink:0}

  /* ── MONTHLY TREND ── */
  .trend-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:8px;padding:14px 16px}
  .trend-col{text-align:center}
  .trend-bar-wrap{height:80px;display:flex;align-items:flex-end;justify-content:center;margin-bottom:6px;gap:3px}
  .trend-bar{width:16px;border-radius:3px 3px 0 0;transition:height 0.4s ease;cursor:pointer;position:relative}
  .trend-bar:hover::after{content:attr(data-val);position:absolute;bottom:100%;left:50%;transform:translateX(-50%);background:var(--s900);color:#fff;font-size:9px;padding:2px 5px;border-radius:4px;white-space:nowrap;margin-bottom:3px}
  .trend-month{font-size:10px;font-weight:700;color:var(--s400)}
  .trend-val{font-size:10px;font-weight:700;font-family:'JetBrains Mono',monospace;color:var(--s700)}

  /* ── WIDGET ── */
  .w{background:var(--white);border:1px solid var(--s200);border-radius:12px;overflow:hidden;margin-bottom:14px}
  .wh{padding:11px 16px;border-bottom:1px solid var(--s100);display:flex;align-items:center;justify-content:space-between}
  .wh-title{font-size:12px;font-weight:800;color:var(--s800);display:flex;align-items:center;gap:6px}

  /* ── BUTTONS ── */
  .btn-primary{background:linear-gradient(135deg,var(--or),var(--or-d));color:#fff;border:none;border-radius:8px;padding:8px 16px;font-size:12px;font-weight:700;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all 0.15s;box-shadow:0 2px 8px rgba(249,115,22,0.25);display:inline-flex;align-items:center;gap:6px}
  .btn-primary:hover{filter:brightness(1.05)}
  .btn-ghost{background:var(--s100);color:var(--s700);border:1px solid var(--s200);border-radius:8px;padding:8px 14px;font-size:12px;font-weight:600;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all 0.15s;display:inline-flex;align-items:center;gap:6px}
  .btn-ghost:hover{background:var(--s200)}

  /* ── BADGE ── */
  .badge{display:inline-flex;align-items:center;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700;white-space:nowrap}

  /* ── TOAST ── */
  .toaster{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--s900);color:#fff;padding:10px 22px;border-radius:30px;font-size:13px;font-weight:600;z-index:999;box-shadow:0 8px 24px rgba(0,0,0,0.3);animation:toastIn 0.25s ease}
  @keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  .fade-up{animation:fadeUp 0.25s ease forwards}

  /* ── GRID ── */
  .g2{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px}
  .g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-bottom:14px}
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
// COMPUTED HELPERS
// ============================================================
function computeLabaRugi(d) {
  const totalPendapatan = d.pendapatan.sewaKamar + d.pendapatan.lainLain;
  const totalBeban = Object.values(d.beban).reduce((s, v) => s + v, 0);
  const labaKotor = d.pendapatan.sewaKamar;  // sewa sebagai gross
  const labaBersih = totalPendapatan - totalBeban;
  return { totalPendapatan, totalBeban, labaKotor, labaBersih };
}

function computeNeraca(d) {
  const totalAset = Object.values(d.aset).reduce((s, v) => s + v, 0);
  const totalLiab = Object.values(d.liabilitas).reduce((s, v) => s + v, 0);
  const { labaBersih } = computeLabaRugi(d);
  const ekuitas = d.modalAwal + labaBersih - d.prive;
  return { totalAset, totalLiab, ekuitas };
}

function computeRatio(d) {
  const { totalPendapatan, totalBeban, labaBersih } = computeLabaRugi(d);
  const { totalAset, ekuitas } = computeNeraca(d);
  const npm = totalPendapatan ? (labaBersih / totalPendapatan) * 100 : 0;
  const roa = totalAset       ? (labaBersih / totalAset) * 100       : 0;
  const roe = ekuitas         ? (labaBersih / ekuitas) * 100         : 0;
  const bebanRatio = totalPendapatan ? (totalBeban / totalPendapatan) * 100 : 0;
  return { npm, roa, roe, bebanRatio };
}

// ============================================================
// REPORT ROW COMPONENT
// ============================================================
function RptRow({ label, val, type = "normal", indent = 0, compare = null, className = "" }) {
  const cls = ["rpt-row", type === "subtotal" ? "subtotal" : type === "total" ? "total" : type === "total-pos" ? "total-positive" : type === "total-neg" ? "total-negative" : "", indent === 1 ? "indent" : indent === 2 ? "indent2" : "", className].filter(Boolean).join(" ");
  const color = type === "total" || type === "total-pos" || type === "total-neg"
    ? "#fff"
    : val >= 0 ? "var(--s800)" : "var(--red)";

  const diff = compare != null ? val - compare : null;
  return (
    <div className={cls}>
      <div className="rpt-label">{label}</div>
      {compare != null && (
        <div className="rpt-comp">{fmtRp(compare)}</div>
      )}
      {diff != null && (
        <div className="rpt-diff" style={{
          color: diff >= 0 ? "var(--green)" : "var(--red)",
          background: diff >= 0 ? "#dcfce7" : "#fee2e2",
        }}>
          {diff >= 0 ? "▲" : "▼"}{Math.abs(Math.round(diff / (compare || 1) * 100))}%
        </div>
      )}
      <div className="rpt-curr">IDR</div>
      <div className="rpt-val" style={{ color: type.startsWith("total") ? undefined : val < 0 ? "var(--red)" : "var(--s800)" }}>
        {fmtRpFull(val)}
      </div>
    </div>
  );
}

// ============================================================
// TAB: LABA RUGI
// ============================================================
function TabLabaRugi({ data, prev, periode }) {
  const { totalPendapatan, totalBeban, labaBersih } = computeLabaRugi(data);
  const prevLR = prev ? computeLabaRugi(prev) : null;
  const mgmtFee = data.beban.mgmtFee;

  return (
    <div className="fade-up">
      <div className="laporan-wrap">
        <div className="lw-head">
          <div>
            <div className="lw-title">Laporan Laba Rugi</div>
            <div className="lw-sub">Income Statement · {periode} · Accrual Basis</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {prev && <div className="lw-badge">vs {PERIODE_LIST[1]}</div>}
            <button className="btn-ghost" style={{ fontSize: 11 }} onClick={() => alert("Ekspor PDF")}>🖨️ PDF</button>
          </div>
        </div>
        <div className="lw-body">
          {/* Pendapatan */}
          <div className="rpt-section-title">PENDAPATAN</div>
          <RptRow label="Pendapatan Sewa Kamar"    val={data.pendapatan.sewaKamar} indent={1} compare={prev?.pendapatan.sewaKamar} />
          <RptRow label="Pendapatan Lain-lain"      val={data.pendapatan.lainLain}  indent={1} compare={prev?.pendapatan.lainLain} />
          <RptRow label="TOTAL PENDAPATAN" val={totalPendapatan} type="subtotal" compare={prevLR?.totalPendapatan} />

          {/* Beban */}
          <div className="rpt-section-title">BEBAN OPERASIONAL</div>
          {[
            { key: "gaji",         label: "Gaji & Insentif Staff" },
            { key: "mgmtFee",      label: `Management Fee (22%)` },
            { key: "utilitas",     label: "Listrik, Air & Kebersihan" },
            { key: "internet",     label: "Internet (IndiHome)" },
            { key: "maintenance",  label: "Perbaikan & Maintenance" },
            { key: "perlengkapan", label: "Perlengkapan Operasional" },
            { key: "akomodasi",    label: "Transport & Akomodasi" },
          ].map(b => (
            <RptRow key={b.key} label={b.label} val={-data.beban[b.key]} indent={1} compare={prev ? -prev.beban[b.key] : null} />
          ))}

          <div className="rpt-section-title">BEBAN NON-OPERASIONAL</div>
          {[
            { key: "thr",        label: "Alokasi THR Saving" },
            { key: "tax",        label: "Tax Saving (0.5%)" },
            { key: "depresiasi", label: "Depresiasi Aset" },
          ].map(b => (
            <RptRow key={b.key} label={b.label} val={-data.beban[b.key]} indent={1} compare={prev ? -prev.beban[b.key] : null} />
          ))}

          <RptRow label="TOTAL BEBAN" val={-totalBeban} type="subtotal" compare={prevLR ? -prevLR.totalBeban : null} />

          {/* Laba bersih */}
          <RptRow
            label="LABA BERSIH PERIODE BERJALAN"
            val={labaBersih}
            type={labaBersih >= 0 ? "total-pos" : "total-neg"}
            compare={prevLR?.labaBersih}
          />

          {/* Catatan management fee */}
          <div style={{ padding: "10px 22px", background: "var(--or-pale)", borderTop: "1px solid var(--or-mid)", display: "flex", gap: 10 }}>
            <span style={{ fontSize: 16 }}>💡</span>
            <div style={{ fontSize: 12, color: "var(--or-dd)" }}>
              Management Fee <b>{fmtRp(mgmtFee)}</b> (22% dari omzet) sudah dipotong dari pendapatan dan dicatat sebagai beban.
              Dibayarkan bulanan ke manajemen.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// TAB: ARUS KAS
// ============================================================
function TabArusKas({ data, periode }) {
  const { labaBersih } = computeLabaRugi(data);
  const opAktivitas  = labaBersih + data.beban.depresiasi - data.piutang;
  const invAktivitas = 0;
  const finAktivitas = -data.prive;
  const netCash = opAktivitas + invAktivitas + finAktivitas;
  const kasAkhirCalc = data.kasAwal + netCash;

  return (
    <div className="fade-up">
      <div className="laporan-wrap">
        <div className="lw-head">
          <div>
            <div className="lw-title">Laporan Arus Kas</div>
            <div className="lw-sub">Cash Flow Statement · {periode} · Indirect Method</div>
          </div>
          <button className="btn-ghost" style={{ fontSize: 11 }} onClick={() => alert("Ekspor PDF")}>🖨️ PDF</button>
        </div>
        <div className="lw-body">

          {/* Aktivitas Operasi */}
          <div className="rpt-section-title">AKTIVITAS OPERASI</div>
          <RptRow label="Laba Bersih Periode Berjalan"   val={labaBersih} indent={1} />
          <RptRow label="Koreksi: Depresiasi Aset"        val={data.beban.depresiasi} indent={2} />
          <RptRow label="Koreksi: Kenaikan Piutang"       val={-data.piutang} indent={2} />
          <RptRow label="KAS BERSIH DARI AKTIVITAS OPERASI" val={opAktivitas} type="subtotal" />

          {/* Aktivitas Investasi */}
          <div className="rpt-section-title">AKTIVITAS INVESTASI</div>
          <RptRow label="Pembelian Aset Tetap" val={invAktivitas} indent={1} />
          <RptRow label="KAS BERSIH DARI AKTIVITAS INVESTASI" val={invAktivitas} type="subtotal" />

          {/* Aktivitas Pendanaan */}
          <div className="rpt-section-title">AKTIVITAS PENDANAAN</div>
          <RptRow label="Prive / Penarikan Pemilik" val={-data.prive} indent={1} />
          <RptRow label="KAS BERSIH DARI AKTIVITAS PENDANAAN" val={finAktivitas} type="subtotal" />

          {/* Net change */}
          <RptRow label="KENAIKAN (PENURUNAN) KAS BERSIH" val={netCash} type="subtotal" />
          <RptRow label="Saldo Kas Awal Periode"  val={data.kasAwal}     indent={1} />
          <RptRow label="SALDO KAS AKHIR PERIODE" val={kasAkhirCalc} type={kasAkhirCalc >= 0 ? "total-pos" : "total-neg"} />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// TAB: NERACA
// ============================================================
function TabNeraca({ data, periode }) {
  const { totalAset, totalLiab, ekuitas } = computeNeraca(data);
  const { labaBersih } = computeLabaRugi(data);
  const isBalance = Math.abs(totalAset - totalLiab - ekuitas) < 100;

  return (
    <div className="fade-up">
      <div className="laporan-wrap">
        <div className="lw-head">
          <div>
            <div className="lw-title">Neraca (Balance Sheet)</div>
            <div className="lw-sub">Posisi Keuangan · {periode}</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 11, color: isBalance ? "#86efac" : "#fca5a5", fontWeight: 700 }}>
              {isBalance ? "✓ Balance" : "⚠ Tidak Balance"}
            </span>
            <button className="btn-ghost" style={{ fontSize: 11 }}>🖨️ PDF</button>
          </div>
        </div>
        <div className="lw-body">

          {/* ASET */}
          <div className="rpt-section-title">ASET</div>
          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--s400)", padding: "6px 22px 2px", textTransform: "uppercase", letterSpacing: 0.8 }}>Aset Lancar</div>
          <RptRow label="Kas & Setara Kas (Bank)"   val={data.aset.kasBank}    indent={2} />
          <RptRow label="Piutang Usaha"              val={data.aset.piutang}    indent={2} />
          <RptRow label="Perlengkapan"               val={data.aset.perlengkapan} indent={2} />
          <RptRow label="Total Aset Lancar"          val={data.aset.kasBank + data.aset.piutang + data.aset.perlengkapan} type="subtotal" />

          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--s400)", padding: "6px 22px 2px", textTransform: "uppercase", letterSpacing: 0.8 }}>Aset Tidak Lancar</div>
          <RptRow label="Peralatan"                  val={data.aset.peralatan}     indent={2} />
          <RptRow label="Akumulasi Depresiasi"       val={data.aset.depAkum}       indent={2} />
          <RptRow label="Tanah & Bangunan"           val={data.aset.tanahBangunan} indent={2} />
          <RptRow label="Total Aset Tidak Lancar"    val={data.aset.peralatan + data.aset.depAkum + data.aset.tanahBangunan} type="subtotal" />
          <RptRow label="TOTAL ASET" val={totalAset} type="total" />

          {/* LIABILITAS */}
          <div className="rpt-section-title">LIABILITAS</div>
          <RptRow label="Hutang Usaha" val={data.liabilitas.hutangUsaha} indent={1} />
          <RptRow label="TOTAL LIABILITAS" val={totalLiab} type="subtotal" />

          {/* EKUITAS */}
          <div className="rpt-section-title">EKUITAS PEMILIK</div>
          <RptRow label="Modal Awal"                 val={data.modalAwal} indent={1} />
          <RptRow label="Laba Periode Berjalan"      val={labaBersih}     indent={1} />
          <RptRow label="Prive / Penarikan Pemilik"  val={-data.prive}    indent={1} />
          <RptRow label="TOTAL EKUITAS" val={ekuitas} type="subtotal" />
          <RptRow label="TOTAL LIABILITAS + EKUITAS" val={totalLiab + ekuitas} type={isBalance ? "total-pos" : "total-neg"} />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// TAB: PERUBAHAN MODAL
// ============================================================
function TabPerubahanModal({ data, periode }) {
  const { labaBersih } = computeLabaRugi(data);
  const { ekuitas } = computeNeraca(data);

  return (
    <div className="fade-up">
      <div className="laporan-wrap">
        <div className="lw-head">
          <div>
            <div className="lw-title">Laporan Perubahan Modal</div>
            <div className="lw-sub">Statement of Changes in Equity · {periode}</div>
          </div>
          <button className="btn-ghost" style={{ fontSize: 11 }}>🖨️ PDF</button>
        </div>
        <div className="lw-body">
          <RptRow label="Modal Awal Periode"             val={data.modalAwal} />
          <RptRow label="Laba Bersih Periode Berjalan"   val={labaBersih}     indent={1} />
          <RptRow label="Prive / Penarikan Pemilik"      val={-data.prive}    indent={1} />
          <RptRow label="Penambahan Modal Bersih"        val={labaBersih - data.prive} type="subtotal" />
          <RptRow label="MODAL AKHIR PERIODE"            val={ekuitas} type={ekuitas >= data.modalAwal ? "total-pos" : "total-neg"} />
        </div>
      </div>

      {/* Dividen / Prive info */}
      <div className="w">
        <div className="wh"><div className="wh-title">💰 Informasi Prive & Dividen</div></div>
        <div style={{ padding: "14px 16px" }}>
          <div style={{ background: "var(--or-pale)", border: "1px solid var(--or-mid)", borderRadius: 10, padding: "12px 14px", display: "flex", gap: 10 }}>
            <span style={{ fontSize: 18 }}>📋</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--or-dd)", marginBottom: 3 }}>Prive / Dividen Pemilik</div>
              <div style={{ fontSize: 12, color: "var(--s600)", lineHeight: 1.6 }}>
                Berdasarkan kesepakatan, prive/dividen pemilik dianggarkan tiap bulan namun <b>dibayarkan sekali di akhir tahun</b>.
                Saldo akumulasi prive tahun berjalan: <b style={{ color: "var(--or-d)" }}>Rp 0</b> (belum ada penarikan Feb 2026).
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// TAB: PERFORMANCE & RATIO
// ============================================================
function TabPerformance({ data, prev, periode }) {
  const { totalPendapatan, totalBeban, labaBersih } = computeLabaRugi(data);
  const { totalAset, ekuitas } = computeNeraca(data);
  const { npm, roa, roe, bebanRatio } = computeRatio(data);
  const prevRatio = prev ? computeRatio(prev) : null;

  // Planning vs realisasi (mock planning)
  const PLANNING = {
    pendapatan: 22000000,
    bebanGaji:   3900000,
    maintenance: 1500000,
    utilitas:     900000,
    labaBersih:  7000000,
  };

  const TREND = [
    { bln: "Sep", masuk: 18500000, keluar: 14200000 },
    { bln: "Okt", masuk: 19200000, keluar: 14800000 },
    { bln: "Nov", masuk: 19800000, keluar: 15100000 },
    { bln: "Des", masuk: 20500000, keluar: 15600000 },
    { bln: "Jan", masuk: 19800000, keluar: 14923357 },
    { bln: "Feb", masuk: 21968860, keluar: 17031467 },
  ];

  const maxVal = Math.max(...TREND.map(t => Math.max(t.masuk, t.keluar)));

  const ratioCards = [
    {
      nama: "Net Profit Margin",
      val: npm, unit: "%", fmt: fmtPct,
      desc: "Laba bersih dibanding pendapatan",
      benchmark: npm >= 20 ? "Baik (≥20%)" : npm >= 10 ? "Cukup (≥10%)" : "Perlu Ditingkatkan",
      benchmarkColor: npm >= 20 ? "var(--green)" : npm >= 10 ? "var(--amber)" : "var(--red)",
      topColor: npm >= 20 ? "var(--green)" : npm >= 10 ? "var(--amber)" : "var(--red)",
      prevVal: prevRatio?.npm,
    },
    {
      nama: "Return on Assets",
      val: roa, unit: "%", fmt: fmtPct,
      desc: "Laba bersih dibanding total aset",
      benchmark: roa >= 5 ? "Baik (≥5%)" : "Cukup",
      benchmarkColor: roa >= 5 ? "var(--green)" : "var(--amber)",
      topColor: roa >= 5 ? "var(--green)" : "var(--amber)",
      prevVal: prevRatio?.roa,
    },
    {
      nama: "Return on Equity",
      val: roe, unit: "%", fmt: fmtPct,
      desc: "Laba bersih dibanding ekuitas pemilik",
      benchmark: roe >= 10 ? "Baik (≥10%)" : "Cukup",
      benchmarkColor: roe >= 10 ? "var(--green)" : "var(--amber)",
      topColor: roe >= 10 ? "var(--green)" : "var(--amber)",
      prevVal: prevRatio?.roe,
    },
    {
      nama: "Rasio Beban",
      val: bebanRatio, unit: "%", fmt: fmtPct,
      desc: "Total beban dibanding pendapatan",
      benchmark: bebanRatio <= 70 ? "Efisien (≤70%)" : "Perlu Efisiensi",
      benchmarkColor: bebanRatio <= 70 ? "var(--green)" : "var(--red)",
      topColor: bebanRatio <= 70 ? "var(--green)" : "var(--red)",
      prevVal: prevRatio?.bebanRatio,
    },
    {
      nama: "Okupansi",
      val: 66.7, unit: "%", fmt: fmtPct,
      desc: "8 dari 12 kamar terisi",
      benchmark: "66.7% (8/12 kamar)",
      benchmarkColor: "var(--amber)",
      topColor: "var(--amber)",
      prevVal: 58.3,
    },
    {
      nama: "Rata-rata Sewa",
      val: totalPendapatan / 8, unit: "Rp", fmt: (v) => fmtRp(Math.round(v)),
      desc: "Pendapatan per kamar terisi",
      benchmark: "vs target Rp 2.250.000",
      benchmarkColor: "var(--blue)",
      topColor: "var(--blue)",
      prevVal: 19800000 / 7,
    },
  ];

  return (
    <div className="fade-up">
      {/* Ratio Cards */}
      <div className="ratio-grid">
        {ratioCards.map(r => {
          const diff = r.prevVal != null ? r.val - r.prevVal : null;
          return (
            <div key={r.nama} className="ratio-card" style={{ "--top-color": r.topColor }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: r.topColor, borderRadius: "12px 12px 0 0" }} />
              <div className="ratio-name">{r.nama}</div>
              <div className="ratio-val" style={{ color: r.topColor }}>{r.fmt(r.val)}</div>
              {diff != null && (
                <div style={{ fontSize: 10, fontWeight: 700, color: diff >= 0 ? "var(--green)" : "var(--red)", marginBottom: 2 }}>
                  {diff >= 0 ? "▲" : "▼"} {Math.abs(r.fmt(Math.abs(diff)))} vs bulan lalu
                </div>
              )}
              <div className="ratio-desc">{r.desc}</div>
              <div className="ratio-benchmark" style={{ color: r.benchmarkColor, background: r.benchmarkColor + "18" }}>
                {r.benchmark}
              </div>
            </div>
          );
        })}
      </div>

      <div className="g2">
        {/* Planning vs Realisasi */}
        <div className="w">
          <div className="wh">
            <div className="wh-title">🎯 Planning vs Realisasi</div>
            <span style={{ fontSize: 11, color: "var(--s400)" }}>Feb 2026</span>
          </div>
          {[
            { label: "Pendapatan",   plan: PLANNING.pendapatan,   real: totalPendapatan },
            { label: "Beban Gaji",   plan: PLANNING.bebanGaji,    real: data.beban.gaji },
            { label: "Maintenance",  plan: PLANNING.maintenance,  real: data.beban.maintenance },
            { label: "Utilitas",     plan: PLANNING.utilitas,     real: data.beban.utilitas },
            { label: "Laba Bersih",  plan: PLANNING.labaBersih,   real: labaBersih },
          ].map(r => {
            const pct = Math.round((r.real / r.plan) * 100);
            const isGood = r.label === "Laba Bersih" || r.label === "Pendapatan" ? pct >= 100 : pct <= 100;
            return (
              <div key={r.label} className="pvr-row">
                <div className="pvr-label">{r.label}</div>
                <div className="pvr-plan" style={{ fontSize: 11, color: "var(--s400)" }}>{fmtRp(r.plan)}</div>
                <div className="pvr-real" style={{ color: isGood ? "var(--green)" : "var(--red)" }}>{fmtRp(r.real)}</div>
                <div className="pvr-bar-wrap">
                  <div className="pvr-bar-fill" style={{ width: Math.min(pct, 100) + "%", background: isGood ? "var(--green)" : "var(--red)" }} />
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: isGood ? "var(--green)" : "var(--red)", width: 38, textAlign: "right", flexShrink: 0 }}>
                  {pct}%
                </div>
              </div>
            );
          })}
        </div>

        {/* Trend 6 bulan */}
        <div className="w">
          <div className="wh">
            <div className="wh-title">📈 Tren 6 Bulan Terakhir</div>
            <div style={{ display: "flex", gap: 10, fontSize: 10, color: "var(--s400)", fontWeight: 600 }}>
              <span>■ <span style={{ color: "var(--green)" }}>Masuk</span></span>
              <span>■ <span style={{ color: "var(--red)" }}>Keluar</span></span>
            </div>
          </div>
          <div className="trend-grid">
            {TREND.map(t => {
              const hM = Math.round((t.masuk / maxVal) * 80);
              const hK = Math.round((t.keluar / maxVal) * 80);
              return (
                <div key={t.bln} className="trend-col">
                  <div className="trend-bar-wrap">
                    <div className="trend-bar"
                      data-val={fmtRp(t.masuk)}
                      style={{ height: hM, background: "var(--green)", opacity: 0.8 }} />
                    <div className="trend-bar"
                      data-val={fmtRp(t.keluar)}
                      style={{ height: hK, background: "var(--red)", opacity: 0.8 }} />
                  </div>
                  <div className="trend-month">{t.bln}</div>
                  <div className="trend-val" style={{ color: "var(--green)", fontSize: 9 }}>
                    {Math.round(t.masuk / 1000000 * 10) / 10}M
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Breakdown Beban */}
      <div className="w">
        <div className="wh"><div className="wh-title">📊 Komposisi Beban Operasional</div></div>
        <div className="bar-chart">
          {[
            { label: "Mgmt Fee",     val: data.beban.mgmtFee,      color: "var(--purple)" },
            { label: "Gaji & Insentif", val: data.beban.gaji,      color: "var(--blue)" },
            { label: "Maintenance",  val: data.beban.maintenance,   color: "var(--amber)" },
            { label: "THR Saving",   val: data.beban.thr,           color: "var(--or)" },
            { label: "Depresiasi",   val: data.beban.depresiasi,    color: "var(--teal)" },
            { label: "Utilitas",     val: data.beban.utilitas,      color: "var(--green)" },
            { label: "Internet",     val: data.beban.internet,      color: "#0ea5e9" },
            { label: "Perlengkapan", val: data.beban.perlengkapan,  color: "#8b5cf6" },
          ].map(b => {
            const pct = Math.round((b.val / totalBeban) * 100);
            return (
              <div key={b.label} className="bar-row">
                <div className="bar-label">{b.label}</div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: pct + "%", background: b.color }}>
                    <span className="bar-fill-val">{fmtRp(b.val)}</span>
                  </div>
                </div>
                <div className="bar-pct">{pct}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN MODULE
// ============================================================
export default function LaporanKeuangan({ userRole = "admin" }) {
  const [activeTab, setActiveTab] = useState("labarugi");
  const [periode, setPeriode] = useState("Feb 2026");
  const [toast, setToast] = useState(null);

  const data = DATA_KEUANGAN[periode] || DATA_KEUANGAN["Feb 2026"];
  const prevPeriode = PERIODE_LIST[PERIODE_LIST.indexOf(periode) + 1];
  const prev = prevPeriode ? DATA_KEUANGAN[prevPeriode] : null;

  const { totalPendapatan, labaBersih } = computeLabaRugi(data);
  const prevLR = prev ? computeLabaRugi(prev) : null;
  const growth = prevLR ? ((labaBersih - prevLR.labaBersih) / Math.abs(prevLR.labaBersih) * 100).toFixed(1) : null;

  const TABS = [
    { id: "labarugi",  icon: "📊", label: "Laba Rugi" },
    { id: "aruskas",   icon: "💧", label: "Arus Kas" },
    { id: "neraca",    icon: "⚖️",  label: "Neraca" },
    { id: "modal",     icon: "🏦", label: "Perubahan Modal" },
    { id: "perf",      icon: "🎯", label: "Performance" },
  ];

  return (
    <div className="fade-up">
      <StyleInjector />

      {/* TOPBAR */}
      <div className="topbar">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--s400)", textTransform: "uppercase", letterSpacing: 1 }}>
            Laporan Keuangan
          </div>
          <select className="periode-sel" value={periode} onChange={e => setPeriode(e.target.value)}>
            {PERIODE_LIST.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
        <button className="btn-primary" onClick={() => setToast("📦 Semua laporan diekspor sebagai ZIP PDF")}>
          📦 Export Semua Laporan
        </button>
      </div>

      {/* KPI HEADER */}
      <div className="kpi-grid">
        {[
          {
            label: "Total Pendapatan", val: fmtRp(totalPendapatan), color: "var(--or)",
            sub: prev ? `vs ${fmtRp(prevLR.totalPendapatan)} bulan lalu` : "Periode ini",
            trend: prev ? ((totalPendapatan - prevLR.totalPendapatan) / prevLR.totalPendapatan * 100).toFixed(1) : null,
            borderColor: "var(--or)",
          },
          {
            label: "Laba Bersih", val: fmtRp(labaBersih), color: labaBersih >= 0 ? "var(--green)" : "var(--red)",
            sub: growth ? `${growth > 0 ? "▲" : "▼"} ${Math.abs(growth)}% vs bulan lalu` : "-",
            trend: growth, borderColor: labaBersih >= 0 ? "var(--green)" : "var(--red)",
          },
          {
            label: "Kas & Bank", val: fmtRp(data.aset.kasBank), color: "var(--blue)",
            sub: `Saldo akhir ${periode}`, borderColor: "var(--blue)",
          },
          {
            label: "Piutang Belum Tertagih", val: fmtRp(data.piutang), color: "var(--red)",
            sub: "Outstanding receivable", borderColor: "var(--red)",
          },
        ].map(k => (
          <div key={k.label} className="kpi-card" style={{ borderTopColor: k.borderColor }}>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-val" style={{ color: k.color, fontSize: 16 }}>{k.val}</div>
            <div className="kpi-sub">
              <span>{k.sub}</span>
              {k.trend != null && (
                <span className="kpi-trend" style={{
                  color: Number(k.trend) >= 0 ? "var(--green)" : "var(--red)",
                  background: Number(k.trend) >= 0 ? "#dcfce7" : "#fee2e2",
                }}>
                  {Number(k.trend) >= 0 ? "▲" : "▼"}{Math.abs(k.trend)}%
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* TAB NAV */}
      <div className="tab-nav">
        {TABS.map(t => (
          <button key={t.id} className={`tab-btn ${activeTab === t.id ? "active" : ""}`} onClick={() => setActiveTab(t.id)}>
            <span>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {activeTab === "labarugi" && <TabLabaRugi data={data} prev={prev} periode={periode} />}
      {activeTab === "aruskas"  && <TabArusKas  data={data} periode={periode} />}
      {activeTab === "neraca"   && <TabNeraca   data={data} periode={periode} />}
      {activeTab === "modal"    && <TabPerubahanModal data={data} periode={periode} />}
      {activeTab === "perf"     && <TabPerformance data={data} prev={prev} periode={periode} />}

      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
