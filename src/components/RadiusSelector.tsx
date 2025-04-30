import { useAtom } from 'jotai';
import {
  radiusAtom,
  fetchRestaurantsAtom,
} from '@/atoms/restaurantAtoms';
import { clearRecommendationsAtom, fetchRecommendationsAtom } from '@/atoms/recommendationAtoms';
import { userLocationAtom } from '@/atoms/userLocationAtom';

const radiusOptions = [1000, 3000, 5000];

export default function RadiusSelector() {
  const [radius, setRadius] = useAtom(radiusAtom);
  const [, fetchRestaurants] = useAtom(fetchRestaurantsAtom);
  const [userLocation] = useAtom(userLocationAtom);
  const [, clearRecommendations]  = useAtom(clearRecommendationsAtom)
  const [, fetchRecommendations]  = useAtom(fetchRecommendationsAtom)

  const handleChange = async (newRadius: number) => {
    setRadius(newRadius);
    clearRecommendations();

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
      <p className="text-sm font-medium mb-2">Search Radius:</p>
      <div className="flex flex-wrap gap-2">
        {radiusOptions.map((r) => (
          <button
            key={r}
            onClick={() => handleChange(r)}
            className={`px-3 py-1 rounded-full text-sm border transition-all duration-200 ${
              radius === r
                ? 'bg-green-600 text-white border-green-700'
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
