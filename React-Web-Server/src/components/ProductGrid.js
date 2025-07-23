import React from "react";
import Cookies from 'js-cookie';

function ProductGrid({ products }) {
  const handleAddToCart = (productId) => {
    let cart = [];
    const existingCart = Cookies.get('cart');
    if (existingCart) {
      cart = JSON.parse(existingCart);
    }

    if (!cart.includes(productId)) {
      cart.push(productId);
      Cookies.set('cart', JSON.stringify(cart), { expires: 7 });
      alert('Item added to cart!');
    } else {
      alert('Item already in cart.');
    }
  };

  return (
    <div style={styles.gridContainer}>
      {products.map((product) => {
        const price = parseFloat(product.price);
        const isOutOfStock = product.inventory === 0;

        return (
          <div
            key={product.pid}
            style={{
              ...styles.card,
              ...(isOutOfStock ? styles.cardOutOfStock : {}),
            }}
            className="product-card"
          >
            <img
              src={product.thumbLink || "https://via.placeholder.com/150"}
              alt={product.productName}
              onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
              style={{ ...styles.image, opacity: isOutOfStock ? 0.6 : 1 }}
            />

            <h4 style={{ ...styles.title, color: isOutOfStock ? "#a0a0a0" : "#111827" }}>
              {product.productName}
            </h4>
            <p style={styles.sizeText}>
              <span style={{ fontWeight: "500", color: "#555" }}>Size:</span>{" "}
              {product.size || "No size available."}
            </p>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "1rem",
              width: "100%",
              padding: "0 0.5rem",
            }}>
              <strong style={{
                fontSize: "1rem",
                color: "#333",
              }}>
                {!isNaN(price) ? `$${price.toFixed(2)}` : "Price not available"}
              </strong>

              {!isOutOfStock && (
                <button
                  onClick={() => handleAddToCart(product.pid)}
                  style={{
                    backgroundColor: "#0d9488",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "0.5rem 0.8rem",
                    fontSize: "1.2rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background-color 0.2s ease",
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = "#0f766e"}
                  onMouseLeave={(e) => e.target.style.backgroundColor = "#0d9488"}
                  title="Add to Cart"
                >
                  🛒
                </button>
              )}
            </div>
            {isOutOfStock && (
              <div style={styles.outOfStockOverlay}>Out of Stock</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ✨ CSS-in-JS styles
const styles = {

  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1.5rem",
    padding: "2rem",
    backgroundColor: "#f4f6f8",
    borderRadius: "16px",
    justifyContent: "center",
    placeItems: "center",
  },
  card: {
    position: "relative",
    backgroundColor: "#ffffff",
    padding: "1.5rem",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease",
    maxWidth: "300px",
    width: "100%",
    textAlign: "center",
    cursor: "pointer",
  },
  cardOutOfStock: {
    filter: "grayscale(70%)",
    pointerEvents: "none",
    opacity: 0.7,
    cursor: "not-allowed",
  },
  image: {
    width: "200px",
    height: "240px",
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "1rem",
    transition: "opacity 0.3s ease",
  },
  title: {
    fontSize: "1.2rem",
    margin: "0.5rem 0",
  },
  sizeText: {
    color: "#64748b",
    fontSize: "0.95rem",
  },
  price: {
    marginTop: "0.5rem",
    fontSize: "1rem",
    color: "#334155",
  },
  button: {
    marginTop: "1rem",
    padding: "0.5rem 1rem",
    backgroundColor: "#0d9488",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.95rem",
    transition: "background-color 0.2s ease",
  },
  outOfStockOverlay: {
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
  },
};

// 👇 Inject hover effect using raw CSS (via <style> tag)
const styleTag = document.createElement('style');
styleTag.innerHTML = `
  .product-card:hover {
    transform: scale(1.03);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }
`;
document.head.appendChild(styleTag);

export default ProductGrid;
