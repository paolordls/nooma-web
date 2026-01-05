"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  DollarSign,
  CheckSquare,
  FileText,
  CreditCard,
  FolderKanban,
  Receipt,
} from "lucide-react";

const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    title: "Finance",
    href: "/finance",
    icon: DollarSign,
    children: [
      { title: "Accounts", href: "/finance/accounts", icon: CreditCard },
      { title: "Transactions", href: "/finance/transactions", icon: Receipt },
    ],
  },
  {
    title: "Tasks",
    href: "/tasks",
    icon: CheckSquare,
    children: [
      { title: "Projects", href: "/tasks/projects", icon: FolderKanban },
    ],
  },
  {
    title: "Notes",
    href: "/notes",
    icon: FileText,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 border-r border-border/60 bg-sidebar h-screen sticky top-0 flex flex-col">
      {/* Logo Section */}
      <div className="px-6 py-8 border-b border-border/60">
        <Link href="/" className="group flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-burgundy to-burgundy-dark flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
            <span className="text-white font-serif font-semibold text-lg">N</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Nooma</h1>
            <p className="text-[11px] text-muted-foreground tracking-wide uppercase">Productivity</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const isParentActive = item.children?.some(child => pathname === child.href);

          return (
            <div key={item.href} className="space-y-1">
              <Link
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-burgundy text-white shadow-sm"
                    : isParentActive
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground/80 hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className={cn(
                  "h-[18px] w-[18px] transition-transform duration-200",
                  !isActive && "group-hover:scale-110"
                )} />
                {item.title}
              </Link>

              {item.children && (
                <div className="ml-3 pl-4 border-l border-border/60 space-y-0.5">
                  {item.children.map((child) => {
                    const isChildActive = pathname === child.href;
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "group flex items-center gap-3 px-3 py-2 rounded-md text-[13px] transition-all duration-200",
                          isChildActive
                            ? "text-burgundy font-medium bg-burgundy/5"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                        )}
                      >
                        <child.icon className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          !isChildActive && "group-hover:scale-110"
                        )} />
                        {child.title}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-5 border-t border-border/60">
        <p className="text-[11px] text-muted-foreground">
          <span className="font-medium text-foreground/60">Nooma</span> · Personal Edition
        </p>
      </div>
    </aside>
  );
}
