import { useCallback, useState } from "react";
import type { ToastState } from "../types/channel";

export function useToast() {
    const [toast, setToast] = useState<ToastState | null>(null);

    const showToast = useCallback(
        (message: string, type: ToastState["type"] = "info") => {
            setToast({ message, type });
            setTimeout(() => setToast(null), 3000);
        },
        []
    );

    return { toast, showToast };
}