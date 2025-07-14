import React, { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";

function App() {
  const auth = useAuth();
  const [shoes, setShoes] = useState([]);
  const [loadingShoes, setLoadingShoes] = useState(true);

  useEffect(() => {
    if (auth.isAuthenticated) {
      fetch("http://localhost:5000/api/shoes")
        .then((res) => res.json())
        .then((data) => {
          console.log("Fetched shoes:", data); // 👈 This logs the response
          setShoes(data);
          setLoadingShoes(false);
        })
        .catch((err) => {
          console.error("Failed to fetch shoes:", err);
          setLoadingShoes(false);
        });
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
        <h2>Welcome, {name}</h2>

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
