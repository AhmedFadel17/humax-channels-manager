import type { ReactNode } from "react";

interface Props {
    open: boolean;
    onClose: () => void;
    children: ReactNode;
}

export function Modal({ open, onClose, children }: Props) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80"
            onClick={onClose}
        >
            <div
                className="w-[440px] max-w-[94vw] rounded border border-b2 bg-s2 p-6"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
}