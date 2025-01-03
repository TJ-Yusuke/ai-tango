import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { FAB } from "react-native-paper";
import { useAppTopPageViewModel } from "./appTopPageViewModel";
import { WordCard } from "@/components/wordCard";
import { useRouter } from "expo-router";

const AppTopPage = () => {
  const {
    state: { words },
  } = useAppTopPageViewModel();

  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {words.map((word, i) => (
          <WordCard word={word} key={i} />
        ))}
      </ScrollView>
      <FAB
        style={styles.fab}
        icon="plus"
        color="white"
        onPress={() => router.push("/addWordModal")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
  },
  scrollView: {
    paddingTop: 8,
    flexGrow: 1,
  },
  fab: {
    position: "absolute",
    margin: 16,
    bottom: 56,
    right: 24,
    backgroundColor: "#4A90E2",
  },
  addWordModal: {
    backgroundColor: "white",
    padding: 20,
    marginHorizontal: 20,
  },
});

export default AppTopPage;
