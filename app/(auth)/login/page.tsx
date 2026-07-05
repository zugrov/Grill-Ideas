"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PRODUCT_TAGLINE } from "@/lib/brand";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard/analyze";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (authError) {
      setError(authError.message);
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Пароль</label>
        <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      {error && <p className="text-sm text-mc-error">{error}</p>}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Вход..." : "Войти"}
      </Button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <>
      <div className="h-1.5 bg-gradient-to-r from-mc-primary from-40% to-mc-invert-bg to-40%" />
      <main className="max-w-md mx-auto px-6 py-16">
        <h1 className="text-2xl font-bold mb-2">Вход</h1>
        <p className="text-mc-text-second text-sm mb-8">{PRODUCT_TAGLINE}</p>
        <Suspense fallback={<p className="text-sm text-mc-text-muted">Загрузка...</p>}>
          <LoginForm />
        </Suspense>
        <p className="text-sm text-mc-text-second mt-6">
          Нет аккаунта?{" "}
          <Link href="/register" className="text-mc-primary font-medium">
            Регистрация
          </Link>
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
