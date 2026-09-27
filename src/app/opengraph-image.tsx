import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { publicContent } from "@/content/es/public";
import { site } from "@/content/es/site";
import { getSiteSettings } from "@/lib/queries/settings";

// Imagen OG por defecto (todas las páginas sin una propia). Se genera en el
// build y se invalida con los ajustes (tag "settings").
export const alt = `${site.title}: portafolio`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fontsDir = join(process.cwd(), "src/assets/fonts");

export default async function OpenGraphImage() {
  const [settings, monoMedium, monoBold, oswald] = await Promise.all([
    getSiteSettings(),
    readFile(join(fontsDir, "GeistMono-Medium.woff")),
    readFile(join(fontsDir, "GeistMono-Bold.woff")),
    readFile(join(fontsDir, "Oswald-SemiBold.woff")),
  ]);
  const name = settings?.nombre ?? site.title;
  const tagline = settings?.tagline ?? site.description;
  const t = publicContent.hero;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#07090F",
          backgroundImage:
            "radial-gradient(circle at 12% 18%, rgba(94,234,212,0.22), transparent 45%), radial-gradient(circle at 88% 82%, rgba(167,139,250,0.24), transparent 45%)",
          fontFamily: "Geist Mono",
        }}
      >
        <div
          style={{
            width: 1040,
            display: "flex",
            flexDirection: "column",
            borderRadius: 28,
            border: "2px solid rgba(255,255,255,0.12)",
            backgroundColor: "rgba(255,255,255,0.05)",
            boxShadow: "0 40px 80px -20px rgba(0,0,0,0.6)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: 64,
              padding: "0 28px",
              borderBottom: "2px solid rgba(255,255,255,0.10)",
            }}
          >
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: "#ff5f57" }} />
              <div style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: "#febc2e" }} />
              <div style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: "#28c840" }} />
            </div>
            <div style={{ display: "flex", flex: 1, justifyContent: "center", color: "#8B93A7", fontSize: 22 }}>
              {t.windowTitle}
            </div>
            <div style={{ width: 72 }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", padding: "48px 56px 56px" }}>
            <div style={{ display: "flex", fontSize: 30, fontWeight: 500 }}>
              <span style={{ color: "#5EEAD4" }}>{t.prompt}</span>
              <span style={{ color: "#E6EAF2", marginLeft: 16 }}>{t.command}</span>
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 28,
                fontSize: name.length > 18 ? 76 : 96,
                fontWeight: 700,
                color: "#E6EAF2",
                letterSpacing: -2,
                lineHeight: 1.05,
              }}
            >
              {name}
            </div>
            <div style={{ display: "flex", marginTop: 20, fontSize: 36, fontWeight: 500, color: "#8B93A7" }}>
              {tagline}
            </div>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            right: 80,
            bottom: 36,
            display: "flex",
            fontFamily: "Oswald",
            fontSize: 34,
            color: "#E6EAF2",
          }}
        >
          {site.title}
          <span style={{ color: "#5EEAD4" }}>_</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist Mono", data: monoMedium, weight: 500, style: "normal" },
        { name: "Geist Mono", data: monoBold, weight: 700, style: "normal" },
        { name: "Oswald", data: oswald, weight: 600, style: "normal" },
      ],
    },
  );
}
