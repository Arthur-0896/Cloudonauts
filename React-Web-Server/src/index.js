import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "react-oidc-context";
import AddProductForm from "./AddProductForm.js"; //added this
import { BrowserRouter, Routes, Route } from "react-router-dom";


const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-2.amazonaws.com/us-east-2_mDEOMLwWP",
  client_id: "1geutha5o3v903feg0p86l72ol",
  redirect_uri: "http://localhost:3000/",
  response_type: "code",
  scope: "email openid phone",
};

const root = ReactDOM.createRoot(document.getElementById("root"));

// wrap the application with AuthProvider
root.render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/add-product" element={<AddProductForm />} />
        </Routes>
      </BrowserRouter> 
    </AuthProvider>
  </React.StrictMode>
);

