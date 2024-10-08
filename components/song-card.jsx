import Image from "next/image";
import { useTrackFeatures } from "../hooks/useTrackFeatures";

export const SongCard = ({ song }) => {
  const trackId = song.id;
  const { tempo, energy, length, error, loading } = useTrackFeatures(song.id);

  return (
    <div>
      {!song || loading ? (
        <div className="skeleton h-20 mb-2 p-2 rounded-md" />
      ) : (
        <div className="bg-secondary/10 mb-2 p-2 pt-1 rounded-md flex items-center gap-2 max-h-20 hover:bg-secondary/20 hover:cursor-default transition text-base-content font-body uppercase font-bold">
          <Image
            src={
              song.album.images
                ? song?.album?.images[2].url
                : "/album-placeholder.png"
            }
            alt="Album cover"
            width={60}
            height={60}
            className="object-contain"
          />
          <div className="overflow-hidden flex items-center font-display w-full">
            <div className="w-1/2">
              <h2 className="text-xl text-ellipsis truncate pr-2">
                {song.name}
              </h2>
              <p className="text-sm">
                {song?.artists?.map((artist) => artist.name).join(", ")}
              </p>
            </div>
            <div className="relative flex flex-row justify-end w-1/2 text-md font-display">
              {/* <div className="flex flex-col justify-evenly text-xs md:hidden">
                <span>tempo</span>
                <span>energy</span>
                <span>length</span>
              </div> */}
              <div className="flex flex-col font-body md:flex-row">
                <span className="pl-2 min-w-20">❤️ {tempo}</span>
                <span className="pl-2 min-w-20">⚡ {energy}</span>
                <span className="pl-2 min-w-20">⌚ {length}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
