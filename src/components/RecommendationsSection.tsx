import {
  recommendationsAtom,
  fetchRecommendationsAtom,
  clearRecommendationsAtom,
} from "@/atoms/recommendationAtoms";
import { useAtom } from "jotai";
import { useState } from "react";

export default function RecommendationsSection() {
  const [recs] = useAtom(recommendationsAtom);
  const [, clearRecommendations] = useAtom(clearRecommendationsAtom);
  const [, fetchRecs] = useAtom(fetchRecommendationsAtom);
  const [showRecommendationsView, setShowRecommendationsView] = useState(false);

  const toggleRecommendations = async () => {
    if (!showRecommendationsView) {
      await fetchRecs();
    }
    setShowRecommendationsView((prev) => !prev);
  };
  return (
    <div className="flex flex-col gap-x-4 mt-4">
      <div className="flex items-center justify-between gap-x-6">
        <button
          onClick={toggleRecommendations}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {showRecommendationsView ? "Hide" : "View"} Recommendations
        </button>
        <button
          onClick={clearRecommendations}
          className="bg-gray-600 text-white px-4 py-2 rounded"
        >
          Clear Recommendation
        </button>
      </div>
      <div>
        {showRecommendationsView
          ? recs.map((r, id) => (
              <>
                <li>
                  {id} {r.name} - score: {r.score}
                </li>
              </>
            ))
          : null}
      </div>
    </div>
  );
}
