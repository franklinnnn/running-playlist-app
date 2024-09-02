import querystring from "query-string";

export async function GET(req) {
  const scope =
    "user-read-private user-read-email user-read-playback-state user-modify-playback-state user-read-recently-played user-top-read user-follow-read user-follow-modify playlist-modify-public playlist-modify-private playlist-read-private";
  const redirectUri = "https://paceplaylist.vercel.app/api/callback";
  const clientId = process.env.SPOTIFY_CLIENT_ID;

  const queryParams = querystring.stringify({
    response_type: "code",
    client_id: clientId,
    scope: scope,
    redirect_uri: redirectUri,
  });

  return Response.redirect(
    `https://accounts.spotify.com/authorize?${queryParams}`
  );
}
