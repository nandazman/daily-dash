import getDateDiffInDays from "@/helper/getDateDiffInDays";
import Streak from "@/type/streak";

export default async function checkStreakStatus({
	streaks,
	onUpdateStatus,
}: {
	streaks: Streak[];
	onUpdateStatus: (id: number) => Promise<void>;
}) {
	const updatedStreak = [];
	for (let i = 0; i < streaks.length; i++) {
		const streak = streaks[i];
		const diffInDays = getDateDiffInDays({
			startDate: streak.current_streak_date,
		});
		if (diffInDays >= 2) {
			await onUpdateStatus(streak.id);
			streak.status = "fail";
		}
		updatedStreak.push(streak);
	}
	return updatedStreak;
}
