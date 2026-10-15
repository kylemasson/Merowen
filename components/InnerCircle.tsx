"use client";

import { useActionState } from "react";
import { usePathname } from "next/navigation";
import { subscribe, type ActionState } from "@/app/actions";

function SignupForm({ id, small = false, label = "Join" }: { id: string; small?: boolean; label?: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(subscribe, null);
  return (
    <>
      <form action={action} className={small ? "line-form line-form--sm" : "line-form"}>
        <label htmlFor={id} className="visually-hidden">
          Email address
        </label>
        <input id={id} name="email" type="email" required autoComplete="email" placeholder="Email address" />
        <button type="submit" disabled={pending}>
          {pending ? "Joining" : label}
        </button>
      </form>
      <p className="form-note" role="status" aria-live="polite">
        {state?.message ?? ""}
      </p>
    </>
  );
}

/** Home page sign-up band. */
export function InnerCircle() {
  return (
    <section id="inner-circle" className="section" aria-labelledby="inner-circle-title" style={{ paddingBlock: "clamp(80px, 10vw, 144px)" }}>
      <div className="wrap split split--end">
        <div className="stack">
          <p className="eyebrow">The Inner Circle</p>
          <h2 id="inner-circle-title" className="display h2--sm">
            First word, <em>before the shelf.</em>
          </h2>
        </div>
        <div className="stack stack--24" style={{ maxWidth: 480 }}>
          <p className="lead">New postings, numbered Extrait batches and refill reminders. Sent rarely.</p>
          <div>
            <SignupForm id="inner-circle-email" />
          </div>
        </div>
      </div>
    </section>
  );
}

/** The footer carries the form on every page except home, which has its own band. */
export function FooterSignup() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return (
    <div id="inner-circle" className="footer-signup">
      <p className="eyebrow">The Inner Circle</p>
      <div>
        <SignupForm id="footer-email" small label="Subscribe" />
      </div>
    </div>
  );
}
