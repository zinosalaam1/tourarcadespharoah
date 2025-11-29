import { motion } from 'motion/react';
import { Star, User } from 'lucide-react';

interface ScoreBoardProps {
  points: number;
  username: string;
}

export function ScoreBoard({ points, username }: ScoreBoardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed top-4 md:top-8 left-4 md:left-8 z-50"
    >
      <div className="bg-black/60 backdrop-blur-sm border-2 border-amber-600/50 rounded-lg p-3 md:p-4 space-y-2 md:space-y-3 min-w-[140px] md:min-w-[200px]">
        <div className="flex items-center gap-2 text-amber-300 text-sm md:text-base">
          <User size={16} className="md:w-[18px] md:h-[18px]" />
          <span className="truncate max-w-[100px] md:max-w-none">{username}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            <Star className="text-yellow-400" size={16} />
          </motion.div>
          <div className="flex-1">
            <div className="text-xs text-amber-500">Points</div>
            <motion.div
              key={points}
              initial={{ scale: 1.5, color: '#fbbf24' }}
              animate={{ scale: 1, color: '#fde68a' }}
              className="text-xl md:text-2xl text-amber-200 tabular-nums"
            >
              {points}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
