import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Notification from "../components/Notification";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [cartQuantities, setCartQuantities] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { updateCartCount, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadCartItems();
  }, []);

  // Load cart items and their quantities from cookies
  const loadCartItems = () => {
    const cartObj = JSON.parse(Cookies.get("cart") || "{}"); // { pid: quantity }
    setCartQuantities(cartObj);

    const savedProducts = JSON.parse(localStorage.getItem("allProducts") || "[]");
    // Only include products that are in the cart
    const filtered = savedProducts.filter(product =>
      Object.keys(cartObj).includes(String(product.pid))
    );
    setCartItems(filtered);
    updateCartCount(Object.values(cartObj).reduce((sum, qty) => sum + qty, 0));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Remove product from cart
  const handleRemove = (pidToRemove) => {
    const cartObj = { ...cartQuantities };
    delete cartObj[pidToRemove];
    Cookies.set("cart", JSON.stringify(cartObj), { expires: 7 });
    setCartQuantities(cartObj);
    loadCartItems();
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Increment product quantity
  const handleIncrement = (pid, inventory) => {
    const currentQty = cartQuantities[pid] || 1;
    if (currentQty < inventory) {
      const cartObj = { ...cartQuantities, [pid]: currentQty + 1 };
      Cookies.set("cart", JSON.stringify(cartObj), { expires: 7 });
      setCartQuantities(cartObj);
      loadCartItems();
      window.dispatchEvent(new Event("cartUpdated"));
    }
  };

  // Decrement product quantity
  const handleDecrement = (pid) => {
    const currentQty = cartQuantities[pid] || 1;
    if (currentQty > 1) {
      const cartObj = { ...cartQuantities, [pid]: currentQty - 1 };
      Cookies.set("cart", JSON.stringify(cartObj), { expires: 7 });
      setCartQuantities(cartObj);
      loadCartItems();
      window.dispatchEvent(new Event("cartUpdated"));
    } else {
      handleRemove(pid);
    }
  };

  const handleBuyNow = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!user) {
        setError("Please login to place an order");
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/place-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_sub: user.attributes.sub,
          products: Object.keys(cartQuantities).map(pid => ({
            pid: parseInt(pid, 10), // Ensure pid is an integer
            quantity: cartQuantities[pid]
          }))
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      // Clear cart
      Cookies.set('cart', '{}', { expires: 7 });
      setCartQuantities({});
      setCartItems([]);
      updateCartCount(0);
      window.dispatchEvent(new Event("cartUpdated"));

      // Navigate to order confirmation with the order ID
      navigate(`/order-confirmation/${data.order_id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate total price and breakdown
  const getCartSummary = () => {
    let total = 0;
    const breakdown = cartItems.map(item => {
      const qty = cartQuantities[item.pid] || 0;
      const price = parseFloat(item.price) || 0;
      const subtotal = qty * price;
      total += subtotal;
      return {
        name: item.productName,
        qty,
        price,
        subtotal,
      };
    });
    return { total, breakdown };
  };

  const { total, breakdown } = getCartSummary();

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
                  <div style={{ display: "flex", alignItems: "center", marginTop: "0.5rem", gap: "0.5rem" }}>
                    <button
                      style={styles.counterButton}
                      onClick={() => handleDecrement(item.pid)}
                      disabled={cartQuantities[item.pid] <= 1}
                    >−</button>
                    <span style={styles.counterValue}>{cartQuantities[item.pid]}</span>
                    <button
                      style={styles.counterButton}
                      onClick={() => handleIncrement(item.pid, item.inventory)}
                      disabled={cartQuantities[item.pid] >= item.inventory}
                    >+</button>
                  </div>
                </div>
                <button style={styles.removeButton} onClick={() => handleRemove(item.pid)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>

          {/* Cart Summary moved below products */}
          <div style={styles.summaryContainer}>
            <h3 style={styles.summaryHeading}>Order Summary</h3>
            <ul style={styles.summaryList}>
              {breakdown.map((item, idx) => (
                <li key={idx} style={styles.summaryItem}>
                  <span style={{ fontWeight: "500" }}>{item.name}</span>
                  <span>
                    {item.qty} × ${item.price.toFixed(2)} = <strong>${item.subtotal.toFixed(2)}</strong>
                  </span>
                </li>
              ))}
            </ul>
            <div style={styles.summaryTotal}>
              <span style={{ fontWeight: "bold", fontSize: "1.1rem" }}>Total:</span>
              <span style={{ fontWeight: "bold", fontSize: "1.1rem" }}>${total.toFixed(2)}</span>
            </div>
          </div>

          <div style={styles.buttonContainer}>
            <button 
              style={styles.continueShoppingButton}
              onClick={() => navigate('/')}
            >
              Continue Shopping
            </button>
            <button 
              style={{
                ...styles.buyNowButton,
                ...(isLoading && styles.buttonDisabled)
              }} 
              onClick={handleBuyNow}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Buy Now'}
            </button>
          </div>
        </>
      )}
      {error && (
        <Notification
          message={error}
          type="error"
          onDismiss={() => setError(null)}
          autoDismiss={5000}
        />
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
  summaryContainer: {
    marginBottom: "2rem",
    background: "#f9fafb",
    borderRadius: "12px",
    padding: "1rem 1.5rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  summaryHeading: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    marginBottom: "0.75rem",
    color: "#222",
  },
  summaryList: {
    listStyleType: "none",
    padding: 0,
    margin: 0,
    marginBottom: "0.75rem",
  },
  summaryItem: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "1rem",
    marginBottom: "0.5rem",
    color: "#444",
  },
  summaryTotal: {
    display: "flex",
    justifyContent: "space-between",
    borderTop: "1px solid #e5e7eb",
    paddingTop: "0.75rem",
    marginTop: "0.5rem",
    color: "#111",
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
  counterButton: {
    backgroundColor: "#03b723",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: "32px",
    height: "32px",
    fontSize: "1.3rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.2s",
  },
  counterValue: {
    fontSize: "1.1rem",
    fontWeight: "bold",
    minWidth: "24px",
    textAlign: "center",
    color: "#222",
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
  buttonContainer: {
    marginTop: "2rem",
    display: "flex",
    gap: "1rem",
  },
  continueShoppingButton: {
    flex: 1,
    padding: "1rem",
    backgroundColor: "#fff",
    color: "#0d9488",
    border: "2px solid #0d9488",
    borderRadius: "12px",
    fontSize: "1.2rem",
    cursor: "pointer",
    transition: "all 0.3s",
  },
  buyNowButton: {
    flex: 1,
    padding: "1rem",
    backgroundColor: "#0d9488",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "1.2rem",
    cursor: "pointer",
    transition: "all 0.3s",
  },
  buttonDisabled: {
    backgroundColor: "#94a3b8",
    cursor: "not-allowed",
    opacity: 0.7,
  },
};

export default Cart;