import React from "react";

function ShoeCard({ shoe }) {
  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
      <img
        src={shoe.s3link}
        alt={shoe.name}
        style={{ width: "100%", height: "150px", objectFit: "cover", marginBottom: "0.5rem" }}
      />
      <h4>{shoe.name}</h4>
      <p><strong>Size:</strong> {shoe.size}</p>
    </div>
  );
}

export default ShoeCard;
