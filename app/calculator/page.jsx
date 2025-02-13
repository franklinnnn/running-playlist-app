"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

const distances = [
  { label: "400m", distance: 0.4 },
  { label: "1 mile", distance: 1.60934 },
  { label: "1 km", distance: 1 },
  { label: "5K", distance: 5 },
  { label: "10K", distance: 10 },
  { label: "10 miles", distance: 16.0934 },
  { label: "Half-Marathon", distance: 21.0975 },
  { label: "Marathon", distance: 42.195 },
];

const PaceCalculatorPage = () => {
  const [pace, setPace] = useState("10:00");
  const [unit, setUnit] = useState("mi");
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const router = useRouter();

  const paceRegex = /^([0-5]?[0-9]):([0-5]?[0-9])$/;

  const handleEnterPace = (e) => {
    e.preventDefault();
    const value = e.target.value;

    if (paceRegex.test(value) || value === "") {
      setPace(value);
      setError("");
    } else {
      setError("Please enter a valid pace in mm:ss format (e.g., 05:30)");
    }
    setPace(e.target.value);
  };

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.round(totalSeconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const calculateRacePaces = (pace, unit) => {
    const regex = /^(\d{1,2}):([0-5][0-9])$/;
    const match = pace.match(regex);

    if (!match) {
      throw new Error('Invalid format. Please use "mm:ss".');
    }

    const minutes = parseInt(match[1], 10);
    const seconds = parseInt(match[2], 10);

    const totalSeconds = minutes * 60 + seconds;
    const conversionFactor = 1.60934;
    const pacePerKmSeconds =
      unit === "mi" ? totalSeconds / conversionFactor : totalSeconds;

    return distances.map(({ label, distance }) => {
      const timeInSeconds = pacePerKmSeconds * distance;
      return {
        label,
        time: formatTime(timeInSeconds),
      };
    });
  };

  const handleCalculate = () => {
    setResults(calculateRacePaces(pace, unit));
  };

  return (
    <div className="h-full md:min-h-[30rem] w-screen md:max-w-[36rem] px-2">
      <h1 className="text-4xl font-display uppercase text-center mb-4">
        Pace Calculator
      </h1>

      <p>
        Calculate your finish time for various distances based on your pace.
      </p>
      <div className="flex justify-center mt-4">
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
            onClick={handleCalculate}
          >
            go
          </button>
        </div>
      </div>

      <div className="mt-4">
        {results && (
          <div className="w-full flex-col justify-center items-center">
            {results.map(({ label, time }) => (
              <div
                key={label}
                className="grid grid-cols-2 gap-4 py-2 bg-base-200"
              >
                <div className="text-end">{label}</div>
                <div className="text-start px-2 rounded-sm bg-secondary w-20 text-black font-semibold">
                  {time}
                </div>
              </div>
            ))}

            {/* <div className="flex justify-center mt-4">
              <button className="btn btn-primary">
                Make playlist from pace
              </button>
            </div> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaceCalculatorPage;
