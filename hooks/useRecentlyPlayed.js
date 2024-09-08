import { useState, useEffect } from "react";
import axios from "axios";

export function useRecentlyPlayed() {
  const [tracks, setTracks] = useState([]);
  const [name, setName] = useState("Recently Played");
  const [errorRecentlyPlayed, setErrorRecentlyPlayed] = useState(null);
  const [loadingRecentlyPlayed, setLoadingRecentlyPlayed] = useState(true);

  useEffect(() => {
    async function fetchRecentlyPlayed() {
      try {
        const response = await axios.get("/api/user/recently-played");
        setTracks(response.data.items);
      } catch (err) {
        setErrorRecentlyPlayed(
          err.response ? err.response.data.error : err.message
        );
      } finally {
        setLoadingRecentlyPlayed(false);
      }
    }

    fetchRecentlyPlayed();
  }, []);

  return { tracks, name, errorRecentlyPlayed, loadingRecentlyPlayed };
}
