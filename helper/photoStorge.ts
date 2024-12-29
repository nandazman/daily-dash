import * as FileSystem from 'expo-file-system';

export const savePhotoToAppStorage = async ({ uri, fileName }: {uri: string, fileName: string}) => {
	try {
		const directory = `${FileSystem.documentDirectory}photos/`;
    
		const dirInfo = await FileSystem.getInfoAsync(directory);
		if (!dirInfo.exists) {
			await FileSystem.makeDirectoryAsync(directory, {
				intermediates: true,
			});
		}
    
		const newPath = directory + fileName;
    
		await FileSystem.moveAsync({
			from: uri,
			to: newPath,
		});
    
		return newPath;
	} catch (error) {
		console.error("Error saving photo:", error);
		throw error;
	}
};

export const getPhotoPath = (fileName: string) => {
	return `${FileSystem.documentDirectory}photos/${fileName}`;
};

export const listSavedPhotos = async () => {
	try {
		const directory = `${FileSystem.documentDirectory}photos/`;
		const files = await FileSystem.readDirectoryAsync(directory);
		return files;
	} catch (error) {
		console.error("Error listing photos:", error);
		return [];
	}
};

export const deletePhoto = async (fileName: string) => {
	try {
		const filePath = getPhotoPath(fileName);
		await FileSystem.deleteAsync(filePath);
	} catch (error) {
		console.error("Error deleting photo:", error);
		throw error;
	}
};