import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Notification from "../components/Notification";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { updateCartCount, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = () => {
    const cart = JSON.parse(Cookies.get("cart") || "[]"); // Get and parse 'cart' cookie
    console.log("Here are the cart items", cart);
    const savedProducts = JSON.parse(localStorage.getItem("allProducts") || "[]"); // Get and parse 'allProducts' from local storage
    console.log("Here are the all items", localStorage.getItem("allProducts"));
    const cartIdsNormalized = cart.map(String); // Normalize cart IDs to strings
    const filtered = savedProducts.filter(product =>
      cartIdsNormalized.includes(String(product.pid)) // Filter products to match cart IDs
    );
    console.log("Here are the filtered items", filtered);
    setCartItems(filtered); // Set filtered cart items
    updateCartCount(); // Update cart count after loading cart items
  };

  const handleRemove = (pidToRemove) => {
    let cart = JSON.parse(Cookies.get("cart") || "[]"); // Get and parse 'cart' cookie
    cart = cart.filter(pid => String(pid) !== String(pidToRemove)); // Filter out the item to remove

    Cookies.set("cart", JSON.stringify(cart), { expires: 7 }); // Update cart cookie
    loadCartItems(); // Refresh UI and also updates cart count via updateCartCount() call inside
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
          products: cartItems.map(item => item.pid)
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      // Clear cart
      Cookies.set('cart', '[]', { expires: 7 });
      updateCartCount();

      // Navigate to order confirmation with the order ID
      navigate(`/order-confirmation/${data.order_id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
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