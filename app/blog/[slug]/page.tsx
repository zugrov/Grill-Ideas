import Link from "next/link";
import { notFound } from "next/navigation";
import { StreamingMarkdown } from "@/components/StreamingMarkdown";
import { CTAButton } from "@/components/landing/CTAButton";
import { getAllBlogSlugs, getBlogPost } from "@/lib/blog-posts";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Статья не найдена" };
  return {
    title: `${post.title} — Grill My Idea`,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  return (
    <article>
      <Link
        href="/blog"
        className="text-sm text-grill-blue hover:underline mb-6 inline-block"
      >
        ← Все статьи
      </Link>
      <time
        dateTime={post.date}
        className="text-xs text-grill-muted uppercase tracking-wide"
      >
        {new Date(post.date).toLocaleDateString("ru-RU", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}{" "}
        · {post.readMinutes} мин чтения
      </time>
      <h1 className="text-3xl font-bold mt-2 mb-8">{post.title}</h1>
      <StreamingMarkdown
        content={post.content}
        className="[&_h2]:text-grill-green [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:font-semibold [&_p]:text-grill-muted [&_li]:text-grill-muted [&_a]:text-grill-blue [&_table]:text-sm [&_td]:border-white/10 [&_th]:border-white/10 [&_th]:bg-grill-surface"
      />
      <div className="mt-12 pt-8 border-t border-white/10 text-center">
        <p className="text-grill-muted mb-4">
          Проверьте свою идею тем же методом — за 15 минут на бесплатных этапах
        </p>
        <CTAButton href="/register" variant="primary">
          Начать бесплатно
        </CTAButton>
      </div>
    </article>
  );
}
