import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet, Image, TouchableOpacity} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { API_BASE_URL } from "@/constants/env";
import { LinearGradient } from "expo-linear-gradient";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        await SecureStore.setItemAsync("userToken", data.accessToken);
        await SecureStore.setItemAsync("refreshToken", data.refreshToken);
        await SecureStore.setItemAsync("userRole", data.user.role);
        router.replace("/"); // Redirect to Dashboard
      } else {
        Alert.alert("Login Failed", data.message || "Invalid credentials.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Try again.");
    }
  };
  

  return (
    <LinearGradient
      colors={['#240046', '#5a189a', '#9d4edd']} // Adjust gradient colors as desired
      style={styles.gradient}
    >
      <View style={styles.container}>
        <Image source={require("../assets/images/icon.png")} style={styles.logo} />
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#ccc"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#ccc"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    paddingTop: 200,
    
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#fff",
    paddingHorizontal: 10,
    marginBottom: 15,
    borderRadius: 8,
    color: "#fff",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#FF7F50", // Orange button color
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});