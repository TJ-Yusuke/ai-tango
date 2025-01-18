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
      debugBulkRegisterWord,
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
      <Text style={styles.title}>追加する単語を入力</Text>
      <Text style={styles.inputLabel}>English</Text>
      <TextInput
        mode="outlined"
        value={wordText}
        onChangeText={(text) => onWordTextChange(text)}
        error={wordTextValidationError.length > 0}
      />
      {wordTextValidationError.length > 0 && (
        <Text>{wordTextValidationError}</Text>
      )}
      <Text style={styles.inputLabel}>Japanese</Text>
      {translatedWordsList.length > 0 && (
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
      )}
      <TextInput
        mode="outlined"
        placeholder="改行で追加"
        value={translatedWordText}
        onChangeText={(text) => onTranslatedWordTextChange(text)}
        returnKeyType="done"
        onSubmitEditing={() => {
          addTranslatedWordsList();
        }}
        submitBehavior="submit"
        error={translatedWordTextValidationError.length > 0}
      />
      {translatedWordTextValidationError.length > 0 && (
        <Text>{translatedWordTextValidationError}</Text>
      )}
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
        style={styles.submitButton}
      >
        登録する
      </Button>
      {__DEV__ && (
        <Button onPress={() => debugBulkRegisterWord()}>デバッグ追加</Button>
      )}
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
  inputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 8,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  chip: {
    marginHorizontal: 4,
    marginVertical: 2,
  },
  submitButton: {
    marginVertical: 10,
  },
});
