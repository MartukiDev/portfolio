"use client";

import Image from "@tiptap/extension-image";
import { EditorContent, useEditor, useEditorState, type Editor, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Code,
  Heading2,
  Heading3,
  Heading4,
  ImagePlus,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  LoaderCircle,
  Quote,
  Redo2,
  SquareCode,
  Undo2,
  type LucideIcon,
} from "lucide-react";
import { useId, useState, type FormEvent } from "react";
import { fieldClasses } from "@/components/ui/field";
import { adminForms } from "@/content/es/admin-forms";
import { cn } from "@/lib/cn";
import { IMAGE_TYPES, mediaUrl } from "@/lib/storage";
import { uploadProjectImage } from "@/lib/upload-client";
import { useToast } from "./Toaster";

type RichTextEditorProps = {
  id: string;
  name: string;
  defaultValue: JSONContent | null;
  /** Si se indica, habilita subir imágenes a la carpeta del proyecto. */
  projectId?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
};

const t = adminForms.editor;

function serialize(editor: Editor): string {
  return editor.isEmpty ? "" : JSON.stringify(editor.getJSON());
}

export function RichTextEditor({
  id,
  name,
  defaultValue,
  projectId,
  ...aria
}: RichTextEditorProps) {
  const [value, setValue] = useState(defaultValue ? JSON.stringify(defaultValue) : "");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        link: {
          openOnClick: false,
          autolink: true,
          defaultProtocol: "https",
          protocols: ["http", "https", "mailto"],
          HTMLAttributes: { rel: "noopener noreferrer nofollow", target: "_blank" },
        },
      }),
      Image.configure({ HTMLAttributes: { loading: "lazy" } }),
    ],
    content: defaultValue ?? "",
    editorProps: {
      attributes: {
        id,
        role: "textbox",
        "aria-multiline": "true",
        ...(aria["aria-describedby"] ? { "aria-describedby": aria["aria-describedby"] } : {}),
        ...(aria["aria-invalid"] ? { "aria-invalid": "true" } : {}),
        class: "rich-text min-h-48 px-4 py-3 outline-none",
      },
    },
    onUpdate: ({ editor: current }) => setValue(serialize(current)),
  });

  return (
    <div className={cn(fieldClasses, "overflow-hidden p-0 focus-within:border-accent/60")}>
      <input type="hidden" name={name} value={value} />
      {editor ? (
        <>
          <Toolbar editor={editor} projectId={projectId} />
          <EditorContent editor={editor} />
        </>
      ) : (
        <div className="min-h-60" aria-hidden="true" />
      )}
    </div>
  );
}

