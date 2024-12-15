import { SQLiteDatabase } from "expo-sqlite";

export default async function sqlTransaction({
	db,
	transaction,
}: {
	db: SQLiteDatabase;
	transaction: () => Promise<void>;
}) {
	try {
		await db.execAsync("BEGIN TRANSACTION");

		await transaction();

		// Commit transaction
		await db.execAsync("COMMIT");
	} catch (err) {
		await db.execAsync("ROLLBACK");
		throw err;
	}
}
