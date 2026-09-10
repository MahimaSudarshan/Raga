import React from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import PracticeScreen from "./components/Practice/PracticeScreen";
import HistoryScreen from "./components/History/HistoryScreen";
import FavouritesScreen from "./components/Favourites/FavouritesScreen";
import SettingsScreen from "./components/Settings/SettingsScreen";
import RagaScreen from "./components/Raga/RagaScreen";
import ProgressScreen from "./components/Progress/ProgressScreen";
import BottomBar from "./components/Layout/BottomBar";
import LoginScreen from "./components/Auth/LoginScreen";
import "./styles/global.css";

const Layout = () => {
  const { tradition, setTradition } = useApp();
  const { user, logout } = useAuth();

  if (!user) return <LoginScreen />;

  return (
    <div style={{ display:"flex", minHeight:"100vh" }}>

      {/* Sidebar */}
      <div style={{
        width:"60px", background:"#1C1408", display:"flex",
        flexDirection:"column", alignItems:"center", padding:"16px 0",
        position:"fixed", top:0, left:0, height:"100vh", zIndex:100,
        borderRight:"1px solid #3D2210"
      }}>
        <div style={{
          fontFamily:"Cinzel,serif", fontSize:"11px", color:"#C8A96E",
          fontWeight:500, letterSpacing:"1px", marginBottom:"32px"
        }}>RA</div>

        {[
          { to:"/", icon:"⌂", label:"Practice" },
          { to:"/history", icon:"◷", label:"History" },
          { to:"/favourites", icon:"☆", label:"Favourites" },
          { to:"/raga", icon:"◎", label:"Raga" },
          { to:"/progress", icon:"★", label:"Progress" },
          { to:"/settings", icon:"⚙", label:"Settings" },
        ].map(({ to, icon, label }) => (
          <NavLink key={to} to={to} end={to==="/"} style={({ isActive }) => ({
            display:"flex", flexDirection:"column", alignItems:"center",
            padding:"12px 0", width:"100%", textDecoration:"none",
            color: isActive ? "#C8A96E" : "#5A4020", fontSize:"20px",
            borderLeft: isActive ? "2px solid #C8A96E" : "2px solid transparent",
            marginBottom:"8px"
          })}>
            <span title={label}>{icon}</span>
          </NavLink>
        ))}
      </div>

      {/* Main content */}
      <div style={{ marginLeft:"60px", flex:1, paddingBottom:"64px" }}>

        {/* Top nav */}
        <div style={{
          background:"#1C1408", padding:"0 32px", height:"48px",
          display:"flex", alignItems:"center", justifyContent:"space-between",
          position:"sticky", top:0, zIndex:99,
          borderBottom:"1px solid #3D2210"
        }}>
          <span style={{ fontFamily:"Cinzel,serif", fontSize:"14px", color:"#C8A96E", letterSpacing:"4px" }}>RAGA</span>

          <div style={{ display:"flex", border:"1px solid #5A4020", borderRadius:"20px", overflow:"hidden" }}>
            {["hindustani","carnatic"].map(t => (
              <button key={t} onClick={() => setTradition(t)} style={{
                padding:"6px 20px", fontSize:"11px", letterSpacing:"1px",
                border:"none", cursor:"pointer", textTransform:"capitalize",
                background: tradition===t ? "#C8A96E" : "transparent",
                color: tradition===t ? "#1C1408" : "#7A5830",
                fontWeight: tradition===t ? 500 : 400
              }}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>
            ))}
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
            <img src={user.photoURL} alt={user.displayName}
              style={{ width:"28px", height:"28px", borderRadius:"50%", border:"1px solid #5A4020" }}
            />
            <button onClick={logout} style={{
              background:"transparent", border:"1px solid #5A4020",
              color:"#7A5830", fontSize:"11px", padding:"4px 10px",
              borderRadius:"4px", cursor:"pointer", letterSpacing:"1px"
            }}>SIGN OUT</button>
          </div>
        </div>

        {/* Triangle border */}
        <div style={{ height:"20px", background:"#1C1408", overflow:"hidden" }}>
          <svg width="100%" height="20" preserveAspectRatio="none">
            {Array.from({ length:80 }).map((_,i) => (
              <polygon key={i} points={`${i*18},0 ${i*18+9},18 ${i*18+18},0`} fill="#C8A96E" opacity="0.7"/>
            ))}
          </svg>
        </div>

        <Routes>
          <Route path="/" element={<PracticeScreen />} />
          <Route path="/history" element={<HistoryScreen />} />
          <Route path="/favourites" element={<FavouritesScreen />} />
          <Route path="/raga" element={<RagaScreen />} />
          <Route path="/progress" element={<ProgressScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
        </Routes>
      </div>

      <BottomBar />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <Layout />
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
