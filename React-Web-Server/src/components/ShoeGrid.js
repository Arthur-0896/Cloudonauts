import React from "react";
import ShoeCard from "./ShoeCard";

function ShoeGrid({ shoes }) {
  return (
    <div>
      <h3>Available Shoes:</h3>
      <div style={{ display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
        gap: "1rem",
        backgroundColor: "#c0d0cdff", // Light gray background
        padding: "2rem",            // Add padding around grid
        borderRadius: "16px"
        }}>
        {shoes.map((shoe) => (
          <ShoeCard key={shoe.id} shoe={shoe} />
        ))}
      </div>
    </div>
  );
}

export default ShoeGrid;
