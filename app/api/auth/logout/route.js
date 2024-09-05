// import cookie from "cookie";

// export async function POST(req) {
//   try {
//     // Clear the access token cookie
//     return new Response(
//       JSON.stringify({ message: "Logged out successfully" }),
//       {
//         status: 200,
//         headers: {
//           "Set-Cookie": cookie.serialize("spotifyAccessToken", "", {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === "production", // Set secure flag in production
//             sameSite: "Strict",
//             maxAge: -1, // Expires immediately
//             path: "/",
//           }),
//         },
//       }
//     );
//   } catch (error) {
//     console.error("Logout failed:", error);
//     return new Response(JSON.stringify({ error: "Logout failed" }), {
//       status: 500,
//     });
//   }
// }

import cookie from "cookie";

export async function POST(req) {
  try {
    // Clear the access token cookie and redirect to Spotify's logout endpoint
    const logoutSpotifyUrl = "https://accounts.spotify.com/en/logout"; // Spotify logout URL

    // Clear cookies
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
          Location: logoutSpotifyUrl, // Redirect to Spotify logout page
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
