import * as Notifications from 'expo-notifications';
import { useNotification } from './useNotification';


export function useStreakNotification() {
	const { pushNotification } = useNotification();

	const createNotification = async () => {
		const data = await Notifications.getAllScheduledNotificationsAsync();
		if (data.some((item) => item.content.data.type === 'streak')) {
			return
		}
		pushNotification({
			content: {
				title: "Streak update",
				body: "You haven't updated your current streak today! Let's update your progress!",
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
