import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { FAB } from "react-native-paper";
import { useAppTopPageViewModel } from "./appTopPageViewModel";
import { WordCard } from "@/components/wordCard";

const AppTopPage = () => {
  const {
    state: { words },
    action: { addWord },
  } = useAppTopPageViewModel();

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
        onPress={() => console.log("FAB Pressed")} // ボタンが押された時の処理
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
    left: "50%", // 左から50%の位置
    bottom: 40,
    marginLeft: -28, // FABの幅の半分を引いて中央に配置
    backgroundColor: "#4A90E2",
  },
});

export default AppTopPage;
