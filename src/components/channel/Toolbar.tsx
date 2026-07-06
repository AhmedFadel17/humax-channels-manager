import type { ChannelFilter } from "../../types/channel";
import { cn } from "../../lib/cn";

interface Props {
    disabled: boolean;
    query: string;
    onQueryChange: (value: string) => void;
    filter: ChannelFilter;
    onFilterChange: (filter: ChannelFilter) => void;
    resultText: string;
}

const filters: { key: ChannelFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "tv", label: "TV" },
    { key: "rd", label: "Radio" },
    { key: "hd", label: "HD" },
    { key: "ed", label: "Editable ≥1000" },
    { key: "ch", label: "Changed" },
];

export function Toolbar({
    disabled,
    query,
    onQueryChange,
    filter,
    onFilterChange,
    resultText,
}: Props) {
    return (
        <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-b1 bg-s1 px-4 py-2">
            <input
                type="search"
                value={query}
                disabled={disabled}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="Search name, LCN, provider…"
                className="min-w-[150px] max-w-[280px] flex-1 rounded border border-b1 bg-s2 px-3 py-1.5 text-sm text-txt outline-none placeholder:text-m1 focus:border-gold disabled:opacity-30"
            />

            <div className="flex flex-wrap gap-1">
                {filters.map((item) => (
                    <button
                        key={item.key}
                        disabled={disabled}
                        onClick={() => onFilterChange(item.key)}
                        className={cn(
                            "rounded border border-b1 bg-s2 px-3 py-1 font-orbitron text-[9px] font-bold uppercase tracking-wider text-m1 transition disabled:opacity-30",
                            filter === item.key && "border-gold bg-gold text-black"
                        )}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            <span className="ml-auto whitespace-nowrap font-orbitron text-[10px] text-m1">
                {resultText}
            </span>
        </div>
    );
}