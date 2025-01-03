import { migrateDbIfNeeded } from "@/db/init";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="test.db" onInit={migrateDbIfNeeded}>
      <Stack
        screenOptions={{
          headerTitleStyle: {
            fontWeight: "bold",
            color: "white",
            fontSize: 20,
          },
          headerStyle: {
            backgroundColor: "#4A90E2",
          },
        }}
      >
        <Stack.Screen name="index" options={{ title: "AIたんご帳" }} />
        <Stack.Screen
          name="addWordModal"
          options={{
            presentation: "modal",
            title: "単語を追加",
          }}
        />
      </Stack>
    </SQLiteProvider>
  );
}
