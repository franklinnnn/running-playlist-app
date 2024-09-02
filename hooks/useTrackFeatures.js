import { useState, useEffect } from "react";
import axios from "axios";

export function useTrackFeatures(trackId) {
  const [features, setFeatures] = useState(null);
  const [tempo, setTempo] = useState(null);
  const [energy, setEnergy] = useState(null);
  const [length, setLength] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!trackId) {
      setLoading(false);
      return;
    }

    async function fetchTrackFeatures() {
      try {
        const response = await axios.get(
          `/api/tracks/features?trackId=${trackId}`
        );
        if (response.data.error) {
          throw new Error(response.data.error);
        }
        setFeatures(response.data);
        setTempo(Math.round(response.data.tempo));
        setEnergy(Math.round(response.data.energy * 100));
        const ms = new Date(response.data.duration_ms);
        setLength(
          `${(ms.getMinutes() < 10 ? "0" : "") + ms.getMinutes()}:${
            (ms.getSeconds() < 10 ? "0" : "") + ms.getSeconds()
          }`
        );
      } catch (err) {
        console.error(
          "Error fetching track features:",
          err.response ? err.response.data : err.message
        ); // Debugging line
        setError(err.response ? err.response.data.error : err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTrackFeatures();
  }, [trackId]);

  return { tempo, energy, length, error, loading };
}
