import { Word } from "../models/word";
import { useMemo } from "react";
import { Text, View, StyleSheet } from "react-native";
import { IconButton } from "react-native-paper";

type WordCardProps = {
  word: Word;
  onDeleteClick: (wordText: string) => void;
};

export const WordCard = ({ word, onDeleteClick }: WordCardProps) => {
  const translatedText = useMemo(() => {
    console.log(word.translatedTextJson);
    const textList = JSON.parse(word.translatedTextJson) as string[];
    return textList.join(", ");
  }, [word.translatedTextJson]);

  return (
    <View style={styles.card}>
      <View style={styles.textContainer}>
        <Text style={styles.englishText}>{word.text}</Text>
        <Text style={styles.japaneseText}>{translatedText}</Text>
      </View>
      <IconButton
        icon="trash-can-outline"
        size={20}
        onPress={() => onDeleteClick(word.text)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    paddingRight: 4,
    marginHorizontal: 16,
    marginVertical: 8,
    // iOSのシャドウ
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    // Androidのシャドウ
    elevation: 4,
  },
  textContainer: {
    flex: 1,
  },
  englishText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 8,
  },
  japaneseText: {
    fontSize: 18,
    color: "#666666",
  },
});
