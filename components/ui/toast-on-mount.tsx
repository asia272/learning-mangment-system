"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

export function ToastOnMount({ message }: { message: string }) {
    const shown = useRef(false);
    useEffect(() => {
        if (shown.current) return; // avoids a double toast in dev mode
        shown.current = true;
        toast.success(message);
    }, [message]);
    return null;
}