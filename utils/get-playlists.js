import axios from "axios";
import { getRandomGenres } from "../utils/genres";

export const getPlaylist = async (
  playlistInput,
  tracks,
  setPlaylist,
  setLoading,
  setError
) => {
  setLoading(true);
  setError(null);

  const trackArr = tracks?.map((track) => track.track.id);
  const artistArr = tracks?.map((track) => track.track.artists[0].id);
  try {
    const tokenResponse = await axios.get("/api/auth/client/token");
    const accessToken = tokenResponse.data.accessToken;

    console.log("input parameters", {
      input: playlistInput,
      tracks: trackArr,
      artists: artistArr,
    });

    const tempo = playlistInput.tempo;
    const energy = playlistInput.energy;

    const minTempo = tempo - 2;
    const maxTempo = +tempo + 2;
    const minEnergy = energy - 0.2;
    const maxEnergy = 1;

    const track = trackArr[Math.floor(Math.random() * trackArr.length)];
    const artist = artistArr[Math.floor(Math.random() * artistArr.length)];

    // const genreArr = [
    //   "rock",
    //   "electronic",
    //   "j-pop",
    //   "k-pop",
    //   "jazz",
    //   "country",
    // ];

    // const genre = genreArr[Math.floor(Math.random() * genreArr.length)];

    // get seed of 3 genres
    // const maxGenres = 3;
    // const genreArr = [];
    // const usedIndices = new Set();
    // while (genreArr.length < maxGenres && genreArr.length < genres.length) {
    //   const randomIndex = Math.floor(Math.random() * genres.length);
    // }
    // if (!usedIndices.has(randomIndex)) {
    //   genreArr.push(genres[randomIndex].name);
    //   usedIndices.add(randomIndex);
    // }
    const genreArr = getRandomGenres();
    console.log(genreArr);
    const genre = genreArr.map((item) => item.name).join(",");
    console.log(genre);

    const seedArr = [
      `&seed_tracks=${track}`,
      `&seed_artists=${artist}`,
      `&seed_tracks=${track}&seed_artists=${artist}`,
      `&seed_genres=${genre}`,
      `&seed_genres=${genre}&seed_tracks=${track}`,
      `&seed_genres=${genre}&seed_artists=${artist}`,
    ];
    let seed = seedArr[Math.floor(Math.random() * seedArr.length)];

    const cacheBuster = Date.now();
    const requestUrl = `https://api.spotify.com/v1/recommendations?limit=10${seed}&target_tempo=${tempo}&min_tempo=${minTempo}&max_tempo=${maxTempo}&target_energy=${energy}&min_energy=${minEnergy}&max_energy=${maxEnergy}&cache_buster=${cacheBuster}`;

    console.log("request parameters", {
      tempo: tempo,
      energy: energy,
      track: track,
      artist: artist,
      genres: genre,
      seed: seed,
    });

    const playlistResponse = await axios.get(requestUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}}`,
      },
    });

    let tracks = playlistResponse.data.tracks;

    tracks = tracks.filter(
      (track, index, self) => self.findIndex((t) => t.id === track.id) === index
    );

    while (tracks.length < 10) {
      seed = seedArr[Math.floor(Math.random() * seedArr.length)];

      const updatedRequetUrl = `https://api.spotify.com/v1/recommendations?limit=10&market=US${seed}&target_tempo=${tempo}&min_tempo=${
        minTempo - 2
      }&max_tempo=${
        maxTempo + 2
      }&target_energy=${energy}&min_energy=${minEnergy}&max_energy=${maxEnergy}&cache_buster=${cacheBuster}`;

      const addedPlaylistResponse = await axios.get(updatedRequetUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const newTracks = addedPlaylistResponse.data.tracks;

      newTracks.forEach((newTrack) => {
        if (!tracks.some((track) => track.id === newTrack.id)) {
          tracks.push(newTrack);
        }
      });

      tracks = tracks.slice(0, 10);
    }

    setPlaylist({
      name: `${tempo} BPM Running playlist | PacePlaylist`,
      tracks: tracks,
    });
  } catch (error) {
    console.log("Error fetching playlist:", error);
  } finally {
    setLoading(false);
  }
};
