import React, { useEffect, useState } from "react";
import ShoeGrid from "../components/ShoeGrid";
import UserHeader from "../components/UserHeader";
import useUserTracker from "../hooks/useUserTracker";
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";

function AuthenticatedHome({ auth: propAuth }) {
  const [shoes, setShoes] = useState([]);
  const [loadingShoes, setLoadingShoes] = useState(true);
  const navigate = useNavigate();
  const outletContext = useOutletContext();
  const auth = propAuth || (outletContext && outletContext.auth);

  useEffect(() => {
    fetch("http://localhost:5000/api/shoes")
      .then((res) => res.json())
      .then((data) => {
        setShoes(data);
        setLoadingShoes(false);
      })
      .catch((err) => {
        console.error("Failed to fetch shoes:", err);
        setLoadingShoes(false);
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
    {loadingShoes ? <p>Loading available shoes...</p> : <ShoeGrid shoes={shoes} />}
  </div>
    
  );
}

export default AuthenticatedHome;

 // <div style={{ padding: "2rem", fontFamily: "Arial" }}>
    //   <UserHeader name={name} onSignOut={() => auth.removeUser()} />
    //   {loadingShoes ? <p>Loading available shoes...</p> : <ShoeGrid shoes={shoes} />}
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
