import React, { useState, useRef } from "react";
import Notification from "../components/Notification";

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
  const [isUploading, setIsUploading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });
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
    setIsUploading(true);

    try {
      const formDataToSend = new FormData();
      
      // Add all product data to FormData
      formDataToSend.append('category', formData.category);
      formDataToSend.append('gender', formData.gender);
      formDataToSend.append('productName', formData.productName);
      formDataToSend.append('size', formData.size);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('count', formData.count);

      // Add image if one was selected
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
      
      // Send everything to Python backend
      const response = await fetch(`${apiBaseUrl}/add-product`, {
        method: "POST",
        body: formDataToSend  // Don't set Content-Type header, let browser set it with boundary
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Failed to add product");
      }

      setNotification({
        show: true,
        message: "Product added successfully!",
        type: "success"
      });

      // Redirect after a short delay to show the success message
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);

    } catch (err) {
      console.error(err);
      setNotification({
        show: true,
        message: err.message || "Failed to add product",
        type: "error"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ padding: "0rem", maxWidth: "600px", margin: "auto" }}>
      {notification.show && (
        <Notification
          message={notification.message}
          type={notification.type}
          onDismiss={() => setNotification({ ...notification, show: false })}
          autoDismiss={3000}
        />
      )}
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
          disabled={isUploading}
          style={{
            backgroundColor: isUploading ? "#cccccc" : "green",
            color: "white",
            padding: "0.5rem 1rem",
            cursor: isUploading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          {isUploading ? "Adding Product..." : "Finish"}
        </button>
      </form>
    </div>
  );
}

export default AddProductForm;
