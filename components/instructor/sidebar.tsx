"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, SquarePlus, BookMarked, UserRoundCheck } from "lucide-react";

const links = [
    { href: "/instructor", label: "Dashboard", icon: House },
    { href: "/instructor/add-course", label: "Add Course", icon: SquarePlus },
    { href: "/instructor/my-courses", label: "My Courses", icon: BookMarked },
    { href: "/instructor/students", label: "Student Enrolled", icon: UserRoundCheck },
];

export function InstructorSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-16 shrink-0 border-r border-gray-300 md:w-64">
            <nav className="flex flex-col pt-4">
                {links.map(({ href, label, icon: Icon }) => {
                    const active =
                        href === "/instructor" ? pathname === href : pathname.startsWith(href);

                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center justify-center gap-4 py-5 text-slate-800 md:justify-start md:px-8 ${active
                                    ? "border-r-[6px] border-indigo-500 bg-indigo-50"
                                    : "hover:bg-gray-50"
                                }`}
                        >
                            <Icon className="h-6 w-6 shrink-0" strokeWidth={1.75} />
                            <span className="hidden md:inline">{label}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}