import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-mc-invert-bg text-mc-invert-text px-6 py-4 flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-widest text-mc-text-muted">
            maxima consulting
          </span>
          <h1 className="text-lg font-bold text-mc-primary">GRILL IDEAS</h1>
        </div>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/dashboard/analyze" className="hover:text-mc-primary">
            Анализ
          </Link>
          <Link href="/dashboard/history" className="hover:text-mc-primary">
            История
          </Link>
          {user.email && (
            <span
              className="text-xs text-mc-text-muted max-w-[180px] truncate hidden sm:inline"
              title={user.email}
            >
              {user.email}
            </span>
          )}
          <form action="/auth/signout" method="post">
            <button type="submit" className="text-mc-text-muted hover:text-mc-invert-text">
              Выйти
            </button>
          </form>
        </nav>
      </header>
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-10">{children}</main>
    </div>
  );
}
