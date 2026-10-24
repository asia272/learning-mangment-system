import Link from "next/link";
import { CourseCard } from "@/components/student/course-card";

type Course = Parameters<typeof CourseCard>[0]["course"];

export function CoursesSection({ courses }: { courses: Course[] }) {
    return (
        <section className="pb-24">
            <div className="mx-auto max-w-[1000px] px-6">
                <h2 className="text-center text-[30px] font-medium leading-none text-[#0E0E0E]">
                    Learn from the best
                </h2>
                <p className="mx-auto mt-5 max-w-[640px] text-center text-base leading-6 text-[#565656]">
                    Discover our top-rated courses across various categories. From coding and design to
                    business and wellness, our courses are crafted to deliver results.
                </p>

                {courses.length === 0 ? (
                    <p className="mt-12 rounded-lg border border-[#E1E1E1] p-10 text-center text-[#565656]">
                        No courses are available yet.
                    </p>
                ) : (
                    <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {courses.map((course) => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                )}

                <div className="mt-12 flex justify-center">
                    <Link
                        href="/courses"
                        className="rounded border border-[#E1E1E1] px-10 py-3 text-sm text-[#565656] hover:bg-gray-50"
                    >
                        Show all courses
                    </Link>
                </div>
            </div>
        </section>
    );
}