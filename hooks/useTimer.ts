import { useState, useEffect, useRef, useCallback } from 'react';

interface UseTimerOptions {
  initialTime: number;
  onTimeUp?: () => void;
}

export const useTimer = ({ initialTime, onTimeUp }: UseTimerOptions) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef<number | null>(null);
  const onTimeUpRef = useRef(onTimeUp);
  onTimeUpRef.current = onTimeUp;

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = window.setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      onTimeUpRef.current?.();
    }
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const start = useCallback(() => setIsActive(true), []);
  const pause = useCallback(() => setIsActive(false), []);
  const reset = useCallback((newTime?: number) => {
    setIsActive(false);
    setTimeLeft(newTime ?? initialTime);
  }, [initialTime]);

  const timeElapsed = initialTime - timeLeft;
  const timeElapsedMinutes = timeElapsed / 60;
  const isUrgent = timeLeft <= 10 && timeLeft > 0;
  const isCritical = timeLeft <= 5 && timeLeft > 0;

  return {
    timeLeft,
    isActive,
    start,
    pause,
    reset,
    timeElapsed,
    timeElapsedMinutes,
    isUrgent,
    isCritical,
  };
};
