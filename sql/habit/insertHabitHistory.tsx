import { SQLiteDatabase } from "expo-sqlite";
import getCurrentTime from "../../helper/streak/getCurrentTime";
import { HabitHistory } from "@/type/habitHistory";

export default function insertHabitHistory({
	db,
	payload,
}: {
	db: SQLiteDatabase;
	payload: Omit<HabitHistory, "id" | "action_date">;
}) {
	return db.runAsync(
		`INSERT INTO habit_history (habit_id, action_date, action_type, note) 
       VALUES (?, ?, ?, ?)`,
		payload.habit_id,
		getCurrentTime(),
		payload.action_type,
		payload.note || null,
	);
}
