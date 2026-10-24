import Link from "next/link";
import { Search } from "lucide-react";
import { getPublishedCourses } from "@/lib/queries/courses";
import { CourseCard } from "@/components/student/course-card";

const PAGE_SIZE = 8;

export default async function CoursesPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; limit?: string }>;
}) {
    const sp = await searchParams;
    const q = (sp.q ?? "").trim().slice(0, 100);
    const requested = Number.parseInt(sp.limit ?? "", 10);
    const limit = Number.isFinite(requested)
        ? Math.min(Math.max(requested, PAGE_SIZE), 96)
        : PAGE_SIZE;

    const { courses, hasMore } = await getPublishedCourses({ q, limit });

    const loadMoreHref = `/courses?${new URLSearchParams({
        ...(q ? { q } : {}),
        limit: String(limit + PAGE_SIZE),
    }).toString()}`;

    return (
        <main className="mx-auto max-w-[1180px] px-6 pb-20 pt-12">
            {/* heading + search */}
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div>
                    <h1 className="text-[40px] font-semibold leading-tight text-[#0E0E0E]">
                        Course List
                    </h1>
                    <p className="mt-1 text-sm text-[#565656]">
                        <Link href="/" className="text-[#0260FF]">
                            Home
                        </Link>{" "}
                        / Course List
                    </p>
                </div>

                <form
                    action="/courses"
                    method="get"
                    role="search"
                    className="flex h-[46px] w-full max-w-[514px] items-center gap-3 rounded-[5px] border border-[#E3E3E3] bg-white pl-4 pr-[5px]"
                >
                    <Search className="h-5 w-5 shrink-0 text-[#565656]" />
                    <input
                        type="text"
                        name="q"
                        defaultValue={q}
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

            {/* grid */}
            {courses.length === 0 ? (
                <p className="mt-12 rounded-lg border border-[#E1E1E1] p-10 text-center text-[#565656]">
                    {q ? `No courses found for "${q}".` : "No courses are available yet."}
                </p>
            ) : (
                <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {courses.map((course) => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            )}

            {hasMore && (
                <div className="mt-12 flex justify-center">
                    <Link
                        href={loadMoreHref}
                        scroll={false}
                        className="rounded border border-[#E1E1E1] px-14 py-3 text-[#565656] hover:bg-gray-50"
                    >
                        Load more
                    </Link>
                </div>
            )}
        </main>
    );
}