import React, { useState } from "react";

function UserHeader({ name, onSignOut }) {
  // Track which dropdown is open
  const [openDropdown, setOpenDropdown] = useState(null);
  const handleDropdown = (key) => {
    setOpenDropdown(openDropdown === key ? null : key);
  };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
      <img
        src="/images/cloudonauts-shopping.png"
        alt="Cloudonauts Shopping"
        style={{ height: "120px", width: "auto", objectFit: "contain" }}
      />
      {/* Dummy navbar */}
      <nav style={{ display: "flex", alignItems: "center", gap: "1rem", background: "#f5f5f5", padding: "0.5rem 1.5rem", borderRadius: "8px", justifyContent: "center", flex: 1 }}>
        <a href="#" style={{ textDecoration: "none", color: "#333", fontWeight: "normal", padding: "0.5rem 1rem", background: "none", border: "none", fontSize: "1rem", lineHeight: "1.5", display: "flex", alignItems: "center", height: "40px" }}>Home</a>
        {/* Men Dropdown */}
        <div style={{ position: "relative", height: "40px", display: "flex", alignItems: "center" }}>
          <button type="button" onClick={() => handleDropdown('men')} style={{ background: "none", border: "none", color: "#333", cursor: "pointer", fontSize: "1rem", height: "40px", display: "flex", alignItems: "center" }}>Men ▼</button>
          <div style={{ position: "absolute", top: "2.2rem", left: 0, background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderRadius: "6px", minWidth: "140px", zIndex: 100, display: openDropdown === 'men' ? "block" : "none" }}>
            <a href="#" style={{ display: "block", padding: "0.5rem 1rem", color: "#333", textDecoration: "none" }}>Shoes</a>
            <a href="#" style={{ display: "block", padding: "0.5rem 1rem", color: "#333", textDecoration: "none" }}>Clothing</a>
            <a href="#" style={{ display: "block", padding: "0.5rem 1rem", color: "#333", textDecoration: "none" }}>Sportswear</a>
            <a href="#" style={{ display: "block", padding: "0.5rem 1rem", color: "#333", textDecoration: "none" }}>Sale</a>
          </div>
        </div>
        {/* Women Dropdown */}
        <div style={{ position: "relative", height: "40px", display: "flex", alignItems: "center" }}>
          <button type="button" onClick={() => handleDropdown('women')} style={{ background: "none", border: "none", color: "#333", cursor: "pointer", fontSize: "1rem", height: "40px", display: "flex", alignItems: "center" }}>Women ▼</button>
          <div style={{ position: "absolute", top: "2.2rem", left: 0, background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderRadius: "6px", minWidth: "140px", zIndex: 100, display: openDropdown === 'women' ? "block" : "none" }}>
            <a href="#" style={{ display: "block", padding: "0.5rem 1rem", color: "#333", textDecoration: "none" }}>Shoes</a>
            <a href="#" style={{ display: "block", padding: "0.5rem 1rem", color: "#333", textDecoration: "none" }}>Clothing</a>
            <a href="#" style={{ display: "block", padding: "0.5rem 1rem", color: "#333", textDecoration: "none" }}>Handbags</a>
            <a href="#" style={{ display: "block", padding: "0.5rem 1rem", color: "#333", textDecoration: "none" }}>Sale</a>
          </div>
        </div>
        {/* Kids Dropdown */}
        <div style={{ position: "relative", height: "40px", display: "flex", alignItems: "center" }}>
          <button type="button" onClick={() => handleDropdown('kids')} style={{ background: "none", border: "none", color: "#333", cursor: "pointer", fontSize: "1rem", height: "40px", display: "flex", alignItems: "center" }}>Kids ▼</button>
          <div style={{ position: "absolute", top: "2.2rem", left: 0, background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderRadius: "6px", minWidth: "140px", zIndex: 100, display: openDropdown === 'kids' ? "block" : "none" }}>
            <a href="#" style={{ display: "block", padding: "0.5rem 1rem", color: "#333", textDecoration: "none" }}>Shoes</a>
            <a href="#" style={{ display: "block", padding: "0.5rem 1rem", color: "#333", textDecoration: "none" }}>Clothing</a>
            <a href="#" style={{ display: "block", padding: "0.5rem 1rem", color: "#333", textDecoration: "none" }}>Toys</a>
            <a href="#" style={{ display: "block", padding: "0.5rem 1rem", color: "#333", textDecoration: "none" }}>Sale</a>
          </div>
        </div>
        {/* Accessories Dropdown */}
        <div style={{ position: "relative", height: "40px", display: "flex", alignItems: "center" }}>
          <button type="button" onClick={() => handleDropdown('accessories')} style={{ background: "none", border: "none", color: "#333", cursor: "pointer", fontSize: "1rem", height: "40px", display: "flex", alignItems: "center" }}>Accessories ▼</button>
          <div style={{ position: "absolute", top: "2.2rem", left: 0, background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderRadius: "6px", minWidth: "140px", zIndex: 100, display: openDropdown === 'accessories' ? "block" : "none" }}>
            <a href="#" style={{ display: "block", padding: "0.5rem 1rem", color: "#333", textDecoration: "none" }}>Bags</a>
            <a href="#" style={{ display: "block", padding: "0.5rem 1rem", color: "#333", textDecoration: "none" }}>Hats</a>
            <a href="#" style={{ display: "block", padding: "0.5rem 1rem", color: "#333", textDecoration: "none" }}>Watches</a>
            <a href="#" style={{ display: "block", padding: "0.5rem 1rem", color: "#333", textDecoration: "none" }}>Jewelry</a>
          </div>
        </div>
      </nav>
      {/* <h2 style={{ margin: 0 }}>Welcome, {name}</h2> */}
      <button onClick={onSignOut} style={{ marginLeft: "auto", marginTop: "2rem" }}>
        Sign out
      </button>
    </div>
  );
}

export default UserHeader;
