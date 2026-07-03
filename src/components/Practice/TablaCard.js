import React from "react";
import { useApp } from "../../context/AppContext";

const HINDUSTANI_TAALS = [
  { name: "Teentaal", beats: 16 },
  { name: "Ektaal", beats: 12 },
  { name: "Rupak", beats: 7 },
  { name: "Keherwa", beats: 8 },
  { name: "Dadra", beats: 6 },
  { name: "Jhaptaal", beats: 10 },
];

const CARNATIC_TALAMS = [
  { name: "Adi Tala", beats: 8 },
  { name: "Rupaka", beats: 6 },
  { name: "Misra Chapu", beats: 7 },
  { name: "Khanda Chapu", beats: 5 },
];

const LAYAS = ["Vilambit", "Madhya", "Drut"];
const LAYA_BPM = { Vilambit: 40, Madhya: 120, Drut: 180 };

const ornament = (
  <div style={{ display:"flex", alignItems:"center", margin:"14px 0" }}>
    <div style={{ flex:1, height:"1px", background:"#D4B896" }}/>
    <div style={{ width:"8px", height:"8px", background:"#C8A96E", transform:"rotate(45deg)", margin:"0 10px" }}/>
    <div style={{ flex:1, height:"1px", background:"#D4B896" }}/>
  </div>
);

const TablaCard = () => {
  const { tradition, taal, setTaal, laya, setLaya, bpm, setBpm } = useApp();

  const taals = tradition === "hindustani" ? HINDUSTANI_TAALS : CARNATIC_TALAMS;
  const instrumentName = tradition === "hindustani" ? "Tabla" : "Mrudangam";
  const instrumentDesc = tradition === "hindustani" ? "TAAL KEEPER · RHYTHM FOUNDATION" : "DOUBLE-HEADED BARREL DRUM · TALAM FOUNDATION";

  React.useEffect(() => {
    const defaultTaal = tradition === "hindustani" ? "Teentaal" : "Adi Tala";
    setTaal(defaultTaal);
  }, [tradition]);

  return (
    <div style={{
      background:"#FBF7F0", border:"1px solid #D4B896", borderRadius:"12px",
      padding:"28px", position:"relative"
    }}>
      <div style={{
        position:"absolute", top:"16px", right:"16px",
        background:"#C8A96E", color:"#1C1408", fontSize:"10px",
        letterSpacing:"2px", padding:"4px 10px", borderRadius:"4px", fontWeight:500
      }}>COMING SOON</div>

      <div style={{ display:"flex", justifyContent:"center", marginBottom:"20px" }}>
        {tradition === "hindustani" ? (
          <img
            src="/images/instruments/tabla.png"
            alt="Tabla"
            style={{
              height:"200px",
              objectFit:"contain",
              filter:"sepia(0.3) saturate(0.8) brightness(0.8)"
            }}
          />
        ) : (
          <img
            src="/images/instruments/mrudangam.png"
            alt="Mrudangam"
            style={{
              height:"200px",
              objectFit:"contain",
              filter:"sepia(0.8) saturate(0.6) brightness(0.75)"
            }}
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
    </div>
  );
};

export default TablaCard;
