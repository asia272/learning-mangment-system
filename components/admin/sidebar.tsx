"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ClipboardList, Users, BookOpen, ArrowLeft, GraduationCap } from "lucide-react";

export function AdminSidebar({
    pending,
    isInstructor,
}: {
    pending: number;
    isInstructor: boolean;
}) {
    const pathname = usePathname();

    const links = [
        { href: "/admin", label: "Overview", icon: LayoutDashboard, badge: 0 },
        { href: "/admin/applications", label: "Applications", icon: ClipboardList, badge: pending },
        { href: "/admin/users", label: "Users", icon: Users, badge: 0 },
        { href: "/admin/courses", label: "Courses", icon: BookOpen, badge: 0 },
    ];

    const itemClass = "relative flex items-center justify-center gap-4 py-5 text-slate-800 md:justify-start md:px-12";

    return (
        <aside className="flex w-16 shrink-0 flex-col justify-between overflow-y-auto border-r border-gray-300 bg-white md:w-72">
            <nav className="flex flex-col pt-1">
                {links.map(({ href, label, icon: Icon, badge }) => {
                    const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`${itemClass} ${active ? "border-r-[6px] border-indigo-500 bg-indigo-50" : "hover:bg-gray-50"
                                }`}
                        >
                            <Icon className="h-6 w-6 shrink-0" strokeWidth={1.75} />
                            <span className="hidden md:inline">{label}</span>
                            {badge > 0 && (
                                <span className="absolute right-2 top-3 rounded-full bg-red-500 px-1.5 text-[10px] font-semibold leading-4 text-white md:static md:ml-auto md:px-2 md:text-xs">
                                    {badge}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t border-gray-200 py-2">
                {isInstructor && (
                    <Link href="/instructor" className={`${itemClass} py-4 text-sm hover:bg-gray-50`}>
                        <GraduationCap className="h-5 w-5 shrink-0" strokeWidth={1.75} />
                        <span className="hidden md:inline">Instructor area</span>
                    </Link>
                )}
                <Link href="/" className={`${itemClass} py-4 text-sm hover:bg-gray-50`}>
                    <ArrowLeft className="h-5 w-5 shrink-0" strokeWidth={1.75} />
                    <span className="hidden md:inline">Back to site</span>
                </Link>
            </div>
        </aside>
    );
}