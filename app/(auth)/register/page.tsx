"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!consent) {
      setError("Необходимо согласие на обработку персональных данных");
      return;
    }
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (authError) {
      setError(authError.message);
      return;
    }
    router.push("/dashboard/analyze");
    router.refresh();
  }

  return (
    <>
      <div className="h-1.5 bg-gradient-to-r from-mc-primary from-40% to-mc-invert-bg to-40%" />
      <main className="max-w-md mx-auto px-6 py-16">
        <h1 className="text-2xl font-bold mb-2">Регистрация</h1>
        <p className="text-mc-text-second text-sm mb-8">
          Этапы 0–1 бесплатно после регистрации
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Пароль</label>
            <Input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <label className="flex items-start gap-2 text-sm text-mc-text-second">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1"
            />
            <span>
              Согласен на{" "}
              <Link href="/consent" className="text-mc-primary underline">
                обработку персональных данных
              </Link>{" "}
              и{" "}
              <Link href="/offer" className="text-mc-primary underline">
                офертой
              </Link>
            </span>
          </label>
          {error && <p className="text-sm text-mc-error">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Регистрация..." : "Создать аккаунт"}
          </Button>
        </form>
        <p className="text-sm text-mc-text-second mt-6">
          Уже есть аккаунт?{" "}
          <Link href="/login" className="text-mc-primary font-medium">
            Войти
          </Link>
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
