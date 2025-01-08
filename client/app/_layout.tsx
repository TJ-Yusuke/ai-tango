import { migrateDbIfNeeded } from "../db/init";
import { router, Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { View } from "react-native";
import { IconButton, MD3LightTheme, PaperProvider } from "react-native-paper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import client, { trpc } from "../trpc";

const queryClient = new QueryClient();

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

function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <trpc.Provider client={client} queryClient={queryClient}>
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
              <Stack.Screen
                name="learn"
                options={{
                  title: "例文を解こう",
                  headerBackButtonDisplayMode: "minimal",
                  headerTintColor: "white",
                }}
              />
            </Stack>
          </PaperProvider>
        </SQLiteProvider>
      </trpc.Provider>
    </QueryClientProvider>
  );
}

export default RootLayout;
