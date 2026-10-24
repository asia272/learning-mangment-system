"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

type Item = { label: string; href: string };

export function MobileMenu({ items, primary }: { items: Item[]; primary?: Item }) {
    const [open, setOpen] = useState(false);

    // close on Escape, and stop the page behind from scrolling while open
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        document.addEventListener("keydown", onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [open]);

    return (
        <div className="md:hidden">
            <button
                type="button"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                onClick={() => setOpen((o) => !o)}
                className="flex h-10 w-10 items-center justify-center rounded text-[#0E0E0E]"
            >
                {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {open && (
                <div className="fixed inset-x-0 top-[76px] z-40 border-b border-gray-300 bg-[#E6FFFF] px-4 pb-5 pt-2 shadow-md">
                    <ul className="flex flex-col">
                        {items.map((item) => (
                            <li key={item.href + item.label}>
                                <Link
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    className="block border-b border-gray-300/70 py-3 text-[#404040]"
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {primary && (
                        <Link
                            href={primary.href}
                            onClick={() => setOpen(false)}
                            className="mt-4 block rounded-full bg-[#2563EB] py-3 text-center text-white"
                        >
                            {primary.label}
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}