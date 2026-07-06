import type { Channel } from "../../types/channel";
import { Button } from "../ui/Button";

interface Props {
    channels: Channel[];
    disabled: boolean;
    insertUid: number | null;
    insertLcn: number;
    onInsertUidChange: (value: number) => void;
    onInsertLcnChange: (value: number) => void;
    onInsert: () => void;
}

export function InsertChannelBar({
    channels,
    disabled,
    insertUid,
    insertLcn,
    onInsertUidChange,
    onInsertLcnChange,
    onInsert,
}: Props) {
    const editable = channels
        .filter((c) => c.editable)
        .sort((a, b) => a.lcn - b.lcn);

    const selected = editable.find((c) => c.uid === insertUid);

    return (
        <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-b2 bg-s2 px-4 py-2">
            <label className="font-orbitron text-[10px] font-bold uppercase tracking-wider text-m2">
                Move channel:
            </label>

            <select
                disabled={disabled}
                value={insertUid ?? ""}
                onChange={(e) => onInsertUidChange(Number(e.target.value))}
                className="min-w-[160px] flex-1 rounded border border-b2 bg-s3 px-2 py-1 text-sm text-txt outline-none focus:border-gold disabled:opacity-30"
            >
                <option value="">— import a file first —</option>
                {editable.map((c) => (
                    <option key={c.uid} value={c.uid}>
                        [{c.lcn}] {c.name || "Unknown"}
                    </option>
                ))}
            </select>

            <label className="font-orbitron text-[10px] font-bold uppercase tracking-wider text-m2">
                → LCN
            </label>

            <input
                type="number"
                min={1000}
                disabled={disabled}
                value={insertLcn}
                onChange={(e) => onInsertLcnChange(Number(e.target.value))}
                className="w-20 rounded border border-b2 bg-s3 px-2 py-1 text-center font-orbitron text-sm font-bold text-gold outline-none focus:border-gold disabled:opacity-30"
            />

            <Button variant="accent" onClick={onInsert} disabled={disabled}>
                Insert & Shift ↓
            </Button>

            <span className="text-xs text-m1">
                {selected ? `Currently at LCN ${selected.lcn}` : ""}
            </span>
        </div>
    );
}