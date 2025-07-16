// src/AddProductForm.jsx
import React, { useState } from "react";

function AddProductForm() {
  const [formData, setFormData] = useState({
    category: "",
    gender: "",
    productName: "",
    size: "",
    price: "",
    iid: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      alert("Product added!");
      window.location.href = "/";  // Redirect to homepage
    } catch (err) {
      alert("Failed to add product");
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        {["category", "gender", "productName", "size", "price", "iid"].map((field) => (
          <div key={field} style={{ marginBottom: "1rem" }}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
            <input
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>
        ))}
        <button type="submit" style={{ backgroundColor: "green", color: "white", padding: "0.5rem 1rem" }}>
          Finish
        </button>
      </form>
    </div>
  );
}

export default AddProductForm;
