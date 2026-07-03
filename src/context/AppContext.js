import React, { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [tradition, setTradition] = useState("hindustani");
  const [shruti, setShruti] = useState("F#");
  const [taal, setTaal] = useState("Teentaal");
  const [laya, setLaya] = useState("Madhya");
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [volume, setVolume] = useState(75);

  return (
    <AppContext.Provider value={{
      tradition, setTradition,
      shruti, setShruti,
      taal, setTaal,
      laya, setLaya,
      bpm, setBpm,
      isPlaying, setIsPlaying,
      sessionTime, setSessionTime,
      volume, setVolume,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
