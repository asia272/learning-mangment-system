import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { getCurrentUser } from "@/lib/current-user";
import { MobileMenu } from "./mobile-menu";

const linkClass = "text-[15px] text-[#404040] hover:text-[#0E0E0E]";

function Divider() {
    return <span className="h-4 w-px bg-gray-400" aria-hidden="true" />;
}

export async function StudentNavbar() {
    const user = await getCurrentUser();
    const isInstructor = user?.role === "INSTRUCTOR";

    // the same links are used for desktop and for the mobile menu
    const links = user
        ? isInstructor
            ? [
                { label: "Dashboard", href: "/instructor" },
                { label: "Add Courses", href: "/instructor/add-course" },
                { label: "Courses", href: "/courses" },
            ]
            : [
                { label: "Courses", href: "/courses" },
                { label: "My Enrollments", href: "/my-enrollments" },
            ]
        : [
            { label: "Add Courses", href: "/instructor/add-course" },
            { label: "Login", href: "/sign-in" },
        ];

    const primary = user ? undefined : { label: "Create Account", href: "/sign-up" };

    return (
        <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-400 bg-[#E6FFFF]">
            <div className="mx-auto flex h-[76px] max-w-[1180px] items-center justify-between px-4 sm:px-6">
                <Link href="/" aria-label="Edemy home" className="shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/assets/logo.svg" alt="Edemy" className="h-9 w-auto sm:h-10" />
                </Link>

                {/* desktop */}
                <nav className="hidden items-center gap-4 md:flex">
                    {links.map((item, i) => (
                        <span key={item.href + item.label} className="flex items-center gap-4">
                            <Link href={item.href} className={linkClass}>
                                {item.label}
                            </Link>
                            {i < links.length - 1 && <Divider />}
                        </span>
                    ))}

                    {primary && (
                        <Link
                            href={primary.href}
                            className="ml-2 rounded-full bg-[#2563EB] px-7 py-3 text-[15px] text-white hover:bg-blue-700"
                        >
                            {primary.label}
                        </Link>
                    )}

                    {user && (
                        <span className="ml-2 flex items-center">
                            <UserButton />
                        </span>
                    )}
                </nav>

                {/* mobile */}
                <div className="flex items-center gap-2 md:hidden">
                    {user && <UserButton />}
                    <MobileMenu items={links} primary={primary} />
                </div>
            </div>
        </header>
    );
}