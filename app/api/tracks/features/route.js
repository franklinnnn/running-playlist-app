// import axios from "axios";
// import cookie from "cookie";

// const clientId = process.env.SPOTIFY_CLIENT_ID;
// const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

// export async function GET(req) {
//   const { searchParams } = new URL(req.url);
//   const trackId = searchParams.get("trackId");
//   if (!trackId) {
//     return new Response(JSON.stringify({ error: "Track ID is required" }), {
//       status: 400,
//     });
//   }

//   const cookies = cookie.parse(req.headers.get("cookie") || "");
//   const accessToken = cookies.spotifyAccessToken;

//   if (!accessToken) {
//     return new Response(JSON.stringify({ error: "Access token is missing" }), {
//       status: 401,
//     });
//   }

//   try {
//     const response = await axios.get(
//       `https://api.spotify.com/v1/audio-features/${trackId}`,
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       }
//     );
//     return new Response(JSON.stringify(response.data), { status: 200 });
//   } catch (err) {
//     console.error(
//       "Error fetching track features:",
//       err.response ? err.response.data : err.message
//     );
//   }
// }

// pages/api/track-features/route.js
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
    console.error(
      "Error fetching access token:",
      error.response?.data || error.message
    );
    throw new Error("Failed to retrieve access token");
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const trackId = searchParams.get("trackId");

  if (!trackId) {
    return NextResponse.json(
      { error: "Track ID is required" },
      { status: 400 }
    );
  }

  try {
    const accessToken = await getAccessToken();

    const featuresResponse = await axios.get(
      `https://api.spotify.com/v1/audio-features/${trackId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return NextResponse.json(featuresResponse.data);
  } catch (error) {
    console.error(
      "Error fetching track features:",
      error.response?.data || error.message
    );
    return NextResponse.json(
      { error: "Failed to fetch track features" },
      { status: 500 }
    );
  }
}
