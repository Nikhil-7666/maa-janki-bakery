import React, { useState, useEffect, useRef } from "react";

// ─── STATIC MOCK DATA ─────────────────────────────────────────────────────────

const PRODUCTS = [
  // ── Bakery ──────────────────────────────────────────────────────────────────
  { id: 1,  name: "Wheat Khari",   category: "Bakery", price: 65, weight: "250gm", sold: 142, stock: 38, area: "Mharal"      },
  { id: 2,  name: "Jeera Khari",   category: "Bakery", price: 65, weight: "250gm", sold: 118, stock: 45, area: "Ulhasanagar" },
  { id: 3,  name: "Wheat Toast",   category: "Bakery", price: 65, weight: "250gm", sold: 95,  stock: 30, area: "Varap"       },
  { id: 4,  name: "Butter Khari",  category: "Bakery", price: 65, weight: "250gm", sold: 130, stock: 22, area: "Mharal"      },
  { id: 5,  name: "Wheat Butter",  category: "Bakery", price: 65, weight: "250gm", sold: 87,  stock: 55, area: "Varap"       },
  { id: 6,  name: "Jeera Butter",  category: "Bakery", price: 65, weight: "250gm", sold: 104, stock: 40, area: "Ulhasanagar" },
  // ── Farsan ──────────────────────────────────────────────────────────────────
  { id: 7,  name: "Khatta Meetha", category: "Farsan", price: 65, weight: "250gm", sold: 160, stock: 28, area: "Mharal"      },
  { id: 8,  name: "Kolhapuri Mix", category: "Farsan", price: 65, weight: "250gm", sold: 135, stock: 34, area: "Ulhasanagar" },
  { id: 9,  name: "Lasun Chiwda",  category: "Farsan", price: 65, weight: "250gm", sold: 112, stock: 42, area: "Varap"       },
  { id: 10, name: "Misal Mix",     category: "Farsan", price: 65, weight: "250gm", sold: 78,  stock: 19, area: "Mharal"      },
  { id: 11, name: "Bhavnagri",     category: "Farsan", price: 65, weight: "250gm", sold: 65,  stock: 50, area: "Varap"       },
  { id: 12, name: "Besan Papdi",   category: "Farsan", price: 65, weight: "250gm", sold: 90,  stock: 15, area: "Ulhasanagar" },
  { id: 13, name: "Golden Mix",    category: "Farsan", price: 65, weight: "250gm", sold: 148, stock: 36, area: "Mharal"      },
];

// ── Areas ─────────────────────────────────────────────────────────────────────
const AREAS = ["Mharal", "Ulhasanagar", "Varap"];

// ── Area proportion helper ────────────────────────────────────────────────────
const areaProportion = (a) =>
  a === "Mharal" ? 0.45 : a === "Ulhasanagar" ? 0.35 : 0.20;

// ── Area-product sales map (auto-derived from PRODUCTS) ───────────────────────
// Each row: { p: productName, Mharal: N, Ulhasanagar: N, Varap: N }
const AREA_SALES = PRODUCTS.map((p) => {
  const row = { p: p.name };
  AREAS.forEach((a) => {
    row[a] = p.area === a ? p.sold : Math.round(p.sold * areaProportion(a));
  });
  return row;
});

// ── Demand trends ─────────────────────────────────────────────────────────────
const DEMAND_TRENDS = {
  normal: [
    { p: "Khatta Meetha",  d: 90 },
    { p: "Golden Mix",     d: 82 },
    { p: "Wheat Khari",    d: 78 },
    { p: "Butter Khari",   d: 72 },
    { p: "Kolhapuri Mix",  d: 68 },
    { p: "Jeera Khari",    d: 62 },
    { p: "Lasun Chiwda",   d: 58 },
  ],
  festive: [
    { p: "Khatta Meetha",  d: 98 },
    { p: "Golden Mix",     d: 95 },
    { p: "Kolhapuri Mix",  d: 90 },
    { p: "Bhavnagri",      d: 85 },
    { p: "Misal Mix",      d: 80 },
    { p: "Wheat Khari",    d: 75 },
    { p: "Besan Papdi",    d: 70 },
  ],
};

// ─── COMPUTED AGGREGATES ──────────────────────────────────────────────────────

const COST_RATIO    = 0.45;
const totalRevenue  = PRODUCTS.reduce((s, p) => s + p.price * p.sold, 0);
const totalStock    = PRODUCTS.reduce((s, p) => s + p.stock, 0);
const totalSold     = PRODUCTS.reduce((s, p) => s + p.sold, 0);
const grossProfit   = PRODUCTS.reduce((s, p) => s + (p.price - p.price * COST_RATIO) * p.sold, 0);
const avgOrderValue = Math.round(totalRevenue / totalSold);
const marginPct     = Math.round((grossProfit / totalRevenue) * 100);

