import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ReviewActions } from "@/components/admin/review-actions";

const tabs = [
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
    { key: "all", label: "All" },
] as const;

const statusStyle = {
    PENDING: "bg-amber-100 text-amber-800",
    APPROVED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
};

export default async function ApplicationsPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string }>;
}) {
    const { status } = await searchParams;
    const active = tabs.find((t) => t.key === status)?.key ?? "pending";

    const applications = await prisma.instructorApplication.findMany({
        where: active === "all" ? {} : { status: active.toUpperCase() as "PENDING" | "APPROVED" | "REJECTED" },
        orderBy: { createdAt: active === "pending" ? "asc" : "desc" },
        take: 100,
        include: { user: { select: { name: true, email: true } } },
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-gray-800">Instructor applications</h1>
                <p className="mt-1 text-sm text-gray-500">Approve or reject students who want to teach.</p>
            </div>

            <div className="flex flex-wrap gap-2">
                {tabs.map((t) => (
                    <Link
                        key={t.key}
                        href={`/admin/applications?status=${t.key}`}
                        className={`rounded-full px-4 py-1.5 text-sm ${active === t.key
                                ? "bg-[#0260FF] text-white"
                                : "border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                            }`}
                    >
                        {t.label}
                    </Link>
                ))}
            </div>

            {applications.length === 0 ? (
                <p className="rounded-lg border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
                    Nothing here.
                </p>
            ) : (
                <div className="space-y-4">
                    {applications.map((a) => (
                        <div key={a.id} className="rounded-lg border border-gray-200 bg-white p-6">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <p className="font-medium text-gray-800">
                                    {a.user.name ?? "Unnamed"}{" "}
                                    <span className="font-normal text-gray-500">· {a.user.email}</span>
                                </p>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-gray-500">{a.createdAt.toLocaleDateString()}</span>
                                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyle[a.status]}`}>
                                        {a.status.charAt(0) + a.status.slice(1).toLowerCase()}
                                    </span>
                                </div>
                            </div>
                            <p className="mt-3 text-sm font-medium text-gray-700">{a.headline}</p>
                            <p className="mt-1 text-sm text-gray-500">Teaches: {a.expertise}</p>
                            <p className="mt-3 whitespace-pre-line text-sm text-gray-600">{a.bio}</p>

                            {a.status === "PENDING" ? (
                                <ReviewActions applicationId={a.id} />
                            ) : (
                                a.reviewNote && (
                                    <p className="mt-4 rounded bg-gray-50 p-3 text-sm text-gray-600">
                                        Note: {a.reviewNote}
                                    </p>
                                )
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}