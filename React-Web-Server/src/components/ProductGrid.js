import React from "react";

function ProductGrid({ products }) {
  console.log("Products:", products);
  products.forEach((product, index) => {
    console.log(`Product ${index + 1} inventory count:`, product.inventory);
    const priceNumber = parseFloat(product.price);
    if (!isNaN(priceNumber)) {
      console.log(`Product ${index + 1} price is a valid number:`, priceNumber);
    } else {
      console.log(`Product ${index + 1} price is invalid`);
    }
  });

  return (
    <div>
      <h3 style={{ textAlign: "center", fontSize: "1.8rem", marginBottom: "1rem" }}>
        Available Products
      </h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1.5rem",
          padding: "2rem",
          backgroundColor: "#f4f6f8",
          borderRadius: "16px",
        }}
      >
        {products.map((product) => {
          const priceNumber = parseFloat(product.price);
          const isOutOfStock = product.inventory === 0;

          return (
            <div
              key={product.pid}
              style={{
                position: "relative",
                backgroundColor: "#ffffff",
                padding: "1.5rem",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                filter: isOutOfStock ? "grayscale(70%)" : "none",
                pointerEvents: isOutOfStock ? "none" : "auto",
                opacity: isOutOfStock ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isOutOfStock) {
                  e.currentTarget.style.transform = "scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.15)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isOutOfStock) {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
                }
              }}
            >
              <img
                src={product.imageLink}
                alt={product.productName}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/150";
                }}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginBottom: "1rem",
                  opacity: isOutOfStock ? 0.6 : 1,
                }}
              />

              <h4 style={{ margin: "0.5rem 0", fontSize: "1.2rem", color: isOutOfStock ? "#a0a0a0" : "#000" }}>
                {product.productName}
              </h4>
              <p style={{ color: "#777", fontSize: "0.95rem", textAlign: "center" }}>
                {product.size || "No size available."}
              </p>
              <strong style={{ marginTop: "0.5rem", fontSize: "1rem", color: "#333" }}>
                {!isNaN(priceNumber) ? `$${priceNumber.toFixed(2)}` : "Price not available"}
              </strong>

              <button
                disabled={isOutOfStock}
                style={{
                  marginTop: "1rem",
                  padding: "0.5rem 1rem",
                  backgroundColor: isOutOfStock ? "#888" : "#0d9488",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: isOutOfStock ? "not-allowed" : "pointer",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (!isOutOfStock) e.target.style.backgroundColor = "#0f766e";
                }}
                onMouseLeave={(e) => {
                  if (!isOutOfStock) e.target.style.backgroundColor = "#0d9488";
                }}
              >
                {isOutOfStock ? "Out of Stock" : "View Details"}
              </button>

              {isOutOfStock && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "12px",
                    pointerEvents: "none",
                  }}
                >
                  Out of Stock
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProductGrid;
