import React from "react";

function productCard({ product }) {
  const count = product.inventory?.count ?? 0;
  const inStock = count > 0;
  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
      <img
        src={product.thumbLink}
        alt={product.name}
        style={{ 
          width: "100%", 
          height: "100px", 
          objectFit: "cover", 
          marginBottom: "0.5rem",
          border: "3px solid #181919ff",      // <-- Change border color and thickness
          borderRadius: "12px"
        }}
      />
      <h4>{product.name}</h4>
      <p><strong>Category:</strong> {product.category}</p>
      <p><strong>Gender:</strong> {product.gender}</p>
      <p><strong>Product Name:</strong> {product.productName}</p>
      <p><strong>Size:</strong> {product.size}</p>
      <p><strong>Price:</strong> ${product.price}</p>
      
      <p>
        {product.inventory.count > 0
          ? <span style={{ color: "green" }}>IN STOCK: {product.inventory.count}</span>
          : <span style={{ color: "red" }}>NOT IN STOCK</span>
        }
      </p>
    </div>
  );
}

export default productCard;
