import { Logo } from "@/components/ui/Logo";
import { FUNASIA_BRANDS } from "@/lib/data";
import { SITE } from "@/lib/site";

const COLS = [
  { title: "Services", links: ["Reels", "Graphics", "Paid campaigns", "Landing pages", "Multilingual"] },
  { title: "Company", links: ["Work", "Packages", "About", "Careers", "Contact"] },
];

const HREFS: Record<string, string> = {
  Work: "#work",
  Packages: "#packages",
  About: "#about",
  Contact: "#audit",
  Reels: "#work",
  Graphics: "#system",
  "Paid campaigns": "#packages",
  "Landing pages": "#packages",
  Multilingual: "#packages",
};

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-line bg-elevated" aria-label="Footer">
      <div className="overflow-hidden">
        <p
          className="wrap select-none font-display font-extrabold leading-[0.78] tracking-[-0.04em] text-primary/[0.08]"
          style={{ fontSize: "10.5vw", marginBottom: "-0.22em" }}
          aria-hidden="true"
        >
          REELATIVE
        </p>
      </div>

      <div className="wrap grid gap-10 border-t border-line py-14 md:grid-cols-2 lg:grid-cols-4">
        {COLS.map((c) => (
          <div key={c.title}>
            <p className="eyebrow mb-5">{c.title}</p>
            <ul className="flex flex-col gap-3">
              {c.links.map((l) => (
                <li key={l}>
                  <a href={HREFS[l] ?? "#"} className="link-underline text-[15px] text-primary/85">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <p className="eyebrow mb-5">FunAsia Network</p>
          <ul className="flex flex-col gap-3">
            {FUNASIA_BRANDS.map((b) => (
              <li key={b.id}>
                <a href={b.href} target="_blank" rel="noopener noreferrer" className="link-underline text-[15px] text-primary/85">
                  {b.name}
                </a>
                <span className="mono ml-2 text-[10px] text-muted/60">{b.meta}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-5">Contact</p>
          <ul className="flex flex-col gap-3 text-[15px]">
            <li>
              <a href={SITE.phoneTel} className="link-underline text-primary/85">
                {SITE.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`} className="link-underline text-primary/85">
                {SITE.email}
              </a>
            </li>
            <li className="text-muted">{SITE.address}</li>
            <li className="flex gap-2 pt-2" aria-label="Social">
              {["IG", "FB", "YT", "LI"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="mono flex h-9 w-9 items-center justify-center rounded-full border border-line text-[10px] text-muted transition-colors hover:border-white/50 hover:text-primary"
                  aria-label={`${s} (link pending)`}
                >
                  {s}
                </a>
              ))}
            </li>
          </ul>
        </div>
      </div>

      <div id="about" className="wrap flex flex-col gap-6 border-t border-line py-8 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <Logo markSize={24} />
          <span className="hidden h-4 w-px bg-white/15 md:block" />
          <p className="text-[14px] text-muted">
            Reelative Media is a{" "}
            <span className="rounded-[6px] border border-dashed border-white/20 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-primary/80">
              FunAsia Network
            </span>{" "}
            company.
          </p>
        </div>
        <p className="mono text-muted/70">
          © {new Date().getFullYear()} Reelative Media ·{" "}
          <a href="#" className="hover:text-primary">
            Privacy
          </a>{" "}
          ·{" "}
          <a href="#" className="hover:text-primary">
            Terms
          </a>
        </p>
      </div>
    </footer>
  );
}
