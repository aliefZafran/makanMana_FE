import { useEffect } from "react";
import { useAtom } from "jotai";
import {
  restaurantListAtom,
  currentIndexAtom,
  fetchRestaurantsAtomNew,
  swipeRestaurantAtomNew,
  restaurantLoadingAtom,
  restaurantErrorAtom,
  spotlightRestaurantAtom,
} from "@/atoms/restaurantAtoms";
import {
  recommendationsAtom,
  fetchRecommendationsAtomNew,
} from "@/atoms/recommendationAtoms";
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
  const [recommendations] = useAtom(recommendationsAtom);
  const [currentIndex, setCurrentIndex] = useAtom(currentIndexAtom);
  const [, fetchRestaurants] = useAtom(fetchRestaurantsAtomNew);
  const [, swipeRestaurant] = useAtom(swipeRestaurantAtomNew);
  const [, setSpotlight] = useAtom(spotlightRestaurantAtom);
  const [, setLocation] = useAtom(userLocationAtom);
  const [, resetApp] = useAtom(resetAppAtom);
  const [, fetchRecs] = useAtom(fetchRecommendationsAtomNew);
  const isLoading = useAtom(restaurantLoadingAtom)[0];
  const error = useAtom(restaurantErrorAtom)[0];
  const [spotlightRestaurant] = useAtom(spotlightRestaurantAtom);

  // const [, fetchRestaurants] = useAtom(fetchRestaurantsAtom);
  // const [, swipeRestaurant] = useAtom(swipeRestaurantAtom);
  // const [, fetchRecs] = useAtom(fetchRecommendationsAtom);

  // initial load
  useEffect(() => {
    // navigator.geolocation.getCurrentPosition((pos) => {
    //   setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
    //   fetchRestaurants({ lat: pos.coords.latitude, lon: pos.coords.longitude });
    // });

    const testLocation = { lat: 3.139, lon: 101.6869 }; // KL coordinates
    setLocation(testLocation);
    fetchRestaurants(testLocation);
  }, [setLocation, fetchRestaurants]);

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

    try {
      await swipeRestaurant({ direction: dir });
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } catch (err) {
      console.error("Error swiping restaurant:", err);
    }
  };

  // reverse stack and show only 3 cards
  const visible = (restaurants.data ?? [])
    .slice(currentIndex, currentIndex + 3)
    .reverse();

  if (spotlightRestaurant) {
    return (
      <>
        <div className="max-w-xl mx-auto p-6">
          <h1 className="!text-4xl md:!text-5xl text-[var(--color-cream)] font-bold text-center">
            MakanMana 🍽️
          </h1>
        </div>
        <SpotlightView />
      </>
    );
  }
  console.log(recommendations);
  return (
    <div className="max-w-xl mx-auto p-6 flex flex-col justify-around items-center gap-8 relative top-0 h-screen lg:h-fit">
      <h1 className="!text-4xl md:!text-5xl text-center text-[var(--color-cream)] font-bold">
        MakanMana 🍽️
      </h1>
      <div className="min-w-full mx-auto flex flex-col items-center gap-6">
        <RadiusSelector />

        {isLoading ? (
          <BurgerLoader />
        ) : error ? (
          <div className="flex flex-col items-center gap-y-3">
            <p className="text-red-500">Sorry, something went wrong</p>
            <Button
              className="w-max bg-blue-600 hover:bg-blue-500 active:bg-blue-700"
              onClick={resetApp}
            >{`Refresh :(`}</Button>
          </div>
        ) : visible.length > 0 ? (
          <>
            <div className="relative w-full h-[360px] md:h-[400px]">
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
        ) : visible.length === 0 && recommendations.length != 0 ? (
          <FinalSection />
        ) : (
          <p>No restaurants nearby, try expanding your radius</p>
        )}

        {/* <RecommendationsSection /> */}
      </div>
    </div>
  );
};

export default Home;
