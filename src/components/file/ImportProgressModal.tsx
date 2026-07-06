import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";

interface Props {
    open: boolean;
    title: string;
    message: string;
    progress: number;
    onClose: () => void;
}

export function ImportProgressModal({
    open,
    title,
    message,
    progress,
    onClose,
}: Props) {
    return (
        <Modal open={open} onClose={onClose}>
            <h3 className="mb-3 font-orbitron text-sm font-bold tracking-wider text-white">
                {title}
            </h3>
            <p className="mb-4 text-sm text-m2">{message}</p>
            <div className="mb-4 h-[2px] overflow-hidden rounded bg-b1">
                <div
                    className="h-full bg-gradient-to-r from-gold to-gold2 transition-all"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <div className="flex justify-end">
                <Button onClick={onClose}>Close</Button>
            </div>
        </Modal>
    );
}