"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { applyForInstructor } from "@/app/(student)/become-instructor/actions";

const inputClass =
    "w-full rounded-[4px] border border-[#25252580] px-4 py-2.5 text-gray-800 focus:outline-none";

export function ApplyInstructorForm() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [headline, setHeadline] = useState("");
    const [expertise, setExpertise] = useState("");
    const [bio, setBio] = useState("");

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        startTransition(async () => {
            const res = await applyForInstructor({ headline, expertise, bio });
            if (!res.success) {
                toast.error(res.error);
                return;
            }
            toast.success("Application submitted. We'll review it soon.");
            router.refresh();
        });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label className="mb-2 block text-gray-500">Professional headline</label>
                <input
                    className={inputClass}
                    placeholder="e.g. Senior Full-Stack Developer"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                />
            </div>
            <div>
                <label className="mb-2 block text-gray-500">What will you teach?</label>
                <input
                    className={inputClass}
                    placeholder="e.g. React, Next.js, Node.js"
                    value={expertise}
                    onChange={(e) => setExpertise(e.target.value)}
                />
            </div>
            <div>
                <label className="mb-2 block text-gray-500">About you</label>
                <textarea
                    rows={6}
                    className={inputClass}
                    placeholder="Your experience, background, and why you want to teach..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                />
                <p className="mt-1 text-xs text-gray-400">{bio.trim().length}/1000</p>
            </div>
            <button
                type="submit"
                disabled={isPending}
                className="rounded bg-[#0260FF] px-8 py-3 font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
                {isPending ? "Submitting..." : "Submit Application"}
            </button>
        </form>
    );
}