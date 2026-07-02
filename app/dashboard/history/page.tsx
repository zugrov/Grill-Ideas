import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Analysis } from "@/lib/types";

export default async function HistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: analyses } = await supabase
    .from("analyses")
    .select("*")
    .eq("user_id", user!.id)
    .eq("status", "completed")
    .order("completed_at", { ascending: false });

  const items = (analyses ?? []) as Analysis[];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">История анализов</h2>
      <p className="text-mc-text-second text-sm mb-8">Завершённые бизнес-идеи</p>
      {items.length === 0 ? (
        <p className="text-mc-text-muted">Пока нет завершённых анализов.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((a) => (
            <li
              key={a.id}
              className="bg-mc-card border border-mc-border rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">
                  {(a.input_data as { name?: string })?.name ?? "Без названия"}
                </p>
                <p className="text-xs text-mc-text-muted">
                  {a.completed_at
                    ? new Date(a.completed_at).toLocaleDateString("ru-RU")
                    : ""}
                </p>
              </div>
              <Link
                href={`/dashboard/history/${a.id}`}
                className="text-sm text-mc-primary font-medium"
              >
                Открыть →
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
