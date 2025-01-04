import { migrateDbIfNeeded } from "@/db/init";
import { router, Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { Button, View } from "react-native";
import { IconButton, MD3LightTheme, PaperProvider } from "react-native-paper";

const theme = {
  ...MD3LightTheme, // or MD3DarkTheme
  roundness: 2,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#3498db",
    secondary: "#f1c40f",
    tertiary: "#a1b2c3",
  },
};

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="test.db" onInit={migrateDbIfNeeded}>
      <PaperProvider theme={theme}>
        <Stack
          screenOptions={{
            headerTitleStyle: {
              fontWeight: "bold",
              color: "white",
              fontSize: 20,
            },
            headerStyle: {
              backgroundColor: "#3498db",
            },
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              title: "AIたんご帳",
              headerRight: () => (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <IconButton
                    icon="plus"
                    iconColor="white"
                    size={25}
                    style={{
                      marginTop: 0,
                    }}
                    onPress={() => router.push("/addWordModal")}
                  />
                </View>
              ),
            }}
          />
          <Stack.Screen
            name="addWordModal"
            options={{
              presentation: "modal",
              title: "単語を追加",
            }}
          />
        </Stack>
      </PaperProvider>
    </SQLiteProvider>
  );
}
