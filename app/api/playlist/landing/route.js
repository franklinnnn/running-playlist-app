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
  // const { searchParams } = new URL(req.url);
  // const queryParams = Object.fromEntries(searchParams.entries());
  // const { tempo, energy } = params;
  try {
    const accessToken = await getAccessToken();

    // const minTempo = tempo - 5;
    // const maxTempo = +tempo + +5;

    // const minEnergy = energy - 0.2;
    // const maxEnergy = 1;

    const arr = ["160", "165", "170", "175", "180", "185"];
    const tempo = arr[Math.floor(Math.random() * arr.length)];

    const playlistResponse = await axios.get(
      `https://api.spotify.com/v1/recommendations?limit=10&market=US&seed_genres=rock%2C+electronic&seed_tracks=4PTG3Z6ehGkBFwjybzWkR8&target_tempo=${tempo}`,

      // &min_tempo=${minTempo}&max_tempo=${maxTempo}&energy=${energy}&min_energy=${minEnergy}&max_energy=${maxEnergy}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return NextResponse.json(playlistResponse.data);
  } catch (error) {
    console.error("Error fetching playlist:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
