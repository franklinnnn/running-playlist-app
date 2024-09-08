import { useState, useEffect, useContext } from "react";
import { PlaylistContext } from "../playlist-context";

import { useAccessToken } from "../../hooks/useAccessToken";
import { useRecentlyPlayed } from "../../hooks/useRecentlyPlayed";
import { getRefinedRecommendations } from "../../utils/spotify";
import { RefinePlaylist } from "../refine-playlist";
import { getPlaylist, getRefinedPlaylist } from "../../utils/get-playlists";
import { Slide, toast } from "react-toastify";

const MAX_LENGTH = 12;

const playlistInitialValues = {
  tempo: 160,
  energy: 0.7,
};

const refinePlaylistInitialValues = {
  artist: {
    name: null,
    id: null,
    type: "artist",
  },
  track: {
    name: null,
    id: null,
    type: "track",
  },
  genres: ["rock", "country", "edm", "house", "pop", "metal"],
  tempo: 170,
  energy: 0.7,
  // instrumentalness: 0.5,
  // valence: 0.7,
};

export const MakePlaylistModal = ({ setLandingPlaylist }) => {
  const { accessToken } = useAccessToken();
  const { tracks } = useRecentlyPlayed();
  const { setPlaylist, setPlaylistName, setLoading, error, setError } =
    useContext(PlaylistContext);

  const [playlistInput, setPlaylistInput] = useState(playlistInitialValues);
  const [activePace, setActivePace] = useState("pace-steady");
  const [activeEnergy, setActiveEnergy] = useState("energy-high");

  const [showRefinePlaylistInput, setShowRefinePlaylistInput] = useState(false);
  const [refinePlaylistInput, setRefinePlaylistInput] = useState(
    refinePlaylistInitialValues
  );

  const handleGetPlaylist = () => {
    // console.log("getting playlist");
    getPlaylist(playlistInput, tracks, setPlaylist, setLoading, setError);
    handleModalClose();
    document.getElementById("make_playlist").close();
  };

  const handleGetRefinedPlaylist = () => {
    getRefinedPlaylist(refinePlaylistInput, setPlaylist, setLoading, setError);
    handleModalClose();
    document.getElementById("make_playlist").close();
  };

  const handleModalClose = () => {
    setPlaylistInput(playlistInitialValues);
    setRefinePlaylistInput(refinePlaylistInitialValues);
    setShowRefinePlaylistInput(false);
    setActivePace("pace-steady");
    setActiveEnergy("energy-high");
  };

  useEffect(() => {
    setPlaylistInput(playlistInitialValues);
    setRefinePlaylistInput(refinePlaylistInitialValues);
    setShowRefinePlaylistInput(false);
    setActivePace("pace-steady");
    setActiveEnergy("energy-high");
  }, []);

  return (
    <dialog id="make_playlist" className="modal items-center">
      <div className="modal-box flex flex-col gap-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-neutral">
        <h3 className="font-bold text-2xl font-display uppercase italic">
          Make playlist
        </h3>
        {!showRefinePlaylistInput && (
          <div>
            <div className="text-xl font-body uppercase italic mb-2">
              <p className="font-display">pace</p>
              <div className="join w-full">
                <button
                  className={`btn join-item w-1/3 capitalize ${
                    activePace === "pace-slow" ? "btn-primary" : "btn-secondary"
                  }`}
                  id={"pace-slow"}
                  value={"160"}
                  // onClick={handleSelectSpeed}
                  onClick={() => {
                    setPlaylistInput({
                      ...playlistInput,
                      tempo: event.target.value,
                    });
                    setActivePace(event.target.id);
                  }}
                >
                  🐢 slow
                </button>
                <button
                  className={`btn join-item w-1/3 capitalize  ${
                    activePace === "pace-steady"
                      ? "btn-primary"
                      : "btn-secondary"
                  }`}
                  id={"pace-steady"}
                  value={"170"}
                  // onClick={handleSelectSpeed}
                  onClick={() => {
                    setPlaylistInput({
                      ...playlistInput,
                      tempo: event.target.value,
                    });
                    setActivePace(event.target.id);
                  }}
                >
                  🐇 steady
                </button>
                <button
                  className={`btn join-item w-1/3 capitalize  ${
                    activePace === "pace-fast" ? "btn-primary" : "btn-secondary"
                  }`}
                  id={"pace-fast"}
                  value={"180"}
                  // onClick={handleSelectSpeed}
                  onClick={() => {
                    setPlaylistInput({
                      ...playlistInput,
                      tempo: event.target.value,
                    });
                    setActivePace(event.target.id);
                  }}
                >
                  🐆 fast
                </button>
              </div>
            </div>
            <div className="text-xl font-body uppercase italic">
              <p className="font-display">energy</p>
              <div className="join w-full">
                <button
                  className={`btn join-item w-1/2 capitalize ${
                    activeEnergy === "energy-chill"
                      ? "btn-primary"
                      : "btn-secondary"
                  }`}
                  id={"energy-chill"}
                  value={"0.7"}
                  // onClick={handleSelectEnergy}
                  onClick={() => {
                    setPlaylistInput({
                      ...playlistInput,
                      energy: event.target.value,
                    });
                    setActiveEnergy(event.target.id);
                  }}
                >
                  🧊 chill
                </button>
                <button
                  className={`btn join-item w-1/2 capitalize ${
                    activeEnergy === "energy-high"
                      ? "btn-primary"
                      : "btn-secondary"
                  }`}
                  id={"energy-high"}
                  value={"1.0"}
                  // onClick={handleSelectEnergy}
                  onClick={() => {
                    setPlaylistInput({
                      ...playlistInput,
                      energy: event.target.value,
                    });
                    setActiveEnergy(event.target.id);
                  }}
                >
                  🔥 hype
                </button>
              </div>
            </div>
          </div>
        )}
        {showRefinePlaylistInput && (
          <hr className="h-px my-6 bg-secondary border-0" />
        )}
        <div
          className="flex items-center gap-2 text-xl text-left  font-display uppercase italic hover:cursor-pointer"
          onClick={() => setShowRefinePlaylistInput(!showRefinePlaylistInput)}
        >
          Refine playlist{" "}
          <span className="text-sm">
            {showRefinePlaylistInput ? "🔽" : "▶️"}
          </span>
        </div>
        {showRefinePlaylistInput && (
          <RefinePlaylist
            refinePlaylistInput={refinePlaylistInput}
            setRefinePlaylistInput={setRefinePlaylistInput}
          />
        )}
        <div className="mt-6 w-full flex justify-center">
          <button
            className="btn btn-primary font-body"
            onClick={
              showRefinePlaylistInput
                ? handleGetRefinedPlaylist
                : handleGetPlaylist
            }
          >
            Make playlist
          </button>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button onClick={handleModalClose}>close</button>
      </form>
    </dialog>
  );
};
