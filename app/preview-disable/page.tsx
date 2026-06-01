"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const COOKIE_NAME = "ol_preview";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    // Expire the cookie immediately
    document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    router.replace("/");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#080d1a]">
      <p className="text-slate-400 text-sm font-mono">Deactivating preview…</p>
    </div>
  );
}
