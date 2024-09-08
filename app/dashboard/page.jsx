"use client";
import PlaylistProvider from "../../components/playlist-context";
import { useUser } from "../../hooks/useUser";

import { SongList } from "../../components/song-list";
import { MakePlaylistModal } from "../../components/modals/make-playlist-modal";
import { useRouter } from "next/navigation";
import { useRecentlyPlayed } from "../../hooks/useRecentlyPlayed";

const DashboardPage = () => {
  const { user, errorUser, loadingUser } = useUser();
  const { tracks, name, errorRecentlyPlayed, loadingRecentlyPlayed } =
    useRecentlyPlayed();

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
        {loadingRecentlyPlayed ? (
          <div className="w-screen md:max-w-[36rem]">
            {Array.from({ length: 6 }, (_, i) => (
              <div className="skeleton h-20 mb-2 p-2 rounded-md" key={i} />
            ))}
          </div>
        ) : (
          <SongList tracks={tracks} name={name} />
        )}

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
