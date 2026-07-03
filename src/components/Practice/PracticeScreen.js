import React from "react";
import TanpuraCard from "./TanpuraCard";
import TablaCard from "./TablaCard";
import ViolinCard from "./ViolinCard";
import BeatVisualizer from "./BeatVisualizer";

const PracticeScreen = () => {
  return (
    <div style={{ padding: "32px", background: "#F5EFE4", minHeight: "calc(100vh - 132px)" }}>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <h1 style={{ fontFamily: "Cinzel, serif", fontSize: "36px", letterSpacing: "12px", color: "#3D2210" }}>RAGA</h1>
        <div style={{ fontSize: "18px", color: "#A08060", marginTop: "4px" }}>रा ग</div>
        <div style={{ fontSize: "11px", letterSpacing: "4px", color: "#A08060", marginTop: "8px" }}>
          AI-POWERED · CLASSICAL MUSIC PRACTICE COMPANION
        </div>
      </div>

      {/* Instrument grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
        <TanpuraCard />
        <TablaCard />
        <ViolinCard />
      </div>

      {/* Beat visualizer */}
      <BeatVisualizer />
    </div>
  );
};

export default PracticeScreen;
