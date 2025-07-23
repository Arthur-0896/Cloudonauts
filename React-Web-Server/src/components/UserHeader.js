import React, { useState } from "react";

function UserHeader({ name, onSignOut, auth }) {
  // Track which dropdown is open
  const [openDropdown, setOpenDropdown] = useState(null);
  const handleDropdown = (key) => {
    setOpenDropdown(openDropdown === key ? null : key);
  };
  const firstName = auth?.user?.profile['custom:FirstName'];
  const lastName = auth?.user?.profile['custom:LastName'];
  const userName = (firstName || lastName)
    ? `${firstName || ''} ${lastName || ''}`.trim()
    : (auth?.user?.profile.name || auth?.user?.profile.email);
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "1.5rem" }}>
      <img
        src="/images/cloudonauts-shopping.png"
        alt="Cloudonauts Shopping"
        style={{ height: "120px", width: "auto", objectFit: "contain" }}
      />
      {/* Dummy navbar */}
      <nav style={{ display: "flex", alignItems: "center", gap: "1rem", background: "#f5f5f5", padding: "0.5rem 1.5rem", borderRadius: "8px", justifyContent: "center", flex: 1 }}>
        <a href="/" style={{ textDecoration: "none", color: "#333", fontWeight: "normal", padding: "0.5rem 1rem", background: "none", border: "none", fontSize: "1rem", lineHeight: "1.5", display: "flex", alignItems: "center", height: "40px" }}>Home</a>
        <a href="/signup" style={{ textDecoration: "none", color: "#333", fontWeight: "normal", padding: "0.5rem 1rem", background: "none", border: "none", fontSize: "1rem", lineHeight: "1.5", display: "flex", alignItems: "center", height: "40px" }}>Sign Up</a>
        {/* Men Dropdown */}
        <div
          style={{ position: "relative", height: "40px", display: "flex", alignItems: "center" }}
          onMouseEnter={() => setOpenDropdown('men')}
          onMouseLeave={() => setOpenDropdown(null)}
        >
          <button type="button" style={{ background: "none", border: "none", color: "#333", cursor: "pointer", fontSize: "1rem", height: "40px", display: "flex", alignItems: "center" }}>Men ▼</button>
          <div style={{ position: "absolute", top: "2.2rem", left: 0, background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderRadius: "6px", minWidth: "140px", zIndex: 100, display: openDropdown === 'men' ? "block" : "none" }}>
            <a href="#" style={{ display: "block", padding: "0.5rem 1rem", color: "#333", textDecoration: "none" }}>Shoes</a>
            <a href="#" style={{ display: "block", padding: "0.5rem 1rem", color: "#333", textDecoration: "none" }}>Clothing</a>
            <a href="#" style={{ display: "block", padding: "0.5rem 1rem", color: "#333", textDecoration: "none" }}>Sportswear</a>
            <a href="#" style={{ display: "block", padding: "0.5rem 1rem", color: "#333", textDecoration: "none" }}>Sale</a>
          </div>
        </div>
        {/* Women Dropdown */}
        <div
          style={{ position: "relative", height: "40px", display: "flex", alignItems: "center" }}
          onMouseEnter={() => setOpenDropdown('women')}
          onMouseLeave={() => setOpenDropdown(null)}
        >
          <button type="button" style={{ background: "none", border: "none", color: "#333", cursor: "pointer", fontSize: "1rem", height: "40px", display: "flex", alignItems: "center" }}>Women ▼</button>
          <div style={{ position: "absolute", top: "2.2rem", left: 0, background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderRadius: "6px", minWidth: "140px", zIndex: 100, display: openDropdown === 'women' ? "block" : "none" }}>
            <a href="#" style={{ display: "block", padding: "0.5rem 1rem", color: "#333", textDecoration: "none" }}>Shoes</a>
            <a href="#" style={{ display: "block", padding: "0.5rem 1rem", color: "#333", textDecoration: "none" }}>Clothing</a>
            <a href="#" style={{ display: "block", padding: "0.5rem 1rem", color: "#333", textDecoration: "none" }}>Handbags</a>
            <a href="#" style={{ display: "block", padding: "0.5rem 1rem", color: "#333", textDecoration: "none" }}>Sale</a>
          </div>
        </div>
        {/* Kids Dropdown */}
        <div
          style={{ position: "relative", height: "40px", display: "flex", alignItems: "center" }}
          onMouseEnter={() => setOpenDropdown('kids')}
          onMouseLeave={() => setOpenDropdown(null)}
        >
          <button type="button" style={{ background: "none", border: "none", color: "#333", cursor: "pointer", fontSize: "1rem", height: "40px", display: "flex", alignItems: "center" }}>Kids ▼</button>
          <div style={{ position: "absolute", top: "2.2rem", left: 0, background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderRadius: "6px", minWidth: "140px", zIndex: 100, display: openDropdown === 'kids' ? "block" : "none" }}>
            <a href="#" style={{ display: "block", padding: "0.5rem 1rem", color: "#333", textDecoration: "none" }}>Shoes</a>
            <a href="#" style={{ display: "block", padding: "0.5rem 1rem", color: "#333", textDecoration: "none" }}>Clothing</a>
            <a href="#" style={{ display: "block", padding: "0.5rem 1rem", color: "#333", textDecoration: "none" }}>Toys</a>
            <a href="#" style={{ display: "block", padding: "0.5rem 1rem", color: "#333", textDecoration: "none" }}>Sale</a>
          </div>
        </div>
        {/* Accessories Dropdown */}
        <div
          style={{ position: "relative", height: "40px", display: "flex", alignItems: "center" }}
          onMouseEnter={() => setOpenDropdown('accessories')}
          onMouseLeave={() => setOpenDropdown(null)}
        >
          <button type="button" style={{ background: "none", border: "none", color: "#333", cursor: "pointer", fontSize: "1rem", height: "40px", display: "flex", alignItems: "center" }}>Accessories ▼</button>
          <div style={{ position: "absolute", top: "2.2rem", left: 0, background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderRadius: "6px", minWidth: "140px", zIndex: 100, display: openDropdown === 'accessories' ? "block" : "none" }}>
            <a href="#" style={{ display: "block", padding: "0.5rem 1rem", color: "#333", textDecoration: "none" }}>Bags</a>
            <a href="#" style={{ display: "block", padding: "0.5rem 1rem", color: "#333", textDecoration: "none" }}>Hats</a>
            <a href="#" style={{ display: "block", padding: "0.5rem 1rem", color: "#333", textDecoration: "none" }}>Watches</a>
            <a href="#" style={{ display: "block", padding: "0.5rem 1rem", color: "#333", textDecoration: "none" }}>Jewelry</a>
          </div>
        </div>
      </nav>
      {/* Sign in button with user icon */}
      <button
        style={{
          marginLeft: "auto",
          marginTop: "1rem",
          padding: "0.5rem 1.2rem",
          backgroundColor: "#03b723",
          color: "#fff",
          border: "none",
          borderRadius: "24px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          fontSize: "1rem",
          transition: "background-color 0.2s"
        }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = "#04db2a"}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = "#03b723"}
        onClick={() => {
          window.location.href = "/signup";
        }}
      >
        <i className="fa fa-circle-user" style={{ fontSize: "1.2rem" }}></i>
        {userName ? userName : "Sign in"}
      </button>
      <button
        style={{
          marginLeft: "1rem",
          marginTop: "1rem",
          padding: "0.5rem 1.2rem",
          backgroundColor: "#0d9488",
          color: "#fff",
          border: "none",
          borderRadius: "24px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          fontSize: "1rem",
          transition: "background-color 0.2s"
        }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = "#0f766e"}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = "#0d9488"}
        onClick={() => {
          window.location.href = "/cart";
        }}
      >
        <i className="fa fa-shopping-cart" style={{ fontSize: "1.2rem" }}></i>
        View Cart
      </button>

    </div>

  );
}

export default UserHeader;
