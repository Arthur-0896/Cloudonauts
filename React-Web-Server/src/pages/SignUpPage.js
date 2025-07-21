import React, { useState } from "react";
import {
  CognitoUserPool,
  CognitoUserAttribute
} from "amazon-cognito-identity-js";

console.log("Cognito UserPoolId:", process.env.REACT_APP_COGNITO_USER_POOL_ID);

const poolData = {
  UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
  ClientId: process.env.REACT_APP_COGNITO_CLIENT_ID,
};

let userPool = null;
const missingConfig = !poolData.UserPoolId || !poolData.ClientId;
if (!missingConfig) {
  userPool = new CognitoUserPool(poolData);
}

function SignUpPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (missingConfig) {
      setError("Cognito UserPoolId and ClientId must be set in your .env file.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    const attributeList = [
      new CognitoUserAttribute({ Name: "email", Value: form.email }),
      new CognitoUserAttribute({ Name: "custom:FirstName", Value: form.firstName }),
      new CognitoUserAttribute({ Name: "custom:LastName", Value: form.lastName }),
    ];

    userPool.signUp(
      form.email,
      form.password,
      attributeList,
      null,
      (err, result) => {
        setLoading(false);
        if (err) {
          setError(err.message || JSON.stringify(err));
        } else {
          setSuccess(true);
        }
      }
    );
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: "2rem" }}>
      <h2>Sign Up</h2>
      {missingConfig ? (
        <p style={{ color: "red" }}>
          Cognito UserPoolId and ClientId must be set in your .env file.<br />
          Please update your .env and restart the dev server.
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label>Email:</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required style={{ width: "100%" }} />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label>Password:</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} required style={{ width: "100%" }} />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label>First Name:</label>
            <input name="firstName" value={form.firstName} onChange={handleChange} required style={{ width: "100%" }} />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label>Last Name:</label>
            <input name="lastName" value={form.lastName} onChange={handleChange} required style={{ width: "100%" }} />
          </div>
          <button type="submit" disabled={loading} style={{ backgroundColor: "#03b723", color: "#fff", padding: "0.5rem 1rem" }}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>Sign up successful! Please check your email to confirm your account.</p>}
    </div>
  );
}

export default SignUpPage;