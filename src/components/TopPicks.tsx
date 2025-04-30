import { useAtom } from "jotai";
import { recommendationsAtom } from "@/atoms/recommendationAtoms";

export default function TopPicks() {
  const [recommendations] = useAtom(recommendationsAtom);
  const topPicks = [...recommendations]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  if (topPicks.length === 0) return <p>No recommendations yet.</p>;

  return (
    <div className="flex flex-col items-center gap-y-4">
      <h2 className="text-xl font-semibold mb-2 text-center">🍜 Top Recommendations</h2>
      <ul className="space-y-2">
        {topPicks.map((r) => (
          <li key={r.id} className="text-gray-800 text-xs md:text-base font-medium border rounded-xl bg-gradient-to-br from-yellow-100 via-red-100 to-pink-100 py-3 px-5 shadow">
            {r.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
