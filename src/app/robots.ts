import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/**
 * Allow everything.
 *
 * A single wildcard group is all this needs. Under the robots.txt spec a
 * crawler uses the most specific group that matches its user-agent and falls
 * back to `*`, so `User-agent: *  Allow: /` already permits every AI crawler —
 * the retrieval bots that fetch a page to answer a question being asked right
 * now and cite it, and the training bots that take content into model training.
 *
 * An earlier version listed those agents by name. It was removed because it
 * changed nothing technically and put vendor names in a public file for no
 * benefit. If you ever want to block the training crawlers while staying
 * citable, add a named Disallow group for them and leave the wildcard alone —
 * never the other way round, because blocking the retrieval bots is what
 * removes you from the answer.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
