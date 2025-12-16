import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  User, Theme, GameMode, Rank, GameResult, UserStats, Friend, ChatMessage, Level 
} from './types';
import { 
  THEME_CONFIG, COMMON_WORDS_ES, STORY_LEVELS, CALCULATE_RANK, XP_TABLE, TOPICS, MOCK_LEADERBOARD 
} from './constants';
import { generateAtlasResponse, generateAvatar } from './services/geminiService';
import { registerUser, loginUser, getCurrentUser, logoutUser, updateUserInDB } from './services/storageService';
import { 
  Heart, Star, User as UserIcon, LogOut, Settings, Play, Users, 
  Trophy, MessageCircle, Send, X, BarChart2, Search, Plus, Map,
  Clock, CheckCircle, AlertTriangle, PenTool, Moon, Sun, Camera, ArrowRight, Lock, Unlock, RefreshCcw
} from 'lucide-react';

// --- Utility Functions ---
const removeAccents = (str: string) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

// --- Sub-Components ---

const AuthScreen = ({ onLogin }: { onLogin: (u: User) => void }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (isRegister) {
      const user = registerUser(username, password);
      if (user) {
        onLogin(user);
      } else {
        setError("El usuario ya existe.");
      }
    } else {
      const user = loginUser(username, password);
      if (user) {
        onLogin(user);
      } else {
        setError("Usuario o contraseña incorrectos.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 dark:bg-slate-900 transition-colors">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl w-96 text-center border-4 border-blue-100 dark:border-blue-900">
        <div className="mb-6 flex justify-center">
          <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Cinnamoroll" className="w-24 h-24 rounded-full bg-blue-100 p-2" alt="Logo" />
        </div>
        <h1 className="text-3xl font-bold text-blue-500 mb-2">TypoKawaii</h1>
        <p className="text-gray-400 mb-6">{isRegister ? 'Crea tu cuenta mágica' : 'Bienvenido de nuevo'}</p>
        
        {error && <div className="bg-red-100 text-red-500 p-2 rounded-lg mb-4 text-sm font-bold">{error}</div>}

        <form onSubmit={handleAuth} className="space-y-4">
          <input 
            type="text" 
            placeholder="Nombre de usuario" 
            className="w-full p-3 rounded-lg border-2 border-blue-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:border-blue-400 outline-none transition"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Contraseña" 
            className="w-full p-3 rounded-lg border-2 border-blue-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:border-blue-400 outline-none transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="w-full bg-blue-400 text-white p-3 rounded-xl font-bold hover:bg-blue-500 transition shadow-md hover:shadow-lg transform hover:-translate-y-1">
            {isRegister ? 'Registrarse' : 'Iniciar Sesión'}
          </button>
        </form>
        
        <button 
          onClick={() => { setIsRegister(!isRegister); setError(''); }}
          className="mt-4 text-blue-400 text-sm hover:underline"
        >
          {isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
        </button>
      </div>
    </div>
  );
};

// --- Main App Component ---

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<Theme>(Theme.Cinnamoroll);
  const [darkMode, setDarkMode] = useState(false);
  const [view, setView] = useState<'dashboard' | 'game' | 'storyMap' | 'profile' | 'friends' | 'leaderboard'>('dashboard');
  
  // Game State
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.Infinite);
  const [storyLevel, setStoryLevel] = useState<number>(1);
  const [freeWriteTopic, setFreeWriteTopic] = useState<string>('');
  
  // Chatbot State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Initialize
  useEffect(() => {
    const existingUser = getCurrentUser();
    if (existingUser) setUser(existingUser);
  }, []);

  // Dark Mode Effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const themeConfig = THEME_CONFIG[theme];

  const handleLogin = (u: User) => {
    setUser(u);
    setView('dashboard');
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
  };

  const updateStats = (result: GameResult) => {
    if (!user) return;
    
    const newXp = user.stats.xp + result.xpEarned;
    const newLevel = Math.floor(newXp / XP_TABLE.LEVEL_BASE) + 1;
    const newHighestWpm = Math.max(user.stats.highestWpm, result.wpm);
    
    let newRankInfinite = user.stats.rankInfinite;
    let newRankFree = user.stats.rankFreeWrite;
    let newStoryProgress = user.stats.storyProgress;

    if (result.mode === GameMode.Infinite) {
       newRankInfinite = CALCULATE_RANK(newHighestWpm, result.accuracy);
    } else if (result.mode === GameMode.FreeWrite) {
       newRankFree = CALCULATE_RANK(newHighestWpm, result.accuracy);
    } else if (result.mode === GameMode.Story && result.isWin && result.levelId === user.stats.storyProgress) {
       newStoryProgress = Math.min(STORY_LEVELS.length, user.stats.storyProgress + 1);
    }

    const updatedUser: User = {
      ...user,
      stats: {
        ...user.stats,
        xp: newXp,
        level: newLevel,
        gamesPlayed: user.stats.gamesPlayed + 1,
        highestWpm: newHighestWpm,
        rankInfinite: newRankInfinite,
        rankFreeWrite: newRankFree,
        storyProgress: newStoryProgress
      }
    };

    setUser(updatedUser);
    updateUserInDB(updatedUser);
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim() || !user) return;
    
    const newMessage: ChatMessage = { role: 'user', text: chatInput };
    setChatHistory(prev => [...prev, newMessage]);
    setChatInput('');
    setIsChatLoading(true);

    const response = await generateAtlasResponse(newMessage.text, user, chatHistory);
    
    setChatHistory(prev => [...prev, { role: 'model', text: response }]);
    setIsChatLoading(false);
  };

  // --- Components ---

  const StoryMap = () => {
    if (!user) return null;
    return (
      <div className="max-w-4xl mx-auto pt-10 px-4 animate-fade-in">
        <h2 className={`text-4xl font-bold text-center mb-10 ${themeConfig.text}`}>Mapa de Aventura</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
          {/* Connecting Line (Simplistic vertical) */}
          <div className="absolute left-1/2 top-10 bottom-10 w-1 bg-gray-200 dark:bg-gray-700 hidden md:block transform -translate-x-1/2 -z-10"></div>

          {STORY_LEVELS.map((level, index) => {
            const isLocked = level.id > user.stats.storyProgress;
            const isCompleted = level.id < user.stats.storyProgress;
            
            return (
              <div 
                key={level.id}
                className={`relative group ${index % 2 === 0 ? 'md:text-right md:pr-10' : 'md:text-left md:pl-10 md:col-start-2'}`}
              >
                <button
                  onClick={() => {
                    if (!isLocked) {
                      setStoryLevel(level.id);
                      setGameMode(GameMode.Story);
                      setView('game');
                    }
                  }}
                  disabled={isLocked}
                  className={`
                    w-full p-6 rounded-2xl shadow-lg border-4 transition-all transform hover:scale-105
                    ${isLocked 
                      ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed dark:bg-slate-800 dark:border-slate-700' 
                      : isCompleted 
                        ? 'bg-green-50 border-green-200 hover:border-green-400 cursor-pointer dark:bg-green-900/20 dark:border-green-800'
                        : `bg-white ${themeConfig.border} cursor-pointer hover:shadow-2xl dark:bg-slate-800 dark:text-white`
                    }
                  `}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className={`${index % 2 !== 0 ? 'order-2' : ''}`}>
                       <span className={`text-sm font-bold uppercase tracking-wide ${isLocked ? 'text-gray-400' : themeConfig.accent}`}>Nivel {level.id}</span>
                       <h3 className="text-xl font-bold">{level.name}</h3>
                       <div className="text-xs mt-2 text-gray-500 flex gap-2 justify-end">
                         <span>Min WPM: {level.minWpm}</span>
                         <span>Precisión: {level.minAccuracy}%</span>
                       </div>
                    </div>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isLocked ? 'bg-gray-200' : isCompleted ? 'bg-green-100 text-green-600' : themeConfig.primary + ' text-white'}`}>
                       {isLocked ? <Lock size={20} /> : isCompleted ? <CheckCircle size={20} /> : <Play size={20} fill="currentColor" />}
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
        
        <button onClick={() => setView('dashboard')} className="mt-10 mx-auto block text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white underline">
          Volver al Dashboard
        </button>
      </div>
    );
  };

  const GameScreen = () => {
    // --- Infinite Mode Specific State ---
    const [wordList, setWordList] = useState<string[]>([]);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [typedWord, setTypedWord] = useState('');
    
    // --- Common State ---
    const [storyText, setStoryText] = useState('');
    const [input, setInput] = useState(''); // Only used for Story/FreeWrite, for Infinite we use typedWord
    const [timeLeft, setTimeLeft] = useState(60);
    const [isActive, setIsActive] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [stats, setStats] = useState<GameResult | null>(null);
    
    const inputRef = useRef<HTMLInputElement>(null);
    const timerRef = useRef<number | null>(null);
    const wordsContainerRef = useRef<HTMLDivElement>(null);

    // Initial Setup
    useEffect(() => {
      if (gameMode === GameMode.Infinite) {
        // Generate initial pool
        const words = [];
        for(let i=0; i<50; i++) words.push(COMMON_WORDS_ES[Math.floor(Math.random() * COMMON_WORDS_ES.length)]);
        setWordList(words);
        setCurrentWordIndex(0);
        setTypedWord('');
      } else if (gameMode === GameMode.Story) {
        const level = STORY_LEVELS.find(l => l.id === storyLevel);
        setStoryText(level ? level.text : "Fin.");
        setInput('');
      } else if (gameMode === GameMode.FreeWrite) {
        setInput('');
      }
      if(inputRef.current) inputRef.current.focus();
    }, [gameMode, storyLevel, freeWriteTopic]); // Re-run if topic changes

    // Timer Logic
    useEffect(() => {
      if (isActive && timeLeft > 0) {
        timerRef.current = window.setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      } else if (timeLeft === 0 && isActive) {
        finishGame();
      }
      return () => { if (timerRef.current) window.clearTimeout(timerRef.current); };
    }, [isActive, timeLeft]);

    const finishGame = () => {
      setIsActive(false);
      setIsFinished(true);
      
      let correctChars = 0;
      let errorChars = 0;
      let punctErrors = 0;
      let calculatedWpm = 0;
      let calculatedAcc = 0;
      let isWin = false;

      if (gameMode === GameMode.Infinite) {
         // Infinite logic is calculated on fly usually, but let's approximate from currentWordIndex
         // Ideally, track *total* correct keypresses. For simplicity in this demo:
         // We count fully correct words as 5 chars each roughly + space.
         // A better way for the demo:
         // Since we don't track history of "correctChars" in infinite mode state, let's just assume 
         // currentWordIndex represents correct words.
         // NOTE: This is a simplification. A real typing engine tracks every keystroke.
         correctChars = currentWordIndex * 5; // approx
         calculatedWpm = currentWordIndex; // 1 word = 1 wpm roughly if 1 min.
         calculatedAcc = 100; // Simplified for infinite mode demo if we only allow correct words to pass
      } else {
        const textToMatch = gameMode === GameMode.Story ? storyText : input; // Free write compares to itself valid words
        
        if (gameMode === GameMode.FreeWrite) {
          const inputWords = input.trim().split(/\s+/);
          inputWords.forEach(word => {
              const cleanWord = removeAccents(word.toLowerCase()).replace(/[.,;]/g, '');
              if (COMMON_WORDS_ES.includes(cleanWord)) {
                  correctChars += word.length + 1;
              } else {
                  errorChars += word.length;
              }
          });
        } else {
          // Story Mode strict matching
           for (let i = 0; i < input.length; i++) {
            if (i >= storyText.length) break;
            const charTyped = input[i];
            const charTarget = storyText[i];
            if (charTyped === charTarget) {
                correctChars++;
            } else {
                if (removeAccents(charTyped) === removeAccents(charTarget)) punctErrors++;
                else errorChars++;
            }
          }
        }
        
        const totalChars = input.length;
        calculatedWpm = Math.round((correctChars / 5));
        calculatedAcc = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 0;
      }

      // Check win condition for Story
      if (gameMode === GameMode.Story) {
         const level = STORY_LEVELS.find(l => l.id === storyLevel);
         if (level && calculatedWpm >= level.minWpm && calculatedAcc >= level.minAccuracy && input.length >= storyText.length) {
            isWin = true;
         }
      }

      const xp = (correctChars * XP_TABLE.PER_CHAR) + (calculatedAcc > 95 ? XP_TABLE.BONUS_ACCURACY : 0) + (isWin ? XP_TABLE.BONUS_WIN : 0) + 20; // Base participation XP

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
        isWin
      };

      setStats(result);
      updateStats(result);
    };

    const handleInfiniteInput = (e: React.ChangeEvent<HTMLInputElement>) => {
       const val = e.target.value;
       if (!isActive && !isFinished) setIsActive(true);

       // Check if space pressed (word submit)
       if (val.endsWith(' ')) {
          const wordToMatch = wordList[currentWordIndex];
          const typedTrimmed = val.trim();
          
          if (typedTrimmed === wordToMatch) {
             // Correct word
             setCurrentWordIndex(prev => prev + 1);
             setTypedWord('');
             
             // Add more words if running low
             if (currentWordIndex + 10 > wordList.length) {
                setWordList(prev => [...prev, COMMON_WORDS_ES[Math.floor(Math.random() * COMMON_WORDS_ES.length)]]);
             }
          } else {
             // Incorrect word (visual feedback handled in render, but strictly we could block space)
             // For this demo, we allow it but it won't advance if we wanted "stop on error"
             // But user asked for "Infinite phrase that appears".
             // Let's adopt "Sudden Death" or just clear input if wrong? 
             // Let's just clear input and keep index same (forcing retry)
             setTypedWord(''); 
          }
       } else {
          setTypedWord(val);
       }
    };

    const handleStandardInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (!isActive && !isFinished) setIsActive(true);
      setInput(val);

      if (gameMode === GameMode.Story && val.length >= storyText.length) {
         finishGame();
      }
    };

    const changeFreeWriteTopic = () => {
       const newTopic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
       setFreeWriteTopic(newTopic);
       setInput('');
       setIsActive(false);
       setTimeLeft(60);
       inputRef.current?.focus();
    };

    // --- Render Logic ---

    // Summary Screen
    if (isFinished && stats) {
      return (
        <div className="flex flex-col items-center justify-center h-full animate-fade-in py-10">
           <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border-4 border-dashed border-gray-200 dark:border-slate-700 text-center max-w-lg w-full">
              <Trophy className={`w-16 h-16 mx-auto mb-4 ${themeConfig.text}`} />
              <h2 className="text-3xl font-bold mb-2 dark:text-white">
                {gameMode === GameMode.Story 
                  ? (stats.isWin ? "¡Nivel Completado!" : "Inténtalo de nuevo") 
                  : "¡Sesión Terminada!"}
              </h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6 mt-6">
                 <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-xl">
                    <p className="text-gray-500 dark:text-gray-300 text-sm">WPM</p>
                    <p className="text-3xl font-bold text-green-500">{stats.wpm}</p>
                 </div>
                 <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-xl">
                    <p className="text-gray-500 dark:text-gray-300 text-sm">Precisión</p>
                    <p className="text-3xl font-bold text-blue-500">{stats.accuracy}%</p>
                 </div>
                 <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-xl">
                    <p className="text-gray-500 dark:text-gray-300 text-sm">XP Ganada</p>
                    <p className="text-3xl font-bold text-purple-500">+{stats.xpEarned}</p>
                 </div>
                 <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-xl">
                    <p className="text-gray-500 dark:text-gray-300 text-sm">Rango</p>
                    <p className="text-xl font-bold text-yellow-600">
                      {gameMode === GameMode.Infinite ? user?.stats.rankInfinite : gameMode === GameMode.FreeWrite ? user?.stats.rankFreeWrite : (stats.isWin ? "Pasado" : "Fallido")}
                    </p>
                 </div>
              </div>

              <div className="space-y-3">
                {gameMode === GameMode.Story && stats.isWin && storyLevel < STORY_LEVELS.length && (
                    <button 
                      onClick={() => {
                        setStoryLevel(prev => prev + 1);
                        setIsFinished(false);
                        setIsActive(false);
                        setTimeLeft(60);
                        setInput('');
                      }}
                      className={`w-full ${themeConfig.button} py-3 rounded-xl font-bold transition flex justify-center items-center gap-2`}
                    >
                      Siguiente Nivel <ArrowRight size={20}/>
                    </button>
                )}
                 
                 <div className="flex gap-4">
                    <button onClick={() => setView('dashboard')} className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white text-gray-700 py-3 rounded-xl font-bold transition">Menú</button>
                    <button 
                      onClick={() => { 
                        setIsFinished(false); 
                        setInput(''); 
                        setTypedWord('');
                        if (gameMode === GameMode.Infinite) {
                           setWordList([]); 
                           // Effect will trigger regen
                        }
                        setIsActive(false); 
                        setTimeLeft(60); 
                      }} 
                      className={`flex-1 ${themeConfig.button} py-3 rounded-xl font-bold transition`}
                    >
                      Repetir
                    </button>
                 </div>
              </div>
           </div>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto pt-10 px-4">
        {/* Header Info */}
        <div className="flex justify-between items-center mb-8">
           <div className="flex items-center gap-2">
             <Clock className={themeConfig.accent} />
             <span className="text-2xl font-bold font-mono dark:text-white">{timeLeft}s</span>
           </div>
           <div className={`text-xl font-bold ${themeConfig.text}`}>
             {gameMode === GameMode.Infinite ? "Modo Infinito" : gameMode === GameMode.FreeWrite ? `Tema: ${freeWriteTopic}` : `Historia: ${STORY_LEVELS.find(l=>l.id===storyLevel)?.name}`}
           </div>
           {gameMode === GameMode.FreeWrite && (
             <button onClick={changeFreeWriteTopic} className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 rounded-full" title="Cambiar Tema">
               <RefreshCcw size={18} className="text-gray-600 dark:text-gray-300"/>
             </button>
           )}
        </div>

        {/* --- Infinite Mode View --- */}
        {gameMode === GameMode.Infinite && (
           <div className="mb-6">
              {/* Sliding Window Container */}
              <div className="relative h-20 overflow-hidden bg-white dark:bg-slate-800 rounded-xl shadow-inner border-2 border-gray-100 dark:border-slate-700 flex items-center px-4 text-2xl font-mono whitespace-nowrap">
                 {/* Mask for fading edges could go here */}
                 <div className="flex gap-4 transition-all duration-300" style={{ transform: `translateX(0)` }}>
                    {wordList.slice(currentWordIndex, currentWordIndex + 20).map((word, idx) => (
                       <span key={currentWordIndex + idx} className={`${idx === 0 ? 'text-blue-500 font-bold underline decoration-2 underline-offset-4' : 'text-gray-400 dark:text-gray-500'}`}>
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
                 value={typedWord}
                 onChange={handleInfiniteInput}
                 autoFocus
              />
           </div>
        )}

        {/* --- Story & FreeWrite Mode View --- */}
        {gameMode !== GameMode.Infinite && (
           <>
            {gameMode === GameMode.Story && (
               <div className="mb-6 text-2xl font-mono leading-relaxed p-6 bg-white dark:bg-slate-800 rounded-xl shadow-inner border-2 border-gray-100 dark:border-slate-700 min-h-[150px]">
                 {storyText.split('').map((char, index) => {
                   let color = "text-gray-400 dark:text-slate-500";
                   if (index < input.length) {
                     if (input[index] === char) color = "text-green-500";
                     else if (removeAccents(input[index]) === removeAccents(char)) color = "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30";
                     else color = "text-red-500 bg-red-100 dark:bg-red-900/30";
                   }
                   return <span key={index} className={color}>{char}</span>;
                 })}
               </div>
            )}

            <div className="relative">
               <input
                 ref={inputRef}
                 type="text"
                 className={`w-full text-2xl p-6 rounded-2xl shadow-lg border-2 ${themeConfig.border} dark:bg-slate-800 dark:text-white focus:ring-4 ring-opacity-20 outline-none transition font-mono`}
                 placeholder={gameMode === GameMode.FreeWrite ? `Escribe sobre: ${freeWriteTopic}...` : "Empieza a escribir..."}
                 value={input}
                 onChange={handleStandardInput}
                 autoFocus
              />
               <div className="absolute right-4 top-6 text-gray-400">
                 {input.length} chars
               </div>
            </div>
          </>
        )}
        
        <div className="mt-8 flex gap-4 justify-center text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-500"></div> Correcto</span>
          <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-yellow-500"></div> Puntuación/Tilde</span>
          <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-500"></div> Error</span>
        </div>
      </div>
    );
  };

  const Dashboard = () => (
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 px-4">
      {/* Modes */}
      <div className="md:col-span-2 space-y-6">
        <h2 className={`text-3xl font-bold ${themeConfig.text} mb-4`}>Selecciona un Modo</h2>
        
        <div 
          onClick={() => { setGameMode(GameMode.Infinite); setView('game'); }}
          className="group cursor-pointer bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all border-l-8 border-blue-400 hover:scale-[1.02]"
        >
          <div className="flex justify-between items-center">
             <div>
               <h3 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                 <PenTool className="w-6 h-6 text-blue-400" /> Infinito (Ranked)
               </h3>
               <p className="text-gray-500 dark:text-gray-400 mt-2">Prueba de resistencia sin fin. Sube de rango.</p>
             </div>
             <Play className="w-10 h-10 text-gray-300 dark:text-gray-600 group-hover:text-blue-400 transition" />
          </div>
        </div>

        <div 
          onClick={() => { 
            setGameMode(GameMode.FreeWrite); 
            setFreeWriteTopic(TOPICS[Math.floor(Math.random() * TOPICS.length)]);
            setView('game'); 
          }}
          className="group cursor-pointer bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all border-l-8 border-pink-400 hover:scale-[1.02]"
        >
          <div className="flex justify-between items-center">
             <div>
               <h3 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                 <Star className="w-6 h-6 text-pink-400" /> Escritura Libre (Ranked)
               </h3>
               <p className="text-gray-500 dark:text-gray-400 mt-2">Se te da un tema, escribe lo que sientas. Valida vocabulario.</p>
             </div>
             <Play className="w-10 h-10 text-gray-300 dark:text-gray-600 group-hover:text-pink-400 transition" />
          </div>
        </div>

        <div 
          onClick={() => { setView('storyMap'); }}
          className="group cursor-pointer bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all border-l-8 border-yellow-400 hover:scale-[1.02]"
        >
          <div className="flex justify-between items-center">
             <div>
               <h3 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                 <Map className="w-6 h-6 text-yellow-400" /> Modo Historia
               </h3>
               <p className="text-gray-500 dark:text-gray-400 mt-2">Viaja a través de niveles con dificultad progresiva.</p>
             </div>
             <Play className="w-10 h-10 text-gray-300 dark:text-gray-600 group-hover:text-yellow-400 transition" />
          </div>
        </div>
      </div>

      {/* Sidebar Info */}
      <div className="space-y-6">
         <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md">
           <h3 className="font-bold text-gray-700 dark:text-white mb-4 flex items-center gap-2"><Trophy className="w-5 h-5 text-yellow-500"/> Tu Progreso</h3>
           <div className="space-y-4">
              <div className="flex justify-between text-sm dark:text-gray-300">
                <span>Nivel</span>
                <span className="font-bold">{user?.stats.level}</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2">
                 <div className={`h-2 rounded-full ${themeConfig.primary}`} style={{width: `${(user!.stats.xp % XP_TABLE.LEVEL_BASE) / 10}%`}}></div>
              </div>
              <div className="flex justify-between text-sm">
                 <span className="text-gray-500 dark:text-gray-400">Rango Infinito</span>
                 <span className="font-bold text-blue-500">{user?.stats.rankInfinite}</span>
              </div>
           </div>
         </div>

         <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md">
            <h3 className="font-bold text-gray-700 dark:text-white mb-4 flex items-center gap-2"><Settings className="w-5 h-5"/> Accesos Rápidos</h3>
            <button onClick={() => setView('friends')} className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg flex items-center gap-3 transition dark:text-gray-300">
               <Users className="w-5 h-5 text-gray-400" /> Amigos
            </button>
            <button onClick={() => setView('leaderboard')} className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg flex items-center gap-3 transition dark:text-gray-300">
               <BarChart2 className="w-5 h-5 text-gray-400" /> Leaderboard Global
            </button>
         </div>
      </div>
    </div>
  );

  const Profile = () => {
    const [isGenerating, setIsGenerating] = useState(false);
    
    const handleGenerateAvatar = async () => {
       if (!user) return;
       setIsGenerating(true);
       const newAvatar = await generateAvatar(user.username);
       if (newAvatar) {
         const updated = { ...user, avatarUrl: newAvatar };
         setUser(updated);
         updateUserInDB(updated);
       } else {
         alert("Error generando el avatar. Inténtalo de nuevo.");
       }
       setIsGenerating(false);
    };

    return (
    <div className="max-w-4xl mx-auto pt-10 px-4">
       <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden transition-colors">
          <div className={`h-32 ${themeConfig.bg} relative`}></div>
          <div className="px-8 pb-8">
             <div className="relative -top-12 flex justify-between items-end">
                <img src={user?.avatarUrl} className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-800 shadow-md bg-white dark:bg-slate-700 object-cover" alt="Avatar"/>
                <button 
                  onClick={handleGenerateAvatar}
                  disabled={isGenerating}
                  className={`${themeConfig.button} px-6 py-2 rounded-xl font-bold shadow-md flex items-center gap-2`}
                >
                  <Camera size={18} /> {isGenerating ? 'Generando...' : 'Crear Avatar AI'}
                </button>
             </div>
             
             <div className="mt-[-2rem]">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{user?.username}</h1>
                <p className="text-gray-500 dark:text-gray-400">Miembro desde {new Date(user?.createdAt || '').toLocaleDateString()}</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-gray-50 dark:bg-slate-700 p-6 rounded-2xl text-center">
                   <div className="text-3xl font-bold text-blue-500">{user?.stats.highestWpm}</div>
                   <div className="text-gray-400 dark:text-gray-300 text-sm font-bold uppercase tracking-wide">Mejor WPM</div>
                </div>
                <div className="bg-gray-50 dark:bg-slate-700 p-6 rounded-2xl text-center">
                   <div className="text-3xl font-bold text-purple-500">{user?.stats.gamesPlayed}</div>
                   <div className="text-gray-400 dark:text-gray-300 text-sm font-bold uppercase tracking-wide">Partidas</div>
                </div>
                <div className="bg-gray-50 dark:bg-slate-700 p-6 rounded-2xl text-center">
                   <div className="text-3xl font-bold text-yellow-500">{user?.stats.level}</div>
                   <div className="text-gray-400 dark:text-gray-300 text-sm font-bold uppercase tracking-wide">Nivel</div>
                </div>
             </div>
             
             <div className="mt-8">
               <h3 className="text-xl font-bold mb-4 dark:text-white">Rangos Actuales</h3>
               <div className="flex gap-4">
                  <div className="flex-1 border-2 border-blue-100 dark:border-slate-600 p-4 rounded-xl flex items-center justify-between">
                     <span className="dark:text-gray-300">Modo Infinito</span>
                     <span className="font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300 px-3 py-1 rounded-full">{user?.stats.rankInfinite}</span>
                  </div>
                  <div className="flex-1 border-2 border-pink-100 dark:border-slate-600 p-4 rounded-xl flex items-center justify-between">
                     <span className="dark:text-gray-300">Escritura Libre</span>
                     <span className="font-bold text-pink-600 bg-pink-50 dark:bg-pink-900/30 dark:text-pink-300 px-3 py-1 rounded-full">{user?.stats.rankFreeWrite}</span>
                  </div>
               </div>
             </div>
          </div>
       </div>
    </div>
    );
  };

  const Leaderboard = () => {
     const [filter, setFilter] = useState<'today'|'week'|'all'>('all');
     
     // Mock filter logic: just slightly randomize displayed wpm to simulate different timeframes
     const displayedData = useMemo(() => {
        return MOCK_LEADERBOARD.map(u => ({
           ...u,
           wpm: filter === 'today' ? u.wpm - Math.floor(Math.random() * 20) : filter === 'week' ? u.wpm - Math.floor(Math.random() * 10) : u.wpm
        })).sort((a,b) => b.wpm - a.wpm);
     }, [filter]);

     return (
     <div className="max-w-4xl mx-auto pt-10 px-4">
       <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl transition-colors">
         <div className="flex justify-between items-center mb-6">
           <h2 className={`text-3xl font-bold ${themeConfig.text}`}>Clasificación Mundial</h2>
           <div className="flex gap-2">
             <button onClick={() => setFilter('today')} className={`px-4 py-1 rounded-full font-bold transition ${filter === 'today' ? themeConfig.primary + ' text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'}`}>Hoy</button>
             <button onClick={() => setFilter('week')} className={`px-4 py-1 rounded-full font-bold transition ${filter === 'week' ? themeConfig.primary + ' text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'}`}>Semanal</button>
             <button onClick={() => setFilter('all')} className={`px-4 py-1 rounded-full font-bold transition ${filter === 'all' ? themeConfig.primary + ' text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'}`}>Histórico</button>
           </div>
         </div>

         <div className="space-y-4">
            {displayedData.map((u, i) => (
              <div key={i} className="flex items-center justify-between p-4 border border-gray-100 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition">
                 <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${i === 0 ? 'bg-yellow-100 text-yellow-600' : i === 1 ? 'bg-gray-200 text-gray-600' : i === 2 ? 'bg-orange-100 text-orange-600' : 'text-gray-400'}`}>
                      {i + 1}
                    </div>
                    <img src={u.avatar} className="w-10 h-10 rounded-full bg-gray-100" />
                    <span className="font-bold text-gray-700 dark:text-white">{u.name}</span>
                 </div>
                 <div className="flex gap-8 text-right">
                    <div>
                      <span className="block font-bold text-gray-800 dark:text-gray-200">{u.wpm} WPM</span>
                    </div>
                    <div>
                       <span className={`px-2 py-0.5 rounded text-xs font-bold ${i === 0 ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-500'}`}>
                         {u.rank}
                       </span>
                    </div>
                 </div>
              </div>
            ))}
         </div>
       </div>
     </div>
     );
  };

  const Friends = () => (
    <div className="max-w-4xl mx-auto pt-10 px-4">
       <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl transition-colors">
         <h2 className={`text-3xl font-bold ${themeConfig.text} mb-6`}>Amigos</h2>
         
         <div className="relative mb-6">
           <Search className="absolute left-4 top-3 text-gray-400 w-5 h-5"/>
           <input type="text" placeholder="Buscar jugador por ID..." className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-700 dark:text-white rounded-xl border border-gray-200 dark:border-slate-600 outline-none focus:border-blue-400" />
         </div>

         <div className="space-y-4">
            <div className="text-center py-10 text-gray-400">
               <Users className="w-12 h-12 mx-auto mb-2 opacity-50"/>
               <p>Aún no has añadido amigos.</p>
            </div>
         </div>
       </div>
    </div>
  );

  if (!user) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <div className={`min-h-screen ${themeConfig.bg} pb-20 transition-colors duration-500`}>
      {/* Navbar */}
      <nav className="bg-white/80 dark:bg-slate-800/90 backdrop-blur-md sticky top-0 z-30 border-b border-gray-200 dark:border-slate-700 px-6 py-3 transition-colors">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('dashboard')}>
            <div className={`w-8 h-8 rounded-lg ${themeConfig.primary} flex items-center justify-center`}>
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <span className={`text-xl font-bold ${themeConfig.text}`}>TypoKawaii</span>
          </div>

          <div className="flex items-center gap-4">
             <button onClick={() => setView('friends')} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition relative">
               <Users className="w-6 h-6 text-gray-500 dark:text-gray-300" />
             </button>
             <button onClick={() => setView('profile')} className="flex items-center gap-2 pl-2 pr-4 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-full transition">
               <img src={user.avatarUrl} className="w-8 h-8 rounded-full bg-white object-cover" alt="Profile" />
               <span className="font-bold text-sm text-gray-700 dark:text-white">{user.username}</span>
             </button>
             <button onClick={handleLogout} className="p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full">
               <LogOut size={20} />
             </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="animate-fade-in">
        {view === 'dashboard' && <Dashboard />}
        {view === 'game' && <GameScreen />}
        {view === 'storyMap' && <StoryMap />}
        {view === 'profile' && <Profile />}
        {view === 'leaderboard' && <Leaderboard />}
        {view === 'friends' && <Friends />}
      </main>

      {/* Floating Controls */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-4">
        {/* Dark Mode Toggle */}
        <button 
          onClick={() => setDarkMode(!darkMode)} 
          className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-gray-100 dark:border-slate-700 text-gray-600 dark:text-yellow-400"
        >
           {darkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>

        {/* Theme Switcher */}
        <div className="flex gap-2 p-2 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-gray-100 dark:border-slate-700">
          <button onClick={() => setTheme(Theme.Cinnamoroll)} className={`w-8 h-8 rounded-full bg-sky-300 hover:bg-sky-400 border-2 ${theme === Theme.Cinnamoroll ? 'border-sky-600 scale-110' : 'border-transparent'} transition`}></button>
          <button onClick={() => setTheme(Theme.Kuromi)} className={`w-8 h-8 rounded-full bg-purple-500 hover:bg-purple-600 border-2 ${theme === Theme.Kuromi ? 'border-purple-800 scale-110' : 'border-transparent'} transition`}></button>
          <button onClick={() => setTheme(Theme.MyMelody)} className={`w-8 h-8 rounded-full bg-pink-400 hover:bg-pink-500 border-2 ${theme === Theme.MyMelody ? 'border-pink-700 scale-110' : 'border-transparent'} transition`}></button>
          <button onClick={() => setTheme(Theme.Pompompurin)} className={`w-8 h-8 rounded-full bg-yellow-400 hover:bg-yellow-500 border-2 ${theme === Theme.Pompompurin ? 'border-yellow-700 scale-110' : 'border-transparent'} transition`}></button>
        </div>
      </div>

      {/* Chatbot Atlas */}
      <div className="fixed bottom-6 left-6 z-40">
        {!isChatOpen && (
           <button 
             onClick={() => setIsChatOpen(true)}
             className="bg-white dark:bg-slate-800 p-3 rounded-full shadow-xl border-2 border-blue-100 dark:border-blue-900 hover:scale-110 transition flex items-center gap-2 group"
           >
             <div className="w-10 h-10 bg-gradient-to-tr from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                <Star className="text-white w-6 h-6 fill-white" />
             </div>
             <span className="font-bold text-gray-600 dark:text-gray-300 pr-2 hidden group-hover:block transition-all">Atlas AI</span>
           </button>
        )}

        {isChatOpen && (
          <div className="bg-white dark:bg-slate-800 w-80 h-96 rounded-2xl shadow-2xl flex flex-col border border-gray-200 dark:border-slate-700 overflow-hidden animate-slide-up">
            <div className="bg-gradient-to-r from-blue-400 to-purple-400 p-4 flex justify-between items-center text-white">
               <div className="flex items-center gap-2">
                 <Star className="w-5 h-5 fill-white" />
                 <span className="font-bold">Atlas</span>
               </div>
               <button onClick={() => setIsChatOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-slate-900">
               <div className="flex justify-start">
                 <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-2 rounded-xl rounded-tl-none text-sm shadow-sm max-w-[85%] text-gray-700 dark:text-gray-200">
                    ¡Hola {user.username}! Soy Atlas. ¿En qué puedo ayudarte hoy? ☁️
                 </div>
               </div>
               {chatHistory.map((msg, i) => (
                 <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-2 rounded-xl text-sm shadow-sm max-w-[85%] ${msg.role === 'user' ? 'bg-blue-500 text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 rounded-tl-none'}`}>
                      {msg.text}
                    </div>
                 </div>
               ))}
               {isChatLoading && (
                 <div className="flex justify-start">
                    <div className="bg-gray-200 dark:bg-slate-700 p-2 rounded-xl rounded-tl-none text-xs text-gray-500 dark:text-gray-400 animate-pulse">
                      Atlas está escribiendo...
                    </div>
                 </div>
               )}
            </div>

            <div className="p-3 bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700 flex gap-2">
               <input 
                 className="flex-1 bg-gray-50 dark:bg-slate-700 dark:text-white border border-gray-200 dark:border-slate-600 rounded-full px-3 py-1.5 text-sm outline-none focus:border-blue-400"
                 placeholder="Pregunta algo..."
                 value={chatInput}
                 onChange={(e) => setChatInput(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
               />
               <button onClick={sendChatMessage} className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition">
                  <Send className="w-4 h-4" />
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;