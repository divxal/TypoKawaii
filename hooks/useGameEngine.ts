import { useState, useCallback, useRef } from 'react';
import { GameMode, GameResult } from '../types';
import { COMMON_WORDS_ES } from '../constants/words';
import { STORY_LEVELS, XP_TABLE } from '../constants/levels';
import { removeAccents } from '../utils/text';

interface GameEngineState {
  // Infinite mode
  wordList: string[];
  currentWordIndex: number;
  typedWord: string;
  // Story/FreeWrite
  storyText: string;
  input: string;
  // Tracking
  correctChars: number;
  errorChars: number;
  punctuationErrors: number;
  totalAttempts: number;
  correctWords: number;
  totalCharsTyped: number;
  // Combo
  combo: number;
  maxCombo: number;
  // State
  isFinished: boolean;
  stats: GameResult | null;
}

const generateWords = (count: number): string[] => {
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    words.push(COMMON_WORDS_ES[Math.floor(Math.random() * COMMON_WORDS_ES.length)]);
  }
  return words;
};

export const useGameEngine = (gameMode: GameMode, storyLevel: number) => {
  const [state, setState] = useState<GameEngineState>({
    wordList: [],
    currentWordIndex: 0,
    typedWord: '',
    storyText: '',
    input: '',
    correctChars: 0,
    errorChars: 0,
    punctuationErrors: 0,
    totalAttempts: 0,
    correctWords: 0,
    totalCharsTyped: 0,
    combo: 0,
    maxCombo: 0,
    isFinished: false,
    stats: null,
  });

  const stateRef = useRef(state);
  stateRef.current = state;

  const initialize = useCallback(() => {
    const newState: GameEngineState = {
      wordList: [],
      currentWordIndex: 0,
      typedWord: '',
      storyText: '',
      input: '',
      correctChars: 0,
      errorChars: 0,
      punctuationErrors: 0,
      totalAttempts: 0,
      correctWords: 0,
      totalCharsTyped: 0,
      combo: 0,
      maxCombo: 0,
      isFinished: false,
      stats: null,
    };

    if (gameMode === GameMode.Infinite) {
      newState.wordList = generateWords(50);
    } else if (gameMode === GameMode.Story || gameMode === GameMode.DailyChallenge) {
      const level = STORY_LEVELS.find(l => l.id === storyLevel);
      newState.storyText = level ? level.text : "Fin.";
    }

    setState(newState);
  }, [gameMode, storyLevel]);

  const handleInfiniteInput = useCallback((value: string): { correct?: boolean; wordComplete?: boolean } => {
    let result: { correct?: boolean; wordComplete?: boolean } = {};

    if (value.endsWith(' ')) {
      const wordToMatch = stateRef.current.wordList[stateRef.current.currentWordIndex];
      const typedTrimmed = value.trim();

      setState(prev => {
        const newTotalAttempts = prev.totalAttempts + 1;
        const newTotalCharsTyped = prev.totalCharsTyped + typedTrimmed.length;

        if (typedTrimmed === wordToMatch) {
          const newCombo = prev.combo + 1;
          const newMaxCombo = Math.max(prev.maxCombo, newCombo);
          const newCorrectChars = prev.correctChars + wordToMatch.length;

          // Add more words if running low
          let newWordList = prev.wordList;
          if (prev.currentWordIndex + 10 > prev.wordList.length) {
            newWordList = [...prev.wordList, ...generateWords(10)];
          }

          result = { correct: true, wordComplete: true };
          return {
            ...prev,
            currentWordIndex: prev.currentWordIndex + 1,
            typedWord: '',
            totalAttempts: newTotalAttempts,
            correctWords: prev.correctWords + 1,
            totalCharsTyped: newTotalCharsTyped,
            correctChars: newCorrectChars,
            combo: newCombo,
            maxCombo: newMaxCombo,
            wordList: newWordList,
          };
        } else {
          result = { correct: false, wordComplete: false };
          return {
            ...prev,
            typedWord: '',
            totalAttempts: newTotalAttempts,
            totalCharsTyped: newTotalCharsTyped,
            errorChars: prev.errorChars + typedTrimmed.length,
            combo: 0,
          };
        }
      });
    } else {
      setState(prev => ({ ...prev, typedWord: value }));
    }

    return result;
  }, []);

  const handleStoryInput = useCallback((value: string): { charCorrect?: boolean; finished?: boolean } => {
    let result: { charCorrect?: boolean; finished?: boolean } = {};
    const st = stateRef.current;

    if (value.length > st.input.length && st.storyText.length > 0) {
      const newCharIndex = value.length - 1;
      const charTyped = value[newCharIndex];
      const charTarget = newCharIndex < st.storyText.length ? st.storyText[newCharIndex] : '';

      if (charTyped === charTarget) {
        result.charCorrect = true;
      } else {
        result.charCorrect = false;
      }
    }

    setState(prev => {
      const newInput = value;
      let newCorrectChars = 0;
      let newErrorChars = 0;
      let newPunctErrors = 0;
      let newCombo = 0;
      let newMaxCombo = prev.maxCombo;

      // Recalculate character-level stats for the full input
      for (let i = 0; i < newInput.length; i++) {
        if (i >= prev.storyText.length) break;
        const typed = newInput[i];
        const target = prev.storyText[i];
        if (typed === target) {
          newCorrectChars++;
          newCombo++;
          if (newCombo > newMaxCombo) newMaxCombo = newCombo;
        } else {
          if (removeAccents(typed) === removeAccents(target)) newPunctErrors++;
          else newErrorChars++;
          newCombo = 0;
        }
      }

      return {
        ...prev,
        input: newInput,
        correctChars: newCorrectChars,
        errorChars: newErrorChars,
        punctuationErrors: newPunctErrors,
        totalCharsTyped: newInput.length,
        combo: newCombo,
        maxCombo: newMaxCombo,
      };
    });

    if (value.length >= st.storyText.length && st.storyText.length > 0) {
      result.finished = true;
    }

    return result;
  }, []);

  const handleFreeWriteInput = useCallback((value: string) => {
    setState(prev => ({ ...prev, input: value, totalCharsTyped: value.length }));
  }, []);

  const finishGame = useCallback((timeElapsedMinutes: number): GameResult => {
    const s = stateRef.current;
    let correctChars = s.correctChars;
    let errorChars = s.errorChars;
    let punctErrors = s.punctuationErrors;
    let calculatedWpm = 0;
    let calculatedAcc = 0;
    let isWin = false;

    if (gameMode === GameMode.Infinite) {
      calculatedWpm = timeElapsedMinutes > 0
        ? Math.round((s.correctChars / 5) / timeElapsedMinutes)
        : 0;
      calculatedAcc = s.totalAttempts > 0
        ? Math.round((s.correctWords / s.totalAttempts) * 100)
        : 0;
    } else if (gameMode === GameMode.FreeWrite) {
      const inputWords = s.input.trim().split(/\s+/).filter(w => w.length > 0);
      let freeCorrect = 0;
      let freeError = 0;
      inputWords.forEach(word => {
        const cleanWord = removeAccents(word.toLowerCase()).replace(/[.,;!?]/g, '');
        if (COMMON_WORDS_ES.includes(cleanWord)) {
          freeCorrect += word.length + 1;
        } else {
          freeError += word.length;
        }
      });
      correctChars = freeCorrect;
      errorChars = freeError;
      const totalChars = s.input.length;
      calculatedWpm = timeElapsedMinutes > 0
        ? Math.round((correctChars / 5) / timeElapsedMinutes)
        : 0;
      calculatedAcc = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 0;
    } else {
      // Story / DailyChallenge
      const totalChars = s.input.length;
      calculatedWpm = timeElapsedMinutes > 0
        ? Math.round((correctChars / 5) / timeElapsedMinutes)
        : 0;
      calculatedAcc = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 0;
    }

    // Check win condition for Story
    if (gameMode === GameMode.Story || gameMode === GameMode.DailyChallenge) {
      const level = STORY_LEVELS.find(l => l.id === storyLevel);
      if (level && calculatedWpm >= level.minWpm && calculatedAcc >= level.minAccuracy && s.input.length >= s.storyText.length) {
        isWin = true;
      }
    }

    // Calculate XP with combo multiplier
    let comboMultiplier = 1;
    if (s.maxCombo >= 20) comboMultiplier = XP_TABLE.COMBO_MULTIPLIER_20;
    else if (s.maxCombo >= 10) comboMultiplier = XP_TABLE.COMBO_MULTIPLIER_10;
    else if (s.maxCombo >= 5) comboMultiplier = XP_TABLE.COMBO_MULTIPLIER_5;

    const baseXp = (correctChars * XP_TABLE.PER_CHAR)
      + (calculatedAcc > 95 ? XP_TABLE.BONUS_ACCURACY : 0)
      + (isWin ? XP_TABLE.BONUS_WIN : 0)
      + 20;

    const xp = Math.round(baseXp * comboMultiplier);

    const result: GameResult = {
      wpm: calculatedWpm,
      accuracy: calculatedAcc,
      correctChars,
      errorChars,
      punctuationErrors: punctErrors,
      timestamp: Date.now(),
      mode: gameMode,
      xpEarned: xp,
      levelId: storyLevel,
      isWin,
      maxCombo: s.maxCombo,
    };

    setState(prev => ({ ...prev, isFinished: true, stats: result }));
    return result;
  }, [gameMode, storyLevel]);

  const getRealTimeWpm = useCallback((timeElapsedMinutes: number): number => {
    const s = stateRef.current;
    if (timeElapsedMinutes <= 0) return 0;
    return Math.round((s.correctChars / 5) / timeElapsedMinutes);
  }, []);

  const getRealTimeAccuracy = useCallback((): number => {
    const s = stateRef.current;
    if (gameMode === GameMode.Infinite) {
      return s.totalAttempts > 0 ? Math.round((s.correctWords / s.totalAttempts) * 100) : 100;
    }
    return s.totalCharsTyped > 0 ? Math.round((s.correctChars / s.totalCharsTyped) * 100) : 100;
  }, [gameMode]);

  return {
    ...state,
    initialize,
    handleInfiniteInput,
    handleStoryInput,
    handleFreeWriteInput,
    finishGame,
    getRealTimeWpm,
    getRealTimeAccuracy,
  };
};
