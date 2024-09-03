import axios from "axios";
import querystring from "query-string";
import cookie from "cookie";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

  if (!code) {
    return new Response("Authorization code missing", { status: 400 });
  }

  const authOptions = {
    method: "post",
    url: "https://accounts.spotify.com/api/token",
    data: querystring.stringify({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
    }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  try {
    const response = await axios(authOptions);
    const accessToken = response.data.access_token;

    return new Response(null, {
      status: 302,
      headers: {
        "Set-Cookie": cookie.serialize("spotifyAccessToken", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          maxAge: 3600, // 1 hour
          path: "/",
        }),
        Location: "/dashboard",
      },
    });
  } catch (error) {
    console.error(
      "Error exchanging code for access token:",
      error.response ? error.response.data : error.message
    );
    return new Response("Failed to exchange code for access token", {
      status: 500,
    });
  }
}
