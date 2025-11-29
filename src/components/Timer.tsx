import { Hourglass } from 'lucide-react';

interface TimerProps {
  timeLeft: number;
}

export function Timer({ timeLeft }: TimerProps) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isUrgent = timeLeft < 120; // Last 2 minutes

  return (
    <div className="fixed top-4 md:top-8 right-4 md:right-8 z-50">
      <div className={`flex items-center gap-2 md:gap-3 px-3 md:px-6 py-2 md:py-3 rounded-lg border-2 ${
        isUrgent 
          ? 'bg-red-950 border-red-600 animate-pulse' 
          : 'bg-amber-950 border-amber-600'
      }`}>
        <Hourglass className={`${isUrgent ? 'text-red-400' : 'text-amber-400'}`} size={20} />
        <div className={`text-lg md:text-2xl font-mono ${isUrgent ? 'text-red-200' : 'text-amber-200'}`}>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
      </div>
    </div>
  );
}
