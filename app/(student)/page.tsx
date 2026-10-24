import Link from "next/link";
import { Search } from "lucide-react";
import { getPublishedCourses } from "@/lib/queries/courses";
import { CourseCard } from "@/components/student/course-card";

export default async function HomePage() {
    const { courses } = await getPublishedCourses({ limit: 8 });

    return (
        <main>
            <section className="bg-gradient-to-b from-cyan-100/70 to-white">
                <div className="mx-auto max-w-[1180px] px-6 py-20 text-center">
                    <h1 className="mx-auto max-w-3xl text-4xl font-semibold leading-tight text-[#0E0E0E] md:text-[52px]">
                        Learn new skills with courses built for <span className="text-[#0260FF]">your goals.</span>
                    </h1>
                    <p className="mx-auto mt-5 max-w-xl text-[#565656]">
                        Pick a course, learn at your own pace, and keep lifetime access.
                    </p>

                    <form
                        action="/courses"
                        method="get"
                        role="search"
                        className="mx-auto mt-8 flex h-[46px] w-full max-w-[514px] items-center gap-3 rounded-[5px] border border-[#E3E3E3] bg-white pl-4 pr-[5px]"
                    >
                        <Search className="h-5 w-5 shrink-0 text-[#565656]" />
                        <input
                            type="text"
                            name="q"
                            placeholder="Search for courses"
                            maxLength={100}
                            className="min-w-0 flex-1 bg-transparent text-[#0E0E0E] placeholder:text-[#565656] focus:outline-none"
                        />
                        <button
                            type="submit"
                            className="h-9 w-[125px] shrink-0 rounded-[5px] bg-[#0260FF] text-white hover:opacity-90"
                        >
                            Search
                        </button>
                    </form>
                </div>
            </section>

            <section className="mx-auto max-w-[1180px] px-6 pb-20">
                <h2 className="text-3xl font-semibold text-[#0E0E0E]">Learn from the best</h2>
                <p className="mt-2 max-w-xl text-sm text-[#565656]">
                    Discover our top-rated courses across different categories.
                </p>

                {courses.length === 0 ? (
                    <p className="mt-8 rounded-lg border border-[#E1E1E1] p-10 text-center text-[#565656]">
                        No courses are available yet.
                    </p>
                ) : (
                    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {courses.map((course) => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                )}

                <div className="mt-10 flex justify-center">
                    <Link
                        href="/courses"
                        className="rounded border border-[#E1E1E1] px-10 py-3 text-[#565656] hover:bg-gray-50"
                    >
                        Show all courses
                    </Link>
                </div>
            </section>
        </main>
    );
}