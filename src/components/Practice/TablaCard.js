import React, { useRef, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import * as Tone from "tone";

const NOTE_STRINGS = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
const RECORDED_SHRUTI = "G#";
const RECORDED_SHRUTI_INDEX = NOTE_STRINGS.indexOf(RECORDED_SHRUTI);

const getSemitonShift = (shruti) => {
  const shrutiIndex = NOTE_STRINGS.indexOf(shruti);
  let shift = shrutiIndex - RECORDED_SHRUTI_INDEX;
  if (shift > 6) shift -= 12;
  if (shift < -6) shift += 12;
  return shift;
};

const HINDUSTANI_TAALS = [
  { name: "Teentaal", beats: 16, file: "/Samples/Tabla/Teen taal.m4a", recordedBPM: 73.8 },
  { name: "Ektaal", beats: 12, file: "/Samples/Tabla/Ek taal.m4a", recordedBPM: 55.4 },
  { name: "Rupak", beats: 7, file: "/Samples/Tabla/Rupak taal.m4a", recordedBPM: 60 },
  { name: "Dadra", beats: 6, file: "/Samples/Tabla/Dadra taal.m4a", recordedBPM: 51.4 },
  { name: "Jhaptaal", beats: 10, file: "/Samples/Tabla/Jaap taal.m4a", recordedBPM: 37.5 },
];

const CARNATIC_TALAMS = [
  { name: "Adi Tala", beats: 8, file: "/Samples/Mrudanga/Adi.m4a", recordedBPM: 61.7 },
  { name: "Rupaka", beats: 6, file: "/Samples/Mrudanga/Rupaka.m4a", recordedBPM: 123.4 },
  { name: "Misra Chapu", beats: 7, file: "/Samples/Mrudanga/Misra chapu.m4a", recordedBPM: 111.2 },
  { name: "Khanda Chapu", beats: 5, file: "/Samples/Mrudanga/Khanda chapu.m4a", recordedBPM: 127.3 },
];

const LAYAS = ["Vilambit", "Madhya", "Drut"];
const LAYA_BPM = { Vilambit: 40, Madhya: 80, Drut: 160 };

const ornament = (
  <div style={{ display:"flex", alignItems:"center", margin:"14px 0" }}>
    <div style={{ flex:1, height:"1px", background:"#D4B896" }}/>
    <div style={{ width:"8px", height:"8px", background:"#C8A96E", transform:"rotate(45deg)", margin:"0 10px" }}/>
    <div style={{ flex:1, height:"1px", background:"#D4B896" }}/>
  </div>
);

const TablaCard = () => {
  const { tradition, taal, setTaal, laya, setLaya, bpm, setBpm, tablaPlaying, setTablaPlaying, shruti } = useApp();
  const playerRef = useRef(null);

  const taals = tradition === "hindustani" ? HINDUSTANI_TAALS : CARNATIC_TALAMS;
  const instrumentName = tradition === "hindustani" ? "Tabla" : "Mrudangam";
  const instrumentDesc = tradition === "hindustani" ? "TAAL KEEPER · RHYTHM FOUNDATION" : "DOUBLE-HEADED BARREL DRUM · TALAM FOUNDATION";
  const currentTaal = taals.find(t => t.name === taal) || taals[0];

  React.useEffect(() => {
    const defaultTaal = tradition === "hindustani" ? "Teentaal" : "Adi Tala";
    setTaal(defaultTaal);
  }, [tradition]);

  const getPlaybackRate = () => {
    if (!currentTaal) return 1;
    const tempoRate = bpm / currentTaal.recordedBPM;
    const pitchRate = Math.pow(2, getSemitonShift(shruti) / 12);
    return tempoRate * pitchRate;
  };

  useEffect(() => {
    let player = null;

    const startAudio = async () => {
      if (tablaPlaying && currentTaal) {
        await Tone.start();
        player = new Tone.Player({
          url: currentTaal.file,
          loop: true,
          fadeIn: 0.3,
          fadeOut: 0.3,
        }).toDestination();
        await Tone.loaded();
        player.playbackRate = getPlaybackRate();
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

    return () => {
      if (playerRef.current) {
        playerRef.current.stop();
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [tablaPlaying, taal]);

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.playbackRate = getPlaybackRate();
    }
  }, [bpm, shruti]);

  return (
    <div style={{
      background:"#FBF7F0", border:"1px solid #D4B896", borderRadius:"12px",
      padding:"28px", position:"relative"
    }}>
      <div style={{ display:"flex", justifyContent:"center", marginBottom:"20px" }}>
        {tradition === "hindustani" ? (
          <img src="/images/instruments/tabla.png" alt="Tabla"
            style={{ height:"200px", objectFit:"contain", filter:"sepia(0.3) saturate(0.8) brightness(0.8)" }}
          />
        ) : (
          <img src="/images/instruments/mrudangam.png" alt="Mrudangam"
            style={{ height:"200px", objectFit:"contain", filter:"sepia(0.3) saturate(1.2) brightness(0.85)" }}
          />
        )}
      </div>

      <div style={{ textAlign:"center", marginBottom:"4px" }}>
        <span style={{ fontFamily:"Cinzel,serif", fontSize:"20px", color:"#3D2210" }}>{instrumentName}</span>
      </div>
      <div style={{ textAlign:"center", fontSize:"11px", letterSpacing:"2px", color:"#A08060", marginBottom:"4px" }}>
        {instrumentDesc}
      </div>

      {ornament}

      <div style={{ fontSize:"10px", letterSpacing:"2px", color:"#A08060", marginBottom:"8px" }}>SELECT TAAL</div>
      <select value={taal} onChange={e => setTaal(e.target.value)} style={{
        width:"100%", padding:"10px 12px", fontSize:"13px",
        border:"1px solid #D4B896", borderRadius:"8px",
        background:"#FBF7F0", color:"#3D2210", marginBottom:"16px", cursor:"pointer"
      }}>
        {taals.map(t => (
          <option key={t.name} value={t.name}>{t.name} — {t.beats} beats</option>
        ))}
      </select>

      <div style={{ fontSize:"10px", letterSpacing:"2px", color:"#A08060", marginBottom:"8px" }}>LAYA (TEMPO)</div>
      <div style={{ display:"flex", gap:"8px", marginBottom:"16px" }}>
        {LAYAS.map(l => (
          <button key={l} onClick={() => { setLaya(l); setBpm(LAYA_BPM[l]); }} style={{
            flex:1, padding:"8px", fontSize:"12px", letterSpacing:"1px",
            border:"1px solid", borderColor: laya===l ? "#C8A96E" : "#D4B896",
            borderRadius:"6px", cursor:"pointer",
            background: laya===l ? "#C8A96E" : "#FBF7F0",
            color: laya===l ? "#1C1408" : "#7A5830"
          }}>{l}</button>
        ))}
      </div>

      <div style={{ display:"flex", justifyContent:"space-between", fontSize:"10px", letterSpacing:"2px", color:"#A08060", marginBottom:"6px" }}>
        <span>BPM</span><span style={{ color:"#C8A96E" }}>{bpm}</span>
      </div>
      <input type="range" min="30" max="200" value={bpm}
        onChange={e => setBpm(Number(e.target.value))}
        style={{ width:"100%", accentColor:"#C8A96E" }}
      />

      {ornament}

      <button onClick={() => setTablaPlaying(p => !p)} style={{
        width:"100%", padding:"16px", fontSize:"13px", letterSpacing:"1px",
        fontWeight:500, borderRadius:"8px", cursor:"pointer",
        background: tablaPlaying ? "transparent" : "#C8A96E",
        border: tablaPlaying ? "1px solid #C8503A" : "none",
        color: tablaPlaying ? "#C8503A" : "#1C1408"
      }}>
        {tablaPlaying ? `■ STOP ${instrumentName.toUpperCase()}` : `▶ PLAY ${instrumentName.toUpperCase()}`}
      </button>
    </div>
  );
};

export default TablaCard;
