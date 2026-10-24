"use client";

import { useEffect, useState, type FormEvent } from "react";
import { X } from "lucide-react";

type Props = {
    onAdd: (title: string) => void;
    onClose: () => void;
};

export function ChapterDialog({ onAdd, onClose }: Props) {
    const [title, setTitle] = useState("");

    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
        }
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    function submit(e: FormEvent) {
        e.preventDefault(); // stops the outer course form from submitting
        e.stopPropagation();
        const value = title.trim();
        if (!value) return;
        onAdd(value);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#252525B2] p-4">
            <form
                onSubmit={submit}
                className="relative w-full max-w-sm space-y-4 rounded-lg bg-white p-6 text-gray-700"
            >
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute right-4 top-4 text-gray-500 hover:text-black"
                >
                    <X className="h-5 w-5" />
                </button>

                <h2 className="text-lg font-semibold">Add Chapter</h2>

                <div>
                    <label className="mb-1 block text-sm">Chapter Name</label>
                    <input
                        autoFocus
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        maxLength={150}
                        placeholder="Type here"
                        className="h-10 w-full rounded-[4px] border border-[#25252580] px-4 text-gray-800 focus:outline-none"
                    />
                </div>

                <button
                    type="submit"
                    disabled={!title.trim()}
                    className="w-full rounded bg-blue-500 py-3 text-white hover:bg-blue-600 disabled:opacity-50"
                >
                    Add
                </button>
            </form>
        </div>
    );
}