const maxSold   = Math.max(...PRODUCTS.map((p) => p.sold));
const minSold   = Math.min(...PRODUCTS.map((p) => p.sold));
const mostSold  = PRODUCTS.find((p) => p.sold === maxSold);
const leastSold = PRODUCTS.find((p) => p.sold === minSold);

// ── Area-level totals ─────────────────────────────────────────────────────────
const areaTotals = AREAS.map((a) => ({
  area: a,
  total: PRODUCTS.reduce(
    (s, p) => s + (p.area === a ? p.sold : Math.round(p.sold * areaProportion(a))),
    0
  ),
})).sort((a, b) => b.total - a.total);

const topArea    = areaTotals[0];
const bottomArea = areaTotals[areaTotals.length - 1];

// ── Category breakdown ────────────────────────────────────────────────────────
const bakeryProducts = PRODUCTS.filter((p) => p.category === "Bakery");
const farsanProducts = PRODUCTS.filter((p) => p.category === "Farsan");
const bakerySold     = bakeryProducts.reduce((s, p) => s + p.sold, 0);
const farsanSold     = farsanProducts.reduce((s, p) => s + p.sold, 0);

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────

const C = {
  bg: "#0f172a",
  sidebar: "#020617",
  card: "#1e293b",
  primary: "#f97316",
  amber: "#f59e0b",
  green: "#22c55e",
  danger: "#ef4444",
  purple: "#a855f7",
  blue: "#3b82f6",
  text: "#f8fafc",
  muted: "#94a3b8",
  border: "#334155",
  barBg: "#1e293b",
};


const AREA_COLORS = [C.primary, C.amber, C.green];

// ─── UTILS ────────────────────────────────────────────────────────────────────

const fmt   = (n) => `₹${n.toLocaleString("en-IN")}`;
const today = new Date().toLocaleDateString("en-IN", {
  weekday: "long", year: "numeric", month: "long", day: "numeric",
});

// ─── ATOMS ───────────────────────────────────────────────────────────────────

function Tag({ text, color, bg }) {
  return (
    <span style={{
      background: bg, color, borderRadius: 20,
      padding: "3px 10px", fontSize: 10, fontWeight: 800, letterSpacing: "0.07em",
    }}>
      {text}
    </span>
  );
}

function Btn({ children, onClick, variant = "primary", full }) {
  const base = {
    border: "none", borderRadius: 10, padding: "10px 22px", fontWeight: 700,
    fontSize: 13, cursor: "pointer", width: full ? "100%" : "auto",
    fontFamily: "'DM Sans', sans-serif", transition: "opacity 0.15s",
  };
  const styles = {
    primary: { ...base, background: C.primary, color: "#fff" },
    amber:   { ...base, background: C.amber,   color: "#fff" },
    ghost:   { ...base, background: C.bg, color: C.muted, border: `1px solid ${C.border}` },
  };
  return <button style={styles[variant]} onClick={onClick}>{children}</button>;
}

