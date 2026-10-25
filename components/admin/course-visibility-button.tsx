"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { setCoursePublishedByAdmin } from "@/app/admin/actions";

export function CourseVisibilityButton({
    courseId,
    isPublished,
}: {
    courseId: string;
    isPublished: boolean;
}) {
    const [isPending, startTransition] = useTransition();

    function toggle() {
        if (isPublished && !confirm("Take this course offline? Students can't find it until it's published again.")) {
            return;
        }
        startTransition(async () => {
            const res = await setCoursePublishedByAdmin(courseId, !isPublished);
            if (!res.success) {
                toast.error(res.error);
                return;
            }
            toast.success(isPublished ? "Course is now private" : "Course is now live");
        });
    }

    return (
        <button
            disabled={isPending}
            onClick={toggle}
            className="rounded border border-gray-300 px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
            {isPublished ? "Unpublish" : "Publish"}
        </button>
    );
}