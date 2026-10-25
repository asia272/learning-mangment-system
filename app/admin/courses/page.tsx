import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/format";
import { CourseVisibilityButton } from "@/components/admin/course-visibility-button";

export default async function AdminCoursesPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const { q } = await searchParams;
    const query = q?.trim();

    const courses = await prisma.course.findMany({
        where: query ? { title: { contains: query, mode: "insensitive" } } : {},
        orderBy: { createdAt: "desc" },
        take: 100,
        include: {
            instructor: { select: { name: true, email: true } },
            _count: { select: { enrollments: true } },
        },
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-gray-800">Courses</h1>
                <p className="mt-1 text-sm text-gray-500">Moderate every course on the platform.</p>
            </div>

            <form method="get" className="flex gap-3">
                <input
                    name="q"
                    defaultValue={query}
                    placeholder="Search course title"
                    className="h-10 w-full max-w-xs rounded-[4px] border border-[#25252580] bg-white px-3 text-sm focus:outline-none"
                />
                <button className="h-10 rounded bg-[#0260FF] px-6 text-sm text-white hover:opacity-90">
                    Search
                </button>
            </form>

            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                <table className="w-full min-w-[760px] text-left text-sm">
                    <thead className="border-b border-gray-200 text-gray-500">
                        <tr>
                            <th className="px-5 py-3 font-medium">Course</th>
                            <th className="px-5 py-3 font-medium">Instructor</th>
                            <th className="px-5 py-3 font-medium">Price</th>
                            <th className="px-5 py-3 font-medium">Enrolled</th>
                            <th className="px-5 py-3 font-medium">Status</th>
                            <th className="px-5 py-3" />
                        </tr>
                    </thead>
                    <tbody>
                        {courses.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-5 py-8 text-center text-gray-500">
                                    No courses found.
                                </td>
                            </tr>
                        )}
                        {courses.map((c) => (
                            <tr key={c.id} className="border-b border-gray-100 last:border-0">
                                <td className="px-5 py-3">
                                    <div className="flex items-center gap-3">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={c.thumbnailUrl} alt="" className="h-10 w-16 rounded object-cover" />
                                        <span className="max-w-[260px] truncate text-gray-800">{c.title}</span>
                                    </div>
                                </td>
                                <td className="px-5 py-3 text-gray-600">{c.instructor.name ?? c.instructor.email}</td>
                                <td className="px-5 py-3 text-gray-600">
                                    {c.price === 0 ? "Free" : formatMoney(c.price)}
                                </td>
                                <td className="px-5 py-3 text-gray-600">{c._count.enrollments}</td>
                                <td className="px-5 py-3">
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-medium ${c.isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                                            }`}
                                    >
                                        {c.isPublished ? "Live" : "Private"}
                                    </span>
                                </td>
                                <td className="px-5 py-3 text-right">
                                    <CourseVisibilityButton courseId={c.id} isPublished={c.isPublished} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}