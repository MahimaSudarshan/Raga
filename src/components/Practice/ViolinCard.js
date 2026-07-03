import React from "react";

const ornament = (
  <div style={{ display:"flex", alignItems:"center", margin:"14px 0" }}>
    <div style={{ flex:1, height:"1px", background:"#D4B896" }}/>
    <div style={{ width:"8px", height:"8px", background:"#C8A96E", transform:"rotate(45deg)", margin:"0 10px" }}/>
    <div style={{ flex:1, height:"1px", background:"#D4B896" }}/>
  </div>
);

const ViolinCard = () => (
  <div style={{
    background:"#FBF7F0", border:"1px solid #D4B896", borderRadius:"12px",
    padding:"28px", position:"relative", opacity:0.6
  }}>
    <div style={{
      position:"absolute", top:"16px", right:"16px",
      background:"#C8A96E", color:"#1C1408", fontSize:"10px",
      letterSpacing:"2px", padding:"4px 10px", borderRadius:"4px", fontWeight:500
    }}>COMING SOON</div>

    <div style={{ display:"flex", justifyContent:"center", marginBottom:"20px" }}>
      <img
        src="/images/instruments/violin.png"
        alt="Violin"
        style={{
          height:"200px",
          objectFit:"contain",
          filter:"grayscale(1) brightness(0.8)"
        }}
      />
    </div>

    <div style={{ textAlign:"center", marginBottom:"4px" }}>
      <span style={{ fontFamily:"Cinzel,serif", fontSize:"20px", color:"#3D2210" }}>Violin</span>
    </div>
    <div style={{ textAlign:"center", fontSize:"11px", letterSpacing:"2px", color:"#A08060", marginBottom:"4px" }}>
      BOWED STRING · MELODIC COMPANION
    </div>

    {ornament}

    <div style={{ textAlign:"center", padding:"24px 0", color:"#A08060", fontSize:"13px" }}>
      Raga-aware melodic accompaniment<br/>
      <span style={{ fontSize:"11px", letterSpacing:"1px" }}>coming in Phase 2</span>
    </div>

    {ornament}
  </div>
);

export default ViolinCard;
