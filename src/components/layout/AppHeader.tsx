import { Button } from "../ui/Button";

interface Props {
    stats: {
        total: number;
        tv: number;
        radio: number;
        editable: number;
        changed: number;
    };
    hasData: boolean;
    onImport: () => void;
    onExportDb: () => void;
    onExportCsv: () => void;
    onOpenReset: () => void;
}

export function AppHeader({
    stats,
    hasData,
    onImport,
    onExportDb,
    onExportCsv,
    onOpenReset,
}: Props) {
    return (
        <header className="relative flex h-[50px] shrink-0 items-center gap-3 border-b border-b2 bg-s1 px-4">
            <div className="font-orbitron text-sm font-black tracking-[2px] text-white">
                HUMAX <span className="text-gold">C1</span>
                <span className="ml-1 text-[8px] text-m1">CH MGR</span>
            </div>

            <div className="hidden gap-3 sm:flex">
                <span className="font-orbitron text-[10px] text-m1">total <b className="text-gold">{hasData ? stats.total : "—"}</b></span>
                <span className="font-orbitron text-[10px] text-m1">TV <b className="text-gold">{hasData ? stats.tv : "—"}</b></span>
                <span className="font-orbitron text-[10px] text-m1">radio <b className="text-gold">{hasData ? stats.radio : "—"}</b></span>
                <span className="font-orbitron text-[10px] text-m1">editable <b className="text-gold">{hasData ? stats.editable : "—"}</b></span>
                <span className="font-orbitron text-[10px] text-m1">changed <b className="text-cyan">{hasData ? stats.changed : "—"}</b></span>
            </div>

            <div className="flex-1" />

            <Button variant="accent" onClick={onImport}>
                ↑ Import .db
            </Button>
            <Button onClick={onExportDb} disabled={!hasData}>
                ↓ Export .db
            </Button>
            <Button onClick={onExportCsv} disabled={!hasData}>
                ↓ CSV
            </Button>
            <Button variant="danger" onClick={onOpenReset} disabled={!hasData}>
                ↺ Reset
            </Button>
        </header>
    );
}