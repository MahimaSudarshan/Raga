import { useRef } from "react";

const getSupportedMimeType = () => {
  const candidates = ["audio/webm", "audio/mp4", "audio/ogg"];
  for (const type of candidates) {
    if (window.MediaRecorder && MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  return "";
};

const useAudioRecorder = () => {
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const mimeTypeRef = useRef("audio/webm");

  const ensureRecording = async () => {
    if (mediaRecorderRef.current) {
      if (mediaRecorderRef.current.state === "paused") {
        mediaRecorderRef.current.resume();
      }
      return;
    }
    if (!window.MediaRecorder) {
      console.warn("MediaRecorder not supported in this browser");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      const mimeType = getSupportedMimeType();
      mimeTypeRef.current = mimeType || "audio/webm";
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
    } catch (e) {
      console.error("Audio recording error:", e);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.pause();
    }
  };

  const finalizeRecording = () => {
    return new Promise((resolve) => {
      const recorder = mediaRecorderRef.current;
      const cleanupStream = () => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(t => t.stop());
          streamRef.current = null;
        }
      };

      if (!recorder) {
        cleanupStream();
        resolve(null);
        return;
      }

      recorder.onstop = () => {
        const blob = chunksRef.current.length
          ? new Blob(chunksRef.current, { type: mimeTypeRef.current })
          : null;
        cleanupStream();
        mediaRecorderRef.current = null;
        chunksRef.current = [];
        resolve(blob);
      };

      if (recorder.state === "inactive") {
        recorder.onstop();
      } else {
        recorder.stop();
      }
    });
  };

  return { ensureRecording, pauseRecording, finalizeRecording, mimeTypeRef };
};

export default useAudioRecorder;