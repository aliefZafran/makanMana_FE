import { atom } from 'jotai';
import { Recommendation } from '@/types';
import { getRecommendations, clearScore, getRecommendationsNew, clearScoreNew } from '@/api/makanManaAPI';

export const recommendationsAtom = atom<Recommendation[]>([]);
export const recommendationLoadingAtom = atom(false);

export const fetchRecommendationsAtom = atom(
  null,
  async (_get, set) => {
    set(recommendationLoadingAtom, true);
    const data = await getRecommendations();
    set(recommendationsAtom, data);
    set(recommendationLoadingAtom, false);
  }
);

export const clearRecommendationsAtom = atom(
  null,
  async (_get, set) => {
    const { recommendations } = await clearScore();
    // alert(message);
    set(recommendationsAtom, recommendations);
  }
);

export const fetchRecommendationsAtomNew = atom(
  null,
  async (_get, set) => {
    set(recommendationLoadingAtom, true);
    const data = await getRecommendationsNew();
    set(recommendationsAtom, data);
    set(recommendationLoadingAtom, false);
  }
);

export const clearRecommendationsAtomNew = atom(
  null,
  async (_get, set) => {
    const { recommendations } = await clearScoreNew();
    // alert(message);
    set(recommendationsAtom, recommendations);
  }
);
