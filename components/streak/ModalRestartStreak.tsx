import ConfirmationModal from "@/components/ui/Modal/ConfirmationModal";
import { useRef } from "react";

export default function ModalRestartStreak({
	visible,
	onClose,
	onConfirm,
}: {
	visible: boolean;
	onClose: () => void;
	onConfirm: (_: string) => void;
}) {
	const note = useRef("");

	const closeModal = () => {
		onClose();
		note.current = "";
	};

	const confirmStop = () => {
		onConfirm(note.current);
		note.current = "";
	};
	return (
		<ConfirmationModal
			visible={visible}
			title="Resume streak ?"
			description="This streak will return to your home"
			onClose={closeModal}
			onConfirm={confirmStop}
			confirmText="Go!"
		/>
	);
}
