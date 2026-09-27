import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactStrip } from "@/components/public/ContactStrip";
import { Hero } from "@/components/public/hero/Hero";
import { PersonJsonLd } from "@/components/public/PersonJsonLd";
import { ProjectCard } from "@/components/public/ProjectCard";
import { Reveal } from "@/components/public/Reveal";
import { Section } from "@/components/public/Section";
import { ServiceCard } from "@/components/public/ServiceCard";
import { TestimonialCard } from "@/components/public/TestimonialCard";
import { publicContent } from "@/content/es/public";
import { site } from "@/content/es/site";
import { pageMetadata } from "@/lib/metadata";
import { getPublishedServices, getPublishedTestimonials, getSkills } from "@/lib/queries/content";
import { getFeaturedProjects } from "@/lib/queries/projects";
import { getSiteSettings } from "@/lib/queries/settings";

const HOME_SERVICES = 3;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  if (!settings) return pageMetadata({ path: "/" });
  return pageMetadata({
    absoluteTitle: settings.tagline ? `${settings.nombre} — ${settings.tagline} · ${site.title}` : `${settings.nombre} · ${site.title}`,
    description: settings.hero_descripcion,
    path: "/",
    type: "profile",
  });
}

export default async function HomePage() {
  const [settings, featured, services, testimonials, skills] = await Promise.all([
    getSiteSettings(),
    getFeaturedProjects(),
    getPublishedServices(),
    getPublishedTestimonials(),
    getSkills(),
  ]);
  if (!settings) notFound();

  const t = publicContent.home;

  // Las secciones sin contenido se omiten en la portada.
  return (
    <>
      <PersonJsonLd settings={settings} skills={skills} />
      <Hero settings={settings} />

      <div className="flex flex-col gap-24 sm:gap-32">
        {featured.length > 0 && (
          <Section
            id="destacados"
            eyebrow={t.featured.eyebrow}
            title={t.featured.title}
            description={t.featured.description}
            link={{ href: "/proyectos", label: t.featured.viewAll }}
          >
            <ul className="grid gap-6 sm:grid-cols-2">
              {featured.map((project, index) => (
                <li key={project.id}>
                  <Reveal delay={(index % 2) * 0.08} className="h-full">
                    <ProjectCard project={project} />
                  </Reveal>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {services.length > 0 && (
          <Section
            id="servicios"
            eyebrow={t.services.eyebrow}
            title={t.services.title}
            link={{ href: "/servicios", label: t.services.viewAll }}
          >
            <ul className="grid gap-6 md:grid-cols-3">
              {services.slice(0, HOME_SERVICES).map((service, index) => (
                <li key={service.id}>
                  <Reveal delay={index * 0.08} className="h-full">
                    <ServiceCard service={service} compact />
                  </Reveal>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {testimonials.length > 0 && (
          <Section id="testimonios" eyebrow={t.testimonials.eyebrow} title={t.testimonials.title}>
            <ul className="grid gap-6 md:grid-cols-2">
              {testimonials.map((testimonial, index) => (
                <li key={testimonial.id}>
                  <Reveal delay={(index % 2) * 0.08} className="h-full">
                    <TestimonialCard testimonial={testimonial} />
                  </Reveal>
                </li>
              ))}
            </ul>
          </Section>
        )}

        <ContactStrip settings={settings} />
      </div>
    </>
  );
}
