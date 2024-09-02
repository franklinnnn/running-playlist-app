import cookie from "cookie";

export async function POST(req) {
  try {
    // Clear the access token cookie
    return new Response(
      JSON.stringify({ message: "Logged out successfully" }),
      {
        status: 200,
        headers: {
          "Set-Cookie": cookie.serialize("spotifyAccessToken", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Set secure flag in production
            sameSite: "Strict",
            maxAge: -1, // Expires immediately
            path: "/",
          }),
        },
      }
    );
  } catch (error) {
    console.error("Logout failed:", error);
    return new Response(JSON.stringify({ error: "Logout failed" }), {
      status: 500,
    });
  }
}
