import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Notification from '../components/Notification';

function OrderConfirmation() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { orderId } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!user) return;
        
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/user-orders/${user.attributes.sub}`);
        if (!response.ok) {
          throw new Error('Failed to fetch order');
        }

        const orders = await response.json();
        const currentOrder = orders.find(o => o.order_id === parseInt(orderId));
        
        if (!currentOrder) {
          throw new Error('Order not found');
        }

        setOrder(currentOrder);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, user]);

  if (loading) {
    return <div style={styles.container}>Loading order details...</div>;
  }

  if (error) {
    return (
      <div style={styles.container}>
        <Notification
          message={error}
          type="error"
          onDismiss={() => setError(null)}
          autoDismiss={5000}
        />
      </div>
    );
  }

  if (!order) {
    return <div style={styles.container}>Order not found</div>;
  }

  const totalAmount = order.products.reduce(
    (sum, product) => sum + parseFloat(product.price),
    0
  ).toFixed(2);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.heading}>Order Confirmation</h2>
        <div style={styles.checkmark}>✓</div>
        <p style={styles.subheading}>Your order has been placed successfully!</p>
        <p style={styles.emailNote}>
          We sent you an email with your order details at{' '}
          <span style={styles.emailHighlight}>{user?.attributes?.email}</span>
        </p>
      </div>

      <div style={styles.orderDetails}>
        <h3 style={styles.sectionTitle}>Order #{order.order_id}</h3>
        <div style={styles.productList}>
          {order.products.map((product, index) => (
            <div key={`${product.pid}-${index}`} style={styles.productItem}>
              <img
                src={product.thumbLink || "https://via.placeholder.com/60"}
                alt={product.productName}
                style={styles.productImage}
              />
              <div style={styles.productInfo}>
                <h4 style={styles.productName}>{product.productName}</h4>
                <p style={styles.productDetails}>
                  Size: {product.size} | Category: {product.category}
                </p>
                <p style={styles.productPrice}>${parseFloat(product.price).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={styles.totalSection}>
          <p style={styles.total}>
            Total Amount: <span style={styles.totalAmount}>${totalAmount}</span>
          </p>
        </div>
      </div>

      <div style={styles.buttonGroup}>
        <Link to="/orders" style={styles.viewAllLink}>
          View All Orders
        </Link>
        <button
          style={styles.continueShoppingButton}
          onClick={() => window.location.href = '/'}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "2rem auto",
    padding: "2rem",
    backgroundColor: "#fff",
    borderRadius: "16px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
  },
  header: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  heading: {
    fontSize: "2rem",
    color: "#111827",
    marginBottom: "1rem",
  },
  checkmark: {
    fontSize: "3rem",
    color: "#10b981",
    marginBottom: "1rem",
  },
  subheading: {
    fontSize: "1.2rem",
    color: "#4b5563",
    marginBottom: "0.5rem",
  },
  emailNote: {
    fontSize: "1rem",
    color: "#6b7280",
    fontStyle: "italic",
  },
  emailHighlight: {
    color: "#0d9488",
    fontWeight: "500",
  },
  orderDetails: {
    marginTop: "2rem",
  },
  sectionTitle: {
    fontSize: "1.5rem",
    color: "#111827",
    marginBottom: "1rem",
  },
  productList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  productItem: {
    display: "flex",
    padding: "1rem",
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
    gap: "1rem",
  },
  productImage: {
    width: "60px",
    height: "60px",
    objectFit: "cover",
    borderRadius: "4px",
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: "1.1rem",
    color: "#111827",
    marginBottom: "0.5rem",
  },
  productDetails: {
    fontSize: "0.9rem",
    color: "#6b7280",
    marginBottom: "0.5rem",
  },
  productPrice: {
    fontSize: "1rem",
    color: "#059669",
    fontWeight: "bold",
  },
  totalSection: {
    marginTop: "2rem",
    borderTop: "2px solid #e5e7eb",
    paddingTop: "1rem",
  },
  continueShoppingButton: {
    display: "block",
    width: "100%",
    padding: "1rem",
    marginBottom: "1.5rem",
    backgroundColor: "#fff",
    color: "#0d9488",
    border: "2px solid #0d9488",
    borderRadius: "12px",
    fontSize: "1.2rem",
    cursor: "pointer",
    transition: "all 0.3s",
    textAlign: "center",
  },
  total: {
    fontSize: "1.2rem",
    color: "#111827",
    textAlign: "right",
  },
  totalAmount: {
    fontWeight: "bold",
    color: "#059669",
  },
  buttonGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginTop: "2rem",
  },
  viewAllLink: {
    display: "inline-block",
    padding: "0.75rem 1.5rem",
    backgroundColor: "#0d9488",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "8px",
    transition: "background-color 0.3s",
    textAlign: "center",
  },
  continueShoppingButton: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#fff",
    color: "#0d9488",
    border: "2px solid #0d9488",
    borderRadius: "8px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "all 0.3s",
    textAlign: "center",
  },
};

export default OrderConfirmation;
