import { createContext, useState } from "react";

export const PlaylistContext = createContext();

const PlaylistProvider = ({ children }) => {
  const [playlist, setPlaylist] = useState({
    name: null,
    tracks: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  return (
    <PlaylistContext.Provider
      value={{
        playlist,
        setPlaylist,
        loading,
        setLoading,
        error,
        setError,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};

export default PlaylistProvider;
