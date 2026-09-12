import React, { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [tradition, setTradition] = useState("hindustani");
  const [shruti, setShruti] = useState("F#");
  const [taal, setTaal] = useState("Teentaal");
  const [laya, setLaya] = useState("Madhya");
  const [bpm, setBpm] = useState(120);
  const [tanpuraPlaying, setTanpuraPlaying] = useState(false);
  const [tablaPlaying, setTablaPlaying] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [volume, setVolume] = useState(75);
  const [selectedMelakarta, setSelectedMelakarta] = useState(null);

  const isPlaying = tanpuraPlaying || tablaPlaying;
  const setIsPlaying = (valueOrFn) => {
    const current = isPlaying;
    const next = typeof valueOrFn === "function" ? valueOrFn(current) : valueOrFn;
    setTanpuraPlaying(next);
    setTablaPlaying(next);
  };

  return (
    <AppContext.Provider value={{
      tradition, setTradition,
      shruti, setShruti,
      taal, setTaal,
      laya, setLaya,
      bpm, setBpm,
      tanpuraPlaying, setTanpuraPlaying,
      tablaPlaying, setTablaPlaying,
      isPlaying, setIsPlaying,
      sessionTime, setSessionTime,
      volume, setVolume,
      selectedMelakarta, setSelectedMelakarta,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);