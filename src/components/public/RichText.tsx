import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { Json } from "@/lib/supabase/database.types";
import { supabaseUrl } from "@/lib/supabase/env";

/**
 * Render del JSON de Tiptap a React, sin HTML crudo (sin riesgo de XSS).
 * Cubre los nodos y marcas que ofrece el editor del backoffice; lo demás
 * se ignora.
 */

type Mark = { type: string; attrs?: Record<string, Json | undefined> };
type Node = {
  type: string;
  attrs?: Record<string, Json | undefined>;
  content?: Node[];
  text?: string;
  marks?: Mark[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNode(value: unknown): value is Node {
  return isRecord(value) && typeof value.type === "string";
}

function children(node: Node): Node[] {
  return Array.isArray(node.content) ? node.content.filter(isNode) : [];
}

function stringAttr(node: Node | Mark, key: string): string | null {
  const value = node.attrs?.[key];
  return typeof value === "string" ? value : null;
}

const SAFE_LINK = /^(https?:|mailto:)/i;
const MEDIA_PREFIX = `${supabaseUrl}/storage/v1/object/public/`;

type Options = {
  /** Suma niveles a los títulos (el editor usa h2–h4; dentro de una sección h2 pasan a h3). */
  headingOffset: number;
  imageAlt: string;
};

function renderMarks(text: string, marks: Mark[] | undefined, key: string): ReactNode {
  return (marks ?? []).reduce<ReactNode>((inner, mark, index) => {
    const markKey = `${key}-${index}`;
    switch (mark.type) {
      case "bold":
        return <strong key={markKey}>{inner}</strong>;
      case "italic":
        return <em key={markKey}>{inner}</em>;
      case "strike":
        return <s key={markKey}>{inner}</s>;
      case "underline":
        return <u key={markKey}>{inner}</u>;
      case "code":
        return <code key={markKey}>{inner}</code>;
      case "link": {
        const href = stringAttr(mark, "href");
        if (!href || !SAFE_LINK.test(href)) return inner;
        return (
          <a key={markKey} href={href} target="_blank" rel="noopener noreferrer nofollow">
            {inner}
          </a>
        );
      }
      default:
        return inner;
    }
  }, text);
}

function renderNode(node: Node, key: string, options: Options): ReactNode {
  const inner = () => children(node).map((child, index) => renderNode(child, `${key}-${index}`, options));

  switch (node.type) {
    case "doc":
      return inner();
    case "text":
      return renderMarks(node.text ?? "", node.marks, key);
    case "paragraph":
      return <p key={key}>{inner()}</p>;
    case "heading": {
      const raw = node.attrs?.level;
      const level = typeof raw === "number" && raw >= 2 && raw <= 4 ? raw : 2;
      const tagLevel = Math.min(6, level + options.headingOffset);
      const Tag = `h${tagLevel}` as "h2" | "h3" | "h4" | "h5" | "h6";
      // La clase conserva el aspecto del nivel original aunque cambie la etiqueta.
      return (
        <Tag key={key} className={`rt-h${level}`}>
          {inner()}
        </Tag>
      );
    }
    case "bulletList":
      return <ul key={key}>{inner()}</ul>;
    case "orderedList": {
      const start = node.attrs?.start;
      return (
        <ol key={key} start={typeof start === "number" ? start : undefined}>
          {inner()}
        </ol>
      );
    }
    case "listItem":
      return <li key={key}>{inner()}</li>;
    case "blockquote":
      return <blockquote key={key}>{inner()}</blockquote>;
    case "codeBlock": {
      const language = stringAttr(node, "language");
      const code = children(node)
        .map((child) => child.text ?? "")
        .join("");
      return (
        <pre key={key}>
          <code className={language ? `language-${language}` : undefined}>{code}</code>
        </pre>
      );
    }
    case "hardBreak":
      return <br key={key} />;
    case "horizontalRule":
      return <hr key={key} />;
    case "image": {
      const src = stringAttr(node, "src");
      // Solo imágenes de nuestro Storage (dominio permitido por next/image).
      if (!src || !src.startsWith(MEDIA_PREFIX)) return null;
      return (
        <Image
          key={key}
          src={src}
          alt={stringAttr(node, "alt") ?? options.imageAlt}
          width={0}
          height={0}
          sizes="(min-width: 768px) 720px, 100vw"
          className="h-auto w-full"
        />
      );
    }
    default:
      return null;
  }
}

type RichTextProps = {
  doc: Json | null;
  headingOffset?: number;
  imageAlt: string;
  className?: string;
};

export function RichText({ doc, headingOffset = 0, imageAlt, className }: RichTextProps) {
  if (!isNode(doc) || doc.type !== "doc") return null;
  return <div className={cn("rich-text", className)}>{renderNode(doc, "rt", { headingOffset, imageAlt })}</div>;
}

/** true si el documento tiene contenido que mostrar. */
export function hasRichText(doc: Json | null): boolean {
  return isNode(doc) && doc.type === "doc" && children(doc).length > 0;
}
