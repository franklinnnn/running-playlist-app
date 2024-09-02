import { useState, useEffect } from "react";
import axios from "axios";

export function useUser() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await axios.get("/api/user");
        setUser(response.data);
      } catch (err) {
        setError(err.response ? err.response.data.error : err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  return { user, error, loading };
}
