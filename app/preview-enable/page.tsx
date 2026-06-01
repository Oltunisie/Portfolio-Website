"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

const SECRET = "prometheus2026"; // change this to whatever you want
const COOKIE_NAME = "ol_preview";
const COOKIE_VALUE = "enabled";

function EnablePreview() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (params.get("key") === SECRET) {
      // Set cookie for 30 days
      const expires = new Date();
      expires.setDate(expires.getDate() + 30);
      document.cookie = `${COOKIE_NAME}=${COOKIE_VALUE}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
      router.replace("/");
    } else {
      router.replace("/");
    }
  }, [params, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#080d1a]">
      <p className="text-slate-400 text-sm font-mono">Activating preview…</p>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <EnablePreview />
    </Suspense>
  );
}
