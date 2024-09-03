"use client";
import PlaylistProvider from "../../components/playlist-context";
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
