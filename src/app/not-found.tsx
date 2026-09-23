import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SITE } from "@/lib/site";

export default function NotFound() {
  return (
    <main className="relative flex min-h-svh items-center bg-midnight pt-[var(--nav-h)]">
      <div className="wrap py-24">
        <Eyebrow className="mb-6 text-steel">404 — Not found</Eyebrow>
        <h1 className="t-display !text-[clamp(40px,7vw,112px)]">
          That page is not
          <br />
          on the calendar.
        </h1>
        <p className="t-lead mt-9 text-slate">
          The link may be old, or the page has moved. Everything on the site is one click away.
        </p>
        <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:items-center">
          <ButtonLink href="/">Back to the homepage</ButtonLink>
          {/* "/#packages" rather than "#packages": this renders on a 404 route,
              so a bare hash would resolve against the missing URL. */}
          <Link href="/#packages" className="link-underline self-start eyebrow text-slate sm:self-auto">
            See the packages →
          </Link>
        </div>
        <a href={SITE.phoneTel} className="link-underline mono mt-14 inline-block text-slate">
          Or call {SITE.phone}
        </a>
      </div>
    </main>
  );
}
