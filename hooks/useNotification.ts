import { registerForPushNotificationsAsync } from '@/helper/allowNotificationAsync';
import { useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: true,
	}),
});

export function useNotification() {
	const [expoPushToken, setExpoPushToken] = useState('');
	const [notification, setNotification] = useState<Notifications.Notification | undefined>(
		undefined
	);
	const notificationListener = useRef<Notifications.EventSubscription>();

	useEffect(() => {
		registerForPushNotificationsAsync()
			.then(token => setExpoPushToken(token ?? ''))
			.catch((error: unknown) => setExpoPushToken(`${error}`));

		notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
			setNotification(notification);
		});


		return () => {
			if (notificationListener.current) {
				Notifications.removeNotificationSubscription(notificationListener.current);
			}
		};
	}, []);

	const pushNotification = (data: Notifications.NotificationRequestInput) => {
		Notifications.scheduleNotificationAsync(data);
	}

	return { pushNotification, notification, expoPushToken }
}
