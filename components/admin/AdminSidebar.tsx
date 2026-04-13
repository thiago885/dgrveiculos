"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Car, Users, ImageIcon, LogOut } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const links = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/veiculos", icon: Car, label: "Veículos" },
  { href: "/admin/banners", icon: ImageIcon, label: "Banners" },
  { href: "/admin/usuarios", icon: Users, label: "Usuários" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("Sessão encerrada.");
    router.push("/admin/login");
  }

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-zinc-100 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-zinc-100">
        <Image
          src="https://qafyuyhxmxaizprmatyz.supabase.co/storage/v1/object/public/img/dgr_logo.png"
          alt="DGR Veículos"
          width={120}
          height={48}
          className="h-14 w-auto object-contain"
        />
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                active
                  ? "bg-red-50 text-red-600"
                  : "text-zinc-600 hover:bg-slate-50 hover:text-zinc-900"
              )}
            >
              <Icon className={cn("h-4 w-4", active ? "text-red-600" : "text-zinc-400")} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-zinc-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-600 hover:bg-slate-50 hover:text-zinc-900 transition-all w-full"
        >
          <LogOut className="h-4 w-4 text-zinc-400" />
          Sair
        </button>
      </div>
    </aside>
  );
}
