import { useState, useEffect } from "react";
import axios from "axios";

export function useRecentlyPlayed() {
  const [tracks, setTracks] = useState([]);
  const [name, setName] = useState("Recently Played");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecentlyPlayed() {
      try {
        const response = await axios.get("/api/user/recently-played");
        setTracks(response.data.items);
      } catch (err) {
        setError(err.response ? err.response.data.error : err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRecentlyPlayed();
  }, []);

  return { tracks, name, error, loading };
}
