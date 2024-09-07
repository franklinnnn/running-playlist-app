import axios from "axios";
import { getRandomGenres } from "../utils/genres";

export const getPlaylist = async (
  input,
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

    // console.log("input parameters", {
    //   input: input,
    //   tracks: trackArr,
    //   artists: artistArr,
    // });

    const tempo = input.tempo;
    const energy = input.energy;

    const minTempo = tempo - 2;
    const maxTempo = +tempo + 2;
    const minEnergy = energy - 0.2;
    const maxEnergy = 1;

    const track = trackArr[Math.floor(Math.random() * trackArr.length)];
    const artist = artistArr[Math.floor(Math.random() * artistArr.length)];

    const genreArr = getRandomGenres();
    // console.log(genreArr);
    const genre = genreArr.map((item) => item.name).join(",");
    // console.log(genre);

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

      const updatedRequestUrl = `https://api.spotify.com/v1/recommendations?limit=10&market=US${seed}&target_tempo=${tempo}&min_tempo=${
        minTempo - 2
      }&max_tempo=${
        maxTempo + 2
      }&target_energy=${energy}&min_energy=${minEnergy}&max_energy=${maxEnergy}&cache_buster=${cacheBuster}`;

      const addedPlaylistResponse = await axios.get(updatedRequestUrl, {
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

export const getRefinedPlaylist = async (
  input,
  setPlaylist,
  setLoading,
  setError
) => {
  setLoading(true);
  setError(null);

  // const retryDelay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // const makeRequestWithRetry = async (url, accessToken, retries = 2) => {
  //   try {
  //     const response = await axios.get(url, {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     });
  //     return response;
  //   } catch (error) {
  //     if (error.response?.status === 429 && retries > 0) {
  //       const retryAfter = error.response.headers["retry-after"]
  //         ? parseInt(error.response.headers["retry-after"]) * 1000
  //         : 1000;
  //       await retryDelay(retryAfter);
  //       return makeRequestWithRetry(url, accessToken, retries - 1);
  //     }
  //     throw error;
  //   }
  // };

  try {
    const tokenResponse = await axios.get("/api/auth/client/token");
    const accessToken = tokenResponse.data.accessToken;

    // console.log("refined playlist search", "input parameters", input);

    // seed artist, track, and genre
    let artist;
    if (input.artist.id) {
      artist = `&seed_artist=${input.artist.id}`;
      // console.log("artist from id", artist);
    } else if (input.artist.name) {
      const id = await searchArtist(input.artist.name, accessToken);
      artist = `&seed_artists=${id}`;
      // console.log("artist from name", artist);
    } else {
      artist = "";
      // console.log("artist blank", artist);
    }

    let track;
    if (input.track.id) {
      track = `&seed_tracks=${input.track.id}`;
      // console.log("track from id", track);
    } else if (input.track.name) {
      const id = await searchTrack(input.track.name, accessToken);
      track = `&seed_tracks=${id}`;
      // console.log("track from name", track);
    } else {
      track = "";
      // console.log("track blank", track);
    }

    const genres = `&seed_genres=${input.genres
      .map((genre) => genre)
      .join(",")}`;

    const seeds = `${artist}${track}${genres}`;

    // input ranges
    let tempo = input.tempo;
    let minTempo = tempo - 2;
    let maxTempo = +tempo + +2 > 200 ? 200 : +tempo + +2;

    let energy = input.energy;
    let minEnergy = energy - 0.2;
    let maxEnergy = +energy + 0.2 > 1 ? 1 : +energy + 0.2;

    let instrumentalness = input.instrumentalness;
    let minInstrumentalness = instrumentalness - 0.2;
    let maxInstrumentalness =
      +instrumentalness + 0.2 > 1 ? 1 : +instrumentalness + 0.2;

    let valence = input.valence;
    let minValence = valence - 0.2;
    let maxValence = +valence + 0.2 > 1 ? 1 : +valence + 0.2;

    let retries = 0;
    const maxRetries = 3;
    let tracks = [];

    const fetchTracks = async (url) => {
      try {
        const playlistResponse = await axios.get(requestUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        return playlistResponse.data.tracks;
      } catch (error) {
        if (error.response && error.response.status === 429) {
          const retryAfter = error.response.headers["retry-after"];
          const retryDelay = retryAfter
            ? parseInt(retryAfter, 10) * 1000
            : (retries + 1) * 1000;
          console.log(
            `Rate limit hit. Retrying after ${retryDelay / 1000} seconds...`
          );
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
          return null;
        }
        throw error;
      }
    };

    const cacheBuster = Date.now();
    const requestUrl = `https://api.spotify.com/v1/recommendations?limit=10&market=US${seeds}&target_tempo=${tempo}&min_tempo=${minTempo}&max_tempo=${maxTempo}&target_energy=${energy}&min_energy=${minEnergy}&max_energy=${maxEnergy}`;

    // &target_instrumentalness=${instrumentalness}&min_instrumentalness=${minInstrumentalness}&max_instrumentalness=${maxInstrumentalness}&target_valence=${valence}&min_valence=${minValence}&max_valence=${maxValence}&cache_buster=${cacheBuster}`;

    // console.log("request parameters", {
    //   artist: artist,
    //   track: track,
    //   genre: genres,
    //   tempo: tempo,
    //   energy: energy,
    // instrumentalness: instrumentalness,
    // mood: valence,
    //   seed: seeds,
    // });

    // const playlistResponse = await axios.get(requestUrl, {
    //   headers: {
    //     Authorization: `Bearer ${accessToken}}`,
    //   },
    // });

    // console.log("fetching tracks...");
    let fetchedTracks = await fetchTracks(requestUrl);
    if (fetchedTracks) {
      // console.log(tracks);
      tracks = fetchedTracks.filter(
        (track, index, self) =>
          self.findIndex((t) => t.id === track.id) === index
      );
    }

    // add more tracks if there are less than 10
    while (tracks.length < 12 && retries < maxRetries) {
      // console.log("found less than 10 tracks, updating input parameters");
      // update input numbers

      tempo = +tempo + +2;
      minTempo = tempo - 2;
      maxTempo = tempo + 2;

      energy = energy > 1 ? 1 : energy + 0.2;
      minEnergy = energy - 0.2;
      maxEnergy = 1;

      instrumentalness = instrumentalness > 1 ? 1 : instrumentalness + 0.2;
      minInstrumentalness = instrumentalness - 0.2;
      maxInstrumentalness = 1;

      valence = valence > 1 ? 1 : valence + 0.2;
      minValence = valence - 0.2;
      maxValence = 1;

      retries++;

      const updatedRequestUrl = `https://api.spotify.com/v1/recommendations?limit=10&market=US${seeds}&target_tempo=${tempo}&min_tempo=${minTempo}&max_tempo=${maxTempo}&target_energy=${energy}&min_energy=${minEnergy}&max_energy=${maxEnergy}
      `;
      // &target_instrumentalness=${instrumentalness}&min_instrumentalness=${minInstrumentalness}&max_instrumentalness=${maxInstrumentalness}

      // &target_valence=${valence}&min_valence=${minValence}&max_valence=${maxValence}&cache_buster=${cacheBuster}`;

      // console.log("updated request parameters", {
      //   artist: artist,
      //   track: track,
      //   genre: genres,
      //   tempo: {
      //     target: tempo,
      //     min: minTempo,
      //     max: maxTempo,
      //   },
      //   energy: {
      //     target: energy,
      //     min: minEnergy,
      //     max: maxEnergy,
      //   },
      // instrumentalness: {
      //   target: instrumentalness,
      //   min: minInstrumentalness,
      //   max: maxInstrumentalness,
      // },
      // mood: {
      //   target: valence,
      //   min: minValence,
      //   max: maxValence,
      // },
      //   seed: seeds,
      // });

      // console.log("fetching tracks with updated parameters...");
      const newTracks = await fetchTracks(updatedRequestUrl);
      // const addedPlaylistResponse = await axios.get(updatedRequestUrl, {
      //   headers: {
      //     Authorization: `Bearer ${accessToken}`,
      //   },
      // });

      // const newTracks = addedPlaylistResponse.data.tracks;

      // // filter duplicates
      // newTracks.forEach((newTrack) => {
      //   if (!tracks.some((track) => track.id === newTrack.id)) {
      //     tracks.push(newTrack);
      //   }
      // });

      if (newTracks) {
        newTracks.forEach((newTrack) => {
          if (!tracks.some((track) => track.id === newTrack.id)) {
            tracks.push(newTrack);
          }
        });
        tracks = tracks.slice(0, 12);
      }
    }
    if (tracks.length < 12 && retries === maxRetries) {
      setError(
        `Found ${tracks.length} tracks. Try different parameters for more results!`
      );
      setPlaylist({
        name: `${tempo} BPM Running playlist | PacePlaylist`,
        tracks: tracks,
      });
    } else {
      setPlaylist({
        name: `${tempo} BPM Running playlist | PacePlaylist`,
        tracks: tracks,
      });
    }
  } catch (error) {
    setError("Error fetching playlist. Please try again later.");
    console.log("Error fetching playlist:", error);
  } finally {
    setLoading(false);
  }
};

export const searchArtist = async (value, accessToken) => {
  // console.log(value);
  const request = await axios.get(
    `https://api.spotify.com/v1/search?q=${value}&type=artist&limit=1`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  // console.log("search artst", request.data.artists.items);
  const id = request.data.artists.items.map((item) => item.id);
  // console.log("searched artist id", id[0]);
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
  // console.log(request.data.tracks.items.map((item) => item.id));
  const id = request.data.tracks.items.map((item) => item.id);
  // console.log("searched track id", id[0]);
  return id;
};
