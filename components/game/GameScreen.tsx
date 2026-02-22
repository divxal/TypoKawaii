import React, { useEffect, useRef, useState } from 'react';
import { RefreshCcw } from 'lucide-react';
import { GameMode } from '../../types';
import { STORY_LEVELS } from '../../constants/levels';
import { TOPICS } from '../../constants/words';
import { removeAccents } from '../../utils/text';
import { useTheme } from '../../contexts/ThemeContext';
import { useUser } from '../../contexts/UserContext';
import { useGame } from '../../contexts/GameContext';
import { useGameEngine } from '../../hooks/useGameEngine';
import { useTimer } from '../../hooks/useTimer';
import { useSound } from '../../hooks/useSound';
import GameHUD from './GameHUD';
import GameResults from './GameResults';

const GameScreen = () => {
  const { themeConfig } = useTheme();
  const { user, updateStats, checkAchievements } = useUser();
  const { gameMode, storyLevel, setStoryLevel, freeWriteTopic, setFreeWriteTopic, setView } = useGame();
  const sound = useSound();

  const engine = useGameEngine(gameMode, storyLevel);
  const [newAchievements, setNewAchievements] = useState<string[]>([]);
  const [gameStarted, setGameStarted] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleFinish = () => {
    const result = engine.finishGame(timer.timeElapsedMinutes);
    const achievements = checkAchievements(result);
    setNewAchievements(achievements);
    updateStats(result);
    if (result.isWin) {
      sound.playLevelComplete();
    }
  };

  const timer = useTimer({
    initialTime: 60,
    onTimeUp: handleFinish,
  });

  // Play tick sound when urgent
  useEffect(() => {
    if (timer.isUrgent && timer.isActive) {
      sound.playTick();
    }
  }, [timer.timeLeft, timer.isUrgent, timer.isActive]);

  // Initialize game
  useEffect(() => {
    engine.initialize();
    setGameStarted(false);
    timer.reset();
    if (inputRef.current) inputRef.current.focus();
  }, [gameMode, storyLevel, freeWriteTopic]);

  const startIfNeeded = () => {
    if (!gameStarted && !engine.isFinished) {
      setGameStarted(true);
      timer.start();
    }
  };

  const handleInfiniteInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    startIfNeeded();
    const result = engine.handleInfiniteInput(e.target.value);
    if (result.wordComplete && result.correct) {
      sound.playWordComplete();
      if (engine.combo > 0 && engine.combo % 5 === 0) {
        sound.playComboMilestone();
      }
    } else if (result.correct === false) {
      sound.playError();
    }
  };

  const handleStoryInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    startIfNeeded();
    const result = engine.handleStoryInput(e.target.value);
    if (result.charCorrect) {
      sound.playCorrectKey();
    } else if (result.charCorrect === false) {
      sound.playError();
    }
    if (result.finished) {
      handleFinish();
    }
  };

  const handleFreeWriteInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    startIfNeeded();
    engine.handleFreeWriteInput(e.target.value);
  };

  const changeFreeWriteTopic = () => {
    const newTopic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
    setFreeWriteTopic(newTopic);
  };

  const handleRetry = () => {
    engine.initialize();
    setGameStarted(false);
    setNewAchievements([]);
    timer.reset();
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const getTitle = () => {
    if (gameMode === GameMode.Infinite) return "Modo Infinito";
    if (gameMode === GameMode.FreeWrite) return `Tema: ${freeWriteTopic}`;
    if (gameMode === GameMode.DailyChallenge) return "Reto Diario";
    return `Historia: ${STORY_LEVELS.find(l => l.id === storyLevel)?.name}`;
  };

  // Calculate progress for story mode
  const storyProgress = (gameMode === GameMode.Story || gameMode === GameMode.DailyChallenge) && engine.storyText.length > 0
    ? (engine.input.length / engine.storyText.length) * 100
    : undefined;

  // Results screen
  if (engine.isFinished && engine.stats) {
    return <GameResults stats={engine.stats} newAchievements={newAchievements} onRetry={handleRetry} />;
  }

  return (
    <div className="max-w-4xl mx-auto pt-10 px-4">
      <GameHUD
        timeLeft={timer.timeLeft}
        isUrgent={timer.isUrgent}
        isCritical={timer.isCritical}
        wpm={engine.getRealTimeWpm(timer.timeElapsedMinutes)}
        accuracy={engine.getRealTimeAccuracy()}
        combo={engine.combo}
        maxCombo={engine.maxCombo}
        gameMode={gameMode}
        title={getTitle()}
        progress={storyProgress}
      />

      {/* Free Write topic change button */}
      {gameMode === GameMode.FreeWrite && (
        <div className="flex justify-end mb-4">
          <button onClick={changeFreeWriteTopic} className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 rounded-full" title="Cambiar Tema">
            <RefreshCcw size={18} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      )}

      {/* Infinite Mode */}
      {gameMode === GameMode.Infinite && (
        <div className="mb-6">
          <div className="relative h-20 overflow-hidden bg-white dark:bg-slate-800 rounded-xl shadow-inner border-2 border-gray-100 dark:border-slate-700 flex items-center px-4 text-2xl font-mono whitespace-nowrap">
            <div className="flex gap-4 transition-all duration-300">
              {engine.wordList.slice(engine.currentWordIndex, engine.currentWordIndex + 20).map((word, idx) => (
                <span key={engine.currentWordIndex + idx} className={`${idx === 0 ? 'text-blue-500 font-bold underline decoration-2 underline-offset-4' : 'text-gray-400 dark:text-gray-500'}`}>
                  {word}
                </span>
              ))}
            </div>
          </div>
          <input
            ref={inputRef}
            type="text"
            className={`mt-6 w-full text-2xl p-6 rounded-2xl shadow-lg border-2 ${themeConfig.border} dark:bg-slate-800 dark:text-white focus:ring-4 ring-opacity-20 outline-none transition font-mono`}
            placeholder="Escribe la palabra resaltada..."
            value={engine.typedWord}
            onChange={handleInfiniteInput}
            autoFocus
          />
        </div>
      )}

      {/* Story & DailyChallenge Mode */}
      {(gameMode === GameMode.Story || gameMode === GameMode.DailyChallenge) && (
        <>
          <div className="mb-6 text-2xl font-mono leading-relaxed p-6 bg-white dark:bg-slate-800 rounded-xl shadow-inner border-2 border-gray-100 dark:border-slate-700 min-h-[150px]">
            {engine.storyText.split('').map((char, index) => {
              let color = "text-gray-400 dark:text-slate-500";
              if (index < engine.input.length) {
                if (engine.input[index] === char) color = "text-green-500";
                else if (removeAccents(engine.input[index]) === removeAccents(char)) color = "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30";
                else color = "text-red-500 bg-red-100 dark:bg-red-900/30";
              }
              if (index === engine.input.length) {
                color += " border-l-2 border-blue-500 animate-pulse";
              }
              return <span key={index} className={color}>{char}</span>;
            })}
          </div>
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              className={`w-full text-2xl p-6 rounded-2xl shadow-lg border-2 ${themeConfig.border} dark:bg-slate-800 dark:text-white focus:ring-4 ring-opacity-20 outline-none transition font-mono`}
              placeholder="Empieza a escribir..."
              value={engine.input}
              onChange={handleStoryInput}
              autoFocus
            />
            <div className="absolute right-4 top-6 text-gray-400">{engine.input.length} chars</div>
          </div>
        </>
      )}

      {/* FreeWrite Mode */}
      {gameMode === GameMode.FreeWrite && (
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            className={`w-full text-2xl p-6 rounded-2xl shadow-lg border-2 ${themeConfig.border} dark:bg-slate-800 dark:text-white focus:ring-4 ring-opacity-20 outline-none transition font-mono`}
            placeholder={`Escribe sobre: ${freeWriteTopic}...`}
            value={engine.input}
            onChange={handleFreeWriteInput}
            autoFocus
          />
          <div className="absolute right-4 top-6 text-gray-400">{engine.input.length} chars</div>
        </div>
      )}

      <div className="mt-8 flex gap-4 justify-center text-sm text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-500" /> Correcto</span>
        <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-yellow-500" /> Puntuación/Tilde</span>
        <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-500" /> Error</span>
      </div>
    </div>
  );
};

export default GameScreen;
