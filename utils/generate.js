import { useState } from "react";
import axios from "axios";

export const fetchLandingPlaylist = async (
  setLandingPlaylist,
  setLoading,
  setError
) => {
  setLoading(true);
  setError(null);

  try {
    const tokenResponse = await axios.get("/api/auth/client/token");
    const accessToken = tokenResponse.data.accessToken;

    console.log(accessToken);

    const trackArr = [
      "4PTG3Z6ehGkBFwjybzWkR8",
      "6DlPa2rrVK3BygXJ48WYo3",
      "1hAloWiinXLPQUJxrJReb1",
    ];
    const artistArr = [
      "4tZwfgrHOc3mvqYlEYSvVi",
      "25uiPmTg16RbhZWAqwLBy5",
      "0gxyHStUsqpMadRV0Di1Qt",
    ];
    const genreArr = [
      "rock",
      "electronic",
      "j-pop",
      "k-pop",
      "jazz",
      "country",
    ];
    const tempoArr = ["150", "155", "160", "165", "170", "175", "180"];

    const track = trackArr[Math.floor(Math.random() * trackArr.length)];
    const artist = artistArr[Math.floor(Math.random() * artistArr.length)];
    const genre = genreArr[Math.floor(Math.random() * genreArr.length)];
    const tempo = tempoArr[Math.floor(Math.random() * tempoArr.length)];
    const minTempo = tempo - 2;
    const maxTempo = +tempo + 2;

    const seedArr = [
      `&seed_tracks=${track}`,
      `&seed_artists=${artist}`,
      `&seed_genres=${genre}`,
      `&seed_genres=${genre}&seed_tracks=${track}`,
      `&seed_genres=${genre}&seed_artists=${artist}`,
    ];
    let seed = seedArr[Math.floor(Math.random() * seedArr.length)];

    // Add a cache-busting parameter
    const cacheBuster = Date.now();
    const requestUrl = `https://api.spotify.com/v1/recommendations?limit=10&market=US${seed}&target_tempo=${tempo}&min_tempo=${minTempo}&max_tempo=${maxTempo}&cache_buster=${cacheBuster}`;

    const playlistResponse = await axios.get(requestUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    let tracks = playlistResponse.data.tracks;

    // Filter out duplicate tracks by their id
    tracks = tracks.filter(
      (track, index, self) => self.findIndex((t) => t.id === track.id) === index
    );

    while (tracks.length < 10) {
      console.log("playlist length too short, adding more trakcs");
      seed = seedArr[Math.floor(Math.random() * seedArr.length)];
      const updatedRequestUrl = `https://api.spotify.com/v1/recommendations?limit=10&market=US${seed}&target_tempo=${tempo}&min_tempo=${
        minTempo - 2
      }&max_tempo=${maxTempo + 2}&cache_buster=${cacheBuster}`;

      const addedPlaylistResponse = await axios.get(updatedRequestUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const newTracks = addedPlaylistResponse.data.tracks;

      // Filter out duplicates before adding them to the main array
      newTracks.forEach((newTrack) => {
        if (!tracks.some((track) => track.id === newTrack.id)) {
          tracks.push(newTrack);
        }
      });

      // Slice to ensure we only return 10 tracks
      tracks = tracks.slice(0, 10);
    }

    setLandingPlaylist({
      name: `${tempo} BPM Running playlist`,
      tracks: tracks,
    });
  } catch (err) {
    console.error("Error fetching playlist:", err);
    setError(err);
  } finally {
    setLoading(false);
  }
};
