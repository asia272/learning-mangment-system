import Link from "next/link";
import { RatingStars } from "./rating-stars";
import { formatMoney } from "@/lib/format";
import { getFinalPrice } from "@/lib/pricing";

type Props = {
    course: {
        id: string;
        title: string;
        thumbnailUrl: string;
        price: number;
        discountPercent: number;
        discountEndsAt: Date | null;
        instructor: { name: string | null };
        rating: number;
        ratingCount: number;
    };
};

export function CourseCard({ course }: Props) {
    const final = getFinalPrice(course);

    return (
        <Link
            href={`/courses/${course.id}`}
            className="flex h-full min-h-[313px] flex-col overflow-hidden rounded-lg border border-[#E1E1E1] bg-white transition-shadow hover:shadow-md"
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={course.thumbnailUrl} alt="" className="aspect-video w-full object-cover" />

            <div className="flex flex-1 flex-col gap-1.5 px-4 pb-4 pt-3">
                <h3 className="line-clamp-2 text-base font-semibold leading-5 text-[#0E0E0E]">
                    {course.title}
                </h3>

                <p className="text-sm text-[#565656]">{course.instructor.name ?? "Instructor"}</p>

                <div className="flex items-center gap-1.5 text-sm text-[#404040]">
                    <span>{course.rating.toFixed(1)}</span>
                    <RatingStars rating={course.rating} size={14} />
                    <span className="text-[#565656]">({course.ratingCount})</span>
                </div>

                <p className="mt-auto pt-1 text-base font-semibold text-[#404040]">
                    {final === 0 ? "Free" : formatMoney(final)}
                </p>
            </div>
        </Link>
    );
}