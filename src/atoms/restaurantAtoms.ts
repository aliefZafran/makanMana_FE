import { atom } from "jotai";
import { Restaurant, RestaurantResponse } from "@/types";
import { fetchNearbyRestaurants, swipeRestaurant , swipeRestaurantNew, fetchNearbyRestaurantsNew} from "@/api/makanManaAPI";

export const restaurantListAtom = atom<RestaurantResponse>({
  data: [],
  message: "",
});

export const setRestaurantDataAtom = atom(
  null,
  (get, set, updatedData: Restaurant[]) => {
    const current = get(restaurantListAtom);
    set(restaurantListAtom, { ...current, data: updatedData });
  }
);


export const currentIndexAtom = atom(0);
export const restaurantLoadingAtom = atom(true);
export const restaurantErrorAtom = atom<string | null>(null);
export const spotlightRestaurantAtom = atom<Restaurant | null>(null);
export const radiusAtom = atom<number>(3000);

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// Async fetch atom
export const fetchRestaurantsAtom = atom(
  null,
  async (get, set, { lat, lon }: { lat: number; lon: number }) => {
    set(restaurantLoadingAtom, true);
    set(restaurantErrorAtom, null);

    const radius = get(radiusAtom);

    try {
      const fetchPromise: Promise<RestaurantResponse> = fetchNearbyRestaurants(
        lat,
        lon,
        radius
      );
      const delay = sleep(2000);

      const [response] = await Promise.all([fetchPromise, delay]);
      if(response){
        set(restaurantLoadingAtom, false);
      }
      const { data, message } = response;

      set(restaurantListAtom, { data, message });
      set(currentIndexAtom, 0);
    } catch (err: any) {
      set(restaurantErrorAtom, err.message || "Something went wrong");
    } finally {
      set(restaurantLoadingAtom, false);
    }
  }
);

export const swipeRestaurantAtom = atom(
  null,
  async (get, set, { direction }: { direction: "left" | "right" | "up" }) => {
    // const restaurants = get(restaurantListAtom);
    // const currentIndex = get(currentIndexAtom);
    // const current = restaurants[currentIndex];
    const { data: restaurants } = get(restaurantListAtom);
    const currentIndex = get(currentIndexAtom);
    const current = restaurants[currentIndex];
    if (!current) return;

    if (direction === "up") {
      set(spotlightRestaurantAtom, current); // 🥳 Handle spotlight logic here
      return;
    }

    await swipeRestaurant(current.id, direction);
    set(currentIndexAtom, currentIndex);
  }
);

//new api atom
export const fetchRestaurantsAtomNew = atom(
  null,
  async (get, set, {lat, lon }: { lat: number; lon: number }) => {
    set(restaurantLoadingAtom, true);
    set(restaurantErrorAtom, null);

    const radius = get(radiusAtom);

    try {
      // const fetchPromise: Promise<RestaurantResponse> = fetchMockRestaurants();
      const fetchPromise: Promise<RestaurantResponse> = fetchNearbyRestaurantsNew(
        lat,
        lon,
        radius
      );
      const delay = sleep(2000);

      const [response] = await Promise.all([fetchPromise, delay]);
      if(response){
        set(restaurantLoadingAtom, false);
      }
      const { data, message } = response;

      set(restaurantListAtom, { data, message });
      set(currentIndexAtom, 0);
    } catch (err: any) {
      set(restaurantErrorAtom, err.message || "Something went wrong");
    } finally {
      set(restaurantLoadingAtom, false);
    }
  }
);

export const swipeRestaurantAtomNew = atom(
  null,
  async (get, set, { direction }: { direction: "left" | "right" | "up" }) => {
    // const restaurants = get(restaurantListAtom);
    // const currentIndex = get(currentIndexAtom);
    // const current = restaurants[currentIndex];
    const { data: restaurants } = get(restaurantListAtom);
    const currentIndex = get(currentIndexAtom);
    const current = restaurants[currentIndex];
    if (!current) return;

    if (direction === "up") {
      set(spotlightRestaurantAtom, current); // 🥳 Handle spotlight logic here
      return;
    }

    await swipeRestaurantNew(current.id, direction);
    set(currentIndexAtom, currentIndex);
  }
);
