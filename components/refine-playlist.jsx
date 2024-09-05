import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { genreArray } from "../utils/genres";

export const RefinePlaylist = ({
  refinePlaylistInput,
  setRefinePlaylistInput,
}) => {
  // const [artist, setArtist] = useState({
  //   name: "",
  //   id: "",
  // });
  // const [track, setTrack] = useState({
  //   name: "",
  //   id: "",
  // });
  // const [tags, setTags] = useState(["rock", "electronic"]);
  // const [tempo, setTempo] = useState(160);
  // const [energy, setEnergy] = useState(0.5);
  // const [danceability, setDanceability] = useState(0.5);
  // const [instrumentalness, setInstrumentalness] = useState(0.5);
  // const [valence, setValence] = useState(0.5);
  // const [popularity, setPopularity] = useState(50);

  const handleKeyDown = (e) => {
    if (e.key !== "Enter") return;
    const value = e.target.value;
    if (!value.trim()) return;
    setTags([...tags, value]);
    e.target.value = "";
  };

  const removeTag = (index) => {
    setTags(tags.filter((el, i) => i !== index));
    setRefinePlaylistInput();
  };
  const removeGenre = (index) => {
    setRefinePlaylistInput({
      ...refinePlaylistInput,
      genres: refinePlaylistInput.genres.filter((el, i) => i !== index),
    });
  };
  const removeAllGenres = () => {
    const removeGenres = [];
    setRefinePlaylistInput({ ...refinePlaylistInput, genres: removeGenres });
    console.log("removed all genres", refinePlaylistInput.genres);
  };
  const handleOnSearch = (string, results) => {
    console.log(string, results);
  };
  const handleOnHover = (result) => {
    // the item hovered
    console.log(result);
  };

  const handleOnSelect = (item) => {
    // the item selected
    console.log(item);
    setRefinePlaylistInput({
      ...refinePlaylistInput,
      genres: [...refinePlaylistInput.genres, item.name],
    });
  };

  const handleOnFocus = () => {
    console.log("Focused");
  };

  const formatResult = (item) => {
    return (
      <>
        <span style={{ display: "block", textAlign: "left" }}>
          id: {item.id}
        </span>
        <span style={{ display: "block", textAlign: "left" }}>
          name: {item.name}
        </span>
      </>
    );
  };

  const style = {
    height: "34px",
    border: "1px solid #dfe1e5",
    borderRadius: "6px",
    backgroundColor: "#eceff4",
    color: "#212121",
    fontSize: "16px",
    fontFamily: "Switzer",
    iconColor: "grey",
    clearIconMargin: "3px 14px 0 0",
    searchIconMargin: "0 0 0 16px",
  };

  const handleArtist = (value) => {
    let prefix = "https://open.spotify.com/artist/";
    if (value.startsWith(prefix)) {
      setRefinePlaylistInput({
        ...refinePlaylistInput,
        artist: { id: value.slice(prefix.length).replace(/\?.*/g, "$'") },
      });
    } else {
      setRefinePlaylistInput({
        ...refinePlaylistInput,
        artist: { name: value },
      });
    }
  };

  const handleTrack = (value) => {
    let prefix = "https://open.spotify.com/track/";
    if (value.startsWith(prefix)) {
      setRefinePlaylistInput({
        ...refinePlaylistInput,
        track: { id: value.slice(prefix.length).replace(/\?.*/g, "$'") },
      });
    } else {
      setRefinePlaylistInput({
        ...refinePlaylistInput,
        track: { name: value },
      });
    }
  };

  return (
    <form className="flex flex-col gap-1">
      <div>
        <div className="flex items-center gap-4">
          <span className="font-display text-lg uppercase italic">Artist</span>
          <span className="text-xs my-1">
            Refine with artist. Enter artist name or artist link.
          </span>
        </div>
        <input
          type="text"
          placeholder="https://open.spotify.com/artist/0xOkc..."
          onChange={() => handleArtist(event.target.value)}
          className="input border border-secondary/20 w-full focus:border-secondary/40 focus:outline-none placeholder:text-sm"
        />
      </div>

      <div>
        <div className="flex items-center gap-4">
          <span className="font-display text-lg uppercase italic">Track</span>
          <span className="text-xs my-1">
            Refine with track. Enter track name or track link.
          </span>
        </div>
        <input
          type="text"
          placeholder="https://open.spotify.com/track/4PTG3Z..."
          onChange={() => handleTrack(event.target.value)}
          className="input border border-secondary/20 w-full focus:border-secondary/40 focus:outline-none placeholder:text-sm"
        />
      </div>

      <div>
        <div className="flex items-center gap-4 mb-2">
          <span className="font-display text-lg uppercase italic">Genres</span>
          <div className="flex justify-between items-center w-full">
            <span className="text-xs">Refine with genres. Select up to 5.</span>
            {/* <button
              className="btn btn-outline btn-xs"
              onClick={removeAllGenres}
            >
              Clear genres
            </button> */}
          </div>
        </div>
        <div className="flex flex-col gap-2 border border-secondary/20 rounded-md p-2">
          <div className="flex flex-wrap">
            {refinePlaylistInput.genres.length < 1 && <p>No genres selected</p>}
            {refinePlaylistInput.genres
              .map((genre, index) => (
                <div
                  key={index}
                  className="badge badge-secondary badge-outline m-1 flex gap-2"
                >
                  <span>{genre}</span>
                  <span
                    onClick={() => removeGenre(index)}
                    className="text-lg hover:cursor-pointer hover:text-primary transition"
                  >
                    x
                  </span>
                </div>
              ))
              .slice(0, 5)}
          </div>
          <div className="z-10">
            <ReactSearchAutocomplete
              items={genreArray}
              onSearch={handleOnSearch}
              onHover={handleOnHover}
              onSelect={handleOnSelect}
              onFocus={handleOnFocus}
              autoFocus
              styling={style}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="font-display text-lg uppercase italic">Tempo</span>
        <span className="text-xs my-1">150-180 is a good range.</span>
      </div>

      {/* TEMPO */}
      <div className="flex items-center gap-4">
        <input
          type="range"
          min={75}
          max="225"
          step="1"
          defaultValue="160"
          onChange={() =>
            setRefinePlaylistInput({
              ...refinePlaylistInput,
              tempo: event.target.value,
            })
          }
          className="range range-primary range-xs"
        />
        <span className="font-display text-xl text-right w-10">
          {refinePlaylistInput.tempo}
        </span>
      </div>

      {/* ENERGY */}
      <div className="flex items-center gap-4">
        <span className="font-display text-lg uppercase italic">Energy</span>
        <span className="text-xs my-1">
          Refine how fast and loud tracks will be.
        </span>
      </div>
      <div className="flex items-center gap-4">
        <input
          type="range"
          min={0}
          max="1"
          step="0.001"
          defaultValue="0.6"
          onChange={() =>
            setRefinePlaylistInput({
              ...refinePlaylistInput,
              energy: event.target.value,
            })
          }
          className="range range-primary range-xs"
        />
        <span className="font-display text-xl text-right w-10">
          {refinePlaylistInput.energy}
        </span>
      </div>

      {/* <div className="flex items-center gap-4">
        <span className="font-display text-lg uppercase italic">
          Danceability
        </span>
        <span className="text-xs my-1">Set higher for more dancing.</span>
      </div>
      <div className="flex items-center gap-4">
        <input
          type="range"
          min={0}
          max="1"
          step="0.001"
          defaultValue="0.6"
          onChange={() =>
            setRefinePlaylistInput({
              ...refinePlaylistInput,
              danceability: event.target.value,
            })
          }
          className="range range-primary range-xs"
        />
        <span className="font-display text-xl text-right w-10">
          {refinePlaylistInput.danceability}
        </span>
      </div> */}

      {/* INSTRUMENTALNESS */}
      <div className="flex items-center gap-4">
        <span className="font-display text-lg uppercase italic">
          Instrumentalness
        </span>
        <span className="text-xs my-1">Amount of vocals, or not.</span>
      </div>
      <div className="flex items-center gap-4">
        <input
          type="range"
          min={0}
          max="1"
          step="0.001"
          defaultValue="0.6"
          onChange={() =>
            setRefinePlaylistInput({
              ...refinePlaylistInput,
              instrumentalness: event.target.value,
            })
          }
          className="range range-primary range-xs"
        />
        <span className="font-display text-xl text-right w-10">
          {refinePlaylistInput.instrumentalness}
        </span>
      </div>

      {/* MOOD */}
      <div className="flex items-center gap-4">
        <span className="font-display text-lg uppercase italic">Mood</span>
        <span className="text-xs my-1">Happy tracks or sad tracks</span>
      </div>
      <div className="flex items-center gap-4">
        <input
          type="range"
          min={0}
          max="1"
          step="0.001"
          defaultValue="0.6"
          onChange={() =>
            setRefinePlaylistInput({
              ...refinePlaylistInput,
              valence: event.target.value,
            })
          }
          className="range range-primary range-xs"
        />
        <span className="font-display text-xl text-right w-10">
          {refinePlaylistInput.valence}
        </span>
      </div>

      {/* <div className="flex items-center gap-4">
        <span className="font-display text-lg uppercase italic">
          Popularity
        </span>
        <span className="text-xs my-1">
          Popularity of tracks. 100 is most popular.
        </span>
      </div>
      <div className="flex items-center gap-4">
        <input
          type="range"
          min={0}
          max="100"
          step="1"
          defaultValue="50"
          onChange={() =>
            setRefinePlaylistInput({
              ...refinePlaylistInput,
              popularity: event.target.value,
            })
          }
          className="range range-primary range-xs"
        />
        <span className="font-display text-xl text-right w-10">
          {refinePlaylistInput.popularity}
        </span>
      </div> */}

      <div className="flex justify-center w-full text-xs mt-4">
        Don't go too crazy. It might not find anything...
      </div>
    </form>
  );
};
