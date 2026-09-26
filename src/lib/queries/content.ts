import "server-only";
import { cache } from "react";
import type { Tables } from "@/lib/supabase/database.types";
import { createPublicClient } from "@/lib/supabase/public";
import { CACHE_TAGS } from "./tags";

export type Service = Tables<"services">;
export type Testimonial = Tables<"testimonials">;
export type TimelineItem = Tables<"timeline_items">;
export type Skill = Tables<"skills">;

function fail(what: string, message: string): never {
  throw new Error(`No se pudieron leer ${what}: ${message}`);
}

export const getPublishedServices = cache(async (): Promise<Service[]> => {
  const { data, error } = await createPublicClient([CACHE_TAGS.services])
    .from("services")
    .select("*")
    .eq("publicado", true)
    .order("orden")
    .order("id");
  if (error) fail("los servicios", error.message);
  return data;
});

export const getPublishedTestimonials = cache(async (): Promise<Testimonial[]> => {
  const { data, error } = await createPublicClient([CACHE_TAGS.testimonials])
    .from("testimonials")
    .select("*")
    .eq("publicado", true)
    .order("orden")
    .order("id");
  if (error) fail("los testimonios", error.message);
  return data;
});

export const getTimeline = cache(async (): Promise<TimelineItem[]> => {
  const { data, error } = await createPublicClient([CACHE_TAGS.timeline])
    .from("timeline_items")
    .select("*")
    .order("orden")
    .order("id");
  if (error) fail("la trayectoria", error.message);
  return data;
});

export const getSkills = cache(async (): Promise<Skill[]> => {
  const { data, error } = await createPublicClient([CACHE_TAGS.skills]).from("skills").select("*").order("orden").order("id");
  if (error) fail("las habilidades", error.message);
  return data;
});
