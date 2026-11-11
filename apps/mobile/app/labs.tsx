import { Text, ScrollView, StyleSheet } from "react-native";

export default function LabsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.text}>Tezliklə burada analizlər olacaq</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, gap: 12 },
  text: { fontSize: 16, color: "#4A5A54" },
});
