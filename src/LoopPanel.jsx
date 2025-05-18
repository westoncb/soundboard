import React from "react";

export default function LoopPanel({ loopAssignments, keys }) {
  return (
    <div className="loop-panel">
      <h3>Loop Intervals</h3>

      <div className="interval-list">
        {Object.entries(loopAssignments).map(([sub, keyIdx]) => {
          const assigned = keyIdx !== null;
          return (
            <div
              key={sub}
              className={`interval-item${assigned ? " assigned" : ""}`}
            >
              <span className="interval-name">{sub}</span>

              <span
                className={`interval-key ${assigned ? "assigned" : "free"}`}
              >
                {assigned ? keys[keyIdx] : "—"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
