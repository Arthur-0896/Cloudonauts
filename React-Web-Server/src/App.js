// App.js
import React from "react";
import { Outlet } from "react-router-dom";
// import { useAuth } from "react-oidc-context";
// import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <div style={{ fontFamily: "Arial", padding: "2rem" }}>
      <Outlet />
    </div>
  );
}

export default App;