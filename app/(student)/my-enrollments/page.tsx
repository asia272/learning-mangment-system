import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { getMyEnrollments, findEnrollmentBySession } from "@/lib/queries/enrollments";
import { formatDurationLong } from "@/lib/format";
import { CheckoutRefresher } from "@/components/student/checkout-refresher";

export default async function MyEnrollmentsPage({
    searchParams,
}: {
    searchParams: Promise<{ checkout?: string; session_id?: string }>;
}) {
    const user = await getCurrentUser();
    if (!user) redirect("/sign-in?redirect_url=/my-enrollments");

    const sp = await searchParams;
    const enrollments = await getMyEnrollments(user.id);

    // coming back from Stripe: is the webhook done yet?
    let banner: "done" | "pending" | null = null;
    if (sp.checkout === "success" && typeof sp.session_id === "string") {
        const found = await findEnrollmentBySession(user.id, sp.session_id);
        banner = found ? "done" : "pending";
    }

    return (
        <main className="mx-auto max-w-[1180px] px-6 pb-20 pt-12">
            <h1 className="text-3xl font-semibold text-[#0E0E0E]">My Enrollments</h1>

            <div className="mt-8">
                {banner === "pending" && <CheckoutRefresher />}
                {banner === "done" && (
                    <div className="mb-6 rounded border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900">
                        Payment successful. You are enrolled.
                    </div>
                )}

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
                        <table className="w-full min-w-[720px] text-left">
                            <thead className="border-b border-[#E3E3E3] text-[#0E0E0E]">
                                <tr>
                                    <th className="px-6 py-5 font-semibold">Course</th>
                                    <th className="px-4 py-5 font-semibold">Duration</th>
                                    <th className="px-4 py-5 font-semibold">Students</th>
                                    <th className="px-4 py-5 font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-[#565656]">
                                {enrollments.map((e) => (
                                    <tr key={e.id} className="border-b border-[#E3E3E3] last:border-b-0">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={e.course.thumbnailUrl}
                                                    alt=""
                                                    className="h-14 w-24 shrink-0 rounded object-cover"
                                                />
                                                <Link
                                                    href={`/courses/${e.course.id}`}
                                                    className="line-clamp-2 text-[#0E0E0E] hover:underline"
                                                >
                                                    {e.course.title}
                                                </Link>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-4">
                                            {formatDurationLong(e.totalSeconds)}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-4">
                                            {e.totalStudents}{" "}
                                            <span className="text-sm">{e.totalStudents === 1 ? "student" : "students"}</span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <Link
                                                href={`/courses/${e.course.id}`}
                                                className="inline-block whitespace-nowrap rounded-[2px] bg-[#2563EB] px-8 py-3 text-white hover:bg-blue-700"
                                            >
                                                View Course
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </main>
    );
}