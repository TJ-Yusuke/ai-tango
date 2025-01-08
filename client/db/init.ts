import { SQLiteDatabase } from "expo-sqlite";

export const migrateDbIfNeeded = async (db: SQLiteDatabase): Promise<void> => {
  const DATABASE_VERSION = 1;
  let result = await db.getFirstAsync<{
    user_version: number;
  }>("PRAGMA user_version");

  if (result === null) {
    throw new Error("Failed to retrieve user version from the database.");
  }
  let currentDbVersion = result.user_version;

  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }

  console.log("Initializing database migration...");

  if (currentDbVersion === 0) {
    try {
      await db.execAsync(`
        CREATE TABLE words (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          text TEXT NOT NULL,
          translated_text_json TEXT NOT NULL
        );
      `);

      console.log("Database migration completed.");
    } catch (error) {
      console.error("Error during database migration:", error);
      throw error;
    }
  }
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
};
