import type { Channel, GroupBy, ProviderMap, SortBy } from "../../types/channel";
import { ChannelRow } from "./ChannelRow";

interface Props {
    channels: Channel[];
    providerMap: ProviderMap;
    originalLcn: Record<number, number>;
    selectedUid: number | null;
    groupBy: GroupBy;
    sortBy: SortBy;
    filterText: string;
    groupProvider: number | null;
    onSelectChannel: (uid: number) => void;
    onMoveChannel: (uid: number, dir: -1 | 1) => void;
    onSetLcn: (uid: number, value: number) => void;
}

function isHd(c: Channel) {
    return c.svcType === "avc_hd_dtv" || c.svcType === "avc-sd-dtv";
}

function isRadio(c: Channel) {
    return c.svcType === "radio" || c.svcType === "fm-radio";
}

function getProvider(c: Channel, map: ProviderMap) {
    return map[c.prvuid] || "";
}

export function ChannelList({
    channels,
    providerMap,
    originalLcn,
    selectedUid,
    groupBy,
    sortBy,
    filterText,
    groupProvider,
    onSelectChannel,
    onMoveChannel,
    onSetLcn,
}: Props) {
    let vis = [...channels];

    if (groupProvider !== null) {
        vis = vis.filter((c) => c.prvuid === groupProvider);
    }

    if (filterText) {
        const q = filterText.toLowerCase();
        vis = vis.filter(
            (c) =>
                c.name.toLowerCase().includes(q) ||
                String(c.lcn).includes(q) ||
                getProvider(c, providerMap).toLowerCase().includes(q)
        );
    }

    if (sortBy === "lcn") vis.sort((a, b) => a.lcn - b.lcn);
    if (sortBy === "lcn-d") vis.sort((a, b) => b.lcn - a.lcn);
    if (sortBy === "name") vis.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "name-d") vis.sort((a, b) => b.name.localeCompare(a.name));

    if (!vis.length) {
        return (
            <div className="flex-1 overflow-y-auto bg-bg p-6">
                <div className="pt-12 text-center text-m1">
                    <h3 className="mb-2 font-orbitron text-sm tracking-[2px] text-b2">
                        NO CHANNELS FOUND
                    </h3>
                    <p>Adjust search or filter</p>
                </div>
            </div>
        );
    }

    const groups: Record<string, Channel[]> = {};

    const groupKey = (c: Channel) => {
        if (groupBy === "100") return String(Math.floor(c.lcn / 100) * 100);
        if (groupBy === "50") return String(Math.floor(c.lcn / 50) * 50);
        if (groupBy === "provider") return String(c.prvuid || 0);
        if (groupBy === "type") return isHd(c) ? "HD" : isRadio(c) ? "Radio" : "TV";
        return "_all";
    };

    const groupLabel = (key: string) => {
        if (groupBy === "100") return `${key} – ${Number(key) + 99}`;
        if (groupBy === "50") return `${key} – ${Number(key) + 49}`;
        if (groupBy === "provider") return providerMap[Number(key)] || `Provider #${key}`;
        if (groupBy === "type") return key;
        return "All Channels";
    };

    for (const c of vis) {
        const key = groupKey(c);
        if (!groups[key]) groups[key] = [];
        groups[key].push(c);
    }

    const keys = Object.keys(groups).sort((a, b) => {
        if (groupBy === "100" || groupBy === "50") return Number(a) - Number(b);
        return a.localeCompare(b);
    });

    return (
        <div className="flex-1 overflow-y-auto bg-bg px-3 py-2">
            {keys.map((key) => (
                <div key={key} data-r={key}>
                    <div className="flex items-center gap-2 py-2 font-orbitron text-[10px] font-bold uppercase tracking-[1.5px] text-m1">
                        <span>{groupLabel(key)}</span>
                        <span className="text-b2">({groups[key].length})</span>
                        <div className="h-px flex-1 bg-b1" />
                    </div>

                    {groups[key].map((channel) => (
                        <ChannelRow
                            key={channel.uid}
                            channel={channel}
                            provider={getProvider(channel, providerMap)}
                            changed={channel.editable && channel.lcn !== originalLcn[channel.uid]}
                            selected={selectedUid === channel.uid}
                            onSelect={() => onSelectChannel(channel.uid)}
                            onMoveUp={() => onMoveChannel(channel.uid, -1)}
                            onMoveDown={() => onMoveChannel(channel.uid, 1)}
                            onChangeLcn={(value) => onSetLcn(channel.uid, value)}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}