import * as Notifications from 'expo-notifications';
import { useNotification } from './useNotification';
import { useTranslation } from 'react-i18next';

export function useStreakNotification() {
	const { pushNotification } = useNotification();
	const { t } = useTranslation();
	const createNotification = async () => {
		const data = await Notifications.getAllScheduledNotificationsAsync();
		if (data.some((item) => item.content.data.type === 'streak')) {
			return
		}
		pushNotification({
			content: {
				title: t("streak.notification.title"),
				body: t("streak.notification.description"),
				data: { type: "streak", url: "/(streak)" },
			},
			trigger: {
				hour: 21,
				minute: 15,
				type: Notifications.SchedulableTriggerInputTypes.DAILY,
			},
		});
	}

	const removeNotification = async () => {
		const data = await Notifications.getAllScheduledNotificationsAsync();
		const currentNotiification = data.find((item) => item.content.data.type === 'streak')
		if (!currentNotiification) {
			return
		}
		Notifications.cancelScheduledNotificationAsync(currentNotiification.identifier)
	}

	return { createNotification, removeNotification }
}
