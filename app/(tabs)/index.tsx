import { View, Text, Button, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

export default function Dashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("userToken"); // Clear stored token
    router.replace("/LoginScreen"); // Redirect to login
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Healthcare Camp App</Text>
      <Text style={styles.subtitle}>This is the dashboard for Clinical Users</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 18, color: "gray", marginBottom: 20 },
});
