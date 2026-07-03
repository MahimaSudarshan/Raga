import React from "react";

const MOCK_HISTORY = [
  { date: "2 Jul 2026", duration: "48:32", shruti: "F#", taal: "Teentaal", laya: "Madhya", tradition: "Hindustani" },
  { date: "1 Jul 2026", duration: "32:18", shruti: "G", taal: "Ektaal", laya: "Vilambit", tradition: "Hindustani" },
  { date: "30 Jun 2026", duration: "55:04", shruti: "C", taal: "Adi Tala", laya: "Madhya", tradition: "Carnatic" },
  { date: "28 Jun 2026", duration: "28:45", shruti: "F", taal: "Rupak", laya: "Drut", tradition: "Hindustani" },
  { date: "27 Jun 2026", duration: "40:12", shruti: "D", taal: "Jhaptaal", laya: "Madhya", tradition: "Hindustani" },
];

const HistoryScreen = () => (
  <div style={{ padding:"40px", background:"#F5EFE4", minHeight:"calc(100vh - 132px)" }}>
    <h2 style={{ fontFamily:"Cinzel,serif", fontSize:"28px", color:"#3D2210", marginBottom:"6px" }}>Practice History</h2>
    <p style={{ color:"#A08060", fontSize:"13px", marginBottom:"16px" }}>Your past riyaz sessions</p>

    <div style={{
      background:"#FFF8EE", border:"1px solid #C8A96E", borderRadius:"8px",
      padding:"10px 16px", marginBottom:"24px", fontSize:"12px", color:"#A08060"
    }}>
      ⚠ Sample data shown for demonstration. Real sessions will appear here after login is connected.
    </div>

    <div style={{ background:"#FBF7F0", border:"1px solid #D4B896", borderRadius:"12px", overflow:"hidden" }}>
      <table style={{ width:"100%", borderCollapse:"collapse" }}>
        <thead>
          <tr style={{ background:"#F0E8D8", borderBottom:"1px solid #D4B896" }}>
            {["DATE","DURATION","SHRUTI","TAAL","LAYA","TRADITION"].map(h => (
              <th key={h} style={{ padding:"14px 20px", fontSize:"10px", letterSpacing:"2px", color:"#A08060", textAlign:"left", fontWeight:500 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {MOCK_HISTORY.map((row, i) => (
            <tr key={i} style={{ borderBottom:"1px solid #EDE5D8" }}>
              <td style={{ padding:"16px 20px", fontSize:"13px", color:"#3D2210" }}>{row.date}</td>
              <td style={{ padding:"16px 20px", fontSize:"13px", color:"#3D2210" }}>{row.duration}</td>
              <td style={{ padding:"16px 20px", fontSize:"13px", color:"#C8A96E", fontWeight:500 }}>SA · {row.shruti}</td>
              <td style={{ padding:"16px 20px", fontSize:"13px", color:"#3D2210" }}>{row.taal}</td>
              <td style={{ padding:"16px 20px", fontSize:"13px", color:"#3D2210" }}>{row.laya}</td>
              <td style={{ padding:"16px 20px", fontSize:"13px", color:"#3D2210" }}>{row.tradition}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default HistoryScreen;
