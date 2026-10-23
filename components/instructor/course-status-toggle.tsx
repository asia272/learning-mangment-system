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
                className={`relative h-7 w-14 rounded-full transition-colors disabled:opacity-60 ${published ? "bg-blue-600" : "bg-gray-300"
                    }`}
            >
                <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${published ? "left-8" : "left-1"
                        }`}
                />
            </button>
            <span className="text-gray-600">{published ? "Live" : "Private"}</span>
        </div>
    );
}