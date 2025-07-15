import React from "react";

function UserHeader({ name, onSignOut }) {
  return (
    <div>
      <h2>Welcome, {name}</h2>
      <button onClick={onSignOut} style={{ marginTop: "2rem" }}>
        Sign out
      </button>
    </div>
  );
}

export default UserHeader;
