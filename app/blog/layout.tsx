import Link from "next/link";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-grill-bg text-grill-text min-h-screen">
      <LandingHeader />
      <main className="max-w-3xl mx-auto px-6 py-12">{children}</main>
      <LandingFooter />
    </div>
  );
}
