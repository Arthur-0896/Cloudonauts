// App.js
import React from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import UserHeader from "./components/UserHeader";

function App() {
  const auth = useAuth();
  return (
    <div style={{ fontFamily: "Arial" }}>
      <UserHeader auth={auth} />
      <Outlet />
    </div>
  );
}

export default App;