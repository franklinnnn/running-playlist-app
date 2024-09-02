import { useEffect, useState } from "react";
import { getAudioFeatures } from "../utils/spotify";

export const useAudioFeatures = (song) => {
  const [tempo, setTempo] = useState(0);
  const [ms, setMs] = useState(new Date());
  const [length, setLength] = useState("");
  const [energy, setEnergy] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [features, setFeatures] = useState(null);

  // const getFeatures = () => {
  //   getAudioFeatures(song.id).then((data) => {
  //     setTempo(Math.round(data.tempo));
  //     setEnergy(Math.round(data.energy * 100));
  //   });
  //   const ms = new Date(song.duration_ms);
  //   setLength(`${ms.getMinutes()}:${ms.getSeconds()}`);
  // };
  // console.log(song.id);
  useEffect(() => {
    const fetchAudioFeatures = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("spotifyAccessToken"))
          .split("=")[1];

        console.log(token);
        const response = await axios.get(
          `https://api.spotify.com/v1/audio-features/${song.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFeatures(response.data);
        console.log(response.data);
        setTempo(Math.round(response.data.tempo));
        setEnergy(Math.round(response.data.energy * 100));
        const ms = new Date(song.duration_ms);
        setLength(
          `${ms.getMinutes()}:${
            ms.getSeconds() < 10 ? "0" : "" + ms.getSeconds()
          }`
        );
      } catch (err) {
        setError(err.response ? err.response.data.error : err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAudioFeatures();
  }, [song]);

  return {
    tempo,
    ms,
    length,
    energy,
  };
};
