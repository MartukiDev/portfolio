"use client";

import { ChevronLeft, ChevronRight, ImagePlus, LoaderCircle, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { adminForms } from "@/content/es/admin-forms";
import { IMAGE_TYPES, mediaUrl } from "@/lib/storage";
import { uploadProjectImage } from "@/lib/upload-client";
import { useToast } from "./Toaster";

type GalleryUploadProps = {
  id: string;
  name: string;
  projectId: string;
  defaultPaths: readonly string[];
  altFor: (n: number) => string;
  max?: number;
};

export function GalleryUpload({ id, name, projectId, defaultPaths, altFor, max = 20 }: GalleryUploadProps) {
  const t = adminForms.upload;
  const notify = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [paths, setPaths] = useState<string[]>([...defaultPaths]);
  const [uploading, setUploading] = useState(0);

  const onFiles = async (fileList: FileList | null) => {
    const files = Array.from(fileList ?? []).slice(0, max - paths.length);
    if (inputRef.current) inputRef.current.value = "";
    if (files.length === 0) return;

    setUploading(files.length);
    const results = await Promise.all(files.map((file) => uploadProjectImage(projectId, "gallery", file)));
    setUploading(0);

    const uploaded = results.flatMap((result) => (result.ok ? [result.path] : []));
    setPaths((current) => [...current, ...uploaded]);
    const failed = results.find((result) => !result.ok);
    if (failed && !failed.ok) notify({ ok: false, error: failed.error });
  };

  const move = (index: number, delta: -1 | 1) => {
    setPaths((current) => {
      const next = [...current];
      [next[index], next[index + delta]] = [next[index + delta], next[index]];
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-3">
      {paths.map((path) => (
        <input key={path} type="hidden" name={name} value={path} />
      ))}
      <input
        ref={inputRef}
        id={id}
        type="file"
        multiple
        accept={IMAGE_TYPES.join(",")}
        className="sr-only"
        onChange={(event) => onFiles(event.target.files)}
      />

      {(paths.length > 0 || uploading > 0) && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {paths.map((path, index) => (
            <li key={path} className="glass-flat group relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image src={mediaUrl(path)} alt={altFor(index + 1)} fill unoptimized className="object-cover" />
              <div className="absolute inset-x-0 bottom-0 flex justify-between gap-1 bg-gradient-to-t from-bg/90 to-transparent p-1.5">
                <div className="flex gap-1">
                  <IconButton label={t.moveLeft} disabled={index === 0} onClick={() => move(index, -1)}>
                    <ChevronLeft aria-hidden="true" className="size-4" />
                  </IconButton>
                  <IconButton label={t.moveRight} disabled={index === paths.length - 1} onClick={() => move(index, 1)}>
                    <ChevronRight aria-hidden="true" className="size-4" />
                  </IconButton>
                </div>
                <IconButton
                  label={t.removeImage(index + 1)}
                  onClick={() => setPaths((current) => current.filter((item) => item !== path))}
                >
                  <X aria-hidden="true" className="size-4" />
                </IconButton>
              </div>
            </li>
          ))}
          {Array.from({ length: uploading }, (_, index) => (
            <li
              key={`uploading-${index}`}
              className="glass-flat flex aspect-[4/3] items-center justify-center gap-2 rounded-xl text-sm text-muted"
            >
              <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
              {t.uploading}
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={uploading > 0 || paths.length >= max}
        >
          <ImagePlus aria-hidden="true" className="size-4" />
          {t.add}
        </Button>
        <span className="text-xs text-muted">{t.hint}</span>
      </div>
    </div>
  );
}

function IconButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex size-7 items-center justify-center rounded-lg bg-bg/80 text-fg hover:bg-bg disabled:opacity-30"
    >
      {children}
    </button>
  );
}
