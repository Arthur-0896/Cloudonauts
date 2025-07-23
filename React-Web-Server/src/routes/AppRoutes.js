// routes/AppRoutes.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import App from "../App";
import AuthenticatedHome from "../pages/AuthenticatedHome";
import AddProductForm from "../pages/AddProductForm";
import LoginPage from "../pages/LoginPage";
import SignUpPage from "../pages/SignUpPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<AuthenticatedHome />} />
        <Route path="add-product" element={<AddProductForm />} />
        <Route path="signup" element={<SignUpPage />} />
        <Route path="login" element={<LoginPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
