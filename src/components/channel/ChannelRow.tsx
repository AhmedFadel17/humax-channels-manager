import type { Channel } from "../../types/channel";
import { cn } from "../../lib/cn";

interface Props {
    channel: Channel;
    provider?: string;
    changed: boolean;
    selected: boolean;
    onSelect: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    onChangeLcn: (value: number) => void;
}

function isHd(channel: Channel) {
    return channel.svcType === "avc_hd_dtv" || channel.svcType === "avc-sd-dtv";
}

function isRadio(channel: Channel) {
    return channel.svcType === "radio" || channel.svcType === "fm-radio";
}

export function ChannelRow({
    channel,
    provider,
    changed,
    selected,
    onSelect,
    onMoveUp,
    onMoveDown,
    onChangeLcn,
}: Props) {
    const typeLabel = isHd(channel) ? "HD" : isRadio(channel) ? "RD" : "TV";
    const typeClass = isHd(channel)
        ? "bg-purple/20 text-purple"
        : isRadio(channel)
            ? "bg-green/20 text-green"
            : "bg-blue/20 text-blue";

    return (
        <div
            id={`row-${channel.uid}`}
            onClick={onSelect}
            className={cn(
                "group relative mb-1 flex cursor-pointer items-center gap-2 overflow-hidden rounded border border-b1 bg-s2 px-2 py-2 transition hover:border-b2 hover:bg-s3",
                "before:absolute before:left-0 before:top-0 before:h-full before:w-[2px] before:bg-transparent",
                channel.editable && "before:bg-gold",
                changed && "before:bg-cyan",
                selected && "border-cyan bg-cyan/10",
                channel.locked && "opacity-40",
                channel.removed && "opacity-30"
            )}
        >
            {channel.editable ? (
                <input
                    type="number"
                    min={1000}
                    value={channel.lcn}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => onChangeLcn(Number(e.target.value))}
                    className="w-16 rounded border border-transparent bg-transparent px-1 text-right font-orbitron text-sm font-bold text-gold outline-none focus:border-gold focus:bg-gold/10"
                />
            ) : (
                <span className="w-16 text-right font-orbitron text-sm font-bold text-m2">
                    {channel.lcn}
                </span>
            )}

            <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded text-[10px] font-bold font-orbitron", typeClass)}>
                {typeLabel}
            </div>

            <span className="flex-1 truncate text-sm font-medium">
                {channel.name || "Unknown"}
            </span>

            {provider && (
                <span className="max-w-[85px] truncate text-xs italic text-m2">
                    {provider}
                </span>
            )}

            {channel.editable && (
                <div
                    className="flex shrink-0 gap-1 opacity-0 transition group-hover:opacity-100"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        className="rounded bg-b1 px-2 py-1 text-m1 hover:bg-blue hover:text-white"
                        onClick={onMoveUp}
                    >
                        ▲
                    </button>
                    <button
                        className="rounded bg-b1 px-2 py-1 text-m1 hover:bg-gold hover:text-black"
                        onClick={onMoveDown}
                    >
                        ▼
                    </button>
                </div>
            )}
        </div>
    );
}