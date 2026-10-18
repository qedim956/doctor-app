import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { calcBmi } from "@clinic/domain";

export default function App() {
  const bmi = calcBmi(78, 172);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xəstə tətbiqi</Text>
      <Text>Domain paketindən BMI: {bmi.toFixed(1)}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8 },
  title: { fontSize: 22, fontWeight: "700" },
});