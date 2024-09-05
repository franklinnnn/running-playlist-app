import { NextResponse } from "next/server";
import axios from "axios";
import cookie from "cookie";

export async function GET() {
  try {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString(
      "base64"
    );

    // Fetch client credentials token
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "client_credentials",
      }),
      {
        headers: {
          Authorization: `Basic ${authHeader}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token: clientAccessToken } = response.data;

    // Optionally set the token in cookies
    const res = NextResponse.json({ accessToken: clientAccessToken });
    res.headers.append(
      "Set-Cookie",
      cookie.serialize("spotifyClientAccessToken", clientAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: 3600, // 1 hour
        path: "/",
      })
    );

    return res;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
