import { useState } from 'react';
import { motion } from 'motion/react';
import { User, ArrowRight } from 'lucide-react';

interface UsernameScreenProps {
  onSubmit: (username: string) => void;
}

export function UsernameScreen({ onSubmit }: UsernameScreenProps) {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSubmit(username.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl w-full mx-auto"
      >
        {/* Animated hieroglyphs */}
        <div className="flex justify-center gap-8 mb-12">
          {['🏺', '⚱️', '👑', '🧿', '🔥'].map((emoji, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: -20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                delay: idx * 0.1,
                rotate: {
                  delay: 1 + idx * 0.2,
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              className="text-5xl"
            >
              {emoji}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              filter: ['brightness(1)', 'brightness(1.3)', 'brightness(1)']
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-8xl mb-6"
          >
            🏺
          </motion.div>
          
          <h1 className="text-amber-200 mb-4">
            Welcome, Adventurer
          </h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-amber-400 text-xl"
          >
            Enter your name to begin your journey into the tomb
          </motion.p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500">
              <User size={24} />
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your name..."
              maxLength={20}
              className="w-full bg-amber-950/50 border-2 border-amber-600 rounded-lg px-12 py-4 text-amber-100 placeholder-amber-700 focus:outline-none focus:border-amber-400 transition-colors text-xl"
              autoFocus
            />
            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 border-2 border-amber-400 rounded-lg pointer-events-none"
              style={{ opacity: username ? 0 : undefined }}
            />
          </div>

          <motion.button
            type="submit"
            disabled={!username.trim()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 disabled:from-amber-900 disabled:to-amber-950 text-amber-950 disabled:text-amber-700 py-4 rounded-lg transition-all flex items-center justify-center gap-3 text-xl disabled:cursor-not-allowed border-2 border-amber-500 disabled:border-amber-800"
          >
            <span>Enter the Tomb</span>
            <ArrowRight size={24} />
          </motion.button>
        </motion.form>

        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 1.2 }}
          className="mt-12 flex justify-center gap-4 text-4xl"
        >
          {['🐫', '🌴', '⚱️', '🌴', '🐫'].map((emoji, idx) => (
            <motion.span
              key={idx}
              animate={{ 
                y: [0, -10, 0],
              }}
              transition={{
                delay: idx * 0.2,
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {emoji}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
