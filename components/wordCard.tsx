import { Word } from "@/models/word";
import { useMemo } from "react";
import { Text, View, StyleSheet } from "react-native";

export const WordCard = ({ word }: { word: Word }) => {
  const translatedText = useMemo(() => {
    console.log(word.translatedTextJson);
    const textList = JSON.parse(word.translatedTextJson) as string[];
    return textList.join(", ");
  }, [word.translatedTextJson]);
  return (
    <View style={styles.card}>
      <Text style={styles.englishText}>{word.text}</Text>
      <Text style={styles.japaneseText}>{translatedText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
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
  englishText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 8,
  },
  japaneseText: {
    fontSize: 18,
    color: "#666666",
    marginBottom: 8,
  },
});
