import Script from "next/script";

/**
 * Google Analytics 4 and Microsoft Clarity.
 *
 * Both run `afterInteractive`, so they load once the page is usable rather than
 * blocking first paint. Neither is needed for anything the visitor does, and the
 * hero already carries a video plus a 121-frame scroll sequence — analytics has
 * no business competing with that for bandwidth.
 *
 * The ids come from NEXT_PUBLIC_* env vars. They are not secrets — a measurement
 * id is visible in the page source of every site that uses one — but keeping
 * them in env means staging can point somewhere else, and means the tags simply
 * do not render if the vars are missing rather than reporting a local dev
 * session into production analytics.
 *
 * Clarity records session replays and heatmaps. That is personal data under
 * GDPR/CCPA: if this site ever takes EU traffic it needs a consent gate in front
 * of this component, not just a privacy policy. Today it is a DFW-local business
 * site, so it ships ungated — revisit that before any wider launch.
 */
export function Analytics() {
  const ga = process.env.NEXT_PUBLIC_GA_ID;
  const clarity = process.env.NEXT_PUBLIC_CLARITY_ID;

  return (
    <>
      {ga ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${ga}');`}
          </Script>
        </>
      ) : null}

      {clarity ? (
        <Script id="clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${clarity}");`}
        </Script>
      ) : null}
    </>
  );
}
