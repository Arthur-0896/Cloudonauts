// App.js
import React from "react";
import { useAuth } from "react-oidc-context";
import { Outlet } from "react-router-dom";
import LoginPage from "./pages/LoginPage";

function App() {
  const auth = useAuth();

  if (auth.isLoading) return <div>Loading auth...</div>;
  if (auth.error) return <div>Error: {auth.error.message}</div>;

  return auth.isAuthenticated ? (
    <div style={{ fontFamily: "Arial", padding: "2rem" }}>
      <Outlet /> {/* 👈 This will render AuthenticatedHome, AddProductForm, etc. */}
    </div>
  ) : (
    <LoginPage auth={auth} />
  );
}

export default App;
