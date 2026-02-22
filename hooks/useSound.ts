import { useCallback, useState } from 'react';

const audioCtxRef = { current: null as AudioContext | null };
let globalMuted = false;

const getAudioCtx = (): AudioContext => {
  if (!audioCtxRef.current) {
    audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtxRef.current;
};

const playTone = (frequency: number, duration: number, volume: number = 0.15, type: OscillatorType = 'sine') => {
  if (globalMuted) return;
  try {
    const ctx = getAudioCtx();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch {
    // Silently fail if audio isn't available
  }
};

export const useSound = () => {
  const [muted, setMuted] = useState(globalMuted);

  const playCorrectKey = useCallback(() => {
    playTone(880, 0.08, 0.08, 'sine');
  }, []);

  const playError = useCallback(() => {
    playTone(200, 0.15, 0.12, 'square');
  }, []);

  const playWordComplete = useCallback(() => {
    playTone(523, 0.1, 0.1, 'sine');
    setTimeout(() => playTone(659, 0.1, 0.1, 'sine'), 80);
    setTimeout(() => playTone(784, 0.15, 0.1, 'sine'), 160);
  }, []);

  const playComboMilestone = useCallback(() => {
    playTone(523, 0.1, 0.12, 'sine');
    setTimeout(() => playTone(659, 0.1, 0.12, 'sine'), 100);
    setTimeout(() => playTone(784, 0.1, 0.12, 'sine'), 200);
    setTimeout(() => playTone(1047, 0.2, 0.15, 'sine'), 300);
  }, []);

  const playLevelComplete = useCallback(() => {
    const notes = [523, 587, 659, 784, 880, 1047];
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.2, 0.12, 'sine'), i * 100);
    });
  }, []);

  const playTick = useCallback(() => {
    playTone(600, 0.05, 0.06, 'sine');
  }, []);

  const toggleMute = useCallback(() => {
    globalMuted = !globalMuted;
    setMuted(globalMuted);
  }, []);

  return {
    muted,
    toggleMute,
    playCorrectKey,
    playError,
    playWordComplete,
    playComboMilestone,
    playLevelComplete,
    playTick,
  };
};
