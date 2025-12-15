import { useContext, useEffect, useMemo, useState } from "react";
import { categories } from "../assets/assets.jsx";
import { AppContext } from "../AppContext";
import "./category-grid.css";

const computeBaseVisible = (width) => (width < 1024 ? 6 : 10); // mobile/tablet: 2 rows of 3; desktop: 2 rows of 5

const Category = () => {
  const { navigate } = useContext(AppContext);
  const [expanded, setExpanded] = useState(false);
  const [baseVisible, setBaseVisible] = useState(() =>
    typeof window !== "undefined" ? computeBaseVisible(window.innerWidth) : 6
  );

  useEffect(() => {
    const onResize = () => {
      const next = computeBaseVisible(window.innerWidth);
      setBaseVisible((prev) => (prev === next ? prev : next));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const visibleCategories = useMemo(
    () => (expanded ? categories : categories.slice(0, baseVisible)),
    [expanded, baseVisible]
  );

  const handleClick = (path) => {
    navigate(`/products/${path.toLowerCase()}`);
    scrollTo(0, 0);
  };

  return (
    <section className="cat-section mt-16">
      <div className="cat-header">
        <h2>Shop by Category</h2>
        <button
          type="button"
          className="show-btn"
          onClick={() => setExpanded((s) => !s)}
        >
          {expanded ? "Show Less" : "Show More"}
        </button>
      </div>

      <div className="cat-grid">
        {visibleCategories.map((category, index) => (
          <button
            key={index}
            type="button"
            className="cat-card"
            style={{ backgroundColor: category.bgColor }}
            aria-label={category.text}
            onClick={() => handleClick(category.path)}
          >
            <img src={category.image} alt={category.text} loading="lazy" />
            <span>{category.text}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default Category;