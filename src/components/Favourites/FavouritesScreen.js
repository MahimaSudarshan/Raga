import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc, deleteDoc, doc, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";

const FavouritesScreen = () => {
  const { user } = useAuth();
  const { shruti, taal, laya, tradition, setShruti, setTaal, setLaya, setTradition } = useApp();
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchFavourites = async () => {
    try {
      const q = query(collection(db, "Favourites"), where("userId", "==", user.uid));
      const snap = await getDocs(q);
      setFavourites(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error("Error fetching favourites:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFavourites(); }, [user]);

  const saveFavourite = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await addDoc(collection(db, "Favourites"), {
        userId: user.uid,
        name: name.trim(),
        shruti, taal, laya, tradition,
      });
      setName("");
      await fetchFavourites();
    } catch (e) {
      console.error("Error saving favourite:", e);
    } finally {
      setSaving(false);
    }
  };

  const deleteFavourite = async (id) => {
    await deleteDoc(doc(db, "Favourites", id));
    setFavourites(f => f.filter(x => x.id !== id));
  };

  const loadPractice = (fav) => {
    setShruti(fav.shruti);
    setTaal(fav.taal);
    setLaya(fav.laya);
    setTradition(fav.tradition);
    window.location.href = "/";
  };

  return (
    <div style={{ padding:"40px", background:"#F5EFE4", minHeight:"calc(100vh - 132px)" }}>
      <h2 style={{ fontFamily:"Cinzel,serif", fontSize:"28px", color:"#3D2210", marginBottom:"6px" }}>Favourites</h2>
      <p style={{ color:"#A08060", fontSize:"13px", marginBottom:"28px" }}>Saved shruti and taal combinations</p>

      {/* Save current as favourite */}
      <div style={{
        background:"#FBF7F0", border:"1px solid #D4B896", borderRadius:"12px",
        padding:"20px 24px", marginBottom:"28px",
        display:"flex", gap:"12px", alignItems:"center"
      }}>
        <div style={{ fontSize:"12px", color:"#A08060", flex:1 }}>
          Current: <span style={{ color:"#C8A96E" }}>Sa · {shruti}</span> · {taal} · {laya}
        </div>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Name this combination..."
          style={{
            flex:2, padding:"8px 12px", fontSize:"13px",
            border:"1px solid #D4B896", borderRadius:"6px",
            background:"#FBF7F0", color:"#3D2210"
          }}
        />
        <button onClick={saveFavourite} disabled={saving || !name.trim()} style={{
          padding:"8px 20px", fontSize:"12px", letterSpacing:"1px",
          background:"#C8A96E", border:"none", borderRadius:"6px",
          color:"#1C1408", cursor:"pointer", fontWeight:500,
          opacity: saving || !name.trim() ? 0.5 : 1
        }}>
          {saving ? "Saving..." : "♥ Save"}
        </button>
      </div>

      {loading ? (
        <div style={{ color:"#A08060", fontSize:"13px" }}>Loading favourites...</div>
      ) : favourites.length === 0 ? (
        <div style={{
          background:"#FBF7F0", border:"1px solid #D4B896", borderRadius:"12px",
          padding:"48px", textAlign:"center", color:"#A08060", fontSize:"13px"
        }}>
          No favourites yet. Save your current practice combination above.
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"20px" }}>
          {favourites.map((fav) => (
            <div key={fav.id} style={{
              background:"#FBF7F0", border:"1px solid #D4B896",
              borderRadius:"12px", padding:"24px", position:"relative"
            }}>
              <button onClick={() => deleteFavourite(fav.id)} style={{
                position:"absolute", top:"12px", right:"12px",
                background:"transparent", border:"none",
                color:"#C8A96E", fontSize:"16px", cursor:"pointer"
              }}>♥</button>
              <h3 style={{ fontFamily:"Cinzel,serif", fontSize:"16px", color:"#3D2210", marginBottom:"16px" }}>{fav.name}</h3>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px", marginBottom:"16px" }}>
                {[["SHRUTI", `SA · ${fav.shruti}`], ["TAAL", fav.taal], ["LAYA", fav.laya], ["SYSTEM", fav.tradition]].map(([label, value]) => (
                  <div key={label}>
                    <div style={{ fontSize:"9px", letterSpacing:"2px", color:"#A08060", marginBottom:"2px" }}>{label}</div>
                    <div style={{ fontSize:"12px", color: label==="SHRUTI" ? "#C8A96E" : "#3D2210", textTransform:"capitalize" }}>{value}</div>
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
      )}
    </div>
  );
};

export default FavouritesScreen;
