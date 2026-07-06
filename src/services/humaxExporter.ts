import * as pako from "pako";
import type { Channel, LcnMap } from "../types/channel";

interface ExportParams {
    rawU8: Uint8Array;
    channels: Channel[];
    originalLcn: Record<number, number>;
    lcnMap: LcnMap;
}

function toArrayBuffer(view: Uint8Array): ArrayBuffer {
    return view.buffer.slice(
        view.byteOffset,
        view.byteOffset + view.byteLength
    ) as ArrayBuffer;
}

export function exportModifiedDb({
    rawU8,
    channels,
    originalLcn,
    lcnMap,
}: ExportParams): Blob {
    const dec = pako.inflate(rawU8);
    const patches: { start: number; end: number; newBytes: Uint8Array }[] = [];

    for (const c of channels) {
        const orig = originalLcn[c.uid];
        if (orig === undefined || c.lcn === orig) continue;

        const pos = lcnMap[c.uid];
        if (!pos) continue;

        const cur = parseInt(
            new TextDecoder().decode(dec.slice(pos.start, pos.end)),
            10
        );

        if (cur !== orig) continue;

        patches.push({
            start: pos.start,
            end: pos.end,
            newBytes: new TextEncoder().encode(String(c.lcn)),
        });
    }

    if (!patches.length) {
        return new Blob([toArrayBuffer(rawU8)], {
            type: "application/octet-stream",
        });
    }

    patches.sort((a, b) => b.start - a.start);

    const segments: Uint8Array[] = [];
    let cursor = dec.length;

    for (const patch of patches) {
        if (patch.end < cursor) segments.push(dec.slice(patch.end, cursor));
        segments.push(patch.newBytes);
        cursor = patch.start;
    }

    if (cursor > 0) segments.push(dec.slice(0, cursor));
    segments.reverse();

    const totalLen = segments.reduce((sum, seg) => sum + seg.length, 0);
    const patched = new Uint8Array(totalLen);

    let offset = 0;
    for (const seg of segments) {
        patched.set(seg, offset);
        offset += seg.length;
    }

    const comp = pako.deflate(patched, { level: 6 });

    return new Blob([toArrayBuffer(comp)], {
        type: "application/octet-stream",
    });
}