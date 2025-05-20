import { atom } from 'jotai';
import {
    restaurantListAtom,
    currentIndexAtom,
    fetchRestaurantsAtomNew,
    restaurantLoadingAtom,
    restaurantErrorAtom,
    spotlightRestaurantAtom,
  } from "./restaurantAtoms";

import { recommendationsAtom } from './recommendationAtoms';
import { userLocationAtom } from './userLocationAtom';

export const resetAppAtom = atom(null, async (get, set) => {
    set(restaurantListAtom, { data: [], message: undefined });
    set(currentIndexAtom, 0);
    set(spotlightRestaurantAtom, null);
    set(recommendationsAtom, []);
    set(restaurantErrorAtom, null);
    set(restaurantLoadingAtom, true);
  
    const userCoords = get(userLocationAtom);
    if (userCoords) {
      const { lat, lon } = userCoords;
      // await set(fetchRestaurantsAtom, { lat, lon });
      await set(fetchRestaurantsAtomNew,  { lat, lon });
    }else {
      set(restaurantLoadingAtom, false);
      set(restaurantErrorAtom, "No user location available.");
    }
  });
  