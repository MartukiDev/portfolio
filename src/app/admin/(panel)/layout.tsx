import type { Metadata } from "next";
import { Sidebar } from "@/components/admin/Sidebar";
import { Toaster } from "@/components/admin/Toaster";
import { admin } from "@/content/es/admin";
import { requireAdmin } from "@/lib/auth/require-admin";

export const metadata: Metadata = {
  title: { default: admin.metaTitle, template: `%s · ${admin.metaTitle}` },
  robots: { index: false, follow: false },
};

export default async function PanelLayout({ children }: LayoutProps<"/admin">) {
  const { user } = await requireAdmin();

  return (
    <div className="min-h-dvh lg:pl-72">
      <Sidebar email={user.email} />
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        <Toaster>{children}</Toaster>
      </main>
    </div>
  );
}
