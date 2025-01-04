import ConfirmationModal from "@/components/ui/Modal/ConfirmationModal";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

export default function ModalRestartHabit({
	visible,
	onClose,
	onConfirm,
}: {
	visible: boolean;
	onClose: () => void;
	onConfirm: (_: string) => void;
}) {
	const { t } = useTranslation();
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
			title={t("habit.modalResume.title")}
			description={t("habit.modalResume.description")}
			onClose={closeModal}
			onConfirm={confirmStop}
			confirmText={t("habit.modalResume.confirm")}
		/>
	);
}
