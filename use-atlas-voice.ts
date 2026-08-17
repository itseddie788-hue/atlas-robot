import { useCallback, useEffect, useRef, useState } from "react";

const MALE_HINTS = [
  "google uk english male",
  "google us english male",
  "daniel",
  "alex",
  "fred",
  "microsoft david",
  "microsoft guy",
  "microsoft mark",
  "male",
];

function pickMaleVoice(voices: SpeechSynthesisVoice[]) {
  const english = voices.filter((v) => v.lang.toLowerCase().startsWith("en"));
  const pool = english.length ? english : voices;
  for (const hint of MALE_HINTS) {
    const match = pool.find((v) => v.name.toLowerCase().includes(hint));
    if (match) return match;
  }
  return pool[0] ?? null;
}

/**
 * Prototype voice output for Atlas (browser speech synthesis).
 * Swap this hook's internals for real robot audio later.
 */
export function useAtlasVoice({ volume = 0.8, pitch = 0.8 }: { volume?: number; pitch?: number }) {
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    setSupported(true);
    const load = () => {
      voiceRef.current = pickMaleVoice(window.speechSynthesis.getVoices());
    };
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", load);
      window.speechSynthesis.cancel();
    };
  }, []);

  const stop = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (voiceRef.current) utterance.voice = voiceRef.current;
      utterance.pitch = pitch;
      utterance.rate = 0.95;
      utterance.volume = volume;
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
      return true;
    },
    [pitch, volume],
  );

  return { supported, speaking, speak, stop };
}
