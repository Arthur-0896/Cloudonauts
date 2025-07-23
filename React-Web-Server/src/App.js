// App.js
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import UserHeader from "./components/UserHeader";
import { AuthProvider } from "./context/AuthContext";

function App() {
  const [allProducts, setAllProducts] = useState([]);
  return (
    <AuthProvider>
      <div style={{ fontFamily: "Arial" }}>
        <UserHeader />
        <Outlet context={{ allProducts, setAllProducts }} />
      </div>
    </AuthProvider>
  );
}

export default App;