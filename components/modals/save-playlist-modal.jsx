import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAccessToken } from "../../hooks/useAccessToken";
import { useUser } from "../../hooks/useUser";
import { useUserPlaylists } from "../../hooks/useUserPlaylists";
import { addToPlaylist, createPlaylist } from "../../utils/playlist";

import { PlaylistCard } from "../playlist-card";

export const SavePlaylistModal = ({ name, uris }) => {
  const { accessToken } = useAccessToken();
  const { user } = useUser();
  const { playlists, loading } = useUserPlaylists();
  const router = useRouter();
  const [showDetails, setShowDetails] = useState(-1);

  const closeModal = () => {
    router.refresh();
    setShowDetails(-1);
  };

  // const uris = tracks.map((track) => track.track.uri);

  const handleSaveNewPlaylist = () => {
    createPlaylist(user.id, name, accessToken).then((response) => {
      console.log(response);
      addToPlaylist(response.id, uris, accessToken);
    });
    document.getElementById("save_playlist").close();
    console.log("saved to playlist");
  };

  return (
    <dialog id="save_playlist" className="modal items-center">
      <div className="modal-box pl-4 pr-2">
        <div>
          <h3 className="font-bold text-2xl font-display uppercase italic">
            Your playlists
          </h3>
          <p className="font-body">
            Save to a new playlist or select one to add to.
          </p>
          <button
            className="btn btn-primary btn-sm mt-4 font-body"
            onClick={handleSaveNewPlaylist}
          >
            Save new playlist
          </button>
        </div>
        <div className="mt-6 md:max-h-[32rem] pr-1 overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-neutral">
          {loading ? (
            <div>
              <div className="skeleton mb-2 p-2 rounded-md min-h-16" />
              <div className="skeleton mb-2 p-2 rounded-md min-h-16" />
              <div className="skeleton mb-2 p-2 rounded-md min-h-16" />
              <div className="skeleton mb-2 p-2 rounded-md min-h-16" />
              <div className="skeleton mb-2 p-2 rounded-md min-h-16" />
              <div className="skeleton mb-2 p-2 rounded-md min-h-16" />
              <div className="skeleton mb-2 p-2 rounded-md min-h-16" />
            </div>
          ) : (
            <div>
              {playlists.map((playlist, index) => (
                <PlaylistCard
                  key={index}
                  playlist={playlist}
                  playlistNumber={index + 1}
                  showDetails={showDetails === index}
                  setShowDetails={setShowDetails}
                  user={user}
                  uris={uris}
                  accessToken={accessToken}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={closeModal}>close</button>
      </form>
    </dialog>
  );
};
