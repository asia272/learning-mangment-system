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
        <aside className="w-16 shrink-0 overflow-y-auto border-r border-[#2525254D] bg-white md:w-[251px]">
            <nav className="flex flex-col pt-1">
                {links.map(({ href, label, icon: Icon }) => {
                    const active =
                        href === "/instructor" ? pathname === href : pathname.startsWith(href);

                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`relative flex h-[47px] items-center justify-center gap-3  text-base font-normal leading-none text-[#252525] md:justify-start md:px-8 ${active ? "bg-[#5F6FFF]/10" : "hover:bg-gray-50"
                                }`}
                        >
                            <Icon className="h-6 w-6 shrink-0" strokeWidth={1.75} />
                            <span className="hidden md:inline">{label}</span>

                            {active && (
                                <span className="absolute right-0 top-0 h-[47px] w-[6px] bg-[#5F6FFF]" />
                            )}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}