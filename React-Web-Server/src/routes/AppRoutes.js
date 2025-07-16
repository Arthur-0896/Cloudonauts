// src/routes/AppRoutes.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import AuthenticatedHome from "../pages/AuthenticatedHome";
import AddProductForm from "../pages/AddProductForm"; // or components if it's there

function AppRoutes({ auth }) {
  return (
    <Routes>
      <Route path="/" element={<AuthenticatedHome auth={auth} />} />
      <Route path="/add-product" element={<AddProductForm />} />
    </Routes>
  );
}

export default AppRoutes;
