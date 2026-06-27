"use client";

import { useActionState, useState } from "react";
import { loginAction } from "@/app/admin/login/actions";

type LoginState = { error: string; success?: boolean };

const initialState: LoginState = { error: "" };

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [state, formAction] = useActionState<LoginState, FormData>(
    loginAction,
    initialState,
  );

  return (
    <div className="container-bsm flex min-h-[70vh] items-center justify-center py-20">
      <form
        action={formAction}
        className="w-full max-w-md rounded-[1.5rem] border border-[#ececec] bg-surface p-8"
      >
        <p className="eyebrow">Admin Access</p>
        <h1 className="mt-3 text-3xl font-bold text-ink">Sign in</h1>
        <p className="mt-3 text-sm text-muted">
          Use the admin password from your environment variables.
        </p>
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          className="mt-6 h-12 w-full rounded-full border border-[#ececec] px-4 text-sm outline-none focus:border-amber"
          required
        />
        <button
          type="submit"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-ink px-5 text-sm font-semibold text-white"
        >
          Continue
        </button>
        {state.error ? (
          <p className="mt-4 text-sm text-red-600">{state.error}</p>
        ) : null}
      </form>
    </div>
  );
}
