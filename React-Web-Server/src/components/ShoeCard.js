import React from "react";

function ShoeCard({ shoe }) {
  const count = shoe.inventory?.count ?? 0;
  const inStock = count > 0;
  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
      <img
        src={shoe.s3link}
        alt={shoe.name}
        style={{ 
          width: "100%", 
          height: "150px", 
          objectFit: "cover", 
          marginBottom: "0.5rem",
          border: "3px solid #181919ff",      // <-- Change border color and thickness
          borderRadius: "12px"
        }}
      />
      <h4>{shoe.name}</h4>
      <p><strong>Category:</strong> {shoe.category}</p>
      <p><strong>Gender:</strong> {shoe.gender}</p>
      <p><strong>Product Name:</strong> {shoe.productName}</p>
      <p><strong>Size:</strong> {shoe.size}</p>
      <p><strong>Price:</strong> ${shoe.price}</p>
      
      <p>
        {shoe.inventory.count > 0
          ? <span style={{ color: "green" }}>IN STOCK: {shoe.inventory.count}</span>
          : <span style={{ color: "red" }}>NOT IN STOCK</span>
        }
      </p>
    </div>
  );
}

export default ShoeCard;
