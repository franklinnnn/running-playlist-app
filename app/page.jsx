"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import PlaylistProvider from "../components/playlist-context";
import { useAccessToken } from "../hooks/useAccessToken";
import { SongCard } from "../components/song-card";
import { LoginModal } from "../components/modals/login-modal";

const LoginPage = () => {
  const router = useRouter();
  const { accessToken } = useAccessToken();

  const [landingPlaylist, setLandingPlaylist] = useState({
    name: null,
    tracks: null,
  });
  const [loading, setLoading] = useState(true);

  const generatePlaylist = async () => {
    try {
      const response = await axios.get("/api/playlist/landing");
      setLandingPlaylist({ name: "Running playlist", tracks: response.data });
    } catch (error) {
      console.error("Error fetching playlist:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PlaylistProvider>
      <div className="text-content text-center font-body">
        <div className="max-w-xl">
          <div className="mb-4">
            Boost your run with the perfect playlist! Choose your pace and let
            the music match your stride. Start generating your custom running
            playlist now!
          </div>

          <button className="btn btn-primary" onClick={generatePlaylist}>
            Make me a playlist
          </button>
        </div>
      </div>
      {landingPlaylist.tracks ? (
        <div className="relative mt-6 w-screen md:max-w-[36rem] px-1">
          <div className="flex justify-between items-center mb-2">
            {loading ? (
              <h2 className="skeleton w-40 h-8" />
            ) : (
              <h2 className="text-2xl font-display uppercase italic">
                {landingPlaylist.name}
              </h2>
            )}

            {loading ? (
              <button className="skeleton w-32 h-8" />
            ) : (
              <button
                className="btn btn-sm btn-primary font-body "
                onClick={() =>
                  document.getElementById("login_modal").showModal()
                }
              >
                Save tracks
              </button>
            )}
          </div>
          <div
            className={`h-full md:max-h-[30rem] overflow-x-hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-neutral ${
              loading ? "overflow-y-hidden pr-0" : "overflow-y-scroll pr-1"
            }`}
          >
            {loading ? (
              <div>
                {Array.from({ length: 8 }, (_, i) => (
                  <div className="skeleton h-20 mb-2 p-2 rounded-md" key={i} />
                ))}
              </div>
            ) : (
              <div className="relative">
                <div className="sticky top-0 right-0 bg-base-100 mb-1 z-10 flex justify-end gap-12 pr-9 text-xs uppercase font-display">
                  <span>tempo</span>
                  <span>energy</span>
                  <span>length</span>
                </div>
                {landingPlaylist.tracks.tracks.map((track, index) => (
                  <SongCard song={track} key={track.id} />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="h-full md:h-[23rem] overflow-x-hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-neutral bg-primary" />
      )}
      <LoginModal landingPlaylist={landingPlaylist} />
    </PlaylistProvider>
  );
};

export default LoginPage;
