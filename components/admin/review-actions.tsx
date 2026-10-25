"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { reviewApplication, revokeInstructor } from "@/app/admin/actions";

export function ReviewActions({ applicationId }: { applicationId: string }) {
    const [isPending, startTransition] = useTransition();
    const [note, setNote] = useState("");

    function review(decision: "APPROVED" | "REJECTED") {
        startTransition(async () => {
            const res = await reviewApplication(applicationId, decision, note);
            if (!res.success) {
                toast.error(res.error);
                return;
            }
            toast.success(decision === "APPROVED" ? "Instructor approved" : "Application rejected");
        });
    }

    return (
        <div className="mt-4 flex flex-wrap items-center gap-3">
            <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Note to applicant (optional)"
                className="h-10 min-w-[220px] flex-1 rounded-[4px] border border-[#25252580] px-3 text-sm focus:outline-none"
            />
            <button
                disabled={isPending}
                onClick={() => review("APPROVED")}
                className="rounded bg-green-600 px-5 py-2 text-sm text-white hover:opacity-90 disabled:opacity-50"
            >
                Approve
            </button>
            <button
                disabled={isPending}
                onClick={() => review("REJECTED")}
                className="rounded bg-red-600 px-5 py-2 text-sm text-white hover:opacity-90 disabled:opacity-50"
            >
                Reject
            </button>
        </div>
    );
}

export function RevokeButton({ userId }: { userId: string }) {
    const [isPending, startTransition] = useTransition();

    function revoke() {
        if (!confirm("Remove instructor access for this user?")) return;
        startTransition(async () => {
            const res = await revokeInstructor(userId);
            if (!res.success) {
                toast.error(res.error);
                return;
            }
            toast.success("Instructor access removed");
        });
    }

    return (
        <button
            disabled={isPending}
            onClick={revoke}
            className="rounded border border-red-300 px-4 py-1.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
        >
            Revoke
        </button>
    );
}