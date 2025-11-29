import { motion } from 'motion/react';
import { Trophy, Star, Clock, Target } from 'lucide-react';

interface EndingScreenProps {
  username: string;
  timeLeft: number;
  totalPoints: number;
  roomAttempts: Record<string, number>;
}

interface LeaderboardEntry {
  name: string;
  score: number;
  timeRemaining: number;
  date: string;
}

export function EndingScreen({ username, timeLeft, totalPoints, roomAttempts }: EndingScreenProps) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeTaken = 600 - timeLeft;
  const timeMinutes = Math.floor(timeTaken / 60);
  const timeSeconds = timeTaken % 60;
  
  const timeBonus = Math.floor(timeLeft * 2);
  const finalScore = totalPoints + timeBonus;
  
  const totalAttempts = Object.values(roomAttempts).reduce((sum, val) => sum + val, 0);
  const perfectionBonus = totalAttempts === 0 ? 2000 : 0;
  const grandTotal = finalScore + perfectionBonus;

  // Get leaderboard
  const leaderboard: LeaderboardEntry[] = JSON.parse(localStorage.getItem('pharaoh-leaderboard') || '[]');

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="max-w-4xl mx-auto text-center w-full"
      >
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="mb-8"
        >
          <motion.div 
            className="text-8xl mb-6"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              rotate: { duration: 3, repeat: Infinity, ease: 'linear' },
              scale: { duration: 2, repeat: Infinity }
            }}
          >
            ☀️
          </motion.div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Trophy className="text-yellow-400 mx-auto mb-4" size={64} />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-amber-200 mb-4 md:mb-6 text-2xl md:text-5xl px-2"
        >
          CONGRATULATIONS, {username.toUpperCase()}!
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-green-400 text-lg md:text-2xl mb-6 md:mb-8"
        >
          🎊 THE CURSE IS LIFTED 🎊
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-amber-950 via-yellow-900 to-amber-950 border-2 border-amber-600 rounded-lg p-4 md:p-8 mb-4 md:mb-6">
            <p className="text-amber-200 text-base md:text-xl leading-relaxed mb-4 md:mb-6">
              A warm light floods the tomb. The curse lifts.
              <br />
              You have restored the sun and freed the Pharaoh's restless spirit.
            </p>
            <p className="text-amber-300 italic text-sm md:text-base">
              Pharaoh Khamet-Ren may now rest in eternal peace.
            </p>
          </div>

          {/* Score breakdown */}
          <div className="grid md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
              className="bg-amber-950/50 border-2 border-amber-600 rounded-lg p-4 md:p-6"
            >
              <div className="flex items-center justify-center gap-2 mb-2 md:mb-3">
                <Clock className="text-amber-400" size={20} />
                <p className="text-amber-400 text-sm md:text-base">Completion Time</p>
              </div>
              <p className="text-yellow-400 text-2xl md:text-3xl mb-1 md:mb-2">
                {String(timeMinutes).padStart(2, '0')}:{String(timeSeconds).padStart(2, '0')}
              </p>
              <p className="text-amber-500 text-xs md:text-sm">
                Time Remaining: {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
              className="bg-amber-950/50 border-2 border-amber-600 rounded-lg p-4 md:p-6"
            >
              <div className="flex items-center justify-center gap-2 mb-2 md:mb-3">
                <Target className="text-amber-400" size={20} />
                <p className="text-amber-400 text-sm md:text-base">Total Attempts</p>
              </div>
              <p className="text-yellow-400 text-2xl md:text-3xl mb-1 md:mb-2">{totalAttempts}</p>
              <p className="text-amber-500 text-xs md:text-sm">
                {totalAttempts === 0 ? 'Perfect run! 🌟' : 'Errors across all rooms'}
              </p>
            </motion.div>
          </div>

          {/* Points breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="bg-gradient-to-br from-yellow-900/30 to-amber-900/30 border-4 border-yellow-600 rounded-lg p-4 md:p-8 mb-6"
          >
            <div className="flex items-center justify-center gap-2 md:gap-3 mb-4 md:mb-6">
              <Star className="text-yellow-400" size={24} />
              <h3 className="text-yellow-300 text-xl md:text-2xl">Final Score</h3>
              <Star className="text-yellow-400" size={24} />
            </div>

            <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
              <div className="flex justify-between items-center text-amber-200 text-sm md:text-base">
                <span>Room Points:</span>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.5 }}
                  className="text-yellow-300 text-lg md:text-xl"
                >
                  +{totalPoints}
                </motion.span>
              </div>
              <div className="flex justify-between items-center text-amber-200 text-sm md:text-base">
                <span>Time Bonus:</span>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.6 }}
                  className="text-yellow-300 text-lg md:text-xl"
                >
                  +{timeBonus}
                </motion.span>
              </div>
              {perfectionBonus > 0 && (
                <div className="flex justify-between items-center text-green-300 text-sm md:text-base">
                  <span>✨ Perfect Bonus:</span>
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.7 }}
                    className="text-green-400 text-lg md:text-xl"
                  >
                    +{perfectionBonus}
                  </motion.span>
                </div>
              )}
              <div className="border-t-2 border-amber-600 pt-2 md:pt-3 mt-2 md:mt-3"></div>
              <div className="flex justify-between items-center">
                <span className="text-yellow-200 text-base md:text-xl">TOTAL SCORE:</span>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.8 }}
                  className="text-yellow-400 text-3xl md:text-4xl"
                >
                  {grandTotal}
                </motion.span>
              </div>
            </div>
          </motion.div>

          {/* Leaderboard */}
          {leaderboard.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.9 }}
              className="bg-amber-950/50 border-2 border-amber-600 rounded-lg p-4 md:p-6"
            >
              <h3 className="text-amber-200 text-lg md:text-xl mb-4 flex items-center justify-center gap-2">
                <Trophy className="text-yellow-400" size={24} />
                Top Adventurers
              </h3>
              <div className="space-y-2">
                {leaderboard.map((entry, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2 + idx * 0.1 }}
                    className={`flex items-center justify-between p-2 md:p-3 rounded-lg ${
                      entry.name === username && entry.score === grandTotal
                        ? 'bg-yellow-900/40 border-2 border-yellow-500'
                        : 'bg-amber-900/20'
                    }`}
                  >
                    <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                      <span className={`text-base md:text-lg w-6 md:w-8 ${
                        idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-gray-300' : idx === 2 ? 'text-amber-600' : 'text-amber-500'
                      }`}>
                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}.`}
                      </span>
                      <span className="text-amber-200 truncate text-sm md:text-base">{entry.name}</span>
                    </div>
                    <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                      <span className="text-yellow-400 text-sm md:text-base tabular-nums">{entry.score}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          <motion.div
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="flex justify-center gap-3 md:gap-4 text-3xl md:text-4xl mt-6 md:mt-8"
          >
            <span>🏺</span>
            <span>⚱️</span>
            <span>👑</span>
            <span>✨</span>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
