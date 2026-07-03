import React from "react";
import { useApp } from "../../context/AppContext";

const MOCK_FAVOURITES = [
  { name: "Evening Riyaz", shruti: "F#", taal: "Teentaal", laya: "Madhya", tradition: "Hindustani" },
  { name: "Morning Sa", shruti: "C", taal: "Adi Tala", laya: "Vilambit", tradition: "Carnatic" },
  { name: "Drut Keherwa", shruti: "G", taal: "Keherwa", laya: "Drut", tradition: "Hindustani" },
  { name: "Khayal Base", shruti: "A#", taal: "Ektaal", laya: "Vilambit", tradition: "Hindustani" },
];

const FavouritesScreen = () => {
  const { setShruti, setTaal, setLaya, setTradition } = useApp();

  const loadPractice = (fav) => {
    setShruti(fav.shruti);
    setTaal(fav.taal);
    setLaya(fav.laya);
    setTradition(fav.tradition.toLowerCase());
    window.location.href = "/";
  };

  return (
    <div style={{ padding:"40px", background:"#F5EFE4", minHeight:"calc(100vh - 132px)" }}>
      <h2 style={{ fontFamily:"Cinzel,serif", fontSize:"28px", color:"#3D2210", marginBottom:"6px" }}>Favourites</h2>
      <p style={{ color:"#A08060", fontSize:"13px", marginBottom:"16px" }}>Saved shruti and taal combinations</p>

      <div style={{
        background:"#FFF8EE", border:"1px solid #C8A96E", borderRadius:"8px",
        padding:"10px 16px", marginBottom:"24px", fontSize:"12px", color:"#A08060"
      }}>
        ⚠ Sample data shown for demonstration. Real favourites will appear here after login is connected.
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"20px" }}>
        {MOCK_FAVOURITES.map((fav, i) => (
          <div key={i} style={{ background:"#FBF7F0", border:"1px solid #D4B896", borderRadius:"12px", padding:"24px", position:"relative" }}>
            <span style={{ position:"absolute", top:"16px", right:"16px", color:"#C8A96E", fontSize:"16px" }}>♥</span>
            <h3 style={{ fontFamily:"Cinzel,serif", fontSize:"16px", color:"#3D2210", marginBottom:"16px" }}>{fav.name}</h3>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px", marginBottom:"16px" }}>
              {[["SHRUTI", `SA · ${fav.shruti}`], ["TAAL", fav.taal], ["LAYA", fav.laya], ["SYSTEM", fav.tradition]].map(([label, value]) => (
                <div key={label}>
                  <div style={{ fontSize:"9px", letterSpacing:"2px", color:"#A08060", marginBottom:"2px" }}>{label}</div>
                  <div style={{ fontSize:"12px", color: label === "SHRUTI" ? "#C8A96E" : "#3D2210" }}>{value}</div>
                </div>
              ))}
            </div>
            <button onClick={() => loadPractice(fav)} style={{
              width:"100%", padding:"10px", fontSize:"12px", letterSpacing:"1px",
              background:"#C8A96E", border:"none", borderRadius:"8px",
              color:"#1C1408", cursor:"pointer", fontWeight:500
            }}>▶ Load Practice</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavouritesScreen;
