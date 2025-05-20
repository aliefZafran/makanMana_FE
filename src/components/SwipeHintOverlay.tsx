import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import { useAtom } from 'jotai';
import { currentIndexAtom } from '@/atoms/restaurantAtoms';
import cardSwipeGesture from '@/assets/cardSwipeGesture.json';

const SwipeHintOverlay = () => {
  const [showHint, setShowHint] = useState(false);
  const [currentIndex] = useAtom(currentIndexAtom);

  const [hasShown, setHasShown] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('hasSeenSwipeHint') === 'true';
    }
    return false;
  });

  useEffect(() => {
    if (currentIndex === 0 && !hasShown) {
      const timer = setTimeout(() => {
        setShowHint(true);
        setTimeout(() => {
          setShowHint(false);
          setHasShown(true);
          // Save to localStorage
          localStorage.setItem('hasSeenSwipeHint', 'true');
        }, 4000);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, hasShown]);

  if (!showHint) return null;

  return (
    <div className="absolute  h-screen inset-0 z-50 pointer-events-none flex items-center justify-center">
      <div className="flex flex-col items-center justify-center rounded-2xl p-6">
        <Lottie
          animationData={cardSwipeGesture}
          loop={true}
          style={{ width: 500, height: 350 }}
        />
      </div>
    </div>
  );
};

export default SwipeHintOverlay;