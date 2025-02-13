"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";

import PlaylistProvider from "../components/playlist-context";
import { useAccessToken } from "../hooks/useAccessToken";
import { getLandingPlaylist } from "../utils/get-playlists";
import { EnterPace } from "../components/enter-pace";
import { SongCard } from "../components/song-card";
import { LoginModal } from "../components/modals/login-modal";

const LandingPage = () => {
  const router = useRouter();
  const { accessToken } = useAccessToken();

  const [landingPlaylist, setLandingPlaylist] = useState({
    name: null,
    tracks: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetchPlaylist = () => {
    console.log("fetching playlist");
    getLandingPlaylist(setLandingPlaylist, setLoading, setError);
  };

  return (
    <PlaylistProvider>
      <div className="text-content text-center font-body">
        <div className="max-w-xl">
          <div className="mb-4">
            Boost your run with the perfect playlist!{" "}
            <p>Generate a random playlist or get one from your target pace.</p>
          </div>

          <div className="flex items-center justify-center h-12">
            <button
              className="btn btn-primary h-full min-w-40 border-primary border-[1px]"
              onClick={
                accessToken ? router.push("/dashboard") : handleFetchPlaylist
              }
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-md"></span>
              ) : (
                <span>
                  {accessToken ? "Go to dashboard" : "Make me a playlist"}
                </span>
              )}
            </button>
            {loading ? null : (
              <EnterPace
                setLandingPlaylist={setLandingPlaylist}
                loading={loading}
                setLoading={setLoading}
                setError={setError}
              />
            )}
          </div>
        </div>
      </div>
      {landingPlaylist.tracks ? (
        <div className="relative mt-6 w-screen md:max-w-[36rem] px-1">
          <div className="flex justify-between items-center mb-2">
            {loading ? (
              <h2 className="skeleton w-40 h-8" />
            ) : (
              <h2 className="text-2xl font-display uppercase ml-1 md:ml-0">
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
                  <div className="skeleton h-32 mb-2 p-2 rounded-md" key={i} />
                ))}
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() =>
                    window.open(
                      "https://open.spotify.com/",
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                  className="flex items-center gap-2 btn btn-sm btn-primary mb-2"
                >
                  <Image
                    src="/spotify/Spotify_Primary_Logo_RGB_Black.png"
                    width={20}
                    height={20}
                    alt="Spotify logo"
                  />
                  Open Spotify
                </button>
                <div className="sticky top-0 right-0 bg-base-100 mb-1 z-10 hidden md:flex justify-end gap-8 pr-9 text-xs uppercase font-display">
                  <span>tempo</span>
                  <span>energy</span>
                  <span>length</span>
                </div>
                {landingPlaylist.tracks.map((track, index) => (
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

export default LandingPage;
