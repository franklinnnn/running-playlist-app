import axios from "axios";
import cookie from "cookie";

export async function GET(req) {
  const cookies = cookie.parse(req.headers.get("cookie") || "");
  const accessToken = cookies.spotifyAccessToken;

  if (!accessToken) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), {
      status: 401,
    });
  }

  try {
    const response = await axios.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch data from Spotify" }),
      { status: 500 }
    );
  }
}
