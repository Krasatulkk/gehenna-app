import React, { createContext, useContext, useRef, useEffect, useState } from 'react';

type SoundContextType = {
  playSend: () => void;
  playReceive: () => void;
  isMuted: boolean;
  toggleMute: () => void;
};

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) throw new Error('useSound must be used within SoundProvider');
  return context;
};

export const SoundProvider: React.FC<{ children: React.ReactNode; dndMode: boolean }> = ({ children, dndMode }) => {
  const [isMuted, setIsMuted] = useState(false);

  // Создаём аудио-контекст (без файлов, используем генерацию звуков через Web Audio API)
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playBeep = (frequency: number, duration: number, type: OscillatorType = 'sine') => {
    if (dndMode || isMuted) return;
    try {
      const ctx = audioCtxRef.current || new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = type;
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch {}
  };

  const playSend = () => playBeep(800, 0.08);
  const playReceive = () => playBeep(600, 0.15, 'sine');

  const toggleMute = () => setIsMuted((prev) => !prev);

  return (
    <SoundContext.Provider value={{ playSend, playReceive, isMuted, toggleMute }}>
      {children}
    </SoundContext.Provider>
  );
};