import AppTopPage from "@/components/screens/appTopPage/appTopPage";
import { migrateDbIfNeeded } from "@/db/init";
import { SQLiteProvider } from "expo-sqlite";

export default function Index() {
  return (
    <SQLiteProvider databaseName="test.db" onInit={migrateDbIfNeeded}>
      <AppTopPage />
    </SQLiteProvider>
  );
}
