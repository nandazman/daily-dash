import {
	PHOTO_PADDING,
	POLAROID_HEIGHT,
	POLAROID_WIDTH,
} from "@/constants/Polaroid";
import { Image, StyleSheet, Text, View } from "react-native";

export function PolaroidView({
	uri,
	message,
}: {
	uri: string;
	message: string;
}) {
	return (
		<View style={styles.polaroidFrame}>
			<View style={styles.photoContainer}>
				<Image source={{ uri: uri }} style={styles.photo} />
			</View>
			<View>
				<Text style={{ paddingTop: 16 }}>{message}</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	photoContainer: {
		width: POLAROID_WIDTH - PHOTO_PADDING * 2,
		height: POLAROID_WIDTH - PHOTO_PADDING * 2,
		position: "relative",
	},
	polaroidFrame: {
		width: POLAROID_WIDTH,
		minHeight: POLAROID_HEIGHT,
		backgroundColor: "white",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		padding: PHOTO_PADDING,
	},
	photo: {
		width: "100%",
		height: "100%",
		resizeMode: "cover",
	},
});
