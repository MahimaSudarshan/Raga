import { useEffect, useRef, useState } from "react";

const useDriftDetection = (isPlaying, bpm, enabled) => {
  const [driftMessage, setDriftMessage] = useState(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);
  const onsetTimesRef = useRef([]);

  useEffect(() => {
    if (!isPlaying || !enabled) {
      cleanup();
      setDriftMessage(null);
      return;
    }
    startDetection();
    return () => cleanup();
  }, [isPlaying, enabled]);

  const cleanup = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (audioContextRef.current) audioContextRef.current.close();
    audioContextRef.current = null;
    analyserRef.current = null;
    streamRef.current = null;
    onsetTimesRef.current = [];
  };

  const startDetection = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      let lastOnsetTime = null;
      let lastEnergy = 0;

      intervalRef.current = setInterval(() => {
        analyser.getByteTimeDomainData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          const val = (dataArray[i] - 128) / 128;
          sum += val * val;
        }
        const rms = Math.sqrt(sum / bufferLength);

        const now = Date.now();
        if (rms > 0.05 && rms > lastEnergy * 1.5) {
          if (!lastOnsetTime || now - lastOnsetTime > 200) {
            onsetTimesRef.current.push(now);
            lastOnsetTime = now;

            if (onsetTimesRef.current.length > 8) {
              onsetTimesRef.current.shift();
            }

            if (onsetTimesRef.current.length >= 4) {
              const intervals = [];
              for (let i = 1; i < onsetTimesRef.current.length; i++) {
                intervals.push(onsetTimesRef.current[i] - onsetTimesRef.current[i - 1]);
              }
              const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
              const singerBpm = 60000 / avgInterval;
              const diff = singerBpm - bpm;

              if (Math.abs(diff) > 5) {
                if (diff > 0) {
                  setDriftMessage("You're singing faster than the taal — slow down slightly");
                } else {
                  setDriftMessage("You're singing slower than the taal — speed up slightly");
                }
              } else {
                setDriftMessage(null);
              }
            }
          }
        }
        lastEnergy = rms;
      }, 50);

    } catch (e) {
      console.error("Mic access error:", e);
      setDriftMessage("Microphone access denied — drift detection unavailable");
    }
  };

  return { driftMessage };
};

export default useDriftDetection;
