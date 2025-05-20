import { useAtom } from 'jotai';
import {
  radiusAtom,
  fetchRestaurantsAtomNew,
} from '@/atoms/restaurantAtoms';
import { fetchRecommendationsAtomNew } from '@/atoms/recommendationAtoms';
import { userLocationAtom } from '@/atoms/userLocationAtom';
import { resetAppAtom } from '@/atoms/resetAppAtom';

const radiusOptions = [1000, 3000, 7000];

export default function RadiusSelector() {
  const [radius, setRadius] = useAtom(radiusAtom);
  const [, fetchRestaurants] = useAtom(fetchRestaurantsAtomNew);
  const [userLocation] = useAtom(userLocationAtom);
  const [, fetchRecommendations]  = useAtom(fetchRecommendationsAtomNew)
  const [, resetApp] = useAtom(resetAppAtom);

  const handleChange = async (newRadius: number) => {
    setRadius(newRadius);
    resetApp();

    if (userLocation) {
      await fetchRestaurants({
        lat: userLocation.lat,
        lon: userLocation.lon,
      });
      await fetchRecommendations();
    }
  };

  return (
    <div>
      <p className="text-sm font-semibold mb-2">Search Radius:</p>
      <div className="flex flex-wrap gap-2">
        {radiusOptions.map((r) => (
          <button
            key={r}
            onClick={() => handleChange(r)}
            className={`!px-3 !py-2 md:!px-4 md:!py-3 rounded-full text-sm border transition-all duration-200 ${
              radius === r
                ? 'bg-green-600 text-white ring ring-orange-300'
                : 'bg-[var(--color-cream)] text-gray-800 hover:bg-gray-100'
            }`}
          >
            {r / 1000} km
          </button>
        ))}
      </div>
    </div>
  );
}
