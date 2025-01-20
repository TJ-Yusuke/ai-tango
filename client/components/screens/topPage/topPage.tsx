import React from "react";
import { View, StyleSheet, Alert, FlatList } from "react-native";
import { AnimatedFAB, Button } from "react-native-paper";
import { useTopPageViewModel } from "./topPageViewModel";
import { WordCard } from "../../wordCard";
import { useRouter } from "expo-router";

const TopPage = () => {
  const {
    state: { words },
    action: { deleteWordByText },
  } = useTopPageViewModel();

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
        renderItem={({ item, index }) => {
          const isLastItem = index === words.length - 1;
          if (isLastItem) {
            return (
              <Button
                icon="plus"
                onPress={() => router.push("/addWordModal")}
                contentStyle={styles.addButtonContent} // ボタン全体のスタイル
                labelStyle={styles.addButtonLabel}
              >
                単語を追加する
              </Button>
            );
          }
          return (
            <WordCard
              word={item}
              onDeleteClick={(wordText) => openDeleteAlert(wordText)}
            />
          );
        }}
        onScroll={onScroll}
      />
      <AnimatedFAB
        icon="dumbbell"
        label="学習する"
        color="white"
        extended={isExtended}
        onPress={() => router.push("/learn")}
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
  addButtonContent: {
    height: 60, // ボタンの高さを大きく
    justifyContent: "center", // 縦方向の中央揃え
    marginBottom: 20,
  },
  addButtonLabel: {
    fontSize: 18, // フォントサイズを大きく
    fontWeight: "bold", // テキストを太字に
  },
});

export default TopPage;
