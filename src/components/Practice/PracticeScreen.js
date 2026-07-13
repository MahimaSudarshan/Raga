import React, { useState, useEffect } from "react";
import TanpuraCard from "./TanpuraCard";
import TablaCard from "./TablaCard";
import ViolinCard from "./ViolinCard";
import BeatVisualizer from "./BeatVisualizer";
import useDriftDetection from "../../hooks/useDriftDetection";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

const PracticeScreen = () => {
  const { isPlaying, bpm } = useApp();
  const { user } = useAuth();
  const [driftEnabled, setDriftEnabled] = useState(true);
  const { driftMessage } = useDriftDetection(isPlaying, bpm, driftEnabled);

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

      {driftMessage && (
        <div style={{
          background:"#FFF8EE", border:"1px solid #C8A96E", borderRadius:"8px",
          padding:"12px 20px", marginBottom:"20px",
          fontSize:"13px", color:"#7A5830", textAlign:"center",
          letterSpacing:"0.5px"
        }}>
          ⟳ {driftMessage}
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
