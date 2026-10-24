"use client";

import { useState } from "react";
import { AssetIcon } from "@/components/ui/asset-icon";
import { formatLectureMinutes, formatTotalDuration, plural } from "@/lib/format";

type Chapter = {
    id: string;
    title: string;
    lectures: { id: string; title: string; duration: number; isPreviewFree: boolean }[];
};

export function CourseStructure({ chapters }: { chapters: Chapter[] }) {
    const [open, setOpen] = useState<Set<string>>(new Set(chapters[0] ? [chapters[0].id] : []));

    function toggle(id: string) {
        setOpen((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }

    return (
        <div className="border border-[#E3E3E3]">
            {chapters.map((chapter) => {
                const isOpen = open.has(chapter.id);
                const seconds = chapter.lectures.reduce((s, l) => s + l.duration, 0);

                return (
                    <div key={chapter.id} className="border-b border-[#E3E3E3] last:border-b-0">
                        <button
                            type="button"
                            onClick={() => toggle(chapter.id)}
                            aria-expanded={isOpen}
                            className="flex w-full items-center justify-between gap-4 bg-[#F7F9FD] px-4 py-4 text-left text-[#0E0E0E]"
                        >
                            <span className="flex items-center gap-3 font-medium">
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
                            <ul className="space-y-3 px-4 py-4">
                                {chapter.lectures.map((lecture) => (
                                    <li
                                        key={lecture.id}
                                        className="flex items-center justify-between gap-4 text-sm text-[#565656]"
                                    >
                                        <span className="flex min-w-0 items-center gap-3">
                                            <AssetIcon name="play_icon.svg" size={20} className="shrink-0" />
                                            <span className="truncate">{lecture.title}</span>
                                            {lecture.isPreviewFree && (
                                                <span className="shrink-0 text-[#0260FF]">Preview</span>
                                            )}
                                        </span>
                                        <span className="whitespace-nowrap">
                                            {formatLectureMinutes(lecture.duration)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                );
            })}
        </div>
    );
}