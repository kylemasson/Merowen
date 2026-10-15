"use client";

import { useEffect, useState } from "react";
import { TOAST } from "@/lib/ui";

export function Toaster() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const on = (e: Event) => {
      clearTimeout(timer);
      setMessage((e as CustomEvent<string>).detail);
      timer = setTimeout(() => setMessage(null), 3200);
    };
    window.addEventListener(TOAST, on);
    return () => {
      window.removeEventListener(TOAST, on);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div role="status" aria-live="polite">
      {message ? <div className="toast">{message}</div> : null}
    </div>
  );
}
