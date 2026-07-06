export interface Channel {
    uid: number;
    lcn: number;
    name: string;
    svcType: string;
    prvuid: number;
    satType?: string;
    visibleFlag: boolean;
    locked: boolean;
    removed: boolean;
    svcid: number;
    tsuid: number;
    editable: boolean;
}

export interface LcnMapPosition {
    start: number;
    end: number;
}

export type LcnMap = Record<number, LcnMapPosition>;
export type ProviderMap = Record<number, string>;

export type ChannelFilter = "all" | "tv" | "rd" | "hd" | "ed" | "ch";
export type GroupBy = "100" | "50" | "provider" | "type" | "none";
export type SortBy = "lcn" | "lcn-d" | "name" | "name-d";

export interface ToastState {
    message: string;
    type?: "ok" | "error" | "info";
}