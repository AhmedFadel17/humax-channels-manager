import type { ToastState } from "../../types/channel";
import { cn } from "../../lib/cn";

interface Props {
    toast: ToastState | null;
}

export function Toast({ toast }: Props) {
    if (!toast) return null;

    return (
        <div
            className={cn(
                "fixed bottom-4 right-4 z-[9999] rounded border px-4 py-2 font-orbitron text-[10px] font-bold tracking-wider",
                toast.type === "ok" && "border-green text-green",
                toast.type === "error" && "border-red text-red",
                toast.type === "info" && "border-gold text-gold",
                "bg-s3"
            )}
        >
            {toast.message}
        </div>
    );
}