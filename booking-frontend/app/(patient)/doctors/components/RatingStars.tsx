
import { Star, StarHalf } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  size?: number;
  showNumber?: boolean;
}

export const RatingStars = ({
  rating,
  size = 16,
  showNumber = false,
}: RatingStarsProps) => {
  const safeRating = Math.min(5, Math.max(0, rating || 0));
  const fullStars = Math.floor(safeRating);
  const hasHalfStar = safeRating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={i}
            size={size}
            className="fill-yellow-400 text-yellow-400"
          />
        ))}
        {hasHalfStar && (
          <StarHalf size={size} className="fill-yellow-400 text-yellow-400" />
        )}
        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
          <Star key={i} size={size} className="text-gray-300" />
        ))}
      </div>
      {showNumber && (
        <span className="text-sm font-semibold text-gray-700 ml-1">
          {safeRating.toFixed(1)}
        </span>
      )}
    </div>
  );
};
