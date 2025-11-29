import { useState } from 'react';
import { motion } from 'motion/react';
import { Scale, Sparkles } from 'lucide-react';

interface Room3ScaleProps {
  onComplete: (points: number) => void;
  onAttempt: () => void;
}

type Token = 'feather' | 'scarab' | 'crook' | 'flail' | 'moon' | 'serpent' | 'lotus';

const TOKENS: { id: Token; symbol: string; name: string; weight: number }[] = [
  { id: 'feather', symbol: '🪶', name: 'Feather', weight: 1 },
  { id: 'scarab', symbol: '🪲', name: 'Scarab', weight: 3 },
  { id: 'crook', symbol: '🏑', name: 'Crook', weight: 5 },
  { id: 'flail', symbol: '⚔️', name: 'Flail', weight: 4 },
  { id: 'moon', symbol: '🌙', name: 'Moon', weight: 3 },
  { id: 'serpent', symbol: '🐍', name: 'Serpent', weight: 6 },
  { id: 'lotus', symbol: '🪷', name: 'Lotus', weight: 2 },
];

const BASE_POINTS = 1000;

export function Room3Scale({ onComplete, onAttempt }: Room3ScaleProps) {
  const [leftSide, setLeftSide] = useState<Token[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const addToScale = (token: Token) => {
    if (leftSide.includes(token) || token === 'moon') return;
    setLeftSide([...leftSide, token]);
    setHasChecked(false);
  };

  const removeFromScale = (token: Token) => {
    setLeftSide(leftSide.filter(t => t !== token));
    setHasChecked(false);
  };

  const checkBalance = () => {
    setHasChecked(true);
    const leftWeight = leftSide.reduce((sum, token) => {
      const t = TOKENS.find(tk => tk.id === token);
      return sum + (t?.weight || 0);
    }, 0);

    const moonWeight = TOKENS.find(t => t.id === 'moon')?.weight || 0;

    if (leftWeight === moonWeight) {
      const hintPenalty = showHint ? 200 : 0;
      const attemptPenalty = attempts * 100;
      const points = Math.max(BASE_POINTS - hintPenalty - attemptPenalty, 100);
      setTimeout(() => onComplete(points), 1500);
    } else {
      setAttempts(prev => prev + 1);
      onAttempt();
    }
  };

  const leftWeight = leftSide.reduce((sum, token) => {
    const t = TOKENS.find(tk => tk.id === token);
    return sum + (t?.weight || 0);
  }, 0);

  const moonWeight = TOKENS.find(t => t.id === 'moon')?.weight || 0;
  const isBalanced = leftWeight === moonWeight;
  const tilt = hasChecked ? (leftWeight > moonWeight ? 'left-heavy' : leftWeight < moonWeight ? 'right-heavy' : 'balanced') : 'neutral';

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto w-full"
      >
        <div className="text-center mb-6 md:mb-8">
          <motion.div 
            className="text-4xl md:text-5xl mb-3 md:mb-4"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.15, 1]
            }}
            transition={{ 
              rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
              scale: { duration: 4, repeat: Infinity }
            }}
          >
            🌙
          </motion.div>
          <h2 className="text-amber-200 mb-3 md:mb-4 text-xl md:text-3xl px-2">ROOM 3: The Lunar Weighing Scale</h2>
          <p className="text-amber-400 mb-4 md:mb-6 text-sm md:text-base px-2">
            Balance the scale to match the moon's weight
          </p>
        </div>

        {/* Clue */}
        <div className="bg-amber-950/50 border-2 border-amber-600 rounded-lg p-4 md:p-6 mb-6 md:mb-8">
          <p className="text-amber-200 italic text-center mb-3 md:mb-4 text-sm md:text-base px-2">
            "Only the light may rise.
            <br />
            The moon accepts no burden greater than itself."
          </p>
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-amber-500 hover:text-amber-400 text-xs md:text-sm mx-auto block"
          >
            {showHint ? 'Hide Hint' : 'Show Hint'}
          </button>
          {showHint && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="text-amber-400 text-xs md:text-sm mt-3 md:mt-4 text-center px-2"
            >
              Find the lightest tokens that equal the moon's weight. Feather is the lightest...
            </motion.p>
          )}
        </div>

        {/* Scale visualization */}
        <div className="mb-6 md:mb-8">
          <div className="relative h-48 md:h-64 flex items-end justify-center mb-4">
            {/* Scale base */}
            <div className="absolute bottom-0 w-16 md:w-24 h-24 md:h-32 bg-amber-800 border-2 border-amber-600"></div>
            
            {/* Scale beam */}
            <motion.div
              animate={{
                rotate: tilt === 'left-heavy' ? -15 : tilt === 'right-heavy' ? 15 : 0
              }}
              className="absolute bottom-24 md:bottom-32 w-72 md:w-96 h-3 md:h-4 bg-amber-700 border-2 border-amber-600"
            >
              {/* Left pan */}
              <motion.div
                className={`absolute -left-2 md:-left-4 top-3 md:top-4 w-24 md:w-32 h-20 md:h-24 border-2 md:border-4 rounded-lg flex flex-wrap items-center justify-center gap-1 p-1 md:p-2 ${
                  hasChecked && isBalanced
                    ? 'bg-green-950/50 border-green-600'
                    : 'bg-amber-950/50 border-amber-600'
                }`}
              >
                {leftSide.map((token, idx) => (
                  <button
                    key={idx}
                    onClick={() => removeFromScale(token)}
                    className="text-xl md:text-2xl hover:scale-110 transition-transform"
                  >
                    {TOKENS.find(t => t.id === token)?.symbol}
                  </button>
                ))}
              </motion.div>

              {/* Right pan (moon) */}
              <div className={`absolute -right-2 md:-right-4 top-3 md:top-4 w-24 md:w-32 h-20 md:h-24 border-2 md:border-4 rounded-lg flex items-center justify-center ${
                hasChecked && isBalanced
                  ? 'bg-green-950/50 border-green-600'
                  : 'bg-amber-950/50 border-amber-600'
              }`}>
                <div className="text-4xl md:text-5xl">🌙</div>
              </div>
            </motion.div>

            {/* Anubis statue */}
            <div className="absolute -bottom-6 md:-bottom-8 text-4xl md:text-6xl">⚖️</div>
          </div>

          {hasChecked && (
            <div className="text-center mb-4">
              {isBalanced ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-green-400 flex items-center justify-center gap-2"
                >
                  <Sparkles size={20} />
                  <span>Perfect Balance! Advancing...</span>
                  <Sparkles size={20} />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400"
                >
                  {leftWeight > moonWeight ? 'Too heavy!' : 'Too light!'}
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Token selection */}
        <div className="grid grid-cols-3 md:grid-cols-7 gap-2 md:gap-3 mb-4 md:mb-6">
          {TOKENS.map((token) => {
            const isOnScale = leftSide.includes(token.id);
            const isMoon = token.id === 'moon';
            
            return (
              <button
                key={token.id}
                onClick={() => !isMoon && addToScale(token.id)}
                disabled={isOnScale || isMoon}
                className={`p-2 md:p-4 border-2 rounded-lg transition-all ${
                  isMoon
                    ? 'bg-amber-900/30 border-amber-700 opacity-50 cursor-not-allowed'
                    : isOnScale
                    ? 'bg-amber-950 border-amber-800 opacity-50'
                    : 'bg-amber-800 border-amber-600 hover:bg-amber-700'
                }`}
              >
                <div className="text-2xl md:text-3xl mb-1">{token.symbol}</div>
                <div className="text-amber-200 text-xs">{token.name}</div>
              </button>
            );
          })}
        </div>

        <div className="flex justify-center gap-3 md:gap-4">
          <button
            onClick={() => setLeftSide([])}
            className="px-4 md:px-6 py-2 bg-amber-950 border-2 border-amber-600 text-amber-300 rounded-lg hover:bg-amber-900 transition-colors text-sm md:text-base"
          >
            Clear Scale
          </button>
          <button
            onClick={checkBalance}
            disabled={leftSide.length === 0}
            className="px-4 md:px-6 py-2 bg-amber-600 hover:bg-amber-500 disabled:bg-amber-900 disabled:opacity-50 text-amber-950 rounded-lg transition-colors text-sm md:text-base"
          >
            Check Balance
          </button>
        </div>
      </motion.div>
    </div>
  );
}
