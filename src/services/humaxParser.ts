import type { Channel, LcnMap } from "../types/channel";

export function parseChannelsWithMap(
    u8: Uint8Array
): { channels: Channel[]; lcnMap: LcnMap } {
    const channels: Channel[] = [];
    const lcnMap: LcnMap = {};
    const seen: Record<number, boolean> = {};

    const len = u8.length;
    let pos = 0;

    while (pos < len - 10) {
        let found = false;

        for (; pos < len - 6; pos++) {
            if (
                u8[pos] === 0x22 &&
                u8[pos + 1] === 0x75 &&
                u8[pos + 2] === 0x69 &&
                u8[pos + 3] === 0x64 &&
                u8[pos + 4] === 0x22 &&
                u8[pos + 5] === 0x3a
            ) {
                found = true;
                break;
            }
        }

        if (!found) break;

        let objStart = pos - 1;
        while (objStart >= 0 && u8[objStart] !== 0x7b) objStart--;

        if (objStart < 0) {
            pos++;
            continue;
        }

        let depth = 0;
        let objEnd = -1;

        for (let i = objStart; i < Math.min(objStart + 5000, len); i++) {
            if (u8[i] === 0x7b) depth++;
            else if (u8[i] === 0x7d) {
                depth--;
                if (depth === 0) {
                    objEnd = i + 1;
                    break;
                }
            }
        }

        if (objEnd === -1) {
            pos++;
            continue;
        }

        try {
            const slice = u8.slice(objStart, objEnd);
            const text = new TextDecoder("utf-8", { fatal: false }).decode(slice);
            const obj = JSON.parse(text);

            if ("lcn" in obj && "name" in obj && !seen[obj.uid]) {
                seen[obj.uid] = true;

                let lcnStart = -1;
                let lcnEnd = -1;

                for (let j = objStart; j < objEnd - 6; j++) {
                    if (
                        u8[j] === 0x22 &&
                        u8[j + 1] === 0x6c &&
                        u8[j + 2] === 0x63 &&
                        u8[j + 3] === 0x6e &&
                        u8[j + 4] === 0x22 &&
                        u8[j + 5] === 0x3a
                    ) {
                        let k = j + 6;
                        while (k < objEnd && (u8[k] === 0x20 || u8[k] === 0x09)) k++;
                        lcnStart = k;
                        while (k < objEnd && u8[k] >= 0x30 && u8[k] <= 0x39) k++;
                        lcnEnd = k;
                        break;
                    }
                }

                if (lcnStart !== -1) {
                    const stored = parseInt(
                        new TextDecoder().decode(u8.slice(lcnStart, lcnEnd)),
                        10
                    );

                    if (stored === obj.lcn) {
                        lcnMap[obj.uid] = { start: lcnStart, end: lcnEnd };
                    }
                }

                let name = obj.name || "";
                try {
                    name = decodeURIComponent(name);
                } catch {
                    //
                }

                channels.push({
                    lcn: obj.lcn,
                    name,
                    uid: obj.uid,
                    svcType: obj.orgSvcType || obj.svcType || "tv",
                    prvuid: obj.prvuid || 0,
                    satType: obj.satType || "",
                    visibleFlag: obj.visibleFlag !== false,
                    locked: obj.locked === true,
                    removed: obj.removed === true,
                    svcid: obj.svcid || 0,
                    tsuid: obj.tsuid || 0,
                    editable: obj.lcn >= 1000,
                });
            }
        } catch {
            //
        }

        pos = objEnd;
    }

    channels.sort((a, b) => a.lcn - b.lcn);

    return { channels, lcnMap };
}