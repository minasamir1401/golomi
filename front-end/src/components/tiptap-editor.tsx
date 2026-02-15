import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';

import { Color } from '@tiptap/extension-color';

import { Bold, Italic, Strikethrough, Heading1, Heading2, Heading3, List, ListOrdered, Quote, Image as ImageIcon, AlignLeft, AlignCenter, AlignRight, Undo, Redo, Type } from 'lucide-react';
import { cn } from "@/lib/utils";

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) {
        return null;
    }

    const addImage = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const formData = new FormData();
                formData.append('file', file);

                try {
                    const res = await fetch(`/api/upload`, {
                        method: 'POST',
                        body: formData
                    });

                    if (res.ok) {
                        const data = await res.json();
                        editor.chain().focus().setImage({ src: data.url }).run();
                    } else {
                        alert("فشل رفع الصورة");
                    }
                } catch (err) {
                    console.error("Upload error:", err);
                    alert("حدث خطأ أثناء الرفع");
                }
            }
        };
        input.click();
    };


    return (
        <div className="flex flex-wrap gap-2 p-2 mb-4 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-900/50 sticky top-0 z-10">
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={cn("p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800", editor.isActive('bold') ? 'bg-slate-200 dark:bg-slate-800 text-gold-600' : '')}
                title="Bold"
            >
                <Bold className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={cn("p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800", editor.isActive('italic') ? 'bg-slate-200 dark:bg-slate-800 text-gold-600' : '')}
                title="Italic"
            >
                <Italic className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1 self-center" />

            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={cn("p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800", editor.isActive('heading', { level: 2 }) ? 'bg-slate-200 dark:bg-slate-800 text-gold-600' : '')}
                title="Heading 2"
            >
                <Heading2 className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={cn("p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800", editor.isActive('heading', { level: 3 }) ? 'bg-slate-200 dark:bg-slate-800 text-gold-600' : '')}
                title="Heading 3"
            >
                <Heading3 className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1 self-center" />

            <button
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className={cn("p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800", editor.isActive({ textAlign: 'right' }) ? 'bg-slate-200 dark:bg-slate-800 text-gold-600' : '')}
                title="Align Right"
            >
                <AlignRight className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className={cn("p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800", editor.isActive({ textAlign: 'center' }) ? 'bg-slate-200 dark:bg-slate-800 text-gold-600' : '')}
                title="Align Center"
            >
                <AlignCenter className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className={cn("p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800", editor.isActive({ textAlign: 'left' }) ? 'bg-slate-200 dark:bg-slate-800 text-gold-600' : '')}
                title="Align Left"
            >
                <AlignLeft className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1 self-center" />

            <button
                onClick={addImage}
                className="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800"
                title="Add Image"
            >
                <ImageIcon className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1 self-center" />

            <button
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
                className="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30"
                title="Undo"
            >
                <Undo className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
                className="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30"
                title="Redo"
            >
                <Redo className="w-4 h-4" />
            </button>
        </div>
    );
};

export const TiptapEditor = ({ content, onChange }: { content: string, onChange: (html: string) => void }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image,
            TextStyle,
            Color,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
                defaultAlignment: 'right',
            }),
        ],
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'focus:outline-none min-h-[300px] p-4 font-cairo dir-rtl text-slate-900 dark:text-white',
            },
        },
        immediatelyRender: false,
    });


    return (
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-950 shadow-sm tiptap-container">
            <style jsx global>{`
                .tiptap-container ul {
                    list-style-type: disc;
                    padding-right: 1.5rem;
                }
                .tiptap-container ol {
                    list-style-type: decimal;
                    padding-right: 1.5rem;
                }
                .tiptap-container h2 {
                    font-size: 1.5rem;
                    font-weight: bold;
                    margin-top: 1rem;
                    margin-bottom: 0.5rem;
                }
                .tiptap-container h3 {
                    font-size: 1.25rem;
                    font-weight: bold;
                    margin-top: 1rem;
                    margin-bottom: 0.5rem;
                }
                .tiptap-container blockquote {
                    border-right: 4px solid #eab308;
                    background: rgba(234, 179, 8, 0.1);
                    padding: 0.5rem 1rem;
                    margin: 1rem 0;
                    border-radius: 0.25rem;
                }
                .tiptap-container img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 0.5rem;
                }
            `}</style>
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
};


