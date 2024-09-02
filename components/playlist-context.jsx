import { createContext, useState } from "react";

export const PlaylistContext = createContext();

const PlaylistProvider = ({ children }) => {
  const [playlist, setPlaylist] = useState({
    name: undefined,
    tracks: [],
  });
  const [playlistName, setPlaylistName] = useState("");
  const [userPlaylists, setUserPlaylists] = useState([]);

  return (
    <PlaylistContext.Provider
      value={{
        playlist,
        setPlaylist,
        playlistName,
        setPlaylistName,
        userPlaylists,
        setUserPlaylists,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};

export default PlaylistProvider;
