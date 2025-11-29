import { motion } from 'motion/react';

interface IntroScreenProps {
  username: string;
  onStart: () => void;
}

export function IntroScreen({ username, onStart }: IntroScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-3xl mx-auto text-center"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 150 }}
          className="text-8xl mb-8"
        >
          🏺
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-amber-400 mb-4 text-xl"
        >
          Welcome, <span className="text-yellow-400">{username}</span>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-amber-200 mb-6"
        >
          THE PHARAOH'S CURSE
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mb-12"
        >
          <p className="text-amber-300 mb-6 text-xl">
            You enter the lost tomb of Pharaoh Khamet-Ren.
          </p>
          
          <div className="bg-amber-950/50 border-2 border-amber-600 rounded-lg p-8 mb-8 max-w-2xl mx-auto">
            <p className="text-amber-200 italic text-xl leading-relaxed">
              "He who disturbs my rest must set the sun right.
              <br />
              Unseal the five seals before sunrise."
            </p>
          </div>

          <p className="text-amber-400 mb-4">
            A golden hourglass starts counting down.
          </p>
          <p className="text-amber-500">
            The first chamber opens...
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          onClick={onStart}
          className="px-12 py-4 bg-amber-600 hover:bg-amber-500 text-amber-950 rounded-lg transition-all transform hover:scale-105 text-xl"
        >
          Enter the Tomb
        </motion.button>
      </motion.div>
    </div>
  );
}
