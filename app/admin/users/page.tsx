import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { RevokeButton } from "@/components/admin/review-actions";

export default async function UsersPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; role?: string }>;
}) {
    const admin = await requireAdmin();
    const { q, role } = await searchParams;
    const query = q?.trim();
    const roleFilter = role === "INSTRUCTOR" || role === "STUDENT" ? role : undefined;

    const users = await prisma.user.findMany({
        where: {
            ...(roleFilter && { role: roleFilter }),
            ...(query && {
                OR: [
                    { name: { contains: query, mode: "insensitive" } },
                    { email: { contains: query, mode: "insensitive" } },
                ],
            }),
        },
        orderBy: { createdAt: "desc" },
        take: 100,
        include: { _count: { select: { enrollments: true, courses: true } } },
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-gray-800">Users</h1>
                <p className="mt-1 text-sm text-gray-500">Showing the latest {users.length} matching users.</p>
            </div>

            <form method="get" className="flex flex-wrap gap-3">
                <input
                    name="q"
                    defaultValue={query}
                    placeholder="Search name or email"
                    className="h-10 w-full max-w-xs rounded-[4px] border border-[#25252580] bg-white px-3 text-sm focus:outline-none"
                />
                <select
                    name="role"
                    defaultValue={roleFilter ?? ""}
                    className="h-10 rounded-[4px] border border-[#25252580] bg-white px-3 text-sm focus:outline-none"
                >
                    <option value="">All roles</option>
                    <option value="STUDENT">Students</option>
                    <option value="INSTRUCTOR">Instructors</option>
                </select>
                <button className="h-10 rounded bg-[#0260FF] px-6 text-sm text-white hover:opacity-90">
                    Search
                </button>
            </form>

            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                <table className="w-full min-w-[720px] text-left text-sm">
                    <thead className="border-b border-gray-200 text-gray-500">
                        <tr>
                            <th className="px-5 py-3 font-medium">User</th>
                            <th className="px-5 py-3 font-medium">Role</th>
                            <th className="px-5 py-3 font-medium">Enrolled</th>
                            <th className="px-5 py-3 font-medium">Courses</th>
                            <th className="px-5 py-3 font-medium">Joined</th>
                            <th className="px-5 py-3" />
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-5 py-8 text-center text-gray-500">
                                    No users found.
                                </td>
                            </tr>
                        )}
                        {users.map((u) => (
                            <tr key={u.id} className="border-b border-gray-100 last:border-0">
                                <td className="px-5 py-3">
                                    <p className="text-gray-800">{u.name ?? "Unnamed"}</p>
                                    <p className="text-xs text-gray-500">{u.email}</p>
                                </td>
                                <td className="px-5 py-3">
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-medium ${u.role === "INSTRUCTOR"
                                                ? "bg-indigo-50 text-indigo-600"
                                                : "bg-gray-100 text-gray-600"
                                            }`}
                                    >
                                        {u.role === "INSTRUCTOR" ? "Instructor" : "Student"}
                                    </span>
                                    {u.isAdmin && (
                                        <span className="ml-2 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
                                            Admin
                                        </span>
                                    )}
                                </td>
                                <td className="px-5 py-3 text-gray-600">{u._count.enrollments}</td>
                                <td className="px-5 py-3 text-gray-600">{u._count.courses}</td>
                                <td className="px-5 py-3 text-gray-500">{u.createdAt.toLocaleDateString()}</td>
                                <td className="px-5 py-3 text-right">
                                    {u.role === "INSTRUCTOR" && u.id !== admin.id && <RevokeButton userId={u.id} />}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}