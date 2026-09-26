import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/admin/LoginForm";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SectionTitle } from "@/components/ui/Heading";
import { admin } from "@/content/es/admin";

export const metadata: Metadata = {
  title: admin.login.metaTitle,
  robots: { index: false, follow: false },
};

export default async function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  const { next, error } = await searchParams;
  const t = admin.login;

  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-12">
      <div className="flex w-full max-w-md flex-col gap-6">
        <GlassPanel className="flex flex-col gap-8">
          <SectionTitle level={1} eyebrow={t.eyebrow} title={t.title} description={t.description} />
          <LoginForm
            next={typeof next === "string" ? next : undefined}
            initialError={error === "no-autorizado" ? t.errors.unauthorized : undefined}
          />
        </GlassPanel>
        <Link
          href="/"
          className="self-center rounded text-sm text-muted transition-colors hover:text-fg"
        >
          {t.backToSite}
        </Link>
      </div>
    </main>
  );
}
