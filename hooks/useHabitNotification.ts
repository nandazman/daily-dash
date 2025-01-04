import * as Notifications from 'expo-notifications';
import { useNotification } from './useNotification';
import { useTranslation } from 'react-i18next';


export function useHabitNotification() {
	const { t } = useTranslation();
	const { pushNotification } = useNotification();

	const createNotification = async () => {
		const data = await Notifications.getAllScheduledNotificationsAsync();
		if (data.some((item) => item.content.data.type === 'habit')) {
			return
		}
		pushNotification({
			content: {
				title: t("habit.notification.title"),
				body: t("habit.notification.body"),
				data: { type: "habit", url: "/(habit)" },
			},
			trigger: {
				hour: 20,
				minute: 15,
				type: Notifications.SchedulableTriggerInputTypes.DAILY,
			},
		});
	}

	const removeNotification = async () => {
		const data = await Notifications.getAllScheduledNotificationsAsync();
		const currentNotiification = data.find((item) => item.content.data.type === 'habit')
		if (!currentNotiification) {
			return
		}
		Notifications.cancelScheduledNotificationAsync(currentNotiification.identifier)
	}

	return { createNotification, removeNotification }
}
