import { useState, useEffect } from "react";
import axios from "axios";

export function useUserPlaylists() {
  const [playlists, setPlaylists] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserPlaylists() {
      try {
        const response = await axios.get("/api/user/playlists");
        setPlaylists(response.data.items);
      } catch (err) {
        setError(err.response ? err.response.data.error : err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUserPlaylists();
  }, []);

  return { playlists, error, loading };
}
