import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";

export default function AddWordModal() {
  const [englishText, setEnglishText] = useState("");
  const [japaneseText, setJapaneseText] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>単語を追加</Text>
      <TextInput
        label="English"
        mode="outlined"
        value={englishText}
        onChangeText={(text) => setEnglishText(text)}
      />
      <TextInput
        label="Japanese"
        mode="outlined"
        value={japaneseText}
        onChangeText={(text) => setJapaneseText(text)}
      />
      <Button
        icon="plus"
        mode="contained"
        onPress={() => console.log("Pressed")}
        style={styles.registerButton}
      >
        登録する
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    paddingTop: 8,
    fontSize: 20,
    fontWeight: "bold",
  },
  registerButton: {
    marginTop: 8,
    width: 140,
  },
});
