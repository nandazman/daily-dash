import React, { ComponentProps } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import ModalWrapper from './ModalWrapper';

type ConfirmModalProps = {
  visible: boolean;
  description: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmText?: string;
  children?: ComponentProps<"div">['children']
};

export default function ConfirmationModal({
	visible,
	description,
	onClose,
	onConfirm,
	confirmText = "Confirm",
	children,
}: ConfirmModalProps) {
	return (
		<ModalWrapper visible={visible} onClose={onClose}>
			<View style={styles.container}>
				<Text style={styles.description}>{description}</Text>
				{children}
				<View style={styles.buttonContainer}>
					<View style={styles.button}>
						<Button title="Cancel" onPress={onClose} color="#757575" />
					</View>
					<View style={styles.button}>
						<Button title={confirmText} onPress={onConfirm} color="#4CAF50" />
					</View>
				</View>
			</View>
		</ModalWrapper>
	);
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	description: {
		fontSize: 16,
		marginBottom: 20,
		textAlign: 'center',
	},
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 10,
	},
	button: {
		flex: 1,
		marginHorizontal: 5,
	},
});
