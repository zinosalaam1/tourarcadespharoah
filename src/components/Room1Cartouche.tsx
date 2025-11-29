import { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface Room1CartoucheProps {
  onComplete: (points: number) => void;
  onAttempt: () => void;
}

type Glyph = 'river' | 'desert' | 'eye' | 'ankh' | 'scarab' | 'crown';

const GLYPHS: { id: Glyph; symbol: string; name: string }[] = [
  { id: 'river', symbol: '〰️', name: 'River' },
  { id: 'desert', symbol: '🏜️', name: 'Desert' },
  { id: 'eye', symbol: '👁️', name: 'Eye of Horus' },
  { id: 'ankh', symbol: '☥', name: 'Ankh' },
  { id: 'scarab', symbol: '🪲', name: 'Scarab' },
  { id: 'crown', symbol: '👑', name: 'Crown' },
];

const SOLUTION: Glyph[] = ['river', 'desert', 'eye', 'ankh', 'ankh', 'crown'];
const BASE_POINTS = 1000;

export function Room1Cartouche({ onComplete, onAttempt }: Room1CartoucheProps) {
  const [sequence, setSequence] = useState<Glyph[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [error, setError] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const addGlyph = (glyph: Glyph) => {
    if (sequence.length >= 6) return;
    
    const newSequence = [...sequence, glyph];
    setSequence(newSequence);
    setError(false);

    if (newSequence.length === 6) {
      checkSolution(newSequence);
    }
  };

  const checkSolution = (seq: Glyph[]) => {
    const isCorrect = seq.every((glyph, idx) => glyph === SOLUTION[idx]);
    
    if (isCorrect) {
      const hintPenalty = showHint ? 200 : 0;
      const attemptPenalty = attempts * 100;
      const points = Math.max(BASE_POINTS - hintPenalty - attemptPenalty, 100);
      setTimeout(() => onComplete(points), 1500);
    } else {
      setAttempts(prev => prev + 1);
      onAttempt();
      setError(true);
      setTimeout(() => {
        setSequence([]);
        setError(false);
      }, 1500);
    }
  };

  const reset = () => {
    setSequence([]);
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
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🧿
          </motion.div>
          <h2 className="text-amber-200 mb-3 md:mb-4 text-xl md:text-3xl px-2">ROOM 1: The Cartouche Cipher</h2>
          <p className="text-amber-400 mb-4 md:mb-6 text-sm md:text-base px-2">
            Solve the ancient riddle to unlock the first seal
          </p>
        </div>

        {/* Clue */}
        <div className="bg-amber-950/50 border-2 border-amber-600 rounded-lg p-4 md:p-6 mb-6 md:mb-8">
          <p className="text-amber-200 italic text-center mb-3 md:mb-4 text-sm md:text-base px-2">
            "First of the Nile, last of the sand.
            <br />
            The twice-turned eye guards the pair."
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
              No Hint😂
            </motion.p>
          )}
        </div>

        {/* Cartouche slots */}
        <div className="bg-amber-900/30 border-4 border-amber-700 rounded-lg p-4 md:p-8 mb-6 md:mb-8">
          <div className="flex justify-center gap-2 md:gap-3 mb-4 md:mb-6">
            {[0, 1, 2, 3, 4, 5].map((idx) => (
              <motion.div
                key={idx}
                initial={{ scale: 0 }}
                animate={error ? { x: [-10, 10, -10, 10, 0], scale: 1 } : { scale: 1 }}
                transition={error ? { duration: 0.4 } : { delay: 0.3 + idx * 0.05 }}
                className={`w-12 h-12 md:w-20 md:h-20 border-2 md:border-4 rounded-lg flex items-center justify-center text-2xl md:text-3xl ${
                  error
                    ? 'border-red-600 bg-red-950/50'
                    : sequence.length === 6 && !error
                    ? 'border-green-600 bg-green-950/50'
                    : 'border-amber-600 bg-amber-950/50'
                }`}
              >
                {sequence[idx] ? GLYPHS.find(g => g.id === sequence[idx])?.symbol : ''}
              </motion.div>
            ))}
          </div>

          {sequence.length === 6 && !error && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-center text-green-400 flex items-center justify-center gap-2 text-sm md:text-base"
            >
              <Sparkles size={16} />
              <span>Seal Broken! Advancing...</span>
              <Sparkles size={16} />
            </motion.div>
          )}
        </div>

        {/* Glyph selection */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4 mb-4 md:mb-6">
          {GLYPHS.map((glyph, index) => (
            <motion.button
              key={glyph.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6 + index * 0.05 }}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => addGlyph(glyph.id)}
              disabled={sequence.length >= 6 || error}
              className="bg-amber-800 hover:bg-amber-700 disabled:bg-amber-900 disabled:opacity-50 border-2 border-amber-600 rounded-lg p-2 md:p-4 transition-colors"
            >
              <div className="text-2xl md:text-3xl mb-1 md:mb-2">{glyph.symbol}</div>
              <div className="text-amber-200 text-xs md:text-sm">{glyph.name}</div>
            </motion.button>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={reset}
            className="px-4 md:px-6 py-2 bg-amber-950 border-2 border-amber-600 text-amber-300 rounded-lg hover:bg-amber-900 transition-colors text-sm md:text-base"
          >
            Reset Sequence
          </button>
        </div>
      </motion.div>
    </div>
  );
}
