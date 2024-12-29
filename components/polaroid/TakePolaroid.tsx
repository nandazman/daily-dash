import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import {
	Button,
	Image,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { savePhotoToAppStorage } from "@/helper/photoStorge";
import { useSQLiteContext } from "expo-sqlite";
import ModalSuccess from "../ui/Modal/ModalSuccess";
import { router } from "expo-router";
import {
	PHOTO_PADDING,
	POLAROID_HEIGHT,
	POLAROID_WIDTH,
} from "@/constants/Polaroid";

export function TakePolaroid({
	streakId,
	note,
	title,
	milestone,
}: {
	streakId: number;
	note: string;
	title: string;
	milestone: number;
}) {
	const db = useSQLiteContext();
	const initMessage = `I've been doing ${title} for the past ${milestone} days!${note ? ` ${note}` : ""}`;
	const [facing, setFacing] = useState<CameraType>("back");
	const [permission, requestPermission] = useCameraPermissions();
	const cameraRef = useRef<CameraView | null>(null);
	const messageRef = useRef(initMessage);
	const [photoUri, setPhotoUri] = useState<string | null>(null);
	const [showModalSuccess, setShowModalSuccess] = useState(false);

	if (!permission) {
		// Camera permissions are still loading.
		return <View />;
	}

	if (!permission.granted) {
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
		} catch (error) {
			console.error("Error taking photo:", error);
		}
	};

	const savePhoto = async () => {
		if (!photoUri) return;
		try {
			const path = await savePhotoToAppStorage({
				uri: photoUri,
				fileName: `streak_${streakId}_milestone_${milestone}_${Date.now()}.jpg`,
			});
			await db.runAsync(
				`
					INSERT INTO streak_photos (streak_id, milestone, photo_url, added_date, message)
					VALUES (?, ?, ?, ?, ?)
				`,
				streakId,
				milestone,
				path,
				Date.now(),
				messageRef.current,
			);
			setShowModalSuccess(true);
			setTimeout(() => {
				messageRef.current = "";
				setPhotoUri(null)
				router.push("/(streak)");
				setShowModalSuccess(false);
			}, 2000);
		} catch (err) {
			console.error({ err });
		}
	};
	const retakePhoto = () => {
		setPhotoUri(null);
	};
	return (
		<>
			<View style={styles.wrapper}>
				<View style={styles.polaroidFrame}>
					{!photoUri ? (
						<CameraView
							ref={cameraRef}
							style={styles.photoContainer}
							facing={facing}
						>
							<View style={styles.buttonContainer}>
								<TouchableOpacity
									style={styles.button}
									onPress={toggleCameraFacing}
								>
									<MaterialIcons
										name="flip-camera-ios"
										size={30}
										color="white"
									/>
								</TouchableOpacity>
								<TouchableOpacity style={styles.button} onPress={takePhoto}>
									<Ionicons name="camera" size={30} color="white" />
								</TouchableOpacity>
							</View>
						</CameraView>
					) : (
						<View style={styles.photoContainer}>
							<Image source={{ uri: photoUri }} style={styles.photo} />
							<View
								style={{
									...styles.buttonContainer,
									position: "absolute",
									width: "100%",
								}}
							>
								<TouchableOpacity style={styles.button} onPress={retakePhoto}>
									<MaterialIcons name="replay" size={30} color="white" />
								</TouchableOpacity>
								<TouchableOpacity style={styles.button} onPress={savePhoto}>
									<Ionicons name="save" size={30} color="white" />
								</TouchableOpacity>
							</View>
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
			<ModalSuccess
				message="Photo has been saved!"
				visible={showModalSuccess}
				onClose={() => {
					setShowModalSuccess(false);
				}}
			/>
		</>
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
		paddingBottom: 16,
		height: "100%",
	},
	button: {
		width: 60,
		height: 60,
		borderRadius: 30,
		borderWidth: 3,
		borderColor: "white",
		backgroundColor: "transparent",
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
	inputMessage: {
		backgroundColor: "#fff",
		color: Colors["light"].text,
		fontSize: 12,
	},
});