function Toolbar({ editor, projectId }: { editor: Editor; projectId?: string }) {
  const notify = useToast();
  const fileInputId = useId();
  const [uploading, setUploading] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkValue, setLinkValue] = useState("");

  const state = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      h2: e.isActive("heading", { level: 2 }),
      h3: e.isActive("heading", { level: 3 }),
      h4: e.isActive("heading", { level: 4 }),
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      code: e.isActive("code"),
      bulletList: e.isActive("bulletList"),
      orderedList: e.isActive("orderedList"),
      blockquote: e.isActive("blockquote"),
      codeBlock: e.isActive("codeBlock"),
      link: e.isActive("link"),
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  });

  const chain = () => editor.chain().focus();

  const openLink = () => {
    const current: unknown = editor.getAttributes("link").href;
    setLinkValue(typeof current === "string" ? current : "");
    setLinkOpen((open) => !open);
  };

  const applyLink = (event?: FormEvent) => {
    event?.preventDefault();
    const href = linkValue.trim();
    if (href === "") {
      chain().extendMarkRange("link").unsetLink().run();
    } else if (/^(https?:\/\/|mailto:)/i.test(href)) {
      chain().extendMarkRange("link").setLink({ href }).run();
    } else {
      chain().extendMarkRange("link").setLink({ href: `https://${href}` }).run();
    }
    setLinkOpen(false);
  };

  const onImage = async (file: File | undefined) => {
    if (!file || !projectId) return;
    setUploading(true);
    const result = await uploadProjectImage(projectId, "content", file);
    setUploading(false);
    if (!result.ok) return notify({ ok: false, error: result.error });
    chain().setImage({ src: mediaUrl(result.path), alt: t.imageAlt }).run();
  };

  const buttons: Array<{ label: string; icon: LucideIcon; active?: boolean; disabled?: boolean; run: () => void } | "sep"> = [
    { label: t.h2, icon: Heading2, active: state.h2, run: () => chain().toggleHeading({ level: 2 }).run() },
    { label: t.h3, icon: Heading3, active: state.h3, run: () => chain().toggleHeading({ level: 3 }).run() },
    { label: t.h4, icon: Heading4, active: state.h4, run: () => chain().toggleHeading({ level: 4 }).run() },
    "sep",
    { label: t.bold, icon: Bold, active: state.bold, run: () => chain().toggleBold().run() },
    { label: t.italic, icon: Italic, active: state.italic, run: () => chain().toggleItalic().run() },
    { label: t.code, icon: Code, active: state.code, run: () => chain().toggleCode().run() },
    { label: t.link, icon: LinkIcon, active: state.link || linkOpen, run: openLink },
    "sep",
    { label: t.bulletList, icon: List, active: state.bulletList, run: () => chain().toggleBulletList().run() },
    { label: t.orderedList, icon: ListOrdered, active: state.orderedList, run: () => chain().toggleOrderedList().run() },
    { label: t.blockquote, icon: Quote, active: state.blockquote, run: () => chain().toggleBlockquote().run() },
    { label: t.codeBlock, icon: SquareCode, active: state.codeBlock, run: () => chain().toggleCodeBlock().run() },
    ...(projectId
      ? [{ label: t.image, icon: uploading ? LoaderCircle : ImagePlus, disabled: uploading, run: () => document.getElementById(fileInputId)?.click() }]
      : []),
    "sep",
    { label: t.undo, icon: Undo2, disabled: !state.canUndo, run: () => chain().undo().run() },
    { label: t.redo, icon: Redo2, disabled: !state.canRedo, run: () => chain().redo().run() },
  ];

  return (
    <div className="border-b border-glass-border">
      <div role="toolbar" aria-label={t.toolbar} className="flex flex-wrap items-center gap-0.5 p-1.5">
        {buttons.map((button, index) =>
          button === "sep" ? (
            <span key={`sep-${index}`} aria-hidden="true" className="mx-1 h-5 w-px bg-glass-border" />
          ) : (
            <button
              key={button.label}
              type="button"
              title={button.label}
              aria-label={button.label}
              aria-pressed={button.active ?? undefined}
              disabled={button.disabled}
              onMouseDown={(event) => event.preventDefault()}
              onClick={button.run}
              className={cn(
                "inline-flex size-8 items-center justify-center rounded-lg transition-colors disabled:opacity-35",
                button.active ? "bg-accent/15 text-accent" : "text-muted hover:bg-glass-hover hover:text-fg",
              )}
            >
              <button.icon aria-hidden="true" className={cn("size-4", button.icon === LoaderCircle && "animate-spin")} />
            </button>
          ),
        )}
      </div>

      {linkOpen && (
        <div className="flex flex-wrap items-center gap-2 border-t border-glass-border p-2">
          <input
            type="url"
            value={linkValue}
            onChange={(event) => setLinkValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") applyLink(event);
              if (event.key === "Escape") setLinkOpen(false);
            }}
            placeholder={t.linkPlaceholder}
            aria-label={t.link}
            autoFocus
            className="h-8 min-w-48 flex-1 rounded-lg border border-glass-border bg-transparent px-3 text-sm outline-none focus:border-accent/60"
          />
          <button type="button" onClick={() => applyLink()} className="h-8 rounded-lg bg-accent px-3 text-sm font-medium text-bg">
            {t.linkApply}
          </button>
          {state.link && (
            <button
              type="button"
              onClick={() => {
                chain().extendMarkRange("link").unsetLink().run();
                setLinkOpen(false);
              }}
              className="h-8 rounded-lg px-3 text-sm text-muted hover:text-fg"
            >
              {t.linkRemove}
            </button>
          )}
        </div>
      )}

      {projectId && (
        <input
          id={fileInputId}
          type="file"
          accept={IMAGE_TYPES.join(",")}
          className="sr-only"
          tabIndex={-1}
          onChange={(event) => {
            void onImage(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
      )}
    </div>
  );
}
