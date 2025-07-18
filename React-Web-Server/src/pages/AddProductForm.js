import React, { useState, useRef } from "react";

function AddProductForm() {
  const [formData, setFormData] = useState({
    category: "",
    gender: "",
    productName: "",
    size: "",
    price: "",
    count: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setImageFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setImageFile(e.dataTransfer.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Prepare JSON payload (no image for backend API)
  const payload = {
    category: formData.category,
    gender: formData.gender,
    productName: formData.productName,
    size: formData.size,
    price: parseFloat(formData.price),
    count: parseInt(formData.count, 10)
  };
    // const payload = new FormData();
    // for (const key in formData) payload.append(key, formData[key]);
    // if (imageFile) payload.append("image", imageFile);

    try {
      const res = await fetch("http://localhost:5000/api/add-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (res.ok) {
        alert("Product is Added");
        window.location.href = "/";
      } else {
        alert(result.error || "Failed to add product");
      }
    } catch (err) {
      alert("Failed to add product");
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {["category", "gender", "productName", "size", "price", "count"].map((field) => (
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

        <div
          onClick={triggerFileSelect}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: dragActive ? "2px dashed #007bff" : "2px dashed #ccc",
            borderRadius: "8px",
            padding: "2rem",
            textAlign: "center",
            marginBottom: "1rem",
            backgroundColor: dragActive ? "#f0f8ff" : "#fafafa",
            cursor: "pointer",
            transition: "0.2s ease",
          }}
        >
          {imageFile ? (
            <p><strong>Selected:</strong> {imageFile.name}</p>
          ) : (
            <p>Drag & drop image here, or click to browse</p>
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>

        <button
          type="submit"
          style={{ backgroundColor: "green", color: "white", padding: "0.5rem 1rem" }}
        >
          Finish
        </button>
      </form>
    </div>
  );
}

export default AddProductForm;
