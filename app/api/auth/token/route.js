import { NextResponse } from "next/server";
import cookie from "cookie";

export async function GET(req) {
  try {
    // Parse cookies from the request
    const cookies = cookie.parse(req.headers.get("cookie") || "");

    // Extract the access token from the cookies
    const accessToken = cookies.spotifyAccessToken;

    // Check if the token exists
    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token is missing" },
        { status: 401 }
      );
    }

    // Return the access token as JSON
    return NextResponse.json({ accessToken });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
