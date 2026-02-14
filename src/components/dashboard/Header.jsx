import LogoutButton from "@/components/auth/LogoutButton";
import Image from "next/image";
export default function Header() {
  return (
    <header className="h-16 flex items-center justify-between border-b border-border bg-card px-8 sticky top-0 z-50">
      {/* LEFT */}
      <div className="flex items-center gap-10">
        <div className="flex items-center gap-2">
          <div className="relative w-9 h-9 rounded-full bg-gray-900 p-2 ">
            <Image
              src="/logo.png"
              alt="SkillVista Logo"
              fill
              className="object-contain "
              priority
            />
          </div>
          <h1 className="text-xl font-semibold tracking-tight">SkillVista</h1>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 cursor-pointer">
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
