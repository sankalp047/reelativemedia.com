import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/**
 * primary   — the ONE cognac fill per screen. Bone label, never ink.
 * secondary — outlined, on any light ground.
 * invert    — outlined, INSIDE a dark well. (This is a change of meaning: it
 *             used to be the light-surface special case.)
 */
type Variant = "primary" | "secondary" | "invert";

const VARIANTS: Record<Variant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  invert: "btn-invert",
};

function cls(variant: Variant, className: string) {
  return `btn ${VARIANTS[variant]} ${className}`;
}

type ButtonLinkProps = Omit<ComponentProps<"a">, "href" | "ref"> & {
  href: string;
  variant?: Variant;
  children: ReactNode;
};

/** Anchor-styled button. Internal routes ("/work") get client-side navigation; hashes stay plain anchors so Lenis can smooth-scroll them. */
export function ButtonLink({ variant = "primary", className = "", children, href, ...rest }: ButtonLinkProps) {
  const c = cls(variant, className);
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={c} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={c} {...rest}>
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
