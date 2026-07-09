import React from "react";
import { useAuth } from "../../context/AuthContext";

const LoginScreen = () => {
  const { signInWithGoogle } = useAuth();

  return (
    <div style={{
      minHeight:"100vh", background:"#1C1408",
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center"
    }}>
      <div style={{ textAlign:"center", marginBottom:"48px" }}>
        <div style={{
          fontFamily:"Cinzel,serif", fontSize:"52px",
          color:"#C8A96E", letterSpacing:"16px", marginBottom:"8px"
        }}>RAGA</div>
        <div style={{ fontSize:"16px", color:"#7A5830", letterSpacing:"4px" }}>रा ग</div>
        <div style={{ fontSize:"12px", color:"#5A4020", letterSpacing:"3px", marginTop:"8px" }}>
          AI-POWERED · CLASSICAL MUSIC PRACTICE COMPANION
        </div>
      </div>

      <div style={{
        background:"#FBF7F0", borderRadius:"16px",
        padding:"40px 48px", textAlign:"center",
        maxWidth:"400px", width:"90%"
      }}>
        <div style={{ fontFamily:"Cinzel,serif", fontSize:"22px", color:"#3D2210", marginBottom:"8px" }}>
          Welcome
        </div>
        <div style={{ fontSize:"13px", color:"#A08060", marginBottom:"32px", lineHeight:"1.6" }}>
          Sign in to track your practice sessions, save favourites, and continue your riyaz.
        </div>

        <button onClick={signInWithGoogle} style={{
          width:"100%", padding:"14px 24px",
          display:"flex", alignItems:"center", justifyContent:"center", gap:"12px",
          background:"#fff", border:"1px solid #D4B896", borderRadius:"8px",
          cursor:"pointer", fontSize:"14px", color:"#3D2210", fontWeight:500,
          boxShadow:"0 2px 8px rgba(0,0,0,0.08)"
        }}>
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
            <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
            <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18z"/>
            <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
          </svg>
          Continue with Google
        </button>

        <div style={{ marginTop:"24px", fontSize:"11px", color:"#C8A96E", letterSpacing:"2px" }}>
          · · ✦ · ·
        </div>
        <div style={{ marginTop:"12px", fontSize:"11px", color:"#A08060", lineHeight:"1.6" }}>
          Your practice data is private and secure.<br/>
          No spam, no ads, no sharing.
        </div>
      </div>

      <div style={{ marginTop:"32px", fontSize:"11px", color:"#3D2210", letterSpacing:"2px" }}>
        ॐ
      </div>
    </div>
  );
};

export default LoginScreen;
