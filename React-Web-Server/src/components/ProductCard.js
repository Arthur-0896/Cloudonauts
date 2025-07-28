import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const inStock = product.inventory > 0;
  const [isHovered, setIsHovered] = React.useState(false);

  const handleClick = () => {
    try {
      navigate(`/product/${product.pid}`);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <div 
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        width: "250px",
        height: "400px",
        backgroundColor: "#ffffff",
        border: "1px solid #e5e7eb",
        padding: "1.5rem",
        borderRadius: "15px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        boxShadow: isHovered 
          ? "0 12px 20px rgba(0, 0, 0, 0.1)" 
          : "0 4px 6px rgba(0, 0, 0, 0.05)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        transform: isHovered ? "translateY(-5px)" : "translateY(0)",
      }}
    >
      <div style={{
        width: "100%",
        height: "200px",
        overflow: "hidden",
        borderRadius: "10px",
        marginBottom: "1rem"
      }}>
        <img
          src={product.thumbLink}
          alt={product.productName}
          style={{ 
            width: "100%", 
            height: "100%", 
            objectFit: "cover",
            borderRadius: "10px",
            transition: "transform 0.3s ease"
          }}
        />
      </div>

      <h3 style={{
        fontSize: "1.25rem",
        fontWeight: "600",
        color: "#1f2937",
        marginBottom: "0.75rem",
        lineHeight: "1.2"
      }}>{product.productName}</h3>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "0.5rem",
        fontSize: "0.9rem",
        color: "#4b5563",
        marginBottom: "auto"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
          <span style={{ fontWeight: "500" }}>Category:</span>
          <span>{product.category}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
          <span style={{ fontWeight: "500" }}>Gender:</span>
          <span>{product.gender}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
          <span style={{ fontWeight: "500" }}>Size:</span>
          <span>{product.size}</span>
        </div>
      </div>

      <div style={{
        marginTop: "1rem",
        padding: "0.75rem",
        borderTop: "1px solid #e5e7eb",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div style={{
          fontSize: "1.25rem",
          fontWeight: "700",
          color: "#1f2937"
        }}>
          ${parseFloat(product.price).toFixed(2)}
        </div>
        
        <div style={{
          padding: "0.5rem 0.75rem",
          borderRadius: "full",
          fontSize: "0.875rem",
          fontWeight: "500",
          backgroundColor: product.inventory > 0 ? "#dcfce7" : "#fee2e2",
          color: product.inventory > 0 ? "#166534" : "#991b1b"
        }}>
          {product.inventory > 0
            ? `In Stock (${product.inventory})`
            : "Out of Stock"
          }
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
