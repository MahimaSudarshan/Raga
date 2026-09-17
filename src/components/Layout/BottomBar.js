import React, { useEffect, useRef } from "react";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import useAudioRecorder from "../../hooks/useAudioRecorder";

const BottomBar = () => {
  const {
    shruti, taal, laya, tradition, isPlaying, setIsPlaying,
    sessionTime, setSessionTime, outOfTuneCount, setOutOfTuneCount
  } = useApp();
  const { user } = useAuth();
  const timerRef = useRef(null);
  const { ensureRecording, pauseRecording, finalizeRecording, mimeTypeRef } = useAudioRecorder();

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => setSessionTime(t => t + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      ensureRecording();
    } else {
      pauseRecording();
    }
  }, [isPlaying]);

  const fmt = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  const downloadRecording = (blob) => {
    const ext = mimeTypeRef.current.includes("mp4") ? "mp4"
      : mimeTypeRef.current.includes("ogg") ? "ogg" : "webm";
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `raga-practice-${timestamp}.${ext}`;

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return filename;
  };

  const saveSession = async (hasRecording, recordingFilename) => {
    if (!user || sessionTime < 10) return;
    try {
      await addDoc(collection(db, "Sessions"), {
        userId: user.uid,
        shruti,
        taal,
        laya,
        tradition,
        duration: sessionTime,
        outOfTuneCount,
        hasRecording: !!hasRecording,
        recordingFilename: recordingFilename || null,
        date: serverTimestamp(),
      });
    } catch (e) {
      console.error("Error saving session:", e);
    }
  };

  const handleStop = async () => {
    const blob = await finalizeRecording();

    let filename = null;
    if (blob && sessionTime >= 10) {
      try {
        filename = downloadRecording(blob);
      } catch (e) {
        console.error("Error downloading recording:", e);
      }
    }

    await saveSession(!!filename, filename);

    setIsPlaying(false);
    setSessionTime(0);
    setOutOfTuneCount(0);
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