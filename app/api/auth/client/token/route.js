import { NextResponse } from "next/server";
import axios from "axios";
import cookie from "cookie";

export async function GET() {
  try {
    const cookies = cookie.parse(document.cookie || "");
    let clientAccessToken = cookies.spotifyClientAccessToken;

    // If no token or token is expired, request a new one
    if (!clientAccessToken || tokenExpired(cookies)) {
      const clientId = process.env.SPOTIFY_CLIENT_ID;
      const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
      const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString(
        "base64"
      );

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

      clientAccessToken = response.data.access_token;

      // Set new cookie with updated token
      const res = NextResponse.json({ accessToken: clientAccessToken });
      res.headers.append(
        "Set-Cookie",
        cookie.serialize("spotifyClientAccessToken", clientAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 3600, // 1 hour
          sameSite: "Strict",
          path: "/",
        })
      );

      return res;
    }

    // If token exists and is valid, return it
    return NextResponse.json({ accessToken: clientAccessToken });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function tokenExpired(cookies) {
  const tokenExpirationTime = cookies.tokenExpiresAt || 0;
  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  return currentTime >= tokenExpirationTime;
}
