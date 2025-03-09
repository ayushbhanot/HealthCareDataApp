import { View, Text, Button, StyleSheet } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const getUserRole = async () => {
      const storedRole = await SecureStore.getItemAsync("userRole");
      setRole(storedRole);
    };
    getUserRole();
  }, []);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("userToken");
    await SecureStore.deleteItemAsync("refreshToken");
    await SecureStore.deleteItemAsync("userRole");
    router.replace("/LoginScreen");
  };

  return (
    <View style={styles.container}>
      {role === "admin" && (
        <View>
          <Text style={styles.title}>👑 Admin Dashboard</Text>
          <Text>Manage users, view analytics, and oversee patient records.</Text>
        </View>
      )}

      {role === "doctor" && (
        <View>
          <Text style={styles.title}>🩺 Doctor Dashboard</Text>
          <Text>View & update your assigned patients, exams, and history.</Text>
        </View>
      )}

      {role === "staff" && (
        <View>
          <Text style={styles.title}>🏥 Staff Dashboard</Text>
          <Text>Register new patients and update demographics.</Text>
        </View>
      )}

      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
});
