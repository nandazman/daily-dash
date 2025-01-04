import ConfirmationModal from "@/components/ui/Modal/ConfirmationModal";
import { useRef } from "react";

export default function ModalRestartHabit({
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
			title="Resume habit ?"
			description="This habit will return to your home"
			onClose={closeModal}
			onConfirm={confirmStop}
			confirmText="Go!"
		/>
	);
}
