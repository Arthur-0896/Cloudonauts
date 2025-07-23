import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = () => {
    const cart = JSON.parse(Cookies.get("cart") || "[]");
    const savedProducts = JSON.parse(localStorage.getItem("allProducts") || "[]");

    const cartIdsNormalized = cart.map(String);
    const filtered = savedProducts.filter(product =>
      cartIdsNormalized.includes(String(product.pid))
    );
    setCartItems(filtered);
  };

  const handleRemove = (pidToRemove) => {
    let cart = JSON.parse(Cookies.get("cart") || "[]");
    cart = cart.filter(pid => String(pid) !== String(pidToRemove));

    Cookies.set("cart", JSON.stringify(cart), { expires: 7 });
    loadCartItems(); // Refresh UI
  };

  const handleBuyNow = () => {
    alert(`Proceeding to buy ${cartItems.length} item(s)!`);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Your Cart</h2>

      {cartItems.length === 0 ? (
        <p style={styles.emptyMessage}>Your cart is empty.</p>
      ) : (
        <>
          <ul style={styles.list}>
            {cartItems.map((item) => (
              <li key={item.pid} style={styles.listItem}>
                <div style={styles.imageWrapper}>
                  <img
                    src={item.thumbLink || "https://via.placeholder.com/80"}
                    alt={item.productName}
                    style={styles.image}
                  />
                </div>
                <div style={styles.info}>
                  <h3 style={styles.productName}>{item.productName}</h3>
                  <p style={styles.details}>Size: {item.size || "N/A"}</p>
                  <p style={styles.details}>Category: {item.category}</p>
                  <strong style={styles.price}>${parseFloat(item.price).toFixed(2)}</strong>
                </div>
                <button style={styles.removeButton} onClick={() => handleRemove(item.pid)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <button style={styles.buyNowButton} onClick={handleBuyNow}>
            Buy Now
          </button>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "720px",
    margin: "2rem auto",
    padding: "1.5rem",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
  },
  heading: {
    marginBottom: "1.5rem",
    fontSize: "1.8rem",
    color: "#222",
    textAlign: "center",
  },
  emptyMessage: {
    color: "#666",
    fontSize: "1.1rem",
    textAlign: "center",
  },
  list: {
    listStyleType: "none",
    padding: 0,
    margin: 0,
  },
  listItem: {
    display: "flex",
    alignItems: "center",
    padding: "1rem",
    borderBottom: "1px solid #eee",
  },
  imageWrapper: {
    flexShrink: 0,
    width: "80px",
    height: "80px",
    marginRight: "1rem",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "8px",
    backgroundColor: "#f0f0f0",
  },
  info: {
    flexGrow: 1,
  },
  productName: {
    margin: "0 0 0.5rem 0",
    fontSize: "1.2rem",
    color: "#111",
  },
  details: {
    margin: "0 0 0.25rem 0",
    fontSize: "0.9rem",
    color: "#555",
  },
  price: {
    marginTop: "0.5rem",
    fontSize: "1.1rem",
    color: "#0d9488",
  },
  removeButton: {
    backgroundColor: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.9rem",
    marginLeft: "1rem",
  },
  buyNowButton: {
    marginTop: "2rem",
    width: "100%",
    padding: "1rem",
    backgroundColor: "#0d9488",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "1.2rem",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};

export default Cart;
