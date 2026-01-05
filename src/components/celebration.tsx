"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Star, Trophy } from "lucide-react";
import { springs } from "@/lib/animations";
import { haptic } from "@/lib/haptics";

type CelebrationType = "task_complete" | "all_tasks_done" | "milestone";

interface CelebrationContextType {
  celebrate: (type: CelebrationType, message?: string) => void;
}

const CelebrationContext = createContext<CelebrationContextType | undefined>(undefined);

export function useCelebration() {
  const context = useContext(CelebrationContext);
  if (!context) {
    throw new Error("useCelebration must be used within a CelebrationProvider");
  }
  return context;
}

export function CelebrationProvider({ children }: { children: ReactNode }) {
  const [celebration, setCelebration] = useState<{
    type: CelebrationType;
    message: string;
  } | null>(null);

  const celebrate = useCallback((type: CelebrationType, message?: string) => {
    const messages = {
      task_complete: "Task completed!",
      all_tasks_done: "All caught up!",
      milestone: message || "Milestone reached!",
    };

    haptic.success();
    setCelebration({ type, message: messages[type] });

    // Auto-dismiss after animation
    setTimeout(() => {
      setCelebration(null);
    }, 2000);
  }, []);

  return (
    <CelebrationContext.Provider value={{ celebrate }}>
      {children}
      <CelebrationOverlay celebration={celebration} />
    </CelebrationContext.Provider>
  );
}

function CelebrationOverlay({
  celebration,
}: {
  celebration: { type: CelebrationType; message: string } | null;
}) {
  const icons = {
    task_complete: CheckCircle,
    all_tasks_done: Star,
    milestone: Trophy,
  };

  return (
    <AnimatePresence>
      {celebration && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
        >
          {/* Subtle backdrop glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={springs.bouncy}
            className="absolute w-64 h-64 rounded-full bg-burgundy/5 blur-3xl"
          />

          {/* Celebration card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={springs.bouncy}
            className="relative flex flex-col items-center gap-3 px-8 py-6 bg-card rounded-xl border border-burgundy/20 shadow-xl shadow-burgundy/10"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
              transition={{ ...springs.bouncy, delay: 0.1 }}
              className="w-12 h-12 rounded-full bg-burgundy/10 flex items-center justify-center"
            >
              {(() => {
                const Icon = icons[celebration.type];
                return <Icon className="h-6 w-6 text-burgundy" />;
              })()}
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-lg font-medium text-foreground"
            >
              {celebration.message}
            </motion.p>

            {celebration.type === "all_tasks_done" && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="text-sm text-muted-foreground"
              >
                Great work today!
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
