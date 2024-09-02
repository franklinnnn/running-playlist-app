import {
  addToPlaylist,
  createPlaylist,
  getUserPlaylists,
} from "../utils/spotify";
import React, { useEffect, useState } from "react";
import useUser from "./useUser";

export const usePlaylists = () => {
  const user = useUser();
  const [userPlaylists, setUserPlaylists] = useState([]);

  useEffect(() => {
    getUserPlaylists().then(setUserPlaylists);
  }, []);

  const saveToNewPlaylist = (userId, uris) => {
    createPlaylist(userId).then((response) => {
      addToPlaylist(response.id, uris);
    });
  };

  const saveToPlaylist = (id, name, uris) => {
    addToPlaylist(id, uris);
  };

  return {
    userPlaylists,
    saveToNewPlaylist,
    saveToPlaylist,
  };
};

export default usePlaylists;
