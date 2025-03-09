import { View, Text, StyleSheet } from 'react-native';

export default function patients() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Patients Screen</Text>
      <Text style={styles.subtitle}>This is where patients will be listed.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold" },
  subtitle: { fontSize: 18, color: "gray" },
});
