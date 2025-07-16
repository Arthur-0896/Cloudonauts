import React, { useEffect, useState } from "react";
import ShoeGrid from "../components/ShoeGrid";
import UserHeader from "../components/UserHeader";
import useUserTracker from "../hooks/useUserTracker";

function AuthenticatedHome({ auth }) {
  const [shoes, setShoes] = useState([]);
  const [loadingShoes, setLoadingShoes] = useState(true);

  const name = auth.user?.profile?.name || auth.user?.profile?.email;
  useUserTracker(auth);

  useEffect(() => {
    fetch("http://localhost:5000/api/shoes")
      .then((res) => res.json())
      .then((data) => {
        setShoes(data);
        setLoadingShoes(false);
      })
      .catch((err) => {
        console.error("Failed to fetch shoes:", err);
        setLoadingShoes(false);
      });
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <UserHeader name={name} onSignOut={() => auth.removeUser()} />
      {loadingShoes ? <p>Loading available shoes...</p> : <ShoeGrid shoes={shoes} />}
    </div>
  );
}

export default AuthenticatedHome;
