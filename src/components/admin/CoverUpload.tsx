"use client";

import { ImagePlus, LoaderCircle } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { adminForms } from "@/content/es/admin-forms";
import { IMAGE_TYPES, mediaUrl } from "@/lib/storage";
import { uploadProjectImage } from "@/lib/upload-client";
import { useToast } from "./Toaster";

type CoverUploadProps = {
  id: string;
  name: string;
  projectId: string;
  defaultPath: string | null;
  alt: string;
};

export function CoverUpload({ id, name, projectId, defaultPath, alt }: CoverUploadProps) {
  const t = adminForms.upload;
  const notify = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [path, setPath] = useState(defaultPath);
  const [uploading, setUploading] = useState(false);

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    const result = await uploadProjectImage(projectId, "cover", file);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
    if (result.ok) setPath(result.path);
    else notify({ ok: false, error: result.error });
  };

  return (
    <div className="flex flex-col gap-3">
      <input type="hidden" name={name} value={path ?? ""} />
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={IMAGE_TYPES.join(",")}
        className="sr-only"
        onChange={(event) => onFile(event.target.files?.[0])}
      />

      <div className="glass-flat relative aspect-[1200/630] w-full max-w-xl overflow-hidden rounded-xl">
        {path ? (
          <Image src={mediaUrl(path)} alt={alt} fill unoptimized className="object-cover" />
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex size-full flex-col items-center justify-center gap-2 text-sm text-muted hover:text-fg"
          >
            <ImagePlus aria-hidden="true" className="size-6" />
            {t.choose}
          </button>
        )}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-bg/70 text-sm">
            <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
            {t.uploading}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {path ? t.replace : t.choose}
        </Button>
        {path && (
          <Button variant="ghost" size="sm" onClick={() => setPath(null)} disabled={uploading}>
            {t.remove}
          </Button>
        )}
        <span className="text-xs text-muted">{t.hint}</span>
      </div>
    </div>
  );
}
