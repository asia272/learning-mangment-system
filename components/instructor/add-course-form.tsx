"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, CloudUpload, X } from "lucide-react";
import { toast } from "sonner";
import { RichTextEditor } from "./rich-text-editor";
import { ChapterDialog } from "./chapter-dialog";
import { LectureDialog, type LectureDraft } from "./lecture-dialog";
import { uploadToCloudinary } from "@/lib/cloudinary-upload";
import { createCourse } from "@/app/instructor/add-course/actions";
import type { CourseInput } from "@/lib/validations/course";

type ChapterDraft = {
    id: string;
    title: string;
    collapsed: boolean;
    lectures: LectureDraft[];
};

const inputClass =
    "h-10 w-full max-w-[476px] rounded-[4px] border border-[#25252580] px-4 text-gray-800 focus:outline-none";
const smallInputClass =
    "h-10 w-44 rounded-[4px] border border-[#25252580] px-4 text-gray-800 focus:outline-none";
const labelClass = "mb-2 block text-gray-500";

export function AddCourseForm() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("0"); // dollars, converted to cents on submit
    const [discount, setDiscount] = useState("0");
    const [thumbnail, setThumbnail] = useState<{ url: string; publicId: string } | null>(null);
    const [thumbUploading, setThumbUploading] = useState(false);
    const [chapters, setChapters] = useState<ChapterDraft[]>([]);
    const [chapterDialogOpen, setChapterDialogOpen] = useState(false);
    const [lectureDialogChapterId, setLectureDialogChapterId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    /* ---------- chapters and lectures ---------- */

    const addChapter = (chapterTitle: string) => {
        setChapters((cs) => [
            ...cs,
            { id: crypto.randomUUID(), title: chapterTitle, collapsed: false, lectures: [] },
        ]);
        setChapterDialogOpen(false);
    };

    const updateChapter = (id: string, patch: Partial<ChapterDraft>) =>
        setChapters((cs) => cs.map((c) => (c.id === id ? { ...c, ...patch } : c)));

    const removeChapter = (id: string) =>
        setChapters((cs) => cs.filter((c) => c.id !== id));

    const addLecture = (chapterId: string, lecture: LectureDraft) => {
        setChapters((cs) =>
            cs.map((c) => (c.id === chapterId ? { ...c, lectures: [...c.lectures, lecture] } : c))
        );
        setLectureDialogChapterId(null);
    };

    const removeLecture = (chapterId: string, lectureId: string) =>
        setChapters((cs) =>
            cs.map((c) =>
                c.id === chapterId ? { ...c, lectures: c.lectures.filter((l) => l.id !== lectureId) } : c
            )
        );

    /* ---------- thumbnail ---------- */

    async function handleThumbnail(file?: File) {
        if (!file) return;
        setThumbUploading(true);
        setError(null);
        try {
            const r = await uploadToCloudinary(file, "image");
            setThumbnail({ url: r.url, publicId: r.publicId });
        } catch {
            setError("Thumbnail upload failed. Please try again.");
        } finally {
            setThumbUploading(false);
        }
    }

    /* ---------- submit ---------- */

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);

        if (thumbUploading) return setError("Please wait for the thumbnail to finish uploading.");
        if (!thumbnail) return setError("Please upload a thumbnail");

        const payload: CourseInput = {
            title,
            description,
            price: Math.round(Number(price) * 100),
            discountPercent: Math.round(Number(discount)),
            thumbnailUrl: thumbnail.url,
            thumbnailPublicId: thumbnail.publicId,
            chapters: chapters.map((c) => ({
                title: c.title,
                lectures: c.lectures.map((l) => ({
                    title: l.title,
                    duration: l.duration,
                    videoUrl: l.videoUrl,
                    videoPublicId: l.videoPublicId,
                    isPreviewFree: l.isPreviewFree,
                })),
            })),
        };

        startTransition(async () => {
            const toastId = toast.loading("Saving course...");
            try {
                const res = await createCourse(payload);
                if (!res.success) {
                    setError(res.error);
                    toast.error(res.error, { id: toastId });
                    return;
                }
                toast.success("Course added successfully", { id: toastId });
                router.push("/instructor/my-courses");
            } catch {
                setError("Something went wrong. Please try again.");
                toast.error("Something went wrong. Please try again.", { id: toastId });
            }
        });
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
                <div>
                    <label className={labelClass}>Course Title</label>
                    <input
                        className={inputClass}
                        placeholder="Type here"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className="max-w-[476px]">
                    <label className={labelClass}>Course Description</label>
                    <RichTextEditor value={description} onChange={setDescription} />
                </div>

                <div className="flex max-w-[476px] items-start justify-between gap-4">
                    <div>
                        <label className={labelClass}>Course Price</label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className={smallInputClass}
                        />
                    </div>

                    <div className="flex items-center gap-3 pt-8">
                        <span className="text-gray-500">Course Thumbnail</span>
                        <label className="flex h-10 w-10 cursor-pointer items-center justify-center rounded bg-blue-500 text-white hover:bg-blue-600">
                            <CloudUpload className="h-5 w-5" />
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={(e) => handleThumbnail(e.target.files?.[0])}
                            />
                        </label>
                        {thumbUploading && <span className="text-sm text-gray-500">Uploading...</span>}
                        {thumbnail && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={thumbnail.url} alt="Thumbnail preview" className="h-10 rounded" />
                        )}
                    </div>
                </div>

                <div>
                    <label className={labelClass}>Discount %</label>
                    <input
                        type="number"
                        min="0"
                        max="100"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        className={smallInputClass}
                    />
                </div>

                {/* Chapters */}
                <div className="max-w-[476px] space-y-4">
                    {chapters.map((chapter, ci) => (
                        <div key={chapter.id} className="rounded-lg border border-gray-200 bg-white">
                            <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-4 text-gray-700">
                                <button
                                    type="button"
                                    aria-label="Toggle chapter"
                                    onClick={() => updateChapter(chapter.id, { collapsed: !chapter.collapsed })}
                                >
                                    <ChevronDown
                                        className={`h-5 w-5 transition-transform ${chapter.collapsed ? "-rotate-90" : ""}`}
                                    />
                                </button>
                                <span className="font-semibold">{ci + 1}</span>
                                <input
                                    value={chapter.title}
                                    onChange={(e) => updateChapter(chapter.id, { title: e.target.value })}
                                    className="min-w-0 flex-1 bg-transparent font-semibold focus:outline-none"
                                />
                                <span className="whitespace-nowrap text-sm">{chapter.lectures.length} Lectures</span>
                                <button
                                    type="button"
                                    aria-label="Remove chapter"
                                    onClick={() => removeChapter(chapter.id)}
                                    className="text-gray-500 hover:text-red-600"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {!chapter.collapsed && (
                                <div className="space-y-3 p-4">
                                    {chapter.lectures.map((lecture, li) => (
                                        <div
                                            key={lecture.id}
                                            className="flex items-center justify-between gap-3 text-sm text-gray-700"
                                        >
                                            <span className="min-w-0 truncate">
                                                {li + 1}. {lecture.title} - {Math.max(1, Math.round(lecture.duration / 60))} mins
                                                {lecture.isPreviewFree && " - Free Preview"}
                                            </span>
                                            <button
                                                type="button"
                                                aria-label="Remove lecture"
                                                onClick={() => removeLecture(chapter.id, lecture.id)}
                                                className="text-gray-500 hover:text-red-600"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}

                                    <button
                                        type="button"
                                        onClick={() => setLectureDialogChapterId(chapter.id)}
                                        className="rounded bg-gray-100 px-4 py-3 text-gray-700 hover:bg-gray-200"
                                    >
                                        + Add Lecture
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={() => setChapterDialogOpen(true)}
                        className="w-full rounded-lg bg-blue-100 py-4 text-center text-gray-700 hover:bg-blue-200"
                    >
                        + Add Chapter
                    </button>
                </div>

                {error && <p className="text-red-600">{error}</p>}

                <button
                    type="submit"
                    disabled={isPending}
                    className="rounded bg-black px-10 py-4 font-medium text-white disabled:opacity-50"
                >
                    {isPending ? "SAVING..." : "ADD"}
                </button>
            </form>

            {chapterDialogOpen && (
                <ChapterDialog onAdd={addChapter} onClose={() => setChapterDialogOpen(false)} />
            )}

            {lectureDialogChapterId && (
                <LectureDialog
                    onAdd={(lecture) => addLecture(lectureDialogChapterId, lecture)}
                    onClose={() => setLectureDialogChapterId(null)}
                />
            )}
        </>
    );
}