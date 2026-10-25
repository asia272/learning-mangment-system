"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Re-fetches the server data of the current page while the tab is visible.
export function AutoRefresh({ intervalMs = 30000 }: { intervalMs?: number }) {
    const router = useRouter();

    useEffect(() => {
        const id = setInterval(() => {
            if (document.visibilityState === "visible") router.refresh();
        }, intervalMs);
        return () => clearInterval(id);
    }, [router, intervalMs]);

    return null;
}