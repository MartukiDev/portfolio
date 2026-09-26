import { Quote } from "lucide-react";
import type { Testimonial } from "@/lib/queries/content";

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="glass-flat flex h-full flex-col gap-5 rounded-2xl p-6">
      <Quote aria-hidden="true" className="size-6 text-accent-2" />
      <blockquote className="flex-1 leading-relaxed text-fg">
        <p>{testimonial.texto}</p>
      </blockquote>
      <figcaption className="flex flex-col gap-0.5 border-t border-glass-border pt-4">
        <span className="font-medium">{testimonial.autor}</span>
        {testimonial.cargo && <span className="text-sm text-muted">{testimonial.cargo}</span>}
      </figcaption>
    </figure>
  );
}
