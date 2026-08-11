import React, { useState } from "react";
import KatapayadiCircle from "../Practice/KatapayadiCircle";
import { getMelakarthaScale } from "../../data/melakarta";
import { useApp } from "../../context/AppContext";

const RagaScreen = () => {
  const [selectedMelakarta, setSelectedMelakarta] = useState(null);
  const { setShruti } = useApp();

  const handleSelect = (raga) => {
    setSelectedMelakarta(raga);
  };

  const scale = selectedMelakarta ? getMelakarthaScale(selectedMelakarta.number) : null;

  return (
    <div style={{ padding:"32px", background:"#F5EFE4", minHeight:"calc(100vh - 132px)" }}>

      <h2 style={{ fontFamily:"Cinzel,serif", fontSize:"28px", color:"#3D2210", marginBottom:"6px" }}>
        Melakarta Ragas
      </h2>
      <p style={{ color:"#A08060", fontSize:"13px", marginBottom:"28px" }}>
        72 parent scales of Carnatic music · Katapayadi system
      </p>

      <KatapayadiCircle
        onSelect={handleSelect}
        selectedMelakarta={selectedMelakarta}
      />

      {/* Scale display */}
      {scale && selectedMelakarta && (
        <div style={{
          background:"#FBF7F0", border:"1px solid #D4B896", borderRadius:"12px",
          padding:"28px", marginTop:"28px"
        }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"20px" }}>
            <div>
              <div style={{ fontFamily:"Cinzel,serif", fontSize:"22px", color:"#3D2210", marginBottom:"4px" }}>
                {selectedMelakarta.number}. {selectedMelakarta.name}
              </div>
              <div style={{ fontSize:"12px", color:"#A08060", letterSpacing:"1px" }}>
                {selectedMelakarta.chakra} Chakra · {scale.ma === "M1" ? "Shuddha Madhyama" : "Prati Madhyama"}
              </div>
            </div>
            <button onClick={() => {
              setShruti("C");
              window.location.href = "/";
            }} style={{
              padding:"8px 20px", fontSize:"12px", letterSpacing:"1px",
              background:"#C8A96E", border:"none", borderRadius:"8px",
              color:"#1C1408", cursor:"pointer", fontWeight:500
            }}>▶ Practice This Raga</button>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"20px" }}>
            <div>
              <div style={{ fontSize:"10px", letterSpacing:"2px", color:"#A08060", marginBottom:"10px" }}>AROHANA</div>
              <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
                {scale.arohana.map((s, i) => (
                  <div key={i} style={{
                    padding:"8px 12px", background:"#F5EFE4",
                    border:"1px solid #D4B896", borderRadius:"6px",
                    fontSize:"13px", color:"#3D2210", fontWeight:500
                  }}>{s}</div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize:"10px", letterSpacing:"2px", color:"#A08060", marginBottom:"10px" }}>AVAROHANA</div>
              <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
                {scale.avarohana.map((s, i) => (
                  <div key={i} style={{
                    padding:"8px 12px", background:"#F5EFE4",
                    border:"1px solid #D4B896", borderRadius:"6px",
                    fontSize:"13px", color:"#3D2210", fontWeight:500
                  }}>{s}</div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:"12px", marginTop:"20px" }}>
            {[
              ["Ri", scale.ri],
              ["Ga", scale.ga],
              ["Ma", scale.ma],
              ["Dha", scale.dha],
              ["Ni", scale.ni],
            ].map(([label, value]) => (
              <div key={label} style={{
                background:"#F5EFE4", border:"1px solid #D4B896",
                borderRadius:"8px", padding:"12px", textAlign:"center"
              }}>
                <div style={{ fontSize:"10px", letterSpacing:"2px", color:"#A08060", marginBottom:"4px" }}>{label}</div>
                <div style={{ fontFamily:"Cinzel,serif", fontSize:"16px", color:"#C8A96E" }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RagaScreen;
