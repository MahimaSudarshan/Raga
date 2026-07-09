import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";

const fmt = (s) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
};

const formatDate = (ts) => {
  if (!ts) return "—";
  const d = ts.toDate();
  return d.toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" });
};

const HistoryScreen = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const q = query(
          collection(db, "Sessions"),
          where("userId", "==", user.uid),
          orderBy("date", "desc")
        );
        const snap = await getDocs(q);
        setSessions(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (e) {
        console.error("Error fetching sessions:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, [user]);

  return (
    <div style={{ padding:"40px", background:"#F5EFE4", minHeight:"calc(100vh - 132px)" }}>
      <h2 style={{ fontFamily:"Cinzel,serif", fontSize:"28px", color:"#3D2210", marginBottom:"6px" }}>Practice History</h2>
      <p style={{ color:"#A08060", fontSize:"13px", marginBottom:"28px" }}>Your past riyaz sessions</p>

      {loading ? (
        <div style={{ color:"#A08060", fontSize:"13px" }}>Loading sessions...</div>
      ) : sessions.length === 0 ? (
        <div style={{
          background:"#FBF7F0", border:"1px solid #D4B896", borderRadius:"12px",
          padding:"48px", textAlign:"center", color:"#A08060", fontSize:"13px"
        }}>
          No sessions yet. Start practicing and your history will appear here.
        </div>
      ) : (
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
              {sessions.map((row) => (
                <tr key={row.id} style={{ borderBottom:"1px solid #EDE5D8" }}>
                  <td style={{ padding:"16px 20px", fontSize:"13px", color:"#3D2210" }}>{formatDate(row.date)}</td>
                  <td style={{ padding:"16px 20px", fontSize:"13px", color:"#3D2210" }}>{fmt(row.duration)}</td>
                  <td style={{ padding:"16px 20px", fontSize:"13px", color:"#C8A96E", fontWeight:500 }}>SA · {row.shruti}</td>
                  <td style={{ padding:"16px 20px", fontSize:"13px", color:"#3D2210" }}>{row.taal}</td>
                  <td style={{ padding:"16px 20px", fontSize:"13px", color:"#3D2210" }}>{row.laya}</td>
                  <td style={{ padding:"16px 20px", fontSize:"13px", color:"#3D2210", textTransform:"capitalize" }}>{row.tradition}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HistoryScreen;
