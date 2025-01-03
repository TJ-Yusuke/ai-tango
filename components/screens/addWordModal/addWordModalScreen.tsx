import {
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";
import { Chip, TextInput, Button } from "react-native-paper";
import { useAddWordModalScreenViewModel } from "./addWordModalScreenViewModel";
import { useEffect } from "react";
import { useRouter } from "expo-router";

export const AddWordModalScreen = () => {
  const {
    state: {
      wordText,
      translatedWordText,
      translatedWordsList,
      wordTextValidationError,
      translatedWordTextValidationError,
      isDone,
    },
    action: {
      onWordTextChange,
      onTranslatedWordTextChange,
      addTranslatedWordsList,
      deleteTranslatedWordItemFromList,
      registerWord,
    },
  } = useAddWordModalScreenViewModel();

  const router = useRouter();

  useEffect(() => {
    if (isDone) {
      router.dismiss();
    }
  }, [isDone, router]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Text style={styles.title}>単語追加画面</Text>
      <TextInput
        label="English"
        mode="outlined"
        value={wordText}
        onChangeText={(text) => onWordTextChange(text)}
        error={wordTextValidationError.length > 0}
      />
      <TextInput
        label="Japanese"
        mode="outlined"
        value={translatedWordText}
        onChangeText={(text) => onTranslatedWordTextChange(text)}
        returnKeyType="done"
        onSubmitEditing={() => {
          addTranslatedWordsList();
        }}
        submitBehavior="blurAndSubmit"
        error={translatedWordTextValidationError.length > 0}
      />
      {translatedWordTextValidationError.length > 0 && (
        <Text>{translatedWordTextValidationError}</Text>
      )}
      <View style={styles.chipContainer}>
        {translatedWordsList.map((value, i) => (
          <Chip
            style={styles.chip}
            mode="outlined"
            onClose={() => deleteTranslatedWordItemFromList(value)}
            key={i}
          >
            {value}
          </Chip>
        ))}
      </View>
      <Button
        icon="plus"
        mode="contained"
        disabled={
          wordText.length === 0 ||
          translatedWordsList.length === 0 ||
          (wordTextValidationError.length > 0 &&
            translatedWordTextValidationError.length > 0)
        }
        onPress={() => registerWord()}
      >
        追加する
      </Button>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  title: {
    paddingTop: 8,
    fontSize: 20,
    fontWeight: "bold",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10, // 必要に応じてマージンを調整
  },
  chip: {
    marginHorizontal: 4,
    marginVertical: 2,
  },
});
