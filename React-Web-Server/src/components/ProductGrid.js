import React from "react";
import ProductCard from "./ProductCard";

function productGrid({ products }) {
  return (
    <div>
      <h3>Available products:</h3>
      <div style={{ display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
        gap: "1rem",
        backgroundColor: "#c0d0cdff", // Light gray background
        padding: "2rem",            // Add padding around grid
        borderRadius: "16px"
        }}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default productGrid;
