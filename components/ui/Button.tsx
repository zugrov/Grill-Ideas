import { type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "dark";

const styles: Record<Variant, string> = {
  primary:
    "bg-mc-primary text-mc-invert-text hover:brightness-105 disabled:opacity-50",
  secondary:
    "bg-mc-card border border-mc-primary text-mc-primary hover:bg-mc-bg disabled:opacity-50",
  dark: "bg-mc-invert-bg text-mc-invert-text hover:brightness-110 disabled:opacity-50",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={`rounded-md px-5 py-3 font-semibold text-sm transition ${styles[variant]} ${className}`}
      {...props}
    />
  );
}
