import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PlaylistContext } from "../playlist-context";

export const LoginModal = ({ landingPlaylist }) => {
  const { playlist, setPlaylist } = useContext(PlaylistContext);
  const router = useRouter();

  // console.log("login modal", landingPlaylist);

  const handleLogin = () => {
    console.log("save playlist");
    saveLandingPlaylist();
    router.push("/api/auth/login");
  };

  const saveLandingPlaylist = () => {
    localStorage.setItem(
      "saved landing playlist",
      JSON.stringify(landingPlaylist)
    );
  };

  useEffect(() => {
    const savedPlaylist = localStorage.getItem("saved landing playlist");
    if (savedPlaylist) {
      console.log("saved landing playlist", JSON.parse(savedPlaylist));
      localStorage.removeItem("saved landing playlist");
    }
  }, []);

  return (
    <dialog id="login_modal" className="modal">
      <div className="modal-box">
        <h1 className="text-4xl text-center font-display uppercase">
          🏃 PacePlaylist
        </h1>
        <p className="font-body text-center text-sm">
          Login to save your playlist
        </p>

        <div className="w-full flex justify-center mt-12">
          {/* <Link href="/api/auth/login"> */}
          <button className="btn btn-primary" onClick={handleLogin}>
            Login with Spotify
          </button>
          {/* </Link> */}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};
