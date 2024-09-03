import { useState } from "react";
import Image from "next/image";

import { useAccessToken } from "../hooks/useAccessToken";
import { calculatePlaylistLength, addToPlaylist } from "../utils/playlist";
import { Slide, toast } from "react-toastify";

export const PlaylistCard = ({
  playlist,
  playlistNumber,
  showDetails,
  setShowDetails,
  user,
  uris,
  accessToken,
}) => {
  const [playlistLength, setPlaylistLength] = useState(undefined);
  const [loading, setLoading] = useState(true);

  const handleShowDetails = () => {
    setShowDetails((prev) => {
      if (prev === playlistNumber - 1) {
        return -1;
      } else {
        return playlistNumber - 1;
      }
    });
    if (!playlistLength) {
      calculatePlaylistLength(playlist.tracks.href, accessToken).then(
        setPlaylistLength
      );
      setLoading(false);
    } else {
      return playlistLength;
    }
  };

  const handleSaveToPlaylist = () => {
    addToPlaylist(playlist.id, uris, accessToken);
    toast.success(
      `🏃 Success! ${uris.length} tracks saved to playlist ${playlist.name}`,
      {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Slide,
      }
    );
    document.getElementById("save_playlist").close();
  };

  return (
    <div
      className="overflow-x-hidden mb-2 p-2 bg-secondary/10 rounded-md hover:bg-secondary/20 hover:cursor-pointer"
      onClick={handleShowDetails}
    >
      <div className="flex gap-4 justify-start items-center">
        <div className="flex items-center justify-center max-w-10 h-10">
          <Image
            src={
              playlist.images
                ? playlist?.images[0]?.url
                : "/playlist-placeholder.png"
            }
            width={80}
            height={80}
            alt="Playlist cover"
          />
        </div>
        <div className="overflow-hidden font-display italic uppercase">
          <p className="whitespace-nowrap truncate text-ellipsis text-xl pr-2">
            {playlist.name}
          </p>
          <p className="text-md">{playlist.owner.display_name}</p>
        </div>
      </div>
      {showDetails && (
        <div className="flex items-center justify-between w-full gap-2 mt-4">
          <div className="flex justify-center text-md gap-4 w-full font-display uppercase">
            <span>
              {playlistLength ? `🎧 ${playlist.tracks.total} tracks` : null}
            </span>
            <span>{playlistLength ? `⌚ ${playlistLength}` : null}</span>
          </div>

          <button
            className="btn btn-sm btn-primary font-body"
            disabled={playlist.owner.id !== user.id}
            onClick={handleSaveToPlaylist}
          >
            Save to playlist
          </button>
        </div>
      )}
    </div>
  );
};
