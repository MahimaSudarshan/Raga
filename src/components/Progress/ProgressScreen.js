import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { BADGES, computeStats } from "../../data/badges";

const fmt = (s) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
};

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const ProgressScreen = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const q = query(
          collection(db, "Sessions"),
          where("userId", "==", user.uid),
          orderBy("date", "desc")
        );
        const snap = await getDocs(q);
        setSessions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error("Error fetching sessions:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, [user]);

  const stats = computeStats(sessions);

  // Get practiced days for current month view
  const practicedDays = new Set(
    sessions
      .filter(s => {
        if (!s.date) return false;
        const d = s.date.toDate ? s.date.toDate() : new Date(s.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .map(s => {
        const d = s.date.toDate ? s.date.toDate() : new Date(s.date);
        return d.getDate();
      })
  );

  // Calendar grid
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const today = new Date();

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  const earnedBadges = BADGES.filter(b => b.check(stats));
  const lockedBadges = BADGES.filter(b => !b.check(stats));

  const ornament = (
    <div style={{ display:"flex", alignItems:"center", margin:"20px 0" }}>
      <div style={{ flex:1, height:"1px", background:"#D4B896" }}/>
      <div style={{ width:"8px", height:"8px", background:"#C8A96E", transform:"rotate(45deg)", margin:"0 10px" }}/>
      <div style={{ flex:1, height:"1px", background:"#D4B896" }}/>
    </div>
  );

  if (loading) return (
    <div style={{ padding:"40px", background:"#F5EFE4", minHeight:"calc(100vh - 132px)" }}>
      <div style={{ color:"#A08060" }}>Loading your progress...</div>
    </div>
  );

  return (
    <div style={{ padding:"32px", background:"#F5EFE4", minHeight:"calc(100vh - 132px)" }}>

      <h2 style={{ fontFamily:"Cinzel,serif", fontSize:"28px", color:"#3D2210", marginBottom:"6px" }}>
        Progress
      </h2>
      <p style={{ color:"#A08060", fontSize:"13px", marginBottom:"28px" }}>
        Your riyaz journey — streaks, achievements, and practice calendar
      </p>

      {/* Stats row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"16px", marginBottom:"28px" }}>
        {[
          ["🔥", "Current Streak", `${stats.maxStreak} days`],
          ["🎵", "Total Sessions", stats.totalSessions],
          ["⏱", "Longest Session", fmt(stats.longestSession)],
          ["🎼", "Ragas Practiced", stats.uniqueRagas],
        ].map(([icon, label, value]) => (
          <div key={label} style={{
            background:"#FBF7F0", border:"1px solid #D4B896", borderRadius:"12px",
            padding:"20px", textAlign:"center"
          }}>
            <div style={{ fontSize:"24px", marginBottom:"8px" }}>{icon}</div>
            <div style={{ fontFamily:"Cinzel,serif", fontSize:"22px", color:"#C8A96E", fontWeight:500 }}>{value}</div>
            <div style={{ fontSize:"10px", letterSpacing:"2px", color:"#A08060", marginTop:"4px" }}>{label.toUpperCase()}</div>
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div style={{
        background:"#FBF7F0", border:"1px solid #D4B896", borderRadius:"12px",
        padding:"24px", marginBottom:"28px"
      }}>
        {/* Month navigation */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px" }}>
          <button onClick={prevMonth} style={{
            background:"transparent", border:"1px solid #D4B896", borderRadius:"6px",
            padding:"6px 14px", cursor:"pointer", color:"#A08060", fontSize:"16px"
          }}>‹</button>

          <div style={{ fontFamily:"Cinzel,serif", fontSize:"18px", color:"#3D2210" }}>
            {MONTHS[currentMonth]} {currentYear}
          </div>

          <button onClick={nextMonth} style={{
            background:"transparent", border:"1px solid #D4B896", borderRadius:"6px",
            padding:"6px 14px", cursor:"pointer", color:"#A08060", fontSize:"16px"
          }}>›</button>
        </div>

        {/* Day headers */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:"4px", marginBottom:"8px" }}>
          {DAYS.map(d => (
            <div key={d} style={{
              textAlign:"center", fontSize:"10px", letterSpacing:"1px",
              color:"#A08060", padding:"4px 0", fontWeight:500
            }}>{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:"4px" }}>
          {/* Empty cells for first week */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {/* Day cells */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const practiced = practicedDays.has(day);
            const isToday = today.getDate() === day &&
              today.getMonth() === currentMonth &&
              today.getFullYear() === currentYear;

            return (
              <div key={day} style={{
                aspectRatio: "1",
                borderRadius:"8px",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:"13px", fontWeight: practiced || isToday ? 500 : 400,
                background: practiced ? "#3D2210" : isToday ? "#F0E8D8" : "transparent",
                color: practiced ? "#C8A96E" : isToday ? "#3D2210" : "#A08060",
                border: isToday && !practiced ? "1px solid #C8A96E" : "none",
                cursor: "default"
              }}>
                {day}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display:"flex", gap:"20px", marginTop:"16px", justifyContent:"center" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"6px", fontSize:"11px", color:"#A08060" }}>
            <div style={{ width:"12px", height:"12px", borderRadius:"3px", background:"#3D2210" }}/>
            Practiced
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:"6px", fontSize:"11px", color:"#A08060" }}>
            <div style={{ width:"12px", height:"12px", borderRadius:"3px", border:"1px solid #C8A96E" }}/>
            Today
          </div>
        </div>
      </div>

      {ornament}

      {/* Earned badges */}
      <div style={{ marginBottom:"28px" }}>
        <div style={{ fontFamily:"Cinzel,serif", fontSize:"18px", color:"#3D2210", marginBottom:"16px" }}>
          Achievements Earned ({earnedBadges.length}/{BADGES.length})
        </div>

        {earnedBadges.length === 0 ? (
          <div style={{
            background:"#FBF7F0", border:"1px solid #D4B896", borderRadius:"12px",
            padding:"32px", textAlign:"center", color:"#A08060", fontSize:"13px"
          }}>
            Complete your first practice session to earn your first badge!
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"16px" }}>
            {earnedBadges.map(badge => (
              <div key={badge.id} style={{
                background:"#3D2210", border:"1px solid #C8A96E",
                borderRadius:"12px", padding:"20px", textAlign:"center"
              }}>
                <div style={{ fontSize:"32px", marginBottom:"8px" }}>{badge.icon}</div>
                <div style={{ fontFamily:"Cinzel,serif", fontSize:"13px", color:"#C8A96E", marginBottom:"6px" }}>
                  {badge.name}
                </div>
                <div style={{ fontSize:"11px", color:"#7A5830", lineHeight:"1.4" }}>
                  {badge.desc}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Locked badges */}
      {lockedBadges.length > 0 && (
        <div>
          <div style={{ fontFamily:"Cinzel,serif", fontSize:"18px", color:"#3D2210", marginBottom:"16px" }}>
            Locked ({lockedBadges.length})
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"16px" }}>
            {lockedBadges.map(badge => (
              <div key={badge.id} style={{
                background:"#FBF7F0", border:"1px solid #D4B896",
                borderRadius:"12px", padding:"20px", textAlign:"center",
                opacity: 0.5
              }}>
                <div style={{ fontSize:"32px", marginBottom:"8px", filter:"grayscale(1)" }}>{badge.icon}</div>
                <div style={{ fontFamily:"Cinzel,serif", fontSize:"13px", color:"#3D2210", marginBottom:"6px" }}>
                  {badge.name}
                </div>
                <div style={{ fontSize:"11px", color:"#A08060", lineHeight:"1.4" }}>
                  {badge.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressScreen;
