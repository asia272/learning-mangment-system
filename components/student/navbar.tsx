import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";

const buttonClass =
    "rounded-full bg-[#2563EB] px-5 py-2.5 text-sm text-white hover:bg-blue-700 sm:px-7 sm:py-3 sm:text-[15px]";

export async function StudentNavbar() {
    const user = await getCurrentUser();
    const isAdmin = !!user?.isAdmin;
    const isInstructor = user?.role === "INSTRUCTOR";

    // only plain students can have an open request
    let hasPendingApplication = false;
    if (user && !isAdmin && !isInstructor) {
        const pending = await prisma.instructorApplication.findFirst({
            where: { userId: user.id, status: "PENDING" },
            select: { id: true },
        });
        hasPendingApplication = !!pending;
    }

    return (
        <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-400 bg-[#E6FFFF]">
            <div className="mx-auto flex h-[76px] max-w-[1180px] items-center justify-between px-4 sm:px-6">
                <Link href="/" aria-label="Edemy home" className="shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/assets/logo.svg" alt="Edemy" className="h-9 w-auto sm:h-10" />
                </Link>

                <nav className="flex items-center gap-3 sm:gap-4">
                    {!user ? (
                        <Link href="/sign-up" className={buttonClass}>
                            Create Account
                        </Link>
                    ) : isAdmin ? (
                        <>
                            <Link href="/admin" className={buttonClass}>
                                Dashboard
                            </Link>
                            <UserButton />
                        </>
                    ) : isInstructor ? (
                        <>
                            <Link
                                href="/my-enrollments"
                                className="hidden text-[15px] text-[#404040] hover:text-[#0E0E0E] sm:inline"
                            >
                                My Enrollments
                            </Link>
                            <Link href="/instructor" className={buttonClass}>
                                Dashboard
                            </Link>
                            <UserButton />
                        </>
                    ) : (
                        <>
                            {hasPendingApplication ? (
                                <Link
                                    href="/become-instructor"
                                    className="flex items-center gap-2 rounded-full border border-amber-300 bg-amber-100 px-3 py-1.5 text-xs font-medium text-amber-800 sm:px-4 sm:text-sm"
                                >
                                    <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
                                    <span className="hidden sm:inline">Instructor request pending</span>
                                    <span className="sm:hidden">Pending</span>
                                </Link>
                            ) : (
                                <Link
                                    href="/become-instructor"
                                    className="hidden text-[15px] text-[#404040] hover:text-[#0E0E0E] md:inline"
                                >
                                    Apply for Instructor
                                </Link>
                            )}
                            <Link href="/my-enrollments" className={buttonClass}>
                                My Enrollments
                            </Link>
                            <UserButton />
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}