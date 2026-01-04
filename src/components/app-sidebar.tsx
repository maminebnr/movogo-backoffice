"use client";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Home, Package, Truck, Users, Car, UserCog, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Deliveries", href: "/deliveries", icon: Package },
  { label: "Carriers", href: "/carriers", icon: Truck },
  { label: "Senders", href: "/senders", icon: Users },
  { label: "Vehicles", href: "/vehicles", icon: Car },
  { label: "Accounts", href: "/accounts", icon: UserCog },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col border-r bg-white">
      <div className="h-16 px-4 flex items-center gap-2 border-b">
        <Image src="/logo.svg" alt="Movogo" width={32} height={32} />
        <span className="font-semibold text-orange-600">Movogo Backoffice</span>
      </div>
      <nav className="p-2 space-y-1 flex-1">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-sm",
                active
                  ? "bg-orange-50 text-orange-700"
                  : "text-zinc-600 hover:bg-zinc-100"
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t">
        {user && (
          <div className="mb-2 px-3 py-2 text-sm text-zinc-600">
            <div className="font-medium">{user.email}</div>
            <div className="text-xs text-zinc-400">{user.role}</div>
          </div>
        )}
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={logout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </aside>
  );
}


