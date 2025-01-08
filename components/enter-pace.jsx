import React, { useState } from "react";
import { getLandingPlaylistFromPace } from "../utils/get-playlists";

export const EnterPace = ({ setLandingPlaylist, setLoading, setError }) => {
  const [pace, setPace] = useState("10:00");
  const [unit, setUnit] = useState("mi");

  const paceRegex = /^([0-5]?[0-9]):([0-5]?[0-9])$/;

  const handleEnterPace = (e) => {
    e.preventDefault();
    const value = e.target.value;

    // Validate pace format (mm:ss)
    if (paceRegex.test(value) || value === "") {
      setPace(value);
      setError("");
    } else {
      setError("Please enter a valid pace in mm:ss format (e.g., 05:30)");
    }
    setPace(e.target.value);
  };

  const makePlaylist = async () => {
    console.log("making playlist");
    try {
      const seconds = convertPace(pace);
      const tempo = calculateTempoRange(seconds);
      console.log(`${pace}/${unit}`);
      const time = `${pace}/${unit}`;

      // make playlist here
      getLandingPlaylistFromPace(
        setLandingPlaylist,
        tempo,
        time,
        setLoading,
        setError
      );
    } catch (error) {
      console.error("Error creating playlist: ", error);
    }
  };

  const convertPace = (input) => {
    const regex = /^(\d{1,2}):([0-5][0-9])$/;
    const match = pace.match(regex);

    if (!match) {
      throw new Error('Invalid format. Please use "mm:ss".');
    }

    const minutes = parseInt(match[1], 10);
    const seconds = parseInt(match[2], 10);

    // Convert to total seconds
    let totalSeconds;
    if (unit === "mi") {
      totalSeconds = minutes * 60 + seconds;
    } else {
      totalSeconds = (minutes * 60 + seconds) * 1.60934;
    }
    // console.log(Math.round(totalSeconds), unit);

    return totalSeconds;
  };

  const calculateTempoRange = (secondsPerMile) => {
    // Handle edge cases
    if (secondsPerMile >= 630) {
      return { average: 150, min: 148, max: 152 }; // Over 10:30/mi
    } else if (secondsPerMile <= 330) {
      return { average: 195, min: 193, max: 197 }; // Under 5:30/mi
    }

    // Determine BPM range based on intervals
    if (secondsPerMile >= 600) {
      return { average: 160, min: 158, max: 162 }; // 10:00/mi
    } else if (secondsPerMile >= 510) {
      return { average: 170, min: 168, max: 172 }; // 8:30/mi
    } else if (secondsPerMile >= 420) {
      return { average: 180, min: 178, max: 182 }; // 7:00/mi
    } else if (secondsPerMile >= 360) {
      return { average: 190, min: 188, max: 192 }; // 6:00/mi
    }

    // Fallback for unexpected input
    throw new Error("Unexpected input.");
  };

  return (
    <div className="relative join h-full min-w-32 mx-4 border-primary border-[1px] text-slate-300">
      <input
        type="text"
        id="pace"
        name="pace"
        value={pace}
        onChange={handleEnterPace}
        placeholder="mm:ss"
        maxLength="5"
        required
        className="join-item max-w-16 outline-none border-none focus:ring-0 pl-2 bg-slate-800"
      />
      <div className="dropdown dropdown-hover join-item m-0">
        <div
          tabIndex={0}
          role="button"
          className="join-item bg-slate-800 w-10 h-full flex items-center"
        >
          / {unit}
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu text-left z-[1] shadow p-0 -left-2 bg-slate-800 rounded-sm"
        >
          <li
            className="p-2 hover:bg-secondary hover:cursor-pointer"
            onClick={() => setUnit("mi")}
          >
            miles
          </li>
          <li
            className="p-2 hover:bg-secondary hover:cursor-pointer"
            onClick={() => setUnit("km")}
          >
            kilometers
          </li>
        </ul>
      </div>
      <button
        disabled={!pace}
        className="btn btn-primary h-full join-item capitalize"
        onClick={makePlaylist}
      >
        go
      </button>
      {/* {error && <div className="absolute top-0 text-red-500">{error}</div>} */}
    </div>
  );
};
