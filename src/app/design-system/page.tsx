import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Heading, SectionTitle } from "@/components/ui/Heading";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import {
  contrastPairs,
  contrastSurfaces,
  designSystem as t,
  primaryButtonContrast,
} from "@/content/es/design-system";
import { composite, contrastRatio, hexToRgb } from "@/lib/contrast";

export const metadata: Metadata = {
  title: t.metaTitle,
  robots: { index: false, follow: false },
};

const AA_NORMAL = 4.5;

type ContrastRow = { pair: string; surface: string; ratio: number };

function buildContrastRows(): ContrastRow[] {
  const rows: ContrastRow[] = contrastPairs.flatMap((pair) =>
    Object.values(contrastSurfaces).map((surface) => {
      const [first, ...rest] = surface.layers;
      return {
        pair: pair.label,
        surface: surface.label,
        ratio: contrastRatio(hexToRgb(pair.fg), composite(first, ...rest)),
      };
    }),
  );
  rows.push({
    pair: primaryButtonContrast.label,
    surface: primaryButtonContrast.bg,
    ratio: contrastRatio(
      hexToRgb(primaryButtonContrast.fg),
      hexToRgb(primaryButtonContrast.bg),
    ),
  });
  return rows;
}

export default function DesignSystemPage() {
  const contrastRows = buildContrastRows();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 py-16 sm:gap-24 sm:px-6 sm:py-24 lg:px-8">
      <SectionTitle
        level={1}
        eyebrow={t.eyebrow}
        title={t.title}
        description={t.description}
      />

      {/* Color */}
      <section className="flex flex-col gap-8">
        <SectionTitle eyebrow={t.colors.eyebrow} title={t.colors.title} />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {t.colors.items.map((color) => (
            <GlassCard key={color.token} className="flex flex-col gap-3 p-4 sm:p-4">
              <div
                className="h-16 rounded-xl border border-glass-border"
                style={{ backgroundColor: `var(${color.cssVar})` }}
              />
              <div className="flex flex-col gap-1">
                <p className="font-mono text-sm text-fg">{color.token}</p>
                <p className="font-mono text-xs text-muted">{color.hex}</p>
                <p className="text-xs text-muted">{color.use}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Vidrio */}
      <section className="flex flex-col gap-8">
        <SectionTitle eyebrow={t.glass.eyebrow} title={t.glass.title} />
        <GlassCard>
          <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {t.glass.items.map((item) => (
              <div key={item.token} className="flex flex-col gap-0.5">
                <dt className="font-mono text-sm text-accent">{item.token}</dt>
                <dd className="font-mono text-xs break-all text-muted">{item.value}</dd>
              </div>
            ))}
          </dl>
        </GlassCard>
        <div className="grid gap-4 md:grid-cols-2">
          <GlassCard>
            <Heading level={3} size={4}>
              {t.glass.cardTitle}
            </Heading>
            <p className="mt-2 text-sm text-muted">{t.glass.cardBody}</p>
          </GlassCard>
          <GlassCard interactive>
            <Heading level={3} size={4}>
              {t.glass.cardInteractiveTitle}
            </Heading>
            <p className="mt-2 text-sm text-muted">{t.glass.cardBody}</p>
          </GlassCard>
        </div>
        <GlassPanel as="section" className="flex flex-col gap-6">
          <div>
            <Heading level={3}>{t.glass.panelTitle}</Heading>
            <p className="mt-2 text-muted">{t.glass.panelBody}</p>
          </div>
          <GlassCard blur={false}>
            <Heading level={4}>{t.glass.cardFlatTitle}</Heading>
            <p className="mt-2 text-sm text-muted">{t.glass.cardFlatBody}</p>
          </GlassCard>
        </GlassPanel>
      </section>

      {/* Tipografía */}
      <section className="flex flex-col gap-8">
        <SectionTitle eyebrow={t.typography.eyebrow} title={t.typography.title} />
        <GlassPanel className="flex flex-col gap-10">
          {(
            [
              [t.typography.labels.h1, <Heading key="h1" level={2} size={1}>{t.typography.h1}</Heading>],
              [t.typography.labels.h2, <Heading key="h2" level={3} size={2}>{t.typography.h2}</Heading>],
              [t.typography.labels.h3, <Heading key="h3" level={3}>{t.typography.h3}</Heading>],
              [t.typography.labels.h4, <Heading key="h4" level={4}>{t.typography.h4}</Heading>],
            ] as const
          ).map(([label, node]) => (
            <div key={label} className="flex flex-col gap-2">
              <p className="font-mono text-xs text-muted">{label}</p>
              {node}
            </div>
          ))}

          <div className="flex flex-col gap-2">
            <p className="font-mono text-xs text-muted">{t.typography.labels.section}</p>
            <SectionTitle
              level={3}
              eyebrow={t.typography.sectionEyebrow}
              title={t.typography.sectionTitle}
              description={t.typography.sectionDescription}
            />
          </div>

          <div className="flex max-w-2xl flex-col gap-2">
            <p className="font-mono text-xs text-muted">{t.typography.labels.body}</p>
            <p className="leading-relaxed">{t.typography.body}</p>
            <p className="text-sm text-muted">{t.typography.muted}</p>
          </div>

          <div className="flex flex-col gap-3">
            <p className="font-mono text-xs text-muted">{t.typography.labels.mono}</p>
            <p className="font-mono text-lg">
              <span className="text-accent">{t.typography.mono.split("$")[0]}$</span>
              {t.typography.mono.split("$")[1]}
              <span aria-hidden="true" className="ml-1 inline-block h-5 w-2.5 translate-y-1 animate-pulse bg-accent" />
            </p>
            <ul className="flex flex-wrap gap-2">
              {t.typography.stack.map((tech) => (
                <li
                  key={tech}
                  className="glass-flat rounded-md px-2 py-1 font-mono text-xs text-muted"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        </GlassPanel>
      </section>

      {/* Botones y badges */}
      <div className="grid gap-16 lg:grid-cols-2 lg:gap-8">
        <section className="flex flex-col gap-8">
          <SectionTitle eyebrow={t.buttons.eyebrow} title={t.buttons.title} />
          <GlassCard className="flex flex-col gap-6">
            <div className="flex flex-wrap gap-3">
              <Button href="#formulario">{t.buttons.primary}</Button>
              <Button variant="secondary">{t.buttons.secondary}</Button>
              <Button variant="ghost">{t.buttons.ghost}</Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">{t.buttons.small}</Button>
              <Button size="lg" variant="secondary">
                {t.buttons.large}
              </Button>
              <Button disabled>{t.buttons.disabled}</Button>
            </div>
          </GlassCard>
        </section>

        <section className="flex flex-col gap-8">
          <SectionTitle eyebrow={t.badges.eyebrow} title={t.badges.title} />
          <GlassCard className="flex flex-wrap gap-3">
            <Badge variant="available">{t.badges.available}</Badge>
            <Badge variant="available">{t.badges.availableInternship}</Badge>
            <Badge variant="accent">{t.badges.accent}</Badge>
            <Badge>{t.badges.default}</Badge>
          </GlassCard>
        </section>
      </div>

      {/* Formulario */}
      <section id="formulario" className="flex scroll-mt-8 flex-col gap-8">
        <SectionTitle eyebrow={t.form.eyebrow} title={t.form.title} />
        <GlassPanel>
          <form className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="ds-name">{t.form.name}</Label>
              <Input id="ds-name" name="nombre" placeholder={t.form.namePlaceholder} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="ds-email">{t.form.email}</Label>
              <Input
                id="ds-email"
                name="email"
                type="email"
                placeholder={t.form.emailPlaceholder}
              />
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="ds-type">{t.form.type}</Label>
              <Select id="ds-type" name="tipo" defaultValue="freelance">
                {t.form.typeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="ds-message">{t.form.message}</Label>
              <Textarea
                id="ds-message"
                name="mensaje"
                placeholder={t.form.messagePlaceholder}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="ds-invalid">{t.form.invalid}</Label>
              <Input id="ds-invalid" aria-invalid="true" defaultValue={t.form.invalidValue} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="ds-disabled">{t.form.disabled}</Label>
              <Input id="ds-disabled" disabled placeholder={t.form.disabled} />
            </div>
            <div className="sm:col-span-2">
              <Button type="button" className="w-full sm:w-auto">
                {t.form.submit}
              </Button>
            </div>
          </form>
        </GlassPanel>
      </section>

      {/* Contraste */}
      <section className="flex flex-col gap-8">
        <SectionTitle
          eyebrow={t.contrast.eyebrow}
          title={t.contrast.title}
          description={t.contrast.description}
        />
        <GlassCard className="overflow-x-auto p-0 sm:p-0">
          <table className="w-full min-w-lg text-left text-sm">
            <thead className="border-b border-glass-border text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">{t.contrast.headers.pair}</th>
                <th className="px-4 py-3 font-medium">{t.contrast.headers.surface}</th>
                <th className="px-4 py-3 text-right font-medium">{t.contrast.headers.ratio}</th>
                <th className="px-4 py-3 text-right font-medium">{t.contrast.headers.result}</th>
              </tr>
            </thead>
            <tbody>
              {contrastRows.map((row) => {
                const passes = row.ratio >= AA_NORMAL;
                return (
                  <tr
                    key={`${row.pair}-${row.surface}`}
                    className="border-b border-glass-border last:border-0"
                  >
                    <td className="px-4 py-2.5 font-mono text-xs">{row.pair}</td>
                    <td className="px-4 py-2.5 text-muted">{row.surface}</td>
                    <td className="px-4 py-2.5 text-right font-mono">
                      {row.ratio.toFixed(2)}:1
                    </td>
                    <td
                      className={`px-4 py-2.5 text-right ${passes ? "text-success" : "text-red-400"}`}
                    >
                      {passes ? t.contrast.pass : t.contrast.fail}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </GlassCard>
      </section>
    </main>
  );
}
