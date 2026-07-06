import type { Channel, ProviderMap } from "../../types/channel";

interface Props {
    channels: Channel[];
    providerMap: ProviderMap;
    groupProvider: number | null;
    onSelectProvider: (id: number | null) => void;
    onJumpRange: (range: string) => void;
}

export function Sidebar({
    channels,
    providerMap,
    groupProvider,
    onSelectProvider,
    onJumpRange,
}: Props) {
    const providerCounts = channels.reduce<Record<number, number>>((acc, c) => {
        if (c.prvuid) acc[c.prvuid] = (acc[c.prvuid] || 0) + 1;
        return acc;
    }, {});

    const topProviders = Object.entries(providerCounts)
        .sort((a, b) => Number(b[1]) - Number(a[1]))
        .slice(0, 15);

    const rangeCounts = channels.reduce<Record<number, number>>((acc, c) => {
        const range = Math.floor(c.lcn / 100) * 100;
        acc[range] = (acc[range] || 0) + 1;
        return acc;
    }, {});

    return (
        <aside className="hidden w-[188px] shrink-0 overflow-y-auto border-r border-b1 bg-s1 sm:flex sm:flex-col">
            <div className="py-2">
                <div className="px-3 pb-1 font-orbitron text-[8px] font-bold uppercase tracking-[1.5px] text-m1">
                    Providers
                </div>

                <div
                    className={`cursor-pointer border-l-2 px-3 py-1.5 text-xs ${groupProvider === null
                            ? "border-gold bg-gold/5 text-gold"
                            : "border-transparent text-m1 hover:bg-s2 hover:text-txt"
                        }`}
                    onClick={() => onSelectProvider(null)}
                >
                    <div className="flex items-center justify-between">
                        <span>All</span>
                        <span className="rounded bg-b1 px-2 py-0.5 text-[10px]">
                            {channels.length}
                        </span>
                    </div>
                </div>

                {topProviders.map(([pid, count]) => (
                    <div
                        key={pid}
                        className={`cursor-pointer border-l-2 px-3 py-1.5 text-xs ${groupProvider === Number(pid)
                                ? "border-gold bg-gold/5 text-gold"
                                : "border-transparent text-m1 hover:bg-s2 hover:text-txt"
                            }`}
                        onClick={() => onSelectProvider(Number(pid))}
                    >
                        <div className="flex items-center justify-between gap-2">
                            <span className="truncate">{providerMap[Number(pid)] || `#${pid}`}</span>
                            <span className="rounded bg-b1 px-2 py-0.5 text-[10px]">{count}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="py-2">
                <div className="px-3 pb-1 font-orbitron text-[8px] font-bold uppercase tracking-[1.5px] text-m1">
                    LCN Ranges
                </div>

                {Object.entries(rangeCounts)
                    .sort((a, b) => Number(a[0]) - Number(b[0]))
                    .map(([range, count]) => (
                        <div
                            key={range}
                            className="cursor-pointer border-l-2 border-transparent px-3 py-1.5 text-xs text-m1 hover:bg-s2 hover:text-txt"
                            onClick={() => onJumpRange(range)}
                        >
                            <div className="flex items-center justify-between">
                                <span>{range}–{Number(range) + 99}</span>
                                <span className="rounded bg-b1 px-2 py-0.5 text-[10px]">{count}</span>
                            </div>
                        </div>
                    ))}
            </div>
        </aside>
    );
}