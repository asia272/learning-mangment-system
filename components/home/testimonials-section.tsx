import Link from "next/link";
import { RatingStars } from "@/components/student/rating-stars";
import { testimonials } from "@/lib/testimonials";

export function TestimonialsSection() {
    return (
        <section className="pb-24">
            <div className="mx-auto max-w-[910px] px-6">
                <h2 className="text-center text-[30px] font-medium leading-none text-[#0E0E0E]">
                    Testimonials
                </h2>
                <p className="mx-auto mt-5 max-w-[640px] text-center text-base leading-6 text-[#565656]">
                    Hear from our learners as they share their journeys of transformation, success, and how
                    our platform has made a difference in their lives.
                </p>

                <div className="mt-12 grid gap-6 md:grid-cols-3">
                    {testimonials.map((t) => (
                        <article
                            key={t.id}
                            className="overflow-hidden rounded-lg border border-[#E3E3E3] bg-white shadow-sm"
                        >
                            <div className="flex items-center gap-4 bg-[#F2F2F2] px-5 py-4">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={`/assets/${t.avatar}`}
                                    alt={t.name}
                                    className="h-12 w-12 rounded-full object-cover"
                                />
                                <div>
                                    <h3 className="font-medium text-[#0E0E0E]">{t.name}</h3>
                                    <p className="text-xs text-[#565656]">{t.role}</p>
                                </div>
                            </div>

                            <div className="px-5 pb-5 pt-4">
                                <RatingStars rating={t.rating} size={18} />
                                <p className="mt-4 text-sm leading-6 text-[#565656]">{t.text}</p>
                                <Link href="#" className="mt-5 inline-block text-sm text-[#2563EB] underline">
                                    Read more
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}