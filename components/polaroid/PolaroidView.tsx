import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import {
	Button,
	Dimensions,
	Image,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

const SCREEN_WIDTH = Dimensions.get("window").width;
const POLAROID_WIDTH = SCREEN_WIDTH * 0.8;
const POLAROID_HEIGHT = POLAROID_WIDTH;
const PHOTO_PADDING = 16;

export function PolaroidView({
	// streakId,
	note,
	title,
	milestone,
}: {
	streakId: number;
	note: string;
	title: string;
	milestone: number;
}) {
	const initMessage = `I've been doing ${title} for the past ${milestone} days!${note ? `\n ${note}` : ""}`;
	const [facing, setFacing] = useState<CameraType>("back");
	const [permission, requestPermission] = useCameraPermissions();
	const cameraRef = useRef<CameraView | null>(null);
	const messageRef = useRef(
		`I've been doing ${title} for the past ${milestone} days!${note ? `\n ${note}` : ""}`,
	);
	const [photoUri, setPhotoUri] = useState<string | null>(null);

	if (!permission) {
		// Camera permissions are still loading.
		return <View />;
	}

	if (!permission.granted) {
		console.log("not granted");
		return (
			<View>
				<Text>We need your permission to show the camera</Text>
				<Button onPress={requestPermission} title="grant permission" />
			</View>
		);
	}

	function toggleCameraFacing() {
		setFacing((current) => (current === "back" ? "front" : "back"));
	}

	const takePhoto = async () => {
		if (!cameraRef.current) return;

		try {
			const photo = await cameraRef.current.takePictureAsync();
			if (!photo) return;
			setPhotoUri(photo.uri);

			// Save photo to file system
			// const savedPhotoPath = await savePhotoToFileSystem(photo.uri);

			// Save to database
			// await savePhotoToDatabase(savedPhotoPath);

			// Notify parent component
			// onPhotoSaved?.();
		} catch (error) {
			console.error("Error taking photo:", error);
		}
	};

	// const savePhotoToFileSystem = async (uri: string) => {
	// try {
	// 	const fileName = `streak_${streakId}_milestone_${milestone}_${Date.now()}.jpg`;
	// 	const directory = `${FileSystem.documentDirectory}photos/`;
	// 	const dirInfo = await FileSystem.getInfoAsync(directory);
	// 	if (!dirInfo.exists) {
	// 		await FileSystem.makeDirectoryAsync(directory, {
	// 			intermediates: true,
	// 		});
	// 	}
	// 	const newPath = directory + fileName;
	// 	await FileSystem.moveAsync({
	// 		from: uri,
	// 		to: newPath,
	// 	});
	// 	return newPath;
	// } catch (error) {
	// 	console.error("Error saving photo:", error);
	// 	throw error;
	// }
	// };
	const retakePhoto = () => {
		setPhotoUri(null);
	};
	return (
		<View style={styles.wrapper}>
			<View style={styles.polaroidFrame}>
				{!photoUri ? (
					<CameraView ref={cameraRef} style={styles.camera} facing={facing}>
						<View style={styles.buttonContainer}>
							<TouchableOpacity
								style={styles.rotateButton}
								onPress={toggleCameraFacing}
							>
								<MaterialIcons name="flip-camera-ios" size={30} color="white" />
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.captureButton}
								onPress={takePhoto}
							>
								<Ionicons name="camera" size={30} color="white" />
							</TouchableOpacity>
						</View>
					</CameraView>
				) : (
					<View style={styles.photoContainer}>
						<Image source={{ uri: photoUri }} style={styles.photo} />
						<TouchableOpacity style={styles.retakeButton} onPress={retakePhoto}>
							<MaterialIcons name="replay" size={30} color="white" />
						</TouchableOpacity>
					</View>
				)}
				<View>
					<TextInput
						style={styles.inputMessage}
						editable
						multiline
						numberOfLines={4}
						placeholder={initMessage}
						onChangeText={(text) => {
							messageRef.current = text;
						}}
					/>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	wrapper: {
		justifyContent: "center",
		alignItems: "center",
		height: "100%",
	},
	photoContainer: {
		width: POLAROID_WIDTH - PHOTO_PADDING * 2,
		height: POLAROID_WIDTH - PHOTO_PADDING * 2,
		position: "relative",
	},
	buttonContainer: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "center",
		columnGap: 16,
		alignItems: "flex-end",
		marginBottom: 16,
	},
	rotateButton: {
		width: 60,
		height: 60,
		borderRadius: 30,
		borderWidth: 3,
		borderColor: "white",
		backgroundColor: "transparent",
		justifyContent: "center",
		alignItems: "center",
	},
	captureButton: {
		width: 60,
		height: 60,
		borderRadius: 35,
		borderWidth: 3,
		borderColor: "white",
		backgroundColor: "transparent",
		justifyContent: "center",
		alignItems: "center",
	},
	retakeButton: {
		position: "absolute",
		bottom: 20,
		alignSelf: "center",
		padding: 10,
		backgroundColor: "rgba(0,0,0,0.5)",
		borderRadius: 10,
		justifyContent: "center",
		alignItems: "center",
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
	camera: {
		width: POLAROID_WIDTH - PHOTO_PADDING * 2,
		height: POLAROID_WIDTH - PHOTO_PADDING * 2, // Square aspect ratio
		position: "relative",
	},
	inputMessage: {
		backgroundColor: "#fff",
		color: Colors["light"].text,
		fontSize: 12,
	},
});
