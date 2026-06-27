"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/admin/login/actions";
import { Panel, controlInput, primaryButton } from "@/components/admin/ui";

type LoginState = { error: string; success?: boolean };

const initialState: LoginState = { error: "" };

export default function AdminLoginPage() {
  const [state, formAction] = useActionState<LoginState, FormData>(
    loginAction,
    initialState,
  );

  return (
    <div className="flex min-h-[58vh] items-center justify-center">
      <Panel className="w-full max-w-sm p-7">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
          Admin access
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink">
          Sign in
        </h1>
        <p className="mt-1.5 text-sm text-body">
          Enter the CMS password to manage site content.
        </p>

        <form action={formAction} className="mt-6 space-y-3">
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoFocus
            required
            className={controlInput}
          />
          <button type="submit" className={primaryButton + " w-full"}>
            Continue
          </button>
        </form>

        {state.error ? (
          <p className="mt-3 text-sm font-medium text-red-600">{state.error}</p>
        ) : null}
      </Panel>
    </div>
  );
}
