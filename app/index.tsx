import AppTopPage from "@/components/screens/appTopPage/appTopPage";
import { migrateDbIfNeeded } from "@/db/init";
import { SQLiteProvider } from "expo-sqlite";
import { PaperProvider, Portal } from "react-native-paper";

export default function Index() {
  return (
    <SQLiteProvider databaseName="test.db" onInit={migrateDbIfNeeded}>
      <PaperProvider>
        <AppTopPage />
      </PaperProvider>
    </SQLiteProvider>
  );
}
