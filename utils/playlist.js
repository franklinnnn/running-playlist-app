import axios from "axios";

export const createPlaylist = async (userId, name, accessToken) => {
  const response = await axios.post(
    `https://api.spotify.com/v1/users/${userId}/playlists`,
    {
      name: name,
      description: "Running playlist generated from PacePlaylist.",
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const addToPlaylist = async (playlistId, uris, accessToken) => {
  await axios.post(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    {
      uris: uris,
      position: 0,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
};

export const calculatePlaylistLength = async (
  playlistTracksHref,
  accessToken
) => {
  let tracks = [];
  const response = await axios.get(playlistTracksHref, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  tracks = response.data.items;

  let trackLengths = [];
  tracks.map((track) => trackLengths.push(track.track.duration_ms));

  const sum = trackLengths.reduce((a, b) => a + b, 0);

  const msToTime = (ms) => {
    let seconds = (ms / 1000).toFixed(1);
    let minutes = (ms / (1000 * 60)).toFixed(1);
    let hours = (ms / (1000 * 60 * 60)).toFixed(1);
    let days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);
    if (minutes < 60) return `${Math.round(minutes)} min`;
    else if (hours < 24) return `${Math.round(hours)} hrs`;
    else return days + " Days";
  };

  const playlistlength = msToTime(sum);

  return playlistlength;
};
