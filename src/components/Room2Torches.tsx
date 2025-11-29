import { useState } from 'react';
import { motion } from 'motion/react';
import { Flame, Sparkles } from 'lucide-react';

interface Room2TorchesProps {
  onComplete: (points: number) => void;
  onAttempt: () => void;
}

type Direction = 'east' | 'south' | 'west' | 'north';

const BRAZIERS: { id: Direction; label: string; position: string }[] = [
  { id: 'east', label: 'East', position: 'top-1/2 right-4 -translate-y-1/2' },
  { id: 'south', label: 'South', position: 'bottom-4 left-1/2 -translate-x-1/2' },
  { id: 'west', label: 'West', position: 'top-1/2 left-4 -translate-y-1/2' },
  { id: 'north', label: 'North', position: 'top-4 left-1/2 -translate-x-1/2' },
];

const SOLUTION: Direction[] = ['east', 'south', 'west', 'north'];
const BASE_POINTS = 1000;

export function Room2Torches({ onComplete, onAttempt }: Room2TorchesProps) {
  const [litBraziers, setLitBraziers] = useState<Direction[]>([]);
  const [error, setError] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const lightBrazier = (direction: Direction) => {
    if (litBraziers.includes(direction)) return;

    const newLit = [...litBraziers, direction];
    setLitBraziers(newLit);
    setError(false);

    // Check if current sequence matches solution so far
    const isCorrect = newLit.every((dir, idx) => dir === SOLUTION[idx]);

    if (!isCorrect) {
      setAttempts(prev => prev + 1);
      onAttempt();
      setError(true);
      setTimeout(() => {
        setLitBraziers([]);
        setError(false);
      }, 1500);
    } else if (newLit.length === 4) {
      const hintPenalty = showHint ? 200 : 0;
      const attemptPenalty = attempts * 100;
      const points = Math.max(BASE_POINTS - hintPenalty - attemptPenalty, 100);
      setTimeout(() => onComplete(points), 1500);
    }
  };

  const reset = () => {
    setLitBraziers([]);
    setError(false);
  };

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
              scale: [1, 1.2, 1],
              filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)']
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🔥
          </motion.div>
          <h2 className="text-amber-200 mb-3 md:mb-4 text-xl md:text-3xl px-2">ROOM 2: The Torch of the Four Winds</h2>
          <p className="text-amber-400 mb-4 md:mb-6 text-sm md:text-base px-2">
            Light the braziers in the correct order
          </p>
        </div>

        {/* Clue */}
        <div className="bg-amber-950/50 border-2 border-amber-600 rounded-lg p-4 md:p-6 mb-6 md:mb-8">
          <p className="text-amber-200 italic text-center mb-3 md:mb-4 text-sm md:text-base px-2">
            "The sun rises where life begins, dies where the shadow swallows it.
            <br />
            Warm the path it walks."
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
              The sun rises in the East and sets in the West. Follow its clockwise journey...
            </motion.p>
          )}
        </div>

        {/* Brazier chamber */}
        <div className="relative bg-amber-900/30 border-2 md:border-4 border-amber-700 rounded-lg aspect-square max-w-sm md:max-w-xl mx-auto mb-6 md:mb-8">
          {/* Center statue */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl md:text-6xl">
            🐺
          </div>

          {/* Braziers */}
          {BRAZIERS.map((brazier, idx) => {
            const isLit = litBraziers.includes(brazier.id);
            const order = litBraziers.indexOf(brazier.id);
            
            return (
              <button
                key={brazier.id}
                onClick={() => lightBrazier(brazier.id)}
                disabled={isLit || error}
                className={`absolute ${brazier.position} flex flex-col items-center gap-1 md:gap-2`}
              >
                <motion.div
                  animate={error && isLit ? { x: [-5, 5, -5, 5, 0] } : {}}
                  className={`w-14 h-14 md:w-20 md:h-20 rounded-full border-2 md:border-4 flex items-center justify-center transition-all ${
                    isLit
                      ? error
                        ? 'border-red-600 bg-red-950/50'
                        : litBraziers.length === 4
                        ? 'border-green-600 bg-green-950/50'
                        : 'border-orange-600 bg-orange-950/50'
                      : 'border-amber-600 bg-amber-950/50 hover:bg-amber-900/50'
                  }`}
                >
                  {isLit ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="relative"
                    >
                      <Flame className="text-orange-400 w-6 h-6 md:w-8 md:h-8" />
                      <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="absolute inset-0 blur-sm"
                      >
                        <Flame className="text-yellow-400 w-6 h-6 md:w-8 md:h-8" />
                      </motion.div>
                    </motion.div>
                  ) : (
                    <Flame className="text-amber-700 w-6 h-6 md:w-8 md:h-8" />
                  )}
                </motion.div>
                <div className="text-amber-300 text-xs md:text-sm">{brazier.label}</div>
                {isLit && (
                  <div className="text-amber-400 text-xs">#{order + 1}</div>
                )}
              </button>
            );
          })}

          {litBraziers.length === 4 && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 text-green-400 flex items-center gap-2 text-sm md:text-base"
            >
              <Sparkles size={16} />
              <span>Path Lit! Advancing...</span>
              <Sparkles size={16} />
            </motion.div>
          )}
        </div>

        <div className="flex justify-center">
          <button
            onClick={reset}
            className="px-4 md:px-6 py-2 bg-amber-950 border-2 border-amber-600 text-amber-300 rounded-lg hover:bg-amber-900 transition-colors text-sm md:text-base"
          >
            Extinguish All
          </button>
        </div>
      </motion.div>
    </div>
  );
}
