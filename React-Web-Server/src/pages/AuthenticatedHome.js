import React, { useEffect, useState } from "react";
import ProductGrid from "../components/ProductGrid";
import { useNavigate, useOutletContext } from "react-router-dom";


function AuthenticatedHome({ auth: propAuth }) {
  const { allProducts, setAllProducts } = useOutletContext(); 
  const [loadingproducts, setLoadingproducts] = useState(true);
  const navigate = useNavigate();
  // No authentication logic

  useEffect(() => {
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
    console.log("API Base URL:", apiBaseUrl);
    fetch(`${apiBaseUrl}/products`)
      .then((res) => res.json())
      .then((data) => {
        setAllProducts(data);
        setLoadingproducts(false);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setLoadingproducts(false);
      });
  }, [setAllProducts]);

  // No authentication check

  return (
    <div style={{ 
      padding: "2rem", 
      fontFamily: "Arial", 
      position: "relative", 
      minHeight: "100vh",
      backgroundColor: "#B6EDFD"}}>
      {/* UserHeader removed to prevent duplicate header */}
      <div style={{
        position: "absolute",
        top: "2rem",
        right: "2rem",
        zIndex: 10
      }}>
      </div>
      {loadingproducts ? <p>Loading available products...</p> : <ProductGrid products={allProducts} />}
    </div>
  );
}

export default AuthenticatedHome;
