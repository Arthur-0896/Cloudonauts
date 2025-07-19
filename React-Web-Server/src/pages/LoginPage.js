import React from "react";

function LoginPage({ auth }) {
  const signOutRedirect = () => {
    const clientId = "1geutha5o3v903feg0p86l72ol";
    const logoutUri = "http://localhost:3000";
    const cognitoDomain = "https://us-east-2mdeomlwwp.auth.us-east-2.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  return (
    <div style={{ padding: "2rem" }}>
      <button onClick={() => auth.signinRedirect()}>Sign in</button>
      <button onClick={signOutRedirect} style={{ marginLeft: "1rem" }}>
        Sign out
      </button>
    </div>
  );
}

export default LoginPage;
