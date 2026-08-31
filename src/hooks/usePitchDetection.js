import { useEffect, useRef, useState } from "react";
import { getMelakarthaScale, getSwaraName, isValidSwara, SWARA_STHANAS } from "../data/melakarta";

const NOTE_STRINGS = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];

const freqToSemitone = (freq, saShruti) => {
  if (!freq || freq < 60) return null;
  // A4 = 440Hz as reference
  const A4 = 440;
  const A4_MIDI = 69;
  const midiNote = A4_MIDI + 12 * Math.log2(freq / A4);
  const roundedMidi = Math.round(midiNote);
  const noteIndex = ((roundedMidi % 12) + 12) % 12; // 0=C, 1=C#...
  const saIndex = NOTE_STRINGS.indexOf(saShruti);
  // semitone relative to Sa (0=Sa, 1=one above Sa, etc.)
  const relativeSemitone = ((noteIndex - saIndex) + 12) % 12;
  return relativeSemitone;
};

const usePitchDetection = (isPlaying, shruti, enabled, selectedMelakarta) => {
  const [pitchInfo, setPitchInfo] = useState(null);
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isPlaying || !enabled) {
      cleanup();
      setPitchInfo(null);
      return;
    }
    startDetection();
    return () => cleanup();
  }, [isPlaying, enabled]);

  const cleanup = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    streamRef.current = null;
  };

  const yin = (buffer, sampleRate) => {
    const threshold = 0.1;
    const halfBuffer = Math.floor(buffer.length / 2);
    const yinBuffer = new Float32Array(halfBuffer);
    yinBuffer[0] = 1;
    let runningSum = 0;

    for (let tau = 1; tau < halfBuffer; tau++) {
      let sum = 0;
      for (let i = 0; i < halfBuffer; i++) {
        const delta = buffer[i] - buffer[i + tau];
        sum += delta * delta;
      }
      yinBuffer[tau] = sum;
      runningSum += yinBuffer[tau];
      yinBuffer[tau] *= tau / runningSum;

      if (tau > 1 && yinBuffer[tau] < threshold) {
        let tauEstimate = tau;
        while (tauEstimate + 1 < halfBuffer && yinBuffer[tauEstimate + 1] < yinBuffer[tauEstimate]) {
          tauEstimate++;
        }
        return sampleRate / tauEstimate;
      }
    }
    return -1;
  };

  const startDetection = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      const sampleRate = audioContext.sampleRate;

      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);

      const buffer = new Float32Array(analyser.fftSize);

      intervalRef.current = setInterval(() => {
        analyser.getFloatTimeDomainData(buffer);

        const rms = Math.sqrt(buffer.reduce((s, v) => s + v * v, 0) / buffer.length);
        if (rms < 0.01) {
          setPitchInfo(null);
          return;
        }

        const freq = yin(buffer, sampleRate);
        if (freq > 0 && freq < 2000) {
          const semitone = freqToSemitone(freq, shruti);
          if (semitone !== null) {
            const scale = selectedMelakarta
              ? getMelakarthaScale(selectedMelakarta.number)
              : null;

            const swaraName = scale
              ? getSwaraName(semitone, scale)
              : ["Sa","Komal Ri","Chatushruti Ri","Shatshruti Ri / Komal Ga","Antara Ga","Shuddha Ma","Prati Ma","Pa","Shuddha Dha","Chatushruti Dha","Kaisika Ni","Kakali Ni"][semitone];

            const valid = scale ? isValidSwara(semitone, scale) : null;

            setPitchInfo({
              freq: Math.round(freq),
              semitone,
              swara: swaraName,
              valid,
              ragaSelected: !!selectedMelakarta,
            });
          }
        }
      }, 100);

    } catch (e) {
      console.error("Pitch detection error:", e);
    }
  };

  return { pitchInfo };
};

export default usePitchDetection;
