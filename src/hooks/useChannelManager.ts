import { useMemo, useState } from "react";
import type {
    Channel,
    ChannelFilter,
    GroupBy,
    LcnMap,
    ProviderMap,
    SortBy,
} from "../types/channel";

export function useChannelManager() {
    const [channels, setChannels] = useState<Channel[]>([]);
    const [originalChannels, setOriginalChannels] = useState<Channel[]>([]);
    const [originalLcn, setOriginalLcn] = useState<Record<number, number>>({});
    const [providerMap, setProviderMap] = useState<ProviderMap>({});
    const [rawU8, setRawU8] = useState<Uint8Array | null>(null);
    const [lcnMap, setLcnMap] = useState<LcnMap>({});
    const [filter, setFilter] = useState<ChannelFilter>("all");
    const [groupProvider, setGroupProvider] = useState<number | null>(null);
    const [query, setQuery] = useState("");
    const [groupBy, setGroupBy] = useState<GroupBy>("100");
    const [sortBy, setSortBy] = useState<SortBy>("lcn");
    const [selectedUid, setSelectedUid] = useState<number | null>(null);
    const [insertUid, setInsertUid] = useState<number | null>(null);
    const [insertLcn, setInsertLcn] = useState<number>(1010);

    const stats = useMemo(() => {
        const isRadio = (c: Channel) =>
            c.svcType === "radio" || c.svcType === "fm-radio";
        const isTv = (c: Channel) => !isRadio(c);

        return {
            total: channels.length,
            tv: channels.filter(isTv).length,
            radio: channels.filter(isRadio).length,
            editable: channels.filter((c) => c.editable).length,
            changed: channels.filter(
                (c) => c.editable && c.lcn !== originalLcn[c.uid]
            ).length,
        };
    }, [channels, originalLcn]);

    return {
        channels,
        setChannels,
        originalChannels,
        setOriginalChannels,
        originalLcn,
        setOriginalLcn,
        providerMap,
        setProviderMap,
        rawU8,
        setRawU8,
        lcnMap,
        setLcnMap,
        filter,
        setFilter,
        groupProvider,
        setGroupProvider,
        query,
        setQuery,
        groupBy,
        setGroupBy,
        sortBy,
        setSortBy,
        selectedUid,
        setSelectedUid,
        insertUid,
        setInsertUid,
        insertLcn,
        setInsertLcn,
        stats,
    };
}