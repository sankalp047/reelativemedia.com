import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary";

function cls(variant: Variant, className: string) {
  return `btn ${variant === "primary" ? "btn-primary" : "btn-secondary"} ${className}`;
}

export function ButtonLink({
  variant = "primary",
  className = "",
  children,
  ...rest
}: ComponentProps<"a"> & { variant?: Variant; children: ReactNode }) {
  return (
    <a className={cls(variant, className)} {...rest}>
      {children}
    </a>
  );
}

export function Button({
  variant = "primary",
  className = "",
  children,
  ...rest
}: ComponentProps<"button"> & { variant?: Variant; children: ReactNode }) {
  return (
    <button className={cls(variant, className)} {...rest}>
      {children}
    </button>
  );
}
