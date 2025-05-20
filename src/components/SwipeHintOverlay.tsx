import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import { useAtom } from "jotai";
import cardSwipeGesture from "@/assets/cardSwipeGesture.json";
import { userLocationAtom } from "@/atoms/userLocationAtom";

const SwipeHintOverlay = () => {
  const [userLocation] = useAtom(userLocationAtom);
  const [showHint, setShowHint] = useState(false);

  const IDLE_TIME = 6000;
  const [idleTimer, setIdleTimer] = useState<NodeJS.Timeout | null>(null);

    const [hasShown, setHasShown] = useState(() => {
      if (typeof window !== "undefined") {
        return localStorage.getItem("hasSeenSwipeHint") === "true";
      }
      return false;
    });


  // Reset idle timer on user interaction
  const resetIdleTimer = () => {
    if (idleTimer) clearTimeout(idleTimer);
    setShowHint(false);

    // Only set a new timer if we're on the first card and hint hasn't been shown
    if (userLocation && !hasShown) {
      const timer = setTimeout(() => {
        setShowHint(true);
        // Auto-hide after few seconds
        setTimeout(() => {
          setShowHint(false);
          setHasShown(true);
            localStorage.setItem("hasSeenSwipeHint", "true");
        }, 9000);
      }, IDLE_TIME);

      setIdleTimer(timer);
    }
  };

  useEffect(() => {
    if (!hasShown) {
      if (!userLocation) return;
      // Set up event listeners for user activity
      const events = [
        "mousemove",
        "mousedown",
        "keydown",
        "touchstart",
        "scroll",
      ];
      events.forEach((event) => {
        window.addEventListener(event, resetIdleTimer);
        console.log("event triggered:", event);
      });

      // Initial timer setup
      resetIdleTimer();

      // Clean up
      return () => {
        events.forEach((event) => {
          window.removeEventListener(event, resetIdleTimer);
        });
        if (idleTimer) clearTimeout(idleTimer);
      };
    } else {
      setShowHint(false);
    }
  }, [hasShown]);

  if (!showHint) return null;

  return (
    <>
      {showHint ? (
        <div className="absolute  h-screen inset-0 z-50 pointer-events-none flex items-center justify-center">
          <div className="flex flex-col items-center justify-center rounded-2xl p-6">
            <Lottie
              animationData={cardSwipeGesture}
              loop={true}
              style={{ width: 500, height: 350 }}
            />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default SwipeHintOverlay;
