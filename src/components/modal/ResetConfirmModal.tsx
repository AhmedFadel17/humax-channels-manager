import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";

interface Props {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export function ResetConfirmModal({ open, onClose, onConfirm }: Props) {
    return (
        <Modal open={open} onClose={onClose}>
            <h3 className="mb-3 font-orbitron text-sm font-bold tracking-wider text-white">
                RESET ALL CHANGES?
            </h3>
            <p className="mb-4 text-sm leading-6 text-m2">
                All reordering, inserts and LCN edits will be discarded. The original
                channel order from your imported file will be restored.
            </p>
            <div className="flex justify-end gap-2">
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="danger" onClick={onConfirm}>
                    Reset Everything
                </Button>
            </div>
        </Modal>
    );
}