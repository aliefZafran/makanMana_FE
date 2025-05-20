import Confetti from "react-confetti";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { spotlightRestaurantAtom } from "@/atoms/restaurantAtoms";

export default function SpotlightView() {
  const [showConfetti, setShowConfetti] = useState(true);
  const [confettiVisible, setConfettiVisible] = useState(true);

  const [restaurant, setSpotlightRestaurant] = useAtom(spotlightRestaurantAtom);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setConfettiVisible(false); 
      setTimeout(() => setShowConfetti(false), 8000);
    }, 2500);
    return () => clearTimeout(timeout);
  }, []);

  if (!restaurant) return null;

  return (
    <div className="flex flex-col items-center justify-center py-16 animate-slide-up">
      {showConfetti && (
        <div
          className={`fixed z-50 pointer-events-none transition-opacity duration-7000 ease-out ${
            confettiVisible ? "opacity-100" : "opacity-0" }`}
          style={{
            top: "-300px",
            left: "-600px",
            width: "calc(100vw + 600px)",
            height: "calc(100vh + 300px)",
          }}
        >
          
          <Confetti
            width={window.innerWidth + 200}
            height={window.innerHeight + 100}
            gravity={0.2}
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
            }}
          />
        </div>
      )}

      <div
      style={{
        backgroundImage: `url(${restaurant.photo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
       className="relative flex flex-col items-center justify-between text-gray-700 text-center p-6 rounded-xl  w-60 md:w-76 h-90 md:h-100 shadow-lg bg-gradient-to-br from-yellow-100 via-red-100 to-pink-100 border border-[var(--color-card-border)] animate-fade-in overflow-hidden">
        <div className="text-[var(--color-cream)] bg-gray-800/60 p-2 rounded-lg">
        <h2 className="text-xl md:text-2xl font-bold mb-3 text-center">🎉 You've picked:</h2>
        <p className="text-2xl md:text-3xl font-semibold">{restaurant.name}</p>
        </div>
        <div className="flex flex-col gap-y-3 text-xs md:text-base">
          <a
            href={restaurant.linkToLocation}
            target="_blank"
            
          >
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700">
            Take me there!
            </button>
          </a>
          <button
            onClick={() => setSpotlightRestaurant(null)}
            className="bg-red-500 text-sm text-white hover:bg-red-700 rounded-lg shadow-2xl"
          >
            Never mind — go back
          </button>
        </div>
      </div>
    </div>
  );
}
