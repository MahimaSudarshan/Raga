import React, { useState } from "react";
import { CHAKRAS, MELAKARTAS, getMelakarthaScale } from "../../data/melakarta";

const KatapayadiCircle = ({ onSelect, selectedMelakarta }) => {
  const [activeChakra, setActiveChakra] = useState(null);

  const centerX = 300;
  const centerY = 300;
  const outerR = 260;
  const innerR = 160;
  const labelR = 215;

  const getChakraPath = (index, total) => {
    const startAngle = (index / total) * 2 * Math.PI - Math.PI / 2;
    const endAngle = ((index + 1) / total) * 2 * Math.PI - Math.PI / 2;
    const x1 = centerX + outerR * Math.cos(startAngle);
    const y1 = centerY + outerR * Math.sin(startAngle);
    const x2 = centerX + outerR * Math.cos(endAngle);
    const y2 = centerY + outerR * Math.sin(endAngle);
    const x3 = centerX + innerR * Math.cos(endAngle);
    const y3 = centerY + innerR * Math.sin(endAngle);
    const x4 = centerX + innerR * Math.cos(startAngle);
    const y4 = centerY + innerR * Math.sin(startAngle);
    return `M ${x1} ${y1} A ${outerR} ${outerR} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 0 0 ${x4} ${y4} Z`;
  };

  const getChakraLabelPos = (index, total) => {
    const angle = ((index + 0.5) / total) * 2 * Math.PI - Math.PI / 2;
    return {
      x: centerX + labelR * Math.cos(angle),
      y: centerY + labelR * Math.sin(angle),
    };
  };

  const chakraRagas = activeChakra
    ? MELAKARTAS.filter(m => m.chakraNum === activeChakra.number)
    : [];

  return (
    <div style={{ display:"flex", gap:"32px", alignItems:"flex-start" }}>

      {/* Circle */}
      <div style={{ position:"relative" }}>
        <svg width="600" height="600" viewBox="0 0 600 600">
          {/* Background */}
          <circle cx={centerX} cy={centerY} r={outerR + 10} fill="#FBF7F0" stroke="#D4B896" strokeWidth="1"/>

          {/* Chakra segments */}
          {CHAKRAS.map((chakra, i) => {
            const isActive = activeChakra?.number === chakra.number;
            const path = getChakraPath(i, 12);
            const labelPos = getChakraLabelPos(i, 12);
            const angle = ((i + 0.5) / 12) * 360 - 90;

            return (
              <g key={chakra.number} onClick={() => setActiveChakra(isActive ? null : chakra)}
                style={{ cursor:"pointer" }}>
                <path
                  d={path}
                  fill={isActive ? "#3D2210" : "#FBF7F0"}
                  stroke="#D4B896"
                  strokeWidth="1"
                  style={{ transition:"all 0.2s" }}
                />
                <text
                  x={labelPos.x}
                  y={labelPos.y - 6}
                  textAnchor="middle"
                  fontSize="11"
                  fontFamily="Cinzel, serif"
                  fill={isActive ? "#C8A96E" : "#3D2210"}
                  fontWeight="500"
                >
                  {chakra.name}
                </text>
                <text
                  x={labelPos.x}
                  y={labelPos.y + 8}
                  textAnchor="middle"
                  fontSize="9"
                  fill={isActive ? "#C8A96E" : "#A08060"}
                >
                  {chakra.meaning}
                </text>
                <text
                  x={labelPos.x}
                  y={labelPos.y + 20}
                  textAnchor="middle"
                  fontSize="8"
                  fill={isActive ? "#C8A96E" : "#C8A96E"}
                >
                  {((chakra.number - 1) * 6 + 1)}-{chakra.number * 6}
                </text>
              </g>
            );
          })}

          {/* Inner circle */}
          <circle cx={centerX} cy={centerY} r={innerR} fill="#F5EFE4" stroke="#D4B896" strokeWidth="1"/>

          {/* Center content */}
          {!activeChakra && (
            <>
              <text x={centerX} y={centerY - 20} textAnchor="middle"
                fontSize="14" fontFamily="Cinzel, serif" fill="#3D2210" fontWeight="500">
                72 Melakarthas
              </text>
              <text x={centerX} y={centerY} textAnchor="middle"
                fontSize="11" fill="#A08060">
                Katapayadi System
              </text>
              <text x={centerX} y={centerY + 18} textAnchor="middle"
                fontSize="10" fill="#C8A96E">
                Select a Chakra
              </text>
            </>
          )}

          {activeChakra && (
            <>
              <text x={centerX} y={centerY - 30} textAnchor="middle"
                fontSize="14" fontFamily="Cinzel, serif" fill="#3D2210" fontWeight="500">
                {activeChakra.name} Chakra
              </text>
              <text x={centerX} y={centerY - 12} textAnchor="middle"
                fontSize="10" fill="#A08060">
                {activeChakra.meaning}
              </text>
              <text x={centerX} y={centerY + 6} textAnchor="middle"
                fontSize="9" fill="#C8A96E">
                Ragas {(activeChakra.number - 1) * 6 + 1}–{activeChakra.number * 6}
              </text>
              <text x={centerX} y={centerY + 22} textAnchor="middle"
                fontSize="9" fill="#A08060">
                {activeChakra.number <= 6 ? "Shuddha Madhyama" : "Prati Madhyama"}
              </text>
              <text x={centerX} y={centerY + 38} textAnchor="middle"
                fontSize="9" fill="#C8A96E" style={{ cursor:"pointer" }}
                onClick={() => setActiveChakra(null)}>
                ✕ Close
              </text>
            </>
          )}
        </svg>
      </div>

      {/* Raga list panel */}
      <div style={{ flex:1, minWidth:"240px" }}>
        {!activeChakra ? (
          <div style={{
            background:"#FBF7F0", border:"1px solid #D4B896", borderRadius:"12px",
            padding:"24px", textAlign:"center"
          }}>
            <div style={{ fontFamily:"Cinzel,serif", fontSize:"16px", color:"#3D2210", marginBottom:"8px" }}>
              Katapayadi Chakra
            </div>
            <div style={{ fontSize:"12px", color:"#A08060", lineHeight:"1.8" }}>
              Click any Chakra segment to see its 6 ragas.<br/>
              Each Chakra encodes the Ri-Ga combination.<br/>
              Position within Chakra encodes Dha-Ni.
            </div>
            {selectedMelakarta && (
              <div style={{
                marginTop:"16px", padding:"12px", background:"#F5EFE4",
                borderRadius:"8px", border:"1px solid #C8A96E"
              }}>
                <div style={{ fontSize:"10px", letterSpacing:"2px", color:"#A08060", marginBottom:"4px" }}>SELECTED</div>
                <div style={{ fontFamily:"Cinzel,serif", fontSize:"14px", color:"#C8A96E" }}>
                  {selectedMelakarta.number}. {selectedMelakarta.name}
                </div>
                <div style={{ fontSize:"11px", color:"#A08060", marginTop:"4px" }}>
                  {selectedMelakarta.chakra} Chakra
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{
            background:"#FBF7F0", border:"1px solid #D4B896", borderRadius:"12px",
            overflow:"hidden"
          }}>
            <div style={{
              background:"#3D2210", padding:"14px 20px",
              fontFamily:"Cinzel,serif", fontSize:"14px", color:"#C8A96E"
            }}>
              {activeChakra.name} Chakra — {activeChakra.meaning}
            </div>
            {chakraRagas.map(raga => {
              const scale = getMelakarthaScale(raga.number);
              const isSelected = selectedMelakarta?.number === raga.number;
              return (
                <div key={raga.number}
                  onClick={() => onSelect(raga)}
                  style={{
                    padding:"14px 20px",
                    borderBottom:"1px solid #EDE5D8",
                    cursor:"pointer",
                    background: isSelected ? "#F0E8D8" : "transparent",
                    transition:"background 0.15s"
                  }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div>
                      <span style={{
                        fontSize:"11px", color:"#C8A96E", marginRight:"8px", fontWeight:500
                      }}>{raga.number}.</span>
                      <span style={{
                        fontFamily:"Cinzel,serif", fontSize:"13px",
                        color: isSelected ? "#3D2210" : "#3D2210", fontWeight: isSelected ? 500 : 400
                      }}>{raga.name}</span>
                    </div>
                    {isSelected && <span style={{ color:"#C8A96E", fontSize:"12px" }}>✓</span>}
                  </div>
                  <div style={{ fontSize:"10px", color:"#A08060", marginTop:"4px", letterSpacing:"1px" }}>
                    {scale.arohana.join(" · ")}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default KatapayadiCircle;
