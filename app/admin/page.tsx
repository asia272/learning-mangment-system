import Link from "next/link";
import { Users, GraduationCap, BookOpen, ShoppingCart, DollarSign, ClipboardList } from "lucide-react";
import { getAdminStats, getRecentEnrollments } from "@/lib/queries/admin";
import { formatMoney } from "@/lib/format";
import { StatCard } from "@/components/instructor/stat-card";
import { AdminStatCard } from "@/components/admin/stat-card";

export default async function AdminOverviewPage() {
    const [stats, recent] = await Promise.all([getAdminStats(), getRecentEnrollments()]);

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-2xl font-semibold text-gray-800">Overview</h1>
                <p className="mt-1 text-sm text-gray-500">Everything happening on the platform.</p>
            </div>

            <div className="flex flex-wrap gap-5">
                <AdminStatCard icon={Users} value={stats.totalUsers} label="Total Users" />
                <AdminStatCard icon={GraduationCap} value={stats.instructors} label="Instructors" />
                <AdminStatCard icon={BookOpen} value={`${stats.publishedCourses}/${stats.courses}`} label="Live Courses" />
                <AdminStatCard icon={ShoppingCart} value={stats.enrollments} label="Enrolments" />
                <AdminStatCard icon={DollarSign} value={formatMoney(stats.revenue)} label="Total Revenue" />
                <AdminStatCard icon={ClipboardList} value={stats.pending} label="Pending Requests" />
            </div>

            {stats.pending > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-300 bg-amber-50 px-5 py-4">
                    <p className="text-sm text-amber-800">
                        {stats.pending} instructor {stats.pending === 1 ? "request is" : "requests are"} waiting
                        for your review.
                    </p>
                    <Link
                        href="/admin/applications"
                        className="rounded bg-[#0260FF] px-4 py-2 text-sm text-white hover:opacity-90"
                    >
                        Review now
                    </Link>
                </div>
            )}

            <section>
                <h2 className="mb-4 text-lg font-semibold text-gray-800">Recent enrolments</h2>
                <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                    <table className="w-full min-w-[560px] text-left text-sm">
                        <thead className="border-b border-gray-200 text-gray-500">
                            <tr>
                                <th className="px-5 py-3 font-medium">Student</th>
                                <th className="px-5 py-3 font-medium">Course</th>
                                <th className="px-5 py-3 font-medium">Paid</th>
                                <th className="px-5 py-3 font-medium">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recent.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-5 py-8 text-center text-gray-500">
                                        No enrolments yet.
                                    </td>
                                </tr>
                            )}
                            {recent.map((e) => (
                                <tr key={e.id} className="border-b border-gray-100 last:border-0">
                                    <td className="px-5 py-3 text-gray-800">{e.user.name ?? e.user.email}</td>
                                    <td className="px-5 py-3 text-gray-600">{e.course.title}</td>
                                    <td className="px-5 py-3 text-gray-600">
                                        {e.amountPaid === 0 ? "Free" : formatMoney(e.amountPaid)}
                                    </td>
                                    <td className="px-5 py-3 text-gray-500">{e.createdAt.toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}