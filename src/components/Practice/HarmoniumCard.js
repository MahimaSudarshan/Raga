import React, { useRef, useEffect, useState } from "react";
import * as Tone from "tone";
import { useApp } from "../../context/AppContext";
import { getMelakarthaScale, SWARA_STHANAS } from "../../data/melakarta";

const NOTE_STRINGS = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];

const HARMONIUM_URLS = {
  "C3":"/Samples/Harmonium/harmonium_C3.m4a",
  "C#3":"/Samples/Harmonium/harmonium_Cs3.m4a",
  "D3":"/Samples/Harmonium/harmonium_D3.m4a",
  "D#3":"/Samples/Harmonium/harmonium_Ds3.m4a",
  "E3":"/Samples/Harmonium/harmonium_E3.m4a",
  "F3":"/Samples/Harmonium/harmonium_F3.m4a",
  "F#3":"/Samples/Harmonium/harmonium_Fs3.m4a",
  "G3":"/Samples/Harmonium/harmonium_G3.m4a",
  "G#3":"/Samples/Harmonium/harmonium_Gs3.m4a",
  "A3":"/Samples/Harmonium/harmonium_A3.m4a",
  "A#3":"/Samples/Harmonium/harmonium_As3.m4a",
  "B3":"/Samples/Harmonium/harmonium_B3.m4a",
  "C4":"/Samples/Harmonium/harmonium_C4.m4a",
  "C#4":"/Samples/Harmonium/harmonium_Cs4.m4a",
  "D4":"/Samples/Harmonium/harmonium_D4.m4a",
  "D#4":"/Samples/Harmonium/harmonium_Ds4.m4a",
  "E4":"/Samples/Harmonium/harmonium_E4.m4a",
  "F4":"/Samples/Harmonium/harmonium_F4.m4a",
  "F#4":"/Samples/Harmonium/harmonium_Fs4.m4a",
  "G4":"/Samples/Harmonium/harmonium_G4.m4a",
  "G#4":"/Samples/Harmonium/harmonium_Gs4.m4a",
  "A4":"/Samples/Harmonium/harmonium_A4.m4a",
  "A#4":"/Samples/Harmonium/harmonium_As4.m4a",
  "B4":"/Samples/Harmonium/harmonium_B4.m4a",
  "C5":"/Samples/Harmonium/harmonium_C5.m4a",
  "C#5":"/Samples/Harmonium/harmonium_Cs5.m4a",
  "D5":"/Samples/Harmonium/harmonium_D5.m4a",
  "D#5":"/Samples/Harmonium/harmonium_Ds5.m4a",
  "E5":"/Samples/Harmonium/harmonium_E5.m4a",
  "F5":"/Samples/Harmonium/harmonium_F5.m4a",
  "F#5":"/Samples/Harmonium/harmonium_Fs5.m4a",
  "G5":"/Samples/Harmonium/harmonium_G5.m4a",
  "G#5":"/Samples/Harmonium/harmonium_Gs5.m4a",
  "A5":"/Samples/Harmonium/harmonium_A5.m4a",
  "A#5":"/Samples/Harmonium/harmonium_As5.m4a",
  "B5":"/Samples/Harmonium/harmonium_B5.m4a",
  "C6":"/Samples/Harmonium/harmonium_C6.m4a",
};

const ornament = (
  <div style={{ display:"flex", alignItems:"center", margin:"14px 0" }}>
    <div style={{ flex:1, height:"1px", background:"#D4B896" }}/>
    <div style={{ width:"8px", height:"8px", background:"#C8A96E", transform:"rotate(45deg)", margin:"0 10px" }}/>
    <div style={{ flex:1, height:"1px", background:"#D4B896" }}/>
  </div>
);

