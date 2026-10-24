import Link from "next/link";
import { notFound } from "next/navigation";
import { Timer, Clock, BookOpen, Star } from "lucide-react";
import { getCurrentUser } from "@/lib/current-user";
import { getCourseDetail } from "@/lib/queries/courses";
import { sanitizeDescription } from "@/lib/sanitize";
import { daysLeft, getFinalPrice, isDiscountActive } from "@/lib/pricing";
import { formatHours, formatMoney, formatTotalDuration, plural } from "@/lib/format";
import { RatingStars } from "@/components/student/rating-stars";
import { CourseStructure } from "@/components/student/course-structure";

export default async function CourseDetailPage({
    params,
}: {
    params: Promise<{ courseId: string }>;
}) {
    const { courseId } = await params;

    const viewer = await getCurrentUser();
    const course = await getCourseDetail(courseId, viewer);
    if (!course) notFound();

    const discounted = isDiscountActive(course);
    const finalPrice = getFinalPrice(course);
    const showTimer = discounted && course.discountEndsAt !== null;

    const buttonClass =
        "block w-full rounded bg-[#0260FF] py-3 text-center font-medium text-white hover:opacity-90";

    return (
        <div className="bg-gradient-to-b from-cyan-100/70 to-white">
            <div className="mx-auto grid max-w-[1180px] gap-10 px-6 py-14 lg:grid-cols-[1fr_400px]">
                {/* ---------- left column ---------- */}
                <div className="min-w-0">
                    <h1 className="text-4xl font-semibold leading-tight text-[#0E0E0E] md:text-[44px]">
                        {course.title}
                    </h1>

                    <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-[#404040]">
                        <span>{course.rating.toFixed(1)}</span>
                        <RatingStars rating={course.rating} />
                        <span className="text-[#0260FF]">({plural(course.ratingCount, "rating")})</span>
                        <span className="ml-1">{plural(course.studentCount, "student")}</span>
                    </div>

                    <p className="mt-2 text-sm text-[#404040]">
                        Course by{" "}
                        <span className="text-[#0260FF] underline">
                            {course.instructor.name ?? "Instructor"}
                        </span>
                    </p>

                    <section className="mt-12">
                        <h2 className="text-xl font-semibold text-[#0E0E0E]">Course Structure</h2>
                        <p className="mb-4 mt-2 text-sm text-[#404040]">
                            {plural(course.chapters.length, "section")} -{" "}
                            {plural(course.totalLectures, "lecture")} -{" "}
                            {formatTotalDuration(course.totalSeconds)} total duration
                        </p>
                        <CourseStructure chapters={course.chapters} />
                    </section>

                    <section className="mt-12">
                        <h2 className="mb-4 text-xl font-semibold text-[#0E0E0E]">Course Description</h2>
                        <div
                            className="max-w-2xl text-sm leading-6 text-[#565656] [&_a]:text-[#0260FF] [&_a]:underline [&_h1]:mb-3 [&_h1]:text-2xl [&_h1]:font-semibold [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-3 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-6"
                            dangerouslySetInnerHTML={{ __html: sanitizeDescription(course.description) }}
                        />
                    </section>
                </div>

                {/* ---------- right column: price card ---------- */}
                <aside className="lg:sticky lg:top-6 lg:self-start">
                    <div className="overflow-hidden rounded-lg border border-[#E3E3E3] bg-white shadow-lg">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={course.thumbnailUrl}
                            alt={course.title}
                            className="aspect-video w-full object-cover"
                        />

                        <div className="p-5">
                            {showTimer && (
                                <p className="flex items-center gap-2 text-sm text-red-500">
                                    <Timer className="h-4 w-4" />
                                    <span>
                                        <span className="font-medium">
                                            {plural(daysLeft(course.discountEndsAt!), "day")} left
                                        </span>{" "}
                                        at this price!
                                    </span>
                                </p>
                            )}

                            <p className="mt-3 flex flex-wrap items-baseline gap-3">
                                <span className="text-4xl font-semibold text-[#0E0E0E]">
                                    {finalPrice === 0 ? "Free" : formatMoney(finalPrice)}
                                </span>
                                {discounted && course.price > 0 && (
                                    <>
                                        <span className="text-[#565656] line-through">
                                            {formatMoney(course.price)}
                                        </span>
                                        <span className="text-[#565656]">{course.discountPercent}% off</span>
                                    </>
                                )}
                            </p>

                            <div className="mt-4 flex items-center gap-3 text-sm text-[#565656]">
                                <span className="flex items-center gap-1">
                                    <Star className="h-4 w-4 fill-[#FB6A3C] text-[#FB6A3C]" />
                                    {course.rating.toFixed(1)}
                                </span>
                                <span className="h-4 w-px bg-[#E3E3E3]" />
                                <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {formatHours(course.totalSeconds)}
                                </span>
                                <span className="h-4 w-px bg-[#E3E3E3]" />
                                <span className="flex items-center gap-1">
                                    <BookOpen className="h-4 w-4" />
                                    {plural(course.totalLectures, "lesson")}
                                </span>
                            </div>

                            <div className="mt-5">
                                {!viewer ? (
                                    <Link
                                        href={`/sign-in?redirect_url=${encodeURIComponent(`/courses/${course.id}`)}`}
                                        className={buttonClass}
                                    >
                                        Enroll Now
                                    </Link>
                                ) : course.isOwner ? (
                                    <p className="rounded bg-[#F7F9FD] py-3 text-center text-[#565656]">
                                        You teach this course
                                    </p>
                                ) : course.isEnrolled ? (
                                    <Link href="/my-enrollments" className={buttonClass}>
                                        Already enrolled - go to My Enrollments
                                    </Link>
                                ) : (
                                    // Step 6 turns this into the Stripe checkout button.
                                    <button type="button" className={buttonClass}>
                                        Enroll Now
                                    </button>
                                )}
                            </div>

                            <div className="mt-6">
                                <h3 className="font-medium text-[#0E0E0E]">What&apos;s in the course?</h3>
                                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[#565656]">
                                    <li>Lifetime access with free updates.</li>
                                    <li>Step-by-step, hands-on project guidance.</li>
                                    <li>Downloadable resources and source code.</li>
                                    <li>Quizzes to test your knowledge.</li>
                                    <li>Certificate of completion.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}