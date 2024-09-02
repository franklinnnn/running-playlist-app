import { useState, useEffect } from "react";
import { getRecentlyPlayed } from "../utils/spotify";

const useHistory = () => {
  const [songs, setSongs] = useState([]);
  const [name, setName] = useState("Recently Listened");

  useEffect(() => {
    getRecentlyPlayed().then(setSongs);
  }, []);

  return { songs, name };
};
export default useHistory;
