import { useEffect} from "react";
import { useAtom } from "jotai";
import {
  restaurantListAtom,
  currentIndexAtom,
  fetchRestaurantsAtom,
  swipeRestaurantAtom,
  restaurantLoadingAtom,
  restaurantErrorAtom,
  spotlightRestaurantAtom,
} from "@/atoms/restaurantAtoms";
import { fetchRecommendationsAtom } from "@/atoms/recommendationAtoms";
import { resetAppAtom } from "@/atoms/resetAppAtom";
import RestaurantCard, { SwipeDirection } from "@/components/RestaurantCard";
import SpotlightView from "@/components/SpotlightView";
import BurgerLoader from "@/components/common/BurgerLoader";
import { userLocationAtom } from "@/atoms/userLocationAtom";
import RadiusSelector from "@/components/RadiusSelector";
import { Button } from "@/components/ui/button";
import FinalSection from "@/components/FinalSection";

const Home = () => {
  const [restaurants] = useAtom(restaurantListAtom);
  const [currentIndex, setCurrentIndex] = useAtom(currentIndexAtom);
  const [, fetchRestaurants] = useAtom(fetchRestaurantsAtom);
  const [, swipeRestaurant] = useAtom(swipeRestaurantAtom);
  const [, setSpotlight] = useAtom(spotlightRestaurantAtom);
  const [, setLocation] = useAtom(userLocationAtom);
  const [, resetApp] = useAtom(resetAppAtom);
  const [, fetchRecs] = useAtom(fetchRecommendationsAtom);
  const isLoading = useAtom(restaurantLoadingAtom)[0];
  const error = useAtom(restaurantErrorAtom)[0];
  const [spotlightRestaurant] = useAtom(spotlightRestaurantAtom);

  // initial load
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      fetchRestaurants({ lat: pos.coords.latitude, lon: pos.coords.longitude });
    });
  }, []);

  useEffect(() => {
    if (
      restaurants.data?.length > 0 &&
      currentIndex >= restaurants.data.length
    ) {
      fetchRecs();
    }
  }, [currentIndex, restaurants]);

  //swipe handler
  const handleSwipe = async (
    dir: SwipeDirection,
    restaurant: (typeof restaurants.data)[0]
  ) => {
    if (dir === "up") {
      setSpotlight(restaurant);
      return;
    }
    await swipeRestaurant({ direction: dir });
    // await fetchRecs();
    setCurrentIndex((i) => i + 1);
  };

  // reverse stack and show only 3 cards
  const visible = (restaurants.data ?? [])
    .slice(currentIndex, currentIndex + 3)
    .reverse();

  if (spotlightRestaurant) {
    return (
      <>
        <div className="max-w-xl mx-auto p-6">
          <h1 className="text-2xl text-[var(--color-cream)] font-bold text-center">
            MakanMana 🍽️
          </h1>
        </div>
        <SpotlightView />
      </>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 flex flex-col items-center gap-8">
      <h1 className="text-2xl text-center text-[var(--color-cream)] font-bold">
        MakanMana 🍽️
      </h1>
      <RadiusSelector />

      {isLoading ? (
        <BurgerLoader />
      ) : error ? (
        <div className="flex flex-col items-center gap-y-3">
          <p className="text-red-500">{error}</p>
          <Button className="w-max bg-blue-600 hover:bg-blue-500" onClick={resetApp}>{`Refresh :(`}</Button>
        </div>
      ) : visible.length > 0 ? (
        <>
          <div className="relative w-full h-[300px]">
            {visible.map((r, idx) => (
              <RestaurantCard
                key={r.id}
                restaurant={r}
                onSwipe={handleSwipe}
                index={idx}
                stackSize={visible.length}
              />
            ))}
          </div>
          <p>
            Swiped {currentIndex}/{restaurants.data?.length}
          </p>
        </>
      ) : (
        <FinalSection />
      )}

      {/* <RecommendationsSection /> */}

      
    </div>
  );
};

export default Home;