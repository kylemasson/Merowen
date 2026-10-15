"use client";

import { useActionState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { subscribe, type FormState } from "@/app/actions";

const idle: FormState = { ok: false, message: null };

export function InnerCircleForm({ label = "Join", compact = false }: { label?: string; compact?: boolean }) {
  const [state, action, pending] = useActionState(subscribe, idle);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  return (
    <div className="stack stack--tight">
      <form ref={formRef} action={action} className={compact ? "line-form line-form--compact" : "line-form"}>
        <input type="email" name="email" required placeholder="Email address" aria-label="Email address" autoComplete="email" />
        <button type="submit" disabled={pending}>
          {label}
        </button>
      </form>
      {state.message && (
        <p className="form-msg" role="status">
          {state.message}
        </p>
      )}
    </div>
  );
}

// The footer carries the sign-up on every page except home, which has its own Inner Circle section.
export function FooterInnerCircle() {
  if (usePathname() === "/") return null;
  return (
    <div className="stack stack--tight">
      <div className="eyebrow">The Inner Circle</div>
      <InnerCircleForm label="Subscribe" compact />
    </div>
  );
}
