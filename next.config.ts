import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (!supabaseUrl) {
  throw new Error("Falta NEXT_PUBLIC_SUPABASE_URL. Revisa .env.local.");
}
const supabaseHost = new URL(supabaseUrl);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: supabaseHost.protocol === "http:" ? "http" : "https",
        hostname: supabaseHost.hostname,
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
