"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import NProgress from "@/lib/nprogress";

export default function ProgressBar() {
  const pathname = usePathname();

  useEffect(() => {
    NProgress.configure({
      showSpinner: false,
      trickleSpeed: 100,
      minimum: 0.08,
    });

    const handleBeforeUnload = () => {
      NProgress.start();
    };

    const handleLoad = () => {
      NProgress.done();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("load", handleLoad);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  useEffect(() => {
    if (!pathname) return;

    NProgress.start();
    const timeout = window.setTimeout(() => {
      NProgress.done();
    }, 500);

    return () => {
      window.clearTimeout(timeout);
      NProgress.done();
    };
  }, [pathname]);

  return null;
}
