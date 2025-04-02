import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";

export default function RegisterPatient() {
  const router = useRouter();

  const [form, setForm] = useState({
    id: "",
    name: "",
    dob: "",
    relativeName: "",
    relativePhone: "",
    phone: "",
    email: "",
    address: "",
  });
  const handleChange = (key: keyof typeof form, value: string) => {
    setForm({ ...form, [key]: value });
  };
  

  const handleSubmit = () => {
    if (!form.id || !form.name || !form.dob || !form.phone) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    console.log("Patient Registered:", form);
    Alert.alert("Success", "Patient Registered Successfully!");

    // Later, send this data to the backend
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register Patient</Text>

      <TextInput style={styles.input} placeholder="Government ID *" value={form.id} onChangeText={(text) => handleChange("id", text)} />
      <TextInput style={styles.input} placeholder="Full Name *" value={form.name} onChangeText={(text) => handleChange("name", text)} />
      <TextInput style={styles.input} placeholder="Date of Birth * (YYYY-MM-DD)" value={form.dob} onChangeText={(text) => handleChange("dob", text)} />
      <TextInput style={styles.input} placeholder="Relative Name" value={form.relativeName} onChangeText={(text) => handleChange("relativeName", text)} />
      <TextInput style={styles.input} placeholder="Relative Phone" keyboardType="phone-pad" value={form.relativePhone} onChangeText={(text) => handleChange("relativePhone", text)} />
      <TextInput style={styles.input} placeholder="Phone Number *" keyboardType="phone-pad" value={form.phone} onChangeText={(text) => handleChange("phone", text)} />
      <TextInput style={styles.input} placeholder="Email (Optional)" keyboardType="email-address" value={form.email} onChangeText={(text) => handleChange("email", text)} />
      <TextInput style={styles.input} placeholder="Address / GIS Location" value={form.address} onChangeText={(text) => handleChange("address", text)} />

      <Button title="Register Patient" onPress={handleSubmit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  input: { width: "100%", height: 50, borderWidth: 1, borderColor: "#ccc", paddingHorizontal: 10, marginBottom: 10, borderRadius: 8 },
});
