import { Star, StarHalf, Star as StarFilled } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
}

export default function StarRating({ rating, maxStars = 5 }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      {[...Array(fullStars)].map((_, index) => (
        <StarFilled key={`full-${index}`} className="w-4 h-4 text-yellow-400" />
      ))}
      {hasHalfStar && (
        <StarHalf className="w-4 h-4 text-yellow-400" />
      )}
      {[...Array(emptyStars)].map((_, index) => (
        <Star key={`empty-${index}`} className="w-4 h-4 text-black" />
      ))}
    </div>
  );
}
