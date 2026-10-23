"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useClerk } from "@clerk/nextjs";
import { Zap, User } from "lucide-react";

type Props = { name: string; imageUrl: string | null };

export function InstructorHeader({ name, imageUrl }: Props) {
    const { signOut, openUserProfile } = useClerk();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // close the dropdown when clicking outside or pressing Escape
    useEffect(() => {
        function onClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        }
        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape") setOpen(false);
        }
        document.addEventListener("mousedown", onClick);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onClick);
            document.removeEventListener("keydown", onKey);
        };
    }, []);

    return (
        <header className="flex h-[88px] shrink-0 items-center justify-between border-b border-gray-300 bg-white px-6 md:px-16">
            <Link href="/instructor" className="flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
                    <Zap className="h-5 w-5 fill-white" />
                </span>
                <span className="text-3xl font-semibold text-slate-900">Edemy</span>
            </Link>

            <div ref={ref} className="relative flex items-center gap-4">
                <span className="hidden text-slate-700 sm:inline">Hi! {name}</span>

                <button
                    type="button"
                    aria-label="Account menu"
                    aria-expanded={open}
                    onClick={() => setOpen((o) => !o)}
                    className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-sky-50 text-slate-700"
                >
                    {imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={imageUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                        <User className="h-6 w-6" />
                    )}
                </button>

                {open && (
                    <div className="absolute right-0 top-full z-50 mt-3 w-52 rounded border border-gray-200 bg-white py-3 shadow-sm">
                        <button
                            type="button"
                            onClick={() => {
                                setOpen(false);
                                openUserProfile();
                            }}
                            className="block w-full px-5 py-2 text-left text-slate-800 hover:bg-gray-50"
                        >
                            My Profile
                        </button>
                        <button
                            type="button"
                            onClick={() => signOut({ redirectUrl: "/" })}
                            className="block w-full px-5 py-2 text-left text-slate-800 hover:bg-gray-50"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}