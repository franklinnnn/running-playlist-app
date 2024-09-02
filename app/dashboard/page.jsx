"use client";
import PlaylistProvider from "../../components/playlist-context";
import { useAccessToken } from "../../hooks/useAccessToken";
import { useUser } from "../../hooks/useUser";

import { SongList } from "../../components/song-list";
import { MakePlaylistModal } from "../../components/modals/make-playlist-modal";
import { useRouter } from "next/navigation";

const DashboardPage = () => {
  const { user, error, loading } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/";
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <PlaylistProvider>
      <div className="font-body">
        {/* <div className="flex items-center justify-between">
          {loading ? (
            <h1 className="skeleton w-32 h-8"></h1>
          ) : (
            <h1 className="text-2xl font-display capitalize italic">
              hello {user?.display_name}!
            </h1>
          )}

          <div className="flex gap-2 items-center">
            <label className="swap swap-rotate">
              <input
                type="checkbox"
                className="theme-controller"
                value="nord"
              />
              <div className="swap-off">☀️</div>
              <div className="swap-on">🌙</div>
            </label>

            <button className="btn btn-primary btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div> */}
        {/* <hr className="h-px my-6 bg-secondary/20 border-0" /> */}

        <SongList />
        <div className="mt-6 w-full flex justify-center">
          <button
            className="btn btn-primary"
            onClick={() => document.getElementById("make_playlist").showModal()}
          >
            Make me a playlist
          </button>
        </div>

        <MakePlaylistModal />
      </div>
    </PlaylistProvider>
  );
};

export default DashboardPage;
