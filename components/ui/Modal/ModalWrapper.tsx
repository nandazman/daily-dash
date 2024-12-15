import { ComponentProps } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { Portal } from 'react-native-paper';

export default function ModalWrapper({
	visible,
	onClose,
	children,
}: {
  visible: boolean;
  onClose: () => void;
  children: ComponentProps<'div'>['children'];
}) {
	return (
		<Portal>
			<Modal
				visible={visible}
				transparent={true}
				animationType="slide"
				statusBarTranslucent={true}
				onRequestClose={onClose}
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>{children}</View>
				</View>
			</Modal>
		</Portal>
	);
}

const styles = StyleSheet.create({
	modalOverlay: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	modalContent: {
		width: '80%',
		backgroundColor: '#fff',
		padding: 20,
		borderRadius: 8,
		elevation: 5,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
	},
});
