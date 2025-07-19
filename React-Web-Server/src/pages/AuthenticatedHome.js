import React, { useEffect, useState } from "react";
import ProductGrid from "../components/ProductGrid";
import UserHeader from "../components/UserHeader";
import useUserTracker from "../hooks/useUserTracker";
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";

function AuthenticatedHome({ auth: propAuth }) {
  const [products, setproducts] = useState([]);
  const [loadingproducts, setLoadingproducts] = useState(true);
  const navigate = useNavigate();
  const outletContext = useOutletContext();
  const auth = propAuth || (outletContext && outletContext.auth);

  useEffect(() => {
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
    console.log("API Base URL:", apiBaseUrl);
    fetch(`${apiBaseUrl}/products`)
      .then((res) => res.json())
      .then((data) => {
        setproducts(data);
        setLoadingproducts(false);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setLoadingproducts(false);
      });
  }, []);

  // Defensive check for auth and auth.user for rendering only
  if (!auth || !auth.user) {
    return (
      <div style={{ padding: "2rem", color: "red" }}>
        <p>User not authenticated. Please sign in.</p>
      </div>
    );
  }
  const name = auth.user?.profile?.name || auth.user?.profile?.email;

  return (
    <div style={{ 
      padding: "2rem", 
      fontFamily: "Arial", 
      position: "relative", 
      minHeight: "100vh",
      backgroundColor: "#e2eeeefe"}}>
    <UserHeader name={name} onSignOut={() => auth.removeUser()} />
    <div style={{
      position: "absolute",
      top: "2rem",
      right: "2rem",
      zIndex: 10
    }}>
      <button
        onClick={() => navigate("/add-product")}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Add Product
      </button>
    </div>
    {loadingproducts ? <p>Loading available products...</p> : <ProductGrid products={products} />}
  </div>
    
  );
}

export default AuthenticatedHome;

 // <div style={{ padding: "2rem", fontFamily: "Arial" }}>
    //   <UserHeader name={name} onSignOut={() => auth.removeUser()} />
    //   {loadingproducts ? <p>Loading available products...</p> : <ProductGrid products={products} />}
    //   <button
    //     onClick={() => navigate("/add-product")}
    //     style={{
    //       padding: "0.5rem 1rem",
    //       backgroundColor: "#4CAF50",
    //       color: "white",
    //       border: "none",
    //       borderRadius: "5px",
    //       cursor: "pointer",
    //       marginLeft: "1rem"
    //     }}
    //   >
    //     Add Product
    //   </button>

    // </div>
