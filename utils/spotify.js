import axios from "axios";
import cookie from "cookie";
import { useAccessToken } from "../hooks/useAccessToken";

const client_id = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const client_secret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;
const scope = process.env.NEXT_PUBLIC_SPOTIFY_SCOPE;

export const loginUrl = `https://accounts.spotify.com/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=token&scope=${scope}`;

export const getRecommendations = async (
  seeds,
  minTempo,
  maxTempo,
  targetTempo,
  minEnergy,
  maxEnergy,
  targetEnergy,
  accessToken
) => {
  let amount = 0;
  let tracks = [];
  let newData;
  newData = await axios.get(
    `https://api.spotify.com/v1/recommendations?&seed_tracks=${seeds}&min_tempo=${minTempo}&max_tempo=${maxTempo}&target_tempo=${targetTempo}&min_energy=${minEnergy}&max_energy=${maxEnergy}&target_energy=${targetEnergy}&limit=12`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  console.log("tempo", targetTempo, "energy", targetEnergy);
  amount += newData.data.tracks.length;
  tracks = tracks.concat(newData.data.tracks);
  console.log(newData);
  console.log(
    newData.data.tracks.length < 10
      ? "getting more tracks..."
      : "generating playlist..."
  );
  if (newData.data.tracks.length < 10) {
    let addData;
    let addedTracks = [];
    addData = await axios.get(
      `https://api.spotify.com/v1/recommendations?&seed_genres=rock%2C+electronic&min_tempo=${minTempo}&max_tempo=${maxTempo}&target_tempo=${targetTempo}&target_energy=${targetEnergy}&limit=16`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("added more", addData.data.tracks);
    addedTracks = tracks.concat(addData.data.tracks);

    let updatedTracks = addedTracks
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);

    return updatedTracks.slice(0, 12);
  } else {
    console.log("generated playlist", tracks);
    return tracks;
  }
};

export const searchArtist = async (value, accessToken) => {
  console.log(value);
  const request = await axios.get(
    `https://api.spotify.com/v1/search?q=${value}&type=artist&limit=1`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  console.log("search artst", request.data.artists.items);
  const id = request.data.artists.items.map((item) => item.id);
  console.log("searched artist id", id[0]);
  return id;
};

export const searchTrack = async (value, accessToken) => {
  const request = await axios.get(
    `https://api.spotify.com/v1/search?q=${value}&type=track&limit=1`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  console.log(request.data.tracks.items.map((item) => item.id));
  const id = request.data.tracks.items.map((item) => item.id);
  console.log("searched track id", id[0]);
  return id;
};

export const getRefinedRecommendations = async (values, accessToken) => {
  console.log(values.artist);
  let amount = 0;
  let tracks = [];

  let artist;
  if (values.artist.id) {
    artist = `&seed_artist=${values.artist.id}`;
    console.log("artist from id", artist);
  } else if (values.artist.name) {
    const id = await searchArtist(values.artist.name, accessToken);
    artist = `&seed_artists=${id}`;
    console.log("artist from name", artist);
  } else {
    artist = "";
    console.log("artist blank", artist);
  }

  let track;
  if (values.track.id) {
    track = `&seed_tracks=${values.track.id}`;
    console.log("track from id", track);
  } else if (values.track.name) {
    const id = await searchTrack(values.track.name, accessToken);
    track = `&seed_tracks=${id}`;
    console.log("track from name", track);
  } else {
    track = "";
    console.log("track blank", track);
  }
  const genres = `&seed_genres=${values.genres
    .map((genre) => genre)
    .join(",")}`;

  const seeds = `${artist}${track}${genres}`;

  const url = `https://api.spotify.com/v1/recommendations?`;

  const tempo = `&min_tempo=${values.tempo - 5}&max_tempo=${
    +values.tempo + +5 > 225 ? 225 : +values.tempo + +5
  }&target_tempo=${values.tempo}`;

  const energy = `&min_energy=${values.energy - 0.2}&max_energy=${
    +values.energy + +0.2 > 1 ? 1 : +values.energy + +0.2
  }&target_energy=${values.energy}`;

  const danceability = `&min_danceability=${
    values.danceability - 0.2
  }&max_danceability=${
    +values.danceability + +0.2 > 1 ? 1 : +values.danceability + +0.2
  }&target_danceability=${values.danceability}`;

  const instrumentalness = `&min_instrumentalness=${
    values.instrumentalness - 0.2
  }&max_instrumentalness=${
    +values.instrumentalness + +0.2 > 1 ? 1 : +values.instrumentalness + +0.2
  }&target_instrumentalness=${values.instrumentalness}`;

  const mood = `&min_valence=${values.mood - 0.2}&max_valence=${
    +values.mood + +0.2 > 1 ? 1 : +values.mood + +0.2
  }&target_valence=${values.mood}`;

  const popularity = `&min_popularity=${
    values.popularity - 10
  }&max_popularity=${
    +values.popularity + +10 > 100 ? 100 : +values.popularity + +10
  }&target_popularity=${values.popularity}`;

  const data = `${url}${tempo}${energy}${danceability}${instrumentalness}${mood}${popularity}`;

  const requestUrl =
    seeds !== ""
      ? `${url}${seeds}${tempo}${energy}${danceability}${instrumentalness}${mood}${popularity}`
      : `${url}${genres}${tempo}${energy}${danceability}${instrumentalness}${mood}${popularity}`;

  const requestData = await axios.get(`${requestUrl}&limit=50`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  console.log("requested data", requestData);
  amount += requestData.data.tracks.length;
  tracks = tracks.concat(requestData.data.tracks);

  console.log(`found ${amount} tracks`);

  if (amount < 10) {
    console.log("adding more tracks...");
    let addData;
    let addedTracks = [];

    const addRequestUrl = `${url}${seeds}${tempo}${energy}${mood}`;
    addData = await axios.get(`${addRequestUrl}&limit=16`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    console.log("added data", addData);

    addedTracks = tracks.concat(addData.data.tracks);

    let updatedTracks = addedTracks
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);

    console.log(updatedTracks);
    return updatedTracks.slice(0, 12);
  } else {
    return tracks;
  }
};

export const getLandingPlaylist = async () => {
  try {
    const response = await axios.get("/api/playlist/landing");
    console.log(response);
    return response;
  } catch (error) {
    console.error("Error fetching playlist:", error);
  }
};
