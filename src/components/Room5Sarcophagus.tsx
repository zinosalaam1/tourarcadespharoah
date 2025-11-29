import { useState } from 'react';
import { motion } from 'motion/react';
import { Sun, Sparkles } from 'lucide-react';

interface Room5SarcophagusProps {
  onComplete: (points: number) => void;
  onAttempt: () => void;
}

type Phase = 'dusk' | 'midnight' | 'dawn' | 'zenith' | 'rebirth';

const PHASES: { id: Phase; symbol: string; label: string; angle: number }[] = [
  { id: 'dusk', symbol: '🌆', label: 'Dusk', angle: 0 },
  { id: 'midnight', symbol: '🌃', label: 'Midnight', angle: 72 },
  { id: 'dawn', symbol: '🌅', label: 'Dawn', angle: 144 },
  { id: 'zenith', symbol: '☀️', label: 'Zenith', angle: 216 },
  { id: 'rebirth', symbol: '🌄', label: 'Rebirth', angle: 288 },
];

const SOLUTION: Phase[] = ['dusk', 'midnight', 'dawn', 'zenith', 'rebirth'];
const BASE_POINTS = 1500;

export function Room5Sarcophagus({ onComplete, onAttempt }: Room5SarcophagusProps) {
  const [sequence, setSequence] = useState<Phase[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [error, setError] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const selectPhase = (phase: Phase) => {
    if (sequence.includes(phase)) return;

    const newSequence = [...sequence, phase];
    setSequence(newSequence);
    setError(false);

    if (newSequence.length === 5) {
      checkSolution(newSequence);
    }
  };

  const checkSolution = (seq: Phase[]) => {
    const isCorrect = seq.every((phase, idx) => phase === SOLUTION[idx]);

    if (isCorrect) {
      const hintPenalty = showHint ? 300 : 0;
      const attemptPenalty = attempts * 150;
      const points = Math.max(BASE_POINTS - hintPenalty - attemptPenalty, 200);
      setTimeout(() => onComplete(points), 2000);
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
        className="max-w-5xl mx-auto w-full"
      >
        <div className="text-center mb-6 md:mb-8">
          <motion.div 
            className="text-4xl md:text-5xl mb-3 md:mb-4"
            animate={{ 
              scale: [1, 1.1, 1],
              rotateY: [0, 10, -10, 0]
            }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            ⚰️
          </motion.div>
          <h2 className="text-amber-200 mb-3 md:mb-4 text-xl md:text-3xl px-2">ROOM 5: The Sarcophagus Seal</h2>
          <p className="text-amber-400 mb-4 md:mb-6 text-sm md:text-base px-2">
            Complete the sun's journey to break the final seal
          </p>
        </div>

        {/* Clue */}
        <div className="bg-amber-950/50 border-2 border-amber-600 rounded-lg p-4 md:p-6 mb-6 md:mb-8">
          <p className="text-amber-200 italic text-center mb-3 md:mb-4 text-sm md:text-base px-2">
            "Return the sun to where it was taken.
            <br />
            In darkness it sleeps; at dawn it rises."
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
              The curse began at dusk. Trace the sun's complete journey through the underworld to rebirth...
            </motion.p>
          )}
        </div>

        {/* Sarcophagus chamber */}
        <div className="relative bg-gradient-to-b from-amber-950 via-orange-950 to-amber-950 border-2 md:border-4 border-amber-700 rounded-lg p-4 md:p-8 mb-6 md:mb-8">
          {/* Center sarcophagus */}
          <div className="flex justify-center mb-6 md:mb-8">
            <motion.div
              animate={
                sequence.length === 5 && !error
                  ? { scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }
                  : {}
              }
              transition={{ duration: 2, repeat: sequence.length === 5 && !error ? Infinity : 0 }}
              className={`text-5xl md:text-8xl ${sequence.length === 5 && !error ? 'filter brightness-150' : ''}`}
            >
              ⚰️
            </motion.div>
          </div>

          {/* Pillars arranged in circle */}
          <div className="relative h-64 md:h-96 max-w-xs md:max-w-3xl mx-auto">
            {PHASES.map((phase, idx) => {
              const isSelected = sequence.includes(phase.id);
              const order = sequence.indexOf(phase.id);
              const radius = 160;
              const angleRad = (phase.angle * Math.PI) / 180;
              const x = 50 + (radius / 3) * Math.cos(angleRad);
              const y = 50 + (radius / 3) * Math.sin(angleRad);

              return (
                <button
                  key={phase.id}
                  onClick={() => selectPhase(phase.id)}
                  disabled={isSelected}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  <motion.div
                    animate={error && isSelected ? { x: [-5, 5, -5, 5, 0] } : {}}
                    className={`w-16 h-24 md:w-24 md:h-32 border-2 md:border-4 rounded-lg flex flex-col items-center justify-center gap-1 md:gap-2 transition-all ${
                      isSelected
                        ? error
                          ? 'border-red-600 bg-red-950/50'
                          : sequence.length === 5
                          ? 'border-green-600 bg-green-950/50'
                          : 'border-yellow-600 bg-yellow-950/50'
                        : 'border-amber-600 bg-amber-950/50 hover:bg-amber-900/50'
                    }`}
                  >
                    <Sun className={`${isSelected ? 'text-yellow-400' : 'text-amber-500'} w-4 h-4 md:w-6 md:h-6`} />
                    <div className="text-2xl md:text-3xl">{phase.symbol}</div>
                    <div className="text-amber-200 text-xs text-center px-1">{phase.label}</div>
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 md:-top-3 md:-right-3 w-6 h-6 md:w-8 md:h-8 rounded-full bg-amber-600 text-amber-950 text-xs md:text-sm flex items-center justify-center">
                        {order + 1}
                      </div>
                    )}
                  </motion.div>
                </button>
              );
            })}

            {/* Light beam effect when complete */}
            {sequence.length === 5 && !error && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0.5, 1, 0.5], scale: 1 }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <div className="w-32 h-32 rounded-full bg-yellow-400/30 blur-2xl"></div>
              </motion.div>
            )}
          </div>

          {sequence.length === 5 && !error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-6 md:mt-8 text-green-400 flex items-center justify-center gap-2 text-base md:text-xl"
            >
              <Sparkles size={20} />
              <span>The Seal Breaks! The Sun Returns!</span>
              <Sparkles size={20} />
            </motion.div>
          )}
        </div>

        {/* Sequence indicator */}
        <div className="flex justify-center gap-2 md:gap-3 mb-4 md:mb-6">
          {[0, 1, 2, 3, 4].map((idx) => (
            <div
              key={idx}
              className={`w-12 h-12 md:w-16 md:h-16 border-2 md:border-4 rounded-lg flex items-center justify-center text-xl md:text-2xl ${
                error
                  ? 'border-red-600 bg-red-950/50'
                  : sequence.length === 5 && !error
                  ? 'border-green-600 bg-green-950/50'
                  : 'border-amber-600 bg-amber-950/50'
              }`}
            >
              {sequence[idx] ? PHASES.find(p => p.id === sequence[idx])?.symbol : ''}
            </div>
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
