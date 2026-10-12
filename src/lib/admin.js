import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase();
  const adminEmails = getAdminEmails();

  if (!email || !adminEmails.includes(email)) {
    return {
      session: null,
      authorized: false,
      diagnostics: {
        hasSessionEmail: Boolean(email),
        configuredAdminCount: adminEmails.length,
        emailMatches: Boolean(email && adminEmails.includes(email)),
      },
    };
  }

  return { session, authorized: true, diagnostics: null };
}
