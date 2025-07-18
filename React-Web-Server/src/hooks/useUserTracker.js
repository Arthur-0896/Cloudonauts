import { useEffect } from "react";

const useUserTracker = (auth) => {
  useEffect(() => {
    if (!auth.isAuthenticated) return;

    const sendUserToBackend = async () => {
      const idToken = auth.user?.id_token;
      const profile = auth.user?.profile;

      const userPayload = {
        sub: profile.sub,
        email: profile.email,
        name: profile.name,
      };

      try {
        const res = await fetch("http://localhost:5000/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify(userPayload),
        });

        const result = await res.json();
        console.log("User tracked in DB:", result);
      } catch (err) {
        console.error("Failed to send user to backend:", err);
      }
    };

    sendUserToBackend();
  }, [auth]);
};

export default useUserTracker;
