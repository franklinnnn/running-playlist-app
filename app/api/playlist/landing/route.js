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
    const tempoArr = ["150", "155", "160", "165", "170", "175", "180", "185"];

    const track = trackArr[Math.floor(Math.random() * trackArr.length)];
    const artist = artistArr[Math.floor(Math.random() * artistArr.length)];
    const tempo = tempoArr[Math.floor(Math.random() * tempoArr.length)];
    const minTempo = tempo - 2;
    const maxTempo = +tempo + 2;

    const seedArr = [
      `&seed_tracks=${track}`,
      `&seed_artists=${artist}&seed_genres=rock%2C+electronic`,
      `&seed_genres=rock%2C+electronic&seed_tracks=${track}`,
      `&seed_genres=rock%2C+electronic&seed_artists=${artist}`,
    ];
    let seed = seedArr[Math.floor(Math.random() * seedArr.length)];

    let amount = 0;
    let tracks = [];

    const requestUrl = `https://api.spotify.com/v1/recommendations?limit=10&market=US${seed}&target_tempo=${tempo}&min_tempo=${minTempo}&max_tempo=${maxTempo}`;

    const playlistResponse = await axios.get(requestUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    amount += playlistResponse.data.tracks.length;
    tracks = tracks.concat(playlistResponse.data.tracks);

    if (amount < 10) {
      let addedTracks = [];

      seed = seedArr[Math.floor(Math.random() * seedArr.length)];
      const updatedRequestUrl = `https://api.spotify.com/v1/recommendations?limit=10&market=US${seed}&target_tempo=${tempo}&min_tempo=${
        minTempo - 2
      }&max_tempo=${maxTempo + 2}`;

      const addedPlaylistResponse = await axios.get(updatedRequestUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      addedTracks = tracks.concat(addedPlaylistResponse.data.tracks);

      return NextResponse.json(addedTracks.slice(0, 10));
    }

    return NextResponse.json(tracks);
  } catch (error) {
    console.error("Error fetching playlist:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
