"use client";

import { useState, useTransition } from "react";
import { startCheckout } from "@/app/(student)/courses/[courseId]/actions";

export function EnrollButton({ courseId }: { courseId: string }) {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    function onClick() {
        setError(null);
        startTransition(async () => {
            const res = await startCheckout(courseId);
            if (!res.success) {
                setError(res.error);
                return;
            }
            window.location.href = res.url; // Stripe's page, or /my-enrollments for free courses
        });
    }

    return (
        <div>
            <button
                type="button"
                onClick={onClick}
                disabled={isPending}
                className="block w-full rounded bg-[#0260FF] py-3 text-center font-medium text-white hover:opacity-90 disabled:opacity-60"
            >
                {isPending ? "Redirecting..." : "Enroll Now"}
            </button>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
    );
}