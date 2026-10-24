import Link from "next/link";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { Zap } from "lucide-react";
import { getCurrentUser } from "@/lib/current-user";

export async function StudentNavbar() {
    const user = await getCurrentUser();

    return (
        <header className="border-b border-[#E3E3E3] bg-white">
            <div className="mx-auto flex h-20 max-w-[1180px] items-center justify-between px-6">
                <Link href="/courses" className="flex items-center gap-2">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0260FF] text-white">
                        <Zap className="h-5 w-5 fill-white" />
                    </span>
                    <span className="text-3xl font-semibold text-[#0E0E0E]">Edemy</span>
                </Link>

                <nav className="flex items-center gap-5 text-[#565656]">
                    {user ? (
                        <>
                            {user.role === "INSTRUCTOR" && (
                                <Link href="/instructor" className="hover:text-[#0E0E0E]">
                                    Instructor Dashboard
                                </Link>
                            )}
                            <Link href="/my-enrollments" className="hover:text-[#0E0E0E]">
                                My Enrollments
                            </Link>
                            <UserButton />
                        </>
                    ) : (
                        <SignInButton>
                            <button className="rounded-full bg-[#0260FF] px-6 py-2.5 text-white hover:opacity-90">
                                Create Account
                            </button>
                        </SignInButton>
                    )}
                </nav>
            </div>
        </header>
    );
}