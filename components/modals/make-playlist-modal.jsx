import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { PlaylistContext } from "../playlist-context";

import { useAccessToken } from "../../hooks/useAccessToken";
import { useRecentlyPlayed } from "../../hooks/useRecentlyPlayed";
import {
  getRecommendations,
  getRefinedRecommendations,
} from "../../utils/spotify";
import { genres } from "../../utils/constants";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { RefinePlaylist } from "../refine-playlist";

const MAX_LENGTH = 12;

const playlistInitialValues = {
  targetTempo: "160",
  minTempo: "157",
  maxTempo: "162",
  targetEnergy: "1",
  minEnergy: "0.6",
  maxEnergy: "1",
};

const refinePlaylistInitialValues = {
  artist: {
    name: undefined,
    id: undefined,
    type: "artist",
  },
  track: {
    name: undefined,
    id: undefined,
    type: "track",
  },
  genres: ["rock", "electronic"],
  tempo: 160,
  energy: 0.5,
  danceability: 0.5,
  instrumentalness: 0.5,
  mood: 0.5,
  popularity: 50,
};

export const MakePlaylistModal = ({ setLandingPlaylist }) => {
  const { accessToken } = useAccessToken();
  const { tracks } = useRecentlyPlayed();
  const { setPlaylist, setPlaylistName } = useContext(PlaylistContext);

  const [playlistInput, setPlaylistInput] = useState(playlistInitialValues);
  const [activePace, setActivePace] = useState("");
  const [activeEnergy, setActiveEnergy] = useState("");

  const [showRefinePlaylistInput, setShowRefinePlaylistInput] = useState(false);
  const [refinePlaylistInput, setRefinePlaylistInput] = useState(
    refinePlaylistInitialValues
  );

  const handleSelectSpeed = (e) => {
    setActivePace(e.target.id);
    playlistInput.targetTempo = e.target.value;
    playlistInput.minTempo = playlistInput.targetTempo - 2;
    playlistInput.maxTempo = +playlistInput.targetTempo + +2;
  };
  const handleSelectEnergy = (e) => {
    setActiveEnergy(e.target.id);
    playlistInput.targetEnergy = e.target.value;
    playlistInput.minEnergy = playlistInput.targetEnergy - 0.2;
    playlistInput.maxEnergy = playlistInput.targetEnergy;
  };

  const handleMakePlaylist = () => {
    if (accessToken) {
      console.log("playlist input");
      setPlaylist({
        name: undefined,
        tracks: undefined,
      });
      const seeds = tracks
        .map((track) => track.track.id)
        .slice(0, 5)
        .join(",");

      getRecommendations(
        seeds,
        playlistInput.minTempo,
        playlistInput.maxTempo,
        playlistInput.targetTempo,
        playlistInput.minEnergy,
        playlistInput.maxEnergy,
        playlistInput.targetEnergy,
        accessToken
      ).then((response) => {
        console.log(response);
        setPlaylist({
          name: `${playlistInput.targetTempo}  BPM Running Playlist 👟 | PacePlaylist`,
          tracks: response,
        });
      });
    } else {
      const getLandingRecommendations = async () => {
        const response = await axios.get(`/api/playlist/landing`);
        setLandingPlaylist({ name: "Running playlist", tracks: response.data });
      };

      getLandingRecommendations();
    }

    document.getElementById("make_playlist").close();
  };

  const handleMakeRefinedPlaylist = () => {
    console.log("refined playlist input", refinePlaylistInput);
    getRefinedRecommendations(refinePlaylistInput, accessToken).then(
      (response) => {
        setPlaylist({
          name: `${refinePlaylistInput.tempo} BPM Running Playlist 👟 | PacePlaylist`,
          tracks: response,
        });
      }
    );
    document.getElementById("make_playlist").close();
  };

  useEffect(() => {
    setPlaylistInput(playlistInitialValues);
    setRefinePlaylistInput(refinePlaylistInitialValues);
    setShowRefinePlaylistInput(false);
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
                  onClick={handleSelectSpeed}
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
                  onClick={handleSelectSpeed}
                >
                  🐇 steady
                </button>
                <button
                  className={`btn join-item w-1/3 capitalize  ${
                    activePace === "pace-fast" ? "btn-primary" : "btn-secondary"
                  }`}
                  id={"pace-fast"}
                  value={"180"}
                  onClick={handleSelectSpeed}
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
                  value={"0.8"}
                  onClick={handleSelectEnergy}
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
                  onClick={handleSelectEnergy}
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
                ? handleMakeRefinedPlaylist
                : handleMakePlaylist
            }
          >
            Make playlist
          </button>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};
