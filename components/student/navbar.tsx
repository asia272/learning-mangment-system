import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { getCurrentUser } from "@/lib/current-user";

const buttonClass =
    "rounded-full bg-[#2563EB] px-5 py-2.5 text-sm text-white hover:bg-blue-700 sm:px-7 sm:py-3 sm:text-[15px]";

export async function StudentNavbar() {
    const user = await getCurrentUser();
    const isInstructor = user?.role === "INSTRUCTOR";

    return (
        <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-400 bg-[#E6FFFF]">
            <div className="mx-auto flex h-[76px] max-w-[1180px] items-center justify-between px-4 sm:px-6">
                <Link href="/" aria-label="Edemy home" className="shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/assets/logo.svg" alt="Edemy" className="h-9 w-auto sm:h-10" />
                </Link>

                <nav className="flex items-center gap-3 sm:gap-4">
                    {!user ? (
                        // logged out: one button only (the sign-up page links to sign-in)
                        <Link href="/sign-up" className={buttonClass}>
                            Create Account
                        </Link>
                    ) : (
                        <>
                            {isInstructor ? (
                                <Link href="/instructor" className={buttonClass}>
                                    Dashboard
                                </Link>
                            ) : (
                                <Link href="/my-enrollments" className={buttonClass}>
                                    My Enrollments
                                </Link>
                            )}
                            <UserButton />
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}