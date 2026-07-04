"use client";

import type { ReactNode } from "react";

// A submit button that asks for confirmation before allowing its (server
// action) form to submit. Keeps the surrounding form server-rendered while
// adding a client-side guard against accidental destructive actions.
export function ConfirmSubmit({
  message,
  className,
  children,
}: {
  message: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(event) => {
        if (!window.confirm(message)) {
          event.preventDefault();
        }
      }}
    >
      {children}
    </button>
  );
}
