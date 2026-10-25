"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function CheckoutRefresher() {
    const router = useRouter();
    const [tries, setTries] = useState(0);
    const maxTries = 10;

    useEffect(() => {
        if (tries >= maxTries) return;
        const t = setTimeout(() => {
            router.refresh();
            setTries((n) => n + 1);
        }, 2000);
        return () => clearTimeout(t);
    }, [tries, router]);

    return (
        <div className="mb-6 rounded border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
            {tries < maxTries
                ? "Payment received. We are setting up your enrollment..."
                : "Your payment went through, but the enrollment is taking longer than usual. Please refresh in a minute. If the course is still missing, contact support."}
        </div>
    );
}