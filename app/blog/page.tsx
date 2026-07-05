import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blog-posts";

export const metadata = {
  title: "Блог — Grill My Idea",
  description:
    "Статьи о валидации бизнес-идей, TAM/SAM/SOM и unit economics от maxima consulting.",
};

export default function BlogIndexPage() {
  return (
    <div>
      <Link
        href="/"
        className="text-sm text-grill-blue hover:underline mb-6 inline-block"
      >
        ← На главную
      </Link>
      <h1 className="text-3xl font-bold mb-2">Блог</h1>
      <p className="text-grill-muted mb-10">
        Валидация идей, рынок и unit economics — без воды
      </p>
      <ul className="space-y-6">
        {BLOG_POSTS.map((post) => (
          <li
            key={post.slug}
            className="bg-grill-surface rounded-xl border border-white/5 p-6"
          >
            <Link href={`/blog/${post.slug}`} className="group block">
              <time
                dateTime={post.date}
                className="text-xs text-grill-muted uppercase tracking-wide"
              >
                {new Date(post.date).toLocaleDateString("ru-RU", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}{" "}
                · {post.readMinutes} мин
              </time>
              <h2 className="text-xl font-semibold mt-2 group-hover:text-grill-green transition-colors">
                {post.title}
              </h2>
              <p className="text-sm text-grill-muted mt-2 leading-relaxed">
                {post.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
