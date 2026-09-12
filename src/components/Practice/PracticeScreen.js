import React, { useState, useEffect } from "react";
import TanpuraCard from "./TanpuraCard";
import TablaCard from "./TablaCard";
import BeatVisualizer from "./BeatVisualizer";
import useDriftDetection from "../../hooks/useDriftDetection";
import usePitchDetection from "../../hooks/usePitchDetection";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

const PracticeScreen = () => {
  const { isPlaying, bpm, shruti, selectedMelakarta } = useApp();
  const { user } = useAuth();
  const [driftEnabled, setDriftEnabled] = useState(true);
  const { driftMessage } = useDriftDetection(isPlaying, bpm, driftEnabled);
  const { pitchInfo } = usePitchDetection(isPlaying, shruti, driftEnabled, selectedMelakarta);

  useEffect(() => {
    const fetchDriftSetting = async () => {
      try {
        const snap = await getDoc(doc(db, "Users", user.uid));
        if (snap.exists()) {
          setDriftEnabled(snap.data().drift ?? true);
        }
      } catch (e) {
        console.error("Error fetching drift setting:", e);
      }
    };
    fetchDriftSetting();
  }, [user]);

  return (
    <div style={{ padding:"32px", background:"#F5EFE4", minHeight:"calc(100vh - 132px)" }}>

      <div style={{ textAlign:"center", marginBottom:"32px" }}>
        <h1 style={{ fontFamily:"Cinzel,serif", fontSize:"36px", letterSpacing:"12px", color:"#3D2210" }}>RAGA</h1>
        <div style={{ fontSize:"18px", color:"#A08060", marginTop:"4px" }}>रा ग</div>
        <div style={{ fontSize:"11px", letterSpacing:"4px", color:"#A08060", marginTop:"8px" }}>
          AI-POWERED · CLASSICAL MUSIC PRACTICE COMPANION
        </div>
      </div>

      {/* Selected raga banner */}
      {selectedMelakarta && (
        <div style={{
          background:"#3D2210", borderRadius:"8px",
          padding:"10px 20px", marginBottom:"16px",
          display:"flex", justifyContent:"space-between", alignItems:"center"
        }}>
          <div style={{ fontSize:"12px", color:"#C8A96E", letterSpacing:"1px" }}>PRACTICING RAGA</div>
          <div style={{ fontFamily:"Cinzel,serif", fontSize:"14px", color:"#C8A96E" }}>
            {selectedMelakarta.number}. {selectedMelakarta.name}
          </div>
          <div style={{ fontSize:"11px", color:"#7A5830" }}>{selectedMelakarta.chakra} Chakra</div>
        </div>
      )}

      {/* Drift detection nudge */}
      {driftMessage && (
        <div style={{
          background:"#FFF8EE", border:"1px solid #C8A96E", borderRadius:"8px",
          padding:"12px 20px", marginBottom:"16px",
          fontSize:"13px", color:"#7A5830", textAlign:"center"
        }}>
          ⟳ {driftMessage}
        </div>
      )}

      {/* Pitch detection display */}
      {isPlaying && driftEnabled && (
        <div style={{
          background:"#FBF7F0", border:"1px solid",
          borderColor: pitchInfo?.ragaSelected
            ? pitchInfo?.valid === false ? "#C8503A" : pitchInfo?.valid === true ? "#4A8C5C" : "#D4B896"
            : "#D4B896",
          borderRadius:"8px",
          padding:"12px 24px", marginBottom:"20px",
          display:"flex", alignItems:"center", justifyContent:"space-between",
          transition:"border-color 0.2s"
        }}>
          <div style={{ fontSize:"10px", letterSpacing:"2px", color:"#A08060" }}>
            PITCH DETECTION ● ACTIVE
          </div>
          {pitchInfo ? (
            <div style={{ display:"flex", gap:"32px", alignItems:"center" }}>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:"10px", color:"#A08060", letterSpacing:"1px", marginBottom:"2px" }}>SWARA</div>
                <div style={{
                  fontFamily:"Cinzel,serif", fontSize:"20px",
                  color: pitchInfo.ragaSelected
                    ? pitchInfo.valid === false ? "#C8503A" : pitchInfo.valid === true ? "#4A8C5C" : "#C8A96E"
                    : "#C8A96E"
                }}>{pitchInfo.swara}</div>
              </div>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:"10px", color:"#A08060", letterSpacing:"1px", marginBottom:"2px" }}>FREQ</div>
                <div style={{ fontSize:"16px", color:"#3D2210" }}>{pitchInfo.freq} Hz</div>
              </div>
              {pitchInfo.ragaSelected && (
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:"10px", color:"#A08060", letterSpacing:"1px", marginBottom:"2px" }}>STATUS</div>
                  <div style={{
                    fontSize:"13px", fontWeight:500,
                    color: pitchInfo.valid === false ? "#C8503A" : "#4A8C5C"
                  }}>
                    {pitchInfo.valid === false ? "✕ Not in raga" : "✓ In raga"}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ fontSize:"12px", color:"#A08060" }}>Sing to detect pitch...</div>
          )}
        </div>
      )}

      {/* Instrument grid */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"24px", marginBottom:"24px" }}>
        <TanpuraCard />
        <TablaCard />
      </div>

      <BeatVisualizer />
    </div>
  );
};

export default PracticeScreen;
