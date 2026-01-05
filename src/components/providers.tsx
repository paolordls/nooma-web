"use client";

import { ToastProvider } from "@/components/ui/toast";
import { CelebrationProvider } from "@/components/celebration";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <CelebrationProvider>{children}</CelebrationProvider>
    </ToastProvider>
  );
}
