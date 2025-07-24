import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Notification from "./Notification";
// No need to import Cookies here for cart count as it's handled in AuthContext

function UserHeader() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showLogoutNotification, setShowLogoutNotification] = useState(false);
  const { user, logout, cartCount } = useAuth(); // Get cartCount from AuthContext

  const firstName = user?.attributes?.["custom:FirstName"];
  const email = user?.attributes?.email;

  // No need for the useEffect for cartCount here anymore, it's managed by AuthContext

  const handleDropdown = (key) => {
    setOpenDropdown(openDropdown === key ? null : key);
  };

  // Handle click outside of user dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      const userDropdown = document.querySelector('.user-dropdown-container');
      if (userDropdown && !userDropdown.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    if (openDropdown === 'user') {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "1.5rem" }}>
      <img
        src="/images/cloudonauts-shopping.png"
        alt="Cloudonauts Shopping"
        style={{ height: "120px", width: "auto", objectFit: "contain" }}
      />

      {/* NAVIGATION */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          background: "#f5f5f5",
          padding: "0.5rem 1.5rem",
          borderRadius: "8px",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <a
          href="/"
          style={{
            textDecoration: "none",
            color: "#333",
            fontWeight: "normal",
            padding: "0.5rem 1rem",
            background: "none",
            border: "none",
            fontSize: "1rem",
            lineHeight: "1.5",
            display: "flex",
            alignItems: "center",
            height: "40px",
          }}
        >
          Home
        </a>

        {/* DROPDOWNS */}
        {["men", "women", "kids", "accessories"].map((category) => (
          <div
            key={category}
            style={{
              position: "relative",
              height: "40px",
              display: "flex",
              alignItems: "center",
            }}
            onMouseEnter={() => handleDropdown(category)}
            onMouseLeave={() => handleDropdown(null)}
          >
            <button
              type="button"
              style={{
                background: "none",
                border: "none",
                color: "#333",
                cursor: "pointer",
                fontSize: "1rem",
                height: "40px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)} ▼
            </button>
            <div
              style={{
                position: "absolute",
                top: "2.2rem",
                left: 0,
                background: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                borderRadius: "6px",
                minWidth: "140px",
                zIndex: 100,
                display: openDropdown === category ? "block" : "none",
              }}
            >
              {(category === "accessories"
                ? ["Bags", "Hats", "Watches", "Jewelry"]
                : category === "women"
                  ? ["Shoes", "Clothing", "Handbags", "Sale"]
                  : category === "kids"
                    ? ["Shoes", "Clothing", "Toys", "Sale"]
                    : ["Shoes", "Clothing", "Sportswear", "Sale"]
              ).map((item) => (
                <a
                  key={item}
                  href="#"
                  style={{
                    display: "block",
                    padding: "0.5rem 1rem",
                    color: "#333",
                    textDecoration: "none",
                  }}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* USER BUTTON */}
      <div style={{ display: "flex", alignItems: "center", marginTop: "1rem", gap: "0.5rem" }}>
        {/* LOGIN BUTTON */}
        <div className="user-dropdown-container" style={{ position: "relative" }}>
          <button
            style={{
              backgroundColor: "#03b723",
              color: "#fff",
              border: "none",
              borderRadius: "24px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              fontSize: "1rem",
              transition: "background-color 0.2s",
              width: user ? "auto" : "106px",
              height: "44px",
              padding: "0 1rem",
              gap: "0.5rem",
              userSelect: "none",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#04db2a")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#03b723")}
            onClick={() => {
              if (!user) {
                window.location.href = "/login";
              } else {
                handleDropdown("user");
              }
            }}
            title={user ? `Hello, ${firstName}` : "Log in"}
          >
            <i
              className="fa fa-circle-user"
              style={{
                fontSize: "1.2rem",
                marginLeft: "0.2rem",
              }}
            ></i>

            {!user && "Log in"}
            {user && (
              <>
                <span style={{ marginLeft: "0.3rem" }}>{firstName}</span>
                <i
                  className="fa fa-chevron-down"
                  style={{ fontSize: "0.8rem", marginLeft: "0.3rem" }}
                ></i>
              </>
            )}
          </button>

          {user && openDropdown === "user" && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 0.5rem)",
                right: 0,
                background: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                borderRadius: "6px",
                minWidth: "140px",
                zIndex: 100,
              }}
            >
              <button
                onClick={() => {
                  window.location.href = "/orders";
                  setOpenDropdown(null);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  width: "100%",
                  padding: "0.5rem 1rem",
                  border: "none",
                  background: "none",
                  color: "#333",
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: "1rem",
                  borderBottom: "1px solid #eee",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <i className="fa fa-shopping-bag" style={{ fontSize: "1rem" }}></i>
                My Orders
              </button>
              <button
                onClick={() => {
                  logout();
                  setOpenDropdown(null);
                  window.location.href = '/?logout=true';
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  width: "100%",
                  padding: "0.5rem 1rem",
                  border: "none",
                  background: "none",
                  color: "#333",
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: "1rem",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <i className="fa fa-sign-out" style={{ fontSize: "1rem" }}></i>
                Logout
              </button>
            </div>
          )}
        </div>

        {/* CART BUTTON */}
        <div style={{ position: "relative" }}>
          <button
            style={{
              padding: "0.5rem",
              backgroundColor: "#0d9488",
              color: "#fff",
              border: "none",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
              transition: "background-color 0.2s",
              width: "44px",
              height: "44px",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0f766e")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0d9488")}
            onClick={() => {
              window.location.href = "/cart";
            }}
            title="View Cart"
          >
            <i className="fa fa-shopping-cart"></i>
          </button>

          {cartCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-4px",
                right: "-4px",
                backgroundColor: "red",
                color: "white",
                borderRadius: "50%",
                width: "18px",
                height: "18px",
                fontSize: "0.75rem",
                fontWeight: "bold",
                lineHeight: "18px",
                textAlign: "center",
                userSelect: "none",
              }}
            >
              {cartCount}
            </span>
          )}
        </div>
      </div>

    </div>
  );
}

export default UserHeader;