import { NextResponse } from "next/server";
import axios from "axios";
import cookie from "cookie";

export async function GET(request) {
  try {
    const cookies = cookie.parse(request.headers.get("cookie") || "");
    let clientAccessToken = cookies.spotifyClientAccessToken;
    let tokenExpiresAt = cookies.spotifyTokenExpiresAt;

    const currentTime = Date.now() / 1000; // Current time in seconds

    // If there's no token or the token has expired, request a new one
    if (!clientAccessToken || currentTime >= tokenExpiresAt) {
      console.log("Token is missing or expired, fetching a new one...");

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

      const { access_token: newAccessToken, expires_in } = response.data;

      // Set new expiration time (current time + expires_in from Spotify)
      tokenExpiresAt = Math.floor(Date.now() / 1000) + expires_in;

      // Optionally set the new token and expiration time in cookies
      const res = NextResponse.json({ accessToken: newAccessToken });

      res.headers.append(
        "Set-Cookie",
        cookie.serialize("spotifyClientAccessToken", newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          maxAge: expires_in, // Max age matches token expiration
          path: "/",
        })
      );

      res.headers.append(
        "Set-Cookie",
        cookie.serialize("spotifyTokenExpiresAt", tokenExpiresAt.toString(), {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          maxAge: expires_in, // Max age matches token expiration
          path: "/",
        })
      );

      return res;
    }

    // If token is still valid, return it
    return NextResponse.json({ accessToken: clientAccessToken });
  } catch (error) {
    console.error("Error in fetching Spotify token:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
