import { StyleSheet, View, Text } from "react-native";

export const AddWordModalScreen = () => {
  return (
    <View style={styles.container}>
      <Text>単語追加画面</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
