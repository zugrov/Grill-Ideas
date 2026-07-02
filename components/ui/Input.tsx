import { type InputHTMLAttributes } from "react";

export function Input({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-md border border-mc-border bg-mc-card px-4 py-2.5 text-sm text-mc-text placeholder:text-mc-text-muted focus:outline-none focus:ring-2 focus:ring-mc-primary ${className}`}
      {...props}
    />
  );
}
