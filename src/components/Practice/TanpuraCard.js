import React, { useRef, useEffect } from "react";
import * as Tone from "tone";
import { useApp } from "../../context/AppContext";

const SHRUTIS = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
const BASE_FILE = "/Samples/Tanpura/G.m4a";

const getPlaybackRate = (shruti) => {
  const index = SHRUTIS.indexOf(shruti);
  let shift = index - SHRUTIS.indexOf("G");
  if (shift > 6) shift -= 12;
  if (shift < -6) shift += 12;
  return Math.pow(2, shift / 12);
};

const ornament = (
  <div style={{ display:"flex", alignItems:"center", margin:"14px 0" }}>
    <div style={{ flex:1, height:"1px", background:"#D4B896" }}/>
    <div style={{ width:"8px", height:"8px", background:"#C8A96E", transform:"rotate(45deg)", margin:"0 10px" }}/>
    <div style={{ flex:1, height:"1px", background:"#D4B896" }}/>
  </div>
);

const TanpuraCard = () => {
  const { shruti, setShruti, isPlaying, setIsPlaying } = useApp();
  const playerRef = useRef(null);

  useEffect(() => {
    const startAudio = async () => {
      if (isPlaying) {
        await Tone.start();
        const player = new Tone.Player({
          url: BASE_FILE,
          loop: true,
          fadeIn: 0.5,
          fadeOut: 0.5,
        }).toDestination();
        await Tone.loaded();
        player.playbackRate = getPlaybackRate(shruti);
        player.start();
        playerRef.current = player;
      } else {
        if (playerRef.current) {
          playerRef.current.stop();
          playerRef.current.dispose();
          playerRef.current = null;
        }
      }
    };
    startAudio();
  }, [isPlaying]);

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.playbackRate = getPlaybackRate(shruti);
    }
  }, [shruti]);

  return (
    <div style={{
      background:"#FBF7F0", border:"1px solid #D4B896", borderRadius:"12px",
      padding:"28px", position:"relative"
    }}>
      <div style={{ display:"flex", justifyContent:"center", marginBottom:"20px" }}>
        <img
          src="/images/instruments/tanpura.png"
          alt="Tanpura"
          style={{
            height:"200px",
            objectFit:"contain",
            filter:"sepia(0.2) saturate(0.9) brightness(0.85)"
          }}
        />
      </div>

      <div style={{ textAlign:"center", marginBottom:"4px" }}>
        <span style={{ fontFamily:"Cinzel,serif", fontSize:"20px", color:"#3D2210" }}>Tanpura</span>
      </div>
      <div style={{ textAlign:"center", fontSize:"11px", letterSpacing:"2px", color:"#A08060", marginBottom:"4px" }}>
        4-STRING DRONE · SA FOUNDATION
      </div>

      {ornament}

      <div style={{ fontSize:"10px", letterSpacing:"2px", color:"#A08060", marginBottom:"8px" }}>SELECT SHRUTI</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:"6px", marginBottom:"8px" }}>
        {SHRUTIS.map(s => (
          <button key={s} onClick={() => setShruti(s)} style={{
            padding:"8px 4px", fontSize:"12px", fontWeight:500, textAlign:"center",
            border:"1px solid", borderColor: shruti===s ? "#C8A96E" : "#D4B896",
            borderRadius:"6px", cursor:"pointer",
            background: shruti===s ? "#C8A96E" : "#FBF7F0",
            color: shruti===s ? "#1C1408" : "#7A5830",
            transition:"all 0.15s"
          }}>{s}</button>
        ))}
      </div>

      {ornament}

      <div style={{
        textAlign:"center", fontSize:"12px", color: isPlaying ? "#C8A96E" : "#A08060",
        letterSpacing:"1px", padding:"8px 0"
      }}>
        {isPlaying ? "● Tanpura playing — use bottom bar to stop" : "Press ▶ in bottom bar to start"}
      </div>
    </div>
  );
};

export default TanpuraCard;
