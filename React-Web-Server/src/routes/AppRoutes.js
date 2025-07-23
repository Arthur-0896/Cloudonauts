// routes/AppRoutes.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import App from "../App";
import AuthenticatedHome from "../pages/AuthenticatedHome";
import AddProductForm from "../pages/AddProductForm";
import LoginPage from "../pages/LoginPage";
import SignUpPage from "../pages/SignUpPage";
import Cart from "../pages/Cart";
import OrdersPage from "../pages/OrdersPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<AuthenticatedHome />} />
        <Route path="add-product" element={<AddProductForm />} />
        <Route path="signup" element={<SignUpPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="cart" element={<Cart />} />
        <Route path="orders" element={<OrdersPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
