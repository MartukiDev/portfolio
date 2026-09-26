"use client";

import { X } from "lucide-react";
import { useState, type KeyboardEvent } from "react";
import { fieldClasses } from "@/components/ui/field";
import { adminForms } from "@/content/es/admin-forms";
import { cn } from "@/lib/cn";

type TagInputProps = {
  id: string;
  name: string;
  defaultValue?: readonly string[];
  max?: number;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
};

export function TagInput({ id, name, defaultValue = [], max = 30, ...aria }: TagInputProps) {
  const t = adminForms.tags;
  const [tags, setTags] = useState<string[]>([...defaultValue]);
  const [draft, setDraft] = useState("");

  const add = (raw: string) => {
    const value = raw.trim().slice(0, 40);
    if (!value || tags.length >= max) return;
    if (tags.some((tag) => tag.toLowerCase() === value.toLowerCase())) return;
    setTags([...tags, value]);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      add(draft);
      setDraft("");
    } else if (event.key === "Backspace" && draft === "" && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  return (
    <div className={cn(fieldClasses, "flex min-h-11 flex-wrap items-center gap-2 px-2 py-1.5 focus-within:border-accent/60")}>
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded-md border border-glass-border bg-white/5 py-0.5 pr-1 pl-2 font-mono text-xs"
        >
          {tag}
          <input type="hidden" name={name} value={tag} />
          <button
            type="button"
            onClick={() => setTags(tags.filter((item) => item !== tag))}
            aria-label={t.remove(tag)}
            className="rounded p-0.5 text-muted hover:text-fg"
          >
            <X aria-hidden="true" className="size-3" />
          </button>
        </span>
      ))}
      <input
        id={id}
        value={draft}
        onChange={(event) => {
          const value = event.target.value;
          if (value.includes(",")) {
            value.split(",").forEach(add);
            setDraft("");
          } else {
            setDraft(value);
          }
        }}
        onKeyDown={onKeyDown}
        onBlur={() => {
          add(draft);
          setDraft("");
        }}
        placeholder={tags.length === 0 ? t.placeholder : undefined}
        className="h-8 min-w-32 flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-muted"
        {...aria}
      />
    </div>
  );
}