function KPICard({ icon, label, value, sub, valueColor }) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #1e293b, #111827)",
        borderRadius: 16,
        padding: "22px 26px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
        border: `1px solid ${C.border}`,
        flex: 1,
        minWidth: 170,
        transition: "all 0.2s ease",
      }}
    >
      <div style={{ fontSize: 26, marginBottom: 8 }}>{icon}</div>

      <div
        style={{
          color: C.muted,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: 4,
        }}
      >
        {label}
      </div>

      <div
        style={{
          color: valueColor || C.text,
          fontSize: 26,
          fontWeight: 800,
          fontFamily: "'Lora', serif",
        }}
      >
        {value}
      </div>

      {sub && (
        <div
          style={{
            color: C.muted,
            fontSize: 12,
            marginTop: 5,
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}


function Section({ id, icon, title, children, reff }) {
  return (
    <div
      id={id}
      ref={reff}
      style={{
        background: C.card,
        borderRadius: 20,
        padding: "28px 32px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
        border: `1px solid ${C.border}`,
        marginBottom: 24,
        transition: "all 0.2s ease",
      }}
    >
      <h2
        style={{
          margin: "0 0 22px",
          fontFamily: "'Lora', serif",
          color: C.text,
          fontSize: 18,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span>{icon}</span>
        {title}
      </h2>
      {children}
    </div>
  );
}


function BarRow({ label, value, max, color = C.primary, prefix = "", sublabel = "" }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div style={{ marginBottom: 13 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, alignItems: "baseline" }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color }}>
          {prefix}{value.toLocaleString("en-IN")}
          {sublabel && <span style={{ fontSize: 11, color: C.muted, fontWeight: 400 }}> {sublabel}</span>}
        </span>
      </div>
      <div style={{ height: 8, background: C.barBg, borderRadius: 8, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 8, transition: "width 1s cubic-bezier(0.4,0,0.2,1)" }} />
      </div>
    </div>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────

const NAV = [
  { icon: "📊", label: "Dashboard",   active: true  },
  { icon: "📦", label: "Inventory",   active: false },
  { icon: "💰", label: "Revenue",     active: false },
  { icon: "🧠", label: "ML Insights", active: false },
  { icon: "📣", label: "Promotions",  active: false },
  { icon: "⚙️", label: "Settings",    active: false },
];

function Sidebar({ scrollTo, inventoryRef, salesRef, mlRef, promoRef }) {
  return (
   <aside
  style={{
    width: "220px",
    background: C.sidebar,
    minHeight: "100vh",
    borderRight: "1px solid #334155",
    display: "flex",
    flexDirection: "column",
    marginLeft: "0px",   // ✅ ADD
    paddingLeft: "0px"   // ✅ ADD
  }}
>
      <nav style={{ flex: 1, paddingTop: 12 }}>
        {NAV.map((item) => (
          <div
         onClick={() => {
  if (item.label === "Inventory") scrollTo(inventoryRef);
  if (item.label === "Revenue") scrollTo(salesRef);
  if (item.label === "ML Insights") scrollTo(mlRef);
  if (item.label === "Promotions") scrollTo(promoRef);
}}
            key={item.label}
            style={{
              padding: "11px 18px",
              display: "flex",
              alignItems: "center",
              gap: 13,
              color: item.active ? "#FBBF24" : "#C8A882",
              fontSize: 18,
              fontWeight: item.active ? 700 : 500,
              background: item.active ? "#3D1A00" : "transparent",
              borderLeft: `3px solid ${item.active ? "#FBBF24" : "transparent"}`,
              cursor: "pointer"
            }}
          >
            <span>{item.icon}</span>
            {item.label}
          </div>
        ))}
      </nav>

      <div style={{ padding: "20px 24px", borderTop: "1px solid #3D1A00" }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "#3D1A00",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            marginBottom: 8
          }}
        >
          👨‍🍳
        </div>
        <div style={{ color: "#FFF8F0", fontSize: 15, fontWeight: 700 }}>
          Shriram Nalawade
        </div>
        <div style={{ color: "#7C5C4A", fontSize: 12, marginTop: 2 }}>
          Super Admin
        </div>
      </div>
    </aside>
  );
}

// ─── MAIN DASHBOARD ──────────────────────────────────────────────────────────

export default function BakeSmartAdmin() {
  const [salesExpanded,   setSalesExpanded]   = useState(false);
  const [revenueExpanded, setRevenueExpanded] = useState(false);
  const [trendMode,       setTrendMode]       = useState("normal");
  const [activeArea,      setActiveArea]      = useState("Mharal");
  const [invFilter,       setInvFilter]       = useState("All");
  const inventoryRef = useRef(null);
  const salesRef = useRef(null);
  const mlRef = useRef(null);
  const promoRef = useRef(null);

  const detailedSalesRef = useRef(null);
  const revenueDetailRef = useRef(null);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel  = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Lora:wght@600;700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

 const scrollTo = (ref) => {
  if (ref && ref.current) {
    ref.current.scrollIntoView({ behavior: "smooth" });
  }
};
  // Revenue sorted by total revenue descending
  const revSorted = [...PRODUCTS].sort((a, b) => b.price * b.sold - a.price * a.sold);
  const revMax    = revSorted[0].price * revSorted[0].sold;

 return (
  <div
    style={{
      fontFamily: "'DM Sans', sans-serif",
      background: C.bg,
      minHeight: "100vh",
      display: "flex",
     
      
    }}
>
    {/* Sidebar */}
    <Sidebar 
  scrollTo={scrollTo} 
  inventoryRef={inventoryRef} 
  salesRef={salesRef}
  mlRef={mlRef}
  promoRef={promoRef}
/>
    <main
      style={{
        flex: 1,
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh"
    ,alignItems: "stretch",
      

    

      }}
    >


<div style={{ flex: 1 }}>

        {/* ── PAGE HEADER ──────────────────────────────────────────────────── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 30, marginLeft: "-6px", }}>
          <div>
            <h1 style={{ fontFamily: "'Lora', serif", color: C.text, fontSize: 30, fontWeight: 800, margin: 0 }}>
              Admin Dashboard
            </h1>
            <p style={{ color: C.muted, fontSize: 13, margin: "5px 0 0", fontWeight: 500 }}>
              BakeSmart · {today}
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn variant="primary">+ Add Product</Btn>
            <Btn variant="ghost">⬇ Export Report</Btn>
          </div>
        </div>

        {/* ── KPI STRIP ────────────────────────────────────────────────────── */}
        <div style={{ display: "flex", gap: 18, marginBottom: 26, flexWrap: "wrap" }}>
          <KPICard icon="📦" label="Total Products"  value={PRODUCTS.length}                sub="Active SKUs"                           />
          <KPICard icon="🏪" label="Total Stock"     value={totalStock.toLocaleString()}    sub="Units available"                      />
          <KPICard icon="🛒" label="Units Sold"      value={totalSold.toLocaleString()}     sub="This month"  valueColor={C.primary}   />
          <KPICard icon="💰" label="Gross Revenue"   value={fmt(totalRevenue)}              sub={`Profit: ${fmt(Math.round(grossProfit))}`} valueColor={C.green} />
          <KPICard icon="📈" label="Avg Order Value" value={fmt(avgOrderValue)}             sub={`Margin: ${marginPct}%`} valueColor={C.blue} />
        </div>

        {/* ── INVENTORY + SALES OVERVIEW ───────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>

          {/* ── Inventory ── */}
          <Section icon="📦" title="Inventory Overview">
            {/* Category Filter Pills */}
            <div ref={inventoryRef} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {["All", "Bakery", "Farsan"].map((cat) => (
                <button key={cat} onClick={() => setInvFilter(cat)} style={{
                  padding: "5px 14px", borderRadius: 20,
                  border: `1px solid ${invFilter === cat ? C.primary : C.border}`,
                  background: invFilter === cat ? C.primary : C.bg,
                  color: invFilter === cat ? "#fff" : C.muted,
                  fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                }}>
                  {cat}
                </button>
              ))}
            </div>

            {PRODUCTS
              .filter((p) => invFilter === "All" || p.category === invFilter)
              .map((p) => {
                const low = p.stock < 25;
                return (
                  <div key={p.id} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "10px 14px",
                    background: low ? "rgba(239, 68, 68, 0.12)" : C.card,
                    border: `1px solid ${low ? "rgba(239, 68, 68, 0.4)" : C.border}`,
                    borderRadius: 10,
                    marginBottom: 7,
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: C.text }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>
                        {p.category} · {p.weight} · {fmt(p.price)} · {p.area}
                      </div>
                    </div>
                    <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                      <div style={{ fontWeight: 800, fontSize: 16, color: low ? C.danger : C.green }}>
                        {p.stock} units
                      </div>
                      {low
                        ? <Tag text="LOW STOCK" color="#fecaca" bg="rgba(239,68,68,0.2)" />
                        : <Tag text="OK" color="#bbf7d0" bg="rgba(34,197,94,0.2)" />}
                    </div>
                  </div>
                );
              })}
          </Section>

          {/* ── Sales Overview ── */}
          <Section icon="🛒" title="Sales Overview">
            {PRODUCTS.map((p) => (
              <BarRow key={p.id} label={p.name} value={p.sold} max={maxSold} sublabel="units" />
            ))}
            <div  ref={salesRef} style={{ marginTop: 20 }}>
              <Btn full variant="primary" onClick={() => { setSalesExpanded(true); scrollTo(detailedSalesRef); }}>
                📋 View Detailed Sales →
              </Btn>
            </div>
          </Section>
        </div>

        {/* ── DETAILED SALES (expandable) ──────────────────────────────────── */}
        {salesExpanded && (
          <Section reff={detailedSalesRef} icon="📋" title="Detailed Sales Breakdown">
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                 <tr style={{ background: "#020617" }}>
  {["Product", "Category", "Weight", "Area", "Price", "Sold", "Revenue", "Profit/Unit", "Total Profit", "Status"].map((h) => (
    <th
      key={h}
      style={{
        padding: "10px 14px",
        textAlign: "left",
        color: "#94a3b8",
        fontWeight: 700,
        fontSize: 11,
        letterSpacing: "0.07em",
        borderBottom: "2px solid #334155",
        whiteSpace: "nowrap",
      }}
    >
      {h.toUpperCase()}
    </th>
  ))}
</tr>
                </thead>
                <tbody>
                  {PRODUCTS.map((p, i) => {
                    const costPerUnit = Math.round(p.price * COST_RATIO);
                    const profitUnit  = p.price - costPerUnit;
                    const rev         = p.price * p.sold;
                    const totalProfit = profitUnit * p.sold;
                    const hot         = p.sold >= 130;
                    const good        = p.sold >= 90;
                    return (
                      <tr key={p.id} style={{ background: i % 2 === 0 ?"#1e293b" : "#0f172a",
    color: "#f8fafc"}}>
                        <td style={{ padding: "12px 14px", fontWeight: 700, color: C.text }}>{p.name}</td>
                        <td style={{ padding: "12px 14px", color: C.muted }}>{p.category}</td>
                        <td style={{ padding: "12px 14px", color: C.muted }}>{p.weight}</td>
                        <td style={{ padding: "12px 14px", color: C.muted }}>{p.area}</td>
                        <td style={{ padding: "12px 14px", fontWeight: 600 }}>{fmt(p.price)}</td>
                        <td style={{ padding: "12px 14px", fontWeight: 700, color: C.primary }}>{p.sold}</td>
                        <td style={{ padding: "12px 14px", fontWeight: 700 }}>{fmt(rev)}</td>
                        <td style={{ padding: "12px 14px", color: C.green, fontWeight: 600 }}>₹{profitUnit}</td>
                        <td style={{ padding: "12px 14px", color: C.green, fontWeight: 700 }}>{fmt(totalProfit)}</td>
                        <td style={{ padding: "12px 14px" }}>
                          <Tag
                            text={hot ? "🔥 HOT" : good ? "✅ GOOD" : "⚠️ SLOW"}
                            color={hot ? "#92400E" : good ? "#065F46" : "#92400E"}
                            bg={hot ? "#FEF3C7" : good ? "#D1FAE5" : "#FEE2E2"}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: 16 }}>
              <Btn variant="ghost" onClick={() => setSalesExpanded(false)}>▲ Collapse</Btn>
            </div>
          </Section>
        )}

        {/* ── REVENUE SUMMARY ──────────────────────────────────────────────── */}
        <Section icon="💵" title="Revenue Summary">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 22 }}>
            {[
              { label: "Gross Revenue",   value: fmt(totalRevenue),           color: C.green   },
              { label: "Net Profit",      value: fmt(Math.round(grossProfit)), color: C.primary },
              { label: "Avg Order Value", value: fmt(avgOrderValue),           color: C.blue    },
              { label: "Profit Margin",   value: `${marginPct}%`,             color: C.purple  },
            ].map((item) => (
              <div key={item.label} style={{ background: C.bg, borderRadius: 12, padding: "16px 20px", border: `1px solid ${C.border}` }}>
                <div style={{ color: C.muted, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
                  {item.label}
                </div>
                <div style={{ color: item.color, fontSize: 22, fontWeight: 800, fontFamily: "'Lora', serif" }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
          <Btn variant="amber" onClick={() => { setRevenueExpanded(true); scrollTo(revenueDetailRef); }}>
            📈 More Details →
          </Btn>
        </Section>

        {/* ── REVENUE DETAIL (expandable) ──────────────────────────────────── */}
        {revenueExpanded && (
          <Section reff={revenueDetailRef} icon="📈" title="Revenue by Product">
            {revSorted.map((p) => (
              <BarRow
                key={p.id}
                label={p.name}
                value={p.price * p.sold}
                max={revMax}
                color={C.green}
                prefix="₹"
                sublabel={`(${p.sold} × ₹${p.price})`}
              />
            ))}
            <div style={{ marginTop: 16 }}>
              <Btn variant="ghost" onClick={() => setRevenueExpanded(false)}>▲ Collapse</Btn>
            </div>
          </Section>
        )}

        {/* ── MOST & LEAST SOLD ────────────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>

          {/* Most Sold */}
          <Section icon="🔥" title="Most Sold Product">
            <div style={{background: "#1e293b", borderRadius: 12, padding: "16px 20px", border: `1px solid ${C.border}`, marginBottom: 18 }}>
              <Tag text="TOP PERFORMER" color="#92400E" bg="#FEF3C7" />
              <div style={{ fontFamily: "'Lora', serif", fontSize: 21, fontWeight: 800, color: C.text, marginTop: 10 }}>
                {mostSold.name}
              </div>
              <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>
                {mostSold.category} · {mostSold.weight} · {mostSold.area}
              </div>
              <div style={{ color: C.primary, fontSize: 26, fontWeight: 800, marginTop: 10 }}>{mostSold.sold} units</div>
              <div style={{ color: C.green, fontSize: 12, fontWeight: 700, marginTop: 4 }}>
                Revenue: {fmt(mostSold.price * mostSold.sold)}
              </div>
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: "0.1em", marginBottom: 10 }}>
              AREA BREAKDOWN
            </div>
            {AREAS.map((area, i) => {
              const row = AREA_SALES.find((r) => r.p === mostSold.name);
              return row
                ? <BarRow key={area} label={area} value={row[area]} max={mostSold.sold} color={AREA_COLORS[i]} sublabel="units" />
                : null;
            })}
          </Section>

          {/* Least Sold */}
          <Section icon="⚠️" title="Least Sold Product">
            <div style={{ background: "rgba(239,68,68,0.12)", borderRadius: 12, padding: "16px 20px", border: "1px solid rgba(239,68,68,0.4)", marginBottom: 18 }}>
              <Tag text="NEEDS ATTENTION" color="#991B1B" bg="#FEE2E2" />
              <div style={{ fontFamily: "'Lora', serif", fontSize: 21, fontWeight: 800, color: C.text, marginTop: 10 }}>
                {leastSold.name}
              </div>
              <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>
                {leastSold.category} · {leastSold.weight} · {leastSold.area}
              </div>
              <div style={{ color: C.danger, fontSize: 26, fontWeight: 800, marginTop: 10 }}>{leastSold.sold} units</div>
              <div style={{ color: C.muted, fontSize: 12, fontWeight: 700, marginTop: 4 }}>
                Revenue: {fmt(leastSold.price * leastSold.sold)}
              </div>
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: "0.1em", marginBottom: 10 }}>
              AREA BREAKDOWN
            </div>
            {AREAS.map((area, i) => {
              const row = AREA_SALES.find((r) => r.p === leastSold.name);
              return row
                ? <BarRow key={area} label={area} value={row[area]} max={leastSold.sold} color={AREA_COLORS[i]} sublabel="units" />
                : null;
            })}
          </Section>
        </div>

        {/* ── SALES DISTRIBUTION ───────────────────────────────────────────── */}
        <Section icon="📊" title="Sales Distribution vs. Remaining Inventory">

          {/* Category Summary */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 22 }}>
            {[
              { label: "Bakery Products", sold: bakerySold, count: bakeryProducts.length, color: C.primary },
              { label: "Farsan Products", sold: farsanSold, count: farsanProducts.length, color: C.amber   },
            ].map((cat) => (
              <div key={cat.label} style={{ background: C.bg, borderRadius: 10, padding: "14px 16px", border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: "0.08em", marginBottom: 6 }}>
                  {cat.label.toUpperCase()}
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: cat.color, fontFamily: "'Lora', serif" }}>
                  {cat.sold} units
                </div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>
                  {cat.count} products · {fmt(cat.sold * 65)}
                </div>
              </div>
            ))}
          </div>

          {/* Per-Product Bars */}
          {PRODUCTS.map((p) => {
            const total   = p.stock + p.sold;
            const soldPct = Math.round((p.sold  / total) * 100);
            const stPct   = 100 - soldPct;
            const barColor = p.category === "Bakery" ? C.primary : C.amber;
            return (
              <div key={p.id} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontWeight: 600, color: C.text }}>{p.name}</span>
                    <Tag
                      text={p.category}
                      color={p.category === "Bakery" ? "#92400E" : "#065F46"}
                     bg={p.category === "Bakery" ? "rgba(245,158,11,0.2)" : "rgba(34,197,94,0.2)"}
                    />
                  </div>
                  <div style={{ display: "flex", gap: 14 }}>
                    <span style={{ color: barColor, fontWeight: 700 }}>Sold: {p.sold}</span>
                    <span style={{ color: C.green,  fontWeight: 700 }}>Stock: {p.stock}</span>
                    <span style={{ color: C.muted }}>{soldPct}% sold</span>
                  </div>
                </div>
                <div style={{ height: 12, background: C.barBg, borderRadius: 8, display: "flex", overflow: "hidden" }}>
                  <div style={{ width: `${soldPct}%`, background: barColor, transition: "width 1s ease" }} />
                  <div style={{ width: `${stPct}%`,  background: "#86EFAC", transition: "width 1s ease" }} />
                </div>
              </div>
            );
          })}

          {/* Legend */}
          <div style={{ display: "flex", gap: 20, marginTop: 8, fontSize: 11, color: C.muted }}>
            {[
              { label: "Bakery Sold",     color: C.primary },
              { label: "Farsan Sold",     color: C.amber   },
              { label: "Remaining Stock", color: "#86EFAC" },
            ].map((l) => (
              <span key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 2, background: l.color }} />
                {l.label}
              </span>
            ))}
          </div>
        </Section>

        {/* ── ML ANALYSIS ──────────────────────────────────────────────────── */}
        <Section reff={mlRef} icon="🧠" title="ML Analysis — Demand Intelligence">

          {/* Area Totals Summary */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 26 }}>
            {areaTotals.map((a, i) => (
              <div key={a.area} style={{
                background: C.card,
                borderRadius: 12, padding: "16px 18px",
                border: `1px solid ${C.border}`,
              }}>
                {i === 0 && <Tag text="TOP AREA" color="#92400E" bg="#FEF3C7" />}
                <div style={{
                  fontSize: 18, fontWeight: 800,
                  color: i === 0 ? C.primary : C.text,
                  fontFamily: "'Lora', serif", marginTop: i === 0 ? 8 : 0,
                }}>
                  {a.area}
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: AREA_COLORS[i], marginTop: 4 }}>
                  {a.total} units
                </div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>
                  {fmt(a.total * 65)} revenue
                </div>
              </div>
            ))}
          </div>

          {/* Area Demand Bars */}
          <div style={{ marginBottom: 26 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 12 }}>
              📍 High-Demand Products by Area
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {AREAS.map((a) => (
                <button key={a} onClick={() => setActiveArea(a)} style={{
                  padding: "7px 18px", borderRadius: 20,
                  border: `1px solid ${activeArea === a ? C.primary : C.border}`,
                  cursor: "pointer", fontWeight: 700, fontSize: 12, fontFamily: "'DM Sans', sans-serif",
                  background: activeArea === a ? C.primary : C.bg,
                  color:      activeArea === a ? "#fff"    : C.muted,
                  transition: "all 0.15s",
                }}>
                  {a}
                </button>
              ))}
            </div>
            {[...AREA_SALES]
              .sort((a, b) => b[activeArea] - a[activeArea])
              .map((row, i) => (
                <BarRow
                  key={row.p}
                  label={row.p}
                  value={row[activeArea]}
                  max={Math.max(...AREA_SALES.map((r) => r[activeArea]))}
                  color={i === 0 ? C.primary : i <= 2 ? C.amber : C.muted}
                  sublabel="units"
                />
              ))}
          </div>

          {/* Best Performer per Area */}
          <div style={{ marginBottom: 26 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 12 }}>
              🏆 Best Performer per Area
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
              {AREAS.map((a, i) => {
                const salesForArea = (p) =>
                  p.area === a ? p.sold : Math.round(p.sold * areaProportion(a));
                const best = PRODUCTS.reduce((b, p) =>
                  salesForArea(p) > salesForArea(b) ? p : b
                );
                return (
                  <div key={a} style={{
                    background: C.bg, borderRadius: 10, padding: "13px 15px", border: `1px solid ${C.border}`,
                  }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, letterSpacing: ".08em" }}>
                      {a.toUpperCase()}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginTop: 6 }}>{best.name}</div>
                    <div style={{ fontSize: 11, color: AREA_COLORS[i], fontWeight: 700, marginTop: 3 }}>
                      {salesForArea(best)} units
                    </div>
                    <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{best.category}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Demand Trends */}
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 12 }}>📅 Demand Trends</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {[
                { key: "normal",  label: "📅 Normal Period",  activeColor: C.green  },
                { key: "festive", label: "🎉 Festive Period", activeColor: C.purple },
              ].map((m) => (
                <button key={m.key} onClick={() => setTrendMode(m.key)} style={{
                  padding: "7px 18px", borderRadius: 20,
                  border: `1px solid ${trendMode === m.key ? "transparent" : C.border}`,
                  cursor: "pointer", fontWeight: 700, fontSize: 12, fontFamily: "'DM Sans', sans-serif",
                  background: trendMode === m.key ? m.activeColor : C.bg,
                  color:      trendMode === m.key ? "#fff"        : C.muted,
                  transition: "all 0.15s",
                }}>
                  {m.label}
                </button>
              ))}
            </div>
            {DEMAND_TRENDS[trendMode].map((row) => (
              <BarRow
                key={row.p} label={row.p} value={row.d} max={100}
                color={trendMode === "festive" ? C.purple : C.green}
                sublabel="demand score"
              />
            ))}
            <div style={{
              marginTop: 14, padding: "13px 18px", borderRadius: 10,
              background: "#1e293b",
              border: `1px solid ${C.border}`,
            }}>
              <span style={{ fontSize: 13, color: trendMode === "festive" ? "#5B21B6" : "#065F46", fontWeight: 600 }}>
                {trendMode === "festive"
                  ? `🎉 ML Insight: Khatta Meetha & Golden Mix spike 2.5× during Ganesh Chaturthi & Diwali in ${topArea.area}. Increase Farsan stock by 50%.`
                  : `📅 ML Insight: Khatta Meetha leads consistently in ${topArea.area}. Wheat Khari is the top Bakery seller. Maintain current ratios.`}
              </span>
            </div>
          </div>
        </Section>

        {/* ── PREDICTIONS & SUGGESTIONS ────────────────────────────────────── */}
       <Section reff={promoRef} icon="🤖" title="Predictions & Actionable Suggestions">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 22 }}>

            {/* Restock Alerts */}
            <div style={{ background: "rgba(239,68,68,0.12)", borderRadius: 14, padding: "20px",border: "1px solid rgba(239,68,68,0.4)" }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: C.danger, marginBottom: 14 }}>⚠️ Restock Alerts</div>
              {PRODUCTS.filter((p) => p.stock < 25).map((p) => (
                <div key={p.id} style={{ background: "#fff", borderRadius: 9, padding: "10px 13px", marginBottom: 9, border: "1px solid #FECACA" }}>
                  <div style={{ fontWeight: 700, fontSize: 12, color: C.text }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{p.category} · {p.weight} · {p.area}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
                    <span style={{ fontSize: 11, color: C.muted }}>Stock: {p.stock} units</span>
                    <Tag text="RESTOCK NOW" color="#991B1B" bg="#FEE2E2" />
                  </div>
                </div>
              ))}
              <div style={{ fontSize: 11, color: C.danger, fontWeight: 600, marginTop: 8 }}>
                ⚡ Suggested reorder: 100 units per SKU
              </div>
            </div>

            {/* Promotion Strategy */}
            <div style={{ background: "#1e293b", borderRadius: 14, padding: "20px", border: `1px solid ${C.border}` }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: "#92400E", marginBottom: 14 }}>📣 Needs Promotion</div>
              {PRODUCTS
                .filter((p) => p.sold < 90)
                .sort((a, b) => a.sold - b.sold)
                .map((p) => {
                  const promoMap = {
                    "Bhavnagri":   "Bundle with Khatta Meetha at ₹115",
                    "Misal Mix":   "10% off on pack of 2",
                    "Wheat Toast": "Free sample in Varap outlets",
                    "Wheat Butter":"Combo with Wheat Khari at ₹115",
                    "Besan Papdi": "Feature in festive hamper",
                  };
                  return (
                    <div key={p.id} style={{ background: "#fff", borderRadius: 9, padding: "10px 13px", marginBottom: 9, border: "1px solid #FED7AA" }}>
                      <div style={{ fontWeight: 700, fontSize: 12, color: C.text }}>{p.name}</div>
                      <div style={{ fontWeight: 600, fontSize: 11, color: C.amber, marginTop: 3 }}>
                        {promoMap[p.name] || "Offer 2+1 combo deal"}
                      </div>
                      <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>
                        Only {p.sold} units sold · {p.area}
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Business Strategies */}
            <div style={{ background: "#1e293b", borderRadius: 14, padding: "20px", border: `1px solid ${C.border}` }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: "#065F46", marginBottom: 14 }}>💡 Business Strategies</div>
              {[
                {
                  icon: "🎁",
                  title: "Festive Hamper",
                  desc: `Pack Khatta Meetha + Golden Mix + Besan Papdi in a ₹175 gift box. Push in ${topArea.area} before Diwali.`,
                },
                {
                  icon: "🔄",
                  title: "Slow Stock Clearance",
                  desc: `Flash sale on Bhavnagri & Misal Mix in ${bottomArea.area}. Post reels on Instagram stories.`,
                },
                {
                  icon: "📍",
                  title: "Area Expansion",
                  desc: `${topArea.area} leads demand. Tie up with a local kirana or open a second retail point.`,
                },
                {
                  icon: "💰",
                  title: "Bulk Discount",
                  desc: "Offer ₹60/pack for orders of 5+ units. Drives volume from tea stalls & tiffin centres.",
                },
              ].map((s) => (
                <div key={s.title} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 18, lineHeight: 1 }}>{s.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 12, color: C.text }}>{s.title}</div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 2, lineHeight: 1.5 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prediction Banner */}
          <div style={{
            background: "linear-gradient(135deg, #1C0A00 0%, #3D1A00 100%)",
            borderRadius: 16, padding: "24px 28px",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div>
              <div style={{ color: "#FBBF24", fontWeight: 800, fontSize: 15, marginBottom: 6 }}>
                🤖 ML Prediction — Next 30 Days
              </div>
              <div style={{ color: "#FFF8F0", fontSize: 13, lineHeight: 1.6, maxWidth: 520 }}>
                Sales are expected to grow by{" "}
                <strong style={{ color: "#34D399" }}>18–24%</strong> based on seasonal demand
                patterns across Mharal, Ulhasanagar & Varap. Focus production on Khatta Meetha
                and Golden Mix for maximum return heading into the festive quarter.
              </div>
            </div>
            <div style={{ textAlign: "right", minWidth: 120 }}>
              <div style={{ color: "#34D399", fontSize: 36, fontWeight: 800, fontFamily: "'Lora', serif", lineHeight: 1 }}>
                ↑ 21%
              </div>
              <div style={{ color: "#A0522D", fontSize: 12, marginTop: 4 }}>Confidence: 87%</div>
              <Tag text="BULLISH" color="#065F46" bg="#D1FAE5" />
            </div>
          </div>
        </Section>

        {/* ── FOOTER ───────────────────────────────────────────────────────── */}
        </div>
        <footer
    style={{
      textAlign: "center",
      padding: "20px",
      color: "#94a3b8",
      borderTop: "1px solid #334155",
      background: "#020617"
    }}
  >
    🧁 BakeSmart Admin Portal · v2.5.0 · Static Demo Mode · © 2025 BakeSmart
  </footer>
      </main>
    </div>
  );
}
