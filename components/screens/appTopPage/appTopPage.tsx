import React from "react";
import { View, StyleSheet } from "react-native";
import { FAB } from "react-native-paper";

const AppTopPage = () => {
  return (
    <View style={styles.container}>
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
    alignItems: "center",
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
