import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const Toggle = ({ value, onChange }) => (
  <div onClick={() => onChange(!value)} style={{
    width:"44px", height:"24px", borderRadius:"12px", cursor:"pointer",
    background: value ? "#C8A96E" : "#D4B896", position:"relative", transition:"all 0.2s"
  }}>
    <div style={{
      width:"20px", height:"20px", borderRadius:"50%", background:"#1C1408",
      position:"absolute", top:"2px", transition:"all 0.2s",
      left: value ? "22px" : "2px"
    }}/>
  </div>
);

const SettingsScreen = () => {
  const { user, logout } = useAuth();
  const [metronome, setMetronome] = useState(true);
  const [drift, setDrift] = useState(true);
  const [hq, setHq] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const ref = doc(db, "Users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setMetronome(data.metronome ?? true);
          setDrift(data.drift ?? true);
          setHq(data.hq ?? false);
          setStreak(data.streak ?? 0);
        }
      } catch (e) {
        console.error("Error fetching settings:", e);
      }
    };
    fetchSettings();
  }, [user]);

  const saveSetting = async (key, value) => {
    try {
      await setDoc(doc(db, "Users", user.uid), { [key]: value }, { merge: true });
    } catch (e) {
      console.error("Error saving setting:", e);
    }
  };

  const handleToggle = (key, setter) => (val) => {
    setter(val);
    saveSetting(key, val);
  };

  const sectionStyle = {
    background:"#FBF7F0", border:"1px solid #D4B896", borderRadius:"12px",
    overflow:"hidden", marginBottom:"20px", maxWidth:"600px"
  };

  const headerStyle = {
    padding:"12px 20px", background:"#F0E8D8", borderBottom:"1px solid #D4B896",
    fontSize:"10px", letterSpacing:"3px", color:"#A08060", fontWeight:500
  };

  const rowStyle = {
    padding:"18px 20px", borderBottom:"1px solid #EDE5D8",
    display:"flex", justifyContent:"space-between", alignItems:"center"
  };

  return (
    <div style={{ padding:"40px", background:"#F5EFE4", minHeight:"calc(100vh - 132px)" }}>
      <h2 style={{ fontFamily:"Cinzel,serif", fontSize:"28px", color:"#3D2210", marginBottom:"6px" }}>Settings</h2>
      <p style={{ color:"#A08060", fontSize:"13px", marginBottom:"28px" }}>Practice preferences and account details</p>

      <div style={sectionStyle}>
        <div style={headerStyle}>PRACTICE AUDIO</div>
        {[
          { label:"Metronome Click", desc:"Audible click on each beat of the taal", value:metronome, key:"metronome", setter:setMetronome },
          { label:"Drift Detection", desc:"Pitch monitoring via microphone", value:drift, key:"drift", setter:setDrift },
          { label:"High Quality Audio", desc:"Higher CPU usage, studio-grade rendering", value:hq, key:"hq", setter:setHq },
        ].map(({ label, desc, value, key, setter }) => (
          <div key={label} style={rowStyle}>
            <div>
              <div style={{ fontSize:"14px", color:"#3D2210", marginBottom:"3px" }}>{label}</div>
              <div style={{ fontSize:"12px", color:"#A08060" }}>{desc}</div>
            </div>
            <Toggle value={value} onChange={handleToggle(key, setter)} />
          </div>
        ))}
      </div>

      <div style={sectionStyle}>
        <div style={headerStyle}>ACCOUNT</div>
        {[
          ["Name", user.displayName || "—"],
          ["Email", user.email || "—"],
          ["Practice Streak", `${streak} days`],
        ].map(([label, value]) => (
          <div key={label} style={{ ...rowStyle, borderBottom:"1px solid #EDE5D8" }}>
            <span style={{ fontSize:"14px", color:"#3D2210" }}>{label}</span>
            <span style={{ fontSize:"14px", color:"#A08060" }}>{value}</span>
          </div>
        ))}
        <div style={{ ...rowStyle, borderBottom:"none" }}>
          <span style={{ fontSize:"14px", color:"#3D2210" }}>Account</span>
          <button onClick={logout} style={{
            padding:"6px 16px", fontSize:"12px", letterSpacing:"1px",
            background:"transparent", border:"1px solid #D4B896",
            borderRadius:"6px", color:"#A08060", cursor:"pointer"
          }}>Sign Out</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
