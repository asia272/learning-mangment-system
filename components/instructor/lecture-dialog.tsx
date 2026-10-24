"use client";

import { useEffect, useState } from "react";
import { X, CloudUpload } from "lucide-react";
import { uploadToCloudinary } from "@/lib/cloudinary-upload";

export type LectureDraft = {
    id: string;
    title: string;
    duration: number; // seconds
    videoUrl: string;
    videoPublicId?: string;
    isPreviewFree: boolean;
};

type Props = {
    onAdd: (lecture: LectureDraft) => void;
    onClose: () => void;
};

export function LectureDialog({ onAdd, onClose }: Props) {
    const [title, setTitle] = useState("");
    const [video, setVideo] = useState<{ url: string; publicId: string; duration: number } | null>(null);
    const [uploading, setUploading] = useState(false);
    const [isPreviewFree, setIsPreviewFree] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape" && !uploading) onClose();
        }
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose, uploading]);

    async function handleFile(file?: File) {
        if (!file) return;
        setUploading(true);
        setError(null);
        try {
            const r = await uploadToCloudinary(file, "video");
            setVideo({ url: r.url, publicId: r.publicId, duration: r.duration ?? 0 });
        } catch {
            setError("Video upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    }

    function submit() {
        if (!title.trim() || !video) return;
        onAdd({
            id: crypto.randomUUID(),
            title: title.trim(),
            duration: Math.max(1, video.duration),
            videoUrl: video.url,
            videoPublicId: video.publicId,
            isPreviewFree,
        });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#252525B2] p-4">
            <div className="relative w-full max-w-sm space-y-4 rounded-lg bg-white p-6 text-gray-700">
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute right-4 top-4 text-gray-500 hover:text-black"
                >
                    <X className="h-5 w-5" />
                </button>

                <h2 className="text-lg font-semibold">Add Lecture</h2>

                <div>
                    <label className="mb-1 block text-sm">Lecture Title</label>
                    <input
                        autoFocus
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        maxLength={150}
                        placeholder="Type here"
                        className="h-10 w-full rounded-[4px] border border-[#25252580] px-4 text-gray-800 focus:outline-none"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm">Lecture Video</label>
                    <label className="flex h-10 cursor-pointer items-center gap-3 rounded-[4px] border border-dashed border-[#25252580] px-3 hover:bg-gray-50">
                        <CloudUpload className="h-5 w-5 shrink-0 text-blue-500" />
                        <span className="truncate text-sm text-gray-600">
                            {uploading
                                ? "Uploading video..."
                                : video
                                    ? `Uploaded (${Math.floor(video.duration / 60)}m ${video.duration % 60}s)`
                                    : "Choose a video file"}
                        </span>
                        <input
                            type="file"
                            accept="video/*"
                            hidden
                            onChange={(e) => handleFile(e.target.files?.[0])}
                        />
                    </label>
                </div>

                <label className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        checked={isPreviewFree}
                        onChange={(e) => setIsPreviewFree(e.target.checked)}
                    />
                    Is Preview Free?
                </label>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <button
                    type="button"
                    onClick={submit}
                    disabled={!title.trim() || !video || uploading}
                    className="w-full rounded bg-blue-500 py-3 text-white hover:bg-blue-600 disabled:opacity-50"
                >
                    Add
                </button>
            </div>
        </div>
    );
}