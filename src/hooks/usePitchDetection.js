import { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";

const NOTE_STRINGS = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];

const freqToNote = (freq) => {
  if (!freq || freq < 60) return null;
  const noteNum = 12 * (Math.log2(freq / 440)) + 69;
  const rounded = Math.round(noteNum);
  const noteName = NOTE_STRINGS[rounded % 12];
  const octave = Math.floor(rounded / 12) - 1;
  const cents = Math.round((noteNum - rounded) * 100);
  return { noteName, octave, cents, noteNum: rounded };
};

const usePitchDetection = (isPlaying, shruti, enabled) => {
  const [pitchInfo, setPitchInfo] = useState(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const modelRef = useRef(null);
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.ready();
        // Use a simple autocorrelation approach since CREPE model loading
        // requires specific model files - we implement YIN algorithm instead
        setModelLoaded(true);
      } catch (e) {
        console.error("TF load error:", e);
      }
    };
    loadModel();
  }, []);

  useEffect(() => {
    if (!isPlaying || !enabled || !modelLoaded) {
      cleanup();
      setPitchInfo(null);
      return;
    }
    startDetection();
    return () => cleanup();
  }, [isPlaying, enabled, modelLoaded]);

  const cleanup = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (audioContextRef.current) audioContextRef.current.close();
    audioContextRef.current = null;
    streamRef.current = null;
  };

  // YIN pitch detection algorithm
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

        // Check if there's enough signal
        const rms = Math.sqrt(buffer.reduce((s, v) => s + v * v, 0) / buffer.length);
        if (rms < 0.01) {
          setPitchInfo(null);
          return;
        }

        const freq = yin(buffer, sampleRate);
        if (freq > 0) {
          const note = freqToNote(freq);
          if (note) {
            const shrutiIndex = NOTE_STRINGS.indexOf(shruti);
            const sungIndex = NOTE_STRINGS.indexOf(note.noteName);
            const diff = ((sungIndex - shrutiIndex) + 12) % 12;

            // Map to swaras
            const SWARA_NAMES = ["Sa","Komal Re","Shuddha Re","Komal Ga","Shuddha Ga","Shuddha Ma","Teevra Ma","Pa","Komal Dha","Shuddha Dha","Komal Ni","Shuddha Ni"];
            const swara = SWARA_NAMES[diff];

            setPitchInfo({
              freq: Math.round(freq),
              noteName: note.noteName,
              octave: note.octave,
              cents: note.cents,
              swara,
            });
          }
        }
      }, 100);

    } catch (e) {
      console.error("Pitch detection error:", e);
    }
  };

  return { pitchInfo, modelLoaded };
};

export default usePitchDetection;
