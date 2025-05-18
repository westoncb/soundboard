import React, { useState, useEffect } from "react";
import { play, toggleLoop, setBpm, getLoopAssignments } from "./audioEngine.js";
import useKeyboard from "./useKeyboard.js";
import LoopPanel from "./LoopPanel.jsx";

const keys = ["Q", "W", "E", "A", "S", "D", "Z", "X", "C"];

export default function App() {
  const [bpm, setBpmState] = useState(120);
  const [transportRunning, setTransportRunning] = useState(false);
  const [looping, setLooping] = useState(Array(9).fill(false));
  const [loopAssignments, setLoopAssignments] = useState({});

  useKeyboard((key, shift) => {
    const idx = keys.indexOf(key.toUpperCase());
    if (idx !== -1) handlePad(idx, shift);
    if (key === " ") toggleTransport();
  });

  useEffect(() => {
    setBpm(bpm);
  }, [bpm]);

  useEffect(() => {
    // Update loop assignments whenever looping state changes
    setLoopAssignments(getLoopAssignments());
  }, [looping]);

  function handlePad(index, withShift) {
    if (!transportRunning) {
      toggleTransport();
      setTransportRunning(true);
    }

    play(index);
    flash(index);
    if (withShift) {
      const active = toggleLoop(index);
      setLooping((l) => {
        const nl = [...l];
        nl[index] = active;
        return nl;
      });
    }
  }

  function flash(index) {
    const el = document.getElementById(`pad-${index}`);
    if (!el) return;
    el.classList.add("active");
    setTimeout(() => el.classList.remove("active"), 120);
  }

  function toggleTransport() {
    import("./audioEngine.js").then(({ toggleTransport }) => {
      toggleTransport().then((running) => setTransportRunning(running));
    });
  }

  return (
    <div className="app">
      <div className="top-bar">
        <label>
          BPM&nbsp;{bpm}
          <input
            type="range"
            min="60"
            max="200"
            value={bpm}
            onChange={(e) => setBpmState(Number(e.target.value))}
          />
        </label>
      </div>

      <div className="main-content">
        <LoopPanel loopAssignments={loopAssignments} keys={keys} />

        <div className="grid">
          {keys.map((k, i) => (
            <button
              key={k}
              id={`pad-${i}`}
              className={`pad${looping[i] ? " looping" : ""}`}
              onClick={(e) => handlePad(i, e.shiftKey)}
              aria-label={`Pad ${k}`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
