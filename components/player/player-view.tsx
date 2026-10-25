"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { AssetIcon } from "@/components/ui/asset-icon";
import { RateCourse } from "./rate-course";
import { setLectureCompleted } from "@/app/(student)/player/[courseId]/actions";
import { formatTotalDuration, plural } from "@/lib/format";

type Lecture = { id: string; title: string; duration: number; videoUrl: string };
type Chapter = { id: string; title: string; lectures: Lecture[] };

type Props = {
    course: { id: string; title: string; thumbnailUrl: string; chapters: Chapter[] };
    completedIds: string[];
    myRating: number;
};

export function PlayerView({ course, completedIds, myRating }: Props) {
    const [completed, setCompleted] = useState<Set<string>>(new Set(completedIds));
    const [openChapters, setOpenChapters] = useState<Set<string>>(
        new Set(course.chapters.map((c) => c.id))
    );
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const lectures = course.chapters.flatMap((c) => c.lectures);
    const current = lectures.find((l) => l.id === currentId) ?? null;
    const done = completed.size;
    const percent = lectures.length ? Math.round((done / lectures.length) * 100) : 0;

    function toggleChapter(id: string) {
        setOpenChapters((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }

    function setDone(lectureId: string, value: boolean) {
        // update instantly, undo if the server fails
        setCompleted((prev) => {
            const next = new Set(prev);
            if (value) next.add(lectureId);
            else next.delete(lectureId);
            return next;
        });

        startTransition(async () => {
            const res = await setLectureCompleted(lectureId, value);
            if (res.success) {
                toast.success(value ? "Lecture marked as completed" : "Lecture marked as not completed");
            } else {
                setCompleted((prev) => {
                    const next = new Set(prev);
                    if (value) next.delete(lectureId);
                    else next.add(lectureId);
                    return next;
                });
                toast.error(res.error);
            }
        });
    }

    return (
        <div className="mx-auto grid max-w-[1180px] gap-10 px-6 py-12 lg:grid-cols-[1fr_480px]">
            {/* ---------- left: structure + rating ---------- */}
            <div className="min-w-0">
                <h1 className="text-2xl font-semibold text-[#0E0E0E]">Course Structure</h1>
                <p className="mt-1 text-sm text-[#565656]">
                    {done} of {plural(lectures.length, "lecture")} completed ({percent}%)
                </p>

                <div className="mt-6 space-y-4">
                    {course.chapters.map((chapter) => {
                        const isOpen = openChapters.has(chapter.id);
                        const seconds = chapter.lectures.reduce((s, l) => s + l.duration, 0);

                        return (
                            <div key={chapter.id} className="rounded border border-[#E3E3E3] bg-white">
                                <button
                                    type="button"
                                    onClick={() => toggleChapter(chapter.id)}
                                    aria-expanded={isOpen}
                                    className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
                                >
                                    <span className="flex items-center gap-3 font-medium text-[#0E0E0E]">
                                        <AssetIcon
                                            name="down_arrow_icon.svg"
                                            size={14}
                                            className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                                        />
                                        {chapter.title}
                                    </span>
                                    <span className="whitespace-nowrap text-sm text-[#404040]">
                                        {plural(chapter.lectures.length, "lecture")} - {formatTotalDuration(seconds)}
                                    </span>
                                </button>

                                {isOpen && (
                                    <ul className="space-y-3 border-t border-[#E3E3E3] px-4 py-4">
                                        {chapter.lectures.map((lecture) => {
                                            const isDone = completed.has(lecture.id);
                                            const isCurrent = lecture.id === currentId;
                                            return (
                                                <li
                                                    key={lecture.id}
                                                    className="flex items-center justify-between gap-4 text-[#565656]"
                                                >
                                                    <span className="flex min-w-0 items-center gap-3 pl-3">
                                                        <AssetIcon
                                                            name={isDone ? "blue_tick_icon.svg" : "play_icon.svg"}
                                                            size={20}
                                                            className="shrink-0"
                                                        />
                                                        <span className={`truncate ${isCurrent ? "font-medium text-[#0E0E0E]" : ""}`}>
                                                            {lecture.title}
                                                        </span>
                                                    </span>
                                                    <span className="flex shrink-0 items-center gap-4 whitespace-nowrap text-sm">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setCurrentId(lecture.id);
                                                                window.scrollTo({ top: 0, behavior: "smooth" });
                                                            }}
                                                            className="text-[#2563EB] hover:underline"
                                                        >
                                                            Watch
                                                        </button>
                                                        <span>{Math.max(1, Math.round(lecture.duration / 60))} minutes</span>
                                                    </span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="mt-12">
                    <RateCourse courseId={course.id} initialRating={myRating} />
                </div>
            </div>

            {/* ---------- right: video or thumbnail ---------- */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
                {current ? (
                    <div>
                        <video
                            key={current.id}
                            src={current.videoUrl}
                            controls
                            controlsList="nodownload"
                            playsInline
                            autoPlay
                            className="aspect-video w-full rounded bg-black"
                            onEnded={() => {
                                if (!completed.has(current.id)) setDone(current.id, true);
                            }}
                        />
                        <div className="mt-3 flex items-center justify-between gap-4">
                            <p className="min-w-0 truncate text-[#0E0E0E]">{current.title}</p>
                            <button
                                type="button"
                                disabled={isPending}
                                onClick={() => setDone(current.id, !completed.has(current.id))}
                                className="shrink-0 rounded bg-[#2563EB] px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-60"
                            >
                                {completed.has(current.id) ? "Completed" : "Mark Complete"}
                            </button>
                        </div>
                    </div>
                ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={course.thumbnailUrl}
                        alt={course.title}
                        className="aspect-video w-full rounded object-cover"
                    />
                )}
            </aside>
        </div>
    );
}