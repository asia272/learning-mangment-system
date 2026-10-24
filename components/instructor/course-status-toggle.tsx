"use client";

import { useState, useTransition } from "react";
import { setCoursePublished } from "@/app/instructor/my-courses/actions";

type Props = { courseId: string; initialPublished: boolean };

export function CourseStatusToggle({ courseId, initialPublished }: Props) {
    const [published, setPublished] = useState(initialPublished);
    const [isPending, startTransition] = useTransition();

    function toggle() {
        const next = !published;
        setPublished(next); // update instantly, undo if the server fails
        startTransition(async () => {
            const res = await setCoursePublished(courseId, next);
            if (!res.success) setPublished(!next);
        });
    }

    return (
        <div className="flex items-center gap-3">
            <button
                type="button"
                role="switch"
                aria-checked={published}
                aria-label="Toggle course status"
                disabled={isPending}
                onClick={toggle}
                className={`relative h-[21px] w-[39px] shrink-0 rounded-[20px] transition-colors disabled:opacity-60 ${published ? "bg-[#2563EB]" : "bg-[#CBD5E1]"
                    }`}
            >
                <span
                    className={`absolute top-[3px] h-[15px] w-[15px] rounded-full bg-white transition-all ${published ? "left-[20px]" : "left-[4px]"
                        }`}
                />
            </button>
            <span className="inline-block w-[52px] font-[family-name:var(--font-outfit)] text-sm font-normal leading-none text-[#252525B2]">
                {published ? "Live" : "Private"}
            </span>
        </div>
    );
}