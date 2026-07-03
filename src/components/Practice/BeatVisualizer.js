import React from "react";
import { useApp } from "../../context/AppContext";

const TAAL_DATA = {
  Teentaal:    { beats: 16, vibhag: "4+4+4+4", sam: [0], khali: [8] },
  Ektaal:      { beats: 12, vibhag: "2+2+2+2+2+2", sam: [0], khali: [6] },
  Rupak:       { beats: 7,  vibhag: "3+2+2", sam: [0], khali: [] },
  Keherwa:     { beats: 8,  vibhag: "4+4", sam: [0], khali: [4] },
  Dadra:       { beats: 6,  vibhag: "3+3", sam: [0], khali: [3] },
  Jhaptaal:    { beats: 10, vibhag: "2+3+2+3", sam: [0], khali: [6] },
  "Adi Tala":  { beats: 8,  vibhag: "4+2+2", sam: [0], khali: [] },
  Rupaka:      { beats: 6,  vibhag: "3+3", sam: [0], khali: [] },
  "Misra Chapu": { beats: 7, vibhag: "3+2+2", sam: [0], khali: [] },
  "Khanda Chapu": { beats: 5, vibhag: "2+3", sam: [0], khali: [] },
};

const BeatVisualizer = () => {
  const { taal } = useApp();
  const data = TAAL_DATA[taal] || TAAL_DATA["Teentaal"];

  return (
    <div style={{
      background:"#FBF7F0", border:"1px solid #D4B896", borderRadius:"12px",
      padding:"24px 28px"
    }}>
      <div style={{ display:"flex", alignItems:"baseline", gap:"16px", marginBottom:"16px" }}>
        <span style={{ fontFamily:"Cinzel,serif", fontSize:"18px", color:"#3D2210" }}>{taal}</span>
        <span style={{ fontSize:"12px", color:"#A08060", letterSpacing:"1px" }}>
          {data.beats} BEATS · {data.vibhag}
        </span>
        <div style={{ marginLeft:"auto", display:"flex", gap:"16px", fontSize:"11px", color:"#A08060" }}>
          <span><span style={{ display:"inline-block", width:"10px", height:"10px", background:"#3D2210", borderRadius:"50%", marginRight:"4px" }}/>Sam</span>
          <span><span style={{ display:"inline-block", width:"10px", height:"10px", border:"1px solid #C8A96E", borderRadius:"50%", marginRight:"4px" }}/>Khali</span>
          <span><span style={{ display:"inline-block", width:"10px", height:"10px", border:"1px solid #D4B896", borderRadius:"50%", marginRight:"4px" }}/>Tali</span>
        </div>
      </div>

      <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
        {Array.from({ length: data.beats }).map((_, i) => {
          const isSam = data.sam.includes(i);
          const isKhali = data.khali.includes(i);
          return (
            <div key={i} style={{
              width:"40px", height:"40px", borderRadius:"50%",
              display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
              border: isSam ? "none" : isKhali ? "1px solid #C8A96E" : "1px solid #D4B896",
              background: isSam ? "#3D2210" : "#FBF7F0",
              color: isSam ? "#C8A96E" : isKhali ? "#C8A96E" : "#A08060",
              fontSize:"13px", fontWeight: isSam ? 500 : 400,
              cursor:"default"
            }}>
              <span>{i + 1}</span>
              {isSam && <span style={{ fontSize:"7px", letterSpacing:"0.5px", marginTop:"1px" }}>Sam</span>}
              {isKhali && <span style={{ fontSize:"7px", letterSpacing:"0.5px", marginTop:"1px", color:"#C8A96E" }}>Khali</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BeatVisualizer;
