// App.js
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import UserHeader from "./components/UserHeader";

function App() {
  const [allProducts, setAllProducts] = useState([]);
  const auth = useAuth();
  return (
    <div 
    style={{ fontFamily: "Arial" }}>
      <UserHeader auth={auth} />
      <Outlet context={{ allProducts, setAllProducts }} />
    </div>
  );
}

export default App;