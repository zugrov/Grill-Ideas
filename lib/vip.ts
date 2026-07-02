const VIP_EMAILS = (process.env.VIP_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export function isVipEmail(email: string | null | undefined): boolean {
  if (!email || VIP_EMAILS.length === 0) return false;
  return VIP_EMAILS.includes(email.trim().toLowerCase());
}
