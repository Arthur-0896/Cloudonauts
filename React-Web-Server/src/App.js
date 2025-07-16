import React from "react";
import { useAuth } from "react-oidc-context";
import AuthenticatedHome from "./pages/AuthenticatedHome"
import LoginPage from "./pages/LoginPage";

function App() {
  const auth = useAuth();

  if (auth.isLoading) return <div>Loading auth...</div>;
  if (auth.error) return <div>Error: {auth.error.message}</div>;

  return auth.isAuthenticated ? <AuthenticatedHome auth={auth} /> : <LoginPage auth={auth} />;
}

export default App;
