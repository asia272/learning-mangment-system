"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { AssetIcon } from "@/components/ui/asset-icon";
import { rateCourse } from "@/app/(student)/player/[courseId]/actions";

export function RateCourse({
    courseId,
    initialRating,
}: {
    courseId: string;
    initialRating: number;
}) {
    const [rating, setRating] = useState(initialRating);
    const [hover, setHover] = useState(0);
    const [isPending, startTransition] = useTransition();

    function choose(value: number) {
        const previous = rating;
        setRating(value);
        startTransition(async () => {
            const res = await rateCourse(courseId, value);
            if (res.success) toast.success("Rating added");
            else {
                setRating(previous);
                toast.error(res.error);
            }
        });
    }

    const shown = hover || rating;

    return (
        <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-[#0E0E0E]">Rate this Course:</h2>
            <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
                {[1, 2, 3, 4, 5].map((n) => (
                    <button
                        key={n}
                        type="button"
                        disabled={isPending}
                        aria-label={`Rate ${n} star${n === 1 ? "" : "s"}`}
                        onMouseEnter={() => setHover(n)}
                        onClick={() => choose(n)}
                        className="p-0.5 disabled:opacity-60"
                    >
                        <AssetIcon name={n <= shown ? "rating_star.svg" : "star_dull_icon.svg"} size={26} />
                    </button>
                ))}
            </div>
        </div>
    );
}