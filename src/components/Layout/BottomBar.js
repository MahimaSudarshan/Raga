import React, { useEffect, useRef } from "react";
import { useApp } from "../../context/AppContext";

const BottomBar = () => {
  const { shruti, taal, laya, isPlaying, setIsPlaying, sessionTime, setSessionTime } = useApp();
  const timerRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => setSessionTime(t => t + 1), 1000);
    } else {
      clearInterval(timerRef.current);
      setSessionTime(0);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying]);

  const fmt = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  const handleStop = () => {
    setIsPlaying(false);
    setSessionTime(0);
  };

  return (
    <div style={{
      position:"fixed", bottom:0, left:"60px", right:0, height:"64px",
      background:"#1C1408", borderTop:"1px solid #3D2210",
      display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"0 32px", zIndex:100
    }}>
      <div>
        <div style={{ fontSize:"10px", letterSpacing:"2px", color:"#5A4020", marginBottom:"3px" }}>CURRENT PRACTICE</div>
        <div style={{ fontSize:"13px", color:"#A08060" }}>
          Sa · <span style={{ color:"#C8A96E" }}>{shruti}</span> · {taal} · {laya} Laya
        </div>
      </div>

      <div style={{ display:"flex", gap:"12px", alignItems:"center" }}>
        <button onClick={handleStop} style={{
          width:"40px", height:"40px", borderRadius:"8px",
          background:"transparent", border:"1px solid #5A4020",
          color:"#C8A96E", fontSize:"14px", cursor:"pointer"
        }}>■</button>

        <button onClick={() => setIsPlaying(p => !p)} style={{
          width:"52px", height:"52px", borderRadius:"50%",
          background:"#C8A96E", border:"none",
          color:"#1C1408", fontSize:"22px", cursor:"pointer",
          boxShadow:"0 2px 12px rgba(200,169,110,0.3)"
        }}>{isPlaying ? "⏸" : "▶"}</button>
      </div>

      <div style={{ textAlign:"right" }}>
        <div style={{ fontSize:"10px", letterSpacing:"2px", color:"#5A4020", marginBottom:"3px" }}>SESSION</div>
        <div style={{ fontSize:"16px", color:"#C8A96E", fontFamily:"Cinzel,serif" }}>{fmt(sessionTime)}</div>
      </div>
    </div>
  );
};

export default BottomBar;
