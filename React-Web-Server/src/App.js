import React, { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";
 


function App() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [shoes, setShoes] = useState([]);
  const [loadingShoes, setLoadingShoes] = useState(true);

  // useEffect(() => {
  //   if (auth.isAuthenticated) {
  //     fetch("http://localhost:5000/api/shoes")
  //       .then((res) => res.json())
  //       .then((data) => {
  //         console.log("Fetched shoes:", data); // 👈 This logs the response
  //         setShoes(data);
  //         setLoadingShoes(false);
  //       })
  //       .catch((err) => {
  //         console.error("Failed to fetch shoes:", err);
  //         setLoadingShoes(false);
  //       });

  useEffect(() => {
  if (auth.isAuthenticated && auth.user) {
    const fetchShoes = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/shoes");
        const data = await res.json();
        console.log("Fetched shoes:", data);
        console.log("Type of data:", typeof data);
        if (Array.isArray(data)) {
          setShoes(data);
        } else {
          console.error("Shoes data is not an array:", data);
          setShoes([]); // Prevent further issues by setting empty array
        }
      } catch (err) {
        console.error("Failed to fetch shoes:", err);
        setShoes([]); // Fallback
      } finally {
        setLoadingShoes(false);
      }
    };


    const sendUserToBackend = async () => {
    const idToken = auth.user?.id_token;
    const profile = auth.user?.profile;

    const userPayload = {
      sub: profile.sub, // unique Cognito user ID
      email: profile.email,
      name: profile.name,
    };

    try {
      const res = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`, // send token for backend verification
        },
        body: JSON.stringify(userPayload),
      });

      const result = await res.json();
      console.log("User tracked in DB:", result);
    } catch (err) {
      console.error("Failed to send user to backend:", err);
    }
  };
  fetchShoes();
  sendUserToBackend();
        
    }
  }, [auth.isAuthenticated]);

  const signOutRedirect = () => {
    const clientId = "1geutha5o3v903feg0p86l72ol";
    const logoutUri = "http://localhost:3000";
    const cognitoDomain = "https://us-east-2mdeomlwwp.auth.us-east-2.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  if (auth.isLoading) return <div>Loading auth...</div>;
  if (auth.error) return <div>Error: {auth.error.message}</div>;

  if (auth.isAuthenticated) {
    const name = auth.user?.profile?.name || auth.user?.profile?.email;

    return (
      <div style={{ padding: "2rem", fontFamily: "Arial" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>Welcome, {name}</h2>
          <button
            style={{ padding: "0.5rem 1rem", backgroundColor: "#4f46e5", color: "white", borderRadius: "5px" }}
            onClick={() => navigate("/add-product")}
          >
            Add Product
          </button>
        </div>

        {loadingShoes ? (
          <p>Loading available shoes...</p>
        ) : (
          <div>
            <h3>Available Shoes:</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              {shoes.map((shoe) => (
                <div key={shoe.id} style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
                  <img
                    src={shoe.s3link}
                    alt={shoe.name}
                    style={{ width: "100%", height: "150px", objectFit: "cover", marginBottom: "0.5rem" }}
                  />
                  <h4>{shoe.name}</h4>
                  <p><strong>Size:</strong> {shoe.size}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <button onClick={() => auth.removeUser()} style={{ marginTop: "2rem" }}>
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <button onClick={() => auth.signinRedirect()}>Sign in</button>
      <button onClick={signOutRedirect} style={{ marginLeft: "1rem" }}>
        Sign out
      </button>
    </div>
  );
}

export default App;
