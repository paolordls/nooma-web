"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, LayoutGroup } from "framer-motion";
import { cn } from "@/lib/utils";
import { springs } from "@/lib/animations";
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
      <motion.div
        className="px-6 py-8 border-b border-border/60"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springs.gentle}
      >
        <Link href="/" className="group flex items-center gap-3">
          <motion.div
            className="w-9 h-9 rounded-lg bg-gradient-to-br from-burgundy to-burgundy-dark flex items-center justify-center shadow-sm"
            whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(91, 58, 58, 0.2)" }}
            whileTap={{ scale: 0.95 }}
            transition={springs.snappy}
          >
            <span className="text-white font-serif font-semibold text-lg">N</span>
          </motion.div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Nooma</h1>
            <p className="text-[11px] text-muted-foreground tracking-wide uppercase">Productivity</p>
          </div>
        </Link>
      </motion.div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <LayoutGroup>
          {navItems.map((item, index) => {
            const isActive = pathname === item.href;
            const isParentActive = item.children?.some(child => pathname === child.href);

            return (
              <motion.div
                key={item.href}
                className="space-y-1"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...springs.gentle, delay: index * 0.05 }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "group relative flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150",
                    isActive
                      ? "text-white"
                      : isParentActive
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground/80 hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-burgundy rounded-lg shadow-sm"
                      transition={springs.snappy}
                    />
                  )}
                  <item.icon className={cn(
                    "h-[18px] w-[18px] relative z-10 transition-transform duration-150",
                    !isActive && "group-hover:scale-110"
                  )} />
                  <span className="relative z-10">{item.title}</span>
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
                            "group relative flex items-center gap-3 px-3 py-2 rounded-md text-[13px] transition-colors duration-150",
                            isChildActive
                              ? "text-burgundy font-medium bg-burgundy/5"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                          )}
                        >
                          <child.icon className={cn(
                            "h-4 w-4 transition-transform duration-150",
                            !isChildActive && "group-hover:scale-110"
                          )} />
                          {child.title}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            );
          })}
        </LayoutGroup>
      </nav>

      {/* Footer with AI Indicator */}
      <div className="px-6 py-5 border-t border-border/60">
        <div className="flex items-center justify-between">
          <p className="text-[11px] text-muted-foreground">
            <span className="font-medium text-foreground/60">Nooma</span> · Personal Edition
          </p>
          <AIIndicator />
        </div>
      </div>
    </aside>
  );
}

/**
 * AI Presence Indicator
 * Shows MCP connection status with subtle pulse when connected
 */
function AIIndicator() {
  // In a real implementation, this would check actual MCP connection status
  const isConnected = true;

  return (
    <motion.div
      className="flex items-center gap-1.5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      title={isConnected ? "AI Connected" : "AI Disconnected"}
    >
      <motion.div
        className={cn(
          "w-2 h-2 rounded-full",
          isConnected ? "bg-burgundy" : "bg-muted-foreground/40"
        )}
        animate={isConnected ? {
          scale: [1, 1.2, 1],
          opacity: [1, 0.7, 1],
        } : undefined}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
        }}
      />
    </motion.div>
  );
}
