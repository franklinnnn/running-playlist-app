import { useState, useEffect } from "react";
import axios from "axios";

export function useAccessToken() {
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAccessToken() {
      try {
        const response = await axios.get("/api/auth/user/token");
        setAccessToken(response.data.accessToken);
      } catch (err) {
        console.error("Error fetching access token:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchAccessToken();
  }, []);

  return { accessToken, loading, error };
}
