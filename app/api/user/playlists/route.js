import axios from "axios";
import cookie from "cookie";

export async function GET(req) {
  const cookies = cookie.parse(req.headers.get("cookie") || "");
  const accessToken = cookies.spotifyAccessToken;

  if (!accessToken) {
    return new Response(JSON.stringify({ error: "Access token is missing" }), {
      status: 401,
    });
  }

  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/me/playlists`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (err) {
    console.error(
      "Error fetching user playlists:",
      err.response ? err.response.data : err.message
    );
  }
}
