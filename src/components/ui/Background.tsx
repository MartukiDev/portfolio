import { BLOB_ALPHA, radialBlob, TEAL_RGB, VIOLET_RGB } from "@/lib/background";

const NOISE_SVG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/**
 * Fondo global: base casi negra, manchas teal/violeta con gradiente radial
 * (sin `filter`, solo se anima `transform`) y ruido sutil.
 */
export function Background() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-bg"
    >
      <div
        className="animate-blob-a absolute -top-[20vh] -left-[15vw] size-[70vmax] will-change-transform"
        style={{ backgroundImage: radialBlob(TEAL_RGB, BLOB_ALPHA.teal) }}
      />
      <div
        className="animate-blob-b absolute top-[30vh] -right-[20vw] size-[65vmax] will-change-transform"
        style={{ backgroundImage: radialBlob(VIOLET_RGB, BLOB_ALPHA.violet) }}
      />
      <div
        className="animate-blob-c absolute -bottom-[35vh] left-[15vw] size-[55vmax] will-change-transform"
        style={{ backgroundImage: radialBlob(TEAL_RGB, BLOB_ALPHA.tealSoft) }}
      />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: NOISE_SVG }}
      />
    </div>
  );
}
