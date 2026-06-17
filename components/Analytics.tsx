"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/* GoatCounter — privacy-friendly, cookieless analytics.
   The site uses client-side routing, so we disable count.js's automatic
   on-load counting (no_onload) and fire a pageview manually on every
   route change instead — otherwise navigations between pages wouldn't
   be tracked. Localhost is ignored by GoatCounter by default, so dev
   visits don't pollute the stats. */

declare global {
  interface Window {
    goatcounter?: {
      count?: (vars?: { path?: string; title?: string; event?: boolean }) => void;
    };
  }
}

export default function Analytics() {
  const pathname = usePathname();
  const loaded = useRef(false);

  // Count subsequent client-side navigations (initial load handled in onLoad)
  useEffect(() => {
    if (!loaded.current) return;
    window.goatcounter?.count?.({ path: pathname });
  }, [pathname]);

  return (
    <Script
      data-goatcounter="https://olemkecher.goatcounter.com/count"
      data-goatcounter-settings='{"no_onload":true}'
      src="https://gc.zgo.at/count.js"
      strategy="afterInteractive"
      onLoad={() => {
        loaded.current = true;
        window.goatcounter?.count?.({ path: window.location.pathname });
      }}
    />
  );
}
