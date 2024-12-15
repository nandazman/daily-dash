import { SQLiteDatabase } from "expo-sqlite";

export default async function updateStreakFail({
	db,
	id,
}: {
	db: SQLiteDatabase;
	id: number;
}): Promise<void> {
	await db.runAsync("UPDATE streak SET status = ? WHERE id = ?", "fail", id);
}
