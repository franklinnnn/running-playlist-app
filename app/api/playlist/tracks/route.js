import axios from "axios";
import cookie from "cookie";

export async function GET(req) {
    const cookies = cookie.parse(req.headers.get('cookie') || '');
    const accessToken = cookies.spotifyAccessToken;

    if(!accessToken) {
        return new Response(JSON.stringify({error: "Access token is missing"}), {
            status: 401,
        })
    }


    try {
        const response = await axios.get(
            `${}`
        )
    } catch (err) {
        "Error fetching playlist items:",
        err.response ? err.response.data : err.message
    }
}