import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { getMyEnrollments } from "@/lib/queries/enrollments";
import { formatDurationLong } from "@/lib/format";

export default async function MyEnrollmentsPage() {
    const user = await getCurrentUser();
    if (!user) redirect("/sign-in?redirect_url=/my-enrollments");

    const enrollments = await getMyEnrollments(user.id);




    return (
        <main className="mx-auto max-w-[1180px] px-6 pb-20 pt-12">
            <h1 className="text-3xl font-semibold text-[#0E0E0E]">My Enrollments</h1>

            <div className="mt-8">
                {enrollments.length === 0 ? (
                    <div className="rounded-lg border border-[#E3E3E3] p-10 text-center text-[#565656]">
                        <p>You have not enrolled in any course yet.</p>
                        <Link
                            href="/courses"
                            className="mt-4 inline-block rounded bg-[#2563EB] px-6 py-3 text-white hover:bg-blue-700"
                        >
                            Browse courses
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto border border-[#E3E3E3]">
                        <table className="w-full min-w-[860px] text-left">
                            <thead className="border-b border-[#E3E3E3] text-[#0E0E0E]">
                                <tr>
                                    <th className="px-6 py-5 font-semibold">Course</th>
                                    <th className="px-4 py-5 font-semibold">Duration</th>
                                    <th className="px-4 py-5 font-semibold">Students</th>
                                    <th className="px-4 py-5 font-semibold">Completed</th>
                                    <th className="px-4 py-5 font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-[#565656]">
                                {enrollments.map((e) => {
                                    const percent = e.totalLectures
                                        ? Math.round((e.completedLectures / e.totalLectures) * 100)
                                        : 0;
                                    const finished = e.totalLectures > 0 && e.completedLectures === e.totalLectures;

                                    return (
                                        <tr key={e.id} className="border-b border-[#E3E3E3] last:border-b-0">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={e.course.thumbnailUrl}
                                                        alt=""
                                                        className="h-14 w-24 shrink-0 rounded object-cover"
                                                    />
                                                    <div className="min-w-0 flex-1">
                                                        <p className="line-clamp-2 text-[#0E0E0E]">{e.course.title}</p>
                                                        <div
                                                            className="mt-2 h-1.5 w-full max-w-[280px] overflow-hidden rounded-full bg-gray-200"
                                                            role="progressbar"
                                                            aria-valuenow={percent}
                                                            aria-valuemin={0}
                                                            aria-valuemax={100}
                                                        >
                                                            <div
                                                                className="h-full rounded-full bg-sky-500"
                                                                style={{ width: `${percent}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-4">
                                                {formatDurationLong(e.totalSeconds)}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-4">
                                                {e.totalStudents}{" "}
                                                <span className="text-sm">
                                                    {e.totalStudents === 1 ? "student" : "students"}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-4">
                                                {e.completedLectures} / {e.totalLectures}{" "}
                                                <span className="text-sm">Lectures</span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <Link
                                                    href={`/player/${e.course.id}`}
                                                    className={`inline-block whitespace-nowrap rounded-[2px] px-8 py-3 text-white hover:opacity-90 ${finished ? "bg-green-600" : "bg-[#2563EB]"
                                                        }`}
                                                >
                                                    {finished ? "Completed" : "On Going"}
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </main>
    );
}