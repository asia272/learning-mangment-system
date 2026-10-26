"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
    Bold,
    Italic,
    Underline,
    Link2,
    ListOrdered,
    List,
    RemoveFormatting,
} from "lucide-react";

type Props = {
    value: string;
    onChange: (html: string) => void;
};

export function RichTextEditor({ value, onChange }: Props) {
    const editor = useEditor({
        // Tiptap v3: StarterKit already includes Underline and Link
        extensions: [StarterKit.configure({ link: { openOnClick: false } })],
        content: value,
        immediatelyRender: false, // avoids a server/client mismatch in Next.js
        shouldRerenderOnTransaction: true, // keeps toolbar buttons in sync
        onUpdate: ({ editor }) => onChange(editor.getHTML()),
        editorProps: {
            attributes: {
                class:
                    // explicit colors so the text is always clearly readable
                    "min-h-44 bg-white px-4 py-3 text-gray-900 caret-gray-900 focus:outline-none " +
                    "[&_h1]:text-2xl [&_h1]:font-semibold [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:text-lg [&_h3]:font-semibold " +
                    "[&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:text-blue-600 [&_a]:underline",
            },
        },
    });

    if (!editor) return <div className="h-60 rounded border border-gray-300 bg-white" />;

    const btn = (active: boolean) =>
        `rounded p-2 ${active ? "bg-gray-200" : "hover:bg-gray-100"}`;

    const block = editor.isActive("heading", { level: 1 })
        ? "h1"
        : editor.isActive("heading", { level: 2 })
            ? "h2"
            : editor.isActive("heading", { level: 3 })
                ? "h3"
                : "p";

    function onBlockChange(v: string) {
        const chain = editor!.chain().focus();
        if (v === "p") chain.setParagraph().run();
        else chain.setHeading({ level: Number(v.slice(1)) as 1 | 2 | 3 }).run();
    }

    function setLink() {
        const prev = editor!.getAttributes("link").href as string | undefined;
        const url = window.prompt("Link URL", prev ?? "https://");
        if (url === null) return;
        if (url === "") {
            editor!.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
        }
        editor!.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }

    return (
        <div className="overflow-hidden rounded border border-gray-300 bg-white">
            <div className="flex flex-wrap items-center gap-1 border-b border-gray-300 bg-white px-3 py-2 text-gray-700">
                <select
                    value={block}
                    onChange={(e) => onBlockChange(e.target.value)}
                    className="mr-3 rounded bg-white px-2 py-1 text-sm text-gray-800"
                >
                    <option value="p">Normal</option>
                    <option value="h1">Heading 1</option>
                    <option value="h2">Heading 2</option>
                    <option value="h3">Heading 3</option>
                </select>

                <button type="button" aria-label="Bold" className={btn(editor.isActive("bold"))}
                    onClick={() => editor.chain().focus().toggleBold().run()}>
                    <Bold className="h-4 w-4" />
                </button>
                <button type="button" aria-label="Italic" className={btn(editor.isActive("italic"))}
                    onClick={() => editor.chain().focus().toggleItalic().run()}>
                    <Italic className="h-4 w-4" />
                </button>
                <button type="button" aria-label="Underline" className={btn(editor.isActive("underline"))}
                    onClick={() => editor.chain().focus().toggleUnderline().run()}>
                    <Underline className="h-4 w-4" />
                </button>
                <button type="button" aria-label="Link" className={btn(editor.isActive("link"))}
                    onClick={setLink}>
                    <Link2 className="h-4 w-4" />
                </button>

                <span className="mx-2 h-5 w-px bg-gray-300" />

                <button type="button" aria-label="Numbered list" className={btn(editor.isActive("orderedList"))}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}>
                    <ListOrdered className="h-4 w-4" />
                </button>
                <button type="button" aria-label="Bullet list" className={btn(editor.isActive("bulletList"))}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}>
                    <List className="h-4 w-4" />
                </button>

                <span className="mx-2 h-5 w-px bg-gray-300" />

                <button type="button" aria-label="Clear formatting" className={btn(false)}
                    onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>
                    <RemoveFormatting className="h-4 w-4" />
                </button>
            </div>
            <EditorContent editor={editor} />
        </div>
    );
}