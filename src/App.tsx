import { useState, useEffect } from 'react';
import { UsernameScreen } from './components/UsernameScreen';
import { IntroScreen } from './components/IntroScreen';
import { Room1Cartouche } from './components/Room1Cartouche';
import { Room2Torches } from './components/Room2Torches';
import { Room3Scale } from './components/Room3Scale';
import { Room4Constellation } from './components/Room4Constellation';
import { Room5Sarcophagus } from './components/Room5Sarcophagus';
import { EndingScreen } from './components/EndingScreen';
import { Timer } from './components/Timer';
import { ScoreBoard } from './components/ScoreBoard';

type GameState = 'username' | 'intro' | 'room1' | 'room2' | 'room3' | 'room4' | 'room5' | 'ending' | 'failed';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('username');
  const [username, setUsername] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [roomAttempts, setRoomAttempts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!isTimerActive || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState('failed');
          setIsTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  const handleUsernameSubmit = (name: string) => {
    setUsername(name);
    setGameState('intro');
  };

  const startGame = () => {
    setGameState('room1');
    setIsTimerActive(true);
  };

  const handleRoomComplete = (room: GameState, points: number) => {
    setTotalPoints(prev => prev + points);
    
    if (room === 'room1') setGameState('room2');
    else if (room === 'room2') setGameState('room3');
    else if (room === 'room3') setGameState('room4');
    else if (room === 'room4') setGameState('room5');
    else if (room === 'room5') {
      setIsTimerActive(false);
      // Calculate final score and save to leaderboard
      const timeBonus = Math.floor(timeLeft * 2);
      const perfectionBonus = Object.values(roomAttempts).reduce((sum, val) => sum + val, 0) === 0 ? 2000 : 0;
      const finalScore = totalPoints + points + timeBonus + perfectionBonus;
      saveToLeaderboard(username, finalScore, timeLeft);
      setGameState('ending');
    }
  };

  const saveToLeaderboard = (name: string, score: number, timeRemaining: number) => {
    const leaderboard = JSON.parse(localStorage.getItem('pharaoh-leaderboard') || '[]');
    const entry = {
      name,
      score,
      timeRemaining,
      date: new Date().toISOString(),
    };
    leaderboard.push(entry);
    leaderboard.sort((a: any, b: any) => b.score - a.score);
    // Keep top 10
    const top10 = leaderboard.slice(0, 10);
    localStorage.setItem('pharaoh-leaderboard', JSON.stringify(top10));
  };

  const handleRoomAttempt = (roomName: string) => {
    setRoomAttempts(prev => ({
      ...prev,
      [roomName]: (prev[roomName] || 0) + 1
    }));
  };

  const resetGame = () => {
    setGameState('username');
    setUsername('');
    setTimeLeft(600);
    setIsTimerActive(false);
    setTotalPoints(0);
    setRoomAttempts({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-950 via-yellow-900 to-amber-950 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(251, 191, 36, 0.1) 50px, rgba(251, 191, 36, 0.1) 51px)`,
        }}></div>
      </div>

      {/* Timer & Score - shown during gameplay */}
      {isTimerActive && gameState !== 'ending' && gameState !== 'failed' && (
        <>
          <Timer timeLeft={timeLeft} />
          <ScoreBoard points={totalPoints} username={username} />
        </>
      )}

      {/* Game screens */}
      <div className="relative z-10">
        {gameState === 'username' && <UsernameScreen onSubmit={handleUsernameSubmit} />}
        {gameState === 'intro' && <IntroScreen username={username} onStart={startGame} />}
        {gameState === 'room1' && (
          <Room1Cartouche 
            onComplete={(points) => handleRoomComplete('room1', points)}
            onAttempt={() => handleRoomAttempt('room1')}
          />
        )}
        {gameState === 'room2' && (
          <Room2Torches 
            onComplete={(points) => handleRoomComplete('room2', points)}
            onAttempt={() => handleRoomAttempt('room2')}
          />
        )}
        {gameState === 'room3' && (
          <Room3Scale 
            onComplete={(points) => handleRoomComplete('room3', points)}
            onAttempt={() => handleRoomAttempt('room3')}
          />
        )}
        {gameState === 'room4' && (
          <Room4Constellation 
            onComplete={(points) => handleRoomComplete('room4', points)}
            onAttempt={() => handleRoomAttempt('room4')}
          />
        )}
        {gameState === 'room5' && (
          <Room5Sarcophagus
            onComplete={(points) => handleRoomComplete('room5', points)}
            onAttempt={() => handleRoomAttempt('room5')}
          />
        )}
        {gameState === 'ending' && (
          <EndingScreen 
            username={username}
            timeLeft={timeLeft} 
            totalPoints={totalPoints}
            roomAttempts={roomAttempts}
          />
        )}
        {gameState === 'failed' && (
          <div className="min-h-screen flex items-center justify-center p-8">
            <div className="max-w-2xl mx-auto text-center px-4">
              <div className="text-6xl md:text-8xl mb-8">☀️</div>
              <h1 className="text-amber-200 mb-6 text-3xl md:text-5xl">The Sun Has Risen</h1>
              <p className="text-amber-300 mb-8 max-w-md mx-auto text-sm md:text-base">
                The curse remains unbroken. Pharaoh Khamet-Ren's spirit grows restless once more.
                You have failed to unseal the tomb before sunrise.
              </p>
              <button
                onClick={resetGame}
                className="px-6 md:px-8 py-3 md:py-4 bg-amber-600 hover:bg-amber-500 text-amber-950 rounded-lg transition-colors text-sm md:text-base"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
