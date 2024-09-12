import { SongCard } from "./song-card";
import { SavePlaylistModal } from "./modals/save-playlist-modal";
import { useRecentlyPlayed } from "../hooks/useRecentlyPlayed";
import { PlaylistContext } from "./playlist-context";
import { useContext, useEffect } from "react";

export const SongList = ({ tracks, name }) => {
  const { playlist, setPlaylist, loading, error } = useContext(PlaylistContext);

  useEffect(() => {
    const savedLandingPlaylist = localStorage.getItem("saved landing playlist");
    if (savedLandingPlaylist) {
      const landingPlaylist = JSON.parse(savedLandingPlaylist);
      setPlaylist({
        name: `${landingPlaylist.name} | PacePlaylist`,
        tracks: landingPlaylist.tracks,
      });
      document.getElementById("save_playlist").showModal();
    }
  }, []);

  const uris =
    playlist?.tracks?.length > 1
      ? playlist.tracks.map((track) => track.uri)
      : tracks.map((track) => track.track.uri);

  return (
    <div className="relative w-screen md:max-w-[36rem]">
      <div className="flex justify-between items-center px-2 mb-6">
        {loading ? (
          <h2 className="skeleton w-40 h-8" />
        ) : (
          <h2 className="text-2xl font-display uppercase ">
            {playlist.name ? playlist.name : name}
          </h2>
        )}

        {loading ? (
          <button className="skeleton w-32 h-8" />
        ) : (
          <button
            className="btn btn-sm btn-primary font-body "
            onClick={() => document.getElementById("save_playlist").showModal()}
          >
            Save tracks
          </button>
        )}
      </div>
      <div
        className={`md:max-h-[30rem] mx-1 overflow-x-hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-neutral ${
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
            <div className="sticky top-0 right-0 bg-base-100 mb-1 z-10 hidden md:flex justify-end gap-8 pr-9 text-xs uppercase font-display">
              <span>tempo</span>
              <span>energy</span>
              <span>length</span>
            </div>
            {playlist?.tracks?.length > 1 ? (
              <div>
                {playlist?.tracks?.map((item) => (
                  <SongCard song={item} key={item.id} />
                ))}
              </div>
            ) : (
              <div>
                {tracks.map((item) => (
                  <SongCard song={item.track} key={item.played_at} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <SavePlaylistModal
        name={playlist.name ? playlist.name : name}
        uris={uris}
      />
    </div>
  );
};
