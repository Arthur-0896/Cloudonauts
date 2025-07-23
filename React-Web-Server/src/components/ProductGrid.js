import React from "react";
import Cookies from 'js-cookie';

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
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1.5rem",
          padding: "2rem",
          backgroundColor: "#f4f6f8",
          borderRadius: "16px",
          justifyContent: "center",
          placeItems: "center", // Center single item
        }}
      >
        {products.map((product) => {
          const priceNumber = parseFloat(product.price);
          const isOutOfStock = product.inventory === 0;

          return (
            <div
              key={product.pid}
              style={{
                maxWidth: "300px",
                width: "100%", // Prevent stretching
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
            >
              <img
                src={product.thumbLink}
                alt={product.productName}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/150";
                }}
                style={{
                  width: "200px",
                  height: "240px",
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

              {/* Only show button if not out of stock */}
              {!isOutOfStock && (
                <button
                  style={{
                    marginTop: "1rem",
                    padding: "0.5rem 1rem",
                    backgroundColor: "#0d9488",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                  }}
                  onClick={() => handleAddToCart(product.pid)}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#0f766e";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#0d9488";
                  }}
                >
                  Add to Cart
                </button>
              )}

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

function handleAddToCart(productId) {
  // Get existing cart from cookies
  const existingCart = Cookies.get('cart');
  let cart = [];

  if (existingCart) {
    cart = JSON.parse(existingCart);
  }

  // Avoid duplicates
  if (!cart.includes(productId)) {
    cart.push(productId);
    Cookies.set('cart', JSON.stringify(cart), { expires: 7 }); // store for 7 days
    alert('Item added to cart!');
  } else {
    alert('Item already in cart.');
    console.log("Here is the cookies",Cookies.get('cart'));
  }
}

export default ProductGrid;
