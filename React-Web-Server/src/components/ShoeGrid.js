import React from "react";
import ShoeCard from "./ShoeCard";

function ShoeGrid({ shoes }) {
  return (
    <div>
      <h3>Available Shoes:</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
        {shoes.map((shoe) => (
          <ShoeCard key={shoe.id} shoe={shoe} />
        ))}
      </div>
    </div>
  );
}

export default ShoeGrid;
