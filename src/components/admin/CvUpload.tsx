"use client";

import { FileText, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { adminSettings } from "@/content/es/admin-settings";
import { adminForms } from "@/content/es/admin-forms";
import { removeCv, setCvPath } from "@/lib/actions/settings";
import { createClient } from "@/lib/supabase/client";
import { CV_BUCKET, CV_MAX_BYTES, CV_PATH, publicUrl } from "@/lib/storage";
import { ConfirmDialog } from "./ConfirmDialog";
import { useToast } from "./Toaster";

type CvUploadProps = {
  currentPath: string | null;
  /** Para romper la caché del navegador al ver el PDF recién subido. */
  version: string;
};

export function CvUpload({ currentPath, version }: CvUploadProps) {
  const t = adminSettings.cv;
  const notify = useToast();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const onFile = async (file: File | undefined) => {
    if (inputRef.current) inputRef.current.value = "";
    if (!file) return;
    if (file.type !== "application/pdf") return notify({ ok: false, error: t.invalidType });
    if (file.size > CV_MAX_BYTES) {
      return notify({ ok: false, error: adminForms.upload.tooLarge(CV_MAX_BYTES / 1024 / 1024) });
    }

    setUploading(true);
    const { error } = await createClient()
      .storage.from(CV_BUCKET)
      .upload(CV_PATH, file, { contentType: "application/pdf", cacheControl: "60", upsert: true });

    const result = error ? { ok: false as const, error: adminForms.upload.failed } : await setCvPath();
    setUploading(false);
    notify(result);
    if (result.ok) router.refresh();
  };

  return (
    <div className="flex flex-col gap-4">
      <input
        ref={inputRef}
        id="cv-file"
        type="file"
        accept="application/pdf"
        className="sr-only"
        onChange={(event) => onFile(event.target.files?.[0])}
      />

      <div className="glass-flat flex items-center gap-3 rounded-xl px-4 py-3">
        <FileText aria-hidden="true" className="size-5 shrink-0 text-accent" />
        {currentPath ? (
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-sm">{t.current}</span>
            <a
              href={`${publicUrl(CV_BUCKET, currentPath)}?v=${encodeURIComponent(version)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate font-mono text-xs text-accent hover:underline"
            >
              {t.view}
            </a>
          </div>
        ) : (
          <span className="text-sm text-muted">{t.none}</span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="secondary" size="sm" onClick={() => inputRef.current?.click()} disabled={uploading}>
          {uploading && <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />}
          {uploading ? t.uploading : currentPath ? t.replace : t.upload}
        </Button>
        {currentPath && (
          <ConfirmDialog
            title={t.removeConfirmTitle}
            body={t.removeConfirmBody}
            confirmLabel={t.remove}
            onConfirm={async () => {
              const result = await removeCv();
              notify(result);
              if (result.ok) router.refresh();
            }}
            trigger={(open) => (
              <Button variant="ghost" size="sm" onClick={open} disabled={uploading}>
                {t.remove}
              </Button>
            )}
          />
        )}
      </div>
      <p className="text-xs text-muted">{t.hint}</p>
    </div>
  );
}
