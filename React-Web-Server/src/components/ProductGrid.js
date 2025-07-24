import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useAuth } from '../context/AuthContext'; // Ensure correct path to AuthContext
import Notification from './Notification';

function ProductGrid({ products }) {
  const { updateCartCount } = useAuth(); // Get updateCartCount from AuthContext
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [itemsInCart, setItemsInCart] = useState([]);

  // Initialize items in cart from cookies
  React.useEffect(() => {
    const existingCart = Cookies.get('cart');
    if (existingCart) {
      setItemsInCart(JSON.parse(existingCart));
    }
  }, []);

  const handleRemoveFromCart = (productId, productName) => {
    const existingCart = Cookies.get('cart');
    if (existingCart) {
      const cart = JSON.parse(existingCart);
      const updatedCart = cart.filter(id => id !== productId);
      Cookies.set('cart', JSON.stringify(updatedCart), { expires: 7 });
      setItemsInCart(updatedCart);
      setNotificationMessage(`${productName} removed from cart`);
      setShowNotification(true);
      updateCartCount();
    }
  };

  const handleAddToCart = (productId, productName) => {
    let cart = [];
    const existingCart = Cookies.get('cart'); // Get 'cart' cookie
    if (existingCart) { // If cart exists in cookies
      cart = JSON.parse(existingCart); // Parse the cart data
    }
    if (!cart.includes(productId)) { // If product is not already in cart
      cart.push(productId); // Add product ID to cart
      Cookies.set('cart', JSON.stringify(cart), { expires: 7 }); // Set updated cart in cookies
      setItemsInCart(cart); // Update local state
      setNotificationMessage(`${productName} added to cart successfully`);
      setShowNotification(true);
      updateCartCount(); // Call to update the cart count in UserHeader via AuthContext
    } else {
      setNotificationMessage('Item already in cart');
      setShowNotification(true);
    }
  };

  return (
    <div>
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

            <p style={styles.price}>
              <strong>
                {!isNaN(price) ? `$${price.toFixed(2)}` : "Price not available"}
              </strong>
            </p>

            {!isOutOfStock && (
              <div style={styles.buttonWrapper}>
                <button
                  onClick={() => {
                    if (itemsInCart.includes(product.pid)) {
                      handleRemoveFromCart(product.pid, product.productName);
                    } else {
                      handleAddToCart(product.pid, product.productName);
                    }
                  }}
                  style={{
                    ...styles.addToCartButton,
                    ...(itemsInCart.includes(product.pid) && styles.removeButton)
                  }}
                  onMouseEnter={(e) => {
                    if (itemsInCart.includes(product.pid)) {
                      e.currentTarget.style.backgroundColor = "#cc0000"
                    } else {
                      e.currentTarget.style.backgroundColor = "#04db2a"
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (itemsInCart.includes(product.pid)) {
                      e.currentTarget.style.backgroundColor = "#ff0000"
                    } else {
                      e.currentTarget.style.backgroundColor = "#03b723"
                    }
                  }}
                  title={itemsInCart.includes(product.pid) ? "Remove from Cart" : "Add to Cart"}
                >
                  {itemsInCart.includes(product.pid) ? "Remove" : "Add to Cart"}
                </button>
              </div>
            )}


            {isOutOfStock && (
              <div style={styles.outOfStockOverlay}>Out of Stock</div>
            )}
          </div>
        );
      })}
      </div>
      {showNotification && (
        <Notification
          message={notificationMessage}
          onDismiss={() => setShowNotification(false)}
          type="success"
          autoDismiss={1700}
        />
      )}
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
    fontWeight: "bold", // Make it bold
  },

  buttonWrapper: {
    marginTop: "0.8rem",
    display: "flex",
    justifyContent: "center",
  },

  addToCartButton: {
    backgroundColor: "#03b723",
    color: "#fff",
    border: "none",
    borderRadius: "24px",
    padding: "0.5rem 1.2rem",
    fontSize: "1rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    transition: "all 0.2s",
  },
  removeButton: {
    backgroundColor: "#ff0000",
    color: "#fff",
    cursor: "pointer",
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