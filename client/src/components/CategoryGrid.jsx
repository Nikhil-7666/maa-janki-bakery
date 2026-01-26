// CategoryGrid.jsx
import { useState, useMemo } from "react";
import "./category-grid.css";


const categories = [
  { text: "Bakery", image: "/images/bakery.png", color: "#FDE2E4" },
  { text: "Namkeens", image: "/images/namkeens.png", color: "#FFF1E6" },
  { text: "Snacks", image: "/images/snacks.png", color: "#E2F0CB" },
  { text: "Sweets", image: "/images/sweets.png", color: "#F0EFEB" },
  { text: "Chocolates", image: "/images/chocolates.png", color: "#D7E3FC" },
  { text: "Coldrinks", image: "/images/coldrinks.png", color: "#C7FFD8" },
  { text: "Ice-creams", image: "/images/icecream.png", color: "#FFF5BA" },
  { text: "Spices", image: "/images/spices.png", color: "#E2F0CB" },
  { text: "Dryfruits", image: "/images/dryfruits.png", color: "#FFF0D5" },
  { text: "Celebration", image: "/images/celebration.png", color: "#FFE7F0" },
];

export default function CategoryGrid() {
  const [expanded, setExpanded] = useState(false);
  const visible = useMemo(
    () => (expanded ? categories : categories.slice(0, 4)),
    [expanded]
  );

  return (
    <section className="cat-section">
      <div className="cat-header">
        <h2>Shop by Category</h2>
        <button className="show-btn" onClick={() => setExpanded(!expanded)}>
          {expanded ? "Show Less" : "Show More"}
        </button>
      </div>

      <div className={`cat-grid ${expanded ? "expanded" : ""}`}>
        {visible.map((cat, idx) => (
          <button
            key={idx}
            className="cat-card"
            style={{ backgroundColor: cat.color }}
            aria-label={cat.text}
          >
            <img src={cat.image} alt={cat.text} loading="lazy" />
            <span>{cat.text}</span>
          </button>
        ))}
      </div>
    </section>
  );
}