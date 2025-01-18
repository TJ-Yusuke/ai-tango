import { SQLiteDatabase } from "expo-sqlite";
import { Word } from "../models/word";

export type registerWordParam = {
  wordText: string;
  translatedWordsList: string[];
};

export async function registerWord(
  db: SQLiteDatabase,
  param: registerWordParam,
): Promise<void> {
  await db.runAsync(
    "INSERT INTO words (text, translated_text_json) VALUES (?, ?)",
    param.wordText,
    JSON.stringify(param.translatedWordsList),
  );
}

export async function isWordAlreadyExists(
  db: SQLiteDatabase,
  word: string,
): Promise<boolean> {
  const result = await db.getAllAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM words WHERE text = ?",
    [word],
  );
  return result[0]?.count > 0;
}

export async function getAllWords(db: SQLiteDatabase): Promise<Word[]> {
  return await db.getAllAsync<Word>(
    "SELECT text, translated_text_json as translatedTextJson FROM words",
  );
}

export async function deleteWordByText(db: SQLiteDatabase, word: string) {
  await db.runAsync("DELETE FROM words WHERE text = $value", {
    $value: word,
  });
}