const HarmoniumCard = () => {
  const { shruti, selectedMelakarta } = useApp();
  const samplerRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [activeNote, setActiveNote] = useState(null);

  const getAllowedSemitones = () => {
    if (!selectedMelakarta) return new Set([0,1,2,3,4,5,6,7,8,9,10,11]);
    const scale = getMelakarthaScale(selectedMelakarta.number);
    return new Set([
      0,
      SWARA_STHANAS[scale.ri],
      SWARA_STHANAS[scale.ga],
      SWARA_STHANAS[scale.ma],
      7,
      SWARA_STHANAS[scale.dha],
      SWARA_STHANAS[scale.ni],
    ]);
  };

  useEffect(() => {
    const sampler = new Tone.Sampler({
      urls: HARMONIUM_URLS,
      onload: () => setLoaded(true),
      onerror: (e) => console.error("Harmonium load error:", e),
    }).toDestination();
    samplerRef.current = sampler;
    return () => { if (samplerRef.current) samplerRef.current.dispose(); };
  }, []);

  const playNote = async (note) => {
    if (!loaded || !samplerRef.current) return;
    await Tone.start();
    samplerRef.current.triggerAttackRelease(note, "2n");
    setActiveNote(note);
    setTimeout(() => setActiveNote(null), 500);
  };

  const saIndex = NOTE_STRINGS.indexOf(shruti);
  const allowedSemitones = getAllowedSemitones();

  const keys = [];
  for (let i = 0; i < 25; i++) {
    const noteIndex = (saIndex + i) % 12;
    const octave = 4 + Math.floor((saIndex + i) / 12);
    const noteName = NOTE_STRINGS[noteIndex];
    const fullNote = `${noteName}${octave}`;
    const isBlack = [1,3,6,8,10].includes(noteIndex);
    const semitone = i % 12;
    const isAllowed = allowedSemitones.has(semitone);
    const isSa = semitone === 0;
    const isPa = semitone === 7;
    keys.push({ noteName, fullNote, isBlack, isAllowed, isSa, isPa, semitone, index: i });
  }

  const whiteKeys = keys.filter(k => !k.isBlack);

  return (
    <div style={{
      background:"#FBF7F0", border:"1px solid #D4B896", borderRadius:"12px",
      padding:"28px", position:"relative"
    }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"16px" }}>
        <div>
          <div style={{ fontFamily:"Cinzel,serif", fontSize:"20px", color:"#3D2210" }}>Harmonium</div>
          <div style={{ fontSize:"11px", letterSpacing:"2px", color:"#A08060", marginTop:"2px" }}>
            REED ORGAN · TONAL REFERENCE · {loaded ? "READY" : "LOADING..."}
          </div>
        </div>
        <div style={{ fontSize:"12px", color:"#A08060" }}>
          {selectedMelakarta
            ? <span>Raga: <span style={{ color:"#C8A96E" }}>{selectedMelakarta.name}</span> — valid notes highlighted</span>
            : <span>Select a raga to highlight valid notes</span>
          }
        </div>
      </div>

      {ornament}

      <div style={{ position:"relative", height:"140px", marginBottom:"16px", overflowX:"auto" }}>
        <div style={{ position:"relative", display:"inline-flex", minWidth:"100%" }}>
          {whiteKeys.map((key) => (
            <div key={key.fullNote} onClick={() => playNote(key.fullNote)} style={{
              width:"42px", height:"130px",
              border:"1px solid #D4B896",
              borderRadius:"0 0 6px 6px",
              marginRight:"2px",
              background: activeNote === key.fullNote ? "#C8A96E" :
                key.isSa ? "#F0E8D8" :
                key.isPa ? "#F5EFE4" : "#FBF7F0",
              cursor: loaded ? "pointer" : "default",
              display:"flex", alignItems:"flex-end", justifyContent:"center",
              paddingBottom:"8px",
              transition:"background 0.1s",
              borderTop: key.isSa ? "3px solid #C8A96E" : key.isPa ? "3px solid #D4B896" : "1px solid #D4B896",
            }}>
              <span style={{
                fontSize:"9px",
                color: key.isSa ? "#C8A96E" : key.isPa ? "#A08060" : "#C8C0B0",
                fontWeight: key.isSa || key.isPa ? 600 : 400,
              }}>
                {key.isSa ? "Sa" : key.isPa ? "Pa" : ""}
              </span>
            </div>
          ))}

          {(() => {
            let whiteCount = -1;
            return keys.map((key) => {
              if (!key.isBlack) { whiteCount++; return null; }
              const leftPos = whiteCount * 44 + 28;
              return (
                <div key={key.fullNote} onClick={() => playNote(key.fullNote)} style={{
                  position:"absolute", left:`${leftPos}px`,
                  top:0, width:"26px", height:"85px",
                  background: activeNote === key.fullNote ? "#C8A96E" :
                    key.isAllowed && selectedMelakarta ? "#2C1E0A" : "#3D2210",
                  borderRadius:"0 0 4px 4px",
                  cursor: loaded ? "pointer" : "default",
                  zIndex:2,
                  border: key.isAllowed && selectedMelakarta ? "1px solid #C8A96E" : "1px solid #1C1008",
                  transition:"background 0.1s",
                }}/>
              );
            });
          })()}
        </div>
      </div>

      <div style={{ display:"flex", gap:"20px", fontSize:"11px", color:"#A08060" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
          <div style={{ width:"16px", height:"16px", background:"#F0E8D8", border:"2px solid #C8A96E", borderRadius:"3px" }}/>Sa
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
          <div style={{ width:"16px", height:"16px", background:"#F5EFE4", border:"1px solid #D4B896", borderRadius:"3px" }}/>Pa
        </div>
        {selectedMelakarta && (
          <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
            <div style={{ width:"16px", height:"16px", background:"#2C1E0A", border:"1px solid #C8A96E", borderRadius:"3px" }}/>
            Valid raga notes
          </div>
        )}
      </div>
    </div>
  );
};

export default HarmoniumCard;
