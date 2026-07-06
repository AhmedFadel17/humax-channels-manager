import type { ProviderMap } from "../types/channel";

export function extractProviders(u8: Uint8Array): ProviderMap {
    const map: ProviderMap = {};
    const text = new TextDecoder("utf-8", { fatal: false }).decode(u8);
    const re = /\{"uid":(\d+),"version":0,"name":"([^"]*)"\}/g;

    let match: RegExpExecArray | null;

    while ((match = re.exec(text)) !== null) {
        try {
            map[+match[1]] = decodeURIComponent(match[2]);
        } catch {
            map[+match[1]] = match[2];
        }
    }

    return map;
}