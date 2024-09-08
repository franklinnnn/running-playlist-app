import { useState, useEffect } from "react";
import axios from "axios";

export function useUser() {
  const [user, setUser] = useState(null);
  const [errorUser, setErrorUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await axios.get("/api/user");
        setUser(response.data);
      } catch (err) {
        setErrorUser(err.response ? err.response.data.error : err.message);
      } finally {
        setLoadingUser(false);
      }
    }

    fetchUser();
  }, []);

  return { user, errorUser, loadingUser };
}
