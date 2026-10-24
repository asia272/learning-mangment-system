import { Star } from "lucide-react";

export function RatingStars({ rating, size = 16 }: { rating: number; size?: number }) {
    const filled = Math.floor(rating); // 4.5 shows 4 filled + 1 empty, like your design
    return (
        <span className="inline-flex items-center gap-0.5" aria-label={`${rating.toFixed(1)} out of 5`}>
            {Array.from({ length: 5 }, (_, i) => (
                <Star
                    key={i}
                    width={size}
                    height={size}
                    strokeWidth={1.5}
                    className={`text-[#FB6A3C] ${i < filled ? "fill-[#FB6A3C]" : ""}`}
                />
            ))}
        </span>
    );
}