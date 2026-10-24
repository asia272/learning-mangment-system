import Link from "next/link";
import { requireInstructor } from "@/lib/auth";
import { getInstructorCourses } from "@/lib/queries/instructor";
import { formatMoney } from "@/lib/format";
import { CourseStatusToggle } from "@/components/instructor/course-status-toggle";

export default async function MyCoursesPage() {
    const user = await requireInstructor();
    const courses = await getInstructorCourses(user.id);

    return (
        <div className="font-[family-name:var(--font-outfit)]">
            <h1 className="mb-8 text-xl font-semibold text-[#1F2937]">My Courses</h1>

            {courses.length === 0 ? (
                <div className="max-w-[940px] rounded-[6px] border border-[#2525254D] bg-white p-10 text-center text-sm text-[#252525B2]">
                    <p>You have not created any course yet.</p>
                    <Link
                        href="/instructor/add-course"
                        className="mt-4 inline-block rounded bg-black px-6 py-3 text-white"
                    >
                        Add your first course
                    </Link>
                </div>
            ) : (
                <div className="max-w-[940px] overflow-x-auto rounded-[6px] border border-[#2525254D] bg-white">
                    <table className="w-full min-w-[640px] table-fixed text-left">
                        <thead className="border-b border-[#2525254D] text-sm font-semibold leading-none text-[#252525]">
                            <tr>
                                <th className="px-6 py-5 font-semibold">All Courses</th>
                                <th className="w-[120px] px-4 py-5 font-semibold">Earnings</th>
                                <th className="w-[110px] px-4 py-5 font-semibold">Students</th>
                                <th className="w-[170px] px-4 py-5 font-semibold">Course Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm font-normal leading-none text-[#252525B2]">
                            {courses.map((course) => (
                                <tr key={course.id} className="border-b border-[#25252526] last:border-0">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={course.thumbnailUrl}
                                                alt=""
                                                className="h-14 w-24 shrink-0 rounded object-cover shadow"
                                            />
                                            <span className="line-clamp-2 leading-snug">{course.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">{formatMoney(course.earnings)}</td>
                                    <td className="px-4 py-4">{course.students}</td>
                                    <td className="px-4 py-4">
                                        <CourseStatusToggle
                                            courseId={course.id}
                                            initialPublished={course.isPublished}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}