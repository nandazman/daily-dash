import { StreakHistory } from "@/type/streakHistory";
import { SQLiteDatabase } from "expo-sqlite";
import getCurrentTime from "../../helper/streak/getCurrentTime";

export default async function insertStreakHistory({
	db,
	payload,
}: {
	db: SQLiteDatabase;
	payload: Omit<StreakHistory, "id" | "action_date">;
}): Promise<void> {
	await db.runAsync(
		`INSERT INTO streak_history (streak_id, action_date, action_type, note) 
       VALUES (?, ?, ?, ?, ?)`,
		payload.streak_id,
		getCurrentTime(),
		payload.action_type,
		payload.note || null,
	);
}
