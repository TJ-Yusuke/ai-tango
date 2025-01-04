import React from "react";
import { View, StyleSheet, ScrollView, Alert, FlatList } from "react-native";
import { AnimatedFAB } from "react-native-paper";
import { useAppTopPageViewModel } from "./appTopPageViewModel";
import { WordCard } from "@/components/wordCard";
import { useRouter } from "expo-router";

const AppTopPage = () => {
  const {
    state: { words },
    action: { deleteWordByText },
  } = useAppTopPageViewModel();

  const [isExtended, setIsExtended] = React.useState(true);

  const onScroll = ({
    nativeEvent,
  }: {
    nativeEvent: { contentOffset: { y: number } };
  }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

    setIsExtended(currentScrollPosition <= 0);
  };
  const animateFrom = "right";

  const router = useRouter();

  const openDeleteAlert = (text: string) => {
    Alert.alert(
      `「${text}」を削除しますか？`,
      "単語に関連する情報も削除されます",
      [
        {
          text: "Back",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteWordByText(text),
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.scrollView}
        data={words}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <WordCard
            word={item}
            onDeleteClick={(wordText) => openDeleteAlert(wordText)}
          />
        )}
        onScroll={onScroll}
      />
      <AnimatedFAB
        icon="dumbbell"
        label="学習する"
        color="white"
        extended={isExtended}
        onPress={() => console.log("Pressed")}
        animateFrom={animateFrom}
        iconMode="dynamic"
        style={[styles.fab]}
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
    right: 20,
    backgroundColor: "#3498db",
  },
  addWordModal: {
    backgroundColor: "white",
    padding: 20,
    marginHorizontal: 20,
  },
});

export default AppTopPage;
