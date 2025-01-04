import { LanguageCode, setLanguage, SUPPORTED_LANGUAGES } from "@/i18n";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "./ThemedText";

export const LanguageSelector: React.FC = () => {
	const { i18n } = useTranslation();

	const handleLanguageChange = async (language: LanguageCode) => {
        console.log({ language })
		try {
			await setLanguage(language);
		} catch (error) {
			console.error("Error changing language:", error);
		}
	};

	return (
		<View className="p-4">
			{Object.entries(SUPPORTED_LANGUAGES).map(([code, language]) => (
				<TouchableOpacity
					key={code}
					onPress={() => handleLanguageChange(code as LanguageCode)}
					className={`flex-row justify-between items-center p-4 mb-2 rounded-lg ${
						i18n.language === code ? "bg-blue-500" : "bg-gray-100"
					}`}
				>
					<ThemedText
						className={`text-base ${
							i18n.language === code ? "text-white" : "text-gray-800"
						}`}
					>
						{language}
					</ThemedText>
				</TouchableOpacity>
			))}
		</View>
	);
};
