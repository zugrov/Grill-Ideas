import Link from "next/link";

type CTAButtonProps = {
  href: string;
  variant?: "primary" | "secondary";
  children: React.ReactNode;
  className?: string;
};

export function CTAButton({
  href,
  variant = "primary",
  children,
  className = "",
}: CTAButtonProps) {
  const base =
    "inline-flex items-center justify-center font-semibold rounded-xl transition-colors px-8 py-4 text-base";
  const variants = {
    primary: "bg-grill-green text-white hover:brightness-110",
    secondary: "bg-grill-blue text-white hover:brightness-110",
  };

  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}
