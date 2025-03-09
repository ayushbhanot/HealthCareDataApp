import { View, Text, Button, StyleSheet, ActivityIndicator } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserRole = async () => {
      const storedRole = await SecureStore.getItemAsync("userRole");
      setRole(storedRole);
      setLoading(false);
    };
    getUserRole();
  }, []);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("userToken");
    await SecureStore.deleteItemAsync("refreshToken");
    await SecureStore.deleteItemAsync("userRole");
    router.replace("/LoginScreen");
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {role === "admin" && (
        <View style={styles.roleContainer}>
          <Text style={styles.title}>👑 Admin Dashboard</Text>
          <Text style={styles.subtitle}>Manage users, view analytics, and oversee patient records.</Text>
        </View>
      )}

      {role === "doctor" && (
        <View style={styles.roleContainer}>
          <Text style={styles.title}>🩺 Doctor Dashboard</Text>
          <Text style={styles.subtitle}>View & update your assigned patients, exams, and history.</Text>
        </View>
      )}

      {role === "staff" && (
        <View style={styles.roleContainer}>
          <Text style={styles.title}>🏥 Staff Dashboard</Text>
          <Text style={styles.subtitle}>Register new patients and update demographics.</Text>
        </View>
      )}

      {!role && <Text style={styles.errorText}>Error: No role found.</Text>}

      <View style={styles.logoutButton}>
        <Button title="Logout" onPress={handleLogout} color="red" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    padding: 20 
  },
  roleContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  title: { 
    fontSize: 28, 
    fontWeight: "bold", 
    marginBottom: 5 
  },
  subtitle: { 
    fontSize: 18, 
    color: "gray", 
    textAlign: "center", 
    marginHorizontal: 10 
  },
  errorText: {
    fontSize: 16,
    color: "red",
    fontWeight: "bold",
    marginTop: 20,
  },
  logoutButton: {
    marginTop: 20,
    width: "80%",
  },
});
