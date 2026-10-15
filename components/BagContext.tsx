"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import type { Bag } from "@/lib/bag-types";

type BagUI = {
  bag: Bag;
  bagOpen: boolean;
  menuOpen: boolean;
  setBagOpen: (open: boolean) => void;
  setMenuOpen: (open: boolean) => void;
  say: (message: string) => void;
};

const Ctx = createContext<BagUI | null>(null);

export function useBag() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBag outside BagProvider");
  return ctx;
}

export function BagProvider({ bag, children }: { bag: Bag; children: React.ReactNode }) {
  const [bagOpen, setBagOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const pathname = usePathname();

  // Changing route closes both panels.
  useEffect(() => {
    setBagOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const say = useCallback((message: string) => {
    clearTimeout(timer.current);
    setToast(message);
    timer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  const value = useMemo(
    () => ({ bag, bagOpen, menuOpen, setBagOpen, setMenuOpen, say }),
    [bag, bagOpen, menuOpen, say],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </Ctx.Provider>
  );
}
