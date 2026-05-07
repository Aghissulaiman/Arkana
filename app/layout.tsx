import { SupabaseProvider } from "@/lib/supabase/provider";
import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "TrashFlow - Waste Management",
  description: "Platform manajemen sampah terintegrasi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <SupabaseProvider>
          {children}
        </SupabaseProvider>
      </body>
    </html>
  );
}
