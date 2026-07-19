import React, { useState, useEffect } from "react";
import TanpuraCard from "./TanpuraCard";
import TablaCard from "./TablaCard";
import ViolinCard from "./ViolinCard";
import BeatVisualizer from "./BeatVisualizer";
import useDriftDetection from "../../hooks/useDriftDetection";
import usePitchDetection from "../../hooks/usePitchDetection";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

const PracticeScreen = () => {
  const { isPlaying, bpm, shruti } = useApp();
  const { user } = useAuth();
  const [driftEnabled, setDriftEnabled] = useState(true);
  const { driftMessage } = useDriftDetection(isPlaying, bpm, driftEnabled);
  const { pitchInfo, modelLoaded } = usePitchDetection(isPlaying, shruti, driftEnabled);

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

      {/* ML Pitch detection display */}
      {isPlaying && driftEnabled && (
        <div style={{
          background:"#FBF7F0", border:"1px solid #D4B896", borderRadius:"8px",
          padding:"12px 24px", marginBottom:"20px",
          display:"flex", alignItems:"center", justifyContent:"space-between"
        }}>
          <div style={{ fontSize:"10px", letterSpacing:"2px", color:"#A08060" }}>
            PITCH DETECTION {modelLoaded ? "● ACTIVE" : "○ LOADING"}
          </div>
          {pitchInfo ? (
            <div style={{ display:"flex", gap:"32px", alignItems:"center" }}>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:"10px", color:"#A08060", letterSpacing:"1px", marginBottom:"2px" }}>SWARA</div>
                <div style={{ fontFamily:"Cinzel,serif", fontSize:"20px", color:"#C8A96E" }}>{pitchInfo.swara}</div>
              </div>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:"10px", color:"#A08060", letterSpacing:"1px", marginBottom:"2px" }}>NOTE</div>
                <div style={{ fontFamily:"Cinzel,serif", fontSize:"20px", color:"#3D2210" }}>{pitchInfo.noteName}{pitchInfo.octave}</div>
              </div>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:"10px", color:"#A08060", letterSpacing:"1px", marginBottom:"2px" }}>FREQ</div>
                <div style={{ fontSize:"16px", color:"#3D2210" }}>{pitchInfo.freq} Hz</div>
              </div>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:"10px", color:"#A08060", letterSpacing:"1px", marginBottom:"2px" }}>CENTS</div>
                <div style={{ fontSize:"16px", color: Math.abs(pitchInfo.cents) > 20 ? "#C8A96E" : "#3D2210" }}>
                  {pitchInfo.cents > 0 ? "+" : ""}{pitchInfo.cents}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ fontSize:"12px", color:"#A08060" }}>Sing to detect pitch...</div>
          )}
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"24px", marginBottom:"24px" }}>
        <TanpuraCard />
        <TablaCard />
        <ViolinCard />
      </div>

      <BeatVisualizer />
    </div>
  );
};

export default PracticeScreen;
