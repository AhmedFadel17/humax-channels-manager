interface Props {
    visible: boolean;
    onBrowse: () => void;
    onDropFile: (file: File) => void;
}

export function Dropzone({ visible, onBrowse, onDropFile }: Props) {
    if (!visible) return null;

    return (
        <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-bg"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                if (file) onDropFile(file);
            }}
        >
            <div
                className="cursor-pointer rounded-xl border-2 border-dashed border-b3 px-16 py-12 text-center hover:border-gold hover:bg-gold/10"
                onClick={onBrowse}
            >
                <div className="mb-4 text-5xl opacity-50">📡</div>
                <div className="font-orbitron text-base font-bold tracking-[2px] text-m2">
                    No File Loaded
                </div>
                <div className="mx-auto mt-3 max-w-[300px] text-sm leading-6 text-m1">
                    Import your Humax C1 <strong>.db</strong> backup file to view and reorder your channels
                </div>
                <button
                    className="mt-4 rounded bg-gold px-6 py-2 font-orbitron text-xs font-bold uppercase tracking-wider text-black hover:opacity-85"
                    onClick={(e) => {
                        e.stopPropagation();
                        onBrowse();
                    }}
                >
                    ↑ Choose .db File
                </button>
            </div>

            <div className="font-orbitron text-[11px] tracking-wider text-b3">
                or drag & drop your .db file anywhere here
            </div>
        </div>
    );
}