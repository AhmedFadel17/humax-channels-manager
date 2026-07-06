import type { GroupBy, SortBy } from "../../types/channel";

interface Props {
    disabled: boolean;
    groupBy: GroupBy;
    sortBy: SortBy;
    onGroupByChange: (value: GroupBy) => void;
    onSortByChange: (value: SortBy) => void;
}

export function GroupSortBar({
    disabled,
    groupBy,
    sortBy,
    onGroupByChange,
    onSortByChange,
}: Props) {
    return (
        <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-b1 bg-s1 px-4 py-1.5">
            <label className="font-orbitron text-[8px] font-bold uppercase tracking-wider text-m1">
                Group:
            </label>

            <select
                disabled={disabled}
                value={groupBy}
                onChange={(e) => onGroupByChange(e.target.value as GroupBy)}
                className="rounded border border-b1 bg-s2 px-2 py-1 text-xs text-txt outline-none focus:border-gold disabled:opacity-30"
            >
                <option value="100">LCN x100</option>
                <option value="50">LCN x50</option>
                <option value="provider">Provider</option>
                <option value="type">Type</option>
                <option value="none">No grouping</option>
            </select>

            <label className="ml-2 font-orbitron text-[8px] font-bold uppercase tracking-wider text-m1">
                Sort:
            </label>

            <select
                disabled={disabled}
                value={sortBy}
                onChange={(e) => onSortByChange(e.target.value as SortBy)}
                className="rounded border border-b1 bg-s2 px-2 py-1 text-xs text-txt outline-none focus:border-gold disabled:opacity-30"
            >
                <option value="lcn">LCN ↑</option>
                <option value="lcn-d">LCN ↓</option>
                <option value="name">Name A–Z</option>
                <option value="name-d">Name Z–A</option>
            </select>
        </div>
    );
}