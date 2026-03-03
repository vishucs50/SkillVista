"use client";

import Header from "@/components/dashboard/Header";
import NavBubble from "@/components/dashboard/NavBubble";

export default function ProtectedLayout({ children }) {
  return (
    <div className="flex h-screen flex-col bg-background overflow-hidden">
      <Header />

      <main className="flex-1 overflow-y-auto">{children}</main>

      <NavBubble />
    </div>
  );
}
