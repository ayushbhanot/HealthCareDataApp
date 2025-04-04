import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Stack } from "expo-router";

export default function PatientDetailScreen() {
  const { id } = useLocalSearchParams();

  return (
    <>
      <Stack.Screen
        options={{
          title: "Patient Details", // will now appear under your Data Care header
        }}
      />
      <View style={styles.container}>
        <Text style={styles.title}>Patient Details</Text>
        <Text style={styles.text}>Patient ID: {id}</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b0d2e',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    color: '#fe7c3f',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  text: {
    color: '#ffffff',
    fontSize: 18,
  },
});
