// pages/api/playlist/route.js
import { NextResponse } from "next/server";
import axios from "axios";

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

async function getAccessToken() {
  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "client_credentials",
      }),
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${clientId}:${clientSecret}`
          ).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error("Error fetching access token:", error);
    throw new Error("Failed to retrieve access token");
  }
}

export async function GET(req, { params }) {
  try {
    const accessToken = await getAccessToken();

    let amount = 0;
    let tracks = [];

    const trackArr = [
      "4PTG3Z6ehGkBFwjybzWkR8",
      "6DlPa2rrVK3BygXJ48WYo3",
      "1hAloWiinXLPQUJxrJReb1",
    ];
    const track = trackArr[Math.floor(Math.random() * trackArr.length)];

    const artistArr = [
      "4tZwfgrHOc3mvqYlEYSvVi",
      "25uiPmTg16RbhZWAqwLBy5",
      "0gxyHStUsqpMadRV0Di1Qt",
    ];
    const artist = artistArr[Math.floor(Math.random() * artistArr.length)];

    const tempoArr = ["150", "155", "160", "165", "170", "175", "180", "185"];
    const tempo = tempoArr[Math.floor(Math.random() * tempoArr.length)];
    let minTempo = tempo - 2;
    let maxTempo = +tempo + +2;

    const seedArr = [
      `&seed_tracks=${track}`,
      `&seed_artists=${artist}&seed_genres=rock%2C+electronic`,
      `&seed_genres=rock%2C+electronic&seed_tracks=${track}`,
      `&seed_genres=rock%2C+electronic&seed_artists=${artist}`,
    ];
    let seed = seedArr[Math.floor(Math.random() * seedArr.length)];

    console.log("seed", seed);

    const requestUrl = `https://api.spotify.com/v1/recommendations?limit=10&market=US${seed}&target_tempo=${tempo}&min_tempo=${minTempo}&max_tempo=${maxTempo}`;

    const playlistResponse = await axios.get(requestUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    amount += playlistResponse.data.tracks.length;
    tracks = tracks.concat(playlistResponse.data.tracks);

    console.log("playlist length", amount);

    if (amount < 10) {
      console.log("adding more tracks");
      let addedTracks = [];

      seed = seedArr[Math.floor(Math.random() * seedArr)];
      minTempo = minTempo - 2;
      maxTempo = +maxTempo + +2;

      console.log("seed", seed);

      const addedPlaylistResponse = await axios.get(requestUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      addedTracks = tracks.concat(addedPlaylistResponse.data.tracks);
      console.log("added tracks", addedTracks.length);

      return NextResponse.json(addedTracks.slice(0, 10));
    }

    return NextResponse.json(playlistResponse.data.tracks);
  } catch (error) {
    console.error("Error fetching playlist:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
