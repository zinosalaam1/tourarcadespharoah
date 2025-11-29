import { useState } from 'react';
import { motion } from 'motion/react';
import { Star, Sparkles } from 'lucide-react';

interface Room4ConstellationProps {
  onComplete: (points: number) => void;
  onAttempt: () => void;
}

type Constellation = 'orion' | 'eridanus' | 'taurus' | 'sirius' | 'draco';

const NODES: { id: number; constellation: Constellation; x: number; y: number; symbol: string }[] = [
  { id: 0, constellation: 'orion', x: 20, y: 30, symbol: '🏹' },
  { id: 1, constellation: 'eridanus', x: 40, y: 60, symbol: '〰️' },
  { id: 2, constellation: 'taurus', x: 70, y: 40, symbol: '🐂' },
  { id: 3, constellation: 'sirius', x: 30, y: 70, symbol: '🐕' },
  { id: 4, constellation: 'draco', x: 60, y: 20, symbol: '🐉' },
];

const SOLUTION: Constellation[] = ['orion', 'eridanus', 'taurus'];
const BASE_POINTS = 1000;

export function Room4Constellation({ onComplete, onAttempt }: Room4ConstellationProps) {
  const [selectedPath, setSelectedPath] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [error, setError] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const selectNode = (nodeId: number) => {
    if (selectedPath.includes(nodeId)) return;

    const newPath = [...selectedPath, nodeId];
    setSelectedPath(newPath);
    setError(false);

    if (newPath.length === 3) {
      checkSolution(newPath);
    }
  };

  const checkSolution = (path: number[]) => {
    const constellations = path.map(id => NODES.find(n => n.id === id)?.constellation);
    const isCorrect = constellations.every((c, idx) => c === SOLUTION[idx]);

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
        setSelectedPath([]);
        setError(false);
      }, 1500);
    }
  };

  const reset = () => {
    setSelectedPath([]);
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
              rotate: [0, 20, -20, 0],
              y: [0, -10, 0]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            🗝️
          </motion.div>
          <h2 className="text-amber-200 mb-3 md:mb-4 text-xl md:text-3xl px-2">ROOM 4: The Constellation Door</h2>
          <p className="text-amber-400 mb-4 md:mb-6 text-sm md:text-base px-2">
            Align the stars to unlock the path
          </p>
        </div>

        {/* Clue */}
        <div className="bg-amber-950/50 border-2 border-amber-600 rounded-lg p-4 md:p-6 mb-6 md:mb-8">
          <p className="text-amber-200 italic text-center mb-3 md:mb-4 text-sm md:text-base px-2">
            "Follow the hunter, then the river,
            <br />
            and the sacred bull shall part the gate."
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
              This is easy fam
            </motion.p>
          )}
        </div>

        {/* Star field */}
        <div className="relative bg-gradient-to-b from-indigo-950 to-purple-950 border-2 md:border-4 border-amber-700 rounded-lg aspect-square max-w-sm md:max-w-2xl mx-auto mb-6 md:mb-8 overflow-hidden">
          {/* Background stars */}
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}

          {/* Constellation nodes */}
          {NODES.map((node, idx) => {
            const isSelected = selectedPath.includes(node.id);
            const order = selectedPath.indexOf(node.id);

            return (
              <button
                key={node.id}
                onClick={() => selectNode(node.id)}
                disabled={isSelected}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
              >
                <motion.div
                  animate={error && isSelected ? { scale: [1, 1.2, 1] } : {}}
                  className={`relative w-14 h-14 md:w-20 md:h-20 rounded-full border-2 md:border-4 flex flex-col items-center justify-center transition-all ${
                    isSelected
                      ? error
                        ? 'border-red-600 bg-red-950/50'
                        : selectedPath.length === 3
                        ? 'border-green-600 bg-green-950/50'
                        : 'border-yellow-400 bg-yellow-950/50'
                      : 'border-amber-600 bg-amber-950/30 hover:bg-amber-900/50'
                  }`}
                >
                  <Star className={`${isSelected ? 'text-yellow-400' : 'text-amber-500'} w-4 h-4 md:w-6 md:h-6`} />
                  <div className="text-lg md:text-2xl mt-1">{node.symbol}</div>
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-5 h-5 md:w-6 md:h-6 rounded-full bg-amber-600 text-amber-950 text-xs flex items-center justify-center">
                      {order + 1}
                    </div>
                  )}
                </motion.div>
              </button>
            );
          })}

          {/* Path lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {selectedPath.slice(0, -1).map((nodeId, idx) => {
              const node1 = NODES.find(n => n.id === nodeId);
              const node2 = NODES.find(n => n.id === selectedPath[idx + 1]);
              if (!node1 || !node2) return null;

              return (
                <motion.line
                  key={`${nodeId}-${selectedPath[idx + 1]}`}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  x1={`${node1.x}%`}
                  y1={`${node1.y}%`}
                  x2={`${node2.x}%`}
                  y2={`${node2.y}%`}
                  stroke={error ? '#dc2626' : selectedPath.length === 3 ? '#16a34a' : '#fbbf24'}
                  strokeWidth="3"
                  strokeDasharray="5,5"
                />
              );
            })}
          </svg>

          {selectedPath.length === 3 && !error && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-green-400 bg-green-950/80 px-6 py-3 rounded-lg border-2 border-green-600 flex items-center gap-2"
            >
              <Sparkles size={20} />
              <span>Gate Opening! Advancing...</span>
              <Sparkles size={20} />
            </motion.div>
          )}
        </div>

        <div className="flex justify-center">
          <button
            onClick={reset}
            className="px-4 md:px-6 py-2 bg-amber-950 border-2 border-amber-600 text-amber-300 rounded-lg hover:bg-amber-900 transition-colors text-sm md:text-base"
          >
            Reset Path
          </button>
        </div>
      </motion.div>
    </div>
  );
}
