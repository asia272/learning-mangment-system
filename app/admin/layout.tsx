import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AutoRefresh } from "@/components/admin/auto-refresh";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const admin = await requireAdmin();
    const pending = await prisma.instructorApplication.count({ where: { status: "PENDING" } });

    return (
        <div className="flex h-screen flex-col bg-white">
            <header className="flex h-[70px] shrink-0 items-center justify-between border-b border-gray-300 bg-white px-4 sm:px-8">
                <div className="flex items-center">
                    <Link href="/" aria-label="Edemy home">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/assets/logo.svg" alt="Edemy" className="h-9 w-auto" />
                    </Link>
                    <span className="ml-3 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                        Admin
                    </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="hidden sm:inline">Hi! {admin.name ?? "Admin"}</span>
                    <UserButton />
                </div>
            </header>

            <div className="flex min-h-0 flex-1">
                <AdminSidebar pending={pending} isInstructor={admin.role === "INSTRUCTOR"} />
                <main className="min-w-0 flex-1 overflow-y-auto bg-[#F7F9FD] p-6 md:p-10">{children}</main>
            </div>

            <AutoRefresh />
        </div>
    );
}