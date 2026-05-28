import React, { useState, useRef } from "react";
import * as Tone from "tone";

const SHRUTIS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const OCTAVES = [2, 3, 4, 5];

// Get the Pancham (5th note) of a given shruti
const getPancham = (shruti, octave) => {
  const index = SHRUTIS.indexOf(shruti);
  const panchamIndex = (index + 7) % 12;
  const panchamOctave = index + 7 >= 12 ? parseInt(octave) : parseInt(octave) - 1;
  return `${SHRUTIS[panchamIndex]}${panchamOctave}`;
};

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [shruti, setShruti] = useState("C");
  const [octave, setOctave] = useState(3);
  const synthsRef = useRef([]);
  const loopRef = useRef(null);

  const startDrone = async () => {
    await Tone.start();

    // 4 tanpura strings: Pa, Sa(high), Sa(high), Sa(low)
    const strings = [
      getPancham(shruti, octave),           // String 1 - Pancham
      `${shruti}${parseInt(octave) + 1}`,   // String 2 - High Sa
      `${shruti}${parseInt(octave) + 1}`,   // String 3 - High Sa
      `${shruti}${octave}`,                 // String 4 - Low Sa
    ];

    const synths = strings.map(() =>
      new Tone.Synth({
        oscillator: { type: "sine" },
        envelope: { attack: 0.8, decay: 0.5, sustain: 0.6, release: 2 },
      }).toDestination()
    );

    synthsRef.current = synths;

    // Pluck each string one by one in a cycle
    let currentString = 0;
    const loop = new Tone.Loop((time) => {
      synths[currentString].triggerAttackRelease(strings[currentString], "2n", time);
      currentString = (currentString + 1) % 4;
    }, "2n");

    loop.start(0);
    Tone.Transport.start();
    loopRef.current = loop;
    setIsPlaying(true);
  };

  const stopDrone = () => {
    if (loopRef.current) {
      loopRef.current.stop();
      loopRef.current.dispose();
      loopRef.current = null;
    }
    synthsRef.current.forEach((s) => s.dispose());
    synthsRef.current = [];
    Tone.Transport.stop();
    setIsPlaying(false);
  };

  return (
    <div>
      <h1>Raga</h1>

      <div>
        <label>Shruti (Sa): </label>
        <select
          value={shruti}
          onChange={(e) => setShruti(e.target.value)}
          disabled={isPlaying}
        >
          {SHRUTIS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <br />

      <div>
        <label>Octave: </label>
        <select
          value={octave}
          onChange={(e) => setOctave(e.target.value)}
          disabled={isPlaying}
        >
          {OCTAVES.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </div>

      <br />
      <button onClick={startDrone} disabled={isPlaying}>Play</button>
      <button onClick={stopDrone} disabled={!isPlaying}>Stop</button>
      <p>{isPlaying ? `Tanpura playing: ${shruti}${octave}` : "Stopped"}</p>
    </div>
  );
}

export default App;