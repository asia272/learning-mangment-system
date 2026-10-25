"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useClerk } from "@clerk/nextjs";

type Props = { name: string; imageUrl: string | null };

const menuItemClass =
    "block w-full px-5 py-2 text-left text-[15px] font-normal leading-none text-[#4A4A4A] hover:bg-gray-50";

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
        <header className="flex h-[74px] shrink-0 items-center justify-between border-b border-[#2525254D] bg-white px-6 md:px-10">
            <Link href="/instructor" className="flex items-center">
                <Image
                    src="/assets/logo.svg"
                    alt="Edemy"
                    width={115}
                    height={34}
                    priority
                    className="h-[34px] w-[115px] object-contain"
                />
            </Link>

            <div ref={ref} className="relative flex items-center gap-4">
                <span className="hidden font-[family-name:var(--font-outfit)] text-[15px] font-normal leading-none text-[#4A4A4A] sm:inline">
                    Hi! {name}
                </span>

                <button
                    type="button"
                    aria-label="Account menu"
                    aria-expanded={open}
                    onClick={() => setOpen((o) => !o)}
                    className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-sky-50"
                >
                    {imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={imageUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                        <Image
                            src="/assets/user_icon.svg"
                            alt=""
                            width={48}
                            height={48}
                            className="h-full w-full object-cover"
                        />
                    )}
                </button>

                {open && (
                    <div className="absolute right-0 top-full z-50 mt-3 w-52 rounded-[6px] border border-[#2525254D] bg-white py-3 shadow-[0px_0px_4px_0px_#0000001A]">
                        <button
                            type="button"
                            onClick={() => {
                                setOpen(false);
                                openUserProfile();
                            }}
                            className={menuItemClass}
                        >
                            My Profile
                        </button>
                        <button
                            type="button"
                            onClick={() => signOut({ redirectUrl: "/" })}
                            className={menuItemClass}
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}