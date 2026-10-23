import Link from "next/link";
import { requireInstructor } from "@/lib/auth";
import { getInstructorCourses } from "@/lib/queries/instructor";
import { formatMoney } from "@/lib/format";
import { CourseStatusToggle } from "@/components/instructor/course-status-toggle";

export default async function MyCoursesPage() {
    const user = await requireInstructor();
    const courses = await getInstructorCourses(user.id);

    return (
        <div>
            <h1 className="mb-8 text-xl font-semibold text-gray-800">My Courses</h1>

            {courses.length === 0 ? (
                <div className="max-w-5xl rounded-lg border border-gray-300 p-10 text-center text-gray-500">
                    <p>You have not created any course yet.</p>
                    <Link
                        href="/instructor/add-course"
                        className="mt-4 inline-block rounded bg-black px-6 py-3 text-white"
                    >
                        Add your first course
                    </Link>
                </div>
            ) : (
                <div className="max-w-5xl overflow-x-auto rounded-lg border border-gray-300">
                    <table className="w-full min-w-[640px] text-left">
                        <thead className="border-b border-gray-300 text-gray-900">
                            <tr>
                                <th className="px-6 py-5 font-semibold">All Courses</th>
                                <th className="px-4 py-5 font-semibold">Earnings</th>
                                <th className="px-4 py-5 font-semibold">Students</th>
                                <th className="px-4 py-5 font-semibold">Course Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600">
                            {courses.map((course) => (
                                <tr key={course.id} className="border-b border-gray-200 last:border-0">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={course.thumbnailUrl}
                                                alt=""
                                                className="h-14 w-24 rounded object-cover shadow"
                                            />
                                            <span className="line-clamp-2">{course.title}</span>
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