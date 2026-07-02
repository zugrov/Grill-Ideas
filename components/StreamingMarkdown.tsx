"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type StreamingMarkdownProps = {
  content: string;
  className?: string;
};

export function StreamingMarkdown({ content, className = "" }: StreamingMarkdownProps) {
  return (
    <div
      className={`max-w-none text-sm leading-relaxed space-y-3 [&_h1]:text-xl [&_h1]:font-bold [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:font-semibold [&_table]:w-full [&_td]:border [&_td]:border-mc-border [&_td]:p-2 [&_th]:border [&_th]:border-mc-border [&_th]:p-2 [&_th]:bg-mc-bg ${className}`}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
