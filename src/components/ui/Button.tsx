import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "accent" | "danger";
};

export function Button({
    className,
    variant = "default",
    ...props
}: Props) {
    return (
        <button
            className={cn(
                "rounded border px-3 py-1.5 font-orbitron text-[10px] font-bold uppercase tracking-wider transition disabled:pointer-events-none disabled:opacity-30",
                variant === "default" &&
                "border-b2 text-m2 hover:border-gold hover:bg-gold/10 hover:text-gold",
                variant === "accent" &&
                "border-gold bg-gold text-black hover:bg-gold2",
                variant === "danger" &&
                "border-b2 text-m2 hover:border-red hover:bg-red/10 hover:text-red",
                className
            )}
            {...props}
        />
    );
}